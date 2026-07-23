// Unit tests for feature-loop/scripts/wf-usage.mjs — fixture transcripts pin:
//   U01 dedupe theo message.id (usage snapshot lớn dần → max per field, KHÔNG cộng dồn)
//   U02 label từ tag [wf-label:] + fallback snippet khi prompt không tag
//   U03 totals per model + --md shape
//   U04 --latest chọn run mtime mới nhất (HOME + cwd giả)
//   U05 dir không tồn tại → exit 2
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, '..', '..', 'feature-loop', 'scripts', 'wf-usage.mjs');

let pass = 0, fail = 0;
const check = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  PASS: ${name}`); }
  else { fail++; console.log(`  FAIL: ${name}${extra ? ` (${extra})` : ''}`); }
};

const T = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-usage-'));
process.on('exit', () => fs.rmSync(T, { recursive: true, force: true }));

const line = (o) => JSON.stringify(o) + '\n';
const user = (text, ts) => line({ type: 'user', timestamp: ts, message: { role: 'user', content: text } });
const asst = (id, model, usage, ts) => line({ type: 'assistant', timestamp: ts, message: { id, model, role: 'assistant', usage } });

function mkRun(dir) {
  fs.mkdirSync(dir, { recursive: true });
  // agent A: tagged, 2 API calls — call m1 ghi 3 dòng (snapshot 5 → 5 → 310), call m2 ghi 1 dòng
  fs.writeFileSync(path.join(dir, 'agent-aaaa1111.jsonl'),
    user('[wf-label: exec:Task 1]\nBan thuc thi MOT task...', '2026-07-23T01:00:00.000Z') +
    asst('m1', 'claude-haiku-4-5', { input_tokens: 100, output_tokens: 5, cache_read_input_tokens: 1000 }, '2026-07-23T01:00:05.000Z') +
    asst('m1', 'claude-haiku-4-5', { input_tokens: 100, output_tokens: 5, cache_read_input_tokens: 1000 }, '2026-07-23T01:00:06.000Z') +
    asst('m1', 'claude-haiku-4-5', { input_tokens: 100, output_tokens: 310, cache_read_input_tokens: 1000, cache_creation_input_tokens: 40 }, '2026-07-23T01:00:07.000Z') +
    asst('m2', 'claude-haiku-4-5', { input_tokens: 50, output_tokens: 20, cache_read_input_tokens: 2000 }, '2026-07-23T01:00:30.000Z'));
  // agent B: KHÔNG tag (fallback snippet), model khác, 1 call
  fs.writeFileSync(path.join(dir, 'agent-bbbb2222.jsonl'),
    user('Ban la judge DOC LAP, context sach, lens duy nhat: intent.', '2026-07-23T01:01:00.000Z') +
    asst('m3', 'claude-fable-5', { input_tokens: 10, output_tokens: 40, cache_read_input_tokens: 500 }, '2026-07-23T01:01:09.000Z'));
  fs.writeFileSync(path.join(dir, 'journal.jsonl'), line({ type: 'started', key: 'v2:x', agentId: 'aaaa1111' }));
}

const RUN = path.join(T, 'wf_test-run');
mkRun(RUN);

const runScript = (args, opts = {}) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', ...opts });

console.log('U01 dedupe theo message.id — max per field, không cộng snapshot');
{
  const r = runScript([RUN, '--json']);
  const j = JSON.parse(r.stdout);
  const a = j.agents.find(x => x.agent === 'aaaa1111');
  check('U01 exit 0', r.status === 0, String(r.status));
  check('U01 calls = distinct ids (2, không phải 4 dòng)', a.calls === 2, String(a.calls));
  check('U01 out = 310+20 (max per id), không phải 5+5+310+20', a.out === 330, String(a.out));
  check('U01 in/cache cũng dedupe', a.in === 150 && a.cacheRead === 3000 && a.cacheCreate === 40, JSON.stringify(a));
  check('U01 duration từ timestamps', a.seconds === 30, String(a.seconds));
}

console.log('U02 label: tag [wf-label:] + fallback snippet');
{
  const j = JSON.parse(runScript([RUN, '--json']).stdout);
  const a = j.agents.find(x => x.agent === 'aaaa1111');
  const b = j.agents.find(x => x.agent === 'bbbb2222');
  check('U02 tagged -> label = exec:Task 1', a.label === 'exec:Task 1', a.label);
  check('U02 không tag -> fallback 48 ký tự đầu prompt', b.label.startsWith('Ban la judge DOC LAP') && b.label.length <= 48, b.label);
}

console.log('U03 totals per model + --md shape');
{
  const j = JSON.parse(runScript([RUN, '--json']).stdout);
  check('U03 totalsByModel haiku', j.totalsByModel['claude-haiku-4-5'].out === 330 && j.totalsByModel['claude-haiku-4-5'].agents === 1);
  check('U03 total gộp 2 model', j.total.agents === 2 && j.total.out === 370 && j.total.calls === 3, JSON.stringify(j.total));
  const md = runScript([RUN, '--md', '--title', 'S4 round 1']).stdout;
  check('U03 md có heading title + runId', md.includes('### S4 round 1 — wf_test-run'), md.split('\n')[0]);
  check('U03 md có bảng + dòng model', md.includes('| exec:Task 1 | claude-haiku-4-5 | 2 | 330 |') && md.includes('- **claude-fable-5**: 1 agent'));
}

console.log('U04 --latest chọn run mtime mới nhất (HOME + cwd giả)');
{
  const home = path.join(T, 'home');
  const cwd = path.join(T, 'repo');
  fs.mkdirSync(cwd, { recursive: true });
  // macOS: /var/folders là symlink → process.cwd() của child trả realpath; slug phải tính từ realpath
  const slug = fs.realpathSync(cwd).replace(/[^A-Za-z0-9]/g, '-');
  const old = path.join(home, '.claude', 'projects', slug, 'sess1', 'subagents', 'workflows', 'wf_old');
  const fresh = path.join(home, '.claude', 'projects', slug, 'sess2', 'subagents', 'workflows', 'wf_fresh');
  mkRun(old); mkRun(fresh);
  const past = new Date('2026-01-01T00:00:00Z');
  fs.utimesSync(path.join(old, 'journal.jsonl'), past, past);
  const r = runScript(['--latest', '--json'], { cwd, env: { ...process.env, HOME: home } });
  check('U04 exit 0', r.status === 0, r.stderr);
  check('U04 chọn wf_fresh', r.status === 0 && JSON.parse(r.stdout).runId === 'wf_fresh', r.status === 0 ? JSON.parse(r.stdout).runId : '(fail)');
}

console.log('U05 dir không tồn tại / thiếu arg → exit 2');
{
  check('U05 dir lạ -> exit 2', runScript([path.join(T, 'khong-co')]).status === 2);
  check('U05 không arg -> exit 2', runScript([]).status === 2);
}

console.log('');
console.log(`Results: ${pass} passed, ${fail} failed (wf-usage)`);
if (fail > 0) process.exit(1);
