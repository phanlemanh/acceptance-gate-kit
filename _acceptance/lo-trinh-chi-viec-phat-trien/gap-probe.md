---
slug: lo-trinh-chi-viec-phat-trien
at: 2026-10-11T09:17:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Phản biện context sạch — lo-trinh-chi-viec-phat-trien

Tác tử tươi, sáu đầu vào: design · contract · evals · decisions.jsonl · bài học từ feature trước (claim-scan,
advisory) · opportunity.md. Không đọc mã, không chạy lệnh.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E9 để giám khảo tự cắt rồi tự chấm bài mình: không bảng đáp án viết trước; câu hỏi lộ danh sách từ «gửi, đào tạo, công bố…» (đúng phép đoán từ vựng design đã bác); bỏ vế «răng xanh trên đầu ra» của ô mà không lý do; khuôn đầu ra thiếu `dot` | Giám khảo ghi mốc ngoài không `dot`, tự chấm 8/8 PASS; ở crm, mốc không đợt không tính phủ → mọi mã vận hành đỏ «chưa có chỗ», phiên dời chúng về hàng — đúng điều vòng cấm | Tách người cắt khỏi người chấm; bảng đáp án viết trước từ phân loại thật của crm; chạy răng trên đáp án; bỏ danh sách từ; thêm `dot` vào trường răng đọc | fixed: AC-9/E9 đổi thành đối chiếu SKILL với bảng đáp án viết trước `mau/lo-trinh-dap-an.json` (từng mã phải có bước SKILL dẫn tới, im lặng/nước đôi → FAIL), bỏ danh sách từ; thêm AC-10/E10 (LT-171) chạy răng trên bản phạm vi mẫu + đáp án: 0 lỗi, 0 cảnh báo, kèm bản sao đỏ; AC-7/E7 thêm `dot` vào danh sách trường |
| P1 | evals | E6 cho thêm bao nhiêu dòng vàng cũng được miễn mang tên cờ; E5 thiếu đối chứng im cho hàng ngoài đợt không mang trường mới — đo chuỗi-có-mặt trong khi lời hứa «lộ trình cũ đọc như cũ» là quan hệ [lan-ghim-lai-theo-paths#F1] | Nhánh gom ngoài đợt coi `du_lieu` vắng là sai giá trị: crm-okr mỗi lượt cắt in `[du-lieu-sai-gia-tri] N hàng ngoài đợt`; E6/E3/E5 vẫn xanh, crm nhận nhiễu vàng phải chép vào PR | E6 ghim số dòng thêm bằng kỳ vọng tính độc lập (0 cho năm kho); mutant «vắng = sai, chỉ ngoài đợt» phải đỏ | fixed: AC-6/E6 ghim số dòng thêm == kỳ vọng tính độc lập từ dữ liệu kho (0 cả năm kho), in hai phía, mutant LT-168-do-them; AC-5/E5 thêm đối chứng im + mutant LT-167-do-vang |
| P1 | contract | «Đường đo» đọc vế 2–3 bằng «0 dòng cờ trong PR»; trong đợt hai cờ là lỗi nên PR không mở khi đỏ — số luôn 0 theo cấu trúc, không đọc ra CHẾT; vế 3 chỉ đếm hàng tự khai `gia` | crm bỏ `dung_tren: ["ct"]` khỏi d9/d6 cho răng im dù vẫn cần tệp thật; hàng kiểu `l2` không khai `du_lieu`; PR in 0 và 0, Cổng Giá trị đọc SỐNG trong khi hàng vẫn treo | Khai giới hạn; thêm lần đọc có chiều đỏ ở timebox: hàng của đợt chưa mở vòng được vì chờ người / dữ liệu thật | fixed: «Đường đo» khai giới hạn (0 dòng cờ = điều kiện cần do cổng chặn); vế 2–3 đọc ở timebox bằng danh sách hàng của đợt chưa có hồ sơ (máy in) + chủ kho đánh dấu hàng treo vì người / dữ liệu thật, ngưỡng 0; vế 3 kèm danh sách hàng không khai `du_lieu` |
| P2 | evals | Ngoài-1 có hai nửa; nửa hành vi («cảnh báo của đợt phải xử lý hoặc ghi lý do») không thước nào đo; LT-170-do không kiểm câu cũ đã rời SKILL | Bản sửa thêm khối CAT-LUOT-CANH-BAO đúng mà để nguyên câu cũ; phiên cắt crm đọc câu cũ, chép gợi ý gộp của chính đợt vào PR như dòng ngoài đợt | Vế (C) cho giám khảo; LT-170 ghim câu cũ vắng ở bản mới, có ở 9b11cc66 | fixed: AC-9/E9 thêm vế (C) hai dòng cảnh báo; AC-8/E8 ghim câu cũ vắng ở SKILL mới, có ở SKILL tại 9b11cc66 (đối chứng dương), mutant LT-170-do-cau |
| P2 | contract | Trục A khai «không làm», design xếp bốn loại có «không làm», nhưng không AC nào đo và không nói chỗ rơi | Đội sản phẩm gửi mã không làm, khối VAN-HANH dặn «bỏ khỏi lộ trình», răng đỏ «chưa có chỗ», phiên nhét vào hàng | Ghim chỗ của «không làm», hoặc rút khỏi trục kèm descope | fixed: rút «không làm» khỏi trục A và khỏi bước tách (ba loại); mã không làm giữ luật cũ (chân trời có `ly_do` hoặc `da_bac`) — sổ d-20261011T091912Z-9 |
