# Hạt giống — dự báo đóng băng của mốc không mất khi dời ngày mục tiêu

Gốc: `_acceptance/lo-trinh-gio-may/` (Ngoài-6, chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 16/10). Hạt giống là SỔ,
không phải ô.

## Việc

`du-bao.json` ghi tên ngắn của mốc kèm ngày mục tiêu; trang lộ trình và `lo-trinh.mjs --do-lech` tìm dự báo đóng băng bằng
đúng tên ấy. Dời ngày mục tiêu sau khi đã mở việc → dự báo không khớp: dòng mốc mất «dự báo lúc bắt đầu», cờ quá tải tắt, và
phép đo lệch báo «chưa đóng băng». Hướng: khớp theo danh sách mã hàng lúc đóng băng (`moc.hang`) hoặc tên không kèm ngày.

## Vì sao gấp hơn hạn chế thường

Thói quen hiện tại là ghi đè ngày mốc bằng ngày phát hành thật đúng hôm phát hành. Không sửa thì ngưỡng Cổng Đáng của RM6
(lệch ≤ 1 ngày ở mốc phát hành đầu tiên sau gộp) không đọc được ở chính mốc đầu.

## Ngưỡng mở

Trước khi cắt mốc phát hành đầu tiên bắt đầu sau khi RM6 lên `main`, hoặc chủ kho gọi tên.
