---
slug: evals-sat-le-doc-du
at: 2026-10-10T11:05:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Gap-probe — evals-sat-le-doc-du

Phản biện context sạch (tác tử tươi, sáu đầu vào: design · contract · evals · decisions · claims · opportunity).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | Chiều đỏ VP2 của E3 («nới cột khoá thành mọi thụt») trùng ngữ nghĩa bộ đọc cũ — trên hồ sơ thụt 4 nó cho 0 lệch | Vật đúng mà VP2 không bao giờ in «vi phân lệch» → E3 đỏ oan, hoặc người làm chèn hồ sơ viết tay để ép đỏ (trái «CÙNG bộ hồ sơ») | Đột biến chắc đổi kết quả (bỏ mục cuối của mọi danh sách khối) + kiểm trước «đột biến tương đương» khi số tiêu chí đổi bằng 0 | fixed: AC-3 + E3 đổi đột biến thành «bỏ mục cuối của mọi danh sách khối», thêm phép kiểm trước ghim «đột biến tương đương» |
| P1 | evals | E4 (bảy kho) tự xanh khi thiếu kho; ngưỡng «620 hồ sơ» không có đường đo ép | Máy thiếu crm → so 125 hồ sơ của kit, thoát 0, Cổng Bằng chứng ký «620 hồ sơ 0 lệch» trên 125 | In sha + số hồ sơ từng kho; thiếu kho → không xanh; tổng ≥ 620; hồ sơ sát lề crm có mặt theo chiều ĐỌC THÊM | fixed: AC-3 + E4 — thiếu kho thoát 2 «không đọc được ở đây: <kho>», in sha/số từng kho, tổng ≥ 620, crm thuoc-mot-cho-khai-quet-man phải có mặt trong danh sách đọc-thêm |
| P1 | contract | Ma trận AC-1 đếm theo tiêu chí, không theo trường; mảng bắt buộc theo EVAL_REQUIRED không nằm trong mô hình | Trường bắt buộc vắng ở cả hai phía thì «bằng nhau»; một mảng bắt buộc rơi ở sát lề lọt qua | Ma trận cách viết × tiêu chí × trường, tập trường rút từ EVAL_REQUIRED; mô hình hụt trường → ĐỎ | fixed: AC-1 + E1 — tập trường rút từ EVAL_REQUIRED lúc chạy, ĐỎ «mô hình hụt trường», số so = số phần tử ma trận ba chiều |
| P2 | contract | Ngưỡng CHẾT «còn đường đọc sát lề rơi im lặng» không có thước trên trọn lớp bên đọc | Một bên đọc chưa phân loại vẫn dùng biểu thức riêng; mọi eval xanh | Bảng phân loại viết trước + danh sách tệp rút bằng máy; tệp mới chưa phân loại → ĐỎ | fixed: thêm AC-11 + E11 (lưới bên đọc, chiều đỏ trên bản sao cây) và dòng Đường đo cho ngưỡng CHẾT |
| P2 | design | Bản base ghi không khớp (design/AC-2 thiếu `scripts`, E8/E9 cần nó) | Chiều đỏ của E8 gọi acceptance-gold của base → ENOENT, đỏ vì hạ tầng (lớp P150) | Một hằng thư mục base dùng chung + kiểm «base thiếu tệp» | fixed: hằng BASE_DIRS (feature-loop/scripts, lib, scripts) ở design, AC-2, E2; thiếu tệp → ĐỎ «base thiếu tệp: <đường>» |
