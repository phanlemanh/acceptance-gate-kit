# Hình tại điểm quyết định — t3-can-ho-so-arm

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 mức áp của luật | 3 nhánh rẽ (chặn ngay · cảnh báo trước · siết cả code thường) | `duong-phan-xet` |
| Hỏi-2 cái gì đủ cho code T3 | 3 nhánh rẽ (T2 có chữ ký · máy-thông · buộc T3) | `duong-phan-xet` |
| Hỏi-3 hai giới hạn | 2 nhánh rẽ (chấp nhận · dựng ánh xạ hoặc miễn hẹp) | dưới ngưỡng cần hình riêng: gộp ghi chú trong `duong-phan-xet` |
| Vật có trước hồ sơ | 0 nhánh, 2 bước | dưới ngưỡng: 0 nhánh · 2 bước |

## Đề bài `duong-phan-xet`

- Loại hình: flowchart một trang, đọc dọc, nói tiếng sản phẩm, không tên hàm.
- Nút vào: «PR đổi code trọng yếu, có đổi gì đó trong thư mục hồ sơ».
- Rẽ 1: «Nhánh đích đã có cổng?» → chưa: «Lần cài kit, được miễn». Rồi: đi tiếp.
- Rẽ 2 duyệt từng hồ sơ: «Có hợp đồng, khai đủ hạng và trạng thái, hạng thuộc diện phải ký?» → không: «Không tính». «Đã khép, hoặc chỉ đổi tệp ghi chép?» → có: «Không tính». «Hạng dưới T3 mà chưa có người ký?» → có: «Không tính (Hỏi-2)». Còn lại: «Được tính».
- Kết: có ít nhất một hồ sơ được tính → «Đi tiếp, cổng chấm hồ sơ đó» · không có → «Chặn, nêu từng hồ sơ và lý do».
- Ghi chú dưới hình: «Luật không buộc hồ sơ với từng tệp (Hỏi-3)». AC liên quan: AC-1 đến AC-7.
