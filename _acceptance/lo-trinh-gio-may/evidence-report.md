---
schema_version: 2
feature_slug: lo-trinh-gio-may
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 77fb89bda18316f9e0d4a6399faaffd9cbfd4724
human_signoff: Manh Phan 2026-10-16
---

# Evidence Report: lo-trinh-gio-may

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-lo-trinh-gio-may-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

- eval: E2
  run_id: minted-lo-trinh-gio-may-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

- eval: E3
  run_id: minted-lo-trinh-gio-may-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

- eval: E4
  run_id: minted-lo-trinh-gio-may-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

- eval: E5
  run_id: minted-lo-trinh-gio-may-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

- eval: E6
  run_id: minted-lo-trinh-gio-may-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

- eval: E7
  run_id: minted-lo-trinh-gio-may-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

- eval: E8
  run_id: minted-lo-trinh-gio-may-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

- eval: E9
  run_id: minted-lo-trinh-gio-may-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_gio_may
  verified_at: 2026-10-15T15:02:45Z
  output: |
    Results: 45 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lo-trinh-gio-may-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lo-trinh-gio-may-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-lo-trinh-gio-may-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-15T15:02:45Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt: none — không eval nào đo được xanh ở cả hai phía, vì baseline của E1–E9 là n-a (xem mục «Baseline khong do»). Các lệnh suite là lưới hồi quy bình thường, không liệt kê.

Ghi chú về độ phủ của bằng chứng này: phần đuôi đầu ra máy trả về chỉ có dòng tổng (45 ca đạt của tệp kiểm lộ trình giờ máy, không ca hỏng); không thấy từng dòng PASS/SKIP, nên riêng ca GM-6-that (bản ghi phiên thật của máy) không xác nhận được ở đây là chạy thật hay bỏ qua. Người đọc Cổng Bằng chứng cần biết điều này khi đọc E6.

Baseline khong do

- node tests/scripts/lo-trinh-gio-may.test.mjs: bo qua baseline: tep tests/scripts/lo-trinh-gio-may.test.mjs co o cay dang kiem nhung chua co o merge-base cf2fe01225dc56edb1e589c1cfa46dacea0d864e — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy nhiều lần đều đồng nhất (không eval nào có runs lớn hơn 1).

## Iterations

Round 1: bằng chứng lượt 1 cho kết quả PASS, kèm 1 finding trong hợp đồng; đã sửa (khối S4-DO-VONG tự giải gói, mốc đặt lại so theo phút, phần trăm không nhích ghi null).
Round 2: E1–E9 và 11 lệnh suite đều xanh trên cây 342e632e; 2 finding ngoài hợp đồng (cùng một lỗi: mốc đặt lại hỏng trong tệp hạn mức dùng chung) và 6 mục mang từ round trước nằm ở review-findings.md để người quyết ở Gate 2.

### Re-pin lần 1 — 2026-10-16, do gộp main e584885b (RM4 #362) + giờ máy về dòng dưới câu giao (CI LTT-san)
run_id: repin-20261015T235317Z-59615
sha: 77fb89bda18316f9e0d4a6399faaffd9cbfd4724 · suites: 11 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng
