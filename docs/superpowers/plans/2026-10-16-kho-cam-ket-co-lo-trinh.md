# Kho cam kết có lộ trình — chặn mở vòng ngoài kế hoạch (RM5) Implementation Plan

> **For agentic workers:** feature-loop S3 chạy kế hoạch TUẦN TỰ trong vòng chính (mọi việc `independent: false`). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Kho bật chặn (gói `road-map` ở `.claude/settings.json` + `lo_trinh.chan: true`) thì hồ sơ mới không thuộc hàng lộ trình nào bị từ chối lúc mở và lúc gộp; mở từ mô tả thì máy tự thêm hàng; kho không bật không đổi byte nào.

**Architecture:** MỘT bộ đọc CJS `lib/chan-lo-trinh.cjs` (bật? · nối? · mới?) cho ba bên gọi: hook `acceptance-evidence-gate.js` (lúc mở), `pre-merge-check.sh` (lúc gộp, trong khối T1-escape — dùng chung phạm vi diff), `lo-trinh.mjs --them-hang` (nấc 3). Bộ đọc nối viết lại phép nối của `suyTrangThai`; bộ kiểm đối chiếu hai bên trên cùng kho thử.

**Tech Stack:** Node ≥ 20 (CJS cho hook/lib, ESM cho scripts), bash cho lưới trước-merge, `node:test`-free ca tự viết theo nếp `tests/scripts/kho-moi-cai-goi-road-map.test.mjs` (`PASS: CK-…` / `FAIL: CK-… — …`).

**Duyệt Gate 1.5:** Manh Phan, 16/10 («duyệt kế hoạch»).

**Spec:** `docs/superpowers/specs/2026-10-16-kho-cam-ket-co-lo-trinh-design.md` · hợp đồng `_acceptance/kho-cam-ket-co-lo-trinh/contract.md` · thước `evals.yaml`.

## Global Constraints

- Bật = `enabledPlugins["road-map@<marketplace>"] === true` ở `.claude/settings.json` (khoá rút từ `.claude-plugin/marketplace.json` của cây; `settings.local.json` và phạm vi người dùng KHÔNG tính) VÀ `lo_trinh.chan: true` trong `_acceptance/config.yaml`.
- Khoá vắng / `false` → tắt. Giá trị khác ở kho đã bật gói → từ chối với ĐÚNG câu «lo_trinh.chan phải là true hoặc false».
- Kho không bật: hook, lưới, `--them-hang` cho ra từng byte như bộ máy gốc (`goc-so` = `e584885b`).
- Câu giao của nấc 3 chỉ đi qua stdin, không bao giờ qua đối số shell.
- Mọi phép đo mới có cặp hai chiều trên CÙNG fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE); đường dẫn suy từ vị trí tệp ca.
- Không đụng mã RM4 (`scripts/lo-trinh-khoi-tao.mjs`): ca đỏ của RM4 tiêm vào chính các dòng `docBat`/`khoaBat` của nó.

## Review Focus

1. Hook nhận `Edit` vào `opportunity.md` CHƯA có trên đĩa (Edit hỏng) — phải coi như ghi mới? Không: Edit trên tệp vắng thì công cụ tự lỗi; luật chỉ xét `Write` khi tệp vắng. Ghim ở T2 (ca Edit-tệp-vắng thoát 0, không dòng chặn).
2. Đường dẫn tương đối trong `tool_input.file_path` (harness thường gửi tuyệt đối, nhưng không bảo đảm) — gốc kho suy từ `findAcceptanceConfig(path.dirname(path.resolve(fp)))`. Ghim ở T2.
3. `_acceptance/` nằm sâu (monorepo `pkg/_acceptance/`) — gốc kho = thư mục cha của `_acceptance` gần nhất, `.claude/settings.json` đọc ở gốc ấy. Ghim ở T1 (ca gốc lồng).
4. Tệp lộ trình không đọc được (JSON hỏng) ở kho bật — hook không được fail-open im: chặn với câu nêu tệp. Ghim ở T2.
5. Hai phiên cùng `--them-hang` một lúc — ghi nguyên tử (`ghiLoTrinh` dùng tệp tạm + rename) nhưng đọc-sửa-ghi có thể mất một hàng; khai giới hạn, không dựng khoá. Ghi vào Notes của hợp đồng ở T5.

---

### Task 0: Nền nhánh trước khi sửa (điều phối 16/10) · independent: false

Thứ tự gộp kit do điều phối chốt: RM6 (#363) → RM3 → RM5. RM6 sửa `scripts/lo-trinh.mjs`, `INIT-CI-COPY-LIST` và ca KM-8;
RM3 sửa khối TRONG-DOT ở S0 của SKILL feature-loop. Trước khi chạm ba tệp đó:
- [ ] Đã có sha gộp từ điều phối → `git merge origin/main` (sau #363 và PR RM3). Chưa có → `git fetch origin` rồi gộp đỉnh
  `origin/claude/gracious-greider-59b434` (RM6) và `origin/claude/charming-merkle-19270a` (RM3) vào nhánh này.
- [ ] Chạy lại `node tests/scripts/kho-moi-cai-goi-road-map.test.mjs` và `node tests/scripts/lo-trinh.test.mjs` trên nền mới — xanh mới sang Task 1.
- Task 1–3 (lib, hook, lưới trước-merge) không chạm vùng của RM6/RM3 — được làm trước khi gộp nếu sha chưa về.

### Task 1: Bộ đọc `lib/chan-lo-trinh.cjs` (phục vụ E2, E4 — nền cho mọi việc sau) · independent: false

**Files:**
- Create: `lib/chan-lo-trinh.cjs`
- Create: `tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs` (khung ca + CK-2, phần lib của CK-4)
- Modify: `_acceptance/config.yaml` (khoá `executors.test.kho_cam_ket_co_lo_trinh: node tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs`)

**Interfaces (Produces):**
```js
// lib/chan-lo-trinh.cjs
const CAU_KHOA_SAI = 'lo_trinh.chan phải là true hoặc false';
function gocKho(tuThuMuc)            // → thư mục chứa `_acceptance/` gần nhất đi lên, hoặc null
function khoaBat(marketplacePath)    // → 'road-map@<marketplace>' | null  (CJS, cùng luật RM4)
function docBat(root, khoa)          // → { bat: bool }  (chỉ .claude/settings.json; ném {ma:3} khi JSON hỏng)
function trangThaiChan(root, { marketplacePath })
  // → { bat: false } | { bat: true } | { loi: CAU_KHOA_SAI }   (gói không bật → khoá KHÔNG đọc)
function noi(root, slug, { opportunityDangGhi = null } = {})
  // → { noi: true } | { noi: false, ly_do: 'khong-hang' | 'ma-sai', ma?: string, tep?: string }
function laHoSoMoi(root, slug)       // → !exists(contract.md) && !exists(opportunity.md)
function hoSoMoiTrongDiff(root, baseSha) // → [slug] có contract.md|opportunity.md ở HEAD mà base không có
module.exports = { CAU_KHOA_SAI, gocKho, khoaBat, docBat, trangThaiChan, noi, laHoSoMoi, hoSoMoiTrongDiff };
// CLI: node lib/chan-lo-trinh.cjs --root <kho> --base <ref>
//   kho không bật → stdout rỗng, thoát 0 · bật → mỗi hồ sơ mới không nối một dòng VIOLATION, thoát 1 · khoá sai → một dòng, thoát 1
```

- [ ] **Step 1: Viết ca CK-2 (thất bại)** — kho thử sinh trong lượt (`mkdtempSync`, `git init`, `config.yaml` khai `lo_trinh.tep: docs/plan/lo-trinh.json` + `chan: true`, settings bật khoá rút từ `.claude-plugin/marketplace.json` của cây, tệp lộ trình ghi bằng `ghiLoTrinh` của `scripts/lo-trinh.mjs`). Ma trận sáu ca viết trước (hàng `slug: x` · ô cơ hội có sẵn `lo_trinh_ma` thật · ô cơ hội ĐANG ghi mang mã thật · mã không có · `lo_trinh_tep` không khai · hàng mang slug hồ sơ khác). Mỗi ca: ghi tệp chờ vào bản sao kho thử, `phanTichKho` trên bản sao, đối chứng `x` có mặt (đếm = 6), so `noi()` với phán của bản đồ (không thuộc `ngoaiLoTrinh`, không mang cờ «ghi lo_trinh_ma … không có hàng»).

```js
const banDoNoi = (root, slug) => {
  const k = LT.phanTichKho({ root, classify: PM.classify, sections: PM.SECTIONS });
  const t = k.cacTep[0].kq;
  const coMaSai = t.co.concat(k.cacTep.flatMap(x => x.kq?.co || [])).some(c => c.includes(`hồ sơ ${slug} ghi lo_trinh_ma`));
  return !t.ngoaiLoTrinh.includes(slug) && !coMaSai;
};
```

- [ ] **Step 2: Chạy** `node tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs` → FAIL «Cannot find module lib/chan-lo-trinh.cjs».
- [ ] **Step 3: Viết `lib/chan-lo-trinh.cjs`.** `noi()`: đọc `lo_trinh.tep` bằng `scripts/lo-trinh-khoa.cjs` (`cacTepTuConfig`), JSON từng tệp; nối nếu một hàng có `slug === slug`; hoặc frontmatter `lo_trinh_ma` (từ `opportunityDangGhi` nếu có, không thì `opportunity.md` trên đĩa, đọc bằng `frontmatterField` của `lib/evidence-core.cjs`) trỏ một hàng có `ma` đó trong `lo_trinh_tep` (nếu ghi và được khai) hoặc mọi tệp khai. `lo_trinh_tep` ghi mà không khai → `{noi:false, ly_do:'ma-sai', tep}`. `docBat`/`khoaBat` chép luật RM4 (chỉ `settings.json`, khoá rút từ `marketplace.json`). Khoá `chan`: cắt khối `lo_trinh:` ở cột 0 như `lo-trinh-khoa.cjs`, đọc `chan:` trong khối; vắng/`false` → tắt; `true` → bật; khác → `{loi}`.
- [ ] **Step 4: Ca CK-4-lib** — ma trận 4 gói × 4 khoá (viết trước, đếm = 16) gọi `trangThaiChan`; đối chiếu `docBat`/`khoaBat` của lib với của `scripts/lo-trinh-khoi-tao.mjs` (import ESM) trên bốn trạng thái gói — hai bộ đọc BẰNG nhau. Ca gốc lồng: `pkg/_acceptance/` → `gocKho` trả `pkg/`.
- [ ] **Step 5: Chiều đỏ CK-2-do** — bản sao lib bỏ nhánh `lo_trinh_ma` (nhát tiêm khớp đúng một lần) → ca ô-cơ-hội-sẵn-có FAIL ghim «bộ đọc chặn lệch bản đồ lộ trình»; bản lành xanh trước trên cùng kho thử.
- [ ] **Step 6: Chạy lại** → `PASS: CK-2`, `PASS: CK-2-do`.
- [ ] **Step 7: Commit** `feat(chan-lo-trinh): bộ đọc bật/nối/mới dùng chung (CK-2, CK-4 lib)`.

### Task 2: Luật chặn trong hook (phục vụ E1, E3, E4) · independent: false

**Files:**
- Modify: `hooks/acceptance-evidence-gate.js` (thêm `OPPORTUNITY_RE`; luật chặn chạy TRƯỚC nhánh `isContract`)
- Test: `tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs` (CK-1, CK-3, CK-4, CK-4-chinh-sach, ba ca đỏ)

**Interfaces:** Consumes `trangThaiChan`, `noi`, `laHoSoMoi`, `gocKho`, `CAU_KHOA_SAI` (Task 1). Lib nạp LƯỜI trong nhánh mới; nạp lỗi → stderr «chặn lộ trình: INACTIVE …», đi tiếp (fail-open có tiếng, nếp sẵn của hook).

- [ ] **Step 1: Viết ca** — `chayHook(root, input)` spawn `node hooks/acceptance-evidence-gate.js` với stdin JSON `{tool_name, tool_input:{file_path, content|old_string,new_string}}`, HOME = thư mục thử có `~/.claude/settings.json` bật gói. CK-1 (hai lệnh Write mở hồ sơ → thoát 2, stderr chứa `x`, `lo_trinh.chan`, `/feature-loop:feature-loop`, `--them-hang --slug x`; thư mục `x` vắng). CK-3 (Write/Edit vào tệp của hồ sơ cũ `cu` ở hai trạng thái + Write `design-pass.md` của hồ sơ mới → 0, không dòng chặn; đối chứng dương: Write `contract.md` của `x` → 2). CK-4 (4 × 4 × 4 = 64 lần, đếm ghim; 14 ô × 4 lệnh so từng byte stdout/stderr/mã với hook của bộ máy gốc `git archive $(cat goc-so) hooks lib scripts .claude-plugin`). CK-4-chinh-sach (`enforcement: off` · `ACCEPTANCE_GATE_BYPASS=1` · `enforcement: warn`). Review Focus 1, 2, 4.
- [ ] **Step 2: Chạy** → FAIL (hook chưa có luật).
- [ ] **Step 3: Viết luật.** Sau khi tính `isReport/isContract`, thêm:

```js
const OPPORTUNITY_RE = /(^|[\\/])_acceptance[\\/][^\\/]+[\\/]opportunity\.md$/i;
const isOpp = OPPORTUNITY_RE.test(filePath);
if ((isContract || isOpp) && toolName === 'Write') {
  const chan = luatChanLoTrinh(path.resolve(filePath), (ti.content || '').toString(), isOpp);
  if (chan) { /* cfg = readEnforcement; off → đi tiếp; warn → stderr 'WARNING from…' rồi đi tiếp; strict → stderr + exit 2 */ }
}
if (!isReport && !isContract) { process.stdout.write(data); process.exit(0); }   // giữ nguyên dòng cũ
```
`luatChanLoTrinh(fp, content, isOpp)`: `root = gocKho(dirname(dirname(fp)))`; `slug = basename(dirname(fp))`; `trangThaiChan` → `{bat:false}` trả null; `{loi}` → trả dòng có `CAU_KHOA_SAI`; `laHoSoMoi` sai → null; `noi(root, slug, { opportunityDangGhi: isOpp ? content : null })` → nối thì null, không thì ba dòng thông điệp của design §3 (mã sai: thêm «mã <ma> không có trong kế hoạch»).
- [ ] **Step 4: Ba ca đỏ** — CK-1-do (bản sao hook bỏ lời gọi luật → «hồ sơ ngoài lộ trình lọt hook»), CK-3-do (bản sao bỏ `laHoSoMoi` → «hồ sơ cũ bị chặn»), CK-4-do (bản sao lib đọc thêm `settings.local.json` → «phạm vi local không được bật chặn»), CK-4-do2 (bản sao áp luật `opportunity.md` khi gói không bật → «kho không bật đổi hành vi ở opportunity.md»).
- [ ] **Step 5: Chạy lại + bộ hook sẵn có** — `node tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs` và `bash tests/scripts/run-tests.sh` phần hook (lọc `P3` / ca contract-guard) xanh.
- [ ] **Step 6: Commit** `feat(hook): chặn mở hồ sơ ngoài lộ trình ở kho bật (CK-1, CK-3, CK-4)`.

### Task 3: Lưới trước-merge (phục vụ E5) · independent: false

**Files:**
- Modify: `scripts/pre-merge-check.sh` (trong khối T1-escape, chạy khi `DIFF_READY=1`; KHÔNG thêm tên vào `LEDGER_EXPECTED` — kho không bật giữ từng byte)
- Modify: `lib/chan-lo-trinh.cjs` (CLI `--root --base`)
- Test: CK-5, CK-5-tat, CK-5-thieu-lib, CK-5-do

- [ ] **Step 1: Viết ca** — kho thử git: `main` có hồ sơ `cu` (contract, không nối); nhánh việc thêm `moi` (không nối) + `noi` (hàng mang slug) + sửa `cu`; lớp CI chép theo `INIT-CI-COPY-LIST` rút trong lượt; chạy `bash scripts/pre-merge-check.sh <kho> --base main`. Ghim: mã ≠ 0; đúng 1 dòng `VIOLATION [moi]: hồ sơ mới không thuộc hàng lộ trình nào (lo_trinh.chan)`; không dòng `lo_trinh.chan` nào nêu `noi`/`cu`. CK-5-tat: kho không bật → stdout BẰNG từng byte stdout của bộ máy gốc, cùng mã. CK-5-thieu-lib: xoá `lib/chan-lo-trinh.cjs` của bản chép → đúng một dòng `NOTE` chứa «luật chặn lộ trình NOT ENFORCED». Kho bật mà không có `--base` → một dòng `NOTE` «luật chặn lộ trình NOT ENFORCED — không có phạm vi diff».
- [ ] **Step 2: Chạy** → FAIL.
- [ ] **Step 3: Viết khối bash** ngay trước khối T1-escape:

```bash
# Chặn lộ trình (hồ sơ kho-cam-ket-co-lo-trinh): chỉ kho bật mới in gì. Lib vắng → NOTE nếu kho bật gói.
CLT_LIB="$HERE/../lib/chan-lo-trinh.cjs"
if command -v node >/dev/null 2>&1 && [ -f "$CLT_LIB" ]; then
  if [ "$DIFF_READY" -eq 1 ]; then
    _clt="$(node "$CLT_LIB" --root "$ROOT" --base "$BASE_SHA" 2>&1)"; _clt_rc=$?
  else
    _clt="$(node "$CLT_LIB" --root "$ROOT" --khong-base 2>&1)"; _clt_rc=$?
  fi
  [ -n "$_clt" ] && printf '%s\n' "$_clt"
  [ "$_clt_rc" -eq 1 ] && violations=$((violations + $(printf '%s\n' "$_clt" | grep -c '^VIOLATION')))
elif [ -f "$ROOT/.claude/settings.json" ] && grep -q '"road-map@' "$ROOT/.claude/settings.json" 2>/dev/null; then
  echo "NOTE: luật chặn lộ trình NOT ENFORCED — thiếu node hoặc lib/chan-lo-trinh.cjs (chép lại lớp CI theo đợt phát hành)"
fi
```
CLI `--khong-base`: kho bật → in NOTE «… không có phạm vi diff», thoát 0; không bật → rỗng.
- [ ] **Step 4: Chiều đỏ CK-5-do** — bản sao lưới bỏ dòng `node "$CLT_LIB"` có `--base` → «hồ sơ ngoài lộ trình lọt lưới trước-merge».
- [ ] **Step 5: Chạy lại + bộ RL/P48/ARM** (`bash tests/scripts/run-tests.sh` lọc `RL`, `ARM`, `UJ12`) — các dòng `expected=4` giữ nguyên.
- [ ] **Step 6: Commit** `feat(pre-merge): lưới chặn hồ sơ mới ngoài lộ trình ở kho bật (CK-5)`.

### Task 4: Nấc 3 — `lo-trinh.mjs --them-hang` + khối SKILL (phục vụ E7, E8) · independent: false

**Files:**
- Modify: `scripts/lo-trinh.mjs` (cờ `--them-hang`; lib nạp lười)
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (S0 bước 3, sau khối `S0-NHAN-HANG`: khối `S0-THEM-HANG` + `S0-THEM-HANG-THOAT`)
- Test: CK-7, CK-7-do, CK-8, CK-8-ky-tu, CK-8-do

**Interfaces:** Consumes `trangThaiChan` (Task 1), `ghiLoTrinh`, `dangChuan`, `kiemKhuon`, `SLUG_RE` (đã có trong `lo-trinh.mjs`).

- [ ] **Step 1: Viết ca** theo `evals.yaml` E7/E8: lệnh rút NGUYÊN VĂN từ khối `S0-THEM-HANG` (thay `AG`, `<slug>`, `<mô tả>`), chạy qua `bash -c` để heredoc là thật; `ACCEPTANCE_TODAY=2026-10-20`. CK-7 thêm bước `S0-MO-O` với mã = slug → `moi:false`, `opportunity.md` vắng. Sáu ca từ chối CK-8 (đếm = 6) + ca ký tự đặc biệt (tệp `CANH`, `CANH2` vắng ở kho thử lẫn thư mục chạy).
- [ ] **Step 2: Chạy** → FAIL «tham số lạ --them-hang».
- [ ] **Step 3: Viết nhánh CLI.** Đọc stdin (`readFileSync(0,'utf8')`), `trim`. Thứ tự: thiếu `--slug`/slug sai mẫu → 2 · `trangThaiChan` `{bat:false}` → thoát 1 «kho không bật chặn lộ trình — không thêm hàng» · `{loi}` → 2 với `CAU_KHOA_SAI` · stdin rỗng → 2 · tệp đầu của `lo_trinh.tep` đọc lỗi → 2 · `!dangChuan(text)` → 2 «tệp lộ trình không ở dạng chuẩn — không ghi» · đã có hàng `ma === slug` hoặc `slug === slug` → 2 · hồ sơ đã có `contract.md`/`opportunity.md` → 2. Rồi `data.hang.push({ ma: slug, cau_giao, slug, vi_sao: \`Máy thêm khi mở vòng từ mô tả, ${today}\` })`, `ghiLoTrinh(p, data)`, `mkdirSync(_acceptance/<slug>)` (đóng cửa sổ resume: `S0-MO-O` thấy thư mục → `moi:false`), in `{"hang":"<slug>","tep":"<tệp>"}`, thoát 0.
- [ ] **Step 4: Khối SKILL** — sau `<!-- S0-NHAN-HANG>>> -->`:

````markdown
   **Kho bật chặn lộ trình, đối số là mô tả** (không khớp `S0-MA-HANG-RE`, hoặc `S0-MO-O` thoát 1): sau khi chọn slug ở bước 3,
   chạy khối `S0-THEM-HANG` — câu mô tả đi trong heredoc CÓ NHÁY, không bao giờ vào đối số shell — rồi làm theo bảng mã thoát.
<!-- <<<S0-THEM-HANG -->
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/lo-trinh.mjs --require lib/chan-lo-trinh.cjs) && node "$AG/scripts/lo-trinh.mjs" --root . --them-hang --slug '<slug>' <<'CAU_GIAO_HET'
<mô tả>
CAU_GIAO_HET
```
<!-- S0-THEM-HANG>>> -->
<!-- <<<S0-THEM-HANG-THOAT -->
```
0 → đã thêm hàng mã <slug> vào lộ trình → đi tiếp S1 như cũ; commit hàng cùng hồ sơ
1 → kho không bật chặn → đi tiếp như cũ, không nói gì thêm
2 → dừng: in nguyên thông điệp (tệp lệch khuôn, đã có hàng, câu rỗng, khoá sai giá trị)
```
<!-- S0-THEM-HANG-THOAT>>> -->
````
- [ ] **Step 5: Chiều đỏ** — CK-7-do (bản sao bỏ `slug` khỏi hàng thêm → hook bước sau «hàng máy thêm không nối hồ sơ»), CK-8-do (bản sao bỏ kiểm `dangChuan` → «ghi đè tệp lộ trình không chuẩn»).
- [ ] **Step 6: Chạy lại + `node tests/scripts/lo-trinh.test.mjs` + `node tests/scripts/kho-moi-cai-goi-road-map.test.mjs`** — xanh.
- [ ] **Step 7: Commit** `feat(lo-trinh): nấc 3 — máy thêm hàng khi mở vòng từ mô tả ở kho bật chặn (CK-7, CK-8)`.

### Task 5: Lời khai, danh sách chép CI, phép đo trên các kho thật (phục vụ E6, E9) · independent: false

**Files:**
- Modify: `commands/acceptance-init.md` (`INIT-CI-COPY-LIST`: dòng `lib/chan-lo-trinh.cjs` → `lib/` `[only-if-declared: lo_trinh]`)
- Modify: `road-map/README.md` (mục «Chặn mở việc ngoài kế hoạch»), `GUIDE.md` (đoạn sau dòng 633)
- Create: `tests/scripts/kho-cam-ket-co-lo-trinh-cac-kho.mjs` (CK-6, không đuôi `.test.mjs`)
- Modify: `_acceptance/config.yaml` (`executors.test.kho_cam_ket_co_lo_trinh_cac_kho`)
- Modify: `_acceptance/kho-cam-ket-co-lo-trinh/contract.md` Notes (giới hạn hai phiên thêm hàng cùng lúc — Review Focus 5) — hợp đồng đã duyệt: sửa Notes là ghi chú, không đổi tiêu chí
- Test: CK-9, CK-9-do

- [ ] **Step 1: Viết CK-9** theo E9 (bảng mã {0,1,2} round-trip với ca CK-6/7/8 trong lượt — CK-6 dùng kho thử không bật; dòng chép CI; README + GUIDE chứa `lo_trinh.chan`, `--scope project`, «false» hoặc «xoá», «lưới trước-merge»; khối cấu hình mẫu không chứa `chan:`) + CK-9-do (bản sao bảng thêm mã 3 → «mã 3 không ca nào cho ra»).
- [ ] **Step 2: Chạy** → FAIL.
- [ ] **Step 3: Viết lời khai** (README/GUIDE: cách bật hai điều kiện, cách tắt, hai răng, giới hạn Bash/BYPASS → lưới gộp bắt, push thẳng nhánh chính với `--no-t1-escape` cũng tắt lưới chặn) + dòng chép CI.
- [ ] **Step 4: Viết CK-6** theo E6 (dò `KHO_GOC`, `git archive HEAD` + `.claude/`, bốn lệnh ghi của CK-4 qua hook so với bộ máy gốc, lib `--base HEAD` rỗng, `--them-hang` thoát 1 + băm cây; in «đã đo N kho (bật: K)»).
- [ ] **Step 5: Chạy** CK-9 + `node tests/scripts/kho-cam-ket-co-lo-trinh-cac-kho.mjs` (qua khoá máy) → xanh; `node scripts/product-map.mjs --root . --check` xanh.
- [ ] **Step 6: Commit** `docs+test(chan-lo-trinh): lời khai, chép CI, đo không-đổi trên các kho thật (CK-6, CK-9)`.

## Sau Task 5

Hợp đồng `status: implemented` → S4 (`s4-args.mjs --ag-root .`, qua khoá máy, một vé mỗi lượt chấm).
