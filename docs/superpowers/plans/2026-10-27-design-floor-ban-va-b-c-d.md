# Kế hoạch thi công — design-floor-ban-va-b-c-d (FL3)

Hợp đồng: `_acceptance/design-floor-ban-va-b-c-d/contract.md` (Cổng Phạm vi làn V 27/10) · thiết kế:
`docs/superpowers/specs/2026-10-27-design-floor-ban-va-b-c-d-design.md`. Mọi task tuần tự (`independent: false`): cùng chạm
`tests/design-floor/` và khối máy. Mỗi phép đo mới kèm cặp hai chiều trên cùng fixture.

## T1 — Ba bản vá, sổ, vỏ, công cụ đồng bộ
- Files: `design-floor/patches/{B,C,D}-*.patch`, `design-floor/LOCAL-PATCHES.md` (B, C, D `da-ap`; A sửa ghi chú 17 cặp),
  `design-floor/vo/ui.ts` (cờ lạ chế độ chữ → 4, lỗi ném → 1), `tests/design-floor/lib/upstream.mjs` (`tepCuaVa` đọc
  `--- a/` lẫn `+++ b/`), `tests/design-floor/dong-bo.mjs` (băm `null` cho tệp tạo/xoá), rồi `dong-bo.mjs --write`.
- Verify: `dong-bo.mjs --kiem` «khớp»; ba tổ hợp bỏ-một áp sạch.
- Phục vụ: E1–E9. `independent: false`.

## T2 — VA-01 đọc sổ theo chuỗi
- Files: `tests/design-floor/rao-dong.mjs`.
- Verify: `rao-dong.mjs` xanh; phá thử `sau` của A cho `gate.ts` → VA-01 đỏ «truoc của bản vá B».
- Phục vụ: E9. `independent: false`.

## T3 — Khối máy hết giới hạn, bộ đo hành vi
- Files: `design-floor/HOP-DONG-NHAP.md` (`gioi_han: []`, §5/§8/§10, bảng DF-02), `tests/design-floor/hop-dong.mjs` (đối chứng DF-02
  mới, DF-03 in đủ bốn lời gọi, PASS in dòng đo), `tests/design-floor/rao-dong.mjs` (FN-02 PASS in số cặp).
- Verify: `hop-dong.mjs` + `rao-dong.mjs` xanh, DF-01…09 và FN-01…04 PASS.
- Phục vụ: E1–E7. `independent: false`.

## T4 — Chiều đỏ
- Files: `tests/design-floor/tu-thu.mjs` (luật giới hạn nhân bản dòng sổ thật; BO-VA so tập; C gỡ vế --file, argv trỏ mồi; VO cờ lạ
  chế độ chữ; VA-01 chuỗi), `tests/design-floor/khoi-may-ban-va-a.mjs` (theo lời hứa của bản vá A), `tests/design-floor/so-va.mjs`
  (kiểm sổ đủ trường, viết độc lập).
- Verify: `tu-thu.mjs` xanh; mỗi nhãn chạy riêng xanh.
- Phục vụ: E5, E7, E8, E9. `independent: false`.

## T5 — Nối dây và nền
- Files: `tests/design-floor/eval.sh` (lệnh con FL3), `_acceptance/config.yaml` (chỉ thêm dòng `df_*`).
- Gộp `origin/main` (dòng mốc FL3 của giám sát) trước khi xin S4; vẽ lại bản đồ bằng máy.
- Verify: chín lệnh eval FL3 + chín lệnh eval FL2 thoát 0 (hồ sơ FL2 không vào diff).
- Phục vụ: E1–E9. `independent: false`.
