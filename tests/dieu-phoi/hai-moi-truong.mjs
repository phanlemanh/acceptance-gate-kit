#!/usr/bin/env node
// Hồ sơ danh-thuc-doc-nhip-dung-ma (AC-9, ca TC1-09 hai-moi-truong): suite tests/dieu-phoi chạy HAI lần — môi trường đã
// xoá CLAUDE_CODE_HOST_SESSION_ID/CLAUDE_CODE_SESSION_ID, và môi trường cha mang hai biến giả — phải cho cùng tập dòng
// TAP «ok» và không dòng «not ok» nào. Lượt chấm chạy trong phiên app mang hai biến thật; CI không có — hai lần chạy chứng
// bộ ca không đổi màu theo nơi chạy. Không phải tệp .test.mjs: suite trọn mất ~4′ mỗi lần, đặt trong node --test là ba lần.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BIEN = ['CLAUDE_CODE_HOST_SESSION_ID', 'CLAUDE_CODE_SESSION_ID'];
const sach = Object.fromEntries(Object.entries(process.env).filter(([k]) => !BIEN.includes(k) && k !== 'NODE_TEST_CONTEXT'));
const lan = (ten, env) => {
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'tests/dieu-phoi/**/*.test.mjs'], { cwd: KIT, env, encoding: 'utf8', maxBuffer: 1 << 28 });
  const dong = r.stdout.split('\n');
  const ok = new Set(dong.map((d) => /^ *ok \d+ - (.+?)(?: #.*)?$/.exec(d)?.[1]).filter(Boolean));
  const hong = dong.filter((d) => /^ *not ok \d+ - /.test(d)).map((d) => d.trim());
  console.log(`${ten}: ${ok.size} ok · ${hong.length} not ok · mã ${r.status}`);
  return { ok, hong, ma: r.status };
};
const a = lan('sạch', sach);
const b = lan('giả', { ...sach, CLAUDE_CODE_HOST_SESSION_ID: 'local_x', CLAUDE_CODE_SESSION_ID: 'y' });
const chiA = [...a.ok].filter((t) => !b.ok.has(t));
const chiB = [...b.ok].filter((t) => !a.ok.has(t));
const loi = [...a.hong.map((d) => `sạch: ${d}`), ...b.hong.map((d) => `giả: ${d}`), ...chiA.map((t) => `chỉ xanh khi sạch: ${t}`), ...chiB.map((t) => `chỉ xanh khi giả: ${t}`)];
if (a.ok.size === 0) loi.push('không đọc được dòng ok nào — suite không chạy');
for (const l of loi) console.log(`LỖI ${l}`);
console.log(loi.length ? 'hai-moi-truong: ĐỎ' : 'hai-moi-truong: XANH — cùng tập dòng ok');
process.exit(loi.length ? 1 : 0);
