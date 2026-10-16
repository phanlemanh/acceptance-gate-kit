# Review findings: cham-lai-khong-tu-doi (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lý do mang sang được nối giữa hai script bằng regex trên chuỗi tiếng người, không rút từ một nguồn chung**
  Người dùng thấy gì: Dòng báo «eval không mang sang» phụ thuộc vào đúng chữ của bên kia. Nếu có người đổi chữ ở một phía, dòng báo có thể biến mất im lặng dù việc chạy lại vẫn đúng.
  Căn cứ: Hôm nay không ai bị ảnh hưởng, vì các ca kiểm hiện có canh đúng dòng này; hậu quả nếu xảy ra chỉ là mất một dòng thông báo, không sai kết quả chấm, và sửa sau không đắt.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Không đọc được hợp đồng ở lượt gốc thì máy báo nhầm «tiêu chí đổi chữ» thay vì «không đọc được định nghĩa»**
  Người dùng thấy gì: Trong một ca hiếm, thẻ nói sai lý do eval phải chạy lại («tiêu chí đổi chữ» thay vì «không đọc được định nghĩa»). Eval vẫn được chạy lại nên kết quả chấm không sai.
  Căn cứ: Chỉ sai câu giải thích, không sai kết luận và không mất dữ liệu; người dùng không cần làm gì, và ca này hiếm nên chưa đáng mở việc riêng.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: low
  Đề xuất: known-limits

- **Phép so của AC-7 trong evals bỏ nhiều trường hơn chữ tiêu chí**
  Người dùng thấy gì: Thẻ AC-7 xanh được đọc là «bằng nhau trên mọi trường trừ giờ và sha», nhưng thực tế phép so còn bỏ thêm hai trường cùng loại. Người đọc có thể tin thước chặt hơn một chút so với thực tế.
  Căn cứ: Hai trường bị bỏ khác nhau tất yếu giữa hai kho dựng riêng, nên không che lỗi thật nào; chỉ cần ghi một dòng vào giới hạn đã biết là đủ, rẻ và đảo được.
  file: `_acceptance/cham-lai-khong-tu-doi/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Phép so chữ tiêu chí tự tắt, không báo gì, khi eval khai nhiều tiêu chí hoặc mã tiêu chí có hậu tố**
  Người dùng thấy gì: Với những eval khai nhiều tiêu chí hoặc mã có hậu tố, nếu chữ tiêu chí đổi thì máy vẫn mang màu xanh cũ sang mà không báo gì. Kho crm đang có hàng chục eval thuộc dạng này nên chúng vẫn bị lỗi cũ là xanh theo định nghĩa đã đổi.
  Căn cứ: Hậu quả nặng vừa: một eval có thể xanh giả sau khi tiêu chí đổi mà không ai thấy, và thật sự đang chạm kho crm; người dùng không tự phát hiện được. Sửa tương đối rẻ nên đáng làm thành một việc riêng.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: new-contract

- **Truyền --args trỏ tệp không đọc được thì bỏ qua cả phép so thước lẫn so cây mà vẫn thoát 0**
  Người dùng thấy gì: Nếu người chấm gõ sai đường dẫn tệp tham số, hai lưới báo thước lệch và cây đổi âm thầm tắt và lượt vẫn báo thành công. Thẻ có thể hiện xanh trong khi hai kiểm tra đó chưa từng chạy.
  Căn cứ: Hậu quả vừa: mất hai lớp canh mà bề ngoài vẫn thành công, người dùng khó tự biết; nhưng chỉ xảy ra khi gõ sai đường dẫn và chạy lại với đường đúng là hết, nên sửa riêng một việc nhỏ là hợp lý.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 4 (thiếu đối chứng dương, không ghim kết quả): ma trận chiều im CL7 chỉ so bằng nhau giữa bản mới và bản trước vòng, không ghim mã thoát hay loại dòng mong đợi của từng ô**
  Người dùng thấy gì: Một ca kiểm chưa tự chứng minh được rằng nó đang kiểm đúng tình huống mà nó tuyên bố. Hôm nay kết quả thật vẫn đúng, nhưng nếu về sau ca này hỏng im lặng thì vẫn hiện xanh.
  Căn cứ: Chưa gây sai cho người dùng nào vì đã đo thấy mọi ô đúng; rủi ro chỉ là về sau mất khả năng phát hiện, và ghi vào giới hạn đã biết là đủ cho lúc này.
  file: `tests/scripts/cham-lai-khong-tu-doi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): LC4(4) sửa tay invokedAt của tệp args lượt 1 thành 2098 cho vừa vị từ moiHonLuot, rồi evals gọi đó là «hình dạng lượt chết thật»**
  Người dùng thấy gì: Một ca kiểm cũ dùng dữ liệu vá tay nhưng được gọi là «lượt chết thật». Hình dạng thật đã được một ca khác kiểm bằng dữ liệu máy sinh, nên người dùng không mất lớp canh nào.
  Căn cứ: Không ảnh hưởng người dùng vì ca khác đã phủ đúng tình huống thật; chỉ là cách gọi tên hơi quá, sửa tốn công hơn nhiều so với lợi ích.
  file: `tests/scripts/cay-doi-trong-luot.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
