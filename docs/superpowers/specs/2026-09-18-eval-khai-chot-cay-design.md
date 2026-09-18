# Thiết kế — Lời khai cấp eval: eval gọi máy chủ qua mạng có chốt đúng cây hay không

Ngày 2026-09-18 · slug `eval-khai-chot-cay` · tier T3 (chạm `lib/**`)
· trạng thái: **CHỜ CỔNG PHẠM VI quyết có làm hay không**

---

## 1. Vấn đề — một câu trả lời SAI trông như câu trả lời ĐÚNG

Một eval gọi HTTP tới máy chủ dev có thể đo **nhầm cây**: máy chủ đang trả lời ở
cổng mặc định thuộc một checkout khác (checkout chính, một worktree khác), và phép
đo vẫn in ra những con số hợp lý với mã thoát 0.

Kit phân loại được thứ nó THẤY — hạ tầng hỏng thành `BLOCKED`, mã thoát lệch kỳ
vọng, ô khai không-chạy. Đo nhầm cây KHÔNG thuộc nhóm đó: nó không hỏng, nó **trả
lời sai mà xanh**. Không lưới nào của kit hiện nay nhìn thấy nó.

Đối chiếu `HEAD`: KHÔNG script hay lib nào trong `scripts/`, `lib/` chốt cây.
Chuyện này chỉ sống trong tài liệu. Kế hoạch
`docs/superpowers/plans/2026-08-29-cham-dung-cay-dung-cho-dung.md` nghe giống nhưng
là việc KHÁC — nó đưa **tầng chấm** vào kỷ luật (`s4-args.mjs` sinh args, làn đặt
chỗ đứng, hạ tầng hỏng tự xưng tên); nó không đụng câu hỏi «máy chủ tôi đang gọi
có phải cây này không».

### Vì sao đây là bài toán của KỶ NGUYÊN WORKTREE

Mối nguy chỉ tồn tại ở chỗ có thể có một máy chủ **vô chủ** đang chạy sẵn — tức
máy của người làm, nhiều cây cùng lúc. Đó chính là nếp làm việc kit đang dạy
(`superpowers:using-git-worktrees`, `EnterWorktree`, nhiều phiên song song). Kit
tự nó không có máy chủ nào nên chưa từng đau; kho `crm` chạy 12 hồ sơ có eval gọi
mạng thì đau và đã tự vá hai lần.

---

## 2. Bằng chứng đo được (không phải phỏng đoán)

Đo bằng chính bộ đọc của kit (`lib/eval-yaml.cjs` + `resolveConfigKey` của
`lib/evidence-core.cjs`) trên **10 kho** — giải `config:` ref trước khi soi, tức
nhìn LỆNH THẬT chứ không nhìn chuỗi `config:executors.…`:

| Kho | eval máy | khớp bộ dò HẸP | hồ sơ | hồ sơ dính | đã ký |
|---|---:|---:|---:|---:|---:|
| acceptance-gate-kit | 778 | **0** | 76 | 0 | 73 |
| artifact-platform | 1299 | 2 | 175 | 2 | 175 |
| crm | 471 | **95** | 42 | 12 | 38 |
| oneflow | 608 | 0 | 40 | 0 | 40 |
| map · media-library · policy-graph-hub · floorplanstudio · horizon | 581 | 0 | 35 | 0 | 31 |
| **TỔNG** | **3 737** | **97** | **368** | **14** | **357** |

Bốn điều những con số này nói, mỗi điều đổi một quyết định thiết kế:

1. **97/3 737 = 2,6 %.** Nghĩa vụ mới chạm một lát rất mỏng của không gian eval.
   Đây là lý lẽ mạnh nhất cho «cảnh báo, không chặn»: một luật chặn cho 2,6 %
   phải trả giá bằng phiền toái cho 97,4 %.
2. **95/97 nằm trong MỘT kho (`crm`).** Bài toán hiện là bài toán của một kho.
   Lý lẽ để nó vẫn thuộc kit: `crm` đã tự phát minh **hai** cơ chế, và một trong
   hai (`may-chu.mjs`) đã bị CHÉP sang hồ sơ thứ hai rồi hai bản TRÔI khác nhau —
   đúng lớp «một luật sống ở hai nơi» mà kit tồn tại để chặn. Lý lẽ ngược:
   2 kho/10 là mẫu mỏng để đặt một trường schema vĩnh viễn.
3. **Kit có ĐÚNG 0 eval gọi mạng.** Kit **không tự ăn được món này**. Mọi bằng
   chứng phải dựng trên fixture code-sinh; không có tín hiệu dùng-thật nào từ
   chính kho kit. Đây là sự thật phải nằm trên bàn ở Cổng Phạm vi, không được
   giấu.
4. **14 hồ sơ dính, 11 trong đó đã ký.** Đó là chi phí thật của lối «thiếu =
   VIOLATION».

### Bộ dò: hẹp có số đo, rộng có dương-giả có tên

Hai bộ dò chạy trên cùng 3 737 eval:

- **RỘNG** (`APP_URL|API_URL|localhost|http(s)://|curl|playwright|fetch|:\d{4}`):
  101 khớp — trong đó **4 dương-giả có tên**: `npm run smoke:news-fetch` (×3,
  artifact-platform) và `check-no-dormant-fetch.sh` (oneflow). Cái sau là script
  **đi tìm** lời gọi fetch — nghĩa ngược hẳn với gọi mạng. Đúng lớp lỗi mà
  `HEAD_NEG_RE` từng phải sửa bằng số đo 566 AC thật.
- **HẸP** (`(APP_URL|API_URL|BASE_URL|SITE_URL|ORIGIN)=` gán vào lệnh, **hoặc**
  origin loopback nguyên văn `http://localhost|127.0.0.1|0.0.0.0`): 97 khớp,
  **0 dương-giả** trên toàn bộ 3 737 eval.

**Hai hằng 3 737 và 97 là SỐ ĐO TẠI THỜI ĐIỂM ĐÓNG BĂNG, không phải bất biến.**
Phản biện context sạch bắt đúng chỗ này: một ca đo ghim vào hai hằng rút từ `~/dev`
của máy tác giả sẽ ĐỎ oan ngay khi `crm` thêm một eval gọi mạng, và BLOCKED trên CI
nơi 10 kho không tồn tại. Vì vậy corpus được **đóng băng thành vật trong hồ sơ**
(`corpus-lenh.jsonl` + `corpus-nhan.jsonl` + `corpus-xuat-xu.md` ghi sha từng kho),
và AC-3 đo theo **NHÃN của từng dòng**, không đo theo hằng số. Bản nhãn là một phán
đoán được đóng băng thành vật để người ở Cổng Phạm vi soi lại được.

Bộ dò HẸP **cố ý sót**: một eval chạy `npm run e2e` với URL nằm trong
`playwright.config.ts` sẽ không bị thấy. Điều này KHÔNG được che — nó là giới hạn
đã khai của thiết kế (mục 7), và là lý do lời khai phải là **nguồn chính**, bộ dò
chỉ là **lưới hứng ca hiển nhiên**.

---

## 3. Chân ngành — ngành giải bài này bằng CẤU TRÚC, không bằng LỜI KHAI

`[NGÀNH: Playwright]` — `playwright.config.ts` có khoá
`webServer.reuseExistingServer`; nếp chuẩn là `!process.env.CI`, tức **trên CI thì
TỪ CHỐI dùng lại một máy chủ đang chạy sẵn**. Đó đúng là cái núm ngành đặt cho
mối nguy này, và nó là một núm **hành vi**, không phải một lời khai.

`[NGÀNH: Testcontainers]` — mỗi lượt kiểm tự mang máy chủ của nó lên một cổng phù
du; địa chỉ không thể mơ hồ vì không có địa chỉ nào dùng chung để mà nhầm.

`[NGÀNH: hermeticity — Bazel]` — một lượt kiểm không được phụ thuộc trạng thái
môi trường xung quanh; đây là tên gọi chuẩn của tính chất mà «chốt cây» đang đuổi
theo một cách gián tiếp.

**Kết luận rút từ chân ngành, và nó cắt vào thiết kế:** giải pháp đúng-tầng của
ngành là *hermetic by construction* — đừng khai, hãy làm cho việc đo nhầm cây trở
thành bất khả. Kit **không thể** làm điều đó: kit không chạy ứng dụng của kho tiêu
thụ và không biết nó phục vụ gì. Vậy thứ kit làm được chỉ là **biến cảnh báo thành
thứ đếm được** — và khi làm, phải nói thẳng rằng đây là nước đi hạng hai so với
chuẩn ngành, chứ không bán nó như lời giải. Hệ quả cụ thể: văn bản của kit phải
nêu «tự mang máy chủ lên cổng phù du» là **cơ chế chốt cây mạnh nhất**, để lời khai
không vô tình phong thánh cho các cơ chế yếu hơn.

`[SUY-TỪ-REPO: scripts/eval-coverage-lint.js]` — **tiền lệ nội bộ đúng khuôn đã
có sẵn: W5.** Chú thích của nó viết thẳng: *«the kit never verifies the VALUE
(engine/binding split; a machine cannot check the word "real") — it only checks
the line EXISTS so the Gate-1 human has something to eyeball.»* W5 đòi hợp đồng
có surface `mobile` phải mang dòng `Mobile backend target: local|staging|mock`.
Đó **chính xác** là thế đứng của chốt cây, chỉ khác tầng: W5 khai về *môi trường
đo*, việc này khai về *cây đo*.

---

## 4. Quét hình thái không gian AC

### Ngữ cảnh
- Sản phẩm: **acceptance-gate-kit** — chân sản phẩm `[SUY-TỪ-REPO: CLAUDE.md]`
  (kit là ENGINE, không chứa product context của kho tiêu thụ; thước của kit là
  thời gian làm-xong→quyết-được, số lượt gọi người, token·phút mỗi kết quả ship)
  · chân ngành: Playwright `webServer.reuseExistingServer`, Testcontainers,
  hermeticity (Bazel).

### Trục
- **Trục A — trạng thái lời khai trên eval**: `khai CÓ chốt (kèm tên cơ chế)` |
  `khai KHÔNG chốt (kèm lý do)` | `VẮNG`
  [thước CE: ba trạng thái này là toàn bộ ảnh của một trường scalar tuỳ chọn —
  cùng khuôn `expected_exit` (khai n · khai 0 · vắng) và `status: not-run` (khai ·
  vắng), hai tiền lệ đã ship và đã có ma trận toàn phần]
- **Trục B — máy có NHÌN THẤY eval gọi mạng không**: `khớp bộ dò hẹp` |
  `không khớp (URL trốn trong config con)` | `không giải được config: ref`
  [thước CE: số đo 3 737 eval ở mục 2 — 97 khớp hẹp, 4 dương-giả của bộ dò rộng
  có tên, và chế độ `--files` của lint vốn không có gốc kho để giải ref, đã là
  tiền lệ W6]
- **Trục C — bộ đọc tiêu thụ lời khai**: `lint Cổng 1 (W9)` | `thẻ Cổng Phạm vi` |
  `thẻ Cổng Bằng chứng` | `làn ghim lại` | `s4-args / workflow`
  [thước CE: danh sách bộ đọc `evals.yaml` rút bằng `grep -rn parseEvals lib
  scripts` + INIT-CI-COPY-LIST — đây là tập đóng, không phải phỏng đoán]
- **Trục D — tuổi hồ sơ**: `hồ sơ mới (sau bản này)` | `hồ sơ đã ký trước bản này`
  [thước CE: 357 hồ sơ đã ký đo được ở mục 2, trong đó 11 dính]

Trục «loại executor» KHÔNG đứng riêng — nó là ràng buộc CẮT NGANG (mục dưới), vì
đổi executor ép đổi luôn giá trị hợp lệ của trục A (`judgment` không chạy lệnh nên
không có cây để chốt). Trục thứ 5 → gộp, đúng luật B1.5.

Không gian: 3 × 3 × 5 × 2 = 90 ô → quét theo lát của trục A × B (9 lát).

### Core (12 ô — ≤20 % của 90) → 13 AC

(ô Core 5 «`none` trơn» tách làm hai sau phản biện context sạch: AC-2 ở tầng hàm,
AC-13 ở tầng bộ đọc — một lỗi chỉ tồn tại trong `errs` mà không bộ đọc nào đọc thì
nó không có tiếng ở bất kỳ mặt nào người nhìn thấy.)
1. **A=VẮNG × B=khớp hẹp × C=lint** — ô SINH RA cả tính năng: eval gọi mạng mà
   không khai gì thì phải có tiếng.
2. **A=VẮNG × B=khớp hẹp × C=lint × D=đã ký** — cùng ô trên nhưng trên 11 hồ sơ
   đã ký; đây là ô mà hai tiền lệ của kit kéo hai phía → **câu hỏi cho người**.
3. **A=khai CÓ chốt × B=khớp hẹp × C=lint** — đối chứng dương: khai rồi thì lint
   phải IM. Thiếu ô này thì lint là hằng-đúng.
4. **A=khai KHÔNG chốt × B=khớp hẹp × C=lint** — lint cũng IM, nhưng con số phải
   đi tiếp tới thẻ; «khai không chốt» là một lựa chọn hợp lệ, không phải lỗi.
5. **A=khai KHÔNG chốt, LÝ DO RỖNG × C=lint** — `none` trơn là từ-thần-chú mở
   cổng; phải có tiếng, nếu không lời khai hoá thành thủ tục.
6. **A=bất kỳ × B=không khớp × C=lint** — chiều ĐẶC HIỆU: 3 640 eval còn lại và
   4 dương-giả có tên phải IM. Đây là chiều mà CLAUDE.md ghi là đã THIẾU tới
   14/09.
7. **A=khai trên executor `judgment` × C=lint** — nhãn lạc chỗ (gương của
   `nhanLacCho` trong W8): judgment không chạy lệnh nên không có cây.
8. **A=bất kỳ × C=thẻ Cổng Bằng chứng** — in CON SỐ (k chốt / m không chốt /
   j chưa khai), không in cờ. Đây là ô trả nghĩa vụ «người ký thấy số thay vì tin».
9. **A=bất kỳ × C=thẻ Cổng Phạm vi** — W9 hiện thành cờ vàng ở thẻ Cổng 1.
10. **B=không giải được `config:` ref × C=lint** — phải NÓI RA là không soi được,
    không im như thể đã soi (fail-open có tiếng, đúng khuôn W6 `rơi bậc`).
11. **A=bất kỳ × C=làn ghim lại + s4-args × D=đã ký** — hai bộ đọc này KHÔNG được
    đổi hành vi: 357 hồ sơ đã ký phải còn ghim lại được. Đây là sàn hồi quy.
12. **A=VẮNG toàn kho kit × B=không khớp × C=lint** — chiều im ở quy mô corpus:
    chạy lint trên 122 hồ sơ của chính kit phải ra **0 cảnh báo W9** (vì kit đo
    được 0 eval gọi mạng). Một bộ dò hỏng theo chiều rộng sẽ nổ ở đây.

### Later (park, 1 dòng)
- `B=không khớp` **và** eval THẬT SỰ gọi mạng (URL trốn trong `playwright.config`)
  — kit không nhìn thấy; park, khai giới hạn, ngưỡng mở lại ở mục 7.
- Thẻ Cổng Bằng chứng in **tên cơ chế** chứ chỉ in số — park tới khi có kho thứ hai.
- `[NGÀNH: Testcontainers]` một helper «tự mang máy chủ lên cổng phù du» do kit
  ship — park, xem mục 6 lối D.

### Never (1 dòng lý do)
- Kit tự chốt cây thay kho tiêu thụ — kit không biết ứng dụng phục vụ gì để lấy
  vân tay; đây là ranh giới «kit là engine» của CLAUDE.md.
- Máy SUY «eval này có gọi mạng không» từ văn xuôi trường `expected` — đúng lối
  đã bị ADR 0016 loại (lối bị loại số 3: máy đoán ý người).
- `tree_pin` khai trên `judgment` được coi là hợp lệ — judgment không chạy lệnh,
  cho khai là hứa một điều không bộ đọc nào giữ được (gương của giới hạn ADR 0016).

### Cross-cutting áp mọi ô Core
- **Executor**: chỉ `test`/`script`/`ui-check` mới có cây để chốt. `judgment` →
  ô Core 7.
- **MỘT nguồn**: mọi bộ đọc rút lời khai qua đúng một hàm trong `lib/eval-yaml.cjs`
  (khuôn `expectedExits`); bên VIẾT (khuôn trong tài liệu) và bên ĐỌC round-trip
  từ MỘT marker (khuôn `OOC-ITEM-TEMPLATE`, case P55).
- **Cặp hai chiều** (`MEASURE-BIRTH-CLAUSE`): mỗi phép đo mới có đối chứng dương
  + bản tiêm đỏ với thông điệp ghim; và từ 14/09 có **chiều đặc hiệu** (ô Core 6
  + 12) — chạm thứ KHÔNG phải vật thì thước phải IM.
- **Fail-open**: lint là ADVISORY, lỗi trong lint không bao giờ chặn cổng (nếp
  `eval-coverage-lint.js` dòng cuối).

---

## 5. Thiết kế đề nghị

### 5.1 Vật: một trường scalar trên eval

```yaml
- id: E3
  criterion: AC-2
  executor: script
  cmd: config:executors.test.trang_truong
  tree_pin: rang/canh-cay.mjs — ghi dấu mốc ngẫu nhiên vào apps/app/public rồi xin lại qua APP_URL
```

```yaml
  tree_pin: none — eval chỉ đọc trang tĩnh đã dựng sẵn, không phụ thuộc cây nào đang phục vụ
```

Một khoá, một scalar, đúng hình dạng `expected_exit: 2` và `status: not-run`. Ba
trạng thái của trục A đọc ra từ giá trị: bắt đầu bằng `none` (không phân biệt hoa
thường, có thể bọc nháy) = **khai KHÔNG chốt**; chuỗi khác rỗng = **khai CÓ chốt
bằng `<chuỗi>`**; vắng hoặc rỗng = **VẮNG**.

Tên `tree_pin` (tiếng Anh) theo nếp tên trường của `evals.yaml`
(`expected_exit`, `status`, `layer`, `paths`); tên lib tiếng Việt theo nếp
`lop-nhin-thay.cjs`, `nguong-o-co-hoi.cjs`.

### 5.2 Bộ đọc — MỘT nguồn

`lib/eval-yaml.cjs` thêm **đúng một** hàm, cùng khuôn `expectedExits`:

```js
function treePins(text) → { byId: Map<id, {khai:'co'|'khong'|'vang', coChe, lyDo}>, errs }
```

`errs` fail-closed đúng ba ca, mỗi ca gọi tên eval: (a) `none` trơn không lý do;
(b) khai trên `judgment`; (c) giá trị rỗng sau khi bóc nháy.

**`errs` phải CÓ BỘ ĐỌC** (AC-13, thêm sau phản biện context sạch): một lỗi nằm yên
trong `errs` mà lint không in và thẻ không đếm thì `tree_pin: none` trơn vẫn đi lọt
cả hai cổng — lint im vì eval CÓ trường, thẻ im vì eval bị bỏ khỏi cả ba nhóm nên
`k+m+j` vẫn khớp. Lời khai khi đó hoá thủ tục, đúng bệnh mà lối C bị loại vì mắc
phải. Vì vậy: lint in dòng gọi tên eval, thẻ đếm thành **số thứ tư** `… · <x> khai
sai`, và `byId` trả trạng thái `loi` chứ không rơi thầm về `vắng`.

### 5.3 Bộ dò «eval gọi máy chủ» — hẹp, có số đo, khai giới hạn

`lib/eval-yaml.cjs` (hoặc lib anh em) thêm một vị từ `laGoiMayChu(cmdDaGiai)` —
**chỉ** khuôn HẸP ở mục 2, đo được 0 dương-giả trên 3 737 eval. Bên gọi có trách
nhiệm GIẢI `config:` ref trước (qua `resolveConfigKey` sẵn có trong
`lib/evidence-core.cjs`) — vị từ không tự đọc file, để nó kiểm được bằng fixture
thuần.

### 5.4 Bộ đọc thứ nhất — `W9` trong `scripts/eval-coverage-lint.js`

Nổ khi: lệnh đã giải khớp bộ dò hẹp **VÀ** eval không có `tree_pin`.
Im khi: khai (dù `có` hay `không`) · không khớp bộ dò · executor `judgment`.
Thêm một tay phụ (gương của `nhanLacCho` ở W8): `tree_pin` đặt trên `judgment` →
cảnh báo nhãn lạc chỗ.
Chế độ `--files` không có gốc kho để giải `config:` ref → W9 **ngoài phạm vi ở chế
độ đó, và NÓI RA một dòng** (tiền lệ W6 «rơi bậc», không im).

### 5.5 Bộ đọc thứ hai — thẻ Cổng Bằng chứng in CON SỐ

Một dòng trong khối «máy đã lo»:

> Eval gọi máy chủ: **12** — 9 khai chốt cây · 2 khai không chốt · **1 chưa khai**

Đây là chỗ trả đúng câu chữ của đề bài: *người ký thấy con số thay vì tin*. Con số
chịu được sự nhàm chán tốt hơn cờ: một cờ vàng hay sai thì người ta học cách bỏ
qua, một con số «1 chưa khai» thì không có gì để bỏ qua.

### 5.6 KHÔNG đụng

`s4-args.mjs`, `repin-lane.mjs`, `checkRepinEvals`, `acceptance-verify.js`, schema
args — không đổi một dòng. Sàn hồi quy là ô Core 11: 357 hồ sơ đã ký phải còn
ghim lại được.

---

## 6. Bốn lối, và lối nào bị loại vì lý do gì

| Lối | Được gì | Mất gì |
|---|---|---|
| **A — lời khai + lint hẹp + đếm ở thẻ** *(khuyến nghị)* | hồ sơ không khai thì có tiếng; 0 dương-giả đo được; 0 hồ sơ cũ phải sửa | không thấy eval giấu URL trong config con (khai giới hạn, mục 7) |
| **B — chỉ đếm ở thẻ, KHÔNG lint** | rẻ nhất, tuyệt đối không cry-wolf | eval không bao giờ khai thì vô hình — hỏng đúng mục đích «hồ sơ nào KHÔNG làm thì không ai biết» |
| **C — bắt buộc khai, CHẶN ở tầng cưỡng chế** (hook/`recheck`/pre-merge) | răng thật | chạm `hooks/**` + `lib/evidence-core.cjs`; 11 hồ sơ đã ký đỏ ngay; và ép người gõ `tree_pin: none — ` cho qua cổng → lời khai hoá thủ tục, đúng bệnh «trạm thu phí» |
| **D — kit ship helper chốt cây dùng chung** | kho khỏi tự phát minh lại | YAGNI: đúng 1 kho cần; `canh-cay.mjs` giả định có thư mục tĩnh công khai; là CỘNG nên cần owner phê đích danh (ADR 0018) |

**Khuyến nghị: lối A.** Lý do trace về nguyên tố 2 («bằng chứng không tự dối» —
món này cho MÁY) và nguyên tố 3 (người xuất hiện ở chỗ có đánh-đổi: chọn cơ chế
chốt cây là việc chỉ người trong kho đó biết). Người hưởng cụ thể: **người ký Cổng
Bằng chứng ở kho có máy chủ dev** — hôm nay họ đọc một bảng eval xanh mà không có
cách nào biết eval nào đo cây nào.

Lối D đề nghị ghi `.out-of-scope/` kèm mục «Prior requests», mở lại khi có **kho
thứ hai** cần.

---

## 7. Giới hạn đã khai của chính thiết kế này

1. **Bộ dò hẹp cố ý sót.** Eval chạy `npm run e2e` với URL trong
   `playwright.config.ts` sẽ không bị W9 thấy. Lời khai vẫn đặt được bằng tay
   (khai nhiều hơn máy thấy LUÔN hợp lệ và LUÔN được đếm ở thẻ). **Ngưỡng mở
   lại đang đếm: ≥1 ca thật đo nhầm cây lọt qua vì bộ dò sót.**
2. **Kit có 0 eval gọi mạng nên không tự ăn được món này.** Mọi bằng chứng dựng
   trên fixture code-sinh; tín hiệu dùng-thật đầu tiên sẽ đến từ `crm`.
3. **Kit không kiểm GIÁ TRỊ của lời khai.** Viết `tree_pin: có chốt rồi` cũng qua.
   Đây là tiền lệ W5 nguyên vẹn: máy kiểm dòng CÓ MẶT, người soi ở cổng.
4. **`may-chu.mjs` của `crm` có điểm mù đã biết** (hai worktree cùng chuỗi giao
   diện) — kit không sửa việc đó; nó là việc của `crm`. Lời khai chỉ làm cho việc
   *cơ chế nào đang được dùng* trở nên nhìn thấy được.

---

## 8. NĂM điểm chỉ-NGƯỜI-quyết — mang lên Cổng Phạm vi

| # | Điểm | Máy khuyên | Vì sao KHÔNG máy tự quyết |
|---|---|---|---|
| 1 | Có làm không | **Làm, lối A** | Là CỘNG — ADR 0018 đòi owner phê đích danh từng ca |
| 2 | Đường lùi cho 11 hồ sơ đã ký | **Cờ vàng, không chặn, không bắt migrate** | Hai tiền lệ kéo hai phía; đây là khẩu vị rủi ro |
| 3 | Cảnh báo hay chặn | **Cảnh báo** (lối A, không C) | Đánh-đổi giá trị: răng thật ↔ lời khai hoá thủ tục |
| 4 | Ship helper chốt cây? | **Không — `.out-of-scope/`** | CỘNG thứ hai, cần phê riêng |
| 5 | Nếp `surfaces` của kit: 122 hồ sơ đều khai `[cli]` và kit có **0 eval `ui-check`**, kể cả những vòng đổi đúng thứ người đọc trên thẻ HTML *(điểm này sinh từ phản biện context sạch, không có trong đề bài)* | **Giữ `[cli]` cho vòng này**, khai chỗ hụt ở Known limits, đo trên HTML đã render | Đổi nếp chạm 122 hồ sơ và mọi vòng sau — khó-đảo, và khó-đảo LUÔN là câu hỏi cho người |

Căn cứ máy đã dựng cho điểm 2, để nó không phải là «anh thấy sao»: `evals_exit`
chọn được «không mốc ngày, không sử liệu» vì nó do **MÁY** ghi —
`repin-lane.mjs` vá lại 99 hồ sơ bằng một chiến dịch một lệnh. `tree_pin` do
**NGƯỜI** ghi ở Cổng 1 và đòi biết ứng dụng; máy không backfill được. Bất đối xứng
đó là lý do kỹ thuật để hai trường hợp đi hai đường khác nhau — nhưng nó là *lý do*,
không phải *quyết định*.

## 9. Dự báo 5 dòng số (luật (c) của CLAUDE.md)

| Dòng | Dự báo | Điều kiện tin cậy |
|---|---|---|
| làm-xong → quyết-được | **=** | vòng T3 bình thường, không đổi đường verdict |
| lượt gọi người/vòng | **=** (trần T3 = 4) | 4 điểm ở mục 8 gộp vào MỘT lời mời Cổng Phạm vi, không hỏi rải rác |
| vòng bị hạ-tầng-kit đốt lượt chấm | **=** | đường nền chạy trước khi viết tạo phẩm |
| token máy/vòng | **↑ nhẹ** | thêm 1 lint arm + 1 khối thẻ; không thêm agent nào vào khối tìm-lỗi |
| phút máy/lượt chấm | **=** | không thêm lệnh nào vào `suite_keys`; W9 chạy trong lint sẵn có |

Đường verdict (finder → refute trong hợp đồng → REJECT) **không đổi thành phần**.

---

## 10. Phản biện context sạch đã đổi gì (one-pass, 2026-09-18)

Một agent context sạch đọc đúng 5 tệp (design doc · contract · evals · sổ · bài học
xuyên feature) và **không đọc mã** — trả về **3 P0 + 2 P1**, không cái nào là wishlist.
Bộ tạo phẩm đã sửa hết trong một lượt, không re-probe (phần mã còn 3 vòng S4):

| Sev | Lỗ | Sửa |
|---|---|---|
| P0 | `k+m+j == N` là **hằng đúng** khi `N` tính bằng tổng ba số | AC-9 + E9: fixture thành phần khai trước, assert **từng số** `6 — 3 · 2 · 1`, ba chiều đỏ riêng |
| P0 | Chiều đỏ của AC-8 **chết trước khi viết** (kit có 0 eval gọi mạng nên nới bộ dò không đổi con số nào) | AC-8 + E8: hai mutant SỐNG — khớp-tất-cả, và corpus có tiêm `k` hồ sơ |
| P0 | E3 **tự mâu thuẫn** và ghim vào checkout của tác giả | AC-3 + E3: corpus đóng băng thành vật trong hồ sơ, đo theo **nhãn**, chân không đọc `~/dev` |
| P1 | `errs` **không có bộ đọc** — fail-closed dừng ở tầng hàm | AC-13 + E13 (mới) |
| P1 | `surfaces: [cli]` trong khi vật gồm hai dòng **người đọc** trên thẻ | AC-9/AC-10 đo **HTML đã render**, chiều đỏ «có trong extract, vắng trong bản người đọc»; nửa **nếp surface** đưa owner quyết — xem mục 8 điểm 5 |

Bài học xuyên feature được dùng lại có cite: `[release-2-16-0#F1]` (nhánh hằng-đúng).
