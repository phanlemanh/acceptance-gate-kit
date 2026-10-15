---
schema_version: 2
feature_slug: kho-moi-cai-goi-road-map
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4ebde8b4ddffaaf73a570c123413a4216542c584
human_signoff:
---

# Evidence Report: kho-moi-cai-goi-road-map

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
  run_id: minted-kho-moi-cai-goi-road-map-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E2
  run_id: minted-kho-moi-cai-goi-road-map-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E3
  run_id: minted-kho-moi-cai-goi-road-map-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E4
  run_id: minted-kho-moi-cai-goi-road-map-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E5
  run_id: minted-kho-moi-cai-goi-road-map-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E6
  run_id: minted-kho-moi-cai-goi-road-map-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E7
  run_id: minted-kho-moi-cai-goi-road-map-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E8
  run_id: minted-kho-moi-cai-goi-road-map-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E9
  run_id: minted-kho-moi-cai-goi-road-map-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map_cac_kho
  verified_at: 2026-10-15T09:42:57Z
  output: |
    Results: 2 passed, 0 failed (kho-moi-cai-goi-road-map-cac-kho)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-15T09:42:57Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do
- node tests/scripts/kho-moi-cai-goi-road-map.test.mjs: bo qua baseline: tep tests/scripts/kho-moi-cai-goi-road-map.test.mjs co o cay dang kiem nhung chua co o merge-base eee3a1c1f208aa8fb57997ad08c7d35930ea0157 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs: bo qua baseline: tep tests/scripts/kho-moi-cai-goi-road-map-cac-kho.mjs co o cay dang kiem nhung chua co o merge-base eee3a1c1f208aa8fb57997ad08c7d35930ea0157 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: tat ca E1–E9 va cac lenh suite xanh; khong eval nao that bai. Ket qua vong dau, khong co vong truoc.
