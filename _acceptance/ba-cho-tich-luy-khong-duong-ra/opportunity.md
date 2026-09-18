---
schema_version: 1
slug: ba-cho-tich-luy-khong-duong-ra
feature: Ba chỗ tích luỹ không có đường ra — khoá config · dòng file kiểm · con số suite
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: park   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Mạnh
decided_at: 2026-09-18    # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> **Xếp lại (park) 18/09 (luật «ô chỉ mở khi có neo ngoài»).** Chưa kho nào gọi tên ô này —
> chữ giữ nguyên, không xoá. Mở lại = thêm dòng `Gốc:` vào section «Vấn đề & ai gặp» và
> đổi `decision:` về rỗng và `stage:` về `discovery`.

## Vấn đề & ai gặp

Ba chỗ trong kit chỉ có đường vào (thêm) mà không có đường ra (gỡ), nên chi phí kiểm tăng đơn điệu theo tuổi repo; người trả giá là mọi phiên chạy suite. Đề bài đầy đủ: `docs/plans/2026-08-21-hat-giong-ba-cho-tich-luy-khong-duong-ra.md`.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
