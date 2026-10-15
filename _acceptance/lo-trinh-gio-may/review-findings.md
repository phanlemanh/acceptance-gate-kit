# Review findings — lo-trinh-gio-may (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Đọc tệp hạn mức tuần không kiểm mốc đặt lại có hợp lệ không, nên phép so theo phút mới thêm làm bước đo vòng sập**
  Người dùng thấy gì: Nếu tệp ghi các lần đọc hạn mức của cả máy có một dòng bị sửa tay hoặc ghi dở, bước đo cuối vòng sẽ báo lỗi và không ghi dòng giờ máy cho vòng đó. Người dùng phải xoá hoặc sửa dòng hỏng rồi chạy lại mới có số đo.
  Căn cứ: Hậu quả nhẹ: chỉ xảy ra khi tệp bị sửa tay hoặc hỏng, không mất dữ liệu nào, và người dùng tự gỡ được bằng cách xoá dòng hỏng rồi đo lại.
  file: `scripts/do-vong.mjs`
  severity: low
  Đề xuất: known-limits

- **A malformed reset time in the shared machine-wide readings file now crashes the whole gio-may measurement**
  Người dùng thấy gì: Một dòng hỏng trong tệp hạn mức dùng chung của cả máy làm bước đo giờ máy sập và vòng đó không được ghi giờ máy, giờ chờ lẫn token, cho tới khi dòng hỏng được gỡ. Mọi vòng trên máy đều vướng cùng lỗi này.
  Căn cứ: Hậu quả nhẹ và hiếm: tệp chỉ hỏng khi bị sửa tay hoặc ghi dở, không mất dữ liệu, và người dùng tự khắc phục được bằng cách xoá dòng hỏng rồi chạy lại phép đo.
  file: `scripts/do-vong.mjs`
  severity: low
  Đề xuất: known-limits

- **do-vong.mjs dùng isMain so bằng path.resolve thay vì realpath; gọi qua symlink thì thoát 0 mà không làm gì (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu kho nằm dưới một thư mục liên kết, bước đo giờ máy của vòng báo xong êm ru nhưng không ghi gì, nên vòng đó thiếu số đo mà không ai hay.
  Căn cứ: Hậu quả vừa phải: chỉ làm mất một dòng số đo của một vòng ở kho đặt trong thư mục liên kết, không mất dữ liệu có sẵn, và gọi lại bằng đường dẫn thật là ghi được.
  file: `scripts/do-vong.mjs`
  severity: medium
  Đề xuất: known-limits

- **Mốc chỉ còn hàng cắt bản in «~0 % hạn mức tuần» thay vì «chưa ước» (r1)**
  Người dùng thấy gì: Mốc phát hành mà các vòng đã giao hết, chỉ còn bước cắt bản, hiện «~0 % hạn mức tuần» trong khi thật ra chưa ước được, dễ làm người đọc tưởng khối lượng còn lại bằng không.
  Căn cứ: Chỉ là một con số hiển thị sai ở ca mốc gần xong, không mất dữ liệu, giờ máy của mốc vẫn đúng và người đọc đối chiếu được.
  file: `scripts/gio-may.mjs`
  severity: medium
  Đề xuất: known-limits

- **--do-lech bỏ qua tệp lộ trình không đọc được, vẫn thoát 0 và báo «chưa có mốc nào khép» (r1)**
  Người dùng thấy gì: Khi tệp lộ trình bị hỏng, lệnh đo độ lệch vẫn báo «chưa có mốc nào khép» như thể không có gì để đo, che mất việc chưa đọc được dữ liệu.
  Căn cứ: Chỉ xảy ra khi tệp lộ trình đã hỏng, và các lệnh anh em đã báo lỗi rõ ràng nên người dùng sẽ thấy ở chỗ khác; sửa tệp rồi chạy lại là đo được.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Dự báo đóng băng tìm theo tên + ngày mục tiêu: đổi ngày mốc là mất dự báo, mất cờ quá tải và mất phép đo lệch (r1)**
  Người dùng thấy gì: Nếu chủ kho dời ngày mục tiêu của một mốc sau khi đã mở việc, dự báo lúc bắt đầu biến mất, cờ mốc quá tải không bật và phép đo lệch báo chưa đóng băng, dù hồ sơ vẫn còn dự báo.
  Căn cứ: Không mất dữ liệu gốc vì tệp dự báo vẫn nằm trong hồ sơ, nhưng cờ quá tải tắt đúng lúc mốc bị dời có thể đang cần cảnh báo; để nguyên thì người dùng chỉ cần tránh dời ngày mốc đã mở.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: dòng gio-may và du-bao.json không có round-trip từ bên viết sang bên đọc (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phần ghi số đo và phần đọc số đo hiện chỉ khớp nhau qua dữ liệu viết tay, nên nếu sau này một bên đổi tên trường mà bên kia không đổi theo thì bộ kiểm vẫn xanh trong khi trang lộ trình hiện sai.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì hai bên đang khớp; rủi ro chỉ xuất hiện khi có người sửa sau này, và bắt được ở lần đối chiếu số đo thật đầu tiên.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 — GM-9 đọc GUIDE.md từ KIT thay vì từ cây đang kiểm `kit` (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một lỗi cố ý tiêm vào tài liệu hướng dẫn trong bản sao thử sẽ không làm ca kiểm đó đỏ, nhưng tài liệu thật của người dùng vẫn được kiểm đúng.
  Căn cứ: Người dùng không gặp gì vì chỉ ảnh hưởng độ nhạy của một ca kiểm tài liệu, tài liệu thật vẫn được đối chiếu; sửa tốn công hơn nhiều so với hậu quả.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
