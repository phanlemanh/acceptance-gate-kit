---
slug: moi-cong-khong-qua-nut
at: 2026-10-19T15:40:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ 1 ghi nguồn mục-tiêu với câu trích chỉ quyết vế «một nguồn chép nguyên văn», không loại lối viết thêm vào điều khoản mời cổng cũ; dòng sổ 6 ghi một-lối mà lối chết chỉ loại «trong LUAT-TIN» [cham-lai-khong-tu-doi#F1] [ho-so-da-ky-giu-tuoi#F2] | Khối CHƯA duyệt hiện lựa chọn tự do thành lựa chọn có căn cứ; người ký không thấy lối rẻ hơn | Mỗi dòng mục-tiêu có câu trích loại được lối còn lại; mỗi dòng một-lối có lối chết phủ mọi lối khác | fixed: hai dòng mới mang supersedes — dòng 7 (một-lối: gói điều phối không mang điều khoản cũ và có khuôn lời mời riêng), dòng 8 (quyết định thật là trong hay ngoài khối LUAT-TIN) |
| P1 | evals | AC-5…7 đo khuôn do vòng viết bằng bộ kiểm chỉ sống trong ca, không nối với điều khoản phiên đọc, không chạy trên lượt hỏng thật | Điều khoản viết lỏng mà khuôn đúng chuẩn, MQ-5…7 vẫn xanh | Hàng đỏ dựng từ lượt hỏng gốc; ca quan hệ hai chiều luật bộ kiểm ↔ cụm điều khoản; khai Known limits | fixed: MQ-5-gan so hai chiều + chiều đỏ (E5); AC-10 chạy bộ kiểm trên bản ghi phiên có lượt dựng theo mô tả lỗi gốc; Known limits khai AC-5…7 đo khuôn và lượt AC-10 dựng theo mô tả, không phải bản ghi gốc |
| P1 | contract | Thước sau khi ship không đếm câu hỏi và nút chữ thường mang chữ quyết; mẫu số và tử số khác phạm vi; đếm tay bằng jq | Phiên kết Cổng 2 bằng câu hỏi + nút «Ký»/«Trả», thước đếm 0, ô đọc SỐNG | Tử số = lượt cổng có ask hoặc actions không rỗng; lệnh đếm là chính bộ kiểm | fixed: Đường đo viết lại, cùng phạm vi lượt cổng, lệnh `--dem` của ca đo; AC-10 + E10 bảo đảm lệnh đếm |
| P2 | contract | AC-1 không đòi cụm «chép đúng như thẻ in» (dòng sổ 4 dựa vào nó) và lối dự phòng khi phiên không có công cụ gửi tệp | Phiên xoá «duyệt» thẻ in; phiên CLI bỏ bước gửi, người không thấy thẻ | Thêm hai cụm vào E1, chiều đỏ gỡ cụm | fixed: điều khoản thêm «không có công cụ ấy thì in đường dẫn trang» và «chép đúng như thẻ in»; E1 đòi chín cụm |
| P2 | evals | E9b dùng khoá dieu_phoi_khung mà đầu tệp không khai có sẵn hay phải thêm | Khoá vắng thì S4 bị hạ tầng đốt | Khai rõ; kiểm mọi config: trước S4 | fixed: đầu evals khai khoá có sẵn ở config; s4-args từ chối ref hỏng trước S4 |
