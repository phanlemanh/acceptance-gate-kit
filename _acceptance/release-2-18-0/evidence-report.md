---
schema_version: 2
feature_slug: release-2-18-0
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (làn V — mốc phát hành không chạy lượt chấm S4; tiền lệ release-2-7-0/2-17-0, xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: b02e25926ea9b1b5197187eb719ade3094bad3b6
human_signoff:
---

# Evidence — release-2-18-0

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
  run_id: rel218-20260921T130908Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-21T13:09:08Z
  output: |
    P200 VE: acceptance-gate hop semver: 2.18.0
    P200 VE: feature-loop hop semver: 2.18.0
    P200 VE: diagram-design hop semver: 2.7.0
    P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    P200 VE: hai plugin cung so: 2.18.0
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)

- eval: E2
  run_id: rel218-20260921T130908Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-21T13:09:08Z
  output: |
    P200 VE: GUIDE khop so DOC TU manifest

- eval: E3
  run_id: rel218-20260921T130908Z-E3
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-09-21T13:09:08Z
  output: |
    Results: 891 passed, 0 failed

- eval: E3b
  run_id: rel218-20260921T130908Z-E3b
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-09-21T13:09:08Z
  output: |
    Results: 70 passed, 0 failed

- eval: E3c
  run_id: rel218-20260921T130908Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-21T13:09:08Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: rel218-20260921T130908Z-E3d
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-09-21T13:09:08Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: rel218-20260921T130908Z-E3e
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-21T13:09:08Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: rel218-20260921T130908Z-E4
  exit_code: 0
  verifier: config:executors.script.rel218_cua_so
  verified_at: 2026-09-21T13:09:08Z
  output: |
    rút từ kho: ghim-lai-noi-ra-o-khong-do nhan-trang-thai-va-reality
    mốc kể    : ghim-lai-noi-ra-o-khong-do nhan-trang-thai-va-reality
    XANH: hai tập bằng nhau

- eval: E6
  run_id: rel218-20260921T130908Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-21T13:09:08Z
  output: |
    P200 VE: mo ta acceptance-gate co muc v2.18.0
    [chieu do] mo ta ag thieu muc cua so hien tai -> DO «mo ta acceptance-gate khong co muc v2.18.0 — ban phat hanh khong noi nguoi dung nhan gi»
    P200 VE: muc v2.18.0 cua feature-loop TU khai cap

## Known limits

1. **Người chấm là chính phiên thi công, không phải phiên tươi.** Mốc phát hành đi làn V và
   KHÔNG chạy lượt chấm S4 (nếp release-2-7-0/2-17-0). Doer = grader cho mốc này. Lưới đỡ phần
   này: chín phép đo đều là lệnh máy chạy lại được, không có mục phán xét; ca thường trực P200
   mang năm đột biến và một đối chứng dương nên số không thể tự dối; và lưới trước-merge chấm
   độc lập ở CI.
2. **Nội dung các vế «người dùng nhận gì»** trong mô tả hai gói và `CHANGELOG.md` là văn cho
   người — P200 chỉ kiểm mục `v2.18.0` CÓ MẶT và câu khai cặp nằm đúng mục, không kiểm nội dung.
   Đọc trong diff.
3. **Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — chưa có răng.** Mốc khai bằng lời
   trong Context: một kho (`crm`), ba hồ sơ, mỗi hồ sơ một lý do đo được. Ngưỡng đang đếm: một
   mốc cắt số mà sau 21 ngày không kho nào cài nó.
4. **Năm dòng số có ô «không đo được».** `ghim-lai-noi-ra-o-khong-do` không có `usage-report.md`,
   và lượt chấm 1 của `nhan-trang-thai-va-reality` không tách được ba khối vì nhãn vai bị khung
   chuyển tiếp nuốt. Hợp đồng khai thẳng thay vì đoán.

## Ngoài hợp đồng

none — làn V, không có làn rà soát.

## Analyst

n-a — mốc phát hành không có eval phân biệt cần đường nền A/B: chín phép đo đều là lệnh hồi quy
thường trực hoặc lệnh đo quan hệ có sẵn hai chiều đỏ trong chính nó.

## Variance

none — mọi eval chạy đúng một lần, không có eval ngẫu nhiên.

## Iterations

Một lượt, không có vòng chấm S4 (làn V). Chín phép đo chạy tuần tự trên cây `b02e25926ea9b1b5197187eb719ade3094bad3b6`, tất cả
thoát 0; thời gian: bộ kiểm plugin 406 s · script 458 s · hooks 2 s · workflows 3 s ·
bản đồ và lệnh đo cửa sổ dưới 1 s. Đường nền chạy hai lần: lần đầu đỏ vì bản đồ chưa vẽ hồ sơ mốc
(P122, P126, `product_map`), lần hai suite xanh và chỉ còn vi phạm «status draft» của chính nghi
thức, hết khi hồ sơ sang `implemented`.
