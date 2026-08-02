---
schema_version: 2
feature_slug: hinh-theo-mat-phang
verdict: PASS
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 522268a30e54dfda156c9160b110fb576aafcd7b
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

## Evidence

- eval: E1
  run_id: minted-hinh-theo-mat-phang-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T10:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-hinh-theo-mat-phang-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T10:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-hinh-theo-mat-phang-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T10:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-hinh-theo-mat-phang-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T10:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-hinh-theo-mat-phang-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T10:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-hinh-theo-mat-phang-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T10:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-hinh-theo-mat-phang-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T10:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-hinh-theo-mat-phang-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T10:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-hinh-theo-mat-phang-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-02T10:00:00Z
  output: |
    plugins/ mirror in sync.

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8 (bash tests/plugins/run-tests.sh) và E9 (bash scripts/sync-plugin-packages.sh --check) — cả chín eval đều pass trên CẢ HEAD lẫn baseline (diffBase), tức chưa phân biệt được feature với code cũ ở phép đo A/B này. Vì đây là các test/script mới viết riêng cho feature (P97/P92/P89/P90/P93/P95 nới rộng, mirror sync check), khả năng cao là diffBase test-run không tách được state trước-khi-sửa của chính các file test/script đó (test và code-được-test đổi cùng một commit), không phải feature thiếu hiệu lực — nhưng đây là quan sát cần người xác nhận lại cách A/B baseline được tính cho các case sửa-test-cùng-code, không tự kết luận ở đây.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: toàn bộ 9 eval PASS ngay từ lần chạy verify đầu tiên — không có round nào phải quay lại implementation.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
