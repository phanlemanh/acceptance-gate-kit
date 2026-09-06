# judge-required-evidence — thiết kế (vòng 3 chương trình 80/20, gộp gold-seed O4)

*2026-08-05 · **T2** (chạm acceptance-verify.js, judge-personas,
evidence-report-template, gate-card.js, acceptance-report, SKILL 2 harness —
không file nào trong t3_paths) · Nguồn: [chương trình 80/20](../../plans/2026-08-05-nang-cap-8020-graph-loop.md)
mục O3 + O4. Baseline B5: verdict UNCERTAIN/FAIL hiện là TRẦN — 0% kèm
danh-sách-bằng-chứng-thiếu, round fix sau judgment-FAIL phải đoán. Baseline
B6: gold set 0 điểm — mọi lần người lật/chuẩn y verdict máy tại Cổng 2 đang
bị vứt.*

## Cơ chế A — judge trả bằng-chứng-thiếu (O3)

1. **Schema + prompt:** `VERDICT_SCHEMA` thêm field `required_evidence`
   (mảng chuỗi, optional trong schema — bắt buộc theo NGHI THỨC khi verdict
   ≠ PASS). Prompt judge (fan-out lens) + persona v1 trong judge-personas.md
   cùng quy định: FAIL/UNCERTAIN PHẢI kèm ≥1 mục, mỗi mục là MỘT bằng chứng
   cụ thể + chỗ lấy nó ("nếu có mục này, verdict đổi") — không phải lời
   khuyên chung chung. PASS không bắt buộc.
2. **Thiếu thì nổ to, không bịa:** judge không-PASS mà bỏ trống → script
   KHÔNG tự điền; memo/report ghi rõ "(judge không nêu bằng-chứng-thiếu)" —
   fail-visible cho người và cho đo O3.
3. **Memo:** dòng `kind:panel` trong run-log mang `required_evidence`
   per-vote; carry P3 giữ nguyên field (carried panel không rụng danh sách).
4. **Render:** template evidence-report thêm dòng `required_evidence:` trong
   block judgment (một chỗ trong template — không token nào dính bẫy L1
   CONSISTENCY của hook); gate-card Cổng 2 hiện "Bằng chứng còn thiếu" bằng
   tiếng sản phẩm cho judgment item có danh sách.
5. **Đóng vòng:** SKILL (2 harness): round fix sau REJECT/khi panel FAIL —
   đọc `required_evidence` từ run-log/report và bổ sung ĐÚNG bằng chứng đó
   trước, không đoán mò nguyên nhân judgment.

## Cơ chế B — gold-seed + báo cáo G3 (O4) — thuần DẪN XUẤT, không file mới

`scripts/acceptance-gold.mjs` (acceptance-gate): đọc corpus `_acceptance/*/`
sẵn có, KHÔNG ghi gì:

- **Gold set:** mỗi block judgment trong evidence-report có
  `human_override` thật → 1 điểm `(slug, evalId, máy đề xuất = verdict máy,
  người quyết + lý do = nội dung override)`. Corpus hiện tại đã có ≥7 điểm
  (delta-verify-repin 3, matrix-measure-law 4, các feature trước) — vật thật
  cho phép đo, không chờ tương lai.
- **G3 — đồng thuận judge:** đọc dòng `kind:panel` trong run-log: tỉ lệ
  3/3-đồng-thuận · 2/1 · phân kỳ, per-lens FAIL/UNCERTAIN rate. Run-log cũ
  không có dòng panel → slug ghi "chưa có dữ liệu panel", không crash
  (đường đọc-cũ).
- `/acceptance-report` gọi script này, in 2 khối bằng tiếng người (đã có
  luật nạp human-facing-language).

## Đường đọc-cũ (bắt buộc — bất biến schema CLAUDE.md)

Report/run-log/panel cũ KHÔNG có field mới → mọi reader (hook, recheck,
card, gold, report) chạy y như trước, không VIOLATION oan, không migrate.
Hook evidence-core KHÔNG đổi (field mới là additive trong block eval —
hook vốn bỏ qua field lạ).

## Ngưỡng sống/chết (DP-1 — khai trước)

- **GO:** (1) dogfood — run-log S4 của CHÍNH vòng này (script nguồn): mọi
  dòng `kind:panel` có proposal ≠ PASS đều mang `required_evidence` không
  rỗng; (2) acceptance-gold trên corpus THẬT trả ≥7 điểm gold + ≥5 panel
  cho G3; (3) 0 hook/luật nào phải nới (không chạm t3_paths).
- **Đo chương trình (O3, sau ship):** các feature kế — 100% verdict judgment
  mới không-PASS có required_evidence[]; không feature nào cần round thứ 3
  vì cùng-nguyên-nhân-judgment. O4: sau 5 feature ≥10 điểm gold, báo cáo G3
  ra từ /acceptance-report không cần audit riêng.
- **NO-GO:** phải sửa hook/evidence-core để field mới đi qua → dừng (đường
  đọc-cũ vỡ = thiết kế sai).

## Out of scope

- Máy TỰ HÀNH ĐỘNG theo required_evidence trong cùng round (chỉ đóng vòng ở
  round fix — máy không tự đi gom bằng chứng giữa chừng panel).
- Persist gold set thành file riêng / index mới (nói KHÔNG theo charter —
  dẫn xuất từ artifact sẵn có là đủ; ghi file = thêm seam đồng bộ).
- Đổi khuôn chữ ký người / human_override (dòng human-owned bất khả xâm).
- Semantic matching giữa required_evidence và evidence có sẵn (LLM tự đọc ở
  round fix — không xây matcher máy).
