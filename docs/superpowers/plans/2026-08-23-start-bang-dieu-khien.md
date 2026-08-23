# «/start» là bảng điều khiển của owner — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thẻ mở phiên nói thẳng owner cần quyết gì và máy vừa làm xong gì — hiện hết ý đang cân nhắc, nêu tên việc vừa xong và thứ còn veto được (đếm khớp lưới), bốn bộ đọc nói cùng một chữ, và thẻ tự nói khi cây sau bản chung.

**Architecture:** Một bảng chữ duy nhất (`scripts/trang-thai-ho-so.cjs`, 20 khoá trạng thái) là nguồn của mọi chữ mặt người về một hồ sơ. Máy quét (`start-scan.mjs`) là bộ PHÂN Ô duy nhất: nó gắn khoá trạng thái cho mọi phần tử và emit kèm `label`/`viecKe`. Ba bộ đọc còn lại KHÔNG tự phán: thẻ cổng và bảng trạng thái **chạy máy quét rồi tra slug**; bản đồ dùng phép chiếu nhiều-về-một `BUCKET_OF` nên giữ nguyên thang giai đoạn, không mang vị từ.

**Tech Stack:** Node ≥18 (ESM cho `scripts/*.mjs`, CJS cho `scripts/*.cjs` + `scripts/gate-card.js`), bash cho suite và răng hồ sơ, không dependency ngoài.

**Spec:** `docs/superpowers/specs/2026-08-23-start-bang-dieu-khien-design.md`
**Contract:** `_acceptance/start-bang-dieu-khien/contract.md` (12 AC, ký Cổng Phạm vi 2026-08-23)
**Evals:** `_acceptance/start-bang-dieu-khien/evals.yaml` (14 eval)

## Global Constraints

- **Hạng T2. TUYỆT ĐỐI KHÔNG chạm `lib/**` hay `scripts/pre-merge-check.sh`** — cả hai là `risk_tiers.t3_paths`; chạm một dòng là ô tự nâng lên T3. Đây là quyết định load-bearing d-20260823T012029Z-27499.
- **KHÔNG sửa `_acceptance/vao-co-o-ra-co-ten/contract.md`** hay bất kỳ hợp đồng đã ký nào. `git diff --name-only origin/main` cuối vòng không được chứa hợp đồng của hồ sơ khác (ADR 0010 — kéo hồ sơ đã ký vào diff chạm engine là tự làm bằng chứng của nó stale).
- **Ổ cắm `discovery.brainstorm_skill` giữ nguyên vai** — không hardcode tên skill nào, đường fallback kit-own phải sống, không cờ đỏ khi khoá vắng.
- **Sáu lệnh cổng người giữ `disable-model-invocation: true`** (`approve`, `signoff`, `acceptance-init`, `acceptance-status`, `acceptance-report`, `start`) — P32 canh; đừng "sửa" sự bất đối xứng với `acceptance-card`.
- **MEASURE-BIRTH-CLAUSE:** mỗi phép đo MỚI chỉ tính XONG khi có cặp hai-chiều trên CÙNG fixture — vật lành → xanh (đối chứng dương chạy TRƯỚC), phá vật thật trong bản sao → đỏ với **thông điệp ghim**. Verify per-task phải chứa lượt phá-thử.
- **Fixture do code sinh trong chính lần chạy**; mọi đường dẫn **suy từ vị trí script** (`path.resolve(__dirname, '..', '..')`), không hardcode ROOT.
- **`FILES.length !== 16` trong `tests/plugins/lenh-bam-duoc.test.mjs` GIỮ NGUYÊN 16** — ba thân cổng đã nằm trong vũ trụ quét từ chip D.
- Chữ mặt người theo `skills/acceptance/references/human-facing-language.md` (N1–N6); tên lệnh in ra dùng cột «Lệnh bấm được» của bảng `COMMAND-NAMES`.
- Commit sau mỗi task, `git add` **đích danh** từng file (repo tự-host: `git add -A` nuốt cả artifact của phiên khác).

## File Structure

| File | Trách nhiệm | Task |
|---|---|---|
| `scripts/trang-thai-ho-so.cjs` *(mới)* | 20 khoá trạng thái → `{nhan, viecKe}` + `BUCKET_OF` (khoá → ô bản đồ) + `STATE_KEYS`. Thuần dữ liệu + tra bảng, KHÔNG đọc file, KHÔNG phán trạng thái. | T1 |
| `scripts/start-scan.mjs` | Bộ PHÂN Ô duy nhất. Gắn khoá cho mọi phần tử, emit `state`/`label`/`viecKe`; thêm `done[].at`, `considering[].ageTied`, `vetoOpen[]`, `git.ahead/behind/compareRef`; sửa sort mốc rỗng. | T2–T5 |
| `commands/start.md` | Thân lệnh: bỏ giới hạn 3, in N việc vừa xong, nêu tên veto-mở, dòng cây-lệch, câu phủ định lối (a), khoá mới trong `START-SCAN-KEYS`. | T6 |
| `commands/acceptance-status.md` | Bỏ danh sách if tự chế chữ; chạy máy quét, in `label`/`viecKe` nguyên văn. | T7 |
| `scripts/gate-card.js` | Cổng 2: hỏi máy quét thay vì tự phán; hồ sơ máy-đi-tiếp KHÔNG mời ký; máy quét chết → cờ vàng + hành vi cũ. | T8 |
| `scripts/product-map.mjs` | Lấy ô qua `BUCKET_OF` thay vì tự map status → bucket. | T9 |
| `commands/approve.md` · `signoff.md` · `acceptance-card.md` | In bước kế, dạng bấm được. | T10 |
| `docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md` | TRỪ §9.1. | T11 |
| `tests/plugins/bang-dieu-khien.test.mjs` *(mới)* | Ca BDK1–BDK4 (thân lệnh · bảng 20 khoá · ổ cắm+§9.1 · bước kế). | T6–T11 |
| `tests/plugins/vao-co-o.test.mjs` | VC6 ghim luật mới (`giới hạn: không`). | T6 |
| `_acceptance/start-bang-dieu-khien/rang-bdk.sh` *(mới)* | 6 chân răng hồ sơ, chết theo hồ sơ khi merge. | T12 |

---

### Task 1: Bảng trạng-thái → chữ

**Files:**
- Create: `scripts/trang-thai-ho-so.cjs`
- Test: `tests/plugins/bang-dieu-khien.test.mjs` (ca BDK2, phần bảng)

**Interfaces:**
- Produces: `STATE_KEYS: string[]` (20 phần tử, thứ tự cố định) · `TRANG_THAI: Record<key, {nhan: string, viecKe: string}>` · `BUCKET_OF: Record<key, bucketKey>` với `bucketKey ∈` các khoá `SECTIONS` của `product-map.mjs` · `chu(key) → {nhan, viecKe}` (khoá lạ → `throw` nêu tên khoá, KHÔNG trả mặc định câm).

- [ ] **Step 1: Viết ca đo trước — ma trận toàn phần 20 khoá**

Tạo `tests/plugins/bang-dieu-khien.test.mjs` theo đúng khuôn của `tests/plugins/vao-co-o.test.mjs` (`--ids`, `BDK_CASES`, `pass(id,name)`/`fail(id,msg)`, `ROOT = path.resolve(__dirname,'..','..')`). Ca BDK2 phần bảng:

```js
const BANG = require(path.join(ROOT, 'scripts', 'trang-thai-ho-so.cjs'));
// Ma trận TOÀN PHẦN viết trước: 20 khoá gõ tay, KHÔNG sinh từ chính bảng.
// Viết `=== Object.keys(BANG.TRANG_THAI).length` một mình là hằng đúng — cấm.
const KHOA = ['y-can-nhac','cho-cong-dang','sap-mo-vong','xep-lai','da-bac',
  'cho-cong-pham-vi','dang-lap-ke-hoach','dang-viet-code','cho-nghiem-thu-may',
  'dang-sua-theo-bang-chung','nghiem-thu-bi-chan','cho-cong-bang-chung',
  'may-di-tiep-veto-mo','may-di-tiep-xanh-sach','da-giao','cho-cong-gia-tri',
  'da-nghiem-thu-release','da-nghiem-thu-iterate','da-nghiem-thu-kill','ho-so-hong'];
const N = 20;
if (KHOA.length !== N) errs.push(`danh sách ca ${KHOA.length} != ${N}`);
if (Object.keys(BANG.TRANG_THAI).length !== N)
  errs.push(`bảng khai ${Object.keys(BANG.TRANG_THAI).length} khoá != ${N} — thêm khoá thì thêm ca`);
for (const k of KHOA) {
  const c = BANG.TRANG_THAI[k];
  if (!c) { errs.push(`bảng thiếu khoá ${k}`); continue; }
  if (!c.nhan || !c.viecKe) errs.push(`khoá ${k} thiếu nhan/viecKe`);
  if (!BANG.BUCKET_OF[k]) errs.push(`khoá ${k} không có ô bản đồ trong BUCKET_OF`);
}
// khoá lạ phải CHẾT TO, không trả mặc định câm
let threw = false;
try { BANG.chu('khoa-khong-ton-tai'); } catch (e) { threw = /khoa-khong-ton-tai/.test(e.message); }
if (!threw) errs.push('chu() với khoá lạ không throw nêu tên khoá');
```

- [ ] **Step 2: Chạy để chắc chắn nó ĐỎ**

Run: `BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs`
Expected: FAIL — `Cannot find module '.../scripts/trang-thai-ho-so.cjs'`

- [ ] **Step 3: Viết bảng**

```js
// scripts/trang-thai-ho-so.cjs — MỘT bảng chữ cho mọi bộ đọc mặt người.
//
// Vì sao ở scripts/ chứ không lib/: lib/** là risk_tiers.t3_paths vì nó là LÕI
// CƯỠNG CHẾ — bug ở đó sinh màu xanh giả trên mọi repo tiêu thụ. Một bảng chữ
// hỏng chỉ cho CHỮ SAI trên thẻ, không cho màu xanh giả. Đặt vào lib/ nâng hồ
// sơ này lên T3 = thêm một chốt kế hoạch + một chữ ký bắt buộc, cho đúng cái
// hồ sơ sinh ra để giảm số lượt gọi người (ledger d-20260823T012029Z-27499).
// Tiền lệ cùng lý do: scripts/khong-can-nguoi.mjs.
//
// KHÔNG trùng vai MAP_LABELS trong lib/workspace-record.cjs: bảng kia là trạng
// thái của FILE bản đồ, bảng này là trạng thái của HỒ SƠ — hai trục, không có
// gì phải giữ đồng bộ.
//
// File này THUẦN DỮ LIỆU: không đọc file, không phán trạng thái. Bộ PHÂN Ô duy
// nhất là scripts/start-scan.mjs; ai cần trạng thái thì hỏi nó, đừng dựng lại.
'use strict';

const TRANG_THAI = {
  'y-can-nhac':               { nhan: 'đang cân nhắc',                      viecKe: 'người: điền ngưỡng thì mới có gì để ký' },
  'cho-cong-dang':            { nhan: 'chờ chữ ký — Cổng Đáng',             viecKe: 'người: quyết có làm việc này không' },
  'sap-mo-vong':              { nhan: 'sắp mở vòng',                        viecKe: 'máy: chốt thiết kế và bộ tiêu chí' },
  'xep-lai':                  { nhan: 'xếp lại sau',                        viecKe: 'không ai — đã quyết để lại' },
  'da-bac':                   { nhan: 'đã bác từ khám phá',                 viecKe: 'không ai — đã quyết không làm' },
  'cho-cong-pham-vi':         { nhan: 'chờ chữ ký — Cổng Phạm vi',          viecKe: 'người: duyệt bộ tiêu chí trước khi code' },
  'dang-lap-ke-hoach':        { nhan: 'đang lập kế hoạch',                  viecKe: 'máy: lập kế hoạch thi công' },
  'dang-viet-code':           { nhan: 'đang viết code',                     viecKe: 'máy: viết code theo kế hoạch' },
  'cho-nghiem-thu-may':       { nhan: 'code xong, chưa ai chấm',            viecKe: 'máy: chạy vòng nghiệm thu' },
  'dang-sua-theo-bang-chung': { nhan: 'đang sửa theo bằng chứng',           viecKe: 'máy: sửa rồi chấm vòng mới' },
  'nghiem-thu-bi-chan':       { nhan: 'nghiệm thu bị chặn',                 viecKe: 'máy: khắc phục nguyên nhân kẹt rồi chạy lại' },
  'cho-cong-bang-chung':      { nhan: 'chờ chữ ký — Cổng Bằng chứng',       viecKe: 'người: đọc bằng chứng rồi ký' },
  'may-di-tiep-veto-mo':      { nhan: 'máy đi tiếp — cửa veto còn mở',      viecKe: 'người: veto lúc nào cũng được, cửa không có hạn' },
  'may-di-tiep-xanh-sach':    { nhan: 'máy đi tiếp — bằng chứng xanh-sạch', viecKe: 'không ai — người đã duyệt hoặc miễn Cổng Phạm vi' },
  'da-giao':                  { nhan: 'đã giao',                            viecKe: 'không ai — vòng đã đóng' },
  'cho-cong-gia-tri':         { nhan: 'chờ chữ ký — Cổng Giá trị',          viecKe: 'người: xem số thật từ phiên nghiệm thu rồi quyết' },
  'da-nghiem-thu-release':    { nhan: 'đã nghiệm thu — giao rộng',          viecKe: 'không ai — vòng đã đóng' },
  'da-nghiem-thu-iterate':    { nhan: 'đã nghiệm thu — lặp thêm',           viecKe: 'người: mở vòng kế' },
  'da-nghiem-thu-kill':       { nhan: 'đã nghiệm thu — dừng',               viecKe: 'không ai — đã quyết dừng' },
  'ho-so-hong':               { nhan: 'hồ sơ đọc không được',               viecKe: 'người: sửa hồ sơ rồi quét lại' },
};

// Phép chiếu NHIỀU-VỀ-MỘT sang ô của bản đồ sản phẩm. Bản đồ cố ý KHÔNG mang
// vị từ (đã quyết, known-limit lan-v-khong-phai-cho-ky) — nó gom theo giai
// đoạn. Chiếu ở đây là cách hai bên hết trôi mà bản đồ vẫn giữ vai cũ.
const BUCKET_OF = {
  'y-can-nhac': 'can-nhac',              'cho-cong-dang': 'can-nhac',
  'sap-mo-vong': 'sap-mo',               'xep-lai': 'xep-lai',
  'da-bac': 'da-bac',                    'cho-cong-pham-vi': 'cho-duyet',
  'dang-lap-ke-hoach': 'dang-dung',      'dang-viet-code': 'dang-dung',
  'cho-nghiem-thu-may': 'dang-dung',     'dang-sua-theo-bang-chung': 'dang-dung',
  'nghiem-thu-bi-chan': 'dang-dung',     'cho-cong-bang-chung': 'dang-dung',
  'may-di-tiep-veto-mo': 'dang-dung',    'may-di-tiep-xanh-sach': 'dang-dung',
  'da-giao': 'da-ship',                  'cho-cong-gia-tri': 'cho-nghiem-thu',
  'da-nghiem-thu-release': 'da-nghiem-thu', 'da-nghiem-thu-iterate': 'da-nghiem-thu',
  'da-nghiem-thu-kill': 'da-nghiem-thu', 'ho-so-hong': 'hong',
};

const STATE_KEYS = Object.keys(TRANG_THAI);

// Khoá lạ CHẾT TO: trả một mặc định câm ở đây nghĩa là một trạng thái mới lọt
// ra mặt người dưới cái tên của trạng thái khác — đúng lớp lỗi bảng này sinh ra
// để chặn.
function chu(key) {
  const c = TRANG_THAI[key];
  if (!c) throw new Error(`trang-thai-ho-so: khoá không có trong bảng: ${key}`);
  return c;
}

module.exports = { TRANG_THAI, BUCKET_OF, STATE_KEYS, chu };
```

- [ ] **Step 4: Chạy để chắc chắn nó XANH**

Run: `BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs`
Expected: `PASS: [BDK2]`

- [ ] **Step 5: Phá thử — chiều đỏ có ghim thông điệp**

```bash
cp scripts/trang-thai-ho-so.cjs /tmp/bang.bak
# (a) thêm khoá thứ 21 mà không thêm ca
sed -i '' "s/^};$/  'khoa-moi': { nhan: 'x', viecKe: 'y' },\n};/" scripts/trang-thai-ho-so.cjs
BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs   # phải ĐỎ: "bảng khai 21 khoá != 20"
cp /tmp/bang.bak scripts/trang-thai-ho-so.cjs
# (b) gỡ throw của chu()
perl -0pi -e 's/if \(!c\) throw new Error\(`trang-thai-ho-so: khoá không có trong bảng: \$\{key\}`\);/if (!c) return { nhan: "?", viecKe: "?" };/' scripts/trang-thai-ho-so.cjs
BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs   # phải ĐỎ: "chu() với khoá lạ không throw"
cp /tmp/bang.bak scripts/trang-thai-ho-so.cjs
BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs   # xanh lại
```

- [ ] **Step 6: Commit**

```bash
git add scripts/trang-thai-ho-so.cjs tests/plugins/bang-dieu-khien.test.mjs
git commit -m "feat(bdk): bảng trạng-thái→chữ 20 khoá ở scripts/ (giữ T2); ma trận toàn phần + khoá lạ chết to"
```

---

### Task 2: Máy quét gắn khoá trạng thái cho mọi phần tử

**Files:**
- Modify: `scripts/start-scan.mjs` (mọi nhánh `push` vào `gates`/`inProgress`/`considering`/`done`/`broken`)
- Test: `tests/plugins/bang-dieu-khien.test.mjs` (BDK2, phần máy quét)

**Interfaces:**
- Consumes: `require('./trang-thai-ho-so.cjs')` → `chu`, `TRANG_THAI`.
- Produces: mọi phần tử của bốn nhóm + `broken[]` mang thêm ba khoá: `state` (một trong 20), `label` (= `chu(state).nhan`), `viecKe` (= `chu(state).viecKe`). Nhóm cũ và khoá cũ **giữ nguyên** — đây là CỘNG, không đổi hình dạng.

- [ ] **Step 1: Viết ca đo trước — mọi phần tử phải có state hợp bảng**

```js
// BDK2, phần máy quét: chạy trên CÂY THẬT, mọi phần tử phải mang state ∈ bảng
const j = scan(ROOT);
const all = [...j.groups.gates, ...j.groups.inProgress, ...j.groups.considering,
             ...j.groups.done, ...j.broken];
if (all.length < 50) errs.push(`sàn đếm: chỉ ${all.length} phần tử, phép đo chưa chạy trên cây thật`);
for (const it of all) {
  if (!BANG.TRANG_THAI[it.state]) { errs.push(`${it.slug}: state lạ «${it.state}»`); continue; }
  if (it.label !== BANG.TRANG_THAI[it.state].nhan) errs.push(`${it.slug}: label lệch bảng`);
  if (it.viecKe !== BANG.TRANG_THAI[it.state].viecKe) errs.push(`${it.slug}: viecKe lệch bảng`);
}
```

- [ ] **Step 2: Chạy để chắc chắn nó ĐỎ**

Run: `BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs`
Expected: FAIL — mọi phần tử báo `state lạ «undefined»`

- [ ] **Step 3: Nối bảng vào máy quét**

Thêm sau khối `require` sẵn có ở đầu `scripts/start-scan.mjs`:

```js
// Chữ mặt người rút từ MỘT bảng — máy quét là bộ PHÂN Ô duy nhất, ba bộ đọc
// còn lại hỏi nó chứ không tự phán (hồ sơ start-bang-dieu-khien).
const { chu } = require(path.join(__dirname, 'trang-thai-ho-so.cjs'));
// Gắn khoá + chữ vào một phần tử ngay chỗ nó được đẩy vào nhóm. Khoá lạ chết
// to ở chu() — một trạng thái mới lọt ra mặt người dưới tên trạng thái khác là
// đúng lớp lỗi bảng này sinh ra để chặn.
const g = (state, obj) => ({ ...obj, state, label: chu(state).nhan, viecKe: chu(state).viecKe });
```

Rồi bọc TỪNG lời gọi push. Ánh xạ đầy đủ (20 khoá, không lối nào bỏ sót):

| Vị trí trong `start-scan.mjs` | Khoá |
|---|---|
| `done.push({slug, state: UAT_STATE[verdict]})` | `da-nghiem-thu-release` / `-iterate` / `-kill` — đổi `UAT_STATE` thành `{release:'da-nghiem-thu-release', iterate:'da-nghiem-thu-iterate', kill:'da-nghiem-thu-kill'}` |
| `gates.push({... gate:'gia-tri' ...})` | `cho-cong-gia-tri` |
| `done.push({slug, state:'signed-off'})` (2 chỗ) | `da-giao` |
| `done.push({slug, state: kcnState})` | `may-di-tiep-veto-mo` khi `kcnState==='lan-v-mo'`, `may-di-tiep-xanh-sach` khi `'xanh-sach'` |
| `gates.push({... gate:'bang-chung' ...})` | `cho-cong-bang-chung` |
| `inProgress.push({... nextStep: meaning.nextStep ...})` ở nhánh `verified` | `dang-sua-theo-bang-chung` khi `nextStep==='S3-fix'`, `nghiem-thu-bi-chan` khi `'S4'` |
| `inProgress.push(...)` ở nhánh `implemented` | `cho-nghiem-thu-may` khi chưa có evidence hoặc verdict PASS-family; `dang-sua-theo-bang-chung` khi `S3-fix`; `nghiem-thu-bi-chan` khi verdict BLOCKED |
| `inProgress.push({... nextStep: planExists ? 'S3':'S2' ...})` | `dang-viet-code` / `dang-lap-ke-hoach` |
| `gates.push({... gate:'pham-vi' ...})` | `cho-cong-pham-vi` |
| `gates.push({... gate:'dang' ...})` | `cho-cong-dang` |
| `considering.push(...)` | `y-can-nhac` |
| `inProgress.push({status:'opportunity-decided', nextStep:'S1'})` | `sap-mo-vong` |
| `done.push({slug, state: decision})` (park/kill) | `xep-lai` / `da-bac` |
| MỌI `broken.push(...)` | `ho-so-hong` |

⚠ `done[].state` của hai nhánh cũ mang giá trị `'signed-off'`/`'park'`/`'kill'`/`'lan-v-mo'`/`'xanh-sach'` — **giá trị này đang là hợp đồng máy** (`commands/start.md` đọc `lan-v-mo`/`xanh-sach`; ca P98/P123 đọc `done[].state`). GIỮ khoá cũ tên `state` với giá trị cũ, và đặt khoá trạng thái mới vào tên **`stateKey`**. Sửa ca đo Step 1 và mọi chỗ trong plan này từ `it.state` thành `it.stateKey`. Kiểm bằng: `grep -rn "\.state\b" tests/ commands/ scripts/ | grep -v map.state` phải cho ra danh sách bên đọc cũ, và tất cả vẫn xanh sau task này.

- [ ] **Step 4: Chạy suite plugins để chắc chắn không đỏ bên đọc cũ**

Run: `BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs && bash tests/plugins/run-tests.sh 2>&1 | tail -5`
Expected: `PASS: [BDK2]`, và suite plugins giữ nguyên số ca passed như trước task (ghi lại số đó TRƯỚC khi sửa để so).

- [ ] **Step 5: Phá thử**

```bash
cp scripts/start-scan.mjs /tmp/scan.bak
perl -0pi -e "s/label: chu\(state\)\.nhan/label: 'chờ ký'/" scripts/start-scan.mjs
BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs   # ĐỎ: "<slug>: label lệch bảng"
cp /tmp/scan.bak scripts/start-scan.mjs
```

- [ ] **Step 6: Commit**

```bash
git add scripts/start-scan.mjs tests/plugins/bang-dieu-khien.test.mjs
git commit -m "feat(bdk): máy quét gắn stateKey + label + viecKe cho mọi phần tử, rút từ bảng chung"
```

---

### Task 3: Ngày của việc đã xong + tuổi trùng

**Files:**
- Modify: `scripts/start-scan.mjs`
- Test: `_acceptance/start-bang-dieu-khien/rang-bdk.sh --chan at` (T12), ca BDK2 phần sàn đếm

**Interfaces:**
- Produces: `done[].at` = `'YYYY-MM-DD'` hoặc `null`; `considering[].ageTied` = `boolean`.

- [ ] **Step 1: Viết thang ngày**

```js
// Ngày của một việc đã đóng — suy từ hồ sơ SẴN CÓ, không thêm trường, không
// migrate: đã thử trên 57 hồ sơ signed-off của chính kit, 57/57 ra ngày ngay ở
// nấc một. Nấc nào cũng không ra → null, KHÔNG mượn mtime bịa một mốc.
const NGAY_RE = /(\d{4}-\d{2}-\d{2})/;
const ngayXong = (dir, cPath) => {
  const e = read(path.join(dir, 'evidence-report.md'));
  if (!e.err && e.t != null) {
    const m = NGAY_RE.exec(frontmatterField(e.t, 'human_signoff') || '');
    if (m) return m[1];
  }
  for (const f of ['uat-session.md', 'opportunity.md']) {
    const r = read(path.join(dir, f));
    if (r.err || r.t == null) continue;
    const d = frontmatterField(r.t, 'decided_at');
    if (d) { const m = NGAY_RE.exec(d); if (m) return m[1]; }
  }
  try {
    const o = execFileSync('git', ['-C', root, 'log', '-1', '--format=%cs', '--', path.relative(root, cPath)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return NGAY_RE.test(o) ? o : null;
  } catch { return null; }
};
```

Truyền `at: ngayXong(dir, cPath)` vào MỌI `done.push`. Với hai nhánh `done` của opportunity (park/kill) không có `contract.md` → dùng `oPath` thay `cPath`.

- [ ] **Step 2: Tuổi trùng**

Sau `considering.sort(...)`, thêm:

```js
// Tuổi TRÙNG không phải tuổi: 6/7 ý của chính kit cùng một dấu thời gian vì
// cùng một commit đổ stub. In «cũ nhất X ngày» cho một nhóm như vậy là nói một
// con số không có thật — thẻ phải nói «chưa rõ tuổi».
{
  const dem = new Map();
  for (const c of considering) dem.set(c.since, (dem.get(c.since) || 0) + 1);
  for (const c of considering) c.ageTied = dem.get(c.since) > 1;
}
```

- [ ] **Step 3: Chạy trên cây thật**

Run:
```bash
node scripts/start-scan.mjs --root . | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const n=j.groups.done.filter(d=>d.at===null).length;console.log("done:",j.groups.done.length,"| at null:",n);console.log("ageTied true:",j.groups.considering.filter(c=>c.ageTied).length,"/",j.groups.considering.length);})'
```
Expected: `at null: 0`, `ageTied true: 6 / 7`

- [ ] **Step 4: Commit**

```bash
git add scripts/start-scan.mjs
git commit -m "feat(bdk): done[].at suy theo thang chữ-ký→quyết-định→git; considering[].ageTied cho tuổi trùng"
```

---

### Task 4: Nêu tên thứ còn veto được, đếm bằng đúng vị từ của lưới

**Files:**
- Modify: `scripts/start-scan.mjs`
- Test: `rang-bdk.sh --chan veto-ten` + `--chan dang-thuc` (T12)

**Interfaces:**
- Produces: `vetoOpen: Array<{slug: string, status: string}>` — mảng CẮT NGANG bốn nhóm, xếp theo slug.

- [ ] **Step 1: Hiểu vì sao thẻ đếm 2 mà lưới đếm 16**

`scripts/pre-merge-check.sh:1184-1193` duyệt MỌI `contract.md` và đếm `veto_state: mo` **bất kể `status`**. Máy quét chỉ tới được vị từ `khongCanNguoi` ở nhánh `verified`; nhánh `signed-off` không đọc `veto_state` lần nào — 14/16 hồ sơ veto-mở là `signed-off` nên biến mất khỏi thẻ. `vetoOpen[]` là mảng cắt ngang, ĐỘC LẬP với việc slug rơi vào nhóm nào; `done[].state` giữ nguyên nghĩa cũ (nơi hồ sơ được xếp), không gánh thêm vai.

- [ ] **Step 2: Thu tên trong vòng lặp chính**

Khai `const vetoOpen = [];` cạnh các mảng nhóm. Trong nhánh `if (cTxt != null)`, NGAY SAU khi `statusProblem` đã qua:

```js
// Cửa veto mở — hỏi ĐÚNG câu lưới trước-merge hỏi: mọi contract.md có
// veto_state: mo, bất kể status. Veto-default chỉ sống nếu owner THẤY TÊN;
// đếm một con số mà không nêu tên là giấu chính thứ mình mời người veto.
if ((frontmatterField(cTxt, 'veto_state') || '').trim().toLowerCase() === 'mo')
  vetoOpen.push({ slug, status });
```

Xếp `vetoOpen.sort((a, b) => a.slug.localeCompare(b.slug));` cạnh các `sort` khác, và thêm `vetoOpen` vào object `out({...})` cuối file.

- [ ] **Step 3: Chạy và so với lưới trên CÂY THẬT**

Run:
```bash
node scripts/start-scan.mjs --root . | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const v=JSON.parse(s).vetoOpen;console.log("máy quét:",v.length,v.map(x=>x.slug).join(" "));})'
bash scripts/pre-merge-check.sh . --base origin/main 2>&1 | grep 'cửa veto đang mở'
```
Expected: hai tập slug BẰNG NHAU, cùng 16 phần tử, trong đó ≥1 hồ sơ `signed-off`.

- [ ] **Step 4: Commit**

```bash
git add scripts/start-scan.mjs
git commit -m "feat(bdk): vetoOpen[] nêu tên mọi hồ sơ cửa veto mở, đúng vị từ lưới trước-merge (2 -> 16)"
```

---

### Task 5: Cây có sau bản chung không — và sort mốc rỗng

**Files:**
- Modify: `scripts/start-scan.mjs`
- Test: `rang-bdk.sh --chan ahead-behind` + `--chan sort-tuoi` (T12)

**Interfaces:**
- Produces: `git.ahead: number|null`, `git.behind: number|null`, `git.compareRef: string|null`.

- [ ] **Step 1: Thang so — BẢN CHUNG trước, nhánh trên cùng sau**

Thay khối `const git = (() => {...})()` sẵn có bằng:

```js
const git = (() => {
  const q = args => {
    try {
      return execFileSync('git', ['-C', root, ...args],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } }).trim();
    } catch { return null; }
  };
  const branch = q(['rev-parse', '--abbrev-ref', 'HEAD']);
  const dirty = branch === null ? null : q(['status', '--porcelain']) !== '';
  // Thang so: BẢN CHUNG trước, nhánh trên cùng của chính nhánh này là nấc CUỐI.
  // Đảo thứ tự là nói dối: một nhánh tính năng đã push khớp nhánh trên cùng của
  // nó sẽ ra «khớp» trong khi bản chung đã đi trước — đúng ca lệch 22/08.
  // KHÔNG gọi mạng: chỉ đọc ref đã có trong kho.
  let compareRef = null;
  const head = q(['symbolic-ref', '--short', 'refs/remotes/origin/HEAD']);
  for (const cand of [head, 'origin/main', 'origin/master', '@{u}']) {
    if (!cand) continue;
    if (q(['rev-parse', '--verify', '--quiet', cand]) === null) continue;
    compareRef = cand; break;
  }
  // Không nấc nào giải được → null, KHÔNG phải 0. «Chưa biết» khác hẳn «đã khớp».
  let ahead = null, behind = null;
  if (compareRef) {
    const c = q(['rev-list', '--left-right', '--count', `${compareRef}...HEAD`]);
    const m = c && c.match(/^(\d+)\s+(\d+)$/);
    if (m) { behind = Number(m[1]); ahead = Number(m[2]); }
    else compareRef = null;
  }
  return { branch, dirty, ahead, behind, compareRef };
})();
```

- [ ] **Step 2: Mốc rỗng xếp CUỐI, không xếp đầu**

Thay `gates.sort((a, b) => String(a.since).localeCompare(String(b.since)));` bằng:

```js
// Mốc rỗng = nghi thức thật chưa sinh mốc, KHÔNG phải «chờ lâu nhất». Chuỗi
// rỗng sort lên đầu khiến Cổng Giá trị luôn mở đầu thẻ bất kể tuổi — thẻ nói
// một thứ tự không mang tin (C4).
gates.sort((a, b) => {
  const ea = !String(a.since || ''), eb = !String(b.since || '');
  if (ea !== eb) return ea ? 1 : -1;
  return String(a.since).localeCompare(String(b.since));
});
```

- [ ] **Step 3: Chạy trên cây thật**

Run: `node scripts/start-scan.mjs --root . | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log(JSON.stringify(j.git));console.log(j.groups.gates.map(g=>g.gate+":"+(g.since||"(rỗng)")).join(" | "));})'`
Expected: `compareRef: "origin/main"`, `behind: 0`, và hai cổng `gia-tri` mốc rỗng nằm **cuối** danh sách.

- [ ] **Step 4: Commit**

```bash
git add scripts/start-scan.mjs
git commit -m "feat(bdk): git.ahead/behind/compareRef so BẢN CHUNG trước (không gọi mạng); mốc rỗng xếp cuối"
```

---

### Task 6: Thân lệnh mở phiên

**Files:**
- Modify: `commands/start.md` (khối `START-SCAN-KEYS`, khối `START-CAN-NHAC`, mục `groups.done`, mục bản đồ, lối (a))
- Modify: `tests/plugins/vao-co-o.test.mjs` (VC6)
- Test: `tests/plugins/bang-dieu-khien.test.mjs` (BDK1)

- [ ] **Step 1: `START-SCAN-KEYS` — thêm khoá mới**

Thêm vào khối, giữ nguyên mọi dòng cũ:
```
groups.gates[].stateKey groups.gates[].label groups.gates[].viecKe
groups.inProgress[].stateKey groups.inProgress[].label groups.inProgress[].viecKe
groups.considering[].stateKey groups.considering[].label groups.considering[].ageTied
groups.done[].stateKey groups.done[].label groups.done[].at
vetoOpen[].slug vetoOpen[].status
git.ahead git.behind git.compareRef
```

- [ ] **Step 2: `START-CAN-NHAC` — bỏ giới hạn, thêm khoá máy-đọc**

Thay hai câu «rồi tối đa 3 `name` cũ nhất (script đã xếp cũ nhất lên đầu)» bằng:

```
     `ageDays` lớn nhất; MỌI phần tử có `ageTied` là `true` → thay vế «cũ nhất X
     ngày» bằng «chưa rõ tuổi» — mấy ý sinh cùng một commit mang cùng dấu thời
     gian, in nó thành tuổi là nói một con số không có thật) rồi in **mọi**
     `name` trong `groups.considering`, không cắt (`giới hạn: không`). Máy CHỈ
     được xếp hạng hay cắt khi chính ô đó đã khai **thước** từ trước; chưa có
     thước thì hiện hết theo thứ tự cũ-nhất-trước, không tự chế tiêu chí.
```

- [ ] **Step 3: mục `groups.done` — nêu tên thay vì đếm gộp**

Thay câu «`groups.done` chỉ đếm gộp một dòng cuối thẻ» bằng: giữ dòng đếm gộp, rồi in **`N việc vừa xong` = 5 việc `at` mới nhất**, mỗi việc một dòng `<at> · <label> · <name hoặc slug>`; `at` là `null` → in «chưa rõ ngày», không bỏ dòng. Và thêm một mục riêng: `vetoOpen` có phần tử → in **tên từng hồ sơ**, kèm câu «người veto lúc nào cũng được»; đây là cùng con số lưới trước-merge in.

- [ ] **Step 4: mục bản đồ — thêm dòng cây lệch**

Thêm sau dòng `map.fresh`: `git.behind` > 0 → một dòng «cây này đang sau bản chung N commit (so với `<compareRef>`) — thẻ có thể đang in trạng thái cũ»; `git.compareRef` là `null` → «chưa so được với bản chung nên chưa biết cây có cũ không» (ĐỪNG nói là đã khớp).

- [ ] **Step 5: lối (a) — câu phủ định**

Ngay sau câu «Trước Cổng Đáng KHÔNG dùng `superpowers:brainstorming`…», thêm:
```
Cũng KHÔNG cắm skill hội thoại mở vào bước này — mặc định của kit là máy phân
kỳ theo khuôn (quét không gian, đối chiếu nguồn, vẽ hình) rồi trình MỘT câu
đóng; hỏi mở nhiều lượt kéo người vào giữa vòng, đúng thứ luật kit gọi là
đường cùng. Ổ cắm `discovery.brainstorm_skill` vẫn còn nguyên cho repo nào
muốn tự khai — nó trung tính, kit không cắm sẵn ai vào đó.
```

- [ ] **Step 6: Sửa VC6 + viết BDK1**

VC6: đổi ba assert chuỗi thành bốn — giữ `Đang cân nhắc`, `N = 0 → KHÔNG in`, vị trí; thêm `giới hạn: không` (code span) và `thước`; **bỏ** assert `cũ nhất` trần (nay có nhánh «chưa rõ tuổi»), thay bằng regex `/cũ nhất|chưa rõ tuổi/`.
BDK1: `commands/start.md` phải chứa số `5` khai tường minh cho «N việc vừa xong»; phải có dòng nêu tên `vetoOpen`; phải có dòng `git.behind`; phải có câu phủ định skill hội thoại.

- [ ] **Step 7: Chạy + phá thử**

```bash
VC_CASES=VC6 node tests/plugins/vao-co-o.test.mjs
BDK_CASES=BDK1 node tests/plugins/bang-dieu-khien.test.mjs
cp commands/start.md /tmp/start.bak
perl -0pi -e 's/`giới hạn: không`/`giới hạn: 3`/' commands/start.md
VC_CASES=VC6 node tests/plugins/vao-co-o.test.mjs   # ĐỎ: giới hạn phải là «không», đang là 3
perl -0pi -e 's/`giới hạn: 3`/`giới hạn: ba`/' commands/start.md
VC_CASES=VC6 node tests/plugins/vao-co-o.test.mjs   # VẪN ĐỎ — cap viết bằng chữ, ngoài mọi regex chữ số
cp /tmp/start.bak commands/start.md
```

- [ ] **Step 8: Commit**

```bash
git add commands/start.md tests/plugins/vao-co-o.test.mjs tests/plugins/bang-dieu-khien.test.mjs
git commit -m "feat(bdk): thẻ hiện hết ý, in 5 việc vừa xong, nêu tên veto-mở, nói khi cây sau bản chung"
```

---

### Task 7: Bảng trạng thái đọc từ máy quét

**Files:**
- Modify: `commands/acceptance-status.md` (mục 1–5)
- Test: `tests/plugins/bang-dieu-khien.test.mjs` (BDK2, phần allowlist nhãn)

- [ ] **Step 1: Giữ nguyên hai thứ có ca đo đang ghim**

KHÔNG đụng: frontmatter `disable-model-invocation: true` (P32); đoạn điều khoản một-lượt-gõ chép nguyên văn và mọi needle `--repo` (MUTANT-F của `run-tests.sh:9573` đòi cụm `--repo` có mặt trong file này).

- [ ] **Step 2: Thay bước 1–2 và bước 5**

Bước 1–2 (tự parse frontmatter) → chạy `node ${CLAUDE_PLUGIN_ROOT}/scripts/start-scan.mjs --root .` (hoặc `--root <path>` khi có `--repo`). Bước 5 (danh sách if 7 dòng tự chế chữ) → **xoá hết**, thay bằng: in `label` và `viecKe` **nguyên văn** từ máy quét cho mỗi hồ sơ, và bọc mọi nhãn còn lại trong khối marker:

```
<!-- <<<STATUS-NHAN
(khối này CỐ Ý RỖNG: mọi nhãn trạng thái đến từ `label`/`viecKe` của máy quét.
Thêm một chuỗi vào đây là khai một nhãn TỰ CHẾ — ca đo đòi nó phải nằm trong
bảng `scripts/trang-thai-ho-so.cjs`, không thì đỏ nêu đích danh nhãn.)
STATUS-NHAN>>> -->
```

- [ ] **Step 3: Ca đo — ALLOWLIST, không blacklist**

```js
// Không gian nhãn là MỞ: cấm «Chờ người ký» thì bên viết đặt «Đợi chữ ký» và
// ca vẫn xanh. Rút MỌI nhãn ứng viên rồi assert TẬP CON của bảng.
const md = readFileSync(path.join(ROOT, 'commands', 'acceptance-status.md'), 'utf8');
const blk = (md.match(/<!-- <<<STATUS-NHAN\n([\s\S]*?)STATUS-NHAN>>> -->/) || [])[1];
if (blk === undefined) errs.push('không thấy khối STATUS-NHAN');
const nhan = [...(blk || '').matchAll(/^\s*[-*]\s+«([^»]+)»/gm)].map(m => m[1]);
const hop = new Set(Object.values(BANG.TRANG_THAI).flatMap(c => [c.nhan, c.viecKe]));
for (const n of nhan) if (!hop.has(n)) errs.push(`nhãn ngoài bảng: ${n}`);
if (/Chờ người ký|Chờ code|Phase 3 của skill/.test(md))
  errs.push('acceptance-status.md còn danh sách if tự chế chữ');
```

- [ ] **Step 4: Phá thử — nhãn tự chế MỚI, ngoài mọi chuỗi bị cấm**

```bash
cp commands/acceptance-status.md /tmp/as.bak
perl -0pi -e 's/(STATUS-NHAN>>> -->)/- «Đợi chữ ký»\n$1/' commands/acceptance-status.md
BDK_CASES=BDK2 node tests/plugins/bang-dieu-khien.test.mjs   # ĐỎ: "nhãn ngoài bảng: Đợi chữ ký"
cp /tmp/as.bak commands/acceptance-status.md
bash tests/plugins/run-tests.sh 2>&1 | grep -i 'MUTANT-F'   # vẫn xanh: needle --repo còn nguyên
```

- [ ] **Step 5: Commit**

```bash
git add commands/acceptance-status.md tests/plugins/bang-dieu-khien.test.mjs
git commit -m "feat(bdk): bảng trạng thái đọc chữ từ máy quét, bỏ danh sách if tự chế; nhãn theo allowlist"
```

---

### Task 8: Thẻ cổng thôi mời ký việc máy đã đi tiếp

**Files:**
- Modify: `scripts/gate-card.js` (khối `--- approvable: PASS / PENDING-JUDGMENT ---`, quanh dòng 487)
- Test: `rang-bdk.sh --chan bon-bo-doc` (T12)

**Interfaces:**
- Consumes: `scripts/start-scan.mjs` chạy như tiến trình con; `trang-thai-ho-so.cjs` cho chữ.

- [ ] **Step 1: Hỏi máy quét, đừng dựng vị từ lần thứ ba**

Thêm trước dòng `const chip = ...`:

```js
// Trạng thái làn V hỏi ĐÚNG bộ phân ô, không dựng lại sáu điều kiện xanh-sạch
// ở đây: đó sẽ là bản dựng THỨ BA của lớp lỗi lan-v-khong-phai-cho-ky đã trả
// giá (bash trong lưới, JS trong khong-can-nguoi). Thẻ tiêu thụ chính đầu ra
// của máy quét nên không thể lệch theo cấu trúc (ledger d-...-29818).
// Máy quét chết → giữ NGUYÊN hành vi cũ + cờ vàng; không bao giờ im lặng tuyên sạch.
let scanState = null, scanErr = null;
try {
  const r = require('child_process').spawnSync(process.execPath,
    [path.join(__dirname, 'start-scan.mjs'), '--root', root],
    { encoding: 'utf8', timeout: 20000 });
  if (r.status !== 0) scanErr = (r.stderr || '').trim().slice(0, 200) || `exit ${r.status}`;
  else {
    const j = JSON.parse(r.stdout);
    const hit = [...j.groups.gates, ...j.groups.inProgress, ...j.groups.done]
      .find(x => x.slug === slug);
    scanState = hit ? hit.stateKey : null;
  }
} catch (e) { scanErr = String(e.message).slice(0, 200); }
const MAY_DI_TIEP = scanState === 'may-di-tiep-veto-mo' || scanState === 'may-di-tiep-xanh-sach';
```

- [ ] **Step 2: Đổi chip + tiêu đề + chân thẻ**

```js
const trangThai = require('./trang-thai-ho-so.cjs');
const chip = MAY_DI_TIEP
  ? { t: trangThai.chu(scanState).nhan, c: 'gray' }
  : (verdict === 'PASS' ? { t: 'máy đã xong — ký nhanh', c: 'teal' } : { t: 'cần bạn quyết', c: 'amber' });
const phuDe = MAY_DI_TIEP ? 'Cổng 2 · máy đã đi tiếp' : 'Cổng 2 · ký duyệt';
```

Dùng `phuDe` thay chuỗi `'Cổng 2 · ký duyệt'` trong `div class="sub"`. Ở chân thẻ, `MAY_DI_TIEP` → **bỏ nút Ký**, thay bằng `trangThai.chu(scanState).viecKe`. `scanErr` khác `null` → đẩy một cờ vàng lên đầu: «Chưa đọc được trạng thái làn V (`<scanErr>`) — thẻ đang trình theo lối cũ, có thể mời ký một hồ sơ máy đã đi tiếp.»

- [ ] **Step 3: Phá thử**

```bash
cp scripts/gate-card.js /tmp/gc.bak
perl -0pi -e 's/const MAY_DI_TIEP = .*/const MAY_DI_TIEP = false;/' scripts/gate-card.js
bash _acceptance/start-bang-dieu-khien/rang-bdk.sh --chan bon-bo-doc   # ĐỎ: "gate-card moi ky ho so xanh-sach"
cp /tmp/gc.bak scripts/gate-card.js
```

- [ ] **Step 4: Commit**

```bash
git add scripts/gate-card.js
git commit -m "feat(bdk): thẻ cổng hỏi máy quét — hồ sơ máy-đi-tiếp không còn nút Ký; máy quét chết -> cờ vàng"
```

---

### Task 9: Bản đồ lấy ô qua phép chiếu chung

**Files:**
- Modify: `scripts/product-map.mjs` (hàm `classify`, phần «Lượt 2 — xếp ô»)
- Test: `node scripts/product-map.mjs --root . --check`

- [ ] **Step 1: Chiếu, đừng tự map**

Thay khối `if (status) {...}` + ba dòng cuối của `classify` bằng: gọi cùng logic phân ô rồi `BUCKET_OF[stateKey]`. Bản đồ KHÔNG mang vị từ — nó chỉ đổi *đường đi tới ô*, không đổi *tên ô*. Ràng buộc: `SECTIONS` giữ nguyên 11 ô, không thêm không bớt; `PRODUCT-MAP.md` sau khi vẽ lại phải **giống hệt** bản trước task này (đây là đối chứng dương của task).

- [ ] **Step 2: Đối chứng dương — bản đồ KHÔNG được đổi một ký tự**

```bash
cp PRODUCT-MAP.md /tmp/map.before
node scripts/product-map.mjs --root .
diff /tmp/map.before PRODUCT-MAP.md && echo "ĐÚNG: bản đồ không đổi — chỉ đổi đường đi tới ô"
```
Expected: `diff` rỗng.

- [ ] **Step 3: Phá thử**

```bash
cp scripts/product-map.mjs /tmp/pm.bak
perl -0pi -e "s/BUCKET_OF\[/({...BUCKET_OF, 'da-giao':'dang-dung'})[/" scripts/product-map.mjs
node scripts/product-map.mjs --root . --check   # ĐỎ: lệch hồ sơ
cp /tmp/pm.bak scripts/product-map.mjs && node scripts/product-map.mjs --root . --check
```

- [ ] **Step 4: Commit**

```bash
git add scripts/product-map.mjs
git commit -m "feat(bdk): bản đồ lấy ô qua BUCKET_OF của bảng chung; tên ô và nội dung bản đồ không đổi"
```

---

### Task 10: Ba thân cổng in bước kế · **independent: true**

**Files:**
- Modify: `commands/approve.md` (cuối mục 5, sau «Offer ONE commit») · `commands/signoff.md` (sau mục 8) · `commands/acceptance-card.md` (mục 6)
- Test: `tests/plugins/bang-dieu-khien.test.mjs` (BDK4) + `LB2` sẵn có

- [ ] **Step 1: Ba dòng bước kế, dạng bấm được**

`approve.md`: sau khối commit — «Bước kế: máy lập kế hoạch thi công (S2). Vòng chạy bằng `/feature-loop:feature-loop <slug>`; không cần người ở ranh giới này.»
`signoff.md`: sau mục 8 — «Bước kế: bàn giao (S5) — mở PR theo quy trình repo. Hồ sơ có `opportunity.md` thì sau khi giao còn Cổng Giá trị: `/acceptance-gate:uat-session <slug>`.»
`acceptance-card.md`: mục 6, sau câu «The human's click flows into the REAL gate» — «Thẻ không ghi gì: Cổng Phạm vi ghi bằng `/acceptance-gate:approve <slug>`, Cổng Bằng chứng bằng `/acceptance-gate:signoff <slug>`.»

⚠ Mọi tên lệnh dùng cột «Lệnh bấm được» của `COMMAND-NAMES`. **KHÔNG đổi hằng `FILES.length !== 16`** — ba file này đã trong vũ trụ quét.

- [ ] **Step 2: BDK4 + phá thử**

BDK4 assert mỗi file có dòng bước kế (regex theo cụm nội dung, không theo dòng số). Phá thử: gỡ dòng của từng file (3 lượt) → BDK4 đỏ nêu đúng file; đổi một lệnh sang dạng trần → `LB2` đỏ nêu đúng `file:dòng`.

- [ ] **Step 3: Commit**

```bash
git add commands/approve.md commands/signoff.md commands/acceptance-card.md tests/plugins/bang-dieu-khien.test.mjs
git commit -m "feat(bdk): ba thân cổng in bước kế ở dạng bấm được (S2 / S5 / hai lệnh ký)"
```

---

### Task 11: TRỪ §9.1 của hạt giống · **independent: true**

**Files:**
- Modify: `docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md:210-222`
- Test: `tests/plugins/bang-dieu-khien.test.mjs` (BDK3)

- [ ] **Step 1: TRỪ có dấu vết, không xoá câm**

Thay tiêu đề §9.1 thành `### 9.1 Cắm brainstorm vào Vòng HIỂU — ĐÃ TRỪ 2026-08-23`, giữ nguyên thân cũ dưới một dòng gạch, và mở đầu bằng khối lý do: skill đó là hội thoại nhiều lượt hỏi mở, trái luật «hỏi mở là đường cùng»; cắm skill bên thứ ba làm mặc định cũng trái ổ cắm F-K (đích không tồn tại ở repo khác). **Ổ cắm `discovery.brainstorm_skill` giữ nguyên** — trung tính, repo tự khai.

- [ ] **Step 2: BDK3 — đo QUAN HỆ, không hash khối**

```js
// Ổ cắm còn sống = ba hình dạng config cho ba kết quả đúng. KHÔNG hash khối mã:
// mọi lần format lại hay đổi tên biến sẽ đỏ vĩnh viễn dù ổ cắm không đổi nghĩa.
for (const [cfg, mong] of [
  ['schema_version: 1\n', null],
  ['schema_version: 1\ndiscovery:\n  brainstorm_skill: mot-skill\n', 'mot-skill'],
  ['schema_version: 1\ndiscovery:\n  brainstorm_skill: [a, b]\n', null],
]) {
  const r = fx(); writeFileSync(path.join(r, '_acceptance', 'config.yaml'), cfg);
  const got = scan(r).discovery.brainstormSkill;
  if (got !== mong) errs.push(`ổ cắm: config «${cfg.trim().split('\n').pop()}» → ${JSON.stringify(got)}, mong ${JSON.stringify(mong)}`);
}
const seed = readFileSync(path.join(ROOT, 'docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md'), 'utf8');
if (!/9\.1[^\n]*ĐÃ TRỪ/.test(seed)) errs.push('§9.1 chưa mang dấu vết TRỪ');
if (!/không cắm skill hội thoại mở/.test(readFileSync(START_MD, 'utf8'))) errs.push('start.md thiếu câu phủ định');
```

- [ ] **Step 3: Phá thử**

```bash
cp scripts/start-scan.mjs /tmp/scan2.bak
perl -0pi -e "s/const v = resolveConfigKey\(String\(cfgTxt \|\| ''\), 'discovery.brainstorm_skill'\);/const v = 'product-management:brainstorm';/" scripts/start-scan.mjs
BDK_CASES=BDK3 node tests/plugins/bang-dieu-khien.test.mjs   # ĐỎ ở hai hình dạng: ổ cắm hết đọc config
cp /tmp/scan2.bak scripts/start-scan.mjs
```

- [ ] **Step 4: Commit**

```bash
git add docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md tests/plugins/bang-dieu-khien.test.mjs
git commit -m "docs(bdk): TRỪ §9.1 — không cắm skill hội thoại vào Vòng HIỂU; ổ cắm giữ nguyên"
```

---

### Task 12: Răng hồ sơ — sáu chân

**Files:**
- Create: `_acceptance/start-bang-dieu-khien/rang-bdk.sh` (chạy được: `chmod +x`)
- Test: chính nó, và `node scripts/eval-coverage-lint.js .`

**Interfaces:**
- Consumes: mọi task trên. Sáu chân khớp sáu khoá config đã khai: `at` · `veto-ten` · `dang-thuc` · `bon-bo-doc` · `ahead-behind` · `sort-tuoi`.

- [ ] **Step 1: Khung**

Theo khuôn `_acceptance/het-gio-khong-phai-truot/rang.sh`: `ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"` (suy từ vị trí script, KHÔNG hardcode), `set -u`, `do_fail()`, phân nhánh `--chan`, và mỗi chân in `OK [<tên chân>]` khi xanh. Chân nào cũng: dựng fixture bằng code trong chính lần chạy → chạy đối chứng dương TRƯỚC → phá vật thật trong bản sao → đòi ĐỎ với thông điệp ghim.

- [ ] **Step 2: Chân `dang-thuc` — đẳng thức với lưới, khó nhất**

Dựng kho git fixture (`git init`, `git -c user.email=t@t -c user.name=t commit`) có `_acceptance/config.yaml` + vài hồ sơ, trong đó ≥2 hồ sơ `veto_state: mo` ở **hai `status` khác nhau** (một `verified`, một `signed-off` — đúng chỗ nhánh cũ mù). Chạy `start-scan.mjs` và `scripts/pre-merge-check.sh <fixture> --base <sha đầu>` trên CÙNG cây đó, rút tập slug hai bên, so bằng. Rồi thêm một hồ sơ `veto_state: mo`, chạy lại, đòi **cả hai cùng tăng đúng 1**.

- [ ] **Step 3: Chân `bon-bo-doc` — round-trip WRITER→READER**

Khuôn sáu điều kiện xanh-sạch **rút từ `skills/acceptance/references/evidence-report-template.md`** lúc chạy, dựng fixture từ khuôn đó (không gõ tay khuôn của bên đọc). Cộng một chân neo vật thật: lấy `evidence-report.md` THẬT của một hồ sơ `signed-off` trong cây, chạy qua bốn bộ đọc, assert chữ khớp. Chiều đỏ: gỡ một khoá khỏi khuôn writer → fixture hỏng → đỏ nêu tên khoá. Đối chứng dương chỉ áp **ba bộ đọc có vị từ**; bản đồ chỉ assert `BUCKET_OF` đưa cả hai hồ sơ về `dang-dung`.

- [ ] **Step 4: Chạy cả sáu chân**

```bash
chmod +x _acceptance/start-bang-dieu-khien/rang-bdk.sh
for c in at veto-ten dang-thuc bon-bo-doc ahead-behind sort-tuoi; do
  echo "--- $c ---"; bash _acceptance/start-bang-dieu-khien/rang-bdk.sh --chan "$c" || echo "ĐỎ: $c"
done
```
Expected: sáu dòng `OK [<chân>]`, exit 0 cả sáu.

- [ ] **Step 5: Commit**

```bash
git add _acceptance/start-bang-dieu-khien/rang-bdk.sh
git commit -m "test(bdk): răng hồ sơ 6 chân — đẳng thức với lưới, round-trip writer->reader, thang so bản chung"
```

---

### Task 13: Đóng vòng máy

- [ ] **Step 1: Bốn suite + bản đồ**

```bash
bash tests/scripts/run-tests.sh   && bash tests/hooks/run-tests.sh
bash tests/plugins/run-tests.sh   && bash tests/workflows/run-tests.sh
node scripts/product-map.mjs --root . --check
```
Expected: cả năm exit 0.

- [ ] **Step 2: Lưới trước-merge + diff không chạm hợp đồng đã ký**

```bash
bash scripts/pre-merge-check.sh . --slug start-bang-dieu-khien --base origin/main
git diff --name-only origin/main | grep '_acceptance/.*/contract.md' | grep -v start-bang-dieu-khien \
  && echo "SAI: diff chạm hợp đồng của hồ sơ khác" || echo "ĐÚNG: không chạm hợp đồng đã ký nào"
git diff --name-only origin/main | grep -E '^(lib/|scripts/pre-merge-check\.sh)' \
  && echo "SAI: chạm t3_paths, ô đã tự nâng lên T3" || echo "ĐÚNG: giữ T2"
```

- [ ] **Step 3: Đặt `status: implemented` rồi dispatch S4 NGAY trong cùng lượt**

Sửa `_acceptance/start-bang-dieu-khien/contract.md` frontmatter `status: approved` → `status: implemented`, commit, rồi vào S4 — KHÔNG dừng hỏi người ở ranh giới này (agent tươi của vòng chấm là thứ thoả «người làm ≠ người chấm», không phải một lượt hỏi).

## Self-Review

**1. Spec coverage:** AC-1→T6 · AC-2→T6 · AC-3→T3+T12 · AC-4→T6 · AC-5→T4 · AC-6→T4+T12 · AC-7→T1,T2,T7,T9 · AC-8→T8+T12 · AC-9→T5+T12 · AC-10→T6,T11 · AC-11→T10 · AC-12→T3,T5,T6+T12. Không AC nào thiếu task; không task nào không phục vụ AC.

**2. Placeholder scan:** không có TBD/TODO; mọi bước có lệnh chạy được hoặc khối mã thật.

**3. Type consistency:** `stateKey`/`label`/`viecKe` dùng thống nhất từ T2 trở đi (KHÔNG phải `state` — khoá đó đã là hợp đồng máy của bên đọc cũ, xem cảnh báo T2 Step 3). `BUCKET_OF` trả khoá của `SECTIONS` trong `product-map.mjs`. `chu(key)` throw với khoá lạ ở mọi nơi gọi.

**4. Thứ tự phụ thuộc:** T1 → T2 → {T3, T4, T5} → T6 → {T7, T8} · T9 sau T1 · T10, T11 **độc lập hoàn toàn** (chỉ đụng docs + thân lệnh, không đụng file nào của T1–T9) · T12 sau T2–T8 · T13 cuối.
