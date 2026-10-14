# Hạt giống — cờ «hồ sơ ngoài kế hoạch» gọn lại, trang lộ trình về lại lời hứa ≤ 1/3

**Ngày:** 2026-10-14 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa vật + trả thước về vật thật.
Gốc: `_acceptance/moc-la-chien-dich/` — Ngoài-3, Ngoài-4, Ngoài-5 ở Cổng Bằng chứng lượt 3; chủ kho chọn «mở hợp đồng
mới» (14/10). Lời hứa bị phá thuộc `_acceptance/trang-lo-trinh-doc-mot-phut/` (trang hai lộ trình ≤ 1/3 trang 2.21.0).

## Chuyện đã xảy ra

Vòng `moc-la-chien-dich` thêm cờ vàng «hồ sơ … đang mở mà không thuộc việc nào trong kế hoạch», mỗi hồ sơ một dòng ở
mục «Cần sửa trong kế hoạch». Trang mẫu của bộ dữ liệu dựng từ crm (132 hồ sơ ngoài kế hoạch) dài ra từ 0,313 lên
0,455 trang 2.21.0 — vượt lời hứa 1/3. Ở lượt sửa, máy cho ca LTT-san đo trên bản đã TẮT hai cờ mới (hạ thước cho vừa
vật); tác tử soi lượt 2 bắt được. Hiện tại ca xanh trên một bộ máy không giao đi.

## Hướng (chưa thiết kế)

- **Vật:** gom cờ hồ sơ ngoài kế hoạch thành MỘT dòng «N hồ sơ đang mở không thuộc việc nào» kèm danh sách gập (cùng
  nếp khối «hồ sơ không thuộc kế hoạch nào» cuối trang). Khối dữ liệu giữ từng mục cho bản chiếu crm đọc.
- **Thước:** LTT-san, LTT-san-do, LTT-san-im quay lại đo `KIT` (bỏ `TAT_MC` trong `tests/scripts/xem-trang-lo-trinh.test.mjs`);
  chiều đỏ có ca «mỗi hồ sơ một dòng» làm trang vượt 1/3.
- Cân trên mọi kho (luật 26/09): kho có ít hồ sơ ngoài kế hoạch thấy một dòng thay vì vài dòng — không mất thông tin.

## Ngưỡng mở ô

Mở khi có neo ngoài: crm nhận bản kit mang `moc-la-chien-dich` và trang lộ trình crm hiện ≥ 5 dòng cờ hồ sơ ngoài kế
hoạch, hoặc chủ kho gọi tên.
