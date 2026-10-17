# Hạt giống — so chữ tiêu chí cho eval khai nhiều mã, mã bọc nháy, mã có hậu tố

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/cham-lai-khong-tu-doi/ — Ngoài-1, Ngoài-3, Ngoài-10 (lượt chấm 1–2), chủ kho chọn
«mở hợp đồng mới» ở Cổng Bằng chứng 17/10. Neo ngoài: crm có 13 hồ sơ với eval khai `criterion: AC-4, AC-6`… và 14
eval mã có hậu tố (`AC-1b`, `AC-10b`).

## Hình dạng

VA1 cho mang sang chỉ khi chữ tiêu chí ở lượt gốc bằng hôm nay. `carry-plan.mjs` bóc `criterion:` bằng
`/criterion:\s*(\S+)/` rồi lọc `parseACBlock` theo id: `AC-1, AC-2` → `AC-1,`, `"AC-1"` giữ nháy, `AC-1b` không bao giờ
khớp `AC-\d+\b`. Cả hai phía cho chuỗi rỗng → «bằng nhau» → eval vẫn mang màu xanh cũ khi chữ tiêu chí đổi, im lặng —
đúng lỗi AC-2 của VA1 đi đóng, ở hình dạng kho kit chưa có. Không tệ hơn trước VA1 (trước đó không so chữ tiêu chí nào).

## Ý (chưa phải cam kết)

Bóc `criterion` thành danh sách mã bằng bộ đọc chung (tách phẩy, bỏ nháy); so chữ TỪNG mã; mã không bóc được trong
hợp đồng ở bất kỳ phía nào → «không đọc được định nghĩa» → chạy lại (chiều an toàn). Ca đỏ trên bản VA1 với ba hình
dạng của crm, ca im với eval một mã.

## Ngưỡng mở

≥ 1 lượt chấm lại ở crm sau khi nhận bản có VA1 mà một eval nhiều mã/hậu tố được mang sang khi chữ tiêu chí của nó đã
đổi — hoặc chủ kho gọi tên.
