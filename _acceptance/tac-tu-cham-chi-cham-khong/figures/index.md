# Hình tại Cổng Phạm vi — tac-tu-cham-chi-cham-khong

| Điểm | Đếm (N5) | Hình |
|---|---|---|
| d-…-5 ba loại tác tử (vai → loại) | 9 vai → 3 loại, một bảng; không nhánh | dưới ngưỡng: bảng ở design §2 |
| d-…-3 đường rơi khi loại không nạp | 2 nhánh (nạp / không nạp) + 1 bước ghi sổ | `luot-cham-hai-lop.html` (gộp) |
| d-…-4 tự hoàn lại bốn điều kiện | 4 nhánh rẽ nối tiếp → hoàn lại / để phiên | `luot-cham-hai-lop.html` (gộp) |
| d-…-1 bỏ đặc-tả-UX | 0 bước | dưới ngưỡng: 0 |
| d-…-2 (bị thay bởi d-…-5) | — | — |
| [GIẢ ĐỊNH] vai ui lưu bằng chứng không cần Write | 1 câu | dưới ngưỡng: 1 |
| [GIẢ ĐỊNH] thân tác tử tùy biến không đổi chất lượng | 1 câu | dưới ngưỡng: 1 |

## Đề bài hình `luot-cham-hai-lop`

- Loại hình: luồng (flowchart) dọc, hai làn: «Trong lượt chấm (lối A)» và «Sau lượt chấm (lối D)».
- Làn A: lời gọi tác tử → bảng vai→loại (cham-doc / cham-lenh / cham-ui) → loại nạp được? → có: tác tử không có công cụ sửa tệp · không: gọi lại không loại + dòng sổ «loai-tac-tu-vang».
- Làn D: cây đổi? (không → hết) → đọc transcript → quy trách nhiệm từng tệp → dòng «ghi-boi-tac-tu-cham» → bốn điều kiện (mọi tệp của tác tử · không commit đã đẩy · không tệp bẩn sẵn bị ghi đè · HEAD còn sha) → đủ: tự hoàn lại, chấm lại cùng lượt · thiếu: để phiên làm như hôm nay.
- Nhãn bằng tiếng sản phẩm, không tên hàm. AC liên quan: AC-2, AC-4 (làn A) · AC-5, AC-6 (làn D).

> **Lỗi thời từ 10/10 (thu phạm vi sau dừng-vá):** làn D của hình `luot-cham-hai-lop` còn vẽ nhánh «đủ bốn điều kiện → tự hoàn lại cây». Nhánh ấy đã bỏ: bước sau-lượt chỉ quy trách nhiệm + ghi dòng sổ, không đổi cây (contract AC-6, design doc §10). Hình giữ làm sử liệu của Cổng Phạm vi 09/10, không phải mô tả hành vi hiện tại.
