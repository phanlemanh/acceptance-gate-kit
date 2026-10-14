// tep-cua-vong.mjs — vị từ «tệp của chính vòng» của đường nền (hồ sơ nen-khong-tinh-tep-cua-vong).
//
// MỘT chỗ: feature-loop/scripts/duong-nen.mjs và ca phát lại lịch sử NEN-TV8 nhập cùng hàm — ca
// không chép lại luật. Dòng mà vị từ nhận là của vòng thì vào mục «Dòng vàng» của duong-nen.md:
// vẫn có tên trên thẻ, không lật nền sang đỏ.
//
// Vì sao không mất chiều đỏ: suite không biết slug của vòng (slug sinh ở S0, sau mọi suite đã
// viết), nên không thể ghi vào một đường mang slug — trừ khi slug trùng tên một thư mục có sẵn,
// và vế 4 loại đúng ca ấy bằng câu hỏi «thư mục có ở HEAD không». Đánh đổi DUY NHẤT là vế 3:
// một suite ghi vào _acceptance/config.yaml sẽ hiện vàng (0/233 ca lịch sử, chủ kho ký 14/10).
const thoat = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * tepCuaVong(duong, slug, coOHead) — `duong` tương đối gốc kho, dấu `/`, đã cắt phần `cu -> `
 * của dòng đổi tên; `coOHead(thuMuc)` trả true khi thư mục ấy có ở HEAD.
 */
export function tepCuaVong(duong, slug, coOHead) {
  const p = String(duong);
  // 1. hồ sơ của vòng — guard trùng slug ở S0 bảo đảm thư mục này là của vòng này
  if (p.startsWith(`_acceptance/${slug}/`)) return true;
  // 2. khuôn tên S1/S2 kit đặt: design doc `YYYY-MM-DD-<slug>-design.md`, plan `YYYY-MM-DD-<slug>.md`
  const ten = p.split('/').pop();
  if (new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${thoat(slug)}(-design)?\\.md$`).test(ten)) return true;
  // 3. khoá executor S1 thêm cho vòng
  if (p === '_acceptance/config.yaml') return true;
  // 4. một đoạn thư mục đúng bằng slug mà thư mục ấy CHƯA có ở HEAD (bản mẫu design-pass)
  const doan = p.split('/').slice(0, -1);
  for (let i = 0; i < doan.length; i += 1) {
    if (doan[i] === slug && !coOHead(doan.slice(0, i + 1).join('/'))) return true;
  }
  return false;
}

/** viPhamCuaVong(dong, slug) — dòng lưới trước-merge mở đầu đúng `VIOLATION [<slug>]:`. */
export const viPhamCuaVong = (dong, slug) => String(dong).startsWith(`VIOLATION [${slug}]:`);
