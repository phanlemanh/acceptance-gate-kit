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

**Staleness guard (mọi feature, chạy TRƯỚC khi trình Gate 2):** khi resume vào `verified`, đọc `verified_commit` trong frontmatter `evidence-report.md`. Có field → chạy `git diff --name-only <verified_commit>`: nếu có file đổi NGOÀI `_acceptance/` và không khớp `risk_tiers.t1_skip_globs` → evidence STALE (code đổi sau verify): báo user, hạ contract `status: implemented`, vào S4 round mới — KHÔNG trình Gate 2 trên evidence cũ. Không có field (report từ template cũ) → cảnh báo "evidence chưa pin commit, khuyên re-verify", không tự hạ. (CI `pre-merge-check.sh` chặn độc lập cùng luật — guard này bắt sớm để đỡ tốn round.)

## Làn design (design-loop guards — có điều kiện, no-op nếu không áp dụng)

Các bước dưới có gắn **🎨 guard**: CHỈ kích hoạt khi feature là **surface web-UI** (`contract.surfaces` có mục web-ui/màn hình/plugin-view) **VÀ** design-loop đã wire (dưới `executors:` trong `_acceptance/config.yaml` có khối `design:` — do `/design-init` tạo). Feature headless HOẶC repo chưa wire design-loop → **mọi 🎨 bỏ qua hoàn toàn** (v1.7 hành xử y v1.6). Nhận biết wire: `grep -qE '^  design:' _acceptance/config.yaml`. Guard đóng các đứt gãy đã audit: (1) bắc cầu Claude Design không dựa trí nhớ/skill-auto-load, (2) gate thấy được mockup, (3) fidelity-skip không xanh-lặng, (4) resume không bỏ quên làn design.

**🎨 Resume guard (surface web-UI + wired):** khi resume, ngoài đọc `status`, `stat` `_acceptance/<slug>/evidence/design/reference/` + `provenance.json`. Nếu `status` ≥ `approved` mà THIẾU mockup provenance → báo user + route lại `/design-mockup <slug>`, KHÔNG tiến qua Gate 1 (state machine chỉ thấy `status`, không thấy tiến-độ làn design — guard này bù).

## S0 — INTAKE

0. **Preflight dependency** (chỉ lần đầu mỗi repo/máy): skill `superpowers:brainstorming` + `superpowers:writing-plans` có trong danh sách skill khả dụng? References của acceptance-gate có tồn tại (`ls -d $HOME/.claude/plugins/cache/*/acceptance-gate/*/skills/acceptance/references/`)? Thiếu cái nào → DỪNG, đưa user lệnh cài cụ thể (`claude plugin install acceptance-gate@acceptance-gate-kit` / `claude plugin install superpowers@claude-plugins-official`), KHÔNG đi tiếp với lỗi mờ.
1. Xác định files dự kiến đụng (từ mô tả feature; chưa cần chính xác tuyệt đối).
2. Đọc `_acceptance/config.yaml` (chưa có → bảo user chạy `/acceptance-init` trước):
   - Match toàn bộ vào `risk_tiers.t1_skip_globs` → **T1: thoát loop**, nhưng KHÔNG thoát im lặng: in bảng match (`<path dự kiến> → <glob>`), hỏi user XÁC NHẬN kết luận T1 rồi mới thoát, kèm cảnh báo backstop CI (`pre-merge-check.sh --base <ref>`) sẽ chặn merge nếu PR thực tế đụng path gated mà không có `_acceptance/` artifacts.
   - Match bất kỳ `risk_tiers.t3_paths` → **T3**. Còn lại **T2**.
3. Slug = kebab-case tên feature. Workspace: `_acceptance/<slug>/`. **Guard trùng slug:** workspace đã tồn tại → so `feature:` (và `owner:`) trong frontmatter contract với mô tả hiện tại — KHÁC feature → đây là ĐỤNG slug chứ không phải resume: BẮT đổi slug mới (đề xuất `<slug>-2` hoặc suffix ngày), tuyệt đối không im lặng ghi đè workspace của feature khác; CÙNG feature → resume theo bảng state. Contract mới sinh ở S1 phải ghi `owner:` = `git config user.email`.
4. Nếu giữa chừng phát hiện tier sai (vd T1 hóa ra đụng t3_paths) → nâng tier, quay lại stage thiếu (thường là S1 sinh contract).
5. **🎨 guard (surface web-UI).** Nếu feature chạm surface web-UI:
   - `config.yaml` CHƯA có khối `executors.design.*` (design-loop chưa wire) → **CẢNH BÁO** (KHÔNG chặn): đề nghị `claude plugin install design-loop@acceptance-gate-kit` + `/design-init` để có coverage design (mockup/fidelity); hoặc user xác nhận đi tiếp functional-only. (Đóng đứt gãy: thiếu `/design-init` → 2b tự vô hiệu im lặng HOẶC S4 STOP.)
   - Đã wire → làn design ACTIVE (các 🎨 dưới có hiệu lực). Nếu `provenance.design_repo` set mà repo KHÔNG reachable → cảnh báo trước khi tới S1-D (fidelity sẽ skip).

## S1 — DESIGN (sinh 3 artifact CÙNG LÚC)

1. Invoke `superpowers:brainstorming` — hỏi đáp làm rõ như thường lệ.
2. Nếu feature chạm ≥3 subsystem (DB / API / core layer / UI / integration) hoặc user yêu cầu → chạy Workflow fan-out Explore readers (ad-hoc script, pattern 'Understand') trước khi đề xuất approach. Mỗi reader truyền `model: 'haiku'` — đọc-và-tóm-tắt không cần model lớn (synthesize approach vẫn ở main loop).
3. Kết thúc brainstorm, sinh CÙNG LÚC từ một ngữ cảnh:
   - Design doc → `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md` (hoặc convention spec của repo)
   - `_acceptance/<slug>/contract.md` — theo template plugin acceptance-gate (frontmatter schema_version/feature/slug/risk_tier/surfaces/status: draft; 5-15 AC Given/When/Then, tag `(judgment)` cho business-judgment; Out of scope ≥2 bullet)
   - `_acceptance/<slug>/evals.yaml` — map mỗi AC ≥1 eval; executor ưu tiên test > script > ui-check > judgment; cmd PHẢI là `config:` ref (vd `config:executors.test.api`), KHÔNG hardcode lệnh
4. **KHÔNG vào Gate 1 khi chưa đủ 3 artifact.** (HARD-GATE của brainstorming và Gate 1A/1B của kit gộp thành MỘT Gate 1.)
5. **🎨 guard (surface web-UI + wired).** Làn design phải sinh **state-matrix + token-seam** (trong design-doc) + tách AC objective/perceptual (skill `design-subtrack` của design-loop). Cuối S1, KIỂM trực tiếp (KHÔNG dựa skill auto-load): design-doc có state-matrix chưa, và `_acceptance/<slug>/evidence/design/reference/` + `provenance.json` có chưa. **THIẾU → DỪNG, in cho user NGUYÊN VĂN: "surface web-UI — chạy `/design-mockup <slug>` trước Gate 1".** Bước in tất định này đóng đứt gãy T2→T3 + trường hợp skill auto-load không kích hoạt.

## GATE 1 (human — điểm dừng 1)

**BƯỚC MẶC ĐỊNH — render thẻ quyết định TRƯỚC:** invoke `/acceptance-card <slug>` (tự nhận Cổng 1 từ contract.status) — trình "sẽ làm / sẽ KHÔNG làm" + cờ phủ-biên bằng ngôn ngữ sản phẩm thay vì YAML thô — RỒI hỏi đúng 1 câu: duyệt / sửa gì. Đính kèm gói text đầy đủ để user soi sâu khi cần: tóm tắt design (≤10 dòng) + contract.md NGUYÊN VĂN + bảng mapping AC → eval → executor. Thẻ chỉ là lớp trình bày — contract/evals vẫn là nguồn-sự-thật, quyết định vẫn vào `approved_by`. (Lệnh/script `/acceptance-card` không có → cài/cập nhật plugin acceptance-gate, hoặc tạm trình gói text.)

**🎨 Gate-1 hard-gate (surface web-UI + wired):** KHÔNG render acceptance-card / vào Gate 1 khi thiếu **mockup provenance + state-matrix** cho `<slug>` (feature-loop vốn chỉ gate 3 artifact và MÙ với làn design — guard này thêm chiều design). Nếu user CHỦ ĐỘNG bỏ làn design → ghi `design_subtrack: skipped-by-user` vào contract để skip là HIỆN, không vô hình.

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
   - Parse `_acceptance/<slug>/evals.yaml` (giữ field `runs` nếu có — int>1 = eval ngẫu nhiên/LLM, script chạy N lần → pass_rate + variance; default 1).
   - Resolve mỗi `cmd: config:a.b.c` → đọc `_acceptance/config.yaml`, đi theo dotted path (vd `executors.test.api` → lệnh thật). GIỮ ref gốc vào field `ref` của mỗi eval (synthesize ghi `verifier:` bằng ref này — hook L2 không nhận lệnh resolved). Ref không resolve được → DỪNG, báo user (không đoán lệnh).
   - `suiteCommands` = resolve list `feature_loop.suite_keys` trong `_acceptance/config.yaml` (mỗi phần tử là dotted key, vd `executors.test.build`). **Thiếu section này → DỪNG hỏi user MỘT lần**: liệt kê các key đang có trong `executors.*`, user chọn những lệnh chạy mỗi round verify (build/typecheck/lint... của repo đó) → GHI vào config.yaml **bằng script splice chung, KHÔNG tự edit tay**: `node <acceptance-gate-plugin-root>/scripts/config-patch.mjs --config _acceptance/config.yaml --key feature_loop.suite_keys --value "[<key1>, <key2>]" --write` (plugin-root = thư mục cha của references đã tìm ở bước dưới; script dry-run mặc định, `.bak` khi ghi, ABORT nếu key đã tồn tại) rồi đi tiếp (lần sau không hỏi lại). KHÔNG đoán theo Node convention, KHÔNG tự lấy toàn bộ `executors.*` — itest của feature KHÁC có thể flaky đốt round; itest của chính feature đã nằm trong evals. (suiteCommands rỗng vẫn hợp lệ nếu evals có executor máy — script tự BLOCKED khi không còn gì để verify.)
   - Resolve `inputs` của judgment evals thành abs path (gốc: `_acceptance/<slug>/`).
   - Tìm references của plugin acceptance-gate (KHÔNG hardcode version): `ls -d $HOME/.claude/plugins/cache/*/acceptance-gate/*/skills/acceptance/references/` → lấy bản mới nhất → `personasPath` = `<dir>/judge-personas.md`, `templatePath` = `<dir>/evidence-report-template.md`. Không thấy → DỪNG, báo user cài plugin acceptance-gate (preflight S0 lẽ ra đã bắt).
   - Repo có skill review invariant riêng (vd `.claude/skills/<review-skill>/SKILL.md`) → truyền abs path vào `reviewSkillPath`; không có → bỏ qua, script tự review theo conventions (CLAUDE.md/CONTRIBUTING.md).
   - `riskTier` từ contract frontmatter; `diffBase` = merge-base với nhánh chính. Detect nhánh chính: `git remote show origin | grep 'HEAD branch'`, không có remote thì thử lần lượt main/master/develop/trunk (`git rev-parse --verify <branch>`); không detect được → hỏi user, KHÔNG để `git merge-base` fail mờ.
   - `invokedAt` = `date -u +%Y-%m-%dT%H:%M:%SZ` (script bị cấm `Date` — timestamp cho các dòng run-log.jsonl phải truyền từ ngoài vào).
   - `round`: chưa có `evidence-report.md` → 1; có rồi → đếm số round trong section `## Iterations` + 1. (REJECT không đổi contract status — session mới resume PHẢI đọc round từ đây, nếu không cap 3 round bị reset và run_id mint trùng.)
2. Invoke: `Workflow({ scriptPath: '<WORKFLOWS_DIR>/acceptance-verify.js', args: { slug, round, riskTier, evals, suiteCommands, diffBase, repoRoot, personasPath, templatePath, reviewSkillPath? } })` (debug fan-out không tốn agent: thêm `dryRun: true` → trả về distinctCommands/judgePanels, không chạy gì).
3. Routing theo verdict trả về:
   - `REJECT` → quay S3 fix `failedEvals` + `failedCommands` + `confirmedFindings`, rồi S4 round mới (round + 1). **Tối đa 3 round** — quá → DỪNG, escalate user kèm phân tích từng round. `reportPath` thiếu ở round REJECT → cảnh báo user lịch sử Iterations của round này không được ghi.
   - `BLOCKED` → đọc `blocked[].cmd` + `blocked[].reason` từ kết quả, trình NGUYÊN VĂN cho user rồi khắc phục nguyên nhân, chạy lại CÙNG round. Không bao giờ downgrade BLOCKED thành pass.
   - `PASS` / `PENDING-JUDGMENT` → kiểm tra `reportPath` có giá trị (synthesize agent có thể chết); thiếu → chạy lại S4 cùng round. Có → set contract `status: verified`, rồi **COMMIT NGAY gói evidence máy-viết** (evidence-report.md + run-log.jsonl + contract + evidence/) TRƯỚC khi vào Gate 2 — commit này KHÔNG chứa chữ ký người; repo bật `signoff.require_human_commit` thì pre-merge bắt buộc tách như vậy, và commit sớm cũng tránh dính stale-guard. → Gate 2. `reviewIncomplete` không rỗng → ghi cảnh báo vào gói Gate 2.
   - **Mọi verdict:** nếu kết quả có `runLogWriteFailed: true` → main loop TỰ append từng dòng trong `result.runLog` (nguyên văn, mỗi phần tử 1 dòng) vào `_acceptance/<slug>/run-log.jsonl` NGAY (Bash `printf '%s\n' ... >>`) — hook + CI đối chiếu run_id trong report với log này; thiếu log là PASS bị chặn oan ở recheck strict.
4. Workflow đứt giữa chừng (crash/cancel) → resume `resumeFromRunId` CÙNG round. Đã fix code → LUÔN run mới, không cache.
5. **🎨 guard (surface web-UI).** Eval `config:executors.design.fidelity` là ADVISORY: nếu nó trả "skipped" (thiếu design-repo / `provenance.design_repo`) → **in WARN RÕ vào gói Gate 2**: "fidelity pixel-diff KHÔNG chạy — thị-giác CHƯA được so", KHÔNG để lẫn vào PASS xanh. (Đóng đứt gãy: xanh ≠ đã-diff.)

## GATE 2 (human — điểm dừng 2)

**BƯỚC MẶC ĐỊNH — render thẻ quyết định TRƯỚC:** invoke `/acceptance-card <slug>` (tự nhận Cổng 2) — judgment + scope (việc-của-người) lên đầu bằng ngôn ngữ sản phẩm, "máy đã lo" thu gọn, luôn kèm đảo-ngược. Đính kèm gói text đầy đủ để soi sâu: verdict + bảng per-eval (đọc từ `reportPath` = evidence-report.md) + judge panel proposals + review findings (đọc từ `findingsPath` = review-findings.md, gồm cả section "chưa adversarial-verify" nếu có) + cảnh báo reviewIncomplete nếu có + diff summary (`git diff --stat <diffBase>...HEAD`). Thẻ chỉ là lớp trình bày — verdict/hook/evidence vẫn là nguồn-sự-thật. (Lệnh/script `/acceptance-card` không có → cài/cập nhật plugin acceptance-gate, hoặc tạm trình gói text.)

**Judgment item trình cho user PHẢI ở dạng câu hỏi nghiệp vụ phi kỹ thuật** — user là người quyết kinh doanh, không phải engineer. Mỗi item: dịch thành 1 câu hỏi có/không hoặc lựa chọn a/b bằng ngôn ngữ SẢN PHẨM (không jargon schema/tool/migration), kèm (1) đề xuất của Claude + lý do 1 dòng, (2) hệ quả mỗi lựa chọn, (3) lựa chọn có đảo ngược được không. **Tính năng MỚI chưa có số liệu:** đừng bắt user phán bằng data — câu hỏi đúng là "đúng intent đã duyệt ở Gate 1 chưa · ship được chưa · đổi sau có rẻ không"; phương án đảo-ngược-được + ghi chú revisit là mặc định hợp lệ, data thật sau khi ship sẽ vào contract của vòng sau.

**🎨 Gate-2 guard (surface web-UI + có AC perceptual):** TRƯỚC khi hỏi signoff, in cho user "chạy `/design-evidence <slug>`" và đính panel onion-skin ref↔impl. KHÔNG đánh dấu AC perceptual `resolved` khi CHƯA có panel (đóng đứt gãy: ký perceptual chỉ trên chữ). Nếu S4 có WARN fidelity-skip → nêu lên đầu gói Gate 2.

User: điền `human_override: <tên> <ngày>` cho từng UNCERTAIN (T3: MỌI judgment item), nâng PENDING-JUDGMENT → PASS nếu đồng ý, điền `human_signoff` + `time_human_minutes.gate2`. Xong: set contract `status: signed-off`, rồi commit **RIÊNG** các edit Gate-2 này — trong evidence-report.md commit đó chỉ được chạm các dòng human-owned (`human_signoff` / `human_override` / `verdict` nâng cấp / `bypass_ack`); evidence máy-viết đã commit từ cuối S4. Người duyệt tự commit, hoặc ra lệnh cho agent commit đúng mỗi phần đó (repo bật `signoff.require_human_commit` → pre-merge chặn chữ ký sinh cùng commit với body report).

## S5 — SHIP

Invoke `superpowers:finishing-a-development-branch` → PR theo quy trình repo (không push thẳng nhánh chính nếu repo cấm). Update doc trạng thái của repo nếu có. CI pre-merge check của acceptance-gate kit (`scripts/pre-merge-check.sh`) là chốt chặn độc lập — không bypass; repo CHƯA wire nó vào CI → cảnh báo user rõ ràng (gate không enforce trước merge, xem README của kit cách wire).

## Quy tắc gộp xung đột

- Quy ước verify của repo (CLAUDE.md) THẮNG default của skill con (vd TDD) nếu xung đột. Bù lại luôn có **evals-first**: evals.yaml duyệt TRƯỚC khi code.
- `verification-before-completion` → được thỏa bởi evidence S4, không verify trùng lần hai.
- Doer ≠ grader → main loop đã code thì KHÔNG tự chấm; mọi verifier/judge là fresh Workflow agents.
