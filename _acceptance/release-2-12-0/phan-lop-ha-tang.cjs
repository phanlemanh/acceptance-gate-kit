#!/usr/bin/env node
'use strict';
/**
 * phan-lop-ha-tang.cjs — phân lớp một lệnh máy ĐỎ: hạ tầng hay vật?
 *
 * Vì sao có: lượt chấm 5 và lượt chấm 8 của hồ sơ này đều bị một tín hiệu HẠ TẦNG
 * đọc thành tín hiệu VẬT, và cả hai lần đều đẩy lên bàn người.
 *   - lượt 5: tệp ca là tệp MỚI nên cây gốc trả MODULE_NOT_FOUND; tác tử ghi đó
 *     thành «đỏ = có phân biệt» cho cả bảy phép đo.
 *   - lượt 8: đầu ra suite plugins khớp khuôn kiểm duyệt của hạ tầng nên bị trung
 *     hoà, tác tử trả exit 1; cùng chuỗi lệnh chạy tại chỗ cho exit 0.
 *
 * Luật phân lớp, KHÔNG suy diễn: chạy LẠI ĐÚNG chuỗi lệnh đã ghi trong nhật ký,
 * tại cùng gốc kho, N lần. Xanh mọi lần → HẠ TẦNG (lệnh không đo được trong tác
 * tử). Đỏ bất kỳ lần nào → VẬT, giữ nguyên màu đỏ. Không có nhánh thứ ba: máy
 * không được phép «giải thích» một màu đỏ thành màu xanh bằng lý lẽ.
 *
 *   node phan-lop-ha-tang.cjs --slug <s> --round <n> --eval-id <id> [--lan 2]
 *                             [--root <kho>] [--ghi]
 *   node phan-lop-ha-tang.cjs --slug <s> --quet          [--root <kho>]
 *
 * `--quet` là lối vào dùng làm PHÉP ĐO (khoá config tĩnh, không mang số lượt):
 * nó quét MỌI dòng máy đỏ trong nhật ký của hồ sơ và đòi mỗi dòng phải có một
 * dòng `kind: infra-recheck` đi kèm phán quyết `ha-tang`. Dòng đỏ chưa phân lớp,
 * hoặc phân lớp ra `vat`, đều làm nó thoát 1. Nhờ thế câu «lệnh đỏ phải phân lớp
 * bằng máy trước khi tin» thôi là LỜI DẶN trong `expected` và thành một phép đo.
 *
 * Đọc chuỗi lệnh TỪ nhật ký (không nhận --cmd): lệnh phải là đúng lệnh đã chạy,
 * không phải lệnh tôi gõ lại. `--ghi` mới nối dòng vào run-log.jsonl.
 *
 * GIỚI HẠN ĐO ĐƯỢC của chính bộ phân lớp: nó KHÔNG phân biệt được «hạ tầng» với
 * «lệnh chập chờn». Đo bằng một lệnh 50/50 tất định-xác-suất, chạy 6 lượt với
 * `--lan 2`: 1 lượt ra `ha-tang`, 5 lượt ra `vat` — tức tỉ lệ gọi nhầm ≈ 1/4 ở
 * --lan 2, và ≈ (1/2)^N nói chung. Vì thế một phân lớp `ha-tang` CHỈ đủ sức khi
 * có thêm một dấu hiệu ĐỘC LẬP nói vì sao lệnh đỏ trong tác tử (nhật ký workflow
 * ghi tên cơ chế đã can thiệp). Không có dấu hiệu ấy thì nâng `--lan`, hoặc để
 * nguyên màu đỏ. Lệnh chập chờn có đường riêng của nó: variance-N của workflow.
 * exit 0 = đã phân lớp · 1 = lệnh ĐỎ thật · 2 = nguồn thiếu/hỏng · 3 = usage.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const HO_SO = path.dirname(__filename);
const CAY = path.resolve(HO_SO, '..', '..');

function usage(m) { process.stderr.write(`phan-lop-ha-tang: ${m}\nusage: --slug <s> --round <n> --eval-id <id> [--lan 2] [--root <kho>] [--ghi]\n`); process.exit(3); }
function die(m) { process.stderr.write(`phan-lop-ha-tang: ${m}\n`); process.exit(2); }

const o = { lan: 2, root: CAY, ghi: false, quet: false };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === '--slug') o.slug = process.argv[++i];
  else if (a === '--round') o.round = Number(process.argv[++i]);
  else if (a === '--eval-id') o.evalId = process.argv[++i];
  else if (a === '--lan') o.lan = Number(process.argv[++i]);
  else if (a === '--root') o.root = path.resolve(process.argv[++i]);
  else if (a === '--ghi') o.ghi = true;
  else if (a === '--quet') o.quet = true;
  else usage(`cờ lạ ${a}`);
}
if (!o.slug) usage('thiếu --slug');
if (!o.quet && (!Number.isInteger(o.round) || !o.evalId)) usage('thiếu --round / --eval-id (hoặc dùng --quet)');
if (!(o.lan >= 2)) usage('--lan phải ≥ 2 — một lần chạy không phân biệt được ngẫu nhiên với hạ tầng');

const F = path.join(o.root, '_acceptance', o.slug, 'run-log.jsonl');
if (!fs.existsSync(F)) die(`không có ${F}`);
const dong = fs.readFileSync(F, 'utf8').trim().split('\n').map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
if (o.quet) {
  // CHỈ lượt chấm MỚI NHẤT. Quét toàn sổ là sai: nhật ký chỉ-nối-thêm, nên một lần
  // đỏ THẬT ở lượt n (đã sửa xong ở lượt n+1) nằm đó mãi và phép đo không bao giờ
  // xanh lại — tạo áp lực khai một màu đỏ thật thành `ha-tang`, hoặc xoá dòng khỏi
  // sổ. Nó còn tự quy chiếu: chính dòng đỏ của lần chạy này thành một dòng chưa
  // phân lớp mới. Bắt được ở lượt chấm 2 của hồ sơ release-2-12-0.
  const luotMax = Math.max(...dong.filter(d => d.round).map(d => d.round));
  // Ô ĐÃ GỠ KHỎI evals.yaml không còn là việc của phép đo này: một phép đo bị xoá
  // vì nó hỏng thì dòng đỏ của nó là sử liệu, không phải nợ. Nhưng KHÔNG bỏ qua
  // lặng: id ấy PHẢI có tên trong sổ quyết định, nếu không thì đây là xoá-cho-xanh.
  const ws = path.join(o.root, '_acceptance', o.slug);
  let dangKhai = null;
  try {
    const y = fs.readFileSync(path.join(ws, 'evals.yaml'), 'utf8');
    dangKhai = new Set([...y.matchAll(/^\s*-\s*id:\s*(\S+)/gm)].map(m => m[1]));
  } catch { dangKhai = null; }
  let so = '';
  try { so = fs.readFileSync(path.join(ws, 'decisions.jsonl'), 'utf8'); } catch { so = ''; }
  const daGo = [], goKhongTen = [];
  const do_ = dong.filter(d => {
    if (d.kind || typeof d.exit_code !== 'number' || d.exit_code === 0 || d.round !== luotMax) return false;
    if (dangKhai && !dangKhai.has(d.evalId)) {
      if (so.includes(d.evalId)) { daGo.push(d.evalId); return false; }
      goKhongTen.push(d.evalId); return true;
    }
    return true;
  });
  if (goKhongTen.length) process.stderr.write(`CANH BAO: ${goKhongTen.join(', ')} khong con trong evals.yaml VA khong co ten trong so quyet dinh — xoa-cho-xanh?\n`);
  const recheck = dong.filter(d => d.kind === 'infra-recheck');
  const chuaPhanLop = [], laVat = [];
  for (const d of do_) {
    const r = recheck.find(x => x.round === d.round && x.evalId === d.evalId);
    if (!r) chuaPhanLop.push(`round ${d.round}/${d.evalId}`);
    else if (r.lop !== 'ha-tang') laVat.push(`round ${d.round}/${d.evalId} = ${r.lop}`);
  }
  const ket = { luot: luotMax, daGoKhoiEvals: daGo, dongDo: do_.length, daPhanLop: do_.length - chuaPhanLop.length, chuaPhanLop, laVat };
  process.stdout.write(JSON.stringify(ket) + '\n');
  if (chuaPhanLop.length) { process.stderr.write(`DO: ${chuaPhanLop.length} dong may DO chua phan lop: ${chuaPhanLop.join(', ')}\n`); process.exit(1); }
  if (laVat.length) { process.stderr.write(`DO: ${laVat.length} dong do phan lop la VAT (khong phai ha tang): ${laVat.join(', ')}\n`); process.exit(1); }
  process.stdout.write(`PASS: luot ${luotMax} co ${do_.length} dong may do, tat ca da phan lop va deu la ha-tang\n`);
  process.exit(0);
}
const goc = dong.filter(d => d.round === o.round && d.evalId === o.evalId);
if (goc.length !== 1) die(`nhật ký có ${goc.length} dòng cho round ${o.round} / ${o.evalId}, cần đúng 1`);
const g = goc[0];
if (!g.cmd) die(`dòng gốc không mang trường cmd — không biết chạy lại cái gì`);
if (g.exit_code === 0) die(`dòng gốc đã XANH (exit 0) — không có gì để phân lớp`);

process.stderr.write(`[phân lớp] lệnh gốc round ${o.round} ${o.evalId} exit ${g.exit_code}\n[phân lớp] ${g.cmd}\n`);
const ma = [];
for (let i = 1; i <= o.lan; i++) {
  const r = cp.spawnSync('bash', ['-c', g.cmd], { cwd: o.root, encoding: 'utf8', env: process.env });
  ma.push(r.status);
  process.stderr.write(`[phân lớp] lần ${i}: exit ${r.status}\n`);
}
const xanhCaN = ma.every(x => x === 0);
const lop = xanhCaN ? 'ha-tang' : 'vat';
process.stderr.write(`[phân lớp] KẾT: ${lop}\n`);

if (o.ghi) {
  const line = JSON.stringify({
    ts: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    sha: cp.execFileSync('git', ['-C', o.root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    round: o.round, kind: 'infra-recheck', evalId: o.evalId,
    run_id: `${g.run_id}-recheck`,
    goc_exit: g.exit_code, chay_lai_exit: ma, lop,
    cmd: g.cmd,
  });
  fs.appendFileSync(F, line + '\n');
  process.stderr.write(`[phân lớp] đã nối 1 dòng vào run-log.jsonl\n`);
}
process.stdout.write(JSON.stringify({ round: o.round, evalId: o.evalId, goc_exit: g.exit_code, chay_lai_exit: ma, lop }) + '\n');
process.exit(xanhCaN ? 0 : 1);
