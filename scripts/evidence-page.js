#!/usr/bin/env node
'use strict';
/* evidence-page.js — render a full, human-inspectable EVIDENCE PAGE (Skill-Creator
 * style) from _acceptance/<slug>/evidence-report.md, so a human at Gate 2 can SEE
 * the artifacts (screenshots, real output) instead of trusting a verdict table.
 *
 * Self-contained static HTML (file:// openable, zero deps, no CDN, no server).
 * Per eval it shows: verifier + run_id + exit + verified_at, the real output
 * excerpt, the screenshot(s) — a CSS slideshow when an eval has multiple frames
 * (evidence/<evalId>-*.png), degrading to a single image / "no screenshot" — judge
 * rationale, and the human_override line. Plus the non-discriminating Analyst
 * note, Variance, Iterations, the Gate-2 checklist, and confirmed review findings.
 *
 * Presentation ONLY — decides nothing; evidence-report.md + the hook stay the
 * source of truth. Image src are RELATIVE (the page sits next to evidence/), so
 * the real PNGs render in a browser without base64 bloat.
 *
 * Từ hồ sơ trang-ho-so-mot-viec (hàng X2) trang là TRANG HỒ SƠ một việc: dải một phút (chín ô +
 * một dòng tầng chủ kho) rồi các mục gập — vì sao làm · đã hứa · thiết kế · quyết định · bằng chứng
 * (phần trang bằng chứng cũ, giữ nguyên) · tài nguyên · giới hạn và ngoài hợp đồng · giao · giá trị.
 * Mọi ô rút từ vật qua scripts/ho-so-tom-tat.cjs — cùng hàm khối dữ liệu lộ trình bản 2 gọi.
 *
 * Usage: evidence-page.js --root <repo> --slug <slug>
 *   writes _acceptance/<slug>/evidence-page.html and prints its absolute path.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const HS = require(path.join(__dirname, 'ho-so-tom-tat.cjs'));

const a = process.argv.slice(2);
const opt = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
const root = opt('--root') || '.';
const slug = opt('--slug');
if (!slug || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
  process.stderr.write('evidence-page: --slug <name> required (single path segment)\n');
  process.exit(2);
}
const dir = path.join(root, '_acceptance', slug);
const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return ''; } };
const report = read(path.join(dir, 'evidence-report.md'));
if (!report.trim()) { process.stderr.write('evidence-page: no evidence-report.md at ' + dir + '\n'); process.exit(2); }
const contract = read(path.join(dir, 'contract.md'));
const findings = read(path.join(dir, 'review-findings.md'));

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clean = s => String(s == null ? '' : s).replace(/["']/g, '').replace(/\s*#.*$/, '').trim();

function frontmatter(t) { const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/); const o = {}; if (m) for (const l of m[1].split('\n')) { const mm = l.match(/^(\w+)\s*:\s*(.*)$/); if (mm) o[mm[1]] = mm[2].trim(); } return o; }
// Ranh giới section: dùng chung bảng marker của lib/md-section.cjs (một nguồn).
const { section } = require(path.join(__dirname, '..', 'lib', 'md-section.cjs'));
// Dòng criterion: MỘT bộ đọc — tieuChiCua của scripts/ho-so-tom-tat.cjs (parseACBlock của
// lib/ac-line.cjs bên trong). Bảng eval và mục «Đã hứa» của trang hồ sơ đọc cùng hàm, nên không thể
// thấy hai tập tiêu chí khác nhau trên cùng một trang.
const cleanLines = arr => arr.filter(l => l.trim() && !/^\s*#/.test(l));

const rfm = frontmatter(report), cfm = frontmatter(contract);
const feature = HS.boNgoacNgoai(cfm.feature || rfm.feature_slug || slug);
const tier = clean(cfm.risk_tier);
const verdict = clean(rfm.verdict).toUpperCase();
const verifiedBy = (rfm.verified_by || '').trim();
const signoff = clean(rfm.human_signoff);
const enforcement = clean(rfm.enforcement_mode);
const bypass = clean(rfm.bypass_used).toLowerCase();
const reason = (rfm.reason || '').replace(/^["']|["']$/g, '').trim();

// criteria text from contract — qua parseAC (lib/ac-line.cjs), KHÔNG khuôn riêng.
// Khuôn cũ ở đây là bản sao thứ BA và hẹp nhất trong ba (bullet phải là `-`, dấu
// tách phải là `:`), nên nó rụng nhiều hơn cả eval-coverage-lint: một nhãn chen
// giữa id và dấu hai chấm (`- AC-14 **(cross-layer)**: …`) không khớp, và dòng 170
// khi đó in MỖI cái id trần. Người ký Cổng 2 nhìn thấy "AC-14" mà không thấy nó
// đòi gì — mất đúng phần chữ để đối chiếu bằng chứng. parseAC cũng tự bỏ tag
// (judgment) nên `.replace()` tay ở đây không cần nữa (và nó giữ được code span,
// thứ replace thô làm hỏng).
const critText = {};
for (const p of HS.tieuChiCua(contract)) { if (!critText[p.id]) critText[p.id] = p.cau; }

// per-eval summary table rows
const rows = [];
for (const l of report.split('\n')) { const m = l.match(/^\|\s*(E\w+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/); if (m && m[1] !== 'Eval' && !/^-+$/.test(m[2].trim())) rows.push({ id: m[1], crit: m[2].trim(), exec: m[3].trim().toLowerCase(), verdict: m[4].trim().toUpperCase() }); }

// per-eval evidence blocks (CAPTURE the output: | block content for display)
const SCALAR = ['run_id', 'exit_code', 'baseline', 'verifier', 'verified_at', 'screenshot', 'judged_by', 'verdict', 'rationale', 'human_override', 'runs', 'pass_rate', 'reason'];
const evid = {};
{
  let cur = null, capKey = null, capIndent = -1, cap = [];
  const flush = () => { if (cur && capKey) cur[capKey] = dedent(cap); capKey = null; capIndent = -1; cap = []; };
  for (const raw of section(report, 'Evidence')) {
    // Heading con (vd `### Lệnh suite (hồi quy)`) và khối KHÔNG-phải-eval (khuôn
    // SUITE-BLOCK-TEMPLATE mở đầu bằng `- cmd:`) đều ĐÓNG khối đang mở. Thiếu hai
    // nhánh này thì run_id/exit_code/verified_at của lệnh suite chảy vào eval CUỐI
    // và trang ký hiển thị mã chạy sai chủ — im lặng, không cổng nào đỏ.
    // gate-card.js và acceptance-gold.mjs đã có nhánh heading; đây là bộ đọc cuối.
    if (/^#{1,6}\s/.test(raw)) { flush(); cur = null; continue; } // LOP-DOC: heading
    const em = raw.match(/^-\s+eval:\s*(\S+)/);
    if (em) { flush(); cur = {}; evid[em[1]] = cur; continue; }
    if (/^-\s+\w+\s*:/.test(raw)) { flush(); cur = null; continue; } // LOP-DOC: bullet
    if (!cur) continue;
    if (capKey) {
      const ind = raw.match(/^(\s*)/)[1].length;
      if (raw.trim() === '' || ind > capIndent) { cap.push(raw); continue; }
      flush();
    }
    const fm = raw.match(/^(\s*)(\w+):\s*(.*)$/);
    if (!fm) continue;
    const indent = fm[1].length, key = fm[2], val = fm[3];
    if (/^[|>]/.test(val.trim())) { capKey = key; capIndent = indent; cap = []; continue; }
    if (SCALAR.indexOf(key) >= 0) cur[key] = val.trim();
  }
  flush();
}
function dedent(lines) { const nb = lines.filter(l => l.trim()); if (!nb.length) return ''; const min = Math.min.apply(null, nb.map(l => l.match(/^(\s*)/)[1].length)); return lines.map(l => l.slice(min)).join('\n').replace(/\s+$/, ''); }

// Khung ảnh mỗi eval: CÙNG bộ xét với thẻ Cổng Bằng chứng (scripts/anh-ho-so.cjs, hồ sơ anh-co-that-trong-ho-so) —
// chỉ ảnh là tệp có thật dưới evidence/ của hồ sơ, theo đường tương đối (trang nằm cạnh evidence/). Bộ xét vẫn chặn
// http(s):// / file:// / tuyệt đối / .. (một `screenshot:` sửa tay không thành đèn hiệu lúc mở trang hay dò tệp máy),
// và trả kèm các giá trị bị loại để trang nói vì sao thiếu ảnh. >1 khung → trình chiếu.
const anhHoSo = require(path.join(__dirname, 'anh-ho-so.cjs'));
const framesFor = (id, shot) => anhHoSo.khungAnh(dir, id, shot);

const analyst = cleanLines(section(report, 'Analyst')).join('\n').trim();
const variance = cleanLines(section(report, 'Variance')).join('\n').trim();
const iterations = section(report, 'Iterations').map(l => l.replace(/^#.*$/, '').trim()).filter(Boolean);
const checklist = report.split('\n').filter(l => /^\s*-\s*\[[ xX]\]/.test(l)).map(l => ({ done: /\[[xX]\]/.test(l), text: l.replace(/^\s*-\s*\[[ xX]\]\s*/, '').trim() }));
const reviewFindings = [];
{ let f = null; for (const l of findings.split('\n')) { const t = l.match(/^\s*-?\s*(?:title|finding)\s*:\s*(.+)$/i); if (t) { if (f) reviewFindings.push(f); f = { title: t[1].trim() }; continue; } if (!f) continue; const m = l.match(/^\s*(severity|file|detail|source|line)\s*:\s*(.+)$/i); if (m) f[m[1].toLowerCase()] = m[2].trim(); } if (f) reviewFindings.push(f); }

const VCOLOR = { PASS: 'pass', 'PENDING-JUDGMENT': 'pend', REJECT: 'rej', BLOCKED: 'rej', UNCERTAIN: 'pend', FAIL: 'rej' };
const vc = v => VCOLOR[(v || '').toUpperCase()] || 'neutral';

// ---- Hồ sơ (dải + mục) ----
// Chữ trạng thái = chữ ô của bản đồ sản phẩm (cùng hàm classify mà trang lộ trình dùng cho hàng), nên
// trang hồ sơ và hàng trên LO-TRINH.html không nói hai chuyện. Không nạp được bản đồ → trạng thái thô.
async function trangThaiCua() {
  // Bản đồ phân ô cần khuôn ô cơ hội và CHẾT TO khi vắng (process.exit, try không bắt được) — kho
  // chỉ chép scripts/ + lib/ thì trang vẫn phải ra: thiếu khuôn → trạng thái thô của hợp đồng.
  if (!fs.existsSync(path.join(__dirname, '..', 'skills', 'acceptance', 'references', 'opportunity-template.md'))) return null;
  try {
    const PM = await import(require('url').pathToFileURL(path.join(__dirname, 'product-map.mjs')).href);
    const TEN = Object.fromEntries(PM.SECTIONS);
    return TEN[PM.classify(dir, slug).key] || null;
  } catch (_) { return null; }
}
// Số PR: commit gộp đầu tiên «Merge pull request #N» trên đường từ mã đã chấm tới HEAD. Mọi lỗi git
// (không phải kho git, mã không có trong kho, clone nông) → null = «chưa gộp», stderr im.
function prCua(ma) {
  if (!ma) return null;
  const r = spawnSync('git', ['-C', root, 'log', '--merges', '--ancestry-path', '--reverse', '--format=%s', `${ma}..HEAD`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  if (r.status !== 0 || !r.stdout) return null;
  for (const l of r.stdout.split('\n')) { const m = l.match(/^Merge pull request #(\d+)\b/); if (m) return m[1]; }
  return null;
}
const NHAN_O = { da_giao: 'Đã giao gì', vi_sao: 'Vì sao', trang_thai: 'Trạng thái', ngay: 'Ngày', production: 'Đã lên production chưa', do_gi: 'Sẽ đo gì, khi nào', ket_qua: 'Kết quả', chua_lam: 'Chưa làm gì', ai_quyet: 'Ai quyết' };
const so = n => (n == null ? null : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
const chuaCo = tep => `<span class="vang">chưa có — ${esc(tep)}</span>`;

(async () => {
const TT = await trangThaiCua();
const H = HS.tomTatHoSo(dir, { trangThai: TT });
const M = H.dai.moi_nguoi, C = H.dai.chu_kho, CT = H.chiTiet;
const P = [];
P.push(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hồ sơ · ${esc(slug)}</title>
<style>
:root{--bg:#faf9f6;--card:#fff;--bd:#e6e4de;--ink:#1f1f1d;--mut:#6c6a64;--hint:#9a988f}
*{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink);margin:0;line-height:1.5;font-size:15px}
.wrap{max-width:920px;margin:0 auto;padding:24px 20px 64px}
h1{font-size:20px;margin:0 0 2px}h2{font-size:15px;margin:30px 0 10px;letter-spacing:.02em}
.sub{font-size:13px;color:var(--mut)}
.badge{display:inline-block;font-size:12px;font-weight:600;padding:3px 11px;border-radius:999px;vertical-align:middle}
.pass{background:#E1F5EE;color:#085041}.pend{background:#FAEEDA;color:#633806}.rej{background:#FAECE7;color:#712B13}.neutral{background:#f1efe8;color:#444441}
.card{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:14px 16px;margin-bottom:12px}
.meta{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:13px;color:var(--mut);margin-top:6px}
.meta b{color:var(--ink);font-weight:600}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:8px 9px;border-bottom:1px solid var(--bd)}th{color:var(--mut);font-weight:600;font-size:12px}
td a{color:#185FA5;text-decoration:none}.mono{font-family:ui-monospace,Menlo,monospace;font-size:12px}
.eval{scroll-margin-top:14px}.eval h3{font-size:14px;margin:0 0 4px}.eval .crit{font-size:13px;color:var(--mut);margin:0 0 8px}
pre.out{background:#1f1f1d;color:#e8e6df;border-radius:8px;padding:11px 13px;overflow:auto;max-height:280px;font-size:12px;margin:8px 0}
.kv{font-size:12px;color:var(--mut);display:flex;flex-wrap:wrap;gap:4px 16px;margin:6px 0}.kv b{color:var(--ink)}
.shot img{display:block;max-width:100%;border:1px solid var(--bd);border-radius:8px}
.slide{position:relative}.slide .frame{position:absolute;inset:0;opacity:0;transition:opacity .35s}.slide .frame:first-child{position:relative}.slide .frame.on{opacity:1}
.slidebar{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--mut);margin-top:6px}
.btn{font-size:12px;padding:4px 11px;border:1px solid var(--bd);border-radius:7px;background:#fff;cursor:pointer}
.ov{background:#FAEEDA;color:#633806;border-radius:7px;padding:6px 10px;font-size:12px;display:inline-block}
.ovok{background:#E1F5EE;color:#085041}
.note{font-size:13px;color:var(--mut)}.flag{font-size:13px;border-radius:8px;padding:8px 11px;margin:6px 0}
.fred{background:#FAECE7;color:#712B13}.fok{background:#E1F5EE;color:#085041}
.foot{margin-top:30px;padding-top:14px;border-top:1px solid var(--bd);font-size:12px;color:var(--hint)}
ul.ck{list-style:none;padding:0;margin:0}ul.ck li{padding:5px 0;font-size:14px}ul.ck input{margin-right:8px}
.tl{border-left:2px solid var(--bd);padding-left:14px;margin:0}.tl li{font-size:13px;margin:0 0 6px;list-style:none}
.dai{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:14px 0 8px}
.o{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:8px 11px;min-width:0}
.o .hoi{font-size:11px;color:var(--mut);text-transform:none;letter-spacing:.02em}
.o .tra{font-size:13px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.vang{color:var(--hint);font-style:italic}
.chu-kho{font-size:12px;color:var(--mut);display:flex;flex-wrap:wrap;gap:4px 14px;margin:0 0 10px}.chu-kho b{color:var(--ink)}
details.muc{background:var(--card);border:1px solid var(--bd);border-radius:12px;margin:0 0 10px;padding:0 14px}
details.muc>summary{cursor:pointer;font-weight:600;font-size:14px;padding:11px 0}
details.muc[open]>summary{border-bottom:1px solid var(--bd);margin-bottom:10px}
details.muc .noi{padding:0 0 12px;font-size:13px}
.loc{display:flex;gap:6px;margin:0 0 8px}.loc .btn[aria-pressed="true"]{background:#1f1f1d;color:#fff}
.tl li[hidden]{display:none}
@media (max-width:720px){.dai{grid-template-columns:1fr}}
</style></head><body><div class="wrap">`);

// header
P.push(`<h1>${esc(feature)}</h1><div class="sub">Trang hồ sơ · <span class="mono">${esc(slug)}</span>${tier ? ' · tier ' + esc(tier) : ''}</div>`);
// dải một phút — chín ô theo đúng thứ tự khuôn, mỗi ô mang tên tệp nguồn
P.push(`<section class="dai" aria-label="Hồ sơ trong một phút">${HS.O_MOI_NGUOI.map(k => `<div class="o" data-o="${k}" data-nguon="${esc(H.nguon[k] || '')}"><div class="hoi">${esc(NHAN_O[k])}</div><div class="tra">${M[k] == null ? chuaCo(H.nguon[k] || '') : esc(M[k])}</div></div>`).join('')}</section>`);
const ck = (k, nhan, v) => `<span data-k="${k}">${nhan} <b>${C[k] == null ? chuaCo(H.nguon[k] || '') : esc(v)}</b></span>`;
P.push(`<div class="chu-kho" data-chu-kho>${[ck('tieu_chi', 'Tiêu chí', C.tieu_chi), ck('phep_do', 'Phép đo', C.phep_do), ck('luot_cham', 'Lượt chấm', C.luot_cham), ck('token', 'Token', so(C.token)), ck('quyet_dinh_may', 'Quyết định máy', C.quyet_dinh_may), ck('quyet_dinh_nguoi', 'người', C.quyet_dinh_nguoi), ck('ma', 'Mã', C.ma && C.ma.slice(0, 7))].join('')}${CT.soHong ? `<span class="vang" data-so-hong>${CT.soHong} dòng sổ không đọc được</span>` : ''}</div>`);
const muc = (id, ten, than) => `<details class="muc" id="${id}"><summary>${esc(ten)}</summary><div class="noi">${than}</div></details>`;
// Mục gập in bản ĐẦY ĐỦ của lý do (chiTiet.viSao) — trần 400 ký tự chỉ cho ô của dải và khối dữ liệu lộ trình
// (hồ sơ dai-tom-tat-dem-dung-vi-sao-tron).
P.push(muc('vi-sao', 'Vì sao làm', CT.viSao == null ? chuaCo(H.nguon.vi_sao || 'opportunity.md') : `<p>${esc(CT.viSao.doan)}</p>${CT.viSao.muc.length ? `<ul>${CT.viSao.muc.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`));
P.push(muc('da-hua', 'Đã hứa', CT.acs.length ? `<ol class="hua">${CT.acs.map(a => `<li data-ac="${esc(a.id)}"><b>${esc(a.id)}</b> — ${esc(a.cau)}</li>`).join('')}</ol>` : chuaCo('contract.md')));
P.push(muc('thiet-ke', 'Thiết kế', CT.designDoc ? (H.thieu.includes(CT.designDoc) ? chuaCo(CT.designDoc) : `<p class="mono" data-design-doc>${esc(CT.designDoc)}</p>`) : '<p class="vang">hợp đồng không khai design_doc</p>'));
P.push(muc('quyet-dinh', 'Quyết định', H.thieu.includes('decisions.jsonl') ? chuaCo('decisions.jsonl') : `<div class="loc" role="group" aria-label="Lọc quyết định"><button class="btn" data-loc="tat-ca" aria-pressed="true">Tất cả ${CT.quyetDinh.length}</button><button class="btn" data-loc="may" aria-pressed="false">Máy ${C.quyet_dinh_may}</button><button class="btn" data-loc="nguoi" aria-pressed="false">Người ${C.quyet_dinh_nguoi}</button></div><ol class="tl" data-dong-thoi-gian>${CT.quyetDinh.map(d => `<li data-loai="${d.nguoi ? 'nguoi' : 'may'}" data-id="${esc(d.id)}"><b>${esc((d.at || '').slice(0, 10) || '—')}</b> · ${d.nguoi ? 'Người' : 'Máy'}${d.ai ? ` (${esc(d.ai)})` : ''} · ${esc([d.loai, d.giai_doan].filter(Boolean).join(' · '))} — ${esc(d.cau || '')}${d.vi_sao ? `<div class="note">${esc(d.vi_sao)}</div>` : ''}</li>`).join('')}</ol>`));
P.push(`<details class="muc" id="bang-chung"><summary>Bằng chứng</summary><div class="noi">`);
P.push(`<div class="card" style="margin-top:12px"><span class="badge ${vc(verdict)}">${esc(verdict || '—')}</span>
<div class="meta"><span>Verified by: <b>${esc(verifiedBy || '—')}</b></span><span>Human signoff: <b>${signoff ? esc(signoff) : 'CHƯA ký'}</b></span>${enforcement ? `<span>enforcement: <b>${esc(enforcement)}</b></span>` : ''}${bypass === 'true' ? '<span class="badge rej">bypass_used</span>' : ''}${reason ? `<span>reason: <b>${esc(reason)}</b></span>` : ''}</div></div>`);

// eval table
P.push(`<h2>Các eval</h2><div class="card" style="padding:4px 8px"><table><thead><tr><th>Eval</th><th>Tiêu chí</th><th>Loại</th><th>Verdict</th><th>run_id</th><th>verified_at</th></tr></thead><tbody>`);
for (const r of rows) { const e = evid[r.id] || {}; P.push(`<tr><td><a href="#${esc(r.id)}">${esc(r.id)}</a></td><td>${esc(r.crit)}</td><td>${esc(r.exec)}</td><td><span class="badge ${vc(r.verdict)}">${esc(r.verdict)}</span></td><td class="mono">${esc(e.run_id || '—')}</td><td class="mono">${esc(e.verified_at || '—')}</td></tr>`); }
P.push(`</tbody></table></div>`);

// per-eval detail
P.push(`<h2>Chi tiết từng eval</h2>`);
for (const r of rows) {
  const e = evid[r.id] || {};
  P.push(`<div class="card eval" id="${esc(r.id)}"><h3><span class="badge ${vc(r.verdict)}">${esc(r.verdict)}</span> &nbsp;${esc(r.id)} · ${esc(r.exec)}</h3>${critText[r.crit] ? `<p class="crit">${esc(r.crit)}: ${esc(critText[r.crit])}</p>` : `<p class="crit">${esc(r.crit)}</p>`}`);
  const kv = [];
  if (e.run_id) kv.push(`run_id <b>${esc(e.run_id)}</b>`);
  if (e.exit_code != null) kv.push(`exit_code <b>${esc(e.exit_code)}</b>`);
  if (e.verifier) kv.push(`verifier <b class="mono">${esc(e.verifier)}</b>`);
  if (e.verified_at) kv.push(`verified_at <b>${esc(e.verified_at)}</b>`);
  if (e.baseline) kv.push(`baseline <b>${esc(e.baseline)}</b>`);
  if (e.pass_rate) kv.push(`pass_rate <b>${esc(e.pass_rate)}</b>`);
  if (e.judged_by) kv.push(`judged_by <b>${esc(e.judged_by)}</b>`);
  if (kv.length) P.push(`<div class="kv">${kv.map(x => '<span>' + x + '</span>').join('')}</div>`);
  if (e.rationale) P.push(`<p class="note"><b>Phán đoán:</b> ${esc(e.rationale)}</p>`);
  // screenshots / slideshow
  const khung = r.exec === 'ui-check' || e.screenshot ? framesFor(r.id, e.screenshot) : { frames: [], thieu: [] };
  const frames = khung.frames;
  for (const t of khung.thieu) P.push(`<div class="flag fred">Thiếu ảnh: <code>${esc(t.gia_tri)}</code> — ${esc(t.ly_do)}; thẻ không tính eval này là có ảnh.</div>`);
  if (frames.length === 1) {
    P.push(`<div class="shot"><img src="${esc(frames[0])}" alt="screenshot ${esc(r.id)}" loading="lazy"></div><div class="kv"><span>${esc(frames[0])}</span></div>`);
  } else if (frames.length > 1) {
    P.push(`<div class="shot slide" data-n="${frames.length}">${frames.map((f, i) => `<div class="frame"><img src="${esc(f)}" alt="frame ${i + 1}" loading="lazy"></div>`).join('')}</div><div class="slidebar"><button class="btn" data-toggle>⏸ Tạm dừng</button><span>${frames.length} frame · chạy như GIF</span></div>`);
  } else if (r.exec === 'ui-check' && !khung.thieu.length) {
    P.push(`<div class="flag fred">Không có screenshot — ui-check có thể đã downgrade sang judgment (không có browser).</div>`);
  }
  // output
  if (e.output) P.push(`<pre class="out">${esc(e.output)}</pre>`);
  // human_override
  if (r.exec === 'judgment' || e.judged_by) { const ov = e.human_override && e.human_override.trim(); P.push(`<div class="${ov ? 'ov ovok' : 'ov'}">human_override: ${ov ? esc(e.human_override) : 'CHƯA điền (việc của bạn ở Gate 2)'}</div>`); }
  P.push(`</div>`);
}

// analyst / variance
if (analyst && !/^none/i.test(analyst)) P.push(`<h2>Eval không phân biệt (Analyst)</h2><div class="flag fred">${esc(analyst)}</div>`);
if (variance && !/^none/i.test(variance)) P.push(`<h2>Variance (eval ngẫu nhiên)</h2><div class="flag fred">${esc(variance)}</div>`);

// review findings
if (reviewFindings.length) {
  P.push(`<h2>Review findings (đã adversarial-verify)</h2><div class="card" style="padding:4px 8px"><table><thead><tr><th>Severity</th><th>Finding</th><th>Vị trí</th></tr></thead><tbody>`);
  for (const f of reviewFindings) P.push(`<tr><td><span class="badge ${/high|blocker|crit/i.test(f.severity || '') ? 'rej' : 'pend'}">${esc(f.severity || '—')}</span></td><td>${esc(f.title)}${f.detail ? `<div class="note">${esc(f.detail)}</div>` : ''}</td><td class="mono">${esc(f.file || '')}</td></tr>`);
  P.push(`</tbody></table></div>`);
}

// iterations
if (iterations.length) P.push(`<h2>Vòng verify</h2><ul class="tl">${iterations.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`);

// gate-2 checklist
if (checklist.length) P.push(`<h2>Checklist Cổng 2 (bạn)</h2><div class="card"><ul class="ck">${checklist.map((c, i) => `<li><input type="checkbox" id="ck${i}"${c.done ? ' checked' : ''}><label for="ck${i}">${esc(c.text)}</label></li>`).join('')}</ul><div class="note">Tick để theo dõi — chỉ lưu trong trình duyệt; quyết định THẬT vào human_signoff / human_override của report.</div></div>`);

P.push(`</div></details>`);
P.push(muc('tai-nguyen', 'Tài nguyên', H.thieu.includes('usage-report.md') ? chuaCo('usage-report.md') : `<table data-tai-nguyen><thead><tr><th>Khối</th><th>Tác tử</th><th>Token đầu ra</th></tr></thead><tbody>${CT.usage.map(u => `<tr><td>${esc(u.ten)}</td><td>${u.tac_tu}</td><td>${esc(so(u.token))}</td></tr>`).join('')}</tbody></table><p class="note">${C.luot_cham} lượt chấm · tổng ${esc(so(C.token))} token${CT.usageKhongDoc ? ` · ${CT.usageKhongDoc} khối không đọc được` : ''}</p>`));
P.push(muc('gioi-han', 'Giới hạn và ngoài hợp đồng', `<ul data-gioi-han>${[...CT.oos.map(x => `<li data-loai="ngoai">${esc(x)}</li>`), ...CT.known.map(x => `<li data-loai="gioi-han">${esc(x)}</li>`), ...(CT.gioiHanChuaDoc ? [`<li class="vang" data-loai="gioi-han-chua-doc">${esc(CT.gioiHanChuaDoc)}</li>`] : [])].join('') || '<li class="vang">không có</li>'}</ul>`));
const pr = prCua(C.ma);
P.push(muc('giao', 'Giao', `<div class="kv" data-giao><span>Mã đã chấm <b class="mono">${C.ma ? esc(C.ma) : chuaCo('evidence-report.md')}</b></span><span>Ngày ký <b>${esc(CT.giao.ngayKy || '—')}</b></span><span>${esc(M.ai_quyet || '')}</span><span data-pr>${pr ? `PR #${esc(pr)}` : 'chưa gộp'}</span></div><p class="note">${esc(M.production || '')}</p>`));
// Giá trị: ngưỡng ĐÃ KHAI ở ô cơ hội luôn hiện (vế hứa), cạnh bảng số đo của phiên nghiệm thu (vế đo) — bảng
// đó mang sẵn cột «Ngưỡng đã khai» chép nguyên văn; chưa có phiên thì mỗi ngưỡng ghi «chưa đo».
const nguongLi = CT.nguong.map(b => `<li data-nguong>${esc(b.label)}: ${esc(b.value)}${CT.uatBang ? '' : ' — <b>chưa đo</b>'}</li>`).join('');
const bangUat = CT.uatBang ? `<table data-gia-tri>${CT.uatBang.map((l, i) => `<tr>${l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => (i ? `<td>${esc(c.trim())}</td>` : `<th>${esc(c.trim())}</th>`)).join('')}</tr>`).join('')}</table>` : '';
P.push(muc('gia-tri', 'Giá trị', (CT.nguong.length ? `<ul data-gia-tri-nguong>${nguongLi}</ul>` : chuaCo('opportunity.md')) + bangUat));
P.push(`<div class="foot">Trang trình bày · KHÔNG quyết — <span class="mono">evidence-report.md</span> + hook là nguồn-sự-thật. Sinh từ run đã verify; ảnh/output gắn run_id.</div>
<script>
document.querySelectorAll('[data-loc]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-loc');document.querySelectorAll('[data-loc]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});document.querySelectorAll('[data-dong-thoi-gian] li').forEach(function(li){li.hidden=!(v==='tat-ca'||li.getAttribute('data-loai')===v);});});});
document.querySelectorAll('.slide').forEach(function(s){var fr=s.querySelectorAll('.frame');if(fr.length<2)return;var i=0;fr[0].classList.add('on');var adv=function(){fr[i].classList.remove('on');i=(i+1)%fr.length;fr[i].classList.add('on');};s._t=setInterval(adv,1600);var bar=s.nextElementSibling,b=bar?bar.querySelector('[data-toggle]'):null;if(b)b.addEventListener('click',function(){if(s._t){clearInterval(s._t);s._t=null;b.textContent='▶ Chạy';}else{s._t=setInterval(adv,1600);b.textContent='⏸ Tạm dừng';}});});
</script>
</div></body></html>`);

const outPath = path.join(dir, 'evidence-page.html');
fs.writeFileSync(outPath, P.join('\n'));
process.stdout.write(path.resolve(outPath) + '\n');
})().catch(e => { process.stderr.write('evidence-page: ' + (e && e.stack || e) + '\n'); process.exit(1); });
