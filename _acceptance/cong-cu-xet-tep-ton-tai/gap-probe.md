---
slug: cong-cu-xet-tep-ton-tai
at: 2026-10-29T02:21:00Z
verdict: findings
p0: 1
p1: 1
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ bỏ quét độ phủ ghi nguồn mục tiêu nhưng câu trích (ghi chú hàng TC5) không quyết việc bỏ quét — cùng lớp [design-floor-moc-s3-s4#F1] | Cổng Phạm vi đọc bỏ quét như có mục tiêu chống lưng; ô «tên trần đuôi .js trên PATH, không ở gốc kho» xanh trước vòng mà sau vòng đỏ, không ai gọi tên | Dòng sổ mới thay dòng cũ với căn cứ thật sự quyết | fixed: dòng d-20261029T022118Z-9 thay d-…-8, trích luật bỏ quét của SKILL feature-loop («spec ngoài đã chốt scope»); dòng d-…-10 giữ tra PATH cho tên trần đuôi kịch bản; trục B thêm trạng thái «chỉ có trên PATH», AC-1 có khoá ấy |
| P1 | evals | Không lượt nào đo chân cong_cu XANH khi mọi khoá đường tệp có tệp thật — khoá có và khoá vắng chạy chung lượt nên chân luôn đỏ | Nhánh mới đặt chân «do» mà không in bullet; mọi eval vẫn xanh trong khi kho thật vẫn đỏ không dòng nào gọi tên | Lượt riêng chỉ khoá có thật, ghim mã 0 + chân xanh + đối chứng bỏ-tra; đặt một khoá ở executors.design.ui_check | fixed: tách lượt «có» (mã 0, chân xanh, 0 bullet, khoá executors.design.ui_check tuyệt đối) và lượt «vắng»; AC-1, AC-2, E1, E2 viết lại |
| P2 | evals | Trục A2 khai ba đuôi nhưng ma trận chỉ có .cjs | Bản cài chỉ nhận .cjs; khoá tên trần .js hay .mjs ở gốc kho vẫn đỏ THIEU, mọi eval xanh | Thêm khoá .js và .mjs ở gốc kho + đột biến chỉ-nhận-.cjs | fixed: lượt «có» mang ba tên trần .js/.mjs/.cjs; AC-5 và E5 thêm đột biến (c) chỉ nhận .cjs, ghim bullet của khoá .js |
