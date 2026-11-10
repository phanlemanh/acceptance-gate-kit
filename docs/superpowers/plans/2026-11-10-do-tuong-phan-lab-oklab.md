# Bộ dò tương phản đọc màu trình duyệt thật — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn tất phần còn thiếu để hồ sơ `do-tuong-phan-lab-oklab` chấm được: tám ca mới, chiều đỏ, ca Chromium thật, đối chiếu độc lập với đề bài.

**Architecture:** Code gốc đã có ở PR 489. Vòng này thêm một mốc vá cho gradient trong suốt ở `lib/design-bundle.mjs`; phần còn lại là phép đo. Chiều đỏ chạy trên bản sao cây, mỗi nhát phá đổi đúng một chỗ.

**Tech Stack:** Node 24, jsdom ghim ở `tests/design-eval`, Playwright và Tailwind 4.3.5 lấy từ một kho khác trên máy (không thêm phụ thuộc vào kit).

**Spec:** `_acceptance/do-tuong-phan-lab-oklab/design.md`, `contract.md`, `evals.yaml`.

## Global Constraints

- `vendor/impeccable` giữ nguyên từng byte (ca KD8-vendor).
- `scripts/design-scan.js` chỉ sinh từ `node scripts/build-design-scan.mjs`.
- Mỗi anchor trong `PATCHES` phải xuất hiện đúng một lần.
- Không commit `_acceptance/config.yaml.bak`.
- Tên ca, mã thông điệp đúng từng chữ như `evals.yaml`; đổi `evals.yaml` sau Cổng 1 là đi lại Cổng 1.
- Chiều đỏ ghim thông điệp của đúng lỗi được tiêm, không chỉ mã thoát.

## Review Focus

- Gradient có nhiều điểm dừng, một đục một trong suốt: điểm trong suốt hoà với nền dưới, điểm đục giữ nguyên; thêm vào ca `gradient-alpha` ở Task 2.
- Gradient trong suốt nằm trực tiếp trên `body` không có nền khai báo: nền dưới là trắng mặc định, không bị bỏ đo; thêm vào `gradient-alpha` ở Task 2.
- Màu Chromium tính ra không phải họ lab vì Tailwind đổi cách xuất: ca CR-1 phải hỏng, không xanh giả; Task 5.
- Thư mục tạm của nhát phá còn lại khi ca lỗi giữa chừng: dọn trong `finally`; Task 3.
- Chuỗi có dấu nháy thoát rồi `//`: bộ lọc chú thích không được hiểu nhầm là hết chuỗi; thêm hàng vào `S4-CHU-THICH` ở Task 4.

---

### Task 1: Đối chiếu tiêu chí với đề bài bằng tác tử sạch

`independent: true` · phục vụ: Hỏi-3 (chưa có eval máy; người đọc ở Cổng 2)

**Files:**
- Create: `_acceptance/do-tuong-phan-lab-oklab/doi-chieu-de-bai.md`

- [ ] **Step 1:** Dispatch một tác tử mới. Input duy nhất: nguyên văn đề bài (chép từ tin giao việc, gồm hai ca tái lập, bốn định dạng, alpha, luật không đo được, lỗi chú thích S4). Không cho đọc kho. Yêu cầu: viết tiêu chí nghiệm thu Given/When/Then chỉ từ đề bài.
- [ ] **Step 2:** So từng tiêu chí với AC-1..AC-10, ghi bảng `Tiêu chí từ đề bài | AC khớp | Lệch`.
- [ ] **Step 3:** Có lệch làm đổi phạm vi: dừng, trình lại Cổng 1. Không lệch: commit.

### Task 2: Tám ca mới và vá gradient trong suốt

`independent: false` · phục vụ: E4, E5, E6a, E7, E9a

**Files:**
- Modify: `tests/design-eval/mau-lab.test.mjs`, `lib/design-bundle.mjs`, `scripts/design-scan.js`

**Interfaces:**
- Produces: bảng `CA` có đủ 40 ca; các nhát phá ở Task 3 dựa vào tên ca và các chuỗi anchor trong `PATCHES`.

- [ ] **Step 1: Viết tám ca**, mỗi ca qua `kiemDo`/`kiemKhongDo` hai tầng:
  - `nen-alpha-lab`: `dong('#ffffff', 'lab(0 0 0 / 0.5)')` → REJECT, `/on #808080/`
  - `gradient-oklab`: gradient hai điểm `oklab(0.97 0 0)`, chữ cùng màu → REJECT
  - `gradient-oklch`: gradient hai điểm `oklch(0.97 0 0)`, chữ cùng màu → REJECT
  - `gradient-alpha`: chữ `#ffffff` trên `linear-gradient(oklab(0 0 0 / 0.5), oklab(0 0 0 / 0.5))`, trang trắng → REJECT, `/on #808080/`
  - `nen-oklch-truc-tiep`: `dong('#ffffff', 'oklch(0.15 0 0)')` → PASS
  - `alpha-khong`: `dong('rgba(0, 0, 0, 0)', '#ffffff')` → PASS
  - `alpha-khong-oklab`: `dong('oklab(0 0 0 / 0)', '#ffffff')` → PASS
  - `khong-doc-color-srgb`: `dong('color(srgb 0.96 0.96 0.96)', '#ffffff')` → `kiemKhongDo()`

  Mở rộng `fail-thang`: thêm kiểm cổng `--require-measured` thoát 2, quét `requireMeasured` có `exit_intent` 2.
- [ ] **Step 2: Chạy, xác nhận đỏ đúng chỗ.** `node tests/design-eval/mau-lab.test.mjs --ca gradient-alpha`. Mong `FAIL gradient-alpha` vì đo trên đen. Ca nào khác đỏ thì ghi lại, sửa theo đúng tiêu chí.
- [ ] **Step 3: Vá trong `lib/design-bundle.mjs`.** Thêm mốc trên đường đo tương phản nơi `parseGradientColors` trả điểm dừng cho nền (khoảng dòng 1746 và 1769 của bản vendor, chọn anchor xuất hiện đúng một lần): mọi điểm dừng có `a < 1` đi qua `hoaMau(diem, duoi)` với `duoi = resolveBackground(parent)`, thiếu `duoi` thì dùng trắng. Không sửa `parseGradientColors` vì các nơi gọi khác cần màu thô.
- [ ] **Step 4:** `node scripts/build-design-scan.mjs` rồi `node tests/design-eval/mau-lab.test.mjs`. Mong dòng cuối `mau-lab: 40/40 ca đạt`.
- [ ] **Step 5:** Commit `fix(design): hoà điểm dừng gradient trong suốt, thêm ca ma trận`.

### Task 3: Chiều đỏ trên bản sao cây

`independent: false` · phục vụ: E1–E8, E9b

**Files:**
- Create: `tests/design-eval/mau-lab-do.test.mjs`
- Consumes: bảng `CA`, tham số `--ca <tiền tố>` của `mau-lab.test.mjs`

- [ ] **Step 1: Khung ca.** `async function phaThu(ma, tep, cu, moi, caXanh, thongDiep)`: copy `scripts lib vendor tests/design-eval` sang thư mục tạm (symlink `node_modules`, gốc suy từ vị trí tệp), chạy `caXanh` trên bản lành phải đạt, thay `cu` bằng `moi` (khớp đúng một lần, không thì ca hỏng), dựng lại bộ quét, chạy lại `caXanh`, phải thoát khác 0 và output chứa `thongDiep`. Dọn thư mục trong `finally`. In `PASS: [MD-n]` hoặc `FAIL: [MD-n] …`.
- [ ] **Step 2: Khai các ca**, đúng bảng trong `evals.yaml`:
  - MD-0: `git archive c8fa5a65 scripts lib vendor`, chạy cổng trên trang của ca `lab` và `oklab`, mong PASS
  - MD-1 đọc họ lab trong parseRgb · MD-2 kappa · MD-3 hoà chữ · MD-4 hoà nền · MD-5 regex gradient · MD-6 vế alpha 0 · MD-7 phát hiện không đọc được · MD-8 wrapper bộ quét · MD-9 điểm dừng nền đục · MD-10 đổi một byte `scripts/design-scan.js` thì `--check` đỏ · MD-11 hoà điểm dừng gradient · MD-12 đảo thứ tự từ chối và không đo được
- [ ] **Step 3:** `node tests/design-eval/mau-lab-do.test.mjs`. Mong 13 dòng `PASS: [MD-…]`, thoát 0.
- [ ] **Step 4:** Commit `test(design): chiều đỏ của bộ ca màu lab trên bản sao cây`.

### Task 4: Bộ lọc chú thích không cắt quá tay

`independent: true` · phục vụ: E10

**Files:**
- Modify: `tests/design-floor/moc-s3-s4.mjs`, có thể `scripts/design-floor-s4.mjs`

- [ ] **Step 1:** Thêm vào `coMa['web/a.tsx']` các dòng: `const v = "a//b"; const e = "#ff0000";`, `const w = "// #abc";`, `const x = 'it\'s // ok'; const f = "#00ff00";`, và một khối `/*` nhiều dòng rồi `const g = "#0000ff";`. Thêm mã mong đợi đúng số dòng.
- [ ] **Step 2:** Thêm đột biến `S4-CHU-THICH-CAT` (cắt từ `//` bất kể chuỗi), mong đỏ với `thiếu dòng`.
- [ ] **Step 3:** `node tests/design-floor/moc-s3-s4.mjs --chi S4-HEX,S4-CHU-THICH`. Đỏ thì sửa `boChuThich`, không nới ca.
- [ ] **Step 4:** Commit `test(design-floor): chú thích không nuốt mã màu trong chuỗi`.

### Task 5: Chromium thật trên trang Tailwind 4

`independent: false` · phục vụ: E11

**Files:**
- Create: `tests/design-eval/mau-lab-chromium.mjs`, `tests/design-eval/fixtures/tailwind4-tai-lap.css`

- [ ] **Step 1: Sinh fixture** bằng Tailwind 4.3.5, ghi phiên bản và lệnh sinh ở đầu tệp, không tự chép tay CSS.
- [ ] **Step 2: Viết script.** Tìm Playwright qua `KIT_PLAYWRIGHT_ROOT`, mặc định `~/dev/onehub-inventory`; không thấy thì thoát 2 nêu đường đã thử. Năm ca CR-1..CR-5 đúng `evals.yaml`. CR-3 dùng `git archive c8fa5a65`, dựng bộ quét của bản đó.
- [ ] **Step 3:** `node tests/design-eval/mau-lab-chromium.mjs`. Mong năm dòng `PASS: [CR-n]`.
- [ ] **Step 4:** Commit `test(design): ca Chromium thật cho hai trang tái lập`.

### Task 6: Bước cuối của bước làm

`independent: false` · phục vụ: toàn bộ, chuyển sang chấm

- [ ] **Step 1:** Chạy lệnh của mọi eval theo `_acceptance/config.yaml`; mong thoát 0.
- [ ] **Step 2:** `DESIGN_EVAL_CAN_DOM=1 bash tests/design-eval/run-tests.sh` và `bash tests/design-floor/run-tests.sh`; mong xanh.
- [ ] **Step 3:** Vẽ lại bản đồ sản phẩm, đặt hợp đồng `status: implemented`, commit, chuyển sang bước chấm bằng tác tử mới.
