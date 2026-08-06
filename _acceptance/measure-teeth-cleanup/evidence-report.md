---
schema_version: 2
feature_slug: measure-teeth-cleanup
verdict: REJECT
failed_evals: []
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 508d5029265bbd6f776471db5d41428fdc0513b8
# bypass_ack:
human_signoff:
---

# Evidence Report: measure-teeth-cleanup

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-5 | test | PASS |
| E7 | AC-6 | test | PASS |
| E8 | AC-7 | test | PASS |
| E9 | AC-8 | test | PASS |
| E10 | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-measure-teeth-cleanup-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E2
  run_id: minted-measure-teeth-cleanup-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E3
  run_id: minted-measure-teeth-cleanup-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E4
  run_id: minted-measure-teeth-cleanup-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E5
  run_id: minted-measure-teeth-cleanup-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E6
  run_id: minted-measure-teeth-cleanup-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E7
  run_id: minted-measure-teeth-cleanup-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E8
  run_id: minted-measure-teeth-cleanup-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E9
  run_id: minted-measure-teeth-cleanup-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E10
  run_id: minted-measure-teeth-cleanup-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T00:00:00Z
  output: |
      PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E10 (cmd: `bash tests/plugins/run-tests.sh`) — mọi eval của round này PASS trên CẢ HEAD lẫn diffBase (baseline: green), tức không phân biệt được feature với code cũ chỉ bằng exit code của suite lệnh. Đây đúng là bề mặt mà scope-triage đào sâu và tìm ra: các assert bên trong (P160-P165) tồn tại và chạy, nhưng nhiều assert đo CHỈ DẪN/nhãn tự dán hoặc chỉ có vế dương thay vì đo hành vi/quan hệ thật (xem review-findings.md — findings AC-1, AC-2, AC-5, AC-6, AC-7, AC-8, AC-9). Khuyến nghị: sau khi sửa theo review-findings, chạy lại A/B trên diffBase để xác nhận các eval đã sửa trở thành đỏ-trên-baseline (discriminating) trước khi tính round tiếp theo là PASS.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 6 suite lệnh máy đều PASS (E1-E10, baseline: green trên mọi eval — không phân biệt); scope-triage phát hiện 8 finding trong-hợp-đồng (thước không gắn vào vật được giao / đo chỉ dẫn thay vì đầu ra / fixture viết tay đúng khuôn bên đọc / assertion âm-tính-một-mình) phủ AC-1, AC-2, AC-5, AC-6, AC-7, AC-8, AC-9 — xem review-findings.md; cộng thêm 5 finding ngoài-hợp-đồng (CI step TEETH chưa từng thực thi, rò biến môi trường vào suite lồng, no-op xanh im lặng của ONLY_BLOCK, file nội bộ ship nhầm cho consumer, xác nhận CI bằng grep chuỗi). Verdict: REJECT, quay lại implementation để sửa theo LỚP (không chỉ vá từng case bị nêu tên).

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract