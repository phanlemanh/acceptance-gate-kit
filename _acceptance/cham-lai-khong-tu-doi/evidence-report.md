---
schema_version: 2
feature_slug: cham-lai-khong-tu-doi
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: df2a693ce8a610387af83b3847627a4c57902f5e
human_signoff: Manh Phan 2026-10-17
---

# Evidence Report: cham-lai-khong-tu-doi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS (carry-forward từ round 1) |
| E8 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cham-lai-khong-tu-doi-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T18:12:40Z
  output: |
    Results: 8 passed, 0 failed

- eval: E2
  run_id: minted-cham-lai-khong-tu-doi-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T18:12:40Z
  output: |
    Results: 8 passed, 0 failed

- eval: E3
  run_id: minted-cham-lai-khong-tu-doi-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T18:12:40Z
  output: |
    Results: 8 passed, 0 failed

- eval: E4
  run_id: minted-cham-lai-khong-tu-doi-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T18:12:40Z
  output: |
    Results: 8 passed, 0 failed

- eval: E5
  run_id: minted-cham-lai-khong-tu-doi-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T18:12:40Z
  output: |
    Results: 8 passed, 0 failed

- eval: E6
  run_id: minted-cham-lai-khong-tu-doi-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T18:12:40Z
  output: |
    Results: 8 passed, 0 failed

- eval: E7
  run_id: minted-cham-lai-khong-tu-doi-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T18:12:40Z
  output: |
    Results: 8 passed, 0 failed

- eval: E7b
  run_id: minted-cham-lai-khong-tu-doi-E7b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi_bo_cu
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-cham-lai-khong-tu-doi-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T18:12:40Z
  output: |
    Results: 8 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cham-lai-khong-tu-doi-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-cham-lai-khong-tu-doi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-16T18:12:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Eval không-phân-biệt (pass trên cả HEAD lẫn baseline; chứng minh harness chứ không chứng minh feature — viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):

- E7b — lệnh `node tests/scripts/cay-doi-trong-luot.test.mjs && node tests/scripts/ntr-thuoc.test.mjs && node tests/scripts/ghi-boi-tac-tu-cham.test.mjs`. E7b là bộ ca bộ cũ chạy để canh hồi quy (AC-7), nên đây là regression-guard có chủ ý.

Baseline khong do: round này không đo lại (evals.yaml không đổi từ lần baseline cuối, round 1); field baseline của từng eval ghi n-a.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lệnh suite plugins vung:1 đỏ và 13 finding chưa xử lý — verdict REJECT. Returned to implementation.
Round 2: sửa mục trong hợp đồng (mũi executor của AC-1 chỉ đổi một trường); lượt chấm lại PASS, E1–E8 mang sang từ round 1.
Round 3: chạy lại E1–E8 và toàn bộ lệnh suite trên commit 4f1a50b0 (S4-r2 PASS); E7b mang sang từ round 1 — verdict PASS.

### Re-pin lần 1 — 2026-10-17, do gộp main 94bd6e66 sau RM3b
run_id: repin-20261017T002140Z-55141
sha: 5c372a06d1adc7058a49c22e57887165799eec84 · suites: 11 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-10-17, do chiến dịch ghim lại mốc 2.32.0 — cửa sổ v2.31.0→HEAD
run_id: repin-20261017T024130Z-65967
sha: df2a693ce8a610387af83b3847627a4c57902f5e · suites: 11 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng
