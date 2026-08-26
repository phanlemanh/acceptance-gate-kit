# Làn máy sống qua bộ phân loại — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lệnh kiểm cố định của kho thôi phải xin phép bộ phân loại từng lần (A), và nghi thức biết đổi sang đường tuần tự khi tung-bầy bị nghẽn (B).

**Architecture:** Bốn vật mang lời khai (luật cho-phép trong `.claude/settings.json` · khối khuyên trong khuôn khởi tạo · đoạn thoái-hoá giữa mốc neo trong nghi thức · mục trong tài liệu vận hành) + một bộ ca đo chúng. Không script mới, không engine mới. Phép đo bám VẬT, không bám hiệu lực lúc chạy.

**Tech Stack:** Node ESM (bộ ca), bash (bộ chạy suite), JSON (settings), Markdown (nghi thức/khuôn/tài liệu).

**Spec:** `docs/superpowers/specs/2026-08-25-lan-may-song-qua-bo-phan-loai-design.md`
**Contract:** `_acceptance/lan-may-song-qua-bo-phan-loai/contract.md` (8 AC)
**Evals:** `_acceptance/lan-may-song-qua-bo-phan-loai/evals.yaml` (8 eval)

## Global Constraints

- **Mốc git cố định** `BASE-LMSQBPL` = `02d9bb59828f9ddfc061590701bdaf67910e27a3`, đọc TỪ contract.md, KHÔNG hardcode trong bộ ca.
- **Ma trận mutant là hợp đồng**, khai giữa mốc neo `MUTANT-MATRIX` ở đầu evals.yaml: E1=4 · E2=5 · E3=4 · E4=3 · E5=4 · E6=2 · E8=3 (tổng 25). Số mutant = số vế được khẳng định.
- **Luật khai sinh phép đo:** mỗi phép đo mới chỉ XONG khi có cặp hai chiều trên CÙNG fixture — vật lành → xanh; phá vật trong BẢN SAO → đỏ với thông điệp GHIM tên vật/entry/vế. Thiếu cặp = task chưa xong.
- **Mọi đường dẫn suy từ vị trí file ca** (`__dirname`), không hardcode gốc kho.
- **Fixture do CODE SINH** trong chính lượt chạy; danh sách khoá phải-giữ RÚT TỪ vật, không liệt tay.
- **Không đụng** `hooks/**`, `lib/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (giữ T2).
- Tiếng dùng trong vật giao cho người: tiếng sản phẩm, theo `CONTEXT.md`.

## File Structure

| File | Trách nhiệm |
|---|---|
| `.claude/settings.json` | mang luật cho-phép (nửa A) — chỉ THÊM khoá `permissions`, mọi khoá khác giữ nguyên |
| `feature-loop/skills/feature-loop/SKILL.md` | mang đoạn thoái-hoá giữa mốc neo `CLASSIFIER-FALLBACK` (nửa B) — chỗ DUY NHẤT khai luật |
| `commands/acceptance-init.md` | mang khối khuyên kho tiêu thụ, đủ 3 vế |
| `GUIDE.md` | mang mục tra cứu cho người vận hành, nêu cả A và B |
| `tests/plugins/lan-may-classifier.test.mjs` | **tạo mới** — 8 ca LM1..LM8, tự xuất `--ids` |
| `tests/plugins/run-tests.sh` | thêm khối lặp `LM_CASES` theo đúng khuôn các hồ sơ khác |

---

### Task 1: Luật cho-phép + ba phép đo trên nó (LM1 · LM2 · LM8)

`independent: false` (Task 2 dựa vào)

**Files:**
- Create: `tests/plugins/lan-may-classifier.test.mjs`
- Modify: `.claude/settings.json`
- Modify: `tests/plugins/run-tests.sh` (thêm khối lặp `LM_CASES`)

**Interfaces:**
- Produces: `allowEntries(settingsText) -> string[]` (bóc `permissions.allow`), `suiteCommands(configText) -> string[]` (giải `feature_loop.suite_keys` → lệnh), `checkBijection(allow, suite) -> string[]`, `checkNoStar(allow) -> string[]`, `checkGrammar(settingsObj) -> string[]`; hằng văn phạm giữa mốc neo `PERM-RULE-GRAMMAR`.
- Consumes: không.

- [ ] **Step 1: Viết ba bộ kiểm + ba ca ĐỎ trước khi sửa settings**

Bộ ca đọc `.claude/settings.json` và `_acceptance/config.yaml` từ đĩa, đường dẫn suy từ `__dirname`. Hằng văn phạm đặt MỘT chỗ:

```js
// <<<PERM-RULE-GRAMMAR
// Khuôn luật quyền của khung cấu hình harness: Bash(<lệnh>) — bọc bắt buộc.
// Nguồn: khoá `permissions` của khung cấu hình (allow/deny/ask), đọc nguyên văn 25/08.
const PERM_RULE = /^Bash\((.+)\)$/;
// PERM-RULE-GRAMMAR>>>
```

`suiteCommands()` giải từng dotted key trong `feature_loop.suite_keys` bằng cách đi theo THỤT LỀ của `_acceptance/config.yaml` — không regex một dòng, vì giá trị có thể có dấu `:` bên trong (`node scripts/product-map.mjs --root . --check`).

- [ ] **Step 2: Chạy để chắc chắn ĐỎ**

Run: `LM_CASES=LM1,LM2,LM8 node tests/plugins/lan-may-classifier.test.mjs`
Expected: FAIL — `.claude/settings.json` chưa có `permissions.allow` (LM1 báo thiếu đủ 5 lệnh; LM8 báo 0 entry).

- [ ] **Step 3: Thêm luật cho-phép vào settings, chỉ THÊM khoá `permissions`**

Năm entry, khớp CHÍNH XÁC, không `*`, đúng bọc `Bash(...)`:

```json
"permissions": {
  "allow": [
    "Bash(bash tests/scripts/run-tests.sh)",
    "Bash(bash tests/hooks/run-tests.sh)",
    "Bash(bash tests/plugins/run-tests.sh)",
    "Bash(bash tests/workflows/run-tests.sh)",
    "Bash(node scripts/product-map.mjs --root . --check)"
  ]
}
```

Viết bằng cách ĐỌC file, parse JSON, thêm khoá, ghi lại — mọi khoá khác giữ nguyên.

- [ ] **Step 4: Chạy lại — phải XANH**

Run: `LM_CASES=LM1,LM2,LM8 node tests/plugins/lan-may-classifier.test.mjs`
Expected: PASS ba dòng `PASS: [LM1]` `PASS: [LM2]` `PASS: [LM8]`.

- [ ] **Step 5: Ma trận mutant — 4 + 5 + 3, mỗi mutant bẻ ĐÚNG một vế trên BẢN SAO**

LM1: m1 bỏ một entry → đỏ ghim lệnh THIẾU · m2 thêm entry lạ → đỏ ghim lệnh THỪA · m3 thêm một `suite_keys` mới vào bản sao **config** mà settings không đổi → đỏ ghim THIẾU (chứng minh đọc CẢ HAI đầu) · m4 đổi một entry lệch một ký tự → đỏ ghim cả thừa lẫn thiếu.
LM2: m1 thêm `Bash(bash *)` · m2 đổi một entry thành có `*` cuối · m3 thêm `Bash(*)` · **m4 rút `permissions.deny`** · **m5 đổi `permissions.defaultMode`** — hai cái cuối NGOÀI bảng chữ `*`, bắt buộc.
LM8: m1 entry TRẦN không bọc → đỏ ghim nguyên văn · m2 chuyển entry sang `permissions.ask` → đỏ ghim đặt nhầm chỗ · m3 đổi bọc thành `Shell(...)` → đỏ.

Mọi lệnh tiêm phải chứng minh nó đổi được ít nhất một dòng, không thì NÉM LỖI.

- [ ] **Step 6: Đăng ký bộ ca vào suite**

Thêm vào cuối `tests/plugins/run-tests.sh`, đúng khuôn các hồ sơ khác:

```bash
# ─── Ho so lan-may-song-qua-bo-phan-loai: LM1..LM8 (file ca rieng) ──────────
_lm_ids="$(node "$ROOT/tests/plugins/lan-may-classifier.test.mjs" --ids)" || { echo "khong lay duoc danh sach ca LM"; failures=$((failures+1)); _lm_ids=""; }
for _lm in $_lm_ids; do
  run "ca lan may qua bo phan loai — $_lm (ho so lan-may-song-qua-bo-phan-loai)" \
    env LM_CASES="$_lm" node "$ROOT/tests/plugins/lan-may-classifier.test.mjs"
done
```

- [ ] **Step 7: PHÁ THỬ trên cây THẬT (luật khai sinh phép đo)**

Xoá một entry khỏi `.claude/settings.json` thật → chạy `LM_CASES=LM1` → phải ĐỎ ghim đúng lệnh thiếu → khôi phục → XANH lại. Ghi kết quả vào transcript.

- [ ] **Step 8: Commit**

```bash
git add tests/plugins/lan-may-classifier.test.mjs tests/plugins/run-tests.sh .claude/settings.json
git commit -m "feat(A): luật cho-phép 5 lệnh kiểm + LM1/LM2/LM8 đo song ánh, không-glob, văn phạm"
```

---

### Task 2: Phép trộn không nuốt cấu hình khác (LM3)

`independent: false` (dựa Task 1)

**Files:**
- Modify: `tests/plugins/lan-may-classifier.test.mjs`

**Interfaces:**
- Consumes: `.claude/settings.json` đã có `permissions.allow` từ Task 1.
- Produces: `baseSettings() -> object` (đọc bản ở mốc), `checkPreserved(baseObj, treeObj) -> string[]`.

- [ ] **Step 1: Viết ca hai chân**

Đọc mốc `BASE-LMSQBPL` TỪ `contract.md` bằng regex trên dòng `**BASE-LMSQBPL:** \`<40 hex>\``. Lấy bản ở mốc: `git show <sha>:.claude/settings.json`. Hai chân RỜI, mỗi chân thông điệp riêng:
(a) mọi khoá cấp cao NGOÀI `permissions` bằng nhau từng ký tự — danh sách khoá DUYỆT TỪ bản ở mốc, không liệt tay;
(b) trong `permissions`, mọi khoá ngoài `allow` bằng nhau, và mọi phần tử `allow` có ở mốc phải còn trong cây.

- [ ] **Step 2: Chạy — XANH (đối chứng dương chạy TRƯỚC mutant)**

Run: `LM_CASES=LM3 node tests/plugins/lan-may-classifier.test.mjs`
Expected: PASS `PASS: [LM3]`.

- [ ] **Step 3: Bốn mutant, tiêm vào BẢN SAO của bản-trong-cây**

m1 xoá một khoá cấp cao ngoài `permissions` → đỏ ghim tên khoá mất · m2 xoá `permissions.deny` → đỏ ghim khoá mất · m3 đổi giá trị một khoá cấp cao không liên quan → đỏ ghim tên khoá đổi · m4 xoá một phần tử `allow` vốn có ở mốc → đỏ ghim entry mất.

Lưu ý: bản ở mốc hiện KHÔNG có `permissions`, nên chân (b) phải xử lý được ca «mốc chưa có khoá đó» mà không ném — vắng ở mốc thì không có gì để giữ, hợp lệ.

- [ ] **Step 4: Chạy lại — XANH**

Run: `LM_CASES=LM3 node tests/plugins/lan-may-classifier.test.mjs`

- [ ] **Step 5: Commit**

```bash
git add tests/plugins/lan-may-classifier.test.mjs
git commit -m "feat(A): LM3 đo mốc↔cây hai chân — không nuốt cấu hình khác"
```

---

### Task 3: Đường thoái hoá trong nghi thức (LM5)

`independent: true`

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (nhánh `BLOCKED`, dòng ~202)
- Modify: `tests/plugins/lan-may-classifier.test.mjs`

**Interfaces:**
- Produces: khối giữa mốc neo `CLASSIFIER-FALLBACK`; `fallbackBlock(text) -> string|null`, `countAnchors(files) -> number`.

- [ ] **Step 1: Viết ca LM5 (đỏ trước)**

Bốn vế RỜI: điều kiện phân biệt «chặn vì bộ phân loại» với BLOCKED khác · hành động bắt buộc «lượt kế đi TUẦN TỰ, KHÔNG fan-out lại» · con trỏ tới đường tuần tự · mốc neo xuất hiện ĐÚNG 1 lần trên TRỌN `skills/**` + `feature-loop/**` (duyệt thư mục, không lọc theo đuôi file).

- [ ] **Step 2: Chạy — ĐỎ**

Run: `LM_CASES=LM5 node tests/plugins/lan-may-classifier.test.mjs`
Expected: FAIL — `thieu moc neo CLASSIFIER-FALLBACK`.

- [ ] **Step 3: Thêm đoạn vào nhánh BLOCKED của nghi thức**

Chèn ngay sau câu BLOCKED hiện có:

```markdown
     <!-- <<<CLASSIFIER-FALLBACK -->
     **Lượt bị chặn VÌ BỘ PHÂN LOẠI thì lượt kế ĐỔI ĐƯỜNG, không tung bầy lại.**
     Phân biệt với BLOCKED nguyên nhân khác (lệnh thiếu, quyền, hạ tầng repo):
     dấu hiệu là `blocked[].reason` nhắc classifier / rate-limit / safety. Khi ấy
     lượt kế PHẢI đi **verify độc lập tuần tự** — một phiên tươi chạy lần lượt
     từng lệnh (skill `acceptance` Phase 3), KHÔNG dispatch lại fan-out. Vì sao:
     xác suất một vòng fan-out sống là pⁿ với n agent cần Bash, nên tung bầy lại
     chỉ đổi lượt trúng đạn. Đã chứng 2/2: chip A vòng 4 thông ngay sau ba vòng
     chặn; chip B đi tuần tự từ đầu, 0 vòng chặn.
     <!-- CLASSIFIER-FALLBACK>>> -->
```

- [ ] **Step 4: Chạy — XANH**

Run: `LM_CASES=LM5 node tests/plugins/lan-may-classifier.test.mjs`

- [ ] **Step 5: Bốn mutant**

m1..m3 xoá lần lượt từng vế trong khối → đỏ ghim đúng vế thiếu (ba vế ĐỘC LẬP, không else-if) · m4 tiêm một khối mang cùng mốc neo vào file THỨ HAI dưới hai thư mục → đỏ ghim "mốc neo xuất hiện 2 chỗ" kèm đường dẫn.

- [ ] **Step 6: Commit**

```bash
git add feature-loop/skills/feature-loop/SKILL.md tests/plugins/lan-may-classifier.test.mjs
git commit -m "feat(B): đường thoái hoá tuần tự trong nhánh BLOCKED + LM5"
```

---

### Task 4: Khối khuyên kho tiêu thụ (LM4)

`independent: true`

**Files:**
- Modify: `commands/acceptance-init.md` (cạnh bước 5b, chỗ đã ghi `.claude/settings.json`)
- Modify: `tests/plugins/lan-may-classifier.test.mjs`

- [ ] **Step 1: Viết ca LM4 (đỏ trước)** — ba vế RỜI, mỗi vế thông điệp riêng: (a) dạng khai KHỚP CHÍNH XÁC / không glob; (b) vì sao (bộ phân loại là nút cổ chai của làn máy); (c) kit KHÔNG tự ghi luật vào kho họ.

- [ ] **Step 2: Chạy — ĐỎ.** Run: `LM_CASES=LM4 node tests/plugins/lan-may-classifier.test.mjs`

- [ ] **Step 3: Thêm bước 5c vào khuôn**

```markdown
5c. KHUYÊN (không tự làm): đội nên khai luật cho-phép cho các lệnh kiểm CỐ ĐỊNH
    của repo trong `.claude/settings.json`, để chúng thôi phải hỏi bộ phân loại ở
    mỗi lần chạy của mỗi agent — bộ phân loại là nút cổ chai của làn nghiệm thu
    máy, và một vòng fan-out chỉ cần một lệnh trúng lúc nghẽn là hỏng cả vòng.
    Dạng khai: mỗi entry KHỚP CHÍNH XÁC một lệnh, `Bash(<lệnh đầy đủ>)`, KHÔNG
    dùng `*` — allowlist rộng là cửa mở im lặng.
    Kit KHÔNG tự ghi luật này vào repo của bạn: cấp quyền là quyết định an ninh
    của đội, không phải mặc định của công cụ.
```

- [ ] **Step 4: Chạy — XANH.** - [ ] **Step 5: Ba mutant** xoá lần lượt từng vế → đỏ ghim đúng vế thiếu.

- [ ] **Step 6: Commit**

```bash
git add commands/acceptance-init.md tests/plugins/lan-may-classifier.test.mjs
git commit -m "feat(A'): khuôn khởi tạo khuyên kho tiêu thụ khai luật cho-phép + LM4"
```

---

### Task 5: Tài liệu vận hành (LM6)

`independent: true`

**Files:**
- Modify: `GUIDE.md`
- Modify: `tests/plugins/lan-may-classifier.test.mjs`

- [ ] **Step 1: Viết ca LM6 (đỏ trước)** — hai vế: GUIDE nêu luật cho-phép của kho (làm gì + đánh đổi) và đường thoái hoá của nghi thức.

- [ ] **Step 2: Chạy — ĐỎ.** Run: `LM_CASES=LM6 node tests/plugins/lan-may-classifier.test.mjs`

- [ ] **Step 3: Thêm mục vào GUIDE** — một mục ngắn: kho cho-phép-sẵn năm lệnh kiểm cố định (đánh đổi: chúng bỏ qua bộ phân loại; danh sách đóng, khớp chính xác, đảo bằng cách xoá rule), và nghi thức có đường thoái hoá tuần tự khi tung-bầy nghẽn.

- [ ] **Step 4: Chạy — XANH.** - [ ] **Step 5: Hai mutant** xoá lần lượt từng mục → đỏ ghim đúng mục thiếu.

- [ ] **Step 6: Commit**

```bash
git add GUIDE.md tests/plugins/lan-may-classifier.test.mjs
git commit -m "docs: GUIDE nêu luật cho-phép + đường thoái hoá + LM6"
```

---

### Task 6: Chạy trọn lưới, dựng bản đồ, chuyển trạng thái

`independent: false`

- [ ] **Step 1: Chạy bốn bộ kiểm + bản đồ**

```bash
for s in plugins scripts hooks workflows; do bash tests/$s/run-tests.sh > /tmp/$s.log 2>&1; echo "$s EXIT=$?"; done
node scripts/product-map.mjs --root . --check; echo "map EXIT=$?"
```

- [ ] **Step 2: Bản đồ lệch thì dựng lại CÙNG LƯỢT** — `node scripts/product-map.mjs --root .` (bài học: ký/đổi trạng thái mà quên dựng bản đồ làm chính commit đó thành bằng chứng lỗi thời).

- [ ] **Step 3: Lưới trước-khi-gộp có mốc so**

```bash
bash scripts/pre-merge-check.sh --base origin/main
```

- [ ] **Step 4: Đặt contract `status: implemented`, commit, vào S4.**

## Self-Review

**Spec coverage:** A → Task 1+2; A' → Task 4; B → Task 3; tài liệu → Task 5; bộ ca → xuyên suốt; đăng ký suite → Task 1 Step 6. AC-7 (chất lượng bộ đo) do hội đồng E7 chấm ở S4, không có task riêng — đúng thiết kế.

**Placeholder scan:** không có TBD/TODO; mọi khối mã là nội dung thật sẽ dán.

**Type consistency:** `allowEntries` · `suiteCommands` · `checkBijection` · `checkNoStar` · `checkGrammar` · `checkPreserved` · `fallbackBlock` · `countAnchors` — dùng nhất quán giữa các task.

**Rủi ro đã biết:** bản ở mốc `BASE-LMSQBPL` chưa có khoá `permissions`, nên chân (b) của LM3 phải xử lý ca «vắng ở mốc» mà không ném — đã ghi ở Task 2 Step 3.
