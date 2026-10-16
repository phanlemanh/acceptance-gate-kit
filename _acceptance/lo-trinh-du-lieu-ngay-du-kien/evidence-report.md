---
schema_version: 2
feature_slug: lo-trinh-du-lieu-ngay-du-kien
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 96cc91fbc0a4ccea10055d4cf8ac36464f30e1c0
human_signoff:
---

# Evidence Report: lo-trinh-du-lieu-ngay-du-kien

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-16T08:55:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi). Field baseline cua tung eval ghi n-a vi round nay khong do.

none — khong co eval nao duoc xac dinh la khong-phan-biet. Cac lenh suite xanh o ca hai phia la regression-guard binh thuong, khong liet ke.

## Variance

none — every multi-run eval is uniform (moi eval deu chay mot lan, deterministic).

## Iterations

Round 1: REJECT vì P93 (tên cột khuôn bảng trong kế hoạch) — đã sửa, ghi sổ chạy lượt 1.
Round 2: 8 eval AC-1..AC-8 mang sang từ round 1 (delta không chạm paths của eval); 11 lệnh suite hồi quy chạy lại, tất cả xanh. Verdict PASS.
