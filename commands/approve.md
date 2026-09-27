---
description: Record the Gate 1 decision (phê duyệt Cổng 1) — render the decision card, ask exactly one question, write approved_by/approved_at only on an explicit human YES; with `đáng: <lối>` it records the Cổng Đáng decision instead. Never approves on its own.
disable-model-invocation: true
---

Record the human's Gate 1 decision for a feature. `/acceptance-gate:acceptance-card` is the
presentation layer; THIS command is the decision verb — it walks the approval
moment and writes the real gate fields. It decides nothing itself: an explicit
human YES in chat is the only trigger, and the PreToolUse hook re-validates
every transition it writes.

Cờ: `--repo <path>` (gốc kho) và `--as "<tên>"` (khai danh tính thay cho
suy máy — ca máy dùng chung). Arg: optional `<slug>`. Without it, scan `_acceptance/*/contract.md` for
`status: draft`:
- exactly one → use it — hồ-sơ là điều máy biết: đúng MỘT ứng viên thì
  KHÔNG hỏi, chỉ hiển thị lại tên hồ sơ trong cùng lượt trả lời;
- several → print a slug table and ask which;
- none → nothing awaits Gate 1 — say so and point to `/acceptance-gate:acceptance-status`.
  (Plan approval — Gate 1.5 — lives in the feature-loop. Do not fake it here.)

Một-lượt-gõ + `--repo` (điều khoản chung, chép nguyên văn từ bản luật):

Ba lệnh có-câu-hỏi (`/acceptance-gate:approve` · `/acceptance-gate:signoff` · `/acceptance-gate:start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người.

Ví dụ một lượt gõ — trần (máy gánh phần còn lại) và đầy đủ (kiểu cũ,
vẫn chạy nguyên):
`/acceptance-gate:approve duyệt`
`/acceptance-gate:approve abc-xyz --repo /duong/dan/repo duyệt: Manh Phan`

Câu gộp của lệnh này trả lời chỗ trống «duyệt hay sửa: ___» mà thẻ Cổng 1
dạy — ngữ pháp đầy đủ ở khối `GATE-ONESHOT-GRAMMAR`. Người chỉ khai QUYẾT
ĐỊNH; danh tính và ngày là điều máy biết:
- `duyệt[: <tên> [<ngày>]]` → chính là câu YES tường minh của bước 5:
  `<tên>` → `approved_by`; vắng tên → máy TỰ SUY, bốn luật tách bạch của
  `GATE-ONESHOT-GRAMMAR`: **ĐỌC** cả `git config user.name` lẫn
  `signoff.approvers`
  (không điều kiện nào chặn việc đọc — đây là hai nguồn đối chiếu; bậc
  thang chọn GIÁ TRỊ, không chọn thứ được ĐỌC);
  **CHỌN** giá trị ở nấc cao nhất còn tên: `--as "<tên>"`
  → `git config user.name` (gốc lệnh đang chạy — chữ ký thuộc NGƯỜI ĐANG
  GÕ) → `signoff.approvers` khi danh sách đúng một tên; **KHÔNG CẢNH BÁO** khi
  tên sắp ghi không có trong `signoff.approvers` — danh sách đó là thông tin,
  không phải cưỡng chế (16/22 kho có nó lệch `git config user.name` của chính
  chủ, nên cảnh báo thành nhiễu nền); `approvers` giữ vai NẤC CUỐI khi hai nấc
  trên trống; **CẠN** (mọi nấc trống, hoặc chỉ còn danh sách nhiều
  tên) → hỏi tên đúng một câu, có danh sách thì LIỆT ra để người chọn một
<!-- <<<IDENTITY-ECHO-RULE -->
Suy xong ở BẤT KỲ nấc nào còn tên → GHI THẲNG rồi hiển thị lại một dòng «với danh tính: <tên> <ngày> (từ <nguồn suy>)». Hai nguồn khớp hay lệch đều KHÔNG nói gì về ai đang gõ — xuất xứ thật là tác giả commit — nên lượt chờ không thêm bảo đảm nào, chỉ thêm một chạm; đo 08/09: 8 lần hỏi, 5 lần xác nhận suông, 2 lần sửa thành đúng giá trị đã có sẵn trong `signoff.approvers`. Người sửa tên hoặc ngày bằng MỘT CÂU bất kỳ lúc nào sau đó, máy ghi lại cùng lượt. Chỉ ca CẠN mới hỏi.
<!-- IDENTITY-ECHO-RULE>>> -->
  Mọi trả lời MANG NGHĨA KHẲNG ĐỊNH là xác nhận, dài hay ngắn, kể cả tin
  nhắn trống; chỉ trả lời nêu tên hoặc ngày khác mới là sửa danh tính (sửa
  được cả tên lẫn ngày ở cùng dòng đó). Người tự khai phần nào thì phần đó ghi thẳng; phần máy suy vẫn hiện
  trong dòng xác nhận, khai đủ thì không hỏi. **Máy KHÔNG hỏi và KHÔNG ghi số
  phút.** Vế `, phút <số>` ở cuối câu vẫn ĐƯỢC CHẤP NHẬN và BỎ QUA lặng — không
  lỗi, không ghi, không hỏi lại: người quen tay gõ nó theo phản xạ thì câu vẫn
  chạy trọn. Đừng biến nó thành lỗi cú pháp; cắt một thói quen không được phép
  chặn đúng cái người đang làm.
- `sửa: <điều cần đổi>` → bước 4 với đúng nội dung đó (vẫn là Gate 1).
- `đáng: <lối>[: <tên> [<ngày>]]` → KHÔNG phải Gate 1: đây là chữ ký Cổng Đáng,
  đi mục «Cổng Đáng» cuối file. Danh tính và ngày theo đúng bậc thang ở trên.
- Ngày người nêu — trong câu gộp hoặc ở dòng xác nhận — LUÔN thắng ngày máy
  suy, và đó là giá trị ghi vào `approved_at`.
- Đuôi tự do sau các nhãn nhận ra được → GIỮ NGUYÊN VĂN, ghi vào sổ quyết
  định; phần mơ hồ → luật khuyến-nghị-trước của `GATE-ONESHOT-GRAMMAR`:
  nêu cách hiểu khả dĩ nhất kèm căn cứ trích từ hồ sơ + xin xác nhận một
  chạm; chỉ hỏi mở khi không có cách hiểu trội hơn hoặc
  hiểu-sai-thì-đắt-khó-đảo.
Với `--repo <path>`: render thẻ bằng `--root <path>`, sửa file dưới
`<path>/_acceptance/…` (hook write-time vẫn cắn theo mẫu đường dẫn), và
commit Cổng 1 bằng `git -C <path>`. Mọi đoạn lệnh in ở các bước dưới viết
gốc là `.` (thư mục hiện tại) — có `--repo` thì mọi đoạn lệnh đổi gốc sang
`<path>`: đối số `.` thành `<path>`, `--root .` thành `--root <path>`,
đường dẫn tương đối tới script thành `<path>/scripts/…`, và mọi lệnh git
thành `git -C <path> …` (giữ nguyên đường dẫn tương đối SAU `-C`).

Steps:

1. **Preconditions.** `contract.md` + `evals.yaml` exist (missing → run the
   acceptance skill Phase 1–2 first, then return). `status` must be `draft`.
   Already `approved` or later → show `status`, `approved_by`, `approved_at`
   and stop: re-approval only happens when the user explicitly reopens the
   contract, and the hook re-validates that path.
   **Thứ tự cổng Đáng → Phạm vi:** chạy
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/start-scan.mjs --root .` và tìm slug trong
   `groups.gates[]`. Phần tử mang `gate: dang` → việc này CHƯA qua Cổng Đáng (ô
   cơ hội chưa ai quyết): KHÔNG duyệt Gate 1, KHÔNG ghi gì vào hợp đồng — nói
   một dòng «Việc này chưa qua Cổng Đáng» rồi đi THẲNG bước 1 của mục «Cổng Đáng»
   cuối file (trình đề bài + ngưỡng, hỏi đúng MỘT câu: lối nào) trong CÙNG lượt.
   ĐỪNG chỉ in dòng lệnh `/acceptance-gate:approve <slug> đáng: ___` rồi dừng:
   một lượt trả về mà không mang quyết định nào là trạm thu phí. Người chọn lối →
   ghi theo mục đó; lối là làm/lặp và hồ sơ có hợp đồng → tiếp bước 2 của Gate 1
   ngay trong lượt kế, không bắt người gõ lại lệnh. Hỏi bộ quét, đừng tự đọc ô cơ hội: luật
   «ô còn chờ Cổng Đáng» sống MỘT chỗ (`lib/workspace-record.cjs`) và bộ quét
   là bộ phân ô duy nhất.
2. **Present.** Render the decision card — `/acceptance-gate:acceptance-card <slug>` — unless
   it was just rendered this session. Attach the deep-review package: the full
   `contract.md` verbatim + the AC → eval → executor mapping table. Run the
   advisory coverage lint (`${CLAUDE_PLUGIN_ROOT}/scripts/eval-coverage-lint.js`
   — same plugin as this command, no cache glob)
   and surface its W1/W3 warnings — advisory only, the human decides.
3. **Ask EXACTLY ONE question:** approve, or what should change? — SKIP this
   step entirely when the human already typed a one-shot answer (`duyệt…` /
   `sửa: …`): that sentence IS the answer to this question, and asking it
   again is the two-turn gate this grammar exists to remove. The identity
   line «với danh tính: … (từ <nguồn suy>)» is NOT a question at all: the
   machine WRITES the value it inferred and says so; the human corrects it
   later in one sentence if it is wrong.
4. **Edits requested** → apply them to `contract.md`/`evals.yaml` (pre-approval
   artifacts are agent-editable), re-render the card, ask again. Still Gate 1.
5. **On an explicit YES only:**
   - `approved_by` and the date: apply the identity rules declared ONCE at
     the top of this file (ĐỌC / CHỌN / CẠN + the identity echo)
     — do not restate or re-derive them here, that duplicate is exactly how
     the two copies drifted apart before. Never guess beyond the ladder;
     never write an agent's name. The confirm covers IDENTITY only — the
     decision was the human's explicit YES above.
   - Edit the contract frontmatter — `status: approved`, `approved_by`,
     `approved_at` — via your file-edit tool so the write-time hook
     validates the transition. `approved_at` is the run date the machine
     wrote, unless the human named a different date on the confirm line —
     a date the human states there WINS and is what gets written.
   - If `_acceptance/<slug>/decisions.jsonl` exists (feature-loop), append the
     seal entry `{"id":"d-<UTC>-<n>","type":"seal","gate":1,"at":"<ISO>"}` in the
     same write-batch as `approved_by` — id from the `DEC-ID-RECIPE` block of the
     feature-loop SKILL (`<n>` = the new line's number in the ledger; expand it
     afresh per appended line, never reuse one id variable for several lines).
   - Regenerate the product map — but FIRST check the repo opted in: read
     `risk_tiers.t1_skip_globs` in `_acceptance/config.yaml`. If `PRODUCT-MAP.md`
     is NOT listed, this repo was initialised before acceptance-gate 1.31.0 —
     **SKIP the regen**, do NOT add the map to the commit, and print this
     note instead, then carry on:

     > Bản đồ sản phẩm chưa bật cho repo này. Bật bằng hai dòng trong
     > `_acceptance/config.yaml`: thêm `- "PRODUCT-MAP.md"` vào
     > `risk_tiers.t1_skip_globs`, và `product_map: "node
     > ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root . --check"` vào
     > `executors.script` — rồi chạy executor đó trong CI. Thiếu miễn trừ thì
     > chính commit chữ ký này làm bằng chứng stale và chặn merge (ADR 0007).

     Listed → run `node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root .`
     AFTER the gate fields are written, and include `PRODUCT-MAP.md` in the
     commit below. The map is a view over the workshop's records, and a human
     closing a gate is exactly when those records change; CI's `--check` turns
     any drift red.
   - Offer ONE commit: contract + evals (+ design doc when present) — the
     Gate-1 record. Add `PRODUCT-MAP.md` to that commit ONLY if you regenerated
     it above; a repo that has not opted in has no such file, and naming it in
     `git add` fails the whole command mid-ritual.
6. **Bước kế — in ra, đừng để người tự đoán.** Sau khi commit, in đúng một
   dòng: «Đã duyệt phạm vi. Bước kế: máy lập kế hoạch thi công (S2) rồi viết
   code — không có chốt nào cần anh ở đoạn đó. Vòng chạy tiếp bằng
   `/feature-loop:feature-loop <slug>`.» Đường `/acceptance-gate:start` → chọn
   cổng → thẻ → ký dừng ở đây nếu không nói ra động từ kế tiếp.
7. **"Not now" / rejected** → the contract stays `draft`; capture the reason in
   chat; write nothing to gate fields.

Never:
- approve from silence, a timeout, or your own judgment;
- offer gate-skipping here — `gate1_skipped: true` stays a chat-explicit,
  audited escape hatch, deliberately outside this command;
- touch `human_signoff` or any Gate-2 field (that is `/acceptance-gate:signoff`).

## Cổng Đáng — câu gộp `đáng: <lối>`

Cổng Đáng dùng CHÍNH lệnh này — không có lệnh thứ tám: khoá model-invocation
(ADR 0002) đã phủ lệnh duyệt, và người chỉ cần nhớ một động từ quyết định.
Chế độ này KHÔNG đi bước 1–7 ở trên (hồ sơ có thể chưa có hợp đồng); nó chỉ ghi
ô cơ hội. Vắng `<slug>` → hồ sơ là phần tử `gate: dang` của bộ quét
(`start-scan.mjs --root .`): đúng một → dùng nó và hiển thị lại tên; nhiều → liệt
tên để người chọn; không có → nói không có việc nào chờ Cổng Đáng rồi dừng.

Bốn lối ra — danh sách ĐÓNG, rút được bằng máy; bên phải là giá trị ghi vào
`decision`. Nguồn của bảng là bộ ghi (`ky-cong-dang.mjs --loi-ra`); ca CD6 so
khối dưới với nó bằng nhau, lệch một dòng là đỏ:

<!-- <<<G0-LOI-RA
làm -> build
lặp -> iterate
xếp lại -> park
dừng -> kill
G0-LOI-RA>>> -->

1. **Vắng lối ra trong câu gộp** → trình nguyên văn section «Vấn đề & ai gặp»
   và «Ngưỡng chết / ngưỡng UAT» của `opportunity.md` (ngưỡng mang tiền tố
   `[đề xuất]` hiện rõ là đề xuất của máy), rồi hỏi ĐÚNG một câu: lối nào trong
   bốn. Máy KHÔNG điền sẵn lối ra và không viết hộ căn cứ — chọn là phát ngôn
   của người. Có lối ra trong câu gộp thì không hỏi gì.
2. **Ghi bằng bộ ghi, không sửa tay:**
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/ky-cong-dang.mjs --root . --slug <slug> --loi "<lối>" --by "<tên>" [--at <ngày>]`
   (`<tên>`/`<ngày>` theo bậc thang danh tính ở đầu file). Bộ ghi đặt
   `stage: decided` · `decision` · `decided_by` · `decided_at`; với «làm»/«lặp»
   ký là NHẬN ngưỡng — nó gỡ tiền tố đề xuất khỏi section Ngưỡng (và chỉ section
   đó); có `decisions.jsonl` thì nối một dòng `seal` gate 0. Nó TỪ CHỐI (thoát 2,
   không ghi gì) khi: «làm»/«lặp» mà ngưỡng còn trống · ô đã quyết hoặc đã đóng ·
   ô hỏng · lối ra lạ. Thoát khác 0 → in nguyên văn dòng lỗi của nó cho người,
   KHÔNG sửa tay thay. Căn cứ người nói thêm trong câu gộp → ghi NGUYÊN VĂN vào
   section «Cổng 0» của ô nếu ô có section đó.
3. **Bản đồ + commit MỘT lượt:** bản đồ theo đúng luật opt-in của bước 5 ở trên
   (chưa bật thì bỏ qua và in ghi chú), rồi một commit
   `<slug>: Cổng Đáng — <lối> — <tên>` gồm `opportunity.md` (+ `decisions.jsonl`
   khi có + `PRODUCT-MAP.md` khi đã vẽ lại).
4. **Bước kế — in đúng một dòng**, theo khoá `buocKe` trong JSON của bộ ghi:
   `cong-pham-vi` → «Đã ký Cổng Đáng. Bước kế: duyệt bộ tiêu chí —
   `/acceptance-gate:approve <slug> duyệt`.» · `S1` → «Đã ký Cổng Đáng. Bước kế:
   máy chốt thiết kế và bộ tiêu chí — `/feature-loop:feature-loop <slug>`.» ·
   `khong-ai` → «Đã ký Cổng Đáng: <xếp lại|dừng> — không ai phải làm gì tiếp.»
