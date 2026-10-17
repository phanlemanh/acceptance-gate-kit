---
slug: cua-tin-hieu-goc-moi-worktree
at: 2026-10-16T08:11:12Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Chưa ca nào gửi hai ý từ HAI worktree vào cùng nguồn; mutant chỉ chuyển trọn bên ghi về gốc phiên, không phủ số thứ tự tính theo gốc phiên mà đường ghi theo thư mục chính | Gửi từ A rồi từ B, B tính số kế là 1 và đè ý của A ở thư mục chính, GW xanh | Ca gửi từ A, B, thư mục chính ra -1, -2, -3, băm giữ; đỏ khi số tính theo gốc phiên | fixed: AC-1 thêm ba lần gửi A, B, thư mục chính, băm giữ; chiều đỏ GW-1-do2 «ý bị ghi đè» |
| P1 | contract | Đường đo lệch ngưỡng: phép bằng đỏ giả khi worktree đã gom trên nhánh; N đếm mọi ý nên xanh giả khi không ý nào gửi từ worktree | Worktree gom xong chưa gộp, tập nhỏ hơn, đọc CHẾT dù vật đúng; mọi ý gửi từ thư mục chính, đọc SỐNG mà nhánh worktree chưa chạy | Phép bao hàm có bản gom nhánh; N = ý gửi từ worktree | fixed: Đường đo dùng phép bao hàm, N = tệp mang noi_dung.gui_tu worktree (khoá mới ghi ở AC-1); dòng sổ S1 «đường đo bao hàm» |
| P1 | evals | AC-2 chỉ so một dòng thẻ, không đo phép lọc thư mục nguồn chưa có của thẻ theo gốc mới | Worktree không có thư mục nguồn, thẻ thêm cờ vàng sai, GW-2 vẫn xanh | So trọn khối dòng cửa tín hiệu ba gốc trên fixture nguồn không theo dõi; đỏ khi lọc theo gốc phiên | fixed: fixture chung nguồn không theo dõi bởi git; AC-2 so trọn các dòng «Cửa tín hiệu:» và «! cửa tín hiệu:»; chiều đỏ GW-2-do2 |
| P1 | design | --duong, --rang, --cau, bản đồ chưa chạy trong worktree; tep tương đối gốc nào không khai | Phiên gom trong worktree thấy id nhưng một lệnh đọc khác vẫn thấy tập rỗng | Chạy các lệnh ở worktree, so với thư mục chính; khai rõ tep | fixed: AC-2 thêm --duong, --rang, --cau, product-map ở ba gốc; Notes khai tep tương đối nguồn ở thư mục chính và skill gom đọc noi_dung từ JSON, không mở tệp |
| P2 | contract | Thiếu gốc là thư mục con của kho và thư mục thường lồng trong kho git | Thư mục lồng trong kho git: gocKhoChinh trả kho bên ngoài, ý rơi ra checkout khác | Hai ca: thư mục con giữ byte; thư mục lồng giữ ý tại gốc | fixed: thiết kế thêm chốt «gốc là đỉnh worktree» (--show-toplevel = gốc); AC-4 thêm GW-4-con; AC-6 thêm GW-6-long + chiều đỏ GW-6-do «ý rơi ra kho bên ngoài» |
