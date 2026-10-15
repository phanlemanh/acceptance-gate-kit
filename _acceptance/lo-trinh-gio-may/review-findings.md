# Review findings — lo-trinh-gio-may (round 1)

## Trong hợp đồng

- **Khối S4-DO-VONG gọi "$AG/scripts/do-vong.mjs" mà không giải $AG; mọi khối khác trong SKILL đều tự giải ngay trong dòng**
  AC: AC-9
  file: `feature-loop/skills/feature-loop/SKILL.md:411`
  severity: medium
  source: conventions
  detail: Cả 9 lệnh khác của gói acceptance-gate trong SKILL feature-loop đều theo một mẫu: `AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/<tệp>) && node "$AG/scripts/<tệp>"`. Mẫu này giải đường dẫn ngay trong dòng, và `--require` làm resolver bỏ qua bản cài cũ chưa có script (lớp lỗi lệch phiên bản ghi ở đầu resolve-plugin.mjs). Khối mới S4-DO-VONG (dòng 411-419) chỉ ghi `node "$AG/scripts/do-vong.mjs" ...` kèm câu «$AG giải như mọi lệnh». Biến môi trường không được giữ giữa các lần gọi Bash. Dòng một lại chạy riêng ở S0 (bước 3, dòng 194), lúc chưa có lệnh nào đặt AG. Hệ quả ở kho tiêu thụ: $AG rỗng, lệnh thành `node "/scripts/do-vong.mjs"` và báo MODULE_NOT_FOUND. Lỗi này bị SKILL hạ thành «WARN một dòng, không chặn vòng», nên vòng vẫn chạy nhưng không có dòng `gio-may` nào được ghi. Bản cài acceptance-gate cũ chưa có do-vong.mjs cũng không bị resolver loại, vì khối thiếu `--require scripts/do-vong.mjs`. Ca GM-9 che mất lỗi: nó thay `$AG` bằng đường dẫn kit trước khi chạy (tests/scripts/lo-trinh-gio-may.test.mjs:482). Thước tự cấp đúng thứ mà phiên thật không có, tức hình dạng (3) của luật «Thước phải gắn vào vật được giao».
  rationale: AC-9 đòi dòng lệnh rút nguyên từ khối S4-DO-VONG chạy ra đúng dòng gio-may; khối không tự giải đường dẫn thì ở kho tiêu thụ lệnh rút từ khối không chạy, và ca đo tự thay đường dẫn nên che mất.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **do-vong.mjs dùng isMain so bằng path.resolve thay vì realpath; gọi qua symlink thì thoát 0 mà không làm gì**
  Người dùng thấy gì: Nếu kho nằm dưới một thư mục liên kết, bước đo giờ máy của vòng báo xong êm ru nhưng không ghi gì, nên vòng đó thiếu số đo mà không ai hay.
  Căn cứ: Hậu quả vừa phải: chỉ làm mất một dòng số đo của một vòng ở kho đặt trong thư mục liên kết, không mất dữ liệu có sẵn, và gọi lại bằng đường dẫn thật là ghi được.
  file: `scripts/do-vong.mjs`
  severity: medium
  Đề xuất: known-limits

- **Mốc chỉ còn hàng cắt bản in «~0 % hạn mức tuần» thay vì «chưa ước»**
  Người dùng thấy gì: Mốc phát hành mà các vòng đã giao hết, chỉ còn bước cắt bản, hiện «~0 % hạn mức tuần» trong khi thật ra chưa ước được, dễ làm người đọc tưởng khối lượng còn lại bằng không.
  Căn cứ: Chỉ là một con số hiển thị sai ở ca mốc gần xong, không mất dữ liệu, giờ máy của mốc vẫn đúng và người đọc đối chiếu được.
  file: `scripts/gio-may.mjs`
  severity: medium
  Đề xuất: known-limits

- **--do-lech bỏ qua tệp lộ trình không đọc được, vẫn thoát 0 và báo «chưa có mốc nào khép»**
  Người dùng thấy gì: Khi tệp lộ trình bị hỏng, lệnh đo độ lệch vẫn báo «chưa có mốc nào khép» như thể không có gì để đo, che mất việc chưa đọc được dữ liệu.
  Căn cứ: Chỉ xảy ra khi tệp lộ trình đã hỏng, và các lệnh anh em đã báo lỗi rõ ràng nên người dùng sẽ thấy ở chỗ khác; sửa tệp rồi chạy lại là đo được.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Dự báo đóng băng tìm theo tên + ngày mục tiêu: đổi ngày mốc là mất dự báo, mất cờ quá tải và mất phép đo lệch**
  Người dùng thấy gì: Nếu chủ kho dời ngày mục tiêu của một mốc sau khi đã mở việc, dự báo lúc bắt đầu biến mất, cờ mốc quá tải không bật và phép đo lệch báo chưa đóng băng, dù hồ sơ vẫn còn dự báo.
  Căn cứ: Không mất dữ liệu gốc vì tệp dự báo vẫn nằm trong hồ sơ, nhưng cờ quá tải tắt đúng lúc mốc bị dời có thể đang cần cảnh báo; để nguyên thì người dùng chỉ cần tránh dời ngày mốc đã mở.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: dòng gio-may và du-bao.json không có round-trip từ bên viết sang bên đọc**
  Người dùng thấy gì: Phần ghi số đo và phần đọc số đo hiện chỉ khớp nhau qua dữ liệu viết tay, nên nếu sau này một bên đổi tên trường mà bên kia không đổi theo thì bộ kiểm vẫn xanh trong khi trang lộ trình hiện sai.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì hai bên đang khớp; rủi ro chỉ xuất hiện khi có người sửa sau này, và bắt được ở lần đối chiếu số đo thật đầu tiên.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 — GM-9 đọc GUIDE.md từ KIT thay vì từ cây đang kiểm `kit`**
  Người dùng thấy gì: Một lỗi cố ý tiêm vào tài liệu hướng dẫn trong bản sao thử sẽ không làm ca kiểm đó đỏ, nhưng tài liệu thật của người dùng vẫn được kiểm đúng.
  Căn cứ: Người dùng không gặp gì vì chỉ ảnh hưởng độ nhạy của một ca kiểm tài liệu, tài liệu thật vẫn được đối chiếu; sửa tốn công hơn nhiều so với hậu quả.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
