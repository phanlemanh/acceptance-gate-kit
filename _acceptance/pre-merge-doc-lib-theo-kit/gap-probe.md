---
slug: pre-merge-doc-lib-theo-kit
at: 2026-10-31T10:05:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ chọn thứ tự «cạnh script trước, gốc kho sau» lấy một dòng mã làm câu trích mục tiêu; câu ấy chỉ liên quan, không quyết; lối ngược lại vẫn sống | Cổng Phạm vi tưởng có mục tiêu chống lưng; kho có lib/ chép chạy script plugin đổi phán quyết mà vật không đổi | Căn cứ một-lối kèm số đo ở ba kho, hoặc thành câu hỏi | fixed: dòng sổ mới thay d-20261031T093845Z-2 — căn cứ một-lối: lối gốc-kho-trước ghép script mới với thư viện chép cũ (cumCu có từ 13/10 → VIOLATION oan); đo 31/10: 0/3 kho chạy script plugin trên lib/ chép |
| P0 | contract | Dòng sổ bỏ quét độ phủ tự vòng; thiếu trục cách gọi script và ô chép một phần | Kho gọi script theo hình dạng khác ca → PR vẫn đỏ sau 2.36.1 trong khi E1–E5 xanh | Thêm trục D cách gọi với hình dạng gọi thật; ghi A3×B2 và chép một phần vào Core hoặc Later | fixed: trục D bốn cách gọi (gồm đúng hình dạng CI của onehub-quy-hang và của kho có lớp chép, đọc từ workflow ba kho); ô A4 chép một phần vào AC-3; A3×B2 và A4×B2 vào Later; dòng sổ mới thay d-20261031T093845Z-7 |
| P1 | evals | Lời hứa «như trước vòng» đo bằng đột biến thay cho bản gốc; AC-4 đo chuỗi có mặt trong khi hứa quan hệ | Đường lùi hỏng kiểu khác (mã thoát hay VIOLATION mới) mà LK4 vẫn xanh | Dựng bản gốc trọn thư mục bằng git archive c8870a49; LK4 so bằng nhau bản gốc với bản sửa trên hai kho | fixed: LK1-do ban-goc (bản gốc thật đỏ ở ba cách gọi), LK2 chạy cả bản gốc, LK4 so cùng mã thoát và cùng tập dòng của hồ sơ giữa bản gốc và bản sửa trên hai kho kèm đối chứng hai kết cục khác nhau |
| P1 | evals | Phép quét lớp chỉ khớp một hình dạng chữ; không ma trận hình dạng; lời khai về hooks/ không có thước | Một dòng `$ROOT/lib` không nháy hay `node lib/…` tương đối lọt quét, E5 vẫn xanh | Ma trận hình dạng viết trước, mỗi hình dạng một bản tiêm; quét hooks/ trong cùng phép đo | fixed: ba mẫu lớp + ma trận 6 hình dạng tiêm riêng (6/6 phải bắt đúng một dòng); phạm vi quét là mọi *.sh dưới scripts/ và hooks/; design khai giới hạn: tệp JS nạp thư viện tương đối theo tệp, ngoài phép quét |
| P2 | evals | E4 lẫn tên hồ sơ giữa hai nửa của ca | Tác tử chấm đối chiếu tên sai, UNCERTAIN trên vật đúng | Ghi rõ kho nào ở AC-4 và E4 | fixed: AC-4 và E4 gọi đích danh kho lk2 (của AC-2) và lk1 (của AC-1) |
