## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **PR shards for workflows and dieu-phoi no longer install zsh, so their zsh legs are silently skipped on the merge gate**
  Người dùng thấy gì: Trên lượt kiểm của PR, hai nhóm kiểm không còn chạy phần dành cho vỏ lệnh zsh nên bị bỏ qua im lặng. Một lỗi chỉ lộ ở zsh có thể qua PR xanh và chỉ bị bắt sau khi đã gộp vào nhánh chính.
  Căn cứ: Lỗi lọt qua cổng gộp rồi mới bị bắt ở nhánh chính là hậu quả vừa phải nhưng làm mất đúng thứ cổng này để bảo vệ, và sửa lúc này rẻ (bật lại zsh cho hai mảnh) nhưng đổi điều hợp đồng đã ký nên cần người quyết.
  file: `.github/workflows/gate.yml`
  severity: medium
  Đề xuất: new-contract

- **Mảnh PR của workflows và dieu-phoi không cài zsh, nên các ca chạy dưới zsh bị bỏ qua im lặng trên PR**
  Người dùng thấy gì: Các ca kiểm chạy dưới zsh tự bỏ qua trên lượt kiểm của PR vì máy không có zsh, nên PR vẫn xanh dù lỗi chỉ lộ ở zsh. Lỗi đó chỉ bị bắt ở lượt trọn sau khi đã gộp.
  Căn cứ: Lỗi lọt qua cổng gộp rồi mới bị bắt ở nhánh chính là hậu quả vừa phải, người dùng không tự gỡ được, và sửa rẻ nhưng cần người quyết vì đổi điều hợp đồng đã ký.
  file: `.github/workflows/gate.yml`
  severity: medium
  Đề xuất: new-contract

- **Ca LKN-AC7-hooks và LKN-AC7-that chạy bộ hooks và plugins THẬT trong cây đang chấm, chồng lên các lệnh suite chạy cùng lúc trong lượt chấm**
  Người dùng thấy gì: Khi lượt chấm chạy, hai lượt kiểm có thể cùng dùng một thư mục tạm và xoá dữ liệu của nhau, làm lượt chấm đỏ oan. Người dùng chỉ phải chạy lại, nhưng mất thời gian chờ và gây nhiễu.
  Căn cứ: Hậu quả nhẹ và tự gỡ được bằng chạy lại, nên ghi thành hạn chế đã biết thay vì mở việc mới.
  file: `tests/scripts/luot-kiem-nhe.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): LKN-AC9-do-lm13/do-lm20 không có đối chứng xanh trên cùng fixture, ca dương LKN-AC9-lm còn nhận FAIL = FAIL**
  Người dùng thấy gì: Phép kiểm so ba ca chậm cũ và mới có thể báo xanh khi cả hai bản đều đang đỏ sẵn. Nếu cây đã hỏng từ trước, người ký sẽ không được cảnh báo ở chỗ này.
  Căn cứ: Chỉ làm mất một lớp cảnh báo ở bộ kiểm chứ không ảnh hưởng người dùng sản phẩm, và các ca gốc của ba bài kiểm kia vẫn đỏ riêng nên mức nặng thấp.
  file: `tests/scripts/luot-kiem-nhe-ca-cham.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» thay cho QUAN HỆ (hình dạng 3): kiểm «gọi tên hồ sơ» ở LKN-AC9-do-lm13 không thể đỏ**
  Người dùng thấy gì: Phép kiểm xác nhận hai bản cùng chỉ đúng hồ sơ bị lệch đang yếu hơn lời hứa, nên có thể xanh dù thông điệp lỗi chỉ sai hồ sơ. Người ký có thể tin rằng chỗ này đã được canh chặt hơn thực tế.
  Căn cứ: Ảnh hưởng chỉ ở độ tin của bộ kiểm, không làm mất dữ liệu hay hại người dùng, và hai bản vẫn cùng đỏ nên rủi ro thấp.
  file: `tests/scripts/luot-kiem-nhe-ca-cham.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đo CẤU TRÚC thay vì ĐẦU RA (hình dạng 1): khoá nhớ tách cổng chỉ được canh bằng lời tự khẳng định trên `_khoa`; fixture hỏng-một-cổng đỏ qua đường không đi qua bộ nhớ**
  Người dùng thấy gì: Phép kiểm chống việc bộ nhớ gộp hai cổng chỉ canh hình dạng khoá, chưa đo thẻ cổng 2 thật sự được đọc đúng. Một kiểu lỗi nhớ khác vẫn có thể lọt mà lượt kiểm báo xanh.
  Căn cứ: Khoảng hở có thật nhưng hẹp và chỉ ở bộ kiểm, không ảnh hưởng trực tiếp người dùng, và sửa sâu sẽ đắt hơn hậu quả.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
