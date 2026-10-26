---
schema_version: 2
feature_slug: danh-thuc-doc-nhip-dung-ma
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2ce931a511532284e3ace8f0924b5eb777fb6467
human_signoff:
---

# Evidence Report: danh-thuc-doc-nhip-dung-ma

Round 2. Verdict REJECT do máy tính sẵn: cả 10 eval của hợp đồng đều chạy xanh, nhưng hai lệnh suite không gắn eval nào (`mjs:1/3` và `plugins vung:3`) chạy đỏ. Danh sách `failed_evals` rỗng vì không eval nào đỏ; hai lệnh đỏ được nêu ở mục «Lệnh suite (hồi quy)» và «Analyst».

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

## Evidence

- eval: E1
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E2
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E4
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E5
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E6
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E7
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E8
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E9
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  output: |
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E9b
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E9b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1_hai_moi_truong
  verified_at: 2026-10-26T04:32:29Z
  output: |
    (đầu ra giữ lại của lệnh node tests/dieu-phoi/hai-moi-truong.mjs không có dòng nội dung nào ngoài mã thoát 0)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 1
  verified_at: 2026-10-26T04:32:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-10-26T04:32:29Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-26T04:32:29Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Mọi field baseline của round này là n-a. Vì vậy danh sách eval không-phân-biệt (xanh trên cả HEAD lẫn baseline) KHÔNG đo được ở round này; không có cơ sở để khẳng định «mọi eval feature đều đỏ trên baseline». Không eval nào được liệt kê là không-phân-biệt.

Baseline khong do:

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - TC1-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/dieu-phoi/hai-moi-truong.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Lệnh fail không gắn eval (hai lệnh này quyết định verdict REJECT, nằm ngoài danh sách `failed_evals`):

- bash tests/scripts/run-tests.sh --manh mjs:1/3: dòng cuối của đầu ra giữ lại là «Results: 37 passed, 1 failed». Tên ca đỏ không nằm trong phần đuôi đã lưu (phần đuôi chỉ cho thấy các ca TD-9 và xem-trang-lo-trinh đều đạt). run_id minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2.
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': đầu ra giữ lại có dòng «FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=» và «Results: 1 failed». run_id minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2.

Chưa quy được nguyên nhân hai lệnh đỏ về AC nào của hợp đồng; người đọc phần đuôi đầy đủ ở lần chạy lại để xác định đỏ do vật của vòng này hay do cây nền.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, tất định, không eval nào có runs > 1).

## Iterations

Round 1: E9b đỏ (script hai môi trường thấy ca cũ chập chờn dưới tải) và một finding trong hợp đồng ở AC-8 (phép đo đếm chuỗi có mặt trong tệp thay vì quan hệ theo từng dòng --phien). Returned to implementation (commit 2ce931a5: AC-8 đo theo từng dòng, script hai môi trường chạy lại ca lệch một lần).
Round 2: E1 đến E9 và E9b đều xanh, không finding trong hợp đồng. REJECT vì hai lệnh suite không gắn eval đỏ (mjs:1/3, plugins vung:3); baseline không đo được do hạ tầng. Returned to implementation.