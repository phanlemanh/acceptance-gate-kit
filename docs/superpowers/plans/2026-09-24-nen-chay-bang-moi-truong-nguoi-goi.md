# Đường nền chạy lệnh bằng môi trường người gọi — Implementation Plan

> **For agentic workers:** feature-loop T2: tuần tự trong phiên chính. Task 1–2 đã làm TRƯỚC khi mở vòng (sổ `d-20260924T152811Z-1`); kế hoạch ghi lại để S4 và người ký đọc được thứ tự thật.

**Goal:** Chân công cụ và chân suite của đường nền chạy lệnh bằng `bash -c` + môi trường người gọi, qua một cửa duy nhất.

**Architecture:** Hàm `bashNguoiGoi(lenh, thamSo, o)` trong khối marker `BASH-NGUOI-GOI` của `feature-loop/scripts/duong-nen.mjs`; hai lời gọi `spawnSync('bash', ['-lc', …])` đổi sang nó. Không đổi khối `SUITE-TUAN-TU`, `CONG-CU-TU-DAU`, chân lưới, chân engine.

**Spec:** `docs/superpowers/specs/2026-09-24-nen-chay-bang-moi-truong-nguoi-goi-design.md` · hợp đồng `_acceptance/nen-chay-bang-moi-truong-nguoi-goi/contract.md`

## Global Constraints

- Fixture do code sinh (`dungKho()`, `moiTruongNguoiGoi()`); mọi lượt truyền `--cache-root` do ca dựng; HOME và bin là thư mục tạm, gỡ ở `donDep()`.
- Ca đột biến chép TRỌN `feature-loop/`, chạy bản chép chưa tiêm XANH trước, assert mũi tiêm đổi được tệp.

## Review Focus

- `bash -c` vẫn nạp `$BASH_ENV` của người gọi — đúng ý (Out of scope của contract).
- HOME tạm của ca ENV không được đổi màu chân lưới/engine — ENV1, ENV4 so bốn chân với NEN0.
- Guard NEN4b trỏ `bashNguoiGoi(` — đổi tên hàm là guard đỏ có tên, không im.

---

### Task 1: Ca NEN-ENV1..3 (đỏ trên bản chưa vá) — XONG `71f97b8f`

**Files:** `tests/scripts/duong-nen.test.mjs`, `tests/scripts/duong-nen-fixture.mjs` (`chayNen` nhận `env`) · phục vụ E1–E3, E4 · `independent: false`
**Verify:** `node tests/scripts/duong-nen.test.mjs` — ở commit này ENV1 và ENV3 ĐỎ (tái hiện báo động giả; khối chưa có).

### Task 2: Cửa `bashNguoiGoi` — XONG `3ba8edc0` (+ gộp `main` `f4d0cc4c`)

**Files:** `feature-loop/scripts/duong-nen.mjs`; guard NEN4b trong test · phục vụ E1–E5 · `independent: false`
**Verify:** `node tests/scripts/duong-nen.test.mjs` → 25/25; mười `suite_keys` của kit xanh.

### Task 3: Ca NEN-ENV4 + siết ENV1–ENV3 (gap-probe P1, P2)

**Files:** `tests/scripts/duong-nen.test.mjs` (khối NEN-ENV, hàm `banDotBienDangNhap`) · `_acceptance/config.yaml` (`nme_moi_truong` ghim thêm NEN-ENV4) · phục vụ E1–E3, E6 · `independent: false`
**Verify:** `node tests/scripts/duong-nen.test.mjs` → 26/26; lệnh `config:executors.script.nme_moi_truong` mã 0; thay một tên ca ghim bằng tên không tồn tại → mã 1; phá thử tay bản vá yếu (`-lc` + nối PATH người gọi vào cuối) → fixture ENV1 mã 0, fixture ENV4 mã 1 «DO SAN … ma 42».
