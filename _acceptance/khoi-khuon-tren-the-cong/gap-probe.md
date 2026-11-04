---
slug: khoi-khuon-tren-the-cong
at: 2026-11-03T13:46:20Z
verdict: findings
p0: 1
p1: 4
p2: 0
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-20261103T134409Z-3 ghi nguồn mục tiêu, nhưng câu trích chỉ liên quan: nó không chọn giữa câu Hỏi-n sẵn có và một nhãn mới trong câu duyệt, vì cả hai đều là một chạm ở cổng sẵn có. Cùng lớp với [khuon-doc-ban-do-that#F1] | Cổng Phạm vi duyệt câu Hỏi-n như thể có mục tiêu chống lưng; sau vòng giao diện thật, chủ kho muốn nhãn ngắn và phải mở thêm việc sửa lệnh duyệt | Câu trích phải loại được lối nhãn mới; nếu không loại được thì chuyển thành câu hỏi chỉ người có | fixed: dòng S1 mới (Hỏi-2, chỉ người có) thay d-…-3 bằng supersedes; khuyến nghị câu Hỏi-n sẵn có, lối khác là nhãn riêng kèm giá |
| P1 | contract | Ma trận AC-4 thiếu ca nạp mà không chọn nhóm, ca màn mẫu vắng (thẻ có thể in «băm khớp» khi so null với null), và ca surfaces web, web-ui | Bản dựng chỉ kiểm tệp nạp có tồn tại vẫn qua 6/6; hồ sơ nạp bằng lệnh KH1 lên cổng không cờ | Thêm hàng vào ma trận và mutant «chỉ kiểm tệp tồn tại» | fixed: AC-4 và E4 lên 10 hàng (g, h, h2, i) kèm mutant hàng g; ô Core bổ sung |
| P1 | evals | E8 chỉ chạy nhánh --nhom rút từ KHUON-S1; nhánh --nhom-moi không ca nào rút ra chạy | SKILL gõ sai dòng --nhom-moi mà E2 và E8 vẫn xanh | Rút riêng từng nhánh, chạy trên hai hồ sơ; thêm mutant --gan → --gần | fixed: AC-8 và E8 chạy hai nhánh trên hai hồ sơ, in số dòng mỗi nhánh, thêm mutant --gần |
| P1 | contract | Đường đo chưa có lệnh đếm cho từng ngưỡng: chưa lọc hồ sơ giao diện, chưa lọc cửa sổ 21 ngày, chưa đo «màn mới quyết ở cổng», vế «gọi người thêm vì khối» không quy được nguyên nhân | Đếm ra SỐNG giả hoặc CHẾT giả; vế «vì khối» không bao giờ kích được | Ghi lệnh cho từng vế; vế không đo được thì khai giới hạn kèm ngưỡng | fixed: Đường đo viết lại, mỗi vế một lệnh và AC bảo đảm; vế «vì khối» khai giới hạn, ngưỡng là đọc tay sổ của vòng vượt trần |
| P1 | contract | --gan là tuỳ chọn mà AC-2 chỉ thử ca có --gan; ca không có --gan có thể ra câu hỏi chỉ một lối | Thẻ hiện một câu Hỏi-n chỉ có một lối ra sống (trạm thu phí khoác áo câu hỏi), hoặc bộ xếp căn cứ bác dòng | Thêm vế cho ca không có --gan, kèm mutant bỏ lối khác | fixed: vắng --gan thì lối khác cố định là «để màn ngoài bản đồ»; AC-2 và E2 thêm vế này và mutant «câu hỏi một lối»; design §3.1 sửa theo |
