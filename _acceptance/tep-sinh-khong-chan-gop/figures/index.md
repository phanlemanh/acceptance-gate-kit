# Hình tại Cổng Phạm vi — tep-sinh-khong-chan-gop

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-2 — vế reality của ngưỡng ô (thu về «không gỡ xung đột tay» hay giữ «không gộp lại») | 5 bước nối tiếp, 2 nhánh rẽ (đã bật / chưa bật) | `luong-gop.html` |
| Hỏi-1 — thư mục rỗng trong `_acceptance/` vào vòng hay hạt giống | 2 nhánh rẽ | `thu-muc-rong.html` |
| Descope job sau gộp (đề xuất 2) | dưới ngưỡng: 1 bước | — |
| Dòng sổ thay thế d-2 (driver tên riêng thay union) | dưới ngưỡng: 1 lựa chọn đã quyết, không rẽ | — |

## Đề bài `luong-gop`

- Loại: luồng (flowchart) hai làn song song: «kho đã bật» và «kho chưa bật / máy chưa cấu hình».
- Nút chung: nhánh chính dời (PR khác gộp, đổi bản đồ) → thợ gộp nhánh chính vào nhánh PR.
- Làn đã bật: git gộp không dừng ở PRODUCT-MAP.md · LO-TRINH.html (giữ bản của nhánh PR) → `--check` đỏ đúng tệp → vẽ lại → commit, đẩy → CI.
- Làn chưa bật: git dừng, xung đột ở hai tệp sinh → người/máy gỡ tay (lấy một bên rồi vẽ lại) → commit, đẩy → CI.
- Chú thích dưới hình: cả hai làn vẫn có bước «gộp lại + vẽ lại + CI» — vật chỉ bỏ ô «dừng, gỡ tay» (Hỏi-2). Nhãn bằng chữ, AC-1/AC-2/AC-3.

## Đề bài `thu-muc-rong`

- Loại: so sánh hai cột: «máy có thư mục sót» và «bản clone sạch (CI)».
- Cột trái: `_acceptance/rong/` rỗng → hôm nay: bản đồ thêm dòng «Hồ sơ hỏng: rong» → commit; cột phải: không có thư mục (git không giữ thư mục rỗng) → vẽ ra không có dòng ấy → `--check` đỏ.
- Hàng dưới «sau vòng»: hai cột vẽ giống nhau; thư mục có tệp lạ (`ghi-chu.txt`) vẫn «Hồ sơ hỏng»; thư mục chỉ có `.DS_Store` bị bỏ qua — giới hạn khai.
- AC-6.
