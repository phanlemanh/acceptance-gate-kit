# Hạt giống — bốn lỗ của bàn giao tài khoản sau DP4

Gốc: `_acceptance/dieu-phoi-doi-tai-khoan/` (lượt chấm 1 ngày 11/10/2026, Cổng Bằng chứng ký 11/10 — Ngoài-1,
Ngoài-2, Ngoài-3, Ngoài-11 trong `review-findings.md`, owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ
mở thành ô khi có neo ngoài (ngưỡng ở cuối).

## Lỗ

1. **Thẻ khởi tạo hỏi khẩu vị hạn mức mà không có đường ghi câu trả lời (Ngoài-1, nặng).** `theKhoiTao`
   (`dieu-phoi/scripts/the.mjs`) thêm `khau-vi-han-muc` vào `hoi` kèm bốn số của đợt, nhưng `mo-dot.md` không dặn
   hỏi nó, không lệnh con nào ghi số người chọn vào cấu hình đợt (`pha dang-chay` chỉ nhận `--tu-merge`), và luật
   đợt cấm ghi tay vào thư mục đợt. Chủ kho trả «70 · 85» thì đợt vẫn chạy 80 · 90 — câu hỏi chỉ có một lối ra,
   tức trạm thu phí.
2. **Lịch 30′ của `mo-dot` không đọc hạn mức, không đánh thức (Ngoài-2).** `mo-dot.md` bước 6 dựng lịch chỉ đọc
   `trang-thai.json`; việc của lịch theo DP3/DP4 (`get_usage` → `han-muc --nguon get-usage` → `danh-thuc`) chỉ có
   ở `tiep-tuc.md`, mà `tiep-tuc` chỉ dựng lịch khi chưa có. Đợt mở bằng `mo-dot` không có nhịp đọc mức dùng của
   lịch và không ai đánh thức giám sát; GUIDE §6.6 và README gói mô tả nhiều hơn thực tế.
3. **`tiep-tuc` khuyên chờ mà vẫn mở chip thợ (Ngoài-3).** Khi CLI trả `khuyen_cho` (tài khoản mới đã quá ngưỡng
   báo trước), thân lệnh dặn «đi tiếp bước 3», rồi bước 4 mở chip cho mọi dãy `mo-chip` — thợ chạy dưới chính tài
   khoản đang cạn; `chan-doan` lại xếp hai pha ★ vào «đủ» nên bước 5 báo «đợt chạy lại».
4. **Lưới cuối bỏ qua vĩnh viễn phiên cũ đã được nhắn tiếp tục (Ngoài-11).** `hook-het-han-muc` và `dauHieuLuc`
   loại mọi phiên trong `phien_da_biet` không xét thời gian; `tiep-tuc.md` lại dặn nhắn phiên cũ «tiếp tục» khi
   không đổi tài khoản. Phiên sống lại ấy chết vì hạn mức lần nữa thì không commit WIP, không dấu, bộ phát lịch
   không có tín hiệu.

## Hướng

(1) thêm cờ ghi ngưỡng ở `pha dang-chay` kèm dòng trong `mo-dot.md`, hoặc bỏ câu hỏi khỏi `hoi` (TRỪ, rẻ hơn);
(2) `mo-dot` dựng lịch bằng đúng khuôn việc lịch của `tiep-tuc`, hoặc `tiep-tuc` thay lịch cũ; (3) có `khuyen_cho`
hoặc đợt còn ở pha ★ thì bỏ bước mở chip, `chan-doan` báo «thiếu» kèm `/dieu-phoi:tiep-tuc`; (4) bộ lọc phiên đã
biết so thêm thời điểm — nhịp sau `tiep_tuc_luc` là phiên sống lại. Mỗi lỗ một cặp ca hai chiều trên cùng fixture.

Ngưỡng mở ô: ≥1 đợt thử thật (crm ~26/10, hay lần đổi tài khoản chủ động DP0 trên M5) vấp một trong bốn lỗ, có
sự kiện trong `su-kien.jsonl` hoặc dòng Nhật ký của đợt làm neo.
