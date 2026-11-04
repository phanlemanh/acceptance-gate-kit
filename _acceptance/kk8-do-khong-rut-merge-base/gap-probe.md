---
slug: kk8-do-khong-rut-merge-base
at: 2026-11-04T04:20:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe: kk8-do-khong-rut-merge-base

Tác tử tươi đọc đúng năm tệp: design, contract, evals, decisions và bài học xuyên hồ sơ (claim-scan). Nó không đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals E3 · contract AC-3 | AC-3 hứa một quan hệ: KK-1/KK-5 so với bản KH1 ghim, không còn với merge-base. E3 lại chỉ đo chuỗi PASS có mặt; chốt trùng-vật chỉ canh được những lời gọi đi qua banGocVong | Một chỗ dựng bản so khác trong tệp vẫn gọi merge-base sống, hoặc lượt sửa sau đưa lời gọi ấy trở lại, thì trên main nó xanh rỗng mà E3 vẫn xanh | Ca đếm lời gọi merge-base trong chính tệp bằng 0, kèm mutant chèn một lời gọi phải đỏ | fixed: AC-4 + E4, ca KK-0-mot-moc / KK-0-mot-moc-do (commit cf0a1438 đỏ → dcaf055d xanh) |
| P1 | contract AC-1 · evals E1 | Đích là main xanh, nhưng E1 chỉ chạy ở checkout của bên chấm; cách mới cần commit cha 0f734a69, nên ở clone nông thì nổ | CI clone với fetch-depth 1 thì KK-0-goc, KK-1, KK-5 nổ «không có trong kho»; S4 xanh mà main vẫn đỏ | run_id check tests trên PR có 27 dòng PASS, hoặc ca chạy trong clone depth 1 | rejected: job tests của .github/workflows/gate.yml:20 khai fetch-depth: 0 nên 0f734a69 luôn có. Check tests của PR và của main sau gộp vẫn được đối chiếu ở gói Cổng Bằng chứng và trước khi báo xong |
| P2 | evals E2 · E3 | Chiều đỏ của hai chốt chính (trùng vật, tiêm rỗng) chỉ có lời kể về mutant chạy tay; lịch sử ở 305db2fa đỏ vì thiếu hàm chứ không vì thiếu chốt | Ai đó gỡ hoặc nới chốt về sau, và bộ kiểm không có ca nào thấy | Mutant gỡ chốt thành ca chạy được: bản nguyên vẹn xanh trước, mutant đỏ đúng thông điệp ghim | fixed: AC-5 + E5, ca KK-0-dot-bien chạy hai mutant trên bản sao tệp (dcaf055d) |
| P2 | design · decisions d-3 | Phép quét LỚP chỉ có lời, không ghi lệnh; số «16 chỗ» không khớp số hàng; hình dạng git show origin/main: chưa quét | Cổng Phạm vi duyệt descope trên một phép quét không chạy lại được; một chỗ lấy mốc kiểu origin/main: lọt khỏi bảng | Ghi lệnh quét nguyên văn kèm số dòng ra; mỗi dòng đầu ra có đúng một nhãn | fixed: design §Quét theo LỚP ghi hai lệnh A (79 dòng · 23 tệp) và B (7 dòng · 5 tệp), mỗi tệp một nhãn; B không có chỗ nào cùng lớp |
| P2 | decisions d-1 · design | d-1 để máy tự quyết hoãn năm ca, trong khi giá của nó là đánh đổi chỉ chủ kho cân được: chặn main lâu hơn, hay chịu rủi ro đỏ oan ở đợt nen-thiet-ke-0411 | Chủ kho ký mà không thấy câu quyết thứ tự; đợt cấp hàng chạm gate-card.js trước vòng riêng, THE-M0 đỏ oan | Dòng S1 mới supersedes d-1, nguồn chỉ-người (Hỏi-1), khuyến nghị + lối khác kèm giá | fixed: dòng d-20261104T043627Z-5 (Hỏi-1, chi-nguoi, supersedes d-…-1) |
