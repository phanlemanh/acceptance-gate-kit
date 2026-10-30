---
schema_version: 1
slug: kho-tri-thuc-va-lint
feature: Kho khai nơi để tri thức một lần; lint máy đọc kho tri thức theo khuôn một nguồn và đỏ đúng sáu lỗi cấu trúc, đường trỏ băm phân giải được ở mọi worktree
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-24T03:05:40Z   # chủ kho gõ «Cổng Đáng TT1–TT5: làm cả năm, ngưỡng và hạn theo đề xuất. Hạn hôm nay 25/10/2026.»
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TT1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TT1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Kho khai nơi để tri thức một lần; lint máy đọc kho tri thức theo khuôn một nguồn và đỏ đúng sáu lỗi cấu trúc, đường trỏ băm phân giải được ở mọi worktree

Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/

Vì sao: Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/ — ô VK1 không trỏ bản phạm vi hay báo cáo nghiên cứu (artifact ngoài git); onehub-invest/_acceptance/lo-trinh-2310/ — lượt cắt chung 23/10, bối cảnh dựng tay ở BOI-CANH.md mà ô không trỏ tới. Thiết kế: docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Trên kho thử dựng trong lượt chạy, mỗi lỗi trong sáu lỗi tiêm riêng làm lint đỏ với thông điệp ghim của đúng lỗi ấy, và kho lành cho lint xanh» chưa?
- Kết quả nào là SỐNG: Trên kho thử dựng trong lượt chạy, mỗi lỗi trong sáu lỗi tiêm riêng làm lint đỏ với thông điệp ghim của đúng lỗi ấy, và kho lành cho lint xanh
- Kết quả nào là CHẾT: chưa đạt «Trên kho thử dựng trong lượt chạy, mỗi lỗi trong sáu lỗi tiêm riêng làm lint đỏ với thông điệp ghim của đúng lỗi ấy, và kho lành cho lint xanh» khi hết timebox
- Timebox: 2026-10-25 — chủ kho đặt ở Cổng Đáng 24/10; bản phát hành kit chung với #400, #401, #402
