---
slug: design-gate-khong-do-duoc-ba-nguyen-nhan
at: 2026-10-27T04:30:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Lý do CSS không áp được gắn cho mọi phát hiện tương phản của trang; sổ d-5 ghi máy quyết bằng một-lối nhưng vế cấp-trang còn lối sống (chỉ gắn khi màu không đến từ nguồn đọc được) — chọn giữa bỏ sót và chặn oan là khẩu vị rủi ro. Coverage thiếu ô CSS × REJECT đo được cho tương phản. | Trang Tailwind v4 có chữ #aaaaaa ghim nội dòng trên nền trắng: tương phản thật, lớp lọc đổi thành không đo được, cổng thoát 0, không ca nào đỏ. | Tách vế cấp-trang thành dòng chỉ-người; thêm ca trang có @layer cộng chữ nội dòng, kết cục do người chọn; thêm ô vào Coverage. | fixed: tách d-5 thành hai dòng (gradient thắng nền: một-lối · ghim nội dòng thì đo được: mục-tiêu, căn cứ crm ghi style tính ra vào nội dòng) + Hỏi-2 chỉ-người cho phần tử KHÔNG ghim; ca KD5-layer-ghim (REJECT) và KD2-layer-khong-ghim (theo Hỏi-2) thêm vào AC-2, AC-5, Coverage. Đo 27/10: bản chụp E20 của crm có 790 thuộc tính style nội dòng trên 729 thẻ — luật ghim giữ phép đo cho đúng kho có CSS không phân tích được. |
| P1 | evals | Ca đột biến chỉ đòi «đỏ có nêu X và Y» (chuỗi có mặt), không so tập ca đỏ với tập kỳ vọng, không đòi ca ngoài nhánh vẫn xanh trên bản đột biến. | Đột biến làm mô-đun lỗi khi nạp: mọi ca đỏ, KD7 vẫn PASS dù không chứng nhánh nào. | So tập ca đỏ bằng nhau với tập viết trước; đối chứng KD5 và KD3-doi-chung xanh trên chính bản đột biến. | fixed: AC-7 và E7 đòi tập ca đỏ BẰNG tập viết trước cho mỗi đột biến và mọi ca ngoài tập xanh trên bản đột biến (đối chứng dương rằng bản đột biến còn chạy). |
| P1 | evals | Vi phân ba kho: «k = m» đúng theo cấu tạo; PASS khi chỉ thấy một kho; checkout cục bộ có thể cũ. | Một REJECT đúng ở kho khác thành không đo được: k = m = 1, E8b xanh. | Assert K = 0 theo đếm 27/10; in số theo mã lý do; kho vắng thì «không đọc được ở đây». | fixed: E8b đòi đủ ba kho (thiếu → thoát 2 nêu tên kho), K = 0, in số theo mã lý do và sha đầu của từng kho; deferred: không tự fetch kho khác (ghi vào kho người khác) — sha in ra để người đọc biết cây đo cũ hay mới. |
| P1 | evals | KD8-ci khoá sẵn lối «thêm job» trong khi Hỏi-1 còn chờ người; và đo chữ trong tệp workflow. | Owner chọn không thêm job: E8 đỏ; hoặc job có chữ mà chạy sai lệnh vẫn xanh. | Tách thành eval riêng phụ thuộc Hỏi-1; đo quan hệ chứ không chuỗi. | fixed: tách E8c (gỡ nếu Hỏi-1 trả «không»); E8c so lệnh của job trong gate.yml BẰNG đúng hai lệnh ca KD8-design-eval chạy (quan hệ, rút từ một nguồn trong kdd.sh); lượt CI thật đọc ở PR. |
| P2 | design | Không khai bản gốc và bản sao đột biến nạp jsdom từ đâu, bản nào. | Bản sao ở thư mục tạm không nạp được jsdom hay nạp bản khác: ca đỏ vì hạ tầng. | Đường jsdom suy từ vị trí script; ca in phiên bản jsdom, lệch 24.1.3 thì đỏ thông điệp riêng. | fixed: thiết kế §5 khai mọi bản (gốc, mới, đột biến) nạp jsdom bằng --jsdom tests/design-eval suy từ vị trí ca; KD0-jsdom in phiên bản và đỏ «JSDOM_LECH» khi khác 24.1.3, chạy đầu mọi nhóm ca. |
