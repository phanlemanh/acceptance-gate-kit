# Câu cho người gửi — Implementation Plan

> **For agentic workers:** vòng T2 của feature-loop — thực thi TUẦN TỰ trong phiên chính (mọi task chung
> `scripts/tin-hieu.mjs` và `tests/scripts/tin-hieu.test.mjs`, không task nào `independent`). Checkbox để theo dõi.

**Goal:** Mỗi bản ghi đường đi tín hiệu mang thêm `cau_nguoi_gui` — câu tiếng sản phẩm không mã, không từ nội
bộ — kèm phép kiểm `--cau`, luật đọc lùi + cờ vàng, và đo trên dữ liệu thật crm.

**Architecture:** Mọi mã ở `scripts/tin-hieu.mjs` (bộ vẽ đường đi đã có). Khuôn câu trong mã cạnh `CAU`;
danh sách từ cấm ở khối marker của khuôn tín hiệu; cụm tình trạng theo nhóm tiến độ import từ
`scripts/lo-trinh.mjs` (không sửa tệp đó). Ca đo `CN-…` thêm vào tệp ca có sẵn, dùng lại bộ dựng kho thử.

**Tech Stack:** Node ESM, không phụ thuộc mới.

**Spec:** `docs/superpowers/specs/2026-10-12-cau-tin-hieu-nguoi-gui-design.md` · hợp đồng + phép đo:
`_acceptance/cau-tin-hieu-nguoi-gui/`.

## Global Constraints

- KHÔNG sửa `scripts/lo-trinh.mjs`, `scripts/ho-so-tom-tat.cjs`, `scripts/evidence-page.js`, `dieu-phoi/**`,
  `feature-loop/scripts/**`, `feature-loop/workflows/**`, `scripts/gate-card.js`, `lib/**`, `hooks/**`.
- `cau` và mọi trường cũ của bản ghi giữ nguyên từng byte; `cau_nguoi_gui` đứng CUỐI `TRUONG_DUONG`.
- Ca `TH-…` của hồ sơ L3 không đổi một byte; ca mới tiền tố `CN-`.
- Tài liệu khối dữ liệu: chỉ sửa đoạn khoá `tin_hieu` (PR #324/#325 sửa đoạn khác).
- Mọi chữ hiện cho người: tiếng Việt, tiếng sản phẩm (luật N1–N6).

## Review Focus

1. Tên nhóm / lý do do phiên gom viết có dấu nháy kép `"` bên trong → câu vẫn một dòng, không vỡ JSON (JSON.stringify lo) — ca CN-1 dùng tên nhóm có dấu.
2. Câu giao bọc «» lồng («a «b» c») → bỏ đúng một cặp ngoài (`boNgoacNgoai`) — ca CN-1 có một câu giao lồng.
3. Mã việc trùng tiền tố mã khác («K2» và «K2b») → ranh giới từ không báo nhầm «K2» trong «K2b» — ca CN-5 thêm ca im.
4. Kho không khai lộ trình (chỉ có bản gom) → không hàng nào, câu nhóm vẫn ra «nhóm chưa thành việc», `--cau` không ném — ca CN-5 chạy thêm trên một kho không có tệp lộ trình.
5. `--cau` trên kho không khai cửa → thoát 2 «kho chưa khai cửa tín hiệu» như ba lệnh cũ — CN-5 kiểm.

---

### Task 1: Câu cho người gửi trong bộ vẽ đường đi

**Files:** Modify `scripts/tin-hieu.mjs` · Test `tests/scripts/tin-hieu.test.mjs` (ca CN-1, CN-1-do, CN-1-do2,
CN-2, CN-2-do, CN-3, CN-3-do, CN-4, CN-4-do) · phục vụ E1, E2, E3, E4.

**Interfaces — Produces:**
- `export const CAU_NGUOI_GUI` — `{ [cho]: (x, c) => string }`, `c = { cauGiao, tinhTrang }` (chuỗi đã sạch «»).
- `export function tinhTrangCua(chu, ngay, sections)` → `{ nhom: 'da-giao'|'dang-lam'|'chua-bat-dau'|'khac', cum }`.
- `export function ngayKy(root, slug)` → `'n/t/năm' | null` (null cả khi không có chữ ký lẫn khi đọc không ra).
- `export function chuKyKhongNgay(root, slug)` → giá trị chữ ký khi có chữ ký mà không rút được ngày, ngược lại `null`.
- `TRUONG_DUONG` thêm `'cau_nguoi_gui'` ở cuối; mỗi bản ghi `duongDi` có `cau_nguoi_gui`.

- [ ] Viết ca CN-1…CN-4 (+ đỏ) theo `evals.yaml` E1–E4; chạy `TH_CASES=CN-1,CN-2,CN-3,CN-4 node tests/scripts/tin-hieu.test.mjs` → FAIL (chưa có trường).
- [ ] Cài: `cauGiao` của hàng = `boNgoacNgoai(d.cau_giao)`; của việc phủ = `boNgoacNgoai(feature)` từ `trangThaiHoSo`; `tinhTrang` theo bảng design §4 (khoá ô = tra ngược tiêu đề trong `sections`); ngày theo design §3.
- [ ] Chạy lại CN-1…CN-4 + toàn bộ `node tests/scripts/tin-hieu.test.mjs` (TH không đổi) → PASS.
- [ ] Commit.

### Task 2: Phép kiểm câu `--cau` + khối từ cấm

**Files:** Modify `scripts/tin-hieu.mjs`, `skills/acceptance/references/tin-hieu-template.md` (khối
`TIN-HIEU-CAU-CAM`) · Test ca CN-5, CN-5-do, CN-5-do2, CN-6, CN-6-do, CN-6-do-tt, CN-6-do2, CN-6-do3, CN-6-do4 · phục vụ E5, E6.

**Interfaces — Produces:**
- `export function napCam(tep = TEP_KHUON)` → `[{ tu, khung: boolean }]`, ném khi khối vắng/rỗng (nêu `TIN-HIEU-CAU-CAM`).
- `export function boMa(root, khai)` → `{ kiem: string[], boQua: { [lyDo]: string[] } }`.
- `export function kiemCau({ root, classify, sections, cam = napCam() })` → `{ loi: string[], soCau, soKiem, boQua }`.
- CLI `--cau`: 0 / 1 / 2 như design §5.
- `khungCua(x, c)` (nội bộ): câu dựng lại với chữ từ dữ liệu thay bằng dấu canh `\u0000` rồi gỡ.

- [ ] Viết ca theo E5, E6 → FAIL.
- [ ] Cài khối cấm trong khuôn (từ thường: lượt gom, bản gom, cắt lượt, bản phạm vi, chân trời, slug; khung: hồ sơ, gom, lẻ, lượt, hàng, lộ trình) + `--cau`.
- [ ] Chạy CN-5, CN-6 + toàn tệp → PASS. Commit.

### Task 3: Đường đọc-cũ + cờ vàng + tài liệu

**Files:** Modify `scripts/tin-hieu.mjs` (`cauChoNguoiGui`), `skills/acceptance/references/lo-trinh-du-lieu.md`
(đoạn khoá `tin_hieu`), `CONTEXT.md` (term «Câu cho người gửi») · Test CN-7, CN-7-do · phục vụ E7.

**Interfaces — Produces:** `export function cauChoNguoiGui(banGhi)` → `{ cau: string, co: string|null }`;
`export const CO_BAN_VE_CU` (chuỗi cờ vàng, chứa «bản vẽ cũ»).

- [ ] Viết CN-7 → FAIL. Cài + tài liệu. PASS (cả TH-8). Commit.

### Task 4: Skill gom chạy phép kiểm câu

**Files:** Modify `skills/gom-tin-hieu/SKILL.md` (khối `GOM-CAU` sau `GOM-RANG`, trước «## Bước 4 — chuyển cho
cắt lượt») · Test CN-8, CN-8-do · phục vụ E8.

- [ ] Viết CN-8 → FAIL. Thêm khối + câu «tên nhóm và lý do hiện nguyên văn cho người gửi». PASS (cả TH-9). Commit.

### Task 5: Dữ liệu thật crm + tệp mẫu câu + executor

**Files:** Create `_acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs`, `_acceptance/cau-tin-hieu-nguoi-gui/mau/cau-mau.json`
(sinh bằng `--ghi`) · Modify `_acceptance/config.yaml` (cạnh `tin_hieu_vang`: `executors.test.tin_hieu_cau`;
mục `script:`: `executors.script.cau_crm`) · phục vụ E9, đầu vào E10.

- [ ] Viết `do-crm.mjs`: `--crm <kho> --sha <sha> [--ghi]`; bản sao `git archive` (đường suy từ vị trí script cho gốc kit); chọn việc đầu tiên mỗi nhóm tiến độ; in PASS: CRM-xanh / CRM-mau / CRM-do.
- [ ] `--ghi` một lần → commit `mau/cau-mau.json`; chạy không `--ghi` → 3 PASS. Commit.

### Task 6: Khép S3

- [ ] `node tests/scripts/tin-hieu.test.mjs` (TH + CN), `node tests/scripts/lo-trinh.test.mjs`, `node scripts/product-map.mjs --root . --check`.
- [ ] Contract `status: implemented`, commit, sang S4.
