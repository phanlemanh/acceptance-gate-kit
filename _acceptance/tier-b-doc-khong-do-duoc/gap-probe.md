---
slug: tier-b-doc-khong-do-duoc
at: 2026-11-10T16:35:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Căn cứ không bật đòi đo đủ là lập luận vòng, bỏ sót tác dụng của cờ | Công thức mặc định cho trang không đo được mã 0, đúng mã của đạt | Dòng sổ thay thế hoặc chuyển thành câu hỏi | fixed: đảo lựa chọn, công thức luôn đòi đo đủ; AC-2 và ca TB4 chạy thật lời gọi trong tài liệu |
| P0 | contract | Nguồn mục tiêu của lựa chọn bảng chỉ trích câu mô tả vấn đề [khuon-doc-ban-do-that#F1] | Cổng đọc rằng người ký đã quyết hình thức bảng | Dòng sổ đổi sang một lối với ràng buộc nêu được | fixed: dòng sổ thay thế, nguồn một lối |
| P0 | contract | Lý do bỏ quét nói một chiều, trái với ma trận hai chiều; tập cặp chỉ gồm thứ năm tình huống chạm tới | Bộ quét thêm kết quả ở nhánh ngoài ma trận mà phép đo vẫn xanh | Nhát phá chèn nhánh mới, đối chiếu tập khai trong nguồn với ma trận | fixed: dòng sổ và mục Coverage sửa theo số trục thật; ca TB0b và TB-do-12 |
| P1 | evals | Không có bảng mong đợi viết trước cho hàng đạt, từ chối, chặn | Đổi hàng từ chối thành chặn mà cả bộ vẫn xanh | So đủ năm hàng với bảng viết trước, thêm nhát phá | fixed: bảng mong đợi năm hàng trong tệp ca, ca TB-do-10 và TB-do-11 |
| P1 | evals | Chưa đo kênh tác tử chấm và cổng bằng chứng thật | Tác tử trả mã 0 kèm cờ bị đọc thành đạt; chặn kèm mã 5 bị cổng hiểu sai | Câu hỏi E4 và phép kiểm qua cổng bằng chứng | fixed: E4 thêm câu về trường mã; AC-6, ca TB5 và TB-do-14 đi qua bộ kiểm cổng thật. Không gắn nhãn xuyên lớp vì không có mặt người nhìn |
