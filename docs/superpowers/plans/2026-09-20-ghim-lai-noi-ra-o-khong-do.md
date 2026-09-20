# Làn ghim lại NÓI RA ô không đo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làn ghim lại và hai thẻ phải NÓI RA những eval nó không đo (ui-check/judgment), eval nào trong số đó có vật đo đã đổi, và AC nào vì thế không có chốt máy — không đổi hành vi chặn nào.

**Architecture:** Writer (`repin-lane.mjs`) thêm ba khoá tuỳ chọn vào dòng `kind:repin` và ba hậu tố vào section Re-pin, dùng vị từ có sẵn của `lib/evidence-core.cjs`. Thẻ (`scripts/gate-card.js`) đọc lại đúng vật đó cho cả hai cổng. Lint W8 nối câu giá. Bên đọc (`recheck-evidence.cjs`, `pre-merge-check.sh`, `lib/**`) KHÔNG đổi một dòng.

**Tech Stack:** Node ESM (`repin-lane.mjs`), Node CJS (`gate-card.js`, `eval-coverage-lint.js`), bash suite runner, fixture kho git code-sinh.

**Spec:** `docs/superpowers/specs/2026-09-20-ghim-lai-noi-ra-o-khong-do-design.md`
**Contract:** `_acceptance/ghim-lai-noi-ra-o-khong-do/contract.md` (9 AC) · **Evals:** `.../evals.yaml` (E1–E14)

## Global Constraints

- **KHÔNG sửa** `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (giữ T2 — chạm là đổi hạng và phá bất biến «không đổi hành vi chặn»).
- **Vị từ dùng chung, không dựng bản thứ hai:** `core.REPIN_MACHINE_EXECUTORS`, `core.isRepinMachineEval` (đã có trong `lib/evidence-core.cjs`, đã có hàng trong `AG-ENGINE-TABLE`).
- **Luật vắng-hẳn:** khoá tuỳ chọn rỗng thì VẮNG khỏi JSON, không phải `[]`.
- **KIỂU thắng TRẠNG THÁI:** eval ngoài làn máy khai `status: not-run` chỉ vào `evals_not_machine`, không vào `evals_not_run`.
- **Không chặn:** mọi nhánh mới giữ `exit 0` và vẫn ghi; không thêm `die()` nào.
- Mọi đường dẫn trong ca suy từ vị trí tệp ca (`fileURLToPath(import.meta.url)`), không hardcode ROOT.
- Mốc git bất biến dùng trong ca: `2826f807` (mốc 2.17.0). Mốc vắng → ca ĐỎ có tên `thieu moc 2826f807`, không xanh lặng.
- Mỗi ca in ĐÚNG MỘT dòng `PASS: GNxx …` / `FAIL: GNxx … (DO: …)`, chi tiết in bằng tiền tố `    · `. Bộ chọn `GNRO_CASES`; khớp 0 ca → in `GNRO_CASES khop 0 ca` và exit 1.
- Mỗi mutant: khớp đúng một lần, bản sao khác bản gốc, qua `node --check`.
- Commit từng task; cuối mỗi task bốn suite của `feature_loop.suite_keys` phải còn xanh.

## File Structure

| Tệp | Trách nhiệm | Thao tác |
|---|---|---|
| `tests/scripts/repin-lane-noi-ra.test.mjs` | Lưới thường trực: fixture kho git code-sinh + 12 ca GN01–GN12 + mutant | Create |
| `feature-loop/scripts/repin-lane.mjs` | Writer: ba khoá + ba hậu tố | Modify (`perSlug.map` ~186-204; khối kết quả ~330-355) |
| `scripts/gate-card.js` | Hai thẻ: vị từ AC + cờ + `--extract.chot_may` | Modify (helper trước block gate 1; cờ gate 1 ~700-710; cờ gate 2 ~1055-1062; hai khối `EXTRACT`) |
| `scripts/eval-coverage-lint.js` | W8 nối câu giá | Modify (~248-251) |
| `feature-loop/skills/feature-loop/SKILL.md` | Khuôn `REPIN-TEMPLATE` + câu giới hạn nghi thức re-pin | Modify |
| `GUIDE.md` | §7.1: câu giới hạn + lệnh đếm ngưỡng | Modify |
| `_acceptance/config.yaml` | 14 khoá `executors.script.gnro_*` | Modify |

---

### Task 1: Khung tệp ca + fixture kho git code-sinh + ca GN01 (khoá `evals_not_machine`)

**Files:**
- Create: `tests/scripts/repin-lane-noi-ra.test.mjs`
- Modify: `feature-loop/scripts/repin-lane.mjs` (khối `perSlug.map`, khối dựng dòng JSON)
- Modify: `_acceptance/config.yaml` (khoá `gnro_khoa_kieu`)

**Interfaces:**
- Produces cho các task sau: `mkKho(opts)` → `{root, ws, slug, logPath, reportPath, head}` dựng kho git tạm có hồ sơ theo ma trận; `chayLan(root, slug, extra[])` → `{status, stdout, stderr}`; `dongRepinCuoi(logPath)` → object JSON dòng repin cuối; `sectionCuoi(reportPath)` → chuỗi section `### Re-pin lần N` cuối; `mutant(src, tim, thay, pin)` → đường dẫn bản sao đã tiêm (khớp đúng một lần + `node --check`); `CASES[]` với `{id, title, real(obj), mutants:[{make, judge?, pin}]}`.
- Consumes: `core.REPIN_MACHINE_EXECUTORS`, `core.isRepinMachineEval` từ `lib/evidence-core.cjs`.

- [ ] **Step 1: Viết khung tệp ca + fixture + ca GN01 (chưa có mã sản phẩm → phải ĐỎ)**

Tạo `tests/scripts/repin-lane-noi-ra.test.mjs`. Đầu tệp:

```js
// GN — làn ghim lại phải NÓI RA ô nó không đo (hồ sơ ghim-lai-noi-ra-o-khong-do, 20/09/2026).
//
// Ca VĨNH VIỄN: suite scripts chạy mọi *.test.mjs qua glob. Luật đo:
//  - Fixture là kho git THẬT dựng trong chính lượt chạy; hồ sơ theo MA TRẬN bốn AC:
//    AC-a{E1 test} · AC-b{E2 script not-run} · AC-c{E6 ui-check paths, E7 ui-check not-run}
//    · AC-d{E12 judgment, E13 test}. Danh sách kỳ vọng «AC không có chốt máy» VIẾT TRƯỚC
//    = [AC-b, AC-c] — hằng AC_KHONG dưới đây, không tính lại từ mã sản phẩm.
//  - Mỗi ca chạy phép phán trên vật THẬT (phải không lỗi) rồi CÙNG phép phán trên bản sao
//    đã tiêm (phải ra đúng thông điệp ghim). Mũi tiêm khớp đúng một lần, qua `node --check`.
//  - Mọi đường dẫn suy từ vị trí tệp này. Mốc git vắng → ca ĐỎ có tên.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const HERE = path.dirname(SELF);
const ROOT = path.resolve(HERE, '..', '..');
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const LINT = path.join(ROOT, 'scripts', 'eval-coverage-lint.js');
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const GUIDE = path.join(ROOT, 'GUIDE.md');
const MOC = '2826f807';               // mốc 2.17.0 — bên đọc + writer đời trước hồ sơ này
const AC_KHONG = ['AC-b', 'AC-c'];    // kỳ vọng VIẾT TRƯỚC, không tính từ mã sản phẩm

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gnro-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n) + '…' : String(s));
```

Fixture — `evals.yaml` theo ma trận, và kho git có suite + răng:

```js
const EVALS_MA_TRAN = `evals:
  - id: E1
    criterion: AC-a
    executor: test
    cmd: config:executors.test.suite
    expected: xanh
  - id: E2
    criterion: AC-b
    executor: script
    status: not-run
    cmd: config:executors.script.rang
    expected: khong chay
  - id: E6
    criterion: AC-c
    executor: ui-check
    cmd: config:executors.ui.x
    paths:
      - "apps/x/**"
      - "_acceptance/feat-gn/rang/**"
    expected: nhin frame
  - id: E7
    criterion: AC-c
    executor: ui-check
    status: not-run
    cmd: config:executors.ui.x
    expected: khong chay
  - id: E12
    criterion: AC-d
    executor: judgment
    cmd: judgment
    expected: nguoi phan
  - id: E13
    criterion: AC-d
    executor: test
    cmd: config:executors.test.suite
    expected: xanh
`;
const EVALS_TOAN_MAY = `evals:
  - id: E1
    criterion: AC-a
    executor: test
    cmd: config:executors.test.suite
    expected: xanh
`;
const CONFIG = `schema_version: 1
enforcement: strict
recheck: strict
gap_probe: off
feature_loop:
  suite_keys:
    - executors.test.suite
executors:
  test:
    suite: "bash suite.sh"
  script:
    rang: "bash rang.sh"
  ui:
    x: "echo ui"
`;
const REPORT = (slug, vc) => `---
schema_version: 1
slug: ${slug}
verified_commit: ${vc}
human_signoff: Nguoi Ky 2026-09-19
---

# Evidence — ${slug}

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-a | test | PASS |

## Iterations
`;

// Kho git tạm: mot hồ sơ ma trận (feat-gn) + tuỳ chọn hồ sơ toàn máy (feat-may).
function mkKho({ toanMay = false, evals = EVALS_MA_TRAN } = {}) {
  const root = mk('kho-');
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const slug = toanMay ? 'feat-may' : 'feat-gn';
  const ws = path.join(root, '_acceptance', slug);
  fs.mkdirSync(path.join(ws, 'rang'), { recursive: true });
  fs.mkdirSync(path.join(root, 'apps', 'x'), { recursive: true });
  fs.writeFileSync(path.join(root, '_acceptance', 'config.yaml'), CONFIG);
  fs.writeFileSync(path.join(root, 'suite.sh'), 'exit 0\n');
  fs.writeFileSync(path.join(root, 'rang.sh'), 'exit 0\n');
  fs.writeFileSync(path.join(root, 'apps', 'x', 'a.ts'), 'v1\n');
  fs.writeFileSync(path.join(ws, 'rang', 'r.mjs'), '// v1\n');
  fs.writeFileSync(path.join(ws, 'contract.md'), `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [ui]\nstatus: signed-off\napproved_by: Nguoi Ky\napproved_at: 2026-09-19\n---\n\n# Contract ${slug}\n\n## Criteria\n\n- AC-a: Given x, When y, Then z.\n`);
  fs.writeFileSync(path.join(ws, 'evals.yaml'), (toanMay ? EVALS_TOAN_MAY : evals).replaceAll('feat-gn', slug));
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const head = git('rev-parse', 'HEAD').trim();
  fs.writeFileSync(path.join(ws, 'run-log.jsonl'), JSON.stringify({ ts: '2026-09-19T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: head, eval: 'E1', exit_code: 0 }) + '\n');
  fs.writeFileSync(path.join(ws, 'evidence-report.md'), REPORT(slug, head));
  git('add', '-A'); git('commit', '-qm', 'evidence');
  return { root, ws, slug, git, head: git('rev-parse', 'HEAD').trim(), logPath: path.join(ws, 'run-log.jsonl'), reportPath: path.join(ws, 'evidence-report.md') };
}

const chayLan = (root, slug, extra = [], laneScript = LANE) =>
  spawnSync(process.execPath, [laneScript, '--root', root, '--ag-root', ROOT, '--slug', slug, '--reason', 'ca GN', ...extra], { encoding: 'utf8' });
const dongRepinCuoi = (logPath) => JSON.parse(fs.readFileSync(logPath, 'utf8').split('\n').filter(l => l.includes('"kind":"repin"')).pop());
const sectionCuoi = (reportPath) => {
  const t = fs.readFileSync(reportPath, 'utf8');
  const i = t.lastIndexOf('### Re-pin lần');
  return i < 0 ? '' : t.slice(i);
};

// Bản sao đã tiêm: mũi tiêm khớp ĐÚNG MỘT LẦN, bản sao khác gốc, qua node --check.
function mutant(src, tim, thay) {
  const s = fs.readFileSync(src, 'utf8');
  const n = s.split(tim).length - 1;
  if (n !== 1) throw new Error(`mui tiem khop ${n} lan (can 1): ${cut(tim, 60)}`);
  const out = path.join(mk('mut-'), path.basename(src));
  const moi = s.replace(tim, thay);
  if (moi === s) throw new Error('ban sao khong khac ban goc');
  fs.writeFileSync(out, moi);
  const chk = spawnSync(process.execPath, ['--check', out], { encoding: 'utf8' });
  if (chk.status !== 0) throw new Error(`ban sao khong qua node --check: ${cut(chk.stderr, 120)}`);
  return out;
}
```

Ca GN01 + bộ chạy:

```js
const CASES = [];

CASES.push({
  id: 'GN01',
  title: 'dòng ghim nêu ô ngoài làn máy; ba tập rời nhau, hợp = tập id',
  real(lane) {
    const errs = [];
    const f = mkKho();
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 200)}`];
    const d = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d.evals_not_machine) !== JSON.stringify(['E6', 'E7', 'E12'])) errs.push(`khoa evals_not_machine vang hoac sai: ${JSON.stringify(d.evals_not_machine)}`);
    if (JSON.stringify(d.evals_not_run) !== JSON.stringify(['E2'])) errs.push(`evals_not_run sai: ${JSON.stringify(d.evals_not_run)}`);
    if (JSON.stringify(Object.keys(d.evals_exit)) !== JSON.stringify(['E1', 'E13'])) errs.push(`evals_exit sai: ${JSON.stringify(Object.keys(d.evals_exit))}`);
    const hop = [...Object.keys(d.evals_exit), ...(d.evals_not_run || []), ...(d.evals_not_machine || [])];
    const tapId = ['E1', 'E2', 'E6', 'E7', 'E12', 'E13'];
    if (new Set(hop).size !== hop.length) errs.push(`id xuat hien hai mang: ${hop.join(',')}`);
    if (JSON.stringify([...hop].sort()) !== JSON.stringify([...tapId].sort())) errs.push(`hop ba tap != tap id: ${hop.join(',')}`);
    return errs;
  },
  mutants: [
    { pin: 'khoa evals_not_machine vang', make: () => mutant(LANE, '.filter(e => !core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || \'\').trim().toLowerCase()))', '.filter(() => false)') },
    { pin: 'id xuat hien hai mang', make: () => mutant(LANE, 'core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || \'\').trim().toLowerCase()))\n    .filter(e => !core.isRepinMachineEval(e))', '(true))\n    .filter(e => !core.isRepinMachineEval(e))') },
  ],
});
```

Bộ chạy cuối tệp (nếp `repin-lane-lop-cu.test.mjs`):

```js
const want = (process.env.GNRO_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chosen = want.length ? CASES.filter(c => want.includes(c.id)) : CASES;
if (!chosen.length) { console.log(`GNRO_CASES khop 0 ca: ${want.join(',')}`); process.exit(1); }
let passed = 0; let failed = 0;
for (const c of chosen) {
  const t0 = Date.now();
  let errs;
  try {
    errs = c.real(c.obj || LANE).map(e => `vat that: ${e}`);
    for (const m of c.mutants || []) {
      let got;
      try { got = (m.judge || c.real)(m.make()); } catch (e) { got = null; errs.push(`chieu do "${m.pin}" khong dung duoc: ${e.message}`); }
      if (got === null) continue;
      if (got.some(e => e.includes(m.pin))) process.stdout.write(`    · ${c.id} chieu do: ban sao do, ghim "${m.pin}"\n`);
      else errs.push(`chieu do khong do — ban sao khong ra "${m.pin}" (ra: ${cut(got.join(' | ') || 'khong loi nao', 200)})`);
    }
  } catch (e) { errs = [`ha tang: ${e.message}`]; }
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  if (!errs.length) { passed++; console.log(`  PASS: ${c.id} ${c.title} (${dt}s)`); } else { failed++; console.log(`  FAIL: ${c.id} ${c.title} (DO: ${errs.join(' | ')})`); }
}
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Chạy ca để xác nhận nó ĐỎ vì đúng lý do**

Run: `GNRO_CASES=GN01 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: `FAIL: GN01 … (DO: vat that: khoa evals_not_machine vang hoac sai: undefined …)` — ĐỎ vì writer chưa ghi khoá, KHÔNG phải vì hạ tầng fixture.

- [ ] **Step 3: Writer ghi `evals_not_machine`**

Trong `feature-loop/scripts/repin-lane.mjs`, khối `perSlug.map` — sau `const skipped = …`, thêm:

```js
  // Ô NGOÀI LÀN MÁY (ui-check/judgment): làn không chạy chúng bao giờ — giới hạn đã
  // khai (GUIDE §7.1, ADR 0014). Trước hồ sơ này pin IM về chúng, nên một hợp đồng
  // làm đúng nghĩa vụ lớp nhìn-thấy mất chốt máy mà không dòng nào nói (đo ở crm
  // 20/09: 6 hồ sơ, `tiep-thi-tuyen-doi-tac` ghim 6 lần vắng E6/E9 cả 6).
  // KIỂU thắng TRẠNG THÁI: ô ngoài làn máy khai `status: not-run` chỉ vào mảng NÀY,
  // không vào `skipped` — `skipped` đã lọc kiểu máy trước, nên ba tập rời nhau đúng
  // bằng xây dựng chứ không bằng hai luật gõ tay đi song song.
  const ngoaiMay = evalRecords
    .filter(e => !core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase()))
    .map(e => e.id);
```

Đổi `return { slug, ws, reportPath, report, evalsPath, evalsText, evals, skipped };` thành `… , skipped, ngoaiMay, evalRecords };`.

Trong khối kết quả, thay ternary hai nhánh dựng `line` bằng:

```js
  const boQua = s.skipped;
  // Khoá tuỳ chọn VẮNG HẲN khi rỗng (không phải mảng rỗng) — cùng luật hiện diện
  // với `evals_not_run` của 2.12.0. Object.assign giữ thứ tự chèn, nên thứ tự khoá
  // khớp khuôn REPIN-TEMPLATE của SKILL với mọi tổ hợp có/không.
  const line = JSON.stringify(Object.assign(
    { ts: iso, kind: 'repin', run_id: runId, sha, suites_exit: suitesExit, evals_exit: evalsExit },
    boQua.length ? { evals_not_run: boQua } : {},
    s.ngoaiMay.length ? { evals_not_machine: s.ngoaiMay } : {},
  ));
```

Và `parseEvals` phải rút thêm `criterion` + `paths` cho các task sau — đổi ngay dòng dựng `evalRecords`:

```js
  const evalRecords = parseEvals(evalsText, ['executor', 'cmd', 'status', 'criterion', 'paths']);
```

- [ ] **Step 4: Chạy lại ca — phải XANH cả chiều thật lẫn hai mutant**

Run: `GNRO_CASES=GN01 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: `PASS: GN01 …` + hai dòng `· GN01 chieu do: ban sao do, ghim "…"`.

- [ ] **Step 5: Khai khoá executor + chạy suite scripts**

Thêm vào `_acceptance/config.yaml`, khối riêng cuối `executors.script`:

```yaml
    # --- ghim-lai-noi-ra-o-khong-do (20/09) --- mỗi eval gọi ĐÚNG MỘT ca qua GNRO_CASES.
    # Ca sống vĩnh viễn ở tests/scripts/repin-lane-noi-ra.test.mjs (suite scripts chạy qua glob);
    # khoá ở đây chỉ khoanh một ca để eval ghim đúng vật, không thêm lượt chạy nào.
    gnro_khoa_kieu: "GNRO_CASES=GN01 node tests/scripts/repin-lane-noi-ra.test.mjs"
```

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -5`
Expected: `Results: … 0 failed`

- [ ] **Step 6: Commit**

```bash
git add tests/scripts/repin-lane-noi-ra.test.mjs feature-loop/scripts/repin-lane.mjs _acceptance/config.yaml
git commit -m "feat(repin-lane): dòng ghim nêu ô ngoài làn máy (evals_not_machine)"
```

---

### Task 2: GN02 — hồ sơ toàn eval máy thì khoá VẮNG HẲN

**Files:**
- Modify: `tests/scripts/repin-lane-noi-ra.test.mjs`
- Modify: `_acceptance/config.yaml` (khoá `gnro_vang_han`)

**Interfaces:**
- Consumes: `mkKho({toanMay:true})`, `dongRepinCuoi` (Task 1).
- Produces: không có API mới.

- [ ] **Step 1: Viết ca GN02**

```js
CASES.push({
  id: 'GN02',
  title: 'hồ sơ toàn eval máy: khoá tuỳ chọn VẮNG HẲN, không phải mảng rỗng',
  real(lane) {
    const errs = [];
    const f = mkKho({ toanMay: true });
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 200)}`];
    const d = dongRepinCuoi(f.logPath);
    const keys = Object.keys(d);
    for (const k of ['evals_not_run', 'evals_not_machine', 'evals_not_machine_touched']) {
      if (keys.includes(k)) errs.push(`mang rong thay vi vang: khoa ${k} co mat (${JSON.stringify(d[k])})`);
    }
    if (JSON.stringify(Object.keys(d.evals_exit)) !== JSON.stringify(['E1'])) errs.push(`evals_exit sai: ${JSON.stringify(Object.keys(d.evals_exit))}`);
    return errs;
  },
  mutants: [
    { pin: 'mang rong thay vi vang', make: () => mutant(LANE, "s.ngoaiMay.length ? { evals_not_machine: s.ngoaiMay } : {},", "{ evals_not_machine: s.ngoaiMay },") },
  ],
});
```

- [ ] **Step 2: Chạy — phải XANH ngay (Task 1 đã ghi đúng luật vắng-hẳn), mutant phải ĐỎ**

Run: `GNRO_CASES=GN02 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: `PASS: GN02 …` + `· GN02 chieu do: ban sao do, ghim "mang rong thay vi vang"`.
Nếu mutant KHÔNG đỏ: phép đo chết — sửa ca, không sửa mã sản phẩm.

- [ ] **Step 3: Khai khoá + commit**

Thêm `gnro_vang_han: "GNRO_CASES=GN02 node tests/scripts/repin-lane-noi-ra.test.mjs"` vào cùng khối.

```bash
git add tests/scripts/repin-lane-noi-ra.test.mjs _acceptance/config.yaml
git commit -m "test(repin-lane): GN02 khoá tuỳ chọn vắng hẳn khi hồ sơ toàn eval máy"
```

---

### Task 3: A′ — `evals_not_machine_touched` (diff từ pin cũ chạm `paths`)

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs`
- Modify: `tests/scripts/repin-lane-noi-ra.test.mjs` (GN06, GN07)
- Modify: `_acceptance/config.yaml` (`gnro_diff_cham`, `gnro_glob_mot_nguon`)

**Interfaces:**
- Consumes: `globToRe` từ `./carry-plan.mjs` (đã import sẵn ở đầu `repin-lane.mjs`), `gitRaw`, `s.report`, `s.evalRecords` (Task 1).
- Produces: `s.chamNgoaiMay` (mảng id, tập con của `s.ngoaiMay`) dùng ở Task 4 (section) và Task 5 (thẻ).

- [ ] **Step 1: Viết GN06 + GN07 (chưa có mã → ĐỎ)**

```js
CASES.push({
  id: 'GN06',
  title: 'diff từ PIN CŨ chạm paths của ô ngoài làn máy → khoá touched, không chặn',
  real(lane) {
    const errs = [];
    const f = mkKho();
    // HAI commit sau pin: commit 1 chạm glob, commit 2 không — mốc phải là pin cũ,
    // không phải HEAD~1 (giữa hai lần ghim ở crm là hàng trăm commit).
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham glob');
    fs.writeFileSync(path.join(f.root, 'khong-lien-quan.txt'), 'x\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'khong cham');
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status} (phai 0, khong chan): ${cut(r.stderr, 200)}`];
    const d = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d.evals_not_machine_touched) !== JSON.stringify(['E6'])) {
      errs.push(`touched vang du diff cham / moc diff khong phai pin cu: ${JSON.stringify(d.evals_not_machine_touched)}`);
    }
    // Lượt ghim kế: chỉ commit tệp không khớp glob → khoá VẮNG HẲN.
    fs.writeFileSync(path.join(f.root, 'khong-lien-quan.txt'), 'y\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'lai khong cham');
    const r2 = chayLan(f.root, f.slug, ['--write'], lane);
    if (r2.status !== 0) return errs.concat(`luot 2 exit ${r2.status}: ${cut(r2.stderr, 200)}`);
    const d2 = dongRepinCuoi(f.logPath);
    if (Object.keys(d2).includes('evals_not_machine_touched')) errs.push(`luot sach van co touched: ${JSON.stringify(d2.evals_not_machine_touched)}`);
    // Vật hồ sơ dưới _acceptance/<slug>/rang/ cũng khớp glob → vẫn tính chạm.
    fs.writeFileSync(path.join(f.ws, 'rang', 'r.mjs'), '// v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham rang');
    const r3 = chayLan(f.root, f.slug, ['--write'], lane);
    if (r3.status !== 0) return errs.concat(`luot 3 exit ${r3.status}: ${cut(r3.stderr, 200)}`);
    const d3 = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d3.evals_not_machine_touched) !== JSON.stringify(['E6'])) errs.push(`vat ho so khop glob khong tinh cham: ${JSON.stringify(d3.evals_not_machine_touched)}`);
    return errs;
  },
  mutants: [
    { pin: 'touched vang du diff cham', make: () => mutant(LANE, 'const chamNgoaiMay = chamTuPin(s);', 'const chamNgoaiMay = [];') },
    { pin: 'moc diff khong phai pin cu', make: () => mutant(LANE, "gitRaw('diff', '--name-only', vcCu, '--')", "gitRaw('diff', '--name-only', 'HEAD~1', '--')") },
  ],
});

CASES.push({
  id: 'GN07',
  title: 'khớp glob bằng globToRe của carry-plan (* không xuyên /), không phải tiền tố chuỗi',
  real(lane) {
    const errs = [];
    // paths hẹp: apps/x/*.ts — tệp sâu hơn KHÔNG khớp.
    const f = mkKho({ evals: EVALS_MA_TRAN.replace('      - "apps/x/**"\n      - "_acceptance/feat-gn/rang/**"\n', '      - "apps/x/*.ts"\n') });
    fs.mkdirSync(path.join(f.root, 'apps', 'x', 'sub'), { recursive: true });
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'sub', 'a.ts'), 'v1\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'sau hon');
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 200)}`];
    const d = dongRepinCuoi(f.logPath);
    if (Object.keys(d).includes('evals_not_machine_touched')) errs.push(`khop tien to thay glob: apps/x/sub/a.ts khong duoc khop apps/x/*.ts (${JSON.stringify(d.evals_not_machine_touched)})`);
    // Đối chứng dương: tệp ĐÚNG một tầng → khớp.
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'dung tang');
    const r2 = chayLan(f.root, f.slug, ['--write'], lane);
    if (r2.status !== 0) return errs.concat(`luot 2 exit ${r2.status}: ${cut(r2.stderr, 200)}`);
    const d2 = dongRepinCuoi(f.logPath);
    if (JSON.stringify(d2.evals_not_machine_touched) !== JSON.stringify(['E6'])) errs.push(`doi chung duong hong: ${JSON.stringify(d2.evals_not_machine_touched)}`);
    return errs;
  },
  mutants: [
    { pin: 'khop tien to thay glob', make: () => mutant(LANE, 'res.some(re => re.test(f))', 'gl.some(g => f.startsWith(String(g).replace(/[*?].*$/, "")))') },
  ],
});
```

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `GNRO_CASES=GN06,GN07 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: cả hai FAIL với `touched vang du diff cham` / `doi chung duong hong` (mutant `make` sẽ ném «mui tiem khop 0 lan» — bình thường ở bước này).

- [ ] **Step 3: Viết hàm `chamTuPin` trong `repin-lane.mjs`**

Đặt NGAY TRƯỚC khối kết quả (`const now = new Date();`), sau khối `--skip-unchanged`:

```js
// ── Ô ngoài làn máy mà VẬT ĐO đã đổi (hồ sơ ghim-lai-noi-ra-o-khong-do, A′) ──
// Câu «hồ sơ mà diff chạm đúng phần ui-check đo phải đi vòng S4 delta» sống bằng
// CHỮ từ 07/09 — không máy nào cưỡng chế, và đo ở crm 20/09 thì 3/6 khoảng ghim của
// `tiep-thi-tuyen-doi-tac` chạm `paths` của E6 mà hồ sơ vẫn ghim xanh. Làn KHÔNG chặn
// (quyết định ở Cổng Phạm vi 20/09): nó NÓI RA, và ngưỡng đếm được ở GUIDE §7.1 quyết
// có mở vòng chặn hay không.
//
// Mốc diff là `verified_commit` TRƯỚC khi làn ghi — không phải HEAD~1: giữa hai lần
// ghim ở kho tiêu thụ là hàng trăm commit. Diff tính THÔ (không loại `_acceptance/`,
// không loại t1_skip_globs): `paths` của một eval UI trỏ cả răng của chính nó dưới
// `_acceptance/<slug>/rang/**`, và răng đổi LÀ vật đổi.
const tienToGitPin = gitRaw('rev-parse', '--show-prefix').trim();
function chamTuPin(s) {
  if (!s.ngoaiMay.length) return [];
  const vcCu = (s.report.match(/^verified_commit\s*:\s*(\S+)/m) || [])[1];
  if (!vcCu) { log(`${s.slug}: không đọc được verified_commit — không tính được ô ngoài làn máy có vật đổi`); return []; }
  const co = spawnSync('git', ['-C', root, 'cat-file', '-e', `${vcCu}^{commit}`], { stdio: 'ignore' });
  if (co.status !== 0) { log(`${s.slug}: pin cũ ${vcCu.slice(0, 7)} không có trong kho — không tính được ô ngoài làn máy có vật đổi`); return []; }
  // git in đường tương đối GỐC KHO; `paths` tương đối gốc kho của hồ sơ (--root).
  const doi = gitRaw('diff', '--name-only', vcCu, '--').split('\n').filter(Boolean)
    .map(f => (tienToGitPin && f.startsWith(tienToGitPin) ? f.slice(tienToGitPin.length) : f));
  const cham = [];
  for (const id of s.ngoaiMay) {
    const e = s.evalRecords.find(x => x.id === id);
    const gl = Array.isArray(e && e.paths) ? e.paths : [];
    if (!gl.length) continue;                       // không khai paths → không biết vật nào, không kết luận
    const res = gl.map(globToRe);
    if (doi.some(f => res.some(re => re.test(f)))) cham.push(id);
  }
  return cham;
}
```

- [ ] **Step 4: Gắn vào dòng JSON**

Trong vòng `for (const s of perSlug)` của khối kết quả, ngay sau `const boQua = s.skipped;`:

```js
  const chamNgoaiMay = chamTuPin(s);
```

và thêm nhánh thứ ba vào `Object.assign`:

```js
    chamNgoaiMay.length ? { evals_not_machine_touched: chamNgoaiMay } : {},
```

- [ ] **Step 5: Chạy lại — XANH + mutant ĐỎ**

Run: `GNRO_CASES=GN06,GN07 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: `PASS: GN06 …`, `PASS: GN07 …`, mỗi ca in dòng `· … chieu do: ban sao do, ghim "…"` cho từng mutant.

- [ ] **Step 6: Khai khoá + commit**

```yaml
    gnro_diff_cham: "GNRO_CASES=GN06 node tests/scripts/repin-lane-noi-ra.test.mjs"
    gnro_glob_mot_nguon: "GNRO_CASES=GN07 node tests/scripts/repin-lane-noi-ra.test.mjs"
```

```bash
git add feature-loop/scripts/repin-lane.mjs tests/scripts/repin-lane-noi-ra.test.mjs _acceptance/config.yaml
git commit -m "feat(repin-lane): nêu ô ngoài làn máy có vật đo đã đổi (evals_not_machine_touched)"
```

---

### Task 4: B (làn) — ba hậu tố của section Re-pin + vị từ «AC không có chốt máy»

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs`
- Modify: `tests/scripts/repin-lane-noi-ra.test.mjs` (GN03)
- Modify: `_acceptance/config.yaml` (`gnro_section`)

**Interfaces:**
- Produces: hàm `acKhongChotMay(evalRecords)` → mảng mã AC (thứ tự xuất hiện trong `evals.yaml`); Task 5 dựng bản gộp tương đương trong `gate-card.js` và GN09 so hai bản bằng đẳng thức tập.

- [ ] **Step 1: Viết GN03 (ĐỎ trước)**

```js
CASES.push({
  id: 'GN03',
  title: 'section Re-pin nêu ô ngoài làn máy + AC không có chốt máy; hồ sơ toàn máy thì im',
  real(lane) {
    const errs = [];
    const f = mkKho();
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 200)}`];
    const sec = sectionCuoi(f.reportPath);
    if (!sec.includes('· ngoài làn máy: E6, E7, E12 (E12 không khai paths)')) errs.push(`section thieu hau to ngoai lan may: ${cut(sec, 200)}`);
    const mAC = sec.match(/· AC không có chốt máy: ([^\n·]+)/);
    if (!mAC) errs.push(`section thieu AC khong chot may: ${cut(sec, 200)}`);
    else {
      const got = mAC[1].trim().split(/,\s*/);
      if (JSON.stringify(got) !== JSON.stringify(AC_KHONG)) {
        errs.push(got.includes('AC-d') ? `got AC bang ton tai: ${got.join(',')}` : (got.includes('AC-b') ? `AC khong chot may sai: ${got.join(',')}` : `not-run tinh la chot: ${got.join(',')}`));
      }
    }
    // CHIỀU IM: hồ sơ toàn eval máy — so BYTE với section do WRITER mốc 2.17.0 ghi.
    const g = mkKho({ toanMay: true });
    const rg = chayLan(g.root, g.slug, ['--write'], lane);
    if (rg.status !== 0) return errs.concat(`ho so toan may exit ${rg.status}: ${cut(rg.stderr, 200)}`);
    const nay = chuanHoa(sectionCuoi(g.reportPath));
    const g2 = mkKho({ toanMay: true });
    const laneCu = writerMoc(MOC);
    const rc = chayLan(g2.root, g2.slug, ['--write'], laneCu);
    if (rc.status !== 0) return errs.concat(`writer moc ${MOC} exit ${rc.status}: ${cut(rc.stderr, 200)}`);
    const cu = chuanHoa(sectionCuoi(g2.reportPath));
    if (nay !== cu) errs.push(`section troi so voi lan 2.17.0:\n  nay: ${cut(nay, 160)}\n  cu : ${cut(cu, 160)}`);
    // Đối chứng dương của phép so: trên hồ sơ ma trận hai bản PHẢI khác.
    const h = mkKho(); const h2 = mkKho();
    chayLan(h.root, h.slug, ['--write'], lane);
    chayLan(h2.root, h2.slug, ['--write'], laneCu);
    if (chuanHoa(sectionCuoi(h.reportPath)) === chuanHoa(sectionCuoi(h2.reportPath))) errs.push('phep so byte khong phan biet duoc: ho so ma tran cho section y het ban 2.17.0');
    return errs;
  },
  mutants: [
    { pin: 'section thieu AC khong chot may', make: () => mutant(LANE, '${veAcKhong}', '') },
    { pin: 'got AC bang ton tai', make: () => mutant(LANE, 'evs.every(e => !core.isRepinMachineEval(e))', 'evs.some(e => !core.isRepinMachineEval(e))') },
    { pin: 'not-run tinh la chot', make: () => mutant(LANE, 'evs.every(e => !core.isRepinMachineEval(e))', 'evs.every(e => !core.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || "").trim().toLowerCase()))') },
  ],
});
```

Hai helper mới đặt cạnh `mutant()`:

```js
// Chuẩn hoá section để so BYTE: run_id, sha, ts và ngày là giá trị của lượt chạy.
const chuanHoa = (s) => String(s)
  .replace(/repin-\d{8}T\d{6}Z-\d+/g, '<RUN>')
  .replace(/\b[0-9a-f]{40}\b/g, '<SHA>')
  .replace(/\d{4}-\d{2}-\d{2}/g, '<NGAY>');

// Writer ĐỜI TRƯỚC hồ sơ này: git archive trọn thư mục (không chép tệp tay — một
// tệp thiếu thì bản cũ đỏ vì hạ tầng chứ không vì vật).
const writerCache = new Map();
function writerMoc(sha) {
  if (writerCache.has(sha)) return writerCache.get(sha);
  const ok = spawnSync('git', ['-C', ROOT, 'cat-file', '-e', `${sha}^{commit}`], { encoding: 'utf8' });
  if (ok.status !== 0) throw new Error(`thieu moc ${sha} — can lich su git day du (fetch-depth: 0)`);
  const d = mk(`writer-${sha}-`);
  const tar = path.join(TMP, `writer-${sha}.tar`);
  execFileSync('git', ['-C', ROOT, 'archive', '-o', tar, sha, 'feature-loop', 'lib', 'scripts']);
  execFileSync('tar', ['-xf', tar, '-C', d]);
  const p = path.join(d, 'feature-loop', 'scripts', 'repin-lane.mjs');
  if (!fs.existsSync(p)) throw new Error(`lop ${sha} thieu feature-loop/scripts/repin-lane.mjs sau git archive`);
  writerCache.set(sha, p);
  return p;
}
```

- [ ] **Step 2: Chạy để xác nhận ĐỎ vì thiếu hậu tố**

Run: `GNRO_CASES=GN03 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: `FAIL: GN03 … (DO: vat that: section thieu hau to ngoai lan may …)`

- [ ] **Step 3: Viết vị từ AC + ba hậu tố trong `repin-lane.mjs`**

Đặt cạnh `chamTuPin` (trước khối kết quả):

```js
// «AC không có chốt máy» — MỌI eval phủ AC đó đều không phải eval máy đáng ghim
// (∀, không phải ∃): một AC có cả ui-check lẫn test VẪN có chốt, và đó đúng là lối
// mà lint W8 khuyên khi đòi thêm ui-check. Ô tự khai `status: not-run` KHÔNG phải
// chốt — `isRepinMachineEval` đã loại nó, cùng một vị từ với bên đọc.
function acKhongChotMay(evalRecords) {
  const theoAc = new Map();   // Map giữ thứ tự chèn = thứ tự xuất hiện trong evals.yaml
  for (const e of evalRecords) {
    const ac = String(e.criterion || '').trim();
    if (!ac) continue;
    if (!theoAc.has(ac)) theoAc.set(ac, []);
    theoAc.get(ac).push(e);
  }
  return [...theoAc.entries()].filter(([, evs]) => evs.every(e => !core.isRepinMachineEval(e))).map(([ac]) => ac);
}
```

Trong vòng `for (const s of perSlug)`, sau `const chamNgoaiMay = chamTuPin(s);`:

```js
  const acKhong = acKhongChotMay(s.evalRecords);
  const veNgoaiMay = s.ngoaiMay.length
    ? ` · ngoài làn máy: ${s.ngoaiMay.map(id => {
        const e = s.evalRecords.find(x => x.id === id);
        return Array.isArray(e && e.paths) && e.paths.length ? id : `${id} (${id} không khai paths)`;
      }).join(', ')}`
    : '';
  const veCham = chamNgoaiMay.length ? ` · diff chạm vật đo ngoài làn máy: ${chamNgoaiMay.join(', ')} — chưa chứng lại, đi vòng S4 delta` : '';
  const veAcKhong = acKhong.length ? ` · AC không có chốt máy: ${acKhong.join(', ')}` : '';
```

Nối vào dòng `sha:` của section, SAU `veBoQua`:

```js
  const section = `### Re-pin lần ${n} — ${day}, do ${reason}\nrun_id: ${runId}\nsha: ${sha} · suites: ${suiteCmds.length} lệnh exit 0 · evals: ${dat}/${s.evals.length} eval máy đạt kỳ vọng${veGioiHan}${veHet}${veBoQua}${veNgoaiMay}${veCham}${veAcKhong}\n`;
```

- [ ] **Step 4: Chạy lại — XANH + ba mutant ĐỎ**

Run: `GNRO_CASES=GN01,GN02,GN03,GN06,GN07 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: `Results: 5 passed, 0 failed`

- [ ] **Step 5: Khai khoá + commit**

```yaml
    gnro_section: "GNRO_CASES=GN03 node tests/scripts/repin-lane-noi-ra.test.mjs"
```

```bash
git add feature-loop/scripts/repin-lane.mjs tests/scripts/repin-lane-noi-ra.test.mjs _acceptance/config.yaml
git commit -m "feat(repin-lane): section Re-pin nêu ô ngoài làn máy, vật đổi, và AC không có chốt máy"
```

---

### Task 5: Khuôn SKILL + GUIDE §7.1 + lệnh đếm ngưỡng (GN04, GN05)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (khối `REPIN-TEMPLATE`, câu giới hạn nghi thức re-pin)
- Modify: `GUIDE.md` (§7.1)
- Modify: `tests/scripts/repin-lane-noi-ra.test.mjs` (GN04, GN05)
- Modify: `_acceptance/config.yaml` (`gnro_khuon_skill`, `gnro_guide_nguong`)

**Interfaces:**
- Consumes: `mkKho`, `chayLan`, `dongRepinCuoi` (Task 1), khoá do Task 1/3 ghi.
- Produces: chuỗi lệnh đếm ngưỡng trong GUIDE, rút bằng regex `` /```bash\n(grep -l '"evals_not_machine_touched"'[^\n]*)\n```/ ``.

- [ ] **Step 1: Viết GN04 + GN05 (ĐỎ trước)**

```js
CASES.push({
  id: 'GN04',
  title: 'khoá dòng ghim của script == khoá khuôn REPIN-TEMPLATE, cả ca đủ ba khoá tuỳ chọn',
  real(lane) {
    const errs = [];
    const skill = fs.readFileSync(SKILL, 'utf8');
    const m = skill.match(/<!-- <<<REPIN-TEMPLATE -->\s*```\n([\s\S]*?)```\s*<!-- REPIN-TEMPLATE>>> -->/);
    if (!m) return ['khuon SKILL thieu: khong thay marker REPIN-TEMPLATE'];
    const tl = m[1].split('\n').find(l => l.includes('"kind":"repin"'));
    const filled = tl.replaceAll('<ISO>', '2026-09-20T00:00:00Z').replaceAll('<id>', 'x').replaceAll('<40-hex>', 'a'.repeat(40)).replaceAll('"<E>"', '"E1"');
    const tKeys = Object.keys(JSON.parse(filled));
    for (const k of ['evals_not_machine', 'evals_not_machine_touched']) {
      if (!tKeys.includes(k)) errs.push(`khuon SKILL thieu khoa ${k}`);
    }
    // Hồ sơ đủ BA khoá tuỳ chọn: ma trận + diff chạm paths E6.
    const f = mkKho();
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham');
    const r = chayLan(f.root, f.slug, ['--write'], lane);
    if (r.status !== 0) return errs.concat(`lan exit ${r.status}: ${cut(r.stderr, 200)}`);
    const dKeys = Object.keys(dongRepinCuoi(f.logPath));
    if (JSON.stringify(dKeys) !== JSON.stringify(tKeys)) errs.push(`khuon SKILL thieu hoac lech: script viet ${dKeys.join(',')} · khuon ${tKeys.join(',')}`);
    // Hồ sơ toàn máy: tập khoá = khuôn TRỪ đúng ba khoá tuỳ chọn.
    const g = mkKho({ toanMay: true });
    const rg = chayLan(g.root, g.slug, ['--write'], lane);
    if (rg.status !== 0) return errs.concat(`ho so toan may exit ${rg.status}`);
    const gKeys = Object.keys(dongRepinCuoi(g.logPath));
    const mong = tKeys.filter(k => !['evals_not_run', 'evals_not_machine', 'evals_not_machine_touched'].includes(k));
    if (JSON.stringify(gKeys) !== JSON.stringify(mong)) errs.push(`ho so toan may: script viet ${gKeys.join(',')} · mong ${mong.join(',')}`);
    return errs;
  },
  mutants: [
    { pin: 'khuon SKILL thieu', judge: (p) => { const bak = fs.readFileSync(SKILL, 'utf8'); try { fs.writeFileSync(SKILL, fs.readFileSync(p, 'utf8')); return CASES.find(c => c.id === 'GN04').real(LANE); } finally { fs.writeFileSync(SKILL, bak); } },
      make: () => mutant(SKILL, ',"evals_not_machine":["<E>"]', '') },
  ],
});

CASES.push({
  id: 'GN05',
  title: 'SKILL + GUIDE §7.1 khai khoá touched; lệnh đếm ngưỡng của GUIDE chạy thật',
  real() {
    const errs = [];
    const skill = fs.readFileSync(SKILL, 'utf8');
    const guide = fs.readFileSync(GUIDE, 'utf8');
    if (!/evals_not_machine_touched/.test(skill)) errs.push('SKILL thieu cau touched');
    if (!/evals_not_machine_touched/.test(guide)) errs.push('GUIDE thieu cau touched');
    const mL = guide.match(/```bash\n(grep -l '"evals_not_machine_touched"'[^\n]*)\n```/);
    if (!mL) return errs.concat('GUIDE khong con lenh dem');
    const lenh = mL[1];
    // Chạy THẬT: kho có đúng 1 hồ sơ mang khoá → "1"; kho không hồ sơ nào → "0".
    const f = mkKho();
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham');
    chayLan(f.root, f.slug, ['--write']);
    const co = spawnSync('bash', ['-c', lenh], { cwd: f.root, encoding: 'utf8' });
    if (co.stdout.trim() !== '1') errs.push(`GUIDE khong con lenh dem dung: kho co 1 ho so mang khoa nhung lenh in "${co.stdout.trim()}"`);
    const g = mkKho({ toanMay: true });
    chayLan(g.root, g.slug, ['--write']);
    const khong = spawnSync('bash', ['-c', lenh], { cwd: g.root, encoding: 'utf8' });
    if (khong.stdout.trim() !== '0') errs.push(`lenh dem sai o kho sach: in "${khong.stdout.trim()}"`);
    return errs;
  },
  mutants: [
    { pin: 'GUIDE khong con lenh dem', judge: () => CASES.find(c => c.id === 'GN05').real(),
      make: () => { const bak = fs.readFileSync(GUIDE, 'utf8'); const p = mutant(GUIDE, "grep -l '\"evals_not_machine_touched\"'", "grep -l 'KHONG-CO-KHOA-NAY'"); fs.writeFileSync(GUIDE, fs.readFileSync(p, 'utf8')); process.once('exit', () => { try { fs.writeFileSync(GUIDE, bak); } catch { /* khôi phục */ } }); return p; } },
  ],
});
```

> Ghi chú cho người thi công: hai mutant trên tạm GHI ĐÈ tệp nguồn rồi khôi phục trong `finally` / `process.once('exit')`. Nếu ca bị ngắt giữa chừng, chạy `git checkout -- feature-loop/skills/feature-loop/SKILL.md GUIDE.md` trước khi làm tiếp.

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `GNRO_CASES=GN04,GN05 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: FAIL với `khuon SKILL thieu khoa evals_not_machine` và `GUIDE khong con lenh dem`.

- [ ] **Step 3: Sửa khuôn `REPIN-TEMPLATE` trong SKILL**

Dòng JSON của khuôn thành:

```
{"ts":"<ISO>","kind":"repin","run_id":"<id>","sha":"<40-hex>","suites_exit":[0,0,0,0],"evals_exit":{"<E>":0},"evals_not_run":["<E>"],"evals_not_machine":["<E>"],"evals_not_machine_touched":["<E>"]}
```

Đoạn văn ngay dưới khuôn, sau câu về `evals_not_run`, thêm:

```markdown
Hai khoá `evals_not_machine` và `evals_not_machine_touched` (2.18) theo CÙNG luật
hiện diện: `evals_not_machine` liệt đúng các id có executor NGOÀI làn máy
(`ui-check`/`judgment`) theo thứ tự bản khai — kiểu thắng trạng thái, nên một ô
ngoài làn máy khai `status: not-run` chỉ vào khoá này, không vào `evals_not_run`;
`evals_not_machine_touched` là tập con của nó gồm các id mà `git diff <pin cũ> HEAD`
chạm một glob trong `paths` của chính eval đó. Hồ sơ không có ô nào thì khoá VẮNG
HẲN. Ba tập — khoá của `evals_exit`, `evals_not_run`, `evals_not_machine` — rời nhau
và hợp lại bằng tập id của `evals.yaml`.
```

Câu giới hạn ở cuối đoạn nghi thức re-pin — thay:

> Giới hạn khai: eval `ui-check`/`judgment` không chạy được trong làn máy — re-pin không chứng lại chúng (thẻ và GUIDE §7.1 nói rõ); hồ sơ mà diff chạm đúng phần `ui-check` đo phải đi vòng S4 delta (carry P1 theo `paths`), không đi re-pin.

bằng:

> Giới hạn khai: eval `ui-check`/`judgment` không chạy được trong làn máy — re-pin không chứng lại chúng, và từ 2.18 làn NÓI RA điều đó: `evals_not_machine` liệt mọi id ngoài làn máy, `evals_not_machine_touched` liệt những id mà diff từ pin cũ tới HEAD chạm `paths` của chính chúng, và section Re-pin nêu thêm `AC không có chốt máy`. Làn KHÔNG chặn ở đây (owner quyết 20/09) — hồ sơ mang `evals_not_machine_touched` là hồ sơ phải đi vòng S4 delta (carry P1 theo `paths`), không đi re-pin; ngưỡng mở vòng chặn đếm bằng lệnh ở GUIDE §7.1.

- [ ] **Step 4: Sửa GUIDE §7.1**

Thay đoạn `**Giới hạn khai, một ngưỡng đang đếm:** … ADR 0014.` bằng:

```markdown
**Giới hạn khai, một ngưỡng ĐẾM ĐƯỢC:** eval `ui-check`/`judgment` không chạy được
trong làn máy nên re-pin KHÔNG chứng lại chúng. Từ 2.18 làn nói ra thay vì im: dòng
`kind:repin` mang `evals_not_machine` (mọi id ngoài làn máy) và
`evals_not_machine_touched` (những id mà `git diff <pin cũ> HEAD` chạm `paths` của
chính chúng), section Re-pin nêu thêm `AC không có chốt máy`, và thẻ Cổng Bằng chứng
in cả hai. Hồ sơ mang `evals_not_machine_touched` phải đi vòng S4 delta — làn vẫn ghi
pin, nó không chặn. Ngưỡng mở vòng CHẶN, đếm giữa hai bản phát hành:

```bash
grep -l '"evals_not_machine_touched"' _acceptance/*/run-log.jsonl 2>/dev/null | wc -l | tr -d ' '
```

≥1 hồi quy UI lọt qua một lượt ghim mang khoá đó → mở vòng. Lý do và các lối bị loại:
ADR 0014; ba lối tách hai nghĩa của `ui-check`:
`docs/plans/2026-09-20-hat-giong-tach-hai-nghia-ui-check.md`.
```

- [ ] **Step 5: Chạy lại + chạy suite plugins (SKILL đổi → ca DV1 rút mệnh đề)**

Run: `GNRO_CASES=GN04,GN05 node tests/scripts/repin-lane-noi-ra.test.mjs && bash tests/workflows/run-tests.sh 2>&1 | tail -3 && bash tests/plugins/run-tests.sh 2>&1 | grep -E 'FAIL|^Results:' | tail -5`
Expected: GN04/GN05 PASS; `Results: … 0 failed` cho cả hai suite. DV1e (marker REPIN-TEMPLATE) phải vẫn xanh — nó chỉ đòi khuôn CÓ `evals_exit`/`suites_exit`, thêm khoá không phá.

- [ ] **Step 6: Khai khoá + commit**

```yaml
    gnro_khuon_skill: "GNRO_CASES=GN04 node tests/scripts/repin-lane-noi-ra.test.mjs"
    gnro_guide_nguong: "GNRO_CASES=GN05 node tests/scripts/repin-lane-noi-ra.test.mjs"
```

```bash
git add feature-loop/skills/feature-loop/SKILL.md GUIDE.md tests/scripts/repin-lane-noi-ra.test.mjs _acceptance/config.yaml
git commit -m "docs(repin): khuôn REPIN-TEMPLATE + GUIDE §7.1 khai hai khoá mới và lệnh đếm ngưỡng"
```

---

### Task 6: Bên đọc CŨ và MỚI đều xanh trên dòng mới (GN08)

**Files:**
- Modify: `tests/scripts/repin-lane-noi-ra.test.mjs` (GN08)
- Modify: `_acceptance/config.yaml` (`gnro_ben_doc_cu`)

**Interfaces:**
- Consumes: `writerMoc` (Task 4) — tái dùng cùng cơ chế `git archive` cho bên đọc, thêm `docCuMoc(sha)` trả `{recheck, premerge}`.
- Produces: không có API mới.

- [ ] **Step 1: Viết GN08**

```js
// Bên đọc ĐỜI 2.17.0 — lớp vendored đang chạy ở kho tiêu thụ hôm nay.
const docCache = new Map();
function docCuMoc(sha) {
  if (docCache.has(sha)) return docCache.get(sha);
  const p = writerMoc(sha);                       // đã archive feature-loop + lib + scripts
  const d = path.resolve(path.dirname(p), '..', '..');
  const o = { recheck: path.join(d, 'scripts', 'recheck-evidence.cjs'), premerge: path.join(d, 'scripts', 'pre-merge-check.sh') };
  for (const [k, v] of Object.entries(o)) if (!fs.existsSync(v)) throw new Error(`lop ${sha} thieu ${k} sau git archive`);
  docCache.set(sha, o);
  return o;
}

CASES.push({
  id: 'GN08',
  title: 'dòng ghim mang khoá mới: bên đọc hiện tại VÀ bên đọc 2.17.0 đều xanh, không NOTE mới',
  real() {
    const errs = [];
    const f = mkKho();
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham');
    const r = chayLan(f.root, f.slug, ['--write']);
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 200)}`];
    const d = dongRepinCuoi(f.logPath);
    if (!d.evals_not_machine_touched) errs.push('fixture hong: dong ghim khong mang khoa moi');
    const cu = docCuMoc(MOC);
    const doc = [
      ['recheck nay', () => spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), f.reportPath], { encoding: 'utf8' })],
      ['premerge nay', () => spawnSync('bash', [path.join(ROOT, 'scripts', 'pre-merge-check.sh'), f.root], { encoding: 'utf8' })],
      [`recheck ${MOC}`, () => spawnSync(process.execPath, [cu.recheck, f.reportPath], { encoding: 'utf8' })],
      [`premerge ${MOC}`, () => spawnSync('bash', [cu.premerge, f.root], { encoding: 'utf8' })],
    ];
    for (const [ten, chay] of doc) {
      const x = chay();
      if (x.status !== 0) errs.push(`${ten} DO tren dong moi (exit ${x.status}): ${cut(String(x.stdout) + String(x.stderr), 200)}`);
      if (/VIOLATION/.test(String(x.stdout) + String(x.stderr))) errs.push(`${ten} bao VIOLATION tren dong moi`);
    }
    // Đối chứng ĐỎ: gỡ evals_exit khỏi dòng → cả hai lớp phải đỏ đúng thông điệp.
    const raw = fs.readFileSync(f.logPath, 'utf8').split('\n').filter(Boolean);
    const cuoi = JSON.parse(raw.pop()); delete cuoi.evals_exit;
    fs.writeFileSync(f.logPath, raw.concat(JSON.stringify(cuoi)).join('\n') + '\n');
    for (const [ten, chay] of [['recheck nay', doc[0][1]], [`recheck ${MOC}`, doc[2][1]]]) {
      const x = chay();
      const out = String(x.stdout) + String(x.stderr);
      if (x.status === 0 || !/recorded no evals_exit/.test(out)) errs.push(`doi chung do hong o ${ten}: exit ${x.status}, ${cut(out, 160)}`);
    }
    return errs;
  },
  mutants: [],   // chiều đỏ nằm TRONG ca (đối chứng gỡ evals_exit), không tiêm mã sản phẩm
});
```

- [ ] **Step 2: Chạy**

Run: `GNRO_CASES=GN08 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: `PASS: GN08 …`. Nếu ĐỎ ở `recheck 2826f807` → khoá mới đã phá bên đọc cũ: DỪNG, đó là vi phạm bất biến «không đổi hành vi chặn», không phải lỗi ca.

- [ ] **Step 3: Khai khoá + commit**

```yaml
    gnro_ben_doc_cu: "GNRO_CASES=GN08 node tests/scripts/repin-lane-noi-ra.test.mjs"
```

```bash
git add tests/scripts/repin-lane-noi-ra.test.mjs _acceptance/config.yaml
git commit -m "test(repin-lane): bên đọc hiện tại và 2.17.0 cùng xanh trên dòng ghim có khoá mới"
```

---

### Task 7: Thẻ hai cổng — vị từ AC + cờ + `--extract.chot_may` (GN09, GN10)

**Files:**
- Modify: `scripts/gate-card.js`
- Modify: `tests/scripts/repin-lane-noi-ra.test.mjs` (GN09, GN10)
- Modify: `_acceptance/config.yaml` (`gnro_the_cong_2`, `gnro_the_cong_1`)

**Interfaces:**
- Consumes: `evidenceCore.isRepinMachineEval` (đã `require` ở `gate-card.js:35`), `evalYamlLib.parseEvals` (`:42`).
- Produces: helper `chotMay(dir)` → `{ ac_khong: string[], touched: string[] }`, dùng ở CẢ hai nhánh gate (helper phải đặt TRƯỚC block gate 1 vì nhánh đó `process.exit(0)`).

- [ ] **Step 1: Viết GN09 + GN10 (ĐỎ trước)**

```js
const theExtract = (root, slug, gate) => {
  const r = spawnSync(process.execPath, [CARD, '--root', root, '--slug', slug, '--gate', String(gate), '--extract'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card --gate ${gate} exit ${r.status}: ${cut(r.stderr, 200)}`);
  return JSON.parse(r.stdout);
};
const theHtml = (root, slug, gate, card = CARD) => {
  const r = spawnSync(process.execPath, [card, '--root', root, '--slug', slug, '--gate', String(gate)], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card html --gate ${gate} exit ${r.status}: ${cut(r.stderr, 200)}`);
  return r.stdout;
};

CASES.push({
  id: 'GN09',
  title: 'thẻ Cổng Bằng chứng: cờ AC không có chốt máy + cờ pin đã chạm, round-trip với section',
  real(card) {
    const errs = [];
    const f = mkKho();
    fs.writeFileSync(path.join(f.root, 'apps', 'x', 'a.ts'), 'v2\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'cham');
    const r = chayLan(f.root, f.slug, ['--write']);       // LƯỢT GHIM 1: pin chống lưng mang touched
    if (r.status !== 0) return [`lan exit ${r.status}: ${cut(r.stderr, 200)}`];
    const x = theExtract(f.root, f.slug, 2);
    if (!x.chot_may) return ['the thieu co AC khong chot may: --extract khong co chot_may'];
    if (JSON.stringify(x.chot_may.ac_khong) !== JSON.stringify(AC_KHONG)) {
      const got = x.chot_may.ac_khong || [];
      errs.push(got.includes('AC-d') ? `got AC bang ton tai: ${got.join(',')}` : (got.includes('AC-b') ? `ac_khong sai: ${got.join(',')}` : `not-run tinh la chot: ${got.join(',')}`));
    }
    if (JSON.stringify(x.chot_may.touched) !== JSON.stringify(['E6'])) errs.push(`chot_may.touched sai: ${JSON.stringify(x.chot_may.touched)}`);
    // ROUND-TRIP: danh sách AC của thẻ == danh sách trong section làn ghi.
    const mAC = sectionCuoi(f.reportPath).match(/· AC không có chốt máy: ([^\n·]+)/);
    const secAC = mAC ? mAC[1].trim().split(/,\s*/) : [];
    if (JSON.stringify([...secAC].sort()) !== JSON.stringify([...(x.chot_may.ac_khong || [])].sort())) errs.push(`round-trip lech: section ${secAC.join(',')} · the ${(x.chot_may.ac_khong || []).join(',')}`);
    const html = theHtml(f.root, f.slug, 2, card);
    if (!html.includes('AC không có chốt máy khi ghim lại')) errs.push('the thieu co AC khong chot may: HTML khong co cau');
    if (!html.includes('diff đã chạm vật')) errs.push('HTML thieu co pin da cham');
    // routing KHÔNG đổi so mốc 2.17.0.
    const cu = theExtract2Moc(f.root, f.slug, 2);
    if (JSON.stringify(x.routing) !== JSON.stringify(cu.routing)) errs.push(`routing doi so ${MOC}: ${JSON.stringify(x.routing)} vs ${JSON.stringify(cu.routing)}`);
    // CA ĐẶC HIỆU: lượt ghim 2 sạch → cờ tắt, touched rỗng.
    fs.writeFileSync(path.join(f.root, 'khong-lien-quan.txt'), 'z\n');
    f.git('add', '-A'); f.git('commit', '-qm', 'khong cham');
    const r2 = chayLan(f.root, f.slug, ['--write']);
    if (r2.status !== 0) return errs.concat(`luot 2 exit ${r2.status}`);
    const x2 = theExtract(f.root, f.slug, 2);
    if ((x2.chot_may.touched || []).length) errs.push(`fwarn tu dong repin khong chong lung: pin sach van bao touched ${JSON.stringify(x2.chot_may.touched)}`);
    if (theHtml(f.root, f.slug, 2, card).includes('diff đã chạm vật')) errs.push('fwarn tu dong repin khong chong lung: HTML van co co vang');
    // CHIỀU IM: hồ sơ toàn eval máy.
    const g = mkKho({ toanMay: true });
    chayLan(g.root, g.slug, ['--write']);
    const xg = theExtract(g.root, g.slug, 2);
    if ((xg.chot_may.ac_khong || []).length) errs.push(`chieu im hong: ho so toan may bao ac_khong ${JSON.stringify(xg.chot_may.ac_khong)}`);
    return errs;
  },
  mutants: [
    { pin: 'the thieu co AC khong chot may', make: () => mutant(CARD, 'const cm = chotMay(dir);', 'const cm = { ac_khong: [], touched: [] };') },
    { pin: 'got AC bang ton tai', make: () => mutant(CARD, 'evs.every(e => !evidenceCore.isRepinMachineEval(e))', 'evs.some(e => !evidenceCore.isRepinMachineEval(e))') },
    { pin: 'fwarn tu dong repin khong chong lung', make: () => mutant(CARD, 'dongRepin.filter(o => o.sha === vc).pop()', 'dongRepin.filter(o => o.evals_not_machine_touched).pop()') },
  ],
});
```

`theExtract2Moc` dựng bằng `writerMoc(MOC)` (Task 4 đã archive cả `scripts/`):

```js
const theExtract2Moc = (root, slug, gate) => {
  const d = path.resolve(path.dirname(writerMoc(MOC)), '..', '..');
  const r = spawnSync(process.execPath, [path.join(d, 'scripts', 'gate-card.js'), '--root', root, '--slug', slug, '--gate', String(gate), '--extract'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card ${MOC} exit ${r.status}: ${cut(r.stderr, 200)}`);
  return JSON.parse(r.stdout);
};
```

GN10 — thẻ Cổng Phạm vi, trên hợp đồng `status: draft`:

```js
CASES.push({
  id: 'GN10',
  title: 'thẻ Cổng Phạm vi: cùng vị từ AC không có chốt máy, chiều im khi toàn eval máy',
  real(card) {
    const errs = [];
    const f = mkKho();
    const c = path.join(f.ws, 'contract.md');
    fs.writeFileSync(c, fs.readFileSync(c, 'utf8').replace('status: signed-off', 'status: draft').replace('approved_by: Nguoi Ky\napproved_at: 2026-09-19\n', ''));
    const x = theExtract(f.root, f.slug, 1);
    if (!x.chot_may) return ['the cong 1 thieu co: --extract gate 1 khong co chot_may'];
    if (JSON.stringify(x.chot_may.ac_khong) !== JSON.stringify(AC_KHONG)) {
      const got = x.chot_may.ac_khong || [];
      errs.push(got.includes('AC-d') ? `got AC bang ton tai: ${got.join(',')}` : (got.includes('AC-b') ? `ac_khong sai: ${got.join(',')}` : `not-run tinh la chot: ${got.join(',')}`));
    }
    if (!theHtml(f.root, f.slug, 1, card).includes('AC không có chốt máy khi ghim lại')) errs.push('the cong 1 thieu co: HTML khong co cau');
    const cu = theExtract2Moc(f.root, f.slug, 1);
    if (JSON.stringify(x.routing) !== JSON.stringify(cu.routing)) errs.push(`routing doi so ${MOC}`);
    const g = mkKho({ toanMay: true });
    const gc = path.join(g.ws, 'contract.md');
    fs.writeFileSync(gc, fs.readFileSync(gc, 'utf8').replace('status: signed-off', 'status: draft').replace('approved_by: Nguoi Ky\napproved_at: 2026-09-19\n', ''));
    const xg = theExtract(g.root, g.slug, 1);
    if ((xg.chot_may.ac_khong || []).length) errs.push(`chieu im hong: ${JSON.stringify(xg.chot_may.ac_khong)}`);
    return errs;
  },
  mutants: [
    { pin: 'the cong 1 thieu co', make: () => mutant(CARD, "if (cmG1.ac_khong.length) flags.push(['finfo',", "if (false) flags.push(['finfo',") },
    { pin: 'not-run tinh la chot', make: () => mutant(CARD, 'evs.every(e => !evidenceCore.isRepinMachineEval(e))', 'evs.every(e => !["test","script"].includes(String(e.executor || "").trim().toLowerCase()))') },
  ],
});
```

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `GNRO_CASES=GN09,GN10 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: FAIL với `the thieu co AC khong chot may` / `the cong 1 thieu co`.

- [ ] **Step 3: Helper `chotMay` trong `gate-card.js`**

Đặt NGAY TRƯỚC block gate 1 (cạnh nơi `LNT` được require, trước `if (EXTRACT)` của gate 1):

```js
// ── Chốt máy khi ghim lại (hồ sơ ghim-lai-noi-ra-o-khong-do) ──────────────────
// Làn ghim lại chỉ chạy executor test/script; ui-check và judgment không bao giờ
// chạy trong nó (giới hạn khai, GUIDE §7.1). Một AC mà MỌI eval phủ nó đều ngoài
// làn máy — hoặc tự khai không-chạy — thì lúc ghim lại KHÔNG có chốt máy nào, và
// trước hồ sơ này không mặt nào nói ra điều đó. Vị từ mức eval hỏi
// `evidence-core.isRepinMachineEval` (MỘT nguồn với làn và bên đọc pin); mức AC là
// phép gộp theo `criterion`, và ca GN09 so bản gộp này với bản của làn (round-trip)
// nên hai bản không trôi khỏi nhau.
//
// `touched` đọc dòng repin CHỐNG LƯNG pin hiện tại — dòng có `sha` == `verified_commit`
// của báo cáo, KHÔNG phải dòng đầu tiên mang khoá: một hồ sơ đã chứng lại qua S4 delta
// rồi ghim sạch phải tắt cờ, không mang cờ vàng vĩnh viễn.
function chotMay(dir) {
  const rong = { ac_khong: [], touched: [] };
  const evalsText = read(path.join(dir, 'evals.yaml'));
  if (!evalsText.trim()) return rong;
  let recs = [];
  try { recs = evalYamlLib.parseEvals(evalsText, ['executor', 'status', 'criterion']); } catch (_) { return rong; }
  const theoAc = new Map();
  for (const e of recs) {
    const ac = String(e.criterion || '').trim();
    if (!ac) continue;
    if (!theoAc.has(ac)) theoAc.set(ac, []);
    theoAc.get(ac).push(e);
  }
  const ngoaiMay = new Set(recs.filter(e => !evidenceCore.REPIN_MACHINE_EXECUTORS.includes(String(e.executor || '').trim().toLowerCase())).map(e => e.id));
  const kieuCua = id => { const e = recs.find(x => x.id === id) || {}; const st = String(e.status || '').trim().toLowerCase().replace(/^["']|["']$/g, ''); return `${e.executor}${st === 'not-run' ? ' not-run' : ''}`; };
  const ac_khong = [...theoAc.entries()]
    .filter(([, evs]) => evs.every(e => !evidenceCore.isRepinMachineEval(e)))
    .map(([ac, evs]) => ({ ac, mo: `${ac} (${evs.map(e => `${e.id} ${kieuCua(e.id)}`).join(', ')})` }));
  // touched: dòng repin chống lưng verified_commit của báo cáo
  const vc = (read(path.join(dir, 'evidence-report.md')).match(/^verified_commit\s*:\s*(\S+)/m) || [])[1];
  let touched = [];
  if (vc) {
    const dongRepin = read(path.join(dir, 'run-log.jsonl')).split('\n')
      .filter(l => /"kind"\s*:\s*"repin"/.test(l))
      .map(l => { try { return JSON.parse(l); } catch (_) { return null; } })
      .filter(Boolean);
    const chongLung = dongRepin.filter(o => o.sha === vc).pop();
    if (chongLung && Array.isArray(chongLung.evals_not_machine_touched)) touched = chongLung.evals_not_machine_touched.filter(id => ngoaiMay.has(id));
  }
  return { ac_khong: ac_khong.map(x => x.ac), ac_khong_mo: ac_khong.map(x => x.mo), touched };
}
```

- [ ] **Step 4: Gắn vào gate 1**

Trước `if (EXTRACT)` của gate 1: `const cmG1 = chotMay(dir);`
Thêm `chot_may: { ac_khong: cmG1.ac_khong }` vào object `--extract` gate 1 (sau `ui_observed`).
Trong mảng `flags` của gate 1, ngay SAU khối `if (uiObserved.applicable && !uiObserved.present) {…}`:

```js
  if (cmG1.ac_khong.length) flags.push(['finfo', `AC không có chốt máy khi ghim lại: ${esc((cmG1.ac_khong_mo || cmG1.ac_khong).join(', '))} — làn ghim lại chỉ chạy eval test/script, nên các tiêu chí này sẽ không được chứng lại ở mỗi lượt ghim (GUIDE §7.1). Muốn có chốt: ghép thêm ≥1 eval test/script cho cùng tiêu chí.`]);
```

- [ ] **Step 5: Gắn vào gate 2**

Trước `if (EXTRACT)` của gate 2: `const cm = chotMay(dir);`
Thêm `chot_may: { ac_khong: cm.ac_khong, touched: cm.touched }` vào object `--extract` gate 2 (sau `ui_observed: uiObserved2`).
Trong mảng `flags` của gate 2, ngay SAU khối `if (uiObserved2.applicable) {…}`:

```js
if (cm.ac_khong.length) flags.push(['finfo', `AC không có chốt máy khi ghim lại: ${esc((cm.ac_khong_mo || cm.ac_khong).join(', '))} — làn ghim lại chỉ chạy eval test/script; diff chạm vật các eval này phải đi vòng S4 delta.`]);
if (cm.touched.length) flags.push(['fwarn', `Pin hiện tại: diff đã chạm vật ${esc(cm.touched.join(', '))} đo (ngoài làn máy), chưa chứng lại — lượt ghim gần nhất KHÔNG chạy các eval đó.`]);
```

- [ ] **Step 6: Chạy lại + suite**

Run: `GNRO_CASES=GN09,GN10 node tests/scripts/repin-lane-noi-ra.test.mjs && bash tests/plugins/run-tests.sh 2>&1 | grep -E 'FAIL|^Results:' | tail -5`
Expected: GN09/GN10 PASS (kèm dòng chiều đỏ của từng mutant); suite plugins `0 failed` — đặc biệt LM20 (routing baseline) phải xanh vì `routing` không đổi.

- [ ] **Step 7: Khai khoá + commit**

```yaml
    gnro_the_cong_2: "GNRO_CASES=GN09 node tests/scripts/repin-lane-noi-ra.test.mjs"
    gnro_the_cong_1: "GNRO_CASES=GN10 node tests/scripts/repin-lane-noi-ra.test.mjs"
```

```bash
git add scripts/gate-card.js tests/scripts/repin-lane-noi-ra.test.mjs _acceptance/config.yaml
git commit -m "feat(gate-card): hai thẻ nêu AC không có chốt máy và pin đã chạm vật ngoài làn máy"
```

---

### Task 8: W8 nói kèm giá + hạt giống + bộ chọn + suite trọn (GN11, GN12, E12/E14)

**Files:**
- Modify: `scripts/eval-coverage-lint.js`
- Modify: `tests/scripts/repin-lane-noi-ra.test.mjs` (GN11, GN12)
- Modify: `_acceptance/config.yaml` (`gnro_w8_gia`, `gnro_bo_chon`, `gnro_suite_con_lai`, `gnro_hat_giong`)

**Interfaces:**
- Consumes: mọi helper của Task 1–7.
- Produces: bộ ca đầy đủ GN01–GN12.

- [ ] **Step 1: Viết GN11 + GN12**

```js
CASES.push({
  id: 'GN11',
  title: 'W8 giữ tiền tố cũ và NỐI câu giá; hợp đồng không có mặt người nhìn thì im',
  real() {
    const errs = [];
    const f = mkKho();                                    // surfaces: [ui], evals có ui-check
    const c = path.join(f.ws, 'contract.md');
    // Gỡ ui-check để W8 nổ: chỉ còn eval máy + judgment.
    fs.writeFileSync(path.join(f.ws, 'evals.yaml'), EVALS_TOAN_MAY);
    const lint = (root) => spawnSync(process.execPath, [LINT, root], { encoding: 'utf8' });
    const out = String(lint(f.root).stdout);
    const w8 = out.split('\n').filter(l => /W8 surfaces include a human-visible/.test(l));
    if (!w8.length) return ['fixture hong: W8 khong no tren hop dong surfaces [ui] khong ui-check'];
    const d = w8.join(' ');
    for (const chuoi of ['không có chốt máy khi ghim lại', 'GUIDE §7.1', 'test/script cho cùng tiêu chí']) {
      if (!d.includes(chuoi)) errs.push(`W8 thieu cau gia: khong thay "${chuoi}"`);
    }
    // CHIỀU IM: surfaces [api] → số dòng W bằng bản mốc 2.17.0 trên cùng fixture.
    const g = mkKho();
    fs.writeFileSync(path.join(g.ws, 'evals.yaml'), EVALS_TOAN_MAY);
    const gc = path.join(g.ws, 'contract.md');
    fs.writeFileSync(gc, fs.readFileSync(gc, 'utf8').replace('surfaces: [ui]', 'surfaces: [api]'));
    const nay = String(lint(g.root).stdout).split('\n').filter(l => /^\[/.test(l)).length;
    const lintCu = path.join(path.resolve(path.dirname(writerMoc(MOC)), '..', '..'), 'scripts', 'eval-coverage-lint.js');
    const cu = String(spawnSync(process.execPath, [lintCu, g.root], { encoding: 'utf8' }).stdout).split('\n').filter(l => /^\[/.test(l)).length;
    if (nay !== cu) errs.push(`chieu im hong: surfaces [api] ra ${nay} dong W, ban ${MOC} ra ${cu}`);
    return errs;
  },
  mutants: [
    { pin: 'W8 thieu cau gia', judge: () => CASES.find(c => c.id === 'GN11').real(),
      make: () => { const bak = fs.readFileSync(LINT, 'utf8'); const p = mutant(LINT, ' Giá đã khai:', ' KHONG-PHAI-CAU-GIA:'); fs.writeFileSync(LINT, fs.readFileSync(p, 'utf8')); process.once('exit', () => { try { fs.writeFileSync(LINT, bak); } catch { /* khôi phục */ } }); return p; } },
  ],
});

CASES.push({
  id: 'GN12',
  title: 'bộ chọn GNRO_CASES: một ca in đúng một dòng; khớp 0 ca thì đỏ có tên',
  real() {
    const errs = [];
    const mot = spawnSync(process.execPath, [SELF], { encoding: 'utf8', env: { ...process.env, GNRO_CASES: 'GN02' } });
    const dong = String(mot.stdout).split('\n').filter(l => /^\s*(PASS|FAIL): GN\d\d/.test(l));
    if (dong.length !== 1) errs.push(`bo chon sai: GNRO_CASES=GN02 in ${dong.length} dong ket qua`);
    else if (!dong[0].includes('GN02')) errs.push(`bo chon sai: dong ket qua khong mang GN02 (${cut(dong[0], 80)})`);
    const khong = spawnSync(process.execPath, [SELF], { encoding: 'utf8', env: { ...process.env, GNRO_CASES: 'GN99' } });
    if (khong.status === 0 || !String(khong.stdout).includes('GNRO_CASES khop 0 ca')) {
      errs.push(`bo chon 0 ca khong do: exit ${khong.status}, ${cut(khong.stdout, 120)}`);
    }
    return errs;
  },
  mutants: [
    { pin: 'bo chon 0 ca khong do', judge: (p) => { const r = spawnSync(process.execPath, [p], { encoding: 'utf8', env: { ...process.env, GNRO_CASES: 'GN99' } }); return (r.status === 0 || !String(r.stdout).includes('GNRO_CASES khop 0 ca')) ? ['bo chon 0 ca khong do'] : []; },
      make: () => mutant(SELF, "if (!chosen.length) { console.log(`GNRO_CASES khop 0 ca: ${want.join(',')}`); process.exit(1); }", 'if (!chosen.length) { process.exit(0); }') },
  ],
});
```

- [ ] **Step 2: Chạy để xác nhận GN11 ĐỎ (GN12 nên xanh sẵn)**

Run: `GNRO_CASES=GN11,GN12 node tests/scripts/repin-lane-noi-ra.test.mjs`
Expected: `FAIL: GN11 … (DO: vat that: W8 thieu cau gia …)`, `PASS: GN12 …`.

- [ ] **Step 3: Nối câu giá vào W8**

Trong `scripts/eval-coverage-lint.js`, câu W8 nghĩa vụ — nối vào cuối chuỗi (GIỮ NGUYÊN tiền tố `W8 surfaces include a human-visible`, ca PV4 ghim nó):

```js
      warns.push(`[${slug}] W8 surfaces include a human-visible UI (${surf}) but evals.yaml không có eval executor: ui-check — bằng chứng lớp mã thay lớp nhìn-thấy; thêm ≥1 ui-check (layer: ui-observed) theo hợp đồng, hoặc ghi entry descope "${lnt.UI_OBSERVED_DESCOPE}<lý do>". Giá đã khai: eval ui-check KHÔNG chạy trong làn ghim lại (GUIDE §7.1), nên tiêu chí chỉ được ui-check phủ sẽ không có chốt máy khi ghim lại — muốn có chốt thì ghép thêm ≥1 eval test/script cho cùng tiêu chí.`);
```

- [ ] **Step 4: Chạy lại GN11 + suite scripts**

Run: `GNRO_CASES=GN11 node tests/scripts/repin-lane-noi-ra.test.mjs && bash tests/scripts/run-tests.sh 2>&1 | tail -3`
Expected: `PASS: GN11 …` + chiều đỏ; `Results: … 0 failed` (PV4 phải còn xanh — tiền tố không đổi).

- [ ] **Step 5: Khai bốn khoá còn lại + chạy trọn bốn suite**

```yaml
    gnro_w8_gia: "GNRO_CASES=GN11 node tests/scripts/repin-lane-noi-ra.test.mjs"
    gnro_bo_chon: "GNRO_CASES=GN12 node tests/scripts/repin-lane-noi-ra.test.mjs"
    gnro_suite_con_lai: 'bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/workflows/run-tests.sh && node scripts/product-map.mjs --root . --check'
    gnro_hat_giong: 'test -f docs/plans/2026-09-20-hat-giong-tach-hai-nghia-ui-check.md && grep -qF "_acceptance/ghim-lai-noi-ra-o-khong-do/" docs/plans/2026-09-20-hat-giong-tach-hai-nghia-ui-check.md && ONLY_BLOCK=VC8 bash tests/plugins/run-tests.sh'
```

> `gnro_suite_con_lai` cố ý KHÔNG gọi suite plugins: eval E12 của hợp đồng khai cả bốn suite, và `gnro_hat_giong` đã chạy khối VC8 của plugins. Người thi công chạy trọn plugins ở Step 6 trước khi commit.

Run: `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/workflows/run-tests.sh && bash tests/plugins/run-tests.sh 2>&1 | grep -E 'FAIL|^Results:' | tail -5 && node scripts/product-map.mjs --root . --check`
Expected: bốn `Results: … 0 failed` + `PRODUCT-MAP.md khớp hồ sơ xưởng.`

- [ ] **Step 6: Commit + đặt contract sang `implemented`**

```bash
git add scripts/eval-coverage-lint.js tests/scripts/repin-lane-noi-ra.test.mjs _acceptance/config.yaml
git commit -m "feat(lint): W8 nói kèm giá ở làn ghim lại; bộ ca GN01–GN12 đủ bộ"
```

Rồi sửa `_acceptance/ghim-lai-noi-ra-o-khong-do/contract.md` frontmatter `status: approved` → `status: implemented` và commit riêng:

```bash
git add _acceptance/ghim-lai-noi-ra-o-khong-do/contract.md
git commit -m "chore(ghim-lai-noi-ra-o-khong-do): code xong, chuyển sang implemented"
```

---

## Self-Review

**1. Spec coverage:** A → Task 1 (AC-1) + Task 2 (AC-1 chiều vắng) · A′ → Task 3 (AC-4, AC-5) · B làn → Task 4 (AC-2) · B thẻ → Task 7 (AC-7) · C0 thẻ gate 1 → Task 7 (AC-8) · C0 W8 → Task 8 (AC-8) · C0 SKILL/GUIDE → Task 5 (AC-3) · bên đọc không đổi → Task 6 (AC-6) · lưới + hạt giống + bộ chọn → Task 8 (AC-9). 9/9 AC có task; 14/14 eval có khoá executor.

**2. Placeholder scan:** không còn "TBD"/"tương tự Task N"; mọi step có mã thật hoặc lệnh thật + kỳ vọng.

**3. Type consistency:** `ngoaiMay` · `chamNgoaiMay` · `acKhongChotMay` · `chotMay` · `evalRecords` dùng thống nhất; `mkKho` trả `{root, ws, slug, git, head, logPath, reportPath}` và mọi ca dùng đúng các trường đó; `writerMoc(sha)` trả đường `repin-lane.mjs`, `docCuMoc`/`theExtract2Moc` suy thư mục từ nó. Ba khoá JSON viết y hệt ở writer, khuôn SKILL, GUIDE, thẻ và ca.

**Rủi ro đã biết, nêu cho người thi công:**
- GN04/GN05/GN11 tạm ghi đè tệp nguồn (SKILL/GUIDE/lint) rồi khôi phục. Ngắt giữa chừng → `git checkout -- feature-loop/skills/feature-loop/SKILL.md GUIDE.md scripts/eval-coverage-lint.js`.
- `pre-merge-check.sh` chạy trong GN08 trên kho tạm cần hồ sơ đủ hình dạng; nếu nó đỏ vì lý do KHÔNG liên quan khoá mới (thiếu `## Iterations`, thiếu chữ ký), sửa FIXTURE, không sửa bên đọc.
- Mọi mutant `make()` phải khớp ĐÚNG MỘT LẦN: nếu mã sản phẩm viết khác chuỗi trong plan, sửa chuỗi mũi tiêm cho khớp mã thật — đừng nới thành khớp nhiều lần.
