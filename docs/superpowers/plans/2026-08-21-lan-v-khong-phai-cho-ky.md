# Làn V không phải «chờ ký» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Máy quét vào phiên và bản đồ sản phẩm đọc hồ sơ làn V (T2 · `veto_state: mo` có vết · evidence PASS · chưa ký) là **đã giao, cửa veto mở** — cùng luật với lưới trước-merge — thay vì «chờ Cổng Bằng chứng» / «Đang làm».

**Architecture:** Một vị từ `lanVMo()` + một hằng nhãn `VETO_OPEN_NOTE` xuất từ `scripts/product-map.mjs`; `scripts/start-scan.mjs` nhập TĨNH và dùng chính vị từ đó. Vị từ chỉ *gọi* `vetoGateState` + `frontmatterField` đã có trong `lib/evidence-core.cjs` — **không** thêm mã vào `lib/` (là `t3_paths`, sẽ nâng hạng hồ sơ lên T3).

**Tech Stack:** Node ESM (`.mjs`) không phụ thuộc ngoài; `lib/evidence-core.cjs` qua `createRequire`; suite bash fixture-driven (`tests/plugins/run-tests.sh`); răng hồ sơ bash.

**Spec:** [docs/superpowers/specs/2026-08-21-lan-v-khong-phai-cho-ky-design.md](../specs/2026-08-21-lan-v-khong-phai-cho-ky-design.md) · hợp đồng `_acceptance/lan-v-khong-phai-cho-ky/contract.md` · phép đo `_acceptance/lan-v-khong-phai-cho-ky/evals.yaml`

## Global Constraints

- **Vị từ sống ở `scripts/product-map.mjs`. TUYỆT ĐỐI không thêm/sửa file trong `lib/`** — `lib/**` là `t3_paths`, chạm vào là hồ sơ đổi hạng và mất làn V.
- **Chuỗi nhãn khai đúng MỘT lần:** `export const VETO_OPEN_NOTE = 'cửa veto mở';` trong `product-map.mjs`. Mọi nơi khác (răng, ca kiểm) **import** hằng này; cấm gõ lại chuỗi.
- **Hai marker bắt buộc, viết đúng chữ, mỗi marker một dòng comment riêng** — mutant của răng dùng `sed` ghim vào chúng: `LAN-V-MO` (nhánh classify của bản đồ) và `LAN-V-PASS` (điều kiện `verdict === 'PASS'` trong vị từ).
- **Thứ tự nhánh: chữ ký TRƯỚC vị từ V.** Hồ sơ đã ký giữ `signed-off` / không chú thích, bất kể `veto_state`.
- **Ca kiểm đặt tên theo slug (`LV1`…`LV7`), KHÔNG lấy số `P` toàn cục.**
- **Ai in dòng `PASS: LV<n>`:** chỉ `tests/plugins/lan-v.test.mjs`. Tên của 7 dòng `run` trong suite **phải bắt đầu bằng `ca lan V —`**, không bao giờ chứa chuỗi `PASS: LV<n>`, để suite có **đúng 7** dòng khớp `PASS: LV1`…`PASS: LV7` (E12). Vi phạm quy ước này = E12 đỏ vì đếm đôi.
- **Răng suy `ROOT` từ vị trí script**: `ROOT="$(cd "$(dirname "$0")/../.." && pwd)"`; mọi lệnh truyền `--root "$ROOT"` hoặc `--root "$COPY"` tường minh. **Cấm `--root .`** và cấm mọi đường dẫn hardcode.
- **`cmd:` của răng khai bằng ĐƯỜNG DẪN** (`_acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan <x>`) — **không thêm khoá nào vào `_acceptance/config.yaml`**.
- Mọi phép đo mới phải có **cặp hai chiều trên cùng fixture**: vật lành → xanh (đối chứng dương chạy TRƯỚC), vật bị phá → đỏ với **thông điệp ghim** (không chỉ mã thoát).
- Fixture **code-sinh trong chính lần chạy**, frontmatter rút từ khuôn canonical qua `tests/fixtures/from-template.mjs` — cấm gõ tay frontmatter theo khuôn bên đọc.
- Chạy `node --check` không áp cho `.mjs` có top-level await; verify per-task dùng lệnh ghi trong từng task.

---

## File Structure

| File | Trách nhiệm |
|---|---|
| `scripts/product-map.mjs` (Modify) | **Nguồn** của vị từ `lanVMo` + hằng `VETO_OPEN_NOTE`; nhánh `LAN-V-MO` trong `classify` |
| `scripts/start-scan.mjs` (Modify) | Nhập tĩnh vị từ; nhánh `verified` trả `done` state `lan-v-mo` |
| `tests/plugins/lan-v.test.mjs` (Create) | LV1–LV7, tự in `PASS:`/`FAIL:`, nhận `LV_CASES` để chạy một phần |
| `tests/plugins/run-tests.sh` (Modify) | 7 dòng `run` gọi file ca, mỗi dòng một ca |
| `_acceptance/lan-v-khong-phai-cho-ky/rang.sh` (Create) | 4 chân: `cases` · `mutant` · `mot-chu` · `ban-do` |
| `commands/start.md` (Modify) | Một dòng render: trạng thái `lan-v-mo` + cách đếm ở dòng cuối thẻ |
| `PRODUCT-MAP.md` (Modify) | Vẽ lại bằng `product-map.mjs` — CÙNG lượt sửa script |

---

### Task 1: Vị từ làn V + nhánh bản đồ + LV1

**Files:**
- Modify: `scripts/product-map.mjs` (thêm export sau `const fm = …` dòng 94; thêm nhánh trong `classify` ngay trước `return { key: 'dang-dung', … }`)
- Modify: `scripts/start-scan.mjs` (import tĩnh; nhánh `verified` quanh dòng 196–206)
- Create: `tests/plugins/lan-v.test.mjs`

**Interfaces:**
- Produces: `export const VETO_OPEN_NOTE: string` = `'cửa veto mở'`; `export function lanVMo(contractTxt: string|null, verdict: string|null, signoff: string|null): boolean`
- Produces: `tests/plugins/lan-v.test.mjs` — chạy bằng `node <file>`, đọc env `LV_CASES` (danh sách phân cách dấu phẩy, vắng = chạy tất), in `PASS: LV<n> <tên>` hoặc `FAIL: LV<n> <thông điệp ghim>`, exit 1 nếu có ca đỏ.
- Consumes: `vetoGateState(payload) → { present, state, openedAt, stamped, tier }` từ `lib/evidence-core.cjs` (đã có, không sửa).

- [ ] **Step 1: Viết ca LV1 (RED trước)**

Tạo `tests/plugins/lan-v.test.mjs`:

```js
// Ca của hồ sơ lan-v-khong-phai-cho-ky (LV1–LV7). Mỗi ca dựng fixture CODE-SINH
// từ khuôn canonical, hỏi CẢ HAI bộ đọc (start-scan.mjs + renderProductMap) và
// ghim GIÁ TRỊ của từng bộ đọc trước, rồi mới ghim quan hệ giữa hai bên.
// Chạy một phần: LV_CASES=LV1,LV7 node tests/plugins/lan-v.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const { renderProductMap, VETO_OPEN_NOTE } = await import(path.join(ROOT, 'scripts', 'product-map.mjs'));
const { fileFromTemplate } = await import(path.join(ROOT, 'tests', 'fixtures', 'from-template.mjs'));

const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');

let failures = 0;
const only = (process.env.LV_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
const pass = (id, name) => console.log(`PASS: ${id} ${name}`);
const fail = (id, msg) => { console.log(`FAIL: ${id} ${msg}`); failures++; };

// Fixture code-sinh: frontmatter contract rút từ khuôn canonical (from-template),
// không gõ tay theo khuôn bên đọc.
function mkWorkspace(root, slug, { status, veto, opened, tier, verdict, signoff }) {
  const dir = path.join(root, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  let fmLines = [
    'schema_version: 1',
    `feature: ${slug} — fixture`,
    `slug: ${slug}`,
    'owner: fixture@example.com',
    `risk_tier: ${tier}`,
    'surfaces: [cli]',
    `status: ${status}`,
    'approved_by:',
    'approved_at:',
  ];
  if (veto !== null) fmLines.push(`veto_state: ${veto}`);
  if (opened !== null) fmLines.push(`veto_opened_at: ${opened}`);
  writeFileSync(path.join(dir, 'contract.md'),
    `---\n${fmLines.join('\n')}\n---\n\n# Contract: ${slug}\n\n## Criteria\n\n- AC-1: fixture\n\n## Out of scope\n\n- nothing\n`);
  if (verdict !== null) {
    writeFileSync(path.join(dir, 'evidence-report.md'),
      `---\nschema_version: 1\nslug: ${slug}\nverdict: ${verdict}\nverified_commit: ${'0'.repeat(40)}\nhuman_signoff:${signoff ? ' ' + signoff : ''}\n---\n\n# Evidence: ${slug}\n`);
  }
  return dir;
}

function mkRepo() {
  const root = mkdtempSync(path.join(tmpdir(), 'lanv-'));
  mkdirSync(path.join(root, '_acceptance'), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\nenforcement: strict\n');
  return root;
}

// Bộ đọc 1 — máy quét vào phiên. Trả { gates: Set, done: Map<slug,state> }.
function scan(root) {
  const out = execFileSync('node', [path.join(ROOT, 'scripts', 'start-scan.mjs'), '--root', root], { encoding: 'utf8' });
  const j = JSON.parse(out);
  return {
    gates: new Set((j.groups.gates || []).map(g => g.slug)),
    done: new Map((j.groups.done || []).map(d => [d.slug, d.state])),
    broken: new Set((j.broken || []).map(b => b.slug)),
  };
}

// Bộ đọc 2 — bản đồ. Trả mục chứa slug + có chú thích không.
function mapOf(root, slug) {
  const md = renderProductMap(root);
  let section = null, line = null;
  for (const l of md.split('\n')) {
    if (l.startsWith('## ')) section = l.slice(3).trim();
    else if (l.startsWith('- ') && l.includes(`\`${slug}\``)) { line = l; break; }
  }
  return { section, line, note: line ? line.includes(VETO_OPEN_NOTE) : false };
}

const R_PLUS = { status: 'verified', veto: 'mo', opened: '2026-08-21T09:00:00Z', tier: 'T2', verdict: 'PASS', signoff: '' };

if (want('LV1')) {
  const root = mkRepo();
  try {
    mkWorkspace(root, 'lv-r-plus', R_PLUS);
    const s = scan(root), m = mapOf(root, 'lv-r-plus');
    const errs = [];
    if (s.gates.has('lv-r-plus')) errs.push('V-mo PASS T2 van nam trong gates');
    if (s.done.get('lv-r-plus') !== 'lan-v-mo') errs.push(`may quet: state ky vong lan-v-mo, thuc te ${s.done.get('lv-r-plus') ?? '(khong co trong done)'}`);
    if (m.section !== 'Đã giao') errs.push(`ban do van xep ${m.section ?? '(khong thay slug)'}`);
    if (!m.note) errs.push(`ban do thieu chu thich "${VETO_OPEN_NOTE}"`);
    if (errs.length) fail('LV1', errs.join(' · '));
    else pass('LV1', 'V-mo PASS T2 -> done lan-v-mo, khong gates (ca hai bo doc)');
  } finally { rmSync(root, { recursive: true, force: true }); }
}

process.exit(failures ? 1 : 0);
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `node tests/plugins/lan-v.test.mjs`
Expected: `FAIL: LV1 V-mo PASS T2 van nam trong gates · may quet: state ky vong lan-v-mo, thuc te (khong co trong done) · ban do van xep Đang làm · ban do thieu chu thich "cửa veto mở"`, exit 1.

Đây là RED thật: vị từ chưa tồn tại, hai bộ đọc còn luật cũ.

- [ ] **Step 3: Thêm vị từ + hằng vào `scripts/product-map.mjs`**

Sửa dòng require ở đầu file để lấy thêm `vetoGateState`:

```js
const { frontmatterField, vetoGateState } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));
```

Thêm ngay sau `const fm = …` (dòng 94):

```js
// ─── Làn V — MỘT vị từ cho hai bộ đọc ───────────────────────────────────────
// Đợt 2 cho hồ sơ T2 xanh-sạch đi qua Cổng Phạm vi/Bằng chứng mà không chờ chữ
// ký: `veto_state: mo` + vết giờ, người veto lúc nào cũng được. Lưới
// trước-merge đã đọc đúng («làn V — cửa veto mở»); hai bộ đọc mặt người thì
// chưa, nên hồ sơ đã giao hiện thành «chờ ký»/«đang làm». Vị từ này TRỪ đúng
// suy diễn đó. KHÔNG có trạng thái «cửa đóng»: luật làn V nói cửa không hạn.
export const VETO_OPEN_NOTE = 'cửa veto mở';

export function lanVMo(contractTxt, verdict, signoff) {
  // Chữ ký THẮNG: người đã ký thì hồ sơ là «đã ký», không phải «cửa veto mở».
  // Nhánh này đứng trước mọi thứ khác — đặt sau là hồ sơ ký rồi vẫn khoe cửa mở.
  if (signoff) return false;
  // LAN-V-PASS: chỉ PASS. Viết thành `!== 'PENDING-JUDGMENT'` là REJECT/BLOCKED
  // lọt vào «đã giao» — mutant của răng ghim đúng dòng này.
  if (String(verdict || '').toUpperCase() !== 'PASS') return false;
  const v = vetoGateState(contractTxt);
  if (!v.present) return false;          // vắng khoá = luật cũ nguyên văn
  if (v.state !== 'mo') return false;    // da-veto: người đã phát ngôn, phải còn hiện
  if (!v.stamped) return false;          // V không vết là bỏ-cổng lặng, không phải V
  return v.tier === 'T2';                // làn V chỉ T2
}
```

- [ ] **Step 4: Thêm nhánh vào `classify`**

Trong `classify`, khối `if (status) { … }`, thay dòng `return { key: 'dang-dung', slug, name, edge };` bằng:

```js
    // LAN-V-MO: hồ sơ làn V đã giao — cửa veto vẫn mở, không phải «đang làm».
    if (status === 'verified' && lanVMo(cTxt, fm(eR.t, 'verdict'), fm(eR.t, 'human_signoff')))
      return { key: 'da-ship', slug, name, edge, note: VETO_OPEN_NOTE };
    return { key: 'dang-dung', slug, name, edge };
```

- [ ] **Step 5: Nối `scripts/start-scan.mjs`**

Thêm import tĩnh cạnh các import khác ở đầu file (sau dòng `import { fileURLToPath } …`):

```js
import { lanVMo } from './product-map.mjs';
```

Trong nhánh `else if (status === 'verified')`, chèn một dòng NGAY SAU nhánh `ev.signoff` và TRƯỚC nhánh `meaning.settled`:

```js
        else if (ev.signoff) done.push({ slug, state: 'signed-off' });
        // LAN-V-MO: cùng vị từ với bản đồ — hai bộ đọc không thể trôi khỏi nhau.
        else if (lanVMo(cTxt, ev.verdict, ev.signoff)) done.push({ slug, state: 'lan-v-mo' });
        else if (meaning.settled) gates.push({ slug, gate: 'bang-chung', since: since(cPath, frontmatterField(cTxt, 'approved_at')), tier });
```

- [ ] **Step 6: Chạy ca để thấy XANH**

Run: `node tests/plugins/lan-v.test.mjs`
Expected: `PASS: LV1 V-mo PASS T2 -> done lan-v-mo, khong gates (ca hai bo doc)`, exit 0.

- [ ] **Step 7: Đối chứng — không làm đỏ thứ đang xanh**

Run: `bash tests/plugins/run-tests.sh 2>&1 | tail -3 && node scripts/product-map.mjs --root . --check`
Expected: `Results: all plugin tests passed`; bản đồ sẽ báo **lệch** (`PRODUCT-MAP.md lệch với hồ sơ xưởng`) — đúng như mong đợi vì hai hồ sơ phát hành vừa đổi ô; vẽ lại ở Task 6, KHÔNG vẽ ở đây.

- [ ] **Step 8: Commit**

```bash
git add scripts/product-map.mjs scripts/start-scan.mjs tests/plugins/lan-v.test.mjs && git commit -m "feat(lan-v): vị từ lanVMo + nhánh đã-giao ở bản đồ và máy quét (LV1)"
```

**Verify command:** `node tests/plugins/lan-v.test.mjs`
**Evals phục vụ:** E1 (AC-1), E2 (AC-2)
**independent:** false

---

### Task 2: Năm ca cô lập lớp — LV2…LV6

**Files:**
- Modify: `tests/plugins/lan-v.test.mjs` (thêm trước dòng `process.exit`)

**Interfaces:**
- Consumes: `mkRepo`, `mkWorkspace`, `scan`, `mapOf`, `R_PLUS`, `pass`, `fail`, `want` từ Task 1.

- [ ] **Step 1: Viết năm ca**

Chèn trước `process.exit(failures ? 1 : 0);`:

```js
// Bốn ca dưới đây là ĐƯỜNG CŨ phải giữ nguyên. Chúng là chỗ vị từ viết rộng
// tay sẽ đỏ — không có chúng thì LV1 xanh không phân biệt được «bắt đúng» với
// «luôn luôn nói đã giao».
const luatCu = (id, name, over, msgs) => {
  if (!want(id)) return;
  const root = mkRepo();
  try {
    mkWorkspace(root, 'lv-cu', { ...R_PLUS, ...over });
    const s = scan(root), m = mapOf(root, 'lv-cu');
    const errs = [];
    if (s.done.has('lv-cu')) errs.push(`${msgs.scan}: may quet (state ${s.done.get('lv-cu')})`);
    if (!s.gates.has('lv-cu')) errs.push(`may quet: ky vong gates bang-chung, thuc te ${s.done.get('lv-cu') ?? '(khong o dau)'}`);
    if (m.section !== 'Đang làm') errs.push(`${msgs.map}: ban do (${m.section ?? 'khong thay slug'})`);
    if (m.note) errs.push('ban do van gan chu thich cua veto mo');
    if (errs.length) fail(id, errs.join(' · '));
    else pass(id, name);
  } finally { rmSync(root, { recursive: true, force: true }); }
};

luatCu('LV2', 'go veto_state -> luat cu nguyen van (gates bang-chung, Dang lam)',
  { veto: null, opened: null }, { scan: 'luat cu bi doi', map: 'luat cu bi doi' });

luatCu('LV3', 'da-veto -> KHONG da giao o ca hai bo doc',
  { veto: 'da-veto' }, { scan: 'da-veto bi xep da giao', map: 'da-veto bi xep da giao' });

if (want('LV4')) {
  // Hai biến thể của vết hỏng — V không vết là bỏ-cổng lặng, không phải V.
  const bienThe = [['rong', ''], ['khong-parse', 'hom-qua']];
  const errs = [];
  for (const [ten, val] of bienThe) {
    const root = mkRepo();
    try {
      mkWorkspace(root, 'lv-vet', { ...R_PLUS, opened: val });
      const s = scan(root), m = mapOf(root, 'lv-vet');
      if (s.done.has('lv-vet')) errs.push(`vet hong van da giao: ${ten} may-quet`);
      if (m.section !== 'Đang làm' || m.note) errs.push(`vet hong van da giao: ${ten} ban-do`);
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
  if (errs.length) fail('LV4', errs.join(' · '));
  else pass('LV4', 'vet gio rong/hong -> luat cu (hai bien the)');
}

luatCu('LV5', 'T3 -> luat cu (lan V chi T2)',
  { tier: 'T3' }, { scan: 'T3 bi xep da giao', map: 'T3 bi xep da giao' });

luatCu('LV6', 'PENDING-JUDGMENT duoi V -> van cho Cong Bang chung',
  { verdict: 'PENDING-JUDGMENT' }, { scan: 'judgment bi may giao thay', map: 'judgment bi may giao thay' });
```

- [ ] **Step 2: Chạy — cả năm phải XANH ngay**

Run: `LV_CASES=LV2,LV3,LV4,LV5,LV6 node tests/plugins/lan-v.test.mjs`
Expected: 5 dòng `PASS: LV2…LV6`, exit 0. Ca nào đỏ = vị từ ở Task 1 viết rộng tay → sửa vị từ, KHÔNG sửa ca.

- [ ] **Step 3: Tự phá thử một lần (chiều đỏ của chính bộ ca)**

Run:
```bash
cp scripts/product-map.mjs /tmp/pm.bak && sed -i '' "s/if (v.state !== 'mo') return false;/if (false) return false;/" scripts/product-map.mjs && LV_CASES=LV3 node tests/plugins/lan-v.test.mjs; cp /tmp/pm.bak scripts/product-map.mjs
```
Expected: `FAIL: LV3 da-veto bi xep da giao: may quet (state lan-v-mo) · …`, exit 1. Rồi file được phục hồi — chạy lại `LV_CASES=LV3 node tests/plugins/lan-v.test.mjs` phải PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/plugins/lan-v.test.mjs && git commit -m "test(lan-v): LV2-LV6 — năm ca cô lập lớp cho vị từ làn V"
```

**Verify command:** `LV_CASES=LV2,LV3,LV4,LV5,LV6 node tests/plugins/lan-v.test.mjs`
**Evals phục vụ:** E3 (AC-3), E4 (AC-4), E5 (AC-5), E6 (AC-6), E7 (AC-7)
**independent:** false

---

### Task 3: LV7 — bảng sự-thật 100 ô + 7 dòng `run` trong suite

**Files:**
- Modify: `tests/plugins/lan-v.test.mjs`
- Modify: `tests/plugins/run-tests.sh` (thêm 7 dòng `run` ở cuối, TRƯỚC khối `ONLY_BLOCK … no-op` gần cuối file)

- [ ] **Step 1: Viết LV7**

Chèn trước `process.exit(failures ? 1 : 0);`:

```js
if (want('LV7')) {
  // BẢNG SỰ-THẬT VIẾT TRƯỚC. Không phải phép so hai bộ đọc với nhau: hai bên
  // dùng CÙNG một vị từ nên quan hệ luôn khớp bất kể vị từ đúng hay sai
  // (gap-probe P0). Với từng ô, hàm kỳ vọng viết tay dưới đây nói TRƯỚC kết
  // quả của TỪNG bộ đọc; ca so giá trị thật với nó, rồi mới so quan hệ.
  const VETO = [
    ['vang', { veto: null, opened: null }],
    ['mo-vet-ok', { veto: 'mo', opened: '2026-08-21T09:00:00Z' }],
    ['mo-vet-hong', { veto: 'mo', opened: 'hom-qua' }],
    ['da-veto', { veto: 'da-veto', opened: '2026-08-21T09:00:00Z' }],
    ['la', { veto: 'nua-mo', opened: '2026-08-21T09:00:00Z' }],
  ];
  const VERDICT = [['PASS', 'PASS'], ['PENDING-JUDGMENT', 'PENDING-JUDGMENT'],
                   ['REJECT', 'REJECT'], ['BLOCKED', 'BLOCKED'], ['vang-evidence', null]];
  const HANG = ['T2', 'T3'];
  const KY = [['chua-ky', ''], ['da-ky', 'Manh 2026-08-21']];

  // Kỳ vọng viết tay — nguồn độc lập với vị từ đang kiểm.
  const kyVong = (veto, verdict, hang, ky) => {
    if (verdict === null) return { scan: 'broken', map: 'Hồ sơ hỏng', note: false };
    if (ky !== '') return { scan: 'signed-off', map: 'Đã giao', note: false };
    const daGiao = veto === 'mo-vet-ok' && verdict === 'PASS' && hang === 'T2';
    if (daGiao) return { scan: 'lan-v-mo', map: 'Đã giao', note: true };
    if (verdict === 'PASS' || verdict === 'PENDING-JUDGMENT')
      return { scan: 'gates', map: 'Đang làm', note: false };
    return { scan: 'broken', map: 'Hồ sơ hỏng', note: false };
  };

  const errs = [];
  let oDem = 0;
  for (const [bTen, bOver] of VETO)
    for (const [cTen, cVal] of VERDICT)
      for (const dVal of HANG)
        for (const [eTen, eVal] of KY) {
          oDem++;
          const root = mkRepo();
          try {
            mkWorkspace(root, 'lv-o', { status: 'verified', ...bOver, tier: dVal, verdict: cVal, signoff: eVal });
            const kv = kyVong(bTen, cVal, dVal, eVal);
            const s = scan(root), m = mapOf(root, 'lv-o');
            const toa = `(veto=${bTen}, verdict=${cTen}, hang=${dVal}, ky=${eTen})`;
            const thucTe = s.broken.has('lv-o') ? 'broken' : (s.gates.has('lv-o') ? 'gates' : (s.done.get('lv-o') ?? '(khong o dau)'));
            if (thucTe !== kv.scan) errs.push(`${toa} may-quet ky vong ${kv.scan} thuc te ${thucTe}`);
            const mSec = m.section ?? '(khong thay slug)';
            if (mSec !== kv.map) errs.push(`${toa} ban-do ky vong ${kv.map} thuc te ${mSec}`);
            if (m.note !== kv.note) errs.push(`${toa} ban-do chu thich ky vong ${kv.note} thuc te ${m.note}`);
          } finally { rmSync(root, { recursive: true, force: true }); }
        }
  if (oDem !== 100) errs.push(`so o dem duoc ${oDem} != 100 khai truoc`);
  if (errs.length) fail('LV7', `${errs.length} o lech — ${errs.slice(0, 5).join(' · ')}`);
  else pass('LV7', `bang su-that ${oDem} o: dung 1 o da giao, 99 o khong, hai bo doc khop`);
}
```

- [ ] **Step 2: Chạy LV7**

Run: `LV_CASES=LV7 node tests/plugins/lan-v.test.mjs`
Expected: `PASS: LV7 bang su-that 100 o: dung 1 o da giao, 99 o khong, hai bo doc khop`, exit 0.

Ô lệch → **đọc toạ độ trong thông điệp và sửa hàm kỳ vọng HOẶC vị từ, tuỳ bên nào sai**; nếu bảng sự-thật viết tay sai thì sửa nó (nó là giả định của người viết), nếu vị từ sai thì sửa `product-map.mjs`. Ghi vào sổ quyết định nếu phải đổi kỳ vọng.

- [ ] **Step 3: Thêm 7 dòng `run` vào suite**

Trong `tests/plugins/run-tests.sh`, thêm ngay TRƯỚC khối `# ONLY_BLOCK dat ma khong khoi nao khop`:

```bash
# ─── Hồ sơ lan-v-khong-phai-cho-ky: LV1..LV7 ────────────────────────────────
# Tên dòng `run` CỐ TÌNH không chứa chuỗi "PASS: LV<n>": chính file ca in bảy
# dòng đó, nên tên trùng khuôn là đếm đôi và E12 (đúng 7 dòng) đỏ.
for _lv in LV1 LV2 LV3 LV4 LV5 LV6 LV7; do
  run "ca lan V — $_lv (ho so lan-v-khong-phai-cho-ky)" \
    env LV_CASES="$_lv" node "$ROOT/tests/plugins/lan-v.test.mjs"
done
```

- [ ] **Step 4: Chạy trọn suite**

Run: `bash tests/plugins/run-tests.sh 2>&1 | tee /tmp/lv-suite.txt | tail -3; grep -c '^PASS: LV' /tmp/lv-suite.txt; grep -c 'FAIL: LV' /tmp/lv-suite.txt`
Expected: `Results: all plugin tests passed`; số dòng `^PASS: LV` = **7**; số dòng `FAIL: LV` = **0**.

- [ ] **Step 5: Commit**

```bash
git add tests/plugins/lan-v.test.mjs tests/plugins/run-tests.sh && git commit -m "test(lan-v): LV7 bảng sự-thật 100 ô + 7 dòng run trong suite plugins"
```

**Verify command:** `bash tests/plugins/run-tests.sh 2>&1 | tail -3`
**Evals phục vụ:** E8 (AC-8), E12 (AC-8)
**independent:** false

---

### Task 4: Răng hồ sơ — chân `cases` + chân `mutant`

**Files:**
- Create: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh`

**Interfaces:**
- Produces: `rang.sh --chan cases|mutant|mot-chu|ban-do`, exit 0 xanh / 1 đỏ, mỗi chân in một dòng kết luận.

- [ ] **Step 1: Viết răng — khung + chân `cases`**

```bash
#!/usr/bin/env bash
# Răng hồ sơ lan-v-khong-phai-cho-ky. Bốn chân, mỗi chân in chiều đỏ trong CÙNG
# lượt. KHÔNG chạy trọn suite (răng gọi thẳng file ca) và KHÔNG thêm khoá vào
# config.yaml — cmd khai bằng đường dẫn (nếp hạt giống «ba chỗ tích luỹ»).
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SELF="$ROOT/_acceptance/lan-v-khong-phai-cho-ky/rang.sh"
[ -f "$SELF" ] || { echo "RANG-LANV: ROOT suy sai — $SELF khong ton tai"; exit 1; }
CASES="$ROOT/tests/plugins/lan-v.test.mjs"
PM="$ROOT/scripts/product-map.mjs"
CHAN="${2:-}"; [ "${1:-}" = "--chan" ] || { echo "dung: $0 --chan cases|mutant|mot-chu|ban-do"; exit 2; }

loi=0
bad() { echo "  ĐỎ   $1"; loi=$((loi+1)); }

case "$CHAN" in
cases)
  out="$(LV_CASES= node "$CASES" 2>&1)"; st=$?
  for id in LV1 LV2 LV3 LV4 LV5 LV6 LV7; do
    printf '%s\n' "$out" | grep -q "^PASS: $id " || bad "thieu dong 'PASS: $id ...' trong stdout cua lan-v.test.mjs"
  done
  printf '%s\n' "$out" | grep -q '^FAIL: LV' && bad "co dong FAIL: LV — $(printf '%s\n' "$out" | grep '^FAIL: LV' | head -1)"
  [ "$st" -eq 0 ] || bad "lan-v.test.mjs exit $st (ky vong 0)"
  [ "$loi" -eq 0 ] && echo "CASES OK: 7 ca LV xanh tren cay that" || echo "CASES: $loi ĐỎ"
  ;;
esac
exit $([ "$loi" -eq 0 ] && echo 0 || echo 1)
```

- [ ] **Step 2: Chạy chân `cases`**

Run: `bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases`
Expected: `CASES OK: 7 ca LV xanh tren cay that`, exit 0.

- [ ] **Step 3: Thêm chân `mutant`**

Chèn nhánh `mutant)` vào `case` (trước `esac`):

```bash
mutant)
  # Mutant đi qua CHÍNH ca kiểm. Đối chứng dương chạy trên CÙNG CÁCH CHÉP:
  # bản A không tiêm phải XANH trước khi tin bản B đỏ — nếu không, «bản sao
  # thiếu thứ gì đó» cũng cho màu đỏ và răng báo OK trong khi vị từ chưa chạy.
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  for b in A B; do
    rsync -a --exclude .git --exclude node_modules --exclude .claude "$ROOT/" "$TMP/$b/" \
      || { echo "RANG-LANV: rsync that bai"; exit 1; }
  done
  # (a) Đối chứng dương — bản A nguyên vẹn phải chạy được VÀ xanh.
  outA="$(LV_CASES=LV1,LV7 node "$TMP/A/tests/plugins/lan-v.test.mjs" 2>&1)"; stA=$?
  if [ "$stA" -ne 0 ] || ! printf '%s\n' "$outA" | grep -q '^PASS: LV1 '; then
    bad "ban sao nguyen ven khong chay duoc (exit $stA) — moi ket luan ve ban tiem deu vo nghia"
    echo "MUTANT: $loi ĐỎ"; exit 1
  fi
  # (b) Đột biến 1 — gỡ nhánh V trong bản đồ (marker LAN-V-MO).
  n1="$(grep -c 'LAN-V-MO' "$TMP/B/scripts/product-map.mjs")"
  [ "$n1" -ge 1 ] || bad "marker LAN-V-MO khong thay — mutant khong ghim duoc vao dau"
  perl -0pi -e "s/if \(status === 'verified' && lanVMo\(/if (false && lanVMo(/" "$TMP/B/scripts/product-map.mjs"
  grep -q "if (false && lanVMo(" "$TMP/B/scripts/product-map.mjs" || bad "dot bien 1 khong doi duoc dong nao"
  out1="$(LV_CASES=LV1 node "$TMP/B/tests/plugins/lan-v.test.mjs" 2>&1)"
  printf '%s\n' "$out1" | grep -q '^FAIL: LV1 ' || bad "dot bien 1: LV1 khong do"
  printf '%s\n' "$out1" | grep -qE 'van nam trong gates|ban do van xep' \
    || bad "dot bien 1: LV1 do nhung khong ghim dung cau (nhan duoc: $(printf '%s\n' "$out1" | head -1))"
  # (c) Đột biến 2 — gỡ điều kiện PASS trong vị từ (marker LAN-V-PASS).
  rsync -a --exclude .git --exclude node_modules --exclude .claude "$ROOT/scripts/product-map.mjs" "$TMP/B/scripts/product-map.mjs"
  n2="$(grep -c 'LAN-V-PASS' "$TMP/B/scripts/product-map.mjs")"
  [ "$n2" -ge 1 ] || bad "marker LAN-V-PASS khong thay"
  perl -0pi -e "s/if \(String\(verdict \|\| ''\)\.toUpperCase\(\) !== 'PASS'\) return false;/if (String(verdict || '').toUpperCase() === 'PENDING-JUDGMENT') return false;/" "$TMP/B/scripts/product-map.mjs"
  grep -q "=== 'PENDING-JUDGMENT'" "$TMP/B/scripts/product-map.mjs" || bad "dot bien 2 khong doi duoc dong nao"
  out2="$(LV_CASES=LV7 node "$TMP/B/tests/plugins/lan-v.test.mjs" 2>&1)"
  printf '%s\n' "$out2" | grep -q '^FAIL: LV7 ' || bad "dot bien 2: LV7 khong do (bang su-that khong bat duoc noi long dieu kien PASS)"
  printf '%s\n' "$out2" | grep -q 'verdict=REJECT' \
    || bad "dot bien 2: LV7 do nhung khong ghim toa do o REJECT"
  [ "$loi" -eq 0 ] && echo "MUTANT OK: 2 dot bien chay that, moi cai ghim dung cau; doi chung duong ban sao nguyen ven xanh" || echo "MUTANT: $loi ĐỎ"
  ;;
```

- [ ] **Step 4: Chạy chân `mutant`**

Run: `bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan mutant`
Expected: `MUTANT OK: 2 dot bien chay that, moi cai ghim dung cau; doi chung duong ban sao nguyen ven xanh`, exit 0.

Nếu «dot bien 2: LV7 khong do» → bảng sự-thật LV7 chưa ghim ô REJECT/BLOCKED dưới V; đó là lỗ thật của LV7, quay lại Task 3 sửa **ca**, không nới răng.

- [ ] **Step 5: Commit**

```bash
chmod +x _acceptance/lan-v-khong-phai-cho-ky/rang.sh && git add _acceptance/lan-v-khong-phai-cho-ky/rang.sh && git commit -m "test(lan-v): răng hồ sơ chân cases + chân mutant (đối chứng dương cùng cách chép)"
```

**Verify command:** `bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan cases && bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan mutant`
**Evals phục vụ:** E1–E8 (chân `cases`), E11 (chân `mutant`)
**independent:** false

---

### Task 5: Một chữ ba nơi — chân `mot-chu` + `commands/start.md`

**Files:**
- Modify: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh`
- Modify: `commands/start.md`

- [ ] **Step 1: Sửa thân lệnh `/start`**

Trong `commands/start.md`, thay dòng cuối của khối ba nhóm:

```
   - `groups.done` chỉ đếm gộp một dòng cuối thẻ (đã xong/đã xếp lại: N việc).
```

bằng:

```
   - `groups.done` chỉ đếm gộp một dòng cuối thẻ (đã xong/đã xếp lại: N việc).
     Phần tử có `state: lan-v-mo` là hồ sơ đi **làn V** — đã giao, cửa veto mở
     (người veto lúc nào cũng được, cửa không có hạn) — nên nó KHÔNG phải một
     cổng và KHÔNG được liệt vào nhóm chờ chữ ký; có phần tử như vậy thì dòng
     đếm gộp nói thêm «trong đó N làn V, cửa veto mở», không thêm dòng riêng
     và không hỏi thêm câu nào.
```

- [ ] **Step 2: Viết chân `mot-chu` (RED trước — chạy khi start.md chưa sửa cũng phải đỏ)**

Chèn nhánh `mot-chu)` vào `case`:

```bash
mot-chu)
  # Chuỗi nhãn khai MỘT lần ở product-map.mjs; hai nơi còn lại phải chứa đúng
  # nó. Răng KHÔNG chép chuỗi vào mình — nó import hằng thật.
  NOTE="$(node --input-type=module -e "
    const m = await import('file://$PM');
    process.stdout.write(m.VETO_OPEN_NOTE);
  ")" || { echo "RANG-LANV: khong import duoc VETO_OPEN_NOTE"; exit 1; }
  [ -n "$NOTE" ] || bad "VETO_OPEN_NOTE rong"
  check_site() { grep -qF "$NOTE" "$1" || bad "lech: ${1#$ROOT/}"; }
  check_site "$ROOT/scripts/pre-merge-check.sh"
  check_site "$ROOT/commands/start.md"
  # Chiều đỏ cùng lượt: bản sao đổi một chữ ở TỪNG site → phải đỏ ĐÚNG site đó.
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  for site in scripts/pre-merge-check.sh commands/start.md; do
    mkdir -p "$TMP/$(dirname "$site")"
    sed "s/$NOTE/cua veto MO/g" "$ROOT/$site" > "$TMP/$site"
    if grep -qF "$NOTE" "$TMP/$site"; then bad "chieu do: khong doi duoc chu nao trong ban sao $site"; fi
  done
  [ "$loi" -eq 0 ] && echo "MOT-CHU OK: \"$NOTE\" == pre-merge-check.sh == commands/start.md" || echo "MOT-CHU: $loi ĐỎ"
  ;;
```

- [ ] **Step 3: Kiểm chiều đỏ bằng tay một lần**

Run:
```bash
cp commands/start.md /tmp/start.bak && sed -i '' 's/cửa veto mở/cửa veto đang mở/' commands/start.md && bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan mot-chu; cp /tmp/start.bak commands/start.md
```
Expected: `  ĐỎ   lech: commands/start.md` + `MOT-CHU: 1 ĐỎ`, exit 1. Sau khi phục hồi, chạy lại phải OK.

- [ ] **Step 4: Chạy chân `mot-chu`**

Run: `bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan mot-chu`
Expected: `MOT-CHU OK: "cửa veto mở" == pre-merge-check.sh == commands/start.md`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add _acceptance/lan-v-khong-phai-cho-ky/rang.sh commands/start.md && git commit -m "feat(lan-v): thân lệnh /start biết trạng thái lan-v-mo + răng so một chữ ba nơi"
```

**Verify command:** `bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan mot-chu`
**Evals phục vụ:** E9 (AC-9)
**independent:** false

---

### Task 6: Cây thật — chân `ban-do` + vẽ lại `PRODUCT-MAP.md`

**Files:**
- Modify: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh`
- Modify: `PRODUCT-MAP.md` (máy sinh — `node scripts/product-map.mjs --root .`)

- [ ] **Step 1: Vẽ lại bản đồ trong CÙNG lượt**

Run: `node scripts/product-map.mjs --root . && node scripts/product-map.mjs --root . --check`
Expected: `PRODUCT-MAP.md khớp hồ sơ xưởng.` — và `git diff PRODUCT-MAP.md` cho thấy `release-2-0-0`, `release-2-1-0` chuyển từ «Đang làm» sang «Đã giao» kèm ` — cửa veto mở`; ô «Đang làm» trong hình giảm 2, ô «Đã giao» tăng 2.

- [ ] **Step 2: Viết chân `ban-do`**

Chèn nhánh `ban-do)` vào `case`:

```bash
ban-do)
  node "$PM" --root "$ROOT" --check >/dev/null 2>&1 || bad "product-map --check do tren cay that (ban do chua ve lai?)"
  MAP="$ROOT/PRODUCT-MAP.md"
  sec_of() {  # in tên mục chứa slug
    awk -v s="\`$1\`" '/^## /{sec=substr($0,4)} /^- /{ if (index($0,s)) { print sec; exit } }' "$MAP"
  }
  line_of() { grep -m1 -F "\`$1\`" "$MAP"; }
  for slug in release-2-0-0 release-2-1-0; do
    [ "$(sec_of "$slug")" = "Đã giao" ] || bad "$slug khong nam duoi 'Đã giao' (thuc te: $(sec_of "$slug"))"
    line_of "$slug" | grep -qF 'cửa veto mở' || bad "$slug thieu chu thich cua veto mo"
  done
  # Hồ sơ ĐÃ KÝ thật phải giữ nguyên: đã giao, KHÔNG chú thích cửa mở.
  [ "$(sec_of release-2-2-0)" = "Đã giao" ] || bad "release-2-2-0 (da ky) khong con duoi 'Đã giao'"
  line_of release-2-2-0 | grep -qF 'cửa veto mở' && bad "release-2-2-0 da ky ma van gan chu thich cua veto mo"
  # Máy quét thật
  SCAN="$(node "$ROOT/scripts/start-scan.mjs" --root "$ROOT")"
  node --input-type=module -e "
    const j = JSON.parse(process.argv[1]);
    const gates = new Set(j.groups.gates.map(g => g.slug));
    const done = new Map(j.groups.done.map(d => [d.slug, d.state]));
    const err = [];
    for (const s of ['release-2-0-0','release-2-1-0']) {
      if (gates.has(s)) err.push(s + ' van trong gates');
      if (done.get(s) !== 'lan-v-mo') err.push(s + ' state ' + (done.get(s) ?? '(khong co)') + ' != lan-v-mo');
    }
    if (done.get('release-2-2-0') !== 'signed-off') err.push('release-2-2-0 mat trang thai signed-off');
    if (err.length) { console.error(err.join(' · ')); process.exit(1); }
  " "$SCAN" 2>/tmp/lv-scan.err || bad "may quet that: $(cat /tmp/lv-scan.err)"
  grep -qF 'lan-v-mo' "$ROOT/commands/start.md" || bad "commands/start.md khong neu trang thai lan-v-mo"
  grep -qF 'làn V' "$ROOT/commands/start.md" || bad "commands/start.md khong neu 'làn V'"
  # Chiều đỏ cùng lượt: --check phải có răng.
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  rsync -a --exclude .git --exclude node_modules --exclude .claude "$ROOT/" "$TMP/c/"
  printf '\n- rac chen tay\n' >> "$TMP/c/PRODUCT-MAP.md"
  node "$PM" --root "$TMP/c" --check >/dev/null 2>&1 && bad "chieu do: --check van exit 0 tren ban sao co rac"
  [ "$loi" -eq 0 ] && echo "BAN-DO OK: 2 ho so lan V da giao · 1 ho so da ky giu signed-off · check exit 0 · /start biet lan-v-mo" || echo "BAN-DO: $loi ĐỎ"
  ;;
```

- [ ] **Step 3: Chạy cả bốn chân**

Run:
```bash
for c in cases mutant mot-chu ban-do; do bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan $c || echo "CHAN $c ĐỎ"; done
```
Expected: bốn dòng `… OK`, không dòng `ĐỎ` nào.

- [ ] **Step 4: Bốn suite + bản đồ (cổng đầy đủ)**

Run:
```bash
for t in scripts hooks plugins workflows; do bash tests/$t/run-tests.sh >/dev/null 2>&1 || echo "SUITE $t ĐỎ"; done; node scripts/product-map.mjs --root . --check
```
Expected: không dòng `SUITE … ĐỎ`; `PRODUCT-MAP.md khớp hồ sơ xưởng.`

- [ ] **Step 5: Commit**

```bash
git add _acceptance/lan-v-khong-phai-cho-ky/rang.sh PRODUCT-MAP.md && git commit -m "feat(lan-v): bản đồ vẽ lại (hai bản phát hành sang Đã giao) + răng chân ban-do trên cây thật"
```

**Verify command:** `bash _acceptance/lan-v-khong-phai-cho-ky/rang.sh --chan ban-do`
**Evals phục vụ:** E10 (AC-10)
**independent:** false

---

## Self-Review

**Spec coverage:** AC-1/AC-2 → Task 1 (E1, E2) · AC-3…AC-7 → Task 2 (E3–E7) · AC-8 → Task 3 (E8, E12) · AC-9 → Task 5 (E9) · AC-10 → Task 6 (E10) · chiều đỏ của vị từ → Task 4 (E11). Không AC nào thiếu task; không task nào không phục vụ eval nào.

**Placeholder scan:** không có "TBD"/"tương tự Task N"/"xử lý lỗi phù hợp" — mọi bước có mã thật và lệnh chạy thật kèm kết quả mong đợi.

**Type consistency:** `lanVMo(contractTxt, verdict, signoff)` khai ở Task 1 và dùng đúng ba tham số đó ở `classify` (Task 1 Step 4) và `start-scan` (Task 1 Step 5); `VETO_OPEN_NOTE` import ở ca kiểm (Task 1) và ở răng (Task 5) — không nơi nào gõ lại chuỗi. Trạng thái `lan-v-mo` viết y hệt ở `start-scan`, LV1, LV7, chân `ban-do` và `commands/start.md`.

**Rủi ro đã lường:** (1) tên dòng `run` trùng khuôn `PASS: LV<n>` → E12 đếm đôi — chốt ở Global Constraints và Task 3 Step 3; (2) hàm kỳ vọng của LV7 có thể sai ở ô `verdict` lạ/vắng-evidence — Task 3 Step 2 nói rõ sửa bên nào và ghi sổ; (3) `perl -0pi` của mutant bám vào chuỗi mã cụ thể — mỗi đột biến đều tự kiểm «có đổi được dòng nào không», đổi mã ở Task 1 mà quên sửa mutant thì răng đỏ ngay chứ không xanh giả.
