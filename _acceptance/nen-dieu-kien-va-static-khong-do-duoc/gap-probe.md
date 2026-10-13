---
slug: nen-dieu-kien-va-static-khong-do-duoc
at: 2026-10-13T02:30:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ d-5 trích câu «sửa theo LỚP» không quyết việc áp cờ cho chế độ dom; nhánh dom không có ô đo; không định nghĩa đích không đuôi | Kho chạy dom trên một tệp dựng không đuôi → KHONG-DO-DUOC sai chỗ mà không AC nào bắt | Dòng S1 supersedes d-5 hoặc thu về static; luật đích không đuôi + ô đo | fixed: thu phạm vi về static (dòng sổ supersedes d-20261013T020915Z-5 — kho không cài jsdom, nhánh dom không đo được); đích là tệp đọc bằng readFileSync nên không có ca URL; đích không đuôi tính là không phải HTML, thêm ô khong-duoi + ô tsx-dom (BLOCKED 3 như gốc) vào ma trận AC-6/AC-7 |
| P0 | design | Sổ d-2 trích một dòng mã product-map làm căn cứ mục-tiêu; chỉ phủ tin_hieu; nghi có kênh khai khác dòng cột 0 | Kho khai tin_hieu qua kênh khác → product-map nạp, đường nền bo-qua và xanh giả | Dòng S1 supersedes d-2 + ca chẵn lẻ đường nền ↔ bộ nạp trên các biến thể config | fixed: dòng sổ supersedes d-20261013T020915Z-2 (nguồn mot-loi); đọc lại product-map — khoaTinHieu đọc đúng khối cột 0 và chỉ chạy trong nhánh lo_trinh, nên `^khoá:` là xấp xỉ DƯỚI (thừa đỏ, không xanh giả); AC-5 thành ca chẵn lẻ NEN-DK5 bốn biến thể + đột biến khoKhai luôn false |
| P1 | contract | AC-2/E2 chỉ có chiều đỏ, thiếu ô dương «khai + đủ tệp → xanh» | Bản cài «khai thì mọi tệp thẻ LECH» vẫn qua; crm khai tin_hieu đủ tệp sẽ đỏ thường trực | Ô dương chạy trước chiều đỏ trong AC-2/E2 | fixed: AC-2 + E2 + NEN-DK2 thêm ô dương (khai, đủ tệp → mã 0, 0 LECH, 0 bo-qua) chạy trước |
| P1 | contract | Ma trận thiếu ô tệp vắng; chưa kiểm kê bên đọc trường verdict | Phân loại trước khi đọc tệp làm 3 lượt crm tệp vắng hoá xanh; kho khác grep verdict PASS đỏ hàng loạt | Ô tsx-vang + quét bên đọc verdict kèm số | fixed: ô tsx-vang (gốc chết 1, sau chết 1, không JSON) + đột biến (c) phân-loại-trước ở AC-8; quét 13/10: kit 0, crm 1 (chien-dich.mjs, dom trên .html — ngoài nhánh đổi), kho khác dưới ~/dev 0 — ghi ở design + Notes |
| P1 | evals | AC-5 chỉ đối chiếu MỘT bộ nạp; không chứng script khác không nạp tĩnh tệp mang thẻ; không chứng bên đọc khối khác vẫn rút đúng đường dẫn | Script CI khác import tĩnh co-hop-dong.cjs → CI chết MODULE_NOT_FOUND trong khi đường nền xanh; bên đọc khối lấy cả thẻ làm đường dẫn | Quét đồ thị nạp tĩnh + chiều im trên bên đọc khối hiện có | fixed: AC-9 mới — NEN-DK6 quét 16 mục không thẻ (0 nạp tĩnh; đột biến tiêm import → nêu tệp:dòng) + E10 ghim CE1/CE2g của consumer-esm và NEN7 |
