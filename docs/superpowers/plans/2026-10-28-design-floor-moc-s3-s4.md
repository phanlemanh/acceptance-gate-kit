# Kế hoạch thi công — design-floor-moc-s3-s4 (FL5)

Hồ sơ `_acceptance/design-floor-moc-s3-s4/` (T2, đã duyệt Cổng Phạm vi 28/10) · thiết kế
`docs/superpowers/specs/2026-10-28-design-floor-moc-s3-s4-design.md`. Verify mỗi task bằng bộ ca của chính task trong
`tests/design-floor/moc-s3-s4.mjs` (kit cấm khung test ngoài; ca là script node như FL4). Mọi task phụ thuộc tuần tự
(cùng tệp ca, lệnh S3 gọi lại tiện ích của lệnh S4) — `independent: false` cho cả năm.

| # | Task | Files | Verify | Phục vụ |
|---|---|---|---|---|
| 1 | Lệnh S4 chỉ đọc: đích từ diff ∩ surface_globs, quét hex thô, gọi token-coverage theo argv khối máy, bảng chặn theo bậc, mã lạ → thoát 1 | `scripts/design-floor-s4.mjs` | `node tests/design-floor/moc-s3-s4.mjs --chi S4-HEX,S4-TC,S4-BAC,S4-CHI-DOC` | E4–E7 |
| 2 | Lệnh S3: chụp cây, đích bẩn → 2, autofix `argv_ghi`, sinh lại tuần tự, commit đúng tệp chính lệnh đổi | `scripts/design-floor-s3.mjs` | `… --chi S3-AUTOFIX,S3-SINH-LAI,S3-VIEC-DO` | E1–E3 |
| 3 | Lệnh bậc in dòng «S4 chưa chấm tuân thủ design system» ở M1+ khi chưa khai `executors.design.floor` | `scripts/design-floor-bac.mjs` | `… --chi BAC-FLOOR` + `node tests/design-floor/moc-s0-s1.mjs` | E10 |
| 4 | Khối SKILL `DESIGN-FLOOR-S3` (trước dòng sang implemented) và `DESIGN-FLOOR-S4` (cách nối, không nhắc bộ chấm tổng); GUIDE dòng nối `executors.design.floor` + `design_floor.sinh_lai` | `feature-loop/skills/feature-loop/SKILL.md`, `GUIDE.md` | `… --chi SKILL-S3` | E10 |
| 5 | Răng bộ chấm tổng (FL-C1 · DF-07), vòng mẫu S0→S5 qua `pre-merge-check.sh`, nối `eval.sh`/`run-tests.sh`/`config.yaml` | `tests/design-floor/moc-s3-s4.mjs`, `tests/design-floor/eval.sh`, `tests/design-floor/run-tests.sh`, `_acceptance/config.yaml` | `bash tests/design-floor/run-tests.sh` | E8, E9 + mọi eval |

Mỗi phép đo mới đi kèm cặp hai chiều trên cùng fixture (MEASURE-BIRTH-CLAUSE): đối chứng dương xanh, đột biến bản sao
lệnh đỏ đúng thông điệp ghim — đột biến sống trong chính tệp ca (khuôn `kitDotBien` của FL4).
