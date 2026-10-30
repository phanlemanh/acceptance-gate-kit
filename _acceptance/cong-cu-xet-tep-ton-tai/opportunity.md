---
schema_version: 1
slug: cong-cu-xet-tep-ton-tai
feature: Chân cong_cu của đường nền xét một từ đầu là đường tệp kịch bản theo việc tệp có tồn tại, không theo quyền chạy, và vẫn đỏ đúng tên khi chương trình hay tệp vắng
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-25T23:37:10Z   # chủ kho gõ «Cổng Đáng TC1–TC5: build (build · park · kill), ngưỡng và hạn theo đề xuất.»
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TC5
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TC5 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Chân cong_cu của đường nền xét một từ đầu là đường tệp kịch bản theo việc tệp có tồn tại, không theo quyền chạy, và vẫn đỏ đúng tên khi chương trình hay tệp vắng

Gốc: onehub-invest/_acceptance/nang-kit-2-34-0/

Vì sao: Gốc: onehub-invest/_acceptance/nang-kit-2-34-0/ — lần nhận 2.34.0 của kho (25/10); chân cong_cu đỏ THIẾU ở mọi dãy vì command -v chạy lên executors.design.ui_check — khuôn kit là một đường tệp .js không có quyền chạy; tái hiện trên kit main 45e9f2cf. Kit #403 mục 2; hạt giống docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md mục 4.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Khoá trỏ tệp .js có thật không quyền chạy → xanh; khoá trỏ tệp vắng → đỏ ghim đúng tên; khong-co-lenh | head vẫn đỏ (ca NEN-TD2); khoá dạng ${CLAUDE_PLUGIN_ROOT} giữ dòng bỏ qua như cũ» chưa?
- Kết quả nào là SỐNG: Khoá trỏ tệp .js có thật không quyền chạy → xanh; khoá trỏ tệp vắng → đỏ ghim đúng tên; khong-co-lenh | head vẫn đỏ (ca NEN-TD2); khoá dạng ${CLAUDE_PLUGIN_ROOT} giữ dòng bỏ qua như cũ
- Kết quả nào là CHẾT: chưa đạt «Khoá trỏ tệp .js có thật không quyền chạy → xanh; khoá trỏ tệp vắng → đỏ ghim đúng tên; khong-co-lenh | head vẫn đỏ (ca NEN-TD2); khoá dạng ${CLAUDE_PLUGIN_ROOT} giữ dòng bỏ qua như cũ» khi hết timebox
- Timebox: 2026-11-05 — mốc «Tinh chỉnh sau hai đợt thử»; chủ kho chốt ở Cổng Đáng 26/10
