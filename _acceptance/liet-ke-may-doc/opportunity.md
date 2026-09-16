---
schema_version: 1
slug: liet-ke-may-doc
feature: Mọi liệt kê trong hợp đồng phải máy-đọc
owner: phanlemanh@gmail.com
stage: decided
decision: park
decided_by: Mạnh
decided_at: 2026-09-16T02:19:29Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Danh sách hợp đồng hứa bị chép tay sang mảng test → hai bản trôi; vòng rà soát 2 của luu-kho-codex đã vá bốn lỗ cùng lớp. Đề bài đầy đủ: `docs/plans/2026-08-13-hat-giong-liet-ke-may-doc.md`.


> **ĐÃ GỘP 2026-09-16 (Mạnh) — đề bài dời trọn vào ô `mot-khuon-cho-ben-viet-va-ben-doc`.**
>
> Bốn ô cùng MỘT lớp — nguyên văn hình dạng (3) trong `CLAUDE.md`: *«bên VIẾT
> và bên ĐỌC của một artifact trôi khỏi nhau vì mọi test tự dựng fixture đúng
> khuôn bên đọc»*. Luật đó đã chỉ sẵn dạng nghiệm: một marker, hai bên cùng rút,
> ca round-trip. Bốn cổng riêng cho một dạng nghiệm là bốn lần hỏi người cho một
> lần quyết. Nội dung ô này giữ nguyên làm sử liệu.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
