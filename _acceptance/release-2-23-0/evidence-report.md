---
schema_version: 2
feature_slug: release-2-23-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0ea98b41ee4c31788592980a4b56cc6289a11395
human_signoff:
---

# Evidence Report: release-2-23-0

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
  run_id: minted-release-2-23-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-23-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-23-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-23-0-E3f-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-06T09:35:01Z

- eval: E3g
  run_id: minted-release-2-23-0-E3g-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-06T09:35:01Z

- eval: E3h
  run_id: minted-release-2-23-0-E3h-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: 24 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-23-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-23-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-23-0-E3i-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-23-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-23-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-23-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-06T09:35:01Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: minted-release-2-23-0-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rel2230_cua_so
  verified_at: 2026-10-06T09:35:01Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-23-0-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2230_dd_giu
  verified_at: 2026-10-06T09:35:01Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-23-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-06T09:35:01Z
  output: |
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

## Known limits

## Ngoài hợp đồng

## Analyst

Các eval không phân biệt (xanh trên cả HEAD lẫn bản cơ sở diffBase), chứng minh harness chứ không phải riêng tính năng; coi là regression-guard có chủ ý:

- E1, E2, E3j, E6 (cùng một lượt chạy vùng 3 của suite plugins). Chiều đỏ của các AC này nằm trong chính P200 (5 đột biến cùng đối chứng dương trên bản sao nguyên vẹn), không nằm ở việc lệnh đỏ trên bản cơ sở.
- E3 (mảnh bash), E3f (mjs:1/3), E3g (mjs:2/3), E3h (mjs:3/3) của suite scripts.
- E3b (suite hooks), E3c (vùng 1 plugins), E3i (vùng 2 plugins), E3d (suite workflows), E3e (product-map).
- E5 (diagram-design giữ nguyên số 2.7.1). Chiều đỏ của nó đo khi mở hồ sơ bằng cách chạy cùng lệnh với mốc v2.20.0.

Lưu ý đọc bằng chứng: lệnh vùng 3 lọc đầu ra bằng grep nên các dòng «PASS: P200 …» và «P200 OK …» không nằm trong phần trích; kết luận dựa trên mã thoát 0 của toàn lệnh và dòng tóm tắt kết quả. Duy nhất E4 đỏ trên bản cơ sở, tức là có phân biệt.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: PASS — mọi eval máy xanh (15/15), không có eval judgment, không có biến thiên; chưa có vòng quay lại triển khai.
