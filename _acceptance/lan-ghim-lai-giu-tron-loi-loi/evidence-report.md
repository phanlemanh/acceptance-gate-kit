---
schema_version: 2
feature_slug: lan-ghim-lai-giu-tron-loi-loi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0932d3576d73215e8121f7b1f8d0faa83d482150
human_signoff:
---

# Evidence Report: lan-ghim-lai-giu-tron-loi-loi

Round 3. Bảy eval của hợp đồng (E1 đến E7) và mười một lệnh suite đều xanh trên cây đã ghim ở verified_commit. Các phát hiện của bước tìm lỗi nằm ở review-findings.md, không đưa vào báo cáo này.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: 20261003T013009Z-93387
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_nhat_ky_tron
  verified_at: 2026-10-03T01:29:54Z
  output: |
    E1 XANH

- eval: E2
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_xanh_im
  verified_at: 2026-10-03T01:29:54Z
  output: |
    E2 XANH

- eval: E3
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_dau_do
  verified_at: 2026-10-03T01:29:54Z
  output: |
    E3 XANH

- eval: E4
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_bo_doc_im
  verified_at: 2026-10-03T01:29:54Z
  output: |
    E4 XANH

- eval: E5
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_thoi_luong
  verified_at: 2026-10-03T01:29:54Z
  output: |
    PASS: E5 chiều đỏ: bản sao «thời lượng một lệnh» → thước thấy (wall_s 2, so_lenh 2)
    E5 XANH

- eval: E6
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_tai_may
  verified_at: 2026-10-03T01:29:54Z
  output: |
    (lệnh thoát sạch, không in dòng tóm tắt nào)

- eval: E7
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_nghia_khong_doi
  verified_at: 2026-10-03T01:29:54Z
  output: |
    E7 XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: 837 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: 22 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: 22 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: 21 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: 71 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-03T01:29:54Z
  output: PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào được ghi green trên baseline. Cả bảy eval có baseline n-a vì chiều đỏ do chính eval dựng bằng bản sao bị tiêm, không chạy trên cây diffBase. Các lệnh suite xanh là regression-guard bình thường.

## Variance

none — every multi-run eval is uniform (cả bảy eval chạy một lần, xác định)

## Iterations

Round 1: bảy eval E1 đến E7 và mười một lệnh suite đều xanh; không eval nào đỏ, không mục judgment, không phương sai. Các phát hiện của bước tìm lỗi nằm ở review-findings.md, không đưa vào báo cáo này.
Round 2: bảy eval E1 đến E7 đều xanh; một lệnh suite không gắn eval (plugins vung:3, ca P179) đỏ nên verdict REJECT. Không có judgment item nào và không có phương sai.
Round 3: bảy eval E1 đến E7 và mười lệnh suite đều xanh trên cây 0932d357, gồm cả plugins vung:3. Không có judgment item, không có phương sai, không eval nào đỏ.
