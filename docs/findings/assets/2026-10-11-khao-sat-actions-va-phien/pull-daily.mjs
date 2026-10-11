// Kéo runs + jobs 30 ngày cho các kho dùng kit có lượt chạy. Ghi raw-<repo>.json.
import { execFileSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
const repos = process.argv.slice(2);
const since = new Date(Date.now() - 30*864e5).toISOString().slice(0,10);
const gh = (p) => JSON.parse(execFileSync('gh', ['api', p], { maxBuffer: 256<<20 }).toString());
const ghAsync = (p) => new Promise((res) => { import('node:child_process').then(({execFile}) => execFile('gh', ['api', p], { maxBuffer: 256<<20 }, (e, out) => res(e ? null : JSON.parse(out)))); });
for (const r of repos) {
  const f = `raw-${r}.json`; if (existsSync(f)) { console.log('skip', r); continue; }
  const runs = [];
  for (let k = 30; k >= 0; k--) { const day = new Date(Date.now() - k*864e5).toISOString().slice(0,10);
  for (let page = 1; ; page++) {
    const d = gh(`repos/phanlemanh/${r}/actions/runs?created=${day}..${day}&per_page=100&page=${page}`);
    runs.push(...d.workflow_runs.map(w => ({ id: w.id, name: w.name, path: w.path, event: w.event, branch: w.head_branch, sha: w.head_sha, status: w.status, conclusion: w.conclusion, attempt: w.run_attempt, created: w.created_at, started: w.run_started_at, updated: w.updated_at, prs: (w.pull_requests||[]).map(p=>p.number) })));
    if (d.workflow_runs.length < 100) break;
  } }
  let i = 0; const conc = 10;
  async function worker() { while (i < runs.length) { const run = runs[i++]; const j = await ghAsync(`repos/phanlemanh/${r}/actions/runs/${run.id}/jobs?per_page=100&filter=all`); run.jobs = j ? j.jobs.map(x => ({ name: x.name, status: x.status, conclusion: x.conclusion, started: x.started_at, completed: x.completed_at, labels: x.labels, runner: x.runner_name })) : null; } }
  await Promise.all(Array.from({length: conc}, worker));
  writeFileSync(f, JSON.stringify(runs));
  console.log(r, runs.length, 'runs', runs.filter(x=>!x.jobs).length, 'missing jobs');
}
