# Hạt giống — danh sách chép CI của tầng tri thức thiếu khuôn ô cơ hội

Gốc: `_acceptance/release-2-34-0/` — Ngoài-1 của lượt chấm 1 (25/10), chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng.
Ô ghi hạt giống này: `_acceptance/release-2-34-0/` (hồ sơ mốc 2.34.0 trích lại tên tệp ở `## Notes`).

## Người dùng gặp gì

Kho tiêu thụ chép lớp CI đúng danh sách `INIT-CI-COPY-LIST` và khai `tri_thuc` thì gặp lỗi thiếu tệp khi tra tri thức
theo tên hồ sơ (`tri-thuc.mjs --tra --slug`) hoặc khi hiện thẻ Cổng Phạm vi: người dùng không tra được tri thức ở kho
đó cho tới khi chép thêm tệp. Cùng lớp với khuôn tri thức mà PR mốc 2.34.0 đã thêm vào danh sách (crm #565) — mốc sửa
một trường hợp, bỏ sót trường hợp thứ hai.

## Đọc mã (kit, nhánh `phat-hanh/2.34.0` 97563a56)

- `scripts/tri-thuc-nguon.cjs:10-11,27` — `napKhuonNguon()` đọc CẢ `references/opportunity-template.md` lẫn
  `references/tri-thuc-template.md` trong giá trị mặc định của tham số.
- Gọi từ lối `--tra` của `tri-thuc.mjs` (khi có slug) và từ `theCong1` / `xetCanCu` của `tri-thuc-tra.cjs`.
- `skills/acceptance/references/opportunity-template.md` không có trong khối `INIT-CI-COPY-LIST` (đã biết từ trước:
  `product-map.mjs` cũng đọc nó — GUIDE §5.3 tự khai thiếu).
- Ca CT3 của `tests/scripts/chep-tri-thuc-du.test.mjs` chỉ chạy `--kiem`, không chạy lối `--tra` hay thẻ Cổng 1, nên
  không bắt được.

Hai kho đang chờ nhận 2.34.0 không vấp: crm đã chép sẵn tệp (PR crm #565), ghi chú nhận cho invest dặn chép nó.

## Ngưỡng mở ô

≥ 1 kho tiêu thụ báo lỗi thiếu `opportunity-template.md` khi tra tri thức hay dựng thẻ, hoặc ngay khi mở bản vá kế của
2.34.x (sửa rẻ: một dòng danh sách chép + một ca chạy lối `--tra` trên kho dựng từ danh sách).
