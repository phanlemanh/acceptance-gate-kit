# Kế hoạch — o-mo-viec-mang-nguon (TT3)

Hợp đồng `_acceptance/o-mo-viec-mang-nguon/contract.md` · thiết kế
`docs/superpowers/specs/2026-10-24-o-mo-viec-mang-nguon-design.md`. T2, chạy tuần tự trong phiên chính (các task chạm
chung `scripts/tri-thuc.mjs` và bộ đo nên không task nào `independent`).

Thứ tự theo TDD: bộ đo trước (đỏ vì vật chưa có), rồi vật, rồi bộ đo xanh.

## Task 1 — bộ đo ON-1…ON-7 và khoá executor

- Files: `tests/scripts/o-mo-viec-mang-nguon.test.mjs` (mới), `_acceptance/config.yaml` (thêm khoá
  `executors.test.o_mo_viec_mang_nguon`, `executors.test.can_cu_s1_ca` — chỉ thêm).
- Verify: `node tests/scripts/o-mo-viec-mang-nguon.test.mjs` thoát 1, mọi ca đỏ vì vật chưa có (chiều đỏ trong lịch sử).
- Phục vụ: E1–E7, E8d. `independent: false`.

## Task 2 — khuôn và bên ghi/bên đọc dòng «Nguồn:»

- Files: `skills/acceptance/references/opportunity-template.md` (khối `OPP-NGUON-PREFIX` ở mục «Ký hiệu máy đọc»),
  `scripts/tri-thuc-nguon.cjs` (mới: `tienTo`, `napKhuonNguon`, `dungDongNguon`, `docDongNguon`).
- Verify: ON-7 phần bộ đọc; `node tests/scripts/lo-trinh.test.mjs` xanh.
- Phục vụ: E7. `independent: false`.

## Task 3 — chọn trang và kiểm nguồn bản phạm vi trong `scripts/tri-thuc.mjs`

- Files: `scripts/tri-thuc.mjs` (xuất `docFrontmatter`, `danhSach`; khối `chonTrang` + `kiemNguonPhamVi` sau `conTro`).
- Verify: `node tests/scripts/kho-tri-thuc-va-lint.test.mjs` xanh.
- Phục vụ: E1, E4, E5, E6, E8b. `independent: false`.

## Task 4 — mở ô ghi dòng «Nguồn:»

- Files: `scripts/lo-trinh.mjs` (`dungCoHoi` nhận `dongNguon`; lối CLI `--mo-o` tính dòng khi kho khai `tri_thuc` và
  hàng có `dot`, nạp lười).
- Verify: ON-1…ON-4, ON-7 xanh; `node tests/scripts/lo-trinh.test.mjs`, `node tests/scripts/road-map-de-dung.test.mjs` xanh.
- Phục vụ: E1–E4, E7, E8a, E8c. `independent: false`.

## Task 5 — răng phủ kiểm nguồn

- Files: `scripts/cat-luot.mjs` (CLI răng phủ gọi `kiemNguonPhamVi` khi kho khai `tri_thuc`).
- Verify: ON-5, ON-6 xanh; `node tests/scripts/can-cu-s1.ca.mjs` xanh.
- Phục vụ: E5, E6, E8d. `independent: false`.

## Task 6 — chữ hướng dẫn, bản đồ, lộ trình

- Files: `skills/acceptance/references/pham-vi-template.md`, `skills/cat-luot/SKILL.md`,
  `feature-loop/skills/feature-loop/SKILL.md` (một câu mỗi tệp), `docs/plans/lo-trinh-kit.json` (dời ngày mốc phát hành
  TT1–TT5 kèm `ly_do`), `PRODUCT-MAP.md`, `LO-TRINH.html` (vẽ lại bằng `node scripts/product-map.mjs --root .`).
- Verify: `node scripts/product-map.mjs --root . --check` thoát 0; trọn bộ đo ON-* xanh.
- Phục vụ: E8a. `independent: false`.
