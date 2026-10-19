---
schema_version: 2
feature_slug: moi-cong-khong-qua-nut
verdict: REJECT
failed_evals: ["E9b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3850d7e2d7ed3e9797fe26e7256bb46f17533325
human_signoff:
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
| E9b | AC-9 | test | REJECT |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-moi-cong-khong-qua-nut-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

- eval: E2
  run_id: minted-moi-cong-khong-qua-nut-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

- eval: E3
  run_id: minted-moi-cong-khong-qua-nut-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

- eval: E4
  run_id: minted-moi-cong-khong-qua-nut-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

- eval: E5
  run_id: minted-moi-cong-khong-qua-nut-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

- eval: E6
  run_id: minted-moi-cong-khong-qua-nut-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

- eval: E7
  run_id: minted-moi-cong-khong-qua-nut-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

- eval: E8
  run_id: minted-moi-cong-khong-qua-nut-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

- eval: E9a
  run_id: minted-moi-cong-khong-qua-nut-E9a-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.p188_moi_cong
  verified_at: 2026-10-19T15:58:37Z
  output: |
    PASS: P188 round-trip dieu khoan moi-cong: MOI site nguon khop tung ky tu (E5)

- eval: E9b
  run_id: minted-moi-cong-khong-qua-nut-E9b-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_khung
  verified_at: 2026-10-19T15:58:37Z
  output: |
    #   nhap>nhap · cheo · cheo|#   nhap>dang-chay · hop-le · hop-le|#   nhap>tam-dung · tu-choi · tu-choi|#   nhap>dang-dong · tu-choi · tu-choi|#   nhap>dang-ban-giao · tu-choi · tu-choi|#   nhap>cho-tiep-tuc · tu-choi · tu-choi|#

- eval: E10
  run_id: minted-moi-cong-khong-qua-nut-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moi_cong_khong_qua_nut
  verified_at: 2026-10-19T15:58:37Z
  output: |
    moi-cong-khong-qua-nut: 16 PASS · 0 FAIL

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-19T15:58:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-moi-cong-khong-qua-nut-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-moi-cong-khong-qua-nut-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-10-19T15:58:37Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-moi-cong-khong-qua-nut-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-19T15:58:37Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline): E9a (bash -c 'set -o pipefail; ONLY_BLOCK=P188 bash tests/plugins/run-tests.sh | grep -F P188'). E9a là regression-guard có chủ ý: điều khoản mời cổng cũ phải vẫn khớp sau khi thêm điều khoản mới.

Lệnh fail không gắn eval:
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40' — ba ca đỏ: P85b, P122, P126; dòng kết «Results: 3 failed».
- node scripts/product-map.mjs --root . --check — báo «PRODUCT-MAP.md lệch với hồ sơ xưởng»; LO-TRINH.html khớp.

Lệnh gắn eval fail: E9b (tests/dieu-phoi) — kết quả không đạt kỳ vọng «không có not ok, có DP1-07 và DP2-01, # fail 0»; đuôi đầu ra chỉ còn bảng chuyển trạng thái, không thấy dòng tổng.

### Baseline khong do

- node tests/scripts/moi-cong-khong-qua-nut.test.mjs: bo qua baseline: tep tests/scripts/moi-cong-khong-qua-nut.test.mjs co o cay dang kiem nhung chua co o merge-base 33c9e64fda216f4904271b4a6fe680822aa21854 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - (DP[0-9]+|SDT|KH)-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E9b failed — bộ kiểm tests/dieu-phoi không đạt kỳ vọng (lệnh trả mã khác không). Ngoài eval, vung:1 của bộ plugin đỏ ba ca (P85b, P122, P126) và product-map --check báo bản đồ lệch. Returned to implementation.
