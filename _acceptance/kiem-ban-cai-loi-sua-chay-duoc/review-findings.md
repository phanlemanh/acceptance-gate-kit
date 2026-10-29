# Review findings: kiem-ban-cai-loi-sua-chay-duoc (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Mutant cases KL-4-dot and KL-7-dot count any missing backup as caught, so a mutant that crashes also passes**
  Người dùng thấy gì: Bộ kiểm tra việc sao lưu trước khi sửa sổ cài có thể báo đã bắt được lỗi trong khi thực ra bản thử bị hỏng và chưa từng chạy. Người dùng không thấy gì khác đi ở lệnh kiểm, chỉ là một lớp bảo hiểm của bộ kiểm yếu hơn mong muốn.
  Căn cứ: Không ảnh hưởng người dùng, không mất dữ liệu; chỉ làm bộ kiểm kém nhạy trong một tình huống hiếm, và luật chiều rộng đang đóng băng việc đo lại thước của thước.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **KL-2b-dot is not gated on KL-2b and does not pin the error, so any failure turns it green**
  Người dùng thấy gì: Phép thử chứng minh bộ lọc tệp không chạy bị nới rộng sẽ bị bắt có thể báo xanh vì một lý do khác (lệnh hỏng) thay vì đúng lý do. Người dùng không bị ảnh hưởng trực tiếp.
  Căn cứ: Chỉ làm bộ kiểm có thể xanh nhầm trong trường hợp lệnh thật đã hỏng, mà khi đó ca chính đã đỏ nên người ký vẫn thấy; không mất dữ liệu.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **KL-2b-mau compares a constant in the test file with a literal in the same file and can never fail**
  Người dùng thấy gì: Có một dòng kiểm trong bộ kiểm luôn xanh, tạo cảm giác được bảo vệ hơn thực tế. Người dùng cuối không thấy khác biệt.
  Căn cứ: Hậu quả chỉ là một dòng xanh thừa, bảo vệ thật đã nằm ở các ca khác; sửa không đổi gì cho người dùng.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Header comment names the case prefix LS-, but the file prints KL-**
  Người dùng thấy gì: Một dòng ghi chú trong bộ kiểm gọi nhầm tên nhóm ca, người đọc tìm theo đó sẽ tìm không ra. Không ảnh hưởng người dùng.
  Căn cứ: Nhầm lẫn nhỏ chỉ ở lời ghi chú, người đọc tự phát hiện ngay, không mất dữ liệu và không đổi hành vi nào.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Mutant cases count any failure as red: they don't pin the expected message and ignore the apply exit code**
  Người dùng thấy gì: Các ca thử bản sao bị tiêm lỗi chấp nhận mọi kiểu thất bại là đã bắt được lỗi, kể cả khi bản thử chỉ chết giữa chừng. Người dùng không thấy khác biệt.
  Căn cứ: Chỉ yếu ở độ chặt của bộ kiểm trong tình huống hiếm, không gây mất dữ liệu cho người dùng; tất cả ca hiện đều xanh.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên «hằng bị nới rộng phải làm ca đỏ» (cả lớp) mà chỉ có ba điểm-case; KL-2b-mau là phép so hằng với chính nó**
  Người dùng thấy gì: Nếu có người nới danh sách tệp được coi là không chạy sang cả thư mục mã thật khác, lệnh kiểm có thể hạ lệch mã thật từ đỏ xuống vàng mà bộ kiểm vẫn xanh. Khi đó người dùng có thể chấp nhận một bản cài lệch mã mà không được cảnh báo.
  Căn cứ: Hậu quả chỉ xảy ra nếu chính người sửa kit nới danh sách nhầm, hiếm và tự đảo được; ghi vào giới hạn đã biết với ngưỡng đang đếm là đủ, không mở thêm vòng đo thước.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — KL-5 chỉ kiểm âm tính «không có ‹cài lại ở› kể cây phụ», không có đối chứng dương cho chuỗi đó**
  Người dùng thấy gì: Nếu chữ nhắc cài lại trong cảnh báo được đổi tên, phép kiểm không để cây phụ lọt vào danh sách cài lại sẽ xanh vô nghĩa, và lỗi cũ có thể quay lại mà không ai biết. Người dùng khi đó lại bị chỉ sai chỗ cài lại.
  Căn cứ: Chỉ xảy ra khi có người đổi chữ nhãn mà không đổi bộ kiểm, và hậu quả là một lời khuyên sai tự đảo được bằng cách chạy lại; không mất dữ liệu.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — đường đổi «tính từ gốc kho» (tuGocKho, khi nguồn gói khác '.') không có ca nào; ca tên feature-loop/LO-TRINH.html đo nhầm đường mã**
  Người dùng thấy gì: Khi một gói cài có nguồn không nằm ở gốc kho, bộ kiểm chưa có ca nào chứng minh cách tính đường tệp từ gốc kho còn đúng. Nếu cách tính đó hỏng, một tệp mã có thể bị coi nhầm là tệp không chạy và chỉ ra cảnh báo vàng thay vì đỏ, mà bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả chỉ xảy ra ở một hình dạng gói hiếm, bộ kiểm hiện tại đã phủ các ca tên giống mẫu, và nếu sai thì người dùng vẫn thấy cảnh báo vàng nêu tên tệp nên không mất dữ liệu và dễ phát hiện lại.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — KL-1/KL-2 kiểm «tên có mặt ở đâu đó trong dòng» trong khi lời hứa là quan hệ (tên nằm ở vế tệp không chạy lệch)**
  Người dùng thấy gì: Cảnh báo vàng có thể gọi tên tệp ở một vế khác với vế người đọc mong đợi mà bộ kiểm vẫn xanh. Người dùng vẫn thấy đủ tên tệp, chỉ khác chỗ xuất hiện.
  Căn cứ: Nhẹ: người dùng vẫn thấy đủ tên tệp lệch trong cùng một dòng, không mất dữ liệu, chỉ là cách phân nhóm trên dòng có thể chưa đúng ý.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — sổ cài và bản ghi cây phụ là fixture viết tay đúng khuôn bên đọc, không đi vòng qua bên ghi thật**
  Người dùng thấy gì: Sổ cài dùng để thử là bản tự dựng, nên nếu sổ thật của công cụ ghi bản ghi cây phụ khác đi, lệnh kiểm và lối sửa có thể sai trên máy thật mà bộ kiểm vẫn xanh. Người dùng khi đó sẽ thấy lời khuyên không chạy được.
  Căn cứ: Sổ cài thật đã được thử ở bộ ca khác và lần nhận kit kế tiếp là phép đo thật; nếu sai thì người dùng chỉ phải sửa tay và lệnh có sao lưu nên không mất dữ liệu.
  file: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
