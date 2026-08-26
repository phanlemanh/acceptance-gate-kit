---
slug: release-2-4-0
at: 2026-08-26T13:57:10Z
verdict: findings
p0: 0
p1: 2
p2: 3
by: phiên đang làm hồ sơ (KHÔNG phải phiên tươi độc lập — ghi ở Known limits)
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evidence · khối đối chứng dương | Bản chụp lượt chạy `main` để ở thư mục tạm và ĐÃ MẤT — lời khai «P122+P126 đỏ sẵn» không kiểm lại được | Người ký tin «hai ca đỏ không phải lỗi mốc này» mà không có đường kiểm; nếu lời khai sai thì mốc ship kèm hai ca đỏ do chính nó gây ra — đúng lớp «bằng chứng tự dối» | Bản chụp đối chứng phải nằm TRONG hồ sơ, không ở thư mục tạm | fixed: chạy lại neo `main` 5ad8e88d, bản chụp commit ở `evidence/doi-chung-duong-main-5ad8e88d.txt`; bốn bộ của cây phát hành cũng chụp lại |
| P1 | nhánh phát hành | Nhánh cắt từ `8ff6c58a`, nhưng `main` dịch sang `5ad8e88d` giữa lượt (PR #113) — đối chứng neo mốc chết, bản đồ sẽ xung đột | Gộp xong thì cổng tự-host của kho đỏ vì bản đồ lệch; và lời khai baseline nói về một mốc không còn là nền của nhánh | Đối chứng dương phải neo mốc `main` HIỆN TẠI; bản đồ là vật máy sinh nên giải xung đột bằng sinh lại | fixed: gộp `main`, sinh lại bản đồ, chạy lại trọn bốn bộ; báo cáo có khối ĐÍNH CHÍNH |
| P2 | contract · Context | Câm hoàn toàn về việc sửa `LB9` và về lần gộp `main`, dù cả hai nằm trong diff | Người duyệt thấy một file test đổi trong diff mà hợp đồng không nói gì → đọc thành phạm vi bị nới lặng lẽ | Mọi thứ trong diff phải trace được về một câu trong hợp đồng | fixed: thêm đoạn «Hai việc PHÁT SINH» vào Context |
| P2 | contract · Criteria | Đánh số nhảy cóc: AC-1 · AC-2 · AC-3 · AC-6, không có AC-4/AC-5 | Người đọc lần đầu đi tìm hai mã không tồn tại và tưởng hồ sơ mất tiêu chí | Mã tiêu chí liên tục, hoặc khai rõ vì sao đứt | accepted: giữ nguyên khuôn để đối chiếu được với release-2-3-0 theo cùng mã; ghi vào Known limits |
| P2 | nghi thức | Bước phản biện context sạch (S1#7) bị BỎ SÓT ở S1, chỉ chạy khi lưới trước-merge chặn | Hồ sơ đi tới tận chữ ký rồi mới lộ thiếu một bước — chi phí đảo cao nhất | Bước S1#7 phải chạy TRƯỚC khi dựng thẻ Cổng Phạm vi | fixed một phần: đã chạy (chính file này); nhưng chạy MUỘN và do chính phiên làm hồ sơ, không phải phiên tươi — ghi Known limits |
