#!/usr/bin/env node
// Hồ sơ danh-thuc-doc-nhip-dung-ma (AC-9, eval E9b): suite tests/dieu-phoi chạy HAI lần — môi trường đã xoá
// CLAUDE_CODE_HOST_SESSION_ID/CLAUDE_CODE_SESSION_ID, và môi trường cha mang hai biến giả — phải cho cùng tập dòng TAP «ok»
// và không dòng «not ok» nào. Lượt chấm chạy trong phiên app mang hai biến thật; CI không có — hai lần chạy chứng bộ ca
// không đổi màu theo nơi chạy. Không phải tệp .test.mjs: suite trọn mất ~4′ mỗi lần, đặt trong node --test là ba lần.
// Ca lệch giữa hai lần (hay «not ok») được chạy lại ĐÚNG MỘT lần ở cả hai môi trường: xanh cả hai thì là chập chờn — in
// «CHẬP CHỜN», không tính đỏ (lượt chấm 1 của hồ sơ: ca DP3-05-do ghi-khi-thoi chờ 300 ms, đỏ một lần dưới tải); còn lệch
// hay còn đỏ thì là lỗi thật.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BIEN = ['CLAUDE_CODE_HOST_SESSION_ID', 'CLAUDE_CODE_SESSION_ID'];
const SACH = Object.fromEntries(Object.entries(process.env).filter(([k]) => !BIEN.includes(k) && k !== 'NODE_TEST_CONTEXT'));
const GIA = { ...SACH, CLAUDE_CODE_HOST_SESSION_ID: 'local_x', CLAUDE_CODE_SESSION_ID: 'y' };
const TEN = (re) => (d) => re.exec(d)?.[1];

export function chay(env, mau = null) {
  const doiSo = ['--test', '--test-reporter=tap', ...(mau ? [`--test-name-pattern=${mau}`] : []), 'tests/dieu-phoi/**/*.test.mjs'];
  const r = spawnSync(process.execPath, doiSo, { cwd: KIT, env, encoding: 'utf8', maxBuffer: 1 << 28 });
  const dong = r.stdout.split('\n');
  return {
    ok: new Set(dong.map(TEN(/^ *ok \d+ - (.+?)(?: #.*)?$/)).filter(Boolean)),
    hong: new Set(dong.map(TEN(/^ *not ok \d+ - (.+?)(?: #.*)?$/)).filter(Boolean)),
    ma: r.status,
  };
}
const thoat = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// So hai lần chạy; trả các ca nghi (lệch hay đỏ).
export function caNghi(a, b) {
  return [...new Set([...a.hong, ...b.hong, ...[...a.ok].filter((t) => !b.ok.has(t)), ...[...b.ok].filter((t) => !a.ok.has(t))])].sort();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const a = chay(SACH);
  const b = chay(GIA);
  console.log(`sạch: ${a.ok.size} ok · ${a.hong.size} not ok · mã ${a.ma}`);
  console.log(`giả: ${b.ok.size} ok · ${b.hong.size} not ok · mã ${b.ma}`);
  const loi = [];
  if (a.ok.size === 0) loi.push('không đọc được dòng ok nào — suite không chạy');
  for (const t of caNghi(a, b)) {
    const mau = `^${thoat(t)}$`;
    const a2 = chay(SACH, mau);
    const b2 = chay(GIA, mau);
    if (a2.ok.has(t) && b2.ok.has(t) && !a2.hong.has(t) && !b2.hong.has(t)) console.log(`CHẬP CHỜN ${t} — lần đầu lệch, chạy lại xanh cả hai môi trường`);
    else loi.push(`${t}: chạy lại vẫn ${a2.ok.has(t) ? 'xanh' : 'đỏ'} khi sạch · ${b2.ok.has(t) ? 'xanh' : 'đỏ'} khi giả`);
  }
  for (const l of loi) console.log(`LỖI ${l}`);
  console.log(loi.length ? 'hai-moi-truong: ĐỎ' : 'hai-moi-truong: XANH — cùng tập dòng ok');
  process.exit(loi.length ? 1 : 0);
}
