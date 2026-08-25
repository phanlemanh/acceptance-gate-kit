# design-pass nấc không đồng bộ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nghi thức thiết kế S1-D thôi đòi chủ sản phẩm ngồi cạnh máy — mặc định
thành không-đồng-bộ, ngồi-cùng-nhau là nấc cao nhất có người gọi tên; thêm bước
phân kỳ có điều kiện; thẻ Cổng Phạm vi hiện nấc đã dùng.

**Architecture:** Đổi LỜI trong một skill + đọc thêm ba khoá ở một bộ dựng thẻ.
Mọi hình dạng máy-đọc nằm giữa cặp mốc neo trong file NGUỒN, và phép đo rút từ
mốc neo đó rồi cho bộ đọc thật đọc lại (khuôn khớp-vòng P135 đã chạy từ 2.0.0).
Không skill mới, không đụng `lib/`, `hooks/`, workflow, lưới trước-khi-gộp.

**Tech Stack:** Markdown (SKILL.md) · Node CJS (`scripts/gate-card.js`) · Node
ESM test (`tests/plugins/*.test.mjs`) · bash (răng hồ sơ).

**Spec:** `docs/superpowers/specs/2026-08-25-design-pass-nac-khong-dong-bo-design.md`
· Hợp đồng: `_acceptance/design-pass-nac-khong-dong-bo/contract.md`
· Bộ đo: `_acceptance/design-pass-nac-khong-dong-bo/evals.yaml`

## Global Constraints

- **Hạng T2 — không chạm `hooks/**`, `lib/**`, `scripts/pre-merge-check.sh`,
  `scripts/recheck-evidence.cjs`.** Chạm bất kỳ đường nào trong số đó là hạng
  nhảy lên T3: DỪNG, báo, quay lại chốt phạm vi. Không nuốt lặng.
- **Ma trận mutant TOÀN PHẦN.** Số mutant = số vế được khẳng định, theo bảng
  hợp đồng ở đầu `evals.yaml`: E1=5 · E2=2 · E3=3 · E4=2 · E5=4 · E6=3 · E7=3
  · E8=3 · E9=2 · E10=4 nhánh · E11=3 · E12=4 · E13=3 · E15=2. Mỗi mutant bẻ
  ĐÚNG MỘT vế, đi qua CHÍNH bộ kiểm của chiều xanh, thông điệp đỏ GHIM tên vế.
- **Một phép đo mới chỉ tính XONG khi có cặp hai chiều trên CÙNG fixture:** vật
  lành → xanh (đối chứng dương chạy TRƯỚC), phá vật thật trong bản sao → đỏ với
  thông điệp ghim. Thiếu cặp = task CHƯA XONG.
- **Fixture do CODE SINH trong chính lượt chạy, rút TỪ mốc neo của đầu VIẾT** —
  không viết tay theo khuôn bên đọc.
- **Mọi đường dẫn suy từ vị trí script**, không hardcode gốc kho.
- Danh sách nấc đóng: `nac-0` · `nac-1` · `nac-2` · `nac-3`.
- Từ vựng khoá vết đóng: `divergence: opened` | `divergence: skipped — <căn cứ>`.
- Ngôn ngữ mặt người: nhãn hiện cho người là tiếng sản phẩm; tên khoá/mã giữ
  nguyên tên máy.

---

### Task 1: Thang bốn nấc + mặc định không đồng bộ + luật leo thang

**Files:**
- Modify: `skills/design-pass/SKILL.md` — frontmatter `description`; mục «4. Vòng
  lặp owner-phản-ứng» (đổi tên mục); mục «Ranh giới» (gỡ gạch đầu dòng cuối)
- Create: `tests/plugins/design-pass-nac.test.mjs` (ca DP1, DP2, DP3)
- Modify: `tests/plugins/run-tests.sh` — đăng ký bộ ca mới

**Interfaces:**
- Produces: mốc neo `REACTION-LADDER` (bảng bốn nấc) và `REACTION-DEFAULT-SENTENCE`
  (câu chuẩn về nấc mặc định, bản gốc DUY NHẤT) trong `skills/design-pass/SKILL.md`.
  Task 5 chép NGUYÊN VĂN câu trong mốc neo thứ hai; Task 3 và Task 4 dùng id nấc
  từ mốc neo thứ nhất.
- Produces: bộ ca `design-pass-nac.test.mjs` xuất `--ids` (danh sách id ca) và
  đọc env `DP_CASES` — cùng giao thức với `plugin-declare.test.mjs`,
  `lan-v.test.mjs`, `vao-co-o.test.mjs` đã có.

- [ ] **Step 1: Viết ca DP1/DP2/DP3 trước (chúng phải ĐỎ)**

Tạo `tests/plugins/design-pass-nac.test.mjs` theo giao thức đã có trong kho:

```js
#!/usr/bin/env node
// Bộ ca hồ sơ design-pass-nac-khong-dong-bo.
// Mọi fixture RÚT TỪ mốc neo của đầu VIẾT, mutant đi qua CHÍNH bộ kiểm của
// chiều xanh. Không assertion âm-tính-một-mình.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');   // suy từ vị trí script, không hardcode
const SKILL = path.join(ROOT, 'skills', 'design-pass', 'SKILL.md');

const block = (text, name) => {
  const m = text.match(new RegExp('<<<' + name + '\\n([\\s\\S]*?)\\n' + name + '>>>'));
  if (!m) throw new Error(`thieu moc neo ${name}`);
  return m[1];
};
const NAC = ['nac-0', 'nac-1', 'nac-2', 'nac-3'];

// --- bộ kiểm: DÙNG CHUNG cho chiều xanh và mọi mutant ---------------------
function checkLadder(skillText) {
  const errs = [];
  let b;
  try { b = block(skillText, 'REACTION-LADDER'); }
  catch (e) { return ['REACTION-LADDER: ' + e.message]; }
  for (const id of NAC) if (!b.includes(id)) errs.push(`thang thieu nac: ${id}`);
  // danh sách nấc chỉ được khai MỘT chỗ
  const outside = skillText.replace(b, '');
  const dup = NAC.filter(id => outside.includes(id + ' ·') || outside.includes('| ' + id + ' |'));
  if (dup.length) errs.push(`danh sach nac xuat hien 2 cho: ${dup.join(',')}`);
  return errs;
}
```

- [ ] **Step 2: Chạy để chắc chắn ĐỎ**

Run: `node tests/plugins/design-pass-nac.test.mjs --ids`
Expected: FAIL — `thieu moc neo REACTION-LADDER` (skill chưa có mốc neo).

- [ ] **Step 3: Đổi lời skill — bốn nấc + mặc định + leo thang**

Trong `skills/design-pass/SKILL.md`, đổi tiêu đề mục 4 thành
«4. Vòng lặp phản ứng — thang bốn nấc» và đặt vào đó:

```markdown
Cái quý của phiên đồng bộ cũ không phải SỰ ĐỒNG BỘ mà là VẬT BẤM ĐƯỢC. Phiên cũ
trộn hai thứ và chỉ một thứ đắt, nên tách thành thang — kênh đắt chỉ mở khi
quyết định đang mở cần đúng băng thông đó.

<<<REACTION-LADDER
| id | Tên | Dùng khi |
|---|---|---|
| nac-0 | đi thẳng | khuôn có sẵn, 0 hướng mở — để vết một dòng, người veto sau |
| nac-1 | không đồng bộ trên ảnh/canvas | quyết định là hướng · bố cục · tĩnh |
| nac-2 | không đồng bộ trên vật bấm được | cần thấy trạng thái chuyển (luồng nhiều bước) |
| nac-3 | ngồi cùng ngắn, có người gọi tên | tương tác tinh: kéo-thả, chạm, nhịp chuyển động |
REACTION-LADDER>>>

<<<REACTION-DEFAULT-SENTENCE
Mặc định là KHÔNG ĐỒNG BỘ: máy dựng bản mẫu, tự chụp, gửi gói rồi đi làm việc khác; nấc 3 (ngồi cùng) chỉ mở khi có người gọi tên nó.
REACTION-DEFAULT-SENTENCE>>>

Ba luật vận hành:

1. Máy KHUYÊN nấc kèm căn cứ một dòng, người veto một chạm — không bao giờ hỏi
   «anh muốn ngồi cùng hay để đó?».
2. Leo thang theo TÍN HIỆU ĐẾM ĐƯỢC, không theo cảm giác: cùng một điểm bị chê
   hai vòng không-đồng-bộ liên tiếp ⇒ kênh thiếu băng thông ⇒ mời nac-3 GIỚI HẠN
   đúng điểm đó, không phiên trọn gói.
3. Nấc nào cũng để vết: khoá `reaction:` ghi nấc + kênh, thẻ Cổng Phạm vi hiện.
```

Đổi `description` ở frontmatter: bỏ cụm «owner ngồi xem và phản ứng bằng lời
từng vòng», thay bằng «mặc định không đồng bộ — máy gửi gói, người phản ứng lúc
rảnh; ngồi cùng là nấc phải có người gọi tên».

Gỡ gạch đầu dòng cuối mục «Ranh giới» («Phiên đòi owner ngồi xem trực tiếp;
owner async chưa nằm trong phạm vi nghi thức này»). Sửa hai chỗ còn lại trong
mục 4 cũ («CHỜ owner phản ứng bằng lời», «chấm thẩm mỹ là việc của owner ngồi
xem») cho khớp thang.

- [ ] **Step 4: Chạy ca — phải XANH**

Run: `DP_CASES=DP1,DP2,DP3 node tests/plugins/design-pass-nac.test.mjs`
Expected: PASS: DP1 / PASS: DP2 / PASS: DP3

- [ ] **Step 5: Chạy 10 mutant (5+2+3) — mỗi mutant phải ĐỎ với thông điệp ghim**

Mutant chạy trong bộ nhớ trên bản SAO chuỗi, đi qua chính `checkLadder` /
`checkDefault` / `checkEscalation`. Ví dụ m1 của DP1:

```js
const src = fs.readFileSync(SKILL, 'utf8');
if (checkLadder(src).length) throw new Error('doi chung duong DO: ban nguyen ven phai XANH');
const m1 = src.replace('| nac-2 |', '| nac-X |');
const e1 = checkLadder(m1);
if (!e1.some(s => s.includes('thieu nac: nac-2'))) throw new Error('m1 khong do dung ve nac-2');
```

- [ ] **Step 6: Đăng ký bộ ca vào suite `plugins`**

Trong `tests/plugins/run-tests.sh`, cạnh khối `vao-co-o.test.mjs`:

```bash
_dp_ids="$(node "$ROOT/tests/plugins/design-pass-nac.test.mjs" --ids)" || { echo "khong lay duoc danh sach ca DP"; failures=$((failures+1)); _dp_ids=""; }
for _dp in $_dp_ids; do
  run "DP $_dp design-pass nac khong dong bo" \
    env DP_CASES="$_dp" node "$ROOT/tests/plugins/design-pass-nac.test.mjs"
done
```

- [ ] **Step 7: Chạy trọn suite**

Run: `bash tests/plugins/run-tests.sh`
Expected: exit 0, có `PASS: DP1`, `PASS: DP2`, `PASS: DP3`.

- [ ] **Step 8: Commit**

```bash
git add skills/design-pass/SKILL.md tests/plugins/design-pass-nac.test.mjs tests/plugins/run-tests.sh
git commit -m "feat(design-pass): thang 4 nac phan ung, mac dinh khong dong bo"
```

---

### Task 2: Bước phân kỳ có điều kiện + thang vật dựng + vết `divergence:`

**Files:**
- Modify: `skills/design-pass/SKILL.md` — mục mới «3b. Bước phân kỳ» (đặt TRƯỚC
  mục vòng lặp phản ứng); bảng tra degrade
- Modify: `tests/plugins/design-pass-nac.test.mjs` (ca DP4, DP5, DP6, DP7)

**Interfaces:**
- Consumes: mốc neo `REACTION-LADDER` của Task 1 (nac-0 là nhánh không mở phân kỳ).
- Produces: từ vựng đóng `divergence: opened | skipped — <căn cứ>` mà Task 3 đưa
  vào khuôn sổ phiên.

- [ ] **Step 1: Viết ca DP4–DP7 trước (phải ĐỎ)**

DP4 đo THỨ TỰ bằng vị trí ký tự, không đo sự có mặt:

```js
function checkDivergenceOrder(skillText) {
  const errs = [];
  const sec = section(skillText, '## 3b. Bước phân kỳ');
  const iReal = sec.indexOf('mở bằng vật thật đang có');
  const iShow = sec.indexOf('bày hướng');
  if (iReal < 0) errs.push('thieu ve: mo bang vat that dang co');
  if (iShow < 0) errs.push('thieu ve: bay huong');
  if (iReal >= 0 && iShow >= 0 && iReal > iShow)
    errs.push('vat that phai dung truoc bay huong');
  if (!sec.includes('## Đặc tả UX')) errs.push('thieu nguon bay huong: Dac ta UX');
  if (!/chưa có.*design-doc|design-doc.*như cũ/.test(sec))
    errs.push('thieu nhanh lui khi kho chua co dac ta UX');
  return errs;
}
```

Mutant m1 của DP4 là HOÁN VỊ hai mệnh đề (không xoá chữ nào) — nếu bộ kiểm chỉ
đo sự có mặt thì hoán vị vẫn xanh và ca vô dụng.

- [ ] **Step 2: Chạy để chắc chắn ĐỎ**

Run: `DP_CASES=DP4,DP5,DP6,DP7 node tests/plugins/design-pass-nac.test.mjs`
Expected: FAIL — thiếu mục «## 3b. Bước phân kỳ».

- [ ] **Step 3: Viết mục 3b vào skill**

```markdown
## 3b. Bước phân kỳ — có điều kiện, TRƯỚC vòng lặp phản ứng

Điều kiện mở: còn ≥2 hướng khả dĩ mà máy không tự chắc (đúng luật đáng-log của
sổ quyết định). Bề mặt đi theo khuôn có sẵn ⇒ KHÔNG mở — nhưng phải để vết ở
khoá `divergence:` (dưới), không có nhánh «không ghi gì».

Thứ tự bắt buộc:

1. **Mở bằng vật thật đang có trước** — ảnh bề mặt hiện hành, nếu có. Để người
   veto được cả tiền đề, không chỉ chọn trong mấy món máy bày.
2. **Rồi mới bày hướng**, nguồn là section `## Đặc tả UX` của design-doc (bản đồ
   màn & luồng + bảng trạng thái); kho chưa có bản đặc tả thì mở từ design-doc
   như cũ.

Kỷ luật phương án — bốn vế, không bỏ vế nào:

- mỗi hướng một TRỤC có tên + một câu động cơ + một câu đánh đổi;
- áp cho CẢ hướng máy không khuyên (bộ phương án chỉ biện hộ cho ứng viên máy
  thích là phiếu bầu gài sẵn);
- **ngả máy khuyên GHIM TRÊN VẬT**, không nằm trong tin nhắn — người mở đường
  dẫn lúc rảnh phải thấy lời khuyên cạnh hướng, không thấy một thực đơn trần;
- tên hướng ổn định vĩnh viễn; hướng đã chốt không hỏi lại.

**Độ nét = đủ cho quyết định đang mở.** Phác thô hợp lệ; token/component thật
chỉ BẮT BUỘC khi chính token là NỘI DUNG của quyết định.

Thang vật dựng — bốn nấc, kit KHÔNG phụ thuộc bộ dựng nào:

1. dựng được + lưu được → dùng bản lưu;
2. chỉ xem được (xuất ảnh/PDF) → dùng bản chỉ-xem;
3. file đã dựng mở TẠI MÁY trong khung duyệt — quyền tổ chức chỉ gác việc lưu
   trực tuyến, không gác dựng-và-xem;
4. không có gì → máy khuyên MỘT hướng kèm căn cứ, ghi vết, ĐI TIẾP (không dừng
   nghi thức), người veto sau.
```

Thêm hai hàng vào bảng tra degrade:

```markdown
| Không mở bước phân kỳ | Ghi `divergence: skipped — <căn cứ 1 dòng>` trong sổ phiên. Không có đường bỏ im lặng. |
| Không có bộ dựng canvas | Xuống nấc 4 của thang vật dựng: khuyên một hướng kèm căn cứ, ghi vết, đi tiếp. KHÔNG dừng. |
```

- [ ] **Step 4: Chạy ca — phải XANH**

Run: `DP_CASES=DP4,DP5,DP6,DP7 node tests/plugins/design-pass-nac.test.mjs`

- [ ] **Step 5: Chạy 12 mutant (2+4+3+3)**

DP7 m3 là CA TIÊM DƯƠNG cho vế vắng-mặt:

```js
const m3 = src.replace('## 3b. Bước phân kỳ', '## 3b. Bước phân kỳ\n\nBắt buộc dùng canvas-preview cho mọi bề mặt.');
const e3 = checkNoMandatoryBuilder(m3);
if (!e3.some(s => s.includes('canvas-preview'))) throw new Error('m3: ve vang-mat khong biet do');
```

- [ ] **Step 6: Commit**

```bash
git add skills/design-pass/SKILL.md tests/plugins/design-pass-nac.test.mjs
git commit -m "feat(design-pass): buoc phan ky co dieu kien + thang vat dung"
```

---

### Task 3: Ba khoá mới trong khuôn sổ phiên + vá fixture của ba ca cũ

**Files:**
- Modify: `skills/design-pass/SKILL.md` — khối `DESIGN-PASS-NOTE-TEMPLATE`
- Modify: `tests/plugins/run-tests.sh` — bộ dựng fixture của P135, P136, P137
- Modify: `tests/plugins/design-pass-nac.test.mjs` (ca DP8)

**Interfaces:**
- Produces: ba khoá `reaction:`, `canvas:`, `divergence:` trong frontmatter khuôn.
  Task 4 đọc `reaction:` và `canvas:` từ đây.

**⚠ Hệ quả bắt buộc xử lý:** P135/P136/P137 dựng fixture bằng cách thay từng
placeholder rồi khẳng định `"<" not in frontmatter`. Thêm ba khoá có placeholder
mà không vá ba ca đó ⇒ ba ca ĐỎ. Đây là ĐỎ ĐÚNG (khuôn đổi thật), phải vá cùng
lượt, không được nới lỏng phép khẳng định để né.

- [ ] **Step 1: Thêm ba khoá vào khuôn**

```markdown
reaction: <nac-0|nac-1|nac-2|nac-3> (<kênh đã dùng, vd ghim, thao-luan, sua-roi-luu>)
canvas: <đường dẫn hoặc URL bộ phương án — THAM CHIẾU, không phải bằng chứng; trống nếu không mở bước phân kỳ>
divergence: <opened|skipped — căn cứ 1 dòng>
```

- [ ] **Step 2: Chạy P135/136/137 — phải ĐỎ (đúng như dự đoán)**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P13[567]"`
Expected: FAIL — `frontmatter fixture con placeholder song`.

- [ ] **Step 3: Vá ba bộ dựng fixture**

Trong mỗi hàm `mkfix` của P135/P136/P137, thêm ba phép thay:

```python
.replace("<nac-0|nac-1|nac-2|nac-3>", "nac-1")
.replace("(<kênh đã dùng, vd ghim, thao-luan, sua-roi-luu>)", "(ghim)")
.replace("<opened|skipped — căn cứ 1 dòng>", "opened")
```

và một phép thay cho placeholder `canvas:` (dòng dài — thay trọn chuỗi trong
ngoặc nhọn bằng chuỗi rỗng để mô phỏng ca không mở phân kỳ, hoặc bằng một đường
dẫn giả cho ca có canvas).

- [ ] **Step 4: Chạy lại — P135/136/137 XANH, DP8 XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P13[567]|DP8"`

- [ ] **Step 5: Ba mutant của DP8**

Bản sao xoá lần lượt từng khoá khỏi khuôn → cùng bộ trích đỏ, ghim tên khoá.

- [ ] **Step 6: Commit**

```bash
git add skills/design-pass/SKILL.md tests/plugins/run-tests.sh tests/plugins/design-pass-nac.test.mjs
git commit -m "feat(design-pass): khuon so phien them reaction/canvas/divergence"
```

---

### Task 4: Thẻ Cổng Phạm vi đọc nấc + ba nhánh cờ vàng + nhánh không sổ phiên

**Files:**
- Modify: `scripts/gate-card.js:258-297` (khối trục ngữ cảnh) và `:359` (dòng
  render khối «Bản mẫu & ngữ cảnh»)
- Modify: `tests/plugins/design-pass-nac.test.mjs` (ca DP9, DP10, DP13)

**Interfaces:**
- Consumes: khoá `reaction:`, `canvas:` từ khuôn của Task 3; id nấc từ
  `REACTION-LADDER` của Task 1.
- Produces: field `design_pass.reaction`, `design_pass.reaction_label`,
  `design_pass.canvas` trong đầu ra `--extract`; nhãn tiếng người trên thẻ HTML.

- [ ] **Step 1: Viết DP9/DP10/DP13 trước (phải ĐỎ)**

DP13 (nhánh không sổ phiên) phải khẳng định thẻ DỰNG ĐƯỢC:

```js
const d = mkWorkspaceWithoutDesignPass();       // code sinh, không có design-pass.md
const r = spawnSync('node', [GATE_CARD, '--root', d, '--slug', 'fx'], { encoding: 'utf8' });
if (r.status !== 0) throw new Error(`the phai dung duoc: exit ${r.status} — ${r.stderr}`);
if (r.stdout.includes('Bản mẫu')) throw new Error('khoi Ban mau hien tren ho so khong co so phien');
for (const bad of ['undefined', '(chưa khai)']) if (r.stdout.includes(bad)) throw new Error(`nhan la lot ra: ${bad}`);
```

- [ ] **Step 2: Chạy để chắc chắn ĐỎ**

Run: `DP_CASES=DP9,DP10,DP13 node tests/plugins/design-pass-nac.test.mjs`
Expected: DP9/DP10 FAIL (thẻ chưa render nhãn nấc). DP13 có thể XANH sẵn — đó là
hành vi hiện hữu; ca này là RÀO GIỮ, ghi rõ trong comment rằng nó pin hành vi
đang đúng để Task 4 không phá.

- [ ] **Step 3: Thêm bảng nhãn + đọc khoá trong `gate-card.js`**

Cạnh `CONTEXT_LABEL` (dòng 260):

```js
// Nhãn tiếng người của thang phản ứng — CÙNG chữ với REACTION-LADDER trong
// skills/design-pass/SKILL.md; DP9 canh quan hệ đó bằng khớp vòng.
const REACTION_LABEL = {
  'nac-0': 'đi thẳng',
  'nac-1': 'không đồng bộ trên ảnh',
  'nac-2': 'không đồng bộ trên vật bấm được',
  'nac-3': 'ngồi cùng ngắn, có người gọi tên',
};
```

Trong khối `if (dp.present)`, đọc thêm:

```js
const rawReaction = clean(dpFm.reaction || '');
dp.reaction = (rawReaction.match(/^(nac-[0-9a-z]+)/) || [])[1] || '';
dp.canvas = /[<>]/.test(clean(dpFm.canvas || '')) ? '' : clean(dpFm.canvas || '');
```

Ba nhánh cờ (cùng khuôn với cờ `context`):

```js
if (!dp.reaction) dpFlags.push('Sổ phiên chưa khai nấc phản ứng (hồ sơ đời trước thang phản ứng) — không biết phiên đã gọi người ở nấc nào; không chặn, khuyên bổ sung ở phiên sau.');
else if (!REACTION_LABEL[dp.reaction]) dpFlags.push('Nấc phản ứng không nhận diện được: "' + dp.reaction + '" — chỉ nhận nac-0 / nac-1 / nac-2 / nac-3.');
```

- [ ] **Step 4: Render nhãn trên thẻ (dòng 359)**

Nối vào chuỗi khối «Bản mẫu & ngữ cảnh», GIỮ NGUYÊN phần đang có:

```js
+ ` · phản ứng ở nấc: <b>${esc(REACTION_LABEL[dp.reaction] || dp.reaction || '(chưa khai)')}</b>`
+ (dp.canvas ? ' · có bộ phương án' : '')
```

Và thêm ba field vào JSON của `--extract` trong nhánh `design_pass`.

- [ ] **Step 5: Chạy — DP9/DP10/DP13 XANH, P135/136/137 vẫn XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "DP9|DP10|DP13|P13[5-8]"`

- [ ] **Step 6: Mutant — 2 (DP9) + 4 nhánh (DP10) + 2 (DP13)**

- [ ] **Step 7: Commit**

```bash
git add scripts/gate-card.js tests/plugins/design-pass-nac.test.mjs
git commit -m "feat(gate-card): the Cong Pham vi hien nac phan ung + duong doc-cu"
```

---

### Task 5: Vòng lặp nói cùng một chữ — manifest `REACTION-DEFAULT-SITES`

**Files:**
- Modify: `skills/design-pass/SKILL.md` — thêm bảng khai tay `REACTION-DEFAULT-SITES`
- Modify: `feature-loop/skills/feature-loop/SKILL.md:60` (đoạn Nghi thức S1-D)
  và `:56` nếu bảng CT1 nhắc nấc
- Modify: `tests/plugins/design-pass-nac.test.mjs` (ca DP11)

**Interfaces:**
- Consumes: câu chuẩn giữa `REACTION-DEFAULT-SENTENCE` (Task 1).

- [ ] **Step 1: Viết DP11 trước (phải ĐỎ)**

```js
function checkDefaultSites(skillText, readFileAt) {
  const errs = [];
  const sentence = block(skillText, 'REACTION-DEFAULT-SENTENCE').trim();
  const manifest = block(skillText, 'REACTION-DEFAULT-SITES').trim().split('\n');
  for (const line of manifest) {
    const m = line.trim().match(/^(\S+)\s+(\d+)$/);
    if (!m) { errs.push(`dong manifest thieu so: "${line}"`); continue; }
    const [, rel, want] = m;
    const body = readFileAt(rel);
    const got = body.split(sentence).length - 1;
    if (got !== Number(want)) errs.push(`site ${rel}: dem ${got}, manifest khai ${want} — ${got > want ? 'thua' : 'thieu'}`);
  }
  return errs;
}
```

- [ ] **Step 2: Chạy để chắc chắn ĐỎ**

Expected: FAIL — `thieu moc neo REACTION-DEFAULT-SITES`.

- [ ] **Step 3: Thêm manifest + chép câu sang vòng lặp**

Trong `skills/design-pass/SKILL.md`:

```markdown
<<<REACTION-DEFAULT-SITES
skills/design-pass/SKILL.md 1
feature-loop/skills/feature-loop/SKILL.md 1
REACTION-DEFAULT-SITES>>>
```

Trong `feature-loop/skills/feature-loop/SKILL.md` đoạn Nghi thức S1-D: bỏ cụm
«in-harness trên Browser pane, owner ngồi xem», chép NGUYÊN VĂN câu chuẩn vào,
và bổ sung một câu: kết phiên S1-D nay phải khai thêm `reaction:` (thiếu → thẻ
cờ vàng đường đọc-cũ, không chặn, không bắt migrate).

- [ ] **Step 4: Chạy — XANH**

- [ ] **Step 5: Ba mutant (lệch một từ · thừa · thiếu)**

```js
const m1 = { ...files, 'feature-loop/skills/feature-loop/SKILL.md': files[fl].replace('KHÔNG ĐỒNG BỘ', 'không đồng bộ') };
// đổi MỘT TỪ (chữ hoa/thường) ⇒ phải đỏ ghim cặp (site, lệch)
```

- [ ] **Step 6: Commit**

```bash
git add skills/design-pass/SKILL.md feature-loop/skills/feature-loop/SKILL.md tests/plugins/design-pass-nac.test.mjs
git commit -m "feat(feature-loop): S1-D chep nguyen van cau nac mac dinh"
```

---

### Task 6: Lấp lỗ tài liệu — hai ổ cắm thiết kế

**Files:**
- Modify: `GUIDE.md` (cạnh dòng 639, bảng khoá config)
- Modify: `commands/acceptance-init.md` (khuôn config, cạnh dòng 57)
- Modify: `tests/plugins/design-pass-nac.test.mjs` (ca DP12)

**Interfaces:** không phụ thuộc task nào — **`independent: true`**.

- [ ] **Step 1: Viết DP12 trước (bốn ô: 2 file × 2 khoá)**

- [ ] **Step 2: Chạy — ĐỎ ở ô (GUIDE, design_pass.ds_skill) và cả hai ô của khuôn khởi tạo**

- [ ] **Step 3: Thêm dòng vào GUIDE.md**

```markdown
| `design_pass.ds_skill` | Tên skill chuẩn DS/plugin của repo (vd `<plugin>:<skill>`) — nghi thức thiết kế nạp nó làm nguồn luật; vắng thì tụt xuống thang DS (từ vựng token của repo → shadcn) | finding Nhóm 2 nêu nấc đã dùng, không chặn |
```

- [ ] **Step 4: Thêm hai khoá gợi ý vào khuôn khởi tạo**

- [ ] **Step 5: Chạy — XANH; bốn mutant**

- [ ] **Step 6: Commit**

```bash
git add GUIDE.md commands/acceptance-init.md tests/plugins/design-pass-nac.test.mjs
git commit -m "docs: khai du hai o cam thiet ke trong GUIDE va khuon khoi tao"
```

---

### Task 7: Răng hồ sơ — câu chết phải chết, đo trọn hai thư mục

**Files:**
- Create: `_acceptance/design-pass-nac-khong-dong-bo/rang-cau-chet.sh`
- Modify: `_acceptance/config.yaml` — thêm khoá `executors.script.dpnkdb_cau_chet`

**Interfaces:**
- Consumes: marker `DEAD-SENTENCE-NEEDLES` và `BASE-DPNKDB` trong contract.md.

**Chạy SAU Task 1–5** (câu chết phải đã bị gỡ thì chân (2) mới xanh).

- [ ] **Step 1: Viết script — ba chân, một hàm đếm dùng chung**

```bash
#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"     # suy từ vị trí script
ROOT="$(cd "$HERE/../.." && pwd)"
CONTRACT="$HERE/contract.md"

SHA="$(sed -n 's/.*\*\*BASE-DPNKDB:\*\* `\([0-9a-f]\{40\}\)`.*/\1/p' "$CONTRACT")"
[ -n "$SHA" ] || { echo "khong doc duoc BASE-DPNKDB tu contract"; exit 1; }

# hàm đếm DÙNG CHUNG cho cả hai đầu: cùng glob thư mục, khác gốc cây
dem() {  # $1 = gốc cây, $2 = kim
  grep -rF -- "$2" "$1/skills" "$1/feature-loop" 2>/dev/null | wc -l | tr -d ' '
}

BASE="$(mktemp -d)"; trap 'rm -rf "$BASE" "$INJ"' EXIT
git -C "$ROOT" archive "$SHA" skills feature-loop | tar -x -C "$BASE"   # TRỌN cây, không chép danh sách file
```

Rồi đọc từng dòng của `DEAD-SENTENCE-NEEDLES`, chạy ba chân, in `cau-chet OK`.

- [ ] **Step 2: Chân (1) — đối chứng dương phải ≥ số khai**

Kim nào đếm 0 ở mốc ⇒ in `doi chung duong chet: kim "<kim>" khong co o moc BASE-DPNKDB` rồi exit 1.

- [ ] **Step 3: Chân (2) — cây đang kiểm phải 0 mọi kim**

- [ ] **Step 4: Chân (3) — chân tiêm vào file THỨ BA**

```bash
INJ="$(mktemp -d)"; cp -R "$ROOT/skills" "$ROOT/feature-loop" "$INJ/"
printf '%s\n' "$KIM_DAU" >> "$INJ/skills/acceptance/SKILL.md"    # file thứ ba
[ "$(dem "$INJ" "$KIM_DAU")" -ge 1 ] || { echo "chan tiem khong do: phep dem khong quet tron thu muc"; exit 1; }
```

- [ ] **Step 5: Thêm khoá executor vào config**

```yaml
    dpnkdb_cau_chet: bash _acceptance/design-pass-nac-khong-dong-bo/rang-cau-chet.sh
```

- [ ] **Step 6: Chạy**

Run: `bash _acceptance/design-pass-nac-khong-dong-bo/rang-cau-chet.sh`
Expected: exit 0, stdout có `cau-chet OK`.

- [ ] **Step 7: Chạy trọn bốn suite + bản đồ**

```bash
bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh && node scripts/product-map.mjs --root . --check
```

- [ ] **Step 8: Commit**

```bash
git add _acceptance/design-pass-nac-khong-dong-bo/rang-cau-chet.sh _acceptance/config.yaml
git commit -m "test(dpnkdb): rang cau-chet, doi chung duong neo moc co dinh"
```

---

## Bảng phụ thuộc

| Task | Phụ thuộc | independent |
|---|---|---|
| 1 · Thang bốn nấc | — | false (cùng file với 2, 3) |
| 2 · Bước phân kỳ | Task 1 | false |
| 3 · Ba khoá khuôn | Task 2 | false |
| 4 · Thẻ đọc nấc | Task 3 | false |
| 5 · Manifest một-cây-nguồn | Task 1 | false |
| 6 · Lỗ tài liệu | — | **true** |
| 7 · Răng câu chết | Task 1–5 | false |

Chỉ MỘT task độc lập ⇒ **không fan-out**, thi công tuần tự trong phiên chính.

## Tự soi lại kế hoạch

- **Phủ hợp đồng:** AC-1→T1 · AC-2→T1+T7 · AC-3→T1 · AC-4,5,6,7→T2 · AC-8→T3 ·
  AC-9,10→T4 · AC-11→T5 · AC-12→T7 · AC-13→T6 · AC-14→hội đồng ở nghiệm thu máy
  · AC-15→T4. Không tiêu chí nào không có task.
- **Không chỗ trống:** mọi bước có lệnh chạy thật và đoạn mã thật.
- **Nhất quán tên:** `checkLadder` · `checkDefaultSites` · `REACTION_LABEL` ·
  `dem()` dùng đúng một tên xuyên các task.
- **Rủi ro đã ghi:** thêm khoá vào khuôn làm ĐỎ ba ca cũ (P135/136/137) — Task 3
  Step 2 chờ sẵn màu đỏ đó và vá, không nới phép khẳng định để né.
