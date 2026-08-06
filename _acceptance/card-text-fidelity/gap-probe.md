---
slug: card-text-fidelity
at: 2026-08-06T01:35:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | E5 chuẩn hoá bằng "bỏ các dấu sao được phục hồi" rồi so bằng — phép chuẩn hoá xoá đúng dấu vết lớp hồi quy cần bắt; không có chiều nghịch | Bản sửa siết quá tay, chữ đậm thật không còn được lột; thẻ in ra dấu sao trần; E5 bỏ sao khỏi dòng mới, được đúng dòng cũ, kết luận XANH; Cổng 2 duyệt trên thẻ đã hỏng | Khẳng định hai chiều: cụm sao chỉ-có-ở-bản-mới phải truy được nguyên văn về nguồn; kèm mutant riêng cho chính phép đo | fixed: tách AC-7 (hai chiều, cấm chuẩn hoá) + AC-8 (mutant có đối chứng dương) → E7, E8 |
| P0 | design + contract | Đây là phép SIẾT nhưng ma trận chỉ có nhấn mạnh dạng chuẩn — thiếu dạng lỏng có khoảng trắng, dạng ba sao, và glob một-sao (biểu thức nghiêng cũng bị sửa) | Hồ sơ thật viết dạng lỏng hoặc ba sao: hôm nay thẻ in sạch, sau bản sửa in nguyên dấu sao giữa mục người đọc mà mọi eval vẫn xanh; chiều ngược `commands/*.md` hôm nay bị nuốt, bản mới trả lại → dễ đi đường hạ thước cho vừa vật | Khai đủ hình dạng kèm kỳ vọng ĐÃ QUYẾT ở một chỗ có marker + chân quét mọi cụm sao trong corpus thật | fixed: bảng `STRIP-SHAPE-MATRIX` 12 hình dạng trong contract (mỗi tên kèm kỳ vọng) + AC-9/E9 quét corpus thật, chênh lệch phải thuộc hình dạng có tên |
| P1 | evals | E1 đo toàn phần bằng số đếm trong khi ô kiểm sinh bằng cách lặp qua chính bảng đó — bên viết và bên đọc cùng nguồn; và criterion của E2 chỉ trỏ AC-1 nên 5 AC không eval nào nhận | Đổi một hàng thành bản sao hàng khác: bảng vẫn đủ số, mọi eval xanh, ca giết-cách-vá biến mất không tiếng động; thẻ Cổng 1 hiện 10/10 AC có eval trong khi 5 AC trống | Quan hệ TẬP TÊN với marker trong hợp đồng + 2 mutant (xoá hàng, đổi tên hàng); mỗi AC có eval nhận | fixed: E1 so tập hợp với marker + 2 mutant; evals tách lại 11 eval, mỗi AC ≥1 eval |
| P1 | contract + evals | Trục C khai 11 chỗ gọi hàm lột nhưng AC chỉ phủ 2 chỗ; Out of scope tuyên các trang khác không đổi mà không phép đo nào giữ | Một lối in dự phòng cũng gọi hàm lột; bản siết làm mục đó in sao trần hoặc nuốt chữ; mọi eval xanh, hỏng chỉ lộ khi người ký mở trang bằng chứng | Đếm chỗ gọi TỪ mã nguồn, so con số khai ở trục C; mỗi lối gọi có đầu ra thật | fixed: con số đúng là 13 (đếm lại từ mã), AC-10/E10 canh quan hệ mã ⇔ trục |
| P1 | evals | Ba chân đối chứng dựa vào bản cũ nhưng không nơi nào định nghĩa mốc suy ra sao; không ca nào dựng cây thiếu lịch sử | Chiến dịch ghim-lại hàng loạt chạy khi bản sửa đã nằm trong lịch sử → "bản cũ phải đỏ" không còn đỏ, hồ sơ đỏ vĩnh viễn dù sản phẩm đúng; hoặc bản sao nông làm 3 eval cùng đỏ vì hạ tầng | Ghim mốc vào sổ khi mở vòng, phép đo ĐỌC từ sổ; thêm ca cây thiếu lịch sử báo thông điệp riêng | fixed: mốc `044968e` ghi vào decisions.jsonl + AC-12/E4/E5 |
