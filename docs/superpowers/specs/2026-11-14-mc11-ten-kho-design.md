# Ca MC-11 đọc tên kho từ thư mục checkout — thiết kế

Ngày: 2026-11-14 · hồ sơ: `_acceptance/mc11-ten-kho/` · hạng T2 · PR #502

## Vấn đề

Ca MC-11 (`tests/scripts/moc-chien-dich.test.mjs`) dựng tên phiên bằng `tenChienDich({ …, kho: tenKho(KIT) })` rồi so với chữ
cứng `MC1 · Mốc là chiến dịch (acceptance-gate-kit)`. `tenKho` trả tên thư mục của bản checkout chính, nên cùng một cây chạy
ở thư mục tên khác thì ca đỏ dù vật không đổi. Đã gặp hai lần: bản sao `kit-nen` (03/11, hồ sơ `ban-do-khuon-roi-nhom`) và kho
kế nhiệm `delivery-loop` (13–14/11, vòng B1 `kich-ban-chuyen-nha` REJECT mọi lượt chỉ vì ca này).

## Lựa chọn

So với chuỗi dựng từ chính `tenKho(KIT)` mà ca đã truyền vào, cộng một kiểm `tenKho` không rỗng. Theo tiền lệ sổ
`cau-tin-hieu-nguoi-gui`: ca đo rút giá trị từ thư viện dùng chung thay vì viết cứng. Chiều đỏ của định dạng chữ (`<mã> · <tên
ngắn> (<kho>)`) đã ở ca bảng `gach-va-ngoac`, truyền `kho` tường minh — giữ nguyên.

Lối bị loại: đặt biến môi trường ghi đè tên kho (thêm một khoá cấu hình mà sổ `moc-la-chien-dich` đã chọn không thêm); bỏ hẳn
so `ten_phien` khỏi MC-11 (mất kiểm tên phiên trên dữ liệu thật của kit).

## Đo

AC-1 chạy tệp ca ở checkout thường. AC-2 là răng hai chiều trên một fixture: clone cây vào thư mục `kho-ten-khac`, tệp ca lành
xanh; ba nhát phá trên bản sao đều đỏ với thông điệp ghim — bản chữ cứng `0c4e503b`, `tenChienDich` đổi dấu « · », `tenKho` trả
rỗng (hai nhát sau chứng MC-11 vẫn thật sự so `ten_phien` và kiểm tên kho không rỗng). AC-3 giữ dòng ca bảng `gach-va-ngoac`
và chứng nó còn chiều đỏ của định dạng (nhát dấu sai làm MC-6 gọi tên ca ấy).

Không chạm UI: bỏ đặc tả UX (sổ). design-pass và ui-observed không áp vì hợp đồng chỉ có mặt `cli`.
