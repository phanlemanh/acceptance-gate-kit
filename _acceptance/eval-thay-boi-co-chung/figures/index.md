# Hình tại Cổng Phạm vi — eval-thay-boi-co-chung

| Điểm | Đếm | Hình |
|---|---|---|
| Cái bắt tay hai đầu + chuỗi chín điều kiện (sổ d-…-7, d-…-8; gap-probe P0/P1) | 9 bước nối tiếp, mỗi bước rẽ nhánh từ chối → cần hình | `chuoi-chung.html` / `.png` |
| Con trỏ đi cạnh lời khai không-chạy, không giá trị trạng thái mới (sổ d-…-1) | 2 nhánh rẽ (giá trị mới · con trỏ) nhưng một bước → dưới ngưỡng: 1 bước, 2 nhánh | — |
| Con trỏ sống trong evals.yaml, không trong sổ (d-…-2) · cấp AC (d-…-3) · không dùng lối nghỉ (d-…-5) | mỗi điểm 1 bước → dưới ngưỡng | — |

## Đề bài `chuoi-chung`

- Loại: flowchart dọc, hai làn ở đầu — trái «Hồ sơ cũ (đã ký)», phải «Hồ sơ thay (đã ký)» — mũi tên con trỏ đi từ ô E3 của hồ sơ cũ sang AC-7 của hồ sơ thay, mũi tên «nhận» đi ngược từ design doc của hồ sơ thay về E3 (thẻ `ho-so-cu/E3`).
- Dưới: chuỗi chín ô quyết định nối tiếp 0→8 (tra được gốc cây · con trỏ đúng dạng · không tự trỏ · hồ sơ thay có · có chữ ký người · chưa khép · hồ sơ thay NHẬN việc thay · AC có trong hợp đồng thay · AC còn eval có mã thoát đã ký); mỗi ô có nhánh phải «gãy → vẫn xung đột: <lý do>».
- Cuối chuỗi: «nhận — ô rời xung đột, pin nói ra: E3→ho-so-thay#AC-7».
- Nhấn (màu khác) hai ô mới sau gap-probe: «hồ sơ thay NHẬN việc thay» và «AC còn eval có mã thoát đã ký».
- AC liên quan: AC-1, AC-2, AC-6.
