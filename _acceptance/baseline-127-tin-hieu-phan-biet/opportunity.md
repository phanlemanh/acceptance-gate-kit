---
schema_version: 1
slug: baseline-127-tin-hieu-phan-biet
feature: Mã 127 ở làn đối chứng là tín hiệu phân biệt, không phải hạ tầng hỏng
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

Khi tính năng mới thêm hẳn một lệnh/script chưa tồn tại ở bản cũ (ca rất phổ
biến), làn đối chứng chạy lệnh đó trên bản cũ sẽ ra mã 127 — đó chính là bằng
chứng «đỏ trên bản cũ», loại bằng chứng so-sánh-trước/sau đáng tin nhất cho
người ký. Nhưng bộ phân loại hạ-tầng-hỏng (thêm ở hồ sơ
cham-dung-cay-dung-cho-dung) coi 127 là hạ tầng ở MỌI làn, nên báo cáo ghi
nhầm thành «không đo được»: hai làn đọc cùng một mã theo hai nghĩa trái ngược.
Đã tái lập bằng harness, đối chứng dương với mã 1 (hai người soi độc lập cùng
chỉ ra, Cổng Bằng chứng 29/08, mục Ngoài-2/Ngoài-5 trong
`_acceptance/cham-dung-cay-dung-cho-dung/review-findings.md`). Owner xếp ngăn:
mở hợp đồng mới.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
