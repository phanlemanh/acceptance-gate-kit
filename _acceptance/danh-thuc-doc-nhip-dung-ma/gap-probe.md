---
slug: danh-thuc-doc-nhip-dung-ma
at: 2026-10-25T23:50:14Z
verdict: findings
p0: 1
p1: 4
p2: 0
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | Chiều đỏ của E1 không bao giờ đỏ được: bên đọc hợp ba nguồn mà ma trận TC1-03 luôn dựng vai có phien_cli, không ca nào cô lập riêng từng nguồn | Mutant gỡ ma_app vẫn xanh vì bên đọc thấy song/c-gs.json qua phien_cli — TC1-01-do đỏ theo cấu tạo, hoặc sửa cho xanh thì đường ma_app không được đo | Ma trận bảy hàng ở ba biến thể (chỉ phien_cli · chỉ ma_app · cả hai); mutant gỡ ma_app chỉ đỏ biến thể ma_app, mutant gỡ đọc phien_cli chỉ đỏ biến thể phien_cli | fixed: AC-3 và E3 chạy ba biến thể; hai mutant TC1-03-do go-ma-app và bo-doc-phien-cli, mỗi mutant chỉ đỏ đúng biến thể của nó, hai biến thể còn lại im; E1 trỏ chiều đỏ sang TC1-03 |
| P1 | contract | Thiếu mục Đường đo cho vế 14 ngày của ngưỡng ô | Tới hạn đọc ô không có số, ô bị đọc theo cảm tính | Mục Đường đo nêu nguồn số, cách xác định giám sát đang chạy, cửa sổ đếm, ngày bắt đầu | fixed: contract thêm mục Đường đo — vế ca dựng → AC-3, AC-5; vế 14 ngày đếm từ tin bao-chu-kho của lịch 30′ gửi chủ kho, chủ kho ghi bằng observed; khai rõ danh-thuc chỉ đọc nên không có sổ máy |
| P1 | design | Design để đánh thức vẫn báo chủ kho khi vai mang hook_thieu_luc, trái câu ô «thay cho báo chủ kho»; lối thức-tươi còn sống mà d-3 ghi một-lối | Giám sát thiếu hook vẫn làm việc mà lịch 30′ gọi chủ kho mỗi lượt | AC-5 thêm hàng thức tươi; d-3 được thay | fixed: design §3.4 đổi sang thang leo theo lúc thức (dưới 40′ khong · 40–80′ nhắn giám sát · quá 80′ báo chủ kho câu đúng gốc); AC-5 và E5 ma trận ba hàng + mutant bo-thang; dòng sổ mới supersedes d-3, căn cứ là câu ô |
| P1 | evals | Mốc so E6–E8 là merge-base lúc chạy — trôi khi vòng gộp, không có ở clone nông | Sau gộp, TC1-08-do đỏ trên main cho mọi PR sau; TC1-06 so bản mới với chính nó | Ghim sha mốc so thành hằng | fixed: sha ghim 45e9f2cf13d104aa4b1a2321a0026c4b739f8914 là hằng trong tệp test, dùng chung E1, E6–E9; contract AC-6 nêu sha |
| P1 | evals | Hàng «biến vắng» không xoá hai biến thừa kế; lượt chấm chạy trong phiên app mang hai biến thật | Hook ở hàng không biến vẫn ghi ma_app thật — xanh ở CI, đỏ ở S4 | Suite chạy hai môi trường cho cùng tập dòng ok; ca không biến assert môi trường con sạch | fixed: luật chung ở đầu evals.yaml — mọi tiến trình con chạy với hai biến đã xoá rồi mới thêm biến của ca; E1 assert môi trường con sạch; AC-9 và E9 thêm ca TC1-09 hai-moi-truong |
