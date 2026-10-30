# Hạt giống — tệp sinh mỗi hàng một dòng để forge tự gộp được

Gốc: acceptance-gate-kit/_acceptance/tep-sinh-khong-chan-gop/ — giới hạn đã khai của vòng: «trên web GitHub PR vẫn báo
xung đột ở tệp sinh (forge không chạy driver máy)». Đề nghị (1) của M5 ở kit #308 (29/10); phiên điều phối MacBook Pro hứa
ghi vào hạt giống để chủ kho gọi tên cho vòng sau bản vá (kit #308, 29/10). Hồ sơ mốc `release-2-36-0` trích lại tên tệp
này ở `## Notes`.

## Người dùng gặp gì

Vòng `tep-sinh-khong-chan-gop` (2.36.0) làm lần gộp nhánh chính vào nhánh PR **tại máy** không còn dừng ở
`PRODUCT-MAP.md` và `LO-TRINH.html` — nhưng GitHub tính trạng thái gộp phía máy chủ, bỏ qua driver. Hai PR sửa hai hồ sơ
khác nhau vẫn để PR sau báo xung đột trên web, nên phiên phải gộp lại tại máy chỉ để GitHub thôi báo. Gốc của xung đột:
`LO-TRINH.html` nhúng trọn khối dữ liệu `lo-trinh-du-lieu` trên **một dòng** (đo 30/10 trên kit: dòng 136, 220 729 ký
tự) — hai PR đổi hai hàng khác nhau của lộ trình vẫn chạm đúng một dòng ấy, gộp văn bản ba bên của git không tách được.

## Hướng

Bộ vẽ ghi khối JSON nhúng **mỗi hàng một dòng, thứ tự ổn định** (theo thứ tự của tệp lộ trình, không theo thời điểm hay
trạng thái), và rà `PRODUCT-MAP.md` cùng luật (mỗi hồ sơ một dòng, thứ tự theo slug trong từng ô). Khi đó hai PR đổi hai
hàng chạm hai dòng khác nhau, và gộp văn bản — của git tại máy lẫn của forge — tự xong mà không cần driver. Dòng đếm
chung vẫn đổi theo mọi PR (ví dụ «Sắp mở vòng<br/>4 việc» ở sơ đồ đầu `PRODUCT-MAP.md`) — phải bỏ hay dời khỏi tệp sinh,
kẻo mọi PR lại cùng chạm nó. Đường đọc-cũ: bộ đọc khối (`docDuLieu`,
cả bản chép ở kho tiêu thụ) đọc JSON nên không đổi; khuôn dữ liệu giữ nguyên, chỉ đổi cách xuống dòng. Ca đo: dựng hai
nhánh đổi hai hàng, `git merge-tree` không báo xung đột ở hai tệp sinh khi KHÔNG khai driver; chiều đỏ trên bản vẽ cũ.

## Vì sao chưa làm

Là CỘNG (đổi khuôn tệp sinh mà mọi kho tiêu thụ chép qua lớp chép CI) — cần chủ kho gọi tên, và theo luật chiều rộng (b)
đi sau mốc 2.36.0 khi một kho đã nhận. Đề nghị (2) của M5 («PR không mang bản sinh, `--check` chỉ trên nhánh chính») trùng
đề xuất 2 của hạt giống 16/10 — không ghi lại ở đây.
