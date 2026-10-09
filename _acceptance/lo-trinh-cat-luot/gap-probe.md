---
slug: lo-trinh-cat-luot
at: 2026-10-09T00:10:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Ngưỡng CHẾT «owner viết lại ≥ 1/3 hàng skill sinh» không có đường đo | owner sửa nhiều hàng trong PR cắt mà phiên nghiệm thu không có số để đọc kill | đếm hàng đổi giữa commit đầu phiên cắt và commit gộp PR ở git crm | fixed: thêm dòng Đường đo (không AC, đo ở kho tiêu thụ) |
| P1 | evals | Nhịp dựng hồ sơ thử theo khuôn bên đọc, không round-trip với hồ sơ ký thật | bộ đọc ngày lệch khuôn lệnh ký, mọi hồ sơ bị bỏ qua, nhịp n 0 im lặng | chạy --nhip trên hồ sơ đã ký thật của kit + mutant đổi định dạng ngày | fixed: AC-7 + E7 thêm LT-136 kho-that và LT-136-do dinh-dang |
| P1 | design | Ca đợt chưa cắt mâu thuẫn với «đúng một dòng lỗi nêu mã» | N dòng mã vắng cộng một dòng chưa cắt làm E2 đỏ trên vật đúng design | luật nén thành một dòng chưa cắt nêu đợt và số mã | fixed: design luật 1, AC-2, E2 |
| P2 | contract | Dòng bước kế nhìn thấy mà không eval Chrome nào đo trang có nó | câu bước kế tràn ô ở 375 mà bộ đo cũ không chạm | ca Chrome trên trang có hàng ô cho-nghiem-thu + mutant bỏ lớp chữ phụ | fixed: AC-13 + E13 (LTT-buoc-ke) |
| P2 | design | Phạm vi luật khuôn và ngày chưa rõ — hàng cũ có thể làm đợt mới đỏ | lượt cắt kế của crm đỏ vì hàng cắt tay cũ quá mốc, phiên phải sửa hàng nó không cắt | hàng ngoài đợt in cảnh báo, không đổi mã thoát; vi phân trên lộ trình OKR thật | fixed: design luật 3–4, AC-4, AC-6, E4, E6 (LT-135 crm-okr) |
