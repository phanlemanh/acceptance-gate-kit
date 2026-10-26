---
schema_version: 1
slug: trao-vai-va-do-sau-gop
feature: Trao vai giám sát bằng lệnh vai không gắn mã CLI của phiên trao vào giám sát mới, lời dặn chẩn đoán lại khớp hành vi khi nhận mã CLI, và hai phép đo của TC1 thôi đỏ giả cho vòng sau khi TC1 đã gộp
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-26T07:28:38Z   # chủ kho gõ «Cổng Đáng TC1b: build, ngưỡng và hạn theo đề xuất.»
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TC1b
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TC1b của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Trao vai giám sát bằng lệnh vai không gắn mã CLI của phiên trao vào giám sát mới, lời dặn chẩn đoán lại khớp hành vi khi nhận mã CLI, và hai phép đo của TC1 thôi đỏ giả cho vòng sau khi TC1 đã gộp

Gốc: acceptance-gate-kit/_acceptance/danh-thuc-doc-nhip-dung-ma/

Vì sao: Gốc: acceptance-gate-kit/_acceptance/danh-thuc-doc-nhip-dung-ma/ — chủ kho chọn «mở hợp đồng mới» cho Ngoài-1, 5, 6, 7, 8 ở Cổng Bằng chứng 26/10; hạt giống docs/plans/2026-10-26-hat-giong-tc1b-sau-danh-thuc.md. Mục bất biến lúc gộp chặn TC2 (TC2 đổi ca ở tests/dieu-phoi).

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Ca giám sát A trao vai cho X mà chỉ A có nhịp → đánh thức báo chủ kho; chan-doan --phien bằng mã CLI không ra giam-sat thieu giả (hoặc lời dặn không còn mời mã CLI); TC1-06 và TC1-09 im trên một commit gộp giả của nhánh TC1 khi vòng sau đổi thân ca, và vẫn đỏ khi đổi trước gộp mà không ghi sổ» chưa?
- Kết quả nào là SỐNG: Ca giám sát A trao vai cho X mà chỉ A có nhịp → đánh thức báo chủ kho; chan-doan --phien bằng mã CLI không ra giam-sat thieu giả (hoặc lời dặn không còn mời mã CLI); TC1-06 và TC1-09 im trên một commit gộp giả của nhánh TC1 khi vòng sau đổi thân ca, và vẫn đỏ khi đổi trước gộp mà không ghi sổ
- Kết quả nào là CHẾT: chưa đạt «Ca giám sát A trao vai cho X mà chỉ A có nhịp → đánh thức báo chủ kho; chan-doan --phien bằng mã CLI không ra giam-sat thieu giả (hoặc lời dặn không còn mời mã CLI); TC1-06 và TC1-09 im trên một commit gộp giả của nhánh TC1 khi vòng sau đổi thân ca, và vẫn đỏ khi đổi trước gộp mà không ghi sổ» khi hết timebox
- Timebox: 2026-11-05 — mốc «Tinh chỉnh sau hai đợt thử»; chủ kho chốt ở Cổng Đáng 26/10
