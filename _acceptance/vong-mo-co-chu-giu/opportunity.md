---
schema_version: 1
slug: vong-mo-co-chu-giu
feature: Mỗi yêu cầu giữa các phiên — giám sát và thợ, máy và máy — có mã và hạn biên nhận, chỉ đóng khi có XONG kèm vật, TRẢ hay HUỶ; phiên không kết lượt khi còn tin gửi mình chưa nhận; lời giao việc thiếu kết quả hay ranh giới thì không mở chip
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-17T14:06:51Z   # chủ kho gõ «đáng: build · ngưỡng: nhận» ở Cổng Đáng 17/10
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: GT1
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng GT1 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Phát hành kế sau 2.32.1 (số đặt lúc cắt) — gom các vòng xong trước ngày cắt: giao tiếp giữa các phiên (GT1); road-map dễ dùng (RD1) và hồ sơ đã ký luôn tươi (K-A) vào khi hàng của chúng lên lộ trình — 22/10/2026.

Mỗi yêu cầu giữa các phiên — giám sát và thợ, máy và máy — có mã và hạn biên nhận, chỉ đóng khi có XONG kèm vật, TRẢ hay HUỶ; phiên không kết lượt khi còn tin gửi mình chưa nhận; lời giao việc thiếu kết quả hay ranh giới thì không mở chip

Vì sao: Gốc: crm-onehub/_acceptance/dieu-phoi-hai-tang/ — ý định của hồ sơ là chủ kho thôi làm nhịp tim (04/10: 20/33 tin), mà cạnh giám sát → thợ và máy ↔ máy vẫn đóng vòng bằng trí nhớ: đo 17/10 trên #375 + #308, 0/44 yêu cầu có trả lời trỏ về mã tin; 15/10 lượt gọi #420 bị sót 4 giờ; 16/10 crm onehub 735c9969 (#453) gộp khi chưa có lượt gọi vì bộ đọc khớp trên thân tin. Chủ kho nêu 17/10; hạt giống docs/plans/2026-10-17-hat-giong-luat-giao-tiep-giua-cac-phien.md.

Gốc: crm-onehub/_acceptance/dieu-phoi-hai-tang/ — ý định «chủ kho thôi làm nhịp tim» đã ký ở hồ sơ ấy, mà hai cạnh
giám sát → thợ và máy ↔ máy vẫn đóng vòng bằng trí nhớ (số đo 17/10 ở §2 của hạt giống).

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Sau khi crm nhận bản có GT1, 14 ngày không lần nào chủ kho phải hỏi «phiên hay máy kia đã nhận chưa», và mọi yêu cầu trên kênh liên máy có trả lời trỏ về mã» chưa?
- Kết quả nào là SỐNG: Sau khi crm nhận bản có GT1, 14 ngày không lần nào chủ kho phải hỏi «phiên hay máy kia đã nhận chưa», và mọi yêu cầu trên kênh liên máy có trả lời trỏ về mã
- Kết quả nào là CHẾT: chưa đạt «Sau khi crm nhận bản có GT1, 14 ngày không lần nào chủ kho phải hỏi «phiên hay máy kia đã nhận chưa», và mọi yêu cầu trên kênh liên máy có trả lời trỏ về mã» khi hết timebox
- Timebox: 2026-10-22 (mốc Phát hành kế sau 2.32.1 (số đặt lúc cắt) — gom các vòng xong trước ngày cắt: giao tiếp giữa các phiên (GT1); road-map dễ dùng (RD1) và hồ sơ đã ký luôn tươi (K-A) vào khi hàng của chúng lên lộ trình)
