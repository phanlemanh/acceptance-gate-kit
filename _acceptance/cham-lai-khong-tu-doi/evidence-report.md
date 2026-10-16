---
schema_version: 2
feature_slug: cham-lai-khong-tu-doi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 85cc53f76a9006d531cc525c0c7270d6260760fd
human_signoff:
---

# Evidence Report: cham-lai-khong-tu-doi

Round 2. Chín eval mang sang nguyên từ round 1 (delta không chạm paths của eval); mười một lệnh suite chạy lại ở round này.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cham-lai-khong-tu-doi-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-cham-lai-khong-tu-doi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-cham-lai-khong-tu-doi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-cham-lai-khong-tu-doi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-cham-lai-khong-tu-doi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-cham-lai-khong-tu-doi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-cham-lai-khong-tu-doi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7b
  run_id: minted-cham-lai-khong-tu-doi-E7b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi_bo_cu
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-cham-lai-khong-tu-doi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cham-lai-khong-tu-doi-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-cham-lai-khong-tu-doi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-16T17:22:20Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1). Field baseline cua tung eval ghi n-a vi round nay khong do.

Eval khong-phan-biet (xanh ca tren code HEAD lan baseline, chung minh harness chu khong phai tinh nang):
- E7b — lenh `node tests/scripts/cay-doi-trong-luot.test.mjs && node tests/scripts/ntr-thuoc.test.mjs && node tests/scripts/ghi-boi-tac-tu-cham.test.mjs`. Ba bo ca san co chay tuan tu; day la regression-guard co chu y cua AC-7 (hanh vi cu phai giu nguyen), khong phai eval kiem hanh vi moi.

Khong co eval judge o hop dong nay, nen khong co hoi dong cham va khong co human_override nao can dien.

## Variance

none — every multi-run eval is uniform (moi eval chay mot lan, deterministic)

## Iterations

Round 1: bo suite plugins vung:1 khong qua (P93 — ke hoach chep tieu de khuon bang); doi chu tieu de roi tra ve trien khai.
Round 2: chin eval mang sang tu round 1 (delta khong cham paths cua eval), mười một lệnh suite chạy lại đều xanh; verified_at cua cac khoi suite round 2 la moc ngay soan bao cao (payload khong mang gio chay).
