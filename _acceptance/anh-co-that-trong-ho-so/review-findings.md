# Review findings: anh-co-that-trong-ho-so (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Trang bằng chứng giờ in nguyên chuỗi `screenshot:` bị loại, làm đỏ ca EP09 có sẵn (giá trị `screenshot:` độc hại phải vắng khỏi trang)**
  Người dùng thấy gì: Khi một hồ sơ trỏ ảnh tới địa chỉ lạ, trang bằng chứng giờ hiện nguyên đường dẫn đó dưới dạng chữ để người đọc biết ảnh thiếu. Nó không tải gì và không rò dữ liệu, nhưng một kiểm tra cũ vốn đòi đường dẫn đó phải vắng khỏi trang nay báo đỏ.
  Căn cứ: Không ảnh hưởng người dùng cuối vì chữ chỉ hiển thị, không bị mở ra; chỉ là một kiểm tra cũ cần được người quyết định giữ hay đổi quy tắc, sửa sau rẻ.
  file: `scripts/evidence-page.js`
  severity: high
  Đề xuất: new-contract

- **Card counts an eval as having an image while the evidence page says the card does not count it (and the card shows no warning)**
  Người dùng thấy gì: Hiếm khi một eval khai sai đường dẫn ảnh nhưng hồ sơ vẫn có ảnh cùng tên theo mã eval: thẻ tính là có ảnh mà không cảnh báo, còn trang bằng chứng lại ghi rằng thẻ không tính. Người đọc thấy hai nơi nói ngược nhau về cùng một mục.
  Căn cứ: Ảnh vẫn thật sự có trong hồ sơ nên không mất bằng chứng, chỉ lệch lời giải thích ở một ca hiếm; người đọc có thể tự đối chiếu.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Measure-repo command exits 0 (match) even when the card fails to read some or all records**
  Người dùng thấy gì: Lệnh đo trên kho thật có thể báo «khớp» dù không đọc được hồ sơ nào; chỉ một dòng báo lỗi đọc cho thấy điều đó. Người chạy tay có thể tưởng đã đo xong khi thực ra chưa đo gì.
  Căn cứ: Lệnh này chạy tay, không nằm trong bộ kiểm tự động và có dòng báo lỗi hiện ra, nên rủi ro là hiểu nhầm nhất thời, không mất dữ liệu và sửa sau rẻ.
  file: `tests/scripts/anh-co-that-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **The new rule counts image file names containing #, ? or % as valid, but the page's <img src> cannot load them**
  Người dùng thấy gì: Nếu tên tệp ảnh có dấu thăng, dấu hỏi hay phần trăm, thẻ tính là có ảnh nhưng trình duyệt không hiện được ảnh trên trang bằng chứng. Người xem thấy khung ảnh hỏng dù tệp có thật.
  Căn cứ: Tên tệp kiểu này rất hiếm trong hồ sơ do máy đặt tên, ảnh vẫn nằm trong hồ sơ và mở trực tiếp được, nên hậu quả nhẹ.
  file: `scripts/anh-ho-so.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay vì quan hệ): sáu hàng 'đạt' của LNT7 trên thẻ không phân biệt được giá trị screenshot: có được đọc đúng hay không**
  Người dùng thấy gì: Kiểm tra tự động cho các hàng ảnh hợp lệ có thể vẫn xanh dù bộ đọc đường dẫn bỏ nháy bị hỏng, vì ảnh được tìm thấy qua tên theo mã eval. Lỗi như vậy chỉ bị bắt ở trang bằng chứng chứ không ở thẻ.
  Căn cứ: Người dùng không bị ảnh hưởng ngay vì kết quả thẻ vẫn đúng, và một kiểm tra khác trên trang đã bắt lỗi này; chỉ là lưới an toàn mỏng hơn.
  file: `tests/plugins/lop-nhin-thay.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không đối chứng dương): lệnh đo kho thật thoát 0 'khớp' cả khi không đọc được hồ sơ nào**
  Người dùng thấy gì: Lệnh đo kho thật có thể in toàn số không và báo khớp khi kho trống hoặc mọi hồ sơ đều lỗi đọc. Người chạy có thể hiểu nhầm là không có hồ sơ nào đổi phán quyết.
  Căn cứ: Lệnh chỉ chạy tay và chỉ in số, không đổi gì trong hồ sơ nên không gây mất mát; chỉ cần ghi chú để người chạy đọc kèm số hồ sơ đo được.
  file: `tests/scripts/anh-co-that-kho.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
