# Khối tìm-lỗi trả phí theo vật — thiết kế

2026-09-14 · slug `khoi-tim-loi-tra-phi-theo-vat` · hạng: máy xếp ở S0 theo
`risk_tiers` (dự kiến **T2** — chạm `feature-loop/workflows/acceptance-verify.js`,
`feature-loop/scripts/s4-args.mjs`, `feature-loop/skills/feature-loop/SKILL.md`,
`scripts/gate-card.js`, `tests/workflows/**`; không chạm `hooks/**`, `lib/**`) ·
trạng thái: `discovery` · **bản 2 sau soát đối kháng 14/09** (bản 1: bảy nhát; bản 2:
năm nhát + thước, xem §Soát).

**Vòng meta duy nhất của cửa sổ 2.12 → 2.13** (CLAUDE.md, giới hạn chiều rộng (b)):
owner gọi tên sáng 14/09 sau khi đọc hoá đơn vòng `release-2-12-0`. Hồ sơ mở
**dưới luật nới 07/09** cho phần CỘNG nhỏ (dòng `finding` trong run-log · cột thời gian
trong `wf-usage`); phần còn lại là TRỪ.

## Vấn đề, đo được

Owner đo từ nhật ký thật vòng `release-2-12-0`: **212,3 M token**, trong đó ba lượt
chấm S4 ăn **105 M / 100 tác tử / 849 lượt gọi**. Vật được giao (ba con số phiên bản)
**xanh từ lượt 1**; 14/14 phát hiện của lượt cuối nằm trong dàn đo do chính máy dựng.

Đo lại ngày 14/09 bằng thước có sẵn của kit (`wf-usage.mjs`, 0 token) trên **20 lượt
chấm** 10–14/09 — cả kho kit lẫn kho tiêu thụ `crm-onehub` — tổng 534,6 M token:

| Vai trò | Tác tử | Token | Phần | M/tác tử |
|---|---|---|---|---|
| `refute` | 266 | 236,1 M | **44 %** | 0,89 |
| `review` (3 finder, opus) | 60 | 207,7 M | **39 %** | 3,46 |
| `baseline` | 18 | 34,9 M | 7 % | 1,94 |
| `machine` | 257 | 25,1 M | 5 % | 0,10 |
| `judge` | 27 | 12,6 M | 2 % | 0,47 |
| còn lại (`triage` · `synthesize` · `capture`) | 63 | 18,2 M | 3 % | — |

Review + refute = **83 %**, ổn định 71–90 % trên **mọi** lượt. Phần *chứng minh vật
xanh* (machine + judge + baseline) = 14 %. `triage` — bước phân loại phạm vi — tốn
0,19 M/tác tử, một tác tử mỗi lượt; `refute` 0,89 M/tác tử, mười ba tác tử mỗi lượt.

**Bao nhiêu trong 83 % chạm phán quyết?** Đếm `review-findings.md` của 26 hồ sơ
`crm-onehub` (finding *đã qua* refute rồi triage xếp ngăn):

- **Trong hợp đồng** (kéo REJECT, máy sửa): 55 — cộng một hồ sơ ngoại lệ 54 finding thì 109.
- **Ngoài hợp đồng** (người quyết ở Cổng Bằng chứng, máy không sửa): **153**.
- **11/26 hồ sơ có 0 finding trong hợp đồng** — ở 11 vòng, toàn bộ làn refute mua về
  một danh sách chờ người.
- Trong hợp đồng **theo lane** (16 mục có nhãn `source`): `measurement` 6 ·
  `conventions` 6 · `bugs` 4 — ba lane đóng góp ngang nhau; **không lane nào thừa**.

**Thời gian** — dựng đường găng từ timestamp transcript, lượt điển hình (28 tác tử,
wall 18,2 phút):

```
phút  0 ──────────────────────────────────────── 18,2
machine   ██ 0,8m                                ← vật xanh, xong ở phút 1
baseline  ████ 3,8m
review    ██████████ 9,7m                        ← finder `bugs`: găng thật
refute          ████████ 5,6 → 12,3m  (chờ finder, rồi song song)
triage                      ██ 12,3 → 14,5m   ← chờ CẢ 5 lane
synthesize                       ████ 14,8 → 18,2m
```

Chuỗi review → refute → triage → synthesize là **tuần tự**; triage đứng sau refute và
chờ cả baseline. Ở run `wf_3abb8598` baseline treo 128 phút → wall **157 phút** trong
khi mọi lane khác xong ở phút 34. Token và thời gian có cùng hình: ~83 % và ~90 %.

**Nút vặn:** `riskTier` xuất hiện **một** lần trong workflow
([acceptance-verify.js:1050](../../../feature-loop/workflows/acceptance-verify.js:1050)) —
T3 → judgment về PENDING-JUDGMENT. Số finder, số refuter, baseline, triage,
synthesize là hằng số theo kích cỡ vật. Thứ duy nhất co giãn là refuter — theo *độ nói
nhiều của finder*, không theo vật.

## Vì sao luật có mà vẫn rò — ba tầng

Kit **đã có** luật cho đúng ca này: «thước phải gắn vào vật được giao» (CLAUDE.md),
«bộ đo được máy kiểm MỘT tầng» (giới hạn chiều rộng (a)), ba ngăn scope-triage
(spec 27/07), carry-forward P1/P2/P3 + K8. Chúng rò ở ba tầng xếp chồng:

1. **Trạm lọc phạm vi đứng SAU trạm đắt nhất.** Luật ở tầng phán quyết đúng —
   `rejectFindings = triaged.filter(f => f.inContract)`
   ([:924](../../../feature-loop/workflows/acceptance-verify.js:924)) — nhưng kit trả
   tiền refute cho **100 %** finding rồi mới hỏi finding đó có thuộc phạm vi không.
   Spec 27/07 đặt triage sau refute vì bài toán lúc đó là *hội tụ* (OneFlow 7 round),
   không phải *chi phí*: triage được thiết kế như cổng phán quyết, không phải cổng chi
   phí.
2. **Phạm vi lấy từ git diff, không lấy từ vật được giao.** `eval.paths` tồn tại nhưng
   chỉ dùng tính cảnh báo «cụm ngoài vùng phủ»
   ([:942](../../../feature-loop/workflows/acceptance-verify.js:942)). Finder nhận trọn
   `diff main...HEAD`. Ở kho sản phẩm hai ranh giới trùng nhau; ở kho kit diff chứa cả
   hồ sơ vòng — 20/20 refuter của lượt 14/09 soi `rang-moc.sh` ×8, `evals.yaml` ×7,
   `gap-probe.md`, `contract.md`, `rang-p200.sh`, `handoff-*.md`; **0** soi vật.
3. **Nghiệm chỉ có một chiều.** Nghi thức kiểm «phá vật thật, phép đo có đỏ không?» đo
   độ nhạy. Phá `rang-moc.sh` thì finder cũng đỏ → qua nghi thức. Chưa từng có phép thử
   chiều ngược: *chạm thứ KHÔNG phải vật → làn chấm phải IM*. Vì thế mọi luật về phạm vi
   trong kit không thể sai được trong bất kỳ phép đo nào đang chạy.

**Vòng 1 xanh, vòng 2 vẫn đo:** carry-forward phủ machine (P1, theo `paths`), baseline
(P2, hash `evals.yaml`), judge (P3, hash inputs), `conventions` (K8, `deltaFiles`) —
tức **14 % + một phần review**. `bugs`, `measurement`, `refute` không cơ chế nào chạm:
**83 % chạy lại trọn mỗi lượt**. Hồ sơ `nang-tran-trang-danh-ba` ghi đúng ca: *«Round
3: mọi eval máy và mọi lệnh suite đều xanh; adversarial-verify tìm thêm 13 lỗi thật
nhưng scope-triage map toàn bộ ra ngoài»*.

**Gốc chung, một câu:** eval có `id`, `paths`, hash → carry được, khoanh được, đếm
được. Finding do LLM sinh tự do và vùng vật — **không có tên máy đọc** → không luật nào
của kit chạm được, nên chúng chạy hằng số và chạy lại.

## Nguyên tắc thiết kế

Đặt tên máy đọc cho hai thứ: **vùng vật** (diff trừ thứ repo đã khai là không-phải-hành-vi
và trừ hồ sơ vòng) và **finding qua lượt** (khoá `file :: title` đã có, ghi sổ). Năm nhát
cắt dưới đây là hệ quả — không nhát nào thêm luật lời, **không nhát nào thêm khoá config**;
mỗi nhát hoặc đổi thứ tự, hoặc đọc một tên máy đọc, hoặc là răng.

**Không đổi:** ba ngăn scope-triage và verdict routing (quyết 27/07 §1, §2 — một agent
triage cả danh sách, finding trong hợp đồng mức high kéo REJECT) · ba lane finder và
model của chúng (dữ liệu: ba lane góp ngang nhau) · lens `measurement` (lưới thường
trực = tầng một hợp pháp theo giới hạn (a)) · P1/P2/P3 · sáu điều kiện xanh-sạch · khuôn
`OOC-ITEM-TEMPLATE` (round-trip P55) · schema `evidence-report.md`. **Không mở lại** ô
`thuoc-cua-thuoc-mot-tang` (park 30/08): spec này không thêm tầng đo thước; nó cắt chi
phí của tầng đang có.

## Kiến trúc — năm nhát + thước

### T1 — Triage đứng TRƯỚC refute

`feature-loop/workflows/acceptance-verify.js`. Lane review đổi từ
`finder → refute(mỗi finding) → [barrier 5 lane] → triage` thành:

```
3 finder ─→ [barrier 3 finder] dedupe file::title ─→ triage (1 agent) ─→ refute CHỈ inContract
```

Barrier sau ba finder là ca barrier hợp lệ: dedupe liên-lane **trước** bước đắt (hai
lane cùng báo một lỗi là chuyện thường — mã hiện tại đã ghi nhận). Barrier này **không**
chờ machine/ui/judge/baseline. Vì `bugs` là finder chậm nhất, chuỗi
`bugs → triage → refute` vẫn là găng như hôm nay — barrier không cộng thêm phút nào,
chỉ đổi lấy dedupe đúng.

- Triage nhận finding **chưa bác bỏ**; prompt bỏ câu «đều đã được xác nhận là lỗi
  thật», giữ câu hỏi duy nhất: *nó có làm một AC thất bại không?* Câu hỏi phạm vi độc
  lập với tính thật — không cần refute trước để trả lời.
- Refute chạy cho finding `inContract === true` **và** `unclassified === false`. Finding
  ngoài hợp đồng **không refute**: máy không tốn tiền chứng minh thứ máy không được sửa.
  Chúng mang cờ **`khongBacBo: true`** (theo thiết kế) — **khác** `unverified: true`
  (refuter chết); hai cờ không được trộn: mục «Chưa adversarial-verify (refuter chết)»
  chỉ nhận `unverified`.
- Khối «Ngoài hợp đồng — người quyết» trong `review-findings.md` đổi **câu mở đầu**
  (vẫn đúng một câu): *«Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và
  CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không
  được sửa.»* Khuôn từng mục (`OOC-ITEM-TEMPLATE`) **không đổi** —
  `lib/out-of-contract.js` khớp heading và khuôn mục, không khớp câu mở đầu.
  **Bản chép thứ hai phải đổi cùng lượt:** [gate-card.js:958](../../../scripts/gate-card.js:958)
  in cứng *«Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi…»* — sau T1 câu đó nói
  sai với người đọc thẻ. Đổi thành cùng nghĩa; răng: case thẻ ghim câu mới, và một case
  ghim rằng chuỗi «là thật» **không** còn xuất hiện ở khối này.
- **`triageFailed` → rơi về đường cũ:** refute **tất cả** finding thô (như hôm nay), mọi
  finding `unclassified`, verdict PENDING-JUDGMENT như cũ. Chi phí đường cũ chỉ trả trên
  đường hỏng; người nhận việc nhận một danh sách đã bác bỏ. (Đo 14/09: 0/26 hồ sơ
  `crm-onehub` hiện có mục «Chưa phân loại» — triage đã ổn định từ khi vá khoá ghép.)
- Triage vẫn **một agent** cho cả danh sách (27/07 §2); danh sách là finding thô đã
  dedupe — dài hơn một chút, không đặt trần.

**Đường đọc-cũ:** không artifact nào đổi khuôn; `evidence-report.md` không thêm field;
hồ sơ đã ký đọc như cũ.

**Răng:** case W mới — responder finder trả 3 finding (2 ngoài, 1 trong) → workflow
spawn **đúng 1** `refute:` (label chứa file của finding trong hợp đồng); `triage` đứng
**trước** mọi `refute:` trong `calls`; khối ngoài hợp đồng in đủ 2 mục + câu mở đầu mới;
hai mục đó **không** nằm dưới heading «refuter chết». Case `triageFailed` (responder
triage trả null hai lần) → refute chạy cho **cả 3**. Mutant: đảo lại thứ tự cũ → đỏ.

### T2 — Vùng vật: finder không soi thứ repo đã khai là không-phải-hành-vi

Không thêm khoá config. **Vùng vật = diff ∖ `risk_tiers.t1_skip_globs` ∖ `_acceptance/*/**`.**
`t1_skip_globs` đã là lời khai của từng repo về «file mà một thay đổi chỉ chạm nó thì
không phải hành vi» (`crm-onehub`: `docs/**`, `**/*.md`; kit: `docs/**`, `README.md`,
`.out-of-scope/**`…) — chính là phần bù của vùng vật. `_acceptance/<slug>/**` là hồ sơ
vòng (kit biết); `_acceptance/config.yaml` **không** phải hồ sơ vòng — nó là hành vi
của thước, ở lại vùng vật.

- Một hàm **`laNgoaiVat(path)`** trong `s4-args.mjs` (marker `<<<NGOAI-VAT`), dùng cho
  **cả** `vungVat` **lẫn** `deltaFiles` (hiện `deltaFiles` lọc `_acceptance/` thô ở
  [s4-args.mjs:325](../../../feature-loop/scripts/s4-args.mjs:325) — hai bộ lọc là hai
  khuôn sẽ trôi). Hệ quả: `_acceptance/config.yaml` nay tính là delta → eval khai
  `paths` chạm nó sẽ chạy lại thay vì carry — chiều FAIL-CLOSED, đúng.
- `s4-args.mjs` truyền `args.vungVat: [paths]` (đã lọc) và `args.ngoaiVatGlobs` (để
  workflow lọc đầu ra bằng cùng danh sách).
- **Prompt** finder `bugs`/`conventions`: *«Tập trung các file sau (vùng vật): …; đọc
  file khác để hiểu ngữ cảnh thì được; được báo finding ở file KHÁC nếu nó vỡ VÌ thay
  đổi trong vùng vật»*. Vùng vật rỗng → **không spawn** hai finder đó (0 token), `log()`
  nói rõ.
- **JS lọc đầu ra theo LOẠI TRỪ, không theo bao gồm:** finding có `file` khớp
  `ngoaiVatGlobs` hoặc `_acceptance/*/` → bỏ, `log()` số bị bỏ kèm file (no-silent-caps).
  Finding ở file sản phẩm **ngoài diff** được giữ — đó là lớp «diff đổi chữ ký, caller ở
  file không đổi vỡ» mà hôm nay kit bắt được và không được đánh mất. Lọc bao gồm (chỉ
  giữ file ∈ vùng vật) là lỗi bản 1 của spec này.
- Lens `measurement` **giữ nguyên** phạm vi (file đo trong diff, kể cả
  `_acceptance/*/evals.yaml`, `rang*.sh`) — tầng một hợp pháp; JS lọc đầu ra **không**
  áp cho lane này. Nhưng JS kiểm **trước khi spawn**: diff không chạm file khớp glob đo
  (`tests/**`, `**/*.test.*`, `**/*.spec.*`, `_acceptance/*/evals.yaml`,
  `_acceptance/*/rang*.sh`) **và** không chạm file nào trong `eval.paths` có đuôi
  test/spec → không spawn (hiện vẫn spawn một agent opus 3,5 M để nó tự trả rỗng).
  Không chắc → spawn: fail-open về phía tốn tiền, không về phía bỏ sót.
- `coverageCluster` tính trên finding còn lại sau lọc — ngữ nghĩa «hợp đồng hụt» giữ
  nguyên, không còn nhiễu bởi finding trên hồ sơ.

Quyết 27/07 «finder không giới hạn phạm vi» **giữ**: finder vẫn được báo lỗi ở file sản
phẩm không eval nào phủ (tín hiệu hợp đồng hụt). Thứ bị loại là hồ sơ của chính vòng
và thứ repo tự khai là không-phải-hành-vi — máy tự đẻ vật đo rồi tự bắt lỗi vật đo là
vòng tự nuôi.

**Đường đọc-cũ:** `args.vungVat` vắng (SKILL/s4-args cũ) → finder nhận `diff
main...HEAD` như cũ, không lọc đầu ra, `log()` cờ vàng «vùng vật không khai».
**Sau này:** khi router `docs/MAP.md` (spec 13/09, chờ sau 2.12) cho repo khai nhà của
tầng theo-vòng, `laNgoaiVat` đọc thêm từ đó — `t1_skip_globs` vẫn là nguồn, router bổ
sung, không thay.

### T3 — Phép vi phân ngoài-vật-phải-im

Răng cho T2 và T5, trong `tests/workflows/acceptance-verify.test.mjs` theo khuôn W39
và `measure-law-mutants.test.mjs`:

- **Chiều im:** `vungVat = ['src/a.js']`, `ngoaiVatGlobs = ['docs/**']`, responder finder
  trả finding ở `_acceptance/x/rang.sh`, `docs/superpowers/specs/y.md`, `src/a.js` →
  chỉ finding `src/a.js` đi tiếp triage; prompt `review:bugs` liệt `src/a.js`, không liệt
  hai path kia; `log` có dòng «bỏ 2 finding ngoài vật». `vungVat = []` → **không** có
  call `review:bugs`/`review:conventions`. Diff không chạm file đo → không có call
  `review:measurement`.
- **Chiều đỏ (đối chứng dương):** finder trả finding ở `src/z.js` (ngoài diff, trong
  sản phẩm) → **đi tiếp** (liên-file không bị lọc); diff chạm `tests/a.test.js` → có call
  `review:measurement`.
- **Mutant:** bỏ `laNgoaiVat`/lọc đầu ra (bản sao trong bộ nhớ) → chiều im đỏ. Ghim
  **đúng thông điệp**, không chỉ số call.

Nghi thức kiểm mới, ghi vào CLAUDE.md mục «thước phải gắn vào vật» **một dòng**: *«và
chiều ngược: chạm một thứ không phải vật, phép đo phải im — phá thử cả hai chiều»*.

### T5 — Finding có sổ, không chạy lại trên file không đổi

- Workflow ghi run-log dòng `kind: 'finding'` cho **mỗi** finding sau triage:
  `{ round, file, title, severity, inContract, plain, proposal, khongBacBo, unverified }`
  — cùng bộ viết với các dòng khác (marker `<<<FINDING-LINE`). Dòng không có `run_id`
  → `evidence-core`/`recheck` bỏ qua (cùng đường `panel`); `round-tally-read` lọc
  `kind === 'round-tally'`; `loop-health` đếm `"kind":"repin"` — đã kiểm 14/09, không
  bộ đọc nào vỡ vì kind lạ.
- Round ≥ 2: `carry-plan.mjs` (cùng anchor P1) đọc dòng `finding` round trước; finding
  ngoài hợp đồng có `file ∉ deltaFiles` → `args.carriedFindings`.
- **K8 mở rộng cho cả ba finder:** round ≥ 2 có `deltaFiles` → `bugs`, `measurement`
  (và `conventions` như hiện tại) được prompt *tập trung* `deltaFiles ∩ vungVat` — cùng
  khuôn câu K8. **Không lọc đầu ra theo `file ∉ deltaFiles`** (liên-file, lý do ở T2);
  JS chỉ **gộp** finding mới có khoá `file :: title` trùng một `carriedFinding` vào mục
  carried (không triage lại, không refute lại).
- Synthesize in khối ngoài hợp đồng gộp `carriedFindings` với nhãn `(r<N>)` — cùng
  cách P3 in panel carried. Lượt nào carry gì đều hiện.
- Finding trong hợp đồng ở round N kéo REJECT → file đó đổi ở N+1 → nằm trong
  `deltaFiles` → chấm lại. Đúng.

**Đường đọc-cũ:** run-log cũ không có dòng `finding` → `carriedFindings` rỗng → finder
round ≥ 2 vẫn theo `deltaFiles` — không chạy lại trọn, chỉ không có nhãn carry.

### T7 — Baseline rời đường găng

`baseline` tách khỏi barrier `parallel([machine, ui, judge, review, baseline])`: giữ
promise riêng **có `.catch(() => null)`** (`parallel` nuốt throw, promise trần thì
không — bỏ catch là một lần reject giết cả lượt), `await` ở điểm **muộn nhất cần**
(trước `nonDiscriminating`/`baselineStatus`, sau triage/refute). API harness không có
trần thời gian cho `agent()` — nên ca treo (`wf_3abb8598`, 128 phút) là **giới hạn đã
khai**: T7 bỏ cộng dồn, không bỏ chờ. Ngưỡng đang đếm: ≥ 2 lượt giữa hai mốc có
baseline > 3× lane chậm nhì → mở đường «baseline n-a khi quá trần» ở SKILL (main loop
có Bash timeout).

### T0 — Thước cho số sau

`wf-usage.mjs` thêm hai trường `startAt`/`endAt` (ISO, từ timestamp transcript) và bảng
`--md` thêm cột **wall** theo vai trò. Cộng nhỏ (luật nới 07/09), trace nguyên tố 2:
không có nó, số «sau» của spec này là ước lượng — đúng cái bệnh spec này chữa.

### Đã cắt khi soát (bản 1 → bản 2)

- **T4 — refuter gộp theo file.** Sau T1, refuter/lượt ≈ 2–4; gộp tiết kiệm 1–2 tác tử,
  đổi schema, và một refuter ôm tám finding dễ bác-cả-hoặc-giữ-cả. YAGNI.
- **T6 — nút vặn theo kích cỡ vật (bỏ `conventions` khi vật nhỏ).** Dữ liệu 14/09:
  `conventions` 6 · `measurement` 6 · `bugs` 4 finding trong hợp đồng — bỏ lane theo
  kích cỡ là bỏ đúng lane có giá trị. Nút vặn tự nhiên là T2: vùng vật hẹp thì finder
  đọc ít, không cần ngưỡng.
- **Khoá `feature_loop.ho_so_globs` / `do_globs`.** Thay bằng `t1_skip_globs` đã có.

## Trace ba nguyên tố · người hưởng

| Nhát | Nguyên tố | Người hưởng |
|---|---|---|
| T1 · T2 · T5 · T7 · T0 | **2 — bằng chứng không tự dối** | **máy**: thôi tin rằng soi hồ sơ của chính mình là chấm sản phẩm; thôi trả tiền chứng minh thứ nó không được sửa |
| T3 | 2 | máy — luật phạm vi lần đầu *có thể sai* trong một phép đo |

Số lượt gọi người của vòng này: Cổng Phạm vi (làn V nếu đủ điều kiện) + Cổng Bằng
chứng = **≤ 2**, dưới trần 3.

## Số trước / sau

| Số | Trước (đo 10–14/09) | Sau (ước; đo lại bằng T0 ở mốc 2.13) |
|---|---|---|
| Token khối tìm-lỗi / lượt | 83 % của ~26,8 M ≈ 22 M | lượt 1 ≈ 7–9 M · lượt ≥ 2 ≈ 2–3 M |
| Token phần chấm / vòng 3 lượt | 105 M | ≈ 15–22 M |
| Wall / lượt 1 | 18,2 phút | ≈ 13–15 phút — finder `bugs` (9,7 m) là găng thật; T1 chỉ bớt ~1 m ở lượt 1, phần còn lại từ T2 (vùng vật hẹp → finder đọc ít) |
| Wall / lượt ≥ 2 | ≈ 18 phút (chạy lại trọn) | ≈ 6–8 phút — T5: finder tập trung `deltaFiles` |
| Refuter / lượt | 13 (266/20) | ≈ 2–4 (chỉ trong hợp đồng) |
| Refuter soi hồ sơ vòng (kho kit) | 19/20 | 0 — răng T3 |

**Số «sau» đến từ kho tiêu thụ ở mốc 2.13, không từ S4 của chính vòng này:** vòng này
được chấm bằng engine đang cài trong plugin cache (bản cũ) trừ khi đồng bộ trước —
xem memory «đồng bộ kit chạm hai bản sao». Ba dòng số của mốc 2.13 đọc thêm hai dòng
này từ `usage-report.md` của mỗi vòng — không dựng phép đo mới ngoài T0.

## Soát đối kháng 14/09 — rủi ro sửa-ra-lỗi-khác

| # | Rủi ro | Xử lý trong spec |
|---|---|---|
| R1 | T2 lọc theo bao gồm → mất finding **liên-file** (diff đổi chữ ký, caller ở file không đổi vỡ) — hôm nay bắt được, sau T2 thì không | Đổi sang lọc **loại trừ**; răng T3 chiều đỏ ghim ca `src/z.js` ngoài diff đi tiếp |
| R2 | Khối ngoài hợp đồng **chưa bác bỏ** chứa finding giả → người quyết trên rác; và điều kiện xanh-sạch «Ngoài hợp đồng hiện-diện-và-rỗng» khó đạt hơn → thêm lượt gọi người | Nhãn ở câu mở đầu + `gate-card.js:958`; ngưỡng đang đếm ở §Giới hạn. Biên độ nhỏ: **25/26** hồ sơ `crm-onehub` đã có khối không rỗng hôm nay — làn V ở Cổng Bằng chứng gần như không xảy ra từ trước (phát hiện phụ, ghi sổ, ngoài phạm vi) |
| R3 | Danh sách triage dài hơn (chưa bác bỏ) → triage bỏ sót mục → `triageFailed` → PENDING-JUDGMENT nhiều hơn | Dedupe trước triage; `triageFailed` rơi về đường cũ (refute tất cả); đo 14/09: 0/26 hỏng |
| R4 | Finding ngoài hợp đồng bị dán nhãn «refuter chết» | Cờ riêng `khongBacBo` ≠ `unverified`; răng T1 ghim heading |
| R5 | Plugin cache lệch bản (SKILL/s4-args mới, workflow cũ hoặc ngược lại) | Mọi args mới vắng → hành vi cũ + cờ vàng; field lạ → workflow cũ bỏ qua |
| R6 | `t1_skip_globs` quá rộng ở một repo (`**/*.md`) → finder bỏ qua md-là-hành-vi | Nhất quán với tiering của chính repo đó: nếu vật là md thì vòng đã T1 thoát ở S0; sai ở đây là sai của lời khai, sửa ở `t1_skip_globs`, không thêm nguồn thứ hai |
| R7 | Baseline promise trần reject → giết lượt | `.catch(() => null)` bắt buộc, răng: responder baseline throw → verdict không BLOCKED vì baseline, `baselineStatus` = n-a |
| R8 | `deltaFiles` đổi bộ lọc (thô `_acceptance/` → `laNgoaiVat`) → `_acceptance/config.yaml` thành delta | Chiều FAIL-CLOSED (eval chạm config chạy lại thay vì carry) — chấp nhận, ghi ở T2 |

## Giới hạn đã khai · ngưỡng đang đếm

- **Khối ngoài hợp đồng chưa qua bác bỏ.** Ngưỡng: ≥ 2 vòng giữa hai mốc mà owner
  đánh dấu > 1/3 mục ngoài hợp đồng là giả, **hoặc** ≥ 2 vòng mất xanh-sạch *chỉ vì*
  mục ngoài hợp đồng mà người sau đó đánh dấu giả → mở «refute gộp theo file cho mục
  severity high ngoài hợp đồng». Không bật sẵn: đó là trả lại một phần chi phí cho thứ
  máy không được sửa.
- **Baseline treo** vẫn chờ (T7 chỉ bỏ cộng dồn) — ngưỡng ở T7.
- **Phiên chính 104 M (49 %)** — chưa đo, **ngoài phạm vi** hồ sơ này. Chiến dịch riêng,
  mở sau mốc 2.13 nếu owner gọi tên; không đoán ở đây.
- **Phát hiện phụ (ghi sổ, không làm ở đây):** điều kiện xanh-sạch «Ngoài hợp đồng
  hiện-diện-và-rỗng» không rỗng ở 25/26 hồ sơ → làn V ở Cổng Bằng chứng gần như chết
  từ trước spec này. Đáng một vòng riêng sau 2.13.

## Ngoài phạm vi

- Không đổi model/effort của bất kỳ vai trò nào (bảng `MODEL_ROUTES` giữ nguyên).
- Không thêm lane, không thêm judge, không đổi schema `evidence-report.md`.
- Không chạm hooks/lib/recheck (giữ T2).

## Đường thi công

`/feature-loop:feature-loop khoi-tim-loi-tra-phi-theo-vat` — S1 sinh contract từ spec
này; AC theo nhát (T1 · T2 · T3 · T5 · T7 · T0 + `gate-card.js:958`), mỗi AC một răng
trong `tests/workflows` hoặc `tests/scripts`; suite `executors.test.plugins` chạy mỗi
lượt. Plan chia **ba cụm độc lập**: (1) T1 + gate-card; (2) T2 + T3 + `laNgoaiVat`;
(3) T5 + T7 + T0. Chiều im (T3) phải đỏ trên bản mutant **trước** khi tin chiều xanh.
