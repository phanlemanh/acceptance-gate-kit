---
slug: xa-stdout-truoc-khi-thoat
at: 2026-10-11T08:57:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe — phản biện context sạch

Đầu vào: design doc · contract.md · evals.yaml · decisions.jsonl · bài học từ claim-scan (advisory).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Phép dò ghi 200 000 byte còn tiền đề fixture chỉ đòi > 65 536 — dò cắt ở 200 KB không suy ra fixture 66 KB bị cắt | Nền có bộ đệm C giữa 66 KB và 200 KB: dò in CẮT nhưng mutant 66 KB lọt trọn, ô chéo E4 và E7 xanh, ca đỏ đổ lỗi cho vật | Tiền đề: bản tệp ≥ 2 × số byte dò nhận, thiếu thì KHÔNG ĐO ĐƯỢC có tên | fixed: tiền đề cỡ «> 65 536 VÀ ≥ 2 × n» vào AC-1…AC-4, AC-7, E1–E7, design §4 |
| P1 | evals | Chiều đỏ chỉ ghim n < m hoặc chữ EPIPE; thiếu bản sao chưa tiêm cùng bố cục, thiếu ghim mã thoát và tiền tố, bản sao repin-lane có thể không giải được lib | Bản sao chết sớm (0 byte, mã lạ) vẫn đếm là đỏ đúng; chữ EPIPE nằm trong thông điệp của chính ca | Bản sao chưa tiêm phải xanh trước; đỏ khi cùng lúc mã đúng · 0 < n < m · tiền tố; EPIPE ở stderr tiến trình con; mutant không áp được | fixed: AC-4, AC-6, AC-7 và E4, E6, E7 thêm bản sao chưa tiêm, ba điều kiện đỏ, stderr tiến trình con, nhãn mutant không áp được; repin-lane chép trọn feature-loop và chạy với --ag-root tuyệt đối |
| P2 | evals | Chuỗi ghim lệch giữa AC (có dấu) và eval (không dấu); nền không cắt không nói phán quyết | Người làm in đúng chữ AC thì làn máy so chuỗi không dấu, chấm FAIL trên vật đúng | Một literal chung; KHÔNG ĐO ĐƯỢC là không-đọc-được-ở-đây, không phải PASS; E1–E3 chỉ tính khi cùng lượt có nền CẮT | fixed: khối bốn literal ở đầu Criteria, evals dùng đúng chữ có dấu, E1–E3 đòi dòng nền CẮT cùng lượt |
| P2 | contract | Ba hồ sơ thật đầu bảng chữ có thể không render được thẻ; bản sửa chạy cây thật còn bản hoàn nguyên chạy bản sao | Ba hồ sơ đầu là ô discovery: cả hai bản cùng lỗi, stdout rỗng, so bằng nhau rỗng | Chọn ba hồ sơ đầu thoả tiền đề (mã 0, ≥ 1 KB, có thẻ), in tên và cỡ; hai bản sao dựng cùng cách; đối chứng bản sao == cây thật | fixed: AC-5 và E5 viết lại đúng thước đề xuất |
| P2 | design | Lời quét cả lớp và descope d-2 dựa trên bảng không máy nào giữ; số «mười bốn chỗ» không khớp bảng; mẫu 60 dòng không thấy hàm trợ giúp đặt xa | Script in lớn qua hàm trợ giúp cách exit hơn 60 dòng không vào bảng, Cổng 1 ký d-2 vì tin lớp đã khép | Ghi lệnh quét + số trúng; ca so danh sách với lệnh quét; hoặc khai giới hạn kèm ngưỡng | fixed: lệnh quét một dòng + 24 tệp trúng vào design §3, khai giới hạn mẫu 60 dòng kèm ngưỡng đang đếm, sửa số ở d-2; rejected phần ca so danh sách — nó chính là răng tĩnh của lớp (CỘNG, d-6) |
