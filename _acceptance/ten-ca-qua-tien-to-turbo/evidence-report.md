---
schema_version: 2
feature_slug: ten-ca-qua-tien-to-turbo
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5e043c06f3347db65f3c982a357b054c1991ac1f
human_signoff: manh 2026-10-11 — ký lượt chấm 1; Ngoài-1 đến Ngoài-3 ghi Known limits; cắt/hoãn đồng ý cắt
---

# Evidence Report: ten-ca-qua-tien-to-turbo

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ten-ca-qua-tien-to-turbo-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tctt_ac1
  verified_at: 2026-10-11T10:26:58Z
  output: |
    Results: 1 passed, 0 failed

- eval: E2
  run_id: minted-ten-ca-qua-tien-to-turbo-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tctt_ac2
  verified_at: 2026-10-11T10:26:58Z
  output: |
    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-ten-ca-qua-tien-to-turbo-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tctt_ac3
  verified_at: 2026-10-11T10:26:58Z
  output: |
    Results: 1 passed, 0 failed

- eval: E4
  run_id: minted-ten-ca-qua-tien-to-turbo-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tctt_ac4
  verified_at: 2026-10-11T10:26:58Z
  output: |
    Results: 1 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ten-ca-qua-tien-to-turbo-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T10:26:58Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval feature nào pass trên cả cây đang kiểm lẫn baseline (không có eval green-on-both). Cả bốn eval feature mang baseline n-a vì là eval mới (xem «Baseline khong do» dưới đây), nên chiều đỏ của chúng nằm ở bản sao bị phá chạy bên trong chính eval, không ở phép so baseline.

Ghi chú máy: lệnh `bash tests/scripts/run-tests.sh --manh mjs:3/3` không để lại dòng Results trong phần đuôi đầu ra máy thu được; chỉ có mã thoát 0.

### Baseline khong do

- GG_CASES=AC-1 node tests/scripts/ten-ca-qua-tien-to.test.mjs: bo qua baseline: tep tests/scripts/ten-ca-qua-tien-to.test.mjs co o cay dang kiem nhung chua co o merge-base fa8310b64c82818f249ce0d05fdf7c39c7d56a0f — eval moi, chay tren code cu khong phan biet gi
- GG_CASES=AC-2 node tests/scripts/ten-ca-qua-tien-to.test.mjs: bo qua baseline: tep tests/scripts/ten-ca-qua-tien-to.test.mjs co o cay dang kiem nhung chua co o merge-base fa8310b64c82818f249ce0d05fdf7c39c7d56a0f — eval moi, chay tren code cu khong phan biet gi
- GG_CASES=AC-3 node tests/scripts/ten-ca-qua-tien-to.test.mjs: bo qua baseline: tep tests/scripts/ten-ca-qua-tien-to.test.mjs co o cay dang kiem nhung chua co o merge-base fa8310b64c82818f249ce0d05fdf7c39c7d56a0f — eval moi, chay tren code cu khong phan biet gi
- GG_CASES=AC-4 node tests/scripts/ten-ca-qua-tien-to.test.mjs: bo qua baseline: tep tests/scripts/ten-ca-qua-tien-to.test.mjs co o cay dang kiem nhung chua co o merge-base fa8310b64c82818f249ce0d05fdf7c39c7d56a0f — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, deterministic, không có dấu hiệu flaky).

## Iterations

Round 1: E1, E2, E3, E4 và 10 lệnh suite hồi quy đều xanh ở lượt chạy đầu — không eval đỏ, không trả lại thực thi. Verdict PASS.

### Re-pin lần 1 — 2026-10-11, do hoá cũ do gộp main #311 (gate-card.js, repin-lane.mjs) sau chữ ký
run_id: repin-20261011T114243Z-99112
sha: 6fb38aeab25c602bf06a819017f3f7c8a804fb5c · suites: 10 lệnh exit 0 · evals: 4/4 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-10-11, do hoá cũ do gộp main #312 (DP4) trước khi gộp PR
run_id: repin-20261011T123733Z-96623
sha: 10aa2f0beb8c35d9e691c79e813c399a1749bfb4 · suites: 10 lệnh exit 0 · evals: 4/4 eval máy đạt kỳ vọng

### Re-pin lần 3 — 2026-10-12, do chiến dịch ghim lại 2.27.0 — 22 hồ sơ hoá cũ theo paths so v2.26.0, sau chữ ký mốc (lượt làn thứ hai)
run_id: repin-20261012T065455Z-55784
sha: 5e043c06f3347db65f3c982a357b054c1991ac1f · suites: 10 lệnh exit 0 · evals: 4/4 eval máy đạt kỳ vọng
