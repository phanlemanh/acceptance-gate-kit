---
slug: ngon-ngu-mat-nguoi
at: 2026-08-01T04:05:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
claims_input: ok
---

# gap-probe — ngon-ngu-mat-nguoi

Phản biện context sạch, một lượt, 5 input (design + contract + evals + sổ quyết
định + bài học từ feature trước). Critic không đọc mã nguồn — mã chưa tồn tại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Không tiêu chí nào đo được rằng con trỏ GIẢI ĐƯỢC bên trong gói đã đóng. Tiêu chí cũ chỉ kiểm đường dẫn trên cây nguồn, và kiểm mirror khớp nguồn. Chính thiết kế nêu đích danh chế độ hỏng này làm lý do chọn chỗ đặt file, nhưng giả định chịu lực đó không có thước nào gắn vào | Con trỏ trong 4 file bản Codex viết theo đường dẫn gốc-kho. Trên cây nguồn nó tồn tại nên phép đo XANH; mirror chép đúng byte nên phép đo mirror cũng XANH. Nhưng trong gói đã đóng, gốc phân giải của skill khác gốc kho, agent mở ra không có gì — nửa phần cưỡng chế chết ngay lúc giao mà toàn bộ eval vẫn xanh và Cổng 2 ký trên bằng chứng xanh giả | Thêm tiêu chí + case rút đường dẫn từ 8 file ĐÃ NẰM TRONG gói rồi kiểm tồn tại theo gốc của từng gói; đối chứng dương gói nguyên vẹn XANH trước; đột biến di chuyển file tham chiếu trong bản sao gói thì ĐỎ với thông điệp nêu tên gói | **fixed:** thêm AC-6 (con trỏ giải được trong gói, đúng dạng đường dẫn của từng harness) + eval E7 + case P95 |
| P1 | evals | Nhiều eval kết luận thuần từ "bản đột biến ĐỎ", không khai đối chứng dương, trong khi thiết kế có sẵn cột đó cho cả 6 case. Đúng lớp đã bị bắt ở [findings-section-boundary#F2] và đúng bất biến của kho | Bước dựng bản sao sót thư mục thì bước rút con trỏ đọc 0 file, case báo ĐỎ vì bản sao hỏng chứ không vì đột biến. Chiều ngược lại, nếu bước rút trả rỗng thì cả hai bản đều XANH và răng chống con trỏ chết chết âm thầm | Siết `expected` của MỌI eval có đột biến theo lớp, không chỉ ba cái bị nêu tên: bắt buộc hai vế bản-nguyên-vẹn-XANH-trước và thông điệp-nguyên-văn-ghim | **fixed:** quét cả file evals, siết 9 eval còn thiếu vế đối chứng dương (E4, E5, E6, E8, E9, E11, E12, E14) — sửa theo LỚP như bất biến đòi |
| P1 | contract | Nguồn luật gốc trong spec chính là bản sao thứ hai của sáu luật, mà tiêu chí "nguồn duy nhất" lại loại thư mục tài liệu khỏi vùng quét. Hợp đồng gọi spec là NGUỒN trong khi thiết kế gọi file tham chiếu là NGUỒN DUY NHẤT; không tiêu chí nào giữ hai bản khớp nhau | Một tiêu chí buộc luật thứ sáu trong file tham chiếu chỉ đích danh nơi từ điển sống, trong khi spec giữ nguyên bản chung chung — hai bản lệch nhau ngay ngày giao mà phép đo vẫn XANH vì thư mục tài liệu bị loại. Vòng feature kế đọc spec rồi thi hành bản cũ yếu hơn, đúng nguyên nhân thật mà feature này định diệt | Bỏ thư mục tài liệu khỏi danh sách loại trừ; đổi tiêu chí thành đúng hai chỗ đã biết và hai bản phải khớp từng ký tự; đột biến sửa một chữ ở một bản thì ĐỎ nêu tên hai file lệch | **fixed:** viết lại AC-7 theo tiền lệ đã chạy của kho (một bản runtime, một bản người-đọc, test giữ khớp từng ký tự) + eval E8 + case P93; phần chỉ-đích-từ-điển tách thành dòng vận hành nằm NGOÀI bảng luật nên không làm hai bản lệch |
| P1 | evals | Tiêu chí từ điển khai executor máy nhưng không đâu định nghĩa vật để rút danh sách từ cần tra; cấu trúc file tham chiếu trong thiết kế không có khối liệt kê từ mới | Người làm không có gì để rút nên ghi cứng vài từ vốn đã có sẵn, phép đo XANH trong khi các từ mới khác vẫn không có mục — kit vi phạm đúng luật nó vừa đặt. Chiều ngược lại, quét bằng phỏng đoán thì bản nguyên vẹn ĐỎ rồi case bị nới cho qua và thành rỗng | Đặt trong file tham chiếu một khối có marker liệt kê từ mà feature này thêm; phép đo rút từ marker rồi tra từ điển; đối chứng dương trước, đột biến xoá một mục thì ĐỎ nêu đích danh từ thiếu | **fixed:** thêm khối marker danh sách từ vào file tham chiếu, viết lại AC-13 + eval E14 + case P96, và bổ sung hàng phép đo này vào bảng case của thiết kế |
| P1 | evals | Eval phán chất lượng văn đo lệch tập với tiêu chí của nó: tiêu chí nói cả file tham chiếu lẫn tám chỗ trỏ, nhưng đầu vào chỉ có ba trong chín vật, lại kèm một file thiết kế vốn không nằm trong tiêu chí | Sáu trong chín mặt được giao không ai soi, eval vẫn đạt cả ba lượt và tiêu chí ký xanh. Thêm nữa file thiết kế là văn kỹ thuật thuần mà câu hỏi lại dặn bỏ qua phần kỹ thuật, nên mỗi lượt phán cắt ranh giới một kiểu và độ lệch giữa ba lượt bị đọc nhầm thành bất đồng về chất lượng văn | Đầu vào đúng chín vật trong tiêu chí, bỏ file thiết kế; câu hỏi buộc phán riêng từng file và liệt kê tên file đã soi, để thiếu file là lộ ngay | **fixed:** E16 đổi inputs thành đúng 9 file, bỏ design doc, câu hỏi buộc liệt kê tên từng file đã soi + phán riêng từng file |
