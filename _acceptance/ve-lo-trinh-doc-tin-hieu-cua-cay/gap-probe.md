---
slug: ve-lo-trinh-doc-tin-hieu-cua-cay
at: 2026-10-17T09:55:29Z
verdict: findings
p0: 0
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | Dòng sổ «chỉ ý đã theo dõi» ghi máy quyết theo câu trích ADR 0007, nhưng câu ấy chỉ quyết «trang phụ thuộc cây», không quyết đổi mặc định ở mọi kho khai cửa; luật 26/09 xếp «bật theo lựa chọn» trước «đổi mặc định» | Kho khai cửa giữ mọi ý ngoài git theo khuôn RM3b nhận 2.32.1 → trang mất hẳn khối tín hiệu; mọi ca VT xanh vì AC-4 chỉ ghim kho có ý đã theo dõi | Câu hỏi chỉ-người thay dòng sổ; thêm ca kho mọi ý chưa theo dõi | fixed: dòng sổ mới thay dòng 1 thành câu hỏi chỉ-người (khuyến nghị đổi mặc định, lối khác khoá bật theo lựa chọn); AC-2 thêm kho mọi ý chưa theo dõi; Notes khai giới hạn «không bao giờ» kèm số đo 17/10 |
| P1 | contract | Trục B thiếu «tệp ý đã theo dõi, sửa trên đĩa chưa add»; lời «đọc từ đĩa» không AC nào đo | Bản cài đọc nội dung từ index vẫn xanh; gom sửa tệp ý rồi vẽ trước commit → trang mang bản cũ, CI đỏ | Ý m-1 sửa tiêu đề trên đĩa; chiều đỏ đọc từ index | fixed: AC-2 thêm m-1 (ghim tiêu đề mới, cấm tiêu đề cũ) + VT-2-do3 «trang vẽ bản tệp ý cũ trong index» |
| P2 | contract | Lối khởi tạo lộ trình là bộ vẽ thứ hai nhưng không AC nào chạy nó | Kho mới cài road-map trong worktree khi thư mục chính lùi → trang đầu mang ý thư mục chính, CI đỏ | Chân khởi tạo trong AC-1 | fixed: AC-1 thêm chân lo-trinh-khoi-tao.mjs --write trong worktree; nhát tiêm VT-1-do nằm ở hàm vẽ chung nên đỏ cả hai chân |
| P2 | evals | VT-3 «trang ở A không chứa id nào» là assertion âm một mình | Đường đọc của bộ vẽ hỏng hẳn ở worktree vẫn cho chân trang xanh | Đối chứng dương bằng bộ máy gốc | fixed: AC-3/E3 thêm đối chứng dương — bộ máy gốc vẽ trang ở A chứa đủ ba id, thiếu → «đối chứng không chạy: trang» |
