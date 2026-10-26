---
schema_version: 2
feature_slug: danh-thuc-doc-nhip-dung-ma
verdict: REJECT
failed_evals: ["E9b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a8005f86c9a435dcc4064e978c2d6d0f1539155b
human_signoff:
---

# Evidence Report: danh-thuc-doc-nhip-dung-ma

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
| E9b | AC-9 | test | FAIL |

## Evidence

- eval: E1
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (đuôi đầu ra của lệnh chung E1–E9, bị cắt ở giới hạn đuôi; tập dòng TC1-* ok do lệnh lọc, không phải toàn bộ log)

- eval: E2
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (cùng lệnh chung E1–E9; đuôi bị cắt)

- eval: E3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (cùng lệnh chung E1–E9; đuôi bị cắt)

- eval: E4
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    (cùng lệnh chung E1–E9; đuôi bị cắt)

- eval: E5
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    #   số hàng: 3
    (cùng lệnh chung E1–E9; đuôi bị cắt)

- eval: E6
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    (cùng lệnh chung E1–E9; đuôi bị cắt)

- eval: E7
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (cùng lệnh chung E1–E9; đuôi bị cắt)

- eval: E8
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    (cùng lệnh chung E1–E9; đuôi bị cắt, không còn dòng TC1-08 trong đoạn đuôi)

- eval: E9
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T02:41:14Z
  output: |
    (cùng lệnh chung E1–E9; đuôi bị cắt, không còn dòng tổng kết TAP trong đoạn đuôi)

- eval: E9b
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E9b-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1_hai_moi_truong
  verified_at: 2026-10-26T02:41:14Z
  output: |
    sạch: 570 ok · 0 not ok · mã 0
    giả: 569 ok · 1 not ok · mã 1
    LỖI giả: not ok 428 - DP3-05-do ghi-khi-thoi
    LỖI chỉ xanh khi sạch: DP3-05-do ghi-khi-thoi
    hai-moi-truong: ĐỎ

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-10-26T02:41:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-26T02:41:14Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»

Eval không-phân-biệt (xanh ở cả HEAD lẫn baseline): không đo được ở round này vì baseline BLOCKED hạ tầng; mọi trường baseline là n-a, báo cáo không khẳng định eval nào đỏ hay xanh trên mã cũ.

### Baseline khong do

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - TC1-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- node tests/dieu-phoi/hai-moi-truong.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»

### Lệnh đỏ không gắn eval

- `node tests/dieu-phoi/hai-moi-truong.mjs` đỏ, thuộc E9b (đã tính vào failed_evals).
- `bash tests/scripts/run-tests.sh --manh mjs:1/3` đỏ và KHÔNG gắn eval nào: kết quả cuối «Results: 37 passed, 1 failed». Đoạn đuôi đã lưu không cho thấy tên ca đỏ (chỉ thấy các ca TD-9 và xem-trang-lo-trinh đều đạt), nên chưa xác định được ca nào hỏng; cần đọc lại log đầy đủ của lệnh này trước khi sửa.

## Variance

none — every multi-run eval is uniform (mọi eval runs: 1, không eval nào có variance)

## Iterations

Round 1: E9b failed — script hai-moi-truong chạy suite tests/dieu-phoi hai lần: môi trường sạch 570 ok, 0 not ok; môi trường cha mang hai biến giả local_x / y có 569 ok, 1 not ok, ca «DP3-05-do ghi-khi-thoi» chỉ xanh khi sạch. Ngoài ra lệnh suite `--manh mjs:1/3` đỏ (37 passed, 1 failed), chưa gắn eval. Returned to implementation.
