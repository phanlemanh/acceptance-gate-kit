# Hình tại Cổng Phạm vi — loc-paths-dong-mac-dinh

| Điểm | Đếm | Hình |
|---|---|---|
| d-…-1 cây = tệp git ở commit đang kiểm | thuộc luồng phân loại (bước 5–7) | `phan-loai-muc-paths` |
| d-…-2 mục không trỏ tới tệp → luật cũ | thuộc luồng phân loại (bước 3, 4, 7) | `phan-loai-muc-paths` |
| d-…-6 thư mục trần có thật → nhận | thuộc luồng phân loại (bước 6) | `phan-loai-muc-paths` |
| Luồng phân loại một mục | bảy bước nối tiếp, năm nhánh rẽ → cần hình | `phan-loai-muc-paths` |
| d-…-3 hàng bộ máy có điều kiện | hai nhánh (khoá bật · khoá vắng) nhưng mỗi nhánh một bước | dưới ngưỡng: 2 nhánh × 1 bước |
| d-…-4 danh sách ô chạm chỉ thêm | một mệnh đề | dưới ngưỡng: 1 |

## Đề bài `phan-loai-muc-paths`

- Loại: flowchart dọc, một đầu vào «một mục paths», bảy ô quyết định theo thứ tự của bảng trong design doc §Phân loại.
- Ba lối ra màu khác nhau: **nhận** (kèm glob thật dùng để so) · **từ chối: dạng khai lạ** · **từ chối: không trỏ tới tệp nào** (rỗng thì `evals-hong`).
- Nhãn chữ ở ô bước 6: «thư mục có thật trong cây → <thư mục>/**  (lưới crm chặn, bộ lọc nhận — D4)».
- Chú thích dưới hình: một mục bị từ chối → cả hồ sơ giữ luật cũ, NOTE gọi tên mục. AC liên quan: AC-1, AC-2, AC-4.

Ghi chú bước vẽ: hình lộ nhánh bước 4 «0 tệp, 0 thư mục» không có ô nào trong ma trận → hợp đồng thêm D19 (`src/*.ts`), ma trận 18 → 19 ô.
