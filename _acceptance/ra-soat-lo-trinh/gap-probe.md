---
slug: ra-soat-lo-trinh
at: 2026-10-14T13:05:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | decisions | Ba dòng máy quyết trích câu không quyết vế chịu tải — (a) ghim miễn riêng luật tuổi/trần · (b) tuổi bỏ vế «tín hiệu nối» của B′ · (c) loai vắng = mốc chiến dịch. Cùng lớp [dinh-tuyen-theo-ma-muc#F2] | (a) hàng ghim ở mốc đã qua vẫn hiện «dời mốc» · (b) hàng vừa nối tín hiệu nhận đề xuất tuổi · (c) mốc người không khai loai sinh đề xuất dời | Mỗi dòng trích câu quyết đúng vế, không thì đổi nguồn | fixed: (a) ghim dời sang vòng 2 — dòng descope supersedes d-…-6 · (b) giới hạn khai ở design §3/§9 và Notes — dòng supersedes d-…-4 (một-lối) · (c) chỉ `phat-hanh` là mốc chiến dịch; số đo 3/3 mốc không loai của crm là mốc người — dòng supersedes d-…-3 (một-lối); AC-1 còn 1 ô dời mốc |
| P1 | contract | AC-1 mâu thuẫn thứ tự luật ở hai ô mốc phát hành đã qua × xếp lại tự khai | Bên dựng theo design ra dời mốc, RS-1 đỏ hoặc luật bị nắn không ai quyết | Design nói rõ thứ tự; RS-1 ghim tên hai ô | fixed: thứ tự xếp lại → đã bác → mốc qua ngày → tuổi → trần (design §3 + dòng sổ approach); moc-qua-ngay chỉ áp trạng thái nhóm chưa bắt đầu; E1 ghim tên hai ô |
| P1 | contract | Đường đo hạ ngưỡng: chỉ đếm hàng chưa có hồ sơ và so với dòng chi tiết (tối đa 5) | Mốc nhiều hàng: đỏ giả hoặc ghi SỐNG khi hàng đang mở không hiện | Ngưỡng và đường đo trên cùng một tập; so với JSON và vế «a dời mốc» của dòng tổng | fixed: ngưỡng ô cơ hội + hàng RM1 ghi «chưa giao và chưa có hồ sơ đang mở»; Đường đo so tập độc lập (a) với JSON (b) và vế dòng tổng; hàng có hồ sơ đang mở ở dòng «Hàng trễ» sẵn có |
| P1 | evals | Gốc so cứng 1baceb96 trong khi RM1 đứng trên MC1 chưa gộp | Nhánh nhận MC1 → mọi ca so byte đỏ vì MC1 | Gốc so đi theo nền + ca gác | fixed: gốc so đọc từ `goc-so` (đổi khi nhận nền, kèm dòng sổ fix); ca RS-0 đỏ khi gốc..HEAD có commit chạm mã không thuộc vòng; E1/E4/E6 đòi PASS RS-0 trước |
| P2 | contract | Không quyết trang có in chữ «chân trời» | Đổi chữ đổi byte trang mọi kho, `--check` của crm đỏ sau khi nâng engine | Khai một câu; RS-6 có mục chan_troi | fixed: trang chỉ in chữ này trong hai câu cờ khuôn (khối chan_troi sai dạng) — AC-8 đòi khác biệt byte nằm đúng trong câu cờ đó; Notes khai kho có cờ ấy vẽ lại trang khi nâng engine |
