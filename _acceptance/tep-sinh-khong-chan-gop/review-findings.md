# Review findings: tep-sinh-khong-chan-gop (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Thư mục rỗng trùng slug của một hàng lộ trình vẫn làm trang lộ trình lệch bản clone sạch, nên --check đỏ dù không ai sửa nguồn**
  Người dùng thấy gì: Nếu lệnh mở vòng cho một hàng lộ trình bị ngắt giữa chừng và để lại thư mục rỗng đúng tên hàng đó, trang lộ trình sẽ báo hàng ấy là hồ sơ hỏng và bước kiểm bản vẽ báo đỏ dù không ai sửa nguồn. Người dùng xoá thư mục rỗng đó là hết đỏ.
  Căn cứ: Hậu quả nhẹ: chỉ là một lần báo đỏ giả, không mất dữ liệu, người dùng tự gỡ được bằng cách xoá thư mục rỗng; ghi thành han chế đã biết rẻ hơn mở thêm vòng sửa ngoài hợp đồng đã duyệt.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ma trận thư mục của AC-6/AC-7 chỉ có điểm-case: thiếu ô «thư mục chỉ có tệp nằm trong thư mục con», nên nửa đệ quy của coTepTrongCay không phép đo nào giữ**
  Người dùng thấy gì: Hiện chưa có phép kiểm nào giữ cho thư mục chỉ chứa tệp ở thư mục con. Nếu sau này ai đó sửa nhầm, loại thư mục như vậy có thể lặng lẽ biến khỏi bản đồ mà không ca kiểm nào báo đỏ.
  Căn cứ: Hôm nay hành vi đang đúng nên người dùng chưa gặp gì; rủi ro chỉ nằm ở một lần sửa sau này, và bổ sung ca kiểm khi đó rẻ, nên ghi là giới hạn đã biết thay vì mở thêm việc.
  file: `tests/scripts/tep-sinh-khong-chan-gop.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
