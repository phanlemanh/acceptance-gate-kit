## Trong hợp đồng

_Không có phát hiện nào ánh xạ được vào AC trong round này._

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tách suite_keys thành mảnh làm hỏng dedupe với 68 hồ sơ có eval trỏ `config:executors.test.scripts|plugins`: suite trọn chạy thêm một lần nữa, và lại vượt trần công cụ**
  Người dùng thấy gì: Với các hồ sơ chấm theo cách cũ đã ký từ trước, lượt chấm lại có thể vô tình chạy toàn bộ bộ kiểm tra thêm một lần nữa, khiến lượt chấm chậm hơn và có nguy cơ bị dừng giữa chừng vì vượt thời gian cho phép.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Chặn «đã thử lại vẫn chặn → không chấm tiếp» chỉ là lời dặn trên stderr: s4-args vẫn thoát 0 và ra args cho round base+1**
  Người dùng thấy gì: Khi một lượt chấm bị chặn lần thứ hai do lỗi hạ tầng, hệ thống chỉ ghi một dòng cảnh báo kỹ thuật chứ không tự động dừng hẳn — nếu người vận hành bỏ qua cảnh báo đó, hệ thống vẫn có thể chạy thêm một lượt nữa ngoài giới hạn đã định.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **Doc bên đọc JSON `--extract` (commands/acceptance-card.md) vẫn định nghĩa `one_shot: null` = REJECT/BLOCKED và bắt in `goal_line` nguyên văn «không bỏ», trong khi Cổng 1 nay trả null cho hồ sơ đã khép**
  Người dùng thấy gì: Tài liệu hướng dẫn người đọc kết quả thẻ vẫn mô tả một trường hợp trống là 'bị từ chối', trong khi thực tế nay nó còn có thể mang nghĩa 'hồ sơ đã hoàn tất' — người đọc theo tài liệu có thể thuật lại sai trạng thái của hồ sơ.
  file: `commands/acceptance-card.md`
  severity: low
  Đề xuất: known-limits

- **Ca đột biến ghi bản sao mutant thẳng vào thư mục nguồn đang giao (feature-loop/scripts/, scripts/) thay vì bản sao ở thư mục tạm như mẫu banSaoMay**
  Người dùng thấy gì: Trong lúc chạy kiểm thử nội bộ, hệ thống có thể tạm thời để lại vài tệp thử nghiệm ngay trong thư mục mã nguồn sẽ được đóng gói; nếu quá trình kiểm thử bị ngắt giữa chừng, các tệp thừa này có nguy cơ lọt vào bản phát hành.
  file: `tests/scripts/htkd.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Thẻ Cổng 1 của hồ sơ đã khép vẫn in hai nút «Sửa lại / Duyệt, cho code»**
  Người dùng thấy gì: Với một hồ sơ được xem là đã hoàn tất, thẻ vẫn ghi 'không còn câu hỏi nào cho người' nhưng ngay bên dưới lại hiện hai nút 'Sửa lại' và 'Duyệt, cho code' — người đọc thẻ có thể bối rối không rõ có còn việc phải quyết hay không.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **Nhánh Cổng 1 bỏ qua im lặng lỗi của bộ quét rồi quay về mời «duyệt hay sửa»**
  Người dùng thấy gì: Nếu một bước kiểm tra nội bộ của hệ thống bị lỗi âm thầm, thẻ có thể lại hiện ô hỏi 'duyệt hay sửa' cho một hồ sơ thực ra đã hoàn tất, mà không có bất kỳ cảnh báo nào cho người biết dữ liệu chưa đọc được đầy đủ.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 3 — HT-AC10 dùng một vị từ «có mặt chữ phủ định» trong khi lời hứa là quan hệ thứ tự (phủ định đứng trước verified/escalate); «cũ» còn khớp cả «cũng»**
  Người dùng thấy gì: Bộ kiểm tra tự động dùng để đảm bảo tài liệu hướng dẫn không còn câu văn cũ có thể bỏ sót một số cách viết lại mang cùng ý cũ, khiến lỗi cũ có nguy cơ quay lại sau này mà không bị phát hiện ngay.
  file: `tests/scripts/htkd.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — HT-AC4-bao-cao-thieu assert giá trị 2, nhưng cả vật đúng lẫn vật thiếu vế «base đọc cả round-tally» đều ra 2**
  Người dùng thấy gì: Một phần bộ kiểm tra tự động không phân biệt được cách tính đúng và một cách tính sai cho số lượt thử lại trong vài tình huống hiếm, nên nếu sau này có người vô tình sửa sai chỗ đó, lỗi có thể không bị phát hiện ngay.
  file: `tests/scripts/htkd.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).