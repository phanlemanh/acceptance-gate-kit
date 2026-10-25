## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Danh sách chép CI tri thức vẫn thiếu opportunity-template.md: lỗi cùng lớp với tri-thuc-template.md, mới sửa một trường hợp**
  Người dùng thấy gì: Kho nhận bản chép khai tầng tri thức sẽ gặp lỗi thiếu tệp khi tra cứu tri thức theo tên hồ sơ hoặc khi hiện thẻ cổng đầu. Người dùng không tra được tri thức ở kho đó cho tới khi bổ sung tệp khuôn còn thiếu.
  Căn cứ: Lỗi chặn hẳn một tính năng mới ở kho chép theo danh sách nhưng người dùng không tự gỡ được; sửa rẻ (thêm một tệp vào danh sách) nên nên làm thành bản vá riêng ngay sau mốc, không nhét vào mốc đang cắt.
  file: `commands/acceptance-init.md`
  severity: high
  Đề xuất: new-contract

- **Lint tri thức (--kiem) ở kho chỉ khai tri_thuc vỡ vì nạp cat-luot.mjs, tệp mang nhãn tin_hieu; CT3 che lỗi bằng cách khai thêm tin_hieu**
  Người dùng thấy gì: Kho chỉ bật tầng tri thức mà không bật tầng tín hiệu sẽ không chạy được bước kiểm tra tri thức vì thiếu một tệp. Hai kho đang chờ nhận (crm, invest) khai cả hai nên chưa ai vấp.
  Căn cứ: Hậu quả nhẹ vì chỉ ảnh hưởng tổ hợp cấu hình hiếm chưa kho nào dùng, báo lỗi rõ và người dùng gỡ được bằng cách khai thêm tầng tín hiệu; sửa đắt hơn lợi ích hiện tại nên ghi giới hạn đã biết.
  file: `tests/scripts/chep-tri-thuc-du.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **CT1 tự chép tay skills/cat-luot/SKILL.md, tệp không có trong danh sách chép, nên ca này không đo đúng bản chép thật mà kho nhận được**
  Người dùng thấy gì: Phép thử xác nhận kho nhận bản chép chạy được lại dùng thêm một tệp mà kho thật có thể không có, nên màu xanh của nó có thể đẹp hơn thực tế. Người dùng kho nhận có thể gặp lỗi thiếu tệp ở lệnh cắt lượt mà phép thử không báo trước.
  Căn cứ: Sai lệch nằm ở độ tin của phép thử chứ không phải ở sản phẩm đã giao, kho nhận hiện có chưa bị ảnh hưởng và dễ phát hiện khi chạy; ghi lại để vòng sau sửa.
  file: `tests/scripts/chep-tri-thuc-du.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): kho tiêu thụ của CT1/CT2/CT4 được chép thêm tay skills/cat-luot/SKILL.md, tệp không có trong danh sách chép**
  Người dùng thấy gì: Ba ca thử xác nhận bản chép đủ đều xanh nhờ một tệp mà kho nhận không chắc có, nên lời hứa chép đủ chưa được chứng minh đúng cho kho thật. Kho nhận có thể gặp lỗi khi chạy lệnh cắt lượt dù phép thử báo ổn.
  Căn cứ: Là sai lệch của thước đo chứ không phải lỗi đã làm hỏng dữ liệu hay chặn người dùng, và báo lỗi rõ khi gặp; gộp chung với t3 để sửa một lần ở vòng sau.
  file: `tests/scripts/chep-tri-thuc-du.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): CT3 kết luận «lint tri thức chạy» chỉ từ việc đầu ra KHÔNG chứa ENOENT/Cannot find module, không ghim mã thoát hay dòng kết quả**
  Người dùng thấy gì: Phép thử kiểm tra bước kiểm tra tri thức chỉ xác nhận không có lỗi thiếu tệp, chưa xác nhận bước đó thật sự chạy xong và báo kết quả đúng. Người dùng không bị ảnh hưởng hôm nay vì bản hiện tại chạy đúng.
  Căn cứ: Hậu quả nhẹ vì bản hiện tại đã đo chạy ra kết quả đúng, chỉ là phép thử còn lỏng để bắt lỗi sau này; sửa rẻ nhưng không cần chặn mốc.
  file: `tests/scripts/chep-tri-thuc-du.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
