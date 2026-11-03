---
schema_version: 2
feature_slug: khoi-khuon-tren-the-cong
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 232fda0ca30e594c14fd213e9d2b20f25870bf3f
human_signoff:
---

# Evidence Report: khoi-khuon-tren-the-cong

Round 3. Tám eval E1–E8 mang sang từ round 2 (delta không chạm paths của eval); mười một lệnh suite chạy lại round này, tất cả xanh.

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

## Evidence

- eval: E1
  run_id: minted-khoi-khuon-tren-the-cong-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-khoi-khuon-tren-the-cong-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-khoi-khuon-tren-the-cong-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-khoi-khuon-tren-the-cong-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-khoi-khuon-tren-the-cong-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-khoi-khuon-tren-the-cong-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-khoi-khuon-tren-the-cong-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-khoi-khuon-tren-the-cong-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-11-03T17:31:16Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi; field baseline cua tung eval ghi n-a).

Eval không-phân-biệt (xanh cả HEAD lẫn baseline): không có.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, xác định)

## Iterations

Round 1: E1–E8 đạt (8/8), kèm một lỗi trong hợp đồng (ca phá thử KK-4-do2 xanh rỗng). Quay lại triển khai, sửa mutant chạy được về ngữ nghĩa.
Round 2: REJECT — lệnh suite vung:3 đỏ ở P179 (sổ known-limits thiếu dòng). Thêm mười dòng sổ known-limits, quay lại triển khai.
Round 3: E1–E8 mang sang từ round 2 (delta không chạm paths của eval); mười một lệnh suite chạy lại, tất cả xanh. Verdict PASS.
