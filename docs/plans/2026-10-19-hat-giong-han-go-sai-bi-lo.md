# Hạt giống — hạn nhận / hạn xong gõ sai vẫn được nhận rồi bị lờ đi trong im lặng

Gốc: acceptance-gate-kit/_acceptance/vong-mo-co-chu-giu/ — `review-findings.md` lượt chấm 2, mục Ngoài-5
(tệp `dieu-phoi/scripts/tin.mjs`, severity medium). Chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 2026-10-19; theo
luật kho, lối ấy ghi hạt giống này, KHÔNG tạo ô. Ô gốc `_acceptance/vong-mo-co-chu-giu/` trích lại tệp này ở `## Notes`
của hợp đồng.

## Người dùng gặp gì

Người giao gõ `--han` hay `--han-xong` sai (số lẻ, chữ, số âm) vẫn được báo thành công, nhưng máy lặng lẽ tính theo hạn
mặc định 30 phút hoặc coi như không có hạn. Người giao tưởng đã đặt hạn riêng, không có cảnh báo nào.

## Vì sao không vá trong vòng GT1

Bên viết nhận một miền rộng hơn khuôn bên đọc (chỉ số nguyên dương), và không tiêu chí nào của vòng đo giá trị sai của
hạn. Nghiệm rẻ: kiểm số nguyên dương trước khi ghi, sai thì thoát 1 không ghi byte nào — kèm ca round-trip bên viết →
bên đọc trên biên.

## Ngưỡng mở ô

≥ 1 lời giao trên đợt hay kênh thật mang dòng hạn mà bộ đọc không đọc được (đếm bằng `tin so --json`, hạn khác giá trị
người gõ).
