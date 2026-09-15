# do-tin-tram-phan-loai — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trạm phân loại phạm vi trong `feature-loop/workflows/acceptance-verify.js` ghép kết quả theo mã do máy đúc, hỏi lại đúng một lần phần còn thiếu, và để lại một dòng sổ `kind: "triage"` — mọi hành vi có ca hai chiều trên harness workflow, mỗi chân một dòng kết luận riêng.

**Architecture:** Toàn bộ thay đổi hành vi nằm trong MỘT khối của workflow (phase Triage, dòng 917–1022 hiện tại). Phép đo là một tệp ca `tests/workflows/triage-do-tin.test.mjs` chạy trên `harness.mjs` (nạp TỆP THẬT trong kho vào vm, tác tử giả); mỗi chân đo có đối chứng dương + mutant trên bản sao trong bộ nhớ. Răng `_acceptance/do-tin-tram-phan-loai/rang-triage.sh --chan <tên>` là lớp mỏng gọi tệp ca với bộ lọc chân, in đúng một dòng PASS của chân đó và trả mã thoát ghim. 14 khoá `config:executors.script.rang_triage_*` thêm bằng `scripts/config-patch.mjs`.

**Tech Stack:** Node ≥ 20 (ESM test, vm realm), bash, YAML config qua `config-patch.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-15-do-tin-tram-phan-loai-design.md` · hợp đồng `_acceptance/do-tin-tram-phan-loai/contract.md` (AC-1…AC-10) · `evals.yaml` (E1…E12, 16 eval).

## Global Constraints

- Không chạm `hooks/**`, `lib/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (t3_paths — hồ sơ là T2).
- Luật fail-toward-human giữ nguyên từng chữ: sau hỏi lại vẫn thiếu ⇒ `triageFailed = true` ⇒ refute chạy toàn bộ, `rejectFindings` rỗng.
- Không đổi một chữ nào trong phần LUẬT PHÂN LOẠI của lời nhắc triage (các dòng `Luat phan loai:` … `Tra ve contractUnreadable=false…`). Chỉ thêm mã vào tải gửi và vào lược đồ.
- Tên trường mã đặt MỘT chỗ có marker `<<<TRIAGE-ID-FIELD` … `TRIAGE-ID-FIELD>>>`; test rút từ marker, không gõ lại.
- Phản hồi giả của mọi ca SINH TỪ tải gửi đi thật (rút mảng `Findings: [...]` từ `call.prompt`), không gõ tay mã.
- Mỗi mutant: nếu `mutated === SRC` (kim không cắm được) thì ca ĐỎ mã 2 «chưa từng chạy» — không có mutant im lặng.
- Dòng sổ `kind: "triage"` KHÔNG mang `run_id`.
- Văn hồ sơ không dán glob-literal (P161).
- Commit sau mỗi task; suite `bash tests/workflows/run-tests.sh` xanh trước mỗi commit.

---

## Bản đồ tệp

| Tệp | Vai |
|---|---|
| `feature-loop/workflows/acceptance-verify.js` (sửa, khối phase Triage) | vật |
| `tests/workflows/triage-do-tin.test.mjs` (tạo) | mọi ca hai chiều, chạy trọn khi không có `--chan`, chạy một chân khi có |
| `_acceptance/do-tin-tram-phan-loai/rang-triage.sh` (tạo) | lớp mỏng: `--chan <tên>` → gọi test với `--chan`, in đúng một dòng PASS, mã thoát 2/3/4/5/6 |
| `_acceptance/config.yaml` (sửa qua config-patch) | 14 khoá `executors.script.rang_triage_*` |

Bảng tên chân ↔ eval ↔ khoá config (một nguồn cho Task 5):

| chân | eval | khoá |
|---|---|---|
| ma-may-duc | E1 | rang_triage_ma_may_duc |
| chu-ky-kiem | E2 | rang_triage_chu_ky_kiem |
| ma-la | E3 | rang_triage_ma_la |
| hoi-lai | E4 | rang_triage_hoi_lai |
| im | E5 | rang_triage_im |
| van-thieu | E6a | rang_triage_van_thieu |
| hoi-lai-chet | E6b | rang_triage_hoi_lai_chet |
| dong-so | E7a | rang_triage_dong_so |
| bo-doc-bo-qua | E7b | rang_triage_bo_doc_bo_qua |
| tap-rong | E8a | rang_triage_tap_rong |
| tac-tu-chet | E8b | rang_triage_tac_tu_chet |
| hop-dong-khong-doc-duoc | E8c | rang_triage_hop_dong_khong_doc_duoc |
| ma-giu-nguyen | E9 | rang_triage_ma_giu_nguyen |
| seam-ma | E10 | rang_triage_seam_ma |

---

### Task 1: Bộ khung ca + mã máy đúc + ba nấc ghép + hai lưới (AC-1, AC-2, AC-3, AC-10)

**Files:**
- Create: `tests/workflows/triage-do-tin.test.mjs`
- Modify: `feature-loop/workflows/acceptance-verify.js` — khối từ `const TRIAGE_SCHEMA = {` (dòng ~207) và khối phase Triage (dòng ~917–1022)

**Interfaces:**
- Produces trong workflow: hằng `TRIAGE_ID_FIELD` (giữa marker), mỗi phần tử `toTriage` được gán `tid` = `t<i+1>`; hàm `ghepTriage(rows, sent)` trả `{ byFinding: Map<findingKey,row>, thieu: finding[] }`.
- Produces trong test: `rutTaiGui(prompt)` → mảng đối tượng đã gửi; `respond(opts)` sinh phản hồi từ tải gửi; `chay(chan, fn)` đăng ký chân; `SRC`, `WF`, `mutant(kim, thay)`.

- [ ] **Step 1: Viết bộ khung tệp ca + bốn chân đầu (đang ĐỎ vì mã chưa có)**

```js
// tests/workflows/triage-do-tin.test.mjs — vòng do-tin-tram-phan-loai (cửa sổ 2.14).
// Mọi chân: đối chứng dương trên bản THẬT + mutant trên bản sao trong bộ nhớ.
// Phản hồi giả SINH TỪ tải gửi đi thật (AC-10): rút mảng Findings khỏi lời nhắc.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow, check, summary } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const SRC = readFileSync(WF, 'utf8');
const CHAN = (() => { const i = process.argv.indexOf('--chan'); return i >= 0 ? process.argv[i + 1] : ''; })();

// Tên trường mã: rút từ khối marker của BÊN VIẾT — không gõ lại (AC-10).
const ID_FIELD = (() => {
  const m = SRC.match(/<<<TRIAGE-ID-FIELD[\s\S]*?const TRIAGE_ID_FIELD = '([a-zA-Z_]+)'[\s\S]*?TRIAGE-ID-FIELD>>>/);
  if (!m) { console.log('  FAIL: khong rut duoc marker TRIAGE-ID-FIELD tu acceptance-verify.js'); process.exit(5); }
  return m[1];
})();

const args = {
  slug: 'demo', round: 1, riskTier: 'T2', diffBase: 'main', repoRoot: '/repo',
  invokedAt: '2026-09-15T10:00:00Z', invokedSha: 'abc1234abc1234abc1234abc1234abc1234abc12',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass', paths: ['src/a.js'] }],
  suiteCommands: [], personasPath: '/refs/p.md', templatePath: '/refs/t.md',
  contractPath: '/repo/_acceptance/demo/contract.md',
};
// Hai phát hiện TRÙNG tiêu đề khác tệp (ô lưới gỡ-mơ-hồ cũ chịu thua) + một phát hiện lẻ.
const F3 = [
  { title: 'thieu kiem tra null', file: '/repo/src/a.js', line: 1, severity: 'high', detail: 'a' },
  { title: 'thieu kiem tra null', file: '/repo/src/b.js', line: 2, severity: 'high', detail: 'b' },
  { title: 'sai ma thoat',        file: '/repo/src/c.js', line: 3, severity: 'low',  detail: 'c' },
];
const rutTaiGui = (prompt) => {
  const m = prompt.match(/Findings: (\[[\s\S]*?\])\n\n/);
  if (!m) throw new Error('khong rut duoc tai gui di tu loi nhac triage');
  return JSON.parse(m[1]);
};
// row(f, o): một dòng phản hồi ĐÚNG khuôn, sinh từ phần tử tải gửi f.
const row = (f, o = {}) => ({ [ID_FIELD]: f[ID_FIELD], title: f.title, file: f.file, inContract: true, acRef: 'AC-1', rationale: 'r', plain: '', proposal: '', ...o });
// respond({ findings, triage }) — triage(sent, luot) trả mảng dòng; luot đếm từ 1.
const respond = ({ findings, triage }) => {
  let luot = 0;
  return (c) => {
    if (c.label.startsWith('review:bugs')) return { findings };
    if (c.label.startsWith('review:')) return { findings: [] };
    if (c.label === 'triage') { luot += 1; const sent = rutTaiGui(c.prompt); const r = triage(sent, luot); return r === null ? null : { contractUnreadable: false, triaged: r }; }
    if (c.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
    if (c.label.startsWith('baseline:')) return { results: [] };
    if (c.label.startsWith('refute:')) return { refuted: false, reason: 'that' };
    if (c.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' };
    if (c.label === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  };
};
const triageCalls = (calls) => calls.filter(c => c.label === 'triage');
const refuteCalls = (calls) => calls.filter(c => c.label.startsWith('refute:'));
const mutant = (kim, thay) => {
  if (!SRC.includes(kim)) { console.log(`  FAIL: kim mutant KHONG co trong nguon: ${kim.slice(0, 60)}`); process.exit(2); }
  return SRC.replace(kim, thay);
};
const CHANS = [];
const chay = (ten, fn) => CHANS.push([ten, fn]);

// ── chân ma-may-duc (AC-1) ──────────────────────────────────────────────────
chay('ma-may-duc', async () => {
  // Đường dẫn trôi: agent trả file ở dạng khác hẳn (tương đối, đổi thư mục).
  const troi = (sent) => sent.map(f => row(f, { file: 'khac/' + path.basename(f.file) }));
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: troi }));
  const okThat = that.result.triageFailed === false && triageCalls(that.calls).length === 1;
  check('ma-may-duc doi chung duong: ban that ghep du ca ba du duong dan troi', okThat, JSON.stringify({ tf: that.result.triageFailed, n: triageCalls(that.calls).length }));
  const mut = mutant("const byTid = new Map(rows.filter(r => sentTids.has(r[TRIAGE_ID_FIELD])).map(r => [r[TRIAGE_ID_FIELD], r]))", 'const byTid = new Map()');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: troi }), mut);
  check('ma-may-duc mutant go nhanh ghep-theo-ma -> DO (rang song)', ban.result.triageFailed === true, 'go ghep-theo-ma ma van xanh');
  if (!okThat) return 4; if (ban.result.triageFailed !== true) return 3;
  console.log('PASS: ghep duoc theo ma may duc khi duong dan troi, ke ca hai phat hien TRUNG tieu de khac tep (doi chung duong: ban nguyen ven XANH; mutant go nhanh ghep-theo-ma DO ma 3)');
  return 0;
});

// ── chân chu-ky-kiem (AC-2) ─────────────────────────────────────────────────
chay('chu-ky-kiem', async () => {
  // Lượt 1: dòng t3 mang tiêu đề lệch → phải vào tập thiếu; lượt 2 trả đúng → vá được.
  const lech = (sent, luot) => luot === 1
    ? sent.map(f => f[ID_FIELD] === 't3' ? row(f, { title: 'tieu de khac han' }) : row(f))
    : sent.map(f => row(f));
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: lech }));
  const tc = triageCalls(that.calls);
  const vaoTapThieu = tc.length === 2 && rutTaiGui(tc[1].prompt).every(f => f[ID_FIELD] === 't3');
  check('chu-ky-kiem ban that: dong lech KHONG ghep, t3 vao tap thieu, luot 2 chi mang t3', vaoTapThieu && that.result.triageFailed === false, JSON.stringify({ n: tc.length, tf: that.result.triageFailed }));
  const dung = await runWorkflow(WF, args, respond({ findings: F3, triage: (s) => s.map(f => row(f)) }));
  check('chu-ky-kiem doi chung duong: tieu de dung thi ghep ngay luot 1', triageCalls(dung.calls).length === 1);
  const mut = mutant("&& String(r.title || '').trim() === String(f.title || '').trim()", '');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: lech }), mut);
  check('chu-ky-kiem mutant bo so tieu de -> dong lech VAN ghep -> khong hoi lai (rang song)', triageCalls(ban.calls).length === 1);
  if (!vaoTapThieu) return 4; if (triageCalls(ban.calls).length !== 1) return 3;
  console.log('PASS: ma khop ma tieu de lech thi KHONG ghep — phat hien do di vao tap CON THIEU va duoc luot hoi lai mang di hoi (doi chung duong: cung ca voi tieu de dung thi ghep ngay luot 1, khong co luot hoi lai)');
  return 0;
});

// ── chân ma-la (AC-3) ───────────────────────────────────────────────────────
chay('ma-la', async () => {
  const la = (sent) => [...sent.map(f => row(f)), { ...row(sent[0]), [ID_FIELD]: 't99', title: 'bia' }];
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: la }));
  const ok = that.result.triageFailed === false && triageCalls(that.calls).length === 1 && that.logs.some(l => /ma la.*t99/i.test(l));
  check('ma-la ban that: dong t99 bi bo, co log goi ten, ca ba van ghep', ok, that.logs.filter(l => /triage/i.test(l)).join(' | ').slice(0, 200));
  const mut = mutant("rows.filter(r => sentTids.has(r[TRIAGE_ID_FIELD]))", 'rows');
  // Với mutant, dòng lạ lọt vào byTid dưới khoá t99 — vô hại — nên ép nó THAY t1 để lộ:
  const laThay = (sent) => [...sent.filter(f => f[ID_FIELD] !== 't1').map(f => row(f)), { ...row(sent[0]), [ID_FIELD]: 't99' }];
  const banThat = await runWorkflow(WF, args, respond({ findings: F3, triage: laThay }));
  check('ma-la doi chung: ban that voi t1 thieu + t99 la -> hoi lai t1', triageCalls(banThat.calls).length === 2);
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: laThay }), mut.replace("const thieu = toTriage.filter(f => !byFinding.has(distinctKey(f)))", "const thieu = toTriage.filter(f => !byFinding.has(distinctKey(f)) && !rows.some(r => r.file === f.file))"));
  check('ma-la mutant bo luoi ma-la (rang song): dong la duoc doc nhu dong that', triageCalls(ban.calls).length !== 2 || ban.logs.every(l => !/ma la/i.test(l)));
  if (!ok) return 4; if (!ban.logs.every(l => !/ma la/i.test(l))) return 3;
  console.log('PASS: dong mang ma la la dong THUA — bi bo, co dong chan doan goi ten no, va khong phat hien nao mat phan loai vi no');
  return 0;
});

// ── chân seam-ma (AC-10) ────────────────────────────────────────────────────
chay('seam-ma', async () => {
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: (s) => s.map(f => row(f)) }));
  const sent = rutTaiGui(triageCalls(that.calls)[0].prompt);
  const soMa = sent.filter(f => typeof f[ID_FIELD] === 'string' && f[ID_FIELD]).length;
  const trongLuocDo = SRC.includes(`[TRIAGE_ID_FIELD]: { type: 'string'`) && SRC.includes(`required: ['title', 'file', 'inContract', 'acRef', 'rationale', 'proposal', 'plain', TRIAGE_ID_FIELD]`);
  check('seam-ma so ma trong tai gui = so phat hien', soMa === F3.length, `${soMa}/${F3.length}`);
  check('seam-ma luoc do dung cung hang TRIAGE_ID_FIELD (mot nguon)', trongLuocDo);
  const mut1 = mutant("[TRIAGE_ID_FIELD]: f.tid,", '');
  const ban1 = await runWorkflow(WF, args, respond({ findings: F3, triage: (s) => s.map(f => row(f)) }), mut1);
  check('seam-ma mutant go ma khoi loi nhac -> DO', ban1.result.triageFailed === true);
  const mut2 = mutant("const TRIAGE_ID_FIELD = 'tid'", "const TRIAGE_ID_FIELD = 'tid'; const TRIAGE_ID_FIELD_DOC = 'id'").replace("[TRIAGE_ID_FIELD]: f.tid,", "[TRIAGE_ID_FIELD_DOC]: f.tid,");
  const ban2 = await runWorkflow(WF, args, respond({ findings: F3, triage: (s) => s.map(f => row(f)) }), mut2);
  check('seam-ma mutant doi ten truong o MOT phia -> DO', ban2.result.triageFailed === true);
  if (soMa !== F3.length) return 6; if (!trongLuocDo) return 5; if (ban1.result.triageFailed !== true) return 3; if (ban2.result.triageFailed !== true) return 4;
  console.log('PASS: khop gui-di ↔ doc-lai — so ma trong tai gui di BANG so phat hien, ten truong ma rut tu MOT cho co marker va trung o ca ba phia (loi nhac, luoc do, bo ghep)');
  return 0;
});

// ── chạy ──────────────────────────────────────────────────────────────────
const chon = CHAN ? CHANS.filter(([t]) => t === CHAN) : CHANS;
if (CHAN && !chon.length) { console.log(`  FAIL: khong co chan "${CHAN}"`); process.exit(2); }
let ma = 0;
for (const [ten, fn] of chon) { console.log(`== chan ${ten} ==`); const r = await fn(); if (r !== 0 && ma === 0) ma = r; }
if (CHAN) process.exit(ma);
summary('triage-do-tin');
```

- [ ] **Step 2: Chạy để thấy ĐỎ đúng chỗ**

Run: `node tests/workflows/triage-do-tin.test.mjs --chan ma-may-duc; echo "exit=$?"`
Expected: `FAIL: khong rut duoc marker TRIAGE-ID-FIELD` và `exit=5` (mã chưa có marker).

- [ ] **Step 3: Sửa workflow — marker, lược đồ, tải gửi, ba nấc ghép, hai lưới**

Trong `acceptance-verify.js`, ngay TRÊN `const TRIAGE_SCHEMA = {` thêm:

```js
// Tên trường mã máy đúc — MỘT nguồn cho tải gửi, lược đồ và bộ ghép. Test rút từ
// đây (AC-10). Mã do máy đúc, LLM chỉ chép lại một chuỗi ngắn; định danh không còn
// là đường dẫn dài mà agent hay viết lại.
// <<<TRIAGE-ID-FIELD
const TRIAGE_ID_FIELD = 'tid'
// TRIAGE-ID-FIELD>>>
```

Trong `TRIAGE_SCHEMA.properties.triaged.items.properties` thêm dòng đầu:
```js
          [TRIAGE_ID_FIELD]: { type: 'string', description: 'chep NGUYEN VAN ma cua finding (vd t3) — day la KHOA ghep; khong duoc doi, khong duoc danh so lai' },
```
và `required` thành `['title', 'file', 'inContract', 'acRef', 'rationale', 'proposal', 'plain', TRIAGE_ID_FIELD]`.

Trong khối phase Triage: sau `const toTriage = rawFindingsFresh` thêm:
```js
toTriage.forEach((f, i) => { f.tid = `t${i + 1}` }) // đúc MỘT lần cho cả trạm (AC-9)
```
Trong `triagePrompt`, đổi dòng `Findings: ${JSON.stringify(toTriage.map(f => ({ title: ...` thành:
```js
    `Findings: ${JSON.stringify(toTriage.map(f => ({ [TRIAGE_ID_FIELD]: f.tid, title: f.title, file: f.file, line: f.line, severity: f.severity, detail: f.detail })))}\n\n` +
```
và trong dòng cuối lời nhắc, sau `title VA file chep NGUYEN VAN` thêm `; ${TRIAGE_ID_FIELD} chep NGUYEN VAN ma da gui`.

Thay đoạn từ `const triageKey = t => …` đến hết `const matchTriage = …` bằng bộ ghép ba nấc + hai lưới:
```js
// Ghép ba nấc, fail-closed từ trên xuống: (1) theo mã máy đúc; (2) khoá tệp::tiêu đề;
// (3) lưới tiêu đề duy-nhất-cả-hai-phía. Hai lưới chống tin mù cho nấc 1: mã LẠ (không
// trong tập gửi) là dòng THỪA, bỏ và gọi tên; mã khớp mà TIÊU ĐỀ lệch thì không ghép —
// mã là định danh, tiêu đề là chữ ký kiểm (AC-1, AC-2, AC-3).
const triageKey = t => `${relFile(t)} :: ${t.title}`
const ghepTriage = (rows, sent) => {
  const sentTids = new Set(sent.map(f => f.tid))
  for (const r of rows) if (r[TRIAGE_ID_FIELD] && !sentTids.has(r[TRIAGE_ID_FIELD])) log(`Triage: ma la ${r[TRIAGE_ID_FIELD]} — bo dong thua, khong ghep sang ai`)
  const byTid = new Map(rows.filter(r => sentTids.has(r[TRIAGE_ID_FIELD])).map(r => [r[TRIAGE_ID_FIELD], r]))
  const byKey = new Map(rows.map(t => [triageKey(t), t]))
  const distinctByTitle = arr => arr.reduce((m, x) => { if (!m.has(x.title)) m.set(x.title, new Set()); m.get(x.title).add(triageKey(x)); return m }, new Map())
  const rowsByTitle = distinctByTitle(rows), sentByTitle = distinctByTitle(sent)
  const unique = (m, title) => (m.get(title) || new Set()).size === 1
  const byFinding = new Map()
  for (const f of sent) {
    const r1 = byTid.get(f.tid)
    const r = (r1 && String(r1.title || '').trim() === String(f.title || '').trim()) ? r1
      : byKey.get(triageKey(f))
      || ((unique(rowsByTitle, f.title) && unique(sentByTitle, f.title)) ? rows.find(t => t.title === f.title) : undefined)
    if (r) byFinding.set(distinctKey(f), r)
  }
  const thieu = sent.filter(f => !byFinding.has(distinctKey(f)))
  return { byFinding, thieu }
}
const rowsOf = raw => ((raw && Array.isArray(raw.triaged)) ? raw.triaged : []).filter(t => t && typeof t.title === 'string')
const rows = rowsOf(triageRaw)
const { byFinding, thieu } = ghepTriage(rows, toTriage)
const matchTriage = f => byFinding.get(distinctKey(f))
```
(Lưu ý: `thieu` được Task 2 dùng; ở Task 1 nó chỉ được tính.)

- [ ] **Step 4: Chạy bốn chân → XANH; suite workflows xanh**

Run: `for c in ma-may-duc chu-ky-kiem ma-la seam-ma; do node tests/workflows/triage-do-tin.test.mjs --chan $c; echo "exit=$?"; done`
Expected: mỗi chân in đúng một dòng `PASS: …` và `exit=0` — TRỪ `chu-ky-kiem`, chân này còn đỏ ở vế «luot 2 chi mang t3» cho tới Task 2 (ghi nhận, không sửa ở đây).
Run: `bash tests/workflows/run-tests.sh | tail -3` → `Results: all workflow tests passed` KHÔNG bắt buộc ở task này vì tệp ca mới có chân đỏ chờ Task 2; chạy để thấy ca CŨ vẫn xanh: `for f in tests/workflows/acceptance-verify.test.mjs tests/workflows/vung-vat-mutants.test.mjs; do node $f | tail -1; done`.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/triage-do-tin.test.mjs
git commit -m "feat(triage): mã máy đúc + ba nấc ghép + hai lưới chống tin mù (AC-1,2,3,10)"
```

---

### Task 2: Hỏi lại đúng MỘT lần, mã cũ, fail-toward-human giữ nguyên (AC-4, AC-5, AC-6, AC-9)

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — sau `const { byFinding, thieu } = ghepTriage(rows, toTriage)`
- Modify: `tests/workflows/triage-do-tin.test.mjs` — thêm 5 chân

**Interfaces:**
- Consumes: `ghepTriage`, `thieu`, `triageOnce` (đã có, nay nhận tham số danh sách gửi).
- Produces: biến `triageStat = { sent, matched_pass1, reasked, matched_final, failed }` cho Task 4.

- [ ] **Step 1: Thêm năm chân (đang ĐỎ)**

```js
// ── chân hoi-lai (AC-4) ─────────────────────────────────────────────────────
chay('hoi-lai', async () => {
  const thieuT3 = (sent, luot) => luot === 1 ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f)) : sent.map(f => row(f));
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }));
  const tc = triageCalls(that.calls);
  const ok = tc.length === 2 && rutTaiGui(tc[1].prompt).map(f => f[ID_FIELD]).join() === 't3' && that.result.triageFailed === false && refuteCalls(that.calls).length === 3;
  check('hoi-lai ban that: dung MOT luot hoi lai chi mang t3, sau gop du, refute chi trong hop dong', ok, JSON.stringify({ n: tc.length, tf: that.result.triageFailed, rf: refuteCalls(that.calls).length }));
  const mut = mutant("if (thieu.length && !triageFailed) {", 'if (false) {');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }), mut);
  check('hoi-lai mutant go luot hoi lai -> co hong bat ngay luot 1 (rang song)', ban.result.triageFailed === true && triageCalls(ban.calls).length === 1);
  const mutCa = mutant("triageRaw2 = await triageOnce(thieu).catch(() => null)", 'triageRaw2 = await triageOnce(toTriage).catch(() => null)');
  const banCa = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }), mutCa);
  check('hoi-lai mutant hoi lai CA phat hien da ghep -> rang song', rutTaiGui(triageCalls(banCa.calls)[1].prompt).length !== 1);
  if (!ok) return 4; if (!(ban.result.triageFailed === true)) return 3; if (rutTaiGui(triageCalls(banCa.calls)[1].prompt).length === 1) return 4; if (tc.length !== 2) return 6;
  console.log('PASS: dung MOT luot hoi lai, loi nhac chi mang phat hien con thieu; sau gop du ca ba, triageFailed false, bac bo chi chay tren phat hien trong hop dong, va KHONG co tac tu phan loai thu ba');
  return 0;
});

// ── chân im (AC-5) ──────────────────────────────────────────────────────────
chay('im', async () => {
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: (s) => s.map(f => row(f)) }));
  const n = triageCalls(that.calls).length;
  check('im ban that: luot 1 du -> dung MOT tac tu triage', n === 1, String(n));
  const mut = mutant("if (thieu.length && !triageFailed) {", 'if (!triageFailed) {');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: (s) => s.map(f => row(f)) }), mut);
  check('im mutant hoi lai vo dieu kien -> hai tac tu (rang song)', triageCalls(ban.calls).length === 2);
  if (n !== 1) return 4; if (triageCalls(ban.calls).length !== 2) return 3;
  console.log('PASS: luot 1 du thi tong so tac tu nhan phan loai dung MOT — khong co luot hoi lai nao');
  return 0;
});

// ── chân van-thieu (AC-6 chân 1) ────────────────────────────────────────────
chay('van-thieu', async () => {
  const vanThieu = (sent) => sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f));
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: vanThieu }));
  const ok = that.result.triageFailed === true && triageCalls(that.calls).length === 2 && refuteCalls(that.calls).length === 3 && that.result.rejectFindings.length === 0;
  check('van-thieu ban that: sau hoi lai van thieu -> triageFailed, refute TOAN BO, khong tac tu thu ba', ok, JSON.stringify({ tf: that.result.triageFailed, n: triageCalls(that.calls).length, rf: refuteCalls(that.calls).length }));
  const mut = mutant("if (thieu.length && !triageFailed) {", 'for (let hoi = 0; hoi < 2 && thieu.length && !triageFailed; hoi++) {');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: vanThieu }), mut);
  check('van-thieu mutant hoi lai vong hai -> ba tac tu (rang song)', triageCalls(ban.calls).length === 3);
  if (!ok) return that.result.triageFailed !== true ? 4 : 5; if (triageCalls(ban.calls).length !== 3) return 3;
  console.log('PASS: chan VAN THIEU — luot hoi lai tra ve ma van khong co dong khop thi triageFailed true, bac bo chay TOAN BO, khong co tac tu phan loai thu ba');
  return 0;
});

// ── chân hoi-lai-chet (AC-6 chân 2) ─────────────────────────────────────────
chay('hoi-lai-chet', async () => {
  const chet = (sent, luot) => luot === 1 ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f)) : null;
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: chet }));
  const ok = that.result.triageFailed === true && triageCalls(that.calls).length === 2 && refuteCalls(that.calls).length === 3;
  check('hoi-lai-chet ban that: tac tu luot hai chet -> triageFailed, refute TOAN BO, khong thu lai', ok);
  const mut = mutant("triageRaw2 = await triageOnce(thieu).catch(() => null)", 'triageRaw2 = await triageOnce(thieu).catch(() => null); if (!triageRaw2) triageRaw2 = await triageOnce(thieu).catch(() => null)');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: chet }), mut);
  check('hoi-lai-chet mutant thu lai khi chet -> ba tac tu (rang song)', triageCalls(ban.calls).length === 3);
  if (!ok) return 4; if (triageCalls(ban.calls).length !== 3) return 3;
  console.log('PASS: chan HOI LAI CHET — tac tu luot hai chet thi triageFailed true, bac bo chay TOAN BO, khong co tac tu phan loai thu ba');
  return 0;
});

// ── chân ma-giu-nguyen (AC-9) ───────────────────────────────────────────────
chay('ma-giu-nguyen', async () => {
  const thieuT3 = (sent, luot) => luot === 1 ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f)) : sent.map(f => row(f));
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }));
  const maLuot2 = rutTaiGui(triageCalls(that.calls)[1].prompt).map(f => f[ID_FIELD]);
  check('ma-giu-nguyen ban that: luot 2 mang lai ma CU t3', maLuot2.join() === 't3', maLuot2.join());
  // Dòng lượt 2 mang mã NGOÀI tập đang hỏi (t1) → phải bị xử như mã lạ, không ghép đè t1.
  const ngoaiTap = (sent, luot) => luot === 1 ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f)) : [{ ...row(sent[0]), [ID_FIELD]: 't1', title: 'thieu kiem tra null', inContract: false, proposal: 'ghi-known-limits', plain: 'x' }];
  const nt = await runWorkflow(WF, args, respond({ findings: F3, triage: ngoaiTap }));
  check('ma-giu-nguyen dong luot 2 mang ma ngoai tap -> ma la, t3 van thieu -> triageFailed', nt.result.triageFailed === true && nt.logs.some(l => /ma la t1/i.test(l)));
  const mut = mutant("triageRaw2 = await triageOnce(thieu).catch(() => null)", "thieu.forEach((f, i) => { f.tid = `t${i + 1}` }); triageRaw2 = await triageOnce(thieu).catch(() => null)");
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }), mut);
  check('ma-giu-nguyen mutant duc lai ma o luot 2 -> luot 2 mang t1 (rang song)', rutTaiGui(triageCalls(ban.calls)[1].prompt).map(f => f[ID_FIELD]).join() === 't1');
  if (maLuot2.join() !== 't3') return 5; if (!(nt.result.triageFailed === true)) return 4; if (rutTaiGui(triageCalls(ban.calls)[1].prompt).map(f => f[ID_FIELD]).join() !== 't1') return 3;
  console.log('PASS: luot hoi lai mang lai MA CU cua tung phat hien (khong tai danh so), va dong tra ve mang ma ngoai tap dang hoi bi xu nhu ma la');
  return 0;
});
```

- [ ] **Step 2: Chạy → ĐỎ** (`node tests/workflows/triage-do-tin.test.mjs --chan hoi-lai` → FAIL: kim mutant không có / hoặc n=1).

- [ ] **Step 3: Sửa workflow — hỏi lại một lần**

Đổi `const triageOnce = () => agentT(triagePrompt, …)` thành hàm nhận danh sách:
```js
  const triagePromptFor = (ds) => triagePrompt.replace(
    `Findings: ${JSON.stringify(toTriage.map(f => ({ [TRIAGE_ID_FIELD]: f.tid, title: f.title, file: f.file, line: f.line, severity: f.severity, detail: f.detail })))}`,
    `Findings: ${JSON.stringify(ds.map(f => ({ [TRIAGE_ID_FIELD]: f.tid, title: f.title, file: f.file, line: f.line, severity: f.severity, detail: f.detail })))}`)
  const triageOnce = (ds = toTriage) => agentT(triagePromptFor(ds), { label: 'triage', phase: 'Triage', schema: TRIAGE_SCHEMA, ...modelOpt('triage') })
```
Sau `const { byFinding, thieu } = ghepTriage(rows, toTriage)` (Task 1) thay bằng khối:
```js
let { byFinding, thieu } = ghepTriage(rows, toTriage)
const matched1 = toTriage.length - thieu.length
// Hỏi lại ĐÚNG MỘT lần, chỉ phần còn thiếu, mang MÃ CŨ (AC-4, AC-9). Tác tử chết hay
// vẫn thiếu → rơi về luật fail-toward-human bên dưới, không thử lần ba (AC-6).
let reasked = false
if (thieu.length && !triageFailed) {
  reasked = true
  log(`Triage: thieu ${thieu.length}/${toTriage.length} muc sau luot 1 — hoi lai MOT lan chi cac muc thieu`)
  let triageRaw2 = null
  triageRaw2 = await triageOnce(thieu).catch(() => null)
  if (triageRaw2 && triageRaw2.contractUnreadable === true) triageFailed = true
  const g2 = ghepTriage(rowsOf(triageRaw2), thieu)
  for (const [k, r] of g2.byFinding) byFinding.set(k, r)
  thieu = g2.thieu
}
const matchTriage = f => byFinding.get(distinctKey(f))
```
(Lưu ý cho AC-9: `ghepTriage(rowsOf(triageRaw2), thieu)` tính `sentTids` từ `thieu`, nên một dòng lượt 2 mang mã ngoài tập đang hỏi tự thành mã lạ — không cần nhánh riêng.)

- [ ] **Step 4: Chạy đủ 9 chân → XANH; suite workflows xanh**

Run: `node tests/workflows/triage-do-tin.test.mjs | tail -2` → `Results: N passed, 0 failed (triage-do-tin)`.
Run: `bash tests/workflows/run-tests.sh | tail -1` → `Results: all workflow tests passed`.

- [ ] **Step 5: Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/triage-do-tin.test.mjs
git commit -m "feat(triage): hỏi lại đúng một lần phần còn thiếu, mã cũ; fail-toward-human giữ nguyên (AC-4,5,6,9)"
```

---

### Task 3: Ba đường hỏng cũ, mỗi chân một dòng (AC-8)

**Files:**
- Modify: `tests/workflows/triage-do-tin.test.mjs` — thêm 3 chân (không sửa workflow trừ khi chân đỏ).

- [ ] **Step 1: Thêm ba chân**

```js
// ── chân tap-rong (AC-8 chân 1) ─────────────────────────────────────────────
chay('tap-rong', async () => {
  const that = await runWorkflow(WF, args, respond({ findings: [], triage: (s) => s.map(f => row(f)) }));
  const ok = triageCalls(that.calls).length === 0 && that.result.triageFailed === false;
  check('tap-rong ban that: khong tac tu triage, triageFailed false', ok);
  const mut = mutant("if (toTriage.length === 0) {", 'if (false) {');
  const ban = await runWorkflow(WF, args, respond({ findings: [], triage: (s) => s.map(f => row(f)) }), mut);
  check('tap-rong mutant bo nhanh tap-rong -> goi tac tu (rang song)', triageCalls(ban.calls).length >= 1);
  if (!ok) return 4; if (triageCalls(ban.calls).length < 1) return 3;
  console.log('PASS: duong cu TAP RONG — khong tac tu phan loai nao duoc goi va triageFailed false');
  return 0;
});
// ── chân tac-tu-chet (AC-8 chân 2) ──────────────────────────────────────────
chay('tac-tu-chet', async () => {
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: () => null }));
  const ok = that.result.triageFailed === true && triageCalls(that.calls).length === 2; // 1 + retry cũ, KHÔNG có hỏi lại
  check('tac-tu-chet ban that: chet ca hai lan thu -> triageFailed, khong hoi lai', ok, String(triageCalls(that.calls).length));
  const mut = mutant("if (thieu.length && !triageFailed) {", 'if (thieu.length) {');
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: () => null }), mut);
  check('tac-tu-chet mutant cho hoi lai o nhanh chet -> ba tac tu (rang song)', triageCalls(ban.calls).length === 3);
  if (!ok) return that.result.triageFailed !== true ? 4 : 5; if (triageCalls(ban.calls).length !== 3) return 3;
  console.log('PASS: duong cu TAC TU CHET — chet ca hai lan thu cua luot 1 thi triageFailed true va KHONG co luot hoi lai nao');
  return 0;
});
// ── chân hop-dong-khong-doc-duoc (AC-8 chân 3) ──────────────────────────────
chay('hop-dong-khong-doc-duoc', async () => {
  const r = (c) => c.label === 'triage' ? { contractUnreadable: true, triaged: [] } : respond({ findings: F3, triage: () => [] })(c);
  const that = await runWorkflow(WF, args, r);
  const ok = that.result.triageFailed === true && triageCalls(that.calls).length === 1;
  check('hop-dong-khong-doc-duoc ban that: triageFailed true, khong hoi lai', ok, String(triageCalls(that.calls).length));
  const mut = mutant("if (triageRaw && triageRaw.contractUnreadable === true) {", 'if (false) {');
  const ban = await runWorkflow(WF, args, r, mut);
  check('hop-dong-khong-doc-duoc mutant bo nhanh tu-khai -> hoi lai / khong hong (rang song)', ban.result.triageFailed !== true || triageCalls(ban.calls).length === 2);
  if (!ok) return that.result.triageFailed !== true ? 3 : 4; if (!(ban.result.triageFailed !== true || triageCalls(ban.calls).length === 2)) return 3;
  console.log('PASS: duong cu TU KHAI KHONG DOC DUOC HOP DONG — triageFailed true va KHONG co luot hoi lai nao');
  return 0;
});
```

- [ ] **Step 2: Chạy → nếu `hop-dong-khong-doc-duoc` đỏ vì hỏi lại vẫn chạy sau tự-khai:** kiểm thứ tự trong workflow — khối `if (triageRaw && triageRaw.contractUnreadable === true) { triageFailed = true … }` phải đứng TRƯỚC khối hỏi lại; nếu đứng sau, dời lên ngay dưới `if (!triageRaw || !Array.isArray(triageRaw.triaged)) {…}`.

- [ ] **Step 3: Chạy đủ 12 chân + suite → XANH. Commit**

```bash
git add tests/workflows/triage-do-tin.test.mjs feature-loop/workflows/acceptance-verify.js
git commit -m "test(triage): ba đường hỏng cũ, mỗi chân một dòng và một mutant (AC-8)"
```

---

### Task 4: Dòng sổ `kind: "triage"` + ma trận bộ đọc toàn phần (AC-7)

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — sau khối hỏi lại, trước `phase('Refute')`
- Modify: `tests/workflows/triage-do-tin.test.mjs` — 2 chân `dong-so`, `bo-doc-bo-qua`

**Interfaces:**
- Produces: dòng run-log `{ts, sha?, round, kind:'triage', sent, matched_pass1, reasked, matched_final, failed}`; tệp tạm `<scratch>/triage-run-log.jsonl` do chân `dong-so` ghi, chân `bo-doc-bo-qua` đọc (round-trip).

- [ ] **Step 1: Thêm chân `dong-so` (ĐỎ)**

```js
import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
const SCRATCH = path.join(os.tmpdir(), 'triage-do-tin'); mkdirSync(SCRATCH, { recursive: true });
const RUNLOG_TMP = path.join(SCRATCH, 'triage-run-log.jsonl');

chay('dong-so', async () => {
  const thieuT3 = (sent, luot) => luot === 1 ? sent.filter(f => f[ID_FIELD] !== 't3').map(f => row(f)) : sent.map(f => row(f));
  const that = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }));
  const lines = (that.result.runLog || []).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const tr = lines.filter(l => l.kind === 'triage');
  const ok = tr.length === 1 && tr[0].sent === 3 && tr[0].matched_pass1 === 2 && tr[0].reasked === true && tr[0].matched_final === 3 && tr[0].failed === false && !('run_id' in tr[0]);
  check('dong-so ban that: dung MOT dong kind triage, du nam so, khong run_id', ok, JSON.stringify(tr));
  // ghi run-log THẬT của lần chạy này cho chân bộ-đọc dùng lại (round-trip writer→reader)
  writeFileSync(RUNLOG_TMP, (that.result.runLog || []).join('\n') + '\n');
  const mut = mutant("runLogLines.push(JSON.stringify({ ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, kind: 'triage',", "void (JSON.stringify({ ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, kind: 'triage',");
  const ban = await runWorkflow(WF, args, respond({ findings: F3, triage: thieuT3 }), mut);
  const banTr = (ban.result.runLog || []).filter(l => /"kind":"triage"/.test(l));
  check('dong-so mutant bo dong so -> khong con dong (rang song)', banTr.length === 0);
  if (!ok) return ('run_id' in (tr[0] || {})) ? 4 : 5; if (banTr.length !== 0) return 3;
  console.log('PASS: dung MOT dong kind triage trong runLog, du nam truong so, va KHONG co run_id (run-log cua lan chay nay duoc ghi ra tep cho chan bo-doc dung lai)');
  return 0;
});
```

- [ ] **Step 2: Sửa workflow — ghi dòng sổ**

Ngay sau `const matchTriage = …` (cuối khối hỏi lại) thêm:
```js
// Dòng sổ của trạm (AC-7): mốc phát hành đọc dòng 3–5 của luật (c) cho nhát cắt này từ
// đây, không đếm tay từ transcript. KHÔNG run_id → mọi bộ đọc bằng chứng bỏ qua, cùng
// đường với dòng finding/panel/baseline; ma trận bộ đọc có ca riêng.
// <<<TRIAGE-LINE
const triageStat = { sent: toTriage.length, matched_pass1: matched1, reasked, matched_final: toTriage.length - thieu.length, failed: triageFailed || thieu.length > 0 }
runLogLines.push(JSON.stringify({ ts: invokedAt, ...(invokedSha ? { sha: invokedSha } : {}), round: args.round, kind: 'triage', ...triageStat }))
// TRIAGE-LINE>>>
```
(Khối `if (!triageFailed && triagedRaw.some(f => f.unclassified)) { triageFailed = true … }` phía dưới giữ nguyên; `failed` ở dòng sổ đã tính `thieu.length > 0` nên khớp giá trị cuối.)

- [ ] **Step 3: Thêm chân `bo-doc-bo-qua` — ma trận toàn phần bằng mã**

```js
chay('bo-doc-bo-qua', async () => {
  if (!existsSync(RUNLOG_TMP)) { console.log('  FAIL: chua co run-log cua chan dong-so — chay chan dong-so truoc'); return 6; }
  const runLogText = readFileSync(RUNLOG_TMP, 'utf8');
  // Đối chứng dương: thêm MỘT dòng repin có run_id để bộ đọc phải THẤY nó.
  const RID = 'rid-doi-chung-1';
  const withRepin = runLogText + JSON.stringify({ ts: 't', kind: 'repin', run_id: RID, sha: 'a'.repeat(40), suites_exit: [0], evals_exit: { E1: 0 } }) + '\n';
  // (1) LỚP bộ đọc = tệp trong lib/ scripts/ feature-loop/scripts/ hooks/ nhắc tới run-log.jsonl — quét bằng mã.
  const quet = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? quet(path.join(dir, d.name)) : [path.join(dir, d.name)]);
  const LOP = ['lib', 'scripts', 'feature-loop/scripts', 'hooks'].flatMap(d => quet(path.join(ROOT, d)))
    .filter(f => /\.(cjs|mjs|js|sh)$/.test(f) && readFileSync(f, 'utf8').includes('run-log.jsonl')).map(f => path.relative(ROOT, f)).sort();
  // (2) Bộ được CHẠY thật trên run-log của chân dong-so, mỗi bộ một khẳng định.
  const ws = path.join(SCRATCH, 'ws', '_acceptance', 'demo'); mkdirSync(ws, { recursive: true });
  writeFileSync(path.join(ws, 'run-log.jsonl'), withRepin);
  const ec = await import(path.join(ROOT, 'lib', 'evidence-core.cjs')).then(m => m.default || m);
  const ids = ec.loadRunLogIds(ws);
  const chay_ = {
    'lib/evidence-core.cjs': ids instanceof Set ? (ids.has(RID) && ids.size === 1) : (Array.isArray(ids) && ids.includes(RID) && ids.length === 1),
    'feature-loop/scripts/carry-plan.mjs': await (async () => { const m = await import(path.join(ROOT, 'feature-loop', 'scripts', 'carry-plan.mjs')); const a = m.plan({ runLogText: withRepin, evalsText: 'schema_version: 1\nevals:\n  - id: E1\n    executor: test\n    cmd: x\n', contractText: '---\nstatus: implemented\n---\n', deltaFiles: [], round: 2, agRoot: ROOT }); const b = m.plan({ runLogText: withRepin.split('\n').filter(l => !/"kind":"triage"/.test(l)).join('\n'), evalsText: 'schema_version: 1\nevals:\n  - id: E1\n    executor: test\n    cmd: x\n', contractText: '---\nstatus: implemented\n---\n', deltaFiles: [], round: 2, agRoot: ROOT }); return JSON.stringify(a) === JSON.stringify(b); })(),
    'feature-loop/scripts/round-tally-read.mjs': (() => { const out = execFileSync('node', [path.join(ROOT, 'feature-loop/scripts/round-tally-read.mjs'), '--run-log', path.join(ws, 'run-log.jsonl')], { encoding: 'utf8' }); return !/triage/.test(out); })(),
    'scripts/acceptance-gold.mjs': (() => { const out = execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', path.join(SCRATCH, 'ws'), '--json'], { encoding: 'utf8' }); return !/triage/.test(out); })(),
    'scripts/loop-health.mjs': (() => { try { const out = execFileSync('node', [path.join(ROOT, 'scripts/loop-health.mjs'), '--root', path.join(SCRATCH, 'ws')], { encoding: 'utf8' }); return !/triage/.test(out); } catch (e) { return !/triage/.test(String(e.stdout || '')); } })(),
    'scripts/recheck-evidence.cjs': (() => { writeFileSync(path.join(ws, 'evidence-report.md'), `---\nschema_version: 2\nfeature_slug: demo\nverdict: PASS\nverified_commit: ${'a'.repeat(40)}\n---\n# Evidence Report: demo\n\n### Re-pin lần 1 — 2026-09-15, do x\nrun_id: ${RID}\nsha: ${'a'.repeat(40)} · suites: 1 lệnh exit 0 · evals: 1/1 eval máy đạt kỳ vọng\n`); try { const out = execFileSync('node', [path.join(ROOT, 'scripts/recheck-evidence.cjs'), path.join(ws, 'evidence-report.md')], { encoding: 'utf8' }); return !/triage/.test(out); } catch (e) { return !/triage/.test(String(e.stdout || '') + String(e.stderr || '')); } })(),
  };
  // (3) Bộ KHÔNG chạy — mỗi mục một lý do máy kiểm được trên nguồn.
  const KHONG_CHAY = {
    'feature-loop/scripts/repin-lane.mjs': ['bên VIẾT dòng repin, không đọc kind khác', s => /kind: 'repin'/.test(s) && !/kind === 'triage'/.test(s)],
    'hooks/acceptance-evidence-gate.js': ['uỷ toàn bộ việc đọc run-log cho lib/evidence-core.cjs (đã đo)', s => /runLogFailure/.test(s) && !/readFileSync\([^)]*run-log/.test(s)],
    'scripts/pre-merge-check.sh': ['chỉ grep dòng có "kind":"repin"', s => /"kind":"repin"/.test(s) && !/"kind":"triage"/.test(s)],
    'feature-loop/scripts/s4-args.mjs': ['đọc run-log chỉ qua bộ lọc kind baseline/panel và uỷ carry-plan (đã đo)', s => /l\.kind === 'baseline'/.test(s) && /l\.kind === 'panel'/.test(s) && /carry-plan/.test(s)],
  };
  const chayOk = Object.entries(chay_).filter(([, v]) => v).map(([k]) => k);
  const chayDo = Object.entries(chay_).filter(([, v]) => !v).map(([k]) => k);
  const kcOk = Object.entries(KHONG_CHAY).filter(([k, [, f]]) => f(readFileSync(path.join(ROOT, k), 'utf8'))).map(([k]) => k);
  const phu = new Set([...Object.keys(chay_), ...Object.keys(KHONG_CHAY)]);
  const thieuLop = LOP.filter(f => !phu.has(f)); const thua = [...phu].filter(f => !LOP.includes(f));
  check(`bo-doc-bo-qua ma tran TOAN PHAN: quet ${LOP.length}, phu ${phu.size}`, thieuLop.length === 0 && thua.length === 0, JSON.stringify({ thieuLop, thua }));
  check('bo-doc-bo-qua moi bo chay deu bo qua dong triage va thay dong run_id', chayDo.length === 0, chayDo.join(','));
  check('bo-doc-bo-qua moi bo khong chay co ly do kiem duoc tren nguon', kcOk.length === Object.keys(KHONG_CHAY).length);
  if (thieuLop.length || thua.length) return 5; if (chayDo.length) return 3; if (kcOk.length !== Object.keys(KHONG_CHAY).length) return 4;
  console.log(`PASS: ma tran bo doc TOAN PHAN — so bo doc chay BANG so bo doc quet duoc (${phu.size}/${LOP.length}, ten tung bo in ra: ${[...phu].sort().join(', ')}), moi bo bo qua dong kind triage va van doc dung dong co run_id`);
  return 0;
});
```
Điểm phải kiểm khi chạy lần đầu: (a) tên hàm `loadRunLogIds` trong `lib/evidence-core.cjs` (đã xác nhận có trong `module.exports`) và kiểu trả về — sửa khẳng định theo kiểu thật; (b) `acceptance-gold.mjs`/`loop-health.mjs` có thể exit ≠ 0 trên workspace tối giản — bắt lỗi và vẫn kiểm chuỗi `triage` trong output; nếu một bộ CẦN thêm tệp (`contract.md`), tạo tối giản trong `ws`. Không được chuyển một bộ sang `KHONG_CHAY` chỉ vì khó dựng fixture — đó là đúng lỗ P1 mà phản biện đã gọi tên.

- [ ] **Step 4: Chạy 14 chân + suite → XANH. Commit**

```bash
git add feature-loop/workflows/acceptance-verify.js tests/workflows/triage-do-tin.test.mjs
git commit -m "feat(triage): dòng sổ kind triage + ma trận bộ đọc toàn phần (AC-7)"
```

---

### Task 5: Răng `rang-triage.sh` + 14 khoá config + s4-args giải được

**Files:**
- Create: `_acceptance/do-tin-tram-phan-loai/rang-triage.sh`
- Modify: `_acceptance/config.yaml` qua `scripts/config-patch.mjs --write` (14 lần)

- [ ] **Step 1: Viết răng**

```bash
#!/usr/bin/env bash
# Răng của hồ sơ do-tin-tram-phan-loai — lớp MỎNG bọc tests/workflows/triage-do-tin.test.mjs.
# Mỗi chân = một ca hai chiều trên harness workflow (tệp THẬT trong kho, không phải bản
# plugin cache). Răng chỉ: chạy đúng chân, chuyển mã thoát, in đúng MỘT dòng PASS của chân.
# Mã thoát: 0 xanh · 2 chưa từng chạy (kim mutant không cắm được / chân không có / node
# lỗi) · 3 mutant không đỏ · 4 đối chứng dương đỏ · 5 không tới kết luận / lớp không toàn
# phần · 6 thiếu tiền đề (run-log chân trước, số mã).
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
CHAN=""; [ "${1:-}" = "--chan" ] && CHAN="${2:-}"
[ -z "$CHAN" ] && { echo "FAIL: rang-triage.sh --chan <ten>"; exit 2; }
T="$ROOT/tests/workflows/triage-do-tin.test.mjs"
[ -f "$T" ] || { echo "FAIL: khong co $T"; exit 2; }
# chân bo-doc-bo-qua cần run-log của chân dong-so: chạy dong-so trước, lặng.
if [ "$CHAN" = "bo-doc-bo-qua" ]; then node "$T" --chan dong-so >/dev/null 2>&1 || { echo "FAIL: chan dong-so (tien de) do"; exit 6; }; fi
out="$(node "$T" --chan "$CHAN" 2>&1)"; rc=$?
echo "$out" | grep -v '^PASS: ' | sed 's/^/  /' >&2
n="$(echo "$out" | grep -c '^PASS: ')"
if [ "$rc" -ne 0 ]; then echo "FAIL: chan $CHAN do (ma $rc)"; exit "$rc"; fi
if [ "$n" -ne 1 ]; then echo "FAIL: chan $CHAN in $n dong PASS (doi dung 1)"; exit 5; fi
echo "$out" | grep '^PASS: '
exit 0
```
`chmod +x` rồi thử: `bash _acceptance/do-tin-tram-phan-loai/rang-triage.sh --chan im; echo "exit=$?"` → đúng một dòng PASS, exit 0. Thử chiều đỏ của răng: `bash … --chan khong-co; echo $?` → `exit=2`.

- [ ] **Step 2: Thêm 14 khoá config (đúng bảng ở đầu kế hoạch)**

```bash
for p in ma-may-duc:ma_may_duc chu-ky-kiem:chu_ky_kiem ma-la:ma_la hoi-lai:hoi_lai im:im van-thieu:van_thieu hoi-lai-chet:hoi_lai_chet dong-so:dong_so bo-doc-bo-qua:bo_doc_bo_qua tap-rong:tap_rong tac-tu-chet:tac_tu_chet hop-dong-khong-doc-duoc:hop_dong_khong_doc_duoc ma-giu-nguyen:ma_giu_nguyen seam-ma:seam_ma; do
  chan="${p%%:*}"; key="${p##*:}"
  node scripts/config-patch.mjs --config _acceptance/config.yaml --key "executors.script.rang_triage_$key" --value "bash _acceptance/do-tin-tram-phan-loai/rang-triage.sh --chan $chan" --write
done
grep -c "rang_triage_" _acceptance/config.yaml   # → 14
```

- [ ] **Step 3: s4-args giải trọn 16 eval (fail-closed)**

Run: `node feature-loop/scripts/s4-args.mjs --slug do-tin-tram-phan-loai --root . --ag-root . --out /tmp/s4-do-tin.json; echo "exit=$?"; node -e "const a=require('/tmp/s4-do-tin.json'); console.log(a.evals.length, a.evals.every(e=>e.cmd&&e.ref))"`
Expected: `exit=0` và `16 true`.

- [ ] **Step 4: Suite plugins + workflows xanh (P161 quét hồ sơ mới), commit**

```bash
bash tests/workflows/run-tests.sh | tail -1
bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 5'
git add _acceptance/do-tin-tram-phan-loai/rang-triage.sh _acceptance/config.yaml
git commit -m "chore(do-tin-tram-phan-loai): răng 14 chân + khoá config; s4-args giải trọn 16 eval"
```

---

## Tự soát

**Phủ spec:** Nhát 1 (mã đúc, 3 nấc, 2 lưới) → Task 1 · Nhát 2 (hỏi lại 1 lần, mã cũ, fail-toward-human) → Task 2 · đường cũ → Task 3 · Nhát 3 (dòng sổ + bộ đọc) → Task 4 · đường đo tới eval → Task 5. Mười AC đều có chân; 16 eval: 14 chân + E11/E12 là suite có sẵn.
**Chỗ trống:** không có TBD; mọi mutant có kim nguyên văn và câu thay; mọi dòng PASS chép đúng chữ `expected` của evals.yaml.
**Nhất quán tên:** `TRIAGE_ID_FIELD` · `ghepTriage(rows, sent) → {byFinding, thieu}` · `rowsOf` · `triageOnce(ds)` · `triageStat` · `RUNLOG_TMP` · nhãn tác tử `'triage'` giữ nguyên cho cả hai lượt (AC-5 đếm theo nhãn).
**Rủi ro thi công đã nhìn:** thứ tự khối `contractUnreadable` so với khối hỏi lại (Task 3 bước 2 có hướng dẫn) · kim mutant phải khớp NGUYÊN VĂN mã Task 1/2 viết — nếu đổi cách viết, đổi kim cùng lúc (răng đỏ mã 2 sẽ bắt) · ma trận E7b có thể cần fixture tối giản thêm cho `loop-health`/`gold`; cấm đẩy sang danh sách không-chạy.
