---
schema_version: 2
feature_slug: loi-moi-cong-may-sinh
verdict: PASS
failed_evals: []
reason: 11/11 eval máy XANH trên cây cuối 873db3de. Bảy finding TRONG hợp đồng của vòng soi 3 định đoạt từng dòng (mục «Vòng chấm»); phần cháy hai vòng — bộ phân loại Treo — bị XOÁ theo truy nguyên, không vá. Owner chọn SHIP VỚI GIỚI HẠN ở trần ba vòng, không vòng soi 4 — xem Known limits #1.
verified_by: implementing session (đối kháng vòng 1–3 do ba phiên tươi độc lập; KHÔNG có phiên soi độc lập trên cây cuối — Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: cd94d0048760da55e89ecdcae12463186b5fec10
human_signoff: Manh Phan 2026-09-02
---

# Evidence Report: loi-moi-cong-may-sinh

**Đọc dòng này trước mọi dòng khác.** Đây là báo cáo vòng 4 sau ba vòng chấm và
hai lần dừng-vá nổ. Cây cuối khác cây vòng 3 ở đúng một phép TRỪ (xoá bộ phân
loại Treo theo entry) cộng ba răng mới; không có phiên soi độc lập nào nhìn cây
cuối — owner chấp nhận giới hạn đó bằng phát ngôn 02/09.

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
| E9 | AC-3 | test | PASS |
| E10 | AC-1 | test | PASS |
| E11 | AC-5 | test | PASS |

## Evidence

Sinh TỪ `run-log.jsonl` vòng 4 (`"round":4`, sha `873db3de`) — `verified_at`
là `ts` thật, `exit_code` là mã thoát thật; không con số nào đi qua tay người
viết.

- eval: E1
  run_id: lmcms-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 795 passed, 0 failed

- eval: E2
  run_id: lmcms-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 795 passed, 0 failed

- eval: E3
  run_id: lmcms-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 795 passed, 0 failed

- eval: E4
  run_id: lmcms-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 795 passed, 0 failed

- eval: E5
  run_id: lmcms-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 795 passed, 0 failed

- eval: E6
  run_id: lmcms-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 795 passed, 0 failed

- eval: E7
  run_id: lmcms-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 795 passed, 0 failed

- eval: E8
  run_id: lmcms-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: all plugin tests passed

- eval: E9
  run_id: lmcms-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 60 passed, 0 failed

- eval: E10
  run_id: lmcms-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: all plugin tests passed

- eval: E11
  run_id: lmcms-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T15:16:01Z
  output: |
    Results: 795 passed, 0 failed

## Vòng chấm

| Vòng | Cây | Máy | Đối kháng | Kết quả |
|---|---|---|---|---|
| r1 | `d859a830` | 11/11 XANH | 9 finding TRONG hợp đồng | REJECT → sửa |
| r2 | `bf76d74e` | 11/11 XANH | 5 finding, 3 lớp tái phát | REJECT → DỪNG-VÁ nổ lần 1, owner chọn «đổi khuôn» |
| r3 | `2bda9c94` | 11/11 XANH | 7 finding, 2/3 lớp còn sống, hồi quy 2→3 hồ sơ | REJECT → DỪNG-VÁ nổ lần 2 |
| r4 | `873db3de` | 11/11 XANH | KHÔNG soi (owner quyết) | PASS với giới hạn |

Bảy finding vòng 3, định đoạt từng dòng trên cây cuối:

| # | Finding r3 | Định đoạt | Chứng |
|---|---|---|---|
| 1 | Hồi quy định tuyến 3 hồ sơ, lời khai «đã đóng» sai | **XOÁ** bộ phân loại Treo — Treo luôn là dòng báo (đúng D2 · AC-3 · entry sổ 3002) | Vi phân `d859a830 → 873db3de` chạy `--extract` trọn xưởng: cột Treo trùng 100%, Treo=hỏi = 0; `routing-baseline.txt` ghim, ca LM20 giữ |
| 2 | Ba số công bố không tái lập (397/5/1) | Đính chính trong sổ (`d-…-6001`); nguyên nhân: đếm bằng bộ lọc tự viết thay vì qua chính vật | Số đúng đo lại bằng chính `gate-card.js`: 3 hồ sơ dính trước phép trừ, 0 sau |
| 3 | Luật mới vẫn liệt kê (`LEDGER_META_KEYS` + `decision`), gần không chiều đỏ | **XOÁ** cùng finding 1 — không còn danh sách nào để trôi | M4a/M4c hết đối tượng; đột biến M-A (tái sinh suy diễn theo entry) đỏ LM18 + LM20 |
| 4 | Vế `^\s+…:` của `OOC_TRIED_ITEM_RE` không chiều đỏ (M6) | Thêm ô ma trận «sai khuôn không dấu đậm nhưng có dòng thân» | Đột biến M-B (gỡ vế hai) đỏ đúng ô đó, 9/10 |
| 5 | Chú giải khai «không bao giờ oan» — ba bản dò bác | Chú giải đổi thành giới hạn đã khai kèm số 0/63 | Known limits #3 |
| 6 | Round-trip Cổng 2 còn phép CHỨA (M10) | LM09 nâng lên đẳng thức như LM15 | Đột biến M-C (đuôi vào `one_shot` Cổng 2) đỏ LM09 |
| 7 | AC-3 vế «hàng mặc định của bảng» mô tả cơ chế không còn | Giữ nguyên chữ hợp đồng đã ký; ghi sổ `d-…-7003` là điều kiện không xảy ra (không gian mục của thẻ là đóng) — Treo-mục để owner veto | Known limits #2 |

Truy nguyên (owner hỏi «chữ ký là hình thức?», 02/09): Treo sinh ở 1.11.0 +
đợt 2 veto-có-dấu-vết = máy đã quyết, có sổ, cửa veto vô hạn → loại-1 theo luật
lời-mời 01/09 → dòng báo. Hai vòng cháy (r2 theo `type`, r3 theo hình dạng
entry) đều là một bộ phân loại trên không gian mở mà hợp đồng KHÔNG đòi. Khó-đảo
trong kit là danh sách ĐÓNG của owner (`KHO-DAO-V`), sổ chưa có tín hiệu máy-đọc
— không suy từ hình dạng entry.

Điểm dữ liệu thật cho Đường đo (repo tiêu thụ Radar, kit 2.6.0, hồ sơ
`dong-ho-chi-nhan-ngay-co-that`, ký `38f0b42` 02/09): thẻ Cổng 2 đòi bốn ô trống
«E8; cắt/hoãn; Treo; ký hay trả»; owner gõ «Ký» → bị hỏi lại → lượt hai «E8:
Đạt; Cắt; Phê hết». 1 lượt, 2 chạm, 2/4 ô là nghi thức. Dưới thẻ này còn hai ô,
cả hai là loại-5 thật. Đây cũng là TÁI PHÁT của hồ sơ #57 (16/08) qua đường
thẻ→tin + câu «máy không đề xuất thay» ở bước 4 signoff (sổ `d-…-7005`).

## Ngoài hợp đồng

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Không phép đo nào canh «ai phải trả lời bao nhiêu câu» trên kho thật**
  Người dùng thấy gì: hai vòng liền, một hồ sơ tự dưng mọc thêm câu hỏi chỉ lộ ra khi có người ngồi soi; vòng này đã dựng bản ghi mốc định tuyến quét trọn kho (`routing-baseline.txt` + LM20) nên phần lõi đã đóng — phiên soi đề xuất mở hợp đồng cho phần còn lại (nâng thành luật chung cho mọi bản ghi mốc của kit); thẻ in đề xuất đó, người sửa ô nếu thấy Known limits là đủ.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: high
  Đề xuất: new-contract
- **Hỏi thẻ về một hồ sơ vẫn kéo theo một lượt quét trọn kho**
  Người dùng thấy gì: mỗi lần máy dựng thẻ cho một hồ sơ ký được, nó lặng lẽ quét lại toàn bộ kho trước khi trả lời (0,55 giây so với 0,03 giây ở hồ sơ đang đỏ).
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits
- **Bản quét xưởng vẫn bỏ qua im lặng hồ sơ làm bộ dựng thẻ sập**
  Người dùng thấy gì: LM13 (cờ vàng) vẫn `continue` khi thẻ sập; LM20 (định tuyến) đã đổi sang ĐỎ khi có hồ sơ sập — nửa cờ vàng chưa theo.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: low
  Đề xuất: known-limits
- **Phép so hai dòng trả lời bám nhầm dòng khi hồ sơ nhắc tới chính cụm «Trả lời mẫu»**
  Người dùng thấy gì: LM19 tìm cụm chữ đầu tiên trùng tên trên thẻ; chỉ chạy trên hồ sơ dựng sẵn nên chưa lộ.
  file: `tests/scripts/gate-card-lmcms.test.mjs`
  severity: low
  Đề xuất: known-limits
- **Khối Ngưỡng của thẻ không lột markdown; thẻ chưa tự render khối /goal sau khi duyệt**
  Người dùng thấy gì: hai mục ghi sổ từ trước vòng này (S1), không thuộc bảy vá đã duyệt.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: new-contract

## Known limits

1. **Không có phiên soi độc lập trên cây cuối.** Mã đo mới của vòng 4 (LM18 gộp
   năm phương ngữ · LM20 baseline định tuyến · ô OOC thứ tám · LM09 đẳng thức)
   chỉ được kiểm bằng ba đột biến M-A/M-B/M-C do chính phiên thi công chạy, bản
   sao khôi phục byte-nguyên. Owner chấp nhận ở trần ba vòng (sổ `d-…-8001`).
   Đường đảo: hồi quy lộ ở vòng sản phẩm kế đếm vào ngưỡng luật (a).
2. **Vế «hàng mặc định của bảng ánh xạ» trong AC-3 là điều kiện không bao giờ
   xảy ra** — mục của thẻ là các khối renderer tự liệt, không gian đóng. Giữ chữ
   hợp đồng đã ký; lưới thay thế là LM19 (khối VIỆC-CỦA-ANH == routing.hoi) và
   LM20 (baseline trọn kho).
3. **Cờ sai-khuôn có thể oan** trên lời khai rỗng kèm một dòng thụt lề mang dấu
   hai chấm; 0/63 review-findings thật hôm nay. Không đổi thành danh sách
   câu-rỗng (allowlist trên không gian mở — lớp đã cháy ở bản đầu).
4. **Tin mời cổng vẫn không có lưới thường trực** — cùng giới hạn AC-8 đã ký.
   Lỗ #57 tái phát ở Radar 2.6.0 chứng minh nó có thật; vòng này đóng cho hai ô
   cắt/hoãn + Treo bằng cách điền sẵn trên thẻ (dữ liệu mang khuyến nghị), không
   đóng cho dạng khác.
5. **Khó-đảo chưa có cờ máy-đọc trong sổ quyết định** — một Treo khó-đảo thật sẽ
   được điền sẵn «phê hết»; người vẫn thấy từng Treo-<n> trên thẻ để sửa ô. Mở
   khi có ca thật: thêm TRƯỜNG, không suy từ hình dạng.
6. **E11 quét xưởng chỉ chạm Cổng 2**; loại cờ `roi-bac` và hình dạng «hồ sơ
   không có mục cắt/hoãn» chỉ được chạm bằng fixture.
7. **AC-8 chỉ đo văn bản luật, không đo hành vi hội thoại** — như đã ký.
8. **Thẻ chưa-ký-được khai routing rỗng cả hai chiều** — chủ đích (thẻ đỏ không
   mời ai), nhưng `--extract` của hồ sơ REJECT không liệt việc cho bộ đọc máy
   hạ nguồn.
9. **Số lần gọi người của chính vòng này vượt mục tiêu:** trong thiết kế 3
   (đúng trần) · ngoài thiết kế ≥6, phần lớn do hạ tầng phiên dừng và một lần
   máy khai «đang chạy» sai — không phải do vật; ghi để ba-dòng-số mốc 2.7.0
   không bỏ sót.

### Re-pin lần 1 — 2026-09-03, do mốc 2.7.0 đổi manifest + bản ghi mốc định tuyến (sống trong hồ sơ này) thêm dòng hồ sơ mốc
run_id: repin-20260903-r270-1
sha: 175999b964b34bb3812bf9b6c16fcf8669c77d26 · suites: 4 lệnh exit 0 (scripts 795/0 · hooks 60/0 · plugins all-pass · workflows all-pass) + product-map --check khớp

### Con trỏ thay thế — 2026-09-03: hai bản ghi mốc của hồ sơ này đã DỜI CHỖ

Hồ sơ này (và `review-findings.md`, sổ `7002`/`9001`) trỏ tới
`routing-baseline.txt` và `sweep-baseline.txt` như vật sống TRONG thư mục hồ sơ.
Từ `d9911565` (vòng `vu-trang-goal-luc-goi-ten`, owner quyết «thu phạm vi + đổi
khuôn nhỏ», sổ `d-20260903T100500Z-5001`) hai file đã dời sang
**`tests/scripts/fixtures/routing-baseline.txt`** và
**`tests/scripts/fixtures/sweep-baseline.txt`**, và ca LM13/LM20 chỉ còn ghim hồ
sơ ĐÃ CHỐT (có `human_signoff`). Lời khai cũ ở trên giữ nguyên văn — đây là con
trỏ, không phải bản sửa hồ sơ đã ký (Ngoài-2 của #140, owner chốt «ghi Known
limits»; ghi tại chiến dịch ghim lại mốc 2.8.0 theo §7.1).

### Re-pin lần 2 — 2026-09-03, chiến dịch mốc 2.8.0 (§7.1)

Đường khai bị cửa sổ chạm sau pin `175999b9`: `scripts/gate-card.js` ·
`commands/acceptance-card.md` · hai bản ghi mốc nói trên (dời chỗ + đổi khuôn).
run_id: repin-20260903-r280-lmcms
sha: cd94d0048760da55e89ecdcae12463186b5fec10 · pin cũ: 175999b9 · chữ ký người giữ nguyên · bốn suite + product-map --check exit 0 trên cùng cây; LM13/LM20 xanh với khuôn mới.
