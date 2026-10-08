# Kế hoạch — doc-ghi-troi-mang-sang-run-id (T3)

Hồ sơ: `_acceptance/doc-ghi-troi-mang-sang-run-id/` · Cổng 1 duyệt 08/10 (Phan Le Manh).

Vòng này do phiên giám sát đợt crm chuyển việc, owner đồng ý: sửa hai lỗi crm đo đêm 07–08/10. Vật đã làm và
kiểm TRƯỚC Cổng 1 (commit `d30d274b`, `bc1bb767`, `85395088`), nên kế hoạch này ghi lại các nhát đã làm để
duyệt ở Gate 1.5 trên vật thật, không vẽ lại từ đầu. Bốn nhát cùng chạm `acceptance-verify.js` hoặc các tệp
nối với nó, nên không nhát nào `independent`.

## Task 1 — Một biểu thức cho dòng tiêu đề mục ngoài hợp đồng

- Files: `lib/out-of-contract.cjs` (khối `OOC-TITLE-RE`, `tieuDeMuc`), `feature-loop/workflows/acceptance-verify.js`
  (cùng khối; bước chống trùng của `chenMucCarry` nhận nhãn `(rN…)`/`(RN…)` ngoài dấu sao).
- Verify: `node tests/workflows/doc-ghi-troi.test.mjs` — DG1, DG1b, DG2, DG3, DG3b, DG3c, DG4, DG5, DG6, DG7.
- Phục vụ: E1, E2, E3, E6 (AC-1, AC-2, AC-3, AC-6). independent: false. Trạng thái: xong.

## Task 2 — Bên viết run_id: bỏ nháy, rỗng thì đúc mã; eval mang sang với run_id rỗng thì chạy lại

- Files: `feature-loop/workflows/acceptance-verify.js` (`ridHopLe`; bộ lọc `carriedEvals`; `ridTho`; mã eval).
- Verify: cùng tệp ca — DR1, DR5, DR6, DR6b.
- Phục vụ: E4, E6 (AC-4, AC-6). independent: false. Trạng thái: xong.

## Task 3 — Bên đọc run_id: ghi chú có tên, không chặn

- Files: `lib/evidence-core.cjs` (`evalBlocksWithEmptyRunId` qua `unquoteScalar`; `notes` trong `evaluateEvidence`),
  `scripts/recheck-evidence.cjs` (in `NOTE`).
- Verify: cùng tệp ca — DR2a, DR2 (bốn dạng rỗng), DR4.
- Phục vụ: E5 (AC-5). independent: false. Trạng thái: xong.

## Task 4 — Hệ quả lên phép đo cũ

- Files: `tests/scripts/fixtures/routing-baseline.txt` (sinh lại hai hồ sơ đã ký nay hiện thêm mục),
  `tests/workflows/luot-sua-giu-du.test.mjs` (kim đột biến AC-12 dời theo biểu thức chống trùng mới).
- Verify: `bash tests/workflows/run-tests.sh` · `bash tests/scripts/run-tests.sh` · `bash tests/hooks/run-tests.sh`
  · `bash tests/plugins/run-tests.sh` · `node scripts/product-map.mjs --root . --check`.
- Phục vụ: E7 (AC-7). independent: false. Trạng thái: xong — bốn bộ thoát 0 ở đỉnh `85395088`.
