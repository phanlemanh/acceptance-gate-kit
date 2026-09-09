Review Findings: gom-duc-ket-2-10-0 (Round 1)

## Trong hợp đồng

### `_Allow_` dùng làm chốt tắt alias trần — trái hợp đồng đã khai của lib/context-glossary.js, 6 luật `_Avoid_` chết lặng
- file: `CONTEXT.md:19`
- severity: high
- source: conventions
- AC: AC-1, AC-5

lib/context-glossary.js:27-32 khai hợp đồng của `_Allow_` bằng chữ: nó «carves out multi-word phrases that legitimately CONTAIN an avoided alias … it suppresses only the occurrences inside the phrase, never the bare alias elsewhere — an allowlist must not turn a fail-loud check into a fail-silent one». Sáu dòng mới (CONTEXT.md:19 `thẻ`, :25 `test`, :33 `tag, thẻ`, :44 `check`, :49 `engine`, :73 `hook`) đều là ALIAS TRẦN, đặt ngay dưới chính dòng `_Avoid_` khai chúng (:18, :24, :32, :43, :48, :72). Vì `allow` trong parseGlossary là GLOBAL (allow.push chạy bất kể `cur`, dòng 74-76), mỗi mục này vô hiệu alias đó ở MỌI term và MỌI hợp đồng của kho — `_Avoid_: thẻ` của **Contract** và `_Avoid_: thẻ, tag` của **Dấu** giờ không bao giờ nổ được nữa, trong khi vẫn nằm đó như luật đang sống. Đây đúng lớp «thước không phân biệt được» mà CLAUDE.md gọi tên: luật còn chữ nhưng hết răng. Tệ hơn, tests/scripts/w6-w8-pham-vi.test.mjs PV3 ĐÒI sáu mục này phải có mặt, nên trạng thái fail-silent bị ghim lại thành bất biến. Nếu ý định thật là «W6 chỉ chấm trong ## Criteria» thì việc đó đã do opts.section làm rồi (eval-coverage-lint.js:253) — sáu `_Allow_` này là lớp tắt tiếng thứ hai, thừa và phá hợp đồng. Lối sửa đúng tầng: hoặc GỠ alias khỏi `_Avoid_` (khai thẳng là không còn cấm), hoặc để `_Allow_` chỉ nhận cụm nhiều từ như hợp đồng khai.

Rationale phạm vi: AC-5(c) chỉ đòi các mục `_Allow_` này tồn tại và khiến «thẻ Cổng 2» không kêu; không AC nào kiểm việc `_Avoid_` của các thuật ngữ khác (Contract, Dấu) bị vô hiệu theo — đó là hệ quả rộng hơn không được test.

### commands/signoff.md vẫn dạy «Enter xác nhận» — mâu thuẫn với khối IDENTITY-ECHO-RULE trong cùng file; neo ÂM không bắt được vì câu bị ngắt dòng
- file: `commands/signoff.md:74`
- severity: high
- source: conventions
- AC: AC-4

K2 đổi luật thành «suy được nấc nào thì GHI THẲNG, chỉ ca CẠN mới hỏi» (khối IDENTITY-ECHO-RULE, signoff.md:63-65). Nhưng signoff.md:73-76 vẫn còn: «Chữ «Ký» vẫn phải do NGƯỜI gõ — Enter xác nhận chỉ xác nhận danh tính, không phải chữ ký; máy GHI THẲNG danh tính suy được…» — một câu tự mâu thuẫn, và đứng trước nó là «phần máy suy vẫn hiện trong dòng xác nhận» (:71). Agent đọc thân lệnh này vẫn có căn cứ dựng lại đúng lượt chờ mà K2 đi bỏ, tức trạm thu phí quay lại. Răng lẽ ra chặn: tests/plugins/run-tests.sh BODY_AM thêm neo ÂM (\"enter-xac-nhan-cu\", \"Enter xác nhận\") ở dòng ~9871, nhưng check_bodies so bằng `s in t` trên văn bản THÔ, còn câu trong file bị ngắt dòng thành «Enter xác\n  nhận». Kiểm chứng: `'Enter xác nhận' in text` → False, `'Enter xác\n  nhận' in text` → True. Nghĩa là neo âm chưa bao giờ chạm vật; nó cho màu xanh mà không phân biệt được «đã gỡ» với «chỉ bị wrap». Hai việc phải làm cùng lượt: xoá/viết lại câu ở :73-76 (và :71) cho khớp luật mới, và cho BODY_AM chuẩn hoá whitespace trước khi so (vd `re.sub(r'\s+',' ',t)`), không thì mọi neo âm của bộ này đều bị một lần xuống dòng vô hiệu hoá.

Rationale phạm vi: AC-4(a)/(e) đòi khối và thân lệnh KHÔNG chứa «Enter xác nhận» ở bất kỳ ca nào ngoài CẠN; câu ở signoff.md:73-76 vi phạm trực tiếp.

### stripComment khai là «MỘT nguồn cho mọi bộ đọc dòng» nhưng gate-card.js giữ nguyên `clean()` với regex `\s*#` cho 13 field khác
- file: `scripts/gate-card.js:236`
- severity: medium
- source: conventions
- AC: AC-2, AC-9

lib/eval-yaml.cjs:60-65 khai stripComment là «MỘT nguồn cho mọi bộ đọc dòng (surfaces, field của eval, frontmatter)», lý do là trước đây `[ \t]+#` ở lib/lint và `\s*#` ở thẻ cho hai câu trả lời khác nhau trên cùng một dòng. Nhưng trong chính scripts/gate-card.js chỉ đúng MỘT call site được chuyển (dòng 570, `NG1.coNguoiDungCuoi(evalYamlLib.stripComment(cfm.surfaces))`); `const clean = … .replace(/\s*#.*$/, '')` ở dòng 236 vẫn sống và vẫn được dùng cho 13 field frontmatter khác (risk_tier :308, status :309/:801, gp verdict/p0/p1/p2 :391/:407/:915/:916, design-pass material/context/context_scenes/reaction/options :451-469, evidence verdict :688, veto_state :898). Với các field đó, giá trị `x#y` vẫn bị cắt thành `x` — đúng chỗ hai luật cắt còn lệch nhau, chỉ là đã dời sang field khác. Ca NO3 của tests/scripts/lnt-no.test.mjs chỉ đo hai đường của `surfaces`, nên không phân biệt được «một nguồn» thật với «một nguồn cho một field». Hoặc chuyển `clean` sang gọi stripComment (giữ phần strip quotes), hoặc sửa lời khai trong lib/eval-yaml.cjs cho đúng phạm vi thật.

Rationale phạm vi: AC-2(c) chỉ đòi ba bộ đọc trả CÙNG kết quả trên field `ui_observed`/surfaces qua stripComment; không AC nào đòi 13 field frontmatter khác (risk_tier, status, gp verdict...) cũng dùng cùng cơ chế cắt comment.

### lib/context-glossary.js thêm require cứng './md-section.cjs' — trái nếp guard require chéo trong lib/, làm W6 chết lặng trên cây vendored thiếu file
- file: `lib/context-glossary.js:167`
- severity: medium
- source: conventions
- AC: AC-5

Dòng 167 thêm `const { sectionLines } = require('./md-section.cjs');` ở giữa file, không guard. Nếp có sẵn của kho cho require CHÉO giữa các file lib/ là guard, đúng vì repo tiêu thụ vendored TỪNG file lib: lib/evidence-core.cjs:200-202 `loadEvalYaml()` bọc try/catch và trả null để bên gọi fail-closed; lib/nguong-o-co-hoi.cjs:83-84 `try { LNT = require('./lop-nhin-thay.cjs') } catch (_) { LNT = null }` với chú thích nói thẳng «bản vendored/bản sao chỉ chép từng file lib … không có lop-nhin-thay.cjs → quay về regex cũ … thay vì ném lỗi làm bộ quét/bản đồ chết». Chính tests/scripts/lnt-no.test.mjs (ca NO1) dựng đúng cây đó (chỉ chép 2 file lib) để chứng đường đọc-cũ còn sống. Với require mới, một cây có context-glossary.js mà thiếu md-section.cjs sẽ ném ngay lúc nạp module; scripts/eval-coverage-lint.js:53 nuốt lỗi đó (`try { glossaryLib = require(...) } catch (_) {}`) nên W6 biến mất HOÀN TOÀN mà không một dòng NOTE nào — đúng hình dạng fail-open lặng mà NOTE ba nguyên nhân ở pre-merge-check.sh vừa được thêm để chống. Bọc require trong try/catch và cho findViolations bỏ qua opts.section khi thiếu lib (hoặc báo một dòng), như hai tiền lệ trên.

Rationale phạm vi: AC-5(a) chỉ đòi W6 quét đúng section ## Criteria trên cây kit thật; không AC nào kiểm hành vi trên cây vendored/bản sao thiếu md-section.cjs.

### Hai dòng `_Allow_` chèn vào GIỮA câu `_Avoid_` bị xuống dòng, cắt đôi định nghĩa của CONTEXT.md
- file: `CONTEXT.md:25`
- severity: medium
- source: conventions
- AC: AC-1, AC-5

CONTEXT.md:24-26 hiện đọc là «_Avoid_: requirement, user story, test (criterion là *điều phải đúng*, không» / «_Allow_: test» / «phải cách chứng minh).» — mệnh đề giải thích bị chèn ngang. Y hệt ở :72-74: «_Avoid_: hook, plugin point, "khoá config" trơ (không nói lên luật vắng-thì-» / «_Allow_: hook» / «fallback), extension point.». Parser không vỡ (parseGlossary chỉ đọc dòng mở đầu `_Avoid_:`, phần nối vốn đã bị bỏ), nhưng CLAUDE.md khai CONTEXT.md là glossary phát triển mà người viết SKILL/docs phải đọc, và giờ hai định nghĩa đọc thành câu cụt: người đọc không còn thấy «extension point» là alias bị tránh của **Cấu hình có luật**, cũng không đọc trọn vế phân biệt criterion với cách chứng minh. Chuyển hai dòng `_Allow_` xuống SAU dấu chấm cuối của `_Avoid_` (như các block khác đã làm ở :18-19, :43-44, :48-49).

Rationale phạm vi: Không AC nào kiểm định dạng/khả năng đọc của các câu `_Avoid_`/`_Allow_` trong CONTEXT.md, chỉ kiểm hành vi lint của parser (vốn không bị ảnh hưởng).

### Provenance-death early return leaves the run-log round-tally claiming PASS while the workflow returns BLOCKED
- file: `feature-loop/workflows/acceptance-verify.js:1067`
- severity: high
- source: bugs
- AC: AC-10, AC-3, AC-9

The round-tally line is pushed into `runLogLines` at line 1042, BEFORE the provenance agent runs. The new K1 guard (line 1067) then sets `verdict = 'BLOCKED'` and pushes a new entry into `blocked`, but never rewrites or re-emits the tally. The tally is the machine-readable per-round record (schema block ROUND-TALLY-SCHEMA, read by feature-loop/scripts/round-tally-read.mjs and used for the round/infra counting).

Reproduced against the real workflow with the test harness (baseArgs, all agents green, `capture:provenance` → null):
  verdict: BLOCKED
  runLog tally: {"round":1,"kind":"round-tally","verdict":"PASS","expected":2,"returned":2,"blocked":0}

So run-log.jsonl records `verdict: PASS, blocked: 0` for a round the workflow declared BLOCKED — exactly the "dead lane must say so" failure the K1 change was added to fix, but only on the returned object, not in the durable record. tests/workflows/round-signal.test.mjs RS2 enumerates tally-producing paths and asserts "exactly one tally line" per path; it never compares `tally.verdict` with `result.verdict`, and the provenance-death path is not in its list, so nothing catches it.

Secondary, same block: this return omits `confirmedFindings` and `runLogWriteFailed`, which every other return (including `blockedEarly` at line 74) provides — `result.runLogWriteFailed` comes back `undefined` and `result.confirmedFindings` `undefined` on this path (BLOCK_SHAPE at tests/workflows/acceptance-verify.test.mjs:1011 lists both as expected on BLOCKED results).

Rationale phạm vi: AC-3 chỉ kiểm giá trị TRẢ VỀ của workflow (verdict, blocked, agent không gọi); không kiểm nội dung dòng round-tally đã ghi vào run-log.jsonl trước đó.

### staleScope silently drops eval paths when a YAML comment trails `executor:` or a `paths:` list item — fail-open in the stale-evidence gate
- file: `lib/evidence-core.cjs:672`
- severity: high
- source: bugs
- AC: AC-6

`staleScope` calls `parseEvals(text, ['executor'], s => String(s).trim())` — the normalizer trims but does NOT strip comments, even though this same commit introduced `stripComment` in lib/eval-yaml.cjs as the single source for exactly this. And `pathsOf` (lib/eval-yaml.cjs:87) applies `stripComment` only to the inline `paths: [...]` form; block-sequence items go through `unq()` (trim + strip quotes) only.

Reproduced with the real module:

  // trailing comment on executor
  - id: E1 / executor: test   # chay bang vitest / paths: [- src/**]
  - id: E2 / executor: script / paths: [- lib/**]
  staleScope(...) => ["lib/**"]        // src/** gone
  (same file without the comment)  => ["src/**","lib/**"]

  // trailing comment on a paths item
  paths:\n      - src/**            # ma san pham
  staleScope(...) => ["src/**            # ma san pham", "lib/**"]

Both outputs feed `stale_files()` in scripts/pre-merge-check.sh (line ~518, `match_globs "$f" "$_sp"`), where a glob containing a comment can never match a path. Consequence in both cases: files under `src/` change after verify, the evidence is genuinely stale, and pre-merge no longer emits the VIOLATION — it silently reports the evidence as fresh. In the first case the eval also stops being treated as machine-run, so its missing-paths check (`if (!Array.isArray(p) || !p.length) return null`) never fires, defeating the conservative fallback. This contradicts the guarantee written directly above the function and in scripts/pre-merge-check.sh ("Không có đường fail-open nào ở đây"). No evals.yaml in the repo currently has such a comment, so the hole is latent, not currently firing.

Rationale phạm vi: AC-6 kiểm staleScope/pathsOf trên các fixture paths dạng inline và block-sequence, nhưng không có fixture nào có comment cuối dòng trên executor hay trên mục paths.

### K8 scope prefix silences the whole conventions review lane on every carry round, not just the prose part
- file: `feature-loop/workflows/acceptance-verify.js:491`
- severity: medium
- source: bugs
- AC: AC-10, AC-3, AC-9

`conventionScope` (line 491) prefixes the conventions reviewer prompt with `CHI cham file CHU (.md) trong danh sach da doi so round truoc ...` whenever `args.deltaFiles` is an array — which s4-args.mjs sets for every round ≥2 launched with `--carry-anchor`. The lane's own charter (line 501) is `vi pham invariant kien truc, sai pattern co san, thieu validation o system boundary` — code concerns, not prose.

Failure scenario: round 2 of a T2/T3 feature, carry-anchor set, the fix round changed only `lib/foo.cjs` and `scripts/bar.js` and no `.md`. `deltaFiles.filter(f => /\.md$/i.test(f))` is empty, so the prompt becomes `(khong file chu nao doi — bo qua lan nay, tra findings rong)` and the reviewer is instructed to return zero findings. An architecture-invariant violation or a missing boundary validation introduced by the round-2 fix is never looked at by this lane, and the round reports clean with no BLOCKED/NOTE saying the lane was scoped out. The stated motivation in the comment is repeated prose nits (13/34 findings), which argues for excluding unchanged prose — not for excluding all code from the lane. W39 in tests/workflows/acceptance-verify.test.mjs only asserts the prompt text, so nothing flags the lost coverage.

Rationale phạm vi: Đây đúng là hành vi AC-10 yêu cầu (prompt chỉ chấm file .md trong deltaFiles khi có deltaFiles); finding phê bình chính thiết kế đã chốt trong AC-10, không phải một sai lệch so với AC.

### Negative anchor "Enter xác nhận" cannot fire — the old wording survives in signoff.md across a line wrap
- file: `tests/plugins/run-tests.sh:9909`
- severity: medium
- source: bugs
- AC: AC-4

The change converts "Enter xác nhận" from a positive anchor to a negative one in three places: `anchorsAm` (grammar block), `NEO_AM` (line 9871) and `BODY_AM` (line 9909), all doing an exact substring test `if s in t`. commands/signoff.md still carries that instruction, but soft-wrapped:

  74:  ... Chữ «Ký» vẫn phải do NGƯỜI gõ — Enter xác
  75:  nhận chỉ xác nhận danh tính, không phải chữ ký; ...

Verified: `'Enter xác nhận' in text` → False; `re.search(r'Enter xác\s+nhận', text)` → True. So `check_bodies` reports the old rule as removed while it is still in the command body, contradicting the new IDENTITY-ECHO-RULE ("GHI THẲNG ... Chỉ ca CẠN mới hỏi") three sections above it. The implementation plan (docs/superpowers/plans/2026-09-08-gom-duc-ket-2-10-0.md:146) explicitly listed "sửa dòng 69-70 «Enter xác nhận chỉ xác nhận danh tính»" as work to do, so this is a missed edit that the new guard was supposed to catch. Any future reintroduction of the rule that happens to wrap will pass the same way.

Rationale phạm vi: AC-4(a)/(e) đòi thân lệnh KHÔNG còn «Enter xác nhận»; văn bản thật trong signoff.md vẫn còn cụm này (chỉ bị wrap dòng) nên vi phạm AC-4, không riêng vấn đề đo.

### Hình dạng 6 — E5b (rang.sh --chan cay-that) đo checkout của tác giả, đỏ ở mọi cây khác
- file: `_acceptance/gom-duc-ket-2-10-0/rang.sh:51`
- severity: high
- source: measurement
- AC: AC-5

Vòng lặp dòng 40 duyệt danh sách CỨNG `"$ROOT" "$DEV/artifact-platform" "$DEV/oneflow" "$DEV/crm"` — tên các repo tiêu thụ trên máy tác giả. Cây vắng thì in `SKIP <tên>: vắng` (đúng như hợp đồng khai), NHƯNG dòng 51–54 lại thêm cửa cứng:

    if [ "$seen" -lt 2 ]; then ... exit 1

Đã kiểm sống: `rang.sh --chan cay-that --dev-root <thư mục rỗng>` → exit 1 («chỉ chấm được 1 cây»). Nghĩa là E5b (`config:executors.script.gdk_k3_cay_that`, expected «exit 0») XANH duy nhất trên máy có ≥1 trong ba repo anh em nằm cạnh kho; trên CI, trên máy người khác, hay trong worktree tách rời thì ĐỎ vì hạ tầng chứ không vì vật đang đo. Đây đúng là lớp lỗi mà gap-probe P1 tuyên đã vá («--dev-root mặc định thư mục cha, SKIP có tên, chỉ ghim W8-token = 0») — cửa `seen -lt 2` phục hồi lại đúng sự phụ thuộc đó.

Rationale phạm vi: AC-5(e) đòi rang.sh --chan cay-that mặc định thư mục cha, KHÔNG hardcode, và cây vắng chỉ in SKIP có tên (không chặn cả script); cửa `seen -lt 2 → exit 1` trực tiếp vi phạm điều này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hình dạng 4 — «chiều đỏ» của PV5 là hằng đúng, không bao giờ đỏ được**
  Người dùng thấy gì: Một bài kiểm tra nội bộ dùng để tự xác nhận rằng phép quét từ đa nghĩa hoạt động đúng thực chất không kiểm tra được điều đó — không ảnh hưởng gì tới người dùng, chỉ làm giảm độ tin cậy của chính bài kiểm tra.
  file: `tests/scripts/w6-w8-pham-vi.test.mjs`
  severity: high
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 5 — W38 tuyên ma trận 4×2 = 8 assert nhưng chỉ có điểm-case (acRef đo 1/4 finding)**
  Người dùng thấy gì: Một bài kiểm tra nội bộ tuyên bố đã kiểm đủ 8 trường hợp nhưng thực tế chỉ kiểm 5, nên một vài kịch bản gán sai vẫn có thể lọt qua mà không hệ thống nào cảnh báo.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **expected của eval mô tả phép đo KHÔNG phải phép đo đang chạy (E8b, E2/NO4)**
  Người dùng thấy gì: Tài liệu mô tả cách đo hai số liệu (bảng số liệu mốc và kiểm tra ký tự màu) không khớp với thứ máy thực sự đang đo, khiến người đọc tin nhầm phạm vi đã được kiểm chứng rộng hơn thực tế.
  file: `_acceptance/gom-duc-ket-2-10-0/evals.yaml`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 3 — S5D2 tuyên «một nguồn (deepEqual)» nhưng bộ rút ghim sẵn đúng bốn giá trị kỳ vọng**
  Người dùng thấy gì: Bài kiểm tra đối chiếu cấu hình mặc định chỉ phát hiện được một chiều lệch (thiếu giá trị), nên nếu sau này ai thêm giá trị mới vào cấu hình mà quên cập nhật tài liệu, sai lệch đó sẽ không bị phát hiện.
  file: `tests/scripts/s5-ship-default.test.mjs`
  severity: medium
  Tác hại: measure
  Đề xuất: known-limits

- **Hình dạng 4 — «chiều đỏ của phép quét» ở NO4 không chạy phép quét**
  Người dùng thấy gì: Một bài kiểm tra nội bộ dùng để chứng minh phép quét ký tự màu bắt được lỗi thực tế không chạy đúng phép quét đó, nên có nguy cơ bỏ sót vài kiểu viết code khác nhau mà không ai biết.
  file: `tests/scripts/lnt-no.test.mjs`
  severity: low
  Tác hại: measure
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
