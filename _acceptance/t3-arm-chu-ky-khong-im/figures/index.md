# Hình tại điểm quyết định — t3-arm-chu-ky-khong-im

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 chặn hay cho qua kèm cảnh báo | 2 nhánh rẽ (chặn · cho qua kèm cảnh báo) | `khi-thieu-cong-cu` |
| Hỏi-2 lời báo khi thư viện chạy lỗi | 2 nhánh rẽ (để ngoài · làm luôn) | gộp ghi chú trong `khi-thieu-cong-cu` |
| Hai lý do riêng cho thiếu node và thiếu lib | 0 nhánh, 2 bước | dưới ngưỡng: 0 nhánh · 2 bước |
| Chỉ thêm dòng, không sửa dòng cũ | 0 nhánh, 2 bước | dưới ngưỡng: 0 nhánh · 2 bước |

## Đề bài `khi-thieu-cong-cu`

- Loại hình: flowchart một trang, đọc dọc, nói tiếng sản phẩm, không tên hàm hay tên tệp.
- Nút vào: «PR đổi code trọng yếu, kèm hồ sơ hạng dưới T3».
- Rẽ 1: «Máy chạy cổng có đủ công cụ đọc chữ ký?» → có: sang rẽ 2. Không: sang rẽ 3.
- Rẽ 2: «Hồ sơ có chữ ký người?» → có: «Tính hồ sơ, cổng đi tiếp». Không: «Chặn: chưa có chữ ký người».
- Rẽ 3 (Hỏi-1): khuyến nghị, tô đậm: «Chặn, nói rõ thiếu node hay thiếu thư viện». Lối khác, nét đứt: «Cho qua, in một dòng cảnh báo: code trọng yếu có thể gộp mà không ai ký».
- Ghi chú dưới hình, hai dòng: «Đọc ngày 10/11/2026: 13 kho cài cổng, không kho nào đang rơi vào nhánh thiếu công cụ.» và «Hỏi-2: thư viện có mặt mà chạy lỗi thì PR vẫn bị chặn, chỉ lời báo chưa đúng.»
- AC liên quan: AC-1, AC-2, AC-3.
