// ui-check-chay-sau-suite.test.mjs — bên ĐỌC của hồ sơ ui-check-chay-sau-suite (AC-2…AC-6).
//
// Nạp CHÍNH acceptance-verify.js qua harness. Tác tử giả ghi cờ start/end (có độ trễ) để đo THỨ TỰ, không đo
// chuỗi. Đột biến chạy trên BẢN SAO TRONG BỘ NHỚ (`srcOverride`), mỗi kim khẳng định khớp ĐÚNG MỘT lần trong
// nguồn thật trước khi tin màu đỏ. Vi phân với mốc cố định v2.33.0 (git show). Mọi đường dẫn suy từ vị trí tệp.
//   UC1–UC2 ui chạy-riêng sau chuỗi suite (AC-2)      UC3–UC4 không chồng nhau, lệnh chạy-riêng giữ nhịp (AC-3)
//   UC5–UC6 kết quả đi đúng đường định tuyến (AC-4)    UC7 dry-run (AC-5)    UC8–UC10 vi phân v2.33.0 (AC-6)
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const soLan = (hay, kim) => hay.split(kim).length - 1;

const buildArgs = (over = {}) => ({
  slug: 'demo', round: 1, riskTier: 'T2', evals: [], suiteCommands: [],
  diffBase: 'main', repoRoot: '/repo', personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md', invokedAt: '2026-10-19T00:00:00Z', ...over,
});
const evLenh = (id, cmd) => ({ id, criterion: 'AC-' + id.slice(1), executor: 'script', cmd, ref: `config:executors.script.${id}`, expected: 'ok' });
const evUi = (id) => ({ id, criterion: 'AC-' + id.slice(1), executor: 'ui-check', expected: 'trang len', steps: [`mo trang ${id}`] });
const evJ = (id) => ({ id, criterion: 'AC-' + id.slice(1), executor: 'judgment', question: 'ro rang?', inputs: ['/repo/a.md'] });

// Tác tử giả. `tre[ten]` = ms chạy (mặc định 20), `ket[ten]` = mã thoát hoặc 'nem' (ném lỗi). Tên: lệnh máy theo
// chuỗi lệnh, ui theo `ui:<id>`. Nhãn lạ → ghi vào `la` (ca kiểm `la` rỗng, không để lỗi nuốt im).
const responder = ({ events = [], tre = {}, ket = {}, la = [] } = {}) => (call) => {
  const l = call.label;
  const chay = (ten, kq) => {
    events.push({ ten, ev: 'start' });
    return new Promise((res, rej) => setTimeout(() => { events.push({ ten, ev: 'end' }); kq instanceof Error ? rej(kq) : res(kq); }, tre[ten] ?? 20));
  };
  if (l.startsWith('machine:')) {
    const cmd = l.slice('machine:'.length).replace(/#\d+$/, '');
    if (ket[cmd] === 'nem') return chay(cmd, new Error('tac tu chet'));
    const ma = ket[cmd] ?? 0;
    return chay(cmd, { exitCode: ma, outputTail: `out\n__EXIT=${ma}`, runId: '', cannotRun: false });
  }
  if (l.startsWith('ui:')) {
    if (ket[l] === 'nem') return chay(l, new Error('tac tu chet'));
    return chay(l, { exitCode: ket[l] ?? 0, outputTail: 'assert ok', runId: '', screenshotPath: '', observed: '', networkObserved: 'n-a (driver)', cannotRun: false });
  }
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('triage')) return { items: [] };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  la.push(l);
  throw new Error('unexpected agent label: ' + l);
};
const idx = (events, ten, ev) => events.findIndex(e => e.ten === ten && e.ev === ev);
const sau = (events, ten, cacKhac) => cacKhac.every(k => idx(events, k, 'end') !== -1 && idx(events, ten, 'start') > idx(events, k, 'end'));
const roiNhau = (events, a, b) => idx(events, a, 'end') < idx(events, b, 'start') || idx(events, b, 'end') < idx(events, a, 'start');

// Kim — mỗi kim là một dòng mã của bản vá; khớp đúng một lần trong nguồn thật trước khi tin màu đỏ.
const KIM_SS = 'const uiSongSong = uiEvals.filter(e => !CHAY_RIENG.has(e.id))';
const KIM_CR = 'const uiChayRieng = uiEvals.filter(e => CHAY_RIENG.has(e.id))';
const KIM_TUAN_TU = 'for (const e of uiChayRieng) ur.push(await Promise.resolve().then(() => agentCuaUi(e)).catch(() => null))';
const KIM_GOP = 'return [...ss, ...ur]';
const kimDu = (...ks) => ks.every(k => soLan(SRC, k) === 1);
const MUTANT_VE_SONG_SONG = SRC.replace(KIM_SS, 'const uiSongSong = uiEvals').replace(KIM_CR, 'const uiChayRieng = []');
const MUTANT_DONG_THOI = SRC.replace(KIM_TUAN_TU, 'ur.push(...(await Promise.all(uiChayRieng.map(e => Promise.resolve().then(() => agentCuaUi(e)).catch(() => null)))))');
const MUTANT_ROI = SRC.replace(KIM_GOP, 'return ss');
const MUTANT_MOI_UI_RIENG = SRC.replace(KIM_SS, 'const uiSongSong = []').replace(KIM_CR, 'const uiChayRieng = uiEvals');

// ═════ UC1–UC2 — ui chạy-riêng sau chuỗi suite (AC-2) ═══════════════════════
const SUITES = ['s-a', 's-b', 's-c'];
const argsUC1 = buildArgs({
  evals: [evLenh('E1', 'eval-1'), evLenh('E2', 'eval-2'), evUi('E10'), evUi('E11')],
  suiteCommands: [...SUITES], evalsChayRieng: ['E10'],
});
const ketLuanUC1 = async (src) => {
  const events = [], la = [];
  await runWorkflow(WF, argsUC1, responder({ events, la, tre: { 's-a': 30, 's-b': 30, 's-c': 30 } }), src);
  const loi = [];
  if (la.length) loi.push(`nhãn lạ: ${la.join(',')}`);
  if (idx(events, 'ui:E10', 'start') === -1) loi.push('ui:E10 không chạy');
  else if (!sau(events, 'ui:E10', [...SUITES, 'eval-1', 'eval-2', 'ui:E11'])) loi.push('ui chạy-riêng chồng chuỗi suite');
  if (!(idx(events, 'ui:E11', 'start') !== -1 && idx(events, 'ui:E11', 'start') < idx(events, 's-c', 'end'))) loi.push('ui không khai mất song song');
  return loi;
};
console.log('UC1 ui:E10 (khai) bắt đầu sau mọi suite, mọi lệnh eval và ui:E11; ui:E11 (không khai) vẫn song song');
{
  const loi = await ketLuanUC1(undefined);
  check('UC1 thứ tự đúng', loi.length === 0, loi.join(' ; '));
}
console.log('UC2 chiều đỏ: bản sao đưa ui chạy-riêng về nhánh song song');
{
  const loi = await ketLuanUC1(MUTANT_VE_SONG_SONG);
  if (loi.length) console.log('  (mutant về song song) ' + loi.join(' ; '));
  check('UC2 mutant đỏ với "ui chạy-riêng chồng chuỗi suite"', kimDu(KIM_SS, KIM_CR) && loi.includes('ui chạy-riêng chồng chuỗi suite'),
    `kim ${soLan(SRC, KIM_SS)}/${soLan(SRC, KIM_CR)} ; ${loi.join(' ; ')}`);
}

// ═════ UC3–UC4 — không chồng nhau; lệnh chạy-riêng giữ nhịp 2.28 (AC-3) ════
const argsUC3 = buildArgs({
  evals: [evLenh('E1', 'eval-1'), evLenh('E3', 'nang-1'), evUi('E10'), evUi('E11'), evUi('E12')],
  suiteCommands: ['s-a'], evalsChayRieng: ['E3', 'E10', 'E12'],
});
const ketLuanUC3 = async (src) => {
  const events = [], la = [];
  await runWorkflow(WF, argsUC3, responder({ events, la, tre: { 'ui:E11': 300, 's-a': 30, 'nang-1': 30, 'ui:E10': 30, 'ui:E12': 30 } }), src);
  const loi = [];
  if (la.length) loi.push(`nhãn lạ: ${la.join(',')}`);
  const rieng = ['nang-1', 'ui:E10', 'ui:E12'];
  if (rieng.some(t => idx(events, t, 'start') === -1)) return [...loi, 'tác tử chạy-riêng không chạy'];
  if (!(roiNhau(events, 'nang-1', 'ui:E10') && roiNhau(events, 'nang-1', 'ui:E12') && roiNhau(events, 'ui:E10', 'ui:E12'))) loi.push('hai eval chạy-riêng chồng nhau');
  if (!rieng.every(t => sau(events, t, ['eval-1', 's-a']))) loi.push('chạy-riêng chồng lệnh khác');
  if (!['ui:E10', 'ui:E12'].every(t => sau(events, t, ['nang-1', 'ui:E11']))) loi.push('ui chạy-riêng chồng ui song song');
  if (!(idx(events, 'nang-1', 'start') < idx(events, 'ui:E11', 'end'))) loi.push('lệnh chạy-riêng đổi nhịp (chờ ui song song)');
  return loi;
};
console.log('UC3 ba tác tử chạy-riêng rời nhau; ui chạy-riêng sau nang-1 và ui:E11; nang-1 không chờ ui:E11');
{
  const loi = await ketLuanUC3(undefined);
  check('UC3 thứ tự đúng', loi.length === 0, loi.join(' ; '));
}
console.log('UC4 chiều đỏ: bản sao chạy ui chạy-riêng đồng thời với nhau');
{
  const loi = await ketLuanUC3(MUTANT_DONG_THOI);
  if (loi.length) console.log('  (mutant đồng thời) ' + loi.join(' ; '));
  check('UC4 mutant đỏ với "hai eval chạy-riêng chồng nhau"', kimDu(KIM_TUAN_TU) && loi.includes('hai eval chạy-riêng chồng nhau'),
    `kim ${soLan(SRC, KIM_TUAN_TU)} ; ${loi.join(' ; ')}`);
}

// ═════ UC5–UC6 — kết quả ui chạy-riêng đi đúng đường định tuyến (AC-4) ═════
const argsUC5 = buildArgs({ evals: [evLenh('E1', 'eval-1'), evUi('E10'), evUi('E11')], suiteCommands: ['suite-a'], evalsChayRieng: ['E10'] });
const CA_UC5 = [
  { ten: '(a) xanh', ket: {}, verdict: 'PASS' },
  { ten: '(b) E10 exit 1, suite-a exit 1', ket: { 'ui:E10': 1, 'suite-a': 1 }, verdict: 'REJECT' },
  { ten: '(c) E10 ném lỗi, suite-a exit 1', ket: { 'ui:E10': 'nem', 'suite-a': 1 }, verdict: 'BLOCKED' },
];
const ketLuanUC5 = async (ca, src) => {
  const la = [];
  const { result: r } = await runWorkflow(WF, argsUC5, responder({ ket: ca.ket, la }), src);
  const loi = [];
  if (la.length) loi.push(`nhãn lạ: ${la.join(',')}`);
  const bl = (r.blocked || []).map(b => b.cmd);
  if (r.verdict !== ca.verdict) loi.push(`verdict ${r.verdict} ≠ ${ca.verdict}`);
  if (ca.verdict === 'PASS' && bl.includes('ui-check:E10')) loi.push('kết quả ui chạy-riêng rơi');
  if (ca.verdict === 'REJECT' && !(r.failedEvals || []).includes('E10')) loi.push('failedEvals thiếu E10');
  if (ca.verdict === 'BLOCKED' && !bl.includes('ui-check:E10')) loi.push('blocked thiếu ui-check:E10');
  if (ca.ket['suite-a'] === 1 && !(r.failedCommands || []).some(f => f.cmd === 'suite-a')) loi.push('kết quả suite rơi');
  if ((r.failedEvals || []).includes('E11') || bl.includes('ui-check:E11')) loi.push('ui song song E11 bị kéo theo');
  return loi;
};
console.log(`UC5 ${CA_UC5.length} kết cục viết trước của ui:E10 chạy-riêng → PASS / REJECT / BLOCKED, nhánh khác còn nguyên`);
{
  const lech = [];
  for (const ca of CA_UC5) { const loi = await ketLuanUC5(ca, undefined); if (loi.length) lech.push(`${ca.ten}: ${loi.join(', ')}`); }
  check(`UC5 ${CA_UC5.length - lech.length}/${CA_UC5.length} kết cục đúng`, lech.length === 0, lech.join(' ; '));
}
console.log('UC6 chiều đỏ: bản sao bỏ kết quả ui chạy-riêng khỏi uiRaw');
{
  const loi = await ketLuanUC5(CA_UC5[0], MUTANT_ROI);
  if (loi.length) console.log('  (mutant rơi kết quả) ' + loi.join(' ; '));
  check('UC6 mutant đỏ với "kết quả ui chạy-riêng rơi"', kimDu(KIM_GOP) && loi.includes('kết quả ui chạy-riêng rơi'), `kim ${soLan(SRC, KIM_GOP)} ; ${loi.join(' ; ')}`);
}

// ═════ UC7 — dry-run (AC-5) ═════════════════════════════════════════════════
console.log('UC7 dry-run: khai → uiChayRieng ["E10"], uiCheckEvals đủ; không khai → khoá vắng');
{
  const { result: d } = await runWorkflow(WF, { ...argsUC1, dryRun: true }, responder());
  const { result: k } = await runWorkflow(WF, { ...argsUC1, evalsChayRieng: undefined, dryRun: true }, responder());
  const loi = [];
  if (JSON.stringify(d.uiChayRieng) !== '["E10"]') loi.push(`uiChayRieng ${JSON.stringify(d.uiChayRieng)}`);
  if (JSON.stringify(d.uiCheckEvals) !== '["E10","E11"]') loi.push(`uiCheckEvals ${JSON.stringify(d.uiCheckEvals)}`);
  if ('uiChayRieng' in k) loi.push('không khai mà có khoá uiChayRieng');
  check('UC7 dry-run đúng', loi.length === 0, loi.join(' ; '));
}

// ═════ UC8–UC10 — vi phân với v2.33.0 (AC-6) ══════════════════════════════
// Base là mốc CỐ ĐỊNH, không phải merge-base: sau khi gộp merge-base trùng cây và vi phân rỗng.
const BASE_REF = 'v2.33.0';
let BASE_SRC = null, baseLoi = '';
try { BASE_SRC = execFileSync('git', ['-C', KIT, 'show', `${BASE_REF}:feature-loop/workflows/acceptance-verify.js`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
catch (e) { baseLoi = String((e && e.stderr) || e).split('\n')[0]; }
const EVALS_VP = [evLenh('E1', 'eval-1'), evLenh('E2', 'eval-2'), evJ('E3'), evUi('E4'), evUi('E11')];
const BIEN_THE = [
  { ten: '(i) không khai, xanh', args: buildArgs({ evals: EVALS_VP, suiteCommands: ['s-a', 's-b'] }), ket: {}, pass: true },
  { ten: '(ii) không khai, s-b exit 1 + ui:E11 ném lỗi', args: buildArgs({ evals: EVALS_VP, suiteCommands: ['s-a', 's-b'] }), ket: { 's-b': 1, 'ui:E11': 'nem' }, pass: false },
  { ten: '(iii) chỉ khai lệnh chạy-riêng', args: buildArgs({ evals: EVALS_VP, suiteCommands: ['s-a', 's-b'], evalsChayRieng: ['E2'] }), ket: {}, pass: true },
];
const vet = async (bt, src) => {
  const la = [];
  const { result, calls } = await runWorkflow(WF, bt.args, responder({ ket: bt.ket, la }), src);
  const { result: dry } = await runWorkflow(WF, { ...bt.args, dryRun: true }, responder(), src);
  return {
    goi: JSON.stringify(calls.filter(c => c.label.startsWith('machine:') || c.label.startsWith('ui:')).map(c => [c.label, c.prompt])),
    kq: JSON.stringify({ verdict: result.verdict, failedEvals: result.failedEvals, blocked: result.blocked }),
    dry: JSON.stringify(dry), verdict: result.verdict, la,
  };
};
console.log(`UC8 ${BIEN_THE.length} biến thể không khai ui: lời gọi máy+ui, kết quả, dry-run BẰNG HỆT ${BASE_REF}`);
const vpBase = [];
if (!BASE_SRC) check(`UC8 không giải được ${BASE_REF} — hạ tầng (cần tag; CI fetch-depth 0)`, false, baseLoi);
else {
  const loi = [];
  if (BASE_SRC === SRC) loi.push('base trùng cây — vi phân rỗng');
  for (const bt of BIEN_THE) {
    const b = await vet(bt, BASE_SRC), t = await vet(bt, undefined);
    vpBase.push(b);
    if (b.la.length || t.la.length) loi.push(`${bt.ten}: nhãn lạ ${[...b.la, ...t.la].join(',')}`);
    for (const [ten, v] of [['base', b], ['cây', t]]) if ((v.verdict === 'PASS') !== bt.pass) loi.push(`${bt.ten}: kết cục ${ten} sai (${v.verdict})`);
    if (t.goi !== b.goi) loi.push(`${bt.ten}: thứ tự lời gọi đổi`);
    if (t.kq !== b.kq) loi.push(`${bt.ten}: kết quả khác base`);
    if (t.dry !== b.dry) loi.push(`${bt.ten}: dry-run khác base`);
  }
  check('UC8 bằng hệt base ở cả ba biến thể, kết cục ghim đúng', loi.length === 0, loi.join(' ; '));
}
console.log('UC9 khai E10: prompt ui:E10 bằng hệt base');
if (BASE_SRC) {
  const a = buildArgs({ evals: [evLenh('E1', 'eval-1'), evUi('E10')], suiteCommands: ['s-a'], evalsChayRieng: ['E10'] });
  const p = async (src) => ((await runWorkflow(WF, a, responder(), src)).calls.find(c => c.label === 'ui:E10') || {}).prompt;
  const pb = await p(BASE_SRC), pt = await p(undefined);
  check('UC9 prompt ui:E10 bằng hệt base', typeof pt === 'string' && pt.length > 0 && pt === pb, `cây ${pt ? pt.length : 'vắng'} ký tự, base ${pb ? pb.length : 'vắng'}`);
} else check('UC9 không chạy được vì UC8 thiếu base', false, baseLoi);
console.log('UC10 chiều đỏ: bản sao coi mọi ui-check là chạy-riêng');
if (vpBase.length) {
  const m = await vet(BIEN_THE[0], MUTANT_MOI_UI_RIENG);
  const doi = m.goi !== vpBase[0].goi;
  if (doi) console.log('  (mutant mọi ui chạy riêng) thứ tự lời gọi đổi');
  check('UC10 mutant đỏ với "thứ tự lời gọi đổi"', kimDu(KIM_SS, KIM_CR) && doi, `kim ${soLan(SRC, KIM_SS)}/${soLan(SRC, KIM_CR)} doi=${doi}`);
} else check('UC10 không chạy được vì UC8 thiếu base', false, baseLoi);

summary('ui-check-chay-sau-suite');
