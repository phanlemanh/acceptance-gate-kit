# Review findings: dinh-tuyen-theo-ma-muc (round 2)

## Trong hợp đồng

Không có finding trong hợp đồng ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chú thích cờ dòng máy lệch trên thẻ còn ghi «lưới trước-merge không bắt ca này», nhưng lib nay đã bắt (r1)**
  Người dùng thấy gì: Một dòng ghi chú trong mã nói sai về giới hạn cũ; người dùng không thấy gì khác đi, chỉ người đọc mã có thể bị nhầm.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: wont-fix

- **Dòng máy mồ côi thành «lệch» vĩnh viễn: dinh-tuyen-may thoát 2 mãi và thẻ cắm cờ mãi, kể cả khi người đã định tuyến lại (r1)**
  Người dùng thấy gì: Sau khi một mục tự động đã được người quyết lại, hệ thống vẫn báo lỗi và cắm cờ cảnh báo ở mỗi lần chạy sau, và không ghi thêm gợi ý tự động cho mục mới. Người dùng sẽ thấy cảnh báo không bao giờ tắt dù đã xử lý xong.
  file: `scripts/dinh-tuyen-may.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 (assertion âm-tính-một-mình): DM9 luoi-cay xanh rỗng, lưới chưa từng chạy tới khối định tuyến (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một phép kiểm tự động báo xanh mà thực ra chưa chạm tới phần cần kiểm, nên nó chưa chứng minh được là hồ sơ đã ký không bị chặn nhầm. Hành vi thật không bị chứng minh sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp): chiều đỏ DM1-do theo-so nhận mọi lỗi, và kết quả quan sát được trái với lý do ca tự in (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một phép thử phá thử có thể báo đỏ vì lý do khác với lý do nó tự ghi, nên độ tin của phép thử này thấp hơn vẻ ngoài. Người dùng không thấy hành vi sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay vì quan hệ): DM1 doi-so tuyên «mục DUY NHẤT chưa định tuyến» nhưng chỉ loại trừ Ngoài-2 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép thử chưa đủ chặt để bắt trường hợp có thêm mục bị báo chưa định tuyến nhầm. Hiện chưa thấy hệ thống báo sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (chuỗi có mặt thay vì quan hệ): DM7 co-vang đếm nhãn trên cả dòng cờ, không phân biệt danh sách «dòng cũ» với danh sách «hỏi lại» (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép thử cờ cảnh báo trên thẻ có thể vẫn xanh dù danh sách mục cũ trên cờ bị rỗng hay sai. Cờ thật hiện chưa thấy hiển thị sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp): DM4 luoi nhận VIOLATION bất kỳ cho hàng khai «còn mục chưa định tuyến» (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép thử chỉ kiểm lưới có chặn hay không mà không kiểm lý do chặn, nên một lý do chặn khác vẫn được tính là đúng. Hành vi thật chưa thấy sai.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (đối chứng không thể đỏ): DM9-do so lib mốc với chính nó, nên tập đổi rỗng theo cấu tạo (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một phép đối chứng so một bản với chính nó nên không thể đỏ; nó chỉ làm phép kiểm trông chắc hơn thực tế. Người dùng không bị ảnh hưởng.
  file: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
