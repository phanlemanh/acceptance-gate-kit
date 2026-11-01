---
schema_version: 1
slug: khuon-loi
feature: "S4 chấm vật theo khuôn bằng một bộ đọc bản đồ dùng chung mà luật lint của kho cũng gọi được: vòng dựng màn ngoài khuôn bị trả lại, gọi đúng tên tệp và khối cấm; kho không khai bản đồ thì không đổi gì"
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
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

- Câu hỏi phép đo trả lời: [đề xuất] kho đã khai bản đồ khuôn có còn phải mở vòng «đồng nhất lại» và chủ kho có còn
  thấy màn lệch khi dùng, sau khi kho nhận 2.37.0?
- Thước trước phát hành: [đề xuất] trong bộ kiểm kit, tiêm một màn ngoài khuôn vào kho mẫu thì bước chấm đỏ đúng tệp và
  khối; chạm tài liệu hay hồ sơ thì im; đối chứng dương xanh trước; hai mutant (gỡ bộ lọc vùng · đổi loại trừ thành bao
  gồm) đều đỏ. Thay vế «răng bắt ≥1 lệch thật qua ≥3 vòng giao diện» của mục chờ cũ KH-C1 — vế ấy đo sai vì răng tốt
  chặn lệch trước commit nên số bắt ở bước chấm tiến về 0 (kho thứ hai: 0 lệch trong 2 vòng có số đo).
- Kết quả nào là SỐNG: [đề xuất] trong 21 ngày kể từ khi onehub-quy-hang cài 2.37.0 và bước chấm khuôn chạy trên ≥1 vòng
  giao diện thật của kho ấy: 0 vòng «đồng nhất lại» mới cho nhóm đã khai, và dưới 2 lệch lọt (mỗi vòng đồng nhất lại mới
  hay mỗi lệch lọt là một dòng đếm).
- Kết quả nào là CHẾT: [đề xuất] 21 ngày sau mốc mà không kho nào chạy bước chấm khuôn trên một vòng giao diện thật; hoặc
  ở kho nhận vẫn còn sửa tay danh sách trong bài kiểm, tỉ lệ hồ sơ giao diện có số đo không lên gần trọn, hay hạ tầng kit
  đốt lượt chấm → vòng 2 «Chọn khối ở cổng» nằm yên, ghi lý do vào hồ sơ mốc.
- Mốc gốc ở kho nhận (lấy 01/11, trước khi làm): lượt chấm sáu vòng giao diện gần nhất 5 · 2 · 3 · 2 · 3 · 1; 7 lần sửa
  tay danh sách trong bài kiểm bản đồ; 1/9 hồ sơ giao diện có số đo.
- Timebox: [đề xuất] 2026-11-04 (mốc Phát hành 2.37.0 — sáu bản vá sau 2.36.0 (#465 #466 #469 #471 #472 #474) + Khuôn lõi (KH1); kho nhận tính kết quả: onehub-quy-hang, crm nhận trước)
