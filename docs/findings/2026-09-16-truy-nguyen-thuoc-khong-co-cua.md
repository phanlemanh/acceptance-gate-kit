# Truy nguyên phiên «Sửa lỗi tiếng viêt» — thước không có cửa, và trục đỉnh-có-sẵn

> Owner hỏi 16/09: *phiên «Sửa lỗi tiếng viêt» (crm-onehub) giống nghi thức và tốn
> rất nhiều token cho việc đã lên prod — truy nguyên.* Rồi bốn câu nối tiếp: phiên
> đáng lẽ đi thế nào · có phải vì repo có sẵn · sửa thước có phải «ngoài hợp đồng»
> đội lốt · giải bài này thế nào cho hiệu quả. Mọi số dưới đây đọc từ transcript
> xuất ra của phiên đó (`session-export-1789545879303.zip`), từ git của ba repo, và
> từ hồ sơ trên `origin/onehub`; số nào tôi từng nói sai trong lúc rà thì ghi cả
> bản sai lẫn bản đúng. Chip và ô mở ở §7.

## 0. Một đoạn

Vòng `cua-vao-noi-tieng-viet` có code trong nhánh gốc từ 04/09 và đã chạy trên
prod. Ngày 06/09 chủ kho xếp lại ba hồ sơ dở bằng cách đặt `status` về `approved`
— kit không có trạng thái *xếp lại* cho vòng nên hồ sơ phải nói dối. Mười ngày sau,
thẻ `/start` đọc `approved` + có kế hoạch thành «viết code (S3)», owner chọn dòng
đó, và phiên chạy 8 giờ 25 phút: **20 dòng vật, 701 dòng thước, 9 chỗ hỏng thước,
1 chỗ hỏng vật, 9 lượt gọi người**. Phần lớn chi phí là sửa thước để thước đứng
được trong máy trạng thái của app — việc không có tên, không được đếm, không có
trần trong bất kỳ hồ sơ nào. «Ngoài hợp đồng» có mục riêng, bộ lọc, đường mang
sang; sửa thước không có gì cả, vì eval là *một phần* của hợp đồng nên sửa nó cảm
giác như đang thực hiện hợp đồng. Đó là lớp đội lốt thật. Chuyện «vì brownfield» thì
**chưa chứng minh được** (§4): tường tương quan với «app có máy trạng thái mà thước
không có đường vào», và media-library — dựng cùng kit — có tỉ lệ khai giới hạn cao
nhất theo luật đếm chặt.

## 1. Số của phiên (đã đính chính)

| | Số | Ghi chú |
|---|---|---|
| Thời gian | 23:37 15/09 → 08:02 16/09 · **8 h 25** | 13 commit trong cửa sổ `55bd9cb..976507e` (phiên tự báo «92 commit» — sai) |
| Token phiên chính | 347 lượt gọi model · cache-read 133,4 M · tạo cache 0,64 M · ra 0,31 M | ngữ cảnh trung bình mỗi lượt phình từ 130 K (đầu) lên 685 K (cuối) |
| Token phiên phụ | cache-read ≈ 46 M · tạo cache ≈ 3,7 M | 3 vòng chấm có hồ sơ, 6 giám khảo E14, 1 lượt chấm tuần tự tự ứng biến (vứt) |
| Tổng | cache-read 179,2 M · tạo cache 4,4 M · ra 0,34 M | tôi từng nói «đốt 184 M» — cache-read giá ≈ 1/10, nên câu đó phóng đại chi phí ~10 lần; phiên chính không có `wf-usage`, không có hoá đơn quy đổi |
| Lượt gọi người | **9** = 4 hạ tầng · 4 phạm vi đo · 1 Cổng Phạm vi | hạ tầng: khôi phục tệp bị ghi đè (23:42) · tắt máy chủ cũ (00:00) · chạy máy chủ đúng cây (00:45) · chọn đường chấm (03:31). Phạm vi đo: đổi khuôn thước (00:13) · khai giới hạn (01:48) · tiêu vòng cuối (06:10) · xử E16 (07:36). Cả 9 lần owner chọn đúng lối máy khuyên. Bốn câu phạm vi đo là câu **thật** — hỏi sai lúc (S4 thay vì lúc nhận repo) và hỏi bốn lần |
| Diff theo cái bị sửa | **vật** 3 tệp +20/−11 · **thước** (`rang/`) 7 tệp +701/−105 · bằng chứng 8 tệp +739/−83 · hợp đồng/evals/sổ 3 tệp +86/−18 | tôi từng dẫn «~8.000 dòng» — số phiên kia tự báo, tính cả bằng chứng và sổ chạy |
| Sổ quyết định 16/09 | 7 dòng: **5 về thước**, 1 về vật, 1 niêm | cả 5 dòng thước ghi `type: fix` như dòng vật — sổ không phân biệt |
| Chỗ hỏng tìm thấy | thước **9**: sai vai đăng nhập · không tự dựng trạng thái · đếm chuỗi trong mã nguồn thay vì chữ người thấy · bấm nhầm nút · bỏ trống ô bắt buộc · đọc cả tải trọng script · giẫm nhau khi chạy song song · vật SSO thử sót lại · sổ khai sinh không biết mã 3. Vật **1**: tên hãng «Context» trong câu mô tả chưa đánh dấu không-dịch | prod đã nói tiếng Việt cả hai chiều vi/en từ trước phiên — máy xác nhận lúc 00:09, phút 32 |
| Lỗ kit lộ ra | 3: sàn thiết kế báo P0 «chữ trắng trên nền trắng» trên nền tối · thẻ cổng đếm `expected_exit` đã khai thành trượt · `start-scan` in «viết code» cho vật đã ở nhánh gốc | hai lỗ đầu phiên kia đã mở chip; lỗ thứ ba mở ở §7 |

Đường đáng lẽ: thẻ in đúng («vật đã ở nhánh gốc, hồ sơ treo») → nếu vẫn mở, ba
phép kiểm rẻ (sổ có xếp lại? code có trong nhánh gốc? prod hiện gì?) → **một** câu
hỏi thật có lối dừng («đóng theo quan sát · chấm lại có trần · mở vòng đường đo
riêng») → làm xong đóng phiên. Cỡ 20 phút, một lượt gọi người, cùng 1 chỗ hỏng vật.

## 2. Chuỗi nhân quả — sáu mắt, gói chữa được bốn mắt cuối

1. **Đẩy thẳng lên nhánh gốc** (lệ của repo tiêu thụ): bốn hồ sơ đang treo ở crm đều
   có `verified_commit` vào `origin/onehub` ngày 04/09 qua commit `chore(acceptance)`
   không có merge commit (`f871b27`, `903cd02`).
2. Hồ sơ dở lên nhánh gốc → **lưới trước-merge chặn merge của việc đã ký khác**.
3. 06/09: xếp lại bằng cách đặt `status: approved` và đổi tên bằng chứng — vì kit chỉ
   có `park` cho *ô*, không có cho *vòng*. Hồ sơ buộc phải nói dối để cổng thôi chấm.
4. `start-scan.mjs` nhánh `approved` (dòng ~428) chỉ đọc trạng thái hợp đồng → «viết
   code (S3)». Ba hồ sơ khác ở crm cùng hình dạng, đang hiện cùng dòng.
5. 00:13 — máy đã biết sản phẩm đúng trên prod, nhưng câu hỏi nó mời chỉ có ba lối
   *sửa thước* / *rút phạm vi* / *khai giới hạn*; **không lối nào là đóng vòng**, vì kit
   không có trạng thái cho «vật đã tới người dùng trước khi chấm».
6. Từ đó: sửa thước không có phanh. Dừng-vá đếm *theo từng chân, từng lớp* — chín chỗ
   hỏng là «chín lớp», phanh nổ một lần (chân không-dịch, đỏ lần ba). Trần ba vòng
   đếm *lượt chấm* — 140 lượt gọi sửa giàn diễn ra trước lượt chấm đầu tiên. Known
   limits là lối ra, nhưng đường tới nó chỉ mở khi phanh nổ.

Hai mắt đầu nằm ngoài kit (lệ đẩy thẳng) hoặc ngoài gói này (`park` cho vòng —
nguyên thuỷ thiếu, ghi nhận ở ô). Thêm một lỗ thật ngoài mọi gói: **phép đo ghi đè
hồ sơ vòng khác** — `rang/lai-ra-man.mjs dan-so` của vòng đã ký `chan-lai-component-ra-man`
ghi lại `evidence/ve-that.json` ở mọi lượt chấm; khôi phục ba lần trong phiên, dính
cả ba worktree. Chip ở §7.

## 3. Chẩn đoán theo North Star — tam giác vật · thước · lời

Nguyên tử của mọi tái diễn là *một trí tưởng tượng viết cả VẬT lẫn THƯỚC lẫn LỜI*.
Hợp đồng hôm nay chốt VẬT (`## Criteria`) và LỜI (`## Out of scope`, `## Notes`)
trước khi làm; THƯỚC chỉ là con trỏ (`cmd:` trong `evals.yaml`) — không khai nó cần
đứng ở đâu, không ngân sách, không lối ra ngoài khai-giới-hạn từng chân. Thế là thước
bị định hình *trong lúc* làm — đúng ca nguyên tố 1 cảnh báo, lần này cho thước.

| Đỉnh | Được đổi? | Cửa | Nhân chứng | Kit hôm nay |
|---|---|---|---|---|
| Vật | tự do — mục đích của vòng | S3, vòng sửa S4 (trần 3) | thước | có |
| Lời (hợp đồng) | được, qua người | Cổng Phạm vi duyệt lại · Cổng Bằng chứng khi Known limits không rỗng | người | có — phiên đi đúng cửa này lúc 07:47 |
| Thước | được, phải chứng lại | **không có** | chiều đỏ | nhân chứng có, cửa không: không sổ riêng, không đếm, không trần |

Bốn kiểu đội lốt và nhân chứng của từng kiểu: thước đổi mặc áo làm vật (phiên này —
không cửa nên vô hình) · vật đổi mặc áo sửa thước, tức nới assertion (chiều đỏ chặn;
phiên làm đúng lúc 00:47) · lời đổi mặc áo khai giới hạn (Known limits không rỗng
thì không xanh-sạch, người phải ký — cửa muộn nhưng có) · lời đổi mặc áo làm thêm
vật (bộ lọc vùng vật + «Ngoài hợp đồng» — có kênh). Kit canh ba, hụt một.

Owner rút ra và tôi xác nhận: **hợp đồng là điểm tựa** vì nó là vật duy nhất tồn tại
trước khi chi phí bị tiêu. Nhưng luật không «giúp xác định» hợp đồng bằng cách được
đọc — luật phải đổ vào *hình dạng* của hợp đồng thành trường + một phép kiểm máy một
tầng, đúng khuôn kit đã làm: `## Out of scope` ↔ W3 · `Mobile backend target:` ↔ W5 ·
`## Known limits` ↔ lưới xanh-sạch. Hợp đồng chữa *lãng phí* (có mở không, mở phần
nào); nó không chữa *tường* (thước đứng ở đâu) — đó là việc của cấu hình và đường đo
cấp repo, hợp đồng chỉ trỏ vào qua `## Tiền đề`.

## 4. Brownfield — điều đo được và điều không

Owner hỏi có phải vì crm-onehub và oneflow không dựng từ đầu cùng kit. Đo trên sáu
repo tiêu thụ, hai luật đếm:

| Repo | Xuất xứ | Khai giới hạn — luật lỏng (grep chữ) | Luật chặt (`expected_exit`/`not-run` hoặc Known limits có nội dung) |
|---|---|---|---|
| crm-onehub | import trycompai/crm, 225 commit trước kit | 13/41 | **6/37** |
| oneflow | fork TongFlow, 194 commit trước kit | 11/44 | **8/40** |
| artifact-platform | code của owner, 675 commit trước kit | 6/200 | 1/192 |
| mapposter | dựng cùng kit | 1/18 | 1/15 |
| media-library | dựng cùng kit, 7 commit trước kit | 1/26 | **8/23** |
| floorplanstudio | dựng cùng kit | 0/7 | 0/5 |

Tôi từng trình bản luật lỏng («25–32 % so với 0–6 %») như bằng chứng; luật chặt lật
kết quả ở media-library. Kết luận đứng được: **tường không tương quan với xuất xứ, nó
tương quan với «app có máy trạng thái mà thước không có đường vào»** — onboarding hai
cổng, SSO, khoá trong DB ở crm; tenant, hàng đợi duyệt ở media-library. Brownfield là
*một* nguồn phổ biến của app như thế, không phải nguồn duy nhất. Hai điều khác đo
được: (a) đọc tiêu đề các hồ sơ có khai giới hạn ở crm và oneflow, nhóm lớn nhất là
**vòng meta của kit chạy trên repo sản phẩm** (thước-của-lát, thước-cache, lưới đẩy,
cổng tự canh…) — luật đóng băng meta chỉ có răng ở kho kit; (b) feature mới thật
(`tiep-thi-tuyen-doi-tac`, `director-wire-shape`) phần lớn đo được, vì máy dựng đường
vào cùng với vật. Hệ quả cho thiết kế: **brownfield không cần chế độ riêng** — làm
chế độ là đem bối cảnh repo vào engine. Nó là *một hàng* của một trục S0 chưa có:
trong ba đỉnh, đỉnh nào **đã có trước vòng**.

Một số liệu phụ, kèm cảnh báo: dòng thêm vào `_acceptance/` chia cho dòng code+test
trong cùng kỳ — crm 3,0 · oneflow 2,1 · media-library 1,7 · mapposter 1,9 ·
artifact-platform 1,2 · floorplanstudio 0,12; `_acceptance/` của crm có thể chứa cả
lớp vendored của kit nên số 3,0 là cận trên. Và crm có Preview deploy mỗi PR trên
Vercel cho cả ba app, SHA đọc được qua API deployments của GitHub — kit chưa biết
dùng; oneflow chỉ có Dockerfile.

## 5. Cơ chế xã hội cho bài «người làm cũng là người chấm»

Năm cơ chế, xếp theo hiệu quả trên chi phí: **chốt trước** (đăng ký trước thử nghiệm,
đấu thầu niêm phong — gần 0 chi phí, xoá bậc tự do lớn nhất) · **nhân chứng đối kháng**
(red team, phản biện — nhắm đúng chỗ tự dối cao nhất) · **đổi được nhưng có giá và
có vết** (change order, sổ cái không xoá) · tách người viết (kiểm toán độc lập — trực
giác chọn đầu tiên, kém hiệu quả nhất vì bị bắt giữ và đẻ tầng «ai canh người canh»)
· kiểm mẫu ngẫu nhiên. Ba nguyên lý hội tụ: khoá bậc tự do *trước* thay vì canh *sau*
· mỗi đỉnh một nhân chứng khác đỉnh, người chỉ đứng một đỉnh · đừng cấm đổi — làm cho
đường ngay thẳng là đường rẻ nhất. Kit đã đứng trên ba nguyên lý này ở hai đỉnh; §6 là
đỉnh thứ ba.

## 6. Đề xuất — sau khi tự phá thử

Bản đầu có bốn nhát và một dự báo; phá thử để lại ba nhát, bỏ một, và sửa bốn chỗ.

| Nhát | Vật thay đổi | Phép kiểm máy (hai chiều) | Chỗ đã sửa sau phá thử |
|---|---|---|---|
| **① Trục đỉnh-có-sẵn** | `contract-template`: `## Vật trước vòng` (ở nhánh gốc *sha* · ở prod *quan sát* · giá trị mới tới người dùng — dòng người gạch) và `## Tiền đề` (mỗi dòng trỏ một mục đường đo của repo; không phải tiêu chí). `start-scan`: vật đã ở nhánh gốc ∧ hồ sơ treo → không in «viết code» | W9 chỉ theo **sự thật git** (vật đã ở nhánh gốc ∧ kế hoạch không chạm đường dẫn sản phẩm) · W10 tiền đề trỏ mục không tồn tại → đỏ · dry-run tiền đề trước Cổng Phạm vi | W9 bản đầu dựa vào dòng văn «giá trị mới» → điền-cho-có, và làn V không có người đọc; «ở prod» cần đích triển khai (hoãn) nên cửa sổ này chỉ điền «ở nhánh gốc». Dry-run chỉ cho tiền đề trên trạng thái *đã có*, bằng subagent, **trên DB của lượt** — sự cố 04:38: owner thấy đăng nhập hỏng vì harness đang lật trạng thái DB dev |
| **② Thước có cửa** | sổ gắn `target: thuoc\|vat\|ho-so` suy từ đường dẫn diff · gói Cổng Bằng chứng thêm một dòng `vật +a/−b · thước +c/−d · nhát sửa thước n` · trần gộp toàn vòng → ba lối · lối «mở vòng có chủ ngữ là thước» là **một lệnh** | tag đúng theo đường dẫn · trần: vòng 16/09 chạy lại phải dừng ở nhát ba · diff `rang/` giữa hai lượt chấm bằng **script**, không LLM | bản đầu đếm *dòng* thước/vật → sai với vòng TDD (test mới là thước hợp lệ) → chỉ đếm sửa thước khi `status: implemented`; trần đếm nhát bị gộp commit qua mặt → lớp hai là script diff; **không** cho làn phản bác soi hồ sơ — sẽ phá lại nhát vùng-vật 14/09 |
| ③ Đóng băng meta trên repo tiêu thụ | — | — | **bỏ**: cờ theo `scripts/` mơ hồ theo repo; phần lớn vòng meta ở crm là cần thiết (CI đỏ, DB riêng mỗi lượt); hạt giống «vòng meta đang mở: N» của finding 15/09 §4 đã phủ ý này |
| **④ Khuôn đường đo cấp repo** | kit ship *khuôn giao diện* của một mục đường đo: `--chay <lệnh răng>` · mã 2 khi hỏng tiền đề · đặt/trả · DB của lượt · **máy chủ tự xưng cây + SHA** (lỗi `chotMayChu()` so một chuỗi giống hệt ở mọi cây); code thuộc repo — rút từ `scripts/lan-do/` của crm | W10 · máy chủ trỏ cây khác → răng từ chối đo (mã 2) | «init dò cổng chắn» bản đầu là LLM đọc middleware — lời dặn có checklist, không phải bất biến máy giữ; phép thử «trên crm liệt được 3 cổng» không chạy được trong CI kit → giữ phần máy giữ, phần dò là advisory |

Hoãn có tên: **đích đo là bản triển khai** (`config.targets`, ghim SHA tự xưng) — CỘNG
lớn nhất, xoá trọn lớp «máy chủ trỏ nhầm cây / chết giữa chừng / build đá dev» nhưng
chỉ có giá trị với repo có preview deploy và chỉ cho tiêu chí đọc. Là nhát cắt gọi
tên cho cửa sổ kế. Dự báo bản đầu «mất bốn câu hạ tầng» **không** được ①②④ đỡ —
hai câu về máy chủ chỉ mất khi có đích triển khai hoặc «máy chủ tự xưng cây».

## 7. Quyết định owner 16/09 và việc đã mở

Sáng 16/09 owner đã chốt **R** (`2026-09-15-dieu-chinh-sau-2-14-token-va-vong-meta.md`):
cửa sổ 2.14 → 2.15 **0 vòng meta mới**; điều kiện mở một vòng ở 2.15 → 2.16 đọc từ
dòng 4b của R1 — một vòng sản phẩm thật. Gói §6 vì thế **không mở vòng**; nó vào
hàng như một ô và phải giành chỗ bằng số. Owner phê 16/09 sau khi đọc bản rà (§6):

- **Ô `thuoc-co-cua`** ở `discovery` (`_acceptance/thuoc-co-cua/opportunity.md`), ba
  nhát ①②④, điều kiện có số: nhát sửa thước S4 ≥ 3 *hoặc* tiền đề bắt ≥ 1 tường trước
  Cổng Phạm vi ở R1 → có căn cứ xếp hàng cạnh router/token theo R; cả hai bằng 0 → park.
- **Chip 1 (kho kit)** — `start-scan`: nhóm «vật đã ở nhánh gốc» thay «viết code», kiểm
  ba chiều, đặt vào hồ sơ mốc `release-2-15-0` theo tiền lệ vá-trong-mốc 2.11.0 (T2,
  không mở vòng meta; CỘNG đã phê đích danh — ADR 0018).
  *Trạng thái 16/09:* code + ca kiểm hai chiều xong, suite xanh, hồ sơ mốc mở ở `draft`
  — nằm trên nhánh `claude/objective-bhabha-5ae50a`, **chưa vào main**: lưới trước-merge
  chặn code chịu cổng đi kèm hồ sơ mốc chưa arm. Owner chọn giữ nhánh tới lượt chấm S4
  của mốc 2.15.0 (sổ `release-2-15-0`). Phiên cắt mốc: rebase nhánh này trước khi chấm.
- **Chip 2 (crm-onehub)** — phép đo ngừng ghi `evidence/ve-that.json` của hồ sơ đã ký.
- **Chip 3 (oneflow)** — R1 `skill-system-v1`: thử ① và ② **bằng tay** trong hợp đồng
  của vòng, không đổi kit; `wf-usage` đủ mọi lượt.
- **Chip 4 (kho kit)** — nhân chứng độc lập: một phiên khác đọc hồ sơ R1 sau Cổng Bằng
  chứng, ghi bốn số (tiền đề dry-run · nhát sửa thước S4 · dòng 4b · lượt gọi người
  tách hạ tầng) vào finding mới và vào mục điều kiện của ô. Người làm không tự chấm.

## 8. Chưa biết — không ước

Hoá đơn thật của phiên chính (không có `wf-usage`) · dòng 4b của R1 · máy chủ dev của
crm tự tắt đúng 1 phút 42 giây mỗi lượt trong lúc vẫn phục vụ, nguyên nhân chưa rõ,
phiên né bằng vòng trông coi — chưa ai chữa · số đếm luật chặt ở §4 là cắt ngang một
ngày, chưa có chuỗi theo cửa sổ để nói xu hướng.
