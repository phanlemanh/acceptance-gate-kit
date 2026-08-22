# Hạt giống — bản đồ DÍNH commit chữ ký, không đi sau

*Trạng thái: sống ở `_acceptance/ban-do-dinh-chu-ky/opportunity.md`. Sinh 15/08 từ một lỗi LẶP ×2 trong
cùng một phiên (PR #49 và PR #51, cùng hình dạng, cùng người dẫm).*

## Lỗi lặp

Commit chữ ký Cổng Bằng chứng đổi trạng thái hồ sơ (`verified → signed-off`)
→ bản đồ sản phẩm lệch với hồ sơ xưởng → CI đỏ ở P122/P126 → vá bằng một
commit «vẽ lại bản đồ» đi SAU. Hai PR liên tiếp trong một ngày dẫm y hệt.

Nguyên nhân không phải quên-một-lần: **đường ký THỦ CÔNG không có bước vẽ
lại bản đồ.** Lệnh `/approve` và `/signoff` có bước này (bản đồ được commit
CÙNG commit chữ ký — chính là lý do `PRODUCT-MAP.md` nằm trong
`t1_skip_globs`, xem ADR 0007); nhưng khi một phiên agent làm thay lệnh
(hồ sơ tự-host, chữ ký ghi qua file-edit), bước ấy không ai giữ.

## Ý định

Bản đồ phải **dính** vào chính lượt ghi trạng-thái-hồ-sơ, không phụ thuộc
đường đi (lệnh hay tay). Hai ứng viên, chọn tại Cổng 0:

- **(a) Chốt ở biên đẩy** — một chân trong lưới trước-merge: bản đồ lệch với
  hồ sơ xưởng = VIOLATION ngay tại máy người đẩy (hiện chỉ CI bắt, tức phải
  chờ một vòng đỏ mới biết). Rẻ nhất, không thêm nghi thức; nhưng vẫn là
  bắt-sau, chỉ sớm hơn CI.
- **(b) Luật văn bản cho đường tay** — mọi chỉ dẫn ghi `status:` của hồ sơ
  (skill acceptance các bước 4b/5, nghi thức ký) thêm đúng một câu «vẽ lại
  bản đồ trong CÙNG lượt commit»; đo bằng hội đồng như 1c. Đúng gốc hơn
  nhưng là lời hứa hành vi — đắt đo hơn.

Khuyến nghị khi mở hồ sơ: làm (a) trước — nó là mã tiền định, một chân
trong lưới sẵn có, chiều đỏ rõ; (b) chỉ mở nếu (a) vẫn để lọt lần thứ ba.

## Ràng buộc

- KHÔNG gỡ `PRODUCT-MAP.md` khỏi `t1_skip_globs` (ADR 0007 — gỡ là chính
  commit chữ ký tự làm bằng chứng stale, vòng không thoát).
- Chân mới nếu thêm vào lưới trước-merge sẽ chạm đúng cặp guard
  `DV5`×`RL7a1` — đi cửa miễn trừ đích danh như đợt 2 đã đi, khai trước.
