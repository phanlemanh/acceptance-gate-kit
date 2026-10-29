---
slug: design-floor-moc-s3-s4
at: 2026-10-28T01:30:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design (sổ S1) | Dòng cây bẩn ghi «một lối» nhưng lối khác (chỉ commit tệp máy đổi, để nguyên việc dở) còn sống; không nói tệp chưa theo dõi có tính là bẩn; câu trích của dòng bỏ quét độ phủ không quyết việc bỏ quét | Kho có công cụ sinh tệp mỗi lần chạy làm lệnh S3 thoát 2 ở mọi vòng có giao diện — lượt gọi người ngoài thiết kế mà thẻ không lộ | Dòng sổ mới thay hai dòng; AC-3 thêm ca tệp chưa theo dõi hai chiều | fixed: dòng S1 mới thay d-7 (chụp cây, chỉ commit tệp chính lệnh làm đổi, chỉ chặn khi đích autofix đã bẩn) và thay d-2 (căn cứ một-lối); AC-3 và E3 viết lại với việc dở theo dõi + chưa theo dõi và ca đích bẩn, hai đột biến |
| P1 | design, contract (AC-8) | Răng ui gate chỉ đọc DF-07 trong gioi_han, mà gioi_han hôm nay rỗng — răng không canh gì trên main | PR sau chèn ui gate vào S4, ca răng vẫn xanh | Ca trên cây thật: chèn thì đỏ; khối SKILL S4 có marker tên riêng | fixed: răng đọc thêm mục chờ FL-C1 ở chan_troi của lộ trình (dòng S1 thay d-10); khối DESIGN-FLOOR-S4 có tên; AC-8 và E8 có ca cây thật đỏ, ca DF-07, ca mở |
| P1 | evals (E7, E9) | Đột biến «S4 gọi autofix --write» có thể không đổi byte nào (trang đã qua S3, fixture không có lỗi sàn) | Đột biến chạy mà băm không đổi, hai ca đỏ không thể đỏ | Tiền điều kiện trong ca: autofix trên bản sao đổi băm; trang đích chưa qua S3 | fixed: E7 cài lỗi sàn sửa được + tiền điều kiện; E9 đích là trang chưa qua S3 + tiền điều kiện; ghi rõ pre-merge đọc git diff <verified_commit> gồm thay đổi chưa commit |
| P1 | contract (Notes, AC-6), evals (E6) | Bảng chặn theo bậc không đọc được bằng máy và tự mâu thuẫn ở ô M1 × không đo được; ô thiếu mã thoát; thiết kế lệch hợp đồng | E6 phải chép tay mã cho ô thiếu hoặc đếm dưới 12 | Mỗi ô đủ mã + nhãn; E6 đếm theo số ô rút được | fixed: khối DF-CHAN-THEO-BAC mỗi ô ghi mã thoát + nhãn hay «không dòng», cột «không đo được» là của độ phủ token; AC-6/E6 khẳng định theo số ô rút được; thiết kế trỏ về bảng một nguồn |
| P2 | evals (E4, E5) | Quét hex không có hàng biên; token-coverage chỉ thử mã 5, không nói mã lạ | Mã 3 đọc thành trượt hay &#039; bị bắt mà ca vẫn xanh | Hàng âm có đối chứng; vỏ trả 3, 4, 5 và mã lạ | fixed: định nghĩa hex thô ghi trong Known limits; E4 thêm hàng dương/âm (5, 7 chữ số, &#039;, chữ liền sau); E5 thử 0/2/3/4/5/1 qua vỏ và 0/2/5 trên bản gói thật; mã lạ → «lệnh ui lỗi», thoát 1 (dòng S1 mới) |
