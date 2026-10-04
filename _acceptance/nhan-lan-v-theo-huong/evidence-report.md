---
schema_version: 2
feature_slug: nhan-lan-v-theo-huong
verdict: REJECT
failed_evals: [E5]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 15186c2fa5b05736eca42e84633e642076628f71
human_signoff:
---

# Evidence Report: nhan-lan-v-theo-huong

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | FAIL |

## Evidence

- eval: E1
  run_id: minted-nhan-lan-v-theo-huong-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_the
  verified_at: 2026-10-04T13:11:45Z
  output: |
    Results: 6 passed, 0 failed (nlvh-the)

- eval: E2
  run_id: minted-nhan-lan-v-theo-huong-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_the
  verified_at: 2026-10-04T13:11:45Z
  output: |
    Results: 6 passed, 0 failed (nlvh-the)

- eval: E3
  run_id: minted-nhan-lan-v-theo-huong-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_im
  verified_at: 2026-10-04T13:11:45Z
  output: |
    Results: 2 passed, 0 failed (nlvh-the)

- eval: E4
  run_id: minted-nhan-lan-v-theo-huong-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.nlvh_the
  verified_at: 2026-10-04T13:11:45Z
  output: |
    Results: 6 passed, 0 failed (nlvh-the)

- eval: E5
  run_id: minted-nhan-lan-v-theo-huong-E5-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.nlvh_luat
  verified_at: 2026-10-04T13:11:45Z
  output: |
    ONLY_BLOCK=P192 round-trip khong khop khoi nao — go sai ten? (fail de khong xanh gia)
    Results: 1 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-04T13:11:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-04T13:11:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-10-04T13:11:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-10-04T13:11:45Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-04T13:11:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-04T13:11:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-04T13:11:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-04T13:11:45Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nhan-lan-v-theo-huong-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-04T13:11:45Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nhan-lan-v-theo-huong-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-04T13:11:45Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E5 failed — lệnh đo ghép cuối bằng ONLY_BLOCK="P192 round-trip" nhưng khối P192 là khối viết thẳng, không đi qua run(), nên bộ lọc không khớp khối nào và suite tự đỏ dù khối P192 xanh; phần NL-AC5-luat chạy riêng của cùng lệnh không phải nguyên nhân. Hai mảnh suite mjs:2/3 (22 passed, 1 failed) và mjs:3/3 cũng thoát khác 0 mà không gắn eval nào; phần đuôi đầu ra đã bắt không nêu tên ca đỏ nên nguyên nhân chưa xác định ở vòng này. Returned to implementation (chủ vòng chọn mở vòng nhỏ sửa ngay).
