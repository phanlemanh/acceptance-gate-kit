---
schema_version: 1
slug: ra-soat-lo-trinh
feature: Chủ kho mở thẻ khởi động và thấy ngay hàng nào của lộ trình cần rà soát — dời mốc, chờ điều kiện hay bác — kèm căn cứ máy đọc, mà máy không sửa tệp lộ trình và không thêm lượt gọi người
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Chủ kho mở thẻ khởi động và thấy ngay hàng nào của lộ trình cần rà soát — dời mốc, chờ điều kiện hay bác — kèm căn cứ máy đọc, mà máy không sửa tệp lộ trình và không thêm lượt gọi người

Vì sao: Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — lộ trình chỉ có cửa vào, không có cửa ra: OKR crm 125 hàng từng có, 1 hàng rời; 18–19/35 lần sửa lộ trình kit là xếp lại bằng tay. Hướng B′ chủ kho duyệt 14/10 (docs/findings/2026-10-14-kien-truc-roadmap-plugin.md)

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Ở lần mở thẻ đầu tiên sau mốc khép kế tiếp, mọi hàng của mốc đã khép mà chưa giao đều hiện đề xuất kèm căn cứ trên thẻ — chủ kho không phải hỏi «hàng nào cần dời»» chưa?
- Kết quả nào là SỐNG: [đề xuất] Ở lần mở thẻ đầu tiên sau mốc khép kế tiếp, mọi hàng của mốc đã khép mà chưa giao đều hiện đề xuất kèm căn cứ trên thẻ — chủ kho không phải hỏi «hàng nào cần dời»
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Ở lần mở thẻ đầu tiên sau mốc khép kế tiếp, mọi hàng của mốc đã khép mà chưa giao đều hiện đề xuất kèm căn cứ trên thẻ — chủ kho không phải hỏi «hàng nào cần dời»» khi hết timebox
- Timebox: [đề xuất] 2026-11-05 (mốc Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo)
