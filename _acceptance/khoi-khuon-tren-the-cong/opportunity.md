---
schema_version: 1
slug: khoi-khuon-tren-the-cong
feature: Thẻ Cổng Phạm vi và Cổng Bằng chứng có khối «Khuôn»; S1 đọc màn mẫu trước khi chọn phương án; đối tượng mới chỉ thêm một chạm ở cổng sẵn có
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: KH2
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng KH2 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Nguồn: `acceptance-gate-kit-tri-thuc:wiki/chu-de/ban-do-khuon.md#80a46d525b411191c17d03ff0795f34d34f2597f` — chưa có trang: trang nền, trang đợt ban-do-khuon-kit-3110
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Thẻ Cổng Phạm vi và Cổng Bằng chứng có khối «Khuôn»; S1 đọc màn mẫu trước khi chọn phương án; đối tượng mới chỉ thêm một chạm ở cổng sẵn có

Vì sao: Gốc: kit/_acceptance/khuon-loi/ — KH1 đã ký, gộp main 02/11 (#475, bản vá #476), phát hành v2.37.0 03/11. KH1 để lại: thẻ Cổng Bằng chứng in MỘT dòng số đo khuôn (scripts/ban-do-khuon.cjs theCong2), thẻ Cổng Phạm vi chưa có gì về khuôn; khối KHUON-S1 dặn bằng lời «đọc đúng tệp bản đồ và màn mẫu của nhóm» mà không có vật nào cho thấy đã đọc; đối tượng mới chưa có nhóm không có lối ra ở cổng. Chủ kho 03/11 gõ «Mở KH-C2 ngay» sau khi máy khuyên chờ kho nhận chạy 2.37.0 — vòng meta có tên theo luật chiều rộng (b). Nguồn: docs/findings/2026-11-01-ban-do-khuon-vao-kit.md §6, §11; docs/plans/pham-vi-ban-do-khuon-kit-3110.md.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Trong bộ kiểm kit: hồ sơ của kho mẫu có bản đồ khuôn thì thẻ Cổng Phạm vi và thẻ Cổng Bằng chứng có khối «Khuôn» đọc từ đúng tệp lượt chấm và tệp nạp; kho không khai bản đồ thì thẻ không đổi từng byte; đối tượng mới chưa có nhóm thì thẻ thêm đúng một ô quyết ở cổng sẵn có, không thêm lượt gọi người» chưa?
- Kết quả nào là SỐNG: [đề xuất] Trong bộ kiểm kit: hồ sơ của kho mẫu có bản đồ khuôn thì thẻ Cổng Phạm vi và thẻ Cổng Bằng chứng có khối «Khuôn» đọc từ đúng tệp lượt chấm và tệp nạp; kho không khai bản đồ thì thẻ không đổi từng byte; đối tượng mới chưa có nhóm thì thẻ thêm đúng một ô quyết ở cổng sẵn có, không thêm lượt gọi người
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Trong bộ kiểm kit: hồ sơ của kho mẫu có bản đồ khuôn thì thẻ Cổng Phạm vi và thẻ Cổng Bằng chứng có khối «Khuôn» đọc từ đúng tệp lượt chấm và tệp nạp; kho không khai bản đồ thì thẻ không đổi từng byte; đối tượng mới chưa có nhóm thì thẻ thêm đúng một ô quyết ở cổng sẵn có, không thêm lượt gọi người» khi hết timebox
- Timebox: …
