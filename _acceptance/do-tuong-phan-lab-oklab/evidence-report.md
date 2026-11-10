---
schema_version: 2
feature_slug: do-tuong-phan-lab-oklab
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: da326e8932e0bc720317076b192989229f2e62ae
human_signoff:
---

# Evidence Report: do-tuong-phan-lab-oklab

Vòng 1: mọi eval của máy đều xanh, nhưng vòng rà soát có 6 lỗi nằm trong hợp đồng (AC-5, AC-6, AC-9, AC-10) chưa được sửa nên kết luận là REJECT. Chi tiết trong review-findings.md.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6a | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E6c | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-7 | test | PASS |
| E11 | AC-8 | script | PASS |
| E9a | AC-9 | test | PASS |
| E9b | AC-9 | script | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-do-tuong-phan-lab-oklab-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E2
  run_id: minted-do-tuong-phan-lab-oklab-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E3
  run_id: minted-do-tuong-phan-lab-oklab-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E4
  run_id: minted-do-tuong-phan-lab-oklab-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E5
  run_id: minted-do-tuong-phan-lab-oklab-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E6a
  run_id: minted-do-tuong-phan-lab-oklab-E6a-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E6b
  run_id: minted-do-tuong-phan-lab-oklab-E6b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.kdd_hoi_quy
  verified_at: 2026-11-10T00:59:51Z
  output: |
    KD: 4 đạt, 0 trượt

- eval: E6c
  run_id: minted-do-tuong-phan-lab-oklab-E6c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.kdd_nen_mau
  verified_at: 2026-11-10T00:59:51Z
  output: |
    KD: 11 đạt, 0 trượt

- eval: E7
  run_id: minted-do-tuong-phan-lab-oklab-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E8
  run_id: minted-do-tuong-phan-lab-oklab-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E11
  run_id: minted-do-tuong-phan-lab-oklab-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mau_lab_chromium
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-chromium: 5/5 ca đạt

- eval: E9a
  run_id: minted-do-tuong-phan-lab-oklab-E9a-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T00:59:51Z
  output: |
    mau-lab-do: 13/13 ca đạt

- eval: E9b
  run_id: minted-do-tuong-phan-lab-oklab-E9b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.design_scan_khop_nguon
  verified_at: 2026-11-10T00:59:51Z
  output: |
    design-scan.js in sync

- eval: E10
  run_id: minted-do-tuong-phan-lab-oklab-E10-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.df_s4_chu_thich
  verified_at: 2026-11-10T00:59:51Z
  output: |
    moc-s3-s4: XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-10T00:59:51Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline, chứng minh bộ kiểm chứ không phải tính năng; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- E6b (bash tests/design-eval/kdd.sh --hoi-quy): baseline green
- E6c (bash tests/design-eval/kdd.sh KD9): baseline green
- E9b (node scripts/build-design-scan.mjs --check): baseline green

Baseline khong do

- node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs: bo qua baseline: tep tests/design-eval/mau-lab.test.mjs co o cay dang kiem nhung chua co o merge-base c8fa5a65588609b622dc83a9b114d65d2bdc5b47 — eval moi, chay tren code cu khong phan biet gi
- node tests/design-eval/mau-lab-chromium.mjs: bo qua baseline: tep tests/design-eval/mau-lab-chromium.mjs co o cay dang kiem nhung chua co o merge-base c8fa5a65588609b622dc83a9b114d65d2bdc5b47 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào của máy đỏ, nhưng rà soát phát hiện 6 lỗi trong hợp đồng (AC-5 điểm dừng gradient hoà với trắng tự đặt; AC-6 đối chiếu MD-0 không ghim giá trị; AC-9 ca mốc vá chỉ chạm mốc đầu; AC-10 bộ lọc chú thích xoá nhầm hex thật, 3 lỗi). Trả về phần triển khai.
