# Hình tại điểm quyết định — trang-thai-dot-dieu-phoi-tho (Cổng Phạm vi)

Ngưỡng N5: từ ba bước nối tiếp, hoặc từ hai nhánh rẽ, thì cần hình.

| Điểm | Đếm | Hình |
|---|---|---|
| d-20261012T083355Z-1 — `/dieu-phoi:xem` trả lời bằng hook trên tên lệnh markdown | 2 nhánh (mod trả lời · hook hỏng → lệnh markdown) | luong-doc-va-duong-lui |
| d-20261012T083355Z-2 — CLI là bên đọc duy nhất | 4 bước nối tiếp (mod → CLI `xem --json` → JSON → dải/pane/lệnh) | luong-doc-va-duong-lui |
| d-20261012T083355Z-3 — đo engine thật trong môi trường cô lập | dưới ngưỡng: 1 bước | — |
| d-20261012T083355Z-4 — bỏ ui-observed | dưới ngưỡng: 1 câu | — |
| d-20261012T083355Z-5 — bỏ design-pass | dưới ngưỡng: 1 câu | — |
| d-20261012T083355Z-6 — không đo §12.3 câu 1/3/4 | dưới ngưỡng: 1 câu | — |
| d-20261012T083355Z-7 — nhánh `$.fs` để Later | dưới ngưỡng: 1 nhánh | — |
| d-20261012T083355Z-8 — tổng quát hoá răng sự kiện cổng | dưới ngưỡng: 1 câu | — |

## Đề bài hình `luong-doc-va-duong-lui`

- Loại hình: luồng dữ liệu (data flow) có một nhánh lùi.
- Nút:
  - phiên trong app (desktop/terminal);
  - phần mod «khung»;
  - CLI `xem --json`;
  - thư mục đợt;
  - ba bề mặt: dải trên ô nhập · pane «Đợt» · câu trả lời `/dieu-phoi:xem`;
  - lệnh markdown cũ (qua model).
- Cạnh:
  - Luồng chính: mod gọi CLI mỗi 20″ (120″ khi không đợt); CLI đọc thư mục đợt và trả JSON; mod vẽ ba bề mặt từ
    cùng một JSON.
  - Nhánh lùi: CLI lỗi khi gõ `/dieu-phoi:xem` → hook hỏng → engine bỏ qua hook → lệnh markdown cũ trả lời qua
    model.
  - Nhãn chú thích: «mod chỉ đọc — không ghi tệp đợt, không cho phép lời gọi công cụ».
- AC liên quan: AC-1, AC-4, AC-5, AC-7, AC-8 (đường lùi e), AC-9.
