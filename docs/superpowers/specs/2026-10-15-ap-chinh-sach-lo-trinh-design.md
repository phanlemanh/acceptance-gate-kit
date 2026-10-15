# RM2 · Máy tự áp chính sách lộ trình — thiết kế

Hồ sơ: `_acceptance/ap-chinh-sach-lo-trinh/`. Vòng 2 của gói `road-map` theo hướng B′:
`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md` §6 mục 2–3, §11; ADR 0025 và phần bổ sung 14/10.
Vòng 1 (RM1 `ra-soat-lo-trinh`, ký 15/10) đã làm lát «chỉ cờ»: máy tính đề xuất kèm căn cứ, hiện trên thẻ khởi động,
không ghi tệp. Vòng này làm bước từ đề xuất sang thay đổi tệp, đúng theo chính sách chủ kho đã khai.

## 1. Kết quả một câu

Chủ kho khai chính sách MỘT lần trên mốc chiến dịch. Từ đó máy tự dời hàng khớp chính sách, theo nhịp: báo trước một
nhịp, áp, ghi sổ. Chủ kho trả lại hay ghim một hàng bằng một lệnh. Tệp lộ trình giữ nguyên định dạng, thứ tự và mọi
khoá lạ.

## 2. Chính sách nằm ở đâu

Chính sách khai trong khối `chinh_sach` của **mốc chiến dịch** (mốc `loai: phat-hanh`, theo MC1 «mốc là chiến dịch»):

```json
{ "ten": "…", "ngay": "2026-11-19", "loai": "phat-hanh", "hang": ["…"],
  "chinh_sach": { "tu_ap": true, "tuoi_ngay": 30, "tran_ke_tiep": 8, "nhip_ngay": 1, "tran_ap": 5 } }
```

- **Chiến dịch đang chạy** là mốc `phat-hanh` có ngày ≥ hôm nay và gần hôm nay nhất. Hai mốc cùng ngày thì lấy mốc đứng
  trước trong tệp.
- **Chính sách hiệu lực** gộp hai lớp. Lớp dưới là khối `chinh_sach` ở đầu tệp (đã có từ RM1, chỉ dùng cho cờ). Lớp trên
  là khối `chinh_sach` của chiến dịch đang chạy. Với `tuoi_ngay` và `tran_ke_tiep`, mốc thắng tệp.
- Khoá `tu_ap` chỉ đọc từ mốc. Tệp không khai `tu_ap: true` ở chiến dịch đang chạy thì mọi thứ y như RM1: chỉ cờ, bộ ghi
  không chạy, mọi mặt giống từng byte bộ máy gốc.
- `nhip_ngay` (mặc định 1) là số ngày lịch giữa lần báo trước và lần áp sớm nhất. `tran_ap` (mặc định 5) là số hàng tối đa
  máy áp trong một ngày cho một tệp. Hàng vượt trần nằm lại ở pha báo trước, tới ngày sau.
- Khai sai kiểu thì nổi một cờ khuôn ở mục «Cần sửa trong kế hoạch» và chính sách của mốc đó không chạy. Máy không đoán.
  Sai kiểu gồm: `tu_ap` không phải boolean, số không nguyên dương, hoặc khai ở mốc không phải `phat-hanh`.

**Vì sao đặt ở mốc:** ADR 0025 bổ sung «chính sách chiến dịch chốt ở khoảnh khắc mở chiến dịch đã có», và B′ §11 ghi
«`docChinhSach` (đọc chính sách từ mốc)». Khoảnh khắc mở chiến dịch đã có là lúc mốc được cắt vào tệp lộ trình qua PR
của người: chữ ký ở đó chính là lần «chốt một lần». Chính sách hỏi ở thẻ mở đợt (`/dieu-phoi:mo-dot`) thuộc vùng M5, ngoài
vòng này. Hạn chế: cắt lượt chưa tự gợi ý khối chính sách. Chủ kho thêm tay khi cắt mốc, và thẻ khởi động có một dòng
«chiến dịch <tên> chưa khai chính sách tự áp» làm lời nhắc.

## 3. Đề xuất → hành động

Rà soát của RM1 vẫn là nguồn đề xuất duy nhất. Năm luật giữ nguyên, chỉ đọc chính sách hiệu lực của mục 2.

| Đề xuất (luật) | Hành động khi áp |
|---|---|
| dời mốc (`moc-qua-ngay`) | gỡ mã khỏi `hang` của mốc đã qua, thêm vào CUỐI `hang` của chiến dịch đang chạy. Không có chiến dịch nào phía trước → không áp, cảnh báo «không có mốc chiến dịch phía trước». |
| chờ điều kiện (`xep-lai`, `tuoi`, `tran`) | chuyển hàng từ `hang` sang CUỐI `chan_troi`, gỡ mã khỏi mọi mốc. Mục mới = hàng gốc + `ly_do` (câu căn cứ, cùng câu với dòng rà soát) + `mo_lai_khi` («chủ kho trả lại, hoặc …» theo luật) + dấu `tu_ap: {ngay}`. Hàng đã có `ly_do` thì giữ, câu máy vào `ly_do_may`. |
| bác (`ho-so-bac`) | chuyển hàng sang CUỐI `da_bac`, cùng cách ghép như trên (không có `mo_lai_khi`). |

Máy không bao giờ xoá hẳn một hàng, không đụng hàng có hồ sơ đang mở (RM1 đã loại), và không đụng mốc của người.

## 4. Nhịp: báo trước → áp → huỷ

Tất cả đi qua một hàm `apChinhSach({root, cacTep, sections, today, ghi})` trong `scripts/lo-trinh.mjs`. Lệnh là
`--ap` (xem trước, không ghi) và `--ap --write` (ghi). Với mỗi tệp có `tu_ap`:

1. Phát lại sổ để biết trạng thái từng mã: `bao-truoc` đang chờ · đã `ap` · đã `tra-lai` · `huy`.
2. Đề xuất mới, chưa có `bao-truoc` đang chờ, hàng không ghim → ghi dòng `bao-truoc`, kèm `ap_tu = today + nhip_ngay`.
   Tệp lộ trình không đổi.
3. Có `bao-truoc` đang chờ, `today ≥ ap_tu`, còn trong `tran_ap` → so với đề xuất hôm nay:
   - cùng mã, cùng đề xuất, cùng luật → áp: ghi dòng `ap` rồi đổi tệp;
   - không còn → ghi dòng `huy`;
   - còn nhưng ĐỔI (khác đề xuất hay luật) → ghi `huy` cho cái cũ và `bao-truoc` mới cho cái mới. Hành động chưa từng
     được báo trước thì không bao giờ được áp.
4. Hàng ghim → không sinh `bao-truoc`. `bao-truoc` đang chờ của hàng vừa ghim → ghi dòng `huy`. Đề xuất đã bị trả lại
   (cùng mã, cùng đề xuất, cùng luật với dòng `tra-lai` cuối) → không sinh `bao-truoc` cho tới khi đề xuất đổi.
5. Hàng đang được mở bởi lần gọi này (`--mo-o --hang <mã>`) coi như có hồ sơ đang mở: không áp. Nếu có `bao-truoc`
   đang chờ cho hàng ấy thì ghi dòng `huy`.

Cùng ngày chạy lại không thêm dòng nào (luỹ đẳng). «Một nhịp» là ngày lịch, không phải mốc: nhịp mốc dài cả tuần thì quá
chậm so với nền 8 lần dời tay trong 12 ngày; nhịp «lần chạy kế» thì không chừa cửa sổ nào cho chủ kho ghim.

## 5. Sổ tự áp

Tệp `<tên-lộ-trình>.so.jsonl` nằm cạnh tệp lộ trình (`docs/plans/lo-trinh-kit.so.jsonl`), chỉ thêm dòng. Mỗi dòng có
`ngay` (YYYY-MM-DD, KHÔNG có giờ), `loai`, `ma`, `de_xuat`, `luat`, `can_cu`. Ngoài ra:
- dòng `bao-truoc` có thêm `ap_tu`;
- dòng `ap` có thêm `vi_tri` (khối · chỉ số · danh sách mốc chứa hàng), `hang_goc` (đối tượng hàng nguyên văn) và
  `lenh_tra_lai`;
- dòng `tra-lai` và `ghim`/`bo-ghim` có thêm `boi` (tên git của người chạy lệnh). Trạng thái ghim chỉ sống trong sổ:
  máy phát lại sổ để biết hàng nào đang ghim.

Sổ **tất định**: hai máy chạy `--ap --write` cùng ngày trên cùng nội dung thì ra cùng byte cho cả tệp lộ trình lẫn sổ, nên
hai nhánh gộp vào nhau không xung đột. Dòng sổ ghi TRƯỚC, tệp lộ trình đổi SAU, qua tệp tạm rồi đổi tên. Hỏng giữa chừng thì
sổ có dòng `ap` mà tệp chưa đổi: lần chạy kế nhận ra (hàng vẫn ở chỗ cũ), ghi lại cho đúng, không áp hai lần.

## 6. Bộ ghi (`ghiLoTrinh`) — cùng tệp với bộ đọc

- Điều kiện trước: `JSON.stringify(JSON.parse(gốc), null, 2) + '\n' === gốc` từng byte. Không đạt thì máy từ chối ghi,
  thoát 2, nêu tên tệp, không động vào sổ. Ca từ chối gồm: thụt 4 dấu cách, thiếu dòng cuối, có BOM, khoá dạng số
  (JS đổi thứ tự khoá dạng số).
- Ghi bằng `JSON.stringify(data, null, 2) + '\n'`. Thao tác chỉ là gỡ/chèn phần tử mảng nên thứ tự khoá và mọi khoá lạ
  của mọi object giữ nguyên.
- Lệnh gọi **bản chép trong kho** (`scripts/lo-trinh.mjs` của kho), không gọi `resolve-plugin`, để bộ ghi luôn cùng phiên
  bản với bộ đọc mà CI của kho chạy (B′ §11 ràng buộc (i)).

## 7. Trả lại · ghim · bỏ ghim

- `--tra-lai <mã> --write` hoàn tác lần `ap` cuối của mã:
  - bỏ mục do máy chuyển (khớp theo khối + mã + dấu `tu_ap`);
  - chèn `hang_goc` về đúng chỉ số cũ, trả mã về đúng vị trí trong từng mốc cũ — tệp về TỪNG BYTE như trước lần áp, nếu
    giữa hai lần không ai sửa phần khác;
  - ghi dòng `tra-lai`.
  Trả lại chỉ chặn ĐÚNG đề xuất ấy (cùng mã, đề xuất, luật) cho tới khi đề xuất đổi (B′ §11: «Veto một lần tự áp»). Hàng
  KHÔNG bị ghim. Ví dụ: hàng bị trả lại khi đang đề xuất «chờ điều kiện» vì tuổi, sau đó hồ sơ của nó bị bác → máy báo
  trước «bác» như một đề xuất mới.
  Mục do máy chuyển đã bị sửa sau lần áp thì máy từ chối, thoát 2 «hàng đã đổi sau khi máy áp — trả lại bằng tay».
  Không có lần áp nào để trả → thoát 2.
- `--ghim <mã> --write` và `--bo-ghim <mã> --write` chỉ ghi dòng `ghim` / `bo-ghim` vào sổ. Tệp lộ trình KHÔNG đổi. Ghim
  miễn trừ cả hàng khỏi tự áp tới khi bỏ ghim. Đặt khoá trên hàng thì bị luật tuổi coi là một lần chạm (chạm = đổi trường
  nào trừ `ma`), tức lệnh miễn trừ lặng lẽ đặt lại đồng hồ của luật khác — vì vậy ghim nằm ở sổ.
- Ba lệnh người `/road-map:ghim`, `/road-map:bo-ghim`, `/road-map:tra-lai` nằm ở `road-map/commands/` và khoá
  model-invocation. Đây là **CỘNG**: sửa ADR 0002 (thêm ba tên, kèm câu vì sao) và P32 trong cùng PR. P32 thêm một danh
  sách riêng `LOCKED_ROAD_MAP` đọc `road-map/commands/`; danh sách bảy tên của acceptance-gate giữ nguyên (ca NO-AC11 của
  hồ sơ đã ký cứng số 7). Chủ kho duyệt đích danh ở Cổng Phạm vi.

## 8. Bề mặt đọc

- **`/road-map:xem` thành bản đồ** (vẫn chỉ đọc, vẫn mở model-invocation). Lệnh mới là `lo-trinh.mjs --xem`. Với mỗi lộ
  trình, đầu ra gồm năm khối theo thứ tự:
  1. dòng đếm `Xong <a> · Đang dở <b> · Kế <c>`;
  2. danh sách đang dở (mã — câu giao — ô);
  3. hàng kế cùng tối đa 3 hàng tiếp theo;
  4. khối «Rà soát» của RM1, mỗi hàng ghim mang hậu tố «(ghim — máy không tự áp)»;
  5. khối «Tự áp» (chỉ có khi kho bật `tu_ap`): mỗi hàng báo trước kèm ngày áp, mỗi hàng đã áp trong 7 ngày kèm lệnh trả
     lại, và trạng thái chính sách của chiến dịch đang chạy.
  Lệnh cũ `--ra-soat` giữ nguyên byte.
- **Thẻ khởi động:** kho bật `tu_ap` thì có thêm một dòng tổng `Tự áp: <n> báo trước (áp từ <ngày>) · <m> đã áp 7 ngày qua`
  cùng tối đa 3 dòng chi tiết. Kho không bật thì thẻ giống từng byte bộ máy gốc. Thẻ không bao giờ ghi.
- **Trang lộ trình** không đổi: tự áp phụ thuộc hôm nay, mà trang phải tất định. Hàng đã dời hiện ở chỗ mới vì trang đọc
  tệp. Dấu `tu_ap` trên mục máy chuyển là khoá lạ với bộ vẽ, trang bỏ qua. Ghim không nằm trong tệp.
- **Ngoài-3 của RM1:** tệp lộ trình nằm trong kho git mà chưa từng commit thì `tuoiHang` trả `hong: 'tệp lộ trình chưa từng
  commit'`, kéo theo cảnh báo «không đọc được tuổi hàng — luật tuổi không chạy». Đây là cảnh báo sẵn có, chỉ thêm lý do.

## 9. Điểm chạy tự động

Câu hỏi cho chủ kho (Hỏi-1). Máy khuyên: `--mo-o` — lệnh mở việc từ một hàng ở S0 của mọi vòng — chạy
`apChinhSach(…, ghi=true)` trước khi mở ô. Hàng đang được mở không bị áp (bước 5, mục 4). JSON in ra thêm khoá
`ap: {bao_truoc, da_ap, huy}` khi có thay đổi. SKILL feature-loop S0 commit các thay đổi đó thành một commit riêng, tiêu đề
cố định `lo-trinh(may-ap): <n> hàng — <ngày>`.

Thước nền `nen/do-nen.mjs` trừ phần máy làm bằng **sổ**, không bằng tiêu đề commit. Một thay đổi lớp «dời» của mã X trong
một commit là của máy khi sổ ở commit ấy có dòng `ap` cho X, cùng ngày commit, cùng khối đích. Tiêu đề commit chỉ để người
đọc lịch sử, vì nó mất khi gộp squash hay khi phiên gộp commit máy vào commit khác. Giới hạn: một lần dời tay trùng đúng mã,
ngày và khối đích với một dòng `ap` sẽ bị trừ nhầm.

- Lối khác 1: chỉ một lệnh model-invoke `/road-map:ap`, phiên điều phối gọi khi xếp lịch. Rẻ hơn (không chạm S0), nhưng
  «tự» chỉ có khi có phiên nhớ gọi.
- Lối khác 2: áp khi mở thẻ khởi động. Lối này chết vì `/start` là lệnh chỉ đọc (P32, ADR 0002).
- Giá của lối khuyên: lộ trình đổi trên nhánh của vòng. Hai máy áp khác ngày trên hai nhánh có thể xung đột khi gộp. Sổ
  tất định chỉ chống ca cùng ngày. Đây là giới hạn đã khai, kèm ngưỡng: ≥ 1 lần gộp xung đột ở tệp lộ trình hay sổ do
  máy áp.

## 10. Ngoài vòng

- Đóng băng `dong_bang`: răng của nó là cờ ở cắt lượt (B′ §10). Vào hạt giống.
- Cửa tín hiệu `/road-map:gui` (RM3) và chính sách ở thẻ mở đợt: vùng M5.
- RM4 (khởi tạo tệp lộ trình) và RM5 (chặn): điều kiện mở lại chưa đạt. Chặn là khó đảo nên máy không tự áp.
- Tự kéo mục «chờ điều kiện» về «Kế tiếp» theo `mo_lai_khi`.

## 11. Bảng dự báo 5 dòng (luật (c))

| Dòng | Dự báo | Điều kiện tin cậy |
|---|---|---|
| Làm-xong → quyết-được | = | — |
| Lượt gọi người / vòng | = trong vòng. Ngoài vòng: số lần dời tay ↓ (nền crm 8 commit / 12 ngày). | Đọc bằng `nen/do-nen.mjs` trừ commit `lo-trinh(may-ap)` |
| Vòng bị hạ tầng đốt | = | — |
| Token máy / vòng | = | Đường verdict không đổi thành phần |
| Phút máy / lượt chấm | = | Như trên |
