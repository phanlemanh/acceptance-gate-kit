# Hình tại Cổng Phạm vi — luot-cham-ghi-vao-cay

| Điểm | Đếm | Hình |
|---|---|---|
| Đường phát hiện + chấm lại (d-…-1, d-…-6): chụp → chấm → so → nhãn → hoàn lại → chấm lại | 6 bước nối tiếp, 2 nhánh rẽ (cây đổi / không; đã hoàn lại / chưa) | cần hình: `luong-cay-doi` |
| Tên nhãn (d-…-2) | dưới ngưỡng: 1 lựa chọn, 0 nhánh | — |
| Tệp chưa theo dõi không khoá (d-…-3) | dưới ngưỡng: 1 quy tắc | — (bảng §5.1 design) |
| Thẻ Cổng 1 + máy-thông không đọc nhãn (d-…-4) | dưới ngưỡng | — |
| `.claude/` không xét (d-…-7) | dưới ngưỡng | — |
| [GIẢ ĐỊNH] tác tử không ghi tệp theo dõi ngoài ba tiền tố | dưới ngưỡng | — |

## Đề bài `luong-cay-doi`

- Loại: flowchart ngang, một làn chính + hai nhánh rẽ.
- Nút: (1) s4-args chụp cây (HEAD + tệp theo dõi bị sửa) → (2) lượt chấm (tác tử song song) → (3) bước sau-lượt so cây → rẽ A «không đổi trong vùng xét» → báo cáo như cũ / rẽ B «commit lạ hoặc tệp theo dõi bị sửa» → (4) dòng sổ «cây đổi trong lượt chấm», thẻ khoá, lưới trước-merge chặn → (5) phiên chính hoàn lại → (6) s4-args kiểm «đã hoàn lại» → rẽ «chưa» → dừng có tên (hoặc --nhan-cay-moi) / rẽ «đã» → chấm lại CÙNG vòng (không đếm trần), tối đa một lần.
- Nhãn chữ: vùng xét = vật + thước, trừ `.acceptance-runs/`, `evidence/` của hồ sơ, `.claude/`; tệp mới chưa theo dõi chỉ gọi tên.
- AC liên quan: AC-1 (1), AC-2/AC-3 (3), AC-4/AC-6/AC-7 (4), AC-5 (6), AC-8 (5).
