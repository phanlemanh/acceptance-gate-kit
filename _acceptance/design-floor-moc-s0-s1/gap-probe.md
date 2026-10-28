---
slug: design-floor-moc-s0-s1
at: 2026-10-27T14:05:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ M2 do máy quyết chỉ dựa vào khoá tokens với câu trích chỉ liên quan; lối M2 cần cả token và manifest DS còn sống, khoá registry mà AC-5 dùng không được định nghĩa ([design-floor-vendor-va-ban-va-a#F1] cùng lớp) | Kho khai tokens mà không khai registry đọc ra M2, reuse-plan check thiếu --file thoát 4, dòng thẻ luôn không đo được; E5 vẫn xanh vì fixture M2 có registry | Ca tokens-không-registry ra đúng bậc kèm lý do gọi tên khoá thiếu, đối chứng dương kho đủ hai khoá; dòng sổ supersede dòng M2 cũ | fixed: M2 đòi tokens + registry (dòng sổ mới supersedes d-20261027T135314Z-4, nguồn một-lối theo bản vá C); AC-1, AC-2 thêm khoá registry và ca tokens-không-registry → M1; design thêm đoạn «đã khai nguồn = token, manifest DS» |
| P1 | contract | Không AC nào đo đường tải thật và khối băm tri thức thật của tệp khoá; vị trí bộ đệm chưa định; Notes không nói AC nào đổi theo từng lối của Hỏi-2 | Mã tải sai commit hay băm ghi sai thì mọi kho thật ra không đọc được mãi mãi, E3 E4 vẫn xanh vì chỉ mục do mã sinh | AC cho đường tải thật kiểm băm khớp khối tri_thuc, có điều kiện mạng, nhãn rõ khi không mạng; ghi vị trí bộ đệm | fixed: thêm AC-10 + E10 (chỉ mục thật khớp băm tệp khoá, SKIP có tên khi không mạng, đột biến sửa băm đỏ); design ghi bộ đệm ngoài cây kho; Notes ghi AC đổi theo từng lối Hỏi-2 |
| P1 | evals | E7 THE-M0 so «giống từng byte» không nói so với bản nào — có thể là phép so tự thân | gate-card.js mới thêm khung rỗng vô điều kiện, thẻ mọi kho đổi mà THE-M0 vẫn xanh | So HTML hồ sơ vắng tệp giữa bản gốc git archive trọn thư mục và bản mới; đột biến chèn khung rỗng đỏ | fixed: AC-7 và E7 so với thẻ dựng bằng git archive merge-base scripts lib; thêm đột biến khung rỗng vô điều kiện |
| P1 | contract | Lệnh S1 ở M0 không được đo (chỉ lệnh bậc S0 được đo); hợp đồng thiếu mục Đường đo nối ngưỡng của ô cơ hội với AC | Lệnh S1 ở kho M0 vẫn ghi design-floor.json hay nối usage-report, mọi kho không giao diện bị đổi hồ sơ mà E1–E9 vẫn xanh | Ca S1-M0 băm cây không đổi, stdout rỗng, đối chứng dương M2; đột biến bỏ nhánh thoát sớm M0; mục Đường đo | fixed: AC-8 thêm vế M0, E8 thêm GHI-M0 + đột biến; hợp đồng thêm mục «Đường đo» năm dòng |
| P2 | evals | E3 không ghim token; E4 không tiêm lệch vào chỉ mục | Lệnh bỏ kiểm băm chỉ mục hay ghi token 0 mà E3 E4 vẫn xanh | E4 thêm ca chỉ mục lệch; E3 ghim token bằng byte/4 tính lại từ tệp do mã sinh | fixed: E3 ghim token tính lại trong lượt; E4 thêm TT-LECH-CHI-MUC |
