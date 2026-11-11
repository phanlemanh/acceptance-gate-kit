---
schema_version: 2
feature_slug: tier-b-doc-khong-do-duoc
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 15fa55139eebd92e24b06a37e0e6bb6a2cd1a051
human_signoff: Manh Phan 2026-11-11
---

# Evidence Report: tier-b-doc-khong-do-duoc

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | judgment | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-tier-b-doc-khong-do-duoc-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tier_b_loi_doc
  verified_at: 2026-11-11T07:12:00Z
  output: |
    tier-b-loi-doc: 21 passed, 0 failed

- eval: E2
  run_id: minted-tier-b-doc-khong-do-duoc-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tier_b_loi_doc
  verified_at: 2026-11-11T07:12:00Z
  output: |
    tier-b-loi-doc: 21 passed, 0 failed

- eval: E3
  run_id: minted-tier-b-doc-khong-do-duoc-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tier_b_loi_doc
  verified_at: 2026-11-11T07:12:00Z
  output: |
    tier-b-loi-doc: 21 passed, 0 failed

- eval: E5
  run_id: minted-tier-b-doc-khong-do-duoc-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.design_eval_day_du
  verified_at: 2026-11-11T07:12:00Z
  output: |
    design-eval: 9 passed, 0 failed, 0 skipped

- eval: E6
  run_id: minted-tier-b-doc-khong-do-duoc-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tier_b_loi_doc
  verified_at: 2026-11-11T07:12:00Z
  output: |
    tier-b-loi-doc: 21 passed, 0 failed

- eval: E4
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba góc nhìn (domain-correctness, operational-feasibility, spec-alignment) cùng đọc bảng ở bước 5 và thấy hai hàng KHONG-DO-DUOC đều ghi BLOCKED, không có lối PASS.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-tier-b-doc-khong-do-duoc-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-11T07:12:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh ở cả nhánh lẫn baseline):
- E5 (`DESIGN_EVAL_CAN_DOM=1 bash tests/design-eval/run-tests.sh`): xanh trên mã cũ, giữ nguyên là regression-guard có chủ ý.

Baseline khong do:
- node tests/design-eval/tier-b-loi-doc.test.mjs: bo qua baseline: tep tests/design-eval/tier-b-loi-doc.test.mjs co o cay dang kiem nhung chua co o merge-base 6e5f402031a268b72062b16422330f2637dc0d8f — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: tất cả eval máy xanh; E4 do hội đồng đề xuất PASS, ô human_override để trống cho người quyết ở Cổng Bằng chứng.
