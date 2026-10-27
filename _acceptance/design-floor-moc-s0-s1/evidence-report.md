---
schema_version: 2
feature_slug: design-floor-moc-s0-s1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 831a6d075fb403f8da702a39b5cb4fbf842f04a5
human_signoff:
---

# Evidence Report: design-floor-moc-s0-s1

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
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-design-floor-moc-s0-s1-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_bac
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E2
  run_id: minted-design-floor-moc-s0-s1-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_bac_hong
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E3
  run_id: minted-design-floor-moc-s0-s1-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_tri_thuc
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E4
  run_id: minted-design-floor-moc-s0-s1-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_tri_thuc_lech
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E5
  run_id: minted-design-floor-moc-s0-s1-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_reuse_plan
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E6
  run_id: minted-design-floor-moc-s0-s1-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_flow_lint
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E7
  run_id: minted-design-floor-moc-s0-s1-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_the
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E8
  run_id: minted-design-floor-moc-s0-s1-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_chi_ghi
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E9
  run_id: minted-design-floor-moc-s0-s1-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_noi_day
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

- eval: E10
  run_id: minted-design-floor-moc-s0-s1-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_tri_thuc_that
  verified_at: 2026-10-27T15:50:24Z
  output: |
    moc-s0-s1: XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-design-floor-moc-s0-s1-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-design-floor-moc-s0-s1-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-27T15:50:24Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Không liệt kê được eval không-phân-biệt ở round này: baseline không đo (mọi field baseline là n-a), nên không có căn cứ nói eval nào đỏ hay xanh trên mã cũ. Danh sách eval không-phân-biệt: không có mục nào được xác định.

### Baseline khong do

- bash tests/design-floor/eval.sh df4-bac: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-bac-hong: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-tri-thuc: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-tri-thuc-lech: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-reuse-plan: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-flow-lint: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-the: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-chi-ghi: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-noi-day: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh df4-tri-thuc-that: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

## Variance

none — mọi eval chạy một lần (deterministic), không eval nào có pass_rate lẫn lộn.

## Iterations

Round 1: E1–E10 đều xanh, mười một lệnh suite xanh; baseline không đo được vì hạ tầng (xem mục Analyst). Không round trước.
