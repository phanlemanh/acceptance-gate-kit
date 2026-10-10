# Review findings — dieu-phoi-mo-dot-mot-lenh (round 3)

## Trong hợp đồng

(không có finding nào trong hợp đồng ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **hang day-len với mã và --truoc cùng trỏ một hàng: mỗi lần chạy lại vẫn hạ uu_tien và ghi thêm Nhật ký và sự kiện**
  Người dùng thấy gì: Nếu người dùng gõ lệnh đẩy một việc lên trước chính nó, hệ thống vẫn báo đã đổi và mỗi lần gõ lại thì việc đó bị hạ thêm ưu tiên, nhật ký và sự kiện đợt phình thêm mà không có điểm dừng. Trường hợp này hiếm vì phải gõ nhầm hai mã giống nhau, nhưng người gõ không nhận được cảnh báo nào.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): chiều đỏ của «thieu-doi-so-ban-cu» xanh với mọi lỗi mang tên ca, kể cả khi bản tiêm không dựng lại được lỗi gốc**
  Người dùng thấy gì: Phép kiểm bảo vệ lỗi gõ thiếu đối số có thể báo xanh dù nó không còn tái hiện đúng lỗi gốc. Người dùng không thấy gì khác đi hôm nay, nhưng nếu lỗi đó quay lại sau này thì phép kiểm này có thể không kêu.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng ma trận không lấy từ tập phần tử): `can(day, '--day <dãy>')` của themHang không có ca nào, và nhánh chuỗi rỗng cũng không được đo**
  Người dùng thấy gì: Lệnh thêm việc mới mà quên khai dãy, và trường hợp khai dãy rỗng, chưa có phép kiểm nào canh. Nếu ai đó vô tình gỡ phần chặn ấy thì người dùng có thể thêm việc vào đợt mà không bị nhắc thiếu thông tin.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chẩn đoán của đợt đã mở chỉ một việc không làm được: `mo <tên> --goi` bị `daMo` chặn sớm, `/dieu-phoi:mo-dot` không bao giờ hết mục `thieu` (r2)**
  Người dùng thấy gì: Với một đợt đã mở từ trước mà chưa khai nguồn gói, lệnh mở đợt luôn báo còn thiếu và bảo người dùng làm một việc không thể làm được. Phiên giám sát có thể quay vòng ở bước này mà không bao giờ báo xong.
  file: `dieu-phoi/scripts/chan-doan.mjs`
  severity: medium
  Đề xuất: new-contract

- **`mo-dot.md` bảo giải `$AG` bằng resolve-plugin của feature-loop mà không có đường nào tới bộ giải đó; thiếu `--require` khuôn ô mà mẫu `--mo-o` sẵn có luôn kèm (r2)**
  Người dùng thấy gì: Khi mở đợt, bước mở ô cho hàng chờ duyệt có thể không tìm được công cụ cần dùng, hoặc chọn nhầm một bản cài thiếu tệp. Người dùng sẽ thấy việc mở đợt đứng ở giữa thẻ khởi tạo.
  file: `dieu-phoi/commands/mo-dot.md`
  severity: medium
  Đề xuất: new-contract

- **Thẻ khởi tạo báo hàng park/kill 'không vào đợt' nhưng bộ phát lịch vẫn giao hàng đó (r2)**
  Người dùng thấy gì: Thẻ nói một hàng đã bị dừng hoặc bỏ sẽ không vào đợt, nhưng thợ vẫn có thể được giao đúng hàng đó làm việc. Người duyệt thẻ tin rằng hàng ấy đã bị loại trong khi nó vẫn chạy.
  file: `dieu-phoi/scripts/the.mjs`
  severity: high
  Đề xuất: new-contract

- **`hang them <mã>` nhân bản một hàng đã có ở dãy khác, hai dãy cùng nhận một slug (r2 · tệp đã đổi)**
  Người dùng thấy gì: Thêm một hàng đã có sẵn ở dãy khác sẽ khiến hai thợ cùng nhận một việc và làm trùng nhau. Hàng thêm ra cũng bị tính là việc phát sinh thay vì việc của lộ trình.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: medium
  Đề xuất: new-contract

- **Mở lại đợt dựng tay cùng tên sau dong-dot thì kẹt vĩnh viễn ở pha dang-dong (r2)**
  Người dùng thấy gì: Nếu mở lại một đợt dựng tay trùng tên với đợt vừa đóng thì đợt không chạy lại được, và bộ phát lịch chỉ còn cấp việc gộp. Hiện nên đặt tên đợt mới thay vì dùng lại tên cũ.
  file: `dieu-phoi/scripts/dieu-phoi.mjs`
  severity: medium
  Đề xuất: known-limits

- **`dem` bỏ sót yêu cầu `can-nguoi` của thợ gửi chủ kho, đếm thiếu số lần gọi người (r2)**
  Người dùng thấy gì: Số lần gọi chủ kho mà lệnh đếm báo có thể thấp hơn thực tế vì bỏ sót những lần thợ xin việc chỉ người làm được. Con số này nên đọc như mức tối thiểu.
  file: `dieu-phoi/scripts/dem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Cho dãy nghỉ thì hàng đang làm của dãy biến mất khỏi tiep/, xem và bảng đợt (r2)**
  Người dùng thấy gì: Khi cho một dãy nghỉ, bảng đợt hiện dãy đó như đang chờ dù thợ vẫn đang làm dở một hàng. Người xem có thể tưởng dãy rảnh trong khi nó vẫn xin duyệt và gộp.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» thay cho quan hệ: giá trị hàng chờ ở DP2-12 trùng khớp nhờ dòng dãy, không nhờ phần hàng chờ (r2 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm xem và bảng đợt hiển thị cùng thông tin có thể vẫn xanh dù bảng hàng chờ bị mất. Nghĩa là xanh ở chỗ này chưa chứng minh được hàng chờ hiện đúng.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — lời hứa là QUAN HỆ thứ tự nhưng chiều đỏ DP2-01-do thu-tu chỉ đi qua nhánh «vắng chuỗi» (r2 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm trình tự các bước của lệnh mở đợt chưa chứng minh được là bắt lỗi đảo thứ tự. Nếu ai đó đảo bước, kiểm tra vẫn có thể báo xanh.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — E8 hứa ĐẲNG THỨC tập (ma, slug) nhưng kiemRoundTrip chỉ kiểm bao hàm một chiều (r2 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm đọc hàng từ lộ trình hai đường chỉ bắt được trường hợp thiếu, chưa bắt được trường hợp bộ đọc gói trả thừa hàng. Một hàng thừa hoặc trùng có thể lọt vào đợt mà kiểm tra vẫn xanh.
  file: `tests/dieu-phoi/mo-dot.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
