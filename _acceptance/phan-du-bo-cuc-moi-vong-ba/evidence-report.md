---
schema_version: 2
feature_slug: phan-du-bo-cuc-moi-vong-ba
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9f0e9617e29e23e25d6ba008423e6883810b850f
human_signoff:
---

# Evidence Report: phan-du-bo-cuc-moi-vong-ba

Round 2. Mười eval máy đều chạy xong; verdict REJECT vì còn bốn phát hiện TRONG hợp đồng (AC-6 ×3, AC-2 ×1) chưa được sửa — xem review-findings.md.

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
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E1-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.pd3_bang_ten
  verified_at: 2026-11-16T14:40:34Z
  output: |
    bang-ten-lo-trinh: 12 PASS, 0 FAIL

- eval: E2
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_sau_gop
  verified_at: 2026-11-16T14:40:34Z
  output: |
    giu-khoa-3 --sau-gop: 2046s

- eval: E3
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.pd3_hai_bo_cuc
  verified_at: 2026-11-16T14:40:34Z
  output: |
    hai-bo-cuc: 4 PASS, 0 FAIL

- eval: E4
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_moi_mp
  verified_at: 2026-11-16T14:40:34Z
  output: |
    giu-khoa-3 --moi: 45s

- eval: E5
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_moi_lt
  verified_at: 2026-11-16T14:40:34Z
  output: |
    giu-khoa-3 --moi: 629s

- eval: E6
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_moi_tb
  verified_at: 2026-11-16T14:40:34Z
  output: |
    giu-khoa-3 --moi: 366s

- eval: E7
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_moi_rg
  verified_at: 2026-11-16T14:40:34Z
  output: |
    giu-khoa-3 --moi: 16s

- eval: E8
  run_id: r2-l8-1-20261116144034
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_cu
  verified_at: 2026-11-16T14:40:34Z
  output: |
    giu-khoa-3 --cu: 1124s

- eval: E9
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_chieu_do
  verified_at: 2026-11-16T14:40:34Z
  output: |
    giu-khoa-3 --chieu-do: 75s

- eval: E10
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pd3_tinh
  verified_at: 2026-11-16T14:40:34Z
  output: |
    giu-khoa-3 --tinh: 0s

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-phan-du-bo-cuc-moi-vong-ba-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-16T14:40:34Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

Baseline không đo:
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

none — mọi eval nhiều lượt chạy đều đồng nhất

## Iterations

Round 1: S4 lượt 1 bị REJECT — đã vá ở 6ef6889d (đối chứng trước gộp, RA-LOP hai chiều, CU-DO qua hàm so chung, chiều đỏ tách lượt, CHONG-RONG, ô kho mới lịch sử thật). Returned to implementation.
Round 2: mười eval máy xanh nhưng còn bốn phát hiện trong hợp đồng — CHONG-RONG (AC-6) mù với dạng git archive trong chuỗi bash -c (ba phát hiện cùng lỗ), RA-LOP (AC-2) chỉ so tên tệp mà không kiểm quan hệ nhóm↔mã. Returned to implementation.
