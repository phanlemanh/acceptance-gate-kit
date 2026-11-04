# Hình tại điểm quyết định — khoi-khuon-tren-the-cong (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — phê CỘNG ba phần (S1 ghi lựa chọn · khối Cổng Phạm vi · khối Cổng Bằng chứng) | 2 nhánh (phê cả ba · phê hai, để Cổng Bằng chứng) | luong-khuon-hai-cong |
| Hỏi-2 — màn mới quyết bằng câu Hỏi-n sẵn có hay nhãn riêng | 2 nhánh | luong-khuon-hai-cong |
| Bỏ ảnh màn mẫu (KH3) · bỏ ba lối (KH-C6) · không so chữ tự động · bỏ design-pass · bỏ đặc tả UX | dưới ngưỡng: 1 lối mỗi điểm | — |
| Bộ đọc đặt ở scripts/, không chạm lib/ | dưới ngưỡng: 1 lối | — |

## Đề bài: luong-khuon-hai-cong

- Loại hình: luồng (flowchart) trái → phải, có hai nhánh rẽ được tô.
- Nút: «S1 bước nạp» → rẽ «chọn nhóm (--nhom)» / «nhóm mới (--nhom-moi, --gan tuỳ chọn)» → «khuon-nap.json (chon + băm màn mẫu)»
  → «Thẻ Cổng Phạm vi: khối Khuôn + 3 cờ» (nhánh nhóm mới thêm «Hỏi-n: tạo nhóm / xếp vào nhóm gần · để ngoài bản đồ»)
  → «S3/S4 bước chấm → khuon-cham.json» → «Thẻ Cổng Bằng chứng: số đo + danh sách lệch + cờ chạm nhóm khác».
- Nhãn chữ: tô vùng «Hỏi-1: phê cả ba phần (khuyến nghị) / chỉ phê hai phần đầu» bao ba khối mới; tô điểm «Hỏi-2: câu Hỏi-n
  sẵn có (khuyến nghị) / nhãn riêng trong câu duyệt».
- AC liên quan: AC-1, AC-2 (S1), AC-3, AC-4 (Cổng Phạm vi), AC-5 (Cổng Bằng chứng).
