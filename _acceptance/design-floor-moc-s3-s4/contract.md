---
schema_version: 1
feature: design-floor bước 2d — móc cuối S3 (autofix và sinh lại tệp dẫn xuất, commit trước S4) và S4 (chấm tuân thủ design system bằng hex thô và độ phủ token, chặn theo bậc), răng ui gate và vòng mẫu không ghi sau S4
slug: design-floor-moc-s3-s4
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/** + feature-loop/skills/** + tests/** + GUIDE — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-28-design-floor-moc-s3-s4-design.md
status: approved
approved_by: Manh Phan
approved_at: 2026-10-28
---

# Acceptance Contract: design-floor-moc-s3-s4

## Context

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — bước 4 của kế hoạch design-floor: cuối S3 autofix
và sinh lại, S4 tuân thủ design system, không ghi gì sau S4. FL4 (#433) đã có bậc M0–M3 và khối «Sàn thiết kế»; FL1
(#434) đã có trạng thái KHÔNG-ĐO-ĐƯỢC ở cổng thiết kế.

## Criteria

- AC-1: Given kho fixture M1 có `design.surface_globs` khớp, vòng đổi một trang `.html` có lỗi sàn sửa được và một tệp
  `.tsx`, When chạy lệnh S3, Then autofix ghi đúng trang `.html` ấy, tệp `.tsx` và mọi tệp khác giữ băm, và một commit S3
  chứa đúng tệp đã đổi; cùng lệnh trên kho M0: stdout rỗng, thoát 0, không commit, băm cây không đổi.
- AC-2: Given kho khai `design_floor.sinh_lai` hai lệnh, When chạy lệnh S3, Then hai lệnh chạy theo thứ tự sau autofix
  và tệp chúng đổi hay tạo vào cùng commit S3; một lệnh thoát khác 0 → lệnh S3 thoát 1 gọi tên lệnh ấy và không commit;
  không khai → dòng «chưa khai lệnh sinh lại», thoát 0.
- AC-3: Given cây có việc dở chưa commit ngoài `_acceptance/` (một tệp theo dõi đã sửa, một tệp chưa theo dõi) không trùng
  đích autofix, When chạy lệnh S3, Then commit S3 không chứa hai tệp ấy và chúng giữ nguyên băm; Given đích autofix đã
  sửa chưa commit từ trước, Then lệnh thoát 2 gọi tên tệp ấy, không gọi autofix, không chạy lệnh sinh lại, băm cây không đổi.
- AC-4: Given diff của vòng chạm tệp giao diện có hex thô (`#fff`, `#1a2b3c`), tệp chỉ dùng token (`var(--…)`), tệp token
  đã khai và một tệp ngoài `design.surface_globs` có hex, When chạy lệnh S4 ở M1, Then lệnh thoát 2 và in đúng một dòng
  `tệp:dòng giá-trị` cho mỗi hex thô của tệp giao diện, không dòng nào cho ba tệp còn lại.
- AC-5: Given kho M2 và trang `.html` trong diff, When chạy lệnh S4, Then `ui token-coverage` chạy với `--tokens` từ khai
  báo kho; mã 0 → «đạt», mã 2 → «trượt», mã 3/4/5 → «không đo được ở đây (mã k)» và không chặn, mã khác (hay lệnh chết)
  → «lệnh ui lỗi (mã k)» và lệnh S4 thoát 1; ở M1 lệnh `ui` không được gọi.
- AC-6: Given ma trận bậc M0–M3 × {hex thô, độ phủ token trượt, không đo được} sinh bằng mã, When chạy lệnh S4, Then mã
  thoát và nhãn dòng in khớp đúng bảng «Chặn theo bậc» ở Notes cho từng ô — số khẳng định bằng số ô bộ đọc rút được
  từ bảng.
- AC-7: Given kho M3 có hex thô và trang `.html`, When chạy lệnh S4, Then băm mọi tệp của cây (kể cả `_acceptance/` và
  tệp chưa theo dõi) trước và sau bằng nhau và không có tệp mới.
- AC-8: Given khối máy `DESIGN-FLOOR-HOP-DONG`, mục chờ FL-C1 ở `chan_troi` của `docs/plans/lo-trinh-kit.json`, khối
  `DESIGN-FLOOR-S4` của SKILL và lệnh S4, When chạy ca răng `ui gate`, Then cây thật hôm nay xanh; trên bản sao của CÂY
  THẬT chèn `ui gate` vào khối `DESIGN-FLOOR-S4` hay argv `gate` vào lệnh S4 → đỏ với thông điệp nêu FL-C1; bản sao có
  DF-07 trong `gioi_han` (FL-C1 đã rời `chan_troi`) mà chèn → đỏ với thông điệp nêu DF-07; FL-C1 đã rời và không DF-07 mà
  chèn → xanh.
- AC-9: Given kho fixture M2 sinh bằng mã, When chạy vòng mẫu S0 (bậc) → S1 → S3 (commit) → S4 (lệnh chấm, ghi hồ sơ
  `verified_commit`) → ký → `scripts/pre-merge-check.sh`, Then pre-merge sạch; đột biến lệnh S4 gọi autofix `--write` →
  pre-merge báo `evidence is stale` gọi tên trang đã bị ghi.
- AC-10: Given SKILL feature-loop, When rút lệnh từ khối `DESIGN-FLOOR-S3` rồi chạy trên kho fixture M2, Then đầu ra bằng
  gọi trực tiếp, và khối đứng trước dòng sang `implemented` của S3; đột biến bỏ khối → đỏ gọi tên khối; lệnh bậc ở M1+
  khi kho chưa khai `executors.design.floor` in thêm đúng một dòng nói S4 chưa chấm tuân thủ design system.

## Coverage

Bỏ quét — xem sổ (dòng «bỏ coverage-scan»): phạm vi đã chốt bởi hàng FL5 (GN3, GN4) và mục «Móc vào feature-loop» của
kế hoạch, bước 4.

## Đường đo

- S4 đỏ đúng tệp có hex thô và im với tệp chỉ dùng token — số từ ca HEX (dòng in khớp từng chỗ) · AC-4, AC-6.
- Không tệp nào đổi sau commit S4 — số từ pre-merge-check của vòng mẫu (0 VIOLATION) và ca băm cây của lệnh S4 · AC-7, AC-9.
- Chèn ui gate khi khối máy còn DF-07 thì đỏ đúng thông điệp — số từ ca GATE-DF07 · AC-8.
- Đo thí điểm DO1 (năm tiêu chí chết, ≥10 vòng giao diện ở onehub-invest — làm-xong→ký và ký→gộp không tăng, chi phí
  máy mỗi kết quả gộp được báo, không thêm lượt gọi người, tỉ lệ chặn sai không tệ hơn cổng của kit, ≥1 lỗi thật kit
  bỏ sót) — KHÔNG đo trong vòng này; người ghi số bằng `/acceptance-gate:observed` sau thí điểm.

## Out of scope

- `ui gate` ở S4 (FL-C1 — chờ DF-07 xanh trên bản vendored và một vòng thật ở kho tiêu thụ chứng không ghi sau S4).
- Máy tự sửa cấu hình kho (thêm `executors.design.floor`, `design_floor.sinh_lai`) hay tự nâng bậc.
- Đo thí điểm DO1 trên onehub-invest — cần ≥10 vòng giao diện thật sau khi kho nhận bản.
- Luật màu, font, bo góc khác của design system; hex thô trong tệp ngoài `design.surface_globs`.

## Notes

- Chặn theo bậc (Hỏi-2, bản khuyến nghị; Cổng Phạm vi chọn lối khác thì AC-6 đổi theo bảng mới):

  <!-- <<<DF-CHAN-THEO-BAC -->
  | Bậc | Hex thô có mặt | Độ phủ token trượt | Độ phủ token không đo được |
  |---|---|---|---|
  | M0 | thoát 0, không dòng | thoát 0, không dòng | thoát 0, không dòng |
  | M1 | thoát 2, dòng «hex thô» | thoát 0, không dòng | thoát 0, không dòng |
  | M2 | thoát 2, dòng «hex thô» | thoát 0, dòng «cảnh báo» | thoát 0, dòng «không đo được ở đây» |
  | M3 | thoát 2, dòng «hex thô» | thoát 2, dòng «trượt» | thoát 0, dòng «không đo được ở đây» |
  <!-- DF-CHAN-THEO-BAC>>> -->

  Ở M1 lệnh `ui` không được gọi nên hai cột độ phủ token không có dòng. Mỗi ô dựng trên kho riêng chỉ mang đúng một
  hiện tượng của cột.

- Luật đã phân xử ở v1: hex thô (một luật). Danh sách nằm ở hợp đồng này, không ở văn xuôi.
- Hỏi-1 (CỘNG): không phê → bỏ AC-1, AC-2, AC-3, AC-10 vế khối S3; còn S4 chỉ đọc, răng và vòng mẫu (S3 rỗng).

Known limits (khai từ thiết kế):
- Hex thô = `#` theo sau đúng 3, 4, 6 hay 8 chữ số hex, không đứng sau `&` (mã thực thể HTML như `&#039;`) hay chữ/số, và
  không có chữ/số liền sau. Bắt theo mẫu ký tự, không hiểu ngữ cảnh: chuỗi `#abc` trong chữ hiển thị hay mã neo trang
  (`href="#abc"`) cũng bị bắt.
- Độ phủ token chỉ đo được trang `.html`; kho giao diện `.tsx` chỉ có kiểm hex thô ở S4.
