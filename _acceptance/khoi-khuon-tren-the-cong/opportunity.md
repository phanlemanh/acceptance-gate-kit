---
schema_version: 1
slug: khoi-khuon-tren-the-cong
feature: Thẻ Cổng Phạm vi và Cổng Bằng chứng có khối «Khuôn»; S1 đọc màn mẫu trước khi chọn phương án; đối tượng mới chỉ thêm một chạm ở cổng sẵn có
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-11-03T14:49:55Z   # chủ kho gõ «/acceptance-gate:approve khoi-khuon-tren-the-cong duyệt» 03/11, gộp Cổng Đáng vào Cổng Phạm vi như tiền lệ KH1 (khuon-loi)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: KH2
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng KH2 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Nguồn: `acceptance-gate-kit-tri-thuc:wiki/chu-de/ban-do-khuon.md#80a46d525b411191c17d03ff0795f34d34f2597f` — chưa có trang: trang nền, trang đợt ban-do-khuon-kit-3110
Mốc: Khuôn trên thẻ cổng (số đặt lúc cắt) — KH2; kho nhận tính kết quả: onehub-quy-hang, crm — 06/11/2026.

Thẻ Cổng Phạm vi và Cổng Bằng chứng có khối «Khuôn»; S1 đọc màn mẫu trước khi chọn phương án; đối tượng mới chỉ thêm một chạm ở cổng sẵn có

Vì sao: Gốc: kit/_acceptance/khuon-loi/ — KH1 đã ký, gộp main 02/11 (#475, bản vá #476), phát hành v2.37.0 03/11. KH1 để lại: thẻ Cổng Bằng chứng in MỘT dòng số đo khuôn (scripts/ban-do-khuon.cjs theCong2), thẻ Cổng Phạm vi chưa có gì về khuôn; khối KHUON-S1 dặn bằng lời «đọc đúng tệp bản đồ và màn mẫu của nhóm» mà không có vật nào cho thấy đã đọc; đối tượng mới chưa có nhóm không có lối ra ở cổng. Chủ kho 03/11 gõ «Mở KH-C2 ngay» sau khi máy khuyên chờ kho nhận chạy 2.37.0 — vòng meta có tên theo luật chiều rộng (b). Nguồn: docs/findings/2026-11-01-ban-do-khuon-vao-kit.md §6, §11; docs/plans/pham-vi-ban-do-khuon-kit-3110.md.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: ở kho đã khai bản đồ khuôn, người duyệt Cổng Phạm vi có thấy màn sắp dựng thuộc nhóm nào và
  màn mẫu nào mà không phải mở tệp, và màn mới có được quyết ngay ở cổng sẵn có thay vì lộ ra ở bước chấm?
- Thước trước phát hành: trong bộ kiểm kit, trên kho mẫu do code sinh — lệnh nạp ghi lựa chọn có băm màn mẫu; thẻ hai
  cổng có khối «Khuôn» đọc đúng tệp nạp và tệp lượt chấm; nhóm mới thêm đúng một câu Hỏi-n, không thêm nhãn câu duyệt;
  kho không khai bản đồ thì thẻ và lệnh không đổi từng byte; mỗi phép đo có chiều đỏ trên bản sao bị tiêm.
- Kết quả nào là SỐNG: trong 21 ngày kể từ khi một kho nhận cài mốc mang KH2, ≥1 hồ sơ giao diện của kho ấy có
  `khuon-nap.json` mang `chon` và thẻ Cổng Phạm vi in khối «Khuôn»; số lượt gọi người của vòng ấy không tăng so với trần
  thiết kế (≤3, T3 ≤4).
- Kết quả nào là CHẾT: 21 ngày sau mốc mà không hồ sơ giao diện nào ở kho nhận có `chon` (bước S1 bị bỏ qua hoặc kho
  không dùng bản đồ), hoặc vòng có khối «Khuôn» phải gọi người thêm một lượt ngoài thiết kế vì khối → ghi lý do vào hồ sơ
  mốc, xét gỡ khối.
- Timebox: 21 ngày kể từ ngày một kho nhận cài mốc mang KH2.

## Hạt giống

- **Hạt giống từ Cổng Bằng chứng 04/11:** `docs/plans/2026-11-04-hat-giong-the-viec-round-trip.md` — Ngoài-14 (bộ đọc
  Thẻ việc chưa có ca round-trip với khuôn bên viết).
