# Làn ghim lại theo paths — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kho tự bật hai khoá: (b) hồ sơ chỉ hoá cũ khi diff chạm `paths` các eval của nó — bộ lọc đặt SAU luật cũ, chỉ thu; (c) các lệnh suite trong làn ghim lại chạy song song.

**Architecture:** Một vị từ thuần `staleByPaths` trong `lib/evidence-core.cjs` (đã nằm trong danh sách chép sang kho tiêu thụ) nhận danh sách tệp luật cũ gọi hoá cũ + văn bản `evals.yaml`, trả tập con hoặc «không áp được, lý do». `scripts/pre-merge-check.sh` và khối `SKIP-UNCHANGED-PREDICATE` của `feature-loop/scripts/repin-lane.mjs` cùng gọi nó khi khoá `risk_tiers.stale_scope: paths`. Phần (c) đổi `runCmd` của làn sang chạy suite đồng thời — chỉ bắt đầu sau khi ô `lan-ghim-lai-giu-tron-loi-loi` gộp.

**Tech Stack:** Node ≥18 (CJS trong `lib/`, ESM trong `feature-loop/scripts/`), bash (pre-merge), git; bộ răng hồ sơ `rang.sh` + `rang/*.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-03-lan-ghim-lai-theo-paths-design.md` · hợp đồng `_acceptance/lan-ghim-lai-theo-paths/contract.md` (AC-1…AC-10, ma trận M 12 ô) · `evals.yaml` (E1…E10).

## Global Constraints

- Khoá (b): `risk_tiers.stale_scope` ∈ {vắng, `all`, `paths`}; giá trị khác → `VIOLATION [config]` gọi tên giá trị, nêu `paths` | `all`.
- Cờ chiến dịch: `--stale-all` cho `pre-merge-check.sh` — bỏ qua bộ lọc bất kể khoá.
- Khoá (c): `feature_loop.repin_parallel_suites: true`; vắng/false = nối đuôi như cũ.
- Khoá vắng ở cả hai: đầu ra pre-merge VÀ làn bằng hệt bản base (git archive merge-base `scripts lib feature-loop/scripts`) — AC-1, AC-10.
- `lib/` KHÔNG nạp tệp nào ngoài khối `INIT-CI-COPY-LIST` của `commands/acceptance-init.md`.
- Làn với khoá vắng KHÔNG đòi export mới của lib (bảng `AG-ENGINE-TABLE` có hàng điều kiện).
- Mọi phép đo mới: cặp hai chiều trên CÙNG fixture (lành xanh trước, bản sao bị tiêm đỏ, thông điệp ghim) — MEASURE-BIRTH-CLAUSE.
- Đường dẫn trong răng/test suy từ vị trí script; bản base lấy trọn thư mục bằng `git archive`, không chép danh sách tệp tay.
- Ma trận M có ĐÚNG 12 ô; hằng `M_SO_O = 12` viết trước trong `rang/ma-tran.mjs`.

## Review Focus

- Đường dẫn diff tương đối gốc kho git, `paths` tương đối gốc kho của hồ sơ (`_acceptance/` nằm sâu trong monorepo) — hai bên quy về cùng gốc như `chamTuPin` đang làm; ca M2 chạy thêm một biến thể `pkg/a/_acceptance/` trong Task 2.
- `evals.yaml` có eval khai `paths: []` (mảng rỗng tường minh) — coi như THIẾU `paths` (luật cũ cho eval máy), không phải «không vật nào»; ô thêm vào Task 1.
- Glob có ký tự đặc biệt (`.`, `+`, `(`, `[`) — bản lib phải khớp `globToRe` của `carry-plan.mjs`; ca so ma trận glob trong Task 1.
- Tên tệp có khoảng trắng hoặc ký tự Unicode trong diff — truyền danh sách qua stdin từng dòng, không qua đối số shell; ca trong Task 2.
- Suite song song mà một suite treo — ngoài phạm vi (Later), nhưng làn không được nuốt mã thoát của suite xong trước; ca «hai đỏ» của Task 4 phủ thứ tự.

---

### Task 0: Khung bộ răng hồ sơ + bộ sinh kho mẫu

**Files:**
- Create: `_acceptance/lan-ghim-lai-theo-paths/rang.sh` (bộ điều phối `--chan <tên>`, mười chân E1…E10)
- Create: `_acceptance/lan-ghim-lai-theo-paths/rang/kho-mau.mjs` (dựng kho git tạm: config, hồ sơ `signed-off`, pin do CHÍNH `repin-lane.mjs --write` ghi — cùng nếp `tests/scripts/repin-lane-skip-unchanged.test.mjs`)
- Create: `_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs` (12 ô M1…M12, hằng `M_SO_O = 12`, mỗi ô: `{ id, evalsYaml, diff: [{path, noiDung}], kyVong: 'cu'|'loc'|'hoa-cu'|'khong' }`)
- Create: `_acceptance/lan-ghim-lai-theo-paths/rang/ban-base.mjs` (git archive merge-base `scripts lib feature-loop/scripts` ra thư mục tạm; trả đường dẫn)

**Interfaces:**
- Produces: `dungKho({ stale_scope, parallel, evalsYaml, hoSoSau }) → { root, git(...a), pin }` · `MA_TRAN: Array<O>` · `M_SO_O` · `banBase() → dir` · `chayPremerge(engineRoot, khoRoot, args[]) → {status, stdout, stderr}` · `chayLan(engineRoot, khoRoot, args[]) → {status, stdout, stderr}` · `banSao(sửa: {tep, tu, thanh}[]) → dir` (bản sao engine bị tiêm).
- `independent: false` (mọi task sau dùng nó)
- Phục vụ: E1…E10 (hạ tầng chung).

- [ ] **Step 1:** Viết `ma-tran.mjs` với 12 ô đúng bảng M của hợp đồng; `export const M_SO_O = 12;` và `if (MA_TRAN.length !== M_SO_O) throw new Error('số ô lệch')`.
- [ ] **Step 2:** Viết `kho-mau.mjs` theo khuôn kho của `repin-lane-skip-unchanged.test.mjs` (config strict, `gap_probe: off`, `t1_skip_globs: ["docs/**"]`, suite `sh suite.sh`, hồ sơ `signed-off`), pin ghi bằng writer thật; hàm `apDiff(o)` commit diff của ô.
- [ ] **Step 3:** Viết `ban-base.mjs`: `git -C <gốc kit> archive $(git merge-base HEAD origin/main) scripts lib feature-loop/scripts | tar -x -C <tmp>`; đường dẫn gốc kit suy từ `import.meta.url`.
- [ ] **Step 4:** Viết `rang.sh` điều phối `--chan`; chân chưa có thì thoát 2 «chân chưa dựng: <tên>».
- [ ] **Step 5:** Chạy `bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan doc-cu` → thoát 2 «chân chưa dựng». Đối chứng hạ tầng: `node -e "import('./_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs').then(m=>console.log(m.MA_TRAN.length))"` → `12`.
- [ ] **Step 6:** Commit `test(lan-ghim-lai-theo-paths): khung bộ răng + kho mẫu + ma trận M`.

### Task 1: Vị từ `staleByPaths` trong lib

**Files:**
- Modify: `lib/evidence-core.cjs` (thêm ba hàm + export, gần `isRepinMachineEval` ~dòng 369)
- Create: `tests/scripts/stale-by-paths.test.mjs` (ca đơn vị vĩnh viễn) + đăng ký trong `tests/scripts/run-tests.sh` theo nếp các ca khác
- Modify: `_acceptance/lan-ghim-lai-theo-paths/rang.sh` (chân `chi-thu` phần thuần, `hinh-ho-so` phần thuần)

**Interfaces:**
- Consumes: `parseEvals` (`lib/eval-yaml.cjs`, nạp lười qua `loadEvalYaml()` đã có), `isRepinMachineEval`, `parseFlowValue`.
- Produces:
  - `pathGlobToRe(glob: string): RegExp` — cùng ngữ nghĩa `globToRe` của `feature-loop/scripts/carry-plan.mjs`.
  - `evalPathsOf(evalsText: string, id: string): string[] | null` — `null` khi eval không khai `paths` HOẶC khai mảng rỗng; nhận dạng một dòng, block seq, glob trần.
  - `staleByPaths(staleFiles: string[], evalsText: string|null, opts?: { prefix?: string }) → { apply: boolean, reason: string|null, kept: string[], skipped: string[] }` — `apply:false` ⇒ caller giữ nguyên danh sách cũ; `reason` ∈ {`khong-co-evals`, `evals-hong`, `eval-may-thieu-paths:<id>`, `hop-paths-rong`, `lib-loi:<msg>`}. `kept ∪ skipped = staleFiles`, `kept ∩ skipped = ∅`.
- `independent: false` (Task 2, 3 dùng)
- Phục vụ: E3 (chỉ thu), E4 (hình hồ sơ), E7 (một nguồn — vế tĩnh).

- [ ] **Step 1: Viết ca đỏ** `tests/scripts/stale-by-paths.test.mjs`:

```js
// Đường dẫn suy từ vị trí tệp (không hardcode ROOT).
import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const core = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'evidence-core.cjs'));
const { globToRe } = await import(path.join(ROOT, 'feature-loop', 'scripts', 'carry-plan.mjs'));
const Y = (blocks) => `evals:\n${blocks}`;
const ev = (id, ex, paths, extra = '') => `  - id: ${id}\n    criterion: AC-1\n    executor: ${ex}\n${paths}${extra}`;
let pass = 0; const ca = (n, f) => { f(); pass++; console.log('  PASS: ' + n); };
ca('SBP1 một tệp trong paths → kept', () => {
  const r = core.staleByPaths(['src/a.js', 'doc/x.txt'], Y(ev('E1', 'script', '    paths: ["src/**"]\n')));
  assert.equal(r.apply, true); assert.deepEqual(r.kept, ['src/a.js']); assert.deepEqual(r.skipped, ['doc/x.txt']);
});
ca('SBP2 eval máy thiếu paths → apply=false', () => {
  const r = core.staleByPaths(['x'], Y(ev('E1', 'script', '') + ev('E2', 'test', '    paths: ["src/**"]\n')));
  assert.equal(r.apply, false); assert.match(r.reason, /^eval-may-thieu-paths:E1$/);
});
ca('SBP3 chỉ ô not-run thiếu paths → apply=true', () => {
  const r = core.staleByPaths(['doc/x'], Y(ev('E1', 'script', '', '    status: not-run\n') + ev('E2', 'script', '    paths: ["src/**"]\n')));
  assert.equal(r.apply, true); assert.deepEqual(r.kept, []);
});
ca('SBP4 paths ui-check vào hợp', () => {
  const r = core.staleByPaths(['ui/p.tsx'], Y(ev('E1', 'script', '    paths: ["src/**"]\n') + ev('E2', 'ui-check', '    paths: ["ui/**"]\n')));
  assert.deepEqual(r.kept, ['ui/p.tsx']);
});
ca('SBP5 evals vắng / hỏng / hợp rỗng / paths: [] → apply=false', () => {
  assert.equal(core.staleByPaths(['x'], null).reason, 'khong-co-evals');
  assert.equal(core.staleByPaths(['x'], 'evals:\n  - id: E1\n   executor: [\n').apply, false);
  assert.equal(core.staleByPaths(['x'], Y(ev('E1', 'judgment', ''))).reason, 'hop-paths-rong');
  assert.match(core.staleByPaths(['x'], Y(ev('E1', 'script', '    paths: []\n'))).reason, /eval-may-thieu-paths:E1/);
});
ca('SBP6 ba cách viết paths cùng kết luận', () => {
  const f = ['src/a.js', 'doc/x'];
  const a = core.staleByPaths(f, Y(ev('E1', 'script', '    paths: ["src/**"]\n')));
  const b = core.staleByPaths(f, Y(ev('E1', 'script', '    paths:\n      - "src/**"\n')));
  const c = core.staleByPaths(f, Y(ev('E1', 'script', '    paths: "src/**"\n')));
  assert.deepEqual(a, b); assert.deepEqual(a, c);
});
ca('SBP7 bản glob của lib ≡ globToRe của carry-plan trên ma trận glob viết trước', () => {
  const G = ['src/**', 'src/**/x.js', '**/*.md', 'a/*.js', 'a?b.js', 'v1.0/(x)+[y].js', '_acceptance/**/rang/**'];
  const P = ['src/a.js', 'src/d/x.js', 'x.md', 'd/e/x.md', 'a/b.js', 'a/b/c.js', 'axb.js', 'a/b.js', 'v1.0/(x)+[y].js', '_acceptance/s/rang/r.sh'];
  let o = 0; for (const g of G) for (const p of P) { assert.equal(core.pathGlobToRe(g).test(p), globToRe(g).test(p), `${g} ~ ${p}`); o++; }
  assert.equal(o, G.length * P.length, 'số ô lệch');
});
ca('SBP8 chỉ thu: kept ⊆ staleFiles, kept ∪ skipped = staleFiles', () => {
  const f = ['src/a.js', 'doc/x', 'src/b.js'];
  const r = core.staleByPaths(f, Y(ev('E1', 'script', '    paths: ["src/**"]\n')));
  assert.deepEqual([...r.kept, ...r.skipped].sort(), [...f].sort());
});
console.log(`Results: ${pass} passed`);
```

- [ ] **Step 2:** `node tests/scripts/stale-by-paths.test.mjs` → FAIL `core.staleByPaths is not a function`.
- [ ] **Step 3: Cài** trong `lib/evidence-core.cjs`:

```js
// Ngữ nghĩa CHÉP từ feature-loop/scripts/carry-plan.mjs globToRe — lib phải tự đứng
// ở kho tiêu thụ (không nạp tệp ngoài INIT-CI-COPY-LIST); ca SBP7 giữ hai bản bằng nhau.
function pathGlobToRe(g) {
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*') { if (g[i + 1] === '*') { re += '.*'; i++; if (g[i + 1] === '/') i++; } else re += '[^/]*'; }
    else if (c === '?') re += '[^/]';
    else if ('.+^$()[]{}|\\'.includes(c)) re += '\\' + c;
    else re += c;
  }
  return new RegExp('^' + re + '$');
}
// paths của MỘT eval: một dòng `[a, b]`, block seq, hoặc glob trần. null = không khai / mảng rỗng.
function evalPathsOf(evalsText, id) {
  let trong = false, seq = null;
  for (const raw of String(evalsText).split('\n')) {
    const idM = raw.match(/^\s*-\s+id:\s*(\S+)/);
    if (idM) { if (seq) break; trong = idM[1].trim() === String(id); continue; }
    if (!trong) continue;
    if (seq) { const it = raw.match(/^\s+-\s+(\S.*)$/); if (it) { seq.push(parseFlowValue(it[1]).value); continue; } break; }
    const f = raw.match(/^\s+paths:\s*(.*)$/);
    if (!f) continue;
    const v = f[1].trim();
    if (v.startsWith('[')) { const pv = parseFlowValue(v); return pv.kind === 'seq' && pv.items.length ? pv.items : null; }
    if (!v) { seq = []; continue; }
    return [parseFlowValue(v).value];
  }
  return seq && seq.length ? seq : null;
}
// Bộ lọc hoá cũ theo paths — CHỈ THU: trả tập con của staleFiles hoặc apply:false.
function staleByPaths(staleFiles, evalsText, opts = {}) {
  const all = Array.isArray(staleFiles) ? staleFiles.slice() : [];
  const cu = (reason) => ({ apply: false, reason, kept: all, skipped: [] });
  if (evalsText == null) return cu('khong-co-evals');
  const Y = loadEvalYaml();
  if (!Y) return cu('lib-loi:eval-yaml vắng');
  let evs;
  try { evs = Y.parseEvals(String(evalsText), ['executor', 'status']); } catch (e) { return cu('evals-hong'); }
  if (!Array.isArray(evs) || !evs.length) return cu('evals-hong');
  const globs = [];
  for (const e of evs) {
    const p = evalPathsOf(evalsText, e.id);
    if (!p) { if (isRepinMachineEval(e)) return cu(`eval-may-thieu-paths:${e.id}`); continue; }
    globs.push(...p);
  }
  if (!globs.length) return cu('hop-paths-rong');
  const pre = opts.prefix || '';
  const res = globs.map(pathGlobToRe);
  const rel = (f) => (pre && f.startsWith(pre) ? f.slice(pre.length) : f);
  const kept = [], skipped = [];
  for (const f of all) (res.some(r => r.test(rel(f))) ? kept : skipped).push(f);
  return { apply: true, reason: null, kept, skipped };
}
```

Thêm `pathGlobToRe, evalPathsOf, staleByPaths` vào `module.exports`.
Lưu ý `evals-hong`: nếu `parseEvals` không ném lỗi trên YAML hỏng mà trả mảng thiếu id, ô M8 của răng (Task 2) phải đỏ trước — khi đó thêm kiểm «mọi phần tử có `id`» rồi `cu('evals-hong')`.
- [ ] **Step 4:** `node tests/scripts/stale-by-paths.test.mjs` → `Results: 8 passed`. Phá thử: đổi `kept : skipped` thành `skipped : kept` trong bản sao → SBP1 đỏ (ghi lại lượt phá vào verify của task).
- [ ] **Step 5:** `bash tests/scripts/run-tests.sh` → không ca nào đỏ mới (P-số của evidence-core giữ xanh).
- [ ] **Step 6:** Commit `feat(lib): staleByPaths — bộ lọc hoá cũ theo paths, chỉ thu`.

### Task 2: Lưới trước-gộp gọi bộ lọc (khoá, cờ, NOTE, fail-closed)

**Files:**
- Modify: `scripts/pre-merge-check.sh` — đọc khoá cạnh khối `gap_probe` (~dòng 259); cờ `--stale-all` trong vòng parse (~dòng 113); gọi bộ lọc ngay sau `stale="$(stale_files "$ROOT" "$vc")"` (~dòng 1346)
- Modify: `_acceptance/lan-ghim-lai-theo-paths/rang.sh` (+ `rang/chan-premerge.mjs`): chân `doc-cu` (E1), `nhay-dac-hieu` (E2), `chi-thu` (E3), `hinh-ho-so` (E4), `khong-chay-duoc` (E5), `khoa-va-co` (E6)

**Interfaces:**
- Consumes: `staleByPaths(staleFiles, evalsText, { prefix })` từ Task 1 qua `CHU_KY_LIB` (`lib/evidence-core.cjs`, đã khai ~dòng 440).
- Produces: dòng NOTE máy đọc `NOTE [<slug>]: hoá cũ theo luật cũ, bỏ qua theo paths: <N> tệp — <tối đa 10 tệp, cách nhau ", ">` · `NOTE [<slug>]: bộ lọc paths không chạy được (<lý do>) — giữ luật cũ` · `VIOLATION [config]: risk_tiers.stale_scope: "<v>" không hợp lệ — dùng paths | all (khoá vắng = all)`.
- `independent: true` (so với Task 3)
- Phục vụ: E1, E2, E3, E4, E5, E6.

- [ ] **Step 1: Viết chân đỏ** E1–E6 trong `rang/chan-premerge.mjs` trên kho mẫu Task 0: mỗi chân chạy bản lành (đòi xanh) rồi bản sao tiêm (`banSao`) đòi đỏ với thông điệp ghim đúng như `expected` của evals.yaml (`đổi mặc định`, `bộ lọc không chạy`, `bỏ qua im lặng`, `nới: tệp ngoài luật cũ`, `số ô lệch`, `im ô ngoài làn máy`, `eval máy thiếu paths`, `hợp rỗng thành im`, `not-run chặn lọc`, `bộ đọc paths một dạng`, `rơi về im khi lỗi`, `chiến dịch bị thu hẹp`, `sai chính tả im`). Thêm biến thể M2 với `_acceptance/` nằm ở `pkg/a/` và một tên tệp có khoảng trắng (Review Focus).
- [ ] **Step 2:** `bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan nhay-dac-hieu` → ĐỎ vì khoá chưa được đọc (M2 vẫn VIOLATION).
- [ ] **Step 3: Cài khoá + cờ:**

```bash
# cạnh khối cfg_gp:
cfg_ss="$(sed -n 's/^[[:space:]]*stale_scope:[[:space:]]*//p' "$ACC/config.yaml" | head -1 \
  | sed -e 's/[[:space:]]*#.*$//' -e 's/^["'"'"']//' -e 's/["'"'"']$//' -e 's/[[:space:]]*$//')"
case "$cfg_ss" in
  ''|all) STALE_SCOPE=all ;;
  paths) STALE_SCOPE=paths ;;
  *) echo "VIOLATION [config]: risk_tiers.stale_scope: \"$cfg_ss\" không hợp lệ — dùng paths | all (khoá vắng = all)"
     violations=$((violations+1)); STALE_SCOPE=all ;;
esac
# trong vòng parse cờ:
    --stale-all)
      # Chiến dịch mốc: ép luật hoá cũ cũ bất kể risk_tiers.stale_scope — chiến dịch
      # chọn hồ sơ bằng chính lưới này, và paths của kho tiêu thụ hiếm khi trỏ engine.
      STALE_ALL=1; shift ;;
```

(Khởi tạo `STALE_SCOPE=all; STALE_ALL=0` cạnh `RECHECK_ALL=0`.)
- [ ] **Step 4: Cài lời gọi bộ lọc** ngay sau `stale="$(stale_files "$ROOT" "$vc")"`:

```bash
    if [ -n "$stale" ] && [ "$STALE_SCOPE" = paths ] && [ "$STALE_ALL" -eq 0 ]; then
      _sbp_pre="$(git -C "$ROOT" rev-parse --show-prefix 2>/dev/null)"
      if command -v node >/dev/null 2>&1 && [ -f "$CHU_KY_LIB" ]; then
        _sbp="$(printf '%s\n' "$stale" | node -e '
          const l=require(process.argv[1]),fs=require("fs");
          const files=fs.readFileSync(0,"utf8").split("\n").filter(Boolean);
          let ev=null; try{ev=fs.readFileSync(process.argv[2],"utf8")}catch(_){}
          const r=l.staleByPaths(files,ev,{prefix:process.argv[3]});
          process.stdout.write(JSON.stringify(r));' "$CHU_KY_LIB" "$dir/evals.yaml" "$_sbp_pre" 2>&1)" && _sbp_ok=1 || _sbp_ok=0
      else _sbp_ok=0; _sbp="thiếu node hoặc lib/evidence-core.cjs"; fi
      if [ "$_sbp_ok" -eq 1 ] && printf '%s' "$_sbp" | grep -q '^{'; then
        _sbp_out="$(printf '%s' "$_sbp" | node -e '
          const r=JSON.parse(require("fs").readFileSync(0,"utf8"));
          if(!r.apply){process.stdout.write("APPLY=0\n"+r.reason+"\n");process.exit(0)}
          process.stdout.write("APPLY=1\n"+r.skipped.length+"\n"+r.skipped.slice(0,10).join(", ")+"\n"+r.kept.join("\n"));')"
        if [ "$(printf '%s\n' "$_sbp_out" | sed -n 1p)" = "APPLY=0" ]; then
          echo "NOTE [$slug]: bộ lọc paths không áp ($(printf '%s\n' "$_sbp_out" | sed -n 2p)) — giữ luật cũ"
        else
          _sbp_n="$(printf '%s\n' "$_sbp_out" | sed -n 2p)"
          [ "$_sbp_n" -gt 0 ] && echo "NOTE [$slug]: hoá cũ theo luật cũ, bỏ qua theo paths: $_sbp_n tệp — $(printf '%s\n' "$_sbp_out" | sed -n 3p)"
          stale="$(printf '%s\n' "$_sbp_out" | sed -n '4,$p')"
        fi
      else
        echo "NOTE [$slug]: bộ lọc paths không chạy được ($(printf '%s' "$_sbp" | head -1)) — giữ luật cũ"
      fi
    fi
```

`stale` rỗng sau lọc thì khối `if [ -n "$stale" ]` có sẵn ngay dưới tự bỏ qua VIOLATION — không sửa khối đó.
- [ ] **Step 5:** `bash rang.sh --chan <từng chân E1–E6>` → xanh cả lành lẫn mutant; `bash scripts/pre-merge-check.sh --base origin/main` trên kit → `clean` (khoá vắng ở kit).
- [ ] **Step 6:** `bash tests/scripts/run-tests.sh` + `bash tests/plugins/run-tests.sh` → không đỏ mới.
- [ ] **Step 7:** Commit `feat(pre-merge): risk_tiers.stale_scope: paths + --stale-all`.

### Task 3: Làn `--skip-unchanged` hỏi cùng vị từ

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` — `AG-ENGINE-TABLE` thêm hàng điều kiện; khối `SKIP-UNCHANGED-PREDICATE` (~dòng 254–318)
- Modify: `tests/scripts/repin-lane-lop-cu.test.mjs` — `matrixJudge`/GL03 hiểu hàng có trường `khi:` (xoá export của hàng điều kiện → khoá vắng: chạy như base; khoá bật: dừng có tên)
- Modify: `rang.sh` (+ `rang/chan-lan.mjs`): chân `mot-nguon` (E7), `lan-doc-cu` (E10)

**Interfaces:**
- Consumes: `core.staleByPaths` (Task 1).
- Produces: dòng stderr `repin-lane: --skip-unchanged theo paths: bỏ qua <N> tệp ngoài phạm vi đo của <slug>` · khi `apply:false` → `repin-lane: --skip-unchanged không lọc theo paths (<reason>) — xét theo luật cũ`.
- `independent: true` (so với Task 2)
- Phục vụ: E7, E10.

- [ ] **Step 1: Viết chân đỏ** E7 (round-trip 12 ô M: pre-merge «hoá cũ?» ⇔ làn «không bỏ qua?»; kho tiêu thụ dựng bằng chép theo khối `INIT-CI-COPY-LIST` rút từ `commands/acceptance-init.md` — cùng cách `tests/scripts/duong-nen-fixture.mjs` dòng ~78 rút khối; plugin feature-loop chép ra thư mục riêng ngoài kho; mutant «lib nạp tệp ngoài danh sách chép») và E10 (vi phân khoá vắng với `banBase()` trên 12 ô, bỏ dấu thời gian `\d+\.\d+s` và `ts`/`run_id`; ô lib cũ: `--ag-root` trỏ bản base → làn khoá vắng chạy, khoá `paths` → dòng «không lọc theo paths (lib-loi…)»).
- [ ] **Step 2:** Chạy hai chân → ĐỎ (làn chưa đọc khoá: M2 không bỏ qua).
- [ ] **Step 3: Cài:**

```js
// AG-ENGINE-TABLE — hàng điều kiện: chỉ đòi khi kho bật khoá.
  { file: 'lib/evidence-core.cjs', name: 'staleByPaths', kind: 'function', since: '2.21.0', why: 'làn gọi khi risk_tiers.stale_scope: paths', khi: 'stale_scope=paths' },
// sau khi đọc configText:
const staleScope = String(core.resolveConfigKey(configText, 'risk_tiers.stale_scope') || 'all').trim();
const batKhoa = (r) => !r.khi || (r.khi === 'stale_scope=paths' && staleScope === 'paths');
const missing = AG_ENGINE.filter(r => batKhoa(r) && lacks(r));
```

Trong `SKIP-UNCHANGED-PREDICATE`, thay vòng `for (const [slug, vc] of Object.entries(pins))` để gom `doiCuaSlug` rồi, khi `staleScope === 'paths'`, gọi `core.staleByPaths(doiCuaSlug, s.evalsText, { prefix: tienToGit })` và chỉ đẩy `kept` vào `doi`; vế `laDinhNghia` giữ nguyên, xét TRƯỚC bộ lọc.
- [ ] **Step 4:** `bash rang.sh --chan mot-nguon && bash rang.sh --chan lan-doc-cu` → xanh cả lành lẫn mutant; `node tests/scripts/repin-lane-lop-cu.test.mjs` và `node tests/scripts/repin-lane-skip-unchanged.test.mjs` → xanh.
- [ ] **Step 5:** Commit `feat(repin-lane): --skip-unchanged hỏi staleByPaths khi stale_scope: paths`.

### Task 4: Suite song song trong làn — CHỈ SAU KHI ô `lan-ghim-lai-giu-tron-loi-loi` GỘP

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` — `runCmd` (sau bản viết lại của ô kia) + lời gọi suite (~dòng 409 hôm nay)
- Modify: `rang.sh` (+ `rang/chan-song-song.mjs`): chân `song-song` (E8), `loi-khong-xen` (E9)

**Interfaces:**
- Consumes: đường ghi trọn lời lỗi ra `.acceptance-runs/<slug>/` do ô kia dựng (đọc tên hàm thật từ `main` khi bắt đầu task — KHÔNG đoán trước).
- Produces: `async function runSuites(cmds: string[]): Promise<number[]>` — mảng mã thoát theo ĐÚNG thứ tự `cmds`; nối đuôi khi khoá vắng, đồng thời (`spawn`, gom stdout/stderr từng lệnh vào bộ đệm riêng, in một khối liền mỗi lệnh đỏ sau khi lệnh xong) khi `feature_loop.repin_parallel_suites: true`. Lệnh trùng chạy một lần (giữ bản đồ `results`).
- `independent: false` (chờ ô kia)
- Phục vụ: E8, E9, E10 (vế làn đủ).

- [ ] **Step 0: Cổng thứ tự.** `gh pr list --state merged --search "lan-ghim-lai-giu-tron-loi-loi"` có PR gộp vào `main` VÀ `git merge origin/main` vào nhánh vòng sạch. Chưa gộp → DỪNG task này, báo một dòng, không sửa `runCmd`.
- [ ] **Step 1: Viết chân đỏ** E8 (ba suite `sleep 3; exit <m>` · `sleep 2…` · `sleep 1…`, bốn ca × hai khoá; so `suites_exit`/mã thoát/có-không dòng repin; ca `true` đo tổng thời gian < 6 s; khoá vắng đọc dấu bắt đầu từng suite để chứng nối đuôi; mutant ghi theo thứ tự xong) và E9 (hai suite đỏ in xen từng dòng; ca biên một đỏ hai xanh; suite ghi vào hồ sơ đã ký → làn đỏ gọi tên tệp; mutant in ngay khi nhận).
- [ ] **Step 2:** Chạy → ĐỎ («khoá chưa đọc», tổng thời gian ≥ tổng sleep).
- [ ] **Step 3: Cài** `runSuites` + đọc khoá `core.resolveConfigKey(configText, 'feature_loop.repin_parallel_suites')`; phần còn lại của làn chờ `await runSuites(suiteCmds)` (đổi đoạn thân sang hàm `async main()` nếu cần — giữ nguyên mọi thông điệp hiện có từng byte để E10 xanh).
- [ ] **Step 4:** `bash rang.sh --chan song-song && bash rang.sh --chan loi-khong-xen && bash rang.sh --chan lan-doc-cu` → xanh; `node tests/scripts/repin-lane.test.mjs` → xanh.
- [ ] **Step 5:** Commit `feat(repin-lane): suite song song khi feature_loop.repin_parallel_suites`.

### Task 5: Tài liệu + nhãn phát hành

**Files:**
- Modify: `GUIDE.md` §7.1 — hai khoá, cờ `--stale-all` trong công thức chiến dịch («lưới trước-merge với `--base <tag mốc trước> --stale-all`»), điều kiện kho nên thoả trước khi bật (c), giới hạn khai + ngưỡng.
- Modify: `CHANGELOG.md` — mục `Unreleased`.
- Modify: `skills/acceptance/references/config-template.yaml` (hoặc khuôn config mà `acceptance-init` sinh — tìm bằng `grep -rn "t1_skip_globs" skills commands`) — hai khoá ở dạng chú thích, mặc định tắt.
- `independent: false`
- Phục vụ: không eval riêng (tài liệu); E6 bảo đảm cờ chạy thật.

- [ ] **Step 1:** Sửa ba tệp; chạy `node scripts/context-glossary.js --check` (hoặc ca W6 của `eval-coverage-lint`) để chắc không dùng từ trong `_Avoid_`.
- [ ] **Step 2:** Commit `docs: stale_scope paths + --stale-all + repin_parallel_suites`.

---

## Thứ tự và song song

T0 → T1 → (T2 ∥ T3) → T5; T4 chờ ô `lan-ghim-lai-giu-tron-loi-loi` gộp rồi chạy trước T5. T2 và T3 chạm hai tệp khác nhau và chỉ cùng dùng `staleByPaths` — đủ điều kiện fan-out song song ở S3.
