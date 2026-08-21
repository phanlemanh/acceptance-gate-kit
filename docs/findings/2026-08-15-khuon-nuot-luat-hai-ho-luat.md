# Khuôn nuốt luật — hai họ luật của kit, và chỗ luật thay thế suy nghĩ

*2026-08-15 · Điều tra theo giả định owner nêu cùng ngày: «model đủ thông minh
mà bị ÉP theo luật thì ở MỘT SỐ tình huống sẽ kém đi». Vật mổ: hồ sơ Cổng Đáng
`_acceptance/trang-tu-van-v2-r4/` của `artifact-platform` (PR #352, nhánh
`docs/r4-cong-dang`), soạn 15/08, còn nguyên vết sửa. **Vòng này KHÔNG sửa file
kit** — chỉ điều tra, ghi phát hiện, liệt kê ứng viên cho vòng riêng.*

---

## 0. Kết luận một câu

Luật của kit **không** làm model kém đi. Nhưng **khuôn** của kit có một lớp lỗi
thật: **ô trống không phân biệt được «tôi đã áp mặc định» với «tôi chưa nghĩ»**
— nên khi luật văn bản đã định sẵn một mặc định, cái ô vẫn kéo phiên về phía
đẩy câu hỏi cho người, vì đẩy-cho-người là hình dạng DUY NHẤT của ô trông giống
sự cẩn thận.

Nói gọn: hỏng không nằm ở **có luật**, mà ở **luật không có chỗ để tự thi hành
trên giấy**.

---

## 1. Phán quyết giả thuyết chính: **ĐÚNG MỘT PHẦN** — và cơ chế sắc hơn bản nêu

Giả thuyết owner nêu: *khi KHUÔN (slot phải điền) và LUẬT (câu văn) của cùng một
tài liệu bất đồng, KHUÔN THẮNG.*

### 1.1 Chỗ giả thuyết đúng

Vật: [`skills/acceptance/references/opportunity-template.md:67–80`](../../skills/acceptance/references/opportunity-template.md).

Luật bằng chữ (dòng 73–75) nói rõ một **mặc định**:

> *ngôn-ngữ-thiết-kế/hình-thái — layout, DNA thị giác, khuôn tương tác, giọng
> component: mặc định **KHÔNG** kế thừa — chuẩn của repo tiêu thụ THẮNG. Muốn
> kế thừa hình thái: khai đích danh vào bảng + người ký tại Cổng 0.*

Bảng ngay dưới (dòng 78–80):

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| … | … | triết-lý/logic hoặc ngôn-ngữ-thiết-kế/hình-thái | có/không | (chỉ bắt buộc khi kế thừa hình thái) |

Phiên r4 điền (`opportunity.md:398–399`):

| Hình màn workbench 4 tab | nhánh kho r3 | **ngôn-ngữ-thiết-kế/hình-thái** | ⚠️ **CHỜ KÝ** | Manh |
| Hình thẻ căn PNG + trang sống | nhánh kho r3 | **ngôn-ngữ-thiết-kế/hình-thái** | ⚠️ **CHỜ KÝ** | Manh |

rồi nâng nó thành câu hỏi số 3 cho người tại Cổng 0 (`opportunity.md:455–457`):
*«giữ hình của workbench và thẻ căn r3, hay dựng lại hình theo trật tự phục vụ
mới?»* — kèm hai phương án và giá tiền.

Luật nói mặc định là **KHÔNG**. Phiên trả về **CHỜ NGƯỜI**. Khuôn thắng: đúng.

### 1.2 Chỗ giả thuyết cần sửa — khuôn không *mâu thuẫn* với luật, nó *không có ô cho luật*

Đọc kỹ thì bản mẫu **cẩn thận hơn** giả thuyết cho rằng: cột «Người ký» đã tự
gắn điều kiện *«(chỉ bắt buộc khi kế thừa hình thái)»*. Bản mẫu chưa bao giờ nói
"hỏi người". Và giá trị phiên điền vào cột «Kế thừa?» — `⚠️ CHỜ KÝ` — **không nằm
trong tập giá trị bản mẫu mời** (`có/không`). Phiên **tự đẻ ra giá trị thứ ba**.

Nên cơ chế thật không phải *khuôn cãi luật*, mà:

> **Áp mặc định trông giống bỏ trống ô.** Khuôn không có hình dạng nào để VIẾT
> RA việc «mặc định đã áp, đây là căn cứ, không cần người». Trong hai lối duy
> nhất mà ô cho phép — điền `không` trơ, hay đẩy lên người — lối đẩy-lên-người
> là lối duy nhất *nhìn có vẻ đã suy nghĩ*.

Bằng chứng đóng đinh cơ chế này: **phiên ĐÃ có sẵn phép suy, viết ra rồi, ngay
ba dòng dưới bảng** (`opportunity.md:404–407`):

> *«Giữ hình của workbench và thẻ căn nghĩa là kế thừa ngôn ngữ thiết kế của
> vòng trước — mà vòng này lật thứ tự phục vụ, nên hình cũ có thể đang mã hoá
> đúng cái trật tự vừa bị bác.»*

Đó chính là phép suy. Phiên viết đúng nó, rồi **vẫn** kết bằng *«Người ký phải
trả lời riêng»*. Vậy hỏng **không phải ở năng lực suy luận** — phiên suy đúng.
Hỏng ở **định tuyến**: kết luận đã có, nhưng không có ô nào nhận nó, nên nó chảy
vào ô có sẵn là chữ ký.

### 1.3 Cơ chế thứ hai, độc lập: luật nêu tên tai nạn cũ bị đọc thành lệnh leo thang

Bản mẫu mở section bằng: *«Lưới B1 (retro V1): vật liệu ngoài vào không phân
loại là mắt xích đầu của chuỗi drift 7 bước»*. Phiên chép lại và khuếch đại
(`opportunity.md:404`): *«Hai dòng ⚠️ là chỗ r2 từng chết»*, rồi dùng chính câu
đó làm căn cứ để **tách riêng một câu hỏi cho người**.

Nhưng thuốc mà luật kê cho tai nạn ấy là **một mặc định** (không kế thừa), không
phải **một câu hỏi**. Câu kể-tai-nạn được đọc thành *«chỗ này nguy hiểm ⇒ gọi
người»*, trong khi nó nghĩa là *«chỗ này nguy hiểm ⇒ mặc định nghiêng về an
toàn, và đường ngược lại mới cần chữ ký»*.

⇒ **Luật càng kể chuyện tai nạn để giải thích mình, càng dễ bị đọc thành lệnh
leo thang.** Đây là cái giá của thể văn "luật có lý do" mà kit đang dùng khắp
nơi — và nó là cái giá đáng trả, miễn mặc định được viết ra thành một **giá trị
điền được**, không phải một câu văn.

### 1.4 Quét chỗ khác cùng hình dạng

Đã đọc `contract-template.md`, `evidence-report-template.md`, `measure-birth.md`,
`eval-executors.md`, `human-facing-language.md`, `uat-session-template.md`,
`design-ui-check.md`, `morphological-scan/SKILL.md` + 7 preset.

**Chỉ tìm được MỘT chỗ nữa cùng hình dạng đầy đủ** (luật đã định mặc định ∧ ô mời
quyết định lại):

- [`opportunity-template.md:102–105`](../../skills/acceptance/references/opportunity-template.md) — **Bảng nợ kế thừa**, cột `Giữ / Dựng lại`.
  Cùng section, cùng bệnh: luật «hình thái mặc định KHÔNG kế thừa» ở dòng 74 đáng
  ra áp thẳng vào mọi path thuộc bề mặt, nhưng cột trình nó thành lựa chọn từng
  dòng. Trong ca r4 (`opportunity.md:230–239`) cả 8 dòng điền **Giữ** — mặc định
  chảy ngược thành «giữ hết», đúng chiều ngược với luật.

Đáng chú ý: **cùng bảng đó, cột `Chạm t3_paths?` lại là món tốt nhất của cả hồ
sơ** — nó là ô hỏi một **phép đối chiếu** (so đường dẫn với `risk_tiers.t3_paths`
trong `_acceptance/config.yaml`), và chính nó lôi ra phát hiện đổi kế hoạch lớn
nhất của vòng («lát 1 = T2» là sai ⇒ tách ba bước). Hai cột **cạnh nhau trong
một bảng**, một cột sinh phát hiện, một cột sinh câu hỏi thừa. Đó là cặp đối
chứng sạch nhất của cả cuộc điều tra, và nó cho luôn tiêu chí phân họ ở §2.

Các ô còn lại của kit đều **không** dính bệnh: chúng hoặc hỏi phép đo, hoặc hỏi
một thứ luật chưa định mặc định (tức là quyết định thật).

---

## 2. Hai họ luật + tiêu chí phân biệt dùng lại được

### 2.1 Tiêu chí — một câu hỏi, có thể chạy được trên bất kỳ ô nào

> **Ô này có ĐỎ được không?** Tức: điền sai vào ô này thì có một phép chạy, một
> phép đối chiếu, hay một vật trong cây nguồn khiến cái sai lộ ra không?

- **ĐỎ được ⇒ luật ép ĐO.** Ô thêm thông tin không ai đang cầm. Giữ, và mở rộng.
- **Không ĐỎ được ⇒ luật ép HÌNH DẠNG.** Điền gì cũng "đúng khuôn". Chỉ hợp lệ
  khi ô hỏi một thứ **thật sự thuộc người**: có đánh-đổi hoặc khó-đảo, VÀ luật
  văn bản CHƯA định sẵn mặc định.
- **Ca hỏng:** ô không-đỏ-được, hỏi khẩu vị, **trong khi luật đã có mặc định**
  ⇒ **ô nuốt luật**. Đây là lớp lỗi vòng này tìm thấy.

Tiêu chí này là bản chiếu của bất biến đã có trong CLAUDE.md («thước phải gắn vào
vật được giao»; «assertion âm-tính-một-mình là assertion không sống») sang mặt
**khuôn giấy** thay vì mặt **suite test**. Cùng một nghi thức hỏi nhanh của
[`measure-birth.md:26–28`](../../skills/acceptance/references/measure-birth.md):
*«nếu tôi phá vật thật trong một bản sao, phép đo này có đỏ không?»* — áp cho ô
giấy thì thành: *«nếu tôi điền bừa ô này, có gì trong repo cãi lại không?»*

### 2.2 Bảng phân họ

| | **Họ A — ép ĐO** | **Họ B — ép HÌNH DẠNG** |
|---|---|---|
| Ô hỏi gì | một phép chạy / phép đối chiếu | một mục phải có mặt |
| Sai thì | có vật cãi lại → ĐỎ | không ai biết |
| Thêm gì | thông tin chưa ai cầm | trật tự trình bày |
| Rủi ro | tốn giờ máy | **thay thế suy nghĩ**: điền đủ ô rồi dừng |
| Trong ca r4 | bắt 3 việc không ai nghĩ ra + 1 phát hiện đổi kế hoạch | sinh 1 câu hỏi thừa cho người |

### 2.3 Họ A — luật ép ĐO (≥3 ví dụ, kèm đường dẫn)

| # | Luật | Đường dẫn | Chiều đỏ của nó | Vết trong ca r4 |
|---|---|---|---|---|
| A1 | **Giấy khai sinh phép đo** — 4 mục: đối-chứng-dương · phá-vật-thật · thông-điệp-ghim · phủ-định-phổ-quát | [`references/measure-birth.md`](../../skills/acceptance/references/measure-birth.md) | mục 2 buộc phá vật thật trong bản sao; kết luận không lật = phép đo không đo | — (áp ở S4, ca này chưa tới) |
| A2 | **Baseline bắt buộc** — eval phải đỏ trên `main` trước khi màu xanh của nó được tính | [`references/evidence-report-template.md:181`](../../skills/acceptance/references/evidence-report-template.md) · guard 2 của `disposition: keep` ở [`opportunity-template.md:88–89`](../../skills/acceptance/references/opportunity-template.md) | eval xanh-cả-hai-chiều bị nêu đích danh | `opportunity.md:244` — buộc khai «code kế thừa không được hưởng xanh sẵn» |
| A3 | **Full matrix cho luồng tiền, cấm pairwise** | [`morphological-scan/references/test-matrix.md:22`](../../skills/morphological-scan/references/test-matrix.md) | tích Descartes có số ô đếm được; thiếu ô là đếm ra | `opportunity.md:251` — 4 trục × 8 ô Core, sinh **4 việc chưa ai nghĩ ra**: lint trần pháp lý · eval sửa-sau-phát-hành · luật đơn vị triệu↔đồng · `vatRate` theo đợt |
| A4 | **Chân ngành phải có TÊN, tra web nếu không chắc; bịa tên tệ hơn để trống** | [`morphological-scan/SKILL.md:17`, `:91–92`](../../skills/morphological-scan/SKILL.md) | `[NGÀNH: <tên>]` không tra ra tên thật thì phải hạ xuống `[GIẢ ĐỊNH]` | `opportunity.md:253–254` — Luật KDBĐS 2023 Đ.25 · CSBH Masterise 2025-26 · NĐ 174/2025, đều có tên; đẻ ra ô Core #4 |
| A5 | **gap-probe** — phản biện máy chạy trên contract trước Cổng 1, verdict `clean\|findings\|probe-failed`, van thoát fail-CLOSED | [`lib/gap-probe.cjs`](../../lib/gap-probe.cjs) · [`acceptance/SKILL.md:160`](../../skills/acceptance/SKILL.md) | file rỗng do `touch` rơi vào `missing`, không thành `clean` | — (áp ở Cổng 1, ca này chưa tới) |
| A6 | **Sáu điều kiện sạch + «mục VẮNG ≠ mục rỗng»** | [`acceptance/SKILL.md:272–280`](../../skills/acceptance/SKILL.md) | bỏ hẳn một mục tính là KHÔNG sạch; `pre-merge-check.sh` áp cùng sáu điều | — |

**Nhận định:** không tìm thấy ca nào họ A làm model kém đi. Trong ca r4, họ A là
nguồn của **mọi** thứ hồ sơ có mà một bản viết tay sẽ không có.

### 2.4 Họ B — luật ép HÌNH DẠNG ĐẦU RA (≥3 ví dụ)

| # | Luật | Đường dẫn | Không đỏ được ở chỗ nào |
|---|---|---|---|
| B1 | Bảng **Nguồn ngoài & phạm vi kế thừa**, cột `Kế thừa?` + `Người ký` | [`opportunity-template.md:78–80`](../../skills/acceptance/references/opportunity-template.md) | không vật nào cãi lại một dòng điền sai; và **đã có mặc định bị nuốt** ⇒ ca hỏng |
| B2 | **Bảng nợ kế thừa**, cột `Giữ / Dựng lại` | [`opportunity-template.md:102–105`](../../skills/acceptance/references/opportunity-template.md) | như trên; ca r4 điền «Giữ» cả 8 dòng |
| B3 | **`## Out of scope` ≥2 bullet**, «rỗng = cờ đỏ tại Gate 1» | [`contract-template.md:82–85`](../../skills/acceptance/references/contract-template.md) · [`opportunity-template.md:107–113`](../../skills/acceptance/references/opportunity-template.md) · [`acceptance/SKILL.md:99–100`](../../skills/acceptance/SKILL.md) | máy đếm được **số bullet**, không đọc được bullet có nghĩa hay không. Hai bullet vô thưởng vô phạt qua cổng y hệt hai bullet thật |
| B4 | **`## Coverage` là structural slot** — thiếu section = chưa đủ điều kiện vào Cổng 1 | [`feature-loop/SKILL.md`, mục «Công tắc coverage (CT-S)»](../../feature-loop/skills/feature-loop/SKILL.md) | SKILL tự khai đúng ranh giới: *«máy chỉ enforce CÓ MẶT + ghi vết; ĐÚNG/đủ thật là việc human soi tại gate»* |
| B5 | **`## Cổng 0` — ba gạch đầu dòng phải điền** (`decision` · `disposition` · ngưỡng UAT) | [`opportunity-template.md:82–93`](../../skills/acceptance/references/opportunity-template.md) | ba ô trống cạnh nhau tự đọc thành «ba việc phải hỏi». Ca r4 nở thành **ba câu người** (`opportunity.md:449–457`) — trong đó câu 3 là câu thừa |
| B6 | **Ô `[GIẢ ĐỊNH]` gom về Coverage «chờ người gạch MỘT lượt tại Cổng 1»** | [`morphological-scan/SKILL.md:14`, `:19`](../../skills/morphological-scan/SKILL.md) | đã có lưới gom-lượt (tốt), nhưng **không có bậc nào bắt máy thử giải `[GIẢ ĐỊNH]` trước khi gom**. Ca r4: 3 ô chờ người (`opportunity.md:294–297`) — ít nhất ô #2 («193 số đối chiếu đủ tin không») trùng đúng giả định §7b#3 mà chính hồ sơ khai là **chạy được ngay, không cần dựng gì** (`opportunity.md:343`) ⇒ một phép chạy được xếp vào hàng chờ chữ ký |

**Nhận định:** họ B không xấu — B3/B4 là lưới chống-quên rẻ và thật. Nhưng B là
họ DUY NHẤT có thể thay thế suy nghĩ, vì tín hiệu «xong» của nó là **sự có mặt**.

---

## 3. Giả thuyết phụ «tín hiệu XONG giả»: **ĐÚNG tại Cổng 0, SAI tại Cổng 1 và 2**

Câu hỏi owner đặt: có cơ chế nào của kit phân biệt «đủ mục» với «đủ nghĩ»?

**Có — nhưng chỉ ở Cổng 1 và Cổng 2:**

| Cổng | Chiều đỏ độc lập với khuôn |
|---|---|
| Cổng 1 (Phạm vi) | `gap-probe` phản biện contract, verdict riêng · lint W1–W6 · lưới cross-layer |
| Cổng 2 (Bằng chứng) | eval chạy thật · baseline · hội đồng judge có `required_evidence` · sáu điều kiện sạch · `pre-merge-check.sh` |
| **Cổng 0 (Đáng)** | **KHÔNG CÓ** |

### 3.1 Phát hiện: Cổng Đáng không có chiều đỏ nào — và con trỏ tới nó là con trỏ chết

Dòng đầu tiên của bản mẫu ([`opportunity-template.md:1`](../../skills/acceptance/references/opportunity-template.md)):

> `# Opportunity — khuôn D1b (điền xong mới tới red-team D2; Cổng 0 ký trên file này)`

và dòng 41: *«re-rank sau red-team D2 (giữ vết re-rank)»*.

**`red-team D2` không tồn tại trong kit.** Quét cả 40 file `.md` của `skills/`,
`commands/`, `feature-loop/`: hai dòng trên là **hai hit duy nhất** của chuỗi
`red-team` — tức bản mẫu chỉ trỏ tới chính nó, không tới thứ gì. Skill
`strategy-red-team` từng được xếp lịch vendor vào plugin `discovery-pack` (mục
**F-C** của
[`docs/plans/2026-07-27-discovery-gate0-rollout.md:36`](../plans/2026-07-27-discovery-gate0-rollout.md))
— việc đó chưa làm, và 7 pm-skills đã dọn 28/07. Thứ gần nhất còn sống là
[`morphological-scan/references/risk-premortem.md`](../../skills/morphological-scan/references/risk-premortem.md),
nhưng đó là **preset trục quét** cho một lần morphological-scan, không phải nghi
thức phản biện hồ sơ, và không bản mẫu nào trỏ tới nó ở Cổng 0.

⇒ **Bản mẫu hứa một bước phản biện mà kit không cấp.** Hệ quả đúng bằng cơ chế
§1.2, ở tầng cao hơn: khi cổng không có chiều đỏ nào, **định nghĩa duy nhất của
«xong» là «mọi mục có mặt»** — không phải vì ai chọn thế, mà vì không còn định
nghĩa nào khác tồn tại.

Ca r4 xác nhận: hồ sơ tự dựng checklist, tự soi một lượt, tự kết luận «9 lệch
khuôn + 4 sai số + 1 phát hiện» (`opportunity.md:461–474`) — **tất cả bằng thước
do chính phiên cầm**. Phiên tự chấm bài mình. Đó chính xác là điều
[`acceptance/SKILL.md:345`](../../skills/acceptance/SKILL.md) cấm ở Cổng 2
(*«Doer = grader; self-grading inflates PASS. Always fresh subagent»*) — luật đã
có, chỉ chưa chạy tới Cổng 0.

### 3.2 Đính chính một tiền đề của đề bài

Đề bài viết «cổng báo `clean`». **Không đúng với ca này:** `clean` là verdict của
`gap-probe`, sống ở Cổng 1; hồ sơ r4 dừng ở Cổng 0, `decision` và `disposition`
còn **rỗng** (`opportunity.md:7,12`), chưa cổng máy nào chấm nó. Điều đó **không
làm yếu** phát hiện — nó làm mạnh: hồ sơ mang lỗi phân loại không phải vì một
cổng gật sai, mà vì **ở đó chưa có cổng nào**.

---

## 4. Đối chứng công bằng — ba lỗi nặng nhất KHÔNG do luật, và chính kỷ luật kit bắt được

Đây là vế phải giải thích được, nếu không thì kết luận là bằng chứng chọn lọc.

| Lỗi | Vết | Nguyên nhân | Ai bắt |
|---|---|---|---|
| **«67 commit»** | `opportunity.md:171–177`; sổ quyết định `d-…40002` → đính chính `d-…40007` | đọc ngược output `git rev-list --left-right`; 67 là **main đi trước nhánh**, công của nhánh là **46** | **chạy lại lệnh** — họ A |
| **«4 người gọi»** | `opportunity.md:147–151`; `d-…40003` → `d-…40007` | grep mẫu hẹp, sót `scripts/itest-consult.ts`; thật là **5** | **chạy lại grep rộng hơn** — họ A |
| **«lát 1 = T2»** | `opportunity.md:85–90`, `:469`; `d-…40008` | quên migration 069–071 + `packages/contracts` **chưa land main** ⇒ PR nền là T3 tự động | **cột `Chạm t3_paths?`** đối chiếu `_acceptance/config.yaml` — họ A đội lốt bảng |

Cả ba là **cẩu thả thuần**, không luật nào ép ra. Và cả ba bị bắt bởi **cùng một
động tác**: *đo lại vật thật thay vì tin con số đã chép*. Đó đúng là điều họ A
tồn tại để ép.

Lỗi thứ tư cùng loại, đáng ghi vì nó chạm thẳng bất biến của kit: hình 04 gắn
badge N2 cho dòng «196 căn / 193 số» trong khi nguồn là **commit message** —
tức lời khai tay, N3 (`opportunity.md:471`). Thang bằng chứng là thang của repo
tiêu thụ, không phải của kit; nhưng nghi thức truy-nguồn-từng-số là của kit, và
nó bắt được.

**Nên đọc kết quả điều tra thế này:**

> Luật của kit trong ca này **thắng đậm về tổng**: bắt 4 lỗi thật (3 sai số + 1
> over-claim nguồn), lôi ra 1 phát hiện đổi kế hoạch, sinh 4 việc không ai nghĩ
> ra. Cái giá: **một câu hỏi thừa cho người** (mục §1.1) và **một hàng chờ chữ
> ký lẽ ra chạy được ngay** (mục B6).
>
> Tỉ số ấy nói rằng câu trả lời **không phải «bớt luật»**, mà là **chuyển đúng
> hai ô từ họ B sang họ A**. Giả định owner nêu đúng ở chỗ nó chỉ ra một lớp lỗi
> có thật; nó sẽ sai nếu bị đọc thành «luật làm model kém đi».

Một sắc thái nữa, ngược chiều giả định và cần nói thẳng: đúng **cột bảng** — thứ
đề bài nghi là thủ phạm — lại là thứ bắt được lỗi nặng nhất (`Chạm t3_paths?`).
Hình dạng bảng không phải vấn đề. **Nội dung câu hỏi trong ô** mới là vấn đề.

---

## 5. Danh sách ô đang mời quyết-định-thừa — ứng viên đổi hình, **CHƯA sửa**

Xếp theo tỉ lệ gặp lại × giá mỗi lần gặp. Cột cuối là *hình dạng* đề nghị, không
phải bản vá.

| # | Ô | Đường dẫn | Vì sao thừa | Hướng đổi hình |
|---|---|---|---|---|
| **U1** | Cột `Kế thừa?` bảng Nguồn ngoài | [`opportunity-template.md:78–80`](../../skills/acceptance/references/opportunity-template.md) | luật đã định mặc định KHÔNG cho hình thái; ô trình nó thành binary mở | giá trị mặc định **in sẵn trong ô mẫu** (`không (mặc định)`), đổi cột `Người ký` → `Căn cứ / ai ký (chỉ khi kế thừa)`; chỗ điền phải là **câu suy**, không phải tên người |
| **U2** | Cột `Giữ / Dựng lại` bảng Nợ kế thừa | [`opportunity-template.md:102–105`](../../skills/acceptance/references/opportunity-template.md) | cùng bệnh U1, chảy ngược thành «giữ hết» | tách hai cột: `Logic: giữ/dựng` (mặc định giữ) · `Hình: giữ/dựng` (mặc định **dựng**), mỗi ô kèm căn cứ 1 dòng |
| **U3** | Ba gạch của `## Cổng 0` | [`opportunity-template.md:82–93`](../../skills/acceptance/references/opportunity-template.md) | ba ô trống cạnh nhau đọc thành ba câu hỏi; ca r4 nở thành ba câu người, câu 3 thừa | ghi thẳng vào bản mẫu: Cổng 0 trình **đúng MỘT quyết định** (`decision`); `disposition` + ngưỡng là **mặc-định-kèm-căn-cứ-và-cửa-veto** (đúng luật CLAUDE.md toàn cục) |
| **U4** | `[GIẢ ĐỊNH]` gom thẳng về Coverage chờ người | [`morphological-scan/SKILL.md:14`, `:19`](../../skills/morphological-scan/SKILL.md) | thiếu bậc «thử giải trước khi gom»; ca r4 đẩy vào hàng chờ một ô mà chính hồ sơ khai là chạy được ngay | thêm một bậc trước khi gom: *có phép thử KHÔNG cần dựng không? có ⇒ chạy, ghi kết quả; không ⇒ mới gom* |
| **U5** | `## Giả định chốt sinh tử` — cột `Trạng thái` mặc định «Chưa thử» | [`opportunity-template.md:44–46`](../../skills/acceptance/references/opportunity-template.md) | bản mẫu tự in sẵn «Chưa thử» ⇒ hợp lệ khi **không thử gì**. Ca r4: 5/5 «Chưa thử», trong đó 3 cái tự khai là không-cần-dựng (`opportunity.md:339–345`, `:378–380`) | ô mẫu để **trống**, kèm luật: phép thử không-cần-dựng thì **chạy trước khi trình**, «Chưa thử» phải kèm lý do |
| **U6** | `## Out of scope` ≥2 bullet | [`contract-template.md:82–85`](../../skills/acceptance/references/contract-template.md) | không đỏ được (đếm bullet, không đọc nghĩa) — **giữ nguyên**, ghi ở đây để danh sách đủ | không đổi; đã có `descope` ledger làm chiều răng |

**U1 + U3 là cặp gây ra đúng ca này.** U4 + U5 cùng một hình dạng ở tầng khác
(*hàng chờ người nuốt mất phép thử rẻ*) và có tỉ lệ gặp lại cao hơn.

---

## 6. Phép thử rẻ đề nghị: **PHÉP THỬ CHỦ NGỮ**

Bài toán: phát hiện sớm ca «một phép suy bị biến thành câu hỏi khẩu vị» khi
khung đổi mà bề mặt cũ được mang sang.

### 6.1 Thủ tục — bốn động tác, chạy bằng máy, không hỏi ai

1. Với **mỗi bề mặt đang sống** được đề nghị kế thừa: **chép nguyên văn** câu mở
   màn của nó — nhãn tab, tiêu đề màn, nhãn nút chính, dòng trạng thái đầu tiên.
   Nguyên văn từ code, không diễn giải.
2. **Gọi tên chủ ngữ** của bộ câu ấy: *ai là người những câu này đang nói tới /
   nói với?*
3. Chép chủ ngữ của **khung mới** từ hồ sơ cơ hội (một câu, đã có sẵn).
4. So. **Lệch ⇒ bề mặt phải đổi, ghi như PHÉP SUY.** Không lệch ⇒ hình kế thừa
   được, **không cần chữ ký**.

Đắt: một lượt `grep` chuỗi hiển thị. Đỏ được: **có** — chủ ngữ suy từ **chuỗi
thật trong cây nguồn**, không phải từ ý kiến; điền bừa thì mở file ra là thấy.
Tức nó **là họ A**, không phải họ B.

### 6.2 Chạy thử trên chính ca r4 — và nó tách đôi câu hỏi mà phiên đã gộp

Chép từ nhánh kho `claude/vibrant-ishizaka-189847`:

| Bề mặt | Câu mở màn (nguyên văn trong code) | Chủ ngữ |
|---|---|---|
| Workbench 4 tab (`components/consult-workbench/*`) | «Bảng hàng» · «Chính sách giá» · «Dự án mới» · «Sạch — chờ duyệt» · «Nạp khuôn phiếu CT5B» · «Ưu đãi (bậc thang tuần tự — thứ tự là thứ tự áp)» | **Sàn** — mọi câu nói việc *nhập · duyệt · khai*; không câu nào nói việc *khuyên* |
| Thẻ căn PNG (`plugins/consult-page/view/unit-card-png.tsx`) | «Thanh toán sớm» · «Giá tiến độ» · «Vay 70% · HTLS» · «DT thông thuỷ» · «DT tim tường» | **Khách** — mọi câu là phương án *của khách* |
| Trang sống (`app/d/[shortcode]/page.tsx`) | «Môi giới» (nhãn người gửi) · «Không tìm thấy» | **Khách xem, môi giới đứng tên** |

Chủ ngữ khung r4 (`opportunity.md:62`): *«tạo VŨ KHÍ CHO MÔI GIỚI KHUYÊN»* ⇒
**môi giới khuyên khách**.

Kết quả:

- **Workbench: LỆCH** (sàn ≠ môi giới). ⇒ hình phải đổi. **Phép suy, không phải
  câu hỏi.** — và nó trùng đúng điều phiên đã tự viết ở `opportunity.md:200`
  («đổi vai: cổng-vào-bắt-buộc → làm-giàu-dần») rồi vẫn đem đi hỏi.
- **Thẻ PNG + trang sống: KHÔNG LỆCH** (khách vẫn là khách; môi giới vẫn là
  người gửi). ⇒ **mặc định áp được, không cần chữ ký.**

⇒ Phép thử **tách đôi** thứ phiên đã **gộp thành một câu hỏi**, và giải cả hai
vế mà không tốn lượt gọi người nào. Đó là toàn bộ giá trị của nó.

**Ranh giới phải nói rõ:** phép thử trả lời *«bề mặt này có phải đổi không»* —
nó **không** trả lời *«đổi thành cái gì»*. Vế sau là thiết kế thật, thuộc S1-D.
Và đây là **chạy thử phép thử trên vật**, không phải phán quyết r4: kết luận r4
thuộc vòng r4.

### 6.3 Chỗ đặt nếu owner cho làm (vòng riêng)

Rẻ nhất: một dòng trong section «Nguồn ngoài & phạm vi kế thừa» của bản mẫu —
*dòng phân loại `ngôn-ngữ-thiết-kế/hình-thái` phải kèm kết quả phép thử chủ ngữ;
lệch ⇒ điền `không` + câu suy; không lệch ⇒ điền `có` + câu suy* — tức nó **hợp
nhất luôn với U1**, không đẻ cơ chế mới. Đúng nếp «chỉ TRỪ, không CỘNG»: một ô
đang hỏi khẩu vị được đổi thành một ô hỏi phép đối chiếu.

---

## 7. Việc kế — owner quyết ở vòng riêng

Vòng này **không sửa file kit nào** (owner chốt). Đưa ra ba nhóm, xếp theo giá:

1. **U1 + U3 + phép thử chủ ngữ** — cùng một section của một file bản mẫu, một
   lượt sửa. Đây là thứ vá đúng ca vừa xảy ra.
2. **U4 + U5** — hàng-chờ-người nuốt phép thử rẻ; tỉ lệ gặp lại cao hơn, nhưng
   chạm 2 file và chạm nghi thức, nên đắt hơn.
3. **Cổng 0 không có chiều đỏ** (§3.1) — món đắt nhất và là **quyết định thật**,
   không phải lưới: hoặc gỡ con trỏ chết `red-team D2` khỏi bản mẫu (rẻ, thành
   thật), hoặc cấp cho Cổng 0 một chiều đỏ (đắt, đúng bệnh). Không nên gộp vào
   hai nhóm trên.

---

*Vật đối chứng của cuộc điều tra này nằm nguyên trong `artifact-platform`:
`_acceptance/trang-tu-van-v2-r4/opportunity.md` + `decisions.jsonl`, nhánh
`docs/r4-cong-dang`, PR #352. Hồ sơ đó chưa ký Cổng 0 — mọi trích dẫn ở trên là
trạng thái ngày 15/08/2026.*
