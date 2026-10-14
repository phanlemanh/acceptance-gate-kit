# Hình tại điểm quyết định — moc-la-chien-dich

Kê theo bước [1]–[2] của nghi thức. Nguồn: `contract.md`, sổ quyết định, design doc.
Hình là CHIẾU của nguồn chữ, không bao giờ là nguồn.

| Điểm quyết định | Đếm N5 | Hình |
|---|---|---|
| Hỏi-1 `d-20261014T082738Z-1` Cờ xét «kho dùng mốc» ở cấp kho hay cấp lộ trình | **3 bước nối tiếp + 2 nhánh rẽ** (kho dùng mốc? → hàng có hồ sơ đang mở? → thuộc mốc?; nhánh cấp kho / cấp lộ trình đổi kết quả ở lộ trình 0 mốc) | `co-ngoai-moc.html` |
| Hỏi-2 `d-20261014T082738Z-2` Tên kho lấy từ thư mục hay khoá cấu hình mới | 1 nhánh (hai lối, không chuỗi bước) | dưới ngưỡng: 1 |
| Hỏi-3 `d-…-8` Dời nấc 3 (tự thêm hàng) sang vòng plugin | 1 nhánh (giữ hay dời) | dưới ngưỡng: 1 |
| `d-…-3` Hàng nhiều mốc lấy mốc sớm nhất | 1 nhánh, căn cứ là một con số (0 hàng) | dưới ngưỡng: 1 |
| `d-…-4` Dòng mốc ghi vào ô cơ hội | 0 nhánh | dưới ngưỡng: 0 |
| `d-…-5` Hàm ở lớp lộ trình | 0 nhánh | dưới ngưỡng: 0 |
| `d-…-6` Bỏ bản đồ hiện trạng | 0 nhánh (descope) | dưới ngưỡng: 0 |
| `d-…-7` Cổng Đáng ký cùng Cổng Phạm vi | 0 nhánh | dưới ngưỡng: 0 |

## Đề bài hình 1 — `co-ngoai-moc.html`

Loại: cây quyết định (luồng dọc, 3 nút hỏi), kèm một dải so hai lối của Hỏi-1.
Nút: «Kho có lộ trình nào khai mốc?» — không → «như cũ, không cờ» · có → «Việc có hồ sơ đang mở (chưa giao,
chưa dừng)?» — không → «không cờ» · có → «Mã việc nằm trong một mốc của lộ trình nó?» — có → «không cờ, tên nhóm
<lộ trình> · <mốc>» · không → «cờ vàng: đang làm mà chưa thuộc mốc nào».
Dải so dưới cây (Hỏi-1): cấp kho (khuyên) — crm Việc và Dự án 0 mốc: DA0c bị cờ, cờ của lộ trình này 4→5 · cấp lộ trình — DA0c
im, 4→4. Chữ là nhãn; không phân biệt bằng màu đơn thuần.
AC liên quan: AC-1, AC-2, AC-9.
