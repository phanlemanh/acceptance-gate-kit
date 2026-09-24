## Trong hợp đồng

(không có finding nào map được vào AC round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **chaySuite(root, lenh) no longer uses its root parameter; cwd now comes silently from the module-level root**
  Người dùng thấy gì: Một phần cấu hình nội bộ dùng để chỉ nơi chạy lệnh hiện không còn tác dụng thật, dù hành vi hôm nay vẫn đúng; nếu sau này tính năng được mở rộng theo cách dùng lại phần cấu hình đó, thao tác có thể chạy nhầm thư mục mà không có cảnh báo nào.
  file: `feature-loop/scripts/duong-nen.mjs:263`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).