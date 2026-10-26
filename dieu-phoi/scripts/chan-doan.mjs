// Khung chẩn đoán đợt (spec workflow §4, nguyên tắc 4): danh sách mục {muc, trang_thai, viec}. Mỗi lệnh
// `/dieu-phoi:…` gọi chẩn đoán trước, làm đúng các mục `thieu`, rồi gọi lại. Chỉ đọc — không ghi tệp nào.
// DP2 dựng khung với sáu mục; DP3 thêm các mục của «tiếp tục».
import fs from 'node:fs';
import path from 'node:path';
import { gocKhoChinh, timThuMucDot } from './dot.mjs';
import { timGoi } from './goi-dot.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';
import { lanDocHieuLuc } from './han-muc.mjs';
import { docPha } from './pha.mjs';
import { docNhipSong, nhipCuaPhien } from './song.mjs';
import { docVai } from './vai.mjs';
import { kiemMoiTruong } from './moi-truong.mjs';
import { keHoachDay, TRANG_THAI_HANH_DONG } from './tiep-tuc.mjs';
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
export function chanDoan(cwd, { mo = null, goi = null, phien = null, chiTiet = false, nowMs = null, tranMs = undefined } = {}) {
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
  // `--phien` là mã CLI của giám sát (TC1b): nói đúng tên, không mời nhận vai — nhận vai bằng mã CLI làm đánh thức nhắn
  // không tới.
  else if (phien === vai?.giam_sat?.phien_cli) them('giam-sat', 'thieu', `đây là mã CLI của giám sát hiện tại — gọi lại bằng mã app ${giamSat}; đừng nhận vai bằng mã CLI`);
  else them('giam-sat', 'thieu', `giám sát hiện tại là ${giamSat ?? '(chưa ai)'} — chạy /dieu-phoi:tiep-tuc để nhận vai`);
  // TC1: nhịp của phiên đọc bằng `nhipCuaPhien` — `--phien` mang mã app hay mã CLI đều nối được tệp nhịp.
  const phienCli = phien && giamSat === phien ? vai?.giam_sat?.phien_cli ?? null : null;
  if (!phien) them('hook-phien', 'khong-ap', 'gọi với --phien để kiểm hook của phiên này');
  else if (nhipCuaPhien(thuMuc, { phien, phienCli })) them('hook-phien', 'du', 'hook của gói đã bắn trong phiên này');
  else them('hook-phien', 'thieu', 'hook của gói chưa bắn trong phiên này — kiểm gói dieu-phoi đã cài cho kho và phiên đã nạp lại');
  // Đường đọc-cũ (TC1): vai đời trước giữ mã app (`local_…`), tệp nhịp chưa mang `ma_app` → không nối được; nói ra, không chặn.
  if (giamSat?.startsWith('local_') && !vai?.giam_sat?.phien_cli && !nhipCuaPhien(thuMuc, { phien: giamSat }) && docNhipSong(thuMuc).some((n) => !n.ma_app)) {
    them('vai-ma', 'vang', 'vai giữ mã app nhưng nhịp chưa mang mã app — chạy lại /dieu-phoi:tiep-tuc để vai ghi mã CLI');
  }
  let keHoach = [];
  try {
    keHoach = keHoachDay(thuMuc, { nowMs });
  } catch {
    keHoach = [];
  }
  for (const k of keHoach) {
    const { day, viec, ...chi } = k;
    const chu = k.ghi_danh ? `${viec} — ${k.ghi_danh}` : k.ly_do ? `${viec}: ${k.ly_do}` : viec;
    them(`day:${day}`, TRANG_THAI_HANH_DONG[k.hanh_dong] ?? 'thieu', chu, chi);
  }
  for (const m of kiemMoiTruong(thuMuc, { gocKho: gocKhoChinh(cwd), tranMs })) ra.push(m);
  const ds = viecCho(thuMuc, { thucLuc: vai?.giam_sat?.thuc_luc ?? null });
  // DP4: đợt khai ngưỡng hạn mức mà không còn lần đọc hiệu lực thì bộ phát lịch mù hạn mức — nói ra, kèm việc.
  let cfg = null;
  try {
    cfg = docCauHinh(thuMuc);
  } catch {
    cfg = null;
  }
  if (cfg?.han_muc) {
    const { lan } = lanDocHieuLuc(thuMuc, { nowMs });
    them('han-muc', lan ? 'du' : 'thieu', lan
      ? `${lan.nguon} lúc ${lan.luc}: ${Object.entries(lan.cua_so).map(([k, v]) => `${k} ${v.pct}%`).join(' · ')}`
      : 'không có lần đọc hạn mức còn hiệu lực — gọi `get_usage` rồi `han-muc --nguon get-usage --phien <mã phiên> --doc <kết quả>`');
  }
  them('viec-cho', ds.length ? 'thieu' : 'du', ds.length ? `${ds.length} việc chờ — cũ nhất: ${ds[0].mo_ta}` : 'không có việc chờ', { ds });
  return ra;
}
