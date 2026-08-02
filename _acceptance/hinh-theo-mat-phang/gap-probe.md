---
slug: hinh-theo-mat-phang
at: 2026-08-02T04:20:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

# gap-probe — hinh-theo-mat-phang

Phản biện context sạch, một lượt, 5 input. Critic không đọc mã nguồn.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Tiêu chí bảng tra chỉ đòi ô cách-vẽ KHÔNG RỖNG và đủ ba hàng; không đòi mỗi hàng nêu một cơ chế vẽ CỤ THỂ mà người nhận ở mặt phẳng đó thật sự nhìn thấy được. Đúng lớp lỗi feature này sinh ra để diệt lại lọt qua chính hợp đồng của nó | Người làm viết hàng hội thoại là "vẽ hình phù hợp với khung hội thoại", ba hàng kia tương tự chung chung. Mọi phép đo XANH, Cổng 1 duyệt. Lượt áp luật kế tiếp agent vẫn không biết vẽ bằng gì nên chép khối ví dụ ngay dưới bảng ra hội thoại — lỗi gốc tái diễn nguyên vẹn với bộ đo toàn xanh | Siết tiêu chí: mỗi hàng phải đặt tên một cơ chế vẽ cụ thể, lấy từ danh sách đóng đặt cùng chỗ với bảng. Đột biến thay ô cách-vẽ của hàng hội thoại bằng cụm chung chung phải ĐỎ | **fixed:** viết lại AC-1 (cơ chế cụ thể, danh sách đóng cùng chỗ) + eval E1 thêm đột biến cụm-chung-chung |
| P1 | contract + evals | Phép thử một câu KHÔNG có marker, trong khi hai vật anh em cạnh nó đều có — nên phép đo buộc phải tìm chuỗi trên toàn file. Đúng hình dạng đã tốn bốn vòng ở feature trước | Câu phép thử xuất hiện hai chỗ vì người viết nhắc lại cho dễ đọc. Đột biến xoá vế khối-mã-không-đạt ở THÂN luật — nơi duy nhất agent đọc lúc quyết — nhưng bản nhắc lại ở phần dẫn nhập vẫn khớp chuỗi nên suite XANH. Phép đo không phân biệt được luật-còn-nguyên với luật-đã-mất-ở-đúng-chỗ-dùng | Cấp cặp marker riêng cho phép thử một câu, đưa vào bộ đếm cặp toàn cây nguồn. Đột biến bắt buộc: chèn bản sao câu đó NGOÀI marker rồi phá bản TRONG marker, suite phải ĐỎ | **fixed:** thêm marker `DECISION-PICTURE-TEST`, viết lại AC-3 + E3 kèm đúng đột biến critic nêu |
| P1 | contract + evals | Tiêu chí đếm cặp marker viết "toàn kho nguồn", nhưng file luật bị đồng bộ vào mirror nên trong cây làm việc luôn có nhiều hơn một cặp. Vùng quét của eval không có mirror, tức tồn tại một vùng loại trừ KHÔNG CÓ TÊN và KHÔNG CÓ LÝ DO trong hợp đồng | Hai nhánh đều xấu. Một: bộ đếm tính cả mirror nên bản cài đặt ĐÚNG vẫn ĐỎ, người sửa đi vá số mong đợi thành 2 và làm hỏng luật một-chỗ cho mọi marker sau. Hai: mirror bị loại ngầm cùng vài vùng khác không tên, một bản sao thật nằm trong đó lọt lưới đúng như vòng đầu của feature trước, mà người duyệt đọc chữ "toàn kho" thì không có cách nào phát hiện | Viết lại tiêu chí nói rõ vật được đếm là CÂY NGUỒN, liệt kê đích danh mọi vùng loại trừ kèm lý do một dòng. Eval in số cặp THEO TỪNG thư mục gốc chứ không chỉ tổng | **fixed:** viết lại AC-7 nêu đích danh ba vùng loại trừ + lý do từng vùng; E7 đếm theo từng thư mục gốc |
| P1 | contract + evals | Vế phủ định "không ghim một định dạng duy nhất nào" là danh sách cấm trên không gian mở — phép đo chỉ biết bắt cái tên đã biết | Người làm gỡ chữ mermaid khỏi hai bản vòng lặp nhưng viết "vẽ bằng khối ký tự" — vẫn ghim một định dạng cứng, chỉ đổi tên. Eval XANH vì tên bảng tra có mặt và chuỗi cấm cũ đã biến mất. Hai bản vòng lặp tiếp tục ép một mặt phẳng duy nhất, feature không đạt mục đích mà Cổng 2 thấy toàn xanh | Đổi thành phép đo DƯƠNG ở điểm nghẽn đầu ra: câu về hình trong hai bản vòng lặp phải khớp NGUYÊN VĂN một khuôn đặt một chỗ có marker, test round-trip rút-từ-writer-đọc-bằng-reader | **fixed:** thêm marker `LOOP-PICTURE-CLAUSE`, AC-6 đổi sang khớp-nguyên-văn + E6 round-trip; bỏ hẳn vế phủ định |
| P2 | contract | Không tiêu chí nào canh việc con trỏ từ hai bản vòng lặp tới bảng tra GIẢI ĐƯỢC bên trong gói đã đóng của từng harness — đúng cặp phép đo đã bị chứng minh là hụt ở feature trước, và bỏ rơi răng đã ký cũng là lớp lỗi có tiền lệ | Bản Codex nêu tên bảng tra nhưng gói không mở được nó. Mọi eval xanh vì tên có mặt và mirror khớp nguồn. Lúc chạy thật, agent trong gói codex rơi về thứ duy nhất nó nhìn thấy là khối ví dụ — lỗi gốc quay lại đúng ở harness không ai thử tay | Thêm tiêu chí: từ mỗi gói đã đóng, mở con trỏ trong bản vòng lặp và rút được khối giữa cặp marker bảng tra, đúng dạng đường dẫn riêng của từng harness | **fixed:** thêm AC-8 + eval E8 mở rộng case gói-đã-đóng sẵn có, ghi rõ răng cũ được GIỮ |
