# gold-output-measure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Sổ vàng in cho người có phép đo máy chạm STDOUT thật + từ điển biệt ngữ lời ký (một nguồn, ship theo plugin).

**Architecture:** `scripts/acceptance-gold.mjs` thêm 3 hàm thuần (`VERDICT_VI` map, `loadGloss()` đọc marker `SIGNOFF-JARGON-GLOSS` theo đường suy từ `import.meta.url`, `usedTerms()`), `render()` gọi chúng; `--json` không đổi. Phép đo mới nằm trong `tests/plugins/run-tests.sh` (P155-P160), fixture code-sinh, đo quan hệ vào⇒ra của STDOUT.

**Tech Stack:** Node ESM (không dependency), bash test harness, marker-comment convention của kit.

## Global Constraints

- KHÔNG đổi `lib/**`, `hooks/**` — feature này ở tầng script/references.
- Nguồn sự thật là `scripts/`, `skills/`; `plugins/` là mirror — sửa xong CHẠY `scripts/sync-plugin-packages.sh` và commit mirror cùng lượt (P30 chặn drift).
- Term mới phải vào CẢ `HFL-GLOSSARY-TERMS` lẫn mục CONTEXT.md (P96 canh).
- Mọi assertion âm tính phải có đối chứng dương + ghim đúng thông điệp.
- `--json` giữ nguyên từng byte trên corpus thật (AC-10).
- Thuật ngữ theo CONTEXT.md; message người-đọc theo N1-N6.

---

### Task 1: Từ điển biệt ngữ — marker + CONTEXT.md (AC-9, một phần AC-7)

**Files:**
- Modify: `skills/acceptance/references/human-facing-language.md` (thêm khối marker `SIGNOFF-JARGON-GLOSS` + 3 term vào `HFL-GLOSSARY-TERMS`)
- Modify: `CONTEXT.md` (3 mục từ mới)
- Test: `tests/plugins/run-tests.sh` (P155)

**Interfaces:**
- Produces: khối marker khuôn `- <term> — <chú giải ≤12 chữ>` giữa `<!-- <<<SIGNOFF-JARGON-GLOSS -->` và `<!-- SIGNOFF-JARGON-GLOSS>>> -->`; Task 2 parse đúng khuôn này.

- [ ] **Step 1: Viết P155 (test đỏ trước)** — trong `tests/plugins/run-tests.sh`, thêm case: rút term từ `SIGNOFF-JARGON-GLOSS`, assert (a) ≥3 term, (b) tập con của `HFL-GLOSSARY-TERMS`, (c) mỗi term có mục trong `CONTEXT.md`; đối chứng: bản sao marker tiêm term lạ `zzz-khong-co-that` → phải đỏ với thông điệp ghim `gloss term ngoai HFL-GLOSSARY-TERMS`.
- [ ] **Step 2: Chạy P155 → FAIL** (`bash tests/plugins/run-tests.sh 2>&1 | grep P155`) vì marker chưa tồn tại.
- [ ] **Step 3: Thêm marker + term** vào human-facing-language.md (known-limits, dogfood, single-source) và 3 mục CONTEXT.md.
- [ ] **Step 4: Chạy P155 + P96 → PASS.**
- [ ] **Step 5: Commit** `git add skills/acceptance/references/human-facing-language.md CONTEXT.md tests/plugins/run-tests.sh`.

### Task 2: render đọc từ điển + khối Từ điển (AC-7, AC-8)

**Files:**
- Modify: `scripts/acceptance-gold.mjs`
- Test: `tests/plugins/run-tests.sh` (P156)

**Interfaces:**
- Consumes: khuôn marker Task 1.
- Produces: `loadGloss(scriptUrl)` → `{terms: Map<string,string>, error: string|null}`; `render()` nhận thêm không-tham-số (tự gọi loadGloss).

- [ ] **Step 1: Viết P156** — ma trận 2 surface × 2 chiều: term (rút TỪ marker thật, không chép tay) tiêm vào `human_override` → khối `## Từ điển` hiện term+chú giải; term chỉ nằm ở hạng mục (question của evals fixture) → vẫn hiện; term không xuất hiện → không in; đối chứng AC-8: copy script sang thư mục tách rời → STDOUT vẫn đủ 2 khối + đúng 1 dòng ghi chú `từ điển biệt ngữ không nạp được`, và ở vị trí thật KHÔNG có dòng đó.
- [ ] **Step 2: Chạy → FAIL.**
- [ ] **Step 3: Cài `loadGloss` + khối Từ điển** trong acceptance-gold.mjs (đường: `path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills/acceptance/references/human-facing-language.md')`; quét term trên text đã render của bảng + ghi chú).
- [ ] **Step 4: Chạy → PASS.**
- [ ] **Step 5: Commit.**

### Task 3: Ba luật ngôn ngữ cơ học (AC-2, AC-4, AC-5)

**Files:**
- Modify: `scripts/acceptance-gold.mjs`
- Test: `tests/plugins/run-tests.sh` (P157)

**Interfaces:**
- Produces: `const VERDICT_VI = { PASS: 'đạt', FAIL: 'chưa đạt', UNCERTAIN: 'chưa chắc' }`; helper `verdictVi(v)`.

- [ ] **Step 1: Viết P157** — (a) ma trận enum: đếm phần tử `VERDICT_VI` từ source, assert số case = phần tử + 1, mỗi enum render `<tiếng người> (<MÃ>)`, giá trị lạ `WEIRD` passthrough nguyên văn; (b) fixture 3 lens → khối góc nhìn có đúng 3 dòng, fixture 1 lens → 1 dòng; (c) fixture 2 slug không panel (1 có contract, 1 không) → 2 dòng riêng, dòng có contract hiện tên sản phẩm, chuỗi cũ `chấm trước khi máy bắt đầu ghi chép` vắng mặt.
- [ ] **Step 2: Chạy → FAIL.**
- [ ] **Step 3: Sửa render** — cột Máy đề xuất qua `verdictVi`, mỗi lens một dòng `out.push`, noPanel lặp từng slug qua `featureOf` với câu trung tính.
- [ ] **Step 4: Chạy → PASS.**
- [ ] **Step 5: Commit.**

### Task 4: Bảng vàng round-trip + fail-loud root (AC-1, AC-6)

**Files:**
- Modify: `scripts/acceptance-gold.mjs` (guard `--root`)
- Test: `tests/plugins/run-tests.sh` (P158)

- [ ] **Step 1: Viết P158** — fixture code-sinh 2 điểm vàng; assert số hàng = 2 và từng hàng khớp 4 cột theo dữ liệu fixture; đối chứng XOÁ (bỏ `human_override` → hàng biến mất) + đối chứng ĐỔI-GIÁ-TRỊ lần lượt 4 trường (feature, question, verdict, human) → đúng ô đó đổi theo; root không có `_acceptance/` → exit ≠0 + thông điệp ghim nêu path; root có `_acceptance/` rỗng → exit 0.
- [ ] **Step 2: Chạy → FAIL.**
- [ ] **Step 3: Thêm guard root** (thiếu `_acceptance/` → `process.stderr.write` + `process.exit(2)`).
- [ ] **Step 4: Chạy → PASS.**
- [ ] **Step 5: Commit.**

### Task 5: Ma trận đồng thuận toàn phần (AC-3)

**Files:**
- Test: `tests/plugins/run-tests.sh` (P159)
- Modify (nếu ma trận bắt lỗi): `scripts/acceptance-gold.mjs` `agreement()`

- [ ] **Step 1: Viết P159** — fixture run-log code-sinh 4 hình dạng {3/3, 2/1, phân kỳ 1/1/1, chẵn 2/2}; ma trận 4 × 3 chiều (bucket, lensTotal, lensUncertain) = 12 assert, mỗi ô một assert, số assert đếm được từ mảng ma trận trong test.
- [ ] **Step 2: Chạy → xem nhánh chẵn có đúng không.**
- [ ] **Step 3: Sửa `agreement()` nếu ô nào đỏ** (nhánh chẵn 2/2 hiện phân loại theo công thức `Math.ceil(n/2)+1` — kiểm lại đúng ý "phân kỳ hẳn").
- [ ] **Step 4: Chạy → PASS 12/12.**
- [ ] **Step 5: Commit.**

### Task 6: Đường đọc-cũ + provenance evidence (AC-10)

**Files:**
- Test: `tests/plugins/run-tests.sh` (P160)
- Create: `_acceptance/gold-output-measure/evidence/gold-stdout.txt` (máy sinh, cuối cùng trước S4)

- [ ] **Step 1: Viết P160** — sinh `--json` bằng bản tại merge-base (`git show <base>:scripts/acceptance-gold.mjs` vào temp) và bằng bản hiện tại trên corpus thật → so byte; render hiện tại exit 0; số hàng bảng == số `points` trong `--json`, số panel khớp; provenance: sinh lại STDOUT bằng node rồi byte-compare với `evidence/gold-stdout.txt` (vắng/lệch → đỏ, thông điệp ghim `gold-stdout.txt khong phai ban may vua in`).
- [ ] **Step 2: Chạy → FAIL** (evidence chưa có).
- [ ] **Step 3: Sinh evidence** `node scripts/acceptance-gold.mjs --root . > _acceptance/gold-output-measure/evidence/gold-stdout.txt`.
- [ ] **Step 4: Chạy → PASS.**
- [ ] **Step 5: Sync mirror + commit** `bash scripts/sync-plugin-packages.sh` rồi `git add scripts/ skills/ CONTEXT.md tests/ plugins/ _acceptance/gold-output-measure/`.
