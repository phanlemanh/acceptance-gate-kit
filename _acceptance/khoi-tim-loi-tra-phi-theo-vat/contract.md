---
schema_version: 1
feature: Khối tìm-lỗi trả phí theo vật — triage trước refute, finder không soi văn bản hồ sơ, finding có sổ, baseline rời đường găng, thước token/phút cho năm dòng số
slug: khoi-tim-loi-tra-phi-theo-vat
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm feature-loop/workflows, feature-loop/scripts, scripts/gate-card.js, tests; KHÔNG chạm hooks, lib, pre-merge, recheck
surfaces: [cli]
status: signed-off
design_doc: docs/superpowers/specs/2026-09-14-khoi-tim-loi-tra-phi-theo-vat-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-14T04:14:53Z
---

# Acceptance Contract: khoi-tim-loi-tra-phi-theo-vat

## Context

Vòng meta duy nhất của cửa sổ 2.12 → 2.13 (owner gọi tên 14/09). Đo 20 lượt chấm S4
10–14/09 (534,6 M token): review + refute = **83 %** token, ổn định 71–90 % mọi lượt;
phần chứng-minh-vật-xanh (machine + judge + baseline) = 14 %. Trên 26 hồ sơ `crm-onehub`,
**3/4** finding đã trả tiền bác bỏ bị triage xếp ra ngoài hợp đồng; 11/26 hồ sơ có 0
finding trong hợp đồng. Đường găng một lượt: review → refute → triage → synthesize
tuần tự, triage chờ cả baseline. Gốc chung: finding, vùng vật, kích cỡ vật **không có
tên máy đọc** nên không luật nào của kit chạm được — chúng chạy hằng số và chạy lại.

Design doc bản 3 (sau hai lượt soát đối kháng): năm nhát + thước. Đã cắt khi soát: T4 (gộp
refuter), T6 (nút vặn kích cỡ — dữ liệu: ba lane góp ngang nhau 6/6/4), khoá config mới.
Hồ sơ mở **dưới luật nới 07/09** cho phần cộng nhỏ (dòng `finding` trong run-log · cột
thời gian `wf-usage`); phần còn lại là TRỪ.

## Criteria

### AC-1 (T1) — Triage đứng trước refute; chỉ finding trong hợp đồng mới được bác bỏ

**Given** ba finder trả finding thô (đã dedupe liên-lane theo khoá file :: title)
**When** lane review của `acceptance-verify.js` chạy
**Then** call `triage` đứng TRƯỚC mọi call `refute:`; refute chỉ chạy cho finding
`inContract` (không `unclassified`); finding ngoài hợp đồng mang cờ `khongBacBo: true`
và KHÔNG mang `unverified` (không rơi vào mục «refuter chết»); verdict routing không
đổi (finding trong hợp đồng mức high còn sống sau refute → REJECT; bị bác bỏ → không
REJECT từ finding). Triage hỏng (chết cả retry / không đọc được contract) → rơi về
đường cũ: refute TẤT CẢ, mọi finding `unclassified`, verdict PENDING-JUDGMENT.

### AC-2 (T1, thẻ) — Khối ngoài hợp đồng nói «chưa qua bác bỏ», hết nói «là thật»

**Given** một hồ sơ có mục ngoài hợp đồng
**When** synthesize soạn `review-findings.md` và thẻ Cổng Bằng chứng render khối đó
**Then** câu mở đầu ở CẢ HAI nơi — khuôn synthesize soạn `review-findings.md` VÀ thẻ —
nói rõ các mục CHƯA qua bác bỏ đối kháng và máy không chấm thứ máy không được sửa;
chuỗi «là thật» không còn xuất hiện ở khối này ở cả hai nơi; mục ngoài hợp đồng in dưới
heading khối ngoài hợp đồng, KHÔNG dưới heading «chưa adversarial-verify (refuter chết)»
(heading đó vắng hoặc rỗng khi không refuter nào chết); prompt triage không còn câu
tuyên các finding đã được xác nhận là lỗi thật;
khuôn từng mục (OOC-ITEM-TEMPLATE) không đổi, bộ đọc `lib/out-of-contract.js` đọc như
cũ; fixture P53 sinh lại bằng chính script sinh của nó, không viết lại thủ công.

### AC-3 (T2, sinh args) — Vùng vật có tên máy đọc, một bộ lọc cho cả deltaFiles

**Given** repo khai `risk_tiers.t1_skip_globs` (hoặc không khai)
**When** `s4-args.mjs` sinh tệp args
**Then** `vungVat` = diff so nhánh chính TRỪ file khớp t1_skip_globs TRỪ văn bản hồ sơ
vòng (tệp .md và .jsonl nằm trong thư mục hồ sơ dưới `_acceptance`); mã răng trong
thư mục hồ sơ, `evals.yaml` và `_acceptance/config.yaml` Ở LẠI vùng vật; không khai
t1_skip_globs → chỉ bỏ văn bản hồ sơ; `deltaFiles` (round ≥ 2) dùng CÙNG hàm lọc
`laNgoaiVat` (marker NGOAI-VAT) — không còn lọc thô theo tiền tố `_acceptance/`.
**And** file được khai trong `paths` của bất kỳ eval nào trong `evals.yaml` của vòng thì
Ở LẠI vùng vật và delta bất kể đuôi — một fixture văn bản là ĐẦU VÀO CỦA THƯỚC, loại nó
khỏi delta làm eval của nó được carry màu xanh cũ trong khi fixture đã đổi (chiều
fail-open). Không khoá config mới.

### AC-4 (T2, workflow) — Finder tập trung vùng vật; lọc đầu ra theo LOẠI TRỪ

**Given** args có `vungVat` + `ngoaiVatGlobs`
**When** workflow dựng finder và gom finding
**Then** prompt của MỌI lane finder đang chạy mang tiền tố vùng vật — `bugs`,
`measurement`, và lane thứ ba dù nó là `conventions` (mặc định) hay `invariants` (khi
repo khai skill review riêng) — thân prompt cũ NGUYÊN VĂN (MM6 giữ); finding có file khớp ngoài-vật bị bỏ TRƯỚC triage kèm `log()`
số bị bỏ và `result.boNgoaiVat`; finding ở file sản phẩm NGOÀI diff (liên-file) ĐI
TIẾP; lens `measurement` không bị lọc đầu ra; `vungVat` rỗng → không spawn
`bugs`/`conventions` (0 token); diff không chạm file đo (glob tệp ca kiểm thử, mã trong thư mục
hồ sơ, `eval.paths`) → không spawn `measurement`. `args.vungVat` vắng → hành vi cũ
(diff trọn, không lọc) + cờ vàng qua `log()`.

### AC-5 (T3) — Phép vi phân ngoài-vật-phải-im có răng sống

**Given** bộ test workflow
**When** chạy răng hai chiều và bản mutant
**Then** chiều IM: finding trên văn bản hồ sơ/docs không tới triage, prompt finder không
liệt path đó; chiều ĐỎ (đối chứng dương): finding liên-file `src/z.js` tới triage và
refute, diff chạm `tests/a.test.js` spawn `measurement`; MUTANT bỏ bộ lọc đầu ra (bản
sao trong bộ nhớ) làm chiều im ĐỎ với thông điệp ghim — răng không sống là hồ sơ
không xanh.

### AC-6 (T5) — Finding có sổ; round ≥ 2 không chạy lại thứ không đổi

**Given** một lượt chấm có finding sau triage
**When** workflow ghi run-log
**Then** mỗi finding có ĐÚNG MỘT dòng `kind: finding` (marker FINDING-LINE: file, title,
severity, source, inContract, acRef, plain, proposal, khongBacBo, unverified,
unclassified; có ts/sha/round, KHÔNG có run_id), mỗi khoá file-cộng-tiêu-đề đúng một
dòng (không trùng). **And** các bộ đọc run-log hiện có chạy được trên sổ CÓ dòng mới:
bộ đọc dòng tổng kết lượt, bộ đọc sức khoẻ vòng, và bộ đối chiếu bằng chứng — đều không
ném lỗi và không đổi kết quả so với sổ không có dòng đó. **And** round ≥ 2: `carry-plan.mjs` trả `carriedFindings` = finding ngoài hợp đồng
round trước có file không chạm deltaFiles; workflow KHÔNG triage/refute lại finding
cùng khoá, `result.carried.findings` liệt khoá, synthesize in mục carried kèm
`(r<N>)`; CẢ `bugs` LẪN `measurement` mang tiền tố deltaFiles như lane thứ ba đã có từ
K8 — chỉ tiền tố, không lọc đầu ra theo deltaFiles.

### AC-7 (T7) — Baseline rời đường găng, không giết lượt

**Given** lane baseline chậm hơn hoặc ném lỗi
**When** S4 chạy
**Then** triage được gọi mà không chờ baseline (promise baseline tách khỏi barrier).
**And** chiều dương: baseline trả về MUỘN (sau khi triage đã chạy) với một eval xanh cả
hai phía vẫn được đợi — `nonDiscriminating` chứa id eval đó và payload synthesize mang
trạng thái baseline của nó; bỏ lượt đợi ở điểm muộn làm vế này đỏ. **And** baseline
ném lỗi → lượt không BLOCKED vì baseline, trạng thái baseline trong payload là n-a.

### AC-8 (T0) — `wf-usage` đo thời gian theo vai trò

**Given** một thư mục transcript Workflow
**When** chạy `wf-usage.mjs --json` / `--md`
**Then** mỗi agent có `startAt`/`endAt` ISO; `byRole.<vai trò>` có `agents`, `out`,
`cacheRead`, `wallSeconds`, `startAt`, `endAt`; `wallSeconds` tổng; bản `--md` thêm bảng
wall theo vai trò; bảng và tổng theo model cũ giữ nguyên (U01–U05 xanh). **And** trên
một thư mục transcript THẬT (do harness Workflow sinh, không do tệp ca dựng): ít nhất
một agent có `startAt` hợp lệ và `wallSeconds` lớn hơn 0; JSON mang thêm số đếm agent
không đọc được thời gian, và số đó bằng 0 trên transcript thật — agent thiếu thời gian
vẫn không làm script ném lỗi, nhưng không được im lặng.

## Coverage

Bỏ coverage-scan — không gian AC không phải bài liệt-kê-đủ: năm nhát đã chốt từ số
đo 20 lượt (bảng vai trò × lượt của design doc là ma trận toàn phần: 8 vai trò × 2 loại
lượt × 3 chi phí), hai nhát bị cắt khi soát bằng dữ liệu (entry d-…-1 trong
`decisions.jsonl`). Trục đã đo (thước CE = transcript thật, không viết tay):
- Trục vai trò S4: machine · ui · judge · review · refute · baseline · triage ·
  synthesize · capture — chi phí token đo trên 20 lượt (`wf-usage`).
- Trục lượt: lượt 1 · lượt ≥ 2 — cái gì carry, cái gì chạy lại (mã hiện hành).
- Trục chi phí: token · phút máy (đường găng) · lượt gọi người — mỗi nhát khai dự báo ở
  Notes (luật (c) năm dòng số).

## Out of scope

- T4 gộp refuter theo file — cắt khi soát (sau T1 chỉ còn 2–5 refuter/lượt; YAGNI).
- T6 nút vặn theo kích cỡ vật — cắt khi soát (dữ liệu: conventions 6 · measurement 6 ·
  bugs 4 finding trong hợp đồng; bỏ lane theo kích cỡ là bỏ lane có giá trị).
- Khoá config mới cho vùng vật — thay bằng `t1_skip_globs` đã có.
- Refute cho mục ngoài hợp đồng (kể cả mức high) — owner chốt 14/09: không, chờ ngưỡng
  (R10: ≈ 26 % mục sẽ là thứ refute hôm nay giết; ngưỡng ở design doc §Giới hạn).
- Trần thời gian cho baseline treo — API harness không có; T7 chỉ bỏ cộng dồn.
- Phiên chính 104 M token (49 % của vòng 2.12.0) — chưa đo, chiến dịch riêng sau 2.13.
- Đổi model/effort bất kỳ vai trò nào; thêm lane/judge; đổi schema evidence-report.md.
- Ba chỗ cắt SAU CHỮ KÝ (re-pin theo diff · routing-baseline · dòng 1 tới lên-main) —
  hạt giống `ba-cho-cat-sau-chu-ky-cua-so-2-13`, quyết ở mốc 2.13.
- Đo docs (SKILL, CLAUDE.md) bằng grep — hình dạng 1 «đo chỉ dẫn thay vì đầu ra»,
  không làm; hai thay đổi docs đi kèm vòng, răng `skill-claims` giữ SKILL.

## Notes

### Giới hạn đã khai tại Cổng Bằng chứng (owner ký 14/09)

Mười hai mục dưới đây do làn tìm-lỗi lượt chấm 5 xác nhận, scope-triage xếp
NGOÀI hợp đồng, owner quyết ghi Known limits. Không mục nào chạm hành vi người
dùng cuối — tất cả là nợ của THƯỚC. Chi tiết từng mục ở
`evidence-report.md` mục «Known limits»; chúng đi vào hạt giống mốc 2.13.

- known-limits (Ngoài-1, owner ghi tại Cổng Bằng chứng 14/09): **feature-loop/scripts/wf-usage.mjs** — wf-usage: sửa «đếm dòng thay vì đếm agent» chỉ áp cho byRole — total.agents và byModel[].agents vẫn đếm (agent × model), nên cùng một usage-report tự mâu thuẫn
- known-limits (Ngoài-2, owner ghi tại Cổng Bằng chứng 14/09): **feature-loop/workflows/acceptance-verify.js** — Khoá `finders` mang HAI khuôn khác nhau trong cùng một hợp đồng kết quả của workflow (string[] ở dryRun, {chay,boQua} ở đường thành công)
- known-limits (Ngoài-3, owner ghi tại Cổng Bằng chứng 14/09): **feature-loop/workflows/acceptance-verify.js** — Ba trường args mới (fileDoTrongDiff, coverageFiles, coEvalPaths) có nhánh đọc-cũ nhưng KHÔNG có cờ vàng — trái luật «đổi schema artifact phải có đường đọc-cũ + cờ vàng»
- known-limits (Ngoài-4, owner ghi tại Cổng Bằng chứng 14/09): **tests/scripts/config-yaml-that.test.mjs** — Suite thường trực `executors.test.scripts` nay phụ thuộc cứng vào python3 + PyYAML mà không kho/tài liệu nào khai
- known-limits (Ngoài-5, owner ghi tại Cổng Bằng chứng 14/09): **feature-loop/scripts/wf-usage.mjs** — wf-usage: số agent ở dòng tiêu đề vẫn đếm dòng (agent × model), mâu thuẫn với bảng byRole vừa được sửa trong chính diff này
- known-limits (Ngoài-6, owner ghi tại Cổng Bằng chứng 14/09): **feature-loop/workflows/acceptance-verify.js** — acceptance-verify: khoá `finders` có HAI kiểu khác nhau trong cùng hợp đồng kết quả, và vắng hẳn ở hai đường BLOCKED
- known-limits (Ngoài-7, owner ghi tại Cổng Bằng chứng 14/09): **feature-loop/scripts/s4-args.mjs** — Hai bản globToRe vẫn trôi ở dạng `**/<đoạn>/**`, mà ma trận VV4b được viện làm răng canh không có ô nào thuộc dạng đó
- known-limits (Ngoài-8, owner ghi tại Cổng Bằng chứng 14/09): **tests/workflows/acceptance-verify.test.mjs** — Đo CHỈ DẪN thay vì ĐẦU RA — W47 tự truyền đáp án, tên `_acceptance/config.yaml` chỉ là trang trí
- known-limits (Ngoài-9, owner ghi tại Cổng Bằng chứng 14/09): **tests/workflows/acceptance-verify.test.mjs** — Fixture/hàm khớp VIẾT TAY đúng khuôn bên đọc — bản chép thứ tư của `globToRe`, lại không có đối chứng âm
- known-limits (Ngoài-10, owner ghi tại Cổng Bằng chứng 14/09): **tests/scripts/finding-line-bo-doc.test.mjs** — «Dấu sống» của phép so recheck-evidence là một chuỗi CHỈ xuất hiện khi bộ đọc BÁO LỖI
- known-limits (Ngoài-11, owner ghi tại Cổng Bằng chứng 14/09): **tests/scripts/finding-line-bo-doc.test.mjs** — Tuyên quét LỚP nhưng chỉ assert một CON SỐ, không assert danh tính
- known-limits (Ngoài-12, owner ghi tại Cổng Bằng chứng 14/09): **_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml** — Expected của E7 hứa 4 dòng NGUYÊN VĂN nhưng cmd chỉ ghim 1, và bằng chứng ghi lại không chứa dòng nào

- **Bảng dự báo năm dòng số (luật (c), 14/09) + điều kiện tin cậy:**
  | Dòng | Dự báo |
  |---|---|
  | 1 làm-xong → quyết-được | ↓ (wall S4 lượt 1 18 → 14–16 phút; lượt ≥ 2 → 6–9) |
  | 2 lượt gọi người/vòng | = — đường verdict không đổi thành phần |
  | 3 vòng bị hạ tầng đốt | = (T7 không đổi verdict) |
  | 4 token máy/vòng | ↓ 60–70 % phần chấm (105 M → 30–40 M cho 3 lượt) |
  | 5 phút máy/lượt chấm | ↓ (như dòng 1) |
  Tin cậy: (i) finder → refute trong hợp đồng → REJECT **không đổi thành phần** (cùng 3
  lane, cùng model, refute trong hợp đồng như cũ); T2 chỉ loại văn bản (0/94 finding trong
  hợp đồng của `crm-onehub` nằm ở đó), răng ở lại; (ii) AC-5 là răng cả hai chiều cho
  luật phạm vi — lần đầu luật này có thể sai trong một phép đo.
- **Hồ sơ này chấm chính vật của nó:** S4 của vòng chạy bản chép `acceptance-verify.js`
  từ repo (nếp kit tự host). Bằng chứng CHÍNH là răng trong `tests/workflows` và
  `tests/scripts` (AC-1…AC-8); lượt chấm S4 là lớp phụ và là số đo «sau» sớm nhất
  (usage-report của round ≥ 2 sau khi T1/T2 đã vào cây).
- Số «sau» chính thức đọc ở mốc 2.13 trên kho tiêu thụ qua T0 (dòng 4–5).
- Thước tự dối: tránh dán glob-literal vào văn hồ sơ (P161 quét corpus) — mọi glob ở
  đây nói bằng chữ.
