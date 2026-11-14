---
schema_version: 2
feature_slug: mc11-ten-kho
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: bc7338fdeb0fd9e55c58e45b876039b136f31a46
human_signoff:
---

# Evidence Report: mc11-ten-kho

Round 1. Cả ba eval của hợp đồng (E1, E2, E3) chạy xanh. Verdict vẫn là REJECT vì ba lệnh hồi quy không gắn eval nào chạy đỏ, và vì có một phát hiện trong hợp đồng (AC-3) nói nhánh đỏ của MCK-3 không thể xảy ra. Chi tiết ở phần Analyst và ở review-findings.md.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-mc11-ten-kho-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-11-13T23:13:23Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E2
  run_id: minted-mc11-ten-kho-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mc11_ten_kho_chieu_do
  verified_at: 2026-11-13T23:13:23Z
  output: |
    mc11-ten-kho chieu-do: 5 passed, 0 failed

- eval: E3
  run_id: minted-mc11-ten-kho-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mc11_ten_kho_chieu_do
  verified_at: 2026-11-13T23:13:23Z
  output: |
    mc11-ten-kho chieu-do: 5 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-13T23:13:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-11-13T23:13:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-13T23:13:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-13T23:13:23Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-13T23:13:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-11-13T23:13:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-13T23:13:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-13T23:13:23Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-mc11-ten-kho-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-13T23:13:23Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-mc11-ten-kho-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-11-13T23:13:23Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-mc11-ten-kho-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-13T23:13:23Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline):
- node tests/scripts/moc-chien-dich.test.mjs (E1): chạy xanh trên code cũ. Chiều đỏ của ca MC-11 nằm ở E2, E3, nên E1 là regression-guard có chủ ý.

Baseline khong do
- bash _acceptance/mc11-ten-kho/rang/chieu-do.sh: bo qua baseline: tep _acceptance/mc11-ten-kho/rang/chieu-do.sh co o cay dang kiem nhung chua co o merge-base 0c4e503b1d9649faa6948dd169573717b6dddce4 — eval moi, chay tren code cu khong phan biet gi

Lệnh đỏ không gắn eval nào (căn cứ cho verdict REJECT):
- bash tests/scripts/run-tests.sh --manh mjs:1/3: tổng kết "Results: 43 passed, 1 failed". Phần đuôi đã lưu không hiện tên ca đỏ. Cần chạy lại để xác định ca đỏ và xem nó có liên quan đến thay đổi này không.
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 ...': hai ca đỏ, P122 (bước làm mới bản đồ nằm sau bước ghi field cổng) và P126 (PRODUCT-MAP.md miễn trừ t1, --check cảnh thật, có trong CI, có ADR).
- node scripts/product-map.mjs --root . --check: báo PRODUCT-MAP.md và LO-TRINH.html lệch với hồ sơ xưởng. Cách sửa mà chính thông báo nêu là chạy node scripts/product-map.mjs --root . để sinh lại. Có thể cùng nguồn với P126 ở trên.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3 xanh; ba lệnh suite đỏ (mjs:1/3, plugins vung:1, product-map --check) và một phát hiện trong hợp đồng ở AC-3 (MCK-3 không có nhánh đỏ tới được). Verdict REJECT, trả về implementation.
