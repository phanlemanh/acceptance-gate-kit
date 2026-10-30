# Review findings: tep-sinh-khong-chan-gop (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (âm-tính-một-mình / không phân biệt «không chạy» với «khớp»): TS-7 so LO-TRINH.html đọc lại từ đĩa dùng chung giữa hai lần vẽ**
  Người dùng thấy gì: Phép kiểm xem bản vẽ mới có giống bản cũ hay không có một chỗ hở nhỏ: riêng trang lộ trình, nếu bản mới bỏ không vẽ trang này thì phép kiểm có thể vẫn báo khớp. Tờ bản đồ chính vẫn được bảo vệ đầy đủ và phần lớn trường hợp hỏng vẫn bị bắt qua tờ bản đồ.
  Căn cứ: Hậu quả nhẹ và hẹp: chỉ có thể bỏ lọt một lỗi vẽ trang lộ trình trong ít tình huống, không làm mất dữ liệu, và lỗi như vậy lộ ra ngay ở bước kiểm bản vẽ khác; ghi lại là đủ, sửa sau vẫn rẻ.
  file: `tests/scripts/tep-sinh-khong-chan-gop.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Thư mục rỗng trùng slug của một hàng lộ trình vẫn làm trang lộ trình lệch bản clone sạch, nên --check đỏ dù không ai sửa nguồn (r1)**
  Người dùng thấy gì: Nếu lệnh mở vòng cho một hàng lộ trình bị ngắt giữa chừng và để lại thư mục rỗng đúng tên hàng đó, trang lộ trình sẽ báo hàng ấy là hồ sơ hỏng và bước kiểm bản vẽ báo đỏ dù không ai sửa nguồn. Người dùng xoá thư mục rỗng đó là hết đỏ.
  Căn cứ: Hậu quả nhẹ: chỉ là một lần báo đỏ giả, không mất dữ liệu, người dùng tự gỡ được bằng cách xoá thư mục rỗng; ghi thành han chế đã biết rẻ hơn mở thêm vòng sửa ngoài hợp đồng đã duyệt.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ma trận thư mục của AC-6/AC-7 chỉ có điểm-case: thiếu ô «thư mục chỉ có tệp nằm trong thư mục con», nên nửa đệ quy của coTepTrongCay không phép đo nào giữ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hiện chưa có phép kiểm nào giữ cho thư mục chỉ chứa tệp ở thư mục con. Nếu sau này ai đó sửa nhầm, loại thư mục như vậy có thể lặng lẽ biến khỏi bản đồ mà không ca kiểm nào báo đỏ.
  Căn cứ: Hôm nay hành vi đang đúng nên người dùng chưa gặp gì; rủi ro chỉ nằm ở một lần sửa sau này, và bổ sung ca kiểm khi đó rẻ, nên ghi là giới hạn đã biết thay vì mở thêm việc.
  file: `tests/scripts/tep-sinh-khong-chan-gop.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
