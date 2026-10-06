---
schema_version: 2
feature_slug: lo-trinh-tren-du-lieu-that
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1185eb41fc82f1208952de15a2fbbcf00eaefd86
human_signoff: Manh Phan 2026-10-03 — ký lượt chấm 2; Ngoài-1, Ngoài-4, Ngoài-5, Ngoài-6 ghi Known limits; Ngoài-2, Ngoài-3 mở hợp đồng mới (hạt giống); Ngoài-7 chấp nhận, không sửa; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: lo-trinh-tren-du-lieu-that

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | judgment | PASS |
| E13 | AC-13 | test | PASS |
| E14 | AC-14 | test | PASS |
| E15 | AC-15 | test | PASS |
| E16 | AC-16 | test | PASS |

## Evidence

Mười lăm eval máy (E1–E11 và E13–E16) cùng chạy qua một lệnh `node tests/scripts/lo-trinh.test.mjs` (một lượt chạy, 119 ca xanh, tăng từ 112 ở vòng 1 nhờ bốn ca mới của vòng trả lượt: AC-13 đến AC-16); mỗi eval ghim các dòng PASS riêng của nó trong `expected` của `evals.yaml`. Không eval nào là ui-check nên không có khung ảnh.

- eval: E1
  run_id: minted-lo-trinh-tren-du-lieu-that-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E2
  run_id: minted-lo-trinh-tren-du-lieu-that-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E3
  run_id: minted-lo-trinh-tren-du-lieu-that-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E4
  run_id: minted-lo-trinh-tren-du-lieu-that-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E5
  run_id: minted-lo-trinh-tren-du-lieu-that-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E6
  run_id: minted-lo-trinh-tren-du-lieu-that-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E7
  run_id: minted-lo-trinh-tren-du-lieu-that-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E8
  run_id: minted-lo-trinh-tren-du-lieu-that-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E9
  run_id: minted-lo-trinh-tren-du-lieu-that-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E10
  run_id: minted-lo-trinh-tren-du-lieu-that-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E11
  run_id: minted-lo-trinh-tren-du-lieu-that-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E12
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale: Cả ba câu hỏi đều đúng trên chữ của trang do-crm-onehub.html — hàng kế là 7n trạng thái «Chưa mở» không nhãn «(tin theo lời)» và không cờ lệch lời khai; mục «Cờ» có 8 cờ, mỗi cờ thuộc một trong năm loại lệch thật; hàng «1» được nêu tên.
  human_override:  # chi nguoi ghi

- eval: E13
  run_id: minted-lo-trinh-tren-du-lieu-that-E13-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E14
  run_id: minted-lo-trinh-tren-du-lieu-that-E14-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E15
  run_id: minted-lo-trinh-tren-du-lieu-that-E15-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

- eval: E16
  run_id: minted-lo-trinh-tren-du-lieu-that-E16-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T07:21:14Z
  output: |
    Results: 119 passed, 0 failed (lo-trinh)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-03T07:21:14Z

## Known limits

## Ngoài hợp đồng

7 lỗi nằm ngoài hợp đồng (5 mới ở vòng này, 2 mang từ vòng 1 vì tệp không đổi), chưa qua bác bỏ đối kháng — người quyết ở Cổng Bằng chứng; chi tiết ở review-findings.md.

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11, E13, E14, E15, E16 — cùng một lệnh `node tests/scripts/lo-trinh.test.mjs` xanh trên cả bản chính (HEAD) lẫn baseline. Lệnh này chạy trọn bộ ca của vòng, trong đó có cả ca bản-sao-bị-tiêm (đối chứng đỏ, tên có hậu tố -do) nên chiều đỏ nằm trong bộ kiểm; tuy vậy baseline không phân biệt được vì thước và vật cùng được dựng mới trong lượt chạy. Người đọc cân: đây là hạn chế đo lường đã nêu, không phải lỗi vật. Chưa viết lại eval nào; bốn eval mới E13–E16 cũng thuộc diện này và được giữ như hàng rào hồi quy có chủ ý.

## Judge panels

Panel E12 (đề xuất PASS), human_override để TRỐNG — hợp đồng này không bắt người chốt từng mục judgment.

- domain-correctness: PASS — Hàng kế là «7n — Mang sang đúng khi kỳ đích đổi pha…». Trong bảng hàng, 7n có trạng thái «Chưa mở» và không có dòng lệch nào về lời khai, nên không có lời khai nào khác «chưa làm». Cả 8 cờ trong mục «Cờ» thuộc đúng năm loại lệch thật: bốn «thiếu cau_giao» (4n, N0, N1, 4c), «mã trùng: T», 9c, D, và «hàng 1: tự khai đã lên onehub mà không có hồ sơ cay-to-chuc-co-nguoi». Hàng «1» được nêu tên trong mục «Cờ».
- operational-feasibility: PASS — Ca ba câu đều đúng trên trang. (1) Hàng kế là 7n, trạng thái «Chưa mở», không có chữ «tin theo lời» và không có cờ lời khai nào ở hàng đó, và nó đứng trên 8c «Đã giao — chờ phiên nghiệm thu» (nhóm đã giao). (2) Mục «Cờ» có đúng 8 cờ, đều thuộc năm loại lệch thật: bốn «thiếu cau_giao» (4n, N0, N1, 4c), «mã trùng: T», «hàng 9c: tệp khai khác hồ sơ», «hàng D: tệp khai khác hồ sơ», và hàng 1. (3) Hàng «1» được nêu tên trong mục «Cờ»: «hàng 1: tự khai đã lên onehub mà không có hồ sơ cay-to-chuc-co-nguoi».
- spec-alignment: PASS — Cả ba câu đều đúng trên trang. (1) Hàng kế là 7n: trạng thái trên trang là «Chưa mở», không có chú thích «(tin theo lời)» và không có cờ nào, nên không có lời khai nào mâu thuẫn. Hàng 1 không thành hàng kế vì trạng thái của nó là «Không suy được». (2) Cả tám cờ đều thuộc năm loại lệch thật: bốn «thiếu cau_giao» (4n, N0, N1, 4c), một «mã trùng: T», cờ 9c, cờ D, và cờ hàng 1. (3) Mục «Cờ» nêu tên hàng 1: «hàng 1: tự khai đã lên onehub mà không có hồ sơ cay-to-chuc-co-nguoi».

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E12 đều xanh (11 eval máy, 1 eval judgment); toàn bộ lệnh suite xanh; 13 lỗi ngoài hợp đồng chuyển sang Cổng Bằng chứng cho người quyết.
Round 2: vòng trả lượt 1 thêm AC-13 đến AC-16 (E13–E16); toàn bộ 16 eval xanh trên bản c017c282 (119 ca), mọi lệnh suite xanh; 7 lỗi ngoài hợp đồng (5 mới, 2 mang từ vòng 1) chuyển sang Cổng Bằng chứng cho người quyết.

### Re-pin lần 1 — 2026-10-03, do gộp origin/main (34 commit) vào nhánh PR #252
run_id: repin-20261003T081411Z-52013
sha: ddccc203a459b606bbf7b063adb0ae881fb1289c · suites: 10 lệnh exit 0 · evals: 15/15 eval máy đạt kỳ vọng · ngoài làn máy: E12 · AC không có chốt máy: AC-12

### Re-pin lần 2 — 2026-10-03, do chiến dịch ghim lại mốc 2.21.0
run_id: repin-20261003T125505Z-37851
sha: 5c6f2f482432b385cd4140557b251f90d668a8ec · suites: 10 lệnh exit 0 · evals: 15/15 eval máy đạt kỳ vọng · ngoài làn máy: E12 · AC không có chốt máy: AC-12

### Re-pin lần 3 — 2026-10-04, do chiến dịch ghim lại sau mốc 2.22.0
run_id: repin-20261004T012917Z-97809
sha: 1185eb41fc82f1208952de15a2fbbcf00eaefd86 · suites: 10 lệnh exit 0 · evals: 15/15 eval máy đạt kỳ vọng · ngoài làn máy: E12 · diff chạm vật đo ngoài làn máy: E12 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-12
