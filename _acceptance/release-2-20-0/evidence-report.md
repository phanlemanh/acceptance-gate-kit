---
schema_version: 2
feature_slug: release-2-20-0
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (làn V — mốc phát hành không chạy lượt chấm S4; tiền lệ release-2-7-0 → 2-19-0, xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: a06277e025044dfe1aa94d55e8110eccf00a2b56
human_signoff: Phan Le Manh 2026-10-02 — ký mốc phát hành 2.20.0 với bảy known-limits đã khai; cắt/hoãn: đồng ý cắt; Treo: phê hết
---

# Evidence — release-2-20-0

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
  run_id: rel2200-20261001T165833Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-01T17:15:31Z
  output: |
    Results: all plugin tests passed
    P200 VE: acceptance-gate hop semver: 2.20.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: feature-loop hop semver: 2.20.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: diagram-design hop semver: 2.7.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: hai plugin cung so: 2.20.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] hai plugin lech so -> DO «hai plugin lech so: acceptance-gate 2.20.0 vs feature-loop 0.0.1» (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven) (chạy riêng khối P200 trong vùng 3, cùng cây)

- eval: E2
  run_id: rel2200-20261001T165833Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-01T17:15:31Z
  output: |
    Results: all plugin tests passed
    P200 VE: GUIDE khop so DOC TU manifest (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] GUIDE giu so cu -> DO «GUIDE khong chua cau dan xuat: Khớp phiên bản: acceptance-gate 2.20.0 · feature-loop 2.20.0 · diagram-design 2.7.0.» (chạy riêng khối P200 trong vùng 3, cùng cây)

- eval: E3
  run_id: rel2200-20261001T165833Z-E3
  exit_code: 0
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-01T16:58:33Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: rel2200-20261001T165833Z-E3f
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-01T17:00:39Z
  output: |
    Results: 22 passed, 0 failed

- eval: E3g
  run_id: rel2200-20261001T165833Z-E3g
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-01T17:04:33Z
  output: |
    Results: 22 passed, 0 failed

- eval: E3h
  run_id: rel2200-20261001T165833Z-E3h
  exit_code: 0
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-01T17:07:32Z
  output: |
    Results: 21 passed, 0 failed

- eval: E3b
  run_id: rel2200-20261001T165833Z-E3b
  exit_code: 0
  verifier: config:executors.test.hooks
  verified_at: 2026-10-01T17:09:35Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: rel2200-20261001T165833Z-E3c
  exit_code: 0
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-01T17:09:39Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: rel2200-20261001T165833Z-E3i
  exit_code: 0
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-01T17:10:59Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: rel2200-20261001T165833Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-01T17:15:31Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: rel2200-20261001T165833Z-E3d
  exit_code: 0
  verifier: config:executors.test.workflows
  verified_at: 2026-10-01T17:17:07Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: rel2200-20261001T165833Z-E3e
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-10-01T17:17:11Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: rel2200-20261001T165833Z-E4
  exit_code: 0
  verifier: config:executors.script.rel2200_cua_so
  verified_at: 2026-10-01T17:17:11Z
  output: |
    rút từ kho: luot-cham-ghi-vao-cay thuoc-biet-truoc-khong-phan-duoc
    mốc kể    : luot-cham-ghi-vao-cay thuoc-biet-truoc-khong-phan-duoc
    XANH: hai tập bằng nhau

- eval: E5
  run_id: rel2200-20261001T165833Z-E5
  exit_code: 0
  verifier: config:executors.script.rel2200_dd_giu
  verified_at: 2026-10-01T17:17:11Z
  output: |
    (đầu ra rỗng — đúng kỳ vọng)

- eval: E6
  run_id: rel2200-20261001T165833Z-E1E2E3jE6
  exit_code: 0
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-01T17:15:31Z
  output: |
    Results: all plugin tests passed
    P200 VE: mo ta acceptance-gate co muc v2.20.0 (chạy riêng khối P200 trong vùng 3, cùng cây)
    P200 VE: muc v2.20.0 cua feature-loop TU khai cap (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] mo ta ag thieu muc cua so hien tai -> DO «mo ta acceptance-gate khong co muc v2.20.0 — ban phat hanh khong noi nguoi dung nhan gi» (chạy riêng khối P200 trong vùng 3, cùng cây)
    [chieu do] cau khai cap doi sang muc lich su -> DO «muc v2.20.0 cua feature-loop khong khai cap acceptance-gate >= 2.20.0 — cau khai cap nam ngoai muc nay (sua muc lich su khong tinh)» (chạy riêng khối P200 trong vùng 3, cùng cây)

## Known limits

1. **Người chấm là chính phiên làm mốc, không phải phiên tươi.** Mốc phát hành đi làn V và KHÔNG chạy
   lượt chấm S4 (nếp release-2-7-0 → 2-19-0). Doer = grader cho mốc này. Lưới đỡ phần này: mười lăm
   phép đo đều là lệnh máy chạy lại được, không có mục phán xét; ca thường trực P200 mang năm đột biến
   và một đối chứng dương nên số không thể tự dối; và lưới trước-merge chấm độc lập ở CI.
2. **Nội dung các vế «người dùng nhận gì»** trong mô tả hai gói và `CHANGELOG.md` là văn cho người —
   P200 chỉ kiểm mục `v2.20.0` CÓ MẶT và câu khai cặp nằm đúng mục, không kiểm nội dung. Năm dòng số,
   bảng dự báo, điều kiện tin cậy ở mục `2.20.0` của `CHANGELOG.md` cũng chỉ đọc bằng mắt; chúng rút từ
   giờ commit, `decisions.jsonl`, `run-log.jsonl` và `usage-report.md` của ba hồ sơ (phần tách ba khối
   tính bằng máy từ bảng vai trò); ô phút của `luot-cham-ghi-vao-cay` khai «không đọc được ở đây» vì
   tường gồm khoảng máy đóng; token phiên chính không đo.
3. **Tiêu chí cửa sổ (AC-4) không phủ hồ sơ máy thông.** `scripts/rel-cua-so.sh` chỉ rút hồ sơ
   `signed-off`, nên `nghi-van-mang-co-qua-han` được kể riêng trong Context mà không phép đo nào giữ;
   một mốc quên kể vòng máy thông sẽ không đỏ. Bàn giao 01/10 bảo chạy lệnh với ba slug — lệnh ấy thoát 1
   (đo thật, ghi ở E4). Sổ `d-20261001T165533Z-3`. Ngưỡng mở việc sửa công cụ: ≥1 mốc kể thiếu một vòng
   máy thông mà chỉ người đọc diff bắt được.
4. **Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — chưa có răng.** Mốc khai bằng lời trong
   Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.
5. **Tag `v2.20.0` không có phép đo trong hồ sơ.** Nó gắn SAU chữ ký, tại commit ký mốc trên `main`;
   kiểm bằng `git ls-remote --tags origin v2.20.0` sau khi đẩy.
6. **Dòng vế của P200** lấy từ một lượt chạy riêng khối P200 (trích nguyên khối từ
   `tests/plugins/run-tests.sh`, chạy `node p200.mjs <gốc kho>`) trên cùng cây, vì lệnh vùng 3 lọc đầu
   ra chỉ còn dòng FAIL/Results; lượt riêng ấy không có run_id trong run-log.
7. **Ngưỡng của hai răng mới** (eval judgment hỏi ngoài inputs tới được lượt chấm phải về 0 · số lượt
   chấm mang nhãn «cây đổi») chỉ đếm được SAU khi crm cài 2.20.0; không là tiêu chí của mốc.

## Ngoài hợp đồng

none — làn V, không có làn rà soát.

## Analyst

n-a — mốc phát hành không có eval phân biệt cần đường nền A/B: các phép đo đều là lệnh hồi quy
thường trực hoặc lệnh đo quan hệ có sẵn chiều đỏ trong chính nó.

## Variance

none — mọi eval chạy đúng một lần trên cây được ghim, không có eval ngẫu nhiên.

## Iterations

Round 1 — không có vòng chấm S4 (làn V). Mười hai lệnh riêng biệt chạy tuần tự một lần trên cây
`a06277e025044dfe1aa94d55e8110eccf00a2b56`, tất cả thoát 0, cây sạch sau từng lệnh; thời gian: E3 126 s · E3f 234 s · E3g 178 s · E3h 124 s · E3b 4 s · E3c 81 s · E3i 272 s · E1/E2/E3j/E6 95 s · E3d 4 s · E3e 0 s · E4 0 s · E5 0 s.
Chiều đỏ của E4 và E5 chạy tay trong phiên (E4: thêm `nghi-van-mang-co-qua-han` → «ĐỎ: mốc kể hồ sơ
KHÔNG được ký trong cửa sổ: nghi-van-mang-co-qua-han», thoát 1 · E5: cùng lệnh với mốc `06331ab2~1` →
thoát 1, in tệp đổi); chiều đỏ của E1, E2, E6 sống trong P200 (năm đột biến).
