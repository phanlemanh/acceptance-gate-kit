# Review findings: xuat-du-lieu-lo-trinh (round 2)

## Trong hợp đồng

Không có mục nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **LT-118 bang-khoa không có chiều đỏ cho khoá mà đầu vào tự cung cấp — bỏ 'hang_ke' khỏi bảng khoá trong docDuLieu vẫn xanh**
  Người dùng thấy gì: Kiểm tra tự động chưa bắt được trường hợp ai đó lỡ xoá một mục khỏi bảng khoá của bộ đọc mẫu, nên một thay đổi như vậy có thể lọt qua mà không báo đỏ. Hôm nay bộ đọc vẫn chạy đúng; rủi ro chỉ là lỗi tương lai khó bị phát hiện sớm.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **LT-120 tham chiếu biến `ngay` ngoài phạm vi — tiến trình con lỗi thì ra ReferenceError thay cho chẩn đoán**
  Người dùng thấy gì: Khi phép kiểm tra luật so ngày tự hỏng, người bảo trì thấy một lỗi khó hiểu thay vì nguyên nhân thật, nên mất thêm thời gian tìm lỗi. Sản phẩm người dùng thấy không bị ảnh hưởng.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **LT-120: the error path for a failed child process uses `ngay`, which no longer exists in that scope, so the real error is lost**
  Người dùng thấy gì: Khi phép kiểm tra luật so ngày tự hỏng, người bảo trì thấy một lỗi khó hiểu thay vì nguyên nhân thật, nên mất thêm thời gian tìm lỗi. Sản phẩm người dùng thấy không bị ảnh hưởng.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên cả lớp nhưng chỉ có ca lẻ): LT-118 hứa «khoá thiếu là rỗng theo kiểu» cho mọi khoá, nhưng chỉ kiểm hai khoá; bảng-khoa có trọn ma trận mà chỉ so tên khoá**
  Người dùng thấy gì: Bộ đọc mẫu chỉ được kiểm chắc ở vài trường hợp thiếu dữ liệu; với các trường khác, nếu thiếu thì giá trị thay thế có thể sai kiểu và làm một trang chiếu bên ngoài vỡ khi đọc trang thiếu dữ liệu. Hiện chưa có trường hợp thật nào bị vỡ.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tài liệu cho kho tiêu thụ nói sai cách thoát ký tự: «mọi `<` đã được viết thành `<`» (r1 · tệp đã đổi)**
  Người dùng thấy gì: Tài liệu hướng dẫn cho kho khác có một câu giải thích cách trang bảo vệ dữ liệu bị mất đúng ký hiệu then chốt, nên người đọc không hiểu vì sao cách cắt khối an toàn. Họ vẫn đọc được dữ liệu bằng cách thông thường, chỉ là phần giải thích bị khó hiểu.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: medium
  Đề xuất: known-limits

- **Phép chia nhóm tiến độ vẫn dựng hai lần, dù chú thích tuyên «MỘT hàm» (r1 · tệp đã đổi)**
  Người dùng thấy gì: Cách chia nhóm tiến độ đang được tính ở hai chỗ giống hệt nhau. Hiện hai chỗ khớp nhau và người xem không thấy khác biệt, nhưng sau này sửa một chỗ mà quên chỗ kia thì trang và dữ liệu đi kèm có thể lệch.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **LT-119 kiểm GUIDE trên cây KIT, không trên cây `kit` đang đo, và vế GUIDE không có chiều đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Việc kiểm tra rằng sổ tay hướng dẫn có trỏ tới tài liệu mới chưa từng được thử theo chiều ngược lại. Nếu ai đó xoá dòng trỏ đó đi, bộ kiểm tra có thể vẫn báo ổn.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Consumer doc says '<' is written as '<' (escape sequence lost) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Tài liệu hướng dẫn cho kho khác có một câu giải thích cách trang bảo vệ dữ liệu bị mất đúng ký hiệu then chốt. Người viết bộ đọc bằng ngôn ngữ khác sẽ không biết quy tắc thật, dù việc đọc dữ liệu thông thường vẫn làm được.
  file: `skills/acceptance/references/lo-trinh-du-lieu.md`
  severity: low
  Đề xuất: known-limits

- **E2/E8 say the comparison goes through docDuLieu, but the tests parse the block with their own JSON.parse (r1 · tệp đã đổi)**
  Người dùng thấy gì: Lời mô tả của bộ kiểm tra nói việc so sánh đi qua bộ đọc mẫu, nhưng thực tế kiểm tra đọc dữ liệu bằng cách riêng. Kết quả xanh có thể bị hiểu rộng hơn những gì đã thật sự được thử.
  file: `_acceptance/xuat-du-lieu-lo-trinh/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Shape 2 (round trip not read by the shipped reader): LT-117 parses the block with the test's own JSON.parse while E8 claims docDuLieu returns the original string (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép thử chuỗi có ký tự nguy hiểm đọc dữ liệu bằng cách riêng, không qua bộ đọc mẫu giao cho các kho khác. Nếu bộ đọc mẫu sau này đổi cách cắt khối, phép thử vẫn báo ổn.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (pinned message missing part of the promise): LT-111-do doi-trang-thai pins only the row code, not the two status words E2 requires (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi một hàng bị đổi trạng thái, thông báo lỗi chắc chắn nêu đúng hàng nhưng bộ kiểm tra không ép phải nêu cả hai trạng thái cũ và mới. Thông báo hiện tại vẫn đủ rõ, chỉ là chưa có gì giữ cho nó luôn như vậy.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
