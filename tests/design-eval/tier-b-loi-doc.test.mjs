#!/usr/bin/env node
// Gắn bên viết với bên đọc của Tier B (hồ sơ tier-b-doc-khong-do-duoc): mọi cặp (verdict, exit_intent) bộ quét thật phát ra
// phải có đúng một hàng trong bảng đọc của design-ui-check.md, và ngược lại. Bên viết là scripts/design-scan.js chạy thật
// trong jsdom, không phải danh sách chép tay; bên đọc là khối TIER-B-DOC-KET-QUA của chính tài liệu; tập kết quả hợp lệ rút
// từ khuôn báo cáo bằng chứng. Mọi đường suy từ vị trí tệp này.
//
//   TB0     bộ quét thật cho đúng ma trận viết trước (5 trang-tình huống × 2 chế độ = 10 ô)      (AC-1)
//   TB0b    nguồn bộ quét không khai kết quả hay mã nào ngoài ma trận                              (AC-1)
//   TB1     tập cặp bên viết == tập hàng bên đọc, hai chiều                                       (AC-1)
//   TB2     mỗi hàng ghi kết quả hợp lệ; không-đo-được không bao giờ thành đạt                     (AC-2)
//   TB3     câu đọc cũ chỉ biết ba kết quả không còn trong quy trình                               (AC-2)
//   TB4     hai lời gọi trong công thức, chạy thật trên trang không đo được, trả mã 5               (AC-2)
//   TB5     báo cáo dựng từ từng hàng đi qua bộ kiểm cổng bằng chứng thật                           (AC-6)
//   TB-do-* phá từng vế trên bản sao trong bộ nhớ → CHÍNH phép đo đỏ, ghim thông điệp              (AC-3)

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const nap_ = createRequire(path.join(HERE, 'noop.js'));
const { JSDOM } = nap_('jsdom');
const CONG = nap_(path.join(ROOT, 'lib', 'evidence-core.cjs'));

const doc = (t) => fs.readFileSync(path.join(ROOT, t), 'utf8');
const TAI_LIEU = doc('skills/acceptance/references/design-ui-check.md');
const BO_QUET = doc('scripts/design-scan.js');
const KHUON = doc('skills/acceptance/references/evidence-report-template.md');

const KDD = 'KHONG-DO-DUOC';
const MO = '<!-- <<<TIER-B-DOC-KET-QUA -->';
const DONG = '<!-- TIER-B-DOC-KET-QUA>>> -->';

let pass = 0, fail = 0;
const ok = (m) => { console.log(`PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };

const POLY = [
  'window.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}takeRecords(){return[]}};',
  'window.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};',
  'window.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});',
  'Element.prototype.getBoundingClientRect=function(){return{x:0,y:0,top:0,left:0,right:120,bottom:60,width:120,height:60,toJSON(){return{}}}};',
].join('');

const trang = (than) => `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>t</title></head><body><main>${than}</main></body></html>`;
const dong = (chu) => `<p style="color:${chu};background-color:#ffffff">Chữ thử tương phản.</p>`;
const MAU_LOI = 'color(display-p3 0.93 0.93 0.93)';

// Ma trận viết trước: mỗi tình huống × hai chế độ. `thieuBoDo` gỡ bộ dò sau khi nạp, đúng ca BLOCKED của bên viết.
const TINH_HUONG = [
  { ten: 'dat', html: trang(dong('#000000')), mong: [['PASS', 0], ['PASS', 0]] },
  { ten: 'tu-choi', html: trang(dong('#f5f5f5')), mong: [['REJECT', 2], ['REJECT', 2]] },
  { ten: 'tron', html: trang(dong('#f5f5f5') + dong(MAU_LOI)), mong: [['REJECT', 2], ['REJECT', 2]] },
  { ten: 'khong-do', html: trang(dong(MAU_LOI)), mong: [[KDD, 0], [KDD, 5]] },
  { ten: 'thieu-bo-do', html: trang(dong('#000000')), thieuBoDo: true, mong: [['BLOCKED', 1], ['BLOCKED', 1]] },
];
const CHE_DO = [{}, { requireMeasured: true }];
const SO_O = 10;
// Bảng đọc mong đợi, viết trước: khoá = cặp bộ quét, giá trị = [kết quả ghi, mã ghi].
const BANG_MONG = {
  'PASS/0': ['PASS', '0'],
  'REJECT/2': ['REJECT', '2'],
  'BLOCKED/1': ['BLOCKED', '—'],
  [`${KDD}/0`]: ['BLOCKED', '—'],
  [`${KDD}/5`]: ['BLOCKED', '5'],
};
const SO_LOI_GOI = 2;

function quet(boQuet, html, thieuBoDo, opts) {
  const { window } = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
  const nap = (src) => { const s = window.document.createElement('script'); s.textContent = src; window.document.head.appendChild(s); s.remove(); };
  nap(POLY);
  nap(boQuet);
  if (thieuBoDo) window.impeccableDetect = undefined;
  const v = window.__impeccableDesignScan({ failOn: ['P0'], ...opts });
  window.close();
  return v;
}

function chayMaTran(boQuet) {
  const o = [];
  for (const t of TINH_HUONG) CHE_DO.forEach((c, i) => {
    const v = quet(boQuet, t.html, t.thieuBoDo, c);
    o.push({ ten: t.ten, cheDo: i, verdict: v.verdict, exit: v.exit_intent, mong: t.mong[i] });
  });
  return o;
}

const cap = (v, e) => `${v}/${e}`;

function docBang(taiLieu) {
  const a = taiLieu.indexOf(MO);
  const b = taiLieu.indexOf(DONG);
  if (a < 0 || b < 0 || b < a || taiLieu.indexOf(MO, a + 1) >= 0) return null;
  const hang = [];
  for (const l of taiLieu.slice(a + MO.length, b).split('\n')) {
    const s = l.trim();
    if (!s.startsWith('|')) continue;
    const o = s.replace(/^\||\|$/g, '').split('|').map((x) => x.trim().replace(/`/g, ''));
    if (o.length !== 4 || /^-+$/.test(o[0]) || o[1] === 'scan exit_intent') continue;
    hang.push({ verdict: o[0], exit: o[1], ghi: o[2], ma: o[3] });
  }
  return hang.length ? hang : null;
}

function tapHopLe(khuon) {
  const m = khuon.match(/^verdict: \{\{([A-Z|-]+)\}\}\s*$/m);
  return m ? m[1].split('|') : null;
}

// Phép đo TB1 + TB2 trên ba vật truyền vào, để nhát phá chạy đúng hàm đo trên bản sao.
function doiChieu(taiLieu, oQuanSat, khuon) {
  const tb1 = [];
  const tb2 = [];
  const bang = docBang(taiLieu);
  if (!bang) return { tb1: ['không tìm thấy khối bảng đọc TIER-B-DOC-KET-QUA'], tb2: ['không có bảng đọc để kiểm luật ghi'] };
  const viet = new Set(oQuanSat.map((o) => cap(o.verdict, o.exit)));
  const doc_ = new Set();
  for (const h of bang) {
    const c = cap(h.verdict, h.exit);
    if (doc_.has(c)) tb1.push(`bảng đọc trùng hàng ${c}`);
    doc_.add(c);
    if (!viet.has(c)) tb1.push(`tài liệu có lối đọc ${c} mà bộ quét không phát`);
  }
  for (const c of viet) if (!doc_.has(c)) tb1.push(`bộ quét phát ${c} mà tài liệu chưa có lối đọc`);
  const hopLe = tapHopLe(khuon);
  if (!hopLe) tb2.push('không rút được tập kết quả hợp lệ từ khuôn báo cáo');
  for (const h of bang) {
    const c = cap(h.verdict, h.exit);
    if (hopLe && !hopLe.includes(h.ghi)) tb2.push(`${c} ghi ${h.ghi}, không thuộc tập kết quả của khuôn báo cáo`);
    if (h.verdict === KDD && h.ghi !== 'BLOCKED') tb2.push(`${c} ghi ${h.ghi}: không đo được phải ghi BLOCKED`);
    if (h.ghi === 'PASS' && h.verdict !== 'PASS') tb2.push(`${c} ghi PASS mà bộ quét không báo đạt`);
    if (h.ma !== '—' && h.ma !== h.exit) tb2.push(`${c} ghi mã ${h.ma}, phải chép đúng exit_intent hoặc để —`);
    if (h.ma === '0' && h.ghi !== 'PASS') tb2.push(`${c} để mã 0 đứng cạnh kết quả ${h.ghi}`);
    const m = BANG_MONG[c];
    if (m && h.ghi !== m[0]) tb2.push(`${c} ghi ${h.ghi}, mong ${m[0]}`);
    if (m && h.ma !== m[1]) tb2.push(`${c} ghi mã ${h.ma}, mong ${m[1]}`);
  }
  return { tb1, tb2 };
}

const CAU_CU = ['Three shapes', '(0 PASS · 2 REJECT)', 'else `verdict`: PASS when'];

function kiemCauCu(taiLieu) {
  const loi = CAU_CU.filter((c) => taiLieu.includes(c)).map((c) => `câu đọc cũ còn trong quy trình: «${c}»`);
  const a = taiLieu.indexOf('**Read the verdict**');
  const b = taiLieu.indexOf('**Map to hook-legal evidence**');
  if (a < 0 || b < a) return [...loi, 'không tìm thấy bước đọc kết quả'];
  for (const v of ['PASS', 'REJECT', 'BLOCKED', KDD]) if (!taiLieu.slice(a, b).includes(`\`verdict: "${v}"\``) && !taiLieu.slice(a, b).includes(`"verdict": "${v}"`)) loi.push(`bước đọc không nêu kết quả ${v}`);
  return loi;
}

// Tập kết quả và mã khai trong nguồn hàm quét, để nhánh mới mà ma trận không chạm tới không lọt.
function kiemNguon(boQuet, oQuanSat) {
  const a = boQuet.indexOf('window.__impeccableDesignScan = function');
  if (a < 0) return ['không tìm thấy hàm quét trong nguồn bộ quét'];
  const than = boQuet.slice(a);
  const ketQua = new Set();
  const ma = new Set();
  for (const m of than.matchAll(/\bverdict:\s*([^,\n]+)[,\n]/g)) for (const l of m[1].matchAll(/'([^']+)'/g)) ketQua.add(l[1]);
  for (const m of than.matchAll(/\bexit_intent:\s*([^,\n]+)[,\n]/g)) for (const l of m[1].matchAll(/\b\d+\b/g)) ma.add(l[0]);
  const coKetQua = new Set(oQuanSat.map((o) => o.verdict));
  const coMa = new Set(oQuanSat.map((o) => String(o.exit)));
  const loi = [];
  for (const k of ketQua) if (!coKetQua.has(k)) loi.push(`nguồn bộ quét khai kết quả ${k} mà ma trận chưa phủ`);
  for (const k of ma) if (!coMa.has(k)) loi.push(`nguồn bộ quét khai mã ${k} mà ma trận chưa phủ`);
  if (!ketQua.size || !ma.size) loi.push('không rút được tập kết quả từ nguồn bộ quét');
  return loi;
}

const TRANG_KHONG_DO = TINH_HUONG.find((t) => t.ten === 'khong-do').html;

// Chạy thật từng lời gọi `__impeccableDesignScan({...})` trong bước 3 của công thức.
function kiemLoiGoi(taiLieu, boQuet) {
  const a = taiLieu.indexOf('**Inject + scan');
  const b = taiLieu.indexOf('**Read the verdict**');
  if (a < 0 || b < a) return ['không tìm thấy bước gọi bộ quét'];
  const goi = [...taiLieu.slice(a, b).matchAll(/__impeccableDesignScan\((\{[^)]*\})\)/g)].map((m) => m[1]);
  if (goi.length !== SO_LOI_GOI) return [`công thức có ${goi.length} lời gọi, mong ${SO_LOI_GOI}`];
  const loi = [];
  goi.forEach((lit, i) => {
    const opts = new Function(`return ${lit.replace('<failOn>', "['P0']")}`)();
    const v = quet(boQuet, TRANG_KHONG_DO, false, opts);
    if (v.verdict !== KDD || v.exit_intent !== 5) loi.push(`lời gọi ${i + 1} của công thức trả ${cap(v.verdict, v.exit_intent)}, mong ${KDD}/5`);
  });
  return loi;
}

const baoCao = (ketQuaBaoCao, h) => [
  '---', `verdict: ${ketQuaBaoCao}`, '---', '', '## Evidence', '',
  '- eval: E-design-B', '  run_id: mau-design-B-001', `  verdict: ${h.ghi}`, ...(h.ma === '—' ? [] : [`  exit_code: ${h.ma}`]),
  '  verifier: config:executors.design.ui_check', '  verified_at: 2026-11-10T00:00:00Z', '',
].join('\n');

// Đi qua bộ kiểm thật của cổng bằng chứng: đối chứng dương (ghi đúng theo bảng) và đối chứng âm (tự xưng đạt) trên cùng khối.
function kiemCong(taiLieu, cong) {
  const bang = docBang(taiLieu);
  if (!bang) return ['không có bảng đọc để dựng báo cáo'];
  const loi = [];
  for (const h of bang) {
    const c = cap(h.verdict, h.exit);
    const dungLuat = cong.determineEnforce(baoCao(h.ghi, h));
    if (h.ghi === 'BLOCKED' && dungLuat) loi.push(`${c}: báo cáo BLOCKED bị đưa vào luật của báo cáo đạt`);
    if (h.ghi === 'PASS' && !dungLuat) loi.push(`${c}: báo cáo đạt không vào luật của báo cáo đạt`);
  }
  const h5 = bang.find((h) => h.verdict === KDD && h.exit === '5');
  if (!h5) return [...loi, 'bảng đọc không có hàng mã 5 để dựng đối chứng âm'];
  const r = cong.evaluateEvidence(baoCao('PASS', h5), {});
  if (!r.consistencyFailure) loi.push('cổng bằng chứng không từ chối báo cáo đạt mang mã 5');
  return loi;
}

function pha(text, tu, thanh) {
  const n = text.split(tu).length - 1;
  if (n !== 1) throw new Error(`nhát phá không khớp đúng một chỗ (${n}): ${tu}`);
  return text.replace(tu, thanh);
}

const O = chayMaTran(BO_QUET);

// ── TB0 ──
{
  const lech = O.filter((o) => o.verdict !== o.mong[0] || o.exit !== o.mong[1]).map((o) => `${o.ten}[${o.cheDo}]: ${cap(o.verdict, o.exit)}, mong ${cap(...o.mong)}`);
  if (O.length !== SO_O) lech.push(`số ô ${O.length}, mong ${SO_O}`);
  lech.length ? bad('TB0 ma trận bộ quét thật', lech.join(' | ')) : ok(`TB0 ma trận bộ quét thật đủ ${SO_O} ô`);
}

// ── TB0b ──
const nguon = kiemNguon(BO_QUET, O);
nguon.length ? bad('TB0b nguồn bộ quét không khai gì ngoài ma trận', nguon.join(' | ')) : ok('TB0b nguồn bộ quét không khai gì ngoài ma trận');

// ── TB1, TB2, TB3, TB4, TB5 ──
const goc = doiChieu(TAI_LIEU, O, KHUON);
goc.tb1.length ? bad('TB1 tập cặp hai bên khớp', goc.tb1.join(' | ')) : ok('TB1 tập cặp hai bên khớp');
goc.tb2.length ? bad('TB2 luật ghi của từng hàng', goc.tb2.join(' | ')) : ok('TB2 luật ghi của từng hàng');
const cauCu = kiemCauCu(TAI_LIEU);
cauCu.length ? bad('TB3 câu đọc cũ đã gỡ', cauCu.join(' | ')) : ok('TB3 câu đọc cũ đã gỡ');
const loiGoi = kiemLoiGoi(TAI_LIEU, BO_QUET);
loiGoi.length ? bad('TB4 hai lời gọi trong công thức trả mã 5', loiGoi.join(' | ')) : ok('TB4 hai lời gọi trong công thức trả mã 5');
const cong = kiemCong(TAI_LIEU, CONG);
cong.length ? bad('TB5 báo cáo theo bảng đi qua cổng bằng chứng thật', cong.join(' | ')) : ok('TB5 báo cáo theo bảng đi qua cổng bằng chứng thật');

// ── TB-do: vật lành phải xanh trên cùng fixture trước khi tin màu đỏ ──
const lanh = nguon.length === 0 && goc.tb1.length === 0 && goc.tb2.length === 0 && cauCu.length === 0 && loiGoi.length === 0 && cong.length === 0;
const HANG_KDD0 = `| ${KDD} | 0 | BLOCKED | — |`;
const HANG_KDD5 = `| ${KDD} | 5 | BLOCKED | 5 |`;
const CA_DO = [
  ['TB-do-1 gỡ hàng mã 5', () => doiChieu(pha(TAI_LIEU, `${HANG_KDD5}\n`, ''), O, KHUON).tb1, `bộ quét phát ${KDD}/5 mà tài liệu chưa có lối đọc`],
  ['TB-do-2 bộ quét đổi mã 5 thành 7', () => doiChieu(TAI_LIEU, chayMaTran(pha(BO_QUET, 'khongDo && opts.requireMeasured ? 5 : 0', 'khongDo && opts.requireMeasured ? 7 : 0')), KHUON).tb1, `bộ quét phát ${KDD}/7 mà tài liệu chưa có lối đọc`],
  ['TB-do-3 không đo được ghi đạt', () => doiChieu(pha(TAI_LIEU, HANG_KDD0, `| ${KDD} | 0 | PASS | — |`), O, KHUON).tb2, `${KDD}/0 ghi PASS: không đo được phải ghi BLOCKED`],
  ['TB-do-4 thêm hàng thừa', () => doiChieu(pha(TAI_LIEU, HANG_KDD5, `${HANG_KDD5}\n   | UNKNOWN | 9 | BLOCKED | — |`), O, KHUON).tb1, 'tài liệu có lối đọc UNKNOWN/9 mà bộ quét không phát'],
  ['TB-do-5 mất khối bảng', () => doiChieu(pha(TAI_LIEU, MO, '<!-- khoi-khac -->'), O, KHUON).tb1, 'không tìm thấy khối bảng đọc TIER-B-DOC-KET-QUA'],
  ['TB-do-6 bộ quét báo đạt khi không đo được', () => doiChieu(TAI_LIEU, chayMaTran(pha(BO_QUET, `khongDo ? '${KDD}' : 'PASS'`, "khongDo ? 'PASS' : 'PASS'")), KHUON).tb1, 'bộ quét phát PASS/5 mà tài liệu chưa có lối đọc'],
  ['TB-do-7 khuôn báo cáo bỏ BLOCKED', () => doiChieu(TAI_LIEU, O, pha(KHUON, 'verdict: {{PASS|PENDING-JUDGMENT|REJECT|BLOCKED}}', 'verdict: {{PASS|PENDING-JUDGMENT|REJECT}}')).tb2, `${KDD}/5 ghi BLOCKED, không thuộc tập kết quả của khuôn báo cáo`],
  ['TB-do-8 mã 0 đứng cạnh kết quả không đạt', () => doiChieu(pha(TAI_LIEU, HANG_KDD0, `| ${KDD} | 0 | BLOCKED | 0 |`), O, KHUON).tb2, `${KDD}/0 để mã 0 đứng cạnh kết quả BLOCKED`],
  ['TB-do-9 câu đọc cũ quay lại', () => kiemCauCu(`${TAI_LIEU}\nThree shapes — handle all three`), 'câu đọc cũ còn trong quy trình: «Three shapes»'],
  ['TB-do-10 hàng từ chối ghi chặn', () => doiChieu(pha(TAI_LIEU, '| REJECT | 2 | REJECT | 2 |', '| REJECT | 2 | BLOCKED | 2 |'), O, KHUON).tb2, 'REJECT/2 ghi BLOCKED, mong REJECT'],
  ['TB-do-11 hàng đạt ghi chặn', () => doiChieu(pha(TAI_LIEU, '| PASS | 0 | PASS | 0 |', '| PASS | 0 | BLOCKED | — |'), O, KHUON).tb2, 'PASS/0 ghi BLOCKED, mong PASS'],
  ['TB-do-12 bộ quét thêm nhánh kết quả mới', () => kiemNguon(pha(BO_QUET, "var failOn = opts.failOn || ['P0'];", "var failOn = opts.failOn || ['P0'];\n    if (opts.moi) return { verdict: 'KET-QUA-MOI', exit_intent: 9 };"), O), 'nguồn bộ quét khai kết quả KET-QUA-MOI mà ma trận chưa phủ'],
  ['TB-do-13 công thức bỏ cờ đòi đo đủ', () => kiemLoiGoi(pha(TAI_LIEU, 'window.__impeccableDesignScan({failOn: <failOn>, requireMeasured: true})" })', 'window.__impeccableDesignScan({failOn: <failOn>})" })'), BO_QUET), `lời gọi 1 của công thức trả ${KDD}/0, mong ${KDD}/5`],
  ['TB-do-14 cổng thôi từ chối báo cáo đạt mang mã 5', () => kiemCong(TAI_LIEU, { ...CONG, evaluateEvidence: () => ({ consistencyFailure: null, missing: [], anyFailure: false }) }), 'cổng bằng chứng không từ chối báo cáo đạt mang mã 5'],
];
for (const [ten, chay, ghim] of CA_DO) {
  if (!lanh) { bad(ten, 'vật lành chưa xanh trên cùng fixture'); continue; }
  try {
    const loi = chay();
    loi.includes(ghim) ? ok(ten) : bad(ten, `không ra đúng thông điệp ghim; ra: ${loi.join(' | ') || '(xanh)'}`);
  } catch (e) { bad(ten, e.message); }
}

console.log(`\ntier-b-loi-doc: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
