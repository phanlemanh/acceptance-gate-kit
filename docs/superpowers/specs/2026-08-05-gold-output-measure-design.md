# gold-output-measure — đo đầu-ra sổ vàng bằng máy + từ điển biệt ngữ lời ký

**Ngày:** 2026-08-05 · **Slug:** `gold-output-measure` · **Tier:** T2 ·
**Nguồn scope:** chốt tại Cổng 2 vòng judge-required-evidence (mục "MỞ CONTRACT
MỚI" trong Notes contract đó) — feature tiêu thụ #1 của pha Đo chương trình 80/20.

## Vấn đề

Ba món nợ có hồ sơ từ vòng 3:

1. **`render()` của `acceptance-gold.mjs` không phép đo máy nào chạm** (finding
   lens HIGH): test hiện hành chỉ đo `collectGold`/`agreement` qua `--json` và
   grep chỉ dẫn trong command — phần chữ trình NGƯỜI hỏng thì không gì đỏ.
2. **Per-lens tuyên quét lớp nhưng điểm-case** (finding lens MEDIUM): ma trận
   đồng thuận thiếu chiều per-lens và nhánh số-vote chẵn.
3. **Biệt ngữ trong lời ký làm J13-lớp không có đường PASS** : 12 mục
   required_evidence của J13 round 4 chỉ đích danh `known-limits`, `dogfood`,
   `single-source`, enum PASS/FAIL/UNCERTAIN trần, dòng per-lens nhồi một câu,
   danh sách noPanel nhồi slug. Luật N4 cấm viết lại lời người → đường PASS
   sạch là CHÚ GIẢI, không phải sửa quote.

Kèm 2 finding vặt đã known-limits: câu noPanel khẳng định nguyên nhân sai;
`--root` sai in sổ rỗng tự tin exit 0.

## Approach đã chọn (A) — gloss marker trong human-facing-language.md

Khối marker mới `SIGNOFF-JARGON-GLOSS` (dạng `term — chú giải ngắn`) đặt trong
`skills/acceptance/references/human-facing-language.md`; `render()` đọc file đó
theo **đường suy từ vị trí script** (`../skills/acceptance/references/…` — đúng
cả ở kit root lẫn mirror plugin, tức repo tiêu thụ cũng có), in khối "Từ điển"
cuối sổ CHỈ gồm term thật sự xuất hiện trong output. Term mới đồng thời vào
`HFL-GLOSSARY-TERMS` + mục CONTEXT.md — P96 hiện hành tự chốt quan hệ đó,
không phép đo mới.

Loại: (B) đọc CONTEXT.md runtime — CONTEXT.md không được sync vào plugin, chết
trên repo tiêu thụ; (C) hardcode map trong script — writer/reader trôi khỏi
nhau, đúng lớp lỗi matrix-measure-law đã luật hoá.

## Thay đổi render (tất cả additive, `--json` không đổi byte)

- Cột "Máy đề xuất": map một-chỗ `VERDICT_VI` → "đạt (PASS)" / "chưa đạt
  (FAIL)" / "chưa chắc (UNCERTAIN)"; giá trị lạ passthrough nguyên văn.
- "Theo góc nhìn": mỗi lens MỘT dòng riêng (N4).
- noPanel: mỗi việc một dòng tên sản phẩm (fallback slug), câu giải thích trung
  tính "chưa có biên bản hội đồng trong hồ sơ" — bỏ khẳng định nguyên nhân.
- `--root` không có `_acceptance/` → exit 2 + thông điệp ghim (root có
  `_acceptance/` rỗng vẫn là sổ trống hợp lệ exit 0).
- Khối "Từ điển" cuối sổ; HFL không đọc được → sổ vẫn in + 1 dòng ghi chú rõ.

## Phép đo (tests/plugins, theo luật đo-lường hiện hành)

Fixture code-sinh; đo QUAN HỆ vào⇒ra của stdout thật (không grep chuỗi độc
lập); ma trận viết-trước (số assert = số phần tử: 4 hình dạng đồng thuận × 2
chiều đếm per-lens; 3 enum + 1 lạ); mọi âm tính có đối chứng dương + thông điệp
ghim; corpus thật làm đối chứng đường-đọc-cũ (`--json` so byte trước/sau).

## Out of scope

- `judgedBlocks` tautology (P152) — thuộc đợt dọn nợ đo-lường đã ký known-limits.
- Gloss cho chuỗi máy tuỳ ý trong rationale trích dẫn (chỉ term trong danh mục).
- Viết lại / dịch lời người trong quote (N4 cấm).
- Đổi hook/evidence-core/lib, đổi khuôn human_override.
