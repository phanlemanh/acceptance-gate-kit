# Review findings: release-2-21-0

## Trong hợp đồng

Không có finding.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E1/E2/E6 expect P200 lines that their own verifier command filters out**
  Người dùng thấy gì: Khi cắt mốc 2.21.0, ba mục kiểm về số phiên bản và mô tả phát hành chỉ dựa vào việc cả cụm kiểm tra chạy xong không lỗi, chứ không thấy được từng dòng xác nhận riêng. Nếu phần kiểm đó vô tình không chạy, bản phát hành vẫn có thể được báo là đạt mà không ai phát hiện ngay.
  file: `_acceptance/release-2-21-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (assertion with no pinned message): E1/E2/E6 expect P200 lines that the executor's output filter removes, so the verdict rests on the shard's exit code alone**
  Người dùng thấy gì: Bằng chứng cho ba tiêu chí về số phiên bản, dòng khớp phiên bản và mô tả phát hành chỉ là một kết quả chung 'cả cụm chạy xong không lỗi'. Kết quả đó không phân biệt được 'phần kiểm này đã chạy và đạt' với 'phần kiểm này không hề chạy', nên người duyệt không có bằng chứng riêng cho từng tiêu chí.
  file: `_acceptance/release-2-21-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
