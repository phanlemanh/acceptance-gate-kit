## Trong hợp đồng

Không có phát hiện nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Rà soát báo «không có đề xuất» khi tệp lộ trình hỏng (xanh giả ở ranh giới hệ thống)**
  Người dùng thấy gì: Khi tệp lộ trình bị hỏng, lệnh rà soát vẫn im lặng và trang hướng dẫn bảo người dùng nói «không có đề xuất nào». Chủ kho sẽ tưởng kế hoạch ổn trong khi máy thật ra không đọc được nó.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lệnh gợi ý trên thẻ khởi động trỏ đường tương đối chỉ chạy được trong kho kit**
  Người dùng thấy gì: Khi có hơn 5 đề xuất, thẻ khởi động gợi ý một lệnh để xem phần còn lại, nhưng ở các kho khác ngoài kho kit lệnh đó chạy không được. Chủ kho phải tự tìm cách xem nốt các đề xuất còn lại.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Câu cờ đã dịch sang chữ người vẫn lộ tên khoá máy (tuoi_ngay, tran_ke_tiep)**
  Người dùng thấy gì: Hai câu cảnh báo về chính sách tuổi và trần vẫn in tên khoá kỹ thuật thay vì chữ thường. Chỉ hơi khó đọc, không làm sai kết quả.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Cờ «lịch sử cụt» được tính nhưng không mặt nào in ra (lệnh chữ, /road-map:xem, thẻ start)**
  Người dùng thấy gì: Trên kho tải nông, tuổi hàng bị tính thấp hơn thật nên có đề xuất bị bỏ sót, mà người đọc không thấy dấu hiệu nào báo điều đó. Chủ kho có thể tin nhầm rằng không có hàng nào quá hạn.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Tệp lộ trình hỏng thì --ra-soat vẫn thoát 0, không in gì, và /road-map:xem sẽ báo «không có đề xuất»**
  Người dùng thấy gì: Khi tệp lộ trình bị hỏng, rà soát im lặng và lệnh xem báo «không có đề xuất». Chủ kho sẽ nhầm kế hoạch hỏng thành kế hoạch sạch.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **tuoiHang nuốt mọi lỗi git nên luật tuổi chết im lặng khi --root không phải gốc kho git (hoặc không phải kho git)**
  Người dùng thấy gì: Nếu thư mục kế hoạch nằm trong thư mục con của kho, hoặc không phải kho git, luật theo tuổi âm thầm không chạy và báo như thể không có hàng nào quá hạn.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hàng «Kế tiếp» gồm cả hàng tự khai Đã bác, Ngoài phạm vi, Đang làm nên bị đếm vào trần và được đề xuất «chờ điều kiện»**
  Người dùng thấy gì: Những hàng chủ kho đã tự ghi là đã bác, đang làm hoặc ngoài phạm vi vẫn bị đếm vào danh sách «Kế tiếp». Vì vậy chúng nhận đề xuất «chờ điều kiện» không đáng có và đẩy nhầm các hàng thật sự đang chờ.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **gan-moc-dang-chay coi mã trong moc.hang không khớp hàng nào là «hàng ngoài đợt» nên cảnh báo sai**
  Người dùng thấy gì: Nếu một mốc chứa mã gõ sai hoặc mã đã xoá, người dùng có thể nhận cảnh báo «đổi đích chiến dịch giữa chừng» dù chưa có hàng của đợt khác. Chỉ là một cảnh báo thừa trong tình huống hiếm.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là QUAN HỆ): RS-8 không so răng phủ với bộ máy gốc dù E8 hứa vậy**
  Người dùng thấy gì: Phép kiểm về đổi chữ «chờ điều kiện» chưa so mã thoát của răng phủ với bản cũ. Nếu có ai vô tình đổi hành vi răng phủ mà vẫn giữ đúng chữ, phép kiểm này sẽ không bắt được, dù các phép kiểm khác phủ một phần.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): RS-5-loi kết luận từ riêng mã thoát 2 của --ra-soat --hang**
  Người dùng thấy gì: Phép kiểm việc chặn tổ hợp lệnh sai chỉ nhìn mã lỗi, không nhìn lý do. Rủi ro nhỏ: lệnh vẫn bị chặn như mong đợi, chỉ có thể bị chặn vì lý do khác.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: wont-fix

- **Hình dạng 4 (âm tính một mình, không đối chứng dương): RS-3-chua-commit xanh cả khi bộ rà soát không đọc tệp**
  Người dùng thấy gì: Một phép kiểm phụ về tệp lộ trình chưa commit có thể xanh dù máy không đọc tệp đó. Ảnh hưởng nhỏ vì ca này nằm ngoài các tiêu chí chính.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 (tuyên quét lớp nhưng có vùng mù): RS-8-quet bỏ qua mọi dòng tệp markdown bắt đầu bằng # hoặc ***
  Người dùng thấy gì: Phép quét chữ «chân trời» bỏ qua các tiêu đề và gạch đầu dòng trong tài liệu, nên sau này nếu có ai viết lại chữ cũ ở đó thì sẽ không bị phát hiện. Hiện tại chưa có chỗ nào sai.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (quan hệ thoả rỗng, không đối chứng dương): RS-5 so «chữ = thẻ» bằng forEach trên mảng có thể rỗng**
  Người dùng thấy gì: Một phép so giữa dòng chữ và dòng trên thẻ có thể xanh một cách vô nghĩa nếu thẻ mất cả khối rà soát. Có các phép kiểm khác đã phủ việc này nên rủi ro thấp.
  file: `tests/scripts/ra-soat-lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
