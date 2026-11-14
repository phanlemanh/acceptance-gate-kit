---
schema_version: 2
feature_slug: goi-cheo-loi-dieu-phoi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1e053693c11eb342c5bbdf6151e379fa4f3279de
human_signoff:
---

# Evidence Report: goi-cheo-loi-dieu-phoi

Round 2. Mọi eval có lệnh chạy lại đều xanh. Verdict REJECT vì lệnh suite `vung:3` của plugins đỏ và không gắn eval nào (xem "Lệnh fail không gắn eval" ở Analyst).

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
| E9 | AC-9 | test | PASS (carry-forward từ round 1) |
| E10 | AC-10 | script | PASS |
| E11 | AC-1 | test | PASS (carry-forward từ round 1) |
| E12 | AC-1 | test | PASS (carry-forward từ round 1) |
| E13 | AC-1 | test | PASS (carry-forward từ round 1) |
| E14 | AC-1 | test | PASS (carry-forward từ round 1) |
| E15 | AC-1 | test | PASS (carry-forward từ round 1) |
| E17 | AC-11 | script | PASS (carry-forward từ round 1) |

không chạy theo hồ sơ: E16

## Evidence

- eval: E1
  run_id: minted-goi-cheo-loi-dieu-phoi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_vi_phan
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo vi-phan: 18 passed, 0 failed

- eval: E2
  run_id: minted-goi-cheo-loi-dieu-phoi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo bo-cuc-moi: 10 passed, 0 failed

- eval: E3
  run_id: minted-goi-cheo-loi-dieu-phoi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo bo-cuc-moi: 10 passed, 0 failed

- eval: E4
  run_id: minted-goi-cheo-loi-dieu-phoi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo bo-cuc-moi: 10 passed, 0 failed

- eval: E5
  run_id: minted-goi-cheo-loi-dieu-phoi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo bo-cuc-moi: 10 passed, 0 failed

- eval: E6
  run_id: minted-goi-cheo-loi-dieu-phoi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo bo-cuc-moi: 10 passed, 0 failed

- eval: E7
  run_id: minted-goi-cheo-loi-dieu-phoi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo bo-cuc-moi: 10 passed, 0 failed

- eval: E8
  run_id: minted-goi-cheo-loi-dieu-phoi-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo bo-cuc-moi: 10 passed, 0 failed

- eval: E9
  run_id: minted-goi-cheo-loi-dieu-phoi-E9-r1
  exit_code: 0
  verifier: config:executors.test.mot_nguon_ten
  verified_at: 2026-11-14T14:17:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-goi-cheo-loi-dieu-phoi-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_chieu_do
  verified_at: 2026-11-14T15:27:53Z
  output: |
    goi-cheo chieu-do: 8 passed, 0 failed

- eval: E11
  run_id: bw0mrqcj6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-11-14T14:17:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-goi-cheo-loi-dieu-phoi-E12-r1
  exit_code: 0
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-11-14T14:17:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-goi-cheo-loi-dieu-phoi-E13-r1
  exit_code: 0
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-11-14T14:17:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-goi-cheo-loi-dieu-phoi-E14-r1
  exit_code: 0
  verifier: config:executors.test.cua_tin_hieu_giua_chien_dich
  verified_at: 2026-11-14T14:17:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-goi-cheo-loi-dieu-phoi-E15-r1
  exit_code: 0
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-11-14T14:17:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-goi-cheo-loi-dieu-phoi-E17-r1
  exit_code: 0
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-11-14T14:17:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-11-14T15:27:53Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-14T15:27:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

### Lệnh fail không gắn eval

- `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`: không gắn eval nào, kết thúc với mã thoát 1. Đầu ra đáng chú ý: ca P179 [MBC] E6 (ledger known-limits: đếm từ corpus + bất biến hằng + quan hệ) báo FAIL; MUTANT-6 được bắt đúng («site thiếu số bản: feature-loop/skills/feature-loop/SKILL.md»); ntr-observed 4 passed. Đây là lý do verdict REJECT ở round này.

### Baseline khong do

- node _acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs: bo qua baseline: tep _acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs co o cay dang kiem nhung chua co o merge-base 593e68376006cf8b036f167b805048a5f1692c3c — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs: bo qua baseline: tep _acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs co o cay dang kiem nhung chua co o merge-base 593e68376006cf8b036f167b805048a5f1692c3c — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs --chieu-do: bo qua baseline: tep _acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs co o cay dang kiem nhung chua co o merge-base 593e68376006cf8b036f167b805048a5f1692c3c — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: S4 lượt 1 REJECT — 7 phát hiện trong hợp đồng ở VP-HT/BC-8 (đo dựa mã thoát thay vì đo thật). Returned to implementation.
Round 2: các eval E1–E8, E10 xanh trên cây đã sửa (commit 485980d4); E9, E11–E15, E17 carry-forward từ round 1; lệnh suite plugins vung:3 đỏ ở ca P179 [MBC] E6 và không gắn eval nào. Returned to implementation.
