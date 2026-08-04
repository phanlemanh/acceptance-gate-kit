---
schema_version: 2
feature_slug: context-ladder
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9f4806a451c8f37134397fda9d264a519e9a042a
human_signoff:
---

# Evidence Report: context-ladder

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
| E11 | AC-10 | script | PASS |
| E12 | AC-10 | test | PASS |
| E13 | AC-10 | test | PASS |
| E14 | AC-10 | test | PASS |
| E15 | AC-10 | test | PASS |
| E16 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-context-ladder-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-context-ladder-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-context-ladder-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-context-ladder-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-context-ladder-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-context-ladder-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-context-ladder-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-context-ladder-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-context-ladder-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E10
  run_id: minted-context-ladder-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-context-ladder-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E13
  run_id: minted-context-ladder-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-context-ladder-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-04T09:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E14
  run_id: minted-context-ladder-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: GCV1d contract lanh khong sinh canh bao nao

    Results: 596 passed, 0 failed

- eval: E15
  run_id: minted-context-ladder-E15-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-04T09:00:00Z
  output: |
    PASS: T42

    Results: 51 passed, 0 failed

- eval: E16
  run_id: minted-context-ladder-E16-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

## Analyst

- bash tests/plugins/run-tests.sh: E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E12, E13
- bash scripts/sync-plugin-packages.sh --check: E11
- bash tests/scripts/run-tests.sh: E14
- bash tests/hooks/run-tests.sh: E15
- bash tests/workflows/run-tests.sh: E16

Toàn bộ 16 eval của round này xanh trên CẢ HEAD lẫn baseline (diffBase) — không eval nào phân biệt được tính năng context-ladder với code trước feature. Suite chứng minh harness còn chạy được, không chứng minh tính năng đúng; xem review-findings.md để biết các lỗ AC-4/AC-6 mà chính các case P138/P136 (nằm trong nhóm E1-E13 ở trên) không bắt được vì fixture đã thay placeholder trước khi render.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: Cả 16 eval máy đều PASS (exit 0) nhưng toàn bộ đều non-discriminating (xanh trên cả baseline — xem Analyst), tức suite hiện tại không chứng minh được tính năng. Review scope-triage (review-findings.md) tái hiện được 2 lớp lỗi thật map vào AC-4 và AC-6: (1) gate-card.js dòng 214 tách chuỗi context_scenes bằng dấu phẩy TRƯỚC khi lọc placeholder, nên placeholder nguyên văn từ khuôn writer (chứa dấu phẩy) sống sót và bị đếm là 1 cảnh thật → cờ vàng AC-6 bị nuốt; (2) gate-card.js dòng 218 dùng regex hand-rolled thứ 5 để đọc block design_pass thay vì resolveConfigKey của lib, nên dòng trống trong block khiến host_embed bị báo "chưa khai" dù có mặt → cờ vàng sai sự thật ở AC-4. Cả hai lỗi né được P135/P136/P138 vì mọi fixture test đã thay placeholder/định dạng sạch trước khi render, đúng lớp "assertion âm-tính-một-mình" mà CLAUDE.md ghim. Verdict REJECT; failed_evals giữ rỗng vì không lệnh máy nào literally fail — REJECT dựa trên bằng chứng tái hiện được trong phạm vi hợp đồng (AC-4, AC-6), không phải trên exit code. Trả về S3 để: (a) sửa gate-card.js theo 2 finding trên (đồng bộ cả plugins/ mirror), và (b) bổ sung case cho P135/P136 render placeholder writer-template nguyên trạng (chưa qua sanitize) để suite thật sự bắt được lớp lỗi này lần sau.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
