# gia-lan-ghim-lai (Vòng A) — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làn ghim lại (`feature-loop/scripts/repin-lane.mjs`) chạy lại lệnh đỏ một lần, dừng sạch khi hết trần hay bị ngắt, in tổng kết cuối lượt, và chạy suite ở môi trường giống CI — mỗi điểm sau một khoá config, khoá vắng = hành vi 2.22.0 (trừ ba phần chỉ-thêm bật mặc định).

**Architecture:** Ba thư viện thuần mới trong `feature-loop/scripts/lib/` — `chay-lenh.mjs` (chạy một lệnh trong nhóm tiến trình riêng, thu cây theo `ppid`, SIGTERM → SIGKILL), `chay-lai.mjs` (hàm quyết chạy lại + rút tên ca), `lan-khoa.mjs` (khối marker LAN-KHOA đọc/kiểm năm khoá + dựng tổng kết). `repin-lane.mjs` đổi `runCmd`/`runSuites` sang bất đồng bộ dùng `chay-lenh`, thêm đồng hồ trần, bộ bắt tín hiệu, env CI cho suite, chạy lại, tổng kết, mã thoát 4. Ca bền sống ở `tests/scripts/*.test.mjs` (lọc bằng `GG_CASES`); bộ răng `_acceptance/gia-lan-ghim-lai/rang/` chạy ca bền trên cây hiện hành rồi các bản sao bị phá trên `git archive SAU-GIA`.

**Tech Stack:** Node ≥ 20 (ESM, `node:child_process`, `node:test` không dùng — kit dùng bộ kiểm tự viết in `PASS:`/`FAIL:`), bash, git.

**Spec:** `docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md` §Đ4, §Đ5, §Đ3 · hợp đồng `_acceptance/gia-lan-ghim-lai/contract.md` (AC-1…AC-8) · `evals.yaml` (E1…E8).

## Global Constraints

- Chỉ chạm: `feature-loop/scripts/**`, `feature-loop/skills/feature-loop/SKILL.md`, `GUIDE.md`, `commands/acceptance-init.md` (mẫu config), `tests/scripts/**`, `_acceptance/gia-lan-ghim-lai/rang/**`. **Không** chạm `lib/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (t3_paths — hạng T2 phụ thuộc vào điều này).
- Khoá vắng = hành vi BASE-GIA (`bf79fdb11fe6e69b12efa1b4c9c7cf40fbb36e1d`) từng byte sau khi gỡ ba phần chỉ-thêm (AC-7).
- Mã thoát của làn: 0 xanh · 1 đỏ · 2 nguồn hỏng · 3 usage · **4 vượt trần** · 128+n bị ngắt.
- Khoá JSON tuỳ chọn: rỗng thì VẮNG HẲN (luật hiện diện của REPIN-TEMPLATE); thứ tự khoá dựng bằng `Object.assign`.
- Mọi phép đo mới có cặp hai chiều trên CÙNG fixture (MEASURE-BIRTH-CLAUSE); chiều đỏ chỉ tính «đã bắt» khi có dấu dương bản sao chạy tới ca.
- Đường dẫn trong test/rang suy từ vị trí tệp; bản base/bản sao lấy trọn thư mục bằng `git archive`.
- Không dùng từ trong `_Avoid_` của `CONTEXT.md` ở chữ mặt người (`cache`, `log` cho «vết đã đối chiếu»…).
- Commit message: `feat|fix|test|docs(gia-lan-ghim-lai): …` — tên slug trong thông điệp là dấu để tìm SAU-GIA.

## Review Focus

1. Lệnh suite in rất nhiều (crm 1 507 bài): `chay-lenh` phải gom stdout/stderr theo dòng, không `maxBuffer` nổ — kiểm bằng lệnh in 300 000 dòng (Task 1).
2. `ps -A -o pid=,ppid=` trên máy đang nặng có thể chậm hay thiếu một tiến trình vừa sinh: thu cây hai lần cách 100 ms rồi hợp lại (Task 1).
3. Tín hiệu tới khi KHÔNG có lệnh nào đang chạy (giữa hai lệnh): phải vẫn ghi `bi-ngat` và thoát đúng mã (Task 4).
4. Lệnh chập chờn mà lần hai đạt nhưng mã khác 0 và bằng `expected_exit` đã khai: tính đạt theo cùng luật `datKyVong` hiện có, không coi mọi «khác 0» là đỏ (Task 3).
5. `repin_ci_blank_env` khai biến mà env tiến trình không có: vẫn đặt rỗng (không lỗi), và `suites_env: "ci"` vẫn ghi (Task 5).

---

### Task 0: Fixture dùng chung cho mọi ca bền

**Files:**
- Create: `tests/scripts/gia-lan-fixture.mjs`

**Interfaces:**
- Produces: `mkKho(opts)` → `{ root, ws, git, dau, lane, docLog, docReport }`; `opts = { config: string (phần YAML thêm dưới feature_loop), suite: string (nội dung sh), evals: [{id, cmd}] | string, dauDir }`. `lane(...args)` chạy `repin-lane.mjs` thật với `--root root --ag-root ROOT` (ROOT = gốc kit suy từ vị trí tệp), trả `{status, stdout, stderr, signal}`. `dau` = thư mục dấu vết NGOÀI kho (env `GG_DAU`), mọi lệnh fixture ghi vào đó. `pinBanDau()` chạy writer thật `--write` rồi commit — pin KHÔNG dựng tay.

- [ ] **Step 1: Viết fixture**

```js
// tests/scripts/gia-lan-fixture.mjs — kho git code-sinh cho các ca của hồ sơ gia-lan-ghim-lai.
// Pin do CHÍNH repin-lane.mjs --write ghi (writer thật); dấu vết lệnh ghi ra thư mục NGOÀI kho
// (một tệp git theo dõi làm dấu thì mỗi lượt chạy làm cây khác pin).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(HERE, '..', '..');
export const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');

export function mkKho(opts = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'gg-kho-'));
  const dau = opts.dauDir || mkdtempSync(path.join(tmpdir(), 'gg-dau-'));
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(root, '_acceptance', 'feat');
  mkdirSync(ws, { recursive: true });
  const evals = Array.isArray(opts.evals) ? opts.evals : [{ id: 'E1', cmd: 'rang_e1' }];
  const execs = evals.map(e => `    ${e.cmd}: "${e.sh || `sh ${e.cmd}.sh`}"`).join('\n');
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'),
    `schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\n${opts.config || ''}executors:\n  test:\n    suite: "${opts.suiteCmd || 'sh suite.sh'}"\n  script:\n${execs}\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n`);
  writeFileSync(path.join(root, 'suite.sh'), opts.suite || 'echo ran-suite >> "$GG_DAU/suite.txt"\nexit 0\n');
  for (const e of evals) if (!e.sh) writeFileSync(path.join(root, `${e.cmd}.sh`), e.body || `echo ran-${e.id} >> "$GG_DAU/${e.id}.txt"\nexit 0\n`);
  writeFileSync(path.join(ws, 'contract.md'), '---\nschema_version: 1\nfeature: feat\nslug: feat\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\n---\n');
  writeFileSync(path.join(ws, 'evals.yaml'), typeof opts.evals === 'string' ? opts.evals
    : `schema_version: 1\nfeature_slug: feat\nevals:\n${evals.map(e => `  - id: ${e.id}\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.${e.cmd}\n    expected: exit 0\n    evidence_required: [run_id, exit_code, verifier, verified_at, output]\n`).join('')}`);
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'impl');
  const H1 = git('rev-parse', 'HEAD');
  writeFileSync(path.join(ws, 'run-log.jsonl'), JSON.stringify({ ts: '2026-10-01T00:00:00Z', kind: 'eval', run_id: 'r1-E1', sha: H1, eval: 'E1', exit_code: 0 }) + '\n');
  writeFileSync(path.join(ws, 'evidence-report.md'),
    `---\nschema_version: 1\nfeature_slug: feat\nverdict: PASS\nverified_commit: ${H1}\nhuman_signoff: Manh 2026-10-01\n---\n\n## Evidence\n${evals.map(e => `- eval: ${e.id}\n  run_id: r1-E1\n  exit_code: 0\n  verifier: config:executors.script.${e.cmd}\n  verified_at: 2026-10-01\n`).join('')}\n## Iterations\n\nRound 1 — PASS.\n`);
  git('add', '-A'); git('commit', '-qm', 'evidence');
  const lane = (args, extra = {}) => spawnSync(process.execPath, [LANE, '--root', root, '--ag-root', ROOT, '--slug', 'feat', ...args],
    { encoding: 'utf8', env: { ...process.env, GG_DAU: dau, ...(extra.env || {}) }, timeout: extra.timeout, killSignal: 'SIGKILL' });
  const pinBanDau = () => { const r = lane(['--reason', 'pin dau', '--write']); if (r.status !== 0) throw new Error(`pin đầu đỏ: ${r.stderr}`); git('add', '-A'); git('commit', '-qm', 'repin'); return r; };
  const docLog = () => readFileSync(path.join(ws, 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const docReport = () => readFileSync(path.join(ws, 'evidence-report.md'), 'utf8');
  const dem = (ten) => { const p = path.join(dau, ten); return existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(Boolean).length : 0; };
  const xoaDau = () => { rmSync(dau, { recursive: true, force: true }); mkdirSync(dau, { recursive: true }); };
  return { root, ws, dau, git, lane, pinBanDau, docLog, docReport, dem, xoaDau };
}

// Bộ kiểm chung: in PASS:/FAIL: có mã ca, lọc theo GG_CASES, --ids in danh sách.
export function boKiem(ALL_IDS) {
  if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
  const only = (process.env.GG_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
  let failed = 0; const ran = new Set();
  const ca = async (id, ten, f) => {
    if (only.length && !only.includes(id)) return; ran.add(id);
    try { await f(); console.log(`PASS: [${id}] ${ten}`); } catch (e) { failed++; console.log(`FAIL: [${id}] ${ten}\n    ${e.message}`); }
  };
  const ket = () => { for (const id of only) if (!ran.has(id)) { failed++; console.log(`FAIL: [${id}] ca gọi tên mà không chạy`); } process.exit(failed ? 1 : 0); };
  return { ca, ket };
}
```

- [ ] **Step 2: Kiểm nhanh fixture** — `node -e "import('./tests/scripts/gia-lan-fixture.mjs').then(m=>{const k=m.mkKho();const r=k.pinBanDau();console.log(r.status, k.docLog().length)})"` → in `0 2`.

- [ ] **Step 3: Commit** — `git add tests/scripts/gia-lan-fixture.mjs && git commit -m "test(gia-lan-ghim-lai): fixture kho code-sinh dùng chung cho các ca của làn"`.

---

### Task 1: `chay-lenh.mjs` — chạy một lệnh, thu cây, dừng sạch

**Files:**
- Create: `feature-loop/scripts/lib/chay-lenh.mjs`
- Test: `tests/scripts/repin-lane-tran.test.mjs` (ca `AC2-lib-*`)

**Interfaces:**
- Produces: `chayLenh(cmd, { cwd, env }) → { pid, done: Promise<{exit, out, err, ms, bi_dung}> , dung(): Promise<void> }`; `thuCay(pid) → number[]` (pid + mọi hậu duệ, hợp của hai lần đọc `ps` cách 100 ms); `dungCay(pids, { sigkillSauMs = 10000 }) → Promise<{chet: number[], con_song: number[]}>`; hằng `SIGKILL_SAU_MS = 10000`.

- [ ] **Step 1: Viết ca đỏ trước** (trong `tests/scripts/repin-lane-tran.test.mjs`, dùng `boKiem`): `AC2-lib-giet-cay` — chạy `bash -c 'sleep 60 & echo $! > "$GG_DAU/chau.pid"; wait'`, chờ tệp pid có, gọi `dung()`, rồi `process.kill(pidChau, 0)` phải ném ESRCH trong 15 s. `AC2-lib-bay-term` — cháu là `bash -c "trap '' TERM; sleep 60"`; sau `dung()` cháu chết sau ≥ 10 s và < 25 s. `AC2-lib-in-nhieu` — lệnh `node -e "for(let i=0;i<300000;i++)console.log(i)"` → `exit 0`, `out` có 300 000 dòng.

- [ ] **Step 2: Chạy** `GG_CASES=AC2-lib-giet-cay,AC2-lib-bay-term,AC2-lib-in-nhieu node tests/scripts/repin-lane-tran.test.mjs` → FAIL (module vắng).

- [ ] **Step 3: Viết thư viện**

```js
// feature-loop/scripts/lib/chay-lenh.mjs — chạy MỘT lệnh bash trong nhóm tiến trình riêng, thu cả cây
// hậu duệ TRƯỚC khi gửi tín hiệu, SIGTERM rồi SIGKILL (hồ sơ gia-lan-ghim-lai AC-2/AC-3).
// Vì sao thu cây theo ppid chứ không chỉ theo nhóm: làn có thể LỒNG (một lệnh là repin-lane khác),
// làn trong mở nhóm detached riêng nên tín hiệu theo nhóm của làn ngoài không tới đó.
import { spawn, spawnSync } from 'node:child_process';
export const SIGKILL_SAU_MS = 10000;
const ngu = (ms) => new Promise(r => setTimeout(r, ms));

function docPs() {
  const r = spawnSync('ps', ['-A', '-o', 'pid=,ppid='], { encoding: 'utf8' });
  const m = new Map();
  for (const l of String(r.stdout || '').split('\n')) { const t = l.trim().split(/\s+/); if (t.length === 2) m.set(Number(t[0]), Number(t[1])); }
  return m;
}
function hauDue(goc, ps) {
  const con = new Map();
  for (const [pid, ppid] of ps) { if (!con.has(ppid)) con.set(ppid, []); con.get(ppid).push(pid); }
  const ra = [goc]; const dq = [goc];
  while (dq.length) { for (const c of con.get(dq.shift()) || []) { ra.push(c); dq.push(c); } }
  return ra;
}
export async function thuCay(pid) {
  const a = hauDue(pid, docPs()); await ngu(100); const b = hauDue(pid, docPs());
  return [...new Set([...a, ...b])];
}
const song = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
const guiCa = (pids, sig) => { for (const p of pids) { try { process.kill(p, sig); } catch { /* đã chết */ } } };
export async function dungCay(pids, { sigkillSauMs = SIGKILL_SAU_MS } = {}) {
  guiCa(pids, 'SIGTERM');
  const han = Date.now() + sigkillSauMs;
  while (Date.now() < han && pids.some(song)) await ngu(50);
  const conSong = pids.filter(song);
  guiCa(conSong, 'SIGKILL');
  await ngu(200);
  return { chet: pids.filter(p => !song(p)), con_song: pids.filter(song) };
}
export function chayLenh(cmd, { cwd, env } = {}) {
  const t0 = Date.now();
  let out = '', err = '', biDung = false;
  const p = spawn('bash', ['-c', cmd], { cwd, env: env || process.env, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  p.stdout.on('data', d => { out += d; });
  p.stderr.on('data', d => { err += d; });
  const done = new Promise(res => {
    p.on('error', e => { err += `\n${e.message}`; });
    p.on('close', code => res({ exit: code === null ? 1 : code, out, err, ms: Date.now() - t0, bi_dung: biDung }));
  });
  const dung = async () => {
    biDung = true;
    const cay = await thuCay(p.pid);
    try { process.kill(-p.pid, 'SIGTERM'); } catch { /* nhóm đã tan */ }
    const r = await dungCay(cay);
    try { process.kill(-p.pid, 'SIGKILL'); } catch { /* */ }
    return r;
  };
  return { pid: p.pid, done, dung };
}
```

- [ ] **Step 4: Chạy lại ba ca** → PASS.

- [ ] **Step 5: Commit** — `git commit -m "feat(gia-lan-ghim-lai): chay-lenh — chạy lệnh trong nhóm riêng, thu cây theo ppid, SIGTERM rồi SIGKILL"`.

---

### Task 2: `lan-khoa.mjs` — khối marker LAN-KHOA đọc năm khoá + `chay-lai.mjs`

**Files:**
- Create: `feature-loop/scripts/lib/lan-khoa.mjs`, `feature-loop/scripts/lib/chay-lai.mjs`
- Test: `tests/scripts/repin-lane-chay-lai.test.mjs` (ca `AC1-bang-chan-tri`, `AC1-rut-ten-ca`), `tests/scripts/repin-lane-khuon-gia.test.mjs` (ca `AC6-lan-khoa-rut`)

**Interfaces:**
- `lan-khoa.mjs` xuất: `LAN_KHOA` (mảng `{khoa, kieu, mo_ta}` trong marker `<<<LAN-KHOA` / `LAN-KHOA>>>`), `docKhoa(configText, core) → { repin_retry: 0|1, model_evals: Set<string>, repin_budget_min: number|null, repin_cost_cmd: string|null, repin_ci_blank_env: string[] }` — giá trị sai → ném `Error` có `loi.khoa` và thông điệp gọi tên khoá + giá trị hợp lệ (làn bắt và `die` mã 2).
- `chay-lai.mjs` xuất: `coChayLai({ khoa, lech, laModel, msLanDau, conLaiMs }) → { chay: boolean, ly_do: string }`; `BANG_CHAN_TRI` (mảng hàng viết trước mà test lặp qua); `rutTenCa(text) → string[]` (tối đa 10; rỗng → `['không rút được tên ca']`); `KHUON_TEN_CA` (năm regex có tên).

- [ ] **Step 1: Viết ca đỏ** — `AC1-bang-chan-tri`: lặp `BANG_CHAN_TRI`, mỗi hàng `{vao, ra}` → `coChayLai(vao).chay === ra`; phải có ĐÚNG 7 hàng: khoá 0 → không; model → không; lần đầu > 30 phút → không; trần còn ít hơn lần đầu → không; không lệch → không; đủ điều kiện → có; conLaiMs null (không trần) → có. `AC1-rut-ten-ca`: năm mẫu nhật ký `(fail) nang-luc: khong [5.00ms]` · `✗ app-rieng chạy cạnh` · `× tai-lieu-khong-ro` · `✘ 3 [chromium] › a.spec.ts:12 › ten ca` · `not ok 4 - nguoi-huy` → đúng tên; chuỗi rỗng → `['không rút được tên ca']`; 15 ca → cắt 10. `AC6-lan-khoa-rut`: đọc tệp `lan-khoa.mjs` bằng regex marker, rút tên khoá → đúng 5 tên, và `docKhoa` với `repin_retry: 2` ném lỗi nhắc `0 | 1`; với `repin_ci_blank_env: [1BAD]` ném lỗi nhắc tên biến.

- [ ] **Step 2: Chạy → FAIL.**

- [ ] **Step 3: Viết hai thư viện**

```js
// feature-loop/scripts/lib/lan-khoa.mjs — MỘT nguồn danh sách khoá config của làn ghim lại (AC-6).
// <<<LAN-KHOA
export const LAN_KHOA = [
  { khoa: 'feature_loop.repin_retry', kieu: '0 | 1', mo_ta: 'chạy lại lệnh đỏ một lần, một mình' },
  { khoa: 'feature_loop.model_evals', kieu: 'danh sách <slug>/<Eid>', mo_ta: 'eval gọi model thật — không chạy lại, đếm ở tổng kết' },
  { khoa: 'feature_loop.repin_budget_min', kieu: 'số phút > 0', mo_ta: 'trần mỗi lượt; cờ --tran-phut thắng khoá' },
  { khoa: 'feature_loop.repin_cost_cmd', kieu: 'lệnh in một số', mo_ta: 'đo chi phí: chạy trước lệnh đầu và sau lệnh cuối, ghi chênh' },
  { khoa: 'feature_loop.repin_ci_blank_env', kieu: 'danh sách tên biến', mo_ta: 'suite chạy với các biến này đặt rỗng (giống CI); eval giữ env đầy đủ' },
];
// LAN-KHOA>>>
const loi = (khoa, kieu, gia) => { const e = new Error(`config.yaml ${khoa}: "${gia}" không hợp lệ — ${kieu}`); e.khoa = khoa; return e; };
const BIEN_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
export function docKhoa(configText, core) {
  const k = (n) => core.resolveConfigKey(configText, n);
  const ds = (n) => { const v = core.resolveConfigList(configText, n); return Array.isArray(v) ? v.map(String) : []; };
  const retryRaw = k('feature_loop.repin_retry');
  const retry = retryRaw == null || retryRaw === '' ? 0 : (/^[01]$/.test(String(retryRaw).trim()) ? Number(retryRaw) : (() => { throw loi('feature_loop.repin_retry', 'dùng 0 | 1', retryRaw); })());
  const model = ds('feature_loop.model_evals');
  for (const m of model) if (!/^[\w-]+\/[\w-]+$/.test(m)) throw loi('feature_loop.model_evals', 'mỗi mục dạng <slug>/<Eid>', m);
  const budRaw = k('feature_loop.repin_budget_min');
  const budget = budRaw == null || budRaw === '' ? null : (Number(budRaw) > 0 && Number.isFinite(Number(budRaw)) ? Number(budRaw) : (() => { throw loi('feature_loop.repin_budget_min', 'số phút > 0', budRaw); })());
  const cost = k('feature_loop.repin_cost_cmd'); 
  const blank = ds('feature_loop.repin_ci_blank_env');
  for (const b of blank) if (!BIEN_RE.test(b)) throw loi('feature_loop.repin_ci_blank_env', 'tên biến môi trường (chữ, số, gạch dưới, không bắt đầu bằng số)', b);
  return { repin_retry: retry, model_evals: new Set(model), repin_budget_min: budget, repin_cost_cmd: cost ? String(cost) : null, repin_ci_blank_env: blank };
}
```

```js
// feature-loop/scripts/lib/chay-lai.mjs — quyết chạy lại một lệnh đỏ (AC-1) và rút tên ca từ nhật ký.
export const TRAN_LAN_DAU_MS = 30 * 60 * 1000;
export function coChayLai({ khoa, lech, laModel, msLanDau, conLaiMs }) {
  if (!lech) return { chay: false, ly_do: 'không lệch' };
  if (!khoa) return { chay: false, ly_do: 'khoá repin_retry vắng/0' };
  if (laModel) return { chay: false, ly_do: 'eval model thật — chạy lại là chọn lượt rút tốt hơn' };
  if (msLanDau > TRAN_LAN_DAU_MS) return { chay: false, ly_do: 'lần đầu dài hơn 30 phút' };
  if (conLaiMs != null && conLaiMs < msLanDau) return { chay: false, ly_do: 'trần còn lại ít hơn thời lượng lần đầu' };
  return { chay: true, ly_do: 'chạy lại một lần, một mình' };
}
export const BANG_CHAN_TRI = [
  { vao: { khoa: 0, lech: true, laModel: false, msLanDau: 1000, conLaiMs: null }, ra: false },
  { vao: { khoa: 1, lech: true, laModel: true, msLanDau: 1000, conLaiMs: null }, ra: false },
  { vao: { khoa: 1, lech: true, laModel: false, msLanDau: TRAN_LAN_DAU_MS + 1, conLaiMs: null }, ra: false },
  { vao: { khoa: 1, lech: true, laModel: false, msLanDau: 5000, conLaiMs: 4000 }, ra: false },
  { vao: { khoa: 1, lech: false, laModel: false, msLanDau: 1000, conLaiMs: null }, ra: false },
  { vao: { khoa: 1, lech: true, laModel: false, msLanDau: 5000, conLaiMs: 60000 }, ra: true },
  { vao: { khoa: 1, lech: true, laModel: false, msLanDau: 5000, conLaiMs: null }, ra: true },
];
export const KHUON_TEN_CA = [
  { ten: 'bun', re: /^\s*\(fail\)\s+(.+?)(?:\s+\[[\d.]+m?s\])?\s*$/ },
  { ten: 'vitest-jest', re: /^\s*[✗×]\s+(.+?)\s*$/ },
  { ten: 'playwright', re: /^\s*✘\s+\d+\s+(.+?)\s*(?:\(\d+(?:\.\d+)?m?s\))?\s*$/ },
  { ten: 'node-test', re: /^\s*not ok\s+\d+\s+-\s+(.+?)\s*$/ },
];
export function rutTenCa(text) {
  const ra = [];
  for (const l of String(text || '').split('\n')) {
    for (const k of KHUON_TEN_CA) { const m = l.match(k.re); if (m) { ra.push(m[1].trim()); break; } }
    if (ra.length >= 10) break;
  }
  return ra.length ? ra : ['không rút được tên ca'];
}
```

- [ ] **Step 4: Chạy ba ca → PASS.** 
- [ ] **Step 5: Commit** — `git commit -m "feat(gia-lan-ghim-lai): lan-khoa (khối LAN-KHOA) + chay-lai (bảng chân trị, rút tên ca)"`.

---

### Task 3: Làn — `runCmd` bất đồng bộ + chạy lại (Đ4, AC-1)

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` — các khối `runCmd`/`ghiKetQua`/`runSuites` (dòng 245–314), vòng eval (dòng 491), dựng dòng repin (dòng 532–551), `repin-do` (dòng 565–585), `KNOWN` cờ (dòng 40).
- Test: `tests/scripts/repin-lane-chay-lai.test.mjs` (ca `AC1-suite-chap-chon`, `AC1-eval-chap-chon`, `AC1-do-hai-lan`, `AC1-model-khong-lai`, `AC1-khoa-vang`, `AC1-sau-song-song`, `AC1-khoa-sai`)

**Interfaces:**
- Consumes: `chayLenh`, `docKhoa`, `coChayLai`, `rutTenCa`.
- Produces trong làn: biến `khoa` (từ `docKhoa`, lỗi → `die`), `results: Map<khoaLenh, {exit, lan: [{exit, ms, log}], chap_chon?}>` với `khoaLenh = envTag + '\0' + cmd` (Task 5 dùng `envTag`), mảng `chapChon` cho dòng repin, `lenhDo[].lan_thu_lai`.

- [ ] **Step 1: Viết ca đỏ.** Lệnh chập chờn fixture: `n=$(cat "$GG_DAU/dem.txt" 2>/dev/null || echo 0); echo $((n+1)) > "$GG_DAU/dem.txt"; echo "(fail) ca-chap-chon [1.00ms]"; [ "$n" -ge 1 ]` (lần 1 thoát 1, lần 2 thoát 0).
  - `AC1-suite-chap-chon`: `config: '  repin_retry: 1\n'`, suite chập chờn → `lane(['--write'])` status 0; dòng repin cuối có `chap_chon` dài 1, `.ca` gồm `ca-chap-chon`, `.log` là tệp tồn tại, `.lan_dau` = 1; section Re-pin chứa `chập chờn (đỏ lần đầu, đạt khi chạy lại): suite 1/1`; `dem('dem.txt')`… (dùng đếm trong tệp `dem.txt` = 2).
  - `AC1-eval-chap-chon`: eval chập chờn → như trên với nhãn `feat E1`.
  - `AC1-do-hai-lan`: lệnh `exit 1` → status 1, stderr có `nhật ký trọn` hai lần, dòng `repin-do` `lenh_do[0].lan_thu_lai === 1`.
  - `AC1-model-khong-lai`: `config: '  repin_retry: 1\n  model_evals: [feat/E1]\n'` eval chập chờn → status 1, `dem.txt` = 1.
  - `AC1-khoa-vang`: không khoá, suite chập chờn → status 1, đếm 1.
  - `AC1-sau-song-song`: `repin_parallel_suites: true`, hai suite (thêm `executors.test.suite2` vào `suite_keys` qua `opts.config`), suite 1 chập chờn và ghi mốc thời gian `date +%s%N >> "$GG_DAU/moc.txt"` ở mỗi lần, suite 2 ngủ 2 s rồi ghi mốc kết thúc → mốc lần chạy lại của suite 1 > mốc kết thúc suite 2.
  - `AC1-khoa-sai`: `repin_retry: 2` → status 2, stderr nhắc `0 | 1`.

- [ ] **Step 2: Chạy → FAIL.**

- [ ] **Step 3: Sửa làn.** Thay `runCmd`/`ghiKetQua`/`runSuites` bằng:

```js
import { chayLenh } from './lib/chay-lenh.mjs';
import { docKhoa } from './lib/lan-khoa.mjs';
import { coChayLai, rutTenCa } from './lib/chay-lai.mjs';
// … sau khi có `core` và `configText`:
let khoa;
try { khoa = docKhoa(configText, core); } catch (e) { die(String(e.message)); }
const laModel = (slug, id) => khoa.model_evals.has(`${slug}/${id}`);

const results = new Map();          // khoaLenh → { exit, lan:[{exit,ms,log}], chap_chon? }
const chapChon = [];                // mục cho dòng repin
let dangChay = null;                // handle của lệnh đang chạy (Task 4 dùng)
const khoaLenh = (cmd, envTag) => `${envTag}\0${cmd}`;
async function chayMot(cmd, label, env, lanThu) {
  const h = chayLenh(cmd, { cwd: root, env }); dangChay = h;
  const r = await h.done; dangChay = null;
  const log = ghiNhatKyNeuDo(cmd, `${label}${lanThu > 1 ? `-lan-${lanThu}` : ''}`, r.exit, r.out, r.err);
  log_(`${label}${lanThu > 1 ? ' (chạy lại)' : ''}: ${cmd} → exit ${r.exit} (${(r.ms / 1000).toFixed(1)}s)`);
  return { exit: r.exit, ms: r.ms, log, out: r.out, err: r.err };
}
// lech(exit) do bên gọi cấp: suite → exit !== 0; eval → !datKyVong && !hetHan (cùng luật cũ).
async function runCmd(cmd, label, { env = process.env, envTag = 'full', lech = (x) => x !== 0, model = false } = {}) {
  const k = khoaLenh(cmd, envTag);
  if (results.has(k)) { log_(`${label}: (đã chạy) → exit ${results.get(k).exit}`); return results.get(k).exit; }
  const l1 = await chayMot(cmd, label, env, 1);
  const rec = { exit: l1.exit, lan: [l1] };
  const q = coChayLai({ khoa: khoa.repin_retry, lech: lech(l1.exit), laModel: model, msLanDau: l1.ms, conLaiMs: conLai() });
  if (q.chay) {
    await choKhoiSongSong();                     // Task: khối suite song song phải xong hết
    const l2 = await chayMot(cmd, label, env, 2);
    rec.lan.push(l2); rec.exit = l2.exit;
    if (!lech(l2.exit)) { rec.chap_chon = { lenh: cmd, nhan: label, lan_dau: l1.exit, log: l1.log, ca: rutTenCa(l1.out + '\n' + l1.err) }; chapChon.push(rec.chap_chon); }
  }
  results.set(k, rec); return rec.exit;
}
```
  `ghiNhatKyNeuDo` = thân cũ của `ghiKetQua` phần NHAT-KY-KHI-DO (trả đường nhật ký tương đối hoặc `null`), không còn `results.set`. `conLai()` trả `null` ở Task 3 (Task 4 nối đồng hồ). `runSuites` với khoá song song: bắn mọi suite bằng `chayLenh` song song, chờ hết, ghi kết quả theo thứ tự rồi MỚI chạy lại từng suite lệch (nối đuôi) — `choKhoiSongSong` là promise của khối đó. Dòng repin: `Object.assign(…, chapChon.length ? { chap_chon: chapChon } : {})` đặt sau `so_lenh`; section thêm `veChapChon = chapChon.length ? ` · chập chờn (đỏ lần đầu, đạt khi chạy lại): ${chapChon.map(c => c.nhan).join(', ')}` : ''`. `lenhDo`: `them(cmd, exit, lan_thu_lai = rec.lan.length - 1)`; `log` = nhật ký lần cuối, thêm `log_lan_dau` khi có hai lần. `so_lenh` = `results.size`. Vòng eval: `e.exit = await runCmd(e.cmd, label, { lech: (x) => !(x === e.expected) && !(e.expected !== 0 && x === 0), model: laModel(s.slug, e.id) })`.

- [ ] **Step 4: Chạy bảy ca → PASS.** Chạy thêm `node tests/scripts/repin-lane-skip-unchanged.test.mjs`, `repin-lane-noi-ra.test.mjs`, `repin-lane-lop-cu.test.mjs` → vẫn PASS (đường cũ không đổi).
- [ ] **Step 5: Commit** — `git commit -m "feat(gia-lan-ghim-lai): làn chạy lại lệnh đỏ một lần, một mình, sau khối suite song song; chap_chon gọi tên ca"`.

---

### Task 4: Làn — trần, tín hiệu, mã 4, tổng kết (Đ5, AC-2/3/4)

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` (cờ `--tran-phut` vào `KNOWN`; đồng hồ; bộ bắt tín hiệu; nhánh thoát 4; tổng kết; `repin-do` thêm `ly_do`, `tran_phut`, `da_chay_phut`, `chua_chay`, `tin_hieu`, `tong_ket`), `feature-loop/scripts/lib/lan-khoa.mjs` (thêm `dungTongKet`, `doChiPhi`).
- Test: `tests/scripts/repin-lane-tran.test.mjs` (ca `AC2-B1`…`AC2-B7`, `AC3-TERM`, `AC3-INT`, `AC3-HUP`, `AC3-khong-write-sach`, `AC4-xanh`, `AC4-do`, `AC4-vuot-tran`, `AC4-bi-ngat`, `AC4-chi-phi-loi`)

**Interfaces:**
- `dungTongKet({ketCuc, ms, soLenh, modelGoi, chapChon, chiPhi}) → { obj: {ket_cuc, phut, so_lenh, model_goi, model_carry: 0, chap_chon, chi_phi?}, dong: string }` — `dong` bắt đầu `[lane] TỔNG KẾT`. `doChiPhi(cmd, cwd) → number|{loi: string}`.
- Trong làn: `tBatDau` dời lên TRƯỚC `docKhoa`; `hanMs = tranPhut ? tBatDau + tranPhut*60000 : null`; `conLai = () => hanMs == null ? null : hanMs - Date.now()`; `chuaChay: string[]` kê nhãn lệnh còn lại khi dừng; hàm `ketThucSom(kieu, extra)` ghi `repin-do` (nếu `--write`), in tổng kết, thoát mã.

- [ ] **Step 1: Viết ca đỏ.** Lệnh cháu: `bash -c 'sleep 120 & echo $! > "$GG_DAU/chau.pid"; wait'`; lệnh cháu bẫy: `bash -c 'bash -c "trap \"\" TERM; sleep 120" & echo $! > "$GG_DAU/chau.pid"; wait'`. Hàm `choPid(k)` chờ tới 20 s cho tệp pid; vắng → ném «cháu chưa kịp sinh».
  - `AC2-B1`: suite = lệnh cháu, `lane(['--tran-phut', '0.25'])` (15 s) → status 4 trong 15 + 15 s, `song(pidChau) === false`, không dòng `repin`, `verified_commit` không đổi.
  - `AC2-B2`: cháu bẫy → status 4, cháu chết, tổng thời gian < 15 + 10 + 15 s.
  - `AC2-B3`: kho ngoài có suite = `node LANE --root <khoTrong> --ag-root ROOT --slug feat --tran-phut 5` (kho trong là `mkKho` thứ hai có suite cháu bẫy, pid ghi `chau-trong.pid`); làn ngoài `--tran-phut 0.25` → status 4; `chau-trong.pid` chết.
  - `AC2-B4`: B1 + `--write` → dòng cuối run-log `kind: repin-do`, `ly_do: 'vuot-tran'`, `tran_phut: 0.25`, `da_chay_phut` ≥ 0.25, `chua_chay` gồm `feat E1`.
  - `AC2-B5`: `config: '  repin_budget_min: 0.25\n'` không cờ → như B1; cờ `--tran-phut 5` + khoá 0.25 → status 0 (cờ thắng khoá) với suite ngắn.
  - `AC2-B6`: suite `sleep 3; exit 0` không trần → status 0.
  - `AC2-B7`: `--tran-phut 0` → 3; `--tran-phut abc` → 3; `repin_budget_min: -1` → 2.
  - `AC3-TERM/INT/HUP`: spawn làn bằng `spawn` (không sync) với `--write`, chờ `chau.pid`, `proc.kill(sig)` → mã 143/130/129, cháu chết, dòng `repin-do` `ly_do: 'bi-ngat'`, `tin_hieu: 'SIGTERM'…`, `chua_chay` có `feat E1`.
  - `AC3-khong-write-sach`: như TERM không `--write` → `git status --porcelain` rỗng ngoài `.acceptance-runs`.
  - `AC4-xanh`: hai eval E1, E2 ghi vào `model_evals`, mỗi lần chạy `echo 1 >> "$GG_DAU/tieu.txt"`; `repin_cost_cmd: 'wc -l < "$GG_DAU/tieu.txt"'` (tệp tạo trước với 0 dòng) → stderr dòng cuối khớp `/^\[lane\] TỔNG KẾT .*eval model thật: gọi 2, carry 0.*chi phí đo: 2 /`; `JSON.parse(stdout).tong_ket.model_goi === 2`; dòng repin `tong_ket.chi_phi === 2`.
  - `AC4-do`: suite `exit 1` → status 1 và vẫn có dòng TỔNG KẾT cuối + `repin-do.tong_ket`.
  - `AC4-vuot-tran`, `AC4-bi-ngat`: dòng tổng kết có `ket_cuc: 'vuot-tran'|'bi-ngat'`.
  - `AC4-chi-phi-loi`: `repin_cost_cmd: 'exit 1'` → `chi phí đo: lỗi (` trong dòng, status không đổi (0).

- [ ] **Step 2: Chạy → FAIL.**

- [ ] **Step 3: Sửa làn.** Thêm vào `KNOWN` `'tran-phut'`; sau parse: `const tranPhut = flags['tran-phut'] !== undefined ? (Number(flags['tran-phut']) > 0 ? Number(flags['tran-phut']) : usage('--tran-phut phải là số phút > 0')) : khoa.repin_budget_min;`. Bộ bắt tín hiệu đặt NGAY sau khi dựng `perSlug`:

```js
const DANG_CHO = { ok: true };
async function ketThucSom(kieu, extra, ma) {
  if (dangChay) await dangChay.dung();
  const tk = dungTongKet({ ketCuc: kieu, ms: Date.now() - tBatDau, soLenh: results.size, modelGoi: demModel(), chapChon, chiPhi: chiPhiCuoi() });
  if (flags.write) for (const s of perSlug) {
    const dau = JSON.stringify(Object.assign({ ts: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'), kind: 'repin-do', lan_id: runId, sha, ly_do: kieu }, extra, { chua_chay: nhanChuaChay(), tong_ket: tk.obj, tai: docTai() }));
    try { fs.appendFileSync(path.join(s.ws, 'run-log.jsonl'), dau + '\n'); } catch (e) { console.error(`repin-lane: ${s.slug}: không ghi được dấu ${kieu} — ${e.code || e}`); }
  }
  process.stderr.write(tk.dong + '\n');
  process.exit(ma);
}
for (const [sig, n] of [['SIGTERM', 15], ['SIGINT', 2], ['SIGHUP', 1]]) process.on(sig, () => { ketThucSom('bi-ngat', { tin_hieu: sig }, 128 + n); });
```
  Trước mỗi lệnh và trong `chayMot`: nếu `hanMs` → `setTimeout(() => ketThucSom('vuot-tran', { tran_phut: tranPhut, da_chay_phut: +((Date.now() - tBatDau) / 60000).toFixed(2) }, 4), Math.max(0, hanMs - Date.now()))` (một timer duy nhất, dựng trước lệnh đầu). `nhanChuaChay()` = nhãn của suite chưa có kết quả + `${slug} ${id}` của eval chưa chạy. `demModel()` = tổng `rec.lan.length` của mọi khoá mà lệnh thuộc eval model (giữ `Set` tên khoá model khi gọi `runCmd`). `chiPhiCuoi()`: nếu có `repin_cost_cmd`, đọc số đầu (trước lệnh đầu) và số cuối (lúc tổng kết), trả `sau − trước` hoặc `{loi}`. Tổng kết cũng in ở nhánh xanh và đỏ hiện có; dòng `repin` thêm `tong_ket: tk.obj` sau các khoá tuỳ chọn; `run_id` phải sinh TRƯỚC bộ bắt tín hiệu (dời khối `runId` lên trên).

- [ ] **Step 4: Chạy toàn bộ ca `AC2-*`, `AC3-*`, `AC4-*` → PASS**; chạy lại `AC1-*` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(gia-lan-ghim-lai): trần mỗi lượt (mã 4), bắt tín hiệu dừng sạch cả cây, tổng kết cuối lượt"`.

---

### Task 5: Làn — suite ở môi trường giống CI (Đ3, AC-5)

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` (`runSuites`: env + `envTag: 'ci'`; dòng repin `suites_env`; section; nhãn lỗi; `lenhDo.moi_truong`)
- Test: `tests/scripts/repin-lane-env-ci.test.mjs` (ca `AC5-do-o-ci`, `AC5-eval-rieng`, `AC5-xanh-ghi-env`, `AC5-chay-lai-cung-env`, `AC5-ten-sai`, `AC5-khoa-vang`)

- [ ] **Step 1: Viết ca đỏ.** Fixture: tệp `.env` trong kho `K=tu-file`; suite `node --env-file=.env -e 'process.exit(process.env.K ? 0 : 1)'` (`suiteCmd`), env tiến trình `K=x` khi gọi `lane`.
  - `AC5-do-o-ci`: `config: '  repin_ci_blank_env: [K]\n'` → status 1; stderr có `môi trường giống CI (biến rỗng: K)`; `repin-do.lenh_do[0].moi_truong === 'ci'`.
  - `AC5-eval-rieng`: suite xanh ở CI `node --env-file=.env -e 'process.exit(0)'` và eval E1 có `sh` trùng NGUYÊN VĂN lệnh suite → làn xanh, `tong_ket.so_lenh === 2` (hai môi trường là hai lần chạy, không gộp) và `evals_exit.E1 === 0`.
  - `AC5-xanh-ghi-env`: suite xanh ở CI → dòng repin `suites_env === 'ci'`, section có `suite chạy ở môi trường giống CI (biến rỗng: K)`.
  - `AC5-chay-lai-cung-env`: `repin_retry: 1`, suite đọc K rỗng → đỏ hai lần → `lenh_do[0].lan_thu_lai === 1` và `moi_truong === 'ci'`.
  - `AC5-ten-sai`: `repin_ci_blank_env: [1BAD]` → 2.
  - `AC5-khoa-vang`: không khoá → status 0, không `suites_env`.

- [ ] **Step 2: Chạy → FAIL.**
- [ ] **Step 3: Sửa làn.** `const envCi = khoa.repin_ci_blank_env.length ? Object.assign({}, process.env, Object.fromEntries(khoa.repin_ci_blank_env.map(k => [k, '']))) : null;` Suite chạy với `env: envCi || process.env`, `envTag: envCi ? 'ci' : 'full'`; nhãn lỗi: khi suite đỏ và `envCi`, log thêm `(môi trường giống CI (biến rỗng: K…))` và `lenhDo` mang `moi_truong: 'ci'`. Dòng repin: `envCi ? { suites_env: 'ci' } : {}` sau `so_lenh`. Section: hậu tố ` · suite chạy ở môi trường giống CI (biến rỗng: ${ds.join(', ')})`.
- [ ] **Step 4: Chạy → PASS.** Commit — `git commit -m "feat(gia-lan-ghim-lai): suite chạy ở môi trường giống CI (biến khoá đặt rỗng), eval giữ env đầy đủ"`.

---

### Task 6: Khuôn SKILL + GUIDE §7.1 + mẫu config (AC-6)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (khối REPIN-TEMPLATE + đoạn nghi thức: mã 4, hai `ly_do`), `GUIDE.md` §7.1 (một đoạn «Năm khoá của làn 2.23» — mỗi khoá một dòng kèm giá trị gợi ý cho crm: `repin_retry: 1 · repin_budget_min: 80 · repin_ci_blank_env: [ZALO_BOT_TOKEN, …] · repin_cost_cmd: lệnh in số dư AI Gateway · model_evals: crm liệt kê`), `commands/acceptance-init.md` (năm dòng comment trong mẫu `feature_loop`).
- Test: `tests/scripts/repin-lane-khuon-gia.test.mjs` (ca `AC6-khuon-writer`, `AC6-skill-ma-4`, `AC6-guide-du-khoa`)

- [ ] **Step 1: Viết ca đỏ.** `AC6-khuon-writer`: fixture bật mọi khoá (retry, budget 5, blank [K], cost cmd, model_evals) với suite chập chờn → chạy `--write` xanh, rút khoá dòng `repin` mới nhất; rút khoá của khối REPIN-TEMPLATE trong SKILL bằng regex marker; mọi khoá writer ⊆ khuôn, thứ tự tương đối giữ; chạy một làn đỏ `--write` → khoá `repin-do` ⊆ khuôn (khuôn có hai dòng mẫu: `repin` và `repin-do`). `AC6-skill-ma-4`: đoạn SKILL giữa «Nghi thức re-pin» và khối REPIN-TEMPLATE chứa `exit 4`/`mã 4`, `vuot-tran`, `bi-ngat`. `AC6-guide-du-khoa`: rút `LAN_KHOA` từ `lan-khoa.mjs` bằng regex marker (rỗng → FAIL «rút rỗng»); mỗi `khoa` (phần sau `feature_loop.`) có trong GUIDE §7.1 (đoạn từ `### 7.1` tới `### 7.2`).
- [ ] **Step 2: Chạy → FAIL.** 
- [ ] **Step 3: Sửa SKILL** — khuôn mới:

```
{"ts":"<ISO>","kind":"repin","run_id":"<id>","sha":"<40-hex>","suites_exit":[0,0,0,0],"evals_exit":{"<E>":0},"wall_s":812.4,"so_lenh":5,"evals_not_run":["<E>"],"evals_not_machine":["<E>"],"evals_not_machine_touched":["<E>"],"chap_chon":[{"lenh":"<cmd>","nhan":"suite 1/4","lan_dau":1,"log":"<đường>","ca":["<tên ca>"]}],"suites_env":"ci","tong_ket":{"ket_cuc":"xanh","phut":13.5,"so_lenh":5,"model_goi":0,"model_carry":0,"chap_chon":1,"chi_phi":0.42}}
{"ts":"<ISO>","kind":"repin-do","lan_id":"<id>","sha":"<40-hex>","ly_do":"vuot-tran|bi-ngat","tin_hieu":"SIGTERM","tran_phut":80,"da_chay_phut":80.1,"chua_chay":["<nhãn>"],"suites_exit":[0],"evals_exit":{},"lenh_do":[{"cmd":"<cmd>","exit":1,"log":"<đường>","lan_thu_lai":1,"moi_truong":"ci"}],"tong_ket":{},"tai":{}}
```
  và đoạn nghi thức thêm một câu: «Từ 2.23 làn có thể thoát **4** (vượt trần `--tran-phut`/`repin_budget_min`) hoặc 128+n (bị ngắt) — cả hai ghi dòng `repin-do` với `ly_do: vuot-tran | bi-ngat` khi `--write`, không ghi pin; dòng stderr cuối `[lane] TỔNG KẾT` và khoá `tong_ket` có ở mọi kết cục». GUIDE §7.1 thêm đoạn năm khoá; init thêm năm dòng comment.
- [ ] **Step 4: Chạy ba ca → PASS**; chạy `bash tests/scripts/run-tests.sh --manh bash` để chắc P85 (ba bản GOAL-TEMPLATE) không bị chạm.
- [ ] **Step 5: Commit** — `git commit -m "docs(gia-lan-ghim-lai): khuôn REPIN-TEMPLATE, mã 4 và hai ly_do trong SKILL; năm khoá của làn ở GUIDE §7.1 và mẫu init"`.

---

### Task 7: Bộ răng hồ sơ — `rang/chan.mjs`, `ma-tran.mjs`, `ban-sao.mjs`, `chieu-do.mjs` (E1…E6)

**Files:**
- Create: `_acceptance/gia-lan-ghim-lai/rang/ban-sao.mjs` (tìm BASE-GIA/SAU-GIA, `git archive` vào thư mục tạm, trả gốc bản sao), `rang/chieu-do.mjs` (`batDo`), `rang/ma-tran.mjs` (mỗi AC: `{ tep, ca: [ids], mutants: [{ten, tep, tim, thay, ca, ghim}] }`), `rang/chan.mjs`.

**Interfaces:**
- `ban-sao.mjs`: `timBaseGia() → sha` (đọc hằng từ contract.md dòng `BASE-GIA`), `timSauGia() → sha` (`git log --format=%H -n1 --grep='(gia-lan-ghim-lai)' -- feature-loop/scripts`; rỗng → ném «không tìm thấy commit lõi»), `banSao(sha, dirs) → dir` (`git archive sha dirs | tar -x -C dir`).
- `chan.mjs --ac n`: (1) chạy `GG_CASES=<ids của AC> node tests/scripts/<tep>` trên cây hiện hành, đòi mọi id in `PASS: [id]` và không `FAIL`; đếm id khớp `ma-tran` (lệch → «số ô lệch»); (2) với mỗi mutant: `banSao(timSauGia(), ['feature-loop/scripts','tests/scripts','lib','scripts','commands'])`, áp `tim → thay` (không khớp → «phép phá không áp được»), chạy `GG_CASES=<ca>` với `ROOT` của bản sao (test suy ROOT từ vị trí tệp nên chạy tệp test TRONG bản sao), đòi stdout có `[<ca>]` (dấu dương) VÀ `FAIL: [<ca>]` VÀ chứa `ghim`.

- [ ] **Step 1: Viết `ma-tran.mjs`** với các mutant theo hợp đồng, ví dụ AC-1:
  - `lan-hai-do-van-dat`: tim `if (!lech(l2.exit)) {` thay `if (true) {`, ca `AC1-do-hai-lan`, ghim «lần hai đỏ vẫn tính đạt» — thông điệp assert của ca đó phải chứa đúng chuỗi này.
  - `chay-lai-model`: tim `if (laModel) return { chay: false` thay `if (false) return { chay: false`, ca `AC1-model-khong-lai`, ghim «chạy lại eval model thật».
  - `chap-chon-im`: tim `chapChon.push(rec.chap_chon)` thay `void 0`, ca `AC1-suite-chap-chon`, ghim «chập chờn im».
  - `chay-lai-duoi-tai`: tim `await choKhoiSongSong();` thay `void 0;`, ca `AC1-sau-song-song`, ghim «chạy lại dưới tải».
  AC-2: `chau-tien-trinh-sot` (tim `const cay = await thuCay(p.pid);` thay `const cay = [p.pid];`), `khong-sigkill` (tim `guiCa(conSong, 'SIGKILL');` thay `void 0;`), `lan-long-sot-chau` (tim `hauDue(pid, docPs())` thay `[pid]` ở cả hai chỗ — ghi `thayTatCa: true`), `trung-ma-lan-do` (tim `, 4)` trong lời gọi `ketThucSom('vuot-tran'` thay `, 1)`), `pin-tren-lan-chua-xong` (tim `if (flags.write) for (const s of perSlug) {` thay bằng thân ghi pin — mutant này đổi `process.exit(ma)` trong `ketThucSom` thành chạy tiếp khối ghi pin: tim `process.exit(ma);\n}` thay `if (kieu !== 'vuot-tran') process.exit(ma);\n}`). AC-3: `ngat-khong-de-vet` (tim `process.on(sig, () =>` thay `void (sig, () =>`). AC-4: `dem-model-sai` (tim `rec.lan.length` trong `demModel` thay `1`), `tong-ket-vang-o-lan-do` (tim dòng in tổng kết nhánh `red` thay rỗng). AC-5: `xoa-bien-thay-vi-rong` (tim `[k, '']` thay `[k, undefined]` + bỏ khoá), `env-ci-tran-sang-eval` (tim `env: process.env` ở vòng eval thay `env: envCi || process.env`), `gop-lenh-khac-env` (tim ``khoaLenh = (cmd, envTag) => `${envTag}\0${cmd}` `` thay `=> cmd`). AC-6: `khoa-ngoai-khuon` (tim `tong_ket: tk.obj` ở dòng repin thay `tong_ket: tk.obj, la_khoa_la: 1`), `khoa-chua-khai-o-guide` (mutant áp vào GUIDE.md: xoá dòng chứa `repin_cost_cmd` trong §7.1).
  Mỗi ca bền phải assert bằng thông điệp CHỨA chuỗi ghim tương ứng (viết chuỗi ghim trong `assert(..., 'ghim: …')`).
- [ ] **Step 2: Viết `chan.mjs`** theo giao diện trên; `so-do.mjs` giữ Task 8. Chạy `node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 1` … `--ac 6` → tất cả thoát 0 (mỗi mutant in `ĐỎ đúng: <ten> — [bản sao chạy tới ca: có · thấy ghim: có]`).
- [ ] **Step 3: Phá thử chính răng:** tạm sửa một mutant cho `tim` không khớp → chan in «phép phá không áp được» và thoát 1; hoàn lại.
- [ ] **Step 4: Commit** — `git commit -m "test(gia-lan-ghim-lai): bộ răng — ca bền trên cây hiện hành, bản sao bị phá trên archive SAU-GIA"`.

---

### Task 8: Vi phân với BASE-GIA (E7) và số đo trước/sau (E8)

**Files:**
- Create: `_acceptance/gia-lan-ghim-lai/rang/vi-phan.mjs`, `rang/so-do.mjs`; mở rộng `ma-tran.mjs` (AC-7 mutants `doi-mac-dinh-<khoa>` ×5 — mỗi cái đặt giá trị mặc định trong `docKhoa` thành bật, `them-ngoai-danh-sach` — thêm khoá `them_la: 1` vào dòng repin; AC-8 mutant `tat-D4` (khoá retry đọc thành 0), `tat-D5` (bỏ bộ bắt tín hiệu), `tat-D3` (env CI không áp)).
- Modify: `rang/chan.mjs` (--ac 7 gọi `vi-phan.mjs`, --ac 8 gọi `so-do.mjs`, rồi mutants như thường).

- [ ] **Step 1: `vi-phan.mjs`**: dựng `banSao(BASE)` và `banSao(SAU)`; fixture AC-1…AC-5 đã gỡ khoá (dùng `mkKho` với `config: ''`), ba kịch bản (`--skip-unchanged` · `--write` xanh · `--write` đỏ) + kịch bản SIGTERM giữa lệnh (spawn làn, kill sau khi `chau.pid` có); mỗi kịch bản chạy làn của cả hai bản sao với `--ag-root <banSao(BASE)>`; chuẩn hoá: thay `run_id`/`lan_id` → `<ID>`, `ts` → `<TS>`, `wall_s`/`da_chay_phut`/`(\d+\.\d)s` → `<T>`; gỡ dòng stderr bắt đầu `[lane] TỔNG KẾT`, khoá `tong_ket` khỏi mọi dòng JSON stdout/run-log, dòng `repin-do` có `ly_do: 'bi-ngat'`; so stdout, stderr, mã thoát, nội dung run-log, section Re-pin từng kịch bản — khác → in diff và thoát 1. Thêm: `recheck-evidence.cjs` của bản sao BASE đọc hồ sơ mà làn SAU vừa ghi (dòng có `tong_ket`) → thoát 0.
- [ ] **Step 2: `so-do.mjs`**: ba hàng; mỗi hàng chạy «trước» (khoá vắng) rồi «sau» (khoá bật) trên CÙNG `mkKho`: Đ4 — suite chập chờn in `(fail) app-rieng …`: trước status 1, sau status 0 và `chap_chon[0].ca` có `app-rieng`; Đ5 — spawn làn với suite cháu, SIGTERM sau khi có pid: trước (bản sao BASE) không dòng `bi-ngat` và cháu còn sống (giết tay sau khi đo), sau: dòng `bi-ngat` = 1, cháu chết; Đ3 — suite `node --env-file=.env -e 'process.exit(process.env.K ? 0 : 1)'`: trước status 0 (lọt), sau status 1 (bắt). In bảng `| Điểm | Trước | Sau |`; hàng không đổi → `Đx không đổi số`, thoát 1.
- [ ] **Step 3: Chạy `chan.mjs --ac 7` và `--ac 8` → 0**; phá thử: tạm đổi mặc định `repin_retry` thành 1 trong cây → `--ac 7` đỏ «đổi mặc định: feature_loop.repin_retry»; hoàn lại.
- [ ] **Step 4: Commit** — `git commit -m "test(gia-lan-ghim-lai): vi phân với BASE-GIA và số đo trước/sau ba điểm"`.

---

### Task 9: Khép S3

- [ ] Chạy `bash tests/scripts/run-tests.sh --manh mjs:1/3`, `mjs:2/3`, `mjs:3/3`, `--manh bash` → xanh (các tệp `*.test.mjs` mới tự vào mảnh qua glob).
- [ ] `node scripts/eval-coverage-lint.js .` không cảnh báo cho hồ sơ; `node scripts/product-map.mjs --root . --check` xanh.
- [ ] Sửa `_acceptance/gia-lan-ghim-lai/contract.md` → `status: implemented`; commit `docs(acceptance): gia-lan-ghim-lai implemented — sang S4`.
