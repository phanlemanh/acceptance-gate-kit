# Eval gọi model thật không chạy lại khi đầu vào không đổi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làn ghim lại (`repin-lane.mjs`) dùng lại kết quả eval model thật khi băm năm lớp đầu vào không đổi (hạn 7 ngày, khoá `feature_loop.model_carry_cmd`), nói ra mọi lần dùng lại, tự kiểm `carry_lech`, và có script đếm cho đường đo.

**Architecture:** Hàm thuần + ba khối marker ở `feature-loop/scripts/lib/dung-lai-model.mjs` (lớp băm, lý do luôn chạy, lý do nguồn); làn gọi một bước «kế hoạch dùng lại» trước suite, quyết từng eval model trong vòng eval, ghi ba khoá tuỳ chọn vào dòng `repin`/`repin-do`. Bên đọc pin không đổi. Script đếm đọc run-log.

**Tech Stack:** Node ≥ 20 ESM, `node:crypto` sha256, git CLI; ca kiểm `node tests/scripts/*.test.mjs` (bộ kiểm `boKiem` của `gia-lan-fixture.mjs`).

**Spec:** `docs/superpowers/specs/2026-10-11-eval-goi-model-that-khong-chay-design.md` · hợp đồng `_acceptance/eval-goi-model-that-khong-chay/contract.md` (12 AC) · `evals.yaml`.

## Global Constraints

- Khoá `feature_loop.model_carry_cmd` VẮNG (hoặc rỗng) = hành vi trước vòng nguyên văn: không băm, không dòng stderr mới, không khoá mới trong dòng, lệnh dấu vân tay không chạy.
- Hạn dùng lại `HAN_NGAY = 7` (hằng, không khoá); trần lệnh dấu vân tay `HET_GIO_VAN_TAY_MS = 60000`.
- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (AC-12).
- Mọi commit của vòng mang `(eval-goi-model-that-khong-chay)` trong tiêu đề (AC-12, SAU-G3).
- Đầu ra lệnh dấu vân tay chỉ vào băm, không bao giờ ghi ra sổ hay stderr.
- Khoá dòng mới theo luật hiện diện (rỗng → vắng hẳn), thứ tự dựng bằng `Object.assign` khớp khuôn REPIN-TEMPLATE.
- Từ vựng: «dùng lại»/«carry», không «cache» (CONTEXT.md).
- Không sửa tệp nguồn khi `repin-lane-noi-ra.test.mjs` đang chạy (bộ nhớ GN13).

## Review Focus

1. Run-log có dòng JSON hỏng hoặc dòng `repin` thiếu `ts` → bộ chọn nguồn bỏ qua dòng đó, không ném (ca trong Task 1: `chonNguon` với dòng rác).
2. Hai eval model dùng CHUNG một lệnh → cả hai đọc nguồn riêng; eval thứ hai không bị «lệnh đã chạy» khi eval thứ nhất được dùng lại (ca Task 4 `AC4-hai-eval-model`).
3. Kho có `--root` là thư mục con của kho git → đường `paths`/cây hồ sơ quy về gốc `--root` (Task 1 `dungCay` nhận `tienTo`).
4. Lệnh có nháy kép bọc lệnh con (`bun run test -- "cd apps/agent && bun test x"`) → từ trong nháy vẫn được tách (Task 1 ca `tepGoiTen` dạng crm).
5. Làn bị ngắt / vượt trần → dòng `repin-do` của `ketThucSom` không mang khoá dùng lại (Task 3, giữ nguyên nhánh đó).

---

### Task 1: Thư viện dùng lại — băm, lý do, chọn nguồn

**Files:**
- Create: `feature-loop/scripts/lib/dung-lai-model.mjs`
- Test: `tests/scripts/repin-lane-dung-lai-model.test.mjs` (ca `LIB-*`)

**Interfaces — Produces:**
- `HAN_NGAY` (7), `HET_GIO_VAN_TAY_MS` (60000), `LOP_BAM: string[]` (khối `CARRY-INPUT-LAYERS`), `LY_DO_CHAY: Record<string,string>` (khối `CARRY-LY-DO-CHAY`), `LY_DO_NGUON: Record<string,string>` (khối `CARRY-LY-DO-NGUON`).
- `chayVanTay(cmd, { cwd, env, timeoutMs }) → { ok: true, dau: string } | { ok: false, lyDo: string }`
- `tepGoiTen(cmd, tepSet: Set<string>) → string[]` (sắp xếp)
- `coBienShell(cmd) → boolean`
- `bamDauVao({ id, lenh, paths, hoSo, goiTen, vanTay, blob: Map<string,string> }) → string` (64 hex)
- `chonNguon({ dong, id, bam, nowMs, laDat }) → { nguon } | { lyDo }`
- `phatHienLech({ dong, id, bam, exit }) → boolean`
- `docRunLog(text) → object[]` (dòng hỏng bỏ qua)

- [ ] **Step 1: Viết ca hỏng trước** — `LIB-van-tay-het-gio` (trần 500 ms, `sleep 5` → `ok:false`, `lyDo` bắt đầu bằng `LY_DO_CHAY.vanTayHetGio`, thời gian ≤ 3 s), `LIB-van-tay-thoat`, `LIB-van-tay-rong`, `LIB-goi-ten` (bảng viết trước: `sh tools/e1.sh` → `[tools/e1.sh]`; `cd tools && sh e1.sh` → `[tools/e1.sh]` không kèm tệp khác dưới `tools/`; `bun run test -- "cd apps/agent && bun test test/x.spec.ts"` → `[apps/agent/test/x.spec.ts]`; `node --preload=./setup.ts a.mjs` → `[a.mjs, setup.ts]`), `LIB-bien-shell`, `LIB-chon-nguon` (dòng rác, dòng không `ts`, nguồn mới nhất, dàn phẳng, tương lai, quá hạn, lệch), `LIB-bam-tung-lop` (đổi mỗi trường một lần → băm khác; cùng → bằng).
- [ ] **Step 2:** `node tests/scripts/repin-lane-dung-lai-model.test.mjs` → FAIL «Cannot find module …dung-lai-model.mjs».
- [ ] **Step 3: Viết thư viện** (mã đầy đủ ở tệp; điểm cốt lõi):

```js
// <<<CARRY-INPUT-LAYERS
export const LOP_BAM = ['lệnh đã giải', 'tệp khớp paths', 'cây hồ sơ', 'tệp lệnh gọi tên', 'dấu vân tay môi trường'];
// CARRY-INPUT-LAYERS>>>
export function bamDauVao({ id, lenh, paths, hoSo, goiTen, vanTay, blob }) {
  const ds = (tep) => [...new Set(tep)].sort().map(f => `${f}\t${blob.get(f) || '-'}`).join('\n');
  const h = createHash('sha256').update(`g3-v1\n${id}\n`);
  h.update(`lop1\n${lenh}\n`);        // lệnh đã giải
  h.update(`lop2\n${ds(paths)}\n`);   // tệp khớp paths
  h.update(`lop3\n${ds(hoSo)}\n`);    // cây hồ sơ
  h.update(`lop4\n${ds(goiTen)}\n`);  // tệp lệnh gọi tên
  h.update(`lop5\n${vanTay}\n`);      // dấu vân tay môi trường
  return h.digest('hex');
}
```

- [ ] **Step 4:** chạy lại → PASS các ca `LIB-*`.
- [ ] **Step 5:** commit `feat(eval-goi-model-that-khong-chay): thư viện băm năm lớp, lý do, chọn nguồn`.

**Verify per-task:** `GG_CASES=LIB-van-tay-het-gio,LIB-van-tay-thoat,LIB-van-tay-rong,LIB-goi-ten,LIB-bien-shell,LIB-chon-nguon,LIB-bam-tung-lop node tests/scripts/repin-lane-dung-lai-model.test.mjs` + phá thử: xoá dòng `h.update(\`lop4…` trong bản sao → `LIB-bam-tung-lop` đỏ. **Phục vụ:** E2, E3, E4, E5, E6. **independent:** false.

### Task 2: Khoá thứ sáu và tổng kết

**Files:** Modify `feature-loop/scripts/lib/lan-khoa.mjs` (khối `LAN-KHOA`, `docKhoa`, `dungTongKet`); Modify `tests/scripts/repin-lane-khuon-gia.test.mjs` (5 → 6 khoá, khoá rỗng đọc như vắng).

**Interfaces — Produces:** `khoa.model_carry_cmd: string | null`; `dungTongKet({ …, modelCarry = 0, carryLech = [] })` — `obj.model_carry = modelCarry`; dòng in `eval model thật: gọi N, carry M` và thêm ` · carry_lech: E1, …` khi khác rỗng.

- [ ] Step 1: sửa ca `AC6-lan-khoa-rut` thành 6 khoá + `docKhoa('…model_carry_cmd: ""')` → `null`; chạy → FAIL «số ô lệch: 5 khoá, hứa 6».
- [ ] Step 2: thêm hàng `{ khoa: 'feature_loop.model_carry_cmd', kieu: 'lệnh in dấu vân tay môi trường model', mo_ta: 'bật dùng lại kết quả eval model khi băm đầu vào không đổi (hạn 7 ngày); đầu ra chỉ vào băm' }`, đọc khoá trong `docKhoa`, tham số `modelCarry`/`carryLech` trong `dungTongKet`.
- [ ] Step 3: chạy `GG_CASES=AC6-lan-khoa-rut node tests/scripts/repin-lane-khuon-gia.test.mjs` → PASS (ca `AC6-guide-du-khoa` sẽ đỏ tới Task 6 — đúng thứ tự).
- [ ] Step 4: commit.

**Phục vụ:** E9. **independent:** false.

### Task 3: Nối vào làn ghim lại

**Files:** Modify `feature-loop/scripts/repin-lane.mjs`.

**Interfaces — Consumes:** Task 1 + Task 2. **Produces:** cờ `--chay-lai-model`; khoá dòng `evals_hash`, `evals_carry`, `carry_lech` (repin) và `evals_hash`, `carry_lech` (repin-do đỏ); hậu tố section ` · dùng lại theo băm đầu vào (không gọi model): E1←<run_id>` và ` · cùng băm mà kết quả khác (carry_lech): E1`; dòng stderr `<slug> <E>: dùng lại theo băm <8 hex> từ <run_id> (<ts>) — không gọi model` / `<slug> <E>: không dùng lại — <lý do>`.

- [ ] Step 1: KNOWN/BOOL thêm `chay-lai-model`.
- [ ] Step 2: sau khối `SKIP-UNCHANGED-PREDICATE`, khi `khoa.model_carry_cmd`: chạy `chayVanTay` một lần; dựng `blob` từ `git ls-tree -r --full-tree HEAD` (quy về `--root`); `dirty` từ `git status --porcelain=v1 -z --untracked-files=all`; với từng slug đọc `run-log.jsonl` (`docRunLog`), với từng eval trong `model_evals`: lý do điều kiện theo thứ tự (vân tay → ép → `--allow-dirty` → không paths → paths không chứng → biến shell → tệp bẩn), nếu không có thì băm + `chonNguon`.
- [ ] Step 3: vòng eval: lý do điều kiện → «lệnh đã chạy ở lượt này» (`results.has`) → lý do nguồn → dùng lại (không `runCmd`, `daXong.add`, đếm `modelCarry`); eval chạy thật có băm → `phatHienLech`.
- [ ] Step 4: ghi khoá vào `lineObj` sau `suites_env` (luật hiện diện), vào `repin-do` đỏ sau `chap_chon`; `stdout.slugs[slug].evals_carry` khi khác rỗng; `tongKet` truyền `modelCarry`, `carryLech`.
- [ ] Step 5: commit `feat(eval-goi-model-that-khong-chay): làn ghim lại dùng lại eval model theo băm đầu vào`.

**Verify per-task:** Task 4 chạy ngay sau (ca làn đầu-cuối). **Phục vụ:** E1–E8. **independent:** false.

### Task 4: Ca đầu-cuối trên kho thử

**Files:** Modify `tests/scripts/gia-lan-fixture.mjs` (eval khai `paths`, `executor`, nhiều lệnh); Modify `tests/scripts/repin-lane-dung-lai-model.test.mjs`.

- [ ] Step 1: `mkKho` nhận `e.paths: string[]` → ghi `    paths:\n      - "<p>"` dưới eval; giữ nguyên đầu ra khi vắng (các ca cũ không đổi byte).
- [ ] Step 2: dựng `mkG3(opts)` = `mkKho` với E1 (`sh tools/e1.sh`, `paths: [src/a.txt]`, mã thoát đọc `$GG_DAU/E1-exit`), E2 thường, `van-tay.sh` (đếm `$GG_DAU/van-tay.txt`, in `$GG_DAU/model-id`), `model_evals: [feat/E1]`, `model_carry_cmd: sh van-tay.sh`; `lanCommit(args)` chạy làn `--write` rồi commit; `lui(ts)` sửa `ts` dòng `repin` cuối.
- [ ] Step 3: các ca `AC1-*` (chiều im), `AC2-lop-*` (năm lớp, rút từ khối marker — số ca = số lớp), `AC2-dac-hieu-*` (ba ca), `AC3-*` (ba ca), `AC4-*` (mười lý do, rút từ khối — ca hết giờ ở `LIB-van-tay-het-gio`; thêm `AC4-hai-eval-model`, `AC4-eval-thuong`), `AC5-*` (dàn phẳng, mới nhất, dòng không băm), `AC6-*` (lệch ở repin-do, chặn sau lệch, đổi băm thì dùng lại), `AC7-song` (khoá vắng: ba lượt, so tập khoá với cùng kho khi khoá khai trừ ba khoá), `AC8-song` (recheck cây đang kiểm đọc pin dùng lại; sửa mã → đỏ nêu E1), `AC9-khuon-dung-lai` (khoá writer ⊆ khuôn).
- [ ] Step 4: chạy trọn tệp → PASS; phá thử bằng tay một lần: tạm đổi `if (!lyDo && q.nguon)` thành `if (false)` → `AC1-im` đỏ «gọi model khi đầu vào không đổi»; hoàn lại.
- [ ] Step 5: commit.

**Verify per-task:** `node tests/scripts/repin-lane-dung-lai-model.test.mjs` + `node tests/scripts/repin-lane-chay-lai.test.mjs` + `node tests/scripts/repin-lane.test.mjs` (không hồi quy). **Phục vụ:** E1–E9. **independent:** false.

### Task 5: Script đếm đường đo

**Files:** Create `feature-loop/scripts/dem-dung-lai-model.mjs`; Modify `tests/scripts/repin-lane-dung-lai-model.test.mjs` (ca `AC10-*`).

**Interfaces — Produces:** `node dem-dung-lai-model.mjs --root <kho> [--tu YYYY-MM-DD]` in: `TỔNG — model_goi <n> · model_carry <n> · carry_lech <n>` · một dòng mỗi eval `<slug>/<E>: dùng lại <n> · gọi <n>` · mỗi lượt lệch `carry_lech <slug>/<E> @ <run_id>: lệch không tất định | nghi thiếu đầu vào: <tệp, …>` · `nguồn không có: <slug>/<E> → <run_id>`. Mã 0; `--root` sai mã 2.

- [ ] Step 1: ca `AC10-dem` (run-log do làn thật ghi: chạy, dùng lại, hai lượt lệch (a) (b), một dòng `evals_carry` trỏ run_id không có) → FAIL vì script vắng.
- [ ] Step 2: viết script — `model_goi`/`model_carry` cộng từ `tong_ket` theo `run_id`/`lan_id` khác nhau (mỗi lượt đếm một lần dù nhiều slug), `carry_lech` đếm trên dòng `repin` VÀ `repin-do`; nhãn lệch = `git diff --name-only <sha nguồn> <sha lệch>` trừ `run-log.jsonl`/`evidence-report.md` của hồ sơ.
- [ ] Step 3: PASS; commit.

**Phục vụ:** E10. **independent:** true (chỉ đọc run-log) — vẫn làm tuần tự.

### Task 6: Tài liệu và khuôn

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (REPIN-TEMPLATE thêm `evals_hash`, `evals_carry`, `carry_lech`; đoạn nghi thức re-pin nói khoá, cờ, hậu tố); Modify `GUIDE.md` §7.1 (hàng bảng khoá `model_carry_cmd` + mục «Dùng lại eval model thật theo băm đầu vào»: năm lớp, hạn, lý do luôn chạy, lệnh dấu vân tay in gì, bốn giới hạn kèm ngưỡng, lệnh đếm); Modify `CHANGELOG.md` (mục chưa phát hành, «khoá vắng = như 2.26»).

- [ ] Step 1: chạy `GG_CASES=AC6-khuon-writer,AC6-guide-du-khoa node tests/scripts/repin-lane-khuon-gia.test.mjs` và `GG_CASES=AC9-khuon-dung-lai …` → FAIL (khoá ngoài khuôn / khoá chưa khai ở GUIDE).
- [ ] Step 2: sửa ba tệp; chạy lại → PASS; `node tests/plugins/run-tests.sh`? — chạy ca P85/P161 nếu SKILL đổi (`bash tests/plugins/run-tests.sh` theo mảnh ở Task 8).
- [ ] Step 3: commit.

**Phục vụ:** E9, E11. **independent:** false.

### Task 7: Bộ răng hồ sơ — chiều đỏ, vế đông cứng, phạm vi

**Files:** Create `_acceptance/eval-goi-model-that-khong-chay/rang/{chan.mjs, ma-tran.mjs, ban-sao.mjs, vi-phan.mjs, doc-cu.mjs, pham-vi.mjs}`.

- `ban-sao.mjs`: `ROOT` suy từ vị trí tệp; `BASE_G3 = '08ba287d30ad96a89e3103436822f298c2684296'` (đối chiếu chuỗi trong contract); `sauG3()` = `git log -n1 --no-merges --format=%H --fixed-strings --grep='(eval-goi-model-that-khong-chay)' -- feature-loop/scripts`; `banSao(sha, thuMuc)` = `git archive` TRỌN thư mục.
- `ma-tran.mjs`: mỗi AC `{ nhom: [{ tep, ca: [...] }], pha: [{ ten, tep, doi: [[tìm, thay]], tepCa, ca, ghim }] }` — phép phá đúng như evals.yaml (bỏ từng lớp băm, bỏ giải theo cd, kéo cả thư mục, bỏ so tuổi, bỏ kiểm bẩn, bỏ kiểm vân tay, bỏ trần giờ, chuỗi không dàn phẳng, bỏ chặn sau lệch, ghi băm khi khoá vắng, khuôn thiếu `evals_carry`, chỉ đếm repin, nhãn lệch luôn «không tất định», luôn chạy lại).
- `chan.mjs --ac <n>`: chiều xanh (ca trên cây đang kiểm, đếm PASS = số ca viết trước) + `vi-phan.mjs` (AC-7 vế đông cứng) / `doc-cu.mjs` (AC-8 vế đông cứng) / `pham-vi.mjs` (AC-12) + chiều đỏ trên bản sao SAU-G3 (dấu dương «… [id]» + thông điệp ghim).
- `pham-vi.mjs`: hàm `phamVi({ repo, base, dau, slug })` + chế độ tự kiểm trên kho thử (chiều im, hai chiều đỏ).

- [ ] Step 1: viết `pham-vi.mjs` + chạy trên kho thật → xanh, trên kho thử ba ca → đúng ghim.
- [ ] Step 2: viết `ban-sao`, `ma-tran`, `chan`; chạy `node …/chan.mjs --ac 1` … `--ac 12` (trừ 11) → mọi chân XANH.
- [ ] Step 3: commit.

**Phục vụ:** E1–E10, E12. **independent:** false.

### Task 8: Hồi quy, đo lại trên crm, đóng S3

- [ ] Step 1: chạy các tệp ca làn hiện có bị ảnh hưởng: `repin-lane.test.mjs`, `repin-lane-chay-lai.test.mjs`, `repin-lane-khuon-gia.test.mjs`, `repin-lane-tran.test.mjs`, `repin-lane-env-ci.test.mjs`, `repin-lane-skip-unchanged.test.mjs`, `repin-lane-lop-cu.test.mjs`, `repin-evals.test.mjs` (KHÔNG chạy song song với tệp sửa nguồn).
- [ ] Step 2: đo lại 44 cặp crm bằng CHÍNH `bamDauVao` + `tepGoiTen` (dấu vân tay xấp xỉ = blob `bun.lock`) — ghi số vào Notes của contract (một dòng, thay số xấp xỉ).
- [ ] Step 3: `node scripts/product-map.mjs --root .` + `--check`; commit; set contract `status: implemented`; xin lượt S4.

**Phục vụ:** tất cả. **independent:** false.
