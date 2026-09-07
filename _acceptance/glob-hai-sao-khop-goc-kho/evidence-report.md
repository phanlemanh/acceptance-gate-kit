---
schema_version: 2
feature_slug: glob-hai-sao-khop-goc-kho
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 765a647cc998e1ff5ffbfcf70df6f218068af574
human_signoff:
---

# Evidence Report: glob-hai-sao-khop-goc-kho

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
  run_id: minted-glob-hai-sao-khop-goc-kho-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E2
  run_id: minted-glob-hai-sao-khop-goc-kho-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E3
  run_id: minted-glob-hai-sao-khop-goc-kho-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E4
  run_id: minted-glob-hai-sao-khop-goc-kho-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E5
  run_id: minted-glob-hai-sao-khop-goc-kho-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E6
  run_id: minted-glob-hai-sao-khop-goc-kho-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E7
  run_id: minted-glob-hai-sao-khop-goc-kho-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E8
  run_id: minted-glob-hai-sao-khop-goc-kho-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E9
  run_id: minted-glob-hai-sao-khop-goc-kho-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

- eval: E10
  run_id: minted-glob-hai-sao-khop-goc-kho-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-08T00:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 825 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-glob-hai-sao-khop-goc-kho-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-08T00:00:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-glob-hai-sao-khop-goc-kho-SUITE-bash_tests_plugins_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-08T00:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-glob-hai-sao-khop-goc-kho-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-08T00:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-glob-hai-sao-khop-goc-kho-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-08T00:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Non-discriminating (green trên cả HEAD lẫn diffBase — chứng minh harness, không phải feature; giữ nguyên vì contract xác nhận đây là regression-guard cố ý, không sửa trong vòng này):
- bash tests/scripts/run-tests.sh: E1, E2, E3, E4, E5, E6, E7, E8, E9, E10

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: PENDING-JUDGMENT (triage_failed) — verified_commit 36faacd7 không phủ HEAD; fixture mk_glob_repo tạo `printf >> docs/x/y.md` thất bại âm thầm (thiếu `mkdir -p docs/x/`) nên PASS ghi cho E10/HS10 chưa từng chạm đúng file — kết quả không đáng tin. Quay lại implementation.
Round 2: sửa mk_glob_repo (mkdir -p thư mục cha + đối chứng diff theo từng file) tại commit 765a647c; toàn bộ E1–E10 và bốn lệnh suite hồi quy đều xanh trên HEAD; verdict PASS.
