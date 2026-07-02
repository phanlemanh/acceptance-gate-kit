// harness.mjs — unit-test harness for the feature-loop Workflow scripts.
//
// Loads the REAL workflow file (no copy, no drift) and executes it in a vm
// realm with faithful stand-ins for the Workflow harness globals:
//   agent()    → records the call, returns the test's canned result
//   parallel() → barrier; a thunk that throws resolves to null (per harness docs)
//   pipeline() → per-item stages (prev, originalItem, index); a throwing stage
//                drops the item to null and skips its remaining stages
//   phase/log  → recorded, side-effect free
// So every PURE decision (dedupe, merge, verdict routing, run-log lines,
// model routing) runs exactly as shipped, with deterministic agent I/O.
//
// Scripts are self-contained by design (the Workflow sandbox has no fs/Date),
// which is why tests load-and-wrap instead of importing functions.

import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export function loadWorkflow(file) {
  const src = readFileSync(file, 'utf8').replace(/^export /m, '');
  return vm.runInNewContext(
    '(async (args, agent, parallel, pipeline, phase, log, budget, workflow) => {\n' + src + '\n})',
    { console },
    { filename: file }
  );
}

// respond(call) → the canned agent result (value, promise, null = dead agent,
// or throw = errored agent). call = { label, prompt, opts }.
export async function runWorkflow(file, args, respond) {
  const calls = [];
  const logs = [];
  const phases = [];

  const agent = async (prompt, opts = {}) => {
    const call = { label: opts.label || '', prompt, opts };
    calls.push(call);
    return await respond(call);
  };
  const parallel = (thunks) =>
    Promise.all(thunks.map(t => Promise.resolve().then(t).catch(() => null)));
  const pipeline = (items, ...stages) =>
    Promise.all(items.map(async (item, idx) => {
      let prev = item;
      for (const s of stages) {
        try { prev = await s(prev, item, idx); } catch { return null; }
      }
      return prev;
    }));
  const phase = (t) => phases.push(t);
  const log = (m) => logs.push(m);
  const budget = { total: null, spent: () => 0, remaining: () => Infinity };
  const workflow = () => { throw new Error('nested workflow() unavailable in tests'); };

  const fn = loadWorkflow(file);
  const result = await fn(args, agent, parallel, pipeline, phase, log, budget, workflow);
  return { result, calls, logs, phases };
}

// ── tiny assertion kit (same output style as the other suites) ──────────────
let PASS = 0;
let FAIL = 0;

export function check(name, cond, detail) {
  if (cond) { console.log(`  PASS: ${name}`); PASS++; }
  else { console.log(`  FAIL: ${name}${detail ? ` (${detail})` : ''}`); FAIL++; }
}

export function summary(suiteName) {
  console.log('');
  console.log(`Results: ${PASS} passed, ${FAIL} failed (${suiteName})`);
  if (FAIL > 0) process.exit(1);
}
