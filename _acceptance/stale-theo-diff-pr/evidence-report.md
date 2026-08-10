---
schema_version: 2
feature_slug: stale-theo-diff-pr
verdict: PASS
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 21553f60c68097761c8692a2a9c8bb78f45fd876
human_signoff:
---

# Evidence Report: stale-theo-diff-pr

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-6 | test | PASS |
| E9 | AC-6 | test | PASS |
| E10 | AC-6 | test | PASS |
| E11 | AC-6 | test | PASS |
| E12 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: stale-theo-diff-pr-suite-scripts-20260810T111219Z
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-10T11:13:42Z
  output: |
      PASS: VC08
      PASS: VC08-oka
      PASS: VC08-okb
      PASS: VC08-msg
      PASS: VC08-stale-count
    Results: 671 passed, 0 failed

- eval: E2
  run_id: stale-theo-diff-pr-suite-scripts-20260810T111219Z
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-10T11:13:42Z
  output: |
      PASS: VC07
      PASS: VC07-nostale
      PASS: VC07-fire
      PASS: VC07-fire-slug
      PASS: VC12
      PASS: VC12-nophantom
      PASS: VC12-touched
    Results: 671 passed, 0 failed

- eval: E3
  run_id: stale-theo-diff-pr-suite-scripts-20260810T111219Z
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-10T11:13:42Z
  output: |
      PASS: VC09
      PASS: VC09-msg
      PASS: VC09-okb
    Results: 671 passed, 0 failed

- eval: E4
  run_id: stale-theo-diff-pr-suite-scripts-20260810T111219Z
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-10T11:13:42Z
  output: |
      PASS: VC10
      PASS: VC10-stale-count
      PASS: VC10-note-count
      PASS: VC10b
      PASS: VC10b-stale-count
      PASS: VC10b-note-count
    Results: 671 passed, 0 failed

- eval: E5
  run_id: stale-theo-diff-pr-suite-scripts-20260810T111219Z
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-10T11:13:42Z
  output: |
      PASS: VC11-control
      PASS: VC11-control-nofallback
      PASS: VC11-control-nostale
      PASS: VC11-mut-applied
      PASS: VC11-mutant
      PASS: VC11-mutant-msg
    Results: 671 passed, 0 failed

- eval: E6
  run_id: stale-theo-diff-pr-E6-20260810T111349Z
  exit_code: 0
  verifier: bash _acceptance/stale-theo-diff-pr/checks/version-bump.sh
  verified_at: 2026-08-10T11:13:49Z
  output: |
    manifest @ 1.39.2: 4 (sàn 4)
    nguồn=.claude-plugin:1.39.2 mirror=plugins/acceptance-gate:1.39.2
    VERSION-BUMP OK: 1.39.1 → 1.39.2, 4 manifest, nguồn == mirror

- eval: E7
  run_id: stale-theo-diff-pr-E7-20260810T111355Z
  exit_code: 0
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-10T11:13:55Z
  output: |
    plugins/ mirror in sync.

- eval: E8
  run_id: stale-theo-diff-pr-suite-scripts-20260810T111219Z
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-10T11:13:42Z
  output: |
      PASS: DV5 scripts/pre-merge-check.sh: diff so với base 71e6d37 CHỈ THÊM (0 dòng luật cũ bị xoá/sửa)
      PASS: DV5m mutant: bản sao sửa 1 dòng VIOLATION cũ → phép đo phải ĐỎ đích danh
    Results: 3 passed, 0 failed

- eval: E9
  run_id: stale-theo-diff-pr-E9-20260810T111402Z
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-08-10T11:14:03Z
  output: |
      PASS: T41
      PASS: T42
    Results: 54 passed, 0 failed

- eval: E10
  run_id: stale-theo-diff-pr-E10-20260810T111409Z
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-10T11:18:17Z
  output: |
      PASS: P30 Claude decision commands ship and keep their invariants
      PASS: P30 plugins/ mirror in sync with sources (sync --check)
      PASS: P41 mirror drift bi bat va NEU TEN file lech
      PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    Results: all plugin tests passed

- eval: E11
  run_id: stale-theo-diff-pr-E11-20260810T111837Z
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-08-10T11:18:38Z
  output: |
    Results: 62 passed, 0 failed
    Results: all workflow tests passed

- eval: E12
  run_id: stale-theo-diff-pr-E12-20260810T111838Z
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-08-10T11:18:38Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Analyst

baseline A/B không chạy (n-a) — tính phân biệt của bộ đo được chứng minh trong-lần-chạy bằng cặp VC11-control/VC11-mutant (mutant gỡ guard làm suite đỏ đích danh).

## Variance

none — mọi eval đều deterministic, không eval nào khai runs > 1.

## Iterations

Round 1: 12/12 eval PASS — mọi dòng PASS đích danh mà expected đòi đều có mặt trong stdout (VC07/VC07-fire/VC08/VC09/VC10/VC10b/VC11-control/VC11-mut-applied/VC11-mutant/VC12, DV5, P30/P41/P181), tổng suite scripts 671 passed 0 failed.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
