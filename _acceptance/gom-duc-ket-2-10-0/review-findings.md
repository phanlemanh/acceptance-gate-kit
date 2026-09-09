## Trong hợp đồng

### K7 tự nâng finding vào hợp đồng làm lỗi hành vi non-high biến mất khỏi CẢ vòng vá LẪN thẻ Cổng 2
- file: `feature-loop/workflows/acceptance-verify.js:886`
- severity: high
- AC: AC-10, AC-3, AC-9
- detail: Khối K7 (dòng 886–908) đặt `f.inContract = true` rồi `f.proposal = null; f.plain = null` cho mọi finding `harm=behavior` rơi trong ∪paths — không phân biệt severity. Nhưng hai bên đọc phía sau chỉ nhận một nửa: (a) verdict REJECT chỉ bật bởi `triageHighInContract` (dòng 1026, lọc `severity === 'high'`), nên finding medium/low KHÔNG kéo round vá; (b) thẻ Cổng Bằng chứng chỉ render mục dưới heading «## Ngoài hợp đồng» (lib/out-of-contract.js:14 `HEAD_OUT`, scripts/gate-card.js:760), nên finding vừa bị nâng KHÔNG còn xuất hiện trên thẻ, và `plain`/`proposal` đã bị xoá nên có lọt cũng render rỗng.

  Ca hỏng cụ thể — chính là ca test W38 đang ghim: finding `F-behavior-in`, `severity: medium`, file `src/a.js` nằm trong `paths` của E1/E2. Trước diff này nó đi nhánh ngoài-hợp-đồng → lên thẻ Cổng 2 với câu ngôn ngữ sản phẩm + ba lối («ghi Known limits» / «mở hợp đồng mới» / «nâng phạm vi sửa ngay») và người phải quyết. Sau diff: `inContract=true`, verdict vẫn PASS (không eval nào đỏ, không finding high), thẻ không có mục nào, `plain` đã bị null — lỗi hành vi thật nằm im trong review-findings.md và người ký PASS mà không hề thấy. Đây là ngược đúng mục tiêu K7 («không được trôi ra Known limits») và vi phạm luật CLAUDE.md «mọi thứ máy tự quyết đều có sổ + đường đảo + hiện ở khối CHƯA duyệt của Cổng Bằng chứng». Test W38 chỉ assert `inContract === true`, không assert verdict hay khả kiến trên thẻ, nên lớp này không có răng.
- rationale: AC-9 chỉ đòi harm=behavior∧inPaths → inContract=true và acRef gán đúng; không AC nào ràng buộc verdict REJECT phải bật theo severity hay đòi finding đã nâng phải vẫn hiện trên thẻ Cổng 2 — đây là khoảng trống thiết kế ngoài lời văn AC-9.

### AC-10 trong hợp đồng vẫn nói «file CHỮ (.md)» trong khi mã và eval đã đổi sang MỌI đuôi
- file: `_acceptance/gom-duc-ket-2-10-0/contract.md:36`
- severity: medium
- AC: AC-10
- detail: AC-10 phát biểu: «Then prompt chứa câu «chỉ chấm file CHỮ (.md) trong danh sách» + đúng danh sách». Bản vá S4-r2/r3 đã cố ý đổi hành vi sang lọc MỌI đuôi (feature-loop/workflows/acceptance-verify.js:495 `conventionScope` — chuỗi thật là «CHI cham cac file DA DOI so round truoc …»), và eval W39 (tests/workflows/acceptance-verify.test.mjs) ghim đúng hành vi mới, kể cả ca `deltaFiles: ['lib/x.cjs','scripts/y.sh']` chỉ có code. Hợp đồng KHÔNG được sửa theo.

  Hệ quả: một người đọc AC-10 ở Cổng Bằng chứng để đối chiếu sẽ thấy bằng chứng chứng minh một điều KHÁC với điều đã duyệt ở Cổng Phạm vi — eval đã được viết lại theo mã thay vì AC được viết lại theo quyết định. Nếu ai đó viết một eval đúng nguyên văn AC-10 (grep «.md» trong prompt) thì nó ĐỎ trên mã hiện tại. Notes mục «Vá lượt 4 (4)» có ghi việc sửa, nhưng câu AC — nguồn sự thật của phạm vi — vẫn mang chữ cũ.
- rationale: AC-10 tự khai câu «chỉ chấm file CHỮ (.md) trong danh sách»; đối chiếu nguyên văn với prompt thật thì câu đó không tồn tại — AC-10 đọc-nguyên-văn thất bại trên chính sản phẩm.

### eval-yaml.cjs có HAI cách đọc `- id:` khác nhau; comment đuôi trên dòng id làm K4 im lặng rơi về luật cũ
- file: `lib/eval-yaml.cjs:93`
- severity: medium
- AC: AC-2, AC-6
- detail: Trong cùng một file tự khai là «MỘT nguồn», `parseEvals` đọc id bằng `/^\s*-\s+id:\s*(.+)$/` (dòng 42 — nuốt trọn phần còn lại của dòng, KHÔNG cắt chú thích, KHÔNG bóc quote, indent tuỳ ý), còn `pathsOf` đọc bằng `/^\s{0,4}-\s+id:\s*(\S+)/` + `unq` (dòng 93 — chỉ token đầu, có bóc quote, indent ≤4). `staleScope` ghép hai bên bằng `declared[e.id]` (lib/evidence-core.cjs:684–695), nên hai cách đọc lệch là ghép trượt.

  Đo thật vừa chạy trên cây này: evals.yaml có dòng `  - id: E1   # eval dau` (E1 khai đủ `paths: [src/**]`, executor test) → parseEvals ids = ["E1   # eval dau"] · pathsOf = {"E1":["src/**"]} · staleScope = null. Tức một chú thích đuôi (hoặc id để trong nháy, hoặc entry thụt >4 space) làm cả hồ sơ rơi về luật cũ «cả cây» — CÂM: pre-merge chỉ in NOTE khi thiếu node/lib (scripts/pre-merge-check.sh:1164), không in gì cho ca này. Chiều lỗi an toàn (chặt hơn), nhưng nó vô hiệu hoá đúng tính năng sinh ra để cắt 277 lượt ghim lại, mà không ai biết. `staleScope` đã cẩn thận đưa `executor` qua `stripComment`; `id` thì không.
- rationale: AC-6(e) chỉ ràng buộc pathsOf đọc đúng hai dạng khai `paths:`, không ràng buộc việc trích id giữa hai hàm đọc phải khớp nhau — lệch id nằm ngoài câu chữ AC-6.

### Đường trả về BLOCKED mới trả `variance` khác khuôn đường lành, dù comment ngay trên khai là «đủ trường như blockedEarly»
- file: `feature-loop/workflows/acceptance-verify.js:1096`
- severity: low
- AC: AC-10, AC-3, AC-9
- detail: Đường lành trả `variance: varianceCmds.map(m => ({ cmd, evals, runs, passRate }))` (dòng 1149). Nhánh BLOCKED mới của K1 trả `variance: varianceCmds` thô (dòng 1096) — tức mảng object kết quả máy nguyên vẹn, không có `passRate`, và mang theo `outputTail`/`runId` của từng lệnh. Bên đọc nào lấy `result.variance[i].passRate` (khuôn duy nhất đường lành cam kết) sẽ nhận `undefined` thay vì phân số, và payload trả về phình vô ích. Comment ngay phía trên (dòng 1084–1085) tuyên bố «Khuôn trả về ĐỦ TRƯỜNG như blockedEarly: ba đường BLOCKED phải cùng một hợp đồng kết quả» — lời khai đó không đúng với trường này. Tác động thấp vì hôm nay không tìm thấy bên đọc `result.variance` trong SKILL/main loop, nhưng đây đúng là lớp lỗi mà chính K1 sinh ra để chặn.
- rationale: AC-3 chỉ ràng buộc khuôn trả về cho nhánh capture:provenance chết (blocked, reason, prov.enforcement_mode); không AC nào ràng buộc trường variance phải cùng khuôn giữa các đường BLOCKED khác nhau.

### Bare-directory `paths:` entries match nothing, so evidence silently stops going stale
- file: `scripts/pre-merge-check.sh:525`
- severity: high
- AC: AC-2, AC-6
- detail: K4 narrows staleness to `∪paths:` by feeding the eval globs into `match_globs`, but `match_globs` is a plain shell `case` pattern test with only a `**/` expansion. A `paths:` entry that names a directory (`scripts`, `tests/scripts`, `hooks`, `commands`, `skills`, `docs/adr`, or a trailing-slash entry like `_acceptance/measure-birth-certificate/evidence/`) matches the literal path only — never a file under it. Since the new branch reports a changed file ONLY when it matches `$_sp`, those declarations narrow the scope to nothing instead of to a whole subtree.

  Verified: a harness sourcing `glob_variants`/`match_globs` out of the script gives NOMATCH for `scripts` vs `scripts/gate-card.js` and for `tests/scripts` vs `tests/scripts/run-tests.sh`, while `scripts/**` gives MATCH. Running `node lib/evidence-core.cjs stale-scope` over every workspace in this repo shows 8 slugs that resolve to a scope (exit 0) and contain such entries: bai-hoc-do-luong-vao-engine, cat-hinh-thuc, design-pass-nac-khong-dong-bo, lenh-in-ra-phai-bam-duoc, luu-kho-codex-va-nghi-le-design, measure-birth-certificate, repo-khai-plugin, vao-co-o-ra-co-ten.

  Concrete failure: `_acceptance/bai-hoc-do-luong-vao-engine/evals.yaml` declares `scripts`, `tests/scripts`, `hooks`, `tests/workflows`. After that record is pinned, editing `scripts/gate-card.js` or `hooks/acceptance-evidence-gate.js` produces no VIOLATION — the record reads fresh while the code it measures has changed. Under the old rule every one of those edits was stale. This is exactly the fail-open the comment above `stale_files` claims does not exist («Không có đường fail-open nào ở đây»), and no NOTE is printed because node and the lib are both present.

  Related, same line: the two readers of `paths:` disagree on glob semantics — here `*` crosses `/` (shell `case`), while `globToRe` in feature-loop/workflows/acceptance-verify.js compiles `*` to `[^/]*`. One declaration therefore means two different file sets to the gate and to the coverage/K7 logic.

  Fix direction: normalize a directory-shaped entry to `<dir>/**` (or reject entries that are neither a glob nor an existing file) before matching, and add a case to tests/scripts/stale-paths.test.mjs — SP1–SP4 only use `src/**` and `lib/**`, so this shape is untested.
- rationale: AC-6(a)/(b) chỉ chứng minh stale hoạt động đúng với các mục paths dạng file/glob cụ thể (vd src/app.js); không AC nào thử mục paths dạng thư mục trần — hình dạng lỗi này nằm ngoài fixture mà AC-6 đã chốt.

### Staleness scope is read from the working-tree `evals.yaml`, not from `verified_commit`
- file: `scripts/pre-merge-check.sh:519`
- severity: medium
- AC: AC-2, AC-6
- detail: `stale_files` resolves the scope with `node "$EVIDENCE_CORE_LIB" stale-scope "$3/evals.yaml"`, where `$3` is `$ROOT/_acceptance/<slug>/` in the CURRENT tree, while the staleness question being answered is about the tree at `$vc` (`verified_commit`). Two lines above, line 522 unconditionally skips `_acceptance/*` from the changed-file list, so a post-signoff edit to `evals.yaml` is itself never stale.

  The two together make the pinned scope retroactively editable with no signal: after a record is signed off, deleting or narrowing `paths:` entries in its `evals.yaml` shrinks the set of files that can mark it stale, the edit does not trip the staleness check, `hooks/acceptance-evidence-gate.js` guards `contract.md`/`evidence-report.md` but not `evals.yaml`, and the NOTE at line 1164 only fires for missing node/lib — never for a scope that changed. Concretely: pin a record, change `lib/foo.js` (in scope, would be VIOLATION), then drop `lib/**` from `paths:` — the gate goes green without any re-verify and without printing which rule ran.

  Reading the scope from `git -C "$ROOT" show "$vc:_acceptance/<slug>/evals.yaml"` would tie the measure to the artifact that was actually pinned, matching the kit's own rule that the ruler must be attached to the delivered thing.
- rationale: AC-6 chứng minh hành vi stale trên các file được đo, nhưng không AC nào ràng buộc rằng chính khai báo phạm vi (`paths:` trong evals.yaml) phải được đọc từ verified_commit thay vì cây làm việc hiện tại.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bản sao thứ hai của `clean` trong evidence-page.js không được kéo về nguồn stripComment mới**
  Người dùng thấy gì: Nếu một thông tin trong hồ sơ chứa ký tự '#', trang tổng hợp bằng chứng có thể hiển thị giá trị khác với thẻ quyết định, khiến hai nơi người đọc cùng một hồ sơ thấy hai nội dung không khớp nhau.
  file: `scripts/evidence-page.js`
  severity: medium
  Tác hại: behavior
  Đề xuất: known-limits

- **Hình dạng 4 — «chiều đỏ» của PV5 là assert tautology, không bao giờ đỏ được**
  Người dùng thấy gì: Một bài kiểm dùng để đảm bảo công cụ quét phân biệt được bản lỗi giả với bản thật thực ra không thể báo lỗi trong bất kỳ trường hợp nào, nên nếu công cụ quét đó hỏng thật, sẽ không có cảnh báo nào bật lên.
  file: `tests/scripts/w6-w8-pham-vi.test.mjs`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 5 — E9 tuyên ma trận 4 finding × 2 trường = 8 assert, W38 chỉ có điểm-case cho `acRef`**
  Người dùng thấy gì: Bài kiểm tra tính năng phân loại lỗi vào/ngoài phạm vi hợp đồng chỉ kiểm đầy đủ cho một trong bốn trường hợp thử; ba trường hợp còn lại kiểm không đủ chặt, nên nếu máy gán sai thông tin phân loại cho chúng, sẽ không có cảnh báo nào bật lên.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 5 — TH4 tuyên «ba nơi đánh nhãn cùng thứ tự» nhưng chỉ đo khối hiển thị; fixture làm hai nơi kia không đo được**
  Người dùng thấy gì: Bài kiểm tra thứ tự hiển thị các mục ngoài phạm vi hợp đồng chỉ kiểm đúng được một trong ba nơi hiển thị; hai nơi còn lại dùng dữ liệu thử giống hệt nhau nên không thể phân biệt đúng/sai, và nếu thứ tự ở hai nơi đó bị sai thật, sẽ không có cảnh báo nào bật lên.
  file: `tests/scripts/ooc-tac-hai.test.mjs`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 4 (biến thể «không ghim đúng thông điệp») — ba eval ghim trong `expected` những chuỗi/số mà phép đo đang chạy KHÔNG sinh ra, có chỗ còn ngược hẳn**
  Người dùng thấy gì: Bộ tiêu chí dùng để chấm ba phần việc trong vòng này (quy tắc từ trong danh sách được phép dùng, phạm vi quét theo file thay đổi, và các con số đo hiệu suất) đang ghi sai so với thực tế đang chạy — người đọc bộ tiêu chí này để đối chiếu kết quả có thể bị dẫn tới kết luận sai.
  file: `_acceptance/gom-duc-ket-2-10-0/evals.yaml`
  severity: high
  Tác hại: measure
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 3/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/gom-duc-ket-2-10-0/contract.md, scripts/evidence-page.js, _acceptance/gom-duc-ket-2-10-0/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.