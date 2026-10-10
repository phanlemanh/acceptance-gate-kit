// Lệnh đếm đợt (spec workflow §16 T14): số nền cho ngưỡng SỐNG/CHẾT của ô dù — số hàng gộp theo ngày và
// số lần gọi chủ kho (tổng và theo hàng). Đếm từ `su-kien.jsonl` mà bộ phát lịch ghi: `hang-gop` (một lần
// mỗi hàng), `cho-nguoi` (một lần mỗi tệp chờ người mới), `can-nguoi` gửi chủ kho (`dich: owner`).
import fs from 'node:fs';
import path from 'node:path';

export const LOAI_GOP = 'hang-gop';
export const LOAI_GOI = ['cho-nguoi'];

export function demDot(thuMuc) {
  const p = path.join(thuMuc, 'su-kien.jsonl');
  const suKien = fs.existsSync(p)
    ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).flatMap((d) => {
        try {
          return [JSON.parse(d)];
        } catch {
          return [];
        }
      })
    : [];
  const gopTheoNgay = {};
  const theoHang = {};
  let tong = 0;
  for (const e of suKien) {
    const ngay = String(e.luc ?? '').slice(0, 10);
    if (e.loai === LOAI_GOP) gopTheoNgay[ngay] = (gopTheoNgay[ngay] ?? 0) + 1;
    const laGoi = LOAI_GOI.includes(e.loai) || (e.loai === 'can-nguoi' && e.dich === 'owner');
    if (laGoi) {
      tong++;
      const khoa = e.hang ?? '(không gắn hàng)';
      theoHang[khoa] = (theoHang[khoa] ?? 0) + 1;
    }
  }
  return { gop_theo_ngay: gopTheoNgay, goi_chu_kho: { tong, theo_hang: theoHang } };
}
