// Vòng đời đợt (spec workflow §3) — MỘT bên viết của `dieu-khien.json`. Mọi lần đặt pha đi qua `datPha`;
// không phiên nào sửa tay tệp này. Bảng chuyển là của DP2 (bốn pha); DP4 thêm hai pha ★ vào CÙNG bảng.
import path from 'node:path';
import { docJson, ghiJsonNguyenTu } from './dot.mjs';
import { bayGio } from './song.mjs';

export const TEP_DIEU_KHIEN = 'dieu-khien.json';
export const PHA = ['nhap', 'dang-chay', 'tam-dung', 'dang-dong', 'dang-ban-giao', 'cho-tiep-tuc'];
export const PHA_SAO = ['dang-ban-giao', 'cho-tiep-tuc'];
export const CHUYEN = {
  nhap: ['dang-chay'],
  'dang-chay': ['tam-dung', 'dang-dong', 'dang-ban-giao'],
  'tam-dung': ['dang-chay', 'dang-dong', 'dang-ban-giao'],
  'dang-dong': [],
  // DP4 (design chỗ chọn 1): vào bàn giao từ đang chạy hoặc tạm dừng; mọi lối rời đi qua cho-tiep-tuc — một chỗ
  // dựng và lưu bàn giao — rồi về đúng pha trước bàn giao.
  'dang-ban-giao': ['cho-tiep-tuc'],
  'cho-tiep-tuc': ['dang-chay', 'tam-dung', 'dang-dong'],
};

const maBanGiao = (ms) => `bg-${new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}`;

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

// Cùng pha → không làm gì (chạy lại được). Ngoài bảng → ném, tệp không đổi. Vào dang-ban-giao ghi khối `ban_giao`
// (mã, pha trước, lúc vào, lý do, ai đặt); khối giữ qua cho-tiep-tuc và gỡ khi rời hai pha ★.
// `tuMerge` (DP7 AC-5): quyền tự merge người trả ở thẻ khởi tạo — chỉ đặt được khi chuyển sang `dang-chay`,
// rồi sống qua mọi lần đổi pha sau. Vắng trường = null ở bên đọc (`tho`) = không tự merge.
export function datPha(thuMuc, sang, { boi = 'cli', lyDo = '', nowMs = null, tuMerge } = {}) {
  if (!PHA.includes(sang)) throw new Error(`pha: «${sang}» không phải một pha (${PHA.join(', ')})`);
  if (tuMerge !== undefined && typeof tuMerge !== 'boolean') throw new Error(`pha: tu_merge phải là true/false, nhận «${tuMerge}»`);
  if (tuMerge !== undefined && sang !== 'dang-chay') throw new Error('pha: --tu-merge chỉ đặt khi chuyển sang dang-chay');
  const cu = docPha(thuMuc);
  const giuMerge = tuMerge !== undefined ? { tu_merge: tuMerge } : typeof cu.tu_merge === 'boolean' ? { tu_merge: cu.tu_merge } : {};
  if (cu.pha === sang) {
    if (tuMerge !== undefined && cu.tu_merge !== tuMerge && !cu.cu) ghiJsonNguyenTu(path.join(thuMuc, TEP_DIEU_KHIEN), { ...cu, ...giuMerge });
    return { doi: false, pha: sang };
  }
  if (!(CHUYEN[cu.pha] ?? []).includes(sang)) throw new Error(`pha: ${cu.pha} → ${sang} không có trong bảng chuyển`);
  const ms = bayGio(nowMs);
  const luc = new Date(ms).toISOString();
  let banGiao = cu.ban_giao ?? null;
  if (sang === 'dang-ban-giao') banGiao = { ma: maBanGiao(ms), pha_truoc: cu.pha, vao_luc: luc, ly_do: lyDo, boi };
  else if (!PHA_SAO.includes(sang)) banGiao = null;
  ghiJsonNguyenTu(path.join(thuMuc, TEP_DIEU_KHIEN), {
    pha: sang,
    nguon_goi: cu.nguon_goi ?? null,
    ...giuMerge,
    dat_boi: boi,
    dat_luc: luc,
    ly_do: lyDo,
    ...(banGiao ? { ban_giao: banGiao } : {}),
    lich_su: [...(cu.lich_su ?? []), { pha: sang, dat_boi: boi, dat_luc: luc, ly_do: lyDo }],
  });
  return { doi: true, pha: sang, tu: cu.pha };
}
