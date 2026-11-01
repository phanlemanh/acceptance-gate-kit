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

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Trong bộ kiểm kit: tiêm một màn ngoài khuôn vào bản sao kho mẫu thì bước chấm đỏ đúng tên tệp và khối; chạm tài liệu hay hồ sơ thì im; kho không khai bản đồ thì hành vi không đổi; hai mutant (gỡ bộ lọc vùng · đổi loại trừ thành bao gồm) đều đỏ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Trong bộ kiểm kit: tiêm một màn ngoài khuôn vào bản sao kho mẫu thì bước chấm đỏ đúng tên tệp và khối; chạm tài liệu hay hồ sơ thì im; kho không khai bản đồ thì hành vi không đổi; hai mutant (gỡ bộ lọc vùng · đổi loại trừ thành bao gồm) đều đỏ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Trong bộ kiểm kit: tiêm một màn ngoài khuôn vào bản sao kho mẫu thì bước chấm đỏ đúng tên tệp và khối; chạm tài liệu hay hồ sơ thì im; kho không khai bản đồ thì hành vi không đổi; hai mutant (gỡ bộ lọc vùng · đổi loại trừ thành bao gồm) đều đỏ» khi hết timebox
- Timebox: [đề xuất] 2026-11-04 (mốc Phát hành 2.37.0 — sáu bản vá sau 2.36.0 (#465 #466 #469 #471 #472 #474) + Khuôn lõi (KH1); kho nhận tính kết quả: onehub-quy-hang, crm nhận trước)
