---
schema_version: 1
slug: lenh-in-ra-phai-bam-duoc
feature: Lệnh in ra phải bấm được — một nguồn tên lệnh (/<plugin>:<tên>) cho mọi điểm bàn giao, cộng bốn mục TRỪ nhiễu thẻ và finding B/C
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Owner bấm lệnh trên thẻ/câu trả lời của kit mà lệnh không khớp tên harness đăng ký (dạng trần `/start` thay vì `/acceptance-gate:start`; `uat-session <slug>` không có dấu gạch) — mỗi lần là một lượt gõ lại tay. Đề bài đầy đủ: `docs/plans/2026-08-22-hat-giong-lenh-in-ra-phai-bam-duoc.md`.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
