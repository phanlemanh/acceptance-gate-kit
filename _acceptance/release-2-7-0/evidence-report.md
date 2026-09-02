---
schema_version: 2
feature_slug: release-2-7-0
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (gap-probe context sạch do phiên tươi độc lập làm — xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: 175999b964b34bb3812bf9b6c16fcf8669c77d26
human_signoff: Manh Phan 2026-09-03 — ký mốc phát hành 2.7.0 với 7 known-limits đã khai; Ngoài-1 mở hợp đồng mới; đồng ý phạm vi đã cắt; phê cả 5 quyết định ghi sau Cổng Phạm vi; trần T3 đọc theo nguyên tắc, = 4
---

# Evidence Report: release-2-7-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

Sinh TỪ `run-log.jsonl` vòng 1, không gõ tay: `verified_at` là giờ kết thúc
thật của lượt chạy, `exit_code` là mã thoát thật. Bốn eval dùng chung một lượt
chạy `plugins` (dedupe đã khai ở evals.yaml) nên mang cùng giờ.

- eval: E1
  run_id: release-2-7-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-02T17:04:09Z
  output: |
    P200 VE: hai plugin cung so: 2.7.0
    P200 VE: acceptance-gate hop semver: 2.7.0 · feature-loop hop semver: 2.7.0 · diagram-design hop semver: 2.7.0
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
    Results: all plugin tests passed

- eval: E2
  run_id: release-2-7-0-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-02T17:04:09Z
  output: |
    P200 VE: GUIDE khop so DOC TU manifest
    Results: all plugin tests passed

- eval: E3
  run_id: release-2-7-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T16:59:45Z
  output: |
    Results: 795 passed, 0 failed

- eval: E3b
  run_id: release-2-7-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-02T17:04:12Z
  output: |
    Results: 60 passed, 0 failed

- eval: E3c
  run_id: release-2-7-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-02T17:04:09Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: release-2-7-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-09-02T17:04:14Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: release-2-7-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: node scripts/product-map.mjs --root . --check
  verified_at: 2026-09-02T17:04:14Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: release-2-7-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-02T17:04:09Z
  output: |
    P200 VE: mo ta acceptance-gate co muc v2.7.0
    P200 VE: muc v2.7.0 cua feature-loop TU khai cap
    Results: all plugin tests passed

## Vòng chấm

| Vòng | Cây | Máy | Đối kháng | Kết quả |
|---|---|---|---|---|
| r0 (mở hồ sơ) | `15ebbbc6` | scripts 794/1 · LM13 + LM20 đỏ vì chính hồ sơ mới (gap-probe chưa có → cờ rơi bậc ĐÚNG; bản ghi mốc thiếu dòng) | gap-probe context sạch: **findings — P0 1 · P1 4 · P2 7** | sửa lời, không sửa mã |
| r1 | `175999b9` | 8/8 XANH, bản đồ khớp | P0 + 4 P1 đóng bằng sửa mệnh đề (`0c5b7809`); P2 khai Notes | **PASS** |

Chấm lại TOÀN BỘ ở r1 sau khi sửa, không chỉ phần vừa vá.

## Bốn tiêu chí được chứng thế nào

- **AC-1/AC-2/AC-6** — ca vĩnh viễn P200: mọi số đọc TỪ manifest, câu GUIDE
  dựng từ ba số rồi so, mục `v2.7.0` cắt đúng đoạn; 5 đột biến + đối chứng
  dương chạy trong chính ca. Không có răng riêng cho mốc (nếp 2.3.0→2.6.0).
- **AC-3** — bốn suite + `product-map --check` tại `175999b9`.

## Gap-probe context sạch — định đoạt từng dòng

| Hạng | Phát hiện | Định đoạt |
|---|---|---|
| P0 | Manifest + Context khai thẻ Cổng 2 «fail-closed» khi đối kháng không chạy — SAI, rơi bậc chỉ có ở Cổng 1 (AC-4 #136; 5 fixture Cổng 2 vẫn điền sẵn) | Sửa LỜI ở manifest + hợp đồng; hành vi thật ghi Known limits #3 — sửa mã là vòng sau, không ở mốc phát hành |
| P1 | Hai bộ số cho #136 (3/≥6 vs 4/≥7); vế «≥4 lần resume» không có vết | Thống nhất 4 + ≥6 có vết; ghi rõ evidence-report #136 đếm trước lúc ký |
| P1 | «4 đúng số cổng T3» là định ngữ thêm sau; «trượt ở hạ tầng, không ở vật» sai vì 4 > 3 ngay cả 0 ngoài thiết kế | Hợp đồng ghi TRƯỢT cả hai vế + hai cách đọc, KHÔNG chọn hộ — câu hỏi cho người ký (mục dưới) |
| P1 | Timestamp sổ S1 sau commit mở hồ sơ (tái phát 2.5.0/2.6.0) | Sửa về `16:30:00Z` trước commit; sổ #136 lệch 2–5h khai Known limits #5 |
| P1 | Radar là quan sát từ ảnh chụp, không phải phép đo; «2 ô» suy từ luật; cùng ngày, không phải hôm trước | Sửa lời ở cả manifest lẫn hợp đồng |
| P2 ×7 | «207 dòng» → +173/−34 · E3e viết lệnh thay khoá config · literal AC-1 · «Vòng chấm 8» Radar không nguồn trong repo · `indexOf` đầu của P200 cho mốc sau · … | Sửa số; các vế còn lại ghi Notes hợp đồng |

## Ngoài hợp đồng

- **Thẻ Cổng 2 không có luật rơi bậc — gap-probe vắng hay hỏng vẫn điền sẵn cắt/hoãn + Treo, token verdict lạ in nguyên văn như phán quyết**
  Người dùng thấy gì: ở Cổng 2, nếu phiên phản biện chưa chạy hoặc file của nó hỏng, thẻ vẫn bảo «máy đã điền sẵn» hai ô như thể đối kháng đã hội tụ — đúng thứ luật rơi bậc cấm ở Cổng 1, nhưng vòng #136 chỉ làm cho Cổng 1.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

## Known limits

1. **Bằng chứng KHÔNG do phiên sạch tạo.** Tám eval do chính phiên thi công
   chạy; phần đối kháng có phiên tươi độc lập, và chính nó tìm ra 12 phát hiện
   trong khi phép đo máy tìm ra 0. Cùng giới hạn 2.5.0 → 2.6.0, chưa đóng.
2. **Giá trị chạm người dùng của mốc là bốn thứ** trong mục v2.7.0 của manifest;
   phần lưới thường trực (43 ca) là việc-trong-nhà.
3. **Thẻ Cổng 2 không rơi bậc** (P0 gap-probe) — khai ở Ngoài hợp đồng trên,
   người ký định đoạt.
4. **Bộ đếm «lần gọi người» vẫn đếm tay.** ≥10 cho #136 là số người đếm từ vết
   hội thoại; ba mốc liên tiếp cùng giới hạn.
5. **Dấu thời gian trong sổ #136 lệch về tương lai 2–5h so với commit chứa
   nó** (gap-probe bắt) — sổ append-only, không viết lại; đây là lớp lặp thứ ba
   (2.5.0 · 2.6.0 · #136).
6. **Bản ghi mốc định tuyến sống trong hồ sơ đã ký `loi-moi-cong-may-sinh`**, nên
   mốc này phải ghim lại hồ sơ đó hai lần chỉ vì thêm một hồ sơ. Chỗ đúng là
   `tests/scripts/fixtures/`; gộp vào Ngoài-1 của #136 khi mở.
7. **Ba dòng số của vòng Radar chưa đếm** — vết ở kho tiêu thụ; ghi điểm quan
   sát, để mốc kế đếm. Dấu hiệu đo-thước-của-thước trên vòng SẢN PHẨM (dừng-vá
   nổ ba lần) thuộc ngưỡng luật (a) và chưa được đọc.

## Ba dòng số — phần người ký nhận trách nhiệm

| Dòng | Đọc được | Mục tiêu luật (c) |
|---|---|---|
| Lượt gọi người / vòng #136 | **≥10** = 4 cổng thiết kế + ≥6 ngoài | ≤3 · 0 ngoài |
| Chạm / lượt | **1** | ≤1 |
| Vòng bị hạ tầng kit đốt | **1/1** (phiên dừng ×4, một lời khai «đang chạy» sai) | 0 |

Trượt ở cả hai vế. Phần ngoài thiết kế là **hạ tầng phiên** — chỗ cắt cửa sổ kế
gọi tên trong hợp đồng: `/goal` là bước máy tự làm khi vào S2. Phần trong thiết
kế **4 > 3** là câu hỏi đọc luật, không phải đếm sai: luật (c) liệt ba cổng
(Đáng · Phạm vi · Bằng chứng) và T3 có thêm Gate 1.5 theo thiết kế. Ký mốc này
là nhận bản đọc trên đi vào hồ sơ phát hành; cách đọc trần T3 (nguyên văn 3, hay
theo nguyên tắc «= số cổng thiết kế» = 4) là điều người ký khai ở dòng ký.
