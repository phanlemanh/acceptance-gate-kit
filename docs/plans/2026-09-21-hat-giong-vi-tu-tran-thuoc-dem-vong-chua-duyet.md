# Hạt giống — Đổi vị từ của trần thước: một cổng luôn được miễn không còn là cổng

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3
(vị từ của trần — chạm đường quyết định của `s4-args`).
Gốc: crm/_acceptance/thuoc-khai-dung-tieng — K5 + §4.2 của
`crm:docs/findings/2026-09-20-retro-hang-muc-khai-dung-tieng.md`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ

`TRAN_NHAT = 3`. Trong một hạng mục, nó **nổ 5 lần và được miễn 5 lần** (`thuoc-` 4, `ho-so-` 1).
Lần cuối bộ đếm ghi **44 nhát** — và 44 nhát ấy chính là sản phẩm của một vòng **đã qua Cổng 1,
Cổng 2 và chữ ký**.

Vị từ hiện tại — «commit chạm thước mà không chạm vật» — là **proxy sai** cho thứ nó muốn bắt là
«đang trôi». Với một vòng sửa thước đã được duyệt, proxy ấy **luôn** báo động. Một cổng mà câu
trả lời hợp lý duy nhất là «miễn» đã tụt xuống thành trạm thu phí: 5 lượt gọi người, 0 quyết
định thật.

## Việc

Đổi vị từ sang thứ nó thật sự muốn đếm. Hai lối, chọn một:

- đếm **vòng chấm chưa duyệt** (số lượt S4 kể từ chữ ký gần nhất) thay vì đếm commit; hoặc
- giữ cách đếm commit nhưng **miễn trừ commit thuộc một vòng đã ký** — khả thi ngay khi K1
  (`2026-09-21-hat-giong-tach-instrument-sha-khoi-verified-commit.md`) tách xong hai sha.

Phép thử của chính luật kit, áp cho bản mới: «người trả lời khác khuyến nghị thì dựa vào điều gì
máy không có?» — nếu vẫn không có gì, vị từ mới vẫn là trạm thu phí.

## Ngưỡng mở ô

Ngưỡng đo ĐÃ đạt ở kho tiêu thụ: 5 lần nổ / 5 lần miễn trên một hạng mục. Trên kit chưa đếm.
Mở khi owner gọi tên — T3 vì nó chạm đường quyết định, và một trần đổi vị từ sai sẽ tắt đúng cái
phanh đã cứu hạng mục này một lần (§5: trần thước đã làm đúng việc một lần, nó buộc mở vòng
`thuoc-`).
