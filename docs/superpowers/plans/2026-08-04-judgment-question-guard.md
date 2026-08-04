# judgment-question-guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `acceptance-verify.js` dừng fail-closed và gọi tên chỗ thiếu khi một eval khai thiếu field mà prompt fan-out phụ thuộc; riêng judgment thiếu `inputs` hạ về UNCERTAIN cơ học thay vì để hội đồng chấm mù.

**Architecture:** Một bảng field bắt buộc khai báo giữa cặp marker trong chính `acceptance-verify.js` (test RÚT bảng từ marker, không chép tay). Một vòng kiểm thuần JS chạy trên `args.evals` NGUYÊN BỘ, đặt TRƯỚC mọi lọc carry-forward và TRƯỚC `dryRun` return — vị trí này là toàn bộ lý do guard đóng được 3 cửa hậu. Hai mức nặng: hỏng khuôn → `return BLOCKED` 0 agent; judgment `inputs` vắng/rỗng → loại khỏi fan-out và khỏi carried, chèn panel `UNCERTAIN` cơ học.

**Tech Stack:** JavaScript thuần (Workflow sandbox: KHÔNG `fs`, KHÔNG `Date`, KHÔNG `import`). Test: `tests/workflows/harness.mjs` nạp file thật trong `vm` realm với agent đóng hộp; Node built-in `assert` không dùng — dùng `check()` của harness.

## Global Constraints

- Script chạy trong Workflow sandbox: **cấm** `Date.now()`, `new Date()`, `Math.random()`, `require`, `import`, mọi API filesystem. Timestamp đến từ `args.invokedAt`.
- Chuỗi trong `acceptance-verify.js` viết **ASCII không dấu** (theo toàn bộ file hiện có, vd `'args.evals / args.suiteCommands phai la array'`). Comment tiếng Việt CÓ dấu là bình thường trong file này.
- `plugins/` là build mirror sinh máy. Sửa `feature-loop/` xong **PHẢI** chạy `bash scripts/sync-plugin-packages.sh` và commit mirror cùng lượt.
- Repo cấm nới thước để test cũ xanh lại. 4 fixture cũ dùng `inputs: []` phải SỬA cho khớp hành vi mới, không được đổi hành vi cho vừa fixture.
- Mọi assertion âm tính phải có đối chứng dương cùng harness + ghim đúng thông điệp, không chỉ ghim verdict.
- Đường dẫn trong test suy từ `path.dirname(fileURLToPath(import.meta.url))` — file test đã có sẵn hằng `HERE` và `WF`, dùng lại.

## File Structure

| File | Trách nhiệm |
|---|---|
| `feature-loop/workflows/acceptance-verify.js` | Bảng field trong marker + vòng kiểm + nhánh UNCERTAIN + siết prompt hội đồng |
| `tests/workflows/acceptance-verify.test.mjs` | 16 ca đo mới (W-G*), sửa 4 fixture cũ |
| `_acceptance/judgment-question-guard/evidence/judge-prompt.txt` | Bản dump prompt hội đồng do test sinh — input của eval E10 |
| `plugins/**` | Mirror, sinh bằng script, không sửa tay |

---

### Task 1: Bảng field bắt buộc + vòng kiểm hỏng-khuôn

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — chèn sau dòng định nghĩa `agentT` (hiện ~231), TRƯỚC comment `// ---- Đợt 5 carry-forward (P1/P2/P3)`
- Test: `tests/workflows/acceptance-verify.test.mjs` — thêm khối `W-G1..W-G5` trước dòng `summary('acceptance-verify');`

**Interfaces:**
- Consumes: `args.evals` (mảng đã parse do skill truyền), `log` (global harness)
- Produces: hằng `EVAL_REQUIRED` giữa marker `<<<EVAL-REQUIRED-FIELDS` … `EVAL-REQUIRED-FIELDS>>>`; hai helper `isBlankStr(v) -> boolean`, `badStrArray(v) -> boolean`. Task 5 RÚT bảng này từ marker bằng regex.

- [ ] **Step 1: Viết ca đo trượt (5 hình dạng + shape trả về + tên field)**

Chèn trước `summary('acceptance-verify');`:

```js
// ── W-G1..: guard fail-loud cho field prompt fan-out phu thuoc ──────────────
const jOK = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?', inputs: ['/repo/a.md'] };
const BLOCK_SHAPE = ['blocked', 'failedEvals', 'failedCommands', 'panels', 'confirmedFindings', 'reviewIncomplete'];

console.log('W-G1 judgment thieu question: 5 hinh dang deu BLOCKED, neu ten eval + field');
{
  const shapes = [
    ['khoa vang', (e) => { delete e.question; }],
    ['null', (e) => { e.question = null; }],
    ['chuoi rong', (e) => { e.question = ''; }],
    ['khoang trang', (e) => { e.question = '   '; }],
    ['sai kieu', (e) => { e.question = 42; }],
  ];
  for (const [name, mutate] of shapes) {
    const bad = { ...jOK };
    mutate(bad);
    const { result, calls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, bad] }), responder());
    const reason = (result.blocked && result.blocked[0] && result.blocked[0].reason) || '';
    check(`W-G1 ${name} -> BLOCKED`, result.verdict === 'BLOCKED', result.verdict);
    check(`W-G1 ${name} neu ten eval E9`, /\bE9\b/.test(reason), reason);
    check(`W-G1 ${name} neu ten field question`, /question/.test(reason), reason);
    check(`W-G1 ${name} 0 judge spawn`, byLabel(calls, 'judge:').length === 0, String(byLabel(calls, 'judge:').length));
  }
  // doi chung DUONG: cung bo args, chi khac question la chuoi that
  const { result: ok, calls: okCalls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, jOK] }), responder());
  check('W-G1 doi chung duong: KHONG BLOCKED', ok.verdict !== 'BLOCKED', ok.verdict);
  check('W-G1 doi chung duong: 3 judge that su chay', byLabel(okCalls, 'judge:').length === 3, String(byLabel(okCalls, 'judge:').length));
}

console.log('W-G2 shape tra ve cua BLOCKED du key cho downstream');
{
  const bad = { ...jOK, question: '' };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, bad] }), responder());
  for (const k of BLOCK_SHAPE) {
    check(`W-G2 co key ${k} dung kieu mang`, Array.isArray(result[k]), `${k}=${JSON.stringify(result[k])}`);
  }
}
```

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G[12]"`
Expected: FAIL — `W-G1 khoa vang -> BLOCKED` báo `PASS` hoặc `PENDING-JUDGMENT` (đúng chính lỗ đang sửa), `W-G2` thiếu key.

- [ ] **Step 3: Thêm bảng field + vòng kiểm vào script**

Trong `feature-loop/workflows/acceptance-verify.js`, chèn NGAY SAU dòng `const agentT = (prompt, opts) => agent(...)` và TRƯỚC comment `// ---- Đợt 5 carry-forward`:

```js
// Bảng field bắt buộc theo executor — field mà prompt fan-out nội suy thẳng vào.
// Thiếu = agent nhận "undefined"/chuỗi rỗng làm đề bài rồi vẫn trả PASS (false-green
// đo được ở motion-floor r1-r2). Test RÚT bảng này từ marker, KHÔNG chép tay.
// judgment `inputs` CỐ Ý không nằm đây: vắng/rỗng đi nhánh UNCERTAIN (Task 2),
// chỉ SAI KIỂU mới là hỏng khuôn.
// <<<EVAL-REQUIRED-FIELDS
const EVAL_REQUIRED = {
  'test': { str: ['id', 'criterion', 'cmd'], arr: [] },
  'script': { str: ['id', 'criterion', 'cmd'], arr: [] },
  'ui-check': { str: ['id', 'criterion', 'expected'], arr: ['steps'] },
  'judgment': { str: ['id', 'criterion', 'question'], arr: [] },
}
// EVAL-REQUIRED-FIELDS>>>

const isBlankStr = v => typeof v !== 'string' || !v.trim()
const badStrArray = v => !Array.isArray(v) || !v.length || v.some(x => isBlankStr(x))

// Kiểm NGUYÊN BỘ args.evals — trước mọi lọc carry-forward, trước dryRun. Soi
// "tươi" thôi là tự mở lại đúng cửa hậu vừa đóng (panel carried của E6).
const evalProblems = []
args.evals.forEach((e, i) => {
  const nm = (e && typeof e.id === 'string' && e.id.trim()) ? e.id.trim() : `#${i} (khong co id)`
  if (!e || typeof e !== 'object') { evalProblems.push(`${nm}: khong phai object`); return }
  const spec = typeof e.executor === 'string' ? EVAL_REQUIRED[e.executor] : null
  if (!spec) {
    evalProblems.push(`${nm}: executor ${e.executor === undefined ? 'VANG' : JSON.stringify(e.executor)} khong thuoc {test, script, ui-check, judgment} — eval nay se bi bo roi im lang`)
    return
  }
  for (const f of spec.str) if (isBlankStr(e[f])) evalProblems.push(`${nm}: thieu field "${f}"`)
  for (const f of spec.arr) if (badStrArray(e[f])) evalProblems.push(`${nm}: field "${f}" phai la mang chuoi khong rong`)
  if (e.executor === 'judgment' && e.inputs !== undefined && e.inputs !== null) {
    if (!Array.isArray(e.inputs)) evalProblems.push(`${nm}: field "inputs" phai la mang`)
    else if (e.inputs.some(v => isBlankStr(v))) evalProblems.push(`${nm}: field "inputs" co phan tu khong phai chuoi`)
  }
})
if (evalProblems.length) {
  log(`evals.yaml khai thieu ${evalProblems.length} cho — BLOCKED truoc khi fan-out`)
  return {
    verdict: 'BLOCKED',
    blocked: [{ cmd: '(evals)', reason: `evals.yaml khai thieu field bat buoc — sua file roi chay lai CUNG round nay: ${evalProblems.join(' ; ')}` }],
    failedEvals: [], failedCommands: [], panels: [], confirmedFindings: [], reviewIncomplete: [],
  }
}
```

- [ ] **Step 4: Chạy để xác nhận XANH**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G[12]|FAIL"`
Expected: mọi dòng `W-G1`/`W-G2` là PASS; không dòng FAIL nào mới.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs && git commit -m "feat(acceptance-verify): bảng field bắt buộc + guard hỏng-khuôn fail-closed trước fan-out"
```

---

### Task 2: Nhánh chưa-đủ-căn-cứ cho judgment thiếu `inputs`

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — khối phân loại (~243-251), `dryRun` return (~262), `panels` (~595)
- Modify: `tests/workflows/acceptance-verify.test.mjs` — 4 fixture cũ dòng 190, 252, 336, 337
- Test: `tests/workflows/acceptance-verify.test.mjs` — khối `W-G3`

**Interfaces:**
- Consumes: `judgmentEvals`, `carriedPanels`, `freshJudgmentEvals` từ khối phân loại có sẵn
- Produces: `Set` tên `ungroundedIds`; panel object thêm cờ `ungrounded: true` (Task 4 và synthesize prompt đọc cờ này)

- [ ] **Step 1: Sửa 4 fixture cũ trước (chúng mã hoá hành vi CŨ)**

Bốn chỗ đang khai `inputs: []` cho judgment eval — đó chính là ca "hội đồng chấm khi chưa ai khai vật đọc". Sửa thành input thật để chúng tiếp tục đo đúng thứ chúng sinh ra để đo (model routing, carried panels), KHÔNG phải đo tính rỗng:

```
dòng 190: { id: 'E9',  ..., question: 'q',   inputs: [] }  →  inputs: ['/repo/x.md']
dòng 252: { id: 'E9',  ..., question: 'q',   inputs: [] }  →  inputs: ['/repo/x.md']
dòng 336: { id: 'E9',  ..., question: 'q9',  inputs: [] }  →  inputs: ['/repo/x9.md']
dòng 337: { id: 'E10', ..., question: 'q10', inputs: [] }  →  inputs: ['/repo/x10.md']
```

- [ ] **Step 2: Viết ca đo trượt cho nhánh UNCERTAIN**

```js
console.log('W-G3 judgment thieu inputs: UNCERTAIN co hoc, KHONG BLOCKED, 0 judge');
{
  const noInputs = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?' };
  const emptyInputs = { ...noInputs, id: 'E8', criterion: 'AC-8', inputs: [] };
  const { result, calls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, noInputs, emptyInputs] }), responder());
  check('W-G3 KHONG BLOCKED', result.verdict !== 'BLOCKED', result.verdict);
  check('W-G3 verdict PENDING-JUDGMENT', result.verdict === 'PENDING-JUDGMENT', result.verdict);
  check('W-G3 0 judge spawn', byLabel(calls, 'judge:').length === 0, String(byLabel(calls, 'judge:').length));
  const p9 = (result.panels || []).find(p => p.evalId === 'E9');
  const p8 = (result.panels || []).find(p => p.evalId === 'E8');
  check('W-G3 panel E9 UNCERTAIN', !!p9 && p9.proposal === 'UNCERTAIN', JSON.stringify(p9));
  check('W-G3 panel E8 (mang rong) UNCERTAIN', !!p8 && p8.proposal === 'UNCERTAIN', JSON.stringify(p8));
  const sp = byLabel(calls, 'synthesize')[0].prompt;
  check('W-G3 synthesize nhan ly do khong khai input', /khong khai input/.test(sp), 'thieu ly do trong payload panel');

  // doi chung PHAN BIET: inputs SAI KIEU van la hong khuon -> BLOCKED
  const wrongType = { ...noInputs, inputs: 'khong-phai-mang' };
  const { result: r2 } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, wrongType] }), responder());
  check('W-G3 inputs sai kieu -> BLOCKED', r2.verdict === 'BLOCKED', r2.verdict);
  check('W-G3 inputs sai kieu neu ten field', /inputs/.test(r2.blocked[0].reason), r2.blocked[0].reason);
  const nonStr = { ...noInputs, inputs: [{ a: 1 }] };
  const { result: r3 } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, nonStr] }), responder());
  check('W-G3 inputs co phan tu khong phai chuoi -> BLOCKED', r3.verdict === 'BLOCKED', r3.verdict);
}
```

- [ ] **Step 3: Chạy để xác nhận ĐỎ**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G3"`
Expected: FAIL — `W-G3 0 judge spawn` báo `3` hoặc `6` (hôm nay hội đồng vẫn chấm), `panel E9 UNCERTAIN` sai vì responder trả PASS.

- [ ] **Step 4: Cài nhánh UNCERTAIN**

Trong khối phân loại, NGAY SAU `const judgmentEvals = args.evals.filter(e => e.executor === 'judgment')`:

```js
// Thiếu căn cứ ≠ hỏng khuôn: câu hỏi hỏi được nhưng chưa khai vật để đọc.
// Không spawn judge (họ sẽ phán từ hư không); chèn panel UNCERTAIN cơ học →
// routing đẩy PENDING-JUDGMENT → người quyết ở Gate 2. Đây cũng là đường
// đọc-cũ cho workspace đã ký khai judgment không có inputs.
const ungroundedIds = new Set(judgmentEvals.filter(e => !Array.isArray(e.inputs) || !e.inputs.length).map(e => e.id))
```

Sửa hai bộ lọc để cửa hậu không mở lại:

```js
// carriedPanels: THÊM điều kiện && !ungroundedIds.has(p.evalId)
const carriedPanels = (Array.isArray(args.carriedPanels) ? args.carriedPanels : []).filter(p =>
  p && typeof p.evalId === 'string' && judgmentEvals.some(e => e.id === p.evalId)
  && !ungroundedIds.has(p.evalId)
  && (p.proposal === 'PASS' || p.proposal === 'FAIL' || p.proposal === 'UNCERTAIN'))
const carriedPanelIds = new Set(carriedPanels.map(p => p.evalId))
// freshJudgmentEvals: THÊM điều kiện && !ungroundedIds.has(e.id)
const freshJudgmentEvals = judgmentEvals.filter(e => !carriedPanelIds.has(e.id) && !ungroundedIds.has(e.id))
```

Trong `dryRun` return, thêm một dòng sau `uiCheckEvals`:

```js
    ungroundedJudgments: [...ungroundedIds],
```

Trong guard "không có gì để verify" (~296), `freshJudgmentEvals` đã loại ungrounded nên round chỉ có eval ungrounded + suite rỗng sẽ BLOCKED — đúng ý (không có gì tươi để verify). Giữ nguyên, không sửa.

Trong khối `const panels = [...]` (~595), thêm nhánh thứ ba:

```js
const panels = [
  ...freshPanels,
  ...carriedPanels.map(p => ({ /* GIỮ NGUYÊN nội dung hiện có */ })),
  ...[...ungroundedIds].map(id => ({
    evalId: id, proposal: 'UNCERTAIN', votes: [], ungrounded: true,
    note: 'eval khong khai input nao — may khong co can cu de phan, nguoi quyet o Cong 2',
  })),
]
```

Trong map trả về (~708) giữ cờ cho lớp tiêu thụ:

```js
  panels: panels.map(p => ({ evalId: p.evalId, proposal: p.proposal,
    ...(p.carried ? { carried: true, fromRound: p.fromRound } : {}),
    ...(p.ungrounded ? { ungrounded: true, note: p.note } : {}) })),
```

Trong prompt synthesize, THÊM đúng một câu ngay sau đoạn mô tả panel carried (trước `${JSON.stringify(panels)}`):

```
Panel co "ungrounded": true = eval KHONG khai input nao nen KHONG hoi doan nao duoc cham: ghi ro "khong khai input — may khong co can cu, nguoi quyet o Cong 2" va de human_override TRONG; TUYET DOI khong ghi no nhu mot muc da dat.
```

- [ ] **Step 5: Chạy để xác nhận XANH**

Run: `bash tests/workflows/run-tests.sh 2>&1 | tail -5`
Expected: `Results: all workflow tests passed` — cả W-G3 lẫn 4 ca cũ đã sửa fixture.

- [ ] **Step 6: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs && git commit -m "feat(acceptance-verify): judgment thiếu inputs hạ về UNCERTAIN cơ học thay vì chấm mù"
```

---

### Task 3: Ghim 3 cửa hậu — carried P1, carried P3, dryRun

**Files:**
- Test: `tests/workflows/acceptance-verify.test.mjs` — khối `W-G4`

**Interfaces:**
- Consumes: guard của Task 1 + `ungroundedIds` của Task 2. Task này KHÔNG sửa script — nó chứng minh vị trí đặt guard là đúng, và sẽ đỏ ngay nếu ai đó dời guard xuống sau các bộ lọc.

- [ ] **Step 1: Viết ca đo cho cả 3 cửa hậu, cả hai nhánh nặng**

```js
console.log('W-G4 3 cua hau khong mien kiem: carriedPanels, carriedEvals, dryRun');
{
  // (a) hong khuon + carriedPanels tro dung eval do  -> van BLOCKED
  const badJ = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: '' };
  const cp = { evalId: 'E9', proposal: 'PASS', votes: [{ lens: 'domain-correctness', verdict: 'PASS' }], fromRound: 2 };
  const { result: a } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, badJ], carriedPanels: [cp] }), responder());
  check('W-G4a panel carried KHONG mien kiem hong khuon', a.verdict === 'BLOCKED', a.verdict);
  check('W-G4a neu ten E9', /\bE9\b/.test(a.blocked[0].reason), a.blocked[0].reason);
  // doi chung DUONG: question hop le + carried -> dung lai panel, 0 judge
  const okJ = { ...badJ, question: 'ro rang?', inputs: ['/repo/a.md'] };
  const { result: a2, calls: a2c } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, okJ], carriedPanels: [cp] }), responder());
  check('W-G4a doi chung duong: KHONG BLOCKED', a2.verdict !== 'BLOCKED', a2.verdict);
  check('W-G4a doi chung duong: 0 judge (panel carried dung lai)', byLabel(a2c, 'judge:').length === 0);
  check('W-G4a doi chung duong: panel giu proposal goc PASS', (a2.panels.find(p => p.evalId === 'E9') || {}).proposal === 'PASS');

  // (b) hong khuon + carriedEvals tro dung eval may do -> van BLOCKED
  const badM = { id: 'E7', criterion: 'AC-7', executor: 'test', ref: 'config:executors.test.api' };
  const ce = { id: 'E7', runId: 'r-abc123', fromRound: 2, verifiedAt: '2026-08-01T00:00:00Z', cmd: 'pnpm test' };
  const { result: b } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, badM], carriedEvals: [ce] }), responder());
  check('W-G4b eval carried KHONG mien kiem', b.verdict === 'BLOCKED', b.verdict);
  check('W-G4b neu ten E7 + field cmd', /\bE7\b/.test(b.blocked[0].reason) && /cmd/.test(b.blocked[0].reason), b.blocked[0].reason);

  // (c) dryRun + eval hong -> BLOCKED, KHONG tra ke hoach
  const { result: c, calls: cc } = await runWorkflow(WF, baseArgs({ dryRun: true, evals: [...baseArgs().evals, badJ] }), responder());
  check('W-G4c dryRun + eval hong -> BLOCKED', c.verdict === 'BLOCKED', c.verdict);
  check('W-G4c KHONG tra ke hoach fan-out', c.distinctCommands === undefined && c.judgePanels === undefined, JSON.stringify(Object.keys(c)));
  check('W-G4c 0 agent', cc.length === 0, String(cc.length));
  // doi chung DUONG: dryRun voi evals hop le van tra ke hoach day du
  const { result: c2 } = await runWorkflow(WF, baseArgs({ dryRun: true, evals: [...baseArgs().evals, okJ] }), responder());
  check('W-G4c doi chung duong: ke hoach van day du', Array.isArray(c2.distinctCommands) && c2.judgePanels.length === 1, JSON.stringify(c2.judgePanels));

  // (d) nhanh UNCERTAIN cung phai song qua carried + dryRun (AC-13)
  const noIn = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?' };
  const cpPass = { evalId: 'E9', proposal: 'PASS', votes: [{ lens: 'domain-correctness', verdict: 'PASS' }], fromRound: 2 };
  const { result: d, calls: dc } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, noIn], carriedPanels: [cpPass] }), responder());
  check('W-G4d panel carried KHONG ghi de duoc nhanh UNCERTAIN', (d.panels.find(p => p.evalId === 'E9') || {}).proposal === 'UNCERTAIN', JSON.stringify(d.panels));
  check('W-G4d 0 judge', byLabel(dc, 'judge:').length === 0);
  const { result: d2 } = await runWorkflow(WF, baseArgs({ dryRun: true, evals: [...baseArgs().evals, noIn] }), responder());
  check('W-G4d dryRun KHONG liet eval khong can cu vao judgePanels', !(d2.judgePanels || []).some(x => x.eval === 'E9'), JSON.stringify(d2.judgePanels));
  check('W-G4d dryRun neu ro no thuoc dien khong can cu', (d2.ungroundedJudgments || []).includes('E9'), JSON.stringify(d2.ungroundedJudgments));
}
```

- [ ] **Step 2: Chạy — phải XANH ngay nếu Task 1/2 đặt guard đúng chỗ**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G4"`
Expected: tất cả PASS. Nếu có ca đỏ → guard đang bị đặt SAU một bộ lọc; sửa vị trí ở Task 1/2, không sửa test.

- [ ] **Step 3: Đối chứng đột biến — dời guard xuống là phải đỏ**

Chạy tay một lần để chứng minh ca đo có răng (KHÔNG commit thay đổi này):

```bash
cp feature-loop/workflows/acceptance-verify.js /tmp/av-backup.js
```

Dời khối `if (evalProblems.length) { return ... }` xuống NGAY SAU `if (args.dryRun) { return {...} }`, chạy lại test, xác nhận `W-G4c` đỏ. Rồi khôi phục:

```bash
cp /tmp/av-backup.js feature-loop/workflows/acceptance-verify.js && rm /tmp/av-backup.js
```

- [ ] **Step 4: Commit**

```bash
git add tests/workflows/acceptance-verify.test.mjs && git commit -m "test(acceptance-verify): ghim 3 cửa hậu — carried P1/P3 và dryRun không miễn kiểm"
```

---

### Task 4: Nhiều lỗi nêu đủ tên (bằng TẬP, không đếm chuỗi con)

**Files:**
- Test: `tests/workflows/acceptance-verify.test.mjs` — khối `W-G5`

**Interfaces:**
- Consumes: `evalProblems.join(' ; ')` của Task 1. Nếu Task 1 gom lỗi rồi chỉ nêu đại diện thì task này đỏ.

- [ ] **Step 1: Viết ca đo dùng cặp id lồng tiền tố**

```js
console.log('W-G5 nhieu eval hong: neu DU ten, so bang TAP khong bang dem chuoi con');
{
  const bad1 = { id: 'E1x', criterion: 'AC-1', executor: 'judgment', question: '' };
  const bad11 = { id: 'E1x1', criterion: 'AC-2', executor: 'ui-check', expected: 'ok' }; // thieu steps
  const bad3 = { id: 'E3y', criterion: 'AC-3', executor: 'script' };                      // thieu cmd
  const { result } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, bad1, bad11, bad3] }), responder());
  const reason = result.blocked[0].reason;
  // trich id theo RANH GIOI TOKEN — E1x KHONG duoc khop ben trong E1x1
  const ids = new Set((reason.match(/\bE\d+[a-z]?\d*\b/g) || []).filter(t => ['E1x', 'E1x1', 'E3y'].includes(t)));
  check('W-G5 tap id BANG DUNG tap da tiem', ids.size === 3 && ['E1x', 'E1x1', 'E3y'].every(i => ids.has(i)), [...ids].join(','));
  const fields = new Set(['question', 'steps', 'cmd'].filter(f => new RegExp(`"${f}"`).test(reason)));
  check('W-G5 tap field BANG DUNG tap da tiem', fields.size === 3, [...fields].join(','));
}

console.log('W-G6 executor la/vang bi CHAN — hom nay bi bo roi im lang');
{
  const typo = { id: 'E2t', criterion: 'AC-2', executor: 'judgement', question: 'typo executor', inputs: ['/a.md'] };
  const noX = { id: 'E3n', criterion: 'AC-3', expected: 'khong khai executor' };
  const { result } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, typo, noX] }), responder());
  check('W-G6 BLOCKED', result.verdict === 'BLOCKED', result.verdict);
  const reason = result.blocked[0].reason;
  check('W-G6 neu ten ca hai eval', /\bE2t\b/.test(reason) && /\bE3n\b/.test(reason), reason);
  check('W-G6 neu gia tri executor la', /judgement/.test(reason), reason);
  check('W-G6 neu executor VANG', /VANG/.test(reason), reason);
}
```

- [ ] **Step 2: Chạy để xác nhận XANH (guard Task 1 đã lo)**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G[56]"`
Expected: tất cả PASS.

- [ ] **Step 3: Đối chứng đột biến ĐINH cho W-G6 — bản trước guard phải PASS**

Chứng minh sự đảo chiều bằng CODE sinh trong lần chạy, thêm vào cuối khối W-G6:

```js
console.log('W-G6b doi chung dot bien: ban TRUOC guard tra PASS tren cung bo args');
{
  const { readFileSync, writeFileSync, mkdtempSync } = await import('node:fs');
  const os = await import('node:os');
  const src = readFileSync(WF, 'utf8');
  // go dung khoi guard (tu bang marker den het return BLOCKED) — sinh ban truoc-guard bang CODE
  const stripped = src.replace(/\/\/ <<<EVAL-REQUIRED-FIELDS[\s\S]*?failedEvals: \[\], failedCommands: \[\], panels: \[\], confirmedFindings: \[\], reviewIncomplete: \[\],\n\s*\}\n\}/, '');
  check('W-G6b buoc go guard THUC SU doi file', stripped.length < src.length - 500, `delta=${src.length - stripped.length}`);
  const dir = mkdtempSync(path.join(os.tmpdir(), 'av-preguard-'));
  const preWF = path.join(dir, 'acceptance-verify.js');
  writeFileSync(preWF, stripped);
  const typo = { id: 'E2t', criterion: 'AC-2', executor: 'judgement', question: 'typo', inputs: ['/a.md'] };
  const { result: pre } = await runWorkflow(preWF, baseArgs({ evals: [...baseArgs().evals, typo] }), responder());
  check('W-G6b ban truoc guard: eval typo bi bo roi im lang, verdict PASS', pre.verdict === 'PASS', pre.verdict);
  check('W-G6b ban truoc guard: blocked rong', (pre.blocked || []).length === 0);
}
```

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G6b"`
Expected: tất cả PASS — chứng minh guard là thứ tạo ra khác biệt, không phải test tự xanh.

- [ ] **Step 4: Commit**

```bash
git add tests/workflows/acceptance-verify.test.mjs && git commit -m "test(acceptance-verify): nêu đủ tên bằng tập + đối chứng đột biến bản trước guard"
```

---

### Task 5: Siết prompt hội đồng + dump prompt chính danh

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js:346` (prompt judge)
- Create: `_acceptance/judgment-question-guard/evidence/judge-prompt.txt`
- Test: `tests/workflows/acceptance-verify.test.mjs` — khối `W-G7`

**Interfaces:**
- Produces: file `evidence/judge-prompt.txt` — input của eval `E10` (hội đồng đọc ở S4). File này ĐƯỢC COMMIT; test sinh lại mỗi lần chạy và so khớp, nên prompt trôi mà quên dump lại là test đỏ.

- [ ] **Step 1: Viết ca đo trượt**

```js
console.log('W-G7 prompt hoi dong chan tu-cuu + dump chinh danh');
{
  const { readFileSync, existsSync, rmSync, mkdirSync } = await import('node:fs');
  const OUT = path.join(HERE, '..', '..', '_acceptance', 'judgment-question-guard', 'evidence', 'judge-prompt.txt');
  if (existsSync(OUT)) rmSync(OUT);
  const jOK2 = { id: 'E9', criterion: 'AC-9', executor: 'judgment', question: 'ro rang?', inputs: ['/repo/a.md', '/repo/b.md'] };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [...baseArgs().evals, jOK2] }), responder());
  const jp = byLabel(calls, 'judge:')[0].prompt;
  check('W-G7 prompt cam doc ngoai danh sach', /CHI duoc doc|KHONG duoc doc file nao khac/.test(jp), jp.slice(0, 200));
  check('W-G7 prompt noi ro thieu can cu thi tra UNCERTAIN', /UNCERTAIN/.test(jp) && /tu tim file khac|tu cuu/.test(jp), 'thieu ve tu-cuu');
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, jp);
  check('W-G7 dump duoc sinh trong chinh lan chay', existsSync(OUT));
  check('W-G7 dump BANG DUNG prompt cua lan chay', readFileSync(OUT, 'utf8') === jp);
  check('W-G7 dump chua id eval + inputs cua lan chay', /E9/.test(jp) && /\/repo\/a\.md/.test(jp) && /\/repo\/b\.md/.test(jp));
}
```

(Thêm `writeFileSync` vào danh sách import động ở dòng đầu khối.)

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G7"`
Expected: FAIL ở `prompt cam doc ngoai danh sach` — prompt hiện tại không có câu đó.

- [ ] **Step 3: Siết prompt**

Trong `feature-loop/workflows/acceptance-verify.js`, prompt judge (~346), thay đoạn `Doc cac input (abs path, da resolve san): ...` bằng:

```js
        `Ban la judge DOC LAP, context sach, lens duy nhat: ${lens}. BLIND: KHONG doc diff, KHONG doc reasoning cua nguoi code.\nDoc persona tai ${args.personasPath}, ap persona hop lens.\nCHI duoc doc dung cac input sau (abs path, da resolve san) va file persona o tren — KHONG duoc doc file nao khac trong repo (contract.md, evals.yaml, source code... deu NGOAI danh sach): ${(e.inputs || []).join(' , ')}\nThay danh sach tren KHONG du can cu de phan → do la ly do tra UNCERTAIN, TUYET DOI KHONG phai ly do di tim file khac de tu cuu. Tu chon them mot artifact roi phan tu no la lam hong tinh doc lap cua hoi dong.\n\nCau hoi phan xet (${e.id} / ${e.criterion}): ${e.question}\n\nTra verdict PASS | FAIL | UNCERTAIN + rationale 1-3 cau. UNCERTAIN khi khong du can cu — dung doan.`,
```

- [ ] **Step 4: Chạy để xác nhận XANH + commit bản dump**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G7"`
Expected: tất cả PASS, và file `_acceptance/judgment-question-guard/evidence/judge-prompt.txt` tồn tại.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs _acceptance/judgment-question-guard/evidence/judge-prompt.txt && git commit -m "feat(acceptance-verify): hội đồng chỉ đọc input đã khai; đọc ngoài danh sách là lý do UNCERTAIN"
```

---

### Task 6: Tồn kho thật — 18 workspace qua bảng rút từ marker

**Files:**
- Test: `tests/workflows/acceptance-verify.test.mjs` — khối `W-G8`

**Interfaces:**
- Consumes: bảng `EVAL_REQUIRED` RÚT TỪ MARKER của Task 1 (không chép tay), `_acceptance/*/evals.yaml` thật

- [ ] **Step 1: Viết ca đo tồn kho + đột biến**

```js
console.log('W-G8 ton kho that: moi _acceptance/*/evals.yaml qua bang RUT TU MARKER');
{
  const { readFileSync, readdirSync, existsSync } = await import('node:fs');
  const ROOT = path.join(HERE, '..', '..');
  const src = readFileSync(WF, 'utf8');
  const m = src.match(/<<<EVAL-REQUIRED-FIELDS\n([\s\S]*?)\/\/ EVAL-REQUIRED-FIELDS>>>/);
  check('W-G8 rut duoc bang tu marker', !!m, 'marker khong khop — bang khong con o mot cho co dau moc');
  const TABLE = new Function(`${m[1]}; return EVAL_REQUIRED;`)();
  check('W-G8 bang co du 4 executor', Object.keys(TABLE).sort().join(',') === 'judgment,script,test,ui-check', Object.keys(TABLE).join(','));

  const parseEvals = (file) => {
    const out = []; let cur = null;
    for (const raw of readFileSync(file, 'utf8').split('\n')) {
      const idM = raw.match(/^\s*-\s*id:\s*(.+)$/);
      if (idM) { if (cur) out.push(cur); cur = { id: idM[1].trim(), _k: new Set(['id']) }; continue; }
      if (!cur) continue;
      const kv = raw.replace(/\s+$/, '').match(/^\s{2,}([a-z_]+):\s*(.*)$/);
      if (kv) { cur._k.add(kv[1]); cur[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, ''); }
    }
    if (cur) out.push(cur);
    return out;
  };
  const scan = (dir) => {
    const hard = [], soft = [];
    for (const slug of readdirSync(dir)) {
      const f = path.join(dir, slug, 'evals.yaml');
      if (!existsSync(f)) continue;
      for (const e of parseEvals(f)) {
        const spec = TABLE[e.executor];
        if (!spec) { hard.push(`${slug}/${e.id}: executor`); continue; }
        for (const fl of spec.str) if (!e._k.has(fl) || !String(e[fl] || '').trim()) hard.push(`${slug}/${e.id}: ${fl}`);
        for (const fl of spec.arr) if (!e._k.has(fl)) hard.push(`${slug}/${e.id}: ${fl}`);
        if (e.executor === 'judgment' && !e._k.has('inputs')) soft.push(`${slug}/${e.id}`);
      }
    }
    return { hard, soft };
  };
  const AC = path.join(ROOT, '_acceptance');
  const { hard, soft } = scan(AC);
  check('W-G8 sanity: quet duoc it nhat 10 workspace', readdirSync(AC).length >= 10, String(readdirSync(AC).length));
  check('W-G8 0 eval bi chan cung tren ton kho that', hard.length === 0, hard.join(' | '));
  check('W-G8 ca ha UNCERTAIN dung bang danh sach mien tru da khai',
    soft.sort().join(',') === 'gate-card-ac-visibility/E11,gate-card-ac-visibility/E12', soft.join(','));

  // dot bien: tiem field rong vao BAN SAO sinh trong chinh lan chay -> phai do
  const { mkdtempSync, mkdirSync, writeFileSync, cpSync } = await import('node:fs');
  const os = await import('node:os');
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'inv-'));
  cpSync(AC, path.join(tmp, '_acceptance'), { recursive: true });
  const victim = path.join(tmp, '_acceptance', 'judgment-question-guard', 'evals.yaml');
  writeFileSync(victim, readFileSync(victim, 'utf8').replace(/^    criterion: AC-1$/m, '    criterion: '));
  const mut = scan(path.join(tmp, '_acceptance'));
  check('W-G8 dot bien: ban tiem field rong phai DO', mut.hard.length === 1, mut.hard.join(' | '));
  check('W-G8 dot bien: neu dung slug + id + field', /judgment-question-guard\/E1: criterion/.test(mut.hard[0] || ''), mut.hard[0]);
}
```

- [ ] **Step 2: Chạy**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W-G8"`
Expected: tất cả PASS. `0 eval bi chan cung` là con số đã đo ở S1; đỏ ở đây nghĩa là bảng field siết hơn tồn kho chịu được → quay lại quyết định hai-mức, KHÔNG nới bảng cho vừa.

- [ ] **Step 3: Commit**

```bash
git add tests/workflows/acceptance-verify.test.mjs && git commit -m "test(acceptance-verify): đo tồn kho thật 18 workspace qua bảng rút từ marker"
```

---

### Task 7: Đồng bộ mirror + suite toàn phần

**Files:**
- Modify: `plugins/**` (sinh máy, không sửa tay)

- [ ] **Step 1: Chạy toàn bộ suite**

```bash
bash tests/workflows/run-tests.sh && bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh
```

Expected: cả 4 in dòng kết luận `passed`, không suite nào exit khác 0.

- [ ] **Step 2: Sync mirror**

```bash
bash scripts/sync-plugin-packages.sh
```

- [ ] **Step 3: Xác nhận cổng chống trôi xanh**

Run: `bash scripts/sync-plugin-packages.sh --check`
Expected: exit 0, không báo drift.

- [ ] **Step 4: Commit**

```bash
git add plugins/ && git commit -m "chore: sync plugins mirror sau guard judgment-question-guard"
```

---

## Self-Review

**Spec coverage** — 15 AC của contract ánh xạ hết:

| AC | Task |
|---|---|
| AC-1 (question, 5 hình dạng + shape trả về) | 1 |
| AC-2 (ui-check expected/steps) | 1 (bảng phủ) + 4 (W-G5 dùng `steps` thiếu) |
| AC-3 (cmd, id, criterion) | 1 + 4 |
| AC-4 (executor lạ/vắng + đột biến đinh) | 4 (W-G6, W-G6b) |
| AC-5 (carriedPanels) · AC-6 (carriedEvals) · AC-7 (dryRun) | 3 |
| AC-8 (nêu đủ tên bằng tập) | 4 |
| AC-9 (inputs → UNCERTAIN, sai kiểu → BLOCKED) | 2 |
| AC-10 (hội đồng đọc prompt) | 5 sinh input; hội đồng chấm ở S4 |
| AC-11 (đối chứng dương tổng, field optional) | 1 (W-G1 đối chứng dương) + 7 (suite cũ là đối chứng dương lớn nhất) |
| AC-12 (suite + mirror + 4 fixture cũ) | 2 (fixture) + 7 |
| AC-13 (nhánh UNCERTAIN qua carried + dryRun) | 3 (W-G4d) |
| AC-14 (tồn kho thật) | 6 |
| AC-15 (dump chính danh) | 5 |

**Placeholder scan** — không có "TBD"/"tương tự Task N"/"thêm validation phù hợp"; mọi bước code có khối mã thật.

**Type consistency** — `EVAL_REQUIRED` (Task 1) dùng đúng tên ở Task 6; `ungroundedIds` (Task 2) dùng đúng tên ở Task 3; `isBlankStr`/`badStrArray` khai một lần ở Task 1.

**Ghi chú thứ tự bắt buộc:** Task 1 → 2 → 3 là chuỗi phụ thuộc thật (3 đo vị trí guard của 1 và nhánh của 2). Task 5 độc lập với 1-3 nhưng đụng cùng file nên chạy tuần tự, KHÔNG fan-out worktree. Task 6 phụ thuộc marker của Task 1. Task 7 cuối cùng.

**Cạm bẫy đã biết:** eval `E10` của contract đọc `evidence/judge-prompt.txt` — file này phải được COMMIT ở Task 5, vì ở S4 hội đồng chạy SONG SONG với eval máy nên không thể trông chờ suite sinh ra nó kịp. Test sinh lại và so khớp mỗi lần chạy, nên prompt trôi mà quên dump lại sẽ đỏ.
