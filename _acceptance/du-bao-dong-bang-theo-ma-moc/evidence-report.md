---
schema_version: 2
feature_slug: du-bao-dong-bang-theo-ma-moc
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: df2a693ce8a610387af83b3847627a4c57902f5e
human_signoff:
---

# Evidence Report: du-bao-dong-bang-theo-ma-moc

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
| E7b | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.du_bao_theo_ma_moc
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 20 passed, 0 failed

- eval: E2
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.du_bao_theo_ma_moc
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 20 passed, 0 failed

- eval: E3
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.du_bao_theo_ma_moc
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 20 passed, 0 failed

- eval: E4
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.du_bao_theo_ma_moc
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 20 passed, 0 failed

- eval: E5
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.du_bao_theo_ma_moc
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 20 passed, 0 failed

- eval: E6
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.du_bao_theo_ma_moc
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 20 passed, 0 failed

- eval: E7
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.du_bao_theo_ma_moc
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 20 passed, 0 failed

- eval: E8
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.du_bao_theo_ma_moc
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 20 passed, 0 failed

- eval: E7b
  run_id: minted-du-bao-dong-bang-theo-ma-moc-E7b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-16T04:37:03Z
  output: |
    Results: 65 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-du-bao-dong-bang-theo-ma-moc-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-16T04:37:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên CẢ bản HEAD lẫn bản baseline — chúng chứng minh harness chạy, chưa chứng minh hành vi mới; cần viết lại để khẳng định hành vi mới, hoặc xác nhận là regression-guard có chủ ý):

- E1, E2, E3, E4, E5, E6, E7, E8 — lệnh `env GM_CASES=DB node tests/scripts/lo-trinh-gio-may.test.mjs`, baseline green.
- E7b — lệnh `node tests/scripts/lo-trinh-gio-may.test.mjs`, baseline green.

Baseline khong do: các lệnh suite (hồi quy) không được đo trên baseline (n-a) — chúng không gắn eval nào; xanh-cả-hai-phía của suite là regression-guard bình thường nên không liệt kê.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, tất định).

## Iterations

Round 1: E1–E8 và E7b đều xanh, các lệnh suite xanh; không eval nào lỗi. Verdict PASS.

### Re-pin lần 1 — 2026-10-16, do gộp main 66951212 (#366 RM3) sau máy thông; khai RT13 cho RM6b
run_id: repin-20261016T072836Z-20512
sha: d76ca283f3d27d58eb7bcc627661a343b98d0064 · suites: 11 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-10-17, do chiến dịch ghim lại mốc 2.32.0 — cửa sổ v2.31.0→HEAD
run_id: repin-20261017T024130Z-65967
sha: df2a693ce8a610387af83b3847627a4c57902f5e · suites: 11 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng
