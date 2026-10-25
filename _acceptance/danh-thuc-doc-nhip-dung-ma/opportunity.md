---
schema_version: 1
slug: danh-thuc-doc-nhip-dung-ma
feature: Đánh thức và chẩn đoán đọc nhịp sống của giám sát bằng đúng mã phiên mà hook ghi, nên giám sát đang chạy không bị báo «không có nhịp sống»; phiên giám sát mở trước khi nạp gói được nói ra đúng tên thay cho báo chủ kho
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TC1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TC1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Đánh thức và chẩn đoán đọc nhịp sống của giám sát bằng đúng mã phiên mà hook ghi, nên giám sát đang chạy không bị báo «không có nhịp sống»; phiên giám sát mở trước khi nạp gói được nói ra đúng tên thay cho báo chủ kho

Gốc: onehub-invest/_acceptance/lo-trinh-2310/

Vì sao: Gốc: onehub-invest/_acceptance/lo-trinh-2310/ — đợt cam-mau-2310 cắt ở hồ sơ này chạy thành đợt Điều phối – Thợ dieu-phoi-dot0-cam-mau (năm dãy, khoảng 30 PR gộp 25–26/10), đợt thật thứ hai của gói; lịch 30′ gần như lần nào cũng trả bao-chu-kho «giám sát không có nhịp sống» khi giám sát đang làm việc. Đợt thử thứ nhất (crm 19–20/10) vấp cùng lỗ — hạt giống docs/plans/2026-10-20-hat-giong-nam-loi-kit-tu-dot-lo-trinh-tin-hieu.md mục 1, kit #403; hạt giống docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md mục 2.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Ca dựng đợt có vai mang mã app và song/ mang mã CLI cùng worktree: chẩn đoán trả du, đánh thức không trả bao-chu-kho; đối chứng không tệp nhịp nào cùng worktree vẫn trả thieu và bao-chu-kho; 14 ngày sau khi một kho chạy đợt nhận bản có TC1, không lần bao-chu-kho nào mà giám sát đang chạy» chưa?
- Kết quả nào là SỐNG: [đề xuất] Ca dựng đợt có vai mang mã app và song/ mang mã CLI cùng worktree: chẩn đoán trả du, đánh thức không trả bao-chu-kho; đối chứng không tệp nhịp nào cùng worktree vẫn trả thieu và bao-chu-kho; 14 ngày sau khi một kho chạy đợt nhận bản có TC1, không lần bao-chu-kho nào mà giám sát đang chạy
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Ca dựng đợt có vai mang mã app và song/ mang mã CLI cùng worktree: chẩn đoán trả du, đánh thức không trả bao-chu-kho; đối chứng không tệp nhịp nào cùng worktree vẫn trả thieu và bao-chu-kho; 14 ngày sau khi một kho chạy đợt nhận bản có TC1, không lần bao-chu-kho nào mà giám sát đang chạy» khi hết timebox
- Timebox: [đề xuất] 2026-11-05 (mốc Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo)
