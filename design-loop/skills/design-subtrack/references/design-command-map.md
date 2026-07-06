# Design reference paths per stage — reference

The names overlap, but these paths are different. Never present an H2 advisor
as if it syncs to claude.ai/design, and never require Claude Design when running
the loop in Codex.

## H1 — FIRST-PARTY (Claude Code built-ins, NOT shipped by any plugin)
`/design-login` (auth; needs a Claude subscription) · `/design-sync` (2-way
design-system sync; planId-gated: read → finalize_plan(planId, user approves) →
write_files/delete_files) · `/design` (design in Code) · tool `DesignSync`.
**Agent-tool — NOT CI/headless-callable.** This is the real claude.ai/design bridge.

## C1 — CODEX PORTABLE REFERENCE
Use a design repo, checked-in static HTML/CSS, generated reference files, or
saved screenshots. Capture the reference into
`_acceptance/<slug>/evidence/design/reference/` and write `provenance.json` via
`scripts/provenance.mjs`. This is the default Codex path and is CI-friendly
because the reference is filesystem evidence rather than a cloud session.

## H2 — COWORK (`anthropics/knowledge-work-plugins/design`)
`design:design-critique` · `design:design-system` · `design:design-handoff` ·
`design:ux-copy` · `design:accessibility-review` · `design:user-research` ·
`design:research-synthesis`. **Prompt-only advisors** (optionally Figma-MCP-boosted).
Do NOT connect to claude.ai/design. `design:design-handoff` (paper spec) ≠ the
`/design-sync` handoff (code round-trip).

## Per-stage

| Stage | H1 (Claude bridge) | C1 (Codex portable reference) | H2 (advisory) | design-loop component |
|---|---|---|---|---|
| S0 detect | — | — | — | `scripts/design-detect-surface.mjs` |
| S1 spec | — | state matrix + app-token seam in design doc | `design:design-system`, `design:design-critique` | skill + `references/state-matrix.md` |
| S1-D mockup/reference | **`/design-login`, `/design-sync`** | capture design repo/static/generated reference + `provenance.json` | `design:design-critique`, `design:accessibility-review` | `/design-mockup`, `provenance.mjs` |
| Gate 1 | — | reference provenance included in card package | `design:design-handoff` | `/acceptance-card` (acceptance-gate) |
| S2 plan | — | port task per surface | `design:ux-copy` | `references/port-translation.md` |
| S3 port | — | implement from reference evidence | `design:accessibility-review` | `references/port-translation.md` |
| S4 verify | — | provenance verify + static/gate/fidelity evals | — | `design-static-check.mjs` + acceptance `design-gate.mjs` + `design-fidelity-diff.mjs` |
| Gate 2 | — | onion-skin/reference evidence panel | `design:accessibility-review` | `/design-evidence` |
| S5 ship | **`/design-sync` push** | record cloud push skipped or done externally | — | `/design-push` (optional) |
