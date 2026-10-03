# Làn ghim lại giữ trọn lời lỗi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`).

**Goal:** Lệnh đỏ trong làn ghi trọn nhật ký; làn đỏ (`--write`) để một dòng `repin-do` mỗi slug kèm tải máy; dòng `repin` mang `wall_s` + `so_lenh`.

**Architecture:** Mọi sửa nằm trong `feature-loop/scripts/repin-lane.mjs` + mô-đun mới `feature-loop/scripts/tai-may.mjs`. Bộ đọc sổ không sửa (đo im 03/10).

**Tech Stack:** Node ≥18 ESM; bộ răng `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang.sh` + `rang/*.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-03-lan-ghim-lai-giu-tron-loi-loi-design.md` · hợp đồng AC-1…AC-7.

## Global Constraints

- Mã thoát làn không đổi ở mọi ca (0 · 1 · 2 · 3).
- Dấu `repin-do` chỉ ghi khi `--write`; tệp nhật ký `.acceptance-runs/<slug đầu>/repin-<run_id>/NN-<nhãn>.log` ghi ở mọi chế độ, chỉ cho lệnh thoát khác 0.
- `run_id` sinh TRƯỚC lệnh đầu (thư mục nhật ký cần nó); `ts` của dòng giữ là lúc kết thúc như cũ.
- Đường `log` tương đối gốc kho (`--root`); ca không có lệnh đỏ → `log: null` + `ly_do`.
- Đọc tải không bao giờ ném lỗi ra ngoài `tai-may.mjs`.

## Review Focus

- Nhãn lệnh chứa `/`, khoảng trắng, ký tự Unicode → tên tệp an toàn (`[^\w.-]` → `-`, cắt 60 ký tự) — ca trong Task 2.
- Lệnh trùng (gộp một lần) đỏ → một tệp nhật ký, mọi eval trỏ cùng tệp — ca trong Task 3.
- Làn có `--skip-unchanged` bỏ qua → không tệp, không dấu — ca trong Task 2 (E2).
- Kho không có thư mục `.acceptance-runs/` và không ghi được (quyền) → làn vẫn đỏ với mã 1, dấu ghi `log: null` + `ly_do: khong-ghi-duoc` — ca trong Task 3.
- Hai slug, slug thứ hai không có run-log.jsonl → tạo tệp mới với đúng một dòng — ca trong Task 3.

---

### Task 1: Mô-đun tải máy (E6) — independent: true
**Files:** Create `feature-loop/scripts/tai-may.mjs`; Create `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-tai-may.mjs`.
**Produces:** `export const NGUON_SWAP = { mac: ['sysctl', '-n', 'vm.swapusage'], linux: '/proc/meminfo' }` · `export function swapTuMeminfo(text): number|null` (MB) · `export function swapTuSysctl(text): number|null` · `export function docTai(): {load1,load5,ncpu,mem_free_mb,swap_used_mb,nen}`.
- [ ] Chân đỏ (bảng ba dòng meminfo, máy đang chạy, bản sao nguồn không tồn tại, mutant không bắt lỗi) → chạy → ĐỎ (mô-đun vắng).
- [ ] Cài mô-đun; chân xanh; commit.

### Task 2: Nhật ký trọn (E1, E2) — independent: false
**Files:** Modify `repin-lane.mjs` `runCmd` (~dòng 238) + sinh `runId` sớm (~dòng 416); `.gitignore` thêm `.acceptance-runs/`; Create `rang/kho-mau.mjs`, `rang/chan-nhat-ky.mjs`, `rang.sh`.
**Produces:** `runCmd(cmd, label) → exit` ghi `nhatKy.set(cmd, relPath)` khi exit ≠ 0; `const nhatKy = new Map()`.
- [ ] Chân đỏ E1 (200 dòng, > 1 MiB dấu dòng đầu, mutant 30 dòng) + E2 (xanh không tệp, đối chứng dương, mutant mọi lệnh) → ĐỎ.
- [ ] Cài: `spawnSync` giữ `maxBuffer` 256 MiB; khi exit ≠ 0 ghi `=== stdout ===\n…\n=== stderr ===\n…`; in `    nhật ký trọn: <rel>`; giữ in 30 dòng cuối. Chân xanh; commit.

### Task 3: Dấu lượt đỏ (E3, E4, E7) — independent: false
**Files:** Modify khối `if (red)` (~dòng 469); Create `rang/chan-dau-do.mjs`, `rang/bo-doc.mjs` (bảng cách gọi mọi bộ đọc run-log rút bằng grep), `rang/ban-base.mjs`.
**Produces:** dòng `{"ts","kind":"repin-do","run_id","sha","suites_exit","evals_exit","lenh_do":[{"cmd","exit","log","ly_do"?}],"cham":[…],"wall_s","so_lenh","tai"}` append vào run-log từng slug khi `--write`; thông điệp đỏ «LÀN ĐỎ — không ghi pin; dấu lượt đỏ ở run-log của N hồ sơ» (có `--write`) / «LÀN ĐỎ — không ghi gì» (không `--write`).
- [ ] Chân đỏ E3 (ba nguyên nhân × hai slug, log mở được + dấu riêng, ba mutant), E4 (bộ đọc rút từ mã, đối chứng dương từng hàng), E7 (năm mã ghim + vi phân base) → ĐỎ ở E3.
- [ ] Cài; cập nhật hai test đang ghim chuỗi «LÀN ĐỎ — không ghi gì» chạy KHÔNG `--write` (giữ nguyên) — chạy `node tests/scripts/chup-ho-so-da-thong.test.mjs` và `node tests/scripts/repin-lane-skip-unchanged.test.mjs` xác nhận. Chân xanh; commit.

### Task 4: Thời lượng (E5) — independent: false
**Files:** Modify dòng `line` (~dòng 448) + `REPIN-TEMPLATE` trong `feature-loop/skills/feature-loop/SKILL.md`; Create `rang/chan-thoi-luong.mjs`.
**Produces:** khoá `wall_s` (một số lẻ) + `so_lenh` (= `results.size`) đứng SAU `evals_exit`, TRƯỚC ba khoá tuỳ chọn.
- [ ] Chân đỏ (ngủ 3+2, ba mutant, ca biên không `--write`) → ĐỎ; cài; `node tests/scripts/repin-lane.test.mjs` (LN5) xanh; commit.

### Task 5: Tài liệu
**Files:** `feature-loop/skills/feature-loop/SKILL.md` (đoạn nghi thức re-pin: «đỏ → không ghi pin, để dấu lượt đỏ + nhật ký trọn»), `GUIDE.md` §7.1, `CHANGELOG.md`.
- [ ] Sửa; `bash tests/scripts/run-tests.sh` + `bash tests/plugins/run-tests.sh` không đỏ mới; commit.
