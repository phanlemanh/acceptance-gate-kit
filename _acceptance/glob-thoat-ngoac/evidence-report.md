---
schema_version: 2
feature_slug: glob-thoat-ngoac
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5fd732bc33bb4138cd05a6539d635634f1dc6b86
human_signoff:
---

# Evidence Report: glob-thoat-ngoac

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-glob-thoat-ngoac-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_bo_dich
  verified_at: 2026-10-09T11:51:37Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)

- eval: E2
  run_id: minted-glob-thoat-ngoac-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_phan_loai
  verified_at: 2026-10-09T11:51:37Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)

- eval: E3
  run_id: minted-glob-thoat-ngoac-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_lan_ghim_lai
  verified_at: 2026-10-09T11:51:37Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)

- eval: E4
  run_id: minted-glob-thoat-ngoac-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_mang_sang
  verified_at: 2026-10-09T11:51:37Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)

- eval: E5
  run_id: minted-glob-thoat-ngoac-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_hoa_cu
  verified_at: 2026-10-09T11:51:37Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)

- eval: E6
  run_id: minted-glob-thoat-ngoac-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_dot_bien
  verified_at: 2026-10-09T11:51:37Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)

- eval: E7
  run_id: minted-glob-thoat-ngoac-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-09T11:51:37Z
  output: |
    Results: all workflow tests passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-glob-thoat-ngoac-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-09T11:51:37Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (xanh trên cả bản mới lẫn baseline đã mang sang): E7 (lệnh `bash tests/workflows/run-tests.sh`). Nó chứng minh bộ test workflow còn nguyên, không chứng minh hành vi mới của feature; xác nhận đây là regression-guard có chủ ý cho AC-7, hoặc viết lại để assert hành vi mới. Sáu eval E1–E6 mang baseline n-a vì round này không đo lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — fixture tranh chuỗi trạng-thái-đã-ký (RT13), theo commit 5fd732bc. Returned to implementation.
Round 2: E1–E7 và toàn bộ lệnh suite xanh trên cây 5fd732bc — PASS.
