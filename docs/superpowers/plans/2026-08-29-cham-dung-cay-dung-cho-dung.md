# Chấm đúng cây, đúng chỗ đứng — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đưa tầng chấm S4 vào cùng kỷ luật nó áp cho sản phẩm — vật-vào do máy sinh fail-closed, chỗ đứng do lane đặt, hạ tầng hỏng tự xưng tên thay vì giả dạng tín hiệu sản phẩm.

**Architecture:** Thêm một script node `s4-args.mjs` sinh trọn args cho workflow (chạy ngoài workflow vì workflow không có filesystem); sửa `acceptance-verify.js` ở ba chỗ — wrap chỗ đứng theo LANE, phân loại kết quả hạ-tầng-hỏng sang BLOCKED, ghi dòng tổng kết lượt; thêm giá trị `wont-fix` vào enum triage + nhánh render thẻ; sửa SKILL S4 thay công thức soạn tay bằng lệnh gọi script + điều khoản cấm fallback.

**Tech Stack:** Node ESM (script + workflow), bash test harness của kit (`tests/scripts`, `tests/workflows`, `tests/plugins`), yaml đọc bằng lib sẵn có của repo.

**Spec:** `docs/superpowers/specs/2026-08-29-cham-dung-cay-dung-cho-dung-design.md`

## Global Constraints

- Không đổi schema args của `acceptance-verify.js` — mọi trường script sinh ra là trường hợp đồng hiện hành (`feature-loop/workflows/acceptance-verify.js:13-48`). AC-11 là chốt.
- Mỗi phép đo mới phải có cặp hai chiều CÙNG fixture + thông điệp ghim (`MEASURE-BIRTH-CLAUSE`). Fixture do CODE SINH trong chính lần chạy, không chép tay khuôn bên đọc.
- Đường dẫn trong script sinh fixture suy từ vị trí script, KHÔNG hardcode ROOT.
- Răng hồ sơ đặt ở `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh` theo nếp không-vào-suite-vĩnh-viễn; lưới thường trực là case trong `tests/`.
- Chuỗi ghim trong test rút từ marker/hằng trong nguồn, không gõ literal.
- Repo tiêu thụ nhận thay đổi theo release kế — không đổi engine dưới chân vòng đang chạy.

---

### Task 1: Script sinh-args — khung + resolve + fail-closed

**Files:**
- Create: `feature-loop/scripts/s4-args.mjs`
- Create: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh` (chân `args-du-truong`, `ref-hong`)
- Modify: `_acceptance/config.yaml` (thêm khoá `executors.script.cdc_args_du_truong`, `cdc_ref_hong_keu_to`)

**Interfaces:**
- Produces: CLI `node feature-loop/scripts/s4-args.mjs --slug <s> --root <r> [--round N] [--carry-anchor <sha>|--no-carry] [--ag-root <path>] [--out <file>]`; exit 0 = sinh tệp JSON, exit 2 = nguồn thiếu/ref hỏng (không sinh tệp), exit 3 = usage.
- Produces: object args có `generated_at`, `generated_sha` + đủ trường hợp đồng.

- [ ] **Step 1: Viết fixture sinh + chân răng `args-du-truong` (ma trận 15 vế) — chạy, phải ĐỎ vì script chưa tồn tại**

`rang.sh --chan args-du-truong` dựng repo git tạm (`mktemp -d`), sinh `_acceptance/<slug>/{contract.md,evals.yaml}` + `_acceptance/config.yaml` bằng heredoc trong script, tạo nhánh chính + nhánh feature để merge-base có nghĩa, rồi chạy s4-args và assert đủ 15 vế; vế (7) so với `git merge-base` chạy độc lập, vế (11) so nội dung `toolKillRule` với file nguồn.

- [ ] **Step 2: Viết `s4-args.mjs`** — parse cờ, đọc config/evals/contract, resolve `config:` ref giữ `ref` gốc, suiteCommands từ `feature_loop.suite_keys`, inputs judgment → abs, resolve plugin qua `resolve-plugin.mjs` (nhận `--ag-root` cho self-host), đọc `tool-kill-rule.md` nguyên văn, diffBase = `git merge-base` với nhánh chính (detect qua `git remote show origin` → fallback main/master/develop/trunk), `invokedAt`/`invokedSha`, `generated_at`/`generated_sha`.

- [ ] **Step 3: Chạy chân `args-du-truong` → PASS 15/15**

- [ ] **Step 4: Chân `ref-hong` — chiều đỏ**: fixture cùng khuôn, một eval trỏ `config:executors.script.khong_ton_tai` → exit ≠ 0, thông điệp ghim tên ref, `test ! -f` tệp args; đối chứng dương: sửa ref về key thật → exit 0 + tệp có.

- [ ] **Step 5: Commit** — `git add feature-loop/scripts/s4-args.mjs _acceptance/cham-dung-cay-dung-cho-dung/rang.sh _acceptance/config.yaml && git commit -m "feat(s4-args): sinh args S4 bằng máy — resolve ref, fail-closed khi ref hỏng"`

---

### Task 2: Round tự đếm · carry tự gọi · lời khai phạm vi

**Files:**
- Modify: `feature-loop/scripts/s4-args.mjs`
- Modify: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh` (chân `round-tu-dem`, `carry-da-goi`, `loi-khai`)
- Modify: `_acceptance/config.yaml` (3 khoá: `cdc_round_tu_dem`, `cdc_carry_da_goi`, `cdc_loi_khai_pham_vi`)
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (khối marker điều khoản sinh-lại-khi-HEAD-khác)

**Interfaces:**
- Consumes: `carry-plan.mjs` CLI (`--run-log --evals --contract --delta-files|--no-delta --round`), exit 0 = có kế hoạch, 3 = không carry, 2 = lỗi.
- Produces: args mang `carriedEvals`, `evalsHash`, `carriedPanels`/`inputsHash`, `runBaseline`, `carriedAnalyst`.

- [ ] **Step 1: Chân `round-tu-dem`** — fixture có `evidence-report.md` với `## Iterations` 2 round → `round: 3`; xoá file → `round: 1`; chiều đỏ: đổi tên section → exit ≠ 0 ghim «không đếm được round» (chống mint trùng run_id). Chạy: ĐỎ.

- [ ] **Step 2: Thêm nhánh đếm round vào script** (parse `## Iterations`, không đoán khi section vắng dạng chuẩn) → chân xanh.

- [ ] **Step 3: Chân `carry-da-goi`** — round ≥2 + `--carry-anchor <sha>` trên fixture có run-log round trước → args có `carriedEvals` khớp kết quả `carry-plan.mjs`, có `evalsHash`, judgment eval có `inputsHash`; chiều đỏ: round ≥2 mà thiếu cả `--carry-anchor` lẫn `--no-carry` → exit ≠ 0 ghim thông điệp đòi khai tường minh. Chạy: ĐỎ.

- [ ] **Step 4: Thêm nhánh carry vào script** (gọi `carry-plan.mjs` con, tính `evalsHash` bằng sha256 file evals, `inputsHash` bằng sha256 question+inputs, đọc dòng `kind:baseline`/`kind:panel` cuối của run-log) → chân xanh.

- [ ] **Step 5: Chân `loi-khai`** — hai vế: (a) `generated_sha` = `git rev-parse HEAD` fixture, chiều đỏ commit thêm → hai sha lệch và bộ so BÁO lệch; (b) rút TRỌN khối marker `S4-ARGS-FRESHNESS` trong SKILL, assert nội dung chứa cả `generated_sha` lẫn hành-động-sinh-lại, chiều đỏ rỗng ruột khối trong bản sao → đỏ ghim thông điệp vế SKILL. Chạy: ĐỎ (khối marker chưa có).

- [ ] **Step 6: Thêm `generated_at`/`generated_sha` vào script + khối marker `S4-ARGS-FRESHNESS` vào SKILL.md** → chân xanh.

- [ ] **Step 7: Commit** — `git commit -m "feat(s4-args): round tự đếm, carry tự gọi, tệp args mang lời khai phạm vi"`

---

### Task 3: Ghim chỗ đứng theo LANE + giữ lane baseline

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js:452` (lane verifier máy), `:460` (lane UI)
- Create: `tests/workflows/lane-pin.test.mjs`
- Modify: `tests/workflows/run-tests.sh` (đăng ký case mới nếu runner không tự quét)

**Interfaces:**
- Produces: hàm/nhánh dựng prompt lane trả chuỗi lệnh dạng `cd <repoRoot> && <cmd>`; lane baseline giữ `cd "$WT" &&`.

- [ ] **Step 1: Viết case `lane-pin`** — dựng args mẫu bằng code, gọi đường dựng prompt của cả ba lane, assert: prompt máy và UI chứa `cd <repoRoot> && <cmd>`; prompt baseline chứa `cd "$WT"` và KHÔNG chứa `cd <repoRoot> &&` trong chuỗi lệnh. Chạy: ĐỎ (lane máy/UI đang chỉ *kể*).

- [ ] **Step 2: Sửa `acceptance-verify.js`** — lane máy: thay `Trong repo ${args.repoRoot}, chay dung lenh:\n\n  ${cmd}` bằng lệnh đã wrap `cd ${args.repoRoot} && ${cmd}`; lane UI: thay câu khẳng định cwd bằng cùng nếp wrap. KHÔNG đụng lane baseline.

- [ ] **Step 3: Chạy case → XANH; chạy trọn `bash tests/workflows/run-tests.sh` → không hồi quy.**

- [ ] **Step 4: Chiều đỏ mutant (AC-7)** — trong bản sao, nướng `cd <repoRoot> &&` vào cmd của lane baseline → case phải ĐỎ ghim «baseline mất phân biệt». Ghim đúng dòng case trong stdout (nếp P194), không tin mã thoát trọn suite.

- [ ] **Step 5: Commit** — `git commit -m "fix(verify): ghim chỗ đứng theo lane — verifier máy/UI cd repoRoot, baseline giữ worktree"`

---

### Task 4: Vắng mặt là tín hiệu · phân loại hạ-tầng-hỏng · dòng tổng kết lượt

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (chỗ gom kết quả lane máy/UI ~`:530-560`, chỗ tính verdict `:832-846`, chỗ dựng `runLog` `:790-810`)
- Create: `tests/workflows/round-signal.test.mjs`

**Interfaces:**
- Produces: dòng run-log `{kind:'vang-mat', round, evalId, reason}`; dòng `{kind:'round-tally', round, verdict, expected, returned, blocked, sha}`; phân loại `cd`-fail / exit 127 → `blocked[]`.
- Consumes: hàm đọc tally (cùng file, export nội bộ cho test) để round-trip.

- [ ] **Step 1: Case `vang-mat`** — harness cho một eval trả `null` → runLog có dòng `kind:'vang-mat'` mang evalId + round, verdict KHÔNG thuộc {PASS, PENDING-JUDGMENT}; đối chứng dương: đủ kết quả → 0 dòng vang-mat, verdict như cũ. Chạy: ĐỎ.

- [ ] **Step 2: Case `round-tally` hai ca** — ca sạch: expected = returned, blocked = 0; ca lệch (1 agent null): expected > returned, blocked ≥ 1, số khớp phép đếm độc lập từ danh sách lên lịch; reader rút lại đúng số từ chính dòng vừa sinh. Chiều đỏ: sửa bộ đếm trong bản sao → đỏ ghim tên khoá lệch; xoá một khoá → reader đỏ ghim tên khoá thiếu. Chạy: ĐỎ.

- [ ] **Step 3: Case `ha-tang-hong` ma trận 3 ô** — (a) kết quả mang dấu hiệu cd-thất-bại → `blocked[]` + dòng nguyên nhân; (b) exit 127 → `blocked[]` + dòng nguyên nhân; (c) exit 1 thường → vẫn FAIL sản phẩm. Chiều đỏ: gỡ nhánh phân loại trong bản sao → ô (a)/(b) đỏ ghim tên ca. Chạy: ĐỎ.

- [ ] **Step 4: Thi công cả ba** trong `acceptance-verify.js`: gom `null` thành vang-mat; nhận diện cd-fail/127 từ outputTail + exitCode đẩy sang `blocked`; append dòng round-tally cuối cùng vào `runLog`.

- [ ] **Step 5: Chạy trọn suite workflows → xanh, không hồi quy case cũ.**

- [ ] **Step 6: Commit** — `git commit -m "feat(verify): vắng mặt thành tín hiệu, hạ tầng hỏng đi BLOCKED, mỗi lượt một dòng tổng kết"`

---

### Task 5: Ngăn «không-sửa» + thẻ Cổng 2 + đường đọc-cũ

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js:183` (enum proposal), `:626-653` (prompt triage)
- Modify: `scripts/gate-card.js:686-705` (khối «Ngoài hợp đồng»)
- Create: `tests/plugins/wont-fix.test.mjs` (hoặc case trong suite plugins theo nếp runner)

**Interfaces:**
- Produces: `proposal ∈ {'known-limits','new-contract','wont-fix',''}`.

- [ ] **Step 1: Case `wont-fix`** — fixture finding code-sinh mang `proposal: 'wont-fix'` → thẻ render lựa chọn có tên; fixture ĐỜI CŨ (không có giá trị này) → thẻ render như hiện hành, exit 0, không cờ đỏ. Chiều đỏ mutant: gỡ nhánh render trong bản sao → đỏ ghim chuỗi rút từ nguồn thẻ. Chạy: ĐỎ.

- [ ] **Step 2: Thêm giá trị vào enum + một câu trong prompt triage + nhánh render thẻ.**

- [ ] **Step 3: Chạy case + trọn suite plugins → xanh.**

- [ ] **Step 4: Commit** — `git commit -m "feat(triage): ngăn không-sửa có tên trong schema và trên thẻ Cổng 2"`

---

### Task 6: SKILL S4 — gọi script, cấm fallback soạn tay

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (bước «Chuẩn bị args» của S4)
- Modify: `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh` (chân `skill-khong-fallback`)
- Modify: `_acceptance/config.yaml` (khoá `cdc_skill_khong_fallback`)
- Modify: các case đang ghim chuỗi của đoạn SKILL S4 cũ (grep trước khi sửa)

**Interfaces:**
- Produces: khối marker `S4-ARGS-CLAUSE` chứa điều khoản DỪNG + cấm fallback.

- [ ] **Step 1: Grep case đang ghim đoạn SKILL S4 cũ** — `grep -rn "Chuan bi args\|Chuẩn bị args" tests/ scripts/ lib/` — liệt kê để cập nhật theo VẬT mới, không hạ thước.

- [ ] **Step 2: Chân `skill-khong-fallback`** — hai vế: (a) khối marker `S4-ARGS-CLAUSE` có mặt và nội dung chứa cả hành-động-dừng lẫn cấm-fallback; (b) chuỗi mồi đại diện của khối 14-gạch cũ đã VẮNG. Chiều đỏ: chèn lại đoạn soạn-tay vào bản sao → vế (b) đỏ; rỗng ruột khối → vế (a) đỏ. Chạy: ĐỎ.

- [ ] **Step 3: Sửa SKILL.md** — thay 14 gạch bằng: gọi `s4-args.mjs` → đọc tệp → invoke Workflow; thêm khối marker `S4-ARGS-CLAUSE`; giữ `S4-ARGS-FRESHNESS` từ Task 2.

- [ ] **Step 4: Cập nhật case cũ đã liệt ở Step 1 theo vật mới; chạy trọn 4 suite → xanh.**

- [ ] **Step 5: Commit** — `git commit -m "docs(skill): S4 chuẩn bị args bằng máy — dừng khi script lỗi, không rơi về soạn tay"`

---

### Task 7: Khép vòng — bản đồ, coverage lint, chạy trọn lưới

**Files:**
- Modify: `PRODUCT-MAP.md` (máy sinh)

- [ ] **Step 1:** `node scripts/product-map.mjs --root .`
- [ ] **Step 2:** `node scripts/eval-coverage-lint.js .` — không W mới cho slug này.
- [ ] **Step 3:** Chạy cả 4 suite + `--check` bản đồ; mọi lệnh xanh.
- [ ] **Step 4: Commit** — `git commit -m "chore: vẽ lại bản đồ sản phẩm cùng lượt"`

---

## Self-Review

**Spec coverage:** AC-1/2 → Task 1 · AC-3/4/5 → Task 2 · AC-6/7 → Task 3 · AC-8/9/12 → Task 4 · AC-10 → Task 5 · AC-13 → Task 6 · AC-11 (tương thích) → chạy trọn suite workflows ở Task 3–6, case tương thích E11 nằm trong Task 4 Step 5.

**Placeholder scan:** không có TBD/TODO; mỗi step nêu vật cụ thể và lệnh chạy.

**Type consistency:** tên chân răng trong plan khớp khoá config đã khai trong evals.yaml (`cdc_args_du_truong`, `cdc_ref_hong_keu_to`, `cdc_round_tu_dem`, `cdc_carry_da_goi`, `cdc_loi_khai_pham_vi`, `cdc_skill_khong_fallback`); tên marker `S4-ARGS-FRESHNESS` (Task 2) và `S4-ARGS-CLAUSE` (Task 6) phân biệt rõ hai điều khoản.
