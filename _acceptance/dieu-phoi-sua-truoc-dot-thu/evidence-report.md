---
schema_version: 2
feature_slug: dieu-phoi-sua-truoc-dot-thu
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 113a4a9ae70804a9a60e2c085234f537b0fd39bc
human_signoff: manh 2026-10-11
---

# Evidence Report: dieu-phoi-sua-truoc-dot-thu

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | script | PASS |
| E7c | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-11T12:45:52Z
  output: |
    Lệnh chung của E1–E8: node --test tests/dieu-phoi/**/*.test.mjs lọc dòng TAP DP*/SDT-*.
    Đuôi đầu ra: bảng chuyển trạng thái đợt (nhap>nhap · cheo · cheo; nhap>dang-chay · hop-le · hop-le;
    nhap>tam-dung, nhap>dang-dong, nhap>dang-ban-giao, nhap>cho-tiep-tuc đều tu-choi · tu-choi).
    Tổng kết TAP: không dòng not ok.

- eval: E2
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-11T12:45:52Z
  output: |
    Cùng lệnh với E1 (một lần chạy phủ E1–E8); mọi ca SDT-02 và DP2-01 nằm trong lượt chạy này, không dòng not ok.

- eval: E3
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-11T12:45:52Z
  output: |
    Cùng lệnh với E1 (một lần chạy phủ E1–E8); mọi ca SDT-03 và DP3-01 nằm trong lượt chạy này, không dòng not ok.

- eval: E4
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-11T12:45:52Z
  output: |
    Cùng lệnh với E1 (một lần chạy phủ E1–E8); mọi ca SDT-04, DP7-03 và DP2-07 nằm trong lượt chạy này, không dòng not ok.

- eval: E5
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-11T12:45:52Z
  output: |
    Cùng lệnh với E1 (một lần chạy phủ E1–E8); mọi ca SDT-05 nằm trong lượt chạy này, không dòng not ok.

- eval: E6
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-11T12:45:52Z
  output: |
    Cùng lệnh với E1 (một lần chạy phủ E1–E8); mọi ca SDT-06 và DP4-04 nằm trong lượt chạy này, không dòng not ok.

- eval: E7
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-11T12:45:52Z
  output: |
    Cùng lệnh với E1 (một lần chạy phủ E1–E8); mọi ca SDT-07 nằm trong lượt chạy này, tổng kết TAP không dòng not ok.

- eval: E7b
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E7b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.dieu_phoi_validate
  verified_at: 2026-10-11T12:45:52Z
  output: |
    PASS: DP1-01b validate
    PASS: DP1-01b-do bo-lop-hooks (báo cáo nêu hooks)

- eval: E7c
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E7c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_lb
  verified_at: 2026-10-11T12:45:52Z
  output: |
    PASS: [LB2] 16 file: 0 trần, 0 uat thiếu tiền tố, 163 lệnh có tiền tố thuộc bảng; 16 đối chứng dương tiêm; giữ-gân 0; ba chèn → đỏ

- eval: E8
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_sdt
  verified_at: 2026-10-11T12:45:52Z
  output: |
    Cùng lệnh với E1 (một lần chạy phủ E1–E8); mọi ca SDT-08 nằm trong lượt chạy này, không dòng not ok.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-dieu-phoi-sua-truoc-dot-thu-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T12:45:52Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên CẢ HEAD lẫn baseline diffBase, cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E1, E2, E3, E4, E5, E6, E7, E8 — chung một lệnh `node --test tests/dieu-phoi/**/*.test.mjs` (lọc dòng TAP DP*/SDT-*), baseline green.
- E7b — `node tests/dieu-phoi/kiem-validate.mjs`, baseline green.
- E7c — `LB_CASES=LB1,LB2 node tests/plugins/lenh-bam-duoc.test.mjs`, baseline green.

Baseline không đo: none.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval (E1–E8, E7b, E7c) và mọi lệnh suite xanh; verdict PASS.

### Re-pin lần 1 — 2026-10-11, do sau vòng dieu-phoi-sua-truoc-dot-thu (D4·D1·B1·E2·E1) + gộp DP6, DP7-06 neo lịch sử
run_id: repin-20261011T152051Z-95655
sha: 113a4a9ae70804a9a60e2c085234f537b0fd39bc · suites: 10 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng
