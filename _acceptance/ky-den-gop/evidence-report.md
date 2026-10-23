---
schema_version: 2
feature_slug: ky-den-gop
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5e6b9480b92f9de7b993f17116fa91c9e52d0327
human_signoff:
---

# Evidence Report: ky-den-gop

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
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

Mười eval E1-E10 cùng chạy qua MỘT lệnh máy (lọc tap theo tiền tố ca C-/I-/DG-/H-/KDG- trên năm tệp ca); lệnh đó có 1/1 lượt xanh, không phương sai. Đuôi đầu ra bị cắt ở giới hạn thu thập nên khối dưới chỉ trích phần còn đọc được, không khẳng định từng dòng «ok» riêng của ca nào.

- eval: E1
  run_id: minted-ky-den-gop-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E2
  run_id: minted-ky-den-gop-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E3
  run_id: minted-ky-den-gop-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E4
  run_id: minted-ky-den-gop-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E5
  run_id: minted-ky-den-gop-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E6
  run_id: minted-ky-den-gop-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E7
  run_id: minted-ky-den-gop-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E8
  run_id: minted-ky-den-gop-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E9
  run_id: minted-ky-den-gop-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

- eval: E10
  run_id: minted-ky-den-gop-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_ky_den_gop
  verified_at: 2026-10-23T14:45:38Z
  output: |
    ok 1 - KDG-M0 đối chứng dương: bản sao chưa tiêm xanh trên cả bốn tệp ca
    ok 2 - KDG-M C chonHangKe bỏ hàm trùng → đỏ đúng C-11, C-12, C-2, C-3, C-7, C-8, C-9
    (đuôi bị cắt; lệnh chung E1-E10 thoát 0)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ky-den-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ky-den-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ky-den-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ky-den-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ky-den-gop-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ky-den-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ky-den-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ky-den-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ky-den-gop-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ky-den-gop-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ky-den-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-23T14:45:38Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào được liệt kê là xanh-cả-hai-phía; tuy vậy toàn bộ eval feature có baseline n-a nên CHƯA chứng minh được là đỏ trên code cũ (xem «Baseline khong do» ngay dưới).

Baseline khong do:
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/loi/trung-tep.test.mjs" "tests/dieu-phoi/loi/gop.test.mjs" "tests/dieu-phoi/loi/do-gop.test.mjs" "tests/workflows/pr-san-sang.test.mjs" "tests/dieu-phoi/ky-den-gop-mutants.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - (C|I|DG|H|KDG)-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': bo qua baseline: tep tests/dieu-phoi/loi/trung-tep.test.mjs co o cay dang kiem nhung chua co o merge-base 31af70d9a3a0adf3f997e570558d7034af27fd1f — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chỉ chạy một lượt (deterministic), không có eval nhiều lượt.

## Iterations

Round 1: không eval máy nào đỏ và không lệnh suite nào đỏ; phán quyết REJECT vì scope-triage xác nhận một phát hiện TRONG hợp đồng mức high thuộc AC-4 (khi gh lỗi ở nhịp có yêu cầu đang chờ, bản chụp PR tốt bị bỏ qua rồi bị ghi đè bằng bản rỗng — chi tiết ở review-findings.md, mục «Trong hợp đồng»). Returned to implementation.
