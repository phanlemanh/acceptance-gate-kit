# Khối tìm-lỗi trả phí theo vật — thiết kế

2026-09-14 · slug `khoi-tim-loi-tra-phi-theo-vat` · hạng: máy xếp ở S0 theo
`risk_tiers` (dự kiến **T2** — chạm `feature-loop/workflows/acceptance-verify.js`,
`feature-loop/scripts/s4-args.mjs`, `feature-loop/skills/feature-loop/SKILL.md`,
`tests/workflows/**`; không chạm `hooks/**`, `lib/**`) · trạng thái: `discovery`.

**Vòng meta duy nhất của cửa sổ 2.12 → 2.13** (CLAUDE.md, giới hạn chiều rộng (b)):
owner gọi tên sáng 14/09 sau khi đọc hoá đơn vòng `release-2-12-0`. Hồ sơ mở
**dưới luật nới 07/09** cho phần CỘNG nhỏ (định danh finding · cột thời gian trong
`wf-usage`); phần còn lại là TRỪ.

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
0,19 M/tác tử, rẻ hơn `refute` khoảng **năm lần theo tác tử và một trăm nghìn lần theo
lượt** (1 tác tử/lượt so với 13 trung bình).

**Bao nhiêu trong 83 % chạm phán quyết?** Đếm `review-findings.md` của 26 hồ sơ
`crm-onehub` (finding *đã qua* refute rồi triage xếp ngăn):

- **Trong hợp đồng** (kéo REJECT, máy sửa): 55 — cộng một hồ sơ ngoại lệ 54 finding thì 109.
- **Ngoài hợp đồng** (người quyết ở Cổng Bằng chứng, máy không sửa): **153**.
- **11/26 hồ sơ có 0 finding trong hợp đồng** — ở 11 vòng, toàn bộ làn refute mua về
  một danh sách chờ người.

**Thời gian** — dựng đường găng từ timestamp transcript, lượt điển hình (28 tác tử,
wall 18,2 phút):

```
phút  0 ──────────────────────────────────────── 18,2
machine   ██ 0,8m                                ← vật xanh, xong ở phút 1
baseline  ████ 3,8m
review    ██████████ 9,7m
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
được. Finding do LLM sinh tự do, vùng vật, kích cỡ vật — **không có tên máy đọc** →
không luật nào của kit chạm được, nên chúng chạy hằng số và chạy lại.

## Nguyên tắc thiết kế

Đặt tên máy đọc cho ba thứ: **vùng vật** (diff trừ hồ sơ vòng), **kích cỡ vật** (số
file · số dòng trong vùng vật), **finding qua lượt** (khoá `file :: title` đã có, ghi
sổ). Bảy nhát cắt dưới đây là hệ quả — không nhát nào thêm luật lời; mỗi nhát hoặc
đổi thứ tự, hoặc đọc một tên máy đọc, hoặc là răng.

**Không đổi:** ba ngăn scope-triage và verdict routing (quyết 27/07 §1, §2 — một agent
triage cả danh sách, finding trong hợp đồng mức high kéo REJECT) · lens `measurement`
(lưới thường trực = tầng một hợp pháp theo giới hạn (a)) · P1/P2/P3 · sáu điều kiện
xanh-sạch · khuôn `OOC-ITEM-TEMPLATE` (round-trip P55). **Không mở lại** ô
`thuoc-cua-thuoc-mot-tang` (park 30/08): spec này không thêm tầng đo thước; nó cắt chi
phí của tầng đang có.

## Kiến trúc — bảy nhát

### T1 — Triage đứng TRƯỚC refute

`feature-loop/workflows/acceptance-verify.js`. Lane review đổi từ
`finder → refute(mỗi finding) → [barrier 5 lane] → triage` thành:

```
3 finder ─→ [barrier] dedupe file::title ─→ triage (1 agent) ─→ refute CHỈ inContract
```

Barrier sau finder là ca barrier hợp lệ: dedupe liên-lane **trước** bước đắt (hai lane
cùng báo một lỗi là chuyện thường — mã hiện tại đã ghi nhận). Barrier này **không** chờ
machine/ui/judge/baseline — chỉ chờ ba finder.

- Triage nhận finding **chưa bác bỏ**; prompt bỏ câu «đều đã được xác nhận là lỗi
  thật», giữ câu hỏi duy nhất: *nó có làm một AC thất bại không?* Câu hỏi phạm vi độc
  lập với tính thật — không cần refute trước để trả lời.
- Refute chạy cho finding `inContract === true` **và** `unclassified === false`. Finding
  ngoài hợp đồng **không refute**: máy không tốn tiền chứng minh thứ máy không được sửa.
  Khối «Ngoài hợp đồng — người quyết» trong `review-findings.md` đổi **câu mở đầu** (một
  câu, vẫn đúng một câu) thành: *«Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng
  Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ
  máy không được sửa.»* Khuôn từng mục (`OOC-ITEM-TEMPLATE`) **không đổi** —
  `lib/out-of-contract.js` khớp heading và khuôn mục, không khớp câu mở đầu.
  **Bản chép thứ hai phải đổi cùng lượt:** [gate-card.js:958](../../../scripts/gate-card.js:958)
  in cứng *«Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi…»* — sau T1 câu đó nói
  sai với người đọc thẻ. Đổi thành cùng nghĩa với câu mở đầu mới; răng: case thẻ ghim
  câu mới, và một case ghim rằng chuỗi «là thật» **không** còn xuất hiện ở khối này.
- `triageFailed` giữ nguyên ngữ nghĩa: triage hỏng → không finding nào được refute,
  không ai REJECT từ findings, verdict PENDING-JUDGMENT khi có finding.
- Triage vẫn **một agent** cho cả danh sách (27/07 §2); danh sách giờ là finding thô
  đã dedupe — dài hơn một chút, không đặt trần (thêm trần là thêm luật; triage rẻ).

**Đường đọc-cũ:** không có artifact nào đổi khuôn. `evidence-report.md` không thêm
field. Hồ sơ đã ký đọc như cũ.

**Răng:** case W mới — với responder finder trả 3 finding (2 ngoài, 1 trong), workflow
spawn **đúng 1** `refute:` (label chứa file của finding trong hợp đồng), `triage`
spawn **trước** refute (thứ tự trong `calls`), khối ngoài hợp đồng in đủ 2 mục + câu mở
đầu mới. Mutant: đảo lại thứ tự cũ → case đỏ.

### T2 — Vùng vật: finder chỉ soi diff trừ hồ sơ vòng

`s4-args.mjs` đã lọc `_acceptance/` khỏi `deltaFiles`
([s4-args.mjs:325](../../../feature-loop/scripts/s4-args.mjs:325)). **Cùng một bộ lọc**
nay áp cho diff của finder ở mọi round:

- `s4-args.mjs` tính `vungVat = git diff --name-only <diffBase>..HEAD` **trừ** glob hồ sơ
  vòng; truyền `args.vungVat: [paths]` và `args.vatKichCo: { files, lines }` (từ
  `--numstat` trên chính danh sách đó).
- Glob hồ sơ vòng: mặc định **`_acceptance/**`** (của kit) và `docs/superpowers/**`
  (nhà spec/plan theo-vòng, quy ước superpowers mà kit phụ thuộc). Repo khai thêm qua
  `feature_loop.ho_so_globs` trong `config.yaml` — kho kit khai `docs/findings/**`,
  `docs/handoff/**`. Không khai → mặc định. Đây là *repo khai, kit kiểm*, không chứa
  product context.
- Finder `bugs` và `conventions` nhận prompt: *«CHỈ báo finding trên các file sau
  (vùng vật): …; đọc file khác để hiểu ngữ cảnh thì được, không báo finding trên
  chúng»*. `vungVat` rỗng → **không spawn** hai finder đó (0 token), `log()` nói rõ.
- Lens `measurement` **giữ nguyên** phạm vi (file đo trong diff, kể cả `evals.yaml`) —
  đó là tầng một hợp pháp. Nhưng JS kiểm trước: diff không chạm file khớp glob đo
  (`tests/**`, `**/*.test.*`, `**/*.spec.*`, `**/evals.yaml`, `**/rang*.sh`, và
  `feature_loop.do_globs` nếu repo khai) → **không spawn** (hiện vẫn spawn một agent opus
  3,5 M để nó tự trả rỗng).
- `coverageCluster` tính trên finding trong vùng vật — ngữ nghĩa «hợp đồng hụt» giữ
  nguyên, không còn nhiễu bởi finding trên hồ sơ.

Quyết 27/07 «finder không giới hạn phạm vi» **giữ trong vùng vật**: finder vẫn được
báo lỗi ở file sản phẩm không eval nào phủ (đó là tín hiệu hợp đồng hụt). Thứ bị loại là
hồ sơ của chính vòng — máy tự đẻ vật đo rồi tự bắt lỗi vật đo, vòng tự nuôi.

**Đường đọc-cũ:** `args.vungVat` vắng (SKILL cũ) → finder nhận `diff main...HEAD` như
cũ + `log()` cờ vàng «vùng vật không khai — finder soi trọn diff».

**Răng:** xem T3.

### T3 — Phép vi phân ngoài-vật-phải-im

Răng cho T2 và T5, đặt trong `tests/workflows/acceptance-verify.test.mjs` theo khuôn
W39 và `measure-law-mutants.test.mjs`:

- **Chiều im:** args với `vungVat = ['src/a.js']`, diff (mô phỏng qua `deltaFiles`/
  `vungVat`) chứa thêm `_acceptance/x/rang.sh` và `docs/superpowers/specs/y.md` →
  prompt của `review:bugs` và `review:conventions` **không** chứa hai path đó; `vungVat`
  rỗng → **không** có call `review:bugs`/`review:conventions`; diff không chạm file đo →
  không có call `review:measurement`.
- **Chiều đỏ (đối chứng dương):** cùng args nhưng `vungVat = ['src/a.js', 'src/b.js']`
  → prompt chứa cả hai; diff chạm `tests/a.test.js` → có call `review:measurement`.
- **Mutant:** bỏ bộ lọc hồ sơ trong workflow (bản sao trong bộ nhớ, như
  `measure-law-mutants`) → chiều im đỏ. Ghim **đúng thông điệp** (label/prompt), không
  chỉ số call.

Nghi thức kiểm mới, ghi vào CLAUDE.md mục «thước phải gắn vào vật» **một dòng**: *«và
chiều ngược: chạm một thứ không phải vật, phép đo phải im — phá thử cả hai chiều»*.

### T4 — Refuter gộp theo file

Finding trong hợp đồng cùng `file` → **một** refuter nhận cả cụm, `REFUTE_SCHEMA` đổi
thành `{ results: [{ title, refuted, reason }] }` khớp theo `title` (khoá `file ::
title` đã có). Lượt 14/09: `rang-moc.sh` ×8 → 1. Refuter thấy cả cụm còn bác bỏ tốt
hơn từng cái rời. Kết quả thiếu mục cho một finding → finding đó `unverified: true`
(đường đã có).

### T5 — Finding có sổ, không chạy lại trên file không đổi

- Workflow ghi run-log dòng `kind: 'finding'` cho **mỗi** finding sau triage:
  `{ round, file, title, severity, inContract, plain, proposal, unverified }`. Cùng
  bộ viết với các dòng khác (một khuôn, marker `<<<FINDING-LINE`).
- Round ≥ 2: `s4-args.mjs` (qua `carry-plan.mjs`, cùng anchor P1) đọc dòng `finding`
  của round trước; finding ngoài hợp đồng có `file ∉ deltaFiles` → `args.carriedFindings`.
- **K8 mở rộng cho cả ba finder:** round ≥ 2 có `deltaFiles` → `bugs`, `measurement`
  (và `conventions` như hiện tại) chỉ báo finding trên `deltaFiles ∩ vungVat`. Lý do gốc
  của K8 giữ nguyên: bỏ file **không đổi**, không bỏ file code.
- Synthesize in khối ngoài hợp đồng gộp `carriedFindings` với nhãn `(r<N>)` — cùng
  cách P3 in panel carried. Minh bạch: lượt nào carry gì đều hiện.
- Finding trong hợp đồng ở round N kéo REJECT → file đó chắc chắn đổi ở N+1 → nằm trong
  `deltaFiles` → chấm lại. Đúng.

**Đường đọc-cũ:** run-log cũ không có dòng `finding` → `carriedFindings` rỗng → finder
round ≥ 2 vẫn theo `deltaFiles` (K8) — không chạy lại trọn, chỉ không có nhãn carry.

### T6 — Nút vặn theo kích cỡ vật

Một chỗ, marker `<<<VAT-NHO-NGUONG`, ngưỡng khởi điểm **đang đếm**:

```js
const VAT_NHO = { files: 3, lines: 150 }   // vật ≤ cả hai → finder rút gọn
```

- Vật nhỏ và `riskTier !== 'T3'` → chỉ finder `bugs` (bỏ `conventions`;
  `measurement` theo luật T2 riêng). T3 giữ đủ finder bất kể kích cỡ.
- Repo override qua `feature_loop.review.finders: [bugs, conventions, measurement]`
  (danh sách tường minh thắng ngưỡng). Không khai → derive.
- `args.vatKichCo` vắng → hành vi cũ (đủ finder).

Trace nguyên tố 3: người chọn khẩu vị, máy derive mặc định. `dryRun` trả thêm
`finders: [...]` và `vatKichCo` để thẻ/log nói rõ vì sao lượt này ít finder.

### T7 — Baseline rời đường găng

`baseline` tách khỏi barrier `parallel([machine, ui, judge, review, baseline])`: giữ
promise riêng, `await` ở điểm **muộn nhất cần** (trước tính `nonDiscriminating`, sau
triage/refute). API harness không có trần thời gian cho `agent()` — nên ca treo
(`wf_3abb8598`, 128 phút) là **giới hạn đã khai**: T7 bỏ cộng dồn, không bỏ chờ. Ngưỡng
đang đếm: ≥ 2 lượt giữa hai mốc có baseline > 3× lane chậm nhì → mở đường «baseline
n-a khi quá trần» ở SKILL (main loop có Bash timeout).

### T0 — Thước cho số sau

`wf-usage.mjs` thêm hai trường `startAt`/`endAt` (ISO, từ timestamp transcript) và bảng
`--md` thêm cột **wall** theo vai trò. Cộng nhỏ (luật nới 07/09), trace nguyên tố 2:
không có nó, số «sau» của spec này là ước lượng — đúng cái bệnh spec này chữa.

## Trace ba nguyên tố · người hưởng

| Nhát | Nguyên tố | Người hưởng |
|---|---|---|
| T1 · T2 · T4 · T5 · T7 · T0 | **2 — bằng chứng không tự dối** | **máy**: thôi tin rằng soi hồ sơ của chính mình là chấm sản phẩm; thôi trả tiền chứng minh thứ nó không được sửa |
| T3 | 2 | máy — luật phạm vi lần đầu *có thể sai* trong một phép đo |
| T6 | **3 — khoảnh khắc quyết thật** | **người**: khẩu vị «chấm dày hay mỏng» là của người; máy derive mặc định, không hỏi |

Số lượt gọi người của vòng này: Cổng Phạm vi (làn V nếu đủ điều kiện) + Cổng Bằng
chứng = **≤ 2**, dưới trần 3.

## Số trước / sau

| Số | Trước (đo 10–14/09) | Sau (ước, đo lại bằng T0 ở mốc 2.13) |
|---|---|---|
| Token khối tìm-lỗi / lượt | 83 % của ~26,8 M ≈ 22 M | lượt 1 ≈ 6–8 M · lượt ≥ 2 ≈ 2–3 M |
| Token phần chấm / vòng 3 lượt | 105 M | ≈ 15–20 M |
| Wall / lượt 1 | 18,2 phút | ≈ 12–14 phút — finder `bugs` (9,7 m) là găng thật; T1 chỉ bớt ~1 m ở lượt 1, phần còn lại từ T2 (vùng vật hẹp → finder đọc ít) và T6 |
| Wall / lượt ≥ 2 | ≈ 18 phút (chạy lại trọn) | ≈ 6–8 phút — T5: finder chỉ soi `deltaFiles` |
| Refuter / lượt | 13 (266/20) | ≈ 2–4 (chỉ trong hợp đồng, gộp file) |
| Refuter soi hồ sơ vòng (kho kit) | 19/20 | 0 — răng T3 |

Ba dòng số của mốc 2.13 đọc thêm hai dòng này từ `usage-report.md` của mỗi vòng —
không dựng phép đo mới ngoài T0.

## Giới hạn đã khai · ngưỡng đang đếm

- **Khối ngoài hợp đồng chưa qua bác bỏ.** Người đọc thẻ có thể gặp finding giả trong
  danh sách chờ mình. Ngưỡng: ≥ 2 vòng giữa hai mốc mà owner đánh dấu > 1/3 mục ngoài
  hợp đồng là giả → mở «refute gộp theo file cho mục severity high ngoài hợp đồng».
  Không bật sẵn: đó là trả lại một phần chi phí cho thứ máy không được sửa.
- **Ngưỡng vật nhỏ** `3 file / 150 dòng` là khởi điểm, chưa có số. Đếm ở mốc 2.13: vòng
  vật-nhỏ có finding `bugs` trong hợp đồng bị lỡ vì thiếu `conventions`? Có → nâng
  ngưỡng hoặc bỏ T6, không thêm knob.
- **Baseline treo** vẫn chờ (T7 chỉ bỏ cộng dồn) — ngưỡng ở T7.
- **Phiên chính 104 M (49 %)** — chưa đo, **ngoài phạm vi** hồ sơ này. Chiến dịch riêng,
  mở sau mốc 2.13 nếu owner gọi tên; không đoán ở đây.

## Ngoài phạm vi

- Không đổi model/effort của bất kỳ vai trò nào (bảng `MODEL_ROUTES` giữ nguyên).
- Không thêm lane, không thêm judge, không đổi schema `evidence-report.md`.
- Không chạm hooks/lib/recheck (giữ T2).

## Đường thi công

`/feature-loop:feature-loop khoi-tim-loi-tra-phi-theo-vat` — S1 sinh contract từ spec
này; AC theo nhát (T1–T7, T0), mỗi AC một răng trong `tests/workflows`; suite
`executors.test.plugins` chạy mỗi lượt. Bằng chứng «sau» của chính vòng này chính là
hoá đơn S4 của nó, đọc bằng T0 — vòng tự đo mình bằng thước nó vừa dựng, và phải đỏ ở
chiều im (T3) trước khi tin chiều xanh.
