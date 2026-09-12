## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Cổng bộ máy chỉ kiểm export, không kiểm bên gọi recheck-evidence.cjs: lớp lai lib mới + scripts cũ vẫn lọt, làn ghi rồi mới đỏ, thoát 1 (trùng mã LÀN ĐỎ)**
  Người dùng thấy gì: Nếu chạy chiến dịch ghim lại trên một bản cài acceptance-gate có thư mục lib đã cập nhật nhưng thư mục scripts đi kèm vẫn ở bản cũ, công cụ có thể báo kết quả đỏ (thất bại) dù dữ liệu đã được ghi đúng — người vận hành cần biết đây là giới hạn đã ghi nhận, chưa được tự động phát hiện.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hinh dang 5 — dem o cua ma tran GL03 tu so voi chinh no; guard 'so o lech' khong bao gio do duoc**
  Người dùng thấy gì: Một phép kiểm nội bộ trong bộ test dùng để đối chiếu số lượng mục trong bảng dữ liệu không thực sự có khả năng phát hiện sai lệch — nếu sau này bảng đó bị lệch thật, bộ test sẽ vẫn báo xanh và người dùng sẽ không được cảnh báo.
  file: `tests/scripts/repin-lane-lop-cu.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).