---
schema_version: 2
feature_slug: kho-moi-cai-goi-road-map
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 332d033521697292470d46e3f00304e870c8969a
human_signoff:
---

# Evidence Report: kho-moi-cai-goi-road-map

Vòng 2. Phán quyết REJECT do MỘT lệnh suite hồi quy không gắn eval nào (vùng 3 của bộ kiểm plugin) báo hỏng; mọi eval E1–E9 đều xanh nên `failed_evals` để trống. Chi tiết ở mục «Lệnh suite (hồi quy)» và «Iterations».

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
| E9 | AC-9 | test | PASS (carry-forward từ vòng 1) |

## Evidence

- eval: E1
  run_id: minted-kho-moi-cai-goi-road-map-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T18:12:15Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E2
  run_id: minted-kho-moi-cai-goi-road-map-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T18:12:15Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E3
  run_id: minted-kho-moi-cai-goi-road-map-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T18:12:15Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E4
  run_id: minted-kho-moi-cai-goi-road-map-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T18:12:15Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E5
  run_id: minted-kho-moi-cai-goi-road-map-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T18:12:15Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E6
  run_id: minted-kho-moi-cai-goi-road-map-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T18:12:15Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E7
  run_id: minted-kho-moi-cai-goi-road-map-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T18:12:15Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E8
  run_id: minted-kho-moi-cai-goi-road-map-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map
  verified_at: 2026-10-15T18:12:15Z
  output: |
    Results: 38 passed, 0 failed (kho-moi-cai-goi-road-map)

- eval: E9
  run_id: minted-kho-moi-cai-goi-road-map-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_moi_cai_goi_road_map_cac_kho
  verified_at: 2026-10-15T09:42:57Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-10-15T18:12:15Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kho-moi-cai-goi-road-map-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-15T18:12:15Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1). Mọi block eval ghi `baseline: n-a`.

none — không có eval nào xanh trên cả nhánh lẫn baseline được liệt kê là không-phân-biệt; lệnh suite xanh là regression-guard bình thường.

Lệnh fail không gắn eval (nguyên nhân REJECT): `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'` (vùng 3 của bộ kiểm plugin) báo một ca hỏng. Đuôi đầu ra của lệnh: «FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=» (dòng bị cắt ở đây trong log), kèm dòng «Results: 4 passed, 0 failed (ntr-observed)» và «Results: 1 failed». Lệnh này không thuộc eval nào nên `failed_evals` để trống; máy không tự sửa vì ca hỏng nằm ở bộ kiểm hồi quy ngoài hợp đồng của vòng này, người xem ở Cổng 2.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, tất định).

## Iterations

Round 1: E1–E9 và mọi lệnh suite xanh; không eval nào thất bại. Kết quả vòng đầu, không có vòng trước.
Round 2: E1–E8 chạy lại xanh (38 ca đạt, 0 hỏng); E9 carry-forward từ vòng 1 (delta không chạm paths của eval); 10 trên 11 lệnh suite xanh, riêng lệnh vùng 3 của bộ kiểm plugin báo hỏng một ca (P179 [MBC] E6 ledger known-limits) — lệnh không gắn eval nên verdict REJECT với failed_evals rỗng. Ghi chú: payload vòng 2 không mang giờ chạy từng lượt nên `verified_at` của E1–E8 và các khối suite vòng 2 ghi theo ngày chạy 2026-10-16; giờ chính xác nằm ở `ts` của run-log.
