---
schema_version: 2
feature_slug: doi-chung-chay-duoc
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 59c86b701fdffbd72de1e833adba2a2248889ff3
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

Lý do REJECT: cả chín eval của hợp đồng đều xanh, nhưng một lệnh suite hồi quy không gắn eval nào (`tests/plugins/run-tests.sh --manh vung:2`) đỏ ở ca P161 «strip-md giu duong dan + ma tran toan phan». Lệnh này không thuộc eval nào nên `failed_evals` để trống; xem khối suite bên dưới. Cần người xem ca P161 có do vòng này gây ra hay không, rồi chạy lại.

## Evidence

- eval: E1
  run_id: minted-doi-chung-chay-duoc-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_de_bai
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

- eval: E2
  run_id: minted-doi-chung-chay-duoc-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_shell_that
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

- eval: E3
  run_id: minted-doi-chung-chay-duoc-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_chep_sai
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

- eval: E4
  run_id: minted-doi-chung-chay-duoc-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_khong_phan_biet
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

- eval: E5
  run_id: minted-doi-chung-chay-duoc-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_phan_biet
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

- eval: E6
  run_id: minted-doi-chung-chay-duoc-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_doi_chung_ban_cu
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

- eval: E7
  run_id: minted-doi-chung-chay-duoc-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_moi_vai
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

- eval: E8
  run_id: minted-doi-chung-chay-duoc-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_dau_ket
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

- eval: E9
  run_id: minted-doi-chung-chay-duoc-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dccd_tac_tu_that
  verified_at: 2026-10-29T08:36:48Z
  output: |
    Results: 33 passed, 0 failed (doi-chung-chay-duoc)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 1
  verified_at: 2026-10-29T08:36:48Z
  output: |
    FAIL: P161 strip-md giu duong dan + ma tran toan phan
    Results: 1 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-doi-chung-chay-duoc-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-doi-chung-chay-duoc-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-doi-chung-chay-duoc-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-29T08:36:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào bị đánh dấu không-phân-biệt; cả chín eval feature đều n-a ở baseline (không đo được, xem «Baseline khong do» bên dưới), nên chưa có bằng chứng baseline đỏ cho chúng.

Lệnh fail không gắn eval: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'` — ca P161 «strip-md giu duong dan + ma tran toan phan» đỏ; không eval nào khai lệnh này, nên không vào `failed_evals`.

### Baseline khong do

- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC1a DC1b DC1c DC1d; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC2a DC2a-goi DC2a-cay DC2b DC2b-goi DC2b-cay DC2c; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC3a DC3b DC3c DC3d; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC4a DC4b; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC5a DC5b; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC6a DC6b DC6c; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC7a DC7b DC7c DC7d DC7e; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC8a DC8b; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/doi-chung-chay-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 30; [ $rc -eq 0 ] && for c in DC9a DC9b DC9c DC9d; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/doi-chung-chay-duoc.test.mjs co o cay dang kiem nhung chua co o merge-base d3cfca5c18d53a56f82a6cb580ff9469e3492f51 — eval moi, chay tren code cu khong phan biet gi

## Judge

Không có eval dạng judgment trong hợp đồng này nên không có hội đồng chấm và không có mục chờ người.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, tất định)

## Iterations

Round 1: không eval nào đỏ; lệnh suite `tests/plugins/run-tests.sh --manh vung:2` đỏ ở ca P161 (strip-md giu duong dan + ma tran toan phan), không gắn eval nào. Trả về để xem ca P161 và chạy lại.
