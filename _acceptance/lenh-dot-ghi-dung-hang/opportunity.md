---
schema_version: 1
slug: lenh-dot-ghi-dung-hang
feature: Đơn xin s4 không cờ mang slug của hàng đang chấm, hang them nhận mã hay slug của lộ trình và thêm hàng mang đúng slug và mã, và một dãy đã nghỉ chạy lại được bằng hang chay-lai — không còn sửa tay hang-viec.json
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-10-25T23:37:10Z   # chủ kho gõ «Cổng Đáng TC1–TC5: build (build · park · kill), ngưỡng và hạn theo đề xuất.»
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TC2
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TC2 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Đơn xin s4 không cờ mang slug của hàng đang chấm, hang them nhận mã hay slug của lộ trình và thêm hàng mang đúng slug và mã, và một dãy đã nghỉ chạy lại được bằng hang chay-lai — không còn sửa tay hang-viec.json

Gốc: onehub-invest/_acceptance/lo-trinh-2310/

Vì sao: Gốc: onehub-invest/_acceptance/lo-trinh-2310/ — đợt cam-mau-2310 cắt ở hồ sơ này chạy thành đợt Điều phối – Thợ dieu-phoi-dot0-cam-mau (năm dãy, khoảng 30 PR gộp 25–26/10), đợt thật thứ hai của gói; khoá khoa/s4/chu.json ghi slug của hàng kế (ghi.mjs slugKeCua đọc tiep/), hang them F12 thêm hàng slug f12 và cắt slug dài còn sáu từ, và không có lệnh ngược của nghi — giám sát sửa tay hang-viec.json trong khoá. Hạt giống docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md mục 3, 5, 6.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Ba ma trận viết trước, mỗi ô có đối chứng: dãy có hàng A đã ký trong worktree và tiep trỏ B → đơn mang A, chỉ B có hồ sơ đang làm → đơn mang B; lộ trình có hàng F12 slug bảy từ → hang them F12 thêm đúng slug và ma, câu tự do → slug suy như cũ; nghi rồi chay-lai → dãy nhận hàng kế lại, chạy lại lần hai không đổi gì» chưa?
- Kết quả nào là SỐNG: Ba ma trận viết trước, mỗi ô có đối chứng: dãy có hàng A đã ký trong worktree và tiep trỏ B → đơn mang A, chỉ B có hồ sơ đang làm → đơn mang B; lộ trình có hàng F12 slug bảy từ → hang them F12 thêm đúng slug và ma, câu tự do → slug suy như cũ; nghi rồi chay-lai → dãy nhận hàng kế lại, chạy lại lần hai không đổi gì
- Kết quả nào là CHẾT: chưa đạt «Ba ma trận viết trước, mỗi ô có đối chứng: dãy có hàng A đã ký trong worktree và tiep trỏ B → đơn mang A, chỉ B có hồ sơ đang làm → đơn mang B; lộ trình có hàng F12 slug bảy từ → hang them F12 thêm đúng slug và ma, câu tự do → slug suy như cũ; nghi rồi chay-lai → dãy nhận hàng kế lại, chạy lại lần hai không đổi gì» khi hết timebox
- Timebox: 2026-11-05 — mốc «Tinh chỉnh sau hai đợt thử»; chủ kho chốt ở Cổng Đáng 26/10
