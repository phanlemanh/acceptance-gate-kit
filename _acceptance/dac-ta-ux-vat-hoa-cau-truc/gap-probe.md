---
slug: dac-ta-ux-vat-hoa-cau-truc
at: 2026-08-24T02:40:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

(Lượt probe đầu chạy hụt — ba artifact đặt nhầm cây chính, critic chỉ soi được
sự vắng mặt; 3 P0 «file không tồn tại» của lượt đó xử lý = chuyển file về đúng
worktree, không phải lỗ nội dung. Bảng dưới là lượt soi nội dung, cùng round.)

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | «Căn cứ trống = nhìn thấy tại cổng» không có cơ chế trên vật trình cổng | Máy đoán chay, thẻ không hiện gì, E5 PASS oan | Cánh W8 cờ căn-cứ-trống, cặp hai chiều | fixed: thêm cánh W8d vào design + AC-5 + eval E12 |
| P1 | evals | Chiều đỏ E2 cho phép bộ đếm tự thân (không qua reader) | Test tự đếm bằng regex riêng, reader parse hụt vẫn xanh — writer/reader trôi | Chiều đỏ đi qua output reader (W8c ghim ST bị xoá) | fixed: viết lại expected E2 — chiều đỏ phải bật W8c từ lint |
| P1 | contract | Đường đo thiếu dòng né-bị-veto và thứ-tự-điền/hình-từ-khuôn | Phiên nghiệm thu không biết đếm từ vật nào → Cổng Giá trị treo | Mỗi ngưỡng opportunity một dòng số-từ·bảo-đảm-bởi | fixed: thêm 2 dòng vào ## Đường đo |
| P2 | evals | E6–E10 fixture ST tự dựng theo khuôn bên đọc, không rút từ writer | Khuôn thật đổi format, cờ câm mà eval vẫn xanh | Hàng ST sinh bằng cùng hàm trích-từ-khuôn của E2 | fixed: expected E6–E9 buộc dùng hàm trích của E2 |
| P2 | evals | E8 biến thể file-hỏng/thiếu-marker không ghim thông điệp riêng | Nhánh file-hỏng rơi về cờ chung, owner sửa nhầm chỗ | Mỗi biến thể ghim mảnh riêng | fixed: expected E8 ghim "không đọc được" / "UX-STATE-TABLE" |
