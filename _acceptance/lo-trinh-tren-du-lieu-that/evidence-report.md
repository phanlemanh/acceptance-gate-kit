---
schema_version: 2
feature_slug: lo-trinh-tren-du-lieu-that
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 63a6117731fe0cd240d9a766f415e74305705a51
human_signoff:
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

## Evidence

Mười một eval máy E1–E11 cùng chạy qua một lệnh `node tests/scripts/lo-trinh.test.mjs` (một lượt chạy, 112 ca xanh); mỗi eval ghim các dòng PASS riêng của nó trong `expected` của `evals.yaml`.

- eval: E1
  run_id: minted-lo-trinh-tren-du-lieu-that-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E2
  run_id: minted-lo-trinh-tren-du-lieu-that-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E3
  run_id: minted-lo-trinh-tren-du-lieu-that-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E4
  run_id: minted-lo-trinh-tren-du-lieu-that-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E5
  run_id: minted-lo-trinh-tren-du-lieu-that-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E6
  run_id: minted-lo-trinh-tren-du-lieu-that-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E7
  run_id: minted-lo-trinh-tren-du-lieu-that-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E8
  run_id: minted-lo-trinh-tren-du-lieu-that-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E9
  run_id: minted-lo-trinh-tren-du-lieu-that-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E10
  run_id: minted-lo-trinh-tren-du-lieu-that-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E11
  run_id: minted-lo-trinh-tren-du-lieu-that-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-03T02:46:31Z
  output: |
    Results: 112 passed, 0 failed (lo-trinh)

- eval: E12
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale: Cả ba câu hỏi đều đúng trên chữ của trang do-crm-onehub.html — hàng kế là 7n trạng thái «Chưa mở» không nhãn «(tin theo lời)» và không cờ lệch lời khai; mục «Cờ» có 8 cờ, mỗi cờ thuộc một trong năm loại lệch của opportunity.md; hàng «1» được nêu tên.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lo-trinh-tren-du-lieu-that-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-03T02:46:31Z

## Known limits

## Ngoài hợp đồng

13 lỗi nằm ngoài hợp đồng, chưa qua bác bỏ đối kháng — người quyết ở Cổng Bằng chứng; chi tiết ở review-findings.md.

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11 — cùng một lệnh `node tests/scripts/lo-trinh.test.mjs` xanh trên cả bản chính (HEAD) lẫn baseline. Lệnh này chạy trọn bộ ca của vòng, trong đó có cả ca bản-sao-bị-tiêm (đối chứng đỏ) nên chiều đỏ nằm trong bộ kiểm; tuy vậy baseline không phân biệt được vì thước và vật cùng được dựng mới trong lượt chạy. Người đọc cân: đây là hạn chế đo lường đã nêu, không phải lỗi vật. Chưa viết lại eval nào.

## Judge panels

Panel E12 (đề xuất PASS), human_override để TRỐNG — hợp đồng T2, không bắt người chốt từng mục judgment.

- domain-correctness: PASS — Cả ba câu đều đúng trên chữ của trang. Hàng kế là 7n, trạng thái «Chưa mở», không có nhãn «(tin theo lời)» và không có cờ lệch lời khai. Nó «Đủ điều kiện vì mọi hàng nó đứng trên đã giao: 8c (Đã giao — chờ phiên nghiệm thu)». Mục «Cờ» có 8 cờ, mỗi cờ thuộc đúng một trong năm loại lệch của opportunity.md, và hàng «1» được nêu tên.
- operational-feasibility: PASS — Cả ba câu đều đúng theo chữ trên trang. Hàng kế là 7n, trạng thái «Chưa mở», không có chữ «tin theo lời» và không có cờ lệch lời khai nào cho nó. Tám cờ trong mục «Cờ» đều thuộc năm loại lệch của opportunity.md, và hàng 1 được nêu tên.
- spec-alignment: PASS — Ca ba câu đều đúng trên trang. Hàng kế là «7n», trạng thái «Chưa mở» không có dấu «(tin theo lời)» và không có cờ mâu thuẫn nào, nên lời khai không nói «đã làm». Mục «Cờ» có 8 cờ, đều thuộc năm loại lệch thật: 4 hàng thiếu câu giao (4n, N0, N1, 4c), mã trùng T, hàng 9c, hàng D, và hàng 1. Hàng 1 được nêu tên: «hàng 1: tự khai đã lên onehub mà không có hồ sơ cay-to-chuc-co-nguoi».

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E12 đều xanh (11 eval máy, 1 eval judgment); toàn bộ lệnh suite xanh; 13 lỗi ngoài hợp đồng chuyển sang Cổng Bằng chứng cho người quyết.
