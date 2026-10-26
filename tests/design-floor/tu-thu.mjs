#!/usr/bin/env node
// Chiều đỏ của chính bộ đo design-floor: mỗi đột biến sửa MỘT chỗ trên bản sao hợp đồng hoặc tệp
// khoá, chạy lại rao-dong.mjs / hop-dong.mjs trên bản sao, và đòi thoát 1 kèm ĐÚNG thông điệp.
// Đối chứng dương trước: bản sao nguyên vẹn phải xanh, nếu không mọi «đỏ» dưới đây là vô nghĩa.
// Bản sao do mã sinh trong lượt chạy; hai tệp gốc không bao giờ bị sửa.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DUONG_HOP_DONG, DUONG_KHOA, docHopDong } from './lib/hop-dong.mjs';

const TMP = mkdtempSync(join(tmpdir(), 'design-floor-tu-thu-'));
const MD = readFileSync(DUONG_HOP_DONG, 'utf8');
const KHOA = JSON.parse(readFileSync(DUONG_KHOA, 'utf8'));
const HERE = new URL('.', import.meta.url).pathname;
let n = 0;

function banSao(sua = () => {}, suaKhoa = () => {}) {
  const hd = docHopDong();
  sua(hd);
  const md = MD.replace(/(<!-- <<<DESIGN-FLOOR-HOP-DONG -->\n```json\n)[\s\S]*?(\n```\n<!-- DESIGN-FLOOR-HOP-DONG>>> -->)/, (_, a, b) => `${a}${JSON.stringify(hd, null, 2)}${b}`);
  const k = structuredClone(KHOA);
  suaKhoa(k);
  const d = mkdtempSync(join(TMP, 'b-'));
  writeFileSync(join(d, 'hd.md'), md);
  writeFileSync(join(d, 'khoa.json'), `${JSON.stringify(k, null, 2)}\n`);
  return ['--hop-dong', join(d, 'hd.md'), '--khoa', join(d, 'khoa.json')];
}

function chay(script, args) {
  const r = spawnSync(process.execPath, [join(HERE, script), ...args], { encoding: 'utf8' });
  return { ec: r.status, out: `${r.stdout}${r.stderr}` };
}

const gioiHan = (hd, id) => hd.gioi_han.find((g) => g.id === id);
const ok = [];
function ca(ten, script, args, { ec, chua }) {
  n++;
  const r = chay(script, args);
  const dung = r.ec === ec && chua.every((c) => r.out.includes(c));
  console.log(`  ${dung ? 'PASS' : 'FAIL'}: TT-${String(n).padStart(2, '0')} ${ten}`);
  if (!dung) console.log(`         muốn thoát ${ec} + ${JSON.stringify(chua)}; được thoát ${r.ec}:\n${r.out.split('\n').map((l) => `         | ${l}`).join('\n')}`);
  ok.push(dung);
}

console.log('tu-thu: chiều đỏ của rào đóng kín và bộ đo hợp đồng');
ca('đối chứng: bản sao nguyên vẹn — rào xanh', 'rao-dong.mjs', banSao(), { ec: 0, chua: ['XFAIL: FN-02', 'rao-dong: XANH'] });
ca('đối chứng: bản sao nguyên vẹn — DF-01, DF-09 xanh', 'hop-dong.mjs', [...banSao(), '--chi', 'DF-01,DF-09'], { ec: 0, chua: ['XFAIL: DF-01', 'PASS: DF-09'] });
ca('FN-04 trần hạ dưới số đo', 'rao-dong.mjs', banSao((hd) => { hd.rao.tran.tep = KHOA.hop.tep - 1; }), { ec: 1, chua: ['FAIL: FN-04', 'vượt trần'] });
ca('FN-02 luật cấm mới bắt một module lõi', 'rao-dong.mjs', banSao((hd) => { hd.rao.cam.push({ ten: 'output', re: '^src/core/output\\.ts$' }); }), { ec: 1, chua: ['FAIL: FN-02', 'vi phạm CHƯA khai: gate src/core/output.ts'] });
ca('FN-02 giới hạn khai thiếu một vi phạm', 'rao-dong.mjs', banSao((hd) => { gioiHan(hd, 'FN-02').vi_pham.shift(); }), { ec: 1, chua: ['FAIL: FN-02', 'vi phạm CHƯA khai'] });
ca('FN-02 giới hạn khai một vi phạm không còn', 'rao-dong.mjs', banSao((hd) => { gioiHan(hd, 'FN-02').vi_pham.push('gate src/core/khong-co.ts'); }), { ec: 1, chua: ['FAIL: FN-02', 'đã khai mà KHÔNG còn: gate src/core/khong-co.ts'] });
ca('FN-01 tệp khoá lệch một băm', 'rao-dong.mjs', banSao(() => {}, (k) => { k.tep[0].sha256 = '0'.repeat(64); }), { ec: 1, chua: ['FAIL: FN-01', `~${KHOA.tep[0].path} (băm)`] });
ca('FN-03 import mạng (node:fs giả làm mạng)', 'rao-dong.mjs', banSao((hd) => { hd.rao.cam_mang.push('node:fs'); }), { ec: 1, chua: ['FAIL: FN-03', 'import node:fs'] });
ca('FN-03 token mạng (readFileSync giả làm mạng)', 'rao-dong.mjs', banSao((hd) => { hd.rao.cam_token_mang.push('\\breadFileSync\\s*\\('); }), { ec: 1, chua: ['FAIL: FN-03', 'readFileSync'] });
ca('DF-02 nhạy: lời gọi gate quên --tokens thì mồi đổi kết quả', 'hop-dong.mjs', [...banSao((hd) => { hd.lenh.gate.argv = hd.lenh.gate.argv.filter((a) => a !== '--tokens' && a !== '{tokens}'); }), '--chi', 'DF-02'], { ec: 1, chua: ['FAIL: DF-02', 'kết quả đổi theo mồi: gate'] });
ca('XPASS: khai giới hạn cho phép đo đang xanh', 'hop-dong.mjs', [...banSao((hd) => { hd.gioi_han.push({ id: 'DF-09', chu_ky_do: '.', can_upstream: 'x', pr_upstream: 'y' }); }), '--chi', 'DF-09'], { ec: 1, chua: ['XPASS→FAIL: DF-09'] });
ca('đỏ khác chữ ký đã khai', 'hop-dong.mjs', [...banSao((hd) => { gioiHan(hd, 'DF-01').chu_ky_do = '^khong-bao-gio-khop$'; }), '--chi', 'DF-01'], { ec: 1, chua: ['FAIL: DF-01', 'đỏ khác chữ ký'] });
ca('đỏ không khai', 'hop-dong.mjs', [...banSao((hd) => { hd.gioi_han = hd.gioi_han.filter((g) => g.id !== 'DF-05'); }), '--chi', 'DF-05'], { ec: 1, chua: ['FAIL: DF-05', 'gate .tsx thoát 0'] });
ca('giới hạn không có đường ra (thiếu pr_upstream)', 'hop-dong.mjs', [...banSao((hd) => { delete gioiHan(hd, 'DF-01').pr_upstream; }), '--chi', 'DF-01'], { ec: 1, chua: ['FAIL: DF-01', 'thiếu can_upstream/pr_upstream'] });

rmSync(TMP, { recursive: true, force: true });
const xanh = ok.every(Boolean);
console.log(xanh ? `tu-thu: XANH (${ok.length} ca)` : 'tu-thu: ĐỎ');
process.exit(xanh ? 0 : 1);
