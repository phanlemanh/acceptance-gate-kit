## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hai nhánh reset mới trong evidence-page.js đều không có ca cô lập — xoá nhánh nào suite cũng vẫn xanh 754/754**
  Người dùng thấy gì: Nếu sau này ai đó vô tình gỡ một trong hai lớp phòng vệ mới thêm cho trang bằng chứng, bộ kiểm tra tự động hiện tại sẽ không phát hiện ra — chỉ có một đợt rà soát thủ công mới bắt được việc đó.
  file: `scripts/evidence-page.js:89`
  severity: high
  Đề xuất: known-limits

- **Quét lớp hụt: gate-card.js (thẻ Cổng 2) thiếu đúng nhánh mà evidence-page.js vừa thêm**
  Người dùng thấy gì: Trên thẻ quyết định ở Cổng 2, cờ báo "bằng chứng máy đã đủ" có thể hiện xanh dù bằng chứng thật của đúng tiêu chí đó chưa đủ — vì cờ này vô tình lấy nhầm thông tin của lệnh kiểm tra tổng thay vì của tiêu chí, khiến người ký có thể tin nhầm ngay tại khoảnh khắc bấm ký.
  file: `scripts/gate-card.js:507`
  severity: medium
  Đề xuất: new-contract

- **Ca EPS1 dựng fixture viết tay thay vì round-trip từ marker SUITE-BLOCK-TEMPLATE**
  Người dùng thấy gì: Ca kiểm cho trang bằng chứng được viết tay theo đúng khuôn hiện tại thay vì lấy trực tiếp từ khuôn mẫu chuẩn — nếu khuôn mẫu đổi sau này, ca kiểm này có thể vẫn báo ổn trong khi trang thật đã sai.
  file: `tests/scripts/run-tests.sh:1607`
  severity: low
  Đề xuất: known-limits

- **Suite evidence block leaks into the last eval on the Gate-2 card — flips the evidence flag green**
  Người dùng thấy gì: Trên thẻ quyết định ở Cổng 2, cờ báo "bằng chứng máy đã đủ" có thể hiện xanh dù bằng chứng thật của đúng tiêu chí đó chưa đủ — vì cờ này vô tình lấy nhầm thông tin của lệnh kiểm tra tổng thay vì của tiêu chí, khiến người ký có thể tin nhầm ngay tại khoảnh khắc bấm ký.
  file: `scripts/gate-card.js:507`
  severity: high
  Đề xuất: new-contract

- **Chiều đỏ đã KHAI nhưng không tồn tại trong răng — chân `ket-qua-rieng` chỉ có một chiều (biến thể hình dạng 4)**
  Người dùng thấy gì: Một nhánh xử lý kết quả "lệnh không chạy được" của phép kiểm nội bộ chưa từng được thử với một trường hợp lỗi thật, nên chưa có bằng chứng nó thực sự bắt được lỗi đó — hạn chế này đã được ghi nhận và người ký đã biết trước khi ký.
  file: `_acceptance/suite-run-log-provenance/rang.sh:142`
  severity: medium
  Đề xuất: known-limits

- **Chiều đỏ đã KHAI nhưng không tồn tại trong răng — chân `khong-hoi-quy` (biến thể hình dạng 4)**
  Người dùng thấy gì: Phép kiểm "không có hồi quy giữa hai bản" mới chỉ chứng minh được hai bản giống nhau, chưa từng thử với hai bản cố ý khác nhau để chắc chắn nó phát hiện được khác biệt thật — hạn chế này đã được ghi nhận và người ký đã biết trước khi ký.
  file: `_acceptance/suite-run-log-provenance/rang.sh:186`
  severity: medium
  Đề xuất: known-limits

- **Fixture VIẾT TAY đúng khuôn bên ĐỌC — ca EPS1 không round-trip qua marker SUITE-BLOCK-TEMPLATE (hình dạng 2)**
  Người dùng thấy gì: Ca kiểm cho trang bằng chứng được viết tay theo đúng khuôn hiện tại thay vì lấy trực tiếp từ khuôn mẫu chuẩn — nếu khuôn mẫu đổi sau này, ca kiểm này có thể vẫn báo ổn trong khi trang thật đã sai.
  file: `tests/scripts/run-tests.sh:1607`
  severity: medium
  Đề xuất: known-limits

- **Allowlist «vật được đo» thiếu file — bản sao có thể chấm cây KHÁC cây đang kiểm mà không kêu (hình dạng 6)**
  Người dùng thấy gì: Danh sách các tệp được phép đo tự động là liệt kê tay; nếu sau này có tệp liên quan mới mà quên thêm vào danh sách, phép kiểm sẽ không phát hiện được thay đổi chưa lưu ở tệp đó — hạn chế này đã được ghi nhận và người ký đã biết trước khi ký.
  file: `_acceptance/suite-run-log-provenance/rang.sh:29`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 5/8 lỗi rơi vào file không bộ đo nào phủ (scripts/evidence-page.js, scripts/gate-card.js, tests/scripts/run-tests.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
