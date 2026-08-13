---
schema_version: 1
slug: luu-kho-codex-va-nghi-le-design
round: 5
verdict: PENDING-JUDGMENT
verified_commit: c62f0330f253
---

# Trang bằng chứng — lưu kho harness song sinh và nghi lễ design

## Verdict: **PENDING-JUDGMENT — vòng 4 PASS cả hai lăng kính, chờ owner nâng ở Cổng 2**

> Frontmatter giữ PENDING-JUDGMENT có chủ ý: nâng lên PASS là BƯỚC CỦA NGƯỜI ở
> Cổng 2 (checklist chuẩn của kit), và lưới JR11b cưỡng chế đúng điều đó — phiên
> thi công đặt PASS hộ owner thì recheck đòi khối bằng chứng L1 và ĐỎ ngay.
> Vòng 4 tự dẫm thử và xác nhận lưới sống.

> **Vòng thu gọn «chỉ TRỪ» — 13/08, owner gạch sau phân tích từ nguyên lý gốc.**
> Chẩn đoán: hồ sơ 1b mắc đúng căn bệnh nó sinh ra để chữa — bộ đo của nó nuôi
> N bản khai phải giữ đồng bộ, y hệt hai harness song sinh mà nó lưu kho. Ba
> vòng rà soát: **0 finding về VẬT từ vòng 2; 100% P0 vòng 3 ở tầng thước.**
> Luật dừng-vá đã đúng hai lần liên tiếp, nên vòng này KHÔNG vá — nó TRỪ:
>
> 1. **Cắt lời hứa meta không trace được.** AC-20 thu về hai luật viết + một
>    cái ĐÁY chứng minh tuyên tường minh; chân wire XOÁ HẲN (việc nó canh đã có
>    recorder phủ mỗi vòng — một cơ chế thay hai); `pinned:`/round-trip hạ từ
>    LỜI HỨA xuống DỤNG CỤ, kèm hai fix thật (parser fail-loud, mã thoát mang
>    phán quyết).
> 2. **Văn xuôi phi giá trị.** Bốn bản chép chỉ-người-đọc (G1–G4) xoá bằng quy
>    chiếu về khối máy-đọc — chết cả lớp bằng phép TRỪ, không thêm phép đo nào.
> 3. **Sửa vật thật, nhỏ:** GUIDE.md hết chỉ dẫn sống trỏ mirror/case đã xoá
>    (G11); `P195` thêm vế tệp-tồn-tại (G7) và vế chốt-trong-lưới (G10 = D4
>    vòng 1, un-remove nốt); ghim E11 thành nguyên câu (G6a); sổ sách về số đo
>    được (G14, G15).
>
> Xử lý từng finding vòng 3: **G1–G4** xoá bản chép (①②) · **G5** parser
> fail-loud + xoá câu khai chiều-đỏ-không-tồn-tại · **G6a** ghim nguyên câu ·
> **G6b** khai giới hạn số-lượng-không-danh-tính vào E17/E18/E19 (lưới danh
> tính thuộc bánh cóc `card-text-fidelity`) · **G7, G10** hai vế mới của P195,
> chiều đỏ đích danh · **G8** một nửa xử bằng văn-phi-giá-trị (hết bản văn chỏi
> để «đồng bộ ngược»), nửa còn lại — xoá dòng khỏi khối trước merge — nằm dưới
> ĐÁY: hợp đồng là vật NGƯỜI KÝ đọc diff, và bộ răng chết theo hồ sơ khi merge
> (known-limit) · **G9** xoá chân wire · **G11** sửa GUIDE · **G12** E20 thu
> lời hứa về vật · **G13** recorder thoát theo phán quyết · **G14, G15** sổ
> sách đo lại, danh sách CHỐT được đính chính kèm lý do của `P26`.
>
> **Sổ chạy vòng 5 là một đối chứng dương SỐNG cho bộ dụng cụ vừa hạ cấp:** lượt
> sửa GUIDE (G11) làm ca thường trực `P43` đỏ — pin của nó ghim nguyên văn câu
> «Bump version + sync mirror thuộc S3», tức chính pin là một con trỏ sống tới
> mirror mà phép quét AC-4 không thấy (`tests/` ngoài phạm vi, có lý do). Recorder
> mới chặn đúng chỗ: exit 1, sổ ghi lượt đỏ append-only, và vòng 6 xanh sau khi
> pin được sửa + assert cũ khai vào bánh cóc. Dụng cụ không còn là lời hứa,
> nhưng nó vừa chứng minh nó CÓ RĂNG — bằng một lượt đỏ thật, không phải một
> câu khai.
>
> Thước đo VẬT không đổi một ly: đủ đẳng thức, đối chứng dương, chiều đỏ. Cái
> bị trừ là thước-tự-soi-thước. Cần owner gạch ở Cổng 2: **AC-20 bản thu**
> (hai luật viết + đáy) — các mục cũ (AC-16..19, 146) giữ nguyên như đã khai.

## Verdict vòng 3 (sử liệu): **REJECT (2026-08-13)**

> **Rà soát đối kháng vòng 3 đã chạy: cả BA lăng kính REJECT** — 7 P0 · 5 P1 ·
> 3 P2. Biên bản ở `review-findings.md` mục «Rà soát đối kháng — vòng 3».
>
> Vòng sửa 2 **đóng thật** những gì nó nhắm (bốn đẳng thức khớp khi đo độc lập,
> diff tên ca 0-mất, F2 đóng trọn lớp, hai blob đã ký byte-equal, không có lưới
> thứ hai bị gỡ kèm ca đo nó). Nhưng vòng 3 đỏ theo **một hình dạng duy nhất,
> lặp ở ba tầng**: *bản vá đóng đúng nửa nó nhìn thấy, nửa kia thành lỗ của
> vòng sau* — máy sửa/văn xuôi không sửa · `pinned:` bắt trường VẮNG không bắt
> trường RỖNG-HOÁ · khối có chiều đỏ cho THÊM không có cho XOÁ · `P195` trả lại
> cái TÊN của lưới chưa trả lại cái RĂNG.
>
> **LUẬT DỪNG-VÁ KÍCH HOẠT LẦN THỨ HAI**, và lần này ba lỗ P0 sinh ra từ chính
> bản vá của vòng trước. Biên bản vòng 3 cố ý DỪNG ở mô tả, không kèm bản vá.

## Verdict vòng 2 (sử liệu): **chờ rà soát đối kháng vòng 3**

> **Vòng sửa 2 «một-nguồn» — 2026-08-13.** Rà soát vòng 2 REJECT với 4 P0 · 7 P1
> · 3 P2, và **luật dừng-vá đã kích hoạt** (ba lần: F3 tái phạm nguyên văn C2
> của vòng 1; F2 cùng lớp với chính bugfix AC-19 của vòng 1; F4+F9+F10 cùng lớp
> A2/A3/B10). Owner cân ba đường và gạch **«vòng sửa một-nguồn»**: giữ phạm vi
> hẹp của đường vá, nhưng lấy BẤT BIẾN của đường đổi-luật.
>
> **Định nghĩa-xong của vòng này là một câu máy-kiểm được:** sau vòng này,
> không danh sách nào trong bộ răng còn là bản chép tay của hợp đồng, và không
> lời hứa thông-điệp nào của eval còn nằm ngoài tầm máy. Ghim thành **AC-20**.
>
> Vì sao KHÔNG vá từng chỗ: chép thêm một dòng vào mảng là **nới phép khớp** —
> mảng chép tay vẫn là mảng chép tay, và lần sửa hợp đồng thứ tám lại đẻ ra lỗ y
> hệt. Ba lỗ F1/F3/F4 là cùng MỘT hình dạng, không phải ba sự cố.
>
> Vì sao KHÔNG nâng thành luật toàn kit ngay: đó là **CỘNG**, và nó đụng engine
> dưới chân hai hồ sơ đang giữa vòng. Hạt giống nằm ở
> `docs/plans/2026-08-13-hat-giong-liet-ke-may-doc.md`, **chờ Cổng 0**.

### Vòng sửa 2 đã làm gì với 14 finding

| # | Finding vòng 2 | Đã làm |
|---|---|---|
| **F1** P0 · AC-2 khai 7 đường dẫn, mã đo 6 (cả ba lăng kính) | Danh sách chuyển vào khối `VAT-LUU-KHO` của `contract.md`; bộ răng đọc thẳng. Đo lại: **7/7**. Chân **round-trip**: thêm một dòng vào khối trong bản sao hợp đồng → phép đo đổi theo và ĐỎ đích danh dòng vừa thêm. |
| **F2** P0 · `if so_ca_run … \| sed` nuốt mã thoát | Bắt mã thoát vào biến TRƯỚC khi trang trí. Chiều đỏ **không grep hình dạng câu lệnh** (đó là đo chỉ-dẫn): cho `so-ca.sh` THẬT thoát 1, rồi so hai cách đọc trên CÙNG lượt chạy — cách cũ đọc ra 0, cách mới đọc đúng 1. |
| **F3** P0 · AC-4 khai 4 needle `plugins/…`, mã có 1 | Mảng chuyển vào khối `NEEDLE-CHET`; ba needle thiếu được trả lại (đối chứng dương ở mốc: 1 · 1 · 4 hit). Mảng 8 → **11**, đo lại **11/11**. Needle có trong khối mà chưa khai mồi → ĐỎ đích danh. |
| **F4** P0 · E7 ghim `671 -> 664`, cây in `686` | Sửa về `686` ở cả văn `expected` lẫn trường `pinned:` mới. |
| **F5** P1 · chân wire chỉ grep TÊN khoá | Nay đọc **GIÁ TRỊ** khoá và đòi nó vừa trỏ `so-ca.sh` vừa mang đúng `--suite <s>`. Chiều đỏ: đổi giá trị khoá trong bản sao config → ĐỎ "bo dem da roi khoi lan". |
| **F6** P1 · lưới `suite_key` phải resolve bị gỡ kèm ca `P162` | **Un-remove**: trả lại bộ kiểm THƯỜNG TRỰC dưới tên `P195` (nó phải sống sau merge, khác bộ răng của hồ sơ). Chiều đỏ nêu đích danh khoá ma. Số ca `plugins` **145 → 146**, khai TRƯỚC khi đo. |
| **F7** P1 · 69 assert ngoài cửa sổ bánh cóc, không khai ở đâu | Khai phạm vi THẬT vào đầu `asserts-da-go.txt`, kèm phân bổ từng ca. Nói thẳng đây là giới hạn của **bánh cóc** (mốc ghim `044968e`), và chữa nó thuộc hồ sơ `card-text-fidelity`. |
| **F8** P1 · sổ chạy thiếu `output` | Ghi `output` (đuôi 4000 ký tự) + `output_bytes` + `output_sha256` + `pinned` + `pinned_missing`. |
| **F9** P1 · «đúng byte lúc ký» sai | Sửa câu về đúng vật đo được: byte của `a8767168`, trạng thái ngay TRƯỚC hồ sơ này. Vế đúng, và cũng là vế hồ sơ này chịu trách nhiệm, là **hồ sơ này không viết lại chúng**. |
| **F10** P1 · `GUIDE.md:5` khai `1.18.0/1.14.0` | Sửa về `1.41.0/1.28.0`. |
| **F11** P1 · miễn trừ đo SỐ DÒNG trên trường JSON một-dòng | **CHƯA SỬA** — xem «Giới hạn đã biết», mục mới. |
| **F12** P2 · `grep -c '[đột biến]'` cho 90, không phải số đã khai | Sửa thành `grep -cF`; số nhóm và số chiều đỏ đo lại. |
| **F13** P2 · chú thích `671 xuống 664` ngay tại vết mổ | Sửa về `686 = 671 − 7 + 22`, kèm lý do vì sao một mẫu số chết nằm cạnh vết mổ là nguy hiểm. |
| **F14** P2 · «Bốn mục» rồi liệt kê sáu | Sửa thành «Sáu mục». |

**Cần owner gạch ở Cổng 2 — hai mục mở rộng phạm vi:** **AC-20** (luật một-nguồn
+ `pinned:` fail-closed) và **số ca `plugins` 145 → 146** (trả lại một lưới, tức
CỘNG một ca vào một hồ sơ chỉ-TRỪ — phải giải trình chứ không được lặng lẽ).

## Verdict vòng 2 (sử liệu): **REJECT (2026-08-13)**

> **Rà soát đối kháng vòng 2 đã chạy: cả BA lăng kính REJECT** — 4 P0 · 7 P1 ·
> 3 P2. Biên bản ở `review-findings.md` mục «Rà soát đối kháng — vòng 2».
> Làn máy 23/23 xanh vẫn đúng như đã báo, và ba phiên chấm xác nhận vòng sửa 1
> **đã chữa đúng** lớp lỗi nặng nhất của vòng 1 (14 chiều đỏ là thật, bốn đẳng
> thức số ca khớp khi đo độc lập). Vòng 2 đỏ ở lớp KHÁC: **phạm vi phép đo hẹp
> hơn lời hứa** — hợp đồng nói bảy vật, mã đo sáu; hợp đồng nói bốn needle, mã
> đo một; eval hứa một chuỗi, sổ chạy chỉ ghi mã thoát.
>
> **LUẬT DỪNG-VÁ ĐÃ KÍCH HOẠT** (điều kiện ở mục cuối trang này, thoả ba lần).
> Biên bản vòng 2 cố ý DỪNG ở mô tả, không kèm bản vá. Ba đường ra là việc của
> owner.

> Vòng 1 bị **REJECT**. `review-findings.md` là đề bài của vòng sửa 1; mục
> «Vòng sửa 1 đã làm gì» dưới đây trả lời từng mục, kèm cả những mục **cố ý
> không sửa** và lý do.

Vòng 1 xanh 19/19 nhưng **xanh vì đo cái dễ hơn cái đã hứa**: nhiều chân đo có
chiều đỏ hằng-đúng, đối chứng dương chưa từng chạy, thông điệp xanh nói dối là
đã có đối chứng; hai **khẳng định SAI** nằm trong vật phát đi; và tiêu chí trung
tâm (đẳng thức số ca) chưa có một dòng mã nào assert nó. Vòng sửa 1 không nới
một tiêu chí nào — nó dựng những cái lưới đã khai mà chưa tồn tại.

**Hội đồng ba giám khảo KHÔNG ÁP DỤNG cho hồ sơ này — không phải bỏ quên.**
Hợp đồng có **0 phép đo loại phán-xét**: mọi lời hứa ở đây đều đo được bằng máy
(vật còn hay mất, băm nội dung có khớp mốc không, số ca có đúng đẳng thức
không). Hội đồng sinh ra để chấm những câu hỏi không có đáp án máy; ở đây không
có câu nào như thế.

## Số đo

| Phép đo | Kết quả | Đẳng thức khai TRƯỚC |
|---|---|---|
| Bộ kiểm gói | **146/146 xanh** | `173 − 26 − 2 + 1` ✔ |
| Bộ kiểm luồng | **463/463 xanh** | `488 − 25` ✔ |
| Bộ kiểm script | **686/686 xanh** | `671 − 7 + 22` ✔ |
| Bộ kiểm hook | **54/54 xanh** | `54 → 54` (không chạm) ✔ |
| Bản đồ sản phẩm | khớp hồ sơ xưởng | — |
| Bộ răng đo sự-vắng-mặt | **15 nhóm chân**, **16 chiều đỏ chạy thật** | — |

Vòng 1 in **chín** dòng đột-biến, trong đó chỉ 6–7 dòng thật sự đi qua một hàm
kiểm và ít nhất hai dòng chưa từng chạy (chúng in một câu ở **thì tương lai**).
Mỗi dòng `[đột biến]` là kết quả của việc chạy lại **chính hàm kiểm** trên một
bản sao bị tiêm — không dòng nào là lời hứa. Số dòng KHÔNG chép vào câu này
nữa: nó đếm từ đầu ra bằng `grep -cF '[đột biến]'` và ghi ĐÚNG MỘT chỗ — bảng
«Số đo» trên. Hai lần chép là hai lần sai: bản «14» của câu này trôi ngay trong
vòng sửa viết ra nó (G4 vòng 3 — F12 tái phạm trên chính câu vừa sửa vì F12).


**Bốn đẳng thức nay do MÁY so, không do người đếm.** Đây là thay đổi nặng nhất
của vòng sửa: `so-ca.sh` chạy từng bộ kiểm, đếm theo phương pháp ghim riêng cho
từng bộ, và so với **bản khai máy-đọc trong chính `contract.md`** (khối
`SO-CA-KY-VONG`) — một bản duy nhất, không bản chép thứ hai để trôi. Bốn eval
E12/E7/E13/E14 trỏ vào nó, nên **không thêm một lượt chạy bộ kiểm nào** so với
trước.

Cả bốn vẫn là **đẳng thức**, không phải sàn: một bộ kiểm bị chủ ý làm teo mà đặt
sàn `≥` thì lúc đỏ, đường thoát rẻ nhất là hạ sàn xuống mức vừa đo — và phép đo
mất đúng lý do nó tồn tại.

**Hai kiểu hỏng, hai câu khác nhau.** Bộ đếm tách «số ca lệch» (gỡ quá tay / gỡ
sót — đi tìm ca, KHÔNG sửa số) khỏi «đủ số ca nhưng N ca ĐỎ» (ca hỏng). Gộp
chúng thì một ca đỏ đọc y hệt một đợt gỡ quá tay, và người đọc log học cách phớt
lờ cả hai — cùng bài học với chân phụ-thuộc-mạng ở vấp thứ bảy.

## Đường đảo

Mốc `truoc-luu-kho-2026-08` → commit `1df86adb7da1a013adad9a4c2f14cd62a4ac9c39`,
**đã có trên remote**, là **cha trực tiếp** của commit gỡ đầu tiên (quan hệ
tổ-tiên không được chấp nhận: nó cho phép chèn commit khác vào giữa). Hai ADR
ghim đúng sha đó kèm điều kiện mở lại. Đây là chân duy nhất biện minh cho việc
gỡ ~194 file, nên nó được đo bằng bốn vế riêng biệt.

Vòng sửa 1 chữa một lỗ ở chính chân này: phép kiểm «đã đẩy lên remote» trước đây
tìm sha trong **cả khối trả về**, nên một mốc KHÁC trỏ cùng commit — chuyện
thường khi ai đó gắn thêm nhãn phát hành — làm nó xanh trong khi mốc này chưa hề
được đẩy. Nay phép so là quan hệ: sha NÀY phải nằm dưới ĐÚNG `refs/tags/<tên
mốc>`, và chiều đỏ dựng đúng tình huống «cùng sha, ref khác» rồi đòi hàm so ĐỎ.

## Đường phát hành

**Đội phải làm ba việc tay sau khi merge — `claude plugin update` không làm hộ
được.**

1. **Gỡ `design-loop` đã cài.** Sau merge, gói này không còn entry nào trong
   marketplace, nên bản đã cài trên máy **treo lơ lửng**: lệnh cập nhật không
   thấy nó để gỡ. Phải gỡ tường minh.
2. **Cập nhật hai gói còn lại:** `acceptance-gate` 1.40.0 → **1.41.0**,
   `feature-loop` 1.27.1 → **1.28.0**. Hai manifest đã bump ít nhất một nấc
   minor, và đây không phải hình thức — sổ nhớ của kho ghi lớp lỗi **lệnh cập
   nhật bỏ qua khi số trùng mà nội dung đổi**; giữ nguyên số là để đúng đợt đổi
   lớn nhất trượt qua đội im lặng.
3. **Ai đã wire `executors.design.*` trỏ vào script của làn nghi lễ cũ thì phải
   trỏ lại.** `GUIDE.md` có mục «Wire `executors.design`» hướng dẫn wire tay.

Phép đo của mục này neo vào MỐC chứ không ghim số cứng: ghim số thì lần bump kế
tiếp làm tiêu chí đỏ oan, và đường thoát lúc đó là sửa số trong eval — tức phép
đo mất răng.

## Vòng sửa 1 đã làm gì

| Mục rà soát | Đã làm |
|---|---|
| **A1** `layout-craft.md` khai một luật là máy-cưỡng-chế | Câu đó nay nói đúng sự thật: **không checker nào** cưỡng chế luật khoảng-cách; `design-gate.mjs` chạy bộ dò Impeccable trên bản dựng, là phép kiểm KHÁC và không đọc layout token. Luật là kỷ luật lúc viết, và cái máy duy nhất có thể cãi lại là **thước** — nó đo trang đã dựng và bắt khoảng cách rơi khỏi thang đã khai. Đây là skill **phát cho repo tiêu thụ** nên sai ở đây là sai ngoài kho. |
| **A2** chú thích SAI trong bộ sinh của một hồ sơ ĐÃ KÝ | Hai tệp bằng chứng đã trả về **đúng byte** nội dung ở `a8767168` (2026-08-11), trạng thái ngay TRƯỚC hồ sơ này. **[SỬA SAU CỔNG 1 — 13/08, vòng sửa 2]** Câu cũ viết «đúng byte nội dung **lúc ký**», và rà soát vòng 2 (F9) đo ra nó SAI: chữ ký ở `8a53ab6a` (2026-08-07), blob lúc ký khác blob tại HEAD — `git diff` 20 dòng mỗi tệp, vì bản ghi còn được tái sinh bốn lượt HỢP LỆ giữa lúc ký và hồ sơ này. Vế đúng, và cũng là vế hồ sơ này chịu trách nhiệm, là **hồ sơ này không viết lại chúng**. Bộ sinh nay **ghi-một-lần** cho nhánh đã có bằng chứng: đã có trên đĩa thì không đụng vào, và **nói ra** một dòng. Chú thích cũ khẳng định «nhánh còn lại sinh ra y nguyên byte» — câu đó SAI ngay lúc viết; nay nó ghi đúng vì sao bằng chứng của một lượt đã chạy là sử liệu. |
| **B1/B2** chiều đỏ E10 hằng-đúng, thông điệp xanh nói dối | Chiều đỏ nay đi qua **chính trình đọc khoá**, kèm đối chứng dương (bản sao chưa tiêm phải cho ÂM). Năm chân của E10 nay kiểm **cả hai đầu** — vắng ở HEAD **và** có ở mốc — nên câu «có ở tag OK» là điều đã đo chứ không phải điều được in. |
| **B3** chiều đỏ E5/E11b ở thì tương lai | Ba chiều đỏ từng chỉ in một câu («lưới trên *sẽ* ĐỎ») nay **chạy thật**: E5 đè mục «Làn design» của mốc lên bản sao rồi chạy lại chính hàm kiểm; ADR đổi một ký tự sha rồi chạy lại chính hàm kiểm; E10b chép đúng các dòng bất biến của mốc vào bản sao. Thêm chiều đỏ cho E11b (chưa từng có): tiêm lại một lượt đọc `.agents/` vào bản sao `start-scan.mjs` rồi đòi phép kiểm ĐỎ. |
| **B5** miễn trừ che TRỌN TỆP cho cả 8 từ khoá | Miễn trừ nay là cặp `(tệp, từ khoá)` kèm **số dòng mong đợi**, kiểm hai chiều (khai thiếu → đỏ; khai thừa → cũng đỏ). Vật lọt thật được khai ra thành một dòng riêng thay vì nấp sau tiền tố tệp. Chân đỏ-ngoài-danh-sách nay phủ **8/8 từ khoá** và chạy qua **chính hàm quét**, tiêm vào tệp đang được miễn trừ cho từ khoá KHÁC — đúng cái lỗ mà miễn trừ-theo-tệp để lại. |
| **B6** chân «mốc đã đẩy» đo từ vựng | Ghim `refs/tags/<tên mốc>`; chiều đỏ dựng khối «cùng sha, ref khác». |
| **B9** chiều đỏ E2 thoả bằng `mkdir` | Bỏ `mkdir` sớm và hai lần nuốt lỗi; giải nén hỏng hoặc bản chép rỗng nay làm chiều đỏ ĐỎ, và số tệp chép được in ra. |
| **B10** thông điệp ghim của E12/E7/E14 không tồn tại trong mã | `so-ca.sh` — xem mục «Số đo». |
| **C1** hai lần sửa-sau-Cổng-1 chưa khai | Đã khai vào `contract.md` đúng khuôn sáu lần trước, **từng từ khoá một** kèm lý do riêng, và nêu thẳng ràng buộc thay thế để việc co mảng không thành đường nới lỏng. Lần cắt phạm vi `tests/` được khai kèm câu tự-hoài-nghi: nó chỉ hợp lệ vì thứ thay thế MẠNH HƠN, và thứ đó phải có chân máy — nên `so-ca.sh` dựng cùng lượt, không tách để sau. |
| **E2** chưa bump, gói biến khỏi marketplace | Xem mục «Đường phát hành». Thêm AC-16 + E16 — **mở rộng phạm vi, cần owner gạch ở Cổng 2**. |
| **B4** thêm (ngoài đề bài, rẻ) | Phạm vi quét nay được kiểm **tồn tại** trước khi tin bất kỳ con số 0 nào: một mục gõ sai từng làm `grep` im lặng và cả tám từ khoá in «HEAD=0 … OK» trong khi phép quét chưa quét gì. |
| **(đường 3)** owner gạch 13/08 | Luật soi-lại-bằng-chứng thu phạm vi theo diff PR (AC-17), dùng LẠI đúng hàm `slug_in_diff` mà gap-probe và staleness dùng. Cổng đo trên CI: **22 → 1 vi phạm**. Cắt **thấy được**: một dòng NOTE hằng + một dòng đếm đích danh số hồ sơ bị bỏ qua. Cờ `--recheck-all` là đường cứu cho việc thước-thôi-hồi-tố. ADR 0010. |
| **(đường c)** owner gạch 13/08 | Hai baseline gọi `recheck` THẲNG trên corpus (`JR11b`, `DV4a`) không đi qua cổng nên AC-17 không chạm tới. Chúng chuyển từ ngưỡng trần "0 fail" sang **allowlist CÓ TÊN** (AC-18), một bản khai hai bên đọc chung, kèm ba ràng buộc: chỉ che hồ sơ có tên · chỉ che đúng MỘT lý do · kiểm hai chiều (tên khai mà hết đỏ thì cũng ĐỎ). |
| **(bugfix)** bộ-chạy nuốt mã thoát | `tests/scripts` viết `check "$(basename "$_f")" 0 $?` — bash khai triển đối số TRƯỚC khi gọi `check`, nên `$(basename …)` chạy trước và **ghi đè `$?`** bằng mã thoát của `basename` (luôn 0). Hệ quả: **mọi** `*.test.mjs` đỏ vẫn ghi PASS. Đo tại commit nền: `core-untouched.test.mjs` ĐÃ đỏ mà suite in `664 passed, 0 failed`. Ghim thành AC-19 vì cùng lý do AC-15 — đẳng thức số ca không đo được điều nó nói khi bộ đếm mù. |
| **(re-pin)** owner gạch 13/08 | `stop-patching-law` vào diff vì phần sửa A1b chạm ba tệp của nó, nên mất quyền im lặng của guard staleness — luật tính ĐÚNG. Xử bằng **re-pin lần 10** theo nghi thức một-lượt-lane, sau khi lane đã xanh trọn (nghi thức cấm ký mù trên lane đỏ). |

## Giới hạn đã biết

**[13/08, vòng sửa 2] Một mục MỚI: F11 — miễn trừ nhật-ký-phiên-bản đo SỐ DÒNG
và TÊN TRƯỜNG, không đo dòng ấy còn là sử liệu hay đã thành chỉ dẫn sống.**
Nói thẳng hai điều. (a) Nó **không nằm trong đề xuất tôi trình owner** cho vòng
này — bảng đề xuất liệt F1/F3/F5, F2/F8/F4, F6/F7, F9/F10/F12/F13/F14, và F11 bị
tôi bỏ sót khỏi bảng chứ không phải bị owner gạt. (b) Rà soát vòng 2 chỉ ra
`description` là JSON **một dòng**, nên `grep -c` cho 1 bất kể trong đó có gì —
"số dòng mong đợi, kiểm hai chiều" không thêm được độ phân giải nào ở chỗ này.
Và tiền lệ đã có thật: chính hồ sơ này viết `NOTE FOR UPGRADERS: … uninstall it
explicitly` vào đúng trường được miễn trừ — đó là **chỉ dẫn thì hiện tại**, không
phải sử liệu, tức miễn trừ đang che rộng hơn lý do đã khai ở AC-4.
Vì sao vẫn để lại: mệnh đề cần đo là *«dòng này là lịch sử hay con trỏ sống»* —
một **phán xét**, không phải vị từ máy. Hai đường chữa đều đổi phạm vi: bỏ hẳn
miễn trừ thì phải viết lại changelog cho lint xanh (**xoá lịch sử để lấy màu** —
chính điều AC-4 từ chối), còn dựng một eval phán-xét thì hồ sơ này đang có **0**
eval loại đó và thêm một cái là mở một làn mới giữa vòng sửa. **Owner gạt thì
tôi làm** — đường rẻ nhất là cấm needle đứng chung dòng với động từ mệnh lệnh
(`run`/`chạy`/`install`/`uninstall`), và lưu ý nó sẽ ĐỎ ngay với `NOTE FOR
UPGRADERS` hiện tại, tức lần chạy đầu là một quyết định về câu chữ ấy.

**[13/08, vòng 4] Round-trip chỉ có cho `VAT-LUU-KHO`.** `NEEDLE-CHET` và
`SO-CA-KY-VONG` được bộ răng đọc thẳng nhưng KHÔNG có chân đột biến chứng minh
bên-đọc-theo-bên-viết — nằm dưới ĐÁY (dụng cụ), khai ở đây cho đúng lời E20.

Sáu mục dưới đây **cố ý không sửa** (bản trước mở bằng «bốn» rồi liệt kê sáu — F14). Căn cứ chung: đây là răng **dùng một lần**
cho một đợt lưu kho, chết theo hồ sơ khi merge — không phải lưới engine vĩnh
viễn. Chi phí siết chúng lớn hơn rủi ro chúng che, và bản neo nói *giờ-kit là
chi phí, không phải tiến độ*. **Owner có thể gạt bất kỳ mục nào.**

1. **Phép quét tham chiếu (E4) vẫn không có chiều đỏ đi qua đúng đường hàm quét
   THẬT dùng để đọc phạm vi.** Chân đỏ-ngoài-danh-sách nay chạy qua chính hàm
   quét (đã sửa ở vòng này), nhưng đối chứng dương ở mốc vẫn chạy bằng
   `git grep` với một danh sách đường dẫn viết riêng — hai danh sách có thể trôi
   khỏi nhau. Đã hạ rủi ro bằng chân kiểm-phạm-vi-tồn-tại; phần còn lại để mở.
2. **E15 canh khối thoát-sớm bằng một hình dạng thụt lề duy nhất.** Khối
   nuốt-ca quay lại dưới dạng `    exit 1`, `exit "$failures"` hay `return 1`
   thì lưới mù — đúng lớp lỗi nó sinh ra để chặn.
3. **Bánh cóc chống hạ-thước chỉ đếm dòng Python `assert `**, mù với `grep -q`,
   `fail`, `die` của 26 ca đã xoá. Nên «108 dòng đã khai» là bản kiểm kê phần
   Python của đợt gỡ, không phải của cả đợt.
4. **Mất một mẩu độ phủ ở cụm MBC** (`P178` bị xoá thay vì trim), và bộ sinh của
   workspace ấy còn một con trỏ chết không ai canh. Ba đường đã cân ở nhật ký
   thi công; đường được chọn là mất một mẩu độ phủ thay vì **viết lại bằng chứng
   của một hồ sơ đã ký**.

5. **Đẳng thức số CA mù với xói mòn ở mức ASSERT**, theo đúng cấu tạo: một ca
   giữ nguyên dòng `PASS:` trong khi mất phần lớn assert bên trong. Bộ kiểm gói
   mất ~109 assert trong đợt này. Thứ canh chiều đó là bánh cóc `P161`/E11 (hai
   chiều, có sổ khai) chứ không phải `so-ca.sh` — hai phép đo khác trục, và
   không nên đọc cái này thay cái kia.
6. **Đẳng thức của bộ kiểm `scripts` đứng trên bộ đếm NỘI BỘ của suite** (664),
   không phải số dòng `PASS:` thô (737). Cả hai con số đều đúng và chúng KHÁC
   nhau; ai đổi phương pháp đếm phải đổi cả mẫu số. Phương pháp nay ghim tường
   minh theo từng suite trong `so-ca.sh` kèm lý do — nhưng nó vẫn là một quy ước
   phải đọc trước khi diễn giải con số.

Hai giới hạn đã khai từ trước, giữ nguyên:

- **Chạy lại nghiệm thu một hồ sơ cũ sẽ hỏng** ở những hồ sơ có phép đo trỏ khoá
  cấu hình đã chết. Đã khai từ Cổng 1, không migrate hàng loạt.
  **HẬU QUẢ ĐO ĐƯỢC — ĐÃ XỬ, owner gạch 13/08.** Câu khai ở Cổng 1 nói "chạy lại
  verify một hồ sơ cũ sẽ hỏng", nghe như bất tiện khi ai đó chủ động chạy lại. Đo
  trên CI: luật `recheck: strict` soi MỌI hồ sơ đã commit ở MỌI lượt CI, không
  theo phạm vi diff — nên nó **chặn merge với 22 vi phạm**, không đợi ai chạy lại
  cái gì. Owner cân ba đường và gạch **thu phạm vi luật theo diff PR** (AC-17,
  ADR 0010) cộng **allowlist có tên** cho hai baseline gọi recheck thẳng trên
  corpus (AC-18). Đo lại trên CI sau khi ship: **22 → 1**, và vi phạm cuối cùng
  (`stop-patching-law` stale) đã xử bằng **re-pin lần 10** theo nghi thức
  một-lượt-lane. Đánh đổi phải đọc kèm: **thước thôi hồi tố** — siết bar về sau
  không tự đo lại hồ sơ cũ; đường cứu là cờ `--recheck-all`, chạy sau mỗi lần
  nâng bar.

- **Một chân đo phụ thuộc mạng.** Chân «mốc đã lên remote» hỏi remote thật; hết
  ba lượt không hỏi được thì vẫn đỏ (không chứng minh được là đã đẩy thì không
  coi như đã đẩy) nhưng ghim rõ đó là lỗi đường truyền, không phải lỗi hồ sơ.
- **Bộ kiểm gói mất chiều đo hai-bản-chép.** Không còn bản dựng nào để so, nên
  luật «mọi bản chép phải khớp nguồn từng ký tự» thu về luật «đếm nguồn so với
  số khai trong bản luật, đúng hai hướng».

## Xung đột với hồ sơ anh em

`AC-11` của hồ sơ `cat-hinh-thuc` đòi một script mà hồ sơ này đã xoá — **tiêu
chí đó chết khi hồ sơ này merge.** Bên nào merge sau phải rebase và bỏ tiêu chí
đó. Ghi ở đây (chứ không chỉ trong Notes của hợp đồng) vì **người ký đọc trang
bằng chứng**.

## Việc còn lại trước khi mời ký

**Rà soát đối kháng vòng 2**: ba phiên sạch, ba lăng kính (phép đo · gỡ-quá-tay
· hợp đồng-đối-vật). Người sửa KHÔNG chấm bản sửa của mình.

**Luật dừng-vá đang có hiệu lực:** nếu vòng 2 vẫn sinh lỗi CÙNG LỚP với vòng 1
thì khuôn giải sai — DỪNG, trình owner ba đường (đổi hình · thu phạm vi · ship
kèm known-limits), không tự phát vòng ba.

## Evidence (per eval — sổ chạy vòng 8, máy sinh từ run-log.jsonl)

- eval: E1
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E2
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E3
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E4
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E4b
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E5
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E6
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E7
  run_id: luu-kho-r8-9134197c
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/so-ca.sh --suite scripts
  verified_at: 2026-08-13T12:24:37.618Z
  output: |
                   (dem theo phuong phap 'results-last': 686 xanh + 0 do)
    LUU-KHO-SUITE: dang thuc so ca khop ban khai

- eval: E8
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E9
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E10
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E10b
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E11b
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E11
  run_id: luu-kho-r8-7908e794
  exit_code: 0
  baseline: green
  verifier: node scripts/product-map.mjs --root . --check
  verified_at: 2026-08-13T12:24:37.680Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E12
  run_id: luu-kho-r8-798a702a
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/so-ca.sh --suite plugins
  verified_at: 2026-08-13T12:26:22.163Z
  output: |
                   (dem theo phuong phap 'case-lines': 146 xanh + 0 do)
    LUU-KHO-SUITE: dang thuc so ca khop ban khai

- eval: E13
  run_id: luu-kho-r8-5aa06831
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/so-ca.sh --suite hooks
  verified_at: 2026-08-13T12:26:24.277Z
  output: |
                   (dem theo phuong phap 'results-last': 54 xanh + 0 do)
    LUU-KHO-SUITE: dang thuc so ca khop ban khai

- eval: E14
  run_id: luu-kho-r8-e688eb21
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/so-ca.sh --suite workflows
  verified_at: 2026-08-13T12:26:26.579Z
  output: |
                   (dem theo phuong phap 'results-sum:6': 463 xanh + 0 do)
    LUU-KHO-SUITE: dang thuc so ca khop ban khai

- eval: E4c
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E15
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E16
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh

- eval: E17
  run_id: luu-kho-r8-9134197c
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/so-ca.sh --suite scripts
  verified_at: 2026-08-13T12:24:37.618Z
  output: |
                   (dem theo phuong phap 'results-last': 686 xanh + 0 do)
    LUU-KHO-SUITE: dang thuc so ca khop ban khai

- eval: E18
  run_id: luu-kho-r8-9134197c
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/so-ca.sh --suite scripts
  verified_at: 2026-08-13T12:24:37.618Z
  output: |
                   (dem theo phuong phap 'results-last': 686 xanh + 0 do)
    LUU-KHO-SUITE: dang thuc so ca khop ban khai

- eval: E19
  run_id: luu-kho-r8-9134197c
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/so-ca.sh --suite scripts
  verified_at: 2026-08-13T12:24:37.618Z
  output: |
                   (dem theo phuong phap 'results-last': 686 xanh + 0 do)
    LUU-KHO-SUITE: dang thuc so ca khop ban khai

- eval: E20
  run_id: luu-kho-r8-cec5ae72
  exit_code: 0
  baseline: green
  verifier: bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh
  verified_at: 2026-08-13T12:23:25.510Z
  output: |
      OK   LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK
    LUU-KHO-RANG: tất cả phép đo xanh
