// Khoá ghi + Nhật ký của `hang-viec.json` — tách khỏi hang.mjs (hồ sơ ky-den-gop) để bộ phát lịch ghi được `sau` mà
// không nạp vòng hang.mjs → tiep-tuc.mjs → … → phat-lich.mjs. hang.mjs xuất lại cả ba như trước.
import fs from 'node:fs';
import path from 'node:path';
import { ghiJsonNguyenTu, ghiSuKien } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';

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

export const luu = (thuMuc, hv, cau, suKien) => {
  ghiJsonNguyenTu(path.join(thuMuc, 'hang-viec.json'), hv);
  ghiNhatKy(thuMuc, cau);
  ghiSuKien(thuMuc, { loai: 'doi-ke-hoach', ...suKien });
};

// Khoá ghi của `hang-viec.json` (DP8, design chỗ chọn 2e): tám chip bấm gần nhau thì tám `ghi-danh` cùng đọc-sửa-ghi.
// Mọi bên viết của tệp này bọc đọc-sửa-ghi (kể cả dòng Nhật ký CHÍNH chúng ghi; `pha` và `nhat-ky` ghi Nhật ký
// ngoài khoá — giới hạn đã khai, hạt giống) trong khoá thư mục `hang-viec.khoa`: mkdir nguyên tử,
// chờ tối đa 10″, khoá cũ hơn 30″ là của tiến trình đã chết. `DIEU_PHOI_TRE_GHI_MS` chỉ ca đo đặt: trễ giữa đọc và
// ghi để ép tranh chấp.
export const TEP_KHOA_HANG_VIEC = 'hang-viec.khoa';
const CHO_KHOA_MS = 10_000;
const KHOA_BO_ROI_MS = 30_000;
const ngu = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
export const treThu = () => {
  const ms = Number(process.env.DIEU_PHOI_TRE_GHI_MS);
  if (ms > 0) ngu(ms);
};

export function voiKhoaHangViec(thuMuc, viec) {
  const d = path.join(thuMuc, TEP_KHOA_HANG_VIEC);
  const het = Date.now() + CHO_KHOA_MS;
  for (;;) {
    try {
      fs.mkdirSync(d);
      break;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
    }
    let tuoi = 0;
    try {
      tuoi = Date.now() - fs.statSync(d).mtimeMs;
    } catch {
      continue;
    }
    if (tuoi > KHOA_BO_ROI_MS) {
      fs.rmSync(d, { recursive: true, force: true });
      continue;
    }
    if (Date.now() > het) throw new Error(`hang: hang-viec.json đang bị khoá quá ${CHO_KHOA_MS / 1000}″ (${d}) — thử lại`);
    ngu(25);
  }
  try {
    return viec();
  } finally {
    fs.rmSync(d, { recursive: true, force: true });
  }
}

// Bên viết `sau` của bộ phát lịch khi chọn hàng kế thấy trùng tệp (C). Chỉ thêm, không gỡ; đã có thì không làm gì.
export function themSau(thuMuc, slug, day, trung) {
  return voiKhoaHangViec(thuMuc, () => {
    const hv = docHangViec(thuMuc);
    const h = hv.hang.find((x) => x.slug === slug && x.day === day);
    if (!h) return { doi: false };
    const khoaMinh = h.ma ?? h.slug;
    // Không dựng vòng chờ nhau: hàng kia đã chờ hàng này thì không bắt hàng này chờ lại.
    const choLai = (k) => hv.hang.some((x) => (x.ma ?? x.slug) === k && (x.sau ?? []).includes(khoaMinh));
    const moi = [...new Set(trung.map((t) => t.khoa))].filter((k) => !(h.sau ?? []).includes(k) && !choLai(k));
    if (moi.length === 0) return { doi: false };
    h.sau = [...(h.sau ?? []), ...moi];
    luu(thuMuc, hv, `${slug} chờ ${moi.join(', ')} gộp trước (trùng tệp)`, { kieu: 'them-sau', ly_do: 'trung-tep', hang: slug, day, sau: moi, trung: trung.filter((t) => moi.includes(t.khoa)) });
    return { doi: true, sau: moi };
  });
}

