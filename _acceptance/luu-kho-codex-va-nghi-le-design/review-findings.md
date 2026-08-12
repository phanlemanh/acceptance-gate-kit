# Rà soát đối kháng — vòng 1

*Ba phiên chấm độc lập, ba lăng kính (phép đo · gỡ-quá-tay · hợp đồng-đối-vật).
Người viết diff KHÔNG chấm diff của mình.*

## Verdict vòng 1: **REJECT**

Làn máy 19/19 xanh vẫn đúng như đã báo — nhưng nó xanh vì **đo cái dễ hơn cái
đã hứa**. Một phiên chấm đã chạy lại bộ răng ở HEAD và đầu ra trùng **từng
byte** với bằng chứng đã commit: phần "có chạy thật" là thật, vấn đề nằm ở
**chạy cái gì**.

Đây đúng là lý do chặng này tồn tại. Bốn đẳng thức số ca xanh không nói được gì
về việc các chân đo có sống hay không.

---

## A · Khẳng định SAI trong vật phát đi (nặng nhất)

**A1 — `layout-craft.md` khai một luật là "máy cưỡng chế" trong khi không script
nào cưỡng chế nó.** Câu vừa sửa: *"Where the design gate is wired, the spending
rule is machine-enforced (`design-gate.mjs` runs the layout-token-only check)"*.
Đếm có kiểm chứng trên ba tệp còn sống: `design-gate.mjs` **0 hit**
`layout-token`, `design-scan.js` **0 hit**. Luật `layout-token-only` chết theo
nghi lễ design-loop; tôi viết lại câu đó trỏ sang một checker **khác** mà không
kiểm nó có làm việc ấy không. Skill này **phát cho repo tiêu thụ** — người đọc
tin luật có răng trong khi không có.

**A2 — chú thích tôi thêm vào bộ sinh của một hồ sơ ĐÃ KÝ nay SAI tại HEAD.**
Tôi viết: *"Nhánh còn lại sinh ra y nguyên byte như bản đã commit, nên không có
dòng bằng chứng nào bị viết lại."* Hai commit sau, chính hai tệp bằng chứng ấy
bị viết lại (**+11/−12 dòng mỗi tệp**) khi tôi chạy lại bộ sinh sau khi sửa
SKILL. Chúng là bản ghi *chỉ dẫn thật đã đưa cho agent* trong một thí nghiệm đã
ký; nay chúng mang văn bản sau-lưu-kho, tức **bản ghi không còn nói cái đã
chạy**. Có đường khác mà tôi đã bỏ qua: bộ sinh đã được thêm nhánh bỏ-qua cho
harness vắng — nửa còn lại cũng chỉ cần không sinh lại.

**A3 — trang bằng chứng tuyên mạnh hơn vật.** Viết "Sáu chiều đỏ đã chạy thật"
rồi liệt kê **tám** món, trong đó ít nhất hai món không chạy (E5, E10).

---

## B · Chân đo không sống

**B1 — chiều đỏ của E10 là hằng-đúng, và không đi qua checker thật.** Nó nối một
dòng vào bản sao rồi `grep` tìm chính chuỗi vừa ghi. Tệ hơn: cấu hình **đã**
chứa chuỗi `mirror_sync` trong một dòng chú thích, nên bỏ hẳn bước tiêm thì
`grep` vẫn TRUE. Trình đọc khoá THẬT không bao giờ chạy trên bản sao. *(Hai
lăng kính độc lập cùng phát hiện.)*

**B2 — năm assertion của E10 là âm-tính-một-mình, và thông điệp XANH nói dối.**
Hàm kiểm chỉ soi HEAD, không dòng nào chạm mốc — nhưng in ra
*"vắng ở HEAD, **có ở tag** OK"*. Đổi một needle sang chuỗi chưa từng tồn tại →
5/5 xanh, người đọc log tin đối chứng dương đã chạy.

**B3 — chiều đỏ của E5 và E11b khai "CHẠY THẬT" nhưng chưa từng chạy.** Đầu ra
in «lưới trên **sẽ** ĐỎ» — thì tương lai trong chính bằng chứng là dấu vết.

**B4 — E4, phép đo mang lời hứa lớn nhất, không có chiều đỏ nào chạy qua chính
nó.** Hai khối "ĐỎ-NGOÀI-DANH-SÁCH" đều dựng trình quét RIÊNG, không gọi hàm
quét thật, không chạm phạm vi hay danh sách miễn trừ. Hàm quét thật có
`2>/dev/null` và `|| true`: gõ nhầm một mục phạm vi → grep im lặng → in
`HEAD=0 … OK` cho cả 8 needle. Đối chứng dương không cứu được vì nó dùng **một
danh sách đường dẫn hardcode riêng**, không suy từ phạm vi — hai danh sách trôi
khỏi nhau mà không ai biết.

**B5 — miễn trừ che TRỌN TỆP cho cả 8 needle, chân ngoài-danh-sách chỉ phủ 1
needle. Đã có vật lọt thật:** needle `sync-plugin-packages` hiện có **đúng 1 hit
sống** ở `.claude-plugin/plugin.json:4`, xanh **chỉ nhờ** miễn trừ. Đặt con trỏ
sống tới bất kỳ vật đã lưu kho nào vào ba tệp được miễn trừ → cả ba lưới đều
xanh.

**B6 — E1 đo từ vựng thay vì quan hệ.** Chân "mốc đã đẩy" quét cả khối trả về
tìm sha, không tìm `refs/tags/<tên mốc>`. Một mốc khác trỏ cùng commit làm chân
này xanh trong khi mốc này chưa hề được đẩy — tức đường đảo mà hai ADR viện dẫn
không tồn tại trên remote. Sửa rẻ: ghim `refs/tags/`.

**B7 — E15 đo hình dạng mã, không đo hành vi AC-15 hứa.** AC-15 hứa: tiêm ca đỏ
ở ĐẦU tệp, chạy TRỌN bộ kiểm, đòi chạy tới ca cuối. Thực tế chỉ đếm số khối
`exit` theo **đúng một hình dạng thụt lề**. Khối nuốt-ca quay lại dưới dạng
`    exit 1`, `exit "$failures"` hay `return 1` thì lưới mù — đúng lớp lỗi nó
sinh ra để chặn.

**B8 — bánh cóc chống hạ-thước chỉ đếm dòng Python `assert `.** 26 ca bị xoá
gồm rất nhiều `grep -q`, `fail`, `die`, `run` — toàn bộ phần đó ra khỏi cây mà
bánh cóc không thấy. Nên "105 dòng đã khai" không phải bản kiểm kê của đợt gỡ,
chỉ là phần Python của nó. Thêm hai lỗ: dòng khai không khớp gì đi qua im lặng
(có thể nạp sẵn cho đợt gỡ sau), và chú thích thụt lề thành dòng khai hợp lệ.

**B9 — chiều đỏ của E2 được thoả bằng `mkdir`, không bằng bản chép từ mốc.**
Thư mục được tạo TRƯỚC khi giải nén; nếu giải nén hỏng thì thư mục rỗng vẫn
làm chiều đỏ xanh. Hai lần `2>/dev/null` nuốt sạch dấu vết.

**B10 — thông điệp ghim của E12/E7/E14 không tồn tại trong bất kỳ mã nào.**
Không script nào assert đẳng thức số ca. Con số 145 chỉ suy được bằng **đếm
tay**. Nên AC-11 — trụ cột chống gỡ-quá-tay của cả hồ sơ — hiện là **phép đo do
người đếm**, không phải lưới máy. Lần chạy sau mất 20 ca vẫn in "all plugin
tests passed" và trả 0.

---

## C · Sửa-sau-Cổng-1 không khai

**C1 — mảng needle co từ 11 xuống 8 và phạm vi quét bỏ `tests/`.** Hợp đồng
khai 6 lần sửa; đây là lần thứ **bảy** và **tám**, lý do chỉ nằm trong chú
thích của script. Quan hệ nhân quả: cắt `tests/` ⇒ hai needle cho tag=0 ⇒ phải
bỏ chúng.

**C2 — bản sửa AC-4 đòi BỐN needle `plugins/…` cộng một chân đỏ-ngoài-danh-sách;
có đúng MỘT needle, chân đỏ không tồn tại.**

**C3 — miễn trừ thứ BA không khai trong hợp đồng, không có chân đỏ.**

---

## D · Mất độ phủ

**D1 — `P178` bị XOÁ trong khi ba ca anh em cùng cụm đã TRIM thành công** trong
chính đợt này. Trim là khả thi; xoá là lựa chọn bất đối xứng. Bằng chứng nó để
lại lỗ: bộ sinh của workspace ấy vẫn trỏ một đường dẫn không còn tồn tại, và
không phép đo nào nhận ra.

**D2 — lời khai mở đầu sổ `asserts-da-go.txt` bao quát hơn sự thật.** Header
tuyên toàn bộ thuộc nhóm "chỉ tồn tại vì" vật đã lưu kho; ít nhất 4 dòng không
thuộc nhóm đó (một sàn tỉnh-táo trên cây nguồn bị hạ, ba assert chết vì AC-5
khai tử một nhánh chứ không vì lưu kho).

**D3 — P84/P86: sau khi bỏ site thứ hai, "đối chứng âm" còn lại là hằng-đúng**
(xoá chuỗi rồi hỏi chuỗi có còn không). Răng thật của hai ca là luật vị trí, và
luật đó **không có chiều đỏ nào**. Trước đợt này còn lưới phụ lệch-giữa-hai-bản;
nay chỉ còn 1 site nên không còn gì đỡ.

**D4 — vế "chốt phải nằm trong lưới" của `P162` biến mất, không thay bằng gì**
— trong khi cấu hình vừa THÊM một khoá trỏ script của một hồ sơ và GỠ một khoá
khác. Lớp lỗi "ca sống trong tệp không lưới nào gọi" đã có tên trong kho.

---

## E · Ngoài hợp đồng — việc của người quyết

**E1 — bộ kiểm gói mất ~106 assert, trang bằng chứng không nhắc.** Đẳng thức số
CA **mù với xói mòn ở mức ASSERT** theo đúng cấu tạo: một ca giữ nguyên dòng
`PASS:` trong khi mất phần lớn assert bên trong.

**E2 — chưa bump phiên bản, và một gói biến khỏi marketplace dưới chân người đã
cài.** Manifest vẫn đúng số cũ trong khi nội dung đổi lớn — sổ nhớ của kho ghi
lớp lỗi này: lệnh cập nhật **bỏ qua khi số trùng mà nội dung đổi**. Không có
một chữ nào về bump, đường phát hành, hay thông báo cho đội.

**E3 — xung đột với hồ sơ anh em nằm sai chỗ** (có trong Notes của hợp đồng,
không có trong "Giới hạn đã biết" của trang bằng chứng — người ký đọc trang
bằng chứng).

**E4 — sổ chạy: lượt ĐỎ bị GHI ĐÈ thay vì nối thêm**, hai lượt dùng chung
`round`/`run_id`, và cả 19 dòng mang **cùng một mốc giờ** (mốc giờ là viết ra,
không phải đo). Sha trong sổ cũng lệch HEAD.

**E5 — đẳng thức của suite `scripts` đứng trên một bộ đếm tự khai là thiếu 41
ca.** Không phải lỗi mới của đợt này, nhưng nếu Cổng 2 định trích "664 = 671 − 7"
làm bằng chứng thì nên biết nó đo cái gì.

---

## F · Điều rà soát KHÔNG tìm thấy (ghi để cân bằng)

- **Danh sách CẤM ĐỤNG còn nguyên** — cả 9 vật, diff rỗng.
- **Không có ca xanh rỗng nào còn lại**; không còn tham chiếu chết nào trong bộ
  kiểm.
- **Không có dấu hiệu con số bị chỉnh sau khi thấy kết quả đo.** Cả ba lần đổi
  (147 → 146 → 145) đều có dẫn xuất bằng danh sách ca gọi tên, và hai commit
  chốt số đều **trước** commit đo xanh. Ba lần đó làm phép đo **đúng hơn**.
- **Phần lớn 26 ca xoá là sạch**; một ca còn trùng lặp hoàn toàn với ca đang
  sống trên nguồn.
- **Ba bẫy needle được xử đúng** (`plugins/` trần, `P30` trần, `.agents` trần).
- **Một hằng số hạ có lý do tốt nhất đợt**: nửa ma trận chết theo một harness,
  sàn gốc giữ nguyên để canh bảng khai, và dòng in nêu rõ bao nhiêu ca bị bỏ
  qua — fail-closed.
