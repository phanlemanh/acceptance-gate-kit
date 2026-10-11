import { readFileSync } from 'node:fs';
const [repo, t1file] = process.argv.slice(2);
const runs = JSON.parse(readFileSync(`raw-${repo}.json`)); const prs = JSON.parse(readFileSync(`prs-${repo}.json`));
const g2r = g => new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*\//g,"\x01").replace(/\*\*/g,"\x02").replace(/\*/g,"[^/]*").replace(/\x01/g,"(?:.*/)?").replace(/\x02/g,".*") + "$");
const T1 = readFileSync(t1file,'utf8').trim().split('\n').map(g2r); const isT1 = f => T1.some(r=>r.test(f));
const isHoSo = f => f.startsWith('_acceptance/') || f.startsWith('.acceptance-runs/');
const jm = j => (j.started&&j.completed&&j.conclusion!=='skipped') ? Math.ceil(Math.max(0,(new Date(j.completed)-new Date(j.started))/6e4)) : 0;
const KIT = /acceptance gate|bộ điều phối|luật kho|phân loại|ci-ok/;
const prBy = Object.fromEntries(prs.map(p=>[p.headRefName,p]));
const byBr = {}; for (const r of runs) if (r.event==='pull_request') (byBr[r.branch] ??= []).push(r);
let A=0, Akit=0, B=0, Bkit=0, tot=0;
for (const [b, rs] of Object.entries(byBr)) { const p = prBy[b]; if (!p?.files) continue; const code = !p.files.every(x=>isT1(x)||isHoSo(x));
  rs.sort((x,y)=>x.created.localeCompare(y.created)); const last = rs.at(-1).sha;
  for (const r of rs) for (const j of r.jobs||[]) { const m = jm(j); tot+=m; const kit = KIT.test(j.name);
    if (!code) { A+=m; if (kit) Akit+=m; } else if (r.sha!==last) { B+=m; if (kit) Bkit+=m; } } }
console.log({ tongPhutPR: tot, khongMa_tong: A, khongMa_jobKit: Akit, khongMa_tietKiem: A-Akit, coMa_giuaChung: B, coMa_giuaChung_jobKit: Bkit, coMa_giuaChung_tietKiem: B-Bkit });
