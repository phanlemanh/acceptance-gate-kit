---
schema_version: 2
feature_slug: run-id-danh-sach-cho-phep
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a94e7f31f83c200af5ae67fa8ed1d78fc36b38aa
human_signoff: Manh Phan 2026-11-01 — ký; Ngoài-1, Ngoài-3 ghi Known limits; Ngoài-2 chấp nhận, không sửa; đồng ý phạm vi đã cắt; phê hết quyết định ghi sau Cổng Phạm vi
---

# Evidence Report: run-id-danh-sach-cho-phep

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-run-id-danh-sach-cho-phep-E1-r1
  exit_code: 0
  baseline: n-a
  carried_from_round: 1
  verifier: config:executors.script.rh_e1
  verified_at: 2026-10-31T19:37:27Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-run-id-danh-sach-cho-phep-E2-r1
  exit_code: 0
  baseline: n-a
  carried_from_round: 1
  verifier: config:executors.script.rh_e2
  verified_at: 2026-10-31T19:37:27Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-run-id-danh-sach-cho-phep-E3-r1
  exit_code: 0
  baseline: n-a
  carried_from_round: 1
  verifier: config:executors.script.rh_e3
  verified_at: 2026-10-31T19:37:27Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-run-id-danh-sach-cho-phep-E4-r1
  exit_code: 0
  baseline: n-a
  carried_from_round: 1
  verifier: config:executors.script.rh_e4
  verified_at: 2026-10-31T19:37:27Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-run-id-danh-sach-cho-phep-E5-r1
  exit_code: 0
  baseline: n-a
  carried_from_round: 1
  verifier: config:executors.script.rh_e5
  verified_at: 2026-10-31T19:37:27Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-run-id-danh-sach-cho-phep-E6-r1
  exit_code: 0
  baseline: n-a
  carried_from_round: 1
  verifier: config:executors.script.rh_e6
  verified_at: 2026-10-31T19:37:27Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-11-01T04:00:15Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — khong eval nao khong-phan-biet duoc liet ke; cac lenh suite xanh-ca-hai-phia la regression-guard binh thuong.

## Judge

Khong co judgment item nao trong round nay — khong panel nao duoc de xuat.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E6 chay va dat; sau do duoc mang sang (carry-forward) o cac round sau.
Round 2: BLOCKED — mang plugin vung 2 vuot tran 600 s cua cong cu do (ha tang, khong phai loi vat).
Round 3: PASS — E1–E6 mang tu round 1 (delta khong cham paths cua eval), 12 lenh suite hoi quy chay xanh tren commit da ghim.

### Re-pin lần 1 — 2026-11-01, do gộp main 1de12588 sau chữ ký + khai RT13 ở ra-co-ten
run_id: repin-20261101T071413Z-86762
sha: a94e7f31f83c200af5ae67fa8ed1d78fc36b38aa · suites: 11 lệnh exit 0 · evals: 6/6 eval máy đạt kỳ vọng
