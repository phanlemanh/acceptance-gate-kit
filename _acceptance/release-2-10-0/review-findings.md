## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Răng chống lách «không đo được» hẹp lại: coNguoiDungCuoi bỏ sót token surfaces có gạch nối/khoảng trắng, và hai bản dựng của cùng vị từ nay bất đồng**
  Người dùng thấy gì: Một bước kiểm an toàn có nhiệm vụ bắt buộc con người xem lại các tính năng ảnh hưởng người dùng cuối có thể bị vô hiệu âm thầm với một số cách viết tên miền, khiến việc rủi ro được phát hành mà không qua đúng bước duyệt.
  file: `lib/nguong-o-co-hoi.cjs`
  severity: medium
  Đề xuất: new-contract

- **loop-health.mjs tự viết bộ đọc frontmatter + cắt chú thích, đúng lớp mà chính diff này vừa gom về một nguồn**
  Người dùng thấy gì: Một công cụ báo cáo nội bộ có thể đọc nhầm trạng thái của một hồ sơ công việc và tính sai thời gian ra quyết định, nhưng không ảnh hưởng gì tới điều khách hàng thấy hay dùng.
  file: `scripts/loop-health.mjs`
  severity: low
  Đề xuất: known-limits

- **lib/lop-nhin-thay.cjs require chéo lib KHÔNG guard, ngược đúng luật mà chính commit này ghi vào context-glossary.js**
  Người dùng thấy gì: Ở một số nơi cài đặt thiếu file phụ trợ, một bước kiểm hiển thị tính năng có thể dừng hoạt động với thông báo lỗi mơ hồ thay vì nói rõ đang thiếu phần nào, khiến việc chẩn đoán khó hơn.
  file: `lib/lop-nhin-thay.cjs`
  severity: low
  Đề xuất: known-limits

- **W6 vocab rule silently stops firing for any _Avoid_ alias whose parsed text is not byte-identical to the hyphenated ASCII token inside it**
  Người dùng thấy gì: Một bước kiểm tính nhất quán về từ ngữ trong tài liệu có thể âm thầm ngừng bắt các từ bị cấm hoặc không khuyến khích, khiến thuật ngữ lỗi thời hoặc không nhất quán lọt qua mà không ai hay biết.
  file: `lib/context-glossary.js`
  severity: medium
  Đề xuất: new-contract

- **coNguoiDungCuoi narrowed from substring match to strict comma-token equality — non-comma surfaces values no longer count as human-facing, disabling the Gate-1 blocking flag**
  Người dùng thấy gì: Một bước kiểm an toàn bắt buộc con người duyệt lại các tính năng ảnh hưởng người dùng cuối có thể ngừng hoạt động với một số cách trình bày, khiến những tính năng đó được phát hành mà không qua đúng bước duyệt dự kiến.
  file: `lib/nguong-o-co-hoi.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 — «chiều đỏ» của phép quét PV5 là mệnh đề hằng đúng, không bao giờ đỏ được**
  Người dùng thấy gì: Một bài kiểm tra vốn để chứng minh một bước an toàn còn hoạt động thì không bao giờ có thể báo lỗi, nên nếu bước an toàn đó hỏng trong tương lai sẽ không có ai được cảnh báo.
  file: `tests/scripts/w6-w8-pham-vi.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — evals E11 khai bản base là ref trôi `origin/main`, trong khi phép đo thật neo SHA cố định (theo khai thì phép so hoá rỗng sau merge)**
  Người dùng thấy gì: Hướng dẫn viết sẵn để chạy lại một lần kiểm tra cũ mô tả một cách làm mà lúc nào cũng báo thành công kể cả khi bản vá bị lỗi, nên nếu ai đó dựa vào hướng dẫn đó sau này có thể tin nhầm là mọi thứ vẫn ổn.
  file: `_acceptance/duong-lui-phai-song/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — evals của lop-bang-chung-nhin-thay khai chiều đỏ dựa nhánh `main` (ref trôi) trong khi ca đã neo SHA**
  Người dùng thấy gì: Hướng dẫn viết sẵn để kiểm tra lại một bản vá cũ sẽ trở nên sai lệch sau khi phát hành này ra mắt, có thể khiến một lần kiểm tra trong tương lai báo đúng hoặc sai một cách nhầm lẫn.
  file: `_acceptance/lop-bang-chung-nhin-thay/evals.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
