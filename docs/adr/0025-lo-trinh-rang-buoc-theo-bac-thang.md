# ADR 0025 — Lộ trình thành ràng buộc theo bậc thang, nấc bắt buộc đi cùng plugin `lo-trinh`

2026-10-14 · CỘNG, chủ kho (Manh Phan) duyệt trong phiên điều phối MacBook Pro («duyệt», sau hai đề xuất
cùng ngày: «lộ trình như ràng buộc của kit, như acceptance và superpowers» và «đưa lộ trình thành một plugin
như feature-loop»). **Số đo 14/10:** 2/14 kho trên máy MacBook Pro khai `lo_trinh.tep` (kit, crm). Ở crm,
273 hồ sơ, 114 nối hàng lộ trình; 20/35 hồ sơ chưa có chữ ký người không nối hàng nào. Mọi vòng crm của
MacBook Pro và M5 đang chạy hôm đó không thuộc mốc nào. Sau khi đổi tài khoản, chủ kho mất bản đồ «xong · đang
dở · kế» và phải hỏi 4 lượt ngoài thiết kế (hạt giống `docs/plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md`).
**Quyết định:** lộ trình KHÔNG thành điều kiện bắt buộc của lõi ngay. Lý do: superpowers và cấu hình nghiệm
thu là CÔNG CỤ, thiếu thì vòng không chạy; lộ trình là DỮ LIỆU, thiếu thì vòng vẫn chạy, chỉ là mù. Bắt một
kho trống có lộ trình là lớp lỗi đã đo ngày 19/09 (luật neo hẹp đẩy vào kho trống, 5 ô xếp lại). Thay vào đó,
đi đúng thứ tự của luật 26/09:
nấc 1 cờ vàng (kho chưa có lộ trình · hồ sơ không thuộc hàng · hàng đang chạy không thuộc mốc) và nấc 3 tự nối
(mở vòng từ mô tả tự do thì máy thêm hàng; câu «gắn mốc nào» hỏi ở Cổng Đáng sẵn có, không thêm lượt gọi người)
đi trong vòng `moc-la-chien-dich` (MC1), vòng meta duy nhất của cửa sổ sau 2.30. Nấc 2 (lệnh khởi tạo kho tạo
sẵn tệp lộ trình) và nấc 4 (chặn) đi trong một plugin «mặt» `lo-trinh` cùng marketplace: lệnh + kỹ năng (bản
đồ hiện trạng, cắt lượt, gom tín hiệu); mã vẫn ở lõi, gọi qua `resolve-plugin` như gói `dieu-phoi`. Kho CÀI
plugin `lo-trinh` là kho cam kết có lộ trình, nên nấc bắt buộc thành lựa chọn của từng kho, không đổi mặc định
cho mọi kho. Plugin là vòng meta **đã gọi tên trước** cho cửa sổ kế (sau mốc kế được một kho tiêu thụ nhận).
**Không làm:** dời mã lộ trình sang plugin mới (23 tệp; crm chép mã vào kho; hồ sơ đã ký hoá cũ). Chỉ dời khi
đo được lý do, ví dụ lõi phải phát hành riêng vì lộ trình. **Giới hạn đã khai:** (i) thanh bên của app là theo
máy × tài khoản, nên nhóm «<lộ trình> · <mốc>» chỉ là mỏ neo chú ý; nguồn thật là tệp lộ trình + hồ sơ;
(ii) nấc 4 chỉ bật khi, sau một lần phát hành có nấc 1 và 3, vẫn còn ≥ 1 hồ sơ mới không nối hàng ở kho đã khai
lộ trình. **Đường đảo:** gỡ cờ vàng (chỉ cảnh báo, không chặn) · không cài plugin `lo-trinh` · bỏ vòng meta
đã gọi tên trước, nếu chủ kho gọi tên vòng khác.
