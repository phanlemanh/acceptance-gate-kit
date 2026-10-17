# Hồ sơ đã ký luôn tươi (K-A) — Implementation Plan

> **For agentic workers:** feature-loop S3 thực thi TUẦN TỰ trong phiên chính (quy ước kho thắng skill con). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lệnh giữ tươi theo khoảng gộp + quy đỏ về PR + nhãn «đỏ sẵn trên nền» cho vòng khác đi tiếp, mặc định tắt.

**Architecture:** Một module luật mới trong `lib/` (băm thông điệp, đọc khoá, kiểm nhãn) là nguồn DUY NHẤT cho bên viết nhãn
(lượt ghim lại) và bên đọc (`checkRepinEvals` — vốn đã dùng chung cho lưới trước-gộp và kiểm lại). Lượt ghim lại thêm chế độ ghim
từng hồ sơ + ghi thông điệp đỏ. Lệnh mới `giu-tuoi.mjs` điều phối: hai lượt lưới để chọn, một lượt ghim, chạy lại lệnh đỏ ở đầu
khoảng, ghi dòng `nen-do`, in bảng.

**Tech Stack:** Node ≥ 20 (ESM `.mjs` + CJS `.cjs` của `lib/`), bash (`pre-merge-check.sh`), git CLI. Không thêm phụ thuộc.

**Spec:** `docs/superpowers/specs/2026-10-17-ho-so-da-ky-giu-tuoi-design.md` · hợp đồng `_acceptance/ho-so-da-ky-giu-tuoi/contract.md` (đã duyệt 17/10).

## Global Constraints

- Khoá `feature_loop.do_san_tren_nen`: vắng / `false` → tắt; `true` → bật; khác → lỗi gọi tên khoá và «true | false».
- Khoá tắt → mọi bên đọc, thẻ, bản đồ, lượt ghim lại cho đầu ra BẰNG bản trước vòng (`43ed9e2b`) từng byte (bỏ ts, sha, id lượt).
- Dòng mới `kind: "nen-do"`; dòng `repin` thêm khoá tuỳ chọn `do_san` — luật hiện diện: không nhãn thì VẮNG HẲN.
- Nhãn trạng thái mới đúng chữ «đỏ sẵn trên nền», thêm vào `NHAN` của `lib/nhan-canh-gay.cjs`; không bao giờ in «ĐẠT» cạnh nó.
- Nhãn chỉ cho eval (Hỏi-2), không cho suite chung.
- Lệnh giữ tươi không commit, không đổi nhánh; từ chối cây bẩn ngoài `_acceptance/` (thoát 2, «cây bẩn ngoài _acceptance/»).
- Mọi phép đo mới có cặp hai chiều trên CÙNG kho thử do code sinh; đường dẫn suy từ vị trí tệp ca; «bản trước vòng» = `git archive 43ed9e2b`.
- Tiếng sản phẩm trong mọi dòng in cho người; từ trong `CONTEXT.md` _Avoid_ không xuất hiện.

## Review Focus

- Nhật ký đỏ có số ngẫu nhiên (cổng, pid, thời lượng ms) trong thông điệp lỗi → băm chuẩn hoá phải bỏ chúng, không thì nhãn không bao giờ khớp (ca trong Task 1).
- Tiêu đề gộp kiểu squash `feat: … (#12)` thay vì `Merge pull request #12` → vẫn rút được số PR (ca trong Task 4).
- Hồ sơ có `evals.yaml` mà KHÔNG eval máy nào (chỉ judgment/ui-check) bị cũ vì khoảng → lệnh ghim như hôm nay, không đẻ dòng `nen-do` rỗng (ca trong Task 4).
- Khoảng rỗng (`<từ>` = `<đến>`) → bảng «0 hồ sơ cũ vì khoảng», thoát 0, không chạy lượt ghim (ca trong Task 4).
- Run-log hồ sơ có dòng JSON hỏng xen giữa → bộ đọc dòng nền bỏ qua dòng hỏng, không ném (ca trong Task 1).

---

### Task 1: Luật nhãn dùng chung + nhãn trạng thái mới

independent: false (mọi task sau dùng) · phục vụ E6, E7, E9

**Files:**
- Create: `lib/do-san-tren-nen.cjs`
- Modify: `lib/nhan-canh-gay.cjs` (thêm `DO_SAN: 'đỏ sẵn trên nền'` vào `NHAN`)
- Modify: `lib/evidence-core.cjs` (`checkRepinEvals`: mã eval ≠ 0 có `entry.do_san[id]` đạt `kiemDoSan` → không đẩy vào `red`, trả thêm `notes[]`)
- Test: `tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs` (dựng khung tệp ca + ca đơn vị GT0-*)

**Interfaces — Produces:**
- `docKhoaDoSan(root): boolean` — ném `Error` chứa `feature_loop.do_san_tren_nen` và `true | false` khi giá trị sai (khuôn `docKhoa` của `scripts/dinh-tuyen-may.cjs`).
- `bamThongDiep(logText: string, tenCa: string[] | null): string` — 64 hex; có tên ca → băm các cặp `(tên ca · dòng lỗi đầu sau tên ca, đã chuẩn hoá)` sắp xếp; không → băm 20 dòng cuối đã chuẩn hoá. Chuẩn hoá: bỏ dấu giờ ISO, `\d+(\.\d+)?\s?(ms|s)\b`, đường dẫn tuyệt đối, chuỗi hex ≥ 7, số cổng/pid sau `:`/`pid`.
- `trichThongDiep(logText, tenCa): string` — ≤ 3 dòng.
- `docDongNen(root, slug, ref: string | null): object[]` — các dòng `kind === 'nen-do'` của run-log (ở `ref` qua `git show` khi có), bỏ dòng hỏng.
- `kiemDoSan({ root, slug, evalId, bam, evalsHash, headRef, baseRef, khoa }): { dat: boolean, veHong: string | null, runId?: string, pr?: number[] }` — vế hỏng ∈ {`khoa-tat`, `khong-co-dong-nen`, `khac-ca-hoac-thong-diep`, `doi-dinh-nghia`, `nen-khong-tren-nhanh-chinh`}.
- `checkRepinEvals(...)` trả `{ errs, notes }`; `notes` = `NOTE [<slug>]: đỏ sẵn trên nền — <E> (nền <run_id>, PR #<n>)`.

- [ ] **Step 1: Viết ca đỏ** — GT0-bam (cùng ca khác lỗi → băm khác; cùng lỗi khác giờ/pid → băm bằng), GT0-khoa (vắng/false/true/"co"), GT0-dong-hong (run-log có dòng hỏng → không ném), GT0-kiem (năm vế hỏng mỗi vế một ô, ghim `veHong`).
- [ ] **Step 2: Chạy** `node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs` → FAIL «Cannot find module …do-san-tren-nen.cjs».
- [ ] **Step 3: Viết `lib/do-san-tren-nen.cjs`, thêm `DO_SAN`, nối `checkRepinEvals`** (khoá tắt → nhánh cũ nguyên văn).
- [ ] **Step 4: Chạy lại** → PASS GT0-*; `node tests/scripts/premerge-repin.test.mjs` và `node tests/scripts/stale-by-paths.test.mjs` xanh.
- [ ] **Step 5: Commit** `feat(ho-so-da-ky-giu-tuoi): luật nhãn đỏ sẵn trên nền dùng chung (lib)`.

### Task 2: Lượt ghim lại — thông điệp đỏ, ghim từng hồ sơ, gắn nhãn

independent: false (cần Task 1) · phục vụ E2, E3, E6, E11

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` — cờ mới `--tung-ho-so`; `lenh_do[]` thêm `thong_diep_bam`, `trich`, `eval` (id) hoặc `suite` (chỉ số); khi khoá bật + eval đỏ → gọi `kiemDoSan` (baseRef = merge-base HEAD với nhánh chính, dò như `s4-args.mjs`), đạt → dòng `repin` mang `do_san`, mục Re-pin thêm ` · đỏ sẵn trên nền: E←<run_id>`; hỏng → `repin-do`, stderr «nhãn không gắn: <vế hỏng>».
- Test: `tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs` (GT2, GT3, GT6), kho thử từ `tests/scripts/gia-lan-fixture.mjs#mkKho`.

**Interfaces — Consumes:** Task 1. **Produces:** JSON stdout thêm `out.slugs[s].ket_cuc ∈ {'ghim','do'}` khi `--tung-ho-so`; thoát 0 khi suite xanh (kể cả có hồ sơ đỏ), 1 khi suite chung đỏ (stderr «suite chung đỏ — không ghim hồ sơ nào»).

- [ ] **Step 1: Ca đỏ** GT2 (một lượt, suite chạy một lần — đếm lệnh trong thư mục nhật ký; chữ ký không đổi byte; recheck xanh; đối chứng âm sửa sha → recheck 1), GT3 (H2 ghim, H5 không; suite đỏ → 0 ghim; bản trước vòng: H2 không được ghim), GT6 (7 ô + ca phụ khoá "co" → thoát 2; bản trước vòng ô khớp thoát 1).
- [ ] **Step 2: Chạy** → FAIL «tham số lạ --tung-ho-so».
- [ ] **Step 3: Sửa `repin-lane.mjs`** (khối kết quả ở :725–800 và `repin-do` ở :819–840). Không `--tung-ho-so` và khoá tắt → đường cũ nguyên văn.
- [ ] **Step 4: Chạy** GT2/GT3/GT6 PASS + `config:executors.test.ho_so_da_ky_giu_tuoi_bo_cu` xanh.
- [ ] **Step 5: Commit** `feat(ho-so-da-ky-giu-tuoi): lượt ghim lại ghim từng hồ sơ + thông điệp đỏ + nhãn`.

### Task 3: Bên đọc — lưới, kiểm lại, thẻ, bản đồ

independent: false (cần Task 1, fixture của Task 2) · phục vụ E7, E9

**Files:**
- Modify: `scripts/pre-merge-check.sh` (khối provenance :1572–1613 — in `notes` của `checkRepinEvals`, không viết lại điều kiện)
- Modify: `scripts/recheck-evidence.cjs` (:172–182 — in `notes`)
- Modify: `scripts/gate-card.js` (`chotMay` :293–330 — dòng ghim mang `do_san` → hiện nhãn `NHAN.DO_SAN`, không chip ĐẠT)
- Modify: `scripts/product-map.mjs` (+ `scripts/trang-thai-ho-so.cjs` nếu cần cờ) — hồ sơ có pin mang `do_san` hiện «đỏ sẵn trên nền»
- Test: GT7, GT9

- [ ] **Step 1: Ca đỏ** GT7 (4 ô: hợp lệ NOTE + không VIOLATION + recheck 0 + thẻ/bản đồ có nhãn, không «ĐẠT»; ba ô giả VIOLATION nêu vế hỏng; hai mutant trên bản sao `lib/do-san-tren-nen.cjs`: ép «không đạt» → ba phía cùng đỏ ở ô hợp lệ, ép «đạt» → ba phía cùng nhận ở ô băm khác, ghim thông điệp từng phía), GT9 (bản trước vòng trên hồ sơ có `nen-do` + `do_san`: không stack trace, mã ∈ {0,1}, VIOLATION cho H5, đầu ra có/không dòng `nen-do` bằng nhau).
- [ ] **Step 2: Chạy** → FAIL (pre-merge VIOLATION mã E1 ở ô hợp lệ).
- [ ] **Step 3: Sửa bốn tệp.**
- [ ] **Step 4: Chạy** GT7/GT9 PASS + `bash tests/scripts/run-tests.sh --manh bash` xanh (VC01–VC09).
- [ ] **Step 5: Commit** `feat(ho-so-da-ky-giu-tuoi): lưới, kiểm lại, thẻ, bản đồ đọc nhãn đỏ sẵn trên nền`.

### Task 4: Lệnh giữ tươi

independent: false (cần Task 1–2) · phục vụ E1, E4, E5, E10

**Files:**
- Create: `feature-loop/scripts/giu-tuoi.mjs`
- Test: GT1, GT4, GT5, GT10 + bốn ca Review Focus (GT-rf1 squash `(#12)`, GT-rf2 hồ sơ không eval máy, GT-rf3 khoảng rỗng, GT-rf4 xem Task 1)

**Interfaces — Produces:** `node feature-loop/scripts/giu-tuoi.mjs --root <kho> --tu <ref> [--den <ref>=HEAD] [--write] [--json] [--ag-root <path>]`. Thoát 0 xong (kể cả có đỏ) · 1 suite chung đỏ · 2 cây bẩn/ref sai/thiếu nguồn · 3 usage. `--json` = `{ tu, den, ho_so: [{ slug, ket_cuc, quy_ve, phut }], ton_dong: [slug], gio_may }`; `ket_cuc ∈ {'tuoi-lai','do-khoang','nhieu-pr','do-san-truoc-khoang','ha-tang'}`.
Thuật toán (thiết kế §1–§5): (1) `git worktree add --detach <tmp> <tu>`; `pre-merge-check.sh` (bản của đỉnh) không `--base` trên đỉnh và trên `<tmp>`, rút slug từ dòng `VIOLATION [<slug>]: evidence is stale`; chọn = cũ-ở-đỉnh − cũ-ở-từ (hồ sơ chưa ký ở `<từ>` tính tươi). (2) `repin-lane.mjs --tung-ho-so --write` (chỉ khi `--write`; không cờ thì chạy không `--write` để biết kết cục). (3) Hồ sơ đỏ: lớp hạ tầng (mã 126/127/≥128, `nhan-canh-gay` `chet`, hay xanh khi chạy lại trên đỉnh) → `ha-tang`; chạy lại lệnh đỏ trong `<tmp>`: đỏ cùng băm → `do-san-truoc-khoang`; còn lại → ứng viên = commit cha-đầu `<tu>..<den>` giao `evalPathsOf` (vắng paths → mọi commit có mã + ghi chú «eval không khai paths»); 1 → `do-khoang`, ≥ 2 → `nhieu-pr`; số PR từ `Merge pull request #(\d+)` hoặc `\(#(\d+)\)$`. (4) `--write` → một dòng `nen-do` mỗi hồ sơ đỏ (khuôn thiết kế §5). (5) Bảng: mỗi hồ sơ một dòng; cuối «tồn đọng N hồ sơ không ghim · tổng giờ máy X»; dọn worktree tạm ở mọi lối thoát.

- [ ] **Step 1: Ca đỏ** GT1 (5 hồ sơ, tập bằng hiệu hai lượt chạy tay, không đổi byte), GT4 (4 ô), GT5 (3 ô + đối chứng dương), GT10 (năm chữ kết cục ghim, `--json`, HEAD/nhánh không đổi, cây bẩn → 2), bốn ca Review Focus.
- [ ] **Step 2: Chạy** → FAIL «khong co lenh giu tuoi».
- [ ] **Step 3: Viết `giu-tuoi.mjs`.**
- [ ] **Step 4: Chạy** GT1/4/5/10/rf* PASS.
- [ ] **Step 5: Commit** `feat(ho-so-da-ky-giu-tuoi): lệnh giữ tươi theo khoảng gộp`.

### Task 5: Chiều im trên mọi kho + tài liệu

independent: false (đo vật của Task 1–4) · phục vụ E8

**Files:**
- Create: `tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs` (GT8: mỗi kho trong {acceptance-gate-kit, crm-onehub, oneflow} có dưới `~/dev` — lưới không `--base`, thẻ, bản đồ của bản mới vs `git archive 43ed9e2b`, bỏ giờ chạy; kho vắng → «không có trên máy — bỏ»; mutant đảo mặc định khoá)
- Modify: `CONTEXT.md` (mục «Nhãn trạng thái» thêm «đỏ sẵn trên nền»; term mới «dòng nền đỏ» kèm _Avoid_: baseline), `GUIDE.md` §7.1 (lệnh giữ tươi: khi nào chạy, đọc bảng, bật khoá), `CHANGELOG.md` (mục chưa phát hành)

- [ ] **Step 1: Viết GT8**, chạy trên bản mới → PASS mọi kho có mặt, n > 0; mutant → FAIL nêu kho + dòng khác đầu tiên.
- [ ] **Step 2: Sửa tài liệu**; `node scripts/eval-coverage-lint.js .` không cảnh báo cho hồ sơ.
- [ ] **Step 3: Chạy trọn** `node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs` + `bo_cu` + `cac_kho`.
- [ ] **Step 4: Commit** `feat(ho-so-da-ky-giu-tuoi): chiều im trên bộ hồ sơ thật + tài liệu`; đặt hợp đồng `status: implemented`.
