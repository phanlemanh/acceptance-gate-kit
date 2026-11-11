---
schema_version: 2
feature_slug: luot-kiem-nhe
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a7f19d70eec899c956712e1409190ae1915252f4
human_signoff: Manh Phan 2026-11-11
---

# Evidence Report: luot-kiem-nhe

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-luot-kiem-nhe-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 28 passed, 0 failed (luot-kiem-nhe)

- eval: E2
  run_id: minted-luot-kiem-nhe-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 28 passed, 0 failed (luot-kiem-nhe)

- eval: E3
  run_id: minted-luot-kiem-nhe-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 28 passed, 0 failed (luot-kiem-nhe)

- eval: E4
  run_id: minted-luot-kiem-nhe-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 28 passed, 0 failed (luot-kiem-nhe)

- eval: E5
  run_id: minted-luot-kiem-nhe-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 28 passed, 0 failed (luot-kiem-nhe)

- eval: E6
  run_id: minted-luot-kiem-nhe-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 28 passed, 0 failed (luot-kiem-nhe)

- eval: E7
  run_id: minted-luot-kiem-nhe-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 28 passed, 0 failed (luot-kiem-nhe)

- eval: E8
  run_id: minted-luot-kiem-nhe-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 28 passed, 0 failed (luot-kiem-nhe)

- eval: E9
  run_id: minted-luot-kiem-nhe-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.luot_kiem_nhe_ca_cham
  verified_at: 2026-11-11T09:07:56Z
  output: |
    Results: 6 passed, 0 failed (luot-kiem-nhe-ca-cham)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-luot-kiem-nhe-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-luot-kiem-nhe-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-luot-kiem-nhe-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-11T09:07:56Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet). Luu y: ca chín eval deu co baseline n-a (eval moi, khong do duoc), nen "red tren baseline" chua duoc do truc tiep.

Baseline khong do:
- node tests/scripts/luot-kiem-nhe.test.mjs: bo qua baseline: tep tests/scripts/luot-kiem-nhe.test.mjs co o cay dang kiem nhung chua co o merge-base 6e5f402031a268b72062b16422330f2637dc0d8f — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/luot-kiem-nhe-ca-cham.mjs: bo qua baseline: tep tests/scripts/luot-kiem-nhe-ca-cham.mjs co o cay dang kiem nhung chua co o merge-base 6e5f402031a268b72062b16422330f2637dc0d8f — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E9 đều xanh, 12 lệnh suite xanh; không có eval đỏ. Verdict PASS.
