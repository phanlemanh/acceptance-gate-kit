---
schema_version: 2
feature_slug: card-text-fidelity
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 27ce6620b639632b11842992008f7bfcc9066b17
human_signoff:
---

# Evidence Report: card-text-fidelity

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-2 | test | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-5 | test | PASS |
| E5 | AC-12 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-card-text-fidelity-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E2
  run_id: minted-card-text-fidelity-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E3
  run_id: minted-card-text-fidelity-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E4
  run_id: minted-card-text-fidelity-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E5
  run_id: minted-card-text-fidelity-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E6
  run_id: minted-card-text-fidelity-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E7
  run_id: minted-card-text-fidelity-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E8
  run_id: minted-card-text-fidelity-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E9
  run_id: minted-card-text-fidelity-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E10
  run_id: minted-card-text-fidelity-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E11
  run_id: minted-card-text-fidelity-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T02:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

Regression-guard suites chạy cùng lượt (không gắn eval id, không đại diện cho AC nào): `bash tests/scripts/run-tests.sh` (601 passed, 0 failed), `bash tests/hooks/run-tests.sh` (54 passed, 0 failed), `bash scripts/sync-plugin-packages.sh --check` (plugins/ mirror in sync), `bash tests/workflows/run-tests.sh` (62 passed, 0 failed), `node scripts/product-map.mjs --root . --check` (PRODUCT-MAP.md khớp hồ sơ xưởng) — tất cả đều xanh (exit code 0).

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — baseline không đo lại round này (P2, evals.yaml không đổi từ lần baseline cuối = round 1); xem evidence round 1 cho kết quả A/B của từng eval.

## Variance

none — every multi-run eval is uniform (không có eval nào khai `runs` > 1 round này).

## Iterations

Round 1: review-findings round 1 REJECT — E5 (AC-12) fail-open trên fixture kho-nông, E6 (AC-6) đo hẹp qua nhánh continue tự miễn, E7/E8 (AC-7/AC-8) dùng lại đúng mutant nên không tự đứng vững, E9 (AC-9) không có phép so quan hệ theo hình dạng có tên. Returned to implementation (S4-r1, commit 27ce662).
Round 2 (this): 11/11 eval máy xanh (bash tests/plugins/run-tests.sh, executor test) + 5 suite regression-guard xanh, nhưng review round 2 đo lại bằng đối chứng dương trên vật thật cho thấy cùng lớp lỗi còn sống dưới da mới của S4-r1 — E6 hẹp hơn (checked 3/36 want-instance), E9 vẫn không phân biệt được (`set(b) >= set(a)` tha 5/13 dòng chênh lệch, hàm `classify()` là mã chết), E5 vẫn fail-open khi git clone kho-nông hỏng (returncode không được kiểm). REJECT.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
