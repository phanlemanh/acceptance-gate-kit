---
schema_version: 2
feature_slug: tai-lap-ceremony-diet
verdict: REJECT
failed_evals: []
reason: 
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 963c4a956bde571fe379a355740dad8740a98bfa
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
  run_id: minted-tai-lap-ceremony-diet-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T11:20:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)

    Results: all plugin tests passed
    EXIT_CODE: 0

- eval: E2
  run_id: minted-tai-lap-ceremony-diet-E2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T11:20:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)

    Results: all plugin tests passed
    EXIT_CODE: 0

- eval: E3
  run_id: minted-tai-lap-ceremony-diet-E3-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T11:20:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)

    Results: all plugin tests passed
    EXIT_CODE: 0

- eval: E4
  run_id: minted-tai-lap-ceremony-diet-E4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T11:20:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)

    Results: all plugin tests passed
    EXIT_CODE: 0

- eval: E5
  run_id: minted-tai-lap-ceremony-diet-E5-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T11:20:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)

    Results: all plugin tests passed
    EXIT_CODE: 0

- eval: E6
  run_id: minted-tai-lap-ceremony-diet-E6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T11:20:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)

    Results: all plugin tests passed
    EXIT_CODE: 0

- eval: E7
  run_id: minted-tai-lap-ceremony-diet-E7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-08T11:20:00+07:00
  output: |
    (chung 1 lệnh suite bao E1-E7: bash tests/plugins/run-tests.sh)

    Results: all plugin tests passed
    EXIT_CODE: 0

## Analyst

E1, E2, E3, E4, E5, E6, E7 — `bash tests/plugins/run-tests.sh` xanh cả trên HEAD lẫn diffBase (baseline: green cho toàn bộ khối round 3). Đây tiếp tục KHÔNG phải regression-guard có chủ đích: review-findings.md (mục "Trong hợp đồng") xác nhận sign-batch.mjs:62 (đo bởi E3/AC-3) VẪN fail-open trên một hình dạng khác của cùng lớp bug đã thấy ở round 2 — round 2 vá xong "bypass_ack chỉ-có-comment", nhưng "bypass_ack để trống chưa điền" (dòng trống sau `bypass_ack:`, `\s*` của regex ăn qua ký tự xuống dòng) vẫn lọt và được ký. Case mới của round 3 (P187/P191) chỉ phủ ack sạch và ack chỉ-comment, chưa phủ hình dạng để-trống nên suite báo xanh dù hành vi sản phẩm với AC-3 chưa đúng đủ. Đây chính là "lớp đo-chuỗi" và "fail-open ký-mù lặp" khiến điều kiện dừng người-khai-trước kích hoạt round này (xem Iterations).

## Variance

none — every multi-run eval is uniform (không eval nào có `runs` > 1 trong round này).

## Iterations

Round 1: triage-scope không chạy trọn (`triage_failed`) — 10 finding chờ người, verdict PENDING-JUDGMENT (fail-toward-human), máy không tự sửa gì. Round 2: triage chạy trọn, phân loại được 2 finding trong hợp đồng (P185 thiếu vế đẳng thức tập hợp cho AC-1 tại tests/plugins/run-tests.sh:9261; sign-batch.mjs:61 fails-open trên `bypass_ack` chỉ-có-comment cho AC-3) — verdict REJECT; 9 finding còn lại ngoài hợp đồng, người quyết ở Cổng 2 theo review-findings.md. Round 3: vá xong 2 finding round 2 (case P185 quét lớp 9 file + đẳng thức hai chiều; sign-batch chặn ack chỉ-comment), suite E1-E7 xanh cả HEAD lẫn baseline — nhưng review round 3 phát hiện MỘT HÌNH DẠNG MỚI của đúng lớp fail-open ký-mù ở AC-3 (bypass_ack để trống chưa điền, không phải chỉ-comment, vẫn được sign-batch ký) chưa có case nào phủ, cộng thêm 1 finding mới lớp đo-chuỗi (P186, AC-2 KPI đếm sự-kiện-cần-người chưa chứng minh tính chọn lọc). Điều kiện dừng người-khai-trước kích hoạt: cùng lớp lỗi đổi da lần thứ 2 liên tiếp trong khi máy tự báo xanh, ngân sách tự-vá cho lớp này (2/2 round) đã cạn — verdict REJECT, dừng tự vá, giao lại người xem review-findings.md "Trong hợp đồng" (AC-3) trước khi cho vá tiếp.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract