---
slug: xuat-du-lieu-lo-trinh
at: 2026-10-08T08:40:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Hồ sơ nhận, dấu theo lời, cờ, đã bác, hồ sơ ngoài kế hoạch không được so với trang; tập khoá tự quy chiếu hằng số của bên viết | khối ghi ngoai_lo_trinh rỗng hay cờ chưa dịch mà mọi eval vẫn xanh, trang CRM hiện sai | E2 so đủ trục B + mutant ngoai-rong và co-chua-dich; E1 so khuôn với bảng viết sẵn từ design | fixed: AC-1, AC-2, E1, E2 mở rộng |
| P1 | contract | Luật so ngày của tài liệu không được đối chiếu với script nội tuyến của trang | đúng ngày mốc hoặc khác múi giờ thì CRM và trang nói khác nhau | chạy script trang trong vm với ngày cố định D−1, D, D+1 ở hai múi giờ, so với bản chiếu áp luật tài liệu | fixed: AC-12 + E12 mới, luật đặt trong khối marker |
| P1 | evals | Nhóm tiến độ chỉ so tổng, không có ma trận mọi trạng thái | một trạng thái xếp sai nhóm, lệch bù làm tổng vẫn bằng | ma trận toàn phần chữ trạng thái × nhóm, so từng hàng | fixed: E2 thêm LT-111 nhom + mutant doi-nhom |
| P2 | contract | Kế hoạch hợp lệ 0 hàng không có ca nào | khối thiếu khoá hoặc lượt vẽ ném khi tệp rỗng | thêm tệp 0 hàng vào kho thử LT-110 và LT-112 | fixed: AC-1, E1 |
| P2 | evals | Đo thoát chữ bằng đếm chuỗi chữ thường | </SCRIPT > chữ hoa cắt khối sớm mà eval xanh | payload chữ hoa, assert khối không còn ký tự < | fixed: AC-8, E8 + mutant chu-thuong |
