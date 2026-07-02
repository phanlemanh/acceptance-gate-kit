// Characterization tests for feature-loop/workflows/execute-parallel.js —
// args guards, result demotion, null-safety, and the routing facts (executors
// inherit the session model + worktree isolation) pinned before Đợt 2 touches
// routing.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'execute-parallel.js');

const task = (id, over = {}) => ({
  id, title: `T ${id}`, summary: 's', files: ['src/a.js'], verifyCmd: 'npm test', ...over,
});
const baseArgs = (over = {}) => ({
  planPath: '/repo/docs/plans/p.md',
  repoRoot: '/repo',
  tasks: [task('Task 1'), task('Task 2')],
  ...over,
});
const done = (n) => ({ status: 'done', commitSha: 'c'.repeat(40), branch: `wt-${n}`, verifyOutput: 'ok', notes: 'done' });

console.log('E01 args guards: <2 tasks, bad task shape, JSON-string args');
{
  const { result } = await runWorkflow(WF, baseArgs({ tasks: [task('Task 1')] }), () => done(1));
  check('E01 <2 tasks -> error, no fan-out', /≥2 task/.test(result.error));
  const { result: r2 } = await runWorkflow(WF, baseArgs({ tasks: [task('Task 1'), { id: 'Task 2' }] }), () => done(2));
  check('E01 bad task shape -> error names the task', /Task 2/.test(r2.error));
  const { result: r3, calls } = await runWorkflow(WF, JSON.stringify(baseArgs()), () => done(3));
  check('E01 JSON-string args parsed + fan-out ran', r3.failed.length === 0 && calls.length === 2);
}

console.log('E02 happy path: results mapped per task');
{
  const { result } = await runWorkflow(WF, baseArgs(), () => done(1));
  check('E02 all done, failed empty', result.failed.length === 0 && result.results.length === 2);
  check('E02 taskId preserved', result.results.map(r => r.taskId).join(',') === 'Task 1,Task 2');
}

console.log('E03 demotion: done without merge refs is NOT done');
{
  const { result } = await runWorkflow(WF, baseArgs(), (c) =>
    c.label === 'exec:Task 2' ? { status: 'done', notes: 'quen commit' } : done(1));
  const t2 = result.results.find(r => r.taskId === 'Task 2');
  check('E03 demoted to failed + reason', t2.status === 'failed' && /thieu branch\/commitSha/.test(t2.notes));
  check('E03 failed list carries it', JSON.stringify(result.failed) === JSON.stringify(['Task 2']));
}

console.log('E04 dead / throwing agent -> failed, sibling survives');
{
  const { result } = await runWorkflow(WF, baseArgs(), (c) =>
    c.label === 'exec:Task 1' ? null : done(2));
  const t1 = result.results.find(r => r.taskId === 'Task 1');
  check('E04 dead agent -> failed skip/chet', t1.status === 'failed' && /skip\/chet/.test(t1.notes));
  const { result: r2 } = await runWorkflow(WF, baseArgs(), (c) => {
    if (c.label === 'exec:Task 1') throw new Error('boom');
    return done(2);
  });
  check('E04 thrown agent -> failed, Task 2 done', r2.failed.includes('Task 1') && !r2.failed.includes('Task 2'));
}

console.log('E05 routing characterization: inherit session model + worktree isolation');
{
  const { calls } = await runWorkflow(WF, baseArgs(), () => done(1));
  check('E05 executors inherit session model (no model opt)', calls.every(c => c.opts.model === undefined));
  check('E05 worktree isolation on every executor', calls.every(c => c.opts.isolation === 'worktree'));
  check('E05 labels exec:<taskId>', calls.every(c => /^exec:Task /.test(c.label)));
}

console.log('E06 args.models.executor override + sanitize');
{
  const { calls } = await runWorkflow(WF, baseArgs({ models: { executor: 'sonnet' } }), () => done(1));
  check('E06 executor overridden -> sonnet', calls.every(c => c.opts.model === 'sonnet'));
  const { calls: c2 } = await runWorkflow(WF, baseArgs({ models: { executor: 'session', judge: 'opus' } }), () => done(1));
  check('E06 "session" -> inherit; foreign role ignored', c2.every(c => c.opts.model === undefined));
  const { calls: c3 } = await runWorkflow(WF, JSON.stringify(baseArgs({ models: { executor: 'haiku' } })), () => done(1));
  check('E06 models survives JSON-string args', c3.every(c => c.opts.model === 'haiku'));
}

summary('execute-parallel');
