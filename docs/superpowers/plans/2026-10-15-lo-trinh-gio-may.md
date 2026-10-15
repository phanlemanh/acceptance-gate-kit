# Lộ trình tính bằng giờ máy và token — kế hoạch dựng

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (vòng feature-loop chạy tuần tự trong phiên chính). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Lộ trình hiện giờ máy và % hạn mức tuần cho mỗi hàng và mốc, ngày mốc do máy tính, và mỗi vòng tự ghi giờ máy + token thật.

**Architecture:**
- Mô-đun thuần mới `scripts/gio-may.mjs` giữ mọi phép tính:
  - ước hàng;
  - tổng mốc;
  - dự báo ngày;
  - đọc số đo các hồ sơ.
- `scripts/lo-trinh.mjs` chỉ gọi mô-đun ấy ở bốn chỗ: kiểm khuôn, vẽ trang, `--xem`, `--mo-o`; thêm lệnh `--do-lech`.
- Script mới `scripts/do-vong.mjs` đọc bản ghi phiên và tệp đọc hạn mức, ghi dòng `gio-may` vào sổ chạy.

**Tech Stack:** Node ESM, không phụ thuộc mới. Ca đo: một tệp `tests/scripts/lo-trinh-gio-may.test.mjs` theo khuôn tệp ca của RM2.

**Spec:** `docs/superpowers/specs/2026-10-15-lo-trinh-gio-may-design.md` · hợp đồng `_acceptance/lo-trinh-gio-may/contract.md` ·
bộ đo `_acceptance/lo-trinh-gio-may/evals.yaml`.

## Global Constraints

- Trang lộ trình tất định: không đọc ngày hôm nay hay giờ máy khi vẽ.
- Khối dữ liệu máy đọc của trang (`lo-trinh-du-lieu`) KHÔNG đổi.
- Kho không có khoá `gio_may` và không hồ sơ đo: `--ra-soat`, `--ap --json`, `--mo-o` (stdout + ô cơ hội) giống từng
  byte bộ máy gốc.
- `--mo-o` không sửa `opportunity.md`; `du-bao.json` ghi một lần.
- Ước theo luật: T2 4–7 · T3 7–10 · không hạng / hạng ngoài bảng như T2 · hàng nhóm `phat-hanh` 1,5–2, không gộp.
  Gộp 1–1,5 mỗi hàng vòng. Cắt bản 1,5–2 ở mốc `phat-hanh` không có hàng `phat-hanh`.
- Số đo thay luật khi ≥ 5 vòng đã giao cùng hạng mang `gio_may` (p25–p75 theo thứ hạng gần nhất). % ước khi ≥ 5 vòng
  có `phan_tram_tuan` (trung vị theo hạng nếu đủ, không thì chung).
- Giờ chờ = trung vị giờ chờ đo của vòng đã giao; không vòng nào → 0 + «(chưa có giờ chờ đo)».
- Ngày dự kiến theo GIỮA khoảng; 24 giờ một ngày; bắt đầu từ 00:00 của ngày bắt đầu.
- Giờ máy đo = độ dài hợp khoảng (hai sự kiện liên tiếp cách ≤ 600 giây) trên dòng thời gian gộp, chỉ trong cửa sổ vòng.
- Số in cho người dùng dấu phẩy thập phân (`15,5`), gạch ngang `–` cho khoảng.

## Review Focus

1. Hàng không gắn mốc nào — không lỗi, không vào tổng mốc nào; `--xem` coi bắt đầu hôm nay khi là phụ thuộc.
2. Vòng `dung_tren` giữa mốc — không treo, không đệ quy vô hạn; mốc dính vòng in «không tính được (phụ thuộc vòng)».
3. Dòng `gio-may` hỏng JSON hay thiếu khoá trong sổ chạy — bỏ dòng ấy, không làm hỏng trang.
4. Bản ghi phiên có dòng hỏng JSON, thiếu `timestamp`, hay `usage` vắng — bỏ dòng, không ném.
5. Mốc không có `ngay` hợp lệ — tổng vẫn in, dòng ngày bỏ vế mục tiêu, không cờ quá tải.

---

### Task 1: Ước hàng + khoá `gio_may` + trang (AC-1, AC-2, AC-3)  — independent: false

**Files:**
- Create: `scripts/gio-may.mjs`
- Modify:
  - `scripts/lo-trinh.mjs` — `kiemKhuon` cờ khuôn; `CO_DICH` thêm dòng `gio-may-sai`; `suyTrangThai` gắn `gioMay`
    mỗi hàng; `bangViec` thêm cột «Giờ máy»; `mucLoTrinh` dòng đếm máy ước + dòng mốc giờ máy / dự báo đóng băng /
    cờ quá tải;
  - `_acceptance/config.yaml` (khoá đã có).
- Test: `tests/scripts/lo-trinh-gio-may.test.mjs` (ca GM-1, GM-1-doc-cu, GM-1-nang-kit, GM-1-do, GM-2*, GM-3*)

**Interfaces — Produces (`scripts/gio-may.mjs`):**
- `BANG_LUAT = { T2: [4, 7], T3: [7, 10], 'phat-hanh': [1.5, 2], gop: [1, 1.5], catBan: [1.5, 2] }`
- `kiemGioMay(v) → [lo, hi] | null` (null = sai kiểu)
- `docDoVong(root) → [{ slug, hang, daGiao, gio_may, gio_cho, phan_tram_tuan, ngayKy }]` — dòng `kind:"gio-may"`
  mới nhất của mỗi hồ sơ; `daGiao` do bên gọi gắn từ ô bản đồ
- `uocHang(r, doVong) → { khoang:[lo,hi], nguon:'khai'|'luat'|'do', nhan, phanTram:{gia|null, k}, laCatBan }`
- `tongMoc(m, dong, uoc) → { khoang:[lo,hi], phanTram:{gia|null, thieu}, coCatBan }`
- `soVN(x)`, `khoangVN([lo,hi])` — in số kiểu Việt

- [ ] Viết ca GM-1/2/3 (kho thử do code sinh, giá trị viết sẵn), chạy → đỏ vì thiếu mô-đun.
- [ ] Viết `gio-may.mjs` + chỗ gọi trong `lo-trinh.mjs`.
- [ ] Ca đỏ trên bản sao (nhát tiêm khớp đúng một lần): nhận chuỗi; đếm hồ sơ chưa giao; bỏ gộp; đọc hôm nay khi vẽ;
  cắt bản hai lần.
- [ ] Chạy `node tests/scripts/lo-trinh-gio-may.test.mjs` → GM-1..3 PASS; `node tests/scripts/lo-trinh.test.mjs`,
  `node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs`, `node tests/scripts/ra-soat-lo-trinh.test.mjs` → xanh (LO-TRINH.html
  của kit vẽ lại bằng `node scripts/product-map.mjs --root .`).
- [ ] Commit.

### Task 2: Ngày dự kiến ở `--xem` + đóng băng ở `--mo-o` (AC-4, AC-5) — independent: false

**Files:** Modify `scripts/gio-may.mjs` (`duBao`), `scripts/lo-trinh.mjs` (`xemBanDo` thêm khối «Giờ máy», nhánh `--mo-o`
ghi `du-bao.json`). Test: GM-4*, GM-5*.

**Interfaces — Produces:**
- `duBao({ kq, today, doVong }) → Map<moc, { bat_dau, hoan_tat, gio_may:[lo,hi], gio_cho, gio_cho_do, muc_tieu, qua_tai, vong:false }>`
- `dongMoc(ten, d) → string` theo khuôn
  `<mốc>: bắt đầu ~dd/mm · ~X giờ máy · ~Y % hạn mức tuần · hoàn tất dự kiến dd/mm · mục tiêu dd/mm`
- `duBaoHoSo({ kq, ma, today, doVong }) → { ngay_tinh, hang:{ma,gio_may,phan_tram}, moc?:{...} }`

- [ ] Ca GM-4/5 + đỏ (bỏ phụ thuộc; tính đủ hàng đang dở; ghi đè du-bao) → đỏ.
- [ ] Viết; chạy lại bốn tệp ca của Task 1 + GM-4/5 → xanh.
- [ ] Commit.

### Task 3: Đo vòng + % hạn mức (AC-6, AC-7) — independent: false

**Files:** Create `scripts/do-vong.mjs`. Test: GM-6*, GM-7*.

**Interfaces — Produces:**
- CLI `do-vong.mjs --root <r> --slug <s> [--write] [--projects <dir>]` (mặc định `$CLAUDE_PROJECTS_DIR` hoặc
  `~/.claude/projects`) → in dòng JSON; `--write` nối vào `_acceptance/<s>/run-log.jsonl`.
- CLI `do-vong.mjs --doc-han-muc <0..100> --dat-lai <ISO>` → nối một dòng vào `$HAN_MUC_TEP` hoặc
  `~/.claude/acceptance-gate/han-muc.jsonl`; sai → thoát 2.
- Dòng: `{"ts","kind":"gio-may","cua_so":{"tu","den"},"nguon":[...]|"khong-co-ban-ghi","gio_may","gio_cho","token":{<model>:{vao,ra,doc_dem,ghi_dem}},"phan_tram_tuan","ty_le","khoang_doc","ly_do"}`
- Trọng số quy đổi theo giá niêm yết tương đối, hằng `TRONG_SO` trong `do-vong.mjs` (tra bảng giá ở skill claude-api lúc dựng).

- [ ] Ca GM-6/7 (bản ghi giả do code sinh; GM-6-that trên bản ghi thật hoặc SKIP có tên) + đỏ → đỏ.
- [ ] Viết; chạy → xanh. Commit.

### Task 4: `--do-lech` + SKILL + tài liệu (AC-8, AC-9) — independent: false

**Files:**
- Modify:
  - `scripts/lo-trinh.mjs` — `--do-lech`;
  - `feature-loop/skills/feature-loop/SKILL.md` — khối `S4-DO-VONG` sau đoạn thuoc-vat ở «Mọi verdict» + câu đọc hạn
    mức ở S0;
  - `road-map/commands/xem.md`;
  - `GUIDE.md` §khuôn tệp lộ trình;
  - `CONTEXT.md` nếu cần term.
- Test: GM-8*, GM-9*.

- [ ] Ca + đỏ; viết; chạy toàn bộ tệp ca → xanh; `bash tests/plugins/run-tests.sh` vùng chạm SKILL (P85, khối marker) → xanh.
- [ ] Commit.

### Task 5: Hạt giống + vẽ lại trang kit + đóng S3 — independent: false

- [ ] Hạt giống `docs/plans/2026-10-15-hat-giong-khoi-du-lieu-gio-may.md` (OOS-1) với `Gốc:` trỏ `_acceptance/lo-trinh-gio-may/`.
- [ ] Vẽ lại `LO-TRINH.html`, `PRODUCT-MAP.md`; contract `status: implemented`; commit; vào S4.
