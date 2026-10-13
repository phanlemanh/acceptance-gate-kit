# Hạt giống — dòng máy mồ côi thành «lệch» vĩnh viễn

Gốc: `_acceptance/dinh-tuyen-theo-ma-muc/` — mục Ngoài-2 của lượt chấm 1 (mang sang lượt 2). Ngày 14/10 chủ kho
chọn «mở hợp đồng mới» ở Cổng Bằng chứng, và hợp đồng ghi một dòng Notes trỏ về tệp này. Hạt giống là SỔ, không
phải ô.

## Lỗ

Bộ phân giải `ganDinhTuyen` (`lib/out-of-contract.cjs`) đẩy mọi dòng sổ có mã không khớp mục nào vào `moCoi`, bất kể
sau đó có dòng mới hơn định tuyến lại mục ở vị trí ấy hay không. `keHoach` của `scripts/dinh-tuyen-may.cjs` lọc dòng
máy mồ côi thành `lech` và thoát 2; thẻ Cổng 2 (`scripts/gate-card.js`) in cờ «dòng máy trỏ mục đã đổi». Sổ chỉ ghi
nối thêm, nên dòng máy cũ không gỡ được: lượt r1 máy ghi dòng cho mục «X», lượt r2 «X» không còn mà có mục mới «Y»,
người ghi dòng có mã cho «Y» — `gan` đúng, nhưng máy định tuyến thoát 2 ở mọi lần chạy sau và không bao giờ ghi được
dòng máy cho mục mới, cờ trên thẻ không tắt.

Bản trước vòng (`docDinhTuyen`, dòng mới nhất mỗi số) gỡ được cờ bằng một dòng mới gọi tên cùng số — đây là hồi quy
so với A3 (`_acceptance/ngoai-n-tu-dinh-tuyen/`), chỉ chạm kho đã bật `feature_loop.ngoai_n_tu_dinh_tuyen`.

## Nghiệm đã nghĩ (chưa làm)

- Một dòng máy mồ côi chỉ tính là «lệch» khi KHÔNG có dòng nào mới hơn (máy hay người) định tuyến mục ở vị trí số
  mà dòng máy gọi tên — tức `moCoi` mang theo thứ tự sổ và bên gọi so với `gan`. Ca đo: sổ [dòng máy X r1, dòng người
  Y r2], mục [Y] → `dinh-tuyen-may` thoát 0 «0 mục», thẻ không cờ; chiều đỏ: bỏ phép so → thoát 2.

## Ngưỡng mở ô

≥1 kho tiêu thụ bật `feature_loop.ngoai_n_tu_dinh_tuyen` gặp cờ «dòng máy trỏ mục đã đổi» trên một hồ sơ mà mục ấy
đã có dòng sổ người mới hơn.
