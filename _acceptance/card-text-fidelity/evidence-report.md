---
schema_version: 2
feature_slug: card-text-fidelity
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cba0e3850e06519a75cccefafbafbd6582ae6c55
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
  run_id: minted-card-text-fidelity-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E2
  run_id: minted-card-text-fidelity-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E3
  run_id: minted-card-text-fidelity-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E4
  run_id: minted-card-text-fidelity-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E5
  run_id: minted-card-text-fidelity-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E6
  run_id: minted-card-text-fidelity-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E7
  run_id: minted-card-text-fidelity-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E8
  run_id: minted-card-text-fidelity-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E9
  run_id: minted-card-text-fidelity-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E10
  run_id: minted-card-text-fidelity-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E11
  run_id: minted-card-text-fidelity-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T09:00:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11 — xanh trên CẢ HEAD lẫn diffBase (bash tests/plugins/run-tests.sh, baseline: green cho toàn bộ khối P161) — không phân biệt được feature này với code cũ. Điều này khớp với thứ review (scope-triage) phát hiện: khối P161 dùng chung một lệnh cho cả 11 eval, và phần lớn phép đo (đặc biệt E6, E7, E9, E11) yếu hơn hẳn quan hệ mà AC hứa (đếm/tồn-tại thay vì toàn phần/truy-nguồn; E9/E11 không có cài đặt), nên suite xanh không chứng minh được các AC tương ứng. Cần viết lại phép đo theo đúng quan hệ đã khai trước khi coi các eval này là bằng chứng phân biệt.

## Variance

none — không có eval nào runs > 1 trong vòng này.

## Iterations

Round 1: E1-E11 đều PASS trên máy (bash tests/plugins/run-tests.sh, exit 0) nhưng đối chứng KHÔNG phân biệt được feature — cùng bộ eval cũng PASS trên baseline pre-feature. Review phát hiện đối chứng dương của P161 fail-open lặng lẽ trên bản sao nông (E4/E5/E7/E8 biến mất mà vẫn xanh), E6/E7 đo bằng đếm/tồn-tại thay vì quan hệ toàn phần/truy-nguồn mà AC-6/AC-7 hứa, và E9/E11 hoàn toàn không có phép đo dù nhãn khối tự khai phủ E1-E11. Verdict: REJECT — quay lại sửa phép đo (không chỉ hành vi gate-card.js) trước khi tính PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
