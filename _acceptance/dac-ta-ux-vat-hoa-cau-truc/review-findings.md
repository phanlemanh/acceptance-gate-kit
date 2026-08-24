# Review Findings: dac-ta-ux-vat-hoa-cau-truc — Round 5

Verdict vòng này: REJECT. Danh sách dưới đây chia theo kết quả scope-triage.

## Trong hợp đồng

#### W8 tự chế bộ đọc frontmatter — dòng trong thân hợp đồng tắt được cánh cờ (false green đã dựng lại)
- file: `scripts/eval-coverage-lint.js:271`
- severity: high
- source: conventions
- AC: AC-6

Cánh W8 mới đọc hai key frontmatter bằng regex quét TOÀN tài liệu: `/^design_doc:[ \t]*(.*)$/im` (dòng 271) và `/^status:[ \t]*(.+)$/im` (dòng 268). Kit đã có nguồn duy nhất cho đúng việc này: `lib/evidence-core.cjs#frontmatterField` (cắt đúng khối `---…---`, bóc nháy theo cặp, bỏ comment) và `lib/workspace-record.cjs#usesUat` (chính là `status === 'signed-off'`) — cả hai đều exported, và chính file này đã vendor lib theo cùng cách (`context-glossary.js`, `eval-yaml.js`, `ac-line.cjs`) kèm comment dài giải thích vì sao KHÔNG được chép khuôn thứ hai ("Ai cần bóc dòng criterion thì require file này — không copy khuôn"). Đây là bản sao thứ hai của luật đọc frontmatter, và nó rộng hơn bản gốc nên nuốt cả code fence lẫn văn xuôi — trong khi W6 ngay trên đó đã ghi rõ "code spans, fenced blocks, frontmatter and link targets are not the author speaking".

ĐÃ DỰNG LẠI (bản sao ngoài repo, chạy chính `scripts/eval-coverage-lint.js`): contract có `surfaces: [ui]`, `status: approved`, KHÔNG có key `design_doc:` trong frontmatter, nhưng `## Notes` chứa một khối ```yaml minh hoạ khuôn với dòng `design_doc: docs/other-design.md`, và file đó tình cờ tồn tại + có marker → lint in `eval-coverage-lint: no coverage gaps detected.` exit 0. Cánh W8a sinh ra để bắt đúng ca "feature chạm UI mà chưa có đặc tả UX" đi qua SẠCH vì một dòng trong code fence. Đây đúng lớp «thước tự dối / ô nuốt luật» mà 4 vòng nghiệm thu của chính hồ sơ này đang cố diệt.

Sửa: `const { frontmatterField } = require(path.join(__dirname,'..','lib','evidence-core.cjs'))` (fail-open như ba lib kia), dùng nó cho cả `status` lẫn `design_doc`; hoặc gọi thẳng `workspace-record.usesUat(contractText)` cho nhánh grandfather. Kèm thêm một ca ma trận [W8A] có `design_doc:` nằm trong code fence ở thân hợp đồng để cánh này không trôi lại.

*Vì sao là AC-6*: hình dạng "key vắng" (design_doc không có trong frontmatter) là một trong các hình dạng AC-6 đòi cờ W8a phải bật, nhưng bug khiến lint im lặng đúng ca này.

---

#### Hợp đồng còn tuyên phần đã CẮT ở r4 (`states:`) và trỏ tới AC không tồn tại (AC-10/AC-11)
- file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md:32`
- severity: medium
- source: bugs
- AC: AC-3

Vòng 4 thu phạm vi (4c4c6659) cắt seam `states:` và các cánh W8b/W8c; evals đã sửa theo (d35d4f61) nhưng contract thì chưa:

- Dòng 32, AC-3 vẫn đòi SKILL có chỉ dẫn «contract ghi `design_doc:`, **evals khai `states:`**». `grep -n "states:" feature-loop/skills/feature-loop/SKILL.md skills/acceptance/references/ux-spec-template.md` → 0 kết quả. E3/UX3 cũng không kiểm mệnh đề này (checks a/a2/b/c/d không nhắc `states`). Vậy AC-3 mang một vế SAI VỀ VẬT và KHÔNG có phép đo — đúng lớp «thước không gắn vào vật được giao» mà chính hồ sơ này ghi trong Coverage.
- Dòng 57, ô «Đường đo» ghi «bảo đảm bởi: AC-10» — contract chỉ còn AC-1…AC-9. Dây đo trỏ vào khoảng không.
- Dòng 46 Coverage ghi «Ô Core → AC-1…AC-11»; dòng 38 AC-9 tuyên «MỌI cánh (W8a/W8b/W8c/parse)» trong khi W8b/W8c đã bị cắt.

Đây là vật NGƯỜI ký ở cổng: giữ nguyên thì thẻ duyệt trình một hợp đồng hứa nhiều hơn thứ được đo, và cả bốn con trỏ trên đều gãy im lặng (không lưới nào của kit đối chiếu criterion-ref trong prose).

failure_scenario: Người duyệt Cổng 2 đọc AC-3 tin rằng SKILL dạy khai `states:` trong evals và có eval chứng điều đó; thực tế `states:` không tồn tại ở bất kỳ artifact nào và không eval nào đo. Tương tự, «bảo đảm bởi: AC-10» ở ô Đường đo trỏ tới một AC đã bị xoá.

*Vì sao là AC-3*: AC-3 như đang viết vẫn đòi S1 có chỉ dẫn 'evals khai states:', nhưng vật giao (SKILL.md) không còn câu đó và không phép đo nào kiểm — tiêu chí này đang không được thoả.

---

#### Ghim thông điệp trỏ vào nhãn KHÔNG TỒN TẠI — E7/E8 thoái hoá về exit-code của cả suite (hình dạng 4: assertion không thực sự ghim)
- file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml:117`
- severity: high
- source: measurement
- AC: AC-9

E7 (dòng 117) ghim `exit 0; stdout có "PASS: [W8O]"`; E8 (dòng 129, 134) ghim `"PASS: [W8F]"`, `"PASS: [W8N]"`. `grep -rn 'W8O\|W8F\|W8N' tests/ scripts/` trả VỀ RỖNG — không nhãn nào trong ba nhãn đó tồn tại ở bất kỳ file kiểm thử nào. Ma trận thật trong tests/scripts/run-tests.sh chỉ in các nhãn `[W8A]-o1-lanh` … `[W8A]-o10-live` (dòng 1123–1155). Hệ quả: phần ghim của E7/E8 không thể được thoả bởi output thật, nên phép đo chỉ còn `exit 0` của TOÀN suite scripts — đúng lớp «assertion không ghim thông điệp». Bằng chứng nó đã cho xanh giả: evidence-report.md dòng 136–156 ghi E7/E8 `PASS` với output đúng bằng `PASS: ARM13-mut / Results: 788 passed, 0 failed` — chuỗi ghim không có mặt trong output được lưu. Ngoài ra nội dung mô tả cũng lệch vật: E8 tuyên «hồ sơ THẬT slug `files` … gỡ marker thì W8a bật ([W8N]-live)», nhưng ô o10 (dòng 1152–1155) không gỡ marker nào — nó dựng contract KHÔNG có key design_doc.

*Vì sao là AC-9*: AC-9 cấm rõ 'assertion âm-tính-một-mình' không ghim đúng thông điệp; E7/E8 ghim vào nhãn không tồn tại nên chỉ còn đo exit-code toàn suite, đúng hình dạng bị cấm.

---

#### Ma trận tuyên «MỌI hình dạng thiếu-vật» nhưng thiếu ô «key design_doc: RỖNG» — mutant sống sót (hình dạng 5: tuyên quét LỚP, chỉ có điểm-case)
- file: `tests/scripts/run-tests.sh:1123`
- severity: high
- source: measurement
- AC: AC-6

AC-6 tuyên «cờ W8a bật đúng cho MỌI hình dạng thiếu-vật — key vắng/rỗng · con trỏ chết · trỏ ra ngoài cây · thiếu marker · bảng rỗng», và chính thông điệp W8a (eval-coverage-lint.js:276) ghi «thiếu key design_doc: hoặc key rỗng». Ma trận o1–o10 chỉ dựng ba hình dạng của key: mặc định có path (dòng 1111), CHUỖI RỖNG = không in dòng key (o2/o7/o8), và path ra ngoài cây (o4). KHÔNG ô nào dựng contract có dòng `design_doc:` với giá trị rỗng. Đúng nhánh đó lại là nhánh mà code tự khai là có bẫy: eval-coverage-lint.js:270 «[ \t]* — KHÔNG \s*: \s vượt dòng nên key rỗng sẽ nuốt dòng kế làm path». Đã chứng bằng mutant: dựng fixture contract có `design_doc:` rỗng, lint hiện tại in «W8a … chưa trỏ đặc tả UX»; đổi regex thành `/^design_doc:\s*(.*)$/im` trên bản sao thì lint in «W8a design_doc không đọc được: --- — con trỏ đặc tả UX chết». Hành vi đổi hẳn, mà không ô nào trong ma trận đỏ — hàng rào `[ \t]*` hoàn toàn không được đo.

*Vì sao là AC-6*: AC-6 liệt kê rõ 'key vắng/rỗng' là một hình dạng bắt buộc có ô kiểm riêng; ô 'rỗng' hoàn toàn thiếu và một mutant chứng minh hành vi có thể đổi mà không case nào đỏ.

---

#### Fixture gõ tay key `design_doc:` đúng khuôn bên ĐỌC — nửa còn lại của seam writer→reader không round-trip (hình dạng 2)
- file: `tests/plugins/ux-spec.test.mjs:44`
- severity: medium
- source: measurement
- AC: AC-9

Bảng trạng thái được rút từ writer thật qua marker (`uxSection` dòng 32–39, `ux_section` trong run-tests.sh dòng 1106) — đúng P55. Nhưng dây nối thứ hai thì gõ tay: dòng 44–45 in thẳng `design_doc: docs/design.md` vào frontmatter fixture, và tests/scripts/run-tests.sh:1111 in thẳng `design_doc: docs/design.md` làm giá trị mặc định. Tên khoá này được KHAI ở phía writer — skills/acceptance/references/ux-spec-template.md, khối «Ba dây nối máy-đọc đi kèm», mục 1: «Contract frontmatter thêm key `design_doc: <path…>`». Khối đó nằm NGOÀI marker `UX-SPEC-TEMPLATE` (trước dòng `---8<---`), nên `uxSection` không cắt tới nó và không phép đo nào đọc nó: đổi tên khoá trong khuôn writer mà giữ nguyên lint thì không ca nào đỏ. AC-9 tuyên ngược lại («không fixture viết tay đúng khuôn bên đọc»), nên phần này là lời tuyên chưa được vật chứng — cùng cơ chế đã dùng cho bảng ST (đặt marker cho khối «Ba dây nối» rồi trích) chưa được áp.

*Vì sao là AC-9*: AC-9 cấm rõ 'không fixture viết tay đúng khuôn bên đọc'; test đang gõ tay đúng key design_doc thay vì rút từ khuôn qua marker, vi phạm trực tiếp câu này.

---

#### Mệnh đề trong AC-3 không có assert nào — «evals khai `states:`» đã rụng khỏi vật mà phép đo im lặng
- file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md:32`
- severity: low
- source: measurement
- AC: AC-3

AC-3 (dòng 32) yêu cầu S1 của SKILL.md có chỉ dẫn «… contract ghi `design_doc:`, evals khai `states:` …». Sau khi thu phạm vi, SKILL.md:92 không còn nhắc `states:` ở đâu cả (grep `states:` trong feature-loop/skills/feature-loop/SKILL.md không ra dòng nào ở bước 4), và UX3 chỉ có 5 phép kiểm a/a2/b/c/d — không phép nào chạm `states:`; expected của E3 cũng chỉ liệt kê a–d. Nghĩa là một mệnh đề của tiêu chí đã sai so với vật mà toàn bộ dây đo vẫn xanh: tiêu chí và phép đo lệch nhau, không có ai bắt.

*Vì sao là AC-3*: cùng một tiêu chí AC-3: mệnh đề 'evals khai states:' không còn khớp vật giao và không phép đo nào kiểm được vế này, nên AC-3 như đang viết không được thoả đầy đủ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **parseUxSpec gom badLines rồi không ai đọc — dòng trạng thái hỏng bị nuốt câm, thông điệp «bảng rỗng» báo sai**
  Người dùng thấy gì: Nếu bảng trạng thái màn hình có vài dòng viết sai khuôn, công cụ kiểm không báo gì cho riêng những dòng đó — chúng biến mất khỏi việc kiểm tra mà không ai nhận ra, dễ khiến người đọc tưởng đặc tả đã đầy đủ.
  file: `scripts/eval-coverage-lint.js`
  severity: medium
  Đề xuất: known-limits

- **Phụ thuộc file mới sang plugin acceptance-gate không khai sàn phiên bản, không có đường xuống thang**
  Người dùng thấy gì: Nếu môi trường đang chạy bản engine cũ hơn bản có khuôn đặc tả UX mới, một tính năng dù không liên quan tới giao diện cũng có thể bị dừng lại thay vì chỉ dừng đúng tính năng có giao diện, vì bước kiểm đầu vào chưa nói rõ cần bản nào và chưa có lối đi tiếp khi thiếu.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Banner ma trận W8A in «7 ô» trong khi suite chạy 10 ô**
  Người dùng thấy gì: Nhật ký kiểm thử tự báo đang chạy 7 tình huống trong khi thực tế kiểm 10, nên nếu sau này bớt đi một tình huống, không có dấu hiệu nào cảnh báo cho người đọc log.
  file: `tests/scripts/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **W8a báo «bảng RỖNG» sai trên bảng trạng thái đã điền đủ (regex ghim cứng 4 cột + pipe cuối)**
  Người dùng thấy gì: Nếu ai viết bảng trạng thái màn hình đúng nội dung nhưng trình bày hơi khác chuẩn nội bộ (ví dụ thêm một cột ghi chú), công cụ kiểm sẽ báo nhầm là bảng trống, khiến người sửa đi tìm sai hướng dù dữ liệu đã đủ.
  file: `scripts/eval-coverage-lint.js`
  severity: medium
  Đề xuất: known-limits

- **`badLines` được ghi nhưng KHÔNG ai đọc — dòng trạng thái hỏng bị nuốt câm**
  Người dùng thấy gì: Khi bảng trạng thái có lẫn dòng đúng và dòng sai khuôn, phần sai biến mất khỏi kiểm tra mà không có cảnh báo nào, nên một phần khai báo có thể bị bỏ sót mà không ai biết.
  file: `scripts/eval-coverage-lint.js`
  severity: medium
  Đề xuất: known-limits

- **Assert «chuỗi có mặt» trên TOÀN file trong khi lời hứa là quan hệ vị trí — UX3 checks b và c (hình dạng 3)**
  Người dùng thấy gì: Nếu sau này ai di chuyển câu hướng dẫn khai đặc tả UX hoặc câu vẽ hình sang một mục khác trong tài liệu hướng dẫn máy, hoặc chỉ để lại trong ghi chú, bộ kiểm tự động vẫn báo đạt dù vị trí đã sai mà không ai phát hiện.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/dac-ta-ux-vat-hoa-cau-truc/contract.md, _acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
