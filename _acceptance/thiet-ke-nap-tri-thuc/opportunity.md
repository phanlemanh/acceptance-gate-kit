---
schema_version: 1
slug: thiet-ke-nap-tri-thuc
feature: Bước thiết kế của mọi vòng ở kho đã khai tri thức ghi dòng «đã tra tri thức», và thẻ Cổng Phạm vi không mời duyệt khi thiếu dòng ấy
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-24T03:05:40Z   # chủ kho gõ «Cổng Đáng TT1–TT5: làm cả năm, ngưỡng và hạn theo đề xuất. Hạn hôm nay 25/10/2026.»
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TT4
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TT4 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Bước thiết kế của mọi vòng ở kho đã khai tri thức ghi dòng «đã tra tri thức», và thẻ Cổng Phạm vi không mời duyệt khi thiếu dòng ấy

Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/

Vì sao: Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/ — ô VK1 không trỏ bản phạm vi hay báo cáo nghiên cứu (artifact ngoài git); onehub-invest/_acceptance/lo-trinh-2310/ — lượt cắt chung 23/10, bối cảnh dựng tay ở BOI-CANH.md mà ô không trỏ tới. Thiết kế: docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Ma trận ô của thẻ: thiếu dòng thì ô quyết để trống và có cờ, đủ dòng đúng băm thì không cờ, máy không đọc được kho tri thức thì nhãn «không đọc được ở đây» và không chặn; hồ sơ không khai tri thức cho thẻ giống từng byte» chưa?
- Kết quả nào là SỐNG: Ma trận ô của thẻ: thiếu dòng thì ô quyết để trống và có cờ, đủ dòng đúng băm thì không cờ, máy không đọc được kho tri thức thì nhãn «không đọc được ở đây» và không chặn; hồ sơ không khai tri thức cho thẻ giống từng byte
- Kết quả nào là CHẾT: chưa đạt «Ma trận ô của thẻ: thiếu dòng thì ô quyết để trống và có cờ, đủ dòng đúng băm thì không cờ, máy không đọc được kho tri thức thì nhãn «không đọc được ở đây» và không chặn; hồ sơ không khai tri thức cho thẻ giống từng byte» khi hết timebox
- Timebox: 2026-10-25 — chủ kho đặt ở Cổng Đáng 24/10; bản phát hành kit chung với #400, #401, #402
