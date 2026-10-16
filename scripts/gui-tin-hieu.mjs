#!/usr/bin/env node
// gui-tin-hieu.mjs — người gửi MỘT ý vào cửa tín hiệu của kho (lệnh /road-map:gui; hồ sơ cua-tin-hieu-giua-chien-dich,
// hàng RM3, B′ §11). Cùng bộ ghi với bộ xét của đợt (`ghiVaoCua` của gói điều phối) — một khuôn tệp cho thợ và người.
//
//   node scripts/gui-tin-hieu.mjs --root <kho> --noi-dung "<câu>"     (hoặc --noi-dung - : đọc câu từ stdin)
//   thoát 0 đã ghi · 1 kho chưa khai cửa · 2 gọi sai (câu rỗng, tham số lạ) · 3 không ghi được
//
// Tên tệp `nguoi-<tên git>-<n>.json`, n = số lớn nhất đang có + 1; tệp cùng tên đã có (gửi đồng thời) → lấy số kế.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { CAU_DA_GHI, docCua, ghiVaoCua } from '../dieu-phoi/scripts/cua-tin-hieu.mjs';
import { kiemYeuCau } from '../dieu-phoi/scripts/hinh-dang.mjs';

const bail = (ma, m) => { process.stderr.write(`gui-tin-hieu: ${m}\n`); process.exit(ma); };
const a = process.argv.slice(2);
let root = null; let noiDung = null;
for (let i = 0; i < a.length; i += 1) {
  if (a[i] === '--root' && i + 1 < a.length) { root = a[++i]; continue; }
  if (a[i] === '--noi-dung' && i + 1 < a.length) { noiDung = a[++i]; continue; }
  bail(2, `tham số lạ ${a[i]} — nhận --root <kho> --noi-dung "<câu>" (hoặc --noi-dung - để đọc stdin)`);
}
if (!root) bail(2, 'thiếu --root <kho>');
if (noiDung === '-') noiDung = fs.readFileSync(0, 'utf8');
const cau = String(noiDung ?? '').trim();
if (!cau) bail(2, 'câu rỗng — gửi một câu nói điều anh gặp');

root = path.resolve(root);
const cua = docCua(root);
if (!cua) {
  process.stdout.write('kho chưa khai cửa tín hiệu — khai khối tin_hieu (nguon, gom) trong _acceptance/config.yaml rồi gửi lại\n');
  process.exit(1);
}

const tenGit = (() => { try { return execFileSync('git', ['-C', root, 'config', 'user.name'], { encoding: 'utf8' }).trim(); } catch { return ''; } })();
const slug = String(tenGit).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const phien = `nguoi-${slug || 'chu-kho'}`;
const soCo = () => {
  let ds = [];
  try { ds = fs.readdirSync(cua.nguon); } catch { ds = []; }
  const re = new RegExp(`^${phien}-(\\d+)\\.json$`);
  return Math.max(0, ...ds.map((f) => Number((re.exec(f) || [])[1] || 0)));
};
const yc = { phien, loai: 'tin-hieu', hang: null, noi_dung: { tieu_de: cau }, luc: new Date().toISOString() };
kiemYeuCau(yc);

let n = soCo() + 1;
for (let lan = 0; lan < 50; lan += 1, n += 1) {
  const id = `${phien}-${n}`;
  try {
    const r = ghiVaoCua(cua, id, yc);
    if (r.ket === 'moi') {
      process.stdout.write(`${CAU_DA_GHI} — ${path.relative(root, r.tep).split(path.sep).join('/')}\n`);
      process.exit(0);
    }
  } catch (e) {
    bail(3, `không ghi được vào cửa tín hiệu — ${e.code ?? e.message}`);
  }
}
bail(3, 'không tìm được số trống trong 50 lần thử');
