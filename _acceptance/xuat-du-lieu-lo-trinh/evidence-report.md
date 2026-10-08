---
schema_version: 2
feature_slug: xuat-du-lieu-lo-trinh
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a0f2ed0a0403cae1d93d63e47e6d9ed22144a789
human_signoff:
---

# Evidence Report: xuat-du-lieu-lo-trinh

Round 1. Mọi eval máy đều chạy xanh, nhưng vòng bị REJECT vì ba lỗi TRONG hợp đồng do bước tìm-lỗi xác nhận (AC-11, AC-9, AC-12) — xem mục Iterations và `review-findings.md`.

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
| E11 | AC-11 | judgment | PASS (đề xuất của hội đồng, chưa người chốt) |
| E12 | AC-12 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-xuat-du-lieu-lo-trinh-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E2
  run_id: minted-xuat-du-lieu-lo-trinh-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E3
  run_id: minted-xuat-du-lieu-lo-trinh-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E4
  run_id: minted-xuat-du-lieu-lo-trinh-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E5
  run_id: minted-xuat-du-lieu-lo-trinh-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E6
  run_id: minted-xuat-du-lieu-lo-trinh-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E7
  run_id: minted-xuat-du-lieu-lo-trinh-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E8
  run_id: minted-xuat-du-lieu-lo-trinh-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E9
  run_id: minted-xuat-du-lieu-lo-trinh-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E10
  run_id: minted-xuat-du-lieu-lo-trinh-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E12
  run_id: minted-xuat-du-lieu-lo-trinh-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T08:58:41Z
  output: |
    Results: 177 passed, 0 failed (lo-trinh)

- eval: E11
  judged_by: hội đồng ba góc nhìn (domain-correctness, operational-feasibility, spec-alignment), ngữ cảnh mới
  verdict: PASS
  rationale: Cả ba góc nhìn thấy tài liệu phủ đủ năm việc và chỉ giao một luật tự làm là so ngày mốc với hôm nay. Đây là đề xuất của máy; finding t2 của bước tìm-lỗi (bộ đọc mẫu chép riêng sẽ lỗi) mâu thuẫn với kết luận «không cần đọc mã kit» nên người cần cân lại.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: ""__ebbd92
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: ""__4d9641
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: ""__a3974c
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-08T08:58:41Z

## Known limits

## Ngoài hợp đồng

Có 7 mục ngoài hợp đồng chờ người quyết ở Gate 2 — đọc đủ trong `review-findings.md`.

## Judge

Hội đồng cho E11 (đề xuất PASS; human_override để TRỐNG, người quyết ở Gate 2):

- domain-correctness: PASS — Tài liệu đủ cả năm việc và chỉ giao đúng một luật tự làm là so ngày mốc với hôm nay; mọi thứ khác đọc thẳng từ khối. Ghi chú nhỏ: câu về ký tự `<` đọc mơ hồ nhưng `JSON.parse` xử lý được.
- operational-feasibility: PASS — Tài liệu chỉ rõ cách lấy khối, trạng thái từng hàng, nhóm lọc, hàng kế cùng lệnh mở, mốc đã qua còn việc; luật so ngày là việc duy nhất bản chiếu tự làm, và hàng LT1 của crm nhất quán với điều đó. Ghi chú nhỏ: mục «Đọc khoan dung» nói năm ca nhưng bảng có sáu dòng.
- spec-alignment: PASS — Tài liệu phủ đủ năm việc mà không cần đọc mã kit; bản chiếu tự suy trạng thái từ hồ sơ bị tài liệu cấm rõ. Ghi chú nhỏ: `docDuLieu` được nhắc như bộ đọc mẫu tuỳ chọn.

## Analyst

Eval KHÔNG-PHÂN-BIỆT (xanh ở CẢ code hiện tại lẫn baseline), cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý: E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E12 (cùng chạy bởi `node tests/scripts/lo-trinh.test.mjs`, baseline green). Các lệnh suite xanh cả hai phía là regression-guard bình thường, không liệt kê.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval máy nào đỏ; verdict REJECT vì bước tìm-lỗi xác nhận ba lỗi TRONG hợp đồng — AC-11 (tài liệu bảo chép thẳng `docDuLieu` nhưng hàm phụ thuộc bảy ký hiệu khác trong module), AC-9 (ca LT-118 dung-khuon chỉ đếm số lộ trình, không so kết quả bộ đọc với khối), AC-12 (ma trận sáu ca của LT-120 lệch một ngày ở UTC+7, ca ngày trước mốc không bao giờ chạy). Trả về bước hiện thực.
