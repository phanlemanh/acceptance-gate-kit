---
schema_version: 2
feature_slug: vong-mo-khong-mat-dau
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ffc16ee96ec252e894035b1bccdc63fe683118cf
human_signoff:
---

# Evidence Report: vong-mo-khong-mat-dau

Round 1. Cả 11 eval máy (E1–E10, E9b) đều chạy xong và đạt. Verdict REJECT vì hai lệnh suite hồi quy không gắn eval nào chạy ra kết quả hỏng (xem «Lệnh suite» và mục Analyst), và vì review có 4 finding trong hợp đồng (xem review-findings.md).

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

- eval: E1
  run_id: minted-vong-mo-khong-mat-dau-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    #   GD-01: 3 hàng
    #     (a) đã đến sống qua đồng bộ · canh 0 · trong khe · nấc 2 da-den · canh 0 · bắt đầu đọc 1792420576569 < ghi 1792420576579…1792420576666 < trả về 1792420578074 · nấc 2 da-den

- eval: E2
  run_id: minted-vong-mo-khong-mat-dau-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1 — lệnh gd chạy một lần cho E1–E8 và E10; đuôi in ra dừng ở GD-01)

- eval: E3
  run_id: minted-vong-mo-khong-mat-dau-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1; đuôi in ra dừng ở GD-01)

- eval: E4
  run_id: minted-vong-mo-khong-mat-dau-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1; đuôi in ra dừng ở GD-01)

- eval: E5
  run_id: minted-vong-mo-khong-mat-dau-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1; đuôi in ra dừng ở GD-01)

- eval: E6
  run_id: minted-vong-mo-khong-mat-dau-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1; đuôi in ra dừng ở GD-01)

- eval: E7
  run_id: minted-vong-mo-khong-mat-dau-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1; đuôi in ra dừng ở GD-01)

- eval: E8
  run_id: minted-vong-mo-khong-mat-dau-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1; đuôi in ra dừng ở GD-01)

- eval: E9
  run_id: minted-vong-mo-khong-mat-dau-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1; đuôi in ra dừng ở GD-01)

- eval: E9b
  run_id: minted-vong-mo-khong-mat-dau-E9b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin
  verified_at: 2026-10-19T14:35:36Z
  output: |
    #   GT-04: 11 hàng
    #     (a) · vòng MBP-1710-1 vẫn chua-den · "chua-den"
    #     (b) · không khẩu lệnh · {"cu":true}
    #     (c) · null · null
    #     (d) · NHẬN · "NHẬN"
    #     (e) · HUỶ · "HUỶ"
    #     (f) · cu: true ·

- eval: E10
  run_id: minted-vong-mo-khong-mat-dau-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tin_gd
  verified_at: 2026-10-19T14:35:36Z
  output: |
    (cùng một lượt chạy với E1; đuôi in ra dừng ở GD-01)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: Results: 839 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: Results: 36 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: Results: 36 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: Results: 35 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: Results: 71 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-19T14:35:36Z
  output: |
    FAIL: P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)
    FAIL: P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)
    Results: 2 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-vong-mo-khong-mat-dau-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-vong-mo-khong-mat-dau-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-10-19T14:35:36Z
  output: |
    PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .
    LO-TRINH.html lệch với tệp ý định và hồ sơ — chạy: node scripts/product-map.mjs --root .

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-vong-mo-khong-mat-dau-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-19T14:35:36Z
  output: BỎ QUA: KB — không phải lượt cắt mốc (số 2.33.0 = gốc vòng)

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào được đo là xanh ở cả hai phía: toàn bộ 11 eval feature có baseline n-a (không đo được, lý do ở mục «Baseline khong do» bên dưới), nên chưa chứng minh được chúng đỏ trên code cũ.

Lệnh fail không gắn eval (hai lệnh suite hồi quy hỏng, không eval nào khai chúng, nên failed_evals để trống):
- `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 ...'` — hai ca hỏng: P122 (bước làm mới bản đồ nằm sau bước ghi field cổng) và P126 (PRODUCT-MAP.md miễn trừ t1 và --check cảnh thật).
- `node scripts/product-map.mjs --root . --check` — PRODUCT-MAP.md và LO-TRINH.html lệch với hồ sơ; hai lệnh này cùng một nguyên nhân gốc (bản đồ sản phẩm chưa được làm mới sau khi hồ sơ vòng đổi).

Mốc thời gian: verified_at của E1–E8, E9, E10 lấy từ mốc đồng hồ chính lượt chạy in ra; E9b và các lệnh suite chỉ chính xác đến ngày.

### Baseline khong do

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/tin-khong-mat-dau.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - GD-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': bo qua baseline: tep tests/dieu-phoi/tin-khong-mat-dau.test.mjs co o cay dang kiem nhung chua co o merge-base 33c9e64fda216f4904271b4a6fe680822aa21854 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/tin.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - GT-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, tất định)

## Iterations

Round 1: không eval nào hỏng, nhưng hai lệnh suite hồi quy không gắn eval (plugins vung:1 với P122 và P126; product-map --check) hỏng và review có 4 finding trong hợp đồng; verdict REJECT, trả về xưởng để làm mới bản đồ sản phẩm và siết các hàng đo bị nêu.
