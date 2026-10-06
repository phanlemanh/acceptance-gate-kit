# Eval thay bởi hồ sơ đã ký — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một eval máy khai không-chạy kèm `superseded_by: <hồ sơ>#AC-n` được luật hai vế nhận khi chín điều kiện chứng được ở cây đang kiểm; làn ghim lại, recheck và lưới trước-merge gọi chung một hàm; pin nói ra ô nào thay bởi đâu.

**Architecture:** Một hàm thuần-có-đọc-đĩa mới trong `lib/evidence-core.cjs` (`chungThayBoi`) kiểm chuỗi chứng cho MỘT ô; `notRunConflicts` nhận tham số thứ ba `{ root, slug }` và chuyển ô qua chứng sang tập `thayBoi`; `checkRepinEvals` nhận tham số thứ năm chuyển thẳng xuống. Hai thư viện phụ (`lib/ac-line.cjs`, `lib/workspace-record.cjs`) nạp lười trong hàm — đã ở INIT-CI-COPY-LIST, nên không thêm tệp chép. Ba bên gọi truyền `root` suy từ chỗ đứng của chính chúng.

**Tech Stack:** Node ≥ 18 (CommonJS lib, ESM scripts/tests), bash (`pre-merge-check.sh`), git.

**Spec:** `docs/superpowers/specs/2026-10-06-eval-thay-boi-co-chung-design.md` · hợp đồng `_acceptance/eval-thay-boi-co-chung/contract.md` (duyệt 06/10) · `evals.yaml` cùng hồ sơ.

## Global Constraints

- Tên trường: `superseded_by`; giá trị `<slug>#AC-<số>`; slug khớp `^[a-z0-9][a-z0-9-]*$` (không `/`, không `.`).
- Chín lý do, chép NGUYÊN VĂN: `khong-tra-duoc` · `con-tro-hong` · `tu-tro` · `ho-so-thay-vang` · `ho-so-thay-chua-ky` · `ho-so-thay-da-khep` · `thay-khong-nhan` · `ac-thay-vang` · `ac-thay-khong-con-eval`.
- Hồ sơ thay hợp lệ: `status: signed-off` (chỉ một giá trị) và `hoSoDaKhep(...) === null`.
- Cái bắt tay: thẻ `<slug cũ>/<id cũ>` đứng riêng — `(?<![\w/-])<slug>/<id>(?![\w-])` — trong `contract.md` hoặc tệp `design_doc:` của hồ sơ thay (đường tương đối gốc kho, phải nằm TRONG gốc).
- Eval thay sống: `criterion` chứa ĐÚNG thẻ `AC-n` (rút bằng `/AC-\d+/g`, so bằng nhau), `status` khác không-chạy, và `extractEvalBlockExits(báo cáo đã ký của hồ sơ thay)` có id đó với mã `0` hoặc đúng mã `expected_exit` đã khai.
- Ô KHÔNG mang con trỏ: mọi đường đi y như hôm nay, thông điệp giữ từng chữ.
- Bên gọi không truyền `root` → ô có con trỏ vẫn xung đột, lý do `khong-tra-duoc`.
- Hậu tố dòng `sha:`: ` · thay bởi hồ sơ đã ký: <id>→<slug>#<AC>, …` đặt NGAY SAU `veBoQua`, chỉ khi có ô qua chứng. Không thêm khoá JSON vào dòng pin.
- Mọi fixture do mã sinh trong thư mục tạm; mọi đường dẫn suy từ vị trí script; ca chọn bằng `ETB_CASES`, khớp 0 ca → thoát khác 0.
- TDD có dấu trong lịch sử: commit ca đỏ ĐỨNG TRƯỚC commit vật, mỗi task.
- Trong `evals.yaml` của hồ sơ: không dòng văn nào đặt `status:` hay `superseded_by:` liền giá trị (bẫy bộ quét theo dòng).

## Review Focus

1. **Con trỏ bọc nháy hoặc có chú thích đuôi** (`"x#AC-7"   # vì sao`) — `parseEvals` trả chuỗi thô; phải bóc chú thích rồi bỏ nháy trước khi khớp, không thì ô hợp lệ bị `con-tro-hong`. Ca ở Task 2 (T02-dang).
2. **Đường thoát khỏi gốc** — slug `../x` hay `design_doc: ../../ngoai.md` không được đọc tệp ngoài `<root>`; slug bị chặn ở `con-tro-hong`, `design_doc` ngoài gốc bị bỏ qua (chỉ còn `contract.md`). Ca ở Task 4 (hàng ma trận `design-doc-ngoai-goc`).
3. **Criterion nhiều dạng** — `AC-7` · `"AC-3, AC-7"` · `[AC-3, AC-7]`; và `AC-1` không khớp `AC-10`. Ca ở Task 4.
4. **Thẻ bắt tay dính chữ** — `ho-so-cu/E1` không được khớp `ho-so-cu/E10` hay `ho-so-cu-2/E1`. Ca ở Task 4.
5. **Design doc khai mà tệp vắng** — không ném; kiểm `contract.md` một mình, gãy thì `thay-khong-nhan`. Ca ở Task 4.

---

### Task 1: Khung tệp ca + bộ dựng kho hai hồ sơ (chiều đỏ trước)

**Phục vụ:** E1 (khung), mọi eval sau dùng chung bộ dựng. **independent:** false.

**Files:**
- Create: `tests/scripts/eval-thay-boi.test.mjs`

**Interfaces:**
- Produces: `dungKho(opts) → { dir, g(...args), sha, wsCu, wsThay, run(cmd,args,cwd) }`; `chayLan(kho, extra=[]) → { code, stdout, stderr }`; `chayRecheck(kho, slug, cwd?)`; `chayPreMerge(kho, cwd?)`; `bam(kho, slug) → sha256 của run-log.jsonl + evidence-report.md`.
- `opts` (mặc định = ca lành): `{ conTro: 'ho-so-thay#AC-2', statusThay: 'signed-off', nhan: true /* design doc nêu thẻ */, acCo: true, evalThay: { criterion: 'AC-2', khaiKhongChay: false, maThoatKy: 0 }, nghiThay: false, slugCu: 'ho-so-cu', slugThay: 'ho-so-thay', designDocThay: 'docs/thay-design.md' }`.

- [ ] **Step 1: Viết tệp ca với bộ dựng và ca T01-nhan**

Bộ dựng theo khuôn hai lượt commit của `tests/scripts/lan-status-not-run.test.mjs` (`dungKhoTam`): kho git tạm dưới một `TMP` dọn khi thoát; `_acceptance/config.yaml` một suite no-op; hồ sơ cũ `ho-so-cu` có E1 (`cmd: true`, sống) và E3 (`cmd: false`, khai không-chạy + con trỏ), báo cáo đã ký có khối `- eval:` cho cả E1 và E3 (`exit_code: 0`) + run-log khớp; hồ sơ thay `ho-so-thay` có `contract.md` (`status: signed-off`, mục `## Criteria` với `- AC-1:` và `- AC-2:`, `design_doc: docs/thay-design.md`), tệp design doc chứa dòng `| ho-so-cu/E3 | … | AC-2 |`, `evals.yaml` có E7 `criterion: AC-2` `cmd: true`, `evidence-report.md` đã ký có khối `- eval: E7` `exit_code: 0`.

```js
#!/usr/bin/env node
// Ca vĩnh viễn cho hồ sơ eval-thay-boi-co-chung. Chạy trọn: node tests/scripts/eval-thay-boi.test.mjs
// Một nhóm: ETB_CASES=T01 node tests/scripts/eval-thay-boi.test.mjs
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import crypto from 'node:crypto'; import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ETB_ROOT ? path.resolve(process.env.ETB_ROOT) : path.resolve(HERE, '..', '..');
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const RECHECK = path.join(ROOT, 'scripts', 'recheck-evidence.cjs');
const PREMERGE = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'etb-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {} });
const CASES = []; const test = (id, name, fn) => CASES.push({ id, name, fn });
const fail = (m) => { throw new Error(m); };
const XUNG_DOT_CU = 'khai không-chạy trong evals.yaml nhưng báo cáo đã ký CÓ mã thoát cho chính nó';
// … dungKho(opts), chayLan, chayRecheck, chayPreMerge, bam — như Interfaces ở trên …
test('T01', 'nhan — con trỏ hợp lệ: làn 0, recheck 0, pre-merge không VIOLATION cho ho-so-cu', () => {
  const k = dungKho();
  const r = chayLan(k, ['--write']);
  if (r.code !== 0) fail(`ô thay bởi hợp lệ vẫn bị chặn: exit ${r.code}\n${r.stderr}`);
  const rc = chayRecheck(k, 'ho-so-cu'); if (rc.code !== 0) fail(`recheck đỏ: ${rc.stderr}`);
  const pm = chayPreMerge(k); if (/VIOLATION \[ho-so-cu\]/.test(pm.stdout)) fail(`pre-merge: ${pm.stdout}`);
});
test('T01', 'nhan — đối chứng: gỡ con trỏ → exit 2 + thông điệp cũ nguyên văn', () => {
  const r = chayLan(dungKho({ conTro: null }));
  if (r.code !== 2 || !r.stderr.includes(XUNG_DOT_CU)) fail(`đối chứng hỏng: exit ${r.code}\n${r.stderr}`);
});
const want = (process.env.ETB_CASES || '').split(',').filter(Boolean);
const chon = want.length ? CASES.filter(c => want.includes(c.id)) : CASES;
if (!chon.length) { console.error(`ETB_CASES=${want.join(',')} khớp 0 ca`); process.exit(1); }
let bad = 0;
for (const c of chon) { try { c.fn(); console.log(`  PASS: ${c.id} ${c.name}`); } catch (e) { bad++; console.log(`  FAIL: ${c.id} ${c.name} — ${e.message}`); } }
console.log(`\nResults: ${chon.length - bad} passed, ${bad} failed`); process.exit(bad ? 1 : 0);
```

- [ ] **Step 2: Chạy, xác nhận đỏ đúng chỗ**

Run: `ETB_CASES=T01 node tests/scripts/eval-thay-boi.test.mjs`
Expected: ca «nhan» FAIL «ô thay bởi hợp lệ vẫn bị chặn: exit 2»; ca đối chứng PASS; `ETB_CASES=T99` thoát 1 «khớp 0 ca».

- [ ] **Step 3: Commit (chiều đỏ vào lịch sử)**

```bash
git add tests/scripts/eval-thay-boi.test.mjs
git commit -m "test(eval-thay-boi-co-chung): khung ca + bộ dựng kho hai hồ sơ; T01 đỏ trước"
```

### Task 2: Luật chứng trong lib — `chungThayBoi` + `notRunConflicts` ba đối số

**Phục vụ:** E1, E3. **independent:** false.

**Files:**
- Modify: `lib/evidence-core.cjs` (cạnh `notRunConflicts`, ~dòng 492–513; `module.exports` ~dòng 1294)
- Test: `tests/scripts/eval-thay-boi.test.mjs` (thêm T02-dang, T03)

**Interfaces:**
- Produces: `chungThayBoi({ root, slug, id, conTro }) → { ok: true, thay, ac } | { ok: false, lyDo }`; `notRunConflicts(evalsText, reportText, opts?) → { xungDot: string[], khongDoiChieuDuoc: string[], thayBoi: {id,thay,ac}[], lyDo: string[] }` (hai trường mới luôn có mặt, rỗng khi không áp); `THAY_BOI_LY_DO` (mảng chín chuỗi, xuất để ca ma trận rút).

- [ ] **Step 1: Viết ca đỏ T02-dang (Review Focus 1) và T03 (bên gọi cũ)**

```js
test('T02', 'dang — con trỏ bọc nháy + chú thích đuôi vẫn được nhận', () => {
  const r = chayLan(dungKho({ conTroThô: '"ho-so-thay#AC-2"   # thay theo bảng' }));
  if (r.code !== 0) fail(`con trỏ hợp lệ bọc nháy bị từ chối: ${r.stderr}`);
});
test('T03', 'ben-goi-cu — notRunConflicts hai đối số vẫn xung đột, lý do khong-tra-duoc', () => {
  const k = dungKho(); const core = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  const ev = fs.readFileSync(path.join(k.wsCu, 'evals.yaml'), 'utf8');
  const rp = fs.readFileSync(path.join(k.wsCu, 'evidence-report.md'), 'utf8');
  const r = core.notRunConflicts(ev, rp);
  if (!r.xungDot.includes('E3') || !r.lyDo.some(l => l.startsWith('E3: khong-tra-duoc'))) fail('bên gọi cũ bị nới lặng');
});
test('T03', 'ben-goi-cu — lib thiếu ac-line.cjs / workspace-record.cjs → khong-tra-duoc, không ném', () => {
  for (const thieu of ['ac-line.cjs', 'workspace-record.cjs']) {
    const lib = path.join(TMP, `lib-thieu-${thieu}`); fs.cpSync(path.join(ROOT, 'lib'), lib, { recursive: true });
    fs.rmSync(path.join(lib, thieu));
    const core = require(path.join(lib, 'evidence-core.cjs')); const k = dungKho();
    const r = core.notRunConflicts(fs.readFileSync(path.join(k.wsCu, 'evals.yaml'), 'utf8'), fs.readFileSync(path.join(k.wsCu, 'evidence-report.md'), 'utf8'), { root: k.dir, slug: 'ho-so-cu' });
    if (!r.lyDo.some(l => l.startsWith('E3: khong-tra-duoc'))) fail(`thiếu ${thieu} mà không ra khong-tra-duoc`);
  }
  // đối chứng dương: lib đủ tệp + root → nhận
  const k = dungKho(); const core = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  const r = core.notRunConflicts(fs.readFileSync(path.join(k.wsCu, 'evals.yaml'), 'utf8'), fs.readFileSync(path.join(k.wsCu, 'evidence-report.md'), 'utf8'), { root: k.dir, slug: 'ho-so-cu' });
  if (r.thayBoi.length !== 1 || r.xungDot.length) fail(`đối chứng dương hỏng: ${JSON.stringify(r)}`);
});
```

Run: `ETB_CASES=T02,T03 node tests/scripts/eval-thay-boi.test.mjs` → Expected: FAIL (thuộc tính `lyDo`/`thayBoi` chưa có).
Commit: `git commit -m "test(eval-thay-boi-co-chung): T02 dạng con trỏ, T03 bên gọi cũ — đỏ trước"`.

- [ ] **Step 2: Hiện thực trong lib**

```js
// ── Eval thay bởi hồ sơ đã ký (hồ sơ eval-thay-boi-co-chung, 06/10/2026) ─────
// Một ô khai không-chạy mà báo cáo đã ký có mã thoát chỉ rời tập xung đột khi
// chín điều kiện chứng được ở CÂY ĐANG KIỂM (root do bên gọi truyền — không cwd).
// Thiếu root, thiếu thư viện phụ → vẫn xung đột (fail-closed, cùng vế hai ADR 0016).
const THAY_BOI_LY_DO = ['khong-tra-duoc', 'con-tro-hong', 'tu-tro', 'ho-so-thay-vang', 'ho-so-thay-chua-ky', 'ho-so-thay-da-khep', 'thay-khong-nhan', 'ac-thay-vang', 'ac-thay-khong-con-eval'];
const CON_TRO_RE = /^([a-z0-9][a-z0-9-]*)#(AC-\d+)$/;
function loadLibPhu(ten) { try { return require(path.join(__dirname, ten)); } catch (_) { return null; } }
function giaTriTruong(raw) { return unquoteScalar(String(raw == null ? '' : raw).replace(/\s+#.*$/, '').trim()).trim(); }
function docTrongGoc(root, rel) {
  const p = path.resolve(root, rel);
  if (p !== root && !p.startsWith(root + path.sep)) return null;   // không đọc ngoài gốc
  try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; }
}
function chungThayBoi({ root, slug, id, conTro }) {
  const ac = loadLibPhu('ac-line.cjs'); const wr = loadLibPhu('workspace-record.cjs'); const ey = loadEvalYaml();
  if (!root || !ac || !wr || !ey) return { ok: false, lyDo: 'khong-tra-duoc' };
  const m = CON_TRO_RE.exec(conTro); if (!m) return { ok: false, lyDo: 'con-tro-hong' };
  const [, thay, acId] = m;
  if (thay === slug) return { ok: false, lyDo: 'tu-tro' };
  const goc = path.resolve(root); const ws = path.join('_acceptance', thay);
  const hopDong = docTrongGoc(goc, path.join(ws, 'contract.md'));
  if (hopDong == null) return { ok: false, lyDo: 'ho-so-thay-vang' };
  if ((frontmatterField(hopDong, 'status') || '').trim() !== 'signed-off') return { ok: false, lyDo: 'ho-so-thay-chua-ky' };
  const baoCao = docTrongGoc(goc, path.join(ws, 'evidence-report.md'));
  if (wr.hoSoDaKhep({ status: 'signed-off', ledgerText: docTrongGoc(goc, path.join(ws, 'decisions.jsonl')), reportText: baoCao })) return { ok: false, lyDo: 'ho-so-thay-da-khep' };
  const the = new RegExp(`(?<![\\w/-])${escRe(slug)}/${escRe(id)}(?![\\w-])`);
  const dd = (frontmatterField(hopDong, 'design_doc') || '').trim();
  const nhan = the.test(hopDong) || (dd && the.test(docTrongGoc(goc, dd) || ''));
  if (!nhan) return { ok: false, lyDo: 'thay-khong-nhan' };
  if (!ac.parseACBlock(hopDong).some(x => x.id === acId)) return { ok: false, lyDo: 'ac-thay-vang' };
  const evThay = docTrongGoc(goc, path.join(ws, 'evals.yaml'));
  const daKy = baoCao == null ? new Map() : extractEvalBlockExits(baoCao);
  const mong = evThay ? ey.expectedExits(evThay).byId : new Map();
  const song = evThay ? ey.parseEvals(evThay, ['criterion', 'status']).some(e =>
    (String(e.criterion || '').match(/AC-\d+/g) || []).includes(acId)
    && normaliseEvalStatus(e.status) !== EVAL_STATUS_NOT_RUN
    && daKy.has(e.id) && (daKy.get(e.id) === 0 || daKy.get(e.id) === (mong.get(e.id) || 0))) : false;
  if (!song) return { ok: false, lyDo: 'ac-thay-khong-con-eval' };
  return { ok: true, thay, ac: acId };
}
function notRunConflicts(evalsText, reportText, opts = {}) {
  const skipped = machineEvalIdsSkipped(evalsText);
  const rong = { xungDot: [], khongDoiChieuDuoc: [], thayBoi: [], lyDo: [] };
  if (!skipped || !skipped.length) return rong;
  if (reportText == null) return { ...rong, khongDoiChieuDuoc: skipped.slice() };
  const signed = extractEvalBlockExits(reportText);
  const ey = loadEvalYaml();
  const conTroCua = new Map((ey ? ey.parseEvals(evalsText, ['superseded_by']) : []).map(e => [e.id, giaTriTruong(e.superseded_by)]));
  const out = { ...rong };
  for (const id of skipped.filter(i => signed.has(i))) {
    const ct = conTroCua.get(id);
    if (!ct) { out.xungDot.push(id); continue; }                      // luật cũ nguyên văn
    const r = chungThayBoi({ root: opts.root, slug: opts.slug, id, conTro: ct });
    if (r.ok) out.thayBoi.push({ id, thay: r.thay, ac: r.ac });
    else { out.xungDot.push(id); out.lyDo.push(`${id}: ${r.lyDo} (${ct})`); }
  }
  return out;
}
```

`escRe` = `s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` (thêm nếu lib chưa có). Thêm `chungThayBoi`, `THAY_BOI_LY_DO` vào `module.exports`.

- [ ] **Step 3: Chạy** `ETB_CASES=T03 node tests/scripts/eval-thay-boi.test.mjs` → PASS. (T01, T02 còn đỏ tới Task 3 — làn chưa truyền root.)
- [ ] **Step 4: Chạy suite lân cận không đổi:** `node tests/scripts/lan-status-not-run.test.mjs` → PASS toàn bộ.
- [ ] **Step 5: Commit** `feat(eval-thay-boi-co-chung): lib — chungThayBoi + notRunConflicts nhận ô thay bởi có chứng`.

### Task 3: Ba bên gọi truyền gốc cây + bảng điểm chạm

**Phục vụ:** E1, E4, E5. **independent:** false.

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` (~dòng 254–264 lời gọi + die; ~dòng 116–118 AG-ENGINE-TABLE)
- Modify: `lib/evidence-core.cjs` `checkRepinEvals` (thêm `opts` thứ năm, chuyển xuống; thông điệp xung đột nối `lyDo` khi có)
- Modify: `scripts/recheck-evidence.cjs` (~dòng 180)
- Modify: `scripts/pre-merge-check.sh` (~dòng 1485)
- Test: thêm T04, T05.

**Interfaces:**
- Consumes: `notRunConflicts(…, { root, slug })` từ Task 2.
- Produces: thông điệp die của làn khi còn xung đột: thông điệp cũ NGUYÊN VĂN + (nếu `lyDo` không rỗng) ` — con trỏ thay thế không chứng được: <lyDo nối '; '>`.

- [ ] **Step 1: Ca đỏ T04 (một nguồn) và T05 (cây đang kiểm, cả làn)**

```js
const LY_DO_RE = /(E\d+): ([a-z-]+) \(/g;
const phanQuyet = (txt) => [...txt.matchAll(LY_DO_RE)].map(m => `${m[1]}:${m[2]}`).sort().join(',');
test('T04', 'mot-nguon — làn, recheck, pre-merge cùng phán trên mọi hàng ma trận', () => {
  for (const hang of MA_TRAN) {           // MA_TRAN định nghĩa ở Task 4; Task 3 dùng 2 hàng đầu
    const k = dungKho(hang.opts); const lan = chayLan(k);
    const rc = chayRecheckSauPin(k);       // ghi pin bằng làn lành rồi đổi hồ sơ thay theo hàng
    const pm = chayPreMerge(k);
    const a = phanQuyet(lan.stderr), b = phanQuyet(rc.stderr), c = phanQuyet(pm.stdout);
    if (!(a === b && b === c)) fail(`ba bên trả phán quyết khác nhau ở ${hang.ten}: làn=${a} recheck=${b} premerge=${c}`);
  }
});
test('T05', 'cay-dang-kiem — K2 chạy với cwd = K1: cả ba từ chối ho-so-thay-chua-ky, không ghi byte', () => {
  const k1 = dungKho(); const k2 = dungKho({ statusThay: 'verified' }); const truoc = bam(k2, 'ho-so-cu');
  const lan = chayLan(k2, ['--write'], k1.dir);
  if (lan.code !== 2 || !lan.stderr.includes('ho-so-thay-chua-ky')) fail(`đọc nhầm cây (làn): ${lan.stderr}`);
  if (bam(k2, 'ho-so-cu') !== truoc) fail('làn đã ghi byte khi từ chối');
  // recheck / pre-merge của K2 chạy từ cwd K1 (pin dựng ở K2 bằng bản lành rồi lùi trạng thái)
});
```
Run → FAIL. Commit test.

- [ ] **Step 2: Sửa làn**

```js
const { xungDot, khongDoiChieuDuoc, lyDo } = core.notRunConflicts(s.evalsText, s.report, { root, slug: s.slug });
if (xungDot.length) die(`${s.slug}: eval ${xungDot.join(', ')} khai không-chạy trong evals.yaml nhưng báo cáo đã ký CÓ mã thoát cho chính nó — hai vế mâu thuẫn, làn không ghi gì; sửa hồ sơ rồi chạy làn mới${lyDo && lyDo.length ? ` — con trỏ thay thế không chứng được: ${lyDo.join('; ')}` : ''}`);
```
`root` ở đây là biến đã `realpathSync(flags.root)` (dòng 67) — không lấy cwd. Thêm ba hàng AG-ENGINE-TABLE CÓ ĐIỀU KIỆN (tiền lệ hàng `staleByPaths`, khoá `khi`): `{ file: 'lib/evidence-core.cjs', name: 'chungThayBoi', kind: 'function', since: '2.23.0', why: 'notRunConflicts gọi khi hồ sơ khai con trỏ thay thế', khi: 'superseded_by' }`, `{ file: 'lib/workspace-record.cjs', name: 'hoSoDaKhep', kind: 'function', since: '2.23.0', why: 'chungThayBoi gọi', khi: 'superseded_by' }`, và `mods` nạp thêm `lib/ac-line.cjs` với hàng `{ file: 'lib/ac-line.cjs', name: 'parseACBlock', kind: 'function', since: '2.23.0', why: 'chungThayBoi gọi', khi: 'superseded_by' }` — `loadEngine('lib/ac-line.cjs')` chỉ gọi khi điều kiện bật (kho không khai con trỏ không phải có tệp đó trong `--ag-root`). Điều kiện: `const coConTro = slugs.some(sl => /^[ \t]+superseded_by[ \t]*:/m.test(docTho(path.join(root, '_acceptance', sl, 'evals.yaml'))))`, tính TRƯỚC cổng bộ máy (đọc thô, chưa cần bộ máy); `batKhoa` thêm nhánh `r.khi === 'superseded_by' && coConTro`. Ca lớp-cũ (`tests/scripts/repin-lane-lop-cu.test.mjs`) phải còn xanh — nếu nó rút hàng có `khi` theo một danh sách đóng các giá trị, thêm `superseded_by` vào danh sách đó cùng commit.

- [ ] **Step 3: `checkRepinEvals(entry, evalsText, slug, reportText, opts)`** — truyền `opts` xuống `notRunConflicts`; thông điệp `xungDot` cũ giữ nguyên, nối cùng hậu tố `lyDo` như làn. **recheck:** `core.checkRepinEvals(e, evalsText, slug, payload, { root: path.resolve(dir, '..', '..') })` (`dir` = thư mục hồ sơ). **pre-merge:** trong khối `node -e`, `const root = require('path').resolve(evalsPath, '..', '..', '..');` rồi `core.checkRepinEvals(e, evalsText, slug, core.readSignedReportFor(evalsPath), { root })`.
- [ ] **Step 4:** `ETB_CASES=T01,T02,T04,T05 node tests/scripts/eval-thay-boi.test.mjs` → PASS; `node tests/scripts/repin-lane-lop-cu.test.mjs` → PASS (bảng điểm chạm).
- [ ] **Step 5: Commit** `feat(eval-thay-boi-co-chung): làn, recheck, pre-merge truyền gốc cây — một luật ba bên`.

### Task 4: Ma trận từ chối + mutant

**Phục vụ:** E2 (và Review Focus 2–5). **independent:** false.

**Files:** Test: `tests/scripts/eval-thay-boi.test.mjs` (thêm `MA_TRAN`, T02-ma-tran, T02-mutant).

- [ ] **Step 1: Ma trận viết trước, mỗi hàng gãy ĐÚNG một điều kiện**

```js
const MA_TRAN = [
  { ten: 'con-tro-hong',            opts: { conTro: 'ho-so-thay-AC-2' },                     lyDo: 'con-tro-hong' },
  { ten: 'slug-thoat-goc',          opts: { conTro: '../x#AC-2' },                            lyDo: 'con-tro-hong' },
  { ten: 'tu-tro',                  opts: { conTro: 'ho-so-cu#AC-2' },                        lyDo: 'tu-tro' },
  { ten: 'ho-so-thay-vang',         opts: { conTro: 'khong-co#AC-2' },                        lyDo: 'ho-so-thay-vang' },
  { ten: 'chua-ky-verified',        opts: { statusThay: 'verified' },                         lyDo: 'ho-so-thay-chua-ky' },
  { ten: 'chi-may-thong',           opts: { statusThay: 'machine-cleared' },                  lyDo: 'ho-so-thay-chua-ky' },
  { ten: 'da-khep-nghi',            opts: { nghiThay: true },                                 lyDo: 'ho-so-thay-da-khep' },
  { ten: 'khong-nhan',              opts: { nhan: false },                                    lyDo: 'thay-khong-nhan' },
  { ten: 'the-dinh-chu-E30',        opts: { nhan: 'ho-so-cu/E30' },                           lyDo: 'thay-khong-nhan' },
  { ten: 'the-dinh-chu-slug',       opts: { nhan: 'ho-so-cu-2/E3' },                          lyDo: 'thay-khong-nhan' },
  { ten: 'design-doc-vang',         opts: { nhan: 'chi-design-doc', designDocCo: false },     lyDo: 'thay-khong-nhan' },
  { ten: 'design-doc-ngoai-goc',    opts: { designDocThay: '../ngoai.md' },                   lyDo: 'thay-khong-nhan' },
  { ten: 'ac-thay-vang',            opts: { conTro: 'ho-so-thay#AC-9' },                      lyDo: 'ac-thay-vang' },
  { ten: 'ac-chi-khong-chay',       opts: { evalThay: { criterion: 'AC-2', khaiKhongChay: true } }, lyDo: 'ac-thay-khong-con-eval' },
  { ten: 'eval-them-sau-ky',        opts: { evalThay: { criterion: 'AC-2', maThoatKy: null } },     lyDo: 'ac-thay-khong-con-eval' },
  { ten: 'tien-to-AC-1-vs-AC-10',   opts: { conTro: 'ho-so-thay#AC-1', evalThay: { criterion: 'AC-10' }, acThem: ['AC-10'] }, lyDo: 'ac-thay-khong-con-eval' },
  { ten: 'vong-tron',               opts: { vongTron: true },                                 lyDo: 'ac-thay-khong-con-eval' },
];
const NHAN_THEM = [
  { ten: 'criterion-nhieu-AC',  opts: { conTro: 'ho-so-thay#AC-7', evalThay: { criterion: '"AC-3, AC-7"' }, acThem: ['AC-3', 'AC-7'] } },
  { ten: 'criterion-mang',      opts: { conTro: 'ho-so-thay#AC-7', evalThay: { criterion: '[AC-3, AC-7]' }, acThem: ['AC-3', 'AC-7'] } },
];
```
Ca: mỗi hàng → làn exit 2 + `bam` không đổi + `recheck` exit 1, cả hai đầu ra chứa `E3: <lyDo> (`; đếm assert = `MA_TRAN.length × 2`, so với số đếm lúc chạy, lệch → «số ca lệch». Hàng `NHAN_THEM` → làn 0. `design-doc-ngoai-goc`: bộ dựng ghi tệp `../ngoai.md` (ngoài kho) CHỨA thẻ — phải vẫn từ chối (chứng không đọc ngoài gốc).

- [ ] **Step 2: Bốn mutant trên bản sao `ETB_ROOT`** — `fs.cpSync` `lib/`, `scripts/`, `feature-loop/scripts/` sang thư mục tạm, tiêm bằng `replace` có kiểm chuỗi đích tồn tại đúng một lần (không thì ĐỎ «bước tiêm chưa bao giờ chạy»): (a) `!== 'signed-off'` → `=== '__khong__'` · (b) `if (!nhan) return` → `if (false) return` · (c) `daKy.has(e.id) &&` → `true &&` · (d) `.match(/AC-\d+/g) || []).includes(acId)` → `String(e.criterion || '').includes(acId)` dạng chuỗi con. Chạy hàng tương ứng dưới `ETB_ROOT=<bản sao>` bằng tiến trình con; mong làn exit 0 → ĐỎ ghim `đường né đo mở: <lý do>` là KẾT QUẢ MONG ĐỢI của ca mutant (ca PASS khi mutant bị bắt).
- [ ] **Step 3:** chạy, sửa lib nếu hàng nào lọt; **Step 4: Commit** từng bước (ca đỏ rồi sửa).

### Task 5: Pin nói ra

**Phục vụ:** E6. **independent:** false.

**Files:** Modify `feature-loop/scripts/repin-lane.mjs` (khối dựng `section`, ~dòng 653); Modify `feature-loop/skills/feature-loop/SKILL.md` (đoạn mô tả hậu tố dòng `sha:` dưới REPIN-TEMPLATE); Test T06.

- [ ] **Step 1: Ca đỏ T06** — sau làn xanh T01: `JSON.parse` dòng pin cuối: `evals_not_run` chứa `E3`; mọi khoá ⊆ tập khoá rút từ khối `<!-- <<<REPIN-TEMPLATE -->` của SKILL (dòng JSON đầu tiên trong khối); tập khoá bằng tập khoá của lượt cùng fixture KHÔNG con trỏ nhưng E3 không có khối đã ký (fixture `kyE3: false`). Dòng `sha:` đọc bằng regex `/^sha: .* · thay bởi hồ sơ đã ký: (.+?)(?: · |$)/m` → `E3→ho-so-thay#AC-2`; fixture không ô thay bởi → regex không khớp. Recheck pin có hậu tố → exit 0. Mutant: bỏ `${veThayBoi}` → ca ĐỎ «pin im lặng về ô thay bởi».
- [ ] **Step 2: Hiện thực** — perSlug giữ `thayBoi` từ lời gọi ở Task 3 (`s.thayBoi = r.thayBoi`); `const veThayBoi = s.thayBoi.length ? \` · thay bởi hồ sơ đã ký: ${s.thayBoi.map(t => \`${t.id}→${t.thay}#${t.ac}\`).join(', ')}\` : '';` chèn ngay sau `${veBoQua}`. SKILL: nối một câu vào đoạn «Dòng `sha:` mang thêm … hậu tố TUỲ CHỌN» nêu hậu tố mới, cùng luật vắng-khi-rỗng.
- [ ] **Step 3: Chạy** T06 + `node tests/scripts/repin-lane-noi-ra.test.mjs` + P85 (`bash tests/plugins/run-tests.sh --manh vung:1` có ca khuôn) → PASS. **Step 4: Commit.**

### Task 6: Chứng sống sau ghim

**Phục vụ:** E7. **independent:** false. **Files:** Test T07 (không mã mới — Task 2 đã đọc chuỗi chứng mỗi lượt; ca canh hồi quy).

- [ ] **Step 1:** Ca T07: làn `--write` xanh → (a) nối dòng nghỉ đủ vế `{type:'nghi',by,decision,at}` vào `decisions.jsonl` của hồ sơ thay → `chayRecheck(k,'ho-so-cu')` exit 1 chứa `ho-so-thay-da-khep`; (b) fixture mới, lùi `status` hồ sơ thay về `verified` → `ho-so-thay-chua-ky`; đối chứng: không đổi gì → 0. Mutant: bản sao lib nhận ô khi báo cáo của hồ sơ cũ chứa chuỗi `thay bởi hồ sơ đã ký:` → ca ĐỎ «lời hứa thay đã hết mà pin vẫn xanh».
- [ ] **Step 2:** Chạy → PASS (nếu đỏ: sửa lib, ghi dòng sổ `fix`). **Step 3: Commit.**

### Task 7: Vi phân kho không dùng trường

**Phục vụ:** E8. **independent:** false. **Files:** Test T08.

- [ ] **Step 1:** Base = `git -C ROOT merge-base HEAD origin/main` (không có `origin/main` → `main`; không có cả hai → ĐỎ «không có base»); dựng bằng `bash -o pipefail -c 'git -C ROOT archive <base> scripts lib feature-loop/scripts | tar -x -C <base-dir>'`, rồi kiểm `lib/evidence-core.cjs` và `scripts/pre-merge-check.sh` tồn tại. Chạy `pre-merge-check.sh <root> --base <base>` và `recheck-evidence.cjs` trên mọi `_acceptance/*/evidence-report.md` của (a) ROOT tại HEAD, (b) fixture `dungKho({ conTro: null })`, bằng bản base và bản mới; so `stdout+stderr+code` từng byte; số hồ sơ đã chấm in ra > 0. Chân nhạy: (c) fixture lành (có con trỏ) → hai bản KHÁC. Mutant: bản sao đổi một chữ trong thông điệp xung đột cũ → (b) khác → ĐỎ «kho không dùng trường đổi đầu ra».
- [ ] **Step 2:** Chạy → PASS. **Step 3: Commit.**

### Task 8: Khuôn tài liệu một chỗ + hai ghi chú chép

**Phục vụ:** E9. **independent:** false.

**Files:** Modify `GUIDE.md` §7.1 (thêm khối marker + một đoạn); Modify `commands/acceptance-init.md` (mô tả hai dòng `ac-line.cjs`, `workspace-record.cjs` trong INIT-CI-COPY-LIST: nay `evidence-core` cũng cần chúng cho luật thay bởi; vắng → `khong-tra-duoc`); `CHANGELOG.md` mục chưa phát hành; Test T09.

- [ ] **Step 1: Ca đỏ T09** — rút khối giữa `<!-- <<<EVAL-THAY-BOI-TEMPLATE -->` và `<!-- EVAL-THAY-BOI-TEMPLATE>>> -->` của `GUIDE.md` (đường từ `ROOT`), lấy khối mã yaml bên trong, thay `<slug thay>`→`ho-so-thay`, `<AC-n>`→`AC-2`, `<id>`→`E3`, ghi đè ô E3 trong `evals.yaml` của fixture lành → làn exit 0. Khối vắng → ĐỎ «không có khuôn để rút». Mutant: bản sao GUIDE đổi `superseded_by` → `supersede_by` → làn exit 2 → ca ĐỎ «khuôn tài liệu không khớp bộ đọc» (ca mutant PASS khi bắt được).
- [ ] **Step 2: Khối trong GUIDE §7.1**

````markdown
**Eval bị một hồ sơ đã ký khác thay** (2.23 · hồ sơ eval-thay-boi-co-chung). Lượt sản phẩm gỡ một
tính năng đã ký thì eval cũ mất vật đo. Khai ô cũ không chạy KÈM con trỏ tới tiêu chí thay:

<!-- <<<EVAL-THAY-BOI-TEMPLATE -->
```yaml
  - id: <id>
    executor: test
    cmd: <giữ nguyên>
    status: not-run
    superseded_by: <slug thay>#<AC-n>
```
<!-- EVAL-THAY-BOI-TEMPLATE>>> -->

Cổng nhận khi: hồ sơ thay có chữ ký người và chưa nghỉ · hợp đồng hoặc design doc của hồ sơ thay
nêu thẻ `<slug cũ>/<id>` · tiêu chí được trỏ có trong hợp đồng thay và còn eval có mã thoát trong
báo cáo đã ký của nó. Gãy điều nào → vẫn xung đột, thông điệp gọi tên điều gãy. Kiểm lại ở MỌI
lượt — hồ sơ thay nghỉ sau này thì xung đột quay lại.
````
- [ ] **Step 3:** Chạy T09 → PASS; `bash tests/plugins/run-tests.sh --manh vung:1` (ca INIT-CI-COPY-LIST/GUIDE) → PASS. **Step 4: Commit.**

### Task 9: Hình dạng crm

**Phục vụ:** E10. **independent:** false. **Files:** Test T10.

- [ ] **Step 1:** Bộ dựng mở rộng `dungKhoCrm()`: năm hồ sơ cũ (`the-gop-y-okr` 9 · `khung-tao-okr-nhu-deal` 6 · `tro-ly-okr-de-xuat` 4 · `va-tro-ly-okr-sau-thu` 4 · `nen-kara` 2 eval máy bị thay, mỗi hồ sơ thêm 1 eval máy sống), trỏ vòng quanh tám AC `AC-5, 7, 10, 11, 12, 14, 15, 16` của `gop-y-dung-cho` (signed-off, design doc mang bảng thẻ `<hồ sơ>/<eval>` 25 dòng, mỗi AC một eval có mã 0 đã ký). Làn `--write` năm `--slug` → exit 0; mỗi dòng pin `evals_not_run` == danh sách sinh; recheck năm hồ sơ 0. Đối chứng: bỏ mọi con trỏ → exit 2 ở `the-gop-y-okr` với `XUNG_DOT_CU`. Mutant: bỏ bước xét con trỏ (cho `conTroCua` luôn rỗng) → ĐỎ «hinh-dang-crm».
- [ ] **Step 2:** Chạy → PASS. **Step 3: Commit.**

### Task 10: Khép S3

**independent:** false.

- [ ] **Step 1:** Toàn tệp ca: `node tests/scripts/eval-thay-boi.test.mjs` → `Results: N passed, 0 failed`.
- [ ] **Step 2:** Mọi suite_keys: `bash tests/scripts/run-tests.sh`, `bash tests/hooks/run-tests.sh`, `bash tests/plugins/run-tests.sh`, `bash tests/workflows/run-tests.sh`, `node scripts/product-map.mjs --root . --check` → xanh.
- [ ] **Step 3:** `node scripts/eval-coverage-lint.js .` không cảnh báo mới cho hồ sơ; vẽ lại bản đồ; contract `status: implemented`; commit `docs(acceptance): eval-thay-boi-co-chung implemented — sang S4`.
