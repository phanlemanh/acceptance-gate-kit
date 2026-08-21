# Repo khai plugin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `acceptance-init` ghi/hợp nhất `.claude/settings.json` cấp repo (marketplace + n+1 plugin) bằng một script đo được, GUIDE §5.1 từ 5 lệnh còn 1 cho máy sau, `diagram-design` bắt buộc.

**Architecture:** Một script ESM `scripts/plugin-declare.mjs` đọc tên plugin từ `.claude-plugin/marketplace.json` ship cùng plugin (suy từ vị trí script), hợp nhất JSON không phá khoá khác, dry-run mặc định. `acceptance-init.md` gọi nó ở bước 5b (khối có marker). GUIDE §5.1 có một khối marker duy nhất với danh sách tên + hai khối con máy-đầu/máy-sau. Một file ca kiểm riêng PD1–PD9 (fixture code-sinh trong `mkdtemp`, đường dẫn suy từ vị trí file), nối vào `run-tests.sh` bằng một vòng `for`.

**Tech Stack:** Node ≥ 18 (ESM, `node:fs`, `node:child_process.spawnSync`), bash suite hiện có.

**Spec:** `docs/superpowers/specs/2026-08-21-repo-khai-plugin-design.md` · hợp đồng `_acceptance/repo-khai-plugin/contract.md` (AC-1…AC-10) · evals `E1…E10`.

## Global Constraints

- Không chạm `hooks/` · `lib/` · `scripts/pre-merge-check.sh` · `scripts/recheck-evidence.cjs` · `commands/start.md` · `_acceptance/config.yaml`.
- Tên ca theo slug (`PD<n>`), KHÔNG lấy số P toàn cục; tiêu đề dòng `run` trong `run-tests.sh` không chứa chuỗi `PASS: PD`.
- Mọi ca: đối chứng dương + chiều đỏ trên bản sao, ghim thông điệp (MEASURE-BIRTH-CLAUSE).
- Đường dẫn trong ca suy từ vị trí file test; fixture code-sinh, không viết tay đúng khuôn bên đọc.
- Thông điệp người đọc bằng tiếng Việt có dấu, đúng nguyên văn ghim trong evals: «đã khai, không đổi» · «settings.json không đọc được — không ghi đè» · «không đọc được marketplace.json — đã thử: <path>» · «dry-run» · «commit file này».

---

### Task 1: Script `plugin-declare.mjs` + ca PD1 · PD3 · PD4 · PD5 · PD9

**Files:**
- Create: `scripts/plugin-declare.mjs`
- Create: `tests/plugins/plugin-declare.test.mjs`

**Interfaces:**
- Produces: CLI `node scripts/plugin-declare.mjs --root <repo> [--write] [--list] [--marketplace <path>]`; exit 0/3/4 như design §3. Export `mergeSettings(existing, names)` và `pluginList(marketplacePath)` cho ca PD2 đọc lại.
- Stdout khi ghi lần đầu: `đã khai N plugin trong .claude/settings.json — commit file này, …`; lần hai: `đã khai, không đổi: <file>`; dry-run có chữ `dry-run` và đủ tên.

- [ ] **Step 1: Viết file ca với khung chạy và PD1/PD3/PD4/PD5/PD9 (đỏ vì script chưa có)**

```js
// tests/plugins/plugin-declare.test.mjs — ca hồ sơ repo-khai-plugin (PD1–PD9).
// Fixture CODE-SINH trong mkdtemp; đường dẫn suy từ vị trí file; mỗi ca có đối
// chứng dương + chiều đỏ trên bản sao, ghim thông điệp. Chạy một phần:
//   PD_CASES=PD1,PD6 node tests/plugins/plugin-declare.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'plugin-declare.mjs');
const MARKET = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const INIT_MD = path.join(ROOT, 'commands', 'acceptance-init.md');
const GUIDE = path.join(ROOT, 'GUIDE.md');

let failures = 0;
const only = (process.env.PD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = (id, name) => console.log(`PASS: ${id} ${name}`);
const fail = (id, msg) => { console.log(`FAIL: ${id} ${msg}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'pd-'));
const run = (args, opts = {}) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', ...opts });
const settingsOf = root => path.join(root, '.claude', 'settings.json');
const expectedNames = (marketPath = MARKET) => {
  const m = JSON.parse(readFileSync(marketPath, 'utf8'));
  return [...m.plugins.map(p => `${p.name}@${m.name}`), 'superpowers@claude-plugins-official'];
};
const sameSet = (a, b) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');

// ---------- PD1: repo trống + --write → file đúng; chiều đỏ: marketplace gỡ diagram-design
if (want('PD1')) {
  const root = tmp();
  const r = run(['--root', root, '--write']);
  const file = settingsOf(root);
  if (r.status !== 0 || !existsSync(file)) fail('PD1', `exit ${r.status}, file ${existsSync(file)}: ${r.stderr}`);
  else {
    const raw = readFileSync(file, 'utf8'); const j = JSON.parse(raw); const names = expectedNames();
    const keys = Object.keys(j.enabledPlugins || {});
    const ok = j.extraKnownMarketplaces?.['acceptance-gate-kit']?.source?.source === 'github'
      && j.extraKnownMarketplaces['acceptance-gate-kit'].source.repo === 'phanlemanh/acceptance-gate-kit'
      && sameSet(keys, names) && keys.length === names.length && keys.every(k => j.enabledPlugins[k] === true)
      && raw === JSON.stringify(j, null, 2) + '\n';
    if (!ok) fail('PD1', `nội dung sai: keys=${keys.join(',')} expected=${names.join(',')}`);
    else {
      // chiều đỏ: marketplace bản sao gỡ diagram-design → đầu ra thiếu đúng tên đó + số đếm lệch
      const m = JSON.parse(readFileSync(MARKET, 'utf8')); m.plugins = m.plugins.filter(p => p.name !== 'diagram-design');
      const mk = path.join(tmp(), 'marketplace.json'); writeFileSync(mk, JSON.stringify(m));
      const root2 = tmp(); const r2 = run(['--root', root2, '--write', '--marketplace', mk]);
      const j2 = JSON.parse(readFileSync(settingsOf(root2), 'utf8')); const k2 = Object.keys(j2.enabledPlugins);
      const redOk = r2.status === 0 && !k2.includes('diagram-design@acceptance-gate-kit') && k2.length === names.length - 1 && !sameSet(k2, names);
      if (!redOk) fail('PD1', `chiều đỏ không đỏ: keys=${k2.join(',')}`);
      else pass('PD1', 'repo trống → file đúng tập n+1; gỡ diagram-design → thiếu đúng tên + lệch số');
    }
  }
}

// ---------- PD3: lần hai không đổi byte + "đã khai, không đổi"; lần một KHÔNG có "không đổi"
if (want('PD3')) {
  const root = tmp();
  const r1 = run(['--root', root, '--write']); const b1 = readFileSync(settingsOf(root));
  const r2 = run(['--root', root, '--write']); const b2 = readFileSync(settingsOf(root));
  if (r1.status !== 0 || !/đã khai/.test(r1.stdout) || /không đổi/.test(r1.stdout)) fail('PD3', `lần một: ${r1.stdout}`);
  else if (r2.status !== 0 || !b1.equals(b2) || !/đã khai, không đổi/.test(r2.stdout)) fail('PD3', `lần hai: exit ${r2.status} equal=${b1.equals(b2)} out=${r2.stdout}`);
  else pass('PD3', 'idempotent: lần hai không đổi byte, in «đã khai, không đổi»');
}

// ---------- PD4: JSON hỏng → exit 3, không chạm; đối chứng: sửa hợp lệ → exit 0 và đổi
if (want('PD4')) {
  const root = tmp(); mkdirSync(path.join(root, '.claude')); const f = settingsOf(root);
  writeFileSync(f, '{ không hợp lệ'); const before = readFileSync(f);
  const r = run(['--root', root, '--write']); const after = readFileSync(f);
  if (r.status !== 3 || !before.equals(after) || !/settings\.json không đọc được — không ghi đè/.test(r.stderr)) fail('PD4', `exit ${r.status} equal=${before.equals(after)} err=${r.stderr}`);
  else {
    writeFileSync(f, '{}\n'); const r2 = run(['--root', root, '--write']);
    if (r2.status !== 0 || readFileSync(f, 'utf8') === '{}\n') fail('PD4', 'đối chứng dương: JSON hợp lệ phải ghi được');
    else pass('PD4', 'JSON hỏng → exit 3, không chạm; hợp lệ → ghi');
  }
}

// ---------- PD5: dry-run không tạo file, in đủ tên; đối chứng: --write tạo
if (want('PD5')) {
  const root = tmp(); const r = run(['--root', root]); const names = expectedNames();
  if (r.status !== 0 || existsSync(settingsOf(root)) || !/dry-run/.test(r.stdout) || !names.every(n => r.stdout.includes(n))) fail('PD5', `exit ${r.status} file=${existsSync(settingsOf(root))} out=${r.stdout}`);
  else { const r2 = run(['--root', root, '--write']); if (r2.status !== 0 || !existsSync(settingsOf(root))) fail('PD5', 'đối chứng: --write phải tạo file'); else pass('PD5', 'dry-run không ghi, in đủ tên; --write ghi'); }
}

// ---------- PD9: marketplace vắng → exit 4 + đường dẫn + không tạo file (cờ sai đường · bản chép không có ../.claude-plugin/)
if (want('PD9')) {
  const root = tmp(); const bad = path.join(tmp(), 'khong-co.json');
  const r = run(['--root', root, '--write', '--marketplace', bad]);
  const copy = tmp(); mkdirSync(path.join(copy, 'scripts')); cpSync(SCRIPT, path.join(copy, 'scripts', 'plugin-declare.mjs'));
  const r2 = spawnSync(process.execPath, [path.join(copy, 'scripts', 'plugin-declare.mjs'), '--root', root, '--write'], { encoding: 'utf8' });
  const wantPath = path.join(copy, '.claude-plugin', 'marketplace.json');
  if (r.status !== 4 || !r.stderr.includes(bad) || existsSync(settingsOf(root))) fail('PD9', `cờ sai đường: exit ${r.status} err=${r.stderr}`);
  else if (r2.status !== 4 || !r2.stderr.includes(wantPath) || existsSync(settingsOf(root))) fail('PD9', `bản chép: exit ${r2.status} err=${r2.stderr}`);
  else { const r3 = run(['--root', root, '--write']); if (r3.status !== 0 || !existsSync(settingsOf(root))) fail('PD9', 'đối chứng dương'); else pass('PD9', 'marketplace vắng → exit 4 nêu đường dẫn, không ghi; có → ghi'); }
}

if (failures) { console.log(`plugin-declare: ${failures} ca đỏ`); process.exit(1); }
```

- [ ] **Step 2: Chạy để thấy đỏ (script chưa tồn tại)**

Run: `node tests/plugins/plugin-declare.test.mjs`
Expected: `FAIL: PD1 …`, `FAIL: PD3 …` … exit 1 (spawn lỗi vì thiếu `scripts/plugin-declare.mjs`).

- [ ] **Step 3: Viết script**

```js
#!/usr/bin/env node
// plugin-declare.mjs — ghi/hợp nhất `.claude/settings.json` CẤP REPO: khai marketplace
// của kit + bật đúng bộ plugin, để máy sau mở repo là harness nhắc đúng bộ.
// Nguồn tên: ../.claude-plugin/marketplace.json ship cùng plugin (source "./").
// Parse + hợp nhất — giữ nguyên mọi khoá khác của đội và thứ tự khoá có sẵn;
// file không parse được → exit 3, không chạm. Mặc định dry-run, --write mới ghi.
// Usage: node plugin-declare.mjs --root <repo> [--write] [--list] [--marketplace <path>]
// Exit:  0 ok/dry-run/không-đổi · 3 settings.json hỏng (không ghi) · 4 sai tham số
//        hoặc marketplace.json vắng/không đọc được (không ghi).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_MARKETPLACE = path.resolve(HERE, '..', '.claude-plugin', 'marketplace.json');
export const MARKETPLACE_NAME = 'acceptance-gate-kit';
export const MARKETPLACE_SOURCE = { source: 'github', repo: 'phanlemanh/acceptance-gate-kit' };
// superpowers: phụ thuộc của feature-loop, nằm ở marketplace mặc định — không khai thêm marketplace.
export const EXTRA_PLUGINS = ['superpowers@claude-plugins-official'];

function parseArgs(argv) {
  const a = { root: process.cwd(), write: false, list: false, marketplace: DEFAULT_MARKETPLACE };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--root') a.root = argv[++i];
    else if (t === '--write') a.write = true;
    else if (t === '--list') a.list = true;
    else if (t === '--marketplace') a.marketplace = argv[++i];
    else { console.error(`[plugin-declare] tham số lạ: ${t}`); return null; }
  }
  if (!a.root || !a.marketplace) return null;
  return a;
}

export function pluginList(marketplacePath = DEFAULT_MARKETPLACE) {
  let txt;
  try { txt = fs.readFileSync(marketplacePath, 'utf8'); }
  catch { console.error(`[plugin-declare] không đọc được marketplace.json — đã thử: ${marketplacePath}`); return null; }
  let j;
  try { j = JSON.parse(txt); }
  catch { console.error(`[plugin-declare] marketplace.json không phải JSON — đã thử: ${marketplacePath}`); return null; }
  const names = (Array.isArray(j.plugins) ? j.plugins : []).map(p => p && p.name).filter(Boolean);
  if (!names.length) { console.error(`[plugin-declare] marketplace.json không có plugin nào — đã thử: ${marketplacePath}`); return null; }
  const mk = j.name || MARKETPLACE_NAME;
  return [...names.map(n => `${n}@${mk}`), ...EXTRA_PLUGINS];
}

// Hợp nhất: spread giữ thứ tự khoá có sẵn; khoá của kit đặt lại tại chỗ cũ hoặc nối cuối.
export function mergeSettings(existing, names) {
  const out = existing && typeof existing === 'object' && !Array.isArray(existing) ? { ...existing } : {};
  const ekm = { ...(out.extraKnownMarketplaces || {}) };
  ekm[MARKETPLACE_NAME] = { source: MARKETPLACE_SOURCE };
  out.extraKnownMarketplaces = ekm;
  const ep = { ...(out.enabledPlugins || {}) };
  for (const n of names) ep[n] = true;
  out.enabledPlugins = ep;
  return out;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  if (!a) { console.error('[plugin-declare] usage: plugin-declare.mjs --root <repo> [--write] [--list] [--marketplace <path>]'); process.exit(4); }
  const names = pluginList(a.marketplace);
  if (!names) process.exit(4);
  if (a.list) { for (const n of names) console.log(n); process.exit(0); }
  const file = path.join(a.root, '.claude', 'settings.json');
  let existing = null, raw = null;
  if (fs.existsSync(file)) {
    raw = fs.readFileSync(file, 'utf8');
    try { existing = JSON.parse(raw); }
    catch { console.error(`[plugin-declare] settings.json không đọc được — không ghi đè (${file})`); process.exit(3); }
  }
  const next = JSON.stringify(mergeSettings(existing, names), null, 2) + '\n';
  if (!a.write) {
    console.log(`(dry-run) sẽ ${existing ? 'hợp nhất vào' : 'tạo'} ${file} với ${names.length} plugin:`);
    for (const n of names) console.log(`  - ${n}`);
    console.log('(dry-run) chạy lại với --write để ghi.');
    process.exit(0);
  }
  if (raw === next) { console.log(`đã khai, không đổi: ${file}`); process.exit(0); }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, next);
  console.log(`đã khai ${names.length} plugin trong ${path.relative(a.root, file) || file} — commit file này, đội viên mở repo là được nhắc cài.`);
  process.exit(0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
```

- [ ] **Step 4: Chạy ca, phải xanh 5/5**

Run: `PD_CASES=PD1,PD3,PD4,PD5,PD9 node tests/plugins/plugin-declare.test.mjs`
Expected: 5 dòng `PASS: PD…`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/plugin-declare.mjs tests/plugins/plugin-declare.test.mjs
git commit -m "feat(repo-khai-plugin): plugin-declare.mjs — khai marketplace + plugin cấp repo, hợp nhất JSON, dry-run; ca PD1/3/4/5/9"
```

---

### Task 2: Ca PD2 — hợp nhất giữ khoá khác và thứ tự

**Files:**
- Modify: `tests/plugins/plugin-declare.test.mjs` (thêm khối PD2 trước dòng `if (failures)`)

**Interfaces:**
- Consumes: `mergeSettings(existing, names)` từ Task 1 (import động để chiều đỏ mô phỏng ghi-đè-cả-file).

- [ ] **Step 1: Thêm ca PD2**

```js
// ---------- PD2: settings đã có khoá khác → 4 khoá kit thêm, khoá khác + thứ tự giữ; chiều đỏ: ghi-đè-cả-file mất khoá
if (want('PD2')) {
  const root = tmp(); mkdirSync(path.join(root, '.claude')); const f = settingsOf(root);
  const before = { worktree: { bgIsolation: 'none' }, permissions: { allow: ['Bash(npm run test:*)'] }, enabledPlugins: { 'paper-desktop@paper': true } };
  writeFileSync(f, JSON.stringify(before, null, 4) + '\n');
  const r = run(['--root', root, '--write']); const after = JSON.parse(readFileSync(f, 'utf8')); const names = expectedNames();
  const kitOk = names.every(n => after.enabledPlugins[n] === true);
  const keptOk = JSON.stringify(after.worktree) === JSON.stringify(before.worktree)
    && JSON.stringify(after.permissions) === JSON.stringify(before.permissions)
    && after.enabledPlugins['paper-desktop@paper'] === true;
  const orderOk = Object.keys(after).slice(0, 3).join(',') === 'worktree,permissions,enabledPlugins';
  if (r.status !== 0 || !kitOk || !keptOk || !orderOk) fail('PD2', `exit ${r.status} kit=${kitOk} kept=${keptOk} order=${Object.keys(after).join(',')}`);
  else {
    // chiều đỏ: mô phỏng bản vá ghi-đè-cả-file bằng khoá kit thuần, rồi chạy CÙNG phép so
    const { mergeSettings } = await import(SCRIPT);
    const overwritten = mergeSettings(null, names);
    const redKept = overwritten.enabledPlugins['paper-desktop@paper'] === true;
    if (redKept) fail('PD2', 'chiều đỏ không đỏ: ghi-đè-cả-file mà vẫn còn paper-desktop');
    else pass('PD2', 'hợp nhất giữ permissions/worktree/paper-desktop + thứ tự; ghi-đè-cả-file → mất khoá paper-desktop@paper');
  }
}
```

- [ ] **Step 2: Chạy** `PD_CASES=PD2 node tests/plugins/plugin-declare.test.mjs` → `PASS: PD2`.
- [ ] **Step 3: Commit** `git commit -am "test(repo-khai-plugin): PD2 hợp nhất giữ khoá khác + thứ tự"`

---

### Task 3: `acceptance-init.md` bước 5b + GUIDE §5.1 khuôn mới + ca PD6 · PD7 · PD8

**Files:**
- Modify: `commands/acceptance-init.md` (sau khối `INIT-CI-COPY-LIST>>>`, trước `6. Print:`)
- Modify: `GUIDE.md` §5.1 (từ `### 5.1` đến trước `### 5.2`)
- Modify: `tests/plugins/plugin-declare.test.mjs` (thêm helper rút khối + PD6/PD7/PD8)

**Interfaces:**
- Produces: marker `INIT-PLUGIN-DECLARE` (chứa dòng lệnh `node "${CLAUDE_PLUGIN_ROOT}/scripts/plugin-declare.mjs" --root <path> --write` + danh sách `- name@marketplace`), marker `GUIDE-PLUGIN-DECLARE` chứa danh sách `- name@marketplace` + marker con `GUIDE-MAY-DAU` / `GUIDE-MAY-SAU`.

- [ ] **Step 1: Thêm helper + ba ca (đỏ vì md chưa có khối)**

```js
const block = (text, marker) => {
  const m = text.match(new RegExp(`<!-- <<<${marker} -->([\\s\\S]*?)<!-- ${marker}>>> -->`));
  return m ? m[1] : null;
};
const namesIn = blk => [...blk.matchAll(/^\s*-\s+`?([\w.-]+@[\w.-]+)`?\s*$/gm)].map(m => m[1]);
const count = (s, re) => (s.match(re) || []).length;

// ---------- PD6: bốn nơi một chữ — marketplace ∪ superpowers == --list == init == GUIDE; đột biến (a) GUIDE gỡ feature-loop, (b) init đổi marker
if (want('PD6')) {
  const names = expectedNames();
  const list = run(['--list']).stdout.trim().split('\n');
  const initBlk = block(readFileSync(INIT_MD, 'utf8'), 'INIT-PLUGIN-DECLARE');
  const guideBlk = block(readFileSync(GUIDE, 'utf8'), 'GUIDE-PLUGIN-DECLARE');
  const check = (label, blk) => {
    if (!blk) return `không tìm thấy khối ở ${label}`;
    const got = namesIn(blk); const miss = names.filter(n => !got.includes(n)); const extra = got.filter(n => !names.includes(n));
    return miss.length || extra.length ? `${label} thiếu [${miss.join(',')}] thừa [${extra.join(',')}]` : null;
  };
  const e = [sameSet(list, names) ? null : `--list lệch: ${list.join(',')}`, check('init', initBlk), check('GUIDE', guideBlk)].filter(Boolean);
  if (e.length) fail('PD6', e.join(' · '));
  else {
    const redA = check('GUIDE', guideBlk.replace(/^.*feature-loop@acceptance-gate-kit.*$/m, ''));
    const redB = check('init', block(readFileSync(INIT_MD, 'utf8').replace(/INIT-PLUGIN-DECLARE/g, 'INIT-PLUGIN-DECLAR'), 'INIT-PLUGIN-DECLARE'));
    if (!redA || !redA.includes('feature-loop@acceptance-gate-kit') || !redA.includes('GUIDE')) fail('PD6', `đột biến (a) không đỏ đúng: ${redA}`);
    else if (!redB || !redB.includes('không tìm thấy khối')) fail('PD6', `đột biến (b) không đỏ đúng: ${redB}`);
    else pass('PD6', 'bốn nơi khớp; gỡ một tên ở GUIDE → nêu tên+nơi; đổi marker init → không tìm thấy khối');
  }
}

// ---------- PD7: GUIDE §5.1 — 0 «tuỳ chọn», có «không pin phiên bản», máy-đầu 1 add + 1 install, máy-sau 1 add + 0 install; đột biến (a) chèn «tuỳ chọn», (b) chèn install vào máy-sau
if (want('PD7')) {
  const g = readFileSync(GUIDE, 'utf8');
  const judge = text => {
    const sec = text.split(/^### 5\.1/m)[1]?.split(/^### 5\.2/m)[0] || '';
    const dau = block(sec, 'GUIDE-MAY-DAU') || '', sau = block(sec, 'GUIDE-MAY-SAU') || '';
    const errs = [];
    if (count(sec, /tuỳ chọn, cài riêng được/g) !== 0) errs.push("GUIDE 5.1 còn 'tuỳ chọn'");
    if (!/không pin phiên bản/.test(sec)) errs.push('GUIDE 5.1 thiếu câu không pin phiên bản');
    if (count(dau, /claude plugin marketplace add phanlemanh\/acceptance-gate-kit/g) !== 1 || count(dau, /claude plugin install acceptance-gate@acceptance-gate-kit/g) !== 1) errs.push('máy-đầu phải đúng 1 add + 1 install acceptance-gate');
    if (count(sau, /claude plugin marketplace add/g) !== 1 || count(sau, /claude plugin install/g) !== 0) errs.push('máy-sau có lệnh install hoặc thiếu add');
    return errs;
  };
  const e = judge(g);
  if (e.length) fail('PD7', e.join(' · '));
  else {
    const redA = judge(g.replace('### 5.2', 'claude plugin install diagram-design@acceptance-gate-kit    # (tuỳ chọn, cài riêng được)\n### 5.2'));
    const redB = judge(g.replace('<!-- GUIDE-MAY-SAU>>> -->', 'claude plugin install feature-loop@acceptance-gate-kit\n<!-- GUIDE-MAY-SAU>>> -->'));
    if (!redA.some(x => x.includes("còn 'tuỳ chọn'"))) fail('PD7', `đột biến (a) không đỏ: ${redA}`);
    else if (!redB.some(x => x.includes('máy-sau có lệnh install'))) fail('PD7', `đột biến (b) không đỏ: ${redB}`);
    else pass('PD7', 'GUIDE 5.1: 0 tuỳ chọn, không pin, máy-đầu 1+1, máy-sau 1+0; hai đột biến đỏ đúng');
  }
}

// ---------- PD8: round-trip — rút NGUYÊN VĂN dòng lệnh trong khối init, thế biến, THỰC THI; đột biến --write→--writ → exit 4
if (want('PD8')) {
  const md = readFileSync(INIT_MD, 'utf8');
  const blk = block(md, 'INIT-PLUGIN-DECLARE');
  const after = md.indexOf('INIT-CI-COPY-LIST>>>'), at = md.indexOf('<<<INIT-PLUGIN-DECLARE'), six = md.indexOf('6. Print:');
  const runLine = (b, root) => {
    const line = (b || '').split('\n').find(l => l.includes('plugin-declare.mjs'));
    if (!line) return { status: -1, stderr: 'không có dòng lệnh' };
    const argv = line.trim().replace('${CLAUDE_PLUGIN_ROOT}', ROOT).replace('<path>', root).match(/"[^"]*"|\S+/g).map(s => s.replace(/^"|"$/g, ''));
    if (argv[0] !== 'node') return { status: -1, stderr: `lệnh không bắt đầu bằng node: ${argv[0]}` };
    return spawnSync(process.execPath, argv.slice(1), { encoding: 'utf8' });
  };
  const root = tmp(); const r = runLine(blk, root);
  const ok = blk && after > -1 && at > after && six > at && /commit file này/.test(blk) && r.status === 0 && existsSync(settingsOf(root))
    && sameSet(Object.keys(JSON.parse(readFileSync(settingsOf(root), 'utf8')).enabledPlugins), run(['--list']).stdout.trim().split('\n'));
  if (!ok) fail('PD8', `vị trí/khối/thực thi: exit ${r.status} ${r.stderr}`);
  else {
    const r2 = runLine(blk.replace('--write', '--writ'), tmp());
    if (r2.status !== 4) fail('PD8', `đột biến --writ không đỏ: exit ${r2.status}`);
    else pass('PD8', 'lệnh trong init chạy được và ghi đúng tập --list; --writ → exit 4 (lệnh trong init không chạy được)');
  }
}
```

- [ ] **Step 2: Chạy** `PD_CASES=PD6,PD7,PD8 node tests/plugins/plugin-declare.test.mjs` → 3 FAIL (khối chưa có).

- [ ] **Step 3: Thêm bước 5b vào `commands/acceptance-init.md`** — ngay sau dòng `<!-- INIT-CI-COPY-LIST>>> -->` và các dòng ghi chú của bước 5, trước `6. Print:`:

```markdown
5b. Declare the plugin set AT REPO LEVEL so every later machine gets the same
    plugins just by opening the repo (Claude Code reads `enabledPlugins` +
    `extraKnownMarketplaces` from `.claude/settings.json`). Run — `<path>` is the
    repo root (`--repo` value, or `.`):
    <!-- <<<INIT-PLUGIN-DECLARE -->
    node "${CLAUDE_PLUGIN_ROOT}/scripts/plugin-declare.mjs" --root <path> --write
    It parses and MERGES: every other key the team keeps in that file survives;
    invalid JSON → exit 3 and nothing is written. It declares:
    - acceptance-gate@acceptance-gate-kit
    - feature-loop@acceptance-gate-kit
    - diagram-design@acceptance-gate-kit
    - superpowers@claude-plugins-official
    <!-- INIT-PLUGIN-DECLARE>>> -->
    Then tell the human ONE line: "đã khai plugin trong `.claude/settings.json` —
    commit file này; đội viên mở repo là được nhắc cài." This file does NOT pin
    plugin versions (GUIDE §5.1 says so); versions still follow kit releases.
```

- [ ] **Step 4: Viết lại GUIDE §5.1** (thay toàn bộ từ `### 5.1` đến trước `Sau khi cài,`):

```markdown
### 5.1 Mỗi máy dev (một lần)

<!-- <<<GUIDE-PLUGIN-DECLARE -->
Repo đã chạy `/acceptance-init` **khai sẵn bộ plugin** trong `.claude/settings.json`
(khoá `extraKnownMarketplaces` + `enabledPlugins`), nên chỉ **máy đầu tiên** của một
repo phải cài tay đủ để chạy init; **máy sau** mở repo là Claude Code nhắc bật đúng bộ:

- acceptance-gate@acceptance-gate-kit
- feature-loop@acceptance-gate-kit
- diagram-design@acceptance-gate-kit
- superpowers@claude-plugins-official

<!-- <<<GUIDE-MAY-DAU -->
**Máy đầu tiên của repo** (repo chưa có `.claude/settings.json`):

```bash
claude plugin marketplace add phanlemanh/acceptance-gate-kit
claude plugin install acceptance-gate@acceptance-gate-kit
```

rồi chạy `/acceptance-init` — bước 5b của nó ghi file khai plugin; **commit file đó**.
<!-- GUIDE-MAY-DAU>>> -->

<!-- <<<GUIDE-MAY-SAU -->
**Máy sau** (repo đã có file khai):

```bash
claude plugin marketplace add phanlemanh/acceptance-gate-kit
```

rồi mở repo trong Claude Code — harness đọc `enabledPlugins` và nhắc bật phần còn thiếu.
<!-- GUIDE-MAY-SAU>>> -->

File khai **không pin phiên bản**: `enabledPlugins` bật theo tên; phiên bản vẫn đi theo
mốc release của kit và lệnh `claude plugin update` bên dưới.
<!-- GUIDE-PLUGIN-DECLARE>>> -->
```

và trong khối *Kỷ luật cập nhật* sửa `# nếu đã cài` của `diagram-design` thành `# bắt buộc từ 2.3`.

- [ ] **Step 5: Chạy** `PD_CASES=PD6,PD7,PD8 node tests/plugins/plugin-declare.test.mjs` → 3 PASS.
- [ ] **Step 6: Commit** `git add commands/acceptance-init.md GUIDE.md tests/plugins/plugin-declare.test.mjs && git commit -m "feat(repo-khai-plugin): init bước 5b + GUIDE §5.1 khuôn khai plugin (máy-đầu/máy-sau, diagram-design bắt buộc); PD6/7/8"`

---

### Task 4: Nối vào `run-tests.sh`, chạy trọn suite plugins, hạ `implemented`

**Files:**
- Modify: `tests/plugins/run-tests.sh` — ngay sau vòng `for _lv … done` của lan-v

- [ ] **Step 1: Thêm vòng nối (tiêu đề KHÔNG chứa «PASS: PD»)**

```bash
# ─── Hồ sơ repo-khai-plugin: PD1..PD9 (file ca riêng, tên theo slug) ─────────
for _pd in PD1 PD2 PD3 PD4 PD5 PD6 PD7 PD8 PD9; do
  run "ca khai plugin — $_pd (ho so repo-khai-plugin)" \
    env PD_CASES="$_pd" node "$ROOT/tests/plugins/plugin-declare.test.mjs"
done
```

- [ ] **Step 2: Chạy ONLY_BLOCK** `ONLY_BLOCK="ca khai plugin" bash tests/plugins/run-tests.sh` → 9 khối xanh.
- [ ] **Step 3: Chạy trọn** `bash tests/plugins/run-tests.sh` → exit 0 (số ca tăng đúng 9).
- [ ] **Step 4: Commit + hạ trạng thái** — sửa `_acceptance/repo-khai-plugin/contract.md` `status: implemented`; `git add -A tests/plugins/run-tests.sh _acceptance/repo-khai-plugin/contract.md && git commit -m "feat(repo-khai-plugin): nối PD1–PD9 vào suite plugins; contract → implemented"`.

## Self-review

- Spec §3 (giao diện, exit 0/3/4, `--marketplace`) → Task 1. §4 init/GUIDE → Task 3. §5 PD1–PD9 → Task 1/2/3; E10 là judgment, không có task code (lời khai người viết trước Cổng Bằng chứng). §6 known-limit → contract Notes. Không placeholder. Tên `mergeSettings`/`pluginList`/`expectedNames`/`block`/`namesIn` nhất quán giữa các task.
