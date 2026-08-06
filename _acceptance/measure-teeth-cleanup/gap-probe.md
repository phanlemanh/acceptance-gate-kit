---
slug: measure-teeth-cleanup
at: 2026-08-06T10:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals + contract | Chốt chống tái phát chỉ tìm "dấu hiệu đối chứng trong thân khối" — đo hình dạng chuỗi, không bao giờ CHẠY khối trên vật hỏng; cột thông-điệp-phải-ghim khai rồi không assert ở đâu; "tập khai bằng tập tìm được" không định nghĩa nguồn nên là đẳng thức hằng đúng | Một khối có lệnh dựng bản sao và chú thích "mutant" nhưng assert đã vô hiệu — chốt xanh vì thân khối có dấu hiệu; ca đối chứng gỡ đúng dấu hiệu đó nên cũng đỏ đúng, tức nó là đối chứng cho phép GREP chứ không cho phép ĐO. Vòng dọn mắc đúng lớp nó đi chữa, Cổng 1 duyệt một cái lưới rỗng | Chốt THI HÀNH từng dòng: chạy khối trên bản nguyên vẹn (XANH), dựng vật hỏng theo cột hai, chạy lại (ĐỎ + chứa nguyên văn chuỗi cột ba); tập khai so với NGUỒN ĐỘC LẬP | fixed: AC-7/E8 viết lại thành thi-hành; bảng 3 cột có nghĩa; nguồn độc lập = quét cây kiểm |
| P0 | evals + contract | Luật "mọi assert nguyên văn" mâu thuẫn trực tiếp với phạm vi vòng: AC-4 phải xoá phép so hằng số dung sai, AC-6 phải viết lại chân sanity; không có cơ chế phân loại SIẾT/NỚI; số lệnh kiểm và mốc lại hardcode dù sổ đã khai | Làm đúng AC-4/AC-6 thì assert cũ biến mất, chốt ĐỎ dù không ai nới gì; lối thoát rẻ nhất là thêm miễn trừ cho đúng các dòng vừa sửa — vòng dọn tự tay diễn lại "hạ thước cho vừa vật". Nhánh kia: giữ nguyên dòng cũ để xanh, ngưỡng dung sai không được gỡ | Bỏ điều kiện nguyên-văn; liệt kê máy mọi assert bị sửa/xoá, mỗi cái phải có entry ledger phân loại SIẾT hay NỚI ghi TRƯỚC; NỚI hoặc chưa-phân-loại → ĐỎ | fixed: AC-9/E10 viết lại; lệnh đọc từ config, mốc đọc từ sổ |
| P1 | evals + contract | Nhánh "không còn ngưỡng" đo bằng ĐỌC MÃ tìm hằng số — đo nguồn thay vì đầu ra; "số mồ côi thực tế == 0" không có mẫu số, không đối chứng dương | Gỡ hằng 25 rồi viết dung sai dưới dạng tỉ lệ, danh sách bỏ qua, hoặc cắt bớt: grep xanh mà hành vi dung sai vẫn còn. Song song: bộ phân loại đọc trượt corpus, trả 0 cụm, "mồ côi == 0" xanh trong khi chốt chưa nhìn thấy dòng nào | Tiêm ĐÚNG MỘT cụm mồ côi vào corpus dựng bằng chính đường sinh → ĐỎ đích danh (n=1 chứng minh không còn dung sai); mẫu số: số cụm phân loại được > 0 và bằng số khai | fixed: AC-4/E5 đổi sang đo hành vi |
| P1 | evals + contract | Thiếu đối chứng dương (bản nguyên vẹn XANH trước) và thiếu mẫu số "số thẻ đã dựng > 0" — fail-open cùng dạng đã trả giá ở vòng trước | Bản sao thiếu thứ gì đó nên 0 thẻ được thử dựng → "0 hỏng" đúng vô nghĩa → xanh; bước tiêm cũng thất bại im lặng thì ca mutant cho cùng màu, và "xanh" không phân biệt được với "chưa bao giờ dựng thẻ nào" | Assert ba số cùng lần: đã-thử == số việc và > 0, hỏng == 0, ĐỎ nêu số; bản nguyên vẹn XANH trước; tiêm thất bại có thông điệp riêng | fixed: AC-5/E6 |
| P1 | evals + contract | Chứng minh "đếm độc lập" chỉ dựa trên fixture viết tay đúng khuôn bên đọc; không có phép đo nào trên hồ sơ thật | Đường ghi thật không sinh hình dạng đó, hoặc khuôn đổi sau này: xanh trên văn bản tổng hợp trong khi trên sổ thật hai bộ đếm vẫn tăng đồng biến — ký "đã trả răng" cho một phép đo vẫn chưa có răng | Fixture do chính đường ghi sinh trong lần chạy (round-trip writer→reader); cộng phép đo trên corpus thật: hai số luôn bằng nhau trên toàn kho → ĐỎ | fixed: AC-6/E7 |
