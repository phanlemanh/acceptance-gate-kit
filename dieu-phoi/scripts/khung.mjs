// Hàm vẽ THUẦN của khung trạng thái đợt (DP6b, hồ sơ trang-thai-dot-dieu-phoi-tho, thiết kế §2.2). Phần mod
// `hooks/mod/khung.ts` import tệp này, mà module mod chỉ nhận tệp tương đối và `claude-code` — nên tệp này KHÔNG
// import gì. Đầu vào là kết quả `dieu-phoi.mjs xem --json` (hoặc `{ loi }` khi lời gọi CLI hỏng).

export const CHU_KY_MS = { co_dot: 20000, khong_dot: 120000 };
export const DONG_LOI = 'khung: không đọc được đợt';

// Nhịp làm mới: kho không có đợt thì thưa (120″); có đợt — kể cả lần đọc lỗi — thì 20″.
export const chuKy = (kq) => (kq && kq.dot === null ? CHU_KY_MS.khong_dot : CHU_KY_MS.co_dot);

// HH:MM của một mốc ISO theo độ lệch phút mà CLI báo: giờ máy của môi trường mod không đáng tin.
export function gioPhut(iso, lechPhut) {
  const ms = Date.parse(iso ?? '');
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms + (Number(lechPhut) || 0) * 60000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

// Dải một dòng trên ô nhập; `null` = không vẽ gì (kho không có đợt). `cot` cắt chuỗi, ký tự cuối là `…`.
export function veDai(kq, { cot } = {}) {
  if (!kq || kq.dot === null) return null;
  let s;
  if (kq.loi) s = DONG_LOI;
  else if (kq.chua_co_nhip) s = `Đợt ${kq.dot} · ${kq.pha} · chưa có nhịp`;
  else {
    const k = (kq.khoa ?? []).find((x) => x.tai_nguyen === 's4');
    const gio = k ? gioPhut(k.han, kq.mui_gio_phut) : null;
    const s4 = k ? `S4: ${k.phien}${gio ? ` → ${gio}` : ''}` : kq.cho_may ? 'S4: chờ khoá máy' : 'S4: trống';
    const can = (kq.cho_nguoi ?? []).length + (kq.can_nguoi ? 1 : 0);
    s = `Đợt ${kq.dot} · ${kq.pha} · ${s4} · chờ lượt ${(kq.hang_cho ?? []).length} · cần anh ${can}`;
    const d = kq.day_cua_cwd ? (kq.day ?? []).find((x) => x.id === kq.day_cua_cwd) : null;
    if (d) s += ` · Dãy ${d.id}: ${d.hang ?? '—'} · ${d.tien_do ?? '—'}`;
    if (kq.giam_tai) s = `GIẢM TẢI · ${s}`;
  }
  if (Number.isFinite(cot) && s.length > cot) s = cot >= 1 ? `${s.slice(0, cot - 1)}…` : '…';
  return s;
}
