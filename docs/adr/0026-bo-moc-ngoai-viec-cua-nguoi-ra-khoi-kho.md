# ADR 0026 — Bỏ mốc ngoài: việc của người ra khỏi lộ trình

2026-10-17 · TRỪ, chủ kho (Manh Phan) quyết «bỏ mốc ngoài» và chốt chi tiết ở Cổng Phạm vi của vòng `road-map-de-dung`.
**Thay** vế «việc vận hành của người → mốc ngoài» của luật S3b (11/10, hồ sơ `lo-trinh-chi-viec-phat-trien`). **Vì sao:** mốc
ngoài đặt lời khai máy không kiểm được (người đã làm việc X chưa) cạnh sự thật của kho (vòng đã giao chưa), làm nhiễu ranh giới
giữa việc người và việc máy — đo 17/10: 17/28 mốc của lộ trình OKR crm là mốc ngoài, 18/18 mốc ngoài của crm không gắn việc nào.
**Quyết định:** việc của người không thành mục nào trên lộ trình; bốn chỗ đến — sự kiện tạo hạn → ngày của chính mốc phát triển
bị ràng buộc · đo giá trị → ngưỡng và ngày đọc trong ô cơ hội, kết quả ghi bằng lệnh `observed` (ADR 0020) · vận hành thuần →
ra khỏi kho: không chép vào bản phạm vi, liệt «Ra khỏi kho» ở mô tả PR cắt lượt · việc cần kết quả của việc ấy → Chờ điều kiện
kèm `mo_lai_khi`. Bảng phủ còn hai chỗ (hàng · Chờ điều kiện); răng cắt lượt báo lỗi `moc-ngoai-da-bo` khi một mốc ngoài lọt
lượt cắt. Lộ trình đã cắt trước luật này là đồ cũ — kho cắt lại bằng skill mới (chủ kho: «đáng lẽ phải cắt lộ trình bằng chính
skill và luật mới là xong»); kit không dựng đường đọc riêng, mốc ngoài cũ hiện như mọi mốc (khi có việc gắn) kèm cờ của bộ đọc
chung. **Đánh đổi:** mất chỗ chung xem ngày của người — ngày công bố, buổi nghiệm thu, hạn của ban lãnh đạo sống ở lịch của chủ
kho, không trên trang lộ trình; và răng không bắt được việc vận hành bị quên — danh sách «Ra khỏi kho» là lời khai, chỗ dạy đúng
là SKILL cắt lượt. **Đường đảo:** hoàn lại PR của vòng; kho tiêu thụ giữ bản kit cũ tới khi nhận mốc.
