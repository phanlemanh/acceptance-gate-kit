# Plan — luot-cham-ghi-vao-cay (T3)

> Hồ sơ `_acceptance/luot-cham-ghi-vao-cay/` · design `docs/superpowers/specs/2026-10-01-luot-cham-ghi-vao-cay-design.md`.
> Tuần tự trong phiên chính (các task chạm chung tệp ca và lib — không task nào `independent: true`).
> Nếp TDD: mỗi task viết nhóm ca trước (đỏ vì vật chưa có), commit ca, rồi vật, commit vật.

| # | Việc | Tệp | Verify per-task | Phục vụ |
|---|---|---|---|---|
| 1 | Module một nguồn `cay-doi.mjs`: `NGOAI_VUNG`, `trongVung(rel, slug, t1)`, `chupCay(root, slug, t1)` → `{sha, ban, chuaTheoDoi}`, `soCay(root, slug, t1, chup)` → `{tep, commit, moi}`; khuôn marker `CAY-DOI-LINE` + `dongCayDoi()` | `feature-loop/scripts/lib/cay-doi.mjs` (mới) | nhóm LC1/LC2/LC3 phần hàm thuần | E1–E3 |
| 2 | s4-args chụp `cayChup` vào args (cạnh `thuocChup`) | `feature-loop/scripts/s4-args.mjs` | `node tests/scripts/cay-doi-trong-luot.test.mjs --only LC1` | E1 |
| 3 | thuoc-vat `--write`: so cây, nối dòng `cay-doi`, thoát 6 (thước lệch vẫn thoát 5, ghi cả hai dòng); stderr `tep moi chua theo doi`, `khong co anh chup cay` | `feature-loop/scripts/thuoc-vat.mjs` | `--only LC2`, `--only LC3` | E2, E3 |
| 4 | lib: `NHAN.CAY`, nhánh `cay-doi` trong `canhGay` (khớp `round` + `luot_ts`, sau `lech`), `luotKhongDungDuoc`, CLI `--luot`; CONTEXT.md thêm nhãn | `lib/nhan-canh-gay.cjs`, `CONTEXT.md` | `--only LC4` | E4 |
| 5 | s4-args: kiểm «đã hoàn lại» (thoát 2 / `--nhan-cay-moi` → `cayNhanMoi`) + mở rộng `THU-LAI-CUNG-ROUND` cho `cay-doi` (một lần) | `feature-loop/scripts/s4-args.mjs` | `--only LC5` | E5 |
| 6 | Thẻ Cổng 2: `approvable` false, khối nhãn + tệp + commit + câu việc | `scripts/gate-card.js` | `--only LC6` | E6 |
| 7 | Lưới trước-merge (VIOLATION khi `--luot` thoát 1; NOTE khi lib cũ) + recheck (dò `typeof`) | `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` | `--only LC7` | E7 |
| 8 | SKILL S4: mã 6, hai ca hoàn lại, khó-đảo hỏi người, `--nhan-cay-moi` + dòng sổ | `feature-loop/skills/feature-loop/SKILL.md` | đọc lại + các ca P* đang canh SKILL (suite plugins vùng liên quan) | E8 |
| 9 | Răng hồ sơ `rang.sh` (7 chân, 9 đột biến, chứng mũi tiêm) | `_acceptance/luot-cham-ghi-vao-cay/rang.sh` | chạy từng chân | E1–E7 |
| 10 | Suite trọn của kit + bản đồ sản phẩm | — | `feature_loop.suite_keys` | tất cả |

Fixture: `tests/scripts/thuoc-vat-fixture.mjs` (kho git code sinh) + s4-args THẬT + thuoc-vat THẬT + `tallyLine` của bộ chấm nạp qua harness vm (`tests/workflows/harness.mjs`). Bản «trước vòng» cho đối chứng từng byte: `git archive` cha của commit đầu đưa chuỗi `CAY-DOI-LINE` vào `lib/`/`scripts/`.
