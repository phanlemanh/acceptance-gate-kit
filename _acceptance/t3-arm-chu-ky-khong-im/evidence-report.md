---
schema_version: 2
feature_slug: t3-arm-chu-ky-khong-im
verdict: BLOCKED
failed_evals: []
reason: "Lenh `bash tests/scripts/run-tests.sh --manh mjs:3/3` chay qua 72 phut chua xong (bat dau 18:28, kiem tra 19:40:39 +07, ngay 2026-11-10) — vuot tran 30 phut cho eval mac dinh, chua thay dong __EXIT=<n> nao. Lenh nen duoc bo sung long_running trong evals.yaml neu can thoi gian dai hon. Lenh van dang chay duoi ID nen bi44f1lmd... (ID: bi43f1lmd), chua duoc dung; khong khoi dong ban thu hai. Khong co ket qua PASS/FAIL nao duoc suy ra."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9d159d1ac2b9594b6b7e9cad6bcf4207d5b27263
human_signoff:
---

# Evidence Report: t3-arm-chu-ky-khong-im

Round 2. Verify bị chặn: một lệnh suite hồi quy (`mjs:3/3`) chạy quá 72 phút, không có dòng tổng kết. Tám eval của hợp đồng đều có kết quả xanh (E7 mang từ round 1). Verdict BLOCKED vì bộ hồi quy chưa đo xong, không phải vì code sai.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-6 | script | PASS (carry-forward từ round 1) |
| E8 | AC-7 | script | PASS |

Không có lệnh fail nào không gắn eval.

## Evidence

- eval: E1
  run_id: minted-t3-arm-chu-ky-khong-im-E1-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e1
  verified_at: 2026-11-10T11:09:21Z
  output: |
    Results: 5 passed, 0 failed
    __EXIT=0

- eval: E2
  run_id: minted-t3-arm-chu-ky-khong-im-E2-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e2
  verified_at: 2026-11-10T11:09:21Z
  output: |
    Results: 2 passed, 0 failed
    __EXIT=0

- eval: E3
  run_id: minted-t3-arm-chu-ky-khong-im-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e3
  verified_at: 2026-11-10T11:09:21Z
  output: |
    Results: 3 passed, 0 failed
    __EXIT=0

- eval: E4
  run_id: minted-t3-arm-chu-ky-khong-im-E4-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e4
  verified_at: 2026-11-10T11:09:21Z
  output: |
    Results: 5 passed, 0 failed
    __EXIT=0

- eval: E5
  run_id: minted-t3-arm-chu-ky-khong-im-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e5
  verified_at: 2026-11-10T11:09:21Z
  output: |
    Results: 3 passed, 0 failed
    __EXIT=0

- eval: E6
  run_id: minted-t3-arm-chu-ky-khong-im-E6-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e6
  verified_at: 2026-11-10T11:09:21Z
  output: |
    Results: 5 passed, 0 failed
    __EXIT=0

- eval: E7
  run_id: minted-t3-arm-chu-ky-khong-im-E7-r1
  exit_code: 0
  verifier: config:executors.script.t3ha_e8
  verified_at: 2026-11-10T09:36:03Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-t3-arm-chu-ky-khong-im-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e8
  verified_at: 2026-11-10T11:09:21Z
  output: |
    Results: 2 passed, 0 failed
    __EXIT=0

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  verified_at: 2026-11-10T11:09:21Z
  # BLOCKED: không có kết quả. Lệnh chạy quá 72 phút (18:28 đến 19:40:39 +07, 2026-11-10), tệp đầu ra rỗng, chưa thấy dòng kết thúc. Lệnh còn chạy dưới ID bi43f1lmd, chưa dừng, không khởi động bản thứ hai. Không suy ra PASS hay FAIL.

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-10T11:09:21Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7 chạy và đạt; được mang sang round 2 vì delta không chạm paths của eval.
Round 2: BLOCKED — lệnh suite `mjs:3/3` chạy quá 72 phút chưa xong, vượt trần 30 phút. Cách xử lý là chạy lại với thời gian dài hơn (khai long_running trong evals.yaml), không phải sửa code. Các eval E1-E6, E8 và mười lệnh suite còn lại đều xanh.
