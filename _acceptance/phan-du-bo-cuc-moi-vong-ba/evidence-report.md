---
schema_version: 2
feature_slug: phan-du-bo-cuc-moi-vong-ba
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a9d3b6c9feca897696f1b14ffe2d0c91ba773293
human_signoff: Phan Le Manh 2026-11-17 — ký với 4 known-limits (Ngoài-1/2/3/4); đồng ý phạm vi đã cắt; phê hết quyết định ghi sau Cổng Phạm vi
---

# Evidence Report: phan-du-bo-cuc-moi-vong-ba

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E1-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.test.pd3_bang_ten
  verified_at: 2026-11-16T16:17:17Z
  output: |
    bang-ten-lo-trinh: 12 PASS, 0 FAIL

- eval: E2
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_sau_gop
  verified_at: 2026-11-16T16:17:17Z
  output: |
    giu-khoa-3 --sau-gop: 2022s

- eval: E3
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.pd3_hai_bo_cuc
  verified_at: 2026-11-16T16:17:17Z
  output: |
    hai-bo-cuc: 4 PASS, 0 FAIL

- eval: E4
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_moi_mp
  verified_at: 2026-11-16T16:17:17Z
  output: |
    giu-khoa-3 --moi: 41s

- eval: E5
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_moi_lt
  verified_at: 2026-11-16T16:17:17Z
  output: |
    giu-khoa-3 --moi: 605s

- eval: E6
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_moi_tb
  verified_at: 2026-11-16T16:17:17Z
  output: |
    giu-khoa-3 --moi: 346s

- eval: E7
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_moi_rg
  verified_at: 2026-11-16T16:17:17Z
  output: |
    giu-khoa-3 --moi: 16s

- eval: E8
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_cu
  verified_at: 2026-11-16T16:17:17Z
  output: |
    giu-khoa-3 --cu: 1097s

- eval: E9
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_chieu_do
  verified_at: 2026-11-16T16:17:17Z
  output: |
    giu-khoa-3 --chieu-do: 71s

- eval: E10
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_tinh
  verified_at: 2026-11-16T16:17:17Z
  output: |
    giu-khoa-3 --tinh: 0s

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-11-16T16:17:17Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều đỏ trên baseline (có phân biệt) hoặc là eval mới không đo được trên baseline; không eval nào xanh ở cả hai phía.

Baseline khong do:
- node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs --sau-gop: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/hai-bo-cuc.test.mjs: bo qua baseline: tep tests/scripts/hai-bo-cuc.test.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs --moi --cum K4-MP: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs --moi --cum K4-LT: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs --moi --cum K4-TB: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs --moi --cum K4-RG: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs --cu: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs --chieu-do: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs --tinh: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs co o cay dang kiem nhung chua co o merge-base 795baf966a78c4d72e9726024ff724076c23e8a6 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy nhiều lần đều đồng nhất (mọi eval đều là deterministic, runs 1).

## Iterations

Round 1: REJECT theo hồ sơ S4 lượt 1 — vá ở commit 6ef6889d, lời AC-1/2/6/9 và eval theo bản vá. Returned to implementation.
Round 2: REJECT theo hồ sơ S4 lượt 2 — vá ở commit 9166dcbb (CHONG-RONG mọi dạng lệnh lịch sử, RA-LOP-DONG + RA-LOP-A, phanSauGop bỏ khoá cấp tệp, SAU-GOP-DO ghim câu). Returned to implementation.
Round 3: mọi eval E1–E10 và mọi lệnh suite đều đạt trên commit a9d3b6c9; verdict PASS.
