# claim-scan-parser-hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đóng lớp câm-lặng của 6 cửa parse trong `claim-scan.mjs` (5 lỗ đã chốt Gate 1) + đóng gói 1.18.1 trả nợ description.

**Architecture:** Sửa tại chỗ 2 hàm parse (`ledgerClaims`, `probeClaims`) + bước filter trong `scan()`; test nối vào `tests/workflows/claim-scan.test.mjs` sẵn có (fixture code-sinh, đối chứng dương, ghim thông điệp). Case PH8 (description) vào file test riêng nhỏ hoặc cùng file — cùng file cho gọn.

**Tech Stack:** Node thuần, suite bash sẵn có.

## Global Constraints

- Nguồn `feature-loop/` — sửa xong chạy `bash scripts/sync-plugin-packages.sh` + commit mirror cùng lượt; **git add đích danh từng path, CẤM `-A`/`-am`** (known-limit vòng trước).
- Thông điệp mới (ghim nguyên văn trong test): `claim-scan: dropped N claims with invalid id in <slug>` · `claim-scan: duplicate id <id> across features (kept first)` · `claim-scan: skipped <file> (unreadable frontmatter)`.
- Thông điệp cũ KHÔNG đổi lời; exit 0 giữ nguyên cho mọi hỏng-từng-phần; 35 case V1 phải xanh nguyên vẹn (E6).

### Task 1: Section capture dừng ở heading kế (E1) — độc lập: false

**Files:** Modify `feature-loop/scripts/claim-scan.mjs` (regex dòng ~50) · Modify `tests/workflows/claim-scan.test.mjs`

- [ ] Test PH1 (fail trước): fixture gap-probe findings 1 hàng + `## Notes` chứa bảng 6 cột; đối chứng dương = cùng fixture cắt từ `## Notes`; assert output JSON hai lần chạy **bằng nhau từng id** và không id nào ngoài `#F1`.
- [ ] Fix: `/## Findings([\s\S]*?)(?=\n## |$)/`.
- [ ] `node tests/workflows/claim-scan.test.mjs` xanh → commit `fix(claim-scan): section capture dừng ở heading kế — hết claim ma (E1)`.

### Task 2: id sai khuôn nổ to + trùng xuyên-feature cảnh (E2, E3) — độc lập: false

**Files:** như Task 1 (bước filter trong `scan()`)

- [ ] Test PH2: ledger 3 entry (không id / id `BAD ID` / chuẩn) → 1 claim, stderr khớp `dropped 2 claims with invalid id in <slug>`, exit 0.
- [ ] Test PH3: (a) cùng id ở slug-a + slug-b → 1 claim + `duplicate id … across features (kept first)` + exit 0; (b) corpus sạch → stderr không có `duplicate id`; (c) trùng trong CÙNG slug → KHÔNG warn.
- [ ] Fix `scan()`: tách filter thành vòng đếm — invalid-id đếm per-slug rồi warn; duplicate: nhớ `firstSlug` per id, khác slug → warn, cùng slug → im.
- [ ] Suite xanh → commit `fix(claim-scan): invalid-id + cross-feature duplicate nổ to (E2, E3)`.

### Task 3: frontmatter unreadable + nội dung rỗng (E4, E5) — độc lập: false

**Files:** như Task 1 (`probeClaims` đầu hàm, `ledgerClaims` điều kiện emit)

- [ ] Test PH4: (a) file mất `---` mở; (b) frontmatter không key `verdict` → cả hai stderr `skipped … (unreadable frontmatter)`, exit 0; (c) đối chứng: `verdict: clean` → stderr sạch.
- [ ] Test PH5: ledger 3 entry (thiếu decision / thiếu impact / đủ) → 1 claim, `skipped 2 malformed lines in <file>`, không claim text rỗng.
- [ ] Fix: `probeClaims` — fm không match HOẶC meta thiếu `verdict` → warn unreadable + return []; `ledgerClaims` — entry fix/descope thiếu `decision`/`impact` → `bad++`, không emit.
- [ ] Suite xanh → commit `fix(claim-scan): unreadable frontmatter + entry rỗng nổ to (E4, E5)`.

### Task 4: Đóng gói — description v1.18, bump 1.18.1, re-pin, sync (E8, E9) — độc lập: false (cuối)

**Files:** Modify 2 `plugin.json` (description + version 1.18.1) · `tests/plugins/run-tests.sh` (re-pin 3 literal `"1.18.0"`→`"1.18.1"`) · Test PH8 vào `tests/workflows/claim-scan.test.mjs` · mirror qua sync

- [ ] Test PH8 (fail trước): đọc 2 plugin.json, assert description khớp `/v1\.18 adds/`; mutation: bản cắt chuỗi → assert đỏ.
- [ ] Sửa description cả 2 manifest: thêm câu `v1.18 adds cross-feature claim index: gap-probe S1 reads lessons from prior features via claim-scan (Claude harness only; Codex parity deferred).` + version 1.18.1; re-pin 3 literal.
- [ ] `bash scripts/sync-plugin-packages.sh` → chạy đủ 4 suite + `--check` → commit `chore(feature-loop): 1.18.1 — description v1.18 (trả known-limit) + re-pin + sync (E8, E9)`.

## Self-review

AC↔task: AC-1(T1) AC-2/3(T2) AC-4/5(T3) AC-6(suite mọi task) AC-7(judgment S4) AC-8(T4). Không placeholder; thông điệp ghim thống nhất Global Constraints. ✓
