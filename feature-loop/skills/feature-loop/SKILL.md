---
name: feature-loop
description: Vòng lặp chuẩn phát triển 1 tính năng từ ý tưởng đến PR — hợp nhất Superpowers (brainstorm/plan/execute) + acceptance-gate (contract/evals/evidence/signoff) + Workflow orchestration. 2 điểm dừng human (Gate 1 duyệt design+contract+evals, Gate 2 duyệt evidence+signoff); T3 thêm Gate 1.5 duyệt plan. Use khi user nói "làm tính năng X", "/feature-loop <mô tả>", hoặc "/feature-loop <slug>" để resume. KHÔNG dùng cho hotfix T1 (docs/config nhỏ) — thoát ngay ở S0. YÊU CẦU: plugin acceptance-gate (cùng marketplace) + plugin superpowers đã cài; repo đích đã chạy acceptance-init (_acceptance/config.yaml).
---

# feature-loop

Nhạc trưởng điều phối — KHÔNG tự code thay các skill con, chỉ gọi đúng thứ tự và giữ 2 gate.

> 2 workflow script đi kèm nằm trong plugin. Đường dẫn: lấy "Base directory for this skill" khi skill này được nạp → `WORKFLOWS_DIR = <base-dir>/../../workflows/` (layout cache: `.../<plugin>/<version>/skills/feature-loop/` → `../../` = thư mục version chứa `workflows/`). TRƯỚC KHI invoke lần đầu: `ls "$WORKFLOWS_DIR"` phải thấy `acceptance-verify.js` + `execute-parallel.js` — không thấy → tìm bằng `ls -d $HOME/.claude/plugins/cache/*/feature-loop/*/workflows/` rồi dùng path đó. LUÔN invoke Workflow bằng `scriptPath` (abs path), KHÔNG bằng `name` — registry theo tên có thể cache bản script cũ. Script tự parse args nếu harness truyền JSON string.

## State machine & resume

Nguồn sự thật duy nhất: frontmatter `status` trong `_acceptance/<slug>/contract.md`.

| status hiện tại | Vào stage |
|---|---|
| (chưa có workspace/contract) | S0 → S1 |
| `draft` | Gate 1 (trình lại gói duyệt) |
| `approved` | S2 PLAN; plan của slug đã tồn tại → S3 tiếp tục task chưa xong (T3: plan chưa duyệt → Gate 1.5 trước) |
| `implemented` | S4 VERIFY |
| `verified` | Gate 2 (trình gói evidence) |
| `signed-off` | S5 SHIP |

Resume: `/feature-loop <slug>` → đọc status, vào đúng hàng trong bảng. Luôn nói rõ cho user đang ở stage nào trước khi làm.

## S0 — INTAKE

0. **Preflight dependency** (chỉ lần đầu mỗi repo/máy): skill `superpowers:brainstorming` + `superpowers:writing-plans` có trong danh sách skill khả dụng? References của acceptance-gate có tồn tại (`ls -d $HOME/.claude/plugins/cache/*/acceptance-gate/*/skills/acceptance/references/`)? Thiếu cái nào → DỪNG, đưa user lệnh cài cụ thể (`claude plugin install acceptance-gate@acceptance-gate-kit` / `claude plugin install superpowers@claude-plugins-official`), KHÔNG đi tiếp với lỗi mờ.
1. Xác định files dự kiến đụng (từ mô tả feature; chưa cần chính xác tuyệt đối).
2. Đọc `_acceptance/config.yaml` (chưa có → bảo user chạy `/acceptance-init` trước):
   - Match toàn bộ vào `risk_tiers.t1_skip_globs` → **T1: thoát loop**, báo user làm kiểu thường (verify suite thường của repo là đủ, không contract).
   - Match bất kỳ `risk_tiers.t3_paths` → **T3**. Còn lại **T2**.
3. Slug = kebab-case tên feature. Workspace: `_acceptance/<slug>/`.
4. Nếu giữa chừng phát hiện tier sai (vd T1 hóa ra đụng t3_paths) → nâng tier, quay lại stage thiếu (thường là S1 sinh contract).

## S1 — DESIGN (sinh 3 artifact CÙNG LÚC)

1. Invoke `superpowers:brainstorming` — hỏi đáp làm rõ như thường lệ.
2. Nếu feature chạm ≥3 subsystem (DB / API / core layer / UI / integration) hoặc user yêu cầu → chạy Workflow fan-out Explore readers (ad-hoc script, pattern 'Understand') trước khi đề xuất approach.
3. Kết thúc brainstorm, sinh CÙNG LÚC từ một ngữ cảnh:
   - Design doc → `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md` (hoặc convention spec của repo)
   - `_acceptance/<slug>/contract.md` — theo template plugin acceptance-gate (frontmatter schema_version/feature/slug/risk_tier/surfaces/status: draft; 5-15 AC Given/When/Then, tag `(judgment)` cho business-judgment; Out of scope ≥2 bullet)
   - `_acceptance/<slug>/evals.yaml` — map mỗi AC ≥1 eval; executor ưu tiên test > script > ui-check > judgment; cmd PHẢI là `config:` ref (vd `config:executors.test.api`), KHÔNG hardcode lệnh
4. **KHÔNG vào Gate 1 khi chưa đủ 3 artifact.** (HARD-GATE của brainstorming và Gate 1A/1B của kit gộp thành MỘT Gate 1.)

## GATE 1 (human — điểm dừng 1)

Trình MỘT gói: tóm tắt design (≤10 dòng) + contract.md NGUYÊN VĂN + bảng mapping AC → eval → executor. Hỏi đúng 1 câu: duyệt / sửa gì.

Khi duyệt: set contract `status: approved`, `approved_by`, `approved_at` (ISO); hỏi user số phút đã tốn ở gate → ghi `time_human_minutes.gate1`. Commit design doc + contract + evals.

## S2 — PLAN

1. Invoke `superpowers:writing-plans` → `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`.
2. Mỗi task PHẢI ghi: Files / verify command per-task / evals nó phục vụ (vd "phục vụ E1, E3") / cờ `independent: true|false` so với các task khác.
3. **T3: GATE 1.5** — trình tóm tắt plan (task list + files + thứ tự), chờ duyệt. T2: đi tiếp luôn, không dừng.

## S3 — EXECUTE

1. Mặc định: thực thi plan TUẦN TỰ trong main loop (theo `superpowers:executing-plans` hoặc subagent-driven nếu đang theo skill đó). Quy ước verify của repo (CLAUDE.md) THẮNG default của skill con nếu xung đột (vd repo cấm test framework → verify per-task = build/typecheck/smoke của repo).
2. Plan có ≥2 task `independent: true` → gom các task đó, invoke Workflow:
   `Workflow({ scriptPath: '<WORKFLOWS_DIR>/execute-parallel.js', args: { planPath: '<abs plan path>', repoRoot: '<abs repo root>', tasks: [{ id, title, summary, files, verifyCmd }] } })` (WORKFLOWS_DIR xem ghi chú đầu file)
   Xong: merge các branch worktree về feature branch (task failed → tự fix tuần tự trong main loop).
3. Kết thúc S3 (mọi task xong + verify per-task pass): set contract `status: implemented`. KHÔNG tự chạy evals — doer ≠ grader, đó là việc của S4.

## S4 — VERIFY (một Workflow run)

1. Chuẩn bị args (main loop đọc file, script không có filesystem):
   - Parse `_acceptance/<slug>/evals.yaml`.
   - Resolve mỗi `cmd: config:a.b.c` → đọc `_acceptance/config.yaml`, đi theo dotted path (vd `executors.test.api` → lệnh thật). GIỮ ref gốc vào field `ref` của mỗi eval (synthesize ghi `verifier:` bằng ref này — hook L2 không nhận lệnh resolved). Ref không resolve được → DỪNG, báo user (không đoán lệnh).
   - `suiteCommands` = resolve list `feature_loop.suite_keys` trong `_acceptance/config.yaml` (mỗi phần tử là dotted key, vd `executors.test.build`). **Thiếu section này → DỪNG hỏi user MỘT lần**: liệt kê các key đang có trong `executors.*`, user chọn những lệnh chạy mỗi round verify (build/typecheck/lint... của repo đó) → GHI vào config.yaml rồi đi tiếp (lần sau không hỏi lại). KHÔNG đoán theo Node convention, KHÔNG tự lấy toàn bộ `executors.*` — itest của feature KHÁC có thể flaky đốt round; itest của chính feature đã nằm trong evals. (suiteCommands rỗng vẫn hợp lệ nếu evals có executor máy — script tự BLOCKED khi không còn gì để verify.)
   - Resolve `inputs` của judgment evals thành abs path (gốc: `_acceptance/<slug>/`).
   - Tìm references của plugin acceptance-gate (KHÔNG hardcode version): `ls -d $HOME/.claude/plugins/cache/*/acceptance-gate/*/skills/acceptance/references/` → lấy bản mới nhất → `personasPath` = `<dir>/judge-personas.md`, `templatePath` = `<dir>/evidence-report-template.md`. Không thấy → DỪNG, báo user cài plugin acceptance-gate (preflight S0 lẽ ra đã bắt).
   - Repo có skill review invariant riêng (vd `.claude/skills/<review-skill>/SKILL.md`) → truyền abs path vào `reviewSkillPath`; không có → bỏ qua, script tự review theo conventions (CLAUDE.md/CONTRIBUTING.md).
   - `riskTier` từ contract frontmatter; `diffBase` = merge-base với nhánh chính. Detect nhánh chính: `git remote show origin | grep 'HEAD branch'`, không có remote thì thử lần lượt main/master/develop/trunk (`git rev-parse --verify <branch>`); không detect được → hỏi user, KHÔNG để `git merge-base` fail mờ.
   - `round`: chưa có `evidence-report.md` → 1; có rồi → đếm số round trong section `## Iterations` + 1. (REJECT không đổi contract status — session mới resume PHẢI đọc round từ đây, nếu không cap 3 round bị reset và run_id mint trùng.)
2. Invoke: `Workflow({ scriptPath: '<WORKFLOWS_DIR>/acceptance-verify.js', args: { slug, round, riskTier, evals, suiteCommands, diffBase, repoRoot, personasPath, templatePath, reviewSkillPath? } })` (debug fan-out không tốn agent: thêm `dryRun: true` → trả về distinctCommands/judgePanels, không chạy gì).
3. Routing theo verdict trả về:
   - `REJECT` → quay S3 fix `failedEvals` + `failedCommands` + `confirmedFindings`, rồi S4 round mới (round + 1). **Tối đa 3 round** — quá → DỪNG, escalate user kèm phân tích từng round. `reportPath` thiếu ở round REJECT → cảnh báo user lịch sử Iterations của round này không được ghi.
   - `BLOCKED` → đọc `blocked[].cmd` + `blocked[].reason` từ kết quả, trình NGUYÊN VĂN cho user rồi khắc phục nguyên nhân, chạy lại CÙNG round. Không bao giờ downgrade BLOCKED thành pass.
   - `PASS` / `PENDING-JUDGMENT` → kiểm tra `reportPath` có giá trị (synthesize agent có thể chết); thiếu → chạy lại S4 cùng round. Có → set contract `status: verified` → Gate 2. `reviewIncomplete` không rỗng → ghi cảnh báo vào gói Gate 2.
4. Workflow đứt giữa chừng (crash/cancel) → resume `resumeFromRunId` CÙNG round. Đã fix code → LUÔN run mới, không cache.

## GATE 2 (human — điểm dừng 2)

Trình MỘT gói: verdict + bảng per-eval (đọc từ `reportPath` = evidence-report.md) + judge panel proposals + review findings (đọc từ `findingsPath` = review-findings.md, gồm cả section "chưa adversarial-verify" nếu có) + cảnh báo reviewIncomplete nếu có + diff summary (`git diff --stat <diffBase>...HEAD`). Liệt kê rõ từng UNCERTAIN user phải đích thân kiểm.

User: điền `human_override: <tên> <ngày>` cho từng UNCERTAIN (T3: MỌI judgment item), nâng PENDING-JUDGMENT → PASS nếu đồng ý, điền `human_signoff` + `time_human_minutes.gate2`. Xong: set contract `status: signed-off`, commit evidence.

## S5 — SHIP

Invoke `superpowers:finishing-a-development-branch` → PR theo quy trình repo (không push thẳng nhánh chính nếu repo cấm). Update doc trạng thái của repo nếu có. CI pre-merge check của acceptance-gate kit (`scripts/pre-merge-check.sh`) là chốt chặn độc lập — không bypass; repo CHƯA wire nó vào CI → cảnh báo user rõ ràng (gate không enforce trước merge, xem README của kit cách wire).

## Quy tắc gộp xung đột

- Quy ước verify của repo (CLAUDE.md) THẮNG default của skill con (vd TDD) nếu xung đột. Bù lại luôn có **evals-first**: evals.yaml duyệt TRƯỚC khi code.
- `verification-before-completion` → được thỏa bởi evidence S4, không verify trùng lần hai.
- Doer ≠ grader → main loop đã code thì KHÔNG tự chấm; mọi verifier/judge là fresh Workflow agents.
