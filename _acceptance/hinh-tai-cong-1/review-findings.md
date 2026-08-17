# Review Findings: hinh-tai-cong-1 (round 4)

## Trong hợp đồng

Không có finding nào map được vào AC ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hình 5 (tuyên lớp, danh sách điểm) — rang.sh ghim 16/21 thông điệp trong khi E3–E6 hứa thông điệp không nằm trong danh sách**
  Người dùng thấy gì: Nếu sau này nội dung của 5 thông báo chưa nằm trong danh sách kiểm tra bị mất hoặc đổi sai, hệ thống có thể không cảnh báo kịp dù phần đó đã thực sự hỏng.
  file: `_acceptance/hinh-tai-cong-1/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Hình 2 (bản chép tay của bên đọc) — `p90_check` là bản viết lại, không phải hàm check() thật của P90 dù E8 gọi là «hàm p90_check THẬT»**
  Người dùng thấy gì: Nếu sau này bài kiểm tra gốc bên trong hệ thống thay đổi cách hoạt động, bài kiểm tra mới có thể vẫn báo 'đạt' dù không còn kiểm tra đúng như ban đầu — khiến người xem bằng chứng tin nhầm rằng phần đó vẫn được bảo vệ.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
