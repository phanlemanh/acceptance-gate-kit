---
slug: design-gate-che-do-chat
at: 2026-10-25T10:35:04Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | decisions | Vòng là một CỘNG (cờ công khai `--require-measured` + mã thoát 5 phát hành tới mọi kho) mà sổ ghi máy tự quyết; d-2 ghi «đổi mã là sửa một hằng» trong khi mã 5 thành giao ước ngay khi một kho ghim `expected_exit: 5`. Tiền lệ cùng lớp [thiet-ke-nap-tri-thuc#F2] [vong-don-le-tra-tri-thuc#F1] | Thẻ Cổng 1 trình lựa chọn như máy đã có căn cứ, chỉ để cửa veto; người ký phê một bộ phận mới mà không biết | Dòng sổ chi-nguoi trình CỘNG kèm khuyến nghị và lối khác; d-2 nêu đường đảo khi đã có kho ghim mã 5; thẻ Cổng 1 có mục câu hỏi | human-gate1: dòng sổ chi-nguoi mới supersedes d-1 (Hỏi-1 «phê CỘNG cờ + mã 5»); dòng mới supersedes d-2 nêu giá đảo sau khi kho ghim mã 5 |
| P1 | decisions | d-1 bỏ qua bậc 1 «sửa đúng tầng» — crm đọc được `do_duoc` ngay trong lệnh của mình | Cổng 1 duyệt CỘNG trên căn cứ đọc thiếu vế đầu của chính luật | d-1 nêu vì sao bậc 1 chết, không nêu được thì thành câu hỏi | fixed: gộp vào Hỏi-1 — bậc 1 không chết (sống được, giá là mỗi kho một bộ đọc tay), nên nó là lối khác có giá của câu hỏi, không phải căn cứ máy |
| P1 | evals | E4 chỉ đo «quyết trước jsdom» khi jsdom VẮNG; ô có cờ · dom · CÓ jsdom (ca artifact-platform) không AC nào đo; bản cài kiểm đuôi trong nhánh nạp-hỏng vẫn xanh | Ở kho có jsdom, dom có cờ trên .tsx vẫn nạp jsdom, chạy bộ dò trên chữ thô, PASS mã 0 | Ô jsdom GIẢ do ca sinh ghi tệp lính canh; assert mã 5 và lính canh vắng; đối chứng HTML thì lính canh có; đột biến (d) dời phép quyết ra sau bước nạp | fixed: AC-4 thêm ô tsx-dom-jsdom-gia + đối chứng html-dom-jsdom-gia; AC-7 thêm đột biến (d) nêu tsx-dom-jsdom-gia; Coverage kê trục jsdom vắng/có |
| P2 | evals | Lời hứa «cờ chỉ chạm ô không đo được» là quan hệ trên trọn ma trận mà E1/E3 chỉ liệt 4+5 ô; E5 chỉ chạy không cờ | Nhánh chặt dùng vị từ đuôi riêng lệch vị từ cũ (vd `.htm`, hoa thường) — mọi eval vẫn xanh | Chạy trọn ma trận có cờ và không cờ, assert 5 khi và chỉ khi ô không đo được; đột biến vị từ riêng | fixed: AC-8 + E8 (12 đích × static/dom, định nghĩa «không đo được» viết độc lập trong ca); AC-7 thêm đột biến (e) nêu HOA.HTML@dom |
| P2 | contract | Notes dự báo «57 eval đỏ mã 5» và d-2 hứa `expected_exit: 5`, nhưng crm gọi trong vòng kèm «hoặc exit 1» sau mỗi lệnh gộp mọi mã khác 0 thành 1 | crm bật cờ thấy 57 eval đỏ mã 1, không khai được `expected_exit: 5` | Notes nêu mã eval thật dưới lệnh kho đang dùng + điều kiện dùng được mã 5; ô ca chạy vòng lặp do ca sinh | fixed: AC-6 thêm ba ô vòng lặp (`exit 1` → 1 · `exit $?` → 5 · không cờ → 0); Notes sửa thành mã 1 và điều kiện «hoặc exit $?» |
