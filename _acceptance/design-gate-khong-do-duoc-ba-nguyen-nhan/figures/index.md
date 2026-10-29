# Hình tại Cổng Phạm vi — design-gate-khong-do-duoc-ba-nguyen-nhan

| Điểm | Đếm | Hình |
|---|---|---|
| Lớp lọc phát hiện tương phản (sổ d-20261027T035923Z-2, -5) | ba nhánh rẽ + thứ tự phán quyết | `luong-loc.html` |
| Hỏi-1: thêm job CI design-eval (sổ d-20261027T035956Z-7) | dưới ngưỡng: 2 lối, mỗi lối 1 bước | — |
| Trang CSS không áp được mà không phát hiện giữ PASS (sổ d-20261027T035956Z-3) | dưới ngưỡng: 1 nhánh | — |
| Hạng T3 thay T2 (sổ d-20261027T040321Z-11) | dưới ngưỡng: 1 bước | — |

## Đề bài `luong-loc`

- Loại: lưu đồ quyết định, trái → phải.
- Nút: «phát hiện tương phản P0» → «chữ cắt theo nền gradient?» (có → nhãn chữ-gradient) → không → «nền trong lời báo là trắng
  mặc định mà một tổ tiên khai nền không đọc được?» (có → nhãn nền-tổ-tiên) → không → «trang có CSS không áp được?» (có →
  thêm nhãn css, áp cho mọi phát hiện tương phản của trang) → không nhãn nào: phát hiện ĐO ĐƯỢC.
- Nhánh cuối: còn phát hiện chặn đo được → CHẶN (mã 2) · không còn mà có phát hiện mang nhãn → KHÔNG ĐO ĐƯỢC (mã 0; 5 khi
  bật chế độ chặt) · không có gì → ĐẠT.
- Nhãn bằng chữ tiếng Việt, không tên hàm.
- AC liên quan: AC-1…AC-6.
