#!/usr/bin/env node
/* gate-card.js — render a human DECISION CARD for Gate 1 or Gate 2 from the
 * acceptance artifacts (contract.md / evals.yaml / evidence-report.md).
 *
 * Purpose (acceptance-gate goal: cut human acceptance time >=50% WITHOUT cutting
 * quality): the two human gates are where the time is spent. This puts the few
 * things only a human can decide FIRST, in plain product language, collapses what
 * the machine already proved, and always shows reversibility — so the fast
 * decision is also a good one (anti-rubber-stamp). Presentation layer ONLY; it
 * reads artifacts the gate already produced and DECIDES NOTHING. The deterministic
 * hook + evidence remain the source of truth.
 *
 * Trust invariants (the card must NEVER make a bad/incomplete state look
 * approvable): a non-PASS/PENDING-JUDGMENT verdict renders a non-approvable state
 * with no sign-off affordance; "all machine checks passed" / "evidence complete"
 * are claimed only when actually true; every judgment item a human still owes
 * (incl. all T3 judgment items) is surfaced.
 *
 * Pipeline: EXTRACT (this script, deterministic) -> translate to plain product
 * language (an LLM step, see commands/acceptance-card.md) -> RENDER (this script).
 *
 * Usage:
 *   gate-card.js --root <repo> --slug <slug> [--gate 1|2] [--extract] [--plain <plain.json>]
 *   gate auto-detected from contract.status, else evidence-report.md presence.
 *   --extract : print the jargon-y bits a plain-language step should translate (JSON)
 *   --plain   : apply a plain.json overlay produced by the translate step
 *   default   : print the card HTML fragment to stdout
 */
'use strict';
const fs = require('fs');
const path = require('path');

const a = process.argv.slice(2);
const opt = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
const root = opt('--root') || '.';
const slug = opt('--slug');
const plainPath = opt('--plain');
const EXTRACT = a.includes('--extract');
let gate = opt('--gate');
if (!slug) { process.stderr.write('gate-card: --slug required\n'); process.exit(2); }
// slug must be a single safe path segment — no traversal / separators
if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) { process.stderr.write('gate-card: invalid --slug (expect one name, got "' + slug + '")\n'); process.exit(2); }

const MAX = 1024 * 1024; // cap artifact reads at 1MB (the card parses only small fields)
const read = p => { try { if (fs.statSync(p).size > MAX) { process.stderr.write('gate-card: ' + p + ' too large, skipped\n'); return ''; } return fs.readFileSync(p, 'utf8'); } catch (_) { return ''; } };
const dir = path.join(root, '_acceptance', slug);
const contract = read(path.join(dir, 'contract.md'));
const evalsT = read(path.join(dir, 'evals.yaml'));
const report = read(path.join(dir, 'evidence-report.md'));

let plain = null;
if (plainPath && fs.existsSync(plainPath)) {
  try { plain = JSON.parse(read(plainPath)); }
  catch (e) { process.stderr.write('gate-card: ignoring malformed --plain (' + e.message + ') — rendering without overlay\n'); plain = null; }
}

// ---- parsers ----
function frontmatter(t) { const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/); const o = {}; if (m) for (const l of m[1].split('\n')) { const mm = l.match(/^(\w+)\s*:\s*(.*)$/); if (mm) o[mm[1]] = mm[2].trim(); } return o; }
const clean = s => String(s == null ? '' : s).replace(/["']/g, '').replace(/\s*#.*$/, '').trim(); // strip quotes + trailing # comment (matches hook tolerance)
const unquote = s => String(s == null ? '' : s).replace(/^["']|["']$/g, '').trim();
// section: lines under an ATX heading `## <h>`; reset only on another level-2+ heading
// (so a leading "# guidance" comment inside a section is content, never a boundary).
function section(t, h) { const out = []; let inS = false; const re = new RegExp('^#{2,6}\\s+' + h + '\\b', 'i'); for (const l of t.split('\n')) { if (/^#{2,6}\s/.test(l)) inS = re.test(l); else if (inS) out.push(l); } return out; }
const cleanLines = arr => arr.filter(l => l.trim() && !/^\s*#/.test(l)); // drop blanks + markdown-comment lines
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const NEG_RE = /\bKHÔNG\b|\bkhông\b|\bkhong\b|\bNOT\b|reject|denied|\bdeny\b|từ chối|tu choi|\b0\s*(row|touch)\b|rỗng|\bn-a\b|\bbiên\b|\bbien\b|dưới ngưỡng|duoi nguong|just[- ]?below|should[- ]?not|không tăng|không ghi|không fire|không kích hoạt|suppress|absent|vắng/i;
const THRESHOLD_RE = /[≥≤]|[<>]=?|ngưỡng|nguong|threshold|\bbiên\b|\bbien\b|\b\d+\b|reach|at least|at most|exceed|tối thiểu|toi thieu|tối đa|toi da|\bdưới\b|\btrên\b/i;
// classify will/wont on the Then-clause only — reduces false "Sẽ KHÔNG" from an incidental "không" in Given/When.
const thenOf = g => { const m = String(g).split(/\bThen\b|\bthì\b/i); return m.length > 1 ? m[m.length - 1] : String(g); };

const cfm = frontmatter(contract);
const feature = cfm.feature || cfm.slug || slug;
const tier = clean(cfm.risk_tier);
const status = clean(cfm.status);
const oos = section(contract, 'Out of scope').filter(l => /^\s*-\s+\S/.test(l)).map(l => l.replace(/^\s*-\s+/, '').trim());

// auto-detect gate: prefer contract.status (the SKILL's source of truth), else report presence
if (!gate) {
  if (/^(implemented|verified|signed-off)$/i.test(status)) gate = '2';
  else if (/^(draft|approved)$/i.test(status)) gate = '1';
  else gate = report.trim() ? '2' : '1';
}

const STYLE = `<style>
.gc{font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#1f1f1d;line-height:1.5}
.gc .card{background:#fff;border:1px solid #e6e4de;border-radius:14px;padding:16px 18px}
.gc .h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px}
.gc .ft{font-size:16px;font-weight:600}.gc .sub{font-size:12px;color:#6c6a64;margin-top:2px}
.gc .chip{font-size:12px;font-weight:600;padding:4px 11px;border-radius:999px;white-space:nowrap}
.gc .amber{background:#FAEEDA;color:#633806}.gc .teal{background:#E1F5EE;color:#085041}.gc .coral{background:#FAECE7;color:#712B13}.gc .gray{background:#f1efe8;color:#444441}
.gc .lab{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#8a887f;margin:16px 0 8px;font-weight:600}
.gc .grp{border-radius:10px;padding:11px 14px;margin-bottom:8px}.gc .gdo{background:#E1F5EE}.gc .gnot{background:#f4f2ec}
.gc .li{font-size:14px;margin:0 0 6px;padding-left:17px;position:relative}.gc .li:last-child{margin-bottom:0}
.gc .li:before{content:"";position:absolute;left:1px;top:7px;width:7px;height:7px;border-radius:50%}
.gc .gdo .li{color:#085041}.gc .gdo .li:before{background:#1D9E75}.gc .gnot .li{color:#56544d}.gc .gnot .li:before{background:#b4b2a9}
.gc .item{background:#FAEEDA;border:1px solid #EF9F27;border-radius:10px;padding:11px 13px;margin-bottom:8px}
.gc .q{font-size:14px;font-weight:600;color:#412402;margin:0 0 3px}.gc .ai{font-size:12px;color:#854F0B;margin:0 0 9px}
.gc .flag{display:flex;gap:8px;font-size:13px;padding:8px 11px;border-radius:9px;margin-bottom:6px}
.gc .fwarn{background:#FAEEDA;color:#633806}.gc .finfo{background:#f4f2ec;color:#56544d}.gc .fok{background:#E1F5EE;color:#085041}.gc .fred{background:#FAECE7;color:#712B13}
.gc .mach{background:#f4f2ec;border-radius:9px;padding:11px 13px;font-size:13px;color:#56544d}.gc .mach b{color:#1f1f1d}
.gc .foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:16px;padding-top:12px;border-top:1px solid #e6e4de}
.gc .rev{font-size:12px;color:#9a988f}
.gc .btns{display:flex;gap:8px}
.gc .b{font-size:13px;padding:6px 14px;border-radius:8px;border:1px solid;background:transparent;cursor:pointer}
.gc .bn{border-color:#cfcdc4;color:#3f3e39}.gc .yes{background:#E1F5EE;border-color:#5DCAA5;color:#085041;font-weight:600}.gc .no{border-color:#F0997B;color:#993C1D}
</style>`;
const pl = plain || {};

// ================= GATE 1 =================
if (gate === '1') {
  const acs = []; const seen = {}; const dupIds = [];
  for (const l of section(contract, 'Criteria')) { const m = l.match(/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/); if (m) { if (seen[m[1]]) dupIds.push(m[1]); seen[m[1]] = 1; acs.push({ id: m[1], gwt: m[2].replace(/\(judgment\)/i, '').trim(), judgment: /\(judgment\)/i.test(m[2]) }); } }
  const evalList = []; { let cur = null; for (const l of evalsT.split('\n')) { const id = l.match(/^\s*-\s+id:\s*(.+)$/); if (id) { if (cur) evalList.push(cur); cur = { id: id[1].trim(), criterion: '', expected: '' }; continue; } if (!cur) continue; const c = l.match(/^\s*criterion:\s*(.+)$/); if (c) cur.criterion = unquote(c[1]); const e = l.match(/^\s*expected:\s*(.+)$/); if (e) cur.expected = unquote(e[1]); } if (cur) evalList.push(cur); }
  const evalsFor = id => evalList.filter(e => e.criterion === id);
  const willDo = acs.filter(x => !x.judgment && !NEG_RE.test(thenOf(x.gwt)));
  const wontDo = acs.filter(x => !x.judgment && NEG_RE.test(thenOf(x.gwt)));
  const judgmentACs = acs.filter(x => x.judgment);
  const covGaps = acs.filter(x => !x.judgment && THRESHOLD_RE.test(x.gwt) && !evalsFor(x.id).some(e => NEG_RE.test(e.expected))).map(x => x.id);

  if (EXTRACT) { process.stdout.write(JSON.stringify({ gate: 1, feature, tier, will_do: willDo.map(x => ({ id: x.id, gwt: x.gwt })), wont_do: wontDo.map(x => ({ id: x.id, gwt: x.gwt })), scope: oos }, null, 2)); process.exit(0); }
  const featurePlain = pl.feature_plain || feature;
  const pmap = (arr, id) => (((arr || []).find(x => x.id === id)) || {}).p;
  const willText = x => pmap(pl.will_do, x.id) || x.gwt;
  const wontText = x => pmap(pl.wont_do, x.id) || x.gwt;
  const scopePlain = pl.scope_plain || oos.join(' · ');

  const P = [STYLE, `<div class="gc"><div class="card">
<div class="h"><div><div class="ft">${esc(featurePlain)}</div><div class="sub">Cổng 1 · duyệt tiêu chí TRƯỚC khi code · ~5 phút${tier === 'T3' ? ' · tier T3 (đụng critical)' : ''}</div></div><span class="chip amber">duyệt tiêu chí</span></div>`];
  if (willDo.length) P.push(`<div class="lab">Hệ thống SẼ làm</div><div class="grp gdo">${willDo.map(x => `<p class="li">${esc(willText(x))}</p>`).join('')}</div>`);
  const notItems = wontDo.map(x => esc(wontText(x))).concat(oos.length ? ['Hoãn/cắt: ' + esc(scopePlain)] : []);
  if (notItems.length) P.push(`<div class="lab">Sẽ KHÔNG làm / sẽ chặn</div><div class="grp gnot">${notItems.map(t => `<p class="li">${t}</p>`).join('')}</div>`);
  const flags = [];
  for (const id of covGaps) flags.push(['fwarn', `${id} có ngưỡng/biên nhưng chưa có ca "dưới ngưỡng → KHÔNG xảy ra" — thêm 1 ca chặn ngay sẽ rẻ hơn nhiều so với phát hiện sau.`]);
  if (dupIds.length) flags.push(['fwarn', `Trùng mã tiêu chí: ${esc([...new Set(dupIds)].join(', '))} — mapping eval mơ hồ, đổi mã trước khi duyệt.`]);
  for (const j of judgmentACs) flags.push(['finfo', `${j.id} cần MẮT bạn chấm sau khi code (việc người, máy không chấm được).`]);
  if (tier === 'T3') flags.push(['finfo', 'Đụng phần nhạy cảm → tier T3, duyệt kỹ phần "sẽ KHÔNG làm".']);
  if (flags.length) P.push(`<div class="lab">Cần chú ý trước khi duyệt</div>${flags.map(([c, t]) => `<div class="flag ${c}">${t}</div>`).join('')}`);
  P.push(`<div class="foot"><span class="rev">↻ Sửa 1 dòng tiêu chí GIỜ rẻ hơn 10× phát hiện sai sau khi code.</span><div class="btns"><button class="b no">Sửa lại</button><button class="b yes">Duyệt, cho code</button></div></div>
</div></div>`);
  process.stdout.write(P.join('\n'));
  process.exit(0);
}

// ================= GATE 2 =================
const rfm = frontmatter(report);
const verdict = clean(rfm.verdict).toUpperCase();
const reason = unquote(rfm.reason);
const approvable = verdict === 'PASS' || verdict === 'PENDING-JUDGMENT';

const critText = {}; for (const l of section(contract, 'Criteria')) { const m = l.match(/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/); if (m && !critText[m[1]]) critText[m[1]] = m[2].replace(/\(judgment\)/i, '').trim(); }

// per-eval rows — tolerate any non-pipe cell content (e.g. "N/A", "PASS*")
const rows = [];
for (const l of report.split('\n')) { const m = l.match(/^\|\s*(E\w+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/); if (m && m[1] !== 'Eval') rows.push({ id: m[1], crit: m[2].trim(), exec: m[3].trim().toLowerCase(), verdict: m[4].trim().toUpperCase() }); }

// evidence blocks — skip YAML block scalars (output: |) and only accept allow-listed keys,
// so a log excerpt line like "human_override: ..." or "baseline: green" inside output can't
// drop a real decision or inflate the regression counts.
const FIELDS = ['run_id', 'exit_code', 'baseline', 'verifier', 'verified_at', 'judged_by', 'verdict', 'rationale', 'human_override', 'screenshot', 'pass_rate', 'reason'];
const evid = {};
{ let cur = null; let skip = -1; for (const raw of report.split('\n')) {
    if (/^#{1,6}\s/.test(raw)) { cur = null; skip = -1; continue; }
    const em = raw.match(/^-\s+eval:\s*(\S+)/); if (em) { cur = em[1]; evid[cur] = {}; skip = -1; continue; }
    if (!cur) continue;
    if (skip >= 0) { if (raw.trim() === '') continue; if (raw.match(/^(\s*)/)[1].length > skip) continue; skip = -1; }
    const fm = raw.match(/^(\s*)(\w+):\s*(.*)$/); if (!fm) continue;
    const indent = fm[1].length, key = fm[2], val = fm[3].trim();
    if (/^[|>]/.test(val)) { skip = indent; if (FIELDS.indexOf(key) >= 0) evid[cur][key] = ''; continue; } // block scalar → skip body
    if (FIELDS.indexOf(key) < 0) continue;
    evid[cur][key] = val;
} }
const hasOverride = id => { const v = evid[id] && evid[id].human_override; return !!(v && v.trim() && !/^#|^<|^\{\{/.test(v.trim())); };

// decisions the human still owes: any UNCERTAIN row, plus EVERY judgment row on T3
// (T3 requires a human verdict on each judgment item — matches the hook), minus those overridden.
const decById = {};
for (const r of rows) {
  const owed = r.verdict === 'UNCERTAIN' || (tier === 'T3' && r.exec === 'judgment');
  if (owed && !hasOverride(r.id)) decById[r.id] = { id: r.id, q: critText[r.crit] || (evid[r.id] && evid[r.id].rationale) || r.crit, why: evid[r.id] && evid[r.id].rationale };
}
const decisions = Object.values(decById);
const machineRows = rows.filter(r => r.exec === 'test' || r.exec === 'script' || r.exec === 'ui-check');
const machinePass = machineRows.filter(r => r.verdict === 'PASS').length;
const allPass = machineRows.length > 0 && machinePass === machineRows.length;
const red = Object.values(evid).filter(e => e.baseline === 'red').length;
const green = Object.values(evid).filter(e => e.baseline === 'green').length;
const evComplete = machineRows.length > 0 && machineRows.every(r => { const e = evid[r.id] || {}; return e.run_id && e.run_id.length >= 4 && e.exit_code === '0' && e.verifier; });

if (EXTRACT) { process.stdout.write(JSON.stringify({ gate: 2, feature, tier, verdict, approvable, decisions: decisions.map(d => ({ id: d.id, gwt: d.q, rationale: d.why })), scope: oos, analyst: '' }, null, 2)); process.exit(0); }

const featurePlain = pl.feature_plain || feature;
const plainDec = id => ((pl.decisions && pl.decisions.find(x => x.id === id)) || {}).q;
const scopePlain = pl.scope_plain || oos.join(' · ');
const P = [STYLE];

// --- non-approvable: REJECT / BLOCKED / unknown — no sign-off affordance, no green reassurance ---
if (!approvable) {
  const ch = verdict === 'REJECT' ? { t: 'có eval fail — trả lại code', c: 'coral' } : verdict === 'BLOCKED' ? { t: 'không chạy được — chưa thể ký', c: 'coral' } : { t: 'verdict không xác định — không ký', c: 'gray' };
  const failed = machineRows.filter(r => r.verdict !== 'PASS').map(r => r.id + (critText[r.crit] ? ' (' + r.crit + ')' : ''));
  const notes = [];
  if (verdict === 'REJECT') notes.push(['fred', (failed.length ? 'Eval chưa đạt: ' + esc(failed.join(', ')) + ' — ' : '') + 'quay lại sửa code, chưa ký.']);
  else if (verdict === 'BLOCKED') notes.push(['fred', 'Không chạy được' + (reason ? ': ' + esc(reason) : '') + ' — sửa môi trường rồi chạy lại, chưa ký.']);
  else notes.push(['fred', 'Verdict "' + esc(verdict || '—') + '" không phải PASS/PENDING-JUDGMENT — không ký ở thẻ này.']);
  P.push(`<div class="gc"><div class="card">
<div class="h"><div><div class="ft">${esc(featurePlain)}</div><div class="sub">Cổng 2 · ${tier === 'T3' ? 'tier T3 · ' : ''}CHƯA ký được</div></div><span class="chip ${ch.c}">${esc(ch.t)}</span></div>
<div class="lab">Vì sao chưa ký được</div>${notes.map(([c, t]) => `<div class="flag ${c}">${t}</div>`).join('')}
<div class="foot"><span class="rev">↻ Trả lại → quay về code; trạng thái này không có nút ký.</span><div class="btns"><button class="b no">Quay về code</button></div></div>
</div></div>`);
  process.stdout.write(P.join('\n'));
  process.exit(0);
}

// --- approvable: PASS / PENDING-JUDGMENT ---
const chip = verdict === 'PASS' ? { t: 'máy đã xong — ký nhanh', c: 'teal' } : { t: 'cần bạn quyết', c: 'amber' };
P.push(`<div class="gc"><div class="card">
<div class="h"><div><div class="ft">${esc(featurePlain)}</div><div class="sub">Cổng 2 · ký duyệt · ~5 phút${tier === 'T3' ? ' · tier T3 (đụng critical)' : ''}</div></div><span class="chip ${chip.c}">${esc(chip.t)}</span></div>`);
P.push(`<a href="evidence-page.html" style="display:flex;justify-content:space-between;align-items:center;gap:10px;background:#E6F1FB;border:1px solid #B5D4F4;border-radius:10px;padding:9px 13px;margin:11px 0 2px;text-decoration:none;color:#0C447C;font-size:13px"><b>Bằng chứng đầy đủ — ảnh chụp + chạy thật</b><span style="font-size:12px;color:#185FA5;white-space:nowrap">đã mở trong trình duyệt</span></a>`);
const yourCount = decisions.length + (oos.length ? 1 : 0);
if (yourCount) {
  P.push(`<div class="lab">Việc chỉ mình bạn quyết được — ${yourCount} việc</div>`);
  for (const d of decisions) P.push(`<div class="item"><p class="q">${esc(plainDec(d.id) || d.q)}</p><p class="ai">Máy: chưa chắc${d.why ? ' — ' + esc(d.why) : ' (cần mắt người).'}</p><div class="btns"><button class="b bn">Đạt</button><button class="b no">Chưa đạt</button></div></div>`);
  if (oos.length) P.push(`<div class="item"><p class="q">Xác nhận các phần đã cắt/hoãn ngoài phạm vi:</p><p class="ai">${esc(scopePlain)}</p><div class="btns"><button class="b bn">Đồng ý cắt</button><button class="b no">Không, kéo vào</button></div></div>`);
}
const flags = [];
{ const analyst = cleanLines(section(report, 'Analyst')).join(' ').trim(); if (analyst && !/^none/i.test(analyst) && !/^\{\{/.test(analyst)) flags.push(['fred', esc(pl.analyst_plain || analyst)]); }
{ const varr = cleanLines(section(report, 'Variance')).join(' ').trim(); if (varr && !/^none/i.test(varr) && !/^\{\{/.test(varr)) flags.push(['fred', 'Có eval ngẫu nhiên (pass-rate hỗn hợp) — ' + esc(varr)]); }
if (tier === 'T3') flags.push(['fok', 'Đụng phần nhạy cảm → tier T3, đúng là cần bạn duyệt kỹ.']);
if (evComplete) flags.push(['fok', 'Cổng chạy thật, bằng chứng máy đầy đủ (run_id · exit 0 · verifier).']);
else flags.push(['fwarn', 'Bằng chứng máy CHƯA đủ trường (run_id · exit 0 · verifier) — kiểm trước khi ký.']);
P.push(`<div class="lab">Lưu ý trước khi ký</div>${flags.map(([c, t]) => `<div class="flag ${c}">${t}</div>`).join('')}`);
P.push(`<details style="margin-top:14px"><summary style="font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#8a887f;font-weight:600;cursor:pointer">Máy đã lo (liếc qua, không cần làm gì)</summary>`);
if (machineRows.length === 0) P.push(`<div class="mach" style="margin-top:8px">Không có phép kiểm máy tự động — feature này toàn judgment do người chấm.</div>`);
else if (allPass) P.push(`<div class="mach" style="margin-top:8px"><b>${machinePass}/${machineRows.length} phép kiểm máy đều đạt</b>${red ? ` · ${red} thật sự mới (chạy code cũ là hỏng → đúng là test feature)` : ''}${green ? ` · ${green} canh hồi quy` : ''}${evComplete ? ' · bằng chứng đủ, không lỗi.' : '.'}</div>`);
else P.push(`<div class="flag fred" style="margin-top:8px"><b>${machinePass}/${machineRows.length} phép kiểm máy đạt · ${machineRows.length - machinePass} CHƯA đạt</b> — xem lại trước khi ký.</div>`);
P.push(`</details>`);
P.push(`<div class="foot"><span class="rev">↻ Đảo ngược dễ: trả lại → quay về code, không mất gì.</span><div class="btns"><button class="b no">Trả lại</button><button class="b yes">Ký duyệt</button></div></div>
</div></div>`);
process.stdout.write(P.join('\n'));
