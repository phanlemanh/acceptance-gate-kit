---
slug: luot-kiem-nhe
at: 2026-11-11T08:35:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — luot-kiem-nhe

Một tác tử tươi đọc đúng sáu tệp: design doc, hợp đồng, evals, sổ quyết định, ô cơ hội, và bài học từ các vòng trước
(tham khảo). Không đọc mã, không chạy lệnh.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract (sổ d-10) | Dòng bỏ việc huỷ lượt cũ ghi căn cứ mục tiêu, nhưng câu trích nói về lượt đỏ, không quyết lựa chọn; chia mảnh nhân phần chuẩn bị lên khoảng mười việc mà Đường đo chỉ đo giờ đồng hồ, không đo tổng phút máy | Chủ kho đọc dòng ấy như có căn cứ; lượt PR nhanh hơn mà tổng phút máy tăng, hồ sơ vẫn khai lợi ích phút máy không có số | Câu trích thật sự quyết lựa chọn; thêm dòng Đường đo tổng thời lượng mọi việc của lượt PR | fixed: dòng sổ mới thay d-10 trích luật «mỗi vòng một kết quả» của kit; Đường đo thêm tổng phút máy đặt cạnh 57–67′, nói rõ số này có thể không giảm; design §5 nêu điều ấy |
| P0 | contract (sổ d-8) + evals (E7) | Câu trích chỉ chứng bọc theo run() sẽ sót khối, không chứng các khối có gọi hàm đạt/trượt; E7 chạy trên ca giả đúng khuôn bên đọc | Khối tự in PASS không sinh hàng, thời gian cộng sai ca, bảng chậm nhất gọi sai tên; E7 vẫn xanh | Trích chứng các khối ghi qua hàm đạt/trượt hoặc đổi thành câu hỏi; thêm ca trên bộ chạy plugin thật | fixed: quét bộ plugin — mọi dòng PASS/FAIL đi qua hai hàm pass/fail (chỉ hai dòng in trực tiếp là chính thân hai hàm); dòng sổ mới thay d-8 với căn cứ một-lối ghi số quét; AC-7 và E7 thêm ca LKN-AC7-that trên bộ móc thật và một vùng thật của bộ plugin |
| P1 | contract (AC-4) + evals (E4) | Khai bốn hàng lệch mà liệt ba; tổng lệch với «10/10»; thiếu ô gốc khai 24 chạy 22 và thiếu hàng lệch ở độ chính xác hai số | Đột biến «khai hai số mà chỉ so số chính» vẫn xanh cả mười hàng | Ma trận đủ; thêm 24.21×24.22.0 và 24×22.11.0; số khẳng định = số hàng | fixed: ma trận mười hai hàng (4 khớp · 5 lệch · 1 vắng · 2 không đọc được), có 24.21×24.22.0 và 24×22.11.0; E4 in «12/12 hàng» |
| P1 | contract (AC-5 so với Coverage, Out of scope) + evals (E5) | AC-5 đòi design-floor, design-eval có bước kiểm Node mà Out of scope nói chỉ đổi nguồn khai; «bản đồ» gọi là việc trong khi có lúc là bước | Làm theo một bên thì đỏ hoặc sai hợp đồng bên kia | Thống nhất tập việc, nói rõ đơn vị; in danh sách việc đã xét; đột biến thêm việc mới không kiểm phải đỏ | fixed: đơn vị là việc (job), tập rút từ gate.yml; hai việc design kiểm bằng một bước trong gate.yml, không sửa bộ chạy riêng (Out of scope sửa lại); E5 in «việc → đường», thêm đột biến gỡ bước của design-eval và đột biến thêm việc mới |
| P1 | contract (AC-9) + design (§2) | Chiều đỏ không cô lập khoá nhớ (fixture hỏng mọi cổng); LM13 không có chiều đỏ; tốc độ không phải khẳng định; số ước lối A lệch giữa ô cơ hội (19–23′) và design (16–20′) | Khoá nhớ gộp hai cổng che thẻ cổng 2 hỏng; LM13 đọc nhầm dữ liệu vẫn xanh; bản mới không nhanh hơn mà vòng vẫn ký | Fixture hỏng đúng một cổng + đột biến bỏ cổng khỏi khoá nhớ; chiều đỏ LM13; ngưỡng tốc độ; thống nhất số ước | fixed: AC-9 thêm fixture hỏng đúng cổng 2, đột biến khoá nhớ, chiều đỏ riêng LM13 và LM20; Đường đo thêm ngưỡng P161 ≤ 6′ trên lượt kiểm của PR; design §2 ghi lối A ~16–23′ và nói vì sao (3 mảnh như lượt chấm: 19–23′, 6–8 mảnh: 16–20′) |
