# Review findings: kho-cam-ket-co-lo-trinh (round 1)

## Trong hợp đồng

- **Repos that never enabled the rule now get a VIOLATION, and blocked contract writes, when .claude/settings.json is not strict JSON**
  file: `lib/chan-lo-trinh.cjs:87`
  severity: medium
  AC: AC-6
  source: conventions
  detail: trangThaiChan calls docBat first, and docBat throws `{ma:3}` when .claude/settings.json does not parse. The error is returned as `{loi}` before the code checks whether road-map is enabled or whether `lo_trinh.chan` exists at all. As a result, (1) the CLI prints `VIOLATION [config]: .claude/settings.json không phải JSON` and exits 1. Reproduced on a repo whose config.yaml has only `schema_version: 1` and whose settings.json has a trailing comma. Pre-merge-check.sh adds that to `violations`, so the merge is blocked. (2) The hook (acceptance-evidence-gate.js, luatChanLoTrinh) blocks every Write that opens a new contract.md or opportunity.md, with the misleading message «kho bật gói road-map: ...». Both the lib header and the pre-merge comment promise the opposite: «Kho không bật → không in gì, đầu ra lưới giữ từng byte». It also breaks the 26/09 rule that a fix for one repo must be weighed against every repo, because a repo with no roadmap now fails on a rule it never turned on. Suggested fix: treat unreadable settings as «không bật», or only raise the error once the `lo_trinh.chan` key is present.
  rationale: AC-6 hứa với mọi kho không bật thì hook và bước kiểm giữ nguyên từng byte như bản gốc; kho chưa bật mà cấu hình hỏng lại bị chặn và báo vi phạm.

- **Kho KHÔNG dùng road-map mà .claude/settings.json hỏng thì mọi lệnh mở hồ sơ mới bị chặn, kèm thông điệp sai chỗ**
  file: `lib/chan-lo-trinh.cjs:84`
  severity: medium
  AC: AC-6
  source: bugs
  detail: trangThaiChan gọi docBat trước mọi kiểm tra khác. docBat ném lỗi khi .claude/settings.json không phải JSON, nên trangThaiChan trả {loi}. Hook (luatChanLoTrinh) nhận `tt.loi` liền trả dòng chặn, rồi chặn (exit 2) lệnh Write vào contract.md/opportunity.md của mọi hồ sơ mới. Chuyện này xảy ra cả ở kho không bật road-map và không khai lo_trinh, trái với lời khai «Kho không bật: không in gì, đi như cũ» và «Gói không bật → khoá không được đọc». Tôi đã chạy thử: kho chỉ có `schema_version: 1` và settings.json có dấu phẩy thừa → hook in 'x kho bật gói road-map: .claude/settings.json không phải JSON — sửa khoá trong _acceptance/config.yaml', rc=2. Thông điệp còn chỉ người dùng sửa config.yaml, trong khi lỗi nằm ở settings.json. Ở lưới trước-merge (CLI), cùng đường này in 'VIOLATION [config]' rồi thoát 1 với kho có bản chép lib. Ma trận CK-4 chỉ thử settings hợp lệ nên không bắt được.
  rationale: Cùng gốc với t2: kho không bật mà cấu hình hỏng thì hook không còn giống bản gốc, trái lời hứa của AC-6 cho mọi kho không bật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Pre-merge roadmap check silently misses new records when the acceptance root is a subdirectory of the git repo**
  Người dùng thấy gì: Nếu hồ sơ nghiệm thu của một kho nằm trong thư mục con của kho git, bước kiểm trước khi gộp sẽ không thấy hồ sơ mới nào và cho qua im lặng, dù kho đã bật chặn theo lộ trình.
  Căn cứ: Chỉ ảnh hưởng kho đặt hồ sơ trong thư mục con và đã bật chặn; hậu quả là hồ sơ ngoài lộ trình lọt qua mà không báo, nhưng vẫn còn lớp chặn lúc ghi tệp và sửa sau không đắt.
  file: `lib/chan-lo-trinh.cjs`
  severity: medium
  Đề xuất: known-limits

- **New records are judged by comparing against the base tip, not the merge-base the rest of the pre-merge gate uses**
  Người dùng thấy gì: Nếu một hồ sơ cũ bị xoá hoặc đổi tên ở nhánh chính sau khi nhánh việc được tách ra, nhánh việc có thể bị báo vi phạm cho hồ sơ mà nó chưa từng đụng tới.
  Căn cứ: Chỉ xảy ra khi nhánh chính xoá hoặc đổi tên hồ sơ trong lúc nhánh việc đang mở; người dùng thấy một báo lỗi sai nhưng gộp lại nhánh chính hoặc xử lý tay là qua, nên nhẹ.
  file: `lib/chan-lo-trinh.cjs`
  severity: low
  Đề xuất: known-limits

- **Fallback NOTE NOT ENFORCED prints in repos that turned the rule off (chan: false)**
  Người dùng thấy gì: Kho đã chủ động tắt chặn lộ trình nhưng chưa chép lớp CI mới vẫn thấy một dòng ghi chú nói luật chặn chưa được thi hành, dù họ không muốn bật.
  Căn cứ: Chỉ là một dòng ghi chú gây hiểu nhầm, không chặn gộp và không mất dữ liệu; hết khi kho chép lại lớp CI.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Lưới trước-merge không thấy hồ sơ mới nào (lọt im lặng) khi gốc kho là thư mục con của repo git; gốc đi qua symlink thì báo vi phạm sai**
  Người dùng thấy gì: Với kho có hồ sơ trong thư mục con, bước kiểm trước khi gộp cho qua im lặng hồ sơ ngoài lộ trình; với đường dẫn đi qua liên kết, nó có thể báo vi phạm sai và chặn gộp oan.
  Căn cứ: Hiếm gặp, chỉ với cách đặt kho đặc biệt; báo oan thì người dùng thấy ngay và tự đổi đường dẫn, còn lọt im lặng là phần nặng hơn nhưng vẫn bị lớp chặn lúc ghi tệp bắt phần lớn.
  file: `lib/chan-lo-trinh.cjs`
  severity: medium
  Đề xuất: known-limits

- **Bảng mã thoát của S0-THEM-HANG coi lỗi resolve-plugin (thoát 1) là «kho không bật chặn» và đi tiếp im lặng**
  Người dùng thấy gì: Ở kho đã bật chặn nhưng cài gói cũ thiếu bộ đọc mới, khi mở vòng từ mô tả hàng lộ trình không được thêm và phiên không báo gì, người dùng chỉ thấy bước sau bị chặn.
  Căn cứ: Chỉ xảy ra khi bản cài lệch phiên bản; người dùng tự gỡ được bằng cách cập nhật gói hoặc thêm hàng tay, và sau đó lớp chặn vẫn nói rõ cần làm gì.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Bộ đọc chặn không bỏ BOM như bộ đọc lộ trình nên chặn sai hồ sơ đã nối**
  Người dùng thấy gì: Nếu tệp lộ trình do trình soạn thảo lưu kèm ký tự ẩn đầu tệp, bản đồ lộ trình vẫn đọc bình thường nhưng bước chặn lại coi hồ sơ là chưa thuộc hàng nào và chặn mở.
  Căn cứ: Hiếm gặp và người dùng tự gỡ được bằng cách lưu lại tệp không có ký tự ẩn; thông điệp chặn nêu lỗi đọc tệp nên dễ lần ra.
  file: `lib/chan-lo-trinh.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert «chuỗi có mặt» thay vì quan hệ): CK-9 kiểm README/GUIDE trên TOÀN tệp, nên vài chuỗi đã có sẵn từ trước vòng này**
  Người dùng thấy gì: Bộ kiểm không đủ chặt: nếu sau này ai đó xoá câu hướng dẫn cách tắt hoặc câu về giới hạn trong tài liệu, bộ kiểm vẫn xanh, người dùng có thể đọc tài liệu thiếu mà không ai hay.
  Căn cứ: Không ảnh hưởng hành vi sản phẩm hôm nay, chỉ làm tài liệu có thể thiếu ý về sau mà không báo; sửa sau rẻ và luật chiều rộng cấm mở thêm vòng đo thước.
  file: `tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA): phép kiểm «khuôn config không có khoá chan» đọc một khối yaml không bao giờ chứa khối lo_trinh, nên luôn xanh**
  Người dùng thấy gì: Bộ kiểm không chặn được việc sau này bước khởi tạo kho tự ghi sẵn bật chặn cho mọi kho mới, nên một kho có thể bị bật chặn mà chủ kho không chọn.
  Căn cứ: Hôm nay khuôn không ghi khoá bật nên người dùng chưa bị ảnh hưởng; rủi ro chỉ xuất hiện khi có thay đổi sau, và sửa phép đo lúc đó không đắt.
  file: `tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (đường dẫn cố định thay vì cây đang kiểm): CK-7 rút khối S0-MO-O từ KIT chứ không từ `kit` được truyền vào**
  Người dùng thấy gì: Một bước của bộ kiểm chạy trên bản gốc thay vì bản đã bị tiêm lỗi, nên về lý thuyết có thể bỏ sót lỗi ở bước đó; sản phẩm người dùng nhận không đổi.
  Căn cứ: Không ảnh hưởng người dùng; bước đỏ trước đó đã bắt lỗi nên phán quyết hiện đúng, chi phí sửa vượt lợi ích.
  file: `tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
