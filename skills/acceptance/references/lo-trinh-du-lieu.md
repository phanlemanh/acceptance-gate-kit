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
   đúng năm ca ở mục «Đọc khoan dung». Ca đo của kit chạy chính bản chép rời ấy (ngoài mô-đun) và
   so kết quả với bản trong mô-đun, nên hàm thôi tự đủ là bộ kiểm đỏ.

## Khuôn — phiên bản 1

Mỗi dòng trong khối dưới là `cấp.khoá — nghĩa`. Cấp `goc` là object ngoài cùng; `lo_trinh` là mỗi
phần tử của `goc.lo_trinh`; `hang`, `moc`, `da_bac`, `can_sua` là mỗi phần tử của mảng cùng tên trong
một lộ trình; `hang_ke`, `tien_do` là object trong một lộ trình.

<!-- <<<LO-TRINH-DU-LIEU-KHOA -->
```
goc.khuon — luôn "lo-trinh-du-lieu"
goc.phien_ban — số phiên bản khuôn (1)
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
moc.ten — tên mốc
moc.ngay — ngày mốc YYYY-MM-DD
moc.hang — mã các việc gắn mốc
moc.con_viec — true khi còn việc gắn mốc chưa giao
da_bac.ma — mã việc đã bác
da_bac.ly_do — lý do bác
```
<!-- LO-TRINH-DU-LIEU-KHOA>>> -->

Những gì bản chiếu thường cần:

- **Mỗi việc đang ở đâu:** `hang.trang_thai` (chữ hiện cho người) và `hang.nhom_trang_thai` (để tô màu,
  đếm, lọc). Bốn nhóm cộng lại đúng bằng `tien_do`.
- **Lọc theo phòng ban hay đội:** `hang.nhom` — giá trị do kho ghi trong tệp kế hoạch.
- **Việc kế tiếp:** `lo_trinh.hang_ke`; `lenh` là dòng người dán vào Claude Code để mở việc.
- **Chỗ kế hoạch đang lệch hồ sơ:** `lo_trinh.can_sua` và `hang.co`.
- **Ai đang làm:** `hang.ho_so` trỏ hồ sơ `_acceptance/<ho_so>/` trong kho.

## Đọc khoan dung

Bộ đọc của bản chiếu không bao giờ được làm trang của nó vỡ:

| Gặp | Làm |
|---|---|
| trang không có khối (vẽ bằng kit trước 2.27) | không có dữ liệu; báo «trang chưa mang dữ liệu lộ trình — vẽ lại bằng bộ kit từ 2.27» |
| khối không phải JSON | không có dữ liệu; báo lỗi JSON |
| `khuon` khác `lo-trinh-du-lieu` | không có dữ liệu; báo tên khuôn |
| `phien_ban` lớn hơn bản mình biết | vẫn đọc phần biết; báo một cờ vàng «khuôn mới hơn bộ đọc» |
| thiếu khoá | coi như rỗng theo kiểu (mảng rỗng, `false`, `0`, `null`, chuỗi rỗng) |
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
