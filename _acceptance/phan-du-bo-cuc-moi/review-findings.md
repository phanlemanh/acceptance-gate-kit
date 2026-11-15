## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **recheck-evidence.cjs viết cứng tên plugin 'acceptance-gate' và khớp chuỗi con trên source, không tra theo vai qua bảng tên một nguồn**
  Người dùng thấy gì: Trong trường hợp hiếm, kiểm lại bằng chứng có thể nhận nhầm một gói có tên gần giống làm gói lõi. Các kho hiện nay không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ và hiếm gặp, không làm mất hay lộ dữ liệu; người dùng thấy lỗi thì kiểm tra lại được, và ghi thành giới hạn đã biết là đủ.
  file: `scripts/recheck-evidence.cjs`
  severity: low
  Đề xuất: known-limits

- **Đầu tệp bản nhân fixture trích sai sổ quyết định: d-20260912T024254Z-14 chọn MỘT module dùng chung, không phải «chuyển hay nhân bản»**
  Người dùng thấy gì: Người đọc lần theo ghi chú trong tệp kiểm sẽ thấy một quyết định cũ nói điều ngược lại. Sản phẩm chạy bình thường, chỉ gây hiểu nhầm khi đọc tài liệu.
  Căn cứ: Chỉ là chú thích sai, không ảnh hưởng người dùng cuối hay dữ liệu, nên sửa tay lúc nào tiện cũng được và không đáng mở việc riêng.
  file: `tests/fixtures/cua-veto-sau-chu-ky.mjs`
  severity: low
  Đề xuất: wont-fix

- **giu-khoa.mjs: `--base` with no value silently falls back to merge-base**
  Người dùng thấy gì: Nếu người vận hành gõ thiếu giá trị cho tuỳ chọn mốc so sánh, công cụ đo vẫn chạy ở mốc mặc định mà không báo lỗi. Số đo ra có thể không phải mốc họ định đo.
  Căn cứ: Chỉ xảy ra khi gõ sai lệnh, người dùng chạy lại là xong và không mất dữ liệu; sửa sau cũng rẻ nên ghi giới hạn là đủ.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình, không có đối chứng dương): `--cu` cho PASS «0/0» khi túi khoá bản gốc rỗng, cùng lớp lỗi vòng này vừa vá ở `--moi`**
  Người dùng thấy gì: Nếu bản gốc không chạy được, bước kiểm giữ khoá ở bố cục cũ có thể báo xanh dù thực ra chưa so sánh gì. Người ký có thể tin nhầm là không mất ca kiểm nào.
  Căn cứ: Chỉ xảy ra khi môi trường đo hỏng, không đụng tới người dùng cuối; nhưng màu xanh giả có thể đánh lừa người ký, nên cần khai rõ giới hạn này.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert trạng thái trong khi lời hứa là QUAN HỆ): GUI-B2 coi «thừa ở HEAD» là «diff của vòng làm thừa», không so với bản gốc**
  Người dùng thấy gì: Danh sách mục vá thừa gửi sang kho bên kia có thể lẫn vài mục vốn đã cũ từ trước, không phải do vòng này làm thừa. Người nhận có thể mất công xem lại vài mục không cần thiết.
  Căn cứ: Chỉ làm danh sách gửi đi dài hơn một chút, không mất dữ liệu và người nhận tự lọc được; ghi giới hạn là đủ.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
