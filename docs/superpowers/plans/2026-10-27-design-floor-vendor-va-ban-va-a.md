# Kế hoạch thi công — design-floor-vendor-va-ban-va-a (FL2)

Hợp đồng: `_acceptance/design-floor-vendor-va-ban-va-a/contract.md` (duyệt 27/10) · thiết kế:
`docs/superpowers/specs/2026-10-27-design-floor-vendor-va-ban-va-a-design.md`.

Mọi task tuần tự (`independent: false`): cùng chạm `tests/design-floor/lib/*` và khối máy của hợp đồng nhập. Mỗi
phép đo mới đi kèm cặp hai chiều trên cùng fixture (MEASURE-BIRTH-CLAUSE) — verify per-task chứa lượt phá thử.

## T1 — Đường lấy nguồn, phụ thuộc dựng, công cụ đồng bộ

- Files: `tests/design-floor/package.json` + `package-lock.json` (13 gói runtime ghim đúng bản của
  `package-lock.json` upstream @ a7ad5f1), `tests/design-floor/lib/upstream.mjs` (`layUpstream` tôn trọng
  `DESIGN_FLOOR_KHONG_MANG`; `chuanBiNguon` trả thư mục vendored, ném «thiếu bản vendored» khi vắng; `dungBanGoi`
  dựng bản gói tất định; `dongKinVo` đo đóng kín của vỏ trên một gốc bất kỳ), `design-floor/HOP-DONG-NHAP.md`
  (khối máy thêm `vendor: {goc, vo, ban_goi, so_va}`), `tests/design-floor/dong-bo.mjs` (`--write`, `--kiem`).
- Verify: `npm ci --prefix tests/design-floor`; `DESIGN_FLOOR_KHONG_MANG=1 node tests/design-floor/dong-bo.mjs --kiem`
  thoát 2 nêu «KHONG_MANG»; `chuanBiNguon` trên gốc không có vendored ném «thiếu bản vendored».
- Phục vụ: E4, E9. `independent: false`.

## T2 — Vỏ của kit và tệp khoá 126 tệp

- Files: `design-floor/vo/ui.ts`; `tests/design-floor/rao-dong.mjs --write` đo thêm điểm vào vỏ → `lenh.vo` = hai
  tệp vỏ kéo thêm; `design-floor/upstream.lock.json` sinh lại.
- Verify: tệp khoá `hop.tep` = 126, `lenh.vo.tep` = 2, mọi băm của 124 tệp cũ không đổi (diff tệp khoá chỉ thêm).
- Phục vụ: E8. `independent: false`.

## T3 — Bản vá A, sổ LOCAL-PATCHES, bản vendored và bản gói

- Files: `design-floor/patches/A-bo-cham-khong-but.patch`, `design-floor/LOCAL-PATCHES.md` (A `da-ap`; B, C, D
  `cho-va`), `design-floor/vendor/design-os/**` (126 tệp, do `dong-bo.mjs --write` sinh), `design-floor/dist/ui.mjs`.
- Verify: `dong-bo.mjs --write` rồi `--kiem` thoát 0 «khớp»; bản gói không chứa `memory-`.
- Phục vụ: E1, E2, E3, E5. `independent: false`.

## T4 — Rào đóng kín ngoại tuyến: VA-01, FN-01 đảo vá, FN-02…04 trên đóng kín giao đi, BG-01

- Files: `tests/design-floor/rao-dong.mjs`, `tests/design-floor/lib/hop-dong.mjs` (đọc sổ, `--chi`, đè đường
  `--vendor` `--so-va` `--ban-goi`).
- Verify: `node tests/design-floor/rao-dong.mjs` xanh; phá thử tay một byte vendored → VA-01 đỏ đúng tệp (đột biến
  chính thức ở T6).
- Phục vụ: E1, E2, E3, E8. `independent: false`.

## T5 — Khối máy và luật giới hạn mới; bộ đo hành vi chạy bản gói

- Files: `design-floor/HOP-DONG-NHAP.md` (gỡ DF-07, DF-08; FN-02 còn bốn cặp figma; `pr_upstream` → `ban_va`; §8,
  §9, §10 văn xuôi), `tests/design-floor/lib/hop-dong.mjs` (`phanXu`: thiếu trường, con trỏ chết, trỏ bản vá đã áp),
  `tests/design-floor/hop-dong.mjs` (CLI = bản gói, cờ `--ui`).
- Verify: `node tests/design-floor/hop-dong.mjs` xanh với DF-07/DF-08 PASS, năm XFAIL đúng chữ ký.
- Phục vụ: E5, E6, E7. `independent: false`.

## T6 — Chiều đỏ: nhãn và đột biến mới trong tu-thu.mjs

- Files: `tests/design-floor/tu-thu.mjs` — ca mang nhãn, `--chi <nhãn>`; đột biến VA-01 (một byte, tệp lạ, tệp thiếu,
  `sau` sai, thiếu `lam_xanh`), FN-01 (băm khoá, tệp diff sửa), BG-01 (một byte bản gói), BAN-VA-A (bỏ A → DF-07/08 đỏ;
  thêm lại cặp memory → FN-02 đỏ), LUAT (thiếu `ban_va`, thiếu `can_upstream`, con trỏ chết, trỏ A), VO (`ui init` → 4,
  `ui gate --help` → 0, trần hạ → FN-04 đỏ), MANG (chuanBiNguon / layUpstream), DONG-BO (`--kiem --vendor` lệch).
- Verify: `node tests/design-floor/tu-thu.mjs` xanh; mỗi nhãn chạy riêng xanh.
- Phục vụ: E1–E9. `independent: false`.

## T7 — Nối dây: executor, CI, chạy trọn

- Files: `_acceptance/config.yaml` (chỉ thêm dòng: `executors.script.df_*`), `.github/workflows/gate.yml` (job
  `design-floor` đặt `DESIGN_FLOOR_KHONG_MANG: 1`), `tests/design-floor/run-tests.sh`.
- Verify: chạy chín executor `df_*` thoát 0; `bash tests/design-floor/run-tests.sh` dưới biến xanh.
- Phục vụ: E1–E9. `independent: false`.

## T8 — Nền kit trước lượt chấm

- Gộp `origin/main` vào nhánh (dòng mốc của giám sát cho MC-11), vẽ lại `PRODUCT-MAP.md` + `LO-TRINH.html` bằng máy.
- Verify: ba suite đỏ ở đường nền (`scripts_mjs_3`, `plugins_vung_1`, `product_map`) xanh.
- Phục vụ: điều kiện «toàn bộ ca kit xanh». `independent: false`.
