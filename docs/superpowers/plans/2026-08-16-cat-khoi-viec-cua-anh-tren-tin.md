# Cắt khối 👉 khỏi tin mời cổng — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gỡ khuôn khối 👉 VIỆC CỦA ANH khỏi tin nhắn mời cổng (nguồn luật + 11 bản chép + test hình dạng), thay bằng một câu điều khoản mô tả hành vi; thẻ HTML giữ nguyên.

**Architecture:** Một cây nguồn — `human-facing-language.md` là bản gốc; hai điều khoản (`GATE-INVITE-CLAUSE`, `GATE-ONESHOT-CLAUSE`) chép nguyên văn ra 5 + 6 site, lưới P188/P193 canh khớp từng ký tự. Răng của hồ sơ (`cat-khoi-rang.sh`, 4 chân) neo đối chứng dương vào `origin/main`, không vào suite vĩnh viễn.

**Tech Stack:** bash + python3 (checker) + node (gate-card, product-map).

**Spec:** `docs/superpowers/specs/2026-08-16-cat-khoi-viec-cua-anh-tren-tin-design.md` · contract `_acceptance/cat-khoi-viec-cua-anh-tren-tin/contract.md`.

## Global Constraints

- CHỈ TRỪ. Không thêm khuôn mới. Không đụng render `scripts/gate-card.js` (chỉ 2 comment).
- Không đổi một ký tự trong `GATE-ONESHOT-GRAMMAR` và `GATE-ONESHOT-SLOTS`.
- Câu điều khoản mời-cổng (bản gốc duy nhất): «Mời cổng như đồng nghiệp hỏi: một câu hỏi đóng, nói ngả máy khuyên và vì sao, người trả lời một chữ là đủ, rồi nói máy làm gì tiếp; không khuôn, không ô trống, không mã bắt buộc — máy không viết sẵn câu trả lời của người và không hỏi phút.»
- Số ca suite plugins sau: 145 (P189 gỡ), theo `SO-CA-KY-VONG` + `SO-CA-PHAN-RA` trong contract.
- Mọi phép đo mới có cặp hai chiều trên cùng fixture, thông điệp ghim (MEASURE-BIRTH-CLAUSE).

---

### Task 1: Nguồn luật — section mới + hai điều khoản mới

**Files:**
- Modify: `skills/acceptance/references/human-facing-language.md` (dòng 122–175 section khối; dòng 292–294 ONESHOT-CLAUSE)

- [ ] Step 1: Thay toàn bộ section «## Khối "👉 VIỆC CỦA ANH" — lời-gọi-hành-động chuẩn» (từ heading tới hết khối `GATE-INVITE-SITES`) bằng section «## Mời cổng — hỏi như đồng nghiệp» gồm: 4 dòng đề bài gốc (sổ vấp #8 → chip ② → owner 16/08 bỏ khuôn), marker `GATE-INVITE-CLAUSE` chứa câu điều khoản (một dòng), ba luật âm dạng bullet: (1) máy không viết sẵn câu trả lời của người (ADR 0002 — ca thật thẻ r2); (2) máy không hỏi phút; (3) tin chỉ-báo không hỏi — kết bằng một câu máy đang làm gì tiếp; giữ nguyên `GATE-INVITE-SITES`.
- [ ] Step 2: Trong `GATE-ONESHOT-CLAUSE` thay «Đầu ra theo bản luật ngôn ngữ mặt người; tin mời cổng kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE, tin chỉ-báo không đeo khối mà nói thẳng máy đang làm gì tiếp.» → «Đầu ra theo bản luật ngôn ngữ mặt người.»
- [ ] Step 3: `grep -n "YOUR-MOVE\|3 vế\|câu tu từ\|khối 👉" skills/acceptance/references/human-facing-language.md` → 0 hit (ngoài chú thích lịch sử không dùng emoji).

### Task 2: 11 bản chép + câu bọc quanh

**Files:**
- Modify: `skills/acceptance/SKILL.md:175,305` · `commands/acceptance-card.md:88-91` · `feature-loop/skills/feature-loop/SKILL.md:10,103,203` · `commands/{approve,signoff,start,acceptance-init,acceptance-status,acceptance-report}.md` (dòng chứa GATE-ONESHOT-CLAUSE)

- [ ] Step 1: Ở 5 site invite: thay câu clause cũ (nguyên văn) bằng câu mới; sửa câu bọc: feature-loop 103/203 «RỒI hỏi đúng 1 câu: duyệt / sửa gì.» giữ; acceptance-card.md 88-89 «Thẻ đã render sẵn khối 👉 VIỆC CỦA ANH; TIN NHẮN trình thẻ cũng phải kết bằng khối đó — điều khoản single-source (chép nguyên văn, một dòng):» → «Thẻ đã liệt việc-của-người; TIN NHẮN trình thẻ theo điều khoản single-source (chép nguyên văn, một dòng):».
- [ ] Step 2: feature-loop dòng 10: «đi tiếp — không khối 👉, không câu hỏi» → «đi tiếp — không câu hỏi».
- [ ] Step 3: 6 thân lệnh: thay vế cuối ONESHOT-CLAUSE như Task 1 step 2.
- [ ] Step 4: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P188|P193"` → P188 PASS; P193 FAIL (neo cũ) — chờ Task 3.

### Task 3: Tests + comment gate-card

**Files:**
- Modify: `tests/plugins/run-tests.sh` (P189 block 8624–8726; dòng 9497; comment 5672–5677) · `scripts/gate-card.js:347-350,506-512`

- [ ] Step 1: Xoá trọn block P189 (từ dòng `# ── P189:` tới dòng `pass "P189 …"`/`fail` tương ứng, kể cả ca cô-lập-clause). Kiểm `grep -c P189 tests/plugins/run-tests.sh` = 0.
- [ ] Step 2: Dòng 9497: đổi neo `"kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE"` → `"Đầu ra theo bản luật ngôn ngữ mặt người."`; sửa message kèm.
- [ ] Step 3: gate-card.js: comment 350 «YOUR-MOVE-BLOCK-TEMPLATE trong human-facing-language.md» → «danh sách việc-của-người trên thẻ — thẻ giữ khuôn liệt kê (Out of scope hồ sơ cat-khoi-viec-cua-anh-tren-tin); tin nhắn KHÔNG dùng khuôn này»; comment 506–512 tương tự, giữ nội dung bất biến không-điền-sẵn.
- [ ] Step 4: `bash tests/plugins/run-tests.sh` → all passed; đếm `  PASS:` = 145.

### Task 4: Răng hồ sơ `cat-khoi-rang.sh` + executor keys

**Files:**
- Create: `_acceptance/cat-khoi-viec-cua-anh-tren-tin/cat-khoi-rang.sh` (chân `khuon` · `clause` · `oneshot` · `so-ca [--log F]`)
- Modify: `_acceptance/config.yaml` executors.script: `cat_khoi_rang_khuon` · `cat_khoi_rang_clause` · `cat_khoi_rang_oneshot` · `cat_khoi_so_ca`

- [ ] Step 1: Viết script theo nếp `cat-hinh-thuc-rang.sh`: ROOT suy từ vị trí script; worktree tạm `origin/main` cho đối chứng dương; phạm vi đọc từ `PHAM-VI-RANG` của contract, in `CAT-SCOPE`; mảng needle 6; loại trừ gate-card.js khai-in-ra cho 2 needle; chân clause chuẩn hoá nối dòng, 4 dấu hiệu, 5 từ cấm, 3 luật âm; chân oneshot 6/6 + diff grammar/slots vs base; chân so-ca đọc SO-CA-KY-VONG + SO-CA-PHAN-RA, `--log F` cho chiều đỏ.
- [ ] Step 2: Chạy 4 chân → xanh với thông điệp ghim đúng evals.yaml.
- [ ] Step 3: Chiều đỏ chạy thật (mỗi chân ≥1 mutant qua CHÍNH checker, in xác-nhận-đột-biến) — nội dung mutant nằm trong script dưới cờ `--tu-kiem`.
- [ ] Step 4: Thêm 4 khoá vào config.yaml bằng `node scripts/config-patch.mjs --key executors.script.<k> --value "<cmd>" --write`.

### Task 5: Bản đồ + 4 suite + commit

- [ ] Step 1: `node scripts/product-map.mjs --root .` (vẽ lại) rồi `--check` → 0.
- [ ] Step 2: Chạy 4 suite (`tests/{scripts,hooks,plugins,workflows}/run-tests.sh`) → 0.
- [ ] Step 3: `git add` đích danh; commit; set contract `status: implemented`; dispatch S4.
