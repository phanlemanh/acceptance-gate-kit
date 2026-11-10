---
name: cat-luot
description: Cắt một bản phạm vi (danh sách mã của đội sản phẩm, một khảo sát, hoặc Core của quét hình thái) thành các hàng của lộ trình kho theo sáu luật, kèm mục chờ điều kiện có lý do, việc vận hành của người ra khỏi kho (không vào bản phạm vi, liệt «Ra khỏi kho» ở mô tả PR), và bảng phủ máy sinh — mọi mã phát triển ở đúng một chỗ. Dùng khi kho khai lo_trinh.tep và một đợt phạm vi mới tới: «cắt lượt», «đưa bản phạm vi vào lộ trình», «thêm đợt mới vào kế hoạch», «cắt Core thành hàng». KHÔNG dùng để mở vòng một hàng (đó là feature-loop), KHÔNG để ghi trạng thái vào tệp lộ trình, KHÔNG xếp điểm ưu tiên tự động.
---

# Cắt lượt

Biến một **bản phạm vi** thành các **hàng** của lộ trình kho (khoá `lo_trinh.tep` trong
`_acceptance/config.yaml`), cùng các mục **chờ điều kiện** (khoá `chan_troi`) cho mã chưa cắt được, rồi để **răng
phủ** — một lệnh tất định, chỉ đọc — chứng rằng mọi mã nằm ở đúng một chỗ trong hai. Việc của người không thành mục
nào trên lộ trình (luật 17/10, ADR 0026 — bước 2b). Người gộp PR là người chốt. Lộ trình chỉ chứa việc PHÁT TRIỂN mà máy giao và
chứng minh được (bước 2b).

Kit (mã) không bao giờ ghi trạng thái vào tệp lộ trình: trạng thái từng hàng do máy suy từ hồ sơ và chỉ
hiện trên trang lộ trình. Hàng và mục chờ điều kiện là Ý ĐỊNH — phiên ghi chúng vào tệp như mọi thay đổi người
duyệt bằng PR.

Gốc lệnh: `AG` là gốc gói acceptance-gate. Harness đặt `${CLAUDE_PLUGIN_ROOT}`; kho tự host kit đặt
`AG=.` trước khi chạy.

## Bước 1 — có bản phạm vi trong git

Bản phạm vi là MỘT tệp markdown theo khuôn `skills/acceptance/references/pham-vi-template.md` (đọc
khuôn trước): ba khoá `dot` · `dang` · `nguon`, mỗi dòng `- \`<mã>\` — <mô tả>` một mã. Kho khai `tri_thuc`: `nguon`
là các đường trỏ băm (`<đường>#<git hash-object>`, cách nhau dấu phẩy) tới trang tri thức dưới `wiki/` đã vào git — răng
phủ từ chối liên kết, chữ tự do và tệp chưa vào git (hồ sơ o-mo-viec-mang-nguon).

- Xếp từng mục theo bước 2b TRƯỚC khi chép: chỉ mục PHÁT TRIỂN thành dòng mã; việc vận hành thuần KHÔNG chép vào bản
  phạm vi — liệt nó dưới dòng «Ra khỏi kho» ở mô tả PR (bước 4).
- Đội sản phẩm gửi văn bản tự do → chép từng mục phát triển thành một dòng mã, GIỮ mã gốc nếu văn bản có mã
  (`#7`, `KH1`, `R1m-2`); không có mã thì đánh mã ngắn theo nhóm (`A1`, `A2`, `B1`…).
- Đầu vào là Core của quét hình thái (skill `morphological-scan`) → mỗi ô Core một mã `C1…Cn`; ô Later
  thành mã sẽ vào mục chờ điều kiện, ô Never vào `da_bac` của tệp lộ trình kèm lý do.
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
true` khi `n` quá nhỏ để tin; `n_giu` là số vòng đã chốt mang dòng sổ «giữ cỡ — <lý do>» (vòng giữ
nguyên cỡ có tên ở Cổng Phạm vi — thẻ Cổng 1 đọc dòng ấy bằng cùng bộ đọc `scripts/co-hop-dong.cjs`). Đặt số đo cạnh khối khoảng: số của kho nói khác chính sách (nhóm «cho
phép» chạm trần nhiều hơn nhóm «phải tách», hay nhóm mục tiêu không rẻ hơn) thì dán số đo của đồng hồ
cỡ vào mô tả PR cắt lượt và báo chủ kit — KHÔNG sửa khối. Khoảng là chính sách của KIT, đi theo bản
phát hành: ở kho tiêu thụ, SKILL này nằm trong bộ đệm plugin — sửa ở đó là mất ở lần cài sau và không
ai thấy. Đồng hồ chỉ là đồng hồ. Thêm
`--tu <YYYY-MM-DD>` để chỉ đếm vòng chốt từ một ngày, `--lo-trinh <tệp>` để so cỡ khai lúc cắt
(`tieu_chi`) với số tiêu chí thật của hợp đồng hàng đã mở (`du_kien`).

Đọc tệp lộ trình hiện có: mã đã dùng (mã mới không trùng), hàng đã giao (hàng mới đứng trên dữ liệu
thật của chúng), khối `moc` (mốc là ràng buộc ngày).

## Bước 2b — việc của người ra khỏi lộ trình (trước sáu luật)

Lộ trình chỉ chứa việc PHÁT TRIỂN mà máy giao và chứng minh được. Việc VẬN HÀNH là việc người làm ngoài
sản phẩm — kết quả của nó là một hành động của người, không phải một hành vi của sản phẩm mà máy chứng
được. Luật 17/10 (ADR 0026): việc của người KHÔNG thành mục nào trên lộ trình — không hàng, không mốc. Xếp từng mục của
đầu vào theo năm luật dưới TRƯỚC khi chép bản phạm vi; chỉ mã phát triển đi tiếp vào sáu luật của bước 3. Mã «không làm»
giữ luật cũ: mục chờ điều kiện có `ly_do`, hoặc `da_bac`.

<!-- <<<CAT-LUOT-VAN-HANH -->
```
1. Mỗi mục xếp một trong năm: phát triển (máy giao và chứng được) · sự kiện của người tạo HẠN (ngày công bố, ngày dùng thật, mùa báo cáo) · đo giá trị (phiên nghiệm thu, đọc số sau N ngày) · vận hành thuần (gửi danh sách, đào tạo, gom góp ý, người DÙNG một tính năng mà hàng khác giao) · việc phát triển cần KẾT QUẢ của một việc vận hành. Không mục nào thành mốc `loai: ngoai` — răng báo `[moc-ngoai-da-bo]`.
2. Sự kiện tạo hạn → `ngay` của chính mốc phát triển bị ràng buộc (mốc `phat-hanh`, `han` hay `han-cung` gắn các hàng phải xong trước); sự kiện không thành mục — ghi nó dưới «Ra khỏi kho» ở mô tả PR kèm tên mốc nhận hạn. Chọn loại: người làm sự kiện NGAY TRONG công cụ vào một ngày đã định (đặt, công bố, dùng thật) nên công cụ trễ là sự kiện hỏng → `han-cung`; ngày là đích hướng tới, công cụ trễ thì người vẫn làm được bằng đường cũ (mùa báo cáo nộp tay) → `han`; mốc cắt bản → `phat-hanh`. Lộ trình chưa có mốc mang ngày ấy → phiên cắt TẠO mốc mới: `ten` = sự kiện + điều công cụ phải sẵn, `hang` = mọi hàng giao thao tác mà sự kiện dùng (sự kiện «đặt và công bố» → hàng đặt và hàng công bố).
3. Đo giá trị → ngưỡng và ngày đọc vào ô cơ hội (`opportunity.md`) của hàng mà nó đo — mở ở Cổng Đáng của hàng ấy; kết quả do người ghi bằng lệnh `/acceptance-gate:observed` (ADR 0020). Mã của nó (nếu có) là mã của hàng ấy (`phu`).
4. Vận hành thuần → ra khỏi kho: KHÔNG chép vào bản phạm vi; liệt dưới dòng «Ra khỏi kho» ở mô tả PR (một dòng mỗi việc: việc · ai làm · ngày nếu có) để người gộp PR thấy. Việc vận hành LẶP LẠI: việc tự phục vụ thay nó là mã phát triển — lặp theo KỲ trong cùng tổ chức (mỗi quý) → một hàng ngay; lặp theo TỔ CHỨC hay KHO mới mà mới có một → mục chờ điều kiện mở lại khi có cái thứ hai thật (phanh «không phổ quát quá sớm»). Mã của mục vận hành — thuần hay lặp — KHÔNG vào bản phạm vi và KHÔNG vào `phu` của hàng nào, kể cả hàng tự phục vụ thay nó: hàng (hay mục chờ) ấy do phiên cắt TẠO, mã mới, `phu` rỗng; mục vận hành vẫn đứng ở «Ra khỏi kho» kèm mã hàng hay mục chờ thay nó. «Mới có một» đếm từ đầu vào hay Product Context của kho; không nguồn nào nêu số → coi là mới có một.
5. Hàng cần kết quả của một việc vận hành: cần DỮ LIỆU thì dùng dữ liệu giả có nhãn — phép thử: hàng có tiêu chí đo trên dữ liệu mà một việc vận hành CHƯA xảy ra tạo ra (cập nhật tuần, câu hỏi thật, tệp thật của phòng ban); hàng chỉ cần thao tác của chính tính năng (tạo, bấm, giao, duyệt) thì không khai `du_lieu`. Rồi (i) máy sinh từ khuôn dữ liệu thật, không viết tay — hàng sinh mang `du_lieu` = `sinh-gia` (phiên cắt TẠO hàng này khi bản phạm vi không có mã cho nó, `phu` rỗng); (ii) hàng đo trên nó mang `du_lieu` = `gia` và đứng TRỰC TIẾP trên hàng sinh; tiêu chí chỉ đo được trên dữ liệu thật thành ô bỏ qua có tên; (iii) thực tế vẫn là đồng hồ cuối. Cần PHẠM VI chỉ biết sau việc vận hành (vd sửa danh sách góp ý sẽ gom) thì vào mục chờ điều kiện, `mo_lai_khi` nêu việc ấy. Không hàng nào đứng chờ người: `dung_tren` chỉ trỏ hàng.
```
<!-- CAT-LUOT-VAN-HANH>>> -->

## Bước 3 — cắt theo sáu luật

<!-- <<<CAT-LUOT-SAU-LUAT -->
```
1. Mỗi hàng MỘT kết quả, câu giao (`cau_giao`) đúng một trong hai dáng: việc người dùng thấy → mở bằng vai (`vai`); việc nền → hành vi hệ thống đo được (`vai: nen` + `bat_khi`), không ép «Là kỹ sư…».
2. Hàng sau đứng trên dữ liệu thật của hàng trước — KẾT QUẢ thật của vòng trước đã giao, không phải dữ liệu vận hành; `dung_tren` chỉ trỏ hàng, và chỉ khi nó thật sự cần hàng trước đã giao.
3. Không chạm hai lớp khó đảo trong một hàng (dữ liệu người dùng, quyền, đăng nhập, tiền): tách thành hai hàng.
4. Cỡ hàng theo khoảng tiêu chí của khối CAT-LUOT-CO (`tieu_chi`): từ `tach_tu` thì tách, dưới mục tiêu thì xét gộp với hàng cùng nhóm.
5. Ngày rơi ra từ thứ tự và nhịp; hàng gắn mốc không được muộn hơn ngày mốc.
6. Mã không cắt được thành câu giao thì vào mục chờ điều kiện kèm lý do và điều kiện mở lại — không bỏ lặng.
```
<!-- CAT-LUOT-SAU-LUAT>>> -->

**Khoảng cỡ** — chính sách của chủ kit, MỘT nguồn: răng đọc thẳng khối dưới đây, không số nào nằm trong
mã. Khối chỉ đổi ở kho kit, cùng PR với số đo của đồng hồ cỡ làm căn cứ, và tới kho tiêu thụ qua bản phát
hành (bước 2).

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

**Nối chỉ vì chạm cùng tệp** (cả hai dáng): hai hàng không cần kết quả của nhau nhưng sẽ sửa cùng một tệp hay cùng
một bảng — chạy song song thì hai vòng giẫm lên nhau. Ghi `chay_sau: ["<mã hàng trước>"]` ở hàng sau, KHÔNG ghi
`dung_tren` (luật 2: `dung_tren` chỉ khi hàng sau thật sự cần hàng trước đã giao). Răng kiểm mã có thật, không trỏ
chính nó, không trùng `dung_tren`, không khép vòng; thẻ lượt cắt (bước 4) vẽ dãy chạy song song từ hai trường và in
hai loại nối bằng hai nhãn khác nhau.

Mỗi hàng ghi theo khuôn `skills/acceptance/references/lo-trinh-template.json`: `ma`, `cau_giao`,
`vi_sao`, `hang`, `dung_tren`, `bat_khi`, cộng bảy trường của lượt cắt: `dot` (đúng `dot` của bản phạm
vi), `phu` (danh sách mã bản phạm vi mà hàng gánh), `vai` (dáng câu giao), `tieu_chi` (cỡ dự kiến),
`du_lieu` (bước 2b luật 5, chỉ khi hàng sinh hay dùng dữ liệu giả), `chay_sau` (nối chỉ vì chạm cùng tệp, chỉ khi có)
và `vung` — vùng mã dự kiến theo khối dưới.
Mốc không gánh mã của bản phạm vi. Các trường này chỉ lượt cắt ghi và răng đọc — agent mở vòng làm từ hợp đồng,
phép đo và kế hoạch của vòng, không đọc trường nào cho riêng nó từ lộ trình; đừng thêm trường cho agent. Riêng
`vung` còn một bên đọc: gói đợt `dieu-phoi` chép nó sang vùng tệp (`ranh_gioi`) của hàng để lịch biết tệp xếp hai
hàng chồng vùng nối tiếp nhau.

<!-- <<<CAT-LUOT-VUNG -->
```
1. Mỗi hàng — cả dáng `chuoi` lẫn `lan-va` — ghi `vung`: mảng glob tương đối gốc kho, là thư mục mã của MÀN mà câu giao nói tới (một màn, một thư mục; hàng chạm hai màn ghi hai thư mục).
2. Hàng sửa KHUNG CHUNG của một khu — bố cục, thanh bên, điều hướng, tham số đường dẫn: tệp đứng thẳng trong thư mục khu — giữ cả khu `<khu>/**`; hàng chỉ sửa một màn giữ thư mục màn ấy. Hàng đổi khung là hàng làm gãy thước của mọi màn trong khu.
3. Hàng chạm phần chung ngoài khu (thành phần giao diện dùng chung, máy chủ, văn bản giao diện) ghi thêm đúng thư mục hay tệp ấy — không ghi cả gốc ứng dụng.
4. Không ghi thư mục hồ sơ `_acceptance/…`: mỗi hàng một tên, chồng ở đó không bao giờ có nghĩa. Không ghi glob không có thư mục tĩnh (`**`, `*.tsx`): nó chồng mọi hàng.
5. Không biết thư mục mã của màn → đọc cây mã của kho trước khi ghi; vẫn không biết thì để trống — răng nhắc, lịch không so được hàng ấy, không bịa.
```
<!-- CAT-LUOT-VUNG>>> -->

Lịch biết tệp đọc vùng lúc GIAO hàng: hai hàng ở hai dãy chồng vùng thì hàng giao sau chờ hàng kia gộp xong. Vùng là
dự đoán; phiên làm hàng khai thêm vùng mã thật lúc trình Cổng Phạm vi (khối TRONG-DOT của vòng lặp). Mã chưa cắt được vào khối `chan_troi` cấp tệp:
`{ "ma", "dot", "cau_giao", "ly_do", "phu", "mo_lai_khi" }`. Không ghi `trang_thai`, `pr`, `buoc_ke` —
máy suy và vẽ chúng.

## Bước 4 — ghi hàng, chạy răng, rồi mới mở PR

Thứ tự này có răng: ghi hàng → chạy răng → xanh mới mở PR.

1. **Ghi hàng** và mục chờ điều kiện vào tệp lộ trình, trên CÙNG nhánh với bản phạm vi, rồi commit.
2. **Chạy răng:**

<!-- <<<CAT-LUOT-RANG -->
```bash
AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/cat-luot.mjs" --root . --pham-vi <bản phạm vi> --lo-trinh <tệp lộ trình>
```
<!-- CAT-LUOT-RANG>>> -->

   Thoát 0 → in bảng phủ (mỗi mã → hàng hoặc mục chờ điều kiện). Thoát 1 → mỗi dòng `lỗi:` nêu mã
   hoặc mốc — sửa rồi chạy lại; KHÔNG sửa bảng phủ bằng tay, bảng phủ là đầu ra của răng. Thoát 2 → tệp
   chưa vào git, bản phạm vi không đọc ra mã nào, hoặc khối khoảng cỡ của SKILL hỏng (thông điệp nêu khoá).
   Mốc của đợt mang mã, hay mốc `loai: ngoai` của đợt (`[moc-ngoai-da-bo]`, kèm bốn chỗ đến) đều là `lỗi:`.

   Răng còn gắn cờ có tên — cỡ, dáng câu giao, vận hành, dữ liệu giả — dạng `hàng <mã> [<cờ>]: …` hay
   `mốc <nhãn> [<cờ>]: …`. Hàng ngoài đợt đang cắt không đổi mã thoát: mỗi cờ gom thành MỘT dòng
   `cảnh báo: [<cờ>] <k> hàng ngoài đợt …`.

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
| `cho-van-hanh` | `dung_tren` trỏ `ma` hay `ten` của một mốc ngoài (lộ trình cắt trước luật 17/10) | lỗi |
| `du-lieu-sai-gia-tri` | `du_lieu` khác `sinh-gia` và `gia` | lỗi |
| `thieu-hang-sinh-gia` | `du_lieu: gia` mà không đứng trực tiếp trên hàng `sinh-gia` | lỗi |
| `moc-ngoai-da-bo` | mốc `loai: ngoai` — trong đợt: lỗi nêu bốn chỗ đến; ngoài đợt: một dòng gom | lỗi |
| `gan-moc-dang-chay` | gắn vào mốc phát hành đang chạy (ngày ≥ hôm nay, mốc đã có hàng ngoài đợt) — đổi đích chiến dịch giữa chừng | cảnh báo |
| `chua-khai-vung` | hàng trong đợt thiếu `vung`, khi lộ trình đã có hàng khai `vung` (lộ trình chưa dùng vùng: răng không xét vùng) | cảnh báo |
| `vung-sai-kieu` | `vung` không phải mảng chuỗi khác rỗng | lỗi |
| `vung-qua-rong` | một glob của `vung` không có thư mục tĩnh trước ký tự đại diện đầu (`**`, `*.tsx`) | lỗi |
| `vung-chi-ho-so` | `vung` chỉ trỏ thư mục hồ sơ `_acceptance/…` | cảnh báo |
| `vung-trung-moi-hang` | từ ba hàng của đợt khai vùng mà MỌI cặp đều chồng — lịch sẽ xếp cả đợt thành một hàng dọc (dòng mở bằng `đợt <tên>`) | lỗi |
<!-- CAT-LUOT-BANG-CO>>> -->

   Dòng `cảnh báo:` có hai loại; dòng `cua-dot` của khối dưới nhận ra loại thứ nhất:

<!-- <<<CAT-LUOT-CANH-BAO -->
```
cua-dot: ^cảnh báo: (hàng|mốc) .+? \[[a-z-]+\]:
ngoai-dot: mọi dòng cảnh báo: còn lại
```
<!-- CAT-LUOT-CANH-BAO>>> -->

   - **Của đợt đang cắt** (tên hàng hay mốc rồi `[<cờ>]`) — gợi ý gộp, trên mục tiêu, chưa ước cỡ, chưa
     khai dáng: XỬ LÝ (gộp, khai) hoặc giữ và ghi vì sao vào mô tả PR.
   - **Ngoài đợt** (mọi dòng `cảnh báo:` khác — dòng gom `[<cờ>] <k> hàng ngoài đợt …`, hàng cắt tay đời
     trước): chép vào mô tả PR, không sửa mục không thuộc lượt cắt.
3. **Dựng thẻ lượt cắt** — bản cho người gộp PR, dựng từ đúng dữ liệu răng vừa đọc (cùng nếp thẻ cổng
   `acceptance-card`: thẻ chỉ trình, không quyết; việc của người đứng đầu):

<!-- <<<CAT-LUOT-THE -->
```bash
AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/cat-luot.mjs" --root . --the --pham-vi <bản phạm vi> --lo-trinh <tệp lộ trình> --ra "<việc> · <ai> · <khi>" --giu "<mã>: <lý do>"
```
<!-- CAT-LUOT-THE>>> -->

   Thẻ in markdown: răng xanh hay đỏ · việc của người gộp PR · đợt trong bốn con số (mã · hàng · mục chờ · việc của
   người) · mã nào về đâu · các dãy chạy song song (nối `dung_tren` và nối `chay_sau` mang hai nhãn) · cỡ từng hàng
   trên khối khoảng cỡ kèm số của đồng hồ cỡ · cảnh báo của đợt kèm lý do giữ · mục chờ điều kiện · «Ra khỏi kho» ·
   ngày và vì sao chưa có (kèm nhịp) · mỗi hàng đi qua cổng nào sau khi gộp. Hai thứ thẻ không đọc được từ tệp nào —
   phiên truyền chúng, mỗi mục một cờ:
   - `--ra "<việc> · <ai> · <khi>"` — mỗi việc của người đã tách ở bước 2b (sự kiện tạo hạn: `<khi>` kèm tên mốc nhận
     hạn); đợt không có việc nào: `--ra -`. Vắng cờ thì thẻ in «chưa khai».
   - `--giu "<mã>: <lý do>"` — mỗi hàng giữ một cảnh báo của đợt (dưới hay trên mục tiêu, chưa khai dáng, gắn mốc đang
     chạy): vì sao giữ. Vắng thì thẻ in «chưa ghi lý do giữ» dưới cảnh báo ấy.
   Mã thoát như răng: răng đỏ thì thẻ vẫn in nhưng mở đầu bằng ĐỎ và từng lỗi — sửa rồi dựng lại, đừng mở PR.
4. **Xanh mới mở PR** — một PR cho cả đợt: bản phạm vi + hàng + mục chờ điều kiện. Mô tả PR là thẻ lượt cắt, CHÉP
   NGUYÊN VĂN đầu ra của lệnh trên (thẻ đã gồm bảng phủ, cảnh báo ngoài đợt và «Ra khỏi kho») — không soạn lại, không
   tóm tắt; dán thẻ cả vào tin nhắn mời người gộp. Danh sách «Ra khỏi kho» là lời khai cho người gộp PR soát: răng
   không thấy nó. Người gộp PR là người chốt lượt cắt (một chạm).

Kho vẽ lại trang lộ trình trong cùng PR (`product-map.mjs`) nếu CI của kho chạy `--check`.
