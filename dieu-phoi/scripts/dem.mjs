// Lệnh đếm đợt (spec workflow §16 T14): số nền cho ngưỡng SỐNG/CHẾT của ô dù — số hàng gộp theo ngày và
// số lần gọi chủ kho (tổng và theo hàng). Đếm từ `su-kien.jsonl` mà bộ phát lịch ghi: `hang-gop` (một lần
// mỗi hàng), `cho-nguoi` (một lần mỗi tệp chờ người mới), `can-nguoi` gửi chủ kho (`dich: owner`).
// Hồ sơ ky-den-gop — thước «gộp được» (North Star 23/10): `ky_den_gop` trừ giờ commit chữ ký khỏi giờ commit gộp
// (cả hai do bộ phát lịch đọc từ nhánh chính lúc ghi `hang-gop`), `gop_vao_nhanh` đếm lần gộp nhánh chính vào nhánh
// mỗi PR, `ghim_lai_sau_ky` đếm lượt ghim lại được cấp cho hàng sau giờ ký, `gop` đếm lối của lệnh gộp. Hàng gộp mà
// không đọc được giờ ký (gộp squash, sự kiện của bản cũ) vào `chua_do` — không vào mẫu số.
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
  return { gop_theo_ngay: gopTheoNgay, goi_chu_kho: { tong, theo_hang: theoHang }, ...demKyDenGop(suKien) };
}

const trungVi = (ds) => {
  if (ds.length === 0) return null;
  const x = [...ds].sort((a, b) => a - b);
  const g = Math.floor(x.length / 2);
  return x.length % 2 ? x[g] : (x[g - 1] + x[g]) / 2;
};

function demKyDenGop(suKien) {
  const gop = suKien.filter((e) => e.loai === LOAI_GOP);
  const phut = {};
  const chuaDo = [];
  const vao = {};
  const ghim = {};
  for (const e of gop) {
    if (Number.isFinite(e.ky_den_gop_phut)) phut[e.hang] = e.ky_den_gop_phut;
    else chuaDo.push(e.hang);
    if (Number.isInteger(e.gop_vao_nhanh)) vao[e.hang] = e.gop_vao_nhanh;
    if (e.ky_luc) {
      const ky = Date.parse(e.ky_luc);
      ghim[e.hang] = suKien.filter((c) => c.loai === 'cap' && c.don === 'ghim-lai' && c.slug === e.hang && Date.parse(c.luc) > ky).length;
    }
  }
  const lenh = {};
  for (const e of suKien.filter((x) => x.loai === 'gop')) lenh[e.duong] = (lenh[e.duong] ?? 0) + 1;
  const ds = Object.values(phut);
  const tong = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  return {
    ky_den_gop: { so: ds.length, trung_vi_phut: trungVi(ds), lon_nhat_phut: ds.length ? Math.max(...ds) : null, theo_hang: phut, chua_do: chuaDo },
    gop_vao_nhanh: { tong: tong(vao), theo_hang: vao },
    ghim_lai_sau_ky: { tong: tong(ghim), theo_hang: ghim },
    gop: lenh,
  };
}
