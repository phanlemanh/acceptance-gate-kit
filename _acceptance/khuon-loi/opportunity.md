---
schema_version: 1
slug: khuon-loi
feature: "S4 chấm vật theo khuôn bằng một bộ đọc bản đồ dùng chung mà luật lint của kho cũng gọi được: vòng dựng màn ngoài khuôn bị trả lại, gọi đúng tên tệp và khối cấm; kho không khai bản đồ thì không đổi gì"
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-11-01T20:50:21Z   # chủ kho gõ «/acceptance-gate:approve khuon-loi duyệt» phiên 02/11 (giờ máy), gộp Cổng Đáng vào Cổng Phạm vi theo BAN-GIAO §2
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: KH1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng KH1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Nguồn: `acceptance-gate-kit-tri-thuc:wiki/chu-de/ban-do-khuon.md#80a46d525b411191c17d03ff0795f34d34f2597f` — chưa có trang: trang nền, trang đợt ban-do-khuon-kit-3110
Mốc: Phát hành 2.37.0 — sáu bản vá sau 2.36.0 (#465 #466 #469 #471 #472 #474) + Khuôn lõi (KH1); kho nhận tính kết quả: onehub-quy-hang, crm nhận trước — 04/11/2026.

S4 chấm vật theo khuôn bằng một bộ đọc bản đồ dùng chung mà luật lint của kho cũng gọi được: vòng dựng màn ngoài khuôn bị trả lại, gọi đúng tên tệp và khối cấm; kho không khai bản đồ thì không đổi gì

Vì sao: Gốc: crm/_acceptance/khung-chung-ngan-ban-ghi/ — BK1 đã ký: kho thứ nhất dựng bản đồ một nhóm màn và răng giữ khuôn (BK2, BK3, BK5, BK6 máy thông); kho thứ hai dựng bản đồ tám nhóm qua sáu vòng màn. Mỗi kho tự viết lại bộ đọc, răng và số đo; kit chưa có bộ đọc nào. Chủ kho gọi tên vòng meta 01/11 và giao Mac Studio: mốc 2.37.0 = sáu bản vá sau 2.36.0 + hàng này. Nguồn: docs/findings/2026-10-30-ui-dong-nhat-giua-cac-man.md §11, §13; docs/plans/pham-vi-ban-do-khuon-kit-3110.md.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: kho đã khai bản đồ khuôn có còn phải mở vòng «đồng nhất lại» và chủ kho có còn
  thấy màn lệch khi dùng, sau khi kho nhận 2.37.0?
- Thước trước phát hành: trong bộ kiểm kit, tiêm một màn ngoài khuôn vào kho mẫu thì bước chấm đỏ đúng tệp và
  khối; chạm tài liệu hay hồ sơ thì im; đối chứng dương xanh trước; hai mutant (gỡ bộ lọc vùng · đổi loại trừ thành bao
  gồm) đều đỏ. Thay vế «răng bắt ≥1 lệch thật qua ≥3 vòng giao diện» của mục chờ cũ KH-C1 — vế ấy đo sai vì răng tốt
  chặn lệch trước commit nên số bắt ở bước chấm tiến về 0 (kho thứ hai: 0 lệch trong 2 vòng có số đo).
- Kết quả nào là SỐNG: trong 21 ngày kể từ khi onehub-quy-hang cài 2.37.0 và bước chấm khuôn chạy trên ≥1 vòng
  giao diện thật của kho ấy: 0 vòng «đồng nhất lại» mới cho nhóm đã khai, và dưới 2 lệch lọt (mỗi vòng đồng nhất lại mới
  hay mỗi lệch lọt là một dòng đếm).
- Kết quả nào là CHẾT: 21 ngày sau mốc mà không kho nào chạy bước chấm khuôn trên một vòng giao diện thật; hoặc
  ở kho nhận vẫn còn sửa tay danh sách trong bài kiểm, tỉ lệ hồ sơ giao diện có số đo không lên gần trọn, hay hạ tầng kit
  đốt lượt chấm → vòng 2 «Chọn khối ở cổng» nằm yên, ghi lý do vào hồ sơ mốc.
- Mốc gốc ở kho nhận (lấy 01/11, trước khi làm): lượt chấm sáu vòng giao diện gần nhất 5 · 2 · 3 · 2 · 3 · 1; 7 lần sửa
  tay danh sách trong bài kiểm bản đồ; 1/9 hồ sơ giao diện có số đo.
- Timebox: 2026-11-04 (mốc Phát hành 2.37.0 — sáu bản vá sau 2.36.0 (#465 #466 #469 #471 #472 #474) + Khuôn lõi (KH1); kho nhận tính kết quả: onehub-quy-hang, crm nhận trước)

## Cổng 0

- **decision = build** (Phan Le Manh, 02/11 — «duyệt» một chạm ở Cổng Phạm vi, gộp Cổng Đáng theo lời giao
  BAN-GIAO §2) hạng T2: bộ đọc bản đồ khuôn dùng chung + bước chấm khuôn + số đo tự ghi + lưới ở `s4-args`;
  kho không khai `design/patterns/` không đổi byte nào.
- **disposition = …** Không có prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** các dòng ở section Ngưỡng, giữ nguyên chữ, đã gỡ tiền tố — gồm câu thay vế
  «răng bắt ≥1 lệch qua ≥3 vòng» của mục chờ KH-C1 bằng hai thước (Hỏi-2 trên thẻ Cổng Phạm vi).
- **CỘNG (ADR 0018):** phê ở Hỏi-1 cùng lần duyệt; trace về nguyên tố 2 (bằng chứng không tự dối — bước chấm
  đọc chính bản đồ mà lint của kho đọc) và nguyên tố 3 (người khỏi soi màn lệch bằng mắt); người hưởng: chủ
  kho và đội sản phẩm ở kho đã khai bản đồ (onehub-quy-hang nhận trước tính kết quả, crm nhận trước).
- **Luật chiều rộng (b):** đây là vòng meta duy nhất của cửa sổ 2.37.0, chủ kho gọi tên 01/11.
- **Hạt giống vòng sinh ra:** `docs/plans/2026-11-01-hat-giong-vong-doi-ban-mau.md` — vòng đời bản mẫu và bản đồ (ba hạng
  quyền sửa, mười thao tác); sổ, không phải cam kết.
