## Trong hợp đồng

### Prompt hội đồng cấm đúng những thứ nằm trong danh sách inputs đã khai
file: `feature-loop/workflows/acceptance-verify.js:403`
severity: high
AC: AC-10
source: conventions

Câu allowlist mới ghi: "KHONG duoc doc file nao khac trong repo: contract.md, evals.yaml, design doc, source code deu NGOAI danh sach" — rồi ngay dòng sau in "Input: <inputs đã resolve>". Nhưng inputs THẬT của kit chính là những loại đó: quét _acceptance/*/evals.yaml thấy judgment eval đang khai `docs/superpowers/specs/*-design.md` (≥6 lượt), `feature-loop/scripts/claim-scan.mjs`, `lib/md-section.js`, `scripts/gate-card.js`, `commands/start.md`, và `contract.md` — và chính ví dụ chuẩn trong skills/acceptance/references/eval-executors.md là `inputs: [contract.md, evidence/E3-step3.png]`. Judge nhận hai chỉ dẫn ngược nhau về CÙNG một file. Kịch bản fail: judge tuân câu cấm (viết mạnh hơn, có chữ TUYET DOI), từ chối mở design doc đang là input duy nhất của mình, rồi trả UNCERTAIN đúng theo hướng dẫn "thiếu căn cứ → UNCERTAIN" — panel im lặng rơi về người ở mọi round. Notes của contract đã khai sửa feature-loop/workflows/ sẽ stale-cascade TOÀN BỘ workspace cũ, nên toàn bộ 18 workspace re-verify sẽ đi qua prompt này. Test W-G7 chỉ grep sự CÓ MẶT của câu cấm, không có ca nào đo eval khai input là design doc/source — nên lớp này xanh mà vẫn hỏng. Sửa: cấm theo QUAN HỆ ("ngoài danh sách Input dưới đây") thay vì liệt kê loại file, hoặc bỏ hẳn phần liệt kê loại.

AC-10 hỏi đích danh liệu câu chữ prompt có làm hội đồng viên hiểu rõ chỉ được đọc input đã liệt kê hay để ngỏ đường tự cứu/mâu thuẫn — finding chứng minh câu chữ tự mâu thuẫn với chính danh sách input.

### Phép đo tồn kho yếu hơn chính guard nó đo (field mảng chỉ kiểm có-khoá)
file: `tests/workflows/acceptance-verify.test.mjs:963`
severity: medium
AC: AC-14
source: conventions

Guard thật dùng `badStrArray` = phải là mảng, KHÔNG rỗng, KHÔNG có phần tử blank (acceptance-verify.js:250). Scan của W-G8 cho cùng field đó chỉ làm `if (!e._k.has(fl))` — chỉ kiểm khoá có mặt. Ngoài ra `parseEvals` là parser YAML viết tay thứ hai (regex `^\s{2,}([a-z_]+):\s*(.*)$`) không phải đường đọc mà main loop dùng để dựng args, nên block scalar (`question: >`) sẽ cho chuỗi rỗng. Kịch bản fail: một evals.yaml khai `steps:` rỗng hoặc `steps: []` → scan báo XANH ("0 eval bị chặn cứng"), nhưng lần chạy S4 thật trả BLOCKED. Phép đo được dựng riêng để chống lớp lỗi này lại tự để lọt nó — hình dạng (3) trong 4 hình dạng CLAUDE.md ghi (bên VIẾT và bên ĐỌC trôi khỏi nhau vì test tự dựng đường đọc riêng). Sửa: dùng đúng hai predicate `isBlankStr`/`badStrArray` rút từ marker, đừng viết lại luật trong test.

AC-14 yêu cầu phép đo dùng ĐÚNG bảng field bắt buộc rút từ marker trong script, không chép tay sang test — finding cho thấy phép đo tự viết lại luật kiểm mảng, yếu hơn guard thật.

### Judge prompt names its own declared inputs as forbidden (contract.md / design doc)
file: `feature-loop/workflows/acceptance-verify.js:403`
severity: high
AC: AC-10
source: bugs

The new allowlist sentence is stated absolutely: "CHI duoc doc dung cac input sau ... KHONG duoc doc file nao khac trong repo: contract.md, evals.yaml, design doc, source code deu NGOAI danh sach." It has no "trừ khi đã liệt kê ở trên" carve-out, and it is emitted BEFORE the `Input:` line, so the categorical ban and the allowlist contradict each other whenever a declared input happens to be one of the named file kinds.

This is not hypothetical: _acceptance/cross-feature-claim-index/evals.yaml:118-121 declares E10 with `inputs: [../../docs/superpowers/specs/2026-07-29-cross-feature-claim-index-design.md, contract.md]`, and E11 (line 130) has a design doc as its ONLY input. The rendered prompt for E10 reads "design doc, contract.md are OUTSIDE the list" and then lists exactly those two files as the list. Most judgment evals in this repo use a design doc as the sole input.

Failure scenario: a judge follows the ban, refuses to open its only input, and — per the very next paragraph ("Thay danh sach tren KHONG du can cu ... la ly do tra UNCERTAIN") — returns UNCERTAIN with a rationale that sounds legitimate. Panel proposal becomes UNCERTAIN, verdict routes PENDING-JUDGMENT, and every judgment criterion silently degrades to "human must decide" with no signal that the prompt, not the evidence, was the cause. The dump the feature itself ships (_acceptance/judgment-question-guard/evidence/judge-prompt.txt line 4-5) shows the exact rendering. Fix: scope the ban to "anything not listed below", and drop the enumeration of file kinds, or make it explicitly conditional ("contract.md/evals.yaml/design doc are out of scope UNLESS they appear in the Input list").

Cùng chủ đề AC-10 (rõ ràng của prompt về danh sách input được phép đọc) — finding này là bằng chứng cụ thể kèm ví dụ thật từ workspace khác cho cùng lỗi mâu thuẫn.

### Guard crashes with TypeError instead of BLOCKED for Object.prototype-named executors
file: `feature-loop/workflows/acceptance-verify.js:259`
severity: medium
AC: AC-4
source: bugs

`const spec = typeof e.executor === 'string' ? EVAL_REQUIRED[e.executor] : null` looks the executor up on an object literal, so inherited prototype keys resolve truthy. `EVAL_REQUIRED['constructor']` returns the Object constructor, `EVAL_REQUIRED['__proto__']` returns Object.prototype, likewise 'toString' / 'hasOwnProperty' / 'valueOf'. The `if (!spec)` fail-loud branch is skipped, then `for (const f of spec.str)` throws.

Verified by execution against the real workflow through tests/workflows/harness.mjs: an eval `{id:'EX', criterion:'AC-9', executor:'constructor', question:'q'}` produces `THREW: spec.str is not iterable` (same for `__proto__`, `toString`, `hasOwnProperty`) instead of the intended `verdict: 'BLOCKED'` with a `blocked[].reason` naming the eval. This is precisely the "executor lạ" case the guard was added for, and the crash bypasses the BLOCKED result shape the feature-loop SKILL routes on (SKILL.md step 3: read `blocked[].cmd` + `reason`, show verbatim to the user), so the round dies with an opaque harness error rather than a user-actionable message. Fix: `Object.prototype.hasOwnProperty.call(EVAL_REQUIRED, e.executor)` (or build the table with `Object.create(null)` / a `Map`).

AC-4 yêu cầu mọi executor không thuộc 4 loại hợp lệ phải trả BLOCKED nêu tên eval + giá trị lạ, không được bỏ rơi im lặng — finding cho thấy một số giá trị executor (constructor, __proto__...) làm chương trình crash thay vì BLOCKED, vi phạm trực tiếp.

### All-ungrounded judgment round BLOCKs with a reason that denies the judgments exist
file: `feature-loop/workflows/acceptance-verify.js:356`
severity: medium
AC: AC-9
source: bugs

The "nothing to verify" check at line ~352 uses `freshJudgmentEvals`, which the new code now strips of every ungrounded (no-`inputs`) judgment eval. So a workspace whose judgment evals all lack `inputs`, with no machine/ui evals and empty `suiteCommands`, falls into the BLOCKED branch and reports: "evals.yaml khong co eval may va khong co judgment — khong co gi de verify, kiem tra lai evals.yaml".

Verified by execution: args with `evals: [{id:'J1', criterion:'AC-1', executor:'judgment', question:'q'}]` and `suiteCommands: []` returns `BLOCKED` with exactly that reason. The message is factually false (there IS a judgment eval) and points the user at the wrong file/edit, and it contradicts the design intent stated in the new comment block at line ~293 — ungrounded judgments are supposed to produce a mechanical UNCERTAIN panel and route PENDING-JUDGMENT so a human decides at Gate 2, which is exactly the read-old path claimed for already-signed workspaces (gate-card-ac-visibility E11/E12). Either count ungrounded judgments as "something to route to a human" here, or keep BLOCKED but say why ("N judgment eval không khai input và không có eval máy/suite nào").

AC-9 yêu cầu judgment eval thiếu inputs phải rơi vào UNCERTAIN/PENDING-JUDGMENT chứ không phải BLOCKED — finding cho thấy khi TẤT CẢ eval đều là judgment thiếu inputs, hệ thống lại rơi vào BLOCKED với lý do sai, trái ngay yêu cầu AC-9.

### Inventory scan checks array fields weaker than the guard it claims to measure
file: `tests/workflows/acceptance-verify.test.mjs:963`
severity: low
AC: AC-14
source: bugs

W-G8 asserts "0 eval bi chan cung tren ton kho that" by replaying the marker-extracted EVAL_REQUIRED table, but for `spec.arr` fields it only tests key presence: `if (!e._k.has(fl)) hard.push(...)`. The runtime guard is strictly stronger — `badStrArray` rejects a non-array, an EMPTY array, and any blank/non-string element.

Failure scenario: a consumer workspace declares `steps:` with an empty list (or a list whose items parse to blanks) on a ui-check eval. The inventory scan reports it green, so the "real inventory passes the guard" claim holds while the actual round would return BLOCKED. The gap is unexercised today only because the repo currently has no ui-check evals in `_acceptance/*/evals.yaml`, so the `spec.arr` leg of the scan never fires against a real eval — the assertion is green without ever having been tested. Make the scan reuse the same `badStrArray` semantics (or extract the predicate alongside the table inside the marker so both sides cannot drift).

Cùng lỗi với finding tồn kho ở trên — phép đo AC-14 không dùng đúng predicate thật của guard cho field mảng, nên không đo đúng những gì AC-14 cam kết đo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Thông điệp guard nói sai lý do cho phần tử inputs toàn khoảng trắng**
  Người dùng thấy gì: Khi một mục input chỉ có khoảng trắng, thông báo lỗi nói sai nguyên nhân (báo 'không phải chuỗi' thay vì 'bị để trống'), khiến người sửa tìm nhầm chỗ và mất thời gian sửa đúng file.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Guard message misidentifies blank-string inputs as non-string elements**
  Người dùng thấy gì: Khi một mục input chỉ có khoảng trắng, thông báo lỗi nói sai nguyên nhân (báo 'không phải chuỗi' thay vì 'bị để trống'), khiến người sửa tìm nhầm chỗ và mất thời gian sửa đúng file.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có finding nào trong nhóm này ở round này.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
