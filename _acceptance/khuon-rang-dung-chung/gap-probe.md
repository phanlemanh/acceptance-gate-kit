---
slug: khuon-rang-dung-chung
at: 2026-08-30T00:40:00Z
verdict: findings
p0: 0
p1: 2
p2: 2
---

# Gap-probe — phản biện ngữ cảnh sạch (S1, one-pass)

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals E1 | AC-1 nêu BA hình hỏng móng nhưng E1 chỉ phủ 2 + một mutant đơn lẻ; «bước tiêm nổ» không ca nào phủ | Tiêm nổ đi qua đường hỏng chỉ-in-chữ chưa mutant tới → chân passed oan, khuôn merge với hình dạng 3 còn sống bên trong | Ma trận 3 ô + sweep mutate TỪNG call-site bad | fixed: E1 thành ma trận toàn phần 3 hình + sweep code-sinh trên mọi call-site |
| P1 | evals E5 | «Mutant cũ vẫn bị bắt» đo chuỗi-có-mặt, tập kỳ vọng không đóng | Viết lại bỏ rơi 1–2 ca mutant mà E5 vẫn xanh | Neo tập ca cũ vào mốc bất biến | fixed: mốc BASE-KRDC (5cd3bc68) ghi trong contract; danh sách ca cũ rút bằng git show, assert tập-con |
| P2 | evals E5 | Chống viết-lại-nửa-vời bằng grep-vắng 4 tên cố định — blacklist trên không gian mở | Móng riêng dưới tên khác đi vòng → E5 xanh oan | Đảo mặc định theo danh sách RANG-KHUON-API | fixed: mọi lời gọi móng phải THUỘC danh sách marker + ca RED thêm hàm lạ |
| P2 | contract AC-7 | «Giữ .sh/.mjs» là danh sách trắng hụt (.cjs là tiền lệ đã có) | Helper .cjs bị loại khỏi delta → carry oan tái xuất ở đuôi thứ ba | Đảo mặc định: chỉ LOẠI đuôi giấy | fixed: AC-7 + design + E7 đảo mặc định, thêm ô helper.cjs |

Ghi chú giữ lại: E4/E7 được critic đánh giá chắc tay (đối chứng dương, quan hệ
kho-thật-không-đổi, mutant khôi-phục-hành-vi-cũ); ba quyết định sổ (T2 ngoài
t3_paths · không ép bằng lưới · đóng băng hàng đợi) nhất quán, không lật.
