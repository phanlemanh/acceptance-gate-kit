---
schema_version: 1
slug: luu-kho-codex-va-nghi-le-design
round: 3
verdict: PENDING-JUDGMENT
verified_commit: a69cb309c94e
---

# Trang bằng chứng — lưu kho harness song sinh và nghi lễ design

## Verdict: **chờ rà soát đối kháng vòng 2**

> Vòng 1 bị **REJECT**. `review-findings.md` là đề bài của vòng sửa này; mục
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
| Bộ kiểm gói | **145/145 xanh** | `173 − 26 − 2` ✔ |
| Bộ kiểm luồng | **463/463 xanh** | `488 − 25` ✔ |
| Bộ kiểm script | **686/686 xanh** | `671 − 7 + 22` ✔ |
| Bộ kiểm hook | **54/54 xanh** | `54 → 54` (không chạm) ✔ |
| Bản đồ sản phẩm | khớp hồ sơ xưởng | — |
| Bộ răng đo sự-vắng-mặt | 16 nhóm chân, **14 chiều đỏ chạy thật** | — |

Vòng 1 in **chín** dòng đột-biến, trong đó chỉ 6–7 dòng thật sự đi qua một hàm
kiểm và ít nhất hai dòng chưa từng chạy (chúng in một câu ở **thì tương lai**).
Vòng này in **14** dòng, và mỗi dòng là kết quả của việc chạy lại **chính hàm
kiểm** trên một bản sao bị tiêm — không dòng nào là lời hứa. Con số 14 đếm được
từ đầu ra (`grep -c '[đột biến]'`), không phải chép tay.

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
| **A2** chú thích SAI trong bộ sinh của một hồ sơ ĐÃ KÝ | Hai tệp bằng chứng đã trả về **đúng byte** nội dung lúc ký. Bộ sinh nay **ghi-một-lần** cho nhánh đã có bằng chứng: đã có trên đĩa thì không đụng vào, và **nói ra** một dòng. Chú thích cũ khẳng định «nhánh còn lại sinh ra y nguyên byte» — câu đó SAI ngay lúc viết; nay nó ghi đúng vì sao bằng chứng của một lượt đã chạy là sử liệu. |
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

Bốn mục dưới đây **cố ý không sửa**. Căn cứ chung: đây là răng **dùng một lần**
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
   `fail`, `die` của 26 ca đã xoá. Nên «105 dòng đã khai» là bản kiểm kê phần
   Python của đợt gỡ, không phải của cả đợt.
4. **Mất một mẩu độ phủ ở cụm MBC** (`P178` bị xoá thay vì trim), và bộ sinh của
   workspace ấy còn một con trỏ chết không ai canh. Ba đường đã cân ở nhật ký
   thi công; đường được chọn là mất một mẩu độ phủ thay vì **viết lại bằng chứng
   của một hồ sơ đã ký**.

5. **Đẳng thức số CA mù với xói mòn ở mức ASSERT**, theo đúng cấu tạo: một ca
   giữ nguyên dòng `PASS:` trong khi mất phần lớn assert bên trong. Bộ kiểm gói
   mất ~106 assert trong đợt này. Thứ canh chiều đó là bánh cóc `P161`/E11 (hai
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
