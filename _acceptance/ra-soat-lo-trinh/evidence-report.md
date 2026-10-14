---
schema_version: 2
feature_slug: ra-soat-lo-trinh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b7b8f1d28ee707d02c50cfca16675c02f0697a62
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
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ra-soat-lo-trinh-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E2
  run_id: minted-ra-soat-lo-trinh-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E3
  run_id: minted-ra-soat-lo-trinh-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E4
  run_id: minted-ra-soat-lo-trinh-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E5
  run_id: minted-ra-soat-lo-trinh-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E6
  run_id: minted-ra-soat-lo-trinh-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E7
  run_id: minted-ra-soat-lo-trinh-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E8
  run_id: minted-ra-soat-lo-trinh-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E9
  run_id: minted-ra-soat-lo-trinh-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh_crm
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh-crm.mjs
    Results: 2 passed, 0 failed (ra-soat-lo-trinh-crm)

- eval: E10
  run_id: minted-ra-soat-lo-trinh-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ra_soat_lo_trinh
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: node tests/scripts/ra-soat-lo-trinh.test.mjs
    Results: 30 passed, 0 failed (ra-soat-lo-trinh)

- eval: E10b
  run_id: minted-ra-soat-lo-trinh-E10b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-14T14:46:29Z
  output: |
    Lệnh: bash tests/plugins/run-tests.sh --manh vung:3 (lọc dòng Results)
    Results: all plugin tests passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ra-soat-lo-trinh-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ra-soat-lo-trinh-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ra-soat-lo-trinh-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-14T14:46:29Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên cây đang kiểm lẫn baseline, tức là regression-guard hiện có, không chứng minh hành vi mới):

- E10b (lệnh bash tests/plugins/run-tests.sh --manh vung:3 qua bộ lọc Results) — ca P200 khoá số phiên bản gói đã xanh trên baseline; xác nhận là regression-guard có chủ ý cho phần số phiên bản, phần hành vi mới của AC-10 do E10 phủ.

Baseline khong do:

- node tests/scripts/ra-soat-lo-trinh.test.mjs: bo qua baseline: tep tests/scripts/ra-soat-lo-trinh.test.mjs co o cay dang kiem nhung chua co o merge-base 70f0f26da342e77a89184c0e9c5170dd8ed9dbb1 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/ra-soat-lo-trinh-crm.mjs: bo qua baseline: tep tests/scripts/ra-soat-lo-trinh-crm.mjs co o cay dang kiem nhung chua co o merge-base 70f0f26da342e77a89184c0e9c5170dd8ed9dbb1 — eval moi, chay tren code cu khong phan biet gi

Các phát hiện ngoài hợp đồng của vòng này (không AC nào phủ) nằm ở review-findings.md để người quyết ở Gate 2; không có eval nào của vòng bị đỏ.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: tất cả eval xanh (E1–E10, E10b); không có vòng trả về.
