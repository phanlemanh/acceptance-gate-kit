---
slug: t1-escape-chi-ho-so
at: 2026-10-22T13:25:00Z
verdict: findings
p0: 1
p1: 1
p2: 2
---

# Gap-probe — t1-escape-chi-ho-so

Phản biện context sạch, một lượt, tác tử tươi chỉ đọc design + contract + evals + sổ quyết định + bài học xuyên feature
(claim-scan, 12 dòng). Sửa xong artifact không probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-1 ghi máy quyết cả bốn vế (tệp gốc, thư mục không hợp đồng, chỉ opportunity.md, hồ sơ bị xoá) bằng câu trích không quyết lựa chọn; vế đòi contract.md đổi hành vi mọi kho mà không đo kho nào. [ho-so-da-ky-giu-tuoi#F2] [moi-cong-khong-qua-nut#F1] | Kho tiêu thụ gửi PR gỡ tính năng T3 kèm xoá hồ sơ, hôm nay qua, sau bản vá bị chặn — chủ kit không thấy lựa chọn này ở Cổng Phạm vi | Tách thành câu chỉ-người riêng kèm số đo ở các kho tiêu thụ | fixed: đo 9 kho (do-anh-huong.md — 28 commit nhánh chính từ 01/06); d-1 thay bằng Hỏi-1 (tệp gốc thôi tính, 22 commit) và Hỏi-2 (đòi contract.md, 7 commit), cả hai chi-nguoi; human-gate1 |
| P1 | contract | Ma trận thiếu đường dương phổ biến nhất: hồ sơ có sẵn, PR sửa tệp khác contract.md; đột biến không bắt cách cài «chỉ đếm contract.md trong diff» | Bản cài chỉ bật cờ khi diff chứa contract.md vẫn xanh mọi ô, nhưng ở kho thật chặn giả mọi PR cập nhật evidence của hồ sơ có sẵn | Thêm hàng hồ sơ có sẵn (+ lồng); thêm đột biến chỉ-đếm-contract-trong-diff đỏ đúng ô hàng mới | fixed: hàng 10–11 (ho-so-co-san, long-ho-so-co-san) + hàng 12 (ho-so-va-config); ma trận 36 ô; AC-5 đột biến (b) đỏ đúng 4 ô |
| P2 | contract | AC-2 hứa trên cả lớp nhưng chỉ đo 3 ô có mặt + 3 ô vắng; ô vắng ho-so-that×t3 là đối chứng rỗng | Bản cài sót tệp của thư mục không hợp đồng trong danh sách NOTE vẫn xanh E2 | Đo NOTE trên đủ ô với tập mong đợi khai trước; thêm ô vắng có nghĩa (hồ sơ thật kèm config.yaml, cột t3) | fixed: AC-2 đo đủ 36 ô (12 có, 24 vắng), hàng 12 cột t3 là ô vắng có nghĩa |
| P2 | contract | AC-8 vế (ii) chỉ hỏi hai lớp bị chặn mới, không đòi nhắc opportunity.md hay xoá hồ sơ | CHANGELOG chỉ nói config.yaml/README vẫn PASS; kho bị chặn vì opportunity.md không được báo trước | Vế (ii) liệt đủ bốn lớp, FAIL khi thiếu | fixed: AC-8 (ii) đủ bốn lớp kèm số đo, thêm vế (iii) PR chép lại lớp CI; E8 thêm do-anh-huong.md vào inputs |
