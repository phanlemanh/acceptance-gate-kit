---
schema_version: 2
feature_slug: t3-can-ho-so-arm
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a8187b794d5db92fcfee0482da66511a9e48bcfa
human_signoff:
---

# Evidence Report: t3-can-ho-so-arm

Cả chín eval máy đều xanh và các lệnh suite đều xanh. Verdict tổng là REJECT vì vòng review còn một finding trong hợp đồng mức high (AC-3: tám dạng lý do chặn nhưng chỉ sáu đột biến). Chi tiết ở review-findings.md.

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
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-t3-can-ho-so-arm-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e1
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA1-do HA18-mut
    Results: 2 passed, 0 failed

- eval: E2
  run_id: minted-t3-can-ho-so-arm-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e2
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA2-do HA17-mut
    Results: 2 passed, 0 failed

- eval: E3
  run_id: minted-t3-can-ho-so-arm-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e3
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA3-do HA4-do HA5-do HA6-do HA20-do HA21-do HA22-do HA23-do HA3-mut HA4-mut HA5-mut HA6-mut HA20-mut HA21-mut
    Results: 14 passed, 0 failed

- eval: E4
  run_id: minted-t3-can-ho-so-arm-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e4
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA7-im HA8-im HA9-im HA10-im HA25-im HA26-im
    Results: 6 passed, 0 failed

- eval: E5
  run_id: minted-t3-can-ho-so-arm-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e5
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA11-im HA12-im HA13-im
    Results: 3 passed, 0 failed

- eval: E6
  run_id: minted-t3-can-ho-so-arm-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e6
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA14-im HA19-mut HA24-do
    Results: 3 passed, 0 failed

- eval: E7
  run_id: minted-t3-can-ho-so-arm-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e7
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA15-im HA16-im
    Results: 2 passed, 0 failed

- eval: E8
  run_id: minted-t3-can-ho-so-arm-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e8
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: node _acceptance/t3-can-ho-so-arm/rang/vi-phan-kho.mjs
    vi-phan-kho: XANH — moi PR doc duoc khop ket qua da chot

- eval: E9
  run_id: minted-t3-can-ho-so-arm-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e9
  verified_at: 2026-11-09T23:39:53Z
  output: |
    cmd: bash _acceptance/t3-can-ho-so-arm/rang/chieu-do.sh
    chieu-do: XANH — 11 ca -do deu do dung kieu tren v2.38.0, GPM13 con du hai phep kiem

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-t3-can-ho-so-arm-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-t3-can-ho-so-arm-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-09T23:39:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Ghi chú trung thực: không eval nào có baseline đo được (cả chín đều n-a), nên câu trên chỉ nghĩa là máy không phát hiện eval xanh-cả-hai-phía; không chứng minh được eval nào đỏ trên code cũ.

### Baseline khong do

- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA1-do HA18-mut: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA2-do HA17-mut: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA3-do HA4-do HA5-do HA6-do HA20-do HA21-do HA22-do HA23-do HA3-mut HA4-mut HA5-mut HA6-mut HA20-mut HA21-mut: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA7-im HA8-im HA9-im HA10-im HA25-im HA26-im: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA11-im HA12-im HA13-im: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA14-im HA19-mut HA24-do: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA15-im HA16-im: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/t3-can-ho-so-arm/rang/vi-phan-kho.mjs: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/vi-phan-kho.mjs co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chieu-do.sh: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chieu-do.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval máy nào đỏ; REJECT vì finding trong hợp đồng mức high ở AC-3 (tám dạng lý do chặn, chỉ sáu đột biến; hai nhánh thiếu trường không có ca). Trả về triển khai.
