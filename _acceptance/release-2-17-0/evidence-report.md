---
schema_version: 2
feature_slug: release-2-17-0
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (làn V — mốc phát hành không chạy lượt chấm S4; tiền lệ release-2-7-0, xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: abc1d4f7d00941fb16b5369d1637fa174a90145f
human_signoff: Mạnh 2026-09-20 — ký mốc phát hành 2.17.0 với bốn known-limits đã khai: (1) người chấm là chính phiên thi công, làn V không chạy lượt chấm S4 (nếp release-2-7-0); (2) nội dung các vế «người dùng nhận gì» trong mô tả hai gói là văn cho người, đọc trong diff; (3) vế 4 của luật (b) chưa có răng, mốc khai ba kho chờ nhận bằng lời kèm lý do đo được; (4) phiên trả ba lượt ghim lại vì chạm sổ khai-gạch của một hồ sơ đã ký. Đồng ý phạm vi đã cắt (không chiến dịch ghim lại, không sửa năm giới hạn của ho-so-nghi, không làm lớp vendored tự xưng); phê hai quyết định ghi sau Cổng Phạm vi.
---

# Evidence — release-2-17-0

| Eval | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: rel217-20260919T165343Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-19T16:53:43Z
  output: |
    P200 VE: feature-loop hop semver: 2.17.0
    P200 VE: diagram-design hop semver: 2.7.0
    P200 VE: hai plugin cung so: 2.17.0
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)

- eval: E2
  run_id: rel217-20260919T165343Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-19T16:53:43Z
  output: |
    P200 VE: GUIDE khop so DOC TU manifest

- eval: E3
  run_id: rel217-20260919T165343Z-E3
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-09-19T16:53:43Z
  output: |
    Results: 886 passed, 0 failed

- eval: E3b
  run_id: rel217-20260919T165343Z-E3b
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-09-19T16:53:43Z
  output: |
    Results: 70 passed, 0 failed

- eval: E3c
  run_id: rel217-20260919T165343Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-19T16:53:43Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: rel217-20260919T165343Z-E3d
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-09-19T16:53:43Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: rel217-20260919T165343Z-E3e
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-19T16:53:43Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: rel217-20260919T165343Z-E4
  exit_code: 0
  verifier: config:executors.script.rel217_cua_so
  verified_at: 2026-09-19T16:53:43Z
  output: |
    rút từ kho: ho-so-nghi ma-so-quyet-dinh-duy-nhat nen-cong-cu-lenh-shell
    mốc kể    : ho-so-nghi ma-so-quyet-dinh-duy-nhat nen-cong-cu-lenh-shell
    XANH: hai tập bằng nhau

- eval: E6
  run_id: rel217-20260919T165343Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-19T16:53:43Z
  output: |
    P200 VE: mo ta acceptance-gate co muc v2.17.0
    P200 VE: muc v2.17.0 cua feature-loop TU khai cap

## Known limits

1. **Người chấm là chính phiên thi công, không phải phiên tươi.** Mốc phát hành đi làn V và
   KHÔNG chạy lượt chấm S4 (nếp release-2-7-0). Doer = grader cho mốc này. Lưới đỡ phần
   này: chín phép đo đều là lệnh máy chạy lại được, không có mục phán xét; ca thường trực
   P200 mang năm đột biến và một đối chứng dương nên số không thể tự dối; và lưới trước-merge
   chấm độc lập ở CI.
2. **Nội dung các vế «người dùng nhận gì»** trong mô tả hai gói là văn cho người — P200 chỉ
   kiểm mục `v2.17.0` CÓ MẶT và câu khai cặp nằm đúng mục, không kiểm nội dung. Đọc trong diff.
3. **Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — chưa có răng.** Mốc khai bằng lời
   trong Context: ba kho, mỗi kho một câu lý do đo được. Ngưỡng đang đếm: một mốc cắt số mà
   sau 21 ngày không kho nào cài nó.
4. **Chi phí ghim lại của chính phiên này: ba lượt.** Mỗi lần chạm một dòng trong sổ khai-gạch
   của `ra-co-ten-lam-va-trao` là một lượt chạy trọn bộ kiểm (~11 phút). Đây là thuế của luật
   «hồ sơ đã ký không kéo vào diff», đo được và nên đọc ở cửa sổ sau.

## Ngoài hợp đồng

none — làn V, không có làn rà soát.

## Analyst

n-a — mốc phát hành không có eval phân biệt cần đường nền A/B: chín phép đo đều là lệnh hồi quy
thường trực hoặc lệnh đo quan hệ có sẵn hai chiều đỏ trong chính nó.

## Variance

none — mọi eval chạy đúng một lần, không có eval ngẫu nhiên.

## Iterations

Một lượt, không có vòng chấm S4 (làn V). Chín phép đo chạy tuần tự trên cây `abc1d4f7d00941fb16b5369d1637fa174a90145f`, tất cả
thoát 0; thời gian: bộ kiểm script 334 s · plugin 365 s · hooks 2 s · workflows 3 s · bản đồ và
lệnh đo cửa sổ dưới 1 s.
