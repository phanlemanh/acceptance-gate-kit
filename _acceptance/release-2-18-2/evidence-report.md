---
schema_version: 2
feature_slug: release-2-18-2
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (làn V — mốc phát hành không chạy lượt chấm S4; tiền lệ release-2-7-0 → 2-18-1, xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: 30622970c243b9fbe95d92f8e45910f4ac091684
human_signoff: manh 2026-09-23 — ký mốc phát hành 2.18.2 với bốn known-limits đã khai; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence — release-2-18-2

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
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: rel2182-20260923T142704Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-23T14:27:04Z
  output: |
    P200 VE: acceptance-gate hop semver: 2.18.2
    P200 VE: feature-loop hop semver: 2.18.2
    P200 VE: diagram-design hop semver: 2.7.0
    P200 VE: hai plugin cung so: 2.18.2
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)

- eval: E2
  run_id: rel2182-20260923T142704Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-23T14:27:04Z
  output: |
    P200 VE: GUIDE khop so DOC TU manifest

- eval: E3
  run_id: rel2182-20260923T142704Z-E3
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-09-23T14:27:04Z
  output: |
    Results: 892 passed, 0 failed

- eval: E3b
  run_id: rel2182-20260923T142704Z-E3b
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-09-23T14:27:04Z
  output: |
    Results: 70 passed, 0 failed

- eval: E3c
  run_id: rel2182-20260923T142704Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-23T14:27:04Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: rel2182-20260923T142704Z-E3d
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-09-23T14:27:04Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: rel2182-20260923T142704Z-E3e
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-23T14:27:04Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: rel2182-20260923T142704Z-E4
  exit_code: 0
  verifier: config:executors.script.rel2182_cua_so
  verified_at: 2026-09-23T14:27:04Z
  output: |
    rút từ kho: chot-may-chu-ky-sau-synthesize
    mốc kể    : chot-may-chu-ky-sau-synthesize
    XANH: hai tập bằng nhau

- eval: E5
  run_id: rel2182-20260923T142704Z-E5
  exit_code: 0
  verifier: config:executors.script.rel2182_dd_giu
  verified_at: 2026-09-23T14:27:04Z
  output: |
    (output rỗng — git diff không thấy dòng nào đổi dưới diagram-design/)

- eval: E6
  run_id: rel2182-20260923T142704Z-E1E2E3cE6
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-09-23T14:27:04Z
  output: |
    P200 VE: mo ta acceptance-gate co muc v2.18.2
    P200 VE: muc v2.18.2 cua feature-loop TU khai cap
    [chieu do] mo ta ag thieu muc cua so hien tai -> DO «mo ta acceptance-gate khong co muc v2.18.2 — ban phat hanh khong noi nguoi dung nhan gi»
    [chieu do] cau khai cap doi sang muc lich su -> DO «muc v2.18.2 cua feature-loop khong khai cap acceptance-gate >= 2.18.2 — cau khai cap nam ngoai muc nay (sua muc lich su khong tinh)»

## Known limits

1. **Người chấm là chính phiên thi công, không phải phiên tươi.** Mốc phát hành đi làn V và
   KHÔNG chạy lượt chấm S4 (nếp release-2-7-0 → 2-18-1). Doer = grader cho mốc này. Lưới đỡ
   phần này: mười phép đo đều là lệnh máy chạy lại được, không có mục phán xét; ca thường trực
   P200 mang năm đột biến và một đối chứng dương nên số không thể tự dối; và lưới trước-merge
   chấm độc lập ở CI.
2. **Nội dung các vế «người dùng nhận gì»** trong mô tả hai gói và `CHANGELOG.md` là văn cho
   người — P200 chỉ kiểm mục `v2.18.2` CÓ MẶT và câu khai cặp nằm đúng mục, không kiểm nội dung.
   Năm dòng số, bảng dự báo và điều kiện tin cậy ở mục `2.18.2` của `CHANGELOG.md` cũng chỉ đọc
   bằng mắt: dòng 4 tách ba khối theo model và số lượt gọi ở bốn trong năm lượt vì nhãn vai mất.
3. **Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — chưa có răng.** Mốc khai bằng lời
   trong Context: sáu kho, hai đã ghim sha chờ đổi. Ngưỡng đang đếm: một mốc cắt số mà sau 21
   ngày không kho nào cài nó.
4. **Tag `v2.18.2` không có phép đo trong hồ sơ.** Nó gắn SAU chữ ký, tại commit ký mốc trên
   `main`; kiểm bằng `git ls-remote --tags origin v2.18.2` sau khi đẩy.

## Ngoài hợp đồng

none — làn V, không có làn rà soát.

## Analyst

n-a — mốc phát hành không có eval phân biệt cần đường nền A/B: mười phép đo đều là lệnh hồi quy
thường trực hoặc lệnh đo quan hệ có sẵn chiều đỏ trong chính nó.

## Variance

none — mọi eval chạy đúng một lần, không có eval ngẫu nhiên.

## Iterations

Một lượt, không có vòng chấm S4 (làn V). Mười phép đo chạy tuần tự trên cây `30622970c243b9fbe95d92f8e45910f4ac091684`, tất cả
thoát 0; thời gian: bộ kiểm plugin 399 s · script 707 s · hooks 1 s ·
workflows 4 s · bản đồ, lệnh đo cửa sổ và lệnh so diagram-design dưới 1 s.
