# Hình tại điểm quyết định — quet-het-han-khong-moi-ky

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — bộ quét lỗi thì thẻ hồ sơ máy-thông đi lối nào | hai nhánh rẽ (A đi tiếp · B hỏng to) → cần hình | hoi-1-hai-loi |
| Hạn quét theo cỡ kho (dòng sổ máy quyết) | một bước, không rẽ → dưới ngưỡng | — |
| Không làm bộ quét nhanh hơn (descope) | không rẽ → dưới ngưỡng | — |

## Đề bài hình `hoi-1-hai-loi`

- Loại: sơ đồ luồng rẽ nhánh (flowchart), ngang.
- Nút: «Dựng thẻ hồ sơ máy-thông» → «Bộ quét trả lời kịp?» — có → «đi tiếp hay kéo lại (đã kiểm sáu điều kiện)»; không (hết hạn · bị ngắt · thoát lỗi) → rẽ hai lối: **A (khuyến nghị)** «đi tiếp hay kéo lại + cờ vàng: lý do + lệnh chạy lại» · **B** «không ô quyết: chưa trình được + lệnh chạy lại».
- Nhánh phụ: «kho chưa dựng cổng» → «giữ lối mời ký cũ + cờ chưa ai kiểm» (không đổi).
- Nhãn bằng chữ tiếng Việt, đánh dấu A là khuyến nghị; ghi giá dưới B: «thẻ cửa veto vô dụng tới khi chạy lại».
- AC liên quan: AC-1, AC-2, AC-5.
