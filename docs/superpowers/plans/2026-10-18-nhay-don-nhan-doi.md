# Nháy đơn nhân đôi — Implementation Plan

> **For agentic workers:** feature-loop S3 chạy TUẦN TỰ trong vòng chính (ba task phụ thuộc nhau: thước trước vật).
> Steps dùng checkbox (`- [ ]`).

**Goal:** `unquoteScalar` gỡ `''` → `'` trong scalar YAML nháy đơn, để lệnh `config:` dạng crm tới shell đúng ý người viết.

**Architecture:** Một dòng ở nhánh nháy đơn của cổng bóc nháy chung (`lib/evidence-core.cjs`). Thước đi TRƯỚC vật trong
lịch sử: commit ca (đỏ trên mã cũ) rồi mới commit vá. Ca mới là chân BG10a–BG10e của bộ răng sẵn có
`tests/scripts/bo-giai-nhay.test.mjs`, cộng một hàng trong bảng đột biến `DUONG` và một răng lịch sử.

**Tech Stack:** Node ESM/CJS thuần, không thư viện YAML (luật kit).

**Spec:** `docs/superpowers/specs/2026-10-18-nhay-don-nhan-doi-design.md` · hợp đồng `_acceptance/nhay-don-nhan-doi/contract.md`

## Global Constraints

- Không thêm phụ thuộc; không gọi PyYAML lúc chạy — hằng mong đợi ghi cứng (sổ d-3).
- Đường dẫn trong ca và răng suy từ vị trí tệp (bài học P150), không hardcode gốc kho.
- Tệp ca giữ MỘT lối thoát ở cuối (bài học P200); số khẳng định khai hằng trước, gõ tay.
- Không chạm nhánh nháy kép, chuỗi trần, nháy đơn không cân của `unquoteScalar`.
- `gia-lan-fixture.mjs`: khoá mới chỉ THÊM — vắng `e.yaml` thì đầu ra byte-y-hệt hôm nay.
- Không sửa crm.

## Review Focus

1. Scalar nháy đơn chỉ gồm `''` (`''''`) — phải ra một dấu `'`, không rỗng → ô `chi_mot_nhay` của BG10a.
2. Nháy đơn KHÔNG cân (`'a'b'`) — phải giữ nguyên văn, không «sửa giùm» → ô của BG10c.
3. `''` sát chú thích đuôi — cắt chú thích đúng rồi mới gỡ → ô `kem_chu_thich` của BG10a.
4. Mục danh sách inline là `''''` — tách phẩy không vỡ, ra `'` → BG10b.
5. Đối chứng hạ tầng hỏng ở sha lịch sử bị đọc thành «đỏ vì vật» → thông điệp hạ tầng riêng trong BG10d/BG10e + khẳng định (3) của răng lịch sử.

---

### Task 1: Thước — chân BG10a–e, hàng đột biến, khoá config, răng lịch sử (commit ĐỎ trên mã cũ)

**Phục vụ:** E1–E7 (AC-1…AC-6) · **independent:** false (Task 2 cần nó đứng trước trong lịch sử)

**Files:**
- Modify: `tests/scripts/gia-lan-fixture.mjs` (dòng `scriptExecs` + chú thích «Nháy KÉP có thoát ký tự…»)
- Modify: `tests/scripts/bo-giai-nhay.test.mjs` (thêm bg10a–bg10e; `DUONG`; `BG8_MUTANTS`; `CHAN_DO` của BG5; bảng `CHAN`; dòng OK cuối)
- Modify: `_acceptance/config.yaml` (sáu khoá `executors.script.ndnd_*`, đặt cạnh `bo_giai_nhay`)
- Create: `_acceptance/nhay-don-nhan-doi/rang/lich-su-do.mjs`

**Interfaces:**
- Produces: `mkKho({ evals: [{ id, cmd, yaml? }] })` — `yaml` là scalar YAML thô ghi làm giá trị của khoá
  `executors.script.<cmd>`; eval vẫn `cmd: config:executors.script.<cmd>`.
- Produces: hàng `DUONG` thứ 10 `['10 unquoteScalar vo don', CORE, "if (/^'(?:[^']|'')*'$/.test(s)) return s.slice(1, -1).replace(/''/g, \"'\");", "if (/^'(?:[^']|'')*'$/.test(s)) return s.slice(1, -1);", 'BG10a']`
  — neo (cột 3) là đúng dòng Task 2 sẽ viết.
- Produces: dòng `PASS: BG10a ` … `PASS: BG10e ` mà các khoá `ndnd_*` grep.

- [ ] **Step 1: `gia-lan-fixture.mjs`** — `scriptExecs` dùng `e.yaml` khi có: ``${e.cmd}: ${e.yaml || q(e.sh || `sh ${e.cmd}.sh`)}``; khi `e.yaml` có mặt thì KHÔNG ghi `<cmd>.sh`. Sửa chú thích: bỏ câu «KHÔNG gỡ '' trong nháy đơn …», thay bằng «`e.yaml`: scalar thô (vd nháy đơn có `''`) — hồ sơ nhay-don-nhan-doi».

- [ ] **Step 2: BG10a — ma trận chín ô qua `resolveConfigKey`** (`BG10A_ASSERTS = 9`), hằng từ PyYAML 6.0.3:

```js
['giua', "'a''b'", "a'b"], ['dau_than', "'''a'", "'a"], ['cuoi_than', "'a'''", "a'"],
['chi_mot_nhay', "''''", "'"], ['hai_cap_lien', "''''''", "''"],
['crm', `'bash -c ''echo "x y"; echo z'''`, `bash -c 'echo "x y"; echo z'`],
['kem_chu_thich', "'it''s'  # ghi chu", "it's"], ['thang_trong_vo', "'a '' # b'", "a ' # b"], ['rong', "''", null]
```
  Thông điệp đỏ: `DO BG10a: [<tên>]: doi <json>, thay <json>`. Kiểm `ca.length === BG10A_ASSERTS` trước.

- [ ] **Step 3: BG10b — danh sách + `parseFlowValue`** (`BG10B_ASSERTS = 3`, so bằng `JSON.stringify` trọn mảng):
  `resolveConfigList` inline `[x, 'a''b', '''']` → `["x","a'b","'"]` · khối `- 'it''s'` → `["it's"]` ·
  `core.parseFlowValue("'a''b'").value` → `"a'b"`.

- [ ] **Step 4: BG10c — chiều im** (`BG10C_ASSERTS = 3`): `"a''b"` → `a''b` · `a''b` → `a''b` · `'a'b'` → `'a'b'`.

- [ ] **Step 5: BG10d — khứ hồi s4-args.** Dùng `dungKho({ cmdValue, expectedExit: null })` + `chayS4Args` sẵn có.
  Thư mục dấu vết `vet = mkTmp('bg10d-vet-')`. Đối chứng trước: `cmdValue` nháy kép
  `"bash -c 'export BG_VET=\"<vet>\"; printf da-chay > \"$BG_VET/kep\"'"` → chạy `bash -c e1.cmd`, tệp `kep` phải
  = `da-chay`; hỏng → `DO BG10d: doi chung nhay kep hong (ha tang): …` và dừng chân. Rồi ca nháy đơn
  `'bash -c ''export BG_VET="<vet>"; printf da-chay > "$BG_VET/don"'''`: khẳng định (a) `e1.cmd` không chứa `''`,
  (b) mã thoát 0, (c) tệp `don` = `da-chay`; thiếu (c) → `DO BG10d: lenh trong khong chay (khong dau vet), cmd=<json>`.

- [ ] **Step 6: BG10e — khứ hồi repin-lane.** `import { mkKho } from './gia-lan-fixture.mjs'`. Đối chứng trước:
  `mkKho({ evals: [{ id: 'E1', cmd: 'rang_e1', yaml: `"bash -c 'echo ran >> \\"$GG_DAU/E1.txt\\"'"` }] })`,
  `k.lane(['--reason', 'bg10e', '--write'])` thoát 0 và `k.dem('E1.txt') === 1`; hỏng →
  `DO BG10e: doi chung nhay kep hong (ha tang): …`. Ca thật: kho mới, `yaml: `'bash -c ''echo ran >> "$GG_DAU/E1.txt"'''``;
  khẳng định (a) `evals.yaml` của kho không chứa `''`, (b) lane thoát 0, (c) dòng `kind:'repin'` cuối của
  `k.docLog()` có `evals_exit.E1 === 0`, (d) `k.dem('E1.txt') === 1`; thiếu (d) hoặc (b) → `DO BG10e: khong dau vet …`.

- [ ] **Step 7: Nối dây.** `DUONG` thêm hàng 10 (Interfaces); `BG8_MUTANTS` 6 → 7 kèm một dòng chú thích lý do;
  `CHAN_DO` của BG5 thêm `'BG10a'`; bảng `CHAN` thêm `BG10a…BG10e` TRƯỚC `BG8`, `BG5`; dòng OK cuối «9 chan» → «14 chan».
  `BG8`/`BG5` đỏ ở commit này là ĐÚNG (neo hàng 10 chưa có trong lib) — chỉ chân BG10a/d/e là thước của AC-6 lịch sử.

- [ ] **Step 8: Sáu khoá config** (khuôn `gtn_*`, nháy kép), mỗi khoá chạy tệp ca và grep `PASS: <chân> `:
  `ndnd_ma_tran` (BG10a) · `ndnd_danh_sach` (BG10b) · `ndnd_chieu_im` (BG10c + BG1 BG2 BG3 BG4 BG6 BG7 BG9) ·
  `ndnd_s4_args` (BG10d) · `ndnd_lan_ghim` (BG10e) · `ndnd_dot_bien` (BG8 BG5);
  `ndnd_lich_su_do: "node _acceptance/nhay-don-nhan-doi/rang/lich-su-do.mjs"`.

- [ ] **Step 9: `rang/lich-su-do.mjs`** — gốc kho = `path.resolve(HERE, '..', '..', '..')`. `sha = git log --reverse
  --format=%H -S'function bg10a' -- tests/scripts/bo-giai-nhay.test.mjs | head -1`; rỗng → in `MU lich-su-do: …`,
  thoát 3. `git archive <sha>` trọn cây vào thư mục tạm, rồi bốn khẳng định của E7: (1) `lib/evidence-core.cjs` ở sha
  KHÔNG chứa `.replace(/''/g, "'")`; (2) `tests/scripts/gia-lan-fixture.mjs` ở sha chứa `e.yaml`; (3) chạy tệp ca
  của bản archive với `BG_ONLY=BG10a,BG10d,BG10e BG_NO_RED=1` → thoát 1, stderr có `DO BG10a: [giua]`,
  `lenh trong khong chay`, `khong dau vet`, và KHÔNG có `doi chung nhay kep hong`; (4) archive HEAD, cùng lệnh → thoát 0.
  Đạt → `XANH lich-su-do`; trượt → `DO lich-su-do: (<n>) …`, thoát 1.

- [ ] **Step 10: Xác nhận ĐỎ trên mã cũ**
  Run: `BG_ONLY=BG10a,BG10b,BG10c,BG10d,BG10e node tests/scripts/bo-giai-nhay.test.mjs; echo $?`
  Expected: thoát 1; `DO BG10a: [giua]`, `DO BG10b:`, `DO BG10d: lenh trong khong chay`, `DO BG10e: khong dau vet`;
  `PASS: BG10c ` (chiều im đúng sẵn); KHÔNG dòng `doi chung nhay kep hong`.

- [ ] **Step 11: Commit** — `test(nhay-don-nhan-doi): BG10a–e + hàng đột biến 10 + răng lịch sử — đỏ trên mã cũ (…)`.

### Task 2: Vật — gỡ `''` ở nhánh nháy đơn của `unquoteScalar`

**Phục vụ:** E1–E8 · **independent:** false (sau Task 1)

**Files:** Modify: `lib/evidence-core.cjs` (`unquoteScalar` + đoạn chú thích «Giới hạn đã khai: nháy đơn nhân đôi…»)

- [ ] **Step 1:** Nhánh nháy đơn thành đúng chuỗi neo của hàng `DUONG` 10. Chú thích: thay câu giới hạn bằng một câu
  «vỏ đơn: `''` gỡ thành `'` (YAML 1.2.2 §7.3.2) — ca thật đầu tiên: crm tac-nhan-va 17/10, hồ sơ nhay-don-nhan-doi».
- [ ] **Step 2:** Run `node tests/scripts/bo-giai-nhay.test.mjs` → `bo-giai-nhay OK (14 chan)`, thoát 0 (kể cả BG5, BG8 —
  cần commit trước khi chạy hai chân này vì chúng archive HEAD).
- [ ] **Step 3:** Commit `fix(nhay-don-nhan-doi): unquoteScalar gỡ '' trong vỏ nháy đơn`, rồi chạy
  `node _acceptance/nhay-don-nhan-doi/rang/lich-su-do.mjs` → `XANH lich-su-do`.
- [ ] **Step 4:** Run `bash tests/scripts/run-tests.sh` → thoát 0.

### Task 3: Hạt giống cho lớp `parseEvals` không bóc nháy

**Phục vụ:** OOS-1, sổ d-2 · **independent:** true (tài liệu)

**Files:** Create `docs/plans/2026-10-18-hat-giong-parse-evals-khong-boc-nhay.md`; Modify `_acceptance/nhay-don-nhan-doi/contract.md` (`## Notes`, một dòng trích đường dẫn hạt giống — chân ② của VC8)

- [ ] **Step 1:** Hạt giống: hiện tượng (`cmd: "config:…"` / lệnh bọc nháy viết thẳng trong `evals.yaml` chạy nguyên văn
  → 127), bán kính 18 hồ sơ artifact-platform (lệnh đo), con trỏ `_acceptance/nhay-don-nhan-doi/`, ngưỡng mở ô:
  ≥1 kho đang cài kit hiện hành gặp BLOCKED 127 vì nó.
- [ ] **Step 2:** Run `VC_CASES=VC8 node tests/plugins/vao-co-o.test.mjs` → dòng PASS của VC8, thoát 0.
- [ ] **Step 3:** Commit `docs(hat-giong): parseEvals không bóc nháy cmd viết thẳng — từ nhay-don-nhan-doi`.

Kết S3: contract `status: implemented` → S4.
