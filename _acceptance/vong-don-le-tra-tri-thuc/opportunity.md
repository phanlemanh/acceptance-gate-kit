---
schema_version: 1
slug: vong-don-le-tra-tri-thuc
feature: Vòng mở từ một câu mô tả tra được trang tri thức liên quan và sổ quyết định của các hồ sơ trước, rồi ghi vào cùng dòng «đã tra tri thức»
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TT5
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TT5 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Vòng mở từ một câu mô tả tra được trang tri thức liên quan và sổ quyết định của các hồ sơ trước, rồi ghi vào cùng dòng «đã tra tri thức»

Vì sao: Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/ — ô VK1 không trỏ bản phạm vi hay báo cáo nghiên cứu (artifact ngoài git); onehub-invest/_acceptance/lo-trinh-2310/ — lượt cắt chung 23/10, bối cảnh dựng tay ở BOI-CANH.md mà ô không trỏ tới. Thiết kế: docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Sau 10 hồ sơ có dòng «đã tra tri thức» ở các kho đã khai, ≥ 30 % có ít nhất một dòng căn cứ ở bước thiết kế trỏ trang tri thức hay sổ hồ sơ trước (đếm bằng can-cu-s1.cjs --dem)» chưa?
- Kết quả nào là SỐNG: [đề xuất] Sau 10 hồ sơ có dòng «đã tra tri thức» ở các kho đã khai, ≥ 30 % có ít nhất một dòng căn cứ ở bước thiết kế trỏ trang tri thức hay sổ hồ sơ trước (đếm bằng can-cu-s1.cjs --dem)
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Sau 10 hồ sơ có dòng «đã tra tri thức» ở các kho đã khai, ≥ 30 % có ít nhất một dòng căn cứ ở bước thiết kế trỏ trang tri thức hay sổ hồ sơ trước (đếm bằng can-cu-s1.cjs --dem)» khi hết timebox
- Timebox: [đề xuất] 2026-10-31 — bản phát hành kit chung với #400, #401, #402 (chủ kho 24/10: «Tầng tri thức được gom và Kit để cắt cùng phiên bản.»)
