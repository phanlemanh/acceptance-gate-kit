# phan-du-bo-cuc-moi-vong-bon — thiết kế

Hồ sơ: `_acceptance/phan-du-bo-cuc-moi-vong-bon/` · ô cơ hội: `opportunity.md` (Cổng Đáng 17/11 — «Mở vòng bốn») · vòng trước:
`_acceptance/phan-du-bo-cuc-moi-vong-ba/` (#506, `3341b8dc`).

## 1. Vấn đề trong một câu

Lượt đo của B2 trên `3341b8dc` còn thiếu 57 / 5 802 khoá; lúc mở vòng nhận 53 (K4-MP 43 · K4-TB 6 · K4-DN 4), bốn khoá còn
lại (CT-10-do, KM-1 và hai khoá cấp tệp) vào sau theo lời chủ kho gõ ở phiên B2 (Hỏi-5) — cả 57 phải đạt ở cả bố cục phẳng
hôm nay lẫn cây đã dọn nhà, không ca nào bỏ lời hứa gốc.

## 2. Số tôi đo, số tôi nhận lại

**Nhận lại từ B2** (không đo ở đây): 57 / 5 802 thiếu; chia cụm ở `khoa-dich.tsv` (chép từ `phan-du-luot-8.tsv`, nhánh B2
`0ab6f720`). Nguyên nhân B2 ghi là ĐỌC từ nhật ký, chưa thử sửa.

**Đo ở kho này 17/11** — bản sao `git clone --shared` của cây kịch bản `32a5506f` ở thư mục tạm (chỉ đọc kho B2), Node 24,
chạy lại từng tệp:

| Nhóm | Lời đọc của B2 | Điều đo được |
|---|---|---|
| K4-MP 43 | nhãn ca in đường đã qua bộ dịch | Hai cây in **cùng 174 tên** `BC …`, mỗi tên một lần (`tui-moi.tsv` của B2 có cả `BC commands/approve.md · HEAD` lẫn `BC plugins/acceptance-gate/commands/approve.md · HEAD`). Luật `tuiCu` của thước B2 đổi tên thứ nhất thành tên thứ hai (luật đường của `doiKhoa`) rồi đòi tên ấy **hai lần** — 43 là số cặp tên mà `doiKhoa` gộp làm một. Không ca nào thiếu, không tên nào đổi. |
| K4-TB 6 | thẻ khác vì bố cục khác | Bản sao đo của B2 có `origin/main` = `909dffd8` (ảnh kit ở #499, **trước #503**). «Bản trước vòng» = `merge-base HEAD origin/main` = `909dffd8`; hai tệp chép `skills/` của cây đang kiểm vào bản gốc bằng TÊN của cây đang kiểm (`skills/scope-slice`), mã `909dffd8` tìm `skills/cat-luot/SKILL.md` không thấy → thẻ thêm cờ «Chưa kiểm cỡ hợp đồng». Đặt `origin/main` = `3341b8dc` thì 6 khoá xanh mà không sửa gì. |
| K4-DN DV5 (2) | một dòng chú thích bị luật đường đổi | Hai dòng của `pre-merge-check.sh` đổi qua lần dọn nhà: dòng chú thích (thành con trỏ sang kho cũ) và `'"road-map@'` → `'"roadmap@'` (bảng tên). Đỏ với MỌI bản gốc còn phẳng — kể cả `3341b8dc`. |
| K4-DN «KK-6 so-that» (2) | đọc sổ thật qua lịch sử | Sổ thật `can-cu-s1-chay-moi-kho` có dòng `d-20261011T145052Z-6` trỏ `feature-loop/skills/feature-loop/SKILL.md`; ở cây mới tệp nằm dưới `plugins/…` nên bộ xếp xếp dòng ấy «đỏ: tệp căn cứ không có», thẻ in 7 dòng thay 8. Không phụ thuộc `origin/main`. |

Nguyên mẫu sửa K4-TB (đặt `skills/` vào bản gốc theo tên của chính bản gốc, qua `duong()`): KL-8, KL-8-do, KK-6, KK-6-do
xanh trên bản sao `32a5506f` với `origin/main` = `909dffd8`.

Đếm thêm (ngoài phạm vi, ghi `gui-b2.md`): 45 dòng sổ có `can_cu.tep` ở 32 hồ sơ đã khép (31 đã ký, 1 máy thông) trỏ đường
sống ở cây cũ mà không có ở cây mới — dựng lại thẻ của các hồ sơ ấy ở kho mới sẽ thấy dòng đỏ. Hôm nay 0 hồ sơ đang mở dính.

## 3. Hướng đã chọn

### 3.1 K4-TB — thứ đặt vào bản gốc mang bố cục VÀ tên của chính bản gốc (Hỏi-4)

`banGocVong()` của `khuon-loi.test.mjs` và `khoi-khuon-tren-the-cong.test.mjs` bung `scripts/` + `lib/` của merge-base rồi
chép `skills/` của cây đang kiểm vào. Sửa: chép từng mục con của `skills/` tới `duong(<mục ở cây đang kiểm>, { kho, ref:
merge-base })` — bộ dịch đưa cả thư mục lẫn tên (`scope-slice` → `cat-luot`) về đúng commit ấy. Ở cây phẳng `duong` là đồng
nhất nên vẫn là phép chép cũ. Quét lớp (grep `_goc` + `skills` dưới `tests/`): đúng hai chỗ này.

Lối khác còn sống: không sửa tệp kiểm, B2 đặt `origin/main` của bản sao đo = nguồn (đo: 6 khoá về). Vì thế đây là câu hỏi
cho chủ kho (Hỏi-4), không phải lựa chọn của máy. Khuyên sửa ở đây: ca vững với bản trước vòng ở mọi tuổi, và hai phép
không loại nhau — B2 có đổi môi trường đo hay không thì ca vẫn xanh.

### 3.2 DV5 — miễn có tên, chỉ khi so QUA lần dọn nhà (Hỏi-2)

Lời hứa của DV5: hai tệp cưỡng chế chỉ được THÊM so với bản gốc. Lần dọn nhà tự nó đổi chữ hai dòng luật. Thêm vào
`additive-only.test.mjs`:

- `quaDonNha(gốc, cây)` = bản gốc phẳng **và** cây không phẳng (hai lần gọi `boCuc`) — MỘT hàm, ca DV5 thật gọi nó với
  (merge-base, cây đang đứng), các ca canh gọi nó với cặp cây do `haiCay` sinh.
- `DON_NHA_DOI` = danh sách đóng, nguyên văn hai dòng của bản gốc phẳng mà kịch bản đổi. `measure()` chỉ tha các dòng này
  khi `QUA_DON_NHA`; ở cây phẳng, và ở kho mới sau ngày cắt sang (bản gốc đã là bố cục mới), danh sách không áp.
- Năm ca mới, CÙNG hàm `measure`, văn bản do mã sinh từ bản gốc thật: `DV5q-co` (ma trận ba ô viết trước cho hàm tính
  cờ: phẳng·phẳng tắt · phẳng·mới bật · mới·mới tắt) · `DV5q-im` (cờ TÍNH từ ô phẳng·mới, đổi đúng các dòng của danh sách
  → rỗng) · `DV5q-do` (cờ TÍNH từ ô phẳng·phẳng, cùng văn bản → đỏ đích danh từng dòng) · `DV5q-ngoai` (ô phẳng·mới, đổi
  thêm một dòng luật ngoài danh sách → đỏ đúng dòng ấy) · `DV5qu` (mỗi mục khớp đúng một dòng của bản gốc phẳng; bản gốc
  đã ở bố cục mới thì khớp không quá một). Cờ trong các ca là giá trị hàm trả về, không phải hằng — hàm rơi một vế thì
  `DV5q-co` và `DV5q-do` đỏ.

Dọn nhà mà đổi thêm dòng thứ ba thì DV5 đỏ ở cây mới — đúng việc của nó.

### 3.3 «KK-6 so-that» — sổ thật đọc trong cây mà nó được ghi (Hỏi-3)

Ca là vòng tròn bên ghi → bên đọc: thẻ của mã đang kiểm in ba vế cho mỗi dòng S1 của một sổ thật. Sổ ấy ghi ở bố cục phẳng.
Ở cây đã dọn nhà, `--root` của thẻ là bản bung của cây phẳng lịch sử (`chaDonNha` của `tests/hai-bo-cuc.mjs` — cùng quyết
định Hỏi-2 của vòng ba, cùng giới hạn «đóng băng ở ngày cắt sang»); mã thẻ vẫn là mã của cây đang kiểm. Ở cây phẳng `--root`
là chính cây đang đứng (đồng nhất). `KK-6-do so-that` dùng cùng hàm nên theo cùng gốc. Ca in «gốc đọc sổ: …» để thước
ghim; và thước phá `gate-card.js` của chính kho mới — ca phải đỏ — để chứng mã được đo là mã đang kiểm, không phải mã
trong bản bung.

### 3.4 K4-MP — sửa ở luật so của thước B2 (Hỏi-1)

Tệp kiểm đúng: 174 ô, 174 tên, hai cây giống nhau từng tên. Lỗi ở `tuiCu` (`migration/kich-ban/giu-khoa.mjs` của B2): nó
chọn tên đã đổi mỗi khi cây mới CÓ tên ấy, không xét cây mới còn «chỗ» cho tên ấy không. Đề nghị gửi B2 (`rang/tui-cu-suc-
chua.mjs`, kèm bộ thử): xếp khoá không đổi tên trước; khoá đổi tên nhận tên mới khi cây mới còn chỗ, hết chỗ mà tên nguyên
chữ còn chỗ thì giữ tên nguyên. Với túi của `bo-cuc.test.mjs`: luật hiện tại thiếu 43, luật đề nghị thiếu 0; với ba hình
`tuiCu` đang xử lý (không đổi · đổi thường · tên chỉ còn nguyên chữ ở kho mới) hai luật cho cùng kết quả. Đo 17/11 trên
TRỌN hai túi của lượt đo B2 (đọc bằng `docKetQua` của B2): luật hiện tại thiếu 57, thừa 43; luật đề nghị thiếu 14, thừa 0;
43 khoá về đều là `BC …`, không khoá nào chỉ thiếu ở luật đề nghị. Thước đo lại trong làn bằng túi của các tệp vòng khai,
kèm đối chứng dương (xoá một ca khỏi túi kho mới → luật đề nghị phải báo thiếu đúng tên ấy).

Lối sửa ở kho này (đổi nhãn 81 ca vào-dạng-phẳng cho `doiKhoa` không gộp được) có thật, nhưng đổi tên ca ở bố cục phẳng và
buộc tên ca của một tệp kiểm né luật của một thước ngoài kho.

### 3.5 Thước — `rang/giu-khoa-4.mjs`, so bằng NGUYÊN luật của B2

Thước vòng ba đếm bằng `demKhop` (nhận cả hai dạng tên) nên báo K4-MP đủ trong khi B2 đo thiếu 43. Thước vòng này so bằng
`tuiCu` + `soTui` chép nguyên từ B2 (bản chép vòng hai, đã so khớp `0ab6f720`), và dựng kho mới với bản gốc merge-base ở cả
hai chỗ đã gặp: `MOC_CU` = `909dffd8` (như bản sao đo của B2) và chính HEAD nguồn.

- `--tinh` — vài giây, chạy đầu mọi chế độ: danh sách đóng `TEP_VONG` (tệp vòng khai) ⊆ khối tự đúng đường vòng hai ∪
  vòng ba; trên nhánh riêng, tệp `tests/` mà CHÍNH nhánh đổi (từ merge-base với `origin/main` — gộp nhánh chính vào nhánh
  không làm phình tập này) = `TEP_VONG`, `routing-baseline.txt` theo luật dòng nghi thức của vòng ba; HEAD đã ở trên nhánh
  chính thì in TIN, không chấm; `gui-b2.md` đủ bốn mục; bộ tự kiểm của thước xanh; mỗi khoá đích có tệp nguồn ở HEAD.
- `--cu` — mỗi tệp vòng chạm ở `GOC_VONG` = `3341b8dc` và ở HEAD: túi HEAD ⊇ túi gốc, mọi ca xanh; tự phá CU-DO.
- `--moi --nhom tb|dv5|so-that|lt` — kho mới từ HEAD × hai bản gốc: khoá đích có mặt và xanh, `soTui(tuiCu(cũ, mới), mới)`
  thiếu 0 trên tệp ấy; **chiều đỏ cùng kho mới**: bản `GOC_VONG` của tệp kiểm đặt vào đúng kho ấy phải đỏ đúng câu ghim
  (câu đã thấy ở nhật ký B2). `dv5`: kho mới của thước không có bước 4 của kịch bản (dòng chú thích thành con trỏ) nên
  thước tự áp đúng phép đổi ấy lên dòng chú thích trước khi chạy — khai rõ là mô phỏng.
- `--mp` — túi thô của `bo-cuc.test.mjs` ở hai cây bằng nhau từng tên; luật B2 hiện tại thiếu đúng tập K4-MP của
  `khoa-dich.tsv` (tái hiện số B2 — chiều đỏ của phép so); luật đề nghị thiếu 0.

Số đo trên cây kịch bản THẬT của B2 (dựng bằng `don-nha.mjs` từ đỉnh nhánh) là phép đo tay một lần trước Cổng Bằng chứng,
ghi vào `gui-b2.md` kèm sha — không vào làn máy vì CI không có kho B2.

### 3.6 CT-10-do, KM-1 — chữ viết cứng theo tên và bố cục cũ (Hỏi-5)

Vào vòng sau khi mở: phiên B2 chuyển lời chủ kho «Đưa hai dòng sửa vào vòng bốn ở kho cũ». Hai tệp đã khai tự đúng đường
nên kịch bản B2 không vá được; lỗi ở chính tệp kiểm:

- `kho-moi-cai-goi-road-map.test.mjs`: hằng `CHUA_CAI` viết cứng `road-map`; sản phẩm in tên gói theo vai. Sửa: rút tên
  từ `tenTheoVai('lo-trinh')` của `lib/ho-goi.cjs` ở cây đang kiểm.
- `cua-tin-hieu-giua-chien-dich.test.mjs`: chuỗi tiêm của CT-10-do là đường tương đối `'../../scripts/tin-hieu-khoa.cjs'`
  theo bố cục cũ. Sửa: tính đường tương đối từ hai đường đã qua bộ dịch (`raTep`).

Hai dòng sửa do B2 đề nghị; chạy lại ở kho này 17/11 (Node 24): cây mới `32a5506f` 37/38 → 38/38 và 42/43 → 43/43; cây cũ
`3341b8dc` 38/38 và 43/43 trước lẫn sau. Ở cây phẳng cả hai biểu thức cho đúng chuỗi cũ (đồng nhất).

### 3.7 Nhịp ký

Như vòng ba: luật tĩnh trước lượt đo dài; chờ các ô bộ kiểm của CI xanh ở đỉnh PR rồi mới mời ký.

## 4. Ghép nối với B2 — `gui-b2.md`, bốn mục

1. Mục vá thừa: không thêm (năm tệp vòng chạm đã ở khối tự đúng đường từ vòng hai, vòng ba).
2. Tệp tự đúng đường: không thêm.
3. Cấu hình kịch bản phải đổi: luật `tuiCu` (Hỏi-1) · `origin/main` của hai bản sao đo đang là `909dffd8` — một ảnh kit cũ,
   không phải nhánh chính của cây nào đang đo (không bắt buộc đổi) · 45 dòng sổ trỏ đường phẳng.
4. Ca đổi nghĩa: DV5 (miễn có tên qua dọn nhà) · KK-6 so-that (đọc sổ trong cây phẳng lịch sử) · KK-6, KL-8, KM-1,
   CT-10-do (không đổi nghĩa — sửa chỗ viết cứng).

## 5. Câu cho người (Cổng Phạm vi)

- **Hỏi-1 — K4-MP sửa ở đâu.** Khuyên: gửi B2 luật `tuiCu` xét chỗ; kho này không đổi `bo-cuc.test.mjs`. Lối khác: đổi nhãn
  81 ca ở kho này — B2 không phải đổi gì, giá là 81 tên ca đổi ở bố cục phẳng.
- **Hỏi-2 — DV5.** Khuyên: miễn có tên hai dòng, chỉ khi so qua lần dọn nhà. Lối khác: không sửa ca, nhờ B2 đặt nhánh chính
  của bản sao đo = đỉnh dọn nhà — ca xanh rỗng ở lượt đo, và PR cắt sang vẫn đỏ nếu nhánh chính kho mới còn phẳng lúc đó.
- **Hỏi-3 — KK-6 so-that.** Khuyên: ở cây mới đọc sổ thật trong cây phẳng lịch sử. Lối khác: sửa bộ xếp cho đọc được đường
  phẳng cũ (chạm mã lõi, ngoài lời giao) hoặc để kịch bản B2 đổi đường trong sổ đã ký.

- **Hỏi-4 — KK-6, KL-8.** Khuyên: sửa hai tệp kiểm ở kho này (hai dòng). Lối khác: không sửa, nhờ B2 đặt nhánh chính của
  bản sao đo = nguồn — sáu khoá về ở lượt đo, ca vẫn đỏ ở nơi nào bản trước vòng còn là ảnh kit trước #503.
- **Hỏi-5 — CT-10-do, KM-1.** Khuyên: nhận bốn khoá vào vòng (lời chủ kho đến qua phiên B2; duyệt hợp đồng là xác nhận).
  Lối khác: giữ 53 khoá, để bốn khoá cho một vòng sau.

## 6. Rủi ro

- Thước dựng kho mới bằng bản chép luật của vòng hai/ba, không bằng kịch bản thật → bù bằng phép đo tay trên cây kịch bản
  thật trước Cổng Bằng chứng (§3.5).
- B2 đổi thêm luật làm dòng thứ ba của `pre-merge-check.sh` đổi chữ → DV5 đỏ ở cây mới; đó là tín hiệu đúng, sửa bằng một
  dòng có tên trong `DON_NHA_DOI`.
- Hỏi-1 chọn lối khác → AC-4 và E4 viết lại (đổi nhãn + `--cu` nhận 81 tên đổi có khai).
