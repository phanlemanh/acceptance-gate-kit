# Vòng mở không mất dấu (GT2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dấu máy của kênh không mất khi đồng bộ chen giữa, hạn sai bị từ chối, đáp yêu cầu kiểu cũ tới đúng người hỏi.

**Architecture:** Dấu máy kênh sang một tệp chỉ-thêm `<tệp kênh>.may.jsonl` (đọc gộp với `may_su` cũ); `dongBo` đọc lại
tệp trạng thái ngay trước khi ghi và chỉ thay phần của mình. Lệnh `tin` kiểm hạn trước mọi bước ghi; đáp yêu cầu kiểu cũ
bằng XONG/TRẢ chuyển qua `ghiTraLoi` của `ghi.mjs`.

**Tech Stack:** Node ESM, `node:test`, gh giả `tests/dieu-phoi/gh-gia.mjs`, bộ dựng `tests/dieu-phoi/tin-kho-thu.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-19-vong-mo-khong-mat-dau-design.md` · hợp đồng `_acceptance/vong-mo-khong-mat-dau/contract.md` · `evals.yaml`.

## Global Constraints

- Mọi lệnh `tin` từ chối thì: stderr nêu điều sai, thoát 1, 0 byte ghi (header `dieu-phoi/scripts/tin.mjs`).
- Thông điệp hạn sai, nguyên văn: `--<cờ> phải là số phút nguyên dương, nhận «<giá trị gõ>»` (cờ `han` | `han-xong`).
- Thông điệp yêu cầu kiểu cũ: chứa `<id>`, `yêu cầu kiểu cũ`, `tin XONG`, `tin TRẢ`.
- Máy không bao giờ tự ghi `ket_qua: "duyet"`; mặc định XONG = `da-tra-loi`, TRẢ = `tra-lai`.
- Tệp dấu máy tên kết bằng `.may.jsonl` (không khớp `/^kenh-.+\.json$/` của bộ quét kênh).
- Tên ca mới `GD-01…GD-10` (+ `-do <tên>`) trong `tests/dieu-phoi/tin-khong-mat-dau.test.mjs`; ca đỏ chạy hàm đo trên
  `banSao(...)` sau khi bản lành xanh; ma trận in bằng `inMaTran`.
- Sha ghim bản đời trước cho GD-03: `33c9e64f`.
- Khoá executor mới (chỉ thêm khoá, trong `_acceptance/config.yaml`): `executors.test.dieu_phoi_tin_gd` cùng khuôn
  `dieu_phoi_tin`, grep `ok [0-9]+ - GD-`.

## Review Focus

- Hai tiến trình append cùng lúc vào `.may.jsonl` → không dòng nào hỏng (một lần `appendFileSync` một dòng) — GD-01 chạy hai hook.
- Tệp `.may.jsonl` có dòng hỏng (ghi dở) → bộ đọc bỏ dòng ấy, không ném — GD-03 thêm một dòng rác.
- `--han` có khoảng trắng (`" 30"`) → từ chối (khuôn `^[1-9]\d*$` trên chuỗi gốc) — thêm vào ma trận GD-05 hàng `" 30"`.
- Đồng bộ khi tệp trạng thái bị xoá giữa chừng → đọc lại trả rỗng, ghi lại bản hợp lệ — không đo riêng (Later).
- XONG yêu cầu kiểu cũ khi `tra-loi/` chưa tồn tại → `ghiJsonNguyenTu` tự tạo thư mục — GD-07 dùng đợt mới không có tra-loi.

---

### Task 1: Dấu máy chỉ-thêm + đồng bộ không đè (AC-1…AC-4)

**Files:**
- Modify: `dieu-phoi/scripts/tin-noi-chua.mjs` (thêm cặp hàm dấu máy kênh)
- Modify: `dieu-phoi/scripts/tin-kenh.mjs` (`dongBo`, `noiChuaKenhCua().nc`)
- Modify: `dieu-phoi/scripts/tin-dua.mjs` (`cacMinh().nc`)
- Modify: `tests/dieu-phoi/gh-gia.mjs` (khoá `tre_ms` + mốc `moc-doc-bat-dau`, `moc-doc-tra-ve`)
- Modify: `tests/dieu-phoi/tin-kho-thu.mjs` (`ghGia({treMs})`, `chayCanhNenGoc(gocGoi, cwd, gh)`, `choTep(p, ms)`)
- Create: `tests/dieu-phoi/tin-khong-mat-dau.test.mjs` (GD-01…GD-04 + ca đỏ)
- Modify: `_acceptance/config.yaml` (khoá `executors.test.dieu_phoi_tin_gd`)

**Interfaces:**
- Produces: `tepMayKenh(pTrangThai: string) => string` (thay `.json` bằng `.may.jsonl`); `docMayKenh(pTrangThai) => object[]`
  (= `may_su` của JSON ∪ dòng hợp lệ của tệp chỉ-thêm); `themMayKenh(pTrangThai, o) => void` (một `appendFileSync`).
- `dongBo(p, k, {tranMs})` giữ chữ ký và giá trị trả.

- [ ] Viết GD-01 (3 hàng a/b/c, chứng ba mốc), GD-02 (2 hàng), GD-03 (3 hàng, đối chứng dương `may_su` đời trước, bản
  cũ dựng bằng `git archive 33c9e64f dieu-phoi`), GD-04 (4 hàng); ca đỏ GD-01-do ghi-vao-json, GD-02-do dong-bo-ghi-de,
  GD-03-do bo-doc-cu, GD-03-do quet-nham, GD-04-do thay-dong — đúng `expected` của E1–E4.
- [ ] Chạy `node --test tests/dieu-phoi/tin-khong-mat-dau.test.mjs` → GD-01..04 FAIL trên vật hiện tại (dấu mất).
- [ ] Cài ba hàm, chuyển hai `nc.them` sang `themMayKenh`, hai `nc.doc` sang `docMayKenh`; `dongBo` đọc lại trạng thái sau
  lời gọi mạng, hợp `dong` theo id, `con_tro` = id lớn nhất, giữ mọi trường khác của bản đọc lại.
- [ ] Chạy lại → GD-01..04 và các ca đỏ PASS; `node --test tests/dieu-phoi/tin.test.mjs` (GT1) vẫn `# fail 0`.
- [ ] Commit.

### Task 2: Hạn chỉ nhận số phút nguyên dương (AC-5, AC-6)

**Files:** Modify `dieu-phoi/scripts/tin.mjs` (`gui`); Test: GD-05, GD-06 trong tệp ca.

**Interfaces:** Produces `phutNguyenDuong(co: object, khoa: 'han'|'han-xong', macDinh: number|null) => number|null`, ném `LoiTin` với thông điệp ở Global Constraints.

- [ ] Viết GD-05 (giá trị `1.5`, `abc`, `-5`, `0`, ``, `1e3`, ` 30` × 3 cờ × đợt/kênh, băm + 0 lời gọi ghi gh) và GD-06
  (1, 45, 100000 × 3 cờ × 2 nơi chứa, round-trip qua `tin so --tat-ca --json`); ca đỏ bo-kiem-han, kiem-sau-ghi, lam-tron.
- [ ] Chạy → FAIL. Cài `phutNguyenDuong`, gọi ở đầu nhánh GIAO và HỎI trước `suyLoiGiao*`/`nc.doc`/`nc.them`.
- [ ] Chạy → PASS; GT1 vẫn `# fail 0`. Commit.

### Task 3: Đáp yêu cầu kiểu cũ (AC-7, AC-8, AC-9)

**Files:** Modify `dieu-phoi/scripts/tin.mjs` (`dap`); Test: GD-07, GD-08, GD-09.

**Interfaces:** Consumes `ghiTraLoi(cwd, id, traLoi, {phien})` của `dieu-phoi/scripts/ghi.mjs`.

- [ ] Viết GD-07 (6 hàng; yêu cầu sinh bằng `dieu-phoi.mjs yeu-cau` thật; một nhịp `dieu-phoi.mjs chay`; hook chờ người
  rút từ `hooks.json` trước/sau), GD-08 (3 hàng), GD-09 (9 hàng + đối chứng mã mới); ca đỏ ghi-tin-jsonl, tu-duyet,
  tra-lai-duyet, nhan-lot, tra-bo-danh-tinh.
- [ ] Chạy → FAIL. Trong `dap`, sau kiểm `dong` và kiểm danh tính (giữ nguyên thứ tự hiện có cho cả hai nhánh): nếu
  `muc.yeu_cau_cu` → XONG/TRẢ gọi `ghiTraLoi` (ket_qua theo Global Constraints, `--ket-qua` ghi đè cho XONG), trả một dòng
  `đã trả lời <id> vào hộp của <người hỏi>`; khẩu lệnh khác → `LoiTin` thông điệp yêu cầu kiểu cũ. Không gọi `nc.them`.
- [ ] Chạy → PASS; GT1 vẫn `# fail 0` (GT-03 hàng yêu cầu cũ giữ nguyên). Commit.

### Task 4: Luật của gói (AC-10)

**Files:** Modify `dieu-phoi/scripts/mau/LUAT.md` (khối `LUAT-TIN`, bảng «mỗi việc một lệnh»); Test: GD-10.

- [ ] Viết GD-10 (rút khối marker, 4 hàng, chạy lệnh mẫu của dòng luật) + ca đỏ luat-lech.
- [ ] Chạy → FAIL. Thêm hai dòng bảng: `hạn` (`--han <phút>` / `--han-xong <phút>` nguyên dương) và `đáp yêu cầu kiểu cũ`
  (`tin XONG <id> "<câu>"` [`--ket-qua duyet`] · `tin TRẢ <id> "<câu>" --chuyen <ai>`, câu trả lời vào hộp người hỏi).
- [ ] Chạy → PASS; GT-10 của GT1 vẫn ok; `bash tests/dieu-phoi/chay-p200-p33.sh` nếu khối LUAT có răng đóng gói. Commit.

Mọi task `independent: false` — cùng chạm `tin.mjs` hoặc tệp ca, chạy tuần tự trong phiên chính.
