# Review findings: bo-doc-ho-so-khoan-dung (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **yaml-chuan.cjs: `--base` with no value silently falls back to scanning the whole repo and blocks old signed records**
  Người dùng thấy gì: Nếu bước kiểm tự động của một kho gọi lệnh kiểm với mốc so sánh bị rỗng, lệnh không báo lỗi mà lặng lẽ kiểm cả những hồ sơ cũ đã ký, nên có thể làm đỏ bản dựng của kho vì hồ sơ không liên quan đến thay đổi đang gộp.
  file: `scripts/yaml-chuan.cjs`
  severity: medium
  Đề xuất: known-limits

- **YC-3-do concludes from a negative result alone, with no positive control and no check that the flag constant was extracted**
  Người dùng thấy gì: Một ca kiểm chứng rằng bản cũ của thẻ không có cờ vàng có thể báo xanh ngay cả khi nó không kiểm được gì, nên người đọc kết quả có thể tin chiều đỏ của cờ vàng chắc hơn thực tế.
  file: `tests/scripts/yaml-chuan.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **The shared date reader also took over approved_at/decided_at/tt.at in the summary strip, but cat-luot still reads approved_at as ISO-only and the real-data check does not measure that wider reach**
  Người dùng thấy gì: Dải tóm tắt hồ sơ nay hiểu thêm ngày viết kiểu ngày/tháng/năm ở vài trường ngày khác, còn bản đếm nhịp cắt lượt thì vẫn bỏ qua kiểu ngày đó ở một trường, nên hai nơi có thể lệch nhau nếu sau này có hồ sơ ghi như vậy; hiện chưa kho nào gặp.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: low
  Đề xuất: known-limits

- **--base silently passes (exit 0) when --root is not the git top-level**
  Người dùng thấy gì: Với kho mà thư mục hồ sơ nằm sâu trong một thư mục con của kho lớn, lệnh kiểm theo mốc so sánh sẽ báo sạch dù hồ sơ vừa sửa vẫn sai cú pháp, nên bước kiểm tự động của kho đó xanh đúng ở chỗ nó cần chặn. Bảy kho hiện dùng kit đều đặt hồ sơ ở gốc nên chưa ai gặp.
  file: `scripts/yaml-chuan.cjs`
  severity: medium
  Đề xuất: known-limits

- **CLI crashes exit 1 (the 'has findings' code) instead of the documented 2 on read/git errors**
  Người dùng thấy gì: Khi lệnh kiểm gặp tệp không đọc được hoặc lỗi bất ngờ từ công cụ quản lý phiên bản, nó báo như thể đã tìm thấy chỗ sai cú pháp thay vì báo là không kiểm được, nên người đọc có thể đi sửa hồ sơ trong khi vấn đề nằm ở môi trường.
  file: `scripts/yaml-chuan.cjs`
  severity: low
  Đề xuất: known-limits

- **Quoted VALUE followed by `: x` is accepted silently (false negative in chu-sau-nhay-dong class)**
  Người dùng thấy gì: Có một kiểu viết sai cú pháp hiếm (giá trị trong nháy rồi lại thêm dấu hai chấm và chữ) mà thẻ sẽ không cắm cờ vàng, dù công cụ đọc YAML chuẩn từ chối; hồ sơ viết như vậy vẫn được kit đọc như trước.
  file: `scripts/yaml-chuan.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (kết luận âm tính một mình): phép so «doc-theo-dong: 0 lech» so hai bản thư viện giống hệt từng byte nên không thể đỏ**
  Người dùng thấy gì: Dòng báo «cách kit đọc hồ sơ không đổi» luôn ra xanh vì hai bên so là cùng một mã, nên nó không tự chứng minh được gì; lời hứa đó thực ra được giữ nhờ việc vòng này không đụng vào phần đọc hồ sơ.
  file: `_acceptance/bo-doc-ho-so-khoan-dung/rang/bay-kho.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
