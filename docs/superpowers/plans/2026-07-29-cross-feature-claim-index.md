# cross-feature-claim-index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `claim-scan.mjs` dẫn xuất claim từ ledger + gap-probe của mọi slug, nạp làm input thứ 5 cho gap-probe S1 của feature-loop (advisory, cite được, đo được).

**Architecture:** Index là VIEW dẫn xuất tại thời điểm probe (approach A — không persist, không drift). Pipeline cố định: parse → lọc loại → exclude-self → dedupe → sort → cap → serialize. Tích hợp bằng văn bản SKILL.md (S1#7) + prompt ràng buộc advisory/cite.

**Tech Stack:** Node ≥18 thuần (không dependency), test = `tests/workflows/*.test.mjs` (node assert, chạy qua `run-tests.sh`).

## Global Constraints

- Nguồn sự thật: `feature-loop/` — sửa xong PHẢI `bash scripts/sync-plugin-packages.sh` và commit mirror cùng lượt (CLAUDE.md).
- Fixture `_acceptance/` giả trong test do **code sinh** (mkdtemp + write), cấm chép tay; mọi assertion âm tính có **đối chứng dương** + ghim **thông điệp**, không chỉ exit code (CLAUDE.md).
- Schema claim 10 trường: `id source slug kind stage sev at claim lesson pointer` (+`serves` optional). Id khuôn: `d-…` (ledger) | `<slug>#F<n>` (gap-probe). Regex đo: `^(d-[0-9TZ]+-[0-9]+|[a-z0-9-]+#F[0-9]+)$`.
- Thông điệp skip (ghim trong test, đừng đổi lời): `claim-scan: skipped <N> malformed lines in <file>` (ledger) · `claim-scan: skipped <file> (<reason>)` với reason ∈ `malformed table` | `missing at` (gap-probe).
- Usage error → exit 2 + stderr bắt đầu `usage: claim-scan --root <dir> --slug <slug> [--json]`.

## File map

- Create: `feature-loop/scripts/claim-scan.mjs` — toàn bộ scanner (1 file, 1 trách nhiệm).
- Create: `tests/workflows/claim-scan.test.mjs` — CS1–CS6, CS9, CS10 (Task 1–5).
- Create: `tests/workflows/skill-claims.test.mjs` — CS7, CS8 (SKILL text — Task 6, file riêng để độc lập với Task 2–5).
- Modify: `feature-loop/skills/feature-loop/SKILL.md` — S1#7 (input 5 + fallback + prompt ý 7) — Task 6.
- Modify: `feature-loop/.claude-plugin/plugin.json`, `codex/feature-loop-codex/.codex-plugin/plugin.json`, `tests/plugins/run-tests.sh` (re-pin literal), mirror `plugins/feature-loop-codex/` — Task 7.

---

### Task 1: Scanner lõi — parse 2 nguồn, lọc loại, --json (E1 một phần)

**Files:** Create `feature-loop/scripts/claim-scan.mjs` · Create `tests/workflows/claim-scan.test.mjs`
**Phục vụ evals:** E1 · **independent:** false (mọi task sau xây trên file này)
**Interfaces — Produces:** CLI `node claim-scan.mjs --root <dir> --slug <slug> [--json]`; `--json` in `{"claims":[{id,source,slug,kind,stage,sev,at,claim,lesson,pointer,serves?}]}`; helper test `mkCorpus(dir, slugs)` sinh fixture.

- [ ] **Step 1: Viết test CS1 (fail trước).** Tạo `tests/workflows/claim-scan.test.mjs`:

```js
// Tests for feature-loop/scripts/claim-scan.mjs — fixture SINH BẰNG CODE,
// assertion âm tính luôn có đối chứng dương + ghim thông điệp (CLAUDE.md).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCAN = path.join(HERE, '..', '..', 'feature-loop', 'scripts', 'claim-scan.mjs');
let passed = 0, failed = 0;
function check(name, fn) {
  try { fn(); passed++; console.log(`  PASS: ${name}`); }
  catch (e) { failed++; console.log(`  FAIL: ${name}\n    ${e.message}`); }
}
function run(args, opts = {}) {
  const r = spawnSync('node', [SCAN, ...args], { encoding: 'utf8', ...opts });
  return { code: r.status, out: r.stdout, err: r.stderr };
}
// Fixture builder — code sinh, không chép tay.
function ledgerLine(id, type, extra = {}) {
  return JSON.stringify({ id, type, stage: 'S4-r1', at: '2026-07-20T10:00:00Z',
    decision: `decision-${id}`, impact: `impact-${id}`, ...extra });
}
function gapProbe(at, verdict, rows) {
  const table = ['| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |',
    '|---|---|---|---|---|---|',
    ...rows.map(r => `| ${r.sev} | ${r.artifact} | ${r.gap} | ${r.fail} | ${r.measure} | ${r.disp} |`)].join('\n');
  return `---\nslug: x\nat: ${at}\nverdict: ${verdict}\np0: 0\np1: 1\np2: 0\n---\n\n# Gap-probe\n\n## Findings\n\n${table}\n`;
}
function mkWorkspace(root, slug, { ledger = [], probe = null } = {}) {
  const d = path.join(root, '_acceptance', slug);
  mkdirSync(d, { recursive: true });
  if (ledger.length) writeFileSync(path.join(d, 'decisions.jsonl'), ledger.join('\n') + '\n');
  if (probe) writeFileSync(path.join(d, 'gap-probe.md'), probe);
}
const row = (sev, tag) => ({ sev, artifact: 'evals', gap: `gap-${tag}`, fail: `fail-${tag}`, measure: `m-${tag}`, disp: `fixed: ${tag}` });

// ---- CS1: đúng nguồn, đúng loại — kèm đối chứng vắng-mặt ĐƯỢC DỰNG ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs1-'));
  mkWorkspace(root, 'feat-a', {
    ledger: [ledgerLine('d-20260720T100000Z-1', 'fix'),
             ledgerLine('d-20260720T100001Z-2', 'descope'),
             ledgerLine('d-20260720T100002Z-3', 'approach'),
             JSON.stringify({ id: 'd-20260720T100003Z-4', type: 'seal', gate: 1, at: '2026-07-20T10:00:03Z' })],
    probe: gapProbe('2026-07-21T10:00:00Z', 'findings', [row('P1', 'af1')]),
  });
  mkWorkspace(root, 'feat-b', { probe: gapProbe('2026-07-22T10:00:00Z', 'clean', [row('P2', 'bf1')]) });
  mkWorkspace(root, 'feat-c', { probe: gapProbe('2026-07-23T10:00:00Z', 'probe-failed', [row('P0', 'cf1')]) });
  const r = run(['--root', root, '--slug', 'brand-new', '--json']);
  const claims = JSON.parse(r.out).claims;
  const ids = claims.map(c => c.id);
  check('CS1 exit 0 + đủ 2 nguồn', () => { assert.equal(r.code, 0);
    assert.ok(ids.includes('d-20260720T100000Z-1')); assert.ok(ids.includes('d-20260720T100001Z-2'));
    assert.ok(ids.includes('feat-a#F1')); });
  check('CS1 đối chứng âm THEO ID: approach/seal vắng', () =>
    { assert.ok(!ids.includes('d-20260720T100002Z-3')); assert.ok(!ids.includes('d-20260720T100003Z-4')); });
  check('CS1 clean/probe-failed CÓ bảng vẫn vắng (đối chứng dương: cùng khuôn ở findings thì có)', () =>
    { assert.ok(!ids.includes('feat-b#F1')); assert.ok(!ids.includes('feat-c#F1')); assert.ok(ids.includes('feat-a#F1')); });
  rmSync(root, { recursive: true, force: true });
}
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Chạy để thấy fail.** Run `node tests/workflows/claim-scan.test.mjs` — Expected: FAIL/ERR (SCAN chưa tồn tại, spawn exit ≠0).
- [ ] **Step 3: Viết scanner tối thiểu** `feature-loop/scripts/claim-scan.mjs`:

```js
#!/usr/bin/env node
// claim-scan — dẫn xuất claim máy-đọc-được từ _acceptance/*/decisions.jsonl
// (fix|descope) + gap-probe.md (verdict: findings). Index là VIEW: nguồn sự
// thật vẫn là file gốc append-only; không persist, không drift.
// Pipeline cố định: parse → lọc loại → exclude-self → dedupe → sort → cap → serialize.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const USAGE = 'usage: claim-scan --root <dir> --slug <slug> [--json]';
const CAP = 10, TRUNC = 250;
const ID_RE = /^(d-[0-9TZ]+-[0-9]+|[a-z0-9-]+#F[0-9]+)$/;

function parseArgs(argv) {
  const a = { json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') a.root = argv[++i];
    else if (argv[i] === '--slug') a.slug = argv[++i];
    else if (argv[i] === '--json') a.json = true;
    else return null;
  }
  if (!a.root || !a.slug) return null;
  return a;
}
const cut = (s) => { s = String(s ?? '').trim(); return s.length > TRUNC ? s.slice(0, TRUNC) + '…' : s; };

function ledgerClaims(file, slug, warn) {
  const out = []; let bad = 0;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let e; try { e = JSON.parse(line); } catch { bad++; continue; }
    if (e.type !== 'fix' && e.type !== 'descope') continue;
    out.push({ id: e.id, source: 'ledger', slug, kind: e.type, stage: e.stage ?? null,
      sev: null, at: e.at ?? null, claim: cut(e.decision), lesson: cut(e.impact),
      pointer: `_acceptance/${slug}/decisions.jsonl`,
      ...(Array.isArray(e.serves) && e.serves.length ? { serves: e.serves } : {}) });
  }
  if (bad) warn(`claim-scan: skipped ${bad} malformed lines in ${file}`);
  return out;
}

function probeClaims(file, slug, warn) {
  const text = readFileSync(file, 'utf8');
  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  const meta = {}; if (fm) for (const l of fm[1].split('\n')) {
    const m = /^([a-z0-9_]+):\s*(.*)$/.exec(l.trim()); if (m) meta[m[1]] = m[2];
  }
  if (meta.verdict !== 'findings') return [];
  if (!meta.at) { warn(`claim-scan: skipped ${file} (missing at)`); return []; }
  const sect = /## Findings([\s\S]*)/.exec(text);
  if (!sect) { warn(`claim-scan: skipped ${file} (malformed table)`); return []; }
  const rows = sect[1].split('\n').filter(l => l.trim().startsWith('|'));
  const out = []; let n = 0; let malformed = false;
  for (const line of rows.slice(2)) { // bỏ header + separator
    const cells = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length !== 6) { malformed = true; continue; }
    n++;
    const [sev, , gap, fail, , disp] = cells;
    out.push({ id: `${slug}#F${n}`, source: 'gap-probe', slug, kind: 'finding', stage: 'S1',
      sev: /^P[0-2]$/.test(sev) ? sev : null, at: meta.at, claim: cut(`${gap} — ${fail}`),
      lesson: cut(disp), pointer: `_acceptance/${slug}/gap-probe.md` });
  }
  if (malformed && out.length === 0) { warn(`claim-scan: skipped ${file} (malformed table)`); return []; }
  if (malformed) warn(`claim-scan: skipped ${file} (malformed table)`); // lệch một phần: giữ dòng lành, vẫn đếm to
  return out;
}

export function scan(root, slug, warn = (m) => console.error(m)) {
  const accDir = path.join(root, '_acceptance');
  let claims = [];
  if (existsSync(accDir)) for (const name of readdirSync(accDir).sort()) {
    if (name === slug) continue; // exclude-self
    const d = path.join(accDir, name);
    if (!statSync(d).isDirectory()) continue;
    const led = path.join(d, 'decisions.jsonl');
    if (existsSync(led)) claims.push(...ledgerClaims(led, name, warn));
    const gp = path.join(d, 'gap-probe.md');
    if (existsSync(gp)) claims.push(...probeClaims(gp, name, warn));
  }
  const seen = new Set();
  claims = claims.filter(c => ID_RE.test(c.id) && !seen.has(c.id) && seen.add(c.id));
  const rank = (s) => ({ P0: 0, P1: 1, P2: 2 })[s] ?? 3;
  claims.sort((a, b) => rank(a.sev) - rank(b.sev) || String(b.at).localeCompare(String(a.at)));
  return claims.slice(0, CAP);
}

function toMarkdown(claims) {
  if (!claims.length) return '';
  return ['## Bài học từ feature trước (advisory)', '',
    ...claims.map(c => `- [${c.id}] (${c.slug} · ${c.stage ?? c.sev ?? '-'} · ${c.kind}) ${c.claim} — ${c.lesson}`),
    ''].join('\n');
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const a = parseArgs(process.argv.slice(2));
  if (!a) { console.error(USAGE); process.exit(2); }
  if (!existsSync(a.root) || !statSync(a.root).isDirectory()) {
    console.error(`claim-scan: root not found: ${a.root}\n${USAGE}`); process.exit(2);
  }
  const claims = scan(a.root, a.slug);
  process.stdout.write(a.json ? JSON.stringify({ claims }, null, 2) + '\n' : toMarkdown(claims));
}
```

- [ ] **Step 4: Chạy test pass.** Run `node tests/workflows/claim-scan.test.mjs` — Expected: `Results: 3 passed, 0 failed`. Chạy cả suite: `bash tests/workflows/run-tests.sh` — Expected: all passed (file mới tự được nhặt bởi glob `*.test.mjs`).
- [ ] **Step 5: Commit.** `git add feature-loop/scripts/claim-scan.mjs tests/workflows/claim-scan.test.mjs && git commit -m "feat(claim-scan): parse ledger + gap-probe, lọc đúng loại — CS1 kèm đối chứng dựng thật (E1)"`

---

### Task 2: Robustness — hỏng-từng-phần skip-loud + arg validation + corpus rỗng (E2, E4)

**Files:** Modify `feature-loop/scripts/claim-scan.mjs` (chỉ khi test lộ lỗi — logic đã có khung) · Modify `tests/workflows/claim-scan.test.mjs`
**Phục vụ evals:** E2, E4 · **independent:** false (sau Task 1, cùng file)

- [ ] **Step 1: Thêm test CS2 + CS4 (trước `console.log` cuối):**

```js
// ---- CS2: hỏng từng phần — skip loud, nguồn lành nguyên vẹn ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs2-'));
  const goodLedger = [ledgerLine('d-20260720T100000Z-10', 'fix'), ledgerLine('d-20260720T100001Z-11', 'fix')];
  mkWorkspace(root, 'ok-a', { ledger: goodLedger, probe: gapProbe('2026-07-21T09:00:00Z', 'findings', [row('P1', 'ok1')]) });
  const clean = run(['--root', root, '--slug', 'z', '--json']);
  check('CS2 đối chứng dương: fixture nguyên vẹn ra đủ claim 2 nguồn', () => {
    const ids = JSON.parse(clean.out).claims.map(c => c.id);
    assert.equal(clean.code, 0);
    assert.ok(ids.includes('d-20260720T100000Z-10') && ids.includes('ok-a#F1')); });
  // tiêm hỏng: 2 dòng JSONL rác + 1 probe lệch cột + 1 probe thiếu at
  mkWorkspace(root, 'bad-led', { ledger: ['{not-json', ...goodLedger.map(l => l.replace(/Z-1/g, 'Z-2')), '"trailing'] });
  const badTable = gapProbe('2026-07-21T09:30:00Z', 'findings', [row('P2', 'bt')]).replace('| m-bt |', '|'); // lệch cột
  mkWorkspace(root, 'bad-tbl', { probe: badTable });
  mkWorkspace(root, 'bad-at', { probe: gapProbe('X', 'findings', [row('P2', 'ba')]).replace(/^at: X\n/m, '') });
  const r = run(['--root', root, '--slug', 'z', '--json']);
  const ids = JSON.parse(r.out).claims.map(c => c.id);
  check('CS2 nguồn lành còn nguyên + exit 0', () => { assert.equal(r.code, 0);
    assert.ok(ids.includes('d-20260720T100000Z-10') && ids.includes('ok-a#F1')); });
  check('CS2 ghim thông điệp skip per-file', () => {
    assert.match(r.err, /claim-scan: skipped 2 malformed lines in .*bad-led.*decisions\.jsonl/);
    assert.match(r.err, /claim-scan: skipped .*bad-tbl.*gap-probe\.md \(malformed table\)/);
    assert.match(r.err, /claim-scan: skipped .*bad-at.*gap-probe\.md \(missing at\)/); });
  check('CS2 claim từ file hỏng không lọt', () =>
    assert.ok(!ids.includes('bad-tbl#F1') && !ids.includes('bad-at#F1')));
  rmSync(root, { recursive: true, force: true });
}
// ---- CS4: corpus rỗng OK · thiếu tham số nổ to ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs4-'));
  const a = run(['--root', root, '--slug', 'z', '--json']);
  check('CS4a corpus rỗng: exit 0 + claims []', () =>
    { assert.equal(a.code, 0); assert.deepEqual(JSON.parse(a.out).claims, []); });
  mkWorkspace(root, 'old-ws', {}); writeFileSync(path.join(root, '_acceptance', 'old-ws', 'contract.md'), '---\nstatus: draft\n---\n');
  const b = run(['--root', root, '--slug', 'z', '--json']);
  check('CS4b workspace kiểu pre-1.14 (chỉ contract): exit 0, bỏ qua êm', () =>
    { assert.equal(b.code, 0); assert.deepEqual(JSON.parse(b.out).claims, []); });
  const c = run(['--root', path.join(root, 'khong-ton-tai'), '--slug', 'z']);
  check('CS4c root sai: exit 2 + thông điệp', () =>
    { assert.equal(c.code, 2); assert.match(c.err, /root not found/); });
  const d = run(['--root', root]);
  check('CS4d thiếu --slug: exit 2 + usage (KHÔNG giả dạng corpus rỗng)', () =>
    { assert.equal(d.code, 2); assert.match(d.err, /^usage: claim-scan --root <dir> --slug <slug>/); });
  rmSync(root, { recursive: true, force: true });
}
```

- [ ] **Step 2: Chạy** `node tests/workflows/claim-scan.test.mjs` — Expected: mọi CS2/CS4 pass với code Task 1 (đã có nhánh); case nào đỏ thì sửa đúng nhánh đó trong `claim-scan.mjs` (không nới thông điệp).
- [ ] **Step 3: Commit.** `git commit -am "test(claim-scan): CS2 hỏng-từng-phần skip-loud cả 2 nguồn + CS4 usage nổ to (E2, E4 — fix gap-probe P1, P2-2)"`

---

### Task 3: Exclude-self, dedupe, sort, cap, truncate (E3, E5)

**Files:** Modify `tests/workflows/claim-scan.test.mjs` (+ `claim-scan.mjs` nếu lộ lỗi)
**Phục vụ evals:** E3, E5 · **independent:** false

- [ ] **Step 1: Thêm test CS3 + CS5:**

```js
// ---- CS3: exclude-self có đối chứng dương ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs3-'));
  mkWorkspace(root, 'self-x', { ledger: [ledgerLine('d-20260720T110000Z-30', 'fix')] });
  mkWorkspace(root, 'other-y', { ledger: [ledgerLine('d-20260720T110001Z-31', 'fix')] });
  const asX = JSON.parse(run(['--root', root, '--slug', 'self-x', '--json']).out).claims.map(c => c.id);
  const asZ = JSON.parse(run(['--root', root, '--slug', 'nobody', '--json']).out).claims.map(c => c.id);
  check('CS3 --slug self-x: claim của self-x VẮNG, của other-y có', () =>
    { assert.ok(!asX.includes('d-20260720T110000Z-30')); assert.ok(asX.includes('d-20260720T110001Z-31')); });
  check('CS3 đối chứng dương: --slug khác thì claim self-x CÓ mặt', () =>
    assert.ok(asZ.includes('d-20260720T110000Z-30')));
  rmSync(root, { recursive: true, force: true });
}
// ---- CS5: sort sev→recency, cap 10, truncate 250, không trùng id ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs5-'));
  // 12 ledger claim at tăng dần + 2 finding P0/P1 → 14 ứng viên
  const led = Array.from({ length: 12 }, (_, i) =>
    ledgerLine(`d-20260701T0000${String(i).padStart(2, '0')}Z-5${i}`, 'fix',
      { at: `2026-07-0${(i % 9) + 1}T00:00:0${i % 10}Z`, decision: 'x'.repeat(300) }));
  mkWorkspace(root, 'many', { ledger: led });
  mkWorkspace(root, 'sev', { probe: gapProbe('2026-07-28T00:00:00Z', 'findings',
    [row('P0', 's0'), row('P1', 's1')]) });
  const claims = JSON.parse(run(['--root', root, '--slug', 'z', '--json']).out).claims;
  check('CS5 cap đúng 10 (ứng viên 14 — claim 11+ bị suppress)', () => assert.equal(claims.length, 10));
  check('CS5 sort: P0 rồi P1 đứng đầu, phần còn lại recency giảm dần', () => {
    assert.equal(claims[0].id, 'sev#F1'); assert.equal(claims[1].id, 'sev#F2');
    const rest = claims.slice(2).map(c => c.at);
    assert.deepEqual(rest, [...rest].sort().reverse()); });
  check('CS5 truncate 250 + "…" và không id trùng', () => {
    const long = claims.find(c => c.claim.startsWith('xxx'));
    assert.equal(long.claim.length, 251); assert.ok(long.claim.endsWith('…'));
    assert.equal(new Set(claims.map(c => c.id)).size, claims.length); });
  rmSync(root, { recursive: true, force: true });
}
```

- [ ] **Step 2: Chạy + sửa nếu đỏ.** `node tests/workflows/claim-scan.test.mjs` — Expected: pass.
- [ ] **Step 3: Commit.** `git commit -am "test(claim-scan): CS3 exclude-self + CS5 sort/cap/truncate (E3, E5)"`

---

### Task 4: Schema đủ trường + id regex + poison nguồn V2 + markdown (E6, E13)

**Files:** Modify `tests/workflows/claim-scan.test.mjs`
**Phục vụ evals:** E6, E13 · **independent:** false

- [ ] **Step 1: Thêm test CS6 + CS10:**

```js
// ---- CS6: schema 10 trường + id đúng khuôn regex đo lường ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs6-'));
  mkWorkspace(root, 'sch', { ledger: [ledgerLine('d-20260720T120000Z-60', 'fix', { serves: ['AC-4'] })],
    probe: gapProbe('2026-07-25T00:00:00Z', 'findings', [row('P1', 'sc')]) });
  const claims = JSON.parse(run(['--root', root, '--slug', 'z', '--json']).out).claims;
  const ID_RE = /^(d-[0-9TZ]+-[0-9]+|[a-z0-9-]+#F[0-9]+)$/;
  check('CS6 đủ 10 trường mọi claim', () => claims.forEach(c =>
    ['id','source','slug','kind','stage','sev','at','claim','lesson','pointer']
      .forEach(k => assert.ok(k in c, `${c.id} thiếu ${k}`))));
  check('CS6 id khớp regex đo lường + serves giữ nguyên', () => {
    claims.forEach(c => assert.match(c.id, ID_RE));
    assert.deepEqual(claims.find(c => c.id === 'd-20260720T120000Z-60').serves, ['AC-4']); });
  check('CS6 meta: regex còn sống — id sai khuôn phải trượt regex', () =>
    assert.doesNotMatch('D-XYZ#bogus', ID_RE));
  rmSync(root, { recursive: true, force: true });
}
// ---- CS10: KHÔNG đọc nguồn V2 (poison marker) — đối chứng dương ở ledger ----
{
  const root = mkdtempSync(path.join(tmpdir(), 'cs10-'));
  const POISON = 'POISON-MARKER-9f3a';
  mkWorkspace(root, 'v2src', { ledger: [ledgerLine('d-20260720T130000Z-70', 'fix', { decision: `has ${POISON}` })] });
  writeFileSync(path.join(root, '_acceptance', 'v2src', 'review-findings.md'), `# RF\n- ${POISON}-rf\n`);
  writeFileSync(path.join(root, '_acceptance', 'v2src', 'run-log.jsonl'), JSON.stringify({ evalId: `${POISON}-rl` }) + '\n');
  const r = run(['--root', root, '--slug', 'z', '--json']);
  check('CS10 marker trong review-findings/run-log VẮNG; trong ledger CÓ (đối chứng dương)', () => {
    assert.ok(!r.out.includes(`${POISON}-rf`) && !r.out.includes(`${POISON}-rl`));
    assert.ok(r.out.includes(`has ${POISON}`)); });
  check('CS10 markdown mode: bullet mang [id] để cite', () => {
    const md = run(['--root', root, '--slug', 'z']);
    assert.match(md.out, /^## Bài học từ feature trước \(advisory\)/m);
    assert.match(md.out, /- \[d-20260720T130000Z-70\] \(v2src/); });
  rmSync(root, { recursive: true, force: true });
}
```

- [ ] **Step 2: Chạy.** Expected: pass (scanner Task 1 chỉ đọc 2 đường dẫn cố định). **Step 3: Commit.** `git commit -am "test(claim-scan): CS6 schema+regex sống, CS10 poison chứng minh không đọc nguồn V2 (E6, E13 — fix gap-probe P2-1)"`

---

### Task 5: Smoke corpus thật (E9)

**Files:** Modify `tests/workflows/claim-scan.test.mjs`
**Phục vụ evals:** E9 · **independent:** false

- [ ] **Step 1: Thêm test CS9:**

```js
// ---- CS9: smoke trên corpus thật của repo (assert khoảng, không ghim số) ----
{
  const repoRoot = path.join(HERE, '..', '..');
  const t0 = Date.now();
  const r = run(['--root', repoRoot, '--slug', 'cross-feature-claim-index', '--json']);
  const dt = Date.now() - t0;
  check('CS9 corpus thật: exit 0, 1..10 claim, có id d-… và id #F, <5s', () => {
    assert.equal(r.code, 0);
    const ids = JSON.parse(r.out).claims.map(c => c.id);
    assert.ok(ids.length >= 1 && ids.length <= 10, `được ${ids.length}`);
    assert.ok(ids.some(i => i.startsWith('d-')), 'thiếu id ledger');
    assert.ok(ids.some(i => /#F\d+$/.test(i)), 'thiếu id gap-probe');
    assert.ok(dt < 5000, `${dt}ms`); });
}
```

- [ ] **Step 2: Chạy cả suite.** `bash tests/workflows/run-tests.sh` — Expected: all passed. **Step 3: Commit.** `git commit -am "test(claim-scan): CS9 smoke corpus thật 5 slug (E9)"`

---

### Task 6: Tích hợp SKILL.md S1#7 + prompt ý (7) + test văn bản (E7, E8)

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (mục S1#7) · Create `tests/workflows/skill-claims.test.mjs`
**Phục vụ evals:** E7, E8 · **independent:** true (file khác hẳn Task 2–5; chỉ tiêu thụ CLI contract của Task 1)
**Interfaces — Consumes:** CLI `claim-scan.mjs --root --slug` (Task 1), thông điệp exit/empty.

- [ ] **Step 1: Viết test CS7/CS8 (fail trước)** — `tests/workflows/skill-claims.test.mjs`:

```js
// SKILL.md là VẬT ĐƯỢC GIAO của tích hợp S1#7 — assert 4 mệnh đề + 3 ràng
// buộc prompt, kèm đối chứng đột biến (xoá mệnh đề → detector phải đỏ).
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL = readFileSync(path.join(HERE, '..', '..', 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const CLAUSES = [
  [/claim-scan\.mjs.*--slug/s, 'chạy claim-scan trước probe'],
  [/input thứ 5/, 'truyền input thứ 5 khi có claim'],
  [/corpus rỗng.*KHÔNG truyền/s, 'không truyền khi corpus rỗng'],
  [/claims_input: failed.*(vẫn chạy|4 input)/s, 'scan-fail: cờ + probe vẫn chạy'],
];
const PROMPT_RULES = [
  [/ADVISORY/i, 'claims là advisory'],
  [/không.*lật.*(seal|descope)/is, 'không lật seal/descope'],
  [/cite.*\[<id>\].*nguyên văn/s, 'cite [<id>] nguyên văn'],
];
for (const [re, name] of CLAUSES) check(`CS7 SKILL có mệnh đề: ${name}`, () => assert.match(SKILL, re));
for (const [re, name] of PROMPT_RULES) check(`CS8 prompt có ràng buộc: ${name}`, () => assert.match(SKILL, re));
check('CS7/8 đối chứng đột biến: xoá đoạn claims khỏi bản sao → detector đỏ', () => {
  const mutated = SKILL.replace(/claims_input: failed/g, '').replace(/input thứ 5/g, '').replace(/ADVISORY/gi, '');
  assert.ok([...CLAUSES, ...PROMPT_RULES].some(([re]) => !re.test(mutated)), 'detector không phân biệt được bản bị xoá');
});
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Chạy fail.** `node tests/workflows/skill-claims.test.mjs` — Expected: FAIL các mệnh đề (SKILL chưa sửa).
- [ ] **Step 3: Sửa SKILL.md S1#7.** Trong bước 7 của S1, NGAY TRƯỚC câu "dispatch 1 subagent fresh", chèn đoạn:

```markdown
   **Input thứ 5 — bài học xuyên feature (claim-scan):** trước khi dispatch, chạy `node "<WORKFLOWS_DIR>/../scripts/claim-scan.mjs" --root <repo-root> --slug <slug> > <scratch>/claims-<slug>.md`. Exit 0 và file CÓ nội dung → truyền file làm **input thứ 5** của critic. Corpus rỗng (file trống) → KHÔNG truyền input 5, không note (repo mới là bình thường). Scan exit ≠0 → probe VẪN chạy với 4 input như cũ, và khi ghi `gap-probe.md` thêm frontmatter `claims_input: failed` (1 dòng note trong gói Gate 1 — không chặn, không tính probe-failed).
```

   Và trong prompt 6 ý của critic, thêm ý (7):

```markdown
   (7) nếu có input thứ 5 (bài học từ feature trước): các claim là ADVISORY — không phải luật của feature này, KHÔNG dùng claim để lật quyết định đã seal/`descope` trong ledger của feature đang xét; finding nào dựa trên một claim PHẢI cite `[<id>]` nguyên văn (vd `[d-20260728T154945Z-3400]`, `[s4-scope-triage#F2]`) trong cột Thiếu gì hoặc Kịch bản fail — id là đường đo việc dùng lại bài học.
```

- [ ] **Step 4: Chạy pass.** `node tests/workflows/skill-claims.test.mjs` — Expected: `Results: 8 passed, 0 failed`.
- [ ] **Step 5: Commit.** `git add feature-loop/skills/feature-loop/SKILL.md tests/workflows/skill-claims.test.mjs && git commit -m "feat(feature-loop): gap-probe nhận input 5 từ claim-scan — advisory + cite id, fallback không chặn (E7, E8)"`

---

### Task 7: Bump version + sync mirror + re-pin literal (E12)

**Files:** Modify `feature-loop/.claude-plugin/plugin.json`, `codex/feature-loop-codex/.codex-plugin/plugin.json` (1.17.1 → 1.18.0), `tests/plugins/run-tests.sh` (re-pin 3 literal `"1.17.1"` → `"1.18.0"`), mirror `plugins/feature-loop-codex/**` (sinh bởi sync)
**Phục vụ evals:** E12 (+ giữ P04/P22/P30 xanh) · **independent:** false (sau cùng)
Ghi chú: codex bump CHỈ để giữ version-alignment của cặp manifest (P04/P22) — parity tính năng đã descope (`d-20260729T060345Z-23277`), KHÔNG sửa nội dung skill codex.

- [ ] **Step 1:** Sửa `"version": "1.17.1"` → `"1.18.0"` ở CẢ HAI manifest; sửa 3 literal `"1.17.1"` trong `tests/plugins/run-tests.sh` → `"1.18.0"`.
- [ ] **Step 2:** `bash scripts/sync-plugin-packages.sh` — Expected: `Synced Codex packages: … feature-loop-codex@1.18.0 …`.
- [ ] **Step 3:** Verify 4 suite: `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh` — Expected: cả 4 xanh. `bash scripts/sync-plugin-packages.sh --check` — Expected: exit 0.
- [ ] **Step 4: Commit.** `git add -A && git commit -m "chore(feature-loop): bump 1.18.0 + sync mirror + re-pin literal suite (E12)"`

---

## Self-review (đã chạy)

- **Spec coverage:** 12 AC ↔ Task: AC-1(T1), AC-2(T2), AC-3(T3), AC-4(T2), AC-5(T3), AC-6(T4), AC-7/8(T6), AC-9(T5), AC-12(T7); AC-10/11 là judgment — S4 chấm trên design doc + contract, không cần task code. ✓
- **Placeholder:** không TBD/`tương tự Task N`; mọi bước code có code. ✓
- **Type consistency:** `mkWorkspace/ledgerLine/gapProbe/row` định nghĩa Task 1, các task sau dùng đúng chữ ký; CLI flags thống nhất `--root/--slug/--json`. ✓
