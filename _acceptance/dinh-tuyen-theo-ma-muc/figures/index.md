# Hình tại điểm quyết định — dinh-tuyen-theo-ma-muc (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Bộ phân giải dòng sổ → mục (design §3.2, sổ d-…-7, d-…-8) | 3 nhánh rẽ (có mã/chỉ số × cũ/không cũ × khớp/mồ côi) | `phan-giai.html` |
| Hỏi-1 lưới chặt hay khoan dung (sổ d-20261013T095811Z-5) | 2 nhánh rẽ | gộp vào `phan-giai.html` (dải dưới: hai lối + hệ quả) |
| Bỏ đặc-tả-UX (sổ d-…-6) | dưới ngưỡng: 0 nhánh | — |

## Đề bài `phan-giai.html`

- Loại hình: flowchart quyết định, trái → phải, kèm dải dưới «Hỏi-1» hai cột.
- Nút: «dòng sổ gate2 Ngoài-n» → rẽ «có tiêu đề (mã)?» → có: rẽ «ghi trước một lượt chấm?» (không → số khớp tiêu đề? → định tuyến / mồ côi + cờ; có → đúng một mục mang nhãn (rN) cùng mã? → định tuyến / mồ côi + cờ) · không: rẽ «ghi trước một lượt chấm?» (không → định tuyến theo số như cũ; có → CHƯA định tuyến + cờ vàng «ghi trước lượt chấm»).
- Mốc của dòng = giờ sớm nhất giữa `at` và giờ trong mã `d-<UTC>-<n>`; «lượt chấm» = dòng round-tally trong run-log.
- Dải Hỏi-1: cột «Chặt (khuyên)» — lưới VIOLATION hồ sơ máy-thông có dòng cũ; kit `tac-tu-cham-chi-cham-khong` xử trong PR (1 lệnh ký điền sẵn); crm `zalo-qua-webhook` xử khi nhận 2.29.1. Cột «Khoan dung» — lưới chỉ WARNING; 0 việc thêm; hai hồ sơ giữ trạng thái sai, hai bản dựng lệch.
- AC liên quan: AC-1, AC-2, AC-3, AC-4, AC-9.
