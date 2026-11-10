---
schema_version: 2
feature_slug: t3-can-ho-so-arm
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 11647061190ab021d1a3d62c720ad041de759032
human_signoff:
---

# Evidence Report: t3-can-ho-so-arm

Round 2. Mọi eval tính năng đạt (E8 mang từ round 1); verdict REJECT vì một lệnh suite không gắn eval không đạt ở phần Lệnh suite bên dưới.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS (carry-forward từ round 1) |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-t3-can-ho-so-arm-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e1
  verified_at: 2026-11-10T02:27:53Z
  output: |
    Results: 2 passed, 0 failed

- eval: E2
  run_id: minted-t3-can-ho-so-arm-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e2
  verified_at: 2026-11-10T02:27:53Z
  output: |
    Results: 2 passed, 0 failed

- eval: E3
  run_id: minted-t3-can-ho-so-arm-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e3
  verified_at: 2026-11-10T02:27:53Z
  output: |
    Results: 23 passed, 0 failed

- eval: E4
  run_id: minted-t3-can-ho-so-arm-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e4
  verified_at: 2026-11-10T02:27:53Z
  output: |
    Results: 6 passed, 0 failed

- eval: E5
  run_id: minted-t3-can-ho-so-arm-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e5
  verified_at: 2026-11-10T02:27:53Z
  output: |
    Results: 3 passed, 0 failed

- eval: E6
  run_id: minted-t3-can-ho-so-arm-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e6
  verified_at: 2026-11-10T02:27:53Z
  output: |
    Results: 3 passed, 0 failed

- eval: E7
  run_id: minted-t3-can-ho-so-arm-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e7
  verified_at: 2026-11-10T02:27:53Z
  output: |
    Results: 2 passed, 0 failed

- eval: E8
  run_id: minted-t3-can-ho-so-arm-E8-r1
  exit_code: 0
  verifier: config:executors.script.t3ha_e8
  verified_at: 2026-11-09T23:39:53Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-t3-can-ho-so-arm-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.t3ha_e9
  verified_at: 2026-11-10T02:27:53Z
  output: |
    chieu-do: XANH — 12 ca -do deu do dung kieu tren v2.38.0, GPM13 con du hai phep kiem

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-11-10T02:27:53Z
  note: lệnh suite không gắn eval nào, không đạt. Dòng lỗi cuối đầu ra là P179 [MBC] E6 ledger known-limits (đếm từ corpus, bắt biến hằng, quan hệ); MUTANT-6 bị bắt vì doc_manifest() ghim «site thieu so ban: feature-loop/skills/feature-loop/SKILL.md»; tổng kết 1 ca hỏng.

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-t3-can-ho-so-arm-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-t3-can-ho-so-arm-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-t3-can-ho-so-arm-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-10T02:27:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval tính năng nào đo được là green trên baseline; E1 đến E7 và E9 đều ở trạng thái n-a (lý do ở mục dưới), E8 mang từ round 1 không đo baseline lại.

Baseline khong do
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA1-do HA18-mut: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA2-do HA17-mut: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA3-do HA4-do HA5-do HA6-do HA20-do HA21-do HA22-do HA23-do HA32-bien HA33-do HA3-mut HA4-mut HA5-mut HA6-mut HA20-mut HA21-mut HA22-mut HA23-mut HA32-mut HA33-mut HA34-mut HA35-mut HA36-bang: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA7-im HA8-im HA9-im HA10-im HA25-im HA26-im: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA11-im HA12-im HA13-im: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA14-im HA19-mut HA24-do: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA15-im HA16-im: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/t3-can-ho-so-arm/rang/chieu-do.sh: bo qua baseline: tep _acceptance/t3-can-ho-so-arm/rang/chieu-do.sh co o cay dang kiem nhung chua co o merge-base d44c8abd740dd9cdf860ceb64f2ede59619830df — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E8 đạt (run_id minted-t3-can-ho-so-arm-E8-r1); các eval còn lại xem run-log.
Round 2: E1 đến E7 và E9 đạt; E8 mang từ round 1. Lệnh suite vung:3 của tests/plugins không đạt (ca P179 E6 ledger known-limits), không gắn eval nào. Trả về triển khai.
