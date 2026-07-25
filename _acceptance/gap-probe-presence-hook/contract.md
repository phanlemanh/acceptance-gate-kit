---
schema_version: 1
feature: Hook recheck enforce gap-probe presence at Gate-1 approve
slug: gap-probe-presence-hook
risk_tier: T2
surfaces: hooks
status: draft
owner: manh@mstar.vn
---

## Criteria

- AC-1: Given contract T2/T3 và `gap-probe.md` tồn tại với verdict `clean` hoặc `findings`, When edit contract set `status: approved`, Then hook cho qua không cảnh báo gap-probe.
- AC-2: Given contract T3 có frontmatter `gap_probe_expected: true`, THIẾU `gap-probe.md` và ledger không có entry descope `"bỏ gap-probe"`, When set `status: approved`, Then hook CHẶN (exit 2) kèm thông điệp hướng dẫn chạy S1#7 hoặc ghi descope.
- AC-3: Given contract T2 (có `gap_probe_expected: true`) thiếu cả file lẫn entry descope, When approve, Then hook in NOTE nhắc nhưng KHÔNG chặn.
- AC-4: Given ledger có entry `descope` decision bắt đầu `"bỏ gap-probe"` (khớp case-insensitive, trim khoảng trắng đầu — cùng luật với card), When approve không có file, Then hook cho qua với NOTE 1 dòng trỏ id entry.
- AC-5: Given `gap-probe.md` có `verdict: probe-failed`, When approve, Then hook in NOTE "duyệt không có phản biện" nhưng KHÔNG chặn.
- AC-6: Given thông điệp chặn/nhắc của hook, When người mới đọc, Then hiểu được bước tiếp theo phải làm gì. (judgment)
- AC-7: Given contract KHÔNG có frontmatter `gap_probe_expected` (workspace sinh trước 1.19 hoặc ngoài feature-loop), When approve thiếu cả file lẫn entry descope, Then hook chỉ in NOTE, KHÔNG BAO GIỜ chặn (backward-tolerant chuẩn F — enforce cứng chỉ khi artifact có field mới).
- AC-8: Given contract T1 hoặc contract không có field `risk_tier`, When approve, Then hook bỏ qua hoàn toàn kiểm tra gap-probe (exit 0, không NOTE, không chặn).

## Coverage

- Trục trạng thái probe: có file verdict clean/findings | vắng file | probe-failed | descope entry | file có nhưng verdict thiếu/rác [state 5 — chờ human Gate 1 chọn chặn/NOTE] [thước CE: spec §5 các nhánh cờ của card]
- Trục tier: T1 (bỏ qua) | T2 (NOTE) | T3 (chặn) [thước CE: triết lý leo thang dần của GUIDE]
- Trục marker: có `gap_probe_expected` (enforce) | không có (NOTE tối đa — legacy) [thước CE: GUIDE chuẩn F]

## Out of scope

- Enforce ở CI pre-merge — đã có 2 lớp (thẻ + hook), xem entry descope.
- Auto-run probe từ hook — hook chỉ chặn/nhắc, không dispatch agent.
