---
description: Record the Gate 1 decision (phê duyệt Cổng 1) — render the decision card, ask exactly one question, write approved_by/approved_at only on an explicit human YES. Never approves on its own.
disable-model-invocation: true
---

Record the human's Gate 1 decision for a feature. `/acceptance-card` is the
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
- none → nothing awaits Gate 1 — say so and point to `/acceptance-status`.
  (Plan approval — Gate 1.5 — lives in the feature-loop. Do not fake it here.)

Một-lượt-gõ + `--repo` (điều khoản chung, chép nguyên văn từ bản luật):

Ba lệnh có-câu-hỏi (`/approve` · `/signoff` · `/start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người; tin mời cổng kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE, tin chỉ-báo không đeo khối mà nói thẳng máy đang làm gì tiếp.

Ví dụ một lượt gõ — trần (máy gánh phần còn lại) và đầy đủ (kiểu cũ,
vẫn chạy nguyên):
`/approve duyệt`
`/approve abc-xyz --repo /duong/dan/repo duyệt: Manh Phan`

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
  GÕ) → `signoff.approvers` khi danh sách đúng một tên; **CẢNH BÁO** khi
  tên sắp ghi không có trong `signoff.approvers` — nêu cảnh báo nhẹ (tên
  đang dùng kèm nguồn và (các) tên trong danh sách), áp cả khi tên do
  người tự gõ (khi đó in thành một dòng riêng); không chặn ghi, không đẻ
  thêm lượt hỏi; **CẠN** (mọi nấc trống, hoặc chỉ còn danh sách nhiều
  tên) → hỏi tên đúng một câu, có danh sách thì LIỆT ra để người chọn một
  chạm. Suy xong HIỂN THỊ LẠI
  «với danh tính: <tên> <ngày> (từ <nguồn suy>) — Enter xác nhận» TRƯỚC khi ghi.
  Mọi trả lời MANG NGHĨA KHẲNG ĐỊNH là xác nhận, dài hay ngắn, kể cả tin
  nhắn trống; chỉ trả lời nêu tên hoặc ngày khác mới là sửa danh tính (sửa
  được cả tên lẫn ngày ở cùng dòng đó). Người tự khai phần nào thì phần đó ghi thẳng; phần máy suy vẫn hiện
  trong dòng xác nhận, khai đủ thì không hỏi. **Máy KHÔNG hỏi và KHÔNG ghi số
  phút.** Vế `, phút <số>` ở cuối câu vẫn ĐƯỢC CHẤP NHẬN và BỎ QUA lặng — không
  lỗi, không ghi, không hỏi lại: người quen tay gõ nó theo phản xạ thì câu vẫn
  chạy trọn. Đừng biến nó thành lỗi cú pháp; cắt một thói quen không được phép
  chặn đúng cái người đang làm.
- `sửa: <điều cần đổi>` → bước 4 với đúng nội dung đó (vẫn là Gate 1).
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
2. **Present.** Render the decision card — `/acceptance-card <slug>` — unless
   it was just rendered this session. Attach the deep-review package: the full
   `contract.md` verbatim + the AC → eval → executor mapping table. Run the
   advisory coverage lint (`${CLAUDE_PLUGIN_ROOT}/scripts/eval-coverage-lint.js`
   — same plugin as this command, no cache glob)
   and surface its W1/W3 warnings — advisory only, the human decides.
3. **Ask EXACTLY ONE question:** approve, or what should change? — SKIP this
   step entirely when the human already typed a one-shot answer (`duyệt…` /
   `sửa: …`): that sentence IS the answer to this question, and asking it
   again is the two-turn gate this grammar exists to remove. The identity
   echo «với danh tính: … — Enter xác nhận» is NOT a second question: it is
   a one-touch confirm of a value the MACHINE inferred, not a decision asked
   of the human.
4. **Edits requested** → apply them to `contract.md`/`evals.yaml` (pre-approval
   artifacts are agent-editable), re-render the card, ask again. Still Gate 1.
5. **On an explicit YES only:**
   - `approved_by` and the date: apply the identity rules declared ONCE at
     the top of this file (ĐỌC / CHỌN / CẢNH BÁO / CẠN + the confirm echo)
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
     seal entry `{"id":"d-<next>","type":"seal","gate":1,"at":"<ISO>"}` in the
     same write-batch as `approved_by`.
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
6. **"Not now" / rejected** → the contract stays `draft`; capture the reason in
   chat; write nothing to gate fields.

Never:
- approve from silence, a timeout, or your own judgment;
- offer gate-skipping here — `gate1_skipped: true` stays a chat-explicit,
  audited escape hatch, deliberately outside this command;
- touch `human_signoff` or any Gate-2 field (that is `/signoff`).
