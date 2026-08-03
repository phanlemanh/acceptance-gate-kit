# Review Findings: start-scan-hardening (round 5)

## Trong hợp đồng

Không có finding nào khớp hợp đồng round này — round 4 đã sửa lớp lỗi AC-1 (guard đọc/verdict của `evidence-report.md` rẽ nhánh trước khi biết status); review round 5 không tìm thêm case cùng lớp còn sót.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P105 matrix omits human_signoff axis; signoff masks off-vocab verdict**
  Người dùng thấy gì: Một hồ sơ đã được máy chấm xong và có chữ ký người nhưng ghi verdict sai định dạng có thể bị công cụ /start báo nhầm là 'đã xong' thay vì 'cần xem lại', khiến người dùng bỏ qua việc kiểm tra lại.
  file: `scripts/start-scan.mjs:145`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).