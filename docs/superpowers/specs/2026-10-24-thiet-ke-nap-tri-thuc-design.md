# Bước thiết kế nạp tri thức — thiết kế (hàng TT4, đợt `tri-thuc-2410`)

24/10/2026. Hồ sơ `_acceptance/thiet-ke-nap-tri-thuc/`. Phủ C3 · C4 · C5 của `docs/plans/pham-vi-tri-thuc-2410.md`.
Thiết kế đợt: `docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md` §3.2. Dựng trên vật đã gộp của TT1 (#406: khối
`tri_thuc`, lint, `--con-tro`, khuôn tri thức) và TT3 (#407: dòng «Nguồn:» của ô mở từ hàng, bộ đọc
`scripts/tri-thuc-nguon.cjs`). Vật liệu gốc: hồ sơ NG1 trên nhánh `vong/nguon-di-cung-luot-cat` (AC-6, AC-7, AC-8 của nó
là khuôn cho thẻ chặn, chiều im và khuôn round-trip ở đây).

## Vấn đề

TT3 đưa đường trỏ trang tri thức tới ô của hàng. Từ ô tới bước thiết kế vẫn là lời: SKILL dặn «đọc ô», nhưng không vật
nào cho thấy bước thiết kế đã đọc trang, đã đọc bản nào, hay đã tra mà không có trang liên quan. Thẻ Cổng Phạm vi mời
duyệt như nhau dù máy chưa mở trang nào. Cùng lúc, căn cứ của một lựa chọn ở bước thiết kế chỉ có một dạng — tệp trong
kho + câu trích nguyên văn — nên trang nằm ở kho riêng (crm công khai, raw và trang nhạy cảm ở kho riêng đi kèm) chỉ có
hai lối, cả hai hỏng: chép câu trích sang sổ công khai (rò), hoặc bỏ trích thì bộ xếp đẩy lựa chọn về «Hỏi-n» (thêm
lượt gọi người).

## Thiết kế

### Dòng «đã tra tri thức»

Một dòng sổ `stage: "S1"` mang khoá `tri_thuc_tra`, ghi bằng khối `DEC-TRI-THUC-TRA` của SKILL feature-loop (mục «Sổ
quyết định», đặt cạnh `DEC-LUAT-NAP` — cùng nếp dòng nạp luật sản phẩm):

```
"tri_thuc_tra":{"tra":"<mã hàng hoặc câu tra>","trang":["<đường trỏ băm>", …]}
"tri_thuc_tra":{"tra":"<…>","trang":[],"khong_doc":"<dòng «không đọc được ở đây» lệnh in>"}
```

- `trang: []` = «đã tra, không có trang liên quan» — hợp lệ.
- `khong_doc` = máy ở bước thiết kế không đọc được kho tri thức (kho riêng vắng, clone không được) — hợp lệ, cờ vàng.
- Vòng từ hàng: `tra` là mã hàng, `trang` gồm mọi trang của dòng «Nguồn:» trong ô (đã đọc) cộng trang máy tự chọn
  thêm. Vòng đơn lẻ (TT5, hàng sau) điền `tra` bằng câu tra — cùng một khoá, TT4 không làm bộ tra theo mô tả.
- Một dòng hợp lệ mỗi hồ sơ là đủ; dòng bị một dòng sau thay (`supersedes`) không tính. Có nhiều dòng thì lấy dòng
  cuối còn hiệu lực.

Bộ đọc là mô-đun mới `scripts/tri-thuc-tra.cjs` (CJS, để thẻ và bộ xếp căn cứ nạp được). Nó KHÔNG có bộ so băm thứ
hai: mỗi đường trỏ kiểm bằng chính lệnh `node scripts/tri-thuc.mjs --root <kho> --con-tro <ref>` của TT1 (0 khớp · 1
lệch/không có · 2 sai khuôn · 3 không đọc được ở đây). Dòng «Nguồn:» của ô đọc bằng `docDongNguon` của TT3.

### Thẻ Cổng Phạm vi

Chỉ khi `_acceptance/config.yaml` của kho khai khối `tri_thuc` (bộ đọc `tri-thuc-khoa.cjs`). Kho không khai: thẻ (HTML
và `--extract`) giống từng byte bộ máy trước vòng — không khoá JSON mới, không chữ mới.

| Ca (hồ sơ `draft`) | `tri_thuc.chan` | Thẻ |
|---|---|---|
| sổ không có dòng tra | true | dòng đỏ «CHƯA vào được Cổng Phạm vi: chưa tra tri thức …», ô quyết `___` |
| ô có dòng «Nguồn:» trỏ trang mà dòng tra không có | true | dòng đỏ «… chưa tra: `<kho>:<đường>`», ô quyết `___` |
| dòng tra đủ, mọi đường trỏ khớp băm | false | không cờ tri thức |
| dòng tra, một trang sửa sau khi tra hoặc không còn | false | cờ vàng «trang tri thức không khớp bản đã tra: …» |
| dòng tra, một đường trỏ sai khuôn | false | cờ vàng «đường trỏ tri thức sai khuôn: …» |
| kho riêng vắng ở máy dựng thẻ, hoặc dòng tra mang `khong_doc` | false | cờ vàng «không đọc được ở đây: …» |

Hồ sơ đã qua Cổng Phạm vi (`approved` trở đi) trong kho đã khai mà không có dòng tra: `chan: false` và đúng một cờ vàng
đọc-cũ «hồ sơ đã qua Cổng Phạm vi không có dòng tra tri thức» — luật kit «nhánh đọc bản cũ + cờ vàng», hồ sơ mở trước
khi kho khai tri thức không bị khoá lại.

Thứ tự ưu tiên: dòng tra mang `khong_doc` miễn mọi trang ô đã nêu khỏi phép tính «chưa tra» — ô mở ở máy có kho riêng
mang đường trỏ kho riêng, còn bước thiết kế ở máy không có kho riêng thì không tra được; không đọc được thắng thiếu trang
(ngưỡng của ô: «không đọc được … không chặn»). Nhiều dòng tra: lấy dòng CUỐI còn hiệu lực (không bị một dòng sau thay
bằng `supersedes`) — đường máy tự gỡ là ghi một dòng mới, nên bộ đọc phải theo dòng mới. So khớp «trang của ô đã tra» theo `<kho>:<đường>`, không theo băm: trang đổi
giữa lúc mở ô và lúc tra thì dòng tra mang băm mới, đúng.

Chỉ THIẾU chặn. Lệch băm, sai khuôn, không đọc được là cờ (thiết kế đợt §3.2: «chỉ hiện CỜ khi thiếu, lệch băm hay
không đọc được»; «không đọc được … cờ vàng, không chặn»). Thẻ KHÔNG in danh sách trang đã tra — lời mời chỉ chứa điều
chỉ người biết.

Khoá chặn đi vào SKILL như cỡ hợp đồng: khối `TRI-THUC-TRA-CHAN` ở S1#5 — `tri_thuc.chan = true → moi_nguoi: khong ·
lan_v: khong · loi_ra: tra`. Máy tự gỡ trong cùng lượt: tra, ghi dòng, dựng lại thẻ.

### Căn cứ trỏ trang tri thức (C5)

Khối `DEC-CAN-CU-TRI-THUC` (riêng, vì `DEC-CAN-CU-SLOT` bị ca CC-03 ghim đúng ba dòng):

```
,"can_cu":{"nguon":"muc-tieu","kho_dao":false,"tri_thuc":"<kho>:<trang>#<băm>"}
```

`can-cu-s1.cjs` nhận khoá `tri_thuc` trong căn cứ nguồn mục tiêu, trước nhánh tệp + câu trích:

| Ca | Lớp |
|---|---|
| đường trỏ khớp băm (`--con-tro` 0) | đã quyết |
| kho tri thức không đọc được ở máy (3) | đã quyết, ghi chú «không đọc được ở đây: …» — không rơi thành Hỏi-n |
| lệch băm / tệp không có (1) | đỏ `tri-thuc-lech` |
| sai khuôn (2 hoặc khoá không phải chuỗi) | đỏ `tri-thuc-sai` |
| kho không khai `tri_thuc` | đỏ `tri-thuc-khong-khai` |
| trỏ kho riêng mà dòng còn mang `trich` hoặc `tep` | đỏ `tri-thuc-kem-trich` — không chở câu trích từ kho riêng |
| trang trong kho, gốc nhánh đã biết, băm ở gốc nhánh khác | đỏ `sinh-trong-vong` (luật sẵn có) |

Thẻ in dòng máy đã quyết dạng «căn cứ: trang tri thức `<ref>`» (không trích), và JSON `can_cu.da_quyet[]` mang thêm
khoá `tri_thuc` CHỈ khi dòng có nó — hồ sơ không dùng con trỏ giữ từng byte.

### Tự clone (C4)

`node scripts/tri-thuc-tra.cjs --root <kho> --clone`: kho khai kho riêng mà đường của nó vắng ở máy, có `remote` →
`git clone <remote> <đường>`. Thoát 0 «đã clone …» hoặc «đã có …» (không clone lại) · 3 «không đọc được ở đây: …» khi
không khai `remote` hoặc clone thất bại (dòng đầu stderr của git) · 2 khi kho không khai `tri_thuc` hay khối lỗi. Kho
tri thức trong kho (`noi`) → 0 «kho tri thức nằm trong kho». Đường kho riêng giải vào TRONG cây kho (checkout chính
hay worktree đang chạy) → 3 «không đọc được ở đây: … nằm trong cây kho», không tạo thư mục: kho riêng giữ raw và trang
nhạy cảm, clone vào cây của kho công khai là một lần `git add` tới chỗ lộ không thu hồi được (răng riêng tư §3.5). Bước thiết kế chạy lệnh này trước khi tra; thoát 3 thì ghi
dòng tra với `khong_doc`.

Luật giải đường kho riêng theo checkout chính (`gocCheckoutChinh`, `giaiGoc`, `dongKhongDoc`) dời từ `tri-thuc.mjs`
sang `tri-thuc-khoa.cjs`; `tri-thuc.mjs` nhập lại từ đó — một bản luật. Lý do: `tri-thuc.mjs` có `await` cấp cao nên CJS
không `require` được nó (ERR_REQUIRE_ASYNC_MODULE).

## CỘNG

Vòng này thêm một điều kiện chặn lời mời Cổng Phạm vi (khối `TRI-THUC-TRA-CHAN`) — là CỘNG, chủ kho phê đích danh ở
Cổng Phạm vi của vòng (Hỏi-1 trên thẻ). Người hưởng: chủ kho và phiên mở vòng ở crm và invest — bối cảnh nghiên cứu tới
bước thiết kế mà không ai phải nhớ dặn. Trace: nguyên tố 1 (ý định chốt trước khi làm, nay mang bối cảnh của nó) và 2
(dòng tra là bằng chứng máy đã chạm trang, có băm). Không thêm lượt gọi người: thiếu dòng thì máy tự gỡ.

## Gộp với TT2

TT2 (`ghi-tri-thuc`) sửa `scripts/tri-thuc.mjs` một chỗ (`export const khoi`) và thêm khối `TRI-THUC-NGUON` vào khuôn
tri thức. Vòng này không chạm khuôn tri thức; ở `tri-thuc.mjs` chỉ thay khối ba hàm giải đường (dòng 52–65) bằng một
dòng nhập — hai hunk cách xa nhau, gộp ba chiều không xung đột.

## Đường đo

Ngưỡng của ô là chính ma trận thẻ — đo ở lượt chấm bằng ca của vòng (AC-1 … AC-4, AC-8). Không có số sau phát hành;
thước «≥ 30 % hồ sơ có căn cứ trỏ trang» là của TT5 (`bat_khi` hàng TT5).

## Không làm

- Tra theo mô tả cho vòng đơn lẻ, đọc sổ quyết định các hồ sơ trước (C2, E1 — TT5).
- Neo dòng «Nguồn:» theo vị trí ngay sau «Mở từ hàng …» (giới hạn Ngoài-2 của TT3) — bộ đọc của TT3 dùng nguyên.
- Kiểm dòng tra ở pre-merge, recheck hay làn ghim lại — North Star: không thêm bước nào sau chữ ký.
- Chứng máy đã HIỂU trang (giới hạn đã khai §5 của thiết kế đợt).
