# Xả stdout trước khi thoát — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** thẻ cổng / JSON trích của `gate-card.js` và JSON làn ghim lại đỏ của `repin-lane.mjs` không còn bị cắt im lặng ở 65 536 byte khi stdout là pipe.

**Architecture:** thay «ghi rồi `process.exit` ngay» bằng «thoát trong callback của lần ghi». gate-card (CommonJS): hàm `ghiRoiThoat` + `return` ở cấp mô-đun. repin-lane (ESM): `await xaRoiThoat(1)` — lần ghi rỗng có callback, lời hứa không bao giờ xong. Một tệp ca đo hai chiều có dò nền.

**Tech Stack:** Node 24 (ESM test, CJS gate-card), `node:child_process` spawnSync/spawn, git (kho thử của repin-lane).

**Spec:** `docs/superpowers/specs/2026-10-11-xa-stdout-truoc-khi-thoat-design.md` · hợp đồng `_acceptance/xa-stdout-truoc-khi-thoat/contract.md` · `evals.yaml`.

## Global Constraints

- Bốn literal ghim chung (có dấu): `nền: CẮT (dò nhận <n> / 200000 byte)` / `nền: KHÔNG CẮT (dò nhận <n> / 200000 byte)` · `nhận <n> / <m> byte` · `KHÔNG ĐO ĐƯỢC ở nền này` · `mutant không áp được`.
- Tiền đề cỡ fixture lớn: bản tệp > 65 536 byte VÀ (nền cắt) ≥ 2 × n_dò.
- Mọi đường dẫn suy từ vị trí tệp ca; bản sao lấy TRỌN thư mục (`scripts` + `lib` + `skills` cho gate-card; `feature-loop` cho repin-lane), không danh sách tệp tay.
- Thẻ dưới 64 KB không đổi byte nào (AC-5).
- Tên tệp ca xếp CUỐI glob `tests/scripts/*.test.mjs`; khoá executor mới KHÔNG vào `feature_loop.suite_keys`.
- Không sửa tệp nguồn khi `repin-lane-noi-ra.test.mjs` đang chạy (GN13 ghi trả bản chụp).

## Review Focus

- Người đọc đóng sớm (`| head`): mã thoát phải giữ 0 như hôm nay, không vết EPIPE — XD-6 (Task 1/3).
- Callback không bao giờ được gọi (người đọc treo): tiến trình treo thay vì thoát — ca dùng trần thời gian 30 s mỗi lần chạy, treo = đỏ có tên (Task 1).
- Thẻ dưới 64 KB đi qua `return` cấp mô-đun: mã sau khối không được chạy thêm byte nào — XD-5 so từng byte với bản hoàn nguyên (Task 1/3).
- UTF-8 bị cắt giữa ký tự (DP4 sập ở byte 65 534): fixture dùng chữ có dấu nhiều byte — XD-1..3 (Task 1).
- Nền không cắt (bộ đệm lớn): ca không được xanh rỗng chiều đỏ — in `KHÔNG ĐO ĐƯỢC ở nền này` (Task 1).

---

### Task 1: Tệp ca đo `tests/scripts/xuat-du-qua-pipe.test.mjs` + khoá executor (ĐỎ trước vật)

**Files:**
- Create: `tests/scripts/xuat-du-qua-pipe.test.mjs`
- Modify: `_acceptance/config.yaml` (thêm `executors.test.xuat_du_qua_pipe: "node tests/scripts/xuat-du-qua-pipe.test.mjs"`)

**Phục vụ:** E1–E7 · **independent:** false (Task 2, 3 làm nó xanh)

**Interfaces:**
- Consumes: `tests/scripts/gate-fixture.mjs` → `mkWs(slug, files, cfg)`.
- Produces: các ca in `PASS: XD-<k> …` / `FAIL: XD-<k> …` / `XD-<k> KHÔNG ĐO ĐƯỢC ở nền này …`; tìm chuỗi mutant `return ghiRoiThoat(` (đúng 4 lần, theo thứ tự nguồn: trích Cổng 1 · thẻ Cổng 1 · trích Cổng 2 · thẻ Cổng 2 chưa-ký) và `await xaRoiThoat(1);` (đúng 1 lần).

- [ ] **Step 1: Viết tệp ca.** Cấu trúc:
  - `quaPipe(args, opts)` = `spawnSync(node, args, {maxBuffer: 1<<28, timeout: 30000})`; `quaTep(args, opts)` = cùng lệnh, stdout là fd tệp, trả Buffer đọc lại.
  - Dò nền: `quaPipe(['-e', "process.stdout.write('x'.repeat(200000)); process.exit(0)"])` → `N_DO`; `NEN_CAT = N_DO < 200000`; in dòng literal `nền: …`. `CO_MIN = NEN_CAT ? max(65537, 2*N_DO) : 65537`.
  - Dò EPIPE: lệnh một dòng `write 200 KB; process.exitCode = 0` qua `dongSom()` (đọc mẩu đầu rồi `destroy`) → `EPIPE_SAP = code !== 0 && /EPIPE/.test(stderr)`.
  - Fixture code-sinh qua `mkWs`: (a) Cổng 1 draft, sổ 2×K dòng (nửa ba vế, nửa `decision`+`impact`, chữ có dấu); (b) Cổng 2 verified PASS cùng sổ; (c) Cổng 2 BLOCKED, `reason:` dài; (d) bản nhỏ của a/b/c (sổ 2 dòng).
  - Bản sao: `banSao(thuMuc[], bienDoi)` chép trọn thư mục vào TMP, áp biến đổi chuỗi lên tệp đích, `node --check`. `hoanNguyen(k)` = thêm `const ghiNgay = (noiDung, ma) => { process.stdout.write(noiDung); process.exit(ma); };` ngay trước dòng `const ghiRoiThoat =` và đổi lần thứ k của `return ghiRoiThoat(` → `return ghiNgay(`. Đếm lần khác 4 → lỗi `mutant không áp được`.
  - Phán đỏ ô chéo: `do(nhan, tep, ma)` đúng khi `r.status === ma && 0 < n < m && tep.subarray(0, n).equals(nhan)`; thông điệp `<chỗ>: nhận <n> / <m> byte`.
  - Ca XD-1…XD-7 đúng như AC; XD-7 dựng kho git hai slug theo khuôn `mkKho` của `repin-lane-noi-ra.test.mjs` (suite đỏ), `--reason` ~80 KB, `--run-id` cố định; so tiền tố sau khi chuẩn hoá chữ số (`/\d+(\.\d+)?/g → '#'`) và bỏ 32 byte đuôi.
  - Thoát `failed ? 1 : 0`; in tổng kết `xuat-du-qua-pipe: <p> PASS · <f> FAIL · <k> KHÔNG ĐO ĐƯỢC`.
- [ ] **Step 2: Thêm khoá executor** vào `_acceptance/config.yaml` dưới `executors.test` (không vào `suite_keys`).
- [ ] **Step 3: Chạy, thấy ĐỎ trên M5:** `node tests/scripts/xuat-du-qua-pipe.test.mjs` → XD-1/2/3 FAIL `nhận 65536 / <m> byte`; XD-4/5/6/7 FAIL `mutant không áp được` (chưa có `ghiRoiThoat` / `xaRoiThoat`).
- [ ] **Step 4: Commit ca đo trước vật** — `test(xa-stdout-truoc-khi-thoat): ca đo XD-1..XD-7 — đỏ trên nền cắt trước khi sửa`.

### Task 2: Sửa `scripts/gate-card.js`

**Files:** Modify `scripts/gate-card.js` (đầu tệp sau khối `require`; dòng 802, 909–910, 1157, 1196–1197) · **Phục vụ:** E1–E6 · **independent:** false

- [ ] **Step 1:** thêm sau `const { parseEvals } = evalYamlLib;`:

```js
// Thoát SAU khi stdout đã xả (hồ sơ xa-stdout-truoc-khi-thoat). Stdout ra pipe là bất đồng bộ trên
// POSIX: process.exit ngay sau một lần ghi lớn cắt đầu ra ở bộ đệm pipe (65 536 byte trên macOS), im
// lặng. Không dùng process.exitCode: người đọc đóng sớm (| head) thì EPIPE thành lỗi không bắt, mã 1;
// callback của write nhận cả lỗi đó nên mã thoát giữ nguyên. Gọi bằng `return ghiRoiThoat(...)`.
const ghiRoiThoat = (noiDung, ma) => { process.stdout.write(noiDung, () => process.exit(ma)); };
```

- [ ] **Step 2:** bốn chỗ `process.stdout.write(X); process.exit(0);` → `return ghiRoiThoat(X, 0);` (giữ nguyên biểu thức X).
- [ ] **Step 3:** `node tests/scripts/xuat-du-qua-pipe.test.mjs` → XD-1…XD-6 PASS; `node tests/scripts/gate-card-lmcms.test.mjs` và `node tests/scripts/gate-card-duong-nen.test.mjs` xanh.
- [ ] **Step 4:** commit `fix(gate-card): thoát trong callback của lần ghi — thẻ > 64 KB qua pipe không còn bị cắt`.

### Task 3: Sửa nhánh LÀN ĐỎ của `feature-loop/scripts/repin-lane.mjs`

**Files:** Modify `feature-loop/scripts/repin-lane.mjs:722` + một hàm gần `die()` · **Phục vụ:** E7 · **independent:** false

- [ ] **Step 1:** thêm cạnh `function die(...)`:

```js
// Thoát SAU khi stdout đã xả (hồ sơ xa-stdout-truoc-khi-thoat): JSON làn đỏ in mọi slug, vượt bộ đệm
// pipe từ ~45 slug; process.exit ngay thì phần sau 64 KB mất im lặng. Lần ghi rỗng chỉ gọi callback sau
// mọi lần ghi trước; lời hứa không bao giờ xong nên mã phía dưới không chạy. Gọi bằng `await`.
const xaRoiThoat = (ma) => new Promise(() => { process.stdout.write('', () => process.exit(ma)); });
```

- [ ] **Step 2:** cuối khối `if (red) { … }`: `process.exit(1);` → `await xaRoiThoat(1);`.
- [ ] **Step 3:** `node tests/scripts/xuat-du-qua-pipe.test.mjs` → XD-7 PASS; `node tests/scripts/repin-lane.test.mjs` xanh. KHÔNG chạy song song với việc sửa tệp nguồn.
- [ ] **Step 4:** commit `fix(repin-lane): làn đỏ xả JSON trước khi thoát`.

### Task 4: Ghi chú design + suite đầy đủ

**Files:** `docs/superpowers/specs/2026-10-11-xa-stdout-truoc-khi-thoat-design.md` (§3: một dòng đối chứng `start-scan.mjs` 51 965 B kết tự nhiên) · **independent:** false

- [ ] **Step 1:** thêm dòng đối chứng.
- [ ] **Step 2:** `bash tests/scripts/run-tests.sh --manh mjs:3/3` xanh (tệp ca nằm mảnh 3); P161 chạy trong lượt chấm (vùng 2).
- [ ] **Step 3:** contract `status: implemented`, commit, sang S4 (xin lượt Điều phối).
