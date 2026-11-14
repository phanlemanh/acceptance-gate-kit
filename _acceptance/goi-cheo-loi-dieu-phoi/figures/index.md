# Hình tại Cổng Phạm vi — goi-cheo-loi-dieu-phoi

Máy kê từ vật cuối S1 (sổ chờ seal, chỗ thiết kế lệch hạt giống); đếm theo ngưỡng N5 (từ ba bước nối tiếp hoặc từ hai nhánh rẽ).

| Điểm | Đếm | Hình |
|---|---|---|
| Hộp thư (đường C): bản gốc ở điều phối → bản chép trong lõi → bản chép CI ở kho tiêu thụ, ở hai bố cục | 3 bước nối tiếp × 2 bố cục | `noi-tep-song.png` |
| Luật chặn lộ trình: có `marketplace.json` cạnh gói → khoá đúng · vắng → khoan dung theo tiền tố | 2 nhánh rẽ | `noi-tep-song.png` (khối phải) |
| Bảng tên theo vai, kịch bản đổi tên cơ học | 2 bước | dưới ngưỡng: 2 bước |
| Tám dòng sổ S1 còn lại (start-scan, kiem-ban-cai, feature-loop, chỗ đặt thước, quy tắc chép, descope) | 1 lựa chọn mỗi dòng | dưới ngưỡng: 1 |
| Ba nhóm thêm so với hạt giống (start-scan · feature-loop tự host · danh sách chép có bảng tên) | bảng, không luồng | dưới ngưỡng: 0 |

## Đề bài `noi-tep-song`

- Loại: sơ đồ «nơi tệp sống» ba cột × hai hàng (cột: bản kéo kit · bản cài plugin · kho tiêu thụ; hàng: bố cục cũ · bố cục mới).
- Nút: `dieu-phoi/scripts/{hinh-dang,cau-hinh,dot,cua-tin-hieu}.mjs` (gốc) → `scripts/hop-thu/` (bản chép trong lõi, răng
  từng byte GN-2) → `scripts/hop-thu/` ở kho tiêu thụ (danh sách chép CI); `lib/ho-goi.cjs` đi cùng `lib/chan-lo-trinh.cjs`.
- Hàng bố cục mới: bản cài lõi = riêng `plugins/acceptance-gate/` — không còn `dieu-phoi/`, không `marketplace.json` (đã đo).
- Khối phải: luật chặn lộ trình hai nhánh (có marketplace cạnh gói → khoá `<tên>@<chợ>` đúng · vắng → `<tên>@*`).
- AC liên quan: AC-2, AC-3, AC-5, AC-9.
