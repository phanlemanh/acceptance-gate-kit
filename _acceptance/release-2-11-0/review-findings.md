## Trong hợp đồng

- **Shape 4 (negative assertion pinned to the wrong message): BG8 and BG5 pin only the leg prefix `DO BGn:`, not the path's own assertion**
  file: `tests/scripts/bo-giai-nhay.test.mjs:525`
  severity: medium
  AC: AC-12
  detail: BG8 claims every cell of the matrix can tell patched from unpatched. The comment at lines 446-447 says it demands exactly the assertion(s) of the reverted path go red. The code at line 525 only checks `err.includes(`DO ${chan}:`)`. For six of the seven mutants that leg is BG4, which bundles 14 assertions across paths 1-7. If a path-N mutant turns BG4 red for any other reason, the cell still counts as distinguished. Examples: s4-args crashes and prints `DO BG4: s4-args khong sinh duoc args`, E2 goes missing, or a different path's assertion trips. So the measured relation 'mutate path N ↔ path N's assertion goes red' is not what gets checked. The messages already carry the needed marker (`duong [${ten}]`), but the check never looks for it. BG5 has the same gap at line 574: it checks `DO ${n}:` for BG1/BG3/BG4/BG7. Yet E5's `expected` in evals.yaml says each red leg must name the broken path and shape, not just exit non-zero. The positive control exists (lines 511-512 and 554-555); what is weak is the message pin, at leg level instead of cell level.
  source: measurement
  rationale: AC-12 requires that reverting exactly one read path makes that path's own assertion go red with no matrix cell left undistinguishable ("trơ"); checking only the shared leg-level `DO BGn:` prefix instead of the per-path message means a cell can appear distinguished for the wrong reason, exactly the gap AC-12 exists to close.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **carry-plan silently ignores a wrong --ag-root and loads another lib**
  Người dùng thấy gì: Nếu đường dẫn config-root sai bị truyền vào công cụ này, nó có thể lặng lẽ chuyển sang dùng một bộ luật khác, không như dự định, thay vì dừng lại với lỗi rõ ràng — nên một cấu hình sai có thể trôi qua mà không ai nhận ra.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: low
  Đề xuất: new-contract

- **Shape 5 (claims per-leg coverage but has no pre-declared count for the leg registry): seven evals share one exit code, and a dropped leg disappears silently**
  Người dùng thấy gì: Một mục kiểm bên trong bộ test tự động có thể bị xoá âm thầm mà bộ test vẫn báo thành công, khiến người ta tin nhầm rằng một bản vá đã được xác minh trong khi thực ra có thể không.
  file: `tests/scripts/bo-giai-nhay.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 6 (measures a different tree than the one under test): BG5 and BG8 take the red-direction copy from `git archive HEAD` and only hash-check the test file, not the product files**
  Người dùng thấy gì: Nếu có sửa cục bộ chưa commit trên các file đã vá, phép chứng minh tự động này có thể xác nhận một bản lưu cũ hơn thay vì mã đang thực sự chạy, gây cảm giác an tâm sai lệch rằng bản vá hoạt động.
  file: `tests/scripts/bo-giai-nhay.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).