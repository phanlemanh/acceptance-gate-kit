---
schema_version: 2
feature_slug: release-2-5-0
verdict: PASS
failed_evals: []
reason: 
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 30865e2f059d2e9184ba27e7f165132321f75614
human_signoff: 
---

# Evidence Report: release-2-5-0

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
  run_id: minted-release-2-5-0-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-30T03:30:53Z
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-5-0-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-30T03:30:53Z
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-5-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-30T03:30:53Z

- eval: E3b
  run_id: minted-release-2-5-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-08-30T03:30:53Z

- eval: E3c
  run_id: minted-release-2-5-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-30T03:30:53Z

- eval: E3d
  run_id: minted-release-2-5-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-30T03:30:53Z

- eval: E3e
  run_id: minted-release-2-5-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: scripts/product-map.mjs
  verified_at: 2026-08-30T03:30:53Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: minted-release-2-5-0-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-30T03:30:53Z
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

### Lệnh suite (hồi quy)

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-release-2-5-0-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-08-30T03:30:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

E1, E2, E3, E3b, E3c, E3d, E3e, E6 — mọi eval máy xanh trên cả hai phía (branch và diffBase) ở round baseline gần nhất; round này không đo lại nên không quy kết non-discriminating mới.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: PASS ghi trên verified_commit 06a5973e; ngay sau đó .claude-plugin/plugin.json đổi (câu kiểm-bằng-nội-dung AC-6/E6 lệch cây được giao) — mở lại để chấm.
Round 2: Toàn bộ eval xanh lại trên verified_commit 30865e2f059d2e9184ba27e7f165132321f75614 (đã gồm bản sửa neo AC-6); PASS.