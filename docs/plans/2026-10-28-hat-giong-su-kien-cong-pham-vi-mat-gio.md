# Hạt giống — sự kiện báo chồng vùng ở Cổng Phạm vi mất giờ ghi

Gốc: `_acceptance/vung-giao-viec-tu-cat-luot/` — Ngoài-5 của lượt chấm 1, chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 28/10. Ô trích lại tên tệp này ở `## Notes` của hợp đồng.

## Người dùng gặp gì

Sự kiện `trung-tep` do lệnh `hang vung` sinh ở Cổng Phạm vi không có giờ thật: khoá `luc: 'cong-pham-vi'` đè lên giờ mà bộ
ghi sự kiện đặt cùng tên. Bảng đếm theo ngày và mọi phép sắp xếp theo giờ đọc sai hay bỏ qua các sự kiện ấy mà không báo.

## Hướng

Đổi tên khoá thời điểm phát hiện (ví dụ `khi: 'cong-pham-vi'`), sửa tiêu chí AC-8 của hợp đồng `vung-giao-viec-tu-cat-luot`
theo đường «thay bởi hồ sơ đã ký», thêm ca canh mọi sự kiện có `luc` đọc được thành giờ.

## Vì sao chưa làm

Lỗi nằm ở chính cách hợp đồng đặt tên khoá; sửa là đổi tiêu chí đã ký nên cần một vòng riêng. Sự kiện loại này hiếm (chỉ khi
hai hàng đang chạy chồng vùng mới khai), không mất quyết định nào.
