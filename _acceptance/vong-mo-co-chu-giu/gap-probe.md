---
slug: vong-mo-co-chu-giu
at: 2026-10-17T14:25:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Hai dòng sổ ghi «một lối» mà lối khác còn sống. (1) Hook dừng chặn MẶC ĐỊNH ở mọi kho có đợt hay kênh ngay khi nâng gói; sổ không cân lối bật theo lựa chọn [lo-trinh-gio-may#F1]. (2) Lối chết «chặn khi gh lỗi thì khoá phiên» bị chính lối thoát chặn-một-lần vô hiệu, nên chọn không chặn khi kênh lỗi là khẩu vị rủi ro [cua-tin-hieu-giua-chien-dich#F1]. | crm nhận bản, phiên của đợt đang chạy bị chặn mà kho không chọn bật. Hoặc mạng chập chờn, hook chỉ cảnh báo, tin kênh bị sót như ca #420. | Hai dòng sổ mới mang supersedes, thành câu hỏi ở Cổng Phạm vi; AC-8 thêm hàng bật hay không bật. | fixed: (1) hook chỉ chặn vòng mở bằng tin, yêu cầu cũ không làm chặn — kho không dùng tin thì không đổi hành vi (dòng sổ mới, căn cứ luật 26/09; AC-7 hàng h). human-gate1: (2) thành Hỏi-2, dòng sổ supersedes d-20261017T141606Z-4, khuyến nghị chặn một lần; AC-7 hàng f theo câu trả lời. |
| P1 | evals | Kênh giả không có phân trang (GitHub trả 30 bình luận mỗi trang) và không có ca gh treo; E4b đếm n bằng chính bộ đọc nên a + b + c === n tự khép [lo-trinh-gio-may#F2]. | #308 có hơn 30 bình luận, bộ đọc không phân trang chỉ thấy 30 đầu, hook kênh không bao giờ chặn mà AC-5 và E4b vẫn xanh. Mạng treo thì hook treo tới hết trần của Claude Code. | Kênh giả trang 30 kèm header Link, ca 35 bình luận; E4b so n với số đếm độc lập bằng gh --paginate; cờ treo cho hook và canh, mỗi hàng có chiều đỏ. | fixed: AC-5 thêm phân trang (35 bình luận, lượt 1 đọc 36) + GT-05-do bo-phan-trang; E4b đếm độc lập bằng gh api --paginate và đòi n > 30; AC-6 hàng g và AC-7 hàng g cho gh treo, GT-07-do bo-tran. |
| P1 | contract | Lối thoát của hook không có hàng cho worktree giữ kênh, và thiết kế nói dấu đã chặn ghi «vào nơi chứa» — với kênh là issue GitHub. | Dấu chỉ ghi được cho đợt nên phiên giữ kênh bị chặn ở mọi lần dừng; hoặc hook đăng một bình luận lên kênh dùng chung mỗi lần dừng mà không ai quyết. | Dấu đã chặn của kênh ở trạng thái cục bộ; AC-8 thêm hàng cwd giữ kênh, đếm lời gọi ghi của gh giả === 0. | fixed: design §2.6.4 — dấu luôn ở chỗ cục bộ, hook không bao giờ ghi lên issue; AC-8 hàng a′ + GT-08-do chan-mai-kenh. |
| P1 | contract | Đường đo ngưỡng thứ hai mù với yêu cầu viết văn xuôi (rơi vào nhóm bỏ qua — đúng hình dạng 0/44 đo 17/10); không đếm khuôn cũ có đích; tin so là ảnh chụp, không phải cửa sổ 14 ngày. | Sau 14 ngày máy vẫn gửi yêu cầu bằng câu thường; sổ báo 0 vòng quá hạn, 0 khuôn cũ, ngưỡng đọc thành SỐNG trong khi không yêu cầu nào trỏ về mã. | Ba nhóm theo created_at trên cửa sổ, kèm danh sách nhóm bỏ qua để đếm tay; dòng đo vô hiệu khi tổng bằng 0. | fixed: AC-5 thêm `tin so --kenh --tu <ngày>` ba nhóm + danh sách bỏ qua; Đường đo viết lại (SỐNG khi ba số bằng 0, vô hiệu khi tổng 0). |
| P2 | contract | Lời hứa «quá hạn mức 2 lên xem» không có AC; quá hạn của kênh chỉ thấy khi có người chạy tin so --kenh. | tin so báo đúng mức 2 nhưng xem không đọc tin, giám sát không thấy, chủ kho lại phải hỏi. | E3 thêm vế xem --json ở phút 61 + chiều đỏ. | fixed: AC-3 thêm vế xem --json và xem chữ ở phút 61 + GT-03-do xem-bo-tin. deferred: quá hạn kênh lên bề mặt thường trực — hook kênh và tin canh --cho đã đánh thức phiên giữ kênh; không thêm bề mặt mới. |
