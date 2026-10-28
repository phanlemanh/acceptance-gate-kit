# Hình tại Cổng Phạm vi — design-floor-moc-s0-s1

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — phê CỘNG móc S0/S1 | dưới ngưỡng: một câu có/không, không chuỗi bước | — |
| Hỏi-2 — tri thức thiết kế lấy từ đâu | hai nhánh rẽ, mỗi nhánh ba bước nối tiếp | `nguon-tri-thuc.html` |
| Gap-probe P0 (bậc M2) | đã sửa, không đẩy người | — |

## Đề bài — nguon-tri-thuc

- Loại: luồng hai nhánh (flowchart), trái sang phải.
- Gốc: «S1 cần chỉ mục + ≤2 tệp tri thức thiết kế».
- Nhánh A (máy khuyên): tải bản ghim lúc chạy vào bộ đệm ngoài kho → kiểm băm theo tệp khoá (kit chỉ giữ băm) → đọc chỉ mục + ≤2 tệp; nhánh phụ «không tải được» → dòng «không đọc được ở đây», vòng đi tiếp.
- Nhánh B: đưa chỉ mục và ~150 tệp tri thức vào kit như mã → kiểm băm trên cây kit → đọc chỉ mục + ≤2 tệp; nhãn giá «thêm nội dung bên thứ ba vào kho công khai, khó rút sau khi đẩy».
- AC liên quan: AC-3, AC-4, AC-10.
