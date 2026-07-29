# findings-section-boundary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Luật ranh giới section PER-SECTION đặt một chỗ có marker (`lib/md-section.js`); `gate-card` + `evidence-page` hết bản sao; `claim-scan` ghim bằng round-trip xuyên package.

**Architecture:** `lib/md-section.js` export `section(text, heading, opts)` + bảng `SECTION_BOUNDARY` bọc marker `<<<SECTION-BOUNDARY-TABLE … SECTION-BOUNDARY-TABLE>>>`. Luật tra theo TÊN section, không truyền cờ tại call-site. Hai script `require('../lib/md-section.js')`. Test mới ở `tests/scripts/*.test.mjs` (case FSB1-FSB6, FSB8) + `tests/workflows/` (FSB7 round-trip, vá PH8).

**Tech Stack:** Node CommonJS cho `lib/` + `scripts/` (khớp `lib/gap-probe.js` hiện có); test ESM `.test.mjs`; suite bash sẵn có.

## Global Constraints

- **T3** — chạm `lib/**`; sửa nguồn xong PHẢI `bash scripts/sync-plugin-packages.sh` + commit mirror cùng lượt.
- **git add đích danh từng path** — CẤM `-A`/`-am` (known-limit đã ghi).
- Mọi assertion âm tính: đối chứng dương cùng harness + ghim **thông điệp nguyên văn** (2 P0 của gap-probe).
- Thông điệp lỗi ghim trong test (đừng đổi lời): `KHONG rut duoc bang SECTION-BOUNDARY-TABLE` · `van con dinh nghia section() rieng` · `round-trip lech: <n> vs <m> hang`.
- Hai bất biến hồi quy load-bearing: thẻ **không cắt cụt AC** (`Criteria` giữ sub-heading là content) · **không hàng ma** (`Findings` dừng mọi heading).

## File map

- Create: `lib/md-section.js` — bảng luật + `section()` (1 trách nhiệm).
- Create: `tests/scripts/md-section.test.mjs` — FSB1..FSB6, FSB8.
- Modify: `scripts/gate-card.js` (xoá `function section(`, require lib) · `scripts/evidence-page.js` (như trên).
- Modify: `tests/workflows/claim-scan.test.mjs` — FSB7 round-trip + vá PH8 control.
- Modify: `tests/plugins/run-tests.sh` — case smoke mirror (E14) + re-pin literal `1.24.0` → `1.25.0`.
- Modify: `.claude-plugin/plugin.json`, `codex/acceptance-gate/.codex-plugin/plugin.json` (1.25.0) + mirror qua sync.

---

### Task 1: `lib/md-section.js` — bảng marker + section() (E5) · independent: false

**Interfaces — Produces:** `module.exports = { SECTION_BOUNDARY, BOUNDARY_TABLE_RE, section }`; `section(text, heading)` trả `string[]` các dòng thuộc section, luật tra từ `SECTION_BOUNDARY[heading] ?? 'same-or-higher'`.

- [ ] **Step 1: Viết test FSB5 (fail trước)** — `tests/scripts/md-section.test.mjs`:

```js
// Luật ranh giới section — bảng marker phải là thứ code THẬT SỰ đọc.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const LIB = path.join(ROOT, 'lib', 'md-section.js');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

// Rút bảng luật TỪ MARKER (khuôn P55: writer→reader, không chép tay)
function boundaryTable(libText) {
  const m = libText.match(/<<<SECTION-BOUNDARY-TABLE\n([\s\S]*?)SECTION-BOUNDARY-TABLE>>>/);
  if (!m) throw new Error('KHONG rut duoc bang SECTION-BOUNDARY-TABLE');
  const out = {};
  for (const l of m[1].split('\n')) {
    const mm = l.match(/^\s*\*?\s*([A-Za-z ]+?)\s*(?:->|→)\s*(any-heading|same-or-higher)\s*$/);
    if (mm) out[mm[1].trim()] = mm[2];
  }
  return out;
}

// ---- FSB5: bảng rút được + đủ khoá; đột biến xoá marker → thông điệp nguyên văn
{
  const libText = readFileSync(LIB, 'utf8');
  check('FSB5 bảng rút được từ marker, khai đủ Findings + default', () => {
    const t = boundaryTable(libText);
    assert.equal(t['Findings'], 'any-heading');
    assert.equal(t['default'], 'same-or-higher');
  });
  check('FSB5 đối chứng đột biến: xoá marker → đúng thông điệp KHONG rut duoc bang', () => {
    const mutated = libText.replace(/<<<SECTION-BOUNDARY-TABLE/, 'XXX');
    assert.throws(() => boundaryTable(mutated), /KHONG rut duoc bang SECTION-BOUNDARY-TABLE/);
  });
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Chạy → FAIL** (`lib/md-section.js` chưa tồn tại): `node tests/scripts/md-section.test.mjs`.
- [ ] **Step 3: Tạo `lib/md-section.js`:**

```js
'use strict';
// Ranh giới section markdown — luật PER-SECTION, khai MỘT chỗ dưới đây.
// Vì sao không một-luật-duy-nhất: section BẢNG (Findings) mà giữ sub-heading
// làm content thì bảng ở `### Notes` lọt vào → finding/claim ma có id citable;
// section VĂN XUÔI (Criteria) mà dừng ở mọi heading thì mọi AC sau `### nhóm
// phụ` rơi khỏi thẻ → human duyệt trên thẻ cụt (false-green). Hai lỗi đều đã
// xảy ra thật. Bảng dưới là nguồn duy nhất; test rút nó bằng marker.
//
// <<<SECTION-BOUNDARY-TABLE
//   Findings -> any-heading
//   default -> same-or-higher
// SECTION-BOUNDARY-TABLE>>>
const SECTION_BOUNDARY = { Findings: 'any-heading', default: 'same-or-higher' };

function boundaryFor(heading) {
  return SECTION_BOUNDARY[heading] || SECTION_BOUNDARY.default;
}

// Trả các dòng nằm dưới heading `## <h>` (hoặc sâu hơn) theo luật của section đó.
function section(t, h) {
  const rule = boundaryFor(h);
  const out = [];
  let inS = false, lvl = 0;
  const re = new RegExp('^#{2,6}\\s+' + h + '\\b', 'i');
  for (const l of String(t).split('\n')) {
    const m = l.match(/^(#{1,6})\s/);
    if (m) {
      if (re.test(l)) { inS = true; lvl = m[1].length; continue; }
      if (inS && (rule === 'any-heading' || m[1].length <= lvl)) { inS = false; continue; }
    }
    if (inS) out.push(l);
  }
  return out;
}

module.exports = { SECTION_BOUNDARY, boundaryFor, section };
```

- [ ] **Step 4: Chạy → PASS** (2 case). **Step 5: Commit** `git add lib/md-section.js tests/scripts/md-section.test.mjs && git commit -m "feat(md-section): bảng luật ranh giới per-section có marker (E5)"`.

---

### Task 2: 2 script dùng lib, xoá bản sao (E1, E2, E3, E4, E6) · independent: false

- [ ] **Step 1: Thêm FSB1/2/3/4/6 vào `tests/scripts/md-section.test.mjs`** (fixture code-sinh; chạy script THẬT bằng `spawnSync('node', [gateCard, '--root', tmp, '--slug', s, '--extract'])`):
  - FSB1: gap-probe `## Findings` 1 hàng + `### Notes` bảng 6 cột + `# Appendix` bảng → `gap_probe.rows.length === 1`; **đối chứng dương**: fixture cắt đuôi cho `rows` GIỐNG HỆT (deep-equal).
  - FSB2: cùng fixture với `verdict: clean` → output KHÔNG chứa chuỗi `verdict clean nhưng bảng có finding`; **đối chứng dương**: clean + hàng thật trong Findings → CÓ chuỗi đó.
  - FSB3: contract 5 AC có `### nhóm phụ` trước AC-3 → `will_do.length + wont_do.length === 5`.
  - FSB4: chạy `evidence-page.js` trên cùng contract + report tối thiểu → HTML chứa đủ 5 mã AC.
  - FSB6: `readFileSync` 2 script — `assert.doesNotMatch(text, /function section\(/)` và `assert.match(text, /require\(.*md-section/)`; assert evidence-page KHÔNG có `section(report, 'Findings')`; **đột biến**: bản sao tmp bị chèn lại `function section(` → helper phát hiện ném đúng `van con dinh nghia section() rieng`; **đối chứng dương**: bản sao nguyên vẹn KHÔNG ném.
- [ ] **Step 2: Chạy → FSB1/FSB2 đỏ** (luật hiện tại nuốt bảng đuôi), FSB6 đỏ (còn định nghĩa riêng).
- [ ] **Step 3: Sửa `scripts/gate-card.js`** — xoá dòng `function section(...)` + comment cũ, thêm `const { section } = require('../lib/md-section.js');` cạnh các require lib hiện có. **Không** đổi call-site nào.
- [ ] **Step 4: Sửa `scripts/evidence-page.js`** — xoá `function section(...)`, thêm `const { section } = require(path.join(__dirname, '..', 'lib', 'md-section.js'));`.
- [ ] **Step 5: Chạy → tất cả PASS**; chạy thêm `bash tests/scripts/run-tests.sh` (suite cũ phải xanh). **Step 6: Commit** `git add scripts/gate-card.js scripts/evidence-page.js tests/scripts/md-section.test.mjs && git commit -m "fix(gate-card,evidence-page): dùng luật ranh giới từ lib, xoá bản sao section() (E1-E4, E6)"`.

---

### Task 3: FSB8 — bảng điều-khiển-hành-vi (E12) · independent: false

- [ ] **Step 1: Thêm FSB8**: `cpSync` cây tối thiểu (`lib/`, `scripts/gate-card.js`) vào tmp; đột biến ĐÚNG Ô BẢNG trong bản sao: `Findings -> any-heading` → `same-or-higher` **và** dòng `const SECTION_BOUNDARY = {...}` phải được sinh TỪ bảng (xem Step 2) nên chỉ cần sửa một chỗ; chạy gate-card từ bản sao trên fixture FSB1 → `rows.length === 1 + <số hàng bảng đuôi>`; **đối chứng dương**: bản sao nguyên vẹn → `rows.length === 1`.
- [ ] **Step 2: Nối bảng ↔ hành vi trong `lib/md-section.js`** — thay hằng số chép tay bằng parse từ chính khối marker (self-read):

```js
const fs = require('fs');
const TABLE_RE = /<<<SECTION-BOUNDARY-TABLE\n([\s\S]*?)SECTION-BOUNDARY-TABLE>>>/;
function parseTable(src) {
  const m = TABLE_RE.exec(src);
  if (!m) throw new Error('KHONG rut duoc bang SECTION-BOUNDARY-TABLE');
  const out = {};
  for (const l of m[1].split('\n')) {
    const mm = l.match(/^\s*\/\/\s*([A-Za-z ]+?)\s*->\s*(any-heading|same-or-higher)\s*$/);
    if (mm) out[mm[1].trim()] = mm[2];
  }
  return out;
}
const SECTION_BOUNDARY = parseTable(fs.readFileSync(__filename, 'utf8'));
```

- [ ] **Step 3: Chạy → PASS** cả FSB8 lẫn FSB5/FSB1 (bảng giờ là nguồn thật). **Step 4: Commit** `git add lib/md-section.js tests/scripts/md-section.test.mjs && git commit -m "feat(md-section): bảng marker là nguồn RUNTIME của luật, không phải comment (E12)"`.

---

### Task 4: Round-trip xuyên package + vá PH8 (E7, E9) · independent: false

- [ ] **Step 1: Thêm FSB7 vào `tests/workflows/claim-scan.test.mjs`**: fixture gap-probe code-sinh (Findings 2 hàng + `### Notes` bảng); (a) chạy `claim-scan --json` đếm id `#F`; (b) rút bảng từ `lib/md-section.js` bằng marker, áp luật `Findings` lên cùng text, đếm hàng; assert bằng nhau, lệch → ném `round-trip lech: <n> vs <m> hang`; **đối chứng dương**: bản nguyên vẹn khớp cả số hàng lẫn thứ tự.
- [ ] **Step 2: Vá PH8 control (E9)** — thay control vacuous bằng:

```js
const OLD_DESC = 'Feature loop for AI-coded features. v1.17 adds S4 scope-triage.'; // văn bản tiền-1.18, code-sinh
check('PH8 control ÂM: regex trượt trên description tiền-1.18', () => assert.doesNotMatch(OLD_DESC, /v1\.18 adds/));
check('PH8 control DƯƠNG: regex trúng description hiện hành đọc từ file thật', () => assert.match(fl.description, /v1\.18 adds/));
```

- [ ] **Step 3: Chạy** `bash tests/workflows/run-tests.sh` → xanh. **Step 4: Commit** `git add tests/workflows/claim-scan.test.mjs && git commit -m "test: round-trip ranh giới xuyên package + PH8 control thật (E7, E9)"`.

---

### Task 5: Đóng gói — bump 1.25.0, sync, smoke mirror, suite hooks (E8, E11, E13, E14) · independent: false

- [ ] **Step 1: Thêm case smoke mirror (E14) vào `tests/plugins/run-tests.sh`**: fixture code-sinh trong tmp → `node "$ROOT/plugins/acceptance-gate/scripts/gate-card.js" --root <tmp> --slug <s> --extract` → exit 0 **và** số AC trong JSON == số AC fixture (khẳng định dương).
- [ ] **Step 2: Bump** `.claude-plugin/plugin.json` + `codex/acceptance-gate/.codex-plugin/plugin.json` → `1.25.0`, thêm câu `v1.25 adds single-sourced per-section markdown boundary (lib/md-section.js).` vào description; re-pin literal `"1.24.0"` → `"1.25.0"` trong `tests/plugins/run-tests.sh`.
- [ ] **Step 3:** `bash scripts/sync-plugin-packages.sh` → kiểm `ls plugins/acceptance-gate/lib/md-section.js`.
- [ ] **Step 4: Verify đủ 4 suite** — `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh` + `bash scripts/sync-plugin-packages.sh --check`.
- [ ] **Step 5: Commit** `git add .claude-plugin/plugin.json codex/acceptance-gate/.codex-plugin/plugin.json tests/plugins/run-tests.sh plugins/ && git commit -m "chore(acceptance-gate): 1.25.0 + smoke mirror gate-card + sync (E8, E11, E13, E14)"`.

## Self-review

AC↔task: AC-5(T1) · AC-1/2/3/4/6(T2) · AC-12(T3) · AC-7/9(T4) · AC-8/11(T5) · AC-10 judgment (S4 chấm trên code+design). Không placeholder; thông điệp lỗi thống nhất Global Constraints; `section()` giữ nguyên chữ ký nên call-site không đổi.
