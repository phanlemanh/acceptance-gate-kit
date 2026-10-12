// dai-tom-tat-dem-dung.test.mjs — hồ sơ dai-tom-tat-dem-dung-vi-sao-tron (gốc: _acceptance/dai-tom-tat-doc-dung,
// Ngoài-8 + Ngoài-9). Ô «chưa làm gì» của dải tóm tắt (scripts/ho-so-tom-tat.cjs) đếm đúng giới hạn ở mọi hình dạng
// khối gặp thật — đầu đoạn bọc dòng, đoạn dẫn, danh sách đánh số, gạch con, gạch tự mở «known-limits», khối ghim
// lại, «None.» — và nói «chưa đọc được» khi khối không theo khuôn; trang hồ sơ (scripts/evidence-page.js) in trọn
// «Vì sao làm». Ca DD-1..DD-6, DD-8; DD-7/DD-9 (dữ liệu thật sáu kho) ở dai-tom-tat-sau-kho.mjs, ngoài suite.
//
// Hồ sơ thử do mã sinh trong lượt: kho git tạm có ô cơ hội do CHÍNH `lo-trinh.mjs --mo-o` ghi (ca trang/khối),
// hoặc thư mục hồ sơ trơn (ca mô-đun). Khối ghim lại rút từ khối REPIN-TEMPLATE của SKILL feature-loop (đọc).
// Giá trị mong đợi viết sẵn trong ca, không rút từ đầu ra. Chiều đỏ: bản lành xanh trước, rồi CHÍNH hàm đo chạy
// trên bản sao cây (scripts lib skills commands feature-loop/skills) bị tiêm, ghim thông điệp hàm đo trả.
// Hồ sơ thử mang `status: implemented` (cùng lối dai-tom-tat.test.mjs — tệp ca không là bộ đọc trạng thái ký).
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'dai-tom-tat-dem-dung-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.DD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SL = 'hs';
const HS = kit => createRequire(import.meta.url)(path.join(kit, 'scripts', 'ho-so-tom-tat.cjs'));
const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);

// ── hồ sơ thử ─────────────────────────────────────────────────────────────
const hopDong = ({ notes = '', oos = ['Không làm a.', 'Không làm b.'], context = 'Bối cảnh.' }) =>
  `---\nschema_version: 1\nfeature: Việc X có dải tóm tắt\nslug: ${SL}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\napproved_by: M\napproved_at: 2026-10-02T00:00:00Z\n---\n\n## Context\n\n${context}\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n${oos.map(x => `- ${x}`).join('\n')}\n\n## Notes\n\n${notes}\n`;
// bc: thân THÔ của `## Known limits` trong báo cáo; cuoi: mục ấy là mục cuối (báo cáo đời cũ) và đuôi là khối ghim lại.
const baoCao = (ma, { bc = '', cuoi = null } = {}) => `---\nschema_version: 2\nfeature_slug: ${SL}\nverdict: PASS\nverified_commit: ${ma}\nhuman_signoff: M 2026-10-06\n---\n\n# Evidence Report: ${SL}\n\n## Known limits\n\n${bc}\n${cuoi == null ? '\n## Ngoài hợp đồng\n' : `\n${cuoi}\n`}`;
let nheN = 0;
// Hồ sơ trơn (không git, không ô cơ hội) — cho ca chỉ hỏi mô-đun dải.
function hoSoNhe(o = {}) {
  const d = path.join(TMP, `nhe-${++nheN}`, '_acceptance', SL); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(d, 'contract.md'), hopDong(o)); writeFileSync(path.join(d, 'evidence-report.md'), baoCao('a'.repeat(40), o));
  return d;
}
let khoN = 0;
// Kho git có lộ trình một hàng mang slug `hs`; ô cơ hội do `--mo-o` của cây đang kiểm ghi. vanDe thay mục «Vấn đề &
// ai gặp»; khongOpp xoá ô cơ hội (lý do rơi về `## Context`).
function khoThu(o = {}) {
  const r = path.join(TMP, `kho-${++khoN}`); mkdirSync(path.join(r, 'docs'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: docs/lo-trinh.json\n');
  writeFileSync(path.join(r, 'docs', 'lo-trinh.json'), JSON.stringify({ schema: 1, ten: 'Lộ trình thử', hang: [{ ma: 'X', slug: SL, cau_giao: 'Việc X có dải tóm tắt', vi_sao: o.viSaoHang || 'Gốc: crm/_acceptance/a — lý do một câu đủ.' }] }, null, 2) + '\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho');
  const mo = node([path.join(KIT, 'scripts', 'lo-trinh.mjs'), '--root', r, '--hang', 'X', '--mo-o', '--slug', SL, '--owner', 'x@y.z']);
  if (mo.status !== 0) throw new Error(`--mo-o exit ${mo.status}: ${mo.stderr}`);
  const d = path.join(r, '_acceptance', SL);
  if (o.vanDe != null) {
    const p = path.join(d, 'opportunity.md'); const t = readFileSync(p, 'utf8');
    if (!/## Vấn đề & ai gặp\n/.test(t)) throw new Error('ô cơ hội của --mo-o không có mục «Vấn đề & ai gặp»');
    writeFileSync(p, t.replace(/(## Vấn đề & ai gặp\n)[\s\S]*?(?=\n## )/, `$1\n${o.vanDe}\n`));
  }
  if (o.khongOpp) unlinkSync(path.join(d, 'opportunity.md'));
  writeFileSync(path.join(d, 'contract.md'), hopDong(o)); writeFileSync(path.join(d, 'evidence-report.md'), baoCao('a'.repeat(40), o));
  writeFileSync(path.join(d, 'decisions.jsonl'), JSON.stringify({ id: 'd-1', type: 'approach', stage: 'S1', at: '2026-10-01T00:00:00Z', decision: 'Chọn.', why: 'Vì.', cost_if_wrong: 'Ít.' }) + '\n');
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'vong X');
  return r;
}
// Bộ đọc HTML ĐỘC LẬP của ca (không gọi mô-đun).
const boEsc = s => String(s).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const daiCua = h => Object.fromEntries([...h.matchAll(/<div class="o" data-o="(\w+)" data-nguon="[^"]*"><div class="hoi">[^<]*<\/div><div class="tra">([\s\S]*?)<\/div><\/div>/g)].map(m => [m[1], boEsc(m[2])]));
const gioiHanTrang = h => [...h.matchAll(/<li data-loai="gioi-han">([\s\S]*?)<\/li>/g)].map(m => boEsc(m[1]));
const chuaDocTrang = h => [...h.matchAll(/<li class="vang" data-loai="gioi-han-chua-doc">([\s\S]*?)<\/li>/g)].map(m => boEsc(m[1]));
const viSaoTrang = h => { const m = h.match(/<details class="muc" id="vi-sao"><summary>[^<]*<\/summary><div class="noi">([\s\S]*?)<\/div><\/details>/); return m ? boEsc(m[1].replace(/<\/(li|p)>/g, ' ')).replace(/\s+/g, ' ').trim() : null; };
function trang(kit, r) {
  const x = node([path.join(kit, 'scripts', 'evidence-page.js'), '--root', r, '--slug', SL]);
  const p = path.join(r, '_acceptance', SL, 'evidence-page.html');
  if (x.status !== 0 || !existsSync(p)) throw new Error(`evidence-page exit ${x.status}: ${x.stderr.slice(0, 200)}`);
  return readFileSync(p, 'utf8');
}
function khoi(kit, r) {
  const x = node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', r]);
  if (x.status !== 0) throw new Error(`product-map exit ${x.status}: ${x.stderr.slice(0, 200)}`);
  const d = LT.docDuLieu(readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8')).duLieu;
  const h = d && d.lo_trinh[0].hang.find(y => y.ma === 'X');
  if (!h || !h.tom_tat) throw new Error('khối không có hàng X mang tom_tat');
  return h.tom_tat.moi_nguoi;
}
const tomTat = (kit, d) => HS(kit).tomTatHoSo(d);
const veGH = v => String(v || '').replace(/^.*? · /, '');

let bsN = 0;
function banSao(tiem) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills', 'commands', path.join('feature-loop', 'skills')]) cpSync(path.join(KIT, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
const chayCa = async (id, f, moTa) => { try { const s = await f(KIT); if (s.length) bad(id, s.join(' ; ')); else ok(id, moTa); } catch (e) { bad(id, loi(e)); } };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 220)}`);
  } catch (e) { bad(id, loi(e)); }
};
const HS_FILE = 'scripts/ho-so-tom-tat.cjs';
const EP_FILE = 'scripts/evidence-page.js';
const CHUA_DOC = nguon => `giới hạn đã biết: chưa đọc được — khối giới hạn ở ${nguon} không theo khuôn`;
const NHAC_SAI = 'giới hạn đã biết: chưa đọc được — Notes nhắc giới hạn sai khuôn';

// ── DD-1: đầu đoạn bọc dòng · đoạn dẫn · đánh số (cơ chế 1) ───────────────
const CA_1 = [
  ['(a)', 'Known limits — chấp nhận tại Cổng Bằng chứng 2026-09-21: sau ba lượt chấm\n(người ký chọn ghi giới hạn thay vì lượt bốn). Nhóm theo lớp:\n\n- A1 một.\n- A2 hai,\n  bọc dòng.\n- A3 ba.',
    ['A1 một.', 'A2 hai, bọc dòng.', 'A3 ba.']],
  ['(b)', '### Known limits — người ký nhận ở Cổng Bằng chứng 2026-10-01\n\nBốn mục dưới đây là lỗi thật nằm ngoài phạm vi đã duyệt,\nngười ký chọn ghi giới hạn rồi giao.\n\n- B1.\n- B2.\n- B3.\n- B4.',
    ['B1.', 'B2.', 'B3.', 'B4.']],
  ['(c)', 'Known limits\n\nNăm mục dưới đây, mỗi mục một lệnh tái lập.\n\n1. **C1 đầu.** Chi tiết\n   dòng tiếp.\n\n2. **C2.** Chi tiết.\n\n3. **C3.** Chi tiết.\n4. **C4.** Chi tiết.\n5. **C5.** Chi tiết.',
    ['**C1 đầu.** Chi tiết dòng tiếp.', '**C2.** Chi tiết.', '**C3.** Chi tiết.', '**C4.** Chi tiết.', '**C5.** Chi tiết.']],
  ['(d)', '### Known limits — Cổng Bằng chứng 2026-10-02\n\nĐoạn dẫn thứ nhất.\n\nĐoạn dẫn thứ hai, vẫn trước danh sách.\n\n- D1.\n- D2.\n- D3.', ['D1.', 'D2.', 'D3.']],
  ['(e)', 'Known limits — chọn ở Cổng Bằng chứng 2026-10-03:\n\n- E1.\n- E2.\n\nĐoạn khác sau cùng.\n\n- Gạch thường không thuộc khối.', ['E1.', 'E2.']],
  // Dòng BỌC giữa một đoạn thường tình cờ mở bằng chữ giới hạn: không phải đầu đoạn → 0 giới hạn; cờ «nhắc sai
  // khuôn» của vòng trước (dòng nhắc chưa thuộc khối nào) vẫn bật — ô không in số.
  ['(f)', 'Phụ thuộc vào hồ sơ trước, nơi đã ghi\nKnown limits của vòng ấy bằng chữ thường.\n\n- Gạch thường.', []],
];
async function dd1(kit) {
  const sai = [];
  for (const [ten, notes, ds] of CA_1) {
    const n = HS(kit).gioiHanTuNotes(`## Notes\n\n${notes}\n`);
    if (!deq(n, ds)) sai.push(`ca ${ten}: bộ đọc Notes ra ${JSON.stringify(n)}, cần ${JSON.stringify(ds)}`);
    const r = khoThu({ notes }); const h = trang(kit, r);
    const mong = ten === '(f)' ? NHAC_SAI : `${ds.length} giới hạn đã biết`;
    for (const [noi, v] of [['trang', daiCua(h).chua_lam], ['khối', khoi(kit, r).chua_lam]]) if (veGH(v) !== mong) sai.push(`ca ${ten}: chua_lam (${noi}) «${v}», cần vế «${mong}»`);
    if (!deq(gioiHanTrang(h), ds)) sai.push(`ca ${ten}: trang liệt ${JSON.stringify(gioiHanTrang(h))}`);
  }
  if (!sai.length) console.log(`    · DD-1 ${CA_1.length} ca`);
  return sai;
}

// ── DD-2: gạch tự mở «known-limits» trong khối — đếm một lần (cơ chế 2) ─────
const CA_2 = [
  ['tiêu đề', '### Known limits\n\n- known-limits (Ngoài-1, owner ghi 15/09): một.\n- known-limits (Ngoài-2, owner ghi 15/09): hai.\n- **known-limit (Ngoài-3, người chốt 06/09):** ba.\n- known-limits (Ngoài-4): bốn.', 4],
  ['đầu đoạn', 'Known limits — chủ kho chấp nhận 26/09 tại Cổng Bằng chứng:\n\n- known-limits: một.\n- known-limits: hai.\n- known-limits: ba.\n- known-limits: bốn.', 4],
  ['khối + gạch trơn ngoài khối', '### Known limits\n\n- known-limits: a.\n- known-limits: b.\n- known-limits: c.\n- known-limits: d.\n\n### Khác\n\n- Known limits: một giới hạn trơn ngoài khối.', 5],
];
async function dd2(kit) {
  const sai = [];
  for (const [ten, notes, so] of CA_2) {
    const h = trang(kit, khoThu({ notes })); const v = daiCua(h).chua_lam;
    if (veGH(v) !== `${so} giới hạn đã biết`) sai.push(`ca «${ten}»: chua_lam «${v}», cần ${so} (không phải ${so === 5 ? 9 : so * 2})`);
    if (gioiHanTrang(h).length !== so) sai.push(`ca «${ten}»: trang có ${gioiHanTrang(h).length} dòng giới hạn, cần ${so}`);
  }
  return sai;
}

// ── DD-3: mục Known limits của báo cáo (cơ chế 3) ─────────────────────────
function khoiGhimLai(kit) {
  const t = readFileSync(path.join(kit, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const m = t.match(/<!-- <<<REPIN-TEMPLATE -->\n```\n([\s\S]*?)```\n<!-- REPIN-TEMPLATE>>> -->/);
  if (!m) throw new Error('SKILL feature-loop không có khối REPIN-TEMPLATE');
  const dong = m[1].split('\n'); const i = dong.findIndex(l => /^### Re-pin/.test(l));
  if (i < 0) throw new Error('khối REPIN-TEMPLATE không có tiêu đề «### Re-pin»');
  return dong.slice(i, i + 3).join('\n').replace('<N>', '1').replace('<ngày>', '2026-10-09').replace('<lý do 1 dòng>', 'gộp main')
    .replace('<id>', 'repin-20261009T000000Z-1').replace('<40-hex>', 'b'.repeat(40)).replace(/<k>/g, '4').replace(/<m>/g, '9');
}
const CA_3 = kit => [
  ['(a)', { bc: '1. **R1.** Chi tiết\n   tiếp.\n\n2. **R2.** Chi tiết.\n3. **R3.** chi tiết\nbọc lười.\n4. R4.\n5. R5.\n6. R6.' },
    ['**R1.** Chi tiết tiếp.', '**R2.** Chi tiết.', '**R3.** chi tiết bọc lười.', 'R4.', 'R5.', 'R6.']],
  ['(b)', { bc: '- P1.\n  - con a.\n  - con b.\n- P2.\n  - con c.\n  - con d.' }, ['P1. - con a. - con b.', 'P2. - con c. - con d.']],
  ['(c)', { bc: 'Ba giới hạn dưới đây, người ký nhận.\n\n- Q1.\n- Q2.\n- Q3.' }, ['Q1.', 'Q2.', 'Q3.']],
  ['(d)', { bc: 'Một đoạn duy nhất nói về giới hạn của phép đo.' }, ['Một đoạn duy nhất nói về giới hạn của phép đo.']],
  ['(e)', { bc: '' }, []],
  ['(e2)', { bc: '', cuoi: khoiGhimLai(kit) }, []],
  ['(f)', { bc: '- S1.\n- S2.', cuoi: khoiGhimLai(kit) }, ['S1.', 'S2.']],
  ['(g)', { bc: '- G1.\n- G2.\n- G3.' }, ['G1.', 'G2.', 'G3.']],
];
async function dd3(kit) {
  const sai = [];
  for (const [ten, o, ds] of CA_3(kit)) {
    const h = trang(kit, khoThu({ notes: '- Phụ thuộc: không.', ...o })); const v = daiCua(h).chua_lam;
    if (veGH(v) !== `${ds.length} giới hạn đã biết`) sai.push(`ca ${ten}: chua_lam «${v}», cần ${ds.length}`);
    if (!deq(gioiHanTrang(h), ds)) sai.push(`ca ${ten}: trang liệt ${JSON.stringify(gioiHanTrang(h))}`);
  }
  return sai;
}

// ── DD-4: «None.» / «Không có» — ma trận toàn phần 5 chữ × 5 dạng ─────────
const CHU_RONG = ['None.', 'none', 'Không có', 'không có.', '*None.*'];
const DANG_4 = [
  ['tiêu đề rồi đoạn', w => ({ notes: `### Known limits\n\n${w}` })],
  ['đầu đoạn văn rồi đoạn', w => ({ notes: `Known limits — Cổng Bằng chứng 2026-10-04\n\n${w}` })],
  ['gạch trơn', w => ({ notes: `- Known limits: ${w}` })],
  ['gạch con', w => ({ notes: `- Known limits — chọn ở Cổng Bằng chứng 2026-10-04:\n  - ${w}` })],
  ['mục báo cáo', w => ({ notes: '- Phụ thuộc: không.', bc: w })],
];
async function dd4(kit) {
  const sai = []; let n = 0;
  for (const [dang, f] of DANG_4) for (const w of CHU_RONG) {
    n += 1; const v = tomTat(kit, hoSoNhe(f(w))).dai.moi_nguoi.chua_lam;
    if (veGH(v) !== '0 giới hạn đã biết') sai.push(`ca «${dang}» × «${w}»: chua_lam «${v}», cần 0`);
  }
  const v = tomTat(kit, hoSoNhe({ notes: '- Giới hạn đã biết: không có kênh báo cho người dùng khi thông tin đăng nhập đổi.' })).dai.moi_nguoi.chua_lam;
  if (veGH(v) !== '1 giới hạn đã biết') sai.push(`giới hạn thật «không có kênh báo…»: chua_lam «${v}», cần 1`);
  if (n !== CHU_RONG.length * DANG_4.length) sai.push(`ma trận chạy ${n} ca, cần ${CHU_RONG.length * DANG_4.length}`);
  if (!sai.length) console.log(`    · DD-4 ma trận ${n} ca + 1 giới hạn thật`);
  return sai;
}

// ── DD-5: khối không đọc được (cơ chế 4) ──────────────────────────────────
const BA_GACH = '- Known limits — chọn ở Cổng Bằng chứng 2026-10-05:\n  - một.\n  - hai.\n  - ba.';
const CA_5 = [
  ['tiêu đề có tiêu đề con', { notes: '### Known limits\n\nĐoạn.\n\n#### Nhóm A\n\n- a1.\n- a2.' }, 'hợp đồng'],
  ['tiêu đề có hai danh sách', { notes: '### Known limits\n\n- a1.\n- a2.\n\nTách thành việc riêng:\n\n- b1.' }, 'hợp đồng'],
  ['đầu đoạn rồi hai đoạn', { notes: 'Known limits — Cổng Bằng chứng 2026-10-05\n\nĐoạn một.\n\nĐoạn hai.\n\n- c1.' }, 'hợp đồng'],
  ['báo cáo có tiêu đề con', { notes: '- Phụ thuộc: không.', bc: 'Mười một giới hạn.\n\n### 1. Một\n\n- x.\n\n### 2. Hai\n\n- y.' }, 'báo cáo'],
  ['báo cáo hai đoạn', { notes: '- Phụ thuộc: không.', bc: 'Đoạn một.\n\nĐoạn hai.' }, 'báo cáo'],
  ['hai nguồn cùng hỏng', { notes: '### Known limits\n\nĐoạn.\n\n#### Nhóm A\n\n- a1.', bc: 'Đoạn một.\n\nĐoạn hai.' }, 'hợp đồng và báo cáo'],
  ['hợp đồng hỏng, báo cáo 3 gạch', { notes: '### Known limits\n\n- a1.\n- a2.\n\nTách thành việc riêng:\n\n- b1.', bc: '- x.\n- y.\n- z.' }, 'hợp đồng'],
  ['báo cáo hỏng, hợp đồng 3 gạch', { notes: BA_GACH, bc: 'Đoạn một.\n\nĐoạn hai.' }, 'báo cáo'],
];
async function dd5(kit) {
  const sai = [];
  for (const [ten, o, nguon] of CA_5) {
    const mong = `2 mục để ngoài phạm vi · ${CHUA_DOC(nguon)}`;
    const v = tomTat(kit, hoSoNhe(o)).dai.moi_nguoi.chua_lam;
    if (v !== mong) sai.push(`ca «${ten}»: chua_lam «${v}», cần «${mong}»`);
    if (/\d/.test(veGH(v))) sai.push(`ca «${ten}»: vế giới hạn còn chữ số «${veGH(v)}»`);
  }
  // Ma trận toàn phần: MỌI hình dạng không đọc được qua trang VÀ khối (lượt chấm 1, t8 — trước chỉ hai ca).
  for (const [ten, o, nguon] of CA_5) {
    const r = khoThu(o); const h = trang(kit, r);
    const mong = `2 mục để ngoài phạm vi · ${CHUA_DOC(nguon)}`;
    for (const [noi, v] of [['trang', daiCua(h).chua_lam], ['khối', khoi(kit, r).chua_lam]]) if (v !== mong) sai.push(`ca «${ten}» (${noi}): chua_lam «${v}»`);
    if (gioiHanTrang(h).length) sai.push(`ca «${ten}»: trang vẫn liệt ${gioiHanTrang(h).length} dòng giới hạn`);
    if (!deq(chuaDocTrang(h), [CHUA_DOC(nguon)])) sai.push(`ca «${ten}»: trang không có đúng câu chưa đọc được (${JSON.stringify(chuaDocTrang(h))})`);
  }
  return sai;
}

// ── DD-6: tệp ca của hồ sơ đã ký dai-tom-tat-doc-dung không đổi một byte ─────────────────────────
const BAM_DT = '62dad270082c45fa285ec925406176451bf19b3eee51aa5c264c531c6bc1d161'; // bd8163dc:tests/scripts/dai-tom-tat.test.mjs
function dd6(tep = path.join(HERE, 'dai-tom-tat.test.mjs')) {
  const b = createHash('sha256').update(readFileSync(tep)).digest('hex');
  return b === BAM_DT ? [] : [`dai-tom-tat.test.mjs đổi so với bản đã ký (sha256 ${b.slice(0, 12)} ≠ ${BAM_DT.slice(0, 12)})`];
}

// ── DD-8: «Vì sao làm» trọn vẹn ở trang hồ sơ; dải giữ trần 400 ───────────
const MO = 'Mở từ hàng X của «Lộ trình thử».';
const cau150 = i => { const dau = `Câu thứ ${i} nói một ý về vì sao làm việc này`; return `${dau}${' và thêm chữ'.repeat(30)}`.slice(0, 149) + '.'; };
const CAU_A = [1, 2, 3, 4, 5].map(cau150);
const TU = Array.from({ length: 100 }, (_, i) => `chu${String(i).padStart(2, '0')}`).join(' ');
const DOAN_399 = (`Một đoạn vừa đủ dài${' để thử trần'.repeat(40)}`).slice(0, 398) + '.';
const MUC_90 = i => `Chỗ hở thứ ${i}${' kéo dài cho đủ chữ'.repeat(6)}`.slice(0, 90);
const CTX = `Bối cảnh dài của hợp đồng${' nói lý do làm việc này'.repeat(25)}. Câu cuối của bối cảnh.`;
const CA_8 = [
  ['(a)', { vanDe: `${MO}\n\n${CAU_A.join(' ')}` }, [CAU_A[4]], v => v === `${CAU_A[0]} ${CAU_A[1].slice(0, -1)}…`],
  ['(b)', { vanDe: `${MO}\n\n${TU}` }, [TU], v => v.endsWith('…')],
  ['(c)', { vanDe: `${MO}\n\nSáu chỗ hở:\n\n${[1, 2, 3, 4, 5, 6].map(i => `- **${MUC_90(i)}.** Chi tiết của mục ${i}.`).join('\n')}` },
    ['Sáu chỗ hở:', ...[1, 2, 3, 4, 5, 6].map(i => `${MUC_90(i)}. Chi tiết của mục ${i}.`)], v => v.endsWith('…')],
  ['(d)', { vanDe: `${MO}\n\nCác ca đã gặp:\n\n| Ca | Biểu hiện |\n|:-:|:-:|\n| ca-mot | đỏ một lượt |\n| ca-hai | đỏ hai lượt |\n| ca-ba | đỏ ba lượt |` },
    ['Các ca đã gặp:', 'ca-mot · đỏ một lượt', 'ca-hai · đỏ hai lượt', 'ca-ba · đỏ ba lượt'], v => v === 'Các ca đã gặp: ca-mot · ca-hai · ca-ba'],
  ['(e)', { vanDe: `${MO}\n\n${DOAN_399}` }, [DOAN_399], v => v === DOAN_399],
  ['(f)', { khongOpp: true, context: CTX }, [CTX], v => v.endsWith('…')],
  ['(g)', { vanDe: `${MO}\n\nVì sao: Gốc: crm/_acceptance/a — ${CAU_A.join(' ')}` }, [CAU_A[4]], v => v === `${CAU_A[0]} ${CAU_A[1].slice(0, -1)}…`],
  // Đoạn KHÔNG phải câu dẫn mà danh sách dính liền ngay dưới (không dòng trắng) — dạng thật ở crm
  // (chat-an-toan-truoc-r1, giai-doan-mac-dinh): trang trước vòng dai-tom-tat-doc-dung in cả danh sách.
  ['(h)', { vanDe: `${MO}\n\n${CAU_A.slice(0, 3).join(' ')}\n- Người gặp: quản trị viên đã lưu trữ giai đoạn mặc định.\n- Kiểm kèm (chỉ đọc): việc trợ lý trên bản dựng thật.` },
    [CAU_A[2], 'Người gặp: quản trị viên đã lưu trữ giai đoạn mặc định.', 'Kiểm kèm (chỉ đọc): việc trợ lý trên bản dựng thật.'], v => v.endsWith('…')],
];
async function dd8(kit) {
  if (DOAN_399.length !== 399 || CAU_A.some(c => c.length !== 150) || TU.length < 500 || CTX.length <= 400) return [`ca dựng sai độ dài (${DOAN_399.length}, ${TU.length}, ${CTX.length})`];
  const sai = [];
  for (const [ten, o, phaiCo, dangDai] of CA_8) {
    const r = khoThu(o); const h = trang(kit, r); const vs = viSaoTrang(h);
    if (vs == null) { sai.push(`ca ${ten}: trang không có mục vi-sao`); continue; }
    for (const c of phaiCo) if (!vs.includes(c)) sai.push(`ca ${ten}: mục «Vì sao làm» thiếu «${c.slice(0, 50)}…» (trang in ${vs.length} ký tự)`);
    if (ten === '(d)' && /:-:/.test(vs)) sai.push('ca (d): hàng phân cách bảng thành mục');
    if (ten === '(e)' && vs !== DOAN_399) sai.push(`ca (e): mục «Vì sao làm» khác đoạn 399 ký tự`);
    for (const [noi, v] of [['dải', daiCua(h).vi_sao], ['khối', khoi(kit, r).vi_sao]]) {
      if (String(v).length > 400) sai.push(`ca ${ten}: vi_sao (${noi}) dài ${String(v).length} > 400`);
      if (!dangDai(String(v))) sai.push(`ca ${ten}: vi_sao (${noi}) «${String(v).slice(0, 50)}…» sai hình dạng dải`);
    }
  }
  return sai;
}

if (want('DD-1')) await chayCa('DD-1', dd1, 'sáu khối đầu đoạn (bọc dòng · đoạn dẫn · đánh số · hai đoạn dẫn có biên · đoạn khác sau danh sách · dòng bọc giữa đoạn) → 3 · 4 · 5 · 3 · 2 · 0 ở mô-đun, trang và khối');
if (want('DD-1-do')) await chayDo('DD-1-do', dd1, [[HS_FILE, 'else { const d = docDoan(raw, i, da); p = d.chu; sau = d.ket; }', 'else { da.add(i); p = raw[i].trim(); sau = i + 1; }']], 'ca (a)', 'bản sao chỉ đọc một dòng của đầu đoạn văn');
if (want('DD-1-do-dan')) await chayDo('DD-1-do-dan', dd1, [[HS_FILE, 'if (ds.length === 1 && (coRanh || seq.length <= 2))', 'if (ds.length === 1 && seq[0].l && (coRanh || seq.length <= 2))']], 'ca (b)', 'bản sao không cho đoạn dẫn');
if (want('DD-1-do-dau-doan')) await chayDo('DD-1-do-dau-doan', dd1, [[HS_FILE, 'const dauDoan = i === 0 || trang(raw[i - 1]) || tieuDe(raw[i - 1]);', 'const dauDoan = true;']], 'ca (f)', 'bản sao nhận đầu đoạn ở mọi dòng');
if (want('DD-2')) await chayCa('DD-2', dd2, 'gạch tự mở «known-limits» trong khối tiêu đề / đầu đoạn đếm một lần (4, không 8); gạch trơn ngoài khối vẫn đếm (5)');
if (want('DD-2-do')) await chayDo('DD-2-do', dd2, [[HS_FILE, 'if (da.has(i)) continue;', 'if (false) continue;']], '8', 'bản sao đọc lại dòng đã thuộc khối');
if (want('DD-3')) await chayCa('DD-3', dd3, 'báo cáo: đánh số 6 · gạch con thuộc mục cha 2 · đoạn dẫn 3 · một đoạn 1 · rỗng 0 · chỉ khối ghim lại 0 · dừng ở khối ghim lại 2 · gạch phẳng 3');
if (want('DD-3-do-so')) await chayDo('DD-3-do-so', dd3, [[HS_FILE, 'const LA_MUC = /^(\\s*)([-*]|\\d+[.)])\\s+(.*)$/;', 'const LA_MUC = /^(\\s*)([-*])\\s+(.*)$/;']], 'ca (a)', 'bản sao chỉ nhận gạch «-»');
if (want('DD-3-do-repin')) await chayDo('DD-3-do-repin', dd3, [[HS_FILE, 'const LA_GHIM_LAI = /^#{2,6}\\s+Re-pin\\b/;', 'const LA_GHIM_LAI = /(?!)/;']], 'ca (f): chua_lam «2 mục để ngoài phạm vi · giới hạn đã biết: chưa đọc được', 'bản sao không dừng ở tiêu đề ghim lại');
if (want('DD-3-do-long')) await chayDo('DD-3-do-long', dd3, [[HS_FILE, 'if (mm && mm[1].length < le) break;', 'if (mm && mm[1].length < le) break; if (mm) { muc.push(mm[3].trim()); da.add(j); j++; continue; }']], 'ca (b)', 'bản sao đếm gạch con là mục riêng');
if (want('DD-4')) await chayCa('DD-4', dd4, `ma trận ${CHU_RONG.length * DANG_4.length} ca chữ rỗng → 0; «không có kênh báo…» → 1`);
if (want('DD-4-do')) await chayDo('DD-4-do', dd4, [[HS_FILE, 'if (seq[0].p && laRong(seq[0].p.chu))', 'if (false)']], 'tiêu đề rồi đoạn', 'bản sao bỏ lọc rỗng ở thân khối');
if (want('DD-4-do-long')) await chayDo('DD-4-do-long', dd4, [[HS_FILE, 'const RONG_GIOI_HAN = /^[*_\\s]*(?:none|không có|không)\\.?[*_\\s]*$/i;', 'const RONG_GIOI_HAN = /^[*_\\s]*(?:none|không có|không)/i;']], 'kênh báo', 'bản sao lọc mọi câu mở bằng «không có»');
if (want('DD-5')) await chayCa('DD-5', dd5, `${CA_5.length} khối không đọc được → «chưa đọc được — khối giới hạn ở <nguồn> …», không chữ số, cả hai chiều gương; trang và khối của cả ${CA_5.length} ca: 0 dòng giới hạn + đúng câu ấy`);
if (want('DD-5-do')) await chayDo('DD-5-do', dd5, [[HS_FILE, 'if (ds.length === 1 && (coRanh || seq.length <= 2))', 'if (ds.length >= 1 && (coRanh || seq.length <= 2)) return ds.flatMap(x => x.l.muc); if (false)']], 'hai danh sách', 'bản sao cộng mục của khối hai danh sách');
if (want('DD-5-do-nguon')) await chayDo('DD-5-do-nguon', dd5, [[HS_FILE, 'if (moi.chua_lam != null && hong.length)', 'if (moi.chua_lam != null && hong.length && !known.length)']], 'chữ số', 'bản sao in số của nguồn đọc được');
if (want('DD-5-do-bao-cao')) await chayDo('DD-5-do-bao-cao', dd5, [[HS_FILE, "const hong = [ghHD.khongDoc && 'hợp đồng', ghBC.khongDoc && 'báo cáo'].filter(Boolean);", "const hong = [ghHD.khongDoc && 'hợp đồng'].filter(Boolean);"]], 'báo cáo', 'bản sao chỉ xét nguồn hợp đồng');
if (want('DD-5-do-trang')) await chayDo('DD-5-do-trang', dd5, [[HS_FILE, 'known: hong.length ? [] : known,', 'known,']], 'trang vẫn liệt', 'bản sao vẫn đưa danh sách giới hạn lên trang khi không đọc được');
if (want('DD-5-do-trang-nguon')) await chayDo('DD-5-do-trang-nguon', dd5, [[HS_FILE, 'known: hong.length ? [] : known,', 'known: ghBC.khongDoc ? [] : known,']], 'trang vẫn liệt', 'bản sao chỉ ẩn danh sách khi BÁO CÁO hỏng');
if (want('DD-6')) await chayCa('DD-6', () => dd6(), 'tests/scripts/dai-tom-tat.test.mjs giống từng byte bản đã ký ở bd8163dc');
if (want('DD-6-do')) {
  try {
    const lanh = dd6(); if (lanh.length) bad('DD-6-do', `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`);
    else { const p = path.join(TMP, 'dai-tom-tat.test.mjs'); writeFileSync(p, Buffer.concat([readFileSync(path.join(HERE, 'dai-tom-tat.test.mjs')), Buffer.from('\n')])); const s = dd6(p); const g = s.find(m => m.includes('dai-tom-tat.test.mjs')); if (g) ok('DD-6-do', `bản sao thêm một byte: hàm đo trả «${g}»`); else bad('DD-6-do', `không bắt: ${JSON.stringify(s)}`); }
  } catch (e) { bad('DD-6-do', loi(e)); }
}
if (want('DD-8')) await chayCa('DD-8', dd8, 'trang in trọn «Vì sao làm» (năm câu · câu dài · câu dẫn + sáu mục · câu dẫn + bảng · 399 ký tự · Context · «Vì sao: Gốc: …» · danh sách dính liền đoạn); dải và khối ≤ 400');
if (want('DD-8-do')) await chayDo('DD-8-do', dd8, [[EP_FILE, '<p>${esc(CT.viSao.doan)}</p>${CT.viSao.muc.length ?', '<p>${esc(M.vi_sao)}</p>${false ?']], 'ca (a)', 'bản sao evidence-page in ô có trần ở mục gập');
if (want('DD-8-do-dinh')) await chayDo('DD-8-do-dinh', dd8, [[HS_FILE, 'if (!dan) for (let j = i + 1; j < k.length && k[j].gach && k[j].sat; j++) sau.push(k[j]);', '']], 'ca (h)', 'bản sao bỏ danh sách dính liền đoạn');
if (want('DD-8-do-dai')) await chayDo('DD-8-do-dai', dd8, [[HS_FILE, 'if (du.length <= TRAN_VI_SAO) return du;', 'return du;']], '400', 'bản sao bỏ trần ở dải');

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (dai-tom-tat-dem-dung)`);
process.exit(fail ? 1 : 0);
