---
schema_version: 1
slug: hoi-theo-mat-phang
feature: Hỏi-theo-mặt-phẳng — câu hỏi là thứ người bấm được, không phải khuôn chữ
owner: phanlemanh@gmail.com
stage: decided
decision: kill
decided_by: Mạnh
decided_at: 2026-09-16T02:19:29Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Khối VIỆC CỦA ANH là một form chữ trong khi harness có cơ chế hỏi-bấm-được; owner phải gõ một lượt thay vì một chạm. Đề bài đầy đủ: `docs/plans/2026-08-14-hat-giong-hoi-theo-mat-phang.md`.


> **ĐÃ BÁC 2026-09-16 (Mạnh) — cái đau đã tan, giống hệt ô `don-ton-kho-pr`.**
>
> Ô mở 14/08 vì «khối VIỆC CỦA ANH là một form chữ, owner phải gõ một lượt thay
> vì một chạm». Hai việc đã xảy ra từ đó, cả hai đều đã ký:
>
> 1. Khối form **đã bị cắt** khỏi tin mời cổng — hồ sơ
>    `cat-khoi-viec-cua-anh-tren-tin`, tự khai «chỉ TRỪ». Chẩn đoán của nó là
>    «bảo hiểm cho một tin viết dở, trả phí ở mọi tin».
> 2. Câu gộp (`GATE-ONESHOT-GRAMMAR`) đưa người về đúng thứ luật đòi: *«cái
>    người gõ là Ý MUỐN — một chạm, một chữ, không phải cú pháp»*.
>
> Bằng chứng tươi nhất, đo trong chính phiên rà 16/09: ở hai lượt cổng liên
> tiếp owner trả lời bằng **hai chữ** và **bốn chữ**. Mục tiêu «≤1 chạm/lượt»
> đã đạt mà không cần bộ phận nào.
>
> Cái còn lại của ô là đổi «gõ một chữ» thành «bấm một nút» — một món CỘNG buộc
> kit vào cơ chế hỏi của MỘT harness cụ thể, trong khi kit phải chạy được ở mọi
> harness.
>
> **Ngưỡng mở lại (đang đếm):** đo được một lượt cổng mà người phải gõ **nhiều
> hơn một câu**.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
