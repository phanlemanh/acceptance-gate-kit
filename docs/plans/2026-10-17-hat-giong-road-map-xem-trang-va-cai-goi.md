# Hạt giống — lệnh xem đưa đường dẫn trang, Rà soát + Giờ máy lên trang, đề nghị bật road-map

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** CỘNG ×3 — mỗi mục cần chủ kho duyệt đích danh ở
Cổng Phạm vi (ADR 0018). Tách từ phần E của vòng RD1.
Gốc: `_acceptance/road-map-de-dung/` — sổ quyết định dòng «Ba việc CỘNG của phần E … tách sang vòng RD2».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Ba mục (chủ kho gợi ý qua Mac Studio 17/10)

1. **`/road-map:xem` mặc định đưa đường dẫn trang đã vẽ** (`LO-TRINH.html` của kho, hoặc trang Lộ trình trong sản phẩm khi kho
   khai — crm `/<slug>/lo-trinh`) + một dòng tóm tắt; chữ thô khi `--chu` / `--json`. Người hưởng: chủ kho đọc hình thay vì chữ
   dài trong phiên. Giá: một khoá cấu hình mới cho đường dẫn trang trong sản phẩm; lệnh đổi mặc định với mọi kho đang gọi.
2. **Khối Rà soát + Giờ máy theo mốc hiện trên trang.** Trở ngại: hai khối phụ thuộc HÔM NAY, trang phải tất định từng byte
   (`product-map --check`). Lối khả dĩ: khối dữ liệu mang đầu vào tất định, script nội tuyến tính lúc xem (tiền lệ «còn N ngày»).
3. **Road-map như feature-loop.** ADR 0025 chốt «Kho CÀI plugin road-map là kho cam kết có lộ trình … nấc bắt buộc thành lựa
   chọn của từng kho, không đổi mặc định cho mọi kho». Máy khuyên KHÔNG đổi mặc định; thay bằng: `acceptance-init` đề nghị bật khi
   kho đã khai `lo_trinh.tep`, `kiem-ban-cai --may` VÀNG khi kho khai lộ trình mà thiếu road-map. Đổi mặc định thật = ADR mới lật
   ADR 0025.

## Kho không có nhu cầu được gì, mất gì

(1) kho không trang trong sản phẩm: chỉ đổi dòng đầu của lệnh · (2) kho không lộ trình: không gì · (3) kho không lộ trình: không
gì; kho có lộ trình mà cố ý không cài road-map: thêm một dòng VÀNG mỗi lần kiểm bản cài.

## Ngưỡng mở thành ô

Chủ kho duyệt mục nào ở Cổng Phạm vi của RD1 (câu hỏi trên thẻ) → mục ấy vào vòng RD2 ngay sau mốc chứa RD1.
