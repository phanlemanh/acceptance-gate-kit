// s4-args-ui-check-chay-sau-suite.test.mjs — bên VIẾT của hồ sơ ui-check-chay-sau-suite (AC-1, AC-7).
//
//   UW1–UW3 `feature_loop.model_evals` → `evalsChayRieng` nhận ui-check, loại judgment (AC-1).
//   UW4–UW5 round-trip: tệp args do s4-args THẬT sinh → acceptance-verify.js THẬT (qua harness) chạy ui chạy-riêng
//           sau chuỗi suite (AC-7).
// Kho git fixture dựng bằng code trong lượt chạy (khuôn s4-args-lenh-dai-chay-rieng.test.mjs). Chiều đỏ chạy trên
// BẢN SAO trọn thư mục feature-loop/ (cpSync), kim khẳng định khớp ĐÚNG MỘT lần trong nguồn thật. Mọi đường dẫn
// suy từ vị trí tệp này.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, existsSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runWorkflow } from '../workflows/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const FL = path.join(KIT, 'feature-loop');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const check = (m, c, d) => (c ? ok(m) : bad(m, d));
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const soLan = (hay, kim) => hay.split(kim).length - 1;
const TMP = mkdtempSync(path.join(tmpdir(), 's4args-uccs-'));

// Một dòng eval theo executor — đủ trường bắt buộc của bảng EVAL-REQUIRED-FIELDS để s4-args sinh tệp.
const dongEval = ({ id, executor }) => {
  const dau = `  - id: ${id}\n    criterion: AC-1\n    executor: ${executor}\n`;
  if (executor === 'ui-check') return dau + '    expected: trang len\n    steps: ["mo trang"]\n';
  if (executor === 'judgment') return dau + '    question: ro rang khong?\n    inputs: ["README.md"]\n';
  return dau + '    cmd: config:executors.script.khac\n    expected: x\n';
};
const evalYaml = rows => 'schema_version: 1\nfeature_slug: demo\nevals:\n' + rows.map(dongEval).join('');

function buildRepo(evalsBody, flExtra = '') {
  const d = path.join(TMP, 'r-' + Math.random().toString(36).slice(2));
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  script:\n    cli: "echo suite"\n    khac: "echo khac"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n' + flExtra);
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), evalsBody);
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'round1');
  git(d, 'checkout', '-qb', 'vong-nay');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'vat cua vong');
  return d;
}
// → { status, args|null, stderr }; s4Root = thư mục feature-loop/ (thật hoặc bản sao).
function run(d, s4Root = FL) {
  const out = path.join(d, 'args.json');
  try {
    execFileSync(process.execPath, [path.join(s4Root, 'scripts', 's4-args.mjs'), '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 0, args: JSON.parse(readFileSync(out, 'utf8')), stderr: '' };
  } catch (e) {
    return { status: e.status, args: existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null, stderr: String(e.stderr || '') };
  }
}
// Bản sao trọn feature-loop/ với MỘT phép thay trong một tệp; kim phải khớp đúng một lần.
function banSao(tep, kim, thay) {
  const dst = path.join(TMP, 'fl-' + Math.random().toString(36).slice(2));
  cpSync(FL, dst, { recursive: true });
  const f = path.join(dst, tep);
  const src = readFileSync(f, 'utf8');
  if (soLan(src, kim) !== 1) return { dst: null, kimLoi: `kim khớp ${soLan(src, kim)} lần trong ${tep}: ${kim.slice(0, 60)}` };
  writeFileSync(f, src.replace(kim, thay));
  return { dst };
}
const KIM_LOC = "const EXECUTOR_CHAY_RIENG = new Set(['test', 'script', 'ui-check']);";
const LOC_CU = "const EXECUTOR_CHAY_RIENG = new Set(['test', 'script']);";

// ═════ UW1–UW3 — model_evals → evalsChayRieng (AC-1) ════════════════════════
const EVALS_UW = evalYaml([{ id: 'E1', executor: 'script' }, { id: 'E2', executor: 'ui-check' }, { id: 'E3', executor: 'judgment' }, { id: 'E4', executor: 'ui-check' }]);
const KHOA_UW = '  model_evals: [demo/E1, demo/E2, demo/E3]\n';
const ketLuanUW = r => {
  if (r.status !== 0 || !r.args) return [`s4-args thoát ${r.status}: ${r.stderr.split('\n')[0]}`];
  const v = JSON.stringify(r.args.evalsChayRieng);
  if (v === '["E1","E2"]') return [];
  if (v === '["E1"]') return ['ui-check vắng khỏi evalsChayRieng'];
  return [`evalsChayRieng ${v}`];
};
console.log('UW1 model_evals [E1 script, E2 ui-check, E3 judgment] + E4 ui-check không khai → evalsChayRieng ["E1","E2"]');
{
  const loi = ketLuanUW(run(buildRepo(EVALS_UW, KHOA_UW)));
  check('UW1 evalsChayRieng BẰNG ["E1","E2"]', loi.length === 0, loi.join(' ; '));
}
console.log('UW2 kho không khai model_evals → khoá evalsChayRieng vắng hẳn');
{
  const r = run(buildRepo(EVALS_UW));
  check('UW2 không có khoá evalsChayRieng', r.status === 0 && r.args && !('evalsChayRieng' in r.args), `${r.status} ${JSON.stringify(r.args && Object.keys(r.args))}`);
}
console.log('UW3 chiều đỏ: bản sao s4-args với bộ lọc cũ (test/script)');
{
  const { dst, kimLoi } = banSao(path.join('scripts', 's4-args.mjs'), KIM_LOC, LOC_CU);
  if (!dst) bad('UW3 không dựng được bản sao', kimLoi);
  else {
    const loi = ketLuanUW(run(buildRepo(EVALS_UW, KHOA_UW), dst));
    if (loi.length) console.log('  (bản sao bộ lọc cũ) ' + loi.join(' ; '));
    check('UW3 bản sao đỏ với "ui-check vắng khỏi evalsChayRieng"', loi.includes('ui-check vắng khỏi evalsChayRieng'), loi.join(' ; '));
  }
}

// ═════ UW4–UW5 — round-trip bên viết → bên đọc (AC-7) ═════════════════════
const WF = path.join(FL, 'workflows', 'acceptance-verify.js');
const SUITE = 'echo suite';
const stub = events => (c) => {
  const l = c.label;
  const chay = (ten, kq, ms) => { events.push({ ten, ev: 'start' }); return new Promise(r => setTimeout(() => { events.push({ ten, ev: 'end' }); r(kq); }, ms)); };
  if (l.startsWith('machine:')) return chay(l.slice('machine:'.length), { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false }, 40);
  if (l.startsWith('ui:')) return chay(l, { exitCode: 0, outputTail: 'assert ok', runId: '', screenshotPath: '', observed: '', networkObserved: 'n-a (driver)', cannotRun: false }, 20);
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'ok' };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('triage')) return { items: [] };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
  if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
  return {};
};
const idx = (events, ten, ev) => events.findIndex(e => e.ten === ten && e.ev === ev);
const EVALS_RT = evalYaml([{ id: 'E1', executor: 'script' }, { id: 'E2', executor: 'ui-check' }]);
const ketLuanRT = async (r) => {
  if (r.status !== 0 || !r.args) return [`s4-args thoát ${r.status}: ${r.stderr.split('\n')[0]}`];
  const events = [];
  await runWorkflow(WF, r.args, stub(events));
  if (idx(events, 'ui:E2', 'start') === -1) return ['ui:E2 không chạy'];
  if (idx(events, SUITE, 'end') === -1) return ['lệnh suite không chạy'];
  return idx(events, 'ui:E2', 'start') > idx(events, SUITE, 'end') ? [] : ['ui chạy-riêng chồng chuỗi suite'];
};
const repoRT = () => buildRepo(EVALS_RT, '  model_evals: [demo/E2]\n');
console.log('UW4 args do s4-args thật sinh → workflow thật: ui:E2 bắt đầu sau khi lệnh suite kết thúc');
{
  const loi = await ketLuanRT(run(repoRT()));
  check('UW4 round-trip đúng thứ tự', loi.length === 0, loi.join(' ; '));
}
console.log('UW5 chiều đỏ: args do bản sao s4-args bộ lọc cũ sinh');
{
  const { dst, kimLoi } = banSao(path.join('scripts', 's4-args.mjs'), KIM_LOC, LOC_CU);
  if (!dst) bad('UW5 không dựng được bản sao', kimLoi);
  else {
    const loi = await ketLuanRT(run(repoRT(), dst));
    if (loi.length) console.log('  (bản sao bộ lọc cũ) ' + loi.join(' ; '));
    check('UW5 bản sao đỏ với "ui chạy-riêng chồng chuỗi suite"', loi.includes('ui chạy-riêng chồng chuỗi suite'), loi.join(' ; '));
  }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-ui-check-chay-sau-suite)`);
if (fail) process.exit(1);
