// Đánh thức phiên giám sát (spec workflow §5, design DP3 §3 chỗ chọn 9) — quyết của phiên ngắn lịch 30′.
// Chỉ đọc. Chỉ nhắn hay gọi người khi CÓ việc chờ: giám sát rảnh mà không có việc thì không ai bị gọi.
// Có việc chờ và thức cũ hơn 40′: giám sát còn nhịp sống → nhắn nó; không nhịp sống quá 10′ → báo chủ kho.
// TC1: nhịp đọc bằng `nhipCuaPhien` (mã app của vai nối với tệp nhịp mang mã CLI). Vai mang `hook_thieu_luc` (phiên
// giám sát chạy không có hook của gói) và không nhịp → leo thang theo lúc thức: tới 80′ nhắn giám sát, quá 80′ báo chủ kho.
import { PHUT_MS } from './cau-hinh.mjs';
import { timThuMucDot } from './dot.mjs';
import { conSong, nhipCuaPhien, tuoiMs } from './song.mjs';
import { docVai } from './vai.mjs';
import { viecCho } from './viec-cho.mjs';

export const DANH_THUC = { khong: 'khong', nhanGiamSat: 'nhan-giam-sat', baoChuKho: 'bao-chu-kho' };
export const NGUONG_THUC_MS = 40 * PHUT_MS;
export const NGUONG_THUC_LEO_MS = 2 * NGUONG_THUC_MS;
const CAU_HOOK = 'phiên giám sát chạy không có hook của gói (mở trước khi cài hay nâng gói) — mở phiên giám sát mới rồi chạy /dieu-phoi:tiep-tuc';

export function danhThuc(cwd, { nowMs = null } = {}) {
  const thuMuc = timThuMucDot(cwd);
  const kq = (hanhDong, lyDo, phien = null, cau = '') => ({ hanh_dong: hanhDong, phien, cau, ly_do: lyDo });
  if (!thuMuc) return kq(DANH_THUC.khong, 'không có đợt nào đang chạy');
  const gs = docVai(thuMuc)?.giam_sat ?? null;
  const ds = viecCho(thuMuc, { thucLuc: gs?.thuc_luc ?? null });
  if (ds.length === 0) return kq(DANH_THUC.khong, 'không có việc chờ');
  const thuc = gs?.thuc_luc ?? gs?.nhan_luc ?? null;
  if (thuc && tuoiMs(thuc, nowMs) < NGUONG_THUC_MS) return kq(DANH_THUC.khong, 'giám sát vừa thức', gs?.phien ?? null);
  const nhip = gs?.phien ? nhipCuaPhien(thuMuc, { phien: gs.phien, phienCli: gs.phien_cli ?? null }) : null;
  if (!nhip && gs?.hook_thieu_luc) {
    if (thuc && tuoiMs(thuc, nowMs) < NGUONG_THUC_LEO_MS) return kq(DANH_THUC.nhanGiamSat, `${ds.length} việc chờ, giám sát không có hook của gói`, gs.phien, CAU_HOOK);
    return kq(DANH_THUC.baoChuKho, `${ds.length} việc chờ, giám sát không có hook của gói và không đáp tin đã nhắn`, gs.phien, CAU_HOOK);
  }
  if (!conSong(nhip, nowMs)) {
    return kq(DANH_THUC.baoChuKho, `${ds.length} việc chờ và giám sát không có nhịp sống — chạy lại vai giám sát`, gs?.phien ?? null, '/dieu-phoi:tiep-tuc');
  }
  return kq(DANH_THUC.nhanGiamSat, `${ds.length} việc chờ, giám sát thức cũ hơn 40′`, gs.phien, 'thức: chạy `/dieu-phoi:tiep-tuc --nhe`');
}
