# Review findings: release-2-25-0

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **AC-10 viết lại vế CHANGELOG nhưng vế đó vẫn không có chiều đỏ trong bộ kiểm**
  Người dùng thấy gì: Phép kiểm cũ chỉ bảo đảm ghi chú phát hành còn nhắc đúng lỗi đã sửa, nhưng nếu ai đó lỡ xoá hoặc đổi tiêu đề mục đó trong ghi chú thì phép kiểm vẫn không báo đỏ. Hôm nay mọi thứ vẫn đúng và xanh, nên bản 2.25.0 không bị ảnh hưởng; rủi ro chỉ là một lần sửa ghi chú sai về sau lọt qua mà không ai biết.
  file: `tests/scripts/luot-sua-giu-du.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
