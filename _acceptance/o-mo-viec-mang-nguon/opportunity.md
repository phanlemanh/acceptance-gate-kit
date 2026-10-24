---
schema_version: 1
slug: o-mo-viec-mang-nguon
feature: Ô mở từ một hàng của lượt cắt mang dòng «Nguồn:» trỏ đúng trang tri thức của hàng, và nguồn của bản phạm vi là trang tri thức có đường trỏ băm
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TT3
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TT3 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Ô mở từ một hàng của lượt cắt mang dòng «Nguồn:» trỏ đúng trang tri thức của hàng, và nguồn của bản phạm vi là trang tri thức có đường trỏ băm

Vì sao: Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/ — ô VK1 không trỏ bản phạm vi hay báo cáo nghiên cứu (artifact ngoài git); onehub-invest/_acceptance/lo-trinh-2310/ — lượt cắt chung 23/10, bối cảnh dựng tay ở BOI-CANH.md mà ô không trỏ tới. Thiết kế: docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Trên kho thử, ô mở từ hàng có đợt mang đúng trang nền, trang đợt và trang có mã của hàng; ô của hàng không thuộc đợt nào giống từng byte bản mở bằng bộ máy trước vòng» chưa?
- Kết quả nào là SỐNG: [đề xuất] Trên kho thử, ô mở từ hàng có đợt mang đúng trang nền, trang đợt và trang có mã của hàng; ô của hàng không thuộc đợt nào giống từng byte bản mở bằng bộ máy trước vòng
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Trên kho thử, ô mở từ hàng có đợt mang đúng trang nền, trang đợt và trang có mã của hàng; ô của hàng không thuộc đợt nào giống từng byte bản mở bằng bộ máy trước vòng» khi hết timebox
- Timebox: [đề xuất] 2026-10-31 — bản phát hành kit chung với #400, #401, #402 (chủ kho 24/10: «Tầng tri thức được gom và Kit để cắt cùng phiên bản.»)
