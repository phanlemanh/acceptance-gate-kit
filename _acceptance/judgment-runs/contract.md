---
schema_version: 2
feature: "Field khai trên eval mà máy không dùng phải được nêu đích danh, không bỏ im lặng"
slug: judgment-runs
risk_tier: T3
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-04T01:18:27Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-04-judgment-runs-design.md
time_human_minutes:
  gate1: 5
---

# Acceptance contract — judgment-runs

Bối cảnh: S4 round 3 của `motion-floor` phát hiện `runs: 3` trên eval
`executor: judgment` không có tác dụng nào — panel vẫn đúng 1 lần mỗi lens, và
`evidence-report.md` ghi `## Variance: "none — no eval in this round carries
runs > 1"` trong khi `evals.yaml` khai `runs: 3`.

Khảo sát cho thấy việc bỏ qua là **có chủ ý và có ghi**:
`skills/acceptance/references/eval-executors.md:67` nói *"`runs` is ignored on
`ui-check`/`judgment` (judgment already runs a 3-lens panel)"*. Lỗi thật nằm ở
chỗ khác: (1) ba chỗ mô tả field bằng chữ "eval ngẫu nhiên (LLM)" không nêu giới
hạn executor, nên người viết eval hiểu ngược — **10/10 lượt dùng `runs` trong
repo đều nằm trên judgment**; (2) không mặt nào của máy chịu nói ra, kể cả mặt
người ký buộc phải đọc; (3) quét lớp tìm ra **thành viên thứ hai cùng hình dạng**:
`paths` trên judgment (2 lượt, `gate-card-ac-visibility` E11/E12) cũng chết câm vì
P1 carry-forward lọc `executor !== 'judgment'`.

Đường đã chọn: **nói ra ở mọi mặt người đọc, không chặn** — máy không chạy N panel
và không BLOCKED, nhưng không chỗ nào im lặng nữa. Lý do từ chối hai đường kia ở
design doc §"Ba đường"; điểm quyết định là `runs>1` và P3 carry-forward phát biểu
hai luật NGƯỢC NHAU trên cùng một điều kiện (inputs không đổi).

## Criteria

- AC-1: Given args S4 có eval `executor: judgment` mang `runs: 3`, When chạy
  `acceptance-verify.js`, Then `result.inertFields` chứa đúng một mục nêu **đích
  danh** `evalId`, `field: "runs"`, `value: 3`, `executor: "judgment"` và một
  `reason` giải thích panel 3-lens đã là cơ chế hấp thụ nhiễu; và đối chứng dương:
  cùng eval đó bỏ `runs` đi thì `result.inertFields` RỖNG.

- AC-2: Given args S4 có eval `executor: judgment` mang `paths: [...]`, When chạy
  `acceptance-verify.js`, Then `result.inertFields` chứa mục nêu đích danh field
  `paths` cho eval đó — thành viên thứ hai của lớp lỗi phải được bắt bởi CÙNG một
  luật, không phải một nhánh riêng; và đối chứng dương: cùng eval bỏ `paths` đi thì
  không sinh mục nào.

- AC-3: Given eval `executor: test` hoặc `script` mang `runs: 3`, và eval
  `test`/`script`/`ui-check` mang `paths`, When chạy `acceptance-verify.js`, Then
  `result.inertFields` KHÔNG chứa mục nào cho các eval đó (nửa-không-được-bắn:
  field ở đúng chỗ của nó là hợp lệ), và `runs: 3` trên `test` vẫn giữ nguyên hành
  vi cũ — lệnh đó chạy 3 lần.

- AC-4: Given eval `executor: ui-check` mang `runs: 3`, When chạy
  `acceptance-verify.js`, Then `result.inertFields` chứa mục cho eval đó — ô này
  inert theo cùng một luật (mã hardcode `runs: 1` cho ui-check) dù repo hiện chưa
  có consumer nào; và đối chứng dương như AC-1.

- AC-5: Given round có `inertFields` không rỗng, When script gọi agent
  `synthesize:report`, Then prompt chứa **câu `inertNote` do JS tính sẵn** (nêu đích
  danh evalId + field + lý do) kèm chỉ dẫn **chép NGUYÊN VĂN** vào `## Variance` —
  cùng khuôn literal đang dùng cho `verified_commit` ("synthesizer chỉ chép, không
  tự suy diễn"), vì hôm nay `runs` bị strip khỏi định nghĩa eval ở prompt nên
  synthesizer *không thể* biết; và đối chứng dương: round không có eval inert nào
  thì prompt KHÔNG chứa `inertNote` lẫn chỉ dẫn đó.

- AC-6: Given `inertFields` không rỗng, When script chạy, Then có đúng một dòng
  `log()` nêu số lượng và tên field/eval — người theo dõi `/workflows` thấy ngay
  trong lượt chạy, không phải đợi report.

- AC-7: Given luật "ô nào inert" cần đổi (thêm/bớt một ô), When đọc
  `acceptance-verify.js`, Then luật nằm ở **đúng một chỗ có marker**
  `<<<INERT-FIELD-TABLE` … `INERT-FIELD-TABLE>>>` khai từng cặp (field, executor)
  kèm lý do, và eval rút được bảng đó **bằng marker** rồi đối chiếu với hành vi
  thật của hàm — không chép tay bảng vào test.

- AC-8: Given ba chỗ mô tả `runs` hiện mâu thuẫn với `eval-executors.md`
  (`acceptance-verify.js:23`, `feature-loop/skills/feature-loop/SKILL.md:130`,
  `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:383`), When đọc lại
  sau khi sửa, Then cả ba đều nêu rõ `runs` chỉ có hiệu lực trên `test`/`script`;
  và đối chứng dương: phép đo này phải ĐỎ trên cây trước khi sửa.

- AC-9: Given 12 eval ở 6 workspace đã ký đang mang `runs`/`paths` trên judgment,
  When chạy S4 trên bất kỳ workspace nào trong số đó, Then verdict KHÔNG bị hạ
  xuống BLOCKED/REJECT vì field inert — đường đọc-cũ giữ nguyên, field inert chỉ
  sinh cảnh báo có tên. Phép đo phải quét ra **cả hai hình dạng** (≥1 eval mang
  `runs`, ≥1 eval mang `paths`) — counter chỉ đếm tổng sẽ xanh khi regex sót một
  hình dạng; và phải có đối chứng dương chứng minh nó biết đỏ.

- AC-10: Given `result.inertFields` không rỗng, When đọc bước "Mọi verdict" của S4
  trong **cả hai harness** (`feature-loop/skills/feature-loop/SKILL.md` và
  `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`), Then mỗi bên buộc
  main loop đưa `inertFields` vào gói Cổng 2 bằng ngôn ngữ sản phẩm — cùng luật
  minh bạch đang áp cho `carried`, không được nén vào phần "máy đã lo".

- AC-11: Given nguồn `feature-loop/`, `skills/`, `scripts/` vừa đổi, When chạy
  `scripts/sync-plugin-packages.sh --check`, Then mirror `plugins/` khớp nguồn —
  sửa nguồn mà quên sync là drift bị chặn.

- AC-12: **ROUND-TRIP writer → reader.** Given `inertNote` do
  `acceptance-verify.js` sinh ra (bên VIẾT), When đưa nguyên văn câu đó vào mục
  `## Variance` của một `evidence-report.md` fixture rồi chạy `scripts/gate-card.js`
  (bên ĐỌC) trên workspace fixture, Then thẻ Cổng 2 hiện **một cờ nêu đúng bản
  chất** "field khai mà máy không dùng", KHÔNG dùng nhãn "eval ngẫu nhiên
  (pass-rate hỗn hợp)" của cờ phương-sai; và `inertNote` **không được bắt đầu bằng
  chữ "none"** — reader hiện tại lọc `/^none/i` nên câu bắt đầu bằng "none" bị nuốt
  và sự im lặng tái diễn ở đúng mặt người ký. Đối chứng dương bắt buộc: cùng
  fixture với `## Variance` = "none — …" thì KHÔNG cờ nào bắn. Fixture do code sinh
  trong chính lần chạy, câu literal RÚT từ writer (không chép tay).

- AC-13: Given `inertFields` không rỗng, When script trả `runLog`, Then có một dòng
  `kind: "inert"` ghi round + danh sách (evalId, field, executor) — bản ghi bền
  vững cùng khuôn với dòng `kind: "panel"`/`"baseline"` đang có; dòng không mang
  `run_id` nên `loadRunLogIds` bỏ qua, consumer cũ không vỡ. Đối chứng dương:
  round không eval inert → không dòng `kind: "inert"` nào.

## Coverage

Từ morphological-scan (3 trục — thước CE trong ngoặc):

- **A — field khai** (CE: **hợp** của bên VIẾT = 225 eval thật đếm bằng máy trên 18
  workspace, và bên ĐỌC = args contract `acceptance-verify.js:14-47`; liệt kê một
  phía là sót theo thiết kế): `runs` → AC-1, AC-3, AC-4 · `paths` → AC-2, AC-3 ·
  `question`/`inputs`/`steps`/`expected`/`notes` → Out of scope có tên (0 lượt dùng
  sai trong 225 eval)
- **B — executor nhận** (CE: enum đóng do `eval-executors.md` định nghĩa):
  `judgment` → AC-1, AC-2 · `ui-check` → AC-4 · `test`/`script` → AC-3
  (nửa-không-được-bắn)
- **C — mặt phải nói ra** (CE: các mặt một round S4 THẬT sinh ra — `result` object
  `acceptance-verify.js:700-725` + template evidence + đường đọc thật của
  `scripts/gate-card.js:373`, đối chiếu round 1-3 có thật của motion-floor):
  `result` → AC-1 · `log()` → AC-6 · `## Variance` (literal writer) → AC-5 ·
  **thẻ Cổng 2 (reader) → AC-12** · **`run-log.jsonl` → AC-13** · bước SKILL hai
  harness → AC-10 · doc/spec → AC-8 · mirror → AC-11.
  **Không ô nào của trục C bỏ trống** — 6/6 mặt có AC.

**Tự chứng minh (dogfood):** eval `E10` của chính workspace này CỐ Ý mang
`runs: 3`. Nhờ vậy round S4 của feature này có `inertFields` khác rỗng, và
`## Variance` trong chính `evidence-report.md` của nó phải nêu đích danh E10 —
người ký nhìn thấy hành vi mới trên vật thật ngay tại Cổng 2, thay vì tin lời
bản mô tả. Không có mẹo này thì mọi round của workspace này chạy đường
`inertFields` rỗng và nhánh mới **chưa từng chạy một lần nào** trước khi ký.

Cross-cutting áp mọi AC: đối chứng dương trước khi tin màu đỏ; ghim **đúng thông
điệp** chứ không chỉ mã thoát; fixture do code sinh trong chính lần chạy; luật đặt
một chỗ có marker rồi kiểm bằng round-trip (AC-7), không chép tay.

## Out of scope

- **Chạy N panel độc lập cho judgment (đường (a))** — `runs>1` và P3 carry-forward
  phát biểu hai luật ngược nhau trên cùng điều kiện "inputs không đổi"; phải giải
  mâu thuẫn đó trước, và nó xứng một contract riêng. Xem ledger.
- **Từ chối cứng `runs>1` trên judgment (đường (b))** — phá 12 eval ở 6 workspace đã
  ký, đúng hình dạng "bắt consumer migrate hàng loạt" mà CLAUDE.md cấm.
- **Allowlist đóng cho mọi key lạ trong `evals.yaml`** — không gian mở; allowlist biến
  fail-loud thành fail-silent cho đúng thứ nằm ngoài danh sách.
- **Sửa `evals.yaml` của 6 workspace đã ký** — cấm bởi luật đường-đọc-cũ.
- **Thêm `feature-loop/workflows/**` vào `risk_tiers.t3_paths`** — phát hiện thật ở
  S0 (đường dẫn này là lõi cưỡng chế nhưng máy derive ra T2), trình ở Cổng 1 để chủ
  repo quyết; không phải việc của contract này.
- **Đổi nhãn cờ phương-sai sẵn có của `gate-card.js`** — AC-12 chỉ đòi cờ MỚI cho
  field-inert nêu đúng bản chất; cờ "eval ngẫu nhiên (pass-rate hỗn hợp)" đang phục
  vụ ca thật của nó, không đụng.
- **`expected` không tới tay judge; `notes` chưa có trong spec** — Later của scan.

## Notes

(chưa có)
