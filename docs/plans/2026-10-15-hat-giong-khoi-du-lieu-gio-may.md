# Hạt giống — giờ máy trong khối dữ liệu máy đọc của trang lộ trình

Gốc: `_acceptance/lo-trinh-gio-may/` (hàng RM6, phạm vi bỏ ngoài OOS-1 chủ kho duyệt ở Cổng Phạm vi 15/10). Hạt giống là
SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài (ngưỡng ở cuối).

## Việc

Trang lộ trình đã hiện giờ máy mỗi hàng, tổng giờ máy và % hạn mức mỗi mốc, dự báo đóng băng và cờ quá tải. Khối dữ liệu
máy đọc (`<script id="lo-trinh-du-lieu">`, khuôn `KHUON_DU_LIEU`, tài liệu `skills/acceptance/references/lo-trinh-du-lieu.md`)
chưa mang các số ấy, nên bản chiếu ngoài kho (trang lộ trình trong CRM) chưa thấy giờ máy.

Hướng: khoá `gio_may` (khoảng, nguồn ước, % ước) ở cấp hàng và `gio_may` + `du_bao_dong_bang` ở cấp mốc, khuôn lên bản 3.
Bộ đọc mẫu `docDuLieu` (bản chép ở kho tiêu thụ) gặp bản 3 thì «đọc phần biết» kèm một cảnh báo — đường đọc-cũ đã có.

## Vì sao chưa làm ở RM6

Đổi khuôn khối là phiên bản mới: mọi bản chép bộ đọc ở kho tiêu thụ hiện cảnh báo tới khi cập nhật. Chưa kho nào xin số
này trong khối.

## Ngưỡng mở

Một kho tiêu thụ có bản chiếu lộ trình (crm `trang-lo-trinh-trong-crm` hay kho khác) xin giờ máy trong bản chiếu, hoặc chủ
kho gọi tên.
