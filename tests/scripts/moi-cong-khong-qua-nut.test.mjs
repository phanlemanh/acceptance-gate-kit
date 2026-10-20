// moi-cong-khong-qua-nut.test.mjs — hồ sơ moi-cong-khong-qua-nut (KY1, chủ kho quyết 19/10). Lời mời ở cổng chờ người
// kết lượt bằng chữ thường: trang thẻ gửi bằng công cụ gửi tệp, dòng lệnh trong khối ```text, hộp «bước kế» của app chỉ
// mang tóm tắt. Ca MQ-1…MQ-10.
//
// Mọi đầu vào rút từ văn bản thật trong lượt: điều khoản GATE-END-TURN-CLAUSE, bảng GATE-END-TURN-SITES và khuôn
// GATE-END-TURN-TEMPLATE qua marker của tệp luật mặt người; hằng tên lệnh ký và ô quyết rút từ nguồn scripts/gate-card.js;
// luật đợt rút qua hàm ghepLuat thật của gói điều phối. Chiều đỏ: bản lành xanh trước, rồi CHÍNH bộ kiểm chạy trên bản sao
// trong bộ nhớ của văn bản thật bị tiêm (nhát tiêm khớp đúng một lần), ghim thông điệp của đúng hàng bị tiêm.
//
// Chế độ đếm cho Đường đo của hồ sơ: `node tests/scripts/moi-cong-khong-qua-nut.test.mjs --dem <bản ghi .jsonl…>` — đếm
// lượt cổng (lượt có lời gọi Bash chạy gate-card.js) và lượt hỏng (hộp «bước kế» cùng lượt có câu hỏi, có nút, hay nút sai
// luật bỏ nút của app).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const LAW = 'skills/acceptance/references/human-facing-language.md';
const FL = 'feature-loop/skills/feature-loop/SKILL.md';
const ENGINE = ['skills/acceptance/SKILL.md', 'commands/acceptance-card.md', FL];
const DP = { luat: 'dieu-phoi/scripts/mau/LUAT.md', mo: 'dieu-phoi/commands/mo-dot.md', dong: 'dieu-phoi/commands/dong-dot.md', tiep: 'dieu-phoi/commands/tiep-tuc.md' };
const GATE_CARD = 'scripts/gate-card.js';
const TEN_TRO = 'điều khoản kết-lượt-cổng';

// ---------- bộ kiểm (dùng chung cho ca và cho chế độ đếm) ----------

// Luật bộ kiểm áp — mỗi luật mang cụm của nó trong điều khoản (MQ-5-gan so hai chiều).
export const LUAT = [
  { ma: 'nut-lenh', tb: 'nút mang dòng lệnh', cum: 'không nút' },
  { ma: 'nut-dau', tb: 'nút mở đầu «/» hay «!»', cum: 'mở đầu «/» hay «!»' },
  { ma: 'nut-acong', tb: 'nút chứa «@»', cum: 'chứa «@»' },
  { ma: 'nut-dai', tb: 'tin của nút quá 300 ký tự', cum: '300 ký tự' },
  { ma: 'hop-hoi', tb: 'hộp «bước kế» mang câu hỏi ở cổng chờ người', cum: 'không câu hỏi' },
  { ma: 'hop-nut', tb: 'hộp «bước kế» mang nút ở cổng chờ người', cum: 'không nút' },
  { ma: 'chu-quyet', tb: 'chữ quyết điền sẵn', cum: 'máy không tự điền chữ quyết' },
  { ma: 'ngoai-khoi', tb: 'dòng lệnh không nằm trong khối text', cum: '```text' },
];
const TB = Object.fromEntries(LUAT.map(l => [l.ma, l.tb]));
const CUM_BAT_BUOC = ['card.html', 'evidence-page.html', 'SendUserFile', 'in đường dẫn trang', '```text', 'chép đúng như thẻ in', '___', 'wrap_up', 'không câu hỏi và không nút'];
const LENH_KIT_RE = /^\s*\/(acceptance-gate|feature-loop|dieu-phoi):/;
// `(?=\S)` ép nuốt hết khoảng trắng trước khi xét `___` — thiếu nó `\s*` lùi một khoảng và « ___» lọt thành chữ quyết.
const CHU_QUYET_RE = /(ký hay trả|duyệt hay sửa)[ \t]*:[ \t]*(?=\S)(?!___)([^;\n`"]+)/gi;

const khoi = (t, ten) => new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)\\n?<!-- ${ten}>>> -->`).exec(t ?? '');

export function chuQuyet(s) {
  return [...String(s ?? '').matchAll(CHU_QUYET_RE)].map(m => `${TB['chu-quyet']}: «${m[0].trim()}»`);
}

// Hộp «bước kế» (đầu vào của lời gọi wrap_up) ở lượt chờ người.
export function kiemHop(hop, lenh = null) {
  const loi = [];
  if (!hop || typeof hop !== 'object') return ['dòng hộp «bước kế» không phải JSON'];
  if (typeof hop.ask === 'string' && hop.ask.trim()) loi.push(TB['hop-hoi']);
  const ac = Array.isArray(hop.actions) ? hop.actions : [];
  if (ac.length) loi.push(TB['hop-nut']);
  for (const a of ac) {
    for (const s of [a?.label, a?.message].filter(x => typeof x === 'string')) {
      if (/^\s*[/!]/.test(s)) loi.push(TB['nut-dau']);
      if (s.includes('@')) loi.push(TB['nut-acong']);
      if ((lenh && s.includes(lenh)) || LENH_KIT_RE.test(s)) loi.push(TB['nut-lenh']);
      loi.push(...chuQuyet(s));
    }
    if (typeof a?.message === 'string' && a.message.length > 300) loi.push(TB['nut-dai']);
  }
  return [...new Set(loi)];
}

// Khuôn kết lượt: khối ```text mang dòng lệnh + dòng `Hộp «bước kế»: <JSON>`.
export function kiemKhuon(khuon, { lenhGoc, oQuyet }) {
  const loi = [];
  const fence = /```text\n([\s\S]*?)```/.exec(khuon);
  const trong = (fence ? fence[1] : '').split('\n').map(s => s.trim()).filter(Boolean);
  const ngoai = fence ? khuon.replace(fence[0], '') : khuon;
  const lenh = trong.find(s => LENH_KIT_RE.test(s)) ?? null;
  if (!lenh || ngoai.split('\n').some(s => LENH_KIT_RE.test(s))) loi.push(TB['ngoai-khoi']);
  if (lenh && !lenh.startsWith(lenhGoc + ' ')) loi.push(`dòng lệnh không mở đầu bằng ${lenhGoc}`);
  if (lenh && !lenh.includes(oQuyet)) loi.push(`dòng lệnh thiếu ô quyết «${oQuyet}»`);
  loi.push(...chuQuyet(khuon.replace(/^Hộp «bước kế».*$/m, '')));
  const dong = /^Hộp «bước kế»: (.*)$/m.exec(khuon);
  if (!dong) loi.push('thiếu dòng hộp «bước kế»');
  else {
    let hop = null;
    try { hop = JSON.parse(dong[1]); } catch { /* dòng hỏng */ }
    if (hop && typeof hop.recap !== 'string') loi.push('hộp «bước kế» thiếu recap');
    loi.push(...kiemHop(hop, lenh));
  }
  return { loi: [...new Set(loi)], lenh, hop: dong?.[1] ?? null };
}

// ---------- đọc văn bản thật ----------

function docVan() {
  const v = {};
  const doc = rel => { v[rel] = readFileSync(path.join(KIT, rel), 'utf8'); };
  for (const rel of [LAW, ...ENGINE, ...Object.values(DP), GATE_CARD]) doc(rel);
  const b = docBang(v[LAW]);
  for (const rel of Object.keys(b.decl ?? {})) if (!(rel in v)) doc(rel);
  return v;
}

export function rutDieuKhoan(law) {
  const m = khoi(law, 'GATE-END-TURN-CLAUSE');
  return m ? m[1].trim() : null;
}

function kiemDieuKhoan(law) {
  const c = rutDieuKhoan(law);
  if (c === null) return ['không rút được GATE-END-TURN-CLAUSE'];
  if (!c || c.includes('\n')) return ['điều khoản phải là một dòng có chữ'];
  const loi = CUM_BAT_BUOC.filter(x => !c.includes(x)).map(x => `điều khoản thiếu: ${x}`);
  const iMoi = law.indexOf('<!-- GATE-INVITE-CLAUSE>>> -->');
  if (iMoi < 0 || law.indexOf('<!-- <<<GATE-END-TURN-CLAUSE -->') < iMoi) loi.push('điều khoản đứng trước GATE-INVITE-CLAUSE');
  return loi;
}

function docBang(law) {
  const m = khoi(law, 'GATE-END-TURN-SITES');
  if (!m) return { err: 'không rút được GATE-END-TURN-SITES' };
  const decl = {};
  for (const line of m[1].split('\n')) {
    const tok = line.trim().split(/\s+/).filter(Boolean);
    if (!tok.length) continue;
    if (tok.length !== 2 || !/^\d+$/.test(tok[1])) return { err: `dòng bảng hỏng: ${line}` };
    decl[tok[0]] = Number(tok[1]);
  }
  return { decl };
}

const lanXuatHien = (t, neo) => { const o = []; let i = t.indexOf(neo); while (i >= 0) { o.push(i); i = t.indexOf(neo, i + 1); } return o; };

function kiemChep(v) {
  const c = rutDieuKhoan(v[LAW]);
  if (!c) return { loi: ['không rút được GATE-END-TURN-CLAUSE'], bang: [] };
  const b = docBang(v[LAW]);
  if (b.err) return { loi: [b.err], bang: [] };
  const neo = c.split(' ').slice(0, 3).join(' ');
  const loi = []; const bang = [];
  for (const [rel, khai] of Object.entries(b.decl)) {
    const t = v[rel] ?? '';
    const occ = lanXuatHien(t, neo);
    bang.push(`${rel} · khai ${khai} · đếm ${occ.length}`);
    if (occ.some(i => t.slice(i, i + c.length) !== c)) loi.push(`${rel}: bản chép lệch`);
    if (occ.length < khai) loi.push(`${rel}: ít-hơn-số-khai (${occ.length} < ${khai})`);
    if (occ.length > khai) loi.push(`${rel}: nhiều-hơn-số-khai (${occ.length} > ${khai})`);
  }
  if (Object.keys(b.decl).length < 7) loi.push(`bảng chỗ chép quá ít dòng (${Object.keys(b.decl).length} < 7)`);
  for (const rel of [...ENGINE, ...Object.values(DP)]) if (!(rel in b.decl)) loi.push(`bảng chỗ chép thiếu ${rel}`);
  return { loi, bang };
}

function kiemGhepCap(v) {
  const c = rutDieuKhoan(v[LAW]);
  const moi = khoi(v[LAW], 'GATE-INVITE-CLAUSE')?.[1]?.trim();
  if (!c || !moi) return { loi: ['không rút được điều khoản'], dem: 0 };
  const loi = []; let dem = 0;
  for (const rel of ENGINE) {
    const t = v[rel];
    for (const i of lanXuatHien(t, moi)) {
      dem += 1;
      const sau = t.slice(i + moi.length);
      const doan = sau.split(/\n[ \t]*\n/)[0];
      if (!doan.includes(c)) { loi.push(`lời mời cổng không kèm điều khoản kết lượt: ${rel}`); break; }
    }
  }
  return { loi, dem };
}

function mucCua(t, dau) {
  const i = t.indexOf(dau);
  if (i < 0) return '';
  const j = t.indexOf('\n## ', i + dau.length);
  return t.slice(i, j < 0 ? undefined : j);
}

function kiemFeatureLoop(v) {
  const t = v[FL]; const c = rutDieuKhoan(v[LAW]) ?? '\u0000';
  const doanDang = t.split(/\n[ \t]*\n/).find(p => p.includes('`moi: true` → in lại slug')) ?? '';
  const hang = [
    ['Cổng Đáng', doanDang],
    ['Cổng 1', mucCua(t, '\n## GATE 1')],
    ['Cổng 1.5', mucCua(t, '\n## S2')],
    ['Cổng Bằng chứng', mucCua(t, '\n## GATE 2')],
  ].map(([ten, muc]) => ({ ten, co: muc.includes(c) ? 'điều khoản' : muc.includes(TEN_TRO) ? 'chỗ trỏ' : null }));
  const loi = hang.filter(h => !h.co).map(h => `${h.ten}: thiếu kết-lượt-cổng`);
  const dinh = t.split('\n').find(l => l.startsWith('- **[5] Đính**')) ?? '';
  if (!dinh.includes('SendUserFile')) loi.push('bước Đính: thiếu SendUserFile');
  return { loi, hang };
}

function kiemGan(clause) {
  const loi = LUAT.filter(l => !clause.includes(l.cum)).map(l => `luật bộ kiểm không có trong điều khoản: ${l.tb}`);
  const i = clause.indexOf('vì app bỏ');
  if (i < 0) loi.push('điều khoản thiếu vế «vì app bỏ»');
  const dau = i < 0 ? [] : [...clause.slice(i).matchAll(/«([^»]+)»|(\d+)/g)].map(m => m[1] ?? m[2]);
  for (const d of dau) if (!LUAT.some(l => l.cum.includes(d))) loi.push(`dấu cấm của điều khoản không có luật bộ kiểm: ${d}`);
  return { loi, dau };
}

async function kiemDieuPhoi(v) {
  const c = rutDieuKhoan(v[LAW]) ?? '\u0000';
  const { ghepLuat } = await import(pathToFileURL(path.join(KIT, 'dieu-phoi', 'scripts', 'goi-dot.mjs')).href);
  const loi = []; const hang = [];
  for (const k of ['mo', 'dong']) {
    const trong = khoi(v[DP[k]], 'CHU-QUYET-CUA-NGUOI')?.[1] ?? '';
    hang.push(`${DP[k]} · trong khối CHU-QUYET-CUA-NGUOI: ${trong.includes(c)}`);
    if (!trong.includes(c)) loi.push(`${DP[k]}: điều khoản ngoài khối CHU-QUYET-CUA-NGUOI`);
  }
  hang.push(`${DP.tiep} · có điều khoản: ${v[DP.tiep].includes(c)}`);
  if (!v[DP.tiep].includes(c)) loi.push(`${DP.tiep}: thiếu điều khoản`);
  const tin = khoi(v[DP.luat], 'LUAT-TIN')?.[1] ?? '';
  const ghep = ghepLuat(v[DP.luat], '# Luật riêng\n');
  hang.push(`${DP.luat} · có: ${v[DP.luat].includes(c)} · trong LUAT-TIN: ${tin.includes(c)} · qua ghepLuat: ${ghep.includes(c)}`);
  if (!v[DP.luat].includes(c)) loi.push(`${DP.luat}: thiếu điều khoản`);
  if (tin.includes(c)) loi.push(`${DP.luat}: điều khoản nằm trong khối LUAT-TIN`);
  if (!ghep.includes(c)) loi.push(`${DP.luat}: luật đợt ghép bởi ghepLuat thiếu điều khoản`);
  return { loi, hang };
}

function tuGateCard(v) {
  const lenhGoc = /const ONE_SHOT_CMD_SIGNOFF = '([^']+)'/.exec(v[GATE_CARD])?.[1];
  const oQuyet = /oneParts\.push\('(ký hay trả: _+)'\)/.exec(v[GATE_CARD])?.[1];
  if (!lenhGoc || !oQuyet) throw new Error(`không rút được hằng lệnh ký hay ô quyết từ ${GATE_CARD}`);
  return { lenhGoc, oQuyet };
}

// ---------- chế độ đếm (Đường đo) ----------

export function demBanGhi(text) {
  const luot = []; let cur = null; let dong = 0;
  const moi = n => { cur = { so: luot.length + 1, dong: n, cong: false, hop: [] }; luot.push(cur); };
  for (const raw of text.split('\n')) {
    dong += 1;
    if (!raw.trim()) continue;
    let o; try { o = JSON.parse(raw); } catch { continue; }
    const content = o?.message?.content;
    if (o?.type === 'user') {
      const laNguoi = typeof content === 'string' || (Array.isArray(content) && content.some(b => b?.type === 'text'));
      if (laNguoi) moi(dong);
      continue;
    }
    if (o?.type !== 'assistant' || !Array.isArray(content)) continue;
    if (!cur) moi(dong);
    for (const b of content) {
      if (b?.type !== 'tool_use') continue;
      if (b.name === 'Bash' && /gate-card\.js/.test(String(b.input?.command ?? ''))) cur.cong = true;
      if (/wrap_up$/.test(String(b.name ?? ''))) cur.hop.push(b.input);
    }
  }
  const cong = luot.filter(l => l.cong);
  const hong = cong.map(l => ({ ...l, loi: [...new Set(l.hop.flatMap(h => kiemHop(h)))] })).filter(l => l.loi.length);
  return { cong: cong.length, hong };
}

function cheDoDem(tep) {
  if (!tep.length) { console.error('dùng: --dem <bản ghi .jsonl…>'); process.exit(2); }
  let cong = 0; const hong = [];
  for (const f of tep) {
    let t; try { t = readFileSync(f, 'utf8'); } catch (e) { console.error(`không đọc được ${f}: ${e.message}`); process.exit(2); }
    const r = demBanGhi(t); cong += r.cong;
    for (const h of r.hong) { hong.push(h); console.log(`${path.basename(f)} · lượt ${h.so} (dòng ${h.dong}): hỏng — ${h.loi.join(' · ')}`); }
  }
  console.log(cong === 0 ? 'lượt cổng 0 · thước vô hiệu' : `lượt cổng ${cong} · lượt hỏng ${hong.length}`);
  process.exit(0);
}

// ---------- ca ----------

let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.MQ_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));

function tiem(s, cu, moi) {
  const n = s.split(cu).length - 1;
  if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
  const r = s.replace(cu, () => moi);
  if (r === s) throw new Error('nhát tiêm không đổi gì');
  return r;
}
const voi = (v, rel, f) => ({ ...v, [rel]: f(v[rel]) });

// Hàng đỏ: kỳ vọng đúng thông điệp ghim có trong danh sách lỗi.
function hangDo(id, nhan, loi, ky) {
  const co = loi.includes(ky);
  console.log(`    ${nhan} · kỳ vọng «${ky}» · thực tế ${JSON.stringify(loi)}`);
  return co ? null : `${id} ${nhan}: thiếu «${ky}»`;
}

async function main() {
  const v = docVan();
  const clause = rutDieuKhoan(v[LAW]);

  if (want('MQ-1')) {
    const l = kiemDieuKhoan(v[LAW]);
    if (l.length) bad('MQ-1', l.join(' | ')); else ok('MQ-1', `điều khoản một dòng ${clause.length} ký tự, đủ ${CUM_BAT_BUOC.length} cụm, đứng sau GATE-INVITE-CLAUSE`);
    if (!l.length) {
      try {
        const loi = [];
        const a = kiemDieuKhoan(tiem(v[LAW], clause, clause.replace('(`SendUserFile`)', '()')));
        loi.push(hangDo('MQ-1-do', '(a) bỏ SendUserFile', a, 'điều khoản thiếu: SendUserFile'));
        const khoiCu = khoi(v[LAW], 'GATE-END-TURN-CLAUSE')[0];
        const doi = tiem(tiem(v[LAW], khoiCu, ''), '<!-- <<<GATE-INVITE-CLAUSE -->', `${khoiCu}\n<!-- <<<GATE-INVITE-CLAUSE -->`);
        loi.push(hangDo('MQ-1-do', '(b) dời lên trước', kiemDieuKhoan(doi), 'điều khoản đứng trước GATE-INVITE-CLAUSE'));
        const f = loi.filter(Boolean); if (f.length) bad('MQ-1-do', f.join(' | ')); else ok('MQ-1-do', '2 hàng đỏ đúng thông điệp');
      } catch (e) { bad('MQ-1-do', e.message); }
    }
  }

  if (want('MQ-2')) {
    const r = kiemChep(v);
    for (const b of r.bang) console.log(`    ${b}`);
    if (r.loi.length) bad('MQ-2', r.loi.join(' | ')); else ok('MQ-2', `${r.bang.length} chỗ chép, mọi bản khớp từng ký tự, đúng số khai`);
    if (!r.loi.length) {
      try {
        const loi = [];
        const a = voi(v, DP.tiep, t => tiem(t, clause, clause.replace('bằng chữ thường', 'bằng chữ thương')));
        loi.push(hangDo('MQ-2-do', '(a) lệch một ký tự', kiemChep(a).loi, `${DP.tiep}: bản chép lệch`));
        const bang = khoi(v[LAW], 'GATE-END-TURN-SITES')[0];
        const b = voi(v, LAW, t => tiem(t, bang, tiem(bang, 'commands/acceptance-card.md 1\n', 'commands/acceptance-card.md 2\n')));
        loi.push(hangDo('MQ-2-do', '(b) số khai 2', kiemChep(b).loi, 'commands/acceptance-card.md: ít-hơn-số-khai (1 < 2)'));
        const c = voi(v, 'commands/acceptance-card.md', t => `${t}\n${clause}\n`);
        loi.push(hangDo('MQ-2-do', '(c) thêm một bản', kiemChep(c).loi, 'commands/acceptance-card.md: nhiều-hơn-số-khai (2 > 1)'));
        const f = loi.filter(Boolean); if (f.length) bad('MQ-2-do', f.join(' | ')); else ok('MQ-2-do', '3 hàng đỏ đúng thông điệp');
      } catch (e) { bad('MQ-2-do', e.message); }
    }
  }

  if (want('MQ-3')) {
    const r = kiemGhepCap(v);
    if (r.loi.length || r.dem !== 5) bad('MQ-3', `${r.dem} lần mời cổng (cần 5) · ${r.loi.join(' | ')}`); else ok('MQ-3', `${r.dem} lần mời cổng, lần nào cũng kèm điều khoản trong cùng đoạn`);
    if (!r.loi.length && r.dem === 5) {
      try {
        const t = v[FL]; const occ = lanXuatHien(t, clause);
        if (occ.length !== 2) throw new Error(`${FL} có ${occ.length} bản (cần 2)`);
        const go = t.slice(0, occ[1]) + t.slice(occ[1] + clause.length);
        const bang = khoi(v[LAW], 'GATE-END-TURN-SITES')[0];
        const w = { ...v, [FL]: go, [LAW]: tiem(v[LAW], bang, tiem(bang, `${FL} 2\n`, `${FL} 1\n`)) };
        const l = hangDo('MQ-3-do', 'gỡ bản đi kèm thứ hai', kiemGhepCap(w).loi, `lời mời cổng không kèm điều khoản kết lượt: ${FL}`);
        const c2 = kiemChep(w).loi;
        if (l) bad('MQ-3-do', l); else if (c2.length) bad('MQ-3-do', `MQ-2 lẽ ra im: ${c2.join(' | ')}`); else ok('MQ-3-do', 'đỏ đúng thông điệp, MQ-2 im');
      } catch (e) { bad('MQ-3-do', e.message); }
    }
  }

  if (want('MQ-4')) {
    const r = kiemFeatureLoop(v);
    for (const h of r.hang) console.log(`    ${h.ten} · ${h.co ?? 'THIẾU'}`);
    if (r.loi.length) bad('MQ-4', r.loi.join(' | ')); else ok('MQ-4', '4 cổng có điều khoản hoặc chỗ trỏ; bước Đính có SendUserFile');
    if (!r.loi.length) {
      try {
        const s2 = mucCua(v[FL], '\n## S2');
        const w = voi(v, FL, t => tiem(t, s2, s2.split(TEN_TRO).join('điều khoản khác')));
        const l = hangDo('MQ-4-do', 'gỡ chỗ trỏ ở S2', kiemFeatureLoop(w).loi, 'Cổng 1.5: thiếu kết-lượt-cổng');
        if (l) bad('MQ-4-do', l); else ok('MQ-4-do', 'đỏ đúng thông điệp');
      } catch (e) { bad('MQ-4-do', e.message); }
    }
  }

  let gc = null; let khuon = null; let loiGc = null;
  try { gc = tuGateCard(v); khuon = khoi(v[LAW], 'GATE-END-TURN-TEMPLATE')?.[1] ?? null; } catch (e) { loiGc = e.message; }
  const rKhuon = gc && khuon ? kiemKhuon(khuon, gc) : null;
  const duong = !!rKhuon && rKhuon.loi.length === 0;   // đối chứng dương của MQ-6, MQ-7 — tính kể cả khi chỉ chạy một ca
  if (want('MQ-5')) {
    if (loiGc) bad('MQ-5', loiGc);
    else if (!khuon) bad('MQ-5', 'không rút được GATE-END-TURN-TEMPLATE');
    else {
      console.log(`    lệnh: ${rKhuon.lenh} · hằng: ${gc.lenhGoc} · ô quyết: ${gc.oQuyet} · hộp: ${rKhuon.hop}`);
      if (rKhuon.loi.length) bad('MQ-5', rKhuon.loi.join(' | ')); else ok('MQ-5', 'khuôn thật 0 lỗi');
    }
    if (clause) {
      const g = kiemGan(clause);
      for (const l of LUAT) console.log(`    luật ${l.ma} · «${l.tb}» · cụm «${l.cum}»`);
      console.log(`    dấu cấm của điều khoản: ${JSON.stringify(g.dau)}`);
      if (g.loi.length) bad('MQ-5-gan', g.loi.join(' | ')); else ok('MQ-5-gan', `${LUAT.length} luật có cụm trong điều khoản; ${g.dau.length} dấu cấm có luật`);
      if (!g.loi.length) {
        try {
          const l = hangDo('MQ-5-gan-do', 'gỡ «hoặc chứa «@»»', kiemGan(tiem(clause, ' hoặc chứa «@»', '')).loi, 'luật bộ kiểm không có trong điều khoản: nút chứa «@»');
          if (l) bad('MQ-5-gan-do', l); else ok('MQ-5-gan-do', 'đỏ đúng thông điệp');
        } catch (e) { bad('MQ-5-gan-do', e.message); }
      }
    } else bad('MQ-5-gan', 'không rút được GATE-END-TURN-CLAUSE');
  }

  const hopGoc = khuon ? /^Hộp «bước kế»: (.*)$/m.exec(khuon)?.[1] : null;
  const thayHop = obj => tiem(khuon, hopGoc, JSON.stringify(obj));
  const goc = () => JSON.parse(hopGoc);

  if (want('MQ-6')) {
    if (!duong) bad('MQ-6', 'đối chứng dương MQ-5 chưa xanh — không chạy chiều đỏ');
    else {
      try {
        const lenh = kiemKhuon(khuon, gc).lenh;
        const hang = [
          ['(1) tin nút là dòng lệnh', { ...goc(), actions: [{ label: 'Ký', message: lenh }] }, TB['nut-lenh']],
          ['(2) nhãn mở đầu «/»', { ...goc(), actions: [{ label: '/ký' }] }, TB['nut-dau']],
          ['(3) tin mở đầu «!»', { ...goc(), actions: [{ label: 'Gửi', message: '!ký' }] }, TB['nut-dau']],
          ['(4) nhãn chứa «@»', { ...goc(), actions: [{ label: 'hỏi @chu-kho' }] }, TB['nut-acong']],
          ['(5) tin 301 ký tự', { ...goc(), actions: [{ label: 'Gửi', message: 'x'.repeat(301) }] }, TB['nut-dai']],
          ['(6) có ask', { ...goc(), ask: 'Ký hay trả?' }, TB['hop-hoi']],
          ['(7) có actions', { ...goc(), actions: [{ label: 'Xem' }] }, TB['hop-nut']],
        ];
        const f = hang.map(([n, o, k]) => hangDo('MQ-6', n, kiemKhuon(thayHop(o), gc).loi, k)).filter(Boolean);
        if (f.length) bad('MQ-6', f.join(' | ')); else ok('MQ-6', `${hang.length}/${hang.length} hàng đỏ đúng thông điệp`);
      } catch (e) { bad('MQ-6', e.message); }
    }
  }

  if (want('MQ-7')) {
    if (!duong) bad('MQ-7', 'đối chứng dương MQ-5 chưa xanh — không chạy chiều đỏ');
    else {
      try {
        const fence = /```text\n([\s\S]*?)```/.exec(khuon)[0];
        const lenh = kiemKhuon(khuon, gc).lenh;
        const hang = [
          ['(1) ký', tiem(khuon, gc.oQuyet, 'ký hay trả: ký'), `${TB['chu-quyet']}: «ký hay trả: ký»`],
          ['(2) trả', tiem(khuon, gc.oQuyet, 'ký hay trả: trả'), `${TB['chu-quyet']}: «ký hay trả: trả»`],
          ['(3) Ký', tiem(khuon, gc.oQuyet, 'ký hay trả: Ký'), `${TB['chu-quyet']}: «ký hay trả: Ký»`],
          ['(4) dòng lệnh ra ngoài khối', tiem(khuon, fence, `${fence.replace(lenh, '')}\n${lenh}`), TB['ngoai-khoi']],
          ['(5) khối rỗng', tiem(khuon, fence, '```text\n```'), TB['ngoai-khoi']],
        ];
        const f = hang.map(([n, k2, k]) => hangDo('MQ-7', n, kiemKhuon(k2, gc).loi, k)).filter(Boolean);
        if (f.length) bad('MQ-7', f.join(' | ')); else ok('MQ-7', `${hang.length}/${hang.length} hàng đỏ đúng thông điệp`);
      } catch (e) { bad('MQ-7', e.message); }
    }
  }

  if (want('MQ-8')) {
    const r = await kiemDieuPhoi(v);
    for (const h of r.hang) console.log(`    ${h}`);
    if (r.loi.length) bad('MQ-8', r.loi.join(' | ')); else ok('MQ-8', 'bốn tệp lời dặn của gói điều phối mang điều khoản đúng chỗ');
    if (!r.loi.length) {
      try {
        const w = voi(v, DP.mo, t => `${tiem(t, clause, '')}\n${clause}\n`);
        const l = hangDo('MQ-8-do', 'dời ra ngoài khối', (await kiemDieuPhoi(w)).loi, `${DP.mo}: điều khoản ngoài khối CHU-QUYET-CUA-NGUOI`);
        if (l) bad('MQ-8-do', l); else ok('MQ-8-do', 'đỏ đúng thông điệp');
      } catch (e) { bad('MQ-8-do', e.message); }
    }
  }

  if (want('MQ-10')) {
    const tmp = mkdtempSync(path.join(tmpdir(), 'moi-cong-'));
    try {
      const u = s => ({ type: 'user', message: { role: 'user', content: s } });
      const kq = id => ({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: 'ok' }] } });
      const a = (id, name, input) => ({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] } });
      const the = id => a(id, 'Bash', { command: 'node /goi/scripts/gate-card.js --root . --slug ho-so-thu --plain _acceptance/ho-so-thu/card-plain.json' });
      const hop = (id, input) => a(id, 'mcp__ccd_turn__wrap_up', input);
      const dongKy = `/acceptance-gate:signoff ho-so-thu ${Array.from({ length: 24 }, (_, i) => `Ngoài-${i + 1}: known-limits`).join('; ')}; ký hay trả: ký`;
      const luot1 = [u('trình thẻ cổng 2'), the('a1'), kq('a1'), hop('a2', { recap: 'Thẻ ký đã gửi.' }), kq('a2')];
      const luot2 = [u('trình lại'), the('b1'), kq('b1'), hop('b2', { recap: 'Chờ ký.', ask: 'Ký hồ sơ chứ?', actions: [{ label: 'Ký', message: dongKy }] }), kq('b2')];
      const luot3 = [u('trình lại lần nữa'), the('c1'), kq('c1'), hop('c2', { recap: 'Chờ ký.', ask: 'Ký hay trả?', actions: [{ label: 'Ký' }, { label: 'Trả' }] }), kq('c2')];
      const luot4 = [u('việc khác'), hop('d1', { recap: 'Xong.', ask: 'Mở PR?', actions: [{ label: '/commit' }] }), kq('d1')];
      const ghi = (ten, ds) => { const f = path.join(tmp, ten); writeFileSync(f, ds.map(o => JSON.stringify(o)).join('\n') + '\n'); return f; };
      const chay = f => spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--dem', f], { encoding: 'utf8' });
      if (dongKy.length <= 300) throw new Error(`dòng ký dựng ${dongKy.length} ký tự — cần > 300`);
      const r = chay(ghi('bon-luot.jsonl', [...luot1, ...luot2, ...luot3, ...luot4]));
      console.log(r.stdout.trim().split('\n').map(s => `    ${s}`).join('\n'));
      const loi = [];
      if (r.status !== 0) loi.push(`thoát ${r.status}: ${r.stderr.trim()}`);
      if (!r.stdout.includes('lượt cổng 3 · lượt hỏng 2')) loi.push('thiếu «lượt cổng 3 · lượt hỏng 2»');
      const d2 = r.stdout.split('\n').find(s => s.includes('lượt 2 ')) ?? '';
      for (const k of [TB['nut-lenh'], TB['nut-dai'], TB['chu-quyet']]) if (!d2.includes(k)) loi.push(`lượt 2 thiếu «${k}»`);
      const d3 = r.stdout.split('\n').find(s => s.includes('lượt 3 ')) ?? '';
      for (const k of [TB['hop-hoi'], TB['hop-nut']]) if (!d3.includes(k)) loi.push(`lượt 3 thiếu «${k}»`);
      if (/lượt [14] /.test(r.stdout)) loi.push('lượt 1 hoặc 4 bị liệt là hỏng');
      const r1 = chay(ghi('mot-luot.jsonl', luot1));
      console.log(`    đối chứng một lượt sạch: ${r1.stdout.trim()}`);
      if (r1.stdout.trim() !== 'lượt cổng 1 · lượt hỏng 0') loi.push(`đối chứng một lượt sạch: ${r1.stdout.trim()}`);
      const r0 = chay(ghi('khong-cong.jsonl', luot4));
      console.log(`    đối chứng không lượt cổng: ${r0.stdout.trim()}`);
      if (r0.stdout.trim() !== 'lượt cổng 0 · thước vô hiệu') loi.push(`đối chứng không lượt cổng: ${r0.stdout.trim()}`);
      if (loi.length) bad('MQ-10', loi.join(' | ')); else ok('MQ-10', 'đếm 3 lượt cổng, 2 lượt hỏng, đúng thông điệp; hai đối chứng đúng');
    } catch (e) { bad('MQ-10', e.message); } finally { rmSync(tmp, { recursive: true, force: true }); }
  }

  console.log(`\nmoi-cong-khong-qua-nut: ${pass} PASS · ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
}

if (process.argv[2] === '--dem') cheDoDem(process.argv.slice(3));
else await main();
