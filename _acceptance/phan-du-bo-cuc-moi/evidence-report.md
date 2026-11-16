---
schema_version: 2
feature_slug: phan-du-bo-cuc-moi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 91e384d45a138457b68a692e1753faf142d0afd3
human_signoff: Phan Le Manh 2026-11-16 — ký với 11 known-limits (Ngoài-1/3/4/6/7/8/9/10/12/13/14), 2 chấp nhận không sửa (Ngoài-2/5) và 1 mở hợp đồng mới (Ngoài-11 → hạt giống docs/plans/2026-11-15-hat-giong-ung-vien-verifier-hook-ci.md); đồng ý phạm vi đã cắt; phê hết quyết định ghi sau Cổng Phạm vi
---

# Evidence Report: phan-du-bo-cuc-moi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-11 | script | PASS |
| E13 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-phan-du-bo-cuc-moi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_cu
  verified_at: 2026-11-15T16:28:44Z
  output: |
    giu-khoa --cu: 5095s

- eval: E11
  run_id: r2-l2-1-20261115162844
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi
  verified_at: 2026-11-15T16:28:44Z
  output: |
    giu-khoa --moi: 1997s

- eval: E12
  run_id: minted-phan-du-bo-cuc-moi-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_chieu_do
  verified_at: 2026-11-15T16:28:44Z
  output: |
    giu-khoa --chieu-do: 505s

- eval: E2
  run_id: minted-phan-du-bo-cuc-moi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.pdbm_bo_cuc
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-phan-du-bo-cuc-moi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k2
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-phan-du-bo-cuc-moi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_sp
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-phan-du-bo-cuc-moi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k3
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-phan-du-bo-cuc-moi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.pdbm_recheck_goc_goi
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6b
  run_id: minted-phan-du-bo-cuc-moi-E6b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k3
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-phan-du-bo-cuc-moi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k4_sc
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-phan-du-bo-cuc-moi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k4_pl
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-phan-du-bo-cuc-moi-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_sp
  verified_at: 2026-11-15T14:39:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-phan-du-bo-cuc-moi-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-phan-du-bo-cuc-moi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-15T16:28:44Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay. Khong eval nao duoc liet ke la khong-phan-biet. Field baseline cua moi eval ghi n-a (round nay khong do).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1 failed — khoá CTN-AC6-kit đếm nội dung báo cáo của cây bị báo mất oan, KHOA_N_CU thiếu khoá này. Returned to implementation.
Round 2: E1, E11, E12 chạy lại sau vá (5fc1725f); E2–E8, E13 carry-forward tu round 1; mọi eval và lệnh suite xanh. Verdict PASS.

### Re-pin lần 1 — 2026-11-16, do DP3-12-do-lb chép kèm bộ dịch sau chữ ký (CI tests · dieu-phoi đỏ); khai hai tệp vào luật danh sách
run_id: repin-20261115T214907Z-22379
sha: 91e384d45a138457b68a692e1753faf142d0afd3 · suites: 11 lệnh exit 0 · evals: 12/12 eval máy đạt kỳ vọng
