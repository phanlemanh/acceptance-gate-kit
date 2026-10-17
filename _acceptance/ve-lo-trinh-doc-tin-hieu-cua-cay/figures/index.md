# Hình tại Cổng Phạm vi — ve-lo-trinh-doc-tin-hieu-cua-cay

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1: đổi mặc định «trang chỉ lấy ý đã theo dõi» hay thêm khoá bật theo lựa chọn | 2 nhánh rẽ → cần hình | `hai-loai-bo-doc.png` |
| Hỏi-2: thu hẹp lời hứa AC-2 của RM3b (bỏ chân bộ vẽ) | đi cùng Hỏi-1 (cùng hình) | `hai-loai-bo-doc.png` |
| Đọc nội dung từ đĩa, không từ commit | dưới ngưỡng: 1 lối sống | — |
| Gốc không phải git đọc cả thư mục | dưới ngưỡng: 1 lối sống | — |

## Đề bài `hai-loai-bo-doc`

- Loại hình: luồng hai làn (trước/sau), nguồn chữ = design §1–§3.
- Nút: «Hộp ý chung (thư mục chính)» · «Cây đang vẽ (worktree / bản tải CI) — tệp ý đã theo dõi» · «Bộ đọc tương tác
  (thẻ khởi động, /road-map:xem, gom)» · «Bộ vẽ trang LO-TRINH.html» · «CI product-map --check».
- Làn 2.32.0: bộ vẽ ← hộp ý chung → trang ≠ CI → đỏ «lệch».
- Làn 2.32.1: bộ vẽ ← cây đang vẽ (đã theo dõi) → trang = CI → xanh; bộ đọc tương tác vẫn ← hộp ý chung.
- Nhãn chú: «ý chưa commit: hiện ở bộ đọc tương tác, lên trang khi commit» (AC-2, AC-3).
