# Hạt giống — bộ đọc ngày ký nhận dạng ngày/tháng/năm, phép đo trên dữ liệu thật không lọc bỏ ca đỏ

Gốc: `_acceptance/cau-tin-hieu-nguoi-gui/` (Cổng Bằng chứng ký 13/10/2026 — Ngoài-12 và Ngoài-13, cùng gốc,
owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài.

## Lỗ

Bộ đọc ngày ký của câu cho người gửi (`ngayKy`, `scripts/tin-hieu.mjs`) chỉ nhận chuỗi YYYY-MM-DD trong
`human_signoff`. Ở crm @`06e34d26c`: 214/227 chữ ký dạng năm-tháng-ngày, **1** dạng «10/09/2026», 12 trống.
Tín hiệu gắn đúng hồ sơ dạng ngày/tháng/năm thì câu mất ngày giao và `--cau` đỏ «chữ ký không đọc được ngày»
— phiên gom không tự gỡ được. Phép đo dữ liệu thật (`rang/do-crm.mjs`) chọn hồ sơ phủ có ngày ISO nên không chạm ca này.

## Hướng

Bộ đọc nhận thêm n/t/năm (dd/mm/yyyy) — luật «khoan dung khi đọc»; phép đo dữ liệu thật thêm một ca dùng chính hồ
sơ dạng ngày/tháng/năm của crm, cặp hai chiều (bản đọc chỉ ISO → đỏ nêu hồ sơ).

Ngưỡng mở ô: ≥1 lượt gom thật của crm có tín hiệu gắn hồ sơ ký dạng ngày/tháng/năm — hoặc kho thứ hai ghi chữ ký
không theo dạng ISO.
