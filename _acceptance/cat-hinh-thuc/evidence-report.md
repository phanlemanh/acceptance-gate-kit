---
schema_version: 1
slug: cat-hinh-thuc
round: 7
verdict: PENDING-JUDGMENT
verified_commit: 233119881379
---

# Trang bằng chứng — cắt hình thức khỏi bốn cổng người

## Verdict: **PENDING-JUDGMENT — phạm vi ĐÃ THU, chờ rà soát đối kháng vòng 3**

> **Rà soát vòng 2: cả BA lăng kính REJECT — 8 P0 · 11 P1 sau khi gộp trùng.**
> Luật dừng-vá (`STOP-PATCHING-CLAUSE`) bật: cùng TÊN LỚP LỖI qua hai vòng ⇒
> **khuôn giải sai, không phải chi tiết sai**. Owner được trình ba đường và
> chọn **đường ② — THU PHẠM VI**. Trang này khai cái đã thu, cái đã sửa, và
> cái vẫn chưa ai chấm. Người thi công KHÔNG tự chấm bản này.
>
> ### Hồ sơ nay chỉ còn MỘT hạng mục: **kit thôi đo phút người**
>
> Bốn hạng mục đổi-hành-vi đã **hoàn nguyên khỏi nhánh** — `origin/main` trở
> lại nguyên trạng ở đúng những chỗ ấy — và đi sang hồ sơ 1c, gate bằng hội
> đồng thật. Bảng đối chiếu ở mục Out of scope của `contract.md`.
> Tiêu chí `AC-5` `AC-7` `AC-8` `AC-9` `AC-13` và eval `E5` `E7` `E8` `E9`
> `E9b` ra theo. **Còn 9 tiêu chí · 15 eval** (14 máy + 1 judgment).
>
> ### Vì sao thu — bằng cái đo được, không bằng cảm giác
>
> Lăng kính phép đo phá thật **8 lượt, cả 8 vẫn XANH**, một lượt đi qua trọn bộ
> ghi sổ (`RECORDER_RC=0`, `pinned_missing: []`). **Bảy trong tám** thuộc bốn
> hạng mục vừa thu. Hai chân là **hằng đúng**, và cả hai do vòng sửa 1 viết:
> · `GATE-INVITE-CLAUSE` trên base là ĐÚNG MỘT câu, và câu ấy chứa chữ
>   «chỉ-báo» → tập so sánh **rỗng** → chân xanh bất kể HEAD viết gì. Thay trọn
>   điều khoản bằng câu đảo thẳng ADR 0002 vẫn `OK`.
> · «Đối chứng dương tự sinh» của AC-13 là chèn một chuỗi vào bản sao rồi
>   `grep` lại chính nó — một định lý về `grep`. Thay 3/4 needle bằng chuỗi rác
>   → `HOI-TUAN-TU-DC: 4/4`.
> Cả hai được khai trong hợp đồng là **mạnh hơn** đối chứng dương. Đó là hồ sơ
> tự dối, viết bởi phiên thi công, trong dòng owner sẽ đọc — và nó là lý do
> chính đáng nhất để thu phạm vi thay vì vá vòng ba.
>
> ### Ba lỗ SẢN PHẨM đã sửa (đúng-sai độc lập với mọi tranh luận về thước)
>
> | Vật | Đã sửa |
> |---|---|
> | `scripts/gate-card.js:311,441` | thẻ Cổng 1 và Cổng 2 **vẫn in `~5 phút`** — trên chính thẻ owner mở mỗi cổng. Vòng sửa 1 có chạm file này và chỉ sửa **câu comment mục đích**, để nguyên đầu ra: đúng hình dạng ① *đo chỉ dẫn thay vì đo đầu ra* |
> | `QUICKSTART.md:150` | quảng cáo `/acceptance-report` có nhánh «phút người vs baseline» — nhánh AC-4 đã gỡ |
> | `QUICKSTART.md:125` | «**10 phút** đáng giá nhất» — cùng câu mà `GUIDE.md` bị cắt, cắt một bên để nguyên bên kia |
>
> ### Bốn thước đã sửa hoặc gỡ, không cái nào được vá cho qua
>
> · **E1b nhận chân ĐẦU RA** (mới): render thẻ ở cả ba mode rồi soi đầu ra —
>   đây là chân lẽ ra phải bắt `~5 phút` ngay vòng đầu. Chiều đỏ chèn lại
>   `~5 phút` **đã chạy trên cây thật và ĐỎ**.
> · **E4 thôi nói dối**: dòng ghim cũ in `byte-equal base OK` trong khi phép đo
>   là `grep -c` hai từ khoá. Nay so **TẬP DÒNG**, và có hai chiều đỏ — trong đó
>   một là đúng đột biến Hd của vòng chấm (thay dòng bằng dòng cùng từ khoá
>   nghĩa ngược).
> · **E3 gỡ chân «so TẬP CÂU»**, không thay bằng chân khác: nó lọc
>   `grep -v 'phút'` nên miễn trừ vĩnh viễn 5 câu chịu lực, và không bắt được
>   một câu-huỷ nối thêm. AC-3 nay khai thẳng rằng **chỉ E3b (judgment) chấm
>   được lời hứa hành vi**, và Cổng 2 không ký được khi E3b còn trống.
> · **E6 chiều đỏ dựng lại trên CÂY CHẠY ĐƯỢC**: bản sao đứng lẻ không resolve
>   nổi `../lib/…` nên nó chết lúc nạp, và "MẤT khối" với "crash" cho cùng một
>   màu. Nay bản sao mang cả `lib/` lẫn `scripts/`, và script đòi nó VẪN RENDER
>   có dấu tiêm trước khi tin màu đỏ.
>
> ### Lưới THƯỜNG TRỰC nhận răng mới — đây mới là chỗ nó thuộc về
>
> Bộ răng của hồ sơ chết theo hồ sơ khi merge, nên một chân chỉ sống ở đó là
> một chân có hạn dùng. Ba thứ vào thẳng `tests/plugins`:
> · **`P185`/`P186` assert thẻ cổng KHÔNG hứa phút** ở CẢ HAI cổng, đo trên
>   ĐẦU RA, kèm `MUTANT-PHUT` chèn lại `· ~5 phút` vào một **cây chạy được** và
>   đòi chân ấy bắt được. Đây là lưới lẽ ra phải bắt P0-1 ngay vòng đầu.
> · **`P194` nhận hai neo DƯƠNG mới** — `KHÔNG hỏi và KHÔNG ghi số phút` và
>   `ĐƯỢC CHẤP NHẬN và BỎ QUA lặng`. Rà soát vòng 2 (RA3-09) chỉ ra hai neo cũ
>   (`khong-hoi-phut`, `phut-ghi-0`) chết cùng luật cũ mà không ai thay, nên
>   viết lại câu mời khai phút **bằng tiếng Việt** thì `P194` vẫn xanh. Nay không.
> · **`P150` khai thay-đổi-render thứ (5)** — gỡ `· ~5 phút` — vào danh sách
>   ĐÓNG của đường đọc-cũ, trỏ về case canh nó. Đúng nghi thức sẵn có, không
>   phải một miễn trừ mới.
>
> **Số ca bốn suite KHÔNG xê dịch** (`plugins` 146 · `workflows` 463 ·
> `scripts` 686 · `hooks` 54): răng mới đi vào THÂN của `P185`/`P186`/`P194`
> chứ không mọc thành ca mới — TRIM/EXTEND, không ADD, đúng nguyên tắc mà chính
> đẳng thức này sinh ra để ép.
>
> Hai tệp `_acceptance/khoi-viec-cua-anh/evidence/p18{5,6}-card-gate*.html`
> **sinh lại** bằng bộ sinh của chúng: `P190` so byte-đối-byte với bản render
> của cây hiện tại, và `PROVENANCE.md` khai thẳng vì sao chúng KHÔNG được đóng
> băng — renderer đổi mà thẻ hội đồng chấm không đổi thì judge chấm một cái thẻ
> không còn tồn tại. Diff đúng hai dòng phụ đề.
>
> ### Sổ sách khai lại cho khớp vật
>
> `KHAI GIỚI HẠN` ba→**bốn** eval mượn dụng cụ của 1b (E13 cũng mượn, và mượn vì
> chính một lượt sửa-sau-Cổng-1) · ô P2 của `gap-probe.md` chú thích ba chi tiết
> nay đã sai · E14 thôi hứa «ghim đúng SÁU dòng» — `pinned` đối chiếu SỰ CÓ MẶT
> của chuỗi, một **số đếm** không diễn đạt được thành chuỗi ghim, và lưới
> đếm-sáu-dòng thật nằm ở **E16** · hợp đồng bỏ trường `time_human_minutes`
> trong frontmatter của chính nó.
>
> ### Bộ răng vòng này: **8 khối eval · 39 chân xanh · 12 lượt tiêm-thật**
>
> Ba con số đếm bằng máy từ chính đầu ra (`grep -c '^  OK '`,
> `grep -c '\[đột biến\]'`, `grep -c '^== E'`). Vòng trước trang này khai «53»
> trong khi máy đếm 55 — câu ấy viết ở một commit rồi không đo lại sau commit
> kế, đúng lớp lỗi H5 mà chính hồ sơ này từng bị bắt.
>
> ### Còn nợ, khai to để không chìm
>
> **`E3b` là eval judgment DUY NHẤT còn lại, và chưa ai chấm.** Nó gánh trọn
> lời hứa hành vi của AC-3 («người quen tay gõ `, phút 12` không bị chặn, và
> máy KHÔNG ghi trường phút vào bản nháp nó xuất ra»). Không có nó thì AC-3
> chỉ có lớp mực-đã-in. **Cổng 2 không ký được khi nó còn trống.**

---

## (Sử liệu) Verdict vòng 5-6 — vòng sửa 1, trước khi thu phạm vi

> **Vòng sửa 1 (13–14/08) đóng cả 14 finding của vòng chấm.** Người thi công
> KHÔNG tự chấm bản sửa của mình; hồ sơ ở trạng thái chờ vòng rà soát đối kháng
> thứ hai. Tóm tắt cái ĐÃ đổi — chi tiết từng finding ở `review-findings.md`,
> lý do từng lượt khai lại ở mục `[SỬA SAU CỔNG 1 — vòng sửa 1]` trong
> `contract.md` và `evals.yaml`:
>
> · **Lỗ CẤU TRÚC (H1) đóng ở đúng chỗ nó sống.** `ghi-so-chay-1a.mjs` nay đòi
>   mỗi eval máy khai `pinned:` với **≥1 chuỗi RIÊNG trong nhóm-lệnh**, và chết
>   to khi chuỗi khai vắng trong đầu ra thật. Một eval không có chân đo không
>   còn hưởng được màu xanh của tám eval dùng chung lệnh. Đây là lý do E2 tự lộ
>   ngay lượt chạy đầu nếu ai gỡ chân của nó.
> · **Ba chân đo lại đúng lời hứa của eval**: E3 rút `GATE-ONESHOT-GRAMMAR` qua
>   marker (neo dương đo CỤM LIỀN + chân giữ-gân so TẬP CÂU + per-site đọc
>   `GATE-ONESHOT-SITES`); E10 đo QUAN HỆ qua bản gốc duy nhất
>   `SIGNATURE-OWNER-CLAUSE`; chân LAN của E5 đọc `GATE-INVITE-SITES` thay
>   ngưỡng gõ tay `>5`. **Cả hai đột biến từng sống sót vòng 1 (H2, H3) đã được
>   chạy lại trên cây thật và ĐỎ.**
> · **E2 dựng thật**: 8 tổ hợp bên-đọc × fixture, chân *phán quyết cũ == mới*
>   theo cặp, round-trip từ `CONTRACT-FRONTMATTER-TEMPLATE`, hai chiều đỏ tiêm
>   qua cây chạy được.
> · **Lỗi SẢN PHẨM (H4) sửa + có lưới**: hai khoá YAML mồ côi gỡ khỏi
>   `opportunity-template.md` / `uat-session-template.md`; **AC-14 + E17** mới
>   nạp bốn khối frontmatter bằng `yaml.safe_load` thật (độ phủ 0 → 4).
> · **Ba lượt TRỪ trong sản phẩm**: hàng KPI trùng nghĩa ở `GUIDE.md` (một phép
>   CỘNG lọt vào hồ sơ chỉ-TRỪ), KPI phút bản tiếng Anh ở `gate-card.js:5`.
> · **Bốn chỗ sổ sách khai lại cho khớp vật**: `tests/` ra khỏi phạm vi bộ răng
>   kèm lý do (H6), AC-5 khai lượt nới thước (H7), assert đã gỡ vào
>   `asserts-da-go.txt` kèm ghi chú bánh cóc KHÔNG phủ được nó (H8), E6 chạy ba
>   mode thật (H12).
>
> **Bộ răng vòng này: 10 khối eval · 53 chân xanh · 12 lượt tiêm-thật.**
> Số chiều đỏ vòng trước khai «sáu» — đo lại lúc ấy là **năm** (dòng của E10
> không tiêm gì). Con số 12 ở trên đếm bằng máy từ chính đầu ra.

---

## (Sử liệu) Verdict vòng 4: **REJECT (rà soát đối kháng vòng 1, 2026-08-13)**

> **Cả BA lăng kính REJECT** — 5 P0 · 5 P1 · 4 P2. Biên bản đầy đủ ở
> `review-findings.md`. Phần lõi được xác nhận SẠCH khi đo độc lập (bốn đẳng
> thức khớp, diff tên ca 0-mất/0-thêm, khối VIỆC CỦA ANH còn trên thẻ, không
> lưới cưỡng chế nào bị gỡ); các lỗ nằm ở BỘ ĐO và ở hai template: **eval hứa
> một phép đo mạnh, script cài một phép đo yếu hơn** (≥5 eval cùng hình dạng,
> nặng nhất là E2 không có một dòng mã nào mà sổ vẫn đóng dấu xanh — lỗ cấu
> trúc của bộ ghi sổ nhóm-theo-lệnh), cộng một lỗi SẢN PHẨM thật: cắt để lại
> khoá YAML mồ côi trong hai template CHÉP-NGUYÊN-VĂN, và bốn tệp
> template/reference có độ phủ bằng không.
>
> Trang dưới đây giữ nguyên làm SỬ LIỆU của lời khai trước vòng chấm — trong đó
> câu «146 tên mỗi bên, diff bằng 0» tại `3dcd57f` đã bị vòng chấm chứng minh là
> SAI (H5: số 146 không thể đo tại mốc ấy; phép so tên trên cặp đúng
> `origin/main`→1a cho 0-mất/0-thêm). KHÔNG sửa lời khai cũ — sửa là xoá dấu
> vết một lần khai sai.

> (Sử liệu — lời khai lúc trình vòng chấm:) Tôi thi công hồ sơ này, nên tôi
> **không tự chấm nó**. Trang này khai cái đã đo và cái CHƯA đo; ai rà soát đối
> kháng đọc mục «Chỗ nên soi trước» dưới cùng.

Hồ sơ **chỉ TRỪ**: gỡ những chỗ hỏi/khẳng định số phút người, gỡ tư cách
luật-mỗi-tin của khối VIỆC CỦA ANH, thôi phỏng vấn tuần tự ở quét độ phủ, thôi
hỏi lại xác nhận T1 — mà **không gỡ một lưới bằng-chứng nào**. Rủi ro trung tâm
vì thế không phải "làm hỏng tính năng" mà là **cắt lan sang lưới thật**, và
**phép đo âm tính không sống** (thứ gì cũng "0 hit" nếu chưa bao giờ chạy).
Cả hai rủi ro được dựng lưới trước khi cắt, không phải sau.

## Rebase lượt hai — lên vòng sửa 2 của 1b (13/08)

Hồ sơ 1b bị rà soát đối kháng vòng 2 **REJECT**, và vòng sửa 2 «một-nguồn» của
nó **đổi vật mà 1a mượn**. Hợp đồng 1a đã khai trước đúng tình huống này
(*«nếu vòng rà soát đối kháng của 1b làm đổi vật thì 1a phải rebase lại rồi đo
lại»*), nên đây là thi hành một lời khai chứ không phải một quyết định mới.

Ba thứ đổi theo, không thứ nào là nới tiêu chí:

1. **Nền**: `3dcd57f` → `cdf0a1de`.
2. **Vế `sau` của `plugins`: 145 → 146.** 1b trả lại lưới «mọi `suite_key` phải
   resolve» thành ca `P195` trong bộ kiểm thường trực (nó bị gỡ kèm ca `P162`
   lúc lưu kho — F6 của rà soát vòng 2). Bản khai duy nhất vẫn là khối của 1b;
   1a chỉ đi theo. **Mệnh đề của 1a không đổi một chữ**: vế `sau` đo tại ngọn
   1b, tức TRƯỚC mọi commit của 1a, nên khớp nó vẫn đúng là *«1a không xê dịch
   số ca»*.
3. **Re-pin `stop-patching-law`**: commit re-pin cũ của 1a (lần 11, sha
   `3612a61`) bị **bỏ trong lúc rebase** — 1b đã ghi lần 11 của riêng nó bằng
   một lượt lane khác. Giữ cả hai là hai dòng cùng số thứ tự trỏ hai sha khác
   nhau. 1a ghi lại thành **lần 12** bằng một lượt lane MỚI tại sha mới; nghi
   thức cấm tái dùng lane cũ.

## Số đo

Tất cả đo tại `62c69351`, sổ chạy `run-log.jsonl` do **phép đo sinh** (không gõ
tay): 15 dòng · 7 lượt chạy vật lý · **0 lượt ĐỎ** · 4 eval chờ người chấm.

| Phép đo | Kết quả | Đẳng thức khai TRƯỚC |
|---|---|---|
| Bộ kiểm gói | **146/146 xanh** | `173 → 146` ✔ |
| Bộ kiểm luồng | **463/463 xanh**, đúng 6 dòng tổng kết | `488 → 463` ✔ |
| Bộ kiểm script | **686/686 xanh** | `671 → 686` ✔ |
| Bộ kiểm hook | **54/54 xanh** | `54 → 54` (không chạm lõi) ✔ |
| Bản đồ sản phẩm | khớp hồ sơ xưởng | — |
| Bộ răng `cat-hinh-thuc-rang.sh` | 8 nhóm · **19 chân xanh** · **6 chiều đỏ chạy thật** | — |

**Bốn đẳng thức, không phải sàn.** Hạng mục 1a.2 CỐ Ý làm chết một số assertion
trong `tests/plugins`. Đó đúng là loại bộ kiểm mà sàn `≥` mất răng: lúc đỏ,
đường thoát rẻ nhất là hạ sàn xuống mức vừa đo. Ba eval E11/E12/E16 và (từ lượt
sửa này) E13 đều so **đẳng thức** với bản khai máy-đọc, không so với sàn.

**Vế `sau` chứng đúng mệnh đề của hồ sơ NÀY.** Bốn con số ấy đo tại ngọn 1b —
trước mọi commit của 1a. Cây 1a khớp đúng chúng nghĩa là **1a không xê dịch một
ca nào**, đúng thứ cần chứng. Đối chứng độc lập, KHÔNG đi qua bộ đếm: rút danh
sách **tên** từng ca ở ngọn 1b (`3dcd57f`, dựng worktree riêng) và ở ngọn 1a, đo
cùng một môi trường — **146 tên mỗi bên, `diff` bằng 0**. Đẳng thức số ca chỉ
nói *bằng nhau về SỐ*; phép so tên nói *bằng nhau về TẬP* — một ca mất và một ca
mới thêm sẽ lọt phép trước nhưng không lọt phép sau.

**[SỬA 14/08 — con số SAI, giữ nguyên làm sử liệu: đo lại là NĂM, không phải
sáu; dòng của E10 chỉ in một câu suy luận chứ không tiêm gì (H12). Bộ răng vòng
sửa 1 có 12 lượt tiêm thật, đếm bằng máy.]**
**Sáu chiều đỏ là chạy thật, không phải lời hứa.** Mỗi chiều tiêm hỏng một bản
sao rồi chạy lại **chính hàm kiểm** trên bản sao ấy và đòi ĐỎ — ví dụ chép lại
điều khoản mỗi-tin vào bản sao `acceptance-status.md` (chân lan phải đỏ đích
danh), gỡ khối khỏi bản sao `gate-card.js` (thẻ cổng phải MẤT khối), xoá dòng sổ
vàng khỏi bản sao báo cáo (phép so phải đỏ `so vang LECH base` 1 < 3).

**Mọi chân âm đều kèm đối chứng dương.** 19 chân in theo khuôn
`HEAD=0 base=<n>(>0)`: vế `base` là bằng chứng chuỗi tìm kiếm **từng khớp thật**
ở `origin/main`. Chân nào có `base=0` thì cái nó "chứng minh" là chuỗi ấy chưa
bao giờ tồn tại — lưới tự tuyên *«needle nay chua bao gio ton tai, phep do khong
song»* và ĐỎ, chứ không xanh. Vài chân dựng hụt kiểu ấy đã bị **gỡ bỏ** lúc dựng
bộ răng thay vì giữ lại cho đẹp bảng.

**Thẻ cổng đo trên ĐẦU RA, không grep mã nguồn.**
**[SỬA 14/08 — «cả ba mode» SAI, giữ nguyên làm sử liệu (H12): bản ấy lặp ba
SLUG và gọi KHÔNG cờ `--gate` nào, tức một mode ba lần, `|| continue` còn nuốt
lỗi node. Vòng sửa 1 chạy ba mode thật — `--gate 1` · `--gate 2` · auto — trên
một fixture cố định.]**
Chân E6 chạy `gate-card.js`
ở cả ba mode rồi soi thẻ render ra — vì lớp lỗi đã trả giá ở vòng khác là *đo
chỉ dẫn thay vì đo đầu ra*.

## Bảng eval — vòng 6, mỗi eval một chứng nhân RIÊNG

*Sinh từ `run-log.jsonl` (round 6, sha `233119881379`). Cột «chuỗi ghim» là
`pinned:` của chính eval ấy trong `evals.yaml`: từ vòng sửa 1, mỗi eval máy phải
có ≥1 chuỗi KHÔNG eval nào khác trong cùng nhóm-lệnh khai, và `ghi-so-chay-1a.mjs`
thoát 1 nếu chuỗi ấy vắng trong đầu ra thật — kể cả khi lệnh thoát 0. Chín eval
chia chung một lượt chạy vật lý là SỰ THẬT (một `run_id`); cái phân biệt chúng là
chuỗi ghim, không phải mã thoát.*


| Eval | Tiêu chí | exit | run_id | Chuỗi ghim (đều KHỚP) |
|---|---|---|---|---|
| E1 | AC-1 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `CAT-PHUT: 4/4` · `CAT-SCOPE: khop ban khai PHAM-VI-RANG` |
| E1b | AC-12 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `KPI-PHUT: 4/4` · `KPI-PHUT: bang muc tieu GUIDE` |
| E2 | AC-2 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `DOC-CU: 8/8` · `ROUND-TRIP: fixture-moi sinh boi CONTRACT-FRONTMATTER-TEMPLATE` |
| E3 | AC-3 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `ONESHOT-SET:` · `ONESHOT-SITE: 6/6` |
| E4 | AC-4 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `REPORT: bo nhanh phut OK` · `REPORT: so vang + ve sinh cong byte-equal base OK` |
| E5 | AC-5 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `MOI-TIN: 2/2 khuon giu-gan OK` · `MOI-TIN-SITE: 3/3` · `MOI-TIN-CASE: base=` |
| E6 | AC-6 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `THE-CONG: 3/3 mode` |
| E9b | AC-13 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `HOI-TUAN-TU: 4/4` · `HOI-TUAN-TU-DC: 4/4` |
| E10 | AC-10 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `AI-COMMIT: hai than dong bo OK` · `AI-COMMIT: dieu khoan du 4 ve` |
| E17 | AC-14 | 0 | `cat-hinh-thuc-r6-412e9ee6` | `YAML-KHUON: 3/3` · `YAML-KHUON: frontmatter evidence-report-template parse duoc OK` |
| E11 | AC-11 | 0 | `cat-hinh-thuc-r6-ca3ddbac` | `LUU-KHO-SUITE: scripts 671 -> 686 OK` |
| E12 | AC-11 | 0 | `cat-hinh-thuc-r6-62479450` | `LUU-KHO-SUITE: plugins 173 -> 146 OK` |
| E13 | AC-11 | 0 | `cat-hinh-thuc-r6-bfe9d84a` | `LUU-KHO-SUITE: hooks 54 -> 54 OK` · `Results: 54 passed, 0 failed` |
| E14 | AC-11 | 0 | `cat-hinh-thuc-r6-a41d6a9e` | `Results: all workflow tests passed` |
| E15 | AC-11 | 0 | `cat-hinh-thuc-r6-64b2de3b` | `PRODUCT-MAP.md khớp hồ sơ xưởng.` |
| E16 | AC-11 | 0 | `cat-hinh-thuc-r6-35128449` | `LUU-KHO-SUITE: workflows 488 -> 463 OK` |

**0 lượt ĐỎ · 0 lời hứa thông điệp không khớp · 4 eval judgment chưa ai chấm.**
Vòng 5 (cùng sổ, ngay trên) có **1 lời hứa không khớp** — `E12` / `MOI-TIN-CASE:` — và recorder thoát 1. Lượt ấy giữ nguyên: sổ append-only, và nó là đối chứng dương của chính luật chứng-nhân-riêng (xem H15 trong `review-findings.md`).

## Bốn eval CHƯA có kết quả — cố ý, không phải bỏ quên

`E3b` `E7` `E8` `E9` là `executor: judgment`: chúng hỏi một agent context sạch
xử sự thế nào khi đọc thân lệnh/thân skill đã sửa (bỏ qua vế phút · nhận diện
T1 tuyên-kèm-căn-cứ · quét độ phủ không phỏng vấn · khởi tạo một-lần-gạch).
**Không máy nào chấm được chúng**, và bộ ghi sổ **từ chối ghi `exit_code` cho
chúng** — ghi một dòng `exit 0` cho phép đo chưa ai chấm là bịa bằng chứng.

Hệ quả phải nói thẳng: **hồ sơ này chưa đủ điều kiện đóng.** Bốn tiêu chí AC-3
(vế judge) · AC-7 · AC-8 · AC-9 mới có chân MÁY (E3, E9b) hoặc chưa có chân nào.
Đây là khác biệt lớn nhất so với hồ sơ 1b — 1b có **0** phép đo phán-xét nên
xanh-máy là xong; 1a thì không.

## Ba lỗi tự tìm ra khi rà bảng eval trước khi viết trang này

Ghi ra vì cả ba đều thuộc lớp *«xanh vì đo cái dễ hơn cái đã hứa»*, và cả ba
sống sót qua Cổng 1.

1. **HAI bản khai cho một tiêu chí.** Lượt sửa 13/08 đầu chép khối
   `SO-CA-KY-VONG-1A` vào hợp đồng 1a rồi để eval chạy `so-ca.sh` của 1b — mà
   script ấy đọc `$HERE/contract.md`, tức hợp đồng **1b**. Khối vừa chép
   **không code path nào đọc**: bản người-đọc-thấy-trước lại là bản máy không
   đọc. Đúng lớp «bên viết và bên đọc trôi khỏi nhau». Đã gỡ khối trùng.
2. **E14 ghim một chuỗi không bao giờ đỏ được.** Nó ghim `Results: 62 passed`
   như thể là tổng của bộ kiểm luồng; 62 là tổng của **một trong sáu** tệp con.
   Chuỗi ấy vừa luôn khớp vừa không nói gì về năm tệp kia — bốn tệp chết cũng
   không động đến nó. Nay E14 ghim **đúng sáu dòng** tổng kết (chân chống
   chết-giữa-chừng), còn đẳng thức 463 là việc của E16.
3. **E16 trỏ một khoá đã chết.** Bản duyệt trỏ `executors.script.mirror_sync`,
   khoá bị 1b xoá. Chính eval ấy đã **khai trước** cái chết đó rồi vẫn suýt đi
   qua — không lưới nào kêu cho đến khi soi tay. Nay trỏ bộ đếm luồng.

Bộ ghi sổ nay **fail-closed** ở đúng chỗ số 3: `cmd:` trỏ khoá không có trong
`config.yaml` thì nó **chết to (exit 2)**, không ghi một dòng trông bình thường.

## Hai lần đo sai của chính tôi — và vì sao chúng không vào sổ

Cùng lớp «phép đo hỏng đọc y hệt vật hỏng», nên khai:

- **3 ca đỏ giả.** `P123` `P129` `P161` đỏ khi chạy bằng `root`: hai ca đầu vì
  root vượt qua `chmod 000`, ca thứ ba vì kho thuộc user `tester` nên `git`
  từ chối clone fixture. Không ca nào là lỗi của cây.
- **Một ca thừa giả.** Chạy bằng `tester` mà để `NODE_EXTRA_CA_CERTS` trỏ
  `/root/.ccr/ca-bundle.crt` (tester không đọc được) thì OpenSSL in một dòng
  cảnh báo **chèn vào giữa** dòng kết quả của ca `P66`, tách một dòng thành hai
  → bộ đếm ra **146** thay vì 145.

Đáng ghi vì bộ đếm **phân biệt được hai kiểu hỏng**: lần đầu nó nói *«đủ 145 ca
nhưng 3 ca ĐỎ — đây là ca hỏng, KHÔNG phải số ca lệch»*, lần sau nó nói *«số ca
lệch kỳ vọng: 173 → 146»*. Gộp hai câu ấy làm một thì cả hai lần đều đọc như
"gỡ quá tay", và người đọc log học cách phớt lờ. Số đo trong bảng trên đo bằng
`tester` + CA đọc được, và đó là môi trường đo đúng của kho này.

## Khai giới hạn

- **Ba eval mượn dụng cụ của 1b.** E11/E12/E13/E16 chạy `so-ca.sh` và bốn khoá
  `executors.script.luu_kho_so_ca_*` — vật của hồ sơ 1b, mang nhãn *«chết theo
  hồ sơ khi merge»*. Ai thi hành nhãn ấy đúng nghĩa đen lúc merge 1b thì AC-11
  mất chân đẳng thức. Chọn mượn vì hai hồ sơ đã merge trước còn nguyên script +
  khoá sau merge (nhãn kia chưa từng được thi hành), và dựng bản sao thứ hai của
  bộ đếm 200 dòng để phòng một việc chưa xảy ra là giờ-kit đắt hơn phần nó chặn.
  Đường xử nếu xảy ra: ghi trong `contract.md`, mục KHAI GIỚI HẠN.
- **`ghi-so-chay-1a.mjs` trùng ~70% với bản của 1b.** Chủ ý: script của hồ sơ
  chết theo hồ sơ, nên tệp này không được phụ thuộc tệp kia. Khác biệt thật nằm
  ở nhánh `judgment` — bản 1b fail-closed khi eval thiếu `cmd` (đúng cho 1b: mọi
  eval của nó là máy), bản này phải phân biệt *thiếu `cmd`* với *không có `cmd`
  vì là phép đo người*.
- **4 cờ vàng từ vựng (lint W6), cả 4 cố ý, 0 vi phạm.** Hai cờ ở dòng 26 nằm
  trong cụm chép nguyên văn từ danh sách CẤM ĐỤNG của bản neo. Hai cờ còn lại là
  **dương tính giả**: lint quét từ khoá không xét nghĩa, mà "thẻ Cổng 1" ở đó
  đúng là *card* và "engine" là *engine của kit* chứ không phải *executor*.
  Hợp đồng từng tuyên "các cờ W6 khác đã sửa" trong khi còn hai cờ — câu sai ấy
  đã sửa, vì một khẳng định sai nằm trong vật được giao là đúng lỗi hồ sơ 1b vừa
  bị bắt ở `layout-craft.md`.
- **Bộ răng neo vào `origin/main`, không vào một mốc bất biến** — theo đúng bản
  duyệt Cổng 1, và yếu hơn cách 1b neo. Hệ quả phải khai: **sau khi chính hồ sơ
  này merge**, mọi needle về 0 ở CẢ HAI đầu, và chạy lại verify sẽ tuyên "phép
  đo không sống" chứ không xanh. Đó là known-limit đã ghi sẵn trong đầu script,
  cùng lớp với 1b — không phải lỗi, nhưng ai chạy lại sau merge cần biết trước.
- **1a chỉ merge được SAU 1b**, và nếu vòng rà soát đối kháng của 1b làm đổi vật
  thì 1a phải rebase lại rồi đo lại.

## Chỗ nên soi trước (dành cho người rà soát đối kháng)

1. **Bộ răng có chân nào âm-tính-một-mình không?** Soi `cat-hinh-thuc-rang.sh`
   tìm chân kết luận từ "0 hit" mà **không** in `base=<n>(>0)` kèm.
2. **Sáu chiều đỏ có chạy thật không?** Phá vật thật trong một bản sao rồi hỏi:
   phép đo này có đỏ không? Nếu một chiều đỏ chỉ in một câu ở **thì tương lai**
   thì nó chưa từng chạy.
3. **Bốn eval judgment**: chúng có hỏi đúng thứ hồ sơ hứa không, hay hỏi một
   câu dễ hơn?
4. **Phạm vi quét** (`CAT-SCOPE`, in ngay dòng đầu bộ răng) có bỏ sót cây nào mà
   hợp đồng khai là đã sửa không.
5. **Cắt có lan sang lưới thật không** — đây là rủi ro số 1 của một hồ sơ
   chỉ-TRỪ, và nó KHÔNG được chứng bằng "bộ kiểm vẫn xanh": bộ kiểm xanh cũng là
   thứ xảy ra khi lưới bị gỡ cùng lúc với ca đo nó.
