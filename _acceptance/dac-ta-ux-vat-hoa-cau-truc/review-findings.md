# Review Findings: dac-ta-ux-vat-hoa-cau-truc (round 4)

## Trong hợp đồng

### Assertion [W8A]-3 thoả bởi dòng LEGEND, không bởi cờ W8a — đúng lớp finding đã nêu ở round 3 nhưng chỉ vá case bị nêu tên, không quét theo LỚP
- file: `tests/scripts/run-tests.sh:1151`
- severity: medium
- source: conventions
- AC: AC-11

`case "$outA3" in *"W8a"*"UX-STATE-TABLE"*)` — mảnh `UX-STATE-TABLE` nằm trong dòng chú giải cuối mà `eval-coverage-lint.js:396` in ra trên MỌI lần chạy có bất kỳ warning nào (`… W8 = bảng trạng thái khai trước (UX-STATE-TABLE trong design_doc:) …`). Vì legend luôn in SAU các warning, vế thứ hai của pattern thoả vô điều kiện khi exit=1. Assert thoái hoá thành «có một cờ W8a bất kỳ», không phân biệt được «W8a thiếu bảng UX-STATE-TABLE (marker)» với «W8a design_doc không đọc được».

`_acceptance/dac-ta-ux-vat-hoa-cau-truc/review-findings.md` đã nêu chính xác lớp này (Hình dạng 4) và chỉ đích danh cả `[W8A]-1`; bản vá chỉ sửa `[W8A]-1` (nay ghim nguyên câu, dòng 1143) và `UX1-đỏ` trong `tests/plugins/ux-spec.test.mjs`, bỏ sót `[W8A]-3`. CLAUDE.md ghi rõ: «sửa phải theo LỚP: quét cả file tìm mọi case cùng hình dạng, đừng chỉ vá case bị nêu tên.»

Cùng hình dạng yếu hơn (chỉ `*W8a*` trần, không ghim câu): dòng 1173 `[W8O]-live`, 1182 `[W8G]-live`, 1225 `[W8F]-live`, 1237 `[W8N]-live`.

Sửa: ghim nguyên câu `"W8a design-doc"…"thiếu bảng UX-STATE-TABLE (marker)"` như [W8B]/[W8C] đang làm.

### W8's state table silently reads zero rows when the table is indented or the id cell is decorated
- file: `scripts/eval-coverage-lint.js:171`
- severity: high
- source: bugs
- AC: AC-9

`if (!/^\|\s*ST-/.test(line)) continue;` anchors at column 0, so any row that does not begin with a literal `|` immediately followed by `ST-` is dropped from `spec.states` — and dropped WITHOUT landing in `badLines`, so no parse flag fires either. The marker is still found, so `tableFound` is true and W8a stays silent too. Result: the whole two-way round-trip check evaporates with exit 0.

Reproduced against HEAD's version of the script: took the filled template, indented the two `| ST-… |` rows by two spaces (what a table nested in a list item looks like), and removed `states:` from every eval. Output: `eval-coverage-lint: no coverage gaps detected.` exit 0 — instead of the two W8b flags. Same silent pass with `| **ST-man-empty** | … |` (bolded id cell) while an eval declares `ST-man-empty`: the state vanishes from `declaredSet`, and in the mirror case it instead produces a false W8c "không có trong bảng khai trước".

This is exactly the class W7 exists to catch for AC lines ("a dropped line silently deletes its own coverage check"), but W8 has no blind-spot arm: nothing counts `ST-`-looking lines inside the marker that the row parser did not consume.

### [W8D] regression guard cannot fail — the decoy sits where neither implementation reads
- file: `tests/scripts/run-tests.sh:1239`
- severity: high
- source: bugs
- AC: AC-11

E12/AC-5 claims the case proves "bộ đọc chỉ ăn trong vùng marker, không ăn văn xuôi ngoài vùng" (the r2 lesson). The fixture prepends the decoy `Căn cứ: quyết định của owner 2026-08-01.` BEFORE the template zone. But `parseUxSpec` scans FORWARD from the first `Khuôn IA:` line (eval-coverage-lint.js:180-189), so a decoy positioned before the zone is unreachable whether the scan runs over `zone` or over the whole document — the case measures nothing about zone-cutting.

Proven with a controlled mutant: I copied HEAD's script and changed only line 179 `const zlines = zone.split('\n')` → `ddText.split('\n')` (removing the zone restriction entirely). On the exact [W8D] fixture, both binaries give identical results: D0 (căn cứ filled) → 0 W8d flags for both; D1 (căn cứ blanked) → 1 W8d flag for both. The case is green on the mutant.

The only decoy position that discriminates is AFTER the zone: append `Căn cứ: (nhiễu)` below `<!-- UX-SPEC-TEMPLATE>>> -->` and delete the real `Căn cứ:` line — HEAD flags W8d, the mutant reports "no coverage gaps detected". No case covers that position.

### Hình dạng 4 — assertion không ghim thông điệp: [W8A]-4-msg khớp vào DÒNG CHÚ GIẢI luôn được in, nên cánh «key rỗng không nuốt dòng kế» chưa bao giờ chạy
- file: `tests/scripts/run-tests.sh:1156`
- severity: high
- source: measurement
- AC: AC-11

Dòng 1156: `case "$outA4" in *"chưa trỏ"*)`. `$outA4` là TOÀN BỘ stdout của lint, mà lint luôn in dòng chú giải cuối: «… W8 = … a thiếu/chưa trỏ/không đọc được; b khai-không-đo; …» (scripts/eval-coverage-lint.js, dòng legend cuối `run()`). Chuỗi "chưa trỏ" nằm sẵn trong chú giải đó, nên hễ CÓ BẤT KỲ cảnh báo nào là ca xanh — bất kể W8a nào bật.

CHỨNG (mutation trên bản sao, đã khôi phục): đổi `/^design_doc:[ \t]*(.*)$/im` → `/^design_doc:\s*(.*)$/im` trong eval-coverage-lint.js — tức là TIÊM ĐÚNG con bug mà ca này tuyên bố canh (\s vượt dòng, key rỗng nuốt `---` của frontmatter làm path; thông điệp thật đổi từ «chưa trỏ» sang «W8a design_doc không đọc được: ---»). Chạy lại: `Results: 788 passed, 0 failed`, và tests/plugins/ux-spec.test.mjs cũng 0 FAIL. Không một phép đo nào trong diff đỏ.

Sửa theo lớp: ghim NGUYÊN CÂU cảnh báo («W8a surfaces có ui nhưng contract chưa trỏ đặc tả UX») hoặc lọc output như [W8L] đã làm đúng (`grep -E "^  \[feat-ux\] W8"` bỏ dòng chú giải) rồi mới so.

### Hình dạng 4 — cùng lớp: [W8A]-3-msg cũng khớp vào dòng chú giải (chuỗi «UX-STATE-TABLE» nằm sẵn ở đó)
- file: `tests/scripts/run-tests.sh:1151`
- severity: high
- source: measurement
- AC: AC-11

Dòng 1151: `case "$outA3" in *"W8a"*"UX-STATE-TABLE"*)`. Dòng chú giải in kèm mọi lần có cảnh báo chứa nguyên văn «UX-STATE-TABLE trong design_doc:», nên vế thứ hai của glob luôn thoả; vế «W8a» thì bất kỳ biến thể W8a nào cũng thoả. Ca không phân biệt được W8a-thiếu-marker với W8a-vắng-key.

CHỨNG: đổi thông điệp trong lint từ `thiếu bảng UX-STATE-TABLE (marker)` → `thiếu bảng trạng thái` (gỡ đúng mảnh mà E8 tuyên «cờ chứa "UX-STATE-TABLE"»). Chạy lại tests/scripts/run-tests.sh: `Results: 788 passed, 0 failed`. (Lớp này được ca UX1-đỏ bên tests/plugins/ux-spec.test.mjs bắt vì nó ghim nguyên câu — nhưng chính assert ở suite scripts thì chết, và E8 trong evals.yaml đang tính nó là bằng chứng.)

Đây là đúng cái bẫy mà comment của UX1 trong ux-spec.test.mjs đã tự cảnh báo («không phải chuỗi cũng nằm trong dòng chú giải») — nhưng chỉ vá một chỗ, chưa quét cả lớp sang run-tests.sh.

### Hình dạng 4 — assertion âm-tính không có chiều đỏ: decoy của [W8D]-pos đặt SAI PHÍA, nên cửa «chỉ đọc trong vùng marker» hoàn toàn không được đo
- file: `tests/scripts/run-tests.sh:1244`
- severity: high
- source: measurement
- AC: AC-11

Dòng 1242 chèn decoy `## Bối cảnh\nCăn cứ: quyết định của owner 2026-08-01.` vào ĐẦU file, tức TRƯỚC vùng marker; dòng 1244 khẳng định output không có W8d. Nhưng bộ đọc (`parseUxSpec`, scripts/eval-coverage-lint.js ~dòng 179-190) tìm dòng `Khuôn IA:` rồi quét TIẾN về sau để tìm `Căn cứ:`. Decoy đứng trước `Khuôn IA:` thì vòng quét không bao giờ chạm tới nó — kết quả giống hệt nhau dù bộ đọc có bị giới hạn trong vùng marker hay không.

CHỨNG: đổi `const zlines = zone.split('\n');` → `const zlines = ddText.split('\n');` (gỡ CHÍNH cửa chống-nhiễu mà ca tuyên chứng). Chạy lại: tests/scripts/run-tests.sh `Results: 788 passed, 0 failed` và tests/plugins/ux-spec.test.mjs 0 FAIL.

Hệ quả: `expected` của E12 trong _acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml hứa «bộ đọc chỉ ăn trong vùng marker, không ăn văn xuôi ngoài vùng» — lời hứa đó chưa có phép đo. Muốn sống, decoy phải đặt SAU dòng `Khuôn IA:` nhưng NGOÀI marker `UX-SPEC-TEMPLATE>>>` (đúng hình bài học r2), và phải kèm chiều đỏ chứng minh nó bị bỏ qua.

### Hình dạng 2 — fixture contract/evals viết tay đúng khuôn BÊN ĐỌC: chỉ bảng ST được round-trip, hai «dây nối máy-đọc» còn lại thì không
- file: `tests/scripts/run-tests.sh:1109`
- severity: medium
- source: measurement
- AC: AC-11

`mk_ux_fixture` (dòng 1106-1113) và `mkFixture` (tests/plugins/ux-spec.test.mjs, dòng 38-50) rút bảng trạng thái TỪ writer thật qua marker — đúng P55. Nhưng hai dây nối còn lại thì gõ tay đúng khuôn bên đọc: dòng 1109 in thẳng `design_doc: docs/design.md` vào frontmatter, và dòng 1112 in thẳng `states: [%s]`.

Cả hai tên khoá này được KHAI Ở WRITER — skills/acceptance/references/ux-spec-template.md, mục «Ba dây nối máy-đọc đi kèm»: `design_doc: <path design-doc, tương đối repo-root>` và `states: [ST-…]` (flow list MỘT dòng). Vì fixture tự dựng theo khuôn reader thay vì rút từ chỗ khai đó, writer và reader trôi khỏi nhau vẫn xanh: đổi tên khoá trong khuôn/SKILL mà không đổi trong lint (hoặc ngược lại) không có ca nào đỏ ở suite scripts. AC-11 trong contract.md tuyên đúng lớp này («không fixture viết tay đúng khuôn bên đọc») nhưng E11 là judgment, không có phép đo máy chặn.

Đường sửa cùng cơ chế đã dùng cho bảng ST: trích `design_doc:` và `states:` từ khối «Ba dây nối máy-đọc» của khuôn (đặt marker cho khối đó) rồi mới dựng fixture.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **W8 có ô nuốt luật: bảng trạng thái RỖNG (giữ marker, xoá hết dòng ST) đi qua sạch — cả vòng khớp W8b/W8c thành vô nghĩa**
  Người dùng thấy gì: Nếu người viết đặc tả xoá sạch các dòng trạng thái nhưng vẫn giữ khung bảng, hệ thống vẫn coi như đã khai đủ và không cảnh báo gì — trạng thái sản phẩm có thể không được liệt kê đầy đủ mà không ai biết.
  file: `scripts/eval-coverage-lint.js`
  severity: high
  Đề xuất: known-limits

- **W8d tắt được bằng cách xoá trọn mục «6. Khuôn IA» — cánh chống-đoán-chay chỉ đỏ khi tác giả để lại dòng khai**
  Người dùng thấy gì: Nếu toàn bộ mục khuôn giao diện đã chọn bị xoá thay vì chỉ để trống phần lý do, hệ thống không cảnh báo gì cả — mất khuôn hoàn toàn lại là trường hợp im lặng nhất, ngược với mục đích cảnh báo đoán-chay.
  file: `scripts/eval-coverage-lint.js`
  severity: high
  Đề xuất: known-limits

- **SKILL.md khai «mọi cờ [W8] hiện tại thẻ Cổng 1» nhưng thẻ không có đường đọc lint — engine không có ổ cắm cho cờ W8**
  Người dùng thấy gì: Tài liệu hướng dẫn nói mọi cảnh báo về đặc tả UX sẽ hiện trên thẻ quyết định Cổng 1, nhưng thẻ đó thực ra không hiển thị các cảnh báo này — người duyệt có thể tưởng đã kiểm đủ trong khi chưa thấy cảnh báo thật.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **design_doc là đường dẫn từ artifact không tin cậy, join thẳng vào root không có kiểm chặn phạm vi**
  Người dùng thấy gì: Đường dẫn tới tài liệu thiết kế được lấy trực tiếp từ hồ sơ mà không kiểm tra, nên về lý thuyết có thể khiến công cụ đọc nhầm một file khác ngoài dự kiến trên máy người chạy lệnh — rủi ro thấp vì chỉ chạy cục bộ, không hiển thị nội dung file đó.
  file: `scripts/eval-coverage-lint.js`
  severity: low
  Đề xuất: known-limits

- **W8 opt-in matches only the token `ui`, so mobile- and web-surface contracts are silently exempt**
  Người dùng thấy gì: Các tính năng chỉ khai bề mặt di động hoặc web (không dùng đúng từ 'ui') sẽ không được nhắc điền đặc tả UX, dù chúng vẫn có giao diện người dùng — đây là giới hạn phạm vi hiện tại đã được owner chốt khi chỉ bật khi khai surfaces có chữ 'ui'.
  file: `scripts/eval-coverage-lint.js`
  severity: medium
  Đề xuất: known-limits

- **W8d is disabled by deleting the line it guards**
  Người dùng thấy gì: Nếu dòng khai khuôn giao diện bị xoá hẳn thay vì chỉ để trống phần lý do, hệ thống không cảnh báo gì — im lặng nhất lại đúng lúc thiếu sót nặng nhất.
  file: `scripts/eval-coverage-lint.js`
  severity: medium
  Đề xuất: known-limits

- **Non-ASCII state ids produce a wrong diagnosis plus a false W8c**
  Người dùng thấy gì: Nếu id trạng thái dùng dấu tiếng Việt, hệ thống báo sai nguyên nhân lỗi và có thể báo nhầm là trạng thái chưa được khai trước dù thực ra đã khai — dễ gây khó hiểu khi tra lỗi nhưng không làm mất cảnh báo thật ở các trường hợp thông thường.
  file: `scripts/eval-coverage-lint.js`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).