## Trong hợp đồng

- **W8d đọc «Khuôn IA:»/«Căn cứ:» ngoài marker — đoán chay lọt lưới (thước không gắn vào vật)**
  file: `scripts/eval-coverage-lint.js:319`
  severity: high
  AC: AC-5
  Cánh W8b/W8c cắt đúng khối `<<<UX-STATE-TABLE … UX-STATE-TABLE>>>` rồi mới đo, nhưng W8d lại `ddText.match(/^Khuôn IA:…/m)` và `/^Căn cứ:…/m` trên TOÀN design-doc, lấy occurrence ĐẦU TIÊN và không ràng buộc hai dòng phải nằm trong cùng khối marker (thậm chí không cần cùng thứ tự).

  Đã dựng lại và xác nhận: design-doc có một dòng `Căn cứ: đã tra Mobbin, rút X.` ở section «Bối cảnh» phía trên, còn `Căn cứ:` THẬT trong section Đặc tả UX để TRỐNG → `node scripts/eval-coverage-lint.js <root>` in `no coverage gaps detected`, exit 0. Máy đoán chay mà thẻ Cổng Phạm vi sạch.

  Đây đúng lớp «thước phải gắn vào vật được giao» trong CLAUDE.md, và mâu thuẫn với chính lời khai của khuôn (`ux-spec-template.md`: marker «là mỏ neo cho phép đo khớp vòng»). Nó cũng làm hỏng cơ chế mà AC-5 tự khai: «căn cứ trống nhìn thấy được trên vật trình cổng — cơ chế: cánh W8d». Case [W8D] trong tests/scripts/run-tests.sh không bắt được vì fixture chỉ có đúng một dòng `Căn cứ:`.

  Sửa: đo W8d trên `ddText.slice(mSpecStart, mSpecEnd)` của khối `UX-SPEC-TEMPLATE` (hoặc ít nhất trên đoạn sau `^Khuôn IA:`), và thêm fixture có dòng `Căn cứ:` nhiễu đứng trước.

- **Một eval khai states: block-list làm câm TOÀN BỘ W8b của hồ sơ**
  file: `scripts/eval-coverage-lint.js:312`
  severity: medium
  AC: AC-6
  `for (const st of declared) { if (blockListIds.size) break; … }` — chỉ cần MỘT eval bất kỳ viết `states:` dạng block-list là mọi cờ W8b (khai-không-đo) của cả hồ sơ biến mất, kể cả những trạng thái chẳng liên quan gì tới eval đó.

  Dựng lại: design-doc khai ST-man-loading + ST-man-empty; E1 khai `states: [ST-man-loading]` (flow-list), E2 khai block-list. ST-man-empty không eval nào đo, nhưng output chỉ có đúng 1 dòng — cờ block-list — KHÔNG có W8b nào. Trạng thái thật sự không được đo đi qua lưới im lặng.

  Mâu thuẫn với nguyên tắc cùng lượt này vừa dựng cho phía design-doc: case [W8P] khẳng định «dòng hỏng không câm cả luật» (dòng ST cụt cột vẫn để W8b của các dòng lành chạy). Phía evals lại làm ngược. Sửa rẻ: chỉ bỏ qua W8b cho các ST mà eval block-list đó khai (parse luôn danh sách block-list), hoặc parse block-list cho đúng thay vì chỉ cảnh báo.

- **W8d reads the first `Căn cứ:` line in the whole design-doc, not the one in the UX-spec block — the arm silently passes**
  file: `scripts/eval-coverage-lint.js:321`
  severity: high
  AC: AC-5
  The W8d arm locates `Khuôn IA:` and `Căn cứ:` with two independent whole-document regexes (`ddText.match(/^Căn cứ:[ \t]*(.*)$/m)`), unlike the state-table arm right above it which correctly slices the `UX-STATE-TABLE` marker block first. `String.match` returns the FIRST match in document order, so any unrelated line starting with `Căn cứ:` anywhere earlier in the design-doc satisfies the check and W8d never fires — even when the actual IA justification inside the UX spec is empty. This is the real-world shape: the template section is appended into a large existing design-doc, and `Căn cứ:` is ordinary Vietnamese prose.

  Reproduced: took the template section, blanked the IA line to `Căn cứ:` (the exact defect AC-5 says W8d must catch), prepended `## Bối cảnh\nCăn cứ: quyết định của owner 2026-08-01.` → `node scripts/eval-coverage-lint.js .` printed `no coverage gaps detected`, exit 0. Removing only the prepended line makes it fire. Test case [W8D] in tests/scripts/run-tests.sh never exercises this because its fixture is the bare template section, which has exactly one `Căn cứ:` line — so the measurement passes its own suite while being disabled on the artifact it is meant to guard.

  Fix: search for `Khuôn IA:`/`Căn cứ:` inside the `<<<UX-SPEC-TEMPLATE` … `UX-SPEC-TEMPLATE>>>` slice (the file already does exactly this for the state table), and take the `Căn cứ:` that follows the `Khuôn IA:` line.

- **Empty `design_doc:` key swallows the next frontmatter line as the path (`\s*` crosses the newline), skipping the intended "chưa trỏ" branch**
  file: `scripts/eval-coverage-lint.js:242`
  severity: medium
  AC: AC-8
  `contractText.match(/^design_doc:\s*(.+)$/im)` uses `\s*`, which matches newlines, so a key present but empty makes the capture group take the NEXT line's content. `dd` becomes truthy garbage, the `if (!dd)` branch (W8a "contract chưa trỏ đặc tả UX (thiếu key design_doc:)" — the wording AC-8 asks for) is skipped, and the run falls through to the file-read branch instead. The adjacent `status:` regex on line 240 correctly uses `[ \t]*`; this one is the odd one out.

  Reproduced with frontmatter `design_doc:` followed by `status: approved`:
  `[f] W8a design_doc không đọc được: status: approved — con trỏ đặc tả UX chết.`
  The author is sent to fix a path that does not exist instead of being told the key is empty. Same class of misdirection if the following line resolves to a readable file, in which case the arm reads the wrong document entirely.

  Fix: change `\s*` to `[ \t]*` so an empty value falls into the `!dd` branch.

- **Đo CHỈ DẪN thay vì ĐẦU RA — cửa miễn "bỏ đặc-tả-UX — " không có bộ đọc nào trong engine**
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml:63`
  severity: medium
  AC: AC-4
  E4/UX4 (tests/plugins/ux-spec.test.mjs:149-159) chỉ grep hai file văn bản hướng dẫn (SKILL.md và ux-spec-template.md) xem chuỗi `"bỏ đặc-tả-UX — "` có mặt và khớp ký tự không. Không có bất kỳ script/lib/hook nào đọc prefix này: `grep -rn 'bỏ đặc-tả-UX' scripts lib hooks feature-loop` chỉ trả về chính hằng MIEN trong file test. So sánh với các quy ước cùng họ: `bỏ gap-probe` CÓ bộ đọc (lib/gap-probe.cjs:15 `DESCOPE_RE`), `bỏ đường-đo — ` CÓ bộ đọc (scripts/gate-card.js:323). Diff này cũng không đụng gate-card.js. Hệ quả: nhánh «feature không chạm UI → ghi entry descope có vết» của AC-4 không có ĐẦU RA nào để đo — máy bỏ khuôn mà không ghi entry nào thì không phép đo nào đỏ, mà E4 vẫn xanh vì nó chỉ kiểm chữ trong file hướng dẫn. (Nửa còn lại của AC-4 — «không surfaces ui thì W8 im» — thì có đo thật ở [W8O].)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **Cánh --files nhận diện bằng chuỗi ma thuật slug === 'files'**
  Người dùng thấy gì: Nếu một tính năng thật có tên (slug) trùng chữ 'files', công cụ kiểm tra đặc tả UX sẽ tự động bỏ qua toàn bộ phần kiểm tra cho tính năng đó như thể đang chạy ở chế độ đặc biệt — lỗ hổng khớp vòng có thể lọt qua mà không ai biết.
  file: `scripts/eval-coverage-lint.js`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **UX3 checks.a2 và checks.d không có mutant — phép đo mới chưa từng bị phá thử**
  Người dùng thấy gì: Hai điều kiện kiểm tra tài liệu hướng dẫn (cấm gán cứng đường dẫn bộ nhớ đệm, và không để mất dòng khai báo bảng trạng thái) chưa từng được thử bằng cách cố tình phá hỏng nội dung để xem phép kiểm có phát hiện ra không — nên chưa rõ hai điều kiện này có thực sự bắt được lỗi hay chỉ luôn báo đạt.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Multi-line flow-list `states:` silently drops every item after the first line → false W8b with a misleading fix instruction**
  Người dùng thấy gì: Nếu người viết eval khai danh sách trạng thái đo được trên hai dòng thay vì một dòng (một cách viết hợp lệ và tự nhiên khi danh sách dài), công cụ sẽ chỉ đọc được trạng thái đầu tiên, rồi báo nhầm rằng các trạng thái còn lại chưa được đo — và hướng dẫn sửa sai lại bảo xoá đi một khai báo vốn dĩ đúng.
  file: `scripts/eval-coverage-lint.js`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Chiều đỏ UX1 là tautology — mutation và assertion là cùng một thao tác chuỗi (assertion âm-tính không đi qua phép kiểm)**
  Người dùng thấy gì: Hai phép thử được gắn nhãn là 'phải báo lỗi khi khuôn mẫu hỏng' thực ra luôn báo đạt bất kể khuôn mẫu có hỏng hay không, nên chúng không chứng minh được điều mình tuyên bố — nếu khuôn mẫu bị hỏng đúng theo hai kiểu này, phép thử sẽ không phát hiện ra.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Assert chuỗi-có-mặt trên TOÀN FILE trong khi lời hứa là quan hệ (UX3b) — đúng lớp lỗi mà chính file này khai đã sửa cho UX3a**
  Người dùng thấy gì: Điều kiện kiểm tra rằng hướng dẫn ghi hai dòng cấu hình bắt buộc chỉ xem hai dòng đó có xuất hiện ở bất kỳ đâu trong toàn bộ tài liệu hướng dẫn, không kiểm tra chúng có thực sự nằm đúng bước bắt buộc hay không — nếu ai đó dời hai dòng đó sang một mục không bắt buộc, phép kiểm vẫn báo đạt như không có gì xảy ra.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Chiều đỏ UX4 là tautology — chỉ chứng minh String.replace chạy, không chạy phép so hai bên**
  Người dùng thấy gì: Phép thử tuyên bố sẽ báo lỗi khi cụm từ miễn trừ trong tài liệu hướng dẫn và trong khuôn mẫu lệch nhau, nhưng thực chất phép thử này không so sánh hai bên với nhau — nếu tài liệu hướng dẫn mất hẳn cụm từ miễn trừ, cảnh báo tương ứng sẽ không xuất hiện dù nhãn của phép thử nói là có.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).