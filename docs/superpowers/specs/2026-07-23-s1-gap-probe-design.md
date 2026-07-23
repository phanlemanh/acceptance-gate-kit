# Gap-probe S1 (phản biện context sạch) — Design

**Date:** 2026-07-23

**Status:** Approved in chat (sketch + 10 case đã duyệt); written-spec review pending

**Target:** skill `feature-loop` (bước S1 mới + Gate 1 + resume) + `gate-card.js`
(khối card mới, acceptance-gate) + docs card/GUIDE

**Compatibility:** feature-loop 1.13.0 → 1.14.0 · acceptance-gate 1.17.0 → 1.18.0
(bump minor tại thời điểm ship, TƯƠNG ĐỐI so với manifest lúc đó — wave đang bay
có thể đổi số tuyệt đối; luật lockstep + pin suite áp như GUIDE). Không đụng
design-loop, không đụng Gate 2 evidence-page.

## 1. Vì sao

Câu hỏi truy-lỗ-hổng **giả-định-sẵn-thiếu-sót** ("điều gì thiếu sót trong bộ
artifact này?") hiệu quả nhất ngay **trước điểm cam kết** — lỗ phát hiện lúc còn
trên giấy sửa mất một buổi, phát hiện ở S4 mất một round, sau ship có khi không
sửa nổi. Feature-loop hiện có 2 chỗ phê bình (review code S4, judge panel) nhưng
**không có phê bình đối kháng nào ở tầng thiết kế** — đúng điểm giá trị nhất:

- `superpowers:brainstorming` Spec Self-Review là **checklist đóng soi
  cái-đã-viết** (placeholder / mâu thuẫn / mơ hồ / scope). Mục **vắng mặt hoàn
  toàn** (kiểu "thiếu hẳn chiến lược nạp kho") lọt qua cả 4 phép kiểm — không có
  placeholder nào đánh dấu thứ chưa từng được viết. Và nó do chính context vừa
  viết spec tự chấm — trái nguyên tắc doer ≠ grader của kit.
- `morphological-scan` (CT-S) là **liệt kê có hệ thống** (điền đủ ô không gian
  AC) — không phải **đối kháng trên bản nháp cuối**. Hai mode bổ trợ, không thay
  thế nhau.

Bước mới thể chế hóa thao tác thủ công đã chứng minh giá trị (một câu hỏi đúng
lúc tìm ra 6 lỗ xếp hạng trong design 5 phần), thành bước tất định one-pass.

## 2. Quyết định thiết kế (đã duyệt trong chat)

| Trục | Quyết định |
|---|---|
| Vị trí | Bước **S1#7**, sau #6 (CT1/CT2 checks), TRƯỚC render thẻ Gate 1 |
| Điều kiện | Đúng công tắc **CT-S** sẵn có (`risk_tier ∈ {T2,T3}`) — không thêm công tắc mới; T1 đã thoát S0 |
| Mặc định | Bước mặc định, đảo-mặc-định như CT-S: bỏ = entry `descope` AUTO-DRAFT, quên = không thể |
| Cơ chế | **1 subagent fresh** (Agent tool — không Workflow), one-pass cứng |
| Input | CHỈ 4 file: design doc, `contract.md`, `evals.yaml`, `decisions.jsonl`. CẤM hội thoại, CẤM code repo (critic phán artifact, không audit code) |
| Model | Phiên chính; đọc `feature_loop.models.critic` nếu có (role optional mới) |
| Output | `_acceptance/<slug>/gap-probe.md` (§4) |
| Card | Khối "Phản biện context sạch" ở Cổng 1, pattern y khối Coverage; vắng → cờ vàng, không chặn (§5) |
| Agent lỗi | Retry 1; vẫn lỗi → `verdict: probe-failed`, cờ vàng, KHÔNG chặn gate |
| Pre-mortem T3 | KHÔNG thêm lens riêng — preset `risk-premortem` của morphological-scan đã phủ |

## 3. Spec bước S1#7 (văn bản chèn vào feature-loop SKILL.md)

Chèn sau S1#6, giữ giọng nén của file:

> 7. **(CT-S — bước mặc định khi T2/T3) Phản biện context sạch (gap-probe), TRƯỚC
>    khi render thẻ Gate 1:**
>    - Dispatch 1 subagent fresh (Agent tool; model = phiên, hoặc
>      `feature_loop.models.critic` nếu config có). Input CHỈ 4 file: design doc +
>      `contract.md` + `evals.yaml` + `decisions.jsonl` (ledger vắng → bỏ qua).
>      CẤM đưa hội thoại brainstorm, CẤM bảo agent đọc code repo — critic phán
>      artifact, không audit code (code chưa tồn tại).
>    - Prompt giữ đủ 6 ý: (1) giả định sẵn CÓ thiếu sót — "liệt kê điều thiếu sót
>      trong bộ artifact này, xếp theo độ nặng"; (2) scope guard: CHỈ lỗ hổng làm
>      chính feature này fail acceptance hoặc làm Gate 1 duyệt sai — không
>      wishlist/feature mới; (3) mỗi finding đủ 4 trường: artifact
>      (design|contract|evals) · kịch bản fail cụ thể · severity P0/P1/P2 · thước
>      đo đề xuất — thiếu kịch bản fail = LOẠI; (4) cross-check bắt buộc: AC nào
>      không có eval đo · GWT nào không đo được · trục Coverage nào không có AC;
>      (5) cap 5 finding; verdict `clean` (không còn lỗ đáng kể) là kết quả HỢP LỆ;
>      (6) KHÔNG lật quyết định đã seal/`descope` trong ledger trừ khi nêu được
>      lý do MỚI.
>    - Ghi `_acceptance/<slug>/gap-probe.md` — frontmatter `slug / at (ISO UTC) /
>      verdict: clean|findings|probe-failed / p0 / p1 / p2` + section `## Findings`
>      bảng `| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |`
>      (cell không chứa `|`; `clean` → 1 dòng "Không còn lỗ đáng kể") — rồi ĐỊNH
>      ĐOẠT từng finding, điền cột Xử lý: **P0 = sửa artifact ngay HOẶC
>      `human-gate1` (đẩy human quyết) — không im lặng**; P1/P2 = `fixed: <gì>` |
>      `deferred: <ghi chú>` (entry `revisit` nếu thỏa rule đáng-log) |
>      `rejected: <lý do 1 dòng>`. Sửa xong artifact KHÔNG re-probe (one-pass) —
>      phần code đã có 3 round S4.
>    - Agent lỗi → retry 1; vẫn lỗi → ghi file với `verdict: probe-failed` (thẻ
>      hiện cờ vàng, không chặn gate).
>    - User chủ động bỏ bước → entry `descope` AUTO-DRAFT ("bỏ gap-probe — <lý do
>      1 dòng>; đổi lại không có phản biện context sạch trước duyệt"), KHÔNG tạo
>      file.

Kèm 2 sửa nhỏ cùng file:

- **Gate 1:** thêm 1 câu vào đoạn render card: thẻ Cổng 1 nay gồm khối "Phản
  biện context sạch" (findings + xử lý, hoặc cờ vàng khi vắng/probe-failed).
- **Resume (bảng state, hàng `draft`):** thêm 1 câu: nếu THIẾU `gap-probe.md` và
  ledger không có entry `descope` có `decision` bắt đầu `"bỏ gap-probe"` (quy ước
  nhận diện máy-đọc, khớp AUTO-DRAFT ở trên) → cờ vàng trên thẻ + hỏi user 1 câu
  có chạy bổ sung không; KHÔNG tự chạy, KHÔNG chặn (workspace cũ trước 1.14.0 đi
  đường này — NOTE, không bắt migrate).
- **S4 models line:** thêm role `critic` vào danh sách role hợp lệ của
  `feature_loop.models` (dùng ở S1, không truyền vào workflow S4).

## 4. Format `_acceptance/<slug>/gap-probe.md`

```markdown
---
slug: <slug>
at: <ISO UTC>
verdict: clean | findings | probe-failed
p0: <int>
p1: <int>
p2: <int>
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | ... | ... | ... | fixed: thêm AC-6 |
```

- Cột Xử lý ∈ `fixed: <gì>` · `deferred: <ghi chú>` · `rejected: <lý do>` ·
  `human-gate1`. Main loop điền — agent chỉ trả findings.
- `verdict: clean` → section Findings ghi đúng 1 dòng "Không còn lỗ đáng kể".
- **Giới hạn v1:** cell KHÔNG chứa ký tự `|` (parser split đơn giản); dòng vi
  phạm bị bỏ và card đếm vào `parse_dropped` (hiện cờ) — không lỗi cứng.

## 5. Card Gate 1 (`gate-card.js`)

- **Extract JSON** thêm field:
  `gap_probe: { present, verdict, p0, p1, p2, rows: [{sev, artifact, summary, disposition}], parse_dropped, descoped }`
  (`present:false` khi file vắng; `descoped` = ledger có entry descope prefix
  `"bỏ gap-probe"` — bước translate/overlay cần biết để không phạt oan).
- **Render** khối `Phản biện context sạch` đặt NGAY SAU khối "Độ phủ AC", cùng
  pattern lab/grp hiện có:
  - `findings` → mỗi row 1 dòng `Sev · summary — xử lý`;
  - `clean` → 1 dòng dương "Phản biện: không còn lỗ đáng kể";
  - vắng file / `probe-failed` / `parse_dropped>0` → cờ vàng tương ứng ("chưa có
    phản biện" / "phản biện không chạy được" / "N dòng finding không đọc được");
  - riêng vắng file NHƯNG ledger có entry `descope` với `decision` bắt đầu
    `"bỏ gap-probe"` → KHÔNG cờ vàng, render 1 dòng trung tính "đã bỏ phản biện
    theo <id entry>" (dấu vết hiện, không phạt quyết định chủ động).
- Thẻ vẫn CHỈ là lớp trình bày — không quyết, không ghi. Overlay plain-language
  dịch summary sang ngôn ngữ sản phẩm như các khối khác.
- Docs đồng bộ: `commands/acceptance-card.md` + card SKILL.md (bản plugins/ +
  bản codex) thêm 1 gạch mô tả khối mới trong bước translate.

## 6. Trường hợp đã suy luận (10 case — cơ sở duyệt sketch)

| # | Trường hợp | Hành vi |
|---|---|---|
| 1 | Lỗ P0 thật (thiếu AC / AC không eval / thiếu mục design) | Bắt trước Gate 1, sửa trên giấy — điểm sửa rẻ nhất |
| 2 | Design tốt thật | `clean` hợp lệ tường minh, tín hiệu dương trên thẻ → duyệt nhanh hơn |
| 3 | Critic chế lỗ thỏa giả định | Finding không kịch-bản-fail = loại; cap 5; có escape hatch |
| 4 | Wishlist / nở scope | Scope guard + `rejected` kèm lý do hiện trên thẻ — human phân xử |
| 5 | Lật quyết định đã chốt | Ledger + Out-of-scope là input; challenge cần lý do MỚI |
| 6 | Vòng vá–phê–vá | One-pass cứng; code đã có 3 round S4 |
| 7 | Agent chết | Retry 1 → `probe-failed` + cờ vàng, không chặn — hạ tầng không chặn nghiệp vụ, không im lặng |
| 8 | Resume `draft` | File có → dùng lại; thiếu → cờ vàng + offer, không tự chạy, không bắt migrate |
| 9 | User bỏ bước | `descope` AUTO-DRAFT — bỏ có dấu vết trên thẻ |
| 10 | Chi phí | 1 agent × 1 lượt × 4 file input — rẻ hơn hẳn 1 round S4 REJECT muộn |

Nguyên tắc nền giữ nguyên: doer ≠ grader — main loop viết artifact, context sạch
phê, human quyết.

## 7. Phạm vi sửa

| File | Sửa gì |
|---|---|
| `feature-loop/skills/feature-loop/SKILL.md` | S1#7 + 1 câu Gate 1 + 1 câu resume + role `critic` |
| `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` | bước tương đương Codex-native (spawned worker; không worker routing → `probe-failed`) |
| `scripts/gate-card.js` (root nguồn) | parser gap-probe.md + extract field + render khối + cờ |
| `commands/acceptance-card.md`, card SKILL.md ×2 | 1 gạch khối mới |
| `GUIDE.md` | 1 đoạn ngắn mô tả bước + trỏ spec này |
| Mirrors | `scripts/sync-plugin-packages.sh` (plugins/ + codex + feature-loop-codex) |
| Tests | Case mới trong suite card (render khối, cờ vàng khi vắng, parse_dropped) — RED trước GREEN |
| Version | Bump minor 2 plugin + pin suite (P03/P06/P22/P27...) + chạy đủ 8 suite |

## 8. Out of scope / giới hạn v1 (chuẩn F)

- KHÔNG hook/CI enforce sự tồn tại `gap-probe.md` — cờ vàng trên thẻ là đủ v1;
  hook recheck là ứng viên v2 khi có dữ liệu bước bị bỏ qua thường xuyên.
- KHÔNG re-probe tự động sau khi sửa artifact; KHÔNG probe cho T1; KHÔNG đụng
  Gate 2 / evidence-page.
- Parser bảng v1 split `|` — cell chứa `|` bị bỏ dòng + cờ (không lỗi cứng).
- KHÔNG thêm pre-mortem agent riêng cho T3 (tránh trùng preset `risk-premortem`).
- Hai mặc định đã chọn có thể đảo sau: agent-lỗi-không-chặn; một-lens-duy-nhất.
