---
schema_version: 2
feature_slug: kho-cam-ket-co-lo-trinh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cdf38bada80e93c9a97c5fcd6e4dcec7a8f04343
human_signoff:
---

# Evidence Report: kho-cam-ket-co-lo-trinh

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

## Evidence

- eval: E1
  run_id: minted-kho-cam-ket-co-lo-trinh-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh
  verified_at: 2026-10-16T05:29:04Z
  output: |
    kho-cam-ket-co-lo-trinh: 22 PASS, 0 FAIL

- eval: E2
  run_id: minted-kho-cam-ket-co-lo-trinh-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh
  verified_at: 2026-10-16T05:29:04Z
  output: |
    kho-cam-ket-co-lo-trinh: 22 PASS, 0 FAIL

- eval: E3
  run_id: minted-kho-cam-ket-co-lo-trinh-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh
  verified_at: 2026-10-16T05:29:04Z
  output: |
    kho-cam-ket-co-lo-trinh: 22 PASS, 0 FAIL

- eval: E4
  run_id: minted-kho-cam-ket-co-lo-trinh-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh
  verified_at: 2026-10-16T05:29:04Z
  output: |
    kho-cam-ket-co-lo-trinh: 22 PASS, 0 FAIL

- eval: E5
  run_id: minted-kho-cam-ket-co-lo-trinh-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh
  verified_at: 2026-10-16T05:29:04Z
  output: |
    kho-cam-ket-co-lo-trinh: 22 PASS, 0 FAIL

- eval: E6
  run_id: minted-kho-cam-ket-co-lo-trinh-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh_cac_kho
  verified_at: 2026-10-16T05:29:04Z
  output: |
    Results: 1 passed, 0 failed (kho-cam-ket-co-lo-trinh-cac-kho)

- eval: E7
  run_id: minted-kho-cam-ket-co-lo-trinh-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh
  verified_at: 2026-10-16T05:29:04Z
  output: |
    kho-cam-ket-co-lo-trinh: 22 PASS, 0 FAIL

- eval: E8
  run_id: minted-kho-cam-ket-co-lo-trinh-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh
  verified_at: 2026-10-16T05:29:04Z
  output: |
    kho-cam-ket-co-lo-trinh: 22 PASS, 0 FAIL

- eval: E9
  run_id: minted-kho-cam-ket-co-lo-trinh-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_cam_ket_co_lo_trinh
  verified_at: 2026-10-16T05:29:04Z
  output: |
    kho-cam-ket-co-lo-trinh: 22 PASS, 0 FAIL

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kho-cam-ket-co-lo-trinh-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-16T05:29:04Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không có eval nào được đo xanh ở cả hai phía; hai lệnh feature là eval mới nên baseline là n-a (lý do ở mục dưới), còn các lệnh suite là regression-guard bình thường.

Baseline khong do:
- node tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs: bo qua baseline: tep tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs co o cay dang kiem nhung chua co o merge-base 66951212b70d2e63b5854cc7782997bb48c65792 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kho-cam-ket-co-lo-trinh-cac-kho.mjs: bo qua baseline: tep tests/scripts/kho-cam-ket-co-lo-trinh-cac-kho.mjs co o cay dang kiem nhung chua co o merge-base 66951212b70d2e63b5854cc7782997bb48c65792 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, xác định, không có phương sai)

## Iterations

Round 1: mọi eval E1–E9 và mọi lệnh suite đều xanh; verdict PASS.
