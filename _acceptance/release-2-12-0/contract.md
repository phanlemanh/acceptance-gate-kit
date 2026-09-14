---
schema_version: 1
feature: Phát hành kit 2.12.0 — đóng số cho cửa sổ 2.11→2.12, THUẦN CẮT SỐ. Năm vòng đóng trong cửa sổ đưa 182 tiêu chí tới ba kho tiêu thụ và đóng cửa veto sau chữ ký.
slug: release-2-12-0
owner: phanlemanh@gmail.com
risk_tier: T2               # KHÔNG chạm t3_paths — mốc này chỉ cắt số. Khác 2.10.0 và 2.11.0 vốn phải lên T3 vì vá lib/** TRONG mốc. Vì là T2 nên làn V mở.
surfaces: [cli]
status: implemented
approved_by: Phan Le Manh
approved_at: 2026-09-13
---

# Acceptance Contract: release-2-12-0

## Context

Cửa sổ `45e5f1d8` (merge PR #166 — mốc 2.11.0) → `HEAD`: **134 commit đo tại
`3f492e2e`, NĂM vòng đóng.**

*Giới hạn đã khai (sửa ở lượt chấm 4, SỐ sửa lại ở lượt chấm 5):* con số commit là ẢNH
CHỤP tại một sha, không phải bất biến. Lượt 4 ghi «130 đo tại `3f492e2e`» — sai: 130 đo
ở một HEAD sớm hơn, còn tại `3f492e2e` phép đếm cho **134**. Đúng lớp lời-khai-không-
đối-chiếu-được mà lượt 4 vừa đi sửa, mắc lại ngay trong chính lượt sửa. Con số cộng thêm
một sau mỗi commit sửa hồ sơ này — tại HEAD của lượt chấm 4 là 137, lượt chấm 5 là 138 —
và hai commit BẮT BUỘC theo thiết kế
(chữ ký Cổng 2, ghim lại) còn cộng nữa. Bản lượt 2 từng dựng một eval đối chiếu số này
và chính nó là ca «bất biến không được nằm trong hồ sơ đã ký» phải gỡ: không có HEAD nào
nó xanh được lúc ký. Nên số này ghi kèm sha đo, KHÔNG có eval canh; **NĂM vòng đóng** là
vế bất biến và đó là vế mọi kết luận của mốc dựa vào.

Neo đầu SỬA sau lượt chấm 1: bản trước ghim `698badbf`, thật ra là một commit Cổng 1.5
GIỮA vòng `cua-veto-sau-chu-ky`, nằm 28 commit SAU mốc. Bảng lớp vendored ở Notes §2 vì
thế đo từ nền sai — lần này bốn số trùng nhau khi đo lại từ nền đúng, nhưng **đúng do
may, không do phép đo**.

| Vòng | Hạng | Giao gì |
|---|---|---|
| `ma-so-quyet-dinh-duy-nhat` | T2, làn V | mã sổ quyết định theo khuôn `d-<UTC>-<n>` ở bên ghi, khoá overlay theo dòng ở bên đọc |
| `ghim-lai-tren-lop-cu` | T2 | làn ghim lại gặp lớp acceptance-gate cũ thì dừng CÓ TÊN thay vì `TypeError` thô |
| `cua-veto-sau-chu-ky` | T3 | chữ ký người ở Cổng Bằng chứng đóng cửa veto — lưới từng nói sai 27 trên 30 hồ sơ |
| `lan-doc-status-not-run` | T3 | làn ghim lại và bên đọc pin cùng đọc `status: not-run` từ MỘT nguồn |
| `cong-nguoi-doc-du-nguon` | T3 | thẻ đọc được tiêu chí khai bằng TIÊU ĐỀ và cả ba cách đặt tên mục, ở ba bên gọi |

**Mốc này THUẦN CẮT SỐ.** Không vá gì trong mốc. Khác có chủ ý so với hai mốc trước:
2.10.0 vá lỗ fail-open làn V và 2.11.0 vá bộ giải nháy, cả hai kéo hồ sơ mốc lên T3 và
mất lối làn V. Cửa sổ này không có lỗ nào đòi vá gấp nên mốc giữ T2.

**Vì sao mốc là việc kế tiếp.** Kho tiêu thụ đang chạy bộ bóc tiêu chí CŨ. Giá trị của
năm vòng trên chỉ chạm người ở BẢN PHÁT HÀNH; tới lúc đó nó là mã nằm trên `main`.

Đo trên hồ sơ THẬT của các kho tiêu thụ trên máy owner, 13/09, gom theo KHO GỐC bằng
`git remote get-url origin` (nhiều cây dưới `~/dev` là bản sao của cùng một sản phẩm):

| Kho gốc | cây đại diện | sha | Hồ sơ | Đọc thêm | Tiêu chí cứu được |
|---|---|---|---:|---:|---:|
| crm-onehub | crm | `389a6a7` | 31 | 10 | 80 |
| artifact-platform | ap-media-roadmap | `16e43c66c` | 192 | 7 | 71 |
| OneFlow | oneflow | `658b076` | 40 | 3 | 31 |
| floorplanstudio · radar-realestate · MapPoster · media-library · policy-graph-hub | | | 40 | 0 | 0 |
| **TỔNG (8 kho gốc)** | | | **303** | **20** | **182** |

**Hai lần đính chính số này.** Thân PR #174 nêu 1 110 — đo trên 22 cây gồm chính kho kit
và bản sao worktree. Bản Cổng 1 của hợp đồng này nêu 253 — đếm `artifact-platform` hai
lần dưới hai tên cây. Số đúng là **182**.

*Giới hạn đã khai:* bảng này KHÔNG có eval, và script sinh ra nó đã bị GỠ khỏi hồ sơ ở
lượt chấm 2. Lý do ở Known limits — một script duyệt `~/dev` để đếm hợp đồng của tám sản
phẩm khác là product context của repo tiêu thụ nằm trong engine, thứ hiến pháp kit cấm
bằng đúng phép thử «vô nghĩa với một công ty khác dùng kit».

## Criteria

### AC-1 (cắt số) — MỘT số, nhất quán ở mọi bề mặt người dùng đọc

**Given** cây tại HEAD của hồ sơ mốc
**When** chạy ca thường trực `P200`
**Then** hai plugin `acceptance-gate` và `feature-loop` cùng mang **MỘT** số; cả ba số
hợp semver; `GUIDE.md` dẫn xuất số ĐÓ từ manifest chứ không gõ tay; mục mô tả của chính
số đó nói người dùng nhận gì; và `feature-loop` tự khai cặp `acceptance-gate >= <số đó>`.

*Vế GIÁ TRỊ («số đó là `2.12.0`») KHÔNG thuộc vế Then này — owner quyết lượt chấm 5.*
Then cũ khẳng định literal `2.12.0`, nhưng không mắt nào trong chuỗi đo đọc con số ấy:
`P200` lấy `const V = A.v.version` rồi suy MỌI vế từ V và tự khai «cố ý không canh số đã
tăng so với base», nên eval xanh ở mọi HEAD có ba manifest tự-nhất-quán — kể cả 2.11.0
hay 2.13.0. Ghim literal vào răng thì đổi lại hồ sơ ĐÃ KÝ đỏ giả ở mọi HEAD sau 2.13.0.
Không đường nào giữ cả hai, nên vế giá trị về đúng chủ: **`2.12.0` là điều owner khai ở
Cổng Đáng và xác nhận MỘT dòng trên thẻ ở Cổng Bằng chứng**; máy giữ vế QUAN HỆ, thứ nó
giữ được ở mọi HEAD tương lai. Đây là «điều-chỉ-người-biết» theo đúng luật lời mời cổng,
không phải một giới hạn chưa vá được. Ca `P200` là ca VĨNH VIỄN đọc mọi số TỪ manifest — hồ sơ này KHÔNG dựng dàn
đo dùng-một-lần, vì ba mốc 2.0.0 · 2.1.0 · 2.2.0 mỗi lần tự dựng một dàn riêng và mỗi
vòng soi lại tìm ra một cách nó không đo thật.

### AC-2 (cắt số) — `diagram-design` không đổi KỂ TỪ lần cắt số của chính nó, đo được và KHÔNG fail-open

**Given** `diagram-design/` không đổi dòng nào trong cửa sổ
**When** chạy `rang-moc.sh --chan diagram` của hồ sơ này
**Then** răng xanh và nó xanh vì ĐO chứ không vì thiếu vật: mốc so là lần CẮT SỐ gần
nhất của chính `diagram-design`, suy TỪ KHO; cửa sổ mốc..HEAD phải KHÔNG rỗng; và
pathspec `diagram-design/` phải còn khớp vật trong cây. SÁU lối hỏng có mã thoát riêng:
2 cờ sai / thiếu giá trị / cờ lạ · 3 không tìm được lần cắt số · 4 cửa sổ rỗng ·
**5 `diagram-design/` CÓ đổi sau lần cắt số** (VẬT nói dối) · 6 không đọc được số tại
HEAD · **8 không có NỀN để đo** — ROOT không phải kho git, hoặc pathspec chết (HẠ TẦNG
của phép đo). Mã 5 nói về VẬT; 2, 6 và 8 nói về HẠ TẦNG của phép đo.

*Chân 4 và mã 7 ĐÃ TRỪ — owner quyết lượt chấm 5.* Bản lượt 2–4 có thêm chân 4 so số
tại HEAD với số tại mốc phát hành TRƯỚC, để vế Then «giữ 2.7.0» không rỗng nghĩa. Nhưng
chân ấy tương đối với HEAD: ở chiến dịch ghim lại kế, khi `diagram-design` lên 2.8.0,
mốc phát hành «trước» suy ra là đuôi của chính mốc 2.12.0 (nơi số còn 2.7.0) nên răng
của hồ sơ ĐÃ KÝ đỏ vĩnh viễn vì một sự thật không liên quan đến nó — ĐÚNG lý do bản đầu
tiên của răng bị bác ở lượt chấm 1. Vế giá trị `2.7.0` vì thế đi cùng đường với AC-1:
owner khai ở Cổng Đáng, xác nhận một dòng trên thẻ; máy giữ vế «không đổi kể từ lần cắt
số của CHÍNH NÓ», thứ đúng ở mọi HEAD tương lai nên hồ sơ đã ký còn ghim lại được.

**Mốc so SUY TỪ KHO, không sha nào gõ vào cấu hình hay vào `expected`.** Lượt chấm 3 bắt
được hậu quả của việc gõ sha: `expected` ghim `45e5f1d8` trong khi răng in `ef36d81f`,
tức một lời khai không bao giờ đối chiếu được.

### AC-3 (không hồi quy) — bốn suite và bản đồ sản phẩm XANH tại HEAD của mốc

**Given** cây tại HEAD sau khi cắt số
**When** chạy `tests/scripts` · `tests/hooks` · `tests/plugins` · `tests/workflows` và
`product-map.mjs --root . --check`
**Then** cả năm đều thoát 0. Cắt số là sửa manifest, và manifest được đọc bởi bộ giải
plugin lẫn ca thường trực — nên «chỉ đổi ba dòng số» KHÔNG phải lý do bỏ lưới.

### AC-4 (hồ sơ mốc) — bốn khối bắt buộc, có nguồn rút cho từng số

**Given** `## Notes` của hợp đồng này
**When** hội đồng đọc ở Cổng Bằng chứng
**Then** có đủ bốn khối và mỗi khối mang số THẬT, không phải tiêu đề suông: ba dòng số
của luật (c) · bảng lớp vendored 9 mục với +/− đo tại sha nêu tên · lớp lỗi tái phát gọi
tên kèm dẫn chứng · nhát cắt kế gọi tên. Khối nào cố ý để trống phải khai rõ lý do.

**Ba dòng số là VĂN ĐẾM TAY, khai thẳng ở Known limits** — đúng tiền lệ ba mốc 2.9.0,
2.10.0 và 2.11.0. Lượt chấm 2 đã GỠ một eval định chấm chúng bằng máy; lý do ở Known
limits, và nó là bài học đắt nhất của hồ sơ này.

## Coverage

Quét bằng `morphological-scan`, preset test-matrix. Hai trục, không gian Core = 8 ô.

| Trục | Giá trị |
|---|---|
| VẬT bị đo | manifest của ba plugin · `GUIDE.md` · `diagram-design/` · bốn suite · hồ sơ mốc |
| CHIỀU | xanh (số nhất quán) · đỏ (số lệch / có đổi mà giữ số) · không-đo-được (vật vắng) |

Ô Core có AC phủ: MỘT số nhất quán ở mọi bề mặt (AC-1) · không đổi kể từ lần cắt số
của chính nó, với sáu lối hỏng riêng (AC-2) · hồi quy bốn suite (AC-3) · hồ sơ mốc đủ bốn khối (AC-4).

Ô Never: «số đã tăng so với base» — đã TRỪ khỏi P200 từ 18/08 vì nó kéo theo một mốc
di động làm mọi làn song song đỏ oan ngay sau khi mốc merge.

[CE chưa kiểm chứng] — không có.

## Đường đo

Hai cột TÁCH BẠCH, vì chúng đo hai thứ khác nhau và chỉ một trong hai thuộc mốc này.

**Đo được TẠI mốc** (thuộc hồ sơ này):

| Trục | Trước mốc | Sau mốc |
|---|---:|---:|
| Tiêu chí kho tiêu thụ SẼ đọc thêm khi chép lớp mới | 0 | 182 |
| Hồ sơ tiêu thụ SẼ đọc thêm | 0 | 20 |
| Kho tiêu thụ ĐÃ chép lớp mới | 0 trên 8 | **0 trên 8** |
| `diagram-design` | 2.7.0 | 2.7.0, có răng chứng minh |

Dòng thứ ba cố ý ghi 0: chép lớp mới là việc của **chiến dịch rollout**, nằm ở Out of
scope. Bản Cổng 1 của hợp đồng này từng ghi «8 trên 8 sau mốc» — đó là khẳng định về
kết quả của một việc đã descope, và nó sẽ vào sử liệu mà không ai bác được nếu rollout
dừng giữa chừng như mốc 2.11.0 (3 trên 6 gộp). Đã sửa.

**Chỉ đo được SAU rollout** (KHÔNG thuộc bằng chứng của mốc này): số kho thật sự chạy
lớp mới, và số tiêu chí thật sự hiện trên thẻ ở các kho đó.

## Out of scope

- **Chiến dịch ghim lại của mốc** — chạy sau khi hồ sơ này gộp, một chiến dịch mỗi
  release, đúng charter 07/08 mục 1d.
- **Rollout tới tám kho tiêu thụ** — mỗi kho một PR, chủ kho gộp. Trong đó có một mục
  CÓ TÊN phải kiểm: `lib/evidence-core.cjs` lệch ở **cả tám kho**, không kho nào khớp
  2.11.0 và ba kho lệch khác nhau. Sổ tay ghi một phần là trôi-cũ vô hại, một phần là
  vá local thật. Không mở vòng mới cho nó; nó là một mục của chiến dịch rollout.
- **Sáu ngả sửa của ô `thuoc-khong-lat-verdict`** — mở SAU mốc này, cả sáu một vòng,
  chấm bằng cổng CŨ. Ngả 1 sửa chính luật tính verdict nên dùng luật đã sửa để chấm
  việc sửa đó là vòng tròn; và nhét nó vào đây biến mốc từ T2 làn V thành T3.
- **Ba ô mở 13/09** (`bo-giai-nuot-chu-thich-yaml` · `chieu-do-xanh-vi-ban-tiem-sap` ·
  `evals-khai-chieu-do-khong-co-vat`) và **mười hồ sơ chờ Cổng Giá trị** — mười phiên
  nghiệm thu là mười lượt gọi người, đúng thứ chi phí cửa sổ này vừa đo được.
- **Vá bất cứ thứ gì TRONG mốc.** Cửa sổ không có lỗ nào fail-open đang cháy. Giữ mốc
  ở T2 là điều kiện để làn V mở và để mục tiêu ≤1 lượt gọi người còn với tới được.

## Known limits

**Ba dòng số của luật (c) là VĂN ĐẾM TAY, không phép đo máy nào chấm.** Đúng như ba mốc
2.9.0, 2.10.0 và 2.11.0 đã khai. Lượt chấm 2 của hồ sơ này thử làm khác và hỏng theo ba
cách đo được, nên eval ấy đã bị GỠ:

1. Nó ghim **hình dạng diff của chính PR** vào hồ sơ sắp ký: ô «số commit» đếm tới HEAD,
   nên commit chữ ký Cổng 2 và commit ghim-lại-sau-chữ-ký — hai commit BẮT BUỘC theo
   thiết kế — đều làm nó đỏ. Đo được: nó đã đỏ tại HEAD của chính lượt sửa, «máy đo 131,
   hợp đồng nêu 130». Không có HEAD nào nó xanh được lúc ký.
2. Ô «số vòng» fail-open: khuôn `(NĂM|<n>)` nhận chữ, nên số máy đo không bao giờ được
   dùng tới. Đo được: máy đo 3, 5 hay 9 đều khớp.
3. Ô «lượt chấm» quét TOÀN VĂN hợp đồng bằng `\b<n>\b`; đo được: mọi chữ số 1..9 đều có
   mặt ở đâu đó trong 280 dòng.

Điểm 1 là ca thứ NĂM của lớp «bất biến không được nằm trong hồ sơ đã ký», và ghi chú của
lớp ấy gọi đích danh «hình dạng diff của chính PR». Phép thử của nó — *«mệnh đề còn đúng
sau 50 commit không?»* — trả lời KHÔNG ngay từ commit kế tiếp.

**Bảng giá trị tới kho tiêu thụ (182 tiêu chí) không có eval.** Script sinh ra nó đã gỡ
khỏi hồ sơ: nó duyệt `~/dev` để đếm hợp đồng của tám sản phẩm khác, tức product context
của repo tiêu thụ nằm trong engine. Phép thử của hiến pháp: *thứ gì vô nghĩa với một
công ty khác dùng kit thì không thuộc kit* — một script đọc `~/dev` của owner trả lời
đúng như vậy. Số 182 đo một lần trên máy owner ngày 13/09, và nó lệch ngay khi bất kỳ
kho nào trong tám kho thêm một hợp đồng.

**Bài học lượt chấm 3, ghi để không lặp.** 14 trên 14 phát hiện của lượt ấy nằm trong
BỘ MÁY hồ sơ này tự dựng, và 0 nằm ở vật được giao — ba con số phiên bản xanh từ lượt 1.
Owner chọn lối TRỪ HẾT: gỡ `phan-lop-ha-tang.cjs` (7 phát hiện; nó thuộc ô
`thuoc-khong-lat-verdict` ngả 5, không thuộc mốc) và `do-ba-dong-so.cjs` (mồ côi sau khi
eval của nó bị bỏ). Một mốc THUẦN CẮT SỐ không nuôi dàn đo riêng; ba mốc trước đều không.

**Bài học lượt chấm 4 — lối 1 chưa xong ở lớp LỜI.** Lượt 4 trả 19 phát hiện: **19 trên
19 vẫn nằm trong bộ máy hồ sơ này, 0 ở vật được giao** — ba con số phiên bản xanh từ lượt
1 và xanh cả ở lượt 4. Nhưng hình dạng đã đổi: lượt 3 là các SCRIPT tự dựng, lượt 4 là
các LỜI KHAI mà nhát trừ của lượt 3 để lại sau lưng. Bảy phát hiện là câu khai trỏ vào
vật đã gỡ (`E3f` trong `expected` của E3c · ba ô `fixed` của `gap-probe.md` · vế «E4a
canh nên số commit không trôi nữa») hoặc khai quá điều chuỗi đo chứng minh (E1 hứa GIÁ
TRỊ `2.12.0` mà chuỗi chỉ kiểm QUAN HỆ; hai eval tuyên một LỚP lối hỏng mà chỉ chạy
điểm-case). Chín phát hiện là khiếm khuyết THẬT trong hai răng còn lại, mỗi cái có chiều
đỏ chạy được: một fail-open im lặng ở chân 4 của `rang-moc.sh` (phát hiện in-contract
DUY NHẤT — bản chưa vá suy mốc phát hành «trước» ra chính commit của cửa sổ đang đo), một
`shift 2` làm script TREO VÔ HẠN thay vì thoát 2, và một lối thoát KHÔNG BAO GIỜ tới được
trong `rang-p200.sh` khiến hạ tầng vỡ bị khai là «P200 đỏ».

Rút ra, ghi để không lặp: **một nhát TRỪ chưa xong khi vật đã gỡ mà câu khai về nó còn
đứng.** Câu khai còn lại nguy hơn script đã gỡ, vì nó là thứ người soát lại dùng để
quyết «không cần đọc vật» — và ba trong số đó hiển thị trên THẺ CỔNG mà owner đọc ở Cổng
Bằng chứng, tức ba P0 trông như đã đóng trong khi hai đã quay về trạng thái chỉ-khai-giới-
hạn. Nghi thức cho nhát trừ kế: sau khi gỡ một vật, `grep` tên nó trong TRỌN hồ sơ và
đối chiếu từng ô `fixed` với `decisions.jsonl`, đừng tin câu đã viết.

**Vế GIÁ TRỊ của AC-1 và AC-2 là điều-chỉ-người-biết, không phải giới hạn chưa vá.**
Owner quyết ở lượt chấm 5; căn cứ và hệ quả viết ngay trong AC-1 và AC-2, không nhắc lại
ở đây. Hệ quả cho chiến dịch ghim lại: hồ sơ này xanh ở mọi HEAD tương lai.

**Ngưỡng đang đếm cho cả hai:** ≥1 mốc nữa mà ba dòng số bị phát hiện SAI sau khi ký.
Khi đó lối vá đúng tầng không phải một eval trong hồ sơ mốc, mà là lệnh `signoff` ghi số
ấy vào hồ sơ ngay lúc ký — xem §4.

## Notes

Bốn khối bắt buộc của AC-4 nằm dưới đây.

### 1. Ba dòng số của luật (c) — MÁY TÍNH, người đếm tay một ô

Bảng dưới đây ĐẾM TAY, xem Known limits. Nó từng được sinh bằng một script trong hồ sơ;
script ấy đã GỠ ở lượt chấm 3 vì sau khi eval của nó bị bỏ, nó thành tệp mồ côi — đúng
hình dạng P0 mà phản biện context sạch của chính vòng này vừa chấm cho một tệp khác.
Sửa một ca rồi mở lại đúng ca ấy cho tệp bên cạnh là «sửa một ca thay vì quét theo LỚP»,
lớp tái phát mà §3 dưới đây tự ghi.

| Vòng | Lượt chấm | làm-xong→quyết-được | Gọi người (cận dưới) | Gọi người (đếm tay) |
|---|---:|---|---:|---:|
| `ma-so-quyet-dinh-duy-nhat` | 2 | 0h30 | 1 | — |
| `ghim-lai-tren-lop-cu` | 1 | 9h50 | 5 | — |
| `cua-veto-sau-chu-ky` | 6 | 10h02 | 19 | — |
| `lan-doc-status-not-run` | 2 | 1h49 | 1 | — |
| `cong-nguoi-doc-du-nguon` | 8 | 14h11 | 12 | 14 |

**Nguồn rút từng ô, không ô nào dựng phép đo mới:** danh sách vòng ← commit Cổng 2 trong
`45e5f1d8..HEAD` · lượt chấm ← `max(round)` trong `run-log.jsonl` · làm-xong→quyết-được
← dòng `round` ĐẦU của run-log → thời điểm commit Cổng 2 · gọi người ← đếm entry mang
dấu người trong `decisions.jsonl` (`seal` · `escalate` · có `decided_by`).

**Cột «cận dưới» là CẬN DƯỚI, khai rõ ở đây.** Một lượt gọi người sinh nhiều entry — ở
`cong-nguoi-doc-du-nguon` một chữ «Ký» sinh 8 entry định đoạt — và một lượt «Tiếp tục»
không sinh entry nào. Số THẬT chỉ đếm tay được từ phiên đã chạy vòng đó, và trong năm
vòng chỉ `cong-nguoi-doc-du-nguon` chạy trong phiên này: **14 lượt, 2 trong thiết kế và
12 ngoài**, so trần T3 là 4. Bốn ô còn lại để trống thay vì bịa, và cột cận-dưới tồn tại
để chúng không phải là ô trống trơn.

**Tổng cửa sổ:** 19 lượt chấm trên 5 vòng (trung bình 3,8 so trần 3); tổng
làm-xong→quyết-được 36h22.

**Hạ tầng đốt lượt: 5, mỗi lượt có tên.** Vòng `cong-nguoi-doc-du-nguon` lượt 5 — tệp ca
là tệp MỚI nên cây gốc trả `MODULE_NOT_FOUND`, tác tử ghi thành «đỏ = có phân biệt» cho
cả bảy phép đo. Lượt 8 — đầu ra suite plugins khớp khuôn `permissions-allow-deny` nên bị
hạ tầng trung hoà, tác tử trả đỏ trong khi cùng chuỗi lệnh chạy tại chỗ thoát 0. Và
**lượt 1 của CHÍNH hồ sơ mốc này** — cùng lớp ấy lần thứ ba, phân lớp bằng máy
(`phan-lop-ha-tang.cjs`, hai lần chạy lại đều xanh) và ghi vào `run-log.jsonl` dưới
`kind: infra-recheck`. Và **lượt 4 của hồ sơ mốc này — lần thứ TƯ**, lần đầu tiên cơ chế
được định danh thay vì gọi là «flaky»: E3c đỏ với `FAIL: P93` trong fan-out, còn tại chỗ
cùng SHA `3db8403b` thì xanh hai lần (trọn suite, và riêng khối P93). P93 quét toàn CÂY
LÀM VIỆC bằng `rglob` với mẫu bắt-tất-cả rồi đếm cặp marker toàn kho, chỉ loại `{plugins,_acceptance,
tests}` và `{.git,.claude,node_modules}` — nên bất kỳ tệp nháp không-được-theo-dõi nào
chứa một cặp marker đều làm nó đỏ, mà một lượt chấm là 37 tác tử cùng ghi trong một
worktree. Chiều đỏ chạy thật: cây nguyên vẹn XANH → tiêm một tệp tạm chứa cặp
`HFL-LAW-TABLE` vào `docs/` → `FAIL: P93` kèm «cap marker HFL-LAW-TABLE co 3 khoi (mong
doi 2)» → xoá tệp → XANH lại. Lượt này phân lớp bằng PHÉP ĐO (chạy lại tại chỗ, đối
chứng dương) chứ không bằng lý lẽ, vì bộ phân lớp đã gỡ theo lối 1. Và **lượt 5 — lần
thứ NĂM**, cùng chữ ký `FAIL: P93`, cùng SHA `f5ac8ff0` xanh tại chỗ (run-log `kind:
infra-recheck` round 5).

### 2. Lớp vendored — bốn trên chín mục ĐỔI trong cửa sổ

Đo bằng `git diff --numstat 45e5f1d8..HEAD -- <tệp>` (neo ĐÚNG, sửa sau lượt chấm 1):

| Mục của `INIT-CI-COPY-LIST` | +/− |
|---|---|
| `lib/ac-line.cjs` | +93 −6 |
| `lib/evidence-core.cjs` | +156 −4 |
| `lib/md-section.cjs` | +68 −1 |
| `scripts/pre-merge-check.sh` | +96 −2 |
| `lib/eval-yaml.cjs` · `lib/gap-probe.cjs` · `lib/lop-nhin-thay.cjs` · `lib/workspace-record.cjs` · `scripts/recheck-evidence.cjs` | không đổi |

**Ghi chú phát hành phải nói:** kho tiêu thụ chép lại BỐN mục trên. Danh sách chín mục
KHÔNG có mục mới.

*Giới hạn đã khai:* câu «chín mục» là khẳng định về một danh sách MÁY GIỮ (marker
`INIT-CI-COPY-LIST` trong `commands/acceptance-init.md`), nhưng hồ sơ này không có eval
nào đối chiếu bảng trên với marker ấy. Cửa sổ sau thêm mục thứ mười thì bảng này vẫn 9
dòng và không ai thấy. Ô mở, xem §4.

### 3. Lớp lỗi TÁI PHÁT trong cửa sổ

- **Hạ tầng tự sinh tín hiệu đỏ** — 2 lượt ở `cong-nguoi-doc-du-nguon`; mốc 2.11.0 ghi
  5, mốc 2.10.0 ghi 5; cộng **3 lượt của chính hồ sơ mốc này** (lượt 1 · 4 · 5).
  **BỐN cửa sổ liên tiếp.** Ô `thuoc-khong-lat-verdict` ngả 5 (phân lớp sau khi đỏ) và
  ngả 7 (không đỏ giả nữa — nhát cắt §4) đi đóng lớp này. Đóng góp của cửa sổ này: lớp
  giờ có MỘT cơ chế được định danh và một nhát cắt một-dòng — trước đó nó chỉ được ghi
  là «tác tử khai đỏ trong khi tại chỗ xanh».
- **DỪNG-VÁ nổ rồi lượt sửa lại đẻ lỗi cùng lớp** — 3 lần liên tiếp ở
  `cong-nguoi-doc-du-nguon` (lượt 3→4, 4→5, 6→7). Cả ba đều là NỚI một bộ đọc; hai bản
  vá cuối là HỢP NHẤT luật về một nguồn và không đẻ hồi quy.
- **Sửa một ca thay vì quét theo LỚP** — lượt 7 áp luật tiêu đề cho một trong ba nhánh
  của cùng một hàm; lượt 8 bắt đúng nhánh còn lại. Hiến pháp đã ghi luật này từ 26/07.
- **Bộ đọc nhân bản** — vòng này đóng ba bên gọi nhưng phát hiện thêm bên thứ TƯ
  (`pre-merge-check.sh`, bán kính 2 hồ sơ) và thứ NĂM (`carry-plan.mjs`, bán kính 9).
  Cả hai đã có ô, chưa đóng.

### 4. Nhát cắt cho cửa sổ kế — gọi tên

**Nhát cắt đề xuất: gỡ nhánh lật verdict theo ý kiến tác tử** (`acceptance-verify.js`
dòng 1042). Đó là dòng làm lượt 7 của `cong-nguoi-doc-du-nguon` đỏ trong khi mọi phép đo
xanh, và là chỗ máy định nghĩa lại «tốt» sau khi owner đã chốt ở Cổng Phạm vi. Phép trừ,
một dòng. Ô `thuoc-khong-lat-verdict` ngả 1.

**Nhát cắt thứ hai, lộ ra ở lượt chấm 4 và có chiều đỏ chạy thật: cho `scan()` của P93
đi theo tệp GIT THEO DÕI thay vì `rglob` với mẫu bắt-tất-cả** (`tests/plugins/run-tests.sh`, hàm
`scan`, ~dòng 2068). Đây là nhát cắt rẻ nhất cho lớp «hạ tầng tự sinh tín hiệu đỏ» đã
đếm BỐN cửa sổ liên tiếp: phép đo hiện đo kiểm kê tệp của cây làm việc, trong khi vật
được giao là cây NGUỒN — đúng dạng «thước phải gắn vào vật được giao». Một tệp nháp của
bất kỳ tác tử nào trong fan-out 37 tác tử đủ làm nó đỏ. KHÔNG làm trong mốc này vì nó
chạm chính vật mà E3a–E3e đang đo; vào ô `thuoc-khong-lat-verdict` **ngả 7** (ghi
14/09 — ngả 5 của ô là phân-lớp-sau-khi-đỏ, khác bản chất).

**Nhát cắt thứ ba, lộ ra lúc dựng thẻ Cổng Bằng chứng (14/09): thẻ KHÔNG render
việc-người mà hợp đồng tuyên.** AC-1 và AC-2 (sửa ở lượt chấm 5 theo quyết định owner)
nói vế GIÁ TRỊ `2.12.0` · `2.7.0` là điều owner «xác nhận MỘT dòng trên thẻ ở Cổng Bằng
chứng». Thẻ dựng ra không có ô nào cho dòng ấy: khối «Việc chỉ mình bạn quyết được» chỉ
có mục xác nhận phạm vi cắt/hoãn, còn `GATE-ONESHOT-GRAMMAR` chỉ có chỗ trống cho
`Ngoài-<số>`, `<mã eval>`, `cắt/hoãn`, `Treo`, `ký hay trả`. Hệ quả: một mục
chỉ-người-biết do chính hợp đồng khai bị rơi khỏi bề mặt người đọc — máy phải nêu bằng
chữ ngoài thẻ, tức đúng lớp «lời khai đứng thay cho vật» ở tầng thẻ. Đường vá: cho
renderer rút các vế «owner xác nhận …» từ hợp đồng thành ô một-chạm trên thẻ (một nguồn:
hợp đồng), thay vì để chúng chỉ sống trong văn AC. Vào ô `thuoc-khong-lat-verdict`.

**Hai ô mới lộ ra ở lượt chấm 1 của chính mốc này**, cả hai thuộc lớp «lời khai không có
vật», ghi ở đây thay vì mở vòng:

- Bảng chín mục vendored trong hồ sơ mốc là khẳng định về một danh sách MÁY GIỮ (marker
  `INIT-CI-COPY-LIST`) mà không eval nào đối chiếu. Đường vá: eval round-trip rút tập mục
  từ marker và so BẰNG TẬP với các dòng bảng; đồng thời nâng `consumer-esm.test.mjs` từ
  `>= 7` lên bằng đúng số mục rút được từ marker.
- Số lượt gọi người chỉ đếm tay được từ phiên đã chạy vòng, nên bốn trong năm vòng của
  cửa sổ này không có số. Đường vá rẻ nhất: lệnh `signoff` ghi số ấy vào hồ sơ ngay lúc
  ký, khi phiên còn biết.

### 5. CÂU HỎI CHO NGƯỜI — luật thu hồi vế «có thể CỘNG»

Luật NỚI 2026-09-07 có điều kiện thu hồi: *«lượt gọi người/vòng vượt trần ở hai mốc
phát hành liên tiếp»*. Số đang có:

| Mốc | Lượt gọi người ghi trong hồ sơ mốc | Trần |
|---|---|---|
| 2.11.0 | 7 trong thiết kế + 1 ngoài = **8** | mốc ≤1 |
| 2.12.0 (vòng trong cửa sổ) | `cong-nguoi-doc-du-nguon` **14** | vòng T3 ≤4 |

Sổ tay ghi 2.11.0 là lần trượt trần ≤1 **thứ ba liên tiếp**. Máy KHÔNG tự tuyên thu
hồi: đó là quyết định chính sách, và hệ quả của nó là **27 ô đang mở phải khai lại căn
cứ**. Người đọc số rồi quyết. Ba lối: thu hồi · giữ nguyên · giữ nguyên kèm một ngưỡng
mới do người đặt.
