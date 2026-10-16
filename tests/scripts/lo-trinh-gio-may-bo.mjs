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
export const boGioMayTrang = html => MAU_TRANG.reduce((s, re) => s.replace(re, ''), String(html ?? ''));
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
