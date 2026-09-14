---
schema_version: 1
slug: ba-cho-cat-sau-chu-ky-cua-so-2-13
feature: Ba chỗ cắt SAU CHỮ KÝ cho cửa sổ 2.13 — re-pin theo diff · routing-baseline không đỏ vì hồ sơ mới · dòng 1 đo tới lên-main + ship chạy nền
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

Phiên ship `release-2-12-0` (14/09) mất hơn 60 phút từ chữ ký tới lên main cho vật xanh từ lượt chấm 1: làn re-pin chạy trọn corpus tuần tự (12 phút một làn, bốn làn), fixture routing-baseline đỏ vì hồ sơ mới rồi sửa nó lại làm evidence hoá cũ, và đoạn quyết-được → trên-main không nằm trong dòng nào của năm dòng số. Người trả giá: owner chờ sau khi đã ký; máy chạy lại thứ không đổi. Đề bài đầy đủ: `docs/plans/2026-09-14-hat-giong-ba-cho-cat-sau-chu-ky-cua-so-2-13.md`.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: chữ ký → trên-main của một hồ sơ mốc còn bao nhiêu phút, và bao nhiêu làn re-pin bị chạy lại.
- Kết quả nào là SỐNG: ≤ 15 phút, đúng một làn re-pin ghi được.
- Kết quả nào là CHẾT: vẫn cần sửa fixture sau chữ ký, hoặc còn làn bị giết ở trần 600 s.
- Timebox: quyết ở mốc 2.13 — vá-trong-mốc hay để cửa sổ 2.14.
