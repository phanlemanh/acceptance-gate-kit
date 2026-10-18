// Lời giao việc sáu trường (hồ sơ vong-mo-co-chu-giu, thiết kế §3.4) — MỘT hàm cho `tin GIAO` và lời ghi danh của chip
// trong `tiep-tuc`. Máy điền năm trường từ hàng, hồ sơ, thư mục làm việc và cấu hình; người giao chỉ viết Ý định.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { docJson } from './dot.mjs';
import { hangKeTuTiep } from './lich.mjs';
import { docPha } from './pha.mjs';
import { DA_THONG } from './phat-lich.mjs';
import { docVai } from './vai.mjs';

// Chép từ hạt giống docs/plans/2026-10-17-hat-giong-luat-giao-tiep-giua-cac-phien.md §4.5.
export const DIEM_HOI = 'Phải HỎI (khai chặn): sắp chạm ngoài ranh giới · đổi lời một tiêu chí đã ký · việc khó đảo (gộp, cắt bản, xoá, đẩy lên kho khác) · hai nguồn nói trái nhau · lệnh giai đoạn trái với trạng thái git. Không hỏi: mọi thứ suy được từ ý định cộng luật đã khai cộng chính sách chủ kho.';
export const NHAN_LOI_GIAO = ['Ý định', 'Kết quả', 'Ranh giới', 'Quyền', 'Điểm phải hỏi', 'Báo về'];
// Trạng thái «đã xong» của hồ sơ: MỘT nguồn với bộ phát lịch.
const TRANG_THAI_XONG = new Set(DA_THONG);

// Sáu dòng có nhãn theo đúng thứ tự, rồi dòng hạn xong. Đầu vào giống nhau → đầu ra giống nhau từng byte.
export function loiGiaoViec({ y_dinh, ket_qua, ranh_gioi, quyen, diem_hoi = DIEM_HOI, bao_ve, han_xong_phut = null }) {
  const gt = [y_dinh, ket_qua, ranh_gioi, quyen, diem_hoi, bao_ve];
  const dong = NHAN_LOI_GIAO.map((n, i) => `${n}: ${String(gt[i] ?? '').replace(/\s*\n\s*/gu, ' ').trim()}`);
  dong.push(`Hạn xong: ${han_xong_phut != null ? `${han_xong_phut} phút sau khi nhận` : 'chưa có hạn'}`);
  return dong.join('\n');
}

// `https://github.com/chu/kho.git`, `git@github.com:chu/kho.git` → `chu/kho`. Không có remote → null.
export function khoCua(cwd) {
  let url;
  try {
    url = execFileSync('git', ['remote', 'get-url', 'origin'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
  const m = /github\.com[:/]+([^/]+\/[^/]+?)(?:\.git)?\/?$/u.exec(url);
  return m ? m[1] : url.replace(/\.git$/u, '');
}

export function trangThaiHoSoCua(worktree, slug) {
  try {
    return /^status:\s*(\S+)/mu.exec(fs.readFileSync(path.join(worktree, '_acceptance', slug, 'contract.md'), 'utf8'))?.[1] ?? null;
  } catch {
    return null;
  }
}

// Hàng của một dãy: hàng ĐANG CHẠY (hồ sơ có hợp đồng chưa xong trong worktree) → hàng kế → null.
export function hangCuaDay(thuMuc, hangViec, day) {
  const cuaDay = (hangViec.hang ?? []).filter((h) => h.day === day.id).sort((a, b) => (a.uu_tien ?? 99) - (b.uu_tien ?? 99));
  const dangChay = cuaDay.find((h) => {
    const tt = trangThaiHoSoCua(day.worktree, h.slug);
    return tt && !TRANG_THAI_XONG.has(tt);
  });
  if (dangChay) return dangChay;
  const ke = hangKeTuTiep(docJson(path.join(thuMuc, 'tiep', `${day.id}.json`), null), hangViec, day.id).hang;
  return ke ? (hangViec.hang ?? []).find((h) => h.slug === ke) ?? { slug: ke } : null;
}

// Giờ máy ước của hàng (du-bao.json của hồ sơ, hồ sơ lo-trinh-gio-may): cặp → cận trên, số → chính nó; vắng → null.
export function gioMayCua(worktree, slug) {
  const gm = docJson(path.join(worktree, '_acceptance', slug, 'du-bao.json'), null)?.hang?.gio_may;
  if (Array.isArray(gm) && Number.isFinite(gm[1])) return gm[1];
  return Number.isFinite(gm) ? gm : null;
}

export function vYDinhTuO(worktree, slug, gocKho = null) {
  for (const noi of [worktree, gocKho].filter(Boolean)) {
    try {
      const o = fs.readFileSync(path.join(noi, '_acceptance', slug, 'opportunity.md'), 'utf8');
      const m = /^Vì sao:\s*(.+)$/mu.exec(o);
      if (m) return m[1].trim();
    } catch {}
    try {
      const c = fs.readFileSync(path.join(noi, '_acceptance', slug, 'contract.md'), 'utf8');
      const m = /^feature:\s*(.+)$/mu.exec(c);
      if (m) return m[1].trim();
    } catch {}
  }
  return `đọc hồ sơ ${slug}`;
}

// Suy năm trường cho một lời giao trong đợt. `dich` = mã dãy. Trả {truong} hoặc {loi}.
// tuyChon: {yDinh (null → lấy từ ô cơ hội), hang (slug tường minh), ketQua, ranhGioi, hanXongPhut, tronHang}
export function suyLoiGiaoDot(thuMuc, hangViec, dich, { yDinh = null, hang = null, ketQua = null, ranhGioi = null, hanXongPhut = null, tronHang = false } = {}) {
  const day = (hangViec.day ?? []).find((d) => d.id === dich);
  const vai = docVai(thuMuc);
  const worktree = day?.worktree ?? vai?.giam_sat?.worktree ?? null;
  // Worktree chưa ghi danh (chỗ giữ của gói) → đọc kho và hồ sơ ở gốc kho chính, nơi ô của đợt mở từ gói nằm.
  const gocKho = path.dirname(path.dirname(thuMuc));
  const noiDoc = worktree && fs.existsSync(worktree) ? worktree : gocKho;
  const cfg = docJson(path.join(thuMuc, 'dieu-phoi.config.json'), {}) ?? {};
  const h = hang ? (hangViec.hang ?? []).find((x) => x.slug === hang) ?? { slug: hang } : day ? hangCuaDay(thuMuc, hangViec, day) : null;
  const kq = ketQua ?? (h ? `hồ sơ ${h.slug} qua Cổng Bằng chứng · PR vào ${cfg.nhanh_chinh ?? 'nhánh chính'}` : null);
  if (!kq) return { loi: 'không suy được Kết quả — dãy không có hàng đang chạy hay hàng kế; ghi --hang <slug> hoặc --ket-qua "<câu>"' };
  const kho = khoCua(noiDoc);
  const vung = h?.ranh_gioi?.length ? h.ranh_gioi.join(', ') : 'vùng tệp chưa khai — hỏi giám sát trước khi chạm ngoài hồ sơ';
  const rg = ranhGioi ?? (worktree ? `kho ${kho ?? '?'} · worktree ${worktree} · vùng ${vung}${cfg.bao_ve?.length ? ` · không chạm ${cfg.bao_ve.join(', ')}` : ''}` : null);
  if (!rg) return { loi: 'không suy được Ranh giới — ghi --ranh-gioi "<câu>"' };
  const tuMerge = docPha(thuMuc).tu_merge === true;
  const gm = hanXongPhut != null ? null : tronHang && h ? gioMayCua(noiDoc, h.slug) ?? gioMayCua(gocKho, h.slug) : null;
  return {
    slug: h?.slug ?? null,
    truong: {
      y_dinh: yDinh ?? (h ? vYDinhTuO(noiDoc, h.slug, gocKho) : ''),
      ket_qua: kq,
      ranh_gioi: rg,
      quyen: `${tuMerge ? 'tự gộp được' : 'không tự gộp'}; việc phụ qua yeu-cau viec-phu`,
      bao_ve: `giám sát ${vai?.giam_sat?.phien ?? '?'} qua tin — NHẬN · XONG`,
      han_xong_phut: hanXongPhut ?? (gm != null ? Math.round(gm * 60) : null),
    },
  };
}

// Kho ghi trong dòng «Ranh giới:» của một lời giao (`kho <chủ/kho>`), hoặc null.
export const khoTrongRanhGioi = (than) => /^Ranh giới:\s*kho (\S+)/mu.exec(String(than ?? '').normalize('NFC'))?.[1] ?? null;
