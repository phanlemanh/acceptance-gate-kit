---
slug: ui-check-chay-sau-suite
at: 2026-10-19T13:43:41Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Gap-probe: ui-check-chay-sau-suite

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-20261019T134140Z-2 ghi nguồn mục-tiêu nhưng câu trích (ngoặc đơn liệt hai nhánh cũ) không quyết lựa chọn «nhóm chạy-riêng chờ cả ui song song»; lựa chọn đó đổi mặc định cho kho không gặp sự cố, và AC-8 sửa chính câu làm căn cứ | Chủ kho ký mà không thấy đánh đổi trễ lượt ↔ cách ly mọi kho cùng trả | Dòng sổ mới supersedes d-2: trích câu thật sự quyết, hoặc đưa thành câu Hỏi | fixed: đổi thiết kế — lệnh chạy-riêng giữ nhịp 2.28, chỉ ui chạy-riêng chờ thêm ui song song; dòng sổ d-20261019T134457Z-5 supersedes d-2, căn cứ CLAUDE.md «Thứ tự chọn nghiệm … đổi mặc định là mọi kho trả giá» (không phải câu do vòng sửa) |
| P1 | contract | Không AC đo quan hệ lệnh chạy-riêng với ui song song — hành vi đổi theo d-2 | Bản cài lệch vẫn xanh E1–E7, CHANGELOG hứa điều không ai đo | AC-3 thêm ui song song E11 dài, khẳng định quan hệ | fixed: với thiết kế mới hành vi KHÔNG đổi; AC-3/E3 thêm E11 song song dài và khẳng định cả hai vế (ui chạy-riêng sau E11; nang-1 bắt đầu trước khi E11 xong) + AC-6/E6 biến thể (iii) chỉ khai lệnh chạy-riêng vi phân bằng hệt v2.33.0; Coverage thêm trục C' |
| P1 | design | Promise nhớ chung máy↔ui có thể làm lỗi ui kéo mất kết quả máy; AC-4(c) chỉ đo sự có mặt, AC-6 chỉ đường PASS | ui:E11 ném lỗi → Promise.all reject → mất machineRaw; mọi kho có ui-check nhận hồi quy | AC-6 thêm ca lỗi không khai, so blocked/failedEvals với v2.33.0; AC-4(c) đo quan hệ | fixed: thiết kế giữ nhánh ui y hệt 2.33.0 khi không khai, nhánh ui bắt lỗi promise máy; AC-6/E6 biến thể (ii) suite exit 1 + ui:E11 ném lỗi so {verdict, failedEvals, blocked} bằng hệt v2.33.0; AC-4/E4 cho suite-a thoát 1 cùng lượt và đo failedCommands chứa suite-a, E11 xanh không vào failedEvals/blocked |
| P2 | evals | Câu hỏi E8 không đòi ngoặc đơn «run alone» được sửa | Tài liệu thêm một câu nhưng ngoặc đơn giữ, người nhận hiểu ngược vật | Thêm vế vào câu hỏi E8 | fixed: câu hỏi E8 thêm vế «đoạn run alone không còn câu nào ngụ ý tập mọi lệnh máy khác chỉ gồm eval lệnh song song và chuỗi suite khi nói về ui-check» |
| P2 | design | Dòng sổ d-3 ghi một-lối trong khi lối «judgment chạy sau suite, song song với nhau» còn sống; câu «không kho nào» chưa đo | Thẻ in một-lối sai | Dòng sổ mới supersedes d-3, nguồn mục-tiêu luật TRỪ/CỘNG + lệnh đếm | fixed: đo 19/10 mọi kho ~/dev — chỉ crm khai model_evals, 0 judgment; dòng sổ d-20261019T134457Z-6 supersedes d-3, căn cứ CLAUDE.md «TRỪ tự đi; CỘNG cần owner phê duyệt» |
