---
slug: dieu-phoi-doi-tai-khoan
at: 2026-10-11T02:46:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — dieu-phoi-doi-tai-khoan

Một tác tử tươi, chỉ đọc design doc, hợp đồng, evals, sổ quyết định, tệp bài học (claim-scan) và spec workflow
đã duyệt; không đọc mã. Tác tử tự tính lại 12 hàng ma trận AC-3 theo chỗ chọn 3–6: cả 12 khớp. Định đoạt: sửa
artifact cả năm phát hiện, không đẩy mục nào lên Cổng Phạm vi.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design, contract | Không bên nào đọc `get_usage` đều đặn khi mod không có số: dạng `--nhe` của spec §4.2 bỏ bước 1, việc của lịch 30′ không nhắc, mục `han-muc` của `chan-doan` không AC nào đo | Nhánh M2: lần đọc của `tiep-tuc` quá 35′, bộ phát lịch không còn lần đọc hiệu lực, không `gan-han-muc` hay `cham-han-muc` nào; thợ cháy hạn mức tới 100 % — AC-3 vẫn xanh vì bơm lần đọc vào fixture | Mục `han-muc` thiếu/đủ trong `chan-doan` (bốn hàng + đợt không khai), và bước đọc mức dùng ở `--nhe` và lịch 30′ có răng vị trí + chiều đỏ | fixed: AC-2 thêm mục `han-muc` của `chan-doan` (3 hàng thiếu, 1 đủ, đợt không khai thì vắng); AC-14 đòi bước `get_usage` → `han-muc` ở dạng `--nhe` và trước `danh-thuc` của lịch 30′, chiều đỏ bỏ bước ở `--nhe`; design §3 đoạn «ba chỗ ngoài danh sách»; sổ d-…-19 |
| P1 | contract, design | AC-7 thiếu ô (đang bàn giao, trước là tạm dừng) mà bảng không có cạnh; hàng (e) không khai trạng thái dãy; chưa có đường «hoàn tất bàn giao trước» khi một dãy chưa xong trong hạn; đợt không khai `han_muc` không có đồng hồ | Đợt tạm dừng, P2 chết theo tài khoản cũ, `tiep-tuc` chỉ còn đứng im, thoát 1 vì thiếu cạnh, hoặc biến tạm dừng thành đang chạy; đợt crm không `han_muc` treo ở đang bàn giao mãi | Ma trận toàn phần 8 hàng; dựng cưỡng bức; hàng đợt không khai; chiều đỏ gọi thẳng `pha <pha trước>` | fixed: AC-7 thành 8 hàng (bốn ô pha ★ × pha trước, ba trạng thái dãy) kèm chiều đỏ (f); dựng cưỡng bức và đường `dang-ban-giao → cho-tiep-tuc → <pha trước>` (design chỗ chọn 1, 10); AC-6 thêm hàng (f) hạn mặc định 20′; sổ d-…-18 (supersedes d-…-6), d-…-20 |
| P1 | design, contract | AC-3 một nhịp: «dấu mới» không định nghĩa, dấu không được dọn khi tiếp tục; «tự cấp lại sau giờ đặt lại» không hàng nào đo; hàng (i) chạm sàn nên công thức hạ ngưỡng chưa thật sự đo | Dấu của tài khoản cũ kéo đợt vào bàn giao lần nữa sau khi tiếp tục; cờ `cho_dat_lai` dính sau giờ đặt lại; công thức sai mà (i) vẫn ra 80 | Dấu có chủ dọn; hàng hai nhịp cho chờ đặt lại; hàng tốc độ 0,2 cho ngưỡng 84 | fixed: `tiep-tuc` chuyển dấu vào khoá `dau` của bản lịch sử (AC-7 hàng c, sổ d-…-21); AC-3 thêm (m) 85 % → ngưỡng 84 và bàn giao, (n) 83 % → báo trước, (o) hai nhịp chờ đặt lại rồi cấp lại; ma trận 15 hàng, số 80 và 84 viết sẵn |
| P1 | contract, evals | AC-1 nói «bốn cạnh của DP2» trong khi bảng DP2 có năm; E1 ghim 11; đường chéo không khai luật, mâu thuẫn mục «chạy lại được» | E1 đỏ trên vật đúng, hoặc người viết test rút cạnh DP2 từ chính mã (tự so mã với mã) | Chép nguyên tập cạnh, khai luật đường chéo, E1 in 36 dòng với mong đợi chép từ hợp đồng | fixed: AC-1 chép đủ 11 cạnh (5 của DP2 — căn cứ bảng `CHUYEN` trên nhánh chính — và 6 mới, sau khi bỏ cạnh tắt), 6 ô đường chéo thoát 0 không thêm lịch sử, 19 ô còn lại thoát 1; E1 in 36 dòng «cặp · mong đợi · thực tế», mong đợi không rút từ mã |
| P2 | evals | Chỗ nối mod → CLI không có round-trip; hai fixture `rateLimits` viết tay riêng | Mod gửi khuôn khác CLI đọc, CLI thoát 1, mod nuốt lỗi, không bao giờ có lần đọc nguồn `mod`; E2, E12 vẫn xanh | Argv của mod chạy thật bằng CLI; một fixture chung; chiều đỏ bọc `{rateLimits}` | fixed: AC-12 và E12 thêm round-trip (argv ca (a) chạy bằng CLI `han-muc` thật) và chiều đỏ «bọc mảng»; fixture chung `tests/dieu-phoi/fixtures/rate-limits-mod.json` cho E2 và E12 |
