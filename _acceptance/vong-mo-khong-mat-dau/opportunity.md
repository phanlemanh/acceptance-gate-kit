---
schema_version: 1
slug: vong-mo-khong-mat-dau
feature: Dấu «đã đến», «chấp nhận», «kết lượt» không mất khi bộ canh nền đồng bộ kênh cùng lúc; hạn gõ sai bị từ chối kèm câu báo; đáp một yêu cầu cũ bằng lệnh mới tới đúng người hỏi và đóng vòng
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: GT2
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng GT2 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Phát hành kế sau 2.33.0 (số đặt lúc cắt) — giao tiếp giữa các phiên (GT1 đã gộp #387, GT2 vòng mở không mất dấu) và nháy đơn trong config (R3, đã gộp #384) — 22/10/2026.

Dấu «đã đến», «chấp nhận», «kết lượt» không mất khi bộ canh nền đồng bộ kênh cùng lúc; hạn gõ sai bị từ chối kèm câu báo; đáp một yêu cầu cũ bằng lệnh mới tới đúng người hỏi và đóng vòng

Vì sao: Gốc: acceptance-gate-kit/_acceptance/vong-mo-co-chu-giu/ — Ngoài-4, 5, 7, 9 ở Cổng Bằng chứng 19/10, chủ kho chọn «mở hợp đồng mới»; hạt giống docs/plans/2026-10-19-hat-giong-kenh-ghi-chong-dau-may.md, -han-go-sai-bi-lo.md, -dap-yeu-cau-cu-bi-nuot.md.

Gốc: acceptance-gate-kit/_acceptance/vong-mo-co-chu-giu/ — Ngoài-4, 5, 7, 9 ở Cổng Bằng chứng 19/10 của hồ sơ ấy, chủ kho
chọn «mở hợp đồng mới»; ba hạt giống ghi ngày 19/10 trích lại tên tệp ở `## Notes` của hợp đồng gốc.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «14 ngày sau khi crm nhận mốc có GT2: không vòng nào kẹt ở «chờ chấp nhận» khi người giao đã chấp nhận, và không lời đáp nào bị báo thành công mà không tới người hỏi» chưa?
- Kết quả nào là SỐNG: [đề xuất] 14 ngày sau khi crm nhận mốc có GT2: không vòng nào kẹt ở «chờ chấp nhận» khi người giao đã chấp nhận, và không lời đáp nào bị báo thành công mà không tới người hỏi
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «14 ngày sau khi crm nhận mốc có GT2: không vòng nào kẹt ở «chờ chấp nhận» khi người giao đã chấp nhận, và không lời đáp nào bị báo thành công mà không tới người hỏi» khi hết timebox
- Timebox: [đề xuất] 2026-10-22 (mốc Phát hành kế sau 2.33.0 (số đặt lúc cắt) — giao tiếp giữa các phiên (GT1 đã gộp #387, GT2 vòng mở không mất dấu) và nháy đơn trong config (R3, đã gộp #384))
