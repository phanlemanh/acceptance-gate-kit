export const meta = {
  name: 'execute-parallel',
  description: 'S3 EXECUTE fan-out cua /feature-loop: moi task doc lap trong plan → 1 agent + worktree rieng',
  whenToUse: 'CHI khi implementation plan co ≥2 task danh dau independent. Task phu thuoc nhau → code tuan tu main loop, dung dung workflow nay.',
  phases: [{ title: 'Execute', detail: '1 agent / task, worktree isolation, verify roi moi commit' }],
}

// args = {
//   planPath: '/abs/docs/superpowers/plans/<plan>.md',
//   repoRoot: '/Users/manhphan/dev/artifact-platform',  // repo goc (agent chay trong worktree copy)
//   tasks: [{ id: 'Task 3', title, summary, files: ['path1', ...], verifyCmd: 'npm run typecheck' }],
// }

const TASK_SCHEMA = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['done', 'failed'] },
    commitSha: { type: 'string' },
    branch: { type: 'string', description: 'output cua: git rev-parse --abbrev-ref HEAD trong worktree' },
    verifyOutput: { type: 'string', description: '10 dong cuoi output lenh verify' },
    notes: { type: 'string' },
  },
  required: ['status', 'notes'],
}

// args co the den dang JSON string tuy harness (xac nhan bang dry-run e2e 2026-06-11) — parse truoc khi validate
if (typeof args === 'string') {
  try { args = JSON.parse(args) } catch (e) { args = null }
}
if (!args || !Array.isArray(args.tasks) || args.tasks.length < 2 || typeof args.planPath !== 'string') {
  return { error: 'execute-parallel can planPath + ≥2 task doc lap — it hon thi code tuan tu main loop.', results: [], failed: [] }
}
// validate shape TUNG task truoc khi fan-out — fail som va ro rang, khong de 1 task hong giet ca workflow giua chung
const badTasks = args.tasks.filter(t => !t || typeof t.id !== 'string' || typeof t.title !== 'string'
  || typeof t.summary !== 'string' || !Array.isArray(t.files) || typeof t.verifyCmd !== 'string')
if (badTasks.length) {
  return { error: `task thieu field (can id/title/summary/files[]/verifyCmd): ${badTasks.map(t => (t && t.id) || '(khong co id)').join(', ')}`, results: [], failed: [] }
}

phase('Execute')
log(`Fan-out ${args.tasks.length} task doc lap, moi task 1 worktree rieng`)

const results = await parallel(args.tasks.map(t => () =>
  agent(
    `Ban thuc thi MOT task trong implementation plan, trong git worktree rieng (da isolate san — cu lam viec tai cwd; repo goc: ${args.repoRoot}).\nDoc plan: ${args.planPath} — tim section "${t.id}: ${t.title}" va lam DUNG cac step cua section do, KHONG lam task khac.\nTom tat task: ${t.summary}\nFiles du kien: ${t.files.join(', ')}\n\nSau khi code xong: chay verify "${t.verifyCmd}". PASS → commit dung message trong plan. FAIL → sua toi khi pass. Khong the pass → status=failed + notes nguyen nhan, KHONG commit code hong.\nTra ve: status, commitSha (git rev-parse HEAD), branch (git rev-parse --abbrev-ref HEAD), verifyOutput (10 dong cuoi), notes. status=done BAT BUOC kem commitSha + branch + verifyOutput.`,
    { label: `exec:${t.id}`, phase: 'Execute', isolation: 'worktree', schema: TASK_SCHEMA }
  ).then(
    r => {
      if (!r) return { taskId: t.id, status: 'failed', notes: 'agent bi skip/chet — chay lai task nay' }
      if (r.status === 'done' && (!r.branch || !r.commitSha)) {
        // done ma khong co ref de merge = cong viec mat tich — demote, khong duoc tinh la xong
        return { taskId: t.id, ...r, status: 'failed', notes: `bao done nhung thieu branch/commitSha — khong merge duoc; notes goc: ${r.notes}` }
      }
      return { taskId: t.id, ...r }
    },
    () => ({ taskId: t.id, status: 'failed', notes: 'thunk rejected (loi truoc/khi goi agent) — chay lai task nay' })
  )
))

// belt-and-suspenders: phan tu null (thunk fail o tang parallel) khong duoc lam crash hay mat ket qua task khac
const safeResults = results.map((r, i) => r || { taskId: args.tasks[i].id, status: 'failed', notes: 'ket qua null tu parallel — chay lai task nay' })
const failedTasks = safeResults.filter(r => r.status !== 'done')
log(failedTasks.length
  ? `${failedTasks.length}/${safeResults.length} task FAILED — xem notes tung task`
  : `Ca ${safeResults.length} task done — main loop merge cac branch worktree ve feature branch`)

return { results: safeResults, failed: failedTasks.map(f => f.taskId) }
