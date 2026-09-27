# cham-khong-tu-dot-luot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lượt chấm S4 thôi tự đốt lượt vì hạ tầng (mã thoát máy đọc từ dấu, cờ công-cụ-giết tới sổ, dòng SUITE không chạy được ra nhãn hạ tầng, verified_commit từ máy, ảnh neo hồ sơ), thẻ Cổng Phạm vi hiện đủ mục «không làm» và mọi bảng phản biện, bảng chi phí tách theo khối.

**Architecture:** Ba làn độc lập theo tập tệp rời nhau — A bộ chấm (`acceptance-verify.js` + `lib/nhan-canh-gay.cjs`), B thẻ (`scripts/gate-card.js` + thân lệnh `acceptance-card`), C đo-chữ (`wf-usage.mjs` + ba tài liệu). Mỗi làn một tệp ca riêng (`tests/scripts/ckdl-{cham,the,do}.test.mjs`) để ba worktree song song không xung đột khi gộp; khoá config `executors.script.ckdl` chạy cả ba. Sổ chạy trong ca đo do BỘ CHẤM THẬT sinh (harness `tests/workflows/harness.mjs`), đọc lại bằng chính lib/s4-args (round-trip).

**Tech Stack:** Node ≥ 22 ESM test files (không framework — khuôn `ca()/assert()` như `htkd.test.mjs`), bash, harness workflow vm.

**Spec:** `docs/superpowers/specs/2026-09-27-cham-khong-tu-dot-luot-design.md` · hợp đồng `_acceptance/cham-khong-tu-dot-luot/contract.md` (đã duyệt 27/09) · `evals.yaml`.

## Global Constraints

- Chuỗi `cmd` trong args KHÔNG đổi: nó là khoá của `byCmd`, `cmdRuns`, `SUITE_SET`, `expByCmd`, `tenDuyNhat`, carry-forward, run_id (design §2).
- Khung bọc chỉ ở tầng prompt lane machine; lane ui và baseline KHÔNG bọc (Out of scope).
- Không thêm trạng thái/nhãn (`mu`/`chet`/`vat`/null giữ nguyên), không thêm khoá config ngoài `ckdl`, không đổi schema hồ sơ.
- Không thêm khoá `card-plain.json` mới: mục phạm vi dịch qua khoá `wont_do` sẵn có với id `OOS-n` (khuôn đóng `CARD-PLAIN-KEYS` giữ nguyên, P147 xanh).
- Mỗi phép đo mới: cặp hai-chiều cùng fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE); kim đột biến khẳng định số lần khớp trong nguồn thật.
- Bản sao cho ca đột biến gate-card: chép TRỌN `scripts/` + `lib/` vào thư mục tạm (không chép tay danh sách tệp — P150).
- Đường dẫn trong ca suy từ vị trí tệp ca; không hardcode ROOT.
- Đầu ra khung bọc ≤ 8 000 byte theo BYTE (gap-probe P2).

## Review Focus

1. **Lệnh có dòng `#` cuối hoặc `exit` giữa chừng trong khung bọc** — dấu `__EXIT=` vẫn phải in đúng mã (xuống dòng trước `)`); ca: lệnh `exit 3 # chu thich` → `__EXIT=3` (Task A2).
2. **outputTail bị tác tử cắt còn vài dòng mà vẫn giữ dòng dấu cuối** — bộ đọc lấy LẦN KHỚP CUỐI của `^__EXIT=(\d+)\s*$`; ca: hai dòng dấu (lệnh con tự in một dấu giả `__EXIT=0` ở giữa, dấu thật cuối `__EXIT=1`) → mã 1 (Task A3).
3. **Variance-N (cmdRuns > 1)** — luật dấu áp TỪNG lần chạy trước khi gộp; ca: eval `runs: 2`, lần 1 dấu 0 khai 1, lần 2 dấu 0 khai 0 → pass 2/2, không variance (Task A3).
4. **Bản dịch cũ chỉ có `scope_plain`** (mọi hồ sơ trước vòng) — thẻ vẫn hiện đủ mục bằng chữ hợp đồng và câu tóm hiện như dòng dẫn, 0 cờ (Task B1).
5. **Hồ sơ gap-probe đời cũ chỉ một bảng dưới «## Findings»** — số hàng và chữ hàng y như trước vòng (đối chứng so với bản gate-card của `origin/main` chép trọn thư mục) (Task B2).

---

### Task 0: Khoá config chạy ba tệp ca (main loop, TRƯỚC khi chia làn)

**Files:**
- Modify: `_acceptance/config.yaml` (khoá `executors.script.ckdl`)

**Interfaces:** Produces: ba tên tệp ca `tests/scripts/ckdl-cham.test.mjs`, `ckdl-the.test.mjs`, `ckdl-do.test.mjs`; danh sách tên ca giữ nguyên như evals.yaml.

- [ ] **Step 1:** Thay thân lệnh `ckdl` thành chạy ba tệp và gộp đầu ra:

```yaml
    ckdl: "bash -c 'out=$(for f in ckdl-cham ckdl-the ckdl-do; do node tests/scripts/$f.test.mjs 2>&1 || echo \"TEP-DO: $f\"; done); printf \"%s\\n\" \"$out\" | tail -n 60; printf \"%s\\n\" \"$out\" | grep -q \"^TEP-DO: \" && exit 1; for c in CK-AC1 CK-AC1-khung CK-AC1-dot-bien CK-AC2 CK-AC2-ui CK-AC2-dot-bien CK-AC3-r2 CK-AC3-r3 CK-AC3-dot-bien CK-AC4 CK-AC4-dot-bien CK-AC5 CK-AC5-dot-bien CK-AC6 CK-AC6-crm CK-AC6-co-vang CK-AC6-dot-bien CK-AC7 CK-AC7-clean CK-AC7-dot-bien CK-AC8 CK-AC8-doi-chung CK-AC8-dot-bien CK-AC9 CK-AC9-dot-bien; do printf \"%s\\n\" \"$out\" | grep -qF \"PASS: $c \" || exit 1; done'"
```

- [ ] **Step 2:** Verify: `node -e 'const {resolveConfigKey}=require("./lib/evidence-core.cjs");console.log(resolveConfigKey(require("fs").readFileSync("_acceptance/config.yaml","utf8"),"executors.script.ckdl").includes("ckdl-the"))'` → `true`.
- [ ] **Step 3:** Commit `chore(cham-khong-tu-dot-luot): khoá ckdl chạy ba tệp ca theo làn`.

---

## LÀN A — bộ chấm (independent: true · tệp: `feature-loop/workflows/acceptance-verify.js`, `lib/nhan-canh-gay.cjs`, `tests/scripts/ckdl-cham.test.mjs`, xoá `tests/scripts/suite-bi-cat.test.mjs`)

Khung tệp ca `tests/scripts/ckdl-cham.test.mjs` (tạo ở Task A1, các task sau nối ca vào trước dòng `rmSync(TMP…)`):

```js
// ckdl-cham.test.mjs — hồ sơ cham-khong-tu-dot-luot, làn A (bộ chấm). Tên ca = tên AC.
// Sổ chạy do BỘ CHẤM THẬT sinh (harness tests/workflows) rồi đưa cho chính lib/s4-args.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
const LIB = path.join(KIT, 'lib', 'nhan-canh-gay.cjs');
const require = createRequire(import.meta.url);
const NCG = require(LIB);
const TMP = mkdtempSync(path.join(tmpdir(), 'ckdl-cham-'));
let pass = 0; let fail = 0;
const ok = (n, m = '') => { pass += 1; console.log(`PASS: ${n} ${m}`.trimEnd() + ' '); };
const bad = (n, m) => { fail += 1; console.log(`FAIL: ${n} — ${m}`); };
const CHON = [...process.argv.slice(2), ...(process.env.CKDL_CASES ? process.env.CKDL_CASES.split(',') : [])];
const want = n => !CHON.length || CHON.some(c => n === c || n.startsWith(c + '-'));
const ca = async (n, fn) => { if (!want(n)) return; try { ok(n, (await fn()) || ''); } catch (e) { bad(n, String(e && e.message || e).split('\n').slice(0, 6).join(' | ')); } };
const assert = (c, m) => { if (!c) throw new Error(m); };
const gitC = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const SRC = readFileSync(WF, 'utf8');
const INVOKED = '2026-09-26T01:16:19Z';
const SHA = 'f'.repeat(40);
// Chạy bộ chấm thật với tác tử giả: tra[cmd] = kết quả tác tử machine; uiTra[id] = kết quả tác tử ui.
async function cham({ evals, suite = [], tra = {}, uiTra = {}, prov, invokedSha = SHA, src } = {}) {
  const calls = [];
  const res = (await runWorkflow(WF, {
    slug: 'demo', round: 1, riskTier: 'T2', evals, suiteCommands: suite, diffBase: 'main', repoRoot: '/repo',
    personasPath: '/p', templatePath: '/t', invokedAt: INVOKED, ...(invokedSha ? { invokedSha } : {}),
  }, c => {
    calls.push(c);
    const l = c.label;
    if (l.startsWith('machine:')) { const cmd = l.slice(8).replace(/#\d+$/, ''); const k = Object.keys(tra).find(x => x.slice(0, 40) === cmd); return typeof tra[k] === 'function' ? tra[k](c) : (tra[k] || { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false }); }
    if (l.startsWith('ui:')) return uiTra[l.slice(3)] || null;
    if (l.startsWith('review:')) return { findings: [] };
    if (l === 'capture:provenance') return prov || { bypass_used: false, enforcement_mode: 'strict', verified_commit: SHA };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  }, src)).result;
  return { res, calls, dong: res.runLog.map(x => JSON.parse(x)) };
}
// Kho git do code sinh cho s4-args, sổ chạy = ĐÚNG sổ bộ chấm vừa sinh (khuôn khoS4 của htkd).
function s4(runLog) {
  const d = mkdtempSync(path.join(TMP, 'k-'));
  const ws = path.join(d, '_acceptance', 'demo');
  mkdirSync(ws, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  gitC(d, 'config', 'user.email', 't@t.t'); gitC(d, 'config', 'user.name', 'T');
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    cli: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.script.cli\n');
  writeFileSync(path.join(ws, 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n');
  writeFileSync(path.join(ws, 'evals.yaml'), 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.cli\n    expected: x\n');
  writeFileSync(path.join(d, 'README.md'), 'demo\n');
  gitC(d, 'add', '-A'); gitC(d, 'commit', '-qm', 'goc'); gitC(d, 'checkout', '-qb', 'vong-nay');
  writeFileSync(path.join(d, 'src-demo.js'), 'x\n');
  writeFileSync(path.join(ws, 'evidence-report.md'), '---\nschema_version: 1\nfeature_slug: demo\nverdict: BLOCKED\n---\n\n# Evidence Report: demo\n\n## Iterations\n\nRound 1 — chấm.\n');
  writeFileSync(path.join(ws, 'run-log.jsonl'), runLog.join('\n') + '\n');
  gitC(d, 'add', '-A'); gitC(d, 'commit', '-qm', 'vat');
  const out = path.join(d, 'args.json');
  const r = spawnSync(process.execPath, [S4ARGS, '--slug', 'demo', '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main', '--no-carry'], { encoding: 'utf8' });
  return { rc: r.status, err: r.stderr || '', round: r.status === 0 ? JSON.parse(readFileSync(out, 'utf8')).round : null };
}
const canh = (res, src) => (src ? src : NCG).canhGay({ runLogText: res.runLog.join('\n'), verdict: res.verdict, nguon: NCG.NGUON });
const EV = [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'cmd-1', ref: 'config:executors.script.cli', expected: 'x' }];
const SUITE = 'bun run test';
const LY_DO_CRM = {
  r2: 'output was cut mid-execution — test suite did not complete. Tool truncated the output while tests were still running in @crm/validation package.',
  r3: "Output bị công cụ cắt giữa chừng trước dòng tổng kết cuối cùng. Dòng cuối cùng hiển thị là '(pass) permittedEvidenceKind > buckets anything else / (pass) permitted(' không hoàn thiện, không có tóm tắt kết quả chung (expected pattern: 'Ran N tests...'). Lệnh bun run test không chạy xong.",
};

// ── (ca của Task A1…A5 nối vào dưới) ──

rmSync(TMP, { recursive: true, force: true });
console.log(`ckdl-cham: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
```

### Task A1: B12 nhập + B12+ (AC-3, AC-4) — phục vụ E3, E4 · independent: false (đầu làn A)

**Files:** Create `tests/scripts/ckdl-cham.test.mjs` (khung trên) · Delete `tests/scripts/suite-bi-cat.test.mjs` · Modify `lib/nhan-canh-gay.cjs:57-66` (`nhanLyDo`).

**Interfaces:** Produces `nhanLyDo(reason, laEval, nguon)`: lý do không rỗng → `'mu'` cho CẢ dòng eval lẫn SUITE; rỗng → null.

- [ ] **Step 1: ca (đỏ trước sửa ở CK-AC4 hàng lý-do-tự-do):**

```js
for (const [k, lyDo] of Object.entries(LY_DO_CRM)) {
  await ca(`CK-AC3-${k}`, async () => {
    const { res, dong } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, killedByTool: true, reason: lyDo, outputTail: '(pass) permitted(', runId: '' } } });
    const s = dong.find(o => o.cmd === SUITE && String(o.evalId).startsWith('SUITE-'));
    assert(res.verdict === 'BLOCKED', `verdict ${res.verdict}`);
    assert(s && s.cannot_run === true && s.exit_code === null && s.killed_by_tool === true && s.reason === lyDo, `dong SUITE: ${JSON.stringify(s)}`);
    const c = canh(res);
    assert(c.muc.length === 1 && c.muc[0].nhan === 'mu' && c.trangThai === 'mo', `canhGay ${JSON.stringify(c)}`);
    const x = s4(res.runLog);
    assert(x.round === 1 && x.err.includes('thử lại CÙNG round'), `s4 round ${x.round}: ${x.err.split('\n').pop()}`);
    return '(killed_by_tool · mu · round 1)';
  });
}
await ca('CK-AC3-dot-bien', async () => {
  const KIM = /\.\.\.\(m\.cannotRun && m\.killedByTool \? \{ killed_by_tool: true \} : \{\}\),/g;
  const n = (SRC.match(KIM) || []).length;
  assert(n === 2, `kim killed_by_tool khop ${n} lan (khai 2)`);
  const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, killedByTool: true, reason: LY_DO_CRM.r3, outputTail: '', runId: '' } }, src: SRC.replace(KIM, '') });
  // Sau AC-4 nhãn không phụ thuộc cờ (sổ S2 «AC-3 chiều đỏ đo sự vắng trường») — ghim TRƯỜNG, không ghim trạng thái.
  const sDong = res.runLog.map(l => JSON.parse(l)).find(o => String(o.evalId).startsWith('SUITE-'));
  assert(!('killed_by_tool' in sDong), 'ban sao van ghi killed_by_tool tren dong SUITE');
  const r2 = await cham({ evals: EV, tra: { 'cmd-1': { exitCode: 1, cannotRun: true, killedByTool: true, reason: '', outputTail: '', runId: '' } }, src: SRC.replace(KIM, '') });
  const e = r2.dong.find(o => o.evalId === 'E1');
  assert(!('killed_by_tool' in e), 'ban sao van ghi killed_by_tool');
  return '(2 cho ghi · bo di → dong eval mat co)';
});
await ca('CK-AC4', async () => {
  const hang = [];
  { const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, reason: 'thieu env DATABASE_URL — service local chua chay', outputTail: '', runId: '' } } });
    const c = canh(res); if (!(c.muc[0].nhan === 'mu' && c.trangThai === 'mo' && s4(res.runLog).round === 1)) hang.push(`ly do tu do: ${c.trangThai}`); }
  { const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, reason: 'x', outputTail: '', runId: '' } } });
    const rl = res.runLog.map(l => { const o = JSON.parse(l); if (String(o.evalId).startsWith('SUITE-')) delete o.reason; return JSON.stringify(o); });
    const c = NCG.canhGay({ runLogText: rl.join('\n'), verdict: 'BLOCKED', nguon: NCG.NGUON }); if (!(c.muc[0].nhan === null && c.trangThai === 'khoa')) hang.push(`ly do rong: ${c.trangThai}`); }
  { const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: false, outputTail: '1 fail\n__EXIT=1', runId: '' } } });
    if (!(res.verdict === 'REJECT' && s4(res.runLog).round === 2)) hang.push(`exit 1 that: ${res.verdict}`); }
  { const LINT = 'bunx turbo run lint --force';
    const { res } = await cham({ evals: EV, suite: [SUITE, LINT], tra: { [SUITE]: { exitCode: 1, cannotRun: true, killedByTool: true, reason: LY_DO_CRM.r2, outputTail: '', runId: '' }, [LINT]: { exitCode: 1, cannotRun: false, outputTail: 'lint\n__EXIT=1', runId: '' } } });
    const c = canh(res); if (!(c.muc.map(m => m.nhan).sort().join(',') === 'mu,vat' && c.trangThai === 'khoa' && s4(res.runLog).round === 2)) hang.push(`tron: ${JSON.stringify(c.muc.map(m => m.nhan))}`); }
  assert(!hang.length, hang.join(' · '));
  return '(4 hang)';
});
await ca('CK-AC4-dot-bien', async () => {
  const lsrc = readFileSync(LIB, 'utf8');
  const KIM = "  return 'mu';\n}";
  assert(lsrc.split(KIM).length - 1 === 1, 'kim nhanLyDo khong khop dung 1 lan');
  const sao = path.join(TMP, 'ncg-sao.cjs'); writeFileSync(sao, lsrc.replace(KIM, "  return laEval ? 'mu' : null;\n}").replace(/__filename/g, JSON.stringify(LIB)));
  const B = require(sao);
  const { res } = await cham({ evals: EV, suite: [SUITE], tra: { [SUITE]: { exitCode: 1, cannotRun: true, reason: 'thieu env', outputTail: '', runId: '' } } });
  const c = B.canhGay({ runLogText: res.runLog.join('\n'), verdict: res.verdict, nguon: B.NGUON });
  assert(c.trangThai === 'khoa', `ban sao khoi phuc nhanh SUITE→null ma hang ly do tu do van ${c.trangThai}`);
  return '(hang ly do tu do → khoa)';
});
```

- [ ] **Step 2:** `node tests/scripts/ckdl-cham.test.mjs` → FAIL ở `CK-AC4` («ly do tu do: khoa»), `CK-AC4-dot-bien` (kim chưa có).
- [ ] **Step 3: sửa `nhanLyDo`** — dòng cuối `return laEval ? 'mu' : null;` thành `return 'mu';` (giữ nhánh `if (!r) return null;` phía trên cho lý do rỗng); cập nhật chú thích đầu hàm: «lý do không rỗng → mu cho cả dòng eval lẫn SUITE (B12+, cham-khong-tu-dot-luot AC-4)».
- [ ] **Step 4:** `node tests/scripts/ckdl-cham.test.mjs` → 5 PASS · `git rm tests/scripts/suite-bi-cat.test.mjs` · `node tests/scripts/htkd.test.mjs` → 0 failed (HT-AC4 ma trận vẫn đúng: hàng mu dùng câu cố định).
- [ ] **Step 5:** Commit `feat(lib): dòng SUITE không chạy được có lý do ra nhãn mu như dòng eval (AC-3, AC-4)`.

### Task A2: Khung bọc EXIT-MARK (AC-1) — phục vụ E1 · independent: false

**Files:** Modify `feature-loop/workflows/acceptance-verify.js` (sau khối `INFRA-EXIT-CODES` ≈ dòng 631; `agentCuaLenh` ≈ 808) · Test `ckdl-cham.test.mjs`.

**Interfaces:** Produces hằng `EXIT_MARK = '__EXIT='` và `BOC_LENH(lenh) → string` trong khối marker `EXIT-MARK`; Task A3 dùng `EXIT_MARK`.

- [ ] **Step 1: ca:**

```js
const khoiMark = () => { const m = SRC.match(/\/\/ <<<EXIT-MARK\n([\s\S]*?)\/\/ EXIT-MARK>>>/g); assert(m && m.length === 1, `khoi EXIT-MARK khop ${m ? m.length : 0} lan`); return m[0]; };
const bocTu = src => { const k = src.match(/\/\/ <<<EXIT-MARK\n([\s\S]*?)\/\/ EXIT-MARK>>>/)[1]; return new Function(`${k}; return BOC_LENH;`)(); };
const chayBoc = (boc, lenh) => { const r = spawnSync('bash', ['-c', boc(lenh)], { encoding: 'buffer', maxBuffer: 1 << 26 }); return { buf: r.stdout, txt: r.stdout.toString('utf8') }; };
await ca('CK-AC1', async () => {
  khoiMark();
  const tra = { 'cmd-1': { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false }, [SUITE]: { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: '', cannotRun: false } };
  const moi = await cham({ evals: EV, suite: [SUITE], tra });
  const dongNhat = SRC.replace(/(\/\/ <<<EXIT-MARK\n)[\s\S]*?(\/\/ EXIT-MARK>>>)/, "$1const EXIT_MARK = '__EXIT='\nconst BOC_LENH = (lenh) => lenh\n$2");
  const cu = await cham({ evals: EV, suite: [SUITE], tra, src: dongNhat });
  const mach = x => x.calls.filter(c => c.label.startsWith('machine:'));
  assert(mach(cu).length === 2, `doi chung: ${mach(cu).length} tac tu machine (khai 2)`);
  const boc = bocTu(SRC);
  for (const c of mach(moi)) { const cmd = c.label.startsWith('machine:cmd-1') ? 'cmd-1' : SUITE; assert(c.prompt.includes(boc(`cd "/repo" || exit 97 && ${cmd}`)), `prompt ${c.label} thieu khung boc`); }
  const khoa = x => JSON.stringify({ l: mach(x).map(c => c.label).sort(), r: x.dong.filter(o => o.evalId).map(o => [o.evalId, o.run_id, o.cmd]).sort() });
  assert(khoa(moi) === khoa(cu), `nhan/run_id/cmd lech: ${khoa(moi)} ≠ ${khoa(cu)}`);
  return '(khung trong prompt · khoa bang nhau)';
});
await ca('CK-AC1-khung', async () => {
  const boc = bocTu(SRC);
  const d = mkdtempSync(path.join(TMP, 'boc-'));
  const MA = [['true', 0], ['false', 1], ['exit 3 # chu thich', 3], ['khong-co-lenh-nay-xyz', 127], [`cd "${path.join(d, 'vang')}" || exit 97 && true`, 97]];
  const sai = MA.map(([l, m]) => { const t = chayBoc(boc, l).txt.trimEnd().split('\n').pop(); return t === `__EXIT=${m}` ? null : `${l} → ${t}`; }).filter(Boolean);
  assert(sai.length === 0 && MA.length === 5, sai.join(' · '));
  const to = chayBoc(boc, `node -e 'process.stdout.write("x".repeat(76000))'`);
  const vi = chayBoc(boc, `node -e 'for(let i=0;i<40;i++)console.log("Đường dẫn tiếng Việt có dấu ".repeat(11))'`);
  for (const [ten, o] of [['ascii', to], ['tieng-viet', vi]]) {
    assert(o.buf.length <= 8000, `dau ra vuot tran: ${o.buf.length} (${ten})`);
    assert(/^__EXIT=0\s*$/m.test(o.txt), `mat dau __EXIT (${ten})`);
  }
  return `(5 ma · ${to.buf.length}B · ${vi.buf.length}B)`;
});
await ca('CK-AC1-dot-bien', async () => {
  const k = khoiMark();
  const d1 = k.replace(/ \| tail -c 6000/, '');
  assert(d1 !== k, 'kim tail -c khong khop');
  const o = chayBoc(bocTu(SRC.replace(k, d1)), `node -e 'for(let i=0;i<40;i++)console.log("Đường dẫn tiếng Việt có dấu ".repeat(11))'`);
  assert(o.buf.length > 8000, `ban sao bo gioi han ma dau ra van ${o.buf.length}B — phep do khong do`);
  const d2 = k.replace(/; printf [^;]*EXIT_MARK[^;]*;/, ';');
  assert(d2 !== k, 'kim printf khong khop');
  const o2 = chayBoc(bocTu(SRC.replace(k, d2)), 'true');
  assert(!/__EXIT=/.test(o2.txt), 'ban sao bo printf ma van co dau');
  return '(dau ra vuot tran · mat dau __EXIT)';
});
```

- [ ] **Step 2:** chạy → FAIL «khoi EXIT-MARK khop 0 lan».
- [ ] **Step 3: sửa** — thêm ngay sau `// INFRA-EXIT-CODES>>>`:

```js
// Khung bọc lệnh máy (cham-khong-tu-dot-luot AC-1): mã thoát là VẬT máy đọc, không phải điều
// tác tử suy từ chữ in ra (E21 crm, 26/09). Đầu ra ghi trọn ra tệp tạm; chỉ ĐUÔI (≤ 6000 byte)
// và một dòng dấu đi vào tool result, nên harness không cất đầu ra ra tệp (đo 27/09: 74 KB bị
// cất, preview 2 KB). Xuống dòng trước `)` để `#`/`exit` trong lệnh không nuốt dấu. Chỉ BỌC ở
// tầng prompt — chuỗi `cmd` là khoá của dedupe/carry/SUITE/run_id, không đổi.
// <<<EXIT-MARK
const EXIT_MARK = '__EXIT='
const BOC_LENH = (lenh) => `F=$(mktemp); ( ${lenh}\n) > "$F" 2>&1; rc=$?; tail -n 30 "$F" | cut -c1-240 | tail -c 6000; printf '\\n${EXIT_MARK}%s\\n' "$rc"; rm -f "$F"`
// EXIT-MARK>>>
```

và trong `agentCuaLenh` thay đoạn `\n\n  ${CD_GUARD(`"${args.repoRoot}"`)} && ${cmd}\n\n` bằng `\n\n${BOC_LENH(`${CD_GUARD(`"${args.repoRoot}"`)} && ${cmd}`)}\n\n`, và câu «Capture TRUNG THUC: exit code that, ~10 dong output cuoi…» thành «Capture TRUNG THUC: outputTail = NGUYEN VAN phan duoi tool result, PHAI giu dong cuoi `${EXIT_MARK}<n>`; exitCode = so <n> cua dong do (khong suy tu chu); run_id neu stdout co in…».
- [ ] **Step 4:** chạy ckdl-cham → PASS 3 ca mới · `bash tests/workflows/run-tests.sh` → 0 failed (W25 rút dòng luật vẫn có mặt).
- [ ] **Step 5:** Commit `feat(bo-cham): khung bọc lệnh máy in dấu __EXIT= và giới hạn đầu ra theo byte (AC-1)`.

### Task A3: Đọc dấu theo bảng tám hàng (AC-2) — phục vụ E2 · independent: false

**Files:** Modify `acceptance-verify.js` (trước `normKill` ≈ dòng 875; vòng `runsByCmd` ≈ 897) · Test `ckdl-cham.test.mjs`.

**Interfaces:** Consumes `EXIT_MARK` (A2). Produces `rutDau(outputTail) → number|null`, `normDau(r) → r'`; `EXIT_UNREAD_REASON = 'ma thoat khong doc duoc (thieu dong __EXIT=) — khong tinh PASS'`.

- [ ] **Step 1: ca:**

```js
const HANG = [
  // [ten, ket qua tac tu, ky vong: {verdict, cr (cannot_run tren dong so), kbt, exit}]
  ['1', { exitCode: 1, cannotRun: false, outputTail: 'VIOLATION … verdict=REJECT\n0 hong\n__EXIT=0' }, { verdict: 'PASS-FAMILY', exit: 0 }],
  ['2', { exitCode: 1, cannotRun: true, killedByTool: true, reason: 'bi cat', outputTail: 'x\n__EXIT=3' }, { verdict: 'REJECT', exit: 3, cr: false, kbt: false }],
  ['3', { exitCode: 1, cannotRun: true, killedByTool: true, reason: 'bi cat', outputTail: 'x' }, { verdict: 'BLOCKED', cr: true, kbt: true }],
  ['4', { exitCode: 1, cannotRun: true, reason: 'thieu env', outputTail: 'x\n__EXIT=0' }, { verdict: 'PASS-FAMILY', exit: 0 }],
  ['5', { exitCode: 1, cannotRun: true, reason: 'thieu env', outputTail: 'x\n__EXIT=1' }, { verdict: 'BLOCKED', cr: true }],
  ['6', { exitCode: 1, cannotRun: false, outputTail: 'x' }, { verdict: 'REJECT', exit: 1 }],
  ['7', { exitCode: 0, cannotRun: false, outputTail: 'x' }, { verdict: 'BLOCKED', cr: true, lyDo: 'ma thoat khong doc duoc' }],
  ['8', { exitCode: 0, cannotRun: false, outputTail: 'x\n__EXIT=1' }, { verdict: 'REJECT', exit: 1 }],
];
const chamHang = async (h, src) => {
  const { res, dong } = await cham({ evals: EV, tra: { 'cmd-1': { runId: '', ...h[1] } }, src });
  const e = dong.find(o => o.evalId === 'E1');
  const k = h[2]; const loi = [];
  const pf = /^(PASS|PENDING-JUDGMENT)$/.test(res.verdict);
  if (k.verdict === 'PASS-FAMILY' ? !pf : res.verdict !== k.verdict) loi.push(`verdict ${res.verdict}`);
  if ('exit' in k && e.exit_code !== k.exit) loi.push(`exit ${e.exit_code}`);
  if ('cr' in k && !!e.cannot_run !== k.cr) loi.push(`cannot_run ${e.cannot_run}`);
  if ('kbt' in k && !!e.killed_by_tool !== k.kbt) loi.push(`killed_by_tool ${e.killed_by_tool}`);
  if (k.lyDo && !String(e.reason || '').includes(k.lyDo)) loi.push(`reason ${e.reason}`);
  return loi.length ? `hang ${h[0]}: ${loi.join(', ')}` : null;
};
await ca('CK-AC2', async () => {
  const sai = (await Promise.all(HANG.map(h => chamHang(h)))).filter(Boolean);
  assert(HANG.length === 8, `so hang ${HANG.length} (khai 8)`);
  assert(!sai.length, sai.join(' · '));
  // Review Focus 2 + 3: dấu giả giữa đầu ra, variance-N
  const { dong } = await cham({ evals: EV, tra: { 'cmd-1': { exitCode: 0, cannotRun: false, outputTail: '__EXIT=0\nfail\n__EXIT=1', runId: '' } } });
  assert(dong.find(o => o.evalId === 'E1').exit_code === 1, 'dau cuoi phai thang dau gia');
  const EVN = [{ ...EV[0], runs: 2 }];
  let n = 0; const r2 = await cham({ evals: EVN, tra: { 'cmd-1': () => ({ exitCode: n++ === 0 ? 1 : 0, cannotRun: false, outputTail: 'x\n__EXIT=0', runId: '' }) } });
  const e2 = r2.dong.find(o => o.evalId === 'E1');
  assert(e2.exit_code === 0 && !e2.cannot_run, `variance-N: ${JSON.stringify(e2)}`);
  return '(8 hang · dau cuoi · variance-N)';
});
await ca('CK-AC2-ui', async () => {
  const EVU = [{ id: 'E5', criterion: 'AC-5', executor: 'ui-check', expected: 'trang len', steps: ['mo trang'] }];
  const { res } = await cham({ evals: EVU, uiTra: { E5: { exitCode: 0, cannotRun: false, outputTail: 'assert ok', runId: '', screenshotPath: '/repo/_acceptance/demo/evidence/E5-step1.png', observed: 'thay header dung nhu expected, nut dang nhap hien', networkObserved: 'n-a (driver)' } } });
  assert(/^(PASS|PENDING-JUDGMENT)$/.test(res.verdict), `ui khai 0 khong dau ra ${res.verdict}`);
  return '(lane ui khong bi cham)';
});
await ca('CK-AC2-dot-bien', async () => {
  const KIM = '.filter(Boolean).map(normDau).map(normKill)';
  assert(SRC.split(KIM).length - 1 === 1, 'kim normDau khong khop dung 1 lan');
  const go = SRC.replace(KIM, '.filter(Boolean).map(normKill)');
  const lat = (await Promise.all(HANG.map(h => chamHang(h, go)))).filter(Boolean).map(s => s.split(':')[0]);
  for (const h of ['hang 1', 'hang 2', 'hang 8']) assert(lat.includes(h), `ban sao go doc dau: ${h} khong lat (lat: ${lat.join(',')})`);
  const KIM2 = "if (r.cannotRun !== true && r.exitCode !== 0 && dau == null)";
  assert(SRC.split('const normDau').length - 1 === 1, 'thieu normDau');
  const lech = SRC.replace(/(const normDau = r => \{\n)/, "$1  if (r && r.exitCode === 0 && r.cannotRun !== true) return r\n");
  const lat2 = (await Promise.all([HANG[7]].map(h => chamHang(h, lech)))).filter(Boolean);
  assert(lat2.length === 1 && lat2[0].startsWith('hang 8'), `ban sao «dau chi ap khi khai ≠ 0»: hang 8 khong lat`);
  return '(go doc dau → 1,2,8 · lech → 8)';
});
```

- [ ] **Step 2:** chạy → FAIL «hang 1: …, hang 2: …, hang 7: …, hang 8: …».
- [ ] **Step 3: sửa** — trước `const TOOL_KILL_REASON`:

```js
// Đọc dấu (cham-khong-tu-dot-luot AC-2, design §2 bảng tám hàng). Chỉ lane machine.
// Dấu có mặt = lệnh ĐÃ chạy xong → mã dấu thắng lời khai, TRỪ ca tác tử khai hạ tầng khác
// (thiếu env…) mà dấu ≠ 0: giữ hạ tầng — «thiếu env thoát 1» không được thành REJECT đốt round.
// Không dấu: khai ≠ 0 giữ (97/127 đi tiếp normInfra); khai 0 không có căn cứ → không PASS.
const EXIT_UNREAD_REASON = 'ma thoat khong doc duoc (thieu dong __EXIT=) — khong tinh PASS'
const rutDau = tail => { const all = [...String(tail || '').matchAll(new RegExp(`^${EXIT_MARK}(\\d+)\\s*$`, 'gm'))]; return all.length ? Number(all[all.length - 1][1]) : null }
const normDau = r => {
  if (!r) return r
  const dau = rutDau(r.outputTail)
  if (dau != null) {
    if (r.cannotRun === true && r.killedByTool !== true && dau !== 0) return r
    const { killedByTool, ...rest } = r
    return { ...rest, cannotRun: false, exitCode: dau, reason: r.cannotRun ? '' : r.reason }
  }
  if (r.cannotRun === true) return r
  if (r.exitCode === 0) return { ...r, cannotRun: true, reason: EXIT_UNREAD_REASON }
  return r
}
```

và vòng gộp: `for (const r of (machineRaw || []).filter(Boolean).map(normDau).map(normKill).map(normInfra))` (lane ui giữ nguyên `.map(normKill).map(normInfra)`).
- [ ] **Step 4:** chạy ckdl-cham → PASS · `bash tests/workflows/run-tests.sh` → 0 failed. Ca cũ có tác tử giả lane machine trả `exitCode: 0` KHÔNG kèm dấu sẽ lật sang BLOCKED — đo 27/09: 31 chỗ trong 10 tệp (`grep -rhoE "exitCode: ?0[,} ]" tests`, nhiều nhất `tests/workflows/acceptance-verify.test.mjs` 17, `tests/scripts/ntr-the-canh-gay.test.mjs` 3). Cập nhật fixture của CHÍNH các ca ấy thêm `\n__EXIT=0` vào `outputTail` (không đổi kỳ vọng; tác tử giả lane ui KHÔNG sửa), ghi danh sách tệp vào thân commit. Ca nào kỳ vọng đổi thật (không chỉ thêm dấu) → DỪNG, ghi sổ `fix`, không tự hạ kỳ vọng.
- [ ] **Step 5:** Commit `feat(bo-cham): mã thoát rút từ dấu theo bảng tám hàng, thiếu dấu mà khai 0 không PASS (AC-2)`.

### Task A4: verified_commit từ invokedSha (AC-5) — phục vụ E5 · independent: false

**Files:** Modify `acceptance-verify.js` ≈ dòng 1555 (`verifiedCommit`).

- [ ] **Step 1: ca:**

```js
const provPrompt = x => (x.calls.find(c => c.label === 'synthesize:report') || {}).prompt || '';
await ca('CK-AC5', async () => {
  const KHAC = 'a'.repeat(40);
  const a = await cham({ evals: EV, prov: { bypass_used: false, enforcement_mode: 'strict', verified_commit: KHAC } });
  assert(provPrompt(a).includes(`verified_commit: ${SHA}`) && !provPrompt(a).includes(KHAC), 'invokedSha phai thang sha tac tu');
  const b = await cham({ evals: EV, invokedSha: '', prov: { bypass_used: false, enforcement_mode: 'strict', verified_commit: KHAC } });
  assert(provPrompt(b).includes(`verified_commit: ${KHAC}`), 'khong invokedSha → sha tac tu (duong cu)');
  const c = await cham({ evals: EV, invokedSha: '', prov: { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'rac!' } });
  assert(!/verified_commit: /.test(provPrompt(c).split('PROVENANCE')[1] || ''), 'rac → bo truong');
  return '(invokedSha thang · duong cu · rac bo)';
});
await ca('CK-AC5-dot-bien', async () => {
  const KIM = 'const verifiedCommit = hopLeSha(args.invokedSha) || hopLeSha(prov && prov.verified_commit)';
  assert(SRC.split(KIM).length - 1 === 1, 'kim verifiedCommit khong khop');
  const d = SRC.replace(KIM, 'const verifiedCommit = hopLeSha(prov && prov.verified_commit) || hopLeSha(args.invokedSha)');
  const KHAC = 'a'.repeat(40);
  const x = await cham({ evals: EV, prov: { bypass_used: false, enforcement_mode: 'strict', verified_commit: KHAC }, src: d });
  assert(provPrompt(x).includes(KHAC), 'sha tac tu lot vao bao cao — ban sao phai lo');
  return '(dao uu tien → sha tac tu lot vao bao cao)';
});
```

- [ ] **Step 2:** chạy → FAIL «invokedSha phai thang sha tac tu».
- [ ] **Step 3: sửa** — thay ba dòng `const verifiedCommit = … : ''` bằng:

```js
// cham-khong-tu-dot-luot AC-5: mã commit do MÁY đưa (s4-args, git rev-parse HEAD lúc gọi) thắng
// giá trị tác tử khai (vòng 3 lượt 4 OKR: tác tử trả ec2849e5, không trùng commit nào). Không
// invokedSha → đường cũ (giá trị tác tử qua bộ lọc hình dạng). Không phát hiện cây trôi (descope d-…-4).
const hopLeSha = v => (/^[0-9a-f]{7,40}$/i.test(String(v || '').trim()) ? String(v).trim().toLowerCase() : '')
const verifiedCommit = hopLeSha(args.invokedSha) || hopLeSha(prov && prov.verified_commit)
```

- [ ] **Step 4:** ckdl-cham PASS · `bash tests/workflows/run-tests.sh` 0 failed (W03/W11 không truyền invokedSha hoặc truyền trùng — nếu ca nào truyền invokedSha khác verified_commit của tác tử giả, cập nhật kỳ vọng ca đó sang invokedSha và ghi vào commit).
- [ ] **Step 5:** Commit `feat(bo-cham): verified_commit lấy từ invokedSha của máy (AC-5)`.

### Task A5: Ảnh ui neo hồ sơ (AC-9) — phục vụ E9 · independent: false

**Files:** Modify `acceptance-verify.js` prompt ui ≈ dòng 836, 838; ánh xạ `uiRaw` ≈ dòng 930.

- [ ] **Step 1: ca:**

```js
const EVU = [{ id: 'E5', criterion: 'AC-5', executor: 'ui-check', expected: 'trang len', steps: ['mo trang'] }];
const UI_OK = p => ({ exitCode: 0, cannotRun: false, outputTail: 'ok', runId: '', screenshotPath: p, observed: 'thay header dung nhu expected, nut dang nhap hien ro', networkObserved: 'n-a (driver)' });
await ca('CK-AC9', async () => {
  const x = await cham({ evals: EVU, uiTra: { E5: UI_OK('/repo/_acceptance/demo/evidence/E5-step1.png') } });
  const p = (x.calls.find(c => c.label === 'ui:E5') || {}).prompt || '';
  const tro = (p.match(/(?<!_acceptance\/demo\/)\bevidence\//g) || []).length;
  const coTien = (p.match(/\/repo\/_acceptance\/demo\/evidence\//g) || []).length;
  assert(tro === 0 && coTien >= 2, `evidence/ tro: ${tro}, co tien to: ${coTien}`);
  assert(provPrompt(x).includes('"screenshotPath":"evidence/E5-step1.png"'), 'bao cao phai mang duong tuong doi');
  const y = await cham({ evals: EVU, uiTra: { E5: UI_OK('/tmp/khac/E5.png') } });
  assert(provPrompt(y).includes('"screenshotPath":"/tmp/khac/E5.png"'), 'duong ngoai ho so phai giu nguyen');
  return `(${coTien} cho co tien to · chuan hoa · ngoai ho so giu)`;
});
await ca('CK-AC9-dot-bien', async () => {
  const KIM = '${EVD}/';
  const n = SRC.split(KIM).length - 1;
  assert(n >= 2, `kim EVD khop ${n} lan`);
  const x = await cham({ evals: EVU, uiTra: { E5: UI_OK('/repo/_acceptance/demo/evidence/E5-step1.png') }, src: SRC.split(KIM).join('evidence/') });
  const p = (x.calls.find(c => c.label === 'ui:E5') || {}).prompt || '';
  const tro = (p.match(/(?<!_acceptance\/demo\/)\bevidence\//g) || []).length;
  assert(tro >= 2, `ban sao quay ve duong tuong doi ma evidence/ tro: ${tro}`);
  return `(evidence/ tro: ${tro})`;
});
```

- [ ] **Step 2:** chạy → FAIL «evidence/ tro: …».
- [ ] **Step 3: sửa** — trong hàm dựng prompt ui thêm `const EVD = \`${args.repoRoot}/_acceptance/${args.slug}/evidence\`` (đặt trước `parallel(uiEvals.map…)`), thay mọi `evidence/${e.id}` trong prompt ui bằng `${EVD}/${e.id}`, thêm câu «Khai screenshotPath bang duong TUYET DOI da luu»; ánh xạ `uiRaw`:

```js
const EVD_PREFIX = `${args.repoRoot}/_acceptance/${args.slug}/`
const neoAnh = r => (r && typeof r.screenshotPath === 'string' && r.screenshotPath.startsWith(EVD_PREFIX + 'evidence/'))
  ? { ...r, screenshotPath: r.screenshotPath.slice(EVD_PREFIX.length) } : r
machine.push(...(uiRaw || []).filter(Boolean).map(neoAnh).map(normKill).map(normInfra).map(r => ({ ...r, runs: 1, passes: !r.cannotRun && r.exitCode === 0 ? 1 : 0, variance: false })))
```

- [ ] **Step 4:** ckdl-cham PASS · tests/workflows 0 failed (ca ui cũ kiểm `evidence/E…` tương đối trong prompt → cập nhật chuỗi mong đợi sang tiền tố tuyệt đối, ghi vào commit).
- [ ] **Step 5:** Commit `feat(bo-cham): ảnh ui lưu dưới hồ sơ, báo cáo mang đường tương đối (AC-9)`.

---

## LÀN B — thẻ (independent: true · tệp: `scripts/gate-card.js`, `commands/acceptance-card.md`, `tests/scripts/ckdl-the.test.mjs`)

Khung tệp `tests/scripts/ckdl-the.test.mjs` — header, `ca/assert/want` như làn A (tên tiền tố `ckdl-the`), cộng:

```js
import { cpSync } from 'node:fs';
import { GC, SRC, mkWs, card, extract, G1 } from './gate-fixture.mjs';
const FL_SKILL = path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
// Bản sao gate-card để phá thử: chép TRỌN scripts/ + lib/ (P150), rồi thay nguồn gate-card.
const banSao = (fn) => { const s = mkdtempSync(path.join(TMP, 'gc-')); cpSync(path.join(KIT, 'scripts'), path.join(s, 'scripts'), { recursive: true }); cpSync(path.join(KIT, 'lib'), path.join(s, 'lib'), { recursive: true }); writeFileSync(path.join(s, 'scripts', 'gate-card.js'), fn(SRC)); return path.join(s, 'scripts', 'gate-card.js'); };
const chayGc = (gc, root, slug, extra = []) => spawnSync('node', [gc, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });
const OOS8 = Array.from({ length: 8 }, (_, i) => `- Mục bỏ ngoài số ${i + 1} — lý do ${i + 1}`).join('\n');
const hoSo = (probe, oos = OOS8) => { const f = G1(probe); f['contract.md'] = f['contract.md'].replace(/## Out of scope[\s\S]*?(?=\n## |$)/, `## Out of scope\n\n${oos}\n`); return f; };
```

(`G1(probe)` trả bộ tệp hồ sơ Cổng 1 của `gate-fixture.mjs`; `mkWs(slug, files)` dựng kho tạm và trả gốc kho.)

### Task B1: Mục «không làm» đủ từng dòng, id OOS-n (AC-6) — phục vụ E6 · independent: false (đầu làn B)

**Files:** Modify `scripts/gate-card.js` ≈ 366 (oos), 739 (extract `scope`), 742-756 (render), khối marker mới `CARD-PLAIN-SCOPE`; Modify `commands/acceptance-card.md` ≈ 130 (câu `wont_do`).

**Interfaces:** Produces extract `scope: [{id:'OOS-n', text}]`; overlay đọc `wont_do` theo id `OOS-n` HOẶC `AC-n`; cờ `DICH_LAC` = `'dòng dịch không khớp mục nào: '`.

- [ ] **Step 1: ca:**

```js
const liKhong = html => { const m = html.match(/Sẽ KHÔNG làm \/ sẽ chặn<\/div><div class="grp gnot">([\s\S]*?)<\/div>/); return m ? [...m[1].matchAll(/<p class="li">([\s\S]*?)<\/p>/g)].map(x => x[1]) : []; };
await ca('CK-AC6', async () => {
  const r = mkWs('g', hoSo(null));
  const x = extract(r, 'g');
  assert(Array.isArray(x.scope) && x.scope.length === 8 && x.scope.every((s, i) => s.id === `OOS-${i + 1}`), `scope: ${JSON.stringify(x.scope).slice(0, 200)}`);
  const pl = { wont_do: x.scope.map(s => ({ id: s.id, p: `Câu dịch ${s.id}` })) };
  const pf = path.join(r, 'pl.json'); writeFileSync(pf, JSON.stringify(pl));
  const li = liKhong(card(r, 'g', ['--plain', pf]).stdout);
  const thieu = x.scope.filter(s => !li.some(t => t.includes(`Câu dịch ${s.id}`))).map(s => s.id);
  assert(!thieu.length && li.length === 8, `thieu muc ${thieu.join(',')} (li ${li.length})`);
  return '(8 id · 8 cau dich · round-trip)';
});
await ca('CK-AC6-crm', async () => {
  const r = mkWs('g', hoSo(null));
  const pl = { scope_plain: 'Cập nhật trong chat, toàn cảnh và họp tuần…', wont_do: [1, 2, 3, 4, 6].map(n => ({ id: `OOS-${n}`, p: `Dịch crm ${n}` })) };
  const pf = path.join(r, 'pl.json'); writeFileSync(pf, JSON.stringify(pl));
  const html = card(r, 'g', ['--plain', pf]).stdout;
  const li = liKhong(html).filter(t => !t.startsWith('Hoãn/cắt'));
  assert(li.length === 8, `hinh crm: ${li.length} muc (khai 8)`);
  assert([1, 2, 3, 4, 6].every(n => li.some(t => t.includes(`Dịch crm ${n}`))) && [5, 7, 8].every(n => li.some(t => t.includes(`Mục bỏ ngoài số ${n}`))), 'sai chu tung muc');
  assert(!html.includes('dòng dịch không khớp mục nào'), 'hinh crm khong duoc co co');
  return '(8 muc · 5 dich + 3 chu hop dong · 0 co)';
});
await ca('CK-AC6-co-vang', async () => {
  const r = mkWs('g', hoSo(null));
  const pf = path.join(r, 'pl.json');
  writeFileSync(pf, JSON.stringify({ wont_do: [{ id: 'OOS-1', p: 'a' }, { id: 'OOS-99', p: 'b' }, { id: 'AC-99', p: 'c' }] }));
  const h = card(r, 'g', ['--plain', pf]).stdout;
  const co = (h.match(/dòng dịch không khớp mục nào: [^<]*/g) || []);
  assert(co.length === 2 && co.some(c => c.includes('OOS-99')) && co.some(c => c.includes('AC-99')), `co: ${co.join(' | ')}`);
  writeFileSync(pf, JSON.stringify({ wont_do: [{ id: 'OOS-1', p: 'a' }] }));
  assert(!card(r, 'g', ['--plain', pf]).stdout.includes('dòng dịch không khớp mục nào'), 'doi chung: co 0 id la ma van co co');
  return '(2 co · doi chung 0 co)';
});
await ca('CK-AC6-dot-bien', async () => {
  const KIM = "oosItems.map(x => esc(scopeText(x)))";
  assert(SRC.split(KIM).length - 1 === 1, 'kim oosItems khong khop');
  const gc = banSao(s => s.replace(KIM, "(oos.length ? [esc(pl.scope_plain || oos.map(stripMd).join(' · '))] : [])"));
  const r = mkWs('g', hoSo(null));
  const pf = path.join(r, 'pl.json'); writeFileSync(pf, JSON.stringify({ scope_plain: 'tom', wont_do: [] }));
  const li = liKhong(chayGc(gc, r, 'g', ['--plain', pf]).stdout);
  const thieu = Array.from({ length: 8 }, (_, i) => i + 1).filter(n => !li.some(t => t.includes(`Mục bỏ ngoài số ${n}`)));
  assert(thieu.length > 0, 'ban sao gop scope_plain ma du muc — phep do khong do');
  return `(thieu muc OOS-${thieu[0]})`;
});
```

- [ ] **Step 2:** chạy → FAIL (`scope` là mảng chuỗi).
- [ ] **Step 3: sửa gate-card.js:**

```js
// <<<CARD-PLAIN-SCOPE — khuôn phía viết của mục phạm vi (cham-khong-tu-dot-luot AC-6):
// mỗi mục «Out of scope» mang id OOS-<thứ tự 1-based>; bản dịch ghi câu vào khoá wont_do
// với CHÍNH id đó. Bộ đọc: mục có câu dịch dùng câu dịch, không có dùng chữ hợp đồng.
const oosItems = oos.map((t, i) => ({ id: `OOS-${i + 1}`, text: t }));
// CARD-PLAIN-SCOPE>>>
```

(đặt ngay sau `const oos = bullets(...)`). Extract: `scope: oosItems.map(x => ({ id: x.id, text: x.text }))`. Render Cổng 1:

```js
  const scopeText = x => pmap(pl.wont_do, x.id) || stripMd(x.text);
  const idHopLe = new Set([...wontDo.map(x => x.id), ...oosItems.map(x => x.id)]);
  const dichLac = (pl.wont_do || []).map(x => x && x.id).filter(id => id && !idHopLe.has(id));
  const notItems = wontDo.map(x => esc(wontText(x))).concat(pl.scope_plain && oos.length ? ['Hoãn/cắt: ' + esc(pl.scope_plain)] : []).concat(oosItems.map(x => esc(scopeText(x))));
```

và thêm vào khối cờ Cổng 1 (cạnh các `flags.push(['fwarn', …])` ≈ dòng 820): `for (const id of dichLac) flags.push(['fwarn', DICH_LAC + id]);` với `const DICH_LAC = 'dòng dịch không khớp mục nào: ';` khai cạnh các hằng cờ. Xoá `scopePlain` ở render Cổng 1 (dòng 744); dòng 1075 (Cổng 2) giữ nguyên. `commands/acceptance-card.md` dòng 130: «`wont_do[] → {id,p}`: id `AC-n` cho tiêu chí phủ định (starting "Sẽ KHÔNG …"/"Chặn …"), id `OOS-n` cho từng mục phạm vi bỏ ngoài (extract `scope[].id`)»; dòng 154 `scope_plain`: «một câu dẫn tuỳ chọn — KHÔNG thay các mục».
- [ ] **Step 4:** ckdl-the 4 PASS · `node tests/scripts/gate-card-lmcms.test.mjs` 0 failed · `bash tests/plugins/run-tests.sh` 0 failed (P147 khoá overlay đóng giữ nguyên).
- [ ] **Step 5:** Commit `feat(gate-card): mục «không làm» hiện đủ, dịch theo id OOS-n, cờ câu dịch lạc (AC-6)`.

### Task B2: Mọi bảng phản biện theo chữ ký sáu cột (AC-7) — phục vụ E7 · independent: false

**Files:** Modify `scripts/gate-card.js` ≈ 516-528; khối marker mới `GAP-PROBE-HEADER`.

**Interfaces:** Produces hằng `GP_HEADER = '| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |'`, cờ `GP_NGOAI` = `'bảng phản biện ngoài khai báo: '`.

- [ ] **Step 1: ca:**

```js
const CHU_KY = (() => { const m = readFileSync(FL_SKILL, 'utf8').match(/bảng `(\| Sev \| Artifact \|[^`]*\|)`/g); assert(m && m.length === 1, `cau dinh nghia bang trong SKILL khop ${m ? m.length : 0} lan`); return m[0].slice(6, -1); })();
const hangP = (n, tag) => Array.from({ length: n }, (_, i) => `| P${i % 3} | contract | ${tag} ${i + 1} | kb | do | fixed: x |`).join('\n');
const PROBE2 = (tong) => `---\nslug: g\nat: 2026-09-25T15:40:00Z\nverdict: findings\np0: ${tong}\np1: 0\np2: 0\n---\n\n## Findings\n\n${CHU_KY}\n|---|---|---|---|---|---|\n${hangP(5, 'bang1')}\n\n## Soát lại sau Cổng Phạm vi (hai chỗ sửa, 2026-09-25)\n\n${CHU_KY}\n|---|---|---|---|---|---|\n${hangP(5, 'bang2')}\n\n## Khác\n\n| A | B |\n|---|---|\n| la 1 | x |\n| la 2 | y |\n`;
await ca('CK-AC7', async () => {
  assert(SRC.includes(`const GP_HEADER = '${CHU_KY}';`), 'gate-card GP_HEADER lech chu ky SKILL');
  const r = mkWs('g', hoSo(PROBE2(5)));
  const x = extract(r, 'g');
  assert(x.gap_probe.rows.length === 10 && x.gap_probe.rows.some(o => o.summary === 'bang2 5') && !x.gap_probe.rows.some(o => /la \d/.test(o.summary)), `rows ${x.gap_probe.rows.length}`);
  assert(card(r, 'g').stdout.includes('bảng phản biện ngoài khai báo: 10 &gt; 5') || card(r, 'g').stdout.includes('bảng phản biện ngoài khai báo: 10 > 5'), 'thieu co 10 > 5');
  const r2 = mkWs('g', hoSo(PROBE2(10)));
  assert(!card(r2, 'g').stdout.includes('bảng phản biện ngoài khai báo'), 'doi chung tong 10 van co co');
  return '(10 hang · co 10>5 · doi chung 0 co)';
});
await ca('CK-AC7-clean', async () => {
  const P = `---\nslug: g\nat: 2026-09-25T15:40:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n${CHU_KY}\n|---|---|---|---|---|---|\n| — | — | Không còn lỗ đáng kể | — | — | — |\n`;
  const r = mkWs('g', hoSo(P));
  const h = card(r, 'g').stdout;
  assert(!h.includes('bảng phản biện ngoài khai báo'), 'co gia tren ho so clean');
  assert(extract(r, 'g').gap_probe.rows.filter(o => /^P[0-2]$/.test(o.sev)).length === 0, 'clean co hang phat hien');
  return '(0 co · 0 phat hien)';
});
await ca('CK-AC7-dot-bien', async () => {
  const KIM = 'for (const l of probeT.split(/\\r?\\n/))';
  assert(SRC.split(KIM).length - 1 === 1, 'kim quet bang khong khop');
  const gc1 = banSao(s => s.replace(KIM, "for (const l of section(probeT, 'Findings'))"));
  const r = mkWs('g', hoSo(PROBE2(5)));
  const x = JSON.parse(chayGc(gc1, r, 'g', ['--extract']).stdout);
  assert(!x.gap_probe.rows.some(o => o.summary === 'bang2 1'), 'thieu hang bang 2 — ban sao van doc bang 2');
  const KIM2 = "gpRows.filter(r => /^P[0-2]$/.test(r.sev)).length";
  assert(SRC.split(KIM2).length - 1 === 1, 'kim dem phat hien khong khop');
  const gc2 = banSao(s => s.replace(KIM2, 'gpRows.length'));
  const P = `---\nslug: g\nat: x\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n${CHU_KY}\n|---|---|---|---|---|---|\n| — | — | Không còn lỗ đáng kể | — | — | — |\n`;
  const r2 = mkWs('g', hoSo(P));
  assert(chayGc(gc2, r2, 'g').stdout.includes('bảng phản biện ngoài khai báo'), 'co gia tren ho so clean — ban sao dem moi hang ma van im');
  return '(thieu hang bang 2 · co gia tren ho so clean)';
});
```

- [ ] **Step 2:** chạy → FAIL «gate-card GP_HEADER lech chu ky SKILL».
- [ ] **Step 3: sửa** — khối marker cạnh các hằng:

```js
// <<<GAP-PROBE-HEADER — chữ ký bảng phản biện; bên VIẾT là câu định nghĩa bảng ở
// feature-loop SKILL S1#7 (ca CK-AC7 so bằng nhau). Bảng tìm theo chữ ký, KHÔNG theo tên mục.
const GP_HEADER = '| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |';
const GP_NGOAI = 'bảng phản biện ngoài khai báo: ';
// GAP-PROBE-HEADER>>>
```

Thay vòng đọc (dòng 520-527):

```js
  const chuKy = l => l.split('|').slice(1, -1).map(c => c.trim()).join('|') === GP_HEADER.split('|').slice(1, -1).map(c => c.trim()).join('|');
  let trongBang = false;
  if (gpPresent) for (const l of probeT.split(/\r?\n/)) {
    if (!/^\s*\|/.test(l)) { trongBang = false; continue; }
    if (chuKy(l)) { trongBang = true; continue; }
    if (!trongBang) continue;
    const cells = l.split('|').slice(1, -1).map(c => c.trim());
    if (cells.every(c => /^:?-+:?$/.test(c))) continue;
    if (cells.length === 6) gpRows.push({ sev: cells[0], artifact: cells[1], summary: cells[2], scenario: cells[3], measure: cells[4], disposition: cells[5] });
    else gpDropped++;
  }
  const gpPhatHien = gpRows.filter(r => /^P[0-2]$/.test(r.sev)).length;
```

Cờ (≈ dòng 820): `if (gpPresent && gpPhatHien > gpP0 + gpP1 + gpP2) flags.push(['fwarn', GP_NGOAI + gpPhatHien + ' > ' + (gpP0 + gpP1 + gpP2)]);`. Dòng 821 (clean mâu thuẫn) đổi điều kiện `gpRows.length` → `gpPhatHien`.
- [ ] **Step 4:** ckdl-the PASS · gate-card-lmcms + tests/plugins 0 failed. Review Focus 5: chạy `node scripts/gate-card.js --root . --slug <mỗi hồ sơ kit có gap-probe.md> --extract` với bản `origin/main` (git archive `scripts lib` vào thư mục tạm) và bản mới, so `gap_probe.rows.length`; lệch ở hồ sơ một-bảng → sửa trước khi commit, lệch ở hồ sơ nhiều-bảng → liệt vào thân commit.
- [ ] **Step 5:** Commit `feat(gate-card): đọc mọi bảng phản biện theo chữ ký sáu cột, cờ vượt khai báo (AC-7)`.

---

## LÀN C — đo và chữ (independent: true · tệp: `feature-loop/scripts/wf-usage.mjs`, `tests/scripts/ckdl-do.test.mjs`, `feature-loop/skills/feature-loop/SKILL.md` (chỉ frontmatter `description`), `skills/acceptance/references/eval-executors.md`, `skills/acceptance/references/tool-kill-rule.md`)

### Task C1: Nhãn chi phí từ meta.json (AC-8) — phục vụ E8 · independent: false (đầu làn C)

**Files:** Create `tests/scripts/ckdl-do.test.mjs` (header như làn A, tiền tố `ckdl-do`) · Modify `feature-loop/scripts/wf-usage.mjs:82-84`.

- [ ] **Step 1: ca:**

```js
const WFU = path.join(KIT, 'feature-loop', 'scripts', 'wf-usage.mjs');
const HARNESS = '[Workflow harness — user request] The harness relayed this request verbatim';
function thuMuc({ meta = true, tagO2 = false } = {}) {
  const d = mkdtempSync(path.join(TMP, 'wf-'));
  ['machine:a', 'review:b', 'judge:c'].forEach((lab, i) => {
    const id = `agent-a${i}`;
    const tin = [{ type: 'user', message: { content: HARNESS } }];
    if (tagO2) tin.push({ type: 'user', message: { content: `[wf-label: x${i}] than prompt` } });
    tin.push({ type: 'assistant', message: { id: `m${i}`, model: 'claude-haiku-4-5', usage: { input_tokens: 10, output_tokens: 100 + i, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } });
    writeFileSync(path.join(d, `${id}.jsonl`), tin.map(o => JSON.stringify(o)).join('\n') + '\n');
    if (meta) writeFileSync(path.join(d, `${id}.meta.json`), JSON.stringify({ agentType: 'workflow-subagent', description: lab, workflowPhase: 'Machine' }));
  });
  return d;
}
const chayWfu = d => spawnSync(process.execPath, [WFU, d, '--md', '--title', 't'], { encoding: 'utf8' }).stdout;
await ca('CK-AC8', async () => {
  const o = chayWfu(thuMuc());
  const nhan = ['machine:a', 'review:b', 'judge:c'].filter(l => o.includes(`| ${l} |`));
  assert(nhan.length === 3, `nhan trung: ${o.split('\n').filter(l => l.startsWith('| [')).join(' / ')}`);
  return '(3 nhan rieng)';
});
await ca('CK-AC8-doi-chung', async () => {
  const o1 = chayWfu(thuMuc({ meta: false, tagO2: true }));
  assert(['x0', 'x1', 'x2'].every(l => o1.includes(`| ${l} |`)), 'the o tin nguoi thu hai khong duoc doc');
  const o2 = chayWfu(thuMuc({ meta: false }));
  assert(o2.includes(`| ${HARNESS.slice(0, 48)} |`), '48 ky tu dau nhu truoc vong');
  return '(the tin 2 · 48 ky tu)';
});
await ca('CK-AC8-dot-bien', async () => {
  const src = readFileSync(WFU, 'utf8');
  const KIM = 'const meta = docMeta(file);';
  assert(src.split(KIM).length - 1 === 1, 'kim docMeta khong khop');
  const sao = path.join(TMP, 'wfu-sao.mjs'); writeFileSync(sao, src.replace(KIM, 'const meta = null;'));
  const o = spawnSync(process.execPath, [sao, thuMuc(), '--md', '--title', 't'], { encoding: 'utf8' }).stdout;
  assert(!['machine:a', 'review:b', 'judge:c'].every(l => o.includes(`| ${l} |`)), 'nhan trung — ban sao bo meta ma van tach nhan');
  return '(nhan trung)';
});
```

- [ ] **Step 2:** chạy → FAIL «nhan trung».
- [ ] **Step 3: sửa wf-usage.mjs** — thay ba dòng 82-84:

```js
  // cham-khong-tu-dot-luot AC-8: harness mới chèn «[Workflow harness — user request]» làm tin
  // người ĐẦU của mọi tác tử, nên nhãn đọc từ tin đầu gộp mọi tác tử làm một (40/40, 26/09).
  // Thứ tự: meta.json cạnh transcript (description = nhãn Workflow) → thẻ [wf-label:] ở ba tin
  // người đầu → 48 ký tự đầu (đường cũ).
  const meta = docMeta(file);
  const users = lines.filter(l => l.type === 'user' && l.message).slice(0, 3).map(l => textOf(l.message.content));
  const head = users[0] || '';
  const tagHit = users.map(t => t.match(/\[wf-label:\s*([^\]\n]+)\]/)).find(Boolean);
  const label = (meta && typeof meta.description === 'string' && meta.description.trim()) ? meta.description.trim()
    : tagHit ? tagHit[1].trim()
    : (head.replace(/\s+/g, ' ').trim().slice(0, 48) || '(prompt rỗng)');
```

và thêm hàm cạnh `textOf`:

```js
function docMeta(file) {
  try { return JSON.parse(fs.readFileSync(file.replace(/\.jsonl$/, '.meta.json'), 'utf8')); } catch { return null; }
}
```

- [ ] **Step 4:** ckdl-do PASS · `node tests/scripts/wf-usage.test.mjs` 0 failed (U02/U06c đường cũ giữ).
- [ ] **Step 5:** Commit `feat(wf-usage): nhãn tác tử từ meta.json, dự phòng thẻ ba tin đầu (AC-8)`.

### Task C2: Ba câu tài liệu (AC-10, judgment) — phục vụ E10 · independent: false

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md:3` (câu YÊU CẦU trong `description`), `skills/acceptance/references/eval-executors.md` (mục «Where a run writes its artifacts» ≈ dòng 100), `skills/acceptance/references/tool-kill-rule.md` (khối marker).

- [ ] **Step 1:** SKILL `description`: nối vào cuối câu YÊU CẦU: «; vòng chạy trong phiên cấp cao nhất có công cụ Workflow — tác tử con không có Workflow, đừng chạy vòng trong tác tử con.»
- [ ] **Step 2:** eval-executors.md, cuối mục «Where a run writes its artifacts», thêm đoạn: «**Exclusive resources.** A driver that uses a resource only one run may hold at a time (a shared dev database or store, a single browser profile) queues itself inside the measure — a lock or wait in the driver, the way crm's DB lock does. The kit runs ui-check evals in parallel and does not serialise them for you: only the measure knows its resource is exclusive.»
- [ ] **Step 3:** tool-kill-rule.md, thêm MỘT dòng mới trong khối marker (trước `<!-- TOOL-KILL-RULE>>> -->`): «DAU RA DAI: harness co the CAT DAU RA RA TEP ("Output too large … saved to <tep>") va chi hien doan DAU — do KHONG phai bi cong cu giet: doc DUOI tep do (tail) de lay dong tong ket va ma thoat; chi khai killedByTool khi tool result bao timeout/killed that.»
- [ ] **Step 4:** Verify: `bash tests/workflows/run-tests.sh` (W25 rút từng dòng khối vào prompt — dòng mới phải có mặt) · `bash tests/plugins/run-tests.sh` (lint từ vựng CONTEXT) → 0 failed.
- [ ] **Step 5:** Commit `docs(kit): YÊU CẦU Workflow trong phiên, driver độc quyền tự xếp hàng, đầu ra lưu tệp không phải bị giết (AC-10)`.

---

## Sau ba làn (main loop)

- Gộp ba nhánh worktree về `vong/cham-khong-tu-dot-luot`; chạy `bash tests/scripts/run-tests.sh`, `tests/hooks`, `tests/plugins`, `tests/workflows`, `node scripts/product-map.mjs --root . --check` → 0 failed.
- Chạy thật khoá `executors.script.ckdl` một lần → exit 0.
- Contract `status: implemented` → S4.
