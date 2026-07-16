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

Resume: `/feature-loop <slug>` → đọc status, vào đúng hàng trong bảng. Luôn nói rõ cho user đang ở stage nào trước khi làm. Có `decisions.jsonl` → đọc (parse từng dòng, dòng hỏng bỏ qua + báo số lượng), tóm tắt "đã chốt: <id — decision>" cho user và KHÔNG lật lại các quyết định đó trừ khi đi nghi thức `supersedes` + human phê ở gate kế; file vắng → bỏ qua, không nhắc gì.

**Staleness guard (mọi feature, chạy TRƯỚC khi trình Gate 2):** khi resume vào `verified`, đọc `verified_commit` trong frontmatter `evidence-report.md`. Có field → chạy `git diff --name-only <verified_commit>`: nếu có file đổi NGOÀI `_acceptance/` và không khớp `risk_tiers.t1_skip_globs` → evidence STALE (code đổi sau verify): báo user, hạ contract `status: implemented`, vào S4 round mới — KHÔNG trình Gate 2 trên evidence cũ. **Round staleness này là ROUND DELTA (Đợt 5):** khi report cũ verdict PASS-family, GIỮ lại `deltaFiles` (danh sách file đổi, loại `_acceptance/**`) + `verified_commit` cũ làm anchor cho carry-forward P1 ở bước chuẩn-bị-args S4; round fix sau REJECT không có anchor → full re-run như cũ. Không có field (report từ template cũ) → cảnh báo "evidence chưa pin commit, khuyên re-verify", không tự hạ. (CI `pre-merge-check.sh` chặn độc lập cùng luật — guard này bắt sớm để đỡ tốn round.)

## Sổ quyết định (decisions.jsonl — rationale, KHÔNG phải scope-truth)

`_acceptance/<slug>/decisions.jsonl` — append-only, 1 dòng JSON/quyết định; ledger KHÔNG BAO GIỜ override contract/evals (descope một AC = sửa contract + re-approve; ledger chỉ ghi *vì sao*; mâu thuẫn ledger↔contract = lỗi phải báo user). Schema: `{"id":"d-<UTC>-<rand>","type":"descope|approach|fix|revisit","stage":"S1|S2|S3|S4-r<N>|gate1|gate2","at":"<ISO>","decision":"1 câu","impact":"tiết kiệm gì · rủi ro gì"}` + optional `serves:["AC-2"]`, `revisit`, `supersedes:"<id>"`. Append (không script mới): `printf '%s\n' '<json 1 dòng>' >> _acceptance/<slug>/decisions.jsonl` với id `d-$(date -u +%Y%m%dT%H%M%SZ)-$RANDOM`.

**Rule đáng-log (chống nhiễu):** CHỈ khi (a) loại một phương án khả dĩ ∨ (b) cố tình nhận downside ∨ (c) có điều kiện revisit. Không có phương án thay thế → KHÔNG log; feature đơn giản 0 entry là hợp lệ. `descope` = ưu tiên 1 — quyết định "không làm" vô hình trong code, đắt nhất khi bị lật lại.

**Điểm ghi (friction ≈ 0, cuối stage):** cuối S1 (approach/descope chưng cất từ brainstorm — design-doc giữ văn xuôi) · cuối S2 (lựa chọn load-bearing của plan) · giữa S3 khi buộc đổi hướng so với plan · mỗi S4 REJECT→fix: `stage:"S4-r<N>"`, ghi cách-sửa-đã-chọn + vì sao · Gate 2 nếu human để lại revisit/override. **Seal:** khi Gate 1 duyệt, append `{"id":"d-...","type":"seal","gate":1,"at":"<ISO>"}` CÙNG LÚC set `approved_by` — mọi dòng SAU seal là provisional bất kể `stage` tự khai, card Gate 2 trình riêng khối "CHƯA duyệt" cho human phê. **Lật quyết định:** entry mới `supersedes:"<id>"` + human phê ở gate kế — không sửa/xóa dòng cũ.

## Làn design (2 công tắc — bảng tra duy nhất, KHÔNG lưu field tier)

Mọi điểm 🎨 dưới đây tra bảng này — mỗi điểm là MỘT câu hỏi nhị phân, không nhánh phụ:

| Công tắc | Điều kiện (máy-đọc, derive từ artifact) | Khi bật |
|---|---|---|
| **CT1 — chạm UI** (rẻ, tự động) | `node <design-loop>/scripts/design-detect-surface.mjs --slug <slug>` trả `surface:true` **∧** config có `executors.design.*` (đã `/design-init`) | S1: static evals per-surface (cmd `config:executors.design.static` + target + capture `--html` + `--require-html`) + eval `config:executors.design.gate` (P0 floor, cùng capture) + vài dòng "surface & state chạm" trong design-doc + câu hỏi lane cuối S1 · S4: fidelity ADVISORY nếu surface có reference cũ · Gate 2: ghi lane vào gói |
| **CT2 — ceremony design-of-record** (đắt, human bật) | `_acceptance/<slug>/evidence/design/provenance.json` tồn tại **∨** `evals.yaml` có executor `design.fidelity` | S1-D `/design-mockup <slug>` TRƯỚC Gate 1 · hard-gate mockup + state-matrix (S1 kiểm cuối, Gate 1, resume-guard) · S4 WARN rõ khi fidelity skip · Gate 2 panel `/design-evidence <slug>` cho AC perceptual |

Từ vựng hiển thị: **D0** = ¬CT1 · **D1** = CT1∧¬CT2 · **D2** = CT1∧CT2 — chỉ để nói chuyện với user/card, không lưu đâu cả. CT1 có tín hiệu nhưng repo CHƯA wire design-loop → CẢNH BÁO (không chặn) như trước, và việc static-không-chạy phải hiện trong gói Gate 2. AC perceptual-so-chuẩn xuất hiện trong contract mà CT2 đang OFF → nhắc user nâng lane (cần chuẩn để so = phải có chuẩn), không tự chặn.

**Câu hỏi lane (cuối S1, CHỈ khi CT1 bật ∧ CT2 chưa bật — 1 câu):** "Surface mới/redesign → vẽ mockup (`/design-mockup <slug>`, ceremony đầy đủ)? Hay tweak surface có sẵn → static-only?" Trả lời xong: append ledger entry AUTO-DRAFT (máy điền signals + decision + impact, user chỉ xác nhận — LUÔN ghi cho quyết định lane): chọn ceremony = `type:"approach"`; chọn static-only = `type:"descope"` với impact "bỏ mockup/fidelity/panel — tiết kiệm công vẽ + phê; đổi lại không có chuẩn thị giác để so".

**Lưới S4 tier-mismatch (chạy ở bước chuẩn-bị-args S4):** config có `design.surface_globs` → chạy `git diff --name-only <diffBase>`; có file khớp glob mà `evals.yaml` KHÔNG có eval design nào (static/fidelity) → DỪNG, báo user: "diff chạm surface (`<path>` → `<glob>`) nhưng lane hiện tại không có design eval — nâng lane (thêm static evals / chạy `/design-mockup`) hoặc xác nhận + ghi entry `descope`". Key vắng → bỏ qua lưới, ghi chú 1 dòng vào gói Gate 2.

🎨 Resume guard **(CT2)**: khi resume, nếu CT2 bật (tra bảng) và `status` ≥ `approved` mà THIẾU mockup provenance → báo user + route `/design-mockup <slug>`, KHÔNG tiến qua Gate 1.

## S0 — INTAKE

0. **Preflight dependency** (chỉ lần đầu mỗi repo/máy): skill `superpowers:brainstorming` + `superpowers:writing-plans` có trong danh sách skill khả dụng? References của acceptance-gate có tồn tại (`ls -d $HOME/.claude/plugins/cache/*/acceptance-gate/*/skills/acceptance/references/`)? Thiếu cái nào → DỪNG, đưa user lệnh cài cụ thể (`claude plugin install acceptance-gate@acceptance-gate-kit` / `claude plugin install superpowers@claude-plugins-official`), KHÔNG đi tiếp với lỗi mờ.
1. Xác định files dự kiến đụng (từ mô tả feature; chưa cần chính xác tuyệt đối).
2. Đọc `_acceptance/config.yaml` (chưa có → bảo user chạy `/acceptance-init` trước):
   - Match toàn bộ vào `risk_tiers.t1_skip_globs` → **T1: thoát loop**, nhưng KHÔNG thoát im lặng: in bảng match (`<path dự kiến> → <glob>`), hỏi user XÁC NHẬN kết luận T1 rồi mới thoát, kèm cảnh báo backstop CI (`pre-merge-check.sh --base <ref>`) sẽ chặn merge nếu PR thực tế đụng path gated mà không có `_acceptance/` artifacts.
   - Match bất kỳ `risk_tiers.t3_paths` → **T3**. Còn lại **T2**.
3. Slug = kebab-case tên feature. Workspace: `_acceptance/<slug>/`. **Guard trùng slug:** workspace đã tồn tại → so `feature:` (và `owner:`) trong frontmatter contract với mô tả hiện tại — KHÁC feature → đây là ĐỤNG slug chứ không phải resume: BẮT đổi slug mới (đề xuất `<slug>-2` hoặc suffix ngày), tuyệt đối không im lặng ghi đè workspace của feature khác; CÙNG feature → resume theo bảng state. Contract mới sinh ở S1 phải ghi `owner:` = `git config user.email`.
4. Nếu giữa chừng phát hiện tier sai (vd T1 hóa ra đụng t3_paths) → nâng tier, quay lại stage thiếu (thường là S1 sinh contract).
5. 🎨 **(CT1 signals)** Feature có vẻ chạm UI mà config CHƯA có `executors.design.*` → CẢNH BÁO (không chặn): đề nghị cài design-loop + `/design-init`, hoặc user xác nhận đi tiếp functional-only (sẽ hiện ở gói Gate 2). Đã wire → làn design theo bảng tra. Nếu `provenance.design_repo` set mà repo KHÔNG reachable → cảnh báo ngay từ S0, trước khi tốn công S1-D (fidelity sẽ skip).

## S1 — DESIGN (sinh 3 artifact CÙNG LÚC)

1. Invoke `superpowers:brainstorming` — hỏi đáp làm rõ như thường lệ.
2. Nếu feature chạm ≥3 subsystem (DB / API / core layer / UI / integration) hoặc user yêu cầu → chạy Workflow fan-out Explore readers (ad-hoc script, pattern 'Understand') trước khi đề xuất approach. Mỗi reader truyền `model: 'haiku'` — đọc-và-tóm-tắt không cần model lớn (synthesize approach vẫn ở main loop).
3. Kết thúc brainstorm, sinh CÙNG LÚC từ một ngữ cảnh:
   - Design doc → `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md` (hoặc convention spec của repo)
   - `_acceptance/<slug>/contract.md` — theo template plugin acceptance-gate (frontmatter schema_version/feature/slug/risk_tier/surfaces/status: draft; 5-15 AC Given/When/Then, tag `(judgment)` cho business-judgment; Out of scope ≥2 bullet)
   - `_acceptance/<slug>/evals.yaml` — map mỗi AC ≥1 eval; executor ưu tiên test > script > ui-check > judgment; cmd PHẢI là `config:` ref (vd `config:executors.test.api`), KHÔNG hardcode lệnh. Mỗi eval máy/ui NÊN khai `paths: [<glob tương đối repo>]` = các file eval này THẬT SỰ kiểm — dùng cho carry-forward round delta (P1, Đợt 5); thiếu `paths` → eval LUÔN chạy lại (mặc định an toàn)
   - Cuối S1: append entry ledger cho approach/descope thỏa rule đáng-log (xem "Sổ quyết định").
4. **KHÔNG vào Gate 1 khi chưa đủ 3 artifact.** (HARD-GATE của brainstorming và Gate 1A/1B của kit gộp thành MỘT Gate 1.)
5. 🎨 **(CT1)** static evals + dòng surface&state + câu hỏi lane (xem bảng). **(CT2)** kiểm trực tiếp cuối S1: design-doc có state-matrix chưa, `evidence/design/reference/` + `provenance.json` có chưa — THIẾU → DỪNG, in nguyên văn: "surface web-UI ceremony — chạy `/design-mockup <slug>` trước Gate 1".

## GATE 1 (human — điểm dừng 1)

**BƯỚC MẶC ĐỊNH — render thẻ quyết định TRƯỚC:** invoke `/acceptance-card <slug>` (tự nhận Cổng 1 từ contract.status) — trình "sẽ làm / sẽ KHÔNG làm" + cờ phủ-biên bằng ngôn ngữ sản phẩm thay vì YAML thô — RỒI hỏi đúng 1 câu: duyệt / sửa gì. Đính kèm gói text đầy đủ để user soi sâu khi cần: tóm tắt design (≤10 dòng) + contract.md NGUYÊN VĂN + bảng mapping AC → eval → executor. Thẻ chỉ là lớp trình bày — contract/evals vẫn là nguồn-sự-thật, quyết định vẫn vào `approved_by`. (Lệnh/script `/acceptance-card` không có → cài/cập nhật plugin acceptance-gate, hoặc tạm trình gói text.)

🎨 **(CT2)** KHÔNG render card / vào Gate 1 khi thiếu mockup provenance + state-matrix. User chủ động bỏ ceremony ở câu hỏi lane → entry `descope` trong decisions.jsonl là dấu vết hiện (thay marker `design_subtrack: skipped-by-user` cũ — workspace cũ còn marker thì vẫn đọc được, không lỗi).

Khi duyệt: set contract `status: approved`, `approved_by`, `approved_at` (ISO); append seal entry vào decisions.jsonl (xem "Sổ quyết định"); hỏi user số phút đã tốn ở gate → ghi `time_human_minutes.gate1`. Commit design doc + contract + evals. User muốn rời máy cho đoạn S2→S4 tự chạy (Claude Code có `/goal`)? → IN gợi ý lệnh theo template mục /goal trong GUIDE, điền sẵn slug — CHỈ in gợi ý (slash command là của user, không tự đặt); TUYỆT ĐỐI không gợi ý goal tới `signed-off` (hook chặn chữ ký máy → spin vô hạn). Kèm theo: nếu phiên đang chạy model đắt hơn mức đoạn máy cần (vd tier thiết kế), in thêm gợi ý `/model claude-opus-4-8` TRƯỚC dòng /goal — S3 tuần tự + điều phối S4 chạy model phiên nên đổi ca ở Gate 1 là điểm rẻ nhất (GUIDE mục "Model theo giai đoạn"); KHÔNG tự đổi model (là lệnh của user).

## S2 — PLAN

1. Invoke `superpowers:writing-plans` → `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`.
2. Mỗi task PHẢI ghi: Files / verify command per-task / evals nó phục vụ (vd "phục vụ E1, E3") / cờ `independent: true|false` so với các task khác.
3. **T3: GATE 1.5** — trình tóm tắt plan (task list + files + thứ tự), chờ duyệt. T2: đi tiếp luôn, không dừng.
4. Cuối S2: append entry ledger cho lựa chọn load-bearing (nếu có).

## S3 — EXECUTE

1. Mặc định: thực thi plan TUẦN TỰ trong main loop (theo `superpowers:executing-plans` hoặc subagent-driven nếu đang theo skill đó). Quy ước verify của repo (CLAUDE.md) THẮNG default của skill con nếu xung đột (vd repo cấm test framework → verify per-task = build/typecheck/smoke của repo). Buộc đổi hướng so với plan giữa chừng (plan không khớp thực tế) → append ngay 1 entry `fix`/`descope` vào decisions.jsonl (xem "Sổ quyết định") — đây là entry provisional, card Gate 2 sẽ trình để phê.
2. Plan có ≥2 task `independent: true` → gom các task đó, invoke Workflow:
   `Workflow({ scriptPath: '<WORKFLOWS_DIR>/execute-parallel.js', args: { planPath: '<abs plan path>', repoRoot: '<abs repo root>', tasks: [{ id, title, summary, files, verifyCmd }], models: <feature_loop.models nếu có, như S4> } })` (WORKFLOWS_DIR xem ghi chú đầu file; script chỉ dùng `models.executor` — default kế thừa model phiên)
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
   - `models` (optional) = đọc block `feature_loop.models` trong config.yaml nếu có (mỗi dòng con `<role>: <model>`; role: machine/ui/judge/finder/refute/baseline/provenance/scribe/synthesize; giá trị `session` = kế thừa model phiên chính) → truyền nguyên map. Không có block → bỏ qua field, script dùng default. KHÔNG tự bịa model theo cảm tính — bảng default trong script là quyết định đã cân nhắc.
   - `round`: chưa có `evidence-report.md` → 1; có rồi → đếm số round trong section `## Iterations` + 1. (REJECT không đổi contract status — session mới resume PHẢI đọc round từ đây, nếu không cap 3 round bị reset và run_id mint trùng.)
   - **Carry-forward Đợt 5 (P1/P2/P3 — memo DUY NHẤT là `run-log.jsonl`, không file state mới; mọi field optional, thiếu → script chạy full như cũ):**
     - **P1 (CHỈ round delta — xem Staleness guard):** với mỗi eval máy/ui có `paths`: `deltaFiles` không khớp glob nào của `paths` VÀ dòng run-log round trước của eval có `exit_code: 0` → thêm vào `carriedEvals: [{id, runId, fromRound, verifiedAt, cmd}]` (runId = `run_id` dòng đó — GIỮ NGUYÊN qua chuỗi carry; dòng có `carried_from_round: N` → `fromRound: N` và `verifiedAt` = ts của dòng round N, không phải ts dòng carried). Eval GIỮ NGUYÊN trong `evals` — script tự loại khỏi fan-out. Eval không có `paths` / delta chạm / round trước không xanh → chạy lại. Suite commands LUÔN chạy lại.
     - **P2 (mọi round):** `evalsHash=$(shasum -a 256 _acceptance/<slug>/evals.yaml | cut -d' ' -f1)`. Đọc dòng `"kind":"baseline"` CUỐI trong run-log: `evals_hash` trùng → `runBaseline: false` + `carriedAnalyst: {fromRound, nonDiscriminating}` (fromRound = `carried_from_round` của dòng nếu có, không thì `round` của dòng; nonDiscriminating = `non_discriminating` dòng đó). Khác hash / chưa có dòng → `runBaseline: true`. LUÔN truyền `evalsHash` để script ghi dòng memo.
     - **P3 (mọi round ≥2, kể cả round fix):** mỗi judgment eval: `inputsHash=$({ printf '%s' "<question>"; cat <inputs theo thứ tự khai>; } | shasum -a 256 | cut -d' ' -f1)` (file input thiếu → coi như hash mới, judge fresh). Đọc dòng `"kind":"panel"` CUỐI của eval: `inputs_hash` trùng → thêm `carriedPanels: [{evalId, proposal, votes, fromRound, inputsHash}]` từ dòng đó (fromRound như quy tắc P2) — item UNCERTAIN chờ human mà inputs không đổi cũng carried, KHÔNG chấm lại (câu trả lời nằm ở Gate 2, không ở máy). Khác/thiếu → gắn `inputsHash` vào eval object (script ghi dòng memo cho round sau).
2. Invoke: `Workflow({ scriptPath: '<WORKFLOWS_DIR>/acceptance-verify.js', args: { slug, round, riskTier, evals, suiteCommands, diffBase, repoRoot, personasPath, templatePath, reviewSkillPath?, carriedEvals?, carriedPanels?, runBaseline?, carriedAnalyst?, evalsHash? } })` (debug fan-out không tốn agent: thêm `dryRun: true` → trả về distinctCommands/judgePanels + carried plan, không chạy gì).
3. Routing theo verdict trả về:
   - `REJECT` → quay S3 fix `failedEvals` + `failedCommands` + `confirmedFindings`, rồi S4 round mới (round + 1). Trước khi rời S3-fix: append entry `fix` (`stage:"S4-r<N>"`). **Tối đa 3 round** — quá → DỪNG, escalate user kèm phân tích từng round. `reportPath` thiếu ở round REJECT → cảnh báo user lịch sử Iterations của round này không được ghi.
   - `BLOCKED` → đọc `blocked[].cmd` + `blocked[].reason` từ kết quả, trình NGUYÊN VĂN cho user rồi khắc phục nguyên nhân, chạy lại CÙNG round. Không bao giờ downgrade BLOCKED thành pass.
   - `PASS` / `PENDING-JUDGMENT` → kiểm tra `reportPath` có giá trị (synthesize agent có thể chết); thiếu → chạy lại S4 cùng round. Có → set contract `status: verified`, rồi **COMMIT NGAY gói evidence máy-viết** (evidence-report.md + run-log.jsonl + contract + evidence/) TRƯỚC khi vào Gate 2 — commit này KHÔNG chứa chữ ký người; repo bật `signoff.require_human_commit` thì pre-merge bắt buộc tách như vậy, và commit sớm cũng tránh dính stale-guard. → Gate 2. `reviewIncomplete` không rỗng → ghi cảnh báo vào gói Gate 2.
   - **Mọi verdict:** nếu kết quả có `runLogWriteFailed: true` → main loop TỰ append từng dòng trong `result.runLog` (nguyên văn, mỗi phần tử 1 dòng) vào `_acceptance/<slug>/run-log.jsonl` NGAY (Bash `printf '%s\n' ... >>`) — hook + CI đối chiếu run_id trong report với log này; thiếu log là PASS bị chặn oan ở recheck strict. Kết quả có `carried` không rỗng (Đợt 5) → khi báo user VÀ trong gói Gate 2 ghi RÕ round này carry gì: evals (P1), panels (P3), baseline (P2) — carry-forward phải minh bạch, không được ẩn vào "máy đã lo".
4. Workflow đứt giữa chừng (crash/cancel) → resume `resumeFromRunId` CÙNG round. Đã fix code → LUÔN run mới, không cache.
5. 🎨 **(CT1)** eval fidelity ADVISORY: surface có reference cũ (repo/`provenance.design_repo` trỏ được) → chạy so-drift, kết quả vào gói Gate 2; không có reference → skip-note thường. **(CT2)** fidelity trả "skipped" → in WARN RÕ vào gói Gate 2: "fidelity pixel-diff KHÔNG chạy — thị-giác CHƯA được so", KHÔNG lẫn vào PASS xanh.

## GATE 2 (human — điểm dừng 2)

**BƯỚC MẶC ĐỊNH — render thẻ quyết định TRƯỚC:** invoke `/acceptance-card <slug>` (tự nhận Cổng 2) — judgment + scope (việc-của-người) lên đầu bằng ngôn ngữ sản phẩm, "máy đã lo" thu gọn, luôn kèm đảo-ngược. Đính kèm gói text đầy đủ để soi sâu: verdict + bảng per-eval (đọc từ `reportPath` = evidence-report.md) + judge panel proposals + review findings (đọc từ `findingsPath` = review-findings.md, gồm cả section "chưa adversarial-verify" nếu có) + cảnh báo reviewIncomplete nếu có + diff summary (`git diff --stat <diffBase>...HEAD`). Thẻ chỉ là lớp trình bày — verdict/hook/evidence vẫn là nguồn-sự-thật. (Lệnh/script `/acceptance-card` không có → cài/cập nhật plugin acceptance-gate, hoặc tạm trình gói text.)

**Judgment item trình cho user PHẢI ở dạng câu hỏi nghiệp vụ phi kỹ thuật** — user là người quyết kinh doanh, không phải engineer. Mỗi item: dịch thành 1 câu hỏi có/không hoặc lựa chọn a/b bằng ngôn ngữ SẢN PHẨM (không jargon schema/tool/migration), kèm (1) đề xuất của Claude + lý do 1 dòng, (2) hệ quả mỗi lựa chọn, (3) lựa chọn có đảo ngược được không. **Tính năng MỚI chưa có số liệu:** đừng bắt user phán bằng data — câu hỏi đúng là "đúng intent đã duyệt ở Gate 1 chưa · ship được chưa · đổi sau có rẻ không"; phương án đảo-ngược-được + ghi chú revisit là mặc định hợp lệ, data thật sau khi ship sẽ vào contract của vòng sau.

🎨 **(CT2)** trước signoff in "chạy `/design-evidence <slug>`" + đính panel; KHÔNG đánh dấu AC perceptual `resolved` khi chưa có panel. S4 có WARN fidelity-skip → nêu lên ĐẦU gói Gate 2, không nén vào phần "máy đã lo". **(CT1)** ghi lane hiện tại (D0/D1/D2) + các entry descope lane vào gói Gate 2.

User: điền `human_override: <tên> <ngày>` cho từng UNCERTAIN (T3: MỌI judgment item), nâng PENDING-JUDGMENT → PASS nếu đồng ý, điền `human_signoff` + `time_human_minutes.gate2`. Xong: set contract `status: signed-off`, rồi commit **RIÊNG** các edit Gate-2 này — trong evidence-report.md commit đó chỉ được chạm các dòng human-owned (`human_signoff` / `human_override` / `verdict` nâng cấp / `bypass_ack`); evidence máy-viết đã commit từ cuối S4. Người duyệt tự commit, hoặc ra lệnh cho agent commit đúng mỗi phần đó (repo bật `signoff.require_human_commit` → pre-merge chặn chữ ký sinh cùng commit với body report). Human để lại ghi chú revisit/đảo-ngược → append 1 entry `stage:"gate2"`; signoff đồng thời là phê chuẩn khối provisional mà card đã trình riêng.

## S5 — SHIP

Invoke `superpowers:finishing-a-development-branch` → PR theo quy trình repo (không push thẳng nhánh chính nếu repo cấm). Update doc trạng thái của repo nếu có. CI pre-merge check của acceptance-gate kit (`scripts/pre-merge-check.sh`) là chốt chặn độc lập — không bypass; repo CHƯA wire nó vào CI → cảnh báo user rõ ràng (gate không enforce trước merge, xem README của kit cách wire).

## Quy tắc gộp xung đột

- Quy ước verify của repo (CLAUDE.md) THẮNG default của skill con (vd TDD) nếu xung đột. Bù lại luôn có **evals-first**: evals.yaml duyệt TRƯỚC khi code.
- `verification-before-completion` → được thỏa bởi evidence S4, không verify trùng lần hai.
- Doer ≠ grader → main loop đã code thì KHÔNG tự chấm; mọi verifier/judge là fresh Workflow agents.
