> ⚠️ **[SUPERSEDED 30/07/2026 → `workflow-v2-spec.md`]** — file này là trầm tích lịch sử, giữ làm sử liệu. Session mới: đọc `workflow-v2-spec.md`, KHÔNG đọc file này.

# Discovery lane & Cổng 0 — từ chọn-feature đến bàn giao prototype — Design Spec

> **Trạng thái: DRAFT đề xuất** (2026-07-27, hội thoại máy A). File này là input
> tiền-S0: khi triển khai, các thay đổi chạm `feature-loop/` và `commands/`
> phải đi qua chính `/feature-loop` của kit. Docs này nằm trong `docs/**` (T1)
> nên bản draft không kích hoạt cổng.

## 1. Vấn đề

Kit hiện phủ **Prototype → Ship** (S0→S5, Gate 1/1.5/2) và làm tốt. Nhưng:

1. **Không gì trả lời "vì sao là feature X".** Vòng lặp bắt đầu ở "làm tính
   năng X" — quyết định chọn X nằm ngoài mọi artifact, không truy vết được.
2. **Kỳ vọng prototype lệch trong đội.** Có người coi prototype là bằng chứng
   dùng-xong-vứt, có người (owner) kỳ vọng nó là v0 của sản phẩm — code sống
   tiếp. Chưa có quy định chung, và mỗi kỳ vọng đòi một bộ guard khác nhau.
3. **Kênh false-green qua code-có-trước.** Nếu code prototype sống tiếp mà
   không có guard: contract S1 sẽ được viết bằng cách đọc code đã tồn tại
   (mô tả cái-đang-có thay vì ý định), và mọi eval **sinh ra đã xanh** — chưa
   bao giờ được quan sát ĐỎ, tức là chưa chứng minh được nó phân biệt gì
   (đúng lớp lỗi "assertion âm-tính-một-mình" trong CLAUDE.md, ở tầng eval).

## 2. Quyết định đã chốt (hội thoại 2026-07-27)

- Hai giai đoạn, hai loại quyết định: **khám phá** (có đáng làm không — phán
  đoán nghiệp vụ, đảo ngược rẻ) và **giao hàng** (làm có đúng không — evidence
  máy, đảo ngược đắt). Không dùng chung một bộ máy.
- Kỳ vọng đội (owner chốt): **D3 dựng với kỷ luật như code sẽ sống (v0)**.
- **KHÔNG chọn mặc định giữ/vứt cho code prototype.** Mặc định-giữ là
  fail-open (im lặng = code chưa qua cổng chảy vào S3); mặc định-vứt không
  khớp kỳ vọng v0. Thay vào đó: **xoá mặc định** — giữ/archive là một câu hỏi
  bắt buộc trên thẻ Cổng 0, không có đường im lặng theo cả hai hướng.
- Chọn GIỮ thì phải mua lại evals-first bằng **3 guard bù** (§7).
- **Ngoại lệ cứng T3**: prototype chạm `t3_paths` → không có lựa chọn "giữ
  nguyên" (§7.4).
- **Slug đúc ở D1** (không phải S0); `opportunity.md` nằm trong
  `_acceptance/<slug>/` — không dựng cây tài liệu thứ hai.
- Cổng 0 phải **rẻ**: một thẻ, một câu hỏi chính; T2 không chặn cứng khi
  feature vào thẳng S0 (hỏi 1 câu rồi đi tiếp), chỉ T3 chặn.
- pm-skills chỉ là **plug-in tùy chọn** tại các điểm nêu ở §4 — tuyệt đối
  không thành hard dependency trong preflight S0.

## 3. Nguyên tắc tối cao

1. **Đường im lặng phải an toàn** (cùng logic CT-S: câu hỏi không phải "có
   quét không" mà "có muốn BỎ không"). Áp vào prototype: im-lặng-giữ trả giá
   bằng độ đúng, im-lặng-vứt trả giá bằng thời gian — kit luôn chọn trả bằng
   thời gian, nên khi buộc phải có mặc định thì mặc định là archive; nhưng
   thiết kế này xoá mặc định bằng câu hỏi bắt buộc.
2. **Một nguồn sự thật tại mỗi thời điểm.** `opportunity.md` là nguồn cho câu
   hỏi *có làm không* và NGỪNG là nguồn khi Gate 1 duyệt contract. Không file
   nào ôm cả ba vai (vì sao làm · làm gì · đã đúng chưa).
3. **Evals-first không miễn phí khi code có trước** — phải mua lại bằng guard
   máy-kiểm-được, không bằng lời hứa quy trình.
4. **Cổng 0 phán quyết CƠ HỘI, không phán quyết code.** Ngưỡng chết đo giả
   định nghiệp vụ; code đẹp không phải lý do sống. Giả định chết → archive
   branch, kể cả khi code hoàn hảo.

## 4. Giai đoạn khám phá — D1 → D2 → D3 → Cổng 0

| Bước | Việc | Artifact | Skill tùy chọn (plug-in, không bắt buộc) |
|---|---|---|---|
| **D1 — khung cơ hội** | **D1a**: brainstorm làm rõ — từ instinct/problem mờ ra 2-3 hướng + giả định rủi ro nhất. **D1b**: đúc slug; capture vào `opportunity.md` 1 trang; bắt buộc mục "giả định chốt sinh tử" | `_acceptance/<slug>/opportunity.md` (stage: discovery) | D1a: `product-management:brainstorm` (động cơ hội thoại — xem ghi chú dưới bảng). D1b input: `analyze-feature-requests`, `prioritize-features`, `summarize-interview` |
| **D2 — red-team giả định** | Tấn công các giả định, xếp theo phép thử rẻ nhất. KHÁC gap-probe: gap-probe phản biện bộ artifact (AC thiếu eval), red-team phản biện quyết định nghiệp vụ | cập nhật bảng giả định trong `opportunity.md` | `strategy-red-team`; T3: thêm `pre-mortem` |
| **D3 — prototype (v0)** | Ghi `prototype.base_commit` TRƯỚC commit đầu tiên. Khai **ngưỡng chết trước khi dựng** (§5). Dựng thứ trả lời giả định đắt nhất, kỷ luật như code sẽ sống, trong timebox | code trên branch prototype; mục "Kết quả prototype" | — |
| **Cổng 0 — người quyết** | Thẻ quyết định (§6): số phận cơ hội + số phận code. Ghi `decision`/`decided_by`/`decided_at` | frontmatter `opportunity.md` + ledger | — |

Không khai được ngưỡng chết ⇒ chưa biết mình hỏi gì → quay lại D2, chưa được
dựng.

**Ghi chú D1a — `product-management:brainstorm` (đã đọc nội dung skill,
2026-07-27):**

- Output "Close the Session" của nó ánh xạ thẳng vào `opportunity.md`:
  strongest direction → `feature:` + "Vấn đề & ai gặp"; **riskiest
  assumption** → "Giả định chốt sinh tử"; suggested next step → đầu vào
  "Ngưỡng chết" D3; parked ideas → "Out of scope từ khám phá" / `park`.
- **Capture vào `opportunity.md`, KHÔNG nhận follow-up `/one-pager` hay
  `/write-spec` của skill** — output đó thiếu frontmatter máy đọc, thiếu
  ngưỡng chết, nằm ngoài `_acceptance/` → thành artifact mồ côi, trôi về
  failure mode "PRD chết" (§10).
- Phase "Provoke" trong-phiên của nó KHÔNG thay D2: cùng-context với người
  xây ý tưởng, không sinh bảng giả-định-xếp-theo-phép-thử-rẻ-nhất.
  `strategy-red-team` ở D2 vẫn là pass tách biệt (cùng nguyên tắc
  context-sạch của gap-probe, áp ở tầng nghiệp vụ).
- **Định tuyến 2 skill brainstorm:** chưa qua Cổng 0 → PM brainstorm (có làm
  không / làm cái gì); S1 sau Cổng 0 → `superpowers:brainstorming` (làm thế
  nào — feature-loop gọi đích danh, không đổi).
- Vẫn là plug-in tùy chọn (§2): skill vắng → D1a làm tay, không chặn.

## 5. Artifact & schema — `opportunity.md`

```markdown
---
schema_version: 1
slug: <kebab-case>
feature: <1 câu>
owner: <git config user.email>
stage: discovery            # discovery | decided | archived
decision:                   # build | iterate | park | kill — trống tới Cổng 0
decided_by:
decided_at:                 # ISO UTC
time_human_minutes:
  gate0:
prototype:
  base_commit:              # commit TRƯỚC prototype đầu tiên — ghi lúc vào D3
  disposition:              # keep | archive — BẮT BUỘC khi decision: build
---

# Cơ hội: <tên>

## Vấn đề & ai gặp
<3-5 dòng, nguồn thật: request nào, phỏng vấn nào, số liệu nào>

## Giả định chốt sinh tử (xếp hạng)
| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| A1 | ... | feature vô nghĩa dù code đúng | ... | sống / chết / chưa thử |

## Ngưỡng chết của prototype (khai TRƯỚC khi dựng — D3)
- Câu hỏi prototype trả lời: <1 câu>
- Kết quả nào là SỐNG: <đo được>
- Kết quả nào là CHẾT: <đo được>
- Timebox: <ngày>

## Kết quả prototype
<điền sau D3: giả định nào chết, giả định nào sống, bất ngờ gì>

## Thước đo thành công → ứng viên criterion
<mỗi dòng sẽ thành ứng viên AC ở S1 — viết đo được>

## Bảng nợ kế thừa (CHỈ khi disposition: keep)
| Path | Giữ / Dựng lại | Chạm t3_paths? | Ghi chú |
|---|---|---|---|

## Out of scope từ khám phá
<giả định đã chết + nhánh đã bác — S1 sẽ chép sang contract Out of scope>
```

Cap **1 trang**. Phình quá = đang viết PRD chết — cắt.

## 6. Cổng 0 — thẻ & ghi quyết định

`/acceptance-card <slug>` tự nhận **Cổng 0** khi workspace có `opportunity.md`
với `stage: discovery` và CHƯA có `contract.md`. Thẻ trình:

1. **Cơ hội 1 đoạn** — vấn đề, ai gặp, nguồn.
2. **Giả định: chết / sống** — từ bảng, kèm kết quả prototype so với ngưỡng
   chết đã khai.
3. **Câu hỏi 1 — số phận cơ hội:** `build` (vào feature-loop) · `iterate`
   (thử tiếp, quay D2/D3) · `park` (chưa làm bây giờ — giữ hồ sơ) · `kill`
   (giả định chết — archive).
4. **Câu hỏi 2 — số phận code (bắt buộc khi build, không mặc định):**
   - **keep** → bắt điền đủ Bảng nợ kế thừa; append ledger entry
     `type: approach`, impact: "kế thừa code chưa qua cổng — bù bằng 3 guard
     §7"; 3 guard tự kích hoạt.
   - **archive** → append entry `type: descope`, impact: "vứt code prototype —
     tốn công dựng lại; đổi lại evals-first miễn phí".
5. Ghi `decision`/`decided_by`/`decided_at` + hỏi số phút → `gate0`.
   `stage: decided`.

Đợt đầu: người điền frontmatter tay (hoặc ra lệnh cho agent điền đúng mấy
trường đó) — **CHƯA** dựng thao tác cổng người thứ 6 (§9, nợ đã khai).

## 7. Bàn giao qua Cổng 0 — luật kế thừa code

### 7.1 Guard 1 — contract mù-prototype
S1 soạn `contract.md` từ `opportunity.md` + brainstorm. **CẤM đưa diff/code
prototype vào context lúc soạn contract** — cùng kỹ thuật context-sạch của
gap-probe (S1#7 cấm đưa hội thoại brainstorm cho critic). Contract viết từ
ý định; code kế thừa phải đuổi theo contract, không ngược lại.
Đợt đầu enforce bằng quy ước trong SKILL.md; máy-kiểm là nợ đã khai.

### 7.2 Guard 2 — diffBase từ gốc prototype
Khi `disposition: keep`: bước chuẩn-bị-args S4 đặt
`diffBase = prototype.base_commit` (KHÔNG phải merge-base gần nhất) — toàn bộ
code kế thừa nằm trong diff mà review + adversarial-verify của S4 soi tới.
Thiếu `base_commit` mà disposition là keep → DỪNG, báo user (không đoán).

### 7.3 Guard 3 — baseline non-discriminating thành bắt buộc
Khi `disposition: keep`: `runBaseline` buộc `true` ở round 1 (bỏ qua carry P2)
và eval bị analyst đánh dấu `non_discriminating` **không được tính là evidence
cho criterion của nó** — phải sửa eval (chứng minh ĐỎ được trên bản đối chứng)
hoặc thay eval khác, rồi round mới. Lý do: code có trước ⇒ eval sinh-đã-xanh
⇒ đây là lớp bù duy nhất máy-kiểm-được cho evals-first.

### 7.4 Ngoại lệ cứng T3
Bảng nợ có dòng chạm `t3_paths` → không có lựa chọn "giữ nguyên". Chỉ còn:
(a) dựng lại path đó trong S3, hoặc (b) giữ + **full review từng file, nêu
đích danh thành task trong plan S2** (Gate 1.5 của T3 duyệt). False-green ở
T3 lan sang mọi consumer — không phải chỗ tiết kiệm.

## 8. Quy định đội ngũ (chép nguyên văn vào tài liệu đội)

> **D3 dựng với kỷ luật như code sẽ sống (được phép giữ). Nhưng sống hay
> không quyết tại Cổng 0, theo bảng nợ — không phải theo cảm giác tiếc code.**
> Cổng 0 phán quyết cơ hội, không phán quyết code: ngưỡng chết khai trước ở
> D3 đo giả định nghiệp vụ; giả định chết thì archive branch, kể cả khi code
> hoàn hảo.

Kỳ vọng định hình **cách dựng**; câu hỏi ở cổng định đoạt **số phận**. Gộp
hai việc này làm một chính là nguồn của cặp kỳ vọng lệch đã phát hiện.

## 9. Nơi chạm kit — xếp theo giá rẻ dần

1. **Template `opportunity.md`** → `skills/acceptance/references/opportunity-template.md`
   (nguồn; sync mirror). Thuần thêm file.
2. **S0 đọc opportunity** — sửa `feature-loop/skills/feature-loop/SKILL.md`:
   nếu `_acceptance/<slug>/opportunity.md` có `decision: build` → dùng slug đó;
   "Thước đo thành công" → ứng viên AC; "Out of scope từ khám phá" → Out of
   scope contract + entry descope; đọc `prototype.disposition` để kích hoạt
   guard §7. Feature vào thẳng S0 không có opportunity: T2 → hỏi 1 câu xác
   nhận rồi đi tiếp (không chặn); T3 → yêu cầu tối thiểu D1+Cổng 0.
3. **Quy ước prototype** — 1 dòng ở S0 + 1 dòng ở S2 (task kế thừa phải nêu
   đích danh) + guard §7.2/§7.3 ở bước chuẩn-bị-args S4.
4. **`/acceptance-card` nhận Cổng 0** — sửa `commands/acceptance-card.md` +
   bản codex (`codex/acceptance-gate/skills/acceptance-card/`) — 2 harness.
5. **`/acceptance-status` + `/acceptance-report`** đọc thêm `opportunity.md`:
   funnel cơ-hội-vào / kill-rate Cổng 0 / conversion → signed-off / phút
   `gate0`. Khớp bất biến KPI: đo bằng **tần suất**, không phút/lần
   (baseline_minutes cố ý trống).

**Mọi sửa nguồn → chạy `scripts/sync-plugin-packages.sh` + commit mirror cùng
lượt (P30).** Test mới cho guard §7.2/§7.3 phải có **đối chứng dương** theo
CLAUDE.md (bản nguyên vẹn XANH trước khi tin bản bị tiêm là ĐỎ, ghim đúng
thông điệp).

### Nợ đã khai (defer có chủ đích, không phải bỏ sót)
- **Thao tác cổng người thứ 6** (ghi decision Cổng 0) + khoá model-invocation
  cả 2 harness + test P31/P32 mở rộng — chỉ làm sau khi ≥3 feature thật chạy
  qua Cổng 0 tay và thấy đáng giá harness.
- **Máy-kiểm guard 7.1** (contract mù-prototype) — đợt đầu là quy ước.
- **Hook enforce `decided_by`** trước khi S1 chạy — đợt đầu không có.

## 10. Failure modes đã xét & chốt chặn

| Failure mode | Chốt chặn |
|---|---|
| Sunk cost tại Cổng 0 ("code chạy rồi mà") | §3.4 + quy định §8; ngưỡng chết khai TRƯỚC khi dựng |
| D3 phình thành "dựng cho đủ" | timebox trong `opportunity.md`; ngưỡng chết là điều kiện dừng |
| Cổng 0 bị đi vòng (vào thẳng S0) | T2 hỏi-1-câu không chặn; T3 chặn (§9.2) — cổng chặn cứng mọi thứ sẽ bị đi vòng, tệ hơn không có cổng |
| `opportunity.md` phình thành PRD chết | cap 1 trang; frontmatter máy đọc là phần bắt buộc duy nhất |
| Eval sinh-đã-xanh khi keep | guard §7.3 — baseline bắt buộc, non-discriminating không tính evidence |
| Contract chép từ code prototype | guard §7.1 — context soạn contract không chứa diff |
| Code kế thừa lọt lưới review S4 | guard §7.2 — diffBase từ `base_commit` |
| Kế thừa im lặng vào `t3_paths` | §7.4 — không có lựa chọn giữ-nguyên |
| pm-skills thành hard dependency | §2 — cấm vào preflight S0; thiếu thì đi tiếp |
| Đụng slug giữa discovery và feature khác | dùng nguyên guard trùng-slug S0#3 hiện có (so `feature:`/`owner:`) |

## 11. Ngoài phạm vi / đã bác

- **Đảo mặc định sang GIỮ** — bác: fail-open, trả giá bằng độ đúng để tiết
  kiệm thứ đang rẻ đi (công AI dựng lại).
- **Giữ mặc định VỨT cứng** — bác: không khớp kỳ vọng v0 của đội; thay bằng
  xoá-mặc-định (§6.4).
- **Cây tài liệu discovery riêng ngoài `_acceptance/`** — bác: mất khả năng
  `/acceptance-status`/`report` nhìn thấy funnel.
- **Bảng điểm chấm cơ hội tự động (ICE/RICE máy chấm)** — không làm: Cổng 0
  là phán đoán người; framework chấm điểm là input tham khảo nếu người muốn
  (pm-skills `prioritization-frameworks` tự nạp khi hỏi).

## 12. Kế hoạch kiểm chứng (RED test trước khi sửa harness)

Chạy **tay** giai đoạn khám phá cho đúng 1 feature thật sắp làm: viết
`opportunity.md`, chạy `strategy-red-team`, dựng prototype có ngưỡng chết,
quyết Cổng 0 tay, rồi `/feature-loop <slug>`.

**Câu hỏi kiểm chứng duy nhất:** contract S1 có kế thừa được gì từ
`opportunity.md` không (ứng viên AC → criterion thật; out-of-scope → chép
sang; disposition → guard kích hoạt đúng)?

- Kế thừa được ⇒ triển khai §9 theo thứ tự 1→5.
- S1 vẫn viết lại từ đầu ⇒ mối nối ảo — DỪNG trước khi trả giá sửa 2 harness,
  quay lại thiết kế. (Đối chứng dương của chính spec này.)
