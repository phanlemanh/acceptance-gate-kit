# Eval máy khai mã thoát mong đợi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cho eval máy một chỗ khai mã thoát mong đợi khác 0, để một giới hạn đã khai không bị năm bộ đọc coi là thất bại.

**Architecture:** MỘT nguồn rút kỳ vọng trong `lib/eval-yaml.cjs`, fail-closed. Bốn bộ đọc tiêu thụ rút từ đó và không tự đọc trường. Vòng S4 không có hệ tệp nên `s4-args.mjs` rút hộ rồi mang vào args dưới tên đã đổi dạng `expectedExit`; nhờ vậy chuỗi `expected_exit` chỉ tồn tại ở đúng một tệp và điều đó tự thành một ràng buộc kiểm được. Eval đạt đúng mã khác 0 sinh một dòng Known limits, làm hồ sơ hết xanh-sạch và tự định tuyến về Cổng Bằng chứng có người.

**Tech Stack:** Node CommonJS (`lib/*.cjs`), Node ESM (`feature-loop/scripts/*.mjs`, `tests/**/*.test.mjs`), bash (răng hồ sơ), harness vm-realm của `tests/workflows/harness.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-09-eval-khai-ma-thoat-mong-doi-design.md`

## Global Constraints

- Hợp đồng đã duyệt: `_acceptance/eval-khai-ma-thoat-mong-doi/contract.md`, 13 tiêu chí. Không tự nới phạm vi.
- KHÔNG chạm `scripts/recheck-evidence.cjs`, `hooks/`, `feature-loop/scripts/carry-plan.mjs`.
- KHÔNG chạm `evaluateContractWrite` (quanh dòng 613 của `lib/evidence-core.cjs`) và `tests/hooks/run-tests.sh` — vùng của hồ sơ mốc `release-2-10-0` đang chạy song song. Chạm vào là DỪNG và báo owner.
- `lib/eval-yaml.cjs` trên `main` hiện chỉ có `parseEvals`, `BLOCK_RE`, `stripComment`. Không có `pathsOf`, không có `staleScope` — K4 đã rút ở `affc2108`.
- Mã hạ tầng CẤM khai: 97 và 127. Danh sách này phải khớp khối marker `INFRA-EXIT-CODES` trong `feature-loop/workflows/acceptance-verify.js`.
- Executor được khai: `test` và `script`. Mọi executor khác là lỗi có tên.
- Khai `expected_exit: 0` TƯỜNG MINH phải cho hành vi BẰNG HỆT vắng trường. Đây là ràng buộc cấu trúc, không phải một nhánh riêng.
- Mỗi phép đo mới phải có cặp hai chiều trên CÙNG fixture: bản lành xanh, bản tiêm đỏ với THÔNG ĐIỆP GHIM. Fixture do mã sinh trong chính lượt chạy.
- Chuỗi `expected_exit` chỉ được xuất hiện trong `lib/eval-yaml.cjs`. Mọi nơi khác dùng `expectedExit` hoặc gọi hàm.

---

### Task 1: Nguồn rút kỳ vọng trong `lib/eval-yaml.cjs`

Phục vụ AC-1(b), AC-2, AC-11(e).

**Files:**
- Modify: `lib/eval-yaml.cjs` (thêm export, sau `stripComment`)
- Test: `tests/scripts/expected-exit.test.mjs` (tạo mới)

**Interfaces:**
- Consumes: `parseEvals(text, fields, normalize)` và `stripComment(s)` đã có trong chính tệp.
- Produces:
  - `EXPECTED_EXIT_BANNED: number[]` — `[97, 127]`
  - `EXPECTED_EXIT_EXECUTORS: string[]` — `['test', 'script']`
  - `expectedExits(text: string): { byId: Map<string, number>, errs: string[] }` — `byId` có MỌI eval trong tệp, giá trị mặc định `0`; `errs` là danh sách thông điệp, mỗi thông điệp chứa id của eval phạm luật. `errs` không rỗng nghĩa là bên gọi phải fail-closed.

- [ ] **Step 1: Viết ca kiểm trượt**

```js
// tests/scripts/expected-exit.test.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const EY = require(path.join(HERE, '..', '..', 'lib', 'eval-yaml.cjs'));

let pass = 0, fail = 0;
const ok = (id, m) => { console.log(`  PASS: ${id} ${m}`); pass++; };
const bad = (id, m) => { console.log(`  DO: ${id} ${m}`); fail++; };
const t = (id, cond, m) => cond ? ok(id, m) : bad(id, m);

const Y = (body) => `evals:\n${body}`;
const ev = (id, executor, extra = '') =>
  `  - id: ${id}\n    executor: ${executor}\n    cmd: x\n${extra}`;

// EE1 vắng trường → 0
{
  const r = EY.expectedExits(Y(ev('E1', 'script')));
  t('EE1', r.errs.length === 0 && r.byId.get('E1') === 0, 'vắng trường → 0, không lỗi');
}
// EE2 khai 0 TƯỜNG MINH → BẰNG HỆT vắng trường
{
  const a = EY.expectedExits(Y(ev('E1', 'script')));
  const b = EY.expectedExits(Y(ev('E1', 'script', '    expected_exit: 0\n')));
  t('EE2', b.errs.length === 0 && b.byId.get('E1') === a.byId.get('E1'),
    'khai 0 tường minh bằng hệt vắng trường');
}
// EE3 khai hợp lệ
{
  const r = EY.expectedExits(Y(ev('E1', 'script', '    expected_exit: 2\n')));
  t('EE3', r.errs.length === 0 && r.byId.get('E1') === 2, 'khai 2 hợp lệ');
}
// EE4 sai kiểu — bốn hình dạng, mỗi cái phải lỗi VÀ nêu tên eval
for (const [i, v] of [['a', 'hai'], ['b', '-1'], ['c', '256'], ['d', '2.5']]) {
  const r = EY.expectedExits(Y(ev('E9', 'script', `    expected_exit: ${v}\n`)));
  t(`EE4${i}`, r.errs.length === 1 && r.errs[0].includes('E9'),
    `giá trị ${v} → lỗi gọi tên eval`);
}
// EE5 mã hạ tầng
for (const [i, v] of [['a', 97], ['b', 127]]) {
  const r = EY.expectedExits(Y(ev('E9', 'test', `    expected_exit: ${v}\n`)));
  t(`EE5${i}`, r.errs.length === 1 && r.errs[0].includes('E9') && r.errs[0].includes('hạ tầng'),
    `mã ${v} → lỗi nêu «hạ tầng»`);
}
// EE6 executor sai — thông điệp nêu TÊN executor
for (const [i, x] of [['a', 'judgment'], ['b', 'ui-check']]) {
  const r = EY.expectedExits(Y(ev('E9', x, '    expected_exit: 2\n')));
  t(`EE6${i}`, r.errs.length === 1 && r.errs[0].includes('E9') && r.errs[0].includes(x),
    `executor ${x} → lỗi nêu tên executor`);
}
// EE7 KHÔNG rơi thầm về 0: mọi ca lỗi ở trên không được vừa im vừa trả 0
{
  const r = EY.expectedExits(Y(ev('E9', 'script', '    expected_exit: hai\n')));
  t('EE7', r.errs.length > 0, 'khai sai không được im mà trả 0');
}
// EE8 danh sách mã cấm khớp khối marker INFRA-EXIT-CODES (round-trip)
{
  const fs = require('node:fs');
  const wf = fs.readFileSync(
    path.join(HERE, '..', '..', 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const blk = (wf.split('// <<<INFRA-EXIT-CODES')[1] || '').split('// INFRA-EXIT-CODES>>>')[0];
  const keys = [...blk.matchAll(/^\s*(\d+):/gm)].map(m => Number(m[1])).sort((a, b) => a - b);
  const banned = [...EY.EXPECTED_EXIT_BANNED].sort((a, b) => a - b);
  t('EE8', keys.length === 2 && JSON.stringify(keys) === JSON.stringify(banned),
    `mã cấm khớp marker: marker=${JSON.stringify(keys)} lib=${JSON.stringify(banned)}`);
}

console.log(`Results: expected-exit ${fail === 0 ? 'passed' : 'FAILED'} (${pass} pass, ${fail} do)`);
process.exit(fail === 0 ? 0 : 1);
```

- [ ] **Step 2: Chạy để chắc nó ĐỎ**

Run: `node tests/scripts/expected-exit.test.mjs`
Expected: FAIL — `EY.expectedExits is not a function`.

- [ ] **Step 3: Cài đặt tối thiểu**

Thêm vào `lib/eval-yaml.cjs`, NGAY TRƯỚC dòng `module.exports`:

```js
// Kỳ vọng mã thoát của một eval máy — MỘT nguồn cho mọi bộ đọc (s4-args, làn
// ghim lại, checkRepinEvals, evaluateEvidence). Vắng trường VÀ khai 0 tường
// minh cho CÙNG kết quả: «đã khai» không phải một trạng thái riêng, chỉ giá
// trị khác 0 mới là một giới hạn.
//
// EXPECTED_EXIT_BANNED phải BẰNG tập khoá của khối marker INFRA-EXIT-CODES
// trong feature-loop/workflows/acceptance-verify.js. Không require được sang
// đó: tệp này vendor sang repo tiêu thụ, tệp kia không. Ca EE8 giữ hai bên
// khớp, hai chiều. Vì sao cấm: normInfra đổi hai mã đó thành cannotRun TRƯỚC
// mọi phép so, nên khai chúng là hứa một điều máy không giữ được; và đúng hai
// mã đó là lãnh địa ô đã park `baseline-127-tin-hieu-phan-biet` (ADR 0016).
const EXPECTED_EXIT_BANNED = [97, 127];
const EXPECTED_EXIT_EXECUTORS = ['test', 'script'];

function expectedExits(text) {
  const byId = new Map();
  const errs = [];
  for (const e of parseEvals(text, ['executor', 'expected_exit'], stripComment)) {
    const id = e.id;
    const executor = String(e.executor || '').trim().toLowerCase();
    const raw = String(e.expected_exit == null ? '' : e.expected_exit).trim().replace(/^["']|["']$/g, '');
    if (raw === '') { byId.set(id, 0); continue; }
    if (!EXPECTED_EXIT_EXECUTORS.includes(executor)) {
      errs.push(`eval ${id}: expected_exit khai trên executor "${executor}" — chỉ ${EXPECTED_EXIT_EXECUTORS.join('/')} chạy lệnh nên mới có mã thoát`);
      byId.set(id, 0); continue;
    }
    if (!/^\d+$/.test(raw)) {
      errs.push(`eval ${id}: expected_exit "${raw}" không phải số nguyên 0–255`);
      byId.set(id, 0); continue;
    }
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 0 || n > 255) {
      errs.push(`eval ${id}: expected_exit "${raw}" không phải số nguyên 0–255`);
      byId.set(id, 0); continue;
    }
    if (EXPECTED_EXIT_BANNED.includes(n)) {
      errs.push(`eval ${id}: expected_exit ${n} là mã hạ tầng (${EXPECTED_EXIT_BANNED.join(', ')}) — không khai được; hạ tầng hỏng đi đường cannotRun, không đi đường giới hạn đã khai`);
      byId.set(id, 0); continue;
    }
    byId.set(id, n);
  }
  return { byId, errs };
}
```

Rồi đổi dòng cuối thành:

```js
module.exports = { parseEvals, BLOCK_RE, stripComment, expectedExits, EXPECTED_EXIT_BANNED, EXPECTED_EXIT_EXECUTORS };
```

- [ ] **Step 4: Chạy lại, phải XANH**

Run: `node tests/scripts/expected-exit.test.mjs`
Expected: PASS, 13 pass 0 do.

- [ ] **Step 5: Chiều đỏ của chính ca EE8**

Run:
```bash
cp feature-loop/workflows/acceptance-verify.js /tmp/av.bak
sed -i '' 's/^  97: /  96: /' feature-loop/workflows/acceptance-verify.js
node tests/scripts/expected-exit.test.mjs; echo "phải khác 0: $?"
cp /tmp/av.bak feature-loop/workflows/acceptance-verify.js
node tests/scripts/expected-exit.test.mjs; echo "phải bằng 0: $?"
```
Expected: lượt tiêm ĐỎ và in dòng `DO: EE8`; lượt khôi phục XANH.

- [ ] **Step 6: Cắm vào lưới thường trực**

Thêm vào `tests/scripts/run-tests.sh`, cạnh các dòng `node tests/scripts/*.test.mjs` đã có:

```bash
node "$HERE/expected-exit.test.mjs" || FAIL=1
```
(đọc tệp trước, dùng ĐÚNG tên biến và khuôn gọi mà các dòng cạnh nó đang dùng — đừng chép mù dòng trên.)

Run: `bash tests/scripts/run-tests.sh`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add lib/eval-yaml.cjs tests/scripts/expected-exit.test.mjs tests/scripts/run-tests.sh
git commit -m "feat(eval-yaml): expectedExits — một nguồn rút mã thoát mong đợi, fail-closed"
```

---

### Task 2: Làn ghim lại chấm theo kỳ vọng

Phục vụ AC-7 và nửa của AC-10.

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` (khối `perSlug` quanh dòng 100-112; vòng kết quả quanh 138-150)
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (khối marker `REPIN-TEMPLATE`)
- Test: `tests/scripts/repin-lane.test.mjs` (đã có — thêm ca)

**Interfaces:**
- Consumes: `expectedExits(text)` từ Task 1.
- Produces: dòng `kind:"repin"` giữ nguyên lược đồ, `evals_exit` nay có thể mang giá trị khác 0; câu chữ mục Re-pin đổi khuôn (xem Step 3).

- [ ] **Step 1: Viết ca kiểm trượt**

Thêm vào `tests/scripts/repin-lane.test.mjs` (đọc tệp trước để dùng đúng khuôn `ok`/`bad`/fixture đang có):

```js
// RL-EE1 eval khai 2 và lệnh trả 2 → làn XANH, evals_exit giữ mã thật
// RL-EE2 cùng fixture, lệnh trả 1 → làn ĐỎ exit 1, KHÔNG tệp nào bị ghi
// RL-EE3 câu chữ mục Re-pin đếm từ mã thật và GỌI TÊN eval đạt-có-giới-hạn
// RL-EE4 eval khai 2 mà lệnh trả 0 → XANH và câu chữ chứa «giới hạn đã khai không còn»
```

Mỗi ca dựng kho git tạm bằng chính lối `mk_repo` đã có trong tệp, khai một khoá executor trỏ `bash -c 'exit 2'`, và so byte của `run-log.jsonl` + `evidence-report.md` trước/sau ở ca RL-EE2.

- [ ] **Step 2: Chạy để chắc nó ĐỎ**

Run: `node tests/scripts/repin-lane.test.mjs`
Expected: FAIL — RL-EE1 đỏ vì làn hiện coi mọi mã khác 0 là đỏ.

- [ ] **Step 3: Cài đặt**

Trong `feature-loop/scripts/repin-lane.mjs`:

(a) đầu tệp, cạnh các `require`/`import` đã có, lấy thêm `expectedExits` từ cùng `lib/eval-yaml.cjs` mà tệp đang dùng cho `parseEvals`.

(b) trong khối `perSlug`, sau khi đọc `evalsText`, rút kỳ vọng và fail-closed:

```js
const { byId: expById, errs: expErrs } = expectedExits(evalsText);
if (expErrs.length) die(`${slug}: evals.yaml khai expected_exit sai luật —\n  ${expErrs.join('\n  ')}`);
```

và gắn `expected: expById.get(e.id) || 0` vào từng phần tử của mảng `evals` mà `.map` đang dựng.

(c) trong vòng kết quả, đổi phép so và dựng câu chữ từ MÃ THẬT. Ba trạng thái, không phải hai — đạt kỳ vọng · giới hạn đã hết · lệch:

```js
for (const s of perSlug) {
  const evalsExit = {};
  const gioiHan = [];    // đạt đúng một mã khác 0 đã khai
  const hetGioiHan = []; // khai mã khác 0 mà nay trả 0
  let dat = 0;
  for (const e of s.evals) {
    evalsExit[e.id] = e.exit;
    const datKyVong = e.exit === e.expected;
    const hetHan = e.expected !== 0 && e.exit === 0;   // AC-10: không phạt một cải thiện
    if (!datKyVong && !hetHan) { red = true; continue; }
    dat++;
    if (datKyVong && e.expected !== 0) gioiHan.push(`${e.id}=${e.exit}`);
    if (hetHan) hetGioiHan.push(`${e.id} (khai ${e.expected})`);
  }
  const n = (s.report.match(/^### Re-pin/gm) || []).length + 1;
  const line = JSON.stringify({ ts: iso, kind: "repin", run_id: runId, sha, suites_exit: suitesExit, evals_exit: evalsExit });
  const veGioiHan = gioiHan.length ? ` · đạt-có-giới-hạn: ${gioiHan.join(", ")}` : "";
  const veHet = hetGioiHan.length ? ` · giới hạn đã khai không còn: ${hetGioiHan.join(", ")}` : "";
  const section = `### Re-pin lần ${n} — ${day}, do ${reason}\nrun_id: ${runId}\nsha: ${sha} · suites: ${suiteCmds.length} lệnh exit 0 · evals: ${dat}/${s.evals.length} eval máy đạt kỳ vọng${veGioiHan}${veHet}\n`;
  out.slugs[s.slug] = { evals_exit: evalsExit, line, section };
}
```

`e.expected` gắn ở (b) và GIỮ NGUYÊN giá trị đã khai — phép so ở trên cần nó để phân biệt «khai 0 trả 0» với «khai 2 trả 0».

(d) cập nhật khối marker `REPIN-TEMPLATE` trong `feature-loop/skills/feature-loop/SKILL.md` cho khớp câu chữ mới — đây là khuôn một-nguồn, lệch là ca kiểm khác đỏ.

- [ ] **Step 4: Chạy lại, phải XANH**

Run: `node tests/scripts/repin-lane.test.mjs && node tests/scripts/repin-roundtrip.test.mjs`
Expected: PASS cả hai.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/scripts/repin-lane.mjs feature-loop/skills/feature-loop/SKILL.md tests/scripts/repin-lane.test.mjs
git commit -m "feat(repin-lane): chấm theo kỳ vọng đã khai, câu chữ đếm từ mã thật"
```

---

### Task 3: Luật hai vế của `checkRepinEvals`

Phục vụ AC-8.

**Files:**
- Modify: `lib/evidence-core.cjs` — `machineEvalIds` (quanh dòng 207) và `checkRepinEvals` (quanh dòng 219-247). TUYỆT ĐỐI không chạm `evaluateContractWrite` quanh dòng 613.
- Modify: `scripts/pre-merge-check.sh` và `scripts/recheck-evidence.cjs` CHỈ ở lời gọi, nếu chữ ký hàm đổi. Nếu tránh được đổi chữ ký thì không chạm hai tệp đó.
- Test: `tests/scripts/repin-evals.test.mjs` (đã có — thêm ca)

**Interfaces:**
- Consumes: `expectedExits(text)` từ Task 1; `extractEvalBlockRunIds`-style block walk đã có trong cùng tệp.
- Produces:
  - `extractEvalBlockExits(payload: string): Map<string, number>` — id eval → mã thoát ghi trong khối của nó; khối không có dòng mã thoát thì vắng khỏi Map.
  - `checkRepinEvals(entry, evalsText, slug, reportText)` — tham số thứ tư MỚI, tuỳ chọn. Vắng nó thì mọi mã khác 0 đều đỏ như trước (fail-closed, đường đọc-cũ an toàn).

- [ ] **Step 1: Viết ca kiểm trượt**

Thêm vào `tests/scripts/repin-evals.test.mjs`:

```js
// RE-EE1 khai 2 + báo cáo ghi 2 + làn 2 → errs RỖNG
// RE-EE2 khai 2 + báo cáo ghi 0 + làn 2 → errs có 1, thông điệp chứa «tiền đề»
// RE-EE3 KHÔNG khai + báo cáo ghi 2 + làn 2 → errs có 1, thông điệp chứa «chưa khai»
// RE-EE4 vắng tham số reportText + làn 2 → errs có 1 (đường đọc-cũ fail-closed)
```

- [ ] **Step 2: Chạy để chắc nó ĐỎ**

Run: `node tests/scripts/repin-evals.test.mjs`
Expected: FAIL — RE-EE1 đỏ, thông điệp hiện tại là «a red eval cannot back a pin».

- [ ] **Step 3: Cài đặt**

Thêm hàm bóc mã thoát theo khối, đặt cạnh `extractEvalBlockRunIds`:

```js
// Mã thoát ghi TRONG khối của từng eval. Cùng lối đi khối với
// extractEvalBlockRunIds: `- eval: <id>` mở khối, dòng đầu tiên không thụt
// đóng khối. Dùng cho luật hai vế của re-pin và cho L1 CONSISTENCY.
function extractEvalBlockExits(payload) {
  const out = new Map();
  let cur = null;
  for (const line of String(payload).split('\n')) {
    const open = line.match(/^\s*-\s+eval\s*[:=]\s*(.+?)\s*$/i);
    if (open) { cur = open[1].replace(/\s+#.*$/, '').trim().replace(/^["']+|["']+$/g, '').trim(); continue; }
    if (cur && !/^\s+\S/.test(line)) { cur = null; continue; }
    if (!cur) continue;
    const m = line.match(/^\s+(?:exit_code|verifier_exit_code|exit)\s*[:=]\s*(-?\d+)\b/i);
    if (m) out.set(cur, Number(m[1]));
  }
  return out;
}
```

Trong `checkRepinEvals`, đổi chữ ký và thay nhánh `red`:

```js
function checkRepinEvals(entry, evalsText, slug, reportText) {
  // … phần đầu giữ NGUYÊN cho tới sau khi tính `ids` và `missing` …
  const ey = loadEvalYaml();
  const expected = (ey && typeof ey.expectedExits === 'function')
    ? ey.expectedExits(evalsText).byId
    : new Map();
  const signed = reportText == null ? null : extractEvalBlockExits(reportText);
  const red = [];
  for (const i of ids) {
    if (!has(i)) continue;
    const got = ex[i];
    if (got === 0) continue;
    const want = expected.get(i) || 0;
    if (want === 0) {
      red.push(`${i}=${JSON.stringify(got)} (chưa khai: evals.yaml không có expected_exit cho eval này)`);
      continue;
    }
    if (got !== want) {
      red.push(`${i}=${JSON.stringify(got)} (khai ${want}, làn trả ${got} — lệch mã đã khai)`);
      continue;
    }
    if (signed == null) {
      red.push(`${i}=${JSON.stringify(got)} (không đọc được báo cáo đã ký để đối chiếu — vế hai của luật không kiểm được)`);
      continue;
    }
    if (signed.get(i) !== want) {
      red.push(`${i}=${JSON.stringify(got)} (tiền đề vừa mất: báo cáo đã ký ghi ${signed.has(i) ? signed.get(i) : 'không ghi mã nào'}, làn nay trả ${got} — một mã khác 0 MỚI xuất hiện chưa ai ký nhận)`);
    }
  }
  if (missing.length) errs.push(/* giữ nguyên câu cũ */);
  if (red.length) errs.push(`re-pin lane "${id}" evals_exit không đạt kỳ vọng đã khai cho ${red.join(', ')} — sửa rồi chạy làn MỚI`);
  return { errs };
}
```

Bên gọi: `scripts/recheck-evidence.cjs` và `scripts/pre-merge-check.sh` đã đọc nội dung báo cáo để chạy các luật khác. Truyền chính chuỗi đó làm tham số thứ tư. Nếu một bên gọi không có sẵn chuỗi, ĐỪNG đọc thêm tệp ở đó — để vắng và nhận nhánh fail-closed.

- [ ] **Step 4: Chạy lại, phải XANH**

Run: `node tests/scripts/repin-evals.test.mjs && node tests/scripts/recheck-repin.test.mjs && bash tests/plugins/run-tests.sh`
Expected: PASS cả ba.

- [ ] **Step 5: Commit**

```bash
git add lib/evidence-core.cjs scripts/recheck-evidence.cjs scripts/pre-merge-check.sh tests/scripts/repin-evals.test.mjs
git commit -m "feat(repin): mã khác 0 chống lưng pin chỉ khi đã khai VÀ đã ký nhận"
```

---

### Task 4: Luật nhất-quán L1 quét theo khối

Phục vụ AC-9.

**Files:**
- Modify: `lib/evidence-core.cjs` — `evaluateEvidence`, khối L1 CONSISTENCY và L1 SHAPE (quanh dòng 454-475)
- Test: `tests/workflows/acceptance-verify.test.mjs` hoặc tệp mới `tests/scripts/l1-khoi.test.mjs` — chọn tệp mới để không đụng vùng ca của hồ sơ khác

**Interfaces:**
- Consumes: `extractEvalBlockExits` từ Task 3; `expectedExits` từ Task 1; `opts.fileDir` đã có để tìm `evals.yaml` cạnh báo cáo.
- Produces: không đổi hình dạng trả về của `evaluateEvidence`.

- [ ] **Step 1: Viết ca kiểm trượt** — bốn hình dạng của AC-9 cộng ca hình dạng L1.

- [ ] **Step 2: Chạy để chắc nó ĐỎ** — ca (a) hiện đỏ vì `NONZERO_EXIT_RE` quét trọn báo cáo.

- [ ] **Step 3: Cài đặt**

```js
  // L1 CONSISTENCY — một PASS thật không chứa eval trượt. Ngoại lệ DUY NHẤT:
  // mã khác 0 nằm TRONG khối của đúng eval đã khai đúng mã ấy (giới hạn đã
  // khai, không phải một lượt trượt). Mọi mã khác 0 còn lại — ngoài khối,
  // lệch mã, hoặc của eval không khai — vẫn là vi phạm.
  const declared = (() => {
    if (!fileDir) return new Map();
    const ey = loadEvalYaml();
    if (!ey || typeof ey.expectedExits !== 'function') return new Map();
    try {
      const txt = fs.readFileSync(path.join(fileDir, 'evals.yaml'), 'utf8');
      const r = ey.expectedExits(txt);
      return r.errs.length ? new Map() : r.byId;   // khai sai → không tha gì cả
    } catch (_) { return new Map(); }
  })();
  const blockExits = extractEvalBlockExits(payload);
  const thaDuoc = new Set();
  for (const [evalId, code] of blockExits) {
    if (code !== 0 && declared.get(evalId) === code) thaDuoc.add(code);
  }
  // Quét từng dòng, không quét trọn chuỗi: một dòng mã thoát khác 0 chỉ được
  // tha khi nó thuộc khối của eval đã khai đúng mã đó.
  let consistencyFailure = null;
  {
    const viPham = [];
    let cur = null;
    for (const line of String(payload).split('\n')) {
      const open = line.match(/^\s*-\s+eval\s*[:=]\s*(.+?)\s*$/i);
      if (open) { cur = open[1].replace(/\s+#.*$/, '').trim().replace(/^["']+|["']+$/g, '').trim(); continue; }
      if (cur && !/^\s+\S/.test(line)) cur = null;
      const m = line.match(/(exit_code|verifier_exit_code|exit)\s*[:=]\s*([1-9]\d*)\b/i);
      if (!m) continue;
      const code = Number(m[2]);
      if (cur && declared.get(cur) === code) continue;   // giới hạn đã khai
      viPham.push(cur ? `eval ${cur} (mã ${code}${declared.has(cur) && declared.get(cur) ? `, khai ${declared.get(cur)}` : ', chưa khai'})` : `mã ${code} ngoài mọi khối eval`);
    }
    if (viPham.length) {
      consistencyFailure = `PASS report contains a failed eval (exit_code != 0) — the verdict must be REJECT: ${viPham.join('; ')}`;
    } else if (FAILED_JUDGMENT_RE.test(payload)) {
      consistencyFailure = 'PASS report contains a failed judgment (verdict: FAIL) — the verdict must be REJECT';
    }
  }
```

Và nới điều kiện hình dạng:

```js
  // Một hồ sơ mà MỌI eval máy đều khai mã khác 0 không thể có dòng exit_code: 0
  // nào. Điều kiện hình dạng thoả bằng một dòng mã thoát ĐÚNG kỳ vọng đã khai.
  const HAS_EXIT_ZERO = /(exit_code|verifier_exit_code|exit)\s*[:=]\s*0\b/i.test(payload)
    || [...blockExits].some(([evalId, code]) => code !== 0 && declared.get(evalId) === code);
```

- [ ] **Step 4: Chạy lại, phải XANH**

Run: `node tests/scripts/l1-khoi.test.mjs && bash tests/hooks/run-tests.sh && bash tests/scripts/run-tests.sh`
Expected: PASS. `tests/hooks/run-tests.sh` chạy để chắc KHÔNG hồi quy — KHÔNG sửa tệp đó.

- [ ] **Step 5: Commit**

```bash
git add lib/evidence-core.cjs tests/scripts/l1-khoi.test.mjs tests/scripts/run-tests.sh
git commit -m "feat(L1): luật nhất-quán quét theo khối eval, tha đúng giới hạn đã khai"
```

---

### Task 5: Kỳ vọng theo LỆNH trong vòng chấm S4

Phục vụ AC-3, AC-5, AC-6.

**Files:**
- Modify: `feature-loop/scripts/s4-args.mjs` (chỗ dựng mảng `evals` cho tệp args)
- Modify: `feature-loop/workflows/acceptance-verify.js` — sau `distinctCmds` (quanh dòng 407); khối gộp lượt chạy (quanh 600-630); `baselineStatus` (quanh 744); `failed` (quanh 985)
- Test: `tests/workflows/acceptance-verify.test.mjs` (thêm ca), `tests/scripts/s4-args-expected-exit.test.mjs` (tạo mới)

**Interfaces:**
- Consumes: `expectedExits(text)` từ Task 1.
- Produces:
  - tệp args: mỗi phần tử `evals[]` có thêm `expectedExit: number` (mặc định `0`). Tên đã ĐỔI DẠNG có chủ đích: chuỗi `expected_exit` chỉ được tồn tại trong `lib/eval-yaml.cjs`.
  - workflow: `expByCmd: Map<string, number>` và các mục `blocked` cho lệnh xung đột.

- [ ] **Step 1: Viết ca kiểm trượt cho `s4-args.mjs`**

```js
// SA-EE1 evals.yaml khai expected_exit: 2 → tệp args có evals[i].expectedExit === 2
// SA-EE2 vắng trường → expectedExit === 0
// SA-EE3 khai sai luật (mã 127) → script exit KHÁC 0, KHÔNG sinh tệp, thông điệp nêu tên eval
// SA-EE4 ràng buộc tĩnh: chuỗi "expected_exit" khớp ĐÚNG 0 lần trong
//        s4-args.mjs, acceptance-verify.js, repin-lane.mjs, evidence-core.cjs
```

- [ ] **Step 2: Viết ca kiểm trượt cho workflow**

Thêm vào `tests/workflows/acceptance-verify.test.mjs`, theo đúng khuôn `runWorkflow(WF, baseArgs({...}), responder({...}))` mà tệp đang dùng:

```js
console.log('W-EE1 eval khai expectedExit 2 và lệnh trả 2 → khong failed, verdict khong REJECT');
{
  const { result } = await runWorkflow(WF, baseArgs({
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'gioi han da khai', expectedExit: 2 }],
    suiteCommands: [],
  }), responder({ 'machine:': { exitCode: 2, outputTail: 'tien de thieu', runId: '', cannotRun: false } }));
  check('W-EE1', result.verdict !== 'REJECT' && result.failedEvals.length === 0,
    `verdict=${result.verdict} failed=${JSON.stringify(result.failedEvals)}`);
}

console.log('W-EE2 cung eval tra 1 → REJECT va co trong failedEvals');
{
  const { result } = await runWorkflow(WF, baseArgs({
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'gioi han da khai', expectedExit: 2 }],
    suiteCommands: [],
  }), responder({ 'machine:': { exitCode: 1, outputTail: 'truot that', runId: '', cannotRun: false } }));
  check('W-EE2', result.verdict === 'REJECT' && result.failedEvals.includes('E1'),
    `verdict=${result.verdict} failed=${JSON.stringify(result.failedEvals)}`);
}

console.log('W-EE3 eval KHONG khai ma tra 2 → REJECT (khong mo rong ngam)');
{
  const { result } = await runWorkflow(WF, baseArgs({
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'binh thuong' }],
    suiteCommands: [],
  }), responder({ 'machine:': { exitCode: 2, outputTail: 'truot', runId: '', cannotRun: false } }));
  check('W-EE3', result.verdict === 'REJECT' && result.failedEvals.includes('E1'),
    `verdict=${result.verdict}`);
}

console.log('W-EE4 hai eval chung lenh khai KHAC ma → BLOCKED goi ten ca hai');
{
  const { result } = await runWorkflow(WF, baseArgs({
    evals: [
      { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'a', expectedExit: 2 },
      { id: 'E2', criterion: 'AC-2', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'b', expectedExit: 3 },
    ],
    suiteCommands: [],
  }), responder());
  const b = (result.blocked || []).find(x => x.cmd === './x.sh');
  check('W-EE4', result.verdict === 'BLOCKED' && b && b.reason.includes('E1') && b.reason.includes('E2') && b.reason.includes('2') && b.reason.includes('3'),
    `blocked=${JSON.stringify(result.blocked)}`);
}

console.log('W-EE5 doi chung duong: hai eval chung lenh khai CUNG ma → khong blocked');
{
  const { result } = await runWorkflow(WF, baseArgs({
    evals: [
      { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'a', expectedExit: 2 },
      { id: 'E2', criterion: 'AC-2', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'b', expectedExit: 2 },
    ],
    suiteCommands: [],
  }), responder({ 'machine:': { exitCode: 2, outputTail: 'ok', runId: '', cannotRun: false } }));
  check('W-EE5', (result.blocked || []).length === 0 && result.verdict !== 'REJECT', `verdict=${result.verdict}`);
}

console.log('W-EE6 lan doi chung tra dung ky vong → doc la green (phan biet)');
{
  const { result } = await runWorkflow(WF, baseArgs({
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'a', expectedExit: 2 }],
    suiteCommands: [], runBaseline: true,
  }), responder({
    'machine:': { exitCode: 2, outputTail: 'ok', runId: '', cannotRun: false },
    'baseline:': { results: [{ cmd: './x.sh', baselineExit: 2, cannotRun: false }] },
  }));
  check('W-EE6', /non-?discriminating|khong-phan-biet/i.test(JSON.stringify(result)) || true,
    'baselineStatus so voi ky vong, khong so voi 0');
}
```

Ca W-EE6 phải assert đúng thứ nó hứa. Đọc `result` để tìm trường mang danh sách không-phân-biệt (`analyst`/`nonDiscriminating` tuỳ hình dạng thật của kết quả), rồi assert `E1` NẰM TRONG đó khi baseline trả 2, và KHÔNG nằm trong khi baseline trả 1. Đừng để `|| true`.

- [ ] **Step 3: Chạy để chắc chúng ĐỎ**

Run: `node tests/workflows/acceptance-verify.test.mjs`
Expected: FAIL ở W-EE1, W-EE4, W-EE6.

- [ ] **Step 4: Cài đặt trong `s4-args.mjs`**

Sau khi đọc `evals.yaml`, trước khi dựng mảng `evals` của tệp args:

```js
const { byId: expById, errs: expErrs } = evalYaml.expectedExits(evalsText);
if (expErrs.length) {
  console.error(`s4-args: evals.yaml khai mã thoát mong đợi sai luật —\n  ${expErrs.join('\n  ')}`);
  process.exit(2);
}
```
rồi gắn `expectedExit: expById.get(e.id) || 0` vào từng phần tử `evals[]`.

- [ ] **Step 5: Cài đặt trong workflow**

Ngay SAU `const distinctCmds = [...byCmd.keys()]`:

```js
// Kỳ vọng tính theo LỆNH, không theo eval: byCmd gom nhiều eval vào MỘT lượt
// chạy, mà một lượt chạy chỉ có một mã thoát. Hai eval chung lệnh khai hai mã
// khác nhau là mâu thuẫn không có lời giải đúng — BLOCKED có tên, để người sửa
// evals.yaml. Chọn thầm một mã là đúng lớp fail-open kit đang chặn.
const expOf = e => Number.isInteger(e.expectedExit) ? e.expectedExit : 0
const expByCmd = new Map()
const expConflicts = []
for (const cmd of distinctCmds) {
  const es = machineEvals.filter(e => e.cmd === cmd)
  if (!es.length) { expByCmd.set(cmd, 0); continue }   // lệnh suite: luôn kỳ vọng 0
  const set = [...new Set(es.map(expOf))]
  if (set.length > 1) {
    expConflicts.push({ cmd, reason: `hai eval tro cung lenh "${cmd}" khai HAI ma thoat mong doi khac nhau: ${es.map(e => `${e.id}=${expOf(e)}`).join(', ')} — mot luot chay chi co MOT ma thoat, may khong chon tham. Sua evals.yaml: tach lenh, hoac khai cung mot ma.` })
    expByCmd.set(cmd, 0); continue
  }
  expByCmd.set(cmd, set[0])
}
const expCmd = cmd => expByCmd.get(cmd) || 0
```

Trong khối gộp lượt chạy, thay ba phép so:

```js
  const passes = ran.filter(r => r.exitCode === expCmd(cmd)).length
  const variance = ran.length > 1 && passes > 0 && passes < ran.length
  const rep = ran.find(r => r.exitCode !== expCmd(cmd)) || ran[0]
  const exitCode = (passes === ran.length || variance) ? expCmd(cmd) : (rep.exitCode || 1)
```
và ở nhánh mẫu-thiếu phía trên, dòng `passes:` cũng đổi sang `r.exitCode === expCmd(cmd)`.

Với làn `ui-check` hợp nhất ngay dưới, giữ NGUYÊN `r.exitCode === 0`: `ui-check` không khai được kỳ vọng (giới hạn đã khai của hồ sơ).

`baselineStatus`:

```js
const baselineStatus = (cmd) => {
  const b = baselineByCmd.get(cmd)
  if (!b || b.cannotRun) return 'n-a'
  return b.baselineExit === expCmd(cmd) ? 'green' : 'red'
}
```

`failed` và `machineForReport`:

```js
const failed = machine.filter(m => !m.cannotRun && m.exitCode !== expCmd(m.cmd))
```
```js
const machineForReport = machine.map(m => (!m.cannotRun && m.exitCode === expCmd(m.cmd) && !m.variance)
  ? { ...m, outputTail: String(m.outputTail || '').split('\n').slice(-3).join('\n') }
  : m)
```
và trong khối tính `nonDiscriminating`, đổi `m.exitCode === 0` thành `m.exitCode === expCmd(m.cmd)`.

Cuối cùng, đổ `expConflicts` vào `blocked` ngay chỗ `const blocked = machine.filter(m => m.cannotRun)…`:

```js
const blocked = machine.filter(m => m.cannotRun)
  .map(m => ({ cmd: m.cmd, reason: m.reason || 'cannotRun khong co reason' }))
  .concat(expConflicts)
```

- [ ] **Step 6: Chạy lại, phải XANH**

Run: `node tests/workflows/acceptance-verify.test.mjs && node tests/scripts/s4-args-expected-exit.test.mjs && bash tests/workflows/run-tests.sh`
Expected: PASS cả ba.

- [ ] **Step 7: Commit**

```bash
git add feature-loop/scripts/s4-args.mjs feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs tests/scripts/s4-args-expected-exit.test.mjs
git commit -m "feat(S4): kỳ vọng theo lệnh, xung đột thì BLOCKED có tên"
```

---

### Task 6: Dòng Known limits do máy tính, và nới lời dặn soạn báo cáo

Phục vụ AC-4 và AC-12.

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — trước `phase('Synthesize')` (quanh dòng 1025) và trong chuỗi prompt của `synthesize:report` (quanh dòng 1098)
- Test: `tests/workflows/acceptance-verify.test.mjs`

**Interfaces:**
- Consumes: `expCmd`, `machine`, `byCmd`, `args.evals` từ Task 5.
- Produces: `knownLimitLines: string[]` — mỗi phần tử một dòng đã soạn xong, bên soạn chỉ chép nguyên văn.

- [ ] **Step 1: Viết ca kiểm trượt**

```js
console.log('W-EE7 eval dat-co-gioi-han → prompt soan bao cao mang dong Known limits tinh san');
{
  const { calls } = await runWorkflow(WF, baseArgs({
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'a', expectedExit: 2 }],
    suiteCommands: [],
  }), responder({ 'machine:': { exitCode: 2, outputTail: 'ok', runId: '', cannotRun: false } }));
  const p = byLabel(calls, 'synthesize:report')[0].prompt;
  check('W-EE7', p.includes('E1') && p.includes('AC-1') && /Known limits/i.test(p), 'prompt co dong tinh san');
}

console.log('W-EE8 loi dan khong con cam TRON goi ma khac 0');
{
  const { calls } = await runWorkflow(WF, baseArgs({
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.cli', expected: 'a', expectedExit: 2 }],
    suiteCommands: [],
  }), responder({ 'machine:': { exitCode: 2, outputTail: 'ok', runId: '', cannotRun: false } }));
  const p = byLabel(calls, 'synthesize:report')[0].prompt;
  check('W-EE8', !/report PASS khong duoc chua token exit khac 0/i.test(p) && /khoi cua eval da khai/i.test(p),
    'cau cam da noi dung pham vi');
}

console.log('W-EE9 khong co eval dat-co-gioi-han → khong dong Known limits nao');
{
  const { calls } = await runWorkflow(WF, baseArgs({ suiteCommands: [] }), responder());
  const p = byLabel(calls, 'synthesize:report')[0].prompt;
  check('W-EE9', !/dat-co-gioi-han/i.test(p), 'khong bia dong khi khong co gi de khai');
}
```

- [ ] **Step 2: Chạy để chắc chúng ĐỎ**

Run: `node tests/workflows/acceptance-verify.test.mjs`
Expected: FAIL ở W-EE7, W-EE8.

- [ ] **Step 3: Cài đặt**

Ngay trước `phase('Synthesize')`:

```js
// Dòng Known limits cho eval đạt-có-giới-hạn — JS TÍNH SẴN, bên soạn chỉ chép
// nguyên văn. Không để bên soạn tự diễn đạt: mục này là điều kiện xanh-sạch,
// một câu lệch khuôn là một hồ sơ đi nhầm cổng.
const acOf = id => (args.evals.find(e => e.id === id) || {}).criterion || '?'
const knownLimitLines = machine
  .filter(m => !m.cannotRun && expCmd(m.cmd) !== 0 && m.exitCode === expCmd(m.cmd))
  .flatMap(m => (byCmd.get(m.cmd) || []).map(id =>
    `- ${id} (${acOf(id)}) dat-co-gioi-han: ma thoat ${m.exitCode} la ket qua DA KHAI TRUOC cua eval nay, khong phai mot luot truot. Lenh: ${m.cmd}`))
// Giới hạn đã khai KHÔNG CÒN: khai mã khác 0 mà nay trả 0.
const gioiHanHet = machine
  .filter(m => !m.cannotRun && expCmd(m.cmd) !== 0 && m.exitCode === 0)
  .flatMap(m => (byCmd.get(m.cmd) || []).map(id =>
    `- ${id} (${acOf(id)}): gioi han da khai khong con — evals.yaml khai ma ${expCmd(m.cmd)}, lan chay nay tra 0. Go loi khai o vong sau.`))
```

Trong chuỗi prompt của `synthesize:report`, thay câu cấm cũ:

trước — `L1 CONSISTENCY: report PASS khong duoc chua token exit khac 0 hay chuoi "verdict: FAIL"`

sau — `L1 CONSISTENCY: report PASS khong duoc chua token exit khac 0, TRU khi ma do nam trong khoi cua eval DA KHAI dung ma ay (gioi han da khai); chuoi "verdict: FAIL" van bi cam o moi cho`

và chèn vào cùng prompt, sau phần `Ket qua may`:

```js
`${knownLimitLines.length ? `\nKNOWN LIMITS — chep NGUYEN VAN ${knownLimitLines.length} dong sau vao muc "## Known limits", moi dong mot bullet, KHONG dien dat lai, KHONG gop dong:\n${knownLimitLines.join('\n')}\nVoi cac eval nay: khoi eval PHAI ghi "exit_code: <ma that>" DUNG TEN TRUONG do — TUYET DOI khong bo truong va khong dat ten truong khac.\n` : ''}` +
`${gioiHanHet.length ? `\nGIOI HAN DA KHAI KHONG CON — chep NGUYEN VAN vao muc "## Known limits":\n${gioiHanHet.join('\n')}\n` : ''}`
```

- [ ] **Step 4: Chạy lại, phải XANH**

Run: `node tests/workflows/acceptance-verify.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(S4): Known limits do máy tính; nới lời dặn soạn báo cáo đúng phạm vi khối"
```

---

### Task 7: Răng hồ sơ — 13 chân

Phục vụ AC-1(a), AC-13, và chiều đỏ của mọi AC còn lại.

**Files:**
- Create: `_acceptance/eval-khai-ma-thoat-mong-doi/fixture.mjs`
- Create: `_acceptance/eval-khai-ma-thoat-mong-doi/rang.sh`
- Đọc trước làm mẫu: `_acceptance/duong-lui-phai-song/rang.sh` và `fixture.mjs`

**Interfaces:**
- Consumes: mọi thứ Task 1-6 dựng.
- Produces: `bash _acceptance/eval-khai-ma-thoat-mong-doi/rang.sh --chan <tên>` cho 13 tên đã khai trong `_acceptance/config.yaml`: `mot-nguon` · `khai-sai` · `s4-dat-gioi-han` · `known-limits` · `xung-dot-lenh` · `so-ky-vong` · `lan-ghim` · `luat-ghim` · `l1-nhat-quan` · `gioi-han-het` · `tai-lieu` · `loi-dan-soan` · `dau-cuoi-that`.

- [ ] **Step 1: Chép khuôn**

Đọc `_acceptance/duong-lui-phai-song/rang.sh` TRỌN VẸN và giữ nguyên: `set -uo pipefail`, `HERE`/`KIT` suy từ vị trí script (KHÔNG hardcode gốc kho), `ok`/`bad`/`done_chan`, `TMP` với `trap`, `copy_tree`, `inject` (thay nguyên văn đúng MỘT lần, đếm và báo khi khác 1).

- [ ] **Step 2: Chân `mot-nguon` — ma trận 16 ô cộng ràng buộc tĩnh**

Ma trận: 4 bộ đọc tiêu thụ × 4 fixture. Bộ đọc là `s4-args.mjs` (đại diện làn S4), `repin-lane.mjs`, `checkRepinEvals`, `evaluateEvidence`. Fixture: khai `2` · khai `0` tường minh · vắng trường · khai `hai`.

Ca phải TỰ ĐẾM: `[ "$ASSERTS" -eq 16 ] || bad "so o lech: $ASSERTS"`.

Ô «khai sai luật» đòi CẢ BỐN bộ đọc cùng NỔ. Đây là ô làm chiều đỏ sống: một bộ đọc tự đọc thẳng trường sẽ trả một SỐ thay vì lỗi.

Ràng buộc tĩnh:
```bash
for f in feature-loop/scripts/s4-args.mjs feature-loop/workflows/acceptance-verify.js \
         feature-loop/scripts/repin-lane.mjs lib/evidence-core.cjs; do
  n=$(grep -c 'expected_exit' "$KIT/$f" || true)
  [ "$n" -eq 0 ] || bad "loi doc thu sau: $f khop 'expected_exit' $n lan"
done
n=$(grep -c 'expected_exit' "$KIT/lib/eval-yaml.cjs" || true)
[ "$n" -gt 0 ] || bad "nguon that khong con khop 'expected_exit'"
```
Chiều đỏ: `copy_tree` rồi `inject` một lần khớp `expected_exit` vào `repin-lane.mjs`, chạy lại phép đếm TRÊN BẢN SAO, đòi ĐỎ nêu tên tệp.

- [ ] **Step 3: Mười hai chân còn lại — bảng mũi tiêm**

Mỗi chân theo đúng khuôn ba nhịp: dựng bản lành và đòi XANH; `copy_tree` rồi `inject` MỘT mũi trúng đúng một lần; chạy lại trên bản sao và đòi ĐỎ với thông điệp chứa chuỗi ghim. Bảng dưới khai đủ ba cột cho từng chân, không chân nào để người thi công tự nghĩ.

| Chân | Mũi tiêm vào bản sao | Chuỗi ghim đòi có trong thông điệp ĐỎ |
|---|---|---|
| `khai-sai` | `lib/eval-yaml.cjs`: đổi `errs.push` của nhánh mã hạ tầng thành `byId.set(id, n)` | `rơi thầm về 0` |
| `s4-dat-gioi-han` | `acceptance-verify.js`: đổi phép so của `failed` từ `m.exitCode !== expCmd(m.cmd)` về `m.exitCode !== 0` | `lệch mã mà vẫn nhận` |
| `known-limits` | `acceptance-verify.js`: đổi `knownLimitLines` thành mảng rỗng cứng | `Known limits vắng eval` |
| `xung-dot-lenh` | `acceptance-verify.js`: đổi `if (set.length > 1)` thành `if (false)` | `chọn thầm` |
| `so-ky-vong` | bốn bản sao RIÊNG, mỗi bản hoàn nguyên MỘT phép so về `=== 0`: đếm lượt đạt · lượt đại diện chẩn đoán · mã thoát gộp · `baselineStatus` | bốn thông điệp KHÁC nhau, mỗi cái nêu đúng tên chỗ bị hoàn nguyên |
| `lan-ghim` | `repin-lane.mjs`: đổi câu chữ mục Re-pin về khuôn cũ lấy số từ `s.evals.length` | `đếm từ độ dài mảng` |
| `luat-ghim` | `evidence-core.cjs`: bỏ nhánh đối chiếu `signed.get(i)` trong `checkRepinEvals` | `tiền đề` |
| `l1-nhat-quan` | `evidence-core.cjs`: đổi vòng quét theo dòng của L1 về phép thử trọn chuỗi `NONZERO_EXIT_RE.test(payload)` | `ngoài mọi khối eval` cho ca (c); tên eval cho ca (b) và (d) |
| `gioi-han-het` | hai bản sao: (i) bỏ `gioiHanHet` khỏi prompt soạn báo cáo · (ii) đổi `hetHan` trong `repin-lane.mjs` thành `false` | (i) `giới hạn hết mà im` · (ii) `phạt cải thiện` |
| `tai-lieu` | năm bản sao: đổi một mã trong khối marker · gỡ đoạn GUIDE §7.1 · xoá tệp ADR 0016 · gỡ term khỏi CONTEXT.md · gỡ chú thích trong `INIT-CI-COPY-LIST` | `mã cấm trôi khỏi marker`, cộng bốn thông điệp gọi tên đúng vật bị gỡ |
| `loi-dan-soan` | `acceptance-verify.js`: khôi phục câu cấm cũ trong prompt soạn báo cáo | `lời dặn còn cấm mã khác 0` |
| `dau-cuoi-that` | xem Step 3b | `khoá khai giải ra không phải lệnh đã định` |

Chân `tai-lieu` còn một ca DƯỚI NGƯỠNG phải IM: bản sao chỉ đổi khoảng trắng và đảo thứ tự hai mã trong khối marker mà TẬP mã không đổi thì chân XANH. So theo giá trị của tập, không so byte.

- [ ] **Step 3b: Chân `dau-cuoi-that`**

Chân duy nhất chạy lệnh THẬT, và là chân duy nhất bắt được lớp lỗi đã xảy ra ngày 09/09: khoá khai giải ra vỡ cú pháp nên lệnh thoát 127 chứ không phải mã của chính nó.

Năm nhịp, và nhịp 4 là nhịp quan trọng nhất — mã 2 phải do một lệnh THẬT thoát ra, không do ai gõ tay:

1. `mk_repo` dựng kho tạm có một hồ sơ, một khoá executor code-sinh trỏ một lệnh thật thoát mã 2, và một eval khai mã 2 trỏ đúng khoá đó.
2. Giải khoá bằng CHÍNH `feature-loop/scripts/s4-args.mjs` với `--root "$FX_ROOT" --ag-root "$KIT"`; script thoát khác 0 là chân ĐỎ.
3. Rút `evals[0].cmd` từ tệp args và so BẰNG với chuỗi lệnh đã khai trong config của fixture. Lệch là chân ĐỎ với chuỗi ghim `khoá khai giải ra không phải lệnh đã định` — đây chính là chỗ bẫy 09/09 nổ.
4. Chạy đúng chuỗi lệnh vừa rút bằng `bash -c`, LẤY mã thoát thật vào một biến. Chân ĐỎ nếu mã đó khác 2. Tuyệt đối không viết hằng 2 vào chỗ đáng lẽ là kết quả đo.
5. Đưa mã THẬT vừa đo vào workflow qua harness, rồi đòi ba thứ: eval ra đạt-có-giới-hạn, khối eval mang đúng mã đó, và mục Known limits có dòng gọi tên eval.

Hai đối chứng chạy trọn cùng năm nhịp trên: khoá đổi sang lệnh thoát 0 với eval KHÔNG khai thì ra PASS trơn và KHÔNG dòng Known limits nào; khoá đổi sang lệnh thoát 1 với eval khai 2 thì ra REJECT gọi tên eval.

Khi viết bước 3 và 4 trong `rang.sh`, giữ chuỗi lệnh trong MỘT biến shell và truyền thẳng cho `bash -c "$CMD"`. Đừng lồng nháy vào một dòng `node -e` — đó đúng là hình dạng đã làm vỡ cú pháp hôm 09/09.

- [ ] **Step 4: Chạy trọn 13 chân**

Run:
```bash
for c in mot-nguon khai-sai s4-dat-gioi-han known-limits xung-dot-lenh so-ky-vong \
         lan-ghim luat-ghim l1-nhat-quan gioi-han-het tai-lieu loi-dan-soan dau-cuoi-that; do
  bash _acceptance/eval-khai-ma-thoat-mong-doi/rang.sh --chan "$c" || echo "DO: $c"
done
```
Expected: 13 chân exit 0, không dòng `DO:`.

- [ ] **Step 5: Commit**

```bash
git add _acceptance/eval-khai-ma-thoat-mong-doi/rang.sh _acceptance/eval-khai-ma-thoat-mong-doi/fixture.mjs
git commit -m "test(eval-khai-ma-thoat): răng hồ sơ 13 chân, mỗi chân hai chiều"
```

---

### Task 8: Tài liệu và ranh giới

Phục vụ AC-11.

**Files:**
- Modify: `GUIDE.md` §7.1 (cuối mục, sau đoạn «Giới hạn khai, một ngưỡng đang đếm»)
- Create: `docs/adr/0016-eval-khai-ma-thoat-mong-doi.md`
- Modify: `CONTEXT.md` (thêm term **đạt-có-giới-hạn**)
- Modify: `commands/acceptance-init.md` (chú thích của `lib/eval-yaml.cjs` trong khối `INIT-CI-COPY-LIST`)

- [ ] **Step 1: ADR 0016**

Nội dung bắt buộc, vì AC-11(b) ghim chuỗi:
- quyết định: eval máy khai được mã thoát mong đợi; mã khác 0 chống lưng pin chỉ khi đã khai VÀ báo cáo đã ký ghi cùng mã;
- NÊU ĐÍCH DANH `baseline-127-tin-hieu-phan-biet` và vì sao việc này nằm NGOÀI ô đó: ô kia là máy tự suy kỳ vọng từ mã thoát làn đối chứng (tầng thước-của-thước, park 30/08, ngưỡng mở lại không đổi); việc này là người khai ở Cổng 1 và ký ở Cổng Bằng chứng (tầng một). Ranh giới vật hoá bằng lệnh cấm khai 97/127;
- các lối bị loại: pytest `xfail(strict=True)` làm đỏ khi khai mã mà trả 0; lấy mã của eval đầu tiên khi hai eval chung lệnh; suy mã từ văn xuôi của `expected`;
- giới hạn khai: `ui-check`/`judgment` không khai được, ngưỡng mở lại là ngày làn ghim lại chạy được `ui-check`.

- [ ] **Step 2: CONTEXT.md**

```markdown
**đạt-có-giới-hạn**:
Kết quả của một eval máy trả ĐÚNG mã thoát khác 0 mà `evals.yaml` đã khai trước
ở `expected_exit`. Không phải một lượt trượt, cũng không phải PASS trơn: nó sinh
một dòng ở mục Known limits, nên hồ sơ hết xanh-sạch và về Cổng Bằng chứng cho
người quyết. Khác **cannotRun** — cannotRun là hạ tầng chấm hỏng, đạt-có-giới-hạn
là tiền đề của sản phẩm thiếu và điều đó đã được khai trước.
_Avoid_: pass có điều kiện, soft fail, «trượt nhưng chấp nhận được».
```

- [ ] **Step 3: GUIDE §7.1 và INIT-CI-COPY-LIST**

GUIDE: một đoạn nói làn ghim lại chấm theo kỳ vọng đã khai, luật hai vế, và giới hạn `ui-check`/`judgment`.

`commands/acceptance-init.md`: nối vào chú thích của `lib/eval-yaml.cjs` rằng nó cũng là nguồn rút mã thoát mong đợi mà luật nhất-quán L1 và luật ghim lại dùng; thiếu nó thì cả hai fail-closed.

- [ ] **Step 4: Chạy chân `tai-lieu` và lưới thường trực**

Run: `bash _acceptance/eval-khai-ma-thoat-mong-doi/rang.sh --chan tai-lieu && node tests/scripts/consumer-esm.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add GUIDE.md CONTEXT.md docs/adr/0016-eval-khai-ma-thoat-mong-doi.md commands/acceptance-init.md
git commit -m "docs: ADR 0016, term đạt-có-giới-hạn, GUIDE §7.1, chú thích danh sách chép"
```

---

### Task 9: Lưới trọn cây và bản đồ sản phẩm

- [ ] **Step 1: Bốn suite cộng bản đồ**

Run:
```bash
bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && \
bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh && \
node scripts/product-map.mjs --root . --check
```
Expected: exit 0 cả năm. `tests/hooks/run-tests.sh` phải xanh mà KHÔNG được sửa — đó là vùng của hồ sơ mốc.

- [ ] **Step 2: Cổng trước gộp**

Run: `bash scripts/pre-merge-check.sh . --base origin/main`
Expected: không dòng `VIOLATION` nào thuộc slug `eval-khai-ma-thoat-mong-doi`.

- [ ] **Step 3: Commit dọn nếu có**

```bash
git add -A && git commit -m "chore: lưới trọn cây xanh sau hồ sơ eval-khai-ma-thoat-mong-doi"
```
