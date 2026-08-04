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
    if (l === 'synthesize:report') return { report: '# Evidence demo (noi dung day du)', findings: '# Findings demo' };
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

console.log('W03 happy path: PASS + run-log may-tinh, main loop ghi file (khong scribe)');
{
  const { result, calls } = await runWorkflow(WF, baseArgs(), responder());
  check('W03 verdict PASS', result.verdict === 'PASS', result.verdict);
  check('W03 machine dedupe: 2 machine agents (1 eval-cmd + 1 suite)', byLabel(calls, 'machine:').length === 2, String(byLabel(calls, 'machine:').length));
  check('W03 runLog: 1 line per eval', result.runLog.length === 2, String(result.runLog.length));
  const lines = result.runLog.map(l => JSON.parse(l));
  check('W03 run_id minted deterministically per eval', lines[0].run_id === 'minted-demo-E1-r1' && lines[1].run_id === 'minted-demo-E2-r1');
  check('W03 ts from args.invokedAt', lines.every(l => l.ts === '2026-07-02T10:00:00Z'));
  // Từ đợt 8: KHÔNG còn agent scribe — agent "chép sẵn dòng audit" trông y hệt
  // ngụy tạo hồ sơ và bị safety layer chặn lặp lại dù nội dung do JS tính từ kết
  // quả thật. Main loop tự append result.runLog (SKILL bước "Mọi verdict").
  check('W03 KHONG con agent scribe', byLabel(calls, 'scribe:').length === 0, String(byLabel(calls, 'scribe:').length));
  check('W03 runLogWriteFailed LUON true khi co dong — main loop append', result.runLogWriteFailed === true);
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W03 synthesize gets verified_commit literal', synth.prompt.includes(`"verified_commit: ${VC}"`));
  check('W03 synthesize gets the evalRunIds map, not minting rights', synth.prompt.includes('minted-demo-E1-r1') && synth.prompt.includes('KHONG tu mint'));
  check('W03 result.report la NOI DUNG (main loop ghi file)', result.report === '# Evidence demo (noi dung day du)');
  check('W03 result.findings la NOI DUNG', result.findings === '# Findings demo');
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
  check('W10 khong con role scribe (route da xoa cung agent)', byLabel(calls, 'scribe:').length === 0);
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

console.log('W12 run-log: main loop append la duong DUY NHAT (khong con scribe)');
{
  const { result, logs } = await runWorkflow(WF, baseArgs(), responder());
  check('W12 flag set khi co dong can ghi', result.runLogWriteFailed === true);
  check('W12 log nhac main loop tu append', logs.some(l => /TU append/.test(l)));
  check('W12 runLog mang du dong cho main loop', result.runLog.length === 2, String(result.runLog.length));
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
  check('W15 unspecified: provenance stays sonnet', model('capture:').every(m => m === 'sonnet'));
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
  check('W16 non-string value -> default kept (provenance sonnet)', model('capture:').every(m => m === 'sonnet'));
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

console.log('W23 network-truth: UI_SCHEMA optional networkObserved + prompt rail + synthesize passthrough');
{
  const uiEval = { id: 'E3', criterion: 'AC-3', executor: 'ui-check', steps: ['open /x'], expected: 'ok', evidence_required: [] };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [uiEval], suiteCommands: [] }), responder({
    'ui:E3': { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: 'evidence/E3-step1.png', observed: 'thay man hinh ok', networkObserved: 'clean' },
  }));
  const ui = calls.find(c => c.label === 'ui:E3');
  check('W23 UI_SCHEMA declares networkObserved as OPTIONAL', !!ui.opts.schema.properties.networkObserved && !ui.opts.schema.required.includes('networkObserved'));
  check('W23 ui prompt carries the network rail + vocab', ui.prompt.includes('NETWORK TRUTH') && ui.prompt.includes('no-app-traffic') && ui.prompt.includes('n-a (driver)'));
  const synth = calls.find(c => c.label === 'synthesize:report');
  check('W23 synthesize payload carries networkObserved verbatim', synth.prompt.includes('"networkObserved":"clean"'));
  check('W23 synthesize instructs copy-verbatim + n-a fallback, never invented clean', synth.prompt.includes('network_observed') && synth.prompt.includes('n-a (driver)') && synth.prompt.includes('KHONG tu suy'));
}

console.log('W24 network-truth additive: ui result WITHOUT networkObserved still PASS (backward)');
{
  const uiEval = { id: 'E3', criterion: 'AC-3', executor: 'ui-check', steps: ['open /x'], expected: 'ok', evidence_required: [] };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [uiEval], suiteCommands: [] }), responder());
  check('W24 verdict PASS without networkObserved', result.verdict === 'PASS', result.verdict);
}

// ── WT-T*: scope-triage — ngăn thứ ba "thật nhưng NGOÀI hợp đồng" ───────────
// Reviewer là finder KHÔNG giới hạn phạm vi; gate là thước CÓ giới hạn phạm vi.
// Thiếu ngăn này thì mỗi bản vá trong vùng-không-đặc-tả lại đẻ ra lựa chọn
// không-đặc-tả mới → vòng lặp không hội tụ (ca OneFlow, 7 round).

const F_HIGH = { title: 'xoa truoc khi clone', file: 'src/install.ts', severity: 'high', detail: 'rmSync truoc git.clone' };
const F_MED = { title: 'so chuoi tho', file: 'src/install.ts', severity: 'medium', detail: 'storedUrl !== gitUrl' };
const F_OUT = { title: 'docs lech huong dan', file: 'other/plugins.md', severity: 'high', detail: 'huong dan sai hau to' };

// args cho nhánh triage: 1 eval máy có paths, không judgment, không suite.
const triArgs = (over = {}) => baseArgs({
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass', paths: ['src/**'] }],
  suiteCommands: [],
  contractPath: '/repo/_acceptance/demo/contract.md',
  ...over,
});
// findings: reviewer trả về · triage: agent phân loại trả về (title phải khớp)
const triResp = ({ findings, triage, triageThrows = false, machine = null }) => responder({
  'review:': { findings },
  'refute:': { refuted: false, reason: 'that' },
  'triage': () => { if (triageThrows) throw new Error('triage chet'); return { triaged: triage }; },
  ...(machine ? { 'machine:': machine } : {}),
});
// Khoá ghép là (file, title) — helper luôn khai file, đúng như TRIAGE_SCHEMA đòi.
const tri1 = (f, over = {}) => [{ title: f.title, file: f.file, inContract: true, acRef: 'AC-1', rationale: 'cham AC-1', proposal: '', ...over }];
const triOut = (f, proposal = 'known-limits') => [{ title: f.title, file: f.file, inContract: false, acRef: '', rationale: 'ngoai scope', proposal }];

console.log('WT-T1 high + in-contract, evals xanh -> REJECT + vao rejectFindings');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: tri1(F_HIGH) }));
  check('WT-T1 verdict REJECT', result.verdict === 'REJECT', result.verdict);
  check('WT-T1 finding nam trong rejectFindings', (result.rejectFindings || []).some(f => f.title === F_HIGH.title));
}

console.log('WT-T1b (doi chung duong) cung cau hinh, severity medium -> PASS');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_MED], triage: tri1(F_MED) }));
  check('WT-T1b medium in-contract KHONG keo REJECT', result.verdict === 'PASS', result.verdict);
}

console.log('WT-T2 high + out-of-contract -> PASS, khong vao fix-list');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_OUT], triage: triOut(F_OUT) }));
  check('WT-T2 verdict PASS', result.verdict === 'PASS', result.verdict);
  check('WT-T2 KHONG vao rejectFindings', !(result.rejectFindings || []).some(f => f.title === F_OUT.title));
  check('WT-T2 triaged giu proposal', (result.triaged || []).some(t => t.title === F_OUT.title && t.proposal === 'known-limits'));
}

console.log('WT-T3 medium in-contract -> khong REJECT, giu acRef');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_MED], triage: tri1(F_MED, { acRef: 'AC-3' }) }));
  check('WT-T3 khong REJECT', result.verdict !== 'REJECT', result.verdict);
  check('WT-T3 giu acRef', (result.triaged || []).some(t => t.title === F_MED.title && t.acRef === 'AC-3'));
}

console.log('WT-T4 triage chet ca retry -> triageFailed, KHONG REJECT du finding high');
{
  const { result, calls } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: [], triageThrows: true }));
  check('WT-T4 triageFailed true', result.triageFailed === true);
  check('WT-T4 KHONG REJECT tu finding', result.verdict === 'PASS', result.verdict);
  check('WT-T4 rejectFindings rong', (result.rejectFindings || []).length === 0);
  check('WT-T4 co retry dung 1 lan (2 luot goi)', byLabel(calls, 'triage').length === 2, String(byLabel(calls, 'triage').length));
}

console.log('WT-T4b (doi chung duong) triage song -> triageFailed false');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: tri1(F_HIGH) }));
  check('WT-T4b triageFailed false', result.triageFailed === false);
}

console.log('WT-T4c thieu contractPath -> fail-toward-human, khong spawn agent triage');
{
  const args = triArgs();
  delete args.contractPath;
  const { result, calls } = await runWorkflow(WF, args, triResp({ findings: [F_HIGH], triage: tri1(F_HIGH) }));
  check('WT-T4c triageFailed true', result.triageFailed === true);
  check('WT-T4c KHONG REJECT', result.verdict === 'PASS', result.verdict);
  check('WT-T4c KHONG spawn agent triage', byLabel(calls, 'triage').length === 0);
}

console.log('WT-T5 eval FAIL + hon hop -> rejectFindings CHI co in-contract');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    machine: { exitCode: 1, outputTail: 'do', runId: '', cannotRun: false },
    findings: [F_HIGH, F_OUT],
    triage: [...tri1(F_HIGH), ...triOut(F_OUT, 'new-contract')],
  }));
  check('WT-T5 verdict REJECT', result.verdict === 'REJECT', result.verdict);
  check('WT-T5 CO in-contract trong fix-list', (result.rejectFindings || []).some(f => f.title === F_HIGH.title));
  check('WT-T5 KHONG co out-of-contract trong fix-list', !(result.rejectFindings || []).some(f => f.title === F_OUT.title));
}

console.log('WT-T6 finding unverified khong vao triage, van giu ngan rieng');
{
  const { result, calls } = await runWorkflow(WF, triArgs(), responder({
    'review:': { findings: [{ title: 'refuter chet o day', file: 'src/x.ts', severity: 'high', detail: 'x' }] },
    'refute:': null, // refuter chết → finding thành unverified
    'triage': { triaged: [] },
  }));
  const tp = byLabel(calls, 'triage').map(c => c.prompt).join('\n');
  check('WT-T6 unverified KHONG vao prompt triage', !tp.includes('refuter chet o day'), tp.slice(0, 80));
  check('WT-T6 unverified van trong confirmedFindings', (result.confirmedFindings || []).some(f => f.unverified));
  check('WT-T6 unverified KHONG keo REJECT', result.verdict === 'PASS', result.verdict);
}

console.log('WT-T9 BLOCKED thang ve REJECT-tu-finding');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    machine: { exitCode: 0, outputTail: '', runId: '', cannotRun: true, reason: 'thieu env' },
    findings: [F_HIGH], triage: tri1(F_HIGH),
  }));
  check('WT-T9 verdict BLOCKED', result.verdict === 'BLOCKED', result.verdict);
}

console.log('WT-T9b (doi chung duong) cung fixture khong blocked -> REJECT');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: tri1(F_HIGH) }));
  check('WT-T9b khong blocked -> REJECT', result.verdict === 'REJECT', result.verdict);
}

// ── WT-T7: tín hiệu cụm-ngoài-vùng-phủ ─────────────────────────────────────
const F_OUT2 = { title: 'them mot cho lech', file: 'other/install.ts', severity: 'medium', detail: 'x' };
const triAllOut = fs => fs.map(f => ({ title: f.title, file: f.file, inContract: false, acRef: '', rationale: 'ngoai', proposal: 'known-limits' }));

console.log('WT-T7a 2 finding ngoai union paths -> co cluster');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_OUT, F_OUT2], triage: triAllOut([F_OUT, F_OUT2]) }));
  check('WT-T7a cluster count 2', !!result.coverageCluster && result.coverageCluster.count === 2, JSON.stringify(result.coverageCluster));
  check('WT-T7a cluster liet ke file', !!result.coverageCluster && result.coverageCluster.files.includes('other/plugins.md'));
  check('WT-T7a cluster ghi total', !!result.coverageCluster && result.coverageCluster.total === 2);
}

console.log('WT-T7b khong eval nao khai paths -> cluster null (n-a)');
{
  const args = triArgs({ evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' }] });
  const { result } = await runWorkflow(WF, args, triResp({ findings: [F_OUT, F_OUT2], triage: triAllOut([F_OUT, F_OUT2]) }));
  check('WT-T7b cluster null khi khong do duoc', result.coverageCluster === null, JSON.stringify(result.coverageCluster));
}

console.log('WT-T7c (am) finding TRONG vung phu -> khong cluster');
{
  const a = { title: 'trong vung phu', file: 'src/install.ts', severity: 'medium', detail: 'x' };
  const b = { title: 'trong vung phu 2', file: 'src/other.ts', severity: 'low', detail: 'x' };
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [a, b], triage: triAllOut([a, b]) }));
  check('WT-T7c khong cluster khi moi finding trong vung phu', result.coverageCluster === null, JSON.stringify(result.coverageCluster));
}

console.log('WT-T7d (bien) DUNG 1 finding ngoai vung phu -> khong cluster');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_OUT], triage: triAllOut([F_OUT]) }));
  check('WT-T7d 1 finding le KHONG bat co (nguong >=2)', result.coverageCluster === null, JSON.stringify(result.coverageCluster));
}

// ── WT-T8: evidence-report BẤT ĐỘNG + review-findings có 3 ngăn ────────────
// Golden CLOSED-LIST: liệt kê tập section mà prompt synthesize được phép chỉ
// dẫn cho evidence-report.md, rồi so BẰNG. "Grep vắng chuỗi" không chứng minh
// được gì (bất biến #4 CLAUDE.md) — người cài chỉ cần đổi wording là qua.
const REPORT_SECTIONS_ALLOWED = ['## Analyst', '## Variance', '## Iterations'];
const reportSectionsIn = (prompt) => {
  const head = prompt.split('Sau do soan NOI DUNG file thu hai')[0]; // phần nói về evidence-report
  return [...new Set((head.match(/## [A-ZĐ][^\s"',.\\]*/g) || []).map(s => s.trim()))];
};

console.log('WT-T8 prompt synthesize: evidence-report giu nguyen tap section');
{
  const { calls } = await runWorkflow(WF, triArgs(), triResp({
    findings: [F_HIGH, F_OUT],
    triage: [...tri1(F_HIGH), ...triOut(F_OUT)],
  }));
  const sp = byLabel(calls, 'synthesize')[0].prompt;
  const extra = reportSectionsIn(sp).filter(s => !REPORT_SECTIONS_ALLOWED.includes(s));
  check('WT-T8 khong section moi nao cho evidence-report', extra.length === 0, `section la: ${extra.join(' | ')}`);
  check('WT-T8 review-findings CO ngan Trong hop dong', sp.includes('## Trong hợp đồng'));
  check('WT-T8 review-findings CO ngan Ngoai hop dong', sp.includes('## Ngoài hợp đồng'));
  check('WT-T8 ngan Ngoai hop dong mang proposal', sp.includes('known-limits'));
  check('WT-T8 finding in-contract mang acRef', sp.includes('"acRef":"AC-1"'));
}

console.log('WT-T8b (doi chung duong) golden list bat duoc section tiem them');
{
  const faked = 'ghi ## Analyst roi ## Variance roi ## Iterations roi ## Triage\nSau do soan NOI DUNG file thu hai ...';
  const extra = reportSectionsIn(faked).filter(s => !REPORT_SECTIONS_ALLOWED.includes(s));
  check('WT-T8b phep so con song — bat duoc ## Triage', extra.includes('## Triage'), `extra=${extra.join('|')}`);
}

console.log('WT-T8c triage hong -> prompt co ngan Chua phan loai');
{
  const { calls } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: [], triageThrows: true }));
  const sp = byLabel(calls, 'synthesize')[0].prompt;
  check('WT-T8c co ngan Chua phan loai', sp.includes('## Chưa phân loại'));
}

console.log('WT-T8d cum -> dong co; khong cum -> dong n-a, khong bia co');
{
  const { calls: c1 } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_OUT, F_OUT2], triage: triAllOut([F_OUT, F_OUT2]) }));
  const p1 = byLabel(c1, 'synthesize')[0].prompt;
  check('WT-T8d co cum -> chi dan dong co', p1.includes('dừng và quyết'), 'thieu dong co');
  const { calls: c2 } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: tri1(F_HIGH) }));
  const p2 = byLabel(c2, 'synthesize')[0].prompt;
  check('WT-T8d khong cum -> ghi n-a, KHONG co dong co', p2.includes('cluster: n-a') && !p2.includes('dừng và quyết'));
}

// ── WT-T10: triage ghép kết quả theo file+title, KHÔNG theo title trần ─────
// Hai reviewer lane sinh title tự do trên cùng một diff; trùng title giữa hai
// FILE khác nhau ("missing validation", "silent catch") là chuyện thường. Ghép
// bằng title trần thì Map giữ mục CUỐI và mọi finding trùng title dính chung
// một phân loại — cả hai chiều đều hỏng, chiều thứ hai phá đúng chốt chặn.
const SAME_A = { title: 'missing validation', file: 'src/a.ts', severity: 'high', detail: 'in-contract that' };
const SAME_B = { title: 'missing validation', file: 'docs/x.md', severity: 'high', detail: 'out-of-contract that' };
const triByFile = (recs) => recs.map(r => ({ title: r.title, file: r.file, inContract: r.inContract, acRef: r.inContract ? 'AC-1' : '', rationale: 'x', proposal: r.inContract ? '' : 'known-limits' }));

console.log('WT-T10 trung title khac file: finding in-contract KHONG bi mat khoi fix-list');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [SAME_A, SAME_B],
    triage: triByFile([{ ...SAME_A, inContract: true }, { ...SAME_B, inContract: false }]),
  }));
  check('WT-T10 giu duoc finding in-contract', (result.rejectFindings || []).some(f => f.file === 'src/a.ts'),
    JSON.stringify((result.rejectFindings || []).map(f => f.file)));
  check('WT-T10 verdict REJECT (high in-contract con song)', result.verdict === 'REJECT', result.verdict);
}

console.log('WT-T10b trung title khac file: out-of-contract KHONG lot vao fix-list');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [SAME_B, SAME_A],
    triage: triByFile([{ ...SAME_B, inContract: false }, { ...SAME_A, inContract: true }]),
  }));
  check('WT-T10b out-of-contract KHONG vao fix-list', !(result.rejectFindings || []).some(f => f.file === 'docs/x.md'),
    JSON.stringify((result.rejectFindings || []).map(f => f.file)));
}

// ── WT-T11: hợp đồng không đọc được → fail-toward-human THẬT ───────────────
// Trước đây chỉ kiểm contractPath CÓ MẶT. Agent đọc file hỏng thì theo luật
// "không chắc chắn → inContract=false" nó trả về TOÀN BỘ out-of-contract, và
// review-findings.md in "nằm ngoài phạm vi đã duyệt" cho những lỗi chưa từng
// được đối chiếu — đọc như kết quả triage nhưng là bịa.
console.log('WT-T11 agent bao khong doc duoc hop dong -> triageFailed, khong bia out-of-contract');
{
  const { result } = await runWorkflow(WF, triArgs(), responder({
    'review:': { findings: [F_HIGH] },
    'refute:': { refuted: false, reason: 'that' },
    'triage': { contractUnreadable: true, triaged: [] },
  }));
  check('WT-T11 triageFailed true', result.triageFailed === true);
  check('WT-T11 khong finding nao bi xep out-of-contract', !(result.triaged || []).some(f => !f.inContract && !f.unclassified),
    JSON.stringify((result.triaged || []).map(f => ({ o: !f.inContract, u: f.unclassified }))));
  check('WT-T11 KHONG REJECT tu finding', result.verdict === 'PASS', result.verdict);
}

console.log('WT-T11b (doi chung duong) doc duoc hop dong -> phan loai binh thuong');
{
  const { result } = await runWorkflow(WF, triArgs(), responder({
    'review:': { findings: [F_HIGH] },
    'refute:': { refuted: false, reason: 'that' },
    'triage': { contractUnreadable: false, triaged: tri1(F_HIGH) },
  }));
  check('WT-T11b triageFailed false', result.triageFailed === false);
  check('WT-T11b van REJECT dung', result.verdict === 'REJECT', result.verdict);
}

// ── WT-T12: globToRe theo ngữ nghĩa glob chuẩn (**/ khớp không thư mục) ────
console.log('WT-T12 glob **/ khop file nam ngay goc -> KHONG bi tinh ngoai vung phu');
{
  // CA HAI file nam ngay duoi src/ (khong qua thu muc con): neu `**/` khong khop
  // zero-segment thi CA HAI bi tinh ngoai vung phu -> cum gia. Dung mot file thi
  // case xanh nho NGUONG chu khong nho dung regex — khong phan biet duoc.
  const a = { title: 'a', file: 'src/a.ts', severity: 'low', detail: 'x' };
  const b = { title: 'b', file: 'src/b.ts', severity: 'low', detail: 'x' };
  const args = triArgs({ evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass', paths: ['src/**/*.ts'] }] });
  const { result } = await runWorkflow(WF, args, triResp({ findings: [a, b], triage: triAllOut([a, b]) }));
  check('WT-T12 khong co cum gia', result.coverageCluster === null, JSON.stringify(result.coverageCluster));
}

console.log('WT-T12b (doi chung duong) file THAT SU ngoai glob van bi bat');
{
  const a = { title: 'a', file: 'other/a.ts', severity: 'low', detail: 'x' };
  const b = { title: 'b', file: 'other/b.ts', severity: 'low', detail: 'x' };
  const args = triArgs({ evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass', paths: ['src/**/*.ts'] }] });
  const { result } = await runWorkflow(WF, args, triResp({ findings: [a, b], triage: triAllOut([a, b]) }));
  check('WT-T12b van bat duoc cum that', !!result.coverageCluster && result.coverageCluster.count === 2, JSON.stringify(result.coverageCluster));
}

// Ky tu `?` trong glob: round 1 tung lam `new RegExp` nem SyntaxError sap ca
// round. Khi viet lai globToRe cho AC-7 (round 2), `?` duoc escape LUON nhu
// tac dung phu — co ghi ledger, khong phai mo rong pham vi co y. Hien KHONG co
// case nao ghim hanh vi nay (xoa `?` khoi character class thi moi suite van
// xanh) — do la mon no do ben da khai o Cong 2 duoi dang known-limits, khong
// phai bo sot khong dau vet.

// ── WT-T13: path tuyệt đối từ reviewer KHÔNG được bịa ra cờ cụm ───────────
// Prompt reviewer mở đầu bằng "trong repo <abs path>" và FINDINGS_SCHEMA để file
// là string trần, nên agent trả path tuyệt đối là hợp lệ. Không chuẩn hoá ở biên
// thì MỌI finding rớt khỏi MỌI glob → cờ đỏ "dừng và quyết" ở mọi round.
console.log('WT-T13 file duong dan TUYET DOI van tinh la trong vung phu');
{
  const a = { title: 'a', file: '/repo/src/a.ts', severity: 'low', detail: 'x' };
  const b = { title: 'b', file: '/repo/src/b.ts', severity: 'low', detail: 'x' };
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [a, b], triage: triAllOut([a, b]) }));
  check('WT-T13 khong bia ra cum tu path tuyet doi', result.coverageCluster === null, JSON.stringify(result.coverageCluster));
}

console.log('WT-T13b (doi chung duong) path tuyet doi NGOAI vung phu van bi bat');
{
  const a = { title: 'a', file: '/repo/other/a.ts', severity: 'low', detail: 'x' };
  const b = { title: 'b', file: '/repo/other/b.ts', severity: 'low', detail: 'x' };
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [a, b], triage: triAllOut([a, b]) }));
  check('WT-T13b van bat duoc cum that', !!result.coverageCluster && result.coverageCluster.count === 2, JSON.stringify(result.coverageCluster));
  check('WT-T13b cum ghi path repo-relative', (result.coverageCluster.files || []).every(f => !f.startsWith('/')),
    JSON.stringify(result.coverageCluster.files));
}

// ── WT-T14: triage trả THIẾU mục → fail-toward-human, không im lặng ───────
console.log('WT-T14 triage bo sot mot finding -> triageFailed, khong ai REJECT');
{
  const other = { title: 'finding thu hai', file: 'src/b.ts', severity: 'high', detail: 'y' };
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [F_HIGH, other],
    triage: tri1(F_HIGH), // CHỈ phân loại 1 trong 2
  }));
  check('WT-T14 triageFailed true', result.triageFailed === true);
  check('WT-T14 rejectFindings rong', (result.rejectFindings || []).length === 0,
    JSON.stringify((result.rejectFindings || []).map(f => f.file)));
  check('WT-T14 KHONG REJECT tu finding', result.verdict === 'PASS', result.verdict);
}

console.log('WT-T14b (doi chung duong) phan loai DU -> chay binh thuong');
{
  const other = { title: 'finding thu hai', file: 'src/b.ts', severity: 'low', detail: 'y' };
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [F_HIGH, other],
    triage: [...tri1(F_HIGH), ...triOut(other)],
  }));
  check('WT-T14b triageFailed false', result.triageFailed === false);
  check('WT-T14b van REJECT dung', result.verdict === 'REJECT', result.verdict);
}

// ── WT-T15: câu ngôn ngữ sản phẩm (plain) là chữ đi tới thẻ ────────────────
console.log('WT-T15 synthesize chi dan ghi truong plain cho ngan Ngoai hop dong');
{
  const { calls } = await runWorkflow(WF, triArgs(), triResp({
    findings: [F_OUT],
    triage: [{ title: F_OUT.title, file: F_OUT.file, inContract: false, acRef: '', rationale: 'ngoai', proposal: 'known-limits', plain: 'Người dùng có thể mất tiện ích khi bấm Cập nhật.' }],
  }));
  const sp = byLabel(calls, 'synthesize')[0].prompt;
  check('WT-T15 chi dan doi dong "Người dùng thấy gì"', sp.includes('Người dùng thấy gì'));
  check('WT-T15 payload mang truong plain', sp.includes('Người dùng có thể mất tiện ích khi bấm Cập nhật.'));
}

console.log('WI1 o inert: ma tran TOAN PHAN viet-truoc + bang trong nguon phai khop ma tran do');
{
  const { readFileSync } = await import('node:fs');
  // (a) DAC TA VIET-TRUOC — nguon doc lap voi ma. Xoa mot hang khoi bang trong nguon thi
  // ma tran nay VAN doi o do inert, nen phep do di do. (Ban dau case nay rut ky vong TU
  // chinh bang trong nguon: xoa hang -> ca hai ve cung dich -> xanh oan. Do la tautology,
  // dung lop loi ma feature nay sinh ra de diet.)
  const EXPECTED_INERT = {
    'runs|test': false, 'runs|script': false, 'runs|ui-check': true, 'runs|judgment': true,
    // 'paths|judgment' la FALSE — S4 vong 1 do duoc no VAN nuoi coverageRes, tuc
    // KHONG inert. Dac ta viet-truoc ban dau ghim true o day: viet-truoc van co the
    // ghim mot niem tin sai, nen WI9 (quan he: chay hai lan, so sau) moi la thuoc
    // chan duoc lop nay — WI1 chi chan trois giua bang va hanh vi.
    'paths|test': false, 'paths|script': false, 'paths|ui-check': false, 'paths|judgment': false,
  };
  const sample = (field) => (field === 'runs' ? 3 : ['src/x.js']);
  const evalFor = (field, executor) => {
    const base = { id: 'X1', criterion: 'AC-1', executor, expected: 'ok', [field]: sample(field) };
    if (executor === 'judgment') return { ...base, question: 'q?', inputs: ['/a.md'] };
    if (executor === 'ui-check') return { ...base, steps: ['open'] };
    return { ...base, cmd: 'pnpm test', ref: 'config:executors.test.api' };
  };
  const mismatches = [];
  for (const [key, want] of Object.entries(EXPECTED_INERT)) {
    const [field, executor] = key.split('|');
    const { result } = await runWorkflow(WF, baseArgs({
      evals: [evalFor(field, executor)], suiteCommands: ['npm run build'],
    }), responder());
    const fired = (result.inertFields || []).some(f => f.evalId === 'X1' && f.field === field);
    if (fired !== want) mismatches.push(`${key}: got ${fired}, want ${want}`);
  }
  check('WI1 hanh vi khop DAC TA viet-truoc o CA 8 o', mismatches.length === 0, mismatches.join(' ; '));

  // (b) ROUND-TRIP: bang trong nguon (rut BANG MARKER, khong chep tay) phai khop dung tap
  // o inert cua dac ta. Bat ca hai chieu troi: bang thieu hang, va hang khai ma khong co
  // hieu luc (vd ai do them if roi rac o cho khac).
  const src = readFileSync(WF, 'utf8');
  const m = /\/\/ <<<INERT-FIELD-TABLE([\s\S]*?)\/\/ INERT-FIELD-TABLE>>>/.exec(src);
  check('WI1 bang nam giua cap marker', !!m);
  const declared = new Set();
  for (const row of (m ? m[1] : '').matchAll(/field:\s*'([a-z]+)'\s*,\s*executor:\s*'([a-z-]+)'/g)) {
    declared.add(row[1] + '|' + row[2]);
  }
  const wantSet = new Set(Object.entries(EXPECTED_INERT).filter(([, v]) => v).map(([k]) => k));
  const missing = [...wantSet].filter(k => !declared.has(k));
  const extra = [...declared].filter(k => !wantSet.has(k));
  check('WI1 bang trong nguon == tap o inert cua dac ta',
    missing.length === 0 && extra.length === 0, `thieu: ${missing} · thua: ${extra}`);
}

console.log('WI2 inertFieldReport: doi chung duong + noi dung muc');
{
  const jEval = (over = {}) => ({ id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], ...over });
  const { result: hit } = await runWorkflow(WF, baseArgs({ evals: [jEval({ runs: 3 })] }), responder());
  check('WI2 judgment+runs:3 -> dung 1 muc', (hit.inertFields || []).length === 1, JSON.stringify(hit.inertFields));
  const it = (hit.inertFields || [])[0] || {};
  check('WI2 muc neu dich danh evalId/field/value/executor',
    it.evalId === 'E9' && it.field === 'runs' && it.value === 3 && it.executor === 'judgment', JSON.stringify(it));
  check('WI2 reason nhac co che panel 3-lens', /3-lens|3 lens/.test(String(it.reason || '')), String(it.reason));
  // DOI CHUNG DUONG: cung eval bo runs -> phai RONG (phep do phan biet duoc)
  const { result: clean } = await runWorkflow(WF, baseArgs({ evals: [jEval()] }), responder());
  check('WI2 doi chung duong: bo runs -> inertFields RONG', (clean.inertFields || []).length === 0, JSON.stringify(clean.inertFields));
  // runs: 1 la mac dinh, khai ra vo hai -> KHONG bao (tranh nhieu lam nguoi hoc cach bo qua canh bao)
  const { result: one } = await runWorkflow(WF, baseArgs({ evals: [jEval({ runs: 1 })] }), responder());
  check('WI2 runs:1 (mac dinh) KHONG bao', (one.inertFields || []).length === 0, JSON.stringify(one.inertFields));
}

console.log('WI3 nua-KHONG-duoc-ban: field dung cho van chay nhu cu');
{
  const { result, calls } = await runWorkflow(WF, baseArgs({
    evals: [
      { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: './slow.sh', ref: 'config:executors.test.api', expected: 'ok', runs: 3, paths: ['a.js'] },
      { id: 'E2', criterion: 'AC-2', executor: 'ui-check', steps: ['open'], expected: 'ok', paths: ['b.js'] },
    ],
    suiteCommands: [],
  }), responder());
  check('WI3 test+runs / ui-check+paths KHONG vao inertFields', (result.inertFields || []).length === 0, JSON.stringify(result.inertFields));
  check('WI3 hoi quy: runs:3 tren test van sinh 3 agent machine',
    byLabel(calls, 'machine:').length === 3, String(byLabel(calls, 'machine:').length));
}

console.log('WI4 o inert: mot dong log + mot dong run-log kind:inert (khong run_id)');
{
  const jEval = (over = {}) => ({ id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], ...over });
  const { result, logs } = await runWorkflow(WF, baseArgs({ evals: [jEval({ runs: 3 })] }), responder());
  const hits = logs.filter(l => /O inert/i.test(l));
  check('WI4 dung MOT dong log', hits.length === 1, JSON.stringify(logs));
  check('WI4 dong log neu ten eval va field', /E9/.test(hits[0] || '') && /runs/.test(hits[0] || ''), hits[0]);

  const inertLines = result.runLog.map(l => JSON.parse(l)).filter(l => l.kind === 'inert');
  check('WI4 dung MOT dong run-log kind:inert', inertLines.length === 1, String(inertLines.length));
  check('WI4 dong inert KHONG mang run_id', inertLines.length === 1 && !('run_id' in inertLines[0]), JSON.stringify(inertLines[0]));
  check('WI4 dong inert ghi round + cap (evalId, field, executor)',
    inertLines.length === 1 && inertLines[0].round === 1
    && JSON.stringify(inertLines[0].fields) === JSON.stringify([{ evalId: 'E9', field: 'runs', executor: 'judgment' }]),
    JSON.stringify(inertLines[0]));

  // DOI CHUNG DUONG: khong eval inert -> khong dong nao, khong log nao
  const { result: c, logs: cl } = await runWorkflow(WF, baseArgs({ evals: [jEval()] }), responder());
  check('WI4 doi chung duong: khong inert -> khong dong kind:inert',
    c.runLog.map(l => JSON.parse(l)).filter(l => l.kind === 'inert').length === 0);
  check('WI4 doi chung duong: khong inert -> khong dong log nao',
    cl.filter(l => /O inert/i.test(l)).length === 0);
}

console.log('WI5 loi nhac synthesize KHONG con chi dan chen canh bao vao ## Variance');
{
  const jEval = (over = {}) => ({ id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], ...over });
  const { calls, result } = await runWorkflow(WF, baseArgs({ evals: [jEval({ runs: 3 })] }), responder());
  const p = byLabel(calls, 'synthesize:report')[0].prompt;
  // Duong B (S4 vong 3): may KHONG bat mot LLM chep cau roi bat ben doc go ra. Moi noi do
  // gay BON lan lien tiep. Kenh may la dong so chay; ## Variance tro lai chi mang phuong sai.
  check('WI5 loi nhac KHONG chua cau canh bao', !/Field khai mà máy không dùng/.test(p));
  check('WI5 loi nhac KHONG chua chi dan chen vao Variance', !/O INERT \(may da tinh san/.test(p));
  // ...nhung canh bao KHONG duoc mat: no van o kenh may
  const inertLine = result.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'inert');
  check('WI5 canh bao van song o so chay (kenh may)', !!(inertLine && /E9/.test(inertLine.note) && /runs/.test(inertLine.note)), JSON.stringify(inertLine));
  check('WI5 canh bao van song o result.inertFields', (result.inertFields || []).length === 1);
  // Phep thu xoa-ten-may van ap cho cau di toi mat nguoi
  const MACHINE_NAMES = /\bP1\b|\bP2\b|\bP3\b|carry-forward|3-lens|inputs-hash|executor|inertField/i;
  check('WI5 cau khong mang ten co che noi bo (phep thu xoa-ten-may)', !MACHINE_NAMES.test(inertLine.note), inertLine.note);
  check('WI5 cau neu viec-cua-nguoi', /evals\.yaml/.test(inertLine.note) && /hạn chế đã biết/.test(inertLine.note));
  // DOI CHUNG DUONG: khong eval inert -> khong dong nao, loi nhac cung sach
  const { calls: c2, result: r2 } = await runWorkflow(WF, baseArgs({ evals: [jEval()] }), responder());
  check('WI5 doi chung duong: khong inert -> khong dong so chay',
    !r2.runLog.map(l => JSON.parse(l)).some(l => l.kind === 'inert'));
  check('WI5 doi chung duong: loi nhac van sach', !/Field khai mà máy không dùng/.test(byLabel(c2, 'synthesize:report')[0].prompt));
}

console.log('WI6 ROUND-TRIP writer->reader qua SO CHAY may-viet (khong phan tich van LLM)');
{
  const { mkdtempSync, mkdirSync, writeFileSync } = await import('node:fs');
  const { execFileSync } = await import('node:child_process');
  const os = await import('node:os');
  const ROOT = path.join(HERE, '..', '..');

  // (1) RUT tu WRITER that: dong run-log kind:inert do may viet — khong chep tay
  const jEval = { id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], runs: 3 };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [jEval] }), responder());
  const inertLine = result.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'inert');
  check('WI6 writer ghi dong run-log kind:inert co field note', !!(inertLine && inertLine.note), JSON.stringify(inertLine));
  check('WI6 note neu dich danh eval + field', /E9/.test(inertLine.note) && /runs/.test(inertLine.note), inertLine.note);

  // (2) SINH workspace fixture bang CODE
  const mkWs = (variance, runLogLines) => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), 'agk-rt-'));
    const d = path.join(tmp, '_acceptance', 'rt');
    mkdirSync(d, { recursive: true });
    writeFileSync(path.join(d, 'contract.md'),
      '---\nschema_version: 2\nfeature: "rt"\nslug: rt\nrisk_tier: T2\nstatus: verified\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n');
    writeFileSync(path.join(d, 'evals.yaml'), 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n');
    writeFileSync(path.join(d, 'evidence-report.md'),
      `---\nschema_version: 2\nfeature_slug: rt\nverdict: PASS\n---\n\n## Variance\n\n${variance}\n\n## Iterations\n\n- r1\n`);
    writeFileSync(path.join(d, 'run-log.jsonl'), (runLogLines || []).join('\n') + (runLogLines && runLogLines.length ? '\n' : ''));
    return tmp;
  };
  const card = (variance, runLogLines) => execFileSync('node', [path.join(ROOT, 'scripts', 'gate-card.js'), '--slug', 'rt'],
    { cwd: mkWs(variance, runLogLines), encoding: 'utf8' });
  const LOG = [JSON.stringify(inertLine)];

  // (3) READER lay tu SO CHAY -> co dung loai, KHONG muon nhan phuong-sai
  const withInert = card('none — every multi-run eval is uniform', LOG);
  check('WI6 the hien canh bao field-inert', /Field khai mà máy không dùng/.test(withInert));
  check('WI6 KHONG muon nhan co phuong-sai', !/pass-rate hỗn hợp/.test(withInert));

  // (4) MIEN NHIEM ba chieu gay cua ba vong truoc — the KHONG con doc van xuoi nua.
  // Moi ca duoi day tung lam mat hoac dan sai nhan mot co o cac vong S4 truoc.
  const IMMUNE = [
    ['note dat SAU phuong sai', 'E3 pass_rate 4/5 — chua on dinh\n' + inertLine.note],
    ['note dat TRUOC phuong sai', inertLine.note + '\nE3 pass_rate 4/5 — chua on dinh'],
    ['note co gach dau dong', '- ' + inertLine.note],
    ['note in dam', '**' + inertLine.note + '**'],
    ['dong dau con placeholder', '{{eval ids with mixed pass_rate}}\n' + inertLine.note],
    ['Variance rong hoan toan', ''],
  ];
  for (const [ten, variance] of IMMUNE) {
    const out = card(variance, LOG);
    check(`WI6 [${ten}] co field-inert VAN hien`, /Field khai mà máy không dùng/.test(out), 'mat co vang');
  }
  // Phuong sai that van ra co do rieng, va hai co khong nuot nhau
  const both = card('E3 pass_rate 4/5 — chua on dinh', LOG);
  const divs = [...both.matchAll(/<div class="flag [^"]*">([\s\S]*?)<\/div>/g)].map(x => x[1]);
  check('WI6 ca gop: HAI khoi co RIENG BIET',
    divs.filter(d => /pass-rate hỗn hợp/.test(d)).length === 1
    && divs.filter(d => /Field khai mà máy không dùng/.test(d)).length === 1,
    String(divs.length));

  // (5) DOI CHUNG DUONG: khong co dong inert trong so chay -> KHONG co vang nao
  // HOI QUY VONG 3: cung MOT cau ra DONG THOI co vang va co do sai nhan. Fixture o day
  // KHONG duoc viet tay — Variance lay DUNG cai ben viet sinh ra. Voi duong B, ben viet
  // khong con chen cau vao Variance nua, nen Variance chi mang phuong sai (hoac rong).
  {
    for (const [ten, body] of [['tran', inertLine.note],
                               ['gach dau dong', '- ' + inertLine.note],
                               ['in dam', '**' + inertLine.note + '**'],
                               ['lan phuong sai that', 'E3 pass_rate 4/5 — chua on dinh\n' + inertLine.note]]) {
      const out = card(body, LOG);
      const fred = [...out.matchAll(/<div class="flag fred">([\s\S]*?)<\/div>/g)].map(x => x[1]);
      check(`WI6 hoi quy [${ten}]: cau canh bao KHONG deo nhan phuong-sai`,
        !fred.some(d => /Field khai mà máy không dùng/.test(d)), JSON.stringify(fred).slice(0, 130));
      check(`WI6 hoi quy [${ten}]: co vang van dung`, /flag fwarn">Field khai mà máy không dùng/.test(out));
    }
  }
  // ---- Ba lo do S4 vong 4 bat, deu da tai hien tay truoc khi sua ----
  // (a) NGAT DONG: cau ~200 ky tu bi markdown wrap. Ban truoc loc theo DONG nen chi
  // dong dau bi loai, phan duoi song sot va deo nhan do sai.
  {
    const w = inertLine.note.replace(/ /, '\n');   // ngat dong that su, do writer sinh ra
    const out = card(w, []);                        // so chay RONG = bao cao cu
    check('WI6 [ngat dong] KHONG deo nhan phuong-sai cho cau canh bao',
      !/pass-rate hỗn hợp/.test(out), 'phan duoi cau bi dan nhan do');
  }
  // (b) DONG INERT KHONG CO `note` (dung hinh dang vong 1-2 that): phai roi ve `fields`,
  // KHONG duoc mat ca hai kenh.
  {
    const noNote = JSON.stringify({ ts: 't', round: 1, kind: 'inert',
      fields: [{ evalId: 'E10', field: 'runs', executor: 'judgment' }] });
    const out = card(inertLine.note, [noNote]);
    check('WI6 [dong khong co note] van hien co vang tu fields',
      /flag fwarn">Field khai mà máy không dùng/.test(out), 'mat ca hai kenh');
    check('WI6 [dong khong co note] van neu dich danh eval + field',
      /E10/.test(out) && /runs/.test(out));
  }
  // (c) LOC THEO VONG: so chay la append-only, va "vong nay sach" duoc ma hoa bang su
  // VANG MAT cua dong inert. Khong loc vong thi canh bao KHONG BAO GIO tat duoc.
  {
    const r2clean = JSON.stringify({ ts: 't', round: 2, kind: 'baseline', evals_hash: 'x', non_discriminating: [] });
    const out = card('none — every multi-run eval is uniform', [JSON.stringify(inertLine), r2clean]);
    check('WI6 [vong sau da sach] canh bao cu KHONG con hien',
      !/Field khai mà máy không dùng/.test(out), 'canh bao khong tat duoc');
    // Doi chung duong: cung so chay nhung dong inert o dung vong moi nhat -> VAN hien
    const r2inert = JSON.stringify({ ...inertLine, round: 2 });
    const out2 = card('none — every multi-run eval is uniform', [JSON.stringify(inertLine), r2inert]);
    check('WI6 [vong sau van con inert] canh bao VAN hien',
      /Field khai mà máy không dùng/.test(out2));
  }

  // AC-16 — LUAT FIXTURE: dau vao cho ben doc phai do BEN VIET sinh trong lan chay nay.
  // Ba vong dau deu truot vi fixture la chuoi VIET TAY nham vao hinh dang san pham khong
  // bao gio tao ("none — every multi-run eval is uniform" — chinh loi nhac cu CAM sinh ra).
  check('WI6 [AC-16] fixture doc = DUNG doi tuong ben viet sinh, khong phai chuoi viet tay',
    LOG.length === 1 && JSON.parse(LOG[0]).note === inertLine.note
    && result.runLog.includes(LOG[0]), 'fixture khong truy duoc ve writer');

  const noLog = card('none — every multi-run eval is uniform', []);
  check('WI6 doi chung duong: khong dong inert -> khong co vang', !/Field khai mà máy không dùng/.test(noLog));
  const varOnly = card('E3 pass_rate 4/5 — chua on dinh', []);
  check('WI6 hoi quy: phuong sai that van ra co cu', /pass-rate hỗn hợp/.test(varOnly));
}

console.log('WI7 ba cho mo ta runs + buoc "Moi verdict" o CA HAI harness');
{
  const { readFileSync, writeFileSync, mkdtempSync } = await import('node:fs');
  const os = await import('node:os');
  const ROOT = path.join(HERE, '..', '..');
  // Cau CU (mo ta tro "eval ngau nhien/LLM" khong neu gioi han executor) — chinh cai lam
  // 10/10 luot dung runs trong repo roi vao o inert. Phai bien mat o ca ba cho.
  const OLD = [
    /eval ngẫu nhiên \(LLM\) chạy N lần/,
    /int>1 = eval ngẫu nhiên\/LLM/,
    /stochastic\/LLM eval and must report/,
  ];
  const SITES = [
    ['feature-loop/workflows/acceptance-verify.js', /CHI CO HIEU LUC TREN test\/script/],
    ['feature-loop/skills/feature-loop/SKILL.md', /chỉ có hiệu lực trên\*{0,2} executor `test`\/`script`/],
    ['codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md', /only to `test`\/`script` executors/],
  ];
  for (const [rel, re] of SITES) {
    const txt = readFileSync(path.join(ROOT, rel), 'utf8');
    check(`WI7 ${rel}: mo ta neu gioi han test/script`, re.test(txt));
    check(`WI7 ${rel}: khong con mo ta tro cu`, !OLD.some(o => o.test(txt)));
  }
  const GATE2 = [
    ['feature-loop/skills/feature-loop/SKILL.md', /inertFields[\s\S]{0,500}máy đã lo/],
    ['codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md', /inertFields/],
  ];
  for (const [rel, re] of GATE2) {
    check(`WI7 ${rel}: buoc trinh inertFields o Cong 2`, re.test(readFileSync(path.join(ROOT, rel), 'utf8')));
  }
  // DOI CHUNG DOT BIEN tren BAN SAO: khoi phuc cau cu -> detector phai DO o dung file do
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'agk-doc-'));
  for (const [i, [rel, re]] of SITES.entries()) {
    const copy = path.join(tmp, `s${i}.txt`);
    writeFileSync(copy, readFileSync(path.join(ROOT, rel), 'utf8').replace(re, 'eval ngẫu nhiên (LLM) chạy N lần'));
    const mutated = readFileSync(copy, 'utf8');
    check(`WI7 doi chung dot bien ${rel}: khoi phuc cau cu -> detector DO`,
      !re.test(mutated) && OLD.some(o => o.test(mutated)));
  }
}

console.log('WI8 duong doc-cu: workspace da ky mang runs/paths tren judgment van verify duoc');
{
  const { readFileSync, readdirSync, existsSync } = await import('node:fs');
  const ROOT = path.join(HERE, '..', '..');
  const WSDIR = path.join(ROOT, '_acceptance');

  // FIXTURE DO CODE SINH: quet chinh cay dang kiem, khong chep tay danh sach
  const found = { runs: [], paths: [] };
  for (const slug of readdirSync(WSDIR)) {
    const f = path.join(WSDIR, slug, 'evals.yaml');
    if (!existsSync(f)) continue;
    for (const b of readFileSync(f, 'utf8').split(/(?=^\s*- id:)/m)) {
      if (!/^\s{4}executor:\s*judgment/m.test(b)) continue;
      const id = (/- id:\s*(\S+)/.exec(b) || [])[1];
      if (/^\s{4}runs:\s*([2-9]|\d\d)/m.test(b)) found.runs.push(`${slug}/${id}`);
      if (/^\s{4}paths:/m.test(b)) found.paths.push(`${slug}/${id}`);
    }
  }
  // SANITY COUNTER TACH THEO HINH DANG. Dem TONG se xanh oan khi regex sot mot hinh dang
  // (paths la mang YAML, runs la vo huong — hai khuon khac nhau).
  check('WI8 quet ra >=1 eval judgment mang runs', found.runs.length >= 1, JSON.stringify(found.runs));
  check('WI8 quet ra >=1 eval judgment mang paths', found.paths.length >= 1, JSON.stringify(found.paths));

  const evals = [
    ...found.runs.map((k, i) => ({ id: `R${i}`, criterion: 'AC-1', executor: 'judgment', question: `q ${k}`, inputs: ['/a.md'], runs: 3 })),
    ...found.paths.map((k, i) => ({ id: `P${i}`, criterion: 'AC-2', executor: 'judgment', question: `q ${k}`, inputs: ['/a.md'], paths: ['x.js'] })),
  ];
  const { result } = await runWorkflow(WF, baseArgs({ evals, suiteCommands: ['npm run build'] }), responder());
  check('WI8 verdict KHONG phai BLOCKED', result.verdict !== 'BLOCKED', result.verdict + ' ' + JSON.stringify(result.blocked));
  check('WI8 khong eval nao bi day vao failedEvals', result.failedEvals.length === 0, JSON.stringify(result.failedEvals));
  // AC-2b: chi eval mang `runs` bi neu ten. Eval mang `paths` KHONG bi canh bao —
  // field do that su co tac dung (nuoi vung phu), canh bao no la noi doi.
  const named = new Set(result.inertFields.map(f => f.evalId));
  check('WI8 MOI eval mang runs deu bi neu ten',
    found.runs.every((_, i) => named.has(`R${i}`)), JSON.stringify([...named]));
  check('WI8 KHONG eval nao mang paths bi canh bao (AC-2b)',
    found.paths.every((_, i) => !named.has(`P${i}`)), JSON.stringify([...named]));
  check('WI8 moi muc canh bao deu la field runs',
    result.inertFields.every(f => f.field === 'runs'), JSON.stringify(result.inertFields.map(f => f.field)));

  // DOI CHUNG DUONG: phep do nay BIET do — tiem agent may chet vao CUNG harness
  const { result: red } = await runWorkflow(WF, baseArgs({ evals, suiteCommands: ['npm run build'] }),
    responder({ 'machine:': null }));
  check('WI8 doi chung duong: agent may chet -> BLOCKED', red.verdict === 'BLOCKED', red.verdict);
}

console.log('WI9 QUAN HE: hang khai inert phai THAT SU khong doi bat ky dau ra nao');
{
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(WF, 'utf8');
  const m = /\/\/ <<<INERT-FIELD-TABLE([\s\S]*?)\/\/ INERT-FIELD-TABLE>>>/.exec(src);
  const rows = [...(m ? m[1] : '').matchAll(/field:\s*'([a-z]+)'\s*,\s*executor:\s*'([a-z-]+)'/g)]
    .map(r => ({ field: r[1], executor: r[2] }));
  check('WI9 rut duoc hang tu bang', rows.length > 0, String(rows.length));

  // Findings that de coverageCluster co dat co: 2 finding ngoai vung phu cua eval may
  const F = [{ title: 'A', file: 'src/foo.js', line: 1, detail: 'd', severity: 'high' },
             { title: 'B', file: 'src/bar.js', line: 2, detail: 'd', severity: 'high' }];
  const resp = (over = {}) => (c) => {
    const l = c.label;
    for (const [k, v] of Object.entries(over)) if (l.startsWith(k)) return typeof v === 'function' ? v(c) : v;
    if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
    if (l.startsWith('ui:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false, screenshotPath: 'e.png', observed: 'thay dung nhu expected, day du hon 20 ky tu' };
    if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'ok' };
    if (l.startsWith('review:')) return l.includes('bugs') ? { findings: F } : { findings: [] };
    if (l.startsWith('refute:')) return { refuted: false, reason: 'that' };
    if (l.startsWith('triage')) return { triage: F.map(f => ({ title: f.title, file: f.file, inContract: false, acRef: '', rationale: 'r', proposal: 'known-limits', plain: 'p' })) };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (l === 'synthesize:report') return { report: 'r', findings: 'f' };
    return null;
  };
  const sample = (f) => (f === 'runs' ? 3 : ['src/**']);
  const evalFor = (field, executor, withField) => {
    const b = { id: 'X1', criterion: 'AC-1', executor, expected: 'ok', ...(withField ? { [field]: sample(field) } : {}) };
    if (executor === 'judgment') return { ...b, question: 'q?', inputs: ['/a.md'] };
    if (executor === 'ui-check') return { ...b, steps: ['open'] };
    return { ...b, cmd: 'pnpm test', ref: 'config:executors.test.api' };
  };
  // Chuan hoa: bo MOI dau ra do chinh co che canh bao sinh ra. Con lai phai giong het.
  const strip = (r, calls) => {
    const { inertFields, runLog, ...rest } = r;
    return JSON.stringify({
      rest,
      runLog: (runLog || []).filter(l => JSON.parse(l).kind !== 'inert'),
      synth: (calls.find(c => c.label === 'synthesize:report') || {}).prompt
        ?.replace(/O INERT \(may da tinh san[\s\S]*?VARIANCE-N/, 'VARIANCE-N'),
    });
  };
  const bad = [];
  for (const row of rows) {
    const args = (withField) => baseArgs({
      evals: [{ id: 'M1', criterion: 'AC-9', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'ok', paths: ['other/**'] },
              evalFor(row.field, row.executor, withField)],
      suiteCommands: [], riskTier: 'T2',
      contractPath: '/repo/_acceptance/x/contract.md',
    });
    const withF = await runWorkflow(WF, args(true), resp());
    const noF = await runWorkflow(WF, args(false), resp());
    if (strip(withF.result, withF.calls) !== strip(noF.result, noF.calls)) {
      const a = withF.result, b = noF.result;
      bad.push(`${row.field}x${row.executor}: coverageCluster ${JSON.stringify(a.coverageCluster)} vs ${JSON.stringify(b.coverageCluster)}`);
    }
  }
  check('WI9 MOI hang trong bang that su inert (so sau hai lan chay)', bad.length === 0, bad.join(' ; '));
}

console.log('WI10 nhanh thoat som van mang inertFields (dryRun + BLOCKED khong-co-gi-verify)');
{
  const jEval = { id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], runs: 3 };
  const { result: dry } = await runWorkflow(WF, baseArgs({ evals: [jEval], dryRun: true }), responder());
  check('WI10 dryRun mang inertFields', (dry.inertFields || []).length === 1, JSON.stringify(dry.inertFields));

  // BLOCKED "khong co gi de verify": chi judgment carried + suite rong -> khong con gi FRESH
  const { result: blk } = await runWorkflow(WF, baseArgs({
    evals: [jEval], suiteCommands: [],
    carriedPanels: [{ evalId: 'E9', proposal: 'PASS', votes: [], fromRound: 1 }],
  }), responder());
  check('WI10 nhanh BLOCKED tra ve dung verdict', blk.verdict === 'BLOCKED', blk.verdict);
  check('WI10 nhanh BLOCKED VAN mang inertFields', (blk.inertFields || []).length === 1, JSON.stringify(blk.inertFields));

  // Doi chung duong: khong eval inert -> ca hai nhanh deu rong
  const clean = { id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'] };
  const { result: d2 } = await runWorkflow(WF, baseArgs({ evals: [clean], dryRun: true }), responder());
  check('WI10 doi chung duong dryRun sach', (d2.inertFields || []).length === 0);
}

summary('acceptance-verify');
