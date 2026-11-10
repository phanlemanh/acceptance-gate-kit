---
slug: t3-arm-chu-ky-khong-im
at: 2026-11-10T07:20:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Notes ghi khép cả Ngoài-7 lẫn Ngoài-16, trong khi nguồn vào chỉ nói Ngoài-16, sổ không có dòng về Ngoài-7, và Out of scope loại các mục Ngoài khác. Việc đóng mục của hồ sơ khác chờ chủ kho quyết [d-20261110T033101Z-24] [d-20261110T022553Z-22]. | Người duyệt ký mà không biết Ngoài-7 là gì; sau vòng mục đó bị coi là đã khép mà không phép đo nào kiểm. | Mọi mã Ngoài trong Notes phải có trong design và sổ. | fixed: bỏ Ngoài-7 khỏi Notes, ghi rõ hợp đồng không ghi gì vào hồ sơ kia. |
| P0 | contract | Dòng sổ d-5 và d-6 không đứng được: câu trích của d-5 chỉ tả hành vi, không quyết việc giữ lời báo sai; lối chết của d-6 là dự đoán, không phải ràng buộc. | Cổng 1 đọc hai dòng như điều đã có căn cứ nên không cân lối khác. | Mỗi dòng mục-tiêu có câu quyết, mỗi dòng một-lối nêu ràng buộc. | human-gate1: d-5 thành Hỏi-2 có khuyến nghị và lối khác. fixed: d-6 thay bằng chạy quét thật, Coverage ghi kết quả. |
| P1 | evals | Design nói dưới T3 nhưng trục hồ sơ và các eval chỉ có T2, lý do ghim chữ hạng T2. | Code viết điều kiện đúng bằng T2; hồ sơ T1 ở kho khai T1 lọt mà mọi eval xanh. | Thêm T1 vào trục, một ca đỏ mang đúng hạng T1 và một ca đột biến. | fixed: thêm trục, AC-7, E8 và ca HA49-do, HA49-mut. Đo: T1 chưa ký đã bị luật theo từng hồ sơ chặn, ô đáng đo là T1 có ký. |
| P1 | contract | Ô thiếu node mâu thuẫn bảng đo: AC-4 đòi thoát 0 cho hồ sơ chưa ký mà thiếu node thì luật khác chặn; AC-5 đòi về clean trên fixture không thể về clean; E4 thiếu ma trận theo máy; ô thiếu node nhân strict bị sót. | AC-4 đỏ dù cổng đúng, hoặc chỉ đo một máy mà Cổng 2 tưởng đã phủ. | Đo từng ô rồi viết lại AC theo kết quả; expected có ma trận số assert bằng số ô. | fixed: đã đo mười ô, AC-4 và E4 thành bảng viết trước, AC-5 giới hạn vào kho thử về clean được, thêm ô thiếu node nhân strict. |
| P1 | evals | E6 không ghim số ca, lời hứa là toàn bộ ca cũ còn xanh. | Một ca cũ bị xoá khi chỉnh HA36, E6 vẫn xanh trên bộ thước đã hạ. | Ghim n và đối chiếu danh sách tên ca cũ. | fixed: E6 liệt kê đích danh 46 ca cũ và 17 ca mới, ghim 63 passed; thiếu một tên là đỏ. |
