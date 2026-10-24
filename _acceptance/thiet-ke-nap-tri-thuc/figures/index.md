# Hình tại Cổng Phạm vi — thiet-ke-nap-tri-thuc

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — CỘNG: thiếu dòng tra thì thẻ không mời duyệt (khuyên) hay chỉ cờ vàng | hai nhánh rẽ + bốn bước nối tiếp (kho khai? → hồ sơ draft? → có dòng tra? → không đọc được? / thiếu trang ô nêu?) | cần hình: `thẻ-tri-thuc.html` |
| d-…-11 — không làm tra theo mô tả (TT5) | dưới ngưỡng: 1 bước | — |
| d-…-12 — không kiểm ở pre-merge, recheck, ghim lại | dưới ngưỡng: 1 bước | — |
| d-…-1 — bỏ quét hình thái | dưới ngưỡng: 1 bước | — |

## Đề bài `the-tri-thuc`

- Loại: flowchart quyết định (trái → phải), một trang.
- Nút: «Kho khai tri_thuc?» → không: «thẻ như cũ, giống từng byte» · có: «Hồ sơ draft?» → không: «cờ vàng đọc-cũ, không chặn» · có: «Có dòng đã tra?» → không: «CHẶN — máy tự tra, ghi dòng, dựng lại thẻ» · có: «Dòng ghi không đọc được?» → có: «cờ vàng không đọc được ở đây, không chặn» · không: «Còn trang ô đã nêu chưa tra?» → có: «CHẶN — nêu trang chưa tra» · không: «Kiểm băm từng trang» → khớp: «không cờ, mời duyệt» · lệch/sai/không đọc được: «cờ vàng, vẫn mời duyệt».
- Nhãn bằng chữ tiếng Việt như trên; hai nút CHẶN tô màu cảnh báo, nhánh «Hỏi-1 lối khác» chú thích nhỏ: «nếu chỉ cờ vàng: hai nút CHẶN thành cờ vàng».
- AC liên quan: AC-1, AC-2, AC-3, AC-7.
