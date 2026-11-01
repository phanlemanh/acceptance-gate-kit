---
slug: quet-het-han-khong-moi-ky
at: 2026-10-31T15:45:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-2 ghi một-lối nhưng lối hỏng-to (không kết ô quyết khi bộ quét lỗi) còn sống; chọn đi tiếp theo lời khai chưa kiểm là khẩu vị rủi ro | Hồ sơ khai machine-cleared mà báo cáo cũ hay FAIL, đúng lượt bộ quét hết hạn: thẻ in đi tiếp, người lướt qua cửa veto | loi_chet liệt lối không kết ô quyết, hoặc đổi thành câu hỏi người | human-gate1: dòng S1 mới mang supersedes d-2, nguồn chỉ-người (Hỏi-1, khuyến nghị A đi tiếp, lối B hỏng to kèm giá); design §2.3 nêu Hỏi-1 |
| P1 | evals | Vế mới áp cho mọi lỗi bộ quét mà AC-1/E1 chỉ ép hết hạn | Bản dựng viết vế bằng cờ hết hạn thay vì mọi lỗi, mọi eval vẫn xanh; ở kho thật bộ quét sập thì vẫn mời ký | Bản sao cây có bộ quét thoát mã 3 và tự ngắt SIGKILL; mutant chỉ-hết-hạn phải đỏ | fixed: AC-1 thêm (ii) thoát mã 3 và (iii) SIGKILL qua bản sao cây; QH-1-do2 mutant chỉ nhận hết hạn đỏ đúng (ii)(iii) |
| P1 | contract | Lời hứa chỉ cách chạy lại là quan hệ nhưng E2 chỉ đo chuỗi biến môi trường có mặt | In ACCEPTANCE_SCAN_TIMEOUT_MS=1 hay sai slug mà E2 vẫn xanh; người chép lệnh lại hết hạn | Rút lệnh từ HTML, assert số = max(2×hạn, 120000), root và slug khớp, chạy chính lệnh ấy xanh; mutant in hạn cũ đỏ | fixed: AC-2/E2 viết lại theo đúng thước đề xuất; QH-2-do2 |
| P1 | contract | Gác luật sản phẩm chặn khi bộ quét lỗi không có ca đo | Hồ sơ máy-thông bị luật chặn gặp lượt hết hạn, vế mới lấn qua gác | Fixture luật chặn + ép hết hạn | deferred: luatG2 tính từ tệp hồ sơ trước và độc lập với bộ quét (gate-card.js dòng 1148), vế mới nằm trong cùng biểu thức gác; ghi Notes của hợp đồng, lượt soát mã S4 soi |
| P2 | evals | Phép âm tính không khẳng định sáu điều kiện thiếu vế dương | Câu thật đổi chữ, phép âm xanh mà không bao giờ đỏ | Đối chứng hạn mặc định assert câu CÓ mặt | fixed: đối chứng AC-1/E1 assert HTML chứa câu ấy |
