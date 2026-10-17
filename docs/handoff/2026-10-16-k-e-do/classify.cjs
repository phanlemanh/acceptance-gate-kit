// Mỗi dòng gate2 có số Ngoài-N: so mốc theo `at` với mốc theo id, đối chiếu lượt chấm cuối.
const fs=require('fs'),path=require('path');const N=require(process.argv[2]);
const rd=p=>{try{return fs.readFileSync(p,'utf8')}catch{return ''}};
const ID=/^d-(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z-/;
for(const repo of process.argv.slice(3)){const acc=path.join(repo,'_acceptance');const tally={tong:0,saukhiId:0,gia:0,that:0,khongId:0};const gia=new Set(),that=new Set();
 for(const slug of fs.readdirSync(acc)){const d=path.join(acc,slug);const r=rd(path.join(d,'run-log.jsonl'));const lt=N.luotCham(r);if(!lt.length)continue;const cuoi=Math.max(...lt);
  for(const x of rd(path.join(d,'decisions.jsonl')).split('\n')){let e;try{e=JSON.parse(x)}catch{continue}
   if(String(e.stage||'').toLowerCase()!=='gate2'||!/Ngo[aà]i-\d/i.test(String(e.decision||''))||e.tieu_de)continue;tally.tong++;
   const m=ID.exec(String(e.id||''));const tid=m?Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6]):NaN;const tat=Date.parse(String(e.at||''));
   if(isNaN(tid)){tally.khongId++;continue}
   const moc=N.mocDong(e);if(!(moc<cuoi))continue;
   if(tid>=cuoi){tally.gia++;gia.add(slug+' at='+e.at+' id='+new Date(tid).toISOString()+' round='+new Date(cuoi).toISOString())}else{tally.that++;that.add(slug)}}}
 console.log(path.basename(repo),JSON.stringify(tally));for(const g of gia)console.log('  GIẢ',g);console.log('  THẬT',[...that].join(' '));}
