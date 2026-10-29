---
schema_version: 2
feature_slug: lenh-dot-ghi-dung-hang
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1dd95c017e2be496de651b5692469ee11e70c17d
human_signoff:
---

# Evidence Report: lenh-dot-ghi-dung-hang

Vòng 1. Mười eval của hợp đồng (E1–E10) đều xanh trên cùng một lệnh. Verdict REJECT đến từ hai lệnh suite hồi quy không gắn eval nào là `tests/plugins/run-tests.sh --manh vung:2` và `--manh vung:3`. Cả hai đỏ, nên `failed_evals` để rỗng. Chi tiết ở mục «Lệnh suite (hồi quy)».

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

Cả mười eval dùng chung một lệnh máy: `bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - (TC2-|TC1-09 )|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -'`. Lệnh chạy 1 lần và thoát 0. Phần output chép dưới đây là đuôi mà bước capture giữ lại. Nó bị cắt cuối, không phải toàn bộ đầu ra.

- eval: E1
  run_id: minted-lenh-dot-ghi-dung-hang-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E2
  run_id: minted-lenh-dot-ghi-dung-hang-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E3
  run_id: minted-lenh-dot-ghi-dung-hang-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E4
  run_id: minted-lenh-dot-ghi-dung-hang-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E5
  run_id: minted-lenh-dot-ghi-dung-hang-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E6
  run_id: minted-lenh-dot-ghi-dung-hang-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E7
  run_id: minted-lenh-dot-ghi-dung-hang-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E8
  run_id: minted-lenh-dot-ghi-dung-hang-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E9
  run_id: minted-lenh-dot-ghi-dung-hang-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E10
  run_id: minted-lenh-dot-ghi-dung-hang-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T12:12:04Z
  output: |
    #   số hàng: 3|#   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat|#   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 1
  verified_at: 2026-10-29T12:12:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-29T12:12:04Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-29T12:12:04Z

Lệnh suite đỏ không gắn eval nào (hai lệnh, lý do verdict REJECT). Đuôi đầu ra là phần bước capture giữ lại.

- `--manh vung:2`: một ca đỏ, `P161 strip-md giu duong dan + ma tran toan phan`. Tổng kết «Results: 1 failed».
- `--manh vung:3`: một ca đỏ, `ca ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)`. RT13 báo hai tệp lạ chứa «signed-off»: `dieu-phoi/README.md` và `tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs`. Cách gỡ do chính ca nêu: thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH. Tổng kết «Results: 1 failed».

Vòng này chưa chứng minh hai ca đỏ ấy do vật của vòng gây ra hay có sẵn từ trước, vì baseline không đo được. Một ca đỏ như vậy vẫn chặn vòng cho tới khi người sửa hoặc khai gạch.

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval không-phân-biệt (xanh cả mã cũ lẫn mã mới): none — không eval nào được xác định là xanh-cả-hai-phía. Baseline không đo được ở round này nên không khẳng định được chiều đỏ trên mã cũ. Mọi field baseline là n-a.

Không có eval judgment nào, nên không có hội đồng chấm.

### Baseline khong do

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - (TC2-|TC1-09 )|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

## Variance

none — mọi eval chạy một lần, tất định, đồng đều.

## Iterations

Round 1: không eval hợp đồng nào đỏ (E1–E10 xanh). Hai lệnh suite hồi quy `tests/plugins/run-tests.sh --manh vung:2` (ca P161) và `--manh vung:3` (ca RT13) đỏ nên verdict REJECT. Trả về cho khâu thực hiện. Mốc `verified_at` trong báo cáo này chỉ có độ phân giải ngày. Giờ chạy thật nằm ở `run-log.jsonl`.
