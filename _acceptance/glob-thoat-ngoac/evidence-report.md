---
schema_version: 2
feature_slug: glob-thoat-ngoac
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 346c2702503ad2c3e0ad56e60e0674260a1da061
human_signoff:
---

# Evidence Report: glob-thoat-ngoac

Vòng 1. Cả bảy eval của hợp đồng đều chạy xanh, nhưng một lệnh suite không gắn eval (tầng plugins, mảnh vung:3) đỏ ở ca RT13 vì tệp kiểm thử mới `tests/scripts/glob-thoat-ngoac.test.mjs` chứa chữ «signed-off» mà chưa được khai gạch. Vì vậy phán quyết là REJECT, chưa phải PASS. Hai lỗi ngoài hợp đồng của bước tìm lỗi nằm ở `review-findings.md`.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-glob-thoat-ngoac-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_bo_dich
  verified_at: 2026-10-09T11:18:23Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)
    Đã đối chiếu các ca GT1, GT1b, GT1c đều PASS theo tên.

- eval: E2
  run_id: minted-glob-thoat-ngoac-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_phan_loai
  verified_at: 2026-10-09T11:18:23Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)
    Đã đối chiếu các ca GT2, GT2b, GT2c, GT2d đều PASS theo tên.

- eval: E3
  run_id: minted-glob-thoat-ngoac-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_lan_ghim_lai
  verified_at: 2026-10-09T11:18:23Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)
    Đã đối chiếu các ca GT3, GT3b đều PASS theo tên.

- eval: E4
  run_id: minted-glob-thoat-ngoac-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_mang_sang
  verified_at: 2026-10-09T11:18:23Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)
    Đã đối chiếu các ca GT4, GT4b đều PASS theo tên.

- eval: E5
  run_id: minted-glob-thoat-ngoac-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_hoa_cu
  verified_at: 2026-10-09T11:18:23Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)
    Đã đối chiếu các ca GT6, GT6b đều PASS theo tên.

- eval: E6
  run_id: minted-glob-thoat-ngoac-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtn_dot_bien
  verified_at: 2026-10-09T11:18:23Z
  output: |
    Results: 18 passed, 0 failed (glob-thoat-ngoac)
    Đã đối chiếu các ca GT5a, GT5b, GT5c, GT5d, GT5e đều PASS theo tên.

- eval: E7
  run_id: minted-glob-thoat-ngoac-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-09T11:18:23Z
  output: |
    Results: all workflow tests passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-09T11:18:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-09T11:18:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-09T11:18:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-09T11:18:23Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-09T11:18:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-09T11:18:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-09T11:18:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-glob-thoat-ngoac-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-09T11:18:23Z
  note: lệnh này không gắn eval nào. Ca RT13 báo tệp lạ `tests/scripts/glob-thoat-ngoac.test.mjs` chứa chữ «signed-off» mà chưa thêm ca hay khai gạch có lý do trong khối BO-DOC-KHAI-GACH; kèm theo, ca «ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)» đỏ. Đây là lỗi hạ tầng kiểm thử của chính tệp test mới, không phải lỗi hành vi glob.

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-glob-thoat-ngoac-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-09T11:18:23Z

## Known limits

## Ngoài hợp đồng

## Analyst

E7 (`bash tests/workflows/run-tests.sh`) xanh cả trên mã cũ lẫn mã mới, nên nó chứng minh bộ máy chạy được chứ không chứng minh hành vi mới. Đây là regression-guard có chủ ý theo AC-7; không cần viết lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào đỏ (failed_evals rỗng), nhưng lệnh suite plugins vung:3 đỏ ở ca RT13 vì `tests/scripts/glob-thoat-ngoac.test.mjs` chứa chữ «signed-off» chưa được khai gạch (thêm ca RT13 hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH). Hai lỗi ngoài hợp đồng (bản dịch glob thứ ba ở `feature-loop/workflows/acceptance-verify.js`) ghi ở `review-findings.md`. Trả về giai đoạn cài đặt.
