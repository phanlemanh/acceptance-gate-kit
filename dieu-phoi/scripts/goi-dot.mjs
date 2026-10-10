// Gói đợt của kho (spec workflow §4.1): `dieu-phoi.config.json` · `hang-viec.json` · `LUAT-rieng.md` trong
// git của kho. Đường đọc từ cờ `--goi`, vắng thì từ khoá `dieu_phoi.goi_dot` của `_acceptance/config.yaml`
// (`{ten}` thay bằng tên đợt). Gói không ghi cứng đường nào của một kho cụ thể.
import fs from 'node:fs';
import path from 'node:path';
import { kiemCauHinh, kiemHangViec } from './hinh-dang.mjs';

export const TEP_GOI = ['dieu-phoi.config.json', 'hang-viec.json', 'LUAT-rieng.md'];

// Đọc theo dòng đúng một khoá lồng hai cấp — không nạp bộ đọc YAML nào (gói không phụ thuộc ngoài).
export function docKhoaGoiDot(gocKho) {
  let t;
  try {
    t = fs.readFileSync(path.join(gocKho, '_acceptance', 'config.yaml'), 'utf8');
  } catch {
    return null;
  }
  const dong = t.split('\n');
  const i = dong.findIndex((d) => /^dieu_phoi:\s*(#.*)?$/.test(d));
  if (i < 0) return null;
  for (let j = i + 1; j < dong.length; j++) {
    const d = dong[j];
    if (/^\S/.test(d)) break;
    const m = /^\s+goi_dot:\s*(.+?)\s*(#.*)?$/.exec(d);
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return null;
}

export function timGoi(gocKho, ten, coGoi = null) {
  if (coGoi) return path.resolve(gocKho, coGoi);
  const khoa = docKhoaGoiDot(gocKho);
  return khoa ? path.resolve(gocKho, khoa.split('{ten}').join(ten)) : null;
}

// Đọc và kiểm khuôn TRỌN gói trước khi ai tạo thư mục nào.
export function docGoi(dir) {
  for (const f of TEP_GOI) {
    if (!fs.existsSync(path.join(dir, f))) throw new Error(`goi-dot: thiếu ${f} trong ${dir}`);
  }
  const doc = (f) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    } catch (e) {
      throw new Error(`goi-dot: ${f} không phải JSON hợp lệ — ${e.message}`);
    }
  };
  const cfg = kiemCauHinh(doc('dieu-phoi.config.json'));
  const hangViec = kiemHangViec(doc('hang-viec.json'));
  const luatRieng = fs.readFileSync(path.join(dir, 'LUAT-rieng.md'), 'utf8');
  return { cfg, hangViec, luatRieng };
}

export const ghepLuat = (khuon, rieng) => `${khuon.replace(/\s*$/, '\n')}\n${rieng}`;
