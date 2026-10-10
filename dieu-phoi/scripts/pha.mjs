// Vòng đời đợt (spec workflow §3) — MỘT bên viết của `dieu-khien.json`. Mọi lần đặt pha đi qua `datPha`;
// không phiên nào sửa tay tệp này. Bảng chuyển là của DP2 (bốn pha); DP4 thêm hai pha ★ vào CÙNG bảng.
import path from 'node:path';
import { docJson, ghiJsonNguyenTu } from './dot.mjs';

export const TEP_DIEU_KHIEN = 'dieu-khien.json';
export const PHA = ['nhap', 'dang-chay', 'tam-dung', 'dang-dong'];
export const CHUYEN = {
  nhap: ['dang-chay'],
  'dang-chay': ['tam-dung', 'dang-dong'],
  'tam-dung': ['dang-chay', 'dang-dong'],
  'dang-dong': [],
};

// Đợt không có tệp (đợt dựng bằng bản cũ trước gói) đọc là đang chạy — đường đọc-cũ, không bắt migrate.
export function docPha(thuMuc) {
  const dk = docJson(path.join(thuMuc, TEP_DIEU_KHIEN), null);
  if (!dk) return { pha: 'dang-chay', nguon_goi: null, lich_su: [], cu: true };
  return dk;
}

export function khoiTaoPha(thuMuc, { pha, nguonGoi = null, boi = 'mo', lyDo = 'mở đợt' }) {
  if (!PHA.includes(pha)) throw new Error(`pha: «${pha}» không phải một pha (${PHA.join(', ')})`);
  const luc = new Date().toISOString();
  ghiJsonNguyenTu(path.join(thuMuc, TEP_DIEU_KHIEN), {
    pha,
    nguon_goi: nguonGoi,
    dat_boi: boi,
    dat_luc: luc,
    ly_do: lyDo,
    lich_su: [{ pha, dat_boi: boi, dat_luc: luc, ly_do: lyDo }],
  });
}

// Cùng pha → không làm gì (chạy lại được). Ngoài bảng → ném, tệp không đổi.
export function datPha(thuMuc, sang, { boi = 'cli', lyDo = '' } = {}) {
  if (!PHA.includes(sang)) throw new Error(`pha: «${sang}» không phải một pha (${PHA.join(', ')})`);
  const cu = docPha(thuMuc);
  if (cu.pha === sang) return { doi: false, pha: sang };
  if (!(CHUYEN[cu.pha] ?? []).includes(sang)) throw new Error(`pha: ${cu.pha} → ${sang} không có trong bảng chuyển`);
  const luc = new Date().toISOString();
  ghiJsonNguyenTu(path.join(thuMuc, TEP_DIEU_KHIEN), {
    pha: sang,
    nguon_goi: cu.nguon_goi ?? null,
    dat_boi: boi,
    dat_luc: luc,
    ly_do: lyDo,
    lich_su: [...(cu.lich_su ?? []), { pha: sang, dat_boi: boi, dat_luc: luc, ly_do: lyDo }],
  });
  return { doi: true, pha: sang, tu: cu.pha };
}
