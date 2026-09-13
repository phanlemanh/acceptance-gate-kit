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
  vòng đời); `docs/lai-thu-nguoi-la.md` lạc ở gốc `docs/`.
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

## Thiết kế

### 1. Router — một file, người đọc được, máy đọc được

`docs/MAP.md` (giữ tên theo tiền lệ đang sống). Phần người: như artifact-platform
(«cần gì → đọc đâu» · tầng theo nhịp thay đổi · bản đồ thư mục). Phần máy — MỘT
khối, cùng khuôn marker của `lib/md-section.cjs` (*bảng LÀ nguồn runtime; chép
xuống hằng số là single-source giả*):

```
<<<DOC-HOMES
lớp-vật        | vòng-đời   | nhà                                          | chủ
ý-định         | theo-vòng  | _acceptance/<slug>/opportunity.md            | kit
ý-định         | thường-trú | docs/intent/ROADMAP.md · docs/intent/seeds/  | repo
đặc-tả         | theo-vòng  | docs/superpowers/specs/                      | repo
đặc-tả         | thường-trú | docs/spec/                                   | repo
kế-hoạch       | theo-vòng  | docs/superpowers/plans/                      | repo
bằng-chứng     | theo-vòng  | _acceptance/<slug>/                          | kit
bằng-chứng     | thường-trú | PRODUCT-MAP.md                               | máy-sinh
luật-máy       | thường-trú | CLAUDE.md · .claude/skills/                  | repo
tài-liệu-người | thường-trú | docs/reference/ · docs/guides/               | repo
DOC-HOMES>>>
```

- `lớp-vật` ∈ 6 giá trị đóng; `vòng-đời` ∈ {theo-vòng, thường-trú}; `nhà` =
  một hoặc nhiều đường dẫn tương đối phân cách «·» **trên cùng một dòng** = một
  nhà lô-gic (nhiều dòng cho cùng cặp = hai nhà = vi phạm); `chủ` ∈ {kit, repo,
  máy-sinh}. Hàng `chủ: kit` khai cả nhà kit sở hữu — để phép kiểm 2 tính được
  «ngoài lời khai», và để ai đọc playbook (`intent/` ở gốc) mở repo vẫn tìm thấy
  vai `intent.md` nằm ở đâu trong kit.
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

### 3. Bộ đọc — writer và reader cùng rút một marker

`lib/doc-homes.cjs`: `parseDocHomes(mdText) → [{lop, vongDoi, nha[], chu}]`,
ném lỗi có tên khi thiếu cột hoặc giá trị ngoài tập đóng. Khuôn khối sống MỘT
chỗ: `skills/acceptance/references/doc-homes-template.md` giữa marker
`DOC-HOMES-TEMPLATE`; `acceptance-init` (bước 3c) và test round-trip đều rút từ
đó — mẫu `OOC-ITEM-TEMPLATE` + case P55.

### 4. Hai phép kiểm, hai màu có chủ ý

`scripts/doc-homes-check.mjs --root <repo>`:

- **K1 — «không lớp nào hai nhà»**: một cặp (lớp-vật × vòng-đời) xuất hiện >1
  hàng → **ĐỎ**, exit 1, thông điệp ghim:
  `DOC-HOMES: lớp «đặc-tả» vòng-đời «theo-vòng» khai 2 nhà: docs/specs/ · docs/superpowers/specs/`.
  Đỏ là công bằng: đây là tự-mâu-thuẫn trong lời khai của chính repo.
- **K2 — «không nhà nào ngoài lời khai»**: quét `*.md` ở gốc repo + `docs/**`
  (loại `node_modules`, `.git`, `.claude/worktrees`, `_acceptance/`,
  `.out-of-scope/`, và mọi nhà đã khai); file không rơi vào nhà nào → **VÀNG**,
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

Cùng lượt gạch-một-lần đã có: sinh `docs/MAP.md` từ khuôn với cây mặc định dưới
đây + khoá `docs.router`. Đã có `docs/MAP.md` → không đụng, chỉ nhắc dán khối.

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

Kit viết `docs/MAP.md` của chính nó. Phép kiểm **phải đỏ trên kit** ở đúng chỗ
đã biết trước khi được tin: K1 đỏ vì `docs/specs/` và `docs/superpowers/specs/`
cùng cặp (đặc-tả, theo-vòng); K2 vàng nêu `docs/lai-thu-nguoi-la.md` + 16 plan
cũ trong `docs/plans/`. Dọn xong (dời file, không xoá) → xanh. Vật thật đang sẵn
hỏng nên khỏi phải phá — nhưng vẫn phải có cặp ca hai chiều trên fixture (mục
Chiều đỏ), vì kit sạch rồi thì đối chứng này biến mất.

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
| R8 | chạy trên **cây kit thật** trước khi dọn | K1 đỏ đúng cặp `docs/specs · docs/superpowers/specs`; K2 nêu `docs/lai-thu-nguoi-la.md` |

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
