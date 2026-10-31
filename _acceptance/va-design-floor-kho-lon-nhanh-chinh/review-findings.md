# Review findings: va-design-floor-kho-lon-nhanh-chinh (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Usage header của S3 và S4 không ghi nguyên nhân thoát 1 mới (git không đọc được danh sách tệp), trong khi bac và S1 đã ghi (r1)**
  Người dùng thấy gì: Phần hướng dẫn ở đầu hai trong bốn lệnh kiểm tra giao diện chưa kể hết các lý do lệnh có thể dừng. Lệnh vẫn dừng đúng và báo đúng lỗi khi gặp sự cố, chỉ là người đọc hướng dẫn sẽ thấy thiếu một dòng.
  Căn cứ: Chỉ là chú thích còn thiếu, người dùng vẫn nhận đúng thông báo lỗi khi gặp sự cố, và bổ sung sau rất rẻ.
  file: `scripts/design-floor-s4.mjs`
  severity: low
  Đề xuất: known-limits

- **Bước S0 trong SKILL không nói phải làm gì khi lệnh bậc thoát 1, dù vòng này vừa thêm mã thoát đó (r1)**
  Người dùng thấy gì: Tài liệu hướng dẫn phiên làm việc chưa nói rõ nên dừng hay đi tiếp khi lệnh xác định bậc giao diện báo không đọc được danh sách tệp. Trường hợp này hiếm vì vòng làm việc vốn chạy trong kho git, và phiên làm việc vẫn thấy dòng báo lỗi rõ ràng.
  Căn cứ: Chỉ xảy ra khi kho git bị hỏng, hiếm gặp, hậu quả nhẹ vì lỗi được nói rõ, và bổ sung một dòng hướng dẫn sau này rất rẻ.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — ma trận đột biến LOP sinh từ chính bộ liệt kê của phép quét, không phải ma trận viết trước; quan hệ «số đột biến = số lời gọi» không được assert (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm tra giới hạn bộ nhớ khi lệnh chạy chỉ thấy những lời gọi viết theo cách quen thuộc. Nếu sau này ai đó viết lời gọi theo cách khác thì có thể lọt mà bộ kiểm vẫn báo xanh, nhưng hiện chưa có lời gọi nào bị sót.
  Căn cứ: Hiện không có lỗi thật nào lọt và người dùng không bị ảnh hưởng, rủi ro chỉ xuất hiện nếu mã đổi cách viết sau này, nên ghi lại như giới hạn đã biết là đủ.
  file: `tests/design-floor/kho-lon-nhanh-chinh.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).