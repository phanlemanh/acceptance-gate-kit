---
schema_version: 2
feature_slug: trao-vai-va-do-sau-gop
verdict: REJECT
failed_evals: ["E1","E2","E3","E4","E5","E6","E7","E8b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1ea1bad8f41d75c67be3a45ecfa62aa08f48be07
human_signoff:
---

# Evidence Report: trao-vai-va-do-sau-gop

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | FAIL |
| E4 | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | FAIL |
| E8 | AC-8 | test | PASS |
| E8b | AC-8 | test | FAIL |

## Evidence

- eval: E1
  run_id: minted-trao-vai-va-do-sau-gop-E1-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1b
  verified_at: 2026-10-26T11:37:40Z
  output: |
    Lệnh gộp của cả suite tests/dieu-phoi thoát khác 0 (một lệnh chung cho E1–E7 và E8b).
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (đuôi đầu ra bị cắt trước dòng tổng kết TAP; không thấy dòng «not ok» nào trong đoạn đuôi này)

- eval: E2
  run_id: minted-trao-vai-va-do-sau-gop-E2-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1b
  verified_at: 2026-10-26T11:37:40Z
  output: |
    Lệnh gộp của cả suite tests/dieu-phoi thoát khác 0 (một lệnh chung cho E1–E7 và E8b).
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E3
  run_id: minted-trao-vai-va-do-sau-gop-E3-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1b
  verified_at: 2026-10-26T11:37:40Z
  output: |
    Lệnh gộp của cả suite tests/dieu-phoi thoát khác 0 (một lệnh chung cho E1–E7 và E8b).
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E4
  run_id: minted-trao-vai-va-do-sau-gop-E4-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1b
  verified_at: 2026-10-26T11:37:40Z
  output: |
    Lệnh gộp của cả suite tests/dieu-phoi thoát khác 0 (một lệnh chung cho E1–E7 và E8b).
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E5
  run_id: minted-trao-vai-va-do-sau-gop-E5-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1b
  verified_at: 2026-10-26T11:37:40Z
  output: |
    Lệnh gộp của cả suite tests/dieu-phoi thoát khác 0 (một lệnh chung cho E1–E7 và E8b).
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E6
  run_id: minted-trao-vai-va-do-sau-gop-E6-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1b
  verified_at: 2026-10-26T11:37:40Z
  output: |
    Lệnh gộp của cả suite tests/dieu-phoi thoát khác 0 (một lệnh chung cho E1–E7 và E8b).
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E7
  run_id: minted-trao-vai-va-do-sau-gop-E7-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1b
  verified_at: 2026-10-26T11:37:40Z
  output: |
    Lệnh gộp của cả suite tests/dieu-phoi thoát khác 0 (một lệnh chung cho E1–E7 và E8b).
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E8
  run_id: minted-trao-vai-va-do-sau-gop-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1_hai_moi_truong
  verified_at: 2026-10-26T11:37:40Z
  output: |
    hai-moi-truong: XANH — cùng tập dòng ok

- eval: E8b
  run_id: minted-trao-vai-va-do-sau-gop-E8b-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc1b
  verified_at: 2026-10-26T11:37:40Z
  output: |
    Lệnh gộp của cả suite tests/dieu-phoi thoát khác 0 (một lệnh chung cho E1–E7 và E8b).
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi
    (không thấy dòng tổng kết «# fail 0» trong đuôi; E8b đòi dòng ấy nên không xác nhận được)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-trao-vai-va-do-sau-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-26T11:37:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Danh sách eval không-phân-biệt (xanh cả trên HEAD lẫn baseline): không đo được ở round này vì baseline bị chặn hạ tầng. Danh sách rỗng vì không đo, không phải vì mọi eval feature đã được xác nhận đỏ trên baseline; mọi trường baseline đều là n-a.

### Baseline khong do

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - TC1b?-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/dieu-phoi/hai-moi-truong.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Lệnh fail không gắn riêng eval nào: lệnh gộp `node --test ... "tests/dieu-phoi/**/*.test.mjs" ... | paste -sd"|" -` (bọc `set -o pipefail`) là lệnh chung của E1, E2, E3, E4, E5, E6, E7 và E8b; nó thoát khác 0 một lần nên cả tám eval cùng đỏ. Đoạn đuôi đầu ra máy giữ lại chỉ có các dòng chú thích «#   » của ma trận (số hàng 3, chi-phien-cli 7, chi-ma-app 7) và bị cắt trước mọi dòng «not ok» cũng như dòng tổng kết TAP. Vì vậy báo cáo này KHÔNG xác định được ca TC1b-nn hay TC1-nn nào đỏ, và không suy diễn nguyên nhân; E1–E7 đỏ theo cấu tạo lệnh chung chứ chưa chắc từng AC ứng với từng ca đều hỏng. Người sửa cần chạy lại lệnh không qua grep/paste để thấy tên ca đỏ. E8 (`hai-moi-truong.mjs`) chạy riêng và xanh. Mười một lệnh suite hồi quy đều xanh. Không có hội đồng chấm nào trong round này (mọi eval đều là test máy).

## Variance

none — không eval nào chạy nhiều lần (mọi eval có runs = 1, xác định); không có pass_rate hỗn hợp.

## Iterations

Round 1: E1, E2, E3, E4, E5, E6, E7, E8, E8b đều xanh ở sha 13b0e6eb; baseline bị chặn hạ tầng nên không đo được chiều đỏ trên mã cũ. S4 r1 sau đó ghi 6 phát hiện trong hợp đồng (AC-5/AC-7 chiều đỏ chưa dựng được, sha vắng chưa bỏ qua có tên) và sửa ở 1ea1bad8.
Round 2: E1, E2, E3, E4, E5, E6, E7, E8b đỏ ở sha 1ea1bad8 — lệnh gộp suite tests/dieu-phoi thoát khác 0, đuôi đầu ra bị cắt nên chưa nêu được ca đỏ; E8 xanh. Quay lại thực thi.
