// Characterization tests for feature-loop/workflows/acceptance-verify.js —
// the PURE layer (classify/dedupe, variance merge, verdict routing, run-log
// lines, provenance sanitize, model routing) exercised through the real file
// with deterministic canned agents. These pin behavior BEFORE any routing
// change (Đợt 2 rule: tách logic thuần + unit test trước, đổi routing sau).
import { fileURLToPath } from 'node:url';
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
    { id: 'E2', criterion: 'AC-2', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
  ],
  suiteCommands: ['npm run build'],
  diffBase: 'main',
  repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md',
  templatePath: '/refs/evidence-report-template.md',
  invokedAt: '2026-07-02T10:00:00Z',
  ...over,
});

// Canned agents by label prefix; per-test overrides win (first match).
function responder(overrides = {}) {
  return (call) => {
    const l = call.label;
    for (const [prefix, v] of Object.entries(overrides)) {
      if (l.startsWith(prefix)) return typeof v === 'function' ? v(call) : v;
    }
    if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green', runId: '', cannotRun: false };
    if (l.startsWith('ui:')) return { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: 'evidence/E-step1.png' };
    if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
    if (l.startsWith('review:')) return { findings: [] };
    if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (l === 'scribe:run-log') return { written: true, lineCount: 99 };
    if (l === 'synthesize:report') return { reportPath: '/repo/_acceptance/demo/evidence-report.md', findingsPath: '/repo/_acceptance/demo/review-findings.md' };
    throw new Error('unexpected agent label: ' + l);
  };
}

const byLabel = (calls, prefix) => calls.filter(c => c.label.startsWith(prefix));

console.log('W01 dryRun: dedupe + runs plan, zero agents spawned');
{
  const { result, calls } = await runWorkflow(WF, baseArgs({ dryRun: true, evals: [
    ...baseArgs().evals,
    { id: 'E3', criterion: 'AC-3', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'ok', runs: 30 },
  ] }), responder());
  check('W01 distinct commands deduped', JSON.stringify(result.distinctCommands) === JSON.stringify(['pnpm test', './x.sh', 'npm run build']), JSON.stringify(result.distinctCommands));
  check('W01 evals mapped to shared cmd', JSON.stringify(result.evalsPerCommand['pnpm test']) === JSON.stringify(['E1', 'E2']));
  check('W01 runs capped at 10', result.runsPerCommand['./x.sh'] === 10, String(result.runsPerCommand['./x.sh']));
  check('W01 no agents in dryRun', calls.length === 0, String(calls.length));
}

console.log('W02 args guards: bad args + JSON-string args');
{
  const { result } = await runWorkflow(WF, {}, responder());
  check('W02 bad args -> BLOCKED', result.verdict === 'BLOCKED' && /array/.test(result.blocked[0].reason));
  const { result: r2 } = await runWorkflow(WF, JSON.stringify(baseArgs({ dryRun: true })), responder());
  check('W02 JSON-string args parsed', Array.isArray(r2.distinctCommands));
  const { result: r3 } = await runWorkflow(WF, baseArgs({ evals: [], suiteCommands: [] }), responder());
  check('W02 nothing to verify -> BLOCKED', r3.verdict === 'BLOCKED');
}

console.log('W03 happy path: PASS + machine-decided run-log + scribe gets exact lines');
{
  const { result, calls } = await runWorkflow(WF, baseArgs(), responder());
  check('W03 verdict PASS', result.verdict === 'PASS', result.verdict);
  check('W03 machine dedupe: 2 machine agents (1 eval-cmd + 1 suite)', byLabel(calls, 'machine:').length === 2, String(byLabel(calls, 'machine:').length));
  check('W03 runLog: 1 line per eval', result.runLog.length === 2, String(result.runLog.length));
  const lines = result.runLog.map(l => JSON.parse(l));
  check('W03 run_id minted deterministically per eval', lines[0].run_id === 'minted-demo-E1-r1' && lines[1].run_id === 'minted-demo-E2-r1');
  check('W03 ts from args.invokedAt', lines.every(l => l.ts === '2026-07-02T10:00:00Z'));
  const scribe = byLabel(calls, 'scribe:run-log')[0];
  check('W03 scribe receives the exact JSONL lines', !!scribe && result.runLog.every(l => scribe.prompt.includes(l)));
  check('W03 runLogWriteFailed false', result.runLogWriteFailed === false);
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W03 synthesize gets verified_commit literal', synth.prompt.includes(`"verified_commit: ${VC}"`));
  check('W03 synthesize gets the evalRunIds map, not minting rights', synth.prompt.includes('minted-demo-E1-r1') && synth.prompt.includes('KHONG tu mint'));
  check('W03 reportPath surfaced', result.reportPath === '/repo/_acceptance/demo/evidence-report.md');
}

console.log('W04 failing eval -> REJECT with failed ids');
{
  const { result } = await runWorkflow(WF, baseArgs(), responder({
    'machine:pnpm test': { exitCode: 1, outputTail: '1 failing', runId: 'run-777', cannotRun: false },
  }));
  check('W04 verdict REJECT', result.verdict === 'REJECT');
  check('W04 failedEvals E1+E2 (shared cmd)', JSON.stringify(result.failedEvals) === JSON.stringify(['E1', 'E2']));
  const lines = result.runLog.map(l => JSON.parse(l));
  check('W04 run-log records real exit + verifier runId', lines.every(l => l.exit_code === 1 && l.run_id === 'run-777'));
}

console.log('W05 cannotRun + dead agent -> BLOCKED, never PASS');
{
  const { result } = await runWorkflow(WF, baseArgs(), responder({
    'machine:pnpm test': { exitCode: 0, outputTail: '', runId: '', cannotRun: true, reason: 'DB local chua chay' },
  }));
  check('W05 cannotRun -> BLOCKED + reason', result.verdict === 'BLOCKED' && /DB local/.test(result.blocked[0].reason));
  const { result: r2 } = await runWorkflow(WF, baseArgs(), responder({
    'machine:npm run build': () => null,
  }));
  check('W05 dead agent -> BLOCKED (skip/chet)', r2.verdict === 'BLOCKED' && r2.blocked.some(b => /skip\/chet/.test(b.reason)));
}

console.log('W06 judge panels: majority + T3 always pending');
{
  const jEval = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?', inputs: ['/repo/x'] };
  let n = 0;
  const votes = ['PASS', 'PASS', 'FAIL'];
  const { result } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, jEval] }), responder({
    'judge:E9': () => ({ verdict: votes[n++], rationale: 'v' }),
  }));
  check('W06 majority 2/3 PASS -> proposal PASS, verdict PASS (T2)', result.verdict === 'PASS' && result.panels[0].proposal === 'PASS');
  n = 0;
  const { result: r2 } = await runWorkflow(WF, baseArgs({ riskTier: 'T3', evals: [...baseArgs().evals, jEval] }), responder({
    'judge:E9': () => ({ verdict: votes[n++], rationale: 'v' }),
  }));
  check('W06 T3 with judgment -> PENDING-JUDGMENT regardless of votes', r2.verdict === 'PENDING-JUDGMENT');
  const { result: r3 } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, jEval] }), responder({
    'judge:E9': { verdict: 'UNCERTAIN', rationale: 'unsure' },
  }));
  check('W06 no majority -> proposal UNCERTAIN -> PENDING-JUDGMENT', r3.verdict === 'PENDING-JUDGMENT' && r3.panels[0].proposal === 'UNCERTAIN');
}

console.log('W07 variance-N: mixed pass-rate -> PENDING-JUDGMENT; short sample -> BLOCKED');
{
  const vEval = { id: 'E7', criterion: 'AC-7', executor: 'script', cmd: './rand.sh', ref: 'config:executors.script.cli', expected: 'ok', runs: 3 };
  let n = 0;
  const exits = [0, 1, 0];
  const { result, calls } = await runWorkflow(WF, baseArgs({ evals: [vEval], suiteCommands: [] }), responder({
    'machine:./rand.sh': () => ({ exitCode: exits[n++], outputTail: 't', runId: '', cannotRun: false }),
  }));
  check('W07 runs 3 agents for runs:3', byLabel(calls, 'machine:./rand.sh').length === 3);
  check('W07 mixed 2/3 -> PENDING-JUDGMENT + variance surfaced', result.verdict === 'PENDING-JUDGMENT' && result.variance[0].passRate === '2/3');
  const logLine = JSON.parse(result.runLog[0]);
  check('W07 run-log carries runs/passes', logLine.runs === 3 && logLine.passes === 2);
  n = 0;
  const { result: r2 } = await runWorkflow(WF, baseArgs({ evals: [vEval], suiteCommands: [] }), responder({
    'machine:./rand.sh': () => (n++ === 1 ? null : { exitCode: 0, outputTail: 't', runId: '', cannotRun: false }),
  }));
  check('W07 missing sample (dead run) -> BLOCKED, not a fake pass-rate', r2.verdict === 'BLOCKED');
}

console.log('W08 A/B baseline: green-on-both flagged, suite cmds excluded');
{
  const { result, calls } = await runWorkflow(WF, baseArgs(), responder({
    'baseline:': { results: [{ cmd: 'pnpm test', baselineExit: 0, cannotRun: false }] },
  }));
  check('W08 green-on-both -> nonDiscriminating', result.nonDiscriminating.length === 1 && result.nonDiscriminating[0].cmd === 'pnpm test');
  const bl = byLabel(calls, 'baseline:')[0];
  check('W08 baseline runs eval-cmds only (no suite cmd)', bl.prompt.includes('pnpm test') && !bl.prompt.includes('npm run build'));
  check('W08 verdict still PASS (baseline is advisory)', result.verdict === 'PASS');
}

console.log('W09 review lane: refute filter, dead refuter, dead finder');
{
  const finding = { title: 'silent catch', file: 'src/a.js', line: 3, severity: 'high', detail: 'swallows err' };
  const { result } = await runWorkflow(WF, baseArgs(), responder({
    'review:conventions': { findings: [finding] },
    'refute:': { refuted: false, reason: 'real' },
  }));
  check('W09 unrefuted finding survives', result.confirmedFindings.length === 1 && result.confirmedFindings[0].source === 'conventions');
  const { result: r2 } = await runWorkflow(WF, baseArgs(), responder({
    'review:conventions': { findings: [finding] },
    'refute:': () => null,
  }));
  check('W09 dead refuter -> finding kept, marked unverified', r2.confirmedFindings.length === 1 && r2.confirmedFindings[0].unverified === true);
  const { result: r3 } = await runWorkflow(WF, baseArgs(), responder({
    'review:bugs': () => null,
  }));
  check('W09 dead finder -> reviewIncomplete (not "0 findings")', r3.reviewIncomplete.includes('bugs'));
}

console.log('W10 model routing characterization (the table a routing change must consciously break)');
{
  const jEval = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'q', inputs: [] };
  const uEval = { id: 'E5', criterion: 'AC-5', executor: 'ui-check', steps: ['open /'], expected: '200' };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, jEval, uEval] }), responder({
    'review:conventions': { findings: [{ title: 't', file: 'f', severity: 'low', detail: 'd' }] },
    'refute:': { refuted: true, reason: 'no' },
  }));
  const model = (prefix) => byLabel(calls, prefix).map(c => c.opts.model);
  check('W10 machine -> haiku', model('machine:').every(m => m === 'haiku'));
  check('W10 ui-check -> sonnet', model('ui:').every(m => m === 'sonnet'));
  check('W10 judge -> sonnet', model('judge:').every(m => m === 'sonnet'));
  check('W10 review finders -> inherit session (no model)', model('review:').every(m => m === undefined));
  check('W10 refuter -> sonnet', model('refute:').every(m => m === 'sonnet'));
  check('W10 baseline -> sonnet', model('baseline:').every(m => m === 'sonnet'));
  check('W10 provenance -> sonnet', model('capture:provenance').every(m => m === 'sonnet'));
  check('W10 scribe -> haiku', model('scribe:').every(m => m === 'haiku'));
  check('W10 synthesize -> sonnet', model('synthesize:').every(m => m === 'sonnet'));
  check('W10 executors isolation untouched (no worktree here)', calls.every(c => c.opts.isolation === undefined));
}

console.log('W11 verified_commit sanitize is pure JS, not agent trust');
{
  const { calls } = await runWorkflow(WF, baseArgs(), responder({
    'capture:provenance': { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'HEAD-not-a-sha' },
  }));
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W11 garbage SHA -> field omitted + explicit no-fake instruction', !synth.prompt.includes('verified_commit: HEAD') && synth.prompt.includes('BO HAN field verified_commit'));
  const { calls: c2 } = await runWorkflow(WF, baseArgs(), responder({
    'capture:provenance': { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC.toUpperCase() },
  }));
  check('W11 uppercase SHA normalized to lowercase', byLabel(c2, 'synthesize:report')[0].prompt.includes(`"verified_commit: ${VC}"`));
}

console.log('W12 scribe failure -> runLogWriteFailed + loud log');
{
  const { result, logs } = await runWorkflow(WF, baseArgs(), responder({
    'scribe:run-log': { written: false, lineCount: 0 },
  }));
  check('W12 flag set', result.runLogWriteFailed === true);
  check('W12 warning logged for main-loop fallback', logs.some(l => /THAT BAI/.test(l)));
}

console.log('W13 ui-check merges into machine lane + run-log');
{
  const uEval = { id: 'E5', criterion: 'AC-5', executor: 'ui-check', steps: ['open /'], expected: '200' };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [uEval], suiteCommands: [] }), responder());
  check('W13 ui eval PASS end-to-end', result.verdict === 'PASS');
  const line = JSON.parse(result.runLog[0]);
  check('W13 run-log line for ui eval', line.evalId === 'E5' && line.cmd === 'ui-check:E5');
  const { result: r2 } = await runWorkflow(WF, baseArgs({ evals: [uEval], suiteCommands: [] }), responder({
    'ui:E5': () => null,
  }));
  check('W13 dead ui agent -> BLOCKED', r2.verdict === 'BLOCKED');
}

console.log('W14 invokedAt absent (old skill) -> empty ts, still works');
{
  const args = baseArgs(); delete args.invokedAt;
  const { result } = await runWorkflow(WF, args, responder());
  check('W14 ts empty string, no crash', JSON.parse(result.runLog[0]).ts === '' && result.verdict === 'PASS');
}

console.log('W15 args.models overrides per role; unspecified roles keep defaults');
{
  const jEval = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'q', inputs: [] };
  const { calls } = await runWorkflow(WF, baseArgs({
    evals: [...baseArgs().evals, jEval],
    models: { judge: 'opus', machine: 'sonnet', finder: 'session' },
  }), responder({
    'review:conventions': { findings: [{ title: 't', file: 'f', severity: 'low', detail: 'd' }] },
  }));
  const model = (prefix) => byLabel(calls, prefix).map(c => c.opts.model);
  check('W15 judge overridden -> opus', model('judge:').every(m => m === 'opus'));
  check('W15 machine overridden -> sonnet', model('machine:').every(m => m === 'sonnet'));
  check('W15 finder "session" -> inherit (no model)', model('review:').every(m => m === undefined));
  check('W15 unspecified: scribe stays haiku', model('scribe:').every(m => m === 'haiku'));
  check('W15 unspecified: synthesize stays sonnet', model('synthesize:').every(m => m === 'sonnet'));
}

console.log('W16 sanitize: unknown roles + garbage values ignored, defaults hold');
{
  const { calls } = await runWorkflow(WF, baseArgs({
    models: { hacker: 'opus', judge: '', ui: 42, machine: '  session  ' },
  }), responder());
  const model = (prefix) => byLabel(calls, prefix).map(c => c.opts.model);
  check('W16 unknown role ignored, no crash', calls.length > 0);
  check('W16 empty-string value -> default kept (synthesize path unaffected)', model('synthesize:').every(m => m === 'sonnet'));
  check('W16 non-string value -> default kept', model('scribe:').every(m => m === 'haiku'));
  check('W16 "session" (padded) on machine -> inherit', model('machine:').every(m => m === undefined));
}

summary('acceptance-verify');
