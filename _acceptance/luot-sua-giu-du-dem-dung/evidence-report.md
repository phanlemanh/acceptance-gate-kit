---
schema_version: 2
feature_slug: luot-sua-giu-du-dem-dung
verdict: REJECT
failed_evals: [E6, E7, E8]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ab1e50f2e2852cc0ac861f8ce568ac03ed662898
human_signoff:
---

# Evidence Report: luot-sua-giu-du-dem-dung

Vòng 1. Bảy trong mười eval của tính năng đạt (E1–E5, E9, E10); ba eval trượt (E6, E7, E8) vì cùng một nguyên nhân: bộ đếm thước-vật gọi `git diff --numstat --no-renames <san>..HEAD ^<nen>`, git không nhận rev âm thêm vào sau một khoảng `A..B`, in usage rồi thoát, nên thuoc-vat thoát 2 «lệnh git thất bại» ở đúng ca gộp nhánh nền. Chi tiết nguyên nhân và hướng sửa ở `review-findings.md`.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | FAIL |
| E7 | AC-7 | script | FAIL |
| E8 | AC-8 | script | FAIL |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-luot-sua-giu-du-dem-dung-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lsgd_ac1
  verified_at: 2026-10-07T03:23:52Z
  output: |
    Results: 1 passed, 0 failed (luot-sua-giu-du)

- eval: E2
  run_id: minted-luot-sua-giu-du-dem-dung-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lsgd_ac2
  verified_at: 2026-10-07T03:23:52Z
  output: |
    Results: 1 passed, 0 failed (luot-sua-giu-du)

- eval: E3
  run_id: minted-luot-sua-giu-du-dem-dung-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lsgd_ac3
  verified_at: 2026-10-07T03:23:52Z
  output: |
    Results: 1 passed, 0 failed (luot-sua-giu-du workflow)

- eval: E4
  run_id: minted-luot-sua-giu-du-dem-dung-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lsgd_ac4
  verified_at: 2026-10-07T03:23:52Z
  output: |
    Results: 1 passed, 0 failed (luot-sua-giu-du)

- eval: E5
  run_id: minted-luot-sua-giu-du-dem-dung-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lsgd_ac5
  verified_at: 2026-10-07T03:23:52Z
  output: |
    Results: 1 passed, 0 failed (luot-sua-giu-du workflow)

- eval: E6
  run_id: minted-luot-sua-giu-du-dem-dung-E6-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.lsgd_ac6
  verified_at: 2026-10-07T03:23:52Z
  output: |
    FAIL: AC-6 — thuoc-vat: merge từ nền không đổi số đếm (--json và --write)
    thuoc-vat exit 2: fatal: path '_acceptance/demo/decisions.jsonl' does not exist in 'HEAD'
    thuoc-vat: lệnh git thất bại: usage: git diff [<options>] [<commit>] [--] [<path>...]
    Results: 0 passed, 1 failed (luot-sua-giu-du)

- eval: E7
  run_id: minted-luot-sua-giu-du-dem-dung-E7-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.lsgd_ac7
  verified_at: 2026-10-07T03:23:52Z
  output: |
    FAIL: AC-7 — thuoc-vat: tệp vòng và nền cùng chạm chỉ đếm dòng của vòng
    thuoc-vat exit 2: fatal: path '_acceptance/demo/decisions.jsonl' does not exist in 'HEAD'
    thuoc-vat: lệnh git thất bại: usage: git diff [<options>] [<commit>] [--] [<path>...]
    Results: 0 passed, 1 failed (luot-sua-giu-du)

- eval: E8
  run_id: minted-luot-sua-giu-du-dem-dung-E8-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.lsgd_ac8
  verified_at: 2026-10-07T03:23:52Z
  output: |
    FAIL: AC-8 — thuoc-vat: nhánh con tách sau mốc sàn vẫn đếm; kho không merge giữ từng byte
    thuoc-vat exit 2: fatal: path '_acceptance/demo/decisions.jsonl' does not exist in 'HEAD'
    thuoc-vat: lệnh git thất bại: usage: git diff [<options>] [<commit>] [--] [<path>...]
    Results: 0 passed, 1 failed (luot-sua-giu-du)

- eval: E9
  run_id: minted-luot-sua-giu-du-dem-dung-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lsgd_ac9
  verified_at: 2026-10-07T03:23:52Z
  output: |
    (ca AC-9 chạy xong, không có dòng lỗi)

- eval: E10
  run_id: minted-luot-sua-giu-du-dem-dung-E10-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lsgd_ac10
  verified_at: 2026-10-07T03:23:52Z
  output: |
    (ca AC-10 chạy xong, không có dòng lỗi)

### Lệnh suite (hồi quy)

Lệnh fail không gắn eval nào: `bash tests/scripts/run-tests.sh --manh mjs:3/3` (kết quả 25 qua, 1 trượt; đuôi nhật ký không nêu tên ca trượt). Ba lệnh `LSGD_CASES=AC-6/7/8 node tests/scripts/luot-sua-giu-du.test.mjs` cũng trượt nhưng đã gắn E6, E7, E8 ở trên.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-10-07T03:23:52Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-luot-sua-giu-du-dem-dung-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-07T03:23:52Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — mọi eval chạy một lần, không eval nào có pass_rate hỗn hợp

## Iterations

Round 1: E6, E7, E8 failed — thuoc-vat gọi `git diff --numstat <san>..HEAD ^<nen>`, git không nhận rev âm thêm vào sau khoảng A..B nên in usage và thoát 2 ở ca gộp nhánh nền (AC-6, AC-7, AC-8). Lệnh suite `--manh mjs:3/3` cũng trượt một ca. Returned to implementation.
