# start-command Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lệnh `/start` — người gõ một lệnh, `scripts/start-scan.mjs` quét `_acceptance/*/` xếp mỗi việc đúng một ô, thẻ 3 nhóm trình cho người chọn một chữ cái, bàn giao sang nghi thức đích; khoá model-invocation cả 2 harness.

**Architecture:** Phân loại nằm trong script (JSON máy-đọc, test trên fixture code-sinh); prose nằm trong `commands/start.md` (Claude) + `codex/acceptance-gate/skills/start/SKILL.md` (Codex). Seam script↔lệnh giữ bằng khối marker `START-SCAN-KEYS` + case round-trip (mẫu P55). Nguồn sự thật phân ô: bảng trong spec `docs/specs/2026-08-03-start-command-design.md`.

**Tech Stack:** Node ESM (`.mjs`) + `lib/evidence-core.js` (CJS, qua `createRequire`) cho frontmatter; bash+python3+node heredoc trong `tests/plugins/run-tests.sh`.

## Global Constraints

- Contract: `_acceptance/start-command/contract.md` (15 AC) · Evals: `evals.yaml` E1–E15. Mọi case máy chạy trong `tests/plugins/run-tests.sh`.
- Assertion âm tính PHẢI có đối chứng dương + ghim đúng thông điệp (CLAUDE.md); fixture do CODE SINH trong chính lần chạy; mọi path suy từ vị trí script/`$ROOT`, không hardcode checkout.
- Script chỉ-đọc tuyệt đối (AC-9). Không viết parser frontmatter mới — dùng `frontmatterField` của `lib/evidence-core.js`.
- Mirror: sửa nguồn xong PHẢI chạy `scripts/sync-plugin-packages.sh` và commit `plugins/` cùng lượt (P30).
- Ngôn ngữ mặt người (`skills/acceptance/references/human-facing-language.md`) cho mọi khuôn chữ hiện cho người trong thân lệnh.
- Version bump acceptance-gate → `1.28.0` ở CẢ BA manifest (`.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `codex/acceptance-gate/.codex-plugin/plugin.json`) — P03 giữ khớp.
- P-number mới: P98 (scan suite) · P99 (round-trip keys) · P100 (con trỏ trong gói cho start) · P101 (nạp luật ngôn ngữ + mục docs). P31/P32 chỉ MỞ RỘNG danh sách LOCKED.

---

### Task 1: `scripts/start-scan.mjs` + case P98 (fixture code-sinh)

**Phục vụ:** E1, E2, E3, E4, E5, E6, E9. **independent:** false (nền của mọi task sau).
**Verify per-task:** `bash tests/plugins/run-tests.sh 2>&1 | grep -E 'P98|FAIL'`

**Files:**
- Create: `scripts/start-scan.mjs`
- Modify: `tests/plugins/run-tests.sh` (thêm P98 sau P97)

**Interfaces:**
- Consumes: `frontmatterField(payload, key)` từ `lib/evidence-core.js` (CJS).
- Produces: CLI `node scripts/start-scan.mjs --root <dir>` in JSON một dòng ra stdout, exit 0 cả khi config vắng. Schema (nguồn sự thật cho Task 2/4):

```json
{ "schema_version": 1, "config": true,
  "git": { "branch": "main", "dirty": false },
  "groups": {
    "gates":      [ { "slug": "x", "gate": "dang|pham-vi|bang-chung", "since": "ISO", "tier": "T2" } ],
    "inProgress": [ { "slug": "x", "status": "approved", "nextStep": "S1|S2|S3|S3-fix|S4", "tier": "T2" } ],
    "done":       [ { "slug": "x", "state": "signed-off|park|kill" } ] },
  "skipped": [ { "source": "PRODUCT-MAP.md", "reason": "chưa có — F-B" } ],
  "broken":  [ { "slug": "x", "file": "contract.md", "reason": "frontmatter không parse được" } ] }
```

- [ ] **Step 1: Viết case P98 (RED)** — thêm vào cuối `tests/plugins/run-tests.sh` (trước khối tổng kết `failures`):

```bash
# ── P98: start-scan.mjs — phân ô trên fixture CODE-SINH (E1-E6, E9) ─────────
# Fixture sinh trong chính lần chạy; đối chứng dương (bản nguyên vẹn XANH)
# trước bản tiêm hỏng (ghim đúng thông điệp). Bảng phân ô = spec start-command.
run "P98 start-scan phan o du moi hang bang + broken/skipped/readonly/gate-order" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p98-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status, extra = '') =>
  `---\nschema_version: 1\nfeature: f-${slug}\nslug: ${slug}\nowner: t@t\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${extra}---\n# C\n`;
const opp = (slug, stage, decision) =>
  `---\nschema_version: 1\nslug: ${slug}\nfeature: f\nowner: t@t\nstage: ${stage}\ndecision: ${decision}\n---\n# O\n`;
const evidence = (verdict, extra = '') =>
  `---\nschema_version: 2\nslug: x\nverdict: ${verdict}\nhuman_signoff:\n${extra}---\n# E\n`;

// ---- 1. Fixture NGUYÊN VẸN: đủ MỌI HÀNG bảng phân ô của spec ----
W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/a-opp-moi/opportunity.md', opp('a-opp-moi', 'discovery', ''));          // chờ-Cổng-Đáng
W('_acceptance/b-opp-thieu-decision/opportunity.md', opp('b-opp-thieu-decision', 'decided', '')); // thiếu decision → chờ-Cổng-Đáng
W('_acceptance/c-opp-build/opportunity.md', opp('c-opp-build', 'decided', 'build'));   // đang-dở S1
W('_acceptance/d-opp-iterate/opportunity.md', opp('d-opp-iterate', 'decided', 'iterate')); // đang-dở S1
W('_acceptance/e-opp-park/opportunity.md', opp('e-opp-park', 'decided', 'park'));      // done park
W('_acceptance/f-draft/contract.md', contract('f-draft', 'draft'));                    // chờ-Cổng-Phạm-vi
W('_acceptance/g-approved/contract.md', contract('g-approved', 'approved'));           // đang-dở S2 (không plan)
W('_acceptance/h-approved-plan/contract.md', contract('h-approved-plan', 'approved')); // đang-dở S3 (có plan)
W('docs/superpowers/plans/2026-01-01-h-approved-plan.md', '# plan\n');
W('_acceptance/i-implemented/contract.md', contract('i-implemented', 'implemented'));  // đang-dở S4
W('_acceptance/j-reject/contract.md', contract('j-reject', 'implemented'));            // đang-dở S3-fix
W('_acceptance/j-reject/evidence-report.md', evidence('REJECT'));
W('_acceptance/k-pass/contract.md', contract('k-pass', 'verified', 'approved_at: 2026-01-02T00:00:00Z\n')); // chờ-Cổng-Bằng-chứng
W('_acceptance/k-pass/evidence-report.md', evidence('PASS'));
W('_acceptance/l-pending/contract.md', contract('l-pending', 'verified', 'approved_at: 2026-01-01T00:00:00Z\n')); // chờ-Cổng-Bằng-chứng (PENDING)
W('_acceptance/l-pending/evidence-report.md', evidence('PENDING-JUDGMENT'));
W('_acceptance/m-signed/contract.md', contract('m-signed', 'signed-off'));             // đã-ký

const scan = dir => JSON.parse(execFileSync('node', [SCAN, '--root', dir], { encoding: 'utf8' }));
const die = m => { console.error(m); process.exit(1); };

// snapshot cây file TRƯỚC scan (AC-9)
const tree = d => execFileSync('find', [d, '-type', 'f', '-newer', d], { encoding: 'utf8' });
const before = execFileSync('bash', ['-c', `cd ${JSON.stringify(tmp)} && find . -type f -exec md5 -q {} + | md5 -q`], { encoding: 'utf8' });

const r = scan(tmp);
if (r.config !== true) die('doi chung duong: config:true phai co');

// Mỗi slug đúng MỘT ô, đối chiếu từng hàng đích danh (AC-2, AC-3)
const want = {
  gates: { 'a-opp-moi': 'dang', 'b-opp-thieu-decision': 'dang', 'f-draft': 'pham-vi', 'k-pass': 'bang-chung', 'l-pending': 'bang-chung' },
  inProgress: { 'c-opp-build': 'S1', 'd-opp-iterate': 'S1', 'g-approved': 'S2', 'h-approved-plan': 'S3', 'i-implemented': 'S4', 'j-reject': 'S3-fix' },
  done: { 'e-opp-park': 'park', 'm-signed': 'signed-off' },
};
for (const [slug, gate] of Object.entries(want.gates)) {
  const hit = r.groups.gates.find(g => g.slug === slug);
  if (!hit || hit.gate !== gate) die(`slug ${slug} phai vao o gate=${gate}, duoc: ${JSON.stringify(hit)}`);
}
for (const [slug, step] of Object.entries(want.inProgress)) {
  const hit = r.groups.inProgress.find(g => g.slug === slug);
  if (!hit || hit.nextStep !== step) die(`slug ${slug} phai nextStep=${step}, duoc: ${JSON.stringify(hit)}`);
}
for (const [slug, state] of Object.entries(want.done)) {
  const hit = r.groups.done.find(g => g.slug === slug);
  if (!hit || hit.state !== state) die(`slug ${slug} phai done state=${state}, duoc: ${JSON.stringify(hit)}`);
}
const total = r.groups.gates.length + r.groups.inProgress.length + r.groups.done.length + r.broken.length;
if (total !== 13) die(`tong slug vao o phai 13 (khong sot khong trung), duoc ${total}`);

// skipped nêu TÊN nguồn vắng (AC-5)
for (const src of ['PRODUCT-MAP.md', 'phiên-nghiệm-thu'])
  if (!r.skipped.some(s => s.source === src)) die(`skipped[] thieu nguon co ten ${src}`);

// gate-order: frontmatter approved_at THẮNG mtime (AC-6) — k-pass approved_at MỚI hơn
// l-pending, nhưng ta chạm mtime l-pending cho MỚI nhất → thứ tự vẫn theo frontmatter
const now = new Date();
fs.utimesSync(path.join(tmp, '_acceptance/l-pending/contract.md'), now, now);
const r2 = scan(tmp);
const bc = r2.groups.gates.filter(g => g.gate === 'bang-chung').map(g => g.slug);
if (bc[0] !== 'l-pending') die(`cong cho lau nhat (approved_at cu nhat) phai len dau: ${bc}`);
// đối chứng rơi-về-mtime: xoá approved_at cả hai → mtime quyết định
for (const s of ['k-pass', 'l-pending'])
  W(`_acceptance/${s}/contract.md`, contract(s, 'verified'));
W('_acceptance/k-pass/evidence-report.md', evidence('PASS'));
W('_acceptance/l-pending/evidence-report.md', evidence('PENDING-JUDGMENT'));
const old = new Date(Date.now() - 864e5);
fs.utimesSync(path.join(tmp, '_acceptance/k-pass/contract.md'), old, old);
const bc2 = scan(tmp).groups.gates.filter(g => g.gate === 'bang-chung').map(g => g.slug);
if (bc2[0] !== 'k-pass') die(`thieu frontmatter phai roi ve mtime: ${bc2}`);

// readonly (AC-9): cây file sau mọi lần scan giống hệt
const after = execFileSync('bash', ['-c', `cd ${JSON.stringify(tmp)} && find . -type f -exec md5 -q {} + | md5 -q`], { encoding: 'utf8' });
if (before !== after) die('scan da cham vao cay file — vi pham chi-doc');

// ---- 2. Tiêm hỏng (AC-4): đối chứng dương ĐÃ xanh ở trên ----
W('_acceptance/f-draft/contract.md', 'status: draft\nkhong co frontmatter fence\n');
const r3 = scan(tmp);
const bad = r3.broken.find(b => b.slug === 'f-draft');
if (!bad) die('slug hong phai vao broken[], khong duoc im lang bo qua');
if (bad.file !== 'contract.md' || !/frontmatter/.test(bad.reason))
  die(`broken phai ghim file+reason frontmatter, duoc: ${JSON.stringify(bad)}`);
if (!r3.groups.inProgress.find(g => g.slug === 'g-approved')) die('slug lanh phai phan o binh thuong khi co slug hong');
if (r3.groups.gates.find(g => g.slug === 'f-draft')) die('slug hong khong duoc dong thoi nam trong gates');

// ---- 3. Config vắng (AC-1) ----
const tmp2 = fs.mkdtempSync(path.join(os.tmpdir(), 'p98b-'));
const r4 = scan(tmp2);
if (r4.config !== false) die('repo chua co config.yaml phai tra config:false, exit 0');
console.log('P98 OK');
JS
```

- [ ] **Step 2: Chạy P98, xác nhận FAIL** — `bash tests/plugins/run-tests.sh 2>&1 | grep -A1 P98` → FAIL (script chưa tồn tại).

- [ ] **Step 3: Viết `scripts/start-scan.mjs`:**

```js
#!/usr/bin/env node
// start-scan.mjs — bộ quét vào phiên của /start: đọc _acceptance/*/ và xếp mỗi
// slug đúng MỘT ô theo bảng phân ô trong docs/specs/2026-08-03-start-command-design.md.
// CHỈ-ĐỌC tuyệt đối. Đầu ra: JSON một dòng (schema_version 1) — các key mà
// commands/start.md đọc được ghim trong khối START-SCAN-KEYS của chính file đó;
// case P99 round-trip giữ hai đầu khớp. Ô chưa có nguồn (PRODUCT-MAP, phiên
// nghiệm thu) emit skipped[] có tên — KHÔNG bịa dữ liệu (ledger d-descope 03/08).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.js'));

const args = process.argv.slice(2);
const rootIx = args.indexOf('--root');
const root = path.resolve(rootIx >= 0 ? args[rootIx + 1] : '.');
const out = obj => { process.stdout.write(JSON.stringify(obj) + '\n'); };

const acc = path.join(root, '_acceptance');
const base = { schema_version: 1 };
if (!existsSync(path.join(acc, 'config.yaml'))) { out({ ...base, config: false }); process.exit(0); }

const read = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
// frontmatter hợp lệ = có fence mở + đóng; field đọc qua evidence-core
const hasFm = t => t != null && /^---\n[\s\S]*?\n---/.test(t);
const git = (() => {
  try {
    const branch = execFileSync('git', ['-C', root, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
    const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' }).trim() !== '';
    return { branch, dirty };
  } catch { return { branch: null, dirty: null }; }
})();

const gates = [], inProgress = [], done = [], broken = [];
const planExists = slug => {
  const dirs = [path.join(root, 'docs', 'superpowers', 'plans'), path.join(root, 'docs', 'plans')];
  return dirs.some(d => existsSync(d) && readdirSync(d).some(f => f.includes(slug)));
};
// since: timestamp frontmatter thắng mtime (cổng chờ lâu nhất không được trôi
// xuống chỉ vì file bị format/sync chạm lại)
const since = (file, fmTs) => fmTs || statSync(file).mtime.toISOString();

for (const entry of (existsSync(acc) ? readdirSync(acc, { withFileTypes: true }) : [])) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name;
  const dir = path.join(acc, slug);
  const cPath = path.join(dir, 'contract.md'), oPath = path.join(dir, 'opportunity.md');
  const cTxt = read(cPath), oTxt = read(oPath);
  if (cTxt != null) {
    if (!hasFm(cTxt)) { broken.push({ slug, file: 'contract.md', reason: 'frontmatter không parse được' }); continue; }
    const status = (frontmatterField(cTxt, 'status') || '').toLowerCase();
    const tier = frontmatterField(cTxt, 'risk_tier') || null;
    const eTxt = read(path.join(dir, 'evidence-report.md'));
    const verdict = eTxt != null && hasFm(eTxt) ? (frontmatterField(eTxt, 'verdict') || '').toUpperCase() : null;
    if (eTxt != null && !hasFm(eTxt)) { broken.push({ slug, file: 'evidence-report.md', reason: 'frontmatter không parse được' }); continue; }
    if (status === 'signed-off') done.push({ slug, state: 'signed-off' });
    else if (status === 'verified') gates.push({ slug, gate: 'bang-chung', since: since(cPath, frontmatterField(cTxt, 'approved_at')), tier });
    else if (status === 'implemented') inProgress.push({ slug, status, nextStep: verdict === 'REJECT' ? 'S3-fix' : 'S4', tier });
    else if (status === 'approved') inProgress.push({ slug, status, nextStep: planExists(slug) ? 'S3' : 'S2', tier });
    else if (status === 'draft') gates.push({ slug, gate: 'pham-vi', since: since(cPath, null), tier });
    else broken.push({ slug, file: 'contract.md', reason: `status không nhận diện được: ${status || '(rỗng)'}` });
  } else if (oTxt != null) {
    if (!hasFm(oTxt)) { broken.push({ slug, file: 'opportunity.md', reason: 'frontmatter không parse được' }); continue; }
    const stage = (frontmatterField(oTxt, 'stage') || '').toLowerCase();
    const decision = (frontmatterField(oTxt, 'decision') || '').toLowerCase();
    if (stage !== 'decided' || !decision) gates.push({ slug, gate: 'dang', since: since(oPath, frontmatterField(oTxt, 'decided_at')), tier: null });
    else if (decision === 'build' || decision === 'iterate') inProgress.push({ slug, status: 'opportunity-decided', nextStep: 'S1', tier: null });
    else if (decision === 'park' || decision === 'kill') done.push({ slug, state: decision });
    else broken.push({ slug, file: 'opportunity.md', reason: `decision không nhận diện được: ${decision}` });
  } else {
    broken.push({ slug, file: '(workspace)', reason: 'không có contract.md lẫn opportunity.md' });
  }
}
gates.sort((a, b) => String(a.since).localeCompare(String(b.since)));

const skipped = [{ source: 'phiên-nghiệm-thu', reason: 'nguồn chưa dựng — F-B' }];
if (!existsSync(path.join(root, 'PRODUCT-MAP.md'))) skipped.unshift({ source: 'PRODUCT-MAP.md', reason: 'chưa có — F-B' });

out({ ...base, config: true, git, groups: { gates, inProgress, done }, skipped, broken });
```

- [ ] **Step 4: Chạy P98 → PASS**; chạy cả suite plugins xác nhận không vỡ case cũ.
- [ ] **Step 5: Commit** — `git add scripts/start-scan.mjs tests/plugins/run-tests.sh && git commit -m "feat(start): start-scan.mjs — bộ quét phân ô vào phiên + P98 fixture code-sinh"`

---

### Task 2: `commands/start.md` (Claude) — khuôn thẻ + marker + lock

**Phục vụ:** E7, E8, E10, E13, E15 (vật liệu; test ở Task 4). **independent:** false (cần schema JSON Task 1).
**Verify per-task:** `grep -c 'disable-model-invocation: true' commands/start.md` → 1; khối `START-SCAN-KEYS` tồn tại.

**Files:**
- Create: `commands/start.md`

**Interfaces:**
- Consumes: JSON của `start-scan.mjs` (schema Task 1), `human-facing-language.md`.
- Produces: khối marker `<!-- <<<START-SCAN-KEYS … START-SCAN-KEYS>>> -->` liệt kê MỌI key JSON thân lệnh đọc — P99 rút danh sách này đối chiếu với output script thật.

- [ ] **Step 1: Viết `commands/start.md`** (frontmatter + các bước đánh số, khuôn acceptance-status/card):

```markdown
---
description: Mở phiên làm việc — quét xưởng, trình thẻ 3 nhóm, người chọn một chữ cái rồi bàn giao
disable-model-invocation: true
---

Nghi thức vào phiên. Lệnh CHỈ định hướng + bàn giao — không đọc/ghi file sản
phẩm, không sửa gì, không tự làm nội dung thay nghi thức đích.

1. **Quét máy, không hỏi người:** chạy
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/start-scan.mjs --root .` → JSON.
   `config` là `false` → in đúng một dòng: "Repo này chưa dựng cổng nghiệm thu —
   chạy `/acceptance-init` trước." rồi DỪNG.

   Các key JSON lệnh này đọc (máy đối chiếu với đầu ra script thật — đổi tên
   một phía là kiểm thử đỏ):
   <!-- <<<START-SCAN-KEYS
   config
   git.branch git.dirty
   groups.gates[].slug groups.gates[].gate groups.gates[].since groups.gates[].tier
   groups.inProgress[].slug groups.inProgress[].status groups.inProgress[].nextStep groups.inProgress[].tier
   groups.done[].slug groups.done[].state
   skipped[].source skipped[].reason
   broken[].slug broken[].file broken[].reason
   START-SCAN-KEYS>>> -->

2. **Nạp luật TRƯỚC khi viết:** đọc
   `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử) TRƯỚC bất kỳ câu nào hiện cho người. Mỗi lần
   render là một lần đọc — luật không sống trong trí nhớ.

3. **Trình MỘT thẻ, ba nhóm, đúng thứ tự:**
   - **Chờ chữ ký của anh** (`groups.gates`, đã xếp cổng chờ lâu nhất lên đầu):
     mỗi cổng một dòng — cổng nào (`dang` = Cổng Đáng · `pham-vi` = Cổng Phạm vi
     · `bang-chung` = Cổng Bằng chứng), của việc nào, ước ~10′.
   - **Đang dở** (`groups.inProgress`): mỗi vòng một dòng — *người dùng sẽ được
     gì* (đọc 1 câu từ tên feature, KHÔNG mở file sản phẩm) + bước kế
     (`nextStep`).
   - **Bắt đầu việc mới** — đúng ba lối: (a) ý còn mơ hồ → buổi khai thác vòng
     HIỂU; (b) việc đã rõ → `/feature-loop <mô tả>`; (c) việc vặt khớp miễn T1
     → sửa thẳng.
   - Dưới thẻ: mỗi phần tử `skipped[]` in đúng một dòng "(bỏ qua `source` —
     `reason`)"; mỗi phần tử `broken[]` một dòng cờ hỏng kèm `file` + `reason`.
   - `groups.done` chỉ đếm gộp một dòng cuối thẻ.

4. **MỘT câu hỏi chọn bằng chữ cái/số dòng.** Người chọn xong → bàn giao:
   - Cổng → `/acceptance-card <slug>`.
   - Vòng dở → `/feature-loop <slug>` — NHƯNG nếu `git.dirty` là `true` (hoặc
     phiên đang đứng cây chung với vòng khác): nhắc mở worktree/phiên riêng
     TRƯỚC, chưa đưa lệnh resume.
   - Việc mới → lối (a)/(b)/(c) ở trên.

5. Lệnh KHÔNG tự làm nội dung. Bàn giao xong là hết vai.
```

- [ ] **Step 2: Tự soát 6 luật** — chạy hai phép thử (xoá-tên-máy, người-thứ-ba) trên các câu khuôn; mã máy (`nextStep`, `slug`…) chỉ nằm trong ngoặc/backtick chỉ dẫn cho model, không trong câu hiện cho người.
- [ ] **Step 3: Commit** — `git add commands/start.md && git commit -m "feat(start): commands/start.md — thẻ 3 nhóm + marker START-SCAN-KEYS + lock"`

---

### Task 3: Codex skill `start` (SKILL.md + openai.yaml)

**Phục vụ:** E7, E8, E10, E14, E15 (vật liệu). **independent:** false (parity với Task 2).
**Verify per-task:** `test -f codex/acceptance-gate/skills/start/agents/openai.yaml && grep -q 'allow_implicit_invocation: false' codex/acceptance-gate/skills/start/agents/openai.yaml`

**Files:**
- Create: `codex/acceptance-gate/skills/start/SKILL.md`
- Create: `codex/acceptance-gate/skills/start/agents/openai.yaml`

**Interfaces:**
- Consumes: cùng JSON schema Task 1; trong gói Codex script nằm ở `${PLUGIN_ROOT}/scripts/start-scan.mjs`, bản luật ở `${PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md` (cùng gói — ghép gốc gói, KHÔNG cần bộ giải).
- Produces: parity đủ 5 bước của Task 2, tiếng Anh khung + giữ nguyên tên nhóm tiếng Việt hiện cho người.

- [ ] **Step 1: Viết `SKILL.md`** — dịch khung Task 2 sang khuôn Codex (như acceptance-status codex): name/description frontmatter, cùng 5 bước, cùng khối `<!-- <<<START-SCAN-KEYS … >>> -->` (chép NGUYÊN VĂN danh sách key — P99 kiểm cả hai file), path qua `${PLUGIN_ROOT}/`. Description: "Open a work session: scan the acceptance workspace, present a three-group card (awaiting signature · in progress · start new), hand off after the human picks one line. Human-typed entry ritual — never self-invoke."
- [ ] **Step 2: Viết `agents/openai.yaml`:**

```yaml
interface:
  display_name: "Start Session"
  short_description: "Scan the workspace and present the session entry card"
policy:
  allow_implicit_invocation: false
```

- [ ] **Step 3: Commit** — `git add codex/acceptance-gate/skills/start && git commit -m "feat(start): codex skill start — parity 2 harness, khoá implicit invocation"`

---

### Task 4: Tests — mở rộng P31/P32 + P99 round-trip + P100 con trỏ + P101 luật ngôn ngữ & docs

**Phục vụ:** E10, E13, E14, E15, E11. **independent:** false (cần Task 1–3).
**Verify per-task:** `bash tests/plugins/run-tests.sh 2>&1 | grep -E 'P31|P32|P99|P100|P101|FAIL'`

**Files:**
- Modify: `tests/plugins/run-tests.sh` — 2 danh sách `LOCKED` (dòng ~465, ~482) + 3 case mới sau P98.

- [ ] **Step 1: Mở rộng LOCKED (RED trước):** đổi CẢ HAI dòng thành
  `LOCKED = ["approve", "signoff", "acceptance-init", "acceptance-status", "acceptance-report", "start"]`
  Chạy → P31/P32 phải PASS ngay nếu Task 2/3 đúng; nếu FAIL đọc thông điệp (đó chính là RED có nghĩa).
- [ ] **Step 2: Viết P99 (round-trip key, mẫu P55):**

```bash
# ── P99: ROUND-TRIP key JSON — rút từ khối START-SCAN-KEYS của HAI thân lệnh,
# đối chiếu với đầu ra start-scan.mjs THẬT trên fixture code-sinh (E13) ───────
run "P99 round-trip START-SCAN-KEYS <-> start-scan output (2 harness)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const die = m => { console.error(m); process.exit(1); };
const SOURCES = ['commands/start.md', 'codex/acceptance-gate/skills/start/SKILL.md'];

const extractKeys = txt => {
  const m = txt.match(/<<<START-SCAN-KEYS\n([\s\S]*?)START-SCAN-KEYS>>>/);
  if (!m) return null;
  return m[1].split(/\s+/).filter(Boolean);
};
// fixture tối thiểu 1 slug mỗi nhóm để mọi key mảng có phần tử thật mà soi
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p99-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/w-draft/contract.md', '---\nslug: w-draft\nrisk_tier: T2\nstatus: draft\n---\n');
W('_acceptance/w-go/contract.md', '---\nslug: w-go\nrisk_tier: T2\nstatus: approved\n---\n');
W('_acceptance/w-done/contract.md', '---\nslug: w-done\nrisk_tier: T2\nstatus: signed-off\n---\n');
W('_acceptance/w-bad/contract.md', 'khong fence\n');
const outJson = JSON.parse(execFileSync('node',
  [path.join(root, 'scripts/start-scan.mjs'), '--root', tmp], { encoding: 'utf8' }));

const resolveKey = (obj, dotted) => dotted.split('.').reduce((acc, part) => {
  if (acc === undefined || acc === null) return undefined;
  if (part.endsWith('[]')) {
    const arr = acc[part.slice(0, -2)];
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    return arr[0];
  }
  return acc[part];
}, obj);

const check = files => {
  const errs = [];
  for (const rel of files) {
    const keys = extractKeys(fs.readFileSync(path.join(root, rel), 'utf8'));
    if (!keys) { errs.push(`${rel}: không rút được khối START-SCAN-KEYS`); continue; }
    for (const k of keys)
      if (resolveKey(outJson, k) === undefined)
        errs.push(`${rel}: key ${k} không có trong đầu ra start-scan thật`);
  }
  return errs;
};
const e0 = check(SOURCES);
if (e0.length) die('doi chung duong FAIL: ' + JSON.stringify(e0));   // bản thật XANH
// đột biến: đổi tên một key phía LỆNH → phải ĐỎ đúng thông điệp
const tmpCmd = path.join(tmp, 'start-doi-key.md');
fs.writeFileSync(tmpCmd, fs.readFileSync(path.join(root, SOURCES[0]), 'utf8')
  .replace('skipped[].source', 'sources_skipped[].source'));
const relTmp = path.relative(root, tmpCmd);
const e1 = check([relTmp]);
if (!e1.some(x => /key sources_skipped\[\]\.source không có/.test(x)))
  die('dot bien doi ten key khong bi bat dung thong diep: ' + JSON.stringify(e1));
console.log('P99 OK');
JS
```

- [ ] **Step 3: Viết P100 (con trỏ trong gói, họ P95):** python heredoc — với gói Claude (root = repo): mọi chuỗi `scripts/start-scan.mjs` + `skills/acceptance/references/human-facing-language.md` trong `commands/start.md` phải là file tồn tại tính từ root; với gói Codex (`plugins/acceptance-gate`): cùng hai con trỏ trong `skills/start/SKILL.md` phải tồn tại TRONG gói. Đối chứng dương trên gói thật; đột biến trên BẢN SAO tempdir: đổi tên `scripts/start-scan.mjs` trong bản sao gói → check phải trả lỗi ghim chuỗi "tro file khong ton tai"; khôi phục, xoá dòng `${PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md` khỏi SKILL bản sao → lỗi "khong rut duoc con tro ban luat". (Khuôn hàm `check(pkg)` trả list lỗi, assert bằng thông điệp — chép dáng P95.)
- [ ] **Step 4: Viết P101 (nạp luật + mục docs):** bash/python — (a) cả `commands/start.md` lẫn codex `skills/start/SKILL.md` phải chứa con trỏ `human-facing-language.md` TRƯỚC (theo vị trí chuỗi) khối trình thẻ (grep vị trí: index của chuỗi nạp < index chuỗi "ba nhóm"/"three-group"); đột biến bản sao xoá dòng nạp → ĐỎ ghim "thiếu bước nạp luật ngôn ngữ"; (b) `GUIDE.md` và `README.md` chứa heading/mục `/start` với đủ chuỗi "vào phiên"; đột biến bản sao GUIDE xoá mục → ĐỎ ghim "GUIDE thiếu mục vào phiên bằng /start".
- [ ] **Step 5: Chạy toàn suite plugins → PASS. Commit** — `git add tests/plugins/run-tests.sh && git commit -m "test(start): P31/P32 +start, P99 round-trip, P100 con trỏ gói, P101 luật ngôn ngữ + docs"`

---

### Task 5: GUIDE.md + README.md — mục "vào phiên bằng /start"

**Phục vụ:** E11. **independent:** true (không đụng file task khác; P101(b) đo).
**Verify per-task:** `grep -n '/start' GUIDE.md README.md | head`

**Files:**
- Modify: `GUIDE.md` (thêm section sau "## Gap-probe S1 …", trước "## 5. Cài đặt")
- Modify: `README.md` (một đoạn ngắn trong phần lệnh/quy trình)

- [ ] **Step 1: GUIDE.md** — section `## Vào phiên bằng /start (1.28.0)`: vấn đề (bước 0 là prompt-lottery), hành vi (người gõ → máy quét xếp ô → thẻ 3 nhóm → một chữ cái → bàn giao), bảng 3 nhóm là gì, vì sao khoá model-invocation (cùng lý ADR 0002), hai nguồn chưa dựng thì thẻ nói tên (PRODUCT-MAP, phiên nghiệm thu — F-B). Viết theo 6 luật mặt người.
- [ ] **Step 2: README.md** — thêm `/start` vào danh sách lệnh với 1 câu: "Mở phiên làm việc: máy quét xưởng, trình thẻ ba nhóm — chờ ký · đang dở · việc mới — anh chọn một chữ cái là vào đúng nghi thức."
- [ ] **Step 3: Commit** — `git add GUIDE.md README.md && git commit -m "docs(start): mục vào phiên bằng /start trong GUIDE + README"`

---

### Task 6: Version bump + mirror sync + full suites

**Phục vụ:** E12 (+ P03 giữ version khớp). **independent:** false (chạy CUỐI).
**Verify per-task:** `bash scripts/sync-plugin-packages.sh --check && bash tests/plugins/run-tests.sh && bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/workflows/run-tests.sh`

**Files:**
- Modify: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `codex/acceptance-gate/.codex-plugin/plugin.json` — version `1.28.0`, description thêm từ khoá "/start session entry".
- Regenerate: `plugins/` qua `bash scripts/sync-plugin-packages.sh`

- [ ] **Step 1:** Bump version 3 manifest (giữ khớp nhau — P03).
- [ ] **Step 2:** `bash scripts/sync-plugin-packages.sh` (write mode) → mirror cập nhật.
- [ ] **Step 3:** Chạy đủ 4 suite + `--check` → tất cả PASS.
- [ ] **Step 4: Commit nguồn + mirror CÙNG LƯỢT** — `git add .claude-plugin .codex-plugin codex/acceptance-gate/.codex-plugin plugins && git commit -m "chore(release): acceptance-gate 1.28.0 — /start + mirror sync"`

---

## Self-review (đã chạy)

- Spec coverage: 10 hàng bảng phân ô → P98 fixture đủ hàng; 3 nhóm + skip-có-tên + worktree + khoá + docs + mirror → Task 2–6. Không hàng spec nào thiếu task.
- Type consistency: key JSON trong marker Task 2 = schema Task 1 = assert P98/P99; tên gate `dang|pham-vi|bang-chung` thống nhất script/lệnh/test.
- Placeholder: không còn TBD/TODO; mọi case có code hoặc khuôn chép-dáng có tên (P95/P55) + thông điệp ghim đích danh.
