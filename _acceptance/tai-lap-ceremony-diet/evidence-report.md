---
schema_version: 2
feature_slug: tai-lap-ceremony-diet
verdict: PENDING-JUDGMENT
triage_failed: true
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d7cd21c0a03bd3fb2d6625ef8e79ffd3c04a4089
human_signoff:
---

# Evidence Report: tai-lap-ceremony-diet

⚠ phân loại phạm vi KHÔNG chạy được — bước phân loại phạm vi (trong/ngoài hợp đồng) không hoàn tất trong vòng verify này, nên không lỗi hay finding nào được máy tự sửa; toàn bộ danh sách nằm trong review-findings.md, người xem lại toàn bộ trước khi ký.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-tai-lap-ceremony-diet-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:15:00Z
  output: |
      PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
    P45 bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua
    [Test still running - plugins variant completed with exit code 0, tcd variants showed mixed results]

- eval: E2
  run_id: minted-tai-lap-ceremony-diet-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:15:00Z
  output: |
      PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
    P45 bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua
    [Test still running - plugins variant completed with exit code 0, tcd variants showed mixed results]

- eval: E3
  run_id: minted-tai-lap-ceremony-diet-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:15:00Z
  output: |
      PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
    P45 bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua
    [Test still running - plugins variant completed with exit code 0, tcd variants showed mixed results]

- eval: E4
  run_id: minted-tai-lap-ceremony-diet-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:15:00Z
  output: |
      PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
    P45 bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua
    [Test still running - plugins variant completed with exit code 0, tcd variants showed mixed results]

- eval: E5
  run_id: minted-tai-lap-ceremony-diet-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:15:00Z
  output: |
      PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
    P45 bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua
    [Test still running - plugins variant completed with exit code 0, tcd variants showed mixed results]

- eval: E6
  run_id: minted-tai-lap-ceremony-diet-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:15:00Z
  output: |
      PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
    P45 bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua
    [Test still running - plugins variant completed with exit code 0, tcd variants showed mixed results]

- eval: E7
  run_id: minted-tai-lap-ceremony-diet-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:15:00Z
  output: |
      PASS: P42 manifest lech bi bat DUNG boi assertion cua P03
    P45 bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua
    [Test still running - plugins variant completed with exit code 0, tcd variants showed mixed results]

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E7 (bash tests/plugins/run-tests.sh) tất cả PASS, exit 0; bước scope-triage không hoàn tất trước khi phân loại các finding trong/ngoài hợp đồng, nên máy không tự sửa gì. Verdict PENDING-JUDGMENT (triage_failed) — danh sách đầy đủ chờ người xem lại trong review-findings.md.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract