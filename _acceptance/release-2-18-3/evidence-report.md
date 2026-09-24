---
schema_version: 2
feature_slug: release-2-18-3
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (làn V — mốc phát hành không chạy lượt chấm S4; tiền lệ release-2-7-0 → 2-18-2, xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: 2e097bfe6f82c1a33fefe6798d89dad009f7e6e3
human_signoff: Phan Le Manh 2026-09-24 — ký mốc phát hành 2.18.3 với năm known-limits đã khai; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence — release-2-18-3

| Eval | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | PASS |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: rel2183-20260924T051040Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: acceptance-gate hop semver: 2.18.3 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: feature-loop hop semver: 2.18.3 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: diagram-design hop semver: 2.7.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: hai plugin cung so: 2.18.3 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven) (chạy riêng khối P200 trong vùng 3, cùng cây)

- eval: E2
  run_id: rel2183-20260924T051040Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: GUIDE khop so DOC TU manifest (chạy riêng khối P200 trong vùng 3, cùng cây)

- eval: E3
  run_id: rel2183-20260924T051040Z-E3
  exit_code: 0
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: rel2183-20260924T051040Z-E3f
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-09-24T05:10:40Z
  output: |
    

- eval: E3g
  run_id: rel2183-20260924T051040Z-E3g
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: 19 passed, 0 failed

- eval: E3h
  run_id: rel2183-20260924T051040Z-E3h
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: 19 passed, 0 failed

- eval: E3b
  run_id: rel2183-20260924T051040Z-E3b
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: 70 passed, 0 failed

- eval: E3c
  run_id: rel2183-20260924T051040Z-E3c
  exit_code: 0
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: rel2183-20260924T051040Z-E3i
  exit_code: 0
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: rel2183-20260924T051040Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: rel2183-20260924T051040Z-E3d
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: rel2183-20260924T051040Z-E3e
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-24T05:10:40Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: rel2183-20260924T051040Z-E4
  exit_code: 0
  verifier: config:executors.script.rel2183_cua_so
  verified_at: 2026-09-24T05:10:40Z
  output: |
    rút từ kho: ha-tang-khong-dot-luot
    mốc kể    : ha-tang-khong-dot-luot
    XANH: hai tập bằng nhau

- eval: E5
  run_id: rel2183-20260924T051040Z-E5
  exit_code: 0
  verifier: config:executors.script.rel2183_dd_giu
  verified_at: 2026-09-24T05:10:40Z
  output: |
    (output rỗng — git diff không thấy dòng nào đổi dưới diagram-design/)

- eval: E6
  run_id: rel2183-20260924T051040Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-24T05:10:40Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: mo ta acceptance-gate co muc v2.18.3 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: muc v2.18.3 cua feature-loop TU khai cap (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] mo ta ag thieu muc cua so hien tai -> DO «mo ta acceptance-gate khong co muc v2.18.3 — ban phat hanh khong noi nguoi dung nhan gi» (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] cau khai cap doi sang muc lich su -> DO «muc v2.18.3 cua feature-loop khong khai cap acceptance-gate >= 2.18.3 — cau khai cap nam ngoai muc nay (sua muc lich su khong tinh)» (chạy riêng khối P200 trong vùng 3, cùng cây)

## Known limits

1. **Người chấm là chính phiên thi công, không phải phiên tươi.** Mốc phát hành đi làn V và KHÔNG
   chạy lượt chấm S4 (nếp release-2-7-0 → 2-18-2). Doer = grader cho mốc này. Lưới đỡ phần này: mười
   lăm phép đo đều là lệnh máy chạy lại được, không có mục phán xét; ca thường trực P200 mang năm
   đột biến và một đối chứng dương nên số không thể tự dối; và lưới trước-merge chấm độc lập ở CI.
2. **Nội dung các vế «người dùng nhận gì»** trong mô tả hai gói và `CHANGELOG.md` là văn cho người —
   P200 chỉ kiểm mục `v2.18.3` CÓ MẶT và câu khai cặp nằm đúng mục, không kiểm nội dung. Năm dòng số,
   bảng dự báo, điều kiện tin cậy ở mục `2.18.3` của `CHANGELOG.md` cũng chỉ đọc bằng mắt: dòng 4
   tách ba khối theo model vì nhãn vai mất trong báo cáo chi phí của vòng.
3. **Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — chưa có răng.** Mốc khai bằng lời trong
   Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.
4. **Tag `v2.18.3` không có phép đo trong hồ sơ.** Nó gắn SAU chữ ký, tại commit ký mốc trên `main`;
   kiểm bằng `git ls-remote --tags origin v2.18.3` sau khi đẩy.
5. **Dòng vế của P200** lấy từ một lượt chạy riêng khối P200 trong vùng 3 trên cùng cây, vì lệnh vùng
   3 lọc đầu ra chỉ còn dòng FAIL/Results; lượt riêng ấy không có run_id trong run-log.

## Ngoài hợp đồng

none — làn V, không có làn rà soát.

## Analyst

n-a — mốc phát hành không có eval phân biệt cần đường nền A/B: các phép đo đều là lệnh hồi quy
thường trực hoặc lệnh đo quan hệ có sẵn chiều đỏ trong chính nó.

## Variance

none — mọi eval chạy đúng một lần, không có eval ngẫu nhiên.

## Iterations

Round 1 — một lượt, không có vòng chấm S4 (làn V). Mười hai lệnh riêng biệt chạy tuần tự trên cây
`2e097bfe6f82c1a33fefe6798d89dad009f7e6e3`, tất cả thoát 0; thời gian: vùng plugins 1/2/3 89 s · 271 s · 102 s ·
mảnh scripts bash/mjs1/mjs2/mjs3 137 s · 170 s · 89 s · 199 s · hooks 2 s · workflows 4 s ·
bản đồ, lệnh đo cửa sổ và lệnh so diagram-design dưới 1 s. Lượt đo trước trên `af0f04e8` đỏ ở vùng 3
(PD7b: CHANGELOG mang một lệnh plugin ngoài khối khai của GUIDE); sửa câu ấy rồi đo lại toàn bộ.
