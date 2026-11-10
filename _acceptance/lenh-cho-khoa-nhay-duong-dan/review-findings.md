## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bản sao để phá lich.mjs chép danh sách tệp tay và lặng lẽ bỏ qua tệp thiếu**
  Người dùng thấy gì: Nếu sau này thợ thêm một tệp phụ vào bộ phát lịch, sáu ca thử sẽ đỏ dù lệnh chờ vẫn chạy đúng. Người dùng cuối không bị ảnh hưởng, chỉ làm lượt chấm tốn công.
  Căn cứ: Không ảnh hưởng người dùng, chỉ gây báo đỏ giả khi bộ phát lịch đổi cấu trúc; lúc đó thấy ngay và sửa rẻ.
  file: `tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **KN-7-do và KN-3-do kết luận từ «mã khác 0», không ghim nguyên nhân, không đếm vòng khi treo**
  Người dùng thấy gì: Hai ca thử lỗi cú pháp có thể báo xanh dù lệnh chưa từng chạy, nên có thể che một lỗi thật nếu môi trường hỏng. Lệnh chờ đưa cho thợ không đổi.
  Căn cứ: Chỉ làm bài thử kém nhạy trong tình huống hiếm, không làm mất hay lộ dữ liệu, và siết lại sau cũng rẻ.
  file: `tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chú thích đầu nhay.mjs khẳng định một luật mà chính vòng này khai là không đúng**
  Người dùng thấy gì: Một câu giải thích trong mã nói rộng hơn thực tế, người sửa sau có thể tưởng mọi đường lệnh đều đã được bọc nháy. Thợ và người dùng không thấy khác biệt.
  Căn cứ: Hậu quả chỉ là hiểu nhầm nhẹ cho người đọc mã, không động tới dữ liệu hay hành vi, ghi vết là đủ.
  file: `dieu-phoi/scripts/nhay.mjs`
  severity: low
  Đề xuất: wont-fix

- **Đổi hook-chan-s4.mjs làm ca DP7-06-do merge-base-song đỏ trên nhánh, nên job tests của PR sẽ đỏ**
  Người dùng thấy gì: Khi mở yêu cầu gộp, bước kiểm tự động của kho sẽ báo đỏ ở một ca cũ, nên chưa gộp được dù lệnh chờ chạy đúng. Sau khi gộp vào nhánh chính thì ca tự hết đỏ.
  Căn cứ: Không ảnh hưởng người dùng cuối nhưng chặn việc gộp của đội, cần người quyết định cách xử lý ca cũ vì không được nới ca để lấy xanh.
  file: `tests/dieu-phoi/trong-dot.test.mjs`
  severity: high
  Đề xuất: new-contract

- **lenhBoc vẫn để trần đường giu-nhip.mjs có dấu cách, và KN-6-bang ghim lại hành vi hỏng này**
  Người dùng thấy gì: Khi gói nằm dưới thư mục có dấu cách, lời chặn in ra một lệnh mà chạy nguyên văn sẽ hỏng. Thợ phải tự sửa tay lệnh đó.
  Căn cứ: Chỉ gặp khi đường gói có dấu cách và thợ tự sửa được, nhưng sửa đúng cần đổi cả mẫu nhận diện nên đáng một vòng riêng.
  file: `dieu-phoi/scripts/hook-chan-s4.mjs`
  severity: low
  Đề xuất: new-contract

- **Assertion âm-tính-một-mình: vế «nhay.mjs chỉ import ./ hoặc node:» của KN-6 quét trên tập rỗng, không có đối chứng dương**
  Người dùng thấy gì: Bài thử chưa chứng minh được rằng nó sẽ bắt được nếu ai đó thêm một nhập khẩu lạ vào tệp nháy. Hiện tại tệp không có nhập khẩu nào nên không có lỗi thật.
  Căn cứ: Không có hậu quả với người dùng hôm nay; rủi ro chỉ là bài thử bỏ sót vi phạm trong tương lai, sửa sau không đắt.
  file: `tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
