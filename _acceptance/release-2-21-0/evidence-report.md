---
schema_version: 2
feature_slug: release-2-21-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 54c189d40c873903238540a9b91d16a0c0d816ff
human_signoff:
---

# Evidence Report: release-2-21-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | PASS |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-21-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-03T11:51:48Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-21-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-03T11:51:48Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-21-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-03T11:51:48Z

- eval: E3f
  run_id: minted-release-2-21-0-E3f-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-03T11:51:48Z

- eval: E3g
  run_id: minted-release-2-21-0-E3g-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-03T11:51:48Z

- eval: E3h
  run_id: minted-release-2-21-0-E3h-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-03T11:51:48Z

- eval: E3b
  run_id: minted-release-2-21-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-10-03T11:51:48Z

- eval: E3c
  run_id: minted-release-2-21-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-03T11:51:48Z

- eval: E3i
  run_id: minted-release-2-21-0-E3i-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-03T11:51:48Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-21-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-03T11:51:48Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-21-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-03T11:51:48Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-21-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-03T11:51:48Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: minted-release-2-21-0-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2210_cua_so
  verified_at: 2026-10-03T11:51:48Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-21-0-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2210_dd_nang
  verified_at: 2026-10-03T11:51:48Z
  output: |
    moc:   "version": "2.7.0", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-21-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-03T11:51:48Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

## Known limits

## Ngoài hợp đồng

## Analyst

E1, E2, E3, E3b, E3c, E3d, E3e, E3f, E3g, E3h, E3i, E3j, E4, E5, E6 — cùng xanh trên HEAD lẫn baseline. Đây là hồ sơ phát hành: hợp đồng chủ ý khoá theo mảnh suite và quan hệ kho, không dựng răng mới, nên các eval này là regression-guard có chủ ý (chiều đỏ của số phiên bản, câu khớp phiên bản và mô tả nằm trong P200; chiều đỏ của AC-4 và AC-5 nằm trong chính lệnh theo hợp đồng), không chứng minh một hành vi mới ở tầng eval. Riêng E1, E2, E6 dùng chung lệnh vùng 3 có bộ lọc đầu ra giữ lại các dòng FAIL và Results, nên phần output ở trên chỉ chứa các dòng Results đó; chi tiết xem review-findings.md.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval PASS (15/15), không có judgment item, không có eval ngẫu nhiên. Chuyển Cổng Bằng chứng.
