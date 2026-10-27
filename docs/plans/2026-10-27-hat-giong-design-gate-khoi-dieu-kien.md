# Hạt giống — cổng thiết kế dom: chữ dải màu và nền tối trong khối điều kiện vẫn bị chặn oan

**Ngày:** 2026-10-27 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Quyết:** chủ kho chọn «mở hợp đồng mới» cho
Ngoài-5 và Ngoài-8 ở Cổng Bằng chứng lượt 4 của hồ sơ `_acceptance/design-gate-khong-do-duoc-ba-nguyen-nhan/` (sổ quyết
định, dòng `stage: gate2` mang `decision: "Ngoài-5: mở hợp đồng mới"` và `"Ngoài-8: mở hợp đồng mới"`).
Gốc: `_acceptance/design-gate-khong-do-duoc-ba-nguyen-nhan/` — mục rà soát Ngoài-5, Ngoài-8 của lượt chấm S4 #3, tệp
`lib/design-detect.mjs`.

jsdom 24 chỉ áp một khối `@media` khi danh sách media có đúng `screen`; nó bỏ `@supports`, `@media all` và mọi truy vấn
tính năng như `(min-width: 768px)`. Trình duyệt thật lại vẽ các khối ấy trên màn hình. Hai hệ quả đo được ở lượt 3:

- Chữ cắt theo dải màu (`background-clip: text`) viết trong `@supports (-webkit-background-clip: text)` hay một khối
  `@media` có truy vấn tính năng: nhánh chữ gradient không thấy nó, cổng REJECT «text #f9f9f9 on #ffffff» như trước vòng.
- Nền tối khai trong các khối ấy: nhánh nền (chỉ đọc style jsdom đã tính) cũng không thấy, phát hiện tương phản sai
  vẫn REJECT.

Không tệ hơn trước FL1, nhưng là chặn oan trên một cách viết phổ biến. Hướng đã cân ở vòng FL1: bộ đọc chữ luật có phân
biệt khối «trình duyệt vẽ trên màn hình» (`@supports`, `@media` không có `print` và không có `prefers-color-scheme:
dark`) — chính là lớp lỗi «bộ đọc chữ CSS tự viết» mà vòng FL1 đã dừng vá hai lần; vòng sau nên đo trên trang thật của
kho tiêu thụ trước khi chọn.

**Mở thành ô khi:** một kho tiêu thụ gặp REJECT tương phản giả trên trang có khối điều kiện, hoặc chủ kho gọi tên.
