# start-scan-hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bộ quét `/start` gặp đầu vào bất thường thì **lỗi có tên**, không đổi nghĩa: lỗi I/O ≠ file vắng, verdict lạ/vắng bị gọi tên ở mọi nhánh, argv hỏng → exit 2, chân đối chứng docs đỏ được thật.

**Architecture:** Ba sửa nhỏ trong `scripts/start-scan.mjs` (một helper đọc, một nhánh from-vựng, một khối validate argv đặt TRƯỚC mọi I/O) + hai case test mới + viết lại chân âm P101 thành hàm dùng chung. Schema JSON **không đổi key** — chỉ nội dung `broken[].reason` phong phú hơn.

**Tech Stack:** Node ESM (`.mjs`), `lib/evidence-core.js` (CJS qua `createRequire`); test là node/python heredoc trong `tests/plugins/run-tests.sh`.

## Global Constraints

- Contract `_acceptance/start-scan-hardening/contract.md` (AC-1…AC-5) · evals E1–E9. Mọi case máy trong `tests/plugins/run-tests.sh`.
- **Assertion âm-tính-một-mình là assertion chết** (CLAUDE.md): mỗi case phải có **đối chứng dương XANH trước** + **ghim đúng thông điệp**, không chỉ mã thoát. Fixture **do code sinh trong chính lần chạy**; mọi path suy từ `$ROOT`, không hardcode checkout.
- Script **chỉ-đọc tuyệt đối**. **KHÔNG thêm/đổi key JSON** — marker `START-SCAN-KEYS` ở `commands/start.md` và `codex/acceptance-gate/skills/start/SKILL.md` giữ nguyên (P99 là phép đo).
- Mirror: sửa nguồn xong PHẢI `bash scripts/sync-plugin-packages.sh` và commit `plugins/` **cùng lượt** (P30/P41).
- Đang ở nhánh `feat/start-scan-hardening`. Vòng F-B chạy song song cũng chạm `start-scan.mjs` — **không rebase/merge nhánh F-B vào đây giữa chừng**; hoà giải ở PR.
- P-number mới: **P102** (I/O errors + off-vocab verdict) · **P103** (argv, 5 lối chết + 1 dương). P101 viết lại tại chỗ, **giữ nguyên tên case**.

---

### Task 1: `read()` phân biệt ENOENT với lỗi I/O thật (AC-1)

**Phục vụ:** E1. **independent:** false (Task 2/3 sửa cùng file).
**Verify:** `bash tests/plugins/run-tests.sh 2>&1 | grep -E 'P102|FAIL'`

**Files:**
- Modify: `scripts/start-scan.mjs:27` (`read`), vòng lặp phân ô (`cTxt`/`oTxt`/`eTxt`)
- Modify: `tests/plugins/run-tests.sh` (thêm P102 sau P101)

**Interfaces:**
- Produces: `read(p) → { t: string|null, err: NodeJS.ErrnoException|null }` — `t` là nội dung khi đọc được; `err` chỉ khác null khi lỗi **không phải** ENOENT. `t === null && err === null` nghĩa là file thật sự vắng.
- Produces: reason chuẩn cho lỗi I/O: `` `không đọc được (${err.code})` `` — Task 2 dùng lại đúng khuôn này.

- [ ] **Step 1: Viết P102 phần I/O (RED)** — chèn vào `tests/plugins/run-tests.sh` ngay TRƯỚC khối `if [ "$failures" -gt 0 ]`:

```bash
# ── P102: loi I/O co TEN, verdict ngoai tu vung bi goi ten (AC-1, AC-2) ─────
# Doi chung DUONG (fixture nguyen ven XANH) truoc moi buoc tiem; moi buoc tiem
# ghim DUNG thong diep. Fixture do CODE sinh trong chinh lan chay.
run "P102 start-scan: loi I/O neu ten file+ma loi; verdict la/vang bi goi ten (E1,E2)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p102-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status) =>
  `---\nschema_version: 1\nslug: ${slug}\nrisk_tier: T2\nstatus: ${status}\n---\n# C\n`;
const opp = (slug, decision) =>
  `---\nschema_version: 1\nslug: ${slug}\nstage: decided\ndecision: ${decision}\n---\n# O\n`;

W('_acceptance/config.yaml', 'schema_version: 1\n');
// a: contract mat quyen doc, CO opportunity park nam canh -> khong duoc roi sang park
W('_acceptance/a-eacces/contract.md', contract('a-eacces', 'verified'));
W('_acceptance/a-eacces/opportunity.md', opp('a-eacces', 'park'));
// b: contract la THU MUC
W('_acceptance/b-eisdir/x', 'noise\n');
// c: evidence-report mat quyen doc tren slug implemented
W('_acceptance/c-ev-eacces/contract.md', contract('c-ev-eacces', 'implemented'));
W('_acceptance/c-ev-eacces/evidence-report.md', '---\nverdict: PASS\n---\n# E\n');
// d/e: nhanh verdict; f: slug lanh lam doi chung
W('_acceptance/d-offvocab/contract.md', contract('d-offvocab', 'implemented'));
W('_acceptance/d-offvocab/evidence-report.md', '---\nschema_version: 2\nverdict: FAIL\n---\n# E\n');
W('_acceptance/e-noverdict/contract.md', contract('e-noverdict', 'implemented'));
W('_acceptance/e-noverdict/evidence-report.md', '---\nschema_version: 2\nslug: e\n---\n# E\n');
W('_acceptance/f-ok/contract.md', contract('f-ok', 'approved'));
W('_acceptance/g-reject/contract.md', contract('g-reject', 'implemented'));
W('_acceptance/g-reject/evidence-report.md', '---\nschema_version: 2\nverdict: REJECT\n---\n# E\n');

const scan = () => JSON.parse(execFileSync('node', [SCAN, '--root', tmp], { encoding: 'utf8' }));
const brokenOf = (r, slug) => r.broken.find(b => b.slug === slug);

// ---- DOI CHUNG DUONG: chua tiem gi, moi slug phan o binh thuong ----
const r0 = scan();
if (brokenOf(r0, 'a-eacces')) die('doi chung duong: a-eacces chua tiem ma da broken');
if (!r0.groups.gates.find(g => g.slug === 'a-eacces')) die('doi chung duong: a-eacces phai o gates');
if (!r0.groups.inProgress.find(g => g.slug === 'f-ok')) die('doi chung duong: f-ok phai o inProgress');

// ---- (a) EACCES tren contract.md ----
const aPath = path.join(tmp, '_acceptance/a-eacces/contract.md');
fs.chmodSync(aPath, 0o000);
if (fs.readFileSync.length && (() => { try { fs.readFileSync(aPath, 'utf8'); return true } catch { return false } })())
  { fs.chmodSync(aPath, 0o644); console.log('P102 SKIP: chay bang root, chmod khong chan duoc doc'); process.exit(0); }
const r1 = scan();
const a = brokenOf(r1, 'a-eacces');
if (!a) die('EACCES contract phai vao broken[], khong duoc im lang');
if (a.file !== 'contract.md') die(`broken phai ghim dung ten file, duoc: ${JSON.stringify(a)}`);
if (!/EACCES/.test(a.reason)) die(`reason phai neu ma loi he thong, duoc: ${a.reason}`);
if (/không có|khong co/.test(a.reason)) die(`reason noi doi "khong co file" trong khi file con do: ${a.reason}`);
if (r1.groups.done.find(g => g.slug === 'a-eacces')) die('slug loi I/O bi roi sang o park cua opportunity ben canh');
fs.chmodSync(aPath, 0o644);

// ---- (b) contract.md la THU MUC ----
fs.mkdirSync(path.join(tmp, '_acceptance/b-eisdir/contract.md'));
const b = brokenOf(scan(), 'b-eisdir');
if (!b || b.file !== 'contract.md' || !/EISDIR/.test(b.reason))
  die(`contract la thu muc phai vao broken kem EISDIR, duoc: ${JSON.stringify(b)}`);

// ---- (c) EACCES tren evidence-report.md (slug implemented) ----
const cPath = path.join(tmp, '_acceptance/c-ev-eacces/evidence-report.md');
fs.chmodSync(cPath, 0o000);
const r3 = scan();
const c = brokenOf(r3, 'c-ev-eacces');
if (!c) die('EACCES evidence-report phai vao broken[]');
if (c.file !== 'evidence-report.md') die(`phai ghim ten evidence-report.md, duoc: ${JSON.stringify(c)}`);
if (!/EACCES/.test(c.reason)) die(`reason phai neu ma loi, duoc: ${c.reason}`);
if (r3.groups.inProgress.find(g => g.slug === 'c-ev-eacces'))
  die('slug co evidence loi I/O van bi day sang nextStep — khong duoc doan buoc ke');
fs.chmodSync(cPath, 0o644);

// ---- (d) verdict NGOAI tu vung tren implemented ----
const d = brokenOf(scan(), 'd-offvocab');
if (!d || !/verdict không nhận diện được: FAIL/.test(d.reason))
  die(`verdict la phai bi goi ten cung khuon nhanh verified, duoc: ${JSON.stringify(d)}`);

// ---- (e) evidence CO frontmatter nhung VANG dong verdict ----
const e = brokenOf(scan(), 'e-noverdict');
if (!e || !/thiếu verdict/.test(e.reason))
  die(`verdict vang phai bi goi ten, duoc: ${JSON.stringify(e)}`);

// ---- doi chung DUONG cuoi: REJECT van ra S3-fix nhu cu ----
const g = scan().groups.inProgress.find(x => x.slug === 'g-reject');
if (!g || g.nextStep !== 'S3-fix') die(`REJECT phai giu nextStep S3-fix, duoc: ${JSON.stringify(g)}`);
console.log('P102 OK');
JS
```

- [ ] **Step 2: Chạy, xác nhận FAIL** — `bash tests/plugins/run-tests.sh 2>&1 | grep -A2 '^P102'` → phải đỏ ở chân (a) (`reason` hiện là `không có contract.md lẫn opportunity.md` hoặc slug rơi sang park).

- [ ] **Step 3: Sửa `read()` + call-site trong `scripts/start-scan.mjs`.** Thay dòng 27:

```js
// ENOENT (file vắng) là tin bình thường; MỌI lỗi khác là sự thật phải nêu tên —
// nuốt chung một rọ biến "mất quyền đọc" thành "không có file", và slug bị phân
// ô theo artifact bên cạnh (Cổng 2 start-command, known-limit 1).
const read = p => {
  try { return { t: readFileSync(p, 'utf8'), err: null }; }
  catch (e) { return e.code === 'ENOENT' ? { t: null, err: null } : { t: null, err: e }; }
};
const ioReason = err => `không đọc được (${err.code})`;
```

Rồi sửa ba call-site trong vòng lặp — đọc một lần, kiểm `err` TRƯỚC khi dùng `t`:

```js
  const cRead = read(cPath), oRead = read(oPath);
  if (cRead.err) { broken.push({ slug, file: 'contract.md', reason: ioReason(cRead.err) }); continue; }
  if (oRead.err) { broken.push({ slug, file: 'opportunity.md', reason: ioReason(oRead.err) }); continue; }
  const cTxt = cRead.t, oTxt = oRead.t;
```

và trong nhánh `cTxt != null`, thay `const eTxt = read(path.join(dir, 'evidence-report.md'));` bằng:

```js
    const eRead = read(path.join(dir, 'evidence-report.md'));
    if (eRead.err) { broken.push({ slug, file: 'evidence-report.md', reason: ioReason(eRead.err) }); continue; }
    const eTxt = eRead.t;
```

- [ ] **Step 4: Chạy lại** — chân (a)(b)(c) xanh; (d)(e) vẫn đỏ (Task 2 lo). `bash tests/plugins/run-tests.sh 2>&1 | grep -A2 '^P102'`

- [ ] **Step 5: Commit**

```bash
bash scripts/sync-plugin-packages.sh
git add scripts/start-scan.mjs tests/plugins/run-tests.sh plugins/acceptance-gate/scripts/start-scan.mjs
git commit -m "fix(start-scan): read() chỉ nuốt ENOENT — lỗi I/O nêu tên file + mã lỗi (AC-1)"
```

---

### Task 2: Verdict lạ / vắng bị gọi tên ở mọi nhánh (AC-2)

**Phục vụ:** E2. **independent:** false (sau Task 1 — dùng `eRead.t`).
**Verify:** `bash tests/plugins/run-tests.sh 2>&1 | grep -E 'P102|FAIL'`

**Files:**
- Modify: `scripts/start-scan.mjs` (nhánh `status === 'implemented'`)

**Interfaces:**
- Consumes: `eTxt` từ Task 1. Produces: từ vựng verdict dùng chung `VERDICT_OK = ['PASS', 'REJECT', 'PENDING-JUDGMENT']` cho cả hai nhánh `implemented` và `verified`.

- [ ] **Step 1: Chạy P102 xác nhận chân (d)(e) đang ĐỎ** — `bash tests/plugins/run-tests.sh 2>&1 | grep -A2 '^P102'` → thông điệp phải là `verdict la phai bi goi ten...` hoặc `verdict vang phai bi goi ten...`.

- [ ] **Step 2: Thêm từ vựng dùng chung + sửa nhánh implemented.** Ngay dưới `const gates = [], inProgress = [], done = [], broken = [];` thêm:

```js
// MỘT từ vựng verdict cho MỌI nhánh: nhánh `verified` gọi tên giá trị lạ trong
// khi nhánh `implemented` nuốt im lặng là chỗ duy nhất cùng một artifact hỏng
// được phát hiện hay không tuỳ status của contract (Cổng 2 start-command, known-limit 3).
const VERDICT_OK = ['PASS', 'REJECT', 'PENDING-JUDGMENT'];
```

Rồi thay dòng nhánh `implemented`:

```js
    else if (status === 'implemented') {
      if (eTxt != null && verdict === '') broken.push({ slug, file: 'evidence-report.md', reason: 'thiếu verdict' });
      else if (eTxt != null && !VERDICT_OK.includes(verdict)) broken.push({ slug, file: 'evidence-report.md', reason: `verdict không nhận diện được: ${verdict}` });
      else inProgress.push({ slug, status, nextStep: verdict === 'REJECT' ? 'S3-fix' : 'S4', tier });
    }
```

Và trong nhánh `verified`, thay điều kiện cuối cho dùng chung từ vựng:

```js
      else if (VERDICT_OK.includes(verdict)) gates.push({ slug, gate: 'bang-chung', since: since(cPath, frontmatterField(cTxt, 'approved_at')), tier });
      else broken.push({ slug, file: 'evidence-report.md', reason: `verdict không nhận diện được: ${verdict}` });
```

> Lưu ý: nhánh `verified` đang có `verdict === 'REJECT' → S3-fix` và `signoff → done` ĐỨNG TRƯỚC — giữ nguyên thứ tự đó, chỉ thay hai dòng cuối.

- [ ] **Step 3: Chạy P102 → PASS trọn** (cả 5 chân + 2 đối chứng dương).

- [ ] **Step 4: Chạy P98 xác nhận không thoái lui** — `bash tests/plugins/run-tests.sh 2>&1 | grep -A2 '^P98'` → PASS (fixture P98 có `i-implemented` không evidence và `j-reject`, đều phải giữ nextStep cũ).

- [ ] **Step 5: Commit**

```bash
bash scripts/sync-plugin-packages.sh
git add scripts/start-scan.mjs plugins/acceptance-gate/scripts/start-scan.mjs
git commit -m "fix(start-scan): một từ vựng verdict cho mọi nhánh — giá trị lạ/vắng bị gọi tên (AC-2)"
```

---

### Task 3: Argv chặt — 5 lối chết exit 2 (AC-3)

**Phục vụ:** E3. **independent:** false (cùng file).
**Verify:** `bash tests/plugins/run-tests.sh 2>&1 | grep -E 'P103|FAIL'`

**Files:**
- Modify: `scripts/start-scan.mjs:19-25` (khối argv, đặt TRƯỚC mọi I/O)
- Modify: `tests/plugins/run-tests.sh` (thêm P103 sau P102)

**Interfaces:**
- Produces: exit **2** + thông điệp stderr cho mọi argv hỏng; stdout **rỗng**. `config:false` chỉ còn nghĩa duy nhất "root có thật, repo chưa `acceptance-init`".

- [ ] **Step 1: Viết P103 (RED)** — chèn sau P102:

```bash
# ── P103: argv hong CHET TO exit 2, khong doi nghia thanh chan doan repo (AC-3)
# Lop "declared-but-unusable" da chot o pre-merge-check v1.22.1 va
# sync-plugin-packages (mode la khong duoc am tham roi ve ghi de).
run "P103 start-scan argv: 5 loi chet exit 2 ghim thong diep + doi chung duong (E3)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };
const runScan = a => spawnSync('node', [SCAN, ...a], { encoding: 'utf8' });

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p103-'));
fs.mkdirSync(path.join(tmp, 'ok/_acceptance'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'ok/_acceptance/config.yaml'), 'schema_version: 1\n');
const okDir = path.join(tmp, 'ok');
const plainFile = path.join(tmp, 'la-file-thuong.txt');
fs.writeFileSync(plainFile, 'toi khong phai thu muc\n');

// ---- DOI CHUNG DUONG truoc moi loi chet: loi goi DUNG van chay ----
const ok = runScan(['--root', okDir]);
if (ok.status !== 0) die(`doi chung duong that bai: --root hop le phai exit 0, duoc ${ok.status} / ${ok.stderr}`);
let parsed; try { parsed = JSON.parse(ok.stdout) } catch { die('doi chung duong: stdout khong parse duoc JSON') }
if (parsed.config !== true) die('doi chung duong: root hop le co config phai tra config:true');

// ---- 5 loi chet: exit 2, stdout RONG, stderr ghim thong diep RIENG ----
const CASES = [
  { name: '--root thieu gia tri', argv: ['--root'],                needle: /--root/ },
  { name: "--root chuoi rong",    argv: ['--root', ''],            needle: /--root/ },
  { name: 'token la',             argv: ['--foo'],                 needle: /--foo/ },
  { name: 'duong dan ma',         argv: ['--root', path.join(tmp, 'khong-ton-tai')], needle: /khong-ton-tai/ },
  { name: 'duong dan la FILE',    argv: ['--root', plainFile],     needle: /la-file-thuong\.txt/ },
];
const seen = new Set();
for (const c of CASES) {
  const r = runScan(c.argv);
  if (r.status !== 2) die(`[${c.name}] phai exit 2, duoc ${r.status} (stdout=${r.stdout.slice(0,80)})`);
  if (r.stdout.trim() !== '') die(`[${c.name}] KHONG duoc in JSON ra stdout, duoc: ${r.stdout.slice(0,80)}`);
  if (!c.needle.test(r.stderr)) die(`[${c.name}] stderr phai ghim ${c.needle}, duoc: ${r.stderr.slice(0,120)}`);
  if (/config/.test(r.stdout)) die(`[${c.name}] loi go lenh bi doi nghia thanh chan doan repo`);
  seen.add(r.stderr.trim());
}
// Moi loi mot thong diep RIENG: dung chung mot cau thi dot bien chi chung minh
// duoc mot nhanh, cac nhanh con lai khong bao gio bi da RED rieng (bai hoc P95).
if (seen.size < CASES.length)
  die(`5 loi chet chi cho ${seen.size} thong diep khac nhau — nhanh dung chung cau khong do rieng duoc`);

// ---- doi chung DUONG cuoi: root hop le NHUNG chua acceptance-init -> config:false, exit 0 ----
const bare = fs.mkdtempSync(path.join(os.tmpdir(), 'p103b-'));
const r2 = runScan(['--root', bare]);
if (r2.status !== 0) die(`root that nhung chua init phai exit 0, duoc ${r2.status}`);
if (JSON.parse(r2.stdout).config !== false) die('root that chua init phai tra config:false');
console.log('P103 OK');
JS
```

- [ ] **Step 2: Chạy, xác nhận FAIL** — `bash tests/plugins/run-tests.sh 2>&1 | grep -A2 '^P103'` → đỏ ngay lối đầu (hiện đang exit 0 quét cwd).

- [ ] **Step 3: Thay khối argv trong `scripts/start-scan.mjs`** (dòng 19-25) — validate TRƯỚC mọi I/O:

```js
// Argv hỏng CHẾT TO (exit 2), không âm thầm rơi về cwd: một cờ được KHAI mà
// dùng không được lại đổi nghĩa lệnh thành "quét cây khác rồi báo thành công",
// và `--root` sai biến lỗi gõ lệnh thành chẩn đoán "repo chưa dựng cổng".
// Cùng doctrine với pre-merge-check v1.22.1 + sync-plugin-packages (mode lạ).
// MỖI lối một thông điệp riêng — dùng chung một câu thì đột biến chỉ chứng
// minh được một nhánh (bài học P95).
const args = process.argv.slice(2);
const bail = msg => { process.stderr.write(`start-scan: ${msg}\n`); process.exit(2); };
let rootArg = '.';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root') {
    if (i + 1 >= args.length) bail('--root khai báo nhưng thiếu giá trị — nêu thư mục repo cần quét');
    if (args[i + 1] === '') bail('--root nhận chuỗi rỗng — nêu thư mục repo cần quét');
    rootArg = args[++i];
  } else bail(`tham số lạ ${args[i]} — chỉ nhận --root <thư mục>`);
}
const root = path.resolve(rootArg);
if (!existsSync(root)) bail(`--root trỏ đường dẫn không tồn tại: ${root}`);
if (!statSync(root).isDirectory()) bail(`--root trỏ vào thứ không phải thư mục: ${root}`);
const out = obj => process.stdout.write(JSON.stringify(obj) + '\n');
```

`statSync` đã có trong import dòng 10 — không cần sửa import.

- [ ] **Step 4: Chạy P103 → PASS**, rồi chạy P98/P99/P102 xác nhận không thoái lui (cả ba gọi `--root <tmp>` hợp lệ):

```bash
bash tests/plugins/run-tests.sh 2>&1 | grep -E '^P(98|99|102|103)|PASS: P(98|99|102|103)|FAIL'
```

- [ ] **Step 5: Commit**

```bash
bash scripts/sync-plugin-packages.sh
git add scripts/start-scan.mjs tests/plugins/run-tests.sh plugins/acceptance-gate/scripts/start-scan.mjs
git commit -m "fix(start-scan): argv hỏng exit 2 — 5 lối chết, mỗi lối một thông điệp (AC-3)"
```

---

### Task 4: P101 viết lại — chân âm chạy chính phép đo, riêng từng file (AC-4)

**Phục vụ:** E4. **independent:** true (chỉ chạm `tests/plugins/run-tests.sh`, không đụng `start-scan.mjs`).
**Verify:** `bash tests/plugins/run-tests.sh 2>&1 | grep -E 'P101|FAIL'`

**Files:**
- Modify: `tests/plugins/run-tests.sh:3059-…` (thân P101, phần `(E11)` cuối)

**Interfaces:**
- Produces: hàm `check_docs(docs)` nhận `dict {tên: nội-dung}` → trả list lỗi. Chân dương và MỌI chân âm gọi **cùng** hàm này.

- [ ] **Step 1: Thay phần `(E11)` cuối P101 (RED trước).** Xoá đúng khối này:

```python
# (E11) GUIDE + README co muc /start noi dung ban chat vao-phien
for doc in ["GUIDE.md", "README.md"]:
    td = (root / doc).read_text(encoding="utf-8")
    assert "/start" in td and "vào phiên" in td, f"{doc} thieu muc vao phien bang /start"
gm = (root / "GUIDE.md").read_text(encoding="utf-8")
mut2 = "\n".join(l for l in gm.splitlines() if "/start" not in l and "vào phiên" not in l)
assert not ("/start" in mut2 and "vào phiên" in mut2), \
    "dot bien xoa muc /start khoi GUIDE ma phep do van xanh"
```

thay bằng:

```python
# (E11) GUIDE + README co muc /start. Chan AM phai chay CHINH phep do tren ban
# mutant — ban cu dung `not (A and B)` tren chuoi vua bi xoa A, dung mot cach
# giai tich nen khong bao gio do duoc (Cong 2 start-command, known-limit 2).
DOCS = ["GUIDE.md", "README.md"]

def check_docs(docs):                      # {ten: noi dung} -> list loi
    errs = []
    for name, text in docs.items():
        if "/start" not in text or "vào phiên" not in text:
            errs.append(f"{name}: thieu muc vao phien bang /start")
    return errs

live = {d: (root / d).read_text(encoding="utf-8") for d in DOCS}
assert check_docs(live) == [], check_docs(live)          # doi chung DUONG

# Chan AM RIENG cho TUNG file: mot ham quen mot nhanh thi chan con lai van do
# dung, che mat lo (bai hoc [findings-section-boundary#F2]).
strip = lambda t: "\n".join(l for l in t.splitlines()
                            if "/start" not in l and "vào phiên" not in l)
for gone in DOCS:
    mut = dict(live); mut[gone] = strip(live[gone])
    errs = check_docs(mut)
    assert any(x.startswith(f"{gone}: thieu muc vao phien") for x in errs), \
        f"dot bien xoa muc /start khoi {gone} khong bi bat dung thong diep: {errs}"
    assert all(not x.startswith(f"{o}:") for x in errs for o in DOCS if o != gone), \
        f"dot bien tren {gone} lam bao oan file khac: {errs}"
```

- [ ] **Step 2: Chạy P101 → PASS** (bản thật có đủ mục nên chân dương xanh; hai chân âm đỏ đúng file).

```bash
bash tests/plugins/run-tests.sh 2>&1 | grep -A2 '^P101'
```

- [ ] **Step 3: Chứng minh chân âm SỐNG (bắt buộc — nghi thức "phá thử một lần cho mỗi phép đo mới" của CLAUDE.md).** Trong bản sao tạm, xoá mục /start khỏi `README.md` rồi chạy P101, phải ĐỎ:

```bash
T=$(mktemp -d) && cp -R . "$T/" 2>/dev/null
python3 - "$T" <<'PY'
from pathlib import Path
p = Path(__import__('sys').argv[1]) / "README.md"
p.write_text("\n".join(l for l in p.read_text(encoding="utf-8").splitlines()
                       if "/start" not in l and "vào phiên" not in l), encoding="utf-8")
PY
bash "$T/tests/plugins/run-tests.sh" 2>&1 | grep -E 'FAIL: P101|PASS: P101'
rm -rf "$T"
```
Expected: `FAIL: P101` — nếu PASS thì chân âm README vẫn chết, sửa Step 1 trước khi đi tiếp.

- [ ] **Step 4: Commit**

```bash
git add tests/plugins/run-tests.sh
git commit -m "test(P101): chân âm chạy chính phép đo, riêng từng file docs (AC-4)"
```

---

### Task 5: Không thoái lui — 4 suite + mirror + hoà giải mirror (AC-5)

**Phục vụ:** E5, E6, E7, E8, E9. **independent:** false (chạy CUỐI).
**Verify:** cả 4 suite + `--check` đều exit 0.

**Files:**
- Regenerate: `plugins/` qua `bash scripts/sync-plugin-packages.sh`

- [ ] **Step 1: Sync mirror + chạy đủ 4 suite và mirror check**

```bash
bash scripts/sync-plugin-packages.sh
for s in scripts hooks plugins workflows; do printf '%-10s ' "$s"; bash tests/$s/run-tests.sh 2>&1 | tail -1; done
bash scripts/sync-plugin-packages.sh --check
```
Expected: `596 passed, 0 failed` · `51 passed, 0 failed` · `all plugin tests passed` · `all workflow tests passed` · `plugins/ mirror in sync.`

- [ ] **Step 2: Xác nhận schema JSON KHÔNG đổi key** — P99 là phép đo, phải xanh mà không sửa marker:

```bash
bash tests/plugins/run-tests.sh 2>&1 | grep -E 'PASS: P99|FAIL: P99'
git diff --stat HEAD~4 -- commands/start.md codex/acceptance-gate/skills/start/SKILL.md
```
Expected: `PASS: P99` và diff **rỗng** cho hai file marker (không được chạm).

- [ ] **Step 3: Commit mirror nếu còn sót**

```bash
git add plugins
git commit -m "chore(mirror): sync sau start-scan-hardening" || echo "mirror đã sạch"
```

---

## Self-review (đã chạy)

- **Spec coverage:** 4 mục design → Task 1 (I/O) · Task 2 (verdict) · Task 3 (argv) · Task 4 (P101); AC-5 → Task 5. 5 finding gap-probe: P1-1 → Task 1 chân (c) · P1-2 → Task 3 lối 5 · P2-1 → Task 4 chân âm per-file · P2-2 → Task 5 chạy đủ 4 suite (E7/E8/E9) · P2-3 → Task 2 nhánh `thiếu verdict`. Không mục nào thiếu task.
- **Type consistency:** `read()` trả `{t, err}` (Task 1) → Task 2 dùng `eTxt` lấy từ `eRead.t`; `ioReason(err)` một chỗ; `VERDICT_OK` (Task 2) dùng chung cả hai nhánh; `check_docs(docs)` (Task 4) nhận dict, cả chân dương lẫn chân âm gọi cùng nó.
- **Placeholder:** không TBD/TODO; mọi step có code thật hoặc lệnh chạy được kèm Expected.
- **Đối chứng dương:** P102 có 2 (trước tiêm + REJECT giữ S3-fix), P103 có 2 (lối gọi đúng + root-chưa-init), P101 có 1 + phá-thử-thật ở Task 4 Step 3.
- **Rủi ro đã tính:** P102 chân (a)(c) dùng `chmod 000` — chạy bằng root thì chmod không chặn được đọc, nên case tự phát hiện và SKIP có in lý do (không giả vờ xanh).
