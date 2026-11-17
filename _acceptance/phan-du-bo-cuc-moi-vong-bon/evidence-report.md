---
schema_version: 2
feature_slug: phan-du-bo-cuc-moi-vong-bon
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f4c7707bf1bc0995b1b05554a28085b271a9e9e6
human_signoff: Phan Le Manh 2026-11-17 — ký với 4 known-limits (Ngoài-1/3/4/5); Ngoài-2 chấp nhận, không sửa; đồng ý phạm vi đã cắt; phê hết quyết định ghi sau Cổng Phạm vi
---

# Evidence Report: phan-du-bo-cuc-moi-vong-bon

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | test | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd4_moi_tb
  verified_at: 2026-11-17T03:40:38Z
  output: |
    giu-khoa-4 --moi: 334s

- eval: E2
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.cvsck_dv5
  verified_at: 2026-11-17T03:40:38Z
  output: |
    Results: 10 passed, 0 failed

- eval: E3
  run_id: r1-l3-1-20261117034038
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd4_moi_dv5
  verified_at: 2026-11-17T03:40:38Z
  output: |
    giu-khoa-4 --moi: 42s

- eval: E4
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd4_moi_so_that
  verified_at: 2026-11-17T03:40:38Z
  output: |
    giu-khoa-4 --moi: 275s

- eval: E5
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.can_cu_s1_ca
  verified_at: 2026-11-17T03:40:38Z
  output: |
    Results: 52 passed, 0 failed (can-cu-s1)

- eval: E6
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd4_mp
  verified_at: 2026-11-17T03:40:38Z
  output: |
    giu-khoa-4 --mp: 284s

- eval: E7
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd4_cu
  verified_at: 2026-11-17T03:40:38Z
  output: |
    giu-khoa-4 --cu: 272s

- eval: E8
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd4_tinh
  verified_at: 2026-11-17T03:40:38Z
  output: |
    giu-khoa-4 --tinh: 6s

- eval: E9
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd4_moi_lt
  verified_at: 2026-11-17T03:40:38Z
  output: |
    giu-khoa-4 --moi: 244s

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-phan-du-bo-cuc-moi-vong-bon-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-17T03:40:38Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh ở cả HEAD lẫn baseline; chứng minh harness chứ không phải tính năng, nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E2 (node tests/scripts/additive-only.test.mjs)
- E5 (node tests/scripts/can-cu-s1.ca.mjs)

Baseline khong do:
- node _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs --moi --nhom tb: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs co o cay dang kiem nhung chua co o merge-base 3341b8dce56e85405c73ee59faf743675da257e7 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs --moi --nhom dv5: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs co o cay dang kiem nhung chua co o merge-base 3341b8dce56e85405c73ee59faf743675da257e7 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs --moi --nhom so-that: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs co o cay dang kiem nhung chua co o merge-base 3341b8dce56e85405c73ee59faf743675da257e7 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs --mp: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs co o cay dang kiem nhung chua co o merge-base 3341b8dce56e85405c73ee59faf743675da257e7 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs --cu: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs co o cay dang kiem nhung chua co o merge-base 3341b8dce56e85405c73ee59faf743675da257e7 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs --tinh: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs co o cay dang kiem nhung chua co o merge-base 3341b8dce56e85405c73ee59faf743675da257e7 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs --moi --nhom lt: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs co o cay dang kiem nhung chua co o merge-base 3341b8dce56e85405c73ee59faf743675da257e7 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E9 đều đạt, các lệnh suite xanh; không có eval hỏng, không có mục judgment chờ người.
