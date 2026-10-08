# Cắt lượt — design (lộ trình vào kit, lát 2, hàng L2)

**Hồ sơ:** `_acceptance/lo-trinh-cat-luot/` · **Cổng Đáng:** build T2, Manh Phan 06/10 · owner gọi
mở vòng 08/10 (trước khi cắt 2.25.0) · **Gốc:** crm/_acceptance/khung-okr-truoc-r1.

## Vấn đề

Lộ trình crm lớn nhanh hơn tốc độ một người cắt tay (OKR 32 → 62 hàng trong ba ngày; hai lượt cắt
tay một buổi sáng 04/10). Bảng phủ «mọi mã về đúng một chỗ» chép tay và đã cũ; bản phạm vi của lượt
cắt 04/10 không nằm trong git nên không gì so được (phép thử 1 của ô: 16 số hở không phân xử được).
Lát 1 còn để owner gõ tay `buoc_ke` cho hàng máy đã suy «đã giao» (phiên nghiệm thu lát 1, iterate).

## Ba phần

### 1. Khuôn bản phạm vi — một tệp trong git

`docs/plan/pham-vi-<đợt>.md` (đường do kho chọn). Khuôn sống ở
`skills/acceptance/references/pham-vi-template.md`, phần máy đọc nằm trong khối marker
`PHAM-VI-MA`, bộ đọc rút từ chính khuôn (ca round-trip):

```
dot: <tên đợt>
dang: chuoi | lan-va
nguon: <bản phạm vi đến từ đâu — đội sản phẩm, khảo sát, Core của quét hình thái>

- `<mã>` — <một dòng mô tả>
```

Mỗi dòng `- \`<mã>\` — …` là MỘT mã. `dang` là dáng cắt (phép thử 4 của ô: luật «một câu người dùng
nói được» và «đứng trên dữ liệu thật của hàng trước» viết cho chuỗi tính năng; làn vá từ khảo sát gói
lỗi theo màn, chạy song song). Core của quét hình thái vào bằng cùng khuôn: skill đánh mã `C1…Cn` cho
từng ô Core (Later/Never thành chân trời hoặc đã bác) rồi ghi tệp.

### 2. Răng phủ — `scripts/cat-luot.mjs`

```
node "<gói acceptance-gate>/scripts/cat-luot.mjs" --root . --pham-vi <tệp> --lo-trinh <tệp>
```

Chỉ ĐỌC. Thoát 0 = xanh, in bảng phủ (mã → hàng hoặc chân trời); 1 = đỏ, mỗi lỗi một dòng nêu mã;
2 = không chạy được (tệp không trong git, khuôn không đọc ra mã nào, tham số sai).

Tệp lộ trình mang phủ bằng hai chỗ, mỗi mục ghi `dot` bằng `dot` của bản phạm vi nó cắt từ:
- mỗi hàng: `dot` + `phu: [mã…]` — các mã của bản phạm vi hàng ấy gánh;
- cấp tệp: `chan_troi: [{ ma, dot, cau_giao?, ly_do, phu: [mã…], mo_lai_khi? }]` — mã chưa cắt được
  thành câu giao (luật 6). Kit đã dùng khối này trong lộ trình của chính nó.

Răng chỉ xét các mục cùng `dot` với bản phạm vi: hàng cắt tay đời trước (không `dot`) và hàng của đợt
khác không làm đợt này đỏ, và một mã trùng tên ở hai đợt không đụng nhau.

Luật đỏ:
1. **Phủ:** mỗi mã của bản phạm vi ở ĐÚNG MỘT mục cùng đợt — thiếu → «mã X không ở hàng hay chân
   trời nào»; hai mục → «mã X ở hai chỗ: hàng A, chân trời H1». Mục cùng đợt phủ một mã không có
   trong bản phạm vi → đỏ (thường là gõ nhầm). Đợt không có mục nào → ĐÚNG MỘT dòng «đợt <dot> chưa cắt: N mã chưa ở hàng hay chân trời nào» (nén mọi dòng mã-vắng của đợt, không in N dòng).
2. **Chân trời có lý do:** thiếu `ly_do` → đỏ nêu mã chân trời.
3. **Khuôn:** hàng cùng đợt qua `kiemKhuon` của lát 1 với 0 cờ, và `dung_tren` của chúng chỉ trỏ mã có
   thật — cờ in nguyên văn. Cờ khối cấp tệp (khối `hang` không phải mảng, `chan_troi` sai kiểu) luôn đỏ.
4. **Ngày (luật 5):** hàng cùng đợt có `ngay` sớm hơn `ngay` của hàng nó đứng trên → đỏ; hàng cùng đợt
   gắn một mốc (`moc[].hang`) mà `ngay` của hàng muộn hơn ngày mốc → đỏ (mốc ngoài là ràng buộc).

Phạm vi luật 3–4 là đợt đang cắt: cờ khuôn và lệch ngày của hàng ngoài đợt (cắt tay đời trước, đợt
khác) in thành dòng «cảnh báo: …» và KHÔNG đổi mã thoát — răng không bắt phiên sửa ý định của hàng
nó không cắt (thước riêng của lát 2 là số hàng sửa ý định), và kho nhận mốc này không đỏ khi vật của
nó không đổi.
5. **Trong git:** bản phạm vi và tệp lộ trình phải là tệp git theo dõi trong kho (`git ls-files`) —
   không thì thoát 2 «bản phạm vi phải là tệp có trong git» (phép thử 1 của ô).

Nhịp (luật 4): `cat-luot.mjs --root . --nhip` in JSON trung vị số ngày từ lúc chốt phạm vi
(`approved_at`, làn V thì `veto_opened_at`) tới ngày ký Cổng Bằng chứng (ngày trong `human_signoff`)
theo hạng, kèm `n` và số hồ sơ bỏ qua vì thiếu ngày. Ngày ký đọc là chuỗi `YYYY-MM-DD` đầu tiên trong `human_signoff` (khuôn bên ghi của lệnh ký:
`<tên> <ngày>`). Skill dùng số này để rải ngày; không có hồ sơ nào thì in `n: 0` và skill không bịa ngày.

### 3. Skill `cat-luot` — `skills/cat-luot/SKILL.md`

Đầu vào: bản phạm vi (tệp trong git), hoặc Core của quét hình thái (skill viết thành bản phạm vi
trước). Làm: đọc lộ trình hiện có của kho (khoá `lo_trinh.tep`) và nhịp; cắt theo sáu luật
(hạt giống §4), dáng theo `dang`; ghi hàng + chân trời vào tệp lộ trình CÙNG một nhánh với bản phạm
vi; chạy răng; xanh mới mở PR — người gộp PR là người chốt. Kit (mã) không ghi tệp ý định; phiên
viết hàng như mọi thay đổi người duyệt bằng PR (quyết owner 02/10: kit không ghi TRẠNG THÁI vào tệp).

### 4. Bước kế suy từ hồ sơ (phần sửa lát 1 owner đưa vào ô này 06/10)

Trang lộ trình in thêm một dòng nhỏ «bước kế: …» trong ô Trạng thái của hàng CÓ hồ sơ, suy từ ô bản
đồ bằng bảng viết sẵn (máy không soạn câu):

| Ô hồ sơ | Bước kế |
|---|---|
| Đang cân nhắc cơ hội | quyết có làm ở Cổng Đáng |
| Sắp mở vòng | mở vòng |
| Chờ duyệt phạm vi | duyệt phạm vi |
| Đang làm | làm và chấm |
| Đã giao — chờ phiên nghiệm thu | lái thử và phiên nghiệm thu |
| Hồ sơ hỏng | sửa hồ sơ |
| Đã giao · Đã nghiệm thu · Xếp lại · Đã bác · Ngoài phạm vi | — (không in) |

Hàng không hồ sơ không in gì (hàng kế đã có lệnh mở trên thẻ). Kho không khai lộ trình không đổi.

**Bỏ có tên:** suy `pr` — số PR rút từ lịch sử git, mà CI hay lấy bản nông (fetch-depth 1): trang vẽ
ở máy và trang `--check` ở CI sẽ khác nhau → `--check` đỏ oan; trang lộ trình tất định là bất biến
của lát 1. Hồ sơ con kế thừa mã hàng — kit không có đường sinh hồ sơ con (luật 18/09: «mở hợp đồng
mới» ghi hạt giống), ca crm R1c là hồ sơ dựng tay; 1/12 ca.

## Phạm vi chạm

`scripts/cat-luot.mjs` (mới) · `scripts/lo-trinh.mjs` (`kiemKhuon` đọc `phu`/`chan_troi`; dòng bước
kế) · `skills/cat-luot/SKILL.md` (mới) · `skills/acceptance/references/pham-vi-template.md` (mới) ·
`skills/acceptance/references/lo-trinh-template.json` (thêm `phu`, `chan_troi`) · `CONTEXT.md` (ba
term) · `GUIDE.md` · `CHANGELOG.md` · `tests/scripts/cat-luot.test.mjs` (mới) ·
`tests/scripts/lo-trinh.test.mjs`. Không chạm `lib/**`, hook, lưới trước-merge → T2.

Trang mẫu của hồ sơ đã ký (`viec-ke-theo-plan`, `trang-lo-trinh-doc-mot-phut`) đổi nếu hàng mẫu có hồ
sơ → vẽ lại + ghim lại trong cùng PR (tiền lệ X1).

## Giá theo năm dòng (dự báo)

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong → quyết-được | = | không thêm cổng |
| lượt gọi người / vòng | = trong vòng · ↓ ở kho (lượt cắt: một PR một chạm) | |
| vòng bị hạ tầng đốt | = | |
| token máy / vòng | = | răng tất định, 0 lượt mô hình |
| phút máy / lượt chấm | = | |

Thước riêng (hạt giống §8 điểm 2b): số hàng sửa ý định sau khi vòng mở — đo ở crm, 30 ngày.
