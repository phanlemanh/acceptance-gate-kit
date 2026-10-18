<!-- NHÁP mục CHANGELOG của mốc 2.33.0 — dựng sẵn 18/10, chuyển nguyên khối vào đầu CHANGELOG.md lúc cắt (cùng commit nâng số).
     K-A (ho-so-da-ky-giu-tuoi) vào mốc thì thêm một tiểu mục cho nó và sửa câu «Có một hồ sơ được ký». -->
## 2.33.0 — <ngày cắt>

Lộ trình đọc được trong một phút. Có **một hồ sơ được ký** — tập đối chiếu bằng `scripts/rel-cua-so.sh` (AC-4 của hồ sơ
mốc): `road-map-de-dung` (RD1, #381). Kho chờ nhận: `crm`. Bốn gói `acceptance-gate`, `feature-loop`, `dieu-phoi`,
`road-map` cùng lên `2.33.0` (chỉ `acceptance-gate` đổi vật; `dieu-phoi`, `road-map` chỉ đổi số); `diagram-design` giữ
`2.7.1`. Tag `v2.33.0` gắn vào commit gộp PR mốc.

**Vì sao 2.33.0** (minor): thêm năm khoá vào khối dữ liệu trang (chỉ thêm — bản 2 giữ), năm cờ có tên của bộ đọc chung
và luật cắt lượt mới (ADR 0026); không gãy đường đọc-cũ.

### Road-map dễ dùng (hồ sơ `road-map-de-dung`, hàng RD1, T2)

- **Bỏ mốc ngoài** (ADR 0026): việc của người không còn là mốc. Skill cắt lượt xếp mỗi mục vào một trong năm loại
  (phát triển · sự kiện tạo hạn · đo giá trị · vận hành thuần · việc cần kết quả vận hành); việc vận hành ra khỏi kho,
  liệt dưới «Ra khỏi kho» ở mô tả PR. Skill quyết `han` hay `han-cung`, mã vận hành không vào phạm vi của hàng tự phục vụ.
- **Luật «chỉ việc phát triển» ở mọi lần đọc tệp** — trang, bản xem chữ, thẻ khởi động: năm cờ có tên
  (`moc-ngoai-da-bo`, `moc-chua-khai-loai`, `dung-tren-moc`, `du-lieu-sai-gia-tri`, `thieu-hang-sinh-gia`).
- **Khối Mốc đọc bằng tên:** mỗi việc hiện bằng câu giao đầy đủ, mã đứng sau; mốc chỉ hiện khi có việc; việc thuộc mốc
  đầu tiên (theo ngày) liệt nó. Trang crm và trang của phiên đọc **một mô hình hiển thị** trong khối dữ liệu: năm khoá
  `hang[].ten_hien_thi`, `moc[].hien`, `moc[].viec_hien`, `moc[].con_lai`, `chua_hen_moc`.
- **Rà soát** nhắc mốc đã qua ngày chưa khép (một dòng gom) và việc chưa có tên ngắn (chỉ ở kho đã dùng tên ngắn; không
  lên trang).
- **Giờ máy nối tiếp theo làn:** mỗi lộ trình một làn, xếp theo phụ thuộc trước, ngày sau; nhãn «máy chạy 24/24 — chưa
  đo nhịp ngày». Trần độ dài trang 0,4 so với trang 2.21.0 cùng kho (chủ kho chốt 17/10).
- **Giới hạn đã khai:** 16 mục ở Notes hợp đồng — đáng nhớ nhất: ba mốc mà mốc gần hạn chờ mốc xa hạn có thể báo «quá
  tải» sai (Ngoài-3); một việc liệt ở nhiều mốc bị cộng giờ máy nhiều lần (Ngoài-9).
- **Hạ tầng lượt chấm:** bộ ca điều phối không nằm trong bộ ca của lượt chấm — chỉ CI chạy (hạt giống
  `docs/plans/2026-10-18-hat-giong-bo-ca-dieu-phoi-ngoai-luot-cham.md`).

**Đường đọc-cũ:** khối dữ liệu giữ bản 2, năm khoá mới chỉ thêm; bộ đọc gặp trang cũ thiếu khoá thì cờ vàng «khối chưa
mang mô hình hiển thị — vẽ lại bằng bộ kit mới». Lộ trình cắt trước luật 17/10 hiện cờ vàng có tên; không có đường đọc
riêng cho mốc ngoài cũ — cắt lại bằng skill mới là hết.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI:** chép lại từ thẻ `v2.33.0` ba tệp: `scripts/lo-trinh.mjs`, `scripts/gio-may.mjs`, `scripts/cat-luot.mjs`
  (RD1). Ba tệp chép CÙNG MỘT commit; hai mươi lăm tệp còn lại giống từng byte `v2.32.1`.
- **Máy dev: cài các gói theo ĐÚNG THẺ `v2.33.0` ở MỌI phạm vi**, rồi kiểm `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs
  --may --ref v2.33.0 --root <bản clone kit đã git fetch --tags>` — `TỔNG KẾT: ĐẠT …`.
- **crm, theo thứ tự:** (1) vẽ lại `LO-TRINH.html` trong PR nâng kit; (2) lộ trình còn mốc ngoài hay mốc chưa khai loại
  thì cắt lại bằng skill cắt lượt mới (onehub b22c0a329 đã sạch: 0 cờ ở OKR và việc dự án; kho tài liệu thêm một dòng Rà
  soát «9 việc chưa có tên ngắn»); (3) trang Lộ trình trong sản phẩm đọc năm khoá mô hình hiển thị thay vì tự lọc, kèm
  một ca đối chiếu trang với tập hiển thị của khối.

**Năm dòng số (luật (c)) — điền lúc cắt:** thời gian làm-xong→quyết-được · lượt gọi người (trong / ngoài thiết kế, số
chạm) · vòng bị hạ tầng đốt lượt chấm (RD1: 1 — lượt 2 REJECT vì P179) · token máy/vòng (RD1 quy đổi theo dòng giờ máy:
48,4 · 57,7 · 86,3) · phút máy/lượt chấm (RD1: ~47 · ~46 · ~46; ghim lại sau chữ ký 39,4).

**Người cắt mốc kit:** sau khi gắn thẻ chạy `node scripts/kiem-ban-cai.mjs --ref v2.33.0` (KC1).
