---
slug: trang-lo-trinh-doc-mot-phut
at: 2026-10-03T15:12:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Không ca nào kiểm từng dạng cờ ra đúng câu dịch của nó; LT-91 dùng chính bảng dịch làm đáp án, LT-97 chỉ đếm và tìm chuỗi cấm | Một dòng dịch đảo hai giá trị hoặc một dạng rơi về nguyên văn mà vẫn xanh; owner sửa nhầm chỗ | Ma trận viết sẵn từng dạng, câu đích viết tay, bốn số đếm bằng nhau, mutant đảo nhóm | fixed: AC-9 thêm vế câu đích + giữ giá trị; E9 thành ma trận viết sẵn, bốn số đếm, LT-97-do2 đảo nhóm |
| P1 | contract | Lời hứa «lớp phân tích không đổi» (thay vế byte của hai hồ sơ đã ký) không có eval | S3 sửa nhầm lớp phân tích khi tách lớp vẽ, mọi ca vẫn xanh vì đọc kết quả mới | So phanTichKho + JSON quét với bộ máy v2.21.0 (git archive trọn thư mục), mutant đổi luật nhóm | fixed: thêm AC-12 + E12 (LT-100, LT-100-do), trục F trỏ AC-12, Notes trỏ AC-12 |
| P1 | evals | Ảnh PNG hội đồng đọc không gắn với trang của cây đang kiểm | Ảnh cũ từ S1-D vẫn nằm trong mau/, hội đồng chấm ĐẠT trên ảnh lỗi thời | Gắn ảnh vào HTML nguồn bằng băm, lệch thì ĐỎ | fixed: lệnh chụp ghi mau/anh.json (băm HTML nguồn + băm PNG); LT-99-mau so băm, LT-99-do mutant; so điểm ảnh khác máy bị loại vì phông chữ mỗi hệ điều hành khác nhau |
| P2 | evals | Vế «không ghi ngày vẽ» chỉ là assertion vắng-mặt đứng một mình | Bộ vẽ ghi ngày dạng khác, ca vẫn xanh, sang hôm sau --check đỏ | Vẽ dưới hai đồng hồ, so byte, mutant chèn ngày | fixed: AC-6 thêm hai đồng hồ; E6 thêm LT-95 + LT-95-do |
| P2 | contract | Tiêu đề cột dính, chọn trọn lệnh, tô viền hàng tại neo đã hứa ở Cổng Đáng/thiết kế mà không AC nào đo | Gỡ sticky hoặc user-select mà mọi eval xanh | Đo trên Chrome từng vế, mỗi vế một mutant | fixed: AC-8 thêm ba vế; thêm E8b (LTT-hanh-vi, LTT-hanh-vi-do) |
