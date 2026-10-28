---
schema_version: 1
slug: design-floor-moc-s3-s4
feature: Vòng feature-loop chạy autofix và sinh lại tệp dẫn xuất ở cuối S3, chấm tuân thủ design system ở S4 bằng độ phủ token và hex thô, và không ghi tệp nào sau commit S4
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-27T03:56:31Z   # chủ kho gõ «Duyệt, Đồng ý» ở thẻ khởi tạo đợt design-floor-2710 (phiên giám sát), máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: FL5
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng FL5 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Nguồn: `acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626` — chưa có trang: trang nền, trang đợt design-floor-2710
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Vòng feature-loop chạy autofix và sinh lại tệp dẫn xuất ở cuối S3, chấm tuân thủ design system ở S4 bằng độ phủ token và hex thô, và không ghi tệp nào sau commit S4

Vì sao: Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — ADR 0007: không ghi gì sau S4; kit không chấm sự tuân thủ design system ở đâu cả (lib/p-tiers.json thả ba luật). Trang acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Một vòng mẫu trên kho fixture chạy trọn S0→S5 và pre-merge-check không thấy tệp nào đổi sau commit S4; S4 đỏ đúng tệp có hex thô và im với tệp chỉ dùng token; chèn ui gate vào chỗ móc S4 khi khối máy còn giới hạn DF-07 thì ca răng đỏ đúng thông điệp» chưa?
- Kết quả nào là SỐNG: [đề xuất] Một vòng mẫu trên kho fixture chạy trọn S0→S5 và pre-merge-check không thấy tệp nào đổi sau commit S4; S4 đỏ đúng tệp có hex thô và im với tệp chỉ dùng token; chèn ui gate vào chỗ móc S4 khi khối máy còn giới hạn DF-07 thì ca răng đỏ đúng thông điệp
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Một vòng mẫu trên kho fixture chạy trọn S0→S5 và pre-merge-check không thấy tệp nào đổi sau commit S4; S4 đỏ đúng tệp có hex thô và im với tệp chỉ dùng token; chèn ui gate vào chỗ móc S4 khi khối máy còn giới hạn DF-07 thì ca răng đỏ đúng thông điệp» khi hết timebox
- Timebox: …
