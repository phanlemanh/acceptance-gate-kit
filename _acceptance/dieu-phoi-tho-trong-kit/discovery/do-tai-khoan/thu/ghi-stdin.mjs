#!/usr/bin/env node
// Thử nghiệm h, i, l của phép đo DP0: ghi nguyên đầu vào (stdin) thành một dòng JSON nối vào tệp, rồi in
// một dòng ngắn (dòng trạng thái hiện chữ này). Không in gì khác — kho kit công khai.
// Dùng: node ghi-stdin.mjs <tệp .jsonl>
import fs from 'node:fs';
import path from 'node:path';

const tep = process.argv[2];
if (!tep) process.exit(0);
let tho = '';
for await (const m of process.stdin) tho += m;
let du = null;
try {
  du = JSON.parse(tho);
} catch {
  du = { tho };
}
fs.mkdirSync(path.dirname(tep), { recursive: true });
fs.appendFileSync(tep, `${JSON.stringify({ luc: new Date().toISOString(), du })}\n`);
process.stdout.write('do-tai-khoan\n');
