---
slug: the-hien-loi-trong-hop-dong
at: 2026-11-10T14:40:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ bỏ làn V ghi một-lối, không khó đảo, trong khi giá của nó chạm đường giao hàng; ngoài phạm vi không nêu giá | Chủ kho duyệt và tin lỗ đã đóng, nhánh làn V chưa gộp, một hồ sơ T2 còn lỗi đi tiếp không chữ ký | Dòng mới thay dòng cũ, nguồn chỉ-người, khó đảo, ngoài phạm vi in giá | human-gate1: thành Hỏi cho chủ kho, ngoài phạm vi và design đã in giá |
| P0 | evals | Trang bằng chứng có người nhìn mà không có phép đo bằng mắt; E3, E4 chỉ đo vị trí chuỗi | Khối bị bọc trong mục gập hoặc tiêu đề in sau phần gập, phép đo vẫn xanh, người ký không thấy lỗi | Eval bằng mắt trên hồ sơ thử có lỗi, kiểm tổ tiên và phần gập | fixed: thêm E12 bằng mắt, siết E3 và E4, sửa dòng sổ bỏ design-pass theo đúng tiền đề, mặt đọc thêm ui |
| P1 | evals | Lời hứa về câu cho người đọc chỉ đo ở chỉ dẫn; không có ca thiếu câu và không có đường đi trọn | Phân loại trả câu rỗng, phép đo vẫn xanh, hồ sơ mới toàn câu tạm | Ca âm và ca round-trip | fixed: E10 thêm TL-11 đường đi trọn và TL-12 câu rỗng; rejected phần schema từ chối: làm chết cả lượt chấm vì thiếu một câu tệ hơn đi đường của AC-5 |
| P1 | evals | E8 dựa vào LB5 nhưng không chạy suite đó; lời không nới luật chưa có thước | Cờ mới thực chất sinh câu hỏi, LB5 không báo vì cờ đã được khai | E8 chạy LB5; so danh sách cờ với mã trước bản vá | fixed: thêm E13 chạy suite plugins, E8 thêm TL-13 |
| P1 | evals | Hồ sơ thử viết đúng khuôn; số khảo sát hồ sơ thật không có eval giữ; thiếu biên «Không có …» và mã tiêu chí không tra được | Câu «Không có kiểm thử cho AC-3» bị đọc là không lỗi, thẻ sạch giả | Quét hồ sơ thật giữ bất biến, thêm ca biên | fixed: thêm E14 và TL-14 quét hồ sơ thật, TL-15 hai ca biên, AC-5 khai kết quả khi không tra được |
