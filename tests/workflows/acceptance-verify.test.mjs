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

console.log('W17 observed evidence: UI_SCHEMA + prompts (Đợt 3 — AI đổi phải chủ động sửa test)');
{
  const uEval = { id: 'E5', criterion: 'AC-5', executor: 'ui-check', steps: ['open /'], expected: '200' };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [uEval], suiteCommands: [] }), responder({
    'ui:E5': { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: 'evidence/E5-step1.png', observed: 'trang dashboard hien thi user menu va bang so lieu' },
  }));
  const ui = byLabel(calls, 'ui:')[0];
  check('W17 UI_SCHEMA has observed property', !!(ui.opts.schema && ui.opts.schema.properties && ui.opts.schema.properties.observed));
  check('W17 ui prompt instructs opening frames with Read', /MO TUNG file frame/.test(ui.prompt));
  check('W17 ui prompt: frame contradicting Expected => FAIL', /MAU THUAN Expected/.test(ui.prompt));
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W17 synthesize carries observed value into report payload', synth.prompt.includes('trang dashboard hien thi user menu'));
  check('W17 synthesize instructs the observed field + schema v2', /observed/.test(synth.prompt) && /schema v2/.test(synth.prompt));
}

console.log('W18 P1 carried evals: no spawn, run-log line with original run_id, report payload (Đợt 5)');
{
  const e3 = { id: 'E3', criterion: 'AC-3', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'ok' };
  const carried = { id: 'E3', runId: 'run-orig-3', fromRound: 2, verifiedAt: '2026-07-01T00:00:00Z', cmd: './x.sh' };
  const { result, calls } = await runWorkflow(WF, baseArgs({
    evals: [...baseArgs().evals, e3],
    carriedEvals: [carried, { id: 'E9-khong-ton-tai', runId: 'x', fromRound: 1 }],
  }), responder());
  check('W18 no machine agent for carried cmd', !calls.some(c => c.label.startsWith('machine:./x.sh')));
  check('W18 fresh cmds still run (eval-cmd + suite)', byLabel(calls, 'machine:').length === 2, String(byLabel(calls, 'machine:').length));
  check('W18 unknown carried id sanitized out', JSON.stringify(result.carried.evals) === JSON.stringify(['E3']));
  const line = result.runLog.map(l => JSON.parse(l)).find(l => l.evalId === 'E3');
  check('W18 run-log line: original run_id + exit 0 + carried_from_round', !!line && line.run_id === 'run-orig-3' && line.exit_code === 0 && line.carried_from_round === 2 && line.round === 1);
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W18 synthesize gets carry-forward payload + original verified_at', synth.prompt.includes('EVAL CARRY-FORWARD') && synth.prompt.includes('run-orig-3') && synth.prompt.includes('2026-07-01T00:00:00Z'));
  check('W18 carried block: no screenshot/observed instruction', /KHONG ghi screenshot/.test(synth.prompt));
  check('W18 verdict PASS (carried không phá routing)', result.verdict === 'PASS');
}

console.log('W19 P2 baseline-once: skip agent, Analyst carried, run-log kind:baseline');
{
  const carriedAnalyst = { fromRound: 1, nonDiscriminating: [{ cmd: 'pnpm test', evals: ['E1', 'E2'] }] };
  const { result, calls } = await runWorkflow(WF, baseArgs({
    runBaseline: false, carriedAnalyst, evalsHash: 'abc123',
  }), responder());
  check('W19 no baseline agent spawned', byLabel(calls, 'baseline:').length === 0);
  check('W19 nonDiscriminating carried through', JSON.stringify(result.nonDiscriminating) === JSON.stringify(carriedAnalyst.nonDiscriminating));
  const bl = result.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'baseline');
  check('W19 run-log baseline line: hash + carried_from_round', !!bl && bl.evals_hash === 'abc123' && bl.carried_from_round === 1);
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W19 synthesize: Analyst carried note (KHONG DO LAI)', /KHONG DO LAI/.test(synth.prompt) && synth.prompt.includes('carried tu round 1'));
  check('W19 result.carried.baseline true', result.carried.baseline === true);
  check('W19 verdict PASS unchanged', result.verdict === 'PASS');
  // default path: runBaseline absent -> agent runs, baseline line has hash, NO carried marker
  const { result: r2, calls: c2 } = await runWorkflow(WF, baseArgs({ evalsHash: 'abc123' }), responder());
  check('W19 default still spawns baseline', byLabel(c2, 'baseline:').length === 1);
  const bl2 = r2.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'baseline');
  check('W19 fresh baseline line: hash, no carried marker', !!bl2 && bl2.evals_hash === 'abc123' && !('carried_from_round' in bl2));
}

console.log('W20 P3 carried panels: no judges for memoized item, routing + run-log intact');
{
  const e9 = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'q9', inputs: [], inputsHash: 'h9' };
  const e10 = { id: 'E10', criterion: 'AC-10', executor: 'judgment', question: 'q10', inputs: [] };
  const carriedPanel = { evalId: 'E10', proposal: 'UNCERTAIN', votes: [{ lens: 'domain-correctness', verdict: 'UNCERTAIN', rationale: 'bo di' }], fromRound: 3, inputsHash: 'h10' };
  const { result, calls } = await runWorkflow(WF, baseArgs({
    evals: [...baseArgs().evals, e9, e10],
    carriedPanels: [carriedPanel, { evalId: 'E1', proposal: 'PASS' }, { evalId: 'E10', proposal: 'XYZ' }],
  }), responder());
  check('W20 judges only for fresh item', byLabel(calls, 'judge:E9').length === 3 && byLabel(calls, 'judge:E10').length === 0);
  check('W20 carried refs to non-judgment/garbage proposal sanitized', JSON.stringify(result.carried.panels) === JSON.stringify(['E10']));
  const p10 = result.panels.find(p => p.evalId === 'E10');
  check('W20 carried panel surfaced with fromRound', !!p10 && p10.carried === true && p10.fromRound === 3 && p10.proposal === 'UNCERTAIN');
  check('W20 UNCERTAIN carried -> PENDING-JUDGMENT (routing giữ nguyên)', result.verdict === 'PENDING-JUDGMENT');
  const lines = result.runLog.map(l => JSON.parse(l)).filter(l => l.kind === 'panel');
  const fresh = lines.find(l => l.evalId === 'E9');
  const carr = lines.find(l => l.evalId === 'E10');
  check('W20 fresh panel line: inputs_hash, no carried marker', !!fresh && fresh.inputs_hash === 'h9' && !('carried_from_round' in fresh));
  check('W20 carried panel line: hash + carried_from_round, votes lens/verdict only', !!carr && carr.inputs_hash === 'h10' && carr.carried_from_round === 3 && !JSON.stringify(carr.votes).includes('rationale'));
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W20 synthesize: carried-panel instruction present', /panel giu nguyen tu round/.test(synth.prompt));
}

console.log('W21 guard + dryRun: all-carried round without fresh signal is BLOCKED, never empty PASS');
{
  const e3 = { id: 'E3', criterion: 'AC-3', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'ok' };
  const carried = { id: 'E3', runId: 'run-orig-3', fromRound: 2 };
  const { result } = await runWorkflow(WF, baseArgs({
    evals: [e3], suiteCommands: [], carriedEvals: [carried],
  }), responder());
  check('W21 all-carried + empty suite -> BLOCKED with FRESH reason', result.verdict === 'BLOCKED' && /FRESH/.test(result.blocked[0].reason));
  const { result: r2, calls: c2 } = await runWorkflow(WF, baseArgs({
    dryRun: true, evals: [e3], carriedEvals: [carried], runBaseline: false,
  }), responder());
  check('W21 dryRun surfaces carried plan + runBaseline', JSON.stringify(r2.carriedEvals) === JSON.stringify(['E3']) && r2.runBaseline === false && c2.length === 0);
}

console.log('W22 [wf-label:] tag: mọi prompt mở đầu bằng tag = opts.label (wf-usage.mjs map transcript → role)');
{
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [
    ...baseArgs().evals,
    { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ux tot?', inputs: ['/repo/a.png'] },
  ] }), responder());
  check('W22 every call tagged with its own label', calls.length > 0 && calls.every(c => c.prompt.startsWith(`[wf-label: ${c.label}]\n`)));
  check('W22 judge calls present and tagged', byLabel(calls, 'judge:E9').length === 3);
}

summary('acceptance-verify');
