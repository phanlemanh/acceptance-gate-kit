---
slug: ho-so-da-ky-giu-tuoi
at: 2026-10-17T14:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ ghi máy quyết «băm tên ca đỏ», trong khi chính lối chết sổ nêu áp vào nó: cùng tên ca mà khác thông điệp vẫn cùng băm; ma trận AC-6 thiếu ô «cùng ca, khác thông điệp»; Known limits để trống dù ô cơ hội khai ca ba giả định 3 | PR vòng khác đổi lỗi E1 của H5 từ «expected 3 got 4» sang TypeError trong cùng ca, băm không đổi, nhãn gắn, hồi quy mới lọt — đúng vế CHẾT | Băm (tên ca · thông điệp đã chuẩn hoá); AC-6/E6 thêm ô 7 «cùng ca khác thông điệp → thoát 1»; Known limits ghi ca ba kèm ngưỡng | fixed: dòng sổ mới thay d-20261017T131816Z-6 (căn cứ chính sách chủ kho 17/10 «bớt chiều đỏ … chính sách cấm» — chọn phía đỏ, không còn là câu khẩu vị); AC-6 và E6 thành 7 ô; Known limits khai ca ba kèm ngưỡng |
| P0 | design | Sổ ghi «nhãn không áp cho suite» là máy quyết theo mục tiêu, nhưng câu trích chỉ nói neo là eval, không quyết vế loại suite; giả định «suite đỏ đã chặn CI mọi PR» chưa cân trên mọi kho | Kho không chạy suite trong CI có suite đỏ sẵn (tạo tác build cục bộ như 17/10), vòng khác vẫn bị chặn và gọi người, ngưỡng SỐNG hỏng mà không hồ sơ nào cho thấy đây là chủ ý | Đổi thành câu hỏi chỉ-người hoặc trích căn cứ thật; Known limits «suite đỏ sẵn vẫn chặn» kèm ngưỡng | human-gate1: thành Hỏi-2 (dòng sổ mới thay d-20261017T131816Z-7, khuyên chỉ eval); Known limits khai kèm ngưỡng ≥1 lượt gọi người vì suite đỏ sẵn trong 14 ngày đo |
| P1 | contract | Đường đo không có thước độc lập cho vế CHẾT «PR vô tội bị gọi tên»; ngưỡng đòi «không quy được kèm cặp sha» mà AC-5 ghi quy_ve rỗng | Sau 14 ngày mọi dòng nen-do đúng khuôn nên vế «quy đúng PR» luôn đạt dù lệnh gọi tên nhầm; dòng hạ tầng không có sha để tự kiểm | Đường đo đối chiếu PR sửa/revert thật sự làm xanh; AC-5 dòng hạ tầng mang cặp sha | fixed: Đường đo thêm vế «PR vô tội bị gọi tên» (đếm tay, khai giới hạn); AC-5 và E5 đòi dòng hạ tầng mang tu và sha đỉnh, bảng in hai sha |
| P1 | contract | Ma trận AC-1 thiếu hồ sơ được gộp vào nhánh chính TRONG khoảng; luật «cũ ở đỉnh mà tươi ở từ» chưa định nghĩa hồ sơ chưa có ở từ | Vòng A gộp H6 buổi sáng, #462 gộp buổi chiều chạm paths của H6 (đúng hình ngày 17/10), H6 không vào tập và không được ghim, E1 vẫn xanh | AC-1/E1 thêm H6, ca tự kiểm số hồ sơ = 5 | fixed: thiết kế §1 định nghĩa hồ sơ chưa có ở từ là tươi ở từ; AC-1 và E1 thêm H6, tập = H2 và H6 |
| P1 | evals | E7 chứng «cùng một hàm» bằng đếm require/import — đo chuỗi có mặt trong khi lời hứa là quan hệ; phía bash một dòng require là đủ qua | Lưới require module nhưng tự viết lại điều kiện, thiếu vế khoá hay vế tổ tiên; ca đếm import vẫn xanh, bên viết và bên đọc trôi | Phá thử hàm chung trên bản sao: ép «không đạt» thì ba phía cùng đỏ ở ô hợp lệ, ép «đạt» thì ba phía cùng nhận nhãn ở ô giả | fixed: AC-7 và E7 thay đếm import bằng hai mutant trên bản sao, ghim thông điệp từng phía |
