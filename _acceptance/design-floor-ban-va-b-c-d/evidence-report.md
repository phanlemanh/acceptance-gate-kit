---
schema_version: 2
feature_slug: design-floor-ban-va-b-c-d
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 62f3ac6fe0006d7e295c41952d2b626668d43a1b
human_signoff: Manh Phan 2026-10-27
---

# Evidence Report: design-floor-ban-va-b-c-d

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-design-floor-ban-va-b-c-d-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_b_df01
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh b-df01
    hop-dong: XANH (gồm giới hạn đã khai)

- eval: E2
  run_id: minted-design-floor-ban-va-b-c-d-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_b_df04
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh b-df04
    hop-dong: XANH (gồm giới hạn đã khai)

- eval: E3
  run_id: minted-design-floor-ban-va-b-c-d-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_b_df05
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh b-df05
    hop-dong: XANH (gồm giới hạn đã khai)

- eval: E4
  run_id: minted-design-floor-ban-va-b-c-d-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_b_df06
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh b-df06
    hop-dong: XANH (gồm giới hạn đã khai)

- eval: E5
  run_id: minted-design-floor-ban-va-b-c-d-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_c
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh c
    tu-thu: XANH (4 ca)

- eval: E6
  run_id: minted-design-floor-ban-va-b-c-d-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_d
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh d
    rao-dong: XANH (gồm giới hạn đã khai)

- eval: E7
  run_id: minted-design-floor-ban-va-b-c-d-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_luat_gioi_han
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh luat-gioi-han
    so-va: gioi_han 0 · da-ap A,B,C,D · cho-va 0 · đủ trường

- eval: E8
  run_id: minted-design-floor-ban-va-b-c-d-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_bo_ban_va
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh bo-ban-va
    tu-thu: XANH (7 ca)

- eval: E9
  run_id: minted-design-floor-ban-va-b-c-d-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df_chuoi_so_va
  verified_at: 2026-10-27T10:56:19Z
  output: |
    $ bash tests/design-floor/eval.sh chuoi-so-va
    tu-thu: XANH (10 ca)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-design-floor-ban-va-b-c-d-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-27T10:56:19Z

## Known limits

## Ngoài hợp đồng

10 mục ngoài hợp đồng chờ người quyết ở Cổng 2 — chi tiết ở review-findings.md.

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Baseline khong do:
- bash tests/design-floor/eval.sh b-df01: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh b-df04: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh b-df05: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh b-df06: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh c: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh d: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh luat-gioi-han: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh bo-ban-va: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- bash tests/design-floor/eval.sh chuoi-so-va: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval không-phân-biệt: none — nhưng danh sách rỗng này KHÔNG có nghĩa mọi eval đỏ trên baseline; baseline không đo được ở round này (BLOCKED hạ tầng), nên tính phân biệt của chín eval feature chưa được chứng minh bằng A/B.

Ghi chú: verified_at ghi theo ngày chạy (2026-10-27); dữ liệu truyền xuống không mang giờ máy.

## Variance

none — every multi-run eval is uniform (chín eval đều chạy một lần, deterministic).

## Iterations

Round 1: E1–E9 đều đạt, không eval nào đỏ; baseline BLOCKED hạ tầng nên mọi trường baseline là n-a. Không có judgment item, không có phương sai.
