# Xuất dữ liệu lộ trình — design (hàng X1)

**Hồ sơ:** `_acceptance/xuat-du-lieu-lo-trinh/` · **Cổng Đáng:** build T2, Manh Phan 08/10 · **Mốc:** 2.27
(PR gộp sau khi cắt 2.26.0) · **Gốc:** crm/_acceptance/cap-nhat-tuan-okr.

## Vấn đề

Trạng thái lộ trình của một kho chỉ có trong `LO-TRINH.html` — trang người đọc, không phải dữ liệu máy
đọc. Trang «Lộ trình» trong CRM (hàng `LT1` của crm) và bản chiếu ReUI (hạt giống 04/10) muốn hiện cùng
trạng thái ấy thì hôm nay phải chép luật suy của kit — nguồn sự thật thứ hai, lệch là người ở CRM tin
một trạng thái sai.

Phép thử 08/10 (ô cơ hội): lớp phân tích của kit đã giữ sẵn mọi thứ trang hiện (vẽ lại trang crm khớp
từng byte, 85 hàng); thứ duy nhất trang tính lúc xem là so ngày mốc với hôm nay.

## Hướng chọn — nhúng một khối dữ liệu vào chính trang

`LO-TRINH.html` mang thêm MỘT khối dữ liệu máy đọc, theo nếp «data block» của HTML (WHATWG HTML,
§ script — `type` không phải JavaScript thì trình duyệt không chạy, không hiện):

```html
<script type="application/json" id="lo-trinh-du-lieu">{…}</script>
```

Khối sinh trong CÙNG lần gọi `veHtml`, từ CÙNG `cacTep` đã dùng để vẽ thẻ và bảng — không có lượt
vẽ nào mà trang và dữ liệu đi hai đường.

**Phương án bị loại — tệp riêng `LO-TRINH.json` ở gốc kho.** Miễn trừ T1 của crm phủ `LO-TRINH.html`
đích danh và `docs/**`; tệp mới ở gốc không được phủ → (1) bộ vẽ phải đòi kho thêm glob, tức sửa
`_acceptance/config.yaml` và làm cũ hàng loạt hồ sơ; (2) tệp ngoài miễn trừ lọt vào vùng vật của lượt
chấm, tác tử soi lỗi đọc nó mỗi lượt (≈ 19 KB trên crm); (3) phải thêm một phép so «tệp khớp trang».
Nhúng thì cả ba biến mất: không đổi cấu hình kho nào, trang đã ở ngoài vùng vật, `--check` so byte
của trang là so luôn dữ liệu. Giá phải trả: bản chiếu rút khối khỏi HTML (một phép tìm theo `id` +
`JSON.parse`), thay vì đọc thẳng một tệp JSON. Kho cần tệp riêng → bật thêm theo lựa chọn ở vòng sau
(Later), không đổi mặc định.

## Khuôn dữ liệu (phiên bản 1)

Một object. Danh sách khoá sống ở MỘT chỗ trong mã (`KHUON_DU_LIEU` của `scripts/lo-trinh.mjs`); tài
liệu cho kho tiêu thụ (`skills/acceptance/references/lo-trinh-du-lieu.md`) chép bảng khoá trong khối
marker, ca đo so hai bên.

| Khoá | Kiểu | Nghĩa |
|---|---|---|
| `khuon` | `"lo-trinh-du-lieu"` | tên khuôn |
| `phien_ban` | số | 1 |
| `nguon` | chuỗi[] | tệp kế hoạch, theo thứ tự khai |
| `lo_trinh[]` | object[] | mỗi tệp khai một phần tử |
| · `tep`, `ten` | chuỗi | đường tệp · tên lộ trình |
| · `loi` | chuỗi \| null | tệp không đọc được → câu đã dịch, các khoá dưới rỗng |
| · `hang_ke` | object \| null | `{ ma, cau_giao, lenh }` — `lenh` là dòng `/feature-loop:feature-loop …` hoặc null khi mã trùng/thiếu |
| · `can_sua[]` | object[] | `{ ma, chu }` — đúng danh sách «Cần sửa trong kế hoạch» của trang, đã dịch |
| · `tien_do` | object | `{ tong, da_giao, dang_lam, chua_bat_dau, khac }` — đúng bốn số trên thẻ |
| · `hang[]` | object[] | mỗi hàng của kế hoạch, theo thứ tự tệp |
| ·· `ma`, `cau_giao`, `hang`, `nhom`, `dung_tren`, `bat_khi`, `vi_sao` | | chép từ tệp kế hoạch (ý định) |
| ·· `trang_thai` | chuỗi | đúng chữ trạng thái trên trang |
| ·· `nhom_trang_thai` | `da-giao` \| `dang-lam` \| `chua-bat-dau` \| `khac` | đúng phép chia của thanh tiến độ |
| ·· `ho_so` | chuỗi \| null | hồ sơ nhận hàng |
| ·· `theo_loi` | bool | trạng thái lấy từ lời ghi, chưa có hồ sơ |
| ·· `co[]` | chuỗi[] | cờ của hàng, đã dịch |
| · `moc[]` | object[] | `{ ten, ngay, hang[], con_viec }` — theo ngày tăng dần; `con_viec` = còn hàng gắn mốc chưa giao |
| · `da_bac[]` | object[] | `{ ma, ly_do }` |
| `ngoai_lo_trinh[]` | chuỗi[] | hồ sơ không thuộc kế hoạch nào |

Luật duy nhất bản chiếu được tự làm (tài liệu viết nguyên văn trong khối marker
`LO-TRINH-DU-LIEU-LUAT-NGAY`, ca đo AC-12 so nó với script nội tuyến của trang): **so ngày** — mốc có
`ngay` TRƯỚC ngày lịch hôm nay của người xem (đúng ngày mốc chưa tính là qua) mà `con_viec` đúng là
«đã qua, còn việc chưa giao»; hàng trễ = hàng thuộc mốc ấy có `nhom_trang_thai ≠ da-giao`. Mọi trạng
thái khác đọc thẳng.

Tất định: không ngày chạy, không «hôm nay» trong khối — `--check` so byte như trước. Chữ nguy hiểm
trong ý định (`</script>`, `<!--`, U+2028/2029) thoát thành `<`, ` `… — JSON vẫn đúng,
trang không bị cắt.

## Bộ đọc mẫu (đường đọc-cũ)

`docDuLieu(html) → { duLieu, canhBao[] }` trong cùng mô-đun — bản chiếu viết bằng JS chép được, kho
khác đọc nó làm đặc tả:

- trang không có khối (vẽ bằng kit trước 2.27) → `duLieu: null` + «trang chưa mang dữ liệu — vẽ lại
  bằng kit ≥ 2.27»;
- khối không phải JSON → `null` + câu nêu lỗi;
- `khuon` khác → `null` + câu nêu tên;
- `phien_ban` lớn hơn bộ đọc biết → vẫn trả dữ liệu + cờ vàng «khuôn mới hơn bộ đọc — đọc phần biết»;
- khoá thiếu → giá trị rỗng theo kiểu, không vỡ.

## Không đổi gì ở chỗ người nhìn

Trang hiển thị y nguyên: gỡ khối dữ liệu ra thì trang mới giống từng byte trang vẽ bằng bộ vẽ ở commit
gốc của vòng (`7e965b54`, lấy bằng `git archive` trọn `scripts lib`) trên cùng kho thử. Vì vậy vòng
không đi nghi thức thiết kế giao diện, không đặc tả UX, không eval chụp màn — phép so byte là bằng
chứng mạnh hơn ảnh cho ca «không đổi».

Kho không khai lộ trình: không trang, không khối, không tệp nào đổi.

## Phạm vi chạm

`scripts/lo-trinh.mjs` (dựng + nhúng khối, bộ đọc mẫu) · `skills/acceptance/references/lo-trinh-du-lieu.md`
(mới — tài liệu cho kho tiêu thụ) · `GUIDE.md` (một đoạn trỏ tài liệu) · `tests/scripts/lo-trinh.test.mjs`
(ca LT-1xx, chạy bằng khoá executor sẵn có — không thêm khoá vào `config.yaml`) · `CHANGELOG.md`.
Không chạm `lib/**`, hook, lưới trước-merge → T2. `product-map.mjs` không đổi (vẫn ghi đúng hai tệp).

## Giá theo năm dòng (dự báo)

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong → quyết-được | = | không thêm cổng |
| lượt gọi người / vòng | = | không thêm câu hỏi; ngoài vòng: ↓ tin hỏi tiến độ khi LT1 có |
| vòng bị hạ tầng đốt | = | |
| token máy / vòng | = | khối nằm trong tệp đã ngoài vùng vật |
| phút máy / lượt chấm | = (+ ≈ 0,1 s vẽ) | |

Điều kiện tin cậy: đường verdict không đổi thành phần.
