# Khối tìm-lỗi trả phí theo vật — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làn chấm S4 trả phí theo vật được giao — triage đứng trước refute, finder không soi văn bản hồ sơ, finding có sổ để không chạy lại, baseline rời đường găng, và thước đo token/phút cho năm dòng số.

**Architecture:** Toàn bộ thay đổi nằm ở tầng feature-loop (workflow `acceptance-verify.js` + hai script sinh args `s4-args.mjs`/`carry-plan.mjs` + `wf-usage.mjs`), cộng một câu in cứng ở `scripts/gate-card.js`. Không chạm `hooks/**`, `lib/**`. Mọi luật mới là vật máy giữ (bộ lọc JS, dòng run-log, răng hai chiều), không phải lời dặn. Đường đọc-cũ ở mọi seam: args vắng → hành vi cũ + cờ vàng.

**Tech Stack:** Node ≥ 20 ESM (`.mjs`), workflow chạy trong sandbox không fs/Date (test qua `tests/workflows/harness.mjs` nạp file thật vào `vm`), test bash (`tests/scripts/run-tests.sh`, `tests/plugins/run-tests.sh`).

**Spec:** [docs/superpowers/specs/2026-09-14-khoi-tim-loi-tra-phi-theo-vat-design.md](../specs/2026-09-14-khoi-tim-loi-tra-phi-theo-vat-design.md) — bản 3.

## Global Constraints

- **Không thêm khoá config.** Vùng vật = diff ∖ `risk_tiers.t1_skip_globs` ∖ (`_acceptance/*/**/*.md` + `_acceptance/*/**/*.jsonl`). Mã răng, `evals.yaml`, `_acceptance/config.yaml` ở lại vùng vật.
- **Lọc đầu ra finder theo LOẠI TRỪ**, không theo bao gồm — finding liên-file ở file sản phẩm ngoài diff phải đi tiếp.
- **Lens `measurement` không bị lọc đầu ra**; chỉ không spawn khi diff không chạm file đo.
- **Không đổi:** ba lane finder + `MODEL_ROUTES`, verdict routing (`rejectFindings = inContract`), `OOC-ITEM-TEMPLATE`, schema `evidence-report.md`, P1/P2/P3.
- **Cờ `khongBacBo: true`** (ngoài hợp đồng, theo thiết kế) ≠ **`unverified: true`** (refuter chết). Không trộn.
- **`triageFailed` → refute TẤT CẢ** (đường cũ).
- **Baseline promise trần phải `.catch(() => null)`.**
- Mọi test mới: đối chứng dương trước chiều đỏ; ghim đúng thông điệp/label, không chỉ đếm.
- Commit message tiếng Việt, kết bằng `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Không push.
- Chạy `bash tests/workflows/run-tests.sh` sau mỗi task chạm workflow; `bash tests/scripts/run-tests.sh` sau task chạm scripts; `bash tests/plugins/run-tests.sh` sau task chạm gate-card.
- CONTEXT.md glossary: viết «Cổng Phạm vi» / «Cổng Bằng chứng» trong văn mặt người; giữ «Gate 2» chỉ khi trích chuỗi mã hiện có.

**Thứ tự:** ba cụm độc lập — Cụm 1 (Task 1–2) · Cụm 2 (Task 3–5) · Cụm 3 (Task 6–9); Task 10 (SKILL) cuối cùng. Trong một cụm làm theo thứ tự.

---

## Cụm 1 — T1: triage trước refute

### Task 1: Đảo thứ tự lane review trong workflow

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — khối lane review trong `parallel([...])` (tìm `() => pipeline(\n    REVIEWERS,`), khối gom `reviewResults`/`confirmedFindings` (tìm `const reviewResults = (reviewRaw || [])`), khối `phase('Triage')`, khối `distinctKey`/`dedupe` (tìm `const distinctKey = f =>`), câu mở đầu OOC trong prompt synthesize (tìm `Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1`).
- Test: `tests/workflows/acceptance-verify.test.mjs` (thêm W40, W40b, W40c trước dòng `summary('acceptance-verify');`).

**Interfaces:**
- Consumes: `agentT`, `parallel`, `REVIEWERS`, `FINDINGS_SCHEMA`, `REFUTE_SCHEMA`, `relPath`, `TRIAGE_SCHEMA`, `OOC_GLOSS` (đều có sẵn trong file).
- Produces: `result.triaged[]` mỗi phần tử có thêm `khongBacBo?: true` (ngoài hợp đồng, không refute) hoặc `unverified?: true` (refuter chết); `result.confirmedFindings` = danh sách SAU refute (Task 6 ghi run-log từ đây). Thứ tự call: `review:*` → `triage` → `refute:*`.

- [ ] **Step 1: Viết răng W40/W40b/W40c (đỏ trước)**

Chèn ngay trước `summary('acceptance-verify');`:

```js
// ── T1 (khoi-tim-loi-tra-phi-theo-vat): triage TRƯỚC refute — chỉ finding trong hợp đồng mới được refute ──
const T1_F = [
  { title: 'A trong', file: '/repo/src/a.js', line: 1, severity: 'high', detail: 'x' },
  { title: 'B ngoai', file: '/repo/src/b.js', line: 2, severity: 'high', detail: 'y' },
  { title: 'C ngoai', file: '/repo/src/c.js', line: 3, severity: 'low', detail: 'z' },
];
const T1_TRIAGE = { contractUnreadable: false, triaged: [
  { title: 'A trong', file: 'src/a.js', inContract: true, acRef: 'AC-1', rationale: 'r', proposal: '', plain: '' },
  { title: 'B ngoai', file: 'src/b.js', inContract: false, acRef: '', rationale: 'r', proposal: 'known-limits', plain: 'nguoi dung thay B' },
  { title: 'C ngoai', file: 'src/c.js', inContract: false, acRef: '', rationale: 'r', proposal: 'wont-fix', plain: 'nguoi dung thay C' },
] };
const t1Args = (over = {}) => baseArgs({ contractPath: '/repo/_acceptance/demo/contract.md', ...over });

console.log('W40 T1: triage dung TRUOC refute, chi finding trong hop dong duoc refute');
{
  const { result, calls } = await runWorkflow(WF, t1Args(), responder({
    'review:bugs': { findings: T1_F },
    'review:': { findings: [] },
    'triage': T1_TRIAGE,
    'refute:': { refuted: false, reason: 'that' },
  }));
  const refutes = byLabel(calls, 'refute:');
  check('W40 dung MOT refuter, cho finding trong hop dong (a.js)', refutes.length === 1 && refutes[0].label === 'refute:a.js', refutes.map(c => c.label).join(','));
  const iT = calls.findIndex(c => c.label === 'triage');
  const iR = calls.findIndex(c => c.label.startsWith('refute:'));
  check('W40 triage dung TRUOC refute trong thu tu call', iT >= 0 && iR > iT, `triage@${iT} refute@${iR}`);
  const ooc = result.triaged.filter(f => !f.inContract);
  check('W40 2 muc ngoai hop dong mang khongBacBo=true va KHONG unverified', ooc.length === 2 && ooc.every(f => f.khongBacBo === true && !f.unverified), JSON.stringify(ooc.map(f => ({ t: f.title, k: f.khongBacBo, u: f.unverified }))));
  check('W40 verdict REJECT vi finding trong hop dong muc high con song', result.verdict === 'REJECT' && result.rejectFindings.length === 1 && result.rejectFindings[0].title === 'A trong', result.verdict);
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W40 cau mo dau khoi ngoai hop dong noi CHUA qua bac bo, khong con "la that"',
    synth && synth.prompt.includes('CHƯA qua bác bỏ đối kháng') && !synth.prompt.includes('Các lỗi dưới đây là thật'),
    synth ? synth.prompt.slice(synth.prompt.indexOf('Ngoài hợp đồng'), synth.prompt.indexOf('Ngoài hợp đồng') + 200) : 'khong co synthesize');
  check('W40 khong finding nao mang unverified (ngoai hop dong KHONG duoc dan nhan refuter chet)', result.triaged.every(f => !f.unverified) && result.confirmedFindings.filter(f => f.unverified).length === 0, JSON.stringify(result.triaged.map(f => ({ t: f.title, u: f.unverified }))));
}

console.log('W40b T1: refuter bac bo finding trong hop dong -> khong REJECT tu finding');
{
  const { result, calls } = await runWorkflow(WF, t1Args(), responder({
    'review:bugs': { findings: T1_F }, 'review:': { findings: [] },
    'triage': T1_TRIAGE,
    'refute:': { refuted: true, reason: 'khong phai van de' },
  }));
  check('W40b van chi 1 refuter', byLabel(calls, 'refute:').length === 1);
  check('W40b bi bac bo -> rejectFindings rong, verdict PASS', result.rejectFindings.length === 0 && result.verdict === 'PASS', `${result.verdict} ${JSON.stringify(result.rejectFindings)}`);
  check('W40b hai muc ngoai hop dong van con (khong bi refute)', result.triaged.filter(f => f.khongBacBo).length === 2);
}

console.log('W40c T1: triage hong (chet ca retry) -> roi ve duong cu: refute TAT CA, moi finding unclassified');
{
  const { result, calls } = await runWorkflow(WF, t1Args(), responder({
    'review:bugs': { findings: T1_F }, 'review:': { findings: [] },
    'triage': null,
    'refute:': { refuted: false, reason: 'that' },
  }));
  check('W40c triage goi 2 lan (retry)', byLabel(calls, 'triage').length === 2, String(byLabel(calls, 'triage').length));
  check('W40c refute chay cho CA 3 finding', byLabel(calls, 'refute:').length === 3, String(byLabel(calls, 'refute:').length));
  check('W40c triageFailed=true, khong ai REJECT tu findings, verdict PENDING-JUDGMENT',
    result.triageFailed === true && result.rejectFindings.length === 0 && result.verdict === 'PENDING-JUDGMENT', result.verdict);
  check('W40c khong finding nao mang khongBacBo (duong cu khong co co nay)', result.triaged.every(f => !f.khongBacBo));
}
```

- [ ] **Step 2: Chạy, phải đỏ**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W40|Results"`
Expected: `FAIL: W40 dung MOT refuter` (hiện tại 3 refuter, chạy trước triage), `FAIL: W40 cau mo dau`, `FAIL: W40c refute chay cho CA 3` có thể PASS tình cờ — chấp nhận, các FAIL khác là đủ.

- [ ] **Step 3: Đổi lane review thành «ba finder → barrier»**

Trong `parallel([...])`, thay TRỌN khối:

```js
  () => pipeline(
    REVIEWERS,
    d => agentT(d.prompt, { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS_SCHEMA, ...modelOpt('finder') }),
    (res, d) => res
      ? parallel(res.findings.map(f => () =>
          agentT(
            `Adversarially verify finding sau trong repo ${args.repoRoot} (diff ${args.diffBase}...HEAD):\n"${f.title}" tai ${f.file}${f.line ? ':' + f.line : ''} — ${f.detail}\nCo BAC BO no: doc code that (Read/Grep; KHONG git checkout/switch — repo phai o nguyen branch), tim bang chung no KHONG phai van de. refuted=true neu khong chac chan day la van de that.`,
            { label: `refute:${(f.file || '').split('/').pop()}`, phase: 'Review', schema: REFUTE_SCHEMA, ...modelOpt('refute') }
          ).then(v => v
            ? (!v.refuted ? { ...f, source: d.key } : null)
            : { ...f, source: d.key, unverified: true }) // refuter chet → giu finding, danh dau chua verify
        )).then(arr => ({ key: d.key, dead: false, findings: arr.filter(Boolean) }))
      : { key: d.key, dead: true, findings: [] } // finder chet → KHONG phai "0 findings"
  ),
```

bằng:

```js
  // T1 (khoi-tim-loi-tra-phi-theo-vat): ba finder → barrier → dedupe → triage → refute
  // CHỈ finding trong hợp đồng. Refute KHÔNG còn ở đây — nó đứng SAU phase Triage.
  // Vì sao: kit từng trả tiền refute cho 100 % finding rồi mới hỏi finding đó có thuộc
  // phạm vi không; đo 20 lượt 10–14/09: refute = 44 % token S4, 3/4 sản phẩm của nó bị
  // triage xếp ra ngoài. Barrier ở đây chỉ chờ BA finder (không chờ machine/judge/
  // baseline) — cần cả ba để dedupe liên-lane trước bước đắt.
  () => parallel(REVIEWERS.map(d => () =>
    agentT(d.prompt, { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS_SCHEMA, ...modelOpt('finder') })
      .then(res => res
        ? { key: d.key, dead: false, findings: (Array.isArray(res.findings) ? res.findings : []).map(f => ({ ...f, source: d.key })) }
        : { key: d.key, dead: true, findings: [] }) // finder chet → KHONG phai "0 findings"
  )),
```

- [ ] **Step 4: Gom finding thô + đưa `dedupe` lên trước triage**

Tìm dòng `const confirmedFindings = reviewResults.flatMap(r => r.findings).map(f => ({ ...f, file: relPath(f.file) }))` và thay bằng:

```js
// Khoá phân biệt (file đã chuẩn hoá :: title) — MỘT chỗ cho triage, refute, vùng phủ.
// Trước T1 khoá này nằm dưới bước Triage; nay dedupe phải xảy ra TRƯỚC triage nên đưa lên.
const distinctKey = f => `${relFile(f)} :: ${f.title}`
const dedupe = arr => [...new Map(arr.map(f => [distinctKey(f), f])).values()]
// Finding THÔ đã dedupe liên-lane — CHƯA qua bác bỏ. Refute chạy sau triage (T1).
const rawFindings = dedupe(reviewResults.flatMap(r => r.findings).map(f => ({ ...f, file: relPath(f.file) })))
```

Rồi XOÁ hai dòng cũ ở khối vùng phủ (tìm `const distinctKey = f => \`${relFile(f)} :: ${f.title}\`` thứ hai và `const dedupe = arr => ...` thứ hai, ngay trên `const triagedDistinct = dedupe(triaged)`), giữ `triagedDistinct`.

- [ ] **Step 5: Triage nhận finding thô; refute sau triage**

Trong `phase('Triage')`, đổi `const toTriage = confirmedFindings.filter(f => !f.unverified) // unverified chưa chắc là thật → không phân loại` thành:

```js
const toTriage = rawFindings // T1: phân loại phạm vi TRƯỚC bác bỏ — câu hỏi phạm vi độc lập với tính thật
```

Trong `triagePrompt`, đổi dòng đầu
`Ban la nguoi PHAN LOAI PHAM VI, khong phai nguoi tim loi. Cac finding duoi day DEU DA duoc xac nhan la loi THAT — dung tranh cai ve tinh dung sai cua chung.\n`
thành
`Ban la nguoi PHAN LOAI PHAM VI, khong phai nguoi tim loi va khong phai nguoi bac bo. Cac finding duoi day CHUA qua bac bo doi khang — dung tranh cai ve tinh dung sai cua chung, buoc bac bo di sau buoc nay.\n`

Đổi tên biến kết quả map: `const triaged = toTriage.map(f => {` → `const triagedRaw = toTriage.map(f => {` và dòng kiểm `if (!triageFailed && triaged.some(f => f.unclassified)) {` → `if (!triageFailed && triagedRaw.some(f => f.unclassified)) {`.

Ngay SAU khối `if (...) { triageFailed = true; log('Triage: agent tra thieu muc ...') }` và TRƯỚC `const rejectFindings = ...`, chèn:

```js
// ── T1: REFUTE — chỉ finding TRONG hợp đồng (triage lành). Triage hỏng → rơi về
// đường cũ: refute TẤT CẢ (chi phí chỉ trả trên đường hỏng; người nhận danh sách
// đã bác bỏ). Finding ngoài hợp đồng KHÔNG refute: máy không tốn tiền chứng minh
// thứ máy không được sửa — cờ `khongBacBo` (theo thiết kế) ≠ `unverified` (chết).
phase('Refute')
const toRefute = triageFailed ? triagedRaw : triagedRaw.filter(f => f.inContract && !f.unclassified)
log(`Refute: ${toRefute.length}/${triagedRaw.length} finding (${triageFailed ? 'triage hong → refute tat ca' : 'chi trong hop dong'})`)
const refuteVotes = await parallel(toRefute.map(f => () =>
  agentT(
    `Adversarially verify finding sau trong repo ${args.repoRoot} (diff ${args.diffBase}...HEAD):\n"${f.title}" tai ${f.file}${f.line ? ':' + f.line : ''} — ${f.detail}\nCo BAC BO no: doc code that (Read/Grep; KHONG git checkout/switch — repo phai o nguyen branch), tim bang chung no KHONG phai van de. refuted=true neu khong chac chan day la van de that.`,
    { label: `refute:${(f.file || '').split('/').pop()}`, phase: 'Review', schema: REFUTE_SCHEMA, ...modelOpt('refute') }
  ).then(v => ({ key: distinctKey(f), v }))
))
const refuteByKey = new Map(refuteVotes.filter(Boolean).map(x => [x.key, x.v]))
const refuteAttempted = new Set(toRefute.map(distinctKey))
const triaged = triagedRaw.flatMap(f => {
  const k = distinctKey(f)
  if (!refuteAttempted.has(k)) return [{ ...f, khongBacBo: true }] // ngoài hợp đồng: không chấm, nói rõ
  const v = refuteByKey.get(k)
  if (!v || typeof v !== 'object') return [{ ...f, unverified: true }] // refuter chết → giữ, đánh dấu
  return v.refuted === true ? [] : [f]
})
const confirmedFindings = triaged
```

- [ ] **Step 6: Đổi câu mở đầu khối ngoài hợp đồng trong prompt synthesize**

Tìm chuỗi `Mo dau ngan bang DUNG mot cau: "Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa."` và thay bằng:
`Mo dau ngan bang DUNG mot cau: "Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa."`

- [ ] **Step 7: Chạy răng W40 + toàn suite workflow**

Run: `bash tests/workflows/run-tests.sh 2>&1 | tail -30`
Expected: mọi case W40* PASS; các case cũ dùng `refute:` (vd W-case về `unverified`, `reviewIncomplete`, coverage) vẫn PASS. Nếu một case cũ ghim «refute chạy cho mọi finding» → đọc case, đó là hành vi T1 cố ý đổi: sửa kỳ vọng của case kèm chú thích `// T1: ...`, KHÔNG nới mã.

- [ ] **Step 8: Chạy mutant MM6 (thân prompt finder phải nguyên văn)**

Run: `node tests/workflows/measure-law-mutants.test.mjs 2>&1 | grep -E "MM6|Results"`
Expected: PASS — Step 3 không đổi `REVIEWERS`.

- [ ] **Step 9: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(s4): triage đứng TRƯỚC refute — refute chỉ finding trong hợp đồng, ngoài hợp đồng mang cờ khongBacBo; triage hỏng rơi về refute tất cả (T1)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 2: Thẻ Cổng Bằng chứng hết nói «là thật»

**Files:**
- Modify: `scripts/gate-card.js` — dòng `P.push(\`<div class="flag fwarn">Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — máy cố ý không tự sửa.</div>\`);`
- Modify: `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md` (sinh lại bằng script — không sửa tay)
- Test: `tests/plugins/run-tests.sh` (thêm P53b sau khối P53)

**Interfaces:** không có.

- [ ] **Step 1: Thêm răng P53b (đỏ trước)**

Tìm khối P53 trong `tests/plugins/run-tests.sh` (bắt đầu `echo "P53 fixture judge E11 = ban render that`). Ngay sau dòng kết thúc khối đó (dòng `fi` đóng `if [ "$P53OK" ...` hoặc dòng in PASS/FAIL của P53 — đọc file để xác định), chèn:

```bash
# ── P53b (khoi-tim-loi-tra-phi-theo-vat, T1): khối ngoài hợp đồng trên thẻ KHÔNG còn
# tuyên «là thật» — sau T1 mục ngoài hợp đồng chưa qua bác bỏ; câu cũ nói sai với
# người đọc thẻ. Đo trên bản render THẬT (cùng script sinh P53), không grep nguồn.
echo "P53b the ngoai hop dong: noi CHUA bac bo, khong con 'la that'"
P53B="$(bash "$P53GEN" 2>/dev/null)"
if printf '%s' "$P53B" | grep -q "CHƯA qua bác bỏ đối kháng" && ! printf '%s' "$P53B" | grep -q "là thật"; then
  echo "  PASS: P53b"
else
  echo "  FAIL: P53b (the van in 'là thật' hoac thieu cau 'CHƯA qua bác bỏ')"; FAIL_COUNT=$((FAIL_COUNT+1))
fi
```

(Kiểm tên biến đếm fail trong file — nếu file dùng tên khác `FAIL_COUNT`, dùng đúng tên đó.)

- [ ] **Step 2: Chạy, phải đỏ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P53b|Results"`
Expected: `FAIL: P53b`.

- [ ] **Step 3: Đổi câu ở gate-card.js**

Thay dòng:

```js
  P.push(`<div class="flag fwarn">Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — máy cố ý không tự sửa.</div>`);
```

bằng:

```js
  // T1 (khoi-tim-loi-tra-phi-theo-vat): mục ngoài hợp đồng KHÔNG còn qua refute —
  // máy không chấm thứ máy không được sửa. Câu cũ «là thật» nói sai với người đọc.
  P.push(`<div class="flag fwarn">Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — bạn quyết; máy cố ý không sửa và không chấm thứ máy không được sửa.</div>`);
```

- [ ] **Step 4: Sinh lại fixture P53 bằng đúng lệnh test chỉ dẫn**

```bash
F=_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md
{ head -6 "$F"; bash tests/plugins/fixtures/render-out-of-contract-block.sh; } > /tmp/p53.new && mv /tmp/p53.new "$F"
git diff --stat -- "$F"
```

Expected: diff chỉ ở dòng câu mở đầu.

- [ ] **Step 5: Chạy suite plugins**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P53|Results"`
Expected: P53 PASS (byte khớp), P53b PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/gate-card.js tests/plugins/run-tests.sh _acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md
git commit -m "fix(gate-card): khối ngoài hợp đồng nói CHƯA qua bác bỏ — bản chép thứ hai của câu mở đầu đổi cùng lượt T1; fixture P53 sinh lại

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Cụm 2 — T2 + T3: vùng vật và răng chiều im

### Task 3: `s4-args.mjs` sinh `vungVat` + `ngoaiVatGlobs`, dùng chung bộ lọc cho `deltaFiles`

**Files:**
- Modify: `feature-loop/scripts/carry-plan.mjs` — `function globToRe(g)` → `export function globToRe(g)`
- Modify: `feature-loop/scripts/s4-args.mjs` — sau khối `const riskTier = frontmatterField(contractText, 'risk_tier');` thêm khối NGOAI-VAT; sửa dòng `const deltaFiles = git('diff', '--name-only', ...)`; thêm hai trường vào `const args = {...}`.
- Test: `tests/scripts/s4-args-vung-vat.test.mjs` (mới), đăng ký trong `tests/scripts/run-tests.sh` (xem cách file đó chạy các `*.test.mjs` — thêm dòng `node "$HERE/s4-args-vung-vat.test.mjs" || FAIL=1` theo khuôn các test s4-args khác).

**Interfaces:**
- Consumes: `resolveConfigList(configText, key)` (evidence-core, có sẵn), `globToRe` (carry-plan).
- Produces: `args.vungVat: string[]` (diff `diffBase..HEAD` đã lọc), `args.ngoaiVatGlobs: string[]`; `args.deltaFiles` nay lọc bằng `laNgoaiVat` (không còn lọc `_acceptance/` thô).

- [ ] **Step 1: Viết test (đỏ trước)**

Tạo `tests/scripts/s4-args-vung-vat.test.mjs`:

```js
// s4-args-vung-vat.test.mjs — T2 (khoi-tim-loi-tra-phi-theo-vat): args mang vungVat =
// diff ∖ t1_skip_globs ∖ văn bản hồ sơ vòng; mã răng và config.yaml Ở LẠI. deltaFiles
// dùng CÙNG bộ lọc. Fixture git do code sinh; đường dẫn suy từ vị trí file.
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const TMP = mkdtempSync(path.join(tmpdir(), 's4args-vungvat-'));

function buildRepo({ t1 = true } = {}) {
  const d = path.join(TMP, 'r-' + Math.random().toString(36).slice(2));
  mkdirSync(path.join(d, '_acceptance', 'demo', 'rang'), { recursive: true });
  mkdirSync(path.join(d, 'docs'), { recursive: true });
  mkdirSync(path.join(d, 'src'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'),
    'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n'
    + (t1 ? 'risk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "**/*.md"\n' : ''));
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'),
    'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    paths: [src/**]\n    expected: x\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'gap-probe.md'), 'cu\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'rang', 'a.mjs'), 'cu\n');
  writeFileSync(path.join(d, 'src', 'a.js'), 'a\n');
  writeFileSync(path.join(d, 'docs', 'note.md'), 'ghi chu\n');
  writeFileSync(path.join(d, 'README.md'), 'r\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'base');
  git(d, 'checkout', '-qb', 'feat');
  // đổi đủ năm loại: mã sản phẩm · mã răng · config · văn bản hồ sơ · docs · md gốc
  writeFileSync(path.join(d, 'src', 'a.js'), 'a\nb\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'rang', 'a.mjs'), 'moi\n');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), readFileSync(path.join(d, '_acceptance', 'config.yaml'), 'utf8') + '# doi\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'gap-probe.md'), 'moi\n');
  writeFileSync(path.join(d, 'docs', 'note.md'), 'ghi chu\nda sua\n');
  writeFileSync(path.join(d, 'README.md'), 'r2\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'feat');
  return d;
}
const run = (d, ...extra) => {
  const out = path.join(d, 'args.json');
  execFileSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main', ...extra], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(readFileSync(out, 'utf8'));
};
const sorted = a => JSON.stringify([...a].sort());

// VV1 — vùng vật: giữ mã sản phẩm, mã răng, config.yaml; bỏ docs/**, **/*.md, văn bản hồ sơ
{
  const d = buildRepo();
  try {
    const a = run(d);
    if (!Array.isArray(a.vungVat)) bad('VV1 args thiếu vungVat', JSON.stringify(Object.keys(a)));
    else if (sorted(a.vungVat) !== sorted(['src/a.js', '_acceptance/demo/rang/a.mjs', '_acceptance/config.yaml'])) bad('VV1 vungVat sai', JSON.stringify(a.vungVat));
    else ok('VV1 vungVat = mã sản phẩm + mã răng + config.yaml; bỏ docs, md gốc, gap-probe.md');
    const g = a.ngoaiVatGlobs || [];
    if (g.includes('docs/**') && g.includes('**/*.md') && g.includes('_acceptance/*/**/*.md') && g.includes('_acceptance/*/**/*.jsonl')) ok('VV1 ngoaiVatGlobs = t1_skip_globs + văn bản hồ sơ');
    else bad('VV1 ngoaiVatGlobs thiếu', JSON.stringify(g));
  } catch (e) { bad('VV1 s4-args lỗi', String(e.stderr || e.message).split('\n').slice(-2).join(' | ')); }
}
// VV2 — repo KHÔNG khai t1_skip_globs → chỉ bỏ văn bản hồ sơ (docs/note.md, README.md Ở LẠI)
{
  const d = buildRepo({ t1: false });
  try {
    const a = run(d);
    if (sorted(a.vungVat) === sorted(['src/a.js', '_acceptance/demo/rang/a.mjs', '_acceptance/config.yaml', 'docs/note.md', 'README.md'])) ok('VV2 không t1_skip_globs → chỉ bỏ văn bản hồ sơ');
    else bad('VV2 vungVat sai', JSON.stringify(a.vungVat));
  } catch (e) { bad('VV2 s4-args lỗi', String(e.stderr || e.message).split('\n').slice(-2).join(' | ')); }
}
// VV3 — deltaFiles (round ≥2, --carry-anchor) dùng CÙNG bộ lọc: rang/a.mjs và config.yaml nay là delta
{
  const d = buildRepo();
  try {
    writeFileSync(path.join(d, '_acceptance', 'demo', 'evidence-report.md'), '---\nverdict: REJECT\n---\n\n## Iterations\n\nRound 1: REJECT.\n');
    writeFileSync(path.join(d, '_acceptance', 'demo', 'run-log.jsonl'), '{"ts":"2026-09-01T00:00:00Z","round":1,"evalId":"E1","run_id":"demo-E1-001","exit_code":0,"sha":"' + git(d, 'rev-parse', 'main') + '"}\n');
    git(d, 'add', '-A'); git(d, 'commit', '-qm', 'r1');
    const anchor = git(d, 'rev-parse', 'main');
    const a = run(d, '--carry-anchor', anchor);
    const df = a.deltaFiles || [];
    if (df.includes('_acceptance/demo/rang/a.mjs') && df.includes('_acceptance/config.yaml') && df.includes('src/a.js') && !df.includes('_acceptance/demo/gap-probe.md') && !df.includes('docs/note.md'))
      ok('VV3 deltaFiles cùng bộ lọc: mã răng + config là delta, văn bản hồ sơ và docs không');
    else bad('VV3 deltaFiles sai', JSON.stringify(df));
  } catch (e) { bad('VV3 s4-args lỗi', String(e.stderr || e.message).split('\n').slice(-2).join(' | ')); }
}
console.log(`\nResults: ${pass} passed, ${fail} failed (s4-args-vung-vat)`);
if (fail) process.exit(1);
```

- [ ] **Step 2: Chạy, phải đỏ**

Run: `node tests/scripts/s4-args-vung-vat.test.mjs`
Expected: `FAIL: VV1 args thiếu vungVat`, VV2 FAIL, VV3 FAIL (delta hiện lọc `_acceptance/` thô).

- [ ] **Step 3: Export `globToRe` từ carry-plan.mjs**

Đổi `function globToRe(g) {` thành `export function globToRe(g) {` (giữ nguyên thân).

- [ ] **Step 4: Thêm khối NGOAI-VAT vào s4-args.mjs**

Thêm import ở đầu file (cạnh các import khác): `import { globToRe } from './carry-plan.mjs';`

Ngay sau `if (!riskTier) die('contract.md thiếu risk_tier trong frontmatter');` chèn:

```js
// ── T2 (khoi-tim-loi-tra-phi-theo-vat): vùng vật — tên máy đọc cho «vật được giao» ──
// <<<NGOAI-VAT
// Ngoài-vật = t1_skip_globs của repo (lời khai «file mà một thay đổi chỉ chạm nó thì
// không phải hành vi») + VĂN BẢN hồ sơ vòng. Mã răng, evals.yaml, config.yaml Ở LẠI:
// «thước tự dối» là lớp lỗi có tỉ lệ cao nhất kit đo được (17/94 finding trong hợp đồng
// của crm-onehub nằm trên mã răng). MỘT hàm cho cả vungVat lẫn deltaFiles — hai bộ lọc
// là hai khuôn sẽ trôi. Không thêm khoá config.
const HO_SO_VAN_BAN_GLOBS = ['_acceptance/*/**/*.md', '_acceptance/*/**/*.jsonl'];
const t1SkipGlobs = (() => { try { return resolveConfigList(configText, 'risk_tiers.t1_skip_globs') || []; } catch { return []; } })();
const ngoaiVatGlobs = [...t1SkipGlobs, ...HO_SO_VAN_BAN_GLOBS];
const ngoaiVatRes = ngoaiVatGlobs.map(globToRe);
const laNgoaiVat = f => ngoaiVatRes.some(r => r.test(f));
// NGOAI-VAT>>>
const vungVat = git('diff', '--name-only', `${diffBase}..HEAD`).split('\n').filter(f => f && !laNgoaiVat(f));
console.error(`s4-args: vùng vật ${vungVat.length} file (ngoài vật: ${ngoaiVatGlobs.length} glob)`);
```

LƯU Ý thứ tự: khối này cần `diffBase` — nếu `diffBase` được tính SAU dòng riskTier trong file, đặt khối này ngay sau `const invokedSha = git('rev-parse', 'HEAD');` thay vì sau riskTier.

Sửa dòng deltaFiles:
```js
  const deltaFiles = git('diff', '--name-only', `${anchor}..HEAD`).split('\n').filter(f => f && !f.startsWith('_acceptance/'));
```
thành
```js
  // T2: cùng bộ lọc với vungVat (trước đây lọc `_acceptance/` thô → mã răng đổi mà eval carry màu xanh cũ)
  const deltaFiles = git('diff', '--name-only', `${anchor}..HEAD`).split('\n').filter(f => f && !laNgoaiVat(f));
```

Trong `const args = {`, sau `invokedSha,` thêm:
```js
  vungVat,
  ngoaiVatGlobs,
```

- [ ] **Step 5: Kiểm `resolveConfigList` trả gì khi key vắng**

Run: `node -e "const c=require('./lib/evidence-core.cjs');console.log(JSON.stringify(c.resolveConfigList('a: 1\n','risk_tiers.t1_skip_globs')))"`
Expected: `[]` hoặc `null` — cả hai đều được khối trên xử lý. Nếu ném lỗi → try/catch đã bọc. Ghi kết quả vào comment cạnh dòng `t1SkipGlobs`.

- [ ] **Step 6: Chạy test mới + test s4-args cũ**

Run: `node tests/scripts/s4-args-vung-vat.test.mjs && node tests/scripts/s4-args-delta.test.mjs`
Expected: VV1–VV3 PASS; SD1 PASS (fixture SD1 đổi `docs/note.md` + `src/a.js`, không khai t1 → deltaFiles như cũ).

- [ ] **Step 7: Đăng ký test trong runner + chạy suite scripts**

Thêm vào `tests/scripts/run-tests.sh` theo khuôn dòng đang chạy `s4-args-delta.test.mjs` (grep `s4-args-delta` để tìm chỗ), một dòng tương tự cho `s4-args-vung-vat.test.mjs`.

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -5`
Expected: all passed.

- [ ] **Step 8: Commit**

```bash
git add feature-loop/scripts/s4-args.mjs feature-loop/scripts/carry-plan.mjs tests/scripts/s4-args-vung-vat.test.mjs tests/scripts/run-tests.sh
git commit -m "feat(s4-args): vùng vật = diff ∖ t1_skip_globs ∖ văn bản hồ sơ — một bộ lọc laNgoaiVat cho cả vungVat lẫn deltaFiles; mã răng và config.yaml ở lại (T2)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 4: Workflow đọc `vungVat` — finder tập trung vùng vật, lọc đầu ra theo loại trừ, không spawn khi không có gì

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — khối `REVIEWERS` (tiền tố phạm vi), khối gom `rawFindings` (Task 1), khối lane review trong `parallel` (điều kiện spawn).
- Test: `tests/workflows/acceptance-verify.test.mjs` (W41, W41b, W41c, W41d) + `tests/workflows/vung-vat-mutants.test.mjs` (mới, T3 mutant).

**Interfaces:**
- Consumes: `args.vungVat?: string[]`, `args.ngoaiVatGlobs?: string[]`, `args.evals[].paths`, `globToRe` (workflow có sẵn ở khối coverage — đưa lên trước khi dùng).
- Produces: `result.boNgoaiVat: [{file,title,source}]` (finding bị bỏ vì ngoài vật), `dryRun.finders: string[]`, `dryRun.vungVat`.

- [ ] **Step 1: Viết răng W41* (đỏ trước) — CẢ HAI CHIỀU**

Chèn trước `summary(...)`:

```js
// ── T2/T3: vùng vật — chiều IM (ngoài vật phải im) và chiều ĐỎ (trong vật, liên-file phải đi tiếp) ──
const VV = { vungVat: ['src/a.js'], ngoaiVatGlobs: ['docs/**', '**/*.md', '_acceptance/*/**/*.md', '_acceptance/*/**/*.jsonl'], contractPath: '/repo/_acceptance/demo/contract.md' };
const VV_FIND = [
  { title: 'trong vat', file: '/repo/src/a.js', line: 1, severity: 'high', detail: 'x' },
  { title: 'lien file', file: '/repo/src/z.js', line: 9, severity: 'high', detail: 'caller vo vi a.js doi chu ky' },
  { title: 'ho so', file: '/repo/_acceptance/demo/gap-probe.md', line: 1, severity: 'high', detail: 'y' },
  { title: 'docs', file: '/repo/docs/superpowers/specs/y.md', line: 1, severity: 'high', detail: 'z' },
];
const vvTriage = { contractUnreadable: false, triaged: [
  { title: 'trong vat', file: 'src/a.js', inContract: true, acRef: 'AC-1', rationale: 'r', proposal: '', plain: '' },
  { title: 'lien file', file: 'src/z.js', inContract: true, acRef: 'AC-1', rationale: 'r', proposal: '', plain: '' },
] };

console.log('W41 chieu IM: finding tren ho so/docs bi bo TRUOC triage; prompt finder liet vung vat, khong liet ngoai vat');
{
  const { result, calls, logs } = await runWorkflow(WF, baseArgs(VV), responder({
    'review:bugs': { findings: VV_FIND }, 'review:': { findings: [] },
    'triage': vvTriage, 'refute:': { refuted: false, reason: 'that' },
  }));
  const tri = byLabel(calls, 'triage')[0];
  check('W41 triage KHONG nhan finding ho so/docs', tri && !tri.prompt.includes('gap-probe.md') && !tri.prompt.includes('specs/y.md'), tri ? tri.prompt.slice(0, 200) : 'no triage');
  check('W41 result.boNgoaiVat liet dung 2 muc', Array.isArray(result.boNgoaiVat) && result.boNgoaiVat.length === 2, JSON.stringify(result.boNgoaiVat));
  check('W41 log noi ro so bi bo', logs.some(l => /bo 2 finding ngoai vat/i.test(l)), logs.join(' | ').slice(0, 300));
  const pb = (byLabel(calls, 'review:bugs')[0] || {}).prompt || '';
  check('W41 prompt bugs liet vung vat src/a.js', pb.includes('src/a.js') && /vung vat/i.test(pb), pb.slice(0, 200));
}
console.log('W41b chieu DO (doi chung duong): finding LIEN-FILE o file san pham ngoai diff DI TIEP toi triage va refute');
{
  const { result, calls } = await runWorkflow(WF, baseArgs(VV), responder({
    'review:bugs': { findings: VV_FIND }, 'review:': { findings: [] },
    'triage': vvTriage, 'refute:': { refuted: false, reason: 'that' },
  }));
  const tri = byLabel(calls, 'triage')[0];
  check('W41b triage NHAN finding lien-file src/z.js', tri && tri.prompt.includes('src/z.js'));
  check('W41b refute chay cho ca a.js lan z.js', byLabel(calls, 'refute:').map(c => c.label).sort().join(',') === 'refute:a.js,refute:z.js', byLabel(calls, 'refute:').map(c => c.label).join(','));
  check('W41b REJECT vi 2 finding trong hop dong high', result.verdict === 'REJECT' && result.rejectFindings.length === 2, result.verdict);
}
console.log('W41c vung vat RONG -> khong spawn bugs/conventions; measurement van theo luat rieng');
{
  const { calls, logs } = await runWorkflow(WF, baseArgs({ ...VV, vungVat: [] }), responder({ 'triage': { contractUnreadable: false, triaged: [] } }));
  check('W41c 0 call review:bugs va review:conventions', byLabel(calls, 'review:bugs').length === 0 && byLabel(calls, 'review:conventions').length === 0, byLabel(calls, 'review:').map(c => c.label).join(','));
  check('W41c log noi ro vi sao', logs.some(l => /vung vat rong/i.test(l)));
}
console.log('W41d measurement: khong spawn khi diff khong cham file do; spawn khi cham tests/**');
{
  const noTest = await runWorkflow(WF, baseArgs({ ...VV, vungVat: ['src/a.js'] }), responder({ 'triage': { contractUnreadable: false, triaged: [] } }));
  check('W41d diff chi src/a.js -> 0 call review:measurement', byLabel(noTest.calls, 'review:measurement').length === 0);
  const withTest = await runWorkflow(WF, baseArgs({ ...VV, vungVat: ['src/a.js', 'tests/a.test.js'] }), responder({ 'triage': { contractUnreadable: false, triaged: [] } }));
  check('W41d diff cham tests/a.test.js -> co call review:measurement', byLabel(withTest.calls, 'review:measurement').length === 1);
  const withRang = await runWorkflow(WF, baseArgs({ ...VV, vungVat: ['_acceptance/demo/rang/a.mjs'] }), responder({ 'triage': { contractUnreadable: false, triaged: [] } }));
  check('W41d diff cham ma rang trong _acceptance/*/ -> co call review:measurement', byLabel(withRang.calls, 'review:measurement').length === 1);
}
console.log('W41e duong doc-cu: khong vungVat -> nhu cu (diff tron, khong loc, co vang)');
{
  const { calls, logs, result } = await runWorkflow(WF, baseArgs({ contractPath: '/repo/_acceptance/demo/contract.md' }), responder({
    'review:bugs': { findings: VV_FIND }, 'review:': { findings: [] }, 'triage': vvTriage, 'refute:': { refuted: false, reason: 'that' },
  }));
  check('W41e prompt bugs van main...HEAD, khong tien to vung vat', /main\.\.\.HEAD/.test(byLabel(calls, 'review:bugs')[0].prompt) && !/vung vat/i.test(byLabel(calls, 'review:bugs')[0].prompt));
  check('W41e khong loc dau ra (4 finding toi triage)', (byLabel(calls, 'triage')[0].prompt.match(/"title":/g) || []).length === 4);
  check('W41e co vang trong log', logs.some(l => /vung vat khong khai/i.test(l)));
  check('W41e boNgoaiVat rong', Array.isArray(result.boNgoaiVat) && result.boNgoaiVat.length === 0);
}
```

- [ ] **Step 2: Chạy, phải đỏ**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W41|Results"`
Expected: W41, W41c, W41d FAIL; W41b có thể PASS (hành vi cũ đã giữ liên-file) — đó là đối chứng dương đúng nghĩa.

- [ ] **Step 3: Đưa `globToRe` lên trước khối REVIEWERS và tính ba tập**

Cắt `function globToRe(g) {...}` (ở khối coverage) dán lên ngay trước `// K8: tiền tố phạm vi cho làn conventions`. Sau nó thêm:

```js
// ── T2 (khoi-tim-loi-tra-phi-theo-vat): vùng vật — đọc từ s4-args, KHÔNG tự tính ──
// vắng args.vungVat (SKILL/s4-args cũ) → đường đọc-cũ: diff trọn, không lọc, cờ vàng.
const coVungVat = Array.isArray(args.vungVat)
const vungVat = coVungVat ? args.vungVat.filter(f => typeof f === 'string' && f) : null
const ngoaiVatRes = (Array.isArray(args.ngoaiVatGlobs) ? args.ngoaiVatGlobs : []).filter(g => typeof g === 'string' && g).map(globToRe)
const laNgoaiVat = p => ngoaiVatRes.some(re => re.test(p))
if (!coVungVat) log('Vung vat khong khai (args.vungVat vang) — finder soi tron diff, khong loc dau ra (duong doc-cu)')
// Lens measurement chỉ spawn khi diff chạm file đo: glob đo mặc định + mọi file KHÔNG
// phải .md/.jsonl trong _acceptance/*/ (kho tiêu thụ đặt răng ở _acceptance/<slug>/rang/*.mjs)
// + file trong eval.paths. Không chắc → spawn: fail-open về phía tốn tiền, không về phía bỏ sót.
const DO_GLOBS = ['tests/**', '**/*.test.*', '**/*.spec.*'].map(globToRe)
const laFileDo = p => DO_GLOBS.some(re => re.test(p))
  || (/^_acceptance\/[^/]+\//.test(p) && !/\.(md|jsonl)$/.test(p))
  || args.evals.flatMap(e => Array.isArray(e.paths) ? e.paths : []).map(globToRe).some(re => re.test(p))
const chamFileDo = !coVungVat || vungVat.some(laFileDo)
const vungVatScope = coVungVat && vungVat.length
  ? `Tap trung cac file sau (vung vat): ${vungVat.join(', ')}. Doc file khac de hieu ngu canh thi duoc; DUOC bao finding o file KHAC neu no vo VI thay doi trong vung vat. `
  : ''
```

- [ ] **Step 4: Tiền tố phạm vi cho `bugs`/`conventions`, điều kiện spawn**

Trong `REVIEWERS`, đổi prompt `conventions` từ `` `${conventionScope}Review diff ...` `` thành `` `${vungVatScope}${conventionScope}Review diff ...` `` và prompt `bugs` từ `` `Review diff ${args.diffBase}...HEAD ...` `` thành `` `${vungVatScope}Review diff ${args.diffBase}...HEAD ...` `` (chỉ THÊM tiền tố — MM6 ghim thân cũ nguyên văn bằng `endsWith`). `invariants` cũng thêm `${vungVatScope}` phía trước.

Ngay sau mảng `REVIEWERS`, thêm:

```js
// T2: chọn finder theo vùng vật. bugs/conventions/invariants cần vật; measurement cần file đo.
const REVIEWERS_ACTIVE = REVIEWERS.filter(d => {
  if (d.key === 'measurement') return chamFileDo
  return !coVungVat || vungVat.length > 0
})
if (coVungVat && vungVat.length === 0) log('Vung vat rong — khong spawn finder bugs/conventions (0 token)')
if (coVungVat && !chamFileDo) log('Diff khong cham file do — khong spawn lens measurement')
```

và trong lane review (Task 1 Step 3) đổi `REVIEWERS.map(d => ...)` thành `REVIEWERS_ACTIVE.map(d => ...)`. Vòng `for (const k of REVIEWERS.map(r => r.key))` tính `reviewIncomplete` đổi thành `REVIEWERS_ACTIVE.map(...)` (finder cố ý không spawn KHÔNG phải «chết»).

Trong `dryRun` return thêm: `finders: REVIEWERS_ACTIVE.map(d => d.key), vungVat: coVungVat ? vungVat : null,`.

- [ ] **Step 5: Lọc đầu ra theo LOẠI TRỪ, ghi `boNgoaiVat`**

Thay dòng `const rawFindings = dedupe(...)` (Task 1 Step 4) bằng:

```js
// T2: lọc đầu ra theo LOẠI TRỪ — bỏ finding trên thứ ngoài vật (văn bản hồ sơ, t1-skip);
// GIỮ finding ở file sản phẩm ngoài diff (liên-file: diff đổi chữ ký, caller vỡ).
// Lens measurement KHÔNG bị lọc (tầng một hợp pháp — nó soi chính file đo).
const rawAll = dedupe(reviewResults.flatMap(r => r.findings).map(f => ({ ...f, file: relPath(f.file) })))
const boNgoaiVat = coVungVat ? rawAll.filter(f => f.source !== 'measurement' && laNgoaiVat(relFile(f))) : []
const rawFindings = coVungVat ? rawAll.filter(f => !boNgoaiVat.includes(f)) : rawAll
if (boNgoaiVat.length) log(`Vung vat: bo ${boNgoaiVat.length} finding ngoai vat (${boNgoaiVat.map(relFile).join(', ')})`)
```

Thêm `boNgoaiVat: boNgoaiVat.map(f => ({ file: relFile(f), title: f.title, source: f.source })),` vào object `return {...}` cuối file (và `boNgoaiVat: []` trong hai đường BLOCKED trả sớm `blockedEarly` và K1 — cùng hợp đồng kết quả).

- [ ] **Step 6: Chạy W41* + suite**

Run: `bash tests/workflows/run-tests.sh 2>&1 | tail -20`
Expected: W41–W41e PASS; MM6 PASS (tiền tố được phép, thân cũ nguyên văn); W39 PASS.

- [ ] **Step 7: Mutant T3 — bỏ bộ lọc thì chiều im phải đỏ**

Tạo `tests/workflows/vung-vat-mutants.test.mjs`:

```js
// T3 (khoi-tim-loi-tra-phi-theo-vat): phép vi phân ngoài-vật-phải-im — bản mutant bỏ bộ
// lọc đầu ra phải làm chiều IM đỏ. Không mutant nào xanh = răng không sống.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow, check, summary, TOOL_KILL_RULE_SRC } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WF = path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');

const args = {
  slug: 'demo', round: 1, riskTier: 'T2', diffBase: 'main', repoRoot: '/repo', invokedAt: '2026-07-02T10:00:00Z',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' }],
  suiteCommands: [], personasPath: '/refs/p.md', templatePath: '/refs/t.md', contractPath: '/repo/_acceptance/demo/contract.md',
  vungVat: ['src/a.js'], ngoaiVatGlobs: ['_acceptance/*/**/*.md'], toolKillRule: TOOL_KILL_RULE_SRC,
};
const F = [{ title: 'ho so', file: '/repo/_acceptance/demo/gap-probe.md', line: 1, severity: 'high', detail: 'y' }];
const respond = c => {
  if (c.label.startsWith('review:bugs')) return { findings: F };
  if (c.label.startsWith('review:')) return { findings: [] };
  if (c.label === 'triage') return { contractUnreadable: false, triaged: [] };
  if (c.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
  if (c.label.startsWith('baseline:')) return { results: [] };
  if (c.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' };
  if (c.label === 'synthesize:report') return { report: '# r', findings: '# f' };
  return null;
};
const triageSaw = (calls) => { const t = calls.find(c => c.label === 'triage'); return t ? t.prompt.includes('gap-probe.md') : false; };

console.log('VVM0 doi chung duong: ban that IM tren finding ho so');
{ const { calls } = await runWorkflow(WF, args, respond); check('VVM0 triage khong thay gap-probe.md', !triageSaw(calls)); }

console.log('VVM1 mutant: bo loc dau ra -> chieu im phai DO');
{
  const needle = 'const boNgoaiVat = coVungVat ? rawAll.filter(f => f.source !== \'measurement\' && laNgoaiVat(relFile(f))) : []';
  check('VVM1 kim tim thay trong nguon (mutant co cho de cam)', SRC.includes(needle));
  const mutated = SRC.replace(needle, 'const boNgoaiVat = []');
  const { calls } = await runWorkflow(WF, args, respond, mutated);
  check('VVM1 mutant lam triage THAY gap-probe.md (rang song)', triageSaw(calls));
}
summary('vung-vat-mutants');
```

Run: `node tests/workflows/vung-vat-mutants.test.mjs`
Expected: VVM0 PASS, VVM1 cả hai PASS (răng sống). `run-tests.sh` tự bắt mọi `*.test.mjs` — không cần đăng ký.

- [ ] **Step 8: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs tests/workflows/vung-vat-mutants.test.mjs
git commit -m "feat(s4): finder tập trung vùng vật, lọc đầu ra theo loại trừ (giữ liên-file), không spawn khi vùng vật rỗng / diff không chạm file đo; răng hai chiều + mutant (T2, T3)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 5: Nghi thức kiểm hai chiều vào CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` — mục «Thước phải gắn vào vật được giao», câu cuối `Nghi thức kiểm nhanh: hỏi "nếu tôi phá vật thật trong một bản sao, phép đo này có đỏ không?" — rồi phá thử một lần cho mỗi phép đo mới.`

- [ ] **Step 1: Sửa một câu**

Thay câu trên bằng:
`Nghi thức kiểm nhanh, HAI chiều: hỏi "nếu tôi phá vật thật trong một bản sao, phép đo này có đỏ không?" — VÀ "nếu tôi chạm một thứ KHÔNG phải vật, phép đo này có IM không?" — rồi phá thử cả hai chiều cho mỗi phép đo mới (chiều im thiếu suốt tới 14/09: luật phạm vi vì thế không thể sai được trong bất kỳ phép đo nào — spec khoi-tim-loi-tra-phi-theo-vat).`

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE): nghi thức kiểm hai chiều — chạm thứ không phải vật, phép đo phải im (T3)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Cụm 3 — T5 + T7 + T0

### Task 6: Run-log dòng `kind: 'finding'`

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — sau khối T1 refute (Task 1 Step 5), trước `const rejectFindings`.
- Test: `tests/workflows/acceptance-verify.test.mjs` (W42).

**Interfaces:**
- Produces: dòng run-log `{ ts, sha?, round, kind: 'finding', file, title, severity, inContract, acRef, plain, proposal, khongBacBo, unverified, source }` — Task 7 đọc.

- [ ] **Step 1: Răng W42 (đỏ trước)**

```js
console.log('W42 T5: moi finding sau triage co MOT dong run-log kind:finding');
{
  const { result } = await runWorkflow(WF, t1Args({ invokedSha: 'abc123' }), responder({
    'review:bugs': { findings: T1_F }, 'review:': { findings: [] }, 'triage': T1_TRIAGE, 'refute:': { refuted: false, reason: 'that' },
  }));
  const fl = result.runLog.map(l => JSON.parse(l)).filter(l => l.kind === 'finding');
  check('W42 3 dong finding', fl.length === 3, String(fl.length));
  const b = fl.find(l => l.title === 'B ngoai');
  check('W42 dong ngoai hop dong: inContract=false, khongBacBo=true, plain+proposal', b && b.inContract === false && b.khongBacBo === true && b.plain === 'nguoi dung thay B' && b.proposal === 'known-limits' && b.file === 'src/b.js', JSON.stringify(b));
  const a = fl.find(l => l.title === 'A trong');
  check('W42 dong trong hop dong: inContract=true, acRef, khong khongBacBo', a && a.inContract === true && a.acRef === 'AC-1' && !a.khongBacBo);
  check('W42 dong mang ts + sha + round, KHONG run_id', fl.every(l => l.ts === '2026-07-02T10:00:00Z' && l.sha === 'abc123' && l.round === 1 && !('run_id' in l)));
}
```

- [ ] **Step 2: Chạy, đỏ** — `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W42|Results"` → `FAIL: W42 3 dong finding`.

- [ ] **Step 3: Ghi dòng**

Sau `const confirmedFindings = triaged` chèn:

```js
// ── T5: finding có sổ — MỘT dòng run-log mỗi finding sau triage (kể cả bị refute? KHÔNG:
// finding bị bác bỏ đã loại khỏi `triaged`; sổ ghi thứ còn sống để round sau carry).
// Dòng không có run_id → evidence-core/recheck bỏ qua (cùng đường `panel`).
// <<<FINDING-LINE
const findingLine = f => JSON.stringify({
  ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, kind: 'finding',
  file: relFile(f), title: f.title, severity: f.severity || '', source: f.source || '',
  inContract: f.inContract === true, acRef: f.acRef || '', plain: f.plain || '', proposal: f.proposal || '',
  khongBacBo: f.khongBacBo === true, unverified: f.unverified === true, unclassified: f.unclassified === true,
})
// FINDING-LINE>>>
for (const f of triaged) runLogLines.push(findingLine(f))
```

KIỂM: `invokedAt`, `invokedSha`, `runLogLines` được khai TRƯỚC khối Triage (ở khối run-log máy). Nếu khối Triage đứng trước chúng trong file, chuyển khối ghi dòng này xuống ngay sau chỗ khai `runLogLines` — nhưng vẫn phải sau `triaged`. Đọc file để đặt đúng chỗ.

- [ ] **Step 4: Chạy W42 + W03 (đếm dòng run-log)**

Run: `bash tests/workflows/run-tests.sh 2>&1 | grep -E "W42|W03|Results"`
Expected: W42 PASS. W03 ghim `result.runLog.length === 4` với 0 finding → không đổi. Nếu case nào đếm run-log với finding ≠ 0 → cập nhật kỳ vọng kèm chú thích `// T5: + dòng kind:finding`.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(s4): run-log ghi một dòng kind:finding cho mỗi finding sau triage — finding có sổ (T5)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 7: Carry finding ngoài hợp đồng qua lượt + K8 mở rộng cho `bugs`/`measurement`

**Files:**
- Modify: `feature-loop/scripts/carry-plan.mjs` — `plan()` trả thêm `carriedFindings`.
- Modify: `feature-loop/scripts/s4-args.mjs` — nhận `plan.carriedFindings` → `args.carriedFindings`.
- Modify: `feature-loop/workflows/acceptance-verify.js` — gộp carried; tiền tố deltaFiles cho `bugs`/`measurement`; synthesize in carried.
- Test: `tests/workflows/carry-plan.test.mjs` (DV10), `tests/workflows/acceptance-verify.test.mjs` (W43, W43b).

**Interfaces:**
- Consumes: dòng `kind:'finding'` round trước (Task 6); `deltaFiles`.
- Produces: `args.carriedFindings: [{ file, title, severity, plain, proposal, fromRound }]`; `result.carried.findings: string[]` (khoá `file :: title`).

- [ ] **Step 1: Răng carry-plan DV10 (đỏ trước)**

Thêm vào cuối `tests/workflows/carry-plan.test.mjs` trước dòng in kết quả:

```js
// DV10 — T5: finding ngoài hợp đồng round trước, file KHÔNG đổi → carriedFindings; file đổi → không
console.log('DV10 carriedFindings: ngoai hop dong + file khong doi');
{
  const d = mkFix();
  const extra = [
    { ts: '2026-08-05T00:00:00Z', round: 1, kind: 'finding', sha: SHA, file: 'src/old/x.js', title: 'ngoai A', severity: 'high', inContract: false, acRef: '', plain: 'p', proposal: 'known-limits', khongBacBo: true, unverified: false, unclassified: false },
    { ts: '2026-08-05T00:00:00Z', round: 1, kind: 'finding', sha: SHA, file: 'src/a/y.js', title: 'ngoai B', severity: 'low', inContract: false, acRef: '', plain: 'q', proposal: 'wont-fix', khongBacBo: true, unverified: false, unclassified: false },
    { ts: '2026-08-05T00:00:00Z', round: 1, kind: 'finding', sha: SHA, file: 'src/old/z.js', title: 'trong C', severity: 'high', inContract: true, acRef: 'AC-1', plain: '', proposal: '', khongBacBo: false, unverified: false, unclassified: false },
  ].map(o => JSON.stringify(o)).join('\n') + '\n';
  writeFileSync(path.join(d, 'run-log.jsonl'), readFileSync(path.join(d, 'run-log.jsonl'), 'utf8') + extra);
  const out = JSON.parse(execFileSync(process.execPath, [CP, '--run-log', path.join(d, 'run-log.jsonl'), '--evals', path.join(d, 'evals.yaml'), '--contract', path.join(d, 'contract.md'), '--round', '2', '--ag-root', path.join(HERE, '..', '..'), '--delta-files', 'src/a/y.js'], { encoding: 'utf8' }));
  const cf = out.carriedFindings || [];
  check('DV10 carry dung 1: ngoai A (file khong doi); ngoai B bi loai (file trong delta); trong C bi loai (inContract)',
    cf.length === 1 && cf[0].title === 'ngoai A' && cf[0].fromRound === 1 && cf[0].plain === 'p' && cf[0].proposal === 'known-limits', JSON.stringify(cf));
}
```

(Thêm `readFileSync` vào import `node:fs` của file test.)

- [ ] **Step 2: Chạy, đỏ** — `node tests/workflows/carry-plan.test.mjs 2>&1 | grep -E "DV10|Results"` → FAIL.

- [ ] **Step 3: carry-plan trả `carriedFindings`**

Trong `plan()`, trước `return { anchorSha, carriedEvals: carried, rerun, reason };` chèn:

```js
  // T5: finding ngoài hợp đồng round trước, file KHÔNG chạm diff-fix → mang sang (không
  // triage/refute lại). Trong hợp đồng KHÔNG carry: chúng kéo REJECT nên file đã đổi.
  const carriedFindings = lines
    .filter(l => l.kind === 'finding' && l.round === prevRound && l.inContract === false && !l.unclassified && l.file && !deltaFiles.includes(l.file))
    .map(l => ({ file: l.file, title: l.title, severity: l.severity || '', plain: l.plain || '', proposal: l.proposal || '', fromRound: typeof l.carried_from_round === 'number' ? l.carried_from_round : l.round }));
```

và đổi return thành `return { anchorSha, carriedEvals: carried, rerun, reason, carriedFindings };`. Nhánh `noCarry` giữ nguyên (không carry gì).

- [ ] **Step 4: s4-args mang sang args**

Trong `s4-args.mjs`, cạnh `if (Array.isArray(plan.carriedEvals) && plan.carriedEvals.length) carriedEvals = plan.carriedEvals;` thêm:
```js
    if (Array.isArray(plan.carriedFindings) && plan.carriedFindings.length) carriedFindings = plan.carriedFindings;
```
khai `let carriedFindings;` cạnh `let carriedEvals;`, và trong `const args = {` thêm `...(carriedFindings ? { carriedFindings } : {}),`.

- [ ] **Step 5: Răng workflow W43/W43b (đỏ trước)**

```js
console.log('W43 T5: carriedFindings — finding cung khoa KHONG triage/refute lai; synthesize in (r<N>)');
{
  const carried = [{ file: 'src/b.js', title: 'B ngoai', severity: 'high', plain: 'nguoi dung thay B', proposal: 'known-limits', fromRound: 1 }];
  const { result, calls } = await runWorkflow(WF, t1Args({ round: 2, deltaFiles: ['src/a.js'], carriedFindings: carried }), responder({
    'review:bugs': { findings: T1_F }, 'review:': { findings: [] },
    'triage': { contractUnreadable: false, triaged: T1_TRIAGE.triaged.filter(t => t.title !== 'B ngoai') },
    'refute:': { refuted: false, reason: 'that' },
  }));
  const tri = byLabel(calls, 'triage')[0];
  check('W43 triage KHONG nhan B ngoai (da carry)', tri && !tri.prompt.includes('B ngoai'));
  check('W43 result.carried.findings = [src/b.js :: B ngoai]', JSON.stringify(result.carried.findings) === JSON.stringify(['src/b.js :: B ngoai']), JSON.stringify(result.carried));
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W43 synthesize nhan carried kem fromRound', synth && synth.prompt.includes('"fromRound":1') && /carriedFindings|carried/i.test(synth.prompt));
  const pb = byLabel(calls, 'review:bugs')[0].prompt;
  check('W43 bugs round>=2 co tien to deltaFiles (K8 mo rong)', /CHI bao finding tren cac file DA DOI|Tap trung cac file DA DOI/i.test(pb) && pb.includes('src/a.js'), pb.slice(0, 200));
  const pm = (byLabel(calls, 'review:measurement')[0] || { prompt: '' }).prompt;
  check('W43 measurement (neu spawn) cung co tien to deltaFiles', pm === '' || pm.includes('src/a.js'));
}
console.log('W43b duong doc-cu: khong carriedFindings -> nhu Task 1');
{
  const { result, calls } = await runWorkflow(WF, t1Args({ round: 2, deltaFiles: ['src/a.js'] }), responder({
    'review:bugs': { findings: T1_F }, 'review:': { findings: [] }, 'triage': T1_TRIAGE, 'refute:': { refuted: false, reason: 'that' },
  }));
  check('W43b carried.findings rong, triage nhan ca 3', result.carried.findings.length === 0 && byLabel(calls, 'triage')[0].prompt.includes('B ngoai'));
}
```

- [ ] **Step 6: Workflow: gộp carried + K8 mở rộng + in ra synthesize**

Sau khối T2 lọc (Task 4 Step 5, sau `const rawFindings = ...`) chèn:

```js
// ── T5: finding carried (round trước, ngoài hợp đồng, file không đổi) — KHÔNG triage/refute lại ──
const carriedFindings = (Array.isArray(args.carriedFindings) ? args.carriedFindings : [])
  .filter(c => c && typeof c.file === 'string' && typeof c.title === 'string')
const carriedKeys = new Set(carriedFindings.map(c => `${relPath(c.file)} :: ${c.title}`))
const rawFindingsFresh = rawFindings.filter(f => !carriedKeys.has(distinctKey(f)))
if (carriedFindings.length) log(`Carry finding ngoai hop dong: ${carriedFindings.length} muc tu round truoc (khong triage/refute lai)`)
```

và đổi `const toTriage = rawFindings` (Task 1 Step 5) thành `const toTriage = rawFindingsFresh`.

K8 mở rộng — trong Task 4 Step 3 đã có `vungVatScope`; thêm ngay sau nó:

```js
// T5/K8 mở rộng: round ≥2 có deltaFiles → bugs và measurement cũng TẬP TRUNG file đã đổi
// (conventions đã làm từ K8). Chỉ tiền tố prompt — KHÔNG lọc đầu ra theo deltaFiles (liên-file).
const deltaScope = Array.isArray(args.deltaFiles) && args.deltaFiles.length
  ? `Tap trung cac file DA DOI so round truoc (file khong doi thi khong soi lai — finding tren chung da co so): ${args.deltaFiles.join(', ')}. `
  : ''
```

và trong `REVIEWERS`, prompt `bugs` và `measurement` thêm `${deltaScope}` ngay sau `${vungVatScope}` (conventions giữ `${conventionScope}` như cũ — không nhân đôi).

Kết quả: trong object `return {...}` cuối, đổi `carried: { evals: ..., panels: ..., baseline: !runBaseline }` thành `carried: { evals: carriedEvals.map(c => c.id), panels: carriedPanels.map(p => p.evalId), baseline: !runBaseline, findings: [...carriedKeys] }` (cả ba chỗ trả `carried`).

Prompt synthesize: trong đoạn dựng khối «Ngoài hợp đồng», ngay sau `Findings: ${JSON.stringify(triaged.filter(f => !f.inContract && !f.unclassified))}` thêm:
`\nCARRIED (T5 — finding ngoai hop dong tu round truoc, file khong doi, KHONG cham lai round nay): in MOI muc theo DUNG khuon OOC-ITEM-TEMPLATE nhu tren, them " (r<fromRound>)" ngay sau {title} trong dong dau: ${JSON.stringify(carriedFindings)}`

- [ ] **Step 7: Chạy toàn bộ**

Run: `bash tests/workflows/run-tests.sh 2>&1 | tail -20 && node tests/scripts/s4-args-delta.test.mjs | tail -3`
Expected: DV10, W43, W43b PASS; MM6 PASS (tiền tố thêm, thân nguyên văn); W39 PASS.

- [ ] **Step 8: Commit**

```bash
git add feature-loop/scripts/carry-plan.mjs feature-loop/scripts/s4-args.mjs feature-loop/workflows/acceptance-verify.js tests/workflows/carry-plan.test.mjs tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(s4): carry finding ngoài hợp đồng qua lượt (file không đổi → không triage/refute lại, in (r<N>)); K8 mở rộng cho bugs/measurement (T5)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 8: Baseline rời đường găng

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — khối `parallel([...])` (bỏ lane baseline khỏi barrier), chỗ tính `baselineByCmd`.
- Test: `tests/workflows/acceptance-verify.test.mjs` (W44, W44b).

**Interfaces:** không đổi hợp đồng kết quả.

- [ ] **Step 1: Răng W44 (đỏ trước)**

```js
console.log('W44 T7: baseline khong chan triage — triage duoc goi TRUOC khi baseline tra ve');
{
  let releaseBaseline; const baselineGate = new Promise(r => { releaseBaseline = r; });
  const order = [];
  const { result } = await runWorkflow(WF, t1Args(), (call) => {
    order.push(call.label);
    if (call.label.startsWith('baseline:')) return baselineGate.then(() => ({ results: [{ cmd: 'pnpm test', baselineExit: 1, cannotRun: false }] }));
    if (call.label === 'triage') { releaseBaseline(); return { contractUnreadable: false, triaged: [] }; }
    if (call.label.startsWith('review:bugs')) return { findings: [{ title: 't', file: '/repo/src/a.js', severity: 'low', detail: 'd' }] };
    return responder()(call);
  });
  check('W44 triage duoc goi (baseline chi mo khoa KHI triage goi) — khong deadlock', order.includes('triage'));
  check('W44 baseline van duoc doi truoc synthesize: nonDiscriminating tinh duoc', Array.isArray(result.nonDiscriminating) && result.verdict === 'PASS', result.verdict);
}
console.log('W44b baseline promise reject -> khong giet luot, baseline n-a');
{
  const { result, calls } = await runWorkflow(WF, t1Args(), (call) => {
    if (call.label.startsWith('baseline:')) throw new Error('boom');
    return responder()(call);
  });
  check('W44b verdict PASS, khong BLOCKED vi baseline', result.verdict === 'PASS', result.verdict);
  const synth = byLabel(calls, 'synthesize:report')[0];
  check('W44b baseline n-a trong payload synthesize', synth && synth.prompt.includes('"baseline":"n-a"'));
}
```

(Harness `agent` = `await respond(call)` — throw trong respond = agent lỗi; với promise trần không catch, workflow sẽ reject → runWorkflow ném → W44b không tới `check` → đó chính là chiều đỏ.)

- [ ] **Step 2: Chạy, đỏ** — W44 hiện deadlock (triage chờ barrier chờ baseline chờ triage) → treo. Chạy với timeout: `timeout 60 node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W44|Results"` → không in W44 PASS / bị timeout = đỏ.

- [ ] **Step 3: Tách baseline khỏi barrier**

Trong `const [machineRaw, uiRaw, judgeRaw, reviewRaw, baselineRaw] = await parallel([ ... ])`: cắt thunk baseline (phần tử cuối, `() => baselineCmds.length === 0 ? { results: [] } : agentT(...)`) ra khỏi mảng; đổi destructuring thành `const [machineRaw, uiRaw, judgeRaw, reviewRaw] = await parallel([...])`. NGAY TRƯỚC dòng `await parallel` đó, khai:

```js
// ── T7: baseline là tín hiệu PHỤ — không được giữ đồng hồ. Promise riêng, không vào barrier;
// await ở điểm muộn nhất cần (trước baselineStatus). `.catch` BẮT BUỘC: parallel nuốt throw,
// promise trần thì không — một lần reject giết cả lượt.
const baselineP = (baselineCmds.length === 0
  ? Promise.resolve({ results: [] })
  : Promise.resolve().then(() => agentT(
      /* prompt baseline NGUYÊN VĂN như cũ */,
      { label: 'baseline:diffBase', phase: 'Machine', schema: BASELINE_SCHEMA, ...modelOpt('baseline') }
    ))
).catch(() => null)
```

(Chép nguyên văn prompt baseline từ thunk cũ vào chỗ `/* ... */`.)

Ở chỗ `const baselineByCmd = new Map(((baselineRaw && baselineRaw.results) || [])...` — ngay trước dòng đó thêm `const baselineRaw = await baselineP` (khối này nằm SAU Triage/Refute trong file — kiểm thứ tự; nếu `baselineByCmd` được tính TRƯỚC khối Triage trong file hiện tại, dời khối `baselineByCmd`/`baselineStatus`/`nonDiscriminating` xuống sau khối Refute của Task 1 — chúng chỉ được dùng ở verdict/synthesize).

- [ ] **Step 4: Chạy** — `timeout 120 bash tests/workflows/run-tests.sh 2>&1 | tail -15` → W44, W44b PASS; các case baseline cũ (W-EE13*) PASS.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(s4): baseline rời đường găng — promise riêng có catch, await muộn nhất; triage không còn chờ baseline (T7)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 9: `wf-usage` đo thời gian — `startAt`/`endAt` + cột wall theo vai trò

**Files:**
- Modify: `feature-loop/scripts/wf-usage.mjs` — `parseAgent`, JSON output, `--md` output.
- Test: `tests/scripts/wf-usage.test.mjs` (U06).

**Interfaces:**
- Produces: JSON `agents[].startAt`, `agents[].endAt` (ISO), `byRole: { <role>: { agents, out, cacheRead, wallSeconds, startAt, endAt } }`, `wallSeconds` tổng; `--md` thêm bảng «wall theo vai trò».

- [ ] **Step 1: Răng U06 (đỏ trước)**

Thêm trước phần in kết quả cuối `wf-usage.test.mjs`:

```js
console.log('U06 T0: startAt/endAt + byRole wall — thước cho dòng 5 của năm dòng số');
{
  const j = JSON.parse(runScript([RUN, '--json']).stdout);
  const a = j.agents.find(x => x.agent === 'aaaa1111');
  check('U06 agent co startAt/endAt ISO', a.startAt === '2026-07-23T01:00:00.000Z' && a.endAt === '2026-07-23T01:00:30.000Z', `${a.startAt} ${a.endAt}`);
  check('U06 byRole.exec: 1 agent, wall 30s', j.byRole && j.byRole.exec && j.byRole.exec.agents === 1 && j.byRole.exec.wallSeconds === 30, JSON.stringify(j.byRole));
  check('U06 wallSeconds tong = 69 (01:00:00 → 01:01:09)', j.wallSeconds === 69, String(j.wallSeconds));
  const md = runScript([RUN, '--md']).stdout;
  check('U06 md co bang wall theo vai tro', md.includes('| vai trò |') && md.includes('| exec |'), md.slice(-400));
}
```

- [ ] **Step 2: Chạy, đỏ** — `node tests/scripts/wf-usage.test.mjs 2>&1 | grep -E "U06|Results"` → FAIL.

- [ ] **Step 3: Sửa wf-usage**

Trong `parseAgent`, sau `const seconds = ...` thêm:
```js
  const startAt = ts.length ? new Date(Math.min(...ts.map(Date.parse))).toISOString() : '';
  const endAt = ts.length ? new Date(Math.max(...ts.map(Date.parse))).toISOString() : '';
```
và thêm `startAt, endAt` vào object trả về của mỗi row.

Sau `const total = ...` thêm:
```js
// T0 (khoi-tim-loi-tra-phi-theo-vat): wall theo VAI TRÒ = phần trước ':' của label — thước cho
// dòng 5 (phút máy/lượt chấm) và tách ba khối của dòng 4 (chứng-minh-vật / tìm-lỗi / tổng hợp).
const roleOf = l => (l || '').split(':')[0] || '(none)';
const byRole = {};
for (const r of rows) {
  if (!r.startAt) continue;
  const k = roleOf(r.label);
  const b = byRole[k] || (byRole[k] = { agents: 0, out: 0, cacheRead: 0, startMs: Infinity, endMs: -Infinity });
  b.agents++; b.out += r.out; b.cacheRead += r.cacheRead;
  b.startMs = Math.min(b.startMs, Date.parse(r.startAt)); b.endMs = Math.max(b.endMs, Date.parse(r.endAt));
}
for (const b of Object.values(byRole)) {
  b.wallSeconds = Math.round((b.endMs - b.startMs) / 1000);
  b.startAt = new Date(b.startMs).toISOString(); b.endAt = new Date(b.endMs).toISOString();
  delete b.startMs; delete b.endMs;
}
const allStart = rows.filter(r => r.startAt).map(r => Date.parse(r.startAt));
const allEnd = rows.filter(r => r.endAt).map(r => Date.parse(r.endAt));
const wallSeconds = allStart.length ? Math.round((Math.max(...allEnd) - Math.min(...allStart)) / 1000) : 0;
```

JSON: thêm `byRole, wallSeconds` vào object xuất. `--md`: sau dòng model tổng, thêm:
```js
  out.push('');
  out.push(`wall: ${wallSeconds}s`);
  out.push('| vai trò | agents | out | cache_read | wall s | bắt đầu | kết thúc |');
  out.push('|---|--:|--:|--:|--:|---|---|');
  for (const [k, b] of Object.entries(byRole).sort((x, y) => Date.parse(x[1].startAt) - Date.parse(y[1].startAt)))
    out.push(`| ${k} | ${b.agents} | ${fmt(b.out)} | ${fmt(b.cacheRead)} | ${b.wallSeconds} | ${b.startAt.slice(11, 19)} | ${b.endAt.slice(11, 19)} |`);
```

- [ ] **Step 4: Chạy** — `node tests/scripts/wf-usage.test.mjs` → U01–U06 PASS (U03 ghim `md.includes('| exec:Task 1 | ...')` — bảng cũ giữ nguyên).

- [ ] **Step 5: Commit**

```bash
git add feature-loop/scripts/wf-usage.mjs tests/scripts/wf-usage.test.mjs
git commit -m "feat(wf-usage): startAt/endAt + wall theo vai trò — thước cho dòng 4–5 của năm dòng số (T0)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 10: SKILL feature-loop khai args mới và minh bạch carry

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` — dòng `2. Invoke: \`Workflow({ scriptPath: '<WORKFLOWS_DIR>/acceptance-verify.js', args: { ... } })\``; đoạn «Mọi verdict» câu `Kết quả có \`carried\` không rỗng (Đợt 5) → ... ghi RÕ round này carry gì: evals (P1), panels (P3), baseli...`.
- Test: `tests/workflows/skill-claims.test.mjs` — xem file đó ghim câu nào của SKILL (grep `Invoke:`); nếu có case ghim danh sách args, cập nhật kỳ vọng.

- [ ] **Step 1: Sửa dòng Invoke**

Thêm `vungVat?, ngoaiVatGlobs?, carriedFindings?` vào danh sách args (sau `evalsHash?`), và thêm vào ngoặc debug: `dryRun` nay trả thêm `finders` + `vungVat`.

- [ ] **Step 2: Sửa đoạn «Mọi verdict»**

Sau `baseline (P2)` trong câu liệt kê carry, thêm ` · findings ngoài hợp đồng (T5 — mục mang «(r<N>)» trong review-findings.md, không chấm lại)`. Thêm một câu ngay sau: `Kết quả có \`boNgoaiVat\` không rỗng → báo user MỘT dòng «bỏ N finding ngoài vật: <file>» (không phải lỗi, là bộ lọc T2 làm đúng việc).`

- [ ] **Step 3: Chạy** — `node tests/workflows/skill-claims.test.mjs && bash tests/plugins/run-tests.sh 2>&1 | tail -3` → PASS (nếu skill-claims ghim danh sách args, cập nhật case kèm chú thích T2/T5).

- [ ] **Step 4: Commit**

```bash
git add feature-loop/skills/feature-loop/SKILL.md tests/workflows/skill-claims.test.mjs
git commit -m "docs(feature-loop): SKILL khai args vungVat/ngoaiVatGlobs/carriedFindings, minh bạch carry finding và bộ lọc ngoài vật

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Kết thúc — kiểm toàn bộ trước khi trả về vòng

- [ ] `bash tests/workflows/run-tests.sh && bash tests/scripts/run-tests.sh && bash tests/plugins/run-tests.sh` — cả ba xanh.
- [ ] `bash scripts/pre-merge-check.sh` (nếu repo dùng) — xanh.
- [ ] Đối chiếu spec §Số trước/sau: chưa có số «sau» — đúng thiết kế; số đến ở mốc 2.13 qua T0.

---

## Cập nhật sau gap-probe (14/09) — 5 finding, áp vào task nào

Bộ artifact đã sửa one-pass; plan giữ nguyên 10 task, mỗi task nhận thêm assert dưới đây.
Mỗi mục là **thêm**, không thay — các Step đã viết ở trên vẫn đúng.

| # | Task | Thêm gì |
|---|---|---|
| F4 | **Task 1** (W40) | Bốn assert ghim thông điệp: (i) thứ tự bằng **chỉ số call** (`calls.findIndex('triage') < min(chỉ số mọi refute)`) — không suy từ số lượng; (ii) prompt synthesize chứa câu mở đầu mới và KHÔNG chứa «là thật» trong khối ngoài hợp đồng; (iii) hai mục ngoài hợp đồng KHÔNG dưới heading «chưa adversarial-verify» (heading vắng hoặc rỗng); (iv) prompt `triage` không còn câu tuyên finding đã được xác nhận là lỗi thật. Mutant: đổi `khongBacBo` thành `unverified` → (iii) đỏ |
| F2 | **Task 3** (s4-args) | `laNgoaiVat` nhận thêm tập **file được khai trong `paths` của mọi eval trong `evals.yaml` của vòng** — chúng Ở LẠI vùng vật/delta bất kể đuôi (chống fail-open: fixture .md đổi mà eval được carry xanh cũ). `s4-args` đã đọc `evals` nên danh sách có sẵn; truyền thêm vào `ngoaiVatGlobs`? KHÔNG — đây là tập LOẠI TRỪ khỏi loại trừ: hàm `laNgoaiVat(f)` trả false ngay khi `f` nằm trong tập `pathsKhai`. **VV5**: fixture đổi một .md trong thư mục hồ sơ CÓ tên trong evals.yaml → có trong `deltaFiles`; .md không khai → không có |
| F1 | **Task 3 + Task 4** | **VV4** (trong `s4-args-vung-vat.test.mjs`): tệp args do `s4-args` THẬT sinh phải mang `ngoaiVatGlobs`; đem khớp bằng **cùng hàm `globToRe`** mà workflow dùng → khớp văn bản hồ sơ và tài liệu, không khớp mã răng / `_acceptance/config.yaml`. **W41 chiều im** nạp `vungVat`/`ngoaiVatGlobs` **từ tệp args đó** (đọc JSON trong test), không gõ tay khuôn bên đọc — round-trip writer→reader |
| F3 | **Task 8** (baseline) | **W44c** chiều DƯƠNG: responder baseline trả **muộn** (deferred, mở khoá sau khi triage đã gọi) và trả một eval xanh-cả-hai-phía → `result.nonDiscriminating` chứa id eval đó **và** payload synthesize mang trạng thái baseline của nó. Mutant bỏ `await baselineP` ở điểm muộn → W44c đỏ với thông điệp ghim «nonDiscriminating rỗng dù baseline đã trả về». Không kết luận bằng hết-giờ |
| F5 | **Task 9** (wf-usage) | JSON thêm `agentsKhongCoThoiGian` (đếm agent không đọc được thời gian). **U06b**: agent không có timestamp → `startAt`/`endAt` rỗng, không vào `byRole`, script exit 0 **nhưng** số đếm tăng. **U06c**: chạy trên thư mục transcript **THẬT** — mẫu cắt gọn commit vào `tests/scripts/fixtures/wf-transcript-that/` kèm dòng ghi nguồn `run_id` — ≥1 agent có `startAt` hợp lệ, `wallSeconds > 0`, `agentsKhongCoThoiGian === 0` |
| cross-check | **Task 6** (run-log) | W42 ghim **đủ 12 trường** bằng danh sách viết trước (thiếu một trường là đỏ) + **tính duy nhất** theo khoá `file :: title`. Thêm ca: chạy `round-tally-read.mjs`, `loop-health.mjs`, `recheck-evidence.cjs` trên một sổ CÓ dòng `kind: finding` → không ném lỗi, kết quả không đổi so với sổ không có dòng đó |
| cross-check | **Task 7** (carry) | W43 ghim **cả `bugs` lẫn `measurement`** có tiền tố deltaFiles (không chỉ `bugs`). DV10 dựng dòng `finding` bằng cách **rút từ khối marker FINDING-LINE của workflow** rồi cho `carry-plan` đọc lại — round-trip, không gõ tay khuôn bên đọc |

**Thứ tự không đổi.** Cụm 2 (Task 3–5) nay phụ thuộc chặt hơn: VV4 phải chạy trước khi W41 nạp args thật, nên làm Task 3 trọn vẹn rồi mới Task 4.
