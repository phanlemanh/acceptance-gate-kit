---
schema_version: 2
feature_slug: nen-cay-ban-dong-dau
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6d6d559c7f7aafb3371637771e78b4dc7a8c54fb
human_signoff:
---

# Evidence Report: nen-cay-ban-dong-dau

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nen-cay-ban-dong-dau-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ncb_cay_ban
  verified_at: 2026-09-24T10:11:44Z
  output: |
    PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 24 passed, 0 failed (duong-nen)

- eval: E2
  run_id: minted-nen-cay-ban-dong-dau-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ncb_cay_ban
  verified_at: 2026-09-24T10:11:44Z
  output: |
    PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 24 passed, 0 failed (duong-nen)

- eval: E3
  run_id: minted-nen-cay-ban-dong-dau-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ncb_cay_ban
  verified_at: 2026-09-24T10:11:44Z
  output: |
    PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 24 passed, 0 failed (duong-nen)

- eval: E4
  run_id: minted-nen-cay-ban-dong-dau-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ncb_cay_ban
  verified_at: 2026-09-24T10:11:44Z
  output: |
    PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 24 passed, 0 failed (duong-nen)

- eval: E5
  run_id: minted-nen-cay-ban-dong-dau-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ncb_cay_ban
  verified_at: 2026-09-24T10:11:44Z
  output: |
    PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 24 passed, 0 failed (duong-nen)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nen-cay-ban-dong-dau-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nen-cay-ban-dong-dau-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-24T10:11:44Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E5 và toàn bộ lệnh suite (bash/mjs/hooks/plugins/workflows/product-map) PASS ngay từ lượt chạy đầu tiên, không có vòng vá nào.
