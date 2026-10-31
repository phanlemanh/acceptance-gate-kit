---
schema_version: 2
feature_slug: quet-het-han-khong-moi-ky
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d3eca8fdc6022e3b78e31d7bb58410b931f53026
human_signoff: Manh Phan 2026-11-01
---

# Evidence Report: quet-het-han-khong-moi-ky

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-quet-het-han-khong-moi-ky-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.quet_het_han
  verified_at: 2026-10-31T15:48:14Z
  output: |
    QH: tất cả PASS

- eval: E2
  run_id: minted-quet-het-han-khong-moi-ky-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.quet_het_han
  verified_at: 2026-10-31T15:48:14Z
  output: |
    QH: tất cả PASS

- eval: E3
  run_id: minted-quet-het-han-khong-moi-ky-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.quet_het_han
  verified_at: 2026-10-31T15:48:14Z
  output: |
    QH: tất cả PASS

- eval: E4
  run_id: minted-quet-het-han-khong-moi-ky-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.quet_het_han
  verified_at: 2026-10-31T15:48:14Z
  output: |
    QH: tất cả PASS

- eval: E5
  run_id: minted-quet-het-han-khong-moi-ky-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.quet_het_han
  verified_at: 2026-10-31T15:48:14Z
  output: |
    QH: tất cả PASS

- eval: E6
  run_id: minted-quet-het-han-khong-moi-ky-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.quet_het_han_rt5
  verified_at: 2026-10-31T15:48:14Z
  output: |
    PASS: [RT5] 4 khoá mới có nhãn riêng + bucket đúng; bản đồ và thẻ in chữ từ bảng; thẻ không mời ký hồ sơ máy-thông; ngưỡng không-gạch: thẻ ⇔ lib cùng kết luận

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-quet-het-han-khong-moi-ky-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-31T15:48:14Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline):
- E6 (`RT_CASES=RT5 node tests/plugins/ra-co-ten.test.mjs`): xanh cả hai phía — regression-guard có chủ ý cho bảng nhãn và ngưỡng thẻ.

Baseline khong do:
- node tests/scripts/quet-het-han-khong-moi-ky.test.mjs: bo qua baseline: tep tests/scripts/quet-het-han-khong-moi-ky.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi

Judge panels: không có eval judgment nào trong hợp đồng này — E1–E6 đều là executor test, nên không có panel và không có mục chờ human_override.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E6 đều xanh, suite hồi quy xanh. Verdict PASS.
