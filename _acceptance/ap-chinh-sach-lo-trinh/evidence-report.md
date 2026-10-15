---
schema_version: 2
feature_slug: ap-chinh-sach-lo-trinh
verdict: REJECT
failed_evals: ["E7b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6a69b37d2b2facd5e64397d148868b435691955a
human_signoff:
---

# Evidence Report: ap-chinh-sach-lo-trinh

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | FAIL |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ap-chinh-sach-lo-trinh-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E2
  run_id: minted-ap-chinh-sach-lo-trinh-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E3
  run_id: minted-ap-chinh-sach-lo-trinh-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E4
  run_id: minted-ap-chinh-sach-lo-trinh-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E5
  run_id: minted-ap-chinh-sach-lo-trinh-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E6
  run_id: minted-ap-chinh-sach-lo-trinh-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E7
  run_id: minted-ap-chinh-sach-lo-trinh-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E7b
  run_id: minted-ap-chinh-sach-lo-trinh-E7b-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-15T04:31:38Z
  output: |
    FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    Results: 1 failed

- eval: E8
  run_id: minted-ap-chinh-sach-lo-trinh-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E9
  run_id: minted-ap-chinh-sach-lo-trinh-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E10
  run_id: minted-ap-chinh-sach-lo-trinh-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 53 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E11
  run_id: minted-ap-chinh-sach-lo-trinh-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh_crm
  verified_at: 2026-10-15T04:31:38Z
  output: |
    Results: 1 passed, 0 failed (ap-chinh-sach-lo-trinh-crm)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-15T04:31:38Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-15T04:31:38Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do:
- node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs: bo qua baseline: tep tests/scripts/ap-chinh-sach-lo-trinh.test.mjs co o cay dang kiem nhung chua co o merge-base 59ab26e746522bf16028b80cb1cf3485b20f6080 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/ap-chinh-sach-lo-trinh-crm.mjs: bo qua baseline: tep tests/scripts/ap-chinh-sach-lo-trinh-crm.mjs co o cay dang kiem nhung chua co o merge-base 59ab26e746522bf16028b80cb1cf3485b20f6080 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7b failed — suite vùng 1 của plugin đỏ ở ca P93 (bảng luật một nguồn + cấp marker duy nhất toàn kho); lệnh vùng 3 cũng đỏ ở ca LB2 (lệnh có tiền tố ngoài bảng, feature-loop/skills/feature-loop/SKILL.md dòng 221 nêu /road-map:tra-lai và /road-map:ghim) nhưng không gắn eval nào. Returned to implementation.
