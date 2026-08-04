# judgment-question-guard — fail-loud cho field eval mà prompt fan-out phụ thuộc

Ngày: 2026-08-04 · slug `judgment-question-guard` · T3 (khai bởi owner) · D0

## Bối cảnh — lỗ đo được, không phải lỗ suy diễn

S4 của feature `motion-floor` (T2) phơi ra: eval `executor: judgment` thiếu
field `question` thì `acceptance-verify.js:346` nối chuỗi thẳng

    Cau hoi phan xet (${e.id} / ${e.criterion}): ${e.question}

→ hội đồng nhận literal `"undefined"` làm câu hỏi phân xử. Không validation,
không cảnh báo. Round 1-2, E1 và E6 đi qua đường này 6 lượt; round 2 panel E6
trả **PASS 3/3** và verdict PASS đó vào `evidence-report.md`. Một tiêu chí được
tuyên ĐẠT mà chưa ai từng đặt câu hỏi.

**Tier là bộ khuếch đại.** Routing verdict ở `:655` cho judgment item về người
chỉ khi `riskTier === 'T3'` HOẶC có panel đề xuất khác PASS. Ở **T2** — tier mặc
định của repo tiêu thụ — panel PASS 3/3 nghĩa là **không ai được hỏi**. Đối
chiếu: `_acceptance/gate-card-ac-visibility` (T3, đã ký) có 2 eval judgment
KHÔNG khai `inputs`, nhưng T3 đẩy mọi judgment item về người nên nó thoát.
motion-floor ở T2 thì không.

Đây KHÔNG phải lỗi tài liệu: 13 workspace khác khai `question` đúng và
`eval-executors.md` có mẫu. Thiếu fail-loud ở tầng script.

## Quét lớp — đề bài nêu 1 field, code có 2 cơ chế

Luật CLAUDE.md: "sửa phải theo LỚP: quét cả file tìm mọi case cùng hình dạng".

### Cơ chế A — field nội suy thẳng vào prompt fan-out, không kiểm

| Vị trí | Field | Vắng thì agent nhận |
|---|---|---|
| `:346` judge | `question` | literal `undefined` — lỗi đã báo |
| `:346` judge | `inputs` | `(e.inputs \|\| [])` → chuỗi rỗng |
| `:346` judge | `id`, `criterion` | `undefined / undefined` trong dòng đề bài |
| `:331` ui-check | `expected` | `Expected: undefined` — **cùng lớp, chưa ai báo** |
| `:329` ui-check | `steps` | `(e.steps \|\| [])` → "làm ĐÚNG các steps sau:" rồi hết |
| `:320` machine | `cmd` | verifier được bảo chạy lệnh `undefined` |

`|| []` là chống *nổ*, không phải chống *rỗng*: nó biến "thiếu đầu vào" thành
"chấm không cần đầu vào" — đúng cơ chế false-green.

### Cơ chế B — executor lạ bị bỏ rơi im lặng (phát hiện khi quét, ĐÃ ĐO)

Ba filter ở `:243-245` khớp chính xác `test|script` · `judgment` · `ui-check`.
Eval có `executor` sai chính tả hoặc vắng thì **không rơi vào bộ nào** — không
chạy, không blocked, không failed. Guard "không có gì để verify" ở `:296` chỉ
bắn khi CẢ BA bộ rỗng, nên một typo lẫn giữa các eval tốt là vô hình.

Đo thật bằng harness (`probe-executor.mjs`, 3 eval: 1 hợp lệ + `executor:
judgement` typo + eval không khai `executor`):

    verdict     = PASS
    failedEvals = []
    blocked     = []

Một typo một chữ cái xoá sạch việc kiểm chứng của một tiêu chí, trang bằng
chứng vẫn xanh. Đây là đường false-green thứ hai, độc lập với `question`.

## Chân ngành — bài toán này có tên

Không phải bài toán lạ: đây là **missing key trong template engine**, và hai
engine lớn đều ship sẵn công tắc fail-loud vì mặc định im lặng gây đúng lỗi này.

- `[NGÀNH: Jinja2]` — `Undefined` mặc định render biến thiếu thành **chuỗi
  rỗng**; `Environment(undefined=StrictUndefined)` ném `UndefinedError`.
- `[NGÀNH: Go text/template]` — `Option("missingkey=error")` thay cho mặc định
  in ra giá trị vô nghĩa.
- `[NGÀNH: JSON Schema draft 2020-12]` — tách **`required`** (khoá vắng) khỏi
  **`type`** (null/sai kiểu) khỏi **`minLength`/`minItems`** (rỗng). Ba từ khoá
  riêng vì đó là ba kiểu hỏng riêng — đây là thước CE cho trục "hình dạng vắng".

Kit đang ở mặc định-im-lặng của Jinja. Thiết kế này là công tắc `StrictUndefined`.

## Quét hình thái (morphological scan)

- **Trục A — executor**: `machine{test,script}` | `ui-check` | `judgment` |
  **`không-khớp-bộ-nào`** `[SP]`. Giá trị thứ 4 là cơ chế B; bỏ nó là bỏ nửa lỗ.
- **Trục B — field bắt buộc**: phổ quát `id`, `criterion`, `executor` · machine
  `cmd` · ui-check `steps`, `expected` · judgment `question`, `inputs`. `[SP]`
- **Trục C — hình dạng vắng**: khoá thiếu | `null` | chuỗi rỗng | chỉ khoảng
  trắng | sai kiểu | mảng rỗng | mảng có phần tử không phải chuỗi.
  `[CE: ngành JSON Schema required/type/minLength]`
- **Trục D — đường vào** `[SP]`: fan-out tươi | `dryRun` | eval carried (P1) |
  panel carried (P3). Trục cửa hậu — cùng eval hỏng, khác đường code.

Thước CE: lịch sử lỗi của chính kit (motion-floor r1-r2 đo được;
gate-card-ac-visibility là ca thoát nhờ tier) + 3 chuẩn ngành có tên ở trên.

Không gian đầy đủ ≈ 220 ô. Không cắt bằng pairwise: preset dành full matrix cho
"luồng tiền và luồng pháp lý", và đây là lõi cưỡng chế — false-green ở đây là
tương đương luồng tiền của kit. Cắt bằng cách **luật đồng nhất phủ cả 220 ô**
(một bảng khai báo, một vòng kiểm), rồi chọn 14 ô làm ca đo: mọi cửa hậu trục D
+ mỗi hình dạng trục C ít nhất một lần + đối chứng dương.

**Trục D là lý do quyết định đặt guard ở đâu** — và là phần dễ sai nhất:

- `dryRun` return ở `:262` **trước** guard "không có gì để verify" → guard đặt
  sau đó thì dry-run vẫn vẽ kế hoạch cho eval hỏng.
- `carriedEvals` (P1) lọc eval máy/ui khỏi fan-out ở `:243/:245`.
- `carriedPanels` (P3) lọc judgment eval khỏi `freshJudgmentEvals` ở `:251`.
  **Đây là ô nguy hiểm nhất**: chính E6 của motion-floor — panel PASS 3/3 giả
  từ round 2 mà carried sang round 3 thì eval không bao giờ được nhìn lại.

→ Kết luận thiết kế: **kiểm `args.evals` NGUYÊN BỘ, trước mọi lọc, trước
`dryRun`.** Guard chỉ soi eval "tươi" là tự tay mở lại đúng cửa vừa đóng.

## Thiết kế

### 1. Bảng field bắt buộc — khai một chỗ, kiểm một vòng

Một hằng khai báo cạnh chỗ dùng, theo đúng precedent `execute-parallel.js:59-63`
(workflow anh em ĐÃ kiểm shape từng task trước fan-out; `acceptance-verify.js`,
cái nặng hơn, thì không).

    machine (test|script) : cmd
    ui-check              : steps[], expected
    judgment              : question
    mọi executor          : id, criterion, executor ∈ 4 giá trị

Kiểm: chuỗi phải là string non-blank (`typeof === 'string' && s.trim()`); mảng
phải là array non-empty toàn string non-blank.

### 2. Hai mức nặng — hỏng-khuôn khác thiếu-căn-cứ

Đây là quyết định thiết kế chính, và là chỗ Cổng 1 cần chốt.

**Hỏng khuôn → BLOCKED, 0 agent.** Không hỏi được thì không ai — máy hay
người — trả lời được. Return ngay trước fan-out, thông điệp nêu **đủ tên mọi**
`<eval id> · <field> · <hình dạng>`. Cùng shape return với guard args ở `:55`
(`failedEvals`/`failedCommands`/`panels`/`confirmedFindings`/`reviewIncomplete`
đều có) để routing BLOCKED của skill chạy nguyên vẹn.

Vì sao BLOCKED chứ không phải REJECT: `evals.yaml` sai là lỗi **soạn thảo**,
không phải code fail. Skill định tuyến BLOCKED = "sửa nguyên nhân, chạy lại
CÙNG round" — không đốt một trong 3 round.

**Thiếu căn cứ → UNCERTAIN cơ học, 0 judge.** Riêng judgment `inputs` vắng hoặc
rỗng: câu hỏi vẫn hỏi được, chỉ là chưa khai vật để đọc. Không spawn 3 judge;
chèn thẳng panel `proposal: UNCERTAIN`, rationale "eval không khai input nào —
máy không có căn cứ, người quyết ở Cổng 2". Routing sẵn có đẩy nó thành
PENDING-JUDGMENT → người phán.

Ba lý do chọn mức nhẹ hơn cho `inputs`:

1. **Đường đọc-cũ (bất biến CLAUDE.md).** `gate-card-ac-visibility` đã ký, 2
   eval judgment không khai `inputs`. Sửa engine mà BLOCK cứng là bắt migrate
   hàng loạt dưới chân workspace cũ — đúng thứ bất biến cấm.
2. **Đúng nghĩa UNCERTAIN**: "hỏi được nhưng không đủ căn cứ" chính là định
   nghĩa của nó. Fail-toward-human là posture của kit.
3. Rẻ hơn: bỏ 3 agent judge cho eval vốn không thể phán.

`inputs` **sai kiểu** (không phải mảng, hoặc mảng chứa phần tử không phải chuỗi
— `join` sẽ cho `[object Object]`) vẫn là hỏng khuôn → BLOCKED.

### 3. Siết prompt hội đồng

Reviewer round 3 của motion-floor chứng minh một lens "tự cứu" bằng cách đọc
`_acceptance/<slug>/contract.md` — artifact NGOÀI danh sách inputs đã khai — để
tự chế ra tiêu chí. Kit cấm silent-recovery ở chỗ khác; để mở ở đây là mâu
thuẫn nội tại.

Thêm vào prompt judge: chỉ được đọc input đã liệt kê + personas; cần thứ ngoài
danh sách thì đó là **lý do trả UNCERTAIN**, không phải cách tự cứu.

Nhưng đây là **hàng rào phụ, không phải hàng rào chính**: chính motion-floor
cho thấy prompt không đáng tin — "một số lens đúng luật persona trả UNCERTAIN,
NHƯNG panel E6 trả PASS 3/3". Guard cơ học ở mục 1-2 mới là thứ chịu lực.

## Cách đo — thước gắn vào vật được giao

`tests/workflows/harness.mjs` nạp **file thật** trong vm realm với agent đóng
hộp. Nên mọi ca đo thoả sẵn 3 điều kiện CLAUDE.md đòi:

- **Fixture do code sinh trong chính lần chạy** — args dựng bằng JS, script
  thật thực thi. Không có bản sao, không có văn viết tay.
- **Path suy từ vị trí script** — `path.dirname(fileURLToPath(import.meta.url))`,
  đã là khuôn sẵn của file test.
- **Đối chứng dương bắt buộc** — mỗi ca âm đi kèm ca dương cùng bộ args chỉ
  khác đúng field đang xét: bản đủ field phải XANH (chạy, spawn agent, verdict
  như cũ) trước khi tin bản thiếu field là ĐỎ.
- **Ghim đúng thông điệp**, không chỉ verdict: assert `blocked[0].reason` chứa
  tên eval + tên field. Chỉ ghim `verdict === 'BLOCKED'` thì ca không phân biệt
  được "bắt đúng lỗi" với "hỏng theo cách khác".

Eval judgment (AC-10) đo **đầu ra, không đo chỉ dẫn**: test dump prompt judge
**thật do script sinh** (`calls[].prompt` từ harness) ra
`evidence/judge-prompt.txt`, rồi hội đồng đọc chính file đó. Không grep file
hướng dẫn — đó là hình dạng (1) trong 4 hình dạng đã dẫm ghi ở CLAUDE.md.

Nghi thức phá-thử: với mỗi phép đo mới, phá vật thật trong một bản sao và xác
nhận phép đo đỏ.

## Không làm (Out of scope)

- **`scripts/eval-coverage-lint.js`** không đụng. Nó cố ý miễn trừ AC judgment
  ("subjective, no mechanical boundary") và không đọc `question`/`inputs`. Bắt
  sớm ở tầng soạn thảo là tốt, nhưng nó là **opt-in per-repo** (không nằm trong
  `feature_loop.suite_keys` của chính kit) nên không chịu lực được; guard S4 phủ
  mọi repo tiêu thụ bất kể có chạy lint hay không. Một cơ chế chịu lực, một chỗ.
- **`ref`** không vào bảng. Nó không nội suy vào prompt fan-out — nó vào prompt
  synthesize làm dữ liệu, và hook L2 đã chặn fail-closed report có `verifier:`
  không phải `config:` ref hay script path. Khác cơ chế, đã đóng.
- **`risk_tiers.t3_paths`** không sửa trong feature này (xem Known issue).
- Không đổi routing verdict, không đổi carry-forward, không đổi schema
  `evals.yaml`.

## Known issue nêu ở Cổng 1 (không sửa ở đây)

`feature-loop/workflows/**` KHÔNG nằm trong `risk_tiers.t3_paths` của
`_acceptance/config.yaml`, nên máy derive feature này ra T2 (owner khai T3 và
tôi theo T3). Nhưng lý do t3_paths tồn tại — "bug ở đây biến thành false-green
im lặng trên MỌI repo tiêu thụ" — mô tả `acceptance-verify.js` chính xác hơn
mô tả phần lớn thứ đang có trong danh sách. Chính feature này là bằng chứng.
Sửa danh sách là quyết định về chính sách cổng, thuộc người, không gộp vào diff
cơ chế này.
