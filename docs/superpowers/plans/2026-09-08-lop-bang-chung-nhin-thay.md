# Lớp bằng chứng nhìn-thấy (`layer: ui-observed`) — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hợp đồng có mặt người nhìn (ui/web/web-ui) phải có ≥1 eval `ui-check`; thiếu thì lint W8 · cờ vàng thẻ Cổng 1 · cờ thẻ Cổng 2 (đọc trên báo cáo) · NOTE pre-merge cùng kêu, có đường bỏ có tên, tất cả rút từ MỘT lib.

**Architecture:** Một lib thuần `lib/lop-nhin-thay.cjs` giữ enum/alias surfaces, vị từ «mặt người nhìn», vị từ «có ui-check», nhãn lạc chỗ, tiền tố descope, và một CLI `classify <dir>` in một dòng tab (mẫu `lib/gap-probe.cjs`). Bốn bộ đọc (lint · gate-card ×2 · pre-merge) và `nguong-o-co-hoi.cjs` gọi lib; bảy văn bản nghi thức chép luật và được đo bằng reader cắt phạm vi. Pre-merge CHỈ THÊM dòng.

**Tech Stack:** Node ≥ 18 CommonJS (lib/scripts), bash (pre-merge + tests/scripts), ESM test module theo nếp `tests/plugins/*.test.mjs` (`--ids`, `PASS: [ID]`), fixture code-sinh từ `CONTRACT-FRONTMATTER-TEMPLATE` qua `tests/fixtures/from-template.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-08-lop-bang-chung-nhin-thay-design.md` · hợp đồng `_acceptance/lop-bang-chung-nhin-thay/contract.md` (AC-1…AC-6) · evals E1…E6.

## Global Constraints

- Neo máy = `executor: ui-check`; `layer: ui-observed` là nhãn khai (D1). Eval ui-check không có `layer:` vẫn trả nghĩa vụ (đọc-cũ).
- Nghĩa vụ theo HỢP ĐỒNG (≥1), không theo AC (D2).
- Pre-merge in `NOTE`, không `VIOLATION`; NOTE mang `approved_at` và ngưỡng «2 hợp đồng … một mốc phát hành» (D3). Diff `scripts/pre-merge-check.sh` so `main` chỉ THÊM dòng (DV5).
- Enum surfaces: `api | cli | sdk | ui | mobile | docs | ci | config`; alias `web` → `ui`, `web-ui` → `ui` (D4). Mobile KHÔNG phải mặt người nhìn.
- Tiền tố descope: `bỏ ui-observed — ` (D5) — hằng `UI_OBSERVED_DESCOPE` ở lib, SKILL chép nguyên văn, test round-trip.
- Không đụng `evidence-page.js`, `hooks/`, `s4-args.mjs`, `acceptance-verify.js`. Không migrate hồ sơ cũ.
- MEASURE-BIRTH-CLAUSE: mọi ca mới có đối chứng dương + chiều đỏ ghim thông điệp trên cùng fixture; ca vắng-chuỗi phải kèm dấu hiệu quét dương (gap-probe F2).
- Lỗi lib/thiếu node ở pre-merge → NOTE «không kiểm được», exit không đổi.

---

### Task 1: `lib/lop-nhin-thay.cjs` + alias ở `nguong-o-co-hoi.cjs` + ca LNT1

**Files:**
- Create: `lib/lop-nhin-thay.cjs`
- Modify: `lib/nguong-o-co-hoi.cjs:77-82` (SURFACE_NGUOI_DUNG dùng alias từ lib mới)
- Modify: `skills/acceptance/references/contract-template.md` dòng `surfaces:` trong khối `CONTRACT-FRONTMATTER-TEMPLATE` (enum mở rộng — round-trip với lib)
- Create: `tests/plugins/lop-nhin-thay.test.mjs` (khung + LNT1)
- Modify: `tests/plugins/run-tests.sh` (cuối file: vòng `--ids` cho file ca mới, nếp DD/UX)

**Interfaces:**
- Produces (CommonJS):
  - `SURFACE_ENUM: string[]` = `['api','cli','sdk','ui','mobile','docs','ci','config']`
  - `SURFACE_ALIAS: Record<string,string>` = `{ web: 'ui', 'web-ui': 'ui' }`
  - `tokensOf(surfaces: string): string[]` — tách `[a, b]`/`a, b`, bỏ chú thích sau `#`, lower-case, trim
  - `laMatNguoiNhin(surfaces: string): boolean` — có token chuẩn hoá == `ui`
  - `tokenLa(surfaces: string): string[]` — token ∉ enum ∪ alias
  - `coUiObserved(evals: {id,executor,layer}[]): boolean` — ∃ executor === `ui-check`
  - `uiCheckIds(evals): string[]`
  - `nhanLacCho(evals): string[]` — id có `layer` lower == `ui-observed` và executor ≠ `ui-check`
  - `UI_OBSERVED_DESCOPE = 'bỏ ui-observed — '`
  - `descopeId(ledgerText: string): string|null` — dòng JSON `type:"descope"` với `decision.startsWith(UI_OBSERVED_DESCOPE)`; dòng hỏng bỏ qua
  - `classify(dir: string): { applicable, declared, descoped, approved_at, surfaces, reason }` — đọc `contract.md` + `evals.yaml` + `decisions.jsonl` trong `dir`; `evals.yaml` vắng → `reason: 'no-evals'`
  - CLI: `node lib/lop-nhin-thay.cjs classify <dir>` in **một dòng** `applicable\tdeclared\tdescoped_id\tapproved_at` (`0|1`, số, id hoặc `-`, ISO hoặc `-`); vắng evals → in `n-a\t-\t-\t-`
- Consumes: `lib/eval-yaml.cjs` `parseEvals(text, ['criterion','executor','layer'], fieldVal)` (chép `fieldVal` từ eval-coverage-lint để giữ nếp quote/comment).

- [ ] **Step 1: Viết ca LNT1 (đỏ trước)** — `tests/plugins/lop-nhin-thay.test.mjs`

```js
// tests/plugins/lop-nhin-thay.test.mjs — ca hồ sơ lop-bang-chung-nhin-thay (LNT1–LNT6).
//   LNT_CASES=LNT1 node tests/plugins/lop-nhin-thay.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fileFromTemplate } from '../fixtures/from-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const LIB = path.join(ROOT, 'lib', 'lop-nhin-thay.cjs');
const NG = path.join(ROOT, 'lib', 'nguong-o-co-hoi.cjs');
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
const require = createRequire(import.meta.url);

let failures = 0;
const ALL_IDS = ['LNT1', 'LNT3', 'LNT4', 'LNT6'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.LNT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'lnt-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const eq = (id, got, exp, what) => { if (JSON.stringify(got) !== JSON.stringify(exp)) fail(id, `${what}: got ${JSON.stringify(got)} expected ${JSON.stringify(exp)}`); };

// enum rút từ chú thích dòng `surfaces:` của khối khuôn — không literal
const enumFromTemplate = (tpl = readFileSync(CONTRACT_TPL, 'utf8')) => {
  const blk = tpl.match(/<!-- <<<CONTRACT-FRONTMATTER-TEMPLATE -->\n([\s\S]*?)<!-- CONTRACT-FRONTMATTER-TEMPLATE>>> -->/)[1];
  const line = blk.split('\n').find(l => /^surfaces:/.test(l));
  const m = line.match(/#\s*([a-z\-]+(?:\s*\|\s*[a-z\-]+)+)/);
  return m[1].split('|').map(s => s.trim());
};

if (want('LNT1')) {
  const id = 'LNT1'; const L = require(LIB); const N = require(NG);
  const truths = ['[ui]', '[web]', '[web-ui]', '[api, web]'];
  const falses = ['[api]', '[cli]', '[mobile]', '[api, mobile]'];
  for (const s of truths) eq(id, L.laMatNguoiNhin(s), true, `laMatNguoiNhin(${s})`);
  for (const s of falses) eq(id, L.laMatNguoiNhin(s), false, `laMatNguoiNhin(${s})`);
  eq(id, L.tokenLa('[ui, kiosk]  # chú thích web'), ['kiosk'], 'tokenLa bỏ chú thích');
  eq(id, L.coUiObserved([{ id: 'E1', executor: 'ui-check', layer: '' }]), true, 'coUiObserved đọc-cũ không nhãn');
  eq(id, L.coUiObserved([{ id: 'E1', executor: 'test', layer: 'ui-observed' }]), false, 'coUiObserved nhãn không thay executor');
  eq(id, L.nhanLacCho([{ id: 'E1', executor: 'test', layer: 'ui-observed' }, { id: 'E2', executor: 'ui-check', layer: 'ui-observed' }]), ['E1'], 'nhanLacCho');
  eq(id, L.SURFACE_ENUM, enumFromTemplate(), 'SURFACE_ENUM == khuôn');
  // chiều đỏ round-trip: bản sao khuôn bỏ `docs`
  const tplMut = readFileSync(CONTRACT_TPL, 'utf8').replace('| docs ', '| ');
  const enumMut = enumFromTemplate(tplMut);
  if (JSON.stringify(enumMut) === JSON.stringify(L.SURFACE_ENUM)) fail(id, 'mutant khuôn bỏ docs mà reader vẫn khớp');
  else if (!L.SURFACE_ENUM.filter(x => !enumMut.includes(x)).includes('docs')) fail(id, 'reader không nêu giá trị thiếu "docs"');
  // nguong-o-co-hoi nhận alias
  eq(id, N.coNguoiDungCuoi('[web]'), true, 'coNguoiDungCuoi([web])');
  eq(id, N.coNguoiDungCuoi('[web-ui]'), true, 'coNguoiDungCuoi([web-ui])');
  eq(id, N.coNguoiDungCuoi('[api]'), false, 'coNguoiDungCuoi([api])');
  // chiều đỏ có sẵn: bản tại main
  const t = tmp(); const old = spawnSync('git', ['-C', ROOT, 'show', 'main:lib/nguong-o-co-hoi.cjs'], { encoding: 'utf8' });
  if (old.status === 0) {
    mkdirSync(path.join(t, 'lib'), { recursive: true });
    cpSync(path.join(ROOT, 'lib', 'md-section.cjs'), path.join(t, 'lib', 'md-section.cjs'));
    writeFileSync(path.join(t, 'lib', 'nguong-o-co-hoi.cjs'), old.stdout);
    const NOld = require(path.join(t, 'lib', 'nguong-o-co-hoi.cjs'));
    eq(id, NOld.coNguoiDungCuoi('[web]'), false, 'bản main không nhận [web] (chiều đỏ có sẵn)');
  }
  // MUTANT MỘT-NGUỒN (F3): bản sao lib+scripts bỏ web khỏi alias → ba bộ đọc cùng đổi
  const m = tmp(); cpSync(path.join(ROOT, 'lib'), path.join(m, 'lib'), { recursive: true }); cpSync(path.join(ROOT, 'scripts'), path.join(m, 'scripts'), { recursive: true });
  const libMut = readFileSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), 'utf8').replace(/web:\s*'ui',\s*/, '');
  if (libMut === readFileSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), 'utf8')) fail(id, 'không tiêm được mutant alias');
  writeFileSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), libMut);
  const NM = require(path.join(m, 'lib', 'nguong-o-co-hoi.cjs'));
  eq(id, NM.coNguoiDungCuoi('[web]'), false, 'mutant: nguong-o-co-hoi mất web');
  const ws = tmp(); W(ws, '_acceptance/x/contract.md', fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE', { feature: 'x', slug: 'x', owner: 'o@x', risk_tier: 'T2', surfaces: 'web', status: 'draft' }, '\n# Acceptance Contract: x\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Coverage\n\n- Bỏ coverage-scan — test (entry d-0)\n\n## Out of scope\n\n- a\n'));
  W(ws, '_acceptance/x/evals.yaml', 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "exit 0"\n');
  const gcM = spawnSync('node', [path.join(m, 'scripts', 'gate-card.js'), '--root', ws, '--slug', 'x', '--extract'], { encoding: 'utf8' });
  eq(id, JSON.parse(gcM.stdout).ui_observed.applicable, false, 'mutant: gate-card [web] applicable');
  const gcG = spawnSync('node', [path.join(ROOT, 'scripts', 'gate-card.js'), '--root', ws, '--slug', 'x', '--extract'], { encoding: 'utf8' });
  eq(id, JSON.parse(gcG.stdout).ui_observed.applicable, true, 'lành: gate-card [web] applicable');
  const lintM = spawnSync('node', [path.join(m, 'scripts', 'eval-coverage-lint.js'), ws], { encoding: 'utf8' });
  if (/W8/.test(lintM.stdout)) fail(id, 'mutant: lint vẫn W8 cho [web]');
  const lintG = spawnSync('node', [path.join(ROOT, 'scripts', 'eval-coverage-lint.js'), ws], { encoding: 'utf8' });
  if (!/W8/.test(lintG.stdout)) fail(id, 'lành: lint không W8 cho [web]');
  if (failures === 0) pass(id, 'lib một nguồn: vị từ 8 giá trị, alias, round-trip khuôn, mutant ba bộ đọc');
}

process.exit(failures ? 1 : 0);
```

(LNT3/LNT4/LNT6 thêm ở Task 4/5/2 — cùng file, cùng khung `want(id)`.)

- [ ] **Step 2: Chạy ca → đỏ** — `LNT_CASES=LNT1 node tests/plugins/lop-nhin-thay.test.mjs` → Expected: lỗi `Cannot find module 'lib/lop-nhin-thay.cjs'`.

- [ ] **Step 3: Viết lib**

```js
// lib/lop-nhin-thay.cjs — LUẬT DUY NHẤT trả lời «hợp đồng này có MẶT NGƯỜI NHÌN không» và
// «đã có bằng chứng lớp nhìn-thấy chưa». Bốn bộ đọc (lint W8 · thẻ Cổng 1 · thẻ Cổng 2 ·
// pre-merge NOTE) và nguong-o-co-hoi.cjs gọi hàm ở đây — ai thêm bên đọc thứ năm thì GỌI,
// đừng chép regex (hồ sơ lop-bang-chung-nhin-thay, D4). Hàm THUẦN trừ classify/CLI.
'use strict';
const fs = require('fs');
const path = require('path');
const evalYaml = require('./eval-yaml.cjs');

// Enum phải BẰNG chú thích dòng `surfaces:` của CONTRACT-FRONTMATTER-TEMPLATE (ca LNT1 round-trip).
const SURFACE_ENUM = ['api', 'cli', 'sdk', 'ui', 'mobile', 'docs', 'ci', 'config'];
const SURFACE_ALIAS = { web: 'ui', 'web-ui': 'ui' };
const UI_OBSERVED_DESCOPE = 'bỏ ui-observed — ';

const stripComment = s => String(s || '').replace(/[ \t]+#.*$/, '').replace(/^#.*$/, '');
function tokensOf(surfaces) {
  return stripComment(surfaces).replace(/^\s*surfaces:\s*/i, '').replace(/[\[\]"']/g, '')
    .split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
}
const canon = t => SURFACE_ALIAS[t] || t;
const laMatNguoiNhin = surfaces => tokensOf(surfaces).some(t => canon(t) === 'ui');
const tokenLa = surfaces => tokensOf(surfaces).filter(t => !SURFACE_ENUM.includes(t) && !SURFACE_ALIAS[t]);

const ex = e => String(e.executor || '').trim().toLowerCase();
const ly = e => String(e.layer || '').trim().toLowerCase();
const uiCheckIds = evals => (evals || []).filter(e => ex(e) === 'ui-check').map(e => e.id);
const coUiObserved = evals => uiCheckIds(evals).length > 0;
const nhanLacCho = evals => (evals || []).filter(e => ly(e) === 'ui-observed' && ex(e) !== 'ui-check').map(e => e.id);

function fieldVal(raw) { // cùng nếp eval-coverage-lint: quote giữ nguyên, # ngoài quote là comment
  const s = raw.trim(); const q = s[0];
  if (q === '"' || q === "'") { const end = s.indexOf(q, 1); if (end > 0) return s.slice(1, end); }
  return s.replace(/[ \t]+#.*$/, '').trim();
}
const parseEvalsText = text => evalYaml.parseEvals(text, ['criterion', 'executor', 'layer'], fieldVal);

function descopeId(ledgerText) {
  for (const line of String(ledgerText || '').split('\n')) {
    try { const j = JSON.parse(line); if (j && j.type === 'descope' && String(j.decision || '').startsWith(UI_OBSERVED_DESCOPE)) return j.id || null; } catch (_) {}
  }
  return null;
}
const frontLine = (text, key) => { const m = String(text || '').match(/^---\n([\s\S]*?)\n---/); const fm = m ? m[1] : ''; const l = fm.split('\n').find(x => x.startsWith(key + ':')); return l ? l.slice(key.length + 1).trim() : ''; };

function classify(dir) {
  const rd = f => { try { return fs.readFileSync(path.join(dir, f), 'utf8'); } catch (_) { return null; } };
  const c = rd('contract.md'); const e = rd('evals.yaml'); const l = rd('decisions.jsonl');
  if (c == null) return { applicable: false, reason: 'no-contract' };
  const surfaces = frontLine(c, 'surfaces');
  const applicable = laMatNguoiNhin(surfaces);
  if (e == null) return { applicable, reason: 'no-evals', surfaces, approved_at: frontLine(c, 'approved_at') || '-' };
  const evals = parseEvalsText(e);
  return { applicable, declared: uiCheckIds(evals).length, lacCho: nhanLacCho(evals), descoped: descopeId(l), approved_at: frontLine(c, 'approved_at') || '-', surfaces, tokenLa: tokenLa(surfaces), reason: '' };
}

module.exports = { SURFACE_ENUM, SURFACE_ALIAS, UI_OBSERVED_DESCOPE, tokensOf, laMatNguoiNhin, tokenLa, uiCheckIds, coUiObserved, nhanLacCho, parseEvalsText, fieldVal, descopeId, classify };

if (require.main === module) { // CLI: classify <dir> → applicable\tdeclared\tdescoped\tapproved_at (mẫu lib/gap-probe.cjs)
  const [cmd, dir] = process.argv.slice(2);
  if (cmd !== 'classify' || !dir) { process.stderr.write('usage: lop-nhin-thay.cjs classify <dir>\n'); process.exit(2); }
  const r = classify(dir);
  if (r.reason === 'no-contract') process.exit(3);
  if (r.reason === 'no-evals') { process.stdout.write(`n-a\t-\t-\t${r.approved_at}\n`); process.exit(0); }
  process.stdout.write(`${r.applicable ? 1 : 0}\t${r.declared}\t${r.descoped || '-'}\t${r.approved_at}\n`);
}
```

- [ ] **Step 4: Alias ở `nguong-o-co-hoi.cjs`** — thay hai dòng 79–80:

```js
// Mặt có NGƯỜI DÙNG CUỐI — ui (kể cả alias web/web-ui, RÚT từ lib/lop-nhin-thay.cjs) hoặc mobile.
const LNT = require('./lop-nhin-thay.cjs');
const SURFACE_NGUOI_DUNG = /\b(ui|mobile)\b/i; // giữ tên xuất khẩu cho bên đọc cũ
const coNguoiDungCuoi = surfaces => LNT.laMatNguoiNhin(surfaces) || LNT.tokensOf(surfaces).includes('mobile');
```

- [ ] **Step 5: Khuôn** — `contract-template.md` dòng `surfaces:` trong khối: `# api | cli | sdk | ui | mobile | docs | ci | config — alias: web, web-ui → ui; ngăn cách bằng dấu phẩy`.

- [ ] **Step 6: Đăng ký vòng ca** — cuối `tests/plugins/run-tests.sh` (trước dòng tổng kết), theo nếp DD:

```bash
# ─── Hồ sơ lop-bang-chung-nhin-thay: LNT1..LNT6 (file ca riêng) ───────────────
_lnt_ids="$(node "$ROOT/tests/plugins/lop-nhin-thay.test.mjs" --ids)" || { echo "khong lay duoc danh sach ca LNT"; failures=$((failures+1)); _lnt_ids=""; }
for _lnt in $_lnt_ids; do
  run "ca lop nhin thay — $_lnt (ho so lop-bang-chung-nhin-thay)" \
    env LNT_CASES="$_lnt" node "$ROOT/tests/plugins/lop-nhin-thay.test.mjs"
done
```

- [ ] **Step 7: Chạy → xanh** — `LNT_CASES=LNT1 node tests/plugins/lop-nhin-thay.test.mjs` → `PASS: [LNT1]`. (Nhánh gate-card/lint trong mutant sẽ đỏ cho tới Task 3/4 — chạy lại LNT1 ở cuối Task 4.) Phá thử: đổi `web: 'ui'` thành `web: 'api'` trong lib → ca đỏ nêu `laMatNguoiNhin([web])`; hoàn nguyên.

- [ ] **Step 8: Commit** — `git add lib/lop-nhin-thay.cjs lib/nguong-o-co-hoi.cjs skills/acceptance/references/contract-template.md tests/plugins/lop-nhin-thay.test.mjs tests/plugins/run-tests.sh && git commit -m "feat(lib): lop-nhin-thay — một nguồn cho mặt người nhìn + alias web→ui (AC-1)"`.

Phục vụ: E1. `independent: false`.

---

### Task 2: Bảy văn bản nghi thức + ca LNT6

**Files:**
- Modify: `skills/acceptance/SKILL.md` Phase 2 (sau mục 2b, thêm 2c)
- Modify: `feature-loop/skills/feature-loop/SKILL.md` dòng S1#4 `evals.yaml` + prompt gap-probe S1#7 ý (4)
- Modify: `skills/acceptance/references/eval-executors.md` (section mới sau «Pairing mechanics — `(cross-layer)` criteria»)
- Modify: `CONTEXT.md` term **Surface** + **Layer**
- Modify: `commands/acceptance-init.md` 3b
- Modify: `tests/plugins/lop-nhin-thay.test.mjs` (LNT6)

**Interfaces:** Consumes `UI_OBSERVED_DESCOPE` từ Task 1 (chuỗi chép nguyên văn vào hai SKILL).

- [ ] **Step 1: Ca LNT6 (đỏ trước)** — thêm vào file ca:

```js
if (want('LNT6')) {
  const id = 'LNT6'; const L = require(LIB);
  const F = {
    acc: path.join(ROOT, 'skills', 'acceptance', 'SKILL.md'),
    fl: path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'),
    ex: path.join(ROOT, 'skills', 'acceptance', 'references', 'eval-executors.md'),
    ctx: path.join(ROOT, 'CONTEXT.md'),
    init: path.join(ROOT, 'commands', 'acceptance-init.md'),
  };
  const cut = (text, startRe, endRe) => { const s = text.search(startRe); if (s < 0) return ''; const rest = text.slice(s); const e = rest.slice(1).search(endRe); const out = e < 0 ? rest : rest.slice(0, e + 1); if (out.length > text.length * 0.6) throw new Error('phạm vi cắt quá rộng'); return out; };
  // (i)..(vii): mỗi mệnh đề = [tên, file, hàm đọc thân → boolean]
  const clauses = [
    ['i-acc-2c', F.acc, t => { const p2 = cut(t, /^## Phase 2/m, /^## Phase 3/m); return /layer: ui-observed/.test(p2) && /theo hợp đồng/.test(p2) && p2.includes(L.UI_OBSERVED_DESCOPE); }],
    ['ii-fl-evals', F.fl, t => { const s1 = cut(t, /^## S1 — DESIGN/m, /^## GATE 1/m); return /≥1 eval `ui-check`/.test(s1) && /mặt người nhìn mà không eval `ui-check`/.test(s1); }],
    ['iii-ex-section', F.ex, t => /^## Pairing mechanics — `layer: ui-observed`/m.test(t) && cut(t, /^## Pairing mechanics — `layer: ui-observed`/m, /^## /m).includes('ui-observed')],
    ['iv-ctx-terms', F.ctx, t => cut(t, /^\*\*Layer\*\*:/m, /^\*\*[^*]+\*\*:/m).includes('ui-observed') && cut(t, /^\*\*Surface\*\*:/m, /^\*\*[^*]+\*\*:/m).includes('web') ],
    ['vi-init-playwright', F.init, t => cut(t, /^3b\./m, /^3c\./m).includes('@playwright/cli')],
    ['vii-descope-roundtrip', F.fl, t => t.includes(L.UI_OBSERVED_DESCOPE) && readFileSync(F.acc, 'utf8').includes(L.UI_OBSERVED_DESCOPE)],
  ];
  const texts = Object.fromEntries(Object.entries(F).map(([k, p]) => [k, readFileSync(p, 'utf8')]));
  const run = (files) => clauses.filter(([, f, fn]) => !fn(files[f])).map(([n]) => n);
  const byPath = Object.fromEntries(Object.entries(F).map(([k, p]) => [p, texts[k]]));
  eq(id, run(byPath), [], 'bản lành: mọi mệnh đề đọc được');
  // chiều đỏ: gỡ từng mệnh đề trên bản sao
  const mutants = [
    ['i-acc-2c', F.acc, t => t.replace('layer: ui-observed', 'layer: xx')],
    ['ii-fl-evals', F.fl, t => t.replace('≥1 eval `ui-check`', '≥1 eval')],
    ['iii-ex-section', F.ex, t => t.replace(/^## Pairing mechanics — `layer: ui-observed`.*$/m, '## Gỡ')],
    ['iv-ctx-terms', F.ctx, t => t.replace('ui-observed', 'xx')],
    ['vi-init-playwright', F.init, t => t.replace('@playwright/cli', 'xx')],
    ['vii-descope-roundtrip', F.acc, t => t.split(L.UI_OBSERVED_DESCOPE).join('bỏ ui-observed: ')],
  ];
  for (const [name, file, mut] of mutants) {
    const copy = { ...byPath, [file]: mut(byPath[file]) };
    const red = run(copy);
    if (!red.includes(name)) fail(id, `mutant ${name} không làm reader đỏ đúng mệnh đề (đỏ: ${red.join(',') || 'không'})`);
  }
  if (failures === 0) pass(id, 'bảy văn bản nghi thức chép luật; gỡ từng mệnh đề → đỏ đúng tên');
}
```

(Mệnh đề (v) khuôn đã đo ở LNT1.)

- [ ] **Step 2: Chạy → đỏ** — `LNT_CASES=LNT6 node tests/plugins/lop-nhin-thay.test.mjs` → FAIL «bản lành: mọi mệnh đề».

- [ ] **Step 3: `skills/acceptance/SKILL.md`** — chèn sau mục 2b:

```
2c. **Lớp bằng chứng nhìn-thấy (`layer: ui-observed`, mặt người nhìn — mặc định bật).**
   Nếu `surfaces` của contract có `ui` (alias `web`, `web-ui`; KHÔNG tính `mobile`),
   evals.yaml PHẢI có ≥1 eval `executor: ui-check` — tính theo hợp đồng, không theo
   AC — và eval đó khai `layer: ui-observed`. Bằng chứng lớp mã (`test` vitest/DOM,
   `script` axe-core/design-gate) vẫn hợp lệ cho tiêu chí, nhưng KHÔNG trả nghĩa vụ
   này: nghĩa vụ là frame + `observed:` do hook giữ trên mọi block ui-check. Nhãn
   `layer: ui-observed` trên executor khác ui-check là lạc chỗ (lint W8). Bỏ nghĩa
   vụ (không dev server, hạ tầng chụp hỏng) PHẢI là entry `descope` bắt đầu đúng
   chuỗi `bỏ ui-observed — <lý do>` — thẻ Cổng 1 hiện dòng thông tin, ghi sau seal
   thì thẻ Cổng 2 hiện ở khối «CHƯA duyệt»; không có đường bỏ im lặng. Răng: lint
   W8 · cờ vàng thẻ Cổng 1 · NOTE pre-merge (chưa chặn; ngưỡng siết: 2 hợp đồng ký
   không frame trong một mốc phát hành).
```

- [ ] **Step 4: `feature-loop/skills/feature-loop/SKILL.md`** — (a) dòng S1#4 `evals.yaml`, sau «(ui-check một mình không bao giờ đủ cho criterion xuyên lớp)» thêm: «; surface mặt người nhìn (`ui`/`web`/`web-ui`, không tính `mobile`) → ≥1 eval `ui-check` khai `layer: ui-observed` THEO HỢP ĐỒNG — test/script cho UI không trả nghĩa vụ này; bỏ → entry `descope` AUTO-DRAFT bắt đầu đúng chuỗi `"bỏ ui-observed — <lý do 1 dòng>"` + impact "Cổng Bằng chứng không có frame — người ký đọc tên ca máy thay vì nhìn"». (b) prompt gap-probe ý (4), sau «chỉ có eval lớp UI (ui-check/judgment)» thêm: « · hợp đồng có mặt người nhìn mà không eval `ui-check` nào (bằng chứng lớp mã thay lớp nhìn-thấy)».

- [ ] **Step 5: `eval-executors.md`** — chèn section trước «## Mobile mechanics»:

```
## Pairing mechanics — `layer: ui-observed` (human-visible surfaces)

The mirror of the cross-layer rule. When the contract's `surfaces` include a
web UI (`ui`; aliases `web`, `web-ui`; NOT `mobile`), evals.yaml MUST carry
≥1 eval with `executor: ui-check` — per CONTRACT, not per criterion — and that
eval declares `layer: ui-observed`. Code-layer evidence (`test` component/DOM,
`script` axe-core/design-gate) stays valid for its criterion but never
discharges this obligation: the obligation is a saved frame + an `observed:`
line, which the write-time hook already enforces on every ui-check block. The
machine anchor is the executor; the label is for readers and the vacuous guard
(`layer: ui-observed` on a non-ui-check executor is lint W8). Opting out must be
a named ledger entry whose decision starts with `bỏ ui-observed — `. Teeth: lint
W8 · Gate-1 card flag · pre-merge NOTE (not a VIOLATION yet; tightening threshold:
two signed UI contracts without frames within one release).
```

- [ ] **Step 6: `CONTEXT.md`** — **Surface**: thêm câu «Alias máy đọc: `web`, `web-ui` → `ui` (một nguồn: `lib/lop-nhin-thay.cjs`).» **Layer**: đổi thành «Trường cấp eval (`layer: backend-effect` · `layer: ui-observed`) — tầng hệ thống mà evidence chạm tới. Hai luật cặp: criterion `(cross-layer)` phải có ≥1 eval backend-effect; hợp đồng có mặt người nhìn phải có ≥1 eval `ui-check` (khai `ui-observed`).»

- [ ] **Step 7: `acceptance-init.md` 3b** — thêm câu cuối: «Rẻ hơn khi máy đã có `@playwright/cli` (`npm i -g @playwright/cli`): `capture.ui` là một script 3 lệnh `playwright-cli open "$1" && playwright-cli screenshot --filename "$2" && playwright-cli close` — vẫn sống trong REPO, kit không ship browser.»

- [ ] **Step 8: Chạy → xanh** — `LNT_CASES=LNT6 …` → `PASS: [LNT6]`. Chạy `node scripts/eval-coverage-lint.js . --slug lop-bang-chung-nhin-thay` (W6 sạch).

- [ ] **Step 9: Commit** — `git add skills/acceptance/SKILL.md feature-loop/skills/feature-loop/SKILL.md skills/acceptance/references/eval-executors.md CONTEXT.md commands/acceptance-init.md tests/plugins/lop-nhin-thay.test.mjs && git commit -m "docs(luật): lớp nhìn-thấy ui-observed ở bảy văn bản nghi thức (AC-6)"`.

Phục vụ: E6. `independent: false`.

---

### Task 3: Lint W8 + ca L40–L51

**Files:**
- Modify: `scripts/eval-coverage-lint.js` (header W8, `lintFeature` thêm khối W8, `run` truyền `ledgerText`, chú giải cuối)
- Modify: `tests/scripts/run-tests.sh` (sau L37, trước khối pre-merge)

**Interfaces:** Consumes Task 1: `laMatNguoiNhin`, `tokenLa`, `coUiObserved`, `nhanLacCho`, `descopeId`, `UI_OBSERVED_DESCOPE`.

- [ ] **Step 1: Ca đỏ trước** — thêm vào `tests/scripts/run-tests.sh`:

```bash
# ─── W8 — lớp bằng chứng nhìn-thấy (hồ sơ lop-bang-chung-nhin-thay) ─────────
# Fixture code-sinh: mk_lnt <dir> <surfaces> <evals-body> [ledger-line]; contract luôn kèm
# AC-2 ngưỡng KHÔNG có eval âm để W1 nổ = DẤU HIỆU QUÉT dương cho các ca vắng W8 (gap-probe F2).
mk_lnt() { local d="$1/_acceptance/feat-lnt"; mkdir -p "$d"
  printf -- '---\nrisk_tier: T2\nstatus: approved\nsurfaces: [%s]\n---\n## Criteria\n- AC-1: Given user, When opens page, Then hero visible.\n- AC-2: Given user, When ≥3 opens trong 48h, Then fire hot.\n## Out of scope\n' "$2" > "$d/contract.md"
  printf -- 'evals:\n%s\n  - id: E9\n    criterion: AC-2\n    executor: test\n    expected: "fires hot"\n' "$3" > "$d/evals.yaml"
  [ -n "${4:-}" ] && printf '%s\n' "$4" > "$d/decisions.jsonl"; :; }
LNT_DESCOPE="$(node -e "process.stdout.write(require('$HERE/../../lib/lop-nhin-thay.cjs').UI_OBSERVED_DESCOPE)")"
EV_TEST='  - id: E1
    criterion: AC-1
    executor: test
    expected: "hero rendered (vitest)"'
EV_UI='  - id: E1
    criterion: AC-1
    executor: ui-check
    layer: ui-observed
    expected: "frame shows hero"'
w8() { node "$LINT" "$1" 2>&1; }
mk_lnt "$T/l40" ui "$EV_TEST"; o="$(w8 "$T/l40")"; r=$?
echo "L40 [ui] không ui-check -> W8 + chú giải, exit 1"; check L40 1 $r
case "$o" in *"W8 feat-lnt"*"không có eval"*"W8 ="*) echo "  PASS: L40-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L40-msg"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt "$T/l41" ui "$EV_UI"; echo "L41 [ui] có ui-check + layer ui-observed -> clean"; w8 "$T/l41" >/dev/null; check L41 0 $?
mk_lnt "$T/l42" web "$EV_TEST"; echo "L42 [web] alias -> W8"; o="$(w8 "$T/l42")"; case "$o" in *"W8 feat-lnt"*) echo "  PASS: L42"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L42"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt "$T/l42b" web-ui "$EV_TEST"; o="$(w8 "$T/l42b")"; case "$o" in *"W8 feat-lnt"*) echo "  PASS: L42b"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L42b"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
# vắng-W8 + dấu hiệu quét W1: hàm chung
no_w8() { local n="$1" dir="$2" o; o="$(w8 "$dir")"; case "$o" in *W8*) echo "  FAIL: $n (W8 bắn oan)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *W1*) echo "  PASS: $n"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: $n (thiếu dấu hiệu quét W1)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac; }
mk_lnt "$T/l43" mobile "$EV_TEST"; echo "L43 [mobile] -> không W8 (+W1 quét)"; no_w8 L43 "$T/l43"
mk_lnt "$T/l44" "api, cli" "$EV_TEST"; echo "L44 [api, cli] -> không W8 (+W1)"; no_w8 L44 "$T/l44"
mk_lnt "$T/l45" ui "$EV_UI
  - id: E2
    criterion: AC-1
    executor: test
    layer: ui-observed
    expected: \"dom ok\""; echo "L45 layer ui-observed trên test -> W8 lạc chỗ + id"; o="$(w8 "$T/l45")"; case "$o" in *"W8 feat-lnt"*"lạc chỗ"*E2*) echo "  PASS: L45"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L45"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt "$T/l46" ui '  - id: E1
    criterion: AC-1
    executor: ui-check
    expected: "frame shows hero"'; echo "L46 ui-check không layer (đọc-cũ) -> không W8"; no_w8 L46 "$T/l46"
mk_lnt "$T/l47" "ui, kiosk" "$EV_UI"; echo "L47 token lạ kiosk -> W8 nêu token"; o="$(w8 "$T/l47")"; case "$o" in *"W8 feat-lnt"*kiosk*) echo "  PASS: L47"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L47"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "L48 cây thật của kit -> 0 dòng W8 + có dấu hiệu quét"; o="$(node "$LINT" "$HERE/../.." 2>&1)"; case "$o" in *W8*) echo "  FAIL: L48 (W8 trên cây thật)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *"no coverage gaps"*|*W1*|*W3*|*W6*|*W7*) echo "  PASS: L48"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L48 (không dấu hiệu quét)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt "$T/l49" ui "$EV_TEST" "{\"id\":\"d-1\",\"type\":\"descope\",\"decision\":\"${LNT_DESCOPE}hạ tầng chụp hỏng\"}"; echo "L49 descope đúng tiền tố -> không W8 nghĩa vụ"; no_w8 L49 "$T/l49"
mk_lnt "$T/l50" ui "$EV_TEST" '{"id":"d-1","type":"descope","decision":"bỏ ui-observed: hỏng"}'; echo "L50 tiền tố dấu hai chấm -> W8"; o="$(w8 "$T/l50")"; case "$o" in *"W8 feat-lnt"*) echo "  PASS: L50"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L50"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
echo "L51 --files (không sổ) -> W8"; o="$(node "$LINT" --files "$T/l49/_acceptance/feat-lnt/contract.md" "$T/l49/_acceptance/feat-lnt/evals.yaml" 2>&1)"; case "$o" in *W8*) echo "  PASS: L51"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: L51"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
# chiều đỏ của LỚP dấu-hiệu-quét: fixture ghi sai đường → no_w8 phải ĐỎ (thiếu W1)
mkdir -p "$T/l52/_acceptance"; printf 'x' > "$T/l52/_acceptance/feat-lnt"   # file thay vì thư mục
o="$(w8 "$T/l52")"; case "$o" in *W1*) echo "  FAIL: L52 (fixture sai đường mà vẫn có dấu hiệu quét)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) echo "  PASS: L52 (lớp dấu-hiệu-quét phân biệt được fixture hỏng)"; PASS_COUNT=$((PASS_COUNT+1)) ;; esac
```

- [ ] **Step 2: Chạy → đỏ** — `bash tests/scripts/run-tests.sh 2>&1 | grep -E "L4[0-9]|L5[0-2]"` → L40/L42/L45/L47/L50/L51 FAIL.

- [ ] **Step 3: Sửa lint** — (a) header thêm dòng `W8  a contract whose surfaces include a human-visible UI (ui; aliases web/web-ui; not mobile) but evals.yaml carries NO executor: ui-check eval — code-layer evidence for a surface a human looks at; also fires for layer: ui-observed on a non-ui-check executor (misplaced label) and for surface tokens outside the enum. Silent when decisions.jsonl carries a named descope (prefix from lib/lop-nhin-thay.cjs).` (b) `let lnt = null; try { lnt = require(path.join(__dirname, '..', 'lib', 'lop-nhin-thay.cjs')); } catch (_) {}`. (c) `lintFeature(slug, contractText, evalsText, glossary, ledgerText)` thêm sau W5:

```js
  // W8 — lớp bằng chứng nhìn-thấy (gương của W4): hợp đồng có mặt người nhìn
  // phải có ≥1 eval executor: ui-check (nghĩa vụ THEO HỢP ĐỒNG). Vị từ + alias
  // + tiền tố descope RÚT từ lib/lop-nhin-thay.cjs — một nguồn cho bốn bộ đọc.
  if (lnt) {
    const surf = surfacesLine.replace(/^surfaces:\s*/i, '');
    const la = lnt.tokenLa(surf);
    if (la.length) warns.push(`[${slug}] W8 surfaces carry token(s) outside the enum: ${la.join(', ')} — canonical values are ${lnt.SURFACE_ENUM.join(' | ')} (aliases web, web-ui → ui); restate so every reader classifies the surface the same way.`);
    const lac = lnt.nhanLacCho(evals);
    if (lac.length) warns.push(`[${slug}] W8 ${lac.join(', ')} declare(s) layer: ui-observed on a non-ui-check executor — nhãn lạc chỗ: chỉ executor ui-check mới sinh frame + observed; bỏ nhãn hoặc đổi executor.`);
    if (lnt.laMatNguoiNhin(surf) && !lnt.coUiObserved(evals) && !lnt.descopeId(ledgerText)) {
      warns.push(`[${slug}] W8 surfaces include a human-visible UI (${surf}) but evals.yaml có KHÔNG có eval executor: ui-check — bằng chứng lớp mã thay lớp nhìn-thấy; thêm ≥1 ui-check (layer: ui-observed) theo hợp đồng, hoặc ghi entry descope "${lnt.UI_OBSERVED_DESCOPE}<lý do>".`);
    }
  }
```

  `parseEvals` giữ nguyên fields (`executor`,`layer` đã có). Trong `run`: chế độ gốc kho đọc thêm `readSafe(path.join(acc, slug, 'decisions.jsonl'))` truyền làm tham số thứ 5; `--files` truyền `null`. Chú giải cuối thêm `; W8 = a human-visible surface (ui/web/web-ui) needs ≥1 executor: ui-check eval per contract (label layer: ui-observed), or a named descope "bỏ ui-observed — …"`.

  Câu thông điệp phải chứa đúng cụm «không có eval» (ca L40 ghim) — viết: `…but evals.yaml không có eval executor: ui-check…` (bỏ chữ «có KHÔNG» thừa ở đoạn trên).

- [ ] **Step 4: Chạy → xanh** — `bash tests/scripts/run-tests.sh 2>&1 | grep -E "L4[0-9]|L5[0-2]|FAIL"`. Phá thử: đổi `!lnt.coUiObserved(evals)` thành `false` → L40 đỏ; hoàn nguyên. Chạy cả suite scripts (không hồi quy L01–L37, PM*).

- [ ] **Step 5: Commit** — `git add scripts/eval-coverage-lint.js tests/scripts/run-tests.sh && git commit -m "feat(lint): W8 lớp bằng chứng nhìn-thấy — surface ui/web không ui-check, nhãn lạc chỗ, token lạ, descope có tên (AC-2)"`.

Phục vụ: E2. `independent: false` (đụng `run-tests.sh` chung với Task 6).

---

### Task 4: Thẻ Cổng 1 — cờ + `--extract ui_observed` + ca LNT3

**Files:**
- Modify: `scripts/gate-card.js` (khối Gate 1: sau đoạn `duong_do`, trước `if (EXTRACT)` dòng ~578; flags dòng ~637)
- Modify: `tests/plugins/lop-nhin-thay.test.mjs` (LNT3)

**Interfaces:** Produces trong extract Gate 1: `ui_observed: { applicable, present, declared, descoped, token_la }`. Hằng chuỗi cờ: `const UI_OBS_FLAG_WARN = 'Chưa có bằng chứng lớp nhìn-thấy'` và `const UI_OBS_FLAG_INFO = 'Đã bỏ bằng chứng lớp nhìn-thấy theo'` (test rút từ nguồn bằng regex như DD).

- [ ] **Step 1: Ca LNT3 (đỏ trước)**

```js
if (want('LNT3')) {
  const id = 'LNT3'; const L = require(LIB);
  const gcSrc = readFileSync(path.join(ROOT, 'scripts', 'gate-card.js'), 'utf8');
  const pick = (re, w) => { const m = gcSrc.match(re); if (!m) throw new Error('gate-card.js không khai ' + w); return m[1]; };
  const WARN = pick(/UI_OBS_FLAG_WARN = '([^']+)'/, 'UI_OBS_FLAG_WARN');
  const INFO = pick(/UI_OBS_FLAG_INFO = '([^']+)'/, 'UI_OBS_FLAG_INFO');
  const ws = (surfaces, evalsBody, ledger) => { const r = tmp();
    W(r, '_acceptance/x/contract.md', fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE', { feature: 'x', slug: 'x', owner: 'o@x', risk_tier: 'T2', surfaces, status: 'draft' }, '\n# Acceptance Contract: x\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Coverage\n\n- Bỏ coverage-scan — test (entry d-0)\n\n## Out of scope\n\n- a\n'));
    W(r, '_acceptance/x/evals.yaml', 'evals:\n' + evalsBody); if (ledger) W(r, '_acceptance/x/decisions.jsonl', ledger); return r; };
  const EV_T = '  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n';
  const EV_U = '  - id: E1\n    criterion: AC-1\n    executor: ui-check\n    layer: ui-observed\n    expected: "x"\n';
  const gc = (r, ...a) => spawnSync('node', [path.join(ROOT, 'scripts', 'gate-card.js'), '--root', r, '--slug', 'x', ...a], { encoding: 'utf8' });
  const X = r => JSON.parse(gc(r, '--extract').stdout).ui_observed;
  const H = r => gc(r).stdout;
  let r = ws('ui', EV_T); eq(id, X(r), { applicable: true, present: false, declared: 0, descoped: null, token_la: [] }, '(a) extract'); if (!H(r).includes(WARN)) fail(id, '(a) HTML thiếu cờ fwarn ' + WARN);
  r = ws('ui', EV_T, `{"id":"d-9","type":"descope","decision":"${L.UI_OBSERVED_DESCOPE}hỏng chụp"}\n`); eq(id, X(r).descoped, 'd-9', '(b) descoped'); const hb = H(r); if (!hb.includes(INFO) || !hb.includes('d-9') || hb.includes(WARN)) fail(id, '(b) cờ finfo nêu id, không còn fwarn');
  r = ws('ui', EV_U); eq(id, X(r).present, true, '(c) present'); if (H(r).includes(WARN)) fail(id, '(c) có ui-check mà vẫn cờ');
  r = ws('api', EV_T); eq(id, X(r).applicable, false, '(d) api'); if (H(r).includes(WARN)) fail(id, '(d) api mà cờ');
  r = ws('mobile', EV_T); eq(id, X(r).applicable, false, '(e) mobile');
  r = ws('web', EV_T); eq(id, X(r).applicable, true, '(f) web alias');
  r = ws('ui', EV_T, '{"id":"d-9","type":"descope","decision":"bỏ ui-observed: hỏng"}\n'); eq(id, X(r).descoped, null, 'seam dấu hai chấm'); if (!H(r).includes(WARN)) fail(id, 'seam: vẫn phải fwarn');
  if (failures === 0) pass(id, 'thẻ Cổng 1: cờ + extract ui_observed sáu nhánh + seam');
}
```

- [ ] **Step 2: Chạy → đỏ** — `LNT_CASES=LNT3 …` → throw «gate-card.js không khai UI_OBS_FLAG_WARN».

- [ ] **Step 3: Sửa gate-card (Gate 1)** — sau khối `duong_do` (trước `if (EXTRACT)` Gate 1):

```js
  // ---- lớp bằng chứng nhìn-thấy (hồ sơ lop-bang-chung-nhin-thay) — một nguồn: lib/lop-nhin-thay.cjs ----
  const UI_OBS_FLAG_WARN = 'Chưa có bằng chứng lớp nhìn-thấy';
  const UI_OBS_FLAG_INFO = 'Đã bỏ bằng chứng lớp nhìn-thấy theo';
  let LNT = null; try { LNT = require(path.join(__dirname, '..', 'lib', 'lop-nhin-thay.cjs')); } catch (_) {}
  const uo = LNT ? LNT.classify(dir) : { applicable: false, reason: 'no-lib' };
  const uiObserved = { applicable: !!uo.applicable, present: uo.reason ? false : uo.declared > 0, declared: uo.declared || 0, descoped: uo.descoped || null, token_la: uo.tokenLa || [] };
```
  Trong JSON `--extract` Gate 1 thêm `ui_observed: uiObserved`. Trong flags (cạnh cờ `duong_do`):
```js
  if (uiObserved.applicable && !uiObserved.present) {
    if (uiObserved.descoped) flags.push(['finfo', `${UI_OBS_FLAG_INFO} ${esc(uiObserved.descoped)} — Cổng Bằng chứng sẽ không có frame; quyết định chủ động, có dấu vết.`]);
    else flags.push(['fwarn', `${UI_OBS_FLAG_WARN}: hợp đồng có mặt người nhìn mà không eval nào nhìn màn hình (ui-check) — người ký Cổng Bằng chứng sẽ chỉ đọc tên ca máy. Thêm một eval ui-check (layer: ui-observed), hoặc ghi entry descope "${esc(LNT ? LNT.UI_OBSERVED_DESCOPE : 'bỏ ui-observed — ')}<lý do>" rồi hãy duyệt.`]);
  }
  if (uiObserved.token_la.length) flags.push(['fwarn', `Surface ghi chữ ngoài từ vựng (${esc(uiObserved.token_la.join(', '))}) — các bộ đọc có thể xếp hồ sơ khác nhau; dùng ui · web · api · cli · sdk · mobile · docs · ci · config.`]);
  if (!LNT) flags.push(['fwarn', 'Thẻ không đọc được lib/lop-nhin-thay.cjs — chưa kiểm được bằng chứng lớp nhìn-thấy.']);
```

- [ ] **Step 4: Chạy → xanh** — LNT3 PASS; chạy lại LNT1 (nhánh mutant gate-card nay đo được). Phá thử: đổi `uo.declared > 0` thành `true` → LNT3 (a) đỏ; hoàn nguyên. Chạy `bash tests/plugins/run-tests.sh` (không hồi quy P-cases thẻ Cổng 1, đặc biệt P147 khoá card-plain — không thêm key mới).

- [ ] **Step 5: Commit** — `git add scripts/gate-card.js tests/plugins/lop-nhin-thay.test.mjs && git commit -m "feat(gate-card): cờ lớp nhìn-thấy ở thẻ Cổng 1 + extract ui_observed (AC-3)"`.

Phục vụ: E3. `independent: false`.

---

### Task 5: Thẻ Cổng 2 — `present` đọc trên báo cáo + ca LNT4

**Files:**
- Modify: `scripts/gate-card.js` (khối Gate 2: sau `const flags = []` ~dòng 938; JSON `--extract` Gate 2 ~dòng 829)
- Modify: `tests/plugins/lop-nhin-thay.test.mjs` (LNT4)

**Interfaces:** Produces extract Gate 2 `ui_observed: { applicable, present, declared, passed, descoped }`; hằng `UI_OBS_G2_NONE = 'Bằng chứng lớp nhìn-thấy: KHÔNG có'`, `UI_OBS_G2_OK = 'Bằng chứng lớp nhìn-thấy:'` (+ «N eval ui-check đạt»). Consumes: `evid[id]` (block báo cáo: `exit_code`, `screenshot`) đã parse ở dòng ~681–723; `decsProvisional`.

- [ ] **Step 1: Ca LNT4 (đỏ trước)** — dựng báo cáo từ `evidence-report-template.md` (dùng `fileFromTemplate(REPORT_TPL, 'EVIDENCE-...')` nếu khuôn có khối marker; không có thì viết body tối thiểu theo khuôn `## Evidence` như `mk_xl` của tests/scripts):

```js
if (want('LNT4')) {
  const id = 'LNT4'; const L = require(LIB);
  const gcSrc = readFileSync(path.join(ROOT, 'scripts', 'gate-card.js'), 'utf8');
  const pick = (re, w) => { const m = gcSrc.match(re); if (!m) throw new Error('gate-card.js không khai ' + w); return m[1]; };
  const NONE = pick(/UI_OBS_G2_NONE = '([^']+)'/, 'UI_OBS_G2_NONE'); const OK = pick(/UI_OBS_G2_OK = '([^']+)'/, 'UI_OBS_G2_OK');
  const report = (blocks) => `---\nschema_version: 2\nfeature_slug: x\nverdict: PASS\nverified_commit: ${'a'.repeat(40)}\nenforcement_mode: enforced\nbypass_used: false\n---\n\n# Evidence Report: x\n\n## Evidence\n${blocks}\n## Known limits\n\n(none)\n\n## Ngoài hợp đồng\n\n(none)\n`;
  const blkPass = (e, shot) => `- eval: ${e}\n  run_id: x-${e}-001\n  exit_code: 0\n  verifier: scripts/x.sh\n  verified_at: 2026-09-08T00:00:00Z\n${shot ? `  screenshot: evidence/${e}-step1.png\n  observed: |\n    frame shows the hero fully rendered\n` : ''}`;
  const blkFail = e => `- eval: ${e}\n  run_id: x-${e}-001\n  exit_code: 4\n  verifier: scripts/x.sh\n  verified_at: 2026-09-08T00:00:00Z\n`;
  const ws = (surfaces, evalsBody, blocks, ledger) => { const r = tmp();
    W(r, '_acceptance/x/contract.md', fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE', { feature: 'x', slug: 'x', owner: 'o@x', risk_tier: 'T2', surfaces, status: 'verified' }, '\n# Acceptance Contract: x\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Coverage\n\n- Bỏ coverage-scan — test (entry d-0)\n\n## Out of scope\n\n- a\n').replace('approved_by:', 'approved_by: Manh').replace('approved_at:', 'approved_at: 2026-09-01T00:00:00Z'));
    W(r, '_acceptance/x/evals.yaml', 'evals:\n' + evalsBody); W(r, '_acceptance/x/evidence-report.md', report(blocks)); W(r, '_acceptance/x/run-log.jsonl', ''); if (ledger) W(r, '_acceptance/x/decisions.jsonl', ledger); return r; };
  const EV = '  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n  - id: E10\n    criterion: AC-1\n    executor: ui-check\n    layer: ui-observed\n    expected: "frame"\n';
  const gc = (r, ...a) => spawnSync('node', [path.join(ROOT, 'scripts', 'gate-card.js'), '--root', r, '--slug', 'x', ...a], { encoding: 'utf8' });
  const X = r => JSON.parse(gc(r, '--extract').stdout); const H = r => gc(r).stdout;
  let r = ws('ui', EV, blkPass('E1') + blkFail('E10')); let x = X(r); eq(id, x.gate, 2, 'nhận Cổng 2'); eq(id, x.ui_observed, { applicable: true, present: false, declared: 1, passed: 0, descoped: null }, '(a) khai mà không đạt'); if (!H(r).includes(NONE) || !H(r).includes('E10')) fail(id, '(a) HTML thiếu cờ KHÔNG có + id');
  r = ws('ui', EV, blkPass('E1') + blkPass('E10', true)); x = X(r); eq(id, x.ui_observed.present, true, '(b) đạt'); if (H(r).includes(NONE) || !/1 eval[^<]*đạt/.test(H(r))) fail(id, '(b) phải nêu 1 eval đạt, không cờ');
  r = ws('ui', '  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n', blkPass('E1')); x = X(r); eq(id, x.ui_observed.declared, 0, '(c) declared 0'); if (!H(r).includes(NONE)) fail(id, '(c) thiếu cờ');
  const seal = '{"id":"d-1","type":"seal","gate":1,"at":"2026-09-01T00:00:00Z"}\n'; const ds = `{"id":"d-2","type":"descope","stage":"S4-r1","decision":"${L.UI_OBSERVED_DESCOPE}hạ tầng chụp hỏng"}\n`;
  r = ws('ui', EV, blkPass('E1') + blkFail('E10'), seal + ds); x = X(r); if (!x.decisions_provisional.some(d => d.id === 'd-2')) fail(id, '(d) descope sau seal phải ở CHƯA duyệt'); eq(id, x.ui_observed.descoped, 'd-2', '(d) descoped'); if (!H(r).includes('d-2')) fail(id, '(d) cờ nêu id');
  r = ws('cli', '  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n', blkPass('E1')); x = X(r); eq(id, x.ui_observed.applicable, false, '(e) cli'); if (H(r).includes('lớp nhìn-thấy')) fail(id, '(e) cli mà có cụm lớp nhìn-thấy');
  if (failures === 0) pass(id, 'thẻ Cổng 2: present đọc trên báo cáo, descope sau seal ở CHƯA duyệt, cli im');
}
```

- [ ] **Step 2: Chạy → đỏ** — throw «gate-card.js không khai UI_OBS_G2_NONE».

- [ ] **Step 3: Sửa gate-card (Gate 2)** — sau `const flags = [];` (~938):

```js
// ---- lớp bằng chứng nhìn-thấy ở Cổng Bằng chứng: đọc trên BÁO CÁO, không trên bản khai (gap-probe F1) ----
const UI_OBS_G2_NONE = 'Bằng chứng lớp nhìn-thấy: KHÔNG có';
const UI_OBS_G2_OK = 'Bằng chứng lớp nhìn-thấy:';
let LNT2 = null; try { LNT2 = require(path.join(__dirname, '..', 'lib', 'lop-nhin-thay.cjs')); } catch (_) {}
const uo2 = LNT2 ? LNT2.classify(dir) : { applicable: false, reason: 'no-lib' };
const uiIds = (LNT2 && !uo2.reason) ? LNT2.uiCheckIds(LNT2.parseEvalsText(read(path.join(dir, 'evals.yaml')) || '')) : [];
const uiPassed = uiIds.filter(i => { const e = evid[i] || {}; return e.exit_code === '0' && !!e.screenshot; });
const uiObserved2 = { applicable: !!uo2.applicable, present: uiPassed.length > 0, declared: uiIds.length, passed: uiPassed.length, descoped: uo2.descoped || null };
if (uiObserved2.applicable) {
  if (uiObserved2.present) flags.push(['finfo', `${UI_OBS_G2_OK} ${uiPassed.length} eval ui-check đạt (${esc(uiPassed.join(', '))}) — xem frame ở trang bằng chứng.`]);
  else if (uiObserved2.descoped) flags.push(['fwarn', `${UI_OBS_G2_NONE} — đã bỏ theo ${esc(uiObserved2.descoped)}; người ký đọc tên ca máy, không nhìn frame.`]);
  else flags.push(['fwarn', `${UI_OBS_G2_NONE} — ${uiIds.length ? 'eval ui-check ' + esc(uiIds.join(', ')) + ' khai nhưng không đạt (không exit 0 kèm screenshot)' : 'hợp đồng có mặt người nhìn mà không eval ui-check nào'}; ký nghĩa là ký trên tên ca máy, không phải trên thứ người dùng thấy.`]);
}
```
  Thêm `ui_observed: uiObserved2` vào JSON `--extract` Gate 2 (~829 — chú ý khối extract nằm TRƯỚC dòng 938: dời phần tính `uiObserved2` lên trước `if (EXTRACT)` Gate 2, giữ `flags.push` ở chỗ flags).

- [ ] **Step 4: Chạy → xanh** — LNT4 PASS; suite plugins không hồi quy (P52 «report cũ render KHÁC bản base» dùng bộ lọc `norm()` — cờ mới trên hồ sơ cũ `surfaces: [cli]` không xuất hiện, ca đó sạch). Phá thử: đổi `!!e.screenshot` thành `true` → (a) đỏ; hoàn nguyên.

- [ ] **Step 5: Commit** — `git add scripts/gate-card.js tests/plugins/lop-nhin-thay.test.mjs && git commit -m "feat(gate-card): Cổng Bằng chứng đọc lớp nhìn-thấy trên báo cáo, không trên bản khai (AC-4)"`.

Phục vụ: E4. `independent: false`.

---

### Task 6: Pre-merge NOTE (chỉ thêm dòng) + ca PM-LNT-a…i

**Files:**
- Modify: `scripts/pre-merge-check.sh` — THÊM khối ngay TRƯỚC dòng `# ─── Gap-probe presence` (sau khối cross-layer), không sửa/xoá dòng nào
- Modify: `tests/scripts/run-tests.sh` (sau khối PM06, trước khối kế)

**Interfaces:** Consumes CLI `node lib/lop-nhin-thay.cjs classify <dir>` (Task 1). Biến sẵn có trong vòng lặp slug: `$slug`, `$dir`, `$contract`, `$status`, `slug_in_diff`, `$RECHECK_ALL`.

- [ ] **Step 1: Ca đỏ trước** — helper `mk_lnt_repo <root> <surfaces> <evals-body|""> [ledger-line]` = bản `mk_xl` với surfaces tham số + `approved_at: 2026-09-01T00:00:00Z` + git repo (theo nếp `mk_pr`/`mk_git_repo` để `--base` có diff chạm slug; nếu `mk_xl` chạy được không cần git thì giữ đúng nếp PM01–PM05):

```bash
# ─── PM-LNT — NOTE lớp bằng chứng nhìn-thấy (hồ sơ lop-bang-chung-nhin-thay) ─────
mk_lnt_repo() { # <root> <surfaces> <evals-body|""> [ledger-line]
  local d="$1/_acceptance/feat-lnt"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: feat-lnt\nslug: feat-lnt\nrisk_tier: T2\nsurfaces: [%s]\nstatus: implemented\napproved_by: Manh Phan\napproved_at: 2026-09-01T00:00:00Z\n---\n## Criteria\n- AC-1: Given app, When open, Then hero visible.\n## Out of scope\n## Notes\nMobile backend target: staging — QA backend.\n' "$2" > "$d/contract.md"
  [ -n "$3" ] && printf -- 'evals:\n%s\n' "$3" > "$d/evals.yaml"
  [ -n "${4:-}" ] && printf '%s\n' "$4" > "$d/decisions.jsonl"
  local v="$1/verify.sh"; printf '#!/bin/sh\nexit 0\n' > "$v"
  printf -- '---\nschema_version: 1\nfeature_slug: feat-lnt\nverdict: PASS\nhuman_signoff: Manh 2026-09-02\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-lnt-E1-001\n  exit_code: 0\n  verifier: %s\n  verified_at: 2026-09-02\n' "$v" > "$d/evidence-report.md"; :; }
LNT_EV_T='  - id: E1
    criterion: AC-1
    executor: test
    expected: "green"'
LNT_EV_U='  - id: E1
    criterion: AC-1
    executor: ui-check
    layer: ui-observed
    expected: "frame"'
pm_lnt() { bash "$CHECK" "$1" 2>&1; }
has_scan() { case "$1" in *"rules ran="*) return 0;; *) return 1;; esac; }
mk_lnt_repo "$P/lnt-a" ui "$LNT_EV_T"; o="$(pm_lnt "$P/lnt-a")"; r=$?
echo "PM-LNT-a [ui] không ui-check -> NOTE mặt người nhìn + ngưỡng + approved_at, exit 0"; check PM-LNT-a 0 $r
case "$o" in *"NOTE [feat-lnt]"*"mặt người nhìn"*"không eval ui-check"*"2 hợp đồng"*"2026-09-01"*) echo "  PASS: PM-LNT-a-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM-LNT-a-msg"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt_repo "$P/lnt-b" ui "$LNT_EV_T" "{\"id\":\"d-77\",\"type\":\"descope\",\"decision\":\"${LNT_DESCOPE}hỏng chụp\"}"; o="$(pm_lnt "$P/lnt-b")"
echo "PM-LNT-b descope có tên -> NOTE nêu id"; case "$o" in *"NOTE [feat-lnt]"*"mặt người nhìn"*d-77*) echo "  PASS: PM-LNT-b"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM-LNT-b"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt_repo "$P/lnt-c" ui "$LNT_EV_U"; o="$(pm_lnt "$P/lnt-c")"
echo "PM-LNT-c có ui-check -> không NOTE lớp nhìn-thấy (+ rules ran=)"; case "$o" in *"lớp nhìn-thấy"*|*"mặt người nhìn"*) echo "  FAIL: PM-LNT-c"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) if has_scan "$o"; then echo "  PASS: PM-LNT-c"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: PM-LNT-c (thiếu dấu hiệu quét)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi ;; esac
mk_lnt_repo "$P/lnt-d" "api, mobile" "$LNT_EV_T"; o="$(pm_lnt "$P/lnt-d")"
echo "PM-LNT-d [api, mobile] -> không NOTE (+ quét)"; case "$o" in *"mặt người nhìn"*) echo "  FAIL: PM-LNT-d"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) if has_scan "$o"; then echo "  PASS: PM-LNT-d"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: PM-LNT-d (quét)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi ;; esac
mk_lnt_repo "$P/lnt-e" web "$LNT_EV_T"; o="$(pm_lnt "$P/lnt-e")"
echo "PM-LNT-e [web] alias -> NOTE"; case "$o" in *"NOTE [feat-lnt]"*"mặt người nhìn"*) echo "  PASS: PM-LNT-e"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM-LNT-e"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt_repo "$P/lnt-f" ui ""; o="$(pm_lnt "$P/lnt-f")"
echo "PM-LNT-f không evals.yaml -> không NOTE lớp nhìn-thấy (+ quét)"; case "$o" in *"mặt người nhìn"*) echo "  FAIL: PM-LNT-f"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *) if has_scan "$o"; then echo "  PASS: PM-LNT-f"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: PM-LNT-f (quét)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi ;; esac
# (g) bản sao script + lib thiếu → NOTE «không kiểm được», exit 0
G="$T/lnt-g-kit"; mkdir -p "$G/scripts" "$G/lib"; cp "$HERE/../../scripts/pre-merge-check.sh" "$G/scripts/"; cp "$HERE"/../../lib/*.cjs "$G/lib/"; rm -f "$G/lib/lop-nhin-thay.cjs"
mk_lnt_repo "$P/lnt-g" ui "$LNT_EV_T"; o="$(bash "$G/scripts/pre-merge-check.sh" "$P/lnt-g" 2>&1)"; r=$?
echo "PM-LNT-g lib thiếu -> NOTE không kiểm được, exit 0"; check PM-LNT-g 0 $r; case "$o" in *"NOTE"*"không kiểm được"*"lớp nhìn-thấy"*) echo "  PASS: PM-LNT-g-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM-LNT-g-msg"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt_repo "$P/lnt-h" ui "$LNT_EV_T"; o="$(bash "$CHECK" "$P/lnt-h" --recheck-all 2>&1)"
echo "PM-LNT-h --recheck-all -> NOTE như (a)"; case "$o" in *"NOTE [feat-lnt]"*"mặt người nhìn"*"2026-09-01"*) echo "  PASS: PM-LNT-h"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM-LNT-h"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
mk_lnt_repo "$P/lnt-i" ui "$LNT_EV_T" '{"id":"d-78","type":"descope","decision":"bỏ ui-observed: hỏng"}'; o="$(pm_lnt "$P/lnt-i")"
echo "PM-LNT-i tiền tố dấu hai chấm -> NOTE như (a), không id"; case "$o" in *d-78*) echo "  FAIL: PM-LNT-i (nhận nhầm id)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; *"NOTE [feat-lnt]"*"mặt người nhìn"*"không eval ui-check"*) echo "  PASS: PM-LNT-i"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: PM-LNT-i"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
# DV5 — diff chỉ thêm dòng so main
echo "PM-LNT-dv5 pre-merge-check.sh so main chỉ THÊM dòng"; dv="$(git -C "$HERE/../.." diff main -- scripts/pre-merge-check.sh | grep -E '^-' | grep -vE '^---' || true)"; if [ -z "$dv" ]; then echo "  PASS: PM-LNT-dv5"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: PM-LNT-dv5 (có dòng bị xoá/sửa)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi
```

  Nếu `mk_xl`-style (không git) khiến `slug_in_diff` sai và NOTE không chạy, dùng khuôn git của PM06/`mk_pr` cho fixture: tạo repo, commit base, thêm hồ sơ, chạy `--base <base-sha>`. Cách nào cũng được, miễn ca (c)(d)(f) có `rules ran=`.

- [ ] **Step 2: Chạy → đỏ** — PM-LNT-a/b/e/g/h/i FAIL (chưa có NOTE).

- [ ] **Step 3: Thêm khối vào `pre-merge-check.sh`** (chèn nguyên khối, không đổi dòng cũ):

```bash
  # ─── Lớp bằng chứng nhìn-thấy — NOTE, chưa VIOLATION (hồ sơ lop-bang-chung-nhin-thay) ──
  # Gương của răng cross-layer ở trên: hợp đồng có MẶT NGƯỜI NHÌN (ui; alias web/web-ui —
  # KHÔNG mobile) mà evals.yaml không có eval executor: ui-check → merge sẽ đi trên bằng
  # chứng lớp mã cho một bề mặt người nhìn. Vị từ/alias/tiền tố descope RÚT từ
  # lib/lop-nhin-thay.cjs (một nguồn với lint W8 và thẻ). Chạy khi slug trong diff HOẶC
  # --recheck-all (đường đếm ngưỡng). Ngưỡng siết thành VIOLATION: 2 hợp đồng ký không frame
  # trong một mốc phát hành — NOTE in kèm approved_at để đếm «ký trong cửa sổ» bằng grep.
  # Fail-open có tiếng: thiếu node/lib → NOTE «không kiểm được», không đổi exit.
  LNT_LIB="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)/lib/lop-nhin-thay.cjs"
  if { slug_in_diff "$slug" || [ "$RECHECK_ALL" -eq 1 ]; } && [ -f "${dir}evals.yaml" ]; then
    lnt_line=""
    if [ -f "$LNT_LIB" ] && command -v node >/dev/null 2>&1; then
      lnt_line="$(node "$LNT_LIB" classify "$dir" 2>/dev/null || true)"
    fi
    if [ -z "$lnt_line" ]; then
      echo "NOTE [$slug]: lớp nhìn-thấy không kiểm được — thiếu node hoặc lib/lop-nhin-thay.cjs (mang cổng vào repo phải copy CẢ lib/); NOTE này không chặn."
    else
      lnt_app="$(printf '%s' "$lnt_line" | cut -f1)"; lnt_decl="$(printf '%s' "$lnt_line" | cut -f2)"
      lnt_desc="$(printf '%s' "$lnt_line" | cut -f3)"; lnt_appr="$(printf '%s' "$lnt_line" | cut -f4)"
      if [ "$lnt_app" = "1" ] && [ "$lnt_decl" = "0" ]; then
        if [ "$lnt_desc" != "-" ]; then
          echo "NOTE [$slug]: mặt người nhìn (surfaces ui/web) nhưng không eval ui-check — đã BỎ có tên theo ledger $lnt_desc (approved_at $lnt_appr); người ký Cổng Bằng chứng đọc tên ca máy, không nhìn frame. Ngưỡng siết: 2 hợp đồng ký không frame trong một mốc phát hành."
        else
          echo "NOTE [$slug]: mặt người nhìn (surfaces ui/web) nhưng không eval ui-check nào — bằng chứng lớp mã thay lớp nhìn-thấy (approved_at $lnt_appr). Thêm ≥1 ui-check (layer: ui-observed) theo hợp đồng, hoặc ghi entry descope có tên. Ngưỡng siết: 2 hợp đồng ký không frame trong một mốc phát hành."
        fi
      fi
    fi
  fi
```

  Vị trí: ngay trước comment `# Counter scope NẰM NGOÀI khối luật bên dưới` (tức sau khối cross-layer, trước gap-probe). Kiểm biến `$dir` kết thúc bằng `/` (đúng như `${dir}evals.yaml` ở khối cross-layer).

- [ ] **Step 4: Chạy → xanh** — `bash tests/scripts/run-tests.sh 2>&1 | grep -E "PM-LNT|FAIL"`; cả suite scripts xanh. Phá thử: đổi `[ "$lnt_decl" = "0" ]` thành `[ "$lnt_decl" = "9" ]` → PM-LNT-a đỏ; hoàn nguyên. Chạy `bash scripts/pre-merge-check.sh --base main` trên chính kit (hồ sơ này `[cli]` → không NOTE, exit 0).

- [ ] **Step 5: Commit** — `git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh && git commit -m "feat(pre-merge): NOTE lớp bằng chứng nhìn-thấy kèm approved_at + ngưỡng đếm — chỉ thêm dòng (AC-5)"`.

Phục vụ: E5. `independent: false`.

---

### Task 7: Chốt vòng — suite đủ ba + lint + ledger

**Files:** không sửa mã; `_acceptance/lop-bang-chung-nhin-thay/decisions.jsonl` (entry `approach` S2 nếu có lựa chọn load-bearing phát sinh), `contract.md` (`status: implemented`).

- [ ] **Step 1:** `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh` → 0 FAIL.
- [ ] **Step 2:** `node scripts/eval-coverage-lint.js . --slug lop-bang-chung-nhin-thay` → sạch; `node scripts/product-map.mjs --root . --check` → khớp.
- [ ] **Step 3:** Set contract `status: implemented` (Edit tool — hook kiểm), commit `chore(lop-bang-chung-nhin-thay): implemented — sẵn sàng S4`.

Phục vụ: E1–E6 (điều kiện vào S4). `independent: false`.

---

## Self-review

- **Spec coverage:** D1 (Task 1 lib + Task 3/4/5 dùng executor làm neo) · D2 (thông điệp «theo hợp đồng», Task 2/3) · D3 (Task 6 NOTE + approved_at + `--recheck-all`) · D4 (Task 1 lib + alias nguong-o-co-hoi + khuôn; Task 3 token lạ) · D5 (Task 1 hằng + Task 2 SKILL + Task 3/4/5/6 đọc descope) · D6 (Task 2 acceptance-init). Không làm: evidence-page, hooks, s4-args — không task nào chạm.
- **Placeholder scan:** không TBD; mọi step có mã. Câu thông điệp W8 ở Task 3 Step 3 đã sửa cụm thừa («có KHÔNG có» → «không có eval»).
- **Type consistency:** `classify()` trả `declared` (số), `descoped` (id|null), `approved_at` (string|'-'), `tokenLa` (mảng) — Task 4 đọc `uo.declared/descoped/tokenLa`, Task 5 đọc `uo2.applicable/descoped` + `uiCheckIds`/`parseEvalsText`, Task 6 đọc 4 cột tab theo đúng thứ tự CLI. Tên hằng thẻ: `UI_OBS_FLAG_WARN/INFO` (Cổng 1), `UI_OBS_G2_NONE/OK` (Cổng 2) — ca LNT3/LNT4 rút bằng regex đúng tên.
