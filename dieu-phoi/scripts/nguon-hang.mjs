// Nguồn hàng từ lộ trình của kho (spec workflow §14 chỗ nối 1). Gói không nạp mã của kit: luật suy slug
// là bản chép của `suySlug` trong scripts/lo-trinh.mjs của kit — ca DP2-08 round-trip so hai bản.

// Slug suy TẤT ĐỊNH từ câu giao: bỏ dấu, đ→d, chữ thường, ký tự khác chữ-số thành «-», sáu từ đầu.
export function suySlug(cauGiao) {
  const tu = String(cauGiao || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  return tu.slice(0, 6).join('-');
}
