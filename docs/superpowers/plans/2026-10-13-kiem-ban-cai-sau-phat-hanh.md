# Kiểm bản cài sau phát hành (KC1) — kế hoạch

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (T2 — thực thi tuần tự trong vòng chính,
> mọi task chung hai tệp nên không có task độc lập). Steps dùng checkbox (`- [ ]`).

**Goal:** Một lệnh cài đúng ref của kit vào cấu hình Claude cách ly + kho giả lập sạch, chạy vòng chạm từ bản cài, đỏ
khi thiếu thư mục gói / khác tag; cắm vào lượt chấm cắt mốc.

**Architecture:** `scripts/kiem-ban-cai.mjs` (ESM, không phụ thuộc ngoài) — hai chế độ `--ref` (giả lập) và `--may`
(máy thật, chỉ đọc). Tệp ca `tests/scripts/kiem-ban-cai.ca.mjs` (KB-1…KB-9) dựng mọi nguồn cài bị tiêm từ
`git archive HEAD` trong lượt; cờ `--chi-luot-moc` là cổng số phiên bản cho khoá suite.

**Tech Stack:** Node ≥ 20 (`node:child_process`, `node:crypto`, `node:fs`), git, CLI `claude plugin` (2.1.281).

**Spec:** `docs/superpowers/specs/2026-10-13-kiem-ban-cai-sau-phat-hanh-design.md` · hợp đồng
`_acceptance/kiem-ban-cai-sau-phat-hanh/contract.md` · bộ đo `evals.yaml` (E1–E10).

## Global Constraints

- Mọi dòng kết quả bắt đầu `[kiem-ban-cai] ` + một trong `ĐẠT|ĐỎ|VÀNG` + ` <mục>: <chi tiết>`; dòng cuối luôn
  `[kiem-ban-cai] TỔNG KẾT: …`. Thoát 0 = ĐẠT · 1 = ĐỎ · 2 = KHÔNG CHẠY ĐƯỢC (không bao giờ in «ĐẠT» trong ca 2).
- Tám mục, đúng thứ tự: `so-phien-ban · khop-tag · thu-muc-goi · tac-tu-cham · hook-goi · the-cong · luoi-truoc-gop · dieu-phoi`.
- Danh sách gói + số mong đợi rút từ `.claude-plugin/marketplace.json` + `<nguồn>/.claude-plugin/plugin.json` TẠI ref.
- Mọi lệnh `claude plugin` của chế độ giả lập chạy với `CLAUDE_CONFIG_DIR=<tạm>`; chế độ `--may` chỉ chạy `claude plugin list --json`.
- Đường dẫn trong tệp ca suy từ vị trí tệp (`import.meta.url`), không hardcode gốc kho.
- Thông điệp ghim (nguyên văn): «THIẾU thư mục gói: <gói>/<thư mục>» · «tác tử chấm vắng trong bản cài: feature-loop:<tên>» ·
  «name không khớp» · «tác tử chấm cầm bút: <công cụ>» · «bản cài khác tag» · «lưới không chặn hồ sơ phạm luật» ·
  «kho lành bị chặn» · «không tìm thấy lệnh claude» · «ref không có» · «khác số» · «khớp» · «thừa» ·
  «BỎ QUA: KB — không phải lượt cắt mốc».

## Review Focus

1. Bộ đệm thật bị ghi khi CLI bỏ qua `CLAUDE_CONFIG_DIR` → KB-1 chụp `plugins/cache/` + `marketplaces/` (độ sâu ≤ 4) trước/sau.
2. Bản cài thật chứa tệp ngoài git (`.claude/`, `node_modules/`, `.DS_Store`) → thừa chỉ VÀNG, đếm ở cấp thư mục (KB-4 thua, KB-7 checkout-that).
3. Lệnh con `claude` treo (mạng, hỏi lại) → mọi spawn có `timeout` 120 s; quá hạn = KHÔNG CHẠY ĐƯỢC (thoát 2), không ĐẠT.
4. Ref là tên nhánh/sha ngắn thay vì tag → `git rev-parse --verify <ref>^{commit}`; dòng TỔNG KẾT in `<ref> (<sha8>)`.
5. `hooks.json` dùng khoá `modules` (đường tương đối thư mục hooks — gói dieu-phoi) → `hook-goi` kiểm cả `modules`, không chỉ `${CLAUDE_PLUGIN_ROOT}`.

---

### Task 1: Lõi lệnh kiểm — cài cách ly + năm mục tĩnh + thoát 2

**Files:** Create `scripts/kiem-ban-cai.mjs`, `tests/scripts/kiem-ban-cai.ca.mjs` · **Phục vụ:** E2, E3, E4, E8 · **independent: false**

**Interfaces (Produces):**
- `docManifest(root, ref) → { cho: string, goi: [{ ten, nguon, so }] }`
- `cayCuaRef(root, ref, nguon) → Map<đường tương đối nguồn, sha blob>`
- `bamBlob(tep) → sha1 hex` của `blob <cỡ>\0<nội dung>`
- `soBanCai(installPath, cay) → { thieu: string[], lech: string[], thua: string[] }` (thư mục thừa đếm một mục, không đi sâu)
- `kiemTacTu(flPath) → string[]` (lỗi; rỗng = ĐẠT) · `kiemHook(installPath) → string[]`
- `chay(argv, { env, out }) → Promise<number>` mã thoát; CLI = `node scripts/kiem-ban-cai.mjs --ref <r> [--root <kho kit>] [--nguon-cai <dir>] [--giu] | --may --ref <r>`

- [ ] Viết ca KB-2 (HEAD nguyên vẹn: 8 dòng ĐẠT đúng thứ tự, `so-phien-ban` = tập tên trong marketplace.json, TỔNG KẾT ĐẠT 8/8); chạy → đỏ (tệp chưa có).
- [ ] Viết lõi: giải ref (thoát 2 «ref không có»), `git archive <ref> | tar -x` vào `<tạm>/nguon`, `claude plugin marketplace add`, `install <gói>@<chợ> --scope user` từng gói, `plugin list --json` → `installPath`; ENOENT của `claude` → thoát 2 «không tìm thấy lệnh claude». Năm mục tĩnh: `so-phien-ban`, `khop-tag` (thiếu/lệch ĐỎ «bản cài khác tag: N tệp — <gói>:<đường>, …»; thừa → `VÀNG khop-tag: thừa N`), `thu-muc-goi`, `tac-tu-cham` (regex `'feature-loop:([\w-]+)'` trên workflow ĐÃ CÀI; frontmatter `name`, `tools` cấm `Edit|Write|NotebookEdit|MultiEdit`), `hook-goi`. Ba mục chạm tạm in `ĐẠT` giữ chỗ chỉ trong task này — Task 2 thay.
- [ ] Ca KB-3 (thieu-agents · sai-ten · cam-but), KB-4 (lệch gate-card.js · thua), KB-8 (thieu-claude dùng thư mục liên kết node+git, khẳng định claude vắng · ref-khong-co). Mỗi ca đỏ chỉ chạy khi KB-2 PASS.
- [ ] Verify: `node tests/scripts/kiem-ban-cai.ca.mjs` → mọi dòng `PASS: KB-2/3/4/8 …`, thoát 0. Phá thử tay một lần: tạm đổi thông điệp «THIẾU thư mục gói» trong lệnh → KB-3 FAIL; hoàn lại.
- [ ] Commit `feat(kiem-ban-cai): lõi cài cách ly + năm mục tĩnh (KB-2/3/4/8)`.

### Task 2: Vòng chạm từ bản cài + không chạm máy thật + tag thật

**Files:** Modify `scripts/kiem-ban-cai.mjs`, `tests/scripts/kiem-ban-cai.ca.mjs` · **Phục vụ:** E1, E5, E6 · **independent: false**

**Interfaces:** Produces `dungKhoGiaLap(dir) → { kho, slug: 'kho-thu' }` (main: config `enforcement: strict` · `recheck: strict` · `t1_skip_globs: ["docs/**"]` + `docs/a.md` + hồ sơ `kho-thu` draft; nhánh `lanh`: sửa `docs/a.md`; nhánh `pham`: từ `lanh` + hồ sơ `pham-luat` signed-off, evidence PASS mà `exit_code: 1`).

- [ ] Ca KB-5 (5 bản sao phá: gate-card thoát 1 · pre-merge thoát 0 · pre-merge thoát 1 · dieu-phoi thoát 1 · hooks.json trỏ `hooks/khong-co.js`) → đỏ trước khi viết vòng chạm.
- [ ] Viết ba mục chạm: `the-cong` = `node <AG>/scripts/gate-card.js --root <kho> --slug kho-thu` thoát 0 + đầu ra chứa `kho-thu`; `luoi-truoc-gop` = `bash <AG>/scripts/pre-merge-check.sh <kho> --base main` trên nhánh `lanh` (0, nếu khác → «kho lành bị chặn») rồi `pham` (≠0 + `VIOLATION`, nếu không → «lưới không chặn hồ sơ phạm luật»); `dieu-phoi` = `node <DP>/scripts/dieu-phoi.mjs chan-doan --json` (cwd kho) thoát 0 + mảng có `muc: 'co-dot'`.
- [ ] Ca KB-1 (ảnh chụp cấu hình thật trước/sau `--ref HEAD` và `--may --ref HEAD`; độ nhạy trên bản sao tạm; thư mục tạm bị dọn; `--giu` giữ rồi ca tự xoá) và KB-6 (tag mới nhất `git describe --tags --abbrev=0 --match 'v*'` → ĐẠT 8/8 với sha8 tự giải).
- [ ] Verify: ca → `PASS: KB-1`, `PASS: KB-5 …` ×5, `PASS: KB-6 v2.28.0`, thoát 0.
- [ ] Commit `feat(kiem-ban-cai): vòng chạm thẻ cổng · lưới trước-gộp hai chiều · dieu-phoi (KB-1/5/6)`.

### Task 3: Chế độ máy thật `--may`

**Files:** Modify cả hai tệp · **Phục vụ:** E7 · **independent: false**

- [ ] Ca KB-7 (m5 — kèm khẳng định tiền đề bộ đệm vẫn lệch sau `update` · cai-lai · khac-so · checkout-that bằng `git worktree add --detach`) → đỏ.
- [ ] Viết `--may`: `claude plugin list --json` (env thật), lọc `id` kết thúc `@<chợ>`; số = số tại ref → `soBanCai` + thư mục cấp một → `ĐẠT may: <id> <scope> <dự án|-> <số> khớp <ref>[ · thừa N]` hoặc `ĐỎ may: … khác tag: …` / `THIẾU thư mục gói: …`; số khác → `VÀNG may: … khác số <số>`; không bản ghi nào → `ĐỎ may: không có bản ghi nào của <chợ>`.
- [ ] Verify: ca → bốn dòng `PASS: KB-7 …`. Commit `feat(kiem-ban-cai): kiểm bản cài trên máy thật (KB-7)`.

### Task 4: Cổng lượt cắt mốc + khoá suite

**Files:** Modify `tests/scripts/kiem-ban-cai.ca.mjs`, `_acceptance/config.yaml` · **Phục vụ:** E9 · **independent: false**

**Interfaces:** `nhanDienLuotMoc(root) → { ket: 'bo-qua'|'chay-tron', so, soGoc, ly_do }` (export của tệp ca; nhánh chính dò `origin/HEAD` → `origin/main` → `main` → `master`; lỗi bất kỳ → `chay-tron`).

- [ ] Ca KB-9 (config · im · doi-chung · do · khong-do trên bản sao kit `git archive HEAD` → kho tạm main + f) → đỏ.
- [ ] `--chi-luot-moc`: `bo-qua` → in `BỎ QUA: KB — không phải lượt cắt mốc (số <x> = gốc vòng)`, thoát 0; `chay-tron` → chạy `scripts/kiem-ban-cai.mjs --ref HEAD` rồi `--ref <tag mới nhất>`, in nguyên, thoát mã lớn nhất. Config: `executors.test.kiem_ban_cai`, `executors.test.kiem_ban_cai_moc`, thêm `executors.test.kiem_ban_cai_moc` vào `feature_loop.suite_keys` bằng `scripts/config-patch.mjs` (không sửa tay).
- [ ] Verify: ca trọn → mọi `PASS: KB-…`, thoát 0; `node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc` trên nhánh vòng → một dòng BỎ QUA.
- [ ] Commit `feat(kiem-ban-cai): cổng lượt cắt mốc + khoá suite (KB-9)`.

### Task 5: Lời dặn phát hành

**Files:** Modify `CHANGELOG.md` (mục «Chưa phát hành»), `GUIDE.md` (mục phát hành / §7.1) · **Phục vụ:** E10 · **independent: false**

- [ ] CHANGELOG: mục KC1 — đổi gì · ai bị ảnh hưởng · làm gì khi update: người cắt mốc chạy `node scripts/kiem-ban-cai.mjs --ref v<số>` SAU khi gắn tag; máy nhận chạy `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs --may --ref v<số> --root <kho kit>` sau khi cài, thay khối `node -e` bước 3 mục A1 của 2.27; đọc dòng TỔNG KẾT; `ĐỎ may:` → gỡ + cài lại bốn bước; khai bốn giới hạn design §4 kèm ngưỡng.
- [ ] GUIDE: đoạn ngắn cùng nội dung, trỏ CHANGELOG.
- [ ] Verify: `grep -n 'kiem-ban-cai' CHANGELOG.md GUIDE.md`; suite plugins vùng 3 (P200 đọc CHANGELOG) xanh. Commit `docs(kiem-ban-cai): lời dặn cắt mốc + máy nhận`.

Kết S3: chạy `node tests/scripts/kiem-ban-cai.ca.mjs` trọn + `bash tests/scripts/run-tests.sh --manh bash` (đụng config) → `status: implemented` → S4.
