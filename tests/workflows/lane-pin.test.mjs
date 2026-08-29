// lane-pin.test.mjs — hồ sơ cham-dung-cay-dung-cho-dung (AC-6, AC-7).
// Chỗ đứng của agent chấm phải được ĐẶT trong chính chuỗi lệnh theo LANE:
// lane verifier máy/UI ghim `cd <repoRoot> && <cmd>`; lane baseline giữ
// worktree `cd "$WT"` — nướng cd repoRoot vào lane baseline là mọi eval
// baseline mất khả năng phân biệt (chạy nhầm cây làm việc).
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';

const baseArgs = (over = {}) => ({
  slug: 'demo',
  round: 1,
  riskTier: 'T2',
  evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
    { id: 'EU', criterion: 'AC-2', executor: 'ui-check', steps: ['mo trang /', 'curl kiem marker'], expected: 'marker co mat' },
  ],
  suiteCommands: ['npm run build'],
  diffBase: 'main',
  repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md',
  invokedAt: '2026-08-29T10:00:00Z',
  ...over,
});

const responder = () => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green', runId: '', cannotRun: false };
  if (l.startsWith('ui:')) return { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: 'evidence/EU-step1.png', observed: 'thay marker trong frame da luu' };
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'ok' };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
  throw new Error('unexpected agent label: ' + l);
};
const byLabel = (calls, prefix) => calls.filter(c => c.label.startsWith(prefix));

console.log('LP1 lane verifier may: lenh giao agent da ghim cd <repoRoot> &&');
{
  const { calls } = await runWorkflow(WF, baseArgs(), responder());
  const machine = byLabel(calls, 'machine:');
  check('LP1 co lane may', machine.length >= 2, String(machine.length));
  check('LP1 moi prompt may chua "cd /repo && <cmd>"',
    machine.every(c => /cd \/repo && (pnpm test|npm run build)/.test(c.prompt)),
    machine.map(c => c.label).join(','));
  check('LP1 khong con dang chi-ke "Trong repo /repo, chay dung lenh"',
    machine.every(c => !/Trong repo \/repo, chay dung lenh/.test(c.prompt)));
}

console.log('LP2 lane UI: chi dan dat cho dung trong chinh lenh, khong con cau khang dinh cwd');
{
  const { calls } = await runWorkflow(WF, baseArgs(), responder());
  const ui = byLabel(calls, 'ui:');
  check('LP2 co lane UI', ui.length === 1, String(ui.length));
  check('LP2 prompt UI chua "cd /repo &&"', ui.every(c => /cd \/repo && /.test(c.prompt)));
  check('LP2 het cau "(cwd cua ban)"', ui.every(c => !/\(cwd cua ban\)/.test(c.prompt)));
}

console.log('LP3 lane baseline: giu cho dung worktree, khong ro cd repoRoot vao lenh baseline');
{
  const { calls } = await runWorkflow(WF, baseArgs(), responder());
  const bl = byLabel(calls, 'baseline:');
  check('LP3 co lane baseline', bl.length === 1, String(bl.length));
  check('LP3 baseline ghim cd "$WT" &&', bl.every(c => /cd "\$WT" &&/.test(c.prompt)));
  check('LP3 lenh baseline KHONG mang cd /repo', bl.every(c => !/cd \/repo && /.test(c.prompt)));
}

console.log('LP4 chieu do (mutant AC-7): nuong cd repoRoot vao lenh baseline -> phai bi phat hien');
{
  const src = readFileSync(WF, 'utf8');
  // mutant: danh sách lệnh baseline bị wrap cd repoRoot (đúng lỗi thiết kế mà AC-7 chặn)
  const mut = src.replace(
    /\$\{baselineCmds\.join\(' , '\)\}/,
    "${baselineCmds.map(c => `cd ${args.repoRoot} && ${c}`).join(' , ')}"
  );
  if (mut === src) { check('LP4 mutant ap dung duoc (site baselineCmds.join ton tai)', false, 'khong tim thay site de mutate'); }
  else {
    const { calls } = await runWorkflow(WF, baseArgs(), responder(), mut);
    const bl = byLabel(calls, 'baseline:');
    const leaked = bl.some(c => /cd \/repo && /.test(c.prompt));
    check('LP4 mutant bi bat: baseline mat phan biet (cd /repo lot vao lenh baseline)', leaked === true);
  }
}

summary('lane-pin (cham-dung-cay-dung-cho-dung AC-6/AC-7)');
