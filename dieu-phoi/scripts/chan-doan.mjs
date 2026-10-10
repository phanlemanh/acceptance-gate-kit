// Khung chẩn đoán đợt (spec workflow §4, nguyên tắc 4): danh sách mục {muc, trang_thai, viec}. Mỗi lệnh
// `/dieu-phoi:…` gọi chẩn đoán trước, làm đúng các mục `thieu`, rồi gọi lại. Chỉ đọc — không ghi tệp nào.
// DP2 dựng khung với sáu mục; DP3 thêm các mục của «tiếp tục».
import fs from 'node:fs';
import path from 'node:path';
import { gocKhoChinh, timThuMucDot } from './dot.mjs';
import { timGoi } from './goi-dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { docVai } from './vai.mjs';

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
export function chanDoan(cwd, { mo = null, goi = null } = {}) {
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
  return ra;
}
