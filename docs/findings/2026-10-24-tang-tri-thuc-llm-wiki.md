# Tầng tri thức theo LLM Wiki — nguồn của lượt cắt `tri-thuc-2410`

24/10/2026. Phiên `nguon-di-cung-luot-cat` (MacBook Pro), mở từ phiên phân tích crm. Chủ kho chốt hướng trong phiên
cùng ngày: đồng ý khái niệm LLM Wiki; đổi ở tầng kit vì kit, crm và onehub-invest cùng cắt lượt; tri thức phục vụ cả
vòng feature-loop chạy đơn lẻ, không chỉ cắt lượt và lộ trình; giữ crm công khai (không đo lại chi phí CI); bổ sung
phần này vào lượt cắt của kit.

## 1. Vấn đề, đo trên ba kho

Chủ kho phát hiện 24/10: lộ trình không mang bối cảnh nghiên cứu và thảo luận tới vòng làm việc. Chuỗi trên kit
2.33.1:

| Mối nối | Hôm nay | Máy giữ? |
|---|---|---|
| nghiên cứu → bản phạm vi | khoá `nguon` của bản phạm vi là chữ tự do | không |
| bản phạm vi → hàng | `dot` · `phu` · bảng phủ của `cat-luot.mjs` | có |
| hàng → ô cơ hội | `lo-trinh.mjs --mo-o` chép câu giao, `vi_sao`, mốc; không ghi nguồn | không |
| ô → bước thiết kế | S1 đọc ô, câu giao, luật kho, vật đã có | có, nhưng ô không mang nguồn |
| thảo luận TRONG vòng → vòng sau | lời chủ kho ở cổng nằm trong sổ của một hồ sơ; vòng sau không tra | không |

| Kho | Công khai | Cắt lượt | Nguồn của bản phạm vi |
|---|---|---|---|
| crm-onehub | có | 6 bản phạm vi, 38 hàng chưa ký | chữ tự do; hai đợt trỏ artifact claude.ai riêng tư của một tài khoản; hai đợt chỉ có trong phiên chat ở máy kia |
| onehub-invest | có | 7 bản phạm vi, 76 hàng (63 chưa ký) | chữ tự do; trỏ lẫn tệp trong kho với phiên điều phối, tệp chỉ có ở một máy, issue, artifact riêng tư, thư mục nháp đã mất |
| acceptance-gate-kit | có | hàng ghi tay, 58 hàng, chưa có bản phạm vi | `vi_sao` dạng «Gốc: …» trỏ hồ sơ |

Invest đã tự vá bằng tay: `docs/plan/BOI-CANH.md` «đọc trước khi mở vòng một hàng» (nền chung, quyết định, nguồn theo
đợt, ghi chú theo mã) — một index LLM Wiki làm tay, nhưng ô không trỏ tới nên phiên mở vòng đọc hay không là tuỳ. Lượt
cứu ở crm 24/10 dựng lại được bốn trên sáu đợt từ bản ghi phiên; hai đợt nằm ở tài khoản của máy kia.

Chín kho khác trên máy (OpenMAIC, MapPoster, OneFlow công khai; aes, artifact-platform, artifact-platform-design,
floorplanstudio, media-library, radar riêng tư) không khai lộ trình.

## 2. Mẫu gốc

LLM Wiki (Karpathy, gist 04/04/2026): ba tầng — raw bất biến, wiki do máy viết và giữ, schema (tệp luật cho tác tử) —
và ba thao tác: ingest (một nguồn chạm nhiều trang), query (câu trả lời tốt ghi ngược thành trang), lint (trái nhau,
cũ, mồ côi, thiếu trang). Hai tệp điều hướng: `index.md` và `log.md` chỉ thêm. Nghiên cứu nền chi tiết của mẫu: kho
crm `docs/plan/kho-tai-lieu-ho-so/01-nguon-goc-mau-hinh.md` (công khai). Hướng trưởng thành trong cộng đồng quanh
gist: nhận định trỏ nguồn ở mức đoạn, ghim phiên bản nguồn (`tệp@sha`), băm nội dung, mọi lần ghi qua review.

## 3. Thiết kế

### 3.1 Kho tri thức — hình dạng cố định, nơi để do kho chọn

Khai một lần trong `_acceptance/config.yaml`:

```yaml
tri_thuc:
  noi: docs/tri-thuc                 # thư mục ngay trong kho
  cong_khai: true                    # kho tiêu thụ công khai — bật răng riêng tư (3.5)
  kho: { ten: <tên>, duong: ../<tên>, remote: <url> }   # kho riêng đi kèm, giữ raw
```

Kho không khai `tri_thuc` → không hành vi nào đổi. Kho riêng đi kèm dùng khi kho tiêu thụ công khai mà nghiên cứu có
lời nguyên văn của người, ảnh chụp sản phẩm bên thứ ba, dữ liệu khách hàng — riêng tư là theo NỘI DUNG. Đường kho riêng
giải theo checkout chính (`git rev-parse --git-common-dir`), không theo gốc worktree (đợt Điều phối dựng hàng chục
worktree).

```
TRI-THUC.md        luật riêng của kho (tên khác CLAUDE.md để không đè tệp luật của kho khi để trong kho)
raw/<ngày>-<tên>/  nguon.md (loai · goc · luc · ai · bam) + nội dung, ảnh — bất biến
wiki/nen/          nền chung, mọi vòng đọc
wiki/chu-de/       chủ đề, thực thể, đối thủ
wiki/dot/          một trang mỗi đợt cắt: mã → trang chủ đề
```

Không commit `index.md` hay `log.md` (phản biện 24/10, mục 7): chỉ mục máy sinh LÚC ĐỌC từ frontmatter, lịch sử ghi là
`git log` của thư mục. Một tệp chỉ thêm và một tệp sinh lại mà nhiều worktree cùng commit là xung đột gộp ở mọi PR thứ
hai — đúng đoạn ký→gộp North Star đang đo.

Frontmatter trang (khối marker một nguồn cho bên ghi và bên đọc): `loai` (nen | chu-de | dot), `ma` (mã hàng, rỗng với
trang nền), `nguon` (danh sách tệp raw), `cap_nhat`. Đường trỏ ghim theo BĂM NỘI DUNG, không theo sha commit:
`<đường>#<git hash-object>` cho thư mục trong kho, `<kho>:<đường>#<băm>` cho kho riêng; sha commit chỉ là gợi ý. Lý do:
sha của nhánh PR mất sau gộp squash, và sha chưa đẩy ở máy A thì máy B không thấy — cùng nếp dòng nạp luật sản phẩm
(ADR 0024). Lint từ chối con trỏ tới kho riêng mà remote chưa có.

### 3.2 Ba điểm chạm với vòng

| Lúc | Vòng từ hàng lộ trình | Vòng đơn lẻ (`/feature-loop <mô tả>`) |
|---|---|---|
| Trước — ingest | phiên nghiên cứu, thảo luận ghi vào tri thức | như bên trái |
| Vào — tra và nạp | chọn trang theo mã của hàng; ô mở việc ghi dòng «Nguồn:» (nền + trang đợt + trang mang mã) | tra theo mô tả (tìm chữ trên tiêu đề, frontmatter, mục) + trang nền; bước thiết kế chọn trang |
| Thảo luận trong vòng | bộ tra đọc thẳng sổ quyết định của mọi hồ sơ (mở rộng claim-scan) | như bên trái |

Không có bước «ghi ngược quyết định thành trang» (phản biện 24/10, mục 3): lời chủ kho ở cổng đã nằm trong sổ quyết
định của hồ sơ — chép sang trang là hai nguồn trôi khỏi nhau, và ghi sau chữ ký là thêm bước ở đoạn ký→gộp. Thảo luận
TRONG vòng tới vòng sau bằng cách bộ tra đọc sổ, một nguồn.

Hai đường vào hội tụ ở MỘT chỗ: dòng sổ «đã tra tri thức» ở bước thiết kế — câu tra hoặc mã, trang đã đọc (đường trỏ
băm), hoặc «đã tra, không có trang liên quan». Thẻ Cổng Phạm vi kiểm dòng ấy ở mọi vòng của kho đã khai `tri_thuc` và
chỉ hiện CỜ khi thiếu, lệch băm hay không đọc được — không hiện danh sách trang (lời mời chỉ chứa điều chỉ người biết).
Thiếu dòng ở hồ sơ `draft` → điều kiện vào Cổng Phạm vi như cỡ hợp đồng: máy tự tra, tự ghi, dựng lại thẻ — không mời
người.

Căn cứ từ trang tri thức: dòng sổ S1 mang con trỏ `tri_thuc: "<kho>:<trang>#<băm>"` thay cho cặp `tep` + `trich` khi
trang nằm ở kho riêng — KHÔNG chở câu trích từ kho riêng vào sổ, design doc hay mô tả PR công khai (phản biện 24/10,
mục 2). Bộ xếp căn cứ nhận dạng này là căn cứ mục tiêu khi băm khớp bản trang ở máy; không đọc được thì nhãn «không đọc
được ở đây», không rơi thành câu hỏi cho người. Máy không có bản kho tri thức (máy kia, phiên cloud) → nhãn «không đọc được ở
đây», cờ vàng, không chặn; lệnh tra tự clone khi có remote và quyền.

### 3.5 Răng riêng tư (phản biện 24/10, mục 1)

Kho khai `cong_khai: true`: lệnh ghi tri thức không bao giờ commit nội dung raw vào kho tiêu thụ — raw đi kho riêng;
kho tiêu thụ chỉ nhận trang wiki đã tóm. Kho công khai chưa khai kho riêng mà nguồn là phiên chat, artifact hay ảnh →
lệnh dừng, trả câu hỏi khó-đảo cho người (đẩy lên kho công khai không thu hồi được). Lint đỏ khi thư mục tri thức của
kho công khai có tệp raw. Chủ kho chốt 24/10 cho crm: «Tài liệu nghiên cứu thô (thảo luận, ảnh, số liệu nội bộ) để ở
một kho riêng tư đi kèm crm; kho crm công khai chỉ giữ con trỏ ghim theo commit và bản tóm tắt đã làm sạch.» Phần
còn là lời: «bản tóm đã làm sạch» — máy không chứng được trang tóm không lộ gì; khai giới hạn ở mục 5.

Thư mục tri thức của kho phải nằm trong `risk_tiers.t1_skip_globs` của kho (ảnh trong `raw/` ở kho không coi `docs/**`
là T1 thì PR cắt lượt chạy CI nặng) — lệnh khởi tạo in dòng khai.

### 3.3 Đóng gói — theo nếp road-map

Phần máy ở `acceptance-gate` (các bên đọc — răng phủ, mở ô, thẻ, bước thiết kế — đều ở đó; tách gói là lệch phiên bản,
lớp lỗi «một cây nguồn» đã gỡ): `scripts/tri-thuc.mjs` (lint, chỉ mục lúc đọc, chọn trang cho hàng, tra theo mô tả,
kiểm đường trỏ băm) và khuôn `skills/acceptance/references/tri-thuc-template.md`. Gói mỏng `tri-thuc` là lối vào cho
người và phiên: `/tri-thuc:ghi` (ingest) và `/tri-thuc:kiem` (lint); `/tri-thuc:xem` (bản đồ) và `/tri-thuc:hoi` (hỏi tự
do) để chờ điều kiện. Bật theo kho: plugin trong `.claude/settings.json` + khoá `tri_thuc`.

### 3.4 Lint máy — sáu lỗi cấu trúc

Trang thiếu `nguon` · trang trỏ raw không có · raw bị sửa (băm lệch `nguon.md`) · mã của một bản phạm vi không có
trang nào · con trỏ tới kho riêng mà remote chưa có · tệp raw nằm trong thư mục tri thức của kho công khai. Lint NGHĨA (trái nhau, cũ,
hợp đồng trái nghiên cứu) cần mô hình — để chờ điều kiện.

## 4. Đối chiếu luật kit

| Luật | Thiết kế |
|---|---|
| North Star — đích GỘP ĐƯỢC, thước ký→gộp | Không thêm bước nào sau chữ ký: dòng «đã tra» không vào pre-merge, recheck, làn ghim lại; nguồn ghim sha nên sửa tri thức không làm hồ sơ cũ đi. |
| ≤ 3 lượt gọi người mỗi vòng | Không thêm lượt: thay đổi wiki đi chung PR cắt lượt; thiếu dòng «đã tra» máy tự gỡ; căn cứ trỏ kho riêng bằng con trỏ băm vẫn là căn cứ mục tiêu, không rơi thành «Hỏi-n». Lượt người mới: tạo kho riêng (một lần mỗi kho) và câu hỏi khó-đảo khi kho công khai chưa có nơi riêng mà nguồn nhạy cảm — khó-đảo luôn thắng mục tiêu số. |
| Cấm dặn-bằng-lời làm nghiệm | Mỗi mối nối có răng: lint, răng phủ đòi nguồn là trang ghim, thẻ kiểm dòng «đã tra». Phần còn là lời: chọn nội dung nào để riêng; độ liên quan của trang khi tra theo mô tả (khai giới hạn + thước). |
| Sửa vì một kho phải cân mọi kho | Bật theo lựa chọn (khoá `tri_thuc`); kho không khai: ô, thẻ, răng không đổi một byte. Đo: ba kho cắt lượt, cả ba gặp cùng lỗi. |
| Đổi schema phải có đường đọc-cũ | Bản phạm vi `nguon` chữ tự do đời trước vẫn mở ô, mang cờ; hồ sơ không dòng «Nguồn:» đọc như cũ. |
| CỘNG cần chủ kho phê | Năm hàng là CỘNG; chủ kho phê ở Cổng Phạm vi của từng vòng. |
| Kit là engine — không chứa nội dung kho | Kit mang khuôn, máy, lệnh; tri thức của kho nằm ở kho. Tri thức của chính kit hoãn (phản biện mục 7: meta). |

## 5. Giới hạn đã khai

- Dòng «đã tra» chứng máy đã TRA và đã CHẠM trang (băm), không chứng đã HIỂU hay đã chọn ĐÚNG trang. Ngưỡng đang đếm:
  sau 10 hồ sơ có dòng «đã tra» ở các kho đã khai `tri_thuc`, nếu dưới 30 % có ≥ 1 dòng căn cứ S1 trỏ trang tri thức
  (đếm bằng bộ xếp căn cứ sẵn có, `can-cu-s1.cjs --dem`) thì mở mục chờ «tra theo nghĩa».
- «Bản tóm đã làm sạch» ở kho công khai là lời: máy không chứng được trang tóm không lộ lời nguyên văn hay dữ liệu nội
  bộ. Ngưỡng: 1 lần chủ kho phải gỡ nội dung khỏi kho công khai vì trang tóm → mở răng quét trang tóm.
- Ingest có thể đọc sai nguồn và cái sai lan sang vòng sau. Chặn một phần bằng nhận định trỏ raw có băm; phần còn lại là
  lint nghĩa (chờ điều kiện).
- Cỡ: mẫu chạy tới khoảng 100 nguồn mỗi kho (Karpathy tự nêu). Vượt thì cần tìm kiếm lai.

## 6. Vật liệu đã có

Nhánh `vong/nguon-di-cung-luot-cat` (hồ sơ NG1, dừng trước Cổng Phạm vi): thiết kế, hợp đồng mười tiêu chí và phản biện
năm phát hiện cho mối nối «nguồn trong git → dòng Nguồn của ô → dòng nạp ở bước thiết kế → thẻ chặn». Các tiêu chí về
ô, thẻ, dòng nạp, chiều im trên kho không dùng là căn cứ cho TT3, TT4. Hồ sơ NG1 xếp lại khi lượt cắt này gộp.

## 7. Phản biện context sạch 24/10 và cách xử

Tác tử phản biện đọc thiết kế, `CLAUDE.md` của kit, skill cắt lượt và mục S0/S1/Sổ quyết định của feature-loop. Phán
quyết: chưa đủ để cắt, bảy phát hiện. Xử lý:

| # | Phát hiện | Xử lý |
|---|---|---|
| 1 | P0 — chất riêng tư vào kho công khai là khó-đảo không cổng | sửa: mục 3.5, khoá `cong_khai`, raw không bao giờ vào kho công khai, dừng hỏi khi chưa có nơi riêng, lint đỏ |
| 2 | P0 — câu trích từ kho riêng rò vào sổ/design doc công khai; không trích thì rơi thành «Hỏi-n» | sửa: căn cứ dạng con trỏ băm, bộ xếp căn cứ nhận dạng này |
| 3 | P1 — ghi ngược trùng sổ quyết định, ghi sau chữ ký | sửa: bỏ trang quyết định và bước ghi ngược; bộ tra đọc sổ của mọi hồ sơ |
| 4 | P1 — `log.md`, `index.md` commit chung gây xung đột gộp | sửa: chỉ mục sinh lúc đọc, lịch sử là `git log` |
| 5 | P1 — ghim sha commit không phân giải được (squash, chưa đẩy, CI) | sửa: ghim băm nội dung; lint từ chối kho riêng chưa có ở remote |
| 6 | P2 — răng chỉ kiểm có mặt, ngưỡng không số, thẻ chở danh sách | sửa: ngưỡng số (mục 5), thẻ chỉ hiện cờ |
| 7 | P2 — phạm vi quá rộng cho một CỘNG | sửa một phần: `/tri-thuc:xem` và tri thức của chính kit hoãn; thư mục tri thức vào `t1_skip_globs`. Giữ kho riêng (chủ kho đã chọn cho crm 24/10) và tra theo mô tả cho vòng đơn lẻ (chủ kho chốt 24/10) — nhưng tách thành hàng riêng đứng SAU lõi lộ trình, để lõi gộp và nhận được trước |
