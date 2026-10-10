---
slug: dieu-phoi-dong-goi-loi
at: 2026-10-09T14:50:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Gap-probe — dieu-phoi-dong-goi-loi

Phản biện context sạch: một tác tử mới chỉ đọc năm tệp (design doc, contract, evals, sổ quyết định,
bài học từ claim-scan). Một lượt, không chạy lại sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | AC-1 chỉ so tập sự kiện:matcher, không ghim sự kiện nào gọi tệp hook nào; chiều im AC-2 chỉ có đối chứng dương cho PreToolUse; số ô của ma trận tự đếm từ chính nó | hooks.json đảo lệnh PostToolUse và Notification: E1, E2 và 84 ca lõi vẫn xanh; ở OneFlow tệp nhịp chỉ được chạm khi phiên rảnh, bộ phát lịch thu hồi khoá của thợ đang làm | So bộ ba (sự kiện, matcher, tệp thân) với bảng viết sẵn; mutant đảo lệnh; đối chứng dương cho từng lệnh; số ô bằng hằng viết sẵn | fixed: AC-1 ghim bộ ba và E1 thêm DP1-01-do dao-lenh; AC-2 thêm đối chứng dương cho từng lệnh (E2 DP1-02-duong ×4); hằng SO_O = 21 |
| P1 | contract | hooks.json chỉ được đọc bằng bộ đọc do chính ca viết; không phép đo nào đặt nó trước bộ nạp gói thật | Thiếu lớp `hooks` ngoài cùng hoặc thiếu `"type"`: bộ đọc tự viết vẫn rút đủ lệnh, E1 E2 xanh; Claude Code bỏ qua hooks.json, kho cài gói không có hook nào, chỉ lộ ở DP5 | So với bộ nạp thật; mutant bỏ lớp `hooks` → đỏ; chạy `claude plugin validate` nếu có | fixed: AC-1 thêm vế `claude plugin validate --strict` (thử 09/10: bắt cả hai ca hỏng); eval E1b có chiều đỏ bỏ lớp `hooks`; giới hạn khai: CI không có CLI nên E1b chỉ chạy ở lượt chấm trên máy |
| P1 | contract | Chiều im không đo stdout; stdout của UserPromptSubmit bị chèn vào ngữ cảnh mô hình | Hook in một dòng chẩn đoán ở kho không có đợt rồi thoát 0: E2 xanh, mọi lời nhắn ở mọi kho cài gói kéo dòng đó vào ngữ cảnh | Thêm stdout rỗng vào mỗi ô; mutant thêm dòng in → đỏ | fixed: AC-2 và E2 thêm stdout == ""; E2 DP1-02-do in-stdout |
| P1 | contract | Gói ở chỗ khác cây kit chỉ được đo cho một lệnh (hook chặn S4); hook nhịp, hook chờ người, CLI và nhịp bộ phát lịch chỉ chạy trong cây kit [lan-ghim-lai-theo-paths#F1] | Một import `../../feature-loop/…` hay gói npm chỉ có ở kit: E1 E2 E4 E5 xanh ở cây kit, ở bộ nhớ đệm gói mọi lời gọi công cụ ném ERR_MODULE_NOT_FOUND | Chép CHỈ dieu-phoi/ ra ngoài cây kit; chạy mọi lệnh hook và CLI; so mã thoát; mutant import ngoài | fixed: AC-6 viết lại thành «bản chép chỉ gồm dieu-phoi/», E6 DP1-06 ban-chep + DP1-06-do import-ngoai |
| P2 | evals | Design nói fixture đọc-cũ sinh bằng git archive, contract nói bản chụp tĩnh; ẩn danh không rõ bằng mã hay tay; E4 không ghim số khoá và số đơn > 0 | Bản chụp lúc crm vừa nhả khoá, hoặc ẩn danh tay xoá xin/: mọi phép so chạy trên tập rỗng, E4 xanh dù bộ đọc đọc sai trường khoá | Ghim ≥1 khoá còn hạn và ≥1 đơn; ẩn danh bằng script giữ tập khoá; thống nhất design hoặc ghi sổ | fixed: AC-4 và E4 ghim ≥1 khoá còn hạn và ≥1 đơn; script an-danh.mjs với ca DP1-04 an-danh; design §11 viết lại; sổ d-20261009T145254Z-6 |
