---
schema_version: 2
feature_slug: ra-soat-lo-trinh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: eb3b62050567867f7b3d4b97d343583199dbe485
human_signoff: Manh Phan 2026-10-15
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
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | test | PASS (carry-forward tu round 1) |
| E11 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ra-soat-lo-trinh-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E2
  run_id: minted-ra-soat-lo-trinh-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E3
  run_id: minted-ra-soat-lo-trinh-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E4
  run_id: minted-ra-soat-lo-trinh-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E5
  run_id: minted-ra-soat-lo-trinh-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E6
  run_id: minted-ra-soat-lo-trinh-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E7
  run_id: minted-ra-soat-lo-trinh-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E8
  run_id: minted-ra-soat-lo-trinh-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E9
  run_id: minted-ra-soat-lo-trinh-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh_crm
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 2 passed, 0 failed (ra-soat-lo-trinh-crm)

- eval: E10
  run_id: minted-ra-soat-lo-trinh-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

- eval: E10b
  run_id: minted-ra-soat-lo-trinh-E10b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-14T14:46:29Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-ra-soat-lo-trinh-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T23:36:40Z
  output: |
    Results: 42 passed, 0 failed (ra-soat-lo-trinh)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ra-soat-lo-trinh-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ra-soat-lo-trinh-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-14T23:36:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Luu y de doc cho dung: round nay khong eval nao do duoc baseline (moi block ghi `baseline: n-a`, ly do o muc ben duoi), nen cau tren nghia la khong co eval nao DUOC GHI NHAN green tren ca hai phia trong round nay. Rieng E10b carry-forward tu round 1, noi round 1 da ghi no la khong-phan-biet (green tren ca HEAD lan baseline): no khoa so phien ban bon goi, la regression-guard co chu y, khong chung minh hanh vi moi cua feature.

Baseline khong do:
- node tests/scripts/ra-soat-lo-trinh.test.mjs: bo qua baseline: tep tests/scripts/ra-soat-lo-trinh.test.mjs co o cay dang kiem nhung chua co o merge-base 59ab26e746522bf16028b80cb1cf3485b20f6080 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/ra-soat-lo-trinh-crm.mjs: bo qua baseline: tep tests/scripts/ra-soat-lo-trinh-crm.mjs co o cay dang kiem nhung chua co o merge-base 59ab26e746522bf16028b80cb1cf3485b20f6080 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform (moi eval chay 1 lan, deterministic)

## Iterations

Round 1: moi eval va lenh suite PASS tren sha b7b8f1d2; E10b duoc ghi khong-phan-biet o baseline.
Round 2: sua RS-0 (do quan he tep thay vi dem commit gop, them chieu do), them 5 hang so known-limits, ha implemented cho S4 luot 2; chay lai E1-E8, E10 va 11 lenh suite tren 1297d6a9 — tat ca PASS. E9 va E10b carry-forward tu round 1.
Round 3: Cong Bang chung tra lai de nang pham vi (RS-2-tu-khai, RS-4-lenh, RS-11 moi, RS-0 hai ve co lap); them E11 cho AC-11; chay lai E1-E11 (tru E10b) va 11 lenh suite tren eb3b6205 — tat ca PASS, ra-soat-lo-trinh.test.mjs 42 ca. E10b carry-forward tu round 1 (delta khong cham paths cua eval). Moc verified_at cua cac khoi round 3 la ngay soan bao cao (payload khong kem gio tung eval).
