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

**Khoảng trống (chưa quyết làm — mới là quan sát):**

1. **Lineage vòng verify chưa được ghi thành artifact.** Kit ghi *kết quả*
   (evidence, signoff) nhưng không ghi *phả hệ*: verify chạy mấy round,
   round nào fail vì gì, fix nào bị revert. Liên quan trực tiếp
   [feature-loop không tự loop] — trạng thái vòng lặp sống trong transcript
   thay vì trong artifact đọc lại được.
2. **Judge feedback chưa có cấu trúc "thiếu bằng chứng nào".** Mẫu
   `{decision: revise, reason, required_evidence[]}` của graph-grounded
   evaluator là nâng cấp tự nhiên cho judge panel của acceptance-verify —
   chỉ ra bằng chứng nào đang thiếu thay vì PASS/FAIL kèm văn xuôi.
3. **Judge panel chưa được audit theo tiêu chí đa dạng hoá** (nguyên tắc 7):
   các judge của S4 có khác nhau thật về prompt/evidence/role không, hay chỉ
   là một judge nhân bản?

## Cảnh giác khi trích dẫn

- Timeline "Day 1 → Month 2" trong tài liệu là văn bán ý tưởng; phần đáng
  giữ là cột **exit criterion** — mỗi tầng phải chứng minh giá trị đo được
  trước khi lên tầng sau ("role split beats single agent", "wall-clock gain,
  no quality loss").
- Bảng "common misreading" của metric đáng nhớ: high precision che thiếu
  entity · compression cao thưởng cho over-merge · average success che case
  thảm hoạ · nhiều agent hơn = nhiều activity hơn, chưa chắc nhiều value hơn.
