# Hạt giống — ba lỗ của máy tự định tuyến Ngoài-n sau lượt chấm 2

Gốc: `_acceptance/ngoai-n-tu-dinh-tuyen/` (lượt chấm 2 ngày 12/10/2026, Cổng Bằng chứng ký 12/10 — Ngoài-1,
Ngoài-4, Ngoài-5, owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: mở thành ô khi có neo ngoài — kho
tiêu thụ bật `feature_loop.ngoai_n_tu_dinh_tuyen` (crm, đợt thử ~26/10) và vấp một trong ba lỗ, hoặc TRƯỚC khi
chiến dịch phát hành bật khoá ở crm (khuyến nghị: gom một vòng nhỏ trước mốc 25/10).

## Lỗ

1. **Câu gộp thẻ làn V chứa `Ngoài-<n>:` — đá với câu signoff mới (Ngoài-1).** Câu thêm vào
   `commands/signoff.md` đọc mọi câu gộp có `Ký` hoặc `Ngoài-<n>:` trên hồ sơ máy-đi-trước theo đường ký thường.
   Nhưng `scripts/gate-card.js` dựng `one_shot` với `Ngoài-<n>: <chữ người>` cho MỌI mục (kể cả mục máy đã định
   tuyến) rồi nối `đi tiếp hay kéo lại: đi tiếp`. Dán nguyên dòng thẻ in → thành ký thường thay vì «đi tiếp»;
   sửa ô cuối thành `kéo lại: <lý do>` rồi dán cả dòng → không vào khối `GATE-ONESHOT-LAN-V`, nút dừng làn V
   không chạy.
2. **Dòng máy cũ vẫn đứng khi đề xuất của cùng mục đổi sang `new-contract` (Ngoài-4).** `keHoach`,
   `soatLech` (`scripts/dinh-tuyen-may.cjs`) và `dtmMay` (thẻ) chỉ so tiêu đề; lượt chấm sau tìm lại đúng mục
   nhưng đề xuất mở việc mới thì dòng máy «ghi Known limits» cũ vẫn làm `daDinhTuyen` coi mục đã định tuyến —
   một mục `new-contract` đi qua không hỏi người.
3. **`--soat-lech` báo «0 hồ sơ lệch» khi `--root` sai (Ngoài-5).** `soatLech` nuốt lỗi `readdirSync` và trả
   rỗng; gọi sai thư mục đọc ra y như kho sạch — đúng lớp xanh-rỗng mà ngưỡng đếm được sinh ra để tránh.

## Hướng

(1) bỏ mục đã máy định tuyến khỏi `oneParts` trên thẻ làn V, hoặc để signoff xét ô `đi tiếp hay kéo lại:`
TRƯỚC `Ngoài-<n>:`; (2) dòng máy chỉ còn hiệu lực khi đề xuất hiện tại của mục vẫn thuộc `known-limits`/`wont-fix`
và khớp `de_xuat` — một điều kiện chung cho ba bên đọc; (3) gốc không có `_acceptance/` → thoát 3 có tên.
Mỗi mục một cặp ca hai chiều trên cùng fixture, ghim đầu ra thật (khuôn AC-14 của hồ sơ gốc).

Ngưỡng mở ô: kho đầu tiên bật khoá, hoặc ≥1 lần một trong ba lỗ được quan sát ở kho tiêu thụ.
