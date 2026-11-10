# Hình tại điểm quyết định

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1: lỗi mức vừa tiếp tục ra PASS hay tự trả lại | 3 bước nối tiếp, 2 nhánh rẽ | duong-loi-toi-nguoi-ky |
| Hỏi-2: bộ đọc đặt ở thư mục script hay vùng T3 | dưới ngưỡng: một lựa chọn chỗ đặt, 0 bước nối tiếp | không vẽ |
| Mã đã có trước Cổng Phạm vi (lệch thứ tự) | dưới ngưỡng: một sự kiện, 0 nhánh | không vẽ |
| Dòng [GIẢ ĐỊNH] của Coverage | dưới ngưỡng: một dòng ghi chú | không vẽ |

## Đề bài: duong-loi-toi-nguoi-ky

Loại hình: sơ đồ luồng. Nhãn bằng tiếng Việt, không tên tệp, không tên hàm.

Nút theo thứ tự: «Lượt chấm tìm thấy lỗi trong hợp đồng» → rẽ theo mức lỗi.
Nhánh «Mức nặng» → «Tự trả lại: máy sửa rồi chấm lại».
Nhánh «Mức vừa» → «Phán quyết PASS» → «Thẻ và trang hiện lỗi, bỏ lời mời ký nhanh» → «Người ký quyết: ký kèm lỗi, hay trả lại».

Đánh dấu bằng màu nhấn ô «Thẻ và trang hiện lỗi, bỏ lời mời ký nhanh» và ghi chú nhỏ cạnh nó: «phần vòng này thêm».
Đánh dấu nhánh «Mức vừa» là chỗ của câu hỏi cho chủ kho, với chú thích: «Câu hỏi: giữ nhánh này, hay gộp nó vào nhánh tự trả lại».
Tiêu chí liên quan: AC-1, AC-9, AC-10.
