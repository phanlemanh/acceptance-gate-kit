# Hạt giống — `hang them <mã lộ trình>` lấy trọn hàng lộ trình, không chỉ vùng

Gốc: `_acceptance/vung-giao-viec-tu-cat-luot/` — Ngoài-6 của lượt chấm 1, chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 28/10. Ô trích lại tên tệp này ở `## Notes` của hợp đồng.

## Người dùng gặp gì

Giám sát thêm việc giữa đợt bằng mã một hàng lộ trình: hàng mới nhận vùng của hàng lộ trình nhưng slug đoán từ chính mã và
không mang `ma`. Hồ sơ của hàng mở ra dưới tên sai, và phụ thuộc `sau` của hàng khác trỏ mã ấy không tìm thấy nó.

## Hướng

Khi mã có ở đúng một tệp lộ trình mà nguồn hàng của đợt trỏ tới, hàng mới lấy `ma`, `slug`, `tep` và vùng của hàng ấy; mã
không có thì giữ lối cũ. Kèm ca vi phân: đợt không khai nguồn hàng cho kết quả y như trước.

## Vì sao chưa làm

Đổi slug là đổi hành vi của `hang them` cho mọi kho đã dùng nó bằng mã lộ trình — cần một vòng có ca vi phân riêng, ngoài
phạm vi vòng vùng.
