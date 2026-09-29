---
schema_version: 2
feature_slug: release-2-19-0
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (làn V — mốc phát hành không chạy lượt chấm S4; tiền lệ release-2-7-0 → 2-18-5, xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: a03dad1ddff474ec328bc28d2b6a627719331e95
human_signoff: Manh Phan 2026-09-29 — ký mốc phát hành 2.19.0 với sáu known-limits đã khai; cắt/hoãn: đồng ý cắt; Treo: phê hết
---

# Evidence — release-2-19-0

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
  run_id: rel2190-20260929T133016Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-29T13:44:03Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: acceptance-gate hop semver: 2.19.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: feature-loop hop semver: 2.19.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: diagram-design hop semver: 2.7.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: hai plugin cung so: 2.19.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven) (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] hai plugin lech so -> DO «hai plugin lech so: acceptance-gate 2.19.0 vs feature-loop 0.0.1» (chạy riêng khối P200 trong vùng 3, cùng cây)

- eval: E2
  run_id: rel2190-20260929T133016Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-29T13:44:03Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: GUIDE khop so DOC TU manifest (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] GUIDE giu so cu -> DO «GUIDE khong chua cau dan xuat: Khớp phiên bản: acceptance-gate 2.19.0 · feature-loop 2.19.0 · diagram-design 2.7.0.» (chạy riêng khối P200 trong vùng 3, cùng cây)

- eval: E3
  run_id: rel2190-20260929T133016Z-E3
  exit_code: 0
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-09-29T13:30:16Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: rel2190-20260929T133016Z-E3f
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-09-29T13:32:13Z
  output: |
    Results: 22 passed, 0 failed

- eval: E3g
  run_id: rel2190-20260929T133016Z-E3g
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-09-29T13:34:43Z
  output: |
    Results: 21 passed, 0 failed

- eval: E3h
  run_id: rel2190-20260929T133016Z-E3h
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-09-29T13:36:18Z
  output: |
    Results: 21 passed, 0 failed

- eval: E3b
  run_id: rel2190-20260929T133016Z-E3b
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-09-29T13:39:06Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: rel2190-20260929T133016Z-E3c
  exit_code: 0
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-09-29T13:39:10Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: rel2190-20260929T133016Z-E3i
  exit_code: 0
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-09-29T13:40:13Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: rel2190-20260929T133016Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-29T13:44:03Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: rel2190-20260929T133016Z-E3d
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-09-29T13:45:20Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: rel2190-20260929T133016Z-E3e
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-29T13:45:23Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: rel2190-20260929T133016Z-E4
  exit_code: 0
  verifier: config:executors.script.rel2190_cua_so
  verified_at: 2026-09-29T13:45:23Z
  output: |
    rút từ kho: mot-so-ba-ve
    mốc kể    : mot-so-ba-ve
    XANH: hai tập bằng nhau

- eval: E5
  run_id: rel2190-20260929T133016Z-E5
  exit_code: 0
  verifier: config:executors.script.rel2190_dd_giu
  verified_at: 2026-09-29T13:45:23Z
  output: |
    (đầu ra rỗng — git diff --exit-code không thấy dòng nào đổi dưới diagram-design/)

- eval: E6
  run_id: rel2190-20260929T133016Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-09-29T13:44:03Z
  output: |
    Results: all plugin tests passed (lệnh vùng 3 lọc chỉ in FAIL/Results)
    P200 VE: mo ta acceptance-gate co muc v2.19.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: muc v2.19.0 cua feature-loop TU khai cap (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] mo ta ag thieu muc cua so hien tai -> DO «mo ta acceptance-gate khong co muc v2.19.0 — ban phat hanh khong noi nguoi dung nhan gi» (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] cau khai cap doi sang muc lich su -> DO «muc v2.19.0 cua feature-loop khong khai cap acceptance-gate >= 2.19.0 — cau khai cap nam ngoai muc nay (sua muc lich su khong tinh)» (chạy riêng khối P200 trong vùng 3, cùng cây)

## Known limits

1. **Người chấm là chính phiên thi công, không phải phiên tươi.** Mốc phát hành đi làn V và KHÔNG
   chạy lượt chấm S4 (nếp release-2-7-0 → 2-18-5). Doer = grader cho mốc này. Lưới đỡ phần này: mười
   lăm phép đo đều là lệnh máy chạy lại được, không có mục phán xét; ca thường trực P200 mang năm
   đột biến và một đối chứng dương nên số không thể tự dối; và lưới trước-merge chấm độc lập ở CI.
2. **Nội dung các vế «người dùng nhận gì»** trong mô tả hai gói và `CHANGELOG.md` là văn cho người —
   P200 chỉ kiểm mục `v2.19.0` CÓ MẶT và câu khai cặp nằm đúng mục, không kiểm nội dung. Năm dòng số,
   bảng dự báo, điều kiện tin cậy ở mục `2.19.0` của `CHANGELOG.md` cũng chỉ đọc bằng mắt; hai dòng số
   đầu chép từ bàn giao 29/09 của máy làm vòng (memory phiên ấy không sang máy này); token của phiên
   chính không đo.
3. **Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — chưa có răng.** Mốc khai bằng lời trong
   Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.
4. **Tag `v2.19.0` không có phép đo trong hồ sơ.** Nó gắn SAU chữ ký, tại commit ký mốc trên `main`;
   kiểm bằng `git ls-remote --tags origin v2.19.0` sau khi đẩy.
5. **Dòng vế của P200** lấy từ một lượt chạy riêng khối P200 (trích nguyên khối từ
   `tests/plugins/run-tests.sh`, chạy `node p200.mjs <gốc kho>`) trên cùng cây, vì lệnh vùng 3 lọc đầu
   ra chỉ còn dòng FAIL/Results; lượt riêng ấy không có run_id trong run-log.
6. **Ngưỡng nghiệm thu của vòng trong cửa sổ** (`mot-so-ba-ve`: 100 % ruling trong khối «Rulings I made»
   có mã sổ ở vòng crm kế chạy S3 dưới superpowers; nền 28/09 là 4/11) chỉ đo được SAU khi crm cài 2.19.0
   và khởi động lại phiên; không là tiêu chí của mốc.

## Ngoài hợp đồng

none — làn V, không có làn rà soát.

## Analyst

n-a — mốc phát hành không có eval phân biệt cần đường nền A/B: các phép đo đều là lệnh hồi quy
thường trực hoặc lệnh đo quan hệ có sẵn chiều đỏ trong chính nó.

## Variance

none — mọi eval chạy đúng một lần trên cây được ghim, không có eval ngẫu nhiên.

## Iterations

Round 1 — không có vòng chấm S4 (làn V). Lượt đầu trên cây `332321a4` ĐỎ hai lệnh (vùng 1 plugins:
P122 · P126; `product-map --check`) vì bản đồ không được vẽ lại khi hồ sơ mốc đổi trạng thái — lỗi của
phiên làm mốc, không phải của vật. Vẽ lại bản đồ trong commit «code xong», rồi chạy lại TRỌN mười hai
lệnh riêng biệt tuần tự trên cây `a03dad1ddff474ec328bc28d2b6a627719331e95`, tất cả thoát 0, cây sạch sau lượt chạy; thời gian: E3 117 s · E3f 149 s · E3g 95 s · E3h 168 s · E3b 4 s · E3c 63 s · E3i 230 s · E1/E2/E3j/E6 77 s · E3d 4 s · E3e 0 s · E4 0 s · E5 0 s.
Chiều đỏ của E4 và E5 chạy tay trong phiên (E4: bỏ slug thật, thêm «slug-gia» → hai dòng «ĐỎ» gọi tên
cả hai, thoát 1 · E5: cùng lệnh với mốc `06331ab2~1` → thoát 1, in tệp đổi); chiều đỏ của E1, E2, E6
sống trong P200 (năm đột biến).
