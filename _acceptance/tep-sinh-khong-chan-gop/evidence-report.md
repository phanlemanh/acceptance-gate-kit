---
schema_version: 2
feature_slug: tep-sinh-khong-chan-gop
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2e878dcc5e3d52cc7ec0621e4b5769290901e92c
human_signoff:
---

# Evidence Report: tep-sinh-khong-chan-gop

Round 2. Tám eval của feature đều xanh, nhưng một lệnh suite hồi quy không gắn eval nào (nhóm plugin `vung:1`) đỏ ở ca P105, nên verdict là REJECT. Chi tiết ở mục «Lệnh suite (hồi quy)» bên dưới.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-tep-sinh-khong-chan-gop-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  output: |
    node tests/scripts/tep-sinh-khong-chan-gop.test.mjs
    tep-sinh-khong-chan-gop: 15 passed, 0 failed

- eval: E2
  run_id: minted-tep-sinh-khong-chan-gop-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  output: |
    node tests/scripts/tep-sinh-khong-chan-gop.test.mjs
    tep-sinh-khong-chan-gop: 15 passed, 0 failed

- eval: E3
  run_id: minted-tep-sinh-khong-chan-gop-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  output: |
    node tests/scripts/tep-sinh-khong-chan-gop.test.mjs
    tep-sinh-khong-chan-gop: 15 passed, 0 failed

- eval: E4
  run_id: minted-tep-sinh-khong-chan-gop-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  output: |
    node tests/scripts/tep-sinh-khong-chan-gop.test.mjs
    tep-sinh-khong-chan-gop: 15 passed, 0 failed

- eval: E5
  run_id: minted-tep-sinh-khong-chan-gop-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  output: |
    node tests/scripts/tep-sinh-khong-chan-gop.test.mjs
    tep-sinh-khong-chan-gop: 15 passed, 0 failed

- eval: E6
  run_id: minted-tep-sinh-khong-chan-gop-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  output: |
    node tests/scripts/tep-sinh-khong-chan-gop.test.mjs
    tep-sinh-khong-chan-gop: 15 passed, 0 failed

- eval: E7
  run_id: minted-tep-sinh-khong-chan-gop-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  output: |
    node tests/scripts/tep-sinh-khong-chan-gop.test.mjs
    tep-sinh-khong-chan-gop: 15 passed, 0 failed

- eval: E8
  run_id: minted-tep-sinh-khong-chan-gop-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-30T03:28:28Z
  output: |
    node scripts/product-map.mjs --root . --check
    LO-TRINH.html khớp tệp ý định và hồ sơ.

### Lệnh suite (hồi quy)

Lệnh `vung:1` của nhóm plugin đỏ và không gắn eval nào. Đây là lý do verdict là REJECT dù `failed_evals` rỗng: ca P105 (ma trận phân ô trạng-thái × tình-trạng-artifact) báo hỏng, tổng kết nhóm là 1 ca hỏng. Các lệnh suite còn lại đều xanh.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 1
  verified_at: 2026-10-30T03:28:28Z
  output: |
    FAIL: P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)
    Results: 1 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-30T03:28:28Z
  output: |
    BỎ QUA: KB — không phải lượt cắt mốc (số 2.35.0 = gốc vòng)

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả cây đang đo lẫn baseline):

- E8 (`node scripts/product-map.mjs --root . --check`): baseline green, nên nó chỉ chứng minh bộ vẽ lại khớp hồ sơ trên cây hiện tại, không chứng minh hành vi mới. Là regression-guard có chủ ý hay cần viết lại để assert hành vi mới là việc người quyết.

Baseline khong do:

- node tests/scripts/tep-sinh-khong-chan-gop.test.mjs: bo qua baseline: tep tests/scripts/tep-sinh-khong-chan-gop.test.mjs co o cay dang kiem nhung chua co o merge-base 2258d144bffd8c862e24b6b25fe97efc15b0875f — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval: nhóm plugin `vung:1` (lệnh đầy đủ ở mục «Lệnh suite (hồi quy)»), ca P105 đỏ. Cần xác định P105 đỏ vì vật của vòng này hay vì thứ có sẵn trên nhánh gốc trước khi ký.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: S4 lượt 1 trả về sửa bộ quét vào phiên (bỏ qua thư mục rỗng như bản đồ, P123) và câu trích căn cứ không dấu sao (P161). Returned to implementation.
Round 2: E1–E8 đều xanh, nhưng lệnh suite nhóm plugin `vung:1` đỏ ở ca P105 (không gắn eval nào) nên verdict là REJECT. Returned to implementation.
