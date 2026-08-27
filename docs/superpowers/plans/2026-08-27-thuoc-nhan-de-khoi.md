# Thước nhãn-đè-khối — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (tuần tự — task phụ thuộc dây chuyền qua thước Task 1). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Cho luật «nhãn không bị che» của diagram-design một chiều đỏ chạy được, sửa 3 ca hỏng đã ship.

**Architecture:** Một script Python tĩnh đọc SVG/HTML theo thứ tự tài liệu, ghép cặp mask-rect + text thành «nhãn», báo mọi rect đục vẽ SAU đè lên mask. Lưới vĩnh viễn = case suite tests/scripts với mutant code-sinh + sàn-phát-hiện; răng hồ sơ = rang.sh 8 chân neo BASE-TNK.

**Tech Stack:** Python 3 stdlib (re) · bash · node test hiện có của suite scripts.

**Spec:** docs/superpowers/specs/2026-08-27-thuoc-nhan-de-khoi-design.md

## Global Constraints

- `BASE-TNK = 848adc9233b54a5755c4be2f49af8a01902f75f0` (đối chứng đỏ AC-2; KHÔNG dùng làm comparand diff — diff so `git merge-base HEAD origin/main`).
- Mọi fixture do code sinh trong lần chạy; lệnh tiêm phải chứng minh đổi nội dung; thông điệp đỏ ghim tên; đường dẫn suy từ vị trí script/test (cấm `/Users/`).
- Không chạm: `scripts/pre-merge-check.sh`, `_acceptance/<hồ-sơ-khác>/figures/`, `assets/example-*.html` vendored.
- Thông điệp PASS/đỏ của răng: ASCII không dấu (nếp răng hiện có — grep ổn định).

---

### Task 1: Script `check_label_occlusion.py`

**Files:**
- Create: `diagram-design/skills/diagram-design/scripts/check_label_occlusion.py`

**Interfaces (Produces):** CLI `python3 check_label_occlusion.py [--list] <file.svg|file.html>...`
- stdout mỗi vi phạm: `OCCLUDED <file> nhan "<text>" khoi [x,y,w,h] chong <dx>x<dy>px`
- `--list` in thêm mỗi nhãn phát hiện: `LABEL <file> "<text>"`
- transform scale/rotate/matrix: `WARN <file> bo qua cay con transform khong ho tro` (stdout), cây con bị bỏ.
- Exit: 1 có ≥1 OCCLUDED · 2 không đọc được file nào · 0 sạch.

- [ ] **Step 1: viết script.** Docstring theo giọng `check_overflow.py`, kèm mục "WHAT THIS CANNOT SEE" (nhãn không mask · scale/rotate/matrix · foreignObject · PNG · nhãn w>220/h>18). Thuật toán:

```python
TOKEN = re.compile(r'<(g|/g|rect|text)\b', ...)  # duyệt token theo thứ tự nguồn
# stack translate: <g transform="translate(dx[,dy])"> cộng dồn; scale|rotate|matrix
#   -> đặt cờ skip cho cây con + in WARN một lần/file, </g> pop.
# rect: đọc x,y,width,height (+offset stack), fill/fill-opacity/opacity (attr và style=).
#   opaque = fill không thuộc {none,transparent} và fill-opacity>0.5 và opacity>0.5.
# nhãn = rect h<=18 và w<=220 mà token KẾ TIẾP (bỏ whitespace/comment) là <text>
#   -> bbox nhãn = rect; text lấy nội dung phẳng (strip tag con) làm tên.
# khối = rect opaque w>=60 và h>=28.
# vi phạm: khối xuất hiện SAU nhãn trong thứ tự nguồn và bbox giao nhau >0 cả hai trục.
# .html: tách từng khối <svg ...>...</svg>, chạy cùng thuật toán từng khối.
```

- [ ] **Step 2: smoke hai chiều tại chỗ** (chưa phải răng): sinh 2 file tạm trong `$(mktemp -d)` — bản lành (nhãn + khối không giao) exit 0; bản đè exit 1 nêu tên nhãn. Chạy cả biến thể scale-WARN. Xoá thư mục tạm.
- [ ] **Step 3: chạy trên 2 file BASE-TNK** (`git show BASE-TNK:docs/reference/figures/<f>.svg > /tmp/…`): phải exit 1 và nêu đủ `GHI STATUS`, `HÌNH ĐÍNH THẺ`, `S5 GIAO` — đây là phép thử «phá vật thật» bắt buộc trước khi tin thước.
- [ ] **Step 4: commit** `feat(diagram-design): check_label_occlusion.py — chiều đỏ cho luật nhãn-không-bị-che §6`.

### Task 2: Sửa 3 nhãn + re-export

**Files:**
- Modify: `docs/reference/figures/kien-truc-ho-so-la-truc.html` + `.svg` (GHI STATUS · HÌNH ĐÍNH THẺ)
- Modify: `docs/reference/figures/trang-thai-ho-so.html` + `.svg` (S5 GIAO)
- Regenerate: hai file `.png` tương ứng (thủ tục `references/export.md` của skill diagram-design)

**Interfaces (Consumes):** báo cáo OCCLUDED của Task 1 (toạ độ + px chồng) làm số dời.

- [ ] **Step 1:** chạy thước trên 2 file, lấy toạ độ. Dời **mask + text của nhãn** (không dời khối, không xoá gì): hết giao với khối VÀ giữ gap 6–10px với stroke liên quan. Ứng viên đã tính cho GHI STATUS: mask từ `[292,220]` → `[300,246]` (xuống dưới đoạn ngang y=240, gap 6px, thoát mép khối x=296); hai nhãn kia tính tương tự từ báo cáo. Áp CÙNG một sửa vào `.html` và `.svg` (nội dung svg trùng nhau).
- [ ] **Step 2:** thước trên toàn `docs/reference/figures/*.{svg,html}` → exit 0; `--list` phải còn đủ 3 nhãn. Read bản render (mở .html hoặc export png) NHÌN lại 3 vị trí — thước là sàn, không phải trần.
- [ ] **Step 3:** re-export `.png` cho 2 hình theo `references/export.md`; Read png kiểm bằng mắt.
- [ ] **Step 4: commit** `fix(figures): dời 3 nhãn bị khối che — GHI STATUS, HÌNH ĐÍNH THẺ, S5 GIAO`.

### Task 3: Case suite `label-occlusion.test.mjs`

**Files:**
- Create: `tests/scripts/label-occlusion.test.mjs`
- Modify: `tests/scripts/run-tests.sh` (gọi case, cộng PASS/FAIL vào đếm chung theo khuôn case .mjs hiện có)

**Interfaces (Produces):** stdout case ghim 3 dòng: `PASS: figures hien tai sach` · `PASS: mutant code-sinh -> do dung thong diep` · `PASS: tong nhan phat hien >= <sàn>`.

- [ ] **Step 1:** viết case: (a) resolve repo root từ `import.meta.url` (cấm chuỗi `/Users/`); (b) chạy thước trên `docs/reference/figures/*.{svg,html}` → expect exit 0; (c) đếm dòng `LABEL` qua `--list`, assert ≥ SÀN (điền số đếm thật lúc viết, chú thích «sàn, không phải hằng»); (d) mutant: copy 1 svg thật vào tmp, chèn `<rect x=… fill="#fff">` đè lên mask nhãn đầu tiên tìm thấy (tự parse — chứng minh tiêm đổi nội dung bằng so sánh trước/sau), expect exit 1 + tên nhãn trong stdout.
- [ ] **Step 2:** chạy `bash tests/scripts/run-tests.sh` → suite xanh, 3 dòng ghim có mặt.
- [ ] **Step 3: commit** `test(scripts): case label-occlusion — lưới vĩnh viễn cho thước nhãn-đè-khối`.

### Task 4: Răng hồ sơ + evidence quét vùng ngoài

**Files:**
- Create: `_acceptance/thuoc-nhan-de-khoi/rang.sh` (8 chân: `--chan hai-chieu | ba-ca-that | nhan-con-song | fill-trong-suot | html-inline | suite-case | taste-gate | quet-vung-ngoai`)
- Create: `_acceptance/thuoc-nhan-de-khoi/evidence/quet-vung-ngoai.md`
- Modify: `_acceptance/config.yaml` (8 key `tnk_rang_*` trong `executors.script`, comment nếp không-vào-suite-vĩnh-viễn)

**Interfaces (Consumes):** CLI Task 1, case Task 3, section §9 Task 5 (chân taste-gate chạy được sau Task 5 — chạy chân đó cuối cùng).

- [ ] **Step 1:** viết rang.sh — mỗi chân đúng expected của E1–E5, E7–E9 trong evals.yaml (fixture code-sinh, chiều đỏ qua CHÍNH hàm kiểm cùng lượt, ROOT suy từ `$(dirname "$0")`, thông điệp ASCII). Chân `quet-vung-ngoai`: chạy lại thước trên `_acceptance/*/figures/*.{svg,html}` + `diagram-design/.../assets/example-*.html`, đối chiếu số file + số ca + danh sách nhãn với evidence, và kiểm diff `git merge-base HEAD origin/main` không chạm hai vùng.
- [ ] **Step 2:** sinh `evidence/quet-vung-ngoai.md` bằng chính thước (KHÔNG viết số tay): tổng file, tổng ca, danh sách `OCCLUDED` nguyên văn nếu có.
- [ ] **Step 3:** thêm 8 executor key vào config.yaml; chạy đủ 8 chân — chân nào chưa xanh sửa tại chỗ.
- [ ] **Step 4: commit** `s3(thuoc-nhan-de-khoi): rang.sh 8 chân + evidence quét vùng ngoài + executor keys`.

### Task 5: SKILL §9 + LOCAL-PATCHES

**Files:**
- Modify: `diagram-design/skills/diagram-design/SKILL.md` (§9 khối **Technical:** thêm 1 mục checklist trỏ `scripts/check_label_occlusion.py`, giọng cùng các mục hiện có)
- Modify: `diagram-design/skills/diagram-design/LOCAL-PATCHES.md` (entry đánh số kế tiếp, mục «Local additions»: lý do 3 ca thật + giới hạn + con trỏ hồ sơ này)

- [ ] **Step 1:** thêm mục §9: chạy thước trên file xuất trước khi giao — mục nằm TRONG khối Technical của §9.
- [ ] **Step 2:** entry LOCAL-PATCHES kể: vì sao (3 nhãn ship hỏng, luật văn xuôi không đỏ được), vật (script + case suite), giới hạn khai.
- [ ] **Step 3:** chạy chân `taste-gate` của rang.sh → xanh; **commit** `docs(diagram-design): §9 + LOCAL-PATCHES — móc thước nhãn-đè-khối`.

## Self-review

Phủ AC: AC-1→T1+T4 · AC-2→T1.3+T4 · AC-3→T2+T4 · AC-4/5→T4 · AC-6→T3+T4 · AC-7→T5+T4 · AC-8→T4. Không placeholder; tên script/case/chân nhất quán giữa các task.
