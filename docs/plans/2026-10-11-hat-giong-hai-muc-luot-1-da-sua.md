# Hạt giống — hai mục lượt chấm 1 của cửa tín hiệu: ĐÃ SỬA, không mở lại

Gốc: `_acceptance/cua-tin-hieu-gom-nhom/` (Cổng Bằng chứng ký 11/10/2026 — Ngoài-6 và Ngoài-7, owner: mở
hợp đồng mới). Hạt giống là SỔ: tệp này tồn tại để không ai mở lại việc đã xong.

## Hai mục — đã sửa ở lượt 1

1. **Ngoài-6 — ca NEN7 đỏ vì ba mục `dieu-phoi/scripts/…` trong danh sách chép CI** (bộ đọc của chân engine
   cắt thành `scripts/x.mjs` giả). Sửa ở `dd2c1bd5` (neo bộ đọc vào gốc gói). Ca NEN7 và cả bộ
   `tests/scripts/duong-nen.test.mjs` xanh ở lượt chấm 2 và 3 (suite `scripts_mjs_*`). Phần còn lại — bốn
   tệp ngoài `scripts/`·`lib/` không được băm — là hạt giống
   `docs/plans/2026-10-11-hat-giong-kiem-lech-ban-tep-ngoai-scripts-lib.md`.
2. **Ngoài-7 — ca RT13 đỏ vì `tests/scripts/tin-hieu.test.mjs` viết cứng chữ trạng thái.** Sửa ở
   `dd2c1bd5` (rút trạng thái từ `lib/workspace-record.cjs`). RT13 xanh ở lượt chấm 2 và 3 (suite
   `plugins_vung_*`).

Ngưỡng mở ô: không — chỉ mở nếu một trong hai ca đỏ lại trên `main`.
