## Trong hợp đồng

(none)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **eval-coverage-lint.js giữ bản sao section boundary thứ 3 — đã lệch hành vi với lib mới**
  Người dùng thấy gì: Công cụ kiểm tra độ phủ tiêu chí (lint) dùng một luật xác định ranh giới mục cũ hơn, khác với luật vừa chuẩn hoá cho các thành phần khác, nên trong một số tài liệu nó có thể đếm thiếu tiêu chí và bỏ sót cảnh báo mà không báo lỗi gì.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/eval-coverage-lint.js:61`
  severity: high
  Đề xuất: new-contract

- **pre-merge-check.sh (awk) là bản sao thứ 4 của luật ranh giới, cũng lệch h1, không có round-trip ghim**
  Người dùng thấy gì: Bước kiểm tra tự động trước khi gộp mã nguồn dùng một cách xác định ranh giới nội dung khác với phần còn lại của hệ thống, nên trong một số trường hợp nó có thể bỏ sót việc đối chiếu bằng chứng cho một tiêu chí, khiến việc gộp mã được thông qua dù bằng chứng chưa đầy đủ.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/pre-merge-check.sh:546`
  severity: high
  Đề xuất: new-contract

- **parseBoundaryTable bỏ im lặng mọi dòng không khớp — sai chính tả trong bảng marker trả về default, không nổ**
  Người dùng thấy gì: Nếu tệp cấu hình luật ranh giới trong mã nguồn bị gõ sai một mục, hệ thống âm thầm dùng luật mặc định thay vì báo lỗi cho người phát triển, có thể khiến các dòng không liên quan lọt vào danh sách phát hiện trên thẻ quyết định mà không có cảnh báo nào.
  file: `/Users/manhphan/dev/acceptance-gate-kit/lib/md-section.js:21`
  severity: high
  Đề xuất: known-limits

- **FSB7: tham số `rule` chết — giá trị rút từ bảng marker chỉ trang trí trong nhánh assertion dương**
  Người dùng thấy gì: Một đoạn bên trong bài kiểm thử tự động trông như đang đối chiếu chéo hai nguồn luật nhưng thực ra không dùng đến giá trị đó; bài kiểm vẫn bắt được lỗi thật nhờ cơ chế khác, nên rủi ro cho người dùng cuối thấp, chỉ gây khó hiểu cho người bảo trì sau này.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/workflows/claim-scan.test.mjs:438`
  severity: medium
  Đề xuất: known-limits

- **parseBoundaryTable silently drops malformed rows — section falls back to the ghost-row rule with no error**
  Người dùng thấy gì: Nếu tệp cấu hình luật ranh giới bị gõ sai một mục (ví dụ sai tên hoặc ký tự lạ), hệ thống lặng lẽ quay về luật mặc định thay vì báo lỗi, có thể khiến các mục không phải phát hiện thật xuất hiện trở lại trên thẻ quyết định mà không có cảnh báo nào.
  file: `/Users/manhphan/dev/acceptance-gate-kit/lib/md-section.js:26`
  severity: medium
  Đề xuất: known-limits

- **Heading match is case-insensitive but the rule lookup is case-sensitive — silently downgrades to the default boundary**
  Người dùng thấy gì: Nếu trong tương lai có chỗ nào gọi tên một mục bằng chữ hoa/thường khác với quy ước hiện tại, luật ranh giới đặc biệt của mục đó sẽ âm thầm không được áp dụng mà không có cảnh báo; hiện tại chưa có chỗ nào gọi sai nên chưa ảnh hưởng thực tế.
  file: `/Users/manhphan/dev/acceptance-gate-kit/lib/md-section.js:36`
  severity: medium
  Đề xuất: known-limits

- **New hard runtime dependency lib/md-section.js not added to the P03 packaged-file guard**
  Người dùng thấy gì: Bài kiểm tra đóng gói không liệt kê đầy đủ mọi tệp thư viện bắt buộc, nên nếu cách đóng gói phần mềm thay đổi trong tương lai, gói có thể thiếu một tệp cần thiết mà bài kiểm tra vẫn báo xanh; rủi ro hiện tại thấp vì quy trình đóng gói hiện hành đang chép nguyên cả thư mục thư viện.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:52`
  severity: low
  Đề xuất: known-limits

- **FSB7 rowsByRule: the rule extracted from the marker is never actually applied (dead parameter)**
  Người dùng thấy gì: Một tham số bên trong bài kiểm thử tự động không thực sự được dùng như mô tả của nó, gây hiểu nhầm cho người bảo trì sau này, nhưng không làm giảm khả năng bài kiểm bắt lỗi thật.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/workflows/claim-scan.test.mjs:438`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
