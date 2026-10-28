# Hình tại Cổng Phạm vi — design-floor-moc-s3-s4

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — phê CỘNG: cuối S3 ghi tệp kho (autofix + sinh lại, commit riêng), S4 chỉ đọc | 4 bước nối tiếp (chụp cây → autofix → sinh lại → commit) rồi S4 | `luong-s3-s4` |
| Hỏi-2 — chặn theo bậc | 4 nhánh rẽ theo bậc M0–M3 | `luong-s3-s4` (dải bậc dưới hộp S4) |
| Phản biện context sạch — 5 phát hiện, đã sửa cả 5 | dưới ngưỡng: không còn điểm chờ người | — |

## Đề bài `luong-s3-s4`

- Loại: luồng ngang trái → phải, một dải phụ bên dưới.
- Nút: «Cuối S3: chụp cây» → «autofix trang HTML vòng đổi» → «chạy lệnh sinh lại kho khai» → «một commit S3 (chỉ tệp máy đổi)» → ranh «sang implemented» → «S4 chỉ đọc: hex thô + độ phủ token» → «pre-merge: không tệp nào đổi sau S4».
- Nhãn trên hai nút ghi (autofix, commit) «Hỏi-1: chỗ duy nhất design-floor ghi tệp kho»; dải dưới hộp S4 bốn ô bậc: M0 im · M1 hex thô chặn · M2 hex thô chặn, độ phủ token cảnh báo · M3 cả hai chặn — nhãn «Hỏi-2». Ghi chú nhỏ: «không đo được → không bao giờ chặn».
- AC liên quan: AC-1, AC-2, AC-3, AC-6, AC-7, AC-9.
