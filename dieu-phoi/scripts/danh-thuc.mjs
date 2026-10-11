// Đánh thức phiên giám sát (spec workflow §5, design DP3 §3 chỗ chọn 9) — quyết của phiên ngắn lịch 30′.
// Chỉ đọc. Chỉ nhắn hay gọi người khi CÓ việc chờ: giám sát rảnh mà không có việc thì không ai bị gọi.
// Có việc chờ và thức cũ hơn 40′: giám sát còn nhịp sống → nhắn nó; không nhịp sống quá 10′ → báo chủ kho.
import path from 'node:path';
import { PHUT_MS } from './cau-hinh.mjs';
import { docJson, timThuMucDot } from './dot.mjs';
import { conSong, TEP_SONG_DIR, tuoiMs } from './song.mjs';
import { docVai } from './vai.mjs';
import { viecCho } from './viec-cho.mjs';

export const DANH_THUC = { khong: 'khong', nhanGiamSat: 'nhan-giam-sat', baoChuKho: 'bao-chu-kho' };
export const NGUONG_THUC_MS = 40 * PHUT_MS;

export function danhThuc(cwd, { nowMs = null } = {}) {
  const thuMuc = timThuMucDot(cwd);
  const kq = (hanhDong, lyDo, phien = null, cau = '') => ({ hanh_dong: hanhDong, phien, cau, ly_do: lyDo });
  if (!thuMuc) return kq(DANH_THUC.khong, 'không có đợt nào đang chạy');
  const gs = docVai(thuMuc)?.giam_sat ?? null;
  const ds = viecCho(thuMuc, { thucLuc: gs?.thuc_luc ?? null });
  if (ds.length === 0) return kq(DANH_THUC.khong, 'không có việc chờ');
  const thuc = gs?.thuc_luc ?? gs?.nhan_luc ?? null;
  if (thuc && tuoiMs(thuc, nowMs) < NGUONG_THUC_MS) return kq(DANH_THUC.khong, 'giám sát vừa thức', gs?.phien ?? null);
  const nhip = gs?.phien ? docJson(path.join(thuMuc, TEP_SONG_DIR, `${gs.phien}.json`), null) : null;
  if (!conSong(nhip, nowMs)) {
    return kq(DANH_THUC.baoChuKho, `${ds.length} việc chờ và giám sát không có nhịp sống — chạy lại vai giám sát`, gs?.phien ?? null, '/dieu-phoi:tiep-tuc');
  }
  return kq(DANH_THUC.nhanGiamSat, `${ds.length} việc chờ, giám sát thức cũ hơn 40′`, gs.phien, 'thức: chạy `/dieu-phoi:tiep-tuc --nhe`');
}
