# Bản phạm vi — design-floor v1 (27/10)

Phạm vi v1 của design-floor theo kế hoạch `docs/plans/2026-10-26-ke-hoach-design-floor-tiep.md` (bước 3, 4, 6), sau khi
bước 1 (#421, hồ sơ `_acceptance/design-floor-hop-dong-nhap/`) và tầng tri thức của kit (#423) đã gộp. Nguồn là trang tri
thức `wiki/chu-de/design-floor.md` ở kho riêng `acceptance-gate-kit-tri-thuc`.

Nhóm K là cổng thiết kế của kit; V là vendor và bốn bản vá cục bộ (không gửi PR upstream — chủ kho 26/10); GN là bốn
điểm móc vào vòng; DO là phép đo thí điểm; CG là phần chờ điều kiện.

<!-- <<<PHAM-VI-MA -->
```
dot: design-floor-2710
dang: chuoi
nguon: acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626

- `K1` — cổng thiết kế của kit trả KHÔNG-ĐO-ĐƯỢC thay vì REJECT khi CSS không đọc được, nền khai bị bỏ qua, hay chữ gradient cắt theo chữ
- `V1` — bản lõi gọn vendored khớp băm tệp khoá, bộ đo của bước 1 chạy trên bản vendored, kiểm trong CI
- `VA` — bản vá cục bộ A: lệnh chấm và autofix không ghi tệp nào ngoài đích (DF-07, DF-08, phần memory của FN-02)
- `VB` — bản vá cục bộ B: mã thoát ba trạng thái (DF-01, DF-04, DF-05, DF-06)
- `VC` — bản vá cục bộ C: đầu vào tường minh, không tự dò design system (DF-03)
- `VD` — bản vá cục bộ D: hàm làm sạch tên token trung tính, rời module Figma (phần figma của FN-02)
- `GN0` — S0 đọc bậc của kho M0–M3, M0 thì design-floor im
- `GN1` — S1 định tuyến chỉ mục tri thức thiết kế có trần, kiểm kế hoạch dùng lại và flow lint lên thẻ Cổng 1
- `GN3` — cuối S3 autofix và sinh lại tệp dẫn xuất, commit trước S4
- `GN4` — S4 chấm tuân thủ design system bằng độ phủ token và hex thô; răng cấm móc ui gate vào S4 khi DF-07 còn đỏ
- `DO1` — đo thí điểm trên onehub-invest: năm tiêu chí chết sau ít nhất mười vòng giao diện
- `CG1` — ui gate ở S4
```
<!-- PHAM-VI-MA>>> -->
