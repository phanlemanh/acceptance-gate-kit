---
schema_version: 2
feature_slug: vong-mo-khong-mat-dau
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6c39e1b4b042ff77ca65034ffdcf8ca23a5bd8b6
human_signoff:
---

# Evidence Report: vong-mo-khong-mat-dau

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
| E9b | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

Mười eval E1–E10 cùng chạy MỘT lệnh (tệp tests/dieu-phoi/tin-khong-mat-dau.test.mjs, lọc các ca GD-); E9b chạy tests/dieu-phoi/tin.test.mjs (các ca GT-). Đuôi đầu ra dưới đây là đuôi chung của lệnh, đã lọc.

- eval: E1
  run_id: minted-vong-mo-khong-mat-dau-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    #   GD-01: 3 hàng
    #     (a) đã đến sống qua đồng bộ · trước khe nấc 1 chua-den · canh 0 · trong khe · nấc 2 da-den · trước khe nấc 1 chua-den · canh 0 · bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E2
  run_id: minted-vong-mo-khong-mat-dau-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E3
  run_id: minted-vong-mo-khong-mat-dau-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E4
  run_id: minted-vong-mo-khong-mat-dau-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E5
  run_id: minted-vong-mo-khong-mat-dau-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E6
  run_id: minted-vong-mo-khong-mat-dau-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E7
  run_id: minted-vong-mo-khong-mat-dau-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E8
  run_id: minted-vong-mo-khong-mat-dau-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E9
  run_id: minted-vong-mo-khong-mat-dau-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

- eval: E9b
  run_id: minted-vong-mo-khong-mat-dau-E9b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin
  verified_at: 2026-10-19T21:55:49Z
  output: |
    #   GT-04: 11 hàng
    #     (a) · vòng MBP-1710-1 vẫn chua-den · "chua-den"
    #     (b) · không khẩu lệnh · {"cu":true}
    #     (c) · null · null
    #     (d) · NHẬN · "NHẬN"
    #     (e) · HUỶ · "HUỶ"
    #     (f) · cu: true ·

- eval: E10
  run_id: minted-vong-mo-khong-mat-dau-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T21:55:49Z
  output: |
    (đuôi chung của lệnh phủ E1–E10) GD-01: 3 hàng · hàng (a) bắt đầu đọc 1792446966736 ≤ ghi 1792446966747

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: 839 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: 36 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: 36 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: 35 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: 71 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-vong-mo-khong-mat-dau-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z
  output: LO-TRINH.html khớp tệp ý định và hồ sơ.

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-vong-mo-khong-mat-dau-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-19T21:55:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không có eval nào được xác nhận xanh ở cả hai phía. Lưu ý: baseline KHÔNG đo được cho E1–E10 lẫn E9b (cả hai đều n-a), nên "có phân biệt" chưa được chứng minh bằng A/B ở vòng này; độ phân biệt của E1–E10 dựa vào các ca đỏ (mutant "-do") nằm trong chính bộ đo. Không có eval judgment, nên không có hội đồng chấm.

### Baseline khong do

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/tin-khong-mat-dau.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - GD-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': bo qua baseline: tep tests/dieu-phoi/tin-khong-mat-dau.test.mjs co o cay dang kiem nhung chua co o merge-base 33c9e64fda216f4904271b4a6fe680822aa21854 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/tin.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - GT-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — mọi eval chạy một lần (deterministic), không có eval ngẫu nhiên.

## Iterations

Round 1: lượt chấm đầu bị trả về — thước AC-2/7/10 thiếu đối chứng dương và chưa chạy lệnh mẫu; đã sửa, ghi sổ lượt 1.
Round 2: 11/11 eval và 12 suite xanh, nhưng quét theo lớp phát hiện các hàng âm tính của GD-01/05/07/08/09/10 còn thiếu đối chứng dương; thước đổi nên hồ sơ hạ về implemented trước lượt 3.
Round 3: 11/11 eval và 12 lệnh suite xanh trên 6c39e1b4; 2 mục ngoài hợp đồng mới (cộng 5 mục chuyển từ vòng trước) chờ Cổng Bằng chứng, xem review-findings.md.
