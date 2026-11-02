---
schema_version: 2
feature_slug: khuon-loi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 26f51f7201d1d75f3a0525ff7b4ba0c63c5763b5
human_signoff:
---

# Evidence Report: khuon-loi

Round 3. Mười một eval E1–E11 đều xanh trên cây 26f51f72, mọi lệnh suite hồi quy xanh, không có phát hiện trong hợp đồng; verdict PASS, chờ người ký ở Cổng Bằng chứng.

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

- eval: E1
  run_id: minted-khuon-loi-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E2
  run_id: minted-khuon-loi-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E3
  run_id: minted-khuon-loi-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E4
  run_id: minted-khuon-loi-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E5
  run_id: minted-khuon-loi-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E6
  run_id: minted-khuon-loi-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E7
  run_id: minted-khuon-loi-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E8
  run_id: minted-khuon-loi-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E9
  run_id: minted-khuon-loi-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E10
  run_id: minted-khuon-loi-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

- eval: E11
  run_id: minted-khuon-loi-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-02T01:14:27Z
  output: |
    node tests/scripts/khuon-loi.test.mjs (một lần chạy chung cho E1–E11)
    PASS: [KL-10]

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khuon-loi-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khuon-loi-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khuon-loi-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-khuon-loi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-11-02T01:14:27Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

none — baseline không đo lại round này; không có eval nào được xác nhận là không-phân-biệt.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E11 đều xanh, các lệnh suite hồi quy xanh; verdict PASS, chờ người ký ở Cổng Bằng chứng.
Round 2: E1–E11 vẫn xanh, nhưng suite vùng 3 của bộ plugin (ca P179) đỏ và có hai phát hiện trong hợp đồng chạm AC-7 (bước ghi số đo khuôn đòi HEAD bằng đúng sha lượt chấm). Returned to implementation.
Round 3: E1–E11 xanh, mọi lệnh suite hồi quy xanh (kể cả ba vùng của bộ plugin), không còn phát hiện trong hợp đồng; verdict PASS, chờ người ký ở Cổng Bằng chứng.
