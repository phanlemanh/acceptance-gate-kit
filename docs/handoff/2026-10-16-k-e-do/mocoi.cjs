const fs=require('fs'),path=require('path');const N=require(process.argv[2]);
const rd=p=>{try{return fs.readFileSync(p,'utf8')}catch{return ''}};
for(const repo of process.argv.slice(3)){const acc=path.join(repo,'_acceptance');let dongMa=0,hs=new Set(),coi=[];
 for(const slug of fs.readdirSync(acc)){const d=path.join(acc,slug);const l=rd(path.join(d,'decisions.jsonl'));if(!/"tieu_de"/.test(l))continue;
  for(const x of l.split('\n')){try{const e=JSON.parse(x);if(String(e.stage).toLowerCase()==='gate2'&&e.tieu_de){dongMa++;hs.add(slug)}}catch{}}
  const g=N.ganDinhTuyen(rd(path.join(d,'review-findings.md')),l,rd(path.join(d,'run-log.jsonl')));
  for(const m of g.moCoi)coi.push(slug+' '+m.ly_do+(m.may?' (máy)':' (người)'));}
 console.log(path.basename(repo),'dòng có mã:',dongMa,'hồ sơ:',hs.size,'mồ côi:',coi.length);for(const c of coi)console.log('  ',c);}
