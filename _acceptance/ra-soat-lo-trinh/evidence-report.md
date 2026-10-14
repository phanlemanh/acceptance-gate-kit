---
schema_version: 2
feature_slug: ra-soat-lo-trinh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1297d6a90f413d2a3ef142dd7a3b560ba3e51fb6
human_signoff:
---

# Evidence Report: ra-soat-lo-trinh

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
| E9 | AC-9 | test | PASS (carry-forward tu round 1) |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | test | PASS (carry-forward tu round 1) |

## Evidence

- eval: E1
  run_id: minted-ra-soat-lo-trinh-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E2
  run_id: minted-ra-soat-lo-trinh-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E3
  run_id: minted-ra-soat-lo-trinh-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E4
  run_id: minted-ra-soat-lo-trinh-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E5
  run_id: minted-ra-soat-lo-trinh-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E6
  run_id: minted-ra-soat-lo-trinh-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E7
  run_id: minted-ra-soat-lo-trinh-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E8
  run_id: minted-ra-soat-lo-trinh-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E9
  run_id: minted-ra-soat-lo-trinh-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh_crm
  verified_at: 2026-10-14T14:46:29Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-ra-soat-lo-trinh-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T16:55:09Z
  output: |
    Results: 31 passed, 0 failed (ra-soat-lo-trinh)

- eval: E10b
  run_id: minted-ra-soat-lo-trinh-E10b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-14T14:46:29Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ra-soat-lo-trinh-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ra-soat-lo-trinh-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-14T16:55:09Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Baseline khong do: moi block eval round nay ghi `baseline: n-a` vi evals.yaml khong doi tu lan baseline cuoi (round 1), nen khong do lai.

Eval khong-phan-biet (green tren ca HEAD lan baseline, theo ket qua round 1): E10b (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 ...'`). Eval nay chung minh harness khoa so phien ban bon goi, khong chung minh hanh vi moi cua feature; nguoi quyet o Cong 2: giu lam regression-guard co chu y hay viet lai de assert hanh vi moi.

## Variance

none — every multi-run eval is uniform (moi eval chay 1 lan, deterministic)

## Iterations

Round 1: moi eval va lenh suite PASS tren sha b7b8f1d2; E10b duoc ghi khong-phan-biet o baseline.
Round 2: sua RS-0 (do quan he tep thay vi dem commit gop, them chieu do), them 5 hang so known-limits, ha implemented cho S4 luot 2; chay lai E1-E8, E10 va 11 lenh suite tren 1297d6a9 — tat ca PASS. E9 va E10b carry-forward tu round 1 (delta khong cham paths cua eval). Moc verified_at cua cac khoi round 2 la thoi diem soan bao cao (payload khong kem gio tung eval).
