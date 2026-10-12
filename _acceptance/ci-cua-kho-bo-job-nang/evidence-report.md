---
schema_version: 2
feature_slug: ci-cua-kho-bo-job-nang
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d942de54b3ad1a2cfa6c03ab6600d41107a4a9f9
human_signoff: manh 2026-10-12
---

# Evidence Report: ci-cua-kho-bo-job-nang

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
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |
| E12 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ci-cua-kho-bo-job-nang-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac1
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-1 node tests/scripts/hang-pr.test.mjs
    Results: 1 passed, 0 failed (hang-pr)

- eval: E2
  run_id: minted-ci-cua-kho-bo-job-nang-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac2
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-2,AC-2-do node tests/scripts/hang-pr.test.mjs
    Results: 2 passed, 0 failed (hang-pr)

- eval: E3
  run_id: minted-ci-cua-kho-bo-job-nang-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac3
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-3,AC-3-im,AC-3-do node tests/scripts/hang-pr.test.mjs
    Results: 3 passed, 0 failed (hang-pr)

- eval: E4
  run_id: minted-ci-cua-kho-bo-job-nang-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac4
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-4,AC-4-do node tests/scripts/hang-pr.test.mjs
    Results: 2 passed, 0 failed (hang-pr).

- eval: E5
  run_id: minted-ci-cua-kho-bo-job-nang-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac5
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-5 node tests/scripts/hang-pr.test.mjs
    Results: 1 passed, 0 failed (hang-pr)

- eval: E6
  run_id: minted-ci-cua-kho-bo-job-nang-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac6
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-6,AC-6-do node tests/scripts/hang-pr.test.mjs
    Results: 2 passed, 0 failed (hang-pr)

- eval: E7
  run_id: minted-ci-cua-kho-bo-job-nang-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac7
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-7 node tests/scripts/hang-pr.test.mjs
    Results: 1 passed, 0 failed (hang-pr)

- eval: E8
  run_id: minted-ci-cua-kho-bo-job-nang-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac8
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-8,AC-8-do,AC-8-lich-su,AC-8-lich-su-do node tests/scripts/hang-pr.test.mjs
    Results: 4 passed, 0 failed (hang-pr)

- eval: E9
  run_id: minted-ci-cua-kho-bo-job-nang-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac8_kho_that
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-8-kho-that node tests/scripts/hang-pr.test.mjs
    Results: 1 passed, 0 failed (hang-pr)

- eval: E10
  run_id: minted-ci-cua-kho-bo-job-nang-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac9
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-9,AC-9-do node tests/scripts/hang-pr.test.mjs
    Results: 2 passed, 0 failed (hang-pr)

- eval: E11
  run_id: minted-ci-cua-kho-bo-job-nang-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hp_ac10
  verified_at: 2026-10-11T21:30:02Z
  output: |
    HP_CASES=AC-10,AC-10-do node tests/scripts/hang-pr.test.mjs
    Results: 2 passed, 0 failed (hang-pr)

- eval: E12
  run_id: minted-ci-cua-kho-bo-job-nang-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-11T21:30:02Z
  output: |
    bash tests/workflows/run-tests.sh
    Results: all workflow tests passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ci-cua-kho-bo-job-nang-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T21:30:02Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- bash tests/workflows/run-tests.sh (E12): xanh cả hai phía — regression-guard của bộ workflow, hợp đồng AC-11 chủ ý đặt như vậy.

Baseline khong do:

- HP_CASES=AC-1 node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-2,AC-2-do node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-3,AC-3-im,AC-3-do node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-4,AC-4-do node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-5 node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-6,AC-6-do node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-7 node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-8,AC-8-do,AC-8-lich-su,AC-8-lich-su-do node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-8-kho-that node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-9,AC-9-do node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi
- HP_CASES=AC-10,AC-10-do node tests/scripts/hang-pr.test.mjs: bo qua baseline: tep tests/scripts/hang-pr.test.mjs co o cay dang kiem nhung chua co o merge-base d5931848ed1f6e9c0d8859d499872d7dd78eb7ce — eval moi, chay tren code cu khong phan biet gi

## Judge

Không có judgment item nào trong hợp đồng này (không eval executor judgment): không có hội đồng chấm, không có mục chờ human_override.

## Variance

none — mọi eval nhiều lượt đều đồng nhất (mọi eval chạy một lượt, xác định).

## Iterations

Round 1: mười hai eval máy và chín lệnh suite đều xanh; không eval nào đỏ. Chuyển sang Cổng 2.

### Re-pin lần 1 — 2026-10-12, do ghim lại sau gộp main 7b925967 (#322)
run_id: repin-20261012T020817Z-65142
sha: d942de54b3ad1a2cfa6c03ab6600d41107a4a9f9 · suites: 10 lệnh exit 0 · evals: 12/12 eval máy đạt kỳ vọng
