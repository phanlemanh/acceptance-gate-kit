---
schema_version: 1
slug: design-floor-ban-va-b-c-d
feature: Bốn lệnh chấm vendored trả mã thoát ba trạng thái theo hợp đồng nhập, không tự dò design system, và không kéo module Figma vào đóng kín
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-27T03:56:31Z   # chủ kho gõ «Duyệt, Đồng ý» ở thẻ khởi tạo đợt design-floor-2710 (phiên giám sát), máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: FL3
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng FL3 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Nguồn: `acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626` — chưa có trang: trang nền, trang đợt design-floor-2710
Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.

Bốn lệnh chấm vendored trả mã thoát ba trạng thái theo hợp đồng nhập, không tự dò design system, và không kéo module Figma vào đóng kín

Vì sao: Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — DF-01, DF-03, DF-04, DF-05, DF-06 và phần figma của FN-02 còn đỏ có chủ đích trên bản ghim. Trang acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Năm phép đo DF-01, DF-03, DF-04, DF-05, DF-06 và bốn cặp figma của FN-02 xanh trên bản vendored, giới hạn đã gỡ; khối máy hết giới hạn nào; mỗi bản vá có một dòng sổ và bỏ nó thì đúng phép đo của nó đỏ lại» chưa?
- Kết quả nào là SỐNG: [đề xuất] Năm phép đo DF-01, DF-03, DF-04, DF-05, DF-06 và bốn cặp figma của FN-02 xanh trên bản vendored, giới hạn đã gỡ; khối máy hết giới hạn nào; mỗi bản vá có một dòng sổ và bỏ nó thì đúng phép đo của nó đỏ lại
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Năm phép đo DF-01, DF-03, DF-04, DF-05, DF-06 và bốn cặp figma của FN-02 xanh trên bản vendored, giới hạn đã gỡ; khối máy hết giới hạn nào; mỗi bản vá có một dòng sổ và bỏ nó thì đúng phép đo của nó đỏ lại» khi hết timebox
- Timebox: …
