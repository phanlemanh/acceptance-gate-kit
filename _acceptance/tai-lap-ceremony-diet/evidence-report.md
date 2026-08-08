---
schema_version: 2
feature_slug: tai-lap-ceremony-diet
verdict: REJECT
failed_evals: []
reason: 
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3996ee8590fe9d80be792ee0c460845e18f526e3
human_signoff: 
---

# Evidence Report: tai-lap-ceremony-diet

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
  run_id: minted-tai-lap-ceremony-diet-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)
      PASS: P191 [TCD] E7 consumer-sim: config rut tu acceptance-init.md -> card -> ky bang sign-batch -> pre-merge clean

    Results: all plugin tests passed

- eval: E2
  run_id: minted-tai-lap-ceremony-diet-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)
      PASS: P191 [TCD] E7 consumer-sim: config rut tu acceptance-init.md -> card -> ky bang sign-batch -> pre-merge clean

    Results: all plugin tests passed

- eval: E3
  run_id: minted-tai-lap-ceremony-diet-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)
      PASS: P191 [TCD] E7 consumer-sim: config rut tu acceptance-init.md -> card -> ky bang sign-batch -> pre-merge clean

    Results: all plugin tests passed

- eval: E4
  run_id: minted-tai-lap-ceremony-diet-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)
      PASS: P191 [TCD] E7 consumer-sim: config rut tu acceptance-init.md -> card -> ky bang sign-batch -> pre-merge clean

    Results: all plugin tests passed

- eval: E5
  run_id: minted-tai-lap-ceremony-diet-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)
      PASS: P191 [TCD] E7 consumer-sim: config rut tu acceptance-init.md -> card -> ky bang sign-batch -> pre-merge clean

    Results: all plugin tests passed

- eval: E6
  run_id: minted-tai-lap-ceremony-diet-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)
      PASS: P191 [TCD] E7 consumer-sim: config rut tu acceptance-init.md -> card -> ky bang sign-batch -> pre-merge clean

    Results: all plugin tests passed

- eval: E7
  run_id: minted-tai-lap-ceremony-diet-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T09:40:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)
      PASS: P191 [TCD] E7 consumer-sim: config rut tu acceptance-init.md -> card -> ky bang sign-batch -> pre-merge clean

    Results: all plugin tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7 — `bash tests/plugins/run-tests.sh` xanh cả trên HEAD lẫn diffBase (baseline: green cho toàn bộ khối P185–P191). Đây KHÔNG phải regression-guard có chủ đích: review-findings.md (mục "Trong hợp đồng") xác nhận hai khoảng trống đo lường thật đứng sau màu xanh này — P185 (E1/AC-1) chỉ assert MỘT chiều của đẳng thức tập hợp đã hứa (bỏ sót chiều "file khai mất mention"), và sign-batch.mjs:61 (đo bởi E3/AC-3) chấp nhận `bypass_ack` chỉ-có-comment dù chính lời hứa AC-3 là từ chối trường hợp này. Suite báo xanh vì các case mutation hiện có chưa chạm đúng hai hình dạng lỗi đó, không phải vì hành vi sản phẩm đã đúng đủ.

## Variance

none — every multi-run eval is uniform (không eval nào có `runs` > 1 trong round này).

## Iterations

Round 1: triage-scope không chạy trọn (`triage_failed`) — 10 finding chờ người, verdict PENDING-JUDGMENT (fail-toward-human), máy không tự sửa gì. Round 2: triage chạy trọn, phân loại được 2 finding trong hợp đồng (P185 thiếu vế đẳng thức tập hợp cho AC-1 tại tests/plugins/run-tests.sh:9261; sign-batch.mjs:61 fails-open trên `bypass_ack` chỉ-có-comment cho AC-3) — verdict REJECT; 9 finding còn lại ngoài hợp đồng, người quyết ở Cổng 2 theo review-findings.md.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract