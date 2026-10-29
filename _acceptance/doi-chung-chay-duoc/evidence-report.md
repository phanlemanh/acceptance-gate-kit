---
schema_version: 2
feature_slug: doi-chung-chay-duoc
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c4978485077faa029ae9ff78ecf9af1c78d7edec
human_signoff:
---

# Evidence Report: doi-chung-chay-duoc

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
  run_id: minted-doi-chung-chay-duoc-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_de_bai
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-doi-chung-chay-duoc-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_shell_that
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-doi-chung-chay-duoc-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_chep_sai
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-doi-chung-chay-duoc-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_khong_phan_biet
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-doi-chung-chay-duoc-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_phan_biet
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-doi-chung-chay-duoc-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_doi_chung_ban_cu
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-doi-chung-chay-duoc-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_moi_vai
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-doi-chung-chay-duoc-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_dau_ket
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-doi-chung-chay-duoc-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_tac_tu_that
  verified_at: 2026-10-29T08:36:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-doi-chung-chay-duoc-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-doi-chung-chay-duoc-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-29T12:58:20Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1). Moi eval mang baseline: n-a.

Eval khong-phan-biet (xanh ca hai phia): none. Lenh suite xanh ca hai phia la regression-guard binh thuong, khong liet ke.

## Variance

none — khong eval nao chay nhieu lan; moi eval deterministic.

## Iterations

Round 1: E1–E9 chay lan dau, ket qua duoc carry-forward sang round 3 (delta khong cham paths cua eval).
Round 2: S4 luot 2 bi tu choi — so known-limits thieu hang (P179); da them 8 hang so known-limits.
Round 3: E1–E9 carry-forward tu round 1; 11 lenh suite chay lai tren verified_commit, tat ca xanh. Verdict PASS. (verified_at cua khoi suite la gio ghi bao cao xap xi, khong lay tu run-log.)
