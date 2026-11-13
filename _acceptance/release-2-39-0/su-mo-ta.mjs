// su-mo-ta.mjs (release-2-39-0) — mô tả plugin rút ngắn KHÔNG mất chữ nào: tệp
// `docs/reference/su-mo-ta-plugin-toi-2-38-1.md` (CHANGELOG.md trỏ về nó), ghép lại các đoạn của mỗi phần bằng một dấu
// cách, phải BẰNG ĐÚNG mô tả của hai tệp khai plugin ở ref.
//   node su-mo-ta.mjs            # ref v2.38.1 — phải exit 0
//   node su-mo-ta.mjs v2.38.0    # chiều đỏ: mô tả ở 2.38.0 thiếu mục v2.38.1 nên phải exit 1, nêu cả hai plugin
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const REF = process.argv[2] || 'v2.38.1';
const TEP = 'docs/reference/su-mo-ta-plugin-toi-2-38-1.md';
if (!fs.existsSync(TEP)) { console.log(`ĐỎ: không có ${TEP}`); process.exit(2); }
const su = fs.readFileSync(TEP, 'utf8');
if (!fs.readFileSync('CHANGELOG.md', 'utf8').includes(TEP)) { console.log(`ĐỎ: CHANGELOG.md không trỏ về ${TEP}`); process.exit(1); }
const phan = (ten) => {
  const m = su.match(new RegExp('(?:^|\\n)## ' + ten + ' \\(`[^`]+`\\)\\n\\n([\\s\\S]*?)(?=\\n## |\\s*$)'));
  return m ? m[1].replace(/\n+$/, '').split('\n\n').join(' ') : null;
};
let rc = 0;
for (const [ten, rel] of [['acceptance-gate', '.claude-plugin/plugin.json'], ['feature-loop', 'feature-loop/.claude-plugin/plugin.json']]) {
  const goc = JSON.parse(execFileSync('git', ['show', `${REF}:${rel}`], { encoding: 'utf8' })).description;
  const chep = phan(ten);
  if (chep === null) { console.log(`ĐỎ: ${TEP} không có phần «## ${ten}»`); rc = 1; continue; }
  if (chep === goc) console.log(`  ${ten}: ${goc.length} ký tự — chép nguyên văn đúng mô tả ở ${REF}`);
  else {
    let k = 0; while (k < goc.length && goc[k] === chep[k]) k++;
    console.log(`ĐỎ: ${ten} — bản chép KHÁC mô tả ở ${REF} (dài ${chep.length} so ${goc.length}, lệch từ ký tự ${k}: «${goc.slice(k, k + 40)}»)`); rc = 1;
  }
}
if (!rc) console.log(`XANH: sử trong mô tả hai plugin ở ${REF} còn nguyên trong ${TEP}`);
process.exit(rc);
