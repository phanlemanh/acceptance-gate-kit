---
slug: cham-khong-tu-dot-luot
at: 2026-09-27T07:33:58Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Ma trận AC-2 chỉ thử chiều dấu cứu một lần khai ĐỎ sai (hàng 1); không hàng nào thử chiều dấu kéo một lần khai XANH sai về đỏ (không cannotRun, dấu 1, khai 0); mutant duy nhất (gỡ hẳn bước đọc dấu) không phân biệt bản vá đúng với bản vá thiên lệch | Bản vá chỉ tin dấu khi tác tử khai đỏ: 7 hàng xanh, mutant gỡ-đọc-dấu vẫn đỏ, Cổng Bằng chứng ký; ở kho tiêu thụ tác tử khai 0 cho lệnh in __EXIT=1 thì eval ĐẠT — PASS giả | Hàng 8 viết trước: không cannotRun + dấu 1 + khai 0 → mã 1, REJECT (số assert = 8); mutant thứ hai «dấu chỉ áp khi khai ≠ 0» → hàng 8 lật, ghim «hang 8» | fixed: AC-2 thêm hàng 8 + mutant thứ hai vào contract và E2 |
| P1 | contract | AC-7 đếm mọi hàng dưới tiêu đề sáu cột so với p0+p1+p2; gap-probe clean có một hàng «Không còn lỗ đáng kể» với tổng khai 0; không ca chiều im cho hồ sơ clean | Mọi thẻ của hồ sơ clean bật «bảng phản biện ngoài khai báo: 1 > 0»; cờ thành nhiễu thường trực, tới lúc bảng thứ hai rơi thật thì không ai đọc cờ | Ca chiều im: gap-probe clean một hàng, tổng khai 0 → 0 cờ, rows không đếm hàng ấy; mutant «đếm mọi hàng» đỏ trên ca này | fixed: AC-7 chỉ đếm hàng có Sev dạng P0/P1/P2; E7 thêm ca clean chiều im + mutant đếm-mọi-hàng |
| P2 | evals | Hình crm của AC-7 dựng hai bảng mang đúng chữ ký rút từ SKILL — fixture tự dựng đúng khuôn bên đọc [nhan-trang-thai-va-reality#F1]; tiêu đề thật của bảng 2 ở crm không được ghim; Đường đo không có dòng cho AC-7 | Bảng 2 ở crm lệch một chữ tiêu đề: bộ dựng mới bỏ qua, test xanh, thẻ crm sau cài vẫn vắng 5 phát hiện, không phép đo sau cài bắt được | Chép nguyên văn hai dòng tiêu đề crm làm fixture, hoặc thêm dòng Đường đo cho AC-7 trên cap-nhat-tuan-okr sau cài | fixed: đã đọc crm 27/09 — hai tiêu đề KHỚP NGUYÊN VĂN chữ ký (dòng 12 và 24, dưới «## Findings» và «## Soát lại sau Cổng Phạm vi (hai chỗ sửa, 2026-09-25)»), fixture chép nguyên văn hai dòng ấy và tên hai mục; thêm dòng Đường đo AC-7 |
| P2 | design | Khung bọc giới hạn theo KÝ TỰ và DÒNG (tail -n 30, cut -c1-240), không theo byte; BSD cut với UTF-8 đếm ký tự nhiều byte, 30 × 240 ký tự tiếng Việt vượt 8 000 byte; fixture 74 KB nhiều khả năng ASCII | Suite in tiếng Việt, lượt đỏ in dài vượt ngưỡng lưu-ra-tệp, dấu __EXIT mất, bộ chấm rơi hàng 3 hoặc 7, BLOCKED «ma thoat khong doc duoc»; ngưỡng chết B7 bị kích vì chính khung bọc | Ca lệnh in ≥ 30 dòng × ≥ 240 ký tự có dấu: tổng ≤ 8 000 byte và còn __EXIT=0 | fixed: khung thêm giới hạn byte (tail -c) trước dấu; E1 thêm ca đầu ra tiếng Việt nhiều byte |
| P2 | evals | E1 so với «bản bộ chấm tại tag v2.18.4» mà không nói dựng base thế nào; checkout nông không có tag, hoặc base chép một tệp thiếu lib (lớp P150) | CK-AC1 đỏ vì hạ tầng của chính phép đo — lượt chấm bị đốt trên đúng vòng mang tên «chấm không tự đốt lượt»; hoặc ca bỏ qua so sánh thành xanh rỗng | Base dựng trọn thư mục bằng git archive, thiếu tag thì thoát ghim «thieu tag» | fixed (đổi khuôn): bỏ phụ thuộc tag — đối chứng là CÙNG nguồn bộ chấm với khối EXIT-MARK thay bằng hàm đồng nhất (bản sao trong bộ nhớ qua srcOverride của harness), so nhãn · SUITE-* · run_id bằng nhau; không git, không tag, không chép tệp |
