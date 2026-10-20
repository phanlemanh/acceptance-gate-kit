---
schema_version: 1
slug: moi-cong-khong-qua-nut
feature: Lời mời ở cổng chờ người kết lượt bằng chữ thường — dòng lệnh trong khối chữ, trang thẻ gửi bằng công cụ gửi tệp, không đặt dòng lệnh hay chữ quyết vào nút của hộp «bước kế»
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: chủ kho
decided_at: 2026-10-19      # chủ kho gõ «Sửa kit: giao MacBook Pro làm ngay» ở phiên Mac Studio, chuyển qua kênh crm-onehub#375 (tin 6270417731)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Chủ kho quyết 19/10, nguyên văn: «Sửa kit: giao MacBook Pro làm ngay».

Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/ — lượt Cổng Bằng chứng của hồ sơ ấy (VK1), lỗi đo ở phiên Mac Studio,
báo trên kênh crm-onehub#375 tin 6270387910.

Người gặp: chủ kho, ở mọi cổng chờ người của mọi kho tiêu thụ chạy trong app desktop. Phiên thợ kết lượt Cổng Bằng chứng
bằng hộp «bước kế» của app và đặt dòng lệnh ký vào nút trả lời. App bỏ nút có nhãn hay tin mang «@», hay mở đầu bằng «/»
hoặc «!», và cắt tin của nút ở 300 ký tự; nút bị bỏ là nút khuyến nghị thì app bỏ luôn các nút khác và cả câu hỏi. Dòng ký
mở đầu bằng «/» và dài khoảng 400 ký tự, nên chủ kho không thấy câu hỏi lẫn thẻ ký. Nút còn điền sẵn «ký hay trả: ký» —
máy viết sẵn chữ quyết của người, trái ADR 0002.

Kit chưa có dòng nào nói về hộp «bước kế»: luật mời cổng chỉ nói nội dung lời mời, không nói lời mời đi qua mặt nào.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi một kho tiêu thụ nhận bản vá, phiên còn đặt dòng lệnh cổng hay chữ quyết vào nút của
  hộp «bước kế» không?
- Kết quả nào là SỐNG: 14 ngày sau khi crm nhận bản vá, 0 lượt kết ở cổng chờ người mà nút của hộp «bước kế» mang dòng mở
  đầu «/», «!», chứa «@», hay mang chữ quyết điền sẵn — đếm trên bản ghi phiên của kho; mẫu số N = số lượt mời cổng trong
  cửa sổ, N = 0 thì thước vô hiệu.
- Kết quả nào là CHẾT: ≥ 1 lượt như thế trong cửa sổ — lời không đủ, phải dựng răng chặn ở tầng máy.
- Timebox: bản vá kit cắt ngay sau khi GT2 và KY1 vào nhánh chính (chủ kho: «GT2 xong sẽ cắt bản vá»).
