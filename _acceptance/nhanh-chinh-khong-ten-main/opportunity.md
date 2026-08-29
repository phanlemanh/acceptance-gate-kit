---
schema_version: 1
slug: nhanh-chinh-khong-ten-main
feature: Bước chuẩn bị dữ liệu chấm phải dò được nhánh chính không tên main
owner: manh@mstar.vn
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Người dùng kit trên repo mà nhánh chính không tên `main` (vd `master`) và không
với được remote: bước chuẩn bị dữ liệu chấm dừng ngay ở tên đầu tiên với lỗi
mờ, thay vì tự thử các tên khác như lời khai. Nguyên nhân đã định vị: cửa
fail-closed của `s4-args.mjs` gọi thoát-tiến-trình nên nhánh `catch` của vòng
dò không bao giờ chạy — danh sách bốn tên chỉ còn hiệu lực cho tên đầu; kèm
lệnh hỏi remote không có trần thời gian. Đã tái lập trên fixture (hai người soi
độc lập cùng chỉ ra, Cổng Bằng chứng hồ sơ cham-dung-cay-dung-cho-dung 29/08,
mục Ngoài-1/Ngoài-4 trong `_acceptance/cham-dung-cay-dung-cho-dung/review-findings.md`).
Owner xếp ngăn: mở hợp đồng mới.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
