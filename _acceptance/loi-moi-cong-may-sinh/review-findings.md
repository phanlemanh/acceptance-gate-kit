# Review findings — loi-moi-cong-may-sinh (S4 vòng 3, đổi khuôn)

Người soi: phiên tươi độc lập, context sạch. Cây: 8dc872ff.

## Đã kiểm

**Đính chính cây trước mọi phép đo.** Đề bài nói cây đã commit tại `8dc872ff`;
`git rev-parse HEAD` của repo trả `2bda9c94`. Hai commit KHÁC sha nhưng CÙNG
tác giả, cùng giờ, cùng thông điệp, và `git diff --stat 8dc872ff HEAD` **rỗng**
— tức cùng một cây, một bản commit lại. Mọi số dưới đây đo trên cây đó; chỗ nào
cần bản «trước vòng» thì `git archive` `d859a830`, bản vòng 2 thì `bf76d74e`,
**lấy trọn thư mục `scripts lib`** chứ không chép danh sách file tay (lớp P150).

**Bản sao đối kháng.** `git clone --shared -b feat/loi-moi-cong-may-sinh` →
`HEAD` = `2bda9c94`, `git status --porcelain` rỗng, `_acceptance/` đủ 92 thư
mục. Dùng clone chứ không `tar -x` vì lưới gọi `git -C ROOT show`. Cây thật
KHÔNG bị chạm: mọi đột biến chạy trong bản sao, mỗi lượt `git checkout -- .` +
kiểm sạch trước lượt kế. Runner tự thoát 9 khi bước tiêm không đổi được byte
nào; tôi tự kiểm runner bằng một đột biến câm cố ý (thoát 9) và một bản tiêm vô
hại (chạy tiếp) TRƯỚC khi tin nó. **Hai lượt tiêm đầu của tôi bị vỏ shell nuốt
mất dấu thoát và cho kết quả ĐỎ GIẢ** — phát hiện khi in lại regex sau khi
tiêm; mọi bản tiêm sau đó đi qua một bộ tiêm Python có neo văn-tự.

**Đối chứng dương trên bản nguyên vẹn, TRƯỚC mọi đột biến** — tự chạy lại,
không tin run-log: `gate-card-lmcms` **33 passed, 0 failed** ·
`out-of-contract` **9 passed, 0 failed** · `tests/scripts/run-tests.sh` **795
passed, 0 failed** (exit 0) · `tests/hooks/run-tests.sh` **60 passed, 0 failed**
(exit 0).

**Mười bốn đột biến — 9 ĐỎ, 5 XANH.** Năm ca XANH đều chạy lại trên LƯỚI ĐẦY ĐỦ
(795 + 60 + 33 + 9 + workflows) để chắc không lưới nào khác bắt.

| # | Đột biến | Lưới | Ca / thông điệp |
|---|---|---|---|
| M1 | `daGhiQuyetDinh` luôn TRUE | ĐỎ 32/33 | LM18 |
| M2 | `daGhiQuyetDinh` luôn FALSE | ĐỎ 29/33 | LM09 · LM10 · LM18 · LM18b |
| M3 | gỡ vế «có khoá ngoài meta» (chỉ còn đòi `decision`) | ĐỎ 32/33 | LM18 |
| M4a | thêm khoá LẠ `'zzz-la'` vào `LEDGER_META_KEYS` | **XANH trọn lưới** | — |
| M4b | thêm `'impact'` vào `LEDGER_META_KEYS` | ĐỎ 29/33 | LM09 · LM10 · LM18 · LM18b |
| M4c | thêm `'serves'` vào `LEDGER_META_KEYS` | **XANH trọn lưới** | — |
| M5 | gỡ vế `\*\*` của `OOC_TRIED_ITEM_RE` | ĐỎ 32/33 + 8/9 | LM01 · `van-xuoi-0-finding-NGO` |
| M6 | gỡ vế `^\s+…:` của `OOC_TRIED_ITEM_RE` | **XANH trọn lưới** | — |
| M7 | gỡ dòng ép rỗng routing khi `!approvable` | ĐỎ 32/33 | LM18c |
| M8 | đổi MỘT ký tự trong bản chép `IDENTITY-ECHO-RULE` | ĐỎ 32/33 | LM17 «ban chep TROI khoi nguon» |
| M9 | thêm đuôi vào `one_shot` **Cổng 1** (chỗ render HTML) | ĐỎ 32/33 | LM15 «HTML Cong 1 lech --extract» |
| M10 | thêm đuôi vào `one_shot` **Cổng 2** (chỗ render HTML) | **XANH trọn lưới** | — |
| M11 | ĐẢO NGHĨA luật ở CẢ BA nơi, nhất quán | ĐỎ 32/33 | LM17 |

**Quét TRỌN xưởng — khoá sổ quyết định.** 67 hồ sơ có `decisions.jsonl`, **894
entry, 0 dòng hỏng**, **21 tên khoá** phân biệt. `LEDGER_META_KEYS` liệt 11.
Mười khoá NGOÀI danh sách: `impact` 797 · `serves` 346 · `why` 14 · `note` 12 ·
`evidence` 11 · `label` 4 · `ts` 3 · `what` 3 · `grounds` 2 · `scope_delta` 1.
Trong đó `label` (nhãn mục) và `ts` (dấu giờ) là **metadata thuần** nhưng KHÔNG
nằm trong danh sách — hai entry của `bai-hoc-do-luong-vao-engine` được coi là
«đã ghi quyết định» chỉ nhờ `label`. Chiều ngược lại chặt: mọi khoá TRONG danh
sách đều là khung sổ, không nuốt căn cứ nào.

**Quét TRỌN xưởng — phán quyết Treo.** Chỉ hồ sơ có `contract.md`: **66 hồ sơ có
Treo, 606 entry Treo, 14 entry bị chấm THIẾU, 3 hồ sơ dính.** Lời khai của
commit là «397 entry Treo, 5 thiếu, **1 hồ sơ dính**» — **sai cả ba số**. Tổ
hợp khoá đã mang phán quyết «đủ»: `impact` 338 · `impact+serves` 235 ·
`evidence+why` 11 · **`serves` một mình 5** · **`label` một mình 2** ·
`grounds+label+scope_delta` 1.

**Vi phân hồi quy BA CÂY trên xưởng thật** (`d859a830` → `bf76d74e` →
`2bda9c94`), chạy `gate-card.js` của từng cây với `--root` là cây thật:

| Hồ sơ | trước vòng | vòng 2 | vòng 3 | đọc |
|---|---|---|---|---|
| `release-2-2-0` | Treo=bao | Treo=**hoi** | Treo=bao | hồi quy ĐÃ ĐÓNG |
| `ra-co-ten-lam-va-trao` | Treo=bao | Treo=**hoi** | Treo=**hoi** | còn nguyên |
| `release-2-4-0` | Treo=bao | Treo=**hoi** | Treo=**hoi** | còn nguyên, commit KHÔNG nêu |
| `release-2-5-0` | Treo=bao | Treo=bao | Treo=**hoi** | **hồi quy MỚI do chính vòng 3 đẻ** |

Tôi đọc `decisions.jsonl` của cả ba để tự kết luận, không tin lời khai:
· `ra-co-ten-lam-va-trao` — 5 entry khoá `id/type/stage/decision/decided_by/
decided_at`, thân là chữ ký Cổng 2 của NGƯỜI («Cổng 2 — xác nhận phần cắt/hoãn:
ĐỒNG Ý CẮT…»), căn cứ nằm TRONG chính trường `decision`. Đây KHÔNG phải «thiếu
căn cứ» như commit khai; đây là hỏi lại người về chữ ký người vừa ký — trạm thu
phí.
· `release-2-4-0` — 7 entry có `serves: []`. Mảng RỖNG, `String([])` = `''` →
rơi. Toàn văn quyết định vẫn đủ. Một mảng truy vết rỗng kéo cả nhóm về ô hỏi.
· `release-2-5-0` — 3 entry theo **phương ngữ thứ BA**: `ts/type/by/what/why`,
**không có khoá `decision` nào cả**, nội dung nằm ở `what`+`why`. Vế chặn đầu
tiên của luật (`!String(e.decision||'').trim()` → false) làm cả nhóm rơi. Đây
đúng là phương ngữ `why` mà chú giải khai là đã đọc được.

**Bộ dựng thẻ có sập lặng không.** Chạy `--extract` lên toàn bộ hồ sơ có
`contract.md`: 0 hồ sơ exit≠0, 0 hồ sơ JSON hỏng. Chỉ **1 hồ sơ đổi routing**
ngoài ba hồ sơ trên: `loi-moi-cong-may-sinh` (`hoi=[] bao=[]`) — đúng chủ đích
của LM18c.

**Quét TRỌN xưởng — cờ vàng OOC.** 63 `review-findings.md`; chạy
`lib/out-of-contract.js` THẲNG lên từng file: **đúng 1 hồ sơ bật
`suspect_empty`** (`lenh-in-ra-phai-bam-duoc`), khớp `sweep-baseline.txt` (ba
dòng còn lại là loại cờ `token-la`). **0 cờ oan trên xưởng hôm nay.** Vi phân
regex CŨ↔MỚI trên 7 hồ sơ có mục Ngoài-hợp-đồng mà parse ra 0 finding: **0 hồ
sơ lệch** — vế mới không bắt oan ai trên dữ liệu thật.

**Nhưng vế mới bắt oan được — đo bằng bản dò.** `ooc.parse` trên lời khai rỗng
kèm một dòng THỤT LỀ có dấu hai chấm: `(không có.)` + `  Ghi chú: bốn hồ sơ cũ
đã ký` → **CỜ** · `(không có.)` + `  - Lý do: …` → **CỜ** · `(không có.)` +
`    xem https://example.com/a` → **CỜ**. Đối chứng dương: mục đúng khuôn →
1 finding, không cờ; lời khai rỗng phẳng → sạch. Chú giải
`lib/out-of-contract.js:58` khai «lời khai rỗng … **không bao giờ** bị gọi oan»
— mệnh đề đó SAI, ba bản dò trên bác nó.

**Không thước nào ghim ROUTING trên xưởng thật.** `grep -rn routing tests/` giao
với `_acceptance|sweep|baseline` = **0 hit**. LM13 quét trọn xưởng nhưng chỉ gom
`suspect_empty` · `token-la` · `roi-bac` — không đọc `routing`. Đó chính là lý
do hồi quy ba hồ sơ đi lọt HAI vòng liên tiếp.

## Trạng thái 5 finding vòng 2

| # | Tóm tắt | Trạng thái | Bằng chứng |
|---|---------|-----------|-----------|
| 1 | Bảng định tuyến lấy khoá từ THIẾT KẾ, hai hồ sơ thật mọc thêm ô hỏi (AC-3) | **CHƯA ĐÓNG** | Bảng `ROUTING` xoá thật, nhưng vi phân ba cây: hồi quy từ 2 hồ sơ (vòng 2) lên **3 hồ sơ** (vòng 3), trong đó `release-2-5-0` là hồi quy MỚI. Luật mới vẫn liệt kê — 11 tên khoá meta + một tên trường `decision` đóng cứng |
| 2 | `OOC_TRIED_ITEM_RE` hai vế, một vế không răng; chú giải khai ca đối chiếu không tồn tại (AC-5) | **ĐÓNG MỘT NỬA** | Nửa chú-giải-sai ĐÓNG: `OOC_ITEM_FIELDS` xoá, `grep -rn OOC_ITEM_FIELDS tests/` = 0 hit và không còn lời khai nào trỏ tới ca ma. Nửa không-răng CÒN NGUYÊN: M6 (gỡ trọn vế thứ hai) **XANH trọn lưới** — y hệt N2b vòng 2 |
| 3 | Răng AC-8 đo TỪ VỰNG, không đo QUAN HỆ (AC-8) | **ĐÓNG** | LM17 rút mệnh đề qua marker rồi so từng ký tự: M8 (đổi MỘT ký tự ở bản chép) ĐỎ; M11 (đảo nghĩa NHẤT QUÁN cả ba nơi) cũng ĐỎ — nghĩa là luật được ghim vào đúng nội dung, không chỉ vào sự-giống-nhau |
| 4 | Round-trip Cổng 1 là phép CHỨA, không phải đẳng thức (AC-2) | **ĐÓNG MỘT NỬA** | Cổng 1 nay đẳng thức: M9 ĐỎ. Cổng 2 vẫn `html.includes(j.one_shot)` (`gate-card-lmcms.test.mjs:227`): M10 **XANH trọn lưới**. Lớp được vá ở một chỗ, bản sao y hệt cách đó 80 dòng không bị quét |
| 5 | Thẻ chưa-ký-được: máy đọc 6 ô hỏi, người đọc «không cần làm gì» (AC-3) | **ĐÓNG** | M7 (gỡ dòng ép rỗng) ĐỎ ở LM18c, và LM18c có đối chứng hai mặt: `one_shot === null` + `routing` rỗng + HTML còn câu «không cần làm gì». Vi phân xưởng xác nhận đúng 1 hồ sơ đổi |

Hai ĐÓNG, hai ĐÓNG MỘT NỬA, một CHƯA ĐÓNG.

## Khuôn mới có thoát ba lớp cũ không

**Lớp «allowlist trên không gian mở» — KHÔNG THOÁT.** Khuôn mới bỏ được đúng
MỘT danh sách (`e.type`) và dựng lên HAI danh sách mới: `LEDGER_META_KEYS` (11
tên khoá) và — quan trọng hơn vì bị giấu trong câu điều kiện — tên trường
`decision` đóng cứng ở vế đầu. Bằng chứng không suy đoán: `release-2-5-0` dùng
phương ngữ `what`+`why` không có khoá `decision`, và cả nhóm Treo của nó rơi về
ô hỏi — **hồi quy MỚI do chính vòng này đẻ ra**. Chú giải khai «hỏi hình dạng
thì phương ngữ đời sau vẫn đọc được mà không phải sửa gì»; phương ngữ đời TRƯỚC,
đang nằm sẵn trong xưởng, đã bác lời khai đó. Thêm: M4a và M4c (thêm khoá vào
danh sách) XANH trọn lưới ⇒ chỉ MỘT phần tử của danh sách (`impact`) có chiều
đỏ, mười phần tử còn lại không.

**Lớp «nhánh không có chiều đỏ» — KHÔNG THOÁT.** Ba nhánh sống mà gỡ đi vẫn
xanh trọn lưới: vế `^\s+…:` của `OOC_TRIED_ITEM_RE` (M6) · round-trip Cổng 2
(M10) · thành phần của `LEDGER_META_KEYS` ngoài `impact` (M4a, M4c). Vòng 2 gọi
tên lớp này bằng N2b; vòng 3 viết lại chính dòng đó sang hình dạng khác **mà
không thêm ca nào cho nó**.

**Lớp «hai nguồn cho một luật» — THOÁT, ở hai chỗ được gọi tên.** Bản chép thứ
hai của khuôn mục (`OOC_ITEM_FIELDS`) bị xoá hẳn, không còn gì để trôi. Hai mặt
đọc của thẻ chưa-ký-được nay khai cùng một điều và có răng (M7). Luật danh tính
nay một nguồn + hai bản chép so từng ký tự (M8, M11). Cảnh báo: đường khâu
HTML↔extract ở Cổng 2 vẫn là hai nguồn KHÔNG được ghim (M10) — nó thuộc lớp
thiếu-chiều-đỏ, nhưng nếu để lâu nó sẽ tái sinh đúng lớp này.

**Đọc chung.** Khuôn đã đổi thật ở tầng mã — bảng liệt loại biến mất, câu hỏi
chuyển từ «thuộc loại nào» sang «có thuộc tính gì». Nhưng phép ĐO không đổi
tầng theo: mọi ca mới (LM18, LM18b, LM18c) đều là **fixture tự dựng**, và
không ca nào gắn vào **xưởng thật** — trong khi cả hai vòng, 100% hồi quy đều
lộ ra ở xưởng thật và 0% lộ ra ở fixture. Đúng luật «thước phải gắn vào vật
được giao» của CLAUDE.md. Chừng nào chưa có một dòng baseline routing quét trọn
`_acceptance/` (đúng hình dạng `sweep-baseline.txt` đã làm cho cờ vàng), vòng
bốn sẽ lại phát hiện hồi quy bằng mắt phiên đối kháng chứ không bằng lưới.

## Trong hợp đồng

- **Hồi quy định tuyến chưa đóng, và vòng này đẻ thêm một hồ sơ nữa — trong khi
  lời khai nói đã đóng.** Vi phân ba cây trên xưởng thật: `release-2-2-0` đã
  quay về dòng-báo (đóng thật), nhưng `ra-co-ten-lam-va-trao` và `release-2-4-0`
  còn nguyên ô hỏi, và `release-2-5-0` **mới rơi ở vòng này** (vòng 2 nó còn
  đúng). Ba hồ sơ thật mỗi hồ sơ mọc thêm một ô hỏi so với `d859a830` — ngược
  chiều Đường đo của chính hợp đồng («≤3 lượt gọi người/vòng, ≤1 chạm/lượt»).
  Thông điệp commit khai «HỒI QUY ĐÓNG … 1 hồ sơ dính» và «`ra-co-ten-lam-va-trao`
  vẫn HỎI nhưng đó là phán quyết ĐÚNG: 5 entry thật sự thiếu căn cứ». Tôi đọc
  năm entry đó: chúng mang `decided_by` là NGƯỜI và toàn văn căn cứ nằm trong
  chính trường `decision` («Cổng 2 — xác nhận phần cắt/hoãn: ĐỒNG Ý CẮT. Phạm vi
  giao là…»). Hỏi lại người về chữ ký người vừa ký là trạm thu phí, không phải
  phán quyết đúng. AC: AC-3
- **Ba con số công bố không tái lập được.** Commit khai «Toàn xưởng 397 entry
  Treo, 5 thiếu, 1 hồ sơ dính». Đo lại độc lập, đúng bộ lọc mà `gate-card.js`
  dùng (`contract.md` có mặt · `sealIdx` · bỏ `type==='seal'`): **606 entry
  Treo, 14 thiếu, 3 hồ sơ dính**. Không có cách đọc nào của tôi ra được 397/5/1.
  Cùng commit đã tự ghi sổ một phép đo sai giữa vòng; ba số này chưa được đo
  lại sau khi sửa, nhưng vẫn đang đứng trong thông điệp như bằng chứng
  «hồi quy đóng». AC: AC-3
- **Luật mới vẫn LIỆT KÊ, chỉ đổi chỗ liệt — và danh sách gần như không có
  chiều đỏ.** `scripts/gate-card.js:114-121`: vế một đóng cứng tên trường
  `decision`; vế hai đóng cứng 11 tên khoá. Xưởng có 21 tên khoá và ít nhất ba
  phương ngữ ghi quyết định, trong đó `what`+`why` (không có `decision`) làm cả
  nhóm rơi. Ở chiều ngược, `label` (nhãn mục) và `ts` (dấu giờ) là metadata
  thuần nhưng nằm NGOÀI danh sách nên được tính là căn cứ — hai entry thật đang
  được máy tự đi tiếp chỉ nhờ một cái nhãn. Lưới: M4a (`'zzz-la'`) và M4c
  (`'serves'`, khoá đang gánh phán quyết cho 5 entry thật) đều **XANH trọn
  lưới**; chỉ M4b (`'impact'`) đỏ. AC: AC-3
- **Vế thứ hai của tín hiệu sai-khuôn vẫn không có chiều đỏ — đúng lỗ vòng 2 đã
  gọi tên, đổi hình dạng chứ không đóng.** `lib/out-of-contract.js:61`,
  `OOC_TRIED_ITEM_RE = /\*\*|^\s+\S[^:]*:\s*\S/`. M6 gỡ TRỌN vế `^\s+…:` →
  33/33 + 9/9 + 795/0 + 60/0, **không lưới nào bắt**. Ma trận 7 ô của
  `tests/scripts/out-of-contract.test.mjs` vẫn không có ô nào cho mục thiếu hẳn
  dấu đậm — cùng nhận xét vòng 2 viết cho `OOC_ITEM_FIELDS`, viết lại nguyên
  văn cho bản kế nhiệm của nó. AC: AC-5
- **Chú giải khai một bất biến mà ba bản dò bác được.** `lib/out-of-contract.js:58`
  viết «Lời khai rỗng … không thụt lề, không dấu đậm, nên **không bao giờ** bị
  gọi oan». Chạy `ooc.parse` trực tiếp: lời khai rỗng kèm một dòng thụt lề dạng
  `Ghi chú: …`, hoặc một gạch đầu dòng thụt lề `- Lý do: …`, hoặc một URL thụt
  lề, đều bật `suspect_empty`. Đây đúng lớp «cờ oan» mà vòng 1 bắt được và bản
  vá vòng 1 đảo chiều để tránh. Trên xưởng hôm nay 0 lượt (tôi quét đủ 63 file,
  vi phân regex cũ↔mới lệch 0), nên nó là lỗ NGỦ, không phải lỗ đang chảy —
  nhưng lời khai «không bao giờ» thì sai và AC-5 đòi đối chứng dương cho đúng
  tính chất này. AC: AC-5
- **Round-trip HTML↔extract chỉ được nâng ở Cổng 1; bản sao y hệt ở Cổng 2 còn
  nguyên phép CHỨA.** LM15 nay so đẳng thức (M9 ĐỎ), nhưng LM09
  (`tests/scripts/gate-card-lmcms.test.mjs:227`) vẫn `if (!html.includes(j.one_shot))`.
  M10 (HTML Cổng 2 in `one_shot` kèm đuôi lạ) **XANH trọn lưới**. AC-2 nói
  «khối VIỆC CỦA ANH chứa ĐÚNG chuỗi `one_shot`» và E2 khai «đột biến làm hai
  bên lệch một ký tự → đỏ» — mệnh đề đó đúng cho Cổng 1, sai cho Cổng 2. Luật
  «sửa phải theo LỚP, quét cả file tìm mọi case cùng hình dạng» của CLAUDE.md
  áp thẳng vào đây. AC: AC-2
- **Hợp đồng ĐÃ KÝ đang mô tả một cơ chế nay không còn tồn tại.** AC-3 viết
  «mục KHÔNG khớp hàng nào của **bảng ánh xạ** render thành Ô HỎI — **hàng mặc
  định của bảng** là loại-5». Vòng này xoá trọn bảng và hàng mặc định; câu tiêu
  chí đọc theo nghĩa đen nay không đo được, và LM18 (ca mang tên tiêu chí đó)
  đang chứng một mệnh đề KHÁC: «Treo thiếu vế được-mất → ô hỏi». Ý ĐỊNH của
  tiêu chí (đoán về phía rơi-về-người) vẫn còn sống, nhưng vật và thước đã trôi
  khỏi lời hợp đồng mà không đi qua cổng nào. Theo nếp «hồ sơ ĐÃ KÝ không kéo
  vào diff», đây là việc của người: giữ nguyên chữ ký và ghi con trỏ «thay
  thế», hay mở lại tiêu chí. AC: AC-3

## Ngoài hợp đồng

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Không phép đo nào canh «ai phải trả lời bao nhiêu câu» trên kho thật**
  Người dùng thấy gì: kit đã có một bản ghi mốc canh cờ cảnh báo trên toàn bộ hồ sơ cũ, nên đổi cách nhận diện cờ là biết ngay. Nhưng con số quan trọng hơn với người ký — mỗi hồ sơ hiện ra bao nhiêu ô phải trả lời — thì không có bản ghi mốc nào; hai vòng liền, việc một hồ sơ tự dưng mọc thêm câu hỏi đều phải chờ một người ngồi soi mới lộ ra.
  file: `tests/scripts/gate-card-lmcms.test.mjs:270`
  severity: high
  Đề xuất: new-contract
- **Hỏi thẻ về một hồ sơ vẫn kéo theo một lượt quét trọn kho**
  Người dùng thấy gì: mỗi lần máy dựng thẻ cho một hồ sơ còn ký được — đúng lúc người sắp được mời quyết — nó vẫn lặng lẽ quét lại toàn bộ kho trước khi trả lời. Đo lại vòng này: hồ sơ ký được 0,55 giây, hồ sơ đang đỏ 0,03 giây; tức lượt quét chỉ được bỏ ở đúng những hồ sơ không mời ai cả.
  file: `scripts/gate-card.js:731`
  severity: medium
  Đề xuất: known-limits
- **Bản quét xưởng vẫn bỏ qua im lặng mọi hồ sơ làm bộ dựng thẻ sập**
  Người dùng thấy gì: nếu về sau một hồ sơ khiến bộ dựng thẻ lỗi, bản quét không kêu lên mà lặng lẽ bỏ hồ sơ đó ra khỏi phép đếm. Hôm nay đo được 0 hồ sơ sập nên chưa lộ; vòng 1 và vòng 2 đều đã nêu và chưa vòng nào chạm.
  file: `tests/scripts/gate-card-lmcms.test.mjs:278`
  severity: low
  Đề xuất: known-limits
- **Phép so hai dòng trả lời bám nhầm dòng khi hồ sơ nhắc tới chính cái tên đó**
  Người dùng thấy gì: bài kiểm canh «dòng mẫu trên thẻ khớp danh sách việc của người» đi tìm cụm chữ ĐẦU TIÊN trùng tên trên thẻ; có hồ sơ thật nhắc đúng cụm đó trong phần mô tả lỗi, nên nếu bài kiểm chạy trên hồ sơ thật nó sẽ đo nhầm một đoạn văn thay vì dòng trả lời. Hôm nay nó chỉ chạy trên hồ sơ dựng sẵn nên chưa lộ.
  file: `tests/scripts/gate-card-lmcms.test.mjs:376`
  severity: low
  Đề xuất: known-limits
- **Một câu trong bản luật bị cắt đứt giữa chừng khi tách khối trích dẫn**
  Người dùng thấy gì: bản luật ngôn ngữ mặt người — thứ phiên sau đọc để biết phải hỏi hay không hỏi tên người ký — nay có một câu bắt đầu bằng dấu gạch ngang lửng ngay sau một dòng đánh dấu kỹ thuật, nên yêu cầu «phải in cả nguồn suy ra cái tên» treo lơ lửng không gắn vào câu nào. Nội dung chưa mất, nhưng người đọc phải tự ghép lại.
  file: `skills/acceptance/references/human-facing-language.md:233`
  severity: low
  Đề xuất: new-contract

## Known limits đề xuất

- **Tín hiệu «đã thử viết mục» vẫn chỉ bắt được mục CÓ dấu đậm hoặc CÓ dòng
  thụt-lề-khoá-hai-chấm.** Một mục viết hoàn toàn bằng văn xuôi phẳng vẫn chìm
  lặng (`suspect_empty=false`, tôi thử trực tiếp qua `ooc.parse`). Giữ nguyên
  lời khai vòng 2; đổi khuôn không mở rộng vùng phủ, chỉ đổi cách nhận diện.
- **Vế thứ hai của tín hiệu ấy đổi chiều sai thành CỜ OAN** trên lời khai rỗng
  có dòng thụt lề mang dấu hai chấm (ba bản dò ở mục Trong hợp đồng). 0 lượt
  trên xưởng hôm nay — khai để nó không im.
- **`LEDGER_META_KEYS` chỉ có chiều đỏ cho đúng một phần tử** (`impact`). Thêm
  hay bớt mười phần tử còn lại không lưới nào bắt.
- **Round-trip HTML↔extract có răng đẳng thức ở Cổng 1, phép CHỨA ở Cổng 2.**
  Thêm nửa này vào lời khai; nửa Cổng 1 của vòng 2 đã đóng.
- **E11 quét xưởng vẫn chỉ chạm Cổng 2** — mọi hồ sơ có `contract.md` render
  Cổng 2, nên loại cờ `roi-bac` chưa từng được quét trên xưởng thật. Giữ
  nguyên lời khai hai vòng trước.
- **Hình dạng «hồ sơ không có mục cắt/hoãn» không tồn tại trong xưởng**, nên
  nhánh đó chỉ được chạm bằng fixture. Giữ nguyên.
- **Thẻ Cổng 2 cố ý in HAI dòng trả lời với hai bộ chỗ trống khác nhau** cho các
  mục Ngoài-N — hệ quả trực tiếp của AC-1 và AC-3 cùng lúc, không phải lỗi. Giữ
  nguyên.
- **Thẻ chưa-ký-được nay khai routing RỖNG cả hai chiều**, kể cả các mục
  Ngoài-N đang chờ định đoạt. Đó là chủ đích (thẻ đang đỏ thì không mời ai), và
  nó khớp mặt HTML — nhưng nghĩa là `--extract` của một hồ sơ REJECT không còn
  liệt được việc gì cho bất kỳ bộ đọc máy nào ở hạ nguồn.
- **AC-8 chỉ đo văn bản luật, không đo hành vi hội thoại của phiên** — không có
  harness cho phần đó. Giữ nguyên lời khai đã ký trong hợp đồng.
- **`ts` trong `run-log.jsonl` là giờ gọi workflow, không phải giờ lệnh chạy.**
  Vòng này tôi tự chạy lại cả bốn suite thay vì tin log.
