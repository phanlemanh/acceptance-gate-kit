# Lệnh chờ khoá của thợ chạy được khi đường dẫn có dấu cách

Ngày: 2026-11-10 · Hồ sơ: `lenh-cho-khoa-nhay-duong-dan` · Hạng: T2

## Vì sao làm

`xin <loại>` in cho thợ một dòng «chờ (chạy nền)», và luật thợ của đợt (`dieu-phoi/scripts/mau/LUAT.md`) buộc thợ chạy
đúng dòng đó, không tự ghép đường khoá. `lenhChoKhoa` ở `dieu-phoi/scripts/lich.mjs` ghép đường khoá trần vào lệnh shell.
Kho nằm dưới thư mục có dấu cách thì `jq` nhận sai đối số, `>/dev/null 2>&1` nuốt lỗi, vòng `until` chạy mãi: thợ đứng
chờ một lượt đã được cấp mà không có lỗi nào hiện ra.

Đã đo trước vòng: cùng một tệp `chu.json` trong thư mục có dấu cách, dạng không nháy cho mã 2, dạng có nháy cho mã 0.
Lỗi đã khai ở Ngoài-2 của hồ sơ `sua-loi-dau-chu-dong-vao` (ghi Known limits 03/11); lượt chấm hồ sơ
`t3-can-ho-so-arm` gặp lại và chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 10/11 (Ngoài-17, Ngoài-19).

## Mục tiêu

- Dòng lệnh chờ thoát được, ngay khi khoá về đúng dãy, với mọi thư mục đợt người dùng có thể có.
- Đường dẫn an toàn in y như cũ: không thêm nháy thừa, để ca cũ và thói đọc của người không đổi.
- Luật nháy sống ở một chỗ.

## Không làm

- Không đổi cách chờ (`until … sleep 15`), không thêm trần thời gian (thợ chờ lâu bao nhiêu tuỳ hàng đợi của đợt, không có
  số trần đúng), không đổi nghĩa khoá.
- Không xử lý máy thiếu `jq`: lệnh vẫn nuốt lỗi và chờ mãi. Đó là việc của bước kiểm môi trường, không của hàm này.
- Không sửa các dòng lệnh khác in đường đợt trần (`ghi_danh` ở `tiep-tuc.mjs`, lời nhắc bàn giao ở `hook-nhip.mjs`):
  cùng họ lỗi nhưng khác vật, gom thành vòng riêng.

## Thiết kế

Một đổi hành vi, một đổi chỗ ở:

1. `lenhChoKhoa` bọc đối số đường khoá bằng `nhayDoiSo`. Hàm này giữ nguyên đường an toàn, chỉ bọc khi có ký tự lạ. Vị từ
   `.phien==` đi cùng dòng lệnh và treo y hệt khi tên dãy có nháy, nên cũng đi qua `JSON.stringify` rồi `nhayDoiSo`; tên dãy
   thường cho đúng chuỗi cũ.
2. `nhayDon` và `nhayDoiSo` dời từ `hook-chan-s4.mjs` sang module mới `dieu-phoi/scripts/nhay.mjs`, chỉ dùng `node:` và
   `./`. Gói được chép phẳng vào `<thư mục đợt>/loi/` (chép mọi `*.mjs`), nên tệp mới tự đi theo đợt mà không phải khai
   đâu. `hook-chan-s4.mjs` import lại từ đó, hành vi không đổi.

Vì sao module riêng: `lich.mjs` là lớp lịch thuần chỉ import `cau-hinh.mjs`. Import ngược từ hook sẽ kéo bộ đọc cấu hình
và bộ phân loại lệnh vào lớp lịch; chép helper sang thì có hai bản cùng một luật nháy.

`phan-loai-s4.mjs` có `nhayDon` riêng, luôn bọc, khác nghĩa (dựng lại đối số đã tách để phân loại) nên giữ nguyên.

## Đo

Tệp ca `tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs`, ca «KN-<n>» = AC-<n>. Ca chạy CHÍNH dòng lệnh sinh ra
bằng vỏ thật (`bash`, `sh`, và `zsh` khi máy có) với `jq` thật, trên thư mục tạm; `sleep` thay bằng bản rút ngắn trên
`PATH`, vừa để ca không chờ 15 giây, vừa đếm số vòng kiểm để «còn chờ» là đã kiểm rồi. Trần phải thoát 15 giây; kết luận
còn chờ sau ít nhất 2 vòng. Chiều đỏ: commit ca đứng trước commit vật (SHA ghi sổ lúc S3), cộng các ca đỏ sống trên bản
sao `lich.mjs` bị phá; bảng chín ký tự khai trước kết cục của bản bỏ nháy từng hàng.

## Rủi ro

Đường dẫn có ký tự lạ nay được bọc nháy đơn, nên bộ đọc nào parse dòng «chờ» bằng regex `\S+` sẽ hụt. Trong kho chỉ có
ca SD-3 làm vậy, và ca đó dùng thư mục tạm không dấu cách nên đường vẫn trần.
