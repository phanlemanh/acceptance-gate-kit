---
schema_version: 1
slug: tep-sinh-khong-chan-gop
feature: Gộp nhánh chính vào nhánh PR không dừng ở PRODUCT-MAP.md hay LO-TRINH.html ở kho đã bật, và bản vẽ sai sau gộp vẫn bị --check bắt
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: TC3
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng TC3 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo — 05/11/2026.

Gộp nhánh chính vào nhánh PR không dừng ở PRODUCT-MAP.md hay LO-TRINH.html ở kho đã bật, và bản vẽ sai sau gộp vẫn bị --check bắt

Gốc: onehub-invest/_acceptance/lo-trinh-2310/

Vì sao: Gốc: onehub-invest/_acceptance/lo-trinh-2310/ — đợt cam-mau-2310 cắt ở hồ sơ này chạy thành đợt Điều phối – Thợ dieu-phoi-dot0-cam-mau (năm dãy, khoảng 30 PR gộp 25–26/10), đợt thật thứ hai của gói; gần như mỗi lần gộp xung đột ở hai tệp sinh, hồ sơ phải ghim lại liên tục. Kho thứ hai sau crm 16/10 (crm-onehub/_acceptance/ke-hoach-sinh-viec, PR #432 gộp lại ba lần trong một giờ) — đủ ngưỡng hạt giống docs/plans/2026-10-16-hat-giong-tep-sinh-xung-dot-moi-lan-goi.md; hạt giống docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md mục 1.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Ca dựng hai nhánh sửa hai nguồn khác nhau của cùng tệp sinh ở kho đã bật: git merge không dừng ở tệp sinh; quên sinh lại thì --check đỏ đúng tệp; kho không bật thì xung đột như cũ (đối chứng). Hai tuần sau khi một kho bật, không lần gộp lại nào vì tệp sinh» chưa?
- Kết quả nào là SỐNG: [đề xuất] Ca dựng hai nhánh sửa hai nguồn khác nhau của cùng tệp sinh ở kho đã bật: git merge không dừng ở tệp sinh; quên sinh lại thì --check đỏ đúng tệp; kho không bật thì xung đột như cũ (đối chứng). Hai tuần sau khi một kho bật, không lần gộp lại nào vì tệp sinh
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Ca dựng hai nhánh sửa hai nguồn khác nhau của cùng tệp sinh ở kho đã bật: git merge không dừng ở tệp sinh; quên sinh lại thì --check đỏ đúng tệp; kho không bật thì xung đột như cũ (đối chứng). Hai tuần sau khi một kho bật, không lần gộp lại nào vì tệp sinh» khi hết timebox
- Timebox: [đề xuất] 2026-11-05 (mốc Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa những gì crm và OneFlow vấp; hàng sinh từ đợt thử, mở khi có neo)
