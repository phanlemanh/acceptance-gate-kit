# Rà soát đối kháng — vòng 1 (hồ sơ `cat-hinh-thuc`)

*Ba phiên chấm độc lập, ba lăng kính (phép đo · cắt-quá-tay · hợp-đồng-đối-vật),
context sạch, chấm trên worktree riêng tại ngọn `48396fb2` (base `main` đã merge
1b). Người thi công KHÔNG chấm — chỉ dựng môi trường và tổng hợp.*

## Verdict vòng 1: **REJECT**

**Cả ba lăng kính REJECT** — **5 P0 · 5 P1 · 4 P2** sau khi gộp trùng.

### Phần được xác nhận SẠCH (đo độc lập, không qua dụng cụ của hồ sơ)

- **Bốn đẳng thức số ca khớp tuyệt đối**: plugins **146** · workflows **463**
  (đúng 6 dòng, 324+11+42+16+26+44) · scripts **686** · hooks **54**.
- **Diff tên ca `origin/main` → ngọn 1a = 0 mất, 0 thêm ở CẢ BỐN suite.**
  Đẳng thức không che giấu gì.
- **Khối 👉 VIỆC CỦA ANH còn trên thẻ cổng** ở cả ba nhánh render (đo trên ĐẦU
  RA `gate-card.js`, không grep mã nguồn) — 1a.2 giữ đúng lời hứa.
- **Không lưới cưỡng chế nào bị gỡ**: `require_human_commit`, `agent_authors`
  (3→4), gap-probe, recheck, staleness còn nguyên; `scripts/`, `hooks/`, `lib/`
  **không có một dòng nào** trong diff.
- **Đối chứng dương neo `origin/main` CÒN SỐNG** sau khi 1b merge — 8/8 needle
  có base 1..11, không chân nào base=0. Lời khai known-limit khớp vật.
- Re-pin lần 14 **hợp nghi thức trọn bốn vế**; không khoá `config:executors.*`
  nào chết; `E6 THE-CONG` và chân giữ-gân qua marker là hai chân đo đúng cách.

### Hình dạng chung của mọi P0 — khác hẳn 1b

> **Eval hứa một phép đo MẠNH; script cài một phép đo YẾU hơn; không gì so hai
> bên.** Ở 1b lỗ là *bản chép giá trị trôi khỏi nhau*; ở 1a là *lời hứa và bản
> thi công trôi khỏi nhau*.

Ít nhất **5 eval** cùng hình dạng: E1 (4 needle → 2) · E2 (8 tổ hợp + round-trip
→ **0 dòng mã**) · E3 (rút qua marker + so tập → `grep` cả file) · E9b (4 needle
→ 1) · E10 (đo quan hệ qua marker + chiều đỏ → hai `grep -q` rời, 0 chiều đỏ).

---

## P0 · Năm lỗ chặn

### H1 — E2/AC-2 «đường đọc-cũ cho 38 hồ sơ đã ký» KHÔNG có một dòng mã nào, mà sổ chạy đóng dấu xanh ba vòng
*Hai lăng kính tìm ra độc lập.* `evals.yaml:64-96` · `cat-hinh-thuc-rang.sh` · `run-log.jsonl`

`evals.yaml` hứa 8 tổ hợp `DOC-CU: <reader> x <fixture> OK`, một dòng
`ROUND-TRIP: fixture-moi sinh boi <writer> OK`, và HAI chiều đỏ. Bộ răng có 8
khối `== E… ==` — **E1, E1b, E9b, E5, E6, E4, E10, E3 — không có E2**.
`grep -cF DOC-CU` = 0 · `ROUND-TRIP` = 0 · `pre-merge-check.sh` = 0 ·
`recheck-evidence.cjs` = 0 · không bước sinh fixture nào.

**Lỗ CẤU TRÚC, không phải một chân hỏng:** `cmd:` của E2 trỏ cùng khoá với 8
eval kia, và `ghi-so-chay-1a.mjs` gán **rc của MỘT lượt chạy vật lý cho MỌI
eval-id trong nhóm**. E2 nhận `exit_code: 0` y hệt E1 — ở cả round 1, 2 và 4.
Bản 1a của bộ ghi sổ **không có trường `pinned:`** (bản 1b có), nên không gì
đối chiếu lời hứa với đầu ra.

Ba vật khai chỏi nhau: `gap-probe.md` đánh dấu hàng này **«fixed (pre-Gate-1)»**
(cái được «fix» chỉ là chữ trong `expected`); `run-log.jsonl` nói đã chạy xanh;
`evidence-report.md` chỉ liệt 4 eval judgment là chưa đo — E2 không có tên.

*Kịch bản fail:* người ký đọc «0 lượt ĐỎ · 4 eval chờ người» và tin 15 eval máy
đều đã chạy, gồm chân bảo vệ 38 hồ sơ đã ký. Merge xong, PR đầu tiên của đội tạo
workspace vắng `time_human_minutes`; nếu một nhánh đọc-cũ hụt thì cổng đỏ hàng
loạt trên chính 38 hồ sơ ấy, và không ai truy được vì sổ nói E2 xanh.

### H2 — E3/AC-3 đo hai CHUỖI sống sót nguyên vẹn qua phép phủ định chính nó
`cat-hinh-thuc-rang.sh:253-264` vs `evals.yaml:99-125`

Chân quét CẢ FILE bằng `tr '\n' ' ' | grep -q 'phút <số>'` và
`grep -q 'ĐƯỢC CHẤP NHẬN'`. Viết *«Vế `, phút <số>` ở cuối câu KHÔNG còn ĐƯỢC
CHẤP NHẬN. Máy báo lỗi cú pháp và hỏi lại người.»* — văn tự nhiên, giữ nguyên cả
hai chuỗi, **nghĩa đảo 180°** → bộ răng in `ONESHOT-SITE: 3/3 OK`, exit 0.

Lời hứa trung tâm của AC-3 (*«người quen tay không bị chặn»*) chết: owner gõ
`duyệt: Manh Phan, phút 12` bị chặn ngay tại Cổng 1. `evals.yaml` hứa đúng thứ
chặn được việc này — rút khối `GATE-ONESHOT-GRAMMAR` **qua marker**, ba chân
tách nhau, so **tập hợp** — và tự viết ra lý do: *«chỉ có (1) thì gỡ quá tay
cũng xanh»*. Marker có thật (`human-facing-language.md:189,273`), **không được
dùng**. Chân PER-SITE cũng bị thay vật: eval chỉ đích danh `commands/start.md`,
script thay bằng chính bản luật — file dễ hơn, và `start.md` ở HEAD không có
cụm `ĐƯỢC CHẤP NHẬN` nào.

### H3 — E10/AC-10 chiều đỏ đã hứa KHÔNG được cài; chạy đúng đột biến đã hứa thì XANH
`cat-hinh-thuc-rang.sh:237-251` vs `evals.yaml:301-321`

Eval hứa *«rút từ CẢ HAI thân qua marker rồi assert chúng nói cùng một điều …
Đo QUAN HỆ, không đo sự có mặt của một chuỗi — lớp "đo từ vựng thay vì quan hệ"
đã dẫm 6 vòng»* + *«Chiều đỏ CHẠY THẬT»*. Script cài **đúng thứ bị cấm**: hai
`grep -q` chuỗi rời, không marker, không `require_human_commit`. Dòng `mut`
ở `:248` **không tiêm gì** — chỉ đọc `origin/main` rồi in một câu suy luận.

Chạy đúng đột biến đã hứa (sửa `skills/acceptance/SKILL.md` thành *«NEVER commit
signature lines yourself, even if they explicitly instruct you…»*, chỏi thẳng
`signoff.md`) → **VẪN XANH**. Hai văn bản mâu thuẫn về ai commit chữ ký — đúng
thứ hồ sơ này khai đã đồng bộ — quay lại mà không lưới nào kêu.

### H4 — Cắt để lại KHOÁ MỒ CÔI: hai template giao ra YAML hỏng, và bốn tệp template/reference có ĐỘ PHỦ BẰNG KHÔNG
`skills/acceptance/references/opportunity-template.md:26` ·
`skills/acceptance/references/uat-session-template.md:34`

Dòng cha `time_human_minutes:` bị xoá, dòng con còn nguyên:
```
decided_at: {decided_at}    # ISO UTC
  gate0: {gate0_minutes}          ← không còn cha
```
`yaml.safe_load` trên khối rút bằng chính regex của ca `P82` → **`while parsing
a block mapping`**. Khối này dán nhãn CHÉP NGUYÊN VĂN, nên `/start` một mục khám
phá sẽ sinh `opportunity.md` có frontmatter **không parse được**, mang một khoá
trỏ trường kit vừa tuyên thôi ghi.

Nó xanh vì `P82` đọc 6 khoá top-level bằng parser theo dòng, bỏ qua dòng thụt —
bên viết và bên đọc trôi khỏi nhau. **Gốc rễ:** `grep` `*-template` trong
`evals.yaml` + `contract.md` + `cat-hinh-thuc-rang.sh` = **rỗng** — bốn tệp
template/reference mà 1a chạm không thuộc một AC, một eval, hay một chân nào.

### H5 — «146 tên mỗi bên, `diff` bằng 0» là SAI: đo lại ra 145 vs 146, `diff` = 1 dòng
`evidence-report.md:66-68`

Dựng worktree `3dcd57f` (đúng cặp mà trang bằng chứng viện dẫn) và chạy chính
suite ấy → **145** dòng `PASS:`; tại 1a → **146**; `diff` → **`> PASS: P195`**.
Kiểm tĩnh trùng khớp: `git show 3dcd57f:tests/plugins/run-tests.sh | grep -c
P195` = **0**, tại HEAD = **8**. `P195` chỉ được 1b trả lại SAU `3dcd57f`
(ở `cdf0a1de`), nên con số 146 **không thể** đo tại `3dcd57f`.

Lịch sử xác nhận đây là sửa-số-không-đo-lại: một commit ghi «145 tên mỗi bên»,
commit sau đổi `145 → 146` mà **giữ nguyên `3dcd57f`**.

*Kịch bản fail:* đây là câu DUY NHẤT trong hồ sơ chứng *«bằng nhau về TẬP, không
chỉ về SỐ»* — đúng thứ bắt được «một ca mất + một ca thêm», tức rủi ro trung tâm
của một hồ sơ chỉ-TRỪ. (Ghi để cân bằng: phép so tên trên cặp ĐÚNG —
`origin/main` → 1a — đã được lăng kính thứ hai chạy và cho **0 mất / 0 thêm**.
Vật lành; câu khai sai cặp và sai số.)

---

## P1 · Năm lỗ

| # | Lỗ | Vị trí | Kịch bản fail |
|---|---|---|---|
| **H6** | Phạm vi quét của bộ răng hẹp hơn hợp đồng đúng một mục (`tests/`), không khai ở đâu | `contract.md:36-38` vs `cat-hinh-thuc-rang.sh:36` | Chạy đúng needle AC-1/AC-12 trên phạm vi **hợp đồng đã duyệt**: `how many minutes` → **7 hit**, `baseline_minutes` → **2 hit** trong `tests/`. Tôn trọng phạm vi khai thì **AC-1 và AC-12 ĐỎ ngay hôm nay**. Đầu bộ răng tự tuyên in `CAT-SCOPE` để «không bắt người tin lời khai trong contract» — nhưng không phép so máy nào giữa hai danh sách |
| **H7** | AC-5/E5 hứa `GATE-INVITE-CLAUSE` **byte-equal base** — điều khoản ĐÃ đổi, và chân đo được viết để NHẬN cái đổi, **cùng một commit** | `contract.md:66-69` · `cat-hinh-thuc-rang.sh:136-144` | Cụm `tin chỉ-báo ghi rõ "không cần làm gì";` bị xoá khỏi điều khoản; script đặc cách khối này khỏi phép byte-equal với ghi chú «byte-equal là sai kỳ vọng». Không có mục `[SỬA SAU CỔNG 1]` nào cho AC-5. Đây là điều khoản **bốn site chép nguyên văn** — thước bị nới đúng lúc vật lệch |
| **H8** | 1a gỡ một assert sống mà khai **0 dòng**; bánh cóc `P161` mù về cấu trúc | `contract.md:144-145` · `asserts-da-go.txt` (không đổi) | AC-11 tuyên «assertion bị gỡ phải khai từng dòng — bánh cóc kiểm HAI CHIỀU». Assert bị gỡ sinh 2026-08-11, mốc ghim bánh cóc là `044968e` (06/08) → **không thể** đỏ. Chính header `asserts-da-go.txt` đã khai lỗ này (F7 của 1b); hợp đồng 1a tuyên ngược |
| **H9** | Chân LAN dung thứ **đúng một site sót** — ngưỡng gõ tay `>5` trong khi kho có sẵn bản khai máy-đọc | `cat-hinh-thuc-rang.sh:151-160` | HEAD=4, base=10, chỉ đỏ khi `>5`. Chép nguyên văn điều khoản mỗi-tin về ĐÚNG MỘT command (5 site) → xanh, và in câu **sai sự thật** `(chi con site tin-moi-cong)`. Khối `<<<GATE-INVITE-SITES` (`human-facing-language.md:173-177`) liệt đích danh 3 file + số lượt; bộ răng không đọc nó |
| **H10** | E9b/AC-13 neo âm co 4 needle → 1, và needle sống sót là chuỗi **tiếng Anh** trong khi luật mới viết **tiếng Việt** | `cat-hinh-thuc-rang.sh:110-114` | Khôi phục phỏng vấn tuần tự bằng câu tiếng Việt ở `acceptance-init.md` → `/acceptance-init` quay về hỏi từng câu một, bộ răng **xanh**. Needle bị bỏ `tuần tự từng câu` **có hit trên HEAD** — mảng đã bị rút xuống đúng cái không đỏ |

## P2 · Bốn chỗ

- **H11** E1 hứa 4 needle, script chạy **2**, và dòng đếm in `CAT-PHUT: 2/2` —
  «k suy từ mảng» nên nó luôn khớp chính nó, không ai đọc log phát hiện được hai
  needle đã rụng. E4/E1b neo âm bằng literal: nối lại nhánh báo cáo
  phút-vs-baseline diễn đạt khác → xanh.
- **H12** Trang bằng chứng khai «chân E6 chạy `gate-card.js` **ở cả ba mode**» —
  thực tế `for slug in $(ls -d */ | head -3)` là **ba SLUG**, gọi **không có
  `--gate`**, tức một mode ba lần; `|| continue` còn nuốt lỗi node. Và «**sáu**
  chiều đỏ tiêm bản sao» — thực **năm**, vì dòng của E10 không tiêm gì.
- **H13** `scripts/gate-card.js:5` vẫn khai mục tiêu là KPI *«cut human
  acceptance time >=50%»* — chính KPI hồ sơ này tuyên đã chết. Needle AC-12 chỉ
  viết tiếng Việt nên mù với bản tiếng Anh. (Có ở base; là vật lọt, không phải
  hồi quy.)
- **H14** `GUIDE.md:49-50` **thêm** một hàng KPI trùng nghĩa hàng kế bên (hai
  thước khác nhau cho cùng một mục tiêu) — một phép **CỘNG** trong hồ sơ
  chỉ-TRỪ, ngay dưới dòng *«Chỉ TRỪ, không CỘNG»* mà chính lượt này thêm vào
  `CLAUDE.md`.

---

## Nhận xét về 4 eval judgment (không tính thành finding — chưa chấm là cố ý, đã khai)

- **E3b** là eval viết tốt nhất: chân (b) «KHÔNG được ghi `time_human_minutes`
  trong nháp frontmatter» đo đúng lời hứa mà bộ đo cũ không chạm. Nhưng `inputs`
  thiếu `commands/start.md` — lệnh thứ ba trong chính bộ ba mà ngữ pháp nêu tên.
- **E7 ca 3** và **E8 ca 3** viết đề dưới dạng *«agent phải trả lời KHÔNG»* /
  *«phải nêu thang nguồn»* — mớm đáp án ngay trong câu hỏi, dễ chấm nới.
- **E9** chỉ nạp `commands/acceptance-init.md` và không ca nào chạm vế
  «một-lần-gạch» đo được: nó không hỏi agent có quay lại hỏi vòng hai sau khi
  người sửa vài dòng không — đúng cái AC-9 hứa. Lỗ ấy lẽ ra do neo âm E9b bù,
  mà E9b chỉ còn 1/4 needle (H10).

## Phụ lục — phép đo của phiên chấm

Ba phiên chạy qua `su - tester` với `NODE_EXTRA_CA_CERTS=/opt/ccr-ca.crt`, trên
worktree/bản sao rời, dọn sạch sau khi đo. Ba bẫy môi trường được cảnh báo trước
và cả ba đều tránh được. Tổng **8 lượt phá thật**; **5 lượt phá vẫn XANH**.

---

# Vòng sửa 1 (14/08) — thi công theo 14 finding của vòng chấm

*Owner gật ba điểm quyết trước khi thi công: **1(a)** dựng E2 cho thật ·
**2(a)** khai `tests/` ra khỏi phạm vi kèm lý do · **3** hình dạng đối chứng mới
cho E9b. Người thi công KHÔNG chấm bản sửa này — hồ sơ về `PENDING-JUDGMENT`
chờ rà soát đối kháng vòng 2.*

## Gốc chung đã đổi, không phải 14 miếng vá

Vòng chấm gọi tên một hình dạng: **eval hứa một phép đo MẠNH, script cài một
phép đo YẾU hơn, và không gì so hai bên.** Vá từng chân thì lần sau nó mọc ở
chân thứ sáu. Nên vòng sửa đổi **bất biến ở đúng chỗ hai bên gặp nhau — bộ ghi
sổ**:

> `ghi-so-chay-1a.mjs` nay có ba luật fail-closed: (1) eval máy phải khai
> `pinned:` với ≥1 chuỗi; (2) trong cùng nhóm-lệnh, mỗi eval phải có ≥1 chuỗi
> **RIÊNG** — không eval nào khác trong nhóm khai; (3) chuỗi khai mà vắng trong
> đầu ra thật → eval ĐỎ dù lệnh thoát 0, recorder thoát 1.

Luật (2) là chỗ H1 không tái sinh được: trước đây chín eval chia một `cmd:` và
rc chung đóng dấu cho cả chín, nên eval không có chân nào vẫn xanh. Nay chứng
nhân của mỗi eval phải là chuỗi của riêng nó. Khai chung một câu tổng kết cho
tất cả — cách rẻ nhất để lách — cũng chết to.

## Bảng đối chiếu

| # | Đã làm gì | Đo lại bằng gì |
|---|---|---|
| **H1** | Luật chứng-nhân-riêng ở bộ ghi sổ (trên) **+** E2 dựng thật: 8 tổ hợp bên-đọc × fixture, chân *phán quyết cũ == mới* theo cặp, round-trip từ `CONTRACT-FRONTMATTER-TEMPLATE`, 2 chiều đỏ | `DOC-CU: 8/8` · `ROUND-TRIP: …` là `pinned` của riêng E2 — gỡ chân đo thì recorder chết to |
| **H2** | E3 rút `GATE-ONESHOT-GRAMMAR` qua marker; neo dương đo **CỤM LIỀN** «vẫn ĐƯỢC CHẤP NHẬN và BỎ QUA lặng» + chân cấm ghép `phút <số>` với «báo lỗi»; chân giữ-gân so **TẬP CÂU**; per-site đọc `GATE-ONESHOT-SITES` (6 site) | Đột biến của vòng chấm (đảo nghĩa, giữ cả hai chuỗi) **chạy lại trên cây thật → ĐỎ** |
| **H3** | Bản gốc DUY NHẤT `SIGNATURE-OWNER-CLAUSE` ở `commands/signoff.md` bước 7, `SKILL.md` chép nguyên văn; đo byte-equal + 4 vế nội dung | Đột biến của vòng chấm («một lối hợp lệ») **chạy lại trên cây thật → ĐỎ** |
| **H4** | Gỡ hai khoá mồ côi (`gate0:` · `gateUAT:`); **AC-14 + E17** mới nạp 4 khối frontmatter bằng `yaml.safe_load` | `YAML-KHUON: 3/3` + dòng riêng cho khối thứ tư; chiều đỏ dựng lại đúng hình dạng lỗi (xoá cha, giữ con) |
| **H5** | Câu «146 tên mỗi bên tại `3dcd57f`» giữ nguyên làm sử liệu, đã chú thích SAI ở đầu trang từ lượt trước | — (vật lành; câu khai sai cặp, đã đánh dấu) |
| **H6** | Phạm vi bộ răng thành khối máy-đọc `PHAM-VI-RANG`; `tests/` khai RA kèm lý do (lưới thường trực BẮT BUỘC chứa câu cũ trong fixture tiêm của nó) | `CAT-SCOPE: khop ban khai PHAM-VI-RANG` — `pinned` của E1 |
| **H7** | AC-5 khai lượt nới thước; `GATE-INVITE-CLAUSE` đo bằng **so TẬP CÂU** (mọi câu không nói chỉ-báo còn nguyên) thay byte-equal không thoả được | `MOI-TIN: 2/2 khuon giu-gan OK` |
| **H8** | Khai assert đã gỡ vào `asserts-da-go.txt`, **kèm lời nói thẳng rằng `P161` KHÔNG phủ được nó** (assert sinh 11/08, mốc ghim 06/08); hợp đồng sửa lại câu tuyên ngược | — (dấu vết khai tay, không phải cưỡng chế; nói rõ trong cả hai vật) |
| **H9** | Chân LAN đọc `GATE-INVITE-SITES` (3 site + số bản chép) và cấm site ngoài bản khai | `MOI-TIN-SITE: 3/3` + `0 site ngoai ban khai` |
| **H10** | E9b đổi hình dạng: miễn trừ khai trước (`HOI-TUAN-TU-MIEN-TRU`, bánh cóc hai chiều) + **đối chứng dương TỰ SINH** từng needle | `HOI-TUAN-TU: 4/4` · `HOI-TUAN-TU-DC: 4/4` |
| **H11** | E1 đủ 4 needle (`ask .* minutes` base=0 → **thay** bằng `minutes spent`); E1b thêm chân QUAN HỆ đo cột THƯỚC ĐO của bảng KPI | `CAT-PHUT: 4/4` · `KPI-PHUT: bang muc tieu GUIDE` |
| **H12** | E6 chạy ba mode THẬT (`--gate 1` · `--gate 2` · auto) trên fixture cố định; hai câu sai trong trang bằng chứng chú thích tại chỗ | `THE-CONG: 3/3 mode` · số tiêm đếm bằng máy = **12** |
| **H13** | `gate-card.js:5` thôi khai mục tiêu là KPI phút | trong diff |
| **H14** | Gỡ hàng KPI trùng nghĩa khỏi `GUIDE.md` — **bằng phép TRỪ**, 5 mục tiêu → 4 | chân QUAN HỆ của E1b (H11) canh cột thước đo |

## Hai chỗ phải nói thẳng, không giấu trong bảng

1. **Một vế của bản duyệt KHÔNG THOẢ ĐƯỢC và đã bị thay, không phải bị hạ.**
   E2 hứa *«card cổng render từ fixture CŨ phải vẫn hiện đúng con số 7/3»*. Đo
   lại: **không bên đọc nào — kể cả trên `origin/main` — từng đọc
   `time_human_minutes`**. Card chưa bao giờ hiện số phút. Một chân không thoả
   được là một chân sẽ bị nới lúc nó đỏ, nên nó bị thay bằng thứ đo đúng lời hứa
   gốc «giữ được sử liệu» và quan sát được: trường phút của hồ sơ cũ còn NGUYÊN
   BYTE sau khi cả bốn bên đọc chạy.
2. **`P161` không phải lưới của H8, và hợp đồng đã tuyên sai điều đó.** Vòng sửa
   này KHÔNG dựng lưới mới để tự chữa: dời mốc ghim của bánh cóc là quyết định
   của hồ sơ khác, và một hồ sơ chỉ-TRỪ không phải chỗ mọc thêm cơ chế. Cái đổi
   là **lời khai** — cả trong `asserts-da-go.txt` lẫn trong AC-11.

## Chỗ nên soi trước ở vòng chấm 2

- **Luật chứng-nhân-riêng có thật sự đóng lớp không?** Thử gỡ một khối
  `== E… ==` khỏi bộ răng rồi chạy `ghi-so-chay-1a.mjs` — nó phải chết to, chứ
  không ghi một dòng trông bình thường.
- **`pinned` có bị chọn cho dễ không?** Mỗi chuỗi ghim phải là thứ chỉ in ra khi
  chân đo THẬT SỰ chạy, không phải một tiêu đề khối.
- **Phép so TẬP CÂU** (E3 chân 3, E5 chân 3) — nó miễn nhiễm với gói lại dòng,
  nhưng có miễn nhiễm luôn với việc **xoá một câu rồi viết lại nó khác đi**
  không? Đó là ca biên chưa ai thử.
- **E9b miễn trừ**: danh sách một dòng. Thử thêm một dòng khai khống → bánh cóc
  chiều ngược phải đỏ.
- **Bốn eval judgment (`E3b` `E7` `E8` `E9`) VẪN CHƯA AI CHẤM** — nguyên trạng
  từ vòng 1, khai lại ở đây để nó không chìm dưới 14 dòng đã sửa.
