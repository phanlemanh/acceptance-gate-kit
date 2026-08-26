# Ra có tên ở Vòng LÀM và TRAO — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm trạng thái hợp đồng `machine-cleared`, dạy thẻ + `/approve` Cổng Đáng, cho ô ngưỡng bốn trạng thái với lối `Không đo được — `, cho `archived`/timebox một bộ đọc — mọi bộ đọc cùng chữ, 0 hồ sơ cũ hoá hỏng.

**Architecture:** Ba seam, một bảng chữ. (1) `lib/workspace-record.cjs` giữ enum; `khong-can-nguoi.mjs` + `pre-merge-check.sh` giữ sáu điều kiện; hook + lưới coi `machine-cleared` là lời khai cần bằng chứng. (2) `start-scan.mjs` là bộ phân ô duy nhất; `trang-thai-ho-so.cjs` là bảng chữ; bản đồ + thẻ hỏi hai thứ đó. (3) Hai tiền tố `[đề xuất]` / `Không đo được — ` sống trong khối marker của `opportunity-template.md`, mọi reader rút từ đó.

**Tech Stack:** Node ≥ 18 (ESM `.mjs` + CJS `.cjs`), bash, suite `tests/plugins/run-tests.sh`. Không thư viện mới.

**Spec:** `docs/superpowers/specs/2026-08-23-ra-co-ten-lam-va-trao-design.md` · hợp đồng `_acceptance/ra-co-ten-lam-va-trao/contract.md` (AC-1…AC-15) · `evals.yaml` (E1…E15, mỗi eval ghim `PASS: [RT<n>]`).

## Global Constraints

- `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh` là T3: sửa TỐI THIỂU, mỗi đổi có ca đỏ trước.
- Mọi phép đo mới: cặp hai chiều cùng fixture, fixture code-sinh từ khuôn (`tests/fixtures/from-template.mjs`), đường dẫn suy từ `import.meta.url`, ghim THÔNG ĐIỆP không chỉ exit.
- Chuỗi máy-đọc mới (`machine-cleared` · `[đề xuất]` · `Không đo được — ` · tên khoá mới) sống MỘT chỗ; reader rút hoặc so bằng.
- Chữ mặt người CHỈ vào `scripts/trang-thai-ho-so.cjs`; khoá lạ `chu()` ném lỗi.
- KHÔNG migrate hồ sơ cũ; hai hồ sơ `verified`+làn V (`release-2-0-0`, `release-2-1-0`) giữ nguyên khoá `may-di-tiep-*`.
- KHÔNG kéo Later (A5 · A6 · A10 · A11 · A12); KHÔNG sửa `NEG_RE` của gate-card (ô riêng đã mở).
- Từ vựng: CONTEXT.md — term mới «máy đã thông» phải có mục.
- Commit sau mỗi task; `git add` đích danh (repo tự host: rác gitignored làm bản đồ sai).

---

## File map

| File | Vai | Task |
|---|---|---|
| `skills/acceptance/references/evidence-report-template.md` | khối `EVIDENCE-XANH-SACH-BLOCK` | 1 |
| `skills/acceptance/references/opportunity-template.md` | khối `OPP-DE-XUAT-PREFIX`, `OPP-KHONG-DO-DUOC-PREFIX` | 1 |
| `skills/acceptance/references/contract-template.md` | chú thích enum status | 1 |
| `tests/plugins/ra-co-ten.test.mjs` (MỚI) | ca RT1–RT15 | 1→11 |
| `tests/plugins/run-tests.sh` | đăng ký RT | 1 |
| `lib/workspace-record.cjs` | enum + usesUat/usesEvidence | 2 |
| `lib/evidence-core.cjs` · `hooks/acceptance-evidence-gate.js` | Gate-1 rules cho `machine-cleared`; xung đột chữ ký | 3 |
| `scripts/pre-merge-check.sh` | arm ×3; răng lời khai; xung đột chữ ký | 4 |
| `scripts/trang-thai-ho-so.cjs` · `tests/plugins/bang-dieu-khien.test.mjs` | 4 khoá mới; BDK2 N=24 | 5 |
| `scripts/start-scan.mjs` | nhánh `machine-cleared`; ngưỡng 4 trạng thái; flags; archived; timebox | 6 |
| `scripts/product-map.mjs` · `scripts/gate-card.js` | nhận `machine-cleared` | 7 |
| `scripts/gate-card.js` | thẻ Cổng Đáng (gate 0); cờ đỏ chống lách ở Cổng 1 | 8 |
| `skills/uat-session/SKILL.md` · `feature-loop/skills/feature-loop/SKILL.md` · `skills/acceptance/SKILL.md` · `CONTEXT.md` · `commands/{acceptance-status,acceptance-report,signoff,approve,start}.md` · `skills/acceptance/references/human-facing-language.md` | văn bản nghi thức | 9 |
| `tests/plugins/ra-co-ten.test.mjs` RT13 | đọc-cũ + quét không gian mở | 10 |
| `_acceptance/duong-do-trong-dinh-nghia-xong/{opportunity.md,decisions.jsonl}` | hồ sơ thật thoát | 11 |
| `PRODUCT-MAP.md` · `_acceptance/ra-co-ten-lam-va-trao/contract.md` | vẽ lại; `status: implemented` | 12 |

---

### Task 1: Khuôn có marker + khung file ca + RT1 (nửa khuôn)

**Files:**
- Modify: `skills/acceptance/references/evidence-report-template.md` (sau dòng `human_signoff:` của khối frontmatter, ~dòng 133 — thêm khối comment TRƯỚC `# Evidence Report: {{slug}}`)
- Modify: `skills/acceptance/references/opportunity-template.md:48-60` (section Ngưỡng)
- Modify: `skills/acceptance/references/contract-template.md:42` (dòng `status:`)
- Create: `tests/plugins/ra-co-ten.test.mjs`
- Modify: `tests/plugins/run-tests.sh` (trước khối `ONLY_BLOCK … no-op`)

**Interfaces:**
- Produces: hàm `blockFromTemplate(absPath, marker)` (đã có ở `tests/fixtures/from-template.mjs`) dùng cho ba marker mới: `EVIDENCE-XANH-SACH-BLOCK`, `OPP-DE-XUAT-PREFIX`, `OPP-KHONG-DO-DUOC-PREFIX`.
- Khối xanh-sạch là danh sách 6 dòng, mỗi dòng `<mã> <mô tả>`; mã đúng thứ tự: `verdict-pass` · `bypass` · `enforcement` · `tier` · `uncertain` · `sections`.

- [ ] **Step 1: Thêm khối xanh-sạch vào khuôn báo cáo**

Chèn ngay trước dòng `# Evidence Report: {{slug}}` (sau `---` đóng frontmatter):

```markdown
<!-- Sáu điều kiện xanh-sạch — NGUỒN DUY NHẤT. scripts/khong-can-nguoi.mjs (xanhSach) và
     scripts/pre-merge-check.sh (xanh_sach_check) kiểm ĐÚNG thứ tự này; ca RT1 so round-trip.
     Hai mục cuối phải HIỆN DIỆN-và-rỗng trong báo cáo: vắng ≠ rỗng. -->
<!-- <<<EVIDENCE-XANH-SACH-BLOCK
verdict-pass   verdict: PASS (chỉ PASS mới xanh-sạch)
bypass         bypass_used không true
enforcement    enforcement_mode không off
tier           risk_tier của hợp đồng là T2
uncertain      không có mục UNCERTAIN trong báo cáo
sections       hai mục «Known limits» và «Ngoài hợp đồng» hiện diện và rỗng
EVIDENCE-XANH-SACH-BLOCK>>> -->

## Known limits

## Ngoài hợp đồng
```

(Hai heading rỗng đặt NGAY sau khối để báo cáo sinh từ khuôn có sẵn hai mục — người viết điền hoặc để rỗng.)

- [ ] **Step 2: Thêm hai tiền tố vào khuôn ô cơ hội**

Trong section `## Ngưỡng chết / ngưỡng UAT`, ngay sau các dòng `>` hướng dẫn, trước bullet đầu:

```markdown
> Máy ĐƯỢC đề xuất ngưỡng khi kết buổi khai thác — mỗi bullet mang tiền tố dưới đây
> ngay sau dấu `:`; người ký Cổng Đáng gỡ tiền tố = chốt. Vòng không có người dùng cuối
> → thay các bullet bằng MỘT dòng theo tiền tố «không đo được» (khai tại Cổng Đáng, có lý do).
<!-- <<<OPP-DE-XUAT-PREFIX
[đề xuất]
OPP-DE-XUAT-PREFIX>>> -->
<!-- <<<OPP-KHONG-DO-DUOC-PREFIX
Không đo được — 
OPP-KHONG-DO-DUOC-PREFIX>>> -->

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
- Không đo được — {lý do: vòng nội bộ, ai là người dùng thay thế} ← dòng mẫu, XOÁ khi dùng bullet
```

Chú ý: chuỗi trong khối `OPP-KHONG-DO-DUOC-PREFIX` KẾT THÚC bằng một dấu cách sau gạch dài; `blockFromTemplate` trả `trim()` nên reader phải `+ ' '`? KHÔNG — để tránh lệ thuộc khoảng trắng, reader so bằng `line.trim().startsWith(prefix.trim())` và đòi ký tự kế là khoảng trắng. Ghi luật này vào comment của reader.

- [ ] **Step 3: Chú thích enum trong khuôn hợp đồng**

Dòng 42 của `contract-template.md` thành:

```yaml
status: {status}            # draft | approved | implemented | verified | signed-off | machine-cleared — LUÔN `draft` lúc tạo; Cổng 1 → approved; vòng làm → implemented/verified; Cổng 2 → signed-off (người ký) hoặc machine-cleared (máy đã thông, không chữ ký)
```

- [ ] **Step 4: Khung file ca + RT1 nửa khuôn (đỏ trước)**

Tạo `tests/plugins/ra-co-ten.test.mjs`:

```js
// tests/plugins/ra-co-ten.test.mjs — ca hồ sơ ra-co-ten-lam-va-trao (RT1–RT15).
// Fixture CODE-SINH từ khuôn trong chính lần chạy; chạy THẬT start-scan / gate-card /
// product-map / pre-merge / hook; đường dẫn suy từ vị trí file; mỗi ca có đối chứng dương
// + chiều đỏ ghim thông điệp (MEASURE-BIRTH-CLAUSE).
//   RT_CASES=RT1,RT2 node tests/plugins/ra-co-ten.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { spawnSync, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
const { blockFromTemplate, fileFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));
const REF = p => path.join(ROOT, 'skills', 'acceptance', 'references', p);
const CONTRACT_TPL = REF('contract-template.md');
const OPP_TPL = REF('opportunity-template.md');
const EVID_TPL = REF('evidence-report-template.md');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
const CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const PMAP = path.join(ROOT, 'scripts', 'product-map.mjs');
const PREMERGE = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const HOOK = path.join(ROOT, 'hooks', 'acceptance-evidence-gate.js');

let failures = 0;
const ALL_IDS = ['RT1'];   // thêm id CÙNG LƯỢT với thân ca — khai trước thân là suite đỏ
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.RT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

// ── hằng rút từ khuôn (MỘT nguồn) ────────────────────────────────────────────
const DE_XUAT = blockFromTemplate(OPP_TPL, 'OPP-DE-XUAT-PREFIX').trim();          // "[đề xuất]"
const KHONG_DO = blockFromTemplate(OPP_TPL, 'OPP-KHONG-DO-DUOC-PREFIX').trim();   // "Không đo được —"
const XANH_SACH = blockFromTemplate(EVID_TPL, 'EVIDENCE-XANH-SACH-BLOCK').trim().split('\n').map(l => l.trim().split(/\s+/)[0]);
const STATUS_ENUM_FROM_TPL = (() => {
  const line = readFileSync(CONTRACT_TPL, 'utf8').split('\n').find(l => /^status:\s*\{status\}/.test(l));
  const m = line && line.match(/#\s*([a-z-]+(?:\s*\|\s*[a-z-]+)+)/);
  return m ? m[1].split('|').map(s => s.trim()) : [];
})();

// ── fixture builders ──────────────────────────────────────────────────────────
const tmp = pre => mkdtempSync(path.join(tmpdir(), pre));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const mkRepo = () => { const r = tmp('rt-'); W(r, '_acceptance/config.yaml', 'schema_version: 1\nenforcement: strict\n'); W(r, 'verify.sh', '#!/bin/sh\nexit 0\n'); return r; };
const withRepo = fn => { const r = mkRepo(); try { return fn(r); } finally { rmSync(r, { recursive: true, force: true }); } };

function contractText(slug, { status, tier = 'T2', veto = null, opened = null, approvedBy = '', surfaces = 'cli' }) {
  let t = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: `${slug} — fixture`, slug, owner: 'fx@example.com', risk_tier: tier, surfaces, status },
    `# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- khong co\n`);
  if (approvedBy) t = t.replace(/^approved_by:.*$/m, `approved_by: ${approvedBy}`).replace(/^approved_at:.*$/m, 'approved_at: 2026-08-20');
  const extra = [];
  if (veto != null) extra.push(`veto_state: ${veto}`);
  if (opened != null) extra.push(`veto_opened_at: ${opened}`);
  if (extra.length) t = t.replace(/^approved_at:.*$/m, m => [m, ...extra].join('\n'));
  return t;
}
// Báo cáo SINH TỪ KHUÔN bên viết: frontmatter + khối xanh-sạch (hai heading rỗng đi kèm khuôn).
// sach: 'sach' | 'uncertain' | 'kl-co' | 'bypass' | 'enf-off'
function evidenceText(slug, { verdict = 'PASS', signoff = '', sach = 'sach', verifiedCommit = '0'.repeat(40) }) {
  const tpl = readFileSync(EVID_TPL, 'utf8');
  const body = tpl.slice(tpl.indexOf('---8<---') + 8);                       // phần sau nhát cắt = khuôn thật
  let t = body.replace(/\{\{slug\}\}/g, slug).replace(/verdict: \{\{[^}]+\}\}/, `verdict: ${verdict}`)
    .replace(/enforcement_mode: \{\{[^}]+\}\}[^\n]*/, `enforcement_mode: ${sach === 'enf-off' ? 'off' : 'strict'}`)
    .replace(/bypass_used: \{\{[^}]+\}\}[^\n]*/, `bypass_used: ${sach === 'bypass' ? 'true' : 'false'}`)
    .replace(/verified_commit: \{\{[^}]+\}\}[^\n]*/, `verified_commit: ${verifiedCommit}`)
    .replace(/^human_signoff:.*$/m, `human_signoff:${signoff ? ' ' + signoff : ''}`);
  // cắt phần ví dụ sau khối xanh-sạch, giữ hai heading rỗng; thêm Evidence tối thiểu hợp hook
  const cut = t.indexOf('<!-- EVIDENCE-XANH-SACH-BLOCK>>> -->');
  t = t.slice(0, cut) + '<!-- EVIDENCE-XANH-SACH-BLOCK>>> -->\n\n';
  t += `# Evidence Report: ${slug}\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | PASS |\n\n## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-23T00:00:00Z\n`;
  if (sach === 'uncertain') t += `- eval: E2\n  run_id: ${slug}-E2-001\n  exit_code: 0\n  verifier: verify.sh\n  verdict: UNCERTAIN\n`;
  t += '\n## Known limits\n\n' + (sach === 'kl-co' ? '- còn một lỗ\n' : '') + '\n## Ngoài hợp đồng\n\n';
  return t;
}
function runLogText(slug) { return JSON.stringify({ ts: '2026-08-23T00:00:00Z', kind: 'eval', run_id: `${slug}-E1-001`, exit_code: 0 }) + '\n'; }
// Ô cơ hội từ khuôn; nguong: 'chua-chot' | 'de-xuat' | 'chot' | 'khong-do-duoc' | 'khong-do-duoc-hai-cham'
function opportunityText(slug, { stage = 'decided', decision = 'build', nguong = 'chot', timebox = null, nguonNgoai = 'du' }) {
  const fm = fileFromTemplate(OPP_TPL, 'OPP-FRONTMATTER-TEMPLATE',
    { slug, feature: `${slug} — fixture`, owner: 'fx@example.com', stage, decision, decided_by: decision ? 'Fx' : '', decided_at: decision ? '2026-08-20T00:00:00Z' : '', base_commit: '', disposition: '' }, '');
  const bullets = (v) => `- Câu hỏi phép đo trả lời: ${v}\n- Kết quả nào là SỐNG: ${v}\n- Kết quả nào là CHẾT: ${v}\n- Timebox: ${timebox ?? v}\n`;
  const ng = nguong === 'chua-chot' ? bullets('…')
    : nguong === 'de-xuat' ? bullets(`${DE_XUAT} ngưỡng máy đề xuất`)
    : nguong === 'chot' ? bullets('ngưỡng thật')
    : nguong === 'khong-do-duoc' ? `${KHONG_DO} vòng nội bộ, không có người dùng cuối\n`
    : `Không đo được: vòng nội bộ\n`;                                           // seam sai — hai chấm
  const nn = nguonNgoai === 'du' ? '| x | y | triết-lý/logic | có | — |' : '| x | y |  | có | — |';
  return fm + `\n## Vấn đề & ai gặp\n\nfixture\n\n## Giả định chốt sinh tử\n\n| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |\n|---|---|---|---|---|\n| 1 | a | b | c | Chưa thử |\n\n## Ngưỡng chết / ngưỡng UAT\n\n${ng}\n## Nguồn ngoài & phạm vi kế thừa\n\n| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |\n|---|---|---|---|---|\n${nn}\n\n## Out of scope từ khám phá\n\n- a\n- b\n`;
}
function mkWs(root, slug, { contract = null, evidence = null, opportunity = null, decisions = null, runLog = null } = {}) {
  const dir = path.join(root, '_acceptance', slug); mkdirSync(dir, { recursive: true });
  if (contract) writeFileSync(path.join(dir, 'contract.md'), contractText(slug, contract));
  if (evidence) { writeFileSync(path.join(dir, 'evidence-report.md'), evidenceText(slug, evidence)); writeFileSync(path.join(dir, 'run-log.jsonl'), runLog ?? runLogText(slug)); }
  if (opportunity) writeFileSync(path.join(dir, 'opportunity.md'), opportunityText(slug, opportunity));
  if (decisions) writeFileSync(path.join(dir, 'decisions.jsonl'), decisions);
  return dir;
}
const scan = (root, script = SCAN) => { const r = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' }); if (r.status !== 0) throw new Error(`start-scan exit ${r.status}: ${r.stderr}`); return JSON.parse(r.stdout); };
const findSlug = (j, slug) => { for (const grp of ['gates', 'inProgress', 'considering', 'done']) { const x = (j.groups[grp] || []).find(e => e.slug === slug); if (x) return { grp, ...x }; } const b = (j.broken || []).find(e => e.slug === slug); return b ? { grp: 'broken', ...b } : null; };

// ── RT1: enum + usesUat/usesEvidence + round-trip khuôn + khối xanh-sạch ba đầu ──
if (want('RT1')) {
  const errs = [];
  const WR = require(path.join(ROOT, 'lib', 'workspace-record.cjs'));
  const EXPECT = ['draft', 'approved', 'implemented', 'verified', 'signed-off', 'machine-cleared'];
  const got = WR.NAV_RULES['contract.md'].status.enum;
  if (JSON.stringify(got) !== JSON.stringify(EXPECT)) errs.push(`enum lib = ${JSON.stringify(got)}`);
  if (JSON.stringify(STATUS_ENUM_FROM_TPL) !== JSON.stringify(EXPECT)) errs.push(`enum khuôn = ${JSON.stringify(STATUS_ENUM_FROM_TPL)}`);
  const c = s => `---\nstatus: ${s}\n---\n`;
  for (const s of EXPECT) {
    const u = WR.usesUat(c(s)), e = WR.usesEvidence(c(s));
    if (u !== (s === 'signed-off' || s === 'machine-cleared')) errs.push(`usesUat(${s})=${u}`);
    if (e !== ['implemented', 'verified', 'machine-cleared'].includes(s)) errs.push(`usesEvidence(${s})=${e}`);
  }
  // khối xanh-sạch: 6 mã, đúng thứ tự, so với thứ tự trong xanhSach (mjs) và xanh_sach_check (bash)
  const EXPECT_XS = ['verdict-pass', 'bypass', 'enforcement', 'tier', 'uncertain', 'sections'];
  if (JSON.stringify(XANH_SACH) !== JSON.stringify(EXPECT_XS)) errs.push(`khối xanh-sạch = ${JSON.stringify(XANH_SACH)}`);
  const mjs = readFileSync(path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs'), 'utf8');
  const orderMjs = ['!== \'PASS\'', 'bypass_used', 'enforcement_mode', 'risk_tier', 'UNCERTAIN_RE.test', "'Known limits', 'Ngoài hợp đồng'"].map(n => mjs.indexOf(n));
  if (orderMjs.some(i => i < 0) || orderMjs.some((v, i) => i > 0 && v < orderMjs[i - 1])) errs.push(`thứ tự xanhSach (mjs) lệch khối: ${orderMjs}`);
  const sh = readFileSync(PREMERGE, 'utf8'); const fn = sh.slice(sh.indexOf('xanh_sach_check() {'));
  const orderSh = ['= "PASS"', 'bypass_used', 'risk_tier', 'UNCERTAIN', '"Known limits" "Ngoài hợp đồng"'].map(n => fn.indexOf(n));
  if (orderSh.some(i => i < 0) || orderSh.some((v, i) => i > 0 && v < orderSh[i - 1])) errs.push(`thứ tự xanh_sach_check (bash) lệch khối: ${orderSh}`);
  // chiều đỏ: bản sao khuôn gỡ mục «sections» → reader của chính ca này đỏ nêu tên mục
  const t2 = tmp('rt1-'); const fake = path.join(t2, 'evidence-report-template.md');
  writeFileSync(fake, readFileSync(EVID_TPL, 'utf8').replace(/^sections .*\n/m, ''));
  const xs2 = blockFromTemplate(fake, 'EVIDENCE-XANH-SACH-BLOCK').trim().split('\n').map(l => l.trim().split(/\s+/)[0]);
  const missing = EXPECT_XS.filter(k => !xs2.includes(k));
  if (JSON.stringify(missing) !== JSON.stringify(['sections'])) errs.push(`chiều đỏ khuôn: mong thiếu [sections], thấy ${JSON.stringify(missing)}`);
  rmSync(t2, { recursive: true, force: true });
  if (errs.length) fail('RT1', errs.join(' · ')); else pass('RT1', 'enum 6 giá trị round-trip khuôn↔lib; usesUat/usesEvidence; khối xanh-sạch ba đầu; chiều đỏ nêu mục');
}

if (only.length && only.some(id => !ALL_IDS.includes(id))) { console.log(`FAIL: id lạ ${only.filter(id => !ALL_IDS.includes(id))}`); failures++; }
process.exit(failures ? 1 : 0);
```

- [ ] **Step 5: Đăng ký vào suite**

Trong `tests/plugins/run-tests.sh`, ngay trước khối `# ONLY_BLOCK dat ma khong khoi nao khop`:

```bash
# ─── Ho so ra-co-ten-lam-va-trao: RT1..RT15 (file ca rieng) ──────────────────
_rt_ids="$(node "$ROOT/tests/plugins/ra-co-ten.test.mjs" --ids)" || { echo "khong lay duoc danh sach ca RT"; failures=$((failures+1)); _rt_ids=""; }
for _rt in $_rt_ids; do
  run "ca ra co ten — $_rt (ho so ra-co-ten-lam-va-trao)" \
    env RT_CASES="$_rt" node "$ROOT/tests/plugins/ra-co-ten.test.mjs"
done
```

- [ ] **Step 6: Chạy — phải ĐỎ ở enum lib (lib chưa sửa), XANH ở khuôn**

Run: `RT_CASES=RT1 node tests/plugins/ra-co-ten.test.mjs`
Expected: `FAIL: [RT1] enum lib = [...5 giá trị...]` — KHÔNG có lỗi «enum khuôn», KHÔNG có lỗi «khối xanh-sạch».

- [ ] **Step 7: Commit**

```bash
git add skills/acceptance/references/evidence-report-template.md skills/acceptance/references/opportunity-template.md skills/acceptance/references/contract-template.md tests/plugins/ra-co-ten.test.mjs tests/plugins/run-tests.sh
git commit -m "feat(ra-co-ten): khuôn có marker — khối xanh-sạch, hai tiền tố ngưỡng, enum status; khung ca RT"
```

---

### Task 2: `lib/workspace-record.cjs` — enum + điều kiện tiêu thụ

**Files:**
- Modify: `lib/workspace-record.cjs:40` (enum), `:94-97` (usesUat), `:109` (EVIDENCE_CONSUMING)

**Interfaces:**
- Produces: `usesUat(contractTxt)` true khi status ∈ {signed-off, machine-cleared}; `usesEvidence` true khi ∈ {implemented, verified, machine-cleared}. Hằng mới export: `DA_THONG_CONG_2 = ['signed-off', 'machine-cleared']` (bộ đọc khác dùng, không chép mảng).

- [ ] **Step 1: Sửa**

```js
// dòng 40
    status: { enum: ['draft', 'approved', 'implemented', 'verified', 'signed-off', 'machine-cleared'], required: true },
```

```js
// thay usesUat + EVIDENCE_CONSUMING
// Hai trạng thái «đã thông Cổng Bằng chứng»: người ký (signed-off) hoặc máy
// thông (machine-cleared — xanh-sạch sáu điều kiện, KHÔNG chữ ký; lưới trước-merge
// kiểm lời khai này). Mảng export để start-scan/product-map hỏi, không chép.
const DA_THONG_CONG_2 = ['signed-off', 'machine-cleared'];
function usesUat(contractTxt) {
  if (contractTxt == null) return false;
  return DA_THONG_CONG_2.includes((frontmatterField(contractTxt, 'status') || '').toLowerCase());
}
// ...
// machine-cleared TIÊU THỤ bằng chứng: nó là lời khai «xanh-sạch», lời khai cần vật.
const EVIDENCE_CONSUMING = ['implemented', 'verified', 'machine-cleared'];
```

Thêm `DA_THONG_CONG_2` vào `module.exports`.

- [ ] **Step 2: Chạy RT1 — XANH**

Run: `RT_CASES=RT1 node tests/plugins/ra-co-ten.test.mjs` → `PASS: [RT1] …`

- [ ] **Step 3: Hồi quy nhanh lib**

Run: `bash tests/scripts/run-tests.sh` → `Results: … 0 failed`. (`missingArtifact` chỉ đòi file ở `verified` — giữ nguyên; `machine-cleared` thiếu evidence bị LƯỚI bắt ở Task 4, bộ quét xếp `broken` ở Task 6.)

- [ ] **Step 4: Commit**

```bash
git add lib/workspace-record.cjs
git commit -m "feat(ra-co-ten): enum status thêm machine-cleared; usesUat/usesEvidence nhận nó (AC-1)"
```

---

### Task 3: Hook lúc ghi — Cổng 1 cho `machine-cleared` + xung đột chữ ký

**Files:**
- Modify: `lib/evidence-core.cjs:475-510` (evaluateContractWrite), export thêm `machineClearedSignoffConflict`
- Modify: `hooks/acceptance-evidence-gate.js:139-175` (nhánh contract + nhánh report), dòng lifecycle `:158-159`
- Test: `tests/plugins/ra-co-ten.test.mjs` RT3 (+ RT15 chân hook)

**Interfaces:**
- Produces: `machineClearedSignoffConflict(contractTxt, evidenceTxt) → string|null` — thông điệp `chữ ký người trên hồ sơ máy-thông — ký thì status phải sang signed-off (human_signoff="<x>", status=machine-cleared)`.

- [ ] **Step 1: RT3 + RT15-hook (đỏ trước)**

Thêm vào file ca (và `ALL_IDS.push` → `['RT1','RT3','RT15']`):

```js
function hook(filePath, content, { existing = null } = {}) {
  if (existing != null) writeFileSync(filePath, existing); else if (existsSync(filePath)) rmSync(filePath);
  const payload = JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath, content } });
  const r = spawnSync(process.execPath, [HOOK], { input: payload, encoding: 'utf8' });
  return { code: r.status, err: r.stderr || '' };
}
if (want('RT3')) {
  const errs = [];
  withRepo(root => {
    W(root, '.git', ''); // hook dừng leo ở đây
    const dir = path.join(root, '_acceptance', 'rt3'); mkdirSync(dir, { recursive: true });
    const cp = path.join(dir, 'contract.md');
    const V = { status: 'machine-cleared', tier: 'T2', veto: 'mo', opened: '2026-08-23T00:00:00Z' };
    let r = hook(cp, contractText('rt3', V), { existing: contractText('rt3', { ...V, status: 'verified' }) });
    if (r.code !== 0) errs.push(`(a) làn V đúng vết phải QUA, exit ${r.code}: ${r.err.slice(0, 200)}`);
    r = hook(cp, contractText('rt3', { ...V, tier: 'T3' }), { existing: contractText('rt3', { ...V, status: 'verified', tier: 'T3' }) });
    if (r.code !== 2 || !/veto_state: mo on a T3 contract/.test(r.err)) errs.push(`(b) T3 phải chặn ghim câu, exit ${r.code}`);
    r = hook(cp, contractText('rt3', { status: 'machine-cleared' }), { existing: contractText('rt3', { status: 'verified' }) });
    if (r.code !== 2 || !/status: machine-cleared with empty approved_by — Gate 1 approval not recorded/.test(r.err)) errs.push(`(c) không veto/không skip phải chặn ghim câu, exit ${r.code}`);
    r = hook(cp, contractText('rt3', { status: 'machine-cleared' }), { existing: contractText('rt3', { status: 'draft' }) });
    if (r.code !== 2 || !/skips Gate 1/.test(r.err)) errs.push(`(d) draft→machine-cleared phải chặn ghim skips Gate 1, exit ${r.code}`);
    const lifecycle = readFileSync(HOOK, 'utf8');
    if (!/approved \/ signed-off \/ machine-cleared/.test(lifecycle)) errs.push('dòng lifecycle của hook chưa liệt machine-cleared');
  });
  if (errs.length) fail('RT3', errs.join(' · ')); else pass('RT3', 'hook: làn V qua; T3/không-vết/draft→ chặn ghim câu; lifecycle liệt machine-cleared');
}
```

Và chân hook của RT15 (chân lưới + bộ quét thêm ở Task 4/6, cùng id):

```js
if (want('RT15')) {
  const errs = [];
  withRepo(root => {
    W(root, '.git', '');
    const dir = path.join(root, '_acceptance', 'rt15'); mkdirSync(dir, { recursive: true });
    const V = { status: 'machine-cleared', tier: 'T2', veto: 'mo', opened: '2026-08-23T00:00:00Z' };
    // (a) đối chứng dương: báo cáo KHÔNG chữ ký cạnh hợp đồng machine-cleared → ghi hợp đồng QUA
    writeFileSync(path.join(dir, 'evidence-report.md'), evidenceText('rt15', { signoff: '' })); writeFileSync(path.join(dir, 'run-log.jsonl'), runLogText('rt15'));
    let r = hook(path.join(dir, 'contract.md'), contractText('rt15', V), { existing: contractText('rt15', { ...V, status: 'verified' }) });
    if (r.code !== 0) errs.push(`(a+) đối chứng dương hook exit ${r.code}: ${r.err.slice(0, 160)}`);
    // (a) báo cáo CÓ chữ ký cạnh hợp đồng machine-cleared → ghi hợp đồng CHẶN
    writeFileSync(path.join(dir, 'evidence-report.md'), evidenceText('rt15', { signoff: 'Fx 2026-08-23' }));
    r = hook(path.join(dir, 'contract.md'), contractText('rt15', V), { existing: contractText('rt15', { ...V, status: 'verified' }) });
    if (r.code !== 2 || !/chữ ký người trên hồ sơ máy-thông/.test(r.err)) errs.push(`(a) hook contract phải chặn, exit ${r.code}`);
    // (a') ghi BÁO CÁO có chữ ký khi hợp đồng đang machine-cleared → CHẶN
    writeFileSync(path.join(dir, 'contract.md'), contractText('rt15', V));
    r = hook(path.join(dir, 'evidence-report.md'), evidenceText('rt15', { signoff: 'Fx 2026-08-23' }), { existing: evidenceText('rt15', { signoff: '' }) });
    if (r.code !== 2 || !/chữ ký người trên hồ sơ máy-thông/.test(r.err)) errs.push(`(a') hook report phải chặn, exit ${r.code}`);
  });
  // chân (b)(c)(d) thêm ở Task 4 (lưới) và Task 6 (bộ quét) + Task 9 (signoff.md) — CÙNG khối này
  if (errs.length) fail('RT15', errs.join(' · ')); else pass('RT15', 'machine-cleared × chữ ký: hook chặn hai chiều, đối chứng dương qua');
}
```

Run: `RT_CASES=RT3 node …` → FAIL (c) (thông điệp hôm nay nói `verified`, không phải machine-cleared) và lifecycle; `RT_CASES=RT15` → FAIL (a)(a').

- [ ] **Step 2: Sửa `evaluateContractWrite`**

Trong `lib/evidence-core.cjs`, đoạn cuối hàm (dòng ~503-510):

```js
  if (!approvedBy && !gate1Skipped && !vOpen) {
    if (status === 'approved' || status === 'signed-off' || status === 'machine-cleared') {
      failures.push(`status: ${status} with empty approved_by — Gate 1 approval not recorded. Fill approved_by (+ approved_at); only when the user explicitly skips Gate 1, record gate1_skipped: true (audited, pre-merge NOTEs it).`);
    }
    if ((oldStatus === null || oldStatus === 'draft') && (status === 'implemented' || status === 'verified' || status === 'machine-cleared')) {
      failures.push(`status: ${oldStatus === null ? '(new file)' : 'draft'} -> ${status} skips Gate 1 — approved_by is empty and gate1_skipped is not true. Lifecycle: draft -> approved (Gate 1) -> implemented -> verified -> signed-off (Gate 2, human) | machine-cleared (Gate 2, machine-clean, no signature).`);
    }
  }
```

Thêm helper trước `module.exports`:

```js
// machine-cleared = «máy thông, KHÔNG chữ ký». Chữ ký người trên hồ sơ này là hai
// sự thật cãi nhau: người đã ký thì status phải là signed-off (ADR 0002 — chữ ký là
// hành vi người, máy chỉ ghi hộ; /signoff đổi status cùng lượt). Hook chặn cả hai
// chiều ghi (contract hoặc report), lưới chặn lần nữa trước merge (AC-15).
function machineClearedSignoffConflict(contractTxt, evidenceTxt) {
  if (contractTxt == null || evidenceTxt == null) return null;
  const st = (frontmatterField(contractTxt, 'status') || '').trim().toLowerCase();
  const sig = (frontmatterField(evidenceTxt, 'human_signoff') || '').trim();
  if (st !== 'machine-cleared' || !sig) return null;
  return `chữ ký người trên hồ sơ máy-thông — ký thì status phải sang signed-off (human_signoff="${sig}", status=machine-cleared)`;
}
```

Export nó.

- [ ] **Step 3: Hook gọi helper ở hai nhánh**

Nhánh contract (sau `const cr = core.evaluateContractWrite(payload, existing);`):

```js
      let sibling = null;
      try { sibling = fs.readFileSync(path.join(fileDir, 'evidence-report.md'), 'utf8'); } catch (_) {}
      const conflict = core.machineClearedSignoffConflict(payload, sibling);
      if (conflict) cr.failures.push(conflict), cr.anyFailure = true;
```

Nhánh report (trước `const r = core.evaluateEvidence(...)`): đọc `contract.md` cạnh; nếu `core.machineClearedSignoffConflict(siblingContract, payload)` trả chuỗi → in `BLOCKED by acceptance-evidence-gate` + dòng `  x <chuỗi>` ra stderr, exit 2 (cùng kiểu nhánh contract; enforcement `warn` → cảnh báo rồi cho qua, `off` đã return trước).

Dòng lifecycle (158-159) thành:

```js
        '  status: approved / signed-off / machine-cleared -> requires approved_by (+ approved_at), or the V lane (veto_state: mo + veto_opened_at, T2 only), or gate1_skipped: true',
        '  draft -> implemented / verified / machine-cleared -> requires the approved step (Gate 1) first',
```

- [ ] **Step 4: Chạy RT3 + RT15 — XANH; hồi quy hook**

Run: `RT_CASES=RT3,RT15 node tests/plugins/ra-co-ten.test.mjs` → 2 PASS. Run: `bash tests/hooks/run-tests.sh` → 0 failed.

- [ ] **Step 5: Commit**

```bash
git add lib/evidence-core.cjs hooks/acceptance-evidence-gate.js tests/plugins/ra-co-ten.test.mjs
git commit -m "feat(ra-co-ten): hook nhận machine-cleared theo luật làn V; chặn chữ ký người trên hồ sơ máy-thông (AC-3, AC-15a)"
```

---

### Task 4: Lưới trước-merge — arm, răng lời khai, xung đột chữ ký

**Files:**
- Modify: `scripts/pre-merge-check.sh:24` (comment), `:396`, `:681` (case), `:880-930` (Gate 2 block)
- Test: RT2 + RT15 chân (a-lưới)(b)(c)

**Interfaces:**
- Produces thông điệp: `VIOLATION [slug]: status machine-cleared nhưng hồ sơ còn cần người — <CLEAN_WHY>` · `VIOLATION [slug]: chữ ký người trên hồ sơ máy-thông — ký thì status phải sang signed-off`.

- [ ] **Step 1: RT2 (đỏ trước)** — dựng kho git như `lan-v.test.mjs` (chép `mkGitRepo`/`luoi` vào file ca, đổi tên `mkGit`, `luoi`; chép đủ 5 file lib + `recheck-evidence.cjs` + thêm `scripts/khong-can-nguoi.mjs`? KHÔNG cần — lưới là bash). Thêm `'RT2'` vào `ALL_IDS`.

```js
function mkGit(slug, o, { evidence = true } = {}) {
  const R = tmp('rt-git-');
  const git = (...a) => execFileSync('git', ['-c', 'user.name=rt', '-c', 'user.email=rt@x', '-C', R, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  mkdirSync(path.join(R, 'src'), { recursive: true }); mkdirSync(path.join(R, '_acceptance'), { recursive: true });
  git('init', '-q');
  writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "*.md"\n');
  writeFileSync(path.join(R, 'src', 'app.js'), 'code v1\n'); writeFileSync(path.join(R, 'verify.sh'), '#!/bin/sh\nexit 0\n');
  mkdirSync(path.join(R, 'lib'), { recursive: true }); mkdirSync(path.join(R, 'scripts'), { recursive: true });
  for (const f of ['evidence-core.cjs', 'gap-probe.cjs', 'workspace-record.cjs', 'ac-line.cjs', 'md-section.cjs']) copyFileSync(path.join(ROOT, 'lib', f), path.join(R, 'lib', f));
  copyFileSync(path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(R, 'scripts', 'recheck-evidence.cjs'));
  git('add', '-A'); git('commit', '-qm', 'c1'); git('branch', 'basepoint');
  writeFileSync(path.join(R, 'src', 'app.js'), 'code v2\n');
  mkdirSync(path.join(R, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(R, '_acceptance', slug, 'contract.md'), contractText(slug, o));
  git('add', '-A'); git('commit', '-qm', 'c2');
  const c2 = git('rev-parse', 'HEAD').trim();
  if (evidence) { writeFileSync(path.join(R, '_acceptance', slug, 'evidence-report.md'), evidenceText(slug, { ...o, verifiedCommit: c2 })); writeFileSync(path.join(R, '_acceptance', slug, 'run-log.jsonl'), runLogText(slug)); git('add', '-A'); git('commit', '-qm', 'c3'); }
  return R;
}
function luoi(R) { const env = { ...process.env }; delete env.PRE_MERGE_BASE; const r = spawnSync('bash', [PREMERGE, R, '--base', 'basepoint'], { encoding: 'utf8', env }); return { status: r.status, out: (r.stdout || '') + '\n' + (r.stderr || '') }; }

if (want('RT2')) {
  const errs = [];
  const MC = { status: 'machine-cleared', tier: 'T2', veto: 'mo', opened: '2026-08-23T00:00:00Z', approvedBy: '', sach: 'sach', signoff: '' };
  const cases = [
    ['dương', MC, r => r.status === 0 && /NOTE \[rt2\]: xanh-sạch — máy đi tiếp/.test(r.out), 'exit 0 + NOTE xanh-sạch'],
    ['(a) UNCERTAIN', { ...MC, sach: 'uncertain' }, r => r.status !== 0 && /VIOLATION \[rt2\]: status machine-cleared nhưng hồ sơ còn cần người — có mục UNCERTAIN/.test(r.out), 'VIOLATION ghim UNCERTAIN'],
    ['(b) T3 + người duyệt Cổng 1', { ...MC, tier: 'T3', approvedBy: 'Fx' }, r => r.status !== 0 && /còn cần người — hạng T3 \(chỉ T2 được đi tiếp không ký\)/.test(r.out), 'VIOLATION ghim hạng T3'],
    ['(c) không veto, approved_by rỗng', { ...MC, veto: null, opened: null }, r => r.status !== 0 && /VIOLATION \[rt2\]: status=machine-cleared but approved_by is empty/.test(r.out), 'VIOLATION Cổng 1'],
  ];
  for (const [ten, o, ok, mo] of cases) { const R = mkGit('rt2', o); try { const r = luoi(R); if (!ok(r)) errs.push(`${ten}: mong ${mo}; exit ${r.status}; ${r.out.split('\n').filter(l => /rt2/.test(l)).join(' | ').slice(0, 300)}`); } finally { rmSync(R, { recursive: true, force: true }); } }
  { const R = mkGit('rt2', MC, { evidence: false }); try { const r = luoi(R); if (r.status === 0 || !/VIOLATION \[rt2\]: status=machine-cleared but no evidence-report.md/.test(r.out)) errs.push(`(d) thiếu báo cáo phải VIOLATION arm; exit ${r.status}`); } finally { rmSync(R, { recursive: true, force: true }); } }
  if (errs.length) fail('RT2', errs.join(' · ')); else pass('RT2', 'lưới: machine-cleared xanh-sạch qua; UNCERTAIN/T3/không-veto/thiếu-báo-cáo chặn ghim câu');
}
```

RT15 chân lưới — thêm vào khối RT15 hiện có, sau phần hook:

```js
  { const R = mkGit('rt15', { status: 'machine-cleared', tier: 'T2', veto: 'mo', opened: '2026-08-23T00:00:00Z', signoff: 'Fx 2026-08-23' }); try { const r = luoi(R); if (r.status === 0 || !/VIOLATION \[rt15\]: chữ ký người trên hồ sơ máy-thông/.test(r.out)) errs.push(`(a-lưới) phải VIOLATION, exit ${r.status}`); } finally { rmSync(R, { recursive: true, force: true }); } }
  { const R = mkGit('rt15', { status: 'machine-cleared', tier: 'T2', veto: 'mo', opened: '2026-08-23T00:00:00Z' }); try { const r = luoi(R); if (r.status !== 0) errs.push(`(a-lưới+) đối chứng dương exit ${r.status}: ${r.out.split('\n').filter(l => /VIOLATION/.test(l)).join('|')}`); } finally { rmSync(R, { recursive: true, force: true }); } }
  for (const st of ['machine-cleared', 'verified']) { const R = mkGit('rt15', { status: st, tier: 'T2', veto: 'da-veto', opened: '2026-08-23T00:00:00Z' }); try { const r = luoi(R); if (r.status === 0 || !/VIOLATION \[rt15\]: veto_state=da-veto chưa xử/.test(r.out)) errs.push(`(c) ${st}+da-veto phải chặn cùng thông điệp`); } finally { rmSync(R, { recursive: true, force: true }); } }
```

Run → RT2 FAIL ở ít nhất (a)(b)(d); RT15 FAIL ở (a-lưới).

- [ ] **Step 2: Sửa bash**

Dòng 24 comment: `# implemented|verified|signed-off|machine-cleared and risk_tier T2|T3:`.
Dòng 396 và 681: `implemented|verified|signed-off|machine-cleared) …`. Thông điệp dòng 690 «Cổng chỉ chấm hồ sơ ở implemented/verified/signed-off» → thêm `/machine-cleared`.

Khối Gate 2 (sau `signoff="$(front_field "$report" human_signoff)"`, trước `if [ "$verdict" != "PASS" ]`):

```bash
  # ── machine-cleared × chữ ký người = hai sự thật cãi nhau (AC-15a) ──
  if [ "$status" = "machine-cleared" ] && [ -n "$signoff" ]; then
    echo "VIOLATION [$slug]: chữ ký người trên hồ sơ máy-thông — ký thì status phải sang signed-off (human_signoff=\"$signoff\", status=machine-cleared). /signoff đổi status cùng lượt; đừng ký tay lên hồ sơ máy-thông."
    violations=$((violations+1)); continue
  fi
```

Trong nhánh `if [ -z "$signoff" ]` — sau `clean_ok=0; clean_why=…` và trước hai dòng NOTE/VIOLATION cũ:

```bash
    if [ "$status" = "machine-cleared" ] && [ "$clean_ok" -ne 1 ]; then
      # «máy đã thông» là LỜI KHAI; lưới đòi vật. Máy không tự phong (AC-2).
      echo "VIOLATION [$slug]: status machine-cleared nhưng hồ sơ còn cần người — $clean_why. Hạ về verified rồi mời ký, hoặc sửa cho xanh-sạch thật."
      violations=$((violations+1)); continue
    fi
```

- [ ] **Step 3: Chạy — XANH; hồi quy LV5**

Run: `RT_CASES=RT2,RT15 node tests/plugins/ra-co-ten.test.mjs` → 2 PASS. Run: `LV_CASES=LV5 node tests/plugins/lan-v.test.mjs` → PASS.

- [ ] **Step 4: Commit**

```bash
git add scripts/pre-merge-check.sh tests/plugins/ra-co-ten.test.mjs
git commit -m "feat(ra-co-ten): lưới arm machine-cleared, răng lời khai xanh-sạch, chặn chữ ký trên hồ sơ máy-thông (AC-2, AC-15)"
```

---

### Task 5: Bảng chữ — 4 khoá mới; BDK2 lên 24

**Files:**
- Modify: `scripts/trang-thai-ho-so.cjs` (TRANG_THAI + BUCKET_OF)
- Modify: `tests/plugins/bang-dieu-khien.test.mjs:~40-48` (KHOA + N)
- Test: RT5 phần bảng

- [ ] **Step 1: RT5 phần bảng (đỏ trước)** — `ALL_IDS.push('RT5')`

```js
if (want('RT5')) {
  const errs = [];
  const B = require(path.join(ROOT, 'scripts', 'trang-thai-ho-so.cjs'));
  const MOI = { 'da-giao-may-thong-veto-mo': ['máy thông', 'da-ship'], 'da-giao-may-thong-xanh-sach': ['máy thông', 'da-ship'], 'da-giao-khong-do': ['không đo', 'da-ship'], 'da-dong-ho-so': ['đóng có hồ sơ', 'da-bac'] };
  for (const [k, [chu, bucket]] of Object.entries(MOI)) {
    let c; try { c = B.chu(k); } catch (e) { errs.push(`thiếu khoá ${k}`); continue; }
    if (!c.nhan.includes(chu)) errs.push(`${k}: nhãn «${c.nhan}» không chứa «${chu}»`);
    if (B.BUCKET_OF[k] !== bucket) errs.push(`${k}: bucket ${B.BUCKET_OF[k]} != ${bucket}`);
  }
  if (B.chu('da-giao').nhan === B.chu('da-giao-may-thong-veto-mo').nhan) errs.push('nhãn máy-thông trùng nhãn đã giao (bất biến phân biệt)');
  // phần bản đồ + thẻ thêm ở Task 7 — CÙNG khối này
  if (errs.length) fail('RT5', errs.join(' · ')); else pass('RT5', '4 khoá mới có nhãn riêng + bucket đúng');
}
```

- [ ] **Step 2: Sửa bảng**

Thêm sau dòng `'da-giao'` trong `TRANG_THAI`:

```js
  'da-giao-may-thong-veto-mo':   { nhan: 'đã giao — máy thông, cửa veto còn mở',    viecKe: 'người: veto lúc nào cũng được, cửa không có hạn' },
  'da-giao-may-thong-xanh-sach': { nhan: 'đã giao — máy thông, bằng chứng xanh-sạch', viecKe: 'không ai — người đã duyệt hoặc miễn Cổng Phạm vi' },
  'da-giao-khong-do':            { nhan: 'đã giao — không đo, khai ở Cổng Đáng',      viecKe: 'không ai — vòng đã đóng theo khai' },
  'da-dong-ho-so':               { nhan: 'đã đóng có hồ sơ',                           viecKe: 'không ai — đã quyết dừng, hồ sơ lưu' },
```

`BUCKET_OF`: ba khoá đầu → `'da-ship'`, `'da-dong-ho-so'` → `'da-bac'`.

- [ ] **Step 3: BDK2** — thêm 4 khoá vào mảng `KHOA`, `const N = 24;`, sửa comment «20 khoá» → «24 khoá».

- [ ] **Step 4: Chạy** `RT_CASES=RT5 …` PASS; `BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs` PASS.

- [ ] **Step 5: Commit** `git add scripts/trang-thai-ho-so.cjs tests/plugins/bang-dieu-khien.test.mjs tests/plugins/ra-co-ten.test.mjs` · `git commit -m "feat(ra-co-ten): bảng chữ thêm 4 khoá (máy thông ×2, không đo, đóng hồ sơ); BDK2 N=24 (AC-5)"`

---

### Task 6: Bộ quét — nhánh `machine-cleared`, ngưỡng 4 trạng thái, flags, archived, timebox, xung đột chữ ký

**Files:**
- Modify: `scripts/start-scan.mjs` — khối ngưỡng `:194-215`, nhánh `signed-off` `:285-312`, nhánh opportunity `:370-380`, import `DA_THONG_CONG_2`
- Test: RT4, RT9, RT12, RT15(d)

**Interfaces:**
- Produces: `thresholdState(oTxt) → 'chua-chot'|'de-xuat'|'chot'|'khong-do-duoc'`; phần tử `gates[]`/`inProgress[]`/`done[]` có thể mang `flags: string[]` (vắng = `[]`); giá trị flag: `nguong-chua-chot` · `mien-do-co-nguoi-dung` · `qua-timebox`.

- [ ] **Step 1: Ca (đỏ trước)** — `ALL_IDS.push('RT4','RT9','RT12')`

```js
const MC = { status: 'machine-cleared', tier: 'T2', veto: 'mo', opened: '2026-08-23T00:00:00Z' };
if (want('RT4')) {
  const errs = [];
  withRepo(root => {
    mkWs(root, 'a', { contract: MC, evidence: {} });
    mkWs(root, 'b', { contract: { status: 'machine-cleared', tier: 'T2', approvedBy: 'Fx' }, evidence: {} });
    mkWs(root, 'c', { contract: MC, evidence: {}, opportunity: { nguong: 'chot' } });
    mkWs(root, 'd', { contract: { ...MC, status: 'verified' }, evidence: {}, opportunity: { nguong: 'chot' } });
    mkWs(root, 'e', { contract: { ...MC, status: 'signed-off' }, evidence: { signoff: 'Fx 2026-08-23' } });
    const j = scan(root);
    const A = findSlug(j, 'a'), B = findSlug(j, 'b'), C = findSlug(j, 'c'), D = findSlug(j, 'd'), E = findSlug(j, 'e');
    if (!A || A.grp !== 'done' || A.stateKey !== 'da-giao-may-thong-veto-mo') errs.push(`(a) ${JSON.stringify(A)}`);
    if ((j.groups.done || []).some(x => x.slug === 'a' && x.stateKey === 'da-giao')) errs.push('(a) có phần tử da-giao cho slug máy-thông');
    if (!B || B.stateKey !== 'da-giao-may-thong-xanh-sach') errs.push(`(b) ${JSON.stringify(B)}`);
    if (!C || C.grp !== 'gates' || C.gate !== 'gia-tri') errs.push(`(c) ${JSON.stringify(C)}`);
    if (!D || D.grp === 'gates' || D.stateKey !== 'may-di-tiep-veto-mo') errs.push(`(d) đọc-cũ verified phải giữ may-di-tiep-veto-mo: ${JSON.stringify(D)}`);
    if (!E || E.stateKey !== 'da-giao' || E.label === A.label) errs.push(`(e) signed-off phải là da-giao với nhãn KHÁC máy-thông: ${JSON.stringify(E)}`);
    if (j.broken.length) errs.push(`broken: ${JSON.stringify(j.broken)}`);
  });
  if (errs.length) fail('RT4', errs.join(' · ')); else pass('RT4', 'machine-cleared: hai khoá máy-thông; tới Cổng Giá trị khi có ô build; verified cũ giữ nguyên; signed-off khác chữ');
}
if (want('RT9')) {
  const errs = []; let oDem = 0;
  const KV = { chot: ['gates', 'gia-tri', false], 'khong-do-duoc': ['done', 'da-giao-khong-do', false], 'chua-chot': ['gates', 'gia-tri', true], 'de-xuat': ['gates', 'gia-tri', true] };
  for (const st of ['signed-off', 'machine-cleared']) for (const ng of Object.keys(KV)) {
    oDem++;
    withRepo(root => {
      mkWs(root, 'x', { contract: st === 'signed-off' ? { status: st, tier: 'T2', approvedBy: 'Fx' } : MC, evidence: { signoff: st === 'signed-off' ? 'Fx 2026-08-23' : '' }, opportunity: { nguong: ng } });
      const x = findSlug(scan(root), 'x'); const [grp, key, flag] = KV[ng];
      const ok = x && x.grp === grp && (grp === 'gates' ? x.gate === key : x.stateKey === key) && ((x.flags || []).includes('nguong-chua-chot') === flag);
      if (!ok) errs.push(`${st}×${ng}: ${JSON.stringify(x)}`);
    });
  }
  if (oDem !== 8) errs.push(`ma trận ${oDem} != 8`);
  withRepo(root => { mkWs(root, 'y', { opportunity: { stage: 'discovery', decision: '', nguong: 'de-xuat' } }); mkWs(root, 'z', { opportunity: { stage: 'discovery', decision: '', nguong: 'chua-chot' } }); const j = scan(root);
    if (findSlug(j, 'y')?.gate !== 'dang') errs.push('de-xuat chưa hợp đồng phải chờ Cổng Đáng'); if (findSlug(j, 'z')?.grp !== 'considering') errs.push('chua-chot phải ở considering'); });
  withRepo(root => { mkWs(root, 's', { contract: MC, evidence: {}, opportunity: { nguong: 'khong-do-duoc-hai-cham' } }); const x = findSlug(scan(root), 's'); if (!x || x.grp !== 'gates' || !(x.flags || []).includes('nguong-chua-chot')) errs.push(`seam hai chấm KHÔNG được nhận: ${JSON.stringify(x)}`); });
  if (errs.length) fail('RT9', errs.join(' · ')); else pass('RT9', 'ma trận 8 ô ngưỡng × trạng thái; de-xuat là đã điền ở Cổng Đáng; seam hai chấm không nhận');
}
if (want('RT12')) {
  const errs = [];
  withRepo(root => {
    mkWs(root, 'ar', { opportunity: { stage: 'archived', decision: 'kill' } });
    mkWs(root, 'tb1', { contract: { status: 'signed-off', tier: 'T2', approvedBy: 'Fx' }, evidence: { signoff: 'Fx 2026-08-23' }, opportunity: { nguong: 'chot', timebox: 'muộn nhất 2000-01-01 → park' } });
    mkWs(root, 'tb2', { contract: { status: 'signed-off', tier: 'T2', approvedBy: 'Fx' }, evidence: { signoff: 'Fx 2026-08-23' }, opportunity: { nguong: 'chot', timebox: 'muộn nhất 01/01/2000' } });
    mkWs(root, 'tb3', { contract: { status: 'signed-off', tier: 'T2', approvedBy: 'Fx' }, evidence: { signoff: 'Fx 2026-08-23' }, opportunity: { nguong: 'chot', timebox: 'muộn nhất 2999-12-31' } });
    mkWs(root, 'tb4', { contract: { status: 'signed-off', tier: 'T2', approvedBy: 'Fx' }, evidence: { signoff: 'Fx 2026-08-23' }, opportunity: { nguong: 'chot', timebox: 'cuối quý' } });
    const j = scan(root);
    if (findSlug(j, 'ar')?.stateKey !== 'da-dong-ho-so') errs.push(`archived: ${JSON.stringify(findSlug(j, 'ar'))}`);
    for (const [s, exp] of [['tb1', true], ['tb2', true], ['tb3', false], ['tb4', false]]) { const x = findSlug(j, s); if (!x || x.grp !== 'gates' || ((x.flags || []).includes('qua-timebox') !== exp)) errs.push(`${s}: mong flag=${exp}, ${JSON.stringify(x)}`); }
  });
  // phần uat-session SKILL thêm ở Task 9 — CÙNG khối này
  if (errs.length) fail('RT12', errs.join(' · ')); else pass('RT12', 'archived → đã đóng có hồ sơ; timebox quá hạn hai dạng ngày → cờ, chưa qua/không parse → không cờ');
}
```

RT15 chân (d) — thêm vào khối RT15: `withRepo(root => { mkWs(root, 'k', { contract: MC, evidence: { signoff: 'Fx 2026-08-23' } }); const x = findSlug(scan(root), 'k'); if (!x || x.grp !== 'broken' || !/chữ ký người trên hồ sơ máy-thông/.test(x.reason)) errs.push(`(d) bộ quét phải gọi hỏng nêu mâu thuẫn: ${JSON.stringify(x)}`); });`

- [ ] **Step 2: Sửa `start-scan.mjs`**

(i) Import: `const { ..., DA_THONG_CONG_2 } = require(path.join(__dirname, '..', 'lib', 'workspace-record.cjs'));` (cùng dòng require đang có). Thêm `const { machineClearedSignoffConflict } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));` nếu chưa.

(ii) Khối ngưỡng (~dòng 194-215) — thay `thresholdFilled` bằng:

```js
// Hai tiền tố rút từ CHÍNH KHUÔN (một nguồn, như nhãn bullet): [đề xuất] và «Không đo được —».
const prefixFromTpl = marker => { const tpl = readFileSync(OPP_TEMPLATE, 'utf8'); const m = tpl.match(new RegExp(`<<<${marker} -->\\n([\\s\\S]*?)<!-- ${marker}>>>`)); if (!m) bail(`khuôn không có khối ${marker}: ${OPP_TEMPLATE}`); return m[1].trim(); };
let _pre = null; const prefixes = () => _pre || (_pre = { deXuat: prefixFromTpl('OPP-DE-XUAT-PREFIX'), khongDo: prefixFromTpl('OPP-KHONG-DO-DUOC-PREFIX') });
// Dòng «không đo được» = bắt đầu đúng tiền tố (so sau trim, ký tự kế phải là khoảng trắng/hết dòng) — «Không đo được:» KHÔNG nhận (seam, AC-9).
const isKhongDoLine = l => { const p = prefixes().khongDo, t = l.trim(); return t.startsWith(p) && (t.length === p.length || /\s/.test(t[p.length])); };
// Bốn trạng thái của ô ngưỡng (AC-9): khong-do-duoc > chot > de-xuat > chua-chot.
const thresholdState = oTxt => {
  const lines = section(oTxt, UAT_THRESHOLD_HEADING);
  if (lines.some(isKhongDoLine)) return 'khong-do-duoc';
  const got = new Map(); for (const l of lines) { const b = bulletOf(l); if (b) got.set(b.label, b.value); }
  const all = thresholdLabels().every(lb => got.has(lb) && !PLACEHOLDER_RE.test(got.get(lb)));
  if (!all) return 'chua-chot';
  return [...got.values()].some(v => v.startsWith(prefixes().deXuat)) ? 'de-xuat' : 'chot';
};
const thresholdFilled = oTxt => thresholdState(oTxt) !== 'chua-chot';   // Cổng Đáng: de-xuat là đã điền
// Timebox: ngày ISO YYYY-MM-DD hoặc DD/MM/YYYY trong bullet Timebox; quá hạn ⇔ ngày < hôm nay (UTC). Không parse → null.
const timeboxDate = oTxt => { for (const l of section(oTxt, UAT_THRESHOLD_HEADING)) { const b = bulletOf(l); if (!b || b.label !== 'Timebox') continue; const iso = b.value.match(/\b(\d{4})-(\d{2})-(\d{2})\b/); if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3])); const vn = b.value.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/); if (vn) return new Date(Date.UTC(+vn[3], +vn[2] - 1, +vn[1])); } return null; };
const quaTimebox = oTxt => { const d = timeboxDate(oTxt); return !!d && d.getTime() < Date.now() - 0; };
// Răng chống lách (AC-11): hợp đồng chạm mặt người dùng mà ô khai không đo được.
const SURFACE_NGUOI_DUNG = /\b(ui|mobile)\b/i;
const mienDoCoNguoiDung = (cTxt, oTxt) => thresholdState(oTxt) === 'khong-do-duoc' && SURFACE_NGUOI_DUNG.test(frontmatterField(cTxt, 'surfaces') || '');
```

(iii) Nhánh `signed-off` (dòng 285) → `if (DA_THONG_CONG_2.includes(status)) {` … Sau `const { decision, verdict } = navValues(texts);` và trước `if (verdict)`:

```js
      // machine-cleared × chữ ký người: hai sự thật cãi nhau — hỏng, không im lặng (AC-15d)
      if (status === 'machine-cleared') { const ev = readEvidence(); if (!ev) continue; if (!ev.exists) { pushHong({ slug, file: 'evidence-report.md', reason: 'status machine-cleared nhưng thiếu evidence-report.md' }); continue; } const cf = machineClearedSignoffConflict(cTxt, ev.raw); if (cf) { pushHong({ slug, file: 'evidence-report.md', reason: cf }); continue; } }
```

Thay hai dòng cuối nhánh:

```js
      const flags = [];
      if (oTxt && quaTimebox(oTxt) && !verdict) flags.push('qua-timebox');
      if (oTxt && mienDoCoNguoiDung(cTxt, oTxt)) flags.push('mien-do-co-nguoi-dung');
      if (decision === 'build' || decision === 'iterate') {
        const ng = thresholdState(oTxt);
        if (ng === 'khong-do-duoc') done.push(g('da-giao-khong-do', { slug, state: 'khong-do-duoc', at: ngayXong(dir, cPath), flags }));
        else gates.push(g('cho-cong-gia-tri', { slug, gate: 'gia-tri', since: fmOrNull(uTxt, 'decided_at') || '', tier, flags: ng === 'chot' ? flags : [...flags, 'nguong-chua-chot'] }));
      }
      else if (status === 'machine-cleared') {
        const vMo = (frontmatterField(cTxt, 'veto_state') || '').trim().toLowerCase() === 'mo';
        done.push(g(vMo ? 'da-giao-may-thong-veto-mo' : 'da-giao-may-thong-xanh-sach', { slug, state: vMo ? 'lan-v-mo' : 'xanh-sach', at: ngayXong(dir, cPath), flags }));
      }
      else done.push(g('da-giao', { slug, state: 'signed-off', at: ngayXong(dir, cPath), flags }));
```

(Giữ `state` là hợp đồng máy cũ: `lan-v-mo`/`xanh-sach` — `commands/start.md` đang đọc hai giá trị đó.)

(iv) Nhánh opportunity không hợp đồng (dòng ~371): trước `if (stage !== 'decided' || !decision)` thêm `if (stage === 'archived') { done.push(g('da-dong-ho-so', { slug, state: decision || 'archived', at: ngayXong(dir, oPath) })); continue; }`. Trong nhánh build/iterate `sap-mo-vong`: thêm `flags: quaTimebox(oRead.t) ? ['qua-timebox'] : []`.

- [ ] **Step 3: Chạy** `RT_CASES=RT4,RT9,RT12,RT15 …` → 4 PASS. Hồi quy: `LV_CASES= node tests/plugins/lan-v.test.mjs`, `node tests/plugins/vao-co-o.test.mjs`, `node tests/plugins/bang-dieu-khien.test.mjs` → đều PASS. Chạy `node scripts/start-scan.mjs --root .` → `broken: []`.

- [ ] **Step 4: Commit** `git add scripts/start-scan.mjs tests/plugins/ra-co-ten.test.mjs` · `git commit -m "feat(ra-co-ten): bộ quét — machine-cleared tới Cổng Giá trị, ô ngưỡng 4 trạng thái + lối không-đo-được, archived/timebox, cờ (AC-4, AC-9, AC-11, AC-12, AC-15d)"`

---

### Task 7: Bản đồ + thẻ nhận `machine-cleared`

**Files:**
- Modify: `scripts/product-map.mjs:178-186`
- Modify: `scripts/gate-card.js:190-193` (detect), Gate 2 block (dòng «máy đã thông»)
- Test: RT5 phần còn lại

- [ ] **Step 1: RT5 bổ sung (đỏ trước)** — thêm vào khối RT5:

```js
  withRepo(root => {
    mkWs(root, 'm', { contract: MC, evidence: {} });
    const r = spawnSync(process.execPath, [PMAP, '--root', root], { encoding: 'utf8' });
    const md = readFileSync(path.join(root, 'PRODUCT-MAP.md'), 'utf8');
    if (!md.includes(B.chu('da-giao-may-thong-veto-mo').nhan)) errs.push('bản đồ không in nhãn máy-thông từ bảng');
    const ex = JSON.parse(spawnSync(process.execPath, [CARD, '--root', root, '--slug', 'm', '--extract'], { encoding: 'utf8' }).stdout);
    if (String(ex.gate) !== '2') errs.push(`thẻ gate=${ex.gate}`);
    const html = spawnSync(process.execPath, [CARD, '--root', root, '--slug', 'm'], { encoding: 'utf8' }).stdout;
    if (!/máy đã thông/.test(html) || !/cửa veto/.test(html)) errs.push('HTML thẻ thiếu dòng máy đã thông + cửa veto');
  });
```

- [ ] **Step 2: product-map** — thay `if (status === 'signed-off') {…}` bằng:

```js
    if (DA_THONG_CONG_2.includes(status)) {
      const duongA = decision === 'build' || decision === 'iterate';
      if (duongA) return o('cho-cong-gia-tri');          // ô ngưỡng quyết tiếp — bản đồ gom theo GIAI ĐOẠN, không vị từ
      if (status === 'machine-cleared') { const vMo = (frontmatterField(cTxt, 'veto_state') || '').trim().toLowerCase() === 'mo'; return o(vMo ? 'da-giao-may-thong-veto-mo' : 'da-giao-may-thong-xanh-sach'); }
      return o('da-giao');
    }
```

và `stage === 'archived'` → `return o('da-dong-ho-so')` trước dòng `if (stage !== 'decided'…`. Ô «Đã giao» in kèm nhãn (`note`) khi khoá ≠ `da-giao`: `{ key: BUCKET_OF[k], slug, name, edge, note: k === 'da-giao' ? undefined : chu(k).nhan }` — kiểm cách renderer in `note` (đã dùng cho `da-nghiem-thu`), dùng đúng cơ chế đó.

- [ ] **Step 3: gate-card** — dòng 190: `if (/^(implemented|verified|signed-off|machine-cleared)$/i.test(status)) gate = '2';`. Trong Gate 2, nơi dựng `MAY_DI_TIEP` (xem cuối file, biến `scanState`), thêm: nếu `status === 'machine-cleared'` → chèn vào `P` ngay sau tiêu đề thẻ: `<div class="flag finfo">máy đã thông — không có chữ ký người; cửa veto ${vetoMo ? 'đang mở' : 'không mở'}.</div>` với `vetoMo` đọc `veto_state` từ `cfm`.

- [ ] **Step 4: Chạy** `RT_CASES=RT5` PASS; `node scripts/product-map.mjs --root . --check` → khớp (không hồ sơ thật nào machine-cleared nên bản đồ không đổi).

- [ ] **Step 5: Commit** `git add scripts/product-map.mjs scripts/gate-card.js tests/plugins/ra-co-ten.test.mjs` · `git commit -m "feat(ra-co-ten): bản đồ + thẻ nhận machine-cleared, nhãn từ bảng chung (AC-5)"`

---

### Task 8: Thẻ Cổng Đáng (gate 0) + cờ đỏ chống lách ở Cổng Phạm vi

**Files:**
- Modify: `scripts/gate-card.js` — detect (`:190`), khối mới `GATE 0` trước `GATE 1`, khối cờ trong Gate 1 (sau dòng 374)
- Test: RT7, RT11

**Interfaces:**
- `--extract` gate 0: `{ gate: 0, feature, cong_dang: { applicable, nguong, nguon_ngoai_chua_phan_loai, loi_ra: ['làm','lặp','xếp lại','dừng'], de_xuat_lines, flags } }`.
- `--extract` gate 1 thêm `cong_gia_tri: { mien_do_co_nguoi_dung: bool }`.

- [ ] **Step 1: RT7 + RT11 (đỏ trước)** — `ALL_IDS.push('RT7','RT11')`

```js
const card = (root, slug, extra = []) => spawnSync(process.execPath, [CARD, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });
if (want('RT7')) {
  const errs = [];
  for (const ng of ['chua-chot', 'de-xuat', 'chot', 'khong-do-duoc']) withRepo(root => {
    mkWs(root, 'o', { opportunity: { stage: 'discovery', decision: '', nguong: ng } });
    const ex = JSON.parse(card(root, 'o', ['--extract']).stdout); const html = card(root, 'o').stdout;
    if (String(ex.gate) !== '0' || !ex.cong_dang?.applicable) errs.push(`${ng}: gate=${ex.gate}`);
    if (ex.cong_dang?.nguong !== ng) errs.push(`${ng}: nguong=${ex.cong_dang?.nguong}`);
    if (JSON.stringify(ex.cong_dang?.loi_ra) !== JSON.stringify(['làm', 'lặp', 'xếp lại', 'dừng'])) errs.push(`${ng}: loi_ra=${JSON.stringify(ex.cong_dang?.loi_ra)}`);
    if (!/Vấn đề &amp; ai gặp|Vấn đề & ai gặp/.test(html) || !/Ngưỡng/.test(html)) errs.push(`${ng}: HTML thiếu khối`);
    const red = (html.match(/class="flag fred"/g) || []).length;
    if (ng === 'chua-chot' && !(red >= 1 && /ký .{0,5}làm.{0,30}thước trang trí/.test(html))) errs.push('chua-chot: thiếu cờ đỏ thước trang trí');
    if (ng === 'chot' && red !== 0) errs.push(`chot: có ${red} cờ đỏ (should-NOT-fire)`);
    if (ng === 'de-xuat' && !/máy đề xuất/.test(html)) errs.push('de-xuat: thiếu chip máy đề xuất');
  });
  withRepo(root => { mkWs(root, 'o', { opportunity: { stage: 'discovery', decision: '', nguong: 'chot', nguonNgoai: 'thieu' } }); const ex = JSON.parse(card(root, 'o', ['--extract']).stdout); if (!(ex.cong_dang.nguon_ngoai_chua_phan_loai >= 1)) errs.push('nguồn ngoài chưa phân loại không đếm'); if (!/class="flag fred"/.test(card(root, 'o').stdout)) errs.push('nguồn ngoài chưa phân loại không cờ đỏ'); });
  withRepo(root => { mkWs(root, 'o', { contract: { status: 'draft' }, opportunity: { nguong: 'chot' } }); const ex = JSON.parse(card(root, 'o', ['--extract']).stdout); if (ex.cong_dang?.applicable !== false || String(ex.gate) !== '1') errs.push('có contract.md mà vẫn Cổng Đáng'); if (/Cổng Đáng/.test((card(root, 'o').stdout.match(/class="flag[^>]*>[^<]*/g) || []).join(''))) errs.push('cờ chứa Cổng Đáng trên thẻ Cổng 1'); });
  if (errs.length) fail('RT7', errs.join(' · ')); else pass('RT7', 'thẻ Cổng Đáng: 4 trạng thái ngưỡng, 4 lối ra, cờ đỏ thước trang trí/nguồn ngoài, cô lập lớp');
}
if (want('RT11')) {
  const errs = [];
  for (const [sf, exp] of [['ui', true], ['mobile', true], ['cli', false]]) withRepo(root => {
    mkWs(root, 'u', { contract: { status: 'draft', surfaces: sf }, opportunity: { nguong: 'khong-do-duoc' } });
    const ex = JSON.parse(card(root, 'u', ['--extract']).stdout); const html = card(root, 'u').stdout;
    if (!!ex.cong_gia_tri?.mien_do_co_nguoi_dung !== exp) errs.push(`${sf}: extract=${JSON.stringify(ex.cong_gia_tri)}`);
    if (/khai không đo được nhưng hợp đồng có mặt người dùng/.test(html) !== exp) errs.push(`${sf}: cờ đỏ ${exp ? 'thiếu' : 'thừa'}`);
    const x = findSlug(scan(root), 'u'); if (!x || x.grp === 'broken' || ((x.flags || []).includes('mien-do-co-nguoi-dung') !== exp)) errs.push(`${sf}: bộ quét ${JSON.stringify(x)}`);
  });
  if (errs.length) fail('RT11', errs.join(' · ')); else pass('RT11', 'răng chống lách: ui/mobile + không-đo-được → cờ đỏ + flag; cli → không');
}
```

(RT11 bộ quét chạy trên hợp đồng `draft` + ô `khong-do-duoc`: nhánh `draft` của bộ quét cũng phải gắn flag — trong Task 6 (iii) đặt `flags` ở nhánh `draft` nữa: `gates.push(g('cho-cong-pham-vi', { …, flags: oTxtDraft && mienDoCoNguoiDung(cTxt, oTxtDraft) ? ['mien-do-co-nguoi-dung'] : [] }))` với `oTxtDraft = read(oPath).t` (đọc lười, lỗi IO → không flag). Bổ sung vào Task 6 nếu chưa.)

- [ ] **Step 2: Viết GATE 0 trong gate-card**

Trước `// ================= GATE 1 =================`:

```js
// ================= GATE 0 — Cổng Đáng =================
// Tự nhận: KHÔNG contract.md, CÓ opportunity.md, stage ≠ archived. Thẻ trình đề bài + ngưỡng
// (đề xuất của máy hiện rõ là đề xuất) + bốn lối ra; máy KHÔNG điền decision (ADR 0002).
const oppPath0 = path.join(dir, 'opportunity.md');
const opp0 = read(oppPath0);
const ofm = frontmatter(opp0);
if (!gate && !contract.trim() && opp0.trim() && clean(ofm.stage).toLowerCase() !== 'archived') gate = '0';
if (gate === '0') {
  const OPP_TPL = path.join(__dirname, '..', 'skills', 'acceptance', 'references', 'opportunity-template.md');
  const pre = m => { const t = read(OPP_TPL); const x = t.match(new RegExp(`<<<${m} -->\\n([\\s\\S]*?)<!-- ${m}>>>`)); if (!x) { process.stderr.write(`gate-card: khuôn không có khối ${m}\n`); process.exit(2); } return x[1].trim(); };
  const DE_XUAT = pre('OPP-DE-XUAT-PREFIX'), KHONG_DO = pre('OPP-KHONG-DO-DUOC-PREFIX');
  const H = 'Ngưỡng chết / ngưỡng UAT';
  const lines = section(opp0, H).map(l => l.trim()).filter(l => l && !/^>/.test(l));
  const isKD = l => l.startsWith(KHONG_DO) && (l.length === KHONG_DO.length || /\s/.test(l[KHONG_DO.length]));
  const bul = lines.filter(l => /^[-*]\s+[^:]+:/.test(l)).map(l => ({ label: l.replace(/^[-*]\s+/, '').split(':')[0].trim(), value: l.replace(/^[-*]\s+[^:]+:/, '').trim() }));
  const tplLabels = section(read(OPP_TPL), H).filter(l => /^[-*]\s+[^:]+:/.test(l)).map(l => l.replace(/^[-*]\s+/, '').split(':')[0].trim()).filter(lb => !/^Không đo được/.test(lb));
  const filled = tplLabels.every(lb => { const b = bul.find(x => x.label === lb); return b && !/^(…|\.\.\.)?$/.test(b.value); });
  const nguong = lines.some(isKD) ? 'khong-do-duoc' : !filled ? 'chua-chot' : bul.some(b => b.value.startsWith(DE_XUAT)) ? 'de-xuat' : 'chot';
  // Nguồn ngoài: hàng dữ liệu có cột «Phân loại» trống = chưa phân loại (răng khuôn :76)
  const nnRows = section(opp0, 'Nguồn ngoài & phạm vi kế thừa').filter(l => /^\|/.test(l) && !/^\|\s*-{3}/.test(l) && !/Món vật liệu/.test(l));
  const chuaPL = nnRows.filter(l => { const c = l.split('|').map(s => s.trim()); return c.length >= 4 && c[1] && !/^…$/.test(c[1]) && !c[3]; }).length;
  const LOI_RA = ['làm', 'lặp', 'xếp lại', 'dừng'];
  const flags = [];
  if (nguong === 'chua-chot') flags.push(['fred', 'Ngưỡng còn trống và chưa khai «không đo được» — ký *làm* lúc này là ký trên thước trang trí. Điền ngưỡng vào ô, hoặc khai một dòng «' + KHONG_DO + ' <lý do>».']);
  if (chuaPL) flags.push(['fred', `Bảng Nguồn ngoài có ${chuaPL} hàng chưa phân loại — chưa đủ điều kiện ký «làm».`]);
  if (EXTRACT) { process.stdout.write(JSON.stringify({ gate: 0, feature: clean(ofm.feature) || slug, cong_dang: { applicable: true, nguong, nguon_ngoai_chua_phan_loai: chuaPL, loi_ra: LOI_RA, de_xuat_lines: bul.filter(b => b.value.startsWith(DE_XUAT)).map(b => b.label), flags: flags.map(f => f[1]) } }, null, 2)); process.exit(0); }
  const P = [STYLE, `<div class="gc"><div class="card"><div class="h"><div><div class="ft">${esc(stripMd(clean(ofm.feature) || slug))}</div><div class="sub">Cổng Đáng — việc này có đáng làm không?</div></div><span class="chip amber">quyết có làm không</span></div>`];
  const blk = (lab, arr) => arr.length && P.push(`<div class="lab">${lab}</div><div class="grp gnot">${arr.map(t => `<p class="li">${esc(stripMd(t))}</p>`).join('')}</div>`);
  blk('Vấn đề & ai gặp', section(opp0, 'Vấn đề & ai gặp').filter(l => l.trim() && !/^>/.test(l)));
  blk('Giả định sinh tử (3 đầu)', section(opp0, 'Giả định chốt sinh tử').filter(l => /^\|\s*\d/.test(l)).slice(0, 3).map(l => l.split('|').slice(2, 3).join('').trim()));
  P.push(`<div class="lab">Ngưỡng</div><div class="grp gnot">${lines.length ? lines.map(l => `<p class="li">${esc(stripMd(l.replace(/^[-*]\s+/, '')))}${l.includes(DE_XUAT) ? ' <span class="chip amber">máy đề xuất — anh sửa hoặc nhận</span>' : ''}${isKD(l) ? ' <span class="chip gray">khai không đo được</span>' : ''}</p>`).join('') : '<p class="li">chưa có</p>'}</div>`);
  for (const [k, t] of flags) P.push(`<div class="flag ${k}">${esc(t)}</div>`);
  P.push(`<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gdo"><p class="li">Chọn MỘT lối ra, trả lời một câu: «${LOI_RA.join('» · «')}» — gõ <code>/approve ${esc(slug)} &lt;lối&gt;</code>. Muốn sửa ngưỡng thì sửa trong ô trước khi gõ — vẫn một lượt.</p></div>`);
  P.push(`<div class="foot"><span class="rev">↻ Đảo ngược dễ: xếp lại / dừng không đóng cửa ý — mở lại khi có căn cứ mới.</span><div class="btns">${LOI_RA.map(l => `<button class="b ${l === 'làm' ? 'yes' : 'bn'}">${l}</button>`).join('')}</div></div></div></div>`);
  process.stdout.write(P.join('\n')); process.exit(0);
}
```

(`frontmatter`, `clean`, `section`, `stripMd`, `esc`, `STYLE` đã có trong file — dùng nguyên.)

- [ ] **Step 3: Cờ đỏ chống lách trong Gate 1** — sau dòng 374 (`if (!ut.opportunity_present) flags.push(…)`):

```js
  const KHONG_DO_1 = (() => { const t = read(path.join(__dirname, '..', 'skills', 'acceptance', 'references', 'opportunity-template.md')); const x = t.match(/<<<OPP-KHONG-DO-DUOC-PREFIX -->\n([\s\S]*?)<!-- OPP-KHONG-DO-DUOC-PREFIX>>>/); return x ? x[1].trim() : null; })();
  const mienDo = !!KHONG_DO_1 && ut.opportunity_present && section(oppText, UAT_THRESHOLD_HEADING).some(l => { const t = l.trim(); return t.startsWith(KHONG_DO_1) && (t.length === KHONG_DO_1.length || /\s/.test(t[KHONG_DO_1.length])); });
  const coNguoiDung = /\b(ui|mobile)\b/i.test(clean(cfm.surfaces) || '');
  const mienDoCoNguoiDung = mienDo && coNguoiDung;
  if (mienDoCoNguoiDung) flags.push(['fred', 'Hồ sơ cơ hội khai không đo được nhưng hợp đồng có mặt người dùng (ui/mobile) — lối «không đo được» chỉ cho vòng không có người dùng cuối; khai lại ngưỡng hoặc bỏ mặt người dùng.']);
```

và trong JSON `--extract` của Gate 1 thêm `cong_gia_tri: { mien_do_co_nguoi_dung: mienDoCoNguoiDung }`. Khi `mienDo` (bất kể surfaces), thay dòng cuối khối «Ngưỡng nghiệm thu» («Vòng này sẽ có phiên nghiệm thu…») bằng «Ô khai không đo được — vòng này không có phiên nghiệm thu; đã giao là đóng.»

- [ ] **Step 4: Chạy** `RT_CASES=RT7,RT11` PASS; `DD_CASES= node tests/plugins/duong-do.test.mjs` PASS; `node tests/plugins/vao-co-o.test.mjs` PASS.

- [ ] **Step 5: Commit** `git add scripts/gate-card.js scripts/start-scan.mjs tests/plugins/ra-co-ten.test.mjs` · `git commit -m "feat(ra-co-ten): thẻ Cổng Đáng (gate 0) + cờ đỏ chống lách không-đo-được (AC-7, AC-11)"`

---

### Task 9: Văn bản nghi thức — 11 file, mỗi file đúng mệnh đề

**Files:** `skills/uat-session/SKILL.md` · `feature-loop/skills/feature-loop/SKILL.md` · `skills/acceptance/SKILL.md` · `CONTEXT.md` · `commands/acceptance-status.md` · `commands/acceptance-report.md` · `commands/signoff.md` · `commands/approve.md` · `commands/start.md` · `skills/acceptance/references/human-facing-language.md`
**Test:** RT6, RT8, RT10, RT12 (phần SKILL), RT15(b)

- [ ] **Step 1: Reader cắt phạm vi + ca (đỏ trước)** — `ALL_IDS.push('RT6','RT8','RT10')`. Viết helper:

```js
const readRepo = rel => readFileSync(path.join(ROOT, rel), 'utf8');
const cut = (txt, startRe, endRe) => { const s = txt.search(startRe); if (s < 0) return ''; const rest = txt.slice(s); const e = rest.slice(1).search(endRe); return e < 0 ? rest : rest.slice(0, e + 1); };
const countIn = (txt, re) => (txt.match(re) || []).length;
// Ma trận mệnh đề: [id, file, hàm cắt phạm vi, regex phải có, số lần]
const MENH_DE_6 = [
  ['uat-§0', 'skills/uat-session/SKILL.md', t => cut(t, /^## 0\. Điều kiện vào/m, /^## 1\./m), /`status: signed-off`[^\n]*`machine-cleared`/, 1],
  ['fl-bảng', 'feature-loop/skills/feature-loop/SKILL.md', t => cut(t, /^\| status hiện tại/m, /^\n(?=\S)/m), /^\| `machine-cleared` \|[^\n]*S5/m, 1],
  ['fl-verified', 'feature-loop/skills/feature-loop/SKILL.md', t => cut(t, /^\| `verified` \|/m, /\n/), /set `status: machine-cleared`/, 1],
  ['fl-S4-3', 'feature-loop/skills/feature-loop/SKILL.md', t => cut(t, /`PASS` \/ `PENDING-JUDGMENT` →/, /^   - \*\*Mọi verdict/m), /machine-cleared/, 1],
  ['acc-lanV', 'skills/acceptance/SKILL.md', t => t, /machine-cleared/, null],
  ['ctx', 'CONTEXT.md', t => cut(t, /^### Gates & verbs/m, /^### /m), /\*\*Máy đã thông\*\*[^\n]*\n[\s\S]*?machine-cleared[\s\S]*?_Avoid_:[^\n]*đã ký/, 1],
  ['status-cmd', 'commands/acceptance-status.md', t => t, /machine-cleared/, null],
  ['report-cmd', 'commands/acceptance-report.md', t => t, /machine-cleared/, null],
];
function checkMenhDe(id, rows, { mutate = true } = {}) {
  const errs = [];
  for (const [ten, file, cutter, re, n] of rows) {
    const scope = cutter(readRepo(file));
    const c = countIn(scope, new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'));
    if (n == null ? c < 1 : c !== n) errs.push(`${ten}: thấy ${c} lần, mong ${n ?? '≥1'}`);
    if (mutate && c >= 1) {   // bản sao gỡ mệnh đề → reader trên bản sao ĐỎ nêu mệnh đề
      const t2 = readRepo(file).replace(re, ''); const c2 = countIn(cutter(t2), new RegExp(re.source, (re.flags + 'g').replace(/g+/, 'g')));
      if (!(n == null ? c2 < 1 : c2 !== n)) errs.push(`${ten}: gỡ mệnh đề mà reader vẫn xanh`);
    }
  }
  return errs;
}
if (want('RT6')) { const e = checkMenhDe('RT6', MENH_DE_6); e.length ? fail('RT6', e.join(' · ')) : pass('RT6', 'năm văn bản nghi thức có mệnh đề machine-cleared đúng chỗ; gỡ → đỏ'); }
```

RT8 — cùng khuôn với ma trận:

```js
const MENH_DE_8 = [
  ['approve-mode', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /`contract\.md` VẮNG[^\n]*`opportunity\.md`[^\n]*`decision` rỗng[^\n]*`stage ≠ archived`/, 1],
  ['approve-map', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /làm→build · lặp→iterate · xếp lại→park · dừng→kill/, 1],
  ['approve-rang', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /TỪ CHỐI[^\n]*ngưỡng[^\n]*`…`[^\n]*Không đo được/, 1],
  ['approve-rang2', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /TỪ CHỐI[^\n]*nguồn ngoài[^\n]*chưa phân loại/i, 1],
  ['approve-dexuat', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /gỡ tiền tố `\[đề xuất\]`/, 1],
  ['approve-ghi', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /`decided_by`[^\n]*`decided_at`[^\n]*`stage: decided`/, 1],
  ['approve-gate0', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /`"type":"gate0"`|type: gate0/, 1],
  ['approve-map-draw', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /product-map\.mjs/, 1],
  ['approve-next', 'commands/approve.md', t => cut(t, /^## Chế độ Cổng Đáng/m, /^## /m), /`\/feature-loop(?::feature-loop)? <slug>`/, 1],
  ['grammar', 'skills/acceptance/references/human-facing-language.md', t => cut(t, /<<<GATE-ONESHOT-GRAMMAR/, /GATE-ONESHOT-GRAMMAR>>>/), /`\/approve \[<slug>\]`[^\n]*Cổng Đáng[^\n]*`làm`[^\n]*`lặp`[^\n]*`xếp lại`[^\n]*`dừng`/, 1],
  ['start-4', 'commands/start.md', t => cut(t, /^4\. \*\*MỘT câu hỏi/m, /^5\./m), /cổng `dang`[^\n]*\/acceptance-card <slug>[^\n]*\/approve <slug>/, 1],
];
if (want('RT8')) {
  const errs = checkMenhDe('RT8', MENH_DE_8);
  // slot g0 round-trip: mọi nhãn g0 trong SLOTS phải xuất hiện trong approve.md (và ngược lại ≥1 hàng g0)
  const slots = cut(readRepo('skills/acceptance/references/human-facing-language.md'), /<<<GATE-ONESHOT-SLOTS/, /GATE-ONESHOT-SLOTS>>>/).split('\n').filter(l => /^g0 /.test(l)).map(l => l.slice(3).trim());
  if (!slots.length) errs.push('SLOTS không có hàng g0');
  const ap = readRepo('commands/approve.md'); for (const s of slots) if (!ap.includes(s)) errs.push(`nhãn g0 «${s}» không có trong approve.md`);
  errs.length ? fail('RT8', errs.join(' · ')) : pass('RT8', 'approve chế độ Cổng Đáng đủ 9 mệnh đề; GRAMMAR + SLOTS g0 round-trip; start.md hết con trỏ chết');
}
if (want('RT10')) {
  const errs = [];
  const u = cut(readRepo('skills/uat-session/SKILL.md'), /^## 0\./m, /^## 1\./m); const a = readRepo('commands/approve.md');
  if (!u.includes(`«${KHONG_DO}`) && !u.includes(`\`${KHONG_DO}`)) errs.push('uat-session §0 không chứa đúng tiền tố không-đo-được');
  if (!a.includes(KHONG_DO)) errs.push('approve.md không chứa đúng tiền tố không-đo-được'); if (!a.includes(DE_XUAT)) errs.push('approve.md không chứa đúng tiền tố [đề xuất]');
  // bộ quét và thẻ dùng đúng chuỗi khuôn: fixture dựng từ CHÍNH chuỗi khuôn đã chạy ở RT9/RT7; ở đây thử bản sao khuôn đổi chuỗi → reader đỏ nêu cả hai
  const t2 = tmp('rt10-'); const fake = path.join(t2, 'opportunity-template.md');
  writeFileSync(fake, readFileSync(OPP_TPL, 'utf8').replace('Không đo được — ', 'Khong do duoc — '));
  const k2 = blockFromTemplate(fake, 'OPP-KHONG-DO-DUOC-PREFIX').trim();
  if (k2 === KHONG_DO) errs.push('bản sao khuôn đổi chuỗi mà reader không thấy khác'); else if (!(u.includes(KHONG_DO) && !u.includes(k2))) errs.push(`chiều đỏ: khuôn «${k2}» ≠ uat-session «${KHONG_DO}» — phải nêu cả hai`);
  rmSync(t2, { recursive: true, force: true });
  errs.length ? fail('RT10', errs.join(' · ')) : pass('RT10', 'hai tiền tố round-trip khuôn ↔ bộ quét/thẻ/uat-session/approve; đổi khuôn → đỏ nêu hai chuỗi');
}
```

RT12 phần SKILL — thêm vào khối RT12: `errs.push(...checkMenhDe('RT12', [['uat-kill', 'skills/uat-session/SKILL.md', t => cut(t, /^## 5\./m, /^## 6\.|\Z/m), /`kill`[^\n]*`stage: archived`[^\n]*`opportunity\.md`/, 1], ['uat-iterate', 'skills/uat-session/SKILL.md', t => cut(t, /^## 5\./m, /^## 6\.|\Z/m), /`iterate`[^\n]*\/feature-loop/, 1]]));` (chỉnh số §5 theo mục «Bước kế theo verdict» thật, dòng 113-114).

RT15(b) — thêm vào khối RT15: `errs.push(...checkMenhDe('RT15', [['signoff-mc', 'commands/signoff.md', t => t, /`machine-cleared`[^\n]*`status: signed-off`/, null]]));`

- [ ] **Step 2: Sửa từng file** (mỗi chỗ một câu; văn mặt người theo N1–N6):

1. `skills/uat-session/SKILL.md` §0 bullet đầu: ``- `_acceptance/<slug>/contract.md` có `status: signed-off` hoặc `machine-cleared` (máy đã thông — làn V xanh-sạch, không chữ ký; lưới trước-merge đã kiểm lời khai).`` Thêm bullet ngưỡng: ``- …section "Ngưỡng chết / ngưỡng UAT" đã CHỐT (không còn `…`, không còn `[đề xuất]`). Ô có dòng «`Không đo được — `…» → DỪNG một dòng: «ô này khai không đo được — không có phiên nghiệm thu, không treo»; ngưỡng còn trống → DỪNG nêu đúng hai lối: điền ngưỡng, hoặc khai một dòng «Không đo được — <lý do>» kèm entry sổ quyết định.`` Mục «Bước kế theo verdict» (dòng 113-114): ``· `iterate` → in một dòng bước kế: «mở vòng kế bằng `/feature-loop <mô tả>` — hồ sơ mới, ô cơ hội giữ nguyên với `decision: iterate`» · `kill` → ghi `stage: archived` vào `opportunity.md` CÙNG lượt commit verdict (đóng có hồ sơ — bộ quét xếp «đã đóng có hồ sơ»).``
2. `feature-loop/skills/feature-loop/SKILL.md`: hàng `verified` → «… → **set `status: machine-cleared`**, commit phần máy viết, báo một dòng, đi tiếp S5 (KHÔNG mời ký)…»; thêm hàng ``| `machine-cleared` | S5 SHIP — máy đã thông, cửa veto theo `veto_state`; người ký/veto sau vẫn được (`/signoff` đổi sang `signed-off`) |`` sau hàng verified; S4(3) nhánh PASS: sau «(3) set contract `status: verified`» thêm «— và nếu đủ sáu điều kiện xanh-sạch ∧ không chạm khó-đảo thì set thẳng `status: machine-cleared` (ô kết của làn V; lưới trước-merge kiểm lời khai này)».
3. `skills/acceptance/SKILL.md` đoạn làn V (tìm «đi tiếp S5, KHÔNG mời ký» hoặc tương đương): thêm «hồ sơ ghi `status: machine-cleared` — ô kết có tên của làn V».
4. `CONTEXT.md` mục Gates & verbs, sau **Signoff**: 
   ```
   **Máy đã thông** (`machine-cleared`):
   Trạng thái kết của làn V — máy qua Cổng Bằng chứng bằng sáu điều kiện xanh-sạch, KHÔNG có chữ ký người; cửa veto vẫn mở theo `veto_state`. Lưới trước-merge coi nó là lời khai và đòi bằng chứng. Ký sau → `/signoff` đổi sang `signed-off`.
   _Avoid_: đã ký, đã duyệt (đó là chữ của người); gộp chung chữ với `signed-off` ở bất kỳ mặt người nào.
   ```
   và thêm hàng bảng «Tên bốn cổng» không đổi (Cổng Đáng đã có).
5. `commands/acceptance-status.md`, `commands/acceptance-report.md`: nơi liệt trạng thái, thêm `machine-cleared` với nghĩa một cụm.
6. `commands/signoff.md`: ở bước ghi (dòng ~106): «chữ «Ký» → `human_signoff` + contract `status: signed-off` — **kể cả khi hồ sơ đang `machine-cleared`** (người ký trong cửa veto: status đổi sang `signed-off` cùng lượt, không để chữ ký nằm trên hồ sơ máy-thông)».
7. `commands/approve.md`: thêm mục mới sau Steps:
   ```
   ## Chế độ Cổng Đáng (hồ sơ chưa có hợp đồng)

   Nhận ra khi: `contract.md` VẮNG ∧ `opportunity.md` có ∧ `decision` rỗng ∧ `stage ≠ archived`. Thẻ: `/acceptance-gate:acceptance-card <slug>` tự nhận Cổng Đáng. Câu gộp: `làm|lặp|xếp lại|dừng [; giữ proto|lưu proto] [; không đo được: <lý do>] [: <tên> [<ngày>]]` — map làm→build · lặp→iterate · xếp lại→park · dừng→kill; `giữ proto`/`lưu proto` chỉ hỏi khi `prototype.base_commit` có.
   1. **Răng chiều đỏ:** `làm`/`lặp` mà ô ngưỡng còn `…` và không có dòng «Không đo được — » (trong file hay trong câu gộp) → TỪ CHỐI, in đúng câu cờ đỏ của thẻ («ký trên thước trang trí»). `làm`/`lặp` mà bảng Nguồn ngoài còn hàng chưa phân loại → TỪ CHỐI (khuôn §Nguồn ngoài). `xếp lại`/`dừng` không cần ngưỡng.
   2. Gỡ tiền tố `[đề xuất]` khỏi mọi bullet ngưỡng (ký = nhận); câu gộp có «không đo được: …» → ghi dòng `Không đo được — <lý do>` thay các bullet `…`.
   3. Ghi `decided_by`, `decided_at` (ISO, ngày lệnh chạy — danh tính theo bậc thang đầu file), `stage: decided`, `decision`, `prototype.disposition` khi hỏi; `dừng` → `stage: archived`.
   4. Append sổ quyết định: `{"id":"d-<UTC>-<rand>","type":"gate0","at":"<ISO>","by":"<tên>","decision":"<lối> — <tên ý>"}`.
   5. Vẽ lại bản đồ nếu repo bật: `node <plugin>/scripts/product-map.mjs --root <repo>`; commit MỘT lượt (ô cơ hội + sổ + bản đồ); in bước kế: `build`/`iterate` → «`/feature-loop:feature-loop <slug>`»; `park` → «đã xếp lại, không ai phải làm gì»; `kill` → «đã đóng có hồ sơ».
   ```
   (Mệnh đề phải chứa các chuỗi mà RT8 tìm — đối chiếu ma trận `MENH_DE_8` khi viết.)
8. `commands/start.md` bước 4: «- Chọn một cổng → `/acceptance-card <slug>`; riêng cổng `dang` → thẻ Cổng Đáng rồi ký bằng `/approve <slug> <lối>` (hết con trỏ chết sang thẻ Cổng Phạm vi); riêng cổng `gia-tri` → …». Khối `START-HIEU-KET` ⑤: «section «Ngưỡng» máy ĐƯỢC điền bằng đề xuất khi có căn cứ, mỗi bullet mang tiền tố `[đề xuất]` ngay sau dấu `:` (khối `OPP-DE-XUAT-PREFIX` của khuôn); ý còn mờ thật thì giữ `…`; vòng không có người dùng cuối → một dòng «Không đo được — <lý do>» thay bullet. Có đề xuất là máy tự đưa sang chờ Cổng Đáng ở lần quét sau.» Bước 3 dòng «Đang cân nhắc»: thêm «— chỉ còn ý máy không đề xuất nổi ngưỡng». Dòng cổng `gia-tri`: in `flags` nếu có: `nguong-chua-chot` → «ngưỡng chưa chốt — điền ngưỡng vào ô, hoặc khai “Không đo được — …” kèm một dòng sổ»; `mien-do-co-nguoi-dung` → «⚠ khai không đo được nhưng hợp đồng có mặt người dùng»; `qua-timebox` → «quá hạn tự khai — xem lại: xếp lại hay kéo dài». Thêm `flags` vào khối `START-SCAN-KEYS` (`groups.gates[].flags groups.done[].flags groups.inProgress[].flags`) và hai `state` mới `khong-do-duoc`/`archived` vào đoạn `groups.done`.
9. `human-facing-language.md` `GATE-ONESHOT-GRAMMAR`: thêm bullet ``- `/approve [<slug>]` ở chế độ Cổng Đáng (hồ sơ chưa có hợp đồng): câu gộp `làm` · `lặp` · `xếp lại` · `dừng` [`; giữ proto`|`; lưu proto`] [`; không đo được: <lý do>`] [`: <tên> [<ngày>]`].`` `GATE-ONESHOT-SLOTS` thêm `g0 lối ra` · `g0 giữ proto` · `g0 không đo được`. Cập nhật câu «Mười hai thân lệnh» nếu đếm thay đổi (không đổi — vẫn 6 site × 1).

- [ ] **Step 3: Chạy** `RT_CASES=RT6,RT8,RT10,RT12,RT15` → 5 PASS. Hồi quy chữ: `bash tests/plugins/run-tests.sh` đoạn P (ONLY_BLOCK không dùng — chạy trọn ở Task 12).

- [ ] **Step 4: Commit** 10 file + test: `git commit -m "feat(ra-co-ten): văn bản nghi thức — machine-cleared ở 7 chỗ, /approve chế độ Cổng Đáng, /start hết con trỏ chết, CONTEXT term (AC-6, AC-8, AC-10, AC-12, AC-15b)"`

---

### Task 10: Đọc-cũ — snapshot + quan hệ + quét không gian mở (RT13)

**Files:** `tests/plugins/ra-co-ten.test.mjs` · (đọc) `_acceptance/ra-co-ten-lam-va-trao/contract.md`

- [ ] **Step 1: RT13** — `ALL_IDS.push('RT13')`

```js
if (want('RT13')) {
  const errs = [];
  const contractRT = readRepo('_acceptance/ra-co-ten-lam-va-trao/contract.md');
  const block = (m) => { const x = contractRT.match(new RegExp(`<<<${m}\\n([\\s\\S]*?)${m}>>>`)); if (!x) { errs.push(`contract thiếu khối ${m}`); return []; } return x[1].trim().split('\n').map(l => l.trim()).filter(Boolean); };
  const KHAC = block('KHAC-BIET-DOC-CU').map(l => l.split(/\s+/));
  const GACH = block('BO-DOC-KHAI-GACH').map(l => l.split(/\s+/)[0]);
  // (i)+(ii): bản mới vs bản cũ cb38ea01 trên cùng cây thật
  const jNew = scan(ROOT);
  if (jNew.broken.length) errs.push(`bản mới broken: ${JSON.stringify(jNew.broken.map(b => b.slug))}`);
  const old = tmp('rt13-old-'); const show = rel => execFileSync('git', ['-C', ROOT, 'show', `cb38ea01:${rel}`], { encoding: 'utf8' });
  for (const rel of ['scripts/start-scan.mjs', 'scripts/trang-thai-ho-so.cjs', 'scripts/khong-can-nguoi.mjs', 'lib/workspace-record.cjs', 'lib/evidence-core.cjs', 'lib/md-section.cjs', 'lib/ac-line.cjs', 'skills/acceptance/references/opportunity-template.md']) W(old, rel, show(rel));
  const jOld = scan(ROOT, path.join(old, 'scripts', 'start-scan.mjs')); rmSync(old, { recursive: true, force: true });
  const keyOf = j => { const m = new Map(); for (const grp of ['gates', 'inProgress', 'considering', 'done']) for (const x of (j.groups[grp] || [])) m.set(x.slug, x.stateKey); for (const b of (j.broken || [])) m.set(b.slug, 'ho-so-hong'); return m; };
  const mOld = keyOf(jOld), mNew = keyOf(jNew);
  for (const [slug, kOld] of mOld) { const kNew = mNew.get(slug); const kh = KHAC.find(r => r[0] === slug); if (kh) { if (kOld !== kh[1] || kNew !== kh[2]) errs.push(`${slug}: khai ${kh[1]}→${kh[2]}, thực ${kOld}→${kNew}`); } else if (kOld !== kNew) errs.push(`${slug}: lệch ${kOld}→${kNew} không khai`); }
  for (const slug of mNew.keys()) if (!mOld.has(slug)) errs.push(`${slug}: chỉ có ở bản mới`);
  // (iii) cờ đo bằng QUAN HỆ
  const allNew = ['gates', 'inProgress', 'done'].flatMap(grp => (jNew.groups[grp] || []).map(x => ({ grp, ...x })));
  const { section } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
  for (const x of allNew) {
    const op = path.join(ROOT, '_acceptance', x.slug, 'opportunity.md'); const oTxt = existsSync(op) ? readFileSync(op, 'utf8') : null;
    const tb = oTxt && section(oTxt, 'Ngưỡng chết / ngưỡng UAT').find(l => /^-\s*Timebox:/.test(l)); const d = tb && (tb.match(/\b(\d{4})-(\d{2})-(\d{2})\b/) || tb.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/));
    const date = d ? (d[0].includes('-') ? Date.UTC(+d[1], +d[2] - 1, +d[3]) : Date.UTC(+d[3], +d[2] - 1, +d[1])) : null;
    const hasVerdict = existsSync(path.join(ROOT, '_acceptance', x.slug, 'uat-session.md')) && /^verdict:\s*\S/m.test(readFileSync(path.join(ROOT, '_acceptance', x.slug, 'uat-session.md'), 'utf8'));
    const expQua = !!date && date < Date.now() && !hasVerdict && x.grp !== 'considering';
    if (((x.flags || []).includes('qua-timebox')) !== expQua) errs.push(`${x.slug}: qua-timebox ${expQua ? 'thiếu' : 'thừa'}`);
    const expNg = x.grp === 'gates' && x.gate === 'gia-tri' && oTxt && !(section(oTxt, 'Ngưỡng chết / ngưỡng UAT').every(l => !/^-\s*[^:]+:\s*(…|\.\.\.)?\s*$/.test(l)) && !section(oTxt, 'Ngưỡng chết / ngưỡng UAT').some(l => l.includes(DE_XUAT)));
    if (((x.flags || []).includes('nguong-chua-chot')) !== !!expNg) errs.push(`${x.slug}: nguong-chua-chot ${expNg ? 'thiếu' : 'thừa'}`);
  }
  // (iv) quét không gian mở: file chứa "signed-off" ngoài _acceptance/** docs/** == paths của evals ∪ khối gạch
  const files = execFileSync('git', ['-C', ROOT, 'grep', '-l', 'signed-off', '--', ':!_acceptance', ':!docs', ':!PRODUCT-MAP.md', ':!CHANGELOG.md', ':!README.md', ':!GUIDE.md', ':!QUICKSTART.md'], { encoding: 'utf8' }).trim().split('\n');
  const evalsY = readRepo('_acceptance/ra-co-ten-lam-va-trao/evals.yaml'); const paths = new Set((evalsY.match(/paths: \[([^\]]+)\]/g) || []).flatMap(l => l.slice(8, -1).split(',').map(s => s.trim())));
  for (const f of files) if (!paths.has(f) && !GACH.includes(f)) errs.push(`file lạ chứa signed-off: ${f} — thêm ca hoặc khai gạch`);
  for (const f of GACH) if (!files.includes(f)) errs.push(`khối gạch khai ${f} nhưng file không còn chứa signed-off (dòng chết)`);
  // chiều đỏ: (1) bản sao contract xoá dòng khối → reader đỏ nêu slug; (2) tiêm file mới chứa chuỗi → đỏ nêu file (mô phỏng bằng mảng)
  { const KHAC2 = KHAC.slice(1); const kh = KHAC[0]; if (kh && !KHAC2.find(r => r[0] === kh[0]) && mOld.get(kh[0]) === mNew.get(kh[0])) errs.push('chiều đỏ (1): xoá dòng khối mà không lệch — khối không còn cần thiết?'); }
  { const files2 = [...files, 'scripts/gia-lap-moi.mjs']; const la = files2.filter(f => !paths.has(f) && !GACH.includes(f)); if (!la.includes('scripts/gia-lap-moi.mjs')) errs.push('chiều đỏ (2): tiêm file lạ mà không bị nêu'); }
  errs.length ? fail('RT13', errs.join(' · ')) : pass('RT13', `đọc-cũ: ${mOld.size} hồ sơ, khác biệt đúng khối; cờ ⇔ điều kiện; ${files.length} file chứa signed-off đều có ca hoặc khai gạch`);
}
```

- [ ] **Step 2: Chạy** — PASS chỉ sau Task 11 (duong-do đổi khoá). Trước đó FAIL nêu `duong-do…: khai cho-cong-gia-tri→da-giao-khong-do, thực …→cho-cong-gia-tri` — đúng chiều đỏ tự nhiên. Nếu (iv) nêu file lạ: thêm ca hoặc khai gạch vào khối contract (cùng lượt, có lý do).

- [ ] **Step 3: Commit** `git add tests/plugins/ra-co-ten.test.mjs` · `git commit -m "test(ra-co-ten): RT13 đọc-cũ — snapshot cũ/mới, cờ theo quan hệ, quét không gian mở (AC-13)"`

---

### Task 11: Hồ sơ thật `duong-do-trong-dinh-nghia-xong` thoát bằng lối có tên (RT14)

**Files:** `_acceptance/duong-do-trong-dinh-nghia-xong/opportunity.md` (section Ngưỡng) · `_acceptance/duong-do-trong-dinh-nghia-xong/decisions.jsonl` (append)

- [ ] **Step 1: RT14** — `ALL_IDS.push('RT14')`

```js
if (want('RT14')) {
  const errs = []; const D = '_acceptance/duong-do-trong-dinh-nghia-xong';
  const o = readRepo(`${D}/opportunity.md`); const { section } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
  if (!section(o, 'Ngưỡng chết / ngưỡng UAT').some(l => l.trim().startsWith(KHONG_DO))) errs.push('ô ngưỡng chưa có dòng Không đo được —');
  if (!/^decision:\s*build/m.test(o) || !/^decided_by:\s*Manh Phan/m.test(o)) errs.push('decision/decided_by đã đổi');
  const oOld = execFileSync('git', ['-C', ROOT, 'show', `cb38ea01:${D}/opportunity.md`], { encoding: 'utf8' });
  if ((oOld.match(/^decided_at:.*/m) || [])[0] !== (o.match(/^decided_at:.*/m) || [])[0]) errs.push('decided_at đã đổi');
  const led = readRepo(`${D}/decisions.jsonl`).split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  if (!led.some(e => e.type === 'revisit' && /Không đo được/.test(e.decision || '') && /d-20260822T000500Z-4306/.test(JSON.stringify(e)))) errs.push('sổ thiếu entry revisit cite d-4306');
  const x = findSlug(scan(ROOT), 'duong-do-trong-dinh-nghia-xong'); if (!x || x.stateKey !== 'da-giao-khong-do') errs.push(`bộ quét: ${JSON.stringify(x)}`);
  errs.length ? fail('RT14', errs.join(' · ')) : pass('RT14', 'duong-do thoát bằng lối có tên, có vết, quyết định đã ký giữ nguyên');
}
```

- [ ] **Step 2: Sửa hồ sơ thật** — thay bốn bullet `…` trong section Ngưỡng của `opportunity.md` bằng:

```
- Không đo được — vòng nội bộ của bộ công cụ, không có người dùng cuối; người dùng thay thế là chính đội dùng kit (ô «Đường đo» của hợp đồng đã bỏ có tên, entry d-20260822T000500Z-4306). Khai bổ sung 2026-08-23 theo lối ra có tên của hồ sơ ra-co-ten-lam-va-trao — không sửa `decision`.
```

Append sổ:

```bash
printf '%s\n' '{"id":"d-20260823T130000Z-31010","type":"revisit","stage":"gate2","at":"2026-08-23T13:00:00Z","decision":"Cổng Giá trị: ô ngưỡng khai «Không đo được — vòng nội bộ của bộ công cụ, không có người dùng cuối» — lối ra có tên, thay cho sửa tay decision: park","impact":"hồ sơ rời nhóm chờ Cổng Giá trị sang «đã giao — không đo»; decision/decided_by/decided_at giữ nguyên; cite descope d-20260822T000500Z-4306 (bỏ đường-đo cùng lý do)"}' >> _acceptance/duong-do-trong-dinh-nghia-xong/decisions.jsonl
```

- [ ] **Step 3: Chạy** `RT_CASES=RT13,RT14` → 2 PASS. `node scripts/product-map.mjs --root . --check` → lệch (hồ sơ đổi ô) → vẽ lại: `node scripts/product-map.mjs --root .`.

- [ ] **Step 4: Commit** `git add _acceptance/duong-do-trong-dinh-nghia-xong/opportunity.md _acceptance/duong-do-trong-dinh-nghia-xong/decisions.jsonl PRODUCT-MAP.md tests/plugins/ra-co-ten.test.mjs` · `git commit -m "acceptance(duong-do): thoát Cổng Giá trị bằng lối «Không đo được» có vết — ca thử sống đầu tiên (AC-14)"`

---

### Task 12: Bốn suite + bản đồ + `status: implemented`

- [ ] **Step 1:** `bash tests/plugins/run-tests.sh` → `Results: all plugin tests passed`, 15 dòng `PASS: [RT…]` + `PASS: [BDK2]`.
- [ ] **Step 2:** `bash tests/scripts/run-tests.sh` · `bash tests/hooks/run-tests.sh` · `bash tests/workflows/run-tests.sh` → 0 failed. `node scripts/product-map.mjs --root . --check` → khớp.
- [ ] **Step 3:** `node scripts/eval-coverage-lint.js .` → không W mới cho slug này ngoài hai W6 đã biết.
- [ ] **Step 4:** `sed -i '' 's/^status: approved$/status: implemented/' _acceptance/ra-co-ten-lam-va-trao/contract.md` (hook cho phép approved→implemented vì approved_by có).
- [ ] **Step 5:** Commit: `git add _acceptance/ra-co-ten-lam-va-trao/contract.md` · `git commit -m "S3(ra-co-ten-lam-va-trao): code xong, bốn suite xanh — sang nghiệm thu máy"`. Rồi dispatch S4 NGAY (feature-loop SKILL S4, round 1).

---

## Self-review

- **Phủ đặc tả:** §1.1–1.3 → Task 1,2,3,4,5,6,7,9 · §2.1 → Task 1 + 9 (start.md) · §2.2 → Task 8 · §2.3 → Task 9 (approve) · §3.1 → Task 1 + 6 · §3.2 → Task 6 + 9 (start.md flags) · §3.3 → Task 6 + 8 · §3.4 → Task 6 + 7 + 9 (uat-session) · §4.1 → Task 10 · §4.2 → mọi task có cặp đỏ/xanh · AC-14 → Task 11 · AC-15 → Task 3, 4, 6, 9.
- **Tên nhất quán:** `DA_THONG_CONG_2` (Task 2 → 6, 7) · `machineClearedSignoffConflict` (Task 3 → 6) · `thresholdState` (Task 6) · khoá `da-giao-may-thong-veto-mo` / `da-giao-may-thong-xanh-sach` / `da-giao-khong-do` / `da-dong-ho-so` (Task 5 → 6, 7, 10) · flag `nguong-chua-chot` / `mien-do-co-nguoi-dung` / `qua-timebox` (Task 6 → 8, 9, 10) · marker `EVIDENCE-XANH-SACH-BLOCK` / `OPP-DE-XUAT-PREFIX` / `OPP-KHONG-DO-DUOC-PREFIX` (Task 1 → mọi reader).
- **Bẫy đã biết:** `ngayXong(dir, cPath)` của start-scan cần chữ ký hiện có — giữ nguyên cách gọi. Ma trận BDK2 gõ tay 24 (không `Object.keys`). `git grep` trong RT13 loại đúng các file docs T1 để không đếm tài liệu — danh sách loại là **đóng và khai trong ca**, file docs mới chứa chuỗi sẽ nêu tên (đúng chiều fail-closed).
