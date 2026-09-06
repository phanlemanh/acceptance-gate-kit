# co-qua-timebox-nhom-da-xong Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bộ quét gắn cờ `qua-timebox` cho cả ba lối đẩy vào nhóm «đã xong»; RT13 có ma trận fixture không phụ thuộc ngày và ba mutant.

**Architecture:** Ba chỗ trong `scripts/start-scan.mjs` dùng cùng vị từ `quaTimebox` đã có (lối phán quyết đọc riêng văn bản cơ hội cho cờ); một khối (iii-b) thêm vào RT13 trong `tests/plugins/ra-co-ten.test.mjs` dùng `mkWs`/`withRepo`/`scan` sẵn có; mutant = chép `scripts/` + `lib/` + khuôn sang thư mục tạm rồi gỡ đúng một mỏ neo chứa `state:`.

**Tech Stack:** Node builtins, bash. **Spec:** docs/superpowers/specs/2026-09-06-co-qua-timebox-nhom-da-xong-design.md

## Global Constraints

- Không đổi vị từ `quaTimebox`; không đổi thân lệnh start; không đụng bản đồ.
- Comment tiếng Anh trong mã; thông điệp test tiếng Việt, ghim đúng chuỗi evals.yaml.

---

### Task 1: Bộ quét — flags ở ba lối «đã xong»
**Files:** Modify `scripts/start-scan.mjs`. `independent: false`. Phục vụ E1–E5.
- [ ] Dời khối tính `flags` lên trước lối `if (verdict)`; đọc riêng văn bản cơ hội cho cờ khi không tiêu thụ; truyền `flags` vào push `UAT_KEY[verdict]`.
- [ ] Tính `oFlags` TRƯỚC nhánh `stage === 'archived'`; truyền `flags: oFlags` vào push `da-dong-ho-so` và push `xep-lai`/`da-bac`.
- [ ] Verify: bộ quét trên cây thật → `baseline-127-tin-hieu-phan-biet` (done/xep-lai) có `qua-timebox`.

### Task 2: RT13 — (iii) đếm hồ sơ quá hạn, (iii-b) bảy fixture + ba mutant
**Files:** Modify `tests/plugins/ra-co-ten.test.mjs` (khối RT13). `independent: false`. Phục vụ E1–E6.
- [ ] (iii): gom `quaThat` để nối vào câu PASS: `iii: n hồ sơ quá hạn trên cây thật (tên)`.
- [ ] (iii-b): `withRepo` dựng 7 fixture; phép soi khoá `grp/stateKey` rồi soi cờ; ba mutant chép cây `scripts/ lib/ skills/acceptance/references/` sang tmp và gỡ một mỏ neo mỗi bản; mỗi mutant phải làm phép soi nêu đúng slug quá hạn của lối ấy.
- [ ] Nối câu PASS đúng chuỗi trong design §Đụng đâu.
- [ ] Verify: `RT_CASES=RT13 node tests/plugins/ra-co-ten.test.mjs` PASS đủ token; `bash tests/plugins/run-tests.sh` kết `Results: 0 failed`.

### Task 3: Chốt
- [ ] `node scripts/product-map.mjs --root . --check` xanh; `git status --porcelain PRODUCT-MAP.md` rỗng.
- [ ] Commit; contract `status: implemented`; S4.
