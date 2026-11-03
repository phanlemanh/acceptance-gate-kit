---
schema_version: 2
feature_slug: ban-do-khuon-roi-nhom
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8a9d517ca36bf163a579511da9a0d491e0971621
human_signoff:
---

# Evidence Report: ban-do-khuon-roi-nhom

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
  run_id: minted-ban-do-khuon-roi-nhom-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-ban-do-khuon-roi-nhom-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-ban-do-khuon-roi-nhom-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-ban-do-khuon-roi-nhom-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-ban-do-khuon-roi-nhom-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom_hai_kho
  verified_at: 2026-11-03T09:48:45Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-ban-do-khuon-roi-nhom-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-03T11:20:51Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Baseline khong do: E1, E2, E3, E4, E5, E6 — evals.yaml khong doi tu lan baseline cuoi (round 1), nen field baseline cua tung eval ghi n-a. Khong co eval nao duoc xac dinh la khong-phan-biet. Cac lenh suite xanh-ca-hai-phia la regression-guard binh thuong, khong liet ke.

none — khong co eval khong-phan-biet nao duoc liet ke.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — bản đồ sản phẩm cần sinh lại sau khi vào S4 (commit 8a9d517c); trả về triển khai.
Round 2: PASS — sáu eval mang từ round 1 (delta không chạm paths của eval), mười một lệnh suite xanh trên cây 8a9d517c.
