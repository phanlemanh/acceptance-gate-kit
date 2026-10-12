---
slug: kiem-ban-cai-sau-phat-hanh
at: 2026-10-12T23:40:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design, evals (E7) | Chế độ máy thật chưa nói tệp nào tính là thừa; KB-7 chỉ cài từ git archive (nguồn sạch), không từ bản checkout thật | Máy cài đúng tag từ bản checkout có node_modules hay .claude/ — so tập tệp báo khác tag trên bản cài đúng, đường đo đếm 0 dòng ĐỎ may hỏng | Luật: chỉ tệp của cây ref quyết ĐỎ (thiếu/lệch); thừa in VÀNG; ca checkout thật có tệp chưa theo dõi + tệp bị bỏ qua → khớp, sửa tệp theo dõi → khác tag | fixed: đo 13/10 bộ đệm thật của máy này có .claude/worktrees, node_modules, .DS_Store — design §2.1/§2.2 luật thừa = VÀNG; AC-4 thêm ca thừa; AC-7 + E7 thêm KB-7 checkout-that |
| P1 | design (§2.1 bước 5), evals (E2, E5, E6) | Hồ sơ kho giả lập do HEAD viết theo khuôn bên đọc, không do bên-viết của bản cài sinh | HEAD đổi khuôn hồ sơ, KB-6 cài tag cũ không đọc được → mọi lượt chấm đỏ; hoặc fixture khít bên đọc nên the-cong xanh trong khi kho khởi tạo thật hỏng | Sinh kho bằng bên-viết của bản cài; ca hai phiên bản | deferred: kho khách khởi tạo hồ sơ bằng phiên Claude điền khuôn chữ (references/contract-template.md), không có bộ sinh máy để gọi; khuôn giữ schema_version 1 tối thiểu; đổi khuôn làm KB-6 ĐỎ chứ không im — khai ở contract Notes + design §4 kèm ngưỡng |
| P1 | evals (E5, E2), contract (Coverage trục B) | Hai chiều của lưới trước-gộp đo bằng chuỗi tự khai; hook-goi và hai điều kiện của tac-tu-cham chỉ có chiều xanh | Bản dựng bỏ bước kho lành mà vẫn in câu ấy → pre-merge chặn tất vẫn ĐẠT; hook-goi rỗng luôn ĐẠT | Mutant pre-merge thoát 1; mutant hooks.json trỏ tệp vắng; tác tử sai name; tác tử có Edit | fixed: bỏ ca chuỗi hai-chieu; AC-5 + E5 thêm luoi-chan-tat và hook-goi; AC-3 + E3 thêm sai-ten và cam-but; trục B ghi đủ |
| P2 | evals (E1) | Phép đo không-chạm-máy-thật là âm tính một mình, không phủ cache/ và marketplaces/ | Tệp không tồn tại → băm bằng nhau giả; CLI ghi thẳng bộ đệm thật bỏ qua CLAUDE_CONFIG_DIR mà hai JSON không đổi | Khẳng định tệp tồn tại khác rỗng; độ nhạy của hàm chụp; chụp tên/cỡ/mtime dưới cache/ và marketplaces/ | fixed: AC-1 + E1 |
| P2 | evals (E8) | Ca thiếu-claude không kiểm tiền đề claude thật sự vắng | Máy có claude cùng thư mục với node → ca đỏ vì hạ tầng | Thư mục tạm chỉ có liên kết node + git; khẳng định command -v claude thất bại | fixed: AC-8 + E8 |
