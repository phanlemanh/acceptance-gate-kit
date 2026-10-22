# Kế hoạch thi công — t1-escape-chi-ho-so

Hồ sơ: `_acceptance/t1-escape-chi-ho-so/` (T3, Cổng 1 duyệt 22/10 — `941d5830`) · design:
`docs/superpowers/specs/2026-10-22-t1-escape-chi-ho-so-design.md`.

Thứ tự là luật: **thước trước vật** (AC-6 đo chính thứ tự này trong lịch sử). Ba task tuần tự, không task nào
`independent` — task 2 cần tệp ca của task 1 đỏ trước, task 3 ghi về vật của task 2.

## Task 1 — Tệp ca, đỏ trên mã cũ

- Files: `tests/scripts/t1-escape-ho-so.test.mjs` (mới; nháp đã chạy thử ngoài cây ở bước thiết kế).
- Làm: ma trận 13 hàng × 3 cột = 39 ô (hằng `HANG`, `COT`, `TEH_O`), tập NOTE mong đợi (`NOTE_MONG`, `TEH_NOTE_CO`),
  ca AC-1…AC-6 theo mã AC, kim đột biến (`KIM`) khớp đúng dòng của bản vá task 2, `TEH_CASES` chọn ca, AC-6 chỉ chạy khi
  gọi tên.
- Verify: `node tests/scripts/t1-escape-ho-so.test.mjs` → thoát 1, AC-1 in «DO AC-1: 14/39 ô sai — …» liệt đúng 14 ô
  hàng 2–7, 13 × t3, ngoai-t1; AC-3 PASS (chiều im); không dòng nào mang thông điệp hạ tầng.
- Commit riêng: `test(t1-escape-chi-ho-so): ma trận 39 ô + đột biến + răng lịch sử — đỏ trên mã cũ (14 ô)`.
- Phục vụ: E1–E6.

## Task 2 — Bản vá trong lưới trước-merge

- Files: `scripts/pre-merge-check.sh` (khối «Phân loại diff-chịu-cổng», khối T1-escape, vùng `HANG-PR`).
- Làm: hàm `is_dossier_file` (tiền tố `ACC_PREFIX` từ `git rev-parse --show-prefix`; `contract.md` đọc ở HEAD) · hai
  cờ `DIFF_ACC_TOUCHED` / `DIFF_GATE_TOUCHED` tính trong cùng vòng + `DIFF_ACC_IGNORED` · chế độ phân hạng PR đọc
  `DIFF_ACC_TOUCHED` (trong vùng marker) · dòng `NOTE [PR]:` sau hai câu VIOLATION cũ, chỉ khi răng nổ và có tệp bị
  loại · sửa chú thích đầu khối T1-escape (bỏ câu «"carries artifacts" means any _acceptance/ change»). Chú thích ngoài
  vùng marker không nhắc tên cờ phân hạng (ca AC-8 của `hang-pr.test.mjs`).
- Verify: `node tests/scripts/t1-escape-ho-so.test.mjs` → 5/5 PASS; `HP_CASES=AC-3-im,AC-8 node
  tests/scripts/hang-pr.test.mjs` → PASS; `bash tests/scripts/run-tests.sh` khối T1-escape/ARM/TE/GPM xanh.
- Commit riêng: `fix(pre-merge): răng T1-escape chỉ nhận hồ sơ cổng chấm được (t1-escape-chi-ho-so)`.
- Phục vụ: E1–E5, E7.

## Task 3 — Nhật ký thay đổi + lộ trình hồ sơ

- Files: `CHANGELOG.md` (mục `## Chưa phát hành` mới, mục con của hồ sơ).
- Làm: đổi gì · năm lớp PR nay bị chặn kèm số đo (`do-anh-huong.md`) · PR chép lại lớp CI ở kho tiêu thụ phải kèm hồ sơ,
  kể cả PR mang chính bản vá · kho làm gì khi nhận (chép lại `scripts/pre-merge-check.sh`) · không hứa điều design không
  làm (tệp gốc không chịu cổng; hai lỗ của hạt giống vẫn mở).
- Verify: đọc lại theo bốn vế của câu hỏi E8; `node scripts/product-map.mjs --check` khớp.
- Phục vụ: E8.

## Sau S3

Contract `status: implemented`, chạy `thuoc-vat.mjs` lấy lớp nhát sửa, vào S4 (lượt chấm Workflow — `acceptance-verify.js`).
