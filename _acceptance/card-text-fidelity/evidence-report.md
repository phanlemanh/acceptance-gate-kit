---
schema_version: 2
feature_slug: card-text-fidelity
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e17023a712fe0e95265191f8e3dfa86a14868c86
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
  run_id: minted-card-text-fidelity-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E2
  run_id: minted-card-text-fidelity-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E3
  run_id: minted-card-text-fidelity-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E4
  run_id: minted-card-text-fidelity-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E5
  run_id: minted-card-text-fidelity-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E6
  run_id: minted-card-text-fidelity-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E7
  run_id: minted-card-text-fidelity-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E8
  run_id: minted-card-text-fidelity-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E9
  run_id: minted-card-text-fidelity-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E10
  run_id: minted-card-text-fidelity-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E11
  run_id: minted-card-text-fidelity-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay
none — every feature eval is red on baseline (discriminates)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: contract + evals dựng cho card-text-fidelity (strip-md giữ đường dẫn có dấu sao trên thẻ Cổng 1/2).
Round 2: 3 chân đo mù (must-fail, clone assert, hậu-điều-kiện) + 1 lỗ hardcode ROOT được nêu ra và một phần được vá — quyết định S4-r2 (decisions.jsonl d-20260806T032557Z-562) liệt kê 4 việc theo LỚP, trong đó (b) must-fail chưa thực sự có răng.
Round 3: 11/11 eval máy xanh (exit 0) VÀ 6 suite regression-guard khác xanh, nhưng review phát hiện 2 hình dạng đường-dẫn-chứa-sao thật trên thẻ vẫn bị cụt (AC-6 đỏ trên dữ liệu sống dù E6/E7/E9 báo xanh), cộng 3 chân đo (E9, E10, E11) đo chỉ-dẫn hoặc chuỗi-có-mặt thay vì quan hệ mà AC hứa. REJECT — quay lại implementation để gắn thước đúng vào vật trước khi verify lại.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
