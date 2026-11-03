---
schema_version: 2
feature_slug: ban-do-khuon-roi-nhom
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 874b3eb67fc54d9fcab951156f56e731e6b46d44
human_signoff:
---

# Evidence Report: ban-do-khuon-roi-nhom

Vòng 1. Cả sáu eval của hợp đồng (E1–E6) đều xanh, `failed_evals` rỗng. Verdict là REJECT vì ba lệnh suite không gắn eval nào đỏ: `bash tests/scripts/run-tests.sh --manh mjs:3/3`, `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'` và `node scripts/product-map.mjs --root . --check`. Chi tiết ở mục «Lệnh suite (hồi quy)».

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ban-do-khuon-roi-nhom-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  output: |
    node tests/scripts/ban-do-khuon-roi-nhom.test.mjs (một lệnh chung cho E1, E2, E3, E4, E6)
    PASS: [RN-6]

- eval: E2
  run_id: minted-ban-do-khuon-roi-nhom-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  output: |
    node tests/scripts/ban-do-khuon-roi-nhom.test.mjs (một lệnh chung cho E1, E2, E3, E4, E6)
    PASS: [RN-6]

- eval: E3
  run_id: minted-ban-do-khuon-roi-nhom-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  output: |
    node tests/scripts/ban-do-khuon-roi-nhom.test.mjs (một lệnh chung cho E1, E2, E3, E4, E6)
    PASS: [RN-6]

- eval: E4
  run_id: minted-ban-do-khuon-roi-nhom-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  output: |
    node tests/scripts/ban-do-khuon-roi-nhom.test.mjs (một lệnh chung cho E1, E2, E3, E4, E6)
    PASS: [RN-6]

- eval: E5
  run_id: minted-ban-do-khuon-roi-nhom-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom_hai_kho
  verified_at: 2026-11-03T09:48:45Z
  output: |
    node tests/scripts/ban-do-khuon-roi-nhom-hai-kho.mjs
    PASS: RN-5 kho-thu-nhat khong-rong

- eval: E6
  run_id: minted-ban-do-khuon-roi-nhom-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ban_do_khuon_roi_nhom
  verified_at: 2026-11-03T09:48:45Z
  output: |
    node tests/scripts/ban-do-khuon-roi-nhom.test.mjs (một lệnh chung cho E1, E2, E3, E4, E6)
    PASS: [RN-6]

### Lệnh suite (hồi quy)

Ba lệnh đỏ không gắn eval: `bash tests/scripts/run-tests.sh --manh mjs:3/3` (41 passed, 1 failed; đuôi đầu ra chỉ hiện các dòng PASS nên không thấy tên ca đỏ), `bash -c '... run-tests.sh --manh vung:1 ...'` (hai ca đỏ: P122 «buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)» và P126 «PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)») và `node scripts/product-map.mjs --root . --check` (PRODUCT-MAP.md và LO-TRINH.html lệch với hồ sơ xưởng và tệp ý định). Các khối dưới ghi đúng mã thoát khác 0 của chúng.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-03T09:48:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-03T09:48:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-03T09:48:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-11-03T09:48:45Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-03T09:48:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-11-03T09:48:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-03T09:48:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-03T09:48:45Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-03T09:48:45Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-11-03T09:48:45Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ban-do-khuon-roi-nhom-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-03T09:48:45Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline): none — không eval feature nào được đo là xanh trên baseline; cả hai lệnh eval feature đều có baseline n-a (xem mục dưới).

Baseline khong do
- node tests/scripts/ban-do-khuon-roi-nhom.test.mjs: bo qua baseline: tep tests/scripts/ban-do-khuon-roi-nhom.test.mjs co o cay dang kiem nhung chua co o merge-base eab2ca4181afd8e1e6a4f3e09f7653a928ece108 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/ban-do-khuon-roi-nhom-hai-kho.mjs: bo qua baseline: tep tests/scripts/ban-do-khuon-roi-nhom-hai-kho.mjs co o cay dang kiem nhung chua co o merge-base eab2ca4181afd8e1e6a4f3e09f7653a928ece108 — eval moi, chay tren code cu khong phan biet gi

Judge: không có judgment item nào trong hợp đồng này, không có hội đồng nào được chấm.

## Variance

none — mọi eval chạy một lần (runs: 1), không eval ngẫu nhiên nào có pass_rate lẫn lộn.

## Iterations

Round 1: failed_evals rỗng (E1–E6 xanh) nhưng REJECT vì ba lệnh suite không gắn eval đỏ: mjs:3/3 (41 passed, 1 failed), plugins vung:1 (P122, P126) và product-map --check (PRODUCT-MAP.md, LO-TRINH.html lệch). Trả về implementation.
