---
schema_version: 2
feature_slug: trang-ho-so-mot-viec
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e284238bcb20668719d3ba0ff4d0a1a0bb1552c4
human_signoff:
---

# Evidence Report: trang-ho-so-mot-viec

Lượt chấm 2. Mọi eval máy xanh: 11 eval test chạy qua một lệnh chức năng (242 ca đạt), một eval ui-check có ba ảnh chụp, 10 lệnh suite xanh. Phép đo ngưỡng «Giá trị» của AC-5 đã so theo quan hệ như lượt 1 yêu cầu.

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
  run_id: minted-trang-ho-so-mot-viec-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E2
  run_id: minted-trang-ho-so-mot-viec-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E3
  run_id: minted-trang-ho-so-mot-viec-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E4
  run_id: minted-trang-ho-so-mot-viec-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E5
  run_id: minted-trang-ho-so-mot-viec-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E6
  run_id: minted-trang-ho-so-mot-viec-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E7
  run_id: minted-trang-ho-so-mot-viec-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E8
  run_id: minted-trang-ho-so-mot-viec-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E9
  run_id: minted-trang-ho-so-mot-viec-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E10
  run_id: minted-trang-ho-so-mot-viec-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E11
  run_id: minted-trang-ho-so-mot-viec-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T01:57:00Z
  output: |
    Results: 242 passed, 0 failed (lo-trinh)

- eval: E12
  run_id: minted-trang-ho-so-mot-viec-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: scripts/evidence-page.js
  verified_at: 2026-10-11T01:57:00Z
  screenshot: evidence/E12-1-dai.png   # khung đầu; hai khung kế là evidence/E12-2-nguoi.png và evidence/E12-3-hep.png
  observed: |
    E12-1-dai.png (1280x800, màn đầu, chưa cuộn): tiêu đề là câu giao của việc; lưới 3x3 chín ô (Đã giao gì, Vì sao, Trạng thái «Đã giao — chờ phiên nghiệm thu», Ngày 2026-10-10, Đã lên production chưa «chưa ghi quan sát production», Sẽ đo gì khi nào, Kết quả «chưa đo», Chưa làm gì «9 mục ngoài hợp đồng · 0 giới hạn đã biết», Ai quyết) hiện trọn; ô Vì sao và Sẽ đo gì bị cắt bằng dấu chấm lửng do hiển thị, không mất nội dung. Ngay dưới lưới là dòng chủ kho «Tiêu chí 14 · Phép đo 17 · Lượt chấm 3 · Token 140.353 · Quyết định máy 26 · người 16 · Mã 8d5180f»; các mục gập (Vì sao làm, Đã hứa, Thiết kế, Quyết định, Bằng chứng, Tài nguyên) bắt đầu bên dưới. Sáu câu hỏi đều có chỗ trả lời đúng bảng thiết kế.
    E12-2-nguoi.png (1280x800, cuộn tới «Quyết định»): mục mở («▼ Quyết định»), các nút «Tất cả 42», «Máy 26», «Người 16» với «Người 16» đang bật; danh sách còn 16 dòng, đều là «Người (Manh Phan) · revisit · gate2» ngày 2026-10-10 (Ngoài-1..14, «cắt/hoãn: đồng ý cắt», «Treo: phê hết»).
    E12-3-hep.png (390x844): dải thành một cột, chín ô xếp dọc, không bị cắt ở mép phải; scrollWidth 390 không vượt 390.
    Khớp expected: máy đo 26/16/3/140353 và 0 ca lỗi trên 217 hồ sơ crm; chín ô cộng dòng chủ kho hiện trọn ở 1280x800; mục mở bằng bàn phím; lọc «Người» còn 16 dòng; khổ 390 một cột không tràn ngang. Lệch đã khai: trình điều khiển Playwright chặn giao thức file nên thư mục được phục vụ qua http.server trên 127.0.0.1:8765 (đã dừng sau khi chụp), nội dung giống hệt; cấu hình không có capture.ui nên ảnh lấy từ công cụ chụp của Playwright MCP.
  network_observed: unscoped   # số thô nằm ở evidence/E12-network.txt

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-trang-ho-so-mot-viec-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-trang-ho-so-mot-viec-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-11T01:57:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

Baseline không phân biệt (xanh cả trên cây hiện tại lẫn cây cũ diffBase — chứng minh bộ chạy, chưa chứng minh tính năng; viết lại để khẳng định hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý): E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11 — cùng một lệnh `node tests/scripts/lo-trinh.test.mjs`.

Baseline không đo: E12 (n-a — eval ui-check cần trình duyệt, không chạy được trên cây cũ); 10 lệnh suite (n-a — lệnh hồi quy không gắn AC, không đo baseline riêng).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào hỏng; mọi eval máy và 10 lệnh suite xanh, E12 khớp từng vế của expected.
Round 2: chấm lại trên cây mới (commit chuẩn hoá «» của X2 và sửa «Giá trị» in ngưỡng ô cơ hội cạnh số đo, LT-154 so quan hệ); không eval nào hỏng, lệnh chức năng 242 ca đạt, 10 lệnh suite xanh, E12 khớp expected.
