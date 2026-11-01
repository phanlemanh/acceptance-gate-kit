---
schema_version: 2
feature_slug: khuon-loi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b714c968e9cb41e15b48976b9b74629abdfc1abc
human_signoff:
---

# Evidence Report: khuon-loi

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
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |

## Evidence

Mười một eval cùng chạy qua một lệnh `node tests/scripts/khuon-loi.test.mjs` (một lượt, deterministic, runs 1). Dòng cuối của đầu ra là `PASS: [KL-10]`.

- eval: E1
  run_id: minted-khuon-loi-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E2
  run_id: minted-khuon-loi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E3
  run_id: minted-khuon-loi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E4
  run_id: minted-khuon-loi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E5
  run_id: minted-khuon-loi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E6
  run_id: minted-khuon-loi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E7
  run_id: minted-khuon-loi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E8
  run_id: minted-khuon-loi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E9
  run_id: minted-khuon-loi-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E10
  run_id: minted-khuon-loi-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

- eval: E11
  run_id: minted-khuon-loi-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T22:24:39Z
  output: |
    PASS: [KL-10]

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khuon-loi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khuon-loi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khuon-loi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-khuon-loi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-01T22:24:39Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không có eval nào xanh ở cả hai phía (baseline không đo được cho eval khuôn-lỗi, xem mục «Baseline khong do» bên dưới); các lệnh suite xanh là regression-guard thông thường, không liệt kê.

### Baseline khong do

- node tests/scripts/khuon-loi.test.mjs: bo qua baseline: tep tests/scripts/khuon-loi.test.mjs co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lượt, deterministic)

## Iterations

Round 1: E1–E11 đều xanh, các lệnh suite hồi quy xanh; verdict PASS, chờ người ký ở Cổng Bằng chứng.
