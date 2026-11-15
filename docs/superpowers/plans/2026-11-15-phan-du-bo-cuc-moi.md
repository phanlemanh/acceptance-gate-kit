# phan-du-bo-cuc-moi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bộ kiểm và phần sản phẩm còn bám bố cục phẳng chạy xanh ở bố cục hôm nay và ở kho mới `plugins/<tên>/` — cụm K2, K3, SP, K4-SC, K4-PL (141 khoá của `_acceptance/phan-du-bo-cuc-moi/khoa-dich.tsv`).

**Architecture:** Một bộ dịch `tests/bo-cuc.mjs` nhận (đường phẳng, cây) và đọc bố cục từ `marketplace.json` + `lib/ho-goi.cjs` của chính cây ấy; mọi tệp kiểm vòng chạm gọi nó thay vì nối chuỗi đường. Thước giữ khoá ở `_acceptance/phan-du-bo-cuc-moi/rang/` dựng kho mới bằng `dungKhoMoi` của hồ sơ gọi chéo và so túi khoá.

**Tech Stack:** Node 24 ESM (`.mjs`), CommonJS cho `lib/*.cjs` và `scripts/*.cjs`, bash + heredoc Python trong `tests/plugins/run-tests.sh`, git.

**Spec:** `docs/superpowers/specs/2026-11-15-phan-du-bo-cuc-moi-design.md` · hợp đồng `_acceptance/phan-du-bo-cuc-moi/contract.md` (đã duyệt `4426fa89`) · evals `_acceptance/phan-du-bo-cuc-moi/evals.yaml`.

## Global Constraints

- Không đổi byte nào dưới `_acceptance/<hồ sơ khác>/` (AC-5); không sửa gì ở `~/dev/delivery-loop`, chỉ đọc tệp.
- Không đổi `.claude/settings.json`, không đổi khối khai chỗ trong `skills/acceptance/references/human-facing-language.md` và `skills/design-pass/SKILL.md` (AC-3).
- Bộ dịch sống ở `tests/bo-cuc.mjs` (KHÔNG `tests/lib/`); bảng hằng ở `tests/fixtures/bo-cuc-phang.json` (JSON dưới `fixtures/` — luật bước 6 không viết lại).
- Mọi gốc kho trong tệp kiểm và trong `rang/` suy từ vị trí script (`fileURLToPath(import.meta.url)`), không hardcode.
- Fixture do mã sinh trong lần chạy, ở `fs.mkdtempSync(os.tmpdir())`; bản gốc = `git archive` TRỌN cây của merge-base.
- Hạ tầng hỏng trong `rang/` → thoát 3 với dòng `HẠ TẦNG: …`, không in PASS.
- Mọi phép đo âm có đối chứng dương và ghim thông điệp; ca dựng bản sao kết luận từ mã thoát phải ghim câu.
- Chuẩn hoá khoá đúng luật `chuanHoa` của thước B2: bỏ `PASS:`/`FAIL:`, cắt ở ` — ` hoặc ` (`, che `/tmp…` thành `<tmp>`, che 7–40 hex thành `<sha>`.
- Commit nhỏ theo task; mỗi commit thông điệp `test|fix|feat(phan-du-bo-cuc-moi): …` + dòng `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Tệp đổi tên ở kho mới** (`road-map/commands/xem.md` → `plugins/roadmap/commands/status.md`, `skills/cat-luot/` → `skills/scope-slice/`): đường phẳng trỏ tệp lệnh/skill phải ra tên mới ở kho mới — Task 1 có ca BC-LENH rút từ bảng `LENH` của `luat-doi-chu.mjs`.
2. **`.claude-plugin/` nửa đi nửa ở**: `plugin.json` vào gói lõi, `marketplace.json` ở lại gốc — Task 1 hai ô riêng trong ma trận.
3. **Đường có glob** (`scripts/**`, `tests/*.mjs` trong `paths:` của hợp đồng đã ký): dịch tiền tố, giữ đuôi glob — Task 1 ca BC-GLOB.
4. **Đường tuyệt đối hoặc `..`** lọt vào bộ dịch: phải ném `bo-cuc: chỉ nhận đường tương đối gốc kho: <đường>` thay vì trả bừa — Task 1 ca BC-TUYET.
5. **Commit lịch sử không có `marketplace.json`** (trước khi kho có chợ): lỗi có tên, không lùi lặng về phẳng — Task 1 ca BC-THIEU (đã trong AC-2).

---

### Task 1: Bộ dịch đường

**independent:** false (mọi task sau dùng nó) · **phục vụ:** E2 (AC-2)

**Files:**
- Create: `tests/bo-cuc.mjs`
- Create: `tests/fixtures/bo-cuc-phang.json`
- Test: `tests/scripts/bo-cuc.test.mjs`

**Interfaces:**
- Produces (ESM, `tests/bo-cuc.mjs`):
  - `boCuc(cay) -> { phang: boolean, goc: { [vai]: string }, ten: { [vai]: string } }` — `cay` là `{ thuMuc }` hoặc `{ kho, ref }`; `goc[vai]` = thư mục nguồn tương đối gốc kho (`'.'` cho lõi phẳng); ném `bo-cuc: <cây> không có .claude-plugin/marketplace.json`.
  - `duong(rel, cay) -> string` — đường tương đối gốc kho của `rel` ở cây ấy (chuẩn hoá hai chiều, giữ đuôi glob); ném `bo-cuc: chỉ nhận đường tương đối gốc kho: <rel>`.
  - `tep(rel, cay) -> string` — đường tuyệt đối khi `cay.thuMuc`; với `{kho, ref}` trả chuỗi `<ref>:<đường>` cho `git show`.
  - `gocGoi(cay, vai) -> string` — đường tuyệt đối thư mục gốc gói vai `vai` (chỉ `thuMuc`).
  - `tenGoi(cay, vai) -> string` — tên plugin hiện hành của vai ở cây ấy.
  - `pathspec(rel, { kho, ref }) -> string` — như `duong`, rồi `git cat-file -e <ref>:<đường>` (bỏ đuôi glob trước khi kiểm phần thư mục); ném `bo-cuc: pathspec rỗng ở <ref>: <đường>` (chốt chống rỗng AC-7).
  - CLI: `node tests/bo-cuc.mjs duong <rel> [--thu-muc <dir> | --kho <dir> --ref <ref>]` in một dòng đường; mã 0, lỗi → stderr + mã 2.
- `tests/fixtures/bo-cuc-phang.json`: `{ "goi_phang": { "feature-loop": "feature-loop", "dieu-phoi": "dieu-phoi", "road-map": "lo-trinh", "tri-thuc": "tri-thuc", "diagram-design": "diagram-design" }, "thu_muc_loi": ["skills","commands","hooks","scripts","lib","vendor","evals","design-floor"], "tep_loi": [".claude-plugin/plugin.json"], "ten_moi": { "dispatch": "dieu-phoi", "roadmap": "lo-trinh", "knowledge": "tri-thuc", "acceptance-gate": "loi", "feature-loop": "feature-loop", "diagram-design": "diagram-design" }, "doi_ten_tep": { "<vai>": { "commands/<cũ>.md": "commands/<mới>.md", "skills/<cũ>": "skills/<mới>" } } }` — `doi_ten_tep` chép đủ 14 mục của `LENH` trong `_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs`, chỉ áp khi cây đích không phẳng.

- [ ] **Step 1: Viết tệp kiểm đỏ `tests/scripts/bo-cuc.test.mjs`**
  Fixture: `cayPhang` = `git archive HEAD` trọn cây vào tmp; `khoMoi` = `dungKhoMoi(cayPhang, tmp2)` (import từ `_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs`); `refCu` = commit đầu tiên có `.claude-plugin/marketplace.json` mà không có `lib/ho-goi.cjs` (`git log --diff-filter=A --format=%H -- lib/ho-goi.cjs` rồi lấy cha); `banSaoGoi` = `gocGoi({thuMuc: khoMoi}, 'lo-trinh')` chép ra tmp3.
  Ma trận viết trước `MA_TRAN = [[rel, {phang, moi}]...]` gồm tối thiểu: `scripts/lo-trinh.mjs`, `lib/ho-goi.cjs`, `hooks/hooks.json`, `skills/acceptance/SKILL.md`, `commands/approve.md`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `feature-loop/scripts/s4-args.mjs`, `dieu-phoi/scripts/dot.mjs`, `road-map/commands/xem.md` (moi: `plugins/roadmap/commands/status.md`), `tests/scripts/run-tests.sh`, `_acceptance/config.yaml`, và mỗi đường ấy ở dạng `plugins/…` (cột `phang` ra lại đường phẳng). Mỗi ô: `assert.equal(duong(rel, cay), ky_vong)` VÀ `existsSync(path.join(goc, ky_vong))` (hoặc `git cat-file -e`) — in `PASS: BC <rel> · <cây>`; `assert.equal(soPass, MA_TRAN.length * soCay)`.
  Ca riêng: `BC-LUY-DANG` (mọi ô: `duong(duong(r,c),c) === duong(r,c)`); `BC-LENH` (mỗi mục `LENH` của `luat-doi-chu.mjs` → tệp mới có thật ở `khoMoi`); `BC-GLOB` (`duong('scripts/**', khoMoi) === 'plugins/acceptance-gate/scripts/**'`); `BC-TUYET` (`/abs/x` và `../x` ném đúng câu); `BC-THIEU` (cây tmp không có `marketplace.json` → `bo-cuc: <cây> không có .claude-plugin/marketplace.json`) + đối chứng `BC-DU`; `BC-RONG` (`pathspec('khong-co/x', {kho, ref: 'HEAD'})` ném `bo-cuc: pathspec rỗng ở HEAD: khong-co/x`) + đối chứng `pathspec('scripts', …)` trả `scripts`.
- [ ] **Step 2: Chạy — phải đỏ** `node tests/scripts/bo-cuc.test.mjs` → `ERR_MODULE_NOT_FOUND …/tests/bo-cuc.mjs`.
- [ ] **Step 3: Viết `tests/fixtures/bo-cuc-phang.json` và `tests/bo-cuc.mjs`** theo Interfaces. Thuật toán `duong`: (1) chặn tuyệt đối/`..`; (2) tiền tố `plugins/<x>/` → vai qua `ten_moi` hoặc `goi_phang`, phần còn lại là đường trong gói (đảo `doi_ten_tep` nếu khớp); tiền tố là khoá `goi_phang` → vai đó; tiền tố trong `thu_muc_loi`/`tep_loi` → vai `loi`; còn lại → trả nguyên; (3) cây đích phẳng → ghép `goi_phang`-ngược (lõi: không tiền tố); không phẳng → `goc[vai]` + (`doi_ten_tep[vai]` nếu khớp). `boCuc` đọc `marketplace.json` (`thuMuc`: `readFileSync`; `kho+ref`: `git -C kho show ref:.claude-plugin/marketplace.json`), `phang = mọi source là './' hoặc './<tên phẳng>'`; tên theo vai từ `lib/ho-goi.cjs` của cây (nạp bằng `createRequire` với `thuMuc`, hoặc `git show` + `vm` với `ref`); vắng `ho-goi.cjs` → tên = khoá `goi_phang`.
- [ ] **Step 4: Chạy — phải xanh** `node tests/scripts/bo-cuc.test.mjs` → mọi dòng PASS, dòng cuối `bo-cuc: <n> passed, 0 failed`, mã 0.
- [ ] **Step 5: Commit** `tests/bo-cuc.mjs tests/fixtures/bo-cuc-phang.json tests/scripts/bo-cuc.test.mjs`.

### Task 1b: Chạy thử bộ dịch trên ba tệp khó nhất của cụm đã dời (đo, không giao)

**independent:** false (sau Task 1, trước Task 2–9) · **phục vụ:** giả định chốt sinh tử 1 của ô cơ hội — không AC nào
**Nguồn:** gợi ý của phiên giữ đợt, chủ kho cho chuyển 15/11; chủ kho quyết ở Gate 1.5. Lý do đặt SỚM: ba tệp nằm ở K4-LT /
K4-TB vừa dời, giả định 1 vẫn «Chưa thử» ở đúng chỗ khó nhất; bộ dịch hụt một hình dạng thì sửa nó TRƯỚC khi 25 tệp vòng này
dựa vào nó, không phải mở lại bộ dịch đã gộp ở vòng kế. Ma trận AC-2 không thay được phép thử này: nó đo đường, không đo
các hình dạng dùng-đường của ba tệp (bung lõi theo danh sách thư mục, merge-base sống, trộn `skills/` của cây đứng).

**Files:** Create: `_acceptance/phan-du-bo-cuc-moi/thu-bo-dich.md` (chỉ tệp này vào commit). Sửa thử ở một worktree tạm trong
scratchpad (`git worktree add <scratchpad>/thu-bo-dich HEAD`), gỡ worktree khi xong.

- [ ] **Step 1:** Ở worktree tạm, viết lại `tests/scripts/lo-trinh.test.mjs`, `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`,
  `tests/scripts/khoi-khuon-tren-the-cong.test.mjs` qua bộ dịch theo luật của Task 8. **Timebox 90 phút**: hết giờ thì
  dừng ở chỗ đang sửa, đo phần đã có.
- [ ] **Step 2:** Đo cả hai bố cục bằng `chuanHoa` của B2 (bố cục cũ: túi khoá ⊇ bản gốc; kho mới: số khoá đích của tệp
  về / tổng — 41, 43, 21 theo `khoa-dich.tsv`).
- [ ] **Step 3:** Ghi `thu-bo-dich.md`: bảng `| Tệp | Khoá về / đích | Cũ giữ đủ? | Hình dạng bộ dịch không phủ |`, mỗi
  hình dạng không phủ một dòng kèm dòng mã; hình dạng nào cần đổi Interfaces của Task 1 thì sửa Task 1 ngay (commit riêng,
  răng bền thêm ô) trước khi sang Task 2. Gỡ worktree tạm. Commit `thu-bo-dich.md`.

### Task 1c: Ba hàm phụ của bộ dịch (rút từ Task 1b, `thu-bo-dich.md`)

**independent:** false (trước Task 6–9) · **phục vụ:** E2 (AC-2)

**Files:** Modify `tests/bo-cuc.mjs`, `tests/scripts/bo-cuc.test.mjs`.

**Interfaces (Produces):**
- `boPhan(ds: string[], cay) -> string[]` — dịch từng phần tử theo cây; phần tử `.claude-plugin` ở cây không phẳng tách thành
  `.claude-plugin/marketplace.json` + đường `plugin.json` của lõi; kết quả luôn có `.claude-plugin/marketplace.json`; dùng
  chung cho `git archive -- …` và `cpSync` (H1, H2).
- `duong('.claude-plugin', <cây không phẳng>)` ném `bo-cuc: .claude-plugin tách ở <cây> — dùng boPhan` (H2).
- `tenCho(cay) -> string` — `name` của `.claude-plugin/marketplace.json` ở cây ấy (H7).

- [ ] Ca mới trong `bo-cuc.test.mjs`: `BC-BOPHAN` (danh sách lõi phẳng → kho mới: mỗi phần tử có thật, có tệp khai chợ) ·
  `BC-TACH` (ném đúng câu) + đối chứng cây phẳng trả `.claude-plugin` · `BC-CHO` (`acceptance-gate-kit` ở cây phẳng,
  `delivery-loop` ở kho mới). Đỏ trước, xanh sau, commit.

### Task 2: Thước giữ khoá

**independent:** false (cần Task 1 cho `--chieu-do`) · **phục vụ:** E1, E3–E8, E11, E12, E13 (hạ tầng)

**Files:**
- Create: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
- Create: `_acceptance/phan-du-bo-cuc-moi/rang/buoc6-chep.mjs` — chép `buoc6BoKiem` (`don-nha.mjs:298–382`) và các hằng/hàm nó gọi từ nhánh B2 `c87ff183` (đọc tệp trong worktree B2, không chạy lệnh ở đó), đầu tệp ghi nguồn + sha + «chép, không nạp»; bỏ phần áp `va-bo-kiem.json`.
- Create: `_acceptance/phan-du-bo-cuc-moi/rang/va-bo-kiem-b2.json` — chép nguyên `migration/kich-ban/va-bo-kiem.json` của cùng đỉnh.
- Test: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.test.mjs` (ca tự phá CU-DO ×2, DO-tự-kiểm)

**Interfaces:**
- Consumes: `duong`, `boCuc` (Task 1); `dungKhoMoi`, `luatDoiChu` (`luat-doi-chu.mjs`).
- Produces: `chuanHoa(dong) -> string` (đúng luật B2); `tuiKhoa(tepKiem, goc, { boChay }) -> { dat: Set<string>, do: Set<string> }` — `boChay` là `'scripts'|'plugins'|'dieu-phoi'` lấy từ cột `khoa` của `khoa-dich.tsv`; `.test.mjs`/`.ca.mjs` chạy `node <tệp>` ở gốc `goc`; khoá `(đầu)` của `plugins` chạy `bash tests/plugins/run-tests.sh`; khoá `?` của `dieu-phoi` chạy tệp `tests/dieu-phoi/*.test.mjs` chứa mã ca.
  CLI: `--cu` · `--moi [--cum <cụm>] [--bien-the i|ii|ca-hai]` (mặc định ca-hai) · `--chieu-do`. Dòng in đúng chữ của `expected` E1, E3–E8, E11, E12.
- [ ] **Step 1: Viết `giu-khoa.test.mjs` đỏ**: `CU-DO` — bản sao HEAD của `tests/scripts/bo-cuc.test.mjs` bị xoá một dòng `PASS: BC …` → `--cu` trên bản sao in `FAIL: CU tests/scripts/bo-cuc.test.mjs — mất khoá: <tên>` và mã 1; `CU-DO-DP` cùng hình trên một tệp `tests/dieu-phoi/*.test.mjs`; đối chứng: bản nguyên → mã 0.
- [ ] **Step 2: Chạy — đỏ** (`giu-khoa.mjs` chưa có).
- [ ] **Step 3: Viết `buoc6-chep.mjs`, chép `va-bo-kiem-b2.json`, viết `giu-khoa.mjs`.** `--moi` biến thể (i): `dungKhoMoi(HEAD-archive, tmp)` + chép `tests/ _acceptance/ docs/ .claude/` + `luatDoiChu()` áp lên `tests/**`; (ii): như (i) rồi `buoc6BoKiem` bản chép (không bảng vá). `--chieu-do`: trên kho mới (i), thay `tests/bo-cuc.mjs` bằng bản đồng nhất (`export const duong = r => r` + các hàm khác đồng nhất), chạy một ca canh mỗi cụm (bảng `CA_CANH` trong script: K2 `MQ-1`, K3 `RT13`, SP `CK-4-lib`, K4-SC `JR11a`, K4-PL `P161`) → phải đỏ; cùng ca với bộ dịch thật phải xanh. `GUI-B2`: lấy mọi mục `{tep, cu}` của `va-bo-kiem-b2.json` mà chuỗi `cu` KHÔNG còn trong tệp ấy ở HEAD → so với danh sách trong `gui-b2.md`.
- [ ] **Step 4: Chạy — xanh** `node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.test.mjs` → `PASS: CU-DO …`, `PASS: CU-DO-DP …`, mã 0.
- [ ] **Step 5: Commit.**

### Task 3: LT-94 thôi đỏ theo lịch

**independent:** true · **phục vụ:** E1 (AC-1)

**Files:** Modify: `tests/scripts/lo-trinh.test.mjs:1604` (mốc «Tới» `'2026-11-15'` → `'2026-10-20'`; mảng kỳ vọng dòng 1607 thành `['2026-09-01', '2026-10-03', '2026-10-20']`). Ca `CU-LT94` thêm vào `giu-khoa.mjs --cu`: chạy `LT_CASES=LT-94 node tests/scripts/lo-trinh.test.mjs` với `--import` một tệp tmp ghim `Date` ở `2026-10-20T09:00:00` (mẫu `veDuoiDongHo` dòng 1622) → phải đỏ, câu `trang chứa ngày chạy 2026-10-20`; không ghim → xanh.

- [ ] **Step 1:** Thêm `CU-LT94` vào `giu-khoa.mjs`, chạy `--cu` → `FAIL: CU-LT94 …` (vì LT-94 còn đỏ theo lịch hôm nay).
- [ ] **Step 2:** Sửa hai dòng; `LT_CASES=LT-94,LT-94-do node tests/scripts/lo-trinh.test.mjs` → hai PASS.
- [ ] **Step 3:** `--cu` → `PASS: CU-LT94 … đỏ «trang chứa ngày chạy»`. Commit.

### Task 4: Mã sản phẩm — bảng tên ở luật lộ trình

**independent:** true · **phục vụ:** E4, E13 (AC-4, AC-12)

**Files:**
- Modify: `lib/chan-lo-trinh.cjs` (hàm `khoaBat`, dòng 50–54; chỗ `require('./ho-goi.cjs')` lúc nạp)
- Modify: `scripts/lo-trinh-khoi-tao.mjs:44-47`
- Test: `tests/scripts/bang-ten-lo-trinh.test.mjs` (mới)

**Interfaces:**
- Produces: `lib/chan-lo-trinh.cjs` nạp bảng tên lười qua `napHoGoi()` (đọc `path.join(__dirname, 'ho-goi.cjs')` khi gọi lần đầu); thiếu tệp → `throw new Error('chan-lo-trinh: thiếu lib/ho-goi.cjs cạnh luật chặn')` chỉ tại chỗ cần bảng tên; `khoaBat()` khi không có `marketplace.json` cạnh gốc gói → ghép `${tenTheoVai('lo-trinh')}@${CHO}` như `lo-trinh-khoi-tao.mjs`.
- `scripts/lo-trinh-khoi-tao.mjs` dự phòng: `` `${tenTheoVai('lo-trinh')}@${CHO}` `` từ `lib/ho-goi.cjs` của cùng gói; không còn chữ `roadmap@delivery-loop`.

- [ ] **Step 1: Viết `bang-ten-lo-trinh.test.mjs` đỏ** — ma trận 8 ô `SP <lệnh> · <cũ|mới> · <có|thiếu>` đúng kỳ vọng E4 (bản gốc = `git archive $(git merge-base HEAD origin/main)` trọn cây; kho mới = `dungKhoMoi`; «thiếu» = bản cài gói lõi chép riêng `gocGoi(cay,'loi')` ra tmp, không `marketplace.json` cạnh); `SP-NL` (bản sao kho tiêu thụ có `lib/chan-lo-trinh.cjs`, không `lib/ho-goi.cjs`: `require` thoát êm, gọi `khoaBat` ném đúng câu) + `SP-NL-DU`; `SP-CHU` (`readFileSync('scripts/lo-trinh-khoi-tao.mjs')` không chứa `roadmap@delivery-loop`).
- [ ] **Step 2:** Chạy → đỏ ở `SP-CHU`, `SP-NL`, ô `mới · thiếu` của `chan-lo-trinh`.
- [ ] **Step 3:** Sửa hai tệp theo Interfaces.
- [ ] **Step 4:** `node tests/scripts/bang-ten-lo-trinh.test.mjs` + `node tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs` + `node tests/scripts/kho-moi-cai-goi-road-map.test.mjs` → xanh. Commit.

### Task 5: Bộ kiểm lại bằng chứng tìm verifier trong gốc gói lõi

**independent:** true · **phục vụ:** E6, E6b (AC-6) · **T3**

**Files:**
- Modify: `scripts/recheck-evidence.cjs` (bộ giải đường `verifier:` — chỗ in `verifier script not found`)
- Test: `tests/scripts/recheck-goc-goi-loi.test.mjs` (mới)

**Interfaces:** thêm hàm nội bộ `gocGoiLoi(gitRoot) -> string|null` — đọc `<gitRoot>/.claude-plugin/marketplace.json`, mục `name === 'acceptance-gate'` hoặc mục có `source` chứa `acceptance-gate`; trả `path.resolve(gitRoot, source)` khi khác `gitRoot`, ngược lại `null`. Ứng viên thêm vào CUỐI danh sách hiện có (thư mục tệp, gốc git, cwd) — hành vi cũ không đổi khi `null`.

- [ ] **Step 1: Viết tệp kiểm đỏ**: `RG-1` (kho tmp: `marketplace.json` lõi ở `plugins/acceptance-gate`, `plugins/acceptance-gate/scripts/product-map.mjs` giả thoát 0, báo cáo đã ký trỏ `verifier: scripts/product-map.mjs` — dựng bằng `git init` + commit trong tmp) → không có dòng `verifier script not found`; `RG-2` (kho không có `marketplace.json`) → đầu ra bằng từng byte đầu ra của `git show $(git merge-base HEAD origin/main):scripts/recheck-evidence.cjs` chạy trên cùng kho; `RG-3` (bản sao `recheck-evidence.cjs` có `gocGoiLoi` trả `null`) → `verifier script not found: scripts/product-map.mjs`, kèm RG-1 làm đối chứng.
- [ ] **Step 2:** Chạy → `RG-1` đỏ. **Step 3:** Sửa. **Step 4:** xanh; `node tests/scripts/core-untouched.test.mjs`, `node tests/scripts/premerge-repin.test.mjs`, `node tests/scripts/lan-status-not-run.test.mjs` xanh. Commit.

### Task 6: K2 — bên đọc khối khai chỗ, tên lệnh, quyền

**independent:** false (chung `tests/plugins/run-tests.sh` với Task 7, 9) · **phục vụ:** E3 (AC-3)

**Files:**
- Modify: `tests/plugins/run-tests.sh` — khối P188, P193, DP11, LB1, LM1, «ca lenh bam duoc», «ca nac phan ung»: mỗi đường đọc từ khối khai đi qua `node tests/bo-cuc.mjs duong <đường> --thu-muc "$ROOT"` (heredoc Python: `subprocess.check_output([...])`); LM1 so lệnh trong `permissions.allow` sau khi dịch đường trong lệnh.
- Modify: `tests/scripts/moi-cong-khong-qua-nut.test.mjs:43` — `LENH_KIT_RE` dựng từ `danhSach()` của `lib/ho-goi.cjs` ở `ROOT` (đường qua `tep('lib/ho-goi.cjs', {thuMuc: ROOT})`).
- Modify: `tests/scripts/s4-args-judgment-inputs.test.mjs:259` + `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs` — mảng thư mục quét qua `duong`; tệp tài liệu nạp `lib/eval-yaml.cjs` và `hoi-ngoai-inputs.mjs` qua bộ dịch (CLI hoặc `import()` của `tests/bo-cuc.mjs`).

- [ ] **Step 1:** `node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi --cum K2` → đỏ, liệt khoá thiếu.
- [ ] **Step 2:** Sửa từng khối; sau mỗi khối chạy riêng ca ấy ở bố cục cũ (`bash tests/plugins/run-tests.sh` lọc tên ca, hoặc `node <tệp>`).
- [ ] **Step 3:** `--moi --cum K2` → `PASS: MOI K2 — 27/27 …` và `PASS: MOI K2 khối khai chỗ giữ nguyên từng byte`. Commit; ghi mục vá B2 thừa vào `gui-b2.md`.

### Task 7: K3 — ca đọc hồ sơ đã ký

**independent:** false (chung `run-tests.sh`) · **phục vụ:** E5, E6b (AC-5)

**Files:**
- Modify: `tests/plugins/run-tests.sh` — P169, LM5, LM8b, ba «ca lan may qua bo phan loai» (hàm `phamViTuHopDong` của `tests/plugins/lan-may-classifier.test.mjs` cũng sửa): đường đọc từ hợp đồng/`paths:` đã ký đi qua `duong`.
- Modify: `tests/plugins/ra-co-ten.test.mjs` (RT13 khối `KHAC-BIET-DOC-CU`, RT18) — dịch đường trước khi so.
- Create: `tests/fixtures/cua-veto-sau-chu-ky.mjs` (bản của `_acceptance/cua-veto-sau-chu-ky/fixture.mjs`, gốc kho lấy từ tham số, đường qua bộ dịch); Modify: `tests/scripts/cua-veto-sau-chu-ky.test.mjs` gọi bản ở `tests/`; ca răng `CVS-BAN` so hai bản ở bố cục phẳng, chỉ khác đúng các dòng gọi bộ dịch (danh sách dòng khác viết trước trong ca).
- Create: `tests/fixtures/cham-bo-vang.mjs` (bản của `_acceptance/cua-tin-hieu-gom-nhom/rang/cham-bo-vang.mjs`, cùng luật); Modify: `tests/scripts/tin-hieu.test.mjs` (TH-10-ong, TH-10-do) + ca răng `TH-BAN`.
- Modify: ca gọi `_acceptance/stop-patching-law/make-record.mjs` — rút đích từ hằng `HARNESS` của nó rồi `duong`.

- [ ] **Step 1:** `--moi --cum K3` → đỏ. **Step 2:** sửa từng ca. **Step 3:** `--moi --cum K3` → `PASS: MOI K3 — 20/20 …` và `PASS: K3 hồ sơ đã ký không đổi byte …`; `git diff --stat $(git merge-base HEAD origin/main) -- '_acceptance/*/' | grep -v phan-du-bo-cuc-moi` rỗng. Commit; cập nhật `gui-b2.md`.

### Task 8: K4-SC — tệp kiểm scripts còn lại + chốt chống rỗng

**independent:** true (mỗi tệp riêng) · **phục vụ:** E7 (AC-7)

**Files (17, danh sách từ cột `cum=K4-SC` của `khoa-dich.tsv`):** `tests/scripts/{additive-only,chep-tri-thuc-du,ho-so-da-ky-giu-tuoi,hskt,kiem-ban-cai-loi-sua,luot-sua-giu-du,ngay-ky,ngoai-n-tu-dinh-tuyen,pre-merge-doc-lib-theo-kit,run-id-danh-sach-cho-phep,tep-sinh-khong-chan-gop,thiet-ke-nap-tri-thuc,vong-don-le-tra-tri-thuc,yaml-chuan,core-untouched,premerge-repin}.test.mjs`, `tests/scripts/can-cu-s1.ca.mjs`, `tests/scripts/eval-coverage-lint.js` (cùng `giu-tuoi-fixture.mjs` khi chạm).

Luật sửa mỗi chỗ: chuỗi đường nói về cây đang đứng → `duong(rel, {thuMuc: ROOT})`; về commit lịch sử (`git archive`/`git show`/`git diff`/`git log --`) → `pathspec(rel, {kho: ROOT, ref})`; về bản sao gốc gói → `gocGoi`; về kho tiêu thụ giả → KHÔNG dịch. Danh sách thư mục để bung/chép → `boPhan`. Biến, cờ hay biến môi trường mang gốc gói (`CLAUDE_PLUGIN_ROOT`, `--ag-root`, `AG=`) → `gocGoi(…, 'loi')` — ở bố cục phẳng gốc kho trùng gốc gói nên chỗ sót vẫn xanh, phải tìm bằng grep. Thư mục có tệp đổi tên bên trong (`skills/`, `commands/`) → dịch từng mục con, không chép nguyên. Tên chợ → `tenCho`. Mô-đun phụ trợ mà tệp kiểm nhập (vd `gate-fixture.mjs`, `giu-tuoi-fixture.mjs`) sửa cùng tệp kiểm, và đo lại MỌI tệp kiểm nhập mô-đun ấy (grep `import` tên mô-đun), không chỉ tệp trong cụm. Bốn chỗ xanh giả (ii): `ho-so-da-ky-giu-tuoi.test.mjs:619` + `giu-tuoi-fixture.mjs`, `core-untouched.test.mjs:46` (JR11a), `can-cu-s1.ca.mjs:261,270` (CC-02), `can-cu-s1.ca.mjs:570–573` (KK-4) dùng `pathspec`; `can-cu-s1.ca.mjs:387–390` (CC-05) bỏ phần đường khỏi hằng `VANG_MO_DUN`. `kiem-ban-cai-loi-sua`: lối A — fixture tự khai chợ nguồn `./` (khảo sát B §6). NT13: `--require scripts/dinh-tuyen-may.cjs` + `--root <gocGoi loi>`.

- [ ] **Step 1:** `--moi --cum K4-SC` → đỏ, liệt khoá. **Step 2:** sửa từng tệp; sau mỗi tệp `node <tệp>` xanh ở bố cục cũ. **Step 3:** thêm vào `giu-khoa.mjs` ca `K4-SC chốt chống rỗng` (bốn bản sao, mỗi bản đổi pathspec thành đường không có → ca đỏ với `bo-cuc: pathspec rỗng`). **Step 4:** `--moi --cum K4-SC` → `PASS: MOI K4-SC — 77/77 …` + `PASS: K4-SC chốt chống rỗng — 4/4 …`. Commit theo nhóm 3–5 tệp; cập nhật `gui-b2.md`.

### Task 9: K4-PL — bộ plugins và bộ điều phối

**independent:** false (chung `run-tests.sh`) · **phục vụ:** E8 (AC-8)

**Files:** Modify: `tests/plugins/run-tests.sh` (P161, P91, P93 — heredoc Python gọi CLI bộ dịch; `SKIP_TOP` của P93 rút từ `boCuc`), `tests/dieu-phoi/mo-dot.test.mjs`, `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`, `tests/dieu-phoi/ma-tran-thuc.mjs` (TC1-06, TC1-08, TC1-09 danh sách đóng rút từ vật, TC2-09, DP2-01, DP6-03, DP7-06 merge-base sống qua `pathspec`), ca DV5 trong `tests/scripts/premerge-repin.test.mjs`.

- [ ] **Step 1:** `--moi --cum K4-PL` → đỏ. **Step 2:** sửa. **Step 3:** `--moi --cum K4-PL` → `PASS: MOI K4-PL — 13/13 …`. Commit; cập nhật `gui-b2.md`.

### Task 10: Chiều đỏ, danh sách gửi B2, đo trọn

**independent:** false (sau 1–9) · **phục vụ:** E1, E11, E12

**Files:** Create/Modify: `_acceptance/phan-du-bo-cuc-moi/gui-b2.md` (ba mục: mục vá thừa `{tệp, chuỗi cũ}` · cấu hình kịch bản phải đổi — `.claude/settings.json`, `bo_kiem.tep_goc` · ca đổi nghĩa và lý do).

- [ ] **Step 1:** `node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --cu` → `giu-khoa --cu: <n> tệp, 0 khoá mất, 0 ca đỏ`.
- [ ] **Step 2:** `--moi` → `giu-khoa --moi: thiếu 0 ở 5 cụm; túi khoá <n>/<n> tệp ⊇ bố cục cũ` (cả hai biến thể).
- [ ] **Step 3:** `--chieu-do` → năm dòng `PASS: DO <cụm> …` + `PASS: GUI-B2 <n> mục vá thừa khớp gui-b2.md`.
- [ ] **Step 4:** chạy mọi khoá `feature_loop.suite_keys` ở nền → xanh. Commit.
- [ ] **Step 5 (tay, ngoài lượt chấm):** clone tạm `~/dev/delivery-loop` vào scratchpad, áp `gui-b2.md` lên bảng vá của bản clone, chạy `migration/kich-ban/don-nha.mjs` từ nhánh vòng → ghi số khoá thiếu ở các cụm vòng nhận vào Notes của hợp đồng.
