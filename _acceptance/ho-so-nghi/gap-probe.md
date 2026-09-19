---
slug: ho-so-nghi
at: 2026-09-19T09:55:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Hứa bốn bộ đọc một hàm nhưng mutant AC-6 chỉ đòi ba lật; dòng thiếu vế không có AC đo ở bộ quét và thẻ | Thẻ tự đọc sổ, in «đã nghỉ» và bỏ mời ký trên hồ sơ có dòng nghỉ thiếu by trong khi cổng vẫn đỏ — hai sự thật | AC-6 thêm vế thẻ; AC-2 ma trận 3 ca × 3 bộ đọc so bằng nhau | fixed: AC-2, AC-6, E2, E6 sửa; design: thẻ CHỈ hỏi bộ quét |
| P1 | evals | Dòng nghỉ trong ca đo do test tự soạn đúng khuôn bên đọc; khối lệnh GUIDE không ca nào chạy — lớp fixture-không-round-trip [lan-doc-status-not-run#F2] | GUIDE in tên trường lệch (nguoi thay by) → người ở kho làm theo GUIDE, cổng vẫn đỏ, E1–E7 xanh | HSN1/HSN6 rút khối lệnh từ marker GUIDE và chạy; mutant đổi tên trường → đỏ | fixed: E1, E7, design §3 (bên viết là GUIDE, marker NGHI-LINE-RECIPE) |
| P1 | evals | AC-1 hứa rời ba luật nhưng đối chứng chỉ ghim một chuỗi; cổng continue sau vi phạm đầu nên một fixture không kích được ba luật | Bản vá đặt continue sau luật cũ hoá → hồ sơ nghỉ ở kho vẫn đỏ vì stale mà E1 xanh | HSN0 ba fixture con, mỗi luật một chuỗi rút từ script, so bằng nhau 3/3 | fixed: AC-1, E1, design §7 |
| P1 | contract | Ô cơ hội (giả định 3) nói kiểu OneFlow đọc được bằng cờ vàng; AC-3 nói y hệt đối chứng — mâu thuẫn không có entry bỏ có tên | Owner ký với hình ảnh sai; OneFlow nhận 2.17.0 vẫn đỏ cho tới khi ai đó biết phải viết dòng nghỉ | Out of scope có tên + sửa giả định 3 | fixed: Out of scope, Đường đo, AC-3 (0 cờ), giả định 3 và 4 của ô |
| P2 | contract | AC-8 đòi «biết cách mở lại» trong khi mở lại không đo; bộ đọc bỏ qua supersedes thì hồ sơ mở lại vẫn được miễn cổng — fail-open, ngược căn cứ descope d-3 | Owner mở lại để sửa vật, cổng tiếp tục miễn, không ai được mời ký | Một ca HSN10: dòng nghỉ + supersedes đúng id → bốn bộ đọc y đối chứng | fixed: AC-10 + E11; sổ: revisit supersedes d-3 |
