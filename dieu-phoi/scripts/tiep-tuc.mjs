// Phần tất định của «tiếp tục» (spec workflow §4.2, design DP3 §3): nhận vai giám sát, ghi lúc thức, chạy
// lại bộ phát lịch nếu đã chết, và kế hoạch từng dãy. Phiên chỉ làm việc của app theo đúng hành động CLI
// trả — không tự suy. KHÔNG đổi `pha` (chỗ chọn 5: hai trạng thái ★ thuộc DP4).
import { timThuMucDot } from './dot.mjs';
import { docPha } from './pha.mjs';
import { ghiThucLuc, laGiamSat, nhanVaiGiamSat } from './vai.mjs';

// `chay(cwd)` do CLI truyền vào (hàm chayPhatLich) để mô-đun này không nạp CLI.
export function tiepTuc(cwd, { phien, nhe = false, nowMs = null, chay = null }) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) throw new Error('tiep-tuc: không có đợt nào đang chạy');
  if (typeof phien !== 'string' || phien.trim() === '') throw new Error('tiep-tuc: cần --phien <mã phiên này>');
  if (nhe) {
    if (laGiamSat(thuMuc, phien) === false) return { dot: thuMuc, thoi_vai: true };
    ghiThucLuc(thuMuc, phien, { nowMs });
  }
  const vaiDoi = nhe ? false : nhanVaiGiamSat(thuMuc, { phien, worktree: cwd, nowMs }).doi;
  const pha = docPha(thuMuc).pha;
  const phatLich = pha === 'nhap' || !chay ? 'khong-chay' : chay(cwd);
  return { dot: thuMuc, thoi_vai: false, vai_doi: vaiDoi, pha, phat_lich: phatLich };
}
