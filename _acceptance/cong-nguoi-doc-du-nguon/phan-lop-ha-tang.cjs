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

const o = { lan: 2, root: CAY, ghi: false };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a === '--slug') o.slug = process.argv[++i];
  else if (a === '--round') o.round = Number(process.argv[++i]);
  else if (a === '--eval-id') o.evalId = process.argv[++i];
  else if (a === '--lan') o.lan = Number(process.argv[++i]);
  else if (a === '--root') o.root = path.resolve(process.argv[++i]);
  else if (a === '--ghi') o.ghi = true;
  else usage(`cờ lạ ${a}`);
}
if (!o.slug || !Number.isInteger(o.round) || !o.evalId) usage('thiếu --slug / --round / --eval-id');
if (!(o.lan >= 2)) usage('--lan phải ≥ 2 — một lần chạy không phân biệt được ngẫu nhiên với hạ tầng');

const F = path.join(o.root, '_acceptance', o.slug, 'run-log.jsonl');
if (!fs.existsSync(F)) die(`không có ${F}`);
const dong = fs.readFileSync(F, 'utf8').trim().split('\n').map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
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
