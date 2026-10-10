// Đổi kế hoạch trong đợt (spec workflow §4.6) — bên viết duy nhất của `hang-viec.json` sau khi mở đợt.
// Đây là lớp phủ của đợt; đổi kế hoạch lâu dài là PR vào tệp lộ trình (§14 chỗ nối 5). Mỗi lần đổi thật
// thêm đúng một dòng Nhật ký và một sự kiện; chạy lại cùng lệnh là việc không làm gì.
import fs from 'node:fs';
import path from 'node:path';
import { ghiJsonNguyenTu, ghiSuKien } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { suySlug } from './nguon-hang.mjs';

const TIEU_DE_NHAT_KY = '## Nhật ký';

// Chèn một dòng ngay dưới tiêu đề Nhật ký của LUAT.md (thiếu tiêu đề thì thêm vào cuối).
export function ghiNhatKy(thuMuc, cau) {
  const p = path.join(thuMuc, 'LUAT.md');
  const cu = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const dong = `- ${new Date().toISOString()} ${cau}`;
  const dsDong = cu.split('\n');
  const i = dsDong.findIndex((d) => d.trim() === TIEU_DE_NHAT_KY);
  if (i < 0) fs.writeFileSync(p, `${cu.replace(/\s*$/, '')}\n\n${TIEU_DE_NHAT_KY}\n${dong}\n`);
  else {
    dsDong.splice(i + 1, 0, dong);
    fs.writeFileSync(p, dsDong.join('\n'));
  }
}

// Khoá vắng (`undefined`) từng khớp mọi hàng không mang `ma` — S4-r1 lượt 2. Đối số phải là chuỗi có chữ.
const coChu = (x) => typeof x === 'string' && x.trim() !== '';
const can = (x, ten) => {
  if (!coChu(x)) throw new Error(`hang: thiếu ${ten}`);
};
const timHang = (hv, khoa) => (coChu(khoa) ? hv.hang.find((h) => h.ma === khoa || h.slug === khoa) : undefined);
const luu = (thuMuc, hv, cau, suKien) => {
  ghiJsonNguyenTu(path.join(thuMuc, 'hang-viec.json'), hv);
  ghiNhatKy(thuMuc, cau);
  ghiSuKien(thuMuc, { loai: 'doi-ke-hoach', ...suKien });
};

export function dayLen(thuMuc, khoa, truocKhoa) {
  can(khoa, 'mã hàng cần đẩy');
  can(truocKhoa, '--truoc <mã>');
  const hv = docHangViec(thuMuc);
  const h = timHang(hv, khoa);
  if (!h) throw new Error(`hang: không có hàng ${khoa}`);
  const truoc = timHang(hv, truocKhoa);
  if (!truoc) throw new Error(`hang: không có hàng ${truocKhoa}`);
  const mucTruoc = truoc.uu_tien ?? 99;
  if ((h.uu_tien ?? 99) < mucTruoc) return { doi: false };
  h.uu_tien = mucTruoc - 1;
  luu(thuMuc, hv, `đẩy ${khoa} lên trước ${truocKhoa}`, { kieu: 'day-len', hang: h.slug, truoc: truoc.slug, uu_tien: h.uu_tien });
  return { doi: true };
}

export function themHang(thuMuc, khoa, day) {
  can(khoa, 'mã hoặc việc cần thêm');
  can(day, '--day <dãy>');
  const hv = docHangViec(thuMuc);
  if (!hv.day.some((d) => d.id === day)) throw new Error(`hang: không có dãy ${day}`);
  const slug = timHang(hv, khoa)?.slug ?? suySlug(khoa);
  if (!slug) throw new Error(`hang: không suy được slug từ «${khoa}»`);
  if (hv.hang.some((h) => h.day === day && (h.slug === slug || h.ma === khoa))) return { doi: false };
  hv.hang.push({ slug, day });
  luu(thuMuc, hv, `thêm việc ${khoa} cho ${day}`, { kieu: 'them', hang: slug, day });
  return { doi: true, slug };
}

export function choNghi(thuMuc, day) {
  can(day, 'dãy cần cho nghỉ');
  const hv = docHangViec(thuMuc);
  const d = hv.day.find((x) => x.id === day);
  if (!d) throw new Error(`hang: không có dãy ${day}`);
  if (d.nghi === true) return { doi: false };
  d.nghi = true;
  luu(thuMuc, hv, `cho ${day} nghỉ`, { kieu: 'nghi', day });
  return { doi: true };
}
