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
3. **Bật road-map đúng lúc kho cam kết lộ trình.** Chủ kho chốt 17/10 (sau năm rủi ro của cài mặc định: kho trống sinh đồ lộ
   trình + 4 tệp chép CI, cờ «không thuộc việc nào» nhiễu ở mọi hồ sơ, thêm bản ghi cài dễ lệch, khó đảo vì mỗi kho một PR, sát
   luật chặn): lượt cắt đầu tiên của một kho (hoặc bước khởi tạo thấy kho đã khai `lo_trinh.tep`) thêm `road-map` vào
   `enabledPlugins` trong CÙNG PR cắt lượt — người gộp PR chốt; `kiem-ban-cai --may` VÀNG khi kho khai lộ trình mà thiếu
   road-map. Không đổi mặc định; ADR 0025 giữ, bổ sung điểm bật. Lối không chọn: dời cắt lượt + gom tín hiệu sang gói road-map.

**Trạng thái duyệt:** chủ kho duyệt trước cả ba mục ở Cổng Phạm vi của RD1 (17/10) — sổ `_acceptance/road-map-de-dung/decisions.jsonl`
dòng gate1 «Ba việc CỘNG của phần E sang vòng RD2». Ô RD2 mở sau mốc chứa RD1.

## Kho không có nhu cầu được gì, mất gì

(1) kho không trang trong sản phẩm: chỉ đổi dòng đầu của lệnh · (2) kho không lộ trình: không gì · (3) kho không lộ trình: không
gì; kho có lộ trình mà cố ý không cài road-map: thêm một dòng VÀNG mỗi lần kiểm bản cài.

## Ngưỡng mở thành ô

Chủ kho duyệt mục nào ở Cổng Phạm vi của RD1 (câu hỏi trên thẻ) → mục ấy vào vòng RD2 ngay sau mốc chứa RD1.
