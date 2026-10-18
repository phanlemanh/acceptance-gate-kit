# Dữ liệu lộ trình máy đọc — cho bản chiếu ngoài kho

> Dành cho kỹ sư của kho tiêu thụ muốn hiện lộ trình của kho ở một chỗ khác ngoài `LO-TRINH.html`:
> một trang «Lộ trình» trong công cụ của đội, một trang chia sẻ, một bảng điều khiển. Đọc xong tệp này
> là đủ để dựng trang đó — không cần đọc mã kit.

## Một nguồn, không tự tính

Kho khai `lo_trinh.tep` thì mỗi lần bản đồ sản phẩm vẽ lại (đóng mỗi cổng nghiệm thu, hoặc khi kho
tự vẽ lại bản đồ), kit vẽ `LO-TRINH.html` ở gốc kho. Từ kit 2.27 trang mang
thêm **một khối dữ liệu** vẽ cùng lượt, từ cùng kết quả phân tích:

```html
<script type="application/json" id="lo-trinh-du-lieu">{"khuon":"lo-trinh-du-lieu","phien_ban":1,…}</script>
```

Trình duyệt không chạy và không hiện khối này. Mọi trạng thái trong khối là ĐÚNG chữ trang in —
bản chiếu đọc thẳng, không suy lại từ hồ sơ, không dịch lại cờ. Việc duy nhất bản chiếu tự làm là
**so ngày mốc với hôm nay** (mục cuối).

## Lấy khối ở đâu, rút ra sao

1. Đọc `LO-TRINH.html` ở **nhánh chính** của kho (tệp trong git; trang luôn khớp hồ sơ vì CI của kho
   chạy `product-map.mjs --check`, lệch là đỏ).
2. Tìm thẻ `<script type="application/json" id="lo-trinh-du-lieu">`, lấy văn bản bên trong tới
   `</script>` đầu tiên, `JSON.parse`. Mọi `<` trong khối đã được viết thành `<`, nên `</script>`
   đầu tiên chính là chỗ đóng khối.
3. Kiểm `khuon == "lo-trinh-du-lieu"` và `phien_ban`. Bản viết bằng JavaScript chép NGUYÊN hàm
   `docDuLieu(html)` của `scripts/lo-trinh.mjs` trong gói kit — từ dòng `export function docDuLieu`
   tới dấu `}` đóng hàm. Hàm tự đủ: không gọi gì khác của tệp đó, trả `{ duLieu, canhBao }` và làm
   đúng sáu ca ở mục «Đọc khoan dung». Ca đo của kit chạy chính bản chép rời ấy (ngoài mô-đun) và
   so kết quả với bản trong mô-đun, nên hàm thôi tự đủ là bộ kiểm đỏ.

## Khuôn — phiên bản 2

Phiên bản 2 (hàng X2 của lộ trình kit) thêm đúng một khoá ở cấp việc: `hang.tom_tat` — dải tóm tắt
hồ sơ của việc, vẽ từ vật của hồ sơ bằng cùng hàm vẽ trang hồ sơ (`scripts/evidence-page.js`). Mọi khoá
của phiên bản 1 giữ nguyên nghĩa; riêng `cau_giao` từ phiên bản 2 đã bỏ đúng một cặp «» bao trọn câu
(«» bên trong câu còn nguyên).

Mỗi dòng trong khối dưới là `cấp.khoá — nghĩa`. Cấp `goc` là object ngoài cùng; `lo_trinh` là mỗi
phần tử của `goc.lo_trinh`; `hang`, `moc`, `da_bac`, `can_sua` là mỗi phần tử của mảng cùng tên trong
một lộ trình; `hang_ke`, `tien_do` là object trong một lộ trình.

<!-- <<<LO-TRINH-DU-LIEU-KHOA -->
```
goc.khuon — luôn "lo-trinh-du-lieu"
goc.phien_ban — số phiên bản khuôn (2)
goc.nguon — các tệp kế hoạch, theo thứ tự kho khai
goc.lo_trinh — mỗi tệp kế hoạch một phần tử, cùng thứ tự
goc.ngoai_lo_trinh — tên các hồ sơ không thuộc kế hoạch nào (sửa lỗi, việc giao thẳng)
lo_trinh.tep — đường tệp kế hoạch trong kho
lo_trinh.ten — tên lộ trình, hoặc null
lo_trinh.loi — null; hoặc câu nói vì sao tệp không đọc được — khi đó các mảng rỗng
lo_trinh.hang_ke — việc nên mở tiếp, hoặc null khi chưa việc nào đủ điều kiện
lo_trinh.can_sua — các chỗ cần sửa trong kế hoạch, đúng câu trang in
lo_trinh.tien_do — bốn con số của thanh tiến độ
lo_trinh.hang — mọi việc của kế hoạch, theo thứ tự tệp
lo_trinh.moc — các mốc, theo ngày tăng dần
lo_trinh.da_bac — các việc đã bác
lo_trinh.chua_hen_moc — mã các việc không thuộc mốc nào hiện (mục «Mô hình hiển thị chung»)
hang_ke.ma — mã việc
hang_ke.cau_giao — câu mô tả việc giao
hang_ke.lenh — dòng lệnh mở việc trong Claude Code, hoặc null khi mã trùng hay chưa có mã
can_sua.ma — mã việc mà chỗ cần sửa gắn vào, hoặc null
can_sua.chu — câu tiếng sản phẩm
tien_do.tong — số việc
tien_do.da_giao — số việc đã giao
tien_do.dang_lam — số việc đang làm
tien_do.chua_bat_dau — số việc chưa bắt đầu
tien_do.khac — số việc khác (xếp lại, đã bác, hoặc trạng thái chưa rõ)
hang.ma — mã việc như trang in (việc chưa có mã mang nhãn #<thứ tự>)
hang.cau_giao — câu mô tả việc giao
hang.hang — hạng rủi ro kho ghi (T1/T2/T3), hoặc rỗng
hang.nhom — nhóm kho ghi cho việc (dùng để lọc theo phòng ban, đội), hoặc rỗng
hang.dung_tren — mã các việc cần xong trước
hang.trang_thai — chữ trạng thái đúng như trang in
hang.nhom_trang_thai — da-giao | dang-lam | chua-bat-dau | khac
hang.ho_so — tên hồ sơ nghiệm thu đang nhận việc, hoặc null
hang.theo_loi — true khi trạng thái lấy từ lời ghi trong kế hoạch vì chưa có hồ sơ
hang.co — các cờ lệch của việc, đúng câu trang in
hang.bat_khi — điều kiện bật kho ghi, hoặc rỗng
hang.vi_sao — lý do kho ghi, hoặc rỗng
hang.tom_tat — dải tóm tắt hồ sơ của việc, hoặc null khi việc chưa có hồ sơ
hang.gio_may — giờ máy ước của việc (mục «Giờ máy và ngày dự kiến»), hoặc null khi trang vẽ không qua phân tích kho
hang.ten_hien_thi — tên hiển thị của việc: câu giao đầy đủ, vắng thì tên ngắn, tên, mã (mục «Mô hình hiển thị chung»)
tom_tat.moi_nguoi — tầng mọi người đọc: chín ô theo thứ tự trang hồ sơ in
tom_tat.chu_kho — tầng chủ kho: bảy con số và mã
moi_nguoi.da_giao — đã giao gì: câu giao của hợp đồng, đã bỏ một cặp «»
moi_nguoi.vi_sao — vì sao làm: đoạn lý do đầu tiên của ô cơ hội (vắng → đoạn đầu Context của hợp đồng); đoạn là câu dẫn «…:» theo sau là danh sách hay bảng thì thêm các mục rút gọn nối « · »; tối đa 400 ký tự: quá trần thì giữ trọn các câu hoặc mục còn vừa và kết «…»; riêng khi câu (hoặc mục) ĐẦU TIÊN đã dài hơn 400 thì cắt câu ấy ở khoảng trắng gần nhất trước trần rồi kết «…». Hai dạng đoạn mở bằng «Vì sao:» chỉ lấy phần lý do — không mở câu dẫn thành danh sách, không kèm gạch dính liền — ở cả ô này lẫn trang hồ sơ: (1) «Vì sao: Gốc: <con trỏ> … — <lý do>» (dạng --mo-o ghi, có dấu « — » cách hai bên) lấy phần sau « — » đầu tiên; (2) «Vì sao: <chữ>» không chứa «Gốc:» lấy phần sau tiền tố. Đoạn mở bằng «Vì sao:» mà có «Gốc:» nhưng KHÔNG có « — » là đoạn thường: giữ nguyên cả tiền tố, câu dẫn và danh sách dính liền theo luật chung. Trần 400 chỉ áp cho ô của dải và khối này; mục gập «Vì sao làm» của trang hồ sơ (evidence-page) in TRỌN cùng đoạn ấy — câu dẫn kèm mọi mục nguyên văn (hàng bảng: các ô nối « · »), đoạn có danh sách dính liền ngay dưới thì kèm danh sách ấy — không trần
moi_nguoi.trang_thai — chữ trạng thái, đúng bằng hang.trang_thai
moi_nguoi.ngay — ngày của mốc gần nhất trong hồ sơ YYYY-MM-DD, hoặc null
moi_nguoi.production — đã lên production chưa: câu của dòng quan sát người ghi (reality, /acceptance-gate:observed — máy không suy thay); chưa có dòng đó thì: kho KHÔNG khai nhánh production → «chưa ghi quan sát production» (như cũ); kho khai `production:` + `nhanh: <tên>` trong _acceptance/config.yaml → máy đọc git: «đã triển khai — gộp vào <nhánh> <ngày>; chưa ai ghi đã thấy chạy ở production», «chưa gộp vào <nhánh> (nhánh production kho khai)», hoặc «chưa đọc được triển khai ở đây — <lý do>»; null khi hồ sơ không có sổ quyết định và kho không khai nhánh
moi_nguoi.do_gi — sẽ đo gì, khi nào: câu hỏi phép đo và hạn của ô cơ hội
moi_nguoi.ket_qua — kết quả phiên nghiệm thu, hoặc «chưa đo»
moi_nguoi.chua_lam — «N mục để ngoài phạm vi · M giới hạn đã biết»: N là số gạch Out of scope của hợp đồng (mỗi gạch đầu dòng một mục, dòng bọc nối vào gạch của nó; mục không có gạch nào thì mỗi hàng bảng hoặc mỗi đoạn văn là một mục); M đọc ở hai nguồn — mục Known limits của báo cáo bằng chứng và khối giới hạn trong Notes của hợp đồng (gạch hay đoạn/tiêu đề mở đầu bằng Known limits · known-limit · Giới hạn đã biết · Hạn chế đã biết; mỗi gạch con hay gạch theo sau là một giới hạn) — hai nguồn cùng có thì lấy nguồn nhiều mục hơn, không cộng. Khối giới hạn đọc là MỘT danh sách gạch hoặc đánh số: đầu đoạn bọc nhiều dòng đọc trọn, gạch con lồng thuộc mục cha, gạch trong khối tự mở bằng «known-limits» đếm một lần; khối chỉ ghi «None.» / «Không có» (kể cả bọc dấu nhấn) ra 0, khối trống ra 0, một đoạn duy nhất ra 1. Hai loại khối: (a) khối CÓ BIÊN — tiêu đề `#…` mở bằng chữ giới hạn ở Notes (tới tiêu đề cùng hay cao cấp hơn) và mục Known limits của báo cáo (tới hết mục, hay tới khối `### Re-pin` mà làn ghim lại nối vào cuối báo cáo) — đọc được khi có đúng MỘT danh sách, đoạn dẫn trước hay đoạn sau bao nhiêu cũng được; có tiêu đề con, hai danh sách trở lên, hay hai đoạn trở lên mà không danh sách thì không đọc được; (b) khối KHÔNG BIÊN — đoạn văn ở Notes mở bằng chữ giới hạn (ở đầu đoạn, không phải dòng bọc giữa đoạn) — chỉ đọc tới hết danh sách ĐẦU TIÊN: danh sách ngay sau, hoặc MỘT đoạn dẫn rồi danh sách; hai đoạn trở lên trước danh sách thì không đọc được; mọi thứ sau danh sách đầu (danh sách khác, đoạn khác) không thuộc khối và không được đếm; đầu đoạn MANG CÂU (còn chữ sau dấu «:» đầu tiên) tự là một giới hạn, trừ khi danh sách theo ngay sau. Khối không đọc được thì KHÔNG in số — vế giới hạn là «giới hạn đã biết: chưa đọc được — khối giới hạn ở <hợp đồng | báo cáo | hợp đồng và báo cáo> không theo khuôn», kể cả khi nguồn kia đọc được (số của nó chỉ là cận dưới). Notes còn chỗ nhắc giới hạn mà đọc không ra thì không in 0: «giới hạn đã biết: chưa đọc được — Notes nhắc giới hạn sai khuôn», hoặc thêm «(Notes còn chỗ nhắc giới hạn sai khuôn)» sau số
moi_nguoi.ai_quyet — người quyết ở từng cổng
chu_kho.tieu_chi — số tiêu chí của hợp đồng
chu_kho.phep_do — số phép đo
chu_kho.luot_cham — số lượt chấm
chu_kho.token — tổng token đầu ra của mọi khối trong báo cáo token
chu_kho.quyet_dinh_may — số quyết định máy ghi
chu_kho.quyet_dinh_nguoi — số quyết định người ghi (có tên người, chữ ký cổng, dòng quan sát production)
chu_kho.ma — mã commit đã chấm, hoặc null
moc.ten — tên mốc
moc.ngay — ngày mốc YYYY-MM-DD
moc.hang — mã các việc gắn mốc
moc.con_viec — true khi còn việc gắn mốc chưa giao
moc.gio_may — tổng giờ máy các việc CHƯA giao của mốc, hoặc null khi mốc hết việc mở
moc.du_kien — ngày dự kiến hoàn tất (dự báo đóng băng lúc mốc bắt đầu), hoặc null khi mốc chưa có dự báo
moc.qua_tai — chữ cờ «mốc quá tải: dự kiến dd/mm, mục tiêu dd/mm» đúng như trang in, hoặc null
moc.hien — true khi mốc có ít nhất một việc hiện dưới nó (mục «Mô hình hiển thị chung»)
moc.viec_hien — mã các việc hiện dưới mốc: việc thuộc mốc ĐẦU TIÊN (theo ngày) liệt nó
moc.con_lai — số việc trong viec_hien chưa giao
gio_may.thap — cận dưới khoảng giờ máy ước (số)
gio_may.cao — cận trên khoảng giờ máy ước (số)
gio_may.nguon — khai (kho ghi gio_may trên việc) | luat (bảng luật, chưa đủ số đo) | do (đủ 5 vòng đã giao cùng hạng)
gio_may.chu — đúng chữ trang in dưới câu giao, vd «4–7 giờ máy (máy ước) · ~4 % hạn mức tuần»
gio_may.co — cờ số đo chưa đủ: nhãn trang in khi nguon là luat («máy ước», «máy ước, chưa khai hạng»…), null khi khai hay do
gio_may.phan_tram_tuan — % hạn mức tuần ước (số), hoặc null khi chưa đủ 5 vòng đo
gio_may.phan_tram_chu — chữ phần trăm: «~4 %» hoặc «chưa ước (k/5 vòng đo)»
gio_may_moc.thap — cận dưới tổng giờ máy của mốc (số)
gio_may_moc.cao — cận trên tổng giờ máy của mốc (số)
gio_may_moc.chu — đúng chữ giờ máy trên dòng mốc của trang, vd «~15,5–20 giờ máy»
gio_may_moc.phan_tram_tuan — tổng % hạn mức tuần của mốc (số), hoặc null khi chưa ước
gio_may_moc.phan_tram_chu — chữ % của mốc, vd «~8 % hạn mức tuần» hoặc «% hạn mức tuần chưa ước (k/5 vòng đo)»
du_kien.ngay_tinh — ngày đóng băng dự báo YYYY-MM-DD (lúc việc đầu tiên của mốc được mở)
du_kien.hoan_tat — ngày hoàn tất dự kiến YYYY-MM-DD
du_kien.chu — đúng chữ trang in, vd «dự báo lúc bắt đầu (16/10): hoàn tất 17/10»
da_bac.ma — mã việc đã bác
da_bac.ly_do — lý do bác
```
<!-- LO-TRINH-DU-LIEU-KHOA>>> -->

### Giờ máy và ngày dự kiến (cùng phiên bản 2, hàng RM6c)

Trang lộ trình in giờ máy dưới câu giao của mỗi việc, và trên dòng mỗi mốc: tổng giờ máy còn lại, dự báo đóng băng, cờ
quá tải. Khối mang đúng những chữ ấy kèm số: `hang.gio_may`, `moc.gio_may`, `moc.du_kien`, `moc.qua_tai`. Đây là thay
đổi CHỈ THÊM nên phiên bản khuôn vẫn là 2 (chủ kho chốt 16/10); bộ đọc cũ bỏ qua khoá mới như mọi khoá lạ.

- **Ngày dự kiến là dự báo ĐÓNG BĂNG, không phải dự báo sống.** Kit ghi dự báo của mốc lúc việc đầu tiên của mốc được mở
  (`--mo-o`), rồi giữ nguyên — nên trang và khối không đổi theo ngày. Mốc chưa có việc nào mở từ bản kit có giờ máy thì
  `du_kien` là `null`: hiện «chưa có ngày dự kiến», đừng tự tính từ ngày mục tiêu. Dự báo theo hôm nay có ở lệnh xem lộ
  trình (`/road-map:xem`), không ở khối.
- **Ngày theo mốc, không theo việc.** Trang không in ngày riêng từng việc; việc dùng ngày của mốc chứa nó (`moc.hang`).
- **Cờ số đo chưa đủ.** `gio_may.co` khác `null` khi giờ máy là máy ước theo bảng luật (chưa đủ 5 vòng đã giao cùng hạng
  có số đo) — hiện nó cạnh giờ máy như trang in «(máy ước)». `gio_may.phan_tram_chu` nói «chưa ước (k/5 vòng đo)» khi phần
  trăm hạn mức tuần chưa ước được.
- **Chữ là ĐÚNG chữ trang in.** `gio_may.chu`, `gio_may_moc.chu`, `du_kien.chu`, `qua_tai` hiện thẳng; số `thap`, `cao`,
  `phan_tram_tuan`, `ngay_tinh`, `hoan_tat` để sắp xếp, vẽ thanh, so với hôm nay.

### Mô hình hiển thị chung (cùng phiên bản 2, hồ sơ road-map-de-dung)

Luật hiển thị lộ trình sống MỘT chỗ — khối dữ liệu mang sẵn kết quả, và trang kit, lệnh xem lộ trình (`/road-map:xem`) lẫn
trang Lộ trình trong sản phẩm của kho CHỈ VẼ từ đó, không tự lọc lại (chủ kho 17/10: «Lộ trình CRM và lộ trình của phiên đọc
cùng một nguồn; khi Lộ trình CRM đọc đúng thì phiên cũng phải đồng nhất»). Năm khoá, thay đổi CHỈ THÊM nên phiên bản vẫn là 2:

- **Mốc nào hiện:** `moc.hien` — chỉ mốc có việc gắn. Mốc `hien: false` không vẽ (trang kit chỉ đếm chúng ở tiêu đề).
- **Việc nào dưới mốc nào:** `moc.viec_hien` — một việc chỉ hiện dưới mốc ĐẦU TIÊN liệt nó (mốc sắp theo ngày); mã trong
  `moc.hang` mà kế hoạch không có thì không vào. `moc.con_lai` đếm việc chưa giao trong đó.
- **Nhóm chưa hẹn mốc:** `lo_trinh.chua_hen_moc` — mọi việc không ở `viec_hien` của mốc nào.
- **Tên việc:** `hang.ten_hien_thi` — câu giao đầy đủ (đã bỏ một cặp «» bao trọn câu); vắng thì tên ngắn, rồi tên, rồi mã.
  Mã là chữ phụ cạnh tên, không thay tên.
- **Trạng thái bằng chữ:** `hang.trang_thai` như cũ.

Bộ đọc gặp trang vẽ bằng bản kit chưa có năm khoá: `ten_hien_thi`, `hien`, `con_lai` là `null`, `viec_hien` và
`chua_hen_moc` rỗng, và đúng một cờ vàng «khối chưa mang mô hình hiển thị» — giữ luật lọc riêng của kho tới khi trang được
vẽ lại.

### Khoá tuỳ chọn `tin_hieu` (cửa tín hiệu)

Kho khai cửa tín hiệu (`tin_hieu.nguon` + `tin_hieu.gom` trong `_acceptance/config.yaml`, skill
`gom-tin-hieu`) thì khối mang thêm khoá gốc `tin_hieu`: mảng, mỗi phần tử là đường đi của MỘT tín hiệu —
để bản chiếu hiện cho người gửi tín hiệu của họ tới đâu. Kho không khai thì khối KHÔNG có khoá này (không
phải mảng rỗng) và giống từng byte bản trước; khoá không nằm trong bảng khoá chuẩn ở trên, `phien_ban`
không đổi, và bộ đọc mẫu `docDuLieu` giữ nó nguyên vẹn như mọi khoá lạ. Bản chiếu coi «không có khoá» là
«kho chưa mở cửa tín hiệu». Mảng chỉ mang tín hiệu mà tệp ĐÃ ĐƯỢC GIT THEO DÕI trong chính cây vẽ trang (từ
2.32.1, hồ sơ `ve-lo-trinh-doc-tin-hieu-cua-cay`): trang là vật commit và CI vẽ lại từ bản tải sạch, nên ý chưa
commit chỉ lên trang khi được commit — nó vẫn hiện ở thẻ khởi động và `/road-map:xem`. Trường của một phần tử:

<!-- <<<LO-TRINH-DU-LIEU-TUY-CHON -->
```
tin_hieu.id — tên tệp tín hiệu bỏ đuôi (khuôn <phiên>-<số>)
tin_hieu.loai — tin-hieu (người gửi) · viec-phu · hang-moi
tin_hieu.tieu_de — tiêu đề tín hiệu
tin_hieu.luc — lúc gửi (ISO)
tin_hieu.cho — chua-gom · le · da-phu · nhom-chua-cat · chan-troi · hang-chua-ho-so · hang-co-ho-so
tin_hieu.nhom — mã nhóm trong bản gom (null khi không ở nhóm)
tin_hieu.ten_nhom — tên nhóm bằng tiếng sản phẩm
tin_hieu.ly_do — lý do lẻ, hoặc lý do để sau của mục chờ điều kiện
tin_hieu.ho_so_phu — hồ sơ đã giao phủ tín hiệu (ngăn đã phủ)
tin_hieu.hang — mã việc trong lộ trình mà nhóm đã thành
tin_hieu.ho_so — hồ sơ của việc đó
tin_hieu.trang_thai — chữ trạng thái, đúng chữ trang lộ trình in cho việc / hồ sơ
tin_hieu.cau — câu cho chủ kho, có mã việc và tên hồ sơ để lần (giữ nguyên từ 2.27)
tin_hieu.cau_nguoi_gui — câu cho người gửi: tiếng sản phẩm, không mã, không từ nội bộ (kit ≥ 2.29)
```
<!-- LO-TRINH-DU-LIEU-TUY-CHON>>> -->

**Câu hiện cho người gửi.** Đọc `tin_hieu[].cau_nguoi_gui` — vd «đã vào nhóm "Nhân viên tìm được quy
trình" và thành việc "Tra quy trình trong một phút" — đã giao ngày 12/10/2026». Kit dựng nó từ tên nhóm,
câu giao của việc và ngày ký; lệnh `scripts/tin-hieu.mjs --root . --cau` của kho kiểm không câu nào lọt mã
hay từ nội bộ. Trường `cau` là câu cho chủ kho (có mã để lần) — đừng hiện nó cho người không dùng git.
Trang vẽ bằng kit cũ (trước 2.29) không có `cau_nguoi_gui`: bản chiếu lùi về `cau` và hiện MỘT cờ vàng
«bản vẽ cũ — chưa có câu cho người gửi», đúng như bộ đọc mẫu `cauChoNguoiGui` trong `scripts/tin-hieu.mjs`
(trả `{ cau, co }`, `co` là cờ hoặc `null`). Vẽ lại trang bằng kit ≥ 2.29 thì cờ tự hết.

Những gì bản chiếu thường cần:

- **Mỗi việc đang ở đâu:** `hang.trang_thai` (chữ hiện cho người) và `hang.nhom_trang_thai` (để tô màu,
  đếm, lọc). Bốn nhóm cộng lại đúng bằng `tien_do`.
- **Lọc theo phòng ban hay đội:** `hang.nhom` — giá trị do kho ghi trong tệp kế hoạch.
- **Việc kế tiếp:** `lo_trinh.hang_ke`; `lenh` là dòng người dán vào Claude Code để mở việc.
- **Chỗ kế hoạch đang lệch hồ sơ:** `lo_trinh.can_sua` và `hang.co`.
- **Ai đang làm:** `hang.ho_so` trỏ hồ sơ `_acceptance/<ho_so>/` trong kho.
- **Một việc trong một phút:** `hang.tom_tat` — mỗi ô `null` nghĩa là hồ sơ chưa có tệp mang ô đó; hiện
  «chưa có», đừng tự tính. Khối KHÔNG có số PR (chỉ có sau khi gộp — trang sẽ lệch phép so của CI ngay
  sau mỗi lần gộp) và KHÔNG có «số lần gọi người» (chưa có máy đếm); `chu_kho.ma` đủ để lần ra PR.

## Đọc khoan dung

Bộ đọc của bản chiếu không bao giờ được làm trang của nó vỡ:

| Gặp | Làm |
|---|---|
| trang không có khối (vẽ bằng kit trước 2.27) | không có dữ liệu; báo «trang chưa mang dữ liệu lộ trình — vẽ lại bằng bộ kit từ 2.27» |
| khối không phải JSON | không có dữ liệu; báo lỗi JSON |
| `khuon` khác `lo-trinh-du-lieu` | không có dữ liệu; báo tên khuôn |
| `phien_ban` lớn hơn bản mình biết | vẫn đọc phần biết; báo một cờ vàng «khuôn mới hơn bộ đọc» |
| `phien_ban` 1 (trang vẽ bằng khuôn bản 1) | đọc đủ; mọi `hang.tom_tat` là `null`; báo một cờ vàng «khuôn bản 1» |
| việc không có khoá `gio_may` (trang vẽ bằng kit trước khi khối mang giờ máy) | đọc đủ; mọi `hang.gio_may`, `moc.gio_may`, `moc.du_kien`, `moc.qua_tai` là `null`; báo một cờ vàng «chưa có giờ máy và ngày dự kiến» |
| lộ trình không có khoá `chua_hen_moc` (trang vẽ bằng kit trước mô hình hiển thị chung) | đọc đủ; `hang.ten_hien_thi`, `moc.hien`, `moc.con_lai` là `null`, `moc.viec_hien` và `chua_hen_moc` rỗng; báo một cờ vàng «khối chưa mang mô hình hiển thị» |
| thiếu khoá | coi như rỗng theo kiểu (mảng rỗng, `false`, `0`, `null`, chuỗi rỗng); riêng ô của dải (`moi_nguoi.*`, `chu_kho.*`) và ô của giờ máy / dự kiến (`gio_may.*`, `gio_may_moc.*`, `du_kien.*`) là `null`, và nhóm dải vắng là object đủ khoá toàn `null` |
| khoá lạ | giữ nguyên, bỏ qua |

Kit chỉ THÊM khoá trong cùng phiên bản; đổi nghĩa hay bỏ khoá là phiên bản mới, và trang cũ vẫn
đọc được bằng bộ đọc mới.

## Luật duy nhất bản chiếu tự làm — so ngày

«Hôm nay» là **ngày lịch của người xem** (theo giờ máy của họ), viết `YYYY-MM-DD`. Một mốc là «đã qua»
khi ngày mốc ĐỨNG TRƯỚC hôm nay — đúng ngày mốc thì chưa qua. Trang `LO-TRINH.html` tính đúng như vậy;
ca đo của kit chạy hàm dưới đây cạnh script của trang ở nhiều ngày và hai múi giờ, lệch là đỏ.

<!-- <<<LO-TRINH-DU-LIEU-LUAT-NGAY -->
```js
// Mốc đã qua mà còn việc chưa giao — trang tô «đã qua — còn việc chưa giao».
function mocQuaConViec(moc, homNay) {
  return /^\d{4}-\d{2}-\d{2}$/.test(moc.ngay) && moc.ngay < homNay && moc.con_viec === true;
}
// Việc trễ: việc gắn một mốc đã qua mà chưa giao — mỗi mã một lần, theo thứ tự mốc.
function viecTre(loTrinh, homNay) {
  const theoMa = new Map(loTrinh.hang.map(h => [h.ma, h]));
  const ra = [];
  for (const m of loTrinh.moc) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(m.ngay) || !(m.ngay < homNay)) continue;
    for (const ma of m.hang) {
      const h = theoMa.get(ma);
      if (h && h.nhom_trang_thai !== 'da-giao' && !ra.includes(ma)) ra.push(ma);
    }
  }
  return ra;
}
```
<!-- LO-TRINH-DU-LIEU-LUAT-NGAY>>> -->

Mọi thứ khác — trạng thái, nhóm, hàng kế, cờ, tiến độ — đọc thẳng từ khối. Bản chiếu nào thấy mình
đang viết luật suy trạng thái từ hồ sơ là đang dựng một nguồn sự thật thứ hai: dừng, và báo cho người
giữ kit thứ mình thiếu.
