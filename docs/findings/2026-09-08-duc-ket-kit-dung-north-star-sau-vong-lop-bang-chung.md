# Đúc kết sau vòng `lop-bang-chung-nhin-thay` — để kit đúng north star, đúng mục đích, rẻ giờ và token

Ngày 08/09/2026. Nguồn: hồ sơ tổng kết cùng ngày (§2–§9, mọi số đo từ bản ghi phiên),
quét xuyên repo (§8), ba thảo luận với owner về so-từ, ý-định và sai-mục-đích. Văn bản này
là **đầu vào gọi tên** cho mốc kế theo luật CLAUDE.md: meta-work mặc định đóng băng, chỉ mở
khi owner gọi tên, giữa hai mốc tối đa một vòng meta.

> **Rà soát 08/09 (bản 2, sau khi owner yêu cầu review).** Bản 1 có ba chỗ không đứng được
> và đã sửa ở đây: (i) con số «~6M token bọc backtick» không có nguồn đo → bỏ; (ii) mốc so
> sánh cho vòng kế lấy 578M của một vòng T3 để đo một vòng T2 → thay bằng mốc **cùng hạng**
> đọc từ `usage-report.md` của 24 hồ sơ kit; (iii) B7 là CỘNG (dựng công cụ) chứ không phải
> TRỪ, và nó là mục 5 của kế hoạch loop-economics owner đã duyệt 28/07, chưa từng dựng. Thêm
> cột **người hưởng** cho mọi đề xuất (CLAUDE.md đòi), và ghi hai dòng của hợp đồng đã ký
> nói khác nhau về khi nào mở vòng nợ (§3-C).

## 1. Bức tranh bằng số

| Thước của kit | Vòng này | Trần / kỳ vọng | Mốc cùng hạng (kit) · xuyên repo |
|---|---|---|---|
| Làm-xong → quyết-được | 8h43 | bằng chứng đọc 1 phút, quyết trong buổi | chưa có mốc (không hồ sơ nào ghi giờ) |
| Lượt gọi người / vòng | 15 | 4 (T3) · 3 (T2) | chưa có mốc bằng máy (đếm tay từ bản ghi phiên) |
| Vòng bị hạ tầng đốt | 5 | 0 | hạn mức phiên 110 lần, null-crash 24 lần trên máy |
| Token cả vòng | 578M, 93% cache-read | — | 94–98% cache-read ở mọi repo; oneflow 22,5 tỉ |
| Token S4 theo `usage-report` | 100,3M / 3 round | 1 round | kit T3: TB 55,6M / 3,25 round · **kit T2: TB 43,8M / 3,06 round, 14,3M mỗi round** |
| Round S4 | 3 (+1 lượt chỉ-TRỪ) | trần 3 · lý tưởng 1 | kit T2: 1 round chỉ 10/35 hồ sơ · T3 TB 5,5 (có 11–13 round) · xuyên repo TB 2–3,3 |
| Finding về thước vs về vật | 6 trong hợp đồng, cả 6 về độ chặt phép đo; 4 lỗi hành vi thật ra Known limits | ngược lại | «Hình dạng» ở mọi repo có làn rà soát |

Hai dòng cuối là chỗ đau nhất: kit tự đo mình còn tệ hơn đo repo tiêu thụ (T3 kit TB 5,5
round so 2–3,3 xuyên repo), và khi đo thì đo về cái thước.

## 2. Ba chẩn đoán gốc, trace về north star

**G1 — Thước đo lệch mục đích.** North star: *máy làm và tự chứng minh* — thước phải so
*điều đã hứa* với *điều máy làm*. Thực tế vòng này: AC viết như ca kiểm nên «trong hợp
đồng» ≡ «về cái thước»; eval `cmd` là cả suite nên sáu eval không phân biệt được nhánh với
base; stale đo «cây đổi» không đo «rủi ro đổi»; W6/W8-token so chữ với danh sách (kit 127
dòng W6 hôm nay không ai xử, W8-token 140 dòng giả ở artifact-platform). Hệ quả đo được: hai
trong ba lượt vá chỉ sửa test, bốn lỗi hành vi thật không được sửa, ≈2 giờ máy chạy suite
lặp, 51 phút ghim lại vô thông tin.

**G2 — Hình thức phiên đắt hơn việc.** North star: *giờ-kit là chi phí*. Một phiên 13
tiếng đọc lại 571K ngữ cảnh mỗi lượt, nhiều lượt chỉ để nhận thông báo; 327M cache-read ở
phiên chính. Mẫu này ở mọi repo (94–98%).

**G3 — Người bị gọi ngoài thiết kế.** North star: *người ở biên, xuất hiện ở đánh-đổi thật*.
15 lượt gõ: 3 cổng thiết kế, 1 dừng theo luật; 11 lượt còn lại là hạ tầng (2), danh tính
(2), bàn giao hỏi menu (2), và **người tự kiểm / giục (5)** — nguyên nhân của năm lượt đó là
máy không báo tiến độ khi chờ tiến trình nền, người phải hỏi «đến đâu rồi».

## 3. Đề xuất — xếp theo ai quyết, ghi rõ CỘNG hay TRỪ và người hưởng

### A. Máy tự sửa nếp, ngay vòng kế, không đụng luật

| # | Việc | Cắt gì (ước lượng từ số đo) | Nguyên tố | Người hưởng |
|---|---|---|---|---|
| A1 | **Chia phiên theo giai đoạn**: điều tra · S1→Cổng Phạm vi · S3 · điều phối S4 · Cổng Bằng chứng→S5. Mỗi phiên khởi từ hồ sơ trên đĩa | cache-read phiên chính 327M; §7 hồ sơ tổng kết ước ≥1/3 lượt gọi là lượt thức dậy không sinh việc | 2 (máy tự chứng minh rẻ hơn) | owner (hoá đơn), máy (ngữ cảnh gọn) |
| A2 | Khi chờ tiến trình nền: **một** lượt chờ chặn kèm một dòng báo «đang chờ X, mốc Y», không canh song song | bớt lượt gọi model thức dậy; cắt 5 lượt «người tự kiểm» | 3 (người khỏi phải hỏi) | owner |
| A3 | **AC viết theo hành vi công cụ**, chi tiết ca kiểm nằm ở `expected` của eval | lỗi hành vi thật rơi vào «trong hợp đồng» → được vá thay vì ra Known limits | 1, 2 | người dùng repo tiêu thụ (lỗi thật được sửa) |
| A4 | **`cmd` của eval = ca của tính năng** (`LNT_CASES=… node …`), suite chỉ ở `suite_keys` | mỗi round bớt ~10 phút; eval phân biệt được nhánh/base | 2 | máy (eval có nghĩa), owner (giờ) |
| A5 | **Tự-soi phép đo ở S3** theo sáu hình dạng đã có tên trước khi khai `implemented` (prompt nội bộ, không cần sửa kit) | round 2+3 của vòng này = 120M token, ~4 giờ, 2 lượt gọi người | 2 | owner (round), máy |
| A6 | Xếp S4 nặng **tránh sát mốc reset** (13:30 · 22:00 · 08:30) | ~4,5 giờ đứng im | 2 (bằng chứng không bị cắt ngang) | owner (giờ chờ) |
| A7 | Danh tính: `--as "Manh Phan"` hoặc đồng bộ `git config user.name` với `signoff.approvers` | −2 chạm | 3 | owner |
| A8 | Khi có phiên khác trên cùng kho: worktree riêng, kiểm nhánh trước mỗi commit; không ghép `grep -n` với `git commit` | tránh ghim lại và commit hụt | 2 (bằng chứng ghim đúng cây) | máy |

**Mốc để biết A có cắt được không** — mốc **cùng hạng**, không so với 578M của vòng T3
này. Vòng kế là T2 nên so với các hồ sơ T2 của kit:

| Số | Mốc T2 của kit (24 hồ sơ có `usage-report`, 35 có `## Iterations`) | Mục tiêu vòng kế với nếp A |
|---|---|---|
| Round S4 | TB 3,06 (theo usage) / 2,69 (theo Iterations); chỉ 10/35 hồ sơ 1 round | **1 round** |
| Token S4 (`usage-report`) | TB 43,8M / hồ sơ; 14,3M / round | **≤ 20M** (một round + làn ghim lại nếu có) |
| Lượt gọi người | trần thiết kế T2 = 3 | **≤ 3 trong thiết kế, 0 ngoài thiết kế** |
| Vòng bị hạ tầng đốt | — | **0** |
| Token phiên chính | chưa có mốc (bản ghi phiên không tách theo hồ sơ) | vòng kế **lập mốc**: ghi tổng + cache-read của từng phiên đã chia vào `usage-report` |

Đây là mục tiêu, chưa đo. Vòng kế chính là chỗ đo — đó là neo của cả đúc kết này.

### B. Kit — một vòng meta duy nhất giữa hai mốc, chờ owner gọi tên

Cả gói là **T3** (B3 chạm `lib/evidence-core.cjs` + `scripts/pre-merge-check.sh`, đều trong
`t3_paths`) → có Gate 1.5, trần 4 lượt gọi người. Bảy mục trong một vòng T3 là đúng cỡ hồ sơ
vừa mất 3 round; nên **lõi = B1–B3** (mỗi mục có bằng chứng ở repo tiêu thụ), B4–B5 chỉ mở
khi đo được ở ≥2 repo tiêu thụ (luật tự đặt sau quét 08/09: luật kêu >10 dòng/repo mà
không dòng nào dẫn tới sửa là luật đo sai chỗ), B6–B7 đi kèm vì rẻ.

| # | Việc | CỘNG/TRỪ | Bằng chứng (repo tiêu thụ?) | Nguyên tố | Người hưởng |
|---|---|---|---|---|---|
| B1 | **Null-guard `acceptance-verify.js`**: agent chết → BLOCKED có tên, không ném TypeError | sửa răng | 24 lần sập trên máy (kit + oneflow) — **có** | 2 | mọi repo chạy workflow |
| B2 | **W6 thu về Criteria** + tokenizer coi định danh gạch nối là một từ + `_Allow_` cho từ đa nghĩa; **bỏ nhánh token-lạ của W8**. Nhánh token-lạ là AC của hợp đồng đã ký → cần một dòng `revisit` trong sổ hồ sơ `lop-bang-chung-nhin-thay` trước khi gỡ | TRỪ | W6: kit 127 dòng, AP 36; W8-token: AP 140 / oneflow 15 / crm 4 so nghĩa vụ thật 16 / 2 / 9 — **có** | TRỪ (hình thức = cắt) | mọi repo có `CONTEXT.md` hoặc surface theo domain |
| B3 | **Stale theo `paths:`** của eval thay vì cả `tests/` | TRỪ (thu phạm vi) | kit 277 ghim lại, oneflow 112, map 46 — **có** (chưa tách phần do `tests/`) | 2 | owner (làn máy), repo nhiều vòng song song |
| B4 | **Triage xếp theo tác hại**: lỗi hành vi thật trong file của hồ sơ (`paths`) vào «vá», lỗi thước có thể vào Known limits; thẻ Cổng 2 đặt lỗi hành vi lên trên lỗi thước | CỘNG (nhánh xếp hạng mới, dưới luật nới 07/09) | 4 lỗi hành vi thật ra Known limits, 6 lỗi thước ăn 2 round — **chỉ kit**; đo ở consumer trước | 3 | người dùng cuối (lỗi thật được sửa) |
| B5 | Làn «conventions» chỉ chấm file chữ có đổi so round trước | TRỪ | 13/34 finding về chữ, lặp mỗi round — **chỉ kit** | 2 | owner (round) |
| B6 | S5 mặc định PR, không menu | TRỪ | −1 lượt, mỗi vòng | 3 | owner |
| B7 | **`loop-health`** từ `sweep.mjs` + `tokproj.mjs`: ba dòng số bằng máy mỗi mốc, xuyên repo | **CỘNG** — là mục 5 của kế hoạch loop-economics owner duyệt 28/07 (`scripts/loop-health.sh`), chưa từng dựng; nay có bản nháp | ba dòng số luật (c) đang đếm tay; mốc T2 ở bảng trên phải tính lại bằng tay hôm nay | 2 (số không tự dối) | owner (đọc 1 phút mỗi mốc) |

### C. Nợ đã khai — và hai dòng nói khác nhau trong hợp đồng đã ký

Hợp đồng `lop-bang-chung-nhin-thay` (đã ký) có hai dòng về vòng nợ: dòng Known limits sau
council viết *«ngưỡng đang đếm: lần đầu một hồ sơ có mặt người nhìn ở repo tiêu thụ ship
không frame mà W8/card/NOTE đều im → mở hợp đồng T2 docs+tests»* (mở theo ngưỡng); dòng Known
limits của Cổng Bằng chứng (ký Phan Le Manh) viết *«gom vào hợp đồng T2 docs+tests trước mốc
2.10.0»* (mở theo lịch). Dòng ký sau thắng, nên vòng nợ mở trước 2.10.0 — nhưng cần biết
rằng vòng đó là **đo-thước-của-thước** đúng nghĩa luật (a) CLAUDE.md (LNT1/LNT6 là test của
lint), được mở vì owner đã ký tên, không vì ngưỡng nổ. Việc còn lại của C: cài bản kit mới ở
oneflow (ca gốc của W8) để ngưỡng đếm bắt đầu có số.

### D. Hình thức đã đo: dòng «với danh tính … — Enter xác nhận» (owner chỉ ra 08/09 tối)

**Sự việc.** Ở cả hai cổng của vòng này máy hỏi «với danh tính: Phan Le Manh 2026-09-08
(từ git config user.name) — Enter xác nhận». Cổng Phạm vi owner gõ «Manh Phan» (sửa);
Cổng Bằng chứng máy *biết* điều đó («anh đã sửa thành tên này khi duyệt Cổng Phạm vi»)
mà vẫn đề xuất lại «Phan Le Manh» và hỏi lại; owner gõ «xác nhận». Kết quả: một hồ sơ,
một người, hai tên (`approved_by: Manh Phan`, chữ ký `Phan Le Manh`). Câu trả lời ở cổng
trước không đổi hành vi máy ở cổng sau — tức câu hỏi không có hệ quả, là hình thức theo
đúng nghĩa.

**Luật đang có** (`human-facing-language.md`, khối `IDENTITY-ECHO-RULE`, chép byte-đúng
vào `approve.md`/`signoff.md`, LM17 giữ): bậc thang `--as` → `git config user.name` →
`signoff.approvers` (một tên); hai nguồn **khớp tuyệt đối** → ghi thẳng, không chờ (nhát cắt
01/09 mục 5); **mọi ca khác** (lệch · trống · nhiều tên) → hiện «— Enter xác nhận» và CHỜ
trước khi ghi; kèm CẢNH BÁO khi tên không có trong `approvers`.

**Số đo trên máy (08/09):**

| Số | Giá trị |
|---|---|
| Repo có `config.yaml` | 22, tất cả `git config user.name` = «Phan Le Manh» |
| Repo mà `approvers` khớp tuyệt đối | 6 (aes, artifact-platform-design, floorplanstudio, policy-graph-hub ×2, realestate) |
| Repo lệch → lượt chờ bắn ở **mọi** cổng | **16** («Manh Phan» kit/crm · «Manh»/«memto» artifact-platform ×6 · «Manh» oneflow/horizon · «manh» map/media-library · «Mạnh Phan» floorplan · «manh-macmini» media-crawler) |
| Cách viết tên cùng một người trong hồ sơ đã ký | ≥12 («Manh» 1 850 dòng · «Manh Phan» 124 · «Phan Le Manh» 82 · «Mạnh» · «manh» · kèm email…) |
| Hồ sơ có tên Cổng 1 ≠ tên Cổng 2 (khử trùng theo repo) | ≈99 (artifact-platform 53/188 · map 14/14 · media-library 11/12 · kit 9/33 · oneflow 6/36 · PGH 4 · crm 1 · floorplanstudio 1) |
| Lần máy hỏi «Enter xác nhận» trong bản ghi phiên (từ 18/08) | 8: **5 xác nhận suông · 2 sửa** (cả hai đổi thành «Manh Phan» — đúng giá trị đã nằm sẵn trong `approvers`) · 1 khác |
| Bộ đọc nào cưỡng chế tên | **không có**: pre-merge chỉ chặn giữ-chỗ (`PENDING`, `<name>`…); không script nào đọc `approvers` (từ 1.24.0, bốn bản vá YAML hỏng → gỡ cả lớp) |

Tức 8/8 lần hỏi, người không đưa cho máy điều gì máy chưa có; và tên ghi vào không bị
cổng nào đọc lại ngoài chính mắt người.

**Rà theo north star.** Phép thử luật 01/09: *người trả lời khác khuyến nghị thì dựa vào
điều gì máy không có?* — cách viết tên chính mình: không có gì (máy có `approvers`, có
`approved_by` của chính hồ sơ, có git). → loại 2, **một lối ra sống = trạm thu phí**. Nó
còn là cả một *lượt* (không phải một chạm trong lượt), nên vi phạm cả «≤1 chạm/lượt» lẫn
«0 lượt ngoài thiết kế»: 2 lượt/hồ sơ trên 16/22 repo, mãi mãi cho tới khi ai đó sửa 16
file config. Lý do chính khối luật đưa ra cho ca khớp («hai nguồn đã đồng ý thì lượt chờ
đó không thêm bảo đảm nào») đúng y hệt cho ca lệch: hai *cách viết* khớp hay lệch không nói
gì về *ai đang gõ*; xuất xứ thật là tác giả commit ghi chữ ký (nghi thức ghi-và-commit-một-
lượt), còn ai cũng bấm Enter được. CẢNH BÁO «tên không có trong approvers» bắn 100% trên 16
repo — cảnh báo luôn bắn là cảnh báo không ai đọc, cùng lớp chữ-đối-chiếu-danh-sách của §9.
Rà hết các chỗ lệnh cổng còn hỏi: chỉ chỗ này cùng hình dạng «máy suy được mà vẫn chờ»
(khuyến-nghị-trước cho câu người gõ mơ hồ là ca khác — đó là *quyết định* người vừa gõ, đọc
sai thì ghi sai hồ sơ ký); S5 hỏi menu đã là B6.

**Đề xuất — toàn TRỪ, T2** (chạm `skills/acceptance/references/human-facing-language.md` +
hai bản chép trong `commands/` + hai neo test P191/`GATE_NEEDLES` đang ghim chuỗi «Enter
xác nhận»; không dính `t3_paths`):

| # | Việc | Cắt gì | Nguyên tố | Người hưởng |
|---|---|---|---|---|
| D1 | **Bỏ lượt chờ ở mọi ca.** Suy xong → ghi thẳng → một dòng «với danh tính: <tên> <ngày> (từ <nguồn>)». Người sửa bằng một câu bất kỳ lúc nào sau đó (đường đảo: một trường, một câu). Chỉ **CẠN** (không nguồn nào) mới hỏi — đó là điều chỉ người biết | 2 lượt/hồ sơ trên 16/22 repo; ca này là 2/11 lượt ngoài thiết kế của vòng | 3 + đảo rẻ | người ký ở mọi repo |
| D2 | **Bỏ CẢNH BÁO lệch `approvers`.** Dòng nguồn suy đã đủ cho người khác trên máy chung thấy tên không phải mình và sửa; `approvers` giữ vai nấc cuối khi git trống | một dòng nhiễu ở mọi cổng của 16 repo | TRỪ | người đọc thẻ |
| D3 | **Nhớ trong hồ sơ**: tên người đã tự sửa ở cổng trước của cùng hồ sơ đứng trên `git config` khi người gõ vẫn là cùng tác giả git (máy so tác giả commit của cổng trước, không hỏi, không config) | hồ sơ hai-tên (≈99 trên máy) không sinh thêm | 2 (hồ sơ không tự mâu thuẫn) | người đọc hồ sơ sau này |
| D4 | Không chiến dịch: 16 config và ≈99 hồ sơ đã ký giữ nguyên (đừng chạm hồ sơ đã ký); A7 (`--as`/đồng bộ tên) chỉ là nếp tạm tới khi D1 ship | 0 việc | — | — |

Neo test thay thế: hai neo đang ghim *sự có mặt* của chuỗi «Enter xác nhận» → đổi thành cặp
dương/âm theo luật assertion-âm-tính: khối `IDENTITY-ECHO-RULE` PHẢI có «ghi thẳng» và
KHÔNG được có nhánh chờ cho ca lệch; bản sao tiêm nhánh chờ vào phải ĐỎ đích danh.

Chỗ đặt: đây là meta (kit sửa cổng của kit) — chờ owner gọi tên. Rẻ nhất là đi cùng vòng
T2 nợ (C) thêm một AC docs+tests, vì cùng hạng, cùng loại file.

## 4. Thứ tự làm

1. **Chỗ đo A** = vòng T2 nợ (C) chạy với nếp A (kèm D1–D3 nếu owner gọi tên — cùng hạng T2, docs+tests), đo theo bảng mốc cùng hạng ở §3-A. Nhưng
   vòng nợ là vòng meta, nên mốc thật hơn là **vòng sản phẩm kế ở repo tiêu thụ** (oneflow sau
   khi cài) — nếp A là nếp máy, áp ở đâu cũng được; ghi ba dòng số của cả hai.
2. Có số rồi mới mở **một** vòng meta B. Nếu A không cắt được (round vẫn >1, lượt gọi người
   vẫn ngoài thiết kế) thì chẩn đoán §2 sai ở đâu đó và phải xem lại trước khi chạm luật.
3. Mốc 2.10.0 ghi ba dòng số của cả hai vòng vào hồ sơ mốc, gọi tên nhát cắt kế.

**Ba điểm mở, chỉ owner quyết:**

- **B1 đi cùng C hay chờ B?** Null-guard là ~10 dòng, không đổi luật, và nó bảo vệ chính
  phép đo A (một cú sập là một vòng bị hạ tầng đốt + một lượt «Try again»). Đi cùng C thì
  hợp đồng nợ chạm `feature-loop/workflows/` (không trong `t3_paths`, vẫn T2). Khuyến nghị:
  đi cùng C.
- **Mốc cho A** lấy ở vòng nợ (meta, có ngay) hay vòng sản phẩm oneflow (neo ngoài, chậm
  hơn)? Khuyến nghị: cả hai, vòng nợ trước.
- **B4/B5** bỏ hẳn hay đo ở consumer trước? Khuyến nghị: đo ở oneflow + artifact-platform
  một mốc, mở nếu lặp.

## 5. Một câu

Kit đang trả giá không phải vì kiểm nhiều, mà vì kiểm **chữ với danh sách** và **cây với
sha** thay vì **lời hứa với hành vi**; và vì máy chạy trong một phiên dài rồi hỏi người
những câu máy tự trả lời được. Cả hai đều sửa được bằng nếp trước, bằng luật sau, và có
mốc cùng hạng để biết đã sửa xong chưa.
