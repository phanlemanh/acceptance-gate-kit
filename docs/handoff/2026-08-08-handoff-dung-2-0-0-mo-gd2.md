# Handoff 2026-08-08 — GĐ1 DỪNG có chủ đích, GĐ2 mở thẳng trên 1.39.0

> Nối tiếp (không thay thế) charter tái lập
> [2026-08-07-handoff-tai-lap-va-trien-khai-doi.md](2026-08-07-handoff-tai-lap-va-trien-khai-doi.md).
> Mọi ràng buộc charter giữ nguyên: lab đóng băng, chỉ-TRỪ-không-CỘNG,
> minutes không đáng tin, đội giữ version đang cài.

## GĐ1 = DỪNG CÓ CHỦ ĐÍCH (không phải thất bại kỹ thuật đơn lẻ)

- `tai-lap-ceremony-diet` chạy **5 vòng S4 đều REJECT** (r1 PENDING-JUDGMENT,
  r2–r5 REJECT; sign-batch fail-open đổi da 4 lần; sweep-phút sót vật mang
  đến tận vòng cuối). Luật-chót người khoá kích hoạt tại r5: **hồ sơ để
  REJECT, không ký, không re-pin, không thông báo #2, không r6.**
- Lý do dừng ghi sổ: *luật dừng phải được tôn trọng đúng lần nó đắt; ROI GĐ1
  âm (5 vòng cho đợt tiết-kiệm-vòng) là dữ liệu.* Hai bài học rút gọn ở
  [docs/findings/2026-08-08-viec-tru-can-grep-sweep-va-parser-tu-che.md](../findings/2026-08-08-viec-tru-can-grep-sweep-va-parser-tu-che.md).

## Công việc nằm ở đâu

- **Nhánh `release/2.0.0-wip`** (origin) — toàn bộ 2.0.0 dở: 1a/1c/1d đã
  dựng + KPI pickaxe đã vá 2 đợt, sign-batch ĐÃ XOÁ (descope, làm lại 2.1),
  manifests 2.0.0, 5 bộ evidence + 29 mục ledger + sổ quyết định đầy đủ.
  Suites local xanh 2 tầng tại đầu nhánh — nhưng KHÔNG có chữ ký Cổng 2.
- **`origin/main` giữ nguyên `b313868`** (engine 1.39.0/1.27.0) — hai máy
  A/B và 4 repo tiêu thụ tiếp tục an toàn, không việc gì phải làm.

## Việc còn treo (mốc 2.1 — KHÔNG làm trước GĐ2)

- Ledger `tai-lap-ceremony-diet#13/#14/#22–#29`: mốc cũ "2.0.1" đã gom về
  **2.1**, cùng chỗ với 1b-làm-lại trên `lib/workspace-record.js` (một reader
  frontmatter dùng chung với pre-merge — input thiết kế từ 4 lần đổi da).
- Khi mở lại 2.x: làm việc-TRỪ bằng **grep-sweep toàn cây chứng minh tập
  rỗng** trước, một lượt verify sau (bài học 1); đừng quên khối Print của
  acceptance-report và description 7 manifest (hai vật mang bị sót cuối cùng).

## GĐ2 mở thẳng trên 1.39.0

- Theo charter: GĐ2 = feature THẬT ở repo tiêu thụ đi trọn vòng trên bản
  đang cài (1.39.0/1.27.0) — không chờ 2.0.0. Repo thí điểm chưa chốt
  (OneFlow / Artifact Platform / MapPoster / FloorPlanStudio).
- Điều kiện mở lại lab (≥3 feature thật đi trọn vòng) đếm trên 1.39.0.
- Ghi nhận vận hành cho vòng GĐ2: làn máy của workflow-harness kill suite
  plugins dài (~10') 3 lượt liên tiếp dù local xanh — repo tiêu thụ suite
  ngắn hơn nên ít rủi ro, nhưng nếu gặp exit lạ (144/−1) thì đối chiếu
  local trước khi tin máy đỏ.
