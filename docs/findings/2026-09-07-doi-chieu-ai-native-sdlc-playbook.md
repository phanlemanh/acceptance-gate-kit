# Đối chiếu «The AI-Native SDLC playbook» với kit — 2026-09-07

> **Bản dễ đọc + hình + ba câu trả lời cho owner (top 3 · đã có chỗ · sửa ngay):**
> [2026-09-07-bai-hoc-playbook-ban-de-doc.md](2026-09-07-bai-hoc-playbook-ban-de-doc.md).
> File này là hồ sơ bằng chứng — giữ nguyên `file:line`.

> **Nguồn đã lưu trong repo:** [docs/research/2026-09-07-ai-native-sdlc-playbook.md](../research/2026-09-07-ai-native-sdlc-playbook.md)
> — Anthropic Applied AI, đăng 21/08/2026, tải 07/09. 1084 dòng: 6 stage · 14
> play · 1 sidebar · 1 worked example, mỗi play đủ *Governance considerations*
> và *How to measure it*.
>
> **Cách chấm:** 3 lượt lập bản đồ kit (81 mục kèm `file:line`) → 6 lượt đối
> chiếu, mỗi stage một lượt độc lập (18 bài thô) → gộp còn 9 → **mỗi bài qua 2
> lăng kính bác bỏ độc lập** («kit đã có rồi» · «vi phạm luật kit») → 1 lượt phê
> bình độ đầy đủ đọc lại trọn playbook. 30 lượt máy, 4,34 triệu token.
> Mọi `file:line` dưới đây đã kiểm lại tay trên `main` 07/09; ba chỗ bản đối
> chiếu nói sai nằm ở mục **F**.

## Số phải đọc trước

**0/9 bài sống nguyên văn.** Cả chín đều bị ít nhất một lăng kính bác. Nhưng
8/9 còn lõi sau khi bị phát biểu lại — và lý do bị bác lặp đúng ba hình dạng:
*tố kit thiếu thứ kit đã có* · *đề nghị CỘNG trong khi luật là chỉ TRỪ* ·
*phát hiện đã nằm trong một ô đang sống*. Ba hình dạng đó chính là thứ đáng ghi:
người đọc playbook lần sau sẽ nảy đúng chín ý này.

Bài đọc lớn nhất **không** nằm trong chín bài. Nó ở mục **B**: playbook chỉ ra
bốn lớp «máy tin nhầm chính nó» mà cả kit lẫn chín bài đối chiếu đều không
canh.

---

## A. Ba việc có lõi và có chiều đỏ

### A1. Cửa thoát được mời, nhưng không ai đứng ở chỗ ghi ⭐

Thẻ Cổng Bằng chứng của hồ sơ làn V in ra ô **«veto hay để yên: ___»** và bảo
người «trả lời dạng «veto: nêu lý do» nếu muốn dừng»
(`scripts/gate-card.js:818, 991-994`). Nhưng **không lệnh nào của kit biết nhận
chữ đó**: ngữ pháp câu gộp của `commands/signoff.md:30-52` liệt năm ô — Ngoài-số
· mã eval · cắt/hoãn · Treo · «ký hay trả» — không có ô veto; bản luật ngôn ngữ
mặt người grep «veto» = **0**.

Răng thì đã canh sẵn hai chiều: `scripts/pre-merge-check.sh:1226-1227` chặn hồ
sơ `da-veto` chưa xử, `:1239-1247` bắt việc gỡ khoá phải kèm entry sổ. Tức kit
có **một cặp răng đang canh một trạng thái mà không đường nào trong kit sinh
ra**. Cửa veto đã mở đúng một lần thật (`5002ffb3`, 27/08) và lần đó là ứng
biến: nó đẻ ra khoá `veto_closed_at` mà không mã nào của kit đọc.

- **Playbook nói gì:** dòng 889 — đường lùi phải là đường **được tập nhiều
  nhất**, chứng minh trước chứ không phải lúc cần. Dòng 719-720 — chặn thì lý do
  *và* đường đi tiếp phải hiện ngay tại chỗ.
- **Nguyên tố 3** (cổng phải có ≥2 lối ra **sống**). **Người hưởng:** owner trực
  tiếp; máy gián tiếp — mọi quyền đi-trước của làn V tựa vào câu «đường đảo còn
  sống», mà hôm nay câu đó chưa được chứng minh trên đường thật.
- **Giá:** 0 lượt gọi người thêm · 0 chạm thêm · 0 đổi schema (`da-veto` đã hợp
  lệ, răng đã có).
- **Chiều đỏ:** gõ «veto: lý do» ở một hồ sơ làn V → phải ra `veto_state:
  da-veto` + entry sổ trong **một** lượt, và `pre-merge-check.sh:1226` phải chặn
  hồ sơ đó. Đối chứng dương: hồ sơ `mo` phải qua.

### A2. «Không đo được» đang đọc y hệt «đo xong, sạch»

Ở chốt trước-merge, khi lượt soi-lại bằng chứng **chạy được và thấy hỏng** thì
chế độ nghiêm cho `VIOLATION`; nhưng khi nó **không chạy được** thì mọi mã thoát
≠0/1 rơi xuống một dòng `NOTE` — **không điều kiện, kể cả ở chế độ nghiêm**
(`scripts/pre-merge-check.sh:1185-1188`). Lõi luật không nạp được →
`scripts/recheck-evidence.cjs` thoát mã 2 → NOTE. Hook bằng chứng cũng fail-open,
và chú thích của chính nó tự khai hậu quả: «a broken install silently disables
enforcement while every downstream signal still reads green»
(`hooks/acceptance-evidence-gate.js:70-86`).

Doctrine ngược nằm ngay trong cùng file: `scripts/pre-merge-check.sh:100-108` —
đã khai phạm vi mà **không dựng được** phạm vi thì exit 2, không phải skip.

- **Playbook nói gì:** dòng 837-840 — thứ biến một lớp thành cổng thật là
  `failIfUnavailable`: **hỏng thì không chạy**, và lệnh trượt trong hộp cát
  không được chạy lại ngoài hộp cát.
- **Nguyên tố 2. Người hưởng: MÁY** — nó đang đọc «cổng xanh» thành «đã được
  chấm».
- **Lời giải đúng dạng TRỪ:** ở chế độ nghiêm, «không soi lại được» tính là
  **vi phạm**, ngang với «soi lại thấy hỏng». Không thêm trường hồ sơ, không
  thêm nhịp chạy.
- **Chiều đỏ đã đo thật trong phiên đối kháng:** bẻ lõi luật trong một bản sao →
  cùng báo cáo cho `exit 0` + `NOTE [...]: evidence re-check unavailable (exit
  2)`; dòng tự xưng hạ tầng y hệt lượt xanh. Đối chứng dương cùng bản sao: lõi
  lành → `VIOLATION [...]: committed evidence fails re-check (recheck: strict)`.

### A3. Cổng kế hoạch là cổng duy nhất chưa có ca-rỗng

Luật lời-mời 01/09 phát biểu phổ quát cho **mọi** cổng: phân loại từng mục theo
nguồn căn cứ, hết mục chỉ-người-biết và không khó-đảo thì đi làn V. Ba cổng kia
đã có đường đó. Gate 1.5 thì thân skill vẫn viết cứng: **«T3: GATE 1.5 — trình
tóm tắt plan (task list + files + thứ tự) …, chờ duyệt»**
(`feature-loop/skills/feature-loop/SKILL.md:143`) — không ca-rỗng; và
`scripts/khong-can-nguoi.mjs` chỉ hỏi Cổng 1 và Cổng 2.

Kèm một lỗ hẹp cùng chỗ: `scripts/start-scan.mjs:166-168, 392` suy trạng thái từ
**sự tồn tại** file plan, nên phiên nối lại một vòng T3 dở không biết plan đã
được gật chưa và chỉ còn nước hỏi lại người — đúng mục A6 của
[audit 22/08](2026-08-22-audit-day-nghi-thuc-kit.md), vẫn ở «Later».

- **Playbook nói gì:** 268-274, 292 — kế hoạch thành bản ghi có thẩm quyền +
  cửa ra đối chiếu việc đã làm với lời đã hứa.
- **KHÔNG cắt cổng này.** Nó đã chứng minh ≥2 lối ra sống: vòng 02/09 owner tại
  Gate 1.5 chọn hình dạng regex trên số đo 566 AC **và** đổi vế một AC đã ký
  (`_acceptance/loi-moi-cong-may-sinh/decisions.jsonl:9,10`). Trần T3 = 4 là hằng
  thiết kế, owner đọc lại 03/09.
- **Lượt gọi người:** giảm 1 ở vòng T3 có ca-rỗng, 0 thêm ở vòng có ca-đầy.

---

## B. Bốn lớp «máy tin nhầm chính nó» playbook chỉ ra mà kit chưa canh

Đây là phần đáng giá nhất của lượt khảo sát — và cả chín bài đối chiếu đều
không thấy.

### B1. Bằng chứng không ghi nó sinh ra dưới model nào

Playbook dòng 996: một lượt quét là «a point-in-time statement about a codebase
**under a particular model**, and **both halves go stale**»; dòng 1003: «Coverage
is dated from the last run, not from the first».

Kiểm thật: **78/78 `evidence-report.md` không ghi model nào sinh ra chúng**;
`grep model lib/evidence-core.cjs` = **0**; staleness của kit tính 100% theo diff
mã. Hệ quả: một hồ sơ ký dưới model đời cũ đọc **y hệt** hồ sơ ký dưới model đời
nay, mãi mãi — kể cả khi lớp lỗi mà model cũ không thấy nay đã thành lớp phổ
thông. Đây là lớp tự-dối rẻ nhất còn lại và không ai canh.

### B2. Cấu hình lái máy đổi mỗi mốc mà không thước nào chạm

Playbook 566-569: bộ ca chạy **khi `CLAUDE.md`, skill hoặc hook đổi** — «that
configuration steers the agent and deserves the regression testing that code
gets» — và **chặn merge theo tỉ lệ đạt**.

Kit có duy nhất `.github/workflows/gate.yml`: 6 suite tất định, không `schedule:`,
không lượt nào chạy một skill rồi chấm đầu ra. Kit **đã biết** lỗ này và đã viết
sẵn bộ ca ở `evals/` (3 ca), nhưng `evals/README.md` khai rõ: `claude plugin
eval` đang early access và **org chưa được bật**. Thứ playbook thêm vào so với
README ấy là ba điều kiện vận hành: ngòi nổ theo **thay đổi cấu hình** (không chỉ
theo lịch) · **cổng merge theo tỉ lệ đạt** · **mỗi sự cố thành một ca vĩnh viễn**.

### B3. Ca đo nhạt dần theo thế hệ model — không phải do ai nới

Playbook 557-558: «As models improve, cases that once discriminated stop doing
so and new ones must be added». Kit **có** trường `non_discriminating` và cờ đỏ
trên thẻ, nhưng không vòng nào bổ sung ca mới khi ca cũ nhạt — và danh sách sáu
hình dạng lỗi đo-lường (`feature-loop/workflows/acceptance-verify.js:463-470`)
đều nói về phép đo **sinh ra đã sai**, không hình dạng nào nói về phép đo **hoá
vô hại theo thời gian**.

### B4. Người viết mã không được sửa thước của mã đó

Playbook 527 đòi **một hook chặn** sửa file test trong lúc chữa, và nói rõ lựa
chọn thay thế là bắt review từ chối mọi diff chạm test. Kit không có hook nào
loại này — `hooks/hooks.json` chỉ có một hook `PreToolUse` canh file bằng chứng —
và cùng một phiên viết eval ở S1 rồi sửa mã ở S3 với **cùng quyền**.

Cùng họ, và là **phản biện mạnh nhất playbook có với làn V**: dòng 694-695 —
«the agent that wrote the code has no way to approve it». Làn V để máy tự qua
cổng trên hồ sơ chính máy viết. Kit có lý do (ngân sách lượt chú ý của một
owner) nhưng chưa đặt lý do đó cạnh câu này ở đâu cả.

### B5. Finding được nêu lại, không vật nào đếm

Playbook 1024: «Dismiss with a reason, so the dismissal is recorded and **the
same finding does not return as new** on the next run». Kit có `.out-of-scope/`
cho **đề xuất**, không có gì tương đương cho **finding của hội đồng judge** —
nên cùng một finding được nêu lại qua các vòng mà không vật nào đếm.

### Phụ: hai điều nhỏ hơn, cùng chiều

- **Hiến pháp kit dài gấp năm ngưỡng playbook đặt.** Dòng 372: giữ `CLAUDE.md`
  dưới một trang, «Claude đọc hết ở đầu phiên và thứ gì cũ là chiếm context
  không lời». `CLAUDE.md` của kit: **178 dòng / 14.785 byte** ≈ 5 trang.
- **Mọi chỉ số playbook đề nghị đều đọc từ một hệ đã tự phát ra nó** — 13 khối
  *How to measure it*, không khối nào bảo đếm tay: dấu thời gian git · PR
  metadata · hệ CI · OTel · incident tracker. Riêng 862-865 là bản tự-động-hoá
  của **đúng dòng số kit đang đếm tay**: mỗi quyết định của hook ghi ra OTel kèm
  dấu thời gian và verdict allow/block, nên «thời gian chờ ở từng cổng» đo được
  ở tầng hook. Luật (c) của kit đang đòi một con số kit **không rút được**: hồ sơ
  2.7.0 phải ghi «≥10» (dấu ≥ là lời thú nhận không đếm được), hồ sơ 2.8.0 phải
  ghi thẳng «chưa đếm».

---

## C. Playbook xác nhận kit đang đúng

Không phải lời khen — là bằng chứng cho hướng đi, và là lý do **không** đổi
những chỗ này.

| Playbook | Vật của kit |
|---|---|
| Bằng chứng đến từ bộ công cụ, không từ lời thuật (543-544) | đối chiếu mã lần chạy + cấm `verifier: manual review` (`lib/evidence-core.cjs:248-260, 417-438`) |
| Phép kiểm tồn tại **trước** bản vá (522) | khoản khai-sinh-phép-đo: một phép đo mới chỉ tính xong khi kèm cặp case hai chiều trên cùng fixture (`SKILL.md`, MEASURE-BIRTH-CLAUSE) |
| Chặn lúc hành động, soi lại ở cửa ra (433, 447) | hook lúc ghi + soi lại **toàn kho** mỗi lượt CI (`tests/scripts/mirror-sync-grandfather.mjs`) |
| Cửa ra đối chiếu việc đã làm với lời đã hứa (268-274, 292) | khối «Quyết định CHƯA duyệt» có răng hai chiều (`scripts/gate-card.js:930-934`; D07/D10) |
| Bác kèm lý do để phát hiện không quay lại như **mới** (1029-1035) | `.out-of-scope/` bắt buộc (`CLAUDE.md:176-178`) + sổ giới hạn + răng khớp hai chiều |
| Chuẩn nạp lúc **viết** thiết kế (167, 187) | phản biện ngữ cảnh sạch, fail-CLOSED (ADR 0004) |
| Bậc thấp nhất của thang phản ứng chỉ ghi sổ (941) | thang bốn nấc của nghi thức thiết kế, mặc định không đồng bộ |

Và một chỗ **kit đi xa hơn playbook**: playbook coi bằng chứng là «đầu ra thật
của make test», nhưng không đòi ai chứng minh phép đo ấy từng đỏ. Luật
«màu xanh phải từng chạy chiều đỏ» của kit không có đối ứng trong playbook.

---

## D. Bốn chỗ kit **cố ý** đi ngược — và giá đã trả

Playbook viết cho tổ chức nhiều người, nơi thứ khan hiếm là **người trực**. Kit
viết cho một owner, nơi thứ khan hiếm là **lượt chú ý**. Ở cả bốn chỗ, nhập theo
playbook sẽ tăng lượt gọi người hoặc tăng giờ-kit mà không cắt gì.

1. **Hai lần chạm trước thiết kế** (103-105, 148-151: người duyệt `intent.md`,
   rồi lại duyệt `spec.md`) → kit gộp còn **một** lượt ở Cổng Đáng.
   *Giá khai thẳng:* ở cổng đó người nêu ý = người khai ngưỡng = người ký, cùng
   một phiên — trong khi mọi cổng khác kit ép người-làm ≠ người-chấm rất rắn.
   *Lưới thay thế:* máy chỉ được **đề xuất** ngưỡng với tiền tố `[đề xuất]`,
   người gỡ tiền tố mới là chốt. *Giới hạn chưa khai thành lời:* với repo tiêu
   thụ nhiều người, nhánh «người khởi xướng ≠ người quyết» là thật.
2. **Chủ sản phẩm ngồi lặp trên bản mẫu** (175-181) → kit mặc định **không đồng
   bộ**, nấc ngồi-cùng chỉ mở khi người gọi tên (ADR 0009). *Giá:* vòng phản hồi
   chậm hơn, đổi lấy 0 lượt thêm.
3. **Vòng tự khởi động** (910, 937-942) → kit đóng băng meta-work.
   *Điều playbook bổ sung mà luật kit chưa nói thành lời:* vòng tự chạy an toàn
   **không** nhờ tầng phát hiện tất định, mà nhờ **cái bấm nó là một đại lượng đo
   NGOÀI hệ đang tự sửa**. Kit chưa có đại lượng nào đo ở phía repo tiêu thụ —
   nên luật đóng băng đang **đúng**, không phải thận trọng thừa.
   *Chiều đỏ của chính luật:* cửa sổ trước luật cho 5 vòng meta / 0 thứ chạm
   người dùng; cửa sổ sau lại ra tỉ số ấy thì kết luận phải là **luật hỏng**.
4. **Cửa ra đối chiếu diff với danh sách file của kế hoạch** (292, 297-299) →
   kit neo cửa ra vào **hợp đồng** và **sổ quyết định**, không vào kế hoạch.
   *Lý do:* ghim thước vào vật máy sinh là mời lại lớp «đỏ vì hạ tầng chứ không
   vì vật» (P150). *Giá:* danh sách file + lệnh kiểm mỗi việc chỉ có một bên đọc
   (`feature-loop/workflows/execute-parallel.js:70`), chết ngay sau khi code xong.

---

## E. Đã xét và loại — đừng mở lại như ý mới

Bảy đề xuất bị bác, kèm lý do, đã chép sang
[`.out-of-scope/doi-chieu-playbook-ai-native.md`](../../.out-of-scope/doi-chieu-playbook-ai-native.md)
theo khuôn «Prior requests», để lần đọc playbook sau đụng lý do trước khi kịp
nảy ý. Tóm tắt: cắt Gate 1.5 · dựng lưới đối chiếu diff với plan · thêm bảng
phân loại 5 loại vào Cổng Phạm vi · để máy tự trông bản giao tới merge · thêm
dòng số thứ tư/thứ năm ngoài luật (c) · «kit đo chi phí bằng tay» (sai sự kiện,
kit có quan trắc tự động) · ghi thêm dòng vào sổ cái lúc thi công.

Kèm **một dòng rác cần dọn**: `GUIDE.md:996` vẫn dạy «N vòng × mỗi lần merge =
N−1 hồ sơ phải ghim lại, **mỗi lần một lượt gọi người**». Làn ghim-lại
máy-một-mình đã sống từ 16/08 (`feature-loop/skills/feature-loop/SKILL.md:32`),
nên câu đó đang dạy sai mô hình chi phí — và chính playbook (sidebar 307-320)
gọi tên đúng bệnh: mỗi vật chỉ được có **một** nguồn sự thật.

---

## F. Đính chính — ba chỗ chính bản đối chiếu nói sai

Ghi lại vì đây là lớp lỗi kit vẫn gọi tên: máy diễn dịch trường dữ liệu thành
kết luận rồi trình người.

1. **«Kho hiện 31/31 hồ sơ `veto_state: mo`» — sai mẫu số, và sai cả kết luận.**
   Kho có **78** contract, **31** có khoá `veto_state`. Lượt phê bình đọc tiếp
   thành «47 hồ sơ lọt luật veto im lặng» — cũng sai: khoá vắng **không** phải
   fail-open. `lib/evidence-core.cjs:460` khai tường minh «khoá vắng thì luật cũ
   chạy NGUYÊN VĂN», tức đòi chữ ký người — chiều **an toàn**, đúng luật
   đường-đọc-cũ của kit.
2. **«`mirror-sync-grandfather.mjs` miễn trừ 21 slug ⇒ kho không được quét
   trọn» — sai.** `recheckCorpus()` đọc **mọi** `evidence-report.md` trong kho
   mỗi lượt; 21 slug là danh sách **đỏ-đã-biết cho một khoá chết**
   (`executors.script.mirror_sync`), và `classify()` còn bắt lý do đỏ phải khớp
   — đỏ vì lý do khác vẫn nổ.
3. **4/9 bài học «rút từ playbook» không có một trích dẫn playbook nào** — chúng
   neo vào `file:line` của kit. Đó đúng là lớp lỗi kit gọi tên: *thước không gắn
   vào vật được giao*. Bốn bài ấy là quan sát về kit nhân dịp đọc playbook, không
   phải bài học từ playbook; mục A và B ở trên đã tách lại cho đúng.

---

## G. Một điểm mù ở tầng khung

Lượt đối chiếu đọc playbook như **một danh mục đối chứng cho các bộ phận đã có
của kit**, nên chỉ trích những dòng nói về cổng, bằng chứng, đảo ngược — vùng
kit đã mạnh. Nó **không** đọc playbook như một **sơ đồ chuỗi bàn giao** (dòng
63, 90-93: mỗi stage kết thúc bằng một vật commit vào git, stage sau bắt đầu
bằng việc đọc vật ấy; `intent.md` được chấp nhận **kích hoạt** lượt thiết kế,
`spec.md` được duyệt kích hoạt plan mode, PR merge kích hoạt pipeline).

Ở lăng kính đó có một câu chưa ai hỏi: **mọi vòng của kit đều bắt đầu bằng owner
đã ngồi sẵn trong phiên.** Kit có `opportunity.md` — đúng vai `intent.md` — nhưng
nó được **sinh ra trong phiên có owner**, không phải thứ owner viết rồi bỏ đó cho
máy nhặt. Nếu đó là lý do vật lý khiến «lượt gọi người» không bao giờ về 0 thì
mục tiêu ≤3 đang đo một thứ và chặn một thứ khác. Câu này chưa đủ chín để thành
ô — ghi ở đây để lần sau không phải nghĩ lại từ đầu.

---

## Trạng thái

**Tất cả ở trên VÀO SỔ.** Đây là meta-work; luật đóng băng đang áp, và giữa hai
mốc phát hành tối đa MỘT vòng meta, chỉ khi owner gọi tên. Không ô nào được mở
trong lượt này.
