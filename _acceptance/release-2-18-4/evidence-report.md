---
schema_version: 2
feature_slug: release-2-18-4
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (làn V — mốc phát hành không chạy lượt chấm S4; tiền lệ release-2-7-0 → 2-18-3, xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: a57823988dba186f4363cad98d1b0f227f97edb7
human_signoff:
---

# Evidence — release-2-18-4

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
  run_id: rel2184-20260925T030438Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-25T03:06:18Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: acceptance-gate hop semver: 2.18.4 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: feature-loop hop semver: 2.18.4 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: diagram-design hop semver: 2.7.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: hai plugin cung so: 2.18.4 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven) (chạy riêng khối P200 trong vùng 3, cùng cây)

- eval: E2
  run_id: rel2184-20260925T030438Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-25T03:06:18Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: GUIDE khop so DOC TU manifest (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] GUIDE giu so cu -> DO «GUIDE khong chua cau dan xuat: Khớp phiên bản: acceptance-gate 2.18.4 · feature-loop 2.18.4 · diagram-design 2.7.0.» (chạy riêng khối P200 trong vùng 3, cùng cây)

- eval: E3
  run_id: rel2184-20260925T030438Z-E3
  exit_code: 0
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-09-25T03:08:35Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: rel2184-20260925T030438Z-E3f
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-09-25T03:11:21Z
  output: |
    Results: 20 passed, 0 failed

- eval: E3g
  run_id: rel2184-20260925T030438Z-E3g
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-09-25T03:13:11Z
  output: |
    Results: 19 passed, 0 failed

- eval: E3h
  run_id: rel2184-20260925T030438Z-E3h
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-09-25T03:16:25Z
  output: |
    Results: 19 passed, 0 failed

- eval: E3b
  run_id: rel2184-20260925T030438Z-E3b
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-09-25T03:16:27Z
  output: |
    Results: 70 passed, 0 failed

- eval: E3c
  run_id: rel2184-20260925T030438Z-E3c
  exit_code: 0
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-09-25T03:17:52Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: rel2184-20260925T030438Z-E3i
  exit_code: 0
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-09-25T03:22:35Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: rel2184-20260925T030438Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-25T03:06:18Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: rel2184-20260925T030438Z-E3d
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-09-25T03:22:39Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: rel2184-20260925T030438Z-E3e
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-25T03:22:40Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: rel2184-20260925T030438Z-E4
  exit_code: 0
  verifier: config:executors.script.rel2184_cua_so
  verified_at: 2026-09-25T03:22:40Z
  output: |
    rút từ kho: nen-cay-ban-dong-dau nen-chay-bang-moi-truong-nguoi-goi nen-cong-cu-gan-bang-lenh-con
    mốc kể    : nen-cay-ban-dong-dau nen-chay-bang-moi-truong-nguoi-goi nen-cong-cu-gan-bang-lenh-con
    XANH: hai tập bằng nhau

- eval: E5
  run_id: rel2184-20260925T030438Z-E5
  exit_code: 0
  verifier: config:executors.script.rel2184_dd_giu
  verified_at: 2026-09-25T03:22:40Z
  output: |
    (output rỗng — git diff không thấy dòng nào đổi dưới diagram-design/)

- eval: E6
  run_id: rel2184-20260925T030438Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-25T03:06:18Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: mo ta acceptance-gate co muc v2.18.4 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: muc v2.18.4 cua feature-loop TU khai cap (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] mo ta ag thieu muc cua so hien tai -> DO «mo ta acceptance-gate khong co muc v2.18.4 — ban phat hanh khong noi nguoi dung nhan gi» (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] cau khai cap doi sang muc lich su -> DO «muc v2.18.4 cua feature-loop khong khai cap acceptance-gate >= 2.18.4 — cau khai cap nam ngoai muc nay (sua muc lich su khong tinh)» (chạy riêng khối P200 trong vùng 3, cùng cây)

## Known limits

1. **Người chấm là chính phiên thi công, không phải phiên tươi.** Mốc phát hành đi làn V và KHÔNG
   chạy lượt chấm S4 (nếp release-2-7-0 → 2-18-3). Doer = grader cho mốc này. Lưới đỡ phần này: mười
   lăm phép đo đều là lệnh máy chạy lại được, không có mục phán xét; ca thường trực P200 mang năm
   đột biến và một đối chứng dương nên số không thể tự dối; và lưới trước-merge chấm độc lập ở CI.
2. **Nội dung các vế «người dùng nhận gì»** trong mô tả hai gói và `CHANGELOG.md` là văn cho người —
   P200 chỉ kiểm mục `v2.18.4` CÓ MẶT và câu khai cặp nằm đúng mục, không kiểm nội dung. Năm dòng số,
   bảng dự báo, điều kiện tin cậy ở mục `2.18.4` của `CHANGELOG.md` cũng chỉ đọc bằng mắt; số chạm
   mỗi lượt gọi người không đo được (sổ quyết định chỉ có một dấu giờ mỗi vòng), và token lượt thử
   lại của `nen-chay-bang-moi-truong-nguoi-goi` không có trong báo cáo chi phí.
3. **Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — chưa có răng.** Mốc khai bằng lời trong
   Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.
4. **Tag `v2.18.4` không có phép đo trong hồ sơ.** Nó gắn SAU chữ ký, tại commit ký mốc trên `main`;
   kiểm bằng `git ls-remote --tags origin v2.18.4` sau khi đẩy.
5. **Dòng vế của P200** lấy từ một lượt chạy riêng khối P200 (trích nguyên khối từ
   `tests/plugins/run-tests.sh`, chạy `node p200.mjs <gốc kho>`) trên cùng cây, vì lệnh vùng 3 lọc đầu
   ra chỉ còn dòng FAIL/Results; lượt riêng ấy không có run_id trong run-log.
6. **Mục test plan còn trống của PR #216** — «đường nền ở crm@onehub thôi ghi `THIEU merge-base`» — chỉ
   đo được SAU khi crm cài 2.18.4; không là tiêu chí của mốc. Bằng chứng trước mốc: bộ tách của cây
   này đọc hai khoá `zqw_giu_nqz` và `nzm_giu_da_ky` của config crm ra `git` (đo tay 25/09).

## Ngoài hợp đồng

none — làn V, không có làn rà soát.

## Analyst

n-a — mốc phát hành không có eval phân biệt cần đường nền A/B: các phép đo đều là lệnh hồi quy
thường trực hoặc lệnh đo quan hệ có sẵn chiều đỏ trong chính nó.

## Variance

none — mọi eval chạy đúng một lần, không có eval ngẫu nhiên.

## Iterations

Round 1 — một lượt, không có vòng chấm S4 (làn V). Mười hai lệnh riêng biệt chạy tuần tự trên cây
`a57823988dba186f4363cad98d1b0f227f97edb7`, tất cả thoát 0, cây sạch sau lượt chạy; thời gian: vùng plugins 1/2/3 85 s · 283 s · 100 s ·
mảnh scripts bash/mjs1/mjs2/mjs3 137 s · 166 s · 110 s · 194 s · hooks 2 s · workflows 4 s ·
bản đồ, lệnh đo cửa sổ và lệnh so diagram-design dưới 2 s. Chiều đỏ của E4 và E5 đo tay trước lượt
chạy (xem `expected` trong `evals.yaml`).
