# cross-feature-claim-index — thiết kế V1

*2026-07-29 · T2 · Approach A (index dẫn xuất, không persist) — chốt trong
brainstorm cùng ngưỡng sống/chết DP-1. Nguồn gốc: gap G1 trong
[docs/research/2026-07-29-graph-engineering-karpathy-anthropic.md](../../research/2026-07-29-graph-engineering-karpathy-anthropic.md).*

## Mục tiêu & lợi ích (đã chốt với user)

Bài học lớp-lỗi hiện chết ở ranh giới slug: lớp "assertion âm tính" tái xuất
≥9 lượt, lớp "thước-gắn-vật" đốt 4 round S4 (~1.9M token/round) dù đều đã
được ghi thành văn xuôi. V1 cho gap-probe S1 tra được bài học của các feature
trước bằng máy, chặn lớp lỗi cũ ở S1 (giá vài nghìn token) thay vì ở S4.

Khung 3 tầng: **đo bằng (a)** giảm round S4 · **thiết kế cho (c)** schema
claim chuẩn ngay V1 · **trình bày tối thiểu cho (b)** claim vào gói text
Gate 1, KHÔNG chạm gate-card.js.

## Ngưỡng sống/chết (DP-1 — khai trước, không sửa sau khi chạy)

**Cửa sổ đo:** 3 feature T2/T3 kế tiếp chạy trọn S1, hoặc 30 ngày sau ship —
cái đến trước. **GO khi đủ CẢ 3:** (1) ≥1 finding gap-probe trích claim-id
từ feature KHÁC với Xử lý `fixed` hoặc `human-gate1` được người xác nhận
đáng; (2) tỉ lệ finding-có-trích-claim bị `rejected` < 50%; (3) ≤10 claim /
~2k token mỗi lần nạp, scan < 5 giây. **NO-GO bất kỳ:** zero trích dẫn trọn
cửa sổ (→ gỡ input 5, giữ script chạy tay) · `rejected` ≥ 50% trên ≥2
feature · probe hỏng vì input 5 không vá được trong 1 lần. **Vùng giữa**
(trích mà toàn deferred/rejected): chỉnh bộ lọc đúng MỘT lần, đo thêm 2
feature. **Luật đo:** chỉ đếm từ `gap-probe.md` + `decisions.jsonl` của slug
mới (vật được giao); finding trích claim bị human bác ở Gate 1 tính về
NO-GO kể cả agent khai `fixed`.

## Approach A — vì sao (đã loại B, C)

Index là **view dẫn xuất**, không persist: nguồn-sự-thật vẫn là
`decisions.jsonl` + `gap-probe.md` gốc (append-only sẵn) → cả lớp lỗi
drift/stale **không tồn tại về mặt cấu trúc** — đúng lớp repo này đánh nhau
nhiều nhất (P30, stale-evidence, re-pin). Không artifact mới = không nghĩa
vụ đường-đọc-cũ, không CI check mới. B (persist + check drift kiểu P30) trả
chi phí tầng (c) trước khi tầng (a) chứng minh sống. C (claim write-time
per-slug) chạm hot-path vòng lặp + cần migration — hình hài V3.

## Thành phần

### 1. `feature-loop/scripts/claim-scan.mjs` (mới)

CLI: `node claim-scan.mjs --root <repo> --slug <slug-đang-xét> [--json]`
(mặc định in markdown cho người; `--json` cho máy/test).

Pipeline (thứ tự cố định): **parse → lọc loại → exclude-self → dedupe →
sort → cap → serialize → exit**.

- **Nguồn V1:** `_acceptance/*/decisions.jsonl` lấy entry `type ∈ {fix,
  descope}` · `_acceptance/*/gap-probe.md` lấy dòng bảng `## Findings` của
  file `verdict: findings`. KHÔNG đọc run-log.jsonl, review-findings.md
  (V2 — Out of scope).
- **Dòng JSONL hỏng / bảng khác khuôn:** skip từng dòng + ĐẾM TO (stderr
  `claim-scan: skipped N malformed lines in <file>`), không crash, không im.
- **Exclude-self:** slug trong `--slug` bị loại — claim của chính feature
  đang xét đã nằm trong 4 input sẵn của gap-probe.
- **Dedupe:** theo `id` (ledger đã có id duy nhất; finding lấy `<slug>#F<n>`
  theo thứ tự dòng bảng).
- **Sort:** severity trước (P0 > P1 > P2 > không-sev), recency sau (`at`
  giảm dần; finding lấy `at` frontmatter gap-probe.md).
- **Cap:** 10 claim; mỗi trường text cắt 250 ký tự (`…` khi cắt); tổng
  serialize mục tiêu ≤ ~2k token. **Sàn đa dạng nguồn** (thêm giữa S3, ledger
  `d-…-fix sàn đa dạng`): mỗi nguồn có ứng viên giữ tối thiểu min(3, số có)
  slot — vì mọi finding gap-probe mang sev còn ledger thì không, top-10
  thuần sev sẽ đuổi sạch bài học ledger (CS9 bắt trên corpus thật).
- **Corpus rỗng / file vắng / workspace cũ thiếu gap-probe.md:** hợp lệ —
  output rỗng, exit 0 (kit là engine: repo tiêu thụ mới toanh phải chạy được).
- **Exit:** 0 kể cả khi có dòng skip; ≠0 chỉ khi lỗi thật (root không tồn
  tại, --slug thiếu).

### 2. Schema claim (tầng (c) — hợp đồng của output, không phải file DB)

```json
{"id":"d-20260728T154945Z-3400 | s4-scope-triage#F2",
 "source":"ledger | gap-probe",
 "slug":"premerge-unjudged-pass",
 "kind":"fix | descope | finding",
 "stage":"S4-r2 | S1 | …",
 "sev":"P0 | P1 | P2 | null",
 "at":"ISO-8601",
 "claim":"decision / Thiếu gì + Kịch bản fail (cắt 250)",
 "lesson":"impact / Xử lý (cắt 250)",
 "serves":["AC-4"],
 "pointer":"_acceptance/<slug>/decisions.jsonl | _acceptance/<slug>/gap-probe.md"}
```

Bản markdown (nạp cho agent): khối `## Bài học từ feature trước (advisory)`,
mỗi claim 1 bullet `- [<id>] (<slug> · <stage|sev> · <kind>) <claim> —
<lesson>`. **`[<id>]` là đơn vị trích dẫn** — agent cite nguyên văn.

### 3. Tích hợp SKILL.md feature-loop (S1#7)

- Bước chuẩn-bị probe: chạy claim-scan → file tạm → **input thứ 5**.
- Scan exit ≠0 / timeout: probe VẪN chạy với 4 input như cũ + gap-probe.md
  frontmatter thêm `claims_input: failed` (1 dòng note trong gói Gate 1 —
  không chặn, không probe-failed vì input 5).
- Corpus rỗng (output không có claim): truyền hay không đều được — quy ước:
  KHÔNG truyền input 5, không note (im lặng hợp lệ, repo mới là bình thường).
- Prompt gap-probe thêm ý (7): *claims là ADVISORY từ feature khác — không
  phải luật, không được dùng để lật seal/descope của feature đang xét;
  finding nào dựa trên claim PHẢI cite `[<id>]` nguyên văn trong cột
  Thiếu gì hoặc Kịch bản fail.* (Cite nguyên văn = đường đo GO/NO-GO.)
- Codex parity: V2 (descope có vết — bản Codex chưa có claim input).

### 4. Đo lường

Grep pattern id: `\[(d-[0-9TZ]+-[0-9]+|[a-z0-9-]+#F[0-9]+)\]` trên
`gap-probe.md` các slug mới → scorecard GO/NO-GO điền tay cuối cửa sổ đo
(khuôn V1-journal của discovery).

## Error handling — bảng chốt

| Tình huống | Hành vi |
|---|---|
| JSONL hỏng từng dòng | skip + đếm to stderr, exit 0 |
| gap-probe.md khác khuôn bảng | skip file + đếm to, exit 0 |
| verdict: clean / probe-failed | bỏ qua file (không có finding) |
| Workspace thiếu file | bỏ qua, không note |
| Corpus rỗng | output rỗng, exit 0, không truyền input 5 |
| --slug thiếu / root sai | exit ≠0 + thông điệp |
| Scan chết trong S1#7 | probe chạy 4 input + `claims_input: failed` |

## Testing

Test sống ở `tests/workflows/` (suite của package feature-loop). Hai bất
biến CLAUDE.md áp toàn bộ: (1) fixture `_acceptance/` giả do **code sinh**
trong test, không chép tay; (2) mọi assertion âm tính (skip dòng hỏng,
exclude-self, cap…) có **đối chứng dương** — bản fixture nguyên vẹn phải ra
đúng claim TRƯỚC, và ghim đúng thông điệp (đếm skip, id có mặt/vắng), không
chỉ exit code. Thêm 1 smoke trên corpus thật của repo (5 slug hiện có):
exit 0, ≤10 claim, có ít nhất 1 id `d-…` và 1 id `#F`.

## Out of scope (V1)

- Nguồn `review-findings.md` + `run-log.jsonl` (parser markdown 3-ngăn dễ
  vỡ — đúng seam vừa dính lỗi ở s4-scope-triage round 6; run-log thuần cơ học).
- Semantic matching claim ↔ surfaces/paths của feature mới (nút chỉnh "vùng
  giữa" của DP-1; corpus 5 slug chưa cần).
- Persist index (`--write`) + render card Gate 1 (V2, chờ GO).
- Codex parity (bản feature-loop-codex).
- LLM gán nhãn lớp-lỗi trong scanner (Never — giao cho agent tiêu thụ).
- Trí nhớ xuyên repo (Never — vi phạm bất biến "kit là engine").
