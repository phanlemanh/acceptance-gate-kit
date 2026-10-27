# Review findings: design-gate-khong-do-duoc-ba-nguyen-nhan (round 2)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Nền thân trang chỉ có gradient (không có lớp màu) giờ bị đọc là «không có màu», nên cổng trả lại REJECT giả thay vì KHONG-DO-DUOC**
  Người dùng thấy gì: Trang có nền tối chỉ vẽ bằng gradient (không kèm màu nền dự phòng) có thể bị cổng chặn oan vì chữ sáng bị đo trên nền trắng, thay vì báo «không đo được». Người làm trang sẽ thấy một lỗi tương phản không có thật.
  Căn cứ: Hậu quả nhẹ đến vừa: chỉ gây chặn oan ở một kiểu nền hiếm (gradient thuần, không màu dự phòng), không mất dữ liệu, người dùng sửa được bằng cách thêm màu nền dự phòng hoặc chạy lại với cờ yêu cầu đo được; trước vòng này kiểu nền ấy cũng không được hứa.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: known-limits

- **declared() đọc cả luật trong @media/@supports không khớp → lỗi tương phản thật trên trang nền trắng bị hạ thành KHONG-DO-DUOC, thoát 0**
  Người dùng thấy gì: Trang sáng có thêm khối giao diện tối hoặc khối in ấn có thể khiến lỗi chữ nhạt trên nền trắng được báo «không đo được» và cho qua, thay vì chặn. Lỗi tương phản thật có thể lọt khi chạy không cờ nghiêm ngặt.
  Căn cứ: Hậu quả vừa: lỗi thật bị bỏ sót lặng lẽ trên kiểu trang rất phổ biến, nhưng kết cục là «không đo được» minh bạch (không phải PASS giả) và cờ yêu cầu đo được sẽ chặn lại; sửa sau là việc riêng, không làm hỏng gì đã giao.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: known-limits

- **hsla()/hsl() kiểu dấu phẩy bỏ mất alpha → lớp phủ đen gần trong suốt bị coi là nền tối đặc, hạ phát hiện thật**
  Người dùng thấy gì: Một lớp phủ đen gần như trong suốt viết kiểu cũ có thể bị coi là nền tối đặc, khiến lỗi chữ nhạt trên nền gần trắng được báo «không đo được» thay vì chặn. Lỗi thật có thể lọt khi không bật cờ nghiêm ngặt.
  Căn cứ: Hậu quả nhẹ đến vừa: chỉ ảnh hưởng cách viết màu cũ có độ trong suốt, kết cục vẫn minh bạch là «không đo được» chứ không phải PASS, và đề xuất nền bán trong suốt đã được ghi là việc để sau.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: known-limits

- **Nền khai inline bị luật trong stylesheet đè vì declared() nối inline TRƯỚC rồi lấy giá trị CUỐI**
  Người dùng thấy gì: Khi nền được khai cả trong thẻ lẫn trong bảng kiểu, cổng có thể lấy nhầm nền tối và báo «không đo được» cho một lỗi tương phản thật trên nền trắng. Lỗi thật có thể không bị chặn ở chế độ thường.
  Căn cứ: Hậu quả nhẹ: chỉ xảy ra với trang khai nền chồng chéo và dùng biến, kết cục là «không đo được» minh bạch, và kiểu trang này hiếm; sửa đúng độ ưu tiên CSS là việc đắt hơn lợi ích.
  file: `lib/design-detect.mjs`
  severity: medium
  Đề xuất: known-limits

- **vi-phan-kho thoát 0 («đổi 0») khi ba kho có 0 đích — cổng chưa chạy lần nào mà vẫn xanh**
  Người dùng thấy gì: Nếu cấu trúc ba kho đổi khiến không tìm thấy đích nào, bước so sánh vẫn báo xanh «đổi 0» dù chưa đo gì. Người đọc có thể tưởng cổng đã được kiểm lại trong khi thực ra chưa chạy lần nào.
  Căn cứ: Hậu quả nhẹ: chỉ là công cụ kiểm nội bộ của người bảo trì, không chạm người dùng cuối, và chỉ lộ ra khi cấu trúc các kho đổi; dễ nhận ra và sửa sau rẻ.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): ma trận nền tổ tiên không có ca cho màu bộ đọc không hiểu, nên một hồi quy về REJECT sai lọt qua mà bộ ca vẫn xanh**
  Người dùng thấy gì: Trang có nền tối viết bằng cú pháp màu mới và lạ có thể bị chặn oan vì chữ sáng bị đo trên nền trắng, và bộ kiểm hiện không có ca nào bắt được điều đó. Người làm trang sẽ thấy một lỗi tương phản không có thật.
  Căn cứ: Hậu quả nhẹ đến vừa: chỉ chặn oan ở vài cú pháp màu còn ít dùng, không mất dữ liệu, người dùng tránh được bằng cách viết màu dạng thông dụng; hợp đồng chỉ hứa các dạng đã liệt kê.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Phép so ba kho vẫn xanh khi cổng không chạy được ở cả hai bản: không có đối chứng dương (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép so sánh trước/sau trên ba kho có thể báo «không có gì đổi» ngay cả khi cổng thiết kế chưa hề đo được trang nào, nên con số «đổi 0» có thể là yên tâm giả. Người dùng chỉ gặp điều này nếu chạy phép so sánh trên máy chưa cài đủ thư viện đo.
  Căn cứ: Chỉ ảnh hưởng độ tin của một con số kiểm tra nội bộ, không làm hỏng trang hay mất dữ liệu của người dùng, và chạy lại sau khi cài đủ thư viện là thấy đúng kết quả.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lời mong đợi trong evals.yaml nói «merge-base» trong khi phép đo ghim cứng một mã commit gốc (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một dòng mô tả trong bộ kiểm tra nói bản gốc là điểm gặp nhau với nhánh chính, trong khi thực tế dùng một mốc cố định. Người dùng sản phẩm không thấy gì, chỉ người đọc hồ sơ có thể hiểu nhầm.
  Căn cứ: Sai lệch chỉ nằm ở chữ trong tài liệu nội bộ, không đổi kết quả chấm nào và không ảnh hưởng người dùng cuối.
  file: `_acceptance/design-gate-khong-do-duoc-ba-nguyen-nhan/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Chú thích «chỉ khi Hỏi-1 được duyệt» đã cũ, Hỏi-1 đã được duyệt (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một ghi chú trong cấu hình vẫn viết như thể việc thêm bước kiểm tra tự động chưa được quyết, dù đã quyết rồi. Người dùng sản phẩm không bị ảnh hưởng, chỉ có thể làm người đọc cấu hình bối rối.
  Căn cứ: Chỉ là lời ghi chú cũ, không đổi hành vi nào và không ảnh hưởng người dùng; sửa lúc nào cũng được.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: wont-fix

- **A white background written as hsl(var(--x)), the shadcn / Tailwind v3 pattern, is wrongly flagged as an ignored ancestor background; real contrast failures now exit 0 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trên các trang dùng giao diện sáng mặc định của shadcn/Tailwind v3 (nền trắng khai bằng hsl), chữ nhạt khó đọc không còn bị chặn mà chỉ được báo «không đo được», nên lỗi tương phản thật có thể lọt qua khi không bật chế độ chặt. Người dùng cuối có thể nhận trang chữ khó đọc.
  Căn cứ: Nhiều trang thật dùng đúng kiểu khai màu này nên lỗi dễ gặp và làm mất tác dụng chặn của cổng, nhưng chỉ ở chế độ mặc định và bật chế độ chặt là thấy lại, nên đáng làm thành một việc riêng chứ không chữa vội trong vòng này.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: new-contract

- **A white shorthand background with a texture or image layer (`var(--paper) url(...)`, `background-image:url(...)`) is treated as unmeasurable and real failures pass (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trang nền sáng có lớp hạt giấy hoặc ảnh nền, chữ nhạt khó đọc sẽ không còn bị chặn mà chỉ được báo «không đo được», nên lỗi tương phản thật có thể lọt qua ở chế độ mặc định. Người dùng cuối có thể gặp chữ khó đọc trên các trang kiểu này.
  Căn cứ: Kiểu nền có hạt giấy hoặc ảnh khá phổ biến và làm cổng bớt chặn lỗi thật, nhưng không mất dữ liệu và bật chế độ chặt là thấy lại, nên nên mở một việc riêng thay vì nhét thêm vào vòng này.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: new-contract

- **vi-phan-kho reports 'đổi 0' and exits 0 when neither gate version actually measured anything (jsdom missing, crash, timeout) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép so sánh trước/sau có thể in «đổi 0» và báo thành công dù cả hai phiên bản đều không chạy được (thiếu thư viện đo, treo, hết giờ). Người ký có thể tin nhầm rằng không kho nào bị ảnh hưởng.
  Căn cứ: Chỉ làm sai một con số kiểm tra nội bộ chứ không ảnh hưởng trang của người dùng, và người chạy tự gỡ được bằng cách cài đủ thư viện rồi chạy lại.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình: vi phân ba kho ra «đổi 0» và thoát 0 khi cổng chưa từng chạy (BLOCKED/LOI hai bên coi là bằng nhau) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi cổng thiết kế chưa chạy được ở cả hai phiên bản, phép so sánh vẫn báo xanh «không đổi phán quyết nào», nên lời khai về ba kho có thể chưa được đo thật. Người ký có thể yên tâm giả về mức ảnh hưởng lên các kho.
  Căn cứ: Hậu quả chỉ là một lời khai kiểm tra có thể sai khi thiếu thư viện đo, không chạm vào sản phẩm của người dùng, và chạy lại trên máy đủ thư viện là rõ.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
