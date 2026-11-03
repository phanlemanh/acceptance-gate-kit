# Review findings: release-2-37-0

## Trong hợp đồng

(không có finding nào map vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lệnh chờ do máy sinh không đặt đường khoá trong nháy, nên hỏng khi đường kho có dấu cách**
  Người dùng thấy gì: Nếu kho nằm trong thư mục có dấu cách trong tên, thợ chờ khoá sẽ đứng chờ mãi mà không báo lỗi, dù khoá đã được cấp. Người dùng phải tự ngắt và chạy tay hoặc đổi tên thư mục.
  Căn cứ: Chỉ ảnh hưởng kho nằm dưới đường có dấu cách và không làm mất dữ liệu; người dùng thoát được bằng cách ngắt thợ hoặc đổi tên thư mục, nên ghi giới hạn đã biết là đủ cho mốc này.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: low
  Đề xuất: known-limits

- **Lệnh chờ do máy sinh không trích dẫn đường khoá: thư mục có dấu cách thì vòng chờ treo vĩnh viễn và không báo lỗi**
  Người dùng thấy gì: Khi kho nằm trong thư mục có dấu cách, thợ chờ khoá đứng im vô hạn và không hiện thông báo nào, nên người dùng khó biết vì sao việc không chạy tiếp.
  Căn cứ: Hậu quả là treo im lặng nhưng không mất dữ liệu và chỉ xảy ra với đường kho có dấu cách; người dùng gỡ được bằng cách ngắt và đổi tên thư mục, nên ghi giới hạn đã biết rồi sửa ở mốc kế.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
