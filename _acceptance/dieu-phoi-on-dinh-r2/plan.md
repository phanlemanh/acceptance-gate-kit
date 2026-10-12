# DP8 dieu-phoi-on-dinh-r2 — Kế hoạch thi công

> Thi công tuần tự trong phiên (T2, luật kit S3: không Gate 1.5). Mỗi task: viết ca đỏ trước (TDD), chạy thấy đỏ,
> viết vật, chạy thấy xanh, phá thử bản sao (khuôn MEASURE-BIRTH), commit.

**Goal:** Ba lỗ chặn đợt `r2` của crm — kiem-chuyen phân lớp + import tương đối; `ghi-danh`; việc nền ngoài dãy
giữ nhịp khoá không bị báo `khoa-khong-nhip`.

**Architecture:** Mô-đun mới `dieu-phoi/scripts/kiem-chuyen.mjs` (kiemChuyen dời từ dieu-phoi.mjs + phanLopChuyen);
bên viết `ghiDanhWorktree` + khoá ghi trong `hang.mjs`; dấu `cho-ghi-danh/` viết ở `moDotKq`, đọc ở `xetDay`
(tiep-tuc.mjs); luật miễn trong `baoKhoaKhongNhip` (phat-lich.mjs). CLI `dieu-phoi.mjs`: lệnh `ghi-danh`, đầu ra
mới của `xem --kiem-chuyen`.

**Tech Stack:** Node ESM, `node:test`, git CLI; gói không phụ thuộc ngoài (không bộ đọc YAML).

**Spec:** `_acceptance/dieu-phoi-on-dinh-r2/design.md` + `contract.md` + `evals.yaml`.

## Global Constraints

- Chỉ chạm `dieu-phoi/`, `tests/dieu-phoi/`, `_acceptance/dieu-phoi-on-dinh-r2/`, một khoá
  `executors.script.dieu_phoi_dp8_crm` trong `_acceptance/config.yaml`.
- Không đổi thân ca đã ký (DP1-13, DP1-06, DP3-03, DP3-10, DP3-10-do…); đổi thì một dòng sổ `fix` nêu tên ca.
- Mốc so «bản cũ» = tag `v2.27.0` (`a1e2e0b9`).
- Tên ca bắt đầu `DP8-`; tệp ca `tests/dieu-phoi/on-dinh-r2.test.mjs` (CI chạy glob `*.test.mjs`);
  `tests/dieu-phoi/dp8-crm-that.mjs` KHÔNG phải `.test.mjs`.
- `kiemChuyen(cwd)` giữ giao kèo trả MỌI dòng chuyển (chỉ thêm dòng import tương đối).

## Review Focus

1. Kho không có `_acceptance/config.yaml` hay không có `evals.yaml` nào → phanLopChuyen không ném (ca DP8-03 «kho
   không dòng chuyển» + DP1-13 kho thử tối giản).
2. `evals.yaml` khối eval mà `id` không phải khoá đầu tiên → bộ tách khối vẫn đúng (fixture DP8-01 đặt `criterion`
   trước `id` ở một khối).
3. Dòng `#` chú thích trong khối executors → phải sửa, không làm sập bộ đọc đường khoá (fixture DP8-01).
4. `ghi-danh` từ thư mục con của W (không phải gốc W) → ghi realpath gốc W (DP8-05 chạy từ `W/sub`).
5. `hang-viec.khoa` bị bỏ rơi bởi tiến trình chết → lệnh kế không treo quá 10″ (DP8-08 khoa-bo-roi).

---

### Task 1: kiem-chuyen.mjs — phân lớp + import tương đối (AC-1, AC-2) · phục vụ E1, E2 · independent: false (chung dieu-phoi.mjs với Task 2, 4)

**Files:** Create `dieu-phoi/scripts/kiem-chuyen.mjs`; Modify `dieu-phoi/scripts/dieu-phoi.mjs` (bỏ thân
kiemChuyen, `export { kiemChuyen, phanLopChuyen, DUONG_BAN_CU } from './kiem-chuyen.mjs'`); Test
`tests/dieu-phoi/on-dinh-r2.test.mjs` (DP8-01, DP8-01 khong-khai, DP8-01-do ×2, DP8-02, DP8-02-do).

**Interfaces — Produces:**
- `kiemChuyen(cwd): string[]` — như cũ + dòng import tương đối (khử trùng theo `<tệp>:<dòng>`).
- `phanLopChuyen(cwd): { phai_sua: string[], lich_su: { dong: string, lop: string }[] }`.
- `LOP_LICH_SU = ['khai-boi-kho','ho-so','eval-chet','eval-ngoai-lan-may','executor-chet','tai-lieu','lo-trinh']`.
- Bộ đọc nội bộ: `khoiEval(text)`, `duongKhoa(text)`, `docDanhSachKhoa(text, cha, con)`.

Verify: `node --test --test-name-pattern='DP8-0[12]' tests/dieu-phoi/on-dinh-r2.test.mjs` + `DP1-13`.

### Task 2: CLI `xem --kiem-chuyen` (AC-3) · phục vụ E3 · independent: false (sau Task 1)

**Files:** Modify `dieu-phoi/scripts/dieu-phoi.mjs` (khối `lenh === 'xem' && co['kiem-chuyen']`, chuỗi «dùng:»).
Test: DP8-03, DP8-03-do. Verify: DP8-03 + DP1-13.

### Task 3: đo trên crm thật (AC-4) · phục vụ E4 · independent: false (sau Task 1, 2)

**Files:** Create `tests/dieu-phoi/dp8-crm-that.mjs`; Modify `_acceptance/config.yaml` (một khoá
`dieu_phoi_dp8_crm: node tests/dieu-phoi/dp8-crm-that.mjs` cạnh `dieu_phoi_validate`).
Verify: `node tests/dieu-phoi/dp8-crm-that.mjs` thoát 0; `HOME=/tmp/x node …` với kho vắng → thoát 2.

### Task 4: ghi-danh + khoá ghi + dấu cho-ghi-danh (AC-5, AC-6, AC-8) · phục vụ E5, E6, E8 · independent: false (chung dieu-phoi.mjs với Task 1, 2)

**Files:** Modify `dieu-phoi/scripts/hang.mjs` (`voiKhoaHangViec`, `ghiDanhWorktree`, bọc `dayLen/themHang/choNghi`),
`dieu-phoi/scripts/dieu-phoi.mjs` (lệnh `ghi-danh`, `moDotKq` viết `cho-ghi-danh/<dãy>.json` cho dãy có worktree
không phải thư mục). Test: DP8-05, DP8-06 tu-choi, DP8-06 bat-bien, DP8-06-do, DP8-08 ×3, DP8-08-do ×2.

**Interfaces — Produces:**
- `ghiDanhWorktree(cwd, id, { nowMs }): { doi: boolean, day, worktree, thay: string|null, nhac: string|null }`.
- `THU_MUC_CHO_GHI_DANH = 'cho-ghi-danh'` (hang.mjs) — tiep-tuc.mjs đọc.
- `voiKhoaHangViec(thuMuc, fn)` — khoá thư mục `hang-viec.khoa`, chờ ≤ 10″, khoá > 30″ coi như bỏ rơi; trễ thử
  `DIEU_PHOI_TRE_GHI_MS` giữa đọc và ghi.
- **Consumes:** `keHoachDay(thuMuc, { nowMs })` của tiep-tuc.mjs (hành động của dãy — một nguồn «sống»).

### Task 5: keHoachDay đọc dấu + lời ghi danh mang lệnh ghi-danh (AC-7) · phục vụ E7 · independent: false (sau Task 4)

**Files:** Modify `dieu-phoi/scripts/tiep-tuc.mjs` (`xetDay`). Test: DP8-07 cho-ghi-danh, DP8-07 ma-tran-dau,
DP8-07-do bo-dau; DP3-03 xanh không đổi thân.

### Task 6: việc nền ngoài dãy giữ nhịp khoá (AC-9) · phục vụ E9 · independent: true

**Files:** Modify `dieu-phoi/scripts/phat-lich.mjs` (`baoKhoaKhongNhip` nhận `hangViec`; khoá của phiên ngoài dãy
còn sống khi mtime `khoa/<tn>/nhip` ≥ `cap_luc`). Test: DP8-09 viec-nen, DP8-09 thu-hoi, DP8-09-do; DP3-10 xanh.

### Task 7: tài liệu (AC-10) · phục vụ E10 · independent: false (sau Task 1–6)

**Files:** Modify `dieu-phoi/README.md`, `dieu-phoi/scripts/mau/LUAT.md`. Test: DP8-10, DP8-10-do; DP1-06 xanh.

### Task 8: ca đã ký không đổi thân (AC-11) · phục vụ E11, E12, E13 · independent: false (cuối)

**Files:** Test DP8-11 ca-da-ky, DP8-11-do so-thieu-ten, DP8-11 chon-moc (sao khuôn SDT-07 — không import tệp
`.test.mjs` khác vì `node:test` đăng ký lại ca). Verify: trọn suite `node --test "tests/dieu-phoi/**/*.test.mjs"`,
`node tests/dieu-phoi/kiem-validate.mjs`, `LB_CASES=LB1,LB2 node tests/plugins/lenh-bam-duoc.test.mjs`.
