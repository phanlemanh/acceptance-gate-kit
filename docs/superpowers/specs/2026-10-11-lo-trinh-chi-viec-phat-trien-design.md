# Lộ trình chỉ chứa việc phát triển — thiết kế (hàng S3b)

Hồ sơ: `_acceptance/lo-trinh-chi-viec-phat-trien/` · Cổng Đáng ký build T2 11/10 (owner «Làm») ·
đứng trên S3 (`vong-la-mot-ket-qua`, răng cỡ + dáng câu giao, đã gộp).

## 1. Kết quả của vòng

Dáng việc nền. Khi một phiên cắt một đợt phạm vi thành lộ trình, **việc vận hành của người có chỗ
riêng là mốc ngoài và hiện trong bảng phủ; răng đỏ khi một hàng phát triển đứng chờ mốc vận hành
hay đo trên dữ liệu giả mà không có hàng sinh dữ liệu giả đứng trước; vận hành lặp lại được nhắc
xét tự phục vụ** — trước khi PR cắt mở. Lộ trình cũ của mọi kho đọc như cũ.

Người hưởng: chủ kho crm (lượt cắt kế của OKR + Kho tài liệu) và phiên Claude Code cắt lượt. Nguyên tố
trace: **1 — ý định chốt trước khi làm** (lộ trình là ý định; việc vận hành lẫn vào hàng làm ý định
không phân biệt được việc máy giao với việc người làm) và **3 — khoảnh khắc quyết thật** (người gộp
PR thấy mã nào thành mốc ngoài trong bảng phủ, quyết một lần).

## 2. Số đo nền (11/10, crm `origin/onehub` `27d47de04`)

| Lộ trình | Đo |
|---|---|
| OKR | 16 mốc, **11 là việc vận hành** (gửi danh sách, gửi OKR, dựng cây + đào tạo, dùng thật, công bố, nghiệm thu, đọc số, đặt OKR năm, đặt OKR quý 1, nhìn lại quý, đo bốn tuần); 10/16 mốc không gắn hàng nào. Loại mốc: `han` 2 · `han-cung` 2 · `phat-hanh` 3 · bỏ trống 9 |
| Kho tài liệu | 13 hàng; **2 hàng vận hành** (`ct` dùng thật hai tuần, `cb` việc chủ kho chạy song song); **3 hàng phát triển đứng trên `ct`** (`l5`, `d9`, `d6`); `l2` đã giao 28/09, «chưa tải tệp thật nào» |
| Tiền lệ đúng | OKR hàng `M` (công ty giả một quý), `9b` đứng trên `M`; `10` · `9b` · `9c` «dựng bằng dữ liệu mẫu, bật bằng dữ liệu thật» |
| Từ vựng `loai` của mốc | kit: `ngoai` · `phat-hanh`; crm: `han` · `han-cung` · `phat-hanh` · `su-kien` · trống; khuôn: `han`. **Không bộ đọc nào của kit đọc `loai`** |
| Kho có lộ trình | kit (1 tệp) · crm (3 tệp). Bản chụp trong bộ kiểm: `crm-okr`, `crm-kho-tai-lieu` (29/09, có đúng hình `ct`/`l5`/`d9`/`d6`), `oneflow` |

## 3. Quyết định thiết kế

### 3.1 Mốc ngoài là chỗ THỨ BA của bảng phủ (chọn) — thay vì một khối mới hay một loại hàng

Mã của bản phạm vi nay ở đúng một trong ba chỗ: **hàng** · **chân trời** · **mốc ngoài**. Mốc ngoài
là một mục `moc` có `loai: "ngoai"`, mang thêm các trường lượt cắt `dot` · `phu` (và tuỳ chọn `ma`).
Bảng phủ in `<mã> → mốc ngoài <nhãn>` (nhãn = `ma`, vắng thì `ten`).

- Vì sao mốc mà không khối mới: lộ trình đã có khối `moc` có ngày, có người (`ai`), có `hang` (hàng phải
  giao TRƯỚC mốc) — đúng hình của việc vận hành. Khối mới (vd `van_hanh`) là CỘNG thêm một khái niệm mà
  trang lộ trình không vẽ.
- Vì sao định nghĩa `loai: "ngoai"`: neo vào khuôn kit định nghĩa, không vào từ vựng một kho (luật
  26/09). Hôm nay không bộ đọc nào đọc `loai`, nên định nghĩa giá trị `ngoai` không đổi nghĩa dữ liệu
  cũ; crm gọi mốc vận hành là `han`/trống — răng chỉ xét mốc mang `dot` của đợt đang cắt, nên lộ trình
  cũ không bị đọc lại.
- `ai` (người làm) BẮT BUỘC ở mốc ngoài của đợt: việc vận hành không có người là việc không ai làm.
- Mốc cùng đợt mang `phu` mà `loai` khác `ngoai` → lỗi: chỉ việc vận hành của người mới thành mốc;
  mốc phát hành không gánh mã của bản phạm vi.
- `ma` của mốc ngoài trùng mã một hàng → lỗi (hàng đứng trên mã ấy sẽ không phân xử được).

Phương án bác: **gắn nhãn loại cho từng mã ngay trong bản phạm vi** (dev/ops) để răng ép chỗ rơi. Bản
phạm vi do chính phiên cắt chép từ văn bản tự do của đội sản phẩm — nhãn vẫn là phân loại của phiên,
chỉ ghi sớm hơn; thêm một cột người phải soát mà răng không biết thêm gì.

### 3.2 «Không hàng nào đứng chờ vận hành» — cờ `cho-van-hanh`

Hàng có `dung_tren` trỏ một mốc `loai: "ngoai"` (khớp `ma` hoặc `ten` của mốc, mốc của BẤT KỲ đợt nào
hay không đợt) mà không có hàng nào mang mã ấy → `hàng <mã> [cho-van-hanh]: …`, câu chỉ đúng hai lối:
cần DỮ LIỆU → hàng sinh dữ liệu giả; PHẠM VI chỉ biết sau mốc → chân trời, `mo_lai_khi` nêu mốc. Mục
`dung_tren` ấy KHÔNG còn sinh thêm dòng «đứng trên mã không có» (một mục, một dòng).

Chiều ngược lại hợp lệ và giữ nguyên: mốc ngoài có `hang` (hàng phát triển phải giao trước mốc, vd
«mọi phòng ban dùng thật» chờ R1 lên production), luật ngày cũ áp như mốc khác.

Giới hạn khai: răng KHÔNG đọc được nghĩa câu. Phiên cắt vẫn có thể ghi một việc vận hành thành hàng
(`ct` kiểu cũ) và cho hàng khác đứng trên nó — răng xanh. Phân loại thuộc phán xét: đo bằng giám khảo
ở lượt chấm (AC-9) và bằng Cổng Giá trị trên lượt cắt thật của crm (ngưỡng ô). Bác: đoán việc vận hành
bằng từ vựng («gửi», «đào tạo», «công bố»…) — không gian mở, bắn giả, là blacklist.

### 3.3 Dữ liệu giả có nhãn — trường lượt cắt `du_lieu` của hàng

Hai giá trị, vắng = không khai (đường đọc-cũ):

- `"sinh-gia"` — hàng sinh dữ liệu giả có nhãn, máy sinh từ khuôn dữ liệu thật (tiền lệ crm `M`).
- `"gia"` — hàng đo trên dữ liệu giả; phải có `dung_tren` TRỰC TIẾP một hàng `du_lieu: "sinh-gia"`
  (hàng ấy ở đợt nào cũng được — hàng sinh đã giao vẫn dùng được). Thiếu → `thieu-hang-sinh-gia`.
- Giá trị khác (kể cả `"that"`, `"Gia"`, chuỗi rỗng, số) → `du-lieu-sai-gia-tri`.

Không có giá trị «cần dữ liệu thật»: theo luật chủ kho, dữ liệu thật của vòng trước là `dung_tren`
(luật 2); dữ liệu thật do người vận hành tạo ra thì chưa có — dùng giả, và tiêu chí nào chỉ đo được
trên dữ liệu thật thành ô bỏ qua có tên ở vòng của hàng ấy (phần Feature Loop: chân trời `H-FL-DL`).
Trực tiếp thay vì bắc cầu: khai tường minh rẻ, bắc cầu thì một hàng ở giữa đổi là hàng cuối mất nguồn
mà không ai thấy.

### 3.4 Vận hành lặp lại — trường `lap` + `tu_phuc_vu` của mốc ngoài

Mốc ngoài của đợt khai `lap: true` (lặp lại mỗi tổ chức mới hay mỗi kỳ) mà không có `tu_phuc_vu` →
CẢNH BÁO `mốc <nhãn> [van-hanh-lap-chua-tu-phuc-vu]`. `tu_phuc_vu` trỏ mã của một hàng (tính năng tự
phục vụ) hoặc một chân trời (phanh «không phổ quát quá sớm»: chân trời mở lại khi có tổ chức hay kho
thứ hai thật). Trỏ mã không có → lỗi. `lap` không phải boolean → lỗi.

Vì sao vàng, không đỏ: phanh là phán xét của chủ kho — có khi chưa đáng làm tự phục vụ; đỏ sẽ ép máy
đẻ hàng tự phục vụ cho mọi việc lặp (phổ quát quá sớm). Vàng nhắc, chân trời ghi lý do.

### 3.5 Hai mục của S3 (Ngoài-1, Ngoài-2) — chữ SKILL, có thước

- **Ngoài-1:** SKILL nói mọi dòng `cảnh báo:` là hàng ngoài đợt. Sự thật: dòng `cảnh báo: hàng <mã>
  [<cờ>]: …` và `cảnh báo: mốc <nhãn> [<cờ>]: …` là của ĐỢT đang cắt (gợi ý gộp, trên mục tiêu, chưa
  ước cỡ, vận hành lặp lại) — phải xử lý hoặc ghi lý do giữ trong mô tả PR; mọi dòng `cảnh báo:` khác
  là ngoài đợt — chép vào PR, không sửa. Luật nằm trong khối `CAT-LUOT-CANH-BAO` của SKILL, một dòng
  biểu thức nhận dạng; ca đo xếp TỪNG dòng đầu ra răng thật bằng chính khối ấy và so với sự thật của
  kho thử (round-trip bên ghi = răng, bên đọc = luật SKILL).
- **Ngoài-2:** SKILL bảo «chủ kho» tự sửa khối khoảng cỡ. Ở kho tiêu thụ, SKILL nằm trong bộ đệm plugin
  — sửa là mất ở lần cài sau. Chữ mới: khoảng cỡ là chính sách của KIT, đi theo bản phát hành; kho thấy
  đồng hồ nói khác → dán bảng vào mô tả PR cắt lượt và báo chủ kit; khối chỉ đổi ở kho kit, cùng PR với
  số đo của đồng hồ cỡ làm căn cứ. Thước: giám khảo (AC-9) — vật của Ngoài-2 là hành vi của phiên đọc SKILL.

### 3.6 Bước mới trong SKILL: tách vận hành khỏi phát triển TRƯỚC sáu luật

Khối `CAT-LUOT-VAN-HANH` (năm luật đánh số) đứng giữa bước 2 (đọc nhịp) và bước 3 (sáu luật): mỗi mã
xếp một trong ba — phát triển · vận hành một lần · vận hành lặp lại — rồi chỉ mã phát triển đi qua sáu
luật (mã «không làm» giữ luật cũ của lượt cắt: chân trời có `ly_do`, hoặc `da_bac`). Sáu luật giữ đúng sáu dòng; luật 2 đổi chữ: «dữ liệu thật của hàng trước» là
KẾT QUẢ thật của vòng trước đã giao (`dung_tren` chỉ trỏ hàng), không phải dữ liệu vận hành. Lý do một
khối riêng thay vì luật thứ bảy: đây là phép lọc trước khi cắt (mã nào thuộc lộ trình), không phải một
luật cắt; và sáu luật là thứ hồ sơ L2/S3 đã ký đang ghim.

### 3.7 Khuôn

- `lo-trinh-template.json`, đợt `mau-1`: một mốc ngoài `V1` (`ai`, `dot`, `phu: ["C1"]`, `lap: true`,
  `tu_phuc_vu: "H2"`), chân trời `H2` (tự phục vụ, phanh tổ chức thứ hai), hàng `4` `du_lieu: "sinh-gia"`
  (`phu: ["C2"]`), hàng `5` `du_lieu: "gia"` đứng trên `4` (`phu: ["C3"]`). Không câu giao nào bọc «».
- `pham-vi-template.md`, khối `PHAM-VI-MA`: thêm `C1`–`C3` (nay tám mã). Câu «năm mã» trong khuôn đổi.
- Ca đo của hồ sơ đã ký phải sửa vì luật đổi (KHÔNG sửa hợp đồng đã ký — con trỏ ở Notes hồ sơ này):
  LT-150 (`vong-la-mot-ket-qua`) gom mã của đợt mẫu từ hàng + chân trời — nay thêm mốc ngoài; LT-130
  (`lo-trinh-cat-luot`) in «năm mã» cứng — nay in số đếm.

## 4. Thành phần và luồng

`scripts/cat-luot.mjs` (chỉ đọc, không gọi mô hình):

- `kiemPhu(pv, data)` — thêm chỗ thứ ba (mốc ngoài cùng đợt), kiểm hình mốc của đợt (`phu` mảng · mang
  mã thì phải `ngoai` · `ngoai` thì có `ai` · `ma` không trùng hàng · `lap` boolean · `tu_phuc_vu` có
  thật), và nhường mục `dung_tren` trỏ mốc ngoài cho cờ `cho-van-hanh`. «Đợt chưa cắt» tính cả mốc.
- `kiemCo(pv, data, k)` — thêm bốn cờ: `cho-van-hanh` · `du-lieu-sai-gia-tri` · `thieu-hang-sinh-gia`
  (hàng; trong đợt đỏ, ngoài đợt gom một dòng vàng mỗi cờ như S3) · `van-hanh-lap-chua-tu-phuc-vu` (mốc
  của đợt; vàng). `CO_TEN` thêm bốn tên. Chữ ký mọi hàm xuất GIỮ NGUYÊN — chỉ thêm.
- CLI không đổi tham số, mã thoát giữ hợp đồng 0 · 1 · 2.

`skills/cat-luot/SKILL.md` — bước tách vận hành (khối `CAT-LUOT-VAN-HANH`), luật 2 đổi chữ, bảng cờ +4,
khối `CAT-LUOT-CANH-BAO` (Ngoài-1), đoạn khoảng cỡ (Ngoài-2), bảng phủ ba chỗ. `CONTEXT.md`: thêm
**Mốc ngoài**, **Dữ liệu giả có nhãn**; **Cắt lượt** nói ba chỗ.

Không đổi: `scripts/lo-trinh.mjs` (trang lộ trình, `--mo-o`), khối dữ liệu lộ trình (X1/X2),
Feature Loop, `dieu-phoi/`.

## 5. Đo

Ca trong `tests/scripts/lo-trinh.test.mjs` (LT-163 … LT-171), executor `executors.test.lo_trinh` sẵn có.
Kho thử do code sinh trong ca (git init thư mục tạm); bản phạm vi sinh bằng hàm ghi `vietPV` (khuôn
dòng rút từ khối `PHAM-VI-MA`). Mỗi ca đỏ chạy CHÍNH hàm đo trên bản sao gói bị tiêm SAU khi bản lành
xanh trên cùng kho, ghim thông điệp. Răng «gốc» cho so đời trước = `git archive 9b11cc66 scripts lib
skills` (nhánh chính lúc mở vòng, đã có S3). Ca thật Kho tài liệu dựng từ bản chụp
`tests/scripts/fixtures/lo-trinh/crm-kho-tai-lieu.json` do code (đổi `ct`/`cb` thành mốc ngoài trong
ca), không chép tay một lộ trình mới.

Giám khảo (AC-9) KHÔNG tự cắt rồi tự chấm bài mình (phản biện context sạch F1): nó đối chiếu SKILL với
một **bảng đáp án viết trước** (`mau/lo-trinh-dap-an.json`, phân loại thật của crm 11/10) và nêu bước
SKILL dẫn tới chỗ của TỪNG mã — SKILL im lặng hay nước đôi thì FAIL. Chính bảng đáp án chạy qua răng
(AC-10): 0 lỗi, 0 cảnh báo — đáp án và răng không nói khác nhau. Hành vi THẬT của một phiên cắt đo ở
Cổng Giá trị trên lượt cắt kế của crm.

So đời trước (AC-6) ghim SỐ dòng răng mới in thêm bằng kỳ vọng tính độc lập (0 cho năm kho hôm nay),
không chỉ «dòng thêm mang tên cờ» — bắt nhiễu vàng in ra cho mọi hàng cũ (F2).

## 6. Cân trên mọi kho (luật 26/09)

| Kho | Được | Mất | Ai đang dựa hành vi cũ |
|---|---|---|---|
| crm (3 lộ trình) | chỗ đặt việc vận hành; cờ hàng chờ vận hành; khuôn dữ liệu giả | — : lộ trình cũ không có `dot` mới, mọi kiểm mới chỉ áp mục của đợt đang cắt | trang Lộ trình trong CRM đọc khối dữ liệu — không đổi |
| kit | như trên | — | mốc `loai: ngoai` hiện có không mang `dot`/`phu` → không xét |
| oneflow, media-library | — (chưa khai lộ trình) | — | — |

Thứ tự nghiệm: sửa đúng tầng ở khuôn + răng của lượt cắt (vật của lượt cắt), không đổi mặc định trang
hay bộ đọc chung.

## 7. Dự báo năm dòng (luật c)

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong → quyết-được mỗi vòng | = | không chạm cổng |
| lượt gọi người / vòng | = ở kit · ↓ ở crm (hàng không còn treo chờ chủ kho vận hành) | đo ở crm sau mốc |
| vòng bị hạ tầng đốt lượt chấm | = | |
| token máy / vòng | = | |
| phút máy / lượt chấm | = (+vài giây ca LT mới) | |

Điều kiện tin cậy: đường verdict (finder → refute → REJECT) không đổi thành phần.

## 8. Ngoài phạm vi

- Feature Loop khai nguồn dữ liệu cho từng tiêu chí (chân trời `H-FL-DL`, chờ DP7).
- Trang lộ trình tách mốc ngoài khỏi mốc phát hành / thôi đếm mốc vận hành vào «mốc chưa gắn việc».
- Cắt lại lộ trình crm (việc của crm sau khi nhận mốc — cũng là lần đọc ngưỡng).
- Bất biến sản phẩm (BB1).
- Răng đọc nghĩa câu để đoán việc vận hành (bác, §3.2).
