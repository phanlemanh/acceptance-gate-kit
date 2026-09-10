---
schema_version: 1
feature: Phát hành kit 2.11.0 — đóng số cho cửa sổ 2.10→2.11 và VÁ TRONG MỐC lỗ xanh-giả của bộ giải cấu hình (nháy không cân làm hỏng chuỗi lệnh, bash trả 2, luật expected_exit đọc 2 thành giới hạn đã khai)
slug: release-2-11-0
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/evidence-core.cjs (t3_paths). Làn V là T2-only nên hồ sơ này LUÔN cần approved_by — cùng đường 2.10.0 đã đi
surfaces: [cli]
status: implemented
design_doc: docs/superpowers/specs/2026-09-10-release-2-11-0-design.md
approved_by: Manh Phan
approved_at: 2026-09-10T14:37:16Z
---

# Acceptance Contract: release-2-11-0

## Context

Cửa sổ `04069351` (mốc 2.10.0) → `d1d36479`: **31 commit, MỘT vòng** —
`eval-khai-ma-thoat-mong-doi` (PR #165), vòng T3 thêm trường `expected_exit` cho eval
máy. Đó là cửa sổ mỏng nhất từ 2.5.0, và cũng là vòng rẻ nhất đo được (xem ba dòng số).

Nhưng chính răng vừa ship ở vòng đó phơi ra một lỗ **đã tái phát ba mốc liên tiếp**.
`resolveConfigKey` trong `lib/evidence-core.cjs` bóc một ký tự nháy ở đầu và một ở cuối
**vô điều kiện**. Chuỗi bốn bước, đo trên `main` `d1d36479` ngày 10/09 trước khi chạm
dòng nào:

1. `pytest -q -k 'a or b'` → bộ giải trả `pytest -q -k 'a or b` (mất dấu đóng).
2. `bash -c` chuỗi đó → **thoát 2**, vỡ cú pháp trước khi công cụ chạy.
3. `EXPECTED_EXIT_BANNED = [97, 127]` — **2 không bị cấm**, `errs` rỗng.
4. Hồ sơ khai `expected_exit: 2` → lệnh hỏng được đọc là «giới hạn đã khai» = **PASS**.

Không bước nào đoán. Hồ sơ mốc 2.10.0 đã tự khai lớp này là tái phát hai mốc liên tiếp,
chọn Known limits, rồi gọi tên nó làm **ứng viên nhát cắt thứ hai** của cửa sổ này:
«biến `resolve-config-go-escape` thành RĂNG chứ không phải lời dặn — nó là lớp duy nhất
tái phát qua hai mốc liên tiếp». Owner gọi tên tối 10/09 («đồng ý lối 1»): vá NGAY
trong hồ sơ mốc, đúng tiền lệ mốc 2.10.0 đã mở cho lỗ fail-open làn V. Vá đó chạm
`lib/**` nên hồ sơ mốc lên **T3**.

**KHÔNG vá bằng cách cấm mã 2.** Nhiều công cụ dùng 2 làm mã lỗi thật; cấm nó giết lời
khai trung thực. Vá đúng chỗ là bộ giải.

## Criteria

### AC-1 (bộ giải) — bóc nháy chỉ khi nháy CÂN và đúng một cặp vỏ

**Given** một giá trị scalar trong `_acceptance/config.yaml`
**When** `resolveConfigKey` giải khoá đó
**Then** vỏ nháy bị bóc **chỉ khi** cả chuỗi là một cặp vỏ hợp lệ theo YAML; mọi hình
dạng khác trả về **nguyên văn** — đặc biệt chuỗi chỉ TÌNH CỜ kết thúc (hoặc bắt đầu)
bằng nháy phải giữ đủ ký tự đó.

### AC-2 (bộ giải) — escape trong vỏ nháy kép được gỡ

**Given** một scalar bọc nháy kép có `\"` hoặc `\\` bên trong
**When** bộ giải trả giá trị
**Then** `\"` thành `"` và `\\` thành `\` — chuỗi giao cho `bash -c` mang đúng argv người
viết định giao, không mang thêm dấu chéo ngược.

### AC-3 (nối lớp) — chuỗi xanh-giả bốn bước đã ĐÓNG

**Given** một hồ sơ khai `expected_exit: 2` cho một eval máy mà lệnh của nó chứa nháy
nội dòng
**When** làn chấm chạy lệnh ấy
**Then** lệnh chạy THẬT (không vỡ cú pháp), và mã thoát đem so là mã của **công cụ**,
không phải mã 2 của shell — tức một PASS ở đây chỉ có thể đến từ công cụ thật sự trả 2.

### AC-4 (theo LỚP) — một bộ bóc nháy dùng chung trên mọi đường giá-trị-bị-thi-hành

**Given** kho ở HEAD của hồ sơ này
**When** cho giá trị thật đi qua từng đường đọc trong **danh sách đóng** dưới đây
**Then** mọi đường đó trả chuỗi đúng như người viết nó, và cùng gọi **một** hàm
`unquoteScalar`:

| # | Đường đọc | Giá trị nó mang |
|---|---|---|
| 1 | `resolveConfigKey` lá | chuỗi lệnh |
| 2 | `resolveConfigList` nhánh inline `[a, b]` | tên khoá chấm |
| 3 | `resolveConfigList` nhánh khối `- item` | tên khoá chấm |
| 4 | `s4-args` list field inline | `paths` · `inputs` · `steps` · `evidence_required` |
| 5 | `s4-args` list field khối | như trên |
| 6 | `s4-args` id của eval | id |
| 7 | `s4-args` `models` | tên model |

**Và** tập hàm **CỐ Ý GIỮ** mệnh đề cũ là một danh sách đóng **năm** tên trong
`lib/evidence-core.cjs` — `extractRunIds` · `extractEvalBlockRunIds` · `walkEvalExits` ·
`extractVerifierValues` · `isAuthenticVerifier`. Chúng nằm CÙNG tệp với đường 1–3 nên
phạm vi phải tính theo **HÀM**, không theo TỆP. Bốn tên đầu đọc id và tên người. Tên thứ
năm có lý do cứng riêng: biểu thức bắt đường dẫn `(\S+\.(py|mjs|js|sh))\b` **hút cả nháy
MỞ** vào chuỗi (`"./verify.sh`), nên chuỗi nó cầm KHÔNG cân — bóc-theo-cặp sẽ để nguyên
dấu nháy và làm mất đường tìm tệp. Đây là ca duy nhất mà bóc vô điều kiện là ĐÚNG.

Phép đếm: khớp `replace(/^["\']+?|["\']+?$/g` trong `lib/evidence-core.cjs` phải **BẰNG
5**, và trong `feature-loop/scripts/s4-args.mjs` phải **BẰNG 0** — vá sót thì lớn hơn, vá
lan thì nhỏ hơn, cả hai đỏ ghim tên hàm.

**Tiền lệ trong chính tệp này:** `frontmatterField` ĐÃ học đúng bài học ấy ở S4-r5 và tự
vá — «Chỉ bóc nháy khi CẢ CẶP khớp. Bóc đầu và cuối độc lập thì một giá trị không-quote
mà KẾT THÚC bằng nháy sẽ mất ký tự cuối». Nó nằm cách `resolveConfigKey` chưa tới trăm
dòng. Kit đã giải lớp này MỘT LẦN rồi không lan sang bộ đọc kế bên — đó là bằng chứng
đậm nhất của mục «lớp lỗi TÁI PHÁT» dưới đây, và là lý do bản vá lần này đi bằng MỘT hàm
dùng chung thay vì lại sửa một chỗ.

### AC-5 (chiều đỏ) — tiêm lại mệnh đề cũ vào bản sao TRỌN CÂY làm phép đo ĐỎ đích danh

**Given** một bản sao trọn cây dựng bằng `git archive HEAD`
**When** tiêm lại mệnh đề cũ vào bản sao và chạy chính bộ ca của AC-1/AC-2/AC-3
**Then** bản NGUYÊN VẸN xanh (đối chứng dương) · bản bị tiêm **đỏ, ghim đúng thông
điệp** · và bước tiêm tự chứng minh nó đổi được nội dung bằng **so BĂM trước/sau** —
băm không đổi thì chiều đỏ vô nghĩa và phép đo phải tự tố cáo.

### AC-6 (cắt số) — 2.11.0 nhất quán ở mọi bề mặt người dùng đọc

**Given** kho ở HEAD của hồ sơ này
**When** đọc hai manifest plugin và `GUIDE.md`
**Then** `acceptance-gate` và `feature-loop` cùng mang `2.11.0`; câu «Khớp phiên bản»
trong GUIDE **dẫn xuất** từ manifest; mô tả `acceptance-gate` có mục `v2.11.0` nói người
dùng nhận gì; mục `v2.11.0` của `feature-loop` **tự khai cặp** `acceptance-gate >= 2.11.0`
bên trong chính mục đó.

### AC-7 (cắt số) — `diagram-design` giữ 2.7.0, có bằng chứng đo được KHÔNG fail-open

**Given** cửa sổ `04069351..HEAD`
**When** đo diff của thư mục `diagram-design/`
**Then** diff RỖNG **và phép đo tự chứng minh nó đã chạy**: sha nền phải giải được
(`git rev-parse --verify`), và **đối chứng dương** cùng cửa sổ — `git diff --name-only
04069351..HEAD -- lib/` phải KHÁC rỗng. Ba chân này tách nhau bằng ba mã thoát riêng, nên
«rỗng vì không đổi» không lẫn được với «rỗng vì git chết / clone nông / sai thư mục».

### AC-8 (không hồi quy) — bốn suite và bản đồ sản phẩm XANH

**Given** bản vá và lần cắt số đã áp
**When** chạy `feature_loop.suite_keys`
**Then** bốn suite (`scripts` · `hooks` · `plugins` · `workflows`) và
`scripts/product-map.mjs --check` đều exit 0.

### AC-9 (hồ sơ mốc) — bốn khối bắt buộc, có nguồn rút cho từng số

**Given** hồ sơ mốc này
**When** đọc section `## Notes` của **chính `contract.md` này** (bốn khối sống ở đó, không
ở tệp khác)
**Then** có đủ: **ba dòng số** của luật (c) · **bảng lớp vendored** 9 mục · **lớp lỗi tái
phát** · **nhát cắt kế** gọi tên. Mỗi số phải nói được **nguồn rút** (revision của
contract qua `git show <sha>:<contract>` · `run-log.jsonl` · `git diff --numstat`).

**Mốc cắt đếm, khai trước để số không phải ước lượng:** lượt gọi người của CHÍNH mốc này
đếm tới **lời mời Cổng Bằng chứng** — lượt ký là lượt cuối cùng đã biết trước, nên đếm
được trước khi nó xảy ra. Thời gian *làm-xong→quyết-được* của mốc là số DUY NHẤT chỉ biết
sau chữ ký: nó **không** nằm trong AC này (xem Known limits) và được ghim lại ở làn re-pin
sau khi ký, không sửa hồ sơ đã ký.

## Coverage

Quét bằng `morphological-scan`, preset test-matrix. Chân sản phẩm:
`[SUY-TỪ-REPO: CLAUDE.md]` (kit là engine, người hưởng là repo tiêu thụ và chính vòng lặp
của kit). Chân ngành: `[NGÀNH: YAML 1.2 spec §7.3 — flow scalar styles]`, đối chiếu
`js-yaml`; đúng hai kiểu scalar có nháy (single/double) cộng plain scalar là bảng ME/CE
của trục B.

- **Trục A — vị trí đọc:** `resolveConfigKey` lá | `resolveConfigList` inline |
  `resolveConfigList` khối | `s4-args.mjs` ×4 | bộ đọc token (runId · exit · verifier ·
  frontmatter · expected_exit).
  [thước CE: `grep '\^\["'\''\]'` toàn kho — 30 hit — phân loại theo *giá trị đọc ra có bị
  THI HÀNH không*; danh sách bên gọi rút bằng `grep 'resolveConfigKey('`]
- **Trục B — hình dạng giá trị:** không nháy | vỏ đơn cân | vỏ kép cân | vỏ kép có
  escape | **kết thúc bằng nháy, không phải vỏ** | **bắt đầu bằng nháy, không phải vỏ** |
  nháy hai đầu nhưng KHÔNG phải một cặp | suy biến (rỗng · `""` · một ký tự `"`).
  [thước CE: YAML 1.2 §7.3.1/7.3.2 — `[NGÀNH]`]
- **Trục D — bề mặt của mốc:** số ở hai manifest | câu dẫn xuất GUIDE | mục mô tả của
  chính số đó | `diagram-design` giữ số | ba dòng số | bảng lớp vendored.
  [thước CE: ca vĩnh viễn P200 đã liệt bốn bề mặt đầu; hai bề mặt cuối là khuôn hồ sơ
  mốc 2.9.0/2.10.0]
- **Lớp cross-cutting áp mọi ô Core:** mỗi phép đo mới đi kèm **cặp hai chiều trên cùng
  fixture** + **thông điệp ghim** (MEASURE-BIRTH-CLAUSE).

**Core** = A1×B(1–8) · A2/A3 một cặp dương-âm · A4 (`steps` là chỉ thị cho agent, đang
bị xén thật ở crm và artifact-platform) · D toàn trục. → AC-1…AC-9.

**Never — A5 (bộ đọc token):** `extractRunIds` · `walkEvalExits` · `extractVerifierValues`
· `frontmatterField` · `expected_exit` đọc id, số nguyên, tên người. Nháy lệch ở đó không
tạo chuỗi bị thi hành nên không phải đường xanh-giả; mở rộng sang đó là đổi hành vi năm bộ
đọc đang có răng riêng mà không trace về nguyên tố nào. Ranh giới có chủ ý, ghi tại đây để
lần sau khỏi bàn lại.

## Out of scope

- **Rollout tới 7 repo tiêu thụ** (mỗi repo một PR, chủ repo gộp) — mốc chỉ cắt số ở kho kit.
- **Phiên nghiệm thu gộp 10 hồ sơ chờ Cổng Giá trị** — nhát cắt số một của 2.10.0, vẫn treo.
- **Sửa eval đỏ sẵn ở oneflow/crm** và hai PR nháp `phanlemanh/OneFlow#116`,
  `phanlemanh/crm#35` — vòng này KHÔNG chạm chúng.
- **Un-double nháy đơn** (`'it''s'` → `it's` theo YAML) và **cấm mã 2** — xem Known limits.
- **Lỗ `id` bọc nháy, tìm ra khi đo, KHÔNG sửa ở đây:** `parseEvals` (`lib/eval-yaml.cjs`)
  giữ nguyên nháy trên `id` trong khi vòng list-field của `s4-args` bóc chúng, nên một eval
  khai `id: "E2"` bị bỏ qua LẶNG mọi `paths`/`steps`/`inputs` rồi chết bằng thông điệp nói
  sai nguyên nhân. Nó nằm ở tầng KHÁC (bên đọc evals.yaml, không phải bên bóc nháy), và sửa
  nó là đổi hành vi `parseEvals` cho mọi caller — đúng loại việc phải có hợp đồng riêng.
  Đường 6 của ma trận AC-4 vì thế là **lưới hồi quy**, không phải ca phân biệt: bản vá cố ý
  KHÔNG đổi hành vi ở đó.

## Notes

### Bán kính đo được ở repo tiêu thụ (10/09, trước khi vá)

Đo bằng bộ giải THẬT trên cây thật: mọi khoá lá của `config.yaml` đi qua
`resolveConfigKey`, cộng `steps`/`paths`/`inputs` của mọi `evals.yaml` đi qua mệnh đề list
của `s4-args`. Chỉ đếm chỗ bản cũ và bản mới trả KHÁC nhau.

| Repo | chỗ khác | hình dạng |
|---|---|---|
| oneflow | **19** | toàn bộ `executors.test.sdk_pytest*` — vỏ kép có `\"…\"` bên trong, escape không được gỡ |
| artifact-platform | **5** | 1 khoá `executors.script.uicheck_avatar_pool` (mất dấu `'` đóng → `bash -c` thoát 2) · 2 `inputs` judgment bị xén đuôi `"` → **s4-args báo input không tồn tại** · 2 `steps` |
| crm | **4** | `steps` của `tieng-viet-cho-crm` — chỉ thị `<html lang=\"vi\">` giao cho agent kèm dấu chéo ngược thừa |
| map · policy-graph-hub · floorplanstudio · media-library · **kit** | **0** | — |

**Tổng 28 chỗ trên 7 repo tiêu thụ.** Hai điều đáng ghi: (a) chuỗi xanh-giả **không phải
giả thuyết** — `artifact-platform` đang mang một khoá config sinh đúng nó hôm nay; (b)
`kit` là 0, nên bản vá không đổi hành vi của bất kỳ hồ sơ nào trong chính kho này — đúng
chỗ để đo bằng chiều đỏ chứ không bằng «suite vẫn xanh».

### Hệ quả cho rollout

Sau khi 2.11.0 ship, bản vá này **trùm lên** vá local của oneflow ở
`lib/evidence-core.cjs` — oneflow hết fork ở tệp đó, và 19 chỗ trên hết cần vá tay.

### Ba dòng số của luật (c) — ĐẾM TAY

Đếm tay theo đúng chữ luật (c). **KHÔNG dùng `scripts/loop-health.mjs`**: nó suy mốc cổng
bằng `git log -S`, tức khớp CHỮ ở bất kỳ đâu trong thân hợp đồng, nên ra thời lượng ÂM
trên chính kho này. Cách đếm ở đây: đọc `status:` trong FRONTMATTER của TỪNG revision
(`git show <sha>:<contract>`), lấy revision đầu sang `implemented` và revision đầu sang
`signed-off`; số lượt chấm đọc từ `run-log.jsonl` (`round`), không đọc văn xuôi.

| Vòng | làm-xong → quyết-được | lượt chấm | lượt gọi người (thiết kế / ngoài) | bị hạ tầng đốt |
|---|---|---|---|---|
| `eval-khai-ma-thoat-mong-doi` (#165) | **184′ (3h04)** | **1** | **4 / 0** | **0** |
| hồ sơ mốc `release-2-11-0` | điền ở làn ghim lại | điền ở làn ghim lại | **3 / 0** | điền ở làn ghim lại |

- **Dòng 1 — làm-xong→quyết-được: 184′ trên vòng duy nhất của cửa sổ.** `implemented` ở
  `8f6a6bac` (10/09 14:58:38 +07) → `signed-off` ở `befa12ee` (18:02:32 +07). So mốc
  trước: trung bình bốn vòng của cửa sổ 2.10.0 là **417′**, vòng chậm nhất 547′. Vòng này
  **nhanh hơn 2,3 lần trung bình** và là vòng rẻ nhất đo được từ khi kit đếm số. Một lượt
  chấm duy nhất, PASS ngay — so 6 lượt của vòng T3 gom ở mốc trước.
- **Dòng 2 — lượt gọi người.** Vòng #165: **4 trong thiết kế, 0 ngoài** — đúng trần T3.
  Hồ sơ mốc này: **3 trong thiết kế, 0 ngoài** (Cổng Phạm vi · Gate 1.5 · Cổng Bằng
  chứng), đếm tới **lời mời Cổng Bằng chứng** như AC-9 khai trước. **Chạm/lượt = 1** ở cả
  ba: owner gõ đúng một dòng máy soạn sẵn.
- **Dòng 2b — mốc phát hành TRƯỢT trần ≤1, lần thứ BA liên tiếp** (2.9.0 = 2 · 2.10.0 = 2
  · 2.11.0 = 3). Nhưng lần này nguyên nhân KHÁC hai lần trước và đo được: hồ sơ mốc hạng
  **T3** có **ba cổng người theo thiết kế**, nên ≤1 là một mục tiêu **không đạt được về
  mặt cấu trúc** — không phải một lần vận hành kém. Ba lần trượt với ba nguyên nhân khác
  nhau chính là dữ liệu mà ĐIỀU KIỆN THU HỒI của luật nới 07/09 đọc; nó dẫn thẳng tới nhát
  cắt gọi tên dưới đây, nên số này KHÔNG bị giấu.
- **Dòng 3 — vòng bị hạ tầng kit đốt: 0/1 ở vòng #165.** Không lượt chấm nào của cửa sổ bị
  hạ tầng giết — lần đầu tiên kể từ 2.8.0. Số của chính hồ sơ mốc điền ở làn ghim lại.

### Lớp vendored — repo tiêu thụ PHẢI chép lại

Đo bằng `git diff --numstat 04069351..HEAD` trên chín mục của `INIT-CI-COPY-LIST`:

| Mục | +/− | Vì sao consumer phải chép |
|---|---|---|
| `lib/evidence-core.cjs` | **+258 / −16** | mang `unquoteScalar` — thiếu nó thì `s4-args` của feature-loop 2.11.0 fail-CLOSED có tên |
| `lib/eval-yaml.cjs` | **+48 / −1** | luật `expected_exit` từ vòng #165 |
| `scripts/pre-merge-check.sh` | +1 / −1 | truyền thêm một đối số cho làn ghim lại |
| `scripts/recheck-evidence.cjs` | +1 / −1 | như trên |
| `lib/gap-probe.cjs` · `lib/workspace-record.cjs` · `lib/ac-line.cjs` · `lib/md-section.cjs` · `lib/lop-nhin-thay.cjs` | 0 | không đổi trong cửa sổ |

**Hệ quả cho rollout:** bản vá này **trùm lên** vá local của oneflow ở
`lib/evidence-core.cjs` — sau khi chép lại, oneflow hết fork ở tệp đó và 19 chỗ giải sai
của nó hết cần vá tay. Hai PR nháp đang mở (`phanlemanh/OneFlow#116`,
`phanlemanh/crm#35`) KHÔNG bị vòng này chạm.

### Lớp lỗi TÁI PHÁT — căn cứ cho nhát cắt kế

1. **Bóc nháy vô điều kiện — ba mốc liên tiếp, NAY ĐÃ VÁ.** Bằng chứng đậm nhất không
   phải số lần tái phát mà là chỗ nó tái phát: `frontmatterField` nằm trong **cùng tệp**,
   cách `resolveConfigKey` chưa tới trăm dòng, và **đã tự vá đúng lớp này ở S4-r5** với
   chú thích nêu chính xác cơ chế («Bóc đầu và cuối độc lập thì một giá trị không-quote mà
   KẾT THÚC bằng nháy sẽ mất ký tự cuối»). Kit giải lớp MỘT LẦN rồi không lan sang bộ đọc
   kế bên. Đó là lý do lần này đi bằng **một hàm dùng chung có phép đếm hai chiều canh
   ranh giới**, không phải lại sửa một chỗ.
2. **Danh sách chép CI không theo kịp thứ script thật sự cần** — đã ghi hai lần trong
   `docs/research/so-vap-trien-khai.md`. Mốc này lại có **4/9 mục đổi**, và vẫn KHÔNG có
   răng nào ở kho tiêu thụ bắt được «đã nâng plugin mà chưa chép lại lớp CI». Lỗ vẫn mở.
3. **Ba dòng số là VĂN** — mốc thứ ba liên tiếp khai cùng Known limit. Chưa đủ nặng để
   dựng phép đo (luật giới hạn CHIỀU RỘNG: lưới thường trực là trần), nhưng đã đủ để gọi
   tên: xem nhát cắt.
4. **Một lỗ MỚI tìm ra khi đo, ngoài hợp đồng:** `parseEvals` (`lib/eval-yaml.cjs`) giữ
   nguyên nháy trên `id`, trong khi vòng list-field của `s4-args` bóc chúng — nên một eval
   có `id: "E2"` bị bỏ qua LẶNG mọi list-field (`paths` · `steps` · `inputs`) rồi chết
   bằng một thông điệp nói sai nguyên nhân. Ghi ở Out of scope; không sửa trong vòng này.

### Nhát cắt cho cửa sổ kế (luật (c) đòi gọi tên)

**Nhát cắt SỐ MỘT, có căn cứ số ngay trong hồ sơ này: hồ sơ mốc phát hành đừng mang bản
vá code.** Ba mốc liên tiếp trượt trần ≤1 lượt gọi người, và lần này lý do đo được là
**cấu trúc**: mốc mang bản vá chạm `lib/**` → hạng **T3** → **ba cổng người theo thiết
kế** (Phạm vi · Gate 1.5 · Bằng chứng), nên ≤1 không đạt được dù vận hành hoàn hảo. Hai
lối, owner chọn:

- **(a) Tách:** bản vá đi vòng riêng, hồ sơ mốc quay về **T2 thuần cắt số** → đủ điều
  kiện **làn V** → **≤1 lượt** (tiền lệ 2.5.0). Giá: thêm một vòng, và mất đúng cái lợi mà
  tiền lệ «vá trong mốc» của 2.10.0 mở ra — vá đi thẳng tới tay người dùng cùng mốc.
- **(b) Sửa luật:** trần của mốc phát hành đọc theo cùng nguyên tắc đã dùng cho T3 —
  «**= số cổng thiết kế**», tức ≤1 cho mốc T2 và ≤3 cho mốc T3. Giá: một con số mục tiêu
  bớt sắc; đổi lại nó thôi đo một điều không đạt được.

Khuyến nghị **(b)**: nguyên tắc «= số cổng thiết kế» chính là cách owner đã đọc trần T3 ở
dòng ký mốc 2.7.0; áp nó cho mốc phát hành là nhất quán, không phải nới.

**Nhát cắt số hai, CHUYỂN TIẾP nguyên văn từ 2.10.0 (vẫn treo):** một phiên nghiệm thu
**GỘP** cho 10 hồ sơ đang chờ Cổng Giá trị. Số lấy bằng máy:
`node scripts/start-scan.mjs --root .` → `groups.gates` với `gate=gia-tri`.

### Known limits

- **AC-9 là VĂN, không phép đo máy nào chấm.** Cùng giới hạn mốc 2.9.0 và 2.10.0 đã khai.
  Bảng lớp vendored *có thể* máy giữ (số ra từ `git diff --numstat`), nhưng dựng một script
  cho một bảng bốn dòng là thước to hơn vật — không mở trong mốc này.
- **Nháy đơn nhân đôi không được un-double.** `'it''s fine'` trả `it''s fine`, YAML nói
  `it's fine`. Cố ý giữ: un-double là một phép biến đổi nữa trên chuỗi sắp thi hành, và
  chưa có một ca thật nào trong 8 kho đo được. Ngày có ca thật → mở ô.
- **Nháy hai đầu mà không phải một cặp** (`"a" && echo "b"`) nay giữ NGUYÊN VĂN. Đó là
  YAML sai; bộ giải chọn không đoán thay người viết. Bản đã chạy ở oneflow xẻ nó thành
  `a" && echo "b`; hai bản chỉ khác đúng ở đây, và trên mọi đầu vào oneflow thật sự chạy
  chúng cho cùng kết quả.
- **Bộ đọc token (A5) không đổi** — xem mục Never của Coverage.
- **Vòng round-trip của AC-3 dừng ở `s4-args`, không chạy trọn workflow chấm.** Ca lấy
  chuỗi lệnh từ đầu ra THẬT của `s4-args.mjs` (bên VIẾT) rồi chạy nó, và so bằng chính
  `expectedExits` (bên ĐỌC) — nhưng phép so verdict cuối sống trong `acceptance-verify.js`
  và chỉ chạy được cùng bầy agent. Phần chưa phủ: một lớp bóc nháy THỨ HAI nếu ai đó thêm
  nó vào chính workflow. Suite `workflows` (E8d) là lưới hiện có cho tệp đó.
- **Thời gian làm-xong→quyết-được của CHÍNH mốc này** chỉ biết sau chữ ký, nên nó nằm
  ngoài AC-9 và được điền ở làn ghim lại sau khi ký — không phải một ô số hình thức, và
  không phải một lần chạm hồ sơ đã ký.
