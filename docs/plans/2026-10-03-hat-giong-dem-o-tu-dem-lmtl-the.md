# Hạt giống — ca LT-AC* đếm số ô ma trận bằng chính vòng lặp (phép so không thể đỏ)

**Ngày:** 2026-10-03 · **Trạng thái:** hạt giống (SỔ, chưa là ô).
Gốc: acceptance-gate-kit/_acceptance/lan-ghim-lai-theo-paths/ — Ngoài-8 của lượt chấm 3, owner định
tuyến «mở hợp đồng mới» ở Cổng Bằng chứng 03/10.

## Hình dạng

`tests/scripts/lmtl-the.test.mjs` (hồ sơ `loi-moi-tran-luot-loi-song-co-gia`): kiểm «số assert = số
hàng» bằng `n` tăng trong chính `for (… of H)` (dòng ~152 LT-AC1-lap; cùng hình dạng ~227 LT-AC9,
~249 LT-AC3, ~274 LT-AC6; ~182 LT-AC7 tự đếm từ cùng trường). Xoá một hàng ma trận, ca vẫn xanh.

## Hướng nghiệm (chưa chọn)

Hằng số ô viết TRƯỚC + ném «số ô lệch» khi lệch (khuôn P105 / `M_SO_O` của
`_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs`), kèm chiều đỏ xoá một hàng.

## Ngưỡng mở ô

Lần kế hồ sơ ấy bị chạm (ghim lại hoặc vòng sửa) — sửa cùng lượt; hoặc ≥ 1 lượt chấm khác bắt lại
đúng hình dạng này trong cùng tệp.
