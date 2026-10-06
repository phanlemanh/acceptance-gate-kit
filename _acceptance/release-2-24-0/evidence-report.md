---
schema_version: 2
feature_slug: release-2-24-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 07a002744eb6cc4029d982bfbf8d1fd4e746e054
human_signoff:
---

# Evidence Report: release-2-24-0

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
  run_id: minted-release-2-24-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-06T14:54:52Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed
    __EXIT=0

- eval: E2
  run_id: minted-release-2-24-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-06T14:54:52Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed
    __EXIT=0

- eval: E3j
  run_id: minted-release-2-24-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-06T14:54:52Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed
    __EXIT=0

- eval: E6
  run_id: minted-release-2-24-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-06T14:54:52Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed
    __EXIT=0

- eval: E3
  run_id: minted-release-2-24-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-06T14:54:52Z

- eval: E3f
  run_id: minted-release-2-24-0-E3f-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-06T14:54:52Z

- eval: E3g
  run_id: minted-release-2-24-0-E3g-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-06T14:54:52Z

- eval: E3h
  run_id: minted-release-2-24-0-E3h-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-06T14:54:52Z

- eval: E3b
  run_id: minted-release-2-24-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-10-06T14:54:52Z

- eval: E3c
  run_id: minted-release-2-24-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-06T14:54:52Z

- eval: E3i
  run_id: minted-release-2-24-0-E3i-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-06T14:54:52Z

- eval: E3d
  run_id: minted-release-2-24-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-06T14:54:52Z

- eval: E3e
  run_id: minted-release-2-24-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-06T14:54:52Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.
    __EXIT=0

- eval: E4
  run_id: minted-release-2-24-0-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2240_cua_so
  verified_at: 2026-10-06T14:54:52Z
  output: |
    XANH: hai tập bằng nhau
    __EXIT=0

- eval: E5
  run_id: minted-release-2-24-0-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2240_dd_giu
  verified_at: 2026-10-06T14:54:52Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",
    __EXIT=0

## Known limits

## Ngoài hợp đồng

## Analyst

Các eval dưới đây xanh trên CẢ code hiện tại LẪN code cũ ở diffBase, nên chúng chứng minh bộ máy chạy chứ không riêng tính năng này. Chúng là lưới hồi quy có chủ ý hoặc cần viết lại để khẳng định hành vi mới:

- E1, E2, E3j, E6 (cùng lệnh vùng 3 của suite plugins; trên code cũ cũng xanh)
- E3 (mảnh bash của suite scripts)
- E3f, E3g, E3h (ba mảnh mjs của suite scripts)
- E3b (suite hooks)
- E3c (vùng 1 của suite plugins)
- E3i (vùng 2 của suite plugins)
- E3d (suite workflows)
- E3e (bản đồ sản phẩm khớp hồ sơ xưởng)
- E4 (tập hồ sơ được ký trong cửa sổ bằng tập kể trong Context)
- E5 (diagram-design giữ nguyên số phiên bản)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval xanh (15/15), không eval nào hỏng.
