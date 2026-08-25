---
slug: lan-may-song-qua-bo-phan-loai
at: 2026-08-25T13:23:32Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — lan-may-song-qua-bo-phan-loai

Phiên tươi, 6 input (design · contract · evals · sổ quyết định · bài học feature
trước · hồ sơ cơ hội), không đọc code. One-pass: sửa artifact xong KHÔNG probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals E3 + design | E3 tuyên «chạy CHÍNH đường trộn của kit» nhưng design không giao đường trộn nào — nửa A là một lần sửa tay settings | S3 buộc phải đẻ một hàm trộn CHỈ để test gọi; xanh chứng minh một helper test-only giữ khoá, không nói gì về file đã ship. Owner ký Cổng 2 tin rằng phép trộn đã được chứng | Đổi AC-3/E3 thành QUAN HỆ trên vật thật: so bản ở mốc git cố định với bản trong cây, khoá phải-giữ RÚT từ bản mốc, mutant tiêm vào BẢN SAO cây rồi chạy lại chính bộ đọc đó | fixed: AC-3 viết lại hai chân + mốc `BASE-LMSQBPL`; E3 đổi sang so mốc↔cây |
| P0 | contract Coverage trục B + evals | Không AC/eval nào khẳng định mỗi entry đúng VĂN PHẠM luật quyền của harness (dạng `Bash(<lệnh>)`, nằm đúng `permissions.allow`). Đây KHÔNG phải giới hạn đã khai — giới hạn khai là *hiệu lực lúc chạy*, còn cú pháp kiểm tĩnh được | Thi công viết cả hai đầu sai cùng kiểu trong một lượt: settings ghi entry trần thiếu bọc, bộ bóc trong test cũng không mong bọc → song ánh XANH, 6/6 eval XANH, luật câm hoàn toàn với harness. Cùng lớp [het-gio-khong-phai-truot#F1] | Thêm AC + eval: mỗi entry khớp văn phạm, hằng đặt MỘT chỗ kèm con trỏ nguồn; mutant = entry trần không bọc + entry đặt nhầm dưới `permissions.ask` | fixed: thêm AC-8 + E8 |
| P1 | evals E2 + contract AC-2 | Cả 3/3 mutant của E2 đều là tiêm ký tự `*` — chiều đỏ chỉ chứng minh bộ kiểm bắt được đúng thứ chính nó viết ra; ô B«rộng quá» được TUYÊN là đã đóng | Sau ship, một cách diễn đạt «rộng quá» khác (rút `permissions.deny`, đổi `defaultMode`) đi lọt trong khi Coverage nói ô đã đóng → cổng duyệt SAI | Thêm ≥1 mutant NGOÀI bảng chữ `*`; Coverage ghi rõ AC-2 đóng ô B-rộng-quá CHỈ ở dạng `*` | fixed: E2 thêm m4 (rút `deny`) + m5 (đổi `defaultMode`); Coverage khai phạm vi thật |
| P1 | evals E7 | `inputs` của E7 chỉ có file test, nhưng câu hỏi bắt hội đồng đối chiếu bảng ma trận trong evals.yaml — file đó KHÔNG được nạp | Hội đồng không có bảng nên hoặc bịa số, hoặc đếm mutant ngay trong file test rồi tuyên «khớp» — vòng tròn, bộ ca tự làm chứng cho chính nó. E7 hỏng thì E1–E6 chỉ cần 1 mutant/ca vẫn PASS | Đưa evals.yaml vào `inputs` của E7, bắt hội đồng IN LẠI con số đọc được cho từng ca trước khi kết luận | fixed |
| P1 | contract AC-3 vs evals E3 | AC-3 bảo vệ «mọi khoá NGOÀI `permissions`» nhưng mutant m2 của E3 đòi đỏ khi mất `deny`/`ask` BÊN TRONG `permissions` — hợp đồng và phép đo đòi hai thứ khác nhau | Thi công viết đúng theo AC-3 → m2 không đỏ → E3 trượt ở S4, đốt trọn một vòng. Chiều ngược tệ hơn: sửa E3 cho vừa AC-3 thì kit có thể nuốt `deny`/`ask` của đội tiêu thụ mà không phép đo nào kêu | Tách AC-3 thành hai chân rời: ngoài `permissions` giữ nguyên; trong `permissions` mọi khoá ngoài `allow` giữ nguyên và `allow` chỉ được THÊM | fixed |

## Ghi chú

Hội đồng cite bài học feature trước đúng nếp: [het-gio-khong-phai-truot#F1] hai lần
cho lớp «bên viết và bên đọc trôi cùng nhau». Không finding nào lật quyết định đã
descope ở S1.
