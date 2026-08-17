## Trong hợp đồng

Không có finding nào ánh xạ vào AC trong round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **rang.sh ghim 16/21 thông điệp của bảng M — 5 thông điệp evals E2/E3/E5/E6 nêu tên không được răng ghim**
  Người dùng thấy gì: Công cụ kiểm nhanh mới theo dõi một phần các cảnh báo có thể xuất hiện; nếu một cảnh báo bị xoá nhầm khỏi nguồn gốc, phần kiểm nhanh này có thể không báo động dù bộ kiểm đầy đủ hơn vẫn bắt được lỗi đó.
  file: `_acceptance/hinh-tai-cong-1/rang.sh`
  severity: low
  Đề xuất: known-limits

- **p90_check là bản chép tay logic của P90, không phải hàm P90 thật — E8 gọi nó là «hàm p90_check THẬT»**
  Người dùng thấy gì: Phép kiểm đối chứng mới hiện dựa trên một bản sao chép tay của logic kiểm gốc thay vì gọi thẳng phép kiểm gốc; nếu phép kiểm gốc được sửa sau này, hai bên có thể lệch nhau mà không có cảnh báo nào bật lên.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình 5 — ma trận «toàn phần» tự thu hẹp cho họ nhãn: EXPECTED chỉ nở đúng nhãn đã đột biến, 4/5 nhãn không có assert**
  Người dùng thấy gì: Bộ kiểm tự nhận là kiểm đủ mọi nhãn bước trong quy trình, nhưng thực tế chỉ kiểm một trong năm nhãn; nếu bốn nhãn còn lại bị đặt sai thứ tự trong tương lai, hệ thống có thể không phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình 2 — «p90_check THẬT» trong P197 là bản chép tay logic của P90, không gọi hàm thật của P90**
  Người dùng thấy gì: Phép kiểm đối chứng mới hiện dựa trên một bản sao chép tay của logic kiểm gốc thay vì gọi thẳng phép kiểm gốc; nếu phép kiểm gốc được sửa sau này, hai bên có thể lệch nhau mà không có cảnh báo nào bật lên.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình 5 — rang.sh ghim danh sách 16/21 thông điệp viết tay trong khi lời hứa E8 là «TOÀN BỘ ma trận»**
  Người dùng thấy gì: Công cụ kiểm nhanh mới theo dõi một phần các cảnh báo có thể xuất hiện; nếu một cảnh báo bị xoá nhầm khỏi nguồn gốc, phần kiểm nhanh này có thể không báo động dù bộ kiểm đầy đủ hơn vẫn bắt được lỗi đó.
  file: `_acceptance/hinh-tai-cong-1/rang.sh`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có finding nào trong mục này round này.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).