---
slug: kiem-ban-cai-loi-sua-chay-duoc
at: 2026-10-29T02:27:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Lệnh dọn xoá bản ghi trong sổ cài ngoài kho mà sổ ghi đảo được không nêu đường đảo; sao lưu không được đo (AC-4 chỉ đo có tệp, AC-7 không đo) | Ổ chưa gắn trông như thư mục đã xoá, người áp lệnh dọn mất bản ghi thật; bản vá quên sao lưu hay sao lưu sau khi ghi thì ca vẫn xanh | Sao lưu băm bằng sổ trước khi áp, chép đè phục hồi đúng từng byte, hai mutant (bỏ sao lưu, ghi rồi mới sao lưu) phải làm ca đỏ | fixed: AC-4, AC-7 thêm vế sao lưu + mutant; sổ d-…-15 thay d-…-10 nêu đường đảo; Coverage Later ghi ca ổ chưa gắn |
| P0 | contract | Dòng bỏ quét độ phủ trích một câu chỉ liên quan, không quyết; trục ghi tay sót (tệp thêm, tên giống mẫu, kho giả lập lệch tài liệu, cây phụ gốc không bản ghi) | Cổng Phạm vi ký trên Coverage ghi tay; trục sót lộ ở lượt chấm hay kho nhận; bản vá có thể in lệnh chép trường rỗng khi gốc không có bản ghi | Chạy quét hoặc ghi nguồn đúng; thêm ca cây phụ gốc không bản ghi | fixed: chạy morphological-scan preset test-matrix (sổ d-…-14 thay d-…-2), Coverage viết lại bốn trục; AC-6 thêm (c); sổ d-…-16 thay d-…-7 |
| P1 | contract | Bộ đệm là archive của thẻ rồi sửa tay — không có tệp thêm, gitCommitSha bằng sha thẻ, không dựng lại đường cài thật từ commit sau thẻ | Bản vá chỉ khoan dung tệp sửa và thiếu; ở kho thật còn tệp thêm và sha khác thì vẫn đỏ, ngưỡng tuyên đạt mà không đạt | Commit thật sau thẻ trong kho thu nhỏ, bộ đệm = archive commit ấy, sha khác thẻ, bốn tệp phải có tên | fixed: AC-1 viết lại theo commit sau thẻ, bốn tệp (sửa, xoá, thêm, LO-TRINH.html) |
| P1 | contract | Bộ lọc tệp không chạy không có chiều đặc hiệu; ca rút mẫu từ chính hằng của lệnh; tên giống mẫu không có ca | Khớp bằng chứa thay vì neo gốc kho, hay hằng thêm skills/, thì tệp mã lệch ra vàng và bản ghi tính ĐẠT | Ghi ba mẫu trong ca từ tiêu chí bật; ca tên giống mẫu; hai mutant phải làm ca đỏ | fixed: AC-2 thêm (c) + hai mutant; ca ghi ba mẫu trong ca, không đọc hằng |
| P1 | contract | L3 (kho giả lập giữ nghiêm) chỉ được giữ bởi KB-4, mà KB-4 lệch một tệp mã — không phân biệt nghiêm và khoan dung | Bộ lọc đặt vào hàm so dùng chung, kho giả lập lệch docs/ ra vàng, E10 vẫn xanh | Ca kho giả lập lệch chỉ docs/ phải đỏ có tên tệp | fixed: AC-10 thêm ca KB-13 (kho giả lập lệch chỉ một tệp docs/ → ĐỎ khop-tag có tên) |
