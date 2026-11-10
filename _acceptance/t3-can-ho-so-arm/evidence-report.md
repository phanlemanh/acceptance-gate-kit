---
schema_version: 2
feature_slug: t3-can-ho-so-arm
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cf35252abdcaad4ab409d7e0aa65047d92009451
human_signoff:
---

# Evidence Report: t3-can-ho-so-arm

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
  run_id: minted-t3-can-ho-so-arm-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e1
  verified_at: 2026-11-10T02:27:53Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-t3-can-ho-so-arm-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e2
  verified_at: 2026-11-10T02:27:53Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-t3-can-ho-so-arm-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e3
  verified_at: 2026-11-10T02:27:53Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-t3-can-ho-so-arm-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e4
  verified_at: 2026-11-10T02:27:53Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-t3-can-ho-so-arm-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e5
  verified_at: 2026-11-10T02:27:53Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-t3-can-ho-so-arm-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e6
  verified_at: 2026-11-10T02:27:53Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-t3-can-ho-so-arm-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e7
  verified_at: 2026-11-10T02:27:53Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-t3-can-ho-so-arm-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e8
  verified_at: 2026-11-09T23:39:53Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-t3-can-ho-so-arm-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e9
  verified_at: 2026-11-10T02:27:53Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-t3-can-ho-so-arm-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-t3-can-ho-so-arm-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-11-10T03:31:01Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Eval green-on-both: none. Mọi eval mang baseline n-a vì round này không đo lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E8 chạy và đạt; các eval còn lại tiếp tục ở round sau.
Round 2: E1–E7, E9 chạy và đạt; baseline được đo.
Round 3: E1–E7, E9 và E8 mang sang vì delta không chạm paths của eval; mười một lệnh suite chạy lại và đạt. Verdict PASS.
