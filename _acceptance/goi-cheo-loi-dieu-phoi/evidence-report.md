---
schema_version: 2
feature_slug: goi-cheo-loi-dieu-phoi
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: dbf5c0608aa4206e44218c6549adf3c31b71c44d
human_signoff:
---

# Evidence Report: goi-cheo-loi-dieu-phoi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-1 | test | PASS |
| E12 | AC-1 | test | PASS |
| E13 | AC-1 | test | PASS |
| E14 | AC-1 | test | PASS |
| E15 | AC-1 | test | PASS |
| E17 | AC-11 | script | PASS |

không chạy theo hồ sơ: E16

## Evidence

- eval: E1
  run_id: minted-goi-cheo-loi-dieu-phoi-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_vi_phan
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo vi-phan: 18 passed, 0 failed

- eval: E2
  run_id: minted-goi-cheo-loi-dieu-phoi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo bo-cuc-moi: 9 passed, 0 failed

- eval: E3
  run_id: minted-goi-cheo-loi-dieu-phoi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo bo-cuc-moi: 9 passed, 0 failed

- eval: E4
  run_id: minted-goi-cheo-loi-dieu-phoi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo bo-cuc-moi: 9 passed, 0 failed

- eval: E5
  run_id: minted-goi-cheo-loi-dieu-phoi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo bo-cuc-moi: 9 passed, 0 failed

- eval: E6
  run_id: minted-goi-cheo-loi-dieu-phoi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo bo-cuc-moi: 9 passed, 0 failed

- eval: E7
  run_id: minted-goi-cheo-loi-dieu-phoi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo bo-cuc-moi: 9 passed, 0 failed

- eval: E8
  run_id: minted-goi-cheo-loi-dieu-phoi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_bo_cuc_moi
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo bo-cuc-moi: 9 passed, 0 failed

- eval: E9
  run_id: minted-goi-cheo-loi-dieu-phoi-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mot_nguon_ten
  verified_at: 2026-11-14T14:17:37Z
  output: |
    GN Results: 6 passed, 0 failed

- eval: E10
  run_id: minted-goi-cheo-loi-dieu-phoi-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goi_cheo_chieu_do
  verified_at: 2026-11-14T14:17:37Z
  output: |
    goi-cheo chieu-do: 8 passed, 0 failed

- eval: E11
  run_id: bw0mrqcj6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-11-14T14:17:37Z
  output: |
    Results: all plugin tests passed

- eval: E12
  run_id: minted-goi-cheo-loi-dieu-phoi-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi
  verified_at: 2026-11-14T14:17:37Z
  output: |
    ok 69 - DP1-01 cai-la-du|ok 70 - DP1-01-do doi-ten-tep|ok 71 - DP1-01-do dao-lenh|ok 72 - DP1-02 chieu-im|ok 73 - DP1-02 ngoai-git|    ok 1 - DP1-02-duong chan-s4|    ok 2 - DP1-02-duong nhip|    ok 3 - DP1-02-duong cho-nguoi|    ok 4 - DP1

- eval: E13
  run_id: minted-goi-cheo-loi-dieu-phoi-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-11-14T14:17:37Z
  output: |
    Results: 47 passed, 0 failed (tin-hieu)

- eval: E14
  run_id: minted-goi-cheo-loi-dieu-phoi-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cua_tin_hieu_giua_chien_dich
  verified_at: 2026-11-14T14:17:37Z
  output: |
    Results: 43 passed, 0 failed

- eval: E15
  run_id: minted-goi-cheo-loi-dieu-phoi-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cua_tin_hieu_goc_moi_worktree
  verified_at: 2026-11-14T14:17:37Z
  output: |
    Results: 21 passed, 0 failed

- eval: E17
  run_id: minted-goi-cheo-loi-dieu-phoi-E17-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cqt_rt13
  verified_at: 2026-11-14T14:17:37Z
  output: |
    PASS: [RT13] đọc-cũ: broken rỗng, khác biệt đúng khối; hồ sơ sinh sau mốc: 247 (ngoài phép so; 27 dòng khai của chúng không còn dùng)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-goi-cheo-loi-dieu-phoi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-14T14:17:37Z

## Known limits

## Ngoài hợp đồng

## Analyst

Non-discriminating (xanh ở cả cây đang kiểm lẫn baseline):
- E13 (node tests/scripts/tin-hieu.test.mjs): baseline green — regression-guard có chủ ý hoặc cần viết lại để assert hành vi mới.

Baseline khong do:
- node _acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs: bo qua baseline: tep _acceptance/goi-cheo-loi-dieu-phoi/rang/vi-phan-cu.mjs co o cay dang kiem nhung chua co o merge-base 593e68376006cf8b036f167b805048a5f1692c3c — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs: bo qua baseline: tep _acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs co o cay dang kiem nhung chua co o merge-base 593e68376006cf8b036f167b805048a5f1692c3c — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/mot-nguon-ten-va-hop-thu.test.mjs: bo qua baseline: tep tests/scripts/mot-nguon-ten-va-hop-thu.test.mjs co o cay dang kiem nhung chua co o merge-base 593e68376006cf8b036f167b805048a5f1692c3c — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs --chieu-do: bo qua baseline: tep _acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs co o cay dang kiem nhung chua co o merge-base 593e68376006cf8b036f167b805048a5f1692c3c — eval moi, chay tren code cu khong phan biet gi
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP1-|^ *not ok|^# (pass|fail|skipped|todo) " | paste -sd"|" -': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs: baseline vuot tran 10 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- RT_CASES=RT13 node tests/plugins/ra-co-ten.test.mjs: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy xanh, nhưng phát hiện trong hợp đồng làm AC-1 (VP-HT đỏ nhờ nhát tiêm lệch, không ghim thông điệp) và AC-8 (BC-8 xanh khi script sập vì lỗi khác; kỳ vọng E8 không khớp đầu ra thật, vế bố cục cũ không được đo) chưa được chứng minh. Chi tiết ở review-findings.md. Returned to implementation.
