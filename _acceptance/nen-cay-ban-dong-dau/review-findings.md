## Trong hợp đồng

(không có finding nào map được vào AC ở lượt này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khối SUITE-TRANG-THAI viết lại vẫn nuốt lỗi git status im lặng, trái nếp «bỏ qua không im lặng» của chính tệp**
  Người dùng thấy gì: Nếu bước đọc trạng thái kho gặp lỗi ngay sau khi bộ kiểm thử chạy xong, công cụ âm thầm coi như cây sạch mà không hiện cảnh báo nào, nên người dùng có thể bỏ lỡ dấu hiệu cho thấy kết quả kiểm tra không đáng tin.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Hàm trangThai() mới trả Set rỗng khi git status lỗi, nên chân suite XANH mà không báo gì**
  Người dùng thấy gì: Nếu việc đọc trạng thái kho lỗi ngay sau khi bộ kiểm thử chạy, công cụ sẽ báo bước kiểm tra là 'sạch/qua' dù thực chất không kiểm tra được gì, nên lỗi thật có thể bị bỏ sót mà không có cảnh báo.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có mục nào)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
