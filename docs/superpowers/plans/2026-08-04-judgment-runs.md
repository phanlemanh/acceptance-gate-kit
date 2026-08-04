# judgment-runs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Field khai trên eval mà máy bỏ qua (`runs` trên `judgment`/`ui-check`, `paths` trên `judgment`) phải nêu đích danh ở sáu mặt người đọc — mà không chặn và không chạy thêm agent nào.

**Architecture:** Một bảng luật `INERT_FIELD_TABLE` đặt giữa cặp marker trong `acceptance-verify.js` là nguồn duy nhất; hàm thuần `inertFieldReport(evals)` đọc bảng đó và trả danh sách ô inert. Từ danh sách ấy phái sinh bốn mặt: `result.inertFields`, một dòng `log()`, một dòng `run-log` `kind:"inert"`, và một câu literal `inertNote` mà synthesize chép nguyên văn vào `## Variance`. Câu literal đó lại là **hợp đồng chuỗi liên-file** với `scripts/gate-card.js` — hai file không import được nhau (script workflow chạy trong sandbox không có module), nên bài test round-trip writer→reader là mối nối duy nhất giữ chúng khớp.

**Tech Stack:** JavaScript thuần (ES2022), Node ≥18. Test chạy trong vm realm qua `tests/workflows/harness.mjs` — không sinh agent nào, không cần mạng.

## Global Constraints

- `feature-loop/workflows/acceptance-verify.js` chạy trong **Workflow sandbox**: KHÔNG có `fs`, KHÔNG có `import`/`require`, và `Date.now()`/`new Date()`/`Math.random()` **ném lỗi**. Mọi logic mới phải là JS thuần tự chứa; timestamp lấy từ `args.invokedAt`.
- Comment và chuỗi **bên trong `acceptance-verify.js`** viết **không dấu** (theo đúng phong cách sẵn có của file). Ngoại lệ DUY NHẤT: câu `inertNote` — nó đi tới mắt người ký nên viết tiếng Việt có dấu.
- Nguồn là `feature-loop/`, `skills/`, `scripts/`, `codex/`; `plugins/` là **build mirror** — sửa nguồn xong PHẢI chạy `bash scripts/sync-plugin-packages.sh` và commit mirror cùng lượt.
- Mọi case test mới phải có **đối chứng dương** (bản đúng phải xanh trước khi tin bản sai là đỏ) và phải **ghim đúng thông điệp**, không chỉ mã thoát.
- Mọi đường dẫn trong test suy từ `import.meta.url`, **không hardcode** đường dẫn tuyệt đối.
- Chạy suite bằng `bash tests/workflows/run-tests.sh` (toàn bộ), hoặc `node tests/workflows/acceptance-verify.test.mjs` (một file).

---

### Task 1: Bảng luật + hàm thuần `inertFieldReport`

Phục vụ **AC-1, AC-2, AC-3, AC-4, AC-7**. `independent: false` (mọi task sau phụ thuộc).

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — chèn ngay SAU khối phân loại eval (`uiEvals` được khai ở ~dòng 244), TRƯỚC khối `carriedPanels`
- Test: `tests/workflows/acceptance-verify.test.mjs` — thêm case `W20`–`W22` ở cuối file, trước `summary(...)`

**Interfaces:**
- Produces: `INERT_FIELD_TABLE` — mảng `{field: string, executor: string, reason: string}`, bọc giữa `// <<<INERT-FIELD-TABLE` và `// INERT-FIELD-TABLE>>>`
- Produces: `inertFieldReport(evals)` → `Array<{evalId, field, value, executor, reason}>`, thứ tự theo thứ tự eval trong `args.evals`, rồi theo thứ tự hàng của bảng
- Produces: biến cục bộ `const inertFields = inertFieldReport(args.evals)`

- [ ] **Step 1: Viết test thất bại — ma trận TOÀN PHẦN, bảng rút bằng marker**

Thêm vào cuối `tests/workflows/acceptance-verify.test.mjs`, ngay trước dòng `summary(...)`:

```js
console.log('W20 inertFieldReport: ma tran toan phan field x executor, bang rut bang marker');
{
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(WF, 'utf8');
  const m = /\/\/ <<<INERT-FIELD-TABLE([\s\S]*?)\/\/ INERT-FIELD-TABLE>>>/.exec(src);
  check('W20 bang nam giua cap marker', !!m);
  // Rut cap (field, executor) TU NGUON — khong chep tay bang vao test
  const declared = new Set();
  for (const row of (m ? m[1] : '').matchAll(/field:\s*'([a-z]+)'\s*,\s*executor:\s*'([a-z-]+)'/g)) {
    declared.add(row[1] + '|' + row[2]);
  }
  check('W20 bang rut ra khong rong', declared.size > 0, String(declared.size));

  const FIELDS = ['runs', 'paths'];
  const EXECS = ['test', 'script', 'ui-check', 'judgment'];
  const sample = (field) => (field === 'runs' ? 3 : ['src/x.js']);
  const evalFor = (field, executor) => {
    const base = { id: 'X1', criterion: 'AC-1', executor, expected: 'ok', [field]: sample(field) };
    if (executor === 'judgment') return { ...base, question: 'q?', inputs: ['/a.md'] };
    if (executor === 'ui-check') return { ...base, steps: ['open'] };
    return { ...base, cmd: 'pnpm test', ref: 'config:executors.test.api' };
  };

  let mismatches = [];
  for (const field of FIELDS) {
    for (const executor of EXECS) {
      const { result } = await runWorkflow(WF, baseArgs({
        evals: [evalFor(field, executor)], suiteCommands: ['npm run build'],
      }), responder());
      const fired = (result.inertFields || []).some(f => f.evalId === 'X1' && f.field === field);
      const want = declared.has(field + '|' + executor);
      if (fired !== want) mismatches.push(`${field}x${executor}: got ${fired}, want ${want}`);
    }
  }
  check('W20 hanh vi khop bang o CA 8 o', mismatches.length === 0, mismatches.join(' ; '));
}

console.log('W21 inertFieldReport: doi chung duong + noi dung muc');
{
  const jEval = (over = {}) => ({ id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], ...over });
  const { result: hit } = await runWorkflow(WF, baseArgs({ evals: [jEval({ runs: 3 })] }), responder());
  check('W21 judgment+runs:3 -> dung 1 muc', (hit.inertFields || []).length === 1, JSON.stringify(hit.inertFields));
  const it = (hit.inertFields || [])[0] || {};
  check('W21 muc neu dich danh evalId/field/value/executor',
    it.evalId === 'E9' && it.field === 'runs' && it.value === 3 && it.executor === 'judgment', JSON.stringify(it));
  check('W21 reason nhac co che panel 3-lens', /3-lens|3 lens/.test(String(it.reason || '')), String(it.reason));
  // DOI CHUNG DUONG: cung eval bo runs -> phai RONG (phep do phan biet duoc)
  const { result: clean } = await runWorkflow(WF, baseArgs({ evals: [jEval()] }), responder());
  check('W21 doi chung duong: bo runs -> inertFields RONG', (clean.inertFields || []).length === 0, JSON.stringify(clean.inertFields));
  // runs: 1 la mac dinh, khai ra vo hai -> KHONG bao
  const { result: one } = await runWorkflow(WF, baseArgs({ evals: [jEval({ runs: 1 })] }), responder());
  check('W21 runs:1 (mac dinh) KHONG bao', (one.inertFields || []).length === 0, JSON.stringify(one.inertFields));
}

console.log('W22 nua-KHONG-duoc-ban: field dung cho van chay nhu cu');
{
  const { result, calls } = await runWorkflow(WF, baseArgs({
    evals: [
      { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: './slow.sh', ref: 'config:executors.test.api', expected: 'ok', runs: 3, paths: ['a.js'] },
      { id: 'E2', criterion: 'AC-2', executor: 'ui-check', steps: ['open'], expected: 'ok', paths: ['b.js'] },
    ],
    suiteCommands: [],
  }), responder());
  check('W22 test+runs / ui-check+paths KHONG vao inertFields', (result.inertFields || []).length === 0, JSON.stringify(result.inertFields));
  check('W22 hoi quy: runs:3 tren test van sinh 3 agent machine',
    byLabel(calls, 'machine:').length === 3, String(byLabel(calls, 'machine:').length));
}
```

- [ ] **Step 2: Chạy test, xác nhận ĐỎ đúng lý do**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W2[012]"
```

Kỳ vọng: `W20 bang nam giua cap marker` FAIL (chưa có marker) và `W21 …` FAIL vì `result.inertFields` là `undefined`. Nếu thấy PASS ở đây thì test chưa chạy — kiểm lại đã lưu file chưa.

- [ ] **Step 3: Thêm bảng + hàm thuần vào `acceptance-verify.js`**

Chèn ngay sau dòng khai `const uiEvals = args.evals.filter(...)`:

```js
// ---- O INERT: field khai tren eval ma may KHONG dung. Khong chan, nhung khong im lang.
// Luat o eval-executors.md ("runs is ignored on ui-check/judgment") von co CHU Y — cai thieu
// truoc day la khong mat nao cua may chiu noi ra, nen 10/10 luot dung runs trong repo deu roi
// vao o inert ma khong ai biet. Them/bot mot o = sua DUNG bang duoi day, khong rai if o noi khac.
// <<<INERT-FIELD-TABLE
const INERT_FIELD_TABLE = [
  { field: 'runs', executor: 'judgment', reason: 'panel 3-lens da la co che hap thu nhieu da chon — runs khong duoc doc' },
  { field: 'runs', executor: 'ui-check', reason: 'ui-check luon chay dung 1 lan — buoc gop machine hardcode runs: 1' },
  { field: 'paths', executor: 'judgment', reason: 'carry-forward P1 chi nhan eval may/ui — judgment carry bang P3 inputs-hash' },
]
// INERT-FIELD-TABLE>>>
// Khi nao coi la "co khai": runs chi tinh khi >1 (runs:1 la mac dinh, khai ra vo hai);
// paths tinh khi la mang khong rong.
const INERT_DECLARED = {
  runs: v => Number.isInteger(v) && v > 1,
  paths: v => Array.isArray(v) && v.length > 0,
}
const inertFieldReport = (evals) => {
  const out = []
  for (const e of (Array.isArray(evals) ? evals : [])) {
    for (const row of INERT_FIELD_TABLE) {
      if (e.executor !== row.executor) continue
      const check = INERT_DECLARED[row.field]
      if (!check || !check(e[row.field])) continue
      out.push({ evalId: e.id, field: row.field, value: e[row.field], executor: e.executor, reason: row.reason })
    }
  }
  return out
}
const inertFields = inertFieldReport(args.evals)
```

- [ ] **Step 4: Đưa `inertFields` vào `result` để test đọc được**

Trong object `return { ... }` cuối file, thêm ngay dưới dòng `carried: {...}`:

```js
  // O inert: field khai tren eval ma may khong dung — main loop trinh o goi Cong 2 (SKILL "Moi verdict")
  inertFields,
```

- [ ] **Step 5: Chạy test, xác nhận XANH**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W2[012]|Results:"
```

Kỳ vọng: mọi dòng `W20`/`W21`/`W22` PASS, và tổng `Results:` không có `failed` nào tăng so với trước Task 1.

- [ ] **Step 6: Đối chứng đột biến — chứng minh W20 biết đỏ**

```bash
cp feature-loop/workflows/acceptance-verify.js /tmp/av-backup.js
sed -i '' "/field: 'paths', executor: 'judgment'/d" feature-loop/workflows/acceptance-verify.js
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep "W20 hanh vi khop bang"
cp /tmp/av-backup.js feature-loop/workflows/acceptance-verify.js
```

Kỳ vọng: dòng giữa in `FAIL: W20 hanh vi khop bang o CA 8 o (paths|judgment: got true, want false)`. Nếu nó PASS thì test không nối bảng với hành vi — dừng và sửa test trước khi đi tiếp.

- [ ] **Step 7: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs && git commit -m "feat(judgment-runs): bang luat o inert mot cho co marker + ham thuan inertFieldReport"
```

---

### Task 2: Dòng chạy trực tiếp + sổ chạy

Phục vụ **AC-6, AC-13**. `independent: false` (cần `inertFields` của Task 1).

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — dòng `log(...)` đặt cạnh dòng `log(\`Round ${args.round}: ...\`)`; dòng run-log đặt cạnh khối `if (typeof args.evalsHash === 'string' ...)`
- Test: `tests/workflows/acceptance-verify.test.mjs` — case `W23`

**Interfaces:**
- Consumes: `inertFields` (Task 1)
- Produces: dòng `runLog` JSON `{ts, round, kind: 'inert', fields: [{evalId, field, executor}]}` — **không có `run_id`**, nên `loadRunLogIds` bỏ qua như dòng `kind:"panel"`/`"baseline"`

- [ ] **Step 1: Viết test thất bại**

```js
console.log('W23 o inert: mot dong log + mot dong run-log kind:inert (khong run_id)');
{
  const jEval = (over = {}) => ({ id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], ...over });
  const { result, logs } = await runWorkflow(WF, baseArgs({ evals: [jEval({ runs: 3 })] }), responder());
  const hits = logs.filter(l => /field khai ma may khong dung/i.test(l));
  check('W23 dung MOT dong log', hits.length === 1, JSON.stringify(logs));
  check('W23 dong log neu ten eval va field', /E9/.test(hits[0] || '') && /runs/.test(hits[0] || ''), hits[0]);

  const inertLines = result.runLog.map(l => JSON.parse(l)).filter(l => l.kind === 'inert');
  check('W23 dung MOT dong run-log kind:inert', inertLines.length === 1, String(inertLines.length));
  check('W23 dong inert KHONG mang run_id', !('run_id' in inertLines[0]), JSON.stringify(inertLines[0]));
  check('W23 dong inert ghi round + cap (evalId, field, executor)',
    inertLines[0].round === 1
    && JSON.stringify(inertLines[0].fields) === JSON.stringify([{ evalId: 'E9', field: 'runs', executor: 'judgment' }]),
    JSON.stringify(inertLines[0]));

  // DOI CHUNG DUONG: khong eval inert -> khong dong nao, khong log nao
  const { result: c, logs: cl } = await runWorkflow(WF, baseArgs({ evals: [jEval()] }), responder());
  check('W23 doi chung duong: khong inert -> khong dong kind:inert',
    c.runLog.map(l => JSON.parse(l)).filter(l => l.kind === 'inert').length === 0);
  check('W23 doi chung duong: khong inert -> khong dong log nao',
    cl.filter(l => /field khai ma may khong dung/i.test(l)).length === 0);
}
```

- [ ] **Step 2: Chạy test, xác nhận ĐỎ**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep "W23"
```

Kỳ vọng: `W23 dung MOT dong log` FAIL với `[]`, và `W23 dung MOT dong run-log kind:inert` FAIL với `0`.

- [ ] **Step 3: Thêm dòng `log()`**

Ngay SAU câu lệnh `log(\`Round ${args.round}: ...\`)` (khối kết thúc bằng `(runBaseline ? '' : ' — baseline carried (P2)'))`), chèn:

```js
if (inertFields.length) log(`O inert: ${inertFields.length} field khai ma may khong dung — `
  + inertFields.map(f => `${f.evalId}.${f.field} (${f.executor})`).join(', '))
```

- [ ] **Step 4: Thêm dòng run-log**

Ngay SAU khối `if (typeof args.evalsHash === 'string' && args.evalsHash) { ... }`, chèn:

```js
// Dong bo ghi ben vung cho o inert. KHONG co run_id -> loadRunLogIds bo qua (cung khuon
// dong kind panel/baseline), nen consumer cu doc log nay khong vo.
if (inertFields.length) runLogLines.push(JSON.stringify({
  ts: invokedAt, round: args.round, kind: 'inert',
  fields: inertFields.map(f => ({ evalId: f.evalId, field: f.field, executor: f.executor })),
}))
```

- [ ] **Step 5: Chạy test, xác nhận XANH**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W23|Results:"
```

- [ ] **Step 6: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs && git commit -m "feat(judgment-runs): dong log truc tiep + dong run-log kind:inert cho o inert"
```

---

### Task 3: Câu `inertNote` do máy tính + chỉ dẫn chép nguyên văn

Phục vụ **AC-5**. `independent: false`.

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — dựng `inertNote` ngay sau khối run-log của Task 2; chèn chỉ dẫn vào prompt `synthesize:report`
- Test: `tests/workflows/acceptance-verify.test.mjs` — case `W24`

**Interfaces:**
- Consumes: `inertFields` (Task 1)
- Produces: `const inertNote` — chuỗi MỘT dòng, tiếng Việt có dấu, **bắt đầu bằng đúng cụm `Field khai mà máy không dùng:`**. Cụm mở đầu này là **hợp đồng chuỗi liên-file** với `scripts/gate-card.js` (Task 4) — hai file không import được nhau; Task 4 có bài round-trip giữ chúng khớp. Rỗng khi không có ô inert.

- [ ] **Step 1: Viết test thất bại**

```js
console.log('W24 inertNote: literal do JS tinh + chi dan chep nguyen van vao ## Variance');
{
  const jEval = (over = {}) => ({ id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], ...over });
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [jEval({ runs: 3 })] }), responder());
  const p = byLabel(calls, 'synthesize:report')[0].prompt;
  check('W24 prompt mang cum mo dau hop dong lien-file', /Field khai mà máy không dùng:/.test(p));
  check('W24 literal neu dich danh evalId + field + gia tri', /E9/.test(p) && /runs/.test(p) && /3/.test(p));
  check('W24 co chi dan chep NGUYEN VAN vao Variance', /NGUYEN VAN[\s\S]{0,200}Variance/.test(p) || /Variance[\s\S]{0,200}NGUYEN VAN/.test(p), 'khong thay chi dan');
  check('W24 literal KHONG bat dau bang "none" (reader loc /^none/i)', !/^\s*none/i.test(/Field khai mà máy không dùng:[^\n]*/.exec(p)[0]));

  // DOI CHUNG DUONG: khong eval inert -> prompt KHONG chua literal lan chi dan
  const { calls: c2 } = await runWorkflow(WF, baseArgs({ evals: [jEval()] }), responder());
  const p2 = byLabel(c2, 'synthesize:report')[0].prompt;
  check('W24 doi chung duong: khong inert -> prompt sach', !/Field khai mà máy không dùng/.test(p2));
}
```

- [ ] **Step 2: Chạy test, xác nhận ĐỎ**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep "W24"
```

Kỳ vọng: bốn dòng đầu FAIL; dòng đối chứng dương PASS ngay từ đầu (đúng — nó khẳng định trạng thái hiện tại).

- [ ] **Step 3: Dựng `inertNote`**

Ngay SAU khối run-log của Task 2, chèn:

```js
// Cau nay di THANG toi mat nguoi ky (muc ## Variance cua evidence-report, roi the Cong 2),
// nen viet tieng Viet CO DAU — khac phan con lai cua file. May tinh san va synthesize chi
// CHEP, cung khuon literal dang dung cho verified_commit.
// Cum mo dau "Field khai ma may khong dung:" la HOP DONG CHUOI LIEN-FILE voi
// scripts/gate-card.js (no bat cum nay de ban co dung loai). Doi cum nay = phai doi ca ben do;
// case round-trip W25 trong tests/workflows la moi noi giu hai ben khop.
// TUYET DOI khong mo dau bang chu "none" — reader loc /^none/i va se nuot mat canh bao.
const inertNote = inertFields.length
  ? 'Field khai mà máy không dùng: ' + inertFields.map(f =>
      `${f.evalId} khai \`${f.field}: ${Array.isArray(f.value) ? f.value.join(', ') : f.value}\` trên eval ${f.executor} — ${f.reason}`
    ).join(' · ') + '. Giá trị đó bị bỏ qua; muốn nó có tác dụng thì đổi executor hoặc bỏ field khỏi evals.yaml.'
  : ''
```

- [ ] **Step 4: Chèn chỉ dẫn vào prompt synthesize**

Trong template literal của `agentT` nhãn `synthesize:report`, tìm đoạn bắt đầu bằng `VARIANCE-N: eval co field "runs" > 1` và chèn NGAY TRƯỚC nó:

```js
${inertNote ? `O INERT (may da tinh san — CHEP NGUYEN VAN, khong tu viet lai, khong rut gon): section "## Variance" phai ket thuc bang DUNG cau sau, dat o DONG CUOI cua section (sau moi noi dung variance khac neu co). Neu section khong con noi dung nao khac thi cau nay la noi dung duy nhat cua section — TUYET DOI KHONG ghi "none" o tren no, vi the Cong 2 loc /^none/i va se nuot mat canh bao:\n${inertNote}\n` : ''}
```

- [ ] **Step 5: Chạy test, xác nhận XANH**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W24|Results:"
```

- [ ] **Step 6: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs && git commit -m "feat(judgment-runs): inertNote literal do may tinh + chi dan chep nguyen van vao ## Variance"
```

---

### Task 4: Cờ trên thẻ Cổng 2 + round-trip writer→reader

Phục vụ **AC-12**. `independent: false` (cần `inertNote` của Task 3).

**Files:**
- Modify: `scripts/gate-card.js:373` — tách khối cờ `Variance` thành hai nhánh
- Test: `tests/workflows/acceptance-verify.test.mjs` — case `W25`

**Interfaces:**
- Consumes: cụm mở đầu `Field khai mà máy không dùng:` từ Task 3
- Produces: cờ `fwarn` mới; cờ `fred` "Có eval ngẫu nhiên (pass-rate hỗn hợp)" **giữ nguyên** cho phần nội dung còn lại

- [ ] **Step 1: Viết test round-trip thất bại**

```js
console.log('W25 ROUND-TRIP writer->reader: inertNote qua scripts/gate-card.js ra co dung loai');
{
  const { mkdtempSync, mkdirSync, writeFileSync } = await import('node:fs');
  const { execFileSync } = await import('node:child_process');
  const os = await import('node:os');
  const ROOT = path.join(HERE, '..', '..');

  // (1) RUT cau literal tu WRITER that — khong chep tay
  const jEval = { id: 'E9', criterion: 'AC-4', executor: 'judgment', question: 'q?', inputs: ['/a.md'], runs: 3 };
  const { calls } = await runWorkflow(WF, baseArgs({ evals: [jEval] }), responder());
  const note = /Field khai mà máy không dùng:[^\n]*/.exec(byLabel(calls, 'synthesize:report')[0].prompt)[0];
  check('W25 rut duoc literal tu writer', note.length > 40, note);
  check('W25 literal KHONG bat dau bang "none"', !/^none/i.test(note));

  // (2) SINH workspace fixture bang code
  const mkWs = (variance) => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), 'agk-rt-'));
    const dir = path.join(tmp, '_acceptance', 'rt');
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, 'contract.md'),
      '---\nschema_version: 2\nfeature: "rt"\nslug: rt\nrisk_tier: T2\nstatus: verified\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n');
    writeFileSync(path.join(dir, 'evals.yaml'), 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n');
    writeFileSync(path.join(dir, 'evidence-report.md'),
      `---\nschema_version: 2\nfeature_slug: rt\nverdict: PASS\n---\n\n## Variance\n\n${variance}\n\n## Iterations\n\n- round 1\n`);
    return tmp;
  };
  const card = (variance) => execFileSync('node', [path.join(ROOT, 'scripts', 'gate-card.js'), '--slug', 'rt'],
    { cwd: mkWs(variance), encoding: 'utf8' });

  // (3) READER doc literal cua WRITER -> co dung loai
  const withInert = card(note);
  check('W25 the hien co neu dung ban chat field-inert', /Field khai mà máy không dùng/.test(withInert), 'khong thay cum trong the');
  check('W25 KHONG muon nhan co phuong-sai', !/pass-rate hỗn hợp[^<]*Field khai/.test(withInert), 'dung nham nhan phuong sai');

  // (4) DOI CHUNG DUONG: Variance = "none — ..." -> khong co nao
  const withNone = card('none — every multi-run eval is uniform');
  check('W25 doi chung duong: Variance "none" -> khong co field-inert', !/Field khai mà máy không dùng/.test(withNone));
  check('W25 doi chung duong: Variance "none" -> khong co phuong-sai', !/pass-rate hỗn hợp/.test(withNone));

  // (5) Ca phuong sai that van giu co cu
  const withVar = card('E3 pass_rate 4/5 — chua on dinh');
  check('W25 hoi quy: phuong sai that van ra co cu', /pass-rate hỗn hợp/.test(withVar));
}
```

- [ ] **Step 2: Chạy test, xác nhận ĐỎ**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep "W25"
```

Kỳ vọng: `W25 the hien co neu dung ban chat field-inert` FAIL — hôm nay thẻ có in nội dung nhưng gắn nhãn phương-sai, nên assertion `KHONG muon nhan co phuong-sai` cũng FAIL.

- [ ] **Step 3: Sửa `scripts/gate-card.js`**

Thay nguyên dòng 373 (dòng bắt đầu `{ const varr = cleanLines(section(report, 'Variance'))`) bằng:

```js
// Section Variance nay chua HAI loai tin hieu khac han nhau, phai ra hai co khac nhau:
// (a) phuong sai that (pass-rate hon hop) — viec cua may, mau do;
// (b) o inert: field nguoi ky KHAI ma may khong dung — viec cua NGUOI sua evals.yaml.
// Cum mo dau duoi day la hop dong chuoi lien-file voi feature-loop/workflows/acceptance-verify.js
// (khong import duoc nhau); case W25 trong tests/workflows giu hai ben khop.
{
  const varr = cleanLines(section(report, 'Variance')).join(' ').trim();
  if (varr && !/^\{\{/.test(varr)) {
    const cut = varr.indexOf('Field khai mà máy không dùng:');
    const inert = cut >= 0 ? varr.slice(cut).trim() : '';
    const rest = (cut >= 0 ? varr.slice(0, cut) : varr).trim();
    if (inert) flags.push(['fwarn', esc(inert)]);
    if (rest && !/^none/i.test(rest)) flags.push(['fred', 'Có eval ngẫu nhiên (pass-rate hỗn hợp) — ' + esc(rest)]);
  }
}
```

- [ ] **Step 4: Chạy test, xác nhận XANH**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W25|Results:"
bash tests/scripts/run-tests.sh 2>&1 | tail -3
```

Kỳ vọng: mọi `W25` PASS, và suite `tests/scripts` (10 case gate-card sẵn có) không hồi quy.

- [ ] **Step 5: Đối chứng đột biến — chứng minh round-trip biết đỏ**

```bash
cp scripts/gate-card.js /tmp/gc-backup.js
sed -i '' "s/Field khai mà máy không dùng:'/Field khai ma may khong dung:'/" scripts/gate-card.js
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep "W25 the hien co neu dung ban chat"
cp /tmp/gc-backup.js scripts/gate-card.js
```

Kỳ vọng: dòng giữa in `FAIL` — chứng minh test thật sự nối writer với reader chứ không kiểm hai bên riêng lẻ.

- [ ] **Step 6: Commit**

```bash
git add scripts/gate-card.js tests/workflows/acceptance-verify.test.mjs && git commit -m "feat(judgment-runs): the Cong 2 tach co field-inert khoi co phuong-sai + round-trip writer->reader"
```

---

### Task 5: Ba chỗ mô tả sai + bước "Mọi verdict" ở hai harness

Phục vụ **AC-8, AC-10**. `independent: true` (không đụng mã, không phụ thuộc Task 1–4).

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js:23`
- Modify: `feature-loop/skills/feature-loop/SKILL.md:130` và bước "Mọi verdict" của S4 (~dòng 160)
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:383-384` và bước Gate-2 package (~dòng 581)
- Test: `tests/workflows/acceptance-verify.test.mjs` — case `W26`

- [ ] **Step 1: Viết test thất bại (có đối chứng đột biến, path suy từ vị trí script)**

```js
console.log('W26 ba cho mo ta runs + buoc "Moi verdict" o CA HAI harness');
{
  const { readFileSync, writeFileSync, mkdtempSync } = await import('node:fs');
  const os = await import('node:os');
  const ROOT = path.join(HERE, '..', '..');
  const SITES = [
    ['feature-loop/workflows/acceptance-verify.js', /runs[^\n]*OPTIONAL[^\n]*test\/script/],
    ['feature-loop/skills/feature-loop/SKILL.md', /`runs`[^\n]*chỉ có hiệu lực trên[^\n]*`test`\/`script`/],
    ['codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md', /`runs`[^\n]*only[^\n]*`test`\/`script`/],
  ];
  for (const [rel, re] of SITES) {
    const txt = readFileSync(path.join(ROOT, rel), 'utf8');
    check(`W26 ${rel}: mo ta neu gioi han test/script`, re.test(txt));
    check(`W26 ${rel}: khong con mo ta tro "eval ngau nhien (LLM)"`,
      !/eval ngẫu nhiên \(LLM\) chạy N lần/.test(txt) && !/stochastic\/LLM eval and must report/.test(txt));
  }
  const GATE2 = [
    ['feature-loop/skills/feature-loop/SKILL.md', /inertFields[\s\S]{0,400}máy đã lo/],
    ['codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md', /inertFields/],
  ];
  for (const [rel, re] of GATE2) {
    check(`W26 ${rel}: buoc Moi verdict buoc trinh inertFields`, re.test(readFileSync(path.join(ROOT, rel), 'utf8')));
  }
  // DOI CHUNG DOT BIEN tren BAN SAO: khoi phuc cau cu -> detector phai do o dung file do
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'agk-doc-'));
  const copy = path.join(tmp, 'av.js');
  writeFileSync(copy, readFileSync(path.join(ROOT, SITES[0][0]), 'utf8')
    .replace(/\/\/             runs \}\],[^\n]*/, '//             runs }],  // OPTIONAL int>1: eval ngẫu nhiên (LLM) chạy N lần → pass_rate + variance'));
  const mutated = readFileSync(copy, 'utf8');
  check('W26 doi chung dot bien: khoi phuc cau cu -> detector DO',
    !SITES[0][1].test(mutated) && /eval ngẫu nhiên \(LLM\) chạy N lần/.test(mutated));
}
```

- [ ] **Step 2: Chạy test, xác nhận ĐỎ**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep "W26"
```

Kỳ vọng: cả 8 assertion đầu FAIL; dòng đối chứng đột biến PASS.

- [ ] **Step 3: Sửa `acceptance-verify.js:23`**

Thay:
```
//             runs }],                     // OPTIONAL int>1: eval ngẫu nhiên (LLM) chạy N lần → pass_rate + variance
```
bằng:
```
//             runs }],                     // OPTIONAL int>1, CHI CO HIEU LUC TREN test/script: lenh chay N lan → pass_rate + variance.
//                                          // Tren ui-check/judgment field nay INERT (panel 3-lens da la co che hap thu nhieu) —
//                                          // khong bi bo im lang nua: xem INERT_FIELD_TABLE + result.inertFields.
```

- [ ] **Step 4: Sửa `feature-loop/skills/feature-loop/SKILL.md:130`**

Thay:
```
   - Parse `_acceptance/<slug>/evals.yaml` (giữ field `runs` nếu có — int>1 = eval ngẫu nhiên/LLM, script chạy N lần → pass_rate + variance; default 1).
```
bằng:
```
   - Parse `_acceptance/<slug>/evals.yaml` (giữ field `runs` nếu có — int>1 và `runs` **chỉ có hiệu lực trên** executor `test`/`script`: lệnh đó chạy N lần → pass_rate + variance; default 1). Trên `ui-check`/`judgment` field này INERT (panel 3-lens đã là cơ chế hấp thụ nhiễu) — script KHÔNG chặn nhưng trả `result.inertFields` nêu đích danh.
```

- [ ] **Step 5: Sửa bước "Mọi verdict" trong `feature-loop/skills/feature-loop/SKILL.md`**

Trong đoạn `**Mọi verdict:**` của S4, chèn ngay SAU câu về `carried` (câu kết thúc bằng `carry-forward phải minh bạch, không được ẩn vào "máy đã lo".`):

```
Kết quả có `inertFields` không rỗng → khi báo user VÀ trong gói Cổng 2 phải trình RIÊNG, **không được nén vào phần "máy đã lo"** (cùng hạng minh bạch với `carried`): mỗi mục viết bằng ngôn ngữ sản phẩm nêu đích danh eval + field, kiểu "E10 khai `runs: 3` nhưng eval hội đồng chạy đúng một lần mỗi lens — giá trị đó bị bỏ qua", kèm việc-của-người: đổi executor, hoặc bỏ field khỏi `evals.yaml`, hoặc chấp nhận và ghi Known limits. Đây là field NGƯỜI khai mà máy không dùng — im lặng ở đây chính là lỗi feature `judgment-runs` sinh ra để diệt.
```

- [ ] **Step 6: Sửa `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`**

Thay dòng 383-384:
```
1. Parse `_acceptance/<slug>/evals.yaml`. Preserve optional `runs`; an integer
   greater than 1 means stochastic/LLM eval and must report `pass_rate`.
```
bằng:
```
1. Parse `_acceptance/<slug>/evals.yaml`. Preserve optional `runs`; an integer
   greater than 1 applies **only to `test`/`script` executors** — that command
   runs N times and must report `pass_rate`. On `ui-check`/`judgment` the field
   is INERT (a judgment eval already runs a 3-lens panel); the run is not
   blocked, but `result.inertFields` names every such eval and field.
```

Rồi trong đoạn Gate-2 package (~dòng 581, câu liệt kê `what this round carried forward`), chèn ngay sau nó:
```
Also surface `inertFields` as its OWN block, never folded into the
machine-handled summary: each entry names the eval and the field the author
declared that the engine does not use, in product language, with the human's
options (change the executor, drop the field, or accept and record a known
limit).
```

- [ ] **Step 7: Chạy test, xác nhận XANH**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W26|Results:"
```

- [ ] **Step 8: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js feature-loop/skills/feature-loop/SKILL.md codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md tests/workflows/acceptance-verify.test.mjs && git commit -m "docs(judgment-runs): ba cho mo ta runs khop ve eval-executors.md + buoc Moi verdict trinh inertFields o ca hai harness"
```

---

### Task 6: Đường đọc-cũ trên 6 workspace thật + sync mirror

Phục vụ **AC-9, AC-11**. `independent: false` (cần Task 1–3).

**Files:**
- Test: `tests/workflows/acceptance-verify.test.mjs` — case `W27`
- Modify: `plugins/**` (sinh máy, qua script sync)

- [ ] **Step 1: Viết test đường đọc-cũ, fixture do CODE SINH**

```js
console.log('W27 duong doc-cu: 6 workspace da ky mang runs/paths tren judgment van verify duoc');
{
  const { readFileSync, readdirSync, existsSync } = await import('node:fs');
  const ROOT = path.join(HERE, '..', '..');
  const WSDIR = path.join(ROOT, '_acceptance');

  // Fixture do CODE SINH: quet chinh cay dang kiem, khong chep tay danh sach
  const found = { runs: [], paths: [] };
  for (const slug of readdirSync(WSDIR)) {
    const f = path.join(WSDIR, slug, 'evals.yaml');
    if (!existsSync(f)) continue;
    for (const b of readFileSync(f, 'utf8').split(/(?=^\s*- id:)/m)) {
      if (!/^\s{4}executor:\s*judgment/m.test(b)) continue;
      const id = (/- id:\s*(\S+)/.exec(b) || [])[1];
      if (/^\s{4}runs:\s*([2-9]|\d\d)/m.test(b)) found.runs.push(`${slug}/${id}`);
      if (/^\s{4}paths:/m.test(b)) found.paths.push(`${slug}/${id}`);
    }
  }
  // SANITY COUNTER TACH THEO HINH DANG — dem tong se xanh oan khi regex sot mot hinh dang
  check('W27 quet ra >=1 eval judgment mang runs', found.runs.length >= 1, JSON.stringify(found.runs));
  check('W27 quet ra >=1 eval judgment mang paths', found.paths.length >= 1, JSON.stringify(found.paths));

  const evals = [
    ...found.runs.map((k, i) => ({ id: `R${i}`, criterion: 'AC-1', executor: 'judgment', question: `q ${k}`, inputs: ['/a.md'], runs: 3 })),
    ...found.paths.map((k, i) => ({ id: `P${i}`, criterion: 'AC-2', executor: 'judgment', question: `q ${k}`, inputs: ['/a.md'], paths: ['x.js'] })),
  ];
  const { result } = await runWorkflow(WF, baseArgs({ evals, suiteCommands: ['npm run build'] }), responder());
  check('W27 verdict KHONG phai BLOCKED', result.verdict !== 'BLOCKED', result.verdict + ' ' + JSON.stringify(result.blocked));
  check('W27 khong eval nao bi day vao failedEvals', result.failedEvals.length === 0, JSON.stringify(result.failedEvals));
  check('W27 nhung VAN co canh bao co ten cho tung eval',
    result.inertFields.length === evals.length, `${result.inertFields.length} vs ${evals.length}`);

  // DOI CHUNG DUONG: phep do nay BIET do — tiem mot agent chet vao cung harness
  const { result: red } = await runWorkflow(WF, baseArgs({ evals, suiteCommands: ['npm run build'] }),
    responder({ 'machine:': null }));
  check('W27 doi chung duong: agent may chet -> BLOCKED', red.verdict === 'BLOCKED', red.verdict);
}
```

- [ ] **Step 2: Chạy test**

```bash
node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W27|Results:"
```

Kỳ vọng: mọi assertion PASS ngay (Task 1–3 đã cho hành vi đúng). Nếu `W27 quet ra >=1 …` FAIL thì regex quét hỏng — sửa test, KHÔNG nới assertion.

- [ ] **Step 3: Chạy toàn bộ suite**

```bash
bash tests/workflows/run-tests.sh && bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh
```

Kỳ vọng: cả bốn in `Results: all … passed` / `0 failed`.

- [ ] **Step 4: Sync mirror**

```bash
bash scripts/sync-plugin-packages.sh && bash scripts/sync-plugin-packages.sh --check
```

Kỳ vọng: lệnh thứ hai exit 0.

- [ ] **Step 5: Commit**

```bash
git add tests/workflows/acceptance-verify.test.mjs plugins && git commit -m "test(judgment-runs): duong doc-cu quet tu 6 workspace that + sync mirror plugins"
```

---

## Self-Review

**Spec coverage** — 13 AC → task: AC-1/2/3/4/7 → Task 1 · AC-6/13 → Task 2 · AC-5 → Task 3 · AC-12 → Task 4 · AC-8/10 → Task 5 · AC-9/11 → Task 6. Không AC nào thiếu task.

**Placeholder scan** — không có "TBD"/"tương tự Task N"/"thêm xử lý lỗi phù hợp"; mọi bước code đều có khối mã thật.

**Type consistency** — `inertFieldReport` trả `{evalId, field, value, executor, reason}` ở Task 1; Task 2 đọc `evalId/field/executor`, Task 3 đọc thêm `value/reason`, Task 6 chỉ đếm `.length`. `INERT_FIELD_TABLE` dùng khoá `field`/`executor`/`reason` khớp regex rút bảng ở W20. Cụm chuỗi `Field khai mà máy không dùng:` viết y hệt ở Task 3 (writer), Task 4 (reader) và W25 (round-trip).
