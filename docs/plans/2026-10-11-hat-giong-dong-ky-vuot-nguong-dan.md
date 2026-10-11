# Hạt giống — dòng lệnh ký của thẻ Cổng 2 vượt ngưỡng dán, lệnh ký chết im

Gốc: `_acceptance/dieu-phoi-doi-tai-khoan/` (Cổng Bằng chứng 11/10/2026 — dòng sổ ghi sự kiện ký hai lần không
chạy; thẻ có 26 mục «Ngoài hợp đồng»). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài (ngưỡng ở
cuối).

## Lỗ

Thẻ Cổng 2 in dòng lệnh ký (`one_shot`) liệt TỪNG mục `Ngoài-<số>: <lối>`, nên độ dài tăng theo số mục: thẻ DP4
in 812 ký tự. App desktop gói phần DÁN dài thành một khối chữ dán, tin mở đầu bằng khối đó chứ không bằng «/», nên
lệnh không chạy — không lỗi, không báo, chủ kho tưởng đã ký. Đo trên bản ghi phiên (Điều phối M5, 11/10): dán 805–816
ký tự bị gói (hai lần ký DP4); dán 314 · 324 · 346 · 766 · 780 ký tự chạy được — ngưỡng ≈ 800. Lần thứ ba chạy vì
chủ kho gõ tay tên lệnh rồi dán 780 ký tự còn lại. Giá: hai lượt gọi người ngoài thiết kế cho một chữ «ký».

## Hướng

Dòng ký gọn theo ý muốn, không theo cú pháp (North Star: người gõ Ý MUỐN, máy dịch thành trường hồ sơ):
- gom mục theo lối thay vì liệt từng mục — ví dụ `KL: 5-8,10,13-24,26; HĐ: 1-4,9,11,12,25`; hoặc
- một chữ «ký theo khuyến nghị» khi người nhận mọi đề xuất máy đã điền sẵn, chỉ ghi riêng mục người đổi.

Răng đi kèm: thẻ đo độ dài `one_shot` của chính nó và chọn dạng gọn khi vượt ngưỡng; cặp ca hai chiều (26 mục →
dòng dưới ngưỡng và lệnh ký đọc ra đúng 26 định đoạt · 2 mục → dạng cũ không đổi). Không sửa thẻ trong vòng DP4.

Ngưỡng mở ô: ≥1 lần nữa lệnh ký (hay duyệt) không chạy vì dòng dán bị gói thành khối, có bản ghi phiên làm neo.
