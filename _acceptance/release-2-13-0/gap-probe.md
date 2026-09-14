---
slug: release-2-13-0
at: 2026-09-14T14:30:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

## Findings

Phản biện context sạch một lượt (agent tươi, bốn artifact + hồ sơ mốc trước để so khuôn).
Năm finding, ĐỊNH ĐOẠT trọn: P0 và ba P1 sửa ngay tại S1, P2 sửa ngay. Không mục nào hoãn.

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | rang-p93 | Chân `do` clone HEAD còn chân `im` chạy cây làm việc, nên hai chân đo HAI phiên bản; không phép so nào bắt bản sao phải mang vật đang đo | Nhát vá còn ở cây làm việc lúc chấm → bản sao quét bằng mã CŨ; vì P93 đếm cặp marker bất kể tracked-ness, mã cũ CŨNG đỏ khi fixture vào index → E5b xanh trên cả bản vá lẫn bản chưa vá, một chân hằng-đúng, phép vi phân rỗng | Chép vật từ cây làm việc vào bản sao rồi KHẲNG ĐỊNH hai băm bằng nhau (lệch → thoát 2); in dấu vật lên dòng PASS của cả hai chân; hai chân dùng CÙNG bản sao, khác đúng một biến là tracked-ness của fixture | fixed: viết lại rang-p93.sh theo đúng thước đo đề xuất; AC-5 ghi thêm đoạn «vì sao phải cùng bản sao và cùng vật» |
| P1 | rang-p93 | Chân `im` quy MỌI dòng FAIL về một nguyên nhân (mã 3), không ghim thông điệp; `chay_p93()` kết bằng `return 0` nên mã thoát thật của suite bị nuốt, nhánh 126/127 chết | Máy chấm thiếu python3, hoặc một thư mục nguồn đổi tên, hoặc bảng luật lệch giữa hai tệp → P93 đỏ vì lý do khác, răng in «VẬT nói dối, phép quét vẫn đo cây LÀM VIỆC» → người chấm kết luận nhát vá chưa có, đốt một lượt; đúng lớp hạ-tầng-tự-sinh-tín-hiệu-đỏ mà mốc này sinh ra để giết | Chỉ kết luận mã 3 khi dòng FAIL mang thông điệp ghim của phép đếm cặp marker; FAIL vì chuỗi khác → mã 5 và in nguyên dòng ra stderr; bỏ `return 0` để mã thoát thật đi tới nhánh chưa-từng-chạy | fixed: cả hai chân dùng chung hàm `chay` không nuốt mã, và biến `CO_GHIM` quyết mã 3 hay mã 5 |
| P1 | evals | E3a–E3e không ghim SỐ CA; suite plugins kết bằng câu không kèm số và chỉ đếm `failures`. 2.12.0 không cần vế này vì không chạm tệp ca nào; mốc này SỬA chính tệp suite — đó là lý do MỚI | Nhát vá làm bảng khối gãy giữa chừng (ngoặc lệch, `exit 0` lọt, heredoc không đóng) → suite vẫn in «all plugin tests passed» và thoát 0, E3c XANH, AC-3 được ký trong khi hàng chục khối im lặng không chạy; `ONLY_BLOCK=P93` của AC-5 chỉ chứng minh riêng khối P93 còn sống | Một răng chạy suite MỘT lần, đòi thoát 0 VÀ đếm dòng PASS không ít hơn sàn đo trên cây lành; so một phía nên thêm ca không bao giờ làm đỏ | fixed: thêm rang-so-ca.sh (sàn 266, đo 14/09), E3c đổi sang nó; AC-3 ghi thêm vế số ca và lý do |
| P1 | contract | AC-5 tuyên «chân im phải ĐỎ trên cây trước khi vá» nhưng không eval nào biến lượt đỏ ấy thành bằng chứng; `evidence_required` chỉ phủ lượt sau vá | S3 vá xong rồi S4 mới chấm nên lượt đỏ-trước-vá không bao giờ tồn tại; nếu khối tiêm không còn rơi vào vùng quét, chân `im` XANH vì chưa bao giờ tiêm được chứ không phải vì đã vá — hội đồng đọc nó như phép đo đã chứng minh | Chạy chân `im` TRƯỚC vá, ghim vào `expected` cả mã thoát lẫn thông điệp đọc được, và ghim dấu vật trước-vá để hai bản tự phân biệt | fixed: đã chạy thật tại S1, mã 3, dòng nguyên văn và dấu vật `40b91d6c` ghim vào AC-5 và `expected` của E5a |
| P2 | evals | E4 hỏi judge về hai dòng MÁY ĐO nhưng `inputs` chỉ có contract, không nạp usage-report có thật trên đĩa; judge chỉ đo được NHÃN có mặt | S3 điền hai dòng token và phút với nhãn đúng cú pháp nhưng số lệch khỏi usage-report (chép nhầm khối, gộp nhầm ba khối, trỏ nhầm vòng) → E4 XANH, owner ký «mốc đầu tiên đếm đủ năm dòng số» trên hai con số không ai đối chiếu, và chính hai dòng ấy là điều-kiện-tin-cậy để cắt kit ở cửa sổ sau | Nạp usage-report làm input thứ hai và hỏi hẹp: hai dòng máy đo có khớp từng chữ số với tệp nêu tên không; ba dòng đếm tay giữ nguyên | fixed: thêm input, thêm câu hỏi đối-chiếu-nhãn-với-nguồn; không lật quyết định «cấm tính lại số» vì đây là đối chiếu nguồn, không phải tính lại |
