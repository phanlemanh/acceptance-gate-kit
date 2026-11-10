---
schema_version: 2
feature_slug: lenh-cho-khoa-nhay-duong-dan
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e90213eadec26276b9084df421f0d0c4646c0a42
human_signoff:
---

# Evidence Report: lenh-cho-khoa-nhay-duong-dan

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kn_dieu_phoi
  verified_at: 2026-11-10T08:10:38Z
  output: |
    # fail 0

- eval: E2
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kn_dieu_phoi
  verified_at: 2026-11-10T08:10:38Z
  output: |
    # fail 0

- eval: E3
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kn_dieu_phoi
  verified_at: 2026-11-10T08:10:38Z
  output: |
    # fail 0

- eval: E4
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kn_dieu_phoi
  verified_at: 2026-11-10T08:10:38Z
  output: |
    # fail 0

- eval: E5
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kn_dieu_phoi
  verified_at: 2026-11-10T08:10:38Z
  output: |
    # fail 0

- eval: E6
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kn_dieu_phoi
  verified_at: 2026-11-10T08:10:38Z
  output: |
    # fail 0

- eval: E7
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kn_dieu_phoi
  verified_at: 2026-11-10T08:10:38Z
  output: |
    # fail 0

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-lenh-cho-khoa-nhay-duong-dan-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-10T08:10:38Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào được đo xanh ở cả hai phía; baseline của E1..E7 không đo được (xem mục dưới).

Baseline khong do:
- bash -c 'out=$(node --test --test-reporter=tap tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - KN-|^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; [ "$(printf "%s\n" "$out" | grep -cE "^ok [0-9]+ - KN-")" -eq 25 ]': bo qua baseline: tep tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs co o cay dang kiem nhung chua co o merge-base c8fa5a65588609b622dc83a9b114d65d2bdc5b47 — eval moi, chay tren code cu khong phan biet gi

Các phát hiện ngoài phạm vi hợp đồng nằm trong review-findings.md để người quyết ở Gate 2.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1..E7 đều đạt; không có mục judgment chờ người, không có eval phương sai.
