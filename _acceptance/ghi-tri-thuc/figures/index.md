# Hình tại điểm quyết định — ghi-tri-thuc (Cổng Phạm vi)

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 — máy không hỏi được GitHub nơi giữ raw có riêng tư không (d-11) | 2 nhánh rẽ (chặn · cảnh báo rồi ghi) sau 3 bước kiểm | `hoi-1-rieng-tu.html` / `.png` |
| P0 gap-probe hỏi gh bất kể lời khai (d-12) — đã sửa, không chờ người | dưới ngưỡng: 0 nhánh chờ người | — |

## Đề bài `hoi-1-rieng-tu`

- Loại hình: luồng quyết định (flowchart), trái → phải.
- Nút: «Lệnh ghi tri thức» → «Kho khai công khai mà chưa có kho riêng?» (có → «Dừng, hỏi người: tạo kho riêng» mã 4) → «Nơi giữ raw có remote GitHub?» (không → «Ghi, commit cục bộ») → «Hỏi GitHub độ riêng tư» → ba nhánh: «Riêng tư → ghi» · «Công khai → dừng, không ghi» · «Không hỏi được (thiếu gh, mất mạng)» → Hỏi-1: lối A «Chặn, không ghi (máy khuyên)» · lối B «Cảnh báo rồi ghi — lần đẩy sau có thể lộ».
- Nhãn bằng chữ tiếng Việt; tô nổi ô Hỏi-1 và hai lối của nó.
- AC liên quan: AC-7, AC-8.
