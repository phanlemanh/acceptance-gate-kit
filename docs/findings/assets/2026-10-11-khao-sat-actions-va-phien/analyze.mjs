// Phút Actions theo kho / workflow / job / sự kiện. Phút tính phí = ceil(phút job) × hệ số OS, chỉ kho riêng tư.
import { readFileSync, readdirSync } from 'node:fs';
const PRIVATE = new Set(['crm-onehub','artifact-platform','floorplanstudio','media-library','radar','aes','media-crawler','radar-realestate','realestate-data-foundation','policy-graph-hub','artifact-platform-design','floorplan']);
const mult = (labels=[]) => { const l = labels.join(' ').toLowerCase(); return l.includes('macos') ? 10 : l.includes('windows') ? 2 : 1; };
const mins = (j) => (j.started && j.completed && j.conclusion !== 'skipped') ? Math.max(0, (new Date(j.completed) - new Date(j.started)) / 6e4) : 0;
const only = process.argv[2];
const out = [];
for (const f of readdirSync('.').filter(f => f.startsWith('raw-'))) {
  const repo = f.slice(4, -5); if (only && repo !== only) continue;
  const runs = JSON.parse(readFileSync(f));
  let raw = 0, bill = 0; const byWf = {}, byJob = {}, byEv = {}, byConc = {};
  for (const r of runs) for (const j of r.jobs || []) {
    const m = mins(j); if (!m) continue; const b = Math.ceil(m) * mult(j.labels);
    raw += m; bill += b;
    const k = r.name; (byWf[k] ??= { runs: new Set(), bill: 0 }).runs.add(r.id); byWf[k].bill += b;
    const jk = r.name + ' › ' + j.name.replace(/\(.*\)/, '(…)'); (byJob[jk] ??= { n: 0, bill: 0 }); byJob[jk].n++; byJob[jk].bill += b;
    byEv[r.event] = (byEv[r.event] || 0) + b;
    byConc[r.conclusion] = (byConc[r.conclusion] || 0) + b;
  }
  out.push({ repo, priv: PRIVATE.has(repo), runs: runs.length, rawMin: Math.round(raw), billMin: bill });
  if (only || process.argv[3]) {
    console.log(`\n== ${repo} runs=${runs.length} billMin=${bill} private=${PRIVATE.has(repo)}`);
    console.log('by workflow:', Object.entries(byWf).sort((a,b)=>b[1].bill-a[1].bill).map(([k,v])=>`${k}: ${v.runs.size} runs ${v.bill}m`).join(' | '));
    console.log('by event:', JSON.stringify(byEv)); console.log('by conclusion:', JSON.stringify(byConc));
    console.log('top jobs:'); Object.entries(byJob).sort((a,b)=>b[1].bill-a[1].bill).slice(0,15).forEach(([k,v])=>console.log(`  ${v.bill}m  n=${v.n}  avg=${(v.bill/v.n).toFixed(1)}  ${k}`));
  }
}
if (!only) console.table(out.sort((a,b)=>b.billMin-a.billMin));
