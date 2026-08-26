# Hạt giống — Vào có ô, ra có tên

**Ngày:** 2026-08-21 · **Trạng thái:** hạt giống, chờ Cổng 0 · **Hạng dự kiến:**
T2 (một nghi thức ngắn thay một con trỏ chết + một nhóm hiển thị trong thẻ
`/start` + một dòng tuổi; không chạm lưới, không chạm hồ sơ đã ký, không skill mới).
**Sinh từ:** owner nêu vấn đề 21/08 — *«brainstorm xong thì để trong repo tiêu
thụ → sau một thời gian quên → thành rác»* — và phiên chẩn đoán cùng ngày.
**Tên luật** owner chốt 21/08: **Vào có ô, ra có tên.**

> Chữ trong file này là NGUỒN. Hai hình tầng 2 đi kèm (mục 8) là chiếu:
> `assets/2026-08-21-hat-giong-vao-co-o-ra-co-ten/` — H3 flowchart «một cửa vào,
> ba nhịp tim, bốn số phận» và H4 loop «Vòng từ ý đến số».

## 0. Tóm tắt một đoạn

«Quên» không phải lỗi trí nhớ, là lỗi **cấu trúc**: kit có đúng ba người đọc
định kỳ — `/start` mỗi phiên, bản đồ sản phẩm mỗi lần đóng cổng, lưới mỗi PR —
và cả ba chỉ đọc vật có `status`/`stage` trong `_acceptance/`. Brainstorm hiện
kết bằng một spec rời trong `docs/`, tức sinh ra đúng loại vật **không ai đọc**.
Điều bất ngờ khi soi nguồn: **ô và nhịp tim đã có sẵn** — `opportunity.md` ở
`stage: discovery` được bản đồ xếp vào «Đang cân nhắc» và được `start-scan`
đưa lên thẻ kèm mốc chờ. Thứ thiếu là **cửa vào**: `/start` lối (a) bảo đi
«nghi thức grill của kit» — nghi thức đó **không tồn tại ở đâu** (con trỏ chết,
cùng loại `red-team D2`), nên brainstorm đi vòng, ra spec, rồi rữa. Và thiếu
**luật lối ra**: «để đó» là trạng thái hợp lệ vô hạn. Đề xuất: một luật hai vế
— *vật vào vòng phải có ô trong hồ sơ; vật ra khỏi vòng phải mang tên số phận*
— hiện thân bằng **một nghi thức ngắn thay con trỏ chết + một nhóm «Đang cân
nhắc» riêng trên thẻ `/start` có tuổi**. Không skill mới: đồng nhất đến từ một
cửa vào, không từ một công cụ nữa.

## 1. Lỗ — bằng chứng trên nguồn (21/08, main `345f42ee`)

**Repo tiêu thụ (artifact-platform):**

| Số đo | Giá trị |
|---|---|
| File trong `docs/superpowers/specs/` | **171** |
| …trong đó không có hồ sơ xưởng cùng slug (đếm xấp xỉ) | **~75** |
| Hồ sơ cơ hội `opportunity.md` | **3** (1 `discovery` · 1 `kill` · 1 `build`) |
| Bản đồ sản phẩm, ô «Đang cân nhắc cơ hội» | **1** |

**Chính kit:** 12 hạt giống trong `docs/plans/`; bản đồ của kit ghi «Đang cân
nhắc: *chưa có*»; ít nhất 2 file vẫn đề «chờ Cổng 0/1» dù việc đã ship (gỡ lớp
chứng minh chữ ký → PR #59; tool-kill → PR #68). Dòng `Trạng thái:` viết tay
trong hạt giống là bản sao của một trạng thái không máy nào đọc — nó rữa đúng
như spec rời bên repo tiêu thụ.

**Ô đã có — kiểm trên nguồn:**

- `scripts/product-map.mjs:179` — `opportunity.md` chưa `decided` → bucket
  `can-nhac` («Đang cân nhắc cơ hội»).
- `scripts/start-scan.mjs:241` — cùng điều kiện → `groups.gates[]` với
  `gate: 'dang'`, `since` lấy từ `decided_at` hoặc mtime; `:245` xếp cổng chờ
  lâu nhất lên đầu.

**Cửa vào không có — kiểm trên nguồn:** `commands/start.md:63,68` trỏ tới
«nghi thức grill của kit theo khuôn `opportunity-template.md`»; grep toàn bộ
`skills/ commands/ GUIDE.md` cho «grill» chỉ trả về hai dòng đó. Khuôn có,
nghi thức dùng khuôn không có. Người (và agent) không tìm thấy nghi thức thì
dùng thứ gần nhất: brainstorm tự do → spec.

## 2. Kiểm bằng first principles từ North Star

| Nguyên tố | Với ý tưởng nghĩa là | Hiện trạng | Kết |
|---|---|---|---|
| ① Ý định chốt trước khi làm | Ý tưởng phải vào được chỗ mà Cổng Đáng đọc | Chỗ có; đường vào chỗ không có | **Thiếu cửa** |
| ② Bằng chứng không tự dối | Bản đồ nói «Đang cân nhắc: 1» phải là sự thật | Nói «1» trong khi ~75 ý nằm ngoài — bản đồ đúng với hồ sơ, sai với thực tế | **Hồ sơ thiếu, không phải bản đồ sai** |
| ③ Khoảnh khắc quyết thật | Ý tưởng phải gặp người đúng một lần để nhận số phận | «Để đó» không bao giờ gọi người; kết cục là rữa, không phải quyết | **Thiếu lối ra có tên** |

Ba giả định dễ tự lừa đã kiểm:

- *Có nên là một skill mới?* — **Không.** (a) `/start` đã là cửa; thêm skill là
  bản thứ tư của cùng nghi thức (superpowers brainstorming · product-management
  brainstorm · `/start` · skill mới) — lớp «thế giới song song» đã dọn 28/07 với
  số liệu 8 skill = 1 lượt dùng. (b) Ghi ý tưởng là **hành vi người**: skill mở
  thì agent tự gọi, đỉnh phễu ngập ý tưởng máy sinh, Cổng Đáng mất nghĩa — nên
  nó thuộc lệnh bị khoá model-invocation (ADR 0002), đúng chỗ `/start` đang đứng.
- *Đây có phải trạm thu phí?* — **Không.** Không thêm lần gọi người: stub sinh
  trong chính buổi khai thác đang diễn ra; lối ra chọn trên thẻ `/start` người
  đang đọc sẵn. Thứ duy nhất đổi là ý tưởng **hiện ra** thay vì biến mất.
- *Mọi stub có làm ngập nhóm «Chờ chữ ký»?* — **Có, nếu để nguyên** — và đây là
  điểm thiết kế thật: hôm nay mọi `opportunity.md` chưa quyết đều thành cổng
  `dang`; với 30 ý tưởng thì nhóm quan trọng nhất của thẻ bị 30 dòng đè. Luật
  phải tách: **stub chưa có ngưỡng = «đang cân nhắc», không phải cổng**; chỉ hồ
  sơ đã điền ngưỡng sống/chết mới là cổng `dang` chờ chữ ký. Xem mục 3.2.

## 3. Đề xuất — luật hai vế, ba chỗ sửa, TRỪ/CỘNG minh bạch

**Luật:** *Vào có ô, ra có tên.* Vật vào vòng phải có ô trong hồ sơ xưởng; vật
ra khỏi vòng phải mang một trong các tên số phận đã khai (`build · iterate ·
park · kill` ở Cổng Đáng; `release · iterate · kill` ở Cổng Giá trị). Không có
trạng thái «để đó». Luật này là **cùng một luật** với hạt giống đường-đo (PR
#71): ngưỡng khai trước mà không có đường ra thành số cũng là «ra không có tên».

1. **Cửa vào — thay con trỏ chết bằng nghi thức thật (≤15 dòng).** Trong
   `commands/start.md` lối (a), hoặc một reference ngắn cạnh
   `opportunity-template.md`: buổi khai thác vòng HIỂU (bất kể chạy bằng skill
   nào qua ổ `discovery.brainstorm_skill`) **kết bắt buộc** bằng stub
   `_acceptance/<slug>/opportunity.md` — frontmatter theo khuôn
   `OPP-FRONTMATTER-TEMPLATE`, `stage: discovery`, section «Vấn đề & ai gặp»
   có ít nhất một câu; các section khác để trống hợp lệ. **Spec chỉ sinh ở S1,
   sau Cổng Đáng.** Nếp không cần code đi kèm: *brainstorm không qua `/start`
   thì coi như chưa brainstorm.* Đường cũ không bị cấm — chỉ không còn là mặc
   định, và không được bản đồ đếm.
2. **Thẻ `/start` — nhóm «Đang cân nhắc» riêng, có tuổi.** `start-scan.mjs`
   tách bucket: `opportunity.md` chưa `decided` **và chưa điền** section
   «Ngưỡng chết / ngưỡng UAT» → `groups.considering[]` (slug · name · `since` ·
   tuổi tính bằng ngày); đã điền ngưỡng → cổng `dang` như nay. Thẻ in nhóm này
   **một dòng gộp** dưới «Đang dở»: «Đang cân nhắc: N ý · cũ nhất X ngày» + tối
   đa 3 dòng cũ nhất. Người chọn một dòng → bàn giao sang buổi khai thác tiếp
   (điền ngưỡng → thành cổng) hoặc ghi thẳng `park`/`kill`. Máy nhắc tuổi,
   **không tự quyết số phận**.
3. **Áp cho chính kit — hạt giống là hồ sơ cơ hội.** Mỗi hạt giống trong
   `docs/plans/` có một stub `_acceptance/<slug>/opportunity.md` trỏ tới nó;
   dòng `Trạng thái:` viết tay trong file hạt giống **bỏ đi** — trạng thái sống
   ở frontmatter stub, nơi `start-scan` và bản đồ đọc. Bản đồ của kit hết nói
   «Đang cân nhắc: chưa có». (Đây là TRỪ một dòng rữa, CỘNG một stub máy đọc.)

**Ổ cắm:** `discovery.brainstorm_skill` giữ nguyên vai — đây là chỗ
`product-management:brainstorm` hay skill brainstorm nào khác có vai trò thật;
nghi thức ở mục 3.1 chỉ quy định **đầu ra** của buổi, không quy định cách chạy.

**Không làm:** không skill mới · không nghi thức retro cho vòng học · không
migrate hàng loạt 75 spec (sử liệu; áp luật từ nay; một lượt triage tay nếu owner
muốn lôi vài ý còn sống lên thành stub) · không để máy tự `kill` theo tuổi ·
không đổi khuôn `opportunity-template.md` (hạt giống «ô nuốt luật» 15/08 giữ quyền
đó) · không đổi bản đồ sản phẩm (bucket `can-nhac` đã đúng).

## 4. Chiều đỏ — thước gắn vào vật, ma trận viết trước

Vật được giao là **thẻ `/start`** (qua `start-scan.mjs`) và **bản đồ**; cả hai đã
có round-trip fixture (`START-SCAN-KEYS`, P115). Fixture workspace do code sinh
trong chính lần chạy, đi qua chính hai script thật:

| Ca | Fixture | Mong đợi | Vai |
|---|---|---|---|
| R+ | `opportunity.md` `stage: discovery`, có «Vấn đề», **chưa** ngưỡng | vào `groups.considering` với `since`; **không** vào `gates`; bản đồ đếm `can-nhac` = 1 | đối chứng dương |
| R− | cùng fixture, điền ngưỡng sống/chết | rời `considering`, vào `gates` với `gate: 'dang'` | chiều đỏ của phép tách |
| R0 | repo không có `opportunity.md` nào | `considering` rỗng, thẻ **không in** dòng «Đang cân nhắc» | cô lập lớp — luật không rò sang repo không có ý tưởng |
| RK | `START-SCAN-KEYS` thêm `groups.considering[].slug/since/age` | đổi tên một phía → case round-trip đỏ | giữ hợp đồng máy-đọc |

Đường đo cho **hành vi** (buổi khai thác có thật sự kết bằng stub không) **cố
tình không mở** vòng này — cùng nếp hạt giống 15/08 «ô nuốt luật»: mã tiền định trước, hội
đồng phiên sạch chỉ khi con trỏ sống rồi mà spec rời vẫn sinh lần thứ ba. Phép
đo rẻ thay thế: đếm định kỳ `opportunity.md` mới so với spec mới ngoài hồ sơ —
tỉ lệ đó là M1 của hạt giống này.

## 5. Quan hệ với các hạt giống khác

- **Đường đo trong định-nghĩa-xong (21/08, PR #71):** hai vế của **cùng một
  luật**. File này là vế «vào có ô» + «ra có tên» ở Cổng Đáng; PR #71 là «ra có
  tên» ở Cổng Giá trị (ngưỡng phải có đường về số). Mở được độc lập; nếu cùng
  chuyến, đặt tên hồ sơ chung là tên luật.
- **«Ô nuốt luật» (15/08, PR #56):** nó đổi hai ô của khuôn cơ hội (U1 · U3) và
  **cấm đụng** `red-team D2`; file này chỉ đọc khuôn, không đổi khuôn. 15/08 đi
  trước nếu cùng chuyến. Cả hai cùng vá một lớp: **con trỏ chết trong `/start`
  lối (a)** (`grill` và `D2`).
- **Ba chỗ tích luỹ không đường ra (21/08):** ý tưởng là **chỗ thứ tư** — cùng
  hình dạng «mỗi lượt để lại một lớp, không luật nào lấy đi».

## 6. Vấp dự đoán, ghi trước

- **Đừng viết bộ đọc thứ hai.** `considering` phải suy từ chính `navValues` /
  `readRecord` trong `lib/workspace-record.cjs` mà bản đồ và `start-scan` đang
  dùng; «đã điền ngưỡng» xét bằng **có/không nội dung dưới heading** «Ngưỡng
  chết / ngưỡng UAT», không parse văn xuôi (lớp «đo từ vựng thay vì quan hệ»).
- **Stub phải bắt đầu đúng ở dòng `---`** — template đã cảnh báo: chép cả hàng
  rào ```` ```yaml ```` là hồ sơ hỏng, rơi vào `broken[]`. Nghi thức mục 3.1
  phải nhắc câu này, vì đây là lỗi người mới dẫm chắc chắn.
- **Tuổi không phải phép đo.** Máy in tuổi để người nhìn; không đặt ngưỡng tuổi,
  không tự chuyển `park`. Ngày tự đặt ngưỡng là ngày luật thành trạm thu phí.
- **Kit tự-host đi nhánh R0 cho đến khi mục 3.3 chạy** — suite xanh của kit
  không chứng minh gì cho repo tiêu thụ (đo ở phía consumer).
- **Hai phiên song song cùng thêm ca kiểm** → đụng số ca trong `run-tests.sh`;
  ca mới để **file riêng** theo nếp hạt giống ba-chỗ-tích-luỹ, không chen vào
  file đánh số toàn cục.

## 7. Điều cố tình không làm

Không tạo skill «ghi ý tưởng» · không đem roadmap/portfolio của sản phẩm vào kit
(product context, sống ở repo tiêu thụ) · không cấm đường cũ (chỉ không đếm) ·
không dựng retro/vòng học (lỗ L3, hàng đợi reflect) · không chạm đoạn Cổng Phạm
vi → Cổng Bằng chứng.

## 8. Hình (tầng 2, cùng commit với file này)

| # | Loại | Câu hỏi nó trả lời | File |
|---|---|---|---|
| H3 | Flowchart | một cửa vào · ba nhịp tim · bốn số phận; đường cũ nét đứt | `assets/2026-08-21-hat-giong-vao-co-o-ra-co-ten/y-tuong-co-o-va-loi-ra.html` (+ `.svg` · `.png`) |
| H4 | Loop | **Vòng từ ý đến số** — hai hạt giống cắm vào đâu trong vòng outcome; bản đồ là trục | `assets/2026-08-21-hat-giong-vao-co-o-ra-co-ten/vong-tu-y-den-so.html` (+ `.svg` · `.png`) |

Hình là chiếu của mục 1–3; đổi luật thì sửa chữ rồi vẽ lại, không sửa hình.
`.svg`/`.png` xuất cạnh nguồn theo tiền lệ `ba690a3c` (bản HTML không mở inline
được trong app).

## 9. Phụ lục — ổ cắm `product-management` (owner chốt 21/08: Vòng HIỂU gọi brainstorm của nó)

Đọc thân thật của 9 skill trong plugin `product-management` (Anthropic) ngày 21/08.
Hai sự thật quyết định cách cắm:

- **Harness khác.** Plugin sống trong Claude desktop (chế độ agent cục bộ,
  `~/Library/Application Support/Claude/local-agent-mode-sessions/…/plugin_…/skills/`),
  **không** trong marketplace Claude Code. Phiên CLI thuần không thấy nó. Ổ cắm
  của `/start` đã lường ca này (nhánh ba: khai mà phiên không có → nói thẳng, đi
  grill nội bộ) — cắm được, không sợ con trỏ chết; nhưng buổi khai thác bằng
  skill này chỉ xảy ra ở phiên có plugin.
- **Mọi skill viết cho connector** (knowledge base · analytics · tracker · chat);
  chưa uỷ quyền thì chạy chế độ dán tay. Với kit chỉ **hai** connector đáng bật:
  analytics (Amplitude/Pendo — phía đọc của đường đo, hạt giống PR #71) và
  tracker (đầu vào lối (b) của `/start`).

### 9.1 Cắm `brainstorm` vào Vòng HIỂU — ĐÃ TRỪ 2026-08-23

> **TRỪ khỏi kế hoạch** (hồ sơ `start-bang-dieu-khien`, AC-10). Hai lý do:
> skill đó là hội thoại «thinking partner» — nhiều lượt hỏi mở, người ngồi giữa
> vòng trả lời — đúng thứ luật kit gọi là «hỏi mở là đường cùng»; và cắm một
> skill bên-thứ-ba làm MẶC ĐỊNH trái luật ổ cắm (đích không tồn tại ở repo
> khác). Mặc định của kit nay là **máy phân kỳ theo khuôn** rồi trình MỘT câu
> đóng — hai phiên 22/08 chạy lối đó, owner quyết trong một chạm cả hai lần.
>
> **Ổ cắm `discovery.brainstorm_skill` GIỮ NGUYÊN** — nó trung tính, repo nào
> muốn tự khai vẫn khai được; kit chỉ thôi cắm sẵn ai vào đó.
>
> Phần dưới giữ nguyên làm sử liệu, KHÔNG còn là kế hoạch.


Repo tiêu thụ khai trong `_acceptance/config.yaml`:
`discovery.brainstorm_skill: product-management:brainstorm` (cắm **lệnh**
`brainstorm` — nó là quy trình + đóng phiên; `product-brainstorming` là thân
4 chế độ / 7 khung, đi kèm, không cắm riêng).

Mục «Close the Session» của skill rơi vào hồ sơ cơ hội đến từng ô — máy chép,
người không điền form:

| Skill sinh ra | Ô trong `opportunity.md` |
|---|---|
| Key ideas + *strongest direction, take a position* | «Vấn đề & ai gặp» + khuyến nghị kèm căn cứ |
| **Riskiest assumption** + *cheapest way to test it* | hàng #1 bảng «Giả định chốt sinh tử» (cột *Nếu sai thì* · *Phép thử rẻ nhất*) |
| **Parked ideas** (*worth revisiting, not now*) | stub riêng, lối ra `park` — đúng luật này |
| «Do not confuse brainstorming with decision-making» | Cổng Đáng là của người — skill tự khai ranh |

**Hai ghi đè bắt buộc** (luật kit thắng thân skill):
1. Skill kết bằng tóm tắt trong chat → mục 3.1 vẫn đứng: **kết buổi = stub
   `opportunity.md`**, máy chép «Capture» vào stub.
2. Mục «Follow Up» của skill mời `/write-spec` → **im**. Spec chỉ sinh ở S1,
   sau Cổng Đáng.

### 9.2 Hai skill dùng ad hoc, có luật

- `synthesize-research` — biến ghi chú phỏng vấn/ticket thành findings có tần
  suất · tác động · độ tin + trích dẫn có nguồn: đúng «bằng chứng thực địa
  (ngày + nguồn)» mà ô «Vấn đề & ai gặp» đòi. **Đầu ra trỏ từ stub** (section
  «Nguồn ngoài & phạm vi kế thừa»), không thành tài liệu rời; mục *Opportunity
  Areas* có thể đẻ nhiều stub.
- `metrics-review` — scorecard hiện tại · kỳ trước · mục tiêu. Dùng ở Cổng Giá
  trị §4 **chỉ để lập bảng số**; phần *Status / Recommended Actions* **không
  được phán thay người** (kit cấm máy điền verdict; ngưỡng chép nguyên văn,
  không đổi). Mục «metrics we should be tracking but are not» = phát hiện
  đường-đo-thiếu → đổ ngược về hạt giống PR #71.

### 9.3 Không cắm — và vì sao

- `write-spec`: PRD trọn gói, **trùng** hợp đồng (Given/When/Then · non-goals)
  và trùng ngưỡng, trong một container ngoài hub. Không gọi trong vòng; PRD từ
  nơi khác thì Phase 1 của skill acceptance đã ăn được như input. **Thu hoạch
  một ý:** trường *measurement method (tool · query · window)* của nó chính là
  `## Đường đo` — xác nhận hướng PR #71.
- `roadmap-update`: nếu **ghi** là tạo nguồn thứ hai cạnh bản đồ máy sinh (ADR
  0007). Chỉ được **đọc** `PRODUCT-MAP.md` để kể Now/Next/Later cho người
  ngoài; RICE/ICE có thể giúp người *xếp* các stub đang cân nhắc — xếp, không
  quyết.
- `sprint-planning`: kit không có sprint, nhịp theo cổng. Đội có sprint thì
  `status` hồ sơ là nguồn cho board, không ngược lại.
- `stakeholder-update`: consumer của bản đồ + hồ sơ nghiệm thu; nguồn phải là
  hồ sơ, không từ trí nhớ; không lấy khuôn ADR dài của nó (kit có ADR 1-đoạn).
- `competitive-brief`: nuôi «Giả định sinh tử» khi đề bài có yếu tố thị trường;
  ad hoc, giá trị thấp hơn mục 9.4.

### 9.4 Ghi chú cho hạt giống «chiều đỏ Cổng Đáng» — CHƯA TỒN TẠI

Thân `product-brainstorming` có chế độ **Assumption Testing** (liệt kê mọi giả
định · cái nào giết ý tưởng · phép thử rẻ nhất · *argue the strongest case
against*) — đúng hình dạng của `red-team D2` đang là con trỏ chết. Không cắm ở
hạt giống này. **Đính chính 21/08:** hạt giống 15/08 là «ô nuốt luật» (U1+U3) và
nó CẤM đụng D2 — nhóm «Cổng Đáng chưa có chiều đỏ» chưa có hạt giống. Ghi lại
để hạt giống ĐÓ, khi được mở, biết D2 có thể là **một chế độ của skill đã cắm**, không cần nghi
thức mới.

Phép thử một-mặt-phẳng phân loại đúng toàn bộ: ba skill sống (brainstorm ·
synthesize-research · metrics-review) đều đọc/ghi vào hồ sơ thật; ba skill đẻ
tài liệu song song (write-spec · roadmap-update · sprint-planning) là lớp sẽ về
0 invoke như 7 pm-skills dọn 28/07.

## Nguồn

- North Star + ba nguyên tố: `CLAUDE.md`, `docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md`.
- Ô đã có: `scripts/product-map.mjs:36,179` · `scripts/start-scan.mjs:241,245` ·
  `lib/workspace-record.cjs` (`navValues`, `readRecord`).
- Con trỏ chết: `commands/start.md:60–70` (lối (a), «nghi thức grill»).
- Khuôn: `skills/acceptance/references/opportunity-template.md`
  (`OPP-FRONTMATTER-TEMPLATE`, cảnh báo hàng rào yaml).
- Khoá model-invocation: `docs/adr/0002-human-gate-invocation-lock.md`.
- Tiền lệ dọn skill 28/07 (8 pm-skills = 1 lượt dùng; skill rời mặt phẳng thì
  chết): sổ nhớ phiên, mục «một mặt phẳng làm việc».
- Số liệu repo tiêu thụ: đếm 21/08 trên `~/dev/artifact-platform`
  (`docs/superpowers/specs/`, `_acceptance/*/opportunity.md`).
- Hạt giống anh em: `2026-08-21-hat-giong-duong-do-trong-dinh-nghia-xong.md` ·
  `2026-08-15-hat-giong-ban-do-dinh-chu-ky.md` (nếp «mã tiền định trước») ·
  `2026-08-21-hat-giong-ba-cho-tich-luy-khong-duong-ra.md`.
