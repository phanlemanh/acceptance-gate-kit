# Review findings: release-2-25-0

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The new P200 command does not fix Ngoài-1, because the engine trims each PASS output to its last 3 lines before writing evidence**
  Người dùng thấy gì: Người ký mốc 2.25.0 vẫn không thấy số phiên bản trong báo cáo bằng chứng, dù hồ sơ nói lỗi này đã được xử lý. Kết quả đạt/không đạt vẫn đúng, chỉ phần minh hoạ trong báo cáo thiếu. Nên ghi rõ đây là giới hạn đã biết thay vì tuyên bố đã sửa.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
