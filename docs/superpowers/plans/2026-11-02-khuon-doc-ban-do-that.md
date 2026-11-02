# Bước chấm khuôn đọc đúng bản đồ thật (khuon-doc-ban-do-that) — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kho đã khai bản đồ khuôn được bước chấm đọc đúng ba cách viết khuôn tệp cho phép — ngoại lệ `khoi` dạng danh sách, lớp trình bày đã khai, glob ở `nhan_dien.tep`.

**Architecture:** Sửa hai tệp vật đã có (`scripts/ban-do-khuon.cjs` chuẩn hoá; `scripts/design-floor-khuon.mjs` in nhãn trọn) và khuôn tệp `skills/acceptance/references/ban-do-khuon-template.md`. Không tệp mới ngoài ca đo đã commit đỏ (`tests/scripts/khuon-doc-ban-do-that.test.mjs`). Không chạm `lib/`, `hooks/`, `pre-merge-check.sh` (giữ T2).

**Tech Stack:** Node ≥ 20, CJS + ESM thuần; bộ kiểm script node in `PASS: [KD-…]`.

**Spec:** `_acceptance/khuon-doc-ban-do-that/design.md` · hợp đồng `contract.md` (AC-1…AC-7, Hỏi-1 = miễn đúng tên đã khai) · ca đo `evals.yaml` (E1…E7).

## Global Constraints

- Ba nhát tiêm của ca đỏ phải khớp ĐÚNG MỘT lần trong `scripts/ban-do-khuon.cjs`:
  - `khoiCua(x.khoi)` (tách danh sách khối)
  - `const tenDung = [ten, ...(nhom.khuon.lop_trinh_bay || [])];` (tên được tính là dựng khuôn)
  - `thêm nhan_dien.tep: [glob]` (lời nhắc chỗ đặt glob)
- Ngoại lệ chuẩn hoá giữ thứ tự khoá `{tep, khoi, ly_do}`, `khoi` luôn là chuỗi; danh sách rỗng giữ đúng hành vi hôm nay (một mục `khoi: ''`, không miễn gì — OOS-4).
- `khuon` chuẩn hoá thành `{ten, nhap, lop_trinh_bay: string[]}` — hợp `khuon.lop_trinh_bay` rồi khoá cấp đầu `lop_trinh_bay`, bỏ trùng, giữ thứ tự gặp.
- Nhãn khe vẫn mang `khuon.ten`: `lệch: <tệp> · <ten> thiếu khe <khe> · nhóm <n>` dù thẻ là lớp trình bày.
- Dòng không đo của nhóm: `không đo được: nhóm <n> — <khong_doc_duoc trọn>`; nhãn vẫn chứa cụm `nhan_dien dạng sổ đăng ký` (KL-6 so chuỗi con).
- Khoá cấp đầu `tep`: cờ vàng nói glob đặt ở `nhan_dien.tep`, KHÔNG đọc như glob, KHÔNG kèm cờ «khoá lạ: tep».
- Kho không khai `design/patterns/`: không đổi một byte (bộ `KL-*` xanh nguyên).
- Ẩn danh DP1-07 trước mỗi lần đẩy.

## Review Focus

- `khoi` là danh sách có phần tử không phải chuỗi (số, `null`) → mỗi phần tử thành chuỗi; `null` thành `''` không miễn gì. Phủ bởi bộ đọc `String(k ?? '')`; không thêm ca (ngoài phạm vi khuôn tệp).
- Lớp trình bày trùng `khuon.ten` → bỏ trùng, không đếm hai lần. Phủ bởi bước hợp bỏ trùng.
- `lop_trinh_bay` cấp đầu là đối tượng (sai kiểu) → bỏ qua, không sập; giữ cờ? Không — `mang()` trả `[obj]`, lọc chỉ chuỗi.
- Khe của thẻ lớp trình bày dò qua `ns.LopTB` → cùng đường `cucBo` với khuôn; ca KD-4 hàng «nhập ns.LopTB» phủ dò khuôn, dò khe dùng cùng mảng.
- Kho có `nhan_dien.tep` VÀ `tep` cấp đầu → đọc `nhan_dien.tep`, vẫn nổi cờ cho `tep` cấp đầu.

---

### Task 1: Ngoại lệ dạng danh sách (AC-1, AC-2, AC-3)

**Files:** Modify `scripts/ban-do-khuon.cjs:156` · Test `tests/scripts/khuon-doc-ban-do-that.test.mjs` (KD-1, KD-2, KD-2-do, KD-3)

- [ ] Chạy `KD_CASES=KD-1,KD-2,KD-3 node tests/scripts/khuon-doc-ban-do-that.test.mjs` — KD-1, KD-2 FAIL «ngoại lệ dạng danh sách không được miễn».
- [ ] Thêm `khoiCua(v) → string[]`: mảng khác rỗng → `v.map(k => String(k ?? ''))`; còn lại → `[mảng rỗng hay null ? '' : String(v)]`. `ngoaiLe` dùng `flatMap` với `khoiCua(x.khoi).map(khoi => ({tep, khoi, ly_do}))`.
- [ ] Chạy lại — KD-1, KD-2, KD-3 PASS.

### Task 2: Lớp trình bày đã khai (AC-4, AC-5)

**Files:** Modify `scripts/ban-do-khuon.cjs` (`docBanDo` chuẩn hoá `khuon`; `lechTrongTep` dòng 276–277) · Test KD-4, KD-4-do, KD-5

- [ ] Chạy `KD_CASES=KD-4,KD-5` — KD-4 FAIL «tệp dựng lớp trình bày bị báo thiếu khuôn».
- [ ] `docBanDo`: `lop_trinh_bay` = hợp (bỏ trùng, chỉ chuỗi, bỏ tên bằng `ten`) của `y.khuon.lop_trinh_bay` rồi `y.lop_trinh_bay`.
- [ ] `lechTrongTep`: `const tenDung = [ten, ...(nhom.khuon.lop_trinh_bay || [])];` rồi `cucBo` = với mỗi tên: tên cục bộ từ `goc` + `${ns}.${tên}`.
- [ ] Chạy lại — KD-4, KD-5 PASS.

### Task 3: Lời nhắc chỗ đặt glob (AC-6)

**Files:** Modify `scripts/ban-do-khuon.cjs:22` và vòng khoá lạ · `scripts/design-floor-khuon.mjs:103` · Test KD-6, KD-6-do

- [ ] `KHONG_DOC_SO_DANG_KY` = `nhan_dien dạng sổ đăng ký — thêm nhan_dien.tep: [glob] để bước chấm biết tệp nào thuộc nhóm`.
- [ ] Khoá cấp đầu `tep` → cờ `<tệp>: tep cấp đầu không được đọc — glob tệp của nhóm đặt ở nhan_dien.tep`, thay cờ «khoá lạ: tep».
- [ ] `design-floor-khuon.mjs`: `ra.khong_do.push(\`nhóm ${n.nhom} — ${n.khong_doc_duoc}\`)`.
- [ ] Chạy `KD_CASES=KD-6` — PASS.

### Task 4: Khuôn tệp + đầu-cuối (AC-7) + chiều đỏ + suite cũ

**Files:** Modify `skills/acceptance/references/ban-do-khuon-template.md` (đoạn lõi, mở rộng, `nhan_dien`) · Test KD-7, mọi ca `-do`, `tests/scripts/khuon-loi.test.mjs`

- [ ] Khuôn tệp: `ngoai_le[].khoi` một tên hay danh sách; `lop_trinh_bay` (trong `khuon` hay cấp đầu, một tên hay danh sách) = thành phần khuôn bọc, tệp dựng thẳng nó tính là theo khuôn, kho cần bắt thì không khai hoặc đưa vào `cam_ngoai_khuon`; glob đặt ở `nhan_dien.tep`.
- [ ] Chạy trọn `node tests/scripts/khuon-doc-ban-do-that.test.mjs` — 11/11 PASS.
- [ ] Chạy `node tests/scripts/khuon-loi.test.mjs` — xanh nguyên.
- [ ] Commit `fix(khuon-doc-ban-do-that): …`.

### Task 5: Số SAU trên bản sao crm (Đường đo)

- [ ] Bản sao dùng một lần của crm `7341a193` ở scratchpad, hai cấu hình mốc gốc (glob hẹp · glob cả thư mục); chạy `design-floor-khuon.mjs --kiem` của cây này; ghi số vào design.md §5 (ẩn danh tên tệp). Không commit tệp crm.
