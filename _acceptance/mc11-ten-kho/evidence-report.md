---
schema_version: 2
feature_slug: mc11-ten-kho
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6b7b772ad2f976bf79cd49c33fbf665783bfe864
human_signoff:
---

# Evidence Report: mc11-ten-kho

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-mc11-ten-kho-E1-r1
  exit_code: 0
  carried_from_round: 1
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-11-13T23:13:23Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-mc11-ten-kho-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mc11_ten_kho_chieu_do
  verified_at: 2026-11-14T00:25:02Z
  output: |
    mc11-ten-kho chieu-do: 5 passed, 0 failed

- eval: E3
  run_id: minted-mc11-ten-kho-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mc11_ten_kho_chieu_do
  verified_at: 2026-11-14T00:25:02Z
  output: |
    mc11-ten-kho chieu-do: 5 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash _acceptance/mc11-ten-kho/rang/chieu-do.sh
  run_id: minted-mc11-ten-kho-E2-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-mc11-ten-kho-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-mc11-ten-kho-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-14T00:25:02Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do:
- bash _acceptance/mc11-ten-kho/rang/chieu-do.sh: bo qua baseline: tep _acceptance/mc11-ten-kho/rang/chieu-do.sh co o cay dang kiem nhung chua co o merge-base 0c4e503b1d9649faa6948dd169573717b6dddce4 — eval moi, chay tren code cu khong phan biet gi

Ghi chu: khong co hoi dong judge round nay (khong co judgment item).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: MCK-3 bi pha bang chay that tep ca (S4 REJECT) — quay lai thuc thi, sua phep kiem ca bang gach-va-ngoac.
Round 2: E2, E3 chay lai PASS (5 passed, 0 failed); E1 carry-forward tu round 1 — delta khong cham paths cua eval.
