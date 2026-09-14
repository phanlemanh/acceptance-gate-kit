# Nhà tài liệu khai một chỗ — router `docs/MAP.md` cho hai tầng vật — thiết kế

2026-09-13 · slug `nha-tai-lieu-router` · hạng: máy xếp ở S0 theo `risk_tiers`
(dự kiến **T3** vì chạm `scripts/pre-merge-check.sh` + `scripts/start-scan.mjs`;
T2 nếu tách bước CI ra lượt sau) · trạng thái: `discovery`, **vòng thi công chờ
sau mốc 2.12** (owner quyết 13/09).

Nguồn chữ của thiết kế này là bản đồ
[`docs/findings/2026-09-13-ban-do-vung-lam-viec-hai-tang.md`](../../findings/2026-09-13-ban-do-vung-lam-viec-hai-tang.md);
spec chỉ giữ số cần cho quyết định và cơ chế. Hình tầng 2:
`docs/plans/assets/2026-09-13-ban-do-vung-lam-viec/03-router-hai-loi-vao.svg`.

## Vấn đề, đo được

Mỗi lớp vật của một repo tồn tại ở **hai vòng đời** — *theo-một-vòng* (sinh cho
một slug) và *thường-trú* (sống suốt đời repo). Kit lo nhà cho vòng đời thứ
nhất; vòng đời thứ hai không ai sở hữu. Số đo 13/09 trên 5 repo tiêu thụ + kit:

- **5 repo, 5 hình dạng tầng thường-trú** khác nhau (artifact-platform: `docs/spec/`
  + router `docs/MAP.md` · media-library: `docs/seed/` + `reference/` · crm-onehub:
  13 file phẳng ở gốc `docs/` + `docs/plan/` + `adrs/` · floorplanstudio: soi gương
  kit · mapposter: không gì cả, kể cả `CLAUDE.md`).
- crm-onehub có **`docs/crm-plan.md` (1368 dòng) và `docs/plan/crm-plan.md` (555
  dòng)** — cùng tên, hai chỗ, khác nội dung. `AGENTS.md` và `CLAUDE.md` khác
  nhau, không symlink, ở 2/5 repo.
- Tầng theo-vòng do **chính engine tuyên hai nhà**: `contract.md` trong hồ sơ,
  design doc ở `docs/superpowers/specs/` ([SKILL.md:117](../../../feature-loop/skills/feature-loop/SKILL.md:117)
  kèm chữ *«hoặc convention spec của repo»* không ai kiểm), plan ở
  `docs/superpowers/plans/` ([:164](../../../feature-loop/skills/feature-loop/SKILL.md:164)).
- Giá của việc không có nhà khai: phiên start OneFlow 05/09 mất **4 lượt đọc
  file** mới tìm ra hàng kế (hạt giống 06/09 §1).
- Chính kho kit: `docs/specs` 12 file cũ vs `docs/superpowers/specs` 67 (trôi quy
  ước); `docs/plans` 27 hạt giống thường-trú **trộn** 16 plan-theo-vòng cũ (trộn
  vòng đời); `docs/lai-thu-nguoi-la.md` lạc ở gốc `docs/` (tình trạng trước 13/09 — đã dọn, xem cuối §8).
- Đường đọc-cũ phải gánh: **630+ file** đang sống ở `docs/superpowers/` của 5
  repo — cấm ép migrate.

## Vì sao không «kit tuyên cây», cũng không «kit chỉ đọc»

- **Kit tuyên một cây thư mục chuẩn + răng** → 5 repo là 5 lần migrate, và đụng
  thẳng bất biến «kit là engine — không chứa product context».
- **Kit chỉ đọc, không kiểm** → hai `crm-plan.md` vẫn sống vì không gì bắt nó
  đỏ; và cho tầng theo-vòng thì lựa chọn này không tồn tại — kit *đang* tuyên
  rồi, chỉ tuyên hai nhà.
- Còn lại: **repo khai, máy kiểm lời khai** — đúng khuôn ổ cắm `ds_skill`
  (khoá config trỏ file + luật vắng-thì-gì) và đúng dạng nghiệm của khung 30/08
  (*biến bất biến từ đầu-người sang vật-máy-giữ*). artifact-platform đã tự dựng
  chính cơ chế này bằng tay (`docs/MAP.md`: *«mỗi sự thật sống ở đúng một nơi,
  nơi khác chỉ link»*, 5 tầng + luật phân xử); thiếu đúng phần máy đọc được.

Owner chốt 13/09: **một cơ chế, hai lối vào** — repo cũ tự khai; repo mới được
`acceptance-init` dựng bản mặc định, *cũng qua router*.

**Sửa 13/09 (chiều), sau khảo sát OneFlow và khung quyết định
[`2026-09-13-khung-quyet-dinh-kien-truc-hai-tang.md`](../../findings/2026-09-13-khung-quyet-dinh-kien-truc-hai-tang.md):**
owner chốt hướng **repo khai, kit kiểm**; spec tách rạch ròi **tầng ENGINE**
(kit sở hữu, đóng: ba nhà cố định + ba khoá bind) và **tầng REPO** (repo sở
hữu, mở). Cụ thể: khối bốn cột → **ba cột** (bỏ `chủ`); tập `lớp-vật` đóng →
**mở**, chỉ ba cặp engine bind là đóng; thêm header `phiên-bản` · `quét:`; `nhà`
nhận `#fragment`; `acceptance-init` ghi **bản khai**, không tạo thư mục; khoá
`docs.router` **thay** `plan.block` của hạt giống 06/09. Phép thử giả định #1 đã
chạy tay trên 7 repo ([P0](../../findings/2026-09-13-loi-khai-viet-tay-6-repo.md)):
7/7 khai được bằng ba cột. Kế hoạch theo kết quả:
[`2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md`](../../plans/2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md).
Hình trước/sau: `docs/plans/assets/2026-09-13-ban-do-vung-lam-viec/05-truoc-sau-router.svg`.

## Thiết kế

### 1. Router — một file, người đọc được, máy đọc được

`docs/MAP.md` (giữ tên theo tiền lệ đang sống). Phần người: như artifact-platform
(«cần gì → đọc đâu» · tầng theo nhịp thay đổi · bản đồ thư mục). Phần máy — MỘT
khối, cùng khuôn marker của `lib/md-section.cjs` (*bảng LÀ nguồn runtime; chép
xuống hằng số là single-source giả*):

```
<!-- <<<DOC-HOMES -->
phiên-bản: 1 · quét: docs/ · *.md
lớp-vật        | vòng-đời   | nhà
đặc-tả         | theo-vòng  | docs/superpowers/specs/
kế-hoạch       | theo-vòng  | docs/superpowers/plans/
ý-định         | thường-trú | docs/roadmap.md#plan-freeze · docs/strategy/vision.md
trạng-thái     | thường-trú | STATUS.md
luật-máy       | thường-trú | CLAUDE.md · .claude/skills/
tài-liệu-người | thường-trú | docs/reference/ · docs/guides/
<!-- DOC-HOMES>>> -->
```

- **Ba cột, không có cột `chủ`.** Mọi hàng là vật repo sở hữu. Vật kit sở hữu
  (`_acceptance/<slug>/` · `PRODUCT-MAP.md` · `.out-of-scope/`) là hằng
  `FIXED_HOMES` trong engine (mục 3) — **không đi qua lời khai**, vì engine đã
  hardcode chúng; khai lại là hai nguồn cho một sự thật. Thẻ start in chúng dưới
  nhãn «nhà kit» để ai đọc playbook vẫn thấy `intent.md` ↔ `opportunity.md`.
- **`lớp-vật` là tập MỞ.** Engine chỉ hiểu — và bind — đúng **ba cặp** đóng:
  `(đặc-tả, theo-vòng)` · `(kế-hoạch, theo-vòng)` · `(ý-định, thường-trú)`. Hàng
  ngoài ba cặp đó (P0 đếm được 12 tên tự mọc: `sổ-cái`, `trạng-thái`,
  `thiết-kế-nền`, `từ-điển`…) chỉ chịu K1/K2. `vòng-đời` ∈ {theo-vòng, thường-trú}.
- `nhà` = một hoặc nhiều đường dẫn tương đối phân cách «·» **trên cùng một
  dòng** = một nhà lô-gic; nhiều **dòng** cho cùng cặp = hai nhà = K1 đỏ. Đường
  dẫn nhận hậu tố `#fragment` để trỏ một khối trong file — ở vòng này router
  **chỉ giao con trỏ**, không đọc nội dung khối (đó là P3, hạt giống 06/09).
- **Header** một dòng `khoá: giá trị · …` (mẫu OneFlow): `phiên-bản` (đường
  đọc-cũ khi engine đổi khoá) và `quét:` — vùng K2 nhìn; vắng → mặc định
  `docs/ · *.md`. Không có `quét:` thì `adrs/` ở gốc crm-onehub vô hình cả hai chiều.
- **Giới hạn có tên (P0 #1):** K1 bắt hai *dòng*, không phân xử hai *file* cùng
  vai khai chung một dòng (`CLAUDE.md · AGENTS.md` khác nội dung ở 2/7 repo).
  Không thêm K3. Khuôn template gợi ý câu OneFlow đang dùng: *«CLAUDE.md là
  nguồn duy nhất; file này chỉ thêm ghi chú»* — luật của repo, không của kit.
- Marker `<!-- <<<DOC-HOMES -->` … `<!-- DOC-HOMES>>> -->` — tiền lệ đang sống
  trong `commands/start.md`; HTML comment nên không hiện khi render.
- Vì sao khối trong markdown chứ không file YAML riêng: một file cả người lẫn
  máy đọc là single-source thật; hai file là hai nguồn phải giữ đồng bộ — lớp
  lỗi kit chống suốt (ADR 0001/0008).

### 2. Ổ cắm

`docs.router: docs/MAP.md` trong `_acceptance/config.yaml`, ghi bằng
`scripts/config-patch.mjs` (splice một khoá, từ chối ghi đè). Luật vắng-thì-gì,
theo đúng chiều đỏ đã khai ở hạt giống 06/09 §5:

| Trạng thái khoá | Thẻ start | Bước CI |
|---|---|---|
| vắng | không in gì | không chạy |
| có, file/khối không tồn tại | cờ vàng **có tên** («router khai `docs/MAP.md` nhưng không có khối DOC-HOMES») | NOTE, không chặn |
| có, khối đọc được | một dòng số (mục 5) | chạy hai phép kiểm |

Repo không khai là trạng thái **hợp lệ vĩnh viễn** — đường đọc-cũ, không cờ.

Khoá này **thay** `plan.block` của hạt giống 06/09: câu «ý định thường-trú ở
đâu» chỉ có một chỗ trả lời là hàng `(ý-định, thường-trú)`; bộ đọc khối của
hạt giống đó (P3) bind vào hàng này, không thêm khoá config thứ hai.

### 3. Bộ đọc — writer và reader cùng rút một marker

`lib/doc-homes.cjs` xuất bốn thứ:

- `FIXED_HOMES` — ba nhà engine tuyên, hằng: `_acceptance/<slug>/` ·
  `PRODUCT-MAP.md` · `.out-of-scope/`.
- `ENGINE_KEYS` — ba cặp engine bind, đóng, kèm fallback = đường hôm nay.
- `parseDocHomes(mdText) → {header: {phienBan, quet[]}, rows: [{lop, vongDoi,
  nha[], fragment?}]}` — ném lỗi có tên khi thiếu cột, `vòng-đời` ngoài tập, hoặc
  header thiếu `phiên-bản`; **không** ném khi `lớp-vật` lạ (tập mở).
- `homeFor(rows, lop, vongDoi, fallback)`.

Ngưỡng đếm cho chính hợp đồng engine (giả định #5 trong ô): nếu vòng sau cần
**khoá bind thứ tư**, engine đang bò sang tầng repo — dừng và hỏi. Khuôn khối sống MỘT
chỗ: `skills/acceptance/references/doc-homes-template.md` giữa marker
`DOC-HOMES-TEMPLATE`; `acceptance-init` (bước 3c) và test round-trip đều rút từ
đó — mẫu `OOC-ITEM-TEMPLATE` + case P55.

### 4. Hai phép kiểm, hai màu có chủ ý

`scripts/doc-homes-check.mjs --root <repo>`:

- **K1 — «không lớp nào hai nhà»**: một cặp (lớp-vật × vòng-đời) xuất hiện >1
  hàng — **kể cả lớp repo tự đặt tên** — → **ĐỎ**, exit 1, thông điệp ghim:
  `DOC-HOMES: lớp «đặc-tả» vòng-đời «theo-vòng» khai 2 nhà: docs/specs/ · docs/superpowers/specs/`.
  Đỏ là công bằng: đây là tự-mâu-thuẫn trong lời khai của chính repo.
- **K2 — «không nhà nào ngoài lời khai»**: quét theo header `quét:` (mặc định
  `docs/ · *.md`; loại `node_modules`, `.git`, `.claude/worktrees`, mọi
  `FIXED_HOMES`, và mọi nhà đã khai); file không rơi vào nhà nào → **VÀNG**,
  exit 0 + NOTE, liệt tên:
  `DOC-HOMES: 14 file ngoài lời khai — docs/crm-plan.md · docs/list-building-roadmap.md · …`.
  **Không bao giờ đỏ** — 630+ file đang sống; vàng là cách duy nhất đúng luật
  đường đọc-cũ. Muốn siết thì là luật của repo, không phải mặc định của kit.

### 5. Hai chỗ chạy

- **CI:** một bước trong `scripts/pre-merge-check.sh`, ngay sau bước
  `product-map --check`, khai trong sổ luật-đã-chạy như mọi bước khác
  (`ledger_mark`). Đi cùng bộ file CI `acceptance-init` chép sang repo: 8 →
  **10** file (`lib/doc-homes.cjs` + `scripts/doc-homes-check.mjs`), cùng luật
  «chép thiếu file thì pre-merge tự nói».
- **Thẻ start:** `scripts/start-scan.mjs` thêm khối `docHomes: {present, rows,
  k1, k2}` cạnh `map: {present, fresh}` đã có, và thẻ in **một dòng**:
  `nhà tài liệu: 9 lớp khai · 0 hai-nhà · 14 file lạc`. Số đo mục tiêu là cái
  đo ở OneFlow 05/09 (4 lượt đọc) → 0.

### 6. feature-loop đọc nhà từ router (tầng theo-vòng)

SKILL.md:117 và :164 đổi thành: *design doc → nhà khai ở router cho (đặc-tả,
theo-vòng); plan → nhà khai cho (kế-hoạch, theo-vòng); vắng router → mặc định
hôm nay (`docs/superpowers/specs/`, `docs/superpowers/plans/`)*. Bỏ chữ «hoặc
convention spec của repo» — **router LÀ convention**. Một hàm giải đường trong
`lib/doc-homes.cjs` (`homeFor(rows, lop, vongDoi, fallback)`), feature-loop gọi
nó, không tự đọc khối.

### 7. Lối vào repo mới — `acceptance-init` bước 3c, không lệnh thứ bảy

Cùng lượt gạch-một-lần đã có: sinh `docs/MAP.md` từ khuôn với **bản khai mặc
định** (khối `DOC-HOMES` khai các nhà trong cây gợi ý dưới đây) + khoá
`docs.router`. **Không tạo thư mục nào** — thư mục trống không tồn tại trong git,
và tạo cây là engine quyết cấu trúc repo, thứ bất biến «kit là engine» cấm; khai
trước, thư mục mọc khi repo có file đầu tiên. Đã có `docs/MAP.md` → không đụng,
chỉ nhắc dán khối. Cây dưới đây là *gợi ý cho bản khai*, không phải lệnh mkdir:

```
CLAUDE.md             ≤ 1 trang (playbook 337–340) · luật-máy thường-trú
.claude/skills/       (playbook 403) · .claude/agents/ chỉ khi có (478)
CONTEXT.md            glossary (quy ước kit)
PRODUCT-MAP.md        máy sinh — đừng sửa tay
_acceptance/          kit — MỌI vật theo-vòng của cổng
docs/MAP.md           router
docs/intent/          ROADMAP.md (LOCKED, đổi qua PR có review — mẫu artifact-platform)
                      + seeds/ (hạt giống nấc 1 — mẫu media-library docs/seed/)
docs/spec/            đặc tả thường-trú: PRD · kiến trúc · schema (T0 «hiến pháp»)
docs/reference/       Diátaxis reference: design-system · deploy · runbooks
docs/guides/          Diátaxis how-to
docs/superpowers/     theo-vòng: specs/ + plans/ (nhà kit đang tuyên)
docs/archive/         bất biến sau khi viết
.out-of-scope/        bác kèm lý do — hôm nay 0/5 repo có
```

Hai quyết định trong cây, nêu lý do để owner gạch nếu muốn:

- **Không tạo `intent/` ở gốc như playbook.** Vai của nó ở kit đã là
  `_acceptance/<slug>/opportunity.md`; tạo thêm là dựng «kho ý định thứ hai» mà
  hạt giống 07/09 cấm. Router ghi ánh xạ đó ở hàng `ý-định | theo-vòng`.
- **Không dời design doc vào hồ sơ** dù về lý gọn hơn — 630+ file đang ở
  `docs/superpowers/`; router làm cái split *tường minh và kiểm được*, migrate là
  việc từng repo tự chọn sau (đổi một dòng trong khối là xong).

### 8. Kit tự khai trước ai — đối chứng dương trên vật thật

Kit viết `docs/MAP.md` của chính nó — bản viết tay đã có ở P0 §1. Phép kiểm
**phải đỏ trên kit** ở đúng chỗ đã biết trước khi được tin: K1 đỏ **hai** cặp —
`docs/specs/ · docs/superpowers/specs/` cho (đặc-tả, theo-vòng) và
`docs/plans/ · docs/superpowers/plans/` cho (kế-hoạch, theo-vòng), cặp thứ hai
chính là «trộn vòng đời» (16 plan cũ nằm trong nhà của 27 hạt giống); K2 vàng
nêu `docs/lai-thu-nguoi-la.md` · `docs/tools/` · `docs/diagrams/`. Dọn = dời, và
dời `docs/specs/workflow-v2-spec.md` phải sửa dòng trỏ ở
`skills/acceptance/references/human-facing-language.md:3` (P0 #3). Dọn xong (dời file, không xoá) → xanh. Vật thật đang sẵn
hỏng nên khỏi phải phá — nhưng vẫn phải có cặp ca hai chiều trên fixture (mục
Chiều đỏ), vì kit sạch rồi thì đối chứng này biến mất.

**Dọn nhà đã làm 13/09, TRƯỚC vòng** (`workflow-v2-spec.md` + overview ở lại
`docs/specs/` như đặc-tả thường-trú; 10 design doc + 16 plan + `lai-thu` dời).
Vì thế R8 **không còn chạy được trên cây thật**: thay bằng ca trên bản chép cây
kit tại commit `8a703c36` lấy trọn thư mục (`git archive 8a703c36 docs`), đúng
luật base-trọn-thư-mục (P150). Kit sau dọn là **đối chứng dương** (K1 = 0, K2
còn `docs/tools/` · `docs/diagrams/` chưa khai nhà); bản chép trước dọn là
**chiều đỏ** (K1 = 2 cặp). Hai ca, cùng bộ đọc.

### 9. Từ điển

`CONTEXT.md` thêm: **Nhà tài liệu (doc home)** — nơi một lớp vật ở một vòng đời
sống, khai trong router; *_Avoid_: folder convention, chuẩn thư mục*. **Bản đồ
tài liệu (MAP)** — router do người khai; ≠ **Bản đồ sản phẩm** (máy sinh từ hồ
sơ). Hai chữ «bản đồ» cùng gốc `PRODUCT-MAP.md`/`docs/MAP.md` là chỗ dễ lẫn —
mục từ điển là răng chữ cho nó.

## Chiều đỏ — khai trước (khoản khai-sinh phép đo)

Fixture **do code dựng** trong thư mục tạm, theo khuôn `dungKhoTam` + `muiTiem`
của `tests/scripts/lan-status-not-run.test.mjs` (ca không có mũi tiêm phải có lý
do trong `MIEN_MUI_TIEM`; ca meta đỏ nếu để rỗng):

| Ca | Dựng | Đợi |
|---|---|---|
| R0 xanh | config có khoá + MAP sạch 9 hàng | K1 0 · K2 0 · exit 0 |
| R1 | tiêm hàng thứ hai cho (đặc-tả, theo-vòng) | K1 đỏ, **đúng thông điệp** mục 4, exit 1 |
| R2 | thả `docs/la.md` | K2 vàng, **nêu đúng tên** `docs/la.md`, exit 0 |
| R3 | khoá vắng | không in gì, exit 0 (vắng ≠ hỏng) |
| R4 | khoá trỏ file không tồn tại | cờ vàng có tên, exit 0, không chặn |
| R5 round-trip | khối viết bằng writer khuôn `DOC-HOMES-TEMPLATE` | reader đọc ra đúng 9 hàng, đúng giá trị |
| R6 | thẻ start với/không khoá | có dòng «nhà tài liệu: …» / không có dòng |
| R7 | router khai (đặc-tả, theo-vòng) = `docs/design/` · vắng router | `homeFor` trả `docs/design/` · trả `docs/superpowers/specs/` |
| R8 | chạy trên **cây kit thật** trước khi dọn | K1 đỏ đúng **hai** cặp (`docs/specs · docs/superpowers/specs` · `docs/plans · docs/superpowers/plans`); K2 nêu `docs/lai-thu-nguoi-la.md` — **chạy trên bản chép `git archive 8a703c36 docs`**, vì cây thật đã dọn 13/09 |
| R9 | hàng có `lớp-vật` lạ (`sổ-cái`) | reader nhận, không lỗi; hai hàng `sổ-cái` cùng vòng-đời → K1 đỏ như lớp thường |
| R10 | `nhà` = `docs/roadmap.md#plan-freeze` | reader tách `fragment`; `homeFor` trả đường file; **không** đọc nội dung khối |
| R11 | header `quét: docs/ · *.md · adrs/` + thả `adrs/la.md` | K2 nêu `adrs/la.md`; bỏ `adrs/` khỏi header → không nêu |
| R12 | không khai gì cho `_acceptance/` `PRODUCT-MAP.md` `.out-of-scope/` | K2 **không** nêu chúng (FIXED_HOMES) |
| R13 | xoá khoá `docs.router` sau khi đã có dòng thẻ | dòng thẻ biến mất, `homeFor` về fallback — đảo rẻ đo được |

Mọi đường dẫn trong test suy từ vị trí script (luật P150), bản base cho ca
so-sánh lấy trọn thư mục.

## Ranh giới

- Kit **không ghi/sửa** file nào trong `docs/` của repo tiêu thụ — trừ lối vào
  repo mới, một lần, ở `acceptance-init`, và chỉ khi chưa có `docs/MAP.md`.
- Không thêm lệnh cổng người (sáu thao tác là danh sách đóng, ADR 0002).
- Không migrate 5 repo. artifact-platform chỉ cần dán khối vào MAP có sẵn;
  crm-onehub khi khai sẽ phải **chọn một** `crm-plan.md` — quyết định người, phép
  kiểm chỉ làm nó lộ ra.
- Không đụng `PRODUCT-MAP.md` (máy sinh, ADR 0007) — router chỉ liệt nó ở hàng
  (bằng-chứng, thường-trú, máy-sinh).
- Không kit-hoá trạng thái/tiến độ (`STATUS.md` kiểu artifact-platform) — đó là
  ô `viec-ke-theo-plan` (06/09): tiến độ là hiệu số máy in, không phải tài liệu.
- Không sửa `CLAUDE.md` 193 dòng của kit trong vòng này; ghi là điểm-kit-biết.
- Kit **không `mkdir`** trong repo tiêu thụ — kể cả ở lối vào repo mới.
- Răng tầng repo (freeze, drift, sổ cái kiểu OneFlow) **ở lại repo**; kit không
  nuốt, không chép.
- Nối dòng dõi `iterate` **không thuộc router** — nghiệm ở hàng roadmap
  (`kiểm: opportunity:<slug>`, OneFlow A1) hoặc khoá trong contract, quyết ở P3.
- Vật chặng 6 xuyên slug (11 file lái-thử ở gốc `_acceptance/` mapposter) nằm
  trong `FIXED_HOMES`, K2 không thấy — ngoài router, ghi sang hạt giống lát C.

## ADR đi kèm

**ADR 0017 — «Engine bind vào nhà repo khai; engine không sở hữu đường dẫn nào
trong `docs/`».** Đủ ba điều kiện: khó đảo (7 repo khai theo), bất ngờ (kit
*thôi* hardcode `docs/superpowers/`), đánh-đổi thật (tự do khai ↔ đồng nhất).
Viết ở S1 của vòng P1+P2, không viết trước.

## Trace hiến pháp + luật nới 07/09

- **Nguyên tố 2 (bằng chứng không tự dối):** «một vật một nguồn» hôm nay là lời
  dặn trong `MAP.md` và `CLAUDE.md`; router biến nó thành **vật-máy-giữ**.
  Người hưởng: **máy** (phiên start hết mò — số 4 lượt về 0) và engineer repo
  tiêu thụ (không còn hai `crm-plan.md`, không còn `AGENTS.md` ≠ `CLAUDE.md`
  mà không ai biết).
- **Nguyên tố 1:** ý định thường-trú có nhà khai → có chỗ để «chốt trước».
- **0 lượt gọi người thêm**, không cổng mới, không chạm khó-đảo (khai được thì
  gỡ được: xoá khoá là về hôm nay). Đề xuất này là **CỘNG** → đi dưới luật nới
  07/09; hồ sơ phải ghi rõ điều đó, và điều kiện thu hồi của luật nới áp lên nó.

## Ngưỡng (chép sang ô cơ hội khi mở)

- **SỐNG:** thẻ start ở crm-onehub trả lời «ý định thường-trú ở đâu» với **0
  lượt đọc thêm** (đối chứng: 4 lượt, OneFlow 05/09) · kit CI đỏ đúng 3 chỗ đã
  biết rồi xanh sau khi dọn · ≥1 repo cũ tự khai router trong 30 ngày sau phát
  hành · 0 lượt gọi người thêm so với hôm nay.
- **CHẾT:** kit ghi/sửa bất kỳ file nào trong `docs/` của repo ngoài lối vào
  repo mới · K2 chặn merge ở bất kỳ repo nào · cần lệnh cổng mới · vòng sửa thứ
  hai cùng lớp «hai bộ đọc trôi khỏi nhau» (writer/reader không cùng marker).
- **Timebox:** [đề xuất] 3 ngày làm việc (bốn chỗ cắm: lib mới · check mới · một
  bước CI · một dòng thẻ + hai dòng SKILL).

## Vì sao chờ 2.12

Meta-work. Cửa sổ 2.11→2.12 đã tiêu hai vòng meta (`cua-veto-sau-chu-ky`,
`lan-doc-status-not-run`); luật chiều rộng (b) cho tối đa một, chỉ khi owner
gọi tên. Owner chọn 13/09: viết bản đồ + spec + ô, **vòng thi công mở sau mốc
2.12** — hoặc sớm hơn nếu owner gọi tên và chấp nhận vượt (b) có chủ ý, ghi vào
hồ sơ phát hành kế.

## Trạng thái

Spec viết 13/09, chưa có plan, chưa có hợp đồng. Ô cơ hội:
`_acceptance/nha-tai-lieu-router/opportunity.md` (`stage: discovery`).
