// round-signal.test.mjs — hồ sơ cham-dung-cay-dung-cho-dung (AC-8, AC-9, AC-12).
// Vắng mặt là tín hiệu (dòng vang-mat + verdict không sạch), mỗi lượt một dòng
// round-tally máy-đọc-được (round-trip qua bộ đọc THẬT round-tally-read.mjs),
// và hạ-tầng-hỏng (cd-fail / exit 127) đi nhánh BLOCKED chứ không giả dạng FAIL
// sản phẩm — trong khi exit 1 thường vẫn là FAIL thật (phân loại không nuốt lỗi).
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');
const READER = path.join(HERE, '..', '..', 'feature-loop', 'scripts', 'round-tally-read.mjs');
const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';

const baseArgs = (over = {}) => ({
  slug: 'demo',
  round: 1,
  riskTier: 'T2',
  evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
    { id: 'E2', criterion: 'AC-2', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
  ],
  suiteCommands: ['npm run build'],
  diffBase: 'main',
  repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md',
  invokedAt: '2026-08-29T10:00:00Z',
  invokedSha: VC,
  ...over,
});

function responder(overrides = {}) {
  return (call) => {
    const l = call.label;
    for (const [prefix, v] of Object.entries(overrides)) {
      if (l.startsWith(prefix)) return typeof v === 'function' ? v(call) : v;
    }
    if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green', runId: '', cannotRun: false };
    if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'ok' };
    if (l.startsWith('review:')) return { findings: [] };
    if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '# Findings demo' };
    throw new Error('unexpected agent label: ' + l);
  };
}
const logLines = (result) => (result.runLog || []).map(l => JSON.parse(l));

console.log('RS1 vang-mat: agent chet phai DE LAI DONG va verdict khong sach');
{
  // moi agent cua lenh 'pnpm test' chet (null) — 2 eval E1/E2 mat ket qua
  const { result } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': () => null }));
  const vm = logLines(result).filter(l => l.kind === 'vang-mat');
  check('RS1 verdict BLOCKED (khong PASS sach)', result.verdict === 'BLOCKED', result.verdict);
  check('RS1 dong vang-mat cho E1+E2 mang round', vm.length === 2 && vm.every(l => l.round === 1) && ['E1', 'E2'].every(id => vm.some(l => l.evalId === id)), JSON.stringify(vm));
  check('RS1 dong vang-mat co reason', vm.every(l => typeof l.reason === 'string' && l.reason.length > 0));
  // doi chung duong: du ket qua → 0 dong vang-mat, verdict nhu cu
  const { result: r2 } = await runWorkflow(WF, baseArgs(), responder());
  check('RS1 doi chung: du ket qua → 0 vang-mat + PASS', r2.verdict === 'PASS' && logLines(r2).every(l => l.kind !== 'vang-mat'));
}

console.log('RS2 round-tally: mot dong moi luot, so LECH duoc, round-trip qua bo doc that');
{
  // ca sach
  const { result } = await runWorkflow(WF, baseArgs(), responder());
  const tallies = logLines(result).filter(l => l.kind === 'round-tally');
  check('RS2 ca sach: dung MOT dong tally', tallies.length === 1, String(tallies.length));
  const t = tallies[0] || {};
  const scheduledIndep = 2; // dem doc lap tu args: distinct cmds = {pnpm test, npm run build}, khong ui
  check('RS2 ca sach: expected=returned=lich-doc-lap, blocked=0, verdict PASS, sha co mat',
    t.expected === scheduledIndep && t.returned === scheduledIndep && t.blocked === 0 && t.verdict === 'PASS' && t.sha === VC, JSON.stringify(t));
  // ca lech: 1 lenh chet → expected > returned, blocked ≥ 1 (chong writer hardcode returned=expected)
  const { result: rl } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': () => null }));
  const tl = logLines(rl).filter(l => l.kind === 'round-tally')[0] || {};
  check('RS2 ca lech: expected > returned va blocked >= 1', tl.expected === scheduledIndep && tl.returned === 1 && tl.blocked >= 1 && tl.verdict === 'BLOCKED', JSON.stringify(tl));
  // round-trip qua bo doc THAT: writer va reader cung lan chay
  const tmp = mkdtempSync(path.join(tmpdir(), 'tally-'));
  const logPath = path.join(tmp, 'run-log.jsonl');
  writeFileSync(logPath, rl.runLog.join('\n') + '\n');
  const parsed = JSON.parse(execFileSync(process.execPath, [READER, '--run-log', logPath], { encoding: 'utf8' }));
  check('RS2 reader rut lai dung so tu dong vua sinh', Array.isArray(parsed) && parsed.length === 1 && parsed[0].expected === tl.expected && parsed[0].returned === tl.returned && parsed[0].blocked === tl.blocked && parsed[0].verdict === 'BLOCKED', JSON.stringify(parsed));
  // chieu do: xoa mot khoa khoi dong → reader DO ghim ten khoa thieu
  const broken = logLines(rl).map(l => { if (l.kind === 'round-tally') { const { blocked: _b, ...rest } = l; return rest; } return l; });
  writeFileSync(logPath, broken.map(l => JSON.stringify(l)).join('\n') + '\n');
  let readerErr = '';
  try { execFileSync(process.execPath, [READER, '--run-log', logPath], { encoding: 'utf8' }); }
  catch (e) { readerErr = String(e.stderr || ''); }
  check('RS2 chieu do reader: thieu khoa "blocked" → do, ghim ten khoa', /blocked/.test(readerErr), readerErr.slice(0, 120));
}

console.log('RS3 ha-tang-hong: ma tran 3 o — cd-fail | exit 127 | exit 1 thuong');
{
  // (a) cd that bai (dau hieu trong outputTail, exit 1 cua sh) → BLOCKED, khong phai FAIL san pham
  const cdFail = { exitCode: 1, outputTail: 'sh: line 0: cd: /repo: No such file or directory', runId: '', cannotRun: false };
  const { result: ra } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': cdFail }));
  check('RS3a cd-fail → BLOCKED + reason ghim cd', ra.verdict === 'BLOCKED' && ra.blocked.some(b => /cd/.test(b.reason)) && ra.failedEvals.length === 0, `${ra.verdict} ${JSON.stringify(ra.blocked)} ${JSON.stringify(ra.failedEvals)}`);
  // (b) exit 127 → BLOCKED
  const notFound = { exitCode: 127, outputTail: 'zsh: command not found: pnpm', runId: '', cannotRun: false };
  const { result: rb } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': notFound }));
  check('RS3b exit 127 → BLOCKED + reason ghim 127', rb.verdict === 'BLOCKED' && rb.blocked.some(b => /127/.test(b.reason)) && rb.failedEvals.length === 0, `${rb.verdict}`);
  // (c) exit 1 thuong → van la FAIL san pham (phan loai khong nuot loi that)
  const realFail = { exitCode: 1, outputTail: 'AssertionError: expected 2 got 3', runId: '', cannotRun: false };
  const { result: rc } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': realFail }));
  check('RS3c exit 1 thuong → REJECT voi failedEvals', rc.verdict === 'REJECT' && rc.failedEvals.includes('E1'), `${rc.verdict} ${JSON.stringify(rc.failedEvals)}`);
  // chieu do (mutant): go nhanh phan loai ha tang → o (a) tro thanh REJECT gia
  const src = readFileSync(WF, 'utf8');
  const mut = src.replace(/const normInfra[\s\S]*?\n(?=const )/, 'const normInfra = r => r\n');
  if (mut === src) check('RS3 mutant ap dung duoc (site normInfra ton tai)', false, 'khong tim thay normInfra de mutate');
  else {
    const { result: rm } = await runWorkflow(WF, baseArgs(), responder({ 'machine:pnpm test': cdFail }), mut);
    check('RS3 mutant bi bat: go phan loai → cd-fail giả dạng REJECT (test phan biet duoc)', rm.verdict === 'REJECT');
  }
}

summary('round-signal (cham-dung-cay-dung-cho-dung AC-8/AC-9/AC-12)');
