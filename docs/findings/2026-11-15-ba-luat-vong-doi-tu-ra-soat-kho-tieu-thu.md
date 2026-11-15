# Ba luật vòng đời gửi từ một bản rà soát ở kho tiêu thụ — đối chiếu với vật của kit (15/11/2026)

**Trạng thái:** finding nháp, chờ chủ kho đọc. Không mở ô, không mở hàng lộ trình, không đổi engine, không đổi skill.

**Ai gửi, theo lời nào.** Phiên điều phối ở kho Repo Standards soạn bản đề nghị ngày 15/11. Chủ kho bảo gửi cùng ngày,
nguyên văn: «Gửi». Lời đó chỉ phủ việc đưa bản này vào kho để đọc (đẩy nhánh, mở PR). Nó **không** phải quyết định nhận
luật nào, không phải chữ ký cổng nào, và không cho phép gộp. Mọi dòng dưới đây là máy viết; không dòng nào là câu trả lời
của chủ kho.

**Vì sao là một tệp phát hiện.** Kho này chưa khai cửa tín hiệu cho chính nó (`_acceptance/config.yaml` không có khoá
`tin_hieu`). Hạt giống ở `docs/plans/` hôm nay vẫn bị đòi trỏ về một ô, mà điều gửi từ ngoài không có ô nào. Tiền lệ cho
điều đo ở kho tiêu thụ rồi mang về là tệp phát hiện ghi ngày
([30/10](2026-10-30-ui-dong-nhat-giua-cac-man.md)).

**Cách đo.** Đọc kit ở `origin/main` `644e9b49` (bản 2.39.0), sau `git fetch`. Bản rà soát nguồn (gọi là RS2, 14/11)
nằm ngoài git của kho tiêu thụ onehub-inventory; đọc tại máy để kiểm số. Kho kit công khai: tệp này chỉ mang **số đếm và
hình dạng của lỗi**, không tên tính năng, tên vai, tên màn hay câu chữ của sản phẩm. Hai kho riêng tư trong bối cảnh
được gọi theo vai: «kho giữ thứ nhìn thấy» và «kho mới của bộ công cụ».

---

## 0. Trả lời một phút

1. **Điều gửi tới.** RS2 đếm 19 ô thiếu trong bộ thêm · xem · sửa · bỏ theo vai ở một kho tiêu thụ: 7 thiếu thật, 5 chỉ
   hứa trên giấy, 7 do máy tự loại mà không hỏi người. Các phép kiểm sổ ở hai kho khác thấy được 7 ô thiếu thật. **12 ô
   còn lại sinh ra ở bước thiết kế của một vòng**, không cuốn sổ nào thấy, nên chỉ luật của vòng làm mới chặn được.
2. **Luật 1 (không bỏ, không rút gọn bước quét vòng đời): kit có một nửa.** Trục vòng đời đã có và bỏ quét phải để vết.
   Chưa có: điều gì cấm bỏ khi hàng có màn; «rút gọn» không phải chế độ kit định nghĩa, nên kit không cho mà cũng không
   cấm; và kit chưa có chỗ nào khai «màn này hiện thứ gì».
3. **Luật 2 (câu giao một động từ phải kê đủ vế): kit chưa có.** Bước cắt lượt không có luật hay cờ nào về vế sửa, bỏ.
   Lời dặn của bước phản biện đang đẩy đúng loại lỗ này ra ngoài: «không wishlist/feature mới».
4. **Luật 3 (máy định loại thì thành câu hỏi, có cột «ai quyết»): kit đã có cho dòng sổ, chưa có cho mục «Out of scope»
   của hợp đồng.** Trong 7 ô máy tự loại, ít nhất 3 ô đi đúng đường kit đã có luật, có bộ xếp và có người soi, mà vẫn
   lọt ở tầng nghĩa. 2 ô đi đường chưa có cột nào. 1 ô RS2 tự đánh giá là căn cứ đủ; 1 ô RS2 không tả rõ đường.
5. **Cả năm chỗ sửa RS2 viết sẵn đều là sửa chữ trong skill hay thẻ.** Ở kit, phần máy giữ được hôm nay là CÓ MẶT (có
   mục độ phủ, có con trỏ căn cứ); ĐÚNG và ĐỦ là mắt người ở cổng. Nhận ba luật dưới dạng thêm câu thì vẫn ở tầng lời.
   §4 kê chỗ nào hạ được xuống vật máy giữ.
6. **Có một lối không cần đổi kit:** kho tiêu thụ khai luật vòng đời vào tệp luật sản phẩm của chính nó. Kit đã nạp tệp
   ấy ở bước thiết kế và lựa chọn trái luật đã thành câu hỏi trên thẻ Cổng Phạm vi (§5, lối D).

Nhận luật nào, ở mốc nào, là việc của chủ kho. §5 kê các lối và hệ quả.

---

## 1. Điều gửi tới — số và hình dạng

Chủ kho chia việc UX cho ba kho: Repo Standards giữ nghĩa nghiệp vụ (thực thể, thao tác, vai); kho giữ thứ nhìn thấy
giữ sổ màn và bảng trạng thái; bộ công cụ vòng làm (kho này) giữ phán xét của từng vòng và không giữ giá trị đứng yên.

| Nhóm ô (RS2) | Số | Hình dạng | Ai thấy được |
|---|---|---|---|
| Thiếu thật | 7 | thứ đang hiện trên màn mà một thao tác không có quyền nào hay không hàng nào nhận | phép kiểm «mỗi thực thể đủ bốn câu trả lời» (Repo Standards, đã gộp) và phép kiểm «sổ màn nối mô hình nghiệp vụ» (kho giữ thứ nhìn thấy, đang ở một PR mở) thấy 4; phép kiểm quan hệ và thuộc tính đang làm ở Repo Standards nhắm 3 |
| Chỉ hứa trên giấy | 5 | «để hàng sau», nhưng câu giao của hàng sau không nhắc tới vế ấy | không cuốn sổ nào |
| Máy tự loại | 7 | thao tác bị xếp vào «đã chốt, máy quyết» hay «ngoài phạm vi» mà không thành câu hỏi | không cuốn sổ nào |
| **Tổng** | **19** | | **12 ô chỉ luật của vòng làm chặn được** |

RS2 quy nguyên nhân theo số ô giải thích được (một ô có thể có hơn một nguyên nhân):

- khoảng 14 trên 19 ô: bước thiết kế không buộc trục vòng đời; hàng được bỏ quét hoặc quét «rút gọn»; bước phản biện
  bị dặn không nêu tính năng mới;
- khoảng 10 ô: câu giao và điều kiện bật chỉ viết một động từ;
- 7 ô: máy tự loại một thao tác mà người duyệt không phân biệt được ai chốt.

Hai số nữa đáng mang theo. Chủ kho đã tự bắt lỗ loại này **ba lần trong hai ngày**, tức ba lượt gọi người ngoài thiết
kế. Và ở kho ấy luật bằng chữ cho việc này đã được viết ba lần mà vẫn rơi, nên RS2 xếp số một cho một phép kiểm máy ở
chính kho tiêu thụ, không phải cho phần gửi về kit.

**Đếm lại tại máy trên bản công khai** (onehub-inventory `main` `0861fdc`, trùng `origin`; lệnh ở §6): 46 hợp đồng, 23
có mặt người nhìn. Trong 23 hợp đồng ấy, **8 bỏ bước quét** bằng một dòng sổ, và 2 ghi là quét «rút gọn». Mẫu số này
khác mẫu số của RS2 (RS2 đếm trên các hàng đang mở ở cây làm việc), nên hai con số không so trực tiếp được.

---

## 2. Ba luật, bằng lời

1. Hàng có màn hiện một thứ thì không được bỏ, cũng không được rút gọn, bước quét vòng đời: tối thiểu một dòng thêm,
   xem, sửa, bỏ cho mỗi thứ hiện trên màn.
2. Câu giao chỉ có một động từ phải kê đủ sửa và bỏ, hoặc nói vế nào để hàng nào. Thiếu vế của một thứ đang hiện trên
   màn là lỗ của chính hàng đó, không phải «tính năng mới» để bước phản biện bỏ qua.
3. Thao tác mà máy định loại («đã chốt, máy quyết», «không bao giờ», «ngoài phạm vi») phải thành một câu hỏi cho
   người, có cột «ai quyết». Máy không tự điền cột đó.

---

## 3. Đối chiếu với vật của kit

### 3.1 Luật 1 — bước quét vòng đời

**Đã có.**

- Trục vòng đời là trục thứ nhất của bộ trục cho tính năng quanh một thực thể: «vòng đời entity, quét trọn chuỗi, cấm
  dừng ở CRUD» (`skills/morphological-scan/references/entity-feature.md:7`).
- Quét là bước mặc định của vòng T2 và T3, và mặc định đã được đảo để chống bỏ thầm: câu hỏi là «có muốn BỎ quét
  không», bỏ thì để lại một dòng sổ (`feature-loop/skills/feature-loop/SKILL.md:209`, `:326` «CẤM bỏ không dấu vết»).
- Hợp đồng thiếu mục độ phủ thì chưa được vào Cổng Phạm vi (`SKILL.md:332`); thẻ nổi cờ vàng khi thiếu mục hoặc khi
  một trục chưa có thước đối chiếu (`scripts/gate-card.js:971-972`).

**Thiếu.**

- Điều kiện được bỏ quét là ba ví dụ để mở: «1 chiều, AC hiển nhiên, spec ngoài đã chốt scope» (`SKILL.md:326`). Hàng
  có màn vẫn bỏ được bằng một dòng. Dòng bỏ lên thẻ như một dòng độ phủ bình thường, không cờ.
- Chữ «rút gọn» không có trong skill nào của kit cho bước này. Skill quét nói bộ trục có sẵn «là điểm xuất phát, không
  phải chân lý» và giới hạn 2–4 trục (`skills/morphological-scan/SKILL.md:26`, `:29`). Một phiên thay trục vòng đời
  bằng trục khác vẫn đúng chữ. Không câu nào nói trục nào không được bỏ.
- Kit chưa có chỗ nào khai «màn này hiện thứ gì». Hai vật gần nhất: vị từ «hợp đồng có mặt người nhìn»
  (`lib/lop-nhin-thay.cjs`, đọc dòng `surfaces`), và bảng «Kiểm kê màn» của khuôn đặc tả UX, hiện có ba cột Màn · Một
  việc của màn · Vào từ / ra tới (`skills/acceptance/references/ux-spec-template.md:38-42`). Khuôn ấy tự khai «KHÔNG có
  lưới máy nào».
- Kit tự khai giới hạn của lớp này: «máy chỉ enforce CÓ MẶT + ghi vết; ĐÚNG/đủ thật là việc human soi tại gate»
  (`SKILL.md:213`).

**Nếu nhận thì chạm.** Bộ trục thực thể (`entity-feature.md`); bước quét của vòng (`SKILL.md` S1#3); mục Coverage của
khuôn hợp đồng. Muốn có vật máy giữ thì thêm: một bảng vòng đời có marker trong khuôn đặc tả UX (bài kiểm
`tests/plugins/ux-spec.test.mjs` đang giữ khuôn này) và một cờ trên thẻ ở `scripts/gate-card.js`.

### 3.2 Luật 2 — câu giao một động từ

**Đã có.**

- Bước cắt lượt có sáu luật; luật 1 đòi «mỗi hàng MỘT kết quả» và câu giao đúng một trong hai dáng
  (`skills/cat-luot/SKILL.md:96-101`, khối `CAT-LUOT-SAU-LUAT`). Răng `scripts/cat-luot.mjs` gắn 18 cờ có tên (khối
  `CAT-LUOT-BANG-CO`): cỡ, dáng câu giao, việc vận hành, dữ liệu giả.
- Bước phản biện có bảy ý. Ý 4 đã đòi soi «trục Coverage nào không có AC» (`SKILL.md:352`).

**Thiếu.**

- Trong sáu luật và 18 cờ không có dòng nào về vế sửa, bỏ của thứ mà câu giao nhắc. Hàng lộ trình không có trường nào
  ghi «vế nào để hàng nào»; chỗ gần nhất là điều kiện bật (`bat_khi`), một trường chữ tự do.
- Ý 2 của bước phản biện là rào phạm vi: «CHỈ lỗ hổng làm chính feature này fail acceptance hoặc làm Gate 1 duyệt sai
  — không wishlist/feature mới» (`SKILL.md:352`). Không có ngoại lệ, nên vế sửa, bỏ còn thiếu rơi vào «feature mới».
- Hai luật 1 và 2 hở cùng một chỗ: khi bước quét đã bị bỏ hay rút gọn thì ý 4 không còn trục vòng đời nào để so.
- Không bài kiểm nào giữ chữ của ý 2 và ý 4 (tìm trong `tests/` và `evals/` không thấy tệp nào trích chúng).

**Nếu nhận thì chạm.** Skill cắt lượt (hai khối marker trên, có bài kiểm rút marker:
`tests/scripts/lo-trinh.test.mjs`, `tests/scripts/road-map-de-dung.test.mjs`) và `scripts/cat-luot.mjs` nếu thành cờ;
ý 2 và ý 4 của bước phản biện trong `SKILL.md`.

**Giới hạn phải khai trước.** Cờ «câu giao chỉ một động từ» dựng bằng dò chữ là đo từ vựng của một kho. Luật 26/09 của
kit đòi neo vào khuôn kit định nghĩa, không vào từ vựng. Dạng giữ được bằng máy là một trường khai: mỗi vế thêm, sửa,
bỏ trỏ «hàng này», một mã hàng khác, hoặc «không» kèm ai quyết. Máy kiểm có mặt và con trỏ có thật, không đọc nghĩa.

**Bằng chứng ở kho thứ hai.** Một bản rà soát ngày 05/11 ở một kho tiêu thụ khác đã nêu đúng hình dạng này cho bốn
hàng: câu giao chỉ nói thêm, đặt, chưa nói gỡ hay đổi. Bài học không sang được kho kế tiếp.

### 3.3 Luật 3 — máy định loại thì thành câu hỏi

**Đã có.**

- Mỗi lựa chọn ở bước thiết kế được xếp theo nguồn căn cứ. Trỏ được một tệp có từ trước vòng và «câu trích nguyên văn
  QUYẾT được lựa chọn» thì máy quyết; «nghĩa sản phẩm người dùng thấy» là «chỉ người có» và thành «Hỏi-n» trên thẻ;
  «Không trỏ được căn cứ thì là «chỉ người có»»; việc khó đảo luôn là câu hỏi (`SKILL.md:319-324`).
- Mỗi dòng sổ của bước thiết kế mang khoá nguồn căn cứ (khối `DEC-CAN-CU-SLOT`, `SKILL.md:154-158`). Bộ xếp
  `scripts/can-cu-s1.cjs` đỏ khi thiếu con trỏ, khi câu trích không có trong tệp, khi căn cứ là vật của chính vòng; có
  bộ ca riêng (`tests/scripts/can-cu-s1.ca.mjs`).
- Thẻ Cổng Phạm vi đã tách hai khối: «Câu chỉ anh trả lời được» và «Máy đã quyết ở bước thiết kế — anh lật được», khối
  sau in kèm căn cứ (`scripts/gate-card.js:911-912`). Người lật thì sổ ghi một dòng mang tên người (khối
  `DEC-LAT-GATE1`, `SKILL.md:162`). Với dòng sổ, đây chính là cột «ai quyết», và máy không điền tên người vào đó.
- Bước phản biện đã được giao soi căn cứ của máy: «câu trích có QUYẾT lựa chọn hay chỉ liên quan», và «có lựa chọn
  «chỉ người có» nào … mà sổ ghi máy quyết hoặc không ghi»; mỗi chỗ là mức nặng nhất (`SKILL.md:352`, ý 4).

**Thiếu.**

- Mục «Out of scope» của hợp đồng là gạch đầu dòng trơn (`skills/acceptance/references/contract-template.md:99-104`).
  Lên thẻ, mỗi dòng thành một mục «Sẽ KHÔNG làm / sẽ chặn» mang mã `OOS-n` (`scripts/gate-card.js:410-413`, `:909-910`),
  không nguồn, không ai quyết, và không buộc có dòng sổ đi kèm: dòng sổ chỉ ghi khi qua luật đáng-ghi (`SKILL.md:165`).
  Ô «để sau» và «không bao giờ» của bước quét đi về đúng mục này (`SKILL.md:326`).
- Bộ xếp «Kiểm VẬT (nguồn, con trỏ, khó-đảo) — không đọc nghĩa câu; nghĩa do phản biện context sạch soi»
  (`scripts/can-cu-s1.cjs:5`). Tầng nghĩa là một tác tử đọc. RS2 ghi một ca tác tử ấy được giao soi đúng việc này, bắt
  được hai con số mà sót câu loại thao tác.
- Không câu nào nói riêng rằng loại một thao tác vòng đời của thứ đang hiện trên màn thì không được là «máy quyết».
  Theo luật đã có, việc đó thuộc «nghĩa sản phẩm người dùng thấy» và lẽ ra đã là câu hỏi.

**7 ô máy tự loại chia theo đường đi:**

| Đường | Số ô | Kit hôm nay |
|---|---|---|
| Dòng sổ ghi «máy quyết» với câu trích chỉ liên quan | 3 | đã có luật, bộ xếp và người soi; lọt ở tầng nghĩa |
| Cùng hàng với ba ô trên, RS2 không tả rõ đường | 1 | chưa xếp được |
| Câu trong hợp đồng, ở mục «Out of scope» | 2 | chưa có cột nguồn hay ai quyết |
| Máy quyết, RS2 đánh giá căn cứ đủ | 1 | đúng thiết kế |

**Nếu nhận thì chạm.** Khuôn hợp đồng (mục «Out of scope») và khối `CARD-PLAIN-SCOPE` của `scripts/gate-card.js`; chỗ
ô «để sau» và «không bao giờ» đổ về hợp đồng (`SKILL.md` S1#3); ý 4 của bước phản biện. Đổi hình dạng mục «Out of scope»
là đổi schema: luật kit đòi đường đọc bản cũ và cờ vàng, không bắt kho tiêu thụ sửa hàng loạt. Riêng kho được đo đã có
46 hợp đồng viết gạch đầu dòng trơn.

---

## 4. Năm chỗ sửa RS2 viết sẵn — lời hay vật

RS2 mục 3.4 kê năm chỗ sửa gửi về kit. Hiến pháp kit cấm lấy lời dặn làm nghiệm cho một lớp lỗi lặp; cột giữa xếp
từng chỗ theo điều đó.

| # | Chỗ sửa (RS2 3.4) | Là lời hay vật | Vật máy giữ gần nhất, nếu muốn |
|---|---|---|---|
| 1 | Trục vòng đời là trục không được rút gọn | lời trong bộ trục | bảng vòng đời có marker trong khuôn đặc tả UX; bài kiểm rút marker đã có sẵn cho khuôn này |
| 2 | Hàng có màn không được bỏ quét bằng một dòng | lời trong skill | cờ trên thẻ khi hợp đồng có mặt người nhìn mà mục độ phủ là dòng bỏ; hai đầu vào thẻ đều đã đọc |
| 3 | Bước phản biện: thiếu vế của thứ đang hiện là lỗ của hàng | lời trong lời dặn tác tử | không có; tầng nghĩa, tác tử đọc |
| 4 | Thẻ: ô «máy quyết» không được chứa việc loại một thao tác vòng đời | lời, trừ khi máy nhận ra được «loại một thao tác vòng đời» | cần bảng vòng đời của #1 làm chỗ so: ô «không» của bảng phải trỏ một dòng sổ có tên người |
| 5 | Cắt lượt: cờ vàng khi câu giao một động từ | cờ dò chữ, đo từ vựng | trường khai vế thêm, sửa, bỏ cho hàng có màn; máy kiểm có mặt và con trỏ |

Đọc theo cột phải: bốn trong năm chỗ quy về **một** vật, là bảng «thứ trên màn × thêm · xem · sửa · bỏ» mà mỗi ô trỏ
một tiêu chí, một hàng khác, hoặc «không» kèm ai quyết. Kit chưa có vật ấy. Có nó thì luật 1 kiểm được bằng có mặt,
luật 3 có chỗ để so, luật 2 có nơi ghi «vế nào để hàng nào».

Vật ấy chạm ranh giới ba kho. «Màn này hiện thứ gì» là giá trị đứng yên, thuộc sổ màn của kho giữ thứ nhìn thấy. Bảng
trong hồ sơ của một vòng chỉ là phán xét của vòng đó về các thứ nó chạm. Khi kho tiêu thụ đã có sổ màn nối mô hình
nghiệp vụ, bảng của vòng nên **trỏ** vào sổ thay vì khai lại. Đó là «đề nghị hai» của bản gửi, xem §7.

---

## 5. Các lối và hệ quả

Nhận bất kỳ luật nào vào kit là CỘNG: chủ kho phê đích danh từng ca. Việc sửa kit đang đóng băng theo luật chiều rộng:
tối đa một vòng meta giữa hai mốc được một kho nhận, và chỉ khi chủ kho gọi tên. Bản này không xin mở vòng.

| Lối | Được | Mất / giá |
|---|---|---|
| **A. Nhận ba luật dưới dạng chữ** (năm chỗ sửa của RS2) | rẻ, vào được mốc kế; phiên nào đọc skill cũng thấy | vẫn là lời: kho được đo đã viết luật chữ ba lần mà vẫn rơi; đổi mặc định cho mọi kho, kể cả kho không có lỗi này |
| **B. Dựng một vật: bảng vòng đời + cờ trên thẻ + cột nguồn cho «Out of scope»** | luật 1 và 3 thành thứ máy giữ ở mức có mặt; luật 2 có chỗ ghi | một vòng meta có tên; đổi schema hợp đồng nên cần đường đọc bản cũ; thẻ Cổng Phạm vi dài thêm; mới có số của một kho (kho thứ hai chỉ có bằng chứng cho luật 2) |
| **C. Chưa nhận gì vào kit, đếm tiếp** | đúng luật đóng băng và luật «cân trên mọi kho»; hai phép kiểm sổ và phép kiểm máy của kho tiêu thụ chạy trước | 12 ô lớp này tiếp tục chỉ có chủ kho bắt; hôm nay là ba lượt trong hai ngày |
| **D. Kho tiêu thụ tự khai luật vào tệp luật sản phẩm của nó** | không đổi kit; có hiệu lực ngay ở vòng kế của kho ấy | chỉ kho nào khai mới có; luật kiểu này không viết được thành dấu hiệu trên mã, nên chỉ được nạp ở bước thiết kế, vẫn là tầng nghĩa |

Chi tiết lối D. Kho có `PRODUCT-INVARIANTS.md` ở gốc thì bước thiết kế đọc trọn tệp; lựa chọn trái một luật thành câu
hỏi «Phạm luật SP-n» trên thẻ Cổng Phạm vi, và bước phản biện đã soi «lựa chọn nào trái một luật … đã nạp mà sổ không
ghi» (`skills/acceptance/references/product-invariants-template.md`, `SKILL.md:296`, `:352`). Kho được đo đã có tệp ấy
với 3 luật; chưa luật nào về vòng đời. Tệp là của kho: chủ kho viết, máy không sửa.

**Cân trên mọi kho** (luật 26/09), cho lối A và B:

| Kho | Được | Mất |
|---|---|---|
| không có mặt người nhìn | — | 0 nếu điều kiện là «hợp đồng có mặt người nhìn»; lối A viết thành câu chung thì vòng nào cũng đọc thêm |
| có màn nhưng tính năng không xoay quanh một thứ (màn tổng quan, báo cáo) | — | một bảng phải điền «không áp dụng»; cần lối bỏ có vết, nếu không thành trạm thu phí |
| không dùng lộ trình | luật 1 và 3 | luật 2 phía cắt lượt không chạm tới |
| hành vi cũ có ai dựa không | — | có: mục «Out of scope» gạch đầu dòng trơn đang là dạng mọi hợp đồng dùng |

**Dự báo trên thước của kit**, nếu đi lối B (↑ ↓ =):

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong → ký | ↑ nhẹ | bước thiết kế điền thêm một bảng; thẻ Cổng Phạm vi thêm câu hỏi |
| ký → gộp | = | — |
| lượt gọi người ngoài thiết kế | ↓ | ô máy định loại lên thẻ ở cổng đã có, thay vì chủ kho tự bắt sau |
| chạm mỗi lượt ở Cổng Phạm vi | ↑ | mỗi ô «không» chưa có người chốt là một câu hỏi; hàng nhiều thứ trên màn thì nhiều câu |
| token · phút máy | = hoặc ↑ nhẹ | không thêm tác tử; thêm một bảng trong hồ sơ |

Dòng thứ tư là chỗ đánh đổi thật: luật 3 đổi lượt gọi ngoài thiết kế lấy số câu hỏi trên thẻ. Trần hiện hành là một
chạm mỗi lượt.

**Máy khuyên** (không phải quyết định): D ngay ở kho đang đau, vì không đổi kit và đảo được bằng một commit; C cho kit
tới mốc kế; và nếu sau đó lớp 12 ô còn tái diễn ở một kho thứ hai thì B, không A. Căn cứ: ít nhất ba trong bảy ô máy
tự loại đã lọt qua một luật chữ có sẵn, nên thêm chữ không phải là loại nghiệm khác.

---

## 6. Lệnh đo (đọc lại được)

```bash
# kit: ba chỗ RS2 trích còn đúng dòng ở main
git fetch origin && git rev-parse --short origin/main        # 644e9b49
sed -n '7p' skills/morphological-scan/references/entity-feature.md
grep -n -E 'BỎ quét|wishlist|QUYẾT được lựa chọn' feature-loop/skills/feature-loop/SKILL.md   # dòng 209 · 320 · 326 · 352
grep -rn -i 'rút gọn' skills/morphological-scan feature-loop/skills      # chỉ một dòng, ở bộ trục rủi ro, không liên quan
grep -rl -E 'wishlist|bỏ coverage-scan' tests evals                      # rỗng: không bài kiểm nào giữ hai câu ấy
grep -n -E '^tin_hieu:' _acceptance/config.yaml                          # rỗng: kit chưa khai cửa tín hiệu cho mình

# kho tiêu thụ (bản công khai): hợp đồng có mặt người nhìn mà bỏ quét
cd ~/dev/onehub-inventory && git rev-parse --short HEAD                  # 0861fdc
grep -h -E '^surfaces:' _acceptance/*/contract.md | sed 's/#.*//' | sort | uniq -c   # 23 dòng có ui, trên 46
for d in _acceptance/*/; do grep -q -E '^surfaces:.*\b(ui|web|web-ui)\b' "$d/contract.md" 2>/dev/null \
  && grep -q -i 'bỏ coverage-scan' "$d/decisions.jsonl" 2>/dev/null && echo "$d"; done | wc -l   # 8
```

**Giới hạn đã khai:**

- Các số 19, 7 · 5 · 7, «khoảng 14», «khoảng 10», «ba lần trong hai ngày» là của RS2, chép lại; phiên này không đếm lại
  từng ô. RS2 tự khai: phần «chỉ hứa trên giấy» là dự báo từ câu giao của các hàng chưa mở, và chưa đối chiếu ảnh màn.
- Phép chia 3 · 1 · 2 · 1 của 7 ô máy tự loại đọc từ mô tả của RS2, không mở lại sổ hay hợp đồng của từng hàng.
- Phần «phép kiểm sổ thấy 4 trong 7, nhắm 3» là lời của phiên gửi; phiên này không chạy các phép kiểm ấy.
- Số 8 trên 23 đếm bằng chuỗi «bỏ coverage-scan» trong sổ; dòng bỏ viết khác chuỗi ấy thì sót.
- Chưa chạy một vòng thử nào với luật mới, nên bảng dự báo ở §5 là suy từ thiết kế, không phải số đo.
- Bằng chứng ở kho thứ hai chỉ có cho luật 2. Luật 1 và 3 mới có số của một kho.

---

## 7. Để sau đợt chuyển nhà — đọc hai cuốn sổ thay vì khai lại

Bản gửi có một đề nghị thứ hai, **không đề nghị làm bây giờ**. Khuôn đặc tả UX của kit bắt mỗi vòng tự kê màn và bảng
trạng thái (`ux-spec-template.md`, mục 2 và 3). Kho giữ thứ nhìn thấy giữ sổ màn và bảng trạng thái của cả kho tiêu
thụ. Khi một kho đã có hai sổ ấy, bản đặc tả có thể trỏ vào dòng của sổ thay vì chép lại; kho chưa có thì giữ như cũ.
Phép đo máy cho đặc tả UX, đã cắt ngày 24/08 vì phải dò chữ
([hạt giống](../plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md)), có thể đo lại được bằng cách trỏ dòng.

Việc này chờ hai điều: phép kiểm sổ màn lên nhánh chính ở kho giữ thứ nhìn thấy, và đợt chuyển bộ công cụ sang kho mới
xong. Bản phát hành gần nhất, 2.39.0, ra từ kho này (CHANGELOG ghi 12/11; thẻ `v2.39.0` gắn 13/11); phiên này không
ghi gì vào kho mới.

---

## 8. Nguồn

- Kho tiêu thụ onehub-inventory: bản rà soát RS2 (14/11), mục «Nguyên nhân» và mục 3.4. Tệp nằm ngoài git của kho ấy.
- Repo Standards: trang ranh giới ba kho, mục «UX: kho nào mang gì»; bản đề nghị do phiên điều phối soạn 15/11.
- Kho giữ thứ nhìn thấy: đề bài và quyết định về sổ màn nối mô hình nghiệp vụ (chủ kho duyệt 15/11, đang ở một PR mở).
- Kit: các tệp và dòng trích ở §3, đọc ở `644e9b49`.
