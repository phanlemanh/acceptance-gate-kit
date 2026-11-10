// co-hop-dong.test.mjs — hồ sơ vong-mo-thang-bang-feature-loop (hàng S3c, 12/10/2026): hợp đồng từ 13 tiêu
// chí không vào được Cổng Phạm vi khi chưa tách hoặc chưa có dòng sổ giữ có tên; 11–12 tiêu chí lên thẻ thành
// cờ vàng; khoảng đọc từ CHÍNH khối CAT-LUOT-CO; năm chỗ dạy nói cùng chính sách; đồng hồ cỡ đếm dòng giữ.
//
// Luật đo:
//  - Kho thử dựng trong lần chạy (khuôn workspace dùng chung `gate-fixture.mjs`); gọi CHÍNH scripts/gate-card.js
//    và scripts/cat-luot.mjs như tiến trình con.
//  - Ma trận + kỳ vọng VIẾT TRƯỚC (hằng dưới), không tính từ mã sản phẩm; số khẳng định = số hàng (in ra).
//  - Chiều đỏ: bản sao TRỌN các thư mục dạy/chạy (scripts lib skills feature-loop commands dieu-phoi + ba tệp
//    gốc) bị tiêm đúng một kim (kim khớp đúng một lần, không thì ca đỏ vì hạ tầng ca), thông điệp ghim; bản
//    nguyên vẹn là đối chứng dương.
//  - Đường dẫn suy từ vị trí tệp này. Tên ca = mã AC; CHD_CASES chọn ca; mã lạ → thoát 2.
//  - Mặc định (không CHD_CASES) chạy mọi ca, kể cả AC-4-kho-that (thẻ cho mọi hồ sơ thật ≥ 11 tiêu chí — đo 4 s).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const require = createRequire(import.meta.url);
// Hai trạng thái «đã qua Cổng Bằng chứng» rút từ lib (MỘT nguồn — nếp hskt/htkd): tệp ca không mang chuỗi trạng
// thái của riêng nó, nên không phải khai gạch ở RT13 của hồ sơ ra-co-ten-lam-va-trao.
const [DA_KY, MAY_THONG] = require(path.join(KIT, 'lib', 'workspace-record.cjs')).DA_THONG_CONG_2;

const CA = ['AC-1', 'AC-1-do', 'AC-1-hong', 'AC-2', 'AC-2-vong', 'AC-2-do', 'AC-3', 'AC-3-do', 'AC-3-do-rut', 'AC-4', 'AC-4-kho-that', 'AC-4-do',
  'AC-5', 'AC-5-do-khoa', 'AC-5-do-nghia', 'AC-6', 'AC-6-do-khoi', 'AC-6-do-lop', 'AC-7', 'AC-7-do', 'AC-7-do-ngay-ky', 'AC-8', 'AC-8-do'];
const CHI_KHI_GOI = new Set();
const chon = (process.env.CHD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const la = chon.filter(c => !CA.includes(c));
if (la.length) { console.error(`co-hop-dong.test: mã ca lạ: ${la.join(', ')} (biết: ${CA.join(', ')})`); process.exit(2); }
const want = c => (chon.length ? chon.includes(c) : !CHI_KHI_GOI.has(c));

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'co-hop-dong-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const thuMuc = p => { const d = path.join(TMP, `${p}-${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
const ghi = (root, rel, txt) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, txt); };
const doc = (root, rel) => fs.readFileSync(path.join(root, rel), 'utf8');

let pass = 0, fail = 0, daChay = 0;
const ok = (ten, mo) => { pass++; console.log(`  PASS: ${ten} — ${mo}`); };
const sai = (ten, mo) => { fail++; console.log(`  FAIL: ${ten} — ${mo}`); };
async function ca(ten, fn) {
  if (!want(ten)) return; daChay++;
  try { const r = await fn(); if (r && r.loi && r.loi.length) sai(ten, r.loi.join(' | ')); else ok(ten, (r && r.mo) || 'xanh'); }
  catch (e) { sai(ten, `ca ném: ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' / ') : e}`); }
}

// ── Bản sao gói (trọn thư mục) + kim ──────────────────────────────────────────────────────────────────
const THU_MUC_GOI = ['scripts', 'lib', 'skills', 'feature-loop', 'commands', 'dieu-phoi'];
const TEP_GOC = ['GUIDE.md', 'README.md', 'QUICKSTART.md'];
function banSao() {
  const d = thuMuc('goi');
  for (const t of THU_MUC_GOI) fs.cpSync(path.join(KIT, t), path.join(d, t), { recursive: true, filter: s => !s.includes(`${path.sep}node_modules`) });
  for (const t of TEP_GOC) if (fs.existsSync(path.join(KIT, t))) fs.copyFileSync(path.join(KIT, t), path.join(d, t));
  return d;
}
// Kim khớp ĐÚNG một lần; không thì ném (ca đỏ vì hạ tầng ca, không vì vật).
function tiem(goi, rel, cu, moi) {
  const f = path.join(goi, rel); const t = fs.readFileSync(f, 'utf8');
  const n = t.split(cu).length - 1;
  if (n !== 1) throw new Error(`kim khớp ${n} lần ở ${rel}: «${cu.slice(0, 60)}»`);
  fs.writeFileSync(f, t.replace(cu, moi));
}

// Đối chứng dương TRONG từng ca đỏ: bản nguyên vẹn phải xanh trước khi tin bản tiêm là đỏ (assertion
// âm-tính-một-mình không phân biệt «bắt đúng lỗi» với «chưa bao giờ chạy»).
function doiChung(ten, loi) { if (loi && loi.length) throw new Error(`đối chứng dương ĐỎ (bản nguyên vẹn) — ${ten}: ${loi.slice(0, 3).join(' | ')}`); }

// ── Kho thử hồ sơ (khuôn workspace dùng chung của các lưới thẻ) ────────────────────────────────────────
const { mkWs, EVALS, PROBE } = await import(pathToFileURL(path.join(HERE, 'gate-fixture.mjs')).href);
// Hợp đồng n tiêu chí. dang: 'gach' (gạch đầu dòng) · 'tieu-de' (### AC-n). ids: danh sách mã (cho ca mã trùng).
function hopDong({ n, dang = 'gach', status = 'draft', ids = null, extraFm = '' }) {
  const ma = ids || Array.from({ length: n }, (_, i) => `AC-${i + 1}`);
  const tc = ma.map((id, i) => (dang === 'tieu-de' ? `### ${id}\n\nGiven a${i}, When b${i}, Then c${i}.\n` : `- ${id}: Given a${i}, When b${i}, Then c${i}.`)).join('\n');
  const duyet = status === 'draft' ? '' : 'approved_by: A\napproved_at: 2026-10-05T00:00:00Z\n';
  return `---\nschema_version: 1\nfeature: F\nslug: g\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${duyet}${extraFm}---\n\n## Criteria\n\n${tc}\n\n## Coverage\n\n- trục A [thước CE: x].\n\n## Out of scope\n\n- x.\n`;
}
const DONG_GIU = (id, ly = 'kết quả một màn không tách được mà giữ nghĩa') => JSON.stringify({ id, type: 'approach', stage: 'S1', at: '2026-10-12T00:00:00Z', decision: `giữ cỡ — ${ly}`, why: 'w', cost_if_wrong: 'c' });
function khoThu({ contract, decisions = '' }) {
  return mkWs('g', { 'contract.md': contract, 'evals.yaml': EVALS, 'decisions.jsonl': decisions, 'gap-probe.md': PROBE('clean') });
}
const the = (goi, root, extra = []) => spawnSync('node', [path.join(goi, 'scripts', 'gate-card.js'), '--root', root, '--slug', 'g', '--gate', '1', ...extra], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
function theDu(goi, root) {
  const h = the(goi, root); const x = the(goi, root, ['--extract']);
  let j = null; try { j = JSON.parse(x.stdout); } catch { /* để ca báo */ }
  return { html: h.stdout || '', ma: h.status, j, co: j ? j.co_hop_dong : undefined, err: (h.stderr || '') + (x.stderr || '') };
}
// Cờ cỡ mang lớp `co-hd` (thẻ in `<div class="flag fred co-hd">` / `fwarn co-hd`).
const CO_RE = /<div class="flag (fred|fwarn) co-hd">([\s\S]*?)<\/div>/g;
const coCo = html => [...html.matchAll(CO_RE)].map(m => ({ lop: m[1], van: m[2] }));
const viTriSeLam = html => html.indexOf('<div class="lab">Hệ thống SẼ làm</div>');
const giaiHtml = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// Khoảng ĐỘC LẬP với mô-đun: đọc khối bằng regex riêng của ca (kỳ vọng không chép công thức bên viết).
function khoangDocLap(goi) {
  const t = doc(goi, 'skills/cat-luot/SKILL.md');
  const m = t.match(/<!-- <<<CAT-LUOT-CO -->\n```\n([\s\S]*?)```\n<!-- CAT-LUOT-CO>>> -->/);
  if (!m) return null;
  const v = k => (m[1].match(new RegExp(`^${k}:\\s*(\\S+)`, 'm')) || [])[1];
  const [a, b] = String(v('muc_tieu')).split('-').map(Number);
  return { a, b, c: Number(v('cho_phep_den')), t: Number(v('tach_tu')) };
}

// ── AC-1: một nguồn khoảng ────────────────────────────────────────────────────────────────────────────
const dongHo = (goi, root, extra = []) => {
  const r = spawnSync('node', [path.join(goi, 'scripts', 'cat-luot.mjs'), '--root', root, '--co', ...extra], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* để ca báo */ }
  return { ma: r.status, j, err: r.stderr || '' };
};
const nhomCua = (j, slugN) => j && j.nhom.find(g => g.n_chot === slugN);
function kho11(status) { return khoThu({ contract: hopDong({ n: 11, status }) }); }
await ca('AC-1', async () => {
  const loi = [];
  const CL = await import(pathToFileURL(path.join(KIT, 'scripts', 'cat-luot.mjs')).href);
  const CHD = require(path.join(KIT, 'scripts', 'co-hop-dong.cjs'));
  if (CL.docKhoang !== CHD.docKhoang) loi.push('cat-luot.mjs xuất docKhoang KHÁC hàm của co-hop-dong.cjs');
  if (CL.napKhoang !== CHD.napKhoang) loi.push('cat-luot.mjs xuất napKhoang KHÁC hàm của co-hop-dong.cjs');
  const t = theDu(KIT, kho11('draft'));
  const co = coCo(t.html);
  if (!(co.length === 1 && co[0].lop === 'fwarn')) loi.push(`thẻ 11 tiêu chí draft: cờ cỡ ${JSON.stringify(co.map(x => x.lop))} ≠ [fwarn]`);
  if (!t.co || t.co.chan !== false || t.co.nhom !== 'cho-phep') loi.push(`extract 11 tiêu chí: ${JSON.stringify(t.co)}`);
  const d = dongHo(KIT, kho11('approved'));
  const g = d.j && d.j.nhom.find(x => x.ten === 'cho-phep');
  if (!g || g.n_chot !== 1) loi.push(`đồng hồ: hồ sơ 11 tiêu chí không vào nhóm cho-phep (${JSON.stringify(d.j && d.j.nhom.map(x => [x.ten, x.n_chot]))})`);
  return { loi, mo: 'cat-luot xuất chính hàm của co-hop-dong; 11 tiêu chí: thẻ vàng, đồng hồ cho-phep (đối chứng dương)' };
});
await ca('AC-1-do', async () => {
  { const t0 = theDu(KIT, kho11('draft')); doiChung('thẻ 11 tiêu chí', t0.co && t0.co.chan === false && coCo(t0.html).length === 1 && coCo(t0.html)[0].lop === 'fwarn' ? [] : [JSON.stringify(t0.co)]); }
  const goi = banSao(); const loi = [];
  tiem(goi, 'skills/cat-luot/SKILL.md', '\ncho_phep_den: 12\ntach_tu: 13\n', '\ncho_phep_den: 10\ntach_tu: 11\n');
  const t = theDu(goi, kho11('draft'));
  const co = coCo(t.html);
  if (!(co.length === 1 && co[0].lop === 'fred') || !t.co || t.co.chan !== true) loi.push(`khoảng đọc từ khối: bản sửa khối, thẻ 11 tiêu chí vẫn ${JSON.stringify(co.map(x => x.lop))} chan=${t.co && t.co.chan}`);
  const d = dongHo(goi, kho11('approved'));
  const g = d.j && d.j.nhom.find(x => x.ten === 'phai-tach');
  if (!g || g.n_chot !== 1) loi.push('khoảng đọc từ khối: đồng hồ không xếp 11 tiêu chí vào phai-tach trên bản sửa khối');
  return { loi, mo: 'bản sao sửa khối (cho_phep_den 10, tach_tu 11): thẻ đỏ + chan, đồng hồ phai-tach' };
});
await ca('AC-1-hong', async () => {
  { const t0 = theDu(KIT, kho11('draft')); doiChung('thẻ 11 tiêu chí', t0.co && !t0.co.loi ? [] : [JSON.stringify(t0.co)]); }
  const goi = banSao(); const loi = [];
  const f = path.join(goi, 'skills/cat-luot/SKILL.md'); const t0 = fs.readFileSync(f, 'utf8');
  const m = t0.match(/<!-- <<<CAT-LUOT-CO -->[\s\S]*?<!-- CAT-LUOT-CO>>> -->\n/);
  if (!m) throw new Error('không thấy khối CAT-LUOT-CO để gỡ');
  fs.writeFileSync(f, t0.replace(m[0], ''));
  const t = theDu(goi, kho11('draft'));
  if (t.ma !== 0) loi.push(`thẻ thoát ${t.ma} khi khối vắng (phải dựng tiếp): ${t.err.slice(0, 200)}`);
  const co = coCo(t.html);
  if (!(co.length === 1 && co[0].lop === 'fwarn' && /không đọc được khoảng cỡ/i.test(co[0].van))) loi.push(`cờ: ${JSON.stringify(co)}`);
  if (!t.co || t.co.chan !== false || !/thiếu khối CAT-LUOT-CO/.test(String(t.co.loi))) loi.push(`extract: ${JSON.stringify(t.co)}`);
  // Vế bộ đọc vắng: bản sao gỡ chính mô-đun — thẻ vẫn dựng, cờ vàng nói ra, không chặn.
  const goi2 = banSao(); fs.rmSync(path.join(goi2, 'scripts', 'co-hop-dong.cjs'));
  const t2 = theDu(goi2, kho11('draft')); const co2 = coCo(t2.html);
  if (t2.ma !== 0) loi.push(`thẻ thoát ${t2.ma} khi thiếu co-hop-dong.cjs: ${t2.err.slice(0, 200)}`);
  if (!(co2.length === 1 && co2[0].lop === 'fwarn' && /không nạp được bộ đọc cỡ/.test(co2[0].van)) || !t2.co || t2.co.chan !== false) loi.push(`thiếu mô-đun: cờ ${JSON.stringify(co2)} extract ${JSON.stringify(t2.co)}`);
  return { loi, mo: 'khối vắng: thẻ thoát 0, cờ vàng «không đọc được khoảng cỡ», loi nêu thông điệp bộ đọc, chan false; thiếu mô-đun: thẻ thoát 0, cờ vàng «không nạp được bộ đọc cỡ»' };
});

// ── AC-2: ma trận cỡ × dòng giữ ───────────────────────────────────────────────────────────────────────
// Bảng VIẾT TRƯỚC: [cỡ, có dòng giữ, cờ mong đợi, chan, chữ quyết, nhóm]. Khoảng 8–10 · tới 12 · từ 13.
const BANG_AC2 = [];
for (let n = 1; n <= 16; n++) for (const giu of [false, true]) {
  const nhom = n <= 7 ? 'duoi-muc-tieu' : n <= 10 ? 'muc-tieu' : n <= 12 ? 'cho-phep' : 'phai-tach';
  const co = n <= 10 ? null : (n >= 13 && !giu ? 'fred' : 'fwarn');
  BANG_AC2.push({ ten: `${n}${giu ? '+giữ' : ''}`, n, giu, nhom, co, chan: co === 'fred', quyet: co === 'fred' ? '___' : 'duyệt' });
}
BANG_AC2.push({ ten: 'không-đọc-được', contract: hopDong({ n: 1 }).replace('- AC-1: Given a0, When b0, Then c0.', 'Mọi thứ phải chạy đúng.'), n: 0, giu: false, nhom: null, co: 'fwarn', chan: false, quyet: 'duyệt', loi: true });
BANG_AC2.push({ ten: '13-dòng-12-mã', contract: hopDong({ n: 13, ids: [...Array.from({ length: 12 }, (_, i) => `AC-${i + 1}`), 'AC-12'] }), n: 12, giu: false, nhom: 'cho-phep', co: 'fwarn', chan: false, quyet: 'duyệt' });
await ca('AC-2', async () => {
  const k = khoangDocLap(KIT); const loi = [];
  for (const h of BANG_AC2) {
    const contract = h.contract || hopDong({ n: h.n, dang: h.n % 2 ? 'gach' : 'tieu-de' });
    const t = theDu(KIT, khoThu({ contract, decisions: h.giu ? DONG_GIU('d-giu-1') + '\n' : '' }));
    const co = coCo(t.html); const v = [];
    if ((co.length ? co[0].lop : null) !== h.co || co.length > 1) v.push(`cờ ${JSON.stringify(co.map(x => x.lop))} ≠ ${h.co}`);
    if (h.co === 'fred') {
      const i = t.html.indexOf('co-hd'); const j = viTriSeLam(t.html);
      if (!(i >= 0 && (j < 0 || i < j))) v.push('cờ đỏ không đứng trước khối «Hệ thống SẼ làm»');
    }
    if (!t.j || typeof t.j.one_shot !== 'string' || !t.j.one_shot.endsWith(` ${h.quyet}`)) v.push(`câu gộp «${t.j && t.j.one_shot}» không kết bằng ${h.quyet}`);
    if (!t.co) v.push('extract thiếu co_hop_dong');
    else {
      if (t.co.n !== h.n) v.push(`n ${t.co.n} ≠ ${h.n}`);
      if (t.co.nhom !== h.nhom) v.push(`nhom ${t.co.nhom} ≠ ${h.nhom}`);
      if (t.co.chan !== h.chan) v.push(`chan ${t.co.chan} ≠ ${h.chan}`);
      if (h.giu ? !(t.co.giu && t.co.giu.id === 'd-giu-1') : t.co.giu !== null) v.push(`giu ${JSON.stringify(t.co.giu)}`);
      if (!!t.co.loi !== !!h.loi) v.push(`loi ${JSON.stringify(t.co.loi)}`);
    }
    if (co.length === 1) {
      const van = giaiHtml(co[0].van);
      if (h.loi) { if (!/không đọc được tiêu chí/i.test(van)) v.push('văn cờ không nói «không đọc được tiêu chí»'); }
      else {
        if (!van.includes(`${h.n} tiêu chí`)) v.push(`văn cờ thiếu «${h.n} tiêu chí»`);
        if (h.co === 'fred' && !van.includes(`từ ${k.t}`)) v.push(`văn cờ đỏ thiếu ngưỡng «từ ${k.t}»`);
        if (h.co === 'fwarn' && !h.giu && !van.includes(`${k.a}–${k.b}`)) v.push(`văn cờ vàng thiếu mục tiêu «${k.a}–${k.b}»`);
        if (h.giu && !(van.includes('d-giu-1') && van.includes('kết quả một màn không tách được mà giữ nghĩa'))) v.push('văn cờ thiếu mã hoặc lý do dòng giữ');
        if (h.co === 'fred' && !van.includes('giữ cỡ — <lý do>')) v.push('cờ đỏ không in chuỗi giữ nguyên văn');
      }
    }
    if (v.length) loi.push(`[${h.ten}] ${v.join('; ')}`);
  }
  return { loi, mo: `${BANG_AC2.length} ca ma trận viết trước (cỡ 1…16 × không/có dòng giữ + không đọc được tiêu chí + 13 dòng 12 mã), mỗi ca một khẳng định gộp năm vế` };
});
await ca('AC-2-vong', async () => {
  const loi = [];
  const root = khoThu({ contract: hopDong({ n: 14 }) });
  const t = theDu(KIT, root);
  const m = giaiHtml((coCo(t.html)[0] || {}).van || '').match(/«([^«»]*?)<lý do>»/);
  if (!m) return { loi: ['không rút được chuỗi giữ từ HTML thẻ đỏ'] };
  ghi(root, '_acceptance/g/decisions.jsonl', JSON.stringify({ id: 'd-vong-1', type: 'approach', stage: 'gate1', at: '2026-10-12T00:00:00Z', decision: `${m[1]}vì sao giữ`, why: 'w', cost_if_wrong: 'c' }) + '\n');
  const t2 = theDu(KIT, root);
  if (!t2.co || t2.co.chan !== false || !t2.co.giu || t2.co.giu.id !== 'd-vong-1') loi.push(`chuỗi in trên thẻ không được bộ đọc nhận: ${JSON.stringify(t2.co)}`);
  return { loi, mo: `chuỗi «${m[1]}» rút từ thẻ đỏ, ghép lý do, ghi sổ → thẻ dựng lại chan false` };
});
await ca('AC-2-do', async () => {
  { const t0 = theDu(KIT, khoThu({ contract: hopDong({ n: 13 }) })); doiChung('13 tiêu chí không dòng giữ', t0.co && t0.co.chan === true ? [] : [JSON.stringify(t0.co)]); }
  const goi = banSao();
  tiem(goi, 'scripts/co-hop-dong.cjs', 'if (n <= k.cho_phep_den) return \'cho-phep\';', 'if (n <= k.tach_tu) return \'cho-phep\';');
  const t = theDu(goi, khoThu({ contract: hopDong({ n: 13 }) }));
  if (t.co && t.co.chan === false) return { mo: 'bản sao nới ngưỡng tách trong nhomCo: 13 tiêu chí không dòng giữ ra chan false — «ngưỡng tách lệch khối» bắt được' };
  return { loi: [`ngưỡng tách lệch khối KHÔNG đổi kết luận: ${JSON.stringify(t.co)}`] };
});

// ── AC-3: bộ đọc dòng giữ — thẻ và đồng hồ cùng kết luận ───────────────────────────────────────────────
const J = (id, d) => JSON.stringify({ id, type: 'approach', stage: 'S1', at: '2026-10-12T00:00:00Z', decision: d, why: 'w', cost_if_wrong: 'c' });
const BANG_AC3 = [
  { ten: 'hợp lệ', so: J('d-1', 'giữ cỡ — một màn'), nhan: 'd-1' },
  { ten: 'NFD', so: J('d-1', 'giữ cỡ — một màn'.normalize('NFD')), nhan: 'd-1' },
  { ten: 'khoảng trắng đầu', so: J('d-1', '   giữ cỡ — một màn'), nhan: 'd-1' },
  { ten: 'gạch ngắn', so: J('d-1', 'giữ cỡ – một màn'), nhan: 'd-1' },
  { ten: 'gạch thường', so: J('d-1', 'giữ cỡ - một màn'), nhan: 'd-1' },
  { ten: 'sau dòng hỏng', so: '{hỏng\n' + J('d-2', 'giữ cỡ — một màn'), nhan: 'd-2' },
  { ten: 'không dấu', so: J('d-1', 'giu co — một màn'), nhan: null },
  { ten: 'giữa câu', so: J('d-1', 'ta giữ cỡ — một màn'), nhan: null },
  { ten: 'không lý do', so: J('d-1', 'giữ cỡ —    '), nhan: null },
  { ten: 'hai dòng', so: J('d-1', 'giữ cỡ — a') + '\n' + J('d-2', 'giữ cỡ — b'), nhan: 'd-1' },
  { ten: 'sổ rỗng', so: '', nhan: null },
  { ten: 'sổ vắng', so: undefined, nhan: null },
  // Nâng phạm vi sau Cổng Bằng chứng lượt 1 (manh trả lại 13/10): dòng giữ bị rút · rút rồi giữ lại · chỗ trống.
  { ten: 'bị rút', so: J('d-1', 'giữ cỡ — một màn') + '\n' + JSON.stringify({ id: 'd-2', type: 'approach', stage: 'S1', at: '2026-10-12T00:00:00Z', decision: 'tách thành hai vòng', why: 'w', cost_if_wrong: 'c', supersedes: 'd-1' }), nhan: null },
  { ten: 'rút rồi giữ lại', so: J('d-1', 'giữ cỡ — a') + '\n' + JSON.stringify({ id: 'd-2', type: 'approach', stage: 'S1', at: '2026-10-12T00:00:00Z', decision: 'tách', why: 'w', cost_if_wrong: 'c', supersedes: 'd-1' }) + '\n' + J('d-3', 'giữ cỡ — b'), nhan: 'd-3' },
  { ten: 'chỗ trống', so: J('d-1', 'giữ cỡ — <lý do>') + '\n' + J('d-2', 'giữ cỡ — <vì sao kết quả không tách được mà giữ nghĩa, 1 câu>'), nhan: null },
];
function chayAC3(goi) {
  const loi = [];
  for (const h of BANG_AC3) {
    const r1 = khoThu({ contract: hopDong({ n: 14 }), decisions: h.so ?? '' });
    if (h.so === undefined) fs.rmSync(path.join(r1, '_acceptance/g/decisions.jsonl'));
    const t = theDu(goi, r1);
    if (!t.co) { loi.push(`[${h.ten}] thẻ sập (không có co_hop_dong): ${t.err.slice(0, 160)}`); continue; }
    const theNhan = t.co.giu ? t.co.giu.id : null;
    const r2 = khoThu({ contract: hopDong({ n: 14, status: 'approved' }), decisions: h.so ?? '' });
    if (h.so === undefined) fs.rmSync(path.join(r2, '_acceptance/g/decisions.jsonl'));
    const d = dongHo(goi, r2); const g = d.j && d.j.nhom.find(x => x.ten === 'phai-tach');
    const dhNhan = g ? g.n_giu : undefined;
    const v = [];
    if (theNhan !== h.nhan) v.push(`thẻ ${theNhan} ≠ ${h.nhan}`);
    if (t.co && t.co.chan !== (h.nhan === null)) v.push(`chan ${t.co.chan}`);
    if (dhNhan !== (h.nhan ? 1 : 0)) v.push(`đồng hồ n_giu ${dhNhan} ≠ ${h.nhan ? 1 : 0}`);
    if (v.length) loi.push(`[${h.ten}] ${v.join('; ')}`);
  }
  return loi;
}
await ca('AC-3', async () => ({ loi: chayAC3(KIT), mo: `${BANG_AC3.length} ca sổ viết trước, mỗi ca hai khẳng định (thẻ + đồng hồ) cùng kết luận` }));
await ca('AC-3-do-rut', async () => {
  doiChung('ma trận sổ', chayAC3(KIT));
  const goi = banSao();
  tiem(goi, 'scripts/co-hop-dong.cjs', 'const biRut = new Set(ds.filter(e => e.supersedes != null).flatMap(e => [].concat(e.supersedes)).map(String));', 'const biRut = new Set();');
  const loi = chayAC3(goi);
  const rut = loi.find(l => l.startsWith('[bị rút]'));
  if (rut && /thẻ d-1 ≠ null/.test(rut) && /n_giu 1 ≠ 0/.test(rut)) return { mo: 'bản sao bỏ bước xét supersedes: ca «bị rút» ra «nhận» ở CẢ thẻ lẫn đồng hồ — «dòng giữ đã rút vẫn mở cổng» bắt được' };
  return { loi: [`bỏ xét supersedes không lật đúng ca «bị rút»: ${loi.join(' | ') || '(không ca nào đỏ)'}`] };
});
await ca('AC-3-do', async () => {
  doiChung('ma trận sổ', chayAC3(KIT));
  const goi = banSao();
  tiem(goi, 'scripts/co-hop-dong.cjs', "e.decision.normalize('NFC')", 'e.decision');
  const loi = chayAC3(goi);
  const nfd = loi.find(l => l.startsWith('[NFD]'));
  if (nfd && /thẻ null/.test(nfd) && /n_giu 0/.test(nfd) && loi.length === 1) return { mo: 'bản sao bỏ chuẩn NFC: ca NFD ra «không» ở CẢ thẻ lẫn đồng hồ — hai bên đọc cùng một hàm' };
  return { loi: [`bỏ chuẩn NFC không lật đúng ca NFD ở cả hai bên: ${loi.join(' | ') || '(không ca nào đỏ)'}`] };
});

// ── AC-4: đường đọc-cũ ────────────────────────────────────────────────────────────────────────────────
const DA_QUA = [
  { st: 'approved' },
  { st: 'approved', fm: 'veto_state: mo\nveto_opened_at: 2026-10-05T00:00:00Z\n', lanV: true },
  { st: 'implemented' }, { st: 'verified' }, { st: DA_KY }, { st: MAY_THONG },
];
function chayAC4(goi) {
  const loi = []; const chiTiet = {};
  for (const h of DA_QUA) {
    let c = hopDong({ n: 14, status: h.st, extraFm: h.fm || '' });
    if (h.lanV) c = c.replace('approved_by: A\napproved_at: 2026-10-05T00:00:00Z\n', '');
    const t = theDu(goi, khoThu({ contract: c }));
    const co = coCo(t.html);
    if (!h.lanV) chiTiet[h.st] = { chay: !!t.co, chan: t.co ? t.co.chan : undefined, lop: co.map(x => x.lop) };
    if (co.length || !t.co || t.co.chan !== false) loi.push(`[${h.st}${h.lanV ? ' làn V' : ''}] cờ ${JSON.stringify(co.map(x => x.lop))} chan=${t.co && t.co.chan}`);
  }
  loi.chiTiet = chiTiet;
  return loi;
}
await ca('AC-4', async () => ({ loi: chayAC4(KIT), mo: `${DA_QUA.length} trạng thái đã qua Cổng Phạm vi, 14 tiêu chí không dòng giữ: không cờ cỡ, chan false` }));
await ca('AC-4-do', async () => {
  doiChung('sáu trạng thái', chayAC4(KIT));
  const goi = banSao();
  tiem(goi, 'scripts/co-hop-dong.cjs', "const chan = draft && nhom === 'phai-tach' && !giu;", "const chan = nhom === 'phai-tach' && !giu;");
  const loi = chayAC4(goi); const x = loi.chiTiet[DA_KY] || {};
  // Ghim GIÁ TRỊ của lỗi được tiêm (Ngoài-6 lượt 1): thẻ phải chạy và trả chặn + cờ đỏ — thẻ sập không tính là bắt.
  if (x.chay && x.chan === true && x.lop.includes('fred')) return { mo: `bản sao gỡ điều kiện draft: hồ sơ ${DA_KY} ra chặn — «đường đọc-cũ gãy» bắt được` };
  return { loi: ['gỡ điều kiện draft mà hồ sơ đã qua cổng vẫn không bị chặn — phép đo đường đọc-cũ không sống'] };
});
await ca('AC-4-kho-that', async () => {
  const CHD = require(path.join(KIT, 'scripts', 'co-hop-dong.cjs'));
  const fm = (t, k) => ((t.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [])[1] || '').replace(/\s+#.*$/, '').trim();
  const acc = path.join(KIT, '_acceptance'); const loi = []; let so = 0;
  for (const s of fs.readdirSync(acc).sort()) {
    const fc = path.join(acc, s, 'contract.md'); if (!fs.existsSync(fc)) continue;
    const c = fs.readFileSync(fc, 'utf8'); const st = fm(c, 'status');
    if (!st || st === 'draft') continue;
    const n = CHD.demTieuChi(c); if (n < 11) continue;
    so++;
    const giuTxt = fs.existsSync(path.join(acc, s, 'decisions.jsonl')) ? fs.readFileSync(path.join(acc, s, 'decisions.jsonl'), 'utf8') : '';
    const r = spawnSync('node', [path.join(KIT, 'scripts', 'gate-card.js'), '--root', KIT, '--slug', s, '--gate', '1'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (coCo(r.stdout || '').length) loi.push(`${s} (${st}, ${n}): thẻ ép mang cờ cỡ`);
    // Đối chứng dương trên CÙNG hồ sơ: chép sang kho thử với status: draft.
    const root = mkWs('g', { 'contract.md': c.replace(/^status:.*$/m, 'status: draft').replace(/^slug:.*$/m, 'slug: g'), 'evals.yaml': EVALS, 'decisions.jsonl': giuTxt, 'gap-probe.md': PROBE('clean') });
    const t = theDu(KIT, root); const co = coCo(t.html);
    const mong = n >= 13 && !CHD.dongGiu(giuTxt) ? 'fred' : 'fwarn';
    if (!(co.length === 1 && co[0].lop === mong)) loi.push(`${s} (${n}) chép sang draft: cờ ${JSON.stringify(co.map(x => x.lop))} ≠ ${mong}`);
  }
  if (!so) loi.push('không hồ sơ thật nào ≥ 11 tiêu chí ngoài draft — phép đo không có đối tượng');
  return { loi, mo: `${so} hồ sơ thật ≥ 11 tiêu chí ngoài draft: thẻ ép không cờ cỡ; bản chép draft mang đúng cờ theo cỡ` };
});

// ── AC-5: ba bên đọc cùng một khoá ────────────────────────────────────────────────────────────────────
const TEP_CHAN = ['commands/approve.md', 'feature-loop/skills/feature-loop/SKILL.md'];
const MONG_CHAN = {
  'commands/approve.md': { ghi_duyet: 'khong', loi_ra: 'tach, giu' },
  'feature-loop/skills/feature-loop/SKILL.md': { lan_v: 'khong', moi_nguoi: 'khong', loi_ra: 'tach, giu' },
};
function dongDieuKien(goi, rel) {
  const t = doc(goi, rel);
  const m = t.match(/<!-- <<<CO-HOP-DONG-CHAN -->\n([\s\S]*?)<!-- CO-HOP-DONG-CHAN>>> -->/);
  if (!m) return { loi: `${rel}: thiếu khối CO-HOP-DONG-CHAN` };
  const d = m[1].split('\n').find(l => /^\s*`?khi:/.test(l));
  if (!d) return { loi: `${rel}: khối thiếu dòng «khi:»` };
  const mm = d.replace(/`/g, '').match(/^\s*khi:\s*([\w.]+)\s*=\s*(\S+)\s*→\s*(.+)$/);
  if (!mm) return { loi: `${rel}: dòng «khi:» sai khuôn: ${d}` };
  const cap = {}; for (const p of mm[3].split(' · ')) { const q = p.match(/^\s*(\w+):\s*(.+?)\s*$/); if (q) cap[q[1]] = q[2]; }
  return { duong: mm[1], gt: mm[2], cap, khoi: m[1] };
}
function chayAC5(goi) {
  const CHD = require(path.join(goi, 'scripts', 'co-hop-dong.cjs'));
  const t = theDu(goi, khoThu({ contract: hopDong({ n: 14 }) }));
  const loi = []; const lech = [];
  for (const rel of TEP_CHAN) {
    const d = dongDieuKien(goi, rel); if (d.loi) { loi.push(d.loi); lech.push(rel); continue; }
    const gt = d.duong.split('.').reduce((o, k) => (o == null ? undefined : o[k]), t.j);
    if (gt !== true || d.gt !== 'true') { loi.push(`${rel}: đường khoá ${d.duong} → ${JSON.stringify(gt)} trên thẻ`); lech.push(rel); }
    for (const [k, v] of Object.entries(MONG_CHAN[rel])) if (d.cap[k] !== v) loi.push(`${rel}: ${k}=${d.cap[k]} ≠ ${v}`);
    if (rel === 'commands/approve.md' && !d.khoi.includes(`sửa: ${CHD.GIU_CO_MO_DAU}`)) loi.push(`${rel}: khối thiếu lối «sửa: ${CHD.GIU_CO_MO_DAU}…»`);
  }
  return { loi, lech, j: t.j };
}
await ca('AC-5', async () => ({ loi: chayAC5(KIT).loi, mo: 'hai khối CO-HOP-DONG-CHAN: đường khoá bằng khoá thẻ phát ra (true), từng cặp khoá–giá trị khớp, lệnh duyệt có lối sửa kèm chuỗi giữ' }));
await ca('AC-5-do-khoa', async () => {
  doiChung('hai khối điều kiện', chayAC5(KIT).loi);
  const goi = banSao();
  tiem(goi, 'scripts/gate-card.js', 'co_hop_dong: coHD,', 'co_hop_dong_x: coHD,');
  const { lech, j } = chayAC5(goi);
  // Ghim GIÁ TRỊ của lỗi được tiêm: bản sao chạy, phát khoá đã đổi tên và không còn khoá cũ — thẻ sập không tính.
  const dungKim = !!j && j.co_hop_dong_x !== undefined && j.co_hop_dong === undefined;
  if (dungKim && lech.length === 2 && TEP_CHAN.every(r => lech.includes(r))) return { mo: 'bản sao đổi tên khoá ở thẻ: liệt đúng hai tệp lệch' };
  return { loi: [`đổi tên khoá: thẻ chạy=${!!j} khoá-đổi=${dungKim} tệp lệch=${JSON.stringify(lech)}`] };
});
await ca('AC-5-do-nghia', async () => {
  doiChung('hai khối điều kiện', chayAC5(KIT).loi);
  const goi = banSao();
  tiem(goi, 'feature-loop/skills/feature-loop/SKILL.md', '→ lan_v: khong', '→ lan_v: co');
  const { loi } = chayAC5(goi);
  if (loi.some(l => l.includes('lan_v=co'))) return { mo: 'bản sao đổi lan_v khong → co: «khối cho làn V khi khoá đúng» bắt được' };
  return { loi: ['khối cho làn V khi khoá đúng mà ca vẫn xanh'] };
});

// ── AC-6: năm chỗ dạy ─────────────────────────────────────────────────────────────────────────────────
const BON_TEP = ['feature-loop/skills/feature-loop/SKILL.md', 'skills/acceptance/SKILL.md', 'skills/acceptance/references/contract-template.md', 'GUIDE.md'];
const NGUONG_CU = /\b5\s*[-–]\s*15\b|>\s*15\b/;
const CHU_CO = /\bAC\b|criteri|tiêu chí|\bCore\b/i;
function cayDay(goi) {
  const ra = [];
  const di = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') di(p); } else if (/\.(md|mjs|cjs|js|json|ya?ml)$/.test(e.name)) ra.push(p); } };
  for (const t of ['skills', 'feature-loop', 'commands', 'dieu-phoi']) if (fs.existsSync(path.join(goi, t))) di(path.join(goi, t));
  for (const t of TEP_GOC) if (fs.existsSync(path.join(goi, t))) ra.push(path.join(goi, t));
  return ra;
}
function chayAC6(goi) {
  const k = khoangDocLap(goi); const cau = `mục tiêu ${k.a}–${k.b} · cho phép tới ${k.c} · từ ${k.t}`;
  const thieu = []; const loi = [];
  for (const rel of BON_TEP) { const t = doc(goi, rel); if (!t.includes(cau) || !t.includes('CAT-LUOT-CO')) thieu.push(rel); }
  const fl = doc(goi, BON_TEP[0]); const s1 = fl.slice(fl.indexOf('## S1 —'));
  const b3 = (s1.match(/\n3\. [\s\S]*?(?=\n4\. )/) || [''])[0]; const b4 = (s1.match(/\n4\. [\s\S]*?(?=\n5\. )/) || [''])[0];
  if (!b3.includes(cau)) loi.push('SKILL Feature Loop: đoạn bước S1#3 thiếu câu khoảng');
  if (!b4.includes(cau)) loi.push('SKILL Feature Loop: đoạn bước S1#4 thiếu câu khoảng');
  const cayTep = cayDay(goi); const cu = [];
  for (const f of cayTep) fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (NGUONG_CU.test(l) && CHU_CO.test(l)) cu.push(`${path.relative(goi, f)}:${i + 1}`); });
  return { cau, thieu, loi, cu, soTep: cayTep.length };
}
await ca('AC-6', async () => {
  const r = chayAC6(KIT); const loi = [...r.loi];
  if (r.thieu.length) loi.push(`thiếu câu «${r.cau}» hoặc tên khối: ${r.thieu.join(', ')}`);
  if (r.cu.length) loi.push(`ngưỡng cỡ cũ còn ${r.cu.length} dòng: ${r.cu.slice(0, 8).join(', ')}`);
  return { loi, mo: `câu «${r.cau}» ở đủ bốn tệp (S1#3 và S1#4 riêng từng đoạn); quét lớp ${r.soTep} tệp dạy: 0 dòng ngưỡng cũ` };
});
await ca('AC-6-do-khoi', async () => {
  { const r0 = chayAC6(KIT); doiChung('bốn tệp dạy', [...r0.loi, ...r0.thieu, ...r0.cu]); }
  const goi = banSao();
  tiem(goi, 'skills/cat-luot/SKILL.md', '\nmuc_tieu: 8-10\n', '\nmuc_tieu: 6-9\n');
  const r = chayAC6(goi);
  if (r.thieu.length === 4 && BON_TEP.every(t => r.thieu.includes(t))) return { mo: 'bản sao sửa muc_tieu 6-9: liệt đúng bốn tệp' };
  return { loi: [`sửa khối mà tệp thiếu = ${JSON.stringify(r.thieu)}`] };
});
await ca('AC-6-do-lop', async () => {
  { const r0 = chayAC6(KIT); doiChung('quét lớp', [...r0.loi, ...r0.thieu, ...r0.cu]); }
  const goi = banSao(); const rel = 'skills/morphological-scan/SKILL.md';
  fs.appendFileSync(path.join(goi, rel), '\nCore >15 → hợp nhất ô.\n');
  const r = chayAC6(goi);
  if (r.cu.length === 1 && r.cu[0].startsWith(`${rel}:`)) return { mo: `bản sao chèn «Core >15» vào ${rel} (ngoài bốn tệp): nêu đúng tệp ấy` };
  return { loi: [`chèn ngưỡng cũ ngoài danh sách mà quét ra ${JSON.stringify(r.cu)}`] };
});

// ── AC-7: đồng hồ cỡ đếm dòng giữ ─────────────────────────────────────────────────────────────────────
// Kho viết trước: [slug, cỡ, trạng thái, ngày chốt, có dòng giữ]. Mốc 2026-10-01.
const MOC = '2026-10-01';
const HS7 = [
  ['a', 3, 'approved', '2026-10-05', true], ['b', 9, DA_KY, '2026-10-05', true], ['c', 9, 'approved', '2026-10-05', false],
  ['d', 12, MAY_THONG, '2026-10-05', true], ['e', 11, 'approved', '2026-09-20', false],
  ['f', 14, 'approved', '2026-10-05', false], ['g', 15, DA_KY, '2026-10-05', true], ['h', 16, DA_KY, '2026-09-01', false],
  ['i', 14, 'draft', null, true], ['j', 13, 'approved', '2026-09-25', true],
];
// Số TAY (viết trước): n_giu theo nhóm [duoi, muc-tieu, cho-phep, phai-tach]; khong-dong = phai-tach không dòng giữ.
const TAY7 = { tat_ca: { n_giu: [1, 1, 1, 2], khong_dong: 2 }, tu_moc: { n_giu: [1, 1, 1, 1], khong_dong: 1 } };
// Báo cáo đã ký dựng từ KHUÔN của bên ghi (evidence-report-template.md), không viết tay frontmatter: hồ sơ `h`
// chốt trước mốc mà KÝ sau mốc — ngày ký phải nằm đúng chỗ bên ghi đặt nó (human_signoff).
const KHUON_BC = (() => { const t = doc(KIT, 'skills/acceptance/references/evidence-report-template.md'); const m = t.match(/\n---\nschema_version: 2[\s\S]*?\n---\n/); if (!m) throw new Error('khuôn báo cáo thiếu frontmatter schema_version 2'); return m[0].trim() + '\n'; })();
const KY_SAU_MOC = { h: '2026-10-08', b: '2026-10-06', g: '2026-10-06' };
const baoCaoKy = (slug, ngay) => { if (!/^human_signoff:/m.test(KHUON_BC)) throw new Error('khuôn báo cáo không có khoá human_signoff'); return KHUON_BC.replace(/^feature_slug:.*$/m, `feature_slug: ${slug}`).replace(/^verdict:.*$/m, 'verdict: PASS').replace(/^human_signoff:.*$/m, `human_signoff: manh ${ngay}`); };
function kho7({ boGiu = false } = {}) {
  const root = thuMuc('kho7');
  for (const [s, n, st, ngay, giu] of HS7) {
    let c = hopDong({ n, status: st }).replace('slug: g', `slug: ${s}`);
    if (ngay) c = c.replace('approved_at: 2026-10-05T00:00:00Z', `approved_at: ${ngay}T00:00:00Z`);
    ghi(root, `_acceptance/${s}/contract.md`, c);
    ghi(root, `_acceptance/${s}/decisions.jsonl`, giu && !boGiu ? DONG_GIU(`d-${s}`) + '\n' : '');
    if (KY_SAU_MOC[s]) ghi(root, `_acceptance/${s}/evidence-report.md`, baoCaoKy(s, KY_SAU_MOC[s]));
  }
  return root;
}
const TEN_NHOM = ['duoi-muc-tieu', 'muc-tieu', 'cho-phep', 'phai-tach'];
function chayAC7(goi) {
  const loi = []; const root = kho7(); const rootTron = kho7({ boGiu: true });
  for (const [nhan, extra, tay] of [['tất cả', [], TAY7.tat_ca], [`--tu ${MOC}`, ['--tu', MOC], TAY7.tu_moc]]) {
    const d = dongHo(goi, root, extra); const d0 = dongHo(goi, rootTron, extra);
    if (!d.j || !d0.j) { loi.push(`[${nhan}] đồng hồ không in JSON: ${d.err.slice(0, 200)}`); continue; }
    TEN_NHOM.forEach((ten, i) => {
      const g = d.j.nhom.find(x => x.ten === ten); const g0 = d0.j.nhom.find(x => x.ten === ten);
      if (!g || g.n_giu !== tay.n_giu[i]) loi.push(`[${nhan}] ${ten}: n_giu ${g && g.n_giu} ≠ tay ${tay.n_giu[i]}`);
      for (const k of ['n_chot', 'n', 'luot_tb', 'cham_tran_pt', 'it_du_lieu']) if (g && g0 && JSON.stringify(g[k]) !== JSON.stringify(g0[k])) loi.push(`[${nhan}] ${ten}.${k} đổi khi có dòng giữ`);
    });
    const pt = d.j.nhom.find(x => x.ten === 'phai-tach');
    if (!pt || pt.n_chot - pt.n_giu !== tay.khong_dong) loi.push(`[${nhan}] phai-tach n_chot − n_giu = ${pt && pt.n_chot - pt.n_giu} ≠ tay ${tay.khong_dong}`);
  }
  return loi;
}
await ca('AC-7', async () => ({ loi: chayAC7(KIT), mo: `kho ${HS7.length} hồ sơ viết trước, hai lượt (không mốc / --tu ${MOC}): n_giu bốn nhóm + n_chot − n_giu phai-tach bằng số tay; năm trường cũ không đổi khi gỡ dòng giữ` }));
await ca('AC-7-do', async () => {
  doiChung('đồng hồ kho 10 hồ sơ', chayAC7(KIT));
  const goi = banSao();
  tiem(goi, 'scripts/cat-luot.mjs', 'n_giu: g.filter(x => x.giu).length', 'n_giu: g.length');
  const loi = chayAC7(goi);
  if (loi.some(l => /n_giu .* ≠ tay/.test(l))) return { mo: 'bản sao đếm n_giu bằng mọi hồ sơ của nhóm: lệch số tay — «n_giu phải đếm dòng giữ» bắt được' };
  return { loi: ['n_giu đếm mọi hồ sơ mà ca vẫn xanh'] };
});

// ── AC-8: bên ghi (khối DEC-GIU-CO + DEC-ID-RECIPE của SKILL Feature Loop) → thẻ thật ──────────────────
function chayAC8(goi) {
  const fl = doc(goi, 'feature-loop/skills/feature-loop/SKILL.md');
  const recipe = (fl.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([\s\S]*?)```\n<!-- DEC-ID-RECIPE>>> -->/) || [])[1];
  const giua = (fl.match(/<!-- <<<DEC-GIU-CO -->\n```\n([\s\S]*?)```\n<!-- DEC-GIU-CO>>> -->/) || [])[1];
  if (!recipe || !giua) return { loi: [`SKILL Feature Loop thiếu khối ${!recipe ? 'DEC-ID-RECIPE' : 'DEC-GIU-CO'}`] };
  const dongs = recipe.split('\n'); if (dongs.length < 3) return { loi: ['DEC-ID-RECIPE sai khuôn (cần ba dòng)'] };
  const dongGiua = giua.trim().replace(/<ISO>/g, '2026-10-12T00:00:00Z').replace(/<[^<>]*>/g, 'x');
  const lenh = [dongs[0].replace(/<slug>/g, 'g'), dongGiua, ...dongs.slice(2)].join('\n');
  const root = khoThu({ contract: hopDong({ n: 14 }) });
  const r = spawnSync('bash', ['-c', lenh], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) return { loi: [`chạy DEC-ID-RECIPE thoát ${r.status}: ${r.stderr.slice(0, 200)}`] };
  const so = doc(root, '_acceptance/g/decisions.jsonl').trim().split('\n'); let e;
  try { e = JSON.parse(so[so.length - 1]); } catch { return { loi: [`dòng sổ mới không parse được: ${so[so.length - 1]}`] }; }
  const kv = giua.match(/"type":"([^"]+)","stage":"([^"]+)"/);
  const loi = [];
  if (!kv || e.type !== kv[1] || e.stage !== kv[2]) loi.push(`type/stage ${e.type}/${e.stage} lệch khối`);
  const t = theDu(goi, root);
  return { loi, t, id: e.id };
}
await ca('AC-7-do-ngay-ky', async () => {
  doiChung('đồng hồ kho 10 hồ sơ', chayAC7(KIT));
  const goi = banSao();
  // the-luot-cat (21/10): ngayChot nhận thêm sổ quyết định (mốc chốt = seal Cổng 1 sớm nhất) — kim đổi theo, nhát tiêm giữ nghĩa.
  tiem(goi, 'scripts/cat-luot.mjs', '      const d = ngayChot(c, so);', "      const d = ngayDau(frontmatterField(doc(path.join(acc, slug, 'evidence-report.md')) || '', 'human_signoff')) || ngayChot(c, so);");
  const loi = chayAC7(goi);
  if (loi.some(l => l.startsWith(`[--tu ${MOC}] phai-tach n_chot − n_giu = 2 ≠ tay 1`))) return { mo: 'bản sao cho --tu lọc theo ngày ký: hồ sơ h (chốt trước mốc, ký sau mốc) lọt vào nhóm — «--tu lọc theo ngày ký» bắt được' };
  return { loi: [`lọc theo ngày ký mà ca không lệch đúng chỗ: ${loi.join(' | ') || '(xanh)'}`] };
});
await ca('AC-8', async () => {
  const r = chayAC8(KIT); if (!r.t) return r;
  if (!r.t.co || r.t.co.chan !== false || !r.t.co.giu || r.t.co.giu.id !== r.id) r.loi.push(`thẻ không nhận dòng vừa ghi: ${JSON.stringify(r.t.co)}`);
  return { loi: r.loi, mo: `DEC-GIU-CO + DEC-ID-RECIPE chạy nguyên văn: dòng ${r.id} parse được, thẻ nhận là dòng giữ (chan false)` };
});
await ca('AC-8-do', async () => {
  { const r0 = chayAC8(KIT); doiChung('bên ghi → thẻ', r0.t && r0.t.co && r0.t.co.chan === false ? r0.loi : [...(r0.loi || []), JSON.stringify(r0.t && r0.t.co)]); }
  const goi = banSao();
  const fl = doc(goi, 'feature-loop/skills/feature-loop/SKILL.md');
  const khoi = (fl.match(/<!-- <<<DEC-GIU-CO -->[\s\S]*?<!-- DEC-GIU-CO>>> -->/) || [''])[0];
  if (!khoi.includes('giữ cỡ')) throw new Error('khối DEC-GIU-CO không chứa «giữ cỡ»');
  fs.writeFileSync(path.join(goi, 'feature-loop/skills/feature-loop/SKILL.md'), fl.replace(khoi, khoi.replace('giữ cỡ', 'giữ co')));
  const r = chayAC8(goi);
  if (r.t && r.t.co && r.t.co.chan === true) return { mo: 'bản sao khối đổi «cỡ» → «co»: thẻ trả chan true — «bên ghi lệch bên đọc» bắt được' };
  return { loi: [`bên ghi lệch mà thẻ vẫn nhận: ${JSON.stringify(r.t && r.t.co)}`] };
});

console.log(`Results: ${pass} passed, ${fail} failed (co-hop-dong, ${daChay} ca)`);
if (!daChay) { console.log('  FAIL: không ca nào chạy'); process.exit(1); }
process.exit(fail ? 1 : 0);
