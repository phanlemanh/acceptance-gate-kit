---
schema_version: 1
slug: cat-hinh-thuc
round: 5
verdict: PENDING-JUDGMENT
verified_commit: 62c6935107e2
---

# Trang bằng chứng — cắt hình thức khỏi bốn cổng người

## Verdict: **PENDING-JUDGMENT — vòng sửa 1 đã thi công, chờ rà soát đối kháng vòng 2**

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
