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
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';

// TOOL-KILL-RULE: workflow KHÔNG chép luật, main loop truyền NGUYÊN VĂN file
// nguồn (acceptance-gate) qua args.toolKillRule. Harness đóng vai main loop:
// đọc CHÍNH file nguồn (đường suy từ vị trí harness, không cwd) và cấp mặc định
// khi case không truyền — case muốn đo đường thiếu-args truyền `toolKillRule: ''`.
// Đọc lỗi → THROW (không fallback chuỗi cứng: fallback là bản chép thứ hai và
// làm suite xanh trong khi main loop thật BLOCKED).
export const TOOL_KILL_RULE_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../../skills/acceptance/references/tool-kill-rule.md');
export const TOOL_KILL_RULE_SRC = readFileSync(TOOL_KILL_RULE_FILE, 'utf8');
// Khối luật tách theo DÒNG giữa hai marker (không regex — gap-probe F3): mảng
// dòng không rỗng, để test assert TỪNG dòng có mặt trong prompt.
export const TOOL_KILL_RULE_LINES = (() => {
  const lines = TOOL_KILL_RULE_SRC.split('\n');
  const a = lines.findIndex(l => l.includes('<<<TOOL-KILL-RULE'));
  const b = lines.findIndex(l => l.includes('TOOL-KILL-RULE>>>'));
  if (a === -1 || b === -1 || b <= a) throw new Error(`harness: khong rut duoc marker TOOL-KILL-RULE tu ${TOOL_KILL_RULE_FILE}`);
  return lines.slice(a + 1, b).map(l => l.trim()).filter(Boolean);
})();

// srcOverride: nội dung script ĐÃ mutate (ma trận mutation chạy bản sao trong bộ
// nhớ — không ghi đè file thật, không cần dọn dẹp).
export function loadWorkflow(file, srcOverride) {
  const raw = typeof srcOverride === 'string' ? srcOverride : readFileSync(file, 'utf8');
  const src = raw.replace(/^export /m, '');
  return vm.runInNewContext(
    '(async (args, agent, parallel, pipeline, phase, log, budget, workflow) => {\n' + src + '\n})',
    { console },
    { filename: file }
  );
}

// respond(call) → the canned agent result (value, promise, null = dead agent,
// or throw = errored agent). call = { label, prompt, opts }.
export async function runWorkflow(file, args, respond, srcOverride) {
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

  const fn = loadWorkflow(file, srcOverride);
  const inject = (a) => (a && typeof a === 'object' && !Array.isArray(a) && a.toolKillRule === undefined)
    ? { ...a, toolKillRule: TOOL_KILL_RULE_SRC }
    : a;
  let argsIn = inject(args);
  if (typeof args === 'string') { // JSON-string args (W02): tiêm rồi stringify lại để workflow vẫn tự parse
    try { argsIn = JSON.stringify(inject(JSON.parse(args))); } catch { argsIn = args; }
  }
  const result = await fn(argsIn, agent, parallel, pipeline, phase, log, budget, workflow);
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
