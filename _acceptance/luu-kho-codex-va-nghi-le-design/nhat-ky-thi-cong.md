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

**Sau đó mới tới** (theo thứ tự): `tests/workflows/` 3 file còn trỏ Codex ·
~15 tệp văn bản còn tham chiếu sống (`CLAUDE.md` 4 chỗ · `GUIDE.md` ·
`QUICKSTART.md` · `README.md` (gồm hàng `.codex-plugin/plugin.json` và đường
cài Codex mà `P28` đang canh) · `CONTEXT.md` · `commands/approve.md` ·
`commands/signoff.md` · `skills/acceptance/SKILL.md` + 3 reference ·
`skills/uat-session/SKILL.md` · `skills/ux-ui-craft/references/layout-craft.md:121`
(tham chiếu SỐNG, PHẢI sửa) · `feature-loop/skills/feature-loop/SKILL.md` nhánh
CT2 · `.github/workflows/gate.yml` (tên bước còn nhắc P30 + comment) ·
`.claude-plugin/plugin.json`/`feature-loop/.claude-plugin/plugin.json` **KHÔNG
sửa** — đã khai miễn trừ sử-liệu ở AC-4) · gỡ `.codex-plugin/` · `P28` trim về
đường cài Claude · bộ răng `luu-kho-rang.sh` (10 chân + chiều đỏ, gồm chân
AC-14 và AC-15) · chạy trọn 4 suite · S4.

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
