import { readFileSync } from 'node:fs';
for (const repo of process.argv.slice(2)) {
  const runs = JSON.parse(readFileSync(`raw-${repo}.json`)).filter(r => r.event === 'pull_request' && r.conclusion !== 'cancelled' && r.attempt === 1);
  const bySha = {}; for (const r of runs) { const end = Math.max(...(r.jobs||[]).filter(j=>j.completed).map(j=>+new Date(j.completed)), 0); if (!end) continue; const s = bySha[r.sha] ??= { start: +new Date(r.created), end: 0 }; s.start = Math.min(s.start, +new Date(r.created)); s.end = Math.max(s.end, end); }
  const w = Object.values(bySha).map(s => (s.end - s.start)/6e4).filter(x=>x>0).sort((a,b)=>a-b);
  const q = p => w[Math.floor(w.length*p)].toFixed(1);
  // queue: job started - run created
  const qs = runs.flatMap(r => (r.jobs||[]).filter(j=>j.started).map(j => (new Date(j.started)-new Date(r.created))/6e4)).sort((a,b)=>a-b);
  console.log(repo, { pushes: w.length, p50: q(.5), p90: q(.9), max: w.at(-1).toFixed(0), queueP50: qs[Math.floor(qs.length/2)].toFixed(1), queueP90: qs[Math.floor(qs.length*.9)].toFixed(1) });
}
