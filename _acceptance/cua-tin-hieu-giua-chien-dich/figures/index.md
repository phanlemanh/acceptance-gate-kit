# Hình tại Cổng Phạm vi — cua-tin-hieu-giua-chien-dich

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 · ba phần CỘNG (lệnh gửi ý · dòng thẻ · cờ chặn) | dưới ngưỡng: 1 bước, 0 nhánh rẽ | — |
| Hỏi-2 · chiều mặc định của cờ chặn | 2 nhánh rẽ (mặc định không chặn / mặc định chặn) + 4 bước nối tiếp của bộ xét | `duong-di-mot-y.html` |
| Sổ: kho không cửa giữ hành vi cũ · tệp khác thân không đè | gộp vào hình trên (cùng đường đi) | `duong-di-mot-y.html` |

## Đề bài — `duong-di-mot-y`

- Loại hình: flowchart dọc, một đường chính + nhánh.
- Nút: «Thợ (trong đợt) nêu việc phụ / việc mới» và «Người gõ /road-map:gui» → «Kho có khai cửa tín hiệu?» (không → «Cần phán — như hôm nay») → «Thợ khai chặn?» (có → «Cần phán — giám sát xử ngay») → «Trùng ý trong 24 giờ?» (có → «Gộp vào ý trước») → «Ghi một tệp vào cửa tín hiệu» (tệp cùng số đã có, khác nội dung → «Cần phán — không đè») → «Trả: đã ghi, xử ở mốc khép» → «Mốc khép: thẻ khởi động in "N ý chờ gom" → gom → cắt lượt».
- Nhãn bằng chữ trên nhánh của «Thợ khai chặn?»: hộp chú thích «Câu hỏi cho chủ kho: mặc định KHÔNG chặn (máy khuyên) — thợ phải khai --chan; hay mặc định CHẶN — thợ phải khai --khong-chan».
- Người gõ /road-map:gui đi thẳng vào «Kho có khai cửa?» rồi «Ghi một tệp» (bỏ qua bước chặn).
- AC liên quan: AC-1, AC-2, AC-3, AC-4, AC-5, AC-7, AC-8.
