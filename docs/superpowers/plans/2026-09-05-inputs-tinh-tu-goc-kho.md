# Plan — inputs-tinh-tu-goc-kho (T2, làn V)

Design: `docs/superpowers/specs/2026-09-05-inputs-tinh-tu-goc-kho-design.md` ·
Hợp đồng: `_acceptance/inputs-tinh-tu-goc-kho/contract.md`.

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Hội đồng đọc đúng file đã khai; input vắng thì dừng có tên thay vì phán trên file rỗng | `feature-loop/scripts/s4-args.mjs` | AC-1…AC-4 (một gốc, vắng kêu to) |
| Người viết evals đọc một luật ở cả ba nơi | `eval-executors.md`, hai `SKILL.md` | AC-5 (tài liệu một gốc) |
| Lane hội đồng không đổi nghĩa | `acceptance-verify.js` (không chạm) | AC-6 (diff rỗng) |

## Task 1 — Bản sửa mã + tài liệu + lưới thường trực — ĐÃ XONG (commit 4279ba42)
- Files: `feature-loop/scripts/s4-args.mjs`, ba file tài liệu, `tests/scripts/s4-args-judgment-inputs.test.mjs`.
- Verify: `node tests/scripts/s4-args-judgment-inputs.test.mjs` (13/13; đã đỏ 9/13 trước sửa).
- Phục vụ: E1–E5. `independent: false` (đã xong).

## Task 2 — Nâng lưới theo gap-probe
- Files: `tests/scripts/s4-args-judgment-inputs.test.mjs`.
- Việc: cờ `--only <nhóm>` (0 nhóm khớp → exit 1 có tên); JI2 so đường dẫn nguyên văn có ranh giới; JI3 đối chứng dương round-trip rút chuỗi «…» từ stderr thật.
- Verify: chạy trọn (13/13) + `--only JI3` + `--only KHONG-CO` → exit 1.
- Phục vụ: E1–E4. `independent: true`.

## Task 3 — Răng hồ sơ `rang.sh` sáu chân
- Files: `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`.
- Việc: bản sao trọn cây + ba đột biến thay thế nguyên văn (assert mũi tiêm trúng, `node --check`); bốn chân JI; chân `lane-doc-khong-doi` (diff so mốc gộp, chiều đỏ trên clone tạm); chân `tai-lieu-khong-con-duong-cu` (grep âm tính khối `inputs:`, đối chứng dương tiêm dòng).
- Verify (measure-birth): mỗi chân xanh trên cây thật; mỗi chân đỏ khi phá vật thật trong bản sao với dòng ghim.
- Phục vụ: E1–E4, E6, E7. `independent: true`.

## Task 4 — Khoá chân đo trong config
- Files: `_acceptance/config.yaml` (qua `scripts/config-patch.mjs --write`, không sửa tay).
- Sáu khoá `executors.script.itgk_*` trỏ `rang.sh --chan <tên>`.
- Verify: `resolveConfigKey` giải được cả sáu (s4-args tự kiểm khi sinh args).
- Phục vụ: E1–E4, E6, E7. `independent: true`.

Thứ tự: Task 2 → 3 → 4 tuần tự trong main loop (chung một phiên, nhỏ), rồi set `status: implemented` và dispatch S4 bằng chính `s4-args.mjs` + `acceptance-verify.js` của cây kho (`--ag-root`).
