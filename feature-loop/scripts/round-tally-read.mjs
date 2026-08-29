#!/usr/bin/env node
// round-tally-read.mjs — bộ đọc dòng `kind: round-tally` trong run-log.jsonl.
// Là NỬA ĐỌC của cặp writer/reader (writer: acceptance-verify.js, AC-9 hồ sơ
// cham-dung-cay-dung-cho-dung); phép đếm 5-vòng-kế của opportunity đọc số qua
// đây thay vì khảo cổ. Fail-CLOSED: dòng tally thiếu/hỏng khoá nào → exit 2
// ghim tên khoá — «không biết» phải phân biệt được với «không có».
//
//   node round-tally-read.mjs --run-log <path> [--run-log <path>...]
//
// stdout: JSON array [{round, verdict, expected, returned, blocked, sha?, ts?, file}]
// exit 0 = đọc trọn · exit 2 = dòng tally hỏng khoá / file không đọc được · exit 3 = usage
import fs from 'node:fs';

const files = [];
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] !== '--run-log') { console.error(`round-tally-read: cờ không nhận diện được: ${argv[i]}\nusage: round-tally-read.mjs --run-log <path> [--run-log <path>...]`); process.exit(3); }
    if (!argv[i + 1] || argv[i + 1].startsWith('--')) { console.error('round-tally-read: --run-log thiếu giá trị'); process.exit(3); }
    files.push(argv[i + 1]); i += 1;
  }
}
if (!files.length) { console.error('round-tally-read: cần ít nhất một --run-log'); process.exit(3); }

const REQUIRED = [['round', 'number'], ['verdict', 'string'], ['expected', 'number'], ['returned', 'number'], ['blocked', 'number']];
const out = [];
for (const f of files) {
  let text;
  try { text = fs.readFileSync(f, 'utf8'); } catch { console.error(`round-tally-read: không đọc được ${f}`); process.exit(2); }
  let n = 0;
  for (const raw of text.split('\n')) {
    if (!raw.trim()) continue;
    n += 1;
    let l; try { l = JSON.parse(raw); } catch { continue; } // dòng khác hỏng JSON không phải việc của reader này
    if (!l || l.kind !== 'round-tally') continue;
    for (const [k, t] of REQUIRED) {
      if (typeof l[k] !== t) { console.error(`round-tally-read: dòng tally (dòng ${n} của ${f}) thiếu/hỏng khoá "${k}" (cần ${t}) — writer và reader đã trôi khỏi nhau, không đoán`); process.exit(2); }
    }
    out.push({ round: l.round, verdict: l.verdict, expected: l.expected, returned: l.returned, blocked: l.blocked, ...(l.sha ? { sha: l.sha } : {}), ...(l.ts ? { ts: l.ts } : {}), file: f });
  }
}
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
