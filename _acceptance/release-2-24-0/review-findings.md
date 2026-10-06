# Review findings: release-2-24-0

## Trong hợp đồng

none

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Đo CHỈ DẪN thay vì ĐẦU RA (hình 1): E1/E2/E6 chấm trên các dòng P200 mà lệnh của chính eval lọc bỏ khỏi output**
  Người dùng thấy gì: Bản phát hành 2.24.0 vẫn đúng số phiên bản và đúng mô tả, nhưng phần bằng chứng đi kèm ba tiêu chí số phiên bản không in ra từng dòng kiểm chi tiết, chỉ cho thấy kết quả chung là xanh. Người duyệt tin được rằng suite xanh, nhưng không tự đọc được riêng con số 2.24.0 hay câu khai cặp plugin trong bằng chứng đó, nên phải đối chiếu thẳng với tệp phiên bản nếu muốn chắc.
  file: `_acceptance/release-2-24-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
