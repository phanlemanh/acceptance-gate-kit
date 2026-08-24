## Trong hợp đồng

- **parseStatesMap là parser evals.yaml thứ ba, mù block-scalar — tái mở đúng lớp lỗi mà lib/eval-yaml.js được lập ra để đóng**
  file: `scripts/eval-coverage-lint.js:197`
  severity: medium
  AC: AC-7
  lib/eval-yaml.js ghi rõ invariant: «dòng THÂN block không bao giờ được quét key… sửa một chỗ tại đây, không mọc bản thứ ba». parseStatesMap (dòng 197) quét raw lines cho `- id:` (dòng 204) và `states:` (dòng 206) mà không hiểu block scalar (`expected: >` / `|`). Đã xác nhận bằng PoC trên fixture rút từ chính ux-spec-template.md: một dòng `states: [ST-ghost]` nằm TRONG thân `expected: >` bị đọc thành khai báo của eval → cờ W8c oan «đo trạng thái ST-ghost không có trong bảng khai trước» trên hồ sơ lành (exit 1). Regex `- id:` cùng hàm cũng chiếm được `cur` từ thân block → gán states sai eval. Evals.yaml thật của chính hồ sơ này đã phải né bằng cách viết «states [ST-a, ST-ma]» không dấu hai chấm trong expected — bằng chứng lớp lỗi nằm sát vật thật. Lint là advisory nên không chặn merge, nhưng cờ oan đổ thẳng lên thẻ Cổng 1 (mặt quyết định của người). Hướng tự nhiên: dạy parseStatesMap nuốt thân block (mirror BLOCK_RE của lib/eval-yaml.js) hoặc mở rộng lib dùng chung, kèm case tiêm `states:` vào thân expected. (PoC cho thấy fixture "bản lành" — không eval nào thật khai states ngoài bảng — vẫn bị W8c bắn cờ oan do đọc nhầm text trong block scalar, vi phạm đúng điều khoản "bản lành XANH trước" của AC-7.)

- **parseStatesMap doc line-scan không block-scalar aware — states: trong thân expected bị đọc thành khai báo của eval**
  file: `scripts/eval-coverage-lint.js:206`
  severity: medium
  AC: AC-7
  parseStatesMap quét từng dòng thô của evals.yaml bằng /^\s*states:/ nên một dòng 'states: …' nằm TRONG block scalar `expected: |`/`>` cũng bị nhận là khai báo states của eval. Đã chứng minh bằng fixture rút từ ux-spec-template.md: expected chứa dòng 'states: done' → lint bắn cờ giả 'W8c eval E1 đo trạng thái done không có trong bảng khai trước' (exit 1). Chiều ngược nguy hiểm hơn (false green im lặng): token rác từ thân expected được cộng vào tập `measured`, nên một ST khai trong bảng mà không eval nào đo có thể bị coi là 'đã đo' chỉ vì prose nhắc tới nó trong một dòng dạng states: — W8b bị nuốt. Cùng lỗi lớp: dòng '- id: …' trong thân block scalar cũng reset `cur`, gán nhầm id cho states phía sau. Đây đúng là lớp lỗi header file này ghi là đã sửa bằng lib/eval-yaml.js (block-scalar aware, 'body lines are never key-scanned') — và chính diff này đã thêm 'states' vào parseEvals(evalYaml) nhưng w8() lại không dùng kết quả đó mà quét text thô. (Cùng lớp lỗi với finding block-scalar ở trên, PoC minh hoạ trực tiếp bản lành bị đỏ oan trên W8c — thất bại đúng điều khoản "bản lành XANH trước" của AC-7.)

- **states: flow-list có comment đuôi sinh tên trạng thái rác — W8c giả + W8b giả trên trạng thái thật**
  file: `scripts/eval-coverage-lint.js:228`
  severity: medium
  AC: AC-6
  Nhánh flow-list một dòng của parseStatesMap chỉ strip '[' đầu và ']' cuối, không đi qua fieldVal() nên không cắt '# comment' đuôi dòng. Đã chứng minh: `states: [ST-man-empty, ST-man-loading]  # ghi chu` → phần tử cuối thành chuỗi rác 'ST-man-loading]  # ghi chu', lint bắn ĐỒNG THỜI cờ giả W8c (đo trạng thái rác không có trong bảng) và cờ giả W8b (ST-man-loading khai trước nhưng 'không eval nào đo' — vì tên thật không còn khớp). Mọi field khác trong chính file này đều qua fieldVal() với lý do được ghi rõ 'Comments are never evidence'; parseStatesMap bỏ qua nếp đó. Nhánh flow-list gãy dòng (buf) cùng hình dạng: '\].*$' chỉ cắt được khi ] là ký tự áp cuối. (Trạng thái đã thật sự được khai và có eval đo — đúng bản lành "mọi ST có eval" của AC-6 — nhưng vẫn bị W8b báo sai "không eval nào đo" vì comment cuối dòng làm lệch tên, vi phạm đúng điều khoản "bản lành XANH trước" của AC-6.)

- **Hình dạng 4 (ghim thông điệp chết): pin "UX-STATE-TABLE" của UX1-đỏ được thoả bởi dòng LEGEND in trên MỌI lần đỏ, không phải bởi cờ W8a**
  file: `tests/plugins/ux-spec.test.mjs:73`
  severity: medium
  AC: AC-11
  Assert `oMut.status === 1 && oMut.stdout.includes('UX-STATE-TABLE')` tự nhận là "ghim W8a" (comment dòng 74), nhưng eval-coverage-lint.js in dòng chú giải cuối (`W8 = bảng trạng thái khai trước (UX-STATE-TABLE trong design_doc:)…`) trên MỌI lần chạy có bất kỳ warning nào — đã kiểm chứng bằng fixture không dính W8 (chỉ W1/W3): stdout vẫn chứa 'UX-STATE-TABLE'. Nên phần ghim-thông-điệp của assert này thoả vô điều kiện khi exit=1: nó thoái hoá thành assert exit-code trần, không phân biệt được "W8a marker bật" với "một warning bất kỳ khác bật". Cùng lớp (yếu hơn): tests/scripts/run-tests.sh [W8A]-1 dùng pattern `*"W8a"*"design_doc"*` — mảnh "design_doc" cũng nằm trong legend, chỉ mảnh "W8a" là thật. Đối chiếu: UX2-đỏ và [W8B]/[W8C] ghim nguyên câu warning (đúng nếp) — riêng chỗ này thì không. (AC-11 đòi mọi cánh W8 phải có "thông điệp ghim" thật sự, không phải assertion âm-tính-một-mình; test UX1-đỏ chỉ trùng khớp dòng legend in trên mọi lần đỏ nên không thực sự ghim thông điệp W8a — đúng hình dạng AC-11 cấm.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **parseEvals thu field 'states' nhưng không nơi nào đọc — bộ đọc thứ hai chết cho cùng một seam, ngược khuôn «MỘT bộ đọc mỗi phía» của chính commit**
  Người dùng thấy gì: Có một mẩu dữ liệu nội bộ được thu thập nhưng chưa từng dùng tới; hiện không gây sai lệch gì cho cờ cảnh báo mà người dùng nhìn thấy, chỉ là phần thừa dễ gây nhầm lẫn khi có người sửa lại sau này.
  file: `scripts/eval-coverage-lint.js`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA): UX4 đo chuỗi cửa miễn "bỏ đặc-tả-UX — " giữa hai file chỉ-dẫn, trong khi KHÔNG có code path nào đọc chuỗi đó**
  Người dùng thấy gì: Cửa miễn cho các tính năng không chạm giao diện hiện chỉ được kiểm bằng cách so khớp câu chữ giữa hai tài liệu hướng dẫn, không có bước máy chạy thật theo dõi việc bỏ qua đó — đây là giới hạn đã được owner chấp nhận ngay từ đầu, không phải lỗi mới phát sinh.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): E13 tuyên bộ đọc states "hiểu MỌI hình dạng" nhưng suite chỉ có 3 điểm-case, các nhánh lỗi của parseStatesMap không có ca nào**
  Người dùng thấy gì: Một vài cách viết danh sách trạng thái khác thường (ví dụ để trống, hoặc thiếu dấu ngoặc) chưa được thử qua, nên nếu ai đó viết theo kiểu lạ, hệ thống có thể im lặng bỏ qua thay vì nhắc nhở.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
