# dieu-phoi-dong-goi-loi — kế hoạch thực thi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đưa lõi Điều phối – Thợ từ crm (`scripts/dieu-phoi/` ở `a9e8bc75a`) vào kit thành gói thứ tư `dieu-phoi`, bật bằng cách cài gói, im ở kho không có đợt, đọc tiếp được đợt do bản crm dựng.

**Architecture:** Gói là một thư mục phẳng `dieu-phoi/` (manifest · `hooks/hooks.json` · `scripts/` 14 tệp lõi + `phan-loai-s4.mjs` mới · `scripts/mau/` · README). Lõi chép NGUYÊN, chỉ sửa đúng bốn chỗ hợp đồng cho phép (AC-8 nằm ở kit, AC-10 · AC-11 · AC-12 ở lõi) cộng cảnh báo hai bản (AC-5). Mọi phép đo mới sống ở `tests/dieu-phoi/dong-goi.test.mjs` (tên ca `DP1-…`), 14 tệp test lõi ở `tests/dieu-phoi/loi/`.

**Tech Stack:** Node ≥ 22 (`node:test`, ESM, không phụ thuộc npm), bash, python3 (khối P33), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-09-dieu-phoi-tho-trong-kit-design.md` Phần II §8–§11 · spec workflow `2026-10-10-dieu-phoi-workflow-design.md` §16 (T1–T5, T13 thắng chữ cũ) · hợp đồng `_acceptance/dieu-phoi-dong-goi-loi/contract.md` · `evals.yaml`.

## Global Constraints

- Nguồn lõi: crm `a9e8bc75a`; `git -C <crm> diff a9e8bc75a origin/onehub -- scripts/dieu-phoi/` rỗng (đo 10/10). Không ghi gì vào kho crm.
- Phiên bản `dieu-phoi/.claude-plugin/plugin.json` == phiên bản `feature-loop` (hôm nay `2.26.0`).
- Gói không import gì ngoài `dieu-phoi/` và `node:*` (AC-6). Đường dẫn trong test và script suy từ vị trí tệp, không hardcode ROOT.
- Danh sách cấm (AC-7) trên `dieu-phoi/**` và `tests/dieu-phoi/fixtures/**`: `onehub, crm, prisma, bunx, bun run, bun install, :3000, :3001, 5432, docs/plan/dot-` (không phân biệt hoa thường).
- Mọi phép đo mới: cặp hai chiều trên CÙNG fixture, ghim thông điệp (MEASURE-BIRTH-CLAUSE). Kho thử do code sinh (`git init` trong `os.tmpdir()`), trừ fixture đọc-cũ AC-4.
- Không thêm lệnh `/dieu-phoi:…` (DP2–DP4). Không đổi hành vi lõi ngoài AC-5 · AC-10 · AC-11 · AC-12.
- Fixture AC-4 lấy từ gói chuyển giao (`~/Downloads/chuyen-may-2026-10-10/dot-crm-sau-14-10-chup.tgz`), ẩn danh bằng `tests/dieu-phoi/an-danh.mjs` TRƯỚC khi vào cây; bản thô không bao giờ vào git.
- CI của kit chạy ubuntu, Node 22: mọi ca lõi phải xanh không cần `sysctl` thật (io giả).

## Review Focus

1. **Lệnh Bash ghép** (`cd x && TZ=UTC node ./repin-lane.mjs …`, ống `|`, `bash -c '…'`, dòng đã bọc `node …/giu-nhip.mjs -- …`) — bộ phân loại cấu trúc phải ra cùng tài nguyên như bản chuỗi con trên bảy dạng của ca crm «ma trận bảy dạng», nếu không lệnh bọc sẽ không còn được nhận là S4. Ca: Task 4 bước 1 ghim cả bảy dạng.
2. **`node --test <tệp có chữ repin-lane/s4-args>`** và `grep … s4-args` — không chặn (lý do của AC-10). Ca: Task 4.
3. **Kho thử không phải kho git / cwd qua symlink** ở chiều im — hook phải im, không ném. Ca: Task 3 thêm cột «cwd ngoài git».
4. **Bản chụp có đơn trỏ worktree không tồn tại** — bộ đọc cũ chuyển đơn vào `xin/hong/` (sự kiện `don-hong`), không phải `loi-nhip`. Ca: Task 12 đếm `don-hong` == 0 sau khi thay `@KHO@`.
5. **Gói bị xoá khi bộ phát lịch đang chạy từ chính gói** — phải phát «lõi vắng» và ngưng cấp, không cấp lại khoá. Ca: Task 10 chiều đỏ.

---

### Task 1: Chép lõi + 84 ca vào kit, chạy được trong CI

**Phục vụ:** E3, E3b (AC-3); nền cho mọi task sau · **independent:** false

**Files:**
- Create: `dieu-phoi/.claude-plugin/plugin.json`, `dieu-phoi/scripts/{bang,cau-hinh,dieu-phoi,dot,giu-nhip,glob,hinh-dang,hook-chan-s4,hook-cho-nguoi,hook-nhip,lich,phat-lich,suc-khoe,yeu-cau}.mjs`, `dieu-phoi/scripts/mau/{LUAT.md,dieu-phoi.config.json,hang-viec.json}`
- Create: `tests/dieu-phoi/loi/*.test.mjs` (13 tệp) + `tests/dieu-phoi/loi/mau-thu.mjs`
- Create: `tests/dieu-phoi/chay-buoc-ci.mjs`, `tests/dieu-phoi/dong-goi.test.mjs` (khung + ca DP1-03-do)
- Modify: `.github/workflows/gate.yml` (thêm một bước sau «workflows suite»), `_acceptance/config.yaml` (bốn khoá executor)

- [ ] **Bước 1: chép nguồn ghim.** `git -C ~/dev/crm-onehub archive a9e8bc75a scripts/dieu-phoi | tar -x -C <tạm>`; chép `*.mjs` + `mau/` vào `dieu-phoi/scripts/`, `test/*` vào `tests/dieu-phoi/loi/`. README để Task 2.
- [ ] **Bước 2: viết lại import của test.** Trong `tests/dieu-phoi/loi/*.mjs`: `from '../X.mjs'` → `from '../../../dieu-phoi/scripts/X.mjs'`; `./mau-thu.mjs` giữ nguyên. Tìm mọi chỗ test dựng đường tới thư mục lõi (`path.join(…, '..', …)`, `import.meta.url`) và trỏ lại `dieu-phoi/scripts/`.
- [ ] **Bước 3: chạy.** `node --test --test-reporter=tap "tests/dieu-phoi/loi/*.test.mjs"` → kỳ vọng `# pass 84`, `# fail 0`. Ca đỏ nào vì đường thì sửa đường trong test, KHÔNG sửa lõi.
- [ ] **Bước 4: manifest.**
```json
{
  "name": "dieu-phoi",
  "version": "2.26.0",
  "description": "Điều phối – Thợ: bộ phát lịch khoá S4/merge, CLI đợt và bốn hook (chặn S4, nhịp, chờ người). Cài theo kho (--scope project); hook im khi kho không có đợt. Pairs with feature-loop.",
  "author": { "name": "Manh Phan" }
}
```
- [ ] **Bước 5: bước CI + executor.** `gate.yml` thêm:
```yaml
      - name: dieu-phoi suite (lõi Điều phối – Thợ + ca đóng gói DP1)
        run: node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs"
```
`config.yaml` dưới `executors.test`: `dieu_phoi: "node --test --test-reporter=tap \"tests/dieu-phoi/**/*.test.mjs\""` và `dieu_phoi_plugins` (Task 8); dưới `executors.script`: `dieu_phoi_ci: "node tests/dieu-phoi/chay-buoc-ci.mjs"`, `dieu_phoi_validate: "node tests/dieu-phoi/kiem-validate.mjs"`. Ghi bằng `scripts/config-patch.mjs --write`, không sửa tay.
- [ ] **Bước 6: `chay-buoc-ci.mjs`.** Gốc kho = `path.resolve(dirname(import.meta.url), '../..')` hoặc `--root`. Đọc `.github/workflows/gate.yml`, lấy mọi dòng `run:` của bước có lệnh chứa `tests/dieu-phoi` (khớp dòng `- name:` … `run:` bằng regex khối như P35). Số bước ≠ 1 → in `buoc-ci: tim thay <n> buoc chua tests/dieu-phoi` và thoát 1. Chạy lệnh bằng `bash -c` tại gốc, hứng stdout; rút `# pass N`, `# fail N`, `# skipped N`, `# todo N`. In lệnh + bốn số; `pass >= 84 && fail==0 && skipped==0 && todo==0 && exit==0` → `PASS: DP1-03 buoc-ci`, thoát 0; ngược lại in `FAIL: DP1-03 buoc-ci` + các dòng `not ok` (tên ca) và thoát 1.
- [ ] **Bước 7: ca DP1-03-do ca-tiem-loi** trong `dong-goi.test.mjs`: dựng bản sao tạm gồm `.github/workflows/gate.yml`, `dieu-phoi/`, `tests/dieu-phoi/loi/`, `tests/dieu-phoi/chay-buoc-ci.mjs` (KHÔNG chép `dong-goi.test.mjs`); chạy `node <bản sao>/tests/dieu-phoi/chay-buoc-ci.mjs --root <bản sao>` → thoát 0 (đối chứng dương); tiêm `assert.fail('tiem');` làm dòng đầu thân ca đầu của `loi/lich.test.mjs` → thoát ≠ 0, stdout chứa tên ca đó (rút tên bằng regex `test\('([^']+)'` trên tệp gốc).
- [ ] **Bước 8: verify.** `node tests/dieu-phoi/chay-buoc-ci.mjs` → `PASS: DP1-03 buoc-ci`; `node --test tests/dieu-phoi/dong-goi.test.mjs` → `ok … DP1-03-do ca-tiem-loi`.
- [ ] **Bước 9: commit** `dieu-phoi: chép lõi từ crm a9e8bc75a + 84 ca + bước CI (AC-3)`.

### Task 2: Cài là đủ — `hooks.json`, mục marketplace, README và khuôn trung lập

**Phục vụ:** E1, E1b (AC-1); E6 vế khuôn (AC-6) · **independent:** false

**Files:**
- Create: `dieu-phoi/hooks/hooks.json`, `dieu-phoi/README.md`, `tests/dieu-phoi/kiem-validate.mjs`
- Modify: `.claude-plugin/marketplace.json`, `dieu-phoi/scripts/mau/LUAT.md`, `tests/dieu-phoi/dong-goi.test.mjs`

- [ ] **Bước 1: ca đỏ trước.** Trong `dong-goi.test.mjs` viết hàm `kiemCaiDat(gocKit, gocGoi) → string[]` (mảng lỗi) và bảng viết sẵn:
```js
const BANG_HOOK = [
  ['PreToolUse', 'Workflow|Bash', 'hook-chan-s4.mjs'],
  ['PostToolUse', '*', 'hook-nhip.mjs'],
  ['Notification', 'idle_prompt|permission_prompt', 'hook-cho-nguoi.mjs'],
  ['UserPromptSubmit', '—', 'hook-cho-nguoi.mjs'],
];
```
`kiemCaiDat` rút bộ ba từ `hooks.json` (`hooks.<sự kiện>[].matcher ?? '—'`, tên tệp = `/([\w-]+\.mjs)/` trong `command`), so tập bằng nhau với bảng (lỗi nêu sự kiện lệch), kiểm mục marketplace `{name:'dieu-phoi', source:'./dieu-phoi'}`, so version với `feature-loop`, kiểm tệp thân tồn tại trong gói. Ca `DP1-01 cai-la-du` còn chạy từng lệnh (thay `${CLAUDE_PLUGIN_ROOT}` = đường gói) bằng `bash -c` với stdin là đầu vào mẫu của sự kiện trong kho thử không đợt → mã 0, stderr không `Cannot find module`, in số lệnh == 4. Chạy → đỏ (hooks.json chưa có).
- [ ] **Bước 2: `hooks.json`** (thân y như khối settings crm, đổi gốc):
```json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "Workflow|Bash", "hooks": [{ "type": "command", "timeout": 10, "command": "f=\"${CLAUDE_PLUGIN_ROOT}/scripts/hook-chan-s4.mjs\"; [ -f \"$f\" ] || exit 0; exec node \"$f\"" }] }],
    "PostToolUse": [{ "matcher": "*", "hooks": [{ "type": "command", "timeout": 10, "command": "f=\"${CLAUDE_PLUGIN_ROOT}/scripts/hook-nhip.mjs\"; [ -f \"$f\" ] || exit 0; exec node \"$f\"" }] }],
    "Notification": [{ "matcher": "idle_prompt|permission_prompt", "hooks": [{ "type": "command", "timeout": 10, "command": "f=\"${CLAUDE_PLUGIN_ROOT}/scripts/hook-cho-nguoi.mjs\"; [ -f \"$f\" ] || exit 0; exec node \"$f\"" }] }],
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "timeout": 10, "command": "f=\"${CLAUDE_PLUGIN_ROOT}/scripts/hook-cho-nguoi.mjs\"; [ -f \"$f\" ] || exit 0; exec node \"$f\"" }] }]
  }
}
```
Mục marketplace: `{ "name": "dieu-phoi", "source": "./dieu-phoi", "description": "…", "tags": ["bat-theo-lua-chon"] }` (dấu dùng ở Task 7).
- [ ] **Bước 3: hai mutant** `DP1-01-do doi-ten-tep` (bản sao gói đổi tên `hook-nhip.mjs` → lỗi nêu `hook-nhip.mjs`) và `DP1-01-do dao-lenh` (bản sao `hooks.json` đảo `command` của PostToolUse và Notification → lỗi nêu `PostToolUse`), cả hai đi qua CHÍNH `kiemCaiDat`, sau đối chứng dương trên bản sao nguyên vẹn.
- [ ] **Bước 4: `kiem-validate.mjs`.** `spawnSync('claude', ['--version'])` lỗi ENOENT → in `FAIL: claude CLI vắng`, thoát 1. In phiên bản. `claude plugin validate --strict --json <gốc>/dieu-phoi` → mã 0 và không mục lỗi → `PASS: DP1-01b validate`. Bản sao gói trong tạm, `hooks.json` = `JSON.stringify(goc.hooks)` (bỏ lớp ngoài) → mã ≠ 0 và đầu ra chứa `hooks` → `PASS: DP1-01b-do bo-lop-hooks`. Bất kỳ vế nào hỏng → `FAIL: …` + thoát 1. (Máy này 2.1.281: chạy thử, ghi kết quả; CLI chưa có `validate --strict --json` thì đó là giới hạn máy, không sửa eval.)
- [ ] **Bước 5: khuôn + README.** `mau/LUAT.md` dòng lệnh bọc → «chép đúng dòng lệnh bọc mà hook in sẵn khi chặn (đường tuyệt đối tới `giu-nhip.mjs` của bản đang cài)», ví dụ dùng `<đường gói>/scripts/giu-nhip.mjs`. README viết lại từ bản crm: lệnh gọi `node <đường gói>/scripts/dieu-phoi.mjs …`, giải đường gói bằng `node <feature-loop>/scripts/resolve-plugin.mjs --plugin dieu-phoi`, phần cài (`claude plugin install dieu-phoi@acceptance-gate-kit --scope project`), không nhắc `scripts/dieu-phoi/`. Ca `DP1-06 khuon` + `DP1-06-do khuon` (hàm `kiemKhuon(goc)` trả `tệp:dòng` của mọi dòng chứa `scripts/dieu-phoi/`; bản sao tiêm `node scripts/dieu-phoi/giu-nhip.mjs` vào LUAT.md → lỗi nêu `LUAT.md:<dòng>`).
- [ ] **Bước 6: verify** `node --test tests/dieu-phoi/dong-goi.test.mjs` → `ok` cho DP1-01, DP1-01-do×2, DP1-06 khuon, DP1-06-do khuon; `node tests/dieu-phoi/kiem-validate.mjs`.
- [ ] **Bước 7: commit** `dieu-phoi: hooks.json của gói + mục marketplace + README trung lập (AC-1, AC-6 khuôn)`.

### Task 3: Chiều im ở kho không đợt + đối chứng dương từng hook

**Phục vụ:** E2 (AC-2) · **independent:** false

**Files:** Modify `tests/dieu-phoi/dong-goi.test.mjs`

- [ ] **Bước 1:** hàm dựng ba kho thử bằng mã: `trong` (git init + 1 commit), `co-acceptance` (+ `_acceptance/config.yaml` rỗng), `dot-da-dong` (mo + dong bằng CLI của gói → symlink gỡ, thư mục đợt còn). Bảy đầu vào: PreToolUse×3 (Workflow `scriptPath` = `<kho>/x/acceptance-verify.js` chứa `export const meta = { name: 'acceptance-verify' }`, Bash `node feature-loop/scripts/repin-lane.mjs --root . --write`, Bash `ls`), PostToolUse Bash `ls`, Notification `idle_prompt`, Notification `permission_prompt`, UserPromptSubmit `{prompt:'xin chao'}`. Hằng `SO_O = 21`.
- [ ] **Bước 2:** `chieuIm(gocGoi)` chạy từng ô (lệnh rút từ hooks.json, `bash -c`, `cwd` = kho, `CLAUDE_PLUGIN_ROOT` = gói, stdin = JSON có `cwd`) → kiểm mã 0, stdout `""`, stderr `""`, băm sha256 cây tệp (trừ `.git/`) trước == sau; trả mảng lỗi nêu `<kho>/<sự kiện>/<đầu vào>: stdout=«…»`. Assert số ô == `SO_O`.
- [ ] **Bước 3:** bốn ca dương trên kho có đợt mở bằng gói, `hang-viec.json` có dãy `P1` worktree = kho thử: `DP1-02-duong chan-s4` (thoát 2, stderr `^chan-s4: khoá s4`), `DP1-02-duong nhip` (ghi `khoa/s4/chu.json` cho P1 → nội dung `khoa/s4/nhip` đổi), `DP1-02-duong cho-nguoi` (`cho-nguoi/P1.json` có), `DP1-02-duong xoa-cho-nguoi` (UserPromptSubmit sau đó → tệp mất).
- [ ] **Bước 4:** `DP1-02-do in-stdout`: bản sao gói, chèn `process.stdout.write('chan-doan\n');` ngay sau `if (!thuMuc) return 'ngoai-dot';` thành nhánh in → `chieuIm(bản sao)` có lỗi nêu `UserPromptSubmit` và `chan-doan`.
- [ ] **Bước 5 (Review Focus 3):** thêm một ô «cwd ngoài git» (thư mục tạm không git) cho 4 lệnh — tính vào ca riêng `DP1-02 ngoai-git`, không đổi `SO_O`.
- [ ] **Bước 6: verify + commit** `dieu-phoi: ca chiều im 21 ô + đối chứng dương từng hook (AC-2)`.

### Task 4: Bộ phân loại S4 theo cấu trúc lời gọi

**Phục vụ:** E10 (AC-10) · **independent:** false

**Files:** Create `dieu-phoi/scripts/phan-loai-s4.mjs`; Modify `dieu-phoi/scripts/hook-chan-s4.mjs`, `tests/dieu-phoi/dong-goi.test.mjs`

**Interfaces — Produces:** `export function phanLoaiLenh(lenhBash: string, bang = BANG_BASH): string|null` · `export const BANG_BASH = { 'repin-lane': 's4', 's4-args': 's4', 'duong-nen': 'duong-nen' }` (khoá = tên script bỏ `.mjs/.js/.cjs`) · `hook-chan-s4.phanLoai` gọi `phanLoaiLenh` cho Bash (DP6 dùng lại).

- [ ] **Bước 1: ca đỏ.** `DP1-10 phan-loai` ma trận viết sẵn (in số dòng): 3 lệnh im (`node --test tests/scripts/repin-lane-lop-cu.test.mjs`, `node --test tests/scripts/s4-args-tran-thuoc.test.mjs`, `grep -n s4-args feature-loop/skills/feature-loop/SKILL.md`) → thoát 0 stderr `""`; 4 lệnh chặn (`node feature-loop/scripts/repin-lane.mjs --root . --write`, `node /x/scripts/s4-args.mjs --slug a`, `node /x/duong-nen.mjs --root .`, Workflow `scriptPath …/acceptance-verify.js`) → thoát 2, stderr `^chan-s4: khoá`. Chạy hook qua `bash -c` trên kho có đợt, khoá s4 thuộc phiên khác. Thêm bảy dạng của Review Focus 1 (`TZ=UTC node ./repin-lane.mjs a`, `cd sub && node ../repin-lane.mjs c`, `node ./repin-lane.mjs p | cat`, `bash -c 'node ./repin-lane.mjs x'`, `node /g/giu-nhip.mjs -- node ./repin-lane.mjs`, `node ./repin-lane.mjs 'hai tu'`, `node ./repin-lane.mjs --slug=a`) → `phanLoaiLenh` == `'s4'`.
- [ ] **Bước 2: `phan-loai-s4.mjs`.** Tách lệnh thành đoạn ở `&&`, `||`, `;`, `|` (ngoài nháy); mỗi đoạn tách từ kiểu shell (nháy đơn/kép, `\`); bỏ tiền tố `KEY=val`, `exec`, `time`, `nohup`, `env`; từ đầu:
  - `bash`/`sh` có `-c <chuỗi>` → đệ quy trên chuỗi;
  - basename `node` (hoặc kết thúc `/node`): bỏ cờ (`-…`); có `--test` → `null` cho đoạn này; đối số đầu không phải cờ = script; basename script là `giu-nhip.mjs` → đệ quy trên phần sau `--`; ngược lại tra `BANG_BASH[tênBỏĐuôi]`;
  - từ đầu là đường tới script (`./repin-lane.mjs`) → tra như trên.
  Trả tài nguyên đầu tiên khác `null`.
- [ ] **Bước 3:** `hook-chan-s4.phanLoai` nhánh Bash → `phanLoaiLenh(lenhBash)`. `chayHook`: đầu vào JSON hợp lệ và `phanLoai` null → `{ma:0}` ngay (bỏ lối `MAU_THO` cho JSON hợp lệ; giữ `MAU_THO` cho JSON hỏng như cũ).
- [ ] **Bước 4: `DP1-10-do chuoi-con`:** bản sao gói, thay thân `phanLoaiLenh` bằng vòng `includes` của bản crm → ô `node --test …repin-lane-lop-cu.test.mjs` thoát 2; ca đỏ nêu lệnh đó.
- [ ] **Bước 5: verify** cả `tests/dieu-phoi/loi/hook-chan-s4.test.mjs` (12 ca crm, gồm «ma trận bảy dạng») vẫn xanh + DP1-10. Commit `dieu-phoi: phân loại S4 theo cấu trúc lời gọi (AC-10)`.

### Task 5: Gói chạy ở chỗ khác cây kit

**Phục vụ:** E6 (AC-6) · **independent:** false

**Files:** Modify `tests/dieu-phoi/dong-goi.test.mjs`

- [ ] **Bước 1:** `banChep()` chép CHỈ `dieu-phoi/` vào `fs.mkdtempSync(os.tmpdir())`; kiểm và in: không thư mục tổ tiên nào có `node_modules` hay `feature-loop/`.
- [ ] **Bước 2:** `DP1-06 ban-chep`: trên một kho thử, từ bản nguồn rồi bản chép chạy 4 lệnh hook (đầu vào trong đợt), `mo`, `chay`, `xem`, `dong` (CLI `node <gốc>/scripts/dieu-phoi.mjs`, cwd = kho) và một nhịp `taoVong` với io giả → bảng mã thoát hai bản bằng nhau (in bảng); stderr bản chép không `Cannot find module|ERR_MODULE_NOT_FOUND`; `dung` bộ phát lịch sau `chay`.
- [ ] **Bước 3:** `DP1-06 boc-dung-ban`: mỗi bản, khoá s4 cấp cho đúng worktree, Bash `run_in_background:true` `node …/repin-lane.mjs …` → thoát 2, dòng bọc có đường tuyệt đối tới `giu-nhip.mjs` với tiền tố = gốc bản đang chạy, tệp tồn tại.
- [ ] **Bước 4:** `DP1-06-do import-ngoai`: bản sao gói đặt CẠNH một `feature-loop/scripts/resolve-plugin.mjs` giả (nằm trong cây tạm kiểu kit) → `xem` xanh (đối chứng); chép riêng `dieu-phoi/` đã tiêm `import '../../feature-loop/scripts/resolve-plugin.mjs';` ra chỗ khác → thoát ≠ 0, stderr nêu `dieu-phoi.mjs`.
- [ ] **Bước 5: verify + commit** `dieu-phoi: ca bản chép ngoài cây kit (AC-6)`.

### Task 6: Không gì riêng crm

**Phục vụ:** E7 (AC-7) · **independent:** false

**Files:** Modify `tests/dieu-phoi/dong-goi.test.mjs`

- [ ] **Bước 1:** `quetRieng(goc, thuMucs) → [{tep, dong, chuoi}]`: mọi tệp văn bản (bỏ nhị phân theo byte 0) dưới `dieu-phoi/` và `tests/dieu-phoi/fixtures/`, khớp không phân biệt hoa thường với danh sách cấm; trả kèm số tệp đã quét.
- [ ] **Bước 2:** `DP1-07 khong-rieng-kho`: số tệp > 0 (in), 0 khớp. `DP1-07-do`: bản sao gói chèn `nhanh onehub` vào dòng 2 `scripts/lich.mjs` → đúng một khớp `scripts/lich.mjs:2`.
- [ ] **Bước 3: verify + commit** `dieu-phoi: quét chuỗi riêng kho (AC-7)`.

### Task 7: Gói không tự bật qua acceptance-init

**Phục vụ:** E8 (AC-8) · **independent:** false

**Files:** Modify `scripts/plugin-declare.mjs`, `GUIDE.md` (khối GUIDE-PLUGIN-DECLARE), `commands/acceptance-init.md` (khối INIT-PLUGIN-DECLARE nếu cần), `tests/plugins/plugin-declare.test.mjs` (PD6), `tests/dieu-phoi/dong-goi.test.mjs`

**Interfaces — Produces:** `readMarketplace()` trả thêm `optIn: string[]` (tên mục có `tags` chứa `bat-theo-lua-chon`); `names` = mục trừ `optIn`. `export const DAU_LUA_CHON = 'bat-theo-lua-chon'`.

- [ ] **Bước 1: ca đỏ** `DP1-08 khong-tu-bat`: kho thử trống, `node <cây>/scripts/plugin-declare.mjs --root <kho> --write` → `enabledPlugins` == (marketplace − mục mang dấu) ∪ superpowers (so tập, in hai tập); hai khối khai gói không chứa `dieu-phoi`. Chạy → đỏ (hiện bật cả dieu-phoi).
- [ ] **Bước 2:** `readMarketplace` lọc mục có `Array.isArray(p.tags) && p.tags.includes(DAU_LUA_CHON)`. PD6: `expectedNames()` cùng luật lọc (đọc dấu từ marketplace, không ghim tên).
- [ ] **Bước 3:** `DP1-08-do bo-dau`: bản sao marketplace bỏ `tags` của dieu-phoi, chạy plugin-declare với `--marketplace <bản sao>` → kho thử có `dieu-phoi@acceptance-gate-kit`; hàm kiểm trả lỗi nêu `dieu-phoi`.
- [ ] **Bước 4: verify** `PD_CASES=PD1,PD6 node tests/plugins/plugin-declare.test.mjs` + toàn tệp PD; DP1-08. Commit `plugin-declare: gói mang dấu bật-theo-lựa-chọn không tự bật (AC-8)`.

### Task 8: P200 và P33 biết gói thứ tư

**Phục vụ:** E9 (AC-9) · **independent:** false

**Files:** Modify `tests/plugins/run-tests.sh` (khối P200, P33), `GUIDE.md` dòng 5, `_acceptance/config.yaml` (`executors.test.dieu_phoi_plugins`)

- [ ] **Bước 1:** P200: thêm `DP = 'dieu-phoi/.claude-plugin/plugin.json'` vào `kiem` (đọc, semver, bằng số `V`, in `dieu-phoi cung so: V`), câu dẫn xuất thành `Khớp phiên bản: acceptance-gate V · feature-loop V · diagram-design D · dieu-phoi V.`; `banSao` chép thêm DP; đột biến thứ sáu `dieu-phoi lech so` (version `0.0.1` → vế đỏ nêu `dieu-phoi`); `MUT_KY_VONG = 6`; tiêu đề `run` nêu «(6 dot bien…)».
- [ ] **Bước 2:** GUIDE dòng 5 thêm `· dieu-phoi 2.26.0`. Chạy P200 → xanh.
- [ ] **Bước 3:** P33: tách thành `def quet(root) -> (files, offenders)`, `areas` thêm `"dieu-phoi"`; in `P33 VUNG: … dieu-phoi …`; đối chứng dương: bản sao tạm chỉ gồm `dieu-phoi/` → 0 offender, >0 tệp; chiều đỏ: bản sao + `dieu-phoi/scripts/resolve-plugin.mjs` (chép từ feature-loop) → offender nêu `dieu-phoi/scripts/resolve-plugin.mjs`; cây thật → 0 offender.
- [ ] **Bước 4:** executor `dieu_phoi_plugins: "bash -c 'set -o pipefail; ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh 2>&1 | grep -E \"P200|FAIL|^Results:\" && ONLY_BLOCK=\"P33 no source\" bash tests/plugins/run-tests.sh 2>&1 | grep -E \"P33|FAIL|^Results:\"'"` (qua `config-patch.mjs`).
- [ ] **Bước 5: verify** chạy executor → có `PASS: P200 …` và `PASS: P33 …`. Commit `plugins suite: P200 + P33 phủ gói dieu-phoi (AC-9)`.

### Task 9: Hai bản cùng gắn — pid sống và cảnh báo settings

**Phục vụ:** E5 (AC-5) · **independent:** false

**Files:** Modify `dieu-phoi/scripts/dieu-phoi.mjs`, `tests/dieu-phoi/dong-goi.test.mjs`

**Interfaces — Produces:** `export function canhBaoHaiBan(gocKho): string|null` — đọc `<gốc>/.claude/settings.json`, tìm mọi `hooks.*[].hooks[].command` chứa `scripts/dieu-phoi/`; có → `cảnh báo: .claude/settings.json còn hook gọi scripts/dieu-phoi/ (<sự kiện,…>) — gỡ khối đó, gói dieu-phoi đã gắn hook`; không có/tệp vắng/hỏng → `null`.

- [ ] **Bước 1: ca đỏ** `DP1-05 canh-bao-hai-ban`, `DP1-05 im-mot-ban` (tệp vắng · tệp có hook khác), `DP1-05 pid-song` (pid của `sleep 30` do ca sinh ghi vào `phat-lich.pid`; `chay` in `bộ phát lịch đang chạy (pid <đúng pid>)`; `pgrep -f phat-lich.mjs` trước == sau; giết sleep).
- [ ] **Bước 2:** `xem` nối dòng `canhBaoHaiBan(gocKhoChinh(cwd))` khi khác null (kể cả khi `chưa có nhịp nào`).
- [ ] **Bước 3: verify + commit** `dieu-phoi: xem cảnh báo hook cũ trong settings (AC-5)`.

### Task 10: Lõi chép vào thư mục đợt, «lõi vắng» thì ngưng cấp

**Phục vụ:** E11 (AC-11) · **independent:** false

**Files:** Modify `dieu-phoi/scripts/dieu-phoi.mjs`, `dieu-phoi/scripts/phat-lich.mjs`, `tests/dieu-phoi/dong-goi.test.mjs`

**Interfaces — Produces:** `chepLoi(thuMuc) → string` (đường `<đợt>/loi/`) chép mọi `*.mjs` + `mau/` + `loi/PHIEN-BAN.json` `{phien_ban, tu, luc}`; `chayPhatLich` spawn `<đợt>/loi/phat-lich.mjs`. `phat-lich.motNhip`: đầu nhịp kiểm `fs.existsSync(path.join(DAY, 'phat-lich.mjs'))` (DAY = thư mục của chính module đang chạy) — vắng → ghi `{loai:'loi-vang', ly_do:'lõi vắng: <DAY>', can_phan:true}` (một lần mỗi 30′ qua `bao`) và trả về TRƯỚC `xuLyKhoa`/`capPhat` (không thu hồi, không cấp).

- [ ] **Bước 1: ca đỏ** `DP1-11 ban-theo-dot`: gói chép ra tạm, `mo` + ghi cấu hình thử `tick_giay: 1` + một khoá s4 đang giữ (chu.json + nhip mới) + một đơn `xin/` cho `duong-nen`; `chay` từ bản chép; kiểm `<đợt>/loi/PHIEN-BAN.json`; xoá gói tạm; chờ ≥ 2 nhịp (đọc `trang-thai.json.nhip_cuoi` đổi hai lần, trần 15 s) → pid sống, `su-kien.jsonl` không có `cap` cho `s4`, có `cap` cho `duong-nen` (bộ phát lịch vẫn làm việc), không có `loi-vang`.
- [ ] **Bước 2:** `DP1-11 loi-vang`: tiếp đó xoá `<đợt>/loi/` → trong 2 nhịp có dòng `loi-vang` `can_phan:true` chứa `lõi vắng`; thêm một đơn mới → không có `cap` mới.
- [ ] **Bước 3:** `DP1-11-do bo-chep`: bản sao gói mà `chayPhatLich` spawn `DAY/phat-lich.mjs` (bỏ bước chép) → sau khi xoá gói, nhịp ghi `loi-vang` và đơn mới KHÔNG được cấp — ca đỏ nêu «bộ phát lịch ngừng cấp vì lõi vắng — thiếu bản theo đợt». (Xem sổ quyết định của S2: chiều đỏ của AC-11 viết lại theo cơ chế quan sát được.)
- [ ] **Bước 4:** ca dừng mọi tiến trình con trong `after()`. Verify + commit `dieu-phoi: chay chép lõi vào thư mục đợt; lõi vắng thì ngưng cấp (AC-11)`.

### Task 11: Không fetch khi đang giữ khoá s4

**Phục vụ:** E12 (AC-12) · **independent:** false

**Files:** Modify `dieu-phoi/scripts/phat-lich.mjs` (`taoVong`), `tests/dieu-phoi/dong-goi.test.mjs`

- [ ] **Bước 1: ca đỏ** `DP1-12 khong-fetch-khi-giu-s4`: `taoVong(thuMuc, ioGia, dongHo)` với `ioGia.chay` ghi lại mọi lời gọi; có `khoa/s4/chu.json` → 0 lời gọi `git fetch`, `su-kien.jsonl` có `{loai:'bo-fetch'}`; xoá khoá, đồng hồ vượt `NHIP.fetchMs` → đúng một `git fetch -q origin`.
- [ ] **Bước 2:** trong `taoVong`, trước fetch: `fs.existsSync(path.join(thuMuc,'khoa','s4','chu.json'))` → `ghiSuKien(thuMuc,{loai:'bo-fetch', ly_do:'khoá s4 đang giữ'})`, không đặt lại `lanFetch` (fetch ngay khi khoá trống).
- [ ] **Bước 3: verify + commit** `dieu-phoi: bỏ fetch khi khoá s4 đang giữ (AC-12)`.

### Task 12: Đọc-cũ — ẩn danh bản chụp crm và ca chạy tiếp

**Phục vụ:** E4 (AC-4) · **independent:** false

**Files:** Create `tests/dieu-phoi/an-danh.mjs`, `tests/dieu-phoi/fixtures/dot-crm-0910/**`; Modify `tests/dieu-phoi/dong-goi.test.mjs`

**Interfaces — Produces:** `anDanh(nguon, dich) → {tep, khoa}`; CLI `node tests/dieu-phoi/an-danh.mjs <nguồn> <đích>`.

- [ ] **Bước 1: ca đỏ** `DP1-04 an-danh` trên bản «gốc giả lập» do ca dựng từ `dieu-phoi/scripts/mau/` + chuỗi cấm cài vào mọi loại giá trị (đường tuyệt đối, slug, nhánh `onehub`, ghi chú tự do) → tập đường khoá JSON (mọi cấp, mảng tính `[]`) trước == sau từng tệp; `quetRieng` trên đầu ra = 0 khớp.
- [ ] **Bước 2: `an-danh.mjs`.** Chỉ chép mặt JSON bộ đọc đọc: `dieu-phoi.config.json`, `hang-viec.json`, `trang-thai.json`, `ranh-gioi-them.json`, `khoa/*/chu.json` + `khoa/*/nhip`, `xin/*.json`, `yeu-cau/*.json`, `tra-loi/*.json`, `cho-nguoi/*.json`, `tiep/*.json`. Bỏ văn xuôi và nhật ký (`LUAT.md`, `tai-lieu/`, `*.md`, `*.log`, `bang.html`, `su-kien.jsonl`, `phat-lich.pid`). Luật giá trị (khoá giữ nguyên):
  - giữ: số, bool, null, chuỗi ISO thời gian, giá trị của khoá `loai, ket_qua, tai_nguyen, phien, id, day, trang_thai, boi, s4, ma, dot`;
  - `goc_kho` và mọi tiền tố bằng nó trong chuỗi → `@KHO@`; tên thư mục worktree → `wt-<n>`;
  - `nhanh_chinh` → `main`; `link` → `claude://x/<n>`;
  - giá trị của `slug`, `hang`, `sau`… và mọi chuỗi còn lại → token tất định `t<n>` qua MỘT bảng ánh xạ chung (cùng chuỗi → cùng token ở mọi tệp, giữ quan hệ slug ↔ chu.json ↔ xin ↔ tiep); chuỗi dạng glob giữ đuôi `/**`/`*`. Tên tệp `xin/P1-s4.json`, `yeu-cau/P3-2.json` giữ nguyên (chỉ mã phiên).
- [ ] **Bước 3:** chạy trên bản chụp ở scratchpad → `tests/dieu-phoi/fixtures/dot-crm-0910/`; tự soát `quetRieng` = 0 trước khi `git add`.
- [ ] **Bước 4:** `DP1-04 doc-cu`: chép fixture vào kho thử, thay `@KHO@` = gốc kho thử trong mọi tệp, tạo các thư mục worktree được nhắc, dựng symlink `dieu-phoi-hien-tai`; đặt mtime `khoa/*/nhip` = nội dung ISO của nó; đọc từ CHÍNH bản chụp: số khoá còn hạn ở giờ chụp (`chup-luc` = `trang-thai.json.nhip_cuoi`) ≥ 1, số đơn `xin/` ≥ 1 (assert + in). `xem` in đúng `đợt <dot>`, `<tài nguyên>:<phiên>` của mọi khoá, số đơn chờ — so với giá trị đọc từ bản chụp. Một nhịp `taoVong` với io giả (đồng hồ = chụp + 1′; `sysctl`/`ps` trả chuỗi mẫu hợp lệ lấy từ `loi/phat-lich.test.mjs`; `gh`/`git` trả `''`/`'[]'`) → 0 dòng `loi-nhip`, 0 `don-hong` (Review Focus 4), mọi khoá còn hạn vẫn có `chu.json`.
- [ ] **Bước 5:** `DP1-04-do thieu-han-thue`: bản chép thứ hai xoá `han_thue_phut.merge` → nhịp ghi `loi-nhip` `can_phan:true` chứa `han_thue_phut`.
- [ ] **Bước 6: verify + commit** `dieu-phoi: fixture đọc-cũ ẩn danh từ đợt crm 10/10 + ca chạy tiếp (AC-4)`.

### Task 13: Danh mục chuyển cho crm (`xem --kiem-chuyen`) — Notes của hợp đồng

**Phục vụ:** Notes (§16 T13), không có eval riêng · **independent:** false

**Files:** Modify `dieu-phoi/scripts/dieu-phoi.mjs`, `dieu-phoi/README.md`, `tests/dieu-phoi/dong-goi.test.mjs`

- [ ] **Bước 1: ca đỏ** `DP1-13 kiem-chuyen`: kho thử có `scripts/dieu-phoi/` được trỏ từ `.claude/settings.json`, `.git/hooks/pre-push`, `package.json`, `_acceptance/x/evals.yaml`, `LUAT.md` của đợt → `xem --kiem-chuyen` in mỗi chỗ một dòng `<tệp>:<dòng>` và thoát 1; kho sạch → in `kiem-chuyen: sach` thoát 0 (đối chứng); đường quét suy từ gốc kho (`gocKhoChinh`), không cần đợt.
- [ ] **Bước 2:** cài: quét `git ls-files` + `.git/hooks/*` + `~/Library/LaunchAgents/*.plist` (khi có) + thư mục đợt hiện tại, khớp chuỗi `scripts/dieu-phoi/`.
- [ ] **Bước 3: verify + commit** `dieu-phoi: xem --kiem-chuyen liệt kê chỗ còn trỏ bản crm (Notes T13)`.

### Task 14: Lưới cả kho trước S4

**Phục vụ:** mọi eval (nền) · **independent:** false

- [ ] `node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs"` → 0 fail.
- [ ] `bash tests/scripts/run-tests.sh` (nền) · `bash tests/plugins/run-tests.sh` (nền) · `bash tests/hooks/run-tests.sh` · `bash tests/workflows/run-tests.sh` — ca corpus đỏ vì hồ sơ/thư mục mới thì sửa theo khuôn của ca (bộ nhớ «Hồ sơ mới làm ca corpus đỏ»).
- [ ] `node scripts/product-map.mjs --root . --check`; lệch → dựng lại bản đồ, commit.
- [ ] Đặt contract `status: implemented`, commit, vào S4.
