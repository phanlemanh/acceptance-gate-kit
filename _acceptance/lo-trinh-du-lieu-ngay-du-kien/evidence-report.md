---
schema_version: 2
feature_slug: lo-trinh-du-lieu-ngay-du-kien
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a17debfd8202e37baf5d55c9b62dfddac5dbef67
human_signoff:
---

# Evidence Report: lo-trinh-du-lieu-ngay-du-kien

Tóm tắt: cả tám eval của hợp đồng (E1–E8) đều xanh, nhưng vòng bị REJECT vì MỘT lệnh suite hồi quy không gắn eval nào đã đỏ: `tests/plugins/run-tests.sh --manh vung:1`, ca P93 «mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)». `failed_evals` để rỗng vì không eval nào của hợp đồng đỏ; lệnh đỏ là lệnh suite (xem khối «Lệnh suite (hồi quy)» và mục Iterations). Vật chưa chứng được là «không làm gãy phần còn lại của kho», nên máy không cho qua.

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

## Evidence

- eval: E1
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  output: |
    Results: 26 passed, 0 failed

- eval: E2
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  output: |
    Results: 26 passed, 0 failed

- eval: E4
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  output: |
    Results: 26 passed, 0 failed

- eval: E5
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  output: |
    Results: 26 passed, 0 failed

- eval: E6
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  output: |
    Results: 26 passed, 0 failed

- eval: E7
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  output: |
    Results: 26 passed, 0 failed

- eval: E8
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_du_lieu_ngay
  verified_at: 2026-10-16T06:34:18Z
  output: |
    Results: 26 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-16T06:34:18Z
  output: |
    FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    Results: 1 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-lo-trinh-du-lieu-ngay-du-kien-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-16T06:34:18Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh-cả-hai-phía được đo: cả tám eval feature (E1–E8) có baseline n-a vì là eval mới (xem «Baseline khong do»), nên chưa chứng được chúng đỏ trên code cũ.

Lệnh fail không gắn eval: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 ...'` — đỏ ở ca P93 (bảng luật mot-nguon: khớp từng ký tự + thân khuôn và CAP MARKER duy nhất toàn kho). Đây là nguyên nhân của REJECT; chưa truy nguyên xem lệch do vật của vòng này hay do nền.

### Baseline khong do

- node tests/scripts/lo-trinh-du-lieu-ngay.test.mjs: bo qua baseline: tep tests/scripts/lo-trinh-du-lieu-ngay.test.mjs co o cay dang kiem nhung chua co o merge-base 31c5b8dfe174ed3bca55607ce985603ac32d8d6d — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E8 đều xanh; lệnh suite vung:1 (ca P93 mot-nguon) đỏ và không gắn eval nào nên `failed_evals` rỗng. Verdict REJECT. Returned to implementation.
