# het-gio-khong-phai-truot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (2 task phụ thuộc tuần tự — KHÔNG fan-out). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verifier bị công cụ giết không còn sinh REJECT giả — luật timeout một nguồn trong prompt 3 lane, field `killedByTool`, routing JS ép về BLOCKED.

**Architecture:** Một const trong marker `TOOL-KILL-RULE` nội suy vào prompt machine/ui/baseline; schema 3 lane thêm `killedByTool` optional; hàm thuần `normKill` ép `killedByTool=true → cannotRun=true` trước mọi merge → routing BLOCKED sẵn có gánh phần còn lại. Phép đo: W25–W27 trong suite workflows (mutant srcOverride chạy chiều đỏ cùng lượt) + răng hồ sơ ghim dòng stdout.

**Tech Stack:** JS thuần trong vm-realm (harness tests/workflows), bash cho răng.

**Spec:** docs/superpowers/specs/2026-08-18-het-gio-khong-phai-truot-design.md

## Global Constraints

- Script workflow tự chứa, CẤM `Date`/fs — mọi logic mới là JS thuần trong file.
- Engine KHÔNG grep nội dung output để đoán tool-kill (Never của contract).
- Mọi field mới optional — suite tồn kho W01–W24 xanh nguyên, không sửa case cũ.
- Đường dẫn trong test/răng suy từ vị trí script, không hardcode ROOT.
- Thứ tự nội suy `${TOOL_KILL_RULE}` trong source PHẢI là machine → ui → baseline (mutant đánh index theo thứ tự).

---

### Task 1: Engine + phép đo W25–W27 (TDD)

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (marker const trước MACHINE_SCHEMA ~58; schema ~58-84, ~190-209; normKill trước merge ~486; 3 prompt ~422/~440/~474)
- Test: `tests/workflows/acceptance-verify.test.mjs` (thêm W25–W27 trước `summary(...)`)

**Interfaces:**
- Produces: const `TOOL_KILL_RULE` (template literal, một dòng, trong marker `// <<<TOOL-KILL-RULE` … `// TOOL-KILL-RULE>>>`); const `TOOL_KILL_REASON = 'bi cong cu giet (timeout tool/output cat) — exit code khong phai cua lenh'`; hàm `normKill(r)`; field schema `killedByTool` (machine/ui/baseline-item). Răng Task 2 ghim các tên case: `W25 rule rut tu marker` · `W25 machine|ui|baseline prompt chua TOOL-KILL-RULE` · `W25 schema killedByTool` · `W25 dung 3 luot noi suy rule` · `W25 mutant machine|ui|baseline: xoa rule -> chi <lane> do` · `W26 killedByTool -> BLOCKED` · `W26 reason agent giu nguyen van` · `W26 reason trong -> khuon ghim bi cong cu giet` · `W26 doi chung: exit 1 that -> REJECT` · `W27 baseline killed -> n-a` · `W27 doi chung: baseline exit 1 that -> red` — đổi tên là vỡ Task 2.

- [ ] **Step 1: Viết W25–W27 (failing)** — thêm vào cuối `tests/workflows/acceptance-verify.test.mjs`, ngay TRƯỚC dòng `summary(`:

```js
// ── W25: TOOL-KILL-RULE — một nguồn marker, 3 lane, 3 mutant cô lập ──────────
{
  const src = readFileSync(WF, 'utf8');
  const mBlock = src.match(/\/\/ <<<TOOL-KILL-RULE\n([\s\S]*?)\n\/\/ TOOL-KILL-RULE>>>/);
  const ruleM = mBlock && mBlock[1].match(/`([\s\S]*?)`/);
  const RULE = ruleM ? ruleM[1] : '';
  check('W25 rule rut tu marker', RULE.includes('600000') && RULE.includes('killedByTool') && RULE.includes('bi cong cu giet'), RULE.slice(0, 60));

  const tkArgs = {
    slug: 'tk', round: 1, riskTier: 'T2',
    evals: [
      { id: 'E1', criterion: 'AC-1', executor: 'test', cmd: './suite.sh', ref: 'config:executors.test.x', expected: 'x' },
      { id: 'E5', criterion: 'AC-2', executor: 'ui-check', expected: 'trang len', steps: ['mo trang'] },
    ],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p.md', templatePath: '/t.md', contractPath: '/c.md',
    invokedAt: '2026-08-18T00:00:00Z',
  };
  const tkRespond = (call) => {
    if (call.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
    if (call.label.startsWith('ui:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false, screenshotPath: 'e.html', observed: 'thay trang len dung expected', networkObserved: 'n-a (driver)' };
    if (call.label === 'baseline:diffBase') return { results: [{ cmd: './suite.sh', baselineExit: 1, cannotRun: false }] };
    if (call.label.startsWith('review:')) return { findings: [] };
    if (call.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (call.label === 'synthesize:report') return { report: 'r', findings: 'f' };
    return null;
  };
  const { calls } = await runWorkflow(WF, tkArgs, tkRespond);
  const first = (cs, p) => byLabel(cs, p)[0];
  check('W25 machine prompt chua TOOL-KILL-RULE', RULE && first(calls, 'machine:').prompt.includes(RULE));
  check('W25 ui prompt chua TOOL-KILL-RULE', RULE && first(calls, 'ui:').prompt.includes(RULE));
  check('W25 baseline prompt chua TOOL-KILL-RULE', RULE && first(calls, 'baseline:').prompt.includes(RULE));
  const mS = first(calls, 'machine:').opts.schema, uS = first(calls, 'ui:').opts.schema,
    bS = first(calls, 'baseline:').opts.schema.properties.results.items;
  check('W25 schema killedByTool',
    [mS, uS, bS].every(s => s.properties.killedByTool && s.properties.killedByTool.type === 'boolean'
      && !(s.required || []).includes('killedByTool')));

  const TOK = '${TOOL_KILL_RULE}';
  const idxs = [];
  for (let i = src.indexOf(TOK); i !== -1; i = src.indexOf(TOK, i + 1)) idxs.push(i);
  check('W25 dung 3 luot noi suy rule', idxs.length === 3, String(idxs.length));
  const LANES = ['machine', 'ui', 'baseline'];
  for (let k = 0; k < LANES.length; k++) {
    const mutated = src.slice(0, idxs[k]) + src.slice(idxs[k] + TOK.length);
    const { calls: mc } = await runWorkflow(WF, tkArgs, tkRespond, mutated);
    const pr = (lane) => first(mc, lane + ':').prompt;
    check(`W25 mutant ${LANES[k]}: xoa rule -> chi ${LANES[k]} do`,
      RULE && !pr(LANES[k]).includes(RULE) && LANES.filter((_, j) => j !== k).every(l => pr(l).includes(RULE)));
  }
}

// ── W26: routing killedByTool ⇒ BLOCKED (2 nhánh reason) + đối chứng REJECT ──
{
  const mkArgs = () => ({
    slug: 'tk', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'bash tests/plugins/run-tests.sh', ref: 'config:executors.test.plugins', expected: 'x' }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p.md', templatePath: '/t.md', contractPath: '/c.md', invokedAt: '2026-08-18T00:00:00Z',
  });
  // CÙNG fixture sự cố r5: exit 1 của công cụ, output cắt, KHÔNG dòng tổng kết
  const incident = (extra) => (call) => {
    if (call.label.startsWith('machine:')) return {
      exitCode: 1, outputTail: 'RUN: P188 executor-key hop nhat…\n[output bi cat o 10000 ky tu]',
      runId: '', cannotRun: false, ...extra,
    };
    if (call.label === 'baseline:diffBase') return { results: [{ cmd: 'bash tests/plugins/run-tests.sh', baselineExit: 0, cannotRun: false }] };
    if (call.label.startsWith('review:')) return { findings: [] };
    if (call.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (call.label === 'synthesize:report') return { report: 'r', findings: 'f' };
    return null;
  };
  const rA = await runWorkflow(WF, mkArgs(), incident({ killedByTool: true, reason: 'bi cong cu giet o 118 giay' }));
  check('W26 killedByTool -> BLOCKED',
    rA.result.verdict === 'BLOCKED' && rA.result.failedEvals.length === 0
    && rA.result.failedCommands.length === 0 && /bi cong cu giet/.test(rA.result.blocked[0].reason),
    rA.result.verdict);
  check('W26 reason agent giu nguyen van', rA.result.blocked[0].reason === 'bi cong cu giet o 118 giay');
  const rB = await runWorkflow(WF, mkArgs(), incident({ killedByTool: true, reason: '' }));
  check('W26 reason trong -> khuon ghim bi cong cu giet',
    rB.result.verdict === 'BLOCKED' && /bi cong cu giet \(timeout tool\/output cat\)/.test(rB.result.blocked[0].reason));
  const rC = await runWorkflow(WF, mkArgs(), incident({ killedByTool: false, outputTail: 'FAIL: P188\nResults: 3 passed, 1 failed' }));
  check('W26 doi chung: exit 1 that -> REJECT',
    rC.result.verdict === 'REJECT' && rC.result.failedEvals.includes('E1'));
  const lg = JSON.parse(rA.result.runLog[0]);
  check('W26 run-log ghi cannot_run, khong ghi exit gia', lg.cannot_run === true && lg.exit_code === null);
}

// ── W27: baseline bị giết → n-a, không red giả ───────────────────────────────
{
  const mkArgs = () => ({
    slug: 'tk', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: './suite.sh', ref: 'config:executors.test.x', expected: 'x' }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p.md', templatePath: '/t.md', contractPath: '/c.md', invokedAt: '2026-08-18T00:00:00Z',
  });
  const respond = (bl) => (call) => {
    if (call.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'Results: 9 passed', runId: '', cannotRun: false };
    if (call.label === 'baseline:diffBase') return { results: [bl] };
    if (call.label.startsWith('review:')) return { findings: [] };
    if (call.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (call.label === 'synthesize:report') return { report: 'r', findings: 'f' };
    return null;
  };
  const rK = await runWorkflow(WF, mkArgs(), respond({ cmd: './suite.sh', baselineExit: 1, cannotRun: false, killedByTool: true }));
  const synthK = byLabel(rK.calls, 'synthesize:report')[0].prompt;
  check('W27 baseline killed -> n-a',
    rK.result.nonDiscriminating.length === 0 && synthK.includes('"baseline":"n-a"') && !synthK.includes('"baseline":"red"'));
  const rR = await runWorkflow(WF, mkArgs(), respond({ cmd: './suite.sh', baselineExit: 1, cannotRun: false }));
  const synthR = byLabel(rR.calls, 'synthesize:report')[0].prompt;
  check('W27 doi chung: baseline exit 1 that -> red',
    rR.result.nonDiscriminating.length === 0 && synthR.includes('"baseline":"red"'));
}
```

Ghi chú khớp harness: `readFileSync` + `WF` + `byLabel` đã có sẵn ở đầu file test (kiểm bằng mắt trước khi chạy; thiếu helper nào thì import/khai đúng nếp file).

- [ ] **Step 2: Chạy để thấy ĐỎ đúng chỗ**

Run: `node tests/workflows/acceptance-verify.test.mjs 2>&1 | grep -E "W25|W26|W27|Results"`
Expected: FAIL toàn bộ W25 (marker chưa tồn tại), W26 (BLOCKED mong đợi nhưng ra REJECT — đúng lỗi đang vá), W27 (n-a mong đợi nhưng ra red). W26 «doi chung» có thể PASS sẵn (hành vi cũ) — được phép.

- [ ] **Step 3: Sửa engine `feature-loop/workflows/acceptance-verify.js`** — 4 cụm edit:

(a) Ngay TRƯỚC `const MACHINE_SCHEMA = {`:

```js
// Luật chống «hạ tầng mạo danh vật»: verifier chạy lệnh qua Bash tool có trần
// thời gian mặc định (~120s) NGẮN hơn nhiều suite và trần output riêng — lệnh
// bị công cụ giết trả exit code CỦA CÔNG CỤ, không phải của lệnh (vấp thật
// release-2-2-0 S4 r5: suite 108s đơn lẻ, dưới tải bị giết ở 118s → REJECT giả
// 4 eval). MỘT nguồn: prompt cả 3 lane (machine/ui/baseline) nội suy nguyên
// khối này; test W25 rút chuỗi từ marker — không chép tay. Nhận diện là việc
// AGENT (nó thấy tool result thật); JS chỉ phòng thủ trên field cấu trúc
// killedByTool (normKill dưới) — KHÔNG grep nội dung output trong engine:
// chuỗi tổng kết là của suite từng repo, engine phục vụ mọi repo.
// <<<TOOL-KILL-RULE
const TOOL_KILL_RULE = `TRAN THOI GIAN CONG CU: khi goi Bash chay lenh, LUON dat tham so timeout >= 600000 (ms) — tran mac dinh cua cong cu (~120s) NGAN hon nhieu suite; lenh vuot tran se bi CONG CU giet va exit code luc do la cua cong cu, KHONG phai cua lenh. Neu lenh van bi cong cu dung (tool result bao timeout/killed, hoac output bi CAT giua chung truoc dong tong ket cuoi cua lenh) → DO KHONG PHAI ket qua that: khai cannotRun=true + killedByTool=true + reason "bi cong cu giet o <so giay> giay" kem dau hieu (timeout tool / output cat). TUYET DOI khong bao exitCode nhu the lenh tu fail va khong doan PASS/FAIL tu output cut.`
// TOOL-KILL-RULE>>>
```

(b) Schema: thêm vào `properties` của MACHINE_SCHEMA, UI_SCHEMA, và `results.items.properties` của BASELINE_SCHEMA (cả ba KHÔNG vào `required`):

```js
    killedByTool: { type: 'boolean', description: 'true khi lenh bi CONG CU dung (timeout tool/output cat) — exit code khong phai cua lenh; di kem cannotRun=true' },
```

(c) Prompt 3 lane — thứ tự xuất hiện trong file phải machine → ui → baseline:
- Prompt machine: sau câu `...cannotRun=true + reason cu the.` thêm `\n\n${TOOL_KILL_RULE}` (trong cùng template literal).
- Prompt ui: thêm dòng quy tắc cuối, trước dòng `- exitCode=0 CHI khi...` HOẶC ngay sau nó: `` `- ${TOOL_KILL_RULE}\n` `` (giữ là một bullet của khối Quy tac).
- Prompt baseline: sau câu `...TUYET DOI KHONG bia exit.` thêm `\n${TOOL_KILL_RULE}` (killedByTool đã có trong schema item (b)).

(d) Routing — ngay TRƯỚC khối `// ---- variance-N: gộp các lần chạy ...` (dòng `const runsByCmd`):

```js
// killedByTool ⇒ cannotRun: không tin một lời khai đơn lẻ — đúng ca sự cố
// (agent khai cannotRun=false + exitCode=1 khi lệnh bị giết). reason agent giữ
// NGUYÊN VĂN nếu có; trống → điền khuôn ghim để card BLOCKED không rỗng.
// Áp cho CẢ BA lane trước mọi merge; baseline → cannotRun → baselineStatus n-a.
const TOOL_KILL_REASON = 'bi cong cu giet (timeout tool/output cat) — exit code khong phai cua lenh'
const normKill = r => (r && r.killedByTool === true)
  ? { ...r, cannotRun: true, reason: (typeof r.reason === 'string' && r.reason.trim()) ? r.reason : TOOL_KILL_REASON }
  : r
```

rồi áp vào 3 điểm đọc:
- `for (const r of (machineRaw || []).filter(Boolean)) {` → `for (const r of (machineRaw || []).filter(Boolean).map(normKill)) {`
- `machine.push(...(uiRaw || []).filter(Boolean).map(r => ({...` → `machine.push(...(uiRaw || []).filter(Boolean).map(normKill).map(r => ({...`
- `const baselineByCmd = new Map(((baselineRaw && baselineRaw.results) || []).map(b => [b.cmd, b]))` → `const baselineByCmd = new Map(((baselineRaw && baselineRaw.results) || []).map(normKill).map(b => [b.cmd, b]))`

- [ ] **Step 4: Chạy trọn suite workflows — xanh hết**

Run: `bash tests/workflows/run-tests.sh`
Expected: exit 0, mọi case W01–W27 PASS (tồn kho + mới).

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(het-gio-khong-phai-truot): TOOL-KILL-RULE 3 lane + killedByTool + normKill — tool-kill thành BLOCKED, hết REJECT giả (W25–W27)"
```

---

### Task 2: Răng hồ sơ + đăng ký executor key

**Files:**
- Create: `_acceptance/het-gio-khong-phai-truot/rang.sh`
- Modify: `_acceptance/config.yaml` (thêm key `rang_hgkpt` vào `executors.script`, KHÔNG đụng `feature_loop.suite_keys`)

**Interfaces:**
- Consumes: các tên case W25–W27 từ Task 1 (ghim nguyên văn), harness in `  PASS: <tên>` và `Results: N passed, M failed`.
- Produces: `executors.script.rang_hgkpt = "bash _acceptance/het-gio-khong-phai-truot/rang.sh"` — evals E1–E6, E8 trỏ tới.

- [ ] **Step 1: Viết rang.sh**

```bash
#!/usr/bin/env bash
# Răng hồ sơ het-gio-khong-phai-truot — ghim ĐÚNG dòng case W25–W27 trong
# stdout suite workflows (nếp p194: không tin mã thoát trọn suite — trên
# diffBase suite cũng xanh nên exit code không phân biệt cây cũ/mới) + chân
# tồn-kho đếm-nguồn (AC-7). Base tường minh origin/main, không vào suite
# vĩnh viễn, chết theo hồ sơ khi merge.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1
FAILS=0
do_fail() { echo "DO: $1"; FAILS=$((FAILS+1)); }

TEST_FILE="tests/workflows/acceptance-verify.test.mjs"
OUT="$(node "$TEST_FILE" 2>&1)"

# ── Chân 1: ghim dòng case mới (một mảng PIN, tự-phá-thử từng dòng) ──────────
PINS=(
  "W25 rule rut tu marker"
  "W25 machine prompt chua TOOL-KILL-RULE"
  "W25 ui prompt chua TOOL-KILL-RULE"
  "W25 baseline prompt chua TOOL-KILL-RULE"
  "W25 schema killedByTool"
  "W25 dung 3 luot noi suy rule"
  "W25 mutant machine: xoa rule -> chi machine do"
  "W25 mutant ui: xoa rule -> chi ui do"
  "W25 mutant baseline: xoa rule -> chi baseline do"
  "W26 killedByTool -> BLOCKED"
  "W26 reason agent giu nguyen van"
  "W26 reason trong -> khuon ghim bi cong cu giet"
  "W26 doi chung: exit 1 that -> REJECT"
  "W26 run-log ghi cannot_run, khong ghi exit gia"
  "W27 baseline killed -> n-a"
  "W27 doi chung: baseline exit 1 that -> red"
)
for nm in "${PINS[@]}"; do
  if ! printf '%s\n' "$OUT" | grep -qF "PASS: $nm"; then
    do_fail "thieu dong PASS: $nm"
    continue
  fi
  # tự-phá-thử: bản sao stdout xoá đúng dòng → grep của chính chân này phải trượt
  MUT="$(printf '%s\n' "$OUT" | grep -vF "PASS: $nm")"
  if printf '%s\n' "$MUT" | grep -qF "PASS: $nm"; then
    do_fail "tu-pha-thu khong do duoc: $nm"
  fi
done

# ── Chân 2: tồn-kho — tên case rút từ bản diffBase (đếm nguồn, không hardcode) ─
BASE_SRC="$(git show origin/main:"$TEST_FILE" 2>/dev/null)"
if [ -z "$BASE_SRC" ]; then
  do_fail "TON-KHO: khong doc duoc origin/main:$TEST_FILE"
else
  N_OLD=0
  while IFS= read -r nm; do
    [ -z "$nm" ] && continue
    if ! grep -qF "check('$nm'" "$TEST_FILE"; then
      do_fail "TON-KHO: case cu bi sua/xoa: $nm"
      continue
    fi
    if ! printf '%s\n' "$OUT" | grep -qF "PASS: $nm"; then
      do_fail "TON-KHO: thieu dong PASS: $nm"
      continue
    fi
    N_OLD=$((N_OLD+1))
  done <<EOF_NAMES
$(printf '%s' "$BASE_SRC" | grep -o "check('[^']*'" | sed "s/^check('//;s/'\$//" | sort -u)
EOF_NAMES
  if [ "$N_OLD" -lt 1 ]; then
    do_fail "TON-KHO: 0 case cu rut duoc tu diffBase — grep nguon hong (sanity counter)"
  else
    echo "PASS: TON-KHO $N_OLD case cu nguyen van"
  fi
fi

if [ "$FAILS" -gt 0 ]; then
  echo "RANG-HGKPT: $FAILS loi"
  exit 1
fi
echo "RANG-HGKPT OK (${#PINS[@]} pin + $N_OLD ton kho)"
```

- [ ] **Step 2: Chạy chiều đỏ TRƯỚC chiều xanh (MEASURE-BIRTH của chính răng)**

Run: `bash _acceptance/het-gio-khong-phai-truot/rang.sh` trên cây HIỆN TẠI (Task 1 đã merge vào worktree) → Expected: `RANG-HGKPT OK`. Rồi phá thử một lần: `sed -i.bak "s/W26 killedByTool -> BLOCKED/W26 killedByTool -> BLOCKEDx/" tests/workflows/acceptance-verify.test.mjs && bash _acceptance/het-gio-khong-phai-truot/rang.sh; mv tests/workflows/acceptance-verify.test.mjs.bak tests/workflows/acceptance-verify.test.mjs` → Expected: đỏ ghim `thieu dong PASS: W26 killedByTool -> BLOCKED` (và chân tồn-kho vẫn hoạt động sau khi hoàn tác).

- [ ] **Step 3: Đăng ký key vào `_acceptance/config.yaml`** — thêm dưới các key răng hồ sơ hiện có trong `executors.script`:

```yaml
    # Vật của hồ sơ het-gio-khong-phai-truot — răng ghim dòng case W25–W27 +
    # chân tồn-kho đếm-nguồn. Cùng nếp không-vào-suite-vĩnh-viễn.
    rang_hgkpt: "bash _acceptance/het-gio-khong-phai-truot/rang.sh"
```

- [ ] **Step 4: Verify key resolve + răng xanh**

Run: `python3 -c "import yaml;print(yaml.safe_load(open('_acceptance/config.yaml'))['executors']['script']['rang_hgkpt'])" && bash _acceptance/het-gio-khong-phai-truot/rang.sh`
Expected: in đúng lệnh + `RANG-HGKPT OK`.

- [ ] **Step 5: Commit**

```bash
git add _acceptance/het-gio-khong-phai-truot/rang.sh _acceptance/config.yaml
git commit -m "chore(het-gio-khong-phai-truot): răng hồ sơ ghim W25–W27 + chân tồn-kho; đăng ký rang_hgkpt"
```

---

## Bảng task (cho S3/S4)

| Task | Files | Verify per-task | Phục vụ eval | independent |
|---|---|---|---|---|
| 1 | acceptance-verify.js, acceptance-verify.test.mjs | `bash tests/workflows/run-tests.sh` exit 0 | E1–E7 | false |
| 2 | rang.sh, config.yaml | `bash _acceptance/het-gio-khong-phai-truot/rang.sh` → OK + một lượt phá-thử đỏ | E1–E6, E8 | false (cần tên case Task 1) |
