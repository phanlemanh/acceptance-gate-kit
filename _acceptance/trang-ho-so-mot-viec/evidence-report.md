---
schema_version: 2
feature_slug: trang-ho-so-mot-viec
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6e82218ae0945f71916854b736bf6104ac8dd10f
human_signoff:
---

# Evidence Report: trang-ho-so-mot-viec

Lượt chấm 1. Mọi eval máy xanh: 11 eval test chạy qua một lệnh chức năng, một eval ui-check có ba ảnh chụp, 10 lệnh suite xanh.

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
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | ui-check | PASS |

## Evidence

- eval: E1
  run_id: minted-trang-ho-so-mot-viec-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E2
  run_id: minted-trang-ho-so-mot-viec-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E3
  run_id: minted-trang-ho-so-mot-viec-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E4
  run_id: minted-trang-ho-so-mot-viec-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E5
  run_id: minted-trang-ho-so-mot-viec-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E6
  run_id: minted-trang-ho-so-mot-viec-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E7
  run_id: minted-trang-ho-so-mot-viec-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E8
  run_id: minted-trang-ho-so-mot-viec-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E9
  run_id: minted-trang-ho-so-mot-viec-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E10
  run_id: minted-trang-ho-so-mot-viec-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E11
  run_id: minted-trang-ho-so-mot-viec-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:11:46Z
  output: |
    cmd: node tests/scripts/lo-trinh.test.mjs (một lần chạy phủ E1..E11)
    Results: 241 passed, 0 failed (lo-trinh)

- eval: E12
  run_id: minted-trang-ho-so-mot-viec-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: scripts/evidence-page.js
  verified_at: 2026-10-11T01:11:46Z
  screenshot: evidence/E12-1-dai.png   # khung đầu; hai khung kế là evidence/E12-2-nguoi.png và evidence/E12-3-hep.png
  observed: |
    E12-1-dai.png (1280x800, màn đầu): tiêu đề là câu giao của việc, lưới 3x3 chín ô (Đã giao gì, Vì sao, Trạng thái «Đã giao — chờ phiên nghiệm thu», Ngày 2026-10-10, Đã lên production chưa «chưa ghi quan sát production», Sẽ đo gì khi nào, Kết quả «chưa đo», Chưa làm gì, Ai quyết) và dòng chủ kho «Máy 26 · người 16 · Lượt chấm 3 · Token 140.353 · Mã 8d5180f»; chín ô và dòng chủ kho hiện trọn, các mục gập đều đóng. Sáu câu (vì sao · hứa gì · quyết gì · tốn gì · giao gì · có ăn thua không) đều có chỗ trả lời đúng bảng design doc.
    E12-2-nguoi.png (1280x800): mục «Quyết định» mở bằng phím, nút «Người 16» đang bật, danh sách còn 16 dòng nhãn Người, không lẫn dòng Máy. Máy đo: 26/16/3/140353 và 0 ca lỗi trên 217 hồ sơ crm.
    E12-3-hep.png (390x844): dải một phút thành một cột dọc, không cuộn ngang, scrollWidth 390 bằng innerWidth 390.
  network_observed: unscoped

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-trang-ho-so-mot-viec-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T01:11:46Z

## Known limits

## Ngoài hợp đồng

## Analyst

Không phân biệt (xanh cả trên mã mới lẫn trên bản base): E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11 — cùng một lệnh `node tests/scripts/lo-trinh.test.mjs`. Lệnh này xanh ở cả hai phía, nên nó chứng minh bộ đo chạy được chứ chưa chứng minh riêng tính năng mới; cần viết lại để assert hành vi mới, hoặc xác nhận đây là lưới hồi quy có chủ ý (các ca `-do` bên trong tệp test là chiều đỏ của từng phép đo, chạy trên bản sao đã tiêm).

Baseline khong do: E12 (ui-check) và 10 lệnh suite (n-a; workflow không kèm lý do riêng cho từng lệnh).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào hỏng; mọi eval máy và 10 lệnh suite xanh, E12 khớp từng vế của expected.
