---
schema_version: 2
feature_slug: khoi-khuon-tren-the-cong
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 17ac5d87cbdee33124e2ce3e2e200609176bd0e8
human_signoff:
---

# Evidence Report: khoi-khuon-tren-the-cong

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

Tám eval E1–E8 cùng chạy bằng một lệnh `node tests/scripts/khoi-khuon-tren-the-cong.test.mjs` (một lượt, một lần qua, không phương sai). Mỗi khối dưới đây trỏ về lượt chạy đó; dòng cuối của đầu ra là cờ đỏ-xanh của chiều đỏ KK-8-do2.

- eval: E1
  run_id: minted-khoi-khuon-tren-the-cong-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T15:32:28Z
  output: |
    lệnh: node tests/scripts/khoi-khuon-tren-the-cong.test.mjs (chung cho E1–E8)
    PASS: [KK-8-do2]

- eval: E2
  run_id: minted-khoi-khuon-tren-the-cong-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T15:32:28Z
  output: |
    lệnh: node tests/scripts/khoi-khuon-tren-the-cong.test.mjs (chung cho E1–E8)
    PASS: [KK-8-do2]

- eval: E3
  run_id: minted-khoi-khuon-tren-the-cong-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T15:32:28Z
  output: |
    lệnh: node tests/scripts/khoi-khuon-tren-the-cong.test.mjs (chung cho E1–E8)
    PASS: [KK-8-do2]

- eval: E4
  run_id: minted-khoi-khuon-tren-the-cong-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T15:32:28Z
  output: |
    lệnh: node tests/scripts/khoi-khuon-tren-the-cong.test.mjs (chung cho E1–E8)
    PASS: [KK-8-do2]

- eval: E5
  run_id: minted-khoi-khuon-tren-the-cong-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T15:32:28Z
  output: |
    lệnh: node tests/scripts/khoi-khuon-tren-the-cong.test.mjs (chung cho E1–E8)
    PASS: [KK-8-do2]

- eval: E6
  run_id: minted-khoi-khuon-tren-the-cong-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T15:32:28Z
  output: |
    lệnh: node tests/scripts/khoi-khuon-tren-the-cong.test.mjs (chung cho E1–E8)
    PASS: [KK-8-do2]

- eval: E7
  run_id: minted-khoi-khuon-tren-the-cong-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T15:32:28Z
  output: |
    lệnh: node tests/scripts/khoi-khuon-tren-the-cong.test.mjs (chung cho E1–E8)
    PASS: [KK-8-do2]

- eval: E8
  run_id: minted-khoi-khuon-tren-the-cong-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T15:32:28Z
  output: |
    lệnh: node tests/scripts/khoi-khuon-tren-the-cong.test.mjs (chung cho E1–E8)
    PASS: [KK-8-do2]

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-03T15:32:28Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh ở cả hai phía (đúng danh sách rỗng); tám eval feature E1–E8 có baseline n-a vì eval mới, xem mục «Baseline khong do» bên dưới.

### Baseline khong do

- node tests/scripts/khoi-khuon-tren-the-cong.test.mjs: bo qua baseline: tep tests/scripts/khoi-khuon-tren-the-cong.test.mjs co o cay dang kiem nhung chua co o merge-base 39fa45cc76421ac955808351261a0de23e3fade8 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E8 và mười một lệnh suite đều xanh ngay lần chạy đầu; không có eval hỏng, không trả về implementation.
