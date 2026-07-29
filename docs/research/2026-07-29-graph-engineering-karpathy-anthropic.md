# Graph engineering — tổng hợp Karpathy loop → AgentHub → Anthropic playbook

*2026-07-29 · Nguồn: "Graph Engineering — The Karpathy Loop, The Anthropic
Playbook" (Agentic Software Engineering Practice 2026, tổng hợp độc lập
tháng 7/2026, KHÔNG phải tài liệu chính thức của Karpathy/Anthropic — số liệu
trong đó là nguồn thứ cấp, dùng làm cảm hứng kiến trúc, không dùng làm
benchmark cam kết). Bản gốc PDF + bản md đầy đủ nằm ngoài repo:
`~/Documents/Work/Docs/Graph-Engineering-Athropic-Karpathy-Loop.{pdf,md}`
(máy B). File này chỉ giữ phần chưng cất có tác dụng lên kit.*

## Luận điểm trung tâm

> **Bottleneck thường không phải lần gọi model tiếp theo. Bottleneck là chỗ
> đặt memory và evaluation.**

Mỗi kiến trúc externalize một bottleneck khác nhau: **loop** → iteration +
evaluation; **chain** → thứ tự task; **swarm** → tìm kiếm song song;
**commit DAG** → phả hệ thí nghiệm; **knowledge graph** → facts chung +
provenance + trí nhớ xuyên phiên. Tiến trình 3 bậc: vibe coding → agentic
engineering (người spec/verify, agent code) → **graph engineering** (agent
chia sẻ durable state qua graph có kiểu, query được).

## Các nguyên tắc đáng giữ (độc lập với kit)

1. **4 điều kiện autonomy** (từ autoresearch): output đo được · hành động
   revert được · chu kỳ phản hồi ngắn · môi trường chặn biên. Thiếu điều
   kiện nào thì xây điều kiện đó trước, đừng xây thêm agent. Câu hỏi gác
   cửa: *"Không verify được thì đừng bắt đầu bằng autonomy."*
2. **Ratchet loop** (sửa 1 thứ → đo → giữ/revert, ghi lịch sử keep/discard)
   áp được lên mọi artifact có metric — kể cả chính extraction prompt /
   rubric / eval policy, miễn có gold set. Tài sản thật là **lịch sử
   máy-đọc-được** của các thí nghiệm, không phải một tối ưu đơn lẻ.
3. **"Programming the program"**: file instruction (program.md / SKILL.md)
   là code tầng cao nhất — cấu hình một tổ chức tự hành: file nào mutable,
   metric nào là hướng, khi nào escalate người, khi nào dừng. Cần version,
   review, eval như code.
4. **Artifact contract thay transcript**: mỗi handoff là artifact có
   contract (reviewer trả defect theo tiêu chí, không trả "looks good");
   đừng để transcript chat kiêm database + workflow engine + audit log.
   Kiến trúc tham chiếu tách 5 plane: control / execution / artifact /
   graph / evaluation.
5. **Complexity budget khai trước**: max calls/sub-agents/token/chi phí/
   retry + **minimum evidence để được kết thúc**. Hết budget → trả artifact
   tốt nhất + việc dở + lý do dừng. *Không giấu partial failure sau câu trả
   lời trôi chảy.*
6. **Graph có điều kiện, không phải đích**: chỉ đáng khi query nhiều hop /
   quan hệ tiến hoá / cần provenance / world state xuyên phiên; bảng quan hệ
   trả lời đủ thì dùng bảng. Phân biệt: commit DAG = phả hệ công việc;
   knowledge graph = tri thức miền — bổ trợ, không gộp.
7. **Fan-out review chỉ có giá trị khi reviewer khác nhau** về prompt,
   evidence set, hoặc role — N reviewer giống nhau = 1 reviewer đắt gấp N
   (correlated errors).
8. **Đối trọng**: có việc phân mảnh làm hỏng — thiết kế kiến trúc, narrative,
   refactor coupling chặt, quyết định sản phẩm tinh tế cần MỘT context liền
   mạch. Swarm không phải mặc định.

Câu kiểm tra "hệ đáng tin": *mọi output quan trọng truy vết được về một
objective, một plan, một artifact, một nguồn, một quyết định evaluator, và
một execution record có biên.* Câu đó sai → thêm agent chỉ thêm mù mờ.

## Soi vào kit — xác nhận & 3 khoảng trống

**Kit đã đúng tầng:** contract Given/When/Then = "output verifiable";
evidence report = artifact contract; 2 cổng người = human escalation policy;
luật "đối chứng dương cho assertion âm tính" (CLAUDE.md) chính là chống lớp
lỗi "activity without progress".

**Chấm theo thước của tài liệu (đối chiếu chi tiết 2026-07-29, artifact
"Graph Engineering × Feature Loop"):** kit đặt *evaluation* gần chuẩn mực
(mọi hàng KHỚP đều thuộc trục này) và đặt *memory* đúng một nửa — bền trong
phạm vi 1 feature (artifact plane đầy đủ, append-only, carry-forward theo
hash) nhưng dừng ở ranh giới slug. Theo 5 plane tham chiếu: kit là hệ
**4/5** — thiếu đúng **graph plane**; vì ledger/run-log/evidence đều có
schema + append-only, dựng tầng graph là việc *đọc* dữ liệu sẵn có, không
phải đập đi ghi lại. Chiều ngược lại, kit đi TRƯỚC tài liệu ở 4 chỗ: human
gate được vận hành hoá (card + chữ ký tách commit + KPI phút-người) · kỷ
luật chống false-green (đối chứng dương) · enforcement 2 tầng độc lập
(hook + CI) · carry-forward có provenance (dạng thực dụng của
DERIVED_FROM).

**Gap ranking (đã đối chiếu, chưa quyết làm):**

| # | Gap | Bước nhỏ nhất khớp triết lý kit | Đáng làm? |
|---|---|---|---|
| G1 | **Trí nhớ xuyên feature** — bài học REJECT/fix không chảy giữa các slug (mặt phẳng graph thiếu) | Chưa cần graph DB: index `run-log` + `decisions` của mọi slug thành 1 lớp claim máy-đọc-được (lớp-lỗi → feature → round → cách sửa); gap-probe S1 đọc nó làm input thứ 5 | CÓ — cao nhất. Bằng chứng nhu cầu: lớp "assertion âm tính" tái xuất ≥9 lượt dù đã ghi CLAUDE.md — bài học có ghi nhưng không có đường máy-tra |
| G2 | **Judge feedback thiếu `required_evidence[]`** — UNCERTAIN nói "không chắc", chưa nói "đưa bằng chứng X thì chắc" | Thêm field vào schema verdict của panel (template + personas); round fix nhắm thẳng vào đó | CÓ — rẻ, giảm round S4 đoán mò |
| G3 | **Panel chưa audit tính đa dạng** — cấu trúc role có (finder/refute/personas/baseline), correlated errors chưa đo | Một lần đo từ transcript run cũ: tỉ lệ verdict trùng giữa các judge trên cùng item; trùng ≈100% = trả tiền N lần cho 1 ý kiến | CÓ — đo trước, sửa sau |
| G4 | **Token/cost budget khai trước** — hiện chỉ có cap 3 round + usage-report sau sự kiện | `feature_loop.budget` trong config; script S4 đọc `budget.remaining()` (Workflow có sẵn cơ chế) | CÓ, ưu tiên thấp — cap round đang gánh khá tốt |
| G5 | **Ratchet trên chính engine** — không có gold set đo chất lượng judge/eval-gen | Gom các case Gate 2 nơi human LẬT verdict máy thành gold set đầu tiên — mỗi lần human sửa máy là 1 data point miễn phí | CÓ, dài hạn — cần G1 trước (nơi chứa data point) |
| G6 | **Commit DAG phân kỳ / swarm nghìn agent** | Không làm — kit là hệ hội tụ (1 feature → 1 PR); `descope` + `.out-of-scope/` đã giữ đủ vết "vì sao không" | KHÔNG — khác bài toán; chính tài liệu dặn đừng thêm graph/swarm chỉ vì hệ có agent |

Thứ tự có chủ ý: G1 trước G5 (ratchet cần chỗ chứa lịch sử máy-đọc trước);
G3 là phép *đo* chứ chưa phải phép *sửa*. Mọi gap khi làm đều phải giữ
invariant hiện có: schema đổi có đường đọc-cũ, cờ vàng, không bắt migrate.

## Cảnh giác khi trích dẫn

- Timeline "Day 1 → Month 2" trong tài liệu là văn bán ý tưởng; phần đáng
  giữ là cột **exit criterion** — mỗi tầng phải chứng minh giá trị đo được
  trước khi lên tầng sau ("role split beats single agent", "wall-clock gain,
  no quality loss").
- Bảng "common misreading" của metric đáng nhớ: high precision che thiếu
  entity · compression cao thưởng cho over-merge · average success che case
  thảm hoạ · nhiều agent hơn = nhiều activity hơn, chưa chắc nhiều value hơn.
