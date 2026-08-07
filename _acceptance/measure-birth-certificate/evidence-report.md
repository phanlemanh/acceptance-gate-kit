---
schema_version: 2
feature_slug: measure-birth-certificate
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 74dd33f31853e0fe1a39cf6069e2adbabd01f5d7
human_signoff: "Manh Phan 2026-08-07"
---

# Evidence Report: measure-birth-certificate

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

## Evidence

- eval: E1
  run_id: minted-measure-birth-certificate-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-measure-birth-certificate-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-measure-birth-certificate-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

- eval: E4
  run_id: minted-measure-birth-certificate-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

- eval: E5
  run_id: minted-measure-birth-certificate-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

- eval: E6
  run_id: minted-measure-birth-certificate-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

- eval: E7
  run_id: minted-measure-birth-certificate-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

- eval: E8
  run_id: minted-measure-birth-certificate-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

- eval: E9
  run_id: minted-measure-birth-certificate-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T19:00:00Z
  output: |
    Results: all plugin tests passed

## Analyst

carried từ round 1 — baseline không đo lại round này
none — không eval nào được đo lại baseline round này (danh sách carried rỗng)

## Variance

none — every multi-run eval is uniform (không eval nào có runs > 1 round này)

## Iterations

Round 1: E1–E9 chạy máy đều PASS (exit 0), nhưng review-findings ánh xạ AC-2/AC-5/AC-6/AC-8 (P175/P177/P178/P179) chỉ ra phép đo trên chính suite mới không đúng khuôn contract hứa (fixture viết tay, so chuỗi neo thay vì so khối, exit-code-alone thiếu ghim thông điệp, mutant không thật sự kiểm quan hệ ≥) → verdict REJECT, trả về S3.
Round 2–3 (S4-r1 → S4-r2 → S4-r2b, gộp vì không có verify log riêng cho từng vòng): S4-r1 vá 4 finding của round 1 (record hành-vi do make-record sinh, P177 ghim thông điệp, P175 bóc khối giữa mốc, P179 mutant xuống dưới số đếm); STOP-PATCHING kích hoạt khi cùng lớp đo-chuỗi-thay-quan-hệ tái xuất ở mutant P178#3 (hằng-đúng) — người dùng chọn thu phạm vi (xoá mutant #3, known-limits P182-proxy + dead SRC); S4-r2b sau đó viết lại mutant P178 thành phép đo SỐNG (diff_check chạy trên bản sao evidence bị phá) để giữ đúng lời hứa E5 mà không cần P178#3. Trả về S3 trước mỗi lần verify lại.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin lần 1 — 2026-08-07, do measure-birth-certificate signed-off (khuôn khai sinh phép đo, feature-loop 1.27.0 + acceptance-gate 1.39.0) + lành 29 pin-phantom (sha re-pin #13 gõ tay sai — luật pin-phantom 18bbe72 bắt được)
run_id: repin-20260807-mbc-ship-lane1
sha: 74dd33f31853e0fe1a39cf6069e2adbabd01f5d7 · suites: 6 lệnh exit 0
