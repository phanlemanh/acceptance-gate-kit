# Review findings: design-gate-khong-do-duoc-ba-nguyen-nhan — round 4

## Trong hợp đồng

Không có phát hiện nào trong hợp đồng ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lỗi «cần bản gốc» của KD10-mau-la không bao giờ chạy được, nhưng tiêu chí đo (evals.yaml) vẫn kể nó như một chiều đỏ**
  Người dùng thấy gì: Người dùng cổng thiết kế không bị ảnh hưởng: trang vẫn ra đúng phán quyết. Chỉ là bảng mô tả bộ kiểm kể một tình huống lỗi mà thực tế không bao giờ xảy ra, nên người đọc có thể tin bộ kiểm chặn được một lỗi nó không chặn.
  Căn cứ: Hậu quả nhẹ: không ảnh hưởng người dùng, không mất dữ liệu, chỉ là một dòng mô tả thừa, và dọn lại rẻ nhưng cũng không đáng mở thêm việc.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **E10 hứa một ca đỏ «cần bản gốc» mà không ca nào chạy tới được — nhánh chặn này là mã chết**
  Người dùng thấy gì: Người dùng cổng thiết kế không thấy khác biệt nào. Chỉ có một lời hứa trong mô tả bộ kiểm không có gì đứng sau, nên đọc vào dễ tưởng bộ kiểm chắc hơn thực tế.
  Căn cứ: Hậu quả nhẹ và không chạm sản phẩm; cùng một việc với mục trùng nó nên không cần mở việc riêng.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (âm tính một mình): KD10-mau-la có đối chứng dương không phân biệt được gì và không có chiều đỏ ở đâu cả**
  Người dùng thấy gì: Trang có nền khai bằng màu pha vẫn được cổng xử lý đúng như trước. Nhưng nếu sau này ai đó làm hỏng đúng phần xử lý màu pha này, bộ kiểm có thể vẫn báo xanh, nên chúng ta sẽ không biết sớm.
  Căn cứ: Hậu quả hiện tại bằng không với người dùng vì cổng đang đúng; rủi ro chỉ là lỗi tương lai bị bỏ lọt ở một dạng trang hiếm, và người dùng cổng thử lại được, nên ghi giới hạn là đủ.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: nhánh đỏ «cần bản gốc» của KD10-mau-la mà E10 khai là ca đỏ thì không bao giờ chạy tới**
  Người dùng thấy gì: Người dùng cổng thiết kế không bị ảnh hưởng. Mô tả bộ kiểm nói có một tình huống báo đỏ mà thực tế không thể xảy ra, chỉ gây hiểu nhầm cho người bảo trì.
  Căn cứ: Hậu quả nhẹ, chỉ là lời mô tả lệch; cùng gốc với hai mục trên nên một lần ghi vết là đủ.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Gradient text inside @supports or a responsive @media block is REJECTed again, a regression from round 2 into the same wrong-REJECT bug class AC-4 fixes (r3)**
  Người dùng thấy gì: Trang dùng chữ dải màu bọc trong khối điều kiện kiểu phổ biến (hỗ trợ tính năng hoặc theo khổ màn hình) lại bị cổng chặn oan là chữ quá nhạt, trong khi bản trước đó báo đúng là không đo được. Người làm trang phải gỡ một lỗi không có thật mới qua được cổng.
  Căn cứ: Hậu quả vừa phải: chặn oan một cách viết rất phổ biến nên người dùng bị kẹt cổng vô lý, nhưng họ thấy ngay lý do và có thể né bằng cách sửa trang; sửa trong mã tốn công vừa phải và cần ca kiểm riêng nên nên đăng thành việc riêng.
  file: `lib/design-detect.mjs`
  severity: medium
  Đề xuất: new-contract

- **KD10-mau-la silently compares against itself when the original build is absent: `c.goc || c.root` (r3 · tệp đã đổi)**
  Người dùng thấy gì: Khi chỉ chạy một phần bộ kiểm thử, một phép so với bản gốc có thể âm thầm so bản với chính nó nên luôn xanh. Người dùng sản phẩm không bị ảnh hưởng, chỉ là một phép kiểm trong lần chạy riêng đó rỗng.
  Căn cứ: Nhẹ: không đổi hành vi nào người dùng thấy, chỉ làm một phép kiểm phụ rỗng khi chạy lẻ; chạy trọn bộ vẫn kiểm đúng nên ghi lại là giới hạn đã biết là đủ.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **declared() comment claims to match jsdom, but jsdom applies different @media rules (r3)**
  Người dùng thấy gì: Lời giải thích trong mã nói sai về cách công cụ dựng trang áp luật, nên người đọc sau có thể sửa nhầm hướng. Người dùng cuối không thấy gì khác.
  Căn cứ: Rất nhẹ với người dùng vì không đổi kết quả nào họ thấy; rủi ro chỉ là người bảo trì hiểu nhầm, ghi vết là đủ và có thể chỉnh lời khi sửa nhánh liên quan.
  file: `lib/design-detect.mjs`
  severity: low
  Đề xuất: wont-fix

- **Nhánh nền và nhánh dải màu coi «jsdom không áp» là «trang không hiển thị»: khối @supports, @media all và @media (min-width…) quay lại REJECT sai (r3)**
  Người dùng thấy gì: Trang khai nền tối hoặc chữ dải màu bên trong khối điều kiện thông thường (mọi màn hình, từ một độ rộng trở lên, hoặc kiểm hỗ trợ tính năng) lại bị cổng chặn oan là chữ nhạt trên nền trắng. Bản trước báo đúng là không đo được.
  Căn cứ: Hậu quả vừa phải: chặn oan đúng lớp lỗi vòng này sinh ra để gỡ, nhưng người dùng thấy lý do và có thể né bằng cách sửa trang, không mất dữ liệu; cần một vòng riêng vì phải đổi cách đọc nền và có ca kiểm cả hai chiều.
  file: `lib/design-detect.mjs`
  severity: medium
  Đề xuất: new-contract

- **Dải màu ở thân/gốc trang có điểm màu bộ đọc không hiểu thì bị gọi là «nền bị bỏ»: tương phản thấp thật thành KHONG-DO-DUOC, thoát 0 (r3)**
  Người dùng thấy gì: Trang nền trắng dùng dải màu viết bằng cách ghi màu hiếm gặp, chữ nhạt thật, có thể được báo là không đo được và đi qua cổng như xanh khi không bật chế độ chặt. Một lỗi tương phản thật có thể lọt.
  Căn cứ: Nhẹ đến vừa: cần đúng cách viết màu hiếm, người dùng bật chế độ chặt vẫn bị chặn, và lỗi tương phản có thể thấy khi xem trang; ghi là giới hạn đã biết, sửa sau khi có kho gặp thật.
  file: `lib/design-detect.mjs`
  severity: low
  Đề xuất: known-limits

- **Ca KD10-mau-la âm thầm tự so với chính nó khi không dựng bản gốc (chạy riêng KD7) (r3 · tệp đã đổi)**
  Người dùng thấy gì: Khi chạy riêng một nhóm kiểm thử đột biến, một nửa phép kiểm của một ca trở nên rỗng mà vẫn báo đạt. Sản phẩm người dùng dùng không đổi.
  Căn cứ: Nhẹ: không đổi hành vi sản phẩm và kết quả nhóm đột biến hôm nay không đổi; ghi lại để người bảo trì biết nửa phép kiểm đó rỗng khi chạy lẻ.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): khi không có bản gốc, KD10-mau-la tự so bản đang đo với chính nó (r3 · tệp đã đổi)**
  Người dùng thấy gì: Khi chạy riêng nhóm đột biến, phép so với bản gốc của một ca rơi về so với chính nó và không báo gì. Người dùng sản phẩm không thấy khác biệt.
  Căn cứ: Nhẹ: chỉ làm một phép kiểm phụ rỗng khi chạy lẻ, không đổi kết quả sản phẩm; ghi là giới hạn đã biết, trùng hai phát hiện cùng gốc.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Nền thân trang chỉ có gradient (không có lớp màu) giờ bị đọc là «không có màu», nên cổng trả lại REJECT giả thay vì KHONG-DO-DUOC (r2)**
  Người dùng thấy gì: Trang có nền tối chỉ vẽ bằng gradient (không kèm màu nền dự phòng) có thể bị cổng chặn oan vì chữ sáng bị đo trên nền trắng, thay vì báo «không đo được». Người làm trang sẽ thấy một lỗi tương phản không có thật.
  Căn cứ: Hậu quả nhẹ đến vừa: chỉ gây chặn oan ở một kiểu nền hiếm (gradient thuần, không màu dự phòng), không mất dữ liệu, người dùng sửa được bằng cách thêm màu nền dự phòng hoặc chạy lại với cờ yêu cầu đo được; trước vòng này kiểu nền ấy cũng không được hứa.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: known-limits

- **declared() đọc cả luật trong @media/@supports không khớp → lỗi tương phản thật trên trang nền trắng bị hạ thành KHONG-DO-DUOC, thoát 0 (r2)**
  Người dùng thấy gì: Trang sáng có thêm khối giao diện tối hoặc khối in ấn có thể khiến lỗi chữ nhạt trên nền trắng được báo «không đo được» và cho qua, thay vì chặn. Lỗi tương phản thật có thể lọt khi chạy không cờ nghiêm ngặt.
  Căn cứ: Hậu quả vừa: lỗi thật bị bỏ sót lặng lẽ trên kiểu trang rất phổ biến, nhưng kết cục là «không đo được» minh bạch (không phải PASS giả) và cờ yêu cầu đo được sẽ chặn lại; sửa sau là việc riêng, không làm hỏng gì đã giao.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: known-limits

- **hsla()/hsl() kiểu dấu phẩy bỏ mất alpha → lớp phủ đen gần trong suốt bị coi là nền tối đặc, hạ phát hiện thật (r2)**
  Người dùng thấy gì: Một lớp phủ đen gần như trong suốt viết kiểu cũ có thể bị coi là nền tối đặc, khiến lỗi chữ nhạt trên nền gần trắng được báo «không đo được» thay vì chặn. Lỗi thật có thể lọt khi không bật cờ nghiêm ngặt.
  Căn cứ: Hậu quả nhẹ đến vừa: chỉ ảnh hưởng cách viết màu cũ có độ trong suốt, kết cục vẫn minh bạch là «không đo được» chứ không phải PASS, và đề xuất nền bán trong suốt đã được ghi là việc để sau.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: known-limits

- **Nền khai inline bị luật trong stylesheet đè vì declared() nối inline TRƯỚC rồi lấy giá trị CUỐI (r2)**
  Người dùng thấy gì: Khi nền được khai cả trong thẻ lẫn trong bảng kiểu, cổng có thể lấy nhầm nền tối và báo «không đo được» cho một lỗi tương phản thật trên nền trắng. Lỗi thật có thể không bị chặn ở chế độ thường.
  Căn cứ: Hậu quả nhẹ: chỉ xảy ra với trang khai nền chồng chéo và dùng biến, kết cục là «không đo được» minh bạch, và kiểu trang này hiếm; sửa đúng độ ưu tiên CSS là việc đắt hơn lợi ích.
  file: `lib/design-detect.mjs`
  severity: medium
  Đề xuất: known-limits

- **vi-phan-kho thoát 0 («đổi 0») khi ba kho có 0 đích — cổng chưa chạy lần nào mà vẫn xanh (r2)**
  Người dùng thấy gì: Nếu cấu trúc ba kho đổi khiến không tìm thấy đích nào, bước so sánh vẫn báo xanh «đổi 0» dù chưa đo gì. Người đọc có thể tưởng cổng đã được kiểm lại trong khi thực ra chưa chạy lần nào.
  Căn cứ: Hậu quả nhẹ: chỉ là công cụ kiểm nội bộ của người bảo trì, không chạm người dùng cuối, và chỉ lộ ra khi cấu trúc các kho đổi; dễ nhận ra và sửa sau rẻ.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): ma trận nền tổ tiên không có ca cho màu bộ đọc không hiểu, nên một hồi quy về REJECT sai lọt qua mà bộ ca vẫn xanh (r2 · tệp đã đổi)**
  Người dùng thấy gì: Trang có nền tối viết bằng cú pháp màu mới và lạ có thể bị chặn oan vì chữ sáng bị đo trên nền trắng, và bộ kiểm hiện không có ca nào bắt được điều đó. Người làm trang sẽ thấy một lỗi tương phản không có thật.
  Căn cứ: Hậu quả nhẹ đến vừa: chỉ chặn oan ở vài cú pháp màu còn ít dùng, không mất dữ liệu, người dùng tránh được bằng cách viết màu dạng thông dụng; hợp đồng chỉ hứa các dạng đã liệt kê.
  file: `tests/design-eval/khong-do-duoc.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Phép so ba kho vẫn xanh khi cổng không chạy được ở cả hai bản: không có đối chứng dương (r1)**
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

- **A white background written as hsl(var(--x)), the shadcn / Tailwind v3 pattern, is wrongly flagged as an ignored ancestor background; real contrast failures now exit 0 (r1)**
  Người dùng thấy gì: Trên các trang dùng giao diện sáng mặc định của shadcn/Tailwind v3 (nền trắng khai bằng hsl), chữ nhạt khó đọc không còn bị chặn mà chỉ được báo «không đo được», nên lỗi tương phản thật có thể lọt qua khi không bật chế độ chặt. Người dùng cuối có thể nhận trang chữ khó đọc.
  Căn cứ: Nhiều trang thật dùng đúng kiểu khai màu này nên lỗi dễ gặp và làm mất tác dụng chặn của cổng, nhưng chỉ ở chế độ mặc định và bật chế độ chặt là thấy lại, nên đáng làm thành một việc riêng chứ không chữa vội trong vòng này.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: new-contract

- **A white shorthand background with a texture or image layer (`var(--paper) url(...)`, `background-image:url(...)`) is treated as unmeasurable and real failures pass (r1)**
  Người dùng thấy gì: Trang nền sáng có lớp hạt giấy hoặc ảnh nền, chữ nhạt khó đọc sẽ không còn bị chặn mà chỉ được báo «không đo được», nên lỗi tương phản thật có thể lọt qua ở chế độ mặc định. Người dùng cuối có thể gặp chữ khó đọc trên các trang kiểu này.
  Căn cứ: Kiểu nền có hạt giấy hoặc ảnh khá phổ biến và làm cổng bớt chặn lỗi thật, nhưng không mất dữ liệu và bật chế độ chặt là thấy lại, nên nên mở một việc riêng thay vì nhét thêm vào vòng này.
  file: `lib/design-detect.mjs`
  severity: high
  Đề xuất: new-contract

- **vi-phan-kho reports 'đổi 0' and exits 0 when neither gate version actually measured anything (jsdom missing, crash, timeout) (r1)**
  Người dùng thấy gì: Phép so sánh trước/sau có thể in «đổi 0» và báo thành công dù cả hai phiên bản đều không chạy được (thiếu thư viện đo, treo, hết giờ). Người ký có thể tin nhầm rằng không kho nào bị ảnh hưởng.
  Căn cứ: Chỉ làm sai một con số kiểm tra nội bộ chứ không ảnh hưởng trang của người dùng, và người chạy tự gỡ được bằng cách cài đủ thư viện rồi chạy lại.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình: vi phân ba kho ra «đổi 0» và thoát 0 khi cổng chưa từng chạy (BLOCKED/LOI hai bên coi là bằng nhau) (r1)**
  Người dùng thấy gì: Khi cổng thiết kế chưa chạy được ở cả hai phiên bản, phép so sánh vẫn báo xanh «không đổi phán quyết nào», nên lời khai về ba kho có thể chưa được đo thật. Người ký có thể yên tâm giả về mức ảnh hưởng lên các kho.
  Căn cứ: Hậu quả chỉ là một lời khai kiểm tra có thể sai khi thiếu thư viện đo, không chạm vào sản phẩm của người dùng, và chạy lại trên máy đủ thư viện là rõ.
  file: `tests/design-eval/vi-phan-kho.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
