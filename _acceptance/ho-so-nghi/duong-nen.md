---
slug: ho-so-nghi
at: 2026-09-19T11:22:29.652Z
sha: 351b99f7b0d46c52f9e40e554600117a9487504a
nen: do
cong_cu: xanh
suite: xanh
luoi: do
engine: xanh
---

## Dòng đỏ

- nen luoi: 2 vi pham co san
- VIOLATION [ho-so-nghi]: hồ sơ có bằng chứng nhưng status chưa arm cổng — status=approved; PR đổi code chịu cổng (lib/workspace-record.cjs…) mà hồ sơ trong PR chưa arm. Cổng chỉ chấm hồ sơ ở implemented/verified/signed-off, hồ sơ này đang tàng hình. Đặt status: implemented để cổng chấm, hoặc gỡ evidence-report.md / tách hồ sơ khỏi PR nếu bằng chứng thuộc phạm vi đã bỏ.
- VIOLATION [ra-co-ten-lam-va-trao]: evidence is stale — code changed after verify (verified_commit b950f6643e253a691021612b5c5cabfe86cc4dda); re-run verify before merge. Changed:
