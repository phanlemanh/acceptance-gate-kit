# Bộ đọc hồ sơ khoan dung — Implementation Plan

> **For agentic workers:** thực thi inline trong phiên feature-loop (superpowers:executing-plans). Mọi task tuần tự.

**Goal:** `evals.yaml` không chuẩn lên cờ vàng có tên (thẻ + lệnh kiểm tự bật); ngày ký ngày/tháng/năm đọc được ở bốn mặt qua một bộ đọc.

**Architecture:** Bộ dò sáu lớp đọc theo dòng ở `scripts/yaml-chuan.cjs` (thuần, không đĩa) + CLI cùng tệp; thẻ nạp nó mềm. `ngayChuKy` ở `scripts/ho-so-tom-tat.cjs`, bốn mặt gọi nó. Răng dữ liệu thật ở `rang/bay-kho.mjs` so với PyYAML và với bản base `3c88d138`.

**Tech Stack:** Node ≥18 thuần (CJS + ESM), git, python3 + PyYAML (chỉ răng ngoài suite).

**Spec:** `docs/superpowers/specs/2026-10-13-bo-doc-ho-so-khoan-dung-design.md` · hợp đồng `_acceptance/bo-doc-ho-so-khoan-dung/contract.md`.

## Global Constraints

- KHÔNG chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, `dieu-phoi/**` (T2; `lib/out-of-contract.cjs` là vùng M5).
- Không thêm tệp nào vào danh sách chép sang kho tiêu thụ (INIT-CI-COPY-LIST không đổi).
- Ngày: năm-tháng-ngày đầu tiên thắng (không kiểm lịch); chỉ khi vắng mới đọc `d/m/yyyy` ngày-trước, kiểm lịch.
- Base cho chiều đỏ: `git archive 3c88d138 scripts lib dieu-phoi`.
- Mỗi phép đo mới có cặp hai chiều trên cùng fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE).
- Việc nặng (suite trọn, S4) qua `chay-nang.sh`.

## Review Focus

1. Nháy kép/đơn nhiều dòng hợp lệ → bộ dò im (YC-1 dạng hợp lệ + răng 7 kho).
2. Khối chữ có dòng trống giữa thân → không coi là thụt lùi (YC-1 dạng hợp lệ «khối chữ có chú thích» có dòng trống).
3. `#` trong nháy là chữ, không phải chú thích → không «chữ sau nháy đóng» (dạng hợp lệ).
4. `--base` trên nhánh rẽ (YC-4-re).
5. Chữ ký mang cả ngày/tháng/năm lẫn năm-tháng-ngày → năm-tháng-ngày thắng (NK-1).

---

### Task 1: Bộ dò sáu lớp + ma trận dùng chung — phục vụ E1 (E2 dùng lại) · independent: false

**Files:** Create `scripts/yaml-chuan.cjs`, `tests/scripts/yaml-chuan-ma-tran.mjs`, `tests/scripts/yaml-chuan.test.mjs`.

**Interfaces — Produces:** `yamlKhongChuan(text) → [{dong:number, loai:string, mo_ta:string}]`; `LOP_YAML = {<mã>: <chữ lớp>}` (sáu mã); `maTran() → [{o, text, mong:{loai,dong}|null}]` (19 ô).

- [ ] Viết `maTran()` (6 lớp × hỏng/lành + 7 dạng hợp lệ) và ca YC-1 + YC-1-do (bản sao bộ dò bỏ nhánh `thoat-sai-nhay-kep`).
- [ ] Chạy `node tests/scripts/yaml-chuan.test.mjs` → FAIL (tệp bộ dò chưa có).
- [ ] Viết bộ dò: quét dòng, theo dõi khối chữ (thụt dòng nội dung đầu) và vô hướng có nháy nhiều dòng; sáu luật như design §4.
- [ ] Chạy lại → PASS YC-1, YC-1-do. Commit.

### Task 2: Lệnh kiểm `--root` / `--base` — phục vụ E4 · independent: false

**Files:** Modify `scripts/yaml-chuan.cjs` (khối `require.main === module`); Test `tests/scripts/yaml-chuan.test.mjs` (YC-4, YC-4-re, YC-4-2).

- [ ] Ca: kho git thử A hỏng/B lành; ba commit thẳng; nhánh rẽ; bản sao đổi `merge-base` → hai chấm phải đỏ «hồ sơ ngoài nhánh chặn: A»; không phải kho git / ref vắng → 2.
- [ ] Cài: `git ls-files _acceptance/*/evals.yaml`; `--base` → `git merge-base <ref> HEAD` rồi `git diff --name-only <mb>` (+ tệp chưa commit) → tập slug; in `<slug>/evals.yaml:<dòng> — <chữ lớp>`; thoát 0/1/2.
- [ ] PASS. Commit.

### Task 3: Cờ trên thẻ hai cổng — phục vụ E3 · independent: false

**Files:** Modify `scripts/gate-card.js` (hằng cờ cạnh `DANH_SACH_KHONG_DOC_FLAG`, hai chỗ đẩy cờ cạnh dòng 933 và 1372); Test YC-3, YC-3-do, YC-3-vang.

- [ ] Ca: kho thử hồ sơ draft + verified, evals hai lớp; thẻ có đúng một cờ, nêu hai dòng + chữ lớp, không mã lớp; bản sửa → mất cờ, cờ khác giữ; base → không cờ; bản sao trỏ bộ dò tới đường vắng → cờ «không kiểm được YAML chuẩn».
- [ ] Cài: nạp mềm `./yaml-chuan.cjs` (try/catch); cờ `YAML_KHONG_CHUAN_FLAG + ' dòng N (chữ lớp), …'`.
- [ ] PASS. Commit.

### Task 4: Một bộ đọc ngày ký — phục vụ E5, E6 · independent: true (với T1–T3)

**Files:** Modify `scripts/ho-so-tom-tat.cjs` (`ngayChuKy`, `ngayCua` gọi nó, export), `scripts/tin-hieu.mjs` (`ngayKy`, `chuKyKhongNgay`), `scripts/start-scan.mjs` (`ngayXong` nấc chữ ký), `scripts/cat-luot.mjs` (`ngayDau` của nhịp); Create `tests/scripts/ngay-ky.test.mjs` (NK-1, NK-1-do, NK-2, NK-2-do, NK-2-giu).

- [ ] Ca bảng mười dạng; kho thử khai lộ trình + cửa tín hiệu, hồ sơ signed-off «Tên 10/09/2026 — ghi chú»; bốn mặt mới ra ngày; base mất ngày ở cả bốn; chữ ký «Tên» → `--cau` đỏ.
- [ ] Cài `ngayChuKy`; bốn mặt gọi nó (cat-luot `require` ho-so-tom-tat.cjs).
- [ ] PASS. Commit.

### Task 5: Răng dữ liệu thật bảy kho — phục vụ E2, E7 · independent: false (cần T1, T4)

**Files:** Create `_acceptance/bo-doc-ho-so-khoan-dung/rang/bay-kho.mjs`.

- [ ] Sha ghim bảy kho (origin sau fetch 13/10); `git archive <sha> _acceptance` vào thư mục tạm; thiếu kho / PyYAML → 2.
- [ ] YAML: PyYAML (một tiến trình python đọc danh sách tệp, trả JSON tệp→dòng lỗi) so bộ dò ở mức tệp + dòng; 19 ô ma trận qua PyYAML; sáu mutant bỏ lớp + mutant dời dòng; bộ đọc theo dòng base vs mới deep-equal.
- [ ] Ngày: bốn mặt base vs mới trên từng kho; đọc thêm in theo mặt; hai mutant.
- [ ] Chạy qua khoá máy → exit 0. Commit.

### Task 6: Tài liệu, khoá executor, lộ trình — phục vụ E8, E9, E9b · independent: false

**Files:** Modify `CHANGELOG.md` (Chưa phát hành), `skills/acceptance/references/eval-executors.md` (evals.yaml shape), `_acceptance/config.yaml` (khoá `test.yaml_chuan`, `test.ngay_ky`, `script.bo_doc_bay_kho`, `script.lo_trinh_r2`), `docs/plans/lo-trinh-kit.json` (hàng R2 + mốc); Create `_acceptance/bo-doc-ho-so-khoan-dung/rang/hang-r2.mjs`.

- [ ] Viết tài liệu đủ bảy điều của E8; hàng R2; răng hang-r2 (kiểm hàng + mốc, chiều đỏ trên bản sao bỏ R2 khỏi mốc).
- [ ] `node tests/scripts/lo-trinh.test.mjs`, `node .../hang-r2.mjs` xanh. Commit → `status: implemented` → S4.
