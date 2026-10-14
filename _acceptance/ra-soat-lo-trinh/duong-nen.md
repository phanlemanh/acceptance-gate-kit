---
slug: ra-soat-lo-trinh
at: 2026-10-14T13:32:34.183Z
sha: 8d2cdd5e17fc70dc769b78eacf04f3cb4bc71876
nen: do
cong_cu: xanh
suite: do
luoi: do
engine: do
---

## Dòng đỏ

- nen suite: DO SAN executors.test.plugins_vung_2 ma 1
- nen suite: DO SAN executors.test.plugins_vung_3 ma 1
- nen luoi: 2 vi pham co san
- VIOLATION [moc-la-chien-dich]: verdict=REJECT (must be PASS to merge)
- VIOLATION [ra-soat-lo-trinh]: hồ sơ có bằng chứng nhưng status chưa arm cổng — status=draft; PR đổi code chịu cổng (commands/start.md…) mà hồ sơ trong PR chưa arm. Cổng chỉ chấm hồ sơ ở implemented/verified/signed-off, hồ sơ này đang tàng hình. Đặt status: implemented để cổng chấm, hoặc gỡ evidence-report.md / tách hồ sơ khỏi PR nếu bằng chứng thuộc phạm vi đã bỏ.
- nen engine: LECH lib/out-of-contract.cjs (vendored ≠ dang-chay)
- nen engine: LECH scripts/lo-trinh.mjs (vendored ≠ dang-chay)
