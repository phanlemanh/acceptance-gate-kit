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

---

# Rà soát đối kháng — vòng 2

*Ba phiên chấm độc lập, cùng ba lăng kính vòng 1 (phép đo · gỡ-quá-tay ·
hợp đồng-đối-vật), context sạch, chấm trên worktree riêng tại đúng ngọn
`3dcd57f`. Người viết vòng sửa KHÔNG chấm — chỉ dựng môi trường và tổng hợp.*

## Verdict vòng 2: **REJECT**

Luật tổng: bất kỳ P0 ở bất kỳ lăng kính nào → REJECT. **Cả ba lăng kính đều
REJECT**, tổng **4 P0 · 7 P1 · 3 P2** sau khi gộp trùng.

Vòng sửa 1 **đã chữa đúng** lớp lỗi nặng nhất của vòng 1 — cả ba phiên chấm
độc lập xác nhận điều này, và hai phiên còn ghi riêng một mục «cố bác mà không
bác được»:

- 14 dòng `[đột biến]` là **thật**: mỗi dòng chạy lại chính hàm kiểm trên bản
  sao bị tiêm, có đối chứng dương chạy trước. Lớp B1/B2/B3/B6/B9 đóng.
- Bốn đẳng thức số ca có chân máy thật và **khớp từng con số khi đo độc lập,
  không qua `so-ca.sh`** — kể cả `diff` danh sách TÊN ca hai đầu (không có ca
  nào biến mất được che bởi một ca mới thêm).
- A1 (`layout-craft.md`) nay nói đúng với vật; 9/9 vật CẤM ĐỤNG băm y hệt mốc;
  không khoá `config:executors.*` nào chết; re-pin lần 10 hợp nghi thức.
- AC-19 đo lại tại `d6044a4`: `FAIL: JR11b` thật sự nằm trong
  `core-untouched.test.mjs` trong khi suite in `664 passed, 0 failed`. Bug có
  thật, bản vá đúng, 21 slug allowlist khớp đúng 21 slug đỏ đo được.

Nhưng vòng 2 đỏ ở **lớp khác**, và đó là chỗ đáng lo: **phạm vi phép đo hẹp hơn
lời hứa**, cộng hai lần **tái phạm nguyên văn** lớp lỗi vòng 1 vừa bắt.

---

## P0 · Bốn lỗ chặn

### F1 — `.codex-plugin/` là vế thứ BẢY của AC-2 và không có một dòng mã nào canh
*Cả **BA** lăng kính tìm ra độc lập.*

`contract.md:50-58` khai **bảy** đường dẫn phải vắng, kèm đối chứng dương «cả
bảy đều tồn tại ở mốc». `evals.yaml:53-58` khai *«mảng SÁU vật lưu kho»*.
`luu-kho-rang.sh:113` `GONE=(codex tests/codex scripts/codex-self-script-refs.tsv
.agents design-loop tests/design-loop)` — **sáu**. Đầu ra in `LUU-KHO-PATH: 6/6`.

Phép đo **âm thầm co về sáu** mà KHÔNG có dòng `[SỬA SAU CỔNG 1]` nào — trong
khi hợp đồng ghi chú tỉ mỉ mọi lần co phạm vi khác (needle 11→8, bỏ `tests/`).

Nặng nhất vì vế thứ bảy chính là vế **được thêm sau Cổng 1 để chữa một cái sót
có thật**: `contract.md:54-58` viết *«đợt gỡ 197 file bỏ sót nó thật — manifest
Codex ở gốc repo còn nguyên trên cây»*. Vế sinh ra từ một lần sót lại là vế duy
nhất không ai đo.

**Kịch bản fail** (đã chạy thật): `git archive truoc-luu-kho-2026-08 .codex-plugin
| tar -x` vào bản sao → `LUU-KHO-PATH: 6/6 vang o HEAD, co o tag OK`,
`LUU-KHO-RANG: tất cả phép đo xanh`, RC=0. AC-4 không với tới vì `.codex-plugin/`
không nằm trong `SCOPE` (`luu-kho-rang.sh:207-208`). Đường vào có thật: hồ sơ
anh em `cat-hinh-thuc` tách từ `daa9b3d` (`contract.md:403`), **nơi tệp đó còn
nguyên** — một lượt merge/rebase là đủ.

### F2 — `if so_ca_run … | sed` nuốt mã thoát: ĐỎ được in ra thành `OK`
`luu-kho-rang.sh:767`. Trạng thái pipeline là trạng thái của `sed`, luôn 0 →
nhánh `else bad "so-ca.sh --suite hooks DO"` (`:789-791`) là **mã chết**.

Chân (b) của E12 là bằng chứng DUY NHẤT rằng bộ đếm AC-11 còn sống. Mọi kiểu đỏ
của `so-ca.sh` — số ca lệch, có ca đỏ, suite trả rc≠0 — đều đi qua như xanh, và
câu chẩn đoán bị dán nhãn `OK` ngay trong trang bằng chứng.

**Kịch bản fail** (đã chạy): tiêm `exit 7` vào `tests/hooks/run-tests.sh` →
```
  OK   LUU-KHO-SUITE: hooks du 54 ca, 0 ca do, nhung suite tra rc=7 — ha tang hong
  OK   LUU-KHO-SUITE: 1 dang thuc so ca DO
LUU-KHO-RANG: tất cả phép đo xanh          RC=0
```
**Cùng LỚP** với `check "$(basename "$_f")" 0 $?` mà chính vòng sửa này ghim
thành **AC-19**. Lớp lỗi được ghim ở một tệp và tái sinh ở tệp bên cạnh, trong
cùng một lượt.

### F3 — AC-4 khai BỐN needle `plugins/…`, mã có đúng MỘT
`luu-kho-rang.sh:223-224` vs `contract.md:71-79`. Hợp đồng: *«`plugins/acceptance-gate`,
`plugins/feature-loop`, `plugins/design-loop`, và glob `plugins/**`»*. `NEEDLES`
chỉ mang `plugins/acceptance-gate`.

**Đây là finding C2 của vòng 1, tái phạm NGUYÊN VĂN** — không đổi da, không đổi
số. Cả ba needle thiếu đều có `>0` hit ở mốc (`plugins/feature-loop`=1,
`plugins/design-loop`=1, `plugins/**`=4), nên đối chứng dương mà chính script
đòi là sẵn có; không có lý do kỹ thuật nào để bỏ.

**Kịch bản fail** (đã chạy): thêm một dòng trỏ `plugins/feature-loop/skills/…`
vào `GUIDE.md` → `LUU-KHO-REF: 8/8`, RC=0. 125 tệp mirror vừa xoá vẫn có thể
được trỏ tới từ tài liệu phát đi mà không lưới nào kêu.

### F4 — E7 ghim một thông điệp cây KHÔNG BAO GIỜ in, và chuỗi đó được VIẾT MỚI trong chính vòng sửa này
`evals.yaml:226-232` đòi `"LUU-KHO-SUITE: scripts 671 -> 664 OK"` và
`Results: 664 passed`. Cây in `671 -> 686` / `686 passed`. Khối máy-đọc
`SO-CA-KY-VONG` (`contract.md:230`) ghi `scripts | 671 | 686`; AC-11, E19 và
bảng «Số đo» đều ghi 686 — **chỉ E7 còn 664**.

Chuỗi `671 -> 664` KHÔNG có ở vòng 1; nó được **thêm mới ở commit `b69c90dc`**
(vòng sửa 1), cùng commit đổi đẳng thức sang 686. Và mục `[SỬA SAU CỔNG 1]` của
E7 (`evals.yaml:238-243`) còn tự chứng nhận rằng `so-ca.sh` *«đỏ đúng thông điệp
đã hứa ở dòng trên»*.

Nó không đỏ được vì `ghi-so-chay.mjs:115` chỉ ghi
`{ts, sha, round, evalId, run_id, exit_code, cmd}` — **không có trường `output`**,
dù mọi eval khai `evidence_required: [… , output]`. Hệ quả tổng quát: lời hứa
thông-điệp của **23 eval** hiện chỉ được kiểm bằng mã thoát.

---

## P1 · Bảy lỗ phải xử trước khi ký

| # | Lỗ | Vị trí | Kịch bản fail |
|---|---|---|---|
| F5 | Chân "wire" chỉ grep TÊN khoá, không kiểm khoá CHẠY gì | `luu-kho-rang.sh:754-762` | Đổi giá trị `luu_kho_so_ca_plugins` thành `bash tests/plugins/run-tests.sh` → bộ đếm biến mất khỏi làn, chân vẫn in `4/4 dang thuc duoc wire OK` |
| F6 | `P162` bị XOÁ TRỌN dù còn vế sống; sổ thi công xếp nhầm vào «không mất độ phủ» | `nhat-ky-thi-cong.md:57-60` | Lưới «mọi `suite_key` phải resolve» rời bộ kiểm thường trực. Tiêm khoá ma → 4 suite + `product-map` + `pre-merge-check` xanh trọn, 0 VIOLATION |
| F7 | 69 assert bị gỡ nằm NGOÀI cửa sổ bánh cóc và không khai ở đâu | `tests/plugins/asserts-da-go.txt`, mốc `044968e` | Bánh cóc so với mốc 06/08; mọi assert sinh sau đó gỡ được lặng lẽ. **Đã xảy ra thật**: 36/69 dòng thuộc `P162`, gồm chính assert của F6 |
| F8 | Sổ chạy thiếu trường `output` | `ghi-so-chay.mjs:115` | 23 eval khai `evidence_required: [output]`; không eval nào được so bằng thông điệp. Là nguyên nhân F4 sống sót |
| F9 | «Hai tệp bằng chứng trả về **đúng byte** lúc ký» — sai | `evidence-report.md:101` | Chữ ký ở `8a53ab6a`; blob lúc ký ≠ blob tại HEAD, `git diff` 20 dòng mỗi tệp. Bản phục hồi trỏ trạng thái *ngay trước hồ sơ này*, cách lúc ký bốn lượt tái sinh |
| F10 | `GUIDE.md:5` khai khớp `1.18.0/1.14.0` | `GUIDE.md:5` | Chính hồ sơ bump lên `1.41.0/1.28.0` và viết lại đúng dòng đó. Người ở repo tiêu thụ đọc dòng thứ năm rồi không cập nhật — vô hiệu hoá đường phát hành AC-16 vừa dựng |
| F11 | Miễn trừ đo SỐ DÒNG + TÊN TRƯỜNG, không đo dòng đó còn là sử liệu hay đã thành chỉ dẫn sống | `luu-kho-rang.sh:256-259`, `:384-395` | `description` là JSON một-dòng nên `grep -c` = 1 bất kể chứa gì. Biến nó thành chỉ dẫn cài đặt trỏ `sync-plugin-packages.sh` đã xoá → cả lưới im. Tiền lệ có sẵn: chính commit này viết `NOTE FOR UPGRADERS` — chỉ dẫn thì hiện tại — vào trường được miễn trừ với tư cách «lịch sử» |

## P2 · Ba chỗ nói mạnh hơn vật

- **F12** `evidence-report.md:44` mời kiểm chứng bằng `grep -c '[đột biến]'` —
  trong BRE đó là **lớp ký tự**, chạy ra **90** chứ không phải 14 (`grep -cF`
  mới ra 14). Cùng bảng, `:38` ghi «16 nhóm chân» trong khi bộ răng in **15**.
  Câu này tồn tại để người ký khỏi phải tin số, và nó chạy không ra số đã khai.
- **F13** `tests/scripts/run-tests.sh:1392-1393` — chú thích ngay tại vết mổ nói
  *«bộ đếm đi từ 671 xuống 664»*, trong khi số chốt của **cùng commit** là 686.
  Bản chép thứ hai của mẫu số, nằm trong comment.
- **F14** `evidence-report.md:118` mở bằng «**Bốn mục** cố ý không sửa» rồi liệt
  kê **sáu**.

---

## Luật dừng-vá ÁP VÀO ĐÂY

`evidence-report.md:185-187` của chính hồ sơ này khai luật đó. Vòng 2 thoả điều
kiện kích hoạt, và thoả **ba lần**:

1. **F3 tái phạm NGUYÊN VĂN** finding C2 vòng 1 (4 needle khai / 1 có).
2. **F2 cùng LỚP** với bug được ghim thành AC-19 trong chính vòng sửa này —
   runner nuốt mã thoát, chữa ở `tests/scripts/run-tests.sh` rồi tái sinh ở
   `luu-kho-rang.sh` cùng lượt.
3. **F4 + F9 + F10 cùng LỚP** với A2/A3/B10 vòng 1 — khẳng định trong vật phát
   đi mạnh hơn vật, và thông điệp ghim không tồn tại.

Hình dạng chung của cả ba: **không phải phép đo chết, mà phép đo có phạm vi hẹp
hơn lời hứa** — hợp đồng nói bảy, mã đo sáu; hợp đồng nói bốn, mã đo một; eval
hứa một chuỗi, sổ chạy chỉ ghi mã thoát. Vá từng chỗ sẽ lại đẻ hình dạng thứ N+1,
đúng như luật dự đoán.

**Vì thế biên bản này DỪNG ở mô tả, không kèm bản vá.** Ba đường ra là việc của
owner, ghi ở gói trình Cổng 2.

## Phụ lục — phép đo của phiên chấm

Cả ba phiên chạy qua `su - tester` với `NODE_EXTRA_CA_CERTS=/opt/ccr-ca.crt`,
trên worktree riêng, dọn sạch sau khi đo. Ba bẫy môi trường được cảnh báo trước
và cả ba phiên đều tránh được: chạy bằng `root` cho `P123`/`P129`/`P161` đỏ giả;
CA không đọc được làm số ca đếm ra 146 thay vì 145; clone shallow làm
`pre-merge-check` báo 31 vi phạm giả.

Số ca đo độc lập tại `3dcd57f`: plugins **145** · workflows **463** (6 tệp cộng
lại) · scripts **686** · hooks **54** — khớp bản khai từng con số, và cả bốn vế
`truoc` (173/488/671/54) cũng đo lại đúng tại mốc.

---

# Rà soát đối kháng — vòng 3

*Ba phiên chấm độc lập, cùng ba lăng kính, context sạch, chấm trên worktree
riêng tại ngọn nhánh 1b sau vòng sửa 2 «một-nguồn». Người viết vòng sửa KHÔNG
chấm — chỉ dựng môi trường và tổng hợp.*

## Verdict vòng 3: **REJECT**

**Cả ba lăng kính REJECT**, tổng **7 P0 · 5 P1 · 3 P2** sau khi gộp trùng.

Vòng sửa 2 **đã đóng thật** những gì nó nhắm, và cả ba phiên xác nhận độc lập:
bốn đẳng thức số ca khớp từng con số khi đo không qua `so-ca.sh` (146 · 463 ·
686 · 54, và cả cột `truoc`); diff tên ca `d6044a4`→ngọn cho **0 mất, 1 thêm**
(`P195`) ở `plugins` và **0 mất** ở ba suite còn lại; F2 đóng và **không còn một
pipeline nào khác** nuốt mã thoát; hai tệp bằng chứng đã ký **byte-equal**
`a8767168`; re-pin lần 11 hợp nghi thức trọn bốn vế; 9/9 vật CẤM ĐỤNG byte-equal
mốc; **không có lưới thứ hai bị gỡ kèm ca đo nó** — một phiên đọc từng ca trong
27 mã bị xoá, rút mọi đường dẫn trong thân ca rồi kiểm tồn tại tại ngọn.

Nhưng vòng 3 đỏ, và nó đỏ theo **một hình dạng duy nhất, lặp lại ở ba tầng**:

> **Bản vá đóng được nửa mà nó chạm tới, và để nguyên nửa kia.**
> · Vòng sửa 2 đổi bất biến ở phía **MÁY** (khối máy-đọc, `pinned:`) và để
>   nguyên phía **VĂN XUÔI** → hợp đồng/eval nay có hai bản khai chỏi nhau ở
>   **đúng bốn chỗ vòng 2 đã chỉ mặt**.
> · `pinned:` cưỡng chế được trường **VẮNG** và không cưỡng chế được trường bị
>   **RỖNG-HOÁ**.
> · Khối liệt kê có chiều đỏ cho **THÊM** và không có cho **XOÁ**.
> · `P195` trả lại **cái tên** của lưới và chưa trả lại **cái răng**.

---

## P0 · Bảy lỗ chặn

### Nhóm A — văn xuôi không đổi theo máy (G1–G4)
Bốn chỗ, cùng một cơ chế: vòng sửa 2 sửa khối máy-đọc và `pinned:`, để nguyên
bản văn mà người đọc gặp trước.

| | Vật | Khai | Cây thật |
|---|---|---|---|
| **G1** | `evals.yaml:56-60` (E2) | «mảng **SÁU** vật», dòng đếm `6/6` | in một dòng `7/7 … (danh sach doc tu khoi VAT-LUU-KHO)` |
| **G2** | `evals.yaml:105-107,119-122` (E4) | dòng đếm `8/8`, và một mảng «MƯỜI MỘT» **khác tập** (còn `mirror_sync`, `/design-push`, `P30`, `plugins/` trần) | `11/11`, tập trong khối `NEEDLE-CHET` |
| **G3** | `evals.yaml:404-407` (E12) | «số dòng `PASS:` bằng đúng **145**, `145 = 173 − 26 − 2`» | **146**; `pinned:` của chính E12 ghi `146` |
| **G4** | `evidence-report.md:97-99` | «vòng này in **14** dòng… con số 14 đếm được từ đầu ra (`grep -cF`)» | **17**; dòng `:93` cùng file đã ghi 17 |

**G1 và G2 nằm ở đúng dòng mà biên bản vòng 2 cite làm bằng chứng cho F1 và F3.**
**G4 là F12 tái phạm trên chính câu vừa sửa vì F12.**

*Kịch bản fail chung, đo được:* người bảo trì đọc `expected` — nơi hợp đồng bảo
họ tìm lý do «từng needle một» — thấy hai bản khai chỏi nhau. Đường sửa rẻ nhất
lúc đó là đồng bộ **khối theo bản văn**: co `VAT-LUU-KHO` về sáu (mở lại F1
nguyên văn) hoặc chép tập cũ vào `NEEDLE-CHET` (làm cả lưới đỏ vì thước). Với
G3 còn gắt hơn: hợp đồng viết *«đo ra khác 146 ⇒ đi tìm ca gỡ nhầm, KHÔNG sửa
số»*, mà bản văn duy nhất giải thích đẳng thức lại chỉ về phía ngược lại — đi
xoá `P195`, tức gỡ đúng cái lưới vừa được trả lại vì F6.

### G5 — vế `pinned:` của AC-20 fail-OPEN, và chiều đỏ nó tự khai KHÔNG TỒN TẠI trong mã
`ghi-so-chay.mjs:63-68` · `evals.yaml:624-626`

Regex `/^\s*-\s+"(.*)"\s*$/`. Viết chuỗi **không nháy** — YAML hợp lệ, và chính
tệp này dùng scalar trần ở chỗ khác — thì `pinned` thành `[]` **im lặng**,
recorder exit 0 **dù lệnh thoát 1**. Fail-closed chỉ bắt trường VẮNG.

Nặng hơn: `evals.yaml:624-626` khai *«chiều đỏ của nó chạy trên một workspace
thử dựng bằng CODE trong chính lượt kiểm»*. Không có mã nào như thế —
`grep -rn "LOI HUA THONG DIEP"` toàn cây cho đúng **2 hit**: `ghi-so-chay.mjs:173`
và chính câu khai này. Chiều đỏ ấy được chạy TAY một lần rồi khai như thể có
trong cây. Đây là lớp **B3 của vòng 1** («khai CHẠY THẬT nhưng chưa từng chạy»).

Cũng không lưới nào canh: `luu-kho-rang.sh` **không có dòng nào** chạm
`ghi-so-chay.mjs` (grep 0 hit), không eval nào chạy nó (`cmd` của E20 là
`luu_kho_rang`), và kit không đọc `pinned_missing`.

*Bằng chứng:* recorder trên bản sao có `pinned` không nháy → `rc=0`, dòng log
`"exit_code":1 … "pinned":[],"pinned_missing":[]`. Đối chứng dương cùng bản sao
với chuỗi CÓ nháy → `rc=1` đúng câu.

### G6 — chuỗi ghim không đo điều eval hứa (4/24 eval); một cái có mặt trong CẢ đầu ra ĐỎ
`evals.yaml:393` (E11) · `:563` `:588` `:606` (E17/E18/E19)

· **E11**: `expected` hứa *«stdout "PRODUCT-MAP.md khớp hồ sơ xưởng." … không tin
mã thoát»*; `pinned` chỉ ghim `"PRODUCT-MAP.md"`. Đo thật: bản xanh in
`PRODUCT-MAP.md khớp hồ sơ xưởng.`, bản lệch in `PRODUCT-MAP.md lệch với hồ sơ
xưởng…` — **cả hai đều chứa chuỗi ghim**. Ghim hằng-đúng: nó phân biệt được
«script chạy» với «script không chạy», không phân biệt XANH với ĐỎ.
· **E17/E18/E19**: cả ba ghim **lại đúng chuỗi của E7**. Lời hứa thật của E17
(«suite in các dòng `PASS: RS01…RS06`») **không thể** vào tầm máy: bộ đếm chỉ in
4 dòng tổng kết — bản ghi vòng 4 của E17 dài **197 byte**, `'RS01' in output`
= False. Đổi tên `RS01`→`ZZ01` ở 8 chỗ → `scripts 671 -> 686 OK`, mọi phép đo
xanh, `grep -c RS01` = 0.

**Đẳng thức số ca buộc được SỐ LƯỢNG, không buộc DANH TÍNH.** Một lượt tráo
assert-đổi-assert giữ nguyên 686 thì AC-17/18/19 mất lưới mà cả bộ vẫn xanh.

### G7 — `P195` không đo cái tên nó và cái hợp đồng nói
`tests/plugins/run-tests.sh:3683-3733` · `contract.md:315-316`

`walk()` trả về chuỗi lệnh và **không hề kiểm tệp tồn tại**. «Lệnh CÓ THẬT»
trong thực tế chỉ là «khoá YAML có giá trị khác rỗng».

*Kịch bản fail — đúng hình dạng hồ sơ này vừa làm:* gỡ một script mà để lại khoá
`executors.*` trỏ nó. Mốc có `executors.script.mirror_sync:
"bash scripts/sync-plugin-packages.sh --check"` trong `suite_keys`, và script ấy
bị xoá trong đợt. Lưới xanh, rồi mọi vòng verify sau chết vì hạ tầng giữa vòng
lặp — **đúng cái F6 nói lưới sinh ra để chặn**.

*Bằng chứng (đột biến trên bản sao trọn cây, có đối chứng dương):* base
146/146 xanh → đổi `product_map` thành `node scripts/DA-BI-XOA-KHONG-TON-TAI.mjs
--root . --check` → **vẫn 146/146 xanh**, và ca in `PASS: P195 moi
feature_loop.suite_key resolve ve mot lenh co that`.

`contract.md:316` là văn bản **sắp được ký**: *«lưới mọi `suite_key` phải resolve
về một lệnh có thật»*.

---

## P1 · Năm lỗ

| # | Lỗ | Vị trí | Kịch bản fail |
|---|---|---|---|
| **G8** | Khối liệt kê có chiều đỏ khi **THÊM**, không có khi **XOÁ** | `luu-kho-rang.sh:187-205` | Xoá `\| .codex-plugin \|` khỏi hợp đồng → `LUU-KHO-PATH: 6/6 OK`, RC=0, trong khi văn AC-2 vẫn khai bảy. **Trạng thái cuối y hệt F1**, đạt bằng một dòng sửa. Xoá một needle → `10/10` xanh, mồi mồ côi không ai kêu. Đáng chú ý: `SO-CA-KY-VONG` — khối duy nhất vòng 2 không đục thủng — CÓ buộc khối↔văn xuôi bằng máy (`:972`); hai khối MỚI không có |
| **G9** | Chân wire vẫn nửa là grep TÊN, và `gia_tri_khoa` đọc sai nhánh YAML | `luu-kho-rang.sh:858-884` | (a) đổi `cmd:` của E12 sang khoá khác → bộ đếm rời làn, nhưng `:878` grep chuỗi khoá trong `evals.yaml` mà chuỗi ấy còn trong **văn xuôi** `expected` → `4/4 OK`. (b) `index(line,k)==1` đọc dòng đầu mang tên khoá ở **bất kỳ nhánh nào**; đặt khoá trùng tên dưới `executors.test` → bộ răng `4/4 OK` trong khi recorder resolve ra lệnh hỏng. Hai trình đọc, hai kết luận |
| **G10** | `P195` chỉ trả lại **vế một** của `P162`/E6 | `run-tests.sh:3683` vs `daa9b3d:…L7519-7537` | E6 gốc có 5 vế; `P195` có (1)(2)(3), thiếu (4) «chốt phải nằm TRONG lưới» và (5) ca âm thật. Sau merge, dời `P195` sang tệp không khoá nào gọi → không gì đỏ. **Đây là finding D4 của vòng 1**, chưa sửa, chưa khai known-limit |
| **G11** | `GUIDE.md` còn **chỉ dẫn sống** trỏ vật đã lưu kho | `GUIDE.md:193`, `:199` | `:193` «Bump version + sync mirror thuộc S3» — không còn mirror, không còn script sync. `:199` «xem case P03/P22 của kit» — `P03` bị xoá trong CHÍNH đợt này. Lọt vì từ vựng mirror đã rời khối `NEEDLE-CHET`, nên lý do mở rộng phạm vi mà `contract.md:104-107` viện dẫn **nay không còn một dòng mã nào**. Tệp này đã bị sửa ở vòng 2 (F10), 188 dòng phía trên chỗ hỏng |
| **G12** | `E20` tự khai hai con số về chính nó, cả hai sai | `evals.yaml:618-623` | «round-trip **cả hai khối**» — chỉ `VAT-LUU-KHO` có; `NEEDLE-CHET` và `SO-CA-KY-VONG` đọc thẳng nhưng không có đột biến. AC-20 đòi round-trip cho cả ba. «vòng 4 (**23** eval)» — sổ có **24**. E20 là eval của tiêu chí owner phải gạch ở Cổng 2 |

## P2 · Ba chỗ

- **G13** Recorder không lấy mã thoát của lệnh làm phán quyết (`ghi-so-chay.mjs:135`
  đếm `anyRed` rồi không dùng), và `appendFileSync` chạy TRƯỚC `exit(1)` — lượt
  ĐỎ vẫn để lại `run_id` trích dẫn được, mà cổng không đọc `exit_code` hay
  `pinned_missing`.
- **G14** Bản khai phạm vi mới của `asserts-da-go.txt` sai ở nửa NGOÀI cửa sổ:
  khai gỡ **178**/ngoài **69**/`P162` **36**; đo độc lập ra **176**/**67**/**34**.
  Nửa TRONG cửa sổ khai đúng từng con số. Kèm hai số tồn dư ở
  `evidence-report.md:209,216` («105 dòng», «~106 assert») trong khi sổ khai 108/109.
- **G15** Tập 26 ca XOÁ không có ở đâu một bản liệt kê đủ: `contract.md:305` nói
  «26 ca», danh sách CHỐT ở `nhat-ky-thi-cong.md:180-182` kể **24**, cộng `P178`
  là 25. Ca thứ 26 là **`P26`** — nằm trong danh sách «Nhóm C — KHÔNG ĐƯỢC XOÁ»,
  việc nó chuyển sang nhóm xoá chỉ xuất hiện trong một mệnh đề phụ
  (`nhat-ky:354`) **không kèm lý do**. Đã kiểm bằng vật: **không** phải lỗ độ
  phủ (7 skill `P26` đòi chỉ tồn tại trong bản mirror), nên đây là lỗi **sổ
  sách**, không phải gỡ nhầm.

---

## Luật dừng-vá kích hoạt LẦN THỨ HAI

Vòng 2 đã kích hoạt nó ba lần. Vòng 3 kích hoạt lại, và lần này bằng chứng nặng
hơn vì **lỗi sinh ra từ chính bản vá**:

1. **G5** = lớp B3 vòng 1 (khai CHẠY THẬT mà chưa từng chạy) — nằm trong câu
   khai của AC-20, tiêu chí do vòng sửa 2 dựng ra.
2. **G6** = lớp F4/F8 vòng 2 (ghim không đo điều đã hứa) — sống sót qua chính
   vòng sửa dựng ra để đóng nó.
3. **G7** = lớp F1/F3 vòng 2 (phạm vi phép đo hẹp hơn lời hứa) — nằm trong bản
   vá cho F6.
4. **G1–G4** = F1/F3/F4/F12 tái sinh ở phía văn xuôi; hai trong bốn ở **đúng
   dòng vòng 2 đã cite**.
5. **G10** = D4 vòng 1, chưa từng được xử.

Hình dạng chung của cả ba vòng, nói gọn: **mỗi bản vá đóng đúng nửa mà nó nhìn
thấy, và nửa kia trở thành lỗ của vòng sau.** Vá tiếp sẽ đẻ hình dạng thứ N+1 —
đó là điều luật dừng-vá dự đoán, và nay nó đã dự đoán đúng hai lần liên tiếp.

**Biên bản này DỪNG ở mô tả, không kèm bản vá.** Ba đường ra là việc của owner,
ghi ở gói trình Cổng 2.

## Phụ lục — phép đo của phiên chấm

Ba phiên chạy qua `su - tester` với `NODE_EXTRA_CA_CERTS=/opt/ccr-ca.crt`, trên
worktree rời dựng bằng `git worktree add --detach`, dọn sạch sau khi đo; cây
`/home/user/wt1b` không bị chạm (`git status --porcelain` rỗng).

Số ca đo độc lập, **không qua `so-ca.sh`**, tại ngọn: plugins **146** ·
workflows **463** (324+11+42+16+26+44) · scripts **686** · hooks **54** — khớp
bản khai cả bốn; mốc cho 173 · 488 · 671 · 54, khớp cột `truoc`. Diff tên ca
`d6044a4`→ngọn: plugins 0 mất / 1 thêm (`P195`), scripts 0 mất / 22 thêm
(`RS01–RS06`), hooks và workflows 0/0.

---

# Rà soát đối kháng — vòng 4

*Hai phiên chấm độc lập (lăng kính phép-đo+gỡ-quá-tay và hợp-đồng-đối-vật),
context sạch, chấm theo LUẬT MỚI của AC-20 bản thu: đáy chứng minh đã tuyên,
dụng cụ phía trên đáy không phải lời hứa.*

## Verdict vòng 4: **PASS — cả hai lăng kính**

Đáy đứng vững toàn bộ khi đo độc lập không qua dụng cụ của hồ sơ: bốn đẳng
thức khớp từng con số ở cả hai đầu (146/463/686/54, mốc 173/488/664-nội-bộ/54);
diff TÊN ca chỉ +`P195`, 0 mất; mốc trên remote đúng sha và là cha trực tiếp
của commit gỡ đầu; 7/7 vật `VAT-LUU-KHO` vắng-ở-HEAD/có-ở-mốc; 9/9 vật CẤM
ĐỤNG byte-equal; vật phát đi 0 hit con trỏ mirror/codex; P195 đỏ đích danh cả
ba chiều phá; 15 nhóm/16 chiều đỏ đếm ra đúng; 9/9 chuỗi ghim có mặt; chuyện
«lượt đỏ P43» khớp sổ từng chi tiết; re-pin 12 trọn bốn vế; 15/15 bản xử G1–G15
đúng với cây ở phần máy.

**6 finding (2 P1 · 4 P2), đều lớp con-trỏ/lời-khai, KHÔNG chặn vật — đã xử
ngay trong vòng (commit này):** GUIDE bỏ con trỏ chết «case P22» (vế
manifest-khớp-nhau của P22 chết cùng Codex) · known-limit round-trip-một-khối
khai vào evidence cho đúng lời E20 · đính chính G15 sửa con trỏ sai (mục «DIFF
TÊN CA» chưa từng được commit) · E4/E7 gỡ nốt bản chép giá trị chỉ-người-đọc
(«13/13», «4/4», dẫn xuất 686) · `acceptance-init.md` bỏ khái niệm «mirror-sync
commits» đã chết · `script_paths` của P195 hết mù với executor mang cờ.
