// chot-truong-nguoi.test.mjs — hồ sơ chot-may-chu-ky-sau-synthesize (mốc 2.18.2).
//
// Workflow S4 nhận báo cáo bằng chứng là MỘT CHUỖI do tác tử tổng hợp viết. Bốn trường trong
// chuỗi ấy không thuộc quyền tác tử: ba chữ của NGƯỜI (human_signoff / human_override /
// bypass_ack — ADR 0002) và giờ đo verified_at mà ENGINE đã có. Tệp này đo chốt máy
// `chotTruongNguoi` mà workflow chạy ngay sau `synthesize:report`.
//
// Tên ca = tên AC (khối ĐỊNH VỊ). Workflow chạy THẬT qua harness.mjs (không chép hàm). Báo cáo
// nền do CODE sinh từ vùng chép của khuôn báo cáo (`---8<---`) và ba khối marker SUITE /
// UI-CHECK / JUDGMENT; run_id rút từ result.runLog của lượt chạy cùng args. Mỗi cặp hai-chiều
// dùng CÙNG fixture: bản nguyên vẹn XANH trước, bản sao phá vật (srcOverride trong bộ nhớ) ĐỎ
// với thông điệp ghim. Mọi đường dẫn suy từ vị trí tệp này.
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { runWorkflow } from './harness.mjs';
import { napChot, kiemIm, KHOA_BON } from './chot-truong-nguoi-corpus.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const TEMPLATE = path.join(KIT, 'skills', 'acceptance', 'references', 'evidence-report-template.md');
const CORPUS_CLI = path.join(HERE, 'chot-truong-nguoi-corpus.mjs');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
const WF_SRC = readFileSync(WF, 'utf8');

const CHON = (process.env.CTN_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chay = id => CHON.length === 0 || CHON.includes(id);
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const ca = (id, loiDs, moTa) => (loiDs.length === 0 ? ok(`${id} ${moTa}`) : bad(`${id} ${moTa}`, loiDs.slice(0, 4).join(' | ')));

const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const INVOKED = '2026-07-02T10:00:00Z';
const CARRY_AT = '2026-07-01T00:00:00Z';
const CHU_KY = 'Phan Le Manh 2026-09-23';

// ─── Khuôn bên viết: rút từ tệp khuôn báo cáo, không viết tay ──────────────────────────────
const TPL = readFileSync(TEMPLATE, 'utf8');
function rutMarker(ten) {
  const a = TPL.indexOf(`<<<${ten}`), b = TPL.indexOf(`${ten}>>>`);
  if (a === -1 || b === -1) throw new Error(`khuon bao cao thieu marker ${ten}`);
  const khoi = TPL.slice(TPL.indexOf('\n', a) + 1, TPL.lastIndexOf('\n', b));
  return khoi.split('\n').filter(l => !/^\s*<!--/.test(l)).join('\n');
}
const VUNG_CHEP = TPL.slice(TPL.indexOf('---8<---') + '---8<---'.length).replace(/^\n/, '');
const KHOI_SUITE = rutMarker('SUITE-BLOCK-TEMPLATE');
const KHOI_UI = rutMarker('UI-CHECK-BLOCK-TEMPLATE');
const KHOI_JUDGE = rutMarker('JUDGMENT-BLOCK-TEMPLATE');
// Khối eval máy: khối đầu tiên dưới `## Evidence` của vùng chép (bên viết đặt nó ở đó).
const KHOI_MAY = (() => {
  const dong = VUNG_CHEP.split('\n');
  const i = dong.findIndex(l => /^- eval:/.test(l));
  let j = i + 1;
  while (j < dong.length && /^\s+\S/.test(dong[j])) j += 1;
  return dong.slice(i, j).join('\n');
})();

// Đặt giá trị một trường theo dòng (giữ thụt lề + tiền tố `- `); '' → `khoá:` trần.
function datTruong(text, khoa, giaTri, lanThu = 1) {
  let dem = 0;
  const re = new RegExp(`^(\\s*)(- )?${khoa}(\\s*):.*$`);
  return text.split('\n').map(l => {
    if (!re.test(l)) return l;
    dem += 1;
    if (dem !== lanThu) return l;
    const [, thut, gach] = l.match(re);
    return `${thut}${gach || ''}${khoa}:${giaTri === '' ? '' : ' ' + giaTri}`;
  }).join('\n');
}

// ─── Fixture: args + báo cáo nền, do code sinh ─────────────────────────────────────────────
const ARGS = () => ({
  slug: 'demo', round: 1, riskTier: 'T2',
  evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
    { id: 'E2', criterion: 'AC-2', executor: 'ui-check', steps: ['open /'], expected: '200' },
    { id: 'E3', criterion: 'AC-3', executor: 'judgment', question: 'dung y chua', inputs: ['/repo/x.md'] },
    { id: 'E4', criterion: 'AC-4', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'ok' },
    { id: 'E5', criterion: 'AC-5', executor: 'ui-check', steps: ['open /b'], expected: '200' },
  ],
  carriedEvals: [
    { id: 'E4', runId: 'run-goc-E4', fromRound: 2, verifiedAt: CARRY_AT, cmd: './x.sh' },
    { id: 'E5', runId: 'run-goc-E5', fromRound: 2, verifiedAt: CARRY_AT },
  ],
  carriedPanels: [],
  suiteCommands: ['npm run build'],
  diffBase: 'main', repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md', templatePath: '/refs/evidence-report-template.md',
  invokedAt: INVOKED,
});

function traLoi(baoCao) {
  return (call) => {
    const l = call.label;
    if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green', runId: '', cannotRun: false };
    if (l.startsWith('ui:')) return { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: 'evidence/E2-step1.png', observed: 'trang chu hien thi dung menu va bang so lieu' };
    if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'dung y' };
    if (l.startsWith('review:')) return { findings: [] };
    if (l.startsWith('refute:')) return { refuted: true, reason: 'khong that' };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l.startsWith('triage:')) return { triaged: [], contractUnreadable: false };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (l === 'synthesize:report') return { report: typeof baoCao === 'function' ? baoCao(call) : baoCao, findings: '# Findings demo' };
    throw new Error('nhan tac tu la: ' + l);
  };
}

// Lượt 1: lấy run_id thật của CHÍNH args này (mint deterministic — lượt 2 đối chiếu lại).
const luot1 = await runWorkflow(WF, ARGS(), traLoi('# Evidence demo'));
const RID = {};
for (const l of luot1.result.runLog.map(s => JSON.parse(s))) if (l.evalId && l.run_id) RID[l.evalId] = l.run_id;
const RID_SUITE = Object.entries(RID).find(([k]) => k.startsWith('SUITE-'));

// Ma trận viết trước: (máy · ui-check · judgment · suite) × (tươi · carry) + frontmatter,
// bỏ ô vô nghĩa suite-carry (lệnh suite luôn chạy lại). Mỗi ô: id ô, khối, giờ mong đợi.
const O = [
  { o: 'may-tuoi', evalId: 'E1', khoi: KHOI_MAY, gio: INVOKED },
  { o: 'may-carry', evalId: 'E4', khoi: KHOI_MAY, gio: CARRY_AT, carry: true },
  { o: 'ui-tuoi', evalId: 'E2', khoi: KHOI_UI, gio: INVOKED },
  { o: 'ui-carry', evalId: 'E5', khoi: KHOI_UI, gio: CARRY_AT, carry: true },
  { o: 'judgment-tuoi', evalId: 'E3', khoi: KHOI_JUDGE, gio: INVOKED, judge: true },
  { o: 'judgment-carry', evalId: 'E3', khoi: KHOI_JUDGE, gio: INVOKED, judge: true, carryPanel: true },
  { o: 'suite-tuoi', evalId: RID_SUITE && RID_SUITE[0], khoi: KHOI_SUITE, gio: INVOKED, suite: true },
  { o: 'frontmatter', gio: INVOKED, fm: true },
];

// dungKhoi(o, gioVerified): một khối evidence cho ô o, mọi trường từ khuôn, giá trị do code điền.
function dungKhoi(o, gioVerified, kyTen) {
  let k = o.khoi;
  if (o.suite) k = datTruong(k, 'cmd', 'npm run build');
  else k = datTruong(k, 'eval', o.evalId);
  if (!o.judge) {
    const rid = o.carry ? ARGS().carriedEvals.find(c => c.id === o.evalId).runId : RID[o.evalId];
    k = datTruong(k, 'run_id', rid);
    k = datTruong(k, 'exit_code', '0');
    if (!o.suite) k = datTruong(k, 'verifier', o.evalId === 'E1' ? 'config:executors.test.api' : 'config:executors.script.cli');
    k = datTruong(k, 'verified_at', gioVerified);
  } else {
    // Khuôn judgment không có verified_at: ô judgment là một tác tử thêm dòng ấy. Chèn ngay
    // sau dòng verdict — đúng vị trí trường của khối (cột nội dung).
    k = k.split('\n').flatMap(l => (/^\s+verdict:/.test(l) ? [l, `  verified_at: ${gioVerified}`] : [l])).join('\n');
    k = datTruong(k, 'verdict', 'PASS');
    if (kyTen !== null) k = kyTen === '' ? k.replace(/^(\s*)human_override:.*$/m, '$1human_override:  # chi nguoi ghi') : datTruong(k, 'human_override', kyTen);
  }
  if (o.carry) k += `\n  carried_from_round: 2`;
  return k;
}

// Khối vô hướng + văn xuôi: KHÔNG phải vị trí trường — phải giữ nguyên byte (AC-3).
const KHOI_VO_HUONG = [
  '- eval: E6',
  '  run_id: minted-demo-E6-r1',
  '  exit_code: 0',
  '  verifier: config:executors.test.api',
  `  verified_at: ${INVOKED}`,
  '  output: |',
  `    human_signoff: ${CHU_KY}`,
  '    verified_at: 2099-01-01T00:00:00Z',
  '    human_override: Ai Do 2026-09-23',
].join('\n');
const VAN_XUOI = `human_signoff: ${CHU_KY} — dòng văn xuôi trích nguyên văn một báo cáo cũ, không phải trường.`;

// baoCao({ gioSai, kyTen, chuThich }): nền đúng khi gioSai=false, kyTen=''.
function baoCao({ gioSai = false, kyTen = '', chuThich = false } = {}) {
  let fm = VUNG_CHEP.slice(0, VUNG_CHEP.indexOf('\n---', 4) + 4);
  let than = VUNG_CHEP.slice(fm.length);
  fm = datTruong(fm, 'feature_slug', 'demo');
  fm = datTruong(fm, 'verdict', 'PASS');
  fm = datTruong(fm, 'enforcement_mode', 'strict');
  fm = datTruong(fm, 'bypass_used', 'false');
  fm = datTruong(fm, 'verified_commit', VC);
  if (!chuThich) fm = datTruong(fm, 'human_signoff', kyTen);
  // bypass_ack: khuôn chỉ có dòng chú thích; báo cáo nền thêm MỘT dòng thật ngay dưới nó.
  fm = fm.split('\n').flatMap(l => (/^# bypass_ack:/.test(l) ? [l, chuThich ? 'bypass_ack:            # để trống — người ghi' : `bypass_ack:${kyTen ? ' ' + kyTen : ''}`] : [l])).join('\n');
  // frontmatter: ô «frontmatter» của ma trận — một dòng verified_at cấp 0.
  const oFm = O.find(o => o.fm);
  fm = fm.replace(/\n---$/, `\nverified_at: ${gioSai ? '2099-12-31T23:59:59Z' : oFm.gio}\n---`);
  const khoi = O.filter(o => !o.fm).map((o, i) => dungKhoi(o, gioSai ? (i % 2 ? '2001-01-01T00:00:00Z' : '2099-01-01T00:00:00Z') : o.gio, chuThich ? null : kyTen));
  than = than.replace(KHOI_MAY, [...khoi, KHOI_VO_HUONG].join('\n\n'));
  than = than.replace('## Analyst', `${VAN_XUOI}\n\n## Analyst`);
  return fm + than;
}

const NEN = baoCao();                               // đúng, ba khoá rỗng trần
const NEN_CHU_THICH = baoCao({ chuThich: true });   // đúng, khoá người chỉ mang chú thích
const TIEM = baoCao({ gioSai: true, kyTen: CHU_KY }); // tác tử bịa: chữ ký + giờ lệch

// ─── Phép đo (trả mảng thông điệp lỗi — rỗng = xanh) ──────────────────────────────────────
const chiaDong = s => String(s).split('\n');
// Vị trí trường theo khuôn bên viết: cấp 0 TRONG frontmatter, hoặc cột 2 của khối evidence.
function viTriTruong(out) {
  const d = chiaDong(out); const het = d.indexOf('---', 1);
  return d.filter((l, i) => (i < het ? /^\S/.test(l) : /^ {2}\S/.test(l)));
}
function doAC1(out) {
  const loi = [];
  for (const k of ['human_signoff', 'human_override', 'bypass_ack']) {
    const re = new RegExp(`^(\\s*)${k}\\s*[:=](.*)$`);
    const dong = viTriTruong(out).filter(l => re.test(l));
    if (dong.length === 0) loi.push(`${k} mat dong`);
    // Rỗng theo bên đọc: trống hoặc chỉ chú thích.
    for (const l of dong) { const v = l.match(re)[2].trim(); if (v !== '' && !v.startsWith('#')) loi.push(`${k} con gia tri: «${l.trim()}»`); }
  }
  return loi;
}
function doAC2(out) {
  const loi = []; let soAssert = 0;
  const dong = chiaDong(out);
  const fmHet = dong.indexOf('---', 1);
  const dFm = dong.slice(0, fmHet).find(l => /^verified_at:/.test(l));
  soAssert += 1;
  if (!dFm || dFm !== `verified_at: ${INVOKED}`) loi.push(`o frontmatter: «${dFm}»`);
  for (const o of O.filter(x => !x.fm)) {
    // khối của ô: dòng mở `- eval: <id>` / `- cmd:`; ô judgment-carry là khối judgment thứ hai.
    const mo = o.suite ? '- cmd: npm run build' : `- eval: ${o.evalId}`;
    const vt = dong.map((l, i) => (l === mo ? i : -1)).filter(i => i >= 0);
    const i0 = o.carryPanel ? vt[1] : vt[0];
    soAssert += 1;
    if (i0 === undefined) { loi.push(`o ${o.o}: khong thay khoi ${mo}`); continue; }
    let j = i0 + 1; let gio = null;
    while (j < dong.length && /^\s+\S/.test(dong[j])) { const m = dong[j].match(/^  verified_at: (.*)$/); if (m) gio = m[1]; j += 1; }
    if (gio !== o.gio) loi.push(`o ${o.o} (${o.evalId}): verified_at ${gio} != ${o.gio}`);
  }
  if (soAssert !== O.length) loi.push(`so assert ${soAssert} != so o ${O.length}`);
  return loi;
}
function doVoHuong(out) {
  const loi = [];
  const s = String(out);
  if (!s.includes(KHOI_VO_HUONG)) {
    const goc = KHOI_VO_HUONG.split('\n');
    const thay = goc.filter(l => !s.split('\n').includes(l));
    loi.push(`dong output bi doi: ${thay.map(l => `«${l.trim()}»`).join(', ')}`);
  }
  if (!s.includes(VAN_XUOI)) loi.push('dong van xuoi bi doi');
  return loi;
}
const chayVoi = (bc, over = {}, src) => runWorkflow(WF, { ...ARGS(), ...over }, traLoi(bc), src);
const dongChot = r => r.runLog.map(s => JSON.parse(s)).filter(l => l.kind === 'chot-truong-nguoi');

// ─── Tiền đề của chính fixture (không có thì mọi ca dưới đều vô nghĩa) ────────────────────
{
  const loi = [];
  if (!RID.E1 || !RID.E2 || !RID_SUITE) loi.push('khong rut duoc run_id tu runLog luot 1');
  if (CARRY_AT === INVOKED) loi.push('gio carry trung invokedAt');
  if (TIEM.split('\n').length !== NEN.split('\n').length) loi.push('ban tiem lech so dong ban nen');
  if (!NEN.includes(KHOI_VO_HUONG)) loi.push('nen thieu khoi vo huong');
  if (loi.length) { bad('CTN-TIEN-DE fixture', loi.join(' | ')); console.log(`\nResults: ${pass} passed, ${fail} failed (chot-truong-nguoi)`); process.exit(1); }
}

const luotNen = await chayVoi(NEN);
const luotChuThich = await chayVoi(NEN_CHU_THICH);
const luotTiem = await chayVoi(TIEM);

if (chay('CTN-AC1')) ca('CTN-AC1', doAC1(luotTiem.result.report), 'ba khoa nguoi co gia tri tu tac tu -> rong, dong khoa con nguyen');
if (chay('CTN-AC1-giu')) {
  const loi = [];
  if (luotChuThich.result.report !== NEN_CHU_THICH) loi.push('bao cao chu-thich bi doi');
  if (!luotChuThich.result.report.includes('# bypass_ack:')) loi.push('dong chu thich # bypass_ack bi cham');
  ca('CTN-AC1-giu', loi, 'dong khoa rong / chi chu thich / dong # giu nguyen byte');
}
// Lớp «chốt nhận hình dạng HẸP hơn bên đọc» (S4-r1, finding t3/t4): bên đọc
// (lib/evidence-core.cjs frontmatterField / extractRunIds) bỏ dòng trống đầu, nhận `---[ \t]*`,
// so khoá không phân biệt hoa thường, bỏ nháy quanh run_id. Mỗi biến thể áp CÙNG phép biến
// đổi lên bản nền và bản tiêm: chốt(tiêm') phải bằng từng byte nền'.
const hangRao = s => { let n = 0; return '\n' + s.split('\n').map(l => (l === '---' && n++ < 2 ? '--- ' : l)).join('\n'); };
const hoaKhoa = s => s.replace(/^human_signoff:/m, 'HUMAN_SIGNOFF:').replace(/^bypass_ack:/m, 'Bypass_Ack:');
const ngoacRid = s => s.replace('run_id: run-goc-E4', 'run_id: "run-goc-E4"');
for (const [id, bien, moTa] of [
  ['CTN-AC1-mo-dau', hangRao, 'dong trong dau + hang rao «--- » -> van nhan frontmatter, chu ky rong'],
  ['CTN-AC1-hoa-thuong', hoaKhoa, 'khoa viet hoa (ben doc khong phan biet) -> van ep rong'],
  ['CTN-AC2-ngoac', ngoacRid, 'run_id carry co ngoac kep -> giu verifiedAt goc'],
]) {
  if (!chay(id)) continue;
  const loi = [];
  const tiem = bien(TIEM), nen = bien(NEN);
  if (tiem === TIEM || nen === NEN) loi.push('bien the khong doi fixture');
  const { result } = await chayVoi(tiem);
  if (result.report !== nen) {
    const a = result.report.split('\n'), b = nen.split('\n');
    const i = a.findIndex((l, k) => l !== b[k]);
    loi.push(`lech dong ${i + 1}: «${a[i]}» vs «${b[i]}»`);
  }
  ca(id, loi, moTa);
}
if (chay('CTN-AC2-carry-khac')) ca('CTN-AC2-carry-khac', CARRY_AT !== INVOKED ? [] : ['trung'], 'gio carry cua fixture khac invokedAt truoc khi so');
if (chay('CTN-AC2-ma-tran')) ca('CTN-AC2-ma-tran', doAC2(luotTiem.result.report), `ma tran ${O.length} o: moi verified_at = gio engine cua o`);
if (chay('CTN-AC3-lanh')) ca('CTN-AC3-lanh', luotNen.result.report === NEN ? [] : ['bao cao dung bi doi'], 'doi chung duong: bao cao dung ra y nguyen tung byte');
if (chay('CTN-AC3-bang')) {
  const loi = [];
  const out = luotTiem.result.report;
  if (out !== NEN) {
    const a = out.split('\n'), b = NEN.split('\n');
    const i = a.findIndex((l, k) => l !== b[k]);
    loi.push(`lech dong ${i + 1}: «${a[i]}» vs «${b[i]}»`);
  }
  if (out.split('\n').length !== TIEM.split('\n').length) loi.push('so dong doi');
  ca('CTN-AC3-bang', loi, 'bao cao tiem sau chot bang tung byte bao cao nen');
}
if (chay('CTN-AC3-vo-huong')) ca('CTN-AC3-vo-huong', doVoHuong(luotTiem.result.report), 'khoi vo huong + van xuoi giu nguyen byte');

if (chay('CTN-AC4')) {
  const a = ARGS(); delete a.invokedAt; a.carriedEvals = [];
  const { result } = await runWorkflow(WF, a, traLoi(NEN));
  const loi = [];
  if (result.verdict !== 'BLOCKED') loi.push(`verdict ${result.verdict}`);
  if (!(result.blocked || []).some(b => /chot-truong-nguoi/.test(b.reason) && /invokedAt/.test(b.reason))) loi.push('khong co ly do goi ten');
  if (result.report !== '') loi.push('report khong rong');
  ca('CTN-AC4', loi, 'thieu invokedAt + co verified_at -> BLOCKED goi ten, report rong');
}
if (chay('CTN-AC4-cu')) {
  const a = ARGS(); delete a.invokedAt; a.carriedEvals = [];
  const { result } = await runWorkflow(WF, a, traLoi('# Evidence demo (khong co dong gio)'));
  ca('CTN-AC4-cu', result.verdict === 'PASS' ? [] : [`verdict ${result.verdict}`], 'thieu invokedAt, bao cao khong co verified_at -> PASS nhu W14');
}
if (chay('CTN-AC4-ben-goi')) {
  const loi = [];
  const d = mkdtempSync(path.join(tmpdir(), 'ctn-s4args-'));
  try {
    const g = (...x) => execFileSync('git', ['-C', d, ...x], { encoding: 'utf8' });
    mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
    execFileSync('git', ['init', '-q', '-b', 'main', d]);
    g('config', 'user.email', 't@t.t'); g('config', 'user.name', 'T');
    writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n');
    writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
    writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: x\n');
    g('add', '-A'); g('commit', '-qm', 'r1'); g('checkout', '-qb', 'vong');
    writeFileSync(path.join(d, 'x.js'), 'x\n'); g('add', '-A'); g('commit', '-qm', 'vat');
    const out = path.join(d, 'args.json');
    execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main'], { stdio: ['ignore', 'pipe', 'pipe'] });
    const a = JSON.parse(readFileSync(out, 'utf8'));
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(String(a.invokedAt))) loi.push(`invokedAt «${a.invokedAt}»`);
  } catch (e) { loi.push(String(e.stderr || e.message).split('\n').filter(Boolean).slice(-2).join(' ')); }
  finally { rmSync(d, { recursive: true, force: true }); }
  ca('CTN-AC4-ben-goi', loi, 'ben dung args duy nhat (s4-args) ghi invokedAt dang ISO');
}

if (chay('CTN-AC5')) {
  const loi = [];
  const d = dongChot(luotTiem.result);
  // Đếm độc lập: so từng dòng bản tiêm với báo cáo ra, dòng khác gán theo khoá của nó.
  const dem = { human_signoff: 0, human_override: 0, bypass_ack: 0, verified_at: 0 };
  const a = TIEM.split('\n'), b = luotTiem.result.report.split('\n');
  a.forEach((l, i) => { if (l !== b[i]) { const m = l.match(/^\s*(?:- )?(human_signoff|human_override|bypass_ack|verified_at)\s*[:=]/); if (m) dem[m[1]] += 1; else dem.__khac = (dem.__khac || 0) + 1; } });
  if (d.length !== 1) loi.push(`${d.length} dong kind chot-truong-nguoi`);
  else {
    for (const k of Object.keys(dem)) if (d[0][k] !== dem[k]) loi.push(`${k}: dong ${d[0][k]} != dem ${dem[k]}`);
    if (d[0].ts !== INVOKED) loi.push(`ts ${d[0].ts}`);
  }
  ca('CTN-AC5', loi, 'mot dong run-log kind chot-truong-nguoi, bon so bang dem doc lap');
}
if (chay('CTN-AC5-im')) ca('CTN-AC5-im', dongChot(luotNen.result).length === 0 ? [] : ['co dong'], 'khong doi gi -> khong dong run-log nao');

// ─── Corpus kit (AC-6) ────────────────────────────────────────────────────────────────────
if (chay('CTN-AC6-kit') || chay('CTN-AC6-dot-bien')) {
  const chot = napChot(WF_SRC);
  const goc = path.join(KIT, '_acceptance');
  const hoSo = readdirSync(goc).filter(s => existsSync(path.join(goc, s, 'evidence-report.md')));
  const quet = s => {
    const truoc = readFileSync(path.join(goc, s, 'evidence-report.md'), 'utf8');
    return { s, truoc, sau: chot(truoc, { invokedAt: '2000-01-01T00:00:00Z', gioTheoRunId: {} }).text };
  };
  const tatCa = hoSo.map(quet);
  if (chay('CTN-AC6-kit')) {
    const loi = [];
    let cham = 0;
    for (const { s, truoc, sau } of tatCa) {
      const v = kiemIm(truoc, sau);
      if (v.length) loi.push(`${s}: ${v[0]}`);
      if (truoc !== sau) cham += 1;
    }
    if (tatCa.length < 80) loi.push(`chi quet ${tatCa.length} bao cao (< 80)`);
    if (cham < 1) loi.push('0 bao cao bi cham — doi chung duong hong');
    console.log(`    corpus kit: ${tatCa.length} bao cao, ${cham} bi cham`);
    ca('CTN-AC6-kit', loi, `chieu im tren ${tatCa.length} bao cao kit: chi dong bon khoa o vi tri truong doi`);
  }
  if (chay('CTN-AC6-dot-bien')) {
    // Bản sao hàm chạm thêm dòng verdict: phép im phải gọi đúng tên.
    const hong = (t, o) => { const r = chot(t, o); return { ...r, text: r.text.replace(/^verdict: (\S+)/m, 'verdict: XX') }; };
    const mau = tatCa.find(x => /^verdict: /m.test(x.truoc));
    const v = mau ? kiemIm(mau.truoc, hong(mau.truoc, { invokedAt: '2000-01-01T00:00:00Z', gioTheoRunId: {} }).text) : [];
    const loi = [];
    if (!mau) loi.push('khong co bao cao nao co dong verdict');
    else if (!v.some(m => m.includes('cham dong ngoai bon khoa'))) loi.push(`phep im khong bat: ${JSON.stringify(v)}`);
    ca('CTN-AC6-dot-bien', loi, 'ban sao cham dong verdict -> phep im bao «cham dong ngoai bon khoa»');
  }
}

// ─── Kho crm: bốn nhánh của lệnh corpus trên kho git tạm (AC-7) ─────────────────────────
{
  const ids7 = ['CTN-AC7-lanh', 'CTN-AC7-ref-le', 'CTN-AC7-moi-ref', 'CTN-AC7-can-vang', 'CTN-AC7-khong-git'];
  if (ids7.some(chay)) {
    const d = mkdtempSync(path.join(tmpdir(), 'ctn-kho-'));
    const khongGit = mkdtempSync(path.join(tmpdir(), 'ctn-khong-git-'));
    try {
      const g = (...x) => execFileSync('git', ['-C', d, ...x], { encoding: 'utf8' });
      execFileSync('git', ['init', '-q', '-b', 'a', d]);
      g('config', 'user.email', 't@t.t'); g('config', 'user.name', 'T');
      const ghi = s => { mkdirSync(path.join(d, '_acceptance', s), { recursive: true }); writeFileSync(path.join(d, '_acceptance', s, 'evidence-report.md'), baoCao({ chuThich: false }).replace(/^human_signoff:$/m, `human_signoff: ${CHU_KY}`)); };
      ghi('s1'); g('add', '-A'); g('commit', '-qm', 'a');
      g('checkout', '-qb', 'b'); ghi('s2'); g('add', '-A'); g('commit', '-qm', 'b');
      const cli = (...x) => spawnSync(process.execPath, [CORPUS_CLI, ...x], { encoding: 'utf8' });
      const lanh = cli('--root', d, '--ref', 'a', '--ref', 'b', '--can', 's1', '--can', 's2', '--doi-cham');
      const lanhXanh = lanh.status === 0 && /co mat: s1/.test(lanh.stdout) && /co mat: s2/.test(lanh.stdout);
      if (chay('CTN-AC7-lanh')) ca('CTN-AC7-lanh', lanhXanh ? [] : [`ma ${lanh.status} ${lanh.stdout}${lanh.stderr}`.slice(0, 200)], 'doi chung duong: du ref, du hs goc -> thoat 0');
      const doi = (id, r, moTa, mong) => {
        if (!chay(id)) return;
        const loi = [];
        if (!lanhXanh) loi.push('doi chung duong chua xanh');
        if (mong === 'le') {
          if (r.status !== 0) loi.push(`ma ${r.status}`);
          const n = r.stdout.split('\n').filter(l => l.startsWith('ref vang: khong-co')).length;
          if (n !== 1) loi.push(`${n} dong khai ref vang`);
        } else {
          if (r.status === 0) loi.push('thoat 0 — xanh gia');
          if (!/khong doc duoc o day/.test(r.stdout + r.stderr)) loi.push('thieu thong diep «khong doc duoc o day»');
        }
        ca(id, loi, moTa);
      };
      doi('CTN-AC7-ref-le', cli('--root', d, '--ref', 'a', '--ref', 'b', '--ref', 'khong-co', '--can', 's1'), 'mot ref le vang -> thoat 0 + dung mot dong khai', 'le');
      doi('CTN-AC7-moi-ref', cli('--root', d, '--ref', 'x', '--ref', 'y'), 'moi ref vang -> ma rieng + «khong doc duoc o day»');
      doi('CTN-AC7-can-vang', cli('--root', d, '--ref', 'a', '--can', 's9'), 'ho so goc vang o moi ref -> ma rieng + «khong doc duoc o day»');
      doi('CTN-AC7-khong-git', cli('--root', khongGit, '--ref', 'a'), 'goc khong phai kho git -> ma rieng + «khong doc duoc o day»');
    } finally { rmSync(d, { recursive: true, force: true }); rmSync(khongGit, { recursive: true, force: true }); }
  }
}

// ─── Vi phân với BỘ ĐỌC THẬT (khuôn owner chọn 23/09 sau hai lượt vá cùng lớp) ───────────
// Lớp lỗi «chốt nhận hình dạng HẸP hơn bên đọc» chỉ đóng được khi phép đo hỏi chính bên đọc:
// mỗi ô là một hình dạng dòng mà lib/evidence-core.cjs NHẬN (đối chứng dương: bộ đọc thấy giá
// trị bịa trên bản trước), và sau chốt bộ đọc phải thấy rỗng / đúng giờ engine. Bảng viết trước
// từ ngữ pháp bên đọc: frontmatterField + chuKyThat (hàng rào, hoa thường, dấu tách, nháy) ·
// L3 đếm human_override ở mọi nơi (biểu thức RÚT từ nguồn lib, không chép) · extractRunIds +
// walkEvalExits (run_id mọi dòng của bản ghi kể cả dòng mở, nháy, chú thích, hoa thường, bản
// ghi `-\s+`). Số assert phải bằng tích các trục, tính độc lập trước khi chạy.
const LIB = path.join(KIT, 'lib', 'evidence-core.cjs');
const core = createRequire(import.meta.url)(LIB);
const L3_KHOP = readFileSync(LIB, 'utf8').match(/const overrideCount = \(payload\.match\((\/[^\n]+?\/[gimsuy]*)\) \|\| \[\]\)\.length/);
const L3_RE = L3_KHOP ? new Function(`return ${L3_KHOP[1]}`)() : null;
const demL3 = s => (String(s).match(new RegExp(L3_RE.source, L3_RE.flags)) || []).length;
const chuanDoc = v => String(v).replace(/\s+#.*$/, '').trim().replace(/^["']+|["']+$/g, '').trim();
const GIA = 'Bot Tu Ky 2026-09-23';
const RID4 = 'run-goc-E4';
const hoa = (k, c) => (c === 'thuong' ? k : c === 'HOA' ? k.toUpperCase() : k.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join('_'));

function bangViPhan() {
  const o = [];
  // A — khoá chữ ký ở frontmatter (bên đọc: frontmatterField; rào không đóng: chuKyThat).
  const RAO = { thuong: [b => `---\n${b}\n---\n\n# R\n`], 'dong-trong': [b => `\n\n---\n${b}\n---\n\n# R\n`], 'rao-cach': [b => `--- \n${b}\n---  \n\n# R\n`], 'khong-dong': [b => `---\n${b}\n\n# R\n`] };
  for (const k of ['human_signoff', 'bypass_ack']) for (const r of Object.keys(RAO)) {
    if (k === 'bypass_ack' && r === 'khong-dong') continue; // không bộ đọc nào đọc bypass_ack khi rào không đóng
    for (const c of ['thuong', 'HOA', 'Tron']) for (const sep of [':', '=']) for (const val of ['tran', 'nhay']) {
      const v = val === 'tran' ? GIA : `"${GIA}"`;
      const bc = RAO[r][0](['schema_version: 2', 'verdict: PASS', `${hoa(k, c)}${sep} ${v}`, 'enforcement_mode: strict'].join('\n'));
      const doc = s => (r === 'khong-dong' ? core.chuKyThat(s).value : (core.frontmatterField(s, k) || ''));
      o.push({ id: `A:${k}:${r}:${c}:${sep}:${val}`, truc: 'AC1', bc, truoc: s => doc(s) === GIA, sau: s => doc(s) === '' });
    }
  }
  // B — mọi hình dạng mà biểu thức L3 (rút nguyên văn từ lib) đếm là một lời chấp thuận. Mỗi ô
  // hoặc thuộc lời hứa AC-1 (sau chốt L3 đếm 0), hoặc là GIỚI HẠN ĐÃ KHAI — tên ô phải có trong
  // khối GIOI-HAN-CHOT của tệp workflow (một nguồn) và chốt không được chạm một byte (xoá ở đó là
  // làm giả văn xuôi/output; nghiệm đúng tầng là neo L3 — hạt giống vế 2).
  const VT = {
    'fm-cot0': k => `---\nverdict: PASS\n${k}: ${GIA}\n---\n`,
    'fm-long': k => `---\nverdict: PASS\njudgments:\n  - eval: E3\n    ${k}: ${GIA}\n---\n`,
    'khoi-cot2': k => `---\nverdict: PASS\n---\n\n- eval: E3\n  verdict: UNCERTAIN\n  ${k}: ${GIA}\n`,
    'khoi-cot4': k => `---\nverdict: PASS\n---\n\n- eval: E3\n    verdict: UNCERTAIN\n    ${k}: ${GIA}\n`,
    'khoi-hai-cach': k => `---\nverdict: PASS\n---\n\n-  eval: E3\n   ${k}: ${GIA}\n`,
    'khoi-long': k => `---\nverdict: PASS\n---\n\n  - eval: E3\n    ${k}: ${GIA}\n`,
    'khoi-gach': k => `---\nverdict: PASS\n---\n\n- ${k}: ${GIA}\n  eval: E3\n`,
    'than-cot0': k => `---\nverdict: PASS\n---\n\n${k}: ${GIA}\n`,
    'rao-khong-dong-khoi': k => `---\nverdict: PASS\n\n- eval: E3\n  verdict: UNCERTAIN\n  ${k}: ${GIA}\n`,
    'sau-mo-gach-vo-huong': k => `---\nverdict: PASS\n---\n\n- output: |\n    all green\n  eval: E3\n  ${k}: ${GIA}\n`,
    'gioi-han:giua-dong-bang': k => `---\nverdict: PASS\n---\n\n| E3 | UNCERTAIN | ${k}: ${GIA} |\n`,
    'gioi-han:sau-chu-thich': k => `---\nverdict: PASS\n---\n\n- eval: E3\n  verdict: UNCERTAIN  # ${k}: ${GIA}\n`,
    'gioi-han:tien-to': k => `---\nverdict: PASS\n---\n\n- eval: E3\n  judge_${k}: ${GIA}\n`,
    'gioi-han:flow': k => `---\nverdict: PASS\n---\n\n- {eval: E3, verdict: UNCERTAIN, ${k}: ${GIA}}\n`,
    'gioi-han:trong-vo-huong': k => `---\nverdict: PASS\n---\n\n- eval: E3\n  output: |\n    ${k}: ${GIA}\n`,
  };
  for (const vt of Object.keys(VT)) for (const c of ['thuong', 'HOA']) {
    const gh = vt.startsWith('gioi-han:');
    o.push({ id: `B:${vt}:${c}`, truc: 'AC1', gioiHan: gh ? vt.slice('gioi-han:'.length) : null, bc: VT[vt](hoa('human_override', c)),
      truoc: s => demL3(s) === 1, sau: (s, truoc) => (gh ? s === truoc : demL3(s) === 0) });
  }
  // C — giờ carry theo run_id của bản ghi (bên đọc: extractRunIds + walkEvalExits).
  const RIDV = { tran: RID4, kep: `"${RID4}"`, don: `'${RID4}'`, 'chu-thich': `${RID4}  # giu tu luot 2` };
  for (const rao of ['dong', 'khong-dong']) for (const mo of ['eval', 'eval-hai-cach', 'run_id-mo']) for (const rf of Object.keys(RIDV)) for (const ind of [2, 4])
    for (const vk of ['verified_at', 'VERIFIED_AT']) for (const rk of ['run_id', 'RUN_ID']) for (const thu of ['rid-truoc', 'gio-truoc']) {
      if (mo === 'run_id-mo' && thu === 'gio-truoc') continue; // run_id ở dòng mở thì luôn đứng trước
      const sp = ' '.repeat(ind);
      const dongRid = `${sp}${rk}: ${RIDV[rf]}`, dongGio = `${sp}${vk}: 2099-01-01T00:00:00Z`;
      const khoi = mo === 'run_id-mo'
        ? [`- ${rk}: ${RIDV[rf]}`, `${sp}eval: E4`, dongGio, `${sp}exit_code: 0`]
        : [mo === 'eval' ? '- eval: E4' : '-  eval: E4', ...(thu === 'rid-truoc' ? [dongRid, dongGio] : [dongGio, dongRid]), `${sp}exit_code: 0`];
      const bc = `---\nverdict: PASS\n${rao === 'dong' ? '---\n' : ''}\n## Evidence\n\n${khoi.join('\n')}\n`;
      const gio = s => { const m = s.split('\n').map(l => l.match(/^\s*verified_at\s*[:=]\s*(.*)$/i)).find(Boolean); return m ? chuanDoc(m[1]) : null; };
      o.push({ id: `C:${rao}:${mo}:${rf}:${ind}:${vk}:${rk}:${thu}`, truc: 'AC2', bc, truoc: s => core.extractRunIds(s).includes(RID4) && gio(s) === '2099-01-01T00:00:00Z', sau: s => gio(s) === CARRY_AT });
    }
  // D — nội dung khối vô hướng: không chạm một byte (chốt không làm giả output).
  for (const k of ['human_signoff', 'human_override', 'bypass_ack', 'verified_at']) for (const ch of ['|', '>', '|-']) for (const noi of ['fm', 'ban-ghi', 'ban-ghi-gach']) {
    const gt = k === 'verified_at' ? '2099-01-01T00:00:00Z' : GIA;
    const bc = noi === 'fm'
      ? `---\nverdict: PASS\nghi_chu: ${ch}\n  ${k}: ${gt}\n---\n`
      : noi === 'ban-ghi'
        ? `---\nverdict: PASS\n---\n\n- eval: E1\n  output: ${ch}\n    ${k}: ${gt}\n  exit_code: 0\n`
        : `---\nverdict: PASS\n---\n\n- output: ${ch}\n    ${k}: ${gt}\n  eval: E1\n  exit_code: 0\n`;
    o.push({ id: `D:vo-huong:${k}:${ch}:${noi}`, truc: 'AC3', bc, truoc: s => s.includes(`${k}: ${gt}`), sau: (s, truoc) => s === truoc });
  }
  // E — giờ đã đúng nhưng viết có nháy / chú thích: bên đọc coi là bằng nhau → không đổi, không đếm.
  for (const [ten, v] of [['nhay', `"${INVOKED}"`], ['chu-thich', `${INVOKED}  # engine`]]) {
    const bc = `---\nverdict: PASS\n---\n\n- eval: E1\n  run_id: minted-x-E1-r1\n  verified_at: ${v}\n`;
    o.push({ id: `E:gio-dung:${ten}`, truc: 'AC3', bc, truoc: s => s.includes(v), sau: (s, truoc, r) => s === truoc && r.doi.verified_at === 0 });
  }
  return o;
}
// Số ô tính ĐỘC LẬP từ kích thước trục (viết trước khi chạy):
//   A = 2 khoá × 4 rào × 3 hoa × 2 tách × 2 giá trị − (bypass_ack × khong-dong: 12) = 84
//   B = 15 hình dạng L3 đếm (10 thuộc lời hứa + 5 giới hạn đã khai) × 2 hoa = 30
//   C = 2 rào × (2 mở-eval × 4 × 2 × 2 × 2 × 2 + 1 mở-run_id × 4 × 2 × 2 × 2) = 320
//   D = 4 khoá × 3 chỉ báo × 3 nơi = 36 · E = 2  → tổng 472
const SO_O = { AC1: 84 + 30, AC2: 320, AC3: 36 + 2 };
// Giới hạn đã khai — MỘT nguồn: khối GIOI-HAN-CHOT trong tệp workflow (bên viết). Ô `gioi-han:*`
// của trục B phải có tên trong khối, và khối không được khai tên nào mà bảng không có ô.
const GIOI_HAN = (() => {
  const a = WF_SRC.indexOf('<<<GIOI-HAN-CHOT'), b = WF_SRC.indexOf('GIOI-HAN-CHOT>>>');
  if (a === -1 || b === -1) return null;
  return WF_SRC.slice(WF_SRC.indexOf('\n', a) + 1, WF_SRC.lastIndexOf('\n', b)).split('\n').map(l => l.replace(/^\s*\/\/\s*/, '').split(/\s+/)[0]).filter(Boolean);
})();
function chayBang(chotFn, truc) {
  const loi = []; let so = 0;
  for (const c of bangViPhan().filter(x => x.truc === truc)) {
    so += 1;
    if (!c.truoc(c.bc)) { loi.push(`${c.id}: doi chung duong hong — ben doc khong thay gia tri bia tren ban truoc`); continue; }
    const r = chotFn(c.bc, { invokedAt: INVOKED, gioTheoRunId: { [RID4]: CARRY_AT } });
    if (r.loi) { loi.push(`${c.id}: chot bao loi ${r.loi}`); continue; }
    if (!c.sau(r.text, c.bc, r)) loi.push(`${c.id}: ben doc van thay gia tri tac tu sau chot`);
    if (c.gioiHan && !(GIOI_HAN || []).includes(c.gioiHan)) loi.push(`${c.id}: gioi han chua khai trong khoi GIOI-HAN-CHOT`);
  }
  if (truc === 'AC1') {
    const coO = new Set(bangViPhan().filter(x => x.gioiHan).map(x => x.gioiHan));
    if (!GIOI_HAN) loi.push('khong rut duoc khoi GIOI-HAN-CHOT tu tep workflow');
    else for (const g of GIOI_HAN) if (!coO.has(g)) loi.push(`GIOI-HAN-CHOT khai «${g}» ma bang khong co o`);
  }
  if (so !== SO_O[truc]) loi.push(`so assert ${so} != so o ${SO_O[truc]}`);
  return loi;
}
const CHOT_THAT = napChot(WF_SRC);
if (!L3_RE) bad('CTN-TIEN-DE rut bieu thuc L3 tu lib/evidence-core.cjs', 'khong thay dong overrideCount');
else {
  if (chay('CTN-AC1-vi-phan')) ca('CTN-AC1-vi-phan', chayBang(CHOT_THAT, 'AC1'), `vi phan voi ben doc that: ${SO_O.AC1} o chu ky/override`);
  if (chay('CTN-AC2-vi-phan')) ca('CTN-AC2-vi-phan', chayBang(CHOT_THAT, 'AC2'), `vi phan voi ben doc that: ${SO_O.AC2} o gio carry`);
  if (chay('CTN-AC3-vi-phan')) ca('CTN-AC3-vi-phan', chayBang(CHOT_THAT, 'AC3'), `vi phan: ${SO_O.AC3} o khoi vo huong + gio dung dang khac`);
  if (chay('CTN-AC8-vi-phan')) {
    // Tám đột biến của CHÍNH khuôn này (sáu cái đầu là sáu hình dạng lượt chấm 2 tìm ra trên
    // khuôn cũ). Bản nguyên vẹn đã xanh ở ba ca trên; mỗi bản sao phải làm đỏ đúng ô của trục nó phá.
    const DB = [
      ['M1 bo i cua khoa', '(.*)$/i\n  let loi = null', '(.*)$/\n  let loi = null', 'AC1', ':HOA'],
      ['M2 bo cat chu thich run_id', "String(v).replace(/\\s+#.*$/, '').trim()", 'String(v).trim()', 'AC2', ':chu-thich:'],
      ['M3 chi boc nhay kep', `.replace(/^["']+|["']+$/g, '')`, '.replace(/^"+|"+$/g, \'\')', 'AC2', ':don:'],
      ['M4 rao khong dong = khong frontmatter', 'fmHet = n\n', 'fmHet = fmDau\n', 'AC1', ':khong-dong:'],
      ['M5 bo i cua run_id', '(?:-\\s+)?run_id\\s*[:=]\\s*(.+?)\\s*$/i)', '(?:-\\s+)?run_id\\s*[:=]\\s*(.+?)\\s*$/)', 'AC2', ':RUN_ID:'],
      ['M6 ban ghi chi nhan mot dau cach', "/^\\s*-\\s+\\S/.test(l)", "/^\\s*- \\S/.test(l)", 'AC2', ':eval-hai-cach:'],
      ['M7 bo run_id o dong mo', 'if (bg !== -1) {\n      const m = l.match(', 'if (bg !== -1 && c > cotBg) {\n      const m = l.match(', 'AC2', ':run_id-mo:'],
      ['M8 bo loai tru khoi vo huong', 'if (voHuong[j]) return l', 'if (false) return l', 'AC3', 'D:vo-huong:'],
      ['M10 cot 0 ap cho moi khoa trong frontmatter', "if (KHOA_CHI_FM.includes(khoa) && (!trongFm || m[1] !== '')) return l", "if ((KHOA_CHI_FM.includes(khoa) && !trongFm) || (trongFm && m[1] !== '')) return l", 'AC1', 'B:rao-khong-dong-khoi:'],
      ['M11 cot khoi vo huong tinh tu dau gach', 'cotVh = cKhoa', 'cotVh = c', 'AC1', 'B:sau-mo-gach-vo-huong:'],
      ['M9 override rong tran', "(khoa === 'human_override' ? RONG_OVERRIDE : '')", "''", 'AC1', 'B:fm-cot0:'],
    ];
    const loi = [];
    for (const [ten, tim, thay, truc, ghim] of DB) {
      if (!WF_SRC.includes(tim)) { loi.push(`${ten}: khong tim thay cho tiem`); continue; }
      const fn = napChot(WF_SRC.split(tim).join(thay));
      const v = chayBang(fn, truc);
      if (!v.some(m => m.includes(ghim))) loi.push(`${ten}: khong do o truc «${ghim}» (${v.length} loi)`);
    }
    ca('CTN-AC8-vi-phan', loi, `${DB.length} dot bien cua khuon doc — moi cai do dung truc no pha`);
  }
}

// ─── Độ nhạy (AC-8): bốn bản sao trong bộ nhớ, bản nguyên vẹn đã xanh ở trên ────────────
async function dotBien(id, tim, thay, doFn, bc, ghim, moTa) {
  if (!chay(id)) return;
  const loi = [];
  if (doFn(id === 'CTN-AC8-moi-cot' ? luotTiem.result.report : luotTiem.result.report).length !== 0) loi.push('ban nguyen ven chua xanh');
  if (!WF_SRC.includes(tim)) loi.push(`khong tim thay cho tiem: ${tim.slice(0, 60)}`);
  const src = WF_SRC.split(tim).join(thay);
  if (src === WF_SRC) loi.push('ban sao khong khac ban goc');
  if (!loi.length) {
    const { result } = await chayVoi(bc, {}, src);
    const v = doFn(result.report);
    if (!v.some(m => m.includes(ghim))) loi.push(`khong bat duoc (ghim «${ghim}»): ${JSON.stringify(v).slice(0, 200)}`);
  }
  ca(id, loi, moTa);
}
await dotBien('CTN-AC8-go-goi', 'chotTruongNguoi(String(',
  '((s) => ({ text: s, doi: { human_signoff: 0, human_override: 0, bypass_ack: 0, verified_at: 0 }, loi: null }))(String(',
  doAC1, TIEM, 'human_signoff con gia tri', 'go loi goi chot -> phep AC-1 bao human_signoff con gia tri');
await dotBien('CTN-AC8-bo-khoa', "const KHOA_NGUOI = ['human_signoff', 'human_override', 'bypass_ack']",
  "const KHOA_NGUOI = ['human_signoff', 'human_override']",
  doAC1, TIEM, 'bypass_ack con gia tri', 'bo bypass_ack khoi danh sach khoa -> phep AC-1 goi dung ten khoa');
await dotBien('CTN-AC8-carry', 'gioTheoRunId[c.runId] = c.verifiedAt || invokedAt',
  'gioTheoRunId[c.runId] = invokedAt',
  doAC2, TIEM, 'o may-carry (E4)', 'khoi carry lay invokedAt -> phep AC-2 goi id eval carry');
await dotBien('CTN-AC8-moi-cot', 'if (voHuong[j]) return l',
  'if (false) return l',
  doVoHuong, TIEM, 'dong output bi doi', 'khop khoa o moi cot -> phep AC-3 bao dong output bi doi');

console.log(`\nResults: ${pass} passed, ${fail} failed (chot-truong-nguoi)`);
if (CHON.length && pass + fail === 0) { console.log('FAIL: CTN_CASES khop 0 ca'); process.exit(1); }
process.exit(fail ? 1 : 0);
