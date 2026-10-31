import fs from 'fs'; import path from 'path'; import {execSync} from 'child_process';
const R=/^(?=.*\d)[A-Za-z0-9][\w.:-]{3,199}$/;
const strip=v=>String(v??'').replace(/\s+#.*$/,'').trim().replace(/^["']+|["']+$/g,'').trim();
const okShape=/^(?=.*\d)[A-Za-z0-9][\w.:-]*$/; // hình dạng hợp lệ trừ độ dài
for (const repo of process.argv.slice(2)) {
  let files=[]; try{files=execSync(`git -C ${repo} ls-files '_acceptance/*/run-log.jsonl'`).toString().trim().split('\n').filter(Boolean)}catch{}
  let tong=0,hong=0,ngan=[],carryNgan=0;
  for(const f of files){for(const l of fs.readFileSync(path.join(repo,f),'utf8').split('\n')){if(!l.trim())continue;let o;try{o=JSON.parse(l)}catch{continue}
    if(!o.evalId||o.kind)continue; tong++; const s=strip(o.run_id); if(s===''||R.test(s))continue; hong++;
    if(s.length<4&&okShape.test(s)){ngan.push(s);}}}
  console.log(repo,'tep',files.length,'dong eval',tong,'khong dat',hong,'ngan-nhung-dung-dang',ngan.length,JSON.stringify([...new Set(ngan)].slice(0,10)));
}
