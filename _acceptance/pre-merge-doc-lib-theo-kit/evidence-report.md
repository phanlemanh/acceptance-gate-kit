---
schema_version: 2
feature_slug: pre-merge-doc-lib-theo-kit
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0bfe1ca64a60fb8054dc9f8b0e20f3b661e6d7bb
human_signoff:
---

# Evidence Report: pre-merge-doc-lib-theo-kit

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-pre-merge-doc-lib-theo-kit-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e1
  verified_at: 2026-10-31T11:25:07Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-pre-merge-doc-lib-theo-kit-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e2
  verified_at: 2026-10-31T11:25:07Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-pre-merge-doc-lib-theo-kit-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e3
  verified_at: 2026-10-31T11:25:07Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-pre-merge-doc-lib-theo-kit-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e4
  verified_at: 2026-10-31T11:25:07Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-pre-merge-doc-lib-theo-kit-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e5
  verified_at: 2026-10-31T11:25:07Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-31T12:33:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1).

Baseline khong do: E1, E2, E3, E4, E5 — baseline round 1 giữ nguyên, round này không đo lại; field baseline của từng block ghi n-a.

Eval không-phân-biệt (pass trên cả HEAD lẫn baseline): không có. Các lệnh suite xanh cả hai phía là regression-guard bình thường, không liệt kê.

## Variance

none — mọi eval đều chạy một lần (deterministic), không có eval nhiều lần với pass_rate lẫn.

## Iterations

Round 1: lượt chấm S4 đầu trả REJECT — lưới của kit cần miễn trừ đích danh hai dòng cũ trong DV5. Returned to implementation (commit 0bfe1ca6).
Round 2: các lệnh suite chạy lại trên 0bfe1ca64a60fb8054dc9f8b0e20f3b661e6d7bb đều xanh; E1–E5 carry-forward từ round 1 vì delta không chạm paths của eval. Verdict PASS.
