# Acceptance-Gate Kit

Evidence-backed acceptance gate for AI-generated features. Cuts human
acceptance time from hours of hand-testing to ~15-20 minutes at two
high-leverage gates.

## How it works

```
input (prompt/ticket/PRD)
  → Phase 1 NORMALIZE  → contract.md          ┐
  → Phase 2 EVAL-GEN   → evals.yaml           ├─ Gate 1: human approves (5-10 min)
  → implementation (normal agent coding flow) │
  → Phase 3 VERIFY     → evidence-report.md   ├─ Gate 2: human signs off (5-10 min)
       fresh-context subagent runs every eval ┘
```

In the full feature-loop, S1 additionally ends with a **clean-context
gap-probe** (T2/T3): a fresh subagent that had no hand in the artifacts
interrogates the draft design/contract/evals for what is *missing* — max 5
findings, each requiring a concrete failure scenario, each dispositioned
(fixed on paper / deferred / rejected / escalated to the human) — before the
Gate-1 card renders. The card shows the findings block, or a yellow flag when
the probe never ran (non-blocking, backward-tolerant).

Enforcement is deterministic, not aspirational:
- **Hook** (`acceptance-evidence-gate.js`): blocks any PASS verdict written
  without machine evidence (run_id — reconciled against the machine-written
  `run-log.jsonl` when it exists, exit_code 0, authentic verifier,
  verified_at, a real-SHA `verified_commit` when present) or with unresolved
  UNCERTAIN judgments — and blocks contract `status` transitions that skip
  Gate 1 (approved/signed-off, or draft → implemented/verified, with an empty
  `approved_by` and no `gate1_skipped: true`).
- **CI** (`scripts/pre-merge-check.sh`): blocks merge of implemented T2/T3
  features without a signed PASS evidence report, without a recorded Gate-1
  approval, with STALE evidence (non-gate files changed after the report's
  `verified_commit`), or — via the committed-evidence re-check — with run_ids
  that were never machine-logged in `run-log.jsonl`. With
  `signoff.require_human_commit: true`, the Gate-2 signature must also land in
  its own human-fields-only commit (git history is the attribution — an AI
  auto-filling `human_signoff` alongside the report body is blocked).

> **Thành viên mới: đọc [QUICKSTART.md](QUICKSTART.md) (tiếng Việt, 5 phút) — cài 2 lệnh là dùng được.**
> **Bản đầy đủ — kiến trúc, cài đặt, vận hành, tra cứu enforcement: [GUIDE.md](GUIDE.md).**

## Install

```bash
claude plugin marketplace add phanlemanh/acceptance-gate-kit
claude plugin install acceptance-gate@acceptance-gate-kit
claude plugin install feature-loop@acceptance-gate-kit    # full loop
claude plugin install superpowers@claude-plugins-official # required by feature-loop
```

Open a **fresh session** after installing or upgrading so the runtime discovers
the new skills and hooks. CI remains authoritative if the write-time hook is
untrusted or disabled.

Stay current — two devs on different kit versions in one repo run two different
gate rule-sets:

```bash
claude plugin update acceptance-gate@acceptance-gate-kit
claude plugin update feature-loop@acceptance-gate-kit
```

> **Enforcement note.** Write-time hook behavior depends on the active agent
> runtime and hook trust, so do not rely on it as the only guard. The
> authoritative backstop is still the vendored CI set:
> `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, and the five
> `lib/*.cjs` files (`evidence-core`, `gap-probe`, `workspace-record`,
> `ac-line`, `md-section`).

For local development, replace `phanlemanh/acceptance-gate-kit` with the
absolute path to this checkout. Source files are used directly — there is no
packaged copy to regenerate.

> **feature-loop** runs the gate discipline end to end: brainstorm →
> contract+evals (Gate 1) → plan → execute → verify → evidence + signoff
> (Gate 2).

Installing the plugin registers the skill, slash commands, and the PreToolUse
hook; CI remains the runtime-independent enforcement layer.

Pilot mode (iterate on the kit while using it) — symlink ALL THREE pieces
into the consumer repo; the skill alone is not enough (commands and the hook
live outside `skills/`):

```bash
cd <consumer-repo>
ln -s <kit>/skills/acceptance .claude/skills/acceptance
mkdir -p .claude/commands
ln -s <kit>/commands/acceptance-init.md   .claude/commands/acceptance-init.md
ln -s <kit>/commands/acceptance-status.md .claude/commands/acceptance-status.md
ln -s <kit>/commands/acceptance-card.md   .claude/commands/acceptance-card.md
ln -s <kit>/commands/approve.md           .claude/commands/approve.md
ln -s <kit>/commands/signoff.md           .claude/commands/signoff.md
ln -s <kit>/commands/acceptance-report.md .claude/commands/acceptance-report.md
ln -s <kit>/commands/start.md             .claude/commands/start.md
# hook: register in .claude/settings.local.json (machine-local, not committed)
#   PreToolUse Write|Edit -> node "<kit>/hooks/acceptance-evidence-gate.js"
```

Restart the Claude Code session afterwards — skills/commands/hooks are
discovered at session start. Keep the symlinks and settings.local.json
uncommitted (absolute machine paths).

## Per-repo setup (once)

Run `/acceptance-init`; it writes the `_acceptance/config.yaml` artifact.

Copy `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, and the five
`lib/*.cjs` files (`evidence-core`, `gap-probe`, `workspace-record`, `ac-line`,
`md-section`) into the repo (keep the `scripts/` + `lib/` layout so the
re-check can `require ../lib`; the `.cjs` extension keeps them CommonJS even
when the repo declares `"type": "module"`), and run the gate in CI:

```yaml
# e.g. GitHub Actions job steps — same two-step form as GUIDE §5.3
- uses: actions/checkout@v4
  with: { fetch-depth: 0 }   # full history: verified_commit + signature checks need it
- run: bash scripts/pre-merge-check.sh . --base "origin/$GITHUB_BASE_REF"
```

Always pass `--base` (the PR base): it arms the T1-escape backstop and gives
the gap-probe rule its diff scope — without it both rules run `declared-off`
(NOTE only, merge not blocked). `fetch-depth: 0` is part of the same form: on
the default shallow checkout the base ref does not resolve and the gate exits 2.
A job that runs on `push` (not a PR) additionally needs `--no-t1-escape` — see
GUIDE §5.3 for that variant and the rules ledger.

`pre-merge-check.sh` finds `recheck-evidence.cjs` next to itself; if it (or
`node`) is absent the pre-merge check still runs, minus the committed-evidence
re-check. `/acceptance-init` scaffolds `recheck: strict` — the right setting
for a fresh repo. When the key is absent the code falls back to `warn` (NOTEs
only); that fallback exists so repos ADOPTING the kit with legacy reports
aren't blocked — do not start a new repo there, and move to `strict` once your
committed reports meet the current evidence shape.

## Daily use

- `/start` → mở phiên (vào phiên bằng một lệnh, không cần câu mở đầu tự do):
  máy quét xưởng, trình thẻ ba nhóm — chờ ký · đang dở · việc mới — bạn chọn
  một chữ cái là vào đúng nghi thức; lệnh chỉ định hướng + bàn giao, không tự
  làm nội dung (human-typed, model-invocation locked on both harnesses).
- New feature → invoke the `acceptance` skill → contract + evals → approve
  (Gate 1) → implement → verify → sign off (Gate 2).
- `PRODUCT-MAP.md` (repo root) → one page answering "where is every piece of
  work?": a diagram of the stages with real counts, then each item under the
  stage it sits in. Machine-generated from the workspace records — `/approve`,
  `/signoff` and the UAT session redraw it and include it in the signature
  commit. Never hand-edit it; change the records instead. `acceptance-init`
  puts it in `risk_tiers.t1_skip_globs` (a regenerated view should not need
  human sign-off) and CI runs `product-map.mjs --root . --check` to catch drift
  or deletion — see [ADR 0007](docs/adr/0007-product-map-t1-exemption.md).
  Repos initialised before 1.31.0 keep working: the gate bodies read the config,
  skip the redraw, and print how to opt in.
- Phiên nghiệm thu / **Cổng Giá trị** (`skills/uat-session`) → the human gate
  AFTER shipping, for work that came from an opportunity decided `build` or
  `iterate`. Gate 2 asks "did we build what we promised?"; this one asks "did it
  actually matter?". Thresholds are copied verbatim from when the round opened
  and may NOT be changed once the numbers are on the table; scoring is blind and
  collected before any group discussion; a human — never the agent — writes
  `verdict: release | iterate | kill`. A `kill` is a SUCCESS of the process.
  Result lands in `_acceptance/<slug>/uat-session.md`.
- `/acceptance-status` → table of every feature's gate state.
- `/acceptance-card <slug>` → render a plain-language DECISION CARD for the gate:
  Gate 1 as "sẽ làm / sẽ KHÔNG làm" + coverage flags, or Gate 2 as "your
  decision / machine handled" + reversibility. Presentation only — the contract,
  evidence, verdict, and hook stay the source of truth; the card decides nothing.
- At Gate 2, `/acceptance-card` also generates a full **evidence page**
  (`evidence-page.html`) and auto-opens it — real screenshots (a ui-check eval
  with multiple frames plays as a CSS slideshow), real output, judge rationale,
  override status, review findings, Gate-2 checklist. The card stays link-only;
  you SEE the artifacts on the page. Self-contained, `file://`-openable, zero-dep.
- `/approve <slug>` → record the Gate 1 decision: card → one question → machine
  writes `approved_by`/`approved_at` on your explicit YES. `/signoff <slug>` →
  walk Gate 2: preconditions → `human_override`/`human_signoff` → signature in
  its own human-fields-only commit → pre-merge re-check. The decision verbs
  never decide on their own.
- `/acceptance-report` → is the gate healthy? Verdict mix, verify rounds,
  gate hygiene (skips/bypasses/stale evidence). Read-only.
- Risk tiers: T1 skips the kit; T3 requires direct human verdicts on all
  judgment items. Tiers/globs are per-repo in `_acceptance/config.yaml`.
- Current test surface (6 suites, all fixture-driven): hook cases
  (`tests/hooks/run-tests.sh`) + script cases
  (`tests/scripts/run-tests.sh`: pre-merge check + provenance + evidence
  re-check, eval-coverage lint, gate-card, evidence-page) + packaging checks
  (`tests/plugins/run-tests.sh`: version alignment, vendored engine import
  graph, `${CLAUDE_PLUGIN_ROOT}` path resolution) + layout-meter suite
  (`tests/skills/run-tests.sh`: analyze() geometry + browser-verified
  fixtures) + design-eval and workflow suites.

## Layout

| Path | What |
|---|---|
| `.claude-plugin/marketplace.json` | Claude Code marketplace entry |
| `skills/acceptance/` | The 3-phase skill + templates |
| `skills/ux-ui-craft/` | Design-engineer skill: 7-step UI process, hard gates (contrast, type/alignment budgets, structure–space coherence, states), Layout Contract + layout meter (`measure_layout.js`), System+Prototype+Audit modes, 10 craft references |
| `skills/morphological-scan/` | CT-S coverage skill: Zwicky-box AC-space scan (MECE axes + CE evidence + Pareto Core/Later/Never) feeding the contract's Coverage section on the Gate-1 card |
| `hooks/` | PreToolUse evidence hook (write time) |
| `lib/evidence-core.cjs` | Shared L1/L2/L3 evidence validation (hook + CI re-check) |
| `commands/` | `/acceptance-init`, `/acceptance-status`, `/acceptance-card`, `/approve`, `/signoff`, `/acceptance-report` |
| `scripts/pre-merge-check.sh` | CI gate (copy into consumer repos) |
| `scripts/recheck-evidence.cjs` | CI re-verify a committed report's evidence |
| `scripts/gate-card.js` | Render the Gate 1 / Gate 2 human decision card |
| `scripts/config-patch.mjs` | THE splice path for programmatic config.yaml writes (dry-run, .bak, abort-on-existing) |
| `scripts/evidence-page.js` | Render the full Gate-2 evidence page (screenshots/output/slideshow) |
| `tests/` | Fixture tests: `for t in hooks scripts plugins design-eval workflows skills; do bash tests/$t/run-tests.sh; done` |

## Kit chạy cổng của chính nó (self-hosting)

`_acceptance/config.yaml` ở repo này cấu hình kit làm **consumer của chính nó**.
Ba điểm khác một repo tiêu thụ bình thường, mỗi điểm là một bài học dogfood:

- **Executor trỏ vào `scripts/` trong repo, không qua `${CLAUDE_PLUGIN_ROOT}`.**
  Kit LÀ nguồn của plugin, nên cổng phải chấm bằng mã đang sửa chứ không bằng
  bản trong plugin cache — cache thường tụt version (đo được: cache 1.18.0 khi
  repo đã 1.21.0). feature-loop S4 resolve bằng
  `node feature-loop/scripts/resolve-plugin.mjs --plugin acceptance-gate --root .`
- **`*.md` KHÔNG nằm trong `t1_skip_globs`.** Mặc định sinh sẵn coi mọi markdown
  là tài liệu; ở đây 23 file `SKILL.md`/command LÀ hành vi thật. Chỉ docs được
  liệt đích danh mới bỏ qua cổng — nếu không, sửa hành vi của cổng lại lọt cổng.
- **`t3_paths` là lõi cưỡng chế** (`hooks/`, `lib/`, `pre-merge-check.sh`,
  `recheck-evidence.cjs`): bug ở đây thành false-green im lặng trên MỌI repo dùng kit.

CI ở [`.github/workflows/gate.yml`](.github/workflows/gate.yml): 3 test suite +
`pre-merge-check.sh` + **răng T1-escape (ĐANG BẬT)** — mọi PR chạm `t3_paths`
bắt buộc kèm thay đổi dưới `_acceptance/`. Hai điều chỉnh riêng cho repo kit:

- Răng T1-escape chỉ cưỡng chế trên `pull_request`. Ở `push`, job truyền
  `--no-t1-escape` và in marker `T1-ESCAPE: NOT ENFORCED` — KHÔNG phải vì push
  thiếu base (push CÓ base, để luật gap-probe chạy được), mà vì tiền đề "phải
  kèm hồ sơ nghiệm thu" sai với commit đóng gói bản phát hành / đồng bộ bản sao.
  Xem [ADR 0005](docs/adr/0005-t1-escape-opt-out-flag.md).
- Từ acceptance-gate 1.22.0, base ĐÃ KHAI mà không resolve được là
  `VIOLATION [scope]` + exit 2 ở MỌI repo (fail-closed, không còn *skip +
  clean*). Nhánh *skip* chỉ còn cho trường hợp không truyền base hoặc không có
  merge-base (clone nông/grafted) — và ở repo kit, CI nâng cả skip đó thành
  **lỗi** vì một backstop bị bỏ qua âm thầm CHÍNH LÀ lỗ nó sinh ra để bịt.
  Test P35 giữ cả ba tính chất (bật · guard PR · fail-loud) khỏi bị gỡ về sau.

Giới hạn cần biết: backstop **không có ánh xạ path→slug** (comment trong
`pre-merge-check.sh` nói rõ) — "có kèm artifact" nghĩa là *bất kỳ* thay đổi nào
dưới `_acceptance/`. Nó chặn việc quên cổng hoàn toàn, không chặn được một
contract cẩu thả; chất lượng contract là việc của Gate 1 và các check per-slug.

## Pilot metrics

The kit does **not** measure human minutes. That number was self-reported at
the gate to get past it, so it cost a human interruption and produced fictional
data at the same time; the baseline it was divided by was deliberately left
empty, so the "≥50% less human time" bar was never computable. What the gates
actually record — verdict mix, verify rounds, and gate hygiene (skipped gates,
un-acked bypasses, stale evidence) — is what `/acceptance-report` prints.
Success bar for the pilot: zero business-logic defects slipping past the gate,
and acceptance that is *possible at all* rather than *faster* — before the kit
it mostly did not happen.

## Known limitations (v1)

Deliberate scope cuts — each is backed by the pre-merge check + human signoff
downstream, and revisited after the pilot:

- **`gap_probe` defaults to `advisory`**: out of the box (key absent) a PR whose
  slug lacks `gap-probe.md` merges with a NOTE, not a block. The merge-boundary
  backstop now EXISTS (`pre-merge-check.sh`), but a repo has to opt into
  `required` for it to have teeth. The kit's own config sets `required`.
- **The T1-escape backstop has no path→slug mapping**: `pre-merge-check.sh`
  counts *any* change under a path matching `_acceptance/*` or `*/_acceptance/*`
  as "this PR carries gate artifacts". The glob is not anchored to the repo
  root, so a test fixture living under `<anywhere>/_acceptance/` also satisfies
  it — a PR touching `t3_paths` can pass the backstop without a real contract.
  The kit's own suites keep their generated gap-probe fixtures in `mktemp`,
  outside the repo, to avoid exactly this; anchoring the glob is a queued fix
  (it changes shared behaviour, so it needs its own contract).
- **Gap-probe findings parse splits on `|`**: a finding cell containing a
  literal pipe drops that row from the card — counted and flagged as
  unreadable, never silent.
- **L3 judgment pairing is count-based**, not position-aware: any
  `human_override:` with a value balances any UNCERTAIN. A determined agent
  can game it; an honest one cannot trip it accidentally.
- **Verdict synonyms**: PASS/PASSED/ACCEPTED/APPROVED/GO/SUCCESS are caught;
  unicode homoglyph evasion is out of scope for a defense-in-depth gate.
- **Config lookup prefers the nearest `_acceptance/config.yaml`** walking up
  from the report — a planted nested config can lower enforcement; it would
  be visible in any diff/review.
- **The hook only sees agent edits** (PreToolUse). A human editing
  evidence-report.md in their editor bypasses it; `scripts/pre-merge-check.sh`
  in CI is the backstop for exactly that path — it re-runs the gate's own
  L1/L2/L3 evidence bar on the COMMITTED report via `scripts/recheck-evidence.cjs`
  (the same `lib/evidence-core.cjs` the hook uses), so a report hand-edited to
  PASS with a nonzero exit, a manual verifier, or an unresolved UNCERTAIN is
  caught at merge regardless of whether the write-time hook ran. The re-check
  defaults to `recheck: warn` (advise only — so adopting it never blocks merges
  over reports written by an older evidence template); set `recheck: strict` in
  `_acceptance/config.yaml` to hard-block, or `off` to skip. Provenance: a
  deterministic capture step stamps `enforcement_mode` + `bypass_used`; pre-merge
  BLOCKS an un-acknowledged `bypass_used: true` (a human may release it with
  `bypass_ack`) and `enforcement_mode: off`, and WARNS on `warn`. Residual: a
  report bypassed but written with fully authentic evidence passes the re-check
  (it is, in fact, authentic) while its `bypass_used` stamp depends on the verify
  env — hook-authoritative bypass capture is the remaining follow-up.
- **`enforcement: warn` / `off` hook outputs are not assertion-tested** (exit
  codes are — T12/T24); a `warn` report now warns at the pre-merge check, an `off`
  report is blocked.
- **The cross-layer rail (wave 1) is advisory and tag-keyed**: forgetting to
  tag a criterion `(cross-layer)` silences W4 + pairing rule (c) — the
  remaining nets are the feature-loop gap-probe cross-check and the human at
  Gate 1 (standalone acceptance-gate runs have no gap-probe: lint + human
  only). `network_observed:` is not hook-enforced until evidence schema v3; a
  fabricated `clean` is narrowed — not blocked — by the
  clean-requires-traffic vocab rule (`no-app-traffic`) and the pre-merge
  dump-file NOTE.
- **The kit validates evidence of declared evals, not the environment a
  `config:` binding points at**: a `layer: backend-effect` eval bound to a
  mock passes mechanically (engine/binding split) — the nets are the Gate-1
  human review of bindings and the A/B Analyst green-on-both flag.
- **Mobile is a first-class surface (1.20) with CI teeth — but UI-layer
  evidence only**: mobile flows run through the repo's native E2E runner
  (`executors.test.e2e_mobile`); simulators have no network-reading path, so
  the runner's exit code never proves network truth. `pre-merge-check.sh` now
  BLOCKS the merge — once the feature is gated (status implemented/verified/signed-off) —
  when a `(cross-layer)` criterion has no paired
  `layer: backend-effect` eval. The backend target (local|staging|mock) is a
  human-eyeballed contract line — lint W5 checks presence only; the kit never
  machine-verifies "real".
- **In-scope background noise fails the eval by design**: a poller/cron firing
  5xx into app scope during a ui-check's drive window FAILS that eval even when
  it is unrelated to the feature — an in-scope failure during the drive is
  never `clean`. It is a machine FAIL (REJECT), so `human_override` cannot
  release it; re-run the round or descope/rewrite the eval, recording why.

Design spec: `docs/specs/2026-06-10-acceptance-gate-kit-design.md`
