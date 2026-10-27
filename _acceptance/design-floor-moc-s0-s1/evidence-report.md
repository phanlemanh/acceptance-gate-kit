---
schema_version: 2
feature_slug: design-floor-moc-s0-s1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: be24550bdf1b1f471b7d947d89ff0dc163c97370
human_signoff: Manh Phan 2026-10-28
---

# Evidence Report: design-floor-moc-s0-s1

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-design-floor-moc-s0-s1-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_bac
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-design-floor-moc-s0-s1-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_bac_hong
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-design-floor-moc-s0-s1-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_tri_thuc
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-design-floor-moc-s0-s1-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_tri_thuc_lech
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-design-floor-moc-s0-s1-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_reuse_plan
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-design-floor-moc-s0-s1-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_flow_lint
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-design-floor-moc-s0-s1-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_the
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-design-floor-moc-s0-s1-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_chi_ghi
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-design-floor-moc-s0-s1-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_noi_day
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-design-floor-moc-s0-s1-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df4_tri_thuc_that
  verified_at: 2026-10-27T16:42:35Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-design-floor-moc-s0-s1-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-design-floor-moc-s0-s1-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-design-floor-moc-s0-s1-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-27T18:06:18Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do: E1–E10 là carry-forward từ round 2 (delta không chạm paths của eval), round 3 không chạy lại nên trạng thái baseline của chúng ghi n-a. Các lệnh suite round 3 là regression-guard, không liệt kê.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: một lỗi trong hợp đồng (lệnh bậc dùng bộ đọc cấu hình riêng, dòng chú thích sát lề làm kho rơi về M0). Returned to implementation.
Round 2: sửa bằng bộ đọc chung của kit, thêm ca BAC-CHU-THICH; E1–E10 đạt; 14 hàng sổ known-limits ghi sổ.
Round 3: E1–E10 mang sang từ round 2 (delta không chạm paths của eval), 11 lệnh suite chạy lại đều xanh; 8 mục ngoài hợp đồng mới ghi ở review-findings.md để người quyết ở Cổng 2. Mốc giờ của các lệnh suite round 3 ghi ở mức ngày; mốc giờ chính xác nằm ở dòng round 3 của run-log.jsonl.
