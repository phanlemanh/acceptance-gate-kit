---
schema_version: 2
feature_slug: tep-sinh-khong-chan-gop
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: be9e6baadd2ccf2a8fd3f4393c62e5be521cdc2b
human_signoff:
---

# Evidence Report: tep-sinh-khong-chan-gop

Round 1 — tám eval của hợp đồng đều xanh, nhưng hai lệnh suite hồi quy không gắn eval nào (`tests/plugins/run-tests.sh --manh vung:1` và `--manh vung:2`) báo đỏ, nên verdict tổng là REJECT. Chi tiết ở mục «Lệnh suite (hồi quy)» và `## Analyst`.

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
  run_id: minted-tep-sinh-khong-chan-gop-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T02:22:03Z
  output: |
    tep-sinh-khong-chan-gop: 14 passed, 0 failed

- eval: E2
  run_id: minted-tep-sinh-khong-chan-gop-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T02:22:03Z
  output: |
    tep-sinh-khong-chan-gop: 14 passed, 0 failed

- eval: E3
  run_id: minted-tep-sinh-khong-chan-gop-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T02:22:03Z
  output: |
    tep-sinh-khong-chan-gop: 14 passed, 0 failed

- eval: E4
  run_id: minted-tep-sinh-khong-chan-gop-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T02:22:03Z
  output: |
    tep-sinh-khong-chan-gop: 14 passed, 0 failed

- eval: E5
  run_id: minted-tep-sinh-khong-chan-gop-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T02:22:03Z
  output: |
    tep-sinh-khong-chan-gop: 14 passed, 0 failed

- eval: E6
  run_id: minted-tep-sinh-khong-chan-gop-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T02:22:03Z
  output: |
    tep-sinh-khong-chan-gop: 14 passed, 0 failed

- eval: E7
  run_id: minted-tep-sinh-khong-chan-gop-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T02:22:03Z
  output: |
    tep-sinh-khong-chan-gop: 14 passed, 0 failed

- eval: E8
  run_id: minted-tep-sinh-khong-chan-gop-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-30T02:22:03Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-30T02:22:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-30T02:22:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-30T02:22:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-30T02:22:03Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-30T02:22:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-30T02:22:03Z
  output: |
    FAIL: P123 hai reader dong ket luan tren TICH DESCARTES contract x opportunity x uat (E1,E10)
    Results: 1 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 1
  verified_at: 2026-10-30T02:22:03Z
  output: |
    FAIL: P161 strip-md giu duong dan + ma tran toan phan
    Results: 1 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-30T02:22:03Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-30T02:22:03Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-30T02:22:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Baseline khong do:
- node tests/scripts/tep-sinh-khong-chan-gop.test.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node scripts/product-map.mjs --root . --check: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval không-phân-biệt: none — không eval nào được xác định là xanh trên cả hai phía; lưu ý baseline BLOCKED hạ tầng nên độ phân biệt của E1–E8 KHÔNG đo được ở round này.

Lệnh suite không gắn eval và đỏ (nguyên nhân verdict REJECT, `failed_evals` để trống vì không eval nào đỏ):
- `tests/plugins/run-tests.sh --manh vung:1` — đỏ ca P123 («hai reader dong ket luan tren TICH DESCARTES contract x opportunity x uat»).
- `tests/plugins/run-tests.sh --manh vung:2` — đỏ ca P161 («strip-md giu duong dan + ma tran toan phan»).
Báo cáo này chưa xác định hai ca đỏ có do chính vòng gây ra hay đã đỏ sẵn trên nhánh gốc; cần người/lượt sau truy nguyên trước khi chấm lại.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, deterministic).

## Iterations

Round 1: không eval nào đỏ (E1–E8 xanh); hai lệnh suite hồi quy không gắn eval (plugins vung:1 ca P123, plugins vung:2 ca P161) đỏ. Returned to implementation.
