---
schema_version: 2
feature_slug: run-id-danh-sach-cho-phep
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 19385a0f0bea49f6bc1f89b36b66b881556c09e9
human_signoff:
---

# Evidence Report: run-id-danh-sach-cho-phep

Round 1. Sáu eval của hợp đồng (E1–E6) đều xanh. Verdict tổng là REJECT vì một lệnh suite không gắn eval nào (`bash tests/scripts/run-tests.sh --manh mjs:1/3`) đỏ: kết quả 39 qua, 1 hỏng. Lệnh này không gắn eval nên `failed_evals` để trống.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-run-id-danh-sach-cho-phep-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e1
  verified_at: 2026-10-31T19:37:27Z
  output: |
    Results: 2 passed, 0 failed

- eval: E2
  run_id: minted-run-id-danh-sach-cho-phep-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e2
  verified_at: 2026-10-31T19:37:27Z
  output: |
    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-run-id-danh-sach-cho-phep-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e3
  verified_at: 2026-10-31T19:37:27Z
  output: |
    Results: 1 passed, 0 failed

- eval: E4
  run_id: minted-run-id-danh-sach-cho-phep-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e4
  verified_at: 2026-10-31T19:37:27Z
  output: |
    Results: 1 passed, 0 failed

- eval: E5
  run_id: minted-run-id-danh-sach-cho-phep-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e5
  verified_at: 2026-10-31T19:37:27Z
  output: |
    Results: 1 passed, 0 failed

- eval: E6
  run_id: minted-run-id-danh-sach-cho-phep-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e6
  verified_at: 2026-10-31T19:37:27Z
  output: |
    Results: 1 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-10-31T19:37:27Z
  note: đỏ — kết quả cuối «Results: 39 passed, 1 failed»; lệnh không gắn eval nào của hợp đồng nên chưa quy được nguyên nhân vào AC. Phần đuôi đầu ra đã lưu chỉ hiện các ca xanh cuối lô (TD-9, xem-trang-lo-trinh), ca hỏng nằm ở phần trước của đầu ra.

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-31T19:37:27Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Ghi chú: không eval nào có baseline đo được (cả sáu đều n-a, lý do ở dưới), nên dòng «none» ở trên không có nghĩa là đã chứng minh từng eval đỏ trên mã cũ.

### Baseline khong do

- bash -c 'out=$(node tests/scripts/run-id-danh-sach-cho-phep.test.mjs RH1 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 2 passed, 0 failed" || exit 1; for c in "RH1 dong-eval" "RH1-do ban-goc-va-dot-bien"; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/run-id-danh-sach-cho-phep.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/run-id-danh-sach-cho-phep.test.mjs RH2 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in "RH2 dong-suite"; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/run-id-danh-sach-cho-phep.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/run-id-danh-sach-cho-phep.test.mjs RH3 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in "RH3 khu-hoi"; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/run-id-danh-sach-cho-phep.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/run-id-danh-sach-cho-phep.test.mjs RH4 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in "RH4 loc-mang-sang"; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/run-id-danh-sach-cho-phep.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/run-id-danh-sach-cho-phep.test.mjs RH5 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in "RH5 so-cu-hong"; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/run-id-danh-sach-cho-phep.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/run-id-danh-sach-cho-phep.test.mjs RH6 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in "RH6 mot-nguon"; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/run-id-danh-sach-cho-phep.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: sáu eval E1–E6 xanh; lệnh suite `bash tests/scripts/run-tests.sh --manh mjs:1/3` đỏ (39 qua, 1 hỏng), không gắn eval nào. Chưa có hội đồng chấm nào để ghi (hợp đồng không khai mục judgment). Trả về cho khâu thực thi để tìm ca hỏng trong lô mjs 1/3 và quyết định ca đó thuộc vòng này hay có sẵn từ trước.
