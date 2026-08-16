---
slug: cat-khoi-viec-cua-anh-tren-tin
at: 2026-08-16T08:20:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

# Phản biện context sạch — cat-khoi-viec-cua-anh-tren-tin

Critic: subagent tươi (general-purpose, model phiên), 5 input (design · contract
· evals · decisions · claims-scan). One-pass, không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + evals (AC-2/E2) | Bộ từ cấm chứa «khuôn» trong khi câu điều khoản gốc chứa «không khuôn»; mutant m2 «chèn từ khuôn» không phân biệt được với baseline; assert «0 xuống dòng» chưa nói chuẩn hoá wrap | Người thi công chép nguyên văn câu → E2 đỏ trên vật ĐÚNG, hoặc bẻ câu cho vừa thước, hoặc nới từ cấm sau khi thấy đỏ | Từ cấm suy từ chính câu (khối · vế · chỗ trống · Trả lời mẫu · YOUR-MOVE); checker nối dòng rồi đếm dấu chấm; m2 dùng từ «vế»; chạy E2 trên câu gốc XANH trước khi tiêm | fixed: AC-2 + E2 viết lại đúng thước đó (đối chứng dương trước, m2 = «vế») |
| P1 | contract + evals (AC-1/AC-3/E1/E3) | Needle «khối 👉» / «kết bằng đúng MỘT khối» không nằm trong mảng E1 dù AC-3/E3 trỏ «needle AC-1 phủ»; việc #4 design (dòng bất biến dừng) không eval nào chạm — cùng lớp [luu-kho-codex-va-nghi-le-design#F1] | Bản chép khớp, 4 needle vắng, nhưng câu bọc «TIN NHẮN trình thẻ cũng phải kết bằng khối đó» + «không khối 👉» còn → agent vẫn đẻ khối, ship xanh | Mảng E1 lên 6 needle, đếm 6/6 suy từ mảng, base>0 mỗi needle, loại trừ khai-in-ra gate-card.js cho «khối 👉» | fixed: AC-1 + E1 6 needle |
| P1 | design + contract (AC-2 · Coverage) | Luật «tin chỉ-báo không đeo khối» bị gỡ mà nghĩa còn lại «tin chỉ-báo không hỏi» không vào luật âm nào; chỉ E5 ca 3 chấm một lần | Vòng sau agent chèn câu hỏi vào tin trạng-thái giữa vòng — lớp gọi-người-quá-tần-suất — không phép đo nào đỏ | Luật âm thứ ba «tin chỉ-báo không hỏi», E2 in 3/3, mutant m4 xoá → đỏ | fixed: AC-2/E2 3/3 luật âm + design cập nhật |
| P1 | contract (SO-CA-KY-VONG · AC-6) | 146→145 không phân rã theo ca; ca cô-lập-clause của P189 có in PASS riêng không chưa chứng; P185 đo bản luật hay thẻ chưa khai — cùng lớp [luu-kho-codex-va-nghi-le-design#F2] | Suite ra 144 hoặc P185 đỏ → sửa số sau khi thấy, hoặc vá P185 mà không ai khai đó là gỡ răng thẻ | Bảng phân rã máy-đọc ca gỡ/giữ + vật đo; E6 kiểm PASS của ca giữ, 0 dòng ca gỡ, đối chứng dương đếm origin/main = 146 | fixed: khối SO-CA-PHAN-RA (đã kiểm: P189 in đúng một dòng PASS; P185 render gate-card.js) + AC-6/E6 |
| P2 | evals (E5) + hội đồng | Tên ca có thể gợi đáp án cho agent hành động; «một chữ đồng ý là đủ» chỉ đo được khi câu hỏi có ngả mặc định, giám khảo chưa buộc trích câu hỏi | Ca 4 ghi «chống-a-dua» → agent giữ luật vì thấy nhãn → PASS oan; ca 1 hỏi «Duyệt hay sửa?» không nêu ngả → «ok» không giải quyết mà vẫn PASS | Đề ca tiêu đề trung tính; đáp án 6 ô nhị phân; giám khảo phải trích câu hỏi, thiếu = UNCERTAIN | fixed: đề ca đã trung tính (Ca 1–4); đáp án thêm 6 ô + luật trích; AC-5/E5 ràng buộc |
