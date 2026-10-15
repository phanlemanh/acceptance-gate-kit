---
schema_version: 1
slug: cua-tin-hieu-giua-chien-dich
feature: Ý mới thợ hay người nêu giữa chiến dịch đi vào cửa tín hiệu và được trả «đã ghi, xử ở mốc khép» — không đẻ lượt phán; người gửi bằng /road-map:gui
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM3
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM3 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map hoàn tất theo B′ — ngày tính từ ước 32–40 giờ máy (RM2 8–10 · RM4 5–6 · RM5 6–7 · RM3 6–8 + M5 · RM6 5–6 · cắt bản 1,5–2); chủ kho gọi tên làm luôn 15/10 — 19/10/2026.

Ý mới thợ hay người nêu giữa chiến dịch đi vào cửa tín hiệu và được trả «đã ghi, xử ở mốc khép» — không đẻ lượt phán; người gửi bằng /road-map:gui

Vì sao: Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — lộ trình chỉ có cửa vào; chủ kho gọi tên «road-map hoàn tất theo B′, làm luôn» 15/10 (ADR 0025; docs/findings/2026-10-14-kien-truc-roadmap-plugin.md). B′ §10.

## Hôm nay ai gặp gì

Giữa một đợt, thợ nêu một việc phụ hay một việc mới thì gói điều phối trả «cần phán» cho MỌI ý
(`dieu-phoi/scripts/yeu-cau.mjs`: «việc phụ mới», «loại hang-moi cần phán») — giám sát bị đánh thức,
có khi leo lên chủ kho, dù ý đó không chặn việc nào đang chạy. Người (chủ kho) chưa có lệnh nào để
gửi một ý vào cửa tín hiệu: ý nêu giữa chừng hoặc thành lượt hỏi ngay, hoặc mất. Luật phân loại đã
có ở B′ §10 (chủ kho duyệt hướng 14/10, ADR 0025): chỉ việc **chặn** việc đang chạy mới được phán
giữa chừng; mọi ý khác vào cửa, trả «đã ghi, xử ở mốc khép».

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: ở đợt đầu tiên chạy bản kit chứa vòng này, ý mới KHÔNG chặn (việc phụ,
  việc mới — của thợ hay của người) còn đánh thức giám sát hay chủ kho không, và có ý nào rơi mất không?
- Kết quả nào là SỐNG: trong đợt ấy, 0 sự kiện «cần phán» sinh từ yêu cầu việc-phụ/việc-mới không
  khai chặn; mỗi yêu cầu như vậy có đúng một tệp trong cửa tín hiệu của kho và thợ nhận trả lời «đã
  ghi» ngay ở nhịp xét kế tiếp. Đọc bằng sổ sự kiện của đợt (`su-kien.jsonl`) đối chiếu thư mục nguồn
  của cửa tín hiệu.
- Chiều đỏ của chính ngưỡng: N = số yêu cầu việc-phụ/việc-mới không chặn trong đợt. N = 0 thì ngưỡng
  CHƯA ĐỌC ĐƯỢC — không được đọc thành «đạt».
- Kết quả nào là CHẾT: còn ≥ 1 lượt «cần phán» từ một ý không chặn, hoặc ≥ 1 ý không có chỗ trong cửa.
- Mốc nền: số sự kiện «cần phán» kiểu việc-phụ/việc-mới ở các đợt đã chạy — nhật ký đợt nằm ở máy
  M5, chưa đo (B′ §10); xin M5 trên issue #308.
- Timebox: đợt đầu tiên sau khi kho chạy đợt (crm, máy M5) cài bản chứa vòng này, chậm nhất
  2026-11-02 (14 ngày sau mốc 19/10). Hết hạn mà chưa có đợt nào → ghi «chưa đọc được», không phải chết.
