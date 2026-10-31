---
schema_version: 2
feature_slug: pre-merge-doc-lib-theo-kit
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 968860f030b74f6ade20462261ed745aaef883e2
human_signoff:
---

# Evidence Report: pre-merge-doc-lib-theo-kit

Vòng 1. Cả năm eval của hợp đồng (E1–E5) đều xanh, nhưng MỘT lệnh suite hồi quy không gắn eval nào là `bash tests/scripts/run-tests.sh --manh mjs:1/3` đã đỏ (39 passed, 1 failed). Vì có lệnh đỏ nên phán quyết là REJECT dù `failed_evals` rỗng; xem mục «Lệnh suite (hồi quy)» và «Analyst».

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-pre-merge-doc-lib-theo-kit-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e1
  verified_at: 2026-10-31T11:25:07Z
  output: |
    Results: 4 passed, 0 failed

- eval: E2
  run_id: minted-pre-merge-doc-lib-theo-kit-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e2
  verified_at: 2026-10-31T11:25:07Z
  output: |
    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-pre-merge-doc-lib-theo-kit-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e3
  verified_at: 2026-10-31T11:25:07Z
  output: |
    Results: 2 passed, 0 failed

- eval: E4
  run_id: minted-pre-merge-doc-lib-theo-kit-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e4
  verified_at: 2026-10-31T11:25:07Z
  output: |
    Results: 1 passed, 0 failed

- eval: E5
  run_id: minted-pre-merge-doc-lib-theo-kit-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pmlk_e5
  verified_at: 2026-10-31T11:25:07Z
  output: |
    Results: 2 passed, 0 failed

### Lệnh suite (hồi quy)

Lệnh dưới đây chạy mỗi vòng, không gắn AC nào. Lệnh `mjs:1/3` là lệnh ĐỎ không gắn eval: bộ chạy báo «Results: 39 passed, 1 failed» và phần đuôi đầu ra đã lưu không cho thấy tên ca đỏ, nên báo cáo này không gọi tên ca và không đoán nguyên nhân.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-10-31T11:25:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-pre-merge-doc-lib-theo-kit-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-31T11:25:07Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh ở cả hai phía): none — danh sách rỗng. Lưu ý: baseline không đo được cho cả năm eval (xem dưới), nên không có eval nào được xác nhận là đỏ trên cây cũ; trạng thái «có phân biệt» của E1–E5 chưa được máy chứng minh bằng A/B.

Lệnh suite đỏ không gắn eval: `bash tests/scripts/run-tests.sh --manh mjs:1/3` — 39 passed, 1 failed; đây là lý do duy nhất của phán quyết REJECT. Tên ca đỏ không có trong phần đuôi đầu ra đã lưu.

Baseline không đo:
- bash -c 'out=$(node tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs LK1 LK1-do 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 4 passed, 0 failed" || exit 1; for c in kho-khong-lib ban-goc chi-goc-kho ooc-goc-kho; do printf "%s\n" "$out" | grep -qE "^PASS: LK1(-do)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs LK2 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in kho-co-lib-chep; do printf "%s\n" "$out" | grep -qE "^PASS: LK2(-do)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs LK3 LK3-do 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 2 passed, 0 failed" || exit 1; for c in kho-lib-chep-hong dao-thu-tu; do printf "%s\n" "$out" | grep -qE "^PASS: LK3(-do)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs LK4 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in lui-ve-goc-kho; do printf "%s\n" "$out" | grep -qE "^PASS: LK4(-do)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs LK5 LK5-do 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 2 passed, 0 failed" || exit 1; for c in quet-lop hinh-dang; do printf "%s\n" "$out" | grep -qE "^PASS: LK5(-do)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi

Hội đồng judge: không có panel nào được đề xuất ở vòng này (cả năm eval là eval máy dạng script, không có eval judgment); không có mục nào chờ human_override.

## Variance

none — every multi-run eval is uniform (cả năm eval và mọi lệnh suite chạy một lần, deterministic).

## Iterations

Round 1: không eval nào của hợp đồng đỏ (E1–E5 đều xanh); lệnh suite `bash tests/scripts/run-tests.sh --manh mjs:1/3` đỏ (39 passed, 1 failed) và không gắn eval nào. Returned to implementation.
