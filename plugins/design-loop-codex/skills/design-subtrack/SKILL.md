---
name: design-subtrack
description: Design sub-track for a web-UI-surface feature inside feature-loop or feature-loop-codex — use when designing/redesigning a screen, plugin view, mockup, or any user-facing surface (khi thiết kế một surface web-UI / màn hình / mockup trong feature-loop). Standardizes the design-of-record → port → 3-layer fidelity pipeline as a CONDITIONAL S1-D mockup + Gate-2 evidence bookend, composing with feature-loop/feature-loop-codex seam guards, and reusing acceptance-gate's P0 design gate. NOT for headless/backend features. Requires: acceptance-gate + feature-loop or feature-loop-codex; one-time /design-init per repo.
---

# design-subtrack

Layers a **conditional design sub-track** onto feature-loop's S0–S5 spine
**without editing feature-loop**. Only for features whose `contract.surfaces`
renders web UI; headless features run vanilla feature-loop. Prerequisite:
`/design-init` has wired `executors.design.*` (once per repo). In Codex, the
same sub-track composes with `feature-loop-codex`; use the portable reference
path when Claude Design is not available.

**Three design-reference paths — never conflate** (details: [references/design-command-map.md](references/design-command-map.md)):
- **H1 first-party** (Claude Code built-ins, NOT shipped by this plugin): `/design-login`, `/design-sync`, `/design` + the `DesignSync` tool. The real claude.ai/design bridge — 2-way, planId-gated, **agent-tool, not CI/headless-callable**.
- **Codex portable reference**: use a design repo, checked-in HTML/CSS, generated
  reference files, or saved screenshots. Capture into
  `_acceptance/<slug>/evidence/design/reference/` and write `provenance.json`.
  This is first-class for Codex and does not require Claude Design.
- **H2 cowork** (`design:*` from anthropics/knowledge-work-plugins): `design:design-critique`, `design:design-system`, `design:design-handoff`, `design:ux-copy`, `design:accessibility-review`. **Prompt-only advisors** — do NOT sync to claude.ai/design.

**Invariants kept (never break):** `contract.status` single source of truth · doer≠grader (this skill only AUTHORS mockups/references/scripts — grading stays in the acceptance verify subagent + human Gate-2) · the 2 (T3: 3) human gates unchanged in count (mockup folds into Gate-1, perceptual into Gate-2) · no new state-machine state.

## Per-stage add/modify (only these; everything else = vanilla feature-loop)

- **S0 — detect.** `node ${plugin}/scripts/design-detect-surface.mjs --slug <slug>` → trả `surface:true` = CT1 bật; CT2 KHÔNG bật ở đây — nó bật ở câu hỏi lane cuối S1 của feature-loop hoặc khi user chạy `/design-mockup`.
- **S1 — spec pack (+).** **(CT1)** thêm static evals per-surface (cmd `config:executors.design.static` + target + `--html <capture>` + `--require-html`) + eval `config:executors.design.gate` (P0 floor, cùng capture) + vài dòng surface&state trong design-doc. **(CT2)** thêm state-matrix đầy đủ (theme×viewport×domain-state, see [references/state-matrix.md](references/state-matrix.md)) + seam = data-shape + token vocab **in APP space** `--_* / --color-*` (never `--oh-*` hex) + G2 AC split — mỗi tiêu chí machine-checkable thành `script` eval (contrast/token-only/hit≥44), phần perceptual còn lại tag `(judgment) — human-glance @ Gate 2`, như cũ. Hard-gate state-matrix CHỈ khi CT2. *(H2 advisory: `design:design-critique`, `design:design-system`.)*
- **S1-D — mockup/reference.** **(CT2 only — skip hoàn toàn khi lane static-only)** Run `/design-mockup <slug>` or perform the
  equivalent Codex portable reference steps. Author/pull the design-of-record
  from claude.ai/design in Claude, or use a design repo/static HTML/generated
  reference/screenshots in Codex. **Drift-check** the surface set vs the state
  matrix, **capture the reference** + `provenance.json`. *(H2 advisory:
  `design:accessibility-review`.)*
- **Gate 1.** Mockup + state matrix + seam ride the existing `/acceptance-card` decision. One question. **(CT1∧¬CT2, lane static-only)** card hiện entry `descope` lane thay mockup. *(H2: `design:design-handoff` to draft the port spec.)*
- **S2 — plan (+).** Add a **port task** per surface: HTML→JSX into `apps/web/plugins/<name>/view/*.tsx` (see [references/port-translation.md](references/port-translation.md)); DoD names the `--oh-*`→`--_*/--color-*` translation.
- **S3 — execute.** The doer ports per the playbook (register-client=Preview, register-server=Body; never host shell / `components/ui/`). This skill supplies the playbook only — never grades.
- **S4 — verify (3 layers theo công tắc, per-surface evals).** 🔴 static (mọi lane CT1, `--require-html` bắt buộc ở lane nhẹ): `config:executors.design.static` = token-only (source) + WCAG **contrast-AA** (rendered `--html` capture, BLOCK) + **tap-target≥44** (heuristic; advisory by default, `--strict-hit` to block) · 🔴 gate P0 (mọi lane CT1 khi có capture — floor KHÔNG phụ thuộc ceremony): `config:executors.design.gate` (acceptance-gate P0 floor) · 🟡 fidelity (advisory mọi lane khi có reference — so drift, không block; theo CT2 chỉ khác WARN-khi-skip, xem feature-loop S4#5): `config:executors.design.fidelity` (advisory pixel-diff, never blocks). These are **per-surface evals** (target supplied by the eval, not suite_keys); S4 runs every eval each round. `provenance.mjs` refuses (BLOCKED, not false-green) on missing provenance. **No blind VLM judge.**
- **Gate 2.** **(CT2)** panel onion-skin như cũ — run `/design-evidence <slug>` for the onion-skin panel (reference↔impl); human resolves the perceptual AC. **(CT1∧¬CT2)** không panel — evidence screenshot/`observed` thường. Machine verdict + `status → signed-off` unchanged.
- **S5 — ship.** PR as usual. Optionally `/design-push <slug>` to sync finalized
  design-system deltas back to cloud (H1, human-run, Claude-only). In Codex,
  record that the cloud push is skipped or handled outside the loop.

## Honest CANNOT
This plugin **cannot ship** `/design-sync` or `/design-login` (first-party built-ins)
and **cannot make** `DesignSync` CI/headless-callable (needs subscription +
interactive planId approval). Codex cannot use that Claude bridge directly.
When H1 is unavailable, use the portable reference path plus optional H2
advisors; the port/verify layers still run.
