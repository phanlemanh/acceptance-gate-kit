# Review findings: release-2-25-0

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **rel2250_vung_3_p200: the one-line P200 output is cut to 240 bytes by the S4 wrapper, so most of the lines the evals need are lost**
  Người dùng thấy gì: Báo cáo nghiệm thu của mốc 2.25.0 có thể vẫn thiếu phần lớn các dòng bằng chứng chi tiết, gồm kết quả kiểm số phiên bản và các chiều đỏ. Kết luận đạt hay không vẫn đúng, nhưng người ký phải tin kết luận tổng thay vì đọc được từng dòng chứng cứ. Đây đúng là điểm mù mà ba mốc trước đã ghi là giới hạn đã biết.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
