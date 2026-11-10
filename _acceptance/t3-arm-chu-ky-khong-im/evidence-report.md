---
schema_version: 2
feature_slug: t3-arm-chu-ky-khong-im
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 10bb3260b2bffdf40e67fd8b1241fe335af38264
human_signoff:
---

# Evidence Report: t3-arm-chu-ky-khong-im

Round 1. Cả tám eval của feature đều xanh, nhưng hai lệnh suite hồi quy không gắn eval (vung:2 và vung:3 của tests/plugins) thoát khác 0, nên verdict tính sẵn là REJECT. Chi tiết ở mục Analyst.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-t3-arm-chu-ky-khong-im-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e1
  verified_at: 2026-11-10T09:36:03Z
  output: |
    (đuôi đầu ra của lệnh chỉ có dòng kết thúc __EXIT=0)

- eval: E2
  run_id: minted-t3-arm-chu-ky-khong-im-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e2
  verified_at: 2026-11-10T09:36:03Z
  output: |
    Results: 2 passed, 0 failed

- eval: E3
  run_id: minted-t3-arm-chu-ky-khong-im-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e3
  verified_at: 2026-11-10T09:36:03Z
  output: |
    Results: 3 passed, 0 failed

- eval: E4
  run_id: minted-t3-arm-chu-ky-khong-im-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e4
  verified_at: 2026-11-10T09:36:03Z
  output: |
    Results: 5 passed, 0 failed

- eval: E5
  run_id: minted-t3-arm-chu-ky-khong-im-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e5
  verified_at: 2026-11-10T09:36:03Z
  output: |
    Results: 3 passed, 0 failed

- eval: E6
  run_id: minted-t3-arm-chu-ky-khong-im-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.t3ak_e6
  verified_at: 2026-11-10T09:36:03Z
  output: |
    Results: 5 passed, 0 failed

- eval: E7
  run_id: minted-t3-arm-chu-ky-khong-im-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e8
  verified_at: 2026-11-10T09:36:03Z
  output: |
    vi-phan-kho: XANH — moi PR doc duoc khop ket qua da chot

- eval: E8
  run_id: minted-t3-arm-chu-ky-khong-im-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.t3ak_e8
  verified_at: 2026-11-10T09:36:03Z
  output: |
    Results: 2 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 1
  verified_at: 2026-11-10T09:36:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-11-10T09:36:03Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-t3-arm-chu-ky-khong-im-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-10T09:36:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

Lệnh fail không gắn eval (lý do verdict là REJECT):
- vung:2 của tests/plugins: ca "P161 strip-md giu duong dan + ma tran toan phan" đỏ, dòng tổng kết "Results: 1 failed".
- vung:3 của tests/plugins: ca RT13 đỏ. Tệp lạ tests/scripts/t3-can-ho-so-arm.test.mjs chứa chữ "signed-off" mà RT13 không cho phép; cần thêm ca hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH. Đầu ra cũng có dòng "ca ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)" đỏ.

Hai lệnh này không gắn eval nào nên failed_evals để trống; cần sửa rồi chạy lại ở vòng sau.

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, chứng minh harness chứ không phải feature):
- bash -c 'set -e; bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA1-do HA2-do HA3-do HA4-do HA5-do HA6-do HA20-do HA24-do HA21-do HA22-do HA23-do HA32-bien HA33-do HA27-bien HA28-bien HA29-bien HA30-bien HA31-bien HA7-im HA8-im HA9-im HA10-im HA11-im HA12-im HA13-im HA14-im HA25-im HA26-im HA15-im HA16-im HA17-mut HA18-mut HA19-mut HA3-mut HA4-mut HA5-mut HA6-mut HA20-mut HA21-mut HA22-mut HA23-mut HA32-mut HA33-mut HA34-mut HA35-mut HA36-bang HA37-do HA38-do HA39-do HA40-do HA37-mut HA41-do HA41-mut HA42-do HA43-do HA42-mut HA44-im HA45-im HA46-im HA47-im HA48-bien HA49-do HA49-mut | tail -n 3; node tests/scripts/additive-only.test.mjs | tail -n 3' (E6)

Baseline khong do
- node _acceptance/t3-can-ho-so-arm/rang/vi-phan-kho.mjs: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào của feature đỏ; hai lệnh suite hồi quy (tests/plugins vung:2 và vung:3) đỏ nên verdict REJECT. Trả về giai đoạn hiện thực.
