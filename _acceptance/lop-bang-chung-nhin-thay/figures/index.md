# Hình tại điểm quyết định — lop-bang-chung-nhin-thay (Cổng 1, T3)

Kê từ artifact cuối S1 (entry sổ chờ seal + finding gap-probe human-gate1, nếu có).

| Điểm | Đếm | Hình |
|---|---|---|
| D1 — neo máy W8: `executor: ui-check` hay nhãn `layer: ui-observed` | 2 nhánh rẽ | cần hình → gộp vào `luong-w8` |
| D2 — nghĩa vụ theo hợp đồng hay theo AC (owner chốt 08/09) | 2 nhánh, đã chốt | thể hiện nhánh đã chọn trong `luong-w8` |
| D3 — tầng pre-merge: NOTE (ngưỡng đếm) hay VIOLATION | 2 nhánh rẽ | gộp vào `luong-w8` |
| D5 — descope `bỏ ui-observed — ` trước seal (thẻ Cổng 1) / sau seal (khối CHƯA duyệt Cổng 2) | 2 lối | gộp vào `luong-w8` |
| Descope: không đưa frame design-pass lên Cổng 2 | 1 bước (không làm) | dưới ngưỡng: 1 |
| Descope: bỏ đặc-tả-UX (không chạm UI) | 1 bước | dưới ngưỡng: 1 |

## Đề bài hình `luong-w8` (flowchart, ≤5 dòng)

- Loại: flowchart quyết định, một hình cho cả vòng đời W8.
- Nút: `hợp đồng surfaces` → «mặt người nhìn?» (alias web/web-ui → ui; mobile → KHÔNG) → «∃ eval executor ui-check?» (nhãn `layer: ui-observed` = khai, răng lạc chỗ nếu đặt trên test/script) → có: xanh · không: «entry `bỏ ui-observed — `?» → có: finfo (Cổng 1) / khối CHƯA duyệt (Cổng 2 nếu sau seal) · không: W8 lint + cờ vàng Cổng 1 + NOTE pre-merge → «ngưỡng: 2 hợp đồng/mốc» → VIOLATION (Later).
- Nhãn bằng chữ tiếng sản phẩm, không mã; AC liên quan: AC-1 (alias), AC-2 (lint), AC-3/AC-4 (thẻ), AC-5 (NOTE + ngưỡng).
- Ghi chú một dòng dưới hình: «hook đã giữ frame + observed trên mọi ui-check — neo máy là executor».
