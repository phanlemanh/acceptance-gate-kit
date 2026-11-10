---
schema_version: 2
feature_slug: doc-jsx-va-ban-do-hong
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d9e75e2fb3d749916399b1cc3dd864b7827868bf
human_signoff:
---

# Evidence Report: doc-jsx-va-ban-do-hong

Tám eval của tính năng đều xanh, nhưng ba lệnh suite hồi quy đỏ và không gắn eval nào (xem mục «Lệnh suite đỏ không gắn eval»), nên kết luận là REJECT.

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
  run_id: minted-doc-jsx-va-ban-do-hong-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T07:11:17Z
  output: |
    PASS: [DJ-8-do]

- eval: E2
  run_id: minted-doc-jsx-va-ban-do-hong-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T07:11:17Z
  output: |
    PASS: [DJ-8-do]

- eval: E3
  run_id: minted-doc-jsx-va-ban-do-hong-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T07:11:17Z
  output: |
    PASS: [DJ-8-do]

- eval: E4
  run_id: minted-doc-jsx-va-ban-do-hong-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T07:11:17Z
  output: |
    PASS: [DJ-8-do]

- eval: E5
  run_id: minted-doc-jsx-va-ban-do-hong-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T07:11:17Z
  output: |
    PASS: [DJ-8-do]

- eval: E6
  run_id: minted-doc-jsx-va-ban-do-hong-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T07:11:17Z
  output: |
    PASS: [DJ-8-do]

- eval: E7
  run_id: minted-doc-jsx-va-ban-do-hong-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T07:11:17Z
  output: |
    PASS: [DJ-8-do]

- eval: E8
  run_id: minted-doc-jsx-va-ban-do-hong-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.doc_jsx_va_ban_do_hong
  verified_at: 2026-11-10T07:11:17Z
  output: |
    PASS: [DJ-8-do]

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-10T07:11:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-11-10T07:11:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-10T07:11:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-10T07:11:17Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-10T07:11:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-11-10T07:11:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: bzt56c33e
  exit_code: 0
  verified_at: 2026-11-10T07:11:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-10T07:11:17Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-10T07:11:17Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-11-10T07:11:17Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-doc-jsx-va-ban-do-hong-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-10T07:11:17Z

### Lệnh suite đỏ không gắn eval

Ba lệnh sau đỏ và không gắn eval nào nên không vào failed_evals, nhưng chúng là lý do của kết luận REJECT:

- bash tests/scripts/run-tests.sh --manh mjs:1/3: tổng kết 42 qua, 1 đỏ.
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 ...': hai ca đỏ, P122 (bước làm mới bản đồ nằm sau bước ghi field cổng, hai harness và plugin-root) và P126 (PRODUCT-MAP.md miễn trừ t1, --check cảnh thật, có trong CI, có ADR).
- node scripts/product-map.mjs --root . --check: PRODUCT-MAP.md và LO-TRINH.html lệch với hồ sơ xưởng; cách chạy lại ghi trong đầu ra của lệnh.

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh ở cả hai phía, vì baseline không đo được cho eval mới.

Baseline khong do
- node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs: bo qua baseline: tep tests/scripts/doc-jsx-va-ban-do-hong.test.mjs co o cay dang kiem nhung chua co o merge-base c8fa5a65588609b622dc83a9b114d65d2bdc5b47 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào đỏ, nhưng ba lệnh suite hồi quy đỏ (mjs:1/3, plugins vung:1, product-map --check) — verdict REJECT. Returned to implementation.
