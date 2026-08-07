---
schema_version: 2
feature_slug: measure-birth-certificate
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fd2cb45911c851db8a4dec54c177de2949710c8d
human_signoff:
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
  run_id: minted-measure-birth-certificate-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

- eval: E2
  run_id: minted-measure-birth-certificate-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

- eval: E3
  run_id: minted-measure-birth-certificate-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

- eval: E4
  run_id: minted-measure-birth-certificate-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

- eval: E5
  run_id: minted-measure-birth-certificate-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

- eval: E6
  run_id: minted-measure-birth-certificate-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

- eval: E7
  run_id: minted-measure-birth-certificate-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

- eval: E8
  run_id: minted-measure-birth-certificate-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

- eval: E9
  run_id: minted-measure-birth-certificate-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T09:40:00Z
  output: |
    PASS: P181 [MBC] E9 kenh giao: menh de ton tai -> version goi >= moc (ca twin + mirror)
    P182 [MBC] E8 tu-ap: khoi khai dich danh <-> tap tim duoc + moi case du hai chieu
    Results: all plugin tests passed

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E9 chạy máy đều PASS (exit 0, cả 6 lệnh suite phụ trợ scripts/hooks/sync-plugin-packages/workflows/product-map cũng xanh), nhưng review-findings ánh xạ vào AC-2, AC-5, AC-6, AC-8 (P175/P177/P178/P179) chỉ ra phép đo/assertion trong chính suite mới không đúng khuôn contract hứa (fixture viết tay thay vì máy sinh, so chuỗi neo thay vì so khối, exit-code-alone thiếu ghim thông điệp, mutant không thật sự kiểm quan hệ ≥) → verdict REJECT, trả lại S3 để vá đúng lớp trước khi verify lại.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
