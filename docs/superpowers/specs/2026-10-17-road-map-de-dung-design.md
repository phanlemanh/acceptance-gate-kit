# Road-map dễ dùng (RD1) — thiết kế

**Ngày:** 2026-10-17 · **Hồ sơ:** `_acceptance/road-map-de-dung/` · **Hạng:** T2 · **Người giao:** chủ kho (phiên điều phối MacBook Pro, 17/10)
**Chính sách áp:** «ship nhanh mà vẫn tin được» (chủ kho 17/10) — không bỏ cổng, không hạ thước; tốc độ từ bớt lượt gọi người.

## 1. Kết quả của vòng (một câu)

Chủ kho và phiên Claude mở lộ trình của bất kỳ kho nào và đọc được trong một phút **việc phát triển nào còn lại ở mỗi mốc, tên
bằng tiếng sản phẩm, xong chưa, và ngày dự kiến thật** — không còn mốc vận hành của người nằm lẫn cạnh sự thật của kho, và luật
«chỉ việc phát triển» được kiểm mỗi lần tệp được đọc, không chỉ lúc cắt lượt.

## 2. Số đo nền (17/10, kit 2.32.0)

| Đo | Ở đâu | Số |
|---|---|---|
| Mốc `loai: ngoai` trên lộ trình thật | crm `onehub` b74ec7eae | OKR 17/28 mốc · Kho tài liệu 1/6 · Việc và Dự án 0/2 · kit 3/11 |
| Hàng thiếu `ten_ngan` | cùng lần đo | OKR 0/145 · Kho tài liệu 11/17 · Việc và Dự án 0/16 · kit 39/50 |
| Khối «Mốc» của trang kit liệt việc | `scripts/lo-trinh.mjs` `mucLoTrinh` | chỉ MÃ trần («· việc X1, L2»), không tên, không trạng thái, không số còn lại |
| Răng «chỉ việc phát triển» chạy khi nào | `scripts/cat-luot.mjs` | chỉ khi phiên gọi cắt lượt; crm #465 sửa tay JSON đi vòng; #466 phải tay gỡ bốn mốc người không khai `loai` giữ hàng đã giao |
| Rà soát mốc người đã qua ngày | `raSoat` | «không có đề xuất» khi OKR có bốn mốc qua ngày chưa khép (hạt giống 17/10) |
| Giờ máy theo mốc | `gio-may.mjs` `duBao` | năm mốc độc lập cùng «bắt đầu ~17/10», ba «hoàn tất 17/10» (hạt giống 17/10) |
| Kho khai `lo_trinh` | `~/dev/*/_acceptance/config.yaml` | kit, crm (OneFlow, radar không khai) |

Khối «Mốc sắp tới» trong ảnh chụp của chủ kho **không do kit vẽ** (không chuỗi nào trong kit hay nhánh `onehub` của crm) — đó là
trang Lộ trình TRONG sản phẩm crm (LT1/LT1e) đọc khối dữ liệu của trang kit. Khối «Mốc» của trang kit mắc đúng bệnh ấy, nên kit
sửa trang của mình; trang trong crm là việc của crm, ghi một dòng ở ghi chú nhận (§8).

## 3. Phân loại phạm vi (thẻ Cổng Phạm vi đọc bảng này)

| Phần | Loại | Vì sao loại ấy |
|---|---|---|
| A. Bỏ mốc ngoài | **TRỪ** | Gỡ một chỗ của bảng phủ và một loại mốc khỏi trang; chỗ thay là khối `da_bac` sẵn có, không khoá mới. Cờ vàng đọc-cũ là nghĩa vụ của luật «đổi schema phải có đường đọc-cũ», không phải tính năng mới. Chữ tiêu đề mục trên trang là Hỏi-2. |
| B. Trang đọc được trong một phút + một mô hình hiển thị chung | **Sửa lỗi** | Trang hứa «đọc một phút» (hồ sơ `trang-lo-trinh-doc-mot-phut`); khối Mốc in mã trần là trang không giữ lời hứa. Trang crm và trang kit trình cùng dữ liệu theo hai luật — người thấy hai lộ trình (chủ kho 17/10). Khối dữ liệu thêm năm khoá trong cùng phiên bản (luật 16/10), có đường đọc-cũ. |
| C. Luật chỉ việc phát triển trên mọi lần đọc | **Sửa lỗi** | Luật chủ kho 11/10 đã chốt; răng chỉ chạy một đường nên lời khai «lộ trình chỉ chứa việc phát triển» sai trên tệp thật. |
| D. Ngày dự kiến nối tiếp theo làn | **Sửa lỗi** | Ngày dự kiến hôm nay sai khi đọc chung (hạt giống 17/10). |
| E. Ba việc CỘNG (lệnh xem đưa đường dẫn trang · Rà soát + Giờ máy lên trang · cài road-map mặc định) | **CỘNG — tách sang vòng RD2** | Luật CỘNG cần chủ kho duyệt đích danh; gộp vào thì hợp đồng 13+ tiêu chí (phải tách theo khối cỡ). E3 còn đi ngược ADR 0025 (lộ trình là lựa chọn của từng kho). Hạt giống `docs/plans/2026-10-17-hat-giong-road-map-xem-trang-va-cai-goi.md`. |

## 4. Thiết kế từng phần

### 4.1 A — bỏ mốc ngoài

**Luật mới (thay vế «vận hành → mốc ngoài» của S3b, chủ kho 17/10 «bỏ mốc ngoài»).** Việc của người không thành mục nào trên
lộ trình. Bốn đích, theo việc ấy là gì:

1. **Sự kiện của người tạo HẠN** (ngày công bố, ngày dùng thật, mùa báo cáo) → `ngay` của chính mốc phát triển bị ràng buộc. Mã
   của bản phạm vi nói sự kiện ấy → `da_bac`, `ly_do` nêu sự kiện và tên mốc nhận hạn (không thêm khoá mới trên mốc — sổ, thay
   dòng `vi_sao` sau phản biện).
2. **Đo giá trị** (phiên nghiệm thu, đọc số sau N ngày) → ngưỡng + ngày đọc trong `opportunity.md` của hàng; kết quả ghi bằng
   `/acceptance-gate:observed` (`da-cham-boi-thuc-te`, ADR 0020). Mã → hàng ấy (`phu`).
3. **Vận hành thuần** (gửi danh sách, đào tạo, gom góp ý) → ra khỏi kho (lịch của chủ kho, kênh điều phối). Mã → `da_bac` mang
   `dot` + `phu` + `ly_do` «vận hành — ra khỏi kho».
4. **Hàng cần KẾT QUẢ của một việc vận hành** → `chan_troi` (Chờ điều kiện) + `mo_lai_khi` nêu việc ấy.

Luật dữ liệu giả (S3b luật 4) và luật «vận hành lặp lại → tự phục vụ» (S3b luật 5) GIỮ — chúng là về hàng, không về mốc. Luật 5
đổi đích: vận hành lặp lại vẫn đề xuất hàng tự phục vụ; bản thân việc lặp ra khỏi kho như đích 3.

**Bảng phủ** giữ «mọi mã ở đúng một chỗ», ba chỗ: hàng · chờ điều kiện · **không làm trong kho** (mục `da_bac` cùng `dot`, mang
`phu`). Bỏ hẳn chỗ thứ ba thì mã vận hành của bản phạm vi không có chỗ nào và răng đỏ oan; thêm khoá mới (`ra_khoi_kho`) là
CỘNG. **Câu hỏi cho chủ kho (Hỏi-2):** trên trang, tiêu đề mục `da_bac` đổi «Đã bác» → «Không làm trong kho», mỗi mục kèm `ly_do`
— để việc vận hành của đội không đọc thành «bị bác». Máy soạn theo khuyến nghị này.

**Răng cắt lượt** (`scripts/cat-luot.mjs`):
- Mốc `loai: ngoai` của đợt đang cắt → `lỗi: mốc <nhãn> [moc-ngoai-da-bo]: …` kèm bốn đích ở trên (một câu mỗi đích). Mã nó
  mang KHÔNG tính phủ — nên mã chỉ ở mốc ấy báo «không ở chỗ nào».
- Mốc ngoài ngoài đợt → một dòng gom `cảnh báo: [moc-ngoai-da-bo] <k> mốc ngoài đợt …` (khuôn gom S3b), mã thoát không đổi.
- `[cho-van-hanh]` (hàng đứng trên mốc ngoài) giữ cho tệp cũ; `[van-hanh-lap-chua-tu-phuc-vu]` gỡ (mốc ngoài không còn là chỗ hợp
  lệ để nhắc). Các luật kiểm `ai`/`lap`/`tu_phuc_vu` của mốc ngoài gỡ cùng.

**Trang, khối dữ liệu, bản xem chữ** (`scripts/lo-trinh.mjs`, `scripts/gio-may.mjs`): mốc `loai: ngoai` không vẽ ở khối Mốc,
không vào đếm «k/n mốc chưa gắn việc», không vào khối dữ liệu, không vào «Giờ máy theo mốc». **Đường đọc-cũ:** tệp còn mốc ngoài
vẫn đọc được, mã thoát không đổi, «Cần sửa trong kế hoạch» thêm ĐÚNG MỘT dòng gom có tên: «<k> mốc là việc của người — trang không
vẽ nữa (luật 17/10): <nhãn…>; chuyển theo bước 2b của cắt lượt». Hàng từng gắn vào mốc ngoài mất mốc → cờ «chưa thuộc mốc nào»
sẵn có (MC1) tự hiện — đúng hệ quả mong muốn.

**SKILL + khuôn + từ điển + ADR:** khối `CAT-LUOT-VAN-HANH` viết lại theo bốn đích; khuôn `lo-trinh-template.json` bỏ mốc V1
(mã C1 của bản phạm vi mẫu vào `da_bac` với `ly_do` «vận hành — ra khỏi kho»); bảng cờ SKILL bỏ
`van-hanh-lap-chua-tu-phuc-vu`, thêm `moc-ngoai-da-bo`; CONTEXT.md mục «Mốc ngoài» thành mục đã bỏ (giữ để đọc tệp cũ, `_Avoid_`
ghi việc mới); ADR 0026 một đoạn.

### 4.2 B — tên trước mã

Khối «Mốc» của trang, mỗi mốc:

```
17/10/2026  Phát hành 2.33.0 — road-map dễ dùng          còn 3/5 việc · ~20–30 giờ máy
  ▸ Bỏ mốc ngoài khỏi lộ trình — Đang làm                         RD1
  ▸ Trang lộ trình đọc được trong một phút — Chưa mở              RD1b
  ▸ Ngày dự kiến nối tiếp — Chưa mở                               …
  2 việc đã giao ▸
```

- Tên: `ten_hien_thi` của khối (Hỏi-3; khuyến nghị câu giao đầy đủ, vắng thì tên ngắn).
- Trạng thái bằng chữ: chính chữ ô Trạng thái của bảng việc (`d.chu`) — một nguồn, không từ điển thứ hai.
- Mã: chữ nhỏ cuối dòng, là liên kết tới hàng trong bảng việc.
- Mở ra (`<details>`): tên hồ sơ (`slug`) khi có (lối tên ngắn: thêm câu giao đầy đủ) — không cần JavaScript.
- Đầu mốc: «còn k/n việc» (k = việc chưa giao); việc đã giao gập thành một dòng đếm.
- Mốc ngoài không vẽ (A).

**Một mô hình hiển thị chung trong khối dữ liệu (chủ kho 17/10, qua điều phối: «Lộ trình CRM và lộ trình của phiên đọc cùng
một nguồn; khi Lộ trình CRM đọc đúng thì phiên cũng phải đồng nhất»).** Nguồn dữ liệu đã chung (tệp lộ trình → `lo-trinh.mjs` →
khối dữ liệu → trang kit, `/road-map:xem`, bản chụp sang crm), nhưng LUẬT HIỂN THỊ bị chia đôi: trang crm tự lọc «chỉ mốc có
việc gắn», lấy câu giao làm tên; trang kit vẽ mọi mốc, liệt mã. Sửa: luật hiển thị sống MỘT chỗ — khối dữ liệu mang sẵn kết quả,
mọi mặt chỉ vẽ:

| Khoá (thêm trong phiên bản 2 của khối — luật «kit chỉ THÊM khoá trong cùng phiên bản», 16/10) | Nghĩa |
|---|---|
| `hang[].ten_hien_thi` | tên hiển thị của việc — luật chốt ở Hỏi-3; bản soạn theo khuyến nghị: câu giao đầy đủ bỏ «» (đúng trang crm), việc không có câu giao thì `ten_ngan` → `ten` |
| `moc[].viec_hien` | mã các việc hiện dưới mốc — việc thuộc mốc ĐẦU TIÊN liệt nó (đúng luật `phangViec` của crm) |
| `moc[].hien` | `true` khi `viec_hien` khác rỗng — luật «chỉ mốc có việc gắn» của trang crm |
| `moc[].con_lai` | số việc của `viec_hien` chưa giao |
| `chua_hen_moc` (cấp lộ trình) | mã các việc không thuộc mốc nào hiện — nhóm «chưa hẹn mốc» của trang crm |

Chuẩn chung = luật trang crm đang chạy (đã qua Cổng Bằng chứng của crm). **Tên việc là Hỏi-3** — hai lời của chủ kho kéo hai
chiều: lời giao gốc phần B (tên ngắn, vắng thì rút gọn câu giao) và lời bổ sung (trang crm như đang là = câu giao đầy đủ). Số đo
`onehub`: 63 việc dưới mốc hiện; câu giao trung vị 105 ký tự (~23 chữ, dài nhất 171); tên ngắn trung vị 13 ký tự («Khung OKR»).
Máy khuyên câu giao đầy đủ (lời mới nhất, crm không đổi gì, mỗi việc 1–3 dòng ở 375 — ảnh `ten-la-cau-giao--*`); lối khác: tên
ngắn trước, câu giao trong phần mở (ảnh `ten-ngan--*`), crm đổi khi nhận. Cảnh báo thiếu tên ngắn giữ ở cả hai lối (tên phiên
vẫn dùng tên ngắn). Trang kit (khối Mốc + nhóm chưa hẹn mốc)
và `/road-map:xem` (thêm khối «Mốc» mỗi lộ trình: mốc hiện · còn k/n · tên — trạng thái từng việc chưa giao · số chưa hẹn mốc)
chỉ đọc các khoá này. Mốc ngoài không vào khối (phần A). Ngày dự kiến SỐNG (phần D) phụ thuộc hôm nay nên không vào khối — khối
giữ dự báo đóng băng sẵn có (`moc.du_kien`); đưa ngày sống lên trang là mục E2 của RD2. **Đường đọc-cũ:** khối không có các khoá
mới (trang vẽ bằng kit cũ) → bộ đọc mẫu trả `null`/rỗng và một cờ vàng «khối chưa mang mô hình hiển thị»; trang crm giữ luật lọc
hiện tại tới khi nhận bản mới. Ghi chú nhận cho crm: một ca đối chiếu trang crm với tập hiển thị của khối (crm tự làm khi nhận).

**Cảnh báo thiếu tên ngắn:** «Cần sửa trong kế hoạch» thêm MỘT dòng gom «<k> việc chưa có tên ngắn — trang đang rút gọn câu giao:
<mã…≤8>». Kho đủ tên: không dòng nào. Không chặn, không đổi mã thoát.

Trang dùng skill `ux-ui-craft` ở S3 (thứ bậc chữ, tương phản sáng/tối, vùng chạm, khổ 375). Đo giao diện bằng các ca Chrome thật
`LTT-*` sẵn có (kit không có làn `ui-check`) — tiền lệ `trang-lo-trinh-doc-mot-phut`.

### 4.3 C — luật «chỉ việc phát triển» trên mọi lần đọc

Luật dời từ răng cắt lượt vào **bộ đọc chung** của tệp lộ trình (`kiemKhuon`/`phanTichKho`), nên cùng một danh sách cờ hiện ở
mọi mặt đọc tệp: trang (khối «Cần sửa trong kế hoạch»), bản xem chữ (dòng `!`), thẻ khởi động. CI của kho chạy `product-map.mjs
--check` nên mọi lần sửa tay tệp mà không vẽ lại trang đều đỏ CI; vẽ lại thì cờ hiện trên trang trong cùng PR — đó là «mọi lần
sửa» mà không thêm hook hay cổng. Luật toàn tệp (không theo đợt), chỉ cờ:

| Cờ | Khi |
|---|---|
| `moc-ngoai-da-bo` | mốc `loai: ngoai` (dòng gom đọc-cũ của A) |
| `moc-chua-khai-loai` | mốc không khai `loai` — đúng hình bốn mốc người crm #466 |
| `dung-tren-moc` | `dung_tren` của hàng trỏ `ma`/`ten` một mốc (mọi loại) |
| `du-lieu-sai-gia-tri` · `thieu-hang-sinh-gia` | luật dữ liệu giả S3b, toàn tệp |

Rà soát thêm luật **`moc-chua-khep`** (hạt giống 17/10): mốc có `ngay` < hôm nay, không có ngày khép (`that`, đọc khi tệp có), và
không hàng hoặc mọi hàng đã giao → gom thành MỘT dòng «<k> mốc đã qua ngày, chưa ghi ngày khép: <tên dd/mm…≤5>». Phụ thuộc hôm nay
nên chỉ ở bản xem chữ và thẻ khởi động, không lên trang (trang tất định). Mốc ngoài không vào luật này (đã có dòng A).

### 4.4 D — ngày dự kiến nối tiếp theo làn

Một lộ trình là một làn. Mốc còn việc chưa giao (trừ mốc ngoài) sắp theo `ngay` (mốc không ngày đứng cuối, giữ thứ tự tệp);
`batDau(k) = max(hôm nay, hoanTat(k−1), ràng buộc dung_tren sẵn có)`. Hàng thuộc nhiều mốc tính ở mốc đầu (như cũ). Dòng giờ máy
thêm nhãn «(máy chạy 24/24 — chưa đo nhịp ngày)» thay vì im. Nhiều lộ trình cùng kho tính riêng — khối «Giờ máy theo mốc» nói một
dòng «mỗi lộ trình một làn, tính riêng». Đọc giờ máy/ngày từ số đo vòng (vế 2 của hạt giống) dời vòng sau — sổ `descope`.

## 5. Cân trên mọi kho

| Kho | Được | Mất |
|---|---|---|
| Kho không khai `lo_trinh` (OneFlow, radar) | — | — (không đọc gì) |
| Kho đủ `ten_ngan`, không mốc ngoài, không mốc thiếu loại | khối Mốc đọc bằng tên | ngày dự kiến lùi khi có ≥2 mốc mở (đúng thực tế) |
| crm (17 mốc ngoài ở OKR, 11 hàng thiếu tên ở Kho tài liệu) | trang thôi lẫn việc người; cờ có tên chỉ việc phải chuyển | 17 mốc biến khỏi trang tới khi crm chuyển; một dòng cờ dài |
| kit (3 mốc ngoài, 39 hàng thiếu tên) | như crm | như crm |
| Trang Lộ trình trong crm đọc khối dữ liệu | khối thôi mang mốc ngoài | crm tự áp nguyên tắc tên-trước-mã (ghi chú nhận) |

Hành vi cũ có ai dựa: hồ sơ đã ký `lo-trinh-chi-viec-phat-trien` (LT-163…171), `lo-trinh-gio-may` (AC-4), `ra-soat-lo-trinh`
(ca mốc ngoài không kích hoạt) — ghi con trỏ thay thế ở Notes của hợp đồng này, đánh dấu eval bị thay bằng `superseded_by` ở chiến
dịch ghim lại của mốc phát hành. Không sửa hợp đồng đã ký.

## 6. Thước

- Ca đo `tests/scripts/road-map-de-dung.test.mjs` (ca `RD-<n>`), khoá `executors.test.road_map_de_dung`; ca Chrome thêm vào
  `xem-trang-lo-trinh.test.mjs` (`LTT-ten-*`). Kho thử do code sinh; bản chụp crm `onehub` b74ec7eae do `lo-trinh-chup-crm.mjs`
  chụp vào `tests/scripts/fixtures/lo-trinh/crm-onehub-1017/`. Chiều đỏ trong bộ kiểm: mỗi ca đỏ chạy hàm đo trên bản sao bị tiêm
  (khớp đúng một lần) SAU khi bản lành xanh, ghim thông điệp.
- Đo trước/sau của B: bộ «người đọc máy» rút CHỮ NHÌN THẤY của khối Mốc (bỏ thẻ, bỏ thuộc tính, nội dung `<details>` đóng không
  tính) trên trang vẽ từ bản chụp crm, so với đáp án do code tính từ tệp: mỗi mốc còn việc → «còn k/n» + tên + trạng thái từng
  việc chưa giao. Bộ máy 2.32.0 (`git archive v2.32.0 scripts lib skills`) → FAIL nêu tên mốc; bản mới → PASS. Giám khảo
  (judgment) đọc trang mới đã xuất ra chữ và trả lời «mốc X còn làm những gì» cho ba mốc.

## 7. Đường đảo

Mọi thay đổi là mã + văn bản trong kho kit, đi theo bản phát hành có chủ đích. Đảo = hoàn lại PR. Kho tiêu thụ giữ bản cũ tới khi
nhận mốc. Không xoá dữ liệu: tệp lộ trình của kho không bị máy sửa (răng và bộ đọc chỉ cờ).

## 8. Ghi chú nhận (đi vào CHANGELOG của mốc)

- crm: chuyển 17 mốc ngoài của OKR + 1 của Kho tài liệu theo bốn đích (bước 2b cắt lượt); điền `ten_ngan` 11 hàng Kho tài liệu.
- crm: trang Lộ trình trong sản phẩm (LT1/LT1e) áp cùng nguyên tắc **tên trước mã** — mỗi việc hiện `ten_ngan` (vắng thì rút gọn
  câu giao) + trạng thái bằng chữ, mã là phụ.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: mở `LO-TRINH.html` → cuộn tới khối «Mốc» của lộ trình → đọc mỗi mốc «còn k/n việc» + từng việc «tên — trạng thái» (điểm ra: biết mốc còn gì; muốn chi tiết thì mở dòng việc).
- Biên: mốc hết việc (chỉ dòng «n việc đã giao») · mốc chưa gắn việc · việc thiếu tên ngắn (tên rút gọn từ câu giao + cờ ở «Cần sửa») · tệp còn mốc ngoài (không vẽ, một dòng cờ có tên).
- Lỗi & quay lại: tệp không đọc được → câu lỗi sẵn có của trang; không có thao tác ghi nên không có đường quay lại.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Trang lộ trình — khối Mốc | cho biết mỗi mốc còn việc gì, xong chưa | từ thẻ đầu trang («Mốc kế tiếp») / tới hàng trong bảng việc (liên kết mã) |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-moc-con-viec | khối Mốc | «còn k/n việc» + mỗi việc chưa giao một dòng «tên — trạng thái», mã chữ nhỏ cuối dòng | mở dòng xem câu giao + hồ sơ |
| ST-moc-het-viec | khối Mốc | «n việc đã giao» (gập) | không cần làm gì |
| ST-moc-chua-gan | khối Mốc | «chưa gắn việc» như cũ | gắn việc vào mốc trong kế hoạch |
| ST-moc-qua-ngay | khối Mốc | «đã qua — còn việc chưa giao» (script sẵn có) | dời mốc hoặc làm tiếp |
| ST-viec-thieu-ten | khối Mốc + Cần sửa | tên rút gọn câu giao; một dòng gom «k việc chưa có tên ngắn» | điền `ten_ngan` |
| ST-tep-moc-ngoai | Cần sửa | một dòng «k mốc là việc của người — trang không vẽ nữa» kèm tên | chuyển theo bước 2b cắt lượt |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- `<details>` gốc HTML, không JavaScript; `<summary>` vùng chạm ≥ 44px; liên kết mã trong dòng miễn như WCAG 2.5.8 (tiền lệ).
- Khổ 1280 và 375, sáng và tối; trang kho thử năm trạng thái vẫn ≤ 1/3 trang 2.21.0 (thước LTT-san).

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| Dải mốc `ol.moc` | mở rộng | giữ cấu trúc và script «còn N ngày», chỉ đổi nội dung dòng mốc |
| Dòng việc trong mốc | tạo | chưa có — mỗi việc một `<details>` tên + trạng thái |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: luồng hiển nhiên — dải mốc là danh sách sẵn có, chi tiết việc mở tại chỗ; không tra mẫu (một khuôn khả dĩ).
<!-- UX-SPEC-TEMPLATE>>> -->
