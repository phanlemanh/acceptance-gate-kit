---
schema_version: 2
feature_slug: release-2-25-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5f5ebe5f9f028e4076c5ce73eee0c335d0b3cbf9
human_signoff:
---

# Evidence Report: release-2-25-0

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
  run_id: minted-release-2-25-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.rel2250_vung_3_p200
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-25-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.rel2250_vung_3_p200
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-25-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-25-0-E3f-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-25-0-E3g-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-25-0-E3h-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: 25 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-25-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-25-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-25-0-E3i-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-25-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-25-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-25-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-08T17:37:01Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: minted-release-2-25-0-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2250_cua_so
  verified_at: 2026-10-08T17:37:01Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-25-0-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2250_dd_giu
  verified_at: 2026-10-08T17:37:01Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-25-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.rel2250_vung_3_p200
  verified_at: 2026-10-08T17:37:01Z
  output: |
    Results: all plugin tests passed

## Known limits

## Ngoài hợp đồng

## Analyst

Mười lăm eval đều xanh trên cả cây mốc trước lẫn cây hiện tại (baseline green), vì cả hai cây đều chạy được lệnh đo; riêng E1, E2, E6 (P200), E4 và E5 mang chiều đỏ NẰM TRONG chính lệnh (đột biến + đối chứng dương trong P200; slug thừa/thiếu và mốc cũ trong rel-cua-so và dd-giu, đo lúc mở hồ sơ). Phân loại:

- E1, E2, E6 — không phân biệt ở mức lệnh ngoài; chiều đỏ sống trong P200 (5 đột biến trên bản sao). Giữ như khoá hồi quy có chủ ý cho mốc phát hành.
- E4, E5 — không phân biệt ở mức lệnh ngoài; chiều đỏ sống trong chính lệnh (đo khi mở hồ sơ). Giữ như khoá hồi quy có chủ ý.
- E3, E3f, E3g, E3h, E3b, E3c, E3i, E3j, E3d, E3e — lệnh suite hồi quy xanh cả hai phía, kỳ vọng của một mốc phát hành đóng số (làn V, không dựng răng mới); không cần viết lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mười lăm eval đều xanh (E1 E2 E3 E3f E3g E3h E3b E3c E3i E3j E3d E3e E4 E5 E6) — không vòng sửa.
