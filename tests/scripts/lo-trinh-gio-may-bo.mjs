// lo-trinh-gio-may-bo.mjs — bỏ ĐÚNG phần giờ máy (hồ sơ lo-trinh-gio-may, hàng RM6) khỏi trang lộ trình và khỏi bản đồ
// /road-map:xem, để ca so-byte-với-bộ-máy-gốc của các hồ sơ trước (RS-6, MC-2-byte, AP-8) tiếp tục đo đúng điều chúng
// hứa — tính năng của CHÚNG không đổi đầu ra — sau khi giờ máy hiện mặc định ở mọi kho (chủ kho duyệt Hỏi-3, 15/10).
// Mỗi mẫu khớp đúng một hình phần tử bộ vẽ giờ máy sinh ra; phần khác của trang giữ nguyên từng byte. `coGioMay` là đối
// chứng: trang/bản đồ của bộ máy mới PHẢI mang phần giờ máy, không thì phép bỏ không bỏ gì và ca so mất nghĩa.
export const MAU_TRANG = [
  // Dòng giờ máy dưới câu giao: hàng có tên hồ sơ mang « · <span class="gm">…</span>» sau <code>; hàng không có thì cả dòng nhỏ
  // chỉ là giờ máy.
  / · <span class="gm">[^<]*<\/span>/g,
  /<div class="mu nho"><span class="gm">[^<]*<\/span><\/div>/g,
  / <span class="mu nho">— \d+\/\d+ hàng máy tự ước giờ máy — khai gio_may trên hàng để ghi đè[^<]*<\/span>(?=<\/h3>)/g,
  / <span class="mu nho">· (?:~[\d,–]+ giờ máy[^<]*?|dự báo lúc bắt đầu [^<]*?)<\/span>(?:<span class="co-o">mốc quá tải: [^<]*<\/span>)?/g,
  /<span class="co-o">mốc quá tải: [^<]*<\/span>/g,
];
// Khối dữ liệu máy đọc (hồ sơ lo-trinh-du-lieu-ngay-du-kien, hàng RM6c): bốn khoá giờ máy ở cuối object hàng/mốc —
// gỡ đúng bốn khoá rồi viết lại khối bằng cùng cách thoát của bộ vẽ, để khối bằng từng byte bộ máy trước RM6c. Trang không
// mang khoá nào thì trả nguyên văn (không viết lại).
const RE_KHOI = /(<script type="application\/json" id="lo-trinh-du-lieu">)([\s\S]*?)(<\/script>)/;
export function boKhoiGioMay(html) {
  const s = String(html ?? ''); const m = s.match(RE_KHOI); if (!m) return s;
  let o; try { o = JSON.parse(m[2]); } catch { return s; }
  let co = false;
  for (const t of Array.isArray(o.lo_trinh) ? o.lo_trinh : []) {
    for (const h of Array.isArray(t.hang) ? t.hang : []) if (h && 'gio_may' in h) { delete h.gio_may; co = true; }
    for (const mc of Array.isArray(t.moc) ? t.moc : []) for (const k of ['gio_may', 'du_kien', 'qua_tai']) if (mc && k in mc) { delete mc[k]; co = true; }
  }
  if (!co) return s;
  const viet = JSON.stringify(o).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return s.replace(RE_KHOI, (_, a, __, c) => `${a}${viet}${c}`);
}
export const coKhoiGioMay = html => /"gio_may":/.test((String(html ?? '').match(RE_KHOI) || [])[2] || '');
export const boGioMayTrang = html => boKhoiGioMay(MAU_TRANG.reduce((s, re) => s.replace(re, ''), String(html ?? '')));
export const coGioMayTrang = html => /<span class="gm">/.test(String(html ?? ''));
// Bản đồ xem: khối «Giờ máy theo mốc:» cùng các dòng «  · …» ngay sau nó.
export function boGioMayXem(dong) {
  const ra = []; let trong = false;
  for (const l of dong) {
    if (l === 'Giờ máy theo mốc:') { trong = true; continue; }
    if (trong && l.startsWith('  · ')) continue;
    trong = false; ra.push(l);
  }
  return ra;
}
