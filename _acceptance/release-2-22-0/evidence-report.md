---
schema_version: 2
feature_slug: release-2-22-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b79010872f839b2c01fe27b7454703199f6c1d47
human_signoff: Manh Phan 2026-10-04 — ký mốc phát hành 2.22.0 (làn V, mười lăm phép đo xanh); Ngoài-1, Ngoài-2, Ngoài-3 ghi Known limits; đồng ý phần cắt/hoãn
---

# Evidence Report: release-2-22-0

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
  run_id: minted-release-2-22-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-03T23:52:57Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-22-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-03T23:52:57Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-22-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-03T23:52:57Z

- eval: E3f
  run_id: minted-release-2-22-0-E3f-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-03T23:52:57Z

- eval: E3g
  run_id: minted-release-2-22-0-E3g-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-03T23:52:57Z

- eval: E3h
  run_id: minted-release-2-22-0-E3h-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-03T23:52:57Z

- eval: E3b
  run_id: minted-release-2-22-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-10-03T23:52:57Z

- eval: E3c
  run_id: minted-release-2-22-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-03T23:52:57Z

- eval: E3i
  run_id: minted-release-2-22-0-E3i-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-03T23:52:57Z

- eval: E3j
  run_id: minted-release-2-22-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-03T23:52:57Z

- eval: E3d
  run_id: minted-release-2-22-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-03T23:52:57Z

- eval: E3e
  run_id: minted-release-2-22-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-03T23:52:57Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: minted-release-2-22-0-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2220_cua_so
  verified_at: 2026-10-03T23:52:57Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-22-0-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2220_dd_giu
  verified_at: 2026-10-03T23:52:57Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-22-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-03T23:52:57Z
  output: |
    Results: all plugin tests passed

## Known limits

## Ngoài hợp đồng

## Analyst

Các eval dưới đây xanh trên CẢ bản HEAD lẫn bản cũ (baseline green), nên không tự chứng minh mình phân biệt được tính năng với bản cũ: E1, E2, E6, E3j (cùng một lượt chạy vùng 3 của suite plugins), E3, E3f, E3g, E3h, E3b, E3c, E3i, E3d, E3e, E4, E5. Phần lớn là regression-guard có chủ ý của một mốc phát hành làn V (không đổi mã cổng). Với E1, E2, E6 chiều đỏ không nằm ở baseline mà nằm trong chính P200 (năm đột biến cùng đối chứng dương trên bản sao nguyên vẹn, theo lời khai ở expected); với E4 và E5 chiều đỏ được khai trong expected là đo khi mở hồ sơ (tập «x» cho E4, mốc 1b98fdb1 cho E5), không phải số đo của lượt chạy này.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval của hợp đồng xanh trên commit b79010872f839b2c01fe27b7454703199f6c1d47; không có eval hỏng, không có mục chờ người chốt.
