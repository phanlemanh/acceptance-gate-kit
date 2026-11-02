// ui-check-tuan-tu.test.mjs — hồ sơ sua-loi-dau-chu-dong-vao (issue #477 lỗi 5): AC-8 (UT-1) các eval ui-check chạy
// TUẦN TỰ với nhau (chung một trình duyệt), khối ui vẫn song song với lệnh máy; AC-7 nửa workflow (UT-2) lời gọi người
// chấm ui-check mang giá trị đã giải của config:dev_server.url (args.devServerUrl).
//
// Đo bằng CỜ THỨ TỰ (khuôn suite-tuan-tu.test.mjs): agent giả ghi `start` khi nhận lời gọi và `end` sau một nhịp
// setTimeout — chồng hay không là quan hệ thứ tự trên mảng sự kiện, không phụ thuộc máy nhanh hay chậm. Chiều đỏ: đột biến
// trên BẢN SAO TRONG BỘ NHỚ (`srcOverride`), kim khẳng định khớp ĐÚNG MỘT lần trong nguồn thật trước khi tin màu đỏ.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const URL = 'http://localhost:4173';

// Bên VIẾT thật của devServerUrl (gap-probe P2): s4-args sinh args.json trên một kho thử khai dev_server.url; UT-2 lấy
// trường ấy từ tệp sinh ra, không tự đặt — tên trường lệch giữa hai bên thì UT-2 đỏ.
function devServerTuS4Args() {
  const d = mkdtempSync(path.join(tmpdir(), 'ut-s4args-'));
  try {
    const git = (...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8' });
    mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
    git('init', '-q', '-b', 'main'); git('config', 'user.email', 't@t.t'); git('config', 'user.name', 'T');
    writeFileSync(path.join(d, '_acceptance', 'config.yaml'), `schema_version: 1\ndev_server:\n  url: "${URL}"\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n`);
    writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
    writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: ui-check\n    expected: thay bang\n    steps:\n      - "mo trang"\n');
    writeFileSync(path.join(d, 'README.md'), 'x\n');
    git('add', '-A'); git('commit', '-qm', 'r1'); git('checkout', '-qb', 'vong');
    writeFileSync(path.join(d, 'src.js'), 'x\n'); git('add', '-A'); git('commit', '-qm', 'vat');
    const out = path.join(d, 'args.json');
    execFileSync(process.execPath, [path.join(HERE, '..', '..', 'feature-loop', 'scripts', 's4-args.mjs'), '--slug', 'demo', '--root', d, '--ag-root', path.join(HERE, '..', '..'), '--out', out, '--diff-base', 'main'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return JSON.parse(readFileSync(out, 'utf8')).devServerUrl;
  } catch { return undefined; } finally { rmSync(d, { recursive: true, force: true }); }
}
const DEV_TU_S4 = devServerTuS4Args();

const uiEval = (id) => ({ id, criterion: 'AC-1', executor: 'ui-check', ref: 'config:executors.ui.web', steps: ['mo trang', 'chup man'], expected: 'thay bang', evidence_required: ['screenshot'] });
const buildArgs = (over = {}) => ({
  slug: 'demo-ui-tuan-tu',
  round: 1,
  riskTier: 'T2',
  evals: [
    uiEval('E1'),
    uiEval('E2'),
    { id: 'E3', criterion: 'AC-2', executor: 'script', cmd: 'eval-3', ref: 'config:executors.script.e3', expected: 'ok' },
  ],
  suiteCommands: [],
  diffBase: 'main',
  repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md',
  invokedAt: '2026-11-03T10:00:00Z',
  devServerUrl: DEV_TU_S4,
  ...over,
});

const responder = (events) => (call) => {
  const l = call.label;
  const timed = (ten, ketQua) => {
    events.push({ ten, ev: 'start' });
    return new Promise(r => setTimeout(() => { events.push({ ten, ev: 'end' }); r(ketQua); }, 30));
  };
  if (l.startsWith('ui:')) return timed(l, { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: `/repo/evidence/${l.slice(3)}-step1.png`, observed: 'thay bang so lieu dung nhu expected', networkObserved: 'clean' });
  if (l.startsWith('machine:')) return timed(l, { exitCode: 0, outputTail: 'green\n__EXIT=0', runId: '', cannotRun: false });
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('triage')) return { items: [] };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  throw new Error('unexpected agent label: ' + l);
};

const idx = (events, ten, ev) => events.findIndex(e => e.ten === ten && e.ev === ev);
const chong = (events, a, b) => {
  const [sa, ea, sb, eb] = [idx(events, a, 'start'), idx(events, a, 'end'), idx(events, b, 'start'), idx(events, b, 'end')];
  if ([sa, ea, sb, eb].some(i => i === -1)) return null; // không chạy thì không kết luận
  return !(ea < sb || eb < sa);
};

async function doUT1(src) {
  const events = [];
  const { calls, result } = await runWorkflow(WF, buildArgs(), responder(events), src);
  const ui = calls.filter(c => c.label.startsWith('ui:')).map(c => c.label);
  const may = calls.find(c => c.label.startsWith('machine:'))?.label;
  return {
    motMoiEval: JSON.stringify(ui.sort()) === JSON.stringify(['ui:E1', 'ui:E2']),
    uiChong: chong(events, 'ui:E1', 'ui:E2'),
    mayChongUi: may ? chong(events, may, 'ui:E1') : null,
    coBaoCao: typeof result?.report === 'string' && result.report.length > 0,
  };
}
async function doUT2(src, over = {}) {
  const { calls } = await runWorkflow(WF, buildArgs(over), responder([]), src);
  return calls.filter(c => c.label.startsWith('ui:')).map(c => c.prompt);
}
const VANG = 'config chưa khai dev_server.url';

// ── UT-1 (AC-8) ───────────────────────────────────────────────────────────────
const u1 = await doUT1();
check('UT-1 ui-check tuần tự — ui:E1 và ui:E2 không chồng, mỗi eval một người chấm, khối ui song song lệnh máy, có báo cáo',
  u1.motMoiEval && u1.uiChong === false && u1.mayChongUi === true && u1.coBaoCao, JSON.stringify(u1));

// ── UT-2 (AC-7, nửa workflow) ────────────────────────────────────────────────
const p2 = await doUT2();
const p2v = await doUT2(undefined, { devServerUrl: undefined });
check('UT-2 lời gọi ui-check mang dev_server.url đã giải; vắng thì nói thẳng chưa khai',
  DEV_TU_S4 === URL && p2.length === 2 && p2.every(p => p.includes(URL)) && p2v.length === 2 && p2v.every(p => p.includes(VANG) && !p.includes(URL)),
  `s4-args sinh: ${DEV_TU_S4} · co URL: ${p2.map(p => p.includes(URL))} · vang: ${p2v.map(p => p.includes(VANG))}`);

// ── Chiều đỏ trên bản sao trong bộ nhớ ───────────────────────────────────────
const soLan = (hay, kim) => hay.split(kim).length - 1;
// UT-1-do: trả khối ui về parallel().
const KIM_TT = '<<<UI-TUAN-TU-KIM>>>';
const KIM_UI_DONG = SRC.split('\n').find(d => d.includes(KIM_TT));
{
  const ok1 = KIM_UI_DONG !== undefined && soLan(SRC, KIM_TT) === 1;
  let do1 = null;
  if (ok1) {
    const mutant = SRC.replace(KIM_UI_DONG, KIM_UI_DONG.replace(/tuanTu\(/, 'parallel('));
    do1 = mutant !== SRC ? await doUT1(mutant) : null;
  }
  check('UT-1-do bản sao trả khối ui về parallel() → kiểm UT-1 đỏ (ui:E1 chồng ui:E2)', ok1 && do1 && do1.uiChong === true, `kim=${ok1} ${JSON.stringify(do1)}`);
}
// UT-2-do: bỏ dòng tiêm URL.
{
  const KIM = '${DEV_SERVER_DONG}';
  const ok2 = soLan(SRC, KIM) === 1;
  const p = ok2 ? await doUT2(SRC.replace(KIM, '')) : [];
  check('UT-2-do bản sao bỏ dòng tiêm dev_server.url → kiểm UT-2 đỏ', ok2 && p.length === 2 && p.every(x => !x.includes(URL)), `kim=${ok2}`);
}

summary('ui-check-tuan-tu');
