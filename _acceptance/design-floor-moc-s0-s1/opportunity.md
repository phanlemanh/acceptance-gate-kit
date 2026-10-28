---
schema_version: 1
slug: design-floor-moc-s0-s1
feature: Vòng feature-loop ở kho có giao diện ghi bậc M0–M3 của kho ở S0, và ở S1 nạp đúng chỉ mục cộng tối đa hai tệp tri thức thiết kế, kiểm kế hoạch dùng lại và flow lint thành dòng thông tin trên thẻ Cổng 1
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-27T03:56:31Z   # chủ kho gõ «Duyệt, Đồng ý» ở thẻ khởi tạo đợt design-floor-2710 (phiên giám sát), máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: FL4
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng FL4 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Nguồn: `acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626` — chưa có trang: trang nền, trang đợt design-floor-2710
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Vòng feature-loop ở kho có giao diện ghi bậc M0–M3 của kho ở S0, và ở S1 nạp đúng chỉ mục cộng tối đa hai tệp tri thức thiết kế, kiểm kế hoạch dùng lại và flow lint thành dòng thông tin trên thẻ Cổng 1

Vì sao: Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — phạm vi v1 chốt 26/10: flow lint ở Cổng 1 và định tuyến chỉ mục tri thức thiết kế. Trang acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Bốn kho fixture M0, M1, M2, M3 ra đúng bậc; ở M0 design-floor không in dòng nào; một vòng mẫu nạp không quá ba tệp tri thức thiết kế; thẻ Cổng 1 không có dòng design-floor nào là câu hỏi; mỗi điểm móc có một đột biến đỏ đúng ca» chưa?
- Kết quả nào là SỐNG: [đề xuất] Bốn kho fixture M0, M1, M2, M3 ra đúng bậc; ở M0 design-floor không in dòng nào; một vòng mẫu nạp không quá ba tệp tri thức thiết kế; thẻ Cổng 1 không có dòng design-floor nào là câu hỏi; mỗi điểm móc có một đột biến đỏ đúng ca
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Bốn kho fixture M0, M1, M2, M3 ra đúng bậc; ở M0 design-floor không in dòng nào; một vòng mẫu nạp không quá ba tệp tri thức thiết kế; thẻ Cổng 1 không có dòng design-floor nào là câu hỏi; mỗi điểm móc có một đột biến đỏ đúng ca» khi hết timebox
- Timebox: …
