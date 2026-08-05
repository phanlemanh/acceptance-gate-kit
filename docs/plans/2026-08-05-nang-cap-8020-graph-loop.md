# Chương trình nâng cấp 80/20 theo Graph Engineering — mục đích, mục tiêu, kế hoạch

*2026-08-05 · Owner: Manh Phan · Nguồn quyết định: mục "Đề xuất nâng cấp 05/08
— ĐÃ DUYỆT" trong [research note](../research/2026-07-29-graph-engineering-karpathy-anthropic.md).
Đây là tầng CHƯƠNG TRÌNH — mỗi vòng bên dưới vẫn tự có contract/evals riêng ở
S1 của nó; ngưỡng ở đây là ngưỡng nghiệm thu chương trình, khai TRƯỚC, không
sửa sau khi thấy số.*

## 1 · Mục đích (vì sao chương trình tồn tại)

KPI gốc của kit — giảm tần suất can thiệp người — **đã đạt** (5-10 phút/gate,
0 lần dừng tự chèn). Chương trình này chuyển trục tối ưu sang **token và
round** theo đúng luận điểm gốc Graph Engineering: *bottleneck là chỗ đặt
memory và evaluation* — cụ thể ở kit là (a) hệ *quên* mình đã verify gì nên
verify lại cả thế giới, và (b) *chính các phép đo* là nguồn lỗi lớn nhì.
Ràng buộc bất di dịch: **không hạ một tiêu chuẩn bằng chứng nào** — cùng độ
tin, ít lần chạy trùng.

## 2 · Baseline (đo từ repo 05/08 — mốc so sánh của mọi mục tiêu)

| Chỉ số | Giá trị đo được |
|---|---|
| B1 · Thuế re-pin tích luỹ | **141 mục `### Re-pin`** / 20 workspace ≈ 141 lượt machine-lane trùng (~40k token + ~4 phút/lượt ≈ **5-6M token** thuần chạy-lại-thứ-đã-biết) |
| B2 · Chi phí 1 round S4 | ~0.9–1.3M subagent-token (đo 8 run gần nhất) |
| B3 · Round fix | Full re-run theo thiết kế (mọi eval + 5 suite), kể cả eval không chạm diff-fix |
| B4 · Round do thước-sai | ≥13 round trong 5 tuần thuộc lớp đo-lường (điểm-case thay ma trận, đo từ-vựng, thước không gắn vật) |
| B5 · Judge feedback | UNCERTAIN/FAIL trần — 0% verdict có `required_evidence[]` |
| B6 · Gold set | 0 điểm — mọi lần người lật verdict máy tại Gate 2 đang bị vứt |

## 3 · Mục tiêu (đo từ vật, có ngưỡng sống/chết)

- **O1 — Delta-verify** (vòng 1): (a) một sự kiện re-pin = **1 lượt
  machine-lane + N chữ ký** trỏ cùng `run_id` — đo: mục `### Re-pin` mới sinh
  ra tham chiếu chung một run_id, số lượt lane/sự kiện = 1 (baseline: = N);
  (b) round fix sau REJECT carry được eval có `paths` không chạm diff-fix —
  đo: dòng `carried_from_round` xuất hiện trong run-log của round fix.
  **Ngưỡng chết:** nếu bất kỳ re-check strict/hook/CI nào phải nới luật để
  chấp nhận cơ chế mới → dừng, thiết kế lại (không đổi chuẩn bằng chứng).
- **O2 — Thước thành luật** (vòng 2): gap-probe có cross-check
  điểm-case-vs-ma-trận + review có lens `measurement`. Đo trên 3 feature
  T2/T3 kế tiếp sau ship: **0 round S4 bị REJECT vì lỗi lớp đo-lường**, HOẶC
  ≥1 finding gap-probe bắt nó từ S1 (grep gap-probe.md). Vùng giữa: 1 round
  lọt lưới → chỉnh prompt một lần, đo tiếp 2 feature; lọt nữa → xem lại cách
  đặt luật.
- **O3 — Judge trả bằng-chứng-thiếu** (vòng 3): 100% panel verdict mới có
  `required_evidence[]` khi không PASS (đo: grep evidence-report các feature
  sau ship); và không feature nào cần round thứ 3 vì cùng-một-nguyên-nhân-judgment
  (đo: Iterations + ledger fix entries).
- **O4 — Gold set** (gộp vòng 3): sau 5 feature kế tiếp có ≥10 điểm
  `(item, máy đề xuất, người quyết, lý do)`; từ dữ liệu đó + panel memo
  run-log, ra được **báo cáo G3** (tỉ lệ trùng verdict giữa judges) không cần
  chạy audit riêng.
- **Mục tiêu tổng:** token vận hành/feature (usage-report tổng) giảm **≥40%**
  so với trung vị 5 feature gần nhất trước chương trình — đo sau khi 3 vòng
  ship + 3 feature tiêu thụ chạy qua.

## 4 · Lợi ích theo vai

- **Dev chạy loop:** vòng fix nhanh hơn (bớt chờ full re-run), REJECT kèm
  danh sách bằng-chứng-thiếu thay vì đoán; bớt round = bớt lượt trình bày.
- **Owner/người ký:** chi phí token/feature giảm ~nửa; câu hỏi Gate 2 sắc hơn
  (judge nói thiếu gì); thuế re-pin không còn tăng theo số feature đã ship —
  self-host sống được lâu dài.
- **Kit-as-product:** mọi repo tiêu thụ hưởng cùng cơ chế; và chương trình
  tự nó là demo của triết lý kit: nâng cấp engine bằng chính vòng lặp của
  engine, mỗi vòng có contract + evidence + chữ ký.

## 5 · Kế hoạch thực hiện

**Trigger:** `workspace-reader-unification` (T3, đang giữa vòng) ký Gate 2
xong → bắt đầu. Cả 3 vòng đều chạm engine — tuyệt đối không chen giữa vòng
của nhau (bất biến CLAUDE.md).

| Vòng | Slug | Phạm vi chạm (dự kiến tier) | Phụ thuộc |
|---|---|---|---|
| 1 | `delta-verify-repin` | SKILL.md feature-loop (nghi thức re-pin + args S4), acceptance skill, có thể `scripts/recheck-evidence.js`/hook đọc re-pin theo run_id → **khả năng T3** | Không |
| 2 | `matrix-measure-law` | prompt gap-probe (SKILL S1#7) + review lens trong acceptance-verify.js → T2/T3 tuỳ file | Nên sau 1 (để vòng 2 tự hưởng delta-verify) |
| 3 | `judge-required-evidence` (gộp gold-seed O4) | judge-personas + evidence-report-template + gate-card + signoff skill | Sau 2 |

**Luật áp cho cả chương trình** (rút từ chính các bài học đã trả giá):
- Ngưỡng sống/chết per-vòng khai ở design doc TRƯỚC Gate 1 (khuôn DP-1).
- Mọi bản vá phải RED-test chính nó ([[fix-tu-tao-lo-moi]]); quét lớp = số
  mutant bằng số phần tử; đổi schema có đường đọc-cũ + cờ vàng; git add đích
  danh; đo baseline vòng sau bằng usage-report như thường lệ.
- Vòng 1 là vòng RỦI RO NHẤT (chạm đường bằng chứng): thiết kế phải qua được
  câu hỏi "kẻ gian lận có thể mượn 1 run_id cho N chữ ký khi code ĐÃ đổi giữa
  chừng không?" — nếu không chặn được bằng máy (so sha), không ship.

**Nghiệm thu chương trình:** sau vòng 3 + 3 feature tiêu thụ, viết 1 mục
"Kết quả chương trình" vào research note: bảng O1-O4 + mục tiêu tổng đặt cạnh
baseline §2 — số nào trượt thì ghi trượt, không làm tròn.

## 6 · Rủi ro chính & đối sách

- **R1 · Delta-verify làm mỏng bằng chứng** → ngưỡng chết O1 + câu hỏi gian
  lận ở §5; mọi carry phải minh bạch trên gói Gate 2 (luật Đợt 5 sẵn có).
- **R2 · Vòng verify của chính 3 vòng này không hội tụ** (chúng chạm engine —
  đúng vùng reviewer đào sâu nhất) → scope-triage + cap 3 round + escalate;
  chấp nhận known-limits có chữ ký thay vì round 4.
- **R3 · Reader-unification kéo dài** → chương trình chờ, không chen; nếu >1
  tuần, owner quyết thứ tự lại một lần ở đây (sửa mục này bằng amendment có
  ngày, không sửa ngầm).

### Amendment 2026-08-05 (R3 — owner đổi thứ tự)

Owner khởi động `delta-verify-repin` TRƯỚC khi `workspace-reader-unification`
khép vòng (lệnh `/feature-loop delta-verify-repin` trong chat). Cơ sở: kiểm
tra va chạm cho thấy reader-unification mới ở `approved` — chưa plan, chưa
code, chưa evidence → không có gì để stale, không giẫm file (nó chạm
lib/readers; vòng này chạm SKILL/workflows + pre-merge/recheck). Điều kiện
giữ nguyên: nếu reader-unification vào S3 trước khi vòng này ký, vòng nào
tới S4 sau phải re-verify trên HEAD chung như luật hiện hành.

### Amendment 2026-08-05 (tối) — Hiện trạng giữa kỳ: 3/3 vòng đã ký, chuyển pha ĐO

Cả ba vòng ký Cổng 2 trong ngày 05/08 (delta-verify-repin `36104e1` ·
matrix-measure-law `fb5b3fe` · judge-required-evidence `e6dad45`; ship cuối
`983067d`, CI xanh). Số giữa kỳ đặt cạnh mục tiêu — SỐ CHÍNH THỨC vẫn chờ 3
feature tiêu thụ như §Nghiệm thu đã khai, không viết sớm:

- O1(a) ĐẠT: 3 sự kiện re-pin dogfood = 3 lane thay 61 (19+21+21) — ~2.3M
  token tránh được ngay trong ngày. O1(b) ĐẠT: 23 dòng `carried_from_round`
  sản xuất (vòng 3 carry 9/11 rồi 5, 9). O1(c) ĐẠT: 0 luật nới — hotfix
  1.32.1 đi qua đúng cửa ngoại-lệ-đích-danh của DV5.
- O2 SỚM-TÍN-HIỆU-TỐT: 5/5 finding gap-probe S1 của vòng 3 do 7 câu vòng 2
  soi; lens `measurement` bắt lỗi thật ở mọi round nó chạy. Số chính thức:
  3 feature T2/T3 kế.
- O3 SỚM-TÍN-HIỆU-TỐT: 6/6 phiếu không-PASS của vòng 3 kèm required_evidence;
  4 round fix đều nhắm danh sách judge, không đoán. Số chính thức: feature kế.
- O4 VƯỢT TRƯỚC HẠN: 20 điểm vàng (mục tiêu ≥10 sau 5 feature) · 37 hội đồng
  (34 lần 3/3 · 3 lần 2/1 · 0 phân kỳ) — báo cáo G3 ra từ /acceptance-report.
- Mục tiêu tổng (−40% token/feature): CHƯA ĐO ĐƯỢC — 3 vòng xây engine tốn
  ~18M token S4 (đắt hơn thường lệ vì tự-tham-chiếu, R2 hiện đúng như dự
  liệu ở CẢ 3 vòng, xử đúng đối sách cap+known-limits; vòng 3 người nới cap
  1 round có ledger). Tiết kiệm dồn cho feature tiêu thụ — đo ở pha kế.
- Sai lệch so kế hoạch: (1) trigger đổi theo Amendment R3 (reader-unification
  vẫn `approved`, chưa đụng); (2) +1 hotfix ngoài kế hoạch (luật repin
  per-section → quan-hệ, 1.32.1 — dogfood #2 phơi); (3) vòng 3 chạy 4 round
  thay 3 (người uỷ quyền).
- Pha kế (đã chốt 05/08 tối): ĐO trên 3 feature tiêu thụ = chính 3 chip đang
  treo (codex carry-plan packaging · gate-card stripMd glob · gold-book-output)
  → viết "Kết quả chương trình" vào research note; song song KHÔNG mở vòng
  engine mới cho tới khi số về.
