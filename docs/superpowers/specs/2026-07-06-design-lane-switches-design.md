# Cổng design Pareto — 2 công tắc lane (không field) — Design Spec

> Ngày: 2026-07-06 · Trạng thái: DRAFT chờ user review
> Phạm vi: design-loop + feature-loop + acceptance-gate next minor (đóng đợt cùng hoặc sau decision-ledger Đợt A)
> Không đụng: state machine (`contract.status`) · số human gate · schema contract (KHÔNG field mới)
> Liên spec: [2026-07-06-decision-ledger-design.md](2026-07-06-decision-ledger-design.md) — ledger là chỗ ghi rationale lane
> Đã qua: council 4-voice #2 (2026-07-06) — verdict sửa lớn thiết kế đã duyệt vòng hỏi (bỏ field tier, dời điểm quyết) — log §8

---

## 1. Vấn đề

Cổng design hiện tại **nhị phân và trói thứ-rẻ vào thứ-đắt**: regex trên `contract.surfaces`
→ hoặc armed **toàn bộ** (mockup + state-matrix + fidelity + panel Gate-2) hoặc **không gì cả**.

- **Over-trigger:** tweak nhỏ trên surface có sẵn (đổi copy, thêm field — loại feature web
  phổ biến nhất của solo dev) bị ép full ceremony → đúng loại "tốn nguồn lực không đổi lại
  kết quả" của mỏ neo Pareto.
- **Miss:** `surfaces` viết mơ hồ/bỏ trống → skip im lặng.
- **Incentive ngược:** vì full-ceremony là giá duy nhất, user lách bằng cách *không khai*
  `surfaces` → contract kém thật thà. Hợp pháp hóa đường rẻ = contract thật hơn.
- **Chi phí thật** của làn design nằm ở công NGƯỜI (vẽ mockup, phê panel) — script
  (static/fidelity) gần như miễn phí. Cổng chỉ đáng dựng cho phần người.

## 2. Quyết định đã chốt (vòng hỏi + council #2, 2026-07-06)

| # | Quyết định | Lựa chọn |
|---|---|---|
| Q1 | Hình cổng | Thang D0/D1/D2 → council sửa: **2 công tắc quan sát được**; D0/D1/D2 chỉ còn là **từ vựng hiển thị** (projection), KHÔNG lưu field |
| Q2 | Ai quyết, lúc nào | Human chốt **1 câu**, điểm quyết dời **S0 → cuối S1** (S0 là nơi ít thông tin nhất — files dự kiến còn mờ; cuối S1 đã có design-doc + contract + evals) |
| Q3 | Nội dung lane nhẹ | Static checks + screenshot/`observed` thường; KHÔNG mockup/provenance/fidelity-blocking/panel; state-matrix thay bằng vài dòng "surface & state chạm" trong design-doc |
| C1 | (council) Field `design_tier` | **Bác** — derived state, nguồn sự thật thứ hai, đòi lint đồng bộ 2 chiều + 3 chế độ song song trong guard |
| C2 | (council) Static | **Luôn-bật** khi chạm UI — thứ rẻ không cần cổng |
| C3 | (council) Fidelity advisory | **Chạy mọi lane** khi có reference — script vốn exit-0 khi thiếu provenance, bỏ nó là "tiết kiệm thứ miễn phí" |
| C4 | (council) Lint | Trên **trường máy-đọc** (provenance/evals executors), KHÔNG regex văn xuôi AC |
| C5 | (council) Guards | **1 bảng tra** đầu SKILL.md; mỗi guard giữ dạng nhị phân với ngưỡng — không 3-nhánh per-guard (8 guard × 3 = 24 nhánh văn, LLM rơi nhánh) |
| C6 | (council) Ledger | Quyết định lane **luôn ghi entry auto-draft** (máy viết sẵn, human chỉ xác nhận) — đóng incentive-ngược "gật theo máy để né viết rationale" + telemetry tín-hiệu-máy vs lựa-chọn-người từ ngày 1 |

## 3. Mô hình 2 công tắc

### 3.1 Công tắc 1 — UI-touch (rẻ, tự động, không hỏi ai)

- **Điều kiện bật:** feature chạm UI — `design-detect-surface.mjs` trên `contract.surfaces`
  như hiện tại (không nâng cấp proposal engine — đã bác).
- **Hành vi khi bật:** S1 thêm static evals per-surface vào `evals.yaml`
  (`config:executors.design.static` — token-only + contrast-AA + tap-target) + evidence
  screenshot/`observed` như mọi ui-check + eval `config:executors.design.gate`
  (P0 legibility floor — script trên cùng capture, gần miễn phí, floor không phụ thuộc
  ceremony). Design-doc ghi vài dòng "surface & state chạm".
- **Lưới FM-c (đủ-hứa-đủ-chạy):** ở lane nhẹ, eval static PHẢI kèm capture `--html`
  (contrast/tap là lý do tồn tại của lane). Thiếu capture → **BLOCKED**, không PASS-kèm-note
  "needs --html" (script hiện PASS token-only khi thiếu — thêm flag `--require-html`
  exit 3, eval-gen của lane nhẹ luôn truyền flag này).
- Repo **chưa wire** design-loop → warn 1 lần như nay, đi tiếp functional-only, việc
  static-không-chạy phải hiện trong gói Gate 2 (no-silent-green). CT2 mà
  `provenance.design_repo` không reachable → cảnh báo từ S0, trước khi tốn công S1-D.

### 3.2 Công tắc 2 — Design-of-record ceremony (đắt, human bật tường minh)

- **Điểm quyết: CUỐI S1**, chỉ hỏi khi công tắc 1 bật, đúng 1 câu:
  *"Surface mới / redesign → vẽ mockup design-of-record (ceremony đầy đủ)? Hay tweak
  surface có sẵn → đi static-only?"*
- **Bật** → đường D2 hiện tại NGUYÊN TRẠNG: `/design-mockup` (S1-D) trước Gate 1,
  state-matrix hard-gate, fidelity blocking, panel Gate-2. User chủ động chạy
  `/design-mockup` lúc nào cũng được = bật công tắc bằng hành vi.
- **Tắt (static-only)** → ledger entry `descope` **auto-draft**: máy điền signals
  (surfaces, lý do), decision, impact ("bỏ mockup/fidelity/panel — tiết kiệm công vẽ +
  phê; đổi lại không có chuẩn thị giác để so"); human chỉ xác nhận trong cùng câu trả lời.
  **Luôn ghi entry cho quyết định lane** (tắt = `descope`, bật = `approach`) — luôn thỏa
  rule đáng-log của spec ledger vì chọn lane nào cũng loại phương án kia; entry ghi cả
  tín hiệu máy lẫn lựa chọn người → sau ~10 feature có data thật đánh giá detect.

### 3.3 Nhận biết trạng thái — artifact là state, không field

- **Ceremony ON ⟺** `_acceptance/<slug>/evidence/design/provenance.json` tồn tại
  **∨** `evals.yaml` có executor `design.fidelity`.
- Hard-gate mockup + state-matrix (S1 #5, Gate-1, resume-guard) **chỉ áp khi ceremony ON**
  — điều kiện máy-đọc, không regex lời. AC perceptual dạng văn ("nhìn giống thiết kế")
  chỉ là tín hiệu **advisory phụ**: thấy mà ceremony OFF → nhắc user nâng lane, không tự chặn.
- **Từ vựng hiển thị** (card/docs): D0 = ¬CT1 · D1 = CT1∧¬CT2 · D2 = CT1∧CT2.
- Backward-compat **tự nhiên**: workspace cũ derive y hệt từ artifact sẵn có
  (provenance có → ceremony ON) — không migrate, không chế độ song song.

## 4. Guards — bảng tra duy nhất

Đặt 1 bảng đầu feature-loop SKILL.md; mỗi điểm 🎨 trong văn chỉ còn 1 câu nhị phân
tham chiếu bảng. design-subtrack SKILL.md per-stage đổi theo cùng 2 predicate.

| Điểm guard | Bật theo |
|---|---|
| S0 cảnh báo chưa-wire design-loop | CT1 |
| S1 thêm static evals + dòng "surface & state chạm" | CT1 |
| S1 câu hỏi lane (cuối S1, 1 câu) | CT1 |
| S1 #5 hard-check mockup + state-matrix | CT2 |
| Gate-1 hard-gate (mockup provenance + matrix) | CT2 |
| Resume-guard provenance | CT2 |
| S4 fidelity advisory (so reference nếu có) | CT1 (chạy khi reference tồn tại; skip-note thường khi không) |
| S4 gate P0 legibility floor | CT1 (chạy khi có capture) |
| S4 WARN rõ "fidelity KHÔNG chạy — thị giác chưa được so" | CT2 (chỉ ceremony mới hứa so-chuẩn) |
| Gate-2 panel onion-skin + AC perceptual guard + WARN fidelity-skip nêu lên đầu gói | CT2 |
| Gate-2 ghi lane (D0/D1/D2) + descope entry vào gói | CT1 |

Kèm: test bảng tra trong `tests/plugins/run-tests.sh` + ship 3 mirror **atomic**
(field-ở-bản-này-guard-ở-bản-kia là tệ hơn status quo — risk Pragmatist).

## 5. Lưới an toàn (chỉ giữ lưới máy/miễn phí — tránh D1 phình thành D2-lite)

| FM | Tình huống | Chốt chặn | Ghi chú |
|---|---|---|---|
| FM-a trượt im lặng | `surfaces` mơ hồ/trống nhưng feature có UI | (1) giữ S1 #5 end-check (điểm nhiều thông tin hơn S0); (2) lưới S4: diff đụng glob `design.surface_globs` (key mới, `/design-init` ghi, user chỉnh) mà không có design eval nào → **BLOCKED tier-mismatch**; key vắng → lưới skip + note (no-silent) | lưới (2) chạy bằng diff thật — nơi thông tin đầy đủ nhất |
| FM-b lint lời không tin được | AC perceptual viết mơ hồ không match pattern | primary = máy-đọc (§3.3); prose chỉ advisory-nhắc | |
| FM-c hứa 3 chạy 1 | static thiếu `--html` → PASS token-only | `--require-html` → BLOCKED (§3.1) | flag nhỏ vào design-static-check.mjs |
| FM-d redesign chui | 10 lần lane-nhẹ liên tiếp = redesign không ai so chuẩn | fidelity advisory chạy mọi lane khi reference cũ của surface tồn tại (miễn phí — script sẵn advisory exit-0); drift hiện ở note Gate-2 | |
| FM-e mâu thuẫn lane | evidence đòi hỏi không sản xuất được ở lane hiện tại | artifact thắng lời; eval không chạy được → BLOCKED sẵn có, không hạ cấp im lặng | |
| FM-f resume nửa chừng | workspace có provenance nhưng "chưa ai quyết lane" | không tồn tại — state derive từ artifact: provenance có = ceremony ON | ưu điểm chính của 0-field |
| Incentive-ngược ledger | human gật theo máy để né viết rationale | entry auto-draft máy viết — human không tốn công → hết lý do gật bừa; luôn-ghi → có data thật sau ~10 feature đánh giá chất lượng detect | Skeptic #2 surprise |

## 6. Ngoài phạm vi / đã bác (descope của chính spec này)

- **Field `design_tier` trong contract frontmatter** — bác: derived state / nguồn sự thật
  thứ hai / 3 chế độ backward-compat song song.
- **Proposal engine thông minh ở S0** — bác: S0 ít thông tin nhất; đầu tư detect không đáng
  (Pragmatist); detect script giữ nguyên vai công-tắc-1.
- **"Chỉ một dòng nhắc, bỏ câu hỏi human"** (Skeptic) — bác: chính Skeptic tự khai lỗ
  (quên-cả-hai → trượt im lặng = bệnh gốc); 1 câu cuối-S1 là rẻ và đóng lỗ.
- **Panel Gate-2 từ screenshot cho lane nhẹ** — bác: đắt cho bậc định nghĩa là rẻ.
- **Lane nhẹ advisory-only** — bác: contrast regression là bug thật bắt được rẻ.
- **Suy lane từ risk tier T1/T2/T3** — bác: risk chức năng ≠ nhu cầu thiết kế.
- **Chồng thêm lưới đỡ ngoài §5** — bác: Critic tự cảnh báo D1 phình thành D2-lite → user
  tắt guard hàng loạt.

## 7. Nơi chạm & tương thích

| File | Thay đổi |
|---|---|
| `feature-loop/skills/feature-loop/SKILL.md` | bảng tra §4 + câu hỏi cuối-S1 + guards đổi predicate + lưới S4 FM-a |
| `design-loop/skills/design-subtrack/SKILL.md` | per-stage theo 2 công tắc (S0 detect giữ; S1-D chỉ khi CT2) |
| `design-loop/scripts/design-static-check.mjs` | flag `--require-html` (exit 3 khi thiếu) |
| `design-loop/scripts/design-config-patch.mjs` | thêm key `design.surface_globs` (mặc định gợi ý từ repo, user chỉnh) |
| `commands/acceptance-card.md` (+ plugins/) | hiện lane (từ vựng D0/D1/D2) ở Gate 1 + descope entry (cơ chế render đã có từ spec ledger) |
| Mirror | 3 nơi atomic + test bảng tra trong `tests/plugins/run-tests.sh` |

**Tương thích:** không field mới, không migrate, workspace cũ derive từ artifact;
contract schema nguyên vẹn. `decisions.jsonl` vắng (repo chưa ship Đợt A ledger) →
quyết định lane vẫn hỏi ở cuối-S1 nhưng chỉ ghi vào design-doc, không entry — spec này
**phụ thuộc mềm** vào spec ledger (có ledger thì giá trị đầy đủ, không có vẫn chạy).

## 8. Council log #2 (truy vết, 2026-07-06)

- **Architect:** thang đúng chỗ cắt; nghi S0-ít-thông-tin, lint-theo-lời, guard 3-chiều.
- **Skeptic:** premise strike — "D1 không phải tier mà là executor rẻ luôn-bật; D2 tự lộ
  qua design-of-record; `design_tier` = derived state". *Tiếp thu:* bỏ field, static
  luôn-bật, 2 công tắc. *Bác:* "chỉ cần dòng nhắc" (tự khai lỗ trượt im lặng). *Surprise
  tiếp thu:* incentive-ngược của rule "lệch đề xuất mới ghi ledger" → C6 auto-draft luôn-ghi.
- **Pragmatist:** 8 guard × 3 nhánh = 24 nhánh văn LLM rơi → bảng tra 1 chỗ, guard nhị
  phân; đừng đầu tư detect thông minh; tweak-UI là nhóm feature đông nhất — giá trị chính
  là *hợp pháp hóa đường rẻ → contract thật thà hơn*; ship mirror atomic + test.
- **Critic (đã đọc 4 script nguồn):** FM-a..f + 2 phát hiện then chốt: quyết định phải dời
  về nơi nhiều thông tin (cuối S1/S4-diff), fidelity-advisory vốn miễn phí đừng cắt;
  tự cảnh báo không chồng lưới (D1 → D2-lite).
