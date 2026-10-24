---
schema_version: 2
feature_slug: o-mo-viec-mang-nguon
verdict: REJECT
failed_evals: [E8a]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2112972c665532f52d252e4b870db13957e620fe
human_signoff:
---

# Evidence Report: o-mo-viec-mang-nguon

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8a | AC-8 | test | FAIL |
| E8b | AC-8 | test | PASS |
| E8c | AC-8 | test | PASS |
| E8d | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-o-mo-viec-mang-nguon-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.o_mo_viec_mang_nguon
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/o-mo-viec-mang-nguon.test.mjs (chung với E2–E7)
    mọi ca xanh

- eval: E2
  run_id: minted-o-mo-viec-mang-nguon-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.o_mo_viec_mang_nguon
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/o-mo-viec-mang-nguon.test.mjs (chung với E1, E3–E7)
    mọi ca xanh

- eval: E3
  run_id: minted-o-mo-viec-mang-nguon-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.o_mo_viec_mang_nguon
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/o-mo-viec-mang-nguon.test.mjs (chung với E1, E2, E4–E7)
    mọi ca xanh

- eval: E4
  run_id: minted-o-mo-viec-mang-nguon-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.o_mo_viec_mang_nguon
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/o-mo-viec-mang-nguon.test.mjs (chung với E1–E3, E5–E7)
    mọi ca xanh

- eval: E5
  run_id: minted-o-mo-viec-mang-nguon-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.o_mo_viec_mang_nguon
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/o-mo-viec-mang-nguon.test.mjs (chung với E1–E4, E6, E7)
    mọi ca xanh

- eval: E6
  run_id: minted-o-mo-viec-mang-nguon-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.o_mo_viec_mang_nguon
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/o-mo-viec-mang-nguon.test.mjs (chung với E1–E5, E7)
    mọi ca xanh

- eval: E7
  run_id: minted-o-mo-viec-mang-nguon-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.o_mo_viec_mang_nguon
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/o-mo-viec-mang-nguon.test.mjs (chung với E1–E6)
    mọi ca xanh

- eval: E8a
  run_id: minted-o-mo-viec-mang-nguon-E8a-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/lo-trinh.test.mjs
    PASS: LT-170-do — bản sao SKILL coi mọi dòng cảnh báo là của đợt
    PASS: LT-170-do-cau — bản sao SKILL giữ câu cũ
    Results: 290 passed, 1 failed (lo-trinh)
    (phần đuôi đã chụp không chứa dòng của ca đỏ; tên ca đỏ nằm ở phần đầu đầu ra, chưa được ghi lại ở đây)

- eval: E8b
  run_id: minted-o-mo-viec-mang-nguon-E8b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kho_tri_thuc_va_lint
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/kho-tri-thuc-va-lint.test.mjs
    Results: mọi ca xanh

- eval: E8c
  run_id: minted-o-mo-viec-mang-nguon-E8c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/road-map-de-dung.test.mjs
    RD Results: 38 PASS · 0 FAIL

- eval: E8d
  run_id: minted-o-mo-viec-mang-nguon-E8d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.can_cu_s1_ca
  verified_at: 2026-10-24T10:08:59Z
  output: |
    lệnh: node tests/scripts/can-cu-s1.ca.mjs
    Results: 52 passed, 0 failed (can-cu-s1)

### Lệnh suite (hồi quy)

Hai lệnh suite không gắn eval nào thoát khác 0: `bash tests/scripts/run-tests.sh --manh mjs:2/3` (36 passed, 1 failed) và `bash tests/scripts/run-tests.sh --manh mjs:3/3` (35 passed, 1 failed). Đuôi đầu ra đã chụp không nêu tên tệp đỏ của hai lượt này. Cả hai kèm nhãn lệnh suite, không gắn AC.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-10-24T10:08:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-10-24T10:08:59Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-o-mo-viec-mang-nguon-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-o-mo-viec-mang-nguon-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-o-mo-viec-mang-nguon-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-24T10:08:59Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval không-phân-biệt: none đo được. Baseline bị chặn hạ tầng ở round này nên mọi trường baseline là n-a, và không thể khẳng định eval nào đỏ trên bản cũ (chưa chứng minh được tính phân biệt của E1–E7).

Ghi chú: đầu vào không kèm giờ đo, nên verified_at ghi theo ngày chạy 2026-10-24 (giờ 00:00:00Z là giá trị giữ chỗ, không phải giờ thật).

### Baseline khong do

- node tests/scripts/o-mo-viec-mang-nguon.test.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/scripts/lo-trinh.test.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/scripts/kho-tri-thuc-va-lint.test.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/scripts/road-map-de-dung.test.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/scripts/can-cu-s1.ca.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

## Variance

none — mọi eval chạy một lần (xác định), không eval nào có pass_rate lẫn.

## Iterations

Round 1: E8a failed — `tests/scripts/lo-trinh.test.mjs` báo 290 passed, 1 failed; đuôi đầu ra đã chụp không nêu tên ca đỏ. Hai lệnh suite `--manh mjs:2/3` và `--manh mjs:3/3` cũng mỗi lệnh một tệp đỏ (không gắn eval). Returned to implementation.
