# Kế hoạch — ve-lo-trinh-doc-tin-hieu-cua-cay (VA2, vá 2.32.1)

Hợp đồng: `_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/contract.md` (duyệt 17/10). Bốn việc, tuần tự (cùng tệp).

## Việc 1 — Ca đỏ trước (independent: false)

- Files: `tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs` (mới).
- Ca VT-1…VT-4 + bốn chiều đỏ; commit RIÊNG trước vật để lịch sử có chiều đỏ.
- Verify: chạy tệp ca trên cây chưa vá → VT-1, VT-2, VT-3 FAIL đúng thông điệp, VT-4 PASS.
- Phục vụ E1, E2, E3, E4.

## Việc 2 — Bộ vẽ chỉ đọc ý đã theo dõi (independent: false)

- Files: `scripts/tin-hieu.mjs` (`tepTheoDoi`, cờ `chiTheoDoi` của `docTinHieu`/`dungDuong`), `scripts/product-map.mjs`
  (`veTrangLoTrinh` bật cờ).
- Verify: `node tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs` → 8 PASS, 0 FAIL.
- Phục vụ E1, E2, E3, E4.

## Việc 3 — Ca RM3b bỏ chân bộ vẽ (independent: false)

- Files: `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs` — bỏ vòng product-map trong `ca2`, chú thích trỏ về
  hồ sơ này. Không sửa hồ sơ đã ký của RM3b.
- Verify: `node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs` → mọi GW PASS.
- Phục vụ E3b.

## Việc 4 — Tài liệu (independent: false)

- Files: `skills/acceptance/references/lo-trinh-du-lieu.md` (một câu: mảng `tin_hieu` chỉ mang ý đã theo dõi trong cây
  vẽ trang), chú thích mã ở hai tệp vật.
- Verify: `node tests/scripts/tin-hieu.test.mjs` xanh (TH-8 đọc khối tài liệu), `product-map.mjs --check` xanh.
