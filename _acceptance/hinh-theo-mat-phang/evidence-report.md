---
schema_version: 2
feature_slug: hinh-theo-mat-phang
verdict: PASS
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 00e3c19994febc69d2ece39197ec78b048495e86
# bypass_ack:
human_signoff:          # Gate 2 — human writes "<name> <ISO date>" AFTER review
---

# Evidence Report: hinh-theo-mat-phang

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
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-hinh-theo-mat-phang-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-hinh-theo-mat-phang-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-hinh-theo-mat-phang-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-hinh-theo-mat-phang-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-hinh-theo-mat-phang-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-hinh-theo-mat-phang-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-hinh-theo-mat-phang-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-hinh-theo-mat-phang-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-hinh-theo-mat-phang-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-02T14:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E10
  run_id: minted-hinh-theo-mat-phang-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-hinh-theo-mat-phang-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T14:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E10, E11 (bash tests/plugins/run-tests.sh) và E9 (bash scripts/sync-plugin-packages.sh --check) — toàn bộ 11 eval đều pass trên CẢ HEAD lẫn baseline (diffBase) ở vòng chấm này, tức A/B không phân biệt được feature với code cũ tại phép đo này (bao gồm cả E10/E11 mới thêm cho AC-10/AC-11). Giữ nguyên quan sát từ round 1: nhiều khả năng diffBase test-run không tách được state trước-khi-sửa của chính các file test/script bị sửa cùng commit với code (test và code-được-test đổi cùng lượt), không hẳn là feature thiếu hiệu lực — nhưng đây vẫn là quan sát cần người xác nhận cách A/B baseline được tính cho các case sửa-test-cùng-code; không tự kết luận ở đây.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: toàn bộ 9 eval PASS ngay từ lần chạy verify đầu tiên — không có round nào phải quay lại implementation.
Round 2: hợp đồng được nâng phạm vi thêm AC-10 và AC-11 (E10, E11) sau khi review-findings vòng 1 chỉ ra rằng bằng chứng + thẻ Cổng 2 còn đứng yên ở 9 tiêu chí trong khi contract đã có 11; chấm lại toàn bộ 11 eval trên commit 00e3c19 — tất cả PASS ngay lần chạy verify này, không có eval nào phải quay lại implementation.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
