---
slug: vong-don-le-tra-tri-thuc
at: 2026-10-25T00:58:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Chặn khi dòng tra thiếu so là một CỘNG (mở rộng khoá chặn Cổng Phạm vi) mà sổ ghi máy quyết bằng câu trích chỉ liên quan; tiền lệ [thiet-ke-nap-tri-thuc#F2] | Bản phát hành tới crm và invest chặn hồ sơ draft có dòng tra kiểu TT4 mà chủ kho chưa phê; người ký thấy AC-5 như tiêu chí kỹ thuật | Dòng chỉ-người «Đây là một CỘNG» thành Hỏi-1; AC-5 viết theo khuyến nghị | human-gate1: dòng sổ chi-nguoi mới supersedes d-4 (Hỏi-1), dòng d-11 thay bằng dòng phụ thuộc Hỏi-1; mục CỘNG trong design §2.2; Notes của hợp đồng nói AC-5 đổi gì nếu chọn cờ vàng |
| P1 | contract | Vế --slug đọc dòng «Nguồn:» của ô không có AC đo | Lệnh bỏ sót trang của ô, thẻ TT4 chặn mọi vòng từ hàng, máy tự gỡ bằng đúng lệnh ấy nên chặn mãi | AC-6 thêm hồ sơ mở từ hàng + bản tiêm bỏ đọc «Nguồn:» | fixed: AC-6 thêm vế hồ sơ mở từ hàng, E6 thêm TD-6-mutant-nguon |
| P1 | evals | AC-9 không so --dem --json, mutant có thể không chết | Khoá mới rò vào --dem --json ở kho không khai mà E9 vẫn xanh | Thêm đầu ra thứ năm --dem --json, ghim mutant vào nó | fixed: AC-9 và E9 năm đầu ra, mutant ghim --dem --json kèm đối chứng xanh |
| P1 | evals | AC-7 dựng căn cứ trỏ bằng fixture viết tay đúng khuôn lệnh đếm, không rút từ lệnh tra | Lệnh tra in tep một dạng, lệnh đếm khớp dạng khác — ngoài thực tế đếm 0, ngưỡng của ô đọc ra CHẾT oan | Rút khối can_cu từ đầu ra --json của lệnh tra, ghi qua DEC-ID-RECIPE | fixed: AC-7 và E7 dựng dòng tra và căn cứ từ đầu ra lệnh tra qua DEC-ID-RECIPE |
| P2 | evals | Vế trich nguyên văn của AC-2 rỗng nghĩa khi không khối can_cu nào; không fixture có ký tự bị thoát | Bộ dựng trích lấy cả nháy kép, căn cứ của máy đỏ ở kho thật | Dòng có nháy và gạch chéo ngược, dòng không đoạn sạch, số khối ≥ 2 | fixed: AC-2 và E2 thêm hai dòng ấy và đòi ≥ 2 khối can_cu |
