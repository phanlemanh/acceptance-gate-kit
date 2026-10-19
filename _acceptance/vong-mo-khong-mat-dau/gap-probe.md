---
slug: vong-mo-khong-mat-dau
at: 2026-10-19T13:31:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Ma trận AC-9 chỉ đo danh tính và «đã có trả lời» cho XONG; nhánh TRẢ trên yêu cầu kiểu cũ thiếu hàng «TRẢ do P2 gõ» và «TRẢ trên yêu cầu đã có trả lời». | Kiểm danh tính và kiểm «đã đóng» chỉ gắn ở nhánh XONG; P2 gõ TRẢ ghi đè câu trả lời «duyet» G đã gửi cho một yêu cầu gia hạn, hạn thuê không được kéo dài; E8, E9 vẫn xanh. | Thêm hai hàng vào AC-9/E9, băm tra-loi trước === sau, ca đỏ bỏ kiểm danh tính nhánh TRẢ. | fixed: AC-9 và E9 thêm hai hàng (9 hàng), tra-loi giữ nguyên từng byte, ca đỏ GD-09-do tra-bo-danh-tinh |
| P1 | contract | Thước của ngưỡng 2 chỉ đếm dòng tin.jsonl mã kiểu cũ — lối ấy bị chặn tận gốc nên luôn 0, không có chiều đỏ; cả hai thước thiếu mẫu số N. | Câu trả lời bị đẩy sang tra-loi/hong/ hoặc hook chờ người vẫn báo chờ; grep vẫn 0, chủ kho đọc thành «đạt»; hoặc 0 vòng tới XONG mà đọc thành «0 kẹt». | Đếm tra-loi/hong/ và hook chờ người cho mỗi yêu cầu đã đáp; khai N, N = 0 thì vô hiệu. | fixed: Đường đo viết lại — ngưỡng 2 đếm ba số (hong/, hook chờ, dòng nuốt) kèm N; ngưỡng 1 kèm N; N = 0 là VÔ HIỆU |
| P1 | evals | Chen trong khe dựng bằng trễ đồng hồ 1500 ms, không bắt tay; «mốc ghi dấu < mốc canh thoát» không chứng dấu ghi SAU lần đọc của canh. | Máy chậm: hook ghi trước khi canh đọc tệp, bản tiêm cũng xanh, ca đỏ báo not ok — đỏ vì phép đo; hoặc hook quá khe, kết quả ngẫu nhiên. | gh giả ghi mốc «bắt đầu đọc» và «trả về»; ca chờ mốc đầu rồi mới chạy hook; assert ba mốc. | fixed: thuật ngữ «chen trong khe» trong hợp đồng và E1, E2, E4 dùng mốc bắt tay của gh giả, in ba mốc mỗi hàng |
| P2 | contract | AC-2 hứa chặn đúng một lần tuyệt đối trong khi sổ và Known limits khai khe mili-giây có thể làm chặn thêm một lần. | Người duyệt ký AC-2 như bảo đảm tuyệt đối; trên kênh thật hook ghi dấu chặn đúng khe giữa đọc lại và đổi tên tệp, chặn lần nữa. | Thu Then của AC-2 về «trong khe chờ mạng», trỏ Known limit. | fixed: AC-2 nói rõ lời hứa chỉ cho khe chờ mạng, khe mili-giây trỏ Known limits kèm ngưỡng |
| P2 | evals | Bản gói đời trước cho AC-3 không ghim sha. | Ca suy sha lúc chạy: sau khi GT2 gộp tệp «đời trước» do chính bản mới sinh, ca đỏ không đỏ; clone nông thì git archive hỏng. | Ghim sha literal, đối chứng dương may_su, lỗi hạ tầng có tên. | fixed: ghim 33c9e64f, đối chứng dương may_su chứa «đã đến», git archive hỏng → thông điệp hạ tầng có tên |
