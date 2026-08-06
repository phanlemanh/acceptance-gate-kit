---
schema_version: 2
feature_slug: codex-script-packaging
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d6bd16b22709a94365d4077f8b576c3f039bdde0
human_signoff:
---

# Evidence Report: codex-script-packaging

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |

Ghi chú verdict: cả 6 eval máy đều thoát mã 0 (không eval nào thất bại — `failed_evals: []`). Verdict tổng ở đây là REJECT không phải vì lệnh máy đỏ, mà vì review-findings.md (section "Trong hợp đồng") xác nhận nhiều chân đo P162 là assertion-only, thiếu chính đối chứng dương/ca âm mà AC-2, AC-5, AC-6 tự khai trong contract.md — nghĩa là các eval hôm nay không thể phân biệt "bắt đúng lỗi" với "chưa bao giờ chạy" trên đúng những chân mà chúng tuyên đóng. Điều này khớp với baseline non-discriminating của cả 6 eval (xem `## Analyst` bên dưới).

## Analyst

- E1, E2, E3, E4, E5, E6 (`bash tests/plugins/run-tests.sh`) — non-discriminating: PASS trên CẢ HEAD lẫn diffBase baseline (`baseline: green` đồng loạt cho toàn bộ lệnh). Đây không phải regression-guard cố ý: review-findings.md cho thấy nguyên nhân là phần lớn khối P162 hiện tại thiếu đối chứng dương/ca âm mà chính AC-2 (phạm vi quét hẹp), AC-5 (chân bắt mất file), và AC-6 (chốt chống-trôi) tự khai — nên phép đo hôm nay không phân biệt được code có feature hay không, tức đúng dạng "assertion âm-tính-một-mình" mà CLAUDE.md gọi là "assertion không sống". Cần viết lại các chân này theo đúng mutant/ca âm đã khai trước khi tin lại màu xanh.

## Evidence

- eval: E1
  run_id: minted-codex-script-packaging-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T06:05:00Z
  output: |
      PASS: P162 chi-dan ⇔ goi: quan he tap hop + mutant hai chieu

    Results: all plugin tests passed

- eval: E2
  run_id: minted-codex-script-packaging-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T06:05:00Z
  output: |
      PASS: P162 chi-dan ⇔ goi: quan he tap hop + mutant hai chieu

    Results: all plugin tests passed

- eval: E3
  run_id: minted-codex-script-packaging-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T06:05:00Z
  output: |
      PASS: P162 chi-dan ⇔ goi: quan he tap hop + mutant hai chieu

    Results: all plugin tests passed

- eval: E4
  run_id: minted-codex-script-packaging-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T06:05:00Z
  output: |
      PASS: P162 chi-dan ⇔ goi: quan he tap hop + mutant hai chieu

    Results: all plugin tests passed

- eval: E5
  run_id: minted-codex-script-packaging-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T06:05:00Z
  output: |
      PASS: P162 chi-dan ⇔ goi: quan he tap hop + mutant hai chieu

    Results: all plugin tests passed

- eval: E6
  run_id: minted-codex-script-packaging-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T06:05:00Z
  output: |
      PASS: P162 chi-dan ⇔ goi: quan he tap hop + mutant hai chieu

    Results: all plugin tests passed

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: cả 6 eval máy (E1-E6, `bash tests/plugins/run-tests.sh`) PASS mã thoát 0, đồng thời cả 6 lệnh regression-guard khác (`tests/scripts`, `tests/hooks`, `tests/workflows`, `sync-plugin-packages.sh --check`, `product-map.mjs --check`) cũng xanh — nhưng review scope-triage phát hiện AC-2 (phạm vi quét chỉ SKILL.md nguồn, bỏ sót 4/12 tệp chỉ dẫn shipped + các dạng chỉ dẫn khác), AC-5 (thiếu đối chứng dương "bỏ dòng chép → ĐỎ nêu file mất"), và AC-6 (không có ca âm "đổi tên tệp chốt → lưới ĐỎ", resolver dò theo tên khoá lá) đều thiếu đúng đối chứng mà contract.md tự khai — xem review-findings.md. Verdict tổng REJECT, quay lại implementation để bổ sung mutant/ca âm thật cho từng chân đo trước khi verify lại.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
