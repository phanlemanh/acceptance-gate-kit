# Lệnh suite để lại dấu vết — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (chạy tuần tự trong main loop — quy ước kho thắng mặc định skill).

**Goal:** mọi lệnh suite sinh đúng một dòng sổ chạy, mã đúc từ chính lệnh, phân biệt được giữa hai lệnh và giữa hai vòng, và dây sổ→bản chấm→bộ đối chiếu khép kín.

**Architecture:** phần sinh dòng đã có trên nhánh (`5610baa7`). Còn ba việc: (1) chống va chạm tên bằng hậu tố băm suy từ CHÍNH chuỗi lệnh, chỉ gắn cho các lệnh thật sự trùng tên; (2) ca lưới thường trực cho sáu hình dạng lệnh + vòng + dây khép; (3) răng hồ sơ bảy chân ghim thông điệp và giữ chiều đỏ.

**Tech Stack:** JS thuần chạy trong vm-realm harness (`tests/workflows/harness.mjs`), không sinh agent nào; bash cho răng hồ sơ.

**Spec:** `docs/superpowers/specs/2026-08-29-suite-run-log-provenance-design.md`

## Global Constraints

- Fixture phải do **code sinh trong chính lần chạy**; cấm file tĩnh viết tay đúng khuôn bên đọc.
- Bản sao dùng cho chiều đỏ lấy **trọn cây** `git archive HEAD`, không chép danh sách file tay (P150).
- Mọi đường dẫn trong răng suy từ vị trí script (`$(dirname "$0")`), không hardcode ROOT.
- Mỗi phép đo mới đi kèm **cặp hai chiều cùng fixture** + thông điệp ghim; chiều đỏ phải chứng minh lệnh tiêm đổi được nội dung (`cmp`).
- Mã suite giữ khuôn `minted-<slug>-SUITE-<tên>-r<vòng>`; ca cũ `SUITE-build` phải còn xanh (không đổi tên khi không va chạm).

---

### Task 1: Chống va chạm tên

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (khối sinh dòng suite, ~dòng 565–595)
- Test: `tests/workflows/acceptance-verify.test.mjs`

**Interfaces:**
- Produces: `tenDuyNhat(cmd)` — tên suite duy nhất trong một vòng; `bamSuite(cmd)` — băm FNV-1a 6 ký tự hex suy từ chuỗi lệnh.

- [ ] **Step 1: ca đỏ trước** — thêm `W28` với ba biến thể va chạm (tiền tố thư mục · khác cờ · trùng 40 ký tự đầu), assert mỗi cặp cho hai `run_id` khác nhau và mỗi mã trỏ đúng `cmd`.
- [ ] **Step 2: chạy để thấy ĐỎ** — `node tests/workflows/acceptance-verify.test.mjs`, chờ FAIL đúng ba dòng W28.
- [ ] **Step 3: cài** — đếm tên trên tập lệnh suite, chỉ lệnh nào có tên trùng mới gắn `__<băm>`; băm suy từ chuỗi lệnh nên không phụ thuộc thứ tự khai.
- [ ] **Step 4: chạy lại** — W28 xanh, `W03 suite: ten suy tu lenh` (không va chạm) vẫn xanh.
- [ ] **Step 5: commit.**

### Task 2: Ca lưới cho vòng, hình dạng tên, kết quả riêng, gộp lệnh

**Files:**
- Test: `tests/workflows/acceptance-verify.test.mjs`

- [ ] **Step 1: W29 vòng** — cùng lệnh suite ở `round: 1` và `round: 2` → hai mã khác nhau.
- [ ] **Step 2: W30 ma trận tên** — năm hình dạng, tên mong đợi ghim nguyên văn (`npm run build`→`build`, `pnpm itest:ci`→`itest_ci`, `bash tests/hooks/run-tests.sh`→`bash_tests_hooks_run_tests_sh`, `cd apps/web && pnpm build`→`build`, `pnpm build && pnpm typecheck`→`build_typecheck`).
- [ ] **Step 3: W31 kết quả riêng** — suite `cannotRun` → `exit_code: null` + `cannot_run: true`; suite exit ≠ 0 → đúng số đó.
- [ ] **Step 4: W32 gộp lệnh** — `suiteCommands` trùng đúng `cmd` của eval → không sinh dòng `SUITE-`, số dòng sổ bằng số eval.
- [ ] **Step 5: chạy + commit.**

### Task 3: Dây khép sổ ↔ bản chấm ↔ bộ đối chiếu

**Files:**
- Test: `tests/workflows/acceptance-verify.test.mjs`

- [ ] **Step 1: W33** — lấy `result.runLog` thật, dựng bản chấm theo khuôn khối eval của bản mẫu, rồi gọi `extractEvalBlockRunIds` + `loadRunLogIds` THẬT từ `lib/evidence-core.cjs` (qua `createRequire`) và assert quan hệ bao hàm.
- [ ] **Step 2: hai ca đỏ cùng fixture** — (a) bỏ dòng suite khỏi sổ → phép so đỏ nêu đích danh mã thiếu; (b) bản chấm ghi `SUITE-build` thay vì `run_id` → cũng đỏ.
- [ ] **Step 3: chân MỘT bản luật** — đếm điểm neo khối luật cấm tự đặt mã trong đề bài `synthesize:report`, phải bằng 1.
- [ ] **Step 4: chạy + commit.**

### Task 4: Răng hồ sơ bảy chân

**Files:**
- Create: `_acceptance/suite-run-log-provenance/rang.sh`

- [ ] **Step 1** — khung răng: `--chan <tên>`, đường dẫn suy từ `$(dirname "$0")`, hàm `ghim <nhãn> <lệnh>` in `PASS:`/`DO:`.
- [ ] **Step 2** — chân `suite-case`, `thu-tu`, `ket-qua-rieng`, `day-khep`, `khong-hoi-quy`: chạy lưới thường trực rồi ghim ĐÚNG dòng ca (không tin mã thoát của trọn suite — P194).
- [ ] **Step 3** — chân `hai-chieu` và `va-cham-ten`: dựng bản sao trọn cây bằng `git archive HEAD`, tiêm (gỡ vá / gỡ đoạn chống va chạm), `cmp` chứng minh tiêm đổi nội dung, đối chứng dương trước, rồi đòi ĐỎ đúng ca.
- [ ] **Step 4** — chạy đủ bảy chân, commit.

### Task 5: Đóng S3

- [ ] **Step 1** — chạy `bash tests/workflows/run-tests.sh` + `node scripts/eval-coverage-lint.js .` (phần của slug này phải sạch).
- [ ] **Step 2** — set contract `status: implemented`, commit.

## Self-Review

- Phủ spec: mỗi AC có task — AC-1/AC-6 → Task 2+4, AC-2 → Task 2, AC-3 → Task 1, AC-4 → Task 2, AC-5 → Task 3.
- Không placeholder: mọi ca nêu tên mong đợi cụ thể.
- Nhất quán tên: `tenSuite` (đã có) · `tenDuyNhat` · `bamSuite` dùng đúng tên đó ở mọi task.
