// Khung chẩn đoán đợt (spec workflow §4, nguyên tắc 4): danh sách mục {muc, trang_thai, viec}. Mỗi lệnh
// `/dieu-phoi:…` gọi chẩn đoán trước, làm đúng các mục `thieu`, rồi gọi lại. Chỉ đọc — không ghi tệp nào.
// DP2 dựng khung với sáu mục; DP3 thêm các mục của «tiếp tục».
import fs from 'node:fs';
import path from 'node:path';
import { gocKhoChinh, timThuMucDot } from './dot.mjs';
import { timGoi } from './goi-dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { TEP_SONG_DIR } from './song.mjs';
import { docVai } from './vai.mjs';
import { keHoachDay } from './tiep-tuc.mjs';
import { viecCho } from './viec-cho.mjs';

export const MUC = ['co-dot', 'pha', 'phat-lich', 'goi-dot', 'hang-viec', 'vai'];

const pidSong = (thuMuc) => {
  const p = path.join(thuMuc, 'phat-lich.pid');
  const pid = Number(fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : 0);
  if (!pid) return 0;
  try {
    process.kill(pid, 0);
    return pid;
  } catch {
    return 0;
  }
};

const VIEC_KHAI_GOI = 'khai `dieu_phoi.goi_dot` trong `_acceptance/config.yaml` của kho hoặc gọi `mo <tên> --goi <thư mục gói>`';

// `mo`: tên đợt SẮP mở (lệnh người hỏi trước khi chạy `mo`). Kho chưa có đợt thì mục `goi-dot` được tính
// từ khoá/cờ — chỉ đọc — để lệnh dừng TRƯỚC khi `mo` dựng một đợt tay. Gọi trơn thì như cũ (AC-6).
export function chanDoan(cwd, { mo = null, goi = null, phien = null, chiTiet = false, nowMs = null } = {}) {
  const thuMuc = timThuMucDot(cwd);
  const muc = (m, trangThai, viec = '') => ({ muc: m, trang_thai: trangThai, viec });
  if (!thuMuc) {
    const ra = [muc('co-dot', 'thieu', 'chưa có đợt nào đang chạy — mở bằng /dieu-phoi:mo-dot <tên>'), ...MUC.slice(1).map((m) => muc(m, 'khong-ap'))];
    if (mo) {
      let dir = null;
      try {
        dir = timGoi(gocKhoChinh(cwd), mo, goi);
      } catch {}
      ra[MUC.indexOf('goi-dot')] = !dir
        ? muc('goi-dot', 'thieu', `kho chưa khai gói đợt — ${VIEC_KHAI_GOI}`)
        : fs.existsSync(dir)
          ? muc('goi-dot', 'du', dir)
          : muc('goi-dot', 'thieu', `không có thư mục gói ${dir} — ${VIEC_KHAI_GOI}`);
    }
    return ra;
  }
  const ra = [muc('co-dot', 'du')];
  const dk = docPha(thuMuc);
  if (dk.pha === 'nhap') ra.push(muc('pha', 'thieu', 'trình thẻ khởi tạo; người duyệt xong thì `pha dang-chay` rồi `chay`'));
  else if (dk.pha === 'dang-dong') ra.push(muc('pha', 'thieu', 'đợt đang đóng — chạy `dong` sau khi merge dở xong'));
  else ra.push(muc('pha', 'du', dk.pha));
  const pid = pidSong(thuMuc);
  if (dk.pha === 'nhap') ra.push(muc('phat-lich', 'khong-ap', 'chưa chạy bộ phát lịch khi đợt còn nháp'));
  else ra.push(pid ? muc('phat-lich', 'du', `pid ${pid}`) : muc('phat-lich', 'thieu', 'chạy `chay`'));
  ra.push(
    dk.nguon_goi
      ? muc('goi-dot', 'du', dk.nguon_goi)
      : muc('goi-dot', 'thieu', `đợt dựng tay — ${VIEC_KHAI_GOI}`),
  );
  try {
    docHangViec(thuMuc);
    ra.push(muc('hang-viec', 'du'));
  } catch (e) {
    ra.push(muc('hang-viec', 'thieu', e.message));
  }
  const vai = docVai(thuMuc);
  if (dk.cu || !dk.nguon_goi) ra.push(muc('vai', 'khong-ap', 'đợt không mở từ gói'));
  else ra.push(vai?.giam_sat ? muc('vai', 'du', vai.giam_sat.phien ?? '(chưa ghi mã phiên)') : muc('vai', 'thieu', 'vai.json vắng — mở lại đợt từ gói'));
  // DP3: mục giám sát, hook của phiên, việc chờ. Mục giữ đúng ba khoá của DP2; dữ liệu có cấu trúc chỉ ra
  // ở `chi_tiet` khi người gọi xin (`--chi-tiet`).
  const them = (m, trangThai, viec, chiTietMuc) => ra.push(chiTiet && chiTietMuc ? { ...muc(m, trangThai, viec), chi_tiet: chiTietMuc } : muc(m, trangThai, viec));
  const giamSat = vai?.giam_sat?.phien ?? null;
  if (!phien) them('giam-sat', 'khong-ap', 'gọi với --phien để biết phiên này có phải giám sát');
  else if (giamSat === phien) them('giam-sat', 'du', phien);
  else them('giam-sat', 'thieu', `giám sát hiện tại là ${giamSat ?? '(chưa ai)'} — chạy /dieu-phoi:tiep-tuc để nhận vai`);
  if (!phien) them('hook-phien', 'khong-ap', 'gọi với --phien để kiểm hook của phiên này');
  else if (fs.existsSync(path.join(thuMuc, TEP_SONG_DIR, `${phien}.json`))) them('hook-phien', 'du', 'hook của gói đã bắn trong phiên này');
  else them('hook-phien', 'thieu', 'hook của gói chưa bắn trong phiên này — kiểm gói dieu-phoi đã cài cho kho và phiên đã nạp lại');
  let keHoach = [];
  try {
    keHoach = keHoachDay(thuMuc, { nowMs });
  } catch {
    keHoach = [];
  }
  for (const k of keHoach) {
    const { day, viec, ...chi } = k;
    them(`day:${day}`, k.hanh_dong === 'khong' ? 'du' : 'thieu', k.ghi_danh ? `${viec} — ${k.ghi_danh}` : viec, chi);
  }
  const ds = viecCho(thuMuc, { thucLuc: vai?.giam_sat?.thuc_luc ?? null });
  them('viec-cho', ds.length ? 'thieu' : 'du', ds.length ? `${ds.length} việc chờ — cũ nhất: ${ds[0].mo_ta}` : 'không có việc chờ', { ds });
  return ra;
}
