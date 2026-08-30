# Đo-thước-của-thước sâu hơn MỘT tầng — PARK 30/08 («cắt đuôi, giữ lõi»)

**Quyết định:** owner, 30/08, sau rà soát North Star toàn cục. Hai vòng meta
cuối cùng trước 2.5.0 đều dừng:

- `khuon-rang-dung-chung` — park tại dừng-vá S4-r2. Kho: nhánh
  `feat/khuon-rang-dung-chung` (đã push, dừng ở hồ sơ REJECT r2). Thư viện
  `scripts/rang-khuon.sh` + lưới + bộ răng viết lại xanh cục bộ nhưng hai vòng
  S4 liên tiếp trả về ba lớp lỗi cũ ở chỗ mới trong chính bộ đo — bằng chứng
  thực nghiệm cho tiên đề «một trí tưởng tượng viết cả vật lẫn thước»: mã-đo
  không hội tụ về 0 phát hiện, cơ khí hoá thêm tầng chỉ đẩy lỗi xuống tầng dưới.
- `baseline-127-tin-hieu-phan-biet` — park trước khi mở vòng, cùng căn cứ.

**Giới hạn thay thế** (CLAUDE.md, mục «Giới hạn CHIỀU RỘNG»): bộ đo được máy
kiểm MỘT tầng — lưới thường trực là trần; tầng sâu hơn là giới-hạn-đã-khai.

**Ngưỡng mở lại (đang đếm):** ≥2 lượt chấm sai do phép-đo-tự-dối trên vòng
SẢN PHẨM giữa hai release. Dưới ngưỡng đó, mọi phát hiện thuộc lớp này chỉ
ghi sổ, không mở vòng.

## Prior requests

- 29/08: đề bài «4 luật hội tụ» → điều tra, thu về 1 ô (cham-dung-cay, đã ship).
- 30/08: ô khuon-rang-dung-chung ký build → 2 vòng S4 → dừng-vá → park.
- Ai muốn mở lại lớp này: đọc hồ sơ S4-r2 trên nhánh kho TRƯỚC, và phải chỉ
  ra ngưỡng mở lại đã chạm — không mở lại vì «tìm thấy thêm lỗi trong mã-đo»
  (điều đó luôn đúng, không phân biệt được gì).
