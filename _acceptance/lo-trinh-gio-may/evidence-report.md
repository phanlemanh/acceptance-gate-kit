---
schema_version: 2
feature_slug: lo-trinh-gio-may
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9e859af1fee74a7ed066e2b9c435ff1944ef41dc
human_signoff:
---

# Evidence Report: lo-trinh-gio-may

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
  run_id: minted-lo-trinh-gio-may-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

- eval: E2
  run_id: minted-lo-trinh-gio-may-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

- eval: E3
  run_id: minted-lo-trinh-gio-may-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

- eval: E4
  run_id: minted-lo-trinh-gio-may-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

- eval: E5
  run_id: minted-lo-trinh-gio-may-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

- eval: E6
  run_id: minted-lo-trinh-gio-may-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

- eval: E7
  run_id: minted-lo-trinh-gio-may-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

- eval: E8
  run_id: minted-lo-trinh-gio-may-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

- eval: E9
  run_id: minted-lo-trinh-gio-may-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T14:22:17Z
  output: |
    node tests/scripts/lo-trinh-gio-may.test.mjs
    Results: 44 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lo-trinh-gio-may-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-lo-trinh-gio-may-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-15T14:22:17Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do
- node tests/scripts/lo-trinh-gio-may.test.mjs: bo qua baseline: tep tests/scripts/lo-trinh-gio-may.test.mjs co o cay dang kiem nhung chua co o merge-base cf2fe01225dc56edb1e589c1cfa46dacea0d864e — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E9 đều xanh, 11 lệnh suite hồi quy xanh. Không eval nào thất bại.
