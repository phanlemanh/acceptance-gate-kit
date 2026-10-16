---
schema_version: 2
feature_slug: cham-lai-khong-tu-doi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8e2e57f4ee362e4ea1b341121a5dbe49b6ee4bc2
human_signoff:
---

# Evidence Report: cham-lai-khong-tu-doi

Verdict REJECT, round 1. Cả chín eval của hợp đồng đều xanh, nhưng một lệnh suite hồi quy không gắn eval nào (tập vùng 1 của bộ plugin) đỏ ở ca P93. `failed_evals` để rỗng vì lệnh đỏ không thuộc eval nào; chi tiết ở mục «Lệnh suite (hồi quy)» và Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cham-lai-khong-tu-doi-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cham-lai-khong-tu-doi.test.mjs
    Results: 8 passed, 0 failed

- eval: E2
  run_id: minted-cham-lai-khong-tu-doi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cham-lai-khong-tu-doi.test.mjs
    Results: 8 passed, 0 failed

- eval: E3
  run_id: minted-cham-lai-khong-tu-doi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cham-lai-khong-tu-doi.test.mjs
    Results: 8 passed, 0 failed

- eval: E4
  run_id: minted-cham-lai-khong-tu-doi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cham-lai-khong-tu-doi.test.mjs
    Results: 8 passed, 0 failed

- eval: E5
  run_id: minted-cham-lai-khong-tu-doi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cham-lai-khong-tu-doi.test.mjs
    Results: 8 passed, 0 failed

- eval: E6
  run_id: minted-cham-lai-khong-tu-doi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cham-lai-khong-tu-doi.test.mjs
    Results: 8 passed, 0 failed

- eval: E7
  run_id: minted-cham-lai-khong-tu-doi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cham-lai-khong-tu-doi.test.mjs
    Results: 8 passed, 0 failed

- eval: E7b
  run_id: minted-cham-lai-khong-tu-doi-E7b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.cham_lai_khong_tu_doi_bo_cu
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cay-doi-trong-luot.test.mjs && node tests/scripts/ntr-thuoc.test.mjs && node tests/scripts/ghi-boi-tac-tu-cham.test.mjs
    Results: 19 passed, 0 failed (ghi-boi-tac-tu-cham)

- eval: E8
  run_id: minted-cham-lai-khong-tu-doi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cham_lai_khong_tu_doi
  verified_at: 2026-10-16T16:41:34Z
  output: |
    node tests/scripts/cham-lai-khong-tu-doi.test.mjs
    Results: 8 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-16T16:41:34Z
  output: |
    FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    Results: 1 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cham-lai-khong-tu-doi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cham-lai-khong-tu-doi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-cham-lai-khong-tu-doi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-16T16:41:34Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên nhánh lẫn trên bản trước vòng; chứng minh khung chạy chứ không chứng minh tính năng mới, giữ như lưới hồi quy có chủ ý hoặc viết lại để khẳng định hành vi mới):
- E7b: lệnh node tests/scripts/cay-doi-trong-luot.test.mjs && node tests/scripts/ntr-thuoc.test.mjs && node tests/scripts/ghi-boi-tac-tu-cham.test.mjs. Ba bộ ca sẵn có xanh trước và sau; đây là lưới hồi quy cho AC-7, còn phần phân biệt của AC-7 nằm ở E7.

Baseline khong do:
- node tests/scripts/cham-lai-khong-tu-doi.test.mjs: bo qua baseline: tep tests/scripts/cham-lai-khong-tu-doi.test.mjs co o cay dang kiem nhung chua co o merge-base b14139f796b01d1fd891d8f2bff45bb24d07aa17 — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval:
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40' (không gắn eval nào): ca P93 «mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)» đỏ. Đây là lý do duy nhất của verdict REJECT ở vòng này; chín eval của hợp đồng không đỏ. Vòng sau cần chạy lại P93 và truy nguyên xem nhánh này có làm bảng luật hay cặp marker lệch không, chưa kết luận gì ở đây.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào của hợp đồng đỏ (E1–E8, E7b xanh); lệnh suite không gắn eval là bộ plugin vùng 1 đỏ ở ca P93. Verdict REJECT, trả về triển khai để xử lý P93.
