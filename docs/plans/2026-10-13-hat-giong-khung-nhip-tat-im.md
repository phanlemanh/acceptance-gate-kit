# Hạt giống — vòng nhịp của khung trạng thái đợt tắt im, dải giữ dữ liệu cũ

Gốc: `_acceptance/trang-thai-dot-dieu-phoi-tho/` — mục Ngoài-5 của lượt chấm 2. Ngày 13/10 chủ kho chọn «mở hợp đồng
mới» ở Cổng Bằng chứng, và hợp đồng ghi một dòng Known limits trỏ về tệp này. Hạt giống là SỔ, không phải ô.

## Lỗ

Phần mod `dieu-phoi/hooks/mod/khung.ts` làm mới dải bằng `nhip($)`: đọc CLI, cập nhật atom `khung`, rồi hẹn lần kế
bằng `$.clock.after`. Lời gọi được bỏ promise (`void nhip($)`). Ba bước nằm NGOÀI khối try của `docDot`:
`$.clock.now()`, `update($, khung, …)` và `$.clock.after(…)`. Một trong ba ném lỗi thì rejection bị nuốt, lần kế
không được hẹn, và vòng làm mới dừng hẳn. Dải vẫn vẽ bản đọc cuối như trạng thái hiện tại. Trường `luc` được ghi vào
atom nhưng cả `veDai` lẫn pane đều không đọc, nên tuổi dữ liệu không hiện ra.

Lỗ này trái chính sách Cổng Đáng của hàng DP6b, «mod chỉ vẽ, nghi ngờ thì không vẽ»: dữ liệu cũ phải hiện là cũ,
hoặc dải thôi vẽ.

## Nghiệm đã nghĩ (chưa làm)

- Bọc thân `nhip` bằng `try/finally` để lần hẹn kế luôn được đặt. Ca đo: `plugin test` cho `update` (hoặc
  `$.clock.now`) ném một lần, đẩy đồng hồ 20000 ms, rồi đếm lời gọi `process.run` thứ hai.
- `veDai` đọc tuổi `luc` so với giờ hiện tại. Quá ba chu kỳ thì dải mở đầu `CŨ <phút>′ · ` hoặc thôi vẽ. Hàm vẫn thuần,
  giờ hiện tại truyền vào như `mui_gio_phut`.

## Ngưỡng mở thành ô

Đợt đầu tiên của kho tiêu thụ chạy bản có DP6b thấy dải đứng yên khác `xem` (đối chiếu của ngưỡng SỐNG «≥ 3 lần không
lệch» đỏ), hoặc một lượt chấm sau thấy lại lỗ này ở phần mod khác.
