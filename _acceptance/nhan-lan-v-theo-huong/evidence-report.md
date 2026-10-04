---
schema_version: 2
feature_slug: nhan-lan-v-theo-huong
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 98aa7282f3d6d8ed03f14981d48ecce6aa753b90
human_signoff:
---

# Evidence Report: nhan-lan-v-theo-huong

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nhan-lan-v-theo-huong-E1-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_the
  verified_at: 2026-10-04T13:52:07Z
  output: |
    Results: 6 passed, 0 failed (nlvh-the)

- eval: E2
  run_id: minted-nhan-lan-v-theo-huong-E2-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_the
  verified_at: 2026-10-04T13:52:07Z
  output: |
    Results: 6 passed, 0 failed (nlvh-the)

- eval: E3
  run_id: minted-nhan-lan-v-theo-huong-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_im
  verified_at: 2026-10-04T13:52:07Z
  output: |
    Results: 2 passed, 0 failed (nlvh-the)

- eval: E4
  run_id: minted-nhan-lan-v-theo-huong-E4-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_the
  verified_at: 2026-10-04T13:52:07Z
  output: |
    Results: 6 passed, 0 failed (nlvh-the)

- eval: E5
  run_id: minted-nhan-lan-v-theo-huong-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_luat
  verified_at: 2026-10-04T13:52:07Z
  output: |
    Results: 5 passed, 0 failed (nlvh-the)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nhan-lan-v-theo-huong-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-04T13:52:07Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E5 failed — lệnh đo ghép cuối bằng bộ lọc ONLY_BLOCK nhưng khối P192 là khối viết thẳng, không đi qua run(), nên bộ lọc không khớp khối nào và suite tự đỏ dù khối P192 xanh. Hai mảnh suite mjs:2/3 và mjs:3/3 cũng đỏ mà không gắn eval nào. Returned to implementation.
Round 2: toàn bộ E1–E5 và mọi lệnh suite xanh ở commit 98aa7282 — E5 nay chạy nguyên văn bộ kiểm P192 thay cho bộ lọc ONLY_BLOCK; hai ca chiều im cũ neo commit cố định; các mảnh suite hết đỏ.
