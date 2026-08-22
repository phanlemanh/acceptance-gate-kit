---
schema_version: 1
slug: ban-do-dinh-chu-ky
feature: Bản đồ dính commit chữ ký, không đi sau
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

Commit ký Cổng Bằng chứng đổi trạng thái hồ sơ mà bản đồ vẽ sau → CI đỏ P122/P126, lặp ×2 trong một ngày (PR #49, #51). Đề bài đầy đủ: `docs/plans/2026-08-15-hat-giong-ban-do-dinh-chu-ky.md`.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
