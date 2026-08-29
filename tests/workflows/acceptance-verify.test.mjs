// Characterization tests for feature-loop/workflows/acceptance-verify.js —
// the PURE layer (classify/dedupe, variance merge, verdict routing, run-log
// lines, provenance sanitize, model routing) exercised through the real file
// with deterministic canned agents. These pin behavior BEFORE any routing
// change (Đợt 2 rule: tách logic thuần + unit test trước, đổi routing sau).
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { runWorkflow, check, summary, TOOL_KILL_RULE_LINES, TOOL_KILL_RULE_SRC } from './harness.mjs';
import { measureShapes } from './measure-pins.mjs';

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
  check('W03 runLog: 1 dong moi eval + 1 moi lenh suite', result.runLog.length === 3, String(result.runLog.length));
  const lines = result.runLog.map(l => JSON.parse(l));
  check('W03 run_id minted deterministically per eval', lines[0].run_id === 'minted-demo-E1-r1' && lines[1].run_id === 'minted-demo-E2-r1');
  check('W03 ts from args.invokedAt', lines.every(l => l.ts === '2026-07-02T10:00:00Z'));
  // Lenh suite KHONG gan eval nao. Truoc ban va no khong co dong run-log nao, nen agent
  // tong hop phai tu dat run_id va recheck-evidence do L2 PROVENANCE NGAY SAU khi Cong 2
  // ky (chot human_signoff `continue` truoc khoi recheck nen no an cho toi luc do).
  const suiteLine = lines.find(l => String(l.evalId).startsWith('SUITE-'));
  check('W03 lenh suite CO dong run-log', !!suiteLine, JSON.stringify(lines.map(l => l.evalId)));
  check('W03 suite: ten suy tu lenh, id duc deterministic',
    suiteLine && suiteLine.evalId === 'SUITE-build' && suiteLine.run_id === 'minted-demo-SUITE-build-r1',
    suiteLine && `${suiteLine.evalId} / ${suiteLine.run_id}`);
  check('W03 suite: dong mang exit + cmd that',
    suiteLine && suiteLine.exit_code === 0 && suiteLine.cmd === 'npm run build');
  // Từ đợt 8: KHÔNG còn agent scribe — agent "chép sẵn dòng audit" trông y hệt
  // ngụy tạo hồ sơ và bị safety layer chặn lặp lại dù nội dung do JS tính từ kết
  // quả thật. Main loop tự append result.runLog (SKILL bước "Mọi verdict").
  check('W03 KHONG con agent scribe', byLabel(calls, 'scribe:').length === 0, String(byLabel(calls, 'scribe:').length));
  check('W03 runLogWriteFailed LUON true khi co dong — main loop append', result.runLogWriteFailed === true);
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W03 synthesize gets verified_commit literal', synth.prompt.includes(`"verified_commit: ${VC}"`));
  check('W03 synthesize gets the evalRunIds map, not minting rights', synth.prompt.includes('minted-demo-E1-r1') && synth.prompt.includes('KHONG tu mint'));
  check('W03 synthesize cung nhan id cua lenh suite (log va report phai khop)',
    synth.prompt.includes('minted-demo-SUITE-build-r1'));
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
  const evalLines = lines.filter(l => !String(l.evalId).startsWith('SUITE-'));
  check('W04 run-log records real exit + verifier runId', evalLines.every(l => l.exit_code === 1 && l.run_id === 'run-777'));
  check('W04 dong suite giu exit RIENG cua no, khong an theo eval hong',
    lines.some(l => String(l.evalId).startsWith('SUITE-') && l.exit_code === 0));
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
  const jEval = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'q', inputs: ['/repo/x.md'] };
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
  check('W12 runLog mang du dong cho main loop', result.runLog.length === 3, String(result.runLog.length));
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
  const jEval = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'q', inputs: ['/repo/x.md'] };
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
  const e9 = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'q9', inputs: ['/repo/x9.md'], inputsHash: 'h9' };
  const e10 = { id: 'E10', criterion: 'AC-10', executor: 'judgment', question: 'q10', inputs: ['/repo/x10.md'] };
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
  // Không ai bị REJECT từ findings, NHƯNG cũng không được là PASS sạch: người ký
  // phải thấy round này chưa phân loại được (WT-T18).
  check('WT-T4 KHONG REJECT tu finding', result.verdict === 'PENDING-JUDGMENT', result.verdict);
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
  check('WT-T4c KHONG REJECT', result.verdict === 'PENDING-JUDGMENT', result.verdict);
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
  check('WT-T11 KHONG REJECT tu finding', result.verdict === 'PENDING-JUDGMENT', result.verdict);
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
  check('WT-T14 KHONG REJECT tu finding', result.verdict === 'PENDING-JUDGMENT', result.verdict);
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

// ── WT-T16: khoá ghép triage chuẩn hoá path — hai lane reviewer, hai dạng ──
// Reviewer được nhắc "trong repo <abs path>" nên lane này trả path TUYỆT ĐỐI,
// lane kia trả TƯƠNG ĐỐI; agent triage chép lại dạng nó nhận. Ghép bằng chuỗi
// thô thì hai dạng không khớp → mọi finding rơi unclassified → triageFailed →
// rejectFindings rỗng → round báo PASS trong khi lỗi in-contract còn sống.
// (Quan sát thật 3/5 round của discovery-brainstorm-socket, sổ d-...-10021.)
const F_ABS = { title: F_HIGH.title, file: '/repo/src/install.ts', severity: 'high', detail: F_HIGH.detail };
const triRow = (title, file, over = {}) => [{ title, file, inContract: true, acRef: 'AC-1', rationale: 'cham AC-1', proposal: '', ...over }];

console.log('WT-T16a finding path TUYET DOI + triage tra TUONG DOI -> van ghep duoc');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [F_ABS],
    triage: triRow(F_ABS.title, 'src/install.ts'),
  }));
  check('WT-T16a khong con unclassified', !(result.triaged || []).some(f => f.unclassified),
    JSON.stringify((result.triaged || []).map(f => ({ f: f.file, u: f.unclassified }))));
  check('WT-T16a triageFailed false', result.triageFailed === false);
  // Ba lane reviewer cùng báo một lỗi → ba mục; điều phải đúng là KHÔNG mục nào
  // khác lọt vào fix-list, không phải con số 1.
  check('WT-T16a finding in-contract vao fix-list',
    (result.rejectFindings || []).length > 0 && (result.rejectFindings || []).every(f => f.title === F_ABS.title),
    JSON.stringify((result.rejectFindings || []).map(f => f.title)));
  check('WT-T16a verdict REJECT (khong con PASS gia)', result.verdict === 'REJECT', result.verdict);
}

console.log('WT-T16b chieu nguoc: finding TUONG DOI + triage tra TUYET DOI');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [F_HIGH],
    triage: triRow(F_HIGH.title, '/repo/src/install.ts'),
  }));
  check('WT-T16b triageFailed false', result.triageFailed === false);
  check('WT-T16b verdict REJECT', result.verdict === 'REJECT', result.verdict);
}

console.log('WT-T16c dang "./" cung la cung mot file');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [{ ...F_HIGH, file: './src/install.ts' }],
    triage: triRow(F_HIGH.title, 'src/install.ts'),
  }));
  check('WT-T16c triageFailed false', result.triageFailed === false);
  check('WT-T16c verdict REJECT', result.verdict === 'REJECT', result.verdict);
}

// ĐỐI CHỨNG ÂM: chuẩn hoá KHÔNG được biến thành "ghép mọi thứ". Hai finding
// TRÙNG title (nên nhánh gỡ-mơ-hồ ở WT-T17 tắt) trỏ hai file THẬT SỰ khác với
// hai dòng triage → phải vẫn là unclassified, không ai được kéo vào fix-list.
console.log('WT-T16d (doi chung am) file that su khac nhau -> KHONG duoc ghep');
{
  const a = { title: 'trung title', file: 'src/a.ts', severity: 'high', detail: 'x' };
  const b = { title: 'trung title', file: 'src/b.ts', severity: 'high', detail: 'y' };
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [a, b],
    triage: [...triRow('trung title', 'src/c.ts'), ...triRow('trung title', 'src/d.ts')],
  }));
  check('WT-T16d van unclassified', (result.triaged || []).every(f => f.unclassified),
    JSON.stringify((result.triaged || []).map(f => ({ f: f.file, u: f.unclassified }))));
  check('WT-T16d triageFailed true', result.triageFailed === true);
  check('WT-T16d rejectFindings rong', (result.rejectFindings || []).length === 0);
}

// Ca CÔ LẬP cho phép chuẩn hoá: title TRÙNG nên nhánh gỡ-mơ-hồ (WT-T17) tắt —
// chỉ còn chuẩn hoá path có thể ghép được. Thiếu ca này thì WT-T16a/b/c vẫn xanh
// kể cả khi chuẩn hoá bị gỡ, vì nhánh gỡ-mơ-hồ đỡ hộ (đo hai lớp phòng thủ bằng
// một phép đo = không lớp nào thật sự bị đo).
console.log('WT-T16e title TRUNG + path lech dang -> CHI chuan hoa cuu duoc');
{
  const a = { title: 'trung title', file: '/repo/src/a.ts', severity: 'high', detail: 'in-contract that' };
  const b = { title: 'trung title', file: '/repo/src/b.ts', severity: 'low', detail: 'out-of-contract that' };
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [a, b],
    triage: [
      ...triRow('trung title', 'src/a.ts'),
      ...triRow('trung title', 'src/b.ts', { inContract: false, acRef: '', proposal: 'known-limits' }),
    ],
  }));
  check('WT-T16e triageFailed false', result.triageFailed === false);
  check('WT-T16e src/a.ts vao fix-list', (result.rejectFindings || []).some(f => f.file === 'src/a.ts'),
    JSON.stringify((result.rejectFindings || []).map(f => f.file)));
  check('WT-T16e src/b.ts KHONG vao fix-list (chuan hoa khong lam nhoe hai file)',
    !(result.rejectFindings || []).some(f => f.file === 'src/b.ts'));
  check('WT-T16e verdict REJECT', result.verdict === 'REJECT', result.verdict);
}

// ── WT-T17: gỡ-mơ-hồ bằng title CHỈ khi cả hai phía đều duy nhất ───────────
console.log('WT-T17a agent viet lai path (rut gon) nhung title duy nhat -> ghep duoc');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [F_HIGH],
    triage: triRow(F_HIGH.title, 'install.ts'), // agent rút gọn path, không còn chuẩn hoá được
  }));
  check('WT-T17a triageFailed false', result.triageFailed === false);
  check('WT-T17a verdict REJECT', result.verdict === 'REJECT', result.verdict);
}

console.log('WT-T17b (doi chung am) title TRUNG -> tuyet doi khong duoc doan');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [SAME_A, SAME_B], // cùng title 'missing validation', hai file
    triage: [
      ...triByFile([{ ...SAME_A, file: 'src/khac.ts', inContract: true }]),
      ...triByFile([{ ...SAME_B, file: 'docs/khac.md', inContract: false }]),
    ],
  }));
  check('WT-T17b triageFailed true (mo ho thi khong doan)', result.triageFailed === true);
  check('WT-T17b rejectFindings rong', (result.rejectFindings || []).length === 0,
    JSON.stringify((result.rejectFindings || []).map(f => f.file)));
}

console.log('WT-T17c title duy nhat nhung dong triage da co chu -> khong cuop mat');
{
  // Hai finding, hai dòng triage khớp CHẶT cho cả hai: nhánh gỡ-mơ-hồ không
  // được kích hoạt và không dòng nào bị dùng lại cho finding khác.
  const other = { title: 'finding thu hai', file: 'src/b.ts', severity: 'low', detail: 'y' };
  const { result } = await runWorkflow(WF, triArgs(), triResp({
    findings: [F_HIGH, other],
    triage: [...tri1(F_HIGH), ...triOut(other)],
  }));
  check('WT-T17c moi finding giu dung phan loai cua no',
    (result.triaged || []).find(f => f.title === F_HIGH.title).inContract === true &&
    (result.triaged || []).find(f => f.title === other.title).inContract === false);
}

// ── WT-T18: triage hỏng phải HIỆN trên vật được giao, không chỉ trong log ──
// Fail-toward-human là chủ ý, nhưng người ký chỉ đọc evidence-report.md. Verdict
// PASS sạch bong + không dấu vết nào trong frontmatter = người ký duyệt một kết
// luận mà chính workflow không tin. Verdict phải tự nói ra điều đó.
console.log('WT-T18a triage hong -> verdict PENDING-JUDGMENT, khong phai PASS sach');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: [], triageThrows: true }));
  check('WT-T18a triageFailed true', result.triageFailed === true);
  check('WT-T18a verdict PENDING-JUDGMENT', result.verdict === 'PENDING-JUDGMENT', result.verdict);
  check('WT-T18a van KHONG ai bi REJECT tu findings', (result.rejectFindings || []).length === 0);
}

console.log('WT-T18b (doi chung duong) triage song -> verdict KHONG bi keo ve PENDING');
{
  const { result } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_MED], triage: tri1(F_MED) }));
  check('WT-T18b verdict PASS khi triage lanh', result.verdict === 'PASS', result.verdict);
}

console.log('WT-T18c triage hong -> prompt synthesize doi co trong frontmatter + than bai');
{
  const { calls } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: [], triageThrows: true }));
  const sp = byLabel(calls, 'synthesize')[0].prompt;
  check('WT-T18c doi dong frontmatter triage_failed: true', sp.includes('triage_failed: true'));
  check('WT-T18c doi dong canh bao trong than evidence-report', sp.includes('phân loại phạm vi KHÔNG chạy được'));
  // Cờ mới KHÔNG được đẻ thêm section cho evidence-report (WT-T8 giữ tập đóng).
  const extra = reportSectionsIn(sp).filter(s => !REPORT_SECTIONS_ALLOWED.includes(s));
  check('WT-T18c khong section moi nao', extra.length === 0, `section la: ${extra.join(' | ')}`);
}

console.log('WT-T18d (doi chung am) triage lanh -> prompt KHONG mang co triage_failed');
{
  const { calls } = await runWorkflow(WF, triArgs(), triResp({ findings: [F_HIGH], triage: tri1(F_HIGH) }));
  const sp = byLabel(calls, 'synthesize')[0].prompt;
  check('WT-T18d khong bia co khi triage lanh', !sp.includes('triage_failed'), 'prompt co co du triage lanh');
}

// ── WT-T19: ma trận mutation viết-TRƯỚC cho 4 bảo đảm vừa thêm ────────────
// Nghi thức "phá vật thật trong một bản sao": mỗi bảo đảm đúng MỘT mutant, mutant
// chạy trên bản sao script trong bộ nhớ. Không có bước này thì 4 case trên có thể
// đang xanh vì lý do khác (fixture sai, nhánh không chạy) chứ không vì code đúng.
const WF_SRC = readFileSync(WF, 'utf8');
// Mỗi phần tử: [tên, phép mutate nguồn, phép chạy → trả về true nếu ĐỎ đúng chỗ]
const MUTANTS = [
  // Đo trên ca CÔ LẬP (WT-T16e): title trùng nên nhánh gỡ-mơ-hồ tắt, chỉ chuẩn
  // hoá cứu được — mutant mới thật sự đỏ vì mất chuẩn hoá, không vì mất lớp khác.
  ['MT1 khoa ghep so path THO (bo ca hai lop chuan hoa) -> WT-T16e do',
    s => s
      .replace('.map(f => ({ ...f, file: relPath(f.file) }))', '')
      .replace('const triageKey = t => `${relFile(t)} :: ${t.title}`', 'const triageKey = t => `${t.file || \'\'} :: ${t.title}`'),
    async (src) => {
      const a = { title: 'trung title', file: '/repo/src/a.ts', severity: 'high', detail: 'x' };
      const b = { title: 'trung title', file: '/repo/src/b.ts', severity: 'low', detail: 'y' };
      const { result } = await runWorkflow(WF, triArgs(), triResp({
        findings: [a, b],
        triage: [
          ...triRow('trung title', 'src/a.ts'),
          ...triRow('trung title', 'src/b.ts', { inContract: false, acRef: '', proposal: 'known-limits' }),
        ],
      }), src);
      return result.triageFailed === true && result.verdict !== 'REJECT';
    }],
  ['MT2 bo nhanh go-mo-ho bang title duy nhat -> WT-T17a do',
    s => s.replace(/\n  \|\| \(\(unique\(rowsByTitle[\s\S]*?: undefined\)/, ''),
    async (src) => {
      const { result } = await runWorkflow(WF, triArgs(), triResp({
        findings: [F_HIGH], triage: triRow(F_HIGH.title, 'install.ts'),
      }), src);
      return result.triageFailed === true && result.verdict !== 'REJECT';
    }],
  ['MT3 bo dinh tuyen verdict khi triage hong -> WT-T18a do (PASS gia quay lai)',
    s => s.replace("else if (triageFailed) verdict = 'PENDING-JUDGMENT'\n", ''),
    async (src) => {
      const { result } = await runWorkflow(WF, triArgs(),
        triResp({ findings: [F_HIGH], triage: [], triageThrows: true }), src);
      return result.verdict === 'PASS';
    }],
  ['MT4 bo chi dan co trong evidence-report -> WT-T18c do',
    s => s.replace('${triageFailed ? `TRIAGE HONG', '${false ? `TRIAGE HONG'),
    async (src) => {
      const { calls } = await runWorkflow(WF, triArgs(),
        triResp({ findings: [F_HIGH], triage: [], triageThrows: true }), src);
      const sp = byLabel(calls, 'synthesize')[0].prompt;
      return !sp.includes('triage_failed: true') || !sp.includes('phân loại phạm vi KHÔNG chạy được');
    }],
];

console.log('WT-T19 ma tran mutation: 4 bao dam, 4 mutant, moi mutant phai do dich danh');
{
  // ĐỐI CHỨNG DƯƠNG trước: bản NGUYÊN VẸN phải xanh ở cả 4 phép đo, nếu không
  // thì "mutant đỏ" chẳng chứng minh gì (mọi thứ đều đỏ).
  for (const [name, mutate, probe] of MUTANTS) {
    const clean = await probe(WF_SRC);
    check(`WT-T19+ doi chung duong: ban nguyen ven XANH (${name.split(' ')[0]})`, clean === false,
      'bản chưa mutate đã đỏ — phép đo không phân biệt được');
  }
  for (const [name, mutate, probe] of MUTANTS) {
    const mutated = mutate(WF_SRC);
    check(`${name} — nguon that su bi doi`, mutated !== WF_SRC, 'phép mutate không khớp nguồn (neo đã trôi) — case này KHÔNG được coi là pass');
    check(`${name}`, mutated !== WF_SRC && (await probe(mutated)) === true, 'phá vật thật mà phép đo vẫn xanh');
  }
}

// ── W-G*: guard fail-loud cho field ma prompt fan-out noi suy thang vao ────
// Loi do duoc o motion-floor r1-r2: judgment thieu `question` -> judge nhan
// literal "undefined" lam de bai va van tra PASS 3/3. Quet lop tim them: eval
// co `executor` la/vang bi bo roi im lang, run tra verdict=PASS.
const jOK = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?', inputs: ['/repo/a.md'] };
const BLOCK_SHAPE = ['blocked', 'failedEvals', 'failedCommands', 'panels', 'confirmedFindings', 'reviewIncomplete'];

console.log('W-G1 judgment thieu question: 5 hinh dang deu BLOCKED, neu ten eval + field');
{
  const shapes = [
    ['khoa vang', (e) => { delete e.question; }],
    ['null', (e) => { e.question = null; }],
    ['chuoi rong', (e) => { e.question = ''; }],
    ['khoang trang', (e) => { e.question = '   '; }],
    ['sai kieu', (e) => { e.question = 42; }],
  ];
  for (const [name, mutate] of shapes) {
    const bad = { ...jOK };
    mutate(bad);
    const { result, calls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, bad] }), responder());
    const reason = (result.blocked && result.blocked[0] && result.blocked[0].reason) || '';
    check(`W-G1 ${name} -> BLOCKED`, result.verdict === 'BLOCKED', result.verdict);
    check(`W-G1 ${name} neu ten eval E9`, /\bE9\b/.test(reason), reason);
    check(`W-G1 ${name} neu ten field question`, /question/.test(reason), reason);
    check(`W-G1 ${name} 0 judge spawn`, byLabel(calls, 'judge:').length === 0, String(byLabel(calls, 'judge:').length));
  }
  // doi chung DUONG: cung bo args, chi khac question la chuoi that
  const { result: ok, calls: okCalls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, jOK] }), responder());
  check('W-G1 doi chung duong: KHONG BLOCKED', ok.verdict !== 'BLOCKED', ok.verdict);
  check('W-G1 doi chung duong: 3 judge that su chay', byLabel(okCalls, 'judge:').length === 3, String(byLabel(okCalls, 'judge:').length));
}

console.log('W-G2 shape tra ve cua BLOCKED du key cho downstream');
{
  const bad = { ...jOK, question: '' };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, bad] }), responder());
  for (const k of BLOCK_SHAPE) {
    check(`W-G2 co key ${k} dung kieu mang`, Array.isArray(result[k]), `${k}=${JSON.stringify(result[k])}`);
  }
}

console.log('W-G3 judgment thieu inputs: UNCERTAIN co hoc, KHONG BLOCKED, 0 judge');
{
  const noInputs = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?' };
  const emptyInputs = { id: 'E8', criterion: 'AC-8', executor: 'judgment', question: 'ro rang?', inputs: [] };
  const { result, calls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, noInputs, emptyInputs] }), responder());
  check('W-G3 KHONG BLOCKED', result.verdict !== 'BLOCKED', result.verdict);
  check('W-G3 verdict PENDING-JUDGMENT', result.verdict === 'PENDING-JUDGMENT', result.verdict);
  check('W-G3 0 judge spawn', byLabel(calls, 'judge:').length === 0, String(byLabel(calls, 'judge:').length));
  const p9 = (result.panels || []).find(p => p.evalId === 'E9');
  const p8 = (result.panels || []).find(p => p.evalId === 'E8');
  check('W-G3 panel E9 UNCERTAIN', !!p9 && p9.proposal === 'UNCERTAIN', JSON.stringify(p9));
  check('W-G3 panel E8 (mang rong) UNCERTAIN', !!p8 && p8.proposal === 'UNCERTAIN', JSON.stringify(p8));
  const sp = byLabel(calls, 'synthesize')[0].prompt;
  check('W-G3 synthesize nhan ly do khong khai input', /khong khai input/.test(sp), 'thieu ly do trong payload panel');

  // doi chung PHAN BIET: inputs SAI KIEU van la hong khuon -> BLOCKED
  const wrongType = { ...noInputs, inputs: 'khong-phai-mang' };
  const { result: r2 } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, wrongType] }), responder());
  check('W-G3 inputs sai kieu -> BLOCKED', r2.verdict === 'BLOCKED', r2.verdict);
  check('W-G3 inputs sai kieu neu ten field', /inputs/.test(r2.blocked[0].reason), r2.blocked[0].reason);
  const nonStr = { ...noInputs, inputs: [{ a: 1 }] };
  const { result: r3 } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, nonStr] }), responder());
  check('W-G3 inputs co phan tu khong phai chuoi -> BLOCKED', r3.verdict === 'BLOCKED', r3.verdict);
}

console.log('W-G4 3 cua hau khong mien kiem: carriedPanels, carriedEvals, dryRun');
{
  // (a) hong khuon + carriedPanels tro dung eval do -> van BLOCKED
  const badJ = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: '' };
  const cp = { evalId: 'E9', proposal: 'PASS', votes: [{ lens: 'domain-correctness', verdict: 'PASS' }], fromRound: 2 };
  const { result: a } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, badJ], carriedPanels: [cp] }), responder());
  check('W-G4a panel carried KHONG mien kiem hong khuon', a.verdict === 'BLOCKED', a.verdict);
  check('W-G4a neu ten E9', /\bE9\b/.test(a.blocked[0].reason), a.blocked[0].reason);
  const okJ = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?', inputs: ['/repo/a.md'] };
  const { result: a2, calls: a2c } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, okJ], carriedPanels: [cp] }), responder());
  check('W-G4a doi chung duong: KHONG BLOCKED', a2.verdict !== 'BLOCKED', a2.verdict);
  check('W-G4a doi chung duong: 0 judge (panel carried dung lai)', byLabel(a2c, 'judge:').length === 0, String(byLabel(a2c, 'judge:').length));
  check('W-G4a doi chung duong: panel giu proposal goc PASS', (a2.panels.find(p => p.evalId === 'E9') || {}).proposal === 'PASS', JSON.stringify(a2.panels));

  // (b) hong khuon + carriedEvals tro dung eval may do -> van BLOCKED
  const badM = { id: 'E7', criterion: 'AC-7', executor: 'test', ref: 'config:executors.test.api' };
  const ce = { id: 'E7', runId: 'r-abc123', fromRound: 2, verifiedAt: '2026-08-01T00:00:00Z', cmd: 'pnpm test' };
  const { result: b } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, badM], carriedEvals: [ce] }), responder());
  check('W-G4b eval carried KHONG mien kiem', b.verdict === 'BLOCKED', b.verdict);
  check('W-G4b neu ten E7 + field cmd', /\bE7\b/.test(b.blocked[0].reason) && /cmd/.test(b.blocked[0].reason), b.blocked[0].reason);
  const okM = { ...badM, cmd: 'pnpm test' };
  const { result: b2, calls: b2c } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, okM], carriedEvals: [ce] }), responder());
  check('W-G4b doi chung duong: KHONG BLOCKED', b2.verdict !== 'BLOCKED', b2.verdict);
  check('W-G4b doi chung duong: carried nen khong them agent may', byLabel(b2c, 'machine:').length === 2, String(byLabel(b2c, 'machine:').length));

  // (c) dryRun + eval hong -> BLOCKED, KHONG tra ke hoach
  const { result: c, calls: cc } = await runWorkflow(WF, baseArgs({ dryRun: true, evals: [...baseArgs().evals, badJ] }), responder());
  check('W-G4c dryRun + eval hong -> BLOCKED', c.verdict === 'BLOCKED', c.verdict);
  check('W-G4c KHONG tra ke hoach fan-out', c.distinctCommands === undefined && c.judgePanels === undefined, JSON.stringify(Object.keys(c)));
  check('W-G4c 0 agent', cc.length === 0, String(cc.length));
  const { result: c2 } = await runWorkflow(WF, baseArgs({ dryRun: true, evals: [...baseArgs().evals, okJ] }), responder());
  check('W-G4c doi chung duong: ke hoach van day du', Array.isArray(c2.distinctCommands) && c2.judgePanels.length === 1, JSON.stringify(c2.judgePanels));

  // (d) nhanh UNCERTAIN cung phai song qua carried + dryRun
  const noIn = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?' };
  const { result: d, calls: dc } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, noIn], carriedPanels: [cp] }), responder());
  check('W-G4d panel carried KHONG ghi de duoc nhanh UNCERTAIN', (d.panels.find(p => p.evalId === 'E9') || {}).proposal === 'UNCERTAIN', JSON.stringify(d.panels));
  check('W-G4d 0 judge', byLabel(dc, 'judge:').length === 0, String(byLabel(dc, 'judge:').length));
  const { result: d2 } = await runWorkflow(WF, baseArgs({ dryRun: true, evals: [...baseArgs().evals, noIn] }), responder());
  check('W-G4d dryRun KHONG liet eval khong can cu vao judgePanels', !(d2.judgePanels || []).some(x => x.eval === 'E9'), JSON.stringify(d2.judgePanels));
  check('W-G4d dryRun neu ro no thuoc dien khong can cu', (d2.ungroundedJudgments || []).includes('E9'), JSON.stringify(d2.ungroundedJudgments));
}

console.log('W-G5 nhieu eval hong: neu DU ten, so bang TAP khong bang dem chuoi con');
{
  // id long tien to CO Y: E1x nam trong E1x1 — dem bang substring se cho 2==2
  // du guard chi neu mot cai. Trich theo ranh gioi token roi so BANG TAP.
  const bad1 = { id: 'E1x', criterion: 'AC-1', executor: 'judgment', question: '' };
  const bad11 = { id: 'E1x1', criterion: 'AC-2', executor: 'ui-check', expected: 'ok' }; // thieu steps
  const bad3 = { id: 'E3y', criterion: 'AC-3', executor: 'script' };                     // thieu cmd
  const { result } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, bad1, bad11, bad3] }), responder());
  const reason = result.blocked[0].reason;
  const WANT_IDS = ['E1x', 'E1x1', 'E3y'];
  const ids = new Set((reason.match(/E\d+[a-z]\d*/g) || []).filter(t => WANT_IDS.includes(t)));
  check('W-G5 tap id BANG DUNG tap da tiem', ids.size === 3 && WANT_IDS.every(i => ids.has(i)), [...ids].join(','));
  const fields = new Set(['question', 'steps', 'cmd'].filter(f => new RegExp(`"${f}"`).test(reason)));
  check('W-G5 tap field BANG DUNG tap da tiem', fields.size === 3, [...fields].join(','));
  // sanity: phep do phai PHAN BIET duoc — bo E1x1 di thi tap phai nho lai
  const { result: r2 } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, bad1, bad3] }), responder());
  const ids2 = new Set((r2.blocked[0].reason.match(/E\d+[a-z]\d*/g) || []).filter(t => WANT_IDS.includes(t)));
  check('W-G5 sanity: bo mot eval hong -> tap nho lai dung 1', ids2.size === 2 && !ids2.has('E1x1'), [...ids2].join(','));
}

console.log('W-G6 executor la/vang bi CHAN — hom nay bi bo roi im lang');
{
  const typo = { id: 'E2t', criterion: 'AC-2', executor: 'judgement', question: 'typo executor', inputs: ['/a.md'] };
  const noX = { id: 'E3n', criterion: 'AC-3', expected: 'khong khai executor' };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, typo, noX] }), responder());
  check('W-G6 BLOCKED', result.verdict === 'BLOCKED', result.verdict);
  const reason = result.blocked[0].reason;
  check('W-G6 neu ten ca hai eval', /E2t/.test(reason) && /E3n/.test(reason), reason);
  check('W-G6 neu gia tri executor la', /judgement/.test(reason), reason);
  check('W-G6 neu executor VANG', /VANG/.test(reason), reason);
}

console.log('W-G6b doi chung dot bien: ban TRUOC guard tra PASS tren cung bo args');
{
  const { readFileSync, writeFileSync, mkdtempSync } = await import('node:fs');
  const os = await import('node:os');
  const src = readFileSync(WF, 'utf8');
  // Sinh ban TRUOC-GUARD bang CODE trong chinh lan chay: go tu bang marker den
  // het khoi return BLOCKED. KHONG chep tay ban cu.
  const stripped = src.replace(/\/\/ <<<EVAL-REQUIRED-FIELDS[\s\S]*?reviewIncomplete: \[\],\n\s*\}\n\}\n/, '');
  check('W-G6b buoc go guard THUC SU doi file', stripped.length < src.length - 800, `delta=${src.length - stripped.length}`);
  const preWF = path.join(mkdtempSync(path.join(os.tmpdir(), 'av-preguard-')), 'acceptance-verify.js');
  writeFileSync(preWF, stripped);
  const typo = { id: 'E2t', criterion: 'AC-2', executor: 'judgement', question: 'typo', inputs: ['/a.md'] };
  const { result: pre } = await runWorkflow(preWF, baseArgs({ evals: [...baseArgs().evals, typo] }), responder());
  check('W-G6b ban truoc guard: eval typo bi bo roi im lang, verdict PASS', pre.verdict === 'PASS', pre.verdict);
  check('W-G6b ban truoc guard: blocked rong', (pre.blocked || []).length === 0, JSON.stringify(pre.blocked));
  check('W-G6b ban truoc guard: failedEvals rong', (pre.failedEvals || []).length === 0, JSON.stringify(pre.failedEvals));
}

console.log('W-G7 prompt hoi dong chan tu-cuu + dump chinh danh');
{
  const { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } = await import('node:fs');
  const OUT = path.join(HERE, '..', '..', '_acceptance', 'judgment-question-guard', 'evidence', 'judge-prompt.txt');
  if (existsSync(OUT)) rmSync(OUT);
  const jOK2 = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?', inputs: ['/repo/a.md', '/repo/b.md'] };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, jOK2] }), responder());
  const jp = byLabel(calls, 'judge:')[0].prompt;
  // Luat phai neo vao DANH SACH (quan he), khong vao loai file — xem W-G7b cho
  // phep do quan he day du. Assert o day chi ghim rang luat CO mat va dong.
  check('W-G7 prompt co luat danh sach dong', /CHI duoc doc/.test(jp) && /Danh sach do la DAY DU/.test(jp), jp.slice(0, 240));
  check('W-G7 prompt: thieu can cu -> UNCERTAIN, khong phai di tim file khac', /ly do tra UNCERTAIN/.test(jp) && /tu cuu/.test(jp), 'thieu ve tu-cuu');
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, jp);
  check('W-G7 dump duoc sinh trong chinh lan chay', existsSync(OUT));
  check('W-G7 dump BANG DUNG prompt cua lan chay', readFileSync(OUT, 'utf8') === jp);
  check('W-G7 dump chua id eval + inputs cua lan chay', /E9/.test(jp) && /\/repo\/a\.md/.test(jp) && /\/repo\/b\.md/.test(jp), 'thieu id hoac inputs');
}

console.log('W-G7b luat doc theo QUAN HE, khong theo loai file (S4-r1 finding)');
{
  // Round 1 bat: cau cam liet ke "contract.md, evals.yaml, design doc, source
  // code deu NGOAI danh sach" — nhung do CHINH LA input that cua kit
  // (_acceptance/cross-feature-claim-index/evals.yaml:114-131 khai design doc +
  // contract.md lam inputs; E11 co design doc la input DUY NHAT). Judge nhan hai
  // chi dan nguoc nhau ve CUNG mot file → tuan cau cam → tra UNCERTAIN.
  // W-G7 chi grep su CO MAT cua cau cam nen khong the bat lop nay.
  const declared = ['/repo/_acceptance/x/contract.md', '/repo/docs/superpowers/specs/y-design.md', '/repo/_acceptance/x/evals.yaml'];
  const e = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?', inputs: declared };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, e] }), responder());
  const jp = byLabel(calls, 'judge:')[0].prompt;
  // Tach dong "Input:" ra; phan CON LAI khong duoc nhac ten file nao da khai.
  const inputLine = jp.split('\n').find(l => l.startsWith('Input:')) || '';
  check('W-G7b dong Input: liet ke du ca 3 file da khai', declared.every(p => inputLine.includes(p)), inputLine);
  const outside = jp.split('\n').filter(l => !l.startsWith('Input:')).join('\n');
  for (const p of declared) {
    const base = p.split('/').pop();
    check(`W-G7b phan ngoai dong Input KHONG nhac "${base}"`, !outside.includes(base), outside.slice(0, 300));
  }
  check('W-G7b cau cam neo vao DANH SACH chu khong vao loai file', /dong "Input:"|danh sach/i.test(outside), outside.slice(0, 200));
}

console.log('W-G7c executor trung ten khoa prototype -> BLOCKED, KHONG nem TypeError');
{
  for (const x of ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf']) {
    const e = { id: 'EX', criterion: 'AC-9', executor: x, question: 'q' };
    let result, threw = null;
    try { ({ result } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, e] }), responder())); }
    catch (err) { threw = String(err && err.message); }
    check(`W-G7c executor "${x}" KHONG nem loi`, threw === null, threw || '');
    check(`W-G7c executor "${x}" -> BLOCKED neu ten eval`, !!result && result.verdict === 'BLOCKED' && /EX/.test(result.blocked[0].reason), threw || (result && result.verdict));
  }
}

console.log('W-G7d round toan judgment khong khai inputs: thong diep NOI DUNG SU THAT');
{
  const j = { id: 'J1', criterion: 'AC-1', executor: 'judgment', question: 'q' };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [j], suiteCommands: [] }), responder());
  check('W-G7d BLOCKED', result.verdict === 'BLOCKED', result.verdict);
  const r = result.blocked[0].reason;
  check('W-G7d KHONG noi sai "khong co judgment"', !/khong co eval may va khong co judgment/.test(r), r);
  check('W-G7d neu dich danh eval judgment va ly do that', /J1/.test(r) && /khong khai inputs/.test(r), r);
}

console.log('W-G8 ton kho that: moi _acceptance/*/evals.yaml qua bang RUT TU MARKER');
{
  const { readFileSync, readdirSync, existsSync, mkdtempSync, writeFileSync, cpSync } = await import('node:fs');
  const os = await import('node:os');
  const ROOT = path.join(HERE, '..', '..');
  const src = readFileSync(WF, 'utf8');
  // Bang phai RUT TU MARKER, khong chep tay sang test — chep tay la hai ben troi
  // khoi nhau ma van xanh (hinh dang (3) trong 4 hinh dang da dam, CLAUDE.md).
  const m = src.match(/\/\/ <<<EVAL-REQUIRED-FIELDS\n([\s\S]*?)\/\/ EVAL-REQUIRED-FIELDS>>>/);
  check('W-G8 rut duoc bang tu marker', !!m, 'marker khong khop — bang khong con o mot cho co dau moc');
  // Rut CA BA (bang + hai vi tu) roi ap Y NGUYEN. Round 1 bat: ban truoc chi
  // kiem `_k.has(fl)` cho field mang trong khi guard that dung badStrArray —
  // phep do yeu hon chinh thu no do, nen `steps: []` se XANH o day ma BLOCKED
  // o lan chay that.
  const { EVAL_REQUIRED: TABLE, isBlankStr, badStrArray, badInputsShape, isUngroundedInputs } = new Function(
    `${m[1]}; return { EVAL_REQUIRED, isBlankStr, badStrArray, badInputsShape, isUngroundedInputs };`)();
  check('W-G8 bang co du 4 executor', Object.keys(TABLE).sort().join(',') === 'judgment,script,test,ui-check', Object.keys(TABLE).join(','));
  check('W-G8 rut duoc CA BON vi tu tu marker', [isBlankStr, badStrArray, badInputsShape, isUngroundedInputs].every(f => typeof f === 'function'));
  // sanity: vi tu rut ra phai that su phan biet, khong phai ham luon-true
  check('W-G8 vi tu rut ra co rang', isBlankStr('  ') && !isBlankStr('x') && badStrArray([]) && badStrArray(['']) && !badStrArray(['a']));
  check('W-G8 vi tu inputs co rang + phan biet dung HAI muc nang',
    // hard-shape: sai kieu HOAC phan tu rong; vang/rong KHONG phai hard
    badInputsShape('x') && badInputsShape(['  ']) && !badInputsShape(undefined) && !badInputsShape([]) && !badInputsShape(['/a.md'])
    // ungrounded: vang HOAC rong; mang co phan tu rong KHONG phai ungrounded (no la hard)
    && isUngroundedInputs(undefined) && isUngroundedInputs([]) && !isUngroundedInputs(['  ']) && !isUngroundedInputs(['/a.md']));

  // Parser doc duoc: scalar mot dong, list inline [a, b], list gach dau dong,
  // va block scalar (`key: >` / `key: |`) — thieu ba dang sau thi field co that
  // bi doc thanh rong va phep do bao dong gia.
  const parseEvals = (file) => {
    const out = []; let cur = null, listKey = null, blockKey = null, blockInd = 0;
    for (const raw of readFileSync(file, 'utf8').split('\n')) {
      const line = raw.replace(/\s+$/, '');
      const ind = line.length - line.replace(/^\s*/, '').length;
      if (blockKey) {
        if (line.trim() && ind >= blockInd) { cur[blockKey] += (cur[blockKey] ? ' ' : '') + line.trim(); continue; }
        blockKey = null;
      }
      if (listKey) {
        // Dong trong / comment KHONG dong danh sach: evals.yaml that co comment
        // xen giua cac muc (design-pass-skill/E15) — dong som la bao dong gia
        // "eval khong khai inputs" trong khi no khai 3 file.
        if (!line.trim() || /^\s*#/.test(line)) continue;
        const it = line.match(/^\s+-\s+(.*)$/);
        if (it && !/^\s*-\s*id:/.test(line)) { cur[listKey].push(it[1].trim().replace(/^["']|["']$/g, '')); continue; }
        listKey = null;
      }
      const idM = line.match(/^\s*-\s*id:\s*(.+)$/);
      if (idM) { if (cur) out.push(cur); cur = { id: idM[1].trim(), _k: new Set(['id']) }; continue; }
      if (!cur) continue;
      const kv = line.match(/^\s{2,}([a-z_]+):\s*(.*)$/);
      if (!kv) continue;
      const [, k, v] = kv;
      cur._k.add(k);
      if (v === '>' || v === '|' || v === '>-' || v === '|-') { cur[k] = ''; blockKey = k; blockInd = ind + 1; continue; }
      if (v === '') { cur[k] = []; listKey = k; continue; }
      const inline = v.match(/^\[(.*)\]$/);
      cur[k] = inline
        ? inline[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
        : v.trim().replace(/^["']|["']$/g, '');
    }
    if (cur) out.push(cur);
    return out;
  };
  const scan = (dir) => {
    const hard = [], soft = [];
    let files = 0;
    for (const slug of readdirSync(dir)) {
      const f = path.join(dir, slug, 'evals.yaml');
      if (!existsSync(f)) continue;
      files++;
      for (const e of parseEvals(f)) {
        if (!Object.prototype.hasOwnProperty.call(TABLE, e.executor)) { hard.push(`${slug}/${e.id}: executor`); continue; }
        const spec = TABLE[e.executor];
        for (const fl of spec.str) if (isBlankStr(e[fl])) hard.push(`${slug}/${e.id}: ${fl}`);
        for (const fl of spec.arr) if (badStrArray(e[fl])) hard.push(`${slug}/${e.id}: ${fl}`);
        // Dung DUNG hai vi tu cua engine — ban truoc chep tay va lech CA HAI
        // chieu: hard bo qua ve phan-tu-rong, soft dung badStrArray (rong hon
        // isUngroundedInputs) nen `inputs: ['  ']` roi nham vao soft va assert
        // "0 ca chan cung" van xanh trong khi lan chay that BLOCKED.
        if (e.executor === 'judgment' && badInputsShape(e.inputs)) hard.push(`${slug}/${e.id}: inputs`);
        else if (e.executor === 'judgment' && isUngroundedInputs(e.inputs)) soft.push(`${slug}/${e.id}`);
      }
    }
    return { hard, soft, files };
  };
  const AC = path.join(ROOT, '_acceptance');
  const { hard, soft, files } = scan(AC);
  check('W-G8 sanity: quet duoc it nhat 10 workspace co evals.yaml', files >= 10, String(files));
  check('W-G8 0 eval bi chan cung tren ton kho that', hard.length === 0, hard.join(' | '));
  check('W-G8 ca ha UNCERTAIN dung bang danh sach mien tru da khai o Notes',
    soft.slice().sort().join(',') === 'gate-card-ac-visibility/E11,gate-card-ac-visibility/E12', soft.join(','));

  // dot bien: tiem field rong vao BAN SAO sinh trong chinh lan chay -> phai do
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'inv-'));
  cpSync(AC, path.join(tmp, '_acceptance'), { recursive: true });
  const victim = path.join(tmp, '_acceptance', 'judgment-question-guard', 'evals.yaml');
  const before = readFileSync(victim, 'utf8');
  const after = before.replace(/^    criterion: AC-1$/m, '    criterion: ');
  check('W-G8 dot bien: buoc tiem THUC SU doi file', after !== before, 'khong tiem duoc — regex khong khop');
  writeFileSync(victim, after);
  const mut = scan(path.join(tmp, '_acceptance'));
  check('W-G8 dot bien: ban tiem field rong phai DO', mut.hard.length === 1, mut.hard.join(' | '));
  check('W-G8 dot bien: neu dung slug + id + field', /^judgment-question-guard\/E1: criterion$/.test(mut.hard[0] || ''), mut.hard[0]);

  // Dot bien 2 (S4-r2 finding): muc list `inputs` RONG phai vao HARD, khong
  // duoc roi vao soft. Ban truoc chep tay vi tu nen ca nay xanh o phep do ma
  // BLOCKED o lan chay that — assert "0 ca chan cung" thanh vo nghia.
  const tmp2 = mkdtempSync(path.join(os.tmpdir(), 'inv2-'));
  cpSync(AC, path.join(tmp2, '_acceptance'), { recursive: true });
  const v2 = path.join(tmp2, '_acceptance', 'judgment-question-guard', 'evals.yaml');
  const b2 = readFileSync(v2, 'utf8');
  const a2 = b2.replace(/^      - _acceptance\/judgment-question-guard\/evidence\/judge-prompt\.txt$/m, '      - "  "');
  check('W-G8 dot bien 2: buoc tiem THUC SU doi file', a2 !== b2, 'regex khong khop muc inputs');
  writeFileSync(v2, a2);
  const mut2 = scan(path.join(tmp2, '_acceptance'));
  check('W-G8 dot bien 2: muc inputs rong vao HARD (nhu engine), khong vao soft',
    mut2.hard.some(h => /judgment-question-guard\/E10: inputs/.test(h)) && !mut2.soft.some(s => /judgment-question-guard\/E10/.test(s)),
    `hard=${mut2.hard.join('|')} soft=${mut2.soft.join('|')}`);
}

console.log('DV6 invokedSha: sha chảy vào TỪNG dòng run-log; vắng args → không field, không crash (AC-6)');
{
  const SHA = 'c'.repeat(40);
  const { result } = await runWorkflow(WF, baseArgs({ invokedSha: SHA }), responder());
  check('DV6 verdict vẫn PASS khi có invokedSha', result.verdict === 'PASS', result.verdict);
  const lines = result.runLog.map(l => JSON.parse(l));
  check('DV6 MỌI dòng run-log mang sha đúng (eval + baseline memo)', lines.length > 0 && lines.every(l => l.sha === SHA),
    JSON.stringify(lines.map(l => ({ evalId: l.evalId, kind: l.kind, sha: l.sha }))));
  const { result: r2 } = await runWorkflow(WF, baseArgs(), responder());
  check('DV6 vắng invokedSha → verdict PASS, không crash', r2.verdict === 'PASS', r2.verdict);
  const lines2 = r2.runLog.map(l => JSON.parse(l));
  check('DV6 vắng invokedSha → KHÔNG dòng nào có key sha (không phải null)', lines2.every(l => !('sha' in l)),
    JSON.stringify(lines2.map(l => Object.keys(l))));
}

// ── MM3/MM4/MM5 (matrix-measure-law): finder thứ 3 `measurement` ────────────
// PIN + phép đo ba-chiều sống ở measure-pins.mjs (dùng chung với MM7).

console.log('MM3 finder measurement: label + pin ba-chiều (AC-3)');
{
  const { result, calls } = await runWorkflow(WF, triArgs(), triResp({ findings: [], triage: [] }));
  const mCall = calls.find(c => c.label === 'review:measurement');
  check('MM3 fan-out có label review:measurement', !!mCall, calls.map(c => c.label).join('|'));
  const srcText = readFileSync(WF, 'utf8');
  const three = measureShapes(srcText, mCall ? mCall.prompt : '');
  check('MM3 ba-chiều pin↔const↔prompt khớp từng phần tử', three.ok, three.why || '');
  check('MM3 prompt có ranh giới high-confidence + khoanh vùng phép đo', !!mCall && /high-confidence/.test(mCall.prompt) && /KIEM THU|kiem thu/i.test(mCall.prompt));
  check('MM3 đối chứng dương: đủ 3 reviewer (2 cũ còn nguyên)', ['review:conventions', 'review:bugs'].every(k => calls.some(c => c.label === k)), calls.filter(c => c.label.startsWith('review:')).map(c => c.label).join('|'));
  check('MM3 run sạch vẫn PASS', result.verdict === 'PASS', result.verdict);
}

console.log('MM4 finding của lens đi đường refute→triage chuẩn, không đường tắt (AC-4)');
{
  const F_M = { title: 'điểm-case đội lốt quét-lớp', file: 'tests/x.test.mjs', line: 5, severity: 'high', detail: 'tuyên quét 5 nhánh, assert 1' };
  const respOOC = responder({
    'review:measurement': { findings: [F_M] },
    'review:': { findings: [] },
    'refute:': { refuted: false, reason: 'thật' },
    'triage': { triaged: [{ title: F_M.title, file: F_M.file, inContract: false, acRef: '', rationale: 'ngoài scope', proposal: 'known-limits' }] },
  });
  const { result } = await runWorkflow(WF, triArgs(), respOOC);
  check('MM4 finding sống qua refute → vào triaged', (result.triaged || []).some(t => t.title === F_M.title));
  check('MM4 out-of-contract → KHÔNG vào rejectFindings (về Cổng 2)', !(result.rejectFindings || []).some(f => f.title === F_M.title));
  const respRefuted = responder({
    'review:measurement': { findings: [F_M] },
    'review:': { findings: [] },
    'refute:': { refuted: true, reason: 'không tái hiện được' },
    'triage': { triaged: [] },
  });
  const { result: r2 } = await runWorkflow(WF, triArgs(), respRefuted);
  check('MM4 nhánh 2: bị refute → biến mất khỏi confirmedFindings', !(r2.confirmedFindings || []).some(f => f.title === F_M.title));
}

console.log('MM5 finder measurement chết → reviewIncomplete, không im lặng (AC-5)');
{
  const respDead = responder({
    'review:measurement': () => { throw new Error('finder chet'); },
    'review:': { findings: [] },
    'triage': { triaged: [] },
  });
  const { result } = await runWorkflow(WF, triArgs(), respDead);
  check('MM5 reviewIncomplete chứa measurement', (result.reviewIncomplete || []).includes('measurement'), JSON.stringify(result.reviewIncomplete));
  const { result: r2 } = await runWorkflow(WF, triArgs(), triResp({ findings: [], triage: [] }));
  check('MM5 đối chứng dương: finder sống → không nằm trong reviewIncomplete', !(r2.reviewIncomplete || []).includes('measurement'));
}

// ── JR1/JR2/JR3 (judge-required-evidence): bằng-chứng-thiếu chảy judge→memo ──
// Stub SINH TỪ VERDICT_SCHEMA đọc từ source (round-trip writer thật — gap-probe
// P1-1 của feature): schema đổi khuôn thì stub đổi theo, test không tự dựng
// khuôn bên đọc.
const SRC_TEXT = readFileSync(WF, 'utf8');
const MISSING_MARK = '(judge không nêu bằng-chứng-thiếu)';
function stubFromSchema(over = {}) {
  const m = SRC_TEXT.match(/const VERDICT_SCHEMA = \{[\s\S]*?\n\}/);
  if (!m) throw new Error('không thấy VERDICT_SCHEMA trong source');
  const props = [...m[0].matchAll(/^    (\w+):/gm)].map(x => x[1]);
  const base = {};
  for (const p of props) {
    if (p === 'verdict') base[p] = 'FAIL';
    else if (p === 'rationale') base[p] = 'thiếu căn cứ X';
    else if (p === 'required_evidence') base[p] = ['ảnh chụp state sau bước 2 — lấy bằng capture.ui', 'log exit của lệnh migrate — chạy config:executors.test.api'];
    else base[p] = 'x';
  }
  return { ...base, ...over };
}
const judgeArgs = (ih = 'ih-' + 'a'.repeat(60)) => baseArgs({
  evals: [
    { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' },
    { id: 'EJ', criterion: 'AC-2', executor: 'judgment', runs: 3, inputs: ['/repo/_acceptance/demo/contract.md'], question: 'ổn chưa?', inputsHash: ih },
  ],
  suiteCommands: [],
});

console.log('JR1 judge FAIL kèm required_evidence → memo panel mang danh sách (AC-1)');
{
  const stub = stubFromSchema();
  const { result, calls } = await runWorkflow(WF, judgeArgs(), responder({ 'judge:': stub }));
  check('JR1 schema có field required_evidence (stub sinh được từ schema)', 'required_evidence' in stub, Object.keys(stub).join(','));
  const jp = calls.find(c => c.label.startsWith('judge:EJ'));
  check('JR1 prompt judge có quy định không-PASS phải kèm bằng-chứng-thiếu', !!jp && /required_evidence/.test(jp.prompt) && /(FAIL|UNCERTAIN)/.test(jp.prompt));
  const memo = result.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'panel' && l.evalId === 'EJ');
  check('JR1 memo panel: từng vote mang danh sách đúng từng mục (so sâu)',
    !!memo && memo.votes.length === 3 && memo.votes.every(v => JSON.stringify(v.required_evidence) === JSON.stringify(stub.required_evidence)),
    memo ? JSON.stringify(memo.votes[0]) : 'no memo');
  const stubPass = stubFromSchema({ verdict: 'PASS' });
  delete stubPass.required_evidence;
  const { result: r2 } = await runWorkflow(WF, judgeArgs(), responder({ 'judge:': stubPass }));
  const memo2 = r2.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'panel' && l.evalId === 'EJ');
  check('JR1 đối chứng dương: PASS không đòi field, memo không có dấu thiếu',
    !!memo2 && memo2.votes.every(v => !(v.required_evidence || []).includes(MISSING_MARK)), memo2 ? JSON.stringify(memo2.votes) : 'no memo');
}

console.log('JR2 judge không-PASS bỏ trống → dấu thiếu, không bịa hộ (AC-2)');
{
  const stubEmpty = stubFromSchema({ verdict: 'UNCERTAIN' });
  delete stubEmpty.required_evidence;
  const { result, calls } = await runWorkflow(WF, judgeArgs(), responder({ 'judge:': stubEmpty }));
  const memo = result.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'panel' && l.evalId === 'EJ');
  check('JR2 memo mang ĐÚNG dấu thiếu ghim, không danh sách bịa',
    !!memo && memo.votes.every(v => JSON.stringify(v.required_evidence) === JSON.stringify([MISSING_MARK])),
    memo ? JSON.stringify(memo.votes[0]) : 'no memo');
  const synth = calls.find(c => c.label === 'synthesize:report');
  check('JR2 synthesize nhận panels có dấu thiếu để render theo khuôn template', !!synth && synth.prompt.includes(MISSING_MARK));
}

console.log('JR3 carry P3 giữ nguyên danh sách per-vote (AC-3)');
{
  const stub = stubFromSchema();
  const ih = 'ih-' + 'b'.repeat(60);
  const { result: rN } = await runWorkflow(WF, judgeArgs(ih), responder({ 'judge:': stub }));
  const memoN = rN.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'panel' && l.evalId === 'EJ');
  check('JR3 round N ghi memo có danh sách', !!memoN && memoN.votes[0].required_evidence.length === 2);
  // round N+1: carried panel RÚT TỪ memo THẬT round N (không tự dựng)
  const { result: rN1 } = await runWorkflow(WF, judgeArgs(ih), responder({}), );
  void rN1;
  const carriedArgs = judgeArgs(ih);
  carriedArgs.carriedPanels = [{ evalId: 'EJ', proposal: memoN.proposal, votes: memoN.votes, fromRound: 1, inputsHash: ih }];
  const { result: rC, calls: cC } = await runWorkflow(WF, carriedArgs, responder({}));
  check('JR3 eval carried KHÔNG bị chấm tươi lại', !cC.some(c => c.label.startsWith('judge:EJ')), cC.map(c => c.label).join('|'));
  const memoC = rC.runLog.map(l => JSON.parse(l)).find(l => l.kind === 'panel' && l.evalId === 'EJ');
  check('JR3 carried panel + memo round sau GIỮ NGUYÊN danh sách từng mục (so sâu)',
    !!memoC && JSON.stringify(memoC.votes.map(v => v.required_evidence)) === JSON.stringify(memoN.votes.map(v => v.required_evidence)),
    memoC ? JSON.stringify(memoC.votes[0]) : 'no memo');
  const panelC = (rC.panels || []).find(p => p.evalId === 'EJ');
  check('JR3 result.panels có mục carried (bản rút gọn — danh sách sống ở memo)', !!panelC && panelC.carried === true, JSON.stringify(panelC || {}));
}

// ── W25: TOOL-KILL-RULE — MỘT nguồn ở acceptance-gate, workflow NHẬN qua args ──
// Vấp thật release-2-2-0 S4 r5: verifier không truyền timeout → công cụ giết
// suite ở 118s → exit 1 của CÔNG CỤ bị đọc thành exit của LỆNH → REJECT giả.
// Hồ sơ tool-kill-duong-doc-lap: luật dời về file nguồn của plugin acceptance-gate
// (skills/acceptance/references/tool-kill-rule.md) để đường VERIFY độc lập cùng
// đọc; workflow không chép câu luật — nhận nguyên văn file qua args.toolKillRule
// và rút khối marker. Test rút RULE từ CHÍNH file nguồn (round-trip từ writer
// thật, tách theo DÒNG — không regex, gap-probe F3), assert từng dòng có mặt.
// Không gian lane rút từ chính lượt chạy: mọi agent có schema khai mã thoát
// (exitCode / results[].baselineExit) phải mang luật — không danh sách viết
// cứng (Known limit 4 hồ sơ trước); mutant/lane vẫn cô lập từng lane.
{
  const src = readFileSync(WF, 'utf8');
  const RULE_LINES = TOOL_KILL_RULE_LINES;
  const hasRule = (prompt) => RULE_LINES.length > 0 && RULE_LINES.every(l => prompt.includes(l));
  check('W25 rule rut tu file nguon', RULE_LINES.length > 0 && RULE_LINES.some(l => l.includes('600000')) && RULE_LINES.some(l => l.includes('killedByTool')) && RULE_LINES.some(l => l.includes('bi cong cu giet')), RULE_LINES.length ? RULE_LINES[0].slice(0, 60) : '(khoi rong)');
  // Đặc trưng của luật (câu mở đầu) rút từ file — không literal trong test (gap-probe F4).
  const SIGNATURE = RULE_LINES[0].split(':')[0];
  check('W25 JS khong con ban chep', SIGNATURE.length > 8 && !src.includes(SIGNATURE), SIGNATURE);

  const tkArgs = {
    slug: 'tk', round: 1, riskTier: 'T2',
    evals: [
      { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: './suite.sh', ref: 'config:executors.test.x', expected: 'x' },
      { id: 'E5', criterion: 'AC-2', executor: 'ui-check', expected: 'trang len', steps: ['mo trang'] },
    ],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p.md', templatePath: '/t.md', contractPath: '/c.md',
    invokedAt: '2026-08-18T00:00:00Z',
  };
  const tkRespond = (call) => {
    if (call.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
    if (call.label.startsWith('ui:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false, screenshotPath: 'e.html', observed: 'thay trang len dung expected', networkObserved: 'n-a (driver)' };
    if (call.label === 'baseline:diffBase') return { results: [{ cmd: './suite.sh', baselineExit: 1, cannotRun: false }] };
    if (call.label.startsWith('review:')) return { findings: [] };
    if (call.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (call.label === 'synthesize:report') return { report: 'r', findings: 'f' };
    return null;
  };
  const { calls, result } = await runWorkflow(WF, tkArgs, tkRespond);
  check('W25 lane chay binh thuong khi co toolKillRule', result.verdict !== 'BLOCKED', result.verdict);
  check('W25 machine prompt chua TOOL-KILL-RULE', hasRule(byLabel(calls, 'machine:')[0].prompt));
  check('W25 ui prompt chua TOOL-KILL-RULE', hasRule(byLabel(calls, 'ui:')[0].prompt));
  check('W25 baseline prompt chua TOOL-KILL-RULE', hasRule(byLabel(calls, 'baseline:')[0].prompt));
  const mS = byLabel(calls, 'machine:')[0].opts.schema, uS = byLabel(calls, 'ui:')[0].opts.schema,
    bS = byLabel(calls, 'baseline:')[0].opts.schema.properties.results.items;
  check('W25 schema killedByTool',
    [mS, uS, bS].every(s => s.properties.killedByTool && s.properties.killedByTool.type === 'boolean'
      && !(s.required || []).includes('killedByTool')));

  // Không gian lane rút từ LƯỢT CHẠY: agent nào có schema khai mã thoát là agent chạy lệnh dài.
  const declaresExit = (schema) => !!(schema && schema.properties && (schema.properties.exitCode
    || (schema.properties.results && schema.properties.results.items && schema.properties.results.items.properties && schema.properties.results.items.properties.baselineExit)));
  const exitAgents = calls.filter(c => declaresExit(c.opts && c.opts.schema));
  const laneOf = (c) => c.label.split(':')[0];
  const lanes = [...new Set(exitAgents.map(laneOf))];
  const TOK = '${TOOL_KILL_RULE}';
  const idxs = [];
  for (let i = src.indexOf(TOK); i !== -1; i = src.indexOf(TOK, i + 1)) idxs.push(i);
  check(`W25 moi agent co schema ma-thoat deu mang rule (${lanes.length} lane)`,
    exitAgents.length >= 3 && exitAgents.every(c => hasRule(c.prompt)) && idxs.length === lanes.length,
    `agents=${exitAgents.length} lanes=${lanes.join(',')} noi-suy=${idxs.length}`);
  // Mutant/lane: xoá đúng MỘT lượt nội suy → chỉ lane đó mất luật. Ánh xạ nội suy→lane
  // suy từ lượt chạy bản đột biến (lane nào mất rule), rồi kiểm cô lập.
  const seenLane = new Set();
  for (let k = 0; k < idxs.length; k++) {
    const mutated = src.slice(0, idxs[k]) + src.slice(idxs[k] + TOK.length);
    const { calls: mc } = await runWorkflow(WF, tkArgs, tkRespond, mutated);
    const mExit = mc.filter(c => declaresExit(c.opts && c.opts.schema));
    const lost = [...new Set(mExit.filter(c => !hasRule(c.prompt)).map(laneOf))];
    const lane = lost.length === 1 ? lost[0] : `(${lost.join('+') || 'khong lane nao'})`;
    seenLane.add(lane);
    check(`W25 mutant ${lane}: xoa rule -> chi ${lane} do`,
      lost.length === 1 && lanes.includes(lane) && mExit.filter(c => laneOf(c) !== lane).every(c => hasRule(c.prompt)));
  }
  check('W25 so mutant = so lane, moi lane mot mutant', seenLane.size === lanes.length && lanes.every(l => seenLane.has(l)), `${[...seenLane].join(',')} vs ${lanes.join(',')}`);

  // Đường thiếu args: KHÔNG chạy không luật — BLOCKED có tên (không fallback chuỗi cứng).
  const rMissing = await runWorkflow(WF, { ...tkArgs, toolKillRule: '' }, tkRespond);
  check('W25 thieu toolKillRule -> BLOCKED (args)',
    rMissing.result.verdict === 'BLOCKED' && rMissing.result.blocked[0].cmd === '(args)'
      && /tool-kill-rule\.md/.test(rMissing.result.blocked[0].reason) && /TOOL-KILL-RULE/.test(rMissing.result.blocked[0].reason)
      && rMissing.calls.length === 0,
    JSON.stringify(rMissing.result.blocked));
  const rNoMarker = await runWorkflow(WF, { ...tkArgs, toolKillRule: TOOL_KILL_RULE_SRC.replace(/<<<TOOL-KILL-RULE/g, 'XXX') }, tkRespond);
  check('W25 toolKillRule khong marker -> BLOCKED (args)',
    rNoMarker.result.verdict === 'BLOCKED' && rNoMarker.result.blocked[0].cmd === '(args)' && rNoMarker.calls.length === 0,
    rNoMarker.result.verdict);
  // Đối chứng dương của phép rút: file nguồn thật đủ khối → không BLOCKED (đã kiểm ở trên).
}

// ── W26: routing killedByTool ⇒ BLOCKED (2 lane × 2 nhánh reason) + đối chứng ─
// CÙNG một fixture sự cố (exit 1, output cắt, không dòng tổng kết) cho mọi
// chiều — đối chứng dương đổi ĐÚNG MỘT biến (killedByTool), outputTail giữ
// nguyên, để kết luận không lẫn hai nguyên nhân. killedByTool=true mà
// cannotRun=false là ĐÚNG hình dạng đã xảy ra: JS không tin một lời khai đơn lẻ.
// Ma trận lane cho routing = ma trận lane cho prompt (W25): machine · ui ·
// baseline (baseline ở W27) — thiếu một lane thì xoá normKill lane đó vẫn xanh.
{
  const mkArgs = () => ({
    slug: 'tk', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'bash tests/plugins/run-tests.sh', ref: 'config:executors.test.plugins', expected: 'x' }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p.md', templatePath: '/t.md', contractPath: '/c.md', invokedAt: '2026-08-18T00:00:00Z',
  });
  const incident = (extra) => (call) => {
    if (call.label.startsWith('machine:')) return {
      exitCode: 1, outputTail: 'RUN: P188 executor-key hop nhat…\n[output bi cat o 10000 ky tu]',
      runId: '', cannotRun: false, ...extra,
    };
    if (call.label === 'baseline:diffBase') return { results: [{ cmd: 'bash tests/plugins/run-tests.sh', baselineExit: 0, cannotRun: false }] };
    if (call.label.startsWith('review:')) return { findings: [] };
    if (call.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (call.label === 'synthesize:report') return { report: 'r', findings: 'f' };
    return null;
  };
  const rA = await runWorkflow(WF, mkArgs(), incident({ killedByTool: true, reason: 'bi cong cu giet o 118 giay' }));
  check('W26 killedByTool -> BLOCKED',
    rA.result.verdict === 'BLOCKED' && rA.result.failedEvals.length === 0
    && rA.result.failedCommands.length === 0 && /bi cong cu giet/.test((rA.result.blocked[0] || {}).reason),
    rA.result.verdict);
  check('W26 reason agent giu nguyen van', (rA.result.blocked[0] || {}).reason === 'bi cong cu giet o 118 giay', (rA.result.blocked[0] || {}).reason);
  const lg = JSON.parse(rA.result.runLog[0] || '{}');
  check('W26 run-log ghi cannot_run, khong ghi exit gia', lg.cannot_run === true && lg.exit_code === null, rA.result.runLog[0]);
  const rB = await runWorkflow(WF, mkArgs(), incident({ killedByTool: true, reason: '' }));
  check('W26 reason trong -> khuon ghim bi cong cu giet',
    rB.result.verdict === 'BLOCKED' && /bi cong cu giet \(timeout tool\/output cat\)/.test((rB.result.blocked[0] || {}).reason),
    (rB.result.blocked[0] || {}).reason);
  const rC = await runWorkflow(WF, mkArgs(), incident({ killedByTool: false }));
  check('W26 doi chung: exit 1 that -> REJECT',
    rC.result.verdict === 'REJECT' && rC.result.failedEvals.includes('E1'), rC.result.verdict);

  // lane ui: cùng luật, cùng kết cục — không có ca này thì xoá normKill ở lane
  // ui vẫn 100% xanh (finding r2, severity high).
  const uiArgs = () => ({
    slug: 'tk', round: 1, riskTier: 'T2',
    evals: [{ id: 'E5', criterion: 'AC-5', executor: 'ui-check', expected: 'trang len', steps: ['mo trang'] }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p.md', templatePath: '/t.md', contractPath: '/c.md', invokedAt: '2026-08-18T00:00:00Z',
  });
  const uiIncident = (extra) => (call) => {
    if (call.label.startsWith('ui:')) return {
      exitCode: 1, outputTail: 'assert 1 ok\n[output bi cat o 10000 ky tu]', runId: '', cannotRun: false,
      screenshotPath: 'evidence/E5-step1.png', observed: 'thay header dung expected truoc khi bi cat', networkObserved: 'n-a (driver)',
      ...extra,
    };
    if (call.label.startsWith('review:')) return { findings: [] };
    if (call.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (call.label === 'synthesize:report') return { report: 'r', findings: 'f' };
    return null;
  };
  const rU = await runWorkflow(WF, uiArgs(), uiIncident({ killedByTool: true, reason: 'bi cong cu giet o 118 giay' }));
  check('W26 ui killedByTool -> BLOCKED',
    rU.result.verdict === 'BLOCKED' && rU.result.failedEvals.length === 0
    && rU.result.blocked.some(b => b.cmd === 'ui-check:E5' && /bi cong cu giet/.test(b.reason)),
    rU.result.verdict + ' ' + JSON.stringify(rU.result.blocked));
  const rU2 = await runWorkflow(WF, uiArgs(), uiIncident({ killedByTool: false }));
  check('W26 ui doi chung: exit 1 that -> REJECT',
    rU2.result.verdict === 'REJECT' && rU2.result.failedEvals.includes('E5'), rU2.result.verdict);
}

// ── W27: baseline bị giết → n-a, không red giả (fixture đúng khuôn schema) ───
{
  const mkArgs = () => ({
    slug: 'tk', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: './suite.sh', ref: 'config:executors.test.x', expected: 'x' }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p.md', templatePath: '/t.md', contractPath: '/c.md', invokedAt: '2026-08-18T00:00:00Z',
  });
  const respond = (bl) => (call) => {
    if (call.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'Results: 9 passed', runId: '', cannotRun: false };
    if (call.label === 'baseline:diffBase') return { results: [bl] };
    if (call.label.startsWith('review:')) return { findings: [] };
    if (call.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
    if (call.label === 'synthesize:report') return { report: 'r', findings: 'f' };
    return null;
  };
  const rK = await runWorkflow(WF, mkArgs(), respond({ cmd: './suite.sh', baselineExit: 1, cannotRun: false, killedByTool: true }));
  const synthK = byLabel(rK.calls, 'synthesize:report')[0].prompt;
  check('W27 baseline killed -> n-a',
    rK.result.nonDiscriminating.length === 0 && synthK.includes('"baseline":"n-a"') && !synthK.includes('"baseline":"red"'),
    (synthK.match(/"baseline":"[a-z-]*"/) || [])[0]);
  const rR = await runWorkflow(WF, mkArgs(), respond({ cmd: './suite.sh', baselineExit: 1, cannotRun: false }));
  const synthR = byLabel(rR.calls, 'synthesize:report')[0].prompt;
  check('W27 doi chung: baseline exit 1 that -> red',
    rR.result.nonDiscriminating.length === 0 && synthR.includes('"baseline":"red"'),
    (synthR.match(/"baseline":"[a-z-]*"/) || [])[0]);
}

console.log('W28 va cham ten suite: hai lenh KHAC nhau khong duoc dung chung mot ma');
{
  // Ba bien the va cham cua bo duc ten (ma tran tron ven — so assert = so o):
  //   a) tien to thu muc:  cd apps/web && pnpm build   vs  cd apps/api && pnpm build
  //   b) khac co:          pnpm test:unit --project a  vs  ... --project b
  //   c) trung 40 ky tu dau sau ve sinh (nhanh cat chuoi cua bo duc ten)
  // Cung mot ma cho hai lenh = mot lenh DO co the nap sau lenh XANH ma bo doi
  // chieu van xanh — cung lop false-green voi loi goc.
  const BIEN_THE = [
    { ten: 'tien to thu muc', a: 'cd apps/web && pnpm build', b: 'cd apps/api && pnpm build' },
    { ten: 'khac co', a: 'pnpm test:unit --project a', b: 'pnpm test:unit --project b' },
    { ten: 'trung 40 ky tu dau', a: 'bash tests/integration/regression/run-tests-alpha.sh', b: 'bash tests/integration/regression/run-tests-beta.sh' },
  ];
  for (const bt of BIEN_THE) {
    const { result } = await runWorkflow(WF, baseArgs({ suiteCommands: [bt.a, bt.b] }), responder());
    const suite = result.runLog.map(l => JSON.parse(l)).filter(l => String(l.evalId).startsWith('SUITE-'));
    const idA = (suite.find(l => l.cmd === bt.a) || {}).run_id;
    const idB = (suite.find(l => l.cmd === bt.b) || {}).run_id;
    check(`W28 [${bt.ten}] hai lenh -> hai ma`,
      suite.length === 2 && !!idA && !!idB && idA !== idB,
      `${idA} / ${idB}`);
  }
  // Doi chung duong: khong va cham thi ten GIU NGUYEN (khong hau to), ca W03 cu con song.
  const { result: rk } = await runWorkflow(WF, baseArgs({ suiteCommands: ['npm run build', 'pnpm itest:ci'] }), responder());
  const sk = rk.runLog.map(l => JSON.parse(l)).filter(l => String(l.evalId).startsWith('SUITE-'));
  check('W28 doi chung: khong va cham -> ten khong doi',
    sk.some(l => l.evalId === 'SUITE-build') && sk.some(l => l.evalId === 'SUITE-itest_ci'),
    JSON.stringify(sk.map(l => l.evalId)));
}

console.log('W29 vong: cung mot lenh suite o hai round phai cho hai ma');
{
  const idOf = async (round) => {
    const { result } = await runWorkflow(WF, baseArgs({ round }), responder());
    const l = result.runLog.map(x => JSON.parse(x)).find(x => String(x.evalId).startsWith('SUITE-'));
    return l && l.run_id;
  };
  const r1 = await idOf(1), r2 = await idOf(2);
  // Ma khong mang hau to vong thi ban cham vong sau tro ve duoc luot chay vong
  // truoc — mat dung thu so chay sinh ra de bao dam.
  check('W29 doi round -> doi ma', !!r1 && !!r2 && r1 !== r2, `${r1} / ${r2}`);
}

console.log('W30 ma tran ten: nam hinh dang lenh, ten ghim nguyen van');
{
  const MONG_DOI = [
    ['npm run build', 'SUITE-build'],
    ['pnpm itest:ci', 'SUITE-itest_ci'],
    ['bash tests/hooks/run-tests.sh', 'SUITE-bash_tests_hooks_run_tests_sh'],
    ['cd apps/web && pnpm build', 'SUITE-build'],
    ['pnpm build && pnpm typecheck', 'SUITE-build_typecheck'],
  ];
  for (const [cmd, ten] of MONG_DOI) {
    const { result } = await runWorkflow(WF, baseArgs({ suiteCommands: [cmd] }), responder());
    const l = result.runLog.map(x => JSON.parse(x)).find(x => String(x.evalId).startsWith('SUITE-'));
    check(`W30 ten suy tu lenh: ${cmd}`, l && l.evalId === ten, l && l.evalId);
  }
  check('W30 so assert = so o trong ma tran truc A (5 o o day + 1 o gop lenh o W32)', MONG_DOI.length === 5, String(MONG_DOI.length));
}

console.log('W31 dong suite mang ket qua RIENG: exit that + cannotRun');
{
  const { result: rDo } = await runWorkflow(WF, baseArgs(), responder({
    'machine:npm run build': { exitCode: 3, outputTail: 'build failed', runId: '', cannotRun: false },
  }));
  const lDo = rDo.runLog.map(x => JSON.parse(x)).find(x => String(x.evalId).startsWith('SUITE-'));
  check('W31 suite do -> exit that', lDo && lDo.exit_code === 3, lDo && String(lDo.exit_code));
  const { result: rKhong } = await runWorkflow(WF, baseArgs(), responder({
    'machine:npm run build': { exitCode: 1, outputTail: '', runId: '', cannotRun: true, reason: 'thieu env' },
  }));
  const lK = rKhong.runLog.map(x => JSON.parse(x)).find(x => String(x.evalId).startsWith('SUITE-'));
  // Ghi 0 cho lenh chua tung chay la false-green dung nghia.
  check('W31 cannotRun -> exit_code null + co cannot_run',
    lK && lK.exit_code === null && lK.cannot_run === true,
    lK && `${lK.exit_code} / ${lK.cannot_run}`);
}

console.log('W32 gop lenh: suite trung dung cmd cua mot eval -> khong sinh dong SUITE');
{
  const { result } = await runWorkflow(WF, baseArgs({ suiteCommands: ['pnpm test'] }), responder());
  const lines = result.runLog.map(x => JSON.parse(x));
  check('W32 trung lenh -> khong sinh dong SUITE', lines.every(l => !String(l.evalId).startsWith('SUITE-')), JSON.stringify(lines.map(l => l.evalId)));
  check('W32 so dong = so eval', lines.length === 2, String(lines.length));
}

summary('acceptance-verify');
