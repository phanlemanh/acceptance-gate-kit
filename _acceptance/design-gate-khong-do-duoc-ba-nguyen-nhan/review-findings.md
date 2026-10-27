# Review findings: design-gate-khong-do-duoc-ba-nguyen-nhan

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Phép so ba kho vẫn xanh khi cổng không chạy được ở cả hai bản: không có đối chứng dương**
  Người dùng thấy gì: Phép so sánh trước/sau trên ba kho có thể báo «không có gì đổi» ngay cả khi cổng thiết kế chưa hề đo được trang nào, nên con số «đổi 0» có thể là yên tâm giả. Người dùng chỉ gặp điều này nếu chạy phép so sánh trên máy chưa cài đủ thư viện đo.
  Căn cứ: Chỉ ảnh hưởng độ tin của một con số kiểm tra nội bộ, không làm hỏng trang hay mất dữ liệu của người dùng, và chạy lại sau khi cài đủ thư viện là thấy đúng kết quả.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Lời mong đợi trong evals.yaml nói «merge-base» trong khi phép đo ghim cứng một mã commit gốc**
  Người dùng thấy gì: Một dòng mô tả trong bộ kiểm tra nói bản gốc là điểm gặp nhau với nhánh chính, trong khi thực tế dùng một mốc cố định. Người dùng sản phẩm không thấy gì, chỉ người đọc hồ sơ có thể hiểu nhầm.
  Căn cứ: Sai lệch chỉ nằm ở chữ trong tài liệu nội bộ, không đổi kết quả chấm nào và không ảnh hưởng người dùng cuối.
  file: `_acceptance/design-gate-khong-do-duoc-ba-nguyen-nhan/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Chú thích «chỉ khi Hỏi-1 được duyệt» đã cũ, Hỏi-1 đã được duyệt**
  Người dùng thấy gì: Một ghi chú trong cấu hình vẫn viết như thể việc thêm bước kiểm tra tự động chưa được quyết, dù đã quyết rồi. Người dùng sản phẩm không bị ảnh hưởng, chỉ có thể làm người đọc cấu hình bối rối.
  Căn cứ: Chỉ là lời ghi chú cũ, không đổi hành vi nào và không ảnh hưởng người dùng; sửa lúc nào cũng được.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: wont-fix

- **A white background written as hsl(var(--x)), the shadcn / Tailwind v3 pattern, is wrongly flagged as an ignored ancestor background; real contrast failures now exit 0**
  Người dùng thấy gì: Trên các trang dùng giao diện sáng mặc định của shadcn/Tailwind v3 (nền trắng khai bằng hsl), chữ nhạt khó đọc không còn bị chặn mà chỉ được báo «không đo được», nên lỗi tương phản thật có thể lọt qua khi không bật chế độ chặt. Người dùng cuối có thể nhận trang chữ khó đọc.
  Căn cứ: Nhiều trang thật dùng đúng kiểu khai màu này nên lỗi dễ gặp và làm mất tác dụng chặn của cổng, nhưng chỉ ở chế độ mặc định và bật chế độ chặt là thấy lại, nên đáng làm thành một việc riêng chứ không chữa vội trong vòng này.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: new-contract

- **A white shorthand background with a texture or image layer (`var(--paper) url(...)`, `background-image:url(...)`) is treated as unmeasurable and real failures pass**
  Người dùng thấy gì: Trang nền sáng có lớp hạt giấy hoặc ảnh nền, chữ nhạt khó đọc sẽ không còn bị chặn mà chỉ được báo «không đo được», nên lỗi tương phản thật có thể lọt qua ở chế độ mặc định. Người dùng cuối có thể gặp chữ khó đọc trên các trang kiểu này.
  Căn cứ: Kiểu nền có hạt giấy hoặc ảnh khá phổ biến và làm cổng bớt chặn lỗi thật, nhưng không mất dữ liệu và bật chế độ chặt là thấy lại, nên nên mở một việc riêng thay vì nhét thêm vào vòng này.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: new-contract

- **vi-phan-kho reports 'đổi 0' and exits 0 when neither gate version actually measured anything (jsdom missing, crash, timeout)**
  Người dùng thấy gì: Phép so sánh trước/sau có thể in «đổi 0» và báo thành công dù cả hai phiên bản đều không chạy được (thiếu thư viện đo, treo, hết giờ). Người ký có thể tin nhầm rằng không kho nào bị ảnh hưởng.
  Căn cứ: Chỉ làm sai một con số kiểm tra nội bộ chứ không ảnh hưởng trang của người dùng, và người chạy tự gỡ được bằng cách cài đủ thư viện rồi chạy lại.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình: vi phân ba kho ra «đổi 0» và thoát 0 khi cổng chưa từng chạy (BLOCKED/LOI hai bên coi là bằng nhau)**
  Người dùng thấy gì: Khi cổng thiết kế chưa chạy được ở cả hai phiên bản, phép so sánh vẫn báo xanh «không đổi phán quyết nào», nên lời khai về ba kho có thể chưa được đo thật. Người ký có thể yên tâm giả về mức ảnh hưởng lên các kho.
  Căn cứ: Hậu quả chỉ là một lời khai kiểm tra có thể sai khi thiếu thư viện đo, không chạm vào sản phẩm của người dùng, và chạy lại trên máy đủ thư viện là rõ.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/design-gate-khong-do-duoc-ba-nguyen-nhan/evals.yaml, _acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
