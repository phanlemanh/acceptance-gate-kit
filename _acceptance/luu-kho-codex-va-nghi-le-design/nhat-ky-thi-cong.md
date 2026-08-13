# Nhật ký thi công — hồ sơ luu-kho (append-only)

*Ghi trong lúc thi công, sau Cổng 1. Mục đích: mọi con số lệch khỏi hợp đồng đã
duyệt phải hiện ra ở đây TRƯỚC khi ai đó sửa hợp đồng cho vừa kết quả.*

## Đã xong

| Bước | Commit | Ghi chú |
|---|---|---|
| Đặt mốc `truoc-luu-kho-2026-08` + **đẩy lên remote** | tại `1df86ad` | Chân AC-1 thoả: mốc là **cha trực tiếp** của commit gỡ đầu tiên (`git rev-list moc..HEAD` bỏ chính nó = rỗng), và `git ls-remote --tags origin` trả đúng sha |
| Gỡ 197 file | `8723546` | `codex/` · `tests/codex/` · `codex-self-script-refs.tsv` · `.agents/` · `design-loop/` · `tests/design-loop/` · `plugins/` · `sync-plugin-packages.sh` |
| Khoá config + marketplace | `5c192f5` | `mirror_sync` (executor + suite-key) · `t1_skip_globs: plugins/**` · entry `design-loop`; thêm khoá `luu_kho_rang` |

## ⚠ HAI SỐ ĐO LỆCH KHỎI HỢP ĐỒNG ĐÃ DUYỆT — chưa sửa hợp đồng, mới ghi

### (1) Suite `plugins` mất NHIỀU HƠN HẲN "số ca của P30"

AC-11 khai `plugins: 173 → 173 trừ số ca của P30`. Đo trên vật: **~30 khối
`run`** của `tests/plugins/run-tests.sh` phụ thuộc Codex/mirror, không phải một
khối. Chúng chia làm hai loại, và đây là chỗ dễ sai nhất:

- **Xoá hẳn** — ca chỉ tồn tại vì Codex/mirror: `P01`–`P06`, `P22`, `P23`,
  `P25`, `P28`, `P29`, `P30`(mirror sync), `P41`, `P48`, `P49`, `P54`, `P56`,
  `P58`, `P81`, `P162`, `P175`, `P181`.
- **SỬA, không xoá** — ca đo CẢ HAI harness, gỡ Codex thì mất một nửa nhưng nửa
  Claude vẫn phải sống: `P30`(Claude decision commands), `P31`, `P84`, `P86`,
  `P100`, `P173`.

**Vì sao ghi thay vì lặng lẽ sửa số:** hợp đồng đòi số ca phải khai TRƯỚC rồi
mới đo. Nếu tôi chạy suite xong mới điền số vừa thấy, đó đúng là
hạ-thước-cho-vừa-vật — phép đo mất hẳn khả năng bắt "gỡ quá tay", tức mất lý do
tồn tại. Đường đúng: đếm a-priori từ danh sách trên, khai vào hợp đồng như một
**sửa-sau-Cổng-1 có lý do**, rồi mới chạy và đòi khớp.

### (2) Suite `scripts`: hai con số cùng đúng, đừng lẫn

- `Results: 671 passed` — bộ đếm nội bộ của suite.
- **737** dòng `PASS:` đếm thô.

Hai số này KHÁC NHAU và cùng hợp lệ. E7 ghim `Results: 664 passed` tức đang đo
theo **bộ đếm nội bộ**, nên đẳng thức `664 = 671 − 7` chỉ đúng nếu 7 assert
`DSC01-03`/`SG1-4` đều đi qua hàm `check` (có tăng bộ đếm). Đã kiểm: đúng.
Nhưng nếu ai sau này đổi E7 sang đếm dòng `PASS:` thì mẫu số phải là **737**,
không phải 671. Ghi để không ai lẫn.

## ✅ Suite `scripts`: đẳng thức GIỮ ĐƯỢC

Gỡ 7 assert `DSC01-03` + `SG1-4` → `Results: **664** passed, 0 failed`. Đúng
bằng `671 − 7` đã khai TRƯỚC khi đo. Đây là bằng chứng khuôn đếm-trước-đo-sau
hoạt động: nếu tôi để sàn `≥671` thì lúc này phải hạ số, và phép đo mất răng.

## ⚠ SỐ ĐO LỆCH THỨ BA — suite `plugins` đỏ **56 ca**, không phải «vài ca của P30»

Đo bằng cách chạy thật sau khi gỡ. Ba nhóm, và nhóm 3 mới là chỗ dễ âm thầm
làm yếu bộ kiểm:

**Nhóm A — XOÁ HẲN** (ca chỉ tồn tại vì Codex/mirror; gỡ là đúng, không mất độ phủ):
`P01` `P02` `P03` `P04` `P05` `P05b` `P05c` `P06` `P22` `P25` `P29` `P30`(mirror
sync) `P41` `P42` `P45` `P46` `P47` `P48` `P49` `P50` `P54` `P56` `P58` `P162`
`P175` `P181`

**Nhóm B — TRIM VỀ MỘT HARNESS** (ca đo CẢ HAI; nửa Claude phải sống nguyên):
`P31` `P44` `P57` `P84` `P86` `P90` `P93` `P94` `P99` `P100` `P101` `P122`
`P127` `P173`

**Nhóm C — TRỎ LẠI NGUỒN, KHÔNG ĐƯỢC XOÁ** (ca hỏi «gói có ship X không?» và
hỏi qua mirror; mirror chết thì gói Claude CHÍNH LÀ cây nguồn, nên phải đổi
đích chứ không bỏ câu hỏi): `P07` `P08` `P20` `P21` `P24` `P26` `P27` `P34`
`P39` `P80` `P81` `P85` `P87` `P88` `P91` `P95` `P128` `P133` `P147`

> **Cạm bẫy của nhóm C, ghi to:** cách rẻ nhất để suite xanh lại là xoá luôn
> nhóm này. Làm thế là **mất thật độ phủ** — câu hỏi «gói có ship đủ file
> không?» vẫn còn ý nghĩa sau khi mirror chết, chỉ đổi chỗ hỏi. Xoá nhóm C
> chính là hình dạng "gỡ quá tay" mà đẳng thức số-ca của AC-11 sinh ra để bắt.

**Hệ quả cho AC-11:** con số `173 − <số ca P30>` trong hợp đồng SAI. Số đúng
phải suy từ: `173 − |nhóm A| + 0` (nhóm B và C giữ nguyên số ca, chỉ đổi nội
dung). Với |A| = 26 → kỳ vọng **147**. Con số này khai ở đây TRƯỚC khi phẫu
thuật; nếu đo ra khác 147 thì có ca bị gỡ nhầm hoặc gỡ sót, và phải đi tìm chứ
không sửa số.

## ⚠ SỐ ĐO LỆCH THỨ TƯ — «56 ca đỏ» là con số của một phép đo BỊ CẮT CỤT; thật ra 73

*Ghi bởi Phiên C, 12/08, trước khi phẫu thuật.*

Ba nhóm A/B/C ở trên cộng lại ra **59 tên**, trong khi tiêu đề ghi «đỏ 56 ca».
Đi tìm nguyên nhân thay vì chọn một số, và lôi ra hai thứ:

**(a) Vì sao 59 tên mà chỉ 56 dòng đỏ.** `P39` sinh **hai** dòng đỏ (hai phân
ca), còn `P162` `P173` `P175` `P181` **không hề chạy** — không đỏ, không xanh,
vắng mặt. `59 − 4 + 1 = 56`. Bốn ca ấy được Phiên A phân loại bằng cách ĐỌC
tệp, nên phân loại đúng; chỉ có phép đo là không nhìn thấy chúng.

**(b) Vì sao chúng vắng mặt — một khối thoát-sớm lạc giữa tệp.**
`tests/plugins/run-tests.sh` có một bản sao của khối tổng kết đuôi nằm ở giữa
tệp (ngay sau P148): *hễ đã có ca đỏ nào, in `Results: N failed` rồi `exit 1`*.
Mọi ca từ P149 tới P194 — **46 ca** — không bao giờ chạy khi có ca đỏ phía
trước. Suite in ra một dòng tổng kết trông hoàn toàn bình thường, nên không có
tín hiệu nào cho biết một phần ba bộ kiểm vừa bị nuốt. Đúng lớp
**runner-nuốt-mã-thoát** đã ghi sổ (ba-lop-che-mau-xanh).

Khối này **có sẵn từ trước**, không do đợt này sinh ra: `git log -S` chỉ về
`044968e` (judge-required-evidence, 05/08) — khối đuôi bị chép kèm lúc nối thêm
P149+. Tại mốc `truoc-luu-kho-2026-08` cây xanh trọn nên nó chưa bao giờ lộ.

**Đã gỡ khối đó** (bugfix phép đo, tách commit riêng). Vì AC-11 là một ĐẲNG
THỨC số ca, phép đo của chính nó không được phép cắt cụt đầu vào — không gỡ thì
tiêu chí trung tâm của hồ sơ này không đo được điều nó nói.

### Số đo THẬT sau khi chữa phép đo

| Cây | Ca chạy | Xanh | Đỏ |
|---|---|---|---|
| Mốc `truoc-luu-kho-2026-08` | **173** | 173 | 0 |
| Cây hiện tại (đã gỡ 197 file) | **173** | 100 | **73** |

Baseline 173 nay là số **đo được**, không phải số chép lại từ hợp đồng. Tổng ca
hai bên bằng nhau xác nhận: tới lúc này chưa ca nào bị gỡ, cả 73 ca đều đang
chờ mổ.

**13 ca đỏ mà phân loại cũ chưa hề biết** (bị khối thoát-sớm che): `P156`
`P164` `P165` `P166` `P167` `P168` `P169` `P170` `P176` `P178` `P188` `P193`
`P194`. Đã đọc từng ca: **không ca nào thuộc nhóm A**. Mười hai ca đọc bản
Codex/mirror song song với nguồn (nhóm **B** — trim về nửa Claude); riêng
`P164` trỏ `plugins/feature-loop-codex/scripts/carry-plan.mjs` trong khi nguồn
`feature-loop/scripts/carry-plan.mjs` vẫn sống (nhóm **C** — trỏ lại nguồn).

**Hệ quả cho con số kỳ vọng: `147` KHÔNG ĐỔI.** Nhóm B và C giữ nguyên số ca,
nên 13 ca mới lộ không dịch chuyển đẳng thức: `173 − |A|=26 = 147`. Khác biệt
là bây giờ nó dựa trên baseline đo được và một tập đỏ đầy đủ, chứ không dựa
trên một phép đo bị cắt cụt — con số cũ đúng vì may, không phải vì kín.

**Phân loại chốt lại (72 mã, 73 dòng đỏ):**
- **A — xoá hẳn (26):** như trên, không đổi.
- **B — trim về một harness (26):** 14 cũ + 12 mới.
- **C — trỏ lại nguồn, CẤM XOÁ (20):** 19 cũ + `P164`.

### Gỡ sót đã tìm thấy cùng lượt

`.codex-plugin/plugin.json` ở gốc repo **vẫn còn trên cây** — đề bài 1b.1 gọi
đích danh nó («`.codex-plugin/` nếu có»). Gỡ nốt trong đợt phẫu thuật này.

## ⚠ SỐ ĐO LỆCH THỨ NĂM — phân loại A/B/C sai ở 10 ca; tổng vẫn 147 nhưng vì lý do khác

*Ghi bởi Phiên C, 12/08, sau khi lập bản đồ từng khối ca, TRƯỚC khi cắt.*

Phân loại cũ dựng trên tập đỏ **tại một thời điểm**. Hai lỗ của cách đó:

**(a) Ca đang XANH mà chỉ tồn tại vì đồ đã lưu kho.** `P23` («gói Codex sinh ra
không được chứa bề mặt Claude») đang xanh **rỗng**: nó lặp trên ba thư mục dưới
`plugins/`, thư mục không còn nên mọi assert đúng một cách vô nghĩa. `P28`
(«README và GUIDE dẫn đúng đường cài Codex») xanh chỉ vì tài liệu CHƯA được
dọn — dọn xong nó đỏ. Tập đỏ không thể lộ hai ca này.

**(b) «Đỏ» không nói ca chết hay ca còn nửa sống.** Sáu ca bị xếp XOÁ trong khi
chúng có nửa Claude thật:

| Ca | Nửa còn sống bị bỏ quên nếu xoá |
|---|---|
| `P22` | định tuyến model trong `feature-loop/workflows/` (`machine: 'haiku'`, `judge: 'sonnet'`, `executor: null`) |
| `P25` | `hooks.json` bản Claude: `${CLAUDE_PLUGIN_ROOT}` + `acceptance-evidence-gate.js` |
| `P29` | gap-probe nối ở `scripts/gate-card.js`, `commands/acceptance-card.md`, `GUIDE.md` |
| `P48` | chữ ký `ledger_mark` == EXPECTED trên `scripts/pre-merge-check.sh` + đột biến |
| `P175` | vế `claude` của khối MEASURE-BIRTH-CLAUSE + đột biến neo-ngoài-khối |
| `P181` | hai hàng gói Claude của bảng version-floor |

Và bốn ca bị xếp GIỮ trong khi tiền đề của chúng chết hẳn: `P27` (skill của gói
`design-loop-codex` — design-loop đi trọn), `P31` (khoá `agents/openai.yaml`
chỉ có bên Codex; nửa Claude đã có `P32` canh riêng), `P34` («ship ở CẢ HAI ấn
bản từ một nguồn» — còn một ấn bản thì mệnh đề không còn nội dung), `P95` thì
NGƯỢC LẠI phải giữ (bất biến «gói này không được thò tay vào gốc gói kia, phải
đi qua bộ giải» vẫn đúng nguyên khi gói Claude chính là cây nguồn).

**(c) Một ca sinh NHIỀU dòng đo.** `P39` lặp trên hai tệp × hai assert = **4
dòng**; tệp Codex chết ⇒ mất **2 dòng**, không phải 0. Không ca nào khác có
hình dạng này (chỉ P39 in nhãn `[...]`).

### Phân loại CHỐT (đọc từng ca, không suy từ màu)

- **XOÁ — 24 ca:** `P01` `P02` `P03` `P04` `P05` `P05b` `P05c` `P06` `P23`
  `P27` `P30`(mirror sync) `P31` `P34` `P41` `P42` `P45` `P46` `P47` `P49`
  `P50` `P54` `P56` `P58` `P162`
- **TRIM / TRỎ LẠI NGUỒN — phần còn lại**, giữ nguyên số dòng đo.

### Đẳng thức chốt lại

```
173 (baseline đo được)  −  24 (ca xoá, mỗi ca 1 dòng)  −  2 (2 phân ca P39 chết)  =  147
```

**147 không đổi so với lần khai trước, nhưng lý do thì đổi hẳn.** Lần trước nó
ra từ `173 − 26` với một tập A sai 10 ca và bỏ sót chuyện P39 sinh 4 dòng; hai
sai số triệt tiêu nhau. Con số cũ đúng vì **may**, không vì kín — nên vẫn phải
ghi lại đây, kẻo lần sau ai đó dựa vào cách suy cũ.

**Neo chéo phải giữ khi cắt** (gỡ mà quên là đỏ oan, không phải gỡ quá tay):
`P80` assert tiêu đề của `P81` có mặt trong vùng design-pass ⇒ P81 phải TRIM,
cấm xoá · `P182` đọc khuôn `MBC-CASE-IDS` liệt kê P174–P182 ⇒ đụng P175/P181
phải sửa khuôn cùng lượt · guard `PLUGINS_SUITE_NESTED` bọc CHUNG P42+P45 ⇒
cắt cả cụm · các hằng số đếm sẽ vỡ: `P90` (`len(SITES)==8`, `SITES[3],SITES[7]`)
· `P91` (`found/8`) · `P57` (`len(present)==2`) · `P80` (`len(texts)==3`) ·
`P127` (`len(THAN)>=5`) · `P93` (`EXPECT_DIRS`).

## ⚠ SỐ ĐO LỆCH THỨ SÁU — `P178` thành ca xoá thứ 26; kỳ vọng 146 → **145**

*Ghi TRƯỚC khi chạy đo.* `P178` round-trip bộ sinh biên bản
`_acceptance/measure-birth-certificate/make-record.mjs`. Script đó **ghim cứng**
đường dẫn SKILL bên Codex (dòng 28) và bốn nhánh A1/A2/B1/B2 theo hai harness.

Ba đường, đã cân:

1. **Sửa `make-record.mjs`** → nhưng nó nằm trong `_acceptance/`, mà mục
   *Out of scope* của chính hợp đồng này khai «hồ sơ `_acceptance/` cũ là sử
   liệu bất biến». Nặng hơn: bỏ hai nhánh Codex làm đổi `hanh-vi-record.json`,
   tức **phải sinh lại bằng chứng của một hồ sơ ĐÃ KÝ**. Viết lại bằng chứng đã
   ký để một phép đo xanh là đúng thứ kit sinh ra để chặn.
2. **Để nguyên** → `P178` đỏ vĩnh viễn, mà AC-11 đòi 4 suite xanh. Không tồn
   tại trạng thái cây nào cho cả bộ xanh — cùng hình dạng mâu thuẫn AC-4↔AC-6
   mà bản duyệt đã phải xử một lần.
3. **Xoá `P178`** ← chọn đường này. Độ phủ mất là round-trip của một bộ sinh
   phục vụ ĐÚNG một feature đã đóng; các vế còn lại của cùng lời hứa
   (MEASURE-BIRTH-CLAUSE) vẫn có `P174`–`P177`, `P179`–`P182` canh.

**Đẳng thức chốt: `173 − 26 − 2 = 145`.** Đã sửa AC-11 trước khi đo.
**Cần owner/B veto nếu không đồng ý** — đây là chỗ duy nhất trong đợt này mà
tôi chọn mất một mẩu độ phủ thay vì chạm vào sử liệu đã ký.

## ✅ SUITE `plugins`: ĐẲNG THỨC GIỮ ĐƯỢC — 145/145 xanh

Đo sau khi mổ xong: **145 ca, 145 xanh, 0 đỏ.** Đúng bằng `173 − 26 − 2` đã
khai TRƯỚC. Số này đi qua ba lần chỉnh (147 → 146 → 145), **mỗi lần đều trước
một phép đo**, mỗi lần vì đọc ra một ca không có đích để trỏ về — không lần
nào vì thấy số đo rồi mới sửa.

### Bốn thứ lộ ra trong lúc chữa 8 ca đỏ cuối

1. **Bánh cóc chống hạ-thước làm đúng việc của nó.** `P161`/E11 so bộ kiểm với
   mốc so-bản-cũ và bắt được **106 assert biến mất**. Đường đúng không phải nới
   chốt mà là **khai ra**: thêm `tests/plugins/asserts-da-go.txt` liệt kê từng
   dòng đã gỡ, và chốt chạy HAI CHIỀU — assert mất mà không khai thì đỏ, dòng
   khai mà assert vẫn còn cũng đỏ (chặn thói đổ sẵn danh sách dài cho khỏi
   nghĩ). Đã phá thử cả hai chiều, cả hai đều đỏ đúng thông điệp.
2. **Danh sách site sống trong BẢN LUẬT, không trong bộ kiểm.** `P188`/`P193`
   vẫn đọc đường dẫn Codex sau khi tệp suite đã sạch, vì khuôn
   `GATE-INVITE-SITES` / `GATE-ONESHOT-SITES` nằm trong
   `human-facing-language.md`. Bài học: quét tham chiếu chết phải quét cả **dữ
   liệu bên ĐỌC**, không chỉ mã bên chạy.
3. **Đột biến neo vào vật đã chết là đột biến chết.** Sau khi trỏ nạn nhân về
   bản Claude, ba đột biến (`MUT-8`, `MUT-12`, `P194`) vẫn dùng needle tiếng
   Anh của bản Codex nên "không tác dụng" — ca xanh mà chẳng chứng minh gì nếu
   không có chốt `assert mut != goc`.
4. **Bộ sinh nằm trong hồ sơ đã ký** (`stop-patching-law/make-record.mjs`) ghim
   cứng harness Codex. Không xoá ca, không viết lại bằng chứng đã ký: cho bộ
   sinh **bỏ qua harness vắng và NÓI RA** (một dòng stderr). Nhánh còn lại sinh
   ra y nguyên byte như bản đã commit ⇒ không dòng bằng chứng nào bị viết lại.
   `P168` cũng vậy: bảng đột biến trong hợp đồng cũ giữ nguyên (vẫn khai 16 ca,
   vẫn đối chiếu với con số khai bằng chữ), phần chạy được lọc còn 8 và **in ra
   số ca bỏ qua** — cắt im lặng đọc y hệt "đã phủ hết".

## ✅ SUITE `workflows`: 463/463 xanh — và một phép ĐẾM SAI bị lộ

Hợp đồng khai `workflows 62 → 62`. Đo trên cây của mốc: **488**. Suite này gồm
**sáu tệp**, mỗi tệp tự in dòng tổng kết riêng, và `62` là số của **đúng một
tệp** (`skill-claims`) — dòng cuối cùng in ra nên dễ đọc nhầm thành tổng. Giữ
nguyên «62 → 62» thì tiêu chí mù với 426 ca còn lại: đúng lớp
**tổng-kết-không-kèm-số-ca** đã ghi sổ, lần này nằm ngay trong hợp đồng.

Khai lại `488 → 463` kèm dẫn xuất **từng tệp**, rồi đo: cả sáu tệp khớp từng
con số. Lần khai đầu ghi `467` vì đếm sót `JRE_CLAUSES`; nó lộ ra vì tệp
`skill-claims` **dừng giữa chừng, không in nổi dòng tổng kết** — nếu tiêu chí
là một cái SÀN thì lần đó đã xanh.

## ⚠ VẤP THỨ BẢY — phép đo chập chờn, và màu đỏ nói SAI nguyên nhân

Làn máy S4 lượt đầu: **2/19 lượt ĐỎ trên cùng một script, cùng một cây.** Cùng
một `luu-kho-rang.sh` chạy 14 lần cho 12 xanh 2 đỏ — đó không phải kết quả, đó
là phép đo không ổn định.

Nguyên nhân: chân «mốc đã lên remote» gọi **mạng**. Mạng chập một nhịp thì cây
xanh cũng thành đỏ. Nhưng cái tệ hơn con số là **thông điệp**: nó in
«chua day len remote» trong khi mốc đã đẩy từ lâu — tức màu đỏ chỉ sai chỗ.

Hai kiểu hỏng này khác hẳn nhau và không được gộp:

| Kiểu hỏng | Nghĩa | Việc phải làm |
|---|---|---|
| mốc chưa đẩy | **vật hỏng** — hồ sơ không có đường đảo | chặn merge |
| không hỏi được remote | **đường truyền hỏng** | chạy lại |

Gộp chúng vào một câu là dạy người đọc phớt lờ đúng cái chân sống-còn nhất của
hồ sơ này — chân duy nhất chứng minh ~194 file gỡ đi có đường lấy lại.

**Chữa:** thử 3 lượt để nuốt cú chập ngắn; hết 3 lượt vẫn không hỏi được thì
**vẫn ĐỎ** (fail-closed — không chứng minh được là đã đẩy thì không được coi
như đã đẩy) nhưng ghim rõ «lỗi đường truyền, KHÔNG phải lỗi hồ sơ». Chạy lại 5
lượt liên tiếp: 5/5 xanh.

**Bài học cho lớp:** một phép đo phụ thuộc mạng phải trả lời được câu «đỏ này
là do vật hay do đường?» — nếu không, nó vừa gây báo động giả vừa che được lỗi
thật ở đúng cùng một câu chữ.

## TRẠNG THÁI BÀN GIAO (Phiên C, 12/08 — nối tiếp chính xác từ đây)

**Đã xong ở lượt này:** bugfix khối thoát-sớm (`feab99b`) · sửa-sau-Cổng-1 có
dấu vết (`67b2720`) · 2 ADR + 0001 superseded (`6a26b6f`) · phẫu thuật suite
đợt 1 (`410cbf1`): **xoá 25 ca**, **trim 20 ca**, dọn tham chiếu chết trong
comment của 5 script + `resolve-plugin.mjs` (gỡ thật nhánh `.codex/plugins/
cache` và dòng gợi ý cài Codex).

**Suite hiện ĐỎ có chủ đích** — chưa mổ xong. Còn đúng những ca sau (đã đọc,
đã biết phải làm gì, chưa làm):

| Ca | Việc |
|---|---|
| `P95` | Trỏ `AG,FL` về `root` + `root/"feature-loop"`; `IN_PKG` đổi sang `commands/*.md`; `fl` → `skills/feature-loop/SKILL.md`. **Bẫy:** `copytree(AG,…)` với AG=root sẽ chép cả `.git` — phải thêm `ignore_patterns('.git','node_modules','_acceptance','docs','.worktrees')`. Bộ dò dòng 2028 khớp cả `${CLAUDE_PLUGIN_ROOT}` nên mutant giữ nguyên được. |
| `P100` | Bỏ trọn nửa `check_codex` + `PKG = plugins/acceptance-gate`; giữ nguyên nửa `check_claude` và ba đột biến của nó |
| `P127` | Bỏ nhánh `codex_init` + `codex-plugin-runner.mjs`; `for d in ("commands","codex","skills")` → bỏ `codex`; ngưỡng `len(THAN)>=5` phải hạ theo số thân thật |
| `P165`–`P170` `P176` `P178` `P181` `P188` `P193` `P194` | Bỏ vế Codex/mirror khỏi bảng site; **đột biến phải neo lại vào vế Claude** (`m3/m6/m8/m12/m13` ở ≈9553–9645 đang neo vào tệp Codex — để nguyên là ca xanh mà không chứng minh gì) |
| `P173` (chỉ vế E14) | Bỏ đoạn «biên Codex» đọc `codex/acceptance-gate/skills`; bốn vế E3/E13/E15/E19 giữ nguyên |
| ca đọc `codex/**.toml` (≈ dòng 6916) | Fixture đòi có `.toml` dưới `codex/` — không còn cây nào. Đây là ca **thuộc nhóm xoá thứ 26** nếu không tìm được cây `.toml` thật khác; quyết bằng cách ĐỌC, và nếu xoá thì AC-11 xuống `145` TRƯỚC khi đo |

**Đã xong ở lượt 2 (commit `f6f7976` + lượt kế):** `P90` `P91` `P93` `P94`
`P99` `P101` `P122` `P128` `P133` `P147` `P156` `P164` `P167` + khối 3-thân-lệnh
`SITES` (approve/signoff/start).

**ĐÃ XONG thêm ở lượt này:** `tests/workflows/` (3 tệp, suite xanh 463/463) ·
`CLAUDE.md` (AC-13) · `CONTEXT.md` · `commands/approve.md` · `commands/signoff.md` ·
`skills/uat-session/SKILL.md` · `skills/ux-ui-craft/references/layout-craft.md:121` ·
`.github/workflows/gate.yml` · gỡ `.codex-plugin/` · `QUICKSTART.md` (sạch 0 hit) ·
`P28` trỏ về đường cài Claude · **`feature-loop/skills/feature-loop/SKILL.md`
nhánh CT2 (AC-5)** — bảng làn design nay chỉ còn CT1 (điều kiện là khoá
`executors.design.*` wire tay, không còn dò bằng script của design-loop), nghi lễ
design-of-record khai tử, resume-guard thôi đòi mockup provenance; `P20`/`P87`
sửa cùng lượt và nay đòi **CT2 VẮNG MẶT** (neo ÂM, chống mọc lại).

**CÒN LẠI của 1b:**
1. `GUIDE.md` — 47 hit rải 17 mục, có cả mục ghi-chú-phát-hành lẫn hướng dẫn
   sống. **Cần quyết một điều:** sửa hết, hay mở miễn trừ sử-liệu cho phần
   ghi-chú-phát-hành như đã làm cho `plugin.json`? Nguyên tắc đã đặt ở AC-4 là
   *changelog là lịch sử, viết lại cho lint xanh là xoá lịch sử lấy màu* — nếu
   theo nguyên tắc đó thì phải mở miễn trừ có phạm vi + chân ĐỎ-NGOÀI-DANH-SÁCH.
2. `GUIDE.md` phải THÊM đoạn hướng dẫn **wire `executors.design` bằng tay** —
   AC-5 đòi tường minh, chưa viết.
3. `README.md` — 35 hit (gồm hàng mô tả `.codex-plugin/plugin.json` và đường cài
   Codex; `P28` nay canh đường cài Claude nên README phải giữ đủ 4 needle đó).
4. `skills/acceptance/SKILL.md` (4 chỗ nhắc Codex trong chỉ dẫn chạy) + 3
   reference (`eval-executors.md`, `design-ui-check.md`, `human-facing-language.md`
   — mỗi tệp 1 hit).
5. Bộ răng `luu-kho-rang.sh` (10 chân đo + chiều đỏ, gồm chân AC-14 và AC-15).
6. Suite `scripts` + `hooks` + `product-map --check` (chưa chạy lần nào ở lượt này).
7. S4.

**Số kỳ vọng phải chỉnh trước khi đo:** hiện hợp đồng ghi `147` với dẫn xuất
`173 − 24 − 2`. Sau khi `P26` vào danh sách xoá, dẫn xuất đúng là
**`173 − 25 − 2 = 146`**. Sửa AC-11 lần nữa (có dấu vết) TRƯỚC khi chạy đo —
và nếu phần trim còn lại lộ thêm ca không có đích để trỏ về thì lại chỉnh
tiếp, mỗi lần đều PHẢI trước phép đo, không bao giờ sau.

## Còn lại (chưa làm)

1. Phẫu thuật `tests/plugins/run-tests.sh` theo ba nhóm A/B/C ở trên — 56 ca,
   ~93 tham chiếu `plugins/` rải khắp tệp 9000 dòng, KHÔNG có điểm nghẽn chung
   nên phải làm từng ca. Đây là phần dài nhất còn lại.
3. `tests/workflows/` — 3 file còn tham chiếu Codex.
4. Chữa tham chiếu sống ở: `CLAUDE.md` (bất biến mirror, 4 chỗ) · `GUIDE.md` ·
   `QUICKSTART.md` · `README.md` · `CONTEXT.md` · `commands/signoff.md` ·
   `commands/approve.md` · `skills/acceptance/SKILL.md` +
   `references/design-ui-check.md` + `references/human-facing-language.md` +
   `references/eval-executors.md` · `skills/uat-session/SKILL.md` ·
   `skills/ux-ui-craft/references/layout-craft.md:121` (tham chiếu SỐNG, PHẢI
   sửa) · `feature-loop/skills/feature-loop/SKILL.md` (nhánh CT2) ·
   `feature-loop/scripts/resolve-plugin.mjs` · `scripts/config-patch.mjs`.
5. Hai ADR mới + đánh dấu ADR 0001 superseded.
6. Viết `luu-kho-rang.sh` (10 chân đo + chiều đỏ tự đột biến).
7. Chạy S4.

## Miễn trừ mới cần khai vào hợp đồng trước khi đo

`*/plugin.json` chứa **nhật ký phiên bản** nhắc `design-loop`/`codex` như sử
liệu ("v1.7 adds design-loop-aware guards…"). Đó không phải con trỏ sống. Viết
lại changelog để lint xanh là xoá lịch sử để lấy màu — sai đổi. Đề nghị: miễn
trừ mô-tả-phiên-bản trong `plugin.json`, kèm chân ĐỎ-NGOÀI-DANH-SÁCH như đã làm
cho `ux-ui-craft`.

## VÒNG SỬA 1 (13/08) — sáu mục của rà soát đối kháng, và bốn mục cố ý không sửa

*Ghi bởi phiên chạy trên cloud, sau khi đọc `review-findings.md` (verdict
REJECT) và bản bàn giao 13/08.*

**Không tiêu chí nào bị nới.** Mọi thay đổi hoặc (a) chữa một khẳng định SAI,
hoặc (b) dựng một cái lưới đã KHAI mà chưa tồn tại, hoặc (c) khai ra một lần
sửa-sau-Cổng-1 trước đây chỉ nằm trong chú thích script. Ba hạng mục đầu là
những thứ vòng 1 tuyên đã có mà thật ra chưa có.

### Vấp thứ tám — phép đếm số ca ĐẦU TIÊN viết ra đã sai, và nó tự lộ

Chân máy cho AC-11 (`so-ca.sh`) bản đầu cộng dồn MỌI dòng `Results:` cho cả ba
suite có dòng đó. Suite `scripts` đếm ra **730** thay vì 664. Đi tìm nguyên nhân
thay vì chỉnh số: nhiều ca của suite ấy **dựng runner con rồi CHẠY nó**, nên đầu
ra có **bảy dòng `Results:` của FIXTURE** — kể cả một dòng `2 passed, 1 failed`
cố ý đỏ — trộn lẫn với dòng tổng kết thật ở cuối. Cộng dồn ở đó là đọc đầu ra
của đồ chơi thành số ca của bộ kiểm.

Chữa theo LỚP chứ không vá một suite: phương pháp đếm ghim riêng cho từng suite
và ghi thành bảng có chú thích —
`plugins` = đếm dòng ca (suite này KHÔNG tự in tổng) ·
`scripts`/`hooks` = dòng `Results:` CUỐI và nó phải nằm ở ĐUÔI log (fixture in ở
giữa) · `workflows` = cộng ĐÚNG SÁU dòng (suite gồm sáu tệp; ghim số dòng để một
tệp chết giữa chừng thì ĐỎ vì thiếu dòng, chứ không âm thầm cộng ra tổng nhỏ
hơn — đúng chuyện đã xảy ra thật với `skill-claims`).

Bài học cho lớp: **một suite in dòng tổng kết không có nghĩa dòng đó là của
suite.** Trước khi tin một con số tổng, hỏi "ai in dòng này ra".

### Số ca: đẳng thức GIỮ ĐƯỢC, và lần này do MÁY so

| Bộ kiểm | Đo được | Đẳng thức khai trước |
|---|---|---|
| `plugins` | 145 ca, 145 xanh | `173 − 26 − 2` ✔ |
| `workflows` | 463 ca, 463 xanh | `488 − 25` ✔ |
| `scripts` | 664 ca, 664 xanh | `671 − 7` ✔ |
| `hooks` | 54 ca, 54 xanh | `54 → 54` ✔ |

Bản khai bốn con số nay sống ở **một chỗ máy đọc được** — khối `SO-CA-KY-VONG`
trong `contract.md` — và `so-ca.sh` đọc chính khối đó, không giữ bản chép thứ
hai. Bộ răng kiểm ngược: bốn dòng của khối phải khớp câu chữ của AC-11, và bốn
eval phải thật sự trỏ vào bốn khoá so-ca (script không ai gọi là mã chết, không
phải lưới).

### ⚠ MÔI TRƯỜNG: chạy bằng root làm 2 ca ĐỎ oan — vật hay đường?

Container của phiên này chạy bằng `root`, và `chmod 000` không chặn được root.
Hai ca `P123`/`P129` **fail-closed đúng thiết kế** trong tình huống đó, và chúng
nói thẳng lý do ("chay bang root?"). Đo lại dưới một user thường sở hữu cây:
**145/145 xanh, exit 0.**

Ghi vào đây vì đúng lớp đã học ở vấp thứ bảy — *"đỏ này do vật hay do đường?"*.
Và vì nó cho thấy bộ đếm mới làm đúng việc: nó in
«plugins đủ 145 ca nhưng 2 ca ĐỎ — đây là ca hỏng, KHÔNG phải số ca lệch»,
tách hẳn khỏi câu «so ca lech ky vong». Gộp hai kiểu hỏng vào một câu thì một
lỗi môi trường đọc y hệt một đợt gỡ quá tay.

### Bằng chứng của một lượt ĐÃ KÝ nay là ghi-một-lần

Hai tệp `chi-dan-claude-*` của hồ sơ `stop-patching-law` đã trả về **đúng byte**
nội dung lúc ký. Bộ sinh nay không đụng vào nhánh đã có bằng chứng, và nói ra
một dòng khi bỏ qua.

Ca `P169` phải sửa theo, và chỗ sửa mới là điều đáng ghi: nó từng đòi hai tệp ấy
**bằng y bản sinh lại từ SKILL.md HIỆN TẠI**. Đó là một bất biến SAI — bản ghi
là sử liệu, còn SKILL.md thì đổi hợp lệ theo thời gian; buộc chúng bằng nhau
nghĩa là mỗi lần SKILL.md đổi thì bằng chứng đã ký phải bị VIẾT LẠI cho phép đo
xanh. Nay ca đó chia hai loại và đo bằng hai luật khác nhau: bản DẪN XUẤT
round-trip như cũ; cặp sử liệu đo **quan hệ nội bộ** (bản-đã-xoá == bản-có trừ
đúng khối mệnh đề, với mốc RÚT TỪ CHÍNH BỘ SINH), cộng một chiều đỏ chạy thật —
gieo hai tệp bằng một chuỗi không SKILL.md nào sinh ra được, chạy lại bộ sinh,
đòi chuỗi ấy SỐNG SÓT.

### Sổ chạy nay do PHÉP ĐO sinh

`ghi-so-chay.mjs`: append-only, mốc giờ và mã thoát đo tại chỗ, danh sách eval
**suy từ `evals.yaml` + `config.yaml`** (một `cmd:` trỏ khoá đã chết thì script
chết to thay vì ghi một dòng trông bình thường). Nhiều eval dùng chung một lệnh
thì chia nhau MỘT `run_id` — đó là sự thật của một lượt chạy vật lý; bịa nhiều
run_id cho một lượt là bịa ra nhiều phép đo. Vòng 1 có cả 19 dòng mang cùng một
mốc giờ, tức mốc giờ là thứ được viết ra chứ không phải thứ được đo.

### Mở rộng phạm vi — cần owner gạch ở Cổng 2

**AC-16 (bump phiên bản + đường phát hành) là tiêu chí THÊM MỚI.** Nó không có
trong bản duyệt Cổng 1. Lý do làm ngay thay vì để sau: sau merge, `design-loop`
không còn entry nào nên bản đã cài trên máy đội treo lơ lửng và lệnh cập nhật
không gỡ hộ được — đây là việc tay của người, và nó có hậu quả ngay ở lượt cài
kế tiếp. Nếu owner bác: gỡ AC-16 + E16, ghi vào «Giới hạn đã biết» rằng đội phải
được báo bằng đường khác.

### Bốn mục CỐ Ý không sửa

Đã ghi vào mục «Giới hạn đã biết» của trang bằng chứng kèm căn cứ: đây là răng
**dùng một lần** cho một đợt lưu kho, chết theo hồ sơ khi merge — không phải
lưới engine vĩnh viễn. Owner có thể gạt bất kỳ mục nào.

### Luật dừng-vá đang có hiệu lực

Vòng 2 mà vẫn sinh lỗi CÙNG LỚP với vòng 1 thì khuôn giải sai — DỪNG, trình
owner ba đường, không tự phát vòng ba.

## VÒNG SỬA 1, LƯỢT 2 (13/08) — owner gạch đường 3 + (c); và một bộ đếm mù lộ ra

*Ghi sau khi CI vòng 1 của bản sửa cho thấy known-limit đã khai NHẸ HƠN vật.*

### ⚠ VẤP THỨ CHÍN — bộ kiểm `scripts` chưa bao giờ đỏ được vì `*.test.mjs`

```bash
node "$_f"; check "$(basename "$_f")" 0 $?
```

Bash khai triển đối số **TRƯỚC** khi gọi `check`, nên `$(basename …)` chạy trước
và **ghi đè `$?`** bằng mã thoát của `basename` — luôn 0. Hệ quả: mọi tệp
`*.test.mjs` đỏ vẫn được ghi `PASS`, suite in `0 failed` và thoát 0.

Đo tại commit nền `d6044a4`: `core-untouched.test.mjs` **đã đỏ sẵn** trong khi
suite in `664 passed, 0 failed`. Nghĩa là đẳng thức `scripts` của AC-11 — con số
664 mà cả hồ sơ dựa vào — được đo bằng **một dụng cụ mù**. Đúng lớp
**bộ-chạy-nuốt-mã-thoát** đã ghi sổ; lần trước ở `tests/plugins` (khối thoát-sớm
giữa tệp), lần này ở `tests/scripts`, hình dạng khác hẳn.

Bài học cho lớp: **`$?` phải bắt vào biến NGAY dòng sau lệnh.** Mọi lần `$?` đi
qua một command substitution là một lần nó bị thay. Và tổng quát hơn: hai lần
liên tiếp lớp này xuất hiện ở hai bộ kiểm khác nhau với hai hình dạng khác nhau
— nên phép thử đúng không phải "tìm khối exit lạc" mà là *"bộ đếm này có đường
nào để nhận một ca đỏ không?"*, hỏi cho từng đường vào.

### Vì sao đường 3 một mình không đủ

`JR11b` và `DV4a` gọi `recheck` **thẳng trên corpus**, không qua
`pre-merge-check.sh`, nên phép thu phạm vi theo thiết kế không chạm tới chúng.
Không xử chúng thì bộ kiểm `scripts` đỏ vĩnh viễn, và **không lane nào xanh để
ký** — mà nghi thức re-pin cấm append dòng repin khi có suite exit khác 0.
Ba việc owner gạch vì thế bị **khoá vào nhau theo đúng một thứ tự**:
(c) → lane xanh → re-pin.

### Số ca `scripts`: lần đầu con số đi LÊN

`671 − 7 + 22 = 686`. 22 assert của AC-17 đếm **a-priori từ mã vừa viết**, khai
vào hợp đồng TRƯỚC khi chạy suite; đo ra đúng 686. Đây là lần đầu đẳng thức tăng
— và lý do phải đọc kỹ hơn mọi lần trước: `scripts/pre-merge-check.sh` nằm trong
`t3_paths` (lõi cưỡng chế), nên nó KHÔNG được vào cây mà không có răng.

### Hai lỗi của lượt này, cả hai là bài học lớp

1. **Fixture đo nhầm luật.** PR giả trong fixture đổi một file ngoài
   `_acceptance/`, làm hồ sơ cũ thành *stale*; luật staleness nổ TRƯỚC và
   `continue` trước khi tới luật đang đo. Hai ca đỏ vì đo nhầm luật chứ không vì
   vật hỏng. Chữa: fixture cố ý không đụng gì ngoài `_acceptance/`, và ghi chú
   ngay tại chỗ để lần sau không ai thêm lại.
2. **Răng `additive-only` (DV5) đỏ ĐÚNG.** Bản đầu viết lại một dòng luật cũ
   trong `pre-merge-check.sh`, mà tệp ấy có luật "diff chỉ được THÊM". Nắn lại
   thành thêm-thuần: guard ôm đúng MỘT dòng gọi `node`, và dòng ấy giữ nguyên
   văn cả thụt lề — trông lệch mắt, nhưng nắn cho đẹp là xoá một dòng luật cũ.

### Mở rộng phạm vi — ba tiêu chí mới, owner đã gạch, cần gạch LẠI ở Cổng 2

AC-17 (thu phạm vi + cờ cứu) · AC-18 (allowlist có tên) · AC-19 (bugfix bộ đếm).
Cả ba nằm ngoài bản duyệt Cổng 1. ADR 0010 ghi ngoại lệ đóng băng lõi kit, đánh
đổi **thước-thôi-hồi-tố**, và trigger đảo.


---

## Đính chính sổ sách (13/08, vòng thu gọn — G15 vòng 3)

Danh sách «Phân loại CHỐT» ở trên kể **24** ca xoá, trong khi hợp đồng nói
**26**. Hai ca vắng mặt:

- **`P178`** — có khai, nhưng ở mục «SỐ ĐO LỆCH THỨ SÁU» chứ không trong danh
  sách CHỐT (known-limit #4 của trang bằng chứng mô tả nó kỹ).
- **`P26`** — nằm trong danh sách «Nhóm C — KHÔNG ĐƯỢC XOÁ» ở trên, rồi bị
  chuyển sang nhóm xoá chỉ bằng một mệnh đề phụ («Sau khi `P26` vào danh sách
  xoá…») **không kèm lý do**. Lý do thật, kiểm bằng vật: bảy skill mà `P26` đòi
  (`acceptance-card`, `acceptance-status`, `approve`, `signoff`…) chỉ tồn tại
  trong bản mirror `plugins/acceptance-gate/skills/` — cây nguồn để chúng ở
  `commands/`, và `P30`/`P32` canh nửa đó. Xoá là ĐÚNG; tội là chuyển nhóm mà
  không sửa danh sách CHỐT.

Bản liệt kê ĐỦ, do máy sinh (diff TÊN ca mốc → ngọn), nằm ở
`review-findings.md` mục «Rà soát đối kháng — vòng 2 › DIFF TÊN CA» và được
vòng 3 đo lại khớp. Danh sách CHỐT ở trên giữ nguyên làm sử liệu — sửa nó là
xoá dấu vết một lần phân loại sai.