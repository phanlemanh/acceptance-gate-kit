# Kế hoạch — du-bao-dong-bang-theo-ma-moc (RM6b, T2)

Hợp đồng: `_acceptance/du-bao-dong-bang-theo-ma-moc/contract.md` (Cổng Phạm vi làn V, veto mở 16/10).
Thiết kế: `docs/superpowers/specs/2026-10-16-du-bao-dong-bang-theo-ma-moc-design.md`.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Ca đo DB-1…DB-8 hai chiều, commit TRƯỚC vật; thấy đỏ trên bộ đọc theo tên kèm ngày | `tests/scripts/lo-trinh-gio-may.test.mjs` | `GM_CASES=DB node tests/scripts/lo-trinh-gio-may.test.mjs` → các ca dời ngày FAIL đúng thông điệp ghim, DB-7 PASS | E1–E8 | false |
| 2 | Bộ đọc `ganDuBao` — dự báo về đúng một mốc theo mã hàng lúc đóng băng | `scripts/lo-trinh.mjs` | cùng lệnh → 20/20 PASS (mọi chiều đỏ bắt đúng nhát tiêm); `node tests/scripts/lo-trinh-gio-may.test.mjs` → 0 FAIL; bộ kiểm lộ trình lân cận xanh; `product-map.mjs --check` thoát 0 | E1–E8, E7b | false |

Thứ tự: 1 → 2 (TDD: chiều đỏ nằm trong lịch sử — commit ca đo đứng trước commit vật).
