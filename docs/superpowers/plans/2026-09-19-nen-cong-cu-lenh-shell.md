# Plan — nen-cong-cu-lenh-shell

T2 · 4 task, TUẦN TỰ (không task nào `independent: true`: ca phải đỏ trước khi
có mã, và ca đột biến đọc marker do task 2 đặt vào).

## T1 — sáu ca mới vào `tests/scripts/duong-nen.test.mjs` (RED)

- Files: `tests/scripts/duong-nen.test.mjs`
- Phục vụ: E1 E2 E3 E4 E5 E6 E9 (AC-1 AC-3 AC-4 AC-5 AC-6 AC-9)
- `independent: false`
- Ca, tất cả trên fixture lành của NEN0, mỗi ca đổi ĐÚNG một biến:
  - `NEN-TD1` từ đầu là `${BIEN_KHONG_CO:-$(…)}/echo …` và lệnh chạy được → chân xanh, 0 bullet cong-cu
  - `NEN-TD2` `khong-co-lenh-nay-xyz --x | head -n 1` → vẫn đỏ, ghim đúng tên
  - `NEN-TD3` từ đầu mở nhóm `(cd . && echo …)` → chân xanh, 0 bullet
  - `NEN-TD4` stderr HAI CHIỀU: có đúng một dòng lý do ở TD1 và TD3, KHÔNG dòng nào ở NEN0 và NEN1
  - `NEN-TD5` đột biến: lượt chưa tiêm phải XANH (không thì đỏ «ban chep hong»), lượt tiêm phải ĐỎ ghim chuỗi cụt
  - `NEN-TD6` kho mang NGUYÊN VĂN chuỗi `ui_check` của crm@onehub → sau vá 0 bullet, bản đột biến ≥1 bullet ghim `THIEU ${CLAUDE_PLUGIN_ROOT:-$(node`
- Verify: `node tests/scripts/duong-nen.test.mjs` — 13 ca cũ vẫn PASS, sáu ca mới FAIL (RED có thật, không phải ca chưa chạy)

## T2 — vị từ `tenChuongTrinh` trong `feature-loop/scripts/duong-nen.mjs` (GREEN)

- Files: `feature-loop/scripts/duong-nen.mjs`
- Phục vụ: E1 E3 E4 E5 E6 E9
- `independent: false` (T1 phải đỏ trước)
- Khối bọc marker `// <<<CONG-CU-TU-DAU` … `// CONG-CU-TU-DAU>>>`, khớp đúng 1/1 lần.
  Vòng lặp chân công cụ: từ đầu không phải tên chương trình → không tra, không đỏ,
  in một dòng lý do ra stderr kèm khoá. Không đổi mã thoát, khuôn tệp, khuôn dòng đỏ.
- Verify: `node tests/scripts/duong-nen.test.mjs` xanh trọn (19 ca)

## T3 — ô `cong_cu` của khuôn (GREEN cho AC-7)

- Files: `skills/acceptance/references/duong-nen-template.md`
- Phục vụ: E7 (AC-7)
- `independent: false` (răng đã viết ở S1, đang đỏ)
- Verify: `bash _acceptance/nen-cong-cu-lenh-shell/rang-khuon.sh` — exit 0, hai dòng PASS

## T4 — vẽ lại bản đồ sản phẩm

- Files: `PRODUCT-MAP.md`
- Phục vụ: nền hạ tầng (`executors.script.product_map`) — hồ sơ mới làm bản đồ lệch
- `independent: false` (chạy SAU cùng: bản đồ sinh lại mỗi lần contract đổi trạng thái)
- Verify: `node scripts/product-map.mjs --root . --check` in «khớp hồ sơ xưởng»

## Verify trọn vòng trước khi vào S4

`bash _acceptance/nen-cong-cu-lenh-shell/rang-hoi-quy.sh` (ma trận 19) ·
lệnh của `executors.script.ncc_cong_cu_tu_dau` · `bash tests/scripts/run-tests.sh`
