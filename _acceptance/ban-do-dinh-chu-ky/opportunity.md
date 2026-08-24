---
schema_version: 1
slug: ban-do-dinh-chu-ky
feature: Bản đồ dính commit chữ ký, không đi sau
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: kill    # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-08-23T12:36:37Z     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Commit ký Cổng Bằng chứng đổi trạng thái hồ sơ mà bản đồ vẽ sau → CI đỏ P122/P126, lặp ×2 trong một ngày (PR #49, #51). Đề bài đầy đủ: `docs/plans/2026-08-15-hat-giong-ban-do-dinh-chu-ky.md`.

> **ĐÃ BÁC 2026-08-23 (Manh Phan) — hố này đã được lấp, ý hết việc.**
>
> Rà hàng đợi theo North Star ngày 23/08 cho thấy tiền đề không còn đúng. Cả hai
> thân cổng người nay dặn vẽ lại bản đồ **sau khi ghi field cổng, TRƯỚC khi
> commit**, nên bản đồ đi cùng lượt chữ ký chứ không đi sau; ca đo `P122` canh
> đúng điểm-làm-mới đó ở mọi thân cổng. Đo thực địa cùng ngày: vòng
> `start-bang-dieu-khien` đóng hai cổng người, vẽ lại bản đồ hai lần, **0 lần
> đỏ** `P122`/`P126`.
>
> Bác chứ không xếp lại: hố đã lấp thì không có gì để quay lại. Ai gặp lại
> `P122` đỏ trong tương lai thì đó là hố KHÁC — mở ô mới, đừng dựng lại ô này.
>
> Mầm gốc `docs/plans/2026-08-15-hat-giong-ban-do-dinh-chu-ky.md` giữ nguyên
> làm sử liệu.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
