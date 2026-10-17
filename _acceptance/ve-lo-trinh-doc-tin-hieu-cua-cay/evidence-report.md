---
schema_version: 2
feature_slug: ve-lo-trinh-doc-tin-hieu-cua-cay
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8c1f48cc74bb47a3d30448f8869e9ab272140b6f
human_signoff:
---

# Evidence Report: ve-lo-trinh-doc-tin-hieu-cua-cay

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ve_lo_trinh_doc_tin_hieu_cua_cay
  verified_at: 2026-10-17T12:02:48Z
  output: |
    node tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs
    Kết quả: 9 PASS · 0 FAIL

- eval: E2
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ve_lo_trinh_doc_tin_hieu_cua_cay
  verified_at: 2026-10-17T12:02:48Z
  output: |
    node tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs
    Kết quả: 9 PASS · 0 FAIL

- eval: E3
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ve_lo_trinh_doc_tin_hieu_cua_cay
  verified_at: 2026-10-17T12:02:48Z
  output: |
    node tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs
    Kết quả: 9 PASS · 0 FAIL

- eval: E3b
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-10-17T12:02:48Z
  output: |
    node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs
    Results: 21 passed, 0 failed

- eval: E4
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ve_lo_trinh_doc_tin_hieu_cua_cay
  verified_at: 2026-10-17T12:02:48Z
  output: |
    node tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs
    Kết quả: 9 PASS · 0 FAIL

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ve-lo-trinh-doc-tin-hieu-cua-cay-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-17T12:02:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả code cũ lẫn code mới):
- node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs (E3b) — regression-guard có chủ ý: các ca RM3b vẫn phải xanh sau khi chân product-map của GW-2 được thay bằng VT-1…VT-3.

Baseline khong do:
- node tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs: bo qua baseline: tep tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs co o cay dang kiem nhung chua co o merge-base 43ed9e2b3e6d77e02d702a3171069c0af8843179 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, tất định, không có eval nhiều lần chạy.

## Iterations

Round 1: E1, E2, E3, E3b, E4 đều xanh, không eval nào hỏng. Các phát hiện của vòng chấm (một trong hợp đồng, bốn ngoài hợp đồng) nằm ở review-findings.md.
