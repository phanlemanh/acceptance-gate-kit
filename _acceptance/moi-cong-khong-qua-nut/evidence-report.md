---
schema_version: 2
feature_slug: moi-cong-khong-qua-nut
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f455bfe832aedf67b74b3e75d4c89a3c20408ef6
human_signoff: Manh Phan 2026-10-20
---

# Evidence Report: moi-cong-khong-qua-nut

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
| E9a | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-moi-cong-khong-qua-nut-E1-r1
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-moi-cong-khong-qua-nut-E2-r2
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T17:23:18Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-moi-cong-khong-qua-nut-E3-r2
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T17:23:18Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-moi-cong-khong-qua-nut-E4-r2
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T17:23:18Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-moi-cong-khong-qua-nut-E5-r1
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-moi-cong-khong-qua-nut-E6-r1
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-moi-cong-khong-qua-nut-E7-r1
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-moi-cong-khong-qua-nut-E8-r1
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9a
  run_id: minted-moi-cong-khong-qua-nut-E9a-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.p188_moi_cong
  verified_at: 2026-10-19T22:24:24Z
  output: |
    PASS: P188 round-trip dieu khoan moi-cong: MOI site nguon khop tung ky tu (E5)

- eval: E9b
  run_id: minted-moi-cong-khong-qua-nut-E9b-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp107_dp201
  verified_at: 2026-10-19T22:24:24Z
  output: |
    # fail 0

- eval: E10
  run_id: minted-moi-cong-khong-qua-nut-E10-r1
  exit_code: 0
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-moi-cong-khong-qua-nut-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-moi-cong-khong-qua-nut-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-19T22:24:24Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline): E9a, E9b. Cả hai là regression-guard có chủ ý: sau khi chủ kho chọn «lối 1» ở lượt 3, AC-9 thu về việc giữ nguyên hành vi cũ của P188 (round-trip điều khoản mời cổng) và DP1-07 / DP2-01 (khoá điều phối) — chúng chứng minh bản mới không phá bộ ca sẵn có, không chứng minh hành vi mới.

Baseline khong do: E1–E8 và E10 mang từ round trước (carry-forward), round này không chạy lại nên không đo baseline.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: AC-1..AC-8, AC-10 dựng thước; lượt chấm 1 trả REJECT — hồ sơ và sổ sửa ghi ở run-log round 1. Returned to implementation.
Round 2: E9b đỏ chập chờn vì ca GT-07 ngoài vòng (khoá điều phối); dừng-vá, trình lối ra cho chủ kho. Returned to implementation.
Round 3: chủ kho chọn «lối 1» — thu AC-9 về P188 + DP1-07 + DP2-01; E9a, E9b và toàn bộ lệnh suite xanh, E1–E8 và E10 mang từ round trước. Verdict PASS.

### Re-pin lần 1 — 2026-10-20, do gộp origin/main (#390 GT2) vào nhánh sau chữ ký
run_id: repin-20261020T002011Z-38826
sha: 090882fd28926f2fff075ab4e888e1c40bc1bc81 · suites: 11 lệnh exit 0 · evals: 11/11 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-10-20, do gộp origin/main b2c058d8 vào nhánh sau ghim lần 1
run_id: repin-20261020T010854Z-50324
sha: f455bfe832aedf67b74b3e75d4c89a3c20408ef6 · suites: 11 lệnh exit 0 · evals: 11/11 eval máy đạt kỳ vọng
