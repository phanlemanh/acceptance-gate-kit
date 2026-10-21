# Điểm quyết định ở Cổng Phạm vi — SK1

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 · nhu cầu của loại làn trước khi hiệu chuẩn (d-20261021T001030Z-9) | 3 nhánh rẽ (không số · 15 % RAM · 16 GB), mỗi nhánh một hệ quả trên hai máy đã đo | `hoi-1-nhu-cau-truoc-hieu-chuan` |
| Vòng đời một lượt nặng: cấp → đo trong lượt → nhãn → khép → sổ đo → p95 (d-20261021T001030Z-10, d-20261021T001030Z-11) | 6 bước nối tiếp | `vong-doi-mot-luot` |
| Gỡ «cần người» theo RSS (d-20261021T000455Z-4) | dưới ngưỡng: 1 bước, 0 nhánh | — |
| Ba hằng mặc định là khoá cấu hình (d-20261021T000455Z-5) | dưới ngưỡng: 0 bước nối tiếp | — |
| Engine không đọc nhãn khi đếm trần (d-20261021T000455Z-6) | dưới ngưỡng: 1 bước | — |
| Bỏ quét độ phủ, bỏ đặc tả UX (d-20261021T000455Z-7, -8) | dưới ngưỡng: 0 | — |

## Đề bài từng hình

### hoi-1-nhu-cau-truoc-hieu-chuan
- Loại: cây quyết định ba nhánh, bảng hệ quả.
- Gốc: «Sổ đo chưa đủ 5 lượt sạch, kho chưa đặt số — cấp lượt nặng theo gì?»
- Nhánh: (A, máy khuyên) Không số — chỉ xét áp lực · (B) 15 % RAM × 1,5 · (C) 16 GB × 1,5 (M5).
- Mỗi nhánh hai ô số: MacBook Pro 36 GB, trống 16,6 GB → A cấp · B cần 8,1 GB, cấp · C cần 24 GB, CHẶN; máy M5 128 GB,
  trống 61 GB → cả ba cấp. Dòng giá: A «lượt đầu có thể bị giết, hiện ở sổ đo» · B «hằng chưa đo» · C «chặn MacBook Pro
  gần như mọi lúc».
- AC liên quan: AC-3, AC-8.

### vong-doi-mot-luot
- Loại: luồng sáu bước, một nhánh rẽ ở bước 3.
- Nút: (1) Cấp — áp lực bình thường VÀ trống ≥ nhu cầu × 1,5 (nhu cầu chưa biết → bỏ vế chỗ) · (2) Đo mỗi nhịp 5 giây —
  trống thấp nhất, áp lực cao nhất, tốc độ swapin, có làn nặng khác chồng không · (3) Nhãn «dưới tải» khi áp lực cảnh báo
  liền 2 phút (hoặc tốc độ vượt ngưỡng kho đặt) · (4) Khép — thợ nhả (mã thoát, lý do hạ tầng) hay bộ phát lịch thu hồi ·
  (5) Một dòng vào sổ đo cấp máy · (6) p95 của các dòng sạch → nhu cầu cho lần cấp sau (mũi tên quay về 1).
- Nhánh ở 4: lượt mang nhãn → «được thử lại một lần cho commit này».
- Ghi chú nhỏ: swap đã dùng và RSS lớn nhất chỉ được ghi, không chặn.
- AC liên quan: AC-1…AC-8.
