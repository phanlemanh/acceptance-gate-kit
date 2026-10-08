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

Đọc tệp lộ trình hiện có: mã đã dùng (mã mới không trùng), hàng đã giao (hàng mới đứng trên dữ liệu
thật của chúng), khối `moc` (mốc ngoài là ràng buộc).

## Bước 3 — cắt theo sáu luật

<!-- <<<CAT-LUOT-SAU-LUAT -->
```
1. Mỗi hàng một câu người dùng nói được (`cau_giao`), không gói ba kết quả rời vào một câu.
2. Hàng sau đứng trên dữ liệu thật của hàng trước (`dung_tren`) — chỉ khi nó thật sự cần hàng trước đã giao.
3. Không chạm hai lớp khó đảo trong một hàng (dữ liệu người dùng, quyền, đăng nhập, tiền): tách thành hai hàng.
4. Cỡ hàng theo nhịp thật của kho (bước 2) — hàng lớn hơn một vòng thì tách.
5. Ngày rơi ra từ thứ tự và nhịp; hàng gắn mốc không được muộn hơn ngày mốc.
6. Mã không cắt được thành câu giao thì vào chân trời kèm lý do và điều kiện mở lại — không bỏ lặng.
```
<!-- CAT-LUOT-SAU-LUAT>>> -->

Hai dáng cắt, theo `dang` của bản phạm vi:

- **`chuoi`** — chuỗi tính năng: áp đủ sáu luật; `dung_tren` nối hàng theo dữ liệu thật.
- **`lan-va`** — làn vá từ một khảo sát: gói mã theo màn hoặc vùng sản phẩm (một câu giao nói một màn
  chạy đúng); các hàng chạy song song nên KHÔNG đặt `dung_tren` giả giữa chúng; luật 1 hiểu là «một màn,
  một câu», luật 3 vẫn tách lớp khó đảo (một vá chạm đăng nhập thì thành hàng riêng, hạng T3).

Mỗi hàng ghi theo khuôn `skills/acceptance/references/lo-trinh-template.json`: `ma`, `cau_giao`,
`vi_sao`, `hang`, `dung_tren`, `bat_khi`, cộng hai trường của lượt cắt: `dot` (đúng `dot` của bản phạm
vi) và `phu` (danh sách mã bản phạm vi mà hàng gánh). Mã chưa cắt được vào khối `chan_troi` cấp tệp:
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
   rồi chạy lại; KHÔNG sửa bảng phủ bằng tay, bảng phủ là đầu ra của răng. Thoát 2 → tệp chưa vào git
   hoặc bản phạm vi không đọc ra mã nào. Dòng `cảnh báo:` nói về hàng ngoài đợt này (cắt tay đời trước):
   ghi vào mô tả PR, không sửa hàng không thuộc lượt cắt.
3. **Xanh mới mở PR** — một PR cho cả đợt: bản phạm vi + hàng + chân trời. Dán bảng phủ của răng vào mô
   tả PR. Người gộp PR là người chốt lượt cắt (một chạm).

Kho vẽ lại trang lộ trình trong cùng PR (`product-map.mjs`) nếu CI của kho chạy `--check`.
