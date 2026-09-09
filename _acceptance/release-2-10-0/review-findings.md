# Review Findings: release-2-10-0

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hồ sơ release-2-10-0 khai `veto_state: mo` mà thiếu `veto_opened_at` — cổng trước-merge của chính kit ĐỎ**
  Người dùng thấy gì: Hồ sơ phát hành 2.10.0 có thể bị chặn không gộp được vào nhánh chính vì thiếu một mốc thời gian bắt buộc, làm chậm việc đưa bản cập nhật tới tay người dùng.
  file: `_acceptance/release-2-10-0/contract.md`
  severity: high
  Đề xuất: new-contract

- **Lời khai «lớp vendored không đổi» của hồ sơ mốc đo bằng `git diff -- vendor/` — thước gắn nhầm vật, dẫn tới chỉ dẫn rollout sai**
  Người dùng thấy gì: Hướng dẫn phát hành nói các dự án dùng bộ công cụ này không cần làm gì thêm để cập nhật quy trình kiểm tra tự động, nhưng thực tế họ cần cập nhật — nếu làm theo hướng dẫn sai này, một lớp kiểm tra chất lượng sẽ âm thầm ngừng hoạt động và các lượt kiểm tra sau đó có thể bị chặn nhầm hàng loạt.
  file: `_acceptance/release-2-10-0/contract.md`
  severity: high
  Đề xuất: new-contract

- **Lối «da-veto» đọc status MỚI thay vì status CŨ — draft/implemented nhảy thẳng sang verified/machine-cleared mà approved_by rỗng vẫn ghi được**
  Người dùng thấy gì: Một số bản ghi có thể được đánh dấu 'đã xác nhận an toàn' mà chưa thực sự qua đủ bước phê duyệt cần thiết, làm giảm độ tin cậy của chính dấu xác nhận đó.
  file: `lib/evidence-core.cjs`
  severity: high
  Đề xuất: new-contract

- **loop-health: `git log -S` quét TRỌN contract.md nên bắt cả chữ trong AC — «làm-xong→quyết-được» ra số âm mà không có tín hiệu nào**
  Người dùng thấy gì: Báo cáo thời gian 'từ làm xong đến ra quyết định' của công cụ đo tự động có thể hiển thị số âm hoặc sai do lỗi tính toán, nên hiện tại số liệu này phải đếm tay thay vì tin vào máy.
  file: `scripts/loop-health.mjs`
  severity: medium
  Đề xuất: known-limits

- **eval-coverage-lint bỏ hẳn W8 trong im lặng khi thiếu lib/lop-nhin-thay.cjs, trong khi hai bộ đọc anh em đều nói ra**
  Người dùng thấy gì: Nếu một dự án dùng bộ công cụ này thiếu một thành phần nội bộ, công cụ kiểm tra độ bao phủ có thể báo 'ổn, không có vấn đề gì' một cách im lặng dù thực chất chưa kiểm tra được gì, khiến người dùng lầm tưởng mọi thứ đã được rà soát.
  file: `scripts/eval-coverage-lint.js`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: «chiều đỏ» của PV5 là hằng đúng, không bao giờ đỏ được**
  Người dùng thấy gì: Một bài kiểm tra tự động được thiết kế để phát hiện một lớp lỗi cụ thể thực chất không bao giờ có thể báo lỗi, nên lớp lỗi đó có thể âm thầm quay lại mà không ai được cảnh báo.
  file: `tests/scripts/w6-w8-pham-vi.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Chiều đỏ của NO4 chạy bằng BẢN SAO viết lại của phép quét, không phải chính phép quét**
  Người dùng thấy gì: Một bài kiểm tra bảo vệ có thể ngừng phát hiện đúng vấn đề khi logic gốc mà nó theo dõi bị thay đổi, vì bài kiểm tra dùng một bản chép tay riêng thay vì logic thật đang chạy.
  file: `tests/scripts/lnt-no.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» với vế OR nuốt đúng chế độ hỏng mà nó đi bắt**
  Người dùng thấy gì: Một bài kiểm tra có thể báo 'đạt' ngay cả khi phần hiển thị số liệu bị lỗi và rơi vào chế độ dự phòng, vì bài kiểm tra chấp nhận cả kết quả đúng lẫn kết quả của nhánh lỗi.
  file: `tests/scripts/loop-health.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Ca L52 là assert âm-tính-một-mình, không ghim thông điệp và không đối chứng lint đã chạy**
  Người dùng thấy gì: Một bài kiểm tra chỉ dựa vào việc 'không thấy thông báo lỗi xuất hiện' để kết luận 'ổn', nên nó không phân biệt được giữa 'không có vấn đề' và 'công cụ kiểm tra đã không chạy được'.
  file: `tests/scripts/run-tests.sh`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).