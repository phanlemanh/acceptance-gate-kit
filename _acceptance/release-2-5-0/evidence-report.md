---
schema_version: 2
feature_slug: release-2-5-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 06a5973edd76d191903d34b3d6455828dbd9fde0
human_signoff:
---

# Evidence Report: release-2-5-0

Vòng 1. Bốn bộ kiểm hồi quy (plugins · scripts · hooks · workflows) cộng phép kiểm bản đồ
xưởng đều chạy sạch trên cây `06a5973edd76d191903d34b3d6455828dbd9fde0`; tám eval của
mốc phát hành (E1, E2, E3, E3b, E3c, E3d, E3e, E6) đều PASS.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-5-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-30T09:00:00Z
  cmd: bash tests/plugins/run-tests.sh
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-5-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-30T09:00:00Z
  cmd: bash tests/plugins/run-tests.sh
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-5-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-30T09:00:00Z
  cmd: bash tests/scripts/run-tests.sh
  output: |
    PASS: ARM13-mut

    Results: 778 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-5-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-30T09:00:00Z
  cmd: bash tests/hooks/run-tests.sh
  output: |
    V03 veto_state mo THIẾU veto_opened_at -> block (V không vết = bỏ cổng lặng lẽ)
      PASS: V03
    Results: 60 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-5-0-E3c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-30T09:00:00Z
  cmd: bash tests/plugins/run-tests.sh
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-5-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-30T09:00:00Z
  cmd: bash tests/workflows/run-tests.sh
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-5-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: node scripts/product-map.mjs --check
  verified_at: 2026-08-30T09:00:00Z
  cmd: node scripts/product-map.mjs --check
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: minted-release-2-5-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-30T09:00:00Z
  cmd: bash tests/plugins/run-tests.sh
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

### Lệnh suite (hồi quy)

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-release-2-5-0-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  baseline: n-a
  verified_at: 2026-08-30T09:00:00Z

## Known limits

## Ngoài hợp đồng

3 finding ngoài hợp đồng (đề xuất known-limits cho cả ba) — nội dung đầy đủ (title, file,
severity, plain-language, đề xuất) nằm trong `review-findings.md` mục "Ngoài hợp đồng —
người quyết ở Gate 2".

## Analyst

E1, E2, E3, E3b, E3c, E3d, E3e, E6 — pass trên cả HEAD lẫn baseline (diffBase) của lượt
này, tức đều non-discriminating ở lượt hiện tại. Bốn bộ suite (plugins/scripts/hooks/
workflows) và phép kiểm bản đồ xưởng là các bộ kiểm hồi quy toàn kho, không riêng của mốc
phát hành này — mốc phát hành cố ý "KHÔNG dựng răng riêng" (§7.1 CLAUDE.md), nên bộ tám
eval này đóng vai trò regression-guard có chủ ý cho lượt cắt số, không phải răng mới cần
phân biệt HEAD/baseline.

## Variance

none — every multi-run eval is uniform (không eval nào của lượt này mang `runs` > 1).

## Iterations

Round 1: cả tám eval + năm lệnh suite/kiểm bản đồ đều PASS ngay lượt đầu, không có eval nào
gãy; không cần vòng sửa lại.
