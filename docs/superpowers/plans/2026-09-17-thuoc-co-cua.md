# Thước có cửa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lượt chấm thôi bị hạ tầng đốt (ô khai không-chạy, suite đè nhau, tường không ai thấy trước cổng) và sửa thước lần đầu có tên, có đếm, có trần.

**Architecture:** Mọi chặn-trước-lượt-chấm nằm trong `feature-loop/scripts/s4-args.mjs` (từ chối sinh tệp args = không dispatch được). Xếp hàng suite nằm trong chính script workflow (vòng `await`). Mọi số đếm suy từ git và run-log. Hai seam bên-viết → bên-đọc mới (`duong-nen.md`, dòng run-log `thuoc-vat`) đặt khuôn MỘT chỗ có marker và có ca round-trip.

**Tech Stack:** Node ≥ 20 thuần (`node:fs`, `node:child_process`, `node:crypto`), không thêm phụ thuộc. Ca kiểm là tệp `.test.mjs` tự chạy, tự in `PASS:` / `FAIL:` và dòng `Results: <n> passed, <m> failed`; `tests/scripts/run-tests.sh` và `tests/workflows/run-tests.sh` tự quét tệp mới.

**Spec:** `docs/superpowers/specs/2026-09-17-thuoc-co-cua-design.md` · hợp đồng `_acceptance/thuoc-co-cua/contract.md` (15 AC, đã duyệt 17/09) · `_acceptance/thuoc-co-cua/evals.yaml` (25 eval — TÊN CA và THÔNG ĐIỆP GHIM trong trường `expected` là hợp đồng với bên chấm, không đổi).

## Global Constraints

- TDD: viết ca trước, thấy ĐỎ đúng thông điệp, rồi mới viết vật. Mỗi phép đo mới có cặp ca hai chiều trên CÙNG fixture code-sinh: đối chứng dương trước, phá vật trong bản sao thì đỏ với THÔNG ĐIỆP GHIM; chiều IM bắt buộc (`skills/acceptance/references/measure-birth.md`).
- Fixture là kho git dựng bằng code trong lượt chạy (`mkdtempSync(tmpdir(), …)`, `git init -b main`), theo mẫu `buildRepo()` của `tests/scripts/s4-args-expected-exit.test.mjs:31-63`. CẤM fixture viết tay theo khuôn bên đọc. Mọi đường dẫn suy từ vị trí tệp ca (`path.dirname(fileURLToPath(import.meta.url))`), cấm hardcode ROOT.
- Đột biến: trên BẢN SAO — chép trọn thư mục (`cpSync(KIT/feature-loop, …, {recursive:true})` như `s4Mutant` ở `tests/scripts/s4-args-vung-vat.test.mjs:287-299`), hoặc bản sao trong bộ nhớ (`runWorkflow(WF, args, respond, srcOverride)` của `tests/workflows/harness.mjs`). Mỗi mũi tiêm khẳng định kim khớp ĐÚNG MỘT lần trong nguồn thật trước khi tin màu đỏ.
- Tên ca và chuỗi PASS: dòng in phải là `PASS: <TÊN CA> <mô tả>` — khoá executor trong `_acceptance/config.yaml` grep `PASS: <TÊN CA> ` (có dấu cách sau tên). Danh sách tên ca theo từng task ở dưới là ĐÓNG.
- Phép đo không ghi ra ngoài thư mục tạm của nó; không ca nào ghi vào `_acceptance/` của kho.
- Đọc-cũ: args không `evalsNotRun` · run-log không dòng `thuoc-vat` · hồ sơ không `duong-nen.md` · dòng sổ không `target` — mọi bộ đọc chạy như trước. Repo tiêu thụ không migrate gì.
- KHÔNG đổi thành phần đường verdict của `acceptance-verify.js` (finder → triage → refute → REJECT). KHÔNG đưa tệp hồ sơ vào làn tìm-lỗi. KHÔNG thêm khoá config. KHÔNG tệp khoá trên đĩa.
- Từ vựng theo `CONTEXT.md`; trong văn mới không viết «ledger» trần, không gọi hook/CI là cổng. Trong tệp dưới `_acceptance/` không dán cụm có ký tự sao (ca P161).
- Commit nhỏ, mỗi task ít nhất một commit; thông điệp tiếng Việt theo lệ kho; cuối thông điệp: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Agent thi công KHÔNG chạy trọn `tests/plugins` hay `tests/scripts` (mỗi suite gần 7 phút, không hai tiến trình nặng song song) — chỉ chạy tệp ca của task mình và các tệp ca láng giềng được nêu tên. Hồi quy trọn suite là việc của Task 11, vòng chính chạy.

## File Structure

| Tệp | Trách nhiệm | Task |
|---|---|---|
| `feature-loop/scripts/s4-args.mjs` (sửa) | lọc ô khai không-chạy · gọi bộ đếm, giữ trần · nhập hai tập mẫu từ module phân loại | 1, 3, 5 |
| `feature-loop/scripts/carry-plan.mjs` (sửa) | bỏ qua cùng tập id không-chạy | 1 |
| `feature-loop/scripts/lib/phan-loai.mjs` (mới) | MỘT nguồn: `DO_GLOBS`, `HO_SO_VAN_BAN_GLOBS`, `phanLoai()` | 3 |
| `feature-loop/scripts/thuoc-vat.mjs` (mới) | bộ đếm vật/thước/nhát · cờ giữa-hai-lượt · `--target` · `--write` | 4 |
| `feature-loop/workflows/acceptance-verify.js` (sửa) | dòng «không chạy theo hồ sơ» · suite tuần tự · `commandGroups` ở chạy khô | 2, 6 |
| `feature-loop/scripts/duong-nen.mjs` (mới) | đường nền hạ tầng bốn chân, ghi `duong-nen.md` | 7 |
| `skills/acceptance/references/duong-nen-template.md` (mới) | khuôn `duong-nen.md` + khuôn dòng đỏ, marker `DUONG-NEN-TEMPLATE` | 7 |
| `feature-loop/scripts/repin-lane.mjs` (sửa) | khối `SKIP-UNCHANGED-PREDICATE` thấy tệp định nghĩa phép đo | 8 |
| `scripts/gate-card.js` (sửa) | mã đã khai · khối «Nền hạ tầng» · dòng vật-thước-nhát | 9 |
| `feature-loop/skills/feature-loop/SKILL.md`, `CONTEXT.md`, `GUIDE.md` (sửa) | chỉ dẫn S1 bước 0 · S4 trần · ô `target` của khuôn dòng sổ · hai mục từ vựng | 10 |

---

## GIAI ĐOẠN 1 — bốn làn độc lập (song song, mỗi làn một worktree)

Làn A = Task 1 → 3 → 4 → 5 (cùng chạm `s4-args.mjs`, tuần tự TRONG làn). Làn B = Task 2 → 6 (cùng chạm `acceptance-verify.js`). Làn C = Task 7. Làn D = Task 8. Bốn làn không chung tệp nào.

### Làn A: bộ sinh args, module phân loại, bộ đếm, trần

Làm LẦN LƯỢT bốn section «Task 1», «Task 3», «Task 4», «Task 5» ở dưới, đúng thứ tự ấy, mỗi task một commit với thông điệp ghi trong task. Đọc trước mục «Global Constraints». Xong cả bốn mới báo done; `commitSha` là commit của Task 5.

### Làn B: workflow lượt chấm

Làm LẦN LƯỢT hai section «Task 2» rồi «Task 6» ở dưới, mỗi task một commit. Đọc trước mục «Global Constraints». `commitSha` là commit của Task 6.

### Làn C: đường nền hạ tầng

Làm section «Task 7» ở dưới. Đọc trước mục «Global Constraints».

### Làn D: làn ghim lại thấy định nghĩa phép đo

Làm section «Task 8» ở dưới. Đọc trước mục «Global Constraints».

### Task 1: Bộ sinh args nghe lời khai không-chạy — làn A · `independent: true` · phục vụ E1

**Files:**
- Modify: `feature-loop/scripts/s4-args.mjs:74` (nhập thêm hàm), `:113-121` (lọc), khối `const args = {…}` (khoá mới)
- Modify: `feature-loop/scripts/carry-plan.mjs` (chỗ lọc `executor !== 'judgment'`, khoảng `:138`)
- Test: `tests/scripts/s4-args-not-run.test.mjs` (mới)

**Interfaces:**
- Consumes: `machineEvalIdsSkipped(evalsText) → string[] | null` từ `<agRoot>/lib/evidence-core.cjs` (đã có, `:387-394`; `null` = thiếu `lib/eval-yaml.cjs`).
- Produces: tệp args có `evalsNotRun: string[]` — khoá VẮNG HẲN khi danh sách rỗng; `args.evals` không chứa các id ấy. Task 2 đọc đúng tên khoá này.

- [ ] **Step 1: Viết ca đỏ.** Tệp ca dựng kho bằng `buildRepo()` (chép hàm từ `tests/scripts/s4-args-expected-exit.test.mjs:31-63`, giữ `--ag-root KIT`). `evals.yaml` của fixture có ba eval: `E1` script thường, `E2` script mang dòng `    status: not-run`, `E3` judgment. Bốn ca, in đúng tên:
  - `NRS1` (đối chứng dương): chạy `s4-args.mjs --slug demo --root <d> --ag-root <KIT> --diff-base main` → `args.evals.map(e=>e.id)` bằng `['E1','E3']` và `args.evalsNotRun` bằng `['E2']`.
  - `NRS2` (chiều đỏ, cùng fixture): gỡ đúng dòng `status: not-run` khỏi bản sao `evals.yaml` rồi commit → `E2` CÓ trong `args.evals` và `'evalsNotRun' in args === false`.
  - `NRS3` (chiều im): fixture không khai ô nào → `Object.prototype.hasOwnProperty.call(args,'evalsNotRun') === false` (không phải mảng rỗng).
  - `NRS4` (một nguồn): chép trọn cây `lib/` của KIT sang thư mục tạm, thay thân `machineEvalIdsSkipped` bằng `return [];` (khẳng định kim `function machineEvalIdsSkipped(` khớp đúng một lần), chạy script với `--ag-root <bản sao>` trên fixture của NRS1 → `E2` CÓ trong `args.evals`; ca PASS khi kết luận LẬT so với NRS1, thông điệp `PASS: NRS4 mot nguon — thay ham cua lib thi ket luan lat`.
- [ ] **Step 2: Chạy, thấy đỏ.** `node tests/scripts/s4-args-not-run.test.mjs` → NRS1 FAIL (`E2` còn trong evals).
- [ ] **Step 3: Viết vật.** Ở `s4-args.mjs:74` thêm `machineEvalIdsSkipped` vào phép tách, kèm chốt cùng khuôn với `:75`:

```js
if (typeof machineEvalIdsSkipped !== 'function') die('acceptance-gate quá cũ: lib/evidence-core.cjs không có machineEvalIdsSkipped (cần ≥ 2.12.0) — cập nhật plugin');
```

  Ngay sau `if (!evals.length) die(…)` (`:114`):

```js
// ── ô tự khai `status: not-run`: CÙNG hàm với làn ghim lại và bên đọc pin
// (lib/evidence-core.cjs). Lượt chấm không thi hành ô ấy; tệp args GỌI TÊN nó để
// báo cáo nói ra, không im. Khoá vắng hẳn khi không ô nào khai (cùng luật evals_not_run).
const evalsNotRun = machineEvalIdsSkipped(evalsText);
if (evalsNotRun === null) die('không đọc được lời khai not-run: lib/eval-yaml.cjs vắng ở gốc acceptance-gate — KHÔNG đoán');
if (evalsNotRun.length) {
  for (let i = evals.length - 1; i >= 0; i--) if (evalsNotRun.includes(evals[i].id)) evals.splice(i, 1);
  if (!evals.length) die('mọi eval đều khai status: not-run — không còn gì để chấm');
  console.error(`s4-args: không chạy theo hồ sơ: ${evalsNotRun.join(', ')}`);
}
```

  (`evals` là `const` mảng — sửa tại chỗ bằng `splice` để các khối sau dùng đúng tập đã lọc.) Trong `const args = {…}` thêm `...(evalsNotRun.length ? { evalsNotRun } : {}),` ngay sau `evals,`. Trong `carry-plan.mjs`: đọc cùng hàm qua cùng `agRoot` mà tệp ấy đã giải (nếu tệp ấy không giải `agRoot`, nhận danh sách qua cờ mới `--skip-ids <a,b>` do `s4-args.mjs` truyền khi gọi nó) và loại các id ấy khỏi `evals` trước khi chia `carried`/`rerun`.
- [ ] **Step 4: Chạy, thấy xanh.** `node tests/scripts/s4-args-not-run.test.mjs` → 4 PASS; rồi `node tests/scripts/s4-args-expected-exit.test.mjs && node tests/scripts/s4-args-vung-vat.test.mjs && node tests/workflows/carry-plan.test.mjs` giữ màu.
- [ ] **Step 5: Commit** `fix(s4-args): lượt chấm nghe status not-run — cùng hàm lib với làn ghim lại (AC-1)`.

**Verify:** `node tests/scripts/s4-args-not-run.test.mjs`

### Task 3: Module phân loại bốn lớp — làn A, sau Task 1 · `independent: false` · phục vụ E12, E13, E14

**Files:**
- Create: `feature-loop/scripts/lib/phan-loai.mjs`
- Modify: `feature-loop/scripts/s4-args.mjs` — CHỈ hai dòng khai hằng (`const HO_SO_VAN_BAN_GLOBS = […]` ở khối `NGOAI-VAT`, `const DO_GLOBS = […]`) thành nhập từ module. KHÔNG đổi chữ nào của `laNgoaiVat`, `laFileDo`, `const doRes = DO_GLOBS.map(globToRe);` — bốn kim đột biến của ca VV7b (`tests/scripts/s4-args-vung-vat.test.mjs:344-347`) bám nguyên văn các dòng ấy.
- Test: `tests/scripts/phan-loai.test.mjs` (mới)

**Interfaces:**
- Produces:

```js
// feature-loop/scripts/lib/phan-loai.mjs
export const DO_GLOBS;               // ['tests/**','**/*.test.*','**/*.spec.*','**/spec/**','**/__tests__/**']
export const HO_SO_VAN_BAN_GLOBS;    // ['_acceptance/*/**/*.md','_acceptance/*/**/*.jsonl']
export const SCRIPT_DO_RE;           // /\.(sh|mjs|cjs|js|py)$/
export function phanLoai(p, { t1SkipGlobs = [] } = {}) // → 'ngoai' | 'thuoc' | 'ho-so' | 'vat'
```

  Thứ tự xét trong `phanLoai`: (1) khớp `t1SkipGlobs` → `'ngoai'`; (2) khớp `DO_GLOBS`, hoặc bằng `_acceptance/config.yaml`, hoặc nằm dưới `_acceptance/<slug>/` VÀ (tên là `evals.yaml` · có đoạn `/rang/` · khớp `SCRIPT_DO_RE`) → `'thuoc'`; (3) mọi đường khác dưới `_acceptance/` → `'ho-so'`; (4) còn lại → `'vat'`. `globToRe` nhập từ `../carry-plan.mjs` (bản bên viết sẵn có) — không chép bản thứ ba.

- [ ] **Step 1: Viết ca đỏ.** `PL1`: ma trận viết-trước, MỖI hàng `[đường, lớp mong đợi]`, số khẳng định in ra bằng số hàng: `tests/scripts/a.test.mjs`→thuoc · `src/x.spec.ts`→thuoc · `pkg/__tests__/b.js`→thuoc · `_acceptance/config.yaml`→thuoc · `_acceptance/demo/evals.yaml`→thuoc · `_acceptance/demo/rang/a.mjs`→thuoc · `_acceptance/demo/rang.sh`→thuoc · `_acceptance/demo/contract.md`→ho-so · `docs/x.md` với `t1SkipGlobs:['docs/**']`→ngoai · `src/a.js`→vat · `scripts/gate-card.js`→vat. `PL4` (tệp máy ghi, gọi tên đích danh): `_acceptance/demo/run-log.jsonl` · `_acceptance/demo/decisions.jsonl` · `_acceptance/demo/s4-args.json` · `_acceptance/demo/evidence/E3-1.png` · `_acceptance/demo/card.html` · `_acceptance/demo/figures/a.png` · `_acceptance/demo/duong-nen.md` · `_acceptance/demo/usage-report.md` → tất cả `ho-so`; `tests/scripts/fixtures/routing-baseline.txt` với `t1SkipGlobs` chứa đúng đường ấy → `ngoai` (không phải `thuoc`). `PL2` (chiều đỏ): với TỪNG vế của lớp thước, chép module sang thư mục tạm, vô hiệu đúng vế ấy, nhập bản sao bằng `import(pathToFileURL(…))` → đúng ô của vế ấy lật, mọi ô khác giữ nguyên; thông điệp `PASS: PL2 go tung ve — dung o cua ve ay lat, khong o nao khac`. `PL3` (một nguồn): dùng `s4Mutant`-kiểu chép trọn `feature-loop/`, trong bản sao của MODULE đổi `DO_GLOBS` và `HO_SO_VAN_BAN_GLOBS` thành `[]` (module khi đó trả `vat` cho mọi đường ngoài hồ sơ), chạy `s4-args.mjs` của bản sao trên fixture có đổi `_acceptance/demo/ghi-chu.md` và `tests/x.test.mjs` → `args.vungVat` CÓ thêm `_acceptance/demo/ghi-chu.md` và `args.fileDoTrongDiff` MẤT `tests/x.test.mjs` so với lần chạy bằng cây thật.
- [ ] **Step 2: Chạy, thấy đỏ** (`Cannot find module …/lib/phan-loai.mjs`).
- [ ] **Step 3: Viết module** theo Interfaces; trong `s4-args.mjs` thêm `import { DO_GLOBS, HO_SO_VAN_BAN_GLOBS } from './lib/phan-loai.mjs';` cạnh dòng `import { globToRe } from './carry-plan.mjs';` và XOÁ hai dòng khai hằng cũ.
- [ ] **Step 4: Chạy.** `node tests/scripts/phan-loai.test.mjs` → 4 PASS; `node tests/scripts/s4-args-vung-vat.test.mjs && node tests/workflows/vung-vat-mutants.test.mjs` giữ màu (đây là E13, E14).
- [ ] **Step 5: Commit** `feat(phan-loai): một nguồn bốn lớp ngoài · thước · hồ sơ · vật (AC-10)`.

**Verify:** `node tests/scripts/phan-loai.test.mjs && node tests/scripts/s4-args-vung-vat.test.mjs && node tests/workflows/vung-vat-mutants.test.mjs`

### Task 4: Bộ đếm vật · thước · nhát — làn A, sau Task 3 · `independent: false` · phục vụ E15, E16

**Files:**
- Create: `feature-loop/scripts/thuoc-vat.mjs`
- Test: `tests/scripts/thuoc-vat.test.mjs` (mới)

**Interfaces:**
- Consumes: `phanLoai` (Task 3); `resolveConfigList(configText,'risk_tiers.t1_skip_globs')` qua `--ag-root` như `s4-args.mjs:62-74`.
- Produces — CLI `node thuoc-vat.mjs --root <repo> --slug <slug> [--ag-root <dir>] [--json] [--write] [--giua-hai-luot] [--target <sha>]`, và hàm xuất `export function demThuocVat({ root, slug, t1SkipGlobs }) → { san: string|null, ghiChu: string|null, vat:[number,number], thuoc:[number,number], hoSo:[number,number], nhat:number, lan:number, tepThuoc:string[] }`. Task 5 nhập đúng hàm này.
  - Mốc sàn: `git log --reverse --format=%H -S'status: implemented' -- _acceptance/<slug>/contract.md` dòng đầu; rồi nếu sổ quyết định tại HEAD có dòng mà `decision` bắt đầu bằng `trần thước — `, lấy commit ĐẦU TIÊN đưa chuỗi id của dòng sổ MỚI NHẤT như thế vào tệp (`git log --reverse --format=%H -S'<id>' -- _acceptance/<slug>/decisions.jsonl`) — commit nào muộn hơn thì là mốc sàn. Dòng sổ chưa commit không có commit nào → không dời mốc.
  - Nhát: với mỗi commit trong `git rev-list --reverse <san>..HEAD`, lấy tệp bằng `git show --name-only --format= <h>`, phân lớp; có `thuoc` và không `vat` → `nhat++`; có cả hai → `lan++`.
  - Dòng: `git diff --numstat <san>..HEAD` gom theo lớp (tệp nhị phân đếm 0).
  - Không có mốc sàn → mọi số 0, `ghiChu: 'chua co moc san (hop dong chua tung implemented)'`, mã 0.
  - `--giua-hai-luot`: đọc `run-log.jsonl`, lấy hai dòng `kind:"round-tally"` cuối; mỗi lượt kiểm sha thuần nhất trên MỌI dòng cùng `round` có trường `sha` (như `carry-plan.mjs:159-164`); không thuần nhất hoặc thiếu lượt → in `khong liet ke duoc: <lý do>` và thoát mã 3; ngược lại in các tệp lớp `thuoc` của `git diff --name-only <shaA>..<shaB>`.
  - `--write`: nối MỘT dòng vào `_acceptance/<slug>/run-log.jsonl` theo khuôn marker trong chính tệp script:

```js
// <<<THUOC-VAT-LINE
// {"kind":"thuoc-vat","ts":"<ISO>","round":<n>,"san":"<sha>","vat":[<a>,<b>],"thuoc":[<c>,<d>],"ho_so":[<e>,<f>],"nhat":<k>,"lan":<m>,"tep_thuoc":["<đường>"]}
// THUOC-VAT-LINE>>>
```

    `round` = số `round` lớn nhất trong run-log (0 khi run-log rỗng).

- [ ] **Step 1: Ca đỏ.** Fixture: kho có hồ sơ `demo`, commit «S3» thêm `src/a.js` + `tests/a.test.mjs` ×3 lần, commit đưa hợp đồng sang `status: implemented`, rồi hai commit chỉ chạm `tests/a.test.mjs`, một commit chỉ chạm `src/a.js`. `TV1`: `nhat===2`, `lan===0`, `vat`/`thuoc` khớp `git diff --numstat` tính độc lập trong ca. `TV2` (chiều im, TDD): ba commit thước trước mốc sàn không vào `nhat`. `TV3`: hồ sơ chưa từng implemented → `nhat===0`, ghi chú có `chua co moc san`, mã 0. `TV4` (chiều đỏ): bản sao script thay lệnh tìm mốc sàn bằng commit đầu của hồ sơ → `nhat` thành 5, ca ghi `PASS: TV4 dot bien moc san — TV2 do` khi số đổi. `TV7`: thêm một commit chạm cả `src/a.js` lẫn `tests/a.test.mjs` → `nhat` KHÔNG tăng, `lan===1`; bản sao đột biến đếm mọi commit chạm thước → `nhat` tăng, ca ghi PASS khi kết luận lật. `TV5`: fixture ghi hai dòng `round-tally` với sha của hai commit thật (giữa chúng đổi một tệp thước, một tệp vật, một tệp hồ sơ) → `--giua-hai-luot` in ĐÚNG tệp thước, không hai tệp kia. `TV6`: thêm một dòng eval cùng `round` mang sha khác → in `khong liet ke duoc`, mã 3.
- [ ] **Step 2–4:** đỏ → viết script → `node tests/scripts/thuoc-vat.test.mjs` 7 PASS.
- [ ] **Step 5: Commit** `feat(thuoc-vat): bộ đếm vật · thước · nhát suy từ git, cờ giữa-hai-lượt (AC-11)`.

**Verify:** `node tests/scripts/thuoc-vat.test.mjs`

### Task 5: Trần nhát sửa thước trong bộ sinh args — làn A, sau Task 4 · `independent: false` · phục vụ E17

**Files:**
- Modify: `feature-loop/scripts/s4-args.mjs` — ngay sau khối tính `round` (sau dòng `round = Math.max(...nums) + 1;` và ngoặc đóng của nó), TRƯỚC khối carry.
- Test: `tests/scripts/s4-args-tran-thuoc.test.mjs` (mới)

**Interfaces:** Consumes `demThuocVat` (Task 4). Produces: mã thoát **4**, không tệp args, stderr:

```
s4-args: tran nhat sua thuoc: <k> nhat o implemented (tran 3) — KHONG sinh args.
  Ba loi, nguoi chon mot:
  (1) khai gioi han co ten — ghi Known limits cho phep do dang va, lan cham ke chap nhan no
  (2) doi cach do — thay phep do, khong va tiep phep do cu
  (3) mo vong co chu ngu la thuoc — dan dung mot dong:
      /feature-loop:feature-loop "thước của <slug>: <tệp thước đã chạm, cách nhau dấu phẩy>"
  Chon (1) hoac (2): ghi mot dong so quyet dinh mo dau bang «trần thước — » roi commit; moc san doi toi do.
```

```js
// ── trần nhát sửa thước (thuoc-co-cua AC-12): máy giữ, không dặn bằng lời ──
const TRAN_NHAT = 3;
const dem = demThuocVat({ root, slug: flags.slug, t1SkipGlobs });
if (dem.nhat >= TRAN_NHAT) { console.error(thongDiepTran(dem, flags.slug)); process.exit(4); }
```

  (`t1SkipGlobs` khai ở khối `NGOAI-VAT` phía trên — đặt khối trần SAU khối ấy.)

- [ ] **Step 1: Ca đỏ.** Cùng fixture với Task 4. `TT1` (đối chứng dương, im): hai nhát → mã 0, có tệp `--out`. `TT2` (đỏ, thêm đúng một commit thước): mã 4, tệp `--out` KHÔNG tồn tại, stderr chứa `tran nhat sua thuoc: 3 nhat`, chứa cả ba chuỗi `(1) khai gioi han co ten` · `(2) doi cach do` · `(3) mo vong co chu ngu la thuoc`, và ĐÚNG MỘT dòng bắt đầu bằng `/feature-loop:feature-loop "thước của demo:`. `TT3` (van): nối dòng sổ `{"id":"d-…-9","type":"revisit","decision":"trần thước — khai giới hạn E2",…}` rồi commit → mã 0, có tệp. `TT4`: cùng dòng sổ nhưng KHÔNG commit → vẫn mã 4. `TT5` (im): sau mốc sàn chỉ có ba commit chạm `run-log.jsonl` + `decisions.jsonl` và ba commit lẫn → mã 0, có tệp.
- [ ] **Step 2–4:** đỏ → viết → `node tests/scripts/s4-args-tran-thuoc.test.mjs` 5 PASS; `node tests/scripts/s4-args-not-run.test.mjs && node tests/scripts/s4-args-expected-exit.test.mjs && node tests/scripts/s4-args-delta.test.mjs && node tests/scripts/s4-args-main-branch.test.mjs` giữ màu.
- [ ] **Step 5: Commit** `feat(s4-args): trần 3 nhát sửa thước ở implemented — từ chối sinh args, ba lối, van bằng dòng sổ (AC-12)`.

**Verify:** `node tests/scripts/s4-args-tran-thuoc.test.mjs`

### Task 2: Lượt chấm nói ra ô không-chạy — làn B · `independent: true` · phục vụ E2

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` — chú thích đầu tệp (`:13-49`, thêm `evalsNotRun?`), prompt của bước tổng hợp (khoảng `:1405-1416`), khối trả về chạy khô (`:609-624`, thêm `evalsNotRun`).
- Test: `tests/workflows/not-run-luot-cham.test.mjs` (mới)

**Interfaces:** Consumes `args.evalsNotRun?: string[]` (Task 1 viết). Produces: prompt của agent nhãn `synthesize:report` chứa ĐÚNG MỘT dòng `không chạy theo hồ sơ: <id, id>` kèm câu dặn «KHÔNG viết hàng bảng và KHÔNG viết khối `- eval:` nào cho các id này — báo cáo chỉ nói ra chúng bằng dòng ấy»; không có khoá → không chữ nào được thêm.

- [ ] **Step 1: Ca đỏ** dùng `runWorkflow` của `tests/workflows/harness.mjs` với responder trả kết quả xanh như ca W03 (`tests/workflows/acceptance-verify.test.mjs:77-120`). `NRW1`: args có `evalsNotRun:['E9']` và `evals` không chứa E9 → không lời gọi nào có prompt chứa lệnh của E9; prompt của lời gọi nhãn bắt đầu `synthesize` có đúng một lần chuỗi `không chạy theo hồ sơ: E9`. `NRW2` (đỏ, cùng fixture bỏ khoá) → chuỗi ấy xuất hiện 0 lần. `NRW3` (đọc-cũ): hai lần chạy — args đời cũ, và cùng args với `evalsNotRun: undefined` — cho cùng `verdict` và cùng `calls.length`.
- [ ] **Step 2–4:** đỏ → sửa → `node tests/workflows/not-run-luot-cham.test.mjs` 3 PASS; `node tests/workflows/acceptance-verify.test.mjs` giữ màu.
- [ ] **Step 5: Commit** `fix(acceptance-verify): báo cáo nói ra ô không-chạy bằng một dòng (AC-1)`.

**Verify:** `node tests/workflows/not-run-luot-cham.test.mjs`

### Task 6: Lệnh suite tuần tự — làn B, sau Task 2 · `independent: false` · phục vụ E11

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js:664-670` (thunk 1 của hàng rào), `:609-624` (chạy khô), chú thích đầu tệp.
- Test: `tests/workflows/suite-tuan-tu.test.mjs` (mới)

**Interfaces:** Produces `dryRun` trả thêm `commandGroups: { songSong: string[], tuanTu: string[] }`; hợp hai mảng = `distinctCommands`, giao = rỗng.

```js
// Tư cách SUITE xét theo danh sách lệnh suite của args (so chuỗi lệnh), KHÔNG theo
// «lệnh không có eval đi kèm»: lệnh suite trùng lệnh của một eval bị gộp ở byCmd nên
// mảng eval của nó không rỗng (thuoc-co-cua, phản biện F1).
const SUITE_SET = new Set(args.suiteCommands || []);
const cmdTuanTu = distinctCmds.filter(c => SUITE_SET.has(c));
const cmdSongSong = distinctCmds.filter(c => !SUITE_SET.has(c));
```

  Thunk 1 thành: `async () => { const [ss, tt] = await Promise.all([ parallel(cmdSongSong.flatMap(…như cũ…)), (async () => { const out = []; for (const cmd of cmdTuanTu) for (let n = 0; n < cmdRuns(cmd); n++) out.push(await agentCuaLenh(cmd, n).catch(() => null)); return out; })() ]); return [...ss, ...tt]; }` — `agentCuaLenh` là đúng lời gọi `agent(...)` hiện có của khối, tách thành hàm để hai nhánh dùng CHUNG một prompt (không chép prompt).

- [ ] **Step 1: Ca đỏ.** Responder ghi `{label,'start'}` khi nhận lời gọi `machine:` và `{label,'end'}` sau `setTimeout(…, 30)` (mẫu cờ thứ tự của W44, `tests/workflows/acceptance-verify.test.mjs:2545-2572` — cờ thứ tự, KHÔNG ngưỡng đồng hồ). `ST0` (đối chứng dương): 2 lệnh eval + 3 lệnh suite → đủ 5 lời gọi `machine:`. `ST1`: với mọi cặp lệnh suite liền nhau, `start` của lệnh sau đứng SAU `end` của lệnh trước. `ST2`: hai lệnh eval có `start` của cả hai trước `end` đầu tiên. `ST3`: `dryRun` trả `commandGroups` đúng hai nhóm, mỗi lệnh đúng một nhóm; và với responder trả CÙNG bộ kết quả, `verdict` · `failedEvals` · `blocked` của nguồn thật bằng của bản sao trong bộ nhớ đã khôi phục mảng phẳng. `ST4` (đỏ): `srcOverride` khôi phục mảng phẳng (kim = dòng `const cmdTuanTu = distinctCmds.filter(c => SUITE_SET.has(c));` thay bằng `const cmdTuanTu = [];` cùng `cmdSongSong = distinctCmds`) → phép kiểm của ST1 cho kết quả đỏ; ca in `PASS: ST4 khoi phuc mang phang — suite chong nhau` và khẳng định kim còn trong nguồn thật. `ST5`: một lệnh vừa trong `suiteCommands` vừa là `cmd` của một eval → nằm ở `commandGroups.tuanTu` và không chồng lệnh suite nào; `srcOverride` phân nhóm theo `(byCmd.get(c)||[]).length === 0` → ST5 đỏ, ca ghi PASS khi kết luận lật.
- [ ] **Step 2–4:** đỏ → sửa → `node tests/workflows/suite-tuan-tu.test.mjs` 6 PASS; `bash tests/workflows/run-tests.sh` xanh (suite này 2 giây).
- [ ] **Step 5: Commit** `feat(acceptance-verify): lệnh suite chạy tuần tự, lệnh eval giữ song song (AC-9)`.

**Verify:** `node tests/workflows/suite-tuan-tu.test.mjs && bash tests/workflows/run-tests.sh`

### Task 7: Đường nền hạ tầng — làn C · `independent: true` · phục vụ E8, E9

**Files:**
- Create: `feature-loop/scripts/duong-nen.mjs`, `skills/acceptance/references/duong-nen-template.md`
- Test: `tests/scripts/duong-nen.test.mjs` (mới)

**Interfaces:**
- CLI: `node duong-nen.mjs --root <repo> --slug <slug> [--base <ref>] [--ag-root <dir>] [--cache-root <dir>]`. Mã: 0 nền xanh · 1 nền đỏ (VẪN ghi tệp) · 2 không chạy được (không phải kho git · thiếu `_acceptance/config.yaml` · thiếu `feature_loop.suite_keys`) — KHÔNG ghi tệp nào.
- Bốn chân, mỗi chân `xanh | do | bo-qua`, dòng đỏ theo khuôn ghim:
  - `nen cong-cu: THIEU <từ> (khoa <executors.…>)` — từ đầu của lệnh sau khi bỏ các phép gán `TEN=gia-tri` đứng trước; hỏi máy bằng `spawnSync('bash',['-lc','command -v "$1"','_',tu])`. Quét mọi khoá `executors.<loại>.<tên>` đọc bằng `resolveConfigKey`/bộ đọc khối của `evidence-core.cjs`.
  - `nen suite: DO SAN <khoá> ma <n>` · `nen suite: CAY BAN SAU SUITE <tệp>` — chụp `git status --porcelain` trước; mỗi lệnh suite một `spawnSync('bash',['-lc',cmd],{cwd:root})` LẦN LƯỢT; chụp lại, mọi dòng mới là một dòng đỏ.
  - `nen luoi: <k> vi pham co san` rồi từng dòng `VIOLATION …` nguyên văn — chạy `bash <pm> <root> --base <base> --no-t1-escape`, `<pm>` = `<root>/scripts/pre-merge-check.sh` nếu có (bản vendored, thứ CI chạy) không thì `<agRoot>/scripts/pre-merge-check.sh`; `<base>` = `--base`, vắng thì `git merge-base <nhánh gốc> HEAD` với nhánh gốc dò như `s4-args.mjs` (`origin/HEAD` → main/master/develop/trunk); không dò được → chân `bo-qua` kèm lý do. Lời gọi KHÔNG bao giờ mang `--slug`.
  - `nen engine: LECH <tệp> (<bản A> ≠ <bản B>)` · `nen engine: tu-host` — danh sách tệp RÚT từ khối `INIT-CI-COPY-LIST` của `<agRoot>/commands/acceptance-init.md` (mọi đường `scripts/…` hoặc `lib/…` trong khối); băm sha256 ở bản vendored (`<root>/`), bản cache (`node resolve-plugin.mjs --plugin acceptance-gate --json` với `--cache-root` truyền tiếp; không có cache → vế ấy `bo-qua`), bản đang chạy (`agRoot`). `realpath(root) === realpath(agRoot)` → `tu-host`, chân xanh.
- Đầu ra `_acceptance/<slug>/duong-nen.md` theo khuôn marker trong `duong-nen-template.md`:

```markdown
<!-- <<<DUONG-NEN-TEMPLATE -->
---
slug: {slug}
at: {ISO}
sha: {sha}
nen: {xanh|do}
cong_cu: {xanh|do|bo-qua}
suite: {xanh|do|bo-qua}
luoi: {xanh|do|bo-qua}
engine: {xanh|do|bo-qua}
---

## Dòng đỏ

- {nguyên văn một dòng đỏ, mỗi dòng một bullet; nền xanh thì đúng một bullet «không có»}
<!-- DUONG-NEN-TEMPLATE>>> -->
```

  Script đọc khuôn này từ `<agRoot>/skills/acceptance/references/duong-nen-template.md` (không chép khuôn vào mã); thiếu tệp khuôn → mã 2.

- [ ] **Step 1: Ca đỏ.** Fixture `dungKho()`: kho git tạm có `_acceptance/config.yaml` (hai suite: `executors.test.a: "bash suite-a.sh"`, `executors.test.b: "bash suite-b.sh"`; mỗi script ghi dấu `a.start`/`a.end` vào thư mục do biến môi trường `NEN_DAU` trỏ tới — ngoài cây), `scripts/pre-merge-check.sh` + `lib/` chép TRỌN từ KIT (bản vendored), hồ sơ `demo`. `CACHE` = thư mục tạm dựng theo bố cục `<cache>/<marketplace>/acceptance-gate/9.9.9/` chép `scripts/`, `lib/`, `commands/`, `skills/` từ KIT. Mọi lần chạy truyền `--ag-root <KIT> --cache-root <CACHE>`. Ca: `NEN0` xanh trọn, mã 0, tệp có `nen: xanh`, đúng một bullet «không có». `NEN1` đổi `executors.test.a` thành `khong-co-lenh-nay-xyz --x` → `nen cong-cu: THIEU khong-co-lenh-nay-xyz (khoa executors.test.a)`, mã 1. `NEN2` suite-b `exit 3` → `nen suite: DO SAN executors.test.b ma 3`. `NEN3` suite-a ghi `rac.txt` vào cây → `nen suite: CAY BAN SAU SUITE rac.txt`. `NEN4` khẳng định ĐỦ BỐN dấu có mặt rồi `a.end` có mtime/thứ tự ghi trước `b.start` (script ghi số thứ tự tăng dần vào MỘT tệp `thu-tu.log` bằng `>>`, ca đọc thứ tự dòng — không so đồng hồ). `NEN4b` bản sao script đổi vòng tuần tự thành `Promise.all` với `spawn` → phép kiểm của NEN4 đỏ; ca in `PASS: NEN4b dot bien chay cung luc — suite long nhau`. `NEN8` thư mục không phải kho git → mã 2 và `existsSync(duong-nen.md) === false`. `NEN5` nhánh `main` của fixture mang một hồ sơ `status: verified` không có `evidence-report.md` (vi phạm lưới có thật của bản vendored) → tệp chứa `nen luoi:` và nguyên văn dòng `VIOLATION [`; ca bọc `pre-merge-check.sh` của fixture bằng một vỏ ghi lại `"$@"` rồi gọi bản thật → đối số KHÔNG chứa `--slug`, CÓ `--base`. `NEN5-IM` không nợ → `luoi: xanh`. `NEN6` sửa một byte ở `lib/md-section.cjs` của fixture → `nen engine: LECH lib/md-section.cjs`. `NEN6-IM` khớp → `engine: xanh`; chạy với `--root <KIT-bản-sao> --ag-root <cùng thư mục>` → `nen engine: tu-host`, không cờ. `NEN7` bản sao `commands/acceptance-init.md` trong một `--ag-root` tạm bỏ một dòng khỏi marker → số tệp được băm (script in `engine: bam <n> tep` ra stderr) giảm đúng một. `NEN9` `--cache-root` trỏ thư mục rỗng → stderr có `engine: cache bo-qua`, chân engine KHÔNG đỏ.
- [ ] **Step 2–4:** đỏ → viết → `node tests/scripts/duong-nen.test.mjs` 13 PASS.
- [ ] **Step 5: Commit** `feat(duong-nen): đường nền hạ tầng bốn chân ở S1, không LLM (AC-6, AC-7)`.

**Verify:** `node tests/scripts/duong-nen.test.mjs`

### Task 8: Bỏ-qua phải thấy định nghĩa phép đo — làn D · `independent: true` · phục vụ E4–E7

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs:235-282` (khối `SKIP-UNCHANGED-PREDICATE`), `docs/adr/0019-ban-ghi-dinh-tuyen-la-vat-t1-may-sinh.md` (hai lời khai giới hạn, mỗi cái kèm một ngưỡng đang đếm)
- Move: `_acceptance/bo-qua-phai-thay-dinh-nghia-phep-do/contract.md` và `evals.yaml` → `_acceptance/bo-qua-phai-thay-dinh-nghia-phep-do/su-lieu/` (bằng `git mv`); Create: `_acceptance/bo-qua-phai-thay-dinh-nghia-phep-do/opportunity.md` từ khối `OPP-FRONTMATTER-TEMPLATE`, `stage: archived`, mục «Vấn đề & ai gặp» một đoạn: gộp vào `thuoc-co-cua` AC-3…AC-5 (sổ quyết định dòng 6), nguyên văn ở `su-lieu/`.
- Test: `tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs` (mới)

**Interfaces:** Trong khối vị ngữ, thêm tập `tepDinhNghia` SUY từ biến làn đã có: đường config (chính biến mà `resolveConfigKey` đọc, quy về đường tương đối so với gốc git bằng `git rev-parse --show-prefix`) và `evals.yaml` của TỪNG phần tử `perSlug`. Tệp trong `git diff --name-only <pin>..` thuộc tập ấy → KHÔNG bỏ qua, in `repin-lane: KHÔNG bỏ qua — tệp định nghĩa phép đo đổi so với pin: <tệp>`.

- [ ] **Step 1: Ca đỏ** trên fixture của `tests/scripts/repin-lane-skip-unchanged.test.mjs` (chép hàm dựng kho của nó; đọc tệp ấy trước). `DN1` đổi `executors` từ lệnh xanh sang `bash -c "exit 7"` → làn chạy và ĐỎ (mã khác 0, không ghi dòng repin), stdout/stderr gọi tên `_acceptance/config.yaml`; đối chứng dương: cây bằng pin → bỏ qua. `DN2` thêm eval `E9` vào `evals.yaml` → làn chạy trọn, dòng repin có `E9` trong `evals_exit`. `DN3-IM` bốn ô của SK1b vẫn bỏ qua; bản sao đột biến coi mọi đường có đoạn `_acceptance` là định nghĩa → ba ô đầu lật. `DN4a` gốc kho là thư mục con `pkg/a/` của một kho git lớn hơn. `DN4b` lượt ghim hai slug, đổi `evals.yaml` của slug thứ hai. `DN4c` hai slug `demo` và `demo-2`, đổi `evals.yaml` của `demo-2` trong lượt chỉ ghim `demo-2`. Bản sao đột biến thay tập suy-ra bằng hai chuỗi `'_acceptance/config.yaml'` và `'_acceptance/demo/evals.yaml'` → ĐỎ ở TỪNG ca DN4a/b/c. `DN5` ADR 0019 có hai khối `Giới hạn đã khai` mỗi khối có dòng `Ngưỡng đang đếm:`; gỡ một khối trong bản sao → đỏ gọi tên giới hạn; thêm khối thứ ba hoặc sửa văn → im.
- [ ] **Step 2–4:** đỏ → sửa → `node tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs` 7 PASS (`DN1 DN2 DN3-IM DN4a DN4b DN4c DN5`); `node tests/scripts/repin-lane-skip-unchanged.test.mjs && node tests/scripts/repin-lane.test.mjs` giữ màu; `node scripts/start-scan.mjs --root . | grep -c bo-qua-phai-thay` — hồ sơ không còn ở nhóm chờ Cổng Phạm vi và không ở nhóm hỏng.
- [ ] **Step 5: Commit** `fix(repin-lane): bỏ-qua thấy tệp định nghĩa phép đo; hồ sơ draft bo-qua cho nghỉ (AC-3, AC-4, AC-5)`.

**Verify:** `node tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs`

---

## GIAI ĐOẠN 2 — làn thẻ và chữ (tuần tự, vòng chính, sau khi gộp bốn làn)

### Task 9: Ba chỗ trên thẻ — `independent: false` · phục vụ E3, E10, E18

**Files:**
- Modify: `scripts/gate-card.js` — `:786` và `:902-904`/`:1030` (mã đã khai) · khối cờ Cổng Phạm vi `:665-704` + thân thẻ Cổng 1 (khối «Nền hạ tầng») · khối «Phán quyết đối kháng» `:942-954` + payload `--extract` Cổng 2 (`:892`)
- Test: `tests/scripts/gate-card-expected-exit.test.mjs`, `tests/scripts/gate-card-duong-nen.test.mjs`, `tests/scripts/gate-card-thuoc-vat.test.mjs` (mới); dùng `tests/scripts/gate-fixture.mjs` (`mkWs`, `card`, `REPORT_PASS`)

**Interfaces:**
- Mã đã khai: nạp `lib/eval-yaml.cjs` trong `try/catch` như `lib/lop-nhin-thay.cjs` ở `:765`; `const declared = (() => { try { const r = EY.expectedExits(evalsT); return r.errs.length ? new Map() : r.byId; } catch { return new Map(); } })();` rồi `const maDat = (id, code) => code === '0' || code === String(declared.get(id) ?? 0);` thay cho `e.exit_code === '0'` ở `evComplete` và ở phép đếm «CHƯA đạt».
- Khối nền (Cổng 1): `const nenT = read(path.join(dir,'duong-nen.md'))`; có tệp → khối `<div class="grp gnot"><h3>Nền hạ tầng</h3>` bốn dòng chân + mỗi bullet của `## Dòng đỏ` in NGUYÊN VĂN (đã escape HTML); `nen: do` → cờ `fwarn` hằng `MSG_NEN_DO = 'Nền hạ tầng có chân ĐỎ — đỏ ở đây không phải lỗi của vòng này; quyết nó trong gói này trước khi duyệt.'`; tệp vắng → cờ `fwarn` hằng `MSG_NEN_VANG = 'Chưa có số liệu nền hạ tầng — hồ sơ sinh trước bản này, hoặc đường nền chưa chạy xong.'`. Thêm `nen: {present, nen, cong_cu, suite, luoi, engine, do: [...]}` vào payload `--extract` Cổng 1. Mỗi hằng `MSG_` mới phải có dòng thuật tương ứng trong `commands/acceptance-card.md` (răng `khong-ve-the-ma`).
- Dòng vật-thước-nhát (Cổng 2): đọc `run-log.jsonl`, lấy dòng `kind==="thuoc-vat"` cuối cùng parse được; có → thêm `<p class="li">Vật +a/−b · thước +c/−d · nhát sửa thước k (lẫn m)</p>` vào khối phán quyết đối kháng và `thuoc_vat: {…}` vào `--extract`; dòng có `"kind":"thuoc-vat"` mà parse hỏng → cờ `fwarn` `MSG_THUOC_VAT_HONG = 'Không đọc được dòng đếm vật/thước trong run-log — thẻ không in số.'`; không dòng nào → KHÔNG in gì, khoá `thuoc_vat` là `null`, `routing` không đổi.

- [ ] **Step 1–4 (mã đã khai):** ca `GX1…GX5` đúng chữ E3 (GX5: chép `lib/` + `scripts/gate-card.js` sang thư mục tạm giữ bố cục tương đối, thay thân `expectedExits` bằng `return { byId: new Map(), errs: [] };` → GX2 lật); ca láng giềng G07–G17 trong `tests/scripts/run-tests.sh` không chạy trọn ở đây — chạy `node tests/scripts/gate-card-lmcms.test.mjs && node tests/scripts/gate-card-goal.test.mjs`. Commit `fix(gate-card): thẻ Cổng Bằng chứng đọc mã thoát đã khai từ expectedExits (AC-2)`.
- [ ] **Step 5–8 (khối nền):** ca `GN1…GN5` — MỌI `duong-nen.md` do `feature-loop/scripts/duong-nen.mjs` ghi trên fixture của Task 7 (nhập `dungKho` bằng cách tách nó ra `tests/scripts/duong-nen-fixture.mjs` dùng chung); GN5: bản sao script đổi tiền tố `nen cong-cu: THIEU` thành chuỗi khác + bản sao khuôn → GN2 đỏ. Commit `feat(gate-card): khối Nền hạ tầng trên thẻ Cổng Phạm vi, đọc-cũ bằng một cờ vàng (AC-8)`.
- [ ] **Step 9–12 (dòng đếm):** ca `GT1…GT4` — dòng run-log do `thuoc-vat.mjs --write` ghi trên fixture của Task 4 (tách hàm dựng kho ra `tests/scripts/thuoc-vat-fixture.mjs`); GT4: trên một hồ sơ fixture đã ký, chụp `routingLine()` (nhập từ `tests/scripts/routing-baseline.mjs`) ba lần — run-log không dòng đếm · sau khi `thuoc-vat.mjs --write` nối dòng · sau khi gỡ dòng ấy — cả ba chuỗi bằng nhau: dòng đếm là dòng báo, không bao giờ thành ô hỏi. Commit `feat(gate-card): một dòng vật · thước · nhát trên thẻ Cổng Bằng chứng (AC-13)`.
- [ ] **Step 13:** `node tests/scripts/gate-card-lmcms.test.mjs` (LM13, LM20 giữ màu — hồ sơ đã ký không đổi định tuyến). Thẻ lưu của `_acceptance/khoi-viec-cua-anh/evidence/` (ca P190): chạy `bash tests/plugins/fixtures/render-viec-cua-anh-cards.sh` vào thư mục tạm và `diff -r` với bản lưu — khác byte nào thì DỪNG, ghi sổ, đi nghi thức revisit + sinh lại + ghim lại riêng làn của hồ sơ ấy (sổ nhớ «Đổi khuôn /goal kéo P190»); không khác thì ghi một dòng vào thông điệp commit.

**Verify:** `node tests/scripts/gate-card-expected-exit.test.mjs && node tests/scripts/gate-card-duong-nen.test.mjs && node tests/scripts/gate-card-thuoc-vat.test.mjs && node tests/scripts/gate-card-lmcms.test.mjs`

### Task 10: Chữ chỉ dẫn, khuôn dòng sổ, từ vựng — `independent: false` · phục vụ E19, E25

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` — S1 thêm bước 0 «đường nền» (gọi `duong-nen.mjs` ở chế độ NỀN trước khi viết tệp nào; đỏ thì máy tự gỡ thứ gỡ được, thứ chỉ người gỡ được gom MỘT lần vào lời mời Cổng Phạm vi) · S4 bước 1 thêm nhánh «mã 4 = trần nhát sửa thước → DỪNG, trình nguyên văn ba lối» và bước «sau mỗi lượt chấm: `thuoc-vat.mjs --write`» · khối `DEC-ID-RECIPE` thêm ô tuỳ chọn `,"target":"<thuoc|vat|ho-so>"` SAU `impact`, giá trị chép từ `thuoc-vat.mjs --target`.
- Modify: `commands/acceptance-card.md` (dòng thuật cho ba hằng `MSG_` mới), `CONTEXT.md` (hai mục: **Nhát** — một commit sửa RIÊNG phép đo sau khi hợp đồng đã sang implemented; `_Avoid_`: «lần vá», «patch» · **Đường nền** — phép kiểm hạ tầng đo chạy ở đầu vòng trên cây chưa đụng; `_Avoid_`: «baseline» trần, vì chữ ấy đã chỉ dòng `kind: baseline` của run-log), `GUIDE.md` (mục S1/S4 tương ứng, một đoạn mỗi chỗ).
- Test: `tests/scripts/gate-card-dec-key.test.mjs` — thêm `DK14`, `DK15` theo đúng chữ E19.

- [ ] **Step 1:** đọc các ca ghim SKILL trước khi sửa: `grep -n "DEC-ID-RECIPE\|S4-ARGS-CLAUSE\|GOAL-TEMPLATE" tests/plugins/run-tests.sh tests/scripts/*.mjs | head -40` — mọi marker bị chạm phải giữ nguyên chữ mở/đóng; ca nào ghim số dòng hay nguyên văn thì sửa ca CÙNG commit.
- [ ] **Step 2–4:** DK14/DK15 đỏ → sửa khuôn → `node tests/scripts/gate-card-dec-key.test.mjs` xanh.
- [ ] **Step 5: Commit** `docs(feature-loop): S1 bước đường nền, S4 trần nhát, ô target của dòng sổ; hai mục từ vựng (AC-13, AC-15)`.

**Verify:** `node tests/scripts/gate-card-dec-key.test.mjs`

### Task 11: Hồi quy trọn và đưa hợp đồng sang implemented — `independent: false` · phục vụ E20–E24

- [ ] **Step 1:** chạy LẦN LƯỢT, một tiến trình nặng mỗi lúc, ở chế độ nền: `bash tests/scripts/run-tests.sh` → `bash tests/hooks/run-tests.sh` → `bash tests/plugins/run-tests.sh` → `bash tests/workflows/run-tests.sh` → `node scripts/product-map.mjs --root . --check`. Đỏ ở ca quét corpus (LM20 · P179 cộng P177 · RT13 · P161 · P190) → sửa theo khuôn của từng ca trong sổ nhớ «Hồ sơ mới làm ca corpus đỏ», không nới ca.
- [ ] **Step 2:** `node scripts/eval-coverage-lint.js . --slug thuoc-co-cua` sạch; mọi khoá `tcc_` trong `_acceptance/config.yaml` chạy tay một lượt, mỗi khoá mã 0.
- [ ] **Step 3:** `bash scripts/pre-merge-check.sh . --base origin/main` — ghi nguyên văn kết quả (hồ sơ còn ở `approved`/`implemented` nên lưới có thể nêu hồ sơ chưa arm; đó là trạng thái đúng trước S4).
- [ ] **Step 4:** đặt `status: implemented` trong `_acceptance/thuoc-co-cua/contract.md`, commit RIÊNG `chore(thuoc-co-cua): S3 xong — hợp đồng sang implemented` (commit này là MỐC SÀN của chính vòng), rồi dispatch S4 ngay: `node feature-loop/scripts/s4-args.mjs --slug thuoc-co-cua --root . --ag-root . --out _acceptance/thuoc-co-cua/s4-args.json`.

**Verify:** năm lệnh ở Step 1 đều mã 0.

---

## Self-Review

- **Phủ spec:** A1 → Task 1, 2 · A2 → Task 9 · A3 → Task 8 · đường nền → Task 7, khối thẻ → Task 9 · suite tuần tự → Task 6 · D1 → Task 3 · D2 → Task 4 · D3 → Task 5 · D4 → Task 9 (thẻ), Task 10 (ô `target`) · đọc-cũ: NRS3, NRW3, GN3, GT2, DK15, TV3 · tự ăn thuốc → Task 11 Step 4 (mốc sàn của chính vòng), Global Constraints.
- **Tên nhất quán:** `evalsNotRun` (Task 1 viết, Task 2 đọc) · `phanLoai`/`DO_GLOBS`/`HO_SO_VAN_BAN_GLOBS` (Task 3 xuất; Task 4 và `s4-args.mjs` nhập) · `demThuocVat` (Task 4 xuất, Task 5 nhập) · khuôn `THUOC-VAT-LINE` (Task 4 viết, Task 9 đọc) · khuôn `DUONG-NEN-TEMPLATE` (Task 7 viết, Task 9 đọc) · `commandGroups.{songSong,tuanTu}` (Task 6).
- **Tên ca khớp khoá executor:** NRS1–4 · NRW1–3 · GX1–5 · DN1 DN2 DN3-IM DN4a DN4b DN4c DN5 · NEN0 NEN1 NEN2 NEN3 NEN4 NEN4b NEN8 · NEN5 NEN5-IM NEN6 NEN6-IM NEN7 NEN9 · GN1–5 · ST0–5 · PL1–4 · TV1–4 TV7 · TV5 TV6 · TT1–5 · GT1–4 · DK14 DK15.
- **Chỗ biết trước là mỏng:** Task 1 phần `carry-plan.mjs` (phải đọc tệp mới biết nó giải `agRoot` thế nào — hai lối đã nêu đủ cả hai); Task 9 Step 13 có thể kéo theo một làn ghim lại riêng cho `khoi-viec-cua-anh` nếu thẻ lưu đổi byte.
