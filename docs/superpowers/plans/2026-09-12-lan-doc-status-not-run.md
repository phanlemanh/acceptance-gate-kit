# Làn ghim lại tôn trọng trường trạng-thái đã ký — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lượt ghim lại bỏ qua đúng ô mà hồ sơ đã ký khai là không chạy, nói ra ô nào đã bỏ, và bên chấm hiểu y hệt bên ghi — để một hồ sơ lành thôi bị đọc thành nợ.

**Architecture:** Một định nghĩa duy nhất trong `lib/evidence-core.cjs` quyết định «eval máy đáng ghim»; `machineEvalIds` (bên đọc) và `repin-lane.mjs` (bên ghi) cùng gọi nó. Một hàm thứ hai trong cùng tệp phát hiện xung đột hai vế và cũng được cả hai bên gọi. Dòng pin mang thêm khoá `evals_not_run`; dòng `sha:` mang thêm một hậu tố, cùng khuôn với hậu tố `đạt-có-giới-hạn` đã có.

**Tech Stack:** Node.js thuần (CommonJS cho `lib/`, ESM cho `feature-loop/scripts/`), không thư viện ngoài. Ca kiểm là script Node tự chạy, gom qua suite `scripts` bằng glob.

**Spec:** `docs/superpowers/specs/2026-09-12-lan-doc-status-not-run-design.md`

## Global Constraints

- Giá trị trạng-thái duy nhất được nhận là `not-run`; chuẩn hoá bằng `String(v).trim().toLowerCase()` sau khi bóc vỏ nháy bằng `unquoteScalar` đã có trong `lib/evidence-core.cjs`. KHÔNG thêm giá trị nào khác — corpus 8 kho chỉ có giá trị này.
- Mọi fixture do **mã sinh trong chính lần chạy**; cấm fixture viết tay theo khuôn bên đọc.
- Mỗi phép đo mới đi kèm **cặp hai chiều trên cùng fixture** + **thông điệp ghim** (MEASURE-BIRTH-CLAUSE).
- Bản base cho ca so-sánh lấy **trọn thư mục**: `git archive <sha> lib scripts feature-loop`. Cấm chép danh sách file tay (bài học P150).
- Mọi đường dẫn trong ca kiểm suy từ vị trí script (`fileURLToPath(import.meta.url)`), cấm hardcode gốc kho.
- Bộ lọc `LSNR_CASES` khớp 0 ca phải **thoát khác 0** (bài học P86).
- KHÔNG sửa `evals.yaml`, `contract.md` hay báo cáo của bất kỳ hồ sơ đã ký nào ở bất kỳ kho nào.
- KHÔNG chạm `scripts/pre-merge-check.sh` và `scripts/start-scan.mjs` — vòng `cua-veto-sau-chu-ky` đang giữ hai tệp đó.
- Tên hằng và thông điệp viết tiếng Việt không dấu trong mã, có dấu trong chuỗi hiển thị — theo nếp `repin-lane.mjs` hiện có.

## File Structure

| Tệp | Trách nhiệm | Thao tác |
|---|---|---|
| `lib/evidence-core.cjs` | Nơi DUY NHẤT định nghĩa «eval máy đáng ghim» và luật xung đột hai vế; `machineEvalIds` và `checkRepinEvals` rút từ đó | Sửa |
| `feature-loop/scripts/repin-lane.mjs` | Bên ghi: gọi hàm dùng chung thay bộ lọc riêng; dừng exit 2 khi xung đột TRƯỚC khi ghi; ghi khoá và hậu tố nói-ra | Sửa |
| `tests/scripts/lan-status-not-run.test.mjs` | Tệp ca VĨNH VIỄN L01–L10; suite `scripts` tự gom qua glob | Tạo |
| `_acceptance/lan-doc-status-not-run/*` | Hợp đồng và bản khai eval — đã duyệt Cổng Phạm vi, KHÔNG sửa trong lúc thi công | Không chạm |

---

### Task 1: Định nghĩa dùng chung + chuẩn hoá + chỗ khai

**Files:**
- Modify: `lib/evidence-core.cjs` (vùng `REPIN_MACHINE_EXECUTORS` dòng ~358 và `machineEvalIds` dòng ~366; khối `module.exports` dòng ~1048)
- Create: `tests/scripts/lan-status-not-run.test.mjs`

**Interfaces:**
- Produces: `normaliseEvalStatus(v) → string` · `isRepinMachineEval(e) → boolean` (nhận object eval đã parse, đọc `e.executor` và `e.status`) · `machineEvalIds(evalsText) → string[] | null` (giữ nguyên chữ ký, đổi ruột) · `machineEvalIdsSkipped(evalsText) → string[] | null` (id bị loại vì khai không-chạy, theo thứ tự trong tệp).
- Consumes: `unquoteScalar` đã có trong cùng tệp; `parseEvals` từ `lib/eval-yaml.cjs`.

- [ ] **Step 1: Viết ca L09 và L10 trong tệp ca mới (ĐỎ trước)**

Khung tệp — bộ lọc `LSNR_CASES`, thoát khác 0 khi khớp 0 ca:

```js
#!/usr/bin/env node
// Ca vĩnh viễn cho hồ sơ lan-doc-status-not-run. Chạy trọn: node tests/scripts/lan-status-not-run.test.mjs
// Chạy một ca: LSNR_CASES=L01 node tests/scripts/lan-status-not-run.test.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');           // suy từ vị trí script, không hardcode
const core = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));

const CASES = [];
const test = (id, name, fn) => CASES.push({ id, name, fn });
const fail = (msg) => { throw new Error(msg); };

function evalsYaml(rows) {   // fixture do MÃ SINH
  const body = rows.map(r => [
    `  - id: ${r.id}`,
    `    executor: ${r.executor || 'script'}`,
    `    cmd: ${r.cmd || 'true'}`,
    r.status === undefined ? null : `    status: ${r.status}`,
  ].filter(Boolean).join('\n')).join('\n');
  return `evals:\n${body}\n`;
}

test('L09', 'chuẩn hoá bảy hình dạng lời khai', () => {
  const DANG = [
    ['not-run', true], ['"not-run"', true], ["'not-run'", true],
    ['NOT-RUN', true], ['Not-Run', true], ['  not-run  ', true],
    ['not_run', false],
  ];
  let n = 0;
  for (const [raw, phaiLoai] of DANG) {
    const text = evalsYaml([{ id: 'E1' }, { id: 'E2', status: raw }]);
    const ids = core.machineEvalIds(text);
    const biLoai = !ids.includes('E2');
    if (biLoai !== phaiLoai) fail(`L09 dạng ${JSON.stringify(raw)}: phải ${phaiLoai ? 'BỊ LOẠI' : 'GIỮ'} mà không — ids=${ids.join(',')}`);
    n++;
  }
  if (n !== DANG.length) fail(`L09 số ô lệch: chạy ${n}, bảng có ${DANG.length}`);
});

test('L10', 'chỉ TRƯỜNG thật mới tính, bốn chỗ khác không', () => {
  const base = evalsYaml([{ id: 'E1' }, { id: 'E2' }]);
  const CHO = [
    ['comment', base.replace('evals:', '# status: not-run\nevals:')],
    ['folded', base.replace('    cmd: true\n', '    cmd: true\n    expected: >-\n      gỡ dòng status: not-run đi thì ô chạy\n')],
    ['literal', base.replace('    cmd: true\n', '    cmd: true\n    expected: |\n      status: not-run\n')],
    ['paths', base.replace('    cmd: true\n', '    cmd: true\n    paths:\n      - "docs/status: not-run.md"\n')],
  ];
  for (const [ten, text] of CHO) {
    const ids = core.machineEvalIds(text);
    if (ids.length !== 2) fail(`L10 chỗ ${ten}: tập id phải còn 2, nhận ${ids.length} (${ids.join(',')})`);
  }
  const that = evalsYaml([{ id: 'E1' }, { id: 'E2', status: 'not-run' }]);
  const ids = core.machineEvalIds(that);
  if (ids.length !== 1 || ids[0] !== 'E1') fail(`L10 trường thật: phải còn đúng E1, nhận ${ids.join(',')}`);
  // chân tự soi: bản khai CỦA CHÍNH hồ sơ này không khai ô nào là không-chạy
  const own = fs.readFileSync(path.join(ROOT, '_acceptance', 'lan-doc-status-not-run', 'evals.yaml'), 'utf8');
  const skipped = core.machineEvalIdsSkipped(own);
  if (skipped.length !== 0) fail(`L10 tự soi: bản khai của chính hồ sơ bị loại ${skipped.join(',')} — phải RỖNG`);
});

const only = (process.env.LSNR_CASES || '').split(/[,\s]+/).filter(Boolean);
const chay = only.length ? CASES.filter(c => only.includes(c.id)) : CASES;
if (!chay.length) { console.error(`lan-status-not-run: bộ lọc LSNR_CASES=${process.env.LSNR_CASES} khớp 0 ca — không có gì chạy`); process.exit(2); }
let ok = 0;
for (const c of chay) {
  try { c.fn(); ok++; console.log(`  ✓ ${c.id} ${c.name}`); }
  catch (e) { console.error(`  ✗ ${c.id} ${c.name}\n    ${e.message}`); process.exit(1); }
}
console.log(`lan-status-not-run: ${ok}/${chay.length} ca xanh`);
```

Lưu ý cho người thi công: `require` trong tệp ESM cần `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);` — thêm dòng đó ở đầu tệp.

- [ ] **Step 2: Chạy để thấy nó ĐỎ**

Run: `LSNR_CASES=L09 node tests/scripts/lan-status-not-run.test.mjs`
Expected: ĐỎ — `core.machineEvalIdsSkipped is not a function`, hoặc L09 báo dạng `not-run` trơn KHÔNG bị loại.

- [ ] **Step 3: Cài định nghĩa dùng chung trong `lib/evidence-core.cjs`**

Thay khối `machineEvalIds` hiện tại bằng:

```js
const REPIN_MACHINE_EXECUTORS = ['test', 'script'];
// Giá trị trạng-thái DUY NHẤT khiến một ô rời khỏi tập đáng ghim. Chuẩn hoá vì
// một lời khai bọc nháy hay viết hoa vẫn là cùng lời khai — cùng lớp với bộ
// giải nháy của 2.11.0, chỉ ở chiều đọc.
const EVAL_STATUS_NOT_RUN = 'not-run';
function normaliseEvalStatus(v) {
  return unquoteScalar(String(v == null ? '' : v)).trim().toLowerCase();
}
// MỘT nơi quyết định «eval máy đáng ghim»: executor máy VÀ không tự khai là
// không chạy. Bên ĐỌC (machineEvalIds) và bên GHI (repin-lane.mjs) cùng gọi —
// hai bản luật là điều kiện đủ để writer/reader trôi khỏi nhau.
function isRepinMachineEval(e) {
  if (!REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase())) return false;
  return normaliseEvalStatus(e.status) !== EVAL_STATUS_NOT_RUN;
}
function machineEvalIds(evalsText) {
  const ey = loadEvalYaml();
  if (!ey) return null;
  return ey.parseEvals(evalsText, ['executor', 'status']).filter(isRepinMachineEval).map(e => e.id);
}
// Id bị loại vì tự khai không chạy — pin phải NÓI RA chúng, không được im.
function machineEvalIdsSkipped(evalsText) {
  const ey = loadEvalYaml();
  if (!ey) return null;
  return ey.parseEvals(evalsText, ['executor', 'status'])
    .filter(e => REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase()))
    .filter(e => normaliseEvalStatus(e.status) === EVAL_STATUS_NOT_RUN)
    .map(e => e.id);
}
```

Thêm `normaliseEvalStatus`, `isRepinMachineEval`, `machineEvalIdsSkipped` vào `module.exports`.

**Kiểm tiền đề trước khi chạy tiếp:** `parseEvals(text, ['executor','status'])` phải đọc được `status` như một trường của eval và KHÔNG nhặt chuỗi nằm trong thân `expected:`. Nếu ca L10 vẫn đỏ ở chỗ `folded`/`literal` thì lỗi nằm ở `parseEvals`, không ở đây — DỪNG và báo, đừng vá bằng cách tự quét dòng trong `evidence-core.cjs` (dựng bộ đọc thứ hai chính là lớp lỗi vòng này đi đóng).

- [ ] **Step 4: Chạy lại hai ca**

Run: `LSNR_CASES=L09,L10 node tests/scripts/lan-status-not-run.test.mjs`
Expected: `2/2 ca xanh`.

- [ ] **Step 5: Chiều đỏ — phá vật thật trong bản sao**

```bash
tmp=$(mktemp -d) && git archive HEAD lib scripts feature-loop | tar -x -C "$tmp"
node -e 'const p=process.argv[1];let s=require("fs").readFileSync(p,"utf8");s=s.replace("return normaliseEvalStatus(e.status) !== EVAL_STATUS_NOT_RUN;","return true;");require("fs").writeFileSync(p,s)' "$tmp/lib/evidence-core.cjs"
LSNR_ROOT="$tmp" LSNR_CASES=L09 node tests/scripts/lan-status-not-run.test.mjs; echo "mong đợi ĐỎ, nhận $?"
```

Ca phải ĐỎ với thông điệp ghim `L09 dạng "not-run": phải BỊ LOẠI mà không`. Thêm biến `LSNR_ROOT` vào tệp ca để trỏ bộ máy sang bản sao (`const ROOT = process.env.LSNR_ROOT ? path.resolve(process.env.LSNR_ROOT) : path.resolve(HERE, '..', '..')`) — nhưng đường dẫn tới bản khai của chính hồ sơ vẫn suy từ vị trí script.

- [ ] **Step 6: Commit**

```bash
git add lib/evidence-core.cjs tests/scripts/lan-status-not-run.test.mjs
git commit -m "feat(evidence-core): một định nghĩa «eval máy đáng ghim», chuẩn hoá lời khai"
```

---

### Task 2: Bên ghi gọi hàm dùng chung, thôi tự lọc

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` (bộ lọc dòng ~150–161; khối `AG-ENGINE-TABLE` dòng ~85–98)
- Modify: `tests/scripts/lan-status-not-run.test.mjs` (thêm L01, L02)

**Interfaces:**
- Consumes: `core.isRepinMachineEval`, `core.machineEvalIdsSkipped` từ Task 1.
- Produces: làn không còn hằng `MACHINE`; `perSlug[].skipped` mang id bị loại cho Task 4 dùng.

- [ ] **Step 1: Viết L01 và L02 (ĐỎ trước)**

```js
test('L01', 'hai bên trả CÙNG một tập id', () => {
  const text = evalsYaml([{ id: 'E1' }, { id: 'E2', status: 'not-run' }, { id: 'E3', executor: 'test' }]);
  const kho = dungKhoTam({ evals: text });                  // helper ở Step 2
  const benDoc = core.machineEvalIds(text);
  const benGhi = Object.keys(chayLan(kho, ['E1','E2','E3']).slugs.s1.evals_exit);
  if (benDoc.join(',') !== benGhi.join(',')) fail(`L01 hai bên trả tập khác nhau — đọc=[${benDoc}] ghi=[${benGhi}]`);
  if (benDoc.includes('E2')) fail('L01 ô khai không-chạy vẫn nằm trong tập');
});

test('L02', 'ô khai không-chạy KHÔNG được thi hành', () => {
  const kho = dungKhoTam({ danhDau: true });                 // cmd của ô ghi một tệp dấu
  const r = chayLan(kho, []);
  if (r.exit !== 0) fail(`L02 làn phải xanh, nhận exit ${r.exit}`);
  if (fs.existsSync(kho.tepDau)) fail('L02 ô không-chạy ĐÃ BỊ THI HÀNH — tệp dấu tồn tại');
  const kho2 = dungKhoTam({ danhDau: true, goStatus: true }); // đối chứng dương
  chayLan(kho2, []);
  if (!fs.existsSync(kho2.tepDau)) fail('L02 đối chứng dương hỏng: gỡ lời khai mà ô vẫn không chạy — ca không phân biệt được gì');
});
```

- [ ] **Step 2: Viết hai helper sinh kho tạm và chạy làn**

`dungKhoTam(opts)` phải: `git init` một kho tạm dưới `os.tmpdir()`, ghi `_acceptance/config.yaml` tối thiểu (`feature_loop.suite_keys` trỏ một khoá `executors.script.noop: true`), ghi `_acceptance/s1/{evals.yaml,evidence-report.md,run-log.jsonl}` với `verified_commit` là sha của commit đầu, rồi `git add -A && git commit`. Khi `danhDau: true`, `cmd` của ô khai không-chạy là `sh -c 'touch <tepDau>'`. `chayLan(kho, ids)` gọi `execFileSync(process.execPath, [<repin-lane.mjs>, '--root', kho.dir, '--slug', 's1', '--reason', 'ca kiểm'])`, bắt mã thoát, trả JSON stdout.

- [ ] **Step 3: Chạy để thấy ĐỎ**

Run: `LSNR_CASES=L01,L02 node tests/scripts/lan-status-not-run.test.mjs`
Expected: ĐỎ — `L02 ô không-chạy ĐÃ BỊ THI HÀNH`.

- [ ] **Step 4: Sửa làn**

Trong `feature-loop/scripts/repin-lane.mjs`, xoá `const MACHINE = new Set(core.REPIN_MACHINE_EXECUTORS);` và đổi vòng lọc:

```js
  const evals = parseEvals(evalsText, ['executor', 'cmd', 'status'])
    .filter(e => core.isRepinMachineEval(e))
    .map(e => { /* giữ nguyên thân cũ */ });
  const skipped = core.machineEvalIdsSkipped(evalsText) || [];
  return { slug, ws, reportPath, report, evals, skipped };
```

Thêm hai hàng vào khối `AG-ENGINE-TABLE` (nếu thiếu, chân quan hệ GL03 sẽ đỏ và gọi đúng tên):

```js
  { file: 'lib/evidence-core.cjs', name: 'isRepinMachineEval', kind: 'function', since: '2.12.0', why: 'làn gọi' },
  { file: 'lib/evidence-core.cjs', name: 'machineEvalIdsSkipped', kind: 'function', since: '2.12.0', why: 'làn gọi' },
```

- [ ] **Step 5: Chạy lại + lưới thường trực của làn lớp-cũ**

Run: `LSNR_CASES=L01,L02 node tests/scripts/lan-status-not-run.test.mjs && node tests/scripts/repin-lane-lop-cu.test.mjs`
Expected: cả hai xanh (GL03 xanh chứng bảng bộ máy đã khớp).

- [ ] **Step 6: Chiều đỏ + commit**

Hoàn nguyên bộ lọc riêng trong một bản sao (`git archive` trọn thư mục như Task 1 Step 5) → L01 phải ĐỎ ghim «hai bên trả tập khác nhau».

```bash
git add feature-loop/scripts/repin-lane.mjs tests/scripts/lan-status-not-run.test.mjs
git commit -m "feat(repin-lane): bên ghi rút tập eval từ định nghĩa dùng chung"
```

---

### Task 3: Luật hai vế — xung đột thì dừng TRƯỚC khi ghi

**Files:**
- Modify: `lib/evidence-core.cjs` (thêm `notRunConflicts`; gọi trong `checkRepinEvals` ngay sau khối `missing`)
- Modify: `feature-loop/scripts/repin-lane.mjs` (chặn trước mọi lượt chạy suite)
- Modify: `tests/scripts/lan-status-not-run.test.mjs` (thêm L04)

**Interfaces:**
- Produces: `notRunConflicts(evalsText, reportText) → string[]` — id khai không-chạy mà báo cáo đã ký CÓ mã thoát cho nó.

- [ ] **Step 1: Viết L04 (ĐỎ trước), có vật quan sát byte**

```js
test('L04', 'khai không-chạy mà báo cáo đã ký có mã thoát → dừng, chưa ghi byte nào', () => {
  const kho = dungKhoTam({ xungDot: true });   // báo cáo có khối `- eval: E2` + `exit_code: 0`
  const truoc = bam(kho);                       // băm run-log.jsonl + evidence-report.md
  const r = chayLan(kho, [], { write: true });
  if (r.exit !== 2) fail(`L04 phải thoát 2, nhận ${r.exit}`);
  for (const can of ['s1', 'E2', 'không-chạy', 'báo cáo đã ký']) {
    if (!r.stderr.includes(can)) fail(`L04 thông điệp thiếu «${can}»: ${r.stderr.slice(0, 200)}`);
  }
  if (bam(kho) !== truoc) fail('L04 đã ghi byte trước khi dừng');
  if (themTepMoi(kho)) fail('L04 để lại tệp mới trong thư mục hồ sơ');
  const lanh = dungKhoTam({});                  // đối chứng dương: lượt xanh PHẢI đổi băm
  const b0 = bam(lanh); chayLan(lanh, [], { write: true });
  if (bam(lanh) === b0) fail('L04 đối chứng dương hỏng: lượt xanh không đổi băm — băm-giống-nhau không chứng được gì');
  const errs = core.checkRepinEvals(dongPinThieuE2(kho), evalsXungDot, 's1', baoCaoXungDot).errs;
  if (!errs.some(e => e.includes('E2'))) fail('L04 bên đọc im lặng trước xung đột');
});
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `LSNR_CASES=L04 node tests/scripts/lan-status-not-run.test.mjs`
Expected: ĐỎ — làn thoát 0 thay vì 2.

- [ ] **Step 3: Cài `notRunConflicts` và gọi ở cả hai bên**

```js
// Hai vế, theo tiền lệ expected_exit (ADR 0016): một ô chỉ được loại khi hồ sơ
// khai VÀ báo cáo đã ký không mang mã thoát nào cho nó. Thiếu vế hai thì «thêm
// một dòng khai» thành đường né đo.
function notRunConflicts(evalsText, reportText) {
  const skipped = machineEvalIdsSkipped(evalsText);
  if (!skipped || !skipped.length || reportText == null) return [];
  const signed = extractEvalBlockExits(reportText);
  return skipped.filter(id => signed.has(id));
}
```

Trong `checkRepinEvals`, ngay sau khối `missing`:

```js
  const xungDot = notRunConflicts(evalsText, reportText);
  if (xungDot.length) errs.push(`re-pin lane "${id}" bỏ qua eval ${xungDot.join(', ')} vì evals.yaml khai không-chạy, NHƯNG báo cáo đã ký có mã thoát cho chính eval đó — hai vế mâu thuẫn; sửa hồ sơ rồi chạy làn MỚI`);
```

Trong `repin-lane.mjs`, đặt NGAY SAU vòng dựng `perSlug` và TRƯỚC lượt chạy suite đầu tiên:

```js
for (const s of perSlug) {
  const xungDot = core.notRunConflicts(fs.readFileSync(path.join(s.ws, 'evals.yaml'), 'utf8'), s.report);
  if (xungDot.length) die(`${s.slug}: eval ${xungDot.join(', ')} khai không-chạy trong evals.yaml nhưng báo cáo đã ký CÓ mã thoát cho chính nó — hai vế mâu thuẫn, làn không ghi gì; sửa hồ sơ rồi chạy làn mới`);
}
```

(`die` đã có sẵn và thoát 2.)

- [ ] **Step 4: Chạy lại**

Run: `LSNR_CASES=L04 node tests/scripts/lan-status-not-run.test.mjs`
Expected: `1/1 ca xanh`.

- [ ] **Step 5: Chiều đỏ + commit**

Bản sao bỏ vế 2 (`return [];` ở đầu `notRunConflicts`) → L04 ĐỎ ghim «đường lách không-chạy mở».

```bash
git add lib/evidence-core.cjs feature-loop/scripts/repin-lane.mjs tests/scripts/lan-status-not-run.test.mjs
git commit -m "feat(evidence-core): luật hai vế cho ô khai không-chạy"
```

---

### Task 4: Pin nói ra ô không đo — khoá JSON và hậu tố dòng sha

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` (dòng ~213–217)
- Modify: `tests/scripts/lan-status-not-run.test.mjs` (thêm L03, L06)

- [ ] **Step 1: Viết L06 và L03 (ĐỎ trước)**

```js
test('L06', 'pin nói ra ô không đo ở CẢ HAI chỗ', () => {
  const kho = dungKhoTam({});                       // có E2 khai không-chạy
  chayLan(kho, [], { write: true });
  const dong = JSON.parse(docDongCuoi(kho, 'run-log.jsonl'));
  if (JSON.stringify(dong.evals_not_run) !== JSON.stringify(['E2'])) fail(`L06 khoá JSON sai: ${JSON.stringify(dong.evals_not_run)}`);
  const rep = fs.readFileSync(path.join(kho.dir, '_acceptance/s1/evidence-report.md'), 'utf8');
  if (!/· không chạy theo hồ sơ: E2/.test(rep)) fail('L06 dòng sha thiếu hậu tố nói-ra');
  const sach = dungKhoTam({ khongCoStatus: true }); // hồ sơ không có ô nào khai
  chayLan(sach, [], { write: true });
  const d2 = JSON.parse(docDongCuoi(sach, 'run-log.jsonl'));
  if ('evals_not_run' in d2) fail('L06 hồ sơ không có ô nào mà pin vẫn mang khoá');
  if (/không chạy theo hồ sơ/.test(fs.readFileSync(path.join(sach.dir, '_acceptance/s1/evidence-report.md'), 'utf8'))) fail('L06 hậu tố xuất hiện khi không có ô nào');
});

test('L03', 'bên đọc nhận pin thiếu id đã khai, vẫn chặn id CHẠY ĐƯỢC bị thiếu', () => {
  const kho = dungKhoTam({});
  chayLan(kho, [], { write: true });
  const rc = execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(kho.dir, '_acceptance/s1/evidence-report.md')], { encoding: 'utf8' });
  if (/lacks eval/.test(rc)) fail(`L03 pin hợp lệ bị báo thiếu id: ${rc}`);
  const thieuThat = core.checkRepinEvals(pinThieu('E1', kho), docEvals(kho), 's1', docReport(kho)).errs;
  if (!thieuThat.some(e => e.includes('E1'))) fail('L03 đối chứng dương hỏng: thiếu id CHẠY ĐƯỢC mà bên đọc im');
});
```

- [ ] **Step 2: Chạy để thấy ĐỎ** — Run: `LSNR_CASES=L03,L06 node tests/scripts/lan-status-not-run.test.mjs` · Expected: ĐỎ `L06 khoá JSON sai: undefined`.

- [ ] **Step 3: Sửa chỗ dựng dòng pin**

```js
  const boQua = s.skipped;
  const line = JSON.stringify(boQua.length
    ? { ts: iso, kind: 'repin', run_id: runId, sha, suites_exit: suitesExit, evals_exit: evalsExit, evals_not_run: boQua }
    : { ts: iso, kind: 'repin', run_id: runId, sha, suites_exit: suitesExit, evals_exit: evalsExit });
  const veBoQua = boQua.length ? ` · không chạy theo hồ sơ: ${boQua.join(', ')}` : '';
```

và nối `${veBoQua}` vào cuối dòng `sha:` của `section`, ngay sau `${veHet}`.

- [ ] **Step 4: Chạy lại** — Expected: `2/2 ca xanh`.

- [ ] **Step 5: Chiều đỏ + commit**

Bản sao bỏ `veBoQua` → L06 ĐỎ ghim «pin im lặng về ô không đo».

```bash
git add feature-loop/scripts/repin-lane.mjs tests/scripts/lan-status-not-run.test.mjs
git commit -m "feat(repin-lane): pin khai ra ô không đo ở dòng log và dòng sha"
```

---

### Task 5: Đường đọc-cũ — pin cũ do writer THẬT của bản trước vá ghi

**Files:** Modify `tests/scripts/lan-status-not-run.test.mjs` (thêm L05)

- [ ] **Step 1: Viết L05**

Dựng bản base bằng `git archive` lấy TRỌN thư mục, chạy làn của bản đó trên fixture mã-sinh, lấy đúng dòng pin nó ghi, rồi cho bên đọc MỚI chấm:

```js
test('L05', 'pin CŨ do writer thật ghi vẫn xanh với bên đọc mới', () => {
  const base = path.join(os.tmpdir(), `lsnr-base-${process.pid}`);
  fs.mkdirSync(base, { recursive: true });
  const sha = execFileSync('git', ['-C', ROOT, 'rev-parse', 'HEAD~5'], { encoding: 'utf8' }).trim();  // mốc trước vá
  execFileSync('sh', ['-c', `git -C ${ROOT} archive ${sha} lib scripts feature-loop | tar -x -C ${base}`]);
  const kho = dungKhoTam({ khongCoStatus: true });   // bản cũ không hiểu lời khai, nên fixture không dùng nó
  execFileSync(process.execPath, [path.join(base, 'feature-loop/scripts/repin-lane.mjs'), '--root', kho.dir, '--slug', 's1', '--reason', 'pin cũ', '--write', '--ag-root', base]);
  const dongCu = docDongCuoi(kho, 'run-log.jsonl');
  const errsMoi = core.checkRepinEvals(JSON.parse(dongCu), docEvals(kho), 's1', docReport(kho)).errs;
  if (errsMoi.length) fail(`L05 bên đọc MỚI từ chối pin cũ: ${errsMoi.join(' | ')}`);
  const coreCu = require(path.join(base, 'lib', 'evidence-core.cjs'));
  if (coreCu.checkRepinEvals(JSON.parse(dongCu), docEvals(kho), 's1', docReport(kho)).errs.length) fail('L05 đối chứng dương hỏng: bên đọc CŨ cũng từ chối pin của chính nó');
});
```

- [ ] **Step 2: Thêm vế «không hồ sơ nào hoá đỏ», ghim BA thứ**

Trong cùng ca: chạy `node scripts/recheck-evidence.cjs --all` (hoặc lối tương đương) hai lượt — một với `lib/` của bản base, một với bản hiện tại — rồi assert: cả hai **thoát 0**; mỗi lượt in **tổng số hồ sơ đã chấm > 0**; **tập TÊN** hồ sơ vi phạm giống nhau. Chân dương: tiêm một pin thiếu id của ô CHẠY ĐƯỢC vào bản sao corpus → số vi phạm TĂNG đúng 1 và gọi đúng tên hồ sơ.

- [ ] **Step 3: Chạy + chiều đỏ + commit**

Chiều đỏ: bản sao đổi `missing` thành so khớp chính xác hai chiều → L05 ĐỎ ghim tên hồ sơ cũ hoá đỏ.

```bash
git add tests/scripts/lan-status-not-run.test.mjs
git commit -m "test(lan-status-not-run): pin cũ dựng bằng writer thật của bản trước vá"
```

---

### Task 6: Ca thật hình dạng OneFlow + lưới bộ lọc rỗng + chạy trọn

**Files:** Modify `tests/scripts/lan-status-not-run.test.mjs` (L07, L08)

- [ ] **Step 1: Viết L07** — fixture mã-sinh: 14 ô máy, một ô khai không-chạy trỏ `sh -c 'exit 4'`; báo cáo đã ký có 13 khối eval, không có khối cho ô đó. Chạy làn `--write` → xanh; pin ghi 13 id; `evals_not_run` chứa ô kia; `recheck-evidence.cjs` 0 lỗi.
- [ ] **Step 2: Viết L08** — `LSNR_CASES=KHONG-CO-CA-NAY` phải thoát 2 và thông điệp chứa «khớp 0 ca».
- [ ] **Step 3: Chiều đỏ của L07** — chạy cùng fixture với `--ag-root` trỏ bản base (trước vá) → làn ĐỎ với đúng thông điệp mã thoát 4.
- [ ] **Step 4: Chạy trọn tệp ca + bốn suite của kho**

Run: `node tests/scripts/lan-status-not-run.test.mjs && node tests/scripts/repin-lane-lop-cu.test.mjs`
Rồi chạy các suite khai trong `feature_loop.suite_keys` của `_acceptance/config.yaml`.
Expected: tất cả xanh, `10/10 ca xanh`.

- [ ] **Step 5: Commit**

```bash
git add tests/scripts/lan-status-not-run.test.mjs
git commit -m "test(lan-status-not-run): ca thật hình dạng OneFlow + lưới bộ lọc rỗng"
```

---

## Tự rà kế hoạch

- **Phủ spec:** bốn mục thiết kế đều có task — một nguồn (Task 1–2) · hai vế (Task 3) · nói ra (Task 4) · đường đọc-cũ (Task 5). Ca thật và lưới bộ lọc ở Task 6. Bảng bộ máy nằm trong Task 2 Step 4 vì nó chỉ cần khi làn gọi export mới.
- **Phủ hợp đồng:** AC-1→L01 · AC-2→L02 · AC-3→L03 · AC-4→L04 · AC-5→L05 · AC-6→L06 · AC-7→L07 · AC-8→GL03 của tệp ca lớp-cũ · AC-9→L09 · AC-10→L10. `lsnr_bo_loc_rong`→L08.
- **Tên hàm nhất quán:** `normaliseEvalStatus` · `isRepinMachineEval` · `machineEvalIds` · `machineEvalIdsSkipped` · `notRunConflicts` — dùng đúng các tên này ở mọi task.
- **Chỗ dễ vấp đã ghi sẵn:** `createRequire` cho tệp ESM (Task 1) · `parseEvals` phải tự phân biệt thân block scalar, nếu không thì DỪNG chứ không dựng bộ đọc thứ hai (Task 1 Step 3) · `LSNR_ROOT` để trỏ bộ máy sang bản sao mà không hardcode gốc (Task 1 Step 5).
