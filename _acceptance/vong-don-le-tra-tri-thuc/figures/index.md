# Hình tại Cổng Phạm vi — vong-don-le-tra-tri-thuc

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — CỘNG: dòng tra thiếu mảng `so` thì thẻ không mời duyệt (khuyên) hay chỉ cờ vàng | hai nhánh rẽ + bốn bước nối tiếp (kho khai? → hồ sơ draft? → có dòng tra? → có mảng so? → đường trỏ sổ có dòng?) | cần hình: `tra-so-tren-the.html` |
| d-…-3 — gộp hạt giống đường trỏ kho riêng thiếu tiền tố | dưới ngưỡng: 1 bước | — |
| d-…-5 — không tra sổ ở kho không khai | dưới ngưỡng: 1 bước | — |
| d-…-1 — bỏ quét hình thái | dưới ngưỡng: 1 bước | — |

## Đề bài `tra-so-tren-the`

- Loại: flowchart quyết định (trái → phải), một trang.
- Nút: «Kho khai tri_thuc?» → không: «thẻ như cũ, giống từng byte» · có: «Hồ sơ draft?» → không: «đọc như cũ, không kiểm so» · có:
  «Có dòng đã tra?» → không: «CHẶN — chưa tra tri thức (TT4)» · có: «Dòng tra có mảng so?» → không: «CHẶN — chưa tra sổ
  quyết định của hồ sơ trước; máy chạy lệnh tra, ghi dòng mới» · có: «Mỗi đường trỏ sổ có dòng?» → có: «không cờ, mời duyệt» ·
  không: «cờ vàng: dòng sổ hồ sơ trước không có, vẫn mời duyệt».
- Nhãn bằng chữ tiếng Việt như trên; nút CHẶN «chưa tra sổ» tô màu cảnh báo và chú thích nhỏ «Hỏi-1 — nếu chọn cờ vàng: nút
  này thành cờ vàng, vẫn mời duyệt».
- Bên trái một dải nhỏ «Lệnh tra (vòng đơn lẻ: câu mô tả · vòng từ hàng: câu giao + --slug) → trang + dòng sổ → đối tượng
  tri_thuc_tra» nối vào nút «Có dòng đã tra?».
- AC liên quan: AC-5, AC-6.
