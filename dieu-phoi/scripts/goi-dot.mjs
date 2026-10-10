// Gói đợt của kho (spec workflow §4.1): `dieu-phoi.config.json` · `hang-viec.json` · `LUAT-rieng.md` trong
// git của kho. Đường đọc từ cờ `--goi`, vắng thì từ khoá `dieu_phoi.goi_dot` của `_acceptance/config.yaml`
// (`{ten}` thay bằng tên đợt). Gói không ghi cứng đường nào của một kho cụ thể.
import fs from 'node:fs';
import path from 'node:path';
import { kiemCauHinh, kiemHangViec } from './hinh-dang.mjs';
import { docHangLoTrinh } from './nguon-hang.mjs';

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

// Gói khai `nguon_hang` (§14 chỗ nối 1): hàng của đợt là các hàng thi công của gói mang mã có trong nguồn,
// slug điền từ lộ trình; hàng nguồn không có phần thi công trong gói thì bỏ kèm cảnh báo. Đọc lộ trình
// lỗi → giữ hàng khai tay (có slug) và nói ra đúng một dòng.
function apNguonHang(hangViec, nguon, gocKho) {
  const canhBao = [];
  const { hang: tuLoTrinh, loi } = docHangLoTrinh(gocKho, nguon);
  if (loi) {
    return { hangViec: { ...hangViec, hang: (hangViec.hang ?? []).filter((h) => h?.slug) }, canhBao: [`mo: ${loi} — dùng hàng khai tay của gói`] };
  }
  const slugCua = new Map(tuLoTrinh.map((h) => [h.ma, h.slug]));
  const hang = [];
  for (const h of hangViec.hang ?? []) {
    if (h?.ma && slugCua.has(h.ma)) hang.push({ ...h, slug: slugCua.get(h.ma) });
    else if (h?.slug) hang.push(h);
  }
  for (const { ma } of tuLoTrinh) if (!hang.some((h) => h.ma === ma)) canhBao.push(`mo: hàng ${ma} của lộ trình chưa có phần thi công (dãy) trong gói — bỏ qua`);
  return { hangViec: { ...hangViec, hang }, canhBao };
}

// Đọc và kiểm khuôn TRỌN gói trước khi ai tạo thư mục nào.
export function docGoi(dir, { gocKho = null } = {}) {
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
  let hangViec = doc('hang-viec.json');
  let canhBao = [];
  if (cfg.nguon_hang && gocKho) ({ hangViec, canhBao } = apNguonHang(hangViec, cfg.nguon_hang, gocKho));
  hangViec = kiemHangViec(hangViec);
  const luatRieng = fs.readFileSync(path.join(dir, 'LUAT-rieng.md'), 'utf8');
  return { cfg, hangViec, luatRieng, canhBao };
}

export const ghepLuat = (khuon, rieng) => `${khuon.replace(/\s*$/, '\n')}\n${rieng}`;
