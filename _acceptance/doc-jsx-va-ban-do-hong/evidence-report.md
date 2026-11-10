---
schema_version: 2
feature_slug: doc-jsx-va-ban-do-hong
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f481a5e50378fbdf05261b6479e5e1bcc6eff596
human_signoff: Manh Phan 2026-11-10
---

# Evidence Report: doc-jsx-va-ban-do-hong

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

## Evidence

- eval: E1
  run_id: minted-doc-jsx-va-ban-do-hong-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T08:32:49Z
  output: |
    (lệnh: node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs; 1 lần chạy, 1 lần qua)
    PASS: [DJ-8-do]

- eval: E2
  run_id: minted-doc-jsx-va-ban-do-hong-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T08:32:49Z
  output: |
    (lệnh: node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs; 1 lần chạy, 1 lần qua)
    PASS: [DJ-8-do]

- eval: E3
  run_id: minted-doc-jsx-va-ban-do-hong-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T08:32:49Z
  output: |
    (lệnh: node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs; 1 lần chạy, 1 lần qua)
    PASS: [DJ-8-do]

- eval: E4
  run_id: minted-doc-jsx-va-ban-do-hong-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T08:32:49Z
  output: |
    (lệnh: node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs; 1 lần chạy, 1 lần qua)
    PASS: [DJ-8-do]

- eval: E5
  run_id: minted-doc-jsx-va-ban-do-hong-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T08:32:49Z
  output: |
    (lệnh: node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs; 1 lần chạy, 1 lần qua)
    PASS: [DJ-8-do]

- eval: E6
  run_id: minted-doc-jsx-va-ban-do-hong-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T08:32:49Z
  output: |
    (lệnh: node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs; 1 lần chạy, 1 lần qua)
    PASS: [DJ-8-do]

- eval: E7
  run_id: minted-doc-jsx-va-ban-do-hong-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T08:32:49Z
  output: |
    (lệnh: node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs; 1 lần chạy, 1 lần qua)
    PASS: [DJ-8-do]

- eval: E8
  run_id: minted-doc-jsx-va-ban-do-hong-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T08:32:49Z
  output: |
    (lệnh: node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs; 1 lần chạy, 1 lần qua)
    PASS: [DJ-8-do]

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-10T08:32:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

Không có eval nào được đo baseline (cả tám eval dùng chung một lệnh, baseline là n-a), nên không có cơ sở xếp eval nào vào nhóm không-phân-biệt. Danh sách eval không-phân-biệt: rỗng (chưa đo).

Baseline khong do
- node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs: bo qua baseline: tep tests/scripts/doc-jsx-va-ban-do-hong.test.mjs co o cay dang kiem nhung chua co o merge-base c8fa5a65588609b622dc83a9b114d65d2bdc5b47 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chi tiết vòng này không có trong dữ liệu của vòng 2; đã trả về cho bước triển khai sửa.
Round 2: E1 đến E8 và toàn bộ lệnh suite qua; verdict PASS.
