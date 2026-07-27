# S4 Scope-Triage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm ngăn thứ ba "thật nhưng ngoài hợp đồng" cho confirmed review findings ở S4, để finding trong-hợp-đồng thì máy tự sửa còn finding ngoài-hợp-đồng thì human quyết ở Gate 2 — chặn vòng xoáy sửa-hành-vi-không-đặc-tả.

**Architecture:** Một stage TRIAGE mới trong `feature-loop/workflows/acceptance-verify.js` chạy sau adversarial-verify, dùng 1 agent fresh đọc `contract.md` + confirmed findings và phân loại từng finding. Verdict routing thêm đúng một vế `REJECT` (chỉ cho finding `high` + `inContract`, đứng DƯỚI `BLOCKED`). Cluster signal tính bằng JS thuần từ union `paths` của evals. Kết quả triage chỉ đi vào `review-findings.md` (ngoài hook) — `evidence-report.md` giữ nguyên shape.

**Tech Stack:** JavaScript thuần trong Workflow sandbox (không fs, không `Date`, không import); bash test suites; markdown SKILL/command files; `tests/workflows/harness.mjs` (vm realm + stand-in agent).

## Global Constraints

- **Nguồn sự thật là `feature-loop/`, `codex/`, `commands/`, `skills/`, `scripts/`, `lib/`, `hooks/`, `vendor/`** — KHÔNG sửa gì dưới `plugins/` (build mirror). Sau khi sửa nguồn PHẢI chạy `bash scripts/sync-plugin-packages.sh` và commit mirror cùng lượt.
- **Bất biến CLAUDE.md #4:** mọi assertion âm tính phải có (a) đối chứng dương — bản nguyên vẹn XANH trước khi tin bản bị tiêm là ĐỎ, và (b) ghim đúng thông điệp mong đợi, không chỉ mã thoát. Quét cả file tìm mọi case cùng hình dạng.
- **Workflow sandbox cấm:** `Date.now()`, `new Date()`, `Math.random()`, filesystem, `import`/`require`. Timestamp đến từ `args.invokedAt`.
- **Từ vựng CONTEXT.md:** dùng term chuẩn của kit; tránh mọi từ trong mục `_Avoid_`.
- **Verdict enum KHÔNG đổi:** `PASS` | `PENDING-JUDGMENT` | `REJECT` | `BLOCKED`.
- **`evidence-report.md` không có field/section triage nào** — hook `acceptance-evidence-gate.js` không được biết feature này tồn tại.
- Case suite workflows dùng tiền tố `WT-T*`; case plugins dùng dải `P49`–`P52`.

## File Structure

| File | Trách nhiệm | Task |
|---|---|---|
| `_acceptance/config.yaml` | thêm `executors.test.workflows` + `feature_loop.suite_keys` | 1 |
| `.github/workflows/gate.yml` | step chạy suite workflows trong CI | 1 |
| `feature-loop/workflows/acceptance-verify.js` | TRIAGE stage, verdict vế mới, cluster signal, synthesize prompt | 2, 3, 4 |
| `tests/workflows/acceptance-verify.test.mjs` | case WT-T1…WT-T9 | 2, 3, 4 |
| `feature-loop/skills/feature-loop/SKILL.md` | args `contractPath`, routing fix-list, gói Gate 2 | 5 |
| `commands/acceptance-card.md` | render khối "Ngoài hợp đồng" + nhánh backward | 6 |
| `codex/acceptance-gate/skills/acceptance-card/SKILL.md` | như trên, bản codex | 6 |
| `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md` | fixture cho judge E11 | 6 |
| `tests/plugins/run-tests.sh` | case P49–P52 | 1, 6, 7 |
| `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` | parity bước triage | 7 |
| `*/.claude-plugin/plugin.json`, `codex/*/.codex-plugin/plugin.json`, `plugins/**` | bump + mirror | 8 |

---

### Task 1: Wiring suite `tests/workflows` vào config + CI

Suite `tests/workflows/run-tests.sh` tồn tại từ Đợt 5 nhưng mồ côi — không config nào trỏ tới, không CI nào chạy. Mọi eval của feature này dùng nó làm executor, nên wiring phải xong trước.

**Files:**
- Modify: `_acceptance/config.yaml` (block `executors.test`, block `feature_loop.suite_keys`)
- Modify: `.github/workflows/gate.yml` (sau step `tests/plugins/run-tests.sh`)
- Test: `tests/plugins/run-tests.sh` (case P52 mới, thêm ở cuối trước dòng tổng kết)

**Interfaces:**
- Consumes: không có (task đầu).
- Produces: config key `executors.test.workflows` = `"bash tests/workflows/run-tests.sh"` — mọi eval của feature này resolve `config:executors.test.workflows` qua nó.

- [ ] **Step 1: Viết case P52 (sẽ đỏ)**

Thêm vào `tests/plugins/run-tests.sh`, ngay trước phần in kết quả tổng kết:

```bash
# ── P52: suite tests/workflows phai duoc wire vao CI + config ────────────────
# AC-13 cua s4-scope-triage: suite ton tai tu Dot 5 nhung mo coi — khong config
# nao tro toi, khong CI nao chay. Eval cua feature nay dung no lam executor, nen
# wiring LA deliverable, khong phai loi hua.
echo "P52 tests/workflows wired vao gate.yml + config.yaml"
P52OK=1
P52GATE="$ROOT/.github/workflows/gate.yml"
P52CFG="$ROOT/_acceptance/config.yaml"
if ! grep -q 'bash tests/workflows/run-tests.sh' "$P52GATE"; then
  echo "     gate.yml THIEU step chay tests/workflows/run-tests.sh"
  P52OK=0
fi
if ! grep -q '^    workflows: "bash tests/workflows/run-tests.sh"$' "$P52CFG"; then
  echo "     config.yaml THIEU executors.test.workflows"
  P52OK=0
fi
if ! grep -q '^    - executors.test.workflows$' "$P52CFG"; then
  echo "     config.yaml THIEU executors.test.workflows trong feature_loop.suite_keys"
  P52OK=0
fi
# Doi chung dot bien: ban sao gate.yml bi xoa step -> phep kiem phai DO.
P52CP="$(mktemp)"
grep -v 'bash tests/workflows/run-tests.sh' "$P52GATE" > "$P52CP"
if grep -q 'bash tests/workflows/run-tests.sh' "$P52CP"; then
  echo "     dot bien KHONG hieu luc — phep kiem da chet"
  P52OK=0
fi
rm -f "$P52CP"
if [ "$P52OK" -eq 1 ]; then
  pass "P52 tests/workflows wired (gate.yml + config executors + suite_keys + dot bien)"
else
  fail "P52 tests/workflows wired (gate.yml + config executors + suite_keys + dot bien)"
fi
```

- [ ] **Step 2: Chạy để thấy nó ĐỎ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -A3 P52`
Expected: `FAIL: P52 ...` kèm 3 dòng `THIEU` — chứng minh case phân biệt được trạng thái chưa-wire.

- [ ] **Step 3: Wire config.yaml**

Trong `_acceptance/config.yaml`, block `executors.test` thêm dòng cuối:

```yaml
  test:
    scripts: "bash tests/scripts/run-tests.sh"
    hooks: "bash tests/hooks/run-tests.sh"
    plugins: "bash tests/plugins/run-tests.sh"
    workflows: "bash tests/workflows/run-tests.sh"
```

Và block `feature_loop.suite_keys` thêm dòng cuối:

```yaml
feature_loop:
  suite_keys:
    # Chạy mỗi vòng verify. Ba suite + hai cổng chống trôi (mirror, từ vựng).
    - executors.test.scripts
    - executors.test.hooks
    - executors.test.plugins
    - executors.script.mirror_sync
    - executors.test.workflows
```

- [ ] **Step 4: Wire gate.yml**

Trong `.github/workflows/gate.yml`, ngay sau step chạy `tests/plugins/run-tests.sh`, thêm:

```yaml
      - name: Workflow script tests
        run: bash tests/workflows/run-tests.sh
```

(Giữ nguyên cách đặt `name:`/`run:` của các step lân cận — đọc 3 step trước đó và bắt chước.)

- [ ] **Step 5: Chạy lại để thấy XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep P52`
Expected: `PASS: P52 tests/workflows wired (gate.yml + config executors + suite_keys + dot bien)`

Run: `bash tests/workflows/run-tests.sh`
Expected: `Results: all workflow tests passed` (suite hiện tại phải xanh trước khi ta thêm case mới vào nó).

- [ ] **Step 6: Commit**

```bash
git add _acceptance/config.yaml .github/workflows/gate.yml tests/plugins/run-tests.sh
git commit -m "ci(s4-scope-triage): wire suite tests/workflows vao config + gate.yml (AC-13)"
```

---

### Task 2: TRIAGE stage + verdict vế mới

Trái tim của feature. Agent triage đọc contract + confirmed findings, phân 3 ngăn; verdict thêm vế REJECT cho `high` + `inContract`, đứng dưới `BLOCKED`.

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (khối schema ~dòng 114-130; sau khối `confirmedFindings` ~dòng 437; verdict routing ~dòng 505-511; return object ~dòng 562-570; comment args ~dòng 13-47)
- Test: `tests/workflows/acceptance-verify.test.mjs`

**Interfaces:**
- Consumes: `confirmedFindings` (mảng `{title, file, line?, severity, detail, source, unverified?}`) từ stage Review; `args.contractPath` (abs path, do SKILL truyền — Task 5).
- Produces:
  - `triaged`: mảng `{...finding, inContract: boolean, acRef: string|null, rationale: string, proposal: 'known-limits'|'new-contract'|null}` — mọi confirmed finding đã verify.
  - `triageFailed: boolean` — true khi agent chết cả retry HOẶC `args.contractPath` vắng/không đọc được.
  - `rejectFindings`: mảng finding có `inContract === true` (mọi severity) — SKILL dùng làm fix-list.
  - `result.confirmedFindings` giữ nguyên nghĩa cũ (mọi confirmed finding) để không vỡ consumer cũ.

- [ ] **Step 1: Viết các case failing WT-T1…WT-T6, WT-T9**

Thêm vào cuối `tests/workflows/acceptance-verify.test.mjs`, TRƯỚC dòng `summary(...)`. Đọc đầu file để lấy đúng tên helper đang dùng (`runWorkflow`, `check`, và hàm dựng args nếu có) rồi viết theo đúng khuôn đó. Dưới đây là nội dung logic phải có — giữ nguyên tên case:

```javascript
// ── WT-T*: scope-triage (s4-scope-triage) ───────────────────────────────────
// Ngan thu ba: finding THAT nhung NGOAI hop dong khong bao gio keo may di sua.
const AV = new URL('../../feature-loop/workflows/acceptance-verify.js', import.meta.url).pathname;

// Args toi thieu: 1 eval may xanh, khong judgment, khong suite.
function triageArgs(over = {}) {
  return {
    slug: 'demo', round: 1, riskTier: 'T2',
    repoRoot: '/repo', diffBase: 'main', invokedAt: '2026-07-27T00:00:00Z',
    personasPath: '/p/personas.md', templatePath: '/p/template.md',
    contractPath: '/repo/_acceptance/demo/contract.md',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'npm test', ref: 'config:executors.test.unit', paths: ['src/**'] }],
    suiteCommands: [],
    ...over,
  };
}

// responder dung chung: machine xanh, khong judge, review tra findings da cho,
// triage tra ket qua da cho (hoac nem loi de mo phong agent chet).
function triageResponder({ findings, triage, triageThrows = false, machineExit = 0, machineCannotRun = false }) {
  return async (call) => {
    const l = call.label || '';
    if (l.startsWith('machine:')) return { cmd: 'npm test', exitCode: machineExit, cannotRun: machineCannotRun, reason: machineCannotRun ? 'thieu env' : '', outputTail: 'ok', runId: 'r1' };
    if (l.startsWith('review:')) return { findings: findings.filter(f => !f.unverified) };
    if (l.startsWith('refute:')) return { refuted: false, reason: 'that' };
    if (l.startsWith('triage')) { if (triageThrows) throw new Error('triage chet'); return { triaged: triage }; }
    if (l.startsWith('baseline')) return { results: [] };
    if (l.startsWith('provenance')) return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (l.startsWith('scribe')) return { written: true, lineCount: 1 };
    return { reportPath: '/repo/r.md', findingsPath: '/repo/f.md' };
  };
}

const F_HIGH = { title: 'xoa truoc khi clone', file: 'src/install.ts', severity: 'high', detail: 'rmSync truoc git.clone' };
const F_MED = { ...F_HIGH, title: 'so chuoi tho', severity: 'medium' };
const F_OUT = { title: 'docs lech', file: 'other/plugins.md', severity: 'high', detail: 'huong dan sai' };

// WT-T1: high + in-contract, evals xanh -> REJECT + nam trong rejectFindings
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_HIGH],
    triage: [{ title: F_HIGH.title, inContract: true, acRef: 'AC-1', rationale: 'cham AC-1', proposal: null }],
  }));
  check('WT-T1 high in-contract -> REJECT', result.verdict === 'REJECT', `verdict=${result.verdict}`);
  check('WT-T1 finding nam trong rejectFindings', (result.rejectFindings || []).some(f => f.title === F_HIGH.title));
}

// WT-T1b (doi chung duong): CUNG cau hinh, chi khac severity medium -> PASS
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_MED],
    triage: [{ title: F_MED.title, inContract: true, acRef: 'AC-1', rationale: 'cham AC-1', proposal: null }],
  }));
  check('WT-T1b medium in-contract -> PASS (nguong chi high)', result.verdict === 'PASS', `verdict=${result.verdict}`);
}

// WT-T2: high + out-of-contract, evals xanh -> PASS, KHONG vao rejectFindings
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_OUT],
    triage: [{ title: F_OUT.title, inContract: false, acRef: null, rationale: 'ngoai scope', proposal: 'known-limits' }],
  }));
  check('WT-T2 high out-of-contract -> PASS', result.verdict === 'PASS', `verdict=${result.verdict}`);
  check('WT-T2 KHONG vao rejectFindings', !(result.rejectFindings || []).some(f => f.title === F_OUT.title));
  check('WT-T2 triaged giu proposal', (result.triaged || []).some(t => t.title === F_OUT.title && t.proposal === 'known-limits'));
}

// WT-T3: medium in-contract -> khong REJECT, van co acRef trong triaged
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_MED],
    triage: [{ title: F_MED.title, inContract: true, acRef: 'AC-3', rationale: 'nhe', proposal: null }],
  }));
  check('WT-T3 medium khong REJECT', result.verdict !== 'REJECT', `verdict=${result.verdict}`);
  check('WT-T3 giu acRef', (result.triaged || []).some(t => t.title === F_MED.title && t.acRef === 'AC-3'));
}

// WT-T4: triage agent chet ca retry -> triageFailed, KHONG REJECT du finding high
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_HIGH], triage: [], triageThrows: true,
  }));
  check('WT-T4 triage chet -> triageFailed', result.triageFailed === true);
  check('WT-T4 triage chet -> KHONG REJECT tu finding', result.verdict === 'PASS', `verdict=${result.verdict}`);
  check('WT-T4 rejectFindings rong', (result.rejectFindings || []).length === 0);
}

// WT-T4b (doi chung duong): triage song -> triageFailed false
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_HIGH],
    triage: [{ title: F_HIGH.title, inContract: true, acRef: 'AC-1', rationale: 'x', proposal: null }],
  }));
  check('WT-T4b triage song -> triageFailed false', result.triageFailed === false);
}

// WT-T4c: contractPath vang -> CUNG hanh vi fail-toward-human, KHONG spawn agent triage
{
  const args = triageArgs(); delete args.contractPath;
  const { result, calls } = await runWorkflow(AV, args, triageResponder({
    findings: [F_HIGH],
    triage: [{ title: F_HIGH.title, inContract: true, acRef: 'AC-1', rationale: 'x', proposal: null }],
  }));
  check('WT-T4c thieu contractPath -> triageFailed', result.triageFailed === true);
  check('WT-T4c thieu contractPath -> KHONG REJECT', result.verdict === 'PASS', `verdict=${result.verdict}`);
  check('WT-T4c KHONG spawn agent triage', !calls.some(c => (c.label || '').startsWith('triage')));
}

// WT-T5: eval FAIL + hon hop findings -> rejectFindings CHI co in-contract
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    machineExit: 1,
    findings: [F_HIGH, F_OUT],
    triage: [
      { title: F_HIGH.title, inContract: true, acRef: 'AC-1', rationale: 'cham', proposal: null },
      { title: F_OUT.title, inContract: false, acRef: null, rationale: 'ngoai', proposal: 'new-contract' },
    ],
  }));
  check('WT-T5 eval fail -> REJECT', result.verdict === 'REJECT', `verdict=${result.verdict}`);
  check('WT-T5 rejectFindings CO in-contract', (result.rejectFindings || []).some(f => f.title === F_HIGH.title));
  check('WT-T5 rejectFindings KHONG co out-of-contract', !(result.rejectFindings || []).some(f => f.title === F_OUT.title));
}

// WT-T6: finding unverified khong vao input triage, van giu trong confirmedFindings
{
  const dead = { ...F_HIGH, title: 'refuter chet', unverified: true };
  const { result, calls } = await runWorkflow(AV, triageArgs(), async (call) => {
    const l = call.label || '';
    if (l.startsWith('machine:')) return { cmd: 'npm test', exitCode: 0, cannotRun: false, reason: '', outputTail: 'ok', runId: 'r1' };
    if (l.startsWith('review:')) return { findings: [dead] };
    if (l.startsWith('refute:')) return null; // refuter chet -> unverified
    if (l.startsWith('triage')) return { triaged: [] };
    if (l.startsWith('baseline')) return { results: [] };
    if (l.startsWith('provenance')) return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (l.startsWith('scribe')) return { written: true, lineCount: 1 };
    return { reportPath: '/repo/r.md', findingsPath: '/repo/f.md' };
  });
  const tp = calls.filter(c => (c.label || '').startsWith('triage')).map(c => c.prompt).join('\n');
  check('WT-T6 unverified KHONG vao prompt triage', !tp.includes('refuter chet'));
  check('WT-T6 unverified van trong confirmedFindings', (result.confirmedFindings || []).some(f => f.unverified));
}

// WT-T9: BLOCKED thang ve REJECT-tu-finding
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    machineCannotRun: true,
    findings: [F_HIGH],
    triage: [{ title: F_HIGH.title, inContract: true, acRef: 'AC-1', rationale: 'cham', proposal: null }],
  }));
  check('WT-T9 BLOCKED thang ve REJECT moi', result.verdict === 'BLOCKED', `verdict=${result.verdict}`);
}

// WT-T9b (doi chung duong): cung fixture nhung KHONG blocked -> REJECT
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_HIGH],
    triage: [{ title: F_HIGH.title, inContract: true, acRef: 'AC-1', rationale: 'cham', proposal: null }],
  }));
  check('WT-T9b khong blocked -> REJECT', result.verdict === 'REJECT', `verdict=${result.verdict}`);
}
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/workflows/run-tests.sh`
Expected: FAIL ở các case WT-T* (vd `FAIL: WT-T1 high in-contract -> REJECT (verdict=PASS)`), các case cũ vẫn PASS.

- [ ] **Step 3: Thêm `TRIAGE_SCHEMA`**

Trong `feature-loop/workflows/acceptance-verify.js`, ngay sau `REFUTE_SCHEMA` (kết thúc ~dòng 121):

```javascript
// Scope-triage: finding da xac nhan la THAT — cau hoi con lai la "co trong hop dong khong".
// Ba ngan: in-contract (co acRef) · out-of-contract (co proposal) · unclassified (triage hong).
const TRIAGE_SCHEMA = {
  type: 'object',
  properties: {
    triaged: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'chep NGUYEN VAN title cua finding duoc phan loai' },
          inContract: { type: 'boolean', description: 'true CHI khi finding lam mot AC cua contract that bai' },
          acRef: { type: 'string', description: 'id AC bi cham (vd AC-3) khi inContract=true; chuoi rong khi false' },
          rationale: { type: 'string', description: '1 cau: vi sao trong/ngoai hop dong' },
          proposal: { type: 'string', enum: ['known-limits', 'new-contract', ''], description: 'CHI khi inContract=false: de xuat cho human o Gate 2; chuoi rong khi inContract=true' },
        },
        required: ['title', 'inContract', 'acRef', 'rationale', 'proposal'],
      },
    },
  },
  required: ['triaged'],
}
```

- [ ] **Step 4: Cập nhật comment args contract**

Trong khối comment `// ===== args contract =====` (~dòng 13-47), thêm dòng mô tả `contractPath` cạnh `personasPath`/`templatePath`:

```javascript
//   contractPath,                        // abs path _acceptance/<slug>/contract.md — input cua scope-triage.
//                                        // Vang/khong doc duoc → triageFailed, KHONG ai REJECT tu findings.
```

- [ ] **Step 5: Thêm stage TRIAGE sau `confirmedFindings`**

Ngay sau dòng khai `reviewIncomplete` (~dòng 441), thêm:

```javascript
// ---- Scope-triage: ngan thu ba cho finding THAT nhung NGOAI hop dong ----
// Vi sao ton tai: reviewer la finder KHONG gioi han pham vi, gate la thuoc CO gioi
// han pham vi. Thieu ngan nay thi moi ban va trong vung-khong-dac-ta lai de ra lua
// chon khong-dac-ta moi → vong lap khong hoi tu (ca OneFlow, 7 round).
phase('Triage')
const toTriage = confirmedFindings.filter(f => !f.unverified) // unverified chua phai "that" — khong phan loai
const hasContract = typeof args.contractPath === 'string' && !!args.contractPath.trim()
let triageRaw = null
let triageFailed = false
if (toTriage.length === 0) {
  triageFailed = false // khong co gi de phan loai — khong phai that bai
} else if (!hasContract) {
  triageFailed = true // khong co hop dong thi khong doan pham vi (fail-toward-human)
  log('Triage: thieu args.contractPath — moi finding ve unclassified, khong ai REJECT tu findings')
} else {
  const triagePrompt =
    `Ban la nguoi PHAN LOAI PHAM VI, khong phai nguoi tim loi. Cac finding duoi day DEU DA duoc xac nhan la loi THAT — dung tranh cai ve tinh dung sai cua chung.\n` +
    `Cau hoi duy nhat cho MOI finding: no co lam mot AC (acceptance criterion) trong hop dong that bai khong?\n\n` +
    `Doc hop dong tai ${args.contractPath} (Read). Doc CA section "Out of scope" — muc trong do la bang chung MANH cho inContract=false.\n\n` +
    `Findings: ${JSON.stringify(toTriage.map(f => ({ title: f.title, file: f.file, line: f.line, severity: f.severity, detail: f.detail })))}\n\n` +
    `Luat phan loai:\n` +
    `- inContract=true CHI khi chi duoc DICH DANH mot AC ma finding nay lam that bai → acRef = id AC do (vd "AC-3"), proposal = "".\n` +
    `- inContract=false khi finding that nhung khong AC nao phu → acRef = "", proposal = "known-limits" (ghi han che da biet, chap nhan ship) hoac "new-contract" (dang mot feature rieng).\n` +
    `- KHONG suy dien AC "gan giong". Khong chac chan → inContract=false: sua ngoai hop dong la viec cua NGUOI o Gate 2, khong phai cua may.\n` +
    `- KHONG doc code repo, KHONG de xuat cach sua. Chi phan loai pham vi.\n` +
    `Tra ve triaged[] dung MOT muc cho MOI finding, title chep NGUYEN VAN.`
  const triageOnce = () => agentT(triagePrompt, { label: 'triage', phase: 'Triage', schema: TRIAGE_SCHEMA, ...modelOpt('triage') })
  triageRaw = await triageOnce().catch(() => null)
  if (!triageRaw) triageRaw = await triageOnce().catch(() => null) // retry 1
  if (!triageRaw || !Array.isArray(triageRaw.triaged)) {
    triageFailed = true
    log('Triage: agent chet ca retry — moi finding ve unclassified, khong ai REJECT tu findings')
  }
}
const triageByTitle = new Map(((triageRaw && Array.isArray(triageRaw.triaged)) ? triageRaw.triaged : [])
  .filter(t => t && typeof t.title === 'string').map(t => [t.title, t]))
// Finding co trong danh sach gui di ma agent KHONG tra ve → unclassified (khong mac dinh in/out).
const triaged = toTriage.map(f => {
  const t = triageByTitle.get(f.title)
  const ok = !triageFailed && !!t
  return {
    ...f,
    inContract: ok ? t.inContract === true : false,
    acRef: ok && t.inContract === true && t.acRef ? t.acRef : null,
    rationale: ok ? (t.rationale || '') : '',
    proposal: ok && t.inContract !== true && t.proposal ? t.proposal : null,
    unclassified: !ok,
  }
})
// Fix-list cua round: CHI finding trong hop dong. Out-of-contract KHONG BAO GIO vao day,
// ke ca khi round REJECT vi ly do khac — day la chot chan chinh cua feature.
const rejectFindings = triaged.filter(f => f.inContract)
const triageHighInContract = triaged.filter(f => f.inContract && f.severity === 'high')
```

- [ ] **Step 6: Thêm vế verdict**

Sửa khối verdict routing (~dòng 505-509) thành:

```javascript
let verdict
if (blocked.length) verdict = 'BLOCKED'
else if (failed.length) verdict = 'REJECT'
// Ve MOI: finding THAT + trong hop dong + nang → may tu quay S3 sua, khong ton mot luot cong nguoi.
// Dat DUOI BLOCKED (moi truong hong thi khong sua gi) va sau failed (cung ket cuc, gop fix-list).
else if (triageHighInContract.length) verdict = 'REJECT'
else if (varianceCmds.length || (judgmentEvals.length && (args.riskTier === 'T3' || panels.some(p => p.proposal !== 'PASS')))) verdict = 'PENDING-JUDGMENT'
else verdict = 'PASS'
```

Và sửa dòng `log(...)` ngay dưới, thêm vào cuối template string:

```javascript
 — findings xac nhan: ${confirmedFindings.length}${triaged.length ? ` (trong hop dong: ${rejectFindings.length}, ngoai: ${triaged.filter(f => !f.inContract && !f.unclassified).length}${triageFailed ? ', TRIAGE HONG' : ''})` : ''}`)
```

- [ ] **Step 7: Thêm vào return object**

Trong object return cuối file (~dòng 562-570), sau `confirmedFindings,` thêm:

```javascript
  triaged,
  triageFailed,
  rejectFindings,
```

- [ ] **Step 8: Thêm role `triage` vào bảng model routing**

Trong `MODEL_ROUTES` (~dòng 180-190), thêm dòng cạnh `refute`:

```javascript
  triage: 'sonnet',      // phan loai pham vi tren van ban contract — khong doc code, khong can model lon
```

- [ ] **Step 9: Chạy test để thấy XANH**

Run: `bash tests/workflows/run-tests.sh`
Expected: `Results: all workflow tests passed` — mọi WT-T1…WT-T9b PASS, mọi case cũ vẫn PASS.

- [ ] **Step 10: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(s4-scope-triage): stage TRIAGE + ve verdict REJECT cho finding high in-contract (AC-1..AC-6, AC-12)"
```

---

### Task 3: Cluster signal — cụm finding ngoài vùng phủ

Khi findings dồn vào file mà không eval nào phủ, đó là tín hiệu hợp đồng đang hụt — phải nói ra thay vì để human tự nhận thấy sau 7 round.

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (ngay sau khối triage của Task 2; return object)
- Test: `tests/workflows/acceptance-verify.test.mjs`

**Interfaces:**
- Consumes: `triaged` (Task 2), `args.evals[].paths`.
- Produces: `coverageCluster: {count: number, total: number, files: string[]} | null` — null khi <2 finding ngoài vùng phủ HOẶC không eval nào khai `paths`.

- [ ] **Step 1: Viết case WT-T7a…WT-T7d (sẽ đỏ)**

Thêm vào `tests/workflows/acceptance-verify.test.mjs` sau khối WT-T9b:

```javascript
// WT-T7: cluster signal — findings ngoai union paths cua evals
const F_OUT2 = { title: 'them mot cho lech', file: 'other/install.ts', severity: 'medium', detail: 'x' };
const triAll = (fs) => fs.map(f => ({ title: f.title, inContract: false, acRef: '', rationale: 'ngoai', proposal: 'known-limits' }));

// WT-T7a: 2 finding ngoai vung phu -> co cluster
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_OUT, F_OUT2], triage: triAll([F_OUT, F_OUT2]),
  }));
  check('WT-T7a 2 finding ngoai vung phu -> cluster', !!result.coverageCluster && result.coverageCluster.count === 2,
    JSON.stringify(result.coverageCluster));
  check('WT-T7a cluster liet ke file', (result.coverageCluster.files || []).includes('other/plugins.md'));
}

// WT-T7b: khong eval nao khai paths -> cluster null (n-a)
{
  const args = triageArgs();
  args.evals = [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'npm test', ref: 'config:executors.test.unit' }];
  const { result } = await runWorkflow(AV, args, triageResponder({
    findings: [F_OUT, F_OUT2], triage: triAll([F_OUT, F_OUT2]),
  }));
  check('WT-T7b khong paths -> cluster null', result.coverageCluster === null, JSON.stringify(result.coverageCluster));
}

// WT-T7c (am): finding TRONG vung phu -> khong cluster
{
  const inCov = { title: 'trong vung phu', file: 'src/install.ts', severity: 'medium', detail: 'x' };
  const inCov2 = { title: 'trong vung phu 2', file: 'src/other.ts', severity: 'low', detail: 'x' };
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [inCov, inCov2], triage: triAll([inCov, inCov2]),
  }));
  check('WT-T7c finding trong vung phu -> khong cluster', result.coverageCluster === null, JSON.stringify(result.coverageCluster));
}

// WT-T7d (bien): DUNG 1 finding ngoai vung phu -> khong cluster (nguong la >=2)
{
  const { result } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_OUT], triage: triAll([F_OUT]),
  }));
  check('WT-T7d 1 finding le -> khong cluster', result.coverageCluster === null, JSON.stringify(result.coverageCluster));
}
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/workflows/run-tests.sh`
Expected: `FAIL: WT-T7a 2 finding ngoai vung phu -> cluster (undefined)`.

- [ ] **Step 3: Cài cluster signal**

Trong `acceptance-verify.js`, ngay sau dòng `const triageHighInContract = ...` (Task 2 Step 5):

```javascript
// Tin hieu cum-ngoai-vung-phu: findings don vao file khong eval nao do = hop dong dang hut.
// Nguong >=2 (mot finding le khong day nguoi vao quyet dinh mo-rong-hay-rut-scope).
// Glob toi gian: ** = moi thu, * = trong mot doan duong dan.
const globToRe = g => new RegExp('^' + String(g)
  .replace(/[.+^${}()|[\]\\]/g, '\\$&')
  .replace(/\*\*/g, ' ')
  .replace(/\*/g, '[^/]*')
  .replace(/ /g, '.*') + '$')
const coveredGlobs = args.evals.flatMap(e => Array.isArray(e.paths) ? e.paths : [])
const coverageRes = coveredGlobs.map(globToRe)
const outsideCoverage = coverageRes.length === 0 ? [] // khong eval nao khai paths → khong tinh duoc, n-a
  : triaged.filter(f => typeof f.file === 'string' && f.file && !coverageRes.some(re => re.test(f.file)))
const coverageCluster = outsideCoverage.length >= 2
  ? { count: outsideCoverage.length, total: triaged.length, files: [...new Set(outsideCoverage.map(f => f.file))] }
  : null
if (coverageCluster) log(`Cum ngoai vung phu: ${coverageCluster.count}/${coverageCluster.total} finding roi vao file khong eval nao do`)
```

- [ ] **Step 4: Thêm vào return object**

Sau `rejectFindings,` trong object return:

```javascript
  coverageCluster,
```

- [ ] **Step 5: Chạy để thấy XANH**

Run: `bash tests/workflows/run-tests.sh`
Expected: `Results: all workflow tests passed`.

- [ ] **Step 6: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(s4-scope-triage): tin hieu cum-ngoai-vung-phu tu union paths cua evals (AC-7)"
```

---

### Task 4: Synthesize — 3 ngăn trong review-findings.md, evidence-report bất động

`review-findings.md` là nơi duy nhất triage sống. `evidence-report.md` không được đổi shape — hook đang khoá nó.

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (prompt synthesize, ~dòng 552-560)
- Test: `tests/workflows/acceptance-verify.test.mjs`

**Interfaces:**
- Consumes: `triaged`, `triageFailed`, `coverageCluster` (Task 2, 3).
- Produces: prompt synthesize chứa chỉ dẫn 3 section cho `review-findings.md`; KHÔNG chứa chỉ dẫn nào thêm section/field vào `evidence-report.md`.

- [ ] **Step 1: Viết case WT-T8 + WT-T8b (sẽ đỏ)**

Thêm vào `tests/workflows/acceptance-verify.test.mjs`:

```javascript
// WT-T8: GOLDEN CLOSED-LIST — cac section/field ma prompt synthesize chi dan cho
// evidence-report.md. Danh sach DONG, so BANG: grep-vang-chuoi khong chung minh
// duoc gi (bat bien #4 CLAUDE.md), con danh sach dong thi them section moi = lech.
{
  const { calls } = await runWorkflow(AV, triageArgs(), triageResponder({
    findings: [F_HIGH, F_OUT],
    triage: [
      { title: F_HIGH.title, inContract: true, acRef: 'AC-1', rationale: 'cham', proposal: '' },
      { title: F_OUT.title, inContract: false, acRef: '', rationale: 'ngoai', proposal: 'known-limits' },
    ],
  }));
  const sp = calls.filter(c => (c.label || '').startsWith('synthesize')).map(c => c.prompt).join('\n');
  // Cac section evidence-report duoc phep xuat hien trong prompt (khuon template hien tai).
  const ALLOWED = ['## Analyst', '## Variance', '## Iterations'];
  const found = [...new Set((sp.match(/## [A-Za-z][\w -]*/g) || []))]
    .filter(s => !['## Trong hợp đồng', '## Ngoài hợp đồng', '## Chưa phân loại'].some(x => s.startsWith(x.slice(0, 10))));
  const extra = found.filter(s => !ALLOWED.includes(s.trim()));
  check('WT-T8 evidence-report khong co section moi', extra.length === 0, `section la: ${extra.join(' | ')}`);
  check('WT-T8 review-findings CO ngan Ngoai hop dong', sp.includes('Ngoài hợp đồng'));
  check('WT-T8 review-findings CO ngan Trong hop dong', sp.includes('Trong hợp đồng'));
}

// WT-T8b (doi chung duong cho golden list): tiem mot section moi vao chuoi prompt
// mo phong -> phep so PHAI phat hien. Chung minh danh sach dong con song.
{
  const fake = 'prompt gia ## Analyst ## Variance ## Iterations ## Triage';
  const found = [...new Set((fake.match(/## [A-Za-z][\w -]*/g) || []))].map(s => s.trim());
  const extra = found.filter(s => !['## Analyst', '## Variance', '## Iterations'].includes(s));
  check('WT-T8b golden list bat duoc section tiem them', extra.includes('## Triage'), `extra=${extra.join('|')}`);
}
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/workflows/run-tests.sh`
Expected: `FAIL: WT-T8 review-findings CO ngan Ngoai hop dong` (WT-T8 dòng golden-list có thể đã xanh sẵn — đó là đúng, nó là guard hồi quy).

- [ ] **Step 3: Sửa prompt synthesize**

Trong prompt synthesize, tìm đoạn `Sau do viet file thu hai ${args.repoRoot}/_acceptance/${args.slug}/review-findings.md ...` và THAY TOÀN BỘ câu đó bằng:

```javascript
`\n\nSau do viet file thu hai ${args.repoRoot}/_acceptance/${args.slug}/review-findings.md (informational, NGOAI hook — TUYET DOI khong them section/field nao cua no vao evidence-report.md).\n` +
`File nay co BA ngan theo ket qua scope-triage, moi finding ghi title, file:line, severity, detail, source:\n` +
`- "## Trong hợp đồng" — findings inContract=true, moi dong ghi them "AC: <acRef>". Findings: ${JSON.stringify(triaged.filter(f => f.inContract))}\n` +
`- "## Ngoài hợp đồng — người quyết ở Gate 2" — findings THAT nhung khong AC nao phu; moi dong ghi them "Đề xuất: <proposal>" (known-limits = ghi han che da biet roi ship · new-contract = dang mot feature rieng). Mo dau ngan bang DUNG mot cau: "Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa." Findings: ${JSON.stringify(triaged.filter(f => !f.inContract && !f.unclassified))}\n` +
(triaged.some(f => f.unclassified) ? `- "## Chưa phân loại (triage-failed)" — buoc phan loai pham vi hong nen KHONG finding nao duoc coi la trong hop dong; ghi 1 dong canh bao "phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ". Findings: ${JSON.stringify(triaged.filter(f => f.unclassified))}\n` : '') +
`- Finding co unverified=true liet ke RIENG thanh section "Chưa adversarial-verify (refuter chết)": ${JSON.stringify(confirmedFindings.filter(f => f.unverified))}\n` +
(coverageCluster
  ? `Cuoi file ghi DUNG mot dong co: "⚠ Cụm ngoài vùng phủ: ${coverageCluster.count}/${coverageCluster.total} lỗi rơi vào file không bộ đo nào phủ (${coverageCluster.files.join(', ')}) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi."\n`
  : `Cuoi file ghi DUNG mot dong: "Cụm ngoài vùng phủ: cluster: n-a (không eval nào khai paths)." KHONG duoc bia co canh bao.\n`) +
`Tra ve reportPath va findingsPath tuyet doi.`
```

(Giữ nguyên phần prompt phía trên — chỉ thay câu cuối về `review-findings.md`.)

- [ ] **Step 4: Chạy để thấy XANH**

Run: `bash tests/workflows/run-tests.sh`
Expected: `Results: all workflow tests passed`.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs
git commit -m "feat(s4-scope-triage): review-findings.md 3 ngan + dong co cum; evidence-report bat dong (AC-2,3,4,7,10)"
```

---

### Task 5: SKILL feature-loop — truyền contractPath, fix-list, gói Gate 2

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (mục "S4 — VERIFY" bước 1 và 2 và 3; mục "GATE 2")

**Interfaces:**
- Consumes: `result.rejectFindings`, `result.triaged`, `result.triageFailed`, `result.coverageCluster` (Task 2, 3).
- Produces: args S4 có thêm `contractPath`.

- [ ] **Step 1: Thêm `contractPath` vào bước chuẩn bị args**

Trong mục `## S4 — VERIFY` bước 1, ngay sau gạch đầu dòng nói về `personasPath`/`templatePath`, thêm:

```markdown
   - `contractPath` = abs path `_acceptance/<slug>/contract.md` — input của scope-triage (S4 phân loại mỗi finding: trong hay ngoài hợp đồng). File không tồn tại → vẫn truyền, script tự về fail-toward-human (không finding nào được máy tự sửa).
```

- [ ] **Step 2: Thêm `contractPath` vào chữ ký invoke**

Trong bước 2 của S4, sửa danh sách args trong dòng `Workflow({ scriptPath: ... })` — thêm `contractPath` ngay sau `templatePath`:

```markdown
2. Invoke: `Workflow({ scriptPath: '<WORKFLOWS_DIR>/acceptance-verify.js', args: { slug, round, riskTier, evals, suiteCommands, diffBase, repoRoot, personasPath, templatePath, contractPath, reviewSkillPath?, carriedEvals?, carriedPanels?, runBaseline?, carriedAnalyst?, evalsHash? } })` (debug fan-out không tốn agent: thêm `dryRun: true` → trả về distinctCommands/judgePanels + carried plan, không chạy gì).
```

- [ ] **Step 3: Sửa routing REJECT**

Trong bước 3 của S4, thay gạch đầu dòng `REJECT` hiện tại bằng:

```markdown
   - `REJECT` → quay S3 fix `failedEvals` + `failedCommands` + **`rejectFindings`** (findings TRONG hợp đồng). **`triaged` có mục `inContract: false` → TUYỆT ĐỐI KHÔNG sửa trong round này** — đó là lỗi thật nhưng ngoài phạm vi đã duyệt, nó đi Gate 2 cho người quyết; sửa nó ở đây chính là vòng xoáy mà scope-triage sinh ra để chặn. Rồi S4 round mới (round + 1). Trước khi rời S3-fix: append entry `fix` (`stage:"S4-r<N>"`). **Tối đa 3 round** — quá → DỪNG, escalate user kèm phân tích từng round. `reportPath` thiếu ở round REJECT → cảnh báo user lịch sử Iterations của round này không được ghi.
```

- [ ] **Step 4: Thêm luật triage vào "Mọi verdict"**

Trong bước 3, cuối gạch đầu dòng `**Mọi verdict:**`, thêm câu:

```markdown
Kết quả có `triageFailed: true` → báo user RÕ "phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, toàn bộ findings chờ người xem ở Gate 2" và đưa cảnh báo đó vào gói Gate 2 (không nén vào phần "máy đã lo"). Kết quả có `coverageCluster` khác null → nêu ngay: "N/M lỗi rơi ngoài vùng phủ của bộ đo — dừng và quyết: mở rộng hợp đồng hay rút phạm vi".
```

- [ ] **Step 5: Thêm khối "Ngoài hợp đồng" vào gói Gate 2**

Trong mục `## GATE 2 (human — điểm dừng 2)`, ngay sau đoạn "BƯỚC MẶC ĐỊNH — render thẻ quyết định TRƯỚC", thêm đoạn mới:

```markdown
**Khối "Ngoài hợp đồng" (việc-của-người, trình TRƯỚC judgment items):** mọi finding `inContract: false` trong `triaged` — lỗi THẬT nhưng ngoài phạm vi đã duyệt ở Gate 1. Mỗi mục trình bằng ngôn ngữ sản phẩm + 3 lựa chọn: (a) **ghi Known limits** — thêm bullet vào `## Notes` của contract, ship như hiện tại; (b) **mở contract mới** — feature riêng, có AC + eval của nó; (c) **nâng phạm vi sửa ngay** — sửa contract (thêm AC) + re-approve Gate 1 rồi S4 round mới. Mặc định khuyến nghị (a) hoặc (b): (c) là đường đắt và chỉ đúng khi lỗi đủ nặng để chặn ship. `triageFailed: true` → thay khối này bằng cảnh báo "phân loại phạm vi hỏng — toàn bộ findings chưa được phân ngăn, người xem lại danh sách đầy đủ trong review-findings.md". `coverageCluster` khác null → thêm 1 dòng cờ "dừng và quyết: mở rộng hợp đồng hay rút phạm vi" kèm danh sách file.
```

- [ ] **Step 6: Kiểm tra không vỡ suite**

Run: `bash tests/plugins/run-tests.sh`
Expected: mọi case PASS (suite này có case đếm/soi text SKILL — nếu case nào đỏ, đọc thông điệp và sửa cho khớp thay vì nới case).

- [ ] **Step 7: Commit**

```bash
git add feature-loop/skills/feature-loop/SKILL.md
git commit -m "feat(s4-scope-triage): SKILL truyen contractPath, fix-list chi in-contract, khoi Ngoai-hop-dong o Gate 2"
```

---

### Task 6: Card hai harness + fixture cho judge

**Files:**
- Modify: `commands/acceptance-card.md`
- Modify: `codex/acceptance-gate/skills/acceptance-card/SKILL.md`
- Create: `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md`
- Modify: `tests/plugins/run-tests.sh` (case P49, P51)

**Interfaces:**
- Consumes: `review-findings.md` do Task 4 sinh (3 section).
- Produces: chỉ dẫn card render khối "Ngoài hợp đồng"; fixture `out-of-contract-card-sample.md` là input của eval judgment E11.

- [ ] **Step 1: Viết case P49 + P51 (sẽ đỏ)**

Thêm vào `tests/plugins/run-tests.sh` trước phần tổng kết:

```bash
# ── P49: card 2 harness render khoi "Ngoai hop dong" + nhanh backward ────────
# AC-8 cua s4-scope-triage. Card la lop trinh bay; file review-findings.md the
# he CU khong co section moi -> phai render nhu cu, khong loi.
echo "P49 card render khoi Ngoai-hop-dong + nhanh backward (2 harness)"
P49OK=1
for f in "$ROOT/commands/acceptance-card.md" "$ROOT/codex/acceptance-gate/skills/acceptance-card/SKILL.md"; do
  if [ ! -f "$f" ]; then echo "     thieu $f"; P49OK=0; continue; fi
  grep -q 'Ngoài hợp đồng' "$f" || { echo "     $f THIEU chi dan khoi Ngoai hop dong"; P49OK=0; }
  grep -q 'không có section' "$f" || { echo "     $f THIEU nhanh backward tuong minh"; P49OK=0; }
done
# Doi chung dot bien: ban sao bi xoa chi dan -> phep kiem phai DO.
P49CP="$(mktemp)"
grep -v 'Ngoài hợp đồng' "$ROOT/commands/acceptance-card.md" > "$P49CP"
if grep -q 'Ngoài hợp đồng' "$P49CP"; then
  echo "     dot bien KHONG hieu luc — phep kiem da chet"
  P49OK=0
fi
rm -f "$P49CP"
if [ "$P49OK" -eq 1 ]; then
  pass "P49 card Ngoai-hop-dong + backward (nguon 2 harness + dot bien)"
else
  fail "P49 card Ngoai-hop-dong + backward (nguon 2 harness + dot bien)"
fi

# ── P51: gac cong cho judge E11 — fixture phai dong bo voi chi dan card ──────
# Cung khuon TE17/RL10: judge cham mot file evidence; neu file do troi so voi
# chi dan that thi judge dang cham mot thu khong ton tai.
echo "P51 fixture out-of-contract-card-sample dong bo chi dan card"
P51F="$ROOT/_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md"
P51OK=1
if [ ! -f "$P51F" ]; then
  echo "     thieu fixture $P51F"
  P51OK=0
else
  for s in 'Known limits' 'hợp đồng mới' 'nâng phạm vi'; do
    grep -q "$s" "$P51F" || { echo "     fixture THIEU lua chon: $s"; P51OK=0; }
  done
  # Fixture la ngon ngu san pham: khong duoc lot jargon ky thuat.
  for j in 'exit code' 'rmSync' 'inContract' 'severity'; do
    if grep -q "$j" "$P51F"; then echo "     fixture co jargon ky thuat: $j"; P51OK=0; fi
  done
fi
if [ "$P51OK" -eq 1 ]; then
  pass "P51 fixture judge E11 du 3 lua chon, khong jargon"
else
  fail "P51 fixture judge E11 du 3 lua chon, khong jargon"
fi
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P49|P51"`
Expected: `FAIL: P49 ...` và `FAIL: P51 ...`.

- [ ] **Step 3: Sửa `commands/acceptance-card.md`**

Trong bước 3 (`**Translate**`), sau gạch đầu dòng về `decisions[]` của Gate 2, thêm:

```markdown
   - Gate 2 `out_of_contract`: đọc `_acceptance/<slug>/review-findings.md`. Có section
     "## Ngoài hợp đồng" → dựng khối việc-của-người ĐẶT TRƯỚC các judgment item: mỗi
     finding 1 dòng ngôn ngữ sản phẩm + 3 lựa chọn cho người (ghi Known limits / mở
     hợp đồng mới / nâng phạm vi sửa ngay), kèm dòng cờ cụm-ngoài-vùng-phủ nếu file
     có. File KHÔNG có section đó (thế hệ cũ, hoặc round không có finding) → render
     như cũ, không cảnh báo, không lỗi — đây là nhánh backward bắt buộc. Section
     "## Chưa phân loại (triage-failed)" có mặt → thay khối bằng 1 cờ vàng: phân loại
     phạm vi hỏng, người xem lại toàn bộ danh sách.
```

- [ ] **Step 4: Sửa bản codex**

Trong `codex/acceptance-gate/skills/acceptance-card/SKILL.md`, tìm phần tương ứng (bước Translate / Gate 2) và thêm đoạn cùng nội dung, giữ nguyên văn phong tiếng Anh của file đó nhưng GIỮ NGUYÊN hai chuỗi tiếng Việt `Ngoài hợp đồng` và `không có section` (chúng là tên section/nhánh máy-đọc, P49 ghim đúng hai chuỗi này).

- [ ] **Step 5: Viết fixture cho judge E11**

Create `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md`:

```markdown
# Mẫu khối "Ngoài hợp đồng" trên thẻ Cổng 2

> Đây là fixture: bản render mẫu để chấm xem người quyết kinh doanh có đọc hiểu
> khối này không. Nội dung lỗi lấy từ ca thật (OneFlow) nhưng đã dịch sang ngôn
> ngữ sản phẩm.

## Ngoài hợp đồng — bạn quyết

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — bạn quyết,
máy không tự sửa.

**1. Cập nhật tiện ích có thể xoá mất tiện ích đang cài.**
Khi bản cài đặt trên máy người dùng trỏ về một địa chỉ khác với địa chỉ trong danh
mục, hệ thống xoá bản cũ trước rồi mới tải bản mới. Mạng chập chờn giữa chừng thì
người dùng bấm "Cập nhật" và nhận lại "đã gỡ cài".
- Ghi Known limits: chấp nhận rủi ro, ghi vào phần hạn chế đã biết, ship bản này.
- Mở hợp đồng mới: tách thành một việc riêng có tiêu chí nghiệm thu của nó.
- Nâng phạm vi sửa ngay: bổ sung tiêu chí vào hợp đồng hiện tại rồi duyệt lại Cổng 1.

**2. Tiện ích cài đúng theo tài liệu bị nhận nhầm là "đã dời chỗ".**
Tài liệu hướng dẫn người dùng sao địa chỉ từ trang chủ, còn hệ thống lại luôn thêm
một hậu tố vào địa chỉ trước khi so sánh. Hai chuỗi khác nhau về hình thức nên mọi
bản cài theo đúng tài liệu đều bị coi là đã dời chỗ ở lần cập nhật kế tiếp.
- Ghi Known limits: người dùng gỡ và cài lại thủ công khi gặp.
- Mở hợp đồng mới: làm phần so sánh địa chỉ cho đúng, thành một việc riêng.
- Nâng phạm vi sửa ngay: bổ sung tiêu chí vào hợp đồng hiện tại rồi duyệt lại Cổng 1.

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (src/install.ts,
docs/plugins.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
```

- [ ] **Step 6: Chạy để thấy XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P49|P51"`
Expected: `PASS: P49 ...` và `PASS: P51 ...`.

- [ ] **Step 7: Commit**

```bash
git add commands/acceptance-card.md codex/acceptance-gate/skills/acceptance-card/SKILL.md _acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md tests/plugins/run-tests.sh
git commit -m "feat(s4-scope-triage): card 2 harness render khoi Ngoai-hop-dong + fixture judge (AC-8, AC-11)"
```

---

### Task 7: Codex parity — cùng 3 ngăn, cùng quyền REJECT

**Files:**
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (bước 12 của S4, ~dòng 422)
- Modify: `codex/feature-loop-codex/.codex-plugin/plugin.json` (bảng model routing nếu có `acceptance_*` roles — kiểm tra bảng trong SKILL.md dòng ~68)
- Modify: `tests/plugins/run-tests.sh` (case P50)

**Interfaces:**
- Consumes: không (song song với Task 2 về mặt ngữ nghĩa, không dùng code chung).
- Produces: text SKILL codex có đủ 3 ngăn + luật REJECT + fail-toward-human.

- [ ] **Step 1: Viết case P50 (sẽ đỏ)**

Thêm vào `tests/plugins/run-tests.sh`:

```bash
# ── P50: codex parity cho scope-triage ──────────────────────────────────────
# AC-9. Hai harness phai cung ngu nghia: 3 ngan, quyen REJECT chi cho
# in-contract high, fail-toward-human khi triage hong.
echo "P50 codex feature-loop S4 co buoc scope-triage tuong duong"
P50F="$ROOT/codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md"
P50OK=1
if [ ! -f "$P50F" ]; then
  echo "     thieu $P50F"; P50OK=0
else
  for s in 'scope-triage' 'in-contract' 'out-of-contract' 'unclassified' 'never fix out-of-contract'; do
    grep -qi "$s" "$P50F" || { echo "     THIEU chuoi khoa: $s"; P50OK=0; }
  done
fi
# Doi chung dot bien.
P50CP="$(mktemp)"
grep -vi 'out-of-contract' "$P50F" > "$P50CP"
if grep -qi 'out-of-contract' "$P50CP"; then
  echo "     dot bien KHONG hieu luc — phep kiem da chet"
  P50OK=0
fi
rm -f "$P50CP"
if [ "$P50OK" -eq 1 ]; then
  pass "P50 codex parity scope-triage (5 chuoi khoa + dot bien)"
else
  fail "P50 codex parity scope-triage (5 chuoi khoa + dot bien)"
fi
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep P50`
Expected: `FAIL: P50 ...` kèm 5 dòng `THIEU chuoi khoa`.

- [ ] **Step 3: Sửa bước 12 của codex SKILL**

Thay bước 12 hiện tại (bắt đầu `12. Review the diff with repo guidance...`) bằng:

```markdown
12. Review the diff with repo guidance. Run two `acceptance_reviewer` passes:
    conventions/invariants and bug/silent-failure. Dispatch one
    `acceptance_refuter` per proposed finding before treating it as confirmed.
    Use the recorded fallback modes when named agents are unavailable.

    Then run **scope-triage** — one `acceptance_triage` pass over the whole
    confirmed list (never per finding, never folded into the refuter: refuting
    and scoping are different lenses). Input is `_acceptance/<slug>/contract.md`
    verbatim plus the confirmed findings; unverified findings are NOT triaged.
    Each finding lands in exactly one of three bins:
    - **in-contract** — names the specific AC it breaks (`acRef`). These join
      the round's fix list.
    - **out-of-contract** — real, but no AC covers it. Proposal is
      `known-limits` or `new-contract`. **Never fix out-of-contract findings in
      this round**, even when the round is already REJECT for another reason —
      fixing undefined behaviour under review pressure is the spiral this step
      exists to stop. They go to Gate 2 for the human.
    - **unclassified** — triage failed (agent dead after one retry, or the
      contract could not be read). Then NO finding may drive a REJECT, whatever
      its severity: fail toward the human, never guess the scope.

    A confirmed finding that is `high` AND in-contract makes the round REJECT
    (the machine fixes what the contract already bounds). `medium`/`low`
    in-contract findings stay informational. BLOCKED still outranks this — a
    broken environment fixes nothing.

    Write all three bins to `_acceptance/<slug>/review-findings.md` under the
    headings "## Trong hợp đồng", "## Ngoài hợp đồng — người quyết ở Gate 2",
    "## Chưa phân loại (triage-failed)", keeping the existing
    "Chưa adversarial-verify" section for unverified findings. If two or more
    confirmed findings sit in files no eval's `paths` cover, end the file with
    the cluster flag: stop and decide — widen the contract or narrow the scope.
```

- [ ] **Step 4: Thêm role `acceptance_triage` vào bảng model routing**

Trong bảng routing (~dòng 68 của cùng file), thêm dòng dưới `acceptance_refuter`:

```markdown
| `acceptance_triage` | scope-triage of the confirmed finding list against the contract | `gpt-5.6-terra` | `medium` |
```

- [ ] **Step 5: Chạy để thấy XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep P50`
Expected: `PASS: P50 codex parity scope-triage (5 chuoi khoa + dot bien)`

- [ ] **Step 6: Commit**

```bash
git add codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md tests/plugins/run-tests.sh
git commit -m "feat(s4-scope-triage): codex parity — 3 ngan triage + quyen REJECT + fail-toward-human (AC-9)"
```

---

### Task 8: Bump version + sync mirror

**Files:**
- Modify: `.claude-plugin/plugin.json` (acceptance-gate 1.22.1 → 1.23.0)
- Modify: `feature-loop/.claude-plugin/plugin.json` (1.16.1 → 1.17.0)
- Modify: `codex/acceptance-gate/.codex-plugin/plugin.json` (1.22.1 → 1.23.0)
- Modify: `codex/feature-loop-codex/.codex-plugin/plugin.json` (1.16.1 → 1.17.0)
- Modify: `CHANGELOG.md`
- Modify: `plugins/**` (sinh máy — KHÔNG sửa tay)

**Interfaces:**
- Consumes: mọi thay đổi nguồn của Task 1-7.
- Produces: mirror khớp nguồn (P30 xanh).

- [ ] **Step 1: Bump 4 file version**

Sửa trường `"version"` trong 4 file trên. Trong `description` của `feature-loop/.claude-plugin/plugin.json` và `.claude-plugin/plugin.json`, thêm một câu ở cuối:

```
v1.17 adds S4 scope-triage: every confirmed review finding is classified against the contract (in-contract / out-of-contract / unclassified), a high in-contract finding drives REJECT so the machine fixes what the contract bounds, out-of-contract findings never enter the fix list and go to Gate 2 for the human, and a cluster of findings outside every eval's paths raises a widen-or-narrow flag.
```

(Câu cho `acceptance-gate` viết theo góc card: khối "Ngoài hợp đồng" trên thẻ Cổng 2 + nhánh backward.)

- [ ] **Step 2: Ghi CHANGELOG**

Thêm mục mới ở đầu `CHANGELOG.md`, theo đúng khuôn các mục hiện có (đọc 2 mục gần nhất rồi bắt chước format).

- [ ] **Step 3: Sync mirror**

Run: `bash scripts/sync-plugin-packages.sh`
Expected: in danh sách file đã rsync, exit 0.

- [ ] **Step 4: Xác minh mirror khớp**

Run: `bash scripts/sync-plugin-packages.sh --check`
Expected: exit 0, không báo drift.

- [ ] **Step 5: Chạy TOÀN BỘ cổng**

Run: `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh`
Expected: cả 4 suite in dòng kết quả PASS, exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(s4-scope-triage): bump acceptance-gate 1.23.0 / feature-loop 1.17.0 + sync mirror"
```

---

## Self-Review

**Spec coverage:** AC-1/2/3/5/6/12 → Task 2. AC-4 → Task 2 (WT-T4, WT-T4b, WT-T4c). AC-7 → Task 3. AC-10 → Task 4 (golden closed-list). AC-8 → Task 6. AC-11 → Task 6 (fixture + P51). AC-9 → Task 7. AC-13 → Task 1. Mirror/bump (Global Constraints) → Task 8.

**Placeholder scan:** không có TBD/TODO; mọi step sửa code đều kèm code thật; mọi lệnh có expected output.

**Type consistency:** `triaged` (Task 2) dùng nguyên tên field ở Task 3 (`f.file`, `f.inContract`) và Task 4 (`f.unclassified`, `f.proposal`, `f.acRef`); `coverageCluster` shape `{count,total,files}` dùng nhất quán Task 3 → Task 4 → Task 5 → Task 6; `rejectFindings` dùng nhất quán Task 2 → Task 5. Label agent `triage` khớp giữa code (Task 2 Step 5) và test responder (Task 2 Step 1) và role model routing (Task 2 Step 8).
