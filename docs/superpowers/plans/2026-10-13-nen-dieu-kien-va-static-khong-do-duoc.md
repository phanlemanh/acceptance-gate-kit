# nen-dieu-kien-va-static-khong-do-duoc — kế hoạch thực thi

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (thực thi tại chỗ — hồ sơ T2,
> feature-loop đi thẳng S3). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hai thước kit thôi nói sai trên kho tiêu thụ — chân engine bỏ qua tệp có điều kiện khi kho không
khai ổ cắm; `design-gate --mode static` gọi tên «không đo được» trên tệp không phải HTML — không đổi mã thoát.

**Architecture:** Điều kiện là thẻ `[only-if-declared: <khoá>]` cuối dòng trong khối INIT-CI-COPY-LIST
(một nguồn); `duong-nen.mjs` rút thẻ cùng lượt rút danh sách. `design-gate.mjs` phân loại đuôi SAU bộ dò,
chỉ ở static, chỉ đổi chữ verdict + thêm khoá JSON + một dòng stderr.

**Tech Stack:** Node ≥ 20, ESM; test là script `node tests/scripts/*.test.mjs` in `PASS: <id> …`.

**Spec:** `docs/superpowers/specs/2026-10-13-nen-dieu-kien-va-static-khong-do-duoc-design.md` · hợp đồng
`_acceptance/nen-dieu-kien-va-static-khong-do-duoc/contract.md`.

## Global Constraints

- Mã thoát của `design-gate.mjs` KHÔNG đổi ở bất kỳ đích nào (AC-6).
- `--mode dom` giữ nguyên hành vi (sổ d-…-9).
- «Kho khai `<khoá>`» = dòng cột 0 `^<khoá>:` trong `_acceptance/config.yaml` (sổ d-…-8).
- Ca đo tự sinh fixture trong lượt, đường suy từ vị trí tệp test; bản gốc so sánh = `git archive 0c1fd9ff scripts lib vendor`.
- Không chạm `scripts/gate-card.js`, `khong-can-nguoi.mjs`, khoá cài đặt (vùng MacBook Pro), không chạm `lib/**`.

## Review Focus

1. Kho khai ổ cắm và chép đủ tệp → engine phải xanh (ô dương NEN-DK2).
2. Tệp đích design-gate vắng → vẫn chết mã 1, không thành xanh (ô tsx-vang + đột biến c).
3. Đích HTML viết hoa đuôi `.HTML` → vẫn đo như HTML (ô html-hoa).
4. Bên đọc khác của khối danh sách chép rút đường dẫn có dính thẻ không (CE1, CE2g, NEN7 — E10/E9).
5. Một mục không thẻ nạp tĩnh tệp mang thẻ → CI kho không khai chết dù đường nền xanh (NEN-DK6).

Mỗi dòng đã có ca ở task sở hữu (Task 1, Task 2).

---

### Task 1: Chân engine đọc thẻ điều kiện

**Files:**
- Modify: `commands/acceptance-init.md` (khối INIT-CI-COPY-LIST: 10 dòng mang thẻ + một đoạn giải thích trước marker)
- Modify: `feature-loop/scripts/duong-nen.mjs` (sau `TEP_ENGINE`: `DIEU_KIEN`, `khoKhai`; vòng băm: `boVendored`)
- Modify: `skills/acceptance/references/duong-nen-template.md` (hàng `engine` của bảng bốn chân)
- Modify: `tests/scripts/duong-nen-fixture.mjs` (tuỳ chọn `bo`)
- Test: `tests/scripts/duong-nen.test.mjs` (NEN-DK1…NEN-DK6)

**Interfaces:**
- Produces: thẻ `[only-if-declared: tin_hieu|lo_trinh]`; dòng stderr `engine: bo-qua <tệp> — tệp có điều kiện, kho không khai <khoá>`; `dungKho({ bo: [<đường tương đối>] })`.
- Phục vụ: E1–E5, E9, E10 · `independent: false` (Task 2 độc lập về mã nhưng dùng chung lượt S4).

- [ ] **Step 1:** Thêm ca NEN-DK1…DK6 + tuỳ chọn `bo` của fixture (nguyên văn từ nguyên mẫu scratchpad đã chạy hai chiều 13/10).
- [ ] **Step 2:** Chạy `node tests/scripts/duong-nen.test.mjs` trên `duong-nen.mjs` CHƯA sửa — kỳ vọng FAIL NEN-DK1, DK2 (×2), DK4, DK5.
- [ ] **Step 3:** Gắn thẻ vào khối + sửa `duong-nen.mjs`:

```js
const DIEU_KIEN = new Map();
for (const l of khoiCopy) {
  const m = l.match(/\$\{CLAUDE_PLUGIN_ROOT\}\/((?:scripts|lib)\/[\w./-]+\.\w+)`.*\[only-if-declared: ([a-z_][a-z0-9_]*)\]\s*$/);
  if (m) DIEU_KIEN.set(m[1], m[2]);
}
const khoKhai = khoa => new RegExp(`^${khoa}:`, 'm').test(configText);
// trong vòng băm:
const khoa = DIEU_KIEN.get(tep);
const boVendored = khoa && !khoKhai(khoa) && !fs.existsSync(path.join(root, tep));
if (boVendored && ban.some(b => b.ten === 'vendored')) log(`engine: bo-qua ${tep} — tệp có điều kiện, kho không khai ${khoa}`);
const lech = cap.filter(([a, b]) => !(boVendored && (a.ten === 'vendored' || b.ten === 'vendored')))
  .find(([a, b]) => bam(a.goc, tep) !== bam(b.goc, tep));
```

- [ ] **Step 4:** Chạy lại — kỳ vọng `Results: 38 passed, 0 failed (duong-nen)`; chạy `node tests/scripts/consumer-esm.test.mjs` — CE1, CE2g PASS.
- [ ] **Step 5:** Sửa hàng `engine` của khuôn đường nền; commit.

### Task 2: design-gate gọi tên «không đo được»

**Files:**
- Modify: `scripts/design-gate.mjs` (đầu tệp: mã thoát + đoạn giải thích; trước `emit` cuối: `HTML_DUOI`, `khongDo`)
- Modify: `skills/acceptance/references/design-ui-check.md` (câu nói về bậc script static)
- Create: `tests/scripts/design-gate-khong-do-duoc.test.mjs` (DG-KDD0…3)

**Interfaces:**
- Produces: verdict `KHONG-DO-DUOC`; khoá JSON `do_duoc: false`, `ly_do_khong_do_duoc`; dòng stderr `design-gate: static không đo được tệp này (<đuôi>) — …: <đích>`.
- Phục vụ: E6–E8 · `independent: true` so với Task 1.

- [ ] **Step 1:** Tạo tệp test (nguyên văn nguyên mẫu, `BASE = 0c1fd9ff…`).
- [ ] **Step 2:** Chạy trên `design-gate.mjs` CHƯA sửa — kỳ vọng FAIL DG-KDD2, DG-KDD3.
- [ ] **Step 3:** Sửa `design-gate.mjs`:

```js
const HTML_DUOI = new Set(['.html', '.htm', '.xhtml']);
const duoi = path.extname(args.target).toLowerCase();
const khongDo = {};
let verdict = result.verdict;
if (args.mode === 'static' && !HTML_DUOI.has(duoi)) {
  if (verdict === 'PASS') verdict = 'KHONG-DO-DUOC';
  khongDo.do_duoc = false;
  khongDo.ly_do_khong_do_duoc = `static không đo được tệp này (${duoi || 'không đuôi'}) — bộ dò chỉ đọc HTML đã dựng; xanh ở đây không phải đạt`;
  process.stderr.write(`design-gate: ${khongDo.ly_do_khong_do_duoc}: ${args.target}\n`);
}
```

- [ ] **Step 4:** Chạy lại — kỳ vọng `Results: 3 passed, 0 failed`; `bash tests/design-eval/run-tests.sh` vẫn xanh (T02/T03 static trên HTML).
- [ ] **Step 5:** Sửa câu tài liệu; commit.

### Task 3: CHANGELOG + chuyển trạng thái

- [ ] Thêm mục «Chưa phát hành» vào `CHANGELOG.md` (hai thước, hệ quả crm: 0 đổi màu).
- [ ] `contract.md` → `status: implemented`; commit; vào S4.
