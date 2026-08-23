---
description: Gate 2 signoff assistant (nghiệm thu Cổng 2) — verify preconditions, walk the human through human_override + human_signoff, ghi và commit một lượt sau khi người phát ngôn, then re-check merge readiness. Never signs by itself.
disable-model-invocation: true
---

Walk the Gate 2 signoff for a feature whose evidence report is in. This
command prepares and verifies; the HUMAN supplies every decision value.
Chữ ký là quyết định của người, không phải một nghi thức commit: người phát
ngôn, máy ghi hộ và commit một lượt. Ai chịu trách nhiệm thì đọc ở forge
(người approve / bấm merge PR). Máy vẫn KHÔNG được tự phát ngôn "Ký" — khoá
model-invocation của lệnh này (ADR 0002) là chốt cứng cho điều đó.

Cờ: `--repo <path>` (gốc kho) và `--as "<tên>"` (khai danh tính thay cho
suy máy — ca máy dùng chung). Arg: optional `<slug>`. Without it, scan `_acceptance/*/` for an
`evidence-report.md` whose `verdict` is `PASS` or `PENDING-JUDGMENT` with an
empty `human_signoff` (one → use — hồ-sơ là điều máy biết:
đúng MỘT ứng viên thì KHÔNG hỏi, chỉ hiển thị lại tên hồ sơ trong cùng
lượt trả lời; several → table + ask; none → `/acceptance-gate:acceptance-status`). Verdict `REJECT`/`BLOCKED` → not signable: show
`failed_evals`/`reason` and stop.

Một-lượt-gõ + `--repo` (điều khoản chung, chép nguyên văn từ bản luật):

Ba lệnh có-câu-hỏi (`/acceptance-gate:approve` · `/acceptance-gate:signoff` · `/acceptance-gate:start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người.

Ví dụ một lượt gõ — trần (máy gánh danh tính/ngày) và đầy đủ (kiểu
cũ, vẫn chạy nguyên):
`/acceptance-gate:signoff E9: Đạt; cắt/hoãn: đồng ý cắt; Ký`
`/acceptance-gate:signoff abc-xyz --repo /duong/dan/repo Ngoài-1: ghi Known limits; E9: Đạt; cắt/hoãn: đồng ý cắt; Treo: phê hết; Ký: Manh Phan 2026-08-11`

Câu gộp của lệnh này ghép các chỗ trống dòng «Trả lời mẫu» của thẻ Cổng 2,
phân cách bằng `;` — ngữ pháp đầy đủ ở khối `GATE-ONESHOT-GRAMMAR`. Người
chỉ khai QUYẾT ĐỊNH; danh tính và ngày là điều máy biết:
- «Ngoài-<số>: ghi Known limits / mở hợp đồng mới / nâng phạm vi sửa ngay»
  → định đoạt từng mục ngoài hợp đồng (bước 3-4).
- «<mã eval>: Đạt» hoặc «<mã eval>: Chưa đạt vì <lý do>» → dòng
  `human_override` của đúng mục judgment đó (khuôn mã: `E\w+`).
- «cắt/hoãn: đồng ý cắt» hoặc «cắt/hoãn: kéo vào <mục>» → xác nhận phạm vi.
- «Treo: phê hết» hoặc «Treo: không phê Treo-<số>» → các quyết định ghi sau
  Gate 1.
- Chỗ trống «ký hay trả»: `Ký[: <tên> [<ngày>]]` →
  `human_signoff` + verdict upgrade (chỉ khi mọi override đã điền) +
  contract `status: signed-off`; hoặc
  `Trả lại: <lý do>` → bước 5, không ghi trường ký nào. Vắng tên → máy TỰ
  SUY, bốn luật tách bạch của `GATE-ONESHOT-GRAMMAR`: **ĐỌC** cả
  `git config user.name` lẫn `signoff.approvers`
  (không điều kiện nào chặn việc đọc — hai nguồn đối chiếu; bậc thang chọn
  GIÁ TRỊ, không chọn thứ được ĐỌC);
  **CHỌN** giá trị ở nấc cao nhất
  còn tên: `--as "<tên>"` → `git config user.name` (chữ ký thuộc NGƯỜI
  ĐANG GÕ) → `signoff.approvers` khi danh sách đúng một tên; **CẢNH BÁO**
  khi tên sắp ghi không có trong `signoff.approvers` — nêu cảnh báo nhẹ
  (tên đang dùng kèm nguồn và (các) tên trong danh sách), áp cả khi tên
  do người tự gõ (khi đó in thành một dòng riêng); không chặn ghi, không
  đẻ thêm lượt hỏi; **CẠN** (mọi nấc trống, hoặc chỉ còn danh sách nhiều
  tên) → hỏi tên đúng một câu, có danh sách thì LIỆT ra để người chọn một
  chạm. Vắng ngày → ngày
  lệnh chạy; suy xong HIỂN THỊ
  LẠI «với danh tính: <tên> <ngày> (từ <nguồn suy>) — Enter xác nhận» TRƯỚC khi ghi.
  Mọi trả lời MANG NGHĨA KHẲNG ĐỊNH là xác nhận, dài hay ngắn, kể cả tin
  nhắn trống; chỉ trả lời nêu tên hoặc ngày khác mới là sửa danh tính
  (sửa được cả tên lẫn ngày ở cùng dòng đó); người tự khai phần nào thì phần đó ghi
  thẳng; phần máy suy vẫn hiện trong dòng xác nhận, khai đủ thì không hỏi.
  **Máy KHÔNG hỏi và KHÔNG ghi số phút.**
  Vế `, phút <số>` ở cuối vẫn ĐƯỢC CHẤP NHẬN và BỎ QUA lặng
  — không lỗi, không ghi, không hỏi lại; người quen tay gõ
  nó theo phản xạ thì câu vẫn chạy trọn. Ngày người nêu — trong câu gộp hoặc ở dòng xác
  nhận — LUÔN thắng ngày máy suy. Chữ «Ký» vẫn phải do NGƯỜI gõ — Enter xác
  nhận chỉ xác nhận danh tính, không phải chữ ký.
- Nhãn nào thẻ đang đòi mà câu gộp vắng hẳn → hỏi đúng nhãn đó (đó là câu
  hỏi QUYẾT ĐỊNH — máy không đề xuất thay); giá trị NGƯỜI ĐÃ GÕ nhưng mơ
  hồ → luật khuyến-nghị-trước của `GATE-ONESHOT-GRAMMAR`: nêu
  cách hiểu khả dĩ nhất kèm căn cứ trích từ hồ sơ (khối Out of scope đã
  duyệt, sổ quyết định, trạng thái hồ sơ) + xin xác nhận một chạm, chỉ hỏi
  mở khi không có cách hiểu trội hơn HOẶC hiểu-sai-thì-đắt-khó-đảo. Ca mẫu (sự cố thật 11/08):
  «không cắt» đọc được hai chiều → đề xuất «đồng ý phạm vi đã khai» kèm căn cứ từ
  khối Out of scope đã duyệt ở Cổng 1, không hỏi mở. Đuôi tự do sau các
  nhãn nhận ra được → GIỮ NGUYÊN VĂN vào sổ quyết định. Nghi thức commit
  ghi-và-commit-một-lượt (bước 1 và bước 7) không đổi một li.
«Ngoài-<số>», «cắt/hoãn», «Treo» không có trường frontmatter riêng: định
đoạt của chúng ghi thành entry trong sổ quyết định `decisions.jsonl` (và
«ghi Known limits» thêm một gạch known-limits vào `## Notes` của hợp đồng)
— đúng như đường hỏi-từng-bước vẫn làm.
Với `--repo <path>`: render thẻ bằng `--root <path>`, mọi sửa file dưới
`<path>/_acceptance/…`, commit chữ ký và pre-merge re-check chạy bằng
`git -C <path>` / trên gốc `<path>`. Mọi đoạn lệnh in ở các bước dưới viết
gốc là `.` (thư mục hiện tại) — có `--repo` thì mọi đoạn lệnh đổi gốc sang
`<path>`: đối số `.` thành `<path>` (`pre-merge-check.sh <path>`), `--root .`
thành `--root <path>`, đường dẫn tương đối tới script thành
`<path>/scripts/pre-merge-check.sh`, và cặp lệnh chữ ký ở bước 7 thành
`git -C <path> add _acceptance/<slug>/…` + `git -C <path> commit -m …`
(đường dẫn sau `-C` vẫn tương đối với `<path>`).

Steps:

1. **Gói bằng chứng máy đã commit chưa?** If `evidence-report.md`,
   `run-log.jsonl`, the contract, or `evidence/` carry uncommitted
   machine-written changes, commit them NOW — committing early dodges the
   stale-guard. Không còn bắt tách khỏi chữ ký: nghi thức ấy đã gỡ (ADR 0012).
2. **Render Gate 2.** `/acceptance-gate:acceptance-card <slug>` — decision card + auto-opened
   `evidence-page.html`.
3. **List what only the human decides** — quyết định, không phải danh tính:
   - every UNCERTAIN judgment item — T3: EVERY judgment item — needs a real
     `human_override`;
   - the verdict upgrade `PENDING-JUDGMENT → PASS`, legal only after ALL those
     lines are filled;
   - chữ «Ký» hay «Trả lại» → `human_signoff` + contract `status: signed-off`.
   Danh tính và ngày KHÔNG nằm trong danh sách này: máy suy theo bậc ở trên
   rồi hiển thị lại chờ xác nhận một chạm khi người chưa khai.
4. **Collect decisions in chat, item by item** — SKIP every item the
   one-shot sentence already answered; only a label the card demands and the
   sentence lacks entirely gets asked (asking again what the human just typed
   is the two-turn gate this grammar exists to remove). Apply the
   human's dictated values VERBATIM via your file-edit tool so the
   write-time hook re-validates each write (a human editing outside the
   agent bypasses PreToolUse; CI re-check is the backstop). You contribute
   no decision values of your own — identity and date follow the
   inference ladder above, decisions never do.
5. **Any item the human rejects** → the feature is NOT signable: leave every
   signoff field empty, stop, and route back to the verify/fix loop.
6. **Regenerate the product map — only if this repo opted in.** Read
   `risk_tiers.t1_skip_globs` in `_acceptance/config.yaml`. `PRODUCT-MAP.md`
   NOT listed → the repo was initialised before acceptance-gate 1.31.0: **SKIP
   this step**, do NOT add the map to the commit, and print the note below —
   otherwise the signature commit itself makes the evidence stale and
   pre-merge blocks the merge with no way out (ADR 0007).

   > Bản đồ sản phẩm chưa bật cho repo này. Bật bằng hai dòng trong
   > `_acceptance/config.yaml`: thêm `- "PRODUCT-MAP.md"` vào
   > `risk_tiers.t1_skip_globs`, và `product_map: "node
   > ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root . --check"` vào
   > `executors.script` — rồi chạy executor đó trong CI.

   Listed → run `node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root .`
   after `human_signoff` is written; the map is machine-generated from records
   this gate just changed, so it belongs in the signature commit below.

7. **Ghi và commit — một lượt.** Sau khi người phát ngôn, ghi các dòng thuộc
   về người trong `evidence-report.md` (`human_signoff`, `human_override`, the
   verdict upgrade, `bypass_ack`) + contract `status: signed-off`, và
   `PRODUCT-MAP.md` ONLY if step 6 actually regenerated it. Rồi commit MỘT
   lượt — không tách, không đòi người tự gõ git. Print the exact sequence:

   ```bash
   git add _acceptance/<slug>/evidence-report.md _acceptance/<slug>/contract.md
   git commit -m "Gate 2 signoff: <slug> — <name>"
   ```

   Repo opted in (step 6 regenerated the map) → append ` PRODUCT-MAP.md` to that
   `git add`. Repo NOT opted in → leave it out: the file does not exist there and
   naming it makes `git add` fail with a pathspec error mid-signature.

   Câu dưới đây là bản gốc DUY NHẤT của điều khoản ai-sở-hữu-chữ-ký.
   `skills/acceptance/SKILL.md` chép nguyên văn, không tự diễn đạt.

   <!-- <<<SIGNATURE-OWNER-CLAUSE -->
   Chữ ký là QUYẾT ĐỊNH của người: người phát ngôn «Ký» hay «Trả lại», máy ghi hộ vào hồ sơ rồi commit như mọi commit khác — máy KHÔNG BAO GIỜ tự phát ngôn Ký (ADR 0002). Ai chịu trách nhiệm thì đọc ở forge: người approve / bấm merge PR, không phải ở lịch sử commit.
   <!-- SIGNATURE-OWNER-CLAUSE>>> -->
8. **Re-check merge readiness.** If the repo ships `scripts/pre-merge-check.sh`
   run `bash scripts/pre-merge-check.sh . --slug <slug>` (add
   `--base origin/<default-branch>` when known); otherwise run the installed
   plugin's copy. Where write-time hooks are not active, also run
   `recheck-evidence.cjs`. Report READY TO MERGE or the exact violations.

9. **Bước kế — in ra, đừng để người tự đoán.** Sau khi báo READY TO MERGE, in
   đúng một dòng: «Đã ký bằng chứng. Bước kế: bàn giao (S5) — mở PR theo quy
   trình repo.» Hồ sơ có `opportunity.md` (vòng đi từ Cổng Đáng) thì thêm: «sau
   khi giao còn một cổng nữa — phiên nghiệm thu:
   `/acceptance-gate:uat-session <slug>`.» Không có `opportunity.md` → «không hồ
   sơ cơ hội nên ship thẳng, vòng đóng.»

Never:
- invent a verdict, or guess a name/date beyond the identity ladder
  declared above (that ladder is the ONLY legal inference, and it always
  echoes what it inferred for a one-touch confirm before writing);
- upgrade a verdict while any override line is empty;
- ghi `human_signoff` khi người chưa phát ngôn — kể cả khi người khác giục;
- treat an unresolved PENDING-JUDGMENT as PASS.
