# Kế hoạch — anh-co-that-trong-ho-so

Hồ sơ: `_acceptance/anh-co-that-trong-ho-so/` · thiết kế: `docs/superpowers/specs/2026-10-22-anh-co-that-trong-ho-so-design.md`.
Thứ tự TDD: ca đo trước (đỏ trên vật cũ), rồi vật. Mọi task phụ thuộc nhau (`independent: false`) — chạy tuần tự.

| Task | Files | Verify | Phục vụ |
|---|---|---|---|
| T1 ca đo LNT7–LNT10 + LNT4(b) ghi ảnh thật | `tests/plugins/lop-nhin-thay.test.mjs` | `LNT_CASES=LNT7,LNT8,LNT9,LNT10 node tests/plugins/lop-nhin-thay.test.mjs` ĐỎ trên vật cũ, đúng tên hàng | E1–E8, E10 |
| T2 bộ xét ảnh một nguồn | `scripts/anh-ho-so.cjs` (mới) | `node -e` gọi `xetAnh` trên vài giá trị | E1, E2 |
| T3 thẻ dùng bộ xét | `scripts/gate-card.js` | LNT7 hàng thẻ xanh; LNT4 xanh | E1–E4, E6, E8 |
| T4 trang dùng bộ xét | `scripts/evidence-page.js` | LNT7 hàng trang xanh | E5, E6, E8 |
| T5 lệnh đo kho | `tests/scripts/anh-co-that-kho.mjs` (mới) | LNT10 xanh; chạy trên kho tiêu thụ thật qua `.acceptance-runs/kho-do` | E9, E10 |
| T6 suite + bản đồ | — | `bash tests/plugins/run-tests.sh --manh vung:3`, `node scripts/product-map.mjs --root . --check` | mọi eval |
