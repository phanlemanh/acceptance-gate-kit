---
schema_version: 2
feature_slug: xuat-du-lieu-lo-trinh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fa6f7eff2108f00fdf5f7e034a70674feec2edb9
human_signoff: Manh Phan 2026-10-08
---

# Evidence Report: xuat-du-lieu-lo-trinh

Round 2. Cả mười một eval máy đều xanh trên cây đã ghim, và bước tìm-lỗi không còn mục nào TRONG hợp đồng sau lượt sửa S4-r1 (ba lỗi AC-9, AC-11, AC-12 của round 1 đã được sửa ở commit bcd221b7). Eval E11 là đề xuất của hội đồng, chưa người chốt.

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
  run_id: minted-xuat-du-lieu-lo-trinh-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E2
  run_id: minted-xuat-du-lieu-lo-trinh-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E3
  run_id: minted-xuat-du-lieu-lo-trinh-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E4
  run_id: minted-xuat-du-lieu-lo-trinh-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E5
  run_id: minted-xuat-du-lieu-lo-trinh-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E6
  run_id: minted-xuat-du-lieu-lo-trinh-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E7
  run_id: minted-xuat-du-lieu-lo-trinh-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E8
  run_id: minted-xuat-du-lieu-lo-trinh-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E9
  run_id: minted-xuat-du-lieu-lo-trinh-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E10
  run_id: minted-xuat-du-lieu-lo-trinh-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E12
  run_id: minted-xuat-du-lieu-lo-trinh-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-08T09:31:17Z
  output: |
    Results: 181 passed, 0 failed (lo-trinh)

- eval: E11
  judged_by: hội đồng ba góc nhìn (domain-correctness, operational-feasibility, spec-alignment), ngữ cảnh mới
  verdict: PASS
  rationale: Cả ba góc nhìn thấy tài liệu kho tiêu thụ phủ đủ năm việc (lấy khối, trạng thái từng hàng, lọc theo nhóm, việc kế cùng lệnh mở, mốc đã qua còn việc) và chỉ giao một luật tự làm là so ngày mốc với hôm nay, mọi thứ khác đọc thẳng từ khối. Đây là đề xuất của máy; người chốt ở Gate 2.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: ""
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-xuat-du-lieu-lo-trinh-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-08T09:31:17Z

## Known limits

## Ngoài hợp đồng

Có 11 mục ngoài hợp đồng chờ người quyết ở Gate 2 (4 mới ở round 2, 7 mang từ round 1) — đọc đủ trong `review-findings.md`.

## Judge

Hội đồng cho E11 (đề xuất PASS; human_override để TRỐNG, người quyết ở Gate 2):

- domain-correctness: PASS — Tài liệu phủ đủ cả năm việc: lấy khối rồi JSON.parse, trạng thái qua `hang.trang_thai` và `hang.nhom_trang_thai`, lọc qua `hang.nhom`, việc kế và lệnh mở qua `lo_trinh.hang_ke`, mốc đã qua còn việc qua `moc.con_viec` cùng `mocQuaConViec` và `viecTre`. Luật tự làm chỉ có so ngày, kèm lời cấm dựng luật suy trạng thái từ hồ sơ; hàng LT1 của crm khớp. Ghi chú nhỏ, không đổi kết luận: câu về ký tự `<` trong khối in ra trùng chữ nên không nói rõ dạng thoát; bước chép hàm `docDuLieu` chỉ là tuỳ chọn.
- operational-feasibility: PASS — Tài liệu phủ đủ năm việc bằng khoá đọc thẳng từ khối, khớp hàng LT1 có nhóm `crm-chung`. Ghi chú nhỏ, không đổi kết luận: mục «Đọc khoan dung» ghi «năm ca» nhưng bảng có sáu dòng; bước chép hàm `docDuLieu` từ gói kit là chép nguyên văn chứ không phải đọc hiểu mã.
- spec-alignment: PASS — Tài liệu đủ cả năm việc, kèm trích câu cho từng việc; luật duy nhất bản chiếu tự làm là so ngày mốc với hôm nay, câu cuối cấm suy trạng thái từ hồ sơ. Ghi chú nhỏ, không đổi kết luận: câu về `<` trong khối bị hỏng nhưng `JSON.parse` vẫn xử lý được nên không chặn việc dựng trang; bước 3 bảo chép nguyên hàm `docDuLieu` thì người dựng phải mở một tệp của kit, dù hành vi hàm đã được tả đủ ở bảng «Đọc khoan dung»; tài liệu nói «năm ca» nhưng bảng có sáu dòng.

## Analyst

Eval KHÔNG-PHÂN-BIỆT (xanh ở CẢ code hiện tại lẫn baseline), cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý: E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E12 (cùng chạy bởi `node tests/scripts/lo-trinh.test.mjs`, baseline green). Các lệnh suite xanh cả hai phía là regression-guard bình thường, không liệt kê.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval máy nào đỏ; verdict REJECT vì bước tìm-lỗi xác nhận ba lỗi TRONG hợp đồng — AC-11 (tài liệu bảo chép thẳng `docDuLieu` nhưng hàm phụ thuộc bảy ký hiệu khác trong module), AC-9 (ca LT-118 dung-khuon chỉ đếm số lộ trình, không so kết quả bộ đọc với khối), AC-12 (ma trận sáu ca của LT-120 lệch một ngày ở UTC+7, ca ngày trước mốc không bao giờ chạy). Trả về bước hiện thực.
Round 2: lượt sửa S4-r1 (commit bcd221b7) làm bộ đọc mẫu tự đủ, đọc khoan dung so toàn phần, và ca so ngày đủ ba ngày mỗi múi giờ; mười một eval máy xanh (181 ca lộ trình, các suite hồi quy xanh), bước tìm-lỗi không còn mục TRONG hợp đồng, hội đồng E11 đề xuất PASS. Còn 4 mục mới ngoài hợp đồng (cộng 7 mục mang từ round 1) chờ người quyết ở Gate 2.

### Re-pin lần 1 — 2026-10-09, do gộp main sau mốc 2.25.0 (#286) vào nhánh #285
run_id: repin-20261009T031359Z-34847
sha: 0aeef0c8259177b55b8b92f10b2b3921f81b81d7 · suites: 10 lệnh exit 0 · evals: 11/11 eval máy đạt kỳ vọng · ngoài làn máy: E11 · AC không có chốt máy: AC-11

### Re-pin lần 2 — 2026-10-09, do gộp main sau #288 (ổ cắm lộ trình kit + P126) vào nhánh #285
run_id: repin-20261009T034654Z-35291
sha: fa6f7eff2108f00fdf5f7e034a70674feec2edb9 · suites: 10 lệnh exit 0 · evals: 11/11 eval máy đạt kỳ vọng · ngoài làn máy: E11 · AC không có chốt máy: AC-11
