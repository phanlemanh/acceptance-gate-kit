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

## Cập nhật 2026-08-05 — phân tích lại sau ~5 tuần-công vận hành (228 commit, 7→20 workspace)

**Gap ranking cũ — số phận từng dòng:**

| # | Trạng thái 05/08 | Bằng chứng |
|---|---|---|
| G1 | **SHIPPED + ĐO GO** — claim-scan làm input 5 của gap-probe từ 1.18.0; 2 vòng hardening (parser + section-boundary) | 9/12 feature sau ship có citation `[id]` trong gap-probe.md (grep được, đúng đường đo DP-1); nhiều finding `fixed` nhờ cite bài học cũ |
| G2 | CHƯA — judge vẫn trả UNCERTAIN trần, không `required_evidence[]` | grep 0 hit trong skills/scripts/lib |
| G3 | CHƯA ĐO — panel diversity vẫn chỉ nằm trong note này | không có audit record |
| G4 | CHƯA — không có `feature_loop.budget`; cap 3 round vẫn là phanh duy nhất | grep 0 hit |
| G5 | CHƯA có gold set; NHƯNG tinh thần ratchet-engine chạy qua đường khác: retro có nghi thức (V1 retro 27→29/07), memory bài học máy-đọc-một-nửa, và mẫu **ma trận toàn phần P105** (viết thước TRƯỚC, mutant tái tạo bug gần nhất) | docs/research/2026-07-29-v1-retro-bai-hoc.md; case P105 |
| G6 | Vẫn đúng là KHÔNG làm — không ai nhớ nó | — |

**Graph plane: từ "mặt phẳng thiếu" → V1 sống + đang hợp nhất tầng đọc.**
Ngoài claim index, `lib/md-section.js` (bảng luật ranh giới có marker, self-read
runtime) đã gom 2/4 reader; feature đang giữa vòng
`workspace-reader-unification` (T3, Cổng 1 đã ký 04/08) tổng quát hoá nốt:
"mọi bên đọc hồ sơ xưởng phải cho cùng một kết luận". Đánh giá 5-plane mới:
**4.5/5** — graph plane có thật nhưng vẫn per-repo, nguồn hẹp (ledger +
gap-probe; review-findings/run-log vẫn V2), chưa persist, chưa semantic match.

**Gap MỚI mà 5 tuần vận hành lộ ra (phân tích cũ không thấy — xếp hạng mới):**

| # | Gap mới | Bài học nguồn | Trạng thái |
|---|---|---|---|
| NG1 | **Vòng verify không tự hội tụ** — reviewer round N+1 đào bug trong fix của round N; REJECT vô hạn trên diff lớn là CƠ CHẾ của evaluator mở, không phải xui (F-B r12→r16; 3 feature 29/07 đều thấy mầm) | [[vong-verify-khong-tu-hoi-tu]], [[fix-tu-tao-lo-moi]] | Giải pháp cơ chế ĐÃ ship: scope-triage 3 ngăn + luật triage viết trước + escalate hết round; nhưng đây là phát hiện lý thuyết đáng giá — tài liệu Graph Engineering KHÔNG bàn convergence của evaluator |
| NG2 | **Lớp thước-đo là bề mặt lỗi lớn nhất** — đo từ-vựng thay quan hệ (6 vòng cùng xương), thước không gắn vào vật (4 round start-scan), quét-lớp tuyên khống (1 mutant/5 phần tử) | [[do-tu-vung-thay-vi-quan-he]], [[ha-thuoc-cho-vua-vat]] | Lời giải đóng đã có mẫu (P105 ma trận toàn phần) nhưng chưa thành luật cưỡng chế của engine — ứng viên nâng cấp gap-probe/review |
| NG3 | **Stale-cascade cost O(N workspace)** — mỗi lần chạm engine phải re-pin machine-only TOÀN BỘ (nay 18-19 workspace/lần, nhiều lần/ngày); mỗi re-pin = N agent tươi chạy CÙNG 4 suite | [[kit-self-hosting]]; các commit re-pin liên tục | CHƯA có delta-verify cho re-pin; chi phí tăng tuyến tính theo số feature đã ship — sẽ thành gánh nặng số 1 của self-host |
| NG4 | **Đo ở phía consumer** — kit tự-host xanh không chứng minh gì cho repo tiêu thụ; P58 smoke-mirror là mầm, nguyên tắc đã thành memory nhưng chưa thành lớp eval bắt buộc | [[do-o-phia-consumer]] | Một phần (smoke mirror); chưa có consumer-fixture suite chuẩn |

**Kết luận cập nhật theo thước Graph Engineering:** trục *memory* đã tiến rõ
(graph plane V1 sống, có số đo); trục *evaluation* — vốn là điểm mạnh — hoá ra
còn một tầng chưa ai chấm: **meta-evaluation** (thước có gắn vào vật không,
vòng có hội tụ không, đo ở phía nào). 5 tuần vận hành cho thấy phần lớn lỗi
mới không nằm ở code được giao mà ở CHÍNH các phép đo — và tài liệu Graph
Engineering im lặng về tầng này. Ưu tiên mới đề xuất: NG3 (chi phí đang chảy
máu hằng ngày, cùng logic "cầm máu trước" đã dùng cho loop-stall) → NG2 (nâng
P105 thành luật engine) → G2/G3 (như cũ) → NG4.

## Đề xuất nâng cấp 05/08 — ĐÃ DUYỆT (owner đồng ý trong chat 2026-08-05)

Phân tích 80/20 trên số đo vận hành thật (không phải trên tài liệu): phút
người đã tối ưu xong (5-10'/gate, 0 dừng tự chèn) — chiến trường mới là
**token và round**. Phân bố chi phí: C1 verify-lặp-thứ-đã-biết ~50-60%
(round fix full re-run + re-pin 18-19 workspace × cùng 4 suite × agent
riêng) · C2 round-do-thước-sai ~25% (≥13 round thuộc lớp đo-lường) · C3
round đoán mò sau UNCERTAIN ~10%.

**Hàng đợi đã duyệt (chạy SAU khi `workspace-reader-unification` khép vòng —
bất biến không-đổi-engine-giữa-vòng; cả 4 đều chạm engine nên đều xếp hàng):**

| # | Slug dự kiến | Việc | Nguyên tắc gốc GE | Ăn vào |
|---|---|---|---|---|
| 1 | `delta-verify-repin` | (a) re-pin = 1 machine-lane + N chữ ký trỏ cùng run_id (19 agent chạy cùng suite trên cùng sha = redundancy thuần — nguyên tắc 7 áp cho verifier); (b) mở P1 carry-forward cho round fix sau REJECT (eval có `paths` không chạm diff-fix thì carry) | Ratchet = đo cái ĐỔI; DERIVED_FROM đã có trong run-log | C1: ước cắt 50-70% token vận hành, không đổi phép đo nào |
| 2 | `matrix-measure-law` | Nâng P105 thành luật: +1 cross-check gap-probe ("criterion không-gian-hữu-hạn nào đang đo bằng điểm-case thay vì ma trận?") + 1 lens `measurement` trong review S4 | "Evaluation feedback loop" — ratchet trên chính thước; lens mới = đa dạng thật (ng.tắc 7) | C2 — nguồn round lớn nhì, chi phí vài đoạn văn |
| 3+4 | `judge-required-evidence` (gộp gold-seed) | Judge trả `required_evidence[]` thay UNCERTAIN trần (schema verdict + template + card); signoff append 1 dòng jsonl `(item, máy đề xuất, người quyết, lý do)` — gieo gold set từ Gate 2, sau ~10-15 điểm đo luôn G3 correlated-errors từ dữ liệu này + panel memo, khỏi audit riêng | Graph-grounded evaluator trả JSON actionable; ratchet cần lịch sử máy-đọc (G1 đã mở khoá) | C3 + mở đường G5; gần zero chi phí vận hành thêm |

**Đã duyệt NÓI KHÔNG (giữ nguyên):** G6 swarm/DAG phân kỳ · G4 budget khai
trước (cap 3 round là phanh đúng — bằng chứng NG1) · semantic-matching claim
(9/12 citation với matching thô, chưa có bằng chứng nhiễu) · persist index.
Thêm nhóm này bây giờ là vi phạm lời dặn của chính tài liệu: đừng thêm
graph/swarm chỉ vì hệ có agent.
