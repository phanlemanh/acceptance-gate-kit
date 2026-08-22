# Vào có ô, ra có tên — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ý khai thác xong có ô máy đọc; bộ quét `/start` tách «đang cân nhắc» khỏi «chờ Cổng Đáng» theo ngưỡng đã điền; thẻ nói số ý + tuổi; 7 hạt giống kit nhận ô.

**Architecture:** Một vị từ mới trong `scripts/start-scan.mjs` (`thresholdFilled`, nhãn bullet đọc từ khuôn lúc chạy qua `lib/md-section.cjs`) + nhóm `groups.considering[]`; hai khối marker trong `commands/start.md` (`START-CAN-NHAC`, `START-HIEU-KET`); file ca riêng `tests/plugins/vao-co-o.test.mjs` (VC1–VC8, fixture code-sinh từ khuôn, chạy script thật); 7 stub `_acceptance/<slug>/opportunity.md` sinh bằng script một lần; bản đồ vẽ lại.

**Tech Stack:** Node ESM (`.mjs`), bash suite `tests/plugins/run-tests.sh`, `tests/fixtures/from-template.mjs`.

**Spec:** `docs/superpowers/specs/2026-08-22-vao-co-o-ra-co-ten-design.md` · hợp đồng `_acceptance/vao-co-o-ra-co-ten/contract.md`.

## Global Constraints

- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (T2).
- Không sửa `skills/acceptance/references/opportunity-template.md` — chỉ ĐỌC.
- Mọi ca: đối chứng dương + chiều đỏ ghim thông điệp, fixture code-sinh, đường dẫn suy từ vị trí file.
- Chốt eval: `PASS: [VCn]` (ranh giới cứng).
- Tên ca mới không dùng số P toàn cục.

---

### Task 1: `scripts/start-scan.mjs` — vị từ ngưỡng + `considering[]`

**Files:**
- Modify: `scripts/start-scan.mjs` (import, helper sau `since`, nhánh opportunity, output `groups`)
- Test: `tests/plugins/vao-co-o.test.mjs` (VC1–VC4, viết ở Task 2)

**Interfaces:**
- Produces: `groups.considering[]` = `{slug, name, since, ageDays}`, sắp theo `since` tăng dần; exit 2 + stderr `start-scan: khuôn không có section Ngưỡng «…»` khi khuôn hỏng.

- [ ] **Step 1: thêm require md-section + helper** (sau dòng `const since = …`):

```js
const { section } = require(path.join(__dirname, '..', 'lib', 'md-section.cjs'));
// ── Ý đang cân nhắc vs chờ Cổng Đáng (hồ sơ vao-co-o-ra-co-ten) ──────────────
// Nhãn bullet của section Ngưỡng đọc từ CHÍNH KHUÔN lúc chạy — khuôn là một
// nguồn; chép tay vào đây là hai bản trôi (d-4202). Đọc LƯỜI: repo không có ý
// nào thì không đụng khuôn. Khuôn hỏng → chết to, không im lặng.
const OPP_TEMPLATE = path.join(__dirname, '..', 'skills', 'acceptance', 'references', 'opportunity-template.md');
const UAT_THRESHOLD_HEADING = 'Ngưỡng chết / ngưỡng UAT';
const PLACEHOLDER_RE = /^(…|\.\.\.)?$/;                      // giá trị sau dấu ':' — rỗng/«…» là chưa điền
const bulletOf = l => { const m = l.match(/^\s*[-*]\s+([^:]+):(.*)$/); return m ? { label: m[1].trim(), value: m[2].trim() } : null; };
let _labels = null;
const thresholdLabels = () => {
  if (_labels) return _labels;
  let tpl;
  try { tpl = readFileSync(OPP_TEMPLATE, 'utf8'); }
  catch (e) { bail(`khuôn opportunity-template không đọc được: ${OPP_TEMPLATE} (${e.code || e.message})`); }
  const labels = section(tpl, UAT_THRESHOLD_HEADING).map(bulletOf).filter(Boolean).map(b => b.label);
  if (!labels.length) bail(`khuôn không có section Ngưỡng «${UAT_THRESHOLD_HEADING}» (hoặc section không có bullet): ${OPP_TEMPLATE}`);
  return (_labels = labels);
};
const thresholdFilled = oTxt => {
  const got = new Map();
  for (const l of section(oTxt, UAT_THRESHOLD_HEADING)) { const b = bulletOf(l); if (b) got.set(b.label, b.value); }
  return thresholdLabels().every(lb => got.has(lb) && !PLACEHOLDER_RE.test(got.get(lb)));
};
// since của ý đang cân nhắc = committer date của commit ĐẦU TIÊN thêm file
// (--diff-filter=A); chưa commit / không git → mtime (d-4203).
const gitBirth = file => {
  try {
    const o = execFileSync('git', ['-C', root, 'log', '--diff-filter=A', '--format=%cI', '--', path.relative(root, file)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (!o) return null;
    const ls = o.split('\n'); return new Date(ls[ls.length - 1]).toISOString();
  } catch { return null; }
};
const ageDays = iso => Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 86400000));
```

- [ ] **Step 2: khai mảng** — `const gates = [], inProgress = [], done = [], broken = [];` → thêm `considering = []`.

- [ ] **Step 3: nhánh opportunity** — thay dòng
`if (stage !== 'decided' || !decision) gates.push({ slug, gate: 'dang', … });` bằng:

```js
  if (stage !== 'decided' || !decision) {
    // Chưa có ngưỡng thì chưa có gì để ký: xếp «đang cân nhắc», không phải cổng.
    if (thresholdFilled(oRead.t)) gates.push({ slug, gate: 'dang', since: since(oPath, fmOrNull(oRead.t, 'decided_at')), tier: null });
    else {
      const s = gitBirth(oPath) || statSync(oPath).mtime.toISOString();
      considering.push({ slug, name: fmOrNull(oRead.t, 'feature') || slug, since: s, ageDays: ageDays(s) });
    }
  }
```

- [ ] **Step 4: sắp + xuất** — sau `gates.sort(...)` thêm `considering.sort((a, b) => a.since.localeCompare(b.since));`; trong `out({... groups: { gates, inProgress, done } ...})` thêm `considering` (thứ tự: gates, inProgress, considering, done).

- [ ] **Step 5: chạy nhanh** `node scripts/start-scan.mjs --root . | node -e 'process.stdin.on("data",d=>console.log(Object.keys(JSON.parse(d).groups)))'` → `[ 'gates', 'inProgress', 'considering', 'done' ]`.

- [ ] **Step 6: Commit** `git add scripts/start-scan.mjs && git commit -m "feat(start-scan): groups.considering — ý chưa có ngưỡng không phải cổng"`.

### Task 2: `tests/plugins/vao-co-o.test.mjs` — VC1·VC2·VC3·VC4·VC7

**Files:**
- Create: `tests/plugins/vao-co-o.test.mjs`
- Modify: `tests/plugins/run-tests.sh` (vòng lặp `_vc_ids`, sau vòng LV)

**Interfaces:**
- `--ids` in `VC1 VC2 VC3 VC4 VC6 VC7 VC8`; `VC_CASES=VCn` chạy một ca; in `PASS: [VCn] …` / `FAIL: [VCn] …`; exit 1 khi có ca đỏ hoặc id lạ.

- [ ] **Step 1: khung + helper**

```js
// tests/plugins/vao-co-o.test.mjs — ca hồ sơ vao-co-o-ra-co-ten (VC1–VC8; VC5 = P99).
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, readdirSync, utimesSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { fileFromTemplate } from '../fixtures/from-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
const TEMPLATE = path.join(ROOT, 'skills', 'acceptance', 'references', 'opportunity-template.md');
const START_MD = path.join(ROOT, 'commands', 'start.md');
const require = createRequire(import.meta.url);
const { section } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
const HEADING = 'Ngưỡng chết / ngưỡng UAT';
const MARKER = 'OPP-FRONTMATTER-TEMPLATE';

let failures = 0;
const ALL_IDS = ['VC1', 'VC2', 'VC3', 'VC4', 'VC6', 'VC7', 'VC8'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.VC_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'vc-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const fx = () => { const r = tmp(); W(r, '_acceptance/config.yaml', 'schema_version: 1\n'); return r; };
// Quét bằng script THẬT (hoặc bản sao đã đột biến) — trả JSON hoặc {status, stderr}
const scan = (root, script = SCAN) => {
  const r = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  if (r.status !== 0) return { status: r.status, stderr: r.stderr };
  return JSON.parse(r.stdout);
};
// Section Ngưỡng rút từ CHÍNH khuôn (không gõ tay); filled → thay «…» bằng giá trị
const thresholdSection = (filled, tpl = readFileSync(TEMPLATE, 'utf8')) => {
  const bullets = section(tpl, HEADING).filter(l => /^\s*[-*]\s+[^:]+:/.test(l));
  return `\n## ${HEADING}\n\n` + bullets.map(l => (filled ? l.replace(/:\s*…\s*$/, ': giá trị thật') : l)).join('\n') + '\n';
};
const DEFAULTS = { slug: 'w-idea', feature: 'Ý w-idea', owner: 'o@x', stage: 'discovery', decision: '', decided_by: '', decided_at: '', base_commit: '', disposition: '' };
const stub = (values = {}, { filled = false, tpl = TEMPLATE, body = '' } = {}) =>
  fileFromTemplate(tpl, MARKER, { ...DEFAULTS, ...values },
    '\n## Vấn đề & ai gặp\n\nMột câu.\n' + thresholdSection(filled, readFileSync(tpl, 'utf8')) + body);
// Bản sao cây plugin (scripts + lib + references) để đột biến script/khuôn mà không chạm cây thật
const pluginCopy = ({ script, template } = {}) => {
  const r = tmp();
  for (const d of ['scripts', 'lib', 'skills/acceptance/references']) cpSync(path.join(ROOT, d), path.join(r, d), { recursive: true });
  const sp = path.join(r, 'scripts', 'start-scan.mjs'), tp = path.join(r, 'skills', 'acceptance', 'references', 'opportunity-template.md');
  if (script) writeFileSync(sp, script(readFileSync(sp, 'utf8')));
  if (template) writeFileSync(tp, template(readFileSync(tp, 'utf8')));
  return { scan: sp, template: tp };
};
const slugsIn = arr => (arr || []).map(x => x.slug);
```

- [ ] **Step 2: VC1**

```js
if (want('VC1')) {
  const root = fx(); W(root, '_acceptance/w-idea/opportunity.md', stub());
  const j = scan(root); const errs = [];
  const c = (j.groups?.considering || []).find(x => x.slug === 'w-idea');
  if (!c) errs.push('w-idea không ở considering[]');
  else {
    if (Object.keys(c).sort().join(',') !== 'ageDays,name,since,slug') errs.push(`khoá lệch: ${Object.keys(c).join(',')}`);
    if (c.name !== 'Ý w-idea') errs.push(`name ≠ feature: ${c.name}`);
  }
  if (slugsIn(j.groups?.gates).includes('w-idea')) errs.push('w-idea vẫn ở gates[]');
  if (slugsIn(j.broken).includes('w-idea')) errs.push('w-idea ở broken[]');
  // chiều đỏ (a): khuôn bản sao gỡ bullet Timebox → stub 3 bullet điền đủ → gate dang (kết luận đổi)
  const copyA = pluginCopy({ template: t => t.replace(/^- Timebox:.*\n/m, '') });
  const rootA = fx(); W(rootA, '_acceptance/w-idea/opportunity.md', stub({}, { filled: true, tpl: copyA.template }));
  const jA = scan(rootA, copyA.scan), jA0 = scan(rootA);
  if (!(jA.groups?.gates || []).some(g => g.slug === 'w-idea' && g.gate === 'dang')) errs.push('khuôn gỡ Timebox mà bản sao không xếp dang → script không đọc khuôn lúc chạy');
  if (!slugsIn(jA0.groups?.considering).includes('w-idea')) errs.push('đối chứng: script thật với khuôn thật phải xếp considering (thiếu Timebox)');
  // chiều đỏ (b): khuôn đổi tên heading → exit ≠ 0 + thông điệp
  const copyB = pluginCopy({ template: t => t.replace(`## ${HEADING}`, '## Ngưỡng sống') });
  const jB = scan(root, copyB.scan);
  if (!(jB.status && /khuôn không có section Ngưỡng/.test(jB.stderr || ''))) errs.push(`khuôn đổi heading: exit ${jB.status} stderr=${(jB.stderr || '').slice(0, 80)}`);
  if (errs.length) fail('VC1', errs.join(' · ')); else pass('VC1', 'ý chưa ngưỡng → considering {slug,name,since,ageDays}; khuôn là nguồn nhãn (gỡ bullet → kết luận đổi; đổi heading → chết to)');
}
```

- [ ] **Step 3: VC2**

```js
if (want('VC2')) {
  const errs = [];
  const root = fx(); W(root, '_acceptance/w-ready/opportunity.md', stub({ slug: 'w-ready' }, { filled: true }));
  const j = scan(root);
  if (!(j.groups?.gates || []).some(g => g.slug === 'w-ready' && g.gate === 'dang')) errs.push('đủ ngưỡng mà không ở gates dang');
  if (slugsIn(j.groups?.considering).includes('w-ready')) errs.push('đủ ngưỡng mà vẫn considering');
  const full = stub({ slug: 'w-ready' }, { filled: true });
  const r1 = fx(); W(r1, '_acceptance/w-ready/opportunity.md', full.replace('- Timebox: giá trị thật', '- Timebox: …'));
  if (!slugsIn(scan(r1).groups?.considering).includes('w-ready')) errs.push('đổi một giá trị về «…» mà không rơi về considering');
  const r2 = fx(); W(r2, '_acceptance/w-ready/opportunity.md', full.replace('- Timebox: giá trị thật', '- Timebox:'));
  if (!slugsIn(scan(r2).groups?.considering).includes('w-ready')) errs.push('giá trị rỗng mà không rơi về considering');
  if (errs.length) fail('VC2', errs.join(' · ')); else pass('VC2', 'đủ ngưỡng → gate dang; một giá trị «…»/rỗng → considering');
}
```

- [ ] **Step 4: VC3**

```js
if (want('VC3')) {
  const errs = [];
  const root = fx();
  W(root, '_acceptance/w-build/opportunity.md', stub({ slug: 'w-build', stage: 'decided', decision: 'build' }));
  W(root, '_acceptance/w-park/opportunity.md', stub({ slug: 'w-park', stage: 'decided', decision: 'park' }));
  W(root, '_acceptance/w-odd/opportunity.md', stub({ slug: 'w-odd', stage: 'ideation' }));
  W(root, '_acceptance/w-draft/contract.md', '---\nslug: w-draft\nrisk_tier: T2\nstatus: draft\n---\n');
  W(root, '_acceptance/w-draft/opportunity.md', stub({ slug: 'w-draft' }));
  const j = scan(root), g = j.groups;
  if (!(g.inProgress || []).some(x => x.slug === 'w-build' && x.nextStep === 'S1')) errs.push('build không ở inProgress S1');
  if (!(g.done || []).some(x => x.slug === 'w-park' && x.state === 'park')) errs.push('park không ở done park');
  if (!(j.broken || []).some(x => x.slug === 'w-odd' && /stage/.test(x.reason))) errs.push('stage lạ không ở broken nêu stage');
  if (!(g.gates || []).some(x => x.slug === 'w-draft' && x.gate === 'pham-vi')) errs.push('contract draft không ở gates pham-vi');
  if (!Array.isArray(g.considering) || g.considering.length) errs.push(`considering phải rỗng: ${JSON.stringify(g.considering)}`);
  if (errs.length) fail('VC3', errs.join(' · ')); else pass('VC3', 'đã quyết / stage lạ / có contract: kết luận không đổi, considering rỗng');
}
```

- [ ] **Step 5: VC4**

```js
if (want('VC4')) {
  const errs = [];
  const day = 86400000, t10 = new Date(Date.now() - 10 * day), t1 = new Date(Date.now() - 1 * day);
  // (a) không git → mtime
  const ra = fx(); const pa = W(ra, '_acceptance/w-idea/opportunity.md', stub()); utimesSync(pa, t10, t10);
  const ca = (scan(ra).groups.considering || [])[0] || {};
  if (ca.ageDays !== 10) errs.push(`không git: ageDays=${ca.ageDays} (mong 10)`);
  // (b) git hai commit: −10 rồi −1 → since = −10
  const rb = fx();
  const git = (args, env = {}) => { const r = spawnSync('git', ['-C', rb, '-c', 'user.name=t', '-c', 'user.email=t@x', '-c', 'commit.gpgsign=false', ...args], { encoding: 'utf8', env: { ...process.env, ...env } }); if (r.status !== 0) throw new Error(`git ${args[0]}: ${r.stderr}`); return r.stdout; };
  git(['init', '-q']);
  const pb = W(rb, '_acceptance/w-idea/opportunity.md', stub());
  const at = d => ({ GIT_AUTHOR_DATE: d.toISOString(), GIT_COMMITTER_DATE: d.toISOString() });
  git(['add', '-A']); git(['commit', '-q', '-m', 'c1'], at(t10));
  writeFileSync(pb, readFileSync(pb, 'utf8') + '\nsửa chính tả\n'); git(['add', '-A']); git(['commit', '-q', '-m', 'c2'], at(t1));
  const cb = (scan(rb).groups.considering || [])[0] || {};
  if (Math.abs(Date.parse(cb.since) - t10.getTime()) > 1000) errs.push(`git: since=${cb.since} (mong ${t10.toISOString()})`);
  if (cb.ageDays !== 10) errs.push(`git: ageDays=${cb.ageDays} (mong 10)`);
  // chiều đỏ: bản sao đọc commit cuối (-1 thay --diff-filter=A) → since lệch
  const mut = pluginCopy({ script: s => s.replace("'--diff-filter=A'", "'-1'") });
  const cm = (scan(rb, mut.scan).groups.considering || [])[0] || {};
  if (Math.abs(Date.parse(cm.since) - t1.getTime()) > 1000) errs.push('mutant đọc commit cuối mà since không lệch → phép đo mù với commit ĐẦU');
  // (c) file chưa commit trong repo git → mtime
  const pc = W(rb, '_acceptance/w-new/opportunity.md', stub({ slug: 'w-new' })); utimesSync(pc, t10, t10);
  const cc = (scan(rb).groups.considering || []).find(x => x.slug === 'w-new') || {};
  if (cc.ageDays !== 10) errs.push(`chưa commit: ageDays=${cc.ageDays} (mong 10 từ mtime)`);
  if (errs.length) fail('VC4', errs.join(' · ')); else pass('VC4', 'since = commit đầu (git) / mtime (không git, chưa commit); ageDays nguyên; mutant commit cuối → đỏ');
}
```

- [ ] **Step 6: VC7**

```js
if (want('VC7')) {
  const errs = [];
  const { renderProductMap } = await import(pathToFileURL(path.join(ROOT, 'scripts', 'product-map.mjs')).href);
  const count = (md, label) => { const m = md.match(new RegExp(`${label}<br/>(chưa có|(\\d+) việc)`)); return m ? (m[2] ? Number(m[2]) : 0) : null; };
  const root = fx();
  W(root, '_acceptance/w-idea/opportunity.md', stub());
  W(root, '_acceptance/w-ready/opportunity.md', stub({ slug: 'w-ready' }, { filled: true }));
  W(root, '_acceptance/w-go/opportunity.md', stub({ slug: 'w-go', stage: 'decided', decision: 'build' }));
  const j = scan(root), md = renderProductMap(root);
  const dang = (j.groups.gates || []).filter(g => g.gate === 'dang').length, cons = j.groups.considering.length;
  if (count(md, 'Đang cân nhắc cơ hội') !== cons + dang || cons + dang !== 2) errs.push(`bản đồ ${count(md, 'Đang cân nhắc cơ hội')} ≠ considering ${cons} + dang ${dang} (mong 2)`);
  if (count(md, 'Sắp mở vòng') !== 1) errs.push('Sắp mở ≠ 1');
  rmSync(path.join(root, '_acceptance', 'w-idea'), { recursive: true });
  const j2 = scan(root), md2 = renderProductMap(root);
  if (count(md2, 'Đang cân nhắc cơ hội') !== 1 || (j2.groups.gates || []).filter(g => g.gate === 'dang').length !== 1) errs.push('gỡ ý cân nhắc: hai bên không cùng về 1');
  if (!Array.isArray(j2.groups.considering) || j2.groups.considering.length !== 0) errs.push('considering phải là mảng rỗng (N = 0)');
  if (errs.length) fail('VC7', errs.join(' · ')); else pass('VC7', 'bản đồ «cân nhắc» == considering + dang; gỡ một → cùng giảm; N = 0 là mảng rỗng');
}
```

- [ ] **Step 7: đuôi file**

```js
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [VC_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`vao-co-o: ${failures} ca đỏ`); process.exit(1); }
```

- [ ] **Step 8: nối suite** — trong `tests/plugins/run-tests.sh`, sau vòng LV:

```bash
# ─── Hồ sơ vao-co-o-ra-co-ten: VC1..VC8 (file ca riêng; VC5 = P99) ───────────
_vc_ids="$(node "$ROOT/tests/plugins/vao-co-o.test.mjs" --ids)" || { echo "khong lay duoc danh sach ca VC"; failures=$((failures+1)); _vc_ids=""; }
for _vc in $_vc_ids; do
  run "ca vao co o — $_vc (ho so vao-co-o-ra-co-ten)" \
    env VC_CASES="$_vc" node "$ROOT/tests/plugins/vao-co-o.test.mjs"
done
```

- [ ] **Step 9: chạy** `for c in VC1 VC2 VC3 VC4 VC7; do VC_CASES=$c node tests/plugins/vao-co-o.test.mjs; done` → 5 PASS. Tự phá thử: đổi `thresholdLabels().every` thành `some` trong một bản sao → VC1/VC2 đỏ.

- [ ] **Step 10: Commit** `git add tests/plugins/vao-co-o.test.mjs tests/plugins/run-tests.sh && git commit -m "test(vao-co-o): VC1–VC4, VC7 — fixture từ khuôn, script thật, chiều đỏ trên bản sao"`.

### Task 3: `commands/start.md` — khoá mới + hai khối marker + VC6 + P99

**Files:**
- Modify: `commands/start.md` (START-SCAN-KEYS; bước 3)
- Modify: `tests/plugins/run-tests.sh` (P99 fixture thêm `w-consider`)
- Modify: `tests/plugins/vao-co-o.test.mjs` (VC6)

- [ ] **Step 1: START-SCAN-KEYS** — thêm dòng sau `groups.inProgress…`:
`groups.considering[].slug groups.considering[].name groups.considering[].since groups.considering[].ageDays`

- [ ] **Step 2: khối START-CAN-NHAC** — chèn NGAY SAU bullet «Đang dở» (trước «Bắt đầu việc mới»):

```markdown
   <!-- <<<START-CAN-NHAC -->
   - **Đang cân nhắc** (`groups.considering` — ý đã có ô nhưng chưa điền ngưỡng,
     nên chưa có gì để ký; máy không xếp vào chờ chữ ký): N = 0 → KHÔNG in dòng
     nào. N ≥ 1 → đúng MỘT dòng «Đang cân nhắc: N ý · cũ nhất X ngày» (X =
     `ageDays` lớn nhất) rồi tối đa 3 `name` cũ nhất (script đã xếp cũ nhất lên
     đầu). Chọn một ý → việc kế là điền section Ngưỡng trong `opportunity.md`
     của nó; điền đủ là máy tự đưa sang chờ Cổng Đáng ở lần quét sau.
   <!-- START-CAN-NHAC>>> -->
```

- [ ] **Step 3: khối START-HIEU-KET** — chèn NGAY SAU START-CAN-NHAC, TRƯỚC bullet «Bắt đầu việc mới» (≤ 15 dòng giữa hai marker):

```markdown
   <!-- <<<START-HIEU-KET -->
   **Kết thúc buổi khai thác — MỌI lối, mở bằng skill nào cũng vậy:** ghi
   `_acceptance/<slug>/opportunity.md` từ khối `OPP-FRONTMATTER-TEMPLATE` của
   `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/opportunity-template.md`:
   ① `stage: discovery` · ② `decision: ` để trống (người ký Cổng Đáng điền) ·
   ③ file BẮT ĐẦU ở dòng `---` — không tiêu đề, không hàng rào yaml trước nó ·
   ④ section «Vấn đề & ai gặp» ≥ 1 câu · ⑤ section «Ngưỡng chết / ngưỡng UAT»
   giữ nguyên `…` của khuôn tới khi người điền — chưa điền là «đang cân nhắc»,
   điền đủ là chờ Cổng Đáng · ⑥ KHÔNG viết spec, KHÔNG viết contract ở bước này
   (đó là S1, sau Cổng Đáng). Ý không ghi vào ô là ý sẽ mất — ba bộ đọc định kỳ
   (/start · bản đồ · lưới) chỉ thấy `_acceptance/`.
   <!-- START-HIEU-KET>>> -->
```

- [ ] **Step 4: lối (a)** — sửa đoạn hiện có: `null` → đi nghi thức grill của kit theo khuôn … → thay bằng: CÓ giá trị → mở buổi khai thác bằng đúng skill đó, **kết thúc theo `START-HIEU-KET`**; `null` → khai thác theo khuôn `opportunity-template.md` (repo chưa khai là bình thường — KHÔNG chặn, không cờ), **kết thúc theo `START-HIEU-KET`**; nhánh thứ ba: … rồi khai thác theo khuôn, kết thúc theo `START-HIEU-KET`. Xoá mọi chữ «grill» (kể cả trong comment của `scripts/start-scan.mjs`? — KHÔNG: AC-6(iii) chỉ đo `commands/start.md`; comment script giữ nguyên để khỏi đổi lib-like text, nhưng sửa chữ «grill» ở start-scan thành «khai thác theo khuôn» là rẻ và đúng — làm luôn).

- [ ] **Step 5: P99 fixture** — thêm sau dòng `W('_acceptance/w-bad/contract.md', …)`:
`W('_acceptance/w-consider/opportunity.md', '---\nslug: w-consider\nfeature: w\nstage: discovery\ndecision:\n---\n');`

- [ ] **Step 6: VC6** (thêm vào file ca, trước đuôi):

```js
if (want('VC6')) {
  const errs = [];
  const md = readFileSync(START_MD, 'utf8');
  const block = (t, m) => { const r = t.match(new RegExp(`<!-- <<<${m} -->\\n([\\s\\S]*?)<!-- ${m}>>> -->`)); return r ? r[1] : null; };
  const cn = block(md, 'START-CAN-NHAC'), hk = block(md, 'START-HIEU-KET');
  if (!cn) errs.push('không tìm thấy khối START-CAN-NHAC');
  if (!hk) errs.push('không tìm thấy khối START-HIEU-KET');
  if (cn && hk) {
    // START-CAN-NHAC: 4 assert
    for (const [name, re] of [['Đang cân nhắc', /Đang cân nhắc/], ['cũ nhất', /cũ nhất/], ['N = 0 không in', /N = 0 → KHÔNG in/]])
      if (!re.test(cn)) errs.push(`START-CAN-NHAC thiếu «${name}»`);
    const iDo = md.indexOf('**Đang dở**'), iCn = md.indexOf('<<<START-CAN-NHAC'), iNew = md.indexOf('**Bắt đầu việc mới**');
    if (!(iDo > -1 && iDo < iCn && iCn < iNew)) errs.push('START-CAN-NHAC không nằm sau «Đang dở» trước «Bắt đầu việc mới»');
    // START-HIEU-KET: ma trận 6 mệnh đề VIẾT TRƯỚC — số assert == 6
    const MATRIX = [
      ['①', /`stage: discovery`/], ['②', /`decision: ?`/], ['③', /BẮT ĐẦU ở dòng `---`/],
      ['④', /«Vấn đề & ai gặp» ≥ 1 câu/], ['⑤', /«Ngưỡng chết \/ ngưỡng UAT»[\s\S]*`…`/], ['⑥', /KHÔNG viết spec, KHÔNG viết contract/],
    ];
    if (MATRIX.length !== 6) errs.push('ma trận phải có đúng 6 mệnh đề');
    for (const [id, re] of MATRIX) if (!re.test(hk)) errs.push(`START-HIEU-KET thiếu mệnh đề ${id}`);
    const n = hk.split('\n').filter(l => l.trim()).length;
    if (n > 15) errs.push(`START-HIEU-KET quá 15 dòng (${n})`);
    const iHk = md.indexOf('<<<START-HIEU-KET'), iA = md.indexOf('(a) ý còn mơ hồ'), iB = md.indexOf('(b)', iA);
    if (!(iHk > -1 && iHk < iA)) errs.push('START-HIEU-KET không đứng trước lối (a)');
    const refs = (md.slice(iA, iB).match(/START-HIEU-KET/g) || []).length;
    if (refs < 2) errs.push(`lối (a) trỏ START-HIEU-KET ${refs} lần (mong ≥ 2: nhánh có skill + nhánh không)`);
    if (/grill/.test(md)) errs.push('start.md còn chữ «grill»');
    // (iv) round-trip nghi thức → máy: rút code span key: value từ khối, áp lên khuôn, quét
    const spansOf = b => Object.fromEntries([...b.matchAll(/`([a-z_]+): ?([^`]*)`/g)].map(m => [m[1], m[2].trim()]));
    const build = spans => fileFromTemplate(TEMPLATE, MARKER, { slug: 'w-ritual', feature: 'Ý theo nghi thức', owner: 'o@x', decided_by: '', decided_at: '', base_commit: '', disposition: '', ...spans },
      '\n## Vấn đề & ai gặp\n\nMột câu.\n' + thresholdSection(false));
    const r = fx(); W(r, '_acceptance/w-ritual/opportunity.md', build(spansOf(hk)));
    const j = scan(r);
    if (!slugsIn(j.groups?.considering).includes('w-ritual')) errs.push(`stub theo nghi thức không vào considering: ${JSON.stringify(j.broken)}`);
    // chiều đỏ: gỡ span ① → stub hỏng → nêu mệnh đề ①
    const hkRed = hk.replace('`stage: discovery`', 'stage discovery');
    const rr = fx(); W(rr, '_acceptance/w-ritual/opportunity.md', build(spansOf(hkRed)));
    const jr = scan(rr);
    if (!(jr.broken || []).some(x => x.slug === 'w-ritual' && /stage/.test(x.reason))) errs.push('gỡ span stage mà stub không hỏng → round-trip không sống');
    else if (MATRIX.some(([, re]) => !re.test(hkRed)) !== true) errs.push('gỡ span ① mà ma trận vẫn xanh');
    // chiều đỏ: gỡ khối / thêm dòng 16
    if (block(md.replace(/<!-- <<<START-HIEU-KET -->[\s\S]*?<!-- START-HIEU-KET>>> -->/, ''), 'START-HIEU-KET') !== null) errs.push('gỡ khối mà vẫn tìm thấy');
    const hk16 = hk + Array.from({ length: 16 - n }, (_, i) => `dòng thêm ${i}`).join('\n') + '\n';
    if (hk16.split('\n').filter(l => l.trim()).length <= 15) errs.push('thêm dòng mà không quá 15');
  }
  if (errs.length) fail('VC6', errs.join(' · ')); else pass('VC6', 'hai khối marker đúng chỗ, ma trận 6 mệnh đề, 0 «grill», nghi thức → máy round-trip; gỡ span/khối/16 dòng → đỏ');
}
```

- [ ] **Step 7: chạy** `VC_CASES=VC6 node tests/plugins/vao-co-o.test.mjs` và P99: `grep -n "P99" tests/plugins/run-tests.sh` rồi chạy cả suite plugins ở Task 5.

- [ ] **Step 8: Commit** `git add commands/start.md scripts/start-scan.mjs tests/plugins/run-tests.sh tests/plugins/vao-co-o.test.mjs && git commit -m "feat(start): Đang cân nhắc trên thẻ + nghi thức kết thúc khai thác START-HIEU-KET; gỡ con trỏ chết grill"`.

### Task 4: 7 stub + sửa dòng trạng thái + bản đồ + VC8

**Files:**
- Create: `_acceptance/{hoi-theo-mat-phang,ban-do-dinh-chu-ky,o-nuot-luat,ba-cho-tich-luy-khong-duong-ra,duong-do-trong-dinh-nghia-xong,liet-ke-may-doc,t1-tuyen-kem-can-cu}/opportunity.md`
- Modify: 7 file `docs/plans/*-hat-giong-<slug>.md` (10 dòng đầu)
- Modify: `PRODUCT-MAP.md` (vẽ lại)
- Modify: `tests/plugins/vao-co-o.test.mjs` (VC8)

- [ ] **Step 1: sinh stub bằng script một lần** (scratchpad, không commit) dùng `fileFromTemplate` với bảng `[slug, feature, seedFile, stage, decision]`; `duong-do` = `decided/build`, `decided_by: Manh Phan`, `decided_at: 2026-08-21T14:00:00Z`; body = `## Vấn đề & ai gặp` 1 câu + «Đề bài đầy đủ: \`docs/plans/<file>\`» + section Ngưỡng rút từ khuôn (giữ `…`).

- [ ] **Step 2: sửa dòng trạng thái** — mỗi file: chuỗi «HẠT GIỐNG, chờ Cổng 0» / «hạt giống, chờ Cổng 0» / «ĐỀ XUẤT, chờ Cổng 0.» → `sống ở \`_acceptance/<slug>/opportunity.md\``; t1: tiêu đề «(cắt khỏi 1c, chờ Cổng 0)» → «(cắt khỏi 1c)».

- [ ] **Step 3: vẽ lại bản đồ** `node scripts/product-map.mjs --root . --write` (xem usage trong file) rồi `node scripts/product-map.mjs --root . --check` → exit 0.

- [ ] **Step 4: VC8**

```js
if (want('VC8')) {
  const errs = [];
  const NEW = ['hoi-theo-mat-phang', 'ban-do-dinh-chu-ky', 'o-nuot-luat', 'ba-cho-tich-luy-khong-duong-ra', 'duong-do-trong-dinh-nghia-xong', 'liet-ke-may-doc', 't1-tuyen-kem-can-cu'];
  const OLD = ['1c-doi-hanh-vi-cong-nguoi', 'bai-hoc-tuan-do-luong', 'go-lop-chung-minh-chu-ky', 'tool-kill-duong-doc-lap', 'lan-v-khong-phai-cho-ky', 'repo-khai-plugin'];
  const SEED_RE = /^\d{4}-\d{2}-\d{2}-hat-giong-(.+)\.md$/;
  // Ba chân khớp — MỘT hàm, dùng cho cây thật lẫn fixture
  const orphans = (plansDir, accDir) => {
    const contracts = existsSync(accDir) ? readdirSync(accDir).map(d => path.join(accDir, d, 'contract.md')).filter(existsSync).map(p => readFileSync(p, 'utf8')) : [];
    return readdirSync(plansDir).filter(f => SEED_RE.test(f)).filter(f => {
      const slug = f.match(SEED_RE)[1], dir = path.join(accDir, slug);
      const leg1 = existsSync(path.join(dir, 'contract.md')) || existsSync(path.join(dir, 'opportunity.md'));
      const leg2 = contracts.some(c => c.includes(`docs/plans/${f}`));
      const txt = readFileSync(path.join(plansDir, f), 'utf8');
      const leg3 = [...txt.matchAll(/_acceptance\/([\w-]+)\//g)].some(m => existsSync(path.join(accDir, m[1])));
      return !(leg1 || leg2 || leg3);
    });
  };
  const plans = path.join(ROOT, 'docs', 'plans'), acc = path.join(ROOT, '_acceptance');
  const seeds = readdirSync(plans).filter(f => SEED_RE.test(f)), slugs = seeds.map(f => f.match(SEED_RE)[1]);
  if (seeds.length < 13) errs.push(`vũ trụ: chỉ thấy ${seeds.length} hạt giống (mong ≥ 13)`);
  const missing = [...NEW, ...OLD].filter(s => !slugs.includes(s));
  if (missing.length) errs.push(`vũ trụ thiếu slug: ${missing.join(',')}`);
  const o = orphans(plans, acc); if (o.length) errs.push(`hạt giống không ô: ${o.join(',')}`);
  // chiều đỏ 1: fixture một hồ sơ mỗi chân + một mồ côi
  const r = tmp();
  W(r, 'docs/plans/2026-01-01-hat-giong-chan-1.md', '# a\n'); W(r, '_acceptance/chan-1/opportunity.md', stub({ slug: 'chan-1' }));
  W(r, 'docs/plans/2026-01-01-hat-giong-chan-2.md', '# b\n'); W(r, '_acceptance/khac/contract.md', '---\nstatus: draft\n---\nSource input: `docs/plans/2026-01-01-hat-giong-chan-2.md`\n');
  W(r, 'docs/plans/2026-01-01-hat-giong-chan-3.md', '# c — trạng thái ở `_acceptance/khac/`\n');
  W(r, 'docs/plans/2026-01-01-hat-giong-mo-coi.md', '# d\n');
  const of = orphans(path.join(r, 'docs', 'plans'), path.join(r, '_acceptance'));
  if (of.join(',') !== '2026-01-01-hat-giong-mo-coi.md') errs.push(`fixture ba chân: mồ côi = ${JSON.stringify(of)} (mong đúng một file mo-coi)`);
  // chiều đỏ 2: một file thật «đổi tên ra khỏi pattern» → tập-con đỏ nêu đúng slug
  const renamed = slugs.filter(s => s !== 'o-nuot-luat');
  const miss2 = [...NEW, ...OLD].filter(s => !renamed.includes(s));
  if (miss2.join(',') !== 'o-nuot-luat') errs.push(`đổi tên o-nuot-luat mà tập-con không nêu đúng nó: ${miss2.join(',')}`);
  // (ii) stub thật: bắt đầu «---», không hỏng, duong-do ở inProgress S1, 6 còn lại considering
  const j = scan(ROOT);
  for (const s of NEW) {
    const p = path.join(acc, s, 'opportunity.md');
    if (!existsSync(p)) { errs.push(`thiếu stub ${s}`); continue; }
    if (!readFileSync(p, 'utf8').startsWith('---\n')) errs.push(`stub ${s} không bắt đầu ở ---`);
    if ((j.broken || []).some(x => x.slug === s)) errs.push(`stub ${s} ở broken[]`);
    const tenFirst = readFileSync(path.join(plans, seeds.find(f => f.match(SEED_RE)[1] === s)), 'utf8').split('\n').slice(0, 10).join('\n');
    if (/chờ Cổng 0|HẠT GIỐNG|ĐỀ XUẤT/.test(tenFirst)) errs.push(`${s}: 10 dòng đầu còn lời khai trạng thái`);
    if (!tenFirst.includes(`_acceptance/${s}/opportunity.md`)) errs.push(`${s}: 10 dòng đầu thiếu con trỏ tới stub`);
  }
  if (!(j.groups.inProgress || []).some(x => x.slug === 'duong-do-trong-dinh-nghia-xong' && x.nextStep === 'S1')) errs.push('duong-do không ở inProgress S1');
  const cons = slugsIn(j.groups.considering);
  for (const s of NEW.filter(s => s !== 'duong-do-trong-dinh-nghia-xong')) if (!cons.includes(s)) errs.push(`${s} không ở considering`);
  if (errs.length) fail('VC8', errs.join(' · ')); else pass('VC8', 'mọi hạt giống có ô (ba chân, vũ trụ ≥ 13); 7 stub sống; trạng thái sống một chỗ');
}
```

- [ ] **Step 5: chạy** `VC_CASES=VC8 node tests/plugins/vao-co-o.test.mjs`; `node scripts/product-map.mjs --root . --check`.

- [ ] **Step 6: Commit** `git add _acceptance/*/opportunity.md docs/plans PRODUCT-MAP.md tests/plugins/vao-co-o.test.mjs && git commit -m "chore(hat-giong): 7 hạt giống vào ô _acceptance — trạng thái sống một chỗ; bản đồ vẽ lại"`.

### Task 5: bốn suite + sửa evals E4 + hợp đồng sang implemented

- [ ] **Step 1:** `bash tests/plugins/run-tests.sh 2>&1 | tail -5` · `bash tests/scripts/run-tests.sh | tail -3` · `bash tests/hooks/run-tests.sh | tail -3` · `bash tests/workflows/run-tests.sh | tail -3` — mỗi suite in số ca và exit 0 (không trích «N/N xanh» khi chưa thấy số ca).
- [ ] **Step 2:** evals E4 `expected`: mutant là «gỡ --diff-filter=A thành -1» (khớp VC4).
- [ ] **Step 3:** contract `status: implemented`; commit `acceptance(vao-co-o-ra-co-ten): S3 xong — contract sang implemented`.
