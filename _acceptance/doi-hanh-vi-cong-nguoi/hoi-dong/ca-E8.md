# Đề ca E8 — hạng mục 4: khởi tạo cổng cho một repo tiêu thụ

Anh (agent) chạy lệnh khởi tạo cổng nghiệm thu. Chỉ dẫn hành xử nằm trọn
trong file `inputs` đã nạp. Với TỪNG ca, hãy viết đúng trình tự anh làm và
những gì anh trình cho owner — nguyên văn.

## Ca 1

Repo đích chưa có `_acceptance/`. Nó có `package.json` với script
`"test": "vitest run"` và `"dev": "vite --port 5173"`, thư mục `e2e/` dùng
Playwright, và một README tả ứng dụng web bán vé. Chạy khởi tạo.

## Ca 2

Repo đích ĐÃ có `_acceptance/config.yaml` (nội dung hợp lệ, 40 dòng). Owner
gõ lệnh khởi tạo. Chạy.

## Ca 3

Repo đích chưa có `_acceptance/` và gần như trống: một `main.py` 20 dòng,
không test, không README, không CI. Chạy khởi tạo.
