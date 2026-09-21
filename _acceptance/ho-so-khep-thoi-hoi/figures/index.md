# Hình tại Cổng Phạm vi — ho-so-khep-thoi-hoi

| Điểm | Đếm | Hình |
|---|---|---|
| d-…-1 gộp Gate 1.5 vào Cổng Phạm vi | 2 nhánh (gộp · tách) nhưng không rẽ luồng sản phẩm | dưới ngưỡng: 2 nhánh, bảng đủ |
| d-…-2 làn V đọc tệp phát hiện — ba lối (chặt · ân xá theo ngày · đọc sổ) | 3 nhánh | `lan-v-doc-so.html` |
| d-…-3 bỏ đặc tả giao diện | 1 | dưới ngưỡng: 1 |
| d-…-4 không hỏi thêm ở thiết kế | 1 | dưới ngưỡng: 1 |
| câu hỏi 7 mục của co-qua-timebox | danh sách, không luồng | dưới ngưỡng: bảng |

## Đề bài `lan-v-doc-so`

- Loại: cây quyết định / sơ đồ luồng trái→phải.
- Nút: «Hồ sơ chưa ký, báo cáo sạch» → «Tệp phát hiện có mục ngoài hợp đồng?» — không → «Làn máy-đi-trước (như cũ)»; có → «Mọi mục đã có dòng quyết của người trong sổ?» — có → «Làn máy-đi-trước (ghim-lai-tren-lop-cu · crm quyen-luot-mang-theo)»; không → «Còn cần người: thẻ hỏi ký hay trả (co-qua-timebox-nhom-da-xong, 7 mục)».
- Chú thích phụ: hai lối đã loại — «chặt: mọi mục đòi chữ ký → CI crm đỏ ngày cài» · «ân xá theo ngày → lỗ vẫn mở cho hồ sơ cũ».
- AC liên quan: AC-4, AC-5, AC-8.
