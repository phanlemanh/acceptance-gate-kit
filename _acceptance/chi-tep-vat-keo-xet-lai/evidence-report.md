---
schema_version: 2
feature_slug: chi-tep-vat-keo-xet-lai
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fa91d347f933e77fe6a9a89e924dad0117e59ff2
human_signoff: Manh Phan 2026-11-01
---

# Evidence Report: chi-tep-vat-keo-xet-lai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-chi-tep-vat-keo-xet-lai-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e1
  verified_at: 2026-11-01T03:02:02Z
  output: |
    Results: 3 passed, 0 failed

- eval: E2
  run_id: minted-chi-tep-vat-keo-xet-lai-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e2
  verified_at: 2026-11-01T03:02:02Z
  output: |
    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-chi-tep-vat-keo-xet-lai-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e3
  verified_at: 2026-11-01T03:02:02Z
  output: |
    Results: 1 passed, 0 failed

- eval: E4
  run_id: minted-chi-tep-vat-keo-xet-lai-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e4
  verified_at: 2026-11-01T03:02:02Z
  output: |
    Results: 2 passed, 0 failed

- eval: E5
  run_id: minted-chi-tep-vat-keo-xet-lai-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e5
  verified_at: 2026-11-01T03:02:02Z
  output: |
    Results: 1 passed, 0 failed

- eval: E6
  run_id: minted-chi-tep-vat-keo-xet-lai-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e6
  verified_at: 2026-11-01T03:02:02Z
  output: |
    Results: 1 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-11-01T03:02:02Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay

Baseline khong do: evals.yaml không đổi từ lần baseline cuối, nên mọi eval ghi baseline n-a.

Eval không-phân-biệt: none. Các lệnh suite xanh cả hai phía là regression-guard bình thường, không liệt kê.

## Variance

none — mọi eval chạy một lần, không eval nào có pass_rate lẫn.

## Iterations

Round 1-2: xem sổ lượt chấm trong decisions.jsonl của hồ sơ.
Round 3: sáu eval E1-E6 và mười hai lệnh suite đều xanh trên cây đã ghim; không có eval hỏng, không có mục chờ người.
