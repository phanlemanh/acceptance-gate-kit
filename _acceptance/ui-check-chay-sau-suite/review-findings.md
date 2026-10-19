## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5 — bảng Coverage tuyên trục A (executor) có 4 giá trị, nhưng ca chỉ đo 3; không ca nào đỏ khi `test` bị gỡ khỏi bộ lọc**
  Người dùng thấy gì: Nếu sau này có người vô tình bỏ loại eval test khỏi danh sách được chạy riêng, bộ kiểm tra hiện tại vẫn báo xanh. Khi đó eval loại này có thể lại chạy chồng lên các lệnh khác như trước đây. Hôm nay hành vi vẫn đúng và chỉ thiếu một lưới bắt lỗi cho trường hợp tương lai.
  Căn cứ: Hôm nay người dùng không bị ảnh hưởng, rủi ro chỉ xuất hiện nếu ai đó sửa nhầm về sau; hợp đồng đã khai rõ việc chọn script làm đại diện, và bổ sung ca kiểm tra sau này rất rẻ.
  file: `tests/scripts/s4-args-ui-check-chay-sau-suite.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
