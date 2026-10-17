---
schema_version: 2
feature_slug: cua-tin-hieu-goc-moi-worktree
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: df2a693ce8a610387af83b3847627a4c57902f5e
human_signoff: Manh Phan 2026-10-17
---

# Evidence Report: cua-tin-hieu-goc-moi-worktree

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cua-tin-hieu-goc-moi-worktree-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-10-16T15:23:55Z
  output: |
    node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs
    Results: 21 passed, 0 failed

- eval: E2
  run_id: minted-cua-tin-hieu-goc-moi-worktree-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-10-16T15:23:55Z
  output: |
    node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs
    Results: 21 passed, 0 failed

- eval: E3
  run_id: minted-cua-tin-hieu-goc-moi-worktree-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-10-16T15:23:55Z
  output: |
    node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs
    Results: 21 passed, 0 failed

- eval: E4
  run_id: minted-cua-tin-hieu-goc-moi-worktree-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-10-16T15:23:55Z
  output: |
    node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs
    Results: 21 passed, 0 failed

- eval: E5
  run_id: minted-cua-tin-hieu-goc-moi-worktree-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-10-16T15:23:55Z
  output: |
    node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs
    Results: 21 passed, 0 failed

- eval: E6
  run_id: minted-cua-tin-hieu-goc-moi-worktree-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-10-16T15:23:55Z
  output: |
    node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs
    Results: 21 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-cua-tin-hieu-goc-moi-worktree-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-16T15:23:55Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào đo được là xanh cả hai phía (E1–E6 đều có baseline n-a vì là eval mới, xem mục dưới).

### Baseline khong do

- node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs: bo qua baseline: tep tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs co o cay dang kiem nhung chua co o merge-base b14139f796b01d1fd891d8f2bff45bb24d07aa17 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — lệnh suite `--manh vung:2` của plugins không chạy xong trong ngưỡng; ba phát hiện trong hợp đồng về đối chứng dương thiếu (AC-2, AC-4, AC-6) trả về triển khai.
Round 2: E1–E6 và mười hai lệnh suite đều xanh trên cây đã ghim ở verified_commit; còn một phát hiện trong hợp đồng mức vừa về AC-1, và các phát hiện ngoài hợp đồng, xem review-findings.md trước khi ký.

### Re-pin lần 1 — 2026-10-17, do chiến dịch ghim lại mốc 2.32.0 — cửa sổ v2.31.0→HEAD
run_id: repin-20261017T024130Z-65967
sha: df2a693ce8a610387af83b3847627a4c57902f5e · suites: 11 lệnh exit 0 · evals: 6/6 eval máy đạt kỳ vọng
