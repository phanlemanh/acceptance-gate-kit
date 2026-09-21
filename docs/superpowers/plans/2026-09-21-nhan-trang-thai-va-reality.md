# nhan-trang-thai-va-reality — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (tuần tự trong vòng chính — hạng T3, các task chia chung `lib/` và `scripts/pre-merge-check.sh`). Steps dùng `- [ ]`.

**Goal:** Test của kho thôi bị đếm là thước; thước chỉ-đọc trong lượt chấm; thẻ Cổng 2 gọi đúng tên cạnh gãy và mở ô ký kèm giá; trạng thái thứ bảy `da-cham-boi-thuc-te` qua thao tác cổng người thứ bảy; dòng ý định và dòng hiệu chuẩn.

**Architecture:** Hai vị từ thuần mới ở `lib/` (`nhan-canh-gay.cjs` cho cạnh gãy, `thucTe` trong `workspace-record.cjs` cho dòng quan sát) là MỘT nguồn cho mọi bên đọc (thẻ · lưới trước-merge · recheck · bộ quét · bản đồ). Bên viết của mỗi dòng sổ mới sống ở một khối marker trong thân lệnh cổng người; ca đo rút khuôn ấy (round-trip). Phần feature-loop đổi ba script (`phan-loai`, `s4-args`, `thuoc-vat`) + một dòng trong workflow chấm.

**Tech Stack:** Node ≥ 20 (ESM `.mjs` + CJS `.cjs`), bash (`pre-merge-check.sh`), bộ ca tự viết (`PASS:`/`FAIL:` + `Results:`), git trong fixture code sinh.

**Spec:** `docs/superpowers/specs/2026-09-21-nhan-trang-thai-va-reality-design.md` · hợp đồng `_acceptance/nhan-trang-thai-va-reality/contract.md` (13 AC) · `evals.yaml` (E1–E13).

## Global Constraints

- Tên ca = mã AC: `NT-AC*`, `NC-AC*`, `NL-AC*`, `NS-AC*`, `NO-AC*`, `NH-AC*`; mỗi ca in đúng `PASS: <tên> …` hoặc `FAIL: <tên> …` (khoá `executors.script.ntr_*` grep `PASS: <tên> ` có dấu cách).
- Mọi đường dẫn trong ca suy từ `import.meta.url`/`__dirname`, không hardcode ROOT. Fixture là kho git do code sinh trong `mkdtemp`.
- Mọi phép đo mới có cặp hai chiều trên CÙNG fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE). Bản sao đột biến lấy TRỌN thư mục (`git archive HEAD <dir>`), không chép danh sách tệp tay.
- Bản «trước vòng»: `git archive <cha của commit đầu đưa chuỗi NHAN-CANH-GAY vào scripts/gate-card.js> scripts lib skills` — sha là đầu ra `git log -S`, không gõ tay.
- Chuỗi nhãn đúng `CONTEXT.md` mục **Nhãn trạng thái**: «không đọc được ở đây» · «hệ thống chết» · «thước lệch».
- Đường đọc-cũ: hồ sơ không có trường/dòng/trạng thái mới → mọi bên đọc ra ĐÚNG như trước vòng.
- Không sửa byte nào dưới `_acceptance/<slug>/` của hồ sơ đã ký. Không `--no-verify`.
- Ngoài phạm vi (trả lại nếu lọt vào): Đ4 · Đ5 · Đ6 (`fileDoTrongDiff` giữ nguyên) · Đ10 · Đ7 đầy đủ · Đ11 · rollout ngoài `crm`.

## Tệp và trách nhiệm

| Tệp | Trách nhiệm | Task |
|---|---|---|
| `feature-loop/scripts/lib/phan-loai.mjs` | bỏ vế DO_GLOBS khỏi `laThuoc` | 1 |
| `feature-loop/scripts/s4-args.mjs` | gỡ trần; chụp thước vào `.acceptance-runs/<slug>/thuoc-truoc.json` + `thuocChup` trong args | 2, 3 |
| `feature-loop/scripts/chup-ho-so-da-thong.mjs` | `chupThuoc`, `soThuoc` | 3 |
| `feature-loop/scripts/thuoc-vat.mjs` | so sau lượt, dòng `thuoc-lech` (marker `THUOC-LECH-LINE`), thoát 5 | 3 |
| `feature-loop/skills/feature-loop/SKILL.md` · `GUIDE.md` · `scripts/gate-card.js` (GOAL-TEMPLATE) | gỡ đoạn «Mã 4», ví dụ lối trong khuôn goal (ba bản cùng lượt, P85) | 2 |
| `feature-loop/workflows/acceptance-verify.js` | dòng eval `cannot_run` mang `reason` | 4 |
| `lib/nhan-canh-gay.cjs` (mới) | `phanLoaiBlocked`, `canhGay`, `kyTrenCanhGay` | 4 |
| `scripts/gate-card.js` | thước lệch · cạnh gãy mở · hệ thống chết · câu nền đỏ · khối ý định | 5 |
| `commands/signoff.md` | khối marker `CANH-GAY-REVISIT-LINE`, lối `Mù-<n>` | 6 |
| `scripts/pre-merge-check.sh` · `scripts/recheck-evidence.cjs` | BLOCKED có chữ ký trên cạnh gãy; trạng thái thứ bảy | 6, 8 |
| `lib/workspace-record.cjs` | enum + `DA_DONG_THUC_TE` + `thucTe` | 7 |
| `scripts/start-scan.mjs` · `scripts/trang-thai-ho-so.cjs` · `scripts/product-map.mjs` | nhóm «đã chấm bởi thực tế» | 7 |
| `commands/observed.md` (mới) · `CLAUDE.md` · `tests/plugins/run-tests.sh` (P32) | thao tác cổng người thứ bảy | 9 |
| `scripts/hieu-chuan-moc.mjs` (mới) · `GUIDE.md` | dòng hiệu chuẩn | 10 |
| `skills/acceptance/references/contract-template.md` + comment `status:` các khuôn | liệt giá trị thứ bảy | 7 |

---

### Task 1: Test của kho là vật (AC-1 · E1) — independent: true

**Files:** Modify `feature-loop/scripts/lib/phan-loai.mjs:26-34` · Modify `tests/scripts/phan-loai.test.mjs` (PL1/PL4 ma trận: bốn đường test đổi kỳ vọng `thuoc`→`vat`; PL2 bỏ vế DO_GLOBS khỏi danh sách vế-đột-biến) · Create `tests/scripts/ntr-thuoc.test.mjs` (ca NT-AC1, NT-AC1-dot-bien).

**Interfaces:** Produces `phanLoai(p,{t1SkipGlobs})` — test kho ra `'vat'`. `DO_GLOBS` vẫn export (Task 3 dùng).

- [ ] Viết `ntr-thuoc.test.mjs` khung chung: `run(name, fn)` in `PASS: <name>`/`FAIL: <name> — <msg>`, cuối in `Results: <p> passed, <f> failed (ntr-thuoc)` và `process.exit(f?1:0)`; `KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')`.
- [ ] NT-AC1: ma trận viết trước
  ```js
  const MT = [['tests/scripts/a.test.mjs','vat'],['apps/api/test/x.spec.ts','vat'],['pkg/__tests__/b.js','vat'],['src/spec/c.rb','vat'],
              ['_acceptance/config.yaml','thuoc'],['_acceptance/s/evals.yaml','thuoc'],['_acceptance/s/rang/r.mjs','thuoc'],['_acceptance/s/do.sh','thuoc']];
  ```
  assert `sai.length===0 && n===MT.length` (n = số assert đã chạy).
- [ ] NT-AC1-dot-bien: `git archive HEAD feature-loop | tar -x -C <tmp>`; bản A thay `if (path.posix.basename(p) === 'evals.yaml') return true;` bằng chuỗi rỗng (assert tệp đổi) → đúng MỘT ô lật (`_acceptance/s/evals.yaml`→`ho-so`); bản B chèn lại `if (DO_GLOBS.map(globToRe).some(re => re.test(p))) return true;` đầu `laThuoc` → đúng bốn ô test lật về `thuoc`. Import bản sao bằng `pathToFileURL`.
- [ ] Chạy `node tests/scripts/ntr-thuoc.test.mjs` → FAIL NT-AC1 (bốn ô test ra `thuoc`).
- [ ] Sửa `laThuoc`: xoá dòng `if (doRes.some(re => re.test(p))) return true;` và `const doRes = …`; sửa comment đầu tệp (lớp `thuoc` không còn «tệp ca (DO_GLOBS)»; `DO_GLOBS` xuất khẩu cho ảnh chụp chỉ-đọc và `fileDoTrongDiff`).
- [ ] Sửa `phan-loai.test.mjs` theo vật mới; chạy cả hai tệp → PASS.
- [ ] Commit `feat(phan-loai): test của kho là vật, không còn là thước (AC-1)`.

### Task 2: Gỡ trần nhát (AC-2 · E2) — independent: false (sau Task 1)

**Files:** Modify `feature-loop/scripts/s4-args.mjs:418-440` · `feature-loop/skills/feature-loop/SKILL.md` (đoạn «Mã 4 …», câu ví dụ trong GOAL-TEMPLATE) · `GUIDE.md` (bản goal người đọc) · `scripts/gate-card.js` (hằng GOAL_TEMPLATE) · `tests/scripts/s4-args-tran-thuoc.test.mjs` (TT1–TT5 đổi theo vật mới: không còn mã 4) · `tests/scripts/ntr-thuoc.test.mjs` (NT-AC2, NT-AC2-dem-loi).

**Interfaces:** Consumes `demThuocVat` (không đổi). Produces: `s4-args` không bao giờ thoát 4.

- [ ] NT-AC2: dựng kho fixture (`git init`, `_acceptance/config.yaml` tối thiểu có `feature_loop.suite_keys: [executors.test.x]` + `executors.test.x: "true"`, hợp đồng `status: approved` commit, rồi `status: implemented` commit, rồi 3 commit chỉ đổi `_acceptance/s/evals.yaml`, nhánh `main`); chạy `node feature-loop/scripts/s4-args.mjs --slug s --root <fx> --out <fx>/a.json --ag-root <KIT>` → assert exit 0, `a.json` tồn tại, stderr không chứa `tran nhat sua thuoc` và `Ba loi`; `node feature-loop/scripts/thuoc-vat.mjs --root <fx> --slug s --json` → `nhat === 3`. Hàm dựng fixture `mkKho(opts)` dùng chung cho Task 3.
- [ ] NT-AC2-dem-loi: bản sao kho, `rm <fx>/.git/HEAD` → s4-args exit ≠ 0, stderr chứa `bộ đếm nhát sửa thước lỗi` HOẶC thông điệp git hỏng có tên (ghim chuỗi thật khi chạy lần đầu, rồi cố định trong ca).
- [ ] Chạy → FAIL NT-AC2 (exit 4).
- [ ] Xoá `TRAN_NHAT`, `thongDiepTran`, dòng `if (dem.nhat >= TRAN_NHAT) …`; giữ khối `const dem = (() => { try … catch … die })()` (bộ đếm lỗi vẫn chết có tên) và dùng `dem` cho không gì khác — nếu biến thành biến chết thì giữ lời gọi dưới tên `void demThuocVat(...)` trong `try` để chốt «bộ đếm lỗi thì dừng». Sửa comment khối.
- [ ] SKILL: xoá đoạn «**Mã 4 của script sinh-args = trần nhát sửa thước** …»; trong GOAL-TEMPLATE đổi `(vd chạm trần nhát sửa thước)` → `(vd ký trên cạnh gãy có tên)`; chép y hệt sang `GUIDE.md` và hằng `GOAL_TEMPLATE` của `gate-card.js`. Chạy ca P85 (`bash tests/plugins/run-tests.sh` lọc P85, hoặc lệnh ca tương ứng) → PASS.
- [ ] Sửa `s4-args-tran-thuoc.test.mjs`: ca đòi mã 4 đổi thành đòi thoát 0 + không thông điệp trần (tên ca giữ, thân theo vật mới). Chạy → PASS.
- [ ] Commit `feat(s4-args): gỡ trần nhát sửa thước và ba lối (AC-2)`.

### Task 3: Thước chỉ-đọc trong lượt chấm (AC-3 · E3) — independent: false

**Files:** Modify `feature-loop/scripts/chup-ho-so-da-thong.mjs` (thêm export) · `feature-loop/scripts/s4-args.mjs` (chụp + args) · `feature-loop/scripts/thuoc-vat.mjs` (so + marker) · `tests/scripts/ntr-thuoc.test.mjs` (NT-AC3-lanh/do/im).

**Interfaces:**
- Produces `chupThuoc(root, slug, doGlobs) → Map<rel, "sha256 mtime size">` và `soThuoc(truoc, sau) → [{tep, doi}]` với `doi ∈ 'đổi nội dung'|'thêm'|'xoá'` (bỏ «ghi lại, cùng nội dung»).
- Produces tệp `.acceptance-runs/<slug>/thuoc-truoc.json` = `{ schema: 1, slug, sha, tep: {<rel>: "<hash>"} }` và args `thuocChup: { file: <rel>, digest: <sha256 của JSON tep>, n }`.
- Produces dòng run-log (khối marker trong `thuoc-vat.mjs`):
  ```
  // <<<THUOC-LECH-LINE
  // {"kind":"thuoc-lech","ts":"<ISO>","round":<n>,"tep":[{"tep":"<đường>","doi":"<đổi nội dung|thêm|xoá>"}]}
  // THUOC-LECH-LINE>>>
  ```
  dựng bằng hàm `dongThuocLech(tep, {round, ts})` theo cùng nếp `dongThuocVat` (rút khoá từ marker, lệch → ném).
- [ ] Ca NT-AC3-lanh/do/im như E3 (ma trận 4 mũi, mỗi mũi bản sao kho riêng; `assert byte đổi` trước khi tin đỏ; mũi test kho = một tệp `tests/a.test.mjs` tracked). Đọc khoá dòng bằng cách rút khối marker từ `thuoc-vat.mjs` (không gõ literal).
- [ ] Chạy → FAIL.
- [ ] `chupThuoc`: danh sách = `_acceptance/config.yaml`, `_acceptance/<slug>/evals.yaml`, đi cây `_acceptance/<slug>/rang/`, cộng `git ls-files` lọc `DO_GLOBS.map(globToRe)`; tệp vắng thì bỏ (vắng→có ở lần sau là «thêm»). Băm bằng `dauVet` sẵn có, `soThuoc` so phần băm (`v.split(' ')[0]`).
- [ ] `s4-args`: sau khi tính xong args, `mkdirSync(.acceptance-runs/<slug>, {recursive:true})`, ghi `thuoc-truoc.json`, thêm `thuocChup` vào object args. Lỗi chụp → `die('không chụp được thước: …')`.
- [ ] `thuoc-vat --write`: trước khi nối dòng `thuoc-vat`, nếu `thuoc-truoc.json` có → chụp lại, `soThuoc`; lệch → nối `dongThuocLech`, `console.error('thuoc-vat: thuoc lech trong luot cham')` + từng `  <doi>: <tep>`, sau khi ghi xong dòng thuoc-vat thì `process.exit(5)`. Không có tệp → `console.error('thuoc-vat: không có ảnh chụp thước — hồ sơ đời cũ, bỏ qua so')`. `round` lấy từ dòng `round-tally` cuối của run-log (null nếu vắng).
- [ ] SKILL feature-loop, bước «Mọi verdict»: thêm một câu — `thuoc-vat.mjs --write` thoát 5 = *thước lệch*, lượt ấy không dùng được, chấm lại lượt mới; không sửa thước giữa S4.
- [ ] Chạy ntr-thuoc → PASS; chạy `tests/scripts/thuoc-vat.test.mjs` → PASS.
- [ ] Commit `feat(thuoc): thước chỉ-đọc trong lượt chấm — chụp trước, so sau (AC-3)`.

### Task 4: Vị từ cạnh gãy + lý do trên dòng eval (nền cho AC-5…AC-8) — independent: false

**Files:** Create `lib/nhan-canh-gay.cjs` · Modify `feature-loop/workflows/acceptance-verify.js:~885,~893` (thêm `reason`) · Test qua Task 5/6.

**Interfaces (Produces):**
```js
// lib/nhan-canh-gay.cjs — hàm THUẦN, không tự đọc tệp
const NHAN = { MU: 'không đọc được ở đây', CHET: 'hệ thống chết', LECH: 'thước lệch' };
function nhanLyDo(reason, { infraExits, toolKillReason, deadReason }) // → 'mu' | 'chet' | null
function canhGay({ runLogText, round, verdict, infraExits, toolKillReason, deadReason })
// → { lech: [{tep,doi}]|null, muc: [{evalId, cmd, nhan:'mu'|'chet'|null, reason}], daThuLai: bool,
//     trangThai: 'lech'|'mo'|'chet-lan-dau'|'khoa' }
function kyTrenCanhGay({ canh, ledgerText, prefixByNhan }) // → { ok: bool, thieu: [evalId] }
module.exports = { NHAN, nhanLyDo, canhGay, kyTrenCanhGay };
```
Luật: `nhanLyDo` → `'mu'` khi reason bắt đầu `exit 97 —`/`exit 127 —` (tiền tố dựng từ khoá của `infraExits`), hoặc `=== toolKillReason`, hoặc là lý do cannotRun của dòng có `evalId` không bắt đầu `SUITE-`; `'chet'` khi `reason` bắt đầu `deadReason` (chuỗi `agent bi skip/chet`); còn lại `null`. `canhGay`: `lech` = dòng `thuoc-lech` cuối có `round >= round`; `muc` = dòng eval của `round` có `cannot_run: true` + dòng `vang-mat` của `round`; `daThuLai` = ≥2 dòng `round-tally` `verdict: BLOCKED` cùng `round`; `trangThai`: lech → `'lech'`; verdict ≠ BLOCKED → `'khoa'`; mọi mục `mu` → `'mo'`; mọi mục ∈ {mu, chet} và có `chet` → `daThuLai ? 'mo' : 'chet-lan-dau'`; có `null` → `'khoa'`. Dòng eval đời cũ không có `reason` → `null` → khoá (đường đọc-cũ). Bên gọi truyền `infraExits`/`toolKillReason`/`deadReason` RÚT từ marker `INFRA-EXIT-CODES` của `acceptance-verify.js`, `TOOL-KILL-RULE` của `tool-kill-rule.md`, và chuỗi `agent bi skip/chet` — hàm tiện ích `nguonNhan(kitRoot)` trong cùng tệp làm việc rút ấy (ném có tên khi mất marker).
- [ ] Viết `lib/nhan-canh-gay.cjs` + `nguonNhan`.
- [ ] Workflow: hai chỗ `...(m.cannotRun ? { cannot_run: true } : {})` → `...(m.cannotRun ? { cannot_run: true, reason: m.reason || '' } : {})`. Chạy `node tests/workflows/acceptance-verify.test.mjs` → PASS (khuôn dòng eval có ca canh? nếu có ca so khoá bằng nhau thì cập nhật ca đó cùng lượt).
- [ ] Commit `feat(lib): vị từ cạnh gãy một nguồn; dòng eval không chạy được mang lý do`.

### Task 5: Thẻ Cổng 2 gọi tên cạnh gãy (AC-4, AC-5, AC-6, AC-7, AC-12 · E4–E7, E12) — independent: false

**Files:** Modify `scripts/gate-card.js` (chèn chuỗi `NHAN-CANH-GAY` ở comment khối mới — mốc cho bản trước vòng) · Create `tests/scripts/ntr-the-canh-gay.test.mjs`.

**Interfaces:** Consumes `canhGay`, `nguonNhan`, `NHAN`. Produces `--extract` thêm khoá `canh_gay: {trangThai, muc, lech}` và `y_dinh: {feature, dong:[…], cat: bool}|null`; `approvable` = `verdict ∈ {PASS, PENDING-JUDGMENT}` HOẶC (`verdict === 'BLOCKED'` ∧ `trangThai === 'mo'`), và `false` khi `trangThai === 'lech'`.
- [ ] Ca NC-AC4, NC-AC4-cu, NC-AC5 (4 ô) + NC-AC5-nen, NC-AC6 (3 ô + đối chứng dương), NC-AC7-mot/hai (+ đối chứng round 2), NC-AC12-co/dai/khong đúng như E4–E7, E12. Hồ sơ fixture dựng bằng hàm `mkHoSo({verdict, runLog, opportunity, duongNen})`; dòng run-log eval dựng theo khuôn dòng của workflow (khoá rút từ chính đoạn `runLogLines.push` ở Task 4 — ca đọc nguồn workflow để lấy danh sách khoá), dòng `round-tally` sinh bằng `tallyLine` nạp qua harness vm của `tests/workflows` (tái dùng loader sẵn có của `acceptance-verify.test.mjs`), dòng `thuoc-lech` sinh bằng `thuoc-vat.mjs --write` thật trên kho fixture; `duong-nen.md` sinh bằng `duong-nen.mjs` thật (chân suite trỏ lệnh `exit 127`). Bản trước vòng: `git log --format=%H --reverse -S NHAN-CANH-GAY -- scripts/gate-card.js | head -1` → cha → `git archive`.
- [ ] Chạy → FAIL.
- [ ] Hiện thực trong `gate-card.js` Cổng 2:
  - Tính `cg = canhGay({...})` ngay sau khi đọc `verdict`.
  - `cg.trangThai === 'lech'` → nhánh non-approvable với chip «thước lệch — chấm lại», note liệt `cg.lech`, câu việc «máy chấm lại lượt mới; thước đổi giữa lượt nên lượt này không dùng được».
  - `'chet-lan-dau'` → non-approvable, note «hệ thống chết — máy thử lại một lần».
  - `'mo'` với verdict BLOCKED → đi nhánh approvable; chip «ký được trên cạnh gãy có tên»; khối «Chỗ mù — anh quyết (n)» mỗi mục một `item`: nhãn · eval · AC (tra `criterion` từ evals.yaml) · ba nút `ghi hạn chế rồi ship` / `dựng bàn đo rồi chấm lại` / `trả lại` · ba dòng giá: «AC ấy ship không có bằng chứng máy; mở lại khi bàn đo về» · «thêm một lượt chấm và công dựng bàn đo» · «vòng dừng ở đây». Nếu `duong-nen.md` có dòng đỏ chứa `cmd` của mục → thêm «đỏ từ trước vòng — không phải lỗi của vòng». `oneParts` thêm `Mù-<i>: ghi hạn chế` cho từng mục (máy khuyên), `routingHoi` thêm `Mù-<i>`.
  - `'khoa'` và REJECT → nhánh non-approvable CŨ, không đổi byte.
  - Khối ý định (mọi verdict approvable, chèn ngay sau header): có `opportunity.md` → nhãn «Ý định (nguyên văn Cổng Đáng)», `feature:` + 12 dòng không trống đầu của mục `## Vấn đề & ai gặp` (dùng `section()` sẵn có), >12 → thêm «… xem opportunity.md».
- [ ] Chạy ntr-the-canh-gay + `tests/scripts/gate-card*.test.mjs` + LM20 (routing-baseline) → PASS; baseline định tuyến đổi thì sinh lại bằng `tests/scripts/routing-baseline.mjs --write` (chỉ hồ sơ mới; hồ sơ cũ phải KHÔNG đổi dòng — nếu đổi là hỏng đọc-cũ).
- [ ] Commit `feat(gate-card): thẻ Cổng 2 gọi tên cạnh gãy, mở ô ký kèm giá, in ý định (AC-4…7, AC-12)`.

### Task 6: Ký trên cạnh gãy — bên viết và lưới (AC-8 · E8) — independent: false

**Files:** Modify `commands/signoff.md` (khối marker + lối `Mù-<n>`) · `scripts/pre-merge-check.sh` (nhánh `verdict != PASS`) · `scripts/recheck-evidence.cjs` (cùng luật) · Create `tests/scripts/ntr-luoi.test.mjs` (NL-AC8-*).

**Interfaces:**
- Khối trong `signoff.md`:
  ```
  <!-- <<<CANH-GAY-REVISIT-LINE -->
  "type":"revisit","stage":"gate2","at":"<ISO>","decision":"<nhãn> — <E> (<AC>): ghi hạn chế rồi ship","impact":"<giá>","serves":["<AC>"]
  <!-- CANH-GAY-REVISIT-LINE>>> -->
  ```
  ghi bằng DEC-ID-RECIPE. `kyTrenCanhGay` khớp dòng khi `type === 'revisit'` ∧ `decision` bắt đầu `<NHAN[x]> — <evalId> `; tiền tố rút từ khối marker (hàm `prefixCanhGay(kitRoot)` trong `nhan-canh-gay.cjs`).
- Lưới: CLI nhỏ `node lib/nhan-canh-gay.cjs --check --root <r> --slug <s>` in `OK <E…>` (thoát 0) hoặc `THIEU <E…>` (thoát 1) hoặc `KHONG <lý do>` (thoát 2); `pre-merge-check.sh` gọi nó khi `verdict = BLOCKED` ∧ `signoff` khác rỗng: 0 → `NOTE [slug]: ký trên cạnh gãy có tên — <E…>` rồi đi tiếp các chốt còn lại như verdict PASS (bỏ qua `xanh_sach_check`); 1 → `VIOLATION [slug]: ký trên cạnh gãy thiếu dòng sổ cho <E…>`; 2 → `VIOLATION … verdict=BLOCKED (must be PASS to merge)` như cũ. `recheck-evidence.cjs` `require` cùng lib, cùng ba nhánh.
- [ ] Ca NL-AC8-lanh/thieu/reject/mot-nguon như E8 (kho fixture T2 signed-off; `pre-merge-check.sh --base <sha đầu>` chạy với `ROOT` fixture — xem cách `tests/scripts/ho-so-nghi.test.mjs` gọi nó và bắt chước).
- [ ] Chạy → FAIL. Hiện thực. Thân `signoff.md`: thêm mục «Chỗ mù» — người trả `Mù-<n>: ghi hạn chế` → máy ghi dòng theo khối trên cho từng mục rồi mới ghi `human_signoff`; `Mù-<n>: dựng bàn đo` hoặc `trả lại` → không ký, nói việc kế.
- [ ] Chạy ntr-luoi + `bash tests/scripts/run-tests.sh` phần pre-merge (hoặc suite `executors.test.scripts`) → PASS.
- [ ] Commit `feat(luoi): ký trên cạnh gãy có tên — dòng sổ một khuôn, lưới nhận (AC-8)`.

### Task 7: Trạng thái thứ bảy ở bộ đọc (AC-9 · E9) — independent: false

**Files:** Modify `lib/workspace-record.cjs:40` + export · `scripts/trang-thai-ho-so.cjs` · `scripts/start-scan.mjs` · `scripts/product-map.mjs` · `skills/acceptance/references/contract-template.md` (comment `status:`) · Create `tests/scripts/ntr-trang-thai.test.mjs`.

**Interfaces (Produces):**
```js
const DA_DONG_THUC_TE = ['da-cham-boi-thuc-te'];
const THUC_TE_VE = ['by', 'at', 'build_sha', 'decision'];
function thucTe(ledgerText) // → null | {kieu:'dong-so', by, at, build_sha, ly_do, id} | {kieu:'dong-so-thieu', thieu:[…]}
```
Luật `thucTe`: dòng `type === 'thuc-te'` CUỐI thắng; dòng khác có `supersedes === id` → null; vế thiếu/rỗng, `at` không parse, `build_sha` không khớp `/^[0-9a-f]{40}$/` → `dong-so-thieu`. Trạng thái bảng chữ: khoá `da-cham-thuc-te` → `{ nhan: 'đã chấm bởi thực tế', viecKe: 'không ai — reality đã chấm' }`, nhóm thẻ `da-ship`.
- [ ] Ca NS-AC9-moi/cu/sai như E9. NS-AC9-cu: `git archive <trước vòng> scripts lib skills` + chép `_acceptance/` thật (bằng `git archive HEAD _acceptance`) vào hai thư mục, chạy `start-scan.mjs --root` và `product-map.mjs --root … --stdout` (hoặc đọc tệp ghi ra) của mỗi bản; so sau khi bỏ khoá `since`/`ts`.
- [ ] Chạy → FAIL. Hiện thực: enum; `start-scan` — trước nhánh `DA_THONG_CONG_2`, `if (DA_DONG_THUC_TE.includes(status))` → `done.push(g('da-cham-thuc-te', {slug, state: status, at: …}))`, dòng `thucTe` thiếu vế → cờ `thuc-te-thieu-ve:<vế>`; `product-map` dùng cùng khoá.
- [ ] Chạy ntr-trang-thai + `tests/scripts/start-scan*.test.mjs` + `executors.script.product_map` → PASS.
- [ ] Commit `feat(workspace): trạng thái thứ bảy da-cham-boi-thuc-te ở bộ đọc (AC-9)`.

### Task 8: Lưới nhận trạng thái thứ bảy (AC-10 · E10) — independent: false

**Files:** Modify `scripts/pre-merge-check.sh` (case status) · `scripts/recheck-evidence.cjs` · `tests/scripts/ntr-luoi.test.mjs` (NL-AC10-*).

**Interfaces:** CLI `node lib/workspace-record.cjs --thuc-te --root <r> --slug <s>` in `OK <sha7> <ngày> <tên>` (0) · `THIEU <vế…>` (1) · `LA <sha>` (3, `git -C <r> cat-file -e <sha>^{commit}` trượt) · `KHOA <tệp…>` (4, `git log --format=%H <commit của dòng thuc-te>..HEAD -- _acceptance/<s>/evals.yaml _acceptance/<s>/rang` không rỗng) · `KHONG` (2, không có dòng/đã supersedes).
- [ ] Ca NL-AC10-lanh/thieu/sha-la/khoa/mo-lai × hai bên đọc (10 assert) + mot-nguon + đối chứng status approved như E10.
- [ ] Chạy → FAIL. `pre-merge-check.sh`: thêm case `da-cham-boi-thuc-te)` trước `*)`: gọi CLI; 0 → `NOTE [slug]: đã chấm bởi thực tế — chạy trên prod từ bản dựng <sha7> (quan sát <ngày>, <tên>)`, `continue`; 1 → `VIOLATION [slug]: dòng quan sát thiếu vế <…>`; 3 → `VIOLATION [slug]: bản dựng không có trong kho — <sha>`; 4 → `VIOLATION [slug]: khoá việc thước — hồ sơ đã chấm bởi thực tế mà <tệp> đổi sau dòng quan sát`; 2 → rơi xuống luật cũ (xử như `approved`: nhánh chưa arm). `recheck-evidence.cjs` gọi `thucTe` + cùng các kiểm.
- [ ] Chạy ntr-luoi + suite scripts → PASS.
- [ ] Commit `feat(luoi): lưới nhận hồ sơ đã chấm bởi thực tế, khoá việc thước (AC-10)`.

### Task 9: Thao tác cổng người thứ bảy (AC-11 · E11) — independent: false

**Files:** Create `commands/observed.md` · Modify `tests/plugins/run-tests.sh` (P32: `LOCKED` thêm `"observed"`) · `CLAUDE.md` (mục «6 thao tác cổng người» → 7, thêm `observed`) · Create `tests/plugins/ntr-observed.test.mjs`.

**Interfaces:** Thân lệnh có khối
```
<!-- <<<THUC-TE-LINE -->
"type":"thuc-te","stage":"thuc-te","at":"<ISO ngày quan sát>","by":"<tên>","build_sha":"<40-hex bản dựng đang phục vụ prod>","decision":"<một câu người nói>"
<!-- THUC-TE-LINE>>> -->
```
- [ ] Ca NO-AC11-khoa/danh-sach/do/than như E11 (danh sách rút từ CLAUDE.md bằng regex trên dòng liệt tên trong backtick của mục «thao tác cổng người»; LOCKED rút từ `run-tests.sh` bằng regex `LOCKED = \[(.*?)\]`; khối P32 chạy lại bằng python3 heredoc rút nguyên văn từ `run-tests.sh` trên bản sao).
- [ ] Chạy → FAIL. Viết `observed.md` (frontmatter `description` + `disable-model-invocation: true`; thân: cú pháp `/acceptance-gate:observed <slug> <build_sha> <ngày> <tên> — <câu>`; tiền đề: contract có, status ≠ draft, sha 40-hex, `git cat-file -e`; định nghĩa `build_sha` = sha bản dựng đang phục vụ prod lúc quan sát (đỉnh nhánh phát hành), không phải commit đưa vật vào; ghi dòng theo khối bằng DEC-ID-RECIPE + đổi `status: da-cham-boi-thuc-te` bằng công cụ sửa tệp, CÙNG một commit `observed: <slug> — <tên>`; vẽ lại bản đồ nếu repo bật). Sửa P32, CLAUDE.md.
- [ ] Chạy ntr-observed + `bash tests/plugins/run-tests.sh` → PASS.
- [ ] Commit `feat(commands): thao tác cổng người thứ bảy observed — reality đóng hồ sơ (AC-11)`.

### Task 10: Dòng hiệu chuẩn mốc (AC-13 · E13) — independent: true

**Files:** Create `scripts/hieu-chuan-moc.mjs` · Modify `GUIDE.md` (mục năm dòng số: dòng 6) · Create `tests/scripts/ntr-hieu-chuan.test.mjs`.

**Interfaces:** `node scripts/hieu-chuan-moc.mjs --root <kho>` → stdout đúng một dòng; exit 0; exit 2 khi `--root` không có `_acceptance/`.
```js
// N = số hồ sơ có thucTe(...).kieu === 'dong-so'; k = trong đó, hồ sơ có dòng type 'revisit'
// với decision bắt đầu 'prod đỏ — ' và thứ tự dòng SAU dòng thuc-te.
console.log(N === 0 ? 'ĐẠT đã ký → prod đỏ: vô hiệu (N = 0)' : `ĐẠT đã ký → prod đỏ: ${k} / ${N}`);
```
- [ ] Ca NH-AC13-so/vo-hieu/guide như E13 (dòng thuc-te sinh từ khối THUC-TE-LINE của Task 9 — nếu Task 10 chạy trước Task 9 thì ca đỏ có tên «khong rut duoc THUC-TE-LINE», đúng thứ tự thi hành là sau Task 9).
- [ ] Chạy → FAIL. Hiện thực. GUIDE thêm dòng «Hiệu chuẩn (ADR 0020) · `node scripts/hieu-chuan-moc.mjs --root <kho nhận>`».
- [ ] Chạy → PASS. Commit `feat(scripts): dòng hiệu chuẩn ĐẠT đã ký → prod đỏ (AC-13)`.

### Task 11: Quét toàn bộ + danh sách hồ sơ đã ký mất tiền đề — independent: false

- [ ] Chạy trọn năm `feature_loop.suite_keys` + sáu khoá `ntr_*`. Mọi đỏ trong ca của hồ sơ đã ký do vật mới (không do lỗi) → ghi tên ca + hồ sơ vào mục Notes của hợp đồng (danh sách cho chiến dịch ghim lại 2.18.0) và một dòng sổ `revisit`; KHÔNG sửa hồ sơ đã ký. Ca kho (không thuộc hồ sơ đã ký) đỏ → sửa theo vật mới.
- [ ] `node scripts/eval-coverage-lint.js . --slug nhan-trang-thai-va-reality` sạch; `node scripts/product-map.mjs --root .`; `bash scripts/pre-merge-check.sh --base origin/main` — ghi kết quả.
- [ ] Contract `status: implemented`, commit, vào S4.

## Tự rà

- Spec coverage: A1→T1 · A2→T2 · A3→T3 · A4→T5 · B1→T4 · B2→T5 · B3→T6 · B4→T5 · C1→T7 · C2→T7 · C3→T9 · C4→T7,T8 · D1→T5 · D2→T10 · §6.1→T11.
- Tên thống nhất: `canhGay`/`nhanLyDo`/`kyTrenCanhGay`/`nguonNhan`/`prefixCanhGay` (lib/nhan-canh-gay.cjs) · `thucTe`/`DA_DONG_THUC_TE`/`THUC_TE_VE` (lib/workspace-record.cjs) · `chupThuoc`/`soThuoc` · `dongThuocLech` · marker `THUOC-LECH-LINE`, `CANH-GAY-REVISIT-LINE`, `THUC-TE-LINE`, `NHAN-CANH-GAY`.
