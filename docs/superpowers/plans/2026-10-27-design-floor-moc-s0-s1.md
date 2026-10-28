# Kế hoạch thi công — design-floor-moc-s0-s1 (FL4)

Hợp đồng: `_acceptance/design-floor-moc-s0-s1/contract.md` (Cổng Phạm vi duyệt 27/10, Hỏi-1 phê CỘNG, Hỏi-2 tải lúc chạy)
· thiết kế: `docs/superpowers/specs/2026-10-27-design-floor-moc-s0-s1-design.md`. Mọi task tuần tự (`independent: false`):
cùng chạm `tests/design-floor/` và tệp khoá. Mỗi phép đo mới kèm cặp hai chiều trên cùng fixture do mã sinh.

## T1 — Khối tri thức của tệp khoá
- Files: `tests/design-floor/lib/khoa.mjs` (`doKhoa` thêm khối `tri_thuc` khi gốc có `knowledge/index.json`: băm + byte
  của chỉ mục và của từng tệp chỉ mục trỏ; `soKhoa` so khối khi cả hai bên có), `design-floor/upstream.lock.json` (ghi lại
  bằng `rao-dong.mjs --write`, phần `tep` không đổi).
- Verify: `rao-dong.mjs` xanh; `dong-bo.mjs --kiem` khớp; `git diff` của tệp khoá chỉ thêm khối `tri_thuc`.
- Phục vụ: E4, E10. `independent: false`.

## T2 — Lệnh bậc
- Files: `scripts/design-floor-bac.mjs` (đọc `design.surface_globs`, `design_floor.{tokens,registry,niem_phong}` từ
  `_acceptance/config.yaml`; `git ls-files`; `--json`; M0 im lặng).
- Verify: bốn kho fixture ra M0–M3; bốn ca hỏng hạ bậc kèm lý do.
- Phục vụ: E1, E2. `independent: false`.

## T3 — Lệnh S1
- Files: `scripts/design-floor-s1.mjs` (bậc qua T2; tải tri thức sparse `/knowledge/` vào bộ đệm ngoài kho, kiểm băm theo
  khối `tri_thuc`; chấm điểm thẻ `when`; ≤2 tệp; `reuse-plan check` và `flow lint` với argv rút từ khối máy của
  `design-floor/HOP-DONG-NHAP.md`; ghi `design-floor.json` + một dòng `usage-report.md`; M0 không ghi gì). Biến môi
  trường cho bộ đo: `DESIGN_FLOOR_TRI_THUC` (thư mục tri thức có sẵn), `DESIGN_FLOOR_KHOA` (tệp khoá), `DESIGN_FLOOR_UI`
  (bản gói).
- Verify: chạy trên kho fixture M2 có `reuse-plan.md` và `flow.json`.
- Phục vụ: E3–E6, E8, E10. `independent: false`.

## T4 — Khối thẻ «Sàn thiết kế»
- Files: `scripts/gate-card.js` (Cổng Phạm vi: đọc `design-floor.json`, in các dòng; vắng tệp → không một byte nào đổi).
- Verify: thẻ của hồ sơ có tệp mang khối; `routing.hoi` không đổi; thẻ hồ sơ không tệp bằng bản gốc nhánh chính.
- Phục vụ: E7. `independent: false`.

## T5 — Nối dây SKILL
- Files: `feature-loop/skills/feature-loop/SKILL.md` (khối marker `DESIGN-FLOOR-S0` ở S0, bước 0d với khối
  `DESIGN-FLOOR-S1` ở S1).
- Verify: lệnh rút từ khối chạy được trên kho fixture.
- Phục vụ: E9. `independent: false`.

## T6 — Bộ đo và nối eval
- Files: `tests/design-floor/moc-s0-s1.mjs` (nhãn BAC, BAC-HONG, TT, TT-LECH, RP, FL, THE, GHI, SKILL, TT-THAT; mỗi nhãn
  chiều xanh + đột biến trên bản sao), `tests/design-floor/eval.sh` (mười lệnh con `df4-*`), `_acceptance/config.yaml`
  (chỉ thêm mười dòng `df4_*`).
- Verify: mười lệnh eval thoát 0; mỗi đột biến đỏ đúng thông điệp; bộ ca design-floor cũ vẫn xanh.
- Phục vụ: E1–E10. `independent: false`.
