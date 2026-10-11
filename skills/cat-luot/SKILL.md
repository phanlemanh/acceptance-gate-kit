---
name: cat-luot
description: Cắt một bản phạm vi (danh sách mã của đội sản phẩm, một khảo sát, hoặc Core của quét hình thái) thành các hàng của lộ trình kho theo sáu luật, kèm chân trời có lý do và bảng phủ máy sinh — mọi mã ở đúng một chỗ. Dùng khi kho khai lo_trinh.tep và một đợt phạm vi mới tới: «cắt lượt», «đưa bản phạm vi vào lộ trình», «thêm đợt mới vào kế hoạch», «cắt Core thành hàng». KHÔNG dùng để mở vòng một hàng (đó là feature-loop), KHÔNG để ghi trạng thái vào tệp lộ trình, KHÔNG xếp điểm ưu tiên tự động.
---

# Cắt lượt

Biến một **bản phạm vi** thành các **hàng** của lộ trình kho (khoá `lo_trinh.tep` trong
`_acceptance/config.yaml`), cùng các mục **chân trời** cho mã chưa cắt được, rồi để **răng phủ** —
một lệnh tất định, chỉ đọc — chứng rằng mọi mã nằm ở đúng một chỗ. Người gộp PR là người chốt.

Kit (mã) không bao giờ ghi trạng thái vào tệp lộ trình: trạng thái từng hàng do máy suy từ hồ sơ và chỉ
hiện trên trang lộ trình. Hàng và chân trời là Ý ĐỊNH — phiên ghi chúng vào tệp như mọi thay đổi người
duyệt bằng PR.

Gốc lệnh: `AG` là gốc gói acceptance-gate. Harness đặt `${CLAUDE_PLUGIN_ROOT}`; kho tự host kit đặt
`AG=.` trước khi chạy.

## Bước 1 — có bản phạm vi trong git

Bản phạm vi là MỘT tệp markdown theo khuôn `skills/acceptance/references/pham-vi-template.md` (đọc
khuôn trước): ba khoá `dot` · `dang` · `nguon`, mỗi dòng `- \`<mã>\` — <mô tả>` một mã.

- Đội sản phẩm gửi văn bản tự do → chép từng mục thành một dòng mã, GIỮ mã gốc nếu văn bản có mã
  (`#7`, `KH1`, `R1m-2`); không có mã thì đánh mã ngắn theo nhóm (`A1`, `A2`, `B1`…).
- Đầu vào là Core của quét hình thái (skill `morphological-scan`) → mỗi ô Core một mã `C1…Cn`; ô Later
  thành mã sẽ vào chân trời, ô Never vào `da_bac` của tệp lộ trình kèm lý do.
- `dang`: `chuoi` khi các mục là một chuỗi tính năng nối nhau; `lan-va` khi là các lỗi, vá rời từ một
  khảo sát.

Commit tệp này lên nhánh của lượt cắt. Răng từ chối bản phạm vi không có trong git — không có bản gốc
thì không ai so được phủ.

## Bước 2 — đọc nhịp và lộ trình hiện có

<!-- <<<CAT-LUOT-NHIP -->
```bash
AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/cat-luot.mjs" --root . --nhip
```
<!-- CAT-LUOT-NHIP>>> -->

Lệnh in trung vị số ngày từ lúc chốt phạm vi tới lúc ký Cổng Bằng chứng theo hạng, đo từ hồ sơ đã ký
của kho. `n: 0` ở một hạng → KHÔNG đặt ngày cho hàng hạng ấy; để trống còn hơn bịa.

Rồi đọc **đồng hồ cỡ** — bảng cỡ vòng → số lượt chấm → tỉ lệ chạm trần, đo lại từ chính hồ sơ của kho
mỗi lần chạy (chỉ đọc, không ghi gì):

<!-- <<<CAT-LUOT-CO-LENH -->
```bash
AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/cat-luot.mjs" --root . --co
```
<!-- CAT-LUOT-CO-LENH>>> -->

Bốn nhóm theo khối khoảng cỡ ở bước 3 (dưới mục tiêu · mục tiêu · cho phép · phải tách): `n_chot` là số
vòng đã chốt phạm vi, `n` · `luot_tb` · `cham_tran_pt` đo trên vòng đã giao có lượt chấm, `it_du_lieu:
true` khi `n` quá nhỏ để tin. Đặt bảng cạnh khối khoảng: số của kho nói khác chính sách (nhóm «cho phép»
chạm trần nhiều hơn nhóm «phải tách», hay nhóm mục tiêu không rẻ hơn) thì NÊU trong mô tả PR cắt lượt
cho chủ kho xét — KHÔNG tự sửa khối; khoảng là chính sách của chủ kho, đồng hồ chỉ là đồng hồ. Thêm
`--tu <YYYY-MM-DD>` để chỉ đếm vòng chốt từ một ngày, `--lo-trinh <tệp>` để so cỡ khai lúc cắt
(`tieu_chi`) với số tiêu chí thật của hợp đồng hàng đã mở (`du_kien`).

Đọc tệp lộ trình hiện có: mã đã dùng (mã mới không trùng), hàng đã giao (hàng mới đứng trên dữ liệu
thật của chúng), khối `moc` (mốc ngoài là ràng buộc).

## Bước 3 — cắt theo sáu luật

<!-- <<<CAT-LUOT-SAU-LUAT -->
```
1. Mỗi hàng MỘT kết quả, câu giao (`cau_giao`) đúng một trong hai dáng: việc người dùng thấy → mở bằng vai (`vai`); việc nền → hành vi hệ thống đo được (`vai: nen` + `bat_khi`), không ép «Là kỹ sư…».
2. Hàng sau đứng trên dữ liệu thật của hàng trước (`dung_tren`) — chỉ khi nó thật sự cần hàng trước đã giao.
3. Không chạm hai lớp khó đảo trong một hàng (dữ liệu người dùng, quyền, đăng nhập, tiền): tách thành hai hàng.
4. Cỡ hàng theo khoảng tiêu chí của khối CAT-LUOT-CO (`tieu_chi`): từ `tach_tu` thì tách, dưới mục tiêu thì xét gộp với hàng cùng nhóm.
5. Ngày rơi ra từ thứ tự và nhịp; hàng gắn mốc không được muộn hơn ngày mốc.
6. Mã không cắt được thành câu giao thì vào chân trời kèm lý do và điều kiện mở lại — không bỏ lặng.
```
<!-- CAT-LUOT-SAU-LUAT>>> -->

**Khoảng cỡ** — chính sách của chủ kho, MỘT nguồn: răng đọc thẳng khối dưới đây, không số nào nằm trong
mã. Đổi chính sách là sửa khối này, cùng PR với bảng đồng hồ làm căn cứ.

<!-- <<<CAT-LUOT-CO -->
```
muc_tieu: 8-10
cho_phep_den: 12
tach_tu: 13
tran_luot_cham: 3
it_du_lieu_duoi: 10
```
<!-- CAT-LUOT-CO>>> -->

Mục tiêu 8–10 tiêu chí; 11–12 chỉ khi kết quả không tách được mà giữ nghĩa (ghi vì sao vào `ghi_chu`);
từ 13 bắt buộc tách. Ước số tiêu chí của vòng hàng ấy sẽ mở — mỗi tiêu chí là một điều người duyệt
kiểm được ở Cổng Bằng chứng — và ghi vào `tieu_chi`. Một câu giao gói hai, ba kết quả rời thì ước lớn và
tách; nhiều mã cắt theo gốc kỹ thuật (bảng, khoá, hàng đợi) mà không mã nào tự giao được một kết quả thì
gộp chúng vào hàng của kết quả chúng phục vụ.

**Hai dáng câu giao:**

- **Việc người dùng thấy** → câu MỞ bằng vai, nói người ấy làm gì và thấy gì: `"vai": "Trưởng phòng ban"`,
  `"cau_giao": "«Trưởng phòng ban mở trang OKR và thấy KR nào của đơn vị đang trễ»"`.
- **Việc nền** (không có người dùng cuối — một răng, một bộ đọc, một hàng đợi) → hành vi hệ thống đo
  được, vai `nen`, ngưỡng đo ở `bat_khi`: `"vai": "nen"`, `"cau_giao": "«Lệnh đồng bộ chạy lại không nhân
  đôi bản ghi»"`, `"bat_khi": "Mười lượt chạy lại liên tiếp, số bản ghi không đổi"`. Không viết «Là kỹ
  sư, tôi muốn…» — việc nền không có người để đóng vai.

Hai dáng cắt, theo `dang` của bản phạm vi:

- **`chuoi`** — chuỗi tính năng: áp đủ sáu luật; `dung_tren` nối hàng theo dữ liệu thật.
- **`lan-va`** — làn vá từ một khảo sát: gói mã theo màn hoặc vùng sản phẩm (một câu giao nói một màn
  chạy đúng); các hàng chạy song song nên KHÔNG đặt `dung_tren` giả giữa chúng; luật 1 hiểu là «một màn,
  một câu», luật 3 vẫn tách lớp khó đảo (một vá chạm đăng nhập thì thành hàng riêng, hạng T3).

Mỗi hàng ghi theo khuôn `skills/acceptance/references/lo-trinh-template.json`: `ma`, `cau_giao`,
`vi_sao`, `hang`, `dung_tren`, `bat_khi`, cộng bốn trường của lượt cắt: `dot` (đúng `dot` của bản phạm
vi), `phu` (danh sách mã bản phạm vi mà hàng gánh), `vai` (dáng câu giao) và `tieu_chi` (cỡ dự kiến).
Bốn trường này chỉ lượt cắt ghi và răng đọc — agent mở vòng làm từ hợp đồng, phép đo và kế hoạch của
vòng, không đọc trường nào cho riêng nó từ lộ trình; đừng thêm trường cho agent. Mã chưa cắt được vào khối `chan_troi` cấp tệp:
`{ "ma", "dot", "cau_giao", "ly_do", "phu", "mo_lai_khi" }`. Không ghi `trang_thai`, `pr`, `buoc_ke` —
máy suy và vẽ chúng.

## Bước 4 — ghi hàng, chạy răng, rồi mới mở PR

Thứ tự này có răng: ghi hàng → chạy răng → xanh mới mở PR.

1. **Ghi hàng** và chân trời vào tệp lộ trình, trên CÙNG nhánh với bản phạm vi, rồi commit.
2. **Chạy răng:**

<!-- <<<CAT-LUOT-RANG -->
```bash
AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/cat-luot.mjs" --root . --pham-vi <bản phạm vi> --lo-trinh <tệp lộ trình>
```
<!-- CAT-LUOT-RANG>>> -->

   Thoát 0 → in bảng phủ (mỗi mã → hàng hoặc chân trời). Thoát 1 → mỗi dòng `lỗi:` nêu mã — sửa hàng
   rồi chạy lại; KHÔNG sửa bảng phủ bằng tay, bảng phủ là đầu ra của răng.

   Răng còn gắn cờ có tên cho cỡ và dáng câu giao, dạng `hàng <mã> [<cờ>]: …`. Hàng ngoài đợt đang cắt
   không đổi mã thoát: mỗi cờ gom thành MỘT dòng `cảnh báo: [<cờ>] <k> hàng ngoài đợt …`.

<!-- <<<CAT-LUOT-BANG-CO -->
| cờ | khi | mức (hàng trong đợt) |
|---|---|---|
| `can-tach` | `tieu_chi` từ `tach_tu` | lỗi |
| `tren-muc-tieu` | `tieu_chi` trên mục tiêu, tới `cho_phep_den` | cảnh báo |
| `duoi-muc-tieu` | `tieu_chi` dưới mục tiêu; kèm «gộp được với …» khi hàng cùng `nhom` cũng dưới mục tiêu và tổng không quá `cho_phep_den` | cảnh báo |
| `tieu-chi-sai-kieu` | `tieu_chi` không phải số nguyên dương | lỗi |
| `chua-uoc-tieu-chi` | thiếu `tieu_chi` | cảnh báo |
| `vai-khong-mo-cau` | câu giao không mở bằng `vai` đã khai | lỗi |
| `nen-thieu-bat-khi` | `vai: nen` mà `bat_khi` rỗng | lỗi |
| `chua-khai-dang-giao` | thiếu `vai` | cảnh báo |
<!-- CAT-LUOT-BANG-CO>>> --> Thoát 2 → tệp chưa vào git
   hoặc bản phạm vi không đọc ra mã nào. Dòng `cảnh báo:` nói về hàng ngoài đợt này (cắt tay đời trước):
   ghi vào mô tả PR, không sửa hàng không thuộc lượt cắt.
3. **Xanh mới mở PR** — một PR cho cả đợt: bản phạm vi + hàng + chân trời. Dán bảng phủ của răng vào mô
   tả PR. Người gộp PR là người chốt lượt cắt (một chạm).

Kho vẽ lại trang lộ trình trong cùng PR (`product-map.mjs`) nếu CI của kho chạy `--check`.
