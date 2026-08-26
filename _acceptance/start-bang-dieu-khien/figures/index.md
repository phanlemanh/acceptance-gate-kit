# Điểm quyết định — kê và đếm ngưỡng N5

Máy kê từ artifact cuối S1 (sổ quyết định chờ seal · chỗ design lệch kế hoạch
gốc · dòng `[GIẢ ĐỊNH]` trong Coverage · finding gap-probe xử lý `human-gate1`).
Không kê AC/GWT từng dòng — AC là bằng chứng của quyết định, không phải quyết định.

Ngưỡng N5: từ **ba bước nối tiếp** hoặc từ **hai nhánh rẽ** → cần hình.

| Điểm | Đếm | Hình |
|---|---|---|
| Đ1 · Bảng trạng-thái→chữ đặt ở `scripts/` chứ không `lib/` (d-…-27499) | 2 nhánh rẽ, mỗi nhánh 3 bước nối tiếp | **H1** |
| Đ2 · `gate-card.js` chạy `start-scan.mjs` thay vì dựng lại vị từ (d-…-29818) | 2 nhánh rẽ | gộp vào **H1** — cùng một cây quyết định «đặt luật ở đâu» |
| Đ3 · KHÔNG chữa ca C6, nhận known-limit có tên (d-…-1428) | 2 nhánh rẽ | gộp vào **H1** — nhánh này chính là hệ quả của Đ1 |
| Đ4 · Bốn bộ đọc nói cùng một chữ cho 17 trạng thái (AC-7, AC-8) | 4 bộ đọc × 17 trạng thái, 3 ca lệch đã xác nhận | **H2** |
| Đ5 · KHÔNG xếp hạng ý «đang cân nhắc» trong vòng này (d-…-23110) | dưới ngưỡng: 1 nhánh (hiện hết), lối kia đã chặn bằng luật «thước khai trước» | — |
| Đ6 · Năm eval đi bằng răng hồ sơ, không vào suite vĩnh viễn (d-…-10755) | dưới ngưỡng: 2 nhánh nhưng cùng một tiêu chí đã có tiền lệ trong repo | — |
| Đ7 · TRỪ §9.1 — không cắm skill hội thoại vào Vòng HIỂU | dưới ngưỡng: quyết định đã ký ở Cổng Đáng, đây là thi hành | — |
| Đ8 · gap-probe: 0 finding xử lý `human-gate1` | không có điểm nào | — |
| Đ9 · Coverage: 0 dòng `[GIẢ ĐỊNH]` | không có điểm nào | — |

**2 điểm vượt ngưỡng → 2 hình. 5 điểm dưới ngưỡng, nêu đúng số đếm trên tin mời cổng.**

## Đề bài H1 — «Đặt bảng chữ ở đâu, và cái giá của mỗi lối»

- Loại hình: cây quyết định hai nhánh, mỗi nhánh kéo tới hệ quả cuối.
- Nút: `Bảng trạng-thái→chữ đặt ở đâu?` → nhánh **`lib/`** (khớp gợi ý audit
  §6) → `lib/** ∈ t3_paths` → `ô thành T3` → `+ Gate 1.5` và `+ chữ ký bắt
  buộc ở Cổng Bằng chứng` = **2 lượt gọi người thêm**, đổi lại `chữa được ca
  C6`. Nhánh **`scripts/`** (đã chọn) → `ô giữ T2` → `0 lượt gọi người thêm`,
  đổi lại `C6 thành known-limit có tên`. Nút phụ trên nhánh đã chọn:
  `gate-card hỏi máy quét` (không dựng vị từ thứ ba).
- Nhãn bằng chữ, không mã máy trần. Đánh dấu rõ nhánh ĐÃ CHỌN.
- AC liên quan: AC-7, AC-8.

## Đề bài H2 — «Bốn bộ đọc, một sự thật: chỗ đang lệch»

- Loại hình: ma trận / bảng nhiệt — hàng = trạng thái hồ sơ, cột = bốn bộ đọc.
- Chỉ lấy **6 hàng có ý nghĩa cho owner**, không vẽ cả 17: ô đã điền ngưỡng
  (C1) · `implemented` (C8) · `verified` xanh-sạch cửa veto mở (C2) ·
  `verified` xanh-sạch người duyệt Cổng 1 (C2) · `signed-off` đường A chưa
  nghiệm thu (C4) · hồ sơ đọc không được (C6).
- Cột: thẻ `/start` · thẻ cổng · bảng trạng thái · bản đồ. Ô tô đậm = hai bộ
  đọc nói khác chữ hôm nay. Một chú thích nói rõ hàng C6 **cố ý không chữa**
  trong vòng này.
- Nhãn bằng chữ mặt người, không tên khoá trần.
- AC liên quan: AC-7, AC-8, AC-12.
