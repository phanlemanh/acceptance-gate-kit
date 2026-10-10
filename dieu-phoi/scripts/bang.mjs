import { moHinh } from './mo-hinh.mjs';

const thoat = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const lienKet = (link, chu) => (/^(claude|https):\/\//.test(link ?? '') ? `<a href="${thoat(link)}">${thoat(chu)}</a>` : thoat(chu));
const bang = (dau, hang) =>
  `<table><tr>${dau.map((d) => `<th>${thoat(d)}</th>`).join('')}</tr>${hang.map((h) => `<tr>${h.map((o) => `<td>${o}</td>`).join('')}</tr>`).join('')}</table>`;

// Bảng đợt vẽ từ CÙNG mô hình với `xem` (mo-hinh.mjs).
export function veBang(tt, tuyChon = {}) {
  const m = moHinh(tt, tuyChon);
  const canhBao = [];
  if (m.giam_tai) canhBao.push(`<p class="do">GIẢM TẢI — ${thoat(m.ly_do_giam_tai.join('; '))}</p>`);
  if (m.can_nguoi) canhBao.push(`<p class="do">Cần anh: ${thoat(m.can_nguoi)}</p>`);
  if (m.cho_may) canhBao.push(`<p class="do">S4 chờ khoá máy — kho đang giữ: ${thoat(m.cho_may)}</p>`);
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="30">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Đợt ${thoat(m.dot)}</title>
<style>body{font-family:system-ui,sans-serif;background:#f5f5f5;color:#2d3142;margin:0;padding:1.5rem}
table{border-collapse:collapse;background:#fff;margin:.5rem 0 1.25rem;width:100%}th,td{border-bottom:1px solid #ddd;padding:.4rem .6rem;text-align:left;font-size:.9rem}
th{background:#ececec;font-size:.75rem;text-transform:uppercase}.do{color:#b3261e;font-weight:600}h2{font-size:1.05rem;margin:1rem 0 .25rem}</style></head><body>
<h1>Đợt ${thoat(m.dot)} · pha ${thoat(m.pha)} · ${thoat(m.trang_thai)}</h1><p>Nhịp cuối ${thoat(m.nhip_cuoi)}</p>${canhBao.join('')}
<h2>Hộp quyết định</h2>${bang(['Phiên', 'Loại', 'Tin', 'Từ'], m.cho_nguoi.map((c) => [lienKet(c.link, c.phien), thoat(c.loai), thoat(c.tin), thoat(c.luc)]))}
<h2>Phiên thợ</h2>${bang(['Phiên', 'Hàng', 'Tiến độ', 'Kế hoạch', 'Chờ'], m.day.map((d) => [lienKet(d.link, d.id), thoat(d.hang), thoat(d.tien_do), thoat(d.nhom_ke_hoach), thoat(d.cho)]))}
<h2>Khoá đang giữ</h2>${bang(['Tài nguyên', 'Phiên', 'Hạn thuê'], m.khoa.map((k) => [thoat(k.tai_nguyen), thoat(k.phien), thoat(k.han)]))}
<h2>Hàng chờ lượt</h2>${bang(['Phiên', 'Loại', 'Xin lúc'], m.hang_cho.map((h) => [thoat(h.phien), thoat(h.loai), thoat(h.luc)]))}
</body></html>
`;
}
