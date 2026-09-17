---
schema_version: 1
slug: rang-moc-neo-theo-ho-so
feature: Răng của hồ sơ mốc phát hành neo theo lúc hồ sơ ra đời, không theo số phiên bản ở cây — để hồ sơ mốc đã ký không đỏ giả ở mốc kế
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

# Cơ hội: răng của hồ sơ mốc neo theo lúc hồ sơ ra đời

**Mở:** 2026-09-17, từ Ngoài-7 của mốc `release-2-15-0` — owner quyết «mở hợp đồng mới» tại
Cổng Bằng chứng.

## Vấn đề & ai gặp

Răng `_acceptance/release-2-15-0/rang-cua-so.mjs` (hai chân `vendored` và `viec-meta`) và
`rang-goal.mjs` suy neo là «lần cắt số trước» — commit mới nhất đổi dòng version mà số tại đó
khác số ở cây. Neo ấy tương đối với số ở cây. Sau khi mốc 2.16.0 cắt số, neo trượt sang lần cắt
2.15.0: chân `viec-meta` thấy tập hồ sơ vòng của cửa sổ 2.15 → 2.16 và đòi khớp khối khai của
hồ sơ 2.15.0, chân `vendored` so cửa sổ mới, `rang-goal` so khuôn mới với chính nó. Hồ sơ đã ký
đỏ giả mãi mãi ở mọi lượt ghim lại sau đó.

Đây là cùng lớp owner đã cắt ở mốc 2.14.0 (chân 4 của `rang-moc.sh`: «tương đối với HEAD nên hồ
sơ đã ký đỏ giả vĩnh viễn ở chiến dịch ghim lại kế»). `rang-so-tang.sh` đã có khuôn đúng: neo
theo commit đưa hồ sơ mốc vào kho.

Người hưởng: owner và phiên cắt mốc — lượt ghim lại của một hồ sơ mốc cũ không đỏ vì hạ tầng,
không tốn một lượt điều tra mỗi mốc. Gây ra bởi phản biện ở lượt chấm 1 của mốc 2.15.0
(`_acceptance/release-2-15-0/review-findings.md`).

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Neo theo commit đưa hồ sơ mốc vào kho giữ được cả hai lời hứa của răng ở mọi HEAD sau | răng phải đổi lời hứa, không chỉ đổi neo | chạy răng trên một cây dựng giả có thêm một lần cắt số sau hồ sơ | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

Không đo được — việc nội bộ của bộ công cụ, không có người dùng cuối; đo bằng lượt ghim lại của hồ sơ mốc 2.15.0 sau khi mốc 2.16.0 cắt số.

## Out of scope từ khám phá

- Chiến dịch ghim lại toàn kho — R3, không chạy ở dạng hiện tại.
