---
schema_version: 2
feature_slug: t3-arm-chu-ky-khong-im
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ca0a1577c66e5e99667f5c786fcfb485abd6927e
human_signoff: Manh Phan 2026-11-11
---

# Evidence Report: t3-arm-chu-ky-khong-im

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-t3-arm-chu-ky-khong-im-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ak_e1
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-t3-arm-chu-ky-khong-im-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ak_e2
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-t3-arm-chu-ky-khong-im-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ak_e3
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-t3-arm-chu-ky-khong-im-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ak_e4
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-t3-arm-chu-ky-khong-im-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ak_e5
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-t3-arm-chu-ky-khong-im-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ak_e6
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-t3-arm-chu-ky-khong-im-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e8
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-t3-arm-chu-ky-khong-im-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ak_e8
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-10T13:20:17Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Không có eval không-phân-biệt được cần liệt kê. Các lệnh suite xanh cả hai phía là regression-guard bình thường.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E8 đã chạy và ghi vào run-log; kết quả được mang sang round 2.
Round 2: 11 lệnh suite xanh; E1-E8 carry-forward vì delta không chạm paths của các eval này; không có mục chờ người chốt.
