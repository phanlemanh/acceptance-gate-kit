---
schema_version: 2
feature_slug: glob-hai-sao-khop-goc-kho
verdict: PENDING-JUDGMENT
triage_failed: true
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 36faacd7c7fac364f5c6d0f6cab48d9e2c0bd863
human_signoff:
---

# Evidence Report: glob-hai-sao-khop-goc-kho

⚠ phân loại phạm vi KHÔNG chạy được — không lỗi nào được máy tự sửa, danh sách đầy đủ nằm trong review-findings.md, người xem lại toàn bộ trước khi ký.

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

## Evidence

- eval: E1
  run_id: minted-glob-hai-sao-khop-goc-kho-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E2
  run_id: minted-glob-hai-sao-khop-goc-kho-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E3
  run_id: minted-glob-hai-sao-khop-goc-kho-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E4
  run_id: minted-glob-hai-sao-khop-goc-kho-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E5
  run_id: minted-glob-hai-sao-khop-goc-kho-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E6
  run_id: minted-glob-hai-sao-khop-goc-kho-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E7
  run_id: minted-glob-hai-sao-khop-goc-kho-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E8
  run_id: minted-glob-hai-sao-khop-goc-kho-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E9
  run_id: minted-glob-hai-sao-khop-goc-kho-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E10
  run_id: minted-glob-hai-sao-khop-goc-kho-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-07T21:58:33Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-glob-hai-sao-khop-goc-kho-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-07T21:58:33Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-glob-hai-sao-khop-goc-kho-SUITE-bash_tests_plugins_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-07T21:58:33Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-glob-hai-sao-khop-goc-kho-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-07T21:58:33Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-glob-hai-sao-khop-goc-kho-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-07T21:58:33Z

## Known limits

## Ngoài hợp đồng

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E10

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E10 và bốn lệnh suite đều exit 0 (825/0 failed, 60/0, plugin all passed, workflow 44/0, product-map khớp) — nhưng bước phân loại phạm vi (scope-triage) không chạy được nên máy không tự sửa gì; verdict PENDING-JUDGMENT, danh sách đầy đủ chờ người tại review-findings.md.
