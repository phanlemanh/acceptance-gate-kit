// not-run-luot-cham.test.mjs — thuoc-co-cua AC-1 (E2): lượt chấm NÓI RA ô khai
// không-chạy bằng MỘT dòng trong prompt của bước tổng hợp, và không chữ nào thêm
// khi args không mang khoá `evalsNotRun` (đường đọc-cũ).
//
// Fixture là args dựng bằng code trong lượt chạy, đi qua CHÍNH tệp workflow thật
// (harness nạp nguồn, không bản chép). Tên ca là hợp đồng với khoá executor
// `tcc_wf_not_run` trong _acceptance/config.yaml — dòng in phải là `PASS: <TÊN CA> `.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');

const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
// Lệnh của ô khai không-chạy: bên sinh args đã bỏ E9 khỏi `evals`, nên chuỗi này
// không được xuất hiện trong prompt của bất kỳ lời gọi agent nào.
const E9_CMD = 'bash tests/e9-khong-duoc-chay.sh';
const DONG = 'không chạy theo hồ sơ: E9';

const buildArgs = (over = {}) => ({
  slug: 'demo-not-run',
  round: 1,
  riskTier: 'T2',
  evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
    { id: 'E2', criterion: 'AC-2', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'ok' },
  ],
  suiteCommands: ['npm run build'],
  diffBase: 'main',
  repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md',
  invokedAt: '2026-09-17T10:00:00Z',
  ...over,
});

// Responder xanh cùng hình dạng ca W03 (acceptance-verify.test.mjs).
const responder = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green', runId: '', cannotRun: false };
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  throw new Error('unexpected agent label: ' + l);
};

const soLan = (hay, kim) => hay.split(kim).length - 1;
const synthPrompt = calls => (calls.find(c => c.label.startsWith('synthesize')) || {}).prompt || '';

console.log('NRW1 args mang evalsNotRun -> khong goi lenh cua o ay, prompt tong hop co dung mot dong');
{
  const { result, calls } = await runWorkflow(WF, buildArgs({ evalsNotRun: ['E9'] }), responder);
  const synth = synthPrompt(calls);
  // Đối chứng dương gộp vào CÙNG ca: lượt thật sự đi tới bước tổng hợp — không có vế
  // này, «0 lời gọi mang lệnh E9» xanh cả khi workflow BLOCKED sớm, không spawn agent nào.
  const coLenhE9 = calls.filter(c => String(c.prompt).includes(E9_CMD)).map(c => c.label);
  check('NRW1 khong loi goi nao mang lenh cua E9 va prompt tong hop co dung mot dong «không chạy theo hồ sơ: E9»',
    result.verdict === 'PASS' && synth.length > 0 && coLenhE9.length === 0 && soLan(synth, DONG) === 1,
    `verdict=${result.verdict} synth=${synth.length} coLenhE9=${JSON.stringify(coLenhE9)} soLan=${soLan(synth, DONG)}`);
}

console.log('NRW2 cung fixture bo khoa evalsNotRun -> dong ay KHONG xuat hien');
{
  const { result, calls } = await runWorkflow(WF, buildArgs(), responder);
  const synth = synthPrompt(calls);
  check('NRW2 bo khoa -> dong «không chạy theo hồ sơ» xuat hien 0 lan',
    result.verdict === 'PASS' && synth.length > 0 && soLan(synth, 'không chạy theo hồ sơ') === 0,
    `verdict=${result.verdict} soLan=${soLan(synth, 'không chạy theo hồ sơ')}`);
}

console.log('NRW3 doc-cu: args doi truoc va evalsNotRun undefined cho cung verdict, cung so loi goi');
{
  const cu = await runWorkflow(WF, buildArgs(), responder);
  const undef = await runWorkflow(WF, buildArgs({ evalsNotRun: undefined }), responder);
  check('NRW3 doc-cu: cung verdict, cung calls.length, cung prompt tong hop',
    cu.result.verdict === undef.result.verdict
      && cu.calls.length === undef.calls.length
      && synthPrompt(cu.calls) === synthPrompt(undef.calls),
    `verdict ${cu.result.verdict}/${undef.result.verdict} calls ${cu.calls.length}/${undef.calls.length}`);
}

summary('not-run-luot-cham');
