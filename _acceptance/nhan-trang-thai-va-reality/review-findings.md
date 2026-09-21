# Review findings — nhan-trang-thai-va-reality (round 2)

## Trong hợp đồng

(rỗng)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Nhánh mới `!moc → THIEU` trong checkThucTe không có ca đỏ nào giữ**
  Người dùng thấy gì: Một nhánh xử lý mới chưa có phép thử nào chứng minh nó thực sự chặn đúng lúc cần, nên có nguy cơ tính năng lặng lẽ không hoạt động ở đúng tình huống nó được viết ra để xử lý.
  file: `lib/workspace-record.cjs`
  severity: medium
  Đề xuất: known-limits

- **Mã THIEU cho ca «không tìm thấy commit» in ra lời sai và cách sửa sai ở pre-merge**
  Người dùng thấy gì: Khi dòng ghi nhận đã đầy đủ thông tin nhưng chưa được lưu vào lịch sử commit, hệ thống báo nhầm là dòng thiếu thông tin và gợi ý ghi thêm một dòng mới — trong khi việc cần làm chỉ là lưu lại dòng đã có; làm theo gợi ý sai này có thể tạo ra dữ liệu trùng lặp không cần thiết.
  file: `lib/workspace-record.cjs`
  severity: medium
  Đề xuất: known-limits

- **Lời mong đợi của eval AC-10 còn đếm «năm ca = 10 assert» sau khi thêm ca thứ sáu**
  Người dùng thấy gì: Một con số ghi chú trong tài liệu kiểm tra không khớp với số ca kiểm tra thực tế hiện có, có thể khiến người đọc sau hiểu nhầm về phạm vi đã được kiểm chứng.
  file: `_acceptance/nhan-trang-thai-va-reality/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **No-commit-found case reuses the 'missing field' message and points the user at the wrong fix**
  Người dùng thấy gì: Khi dòng ghi nhận đã đầy đủ nhưng chưa được lưu vào lịch sử, công cụ kiểm tra báo nhầm là dòng thiếu thông tin và hướng người dùng ghi thêm một dòng mới thay vì chỉ cần lưu lại dòng đã có; làm theo hướng dẫn này có thể tạo ra dữ liệu trùng lặp không cần thiết.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên cả lớp nhưng chỉ có một ca đơn lẻ): ca NL-AC10-thieu-id không bao giờ chạy tới nhánh mới «không có mốc thì lưới đóng»**
  Người dùng thấy gì: Phép thử mới cho quy tắc 'không xác định được mốc ghi nhận thì phải chặn lại' thực chất chỉ chạm một nhánh xử lý khác, nên chưa có bằng chứng nào cho thấy quy tắc chặn mới thực sự hoạt động đúng khi cần.
  file: `tests/scripts/ntr-luoi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hồ sơ nhảy thẳng draft → da-cham-boi-thuc-te qua cả Cổng 1 lẫn Cổng 2; câu «never from draft» của hook không có mã nào giữ (r1)**
  Người dùng thấy gì: Một hồ sơ có thể bị đánh dấu 'đã chấm bởi thực tế' và gộp vào sản phẩm chính mà chưa từng qua bước phê duyệt ban đầu, nên có nguy cơ một thay đổi chưa kiểm tra kỹ lọt vào bản phát hành.
  file: `hooks/acceptance-evidence-gate.js`
  severity: high
  Đề xuất: known-limits

- **Hook tự khai «never from draft» cho da-cham-boi-thuc-te nhưng evaluateContractWrite không chặn; lưới trước-merge còn bỏ qua mọi luật Cổng 1 (r1)**
  Người dùng thấy gì: Một luật bảo vệ mà tài liệu nói đang bật thực ra không chặn được gì, nên hồ sơ chưa qua vòng duyệt đầu tiên vẫn có thể được đưa thẳng vào sản phẩm chính.
  file: `hooks/acceptance-evidence-gate.js`
  severity: medium
  Đề xuất: known-limits

- **thuoc-vat --write bỏ qua phép so thước chỉ-đọc khi đọc hoặc parse tệp args lỗi, kể cả khi --args được truyền tường minh (r1)**
  Người dùng thấy gì: Nếu tệp cấu hình phụ trợ bị hỏng hoặc trỏ sai đường dẫn, công cụ kiểm tra độ lệch dữ liệu có thể im lặng bỏ qua việc so sánh thay vì báo lỗi, khiến một số thay đổi ngoài ý muốn không bị phát hiện.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
