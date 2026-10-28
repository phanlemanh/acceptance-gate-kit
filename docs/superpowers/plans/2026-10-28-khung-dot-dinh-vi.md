# Kế hoạch thi công — khung-dot-dinh-vi

Hồ sơ `_acceptance/khung-dot-dinh-vi/` (T2, làn V 28/10). Thiết kế: `docs/superpowers/specs/2026-10-28-khung-dot-dinh-vi-design.md`.
Bốn việc, tuần tự (việc sau đọc vật của việc trước) — `independent: false` cho cả bốn.

## Việc 1 — Ca đo trước vật (đỏ)
- Files: `tests/dieu-phoi/khung-dinh-vi.test.mjs` (KD-1 … KD-9, mỗi ca một cặp lành/đỏ trên bản sao trọn thư mục `dieu-phoi`).
- Verify: `node --test tests/dieu-phoi/khung-dinh-vi.test.mjs` — ĐỎ trên HEAD trước việc 2 (chưa có `hoi`, `chuKhung`, `--khung`).
- Phục vụ: E1–E5, E7–E10. `independent: false`.

## Việc 2 — Vật CLI + hàm vẽ
- Files: `dieu-phoi/scripts/hoi.mjs` (mới) · `dieu-phoi/scripts/dieu-phoi.mjs` (lệnh `hoi`, `hoi-xong`, `xem --khung`,
  `xem --json --khung`, khoá `hoi_chu_kho`) · `dieu-phoi/scripts/khung.mjs` (`canAnh`, `chuKhung`, `tuongDoi`, `nhomDay`,
  `tenViec`) · `dieu-phoi/scripts/nguon-hang.mjs` (`docTenViec`) · `dieu-phoi/scripts/hinh-dang.mjs` (khoá `muc_tieu`).
- Verify: việc 1 xanh; `node --test tests/dieu-phoi/khung.test.mjs` vẫn xanh (KH-03 `xem` không đổi).
- Phục vụ: E1–E5, E7–E10. `independent: false`.

## Việc 3 — Mod vẽ khung
- Files: `dieu-phoi/hooks/mod/khung.ts` (gọi `xem --json --khung`, pane vẽ `chuKhung`) · `tests/dieu-phoi/mod/khung.test.ts`
  (ca «pane dung chu khung») · `tests/dieu-phoi/kiem-khung.mjs` (chuỗi tiêm theo argv mới).
- Verify: `node tests/dieu-phoi/kiem-khung.mjs` xanh.
- Phục vụ: E6. `independent: false`.

## Việc 4 — Chỉ dẫn
- Files: `dieu-phoi/commands/tiep-tuc.md`, `dieu-phoi/commands/mo-dot.md`, `dieu-phoi/README.md`, `CHANGELOG.md`.
- Verify: đọc lại năm điều của E11; DP1-07 (lưới không-riêng-kho) xanh.
- Phục vụ: E11. `independent: false`.
