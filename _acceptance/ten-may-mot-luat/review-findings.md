## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (assertion âm-tính-một-mình): vế «kênh không đổi» của TM-3 không có đối chứng dương**
  Người dùng thấy gì: Khi gửi tin tới tên máy sai, hệ thống vẫn chặn đúng và không đăng gì lên kênh. Chỉ riêng việc kiểm «trạng thái kênh không bị đụng tới» chưa tự chứng minh được là nó đo đúng chỗ, nên nếu sau này có lỗi ghi nhầm vào kênh thì phép kiểm này có thể không báo.
  Căn cứ: Người dùng không bị ảnh hưởng ngay vì việc chặn tên sai vẫn được các phép kiểm khác bắt đúng, chỉ là một lớp kiểm phụ còn yếu; ghi lại là đủ và sửa sau rẻ.
  file: `tests/dieu-phoi/ten-may-mot-luat.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
