# Review Findings: workspace-reader-unification (round 2)

## Trong hợp đồng

(không có — không finding nào ánh xạ được vào AC round này; cả 4 finding thu được đều nằm ngoài phạm vi hợp đồng, xem mục dưới)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Card instruction still claims "longest-waiting gate first" but empty since now sorts to the top**
  Người dùng thấy gì: Thẻ lệnh /start vẫn nói với người dùng rằng cổng chờ lâu nhất luôn được xếp lên đầu danh sách, nhưng thực tế một cổng chưa rõ thời điểm bắt đầu chờ nay lại bị xếp lên đầu tiên. Người xem thẻ có thể ưu tiên nhầm, tưởng cổng đó đang chờ lâu nhất trong khi thực ra không ai biết nó chờ bao lâu.
  file: `commands/start.md`
  severity: medium
  Đề xuất: known-limits

- **MAP_LABELS 'da-xoa' asserts a deletion that never happened for a freshly opted-in repo**
  Người dùng thấy gì: Một dự án vừa mới bật tính năng bản đồ sản phẩm nhưng chưa từng vẽ bản đồ lần nào có thể bị hệ thống báo rằng bản đồ "đã bị xoá khỏi cây làm việc" — một thông báo sai sự thật, vì file đó chưa từng tồn tại. Người dùng có thể hoang mang đi tìm một file chưa bao giờ được tạo.
  file: `lib/workspace-record.js`
  severity: medium
  Đề xuất: known-limits

- **config_list node path silently demotes to sed reader on ANY node error, not just missing node**
  Người dùng thấy gì: Nếu máy chạy kiểm tra trước khi hợp nhất gặp trục trặc kỹ thuật (ví dụ công cụ chạy mã bị lỗi), hệ thống sẽ âm thầm chuyển sang một cách đọc cấu hình khác mà không báo cho ai biết. Điều này có thể khiến kết quả kiểm tra trước khi hợp nhất không khớp với kết quả của các công cụ khác trong cùng dự án, mà không ai phát hiện ra.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: new-contract

- **start-scan runs mapTracked git probes even when PRODUCT-MAP.md exists and the result cannot affect state**
  Người dùng thấy gì: Với những dự án có lịch sử Git rất dài, màn hình lệnh /start có thể tải chậm hơn một chút vì hệ thống vẫn âm thầm dò toàn bộ lịch sử xoá file bản đồ dù bản đồ đang tồn tại sẵn. Kết quả hiển thị vẫn đúng, chỉ là người dùng phải chờ lâu hơn mức cần thiết.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
