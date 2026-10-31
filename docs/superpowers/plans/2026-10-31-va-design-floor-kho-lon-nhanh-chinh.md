# Kế hoạch — va-design-floor-kho-lon-nhanh-chinh (#460)

Hồ sơ `_acceptance/va-design-floor-kho-lon-nhanh-chinh/` · T2 · thiết kế
`docs/superpowers/specs/2026-10-31-va-design-floor-kho-lon-nhanh-chinh-design.md`.

## Task 1 — ca đo trước vật (đỏ trên cây 2.36.0)

- Files: `tests/design-floor/kho-lon-nhanh-chinh.mjs`, `tests/design-floor/eval.sh`, `tests/design-floor/run-tests.sh`,
  `_acceptance/config.yaml` (sáu khoá `executors.script.va460_*`).
- Verify: `node tests/design-floor/kho-lon-nhanh-chinh.mjs` — commit này ĐỎ (LON-SUA, HONG-BON, KHAC-SUA, CU-DUNG,
  LOP-*), các ca bản gốc XANH.
- Phục vụ E1–E6. independent: false.

## Task 2 — vật

- Files: `scripts/design-floor-bac.mjs` (maxBuffer, ném lỗi, thoát 1), `scripts/design-floor-s4.mjs` (timBase đọc
  origin/HEAD, goiUi maxBuffer), `scripts/design-floor-s3.mjs` (sinh lại maxBuffer), `scripts/design-floor-s1.mjs`
  (maxBuffer, bắt lỗi ở main).
- Verify: `node tests/design-floor/kho-lon-nhanh-chinh.mjs` XANH; `node tests/design-floor/moc-s0-s1.mjs` và
  `moc-s3-s4.mjs` vẫn XANH.
- Phục vụ E1–E6. independent: false (cần Task 1).
