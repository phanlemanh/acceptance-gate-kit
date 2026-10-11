import { readFileSync } from 'node:fs';
const repo = process.argv[2]; const runs = JSON.parse(readFileSync(`raw-${repo}.json`));
const mult = (l=[]) => { l = l.join(' ').toLowerCase(); return l.includes('macos') ? 10 : l.includes('windows') ? 2 : 1; };
const bill = r => (r.jobs||[]).reduce((s,j)=> s + ((j.started&&j.completed&&j.conclusion!=='skipped') ? Math.ceil(Math.max(0,(new Date(j.completed)-new Date(j.started))/6e4))*mult(j.labels) : 0), 0);
const labels = new Set(); runs.forEach(r => (r.jobs||[]).forEach(j => labels.add((j.labels||[]).join(','))));
console.log('labels:', [...labels]);
// nhóm theo nhánh (chỉ pull_request), sha cuối = sha của lượt tạo muộn nhất
const pr = runs.filter(r => r.event === 'pull_request');
const byBr = {}; for (const r of pr) (byBr[r.branch] ??= []).push(r);
let tot=0, sup=0, nBr=0, shas=[]; const perBr=[];
for (const [b, rs] of Object.entries(byBr)) { nBr++; rs.sort((a,c)=>a.created.localeCompare(c.created)); const last = rs.at(-1).sha; const s = new Set(rs.map(r=>r.sha)); shas.push(s.size);
  let t=0,u=0; for (const r of rs) { const m=bill(r); t+=m; if (r.sha!==last) u+=m; } tot+=t; sup+=u; perBr.push([b,s.size,t,u]); }
shas.sort((a,b)=>a-b);
console.log({ prBranches: nBr, prMin: tot, supersededMin: sup, pct: (100*sup/tot).toFixed(1), medianShasPerBranch: shas[Math.floor(shas.length/2)], p90: shas[Math.floor(shas.length*0.9)] });
const push = runs.filter(r=>r.event==='push'); console.log('push branches:', [...new Set(push.map(r=>r.branch))].slice(0,10), 'pushMin', push.reduce((s,r)=>s+bill(r),0));
const rerun = runs.filter(r=>r.attempt>1); console.log('rerun attempts:', rerun.length, rerun.reduce((s,r)=>s+bill(r),0),'m');
// theo ngày
const byDay={}; for (const r of runs) { const d=r.created.slice(0,10); byDay[d]=(byDay[d]||0)+bill(r);} console.log('by day:', Object.entries(byDay).sort().map(([d,m])=>d.slice(5)+':'+m).join(' '));
perBr.sort((a,b)=>b[2]-a[2]); console.log('top branches:', perBr.slice(0,8).map(x=>x.join('/')).join('\n  '));
