# Command families per stage (H1 first-party vs H2 cowork) — reference

Two families share the "design" prefix but are unrelated. Never present an H2
advisor as if it syncs to claude.ai/design.

## H1 — FIRST-PARTY (Claude Code built-ins, NOT shipped by any plugin)
`/design-login` (auth; needs a Claude subscription) · `/design-sync` (2-way
design-system sync; planId-gated: read → finalize_plan(planId, user approves) →
write_files/delete_files) · `/design` (design in Code) · tool `DesignSync`.
**Agent-tool — NOT CI/headless-callable.** This is the real claude.ai/design bridge.

## H2 — COWORK (`anthropics/knowledge-work-plugins/design`)
`design:design-critique` · `design:design-system` · `design:design-handoff` ·
`design:ux-copy` · `design:accessibility-review` · `design:user-research` ·
`design:research-synthesis`. **Prompt-only advisors** (optionally Figma-MCP-boosted).
Do NOT connect to claude.ai/design. `design:design-handoff` (paper spec) ≠ the
`/design-sync` handoff (code round-trip).

## Per-stage

| Stage | H1 (bridge) | H2 (advisory) | design-loop component |
|---|---|---|---|
| S0 detect | — | — | `scripts/design-detect-surface.mjs` |
| S1 spec | — | `design:design-system`, `design:design-critique` | skill + `references/state-matrix.md` |
| S1-D mockup | **`/design-login`, `/design-sync`** | `design:design-critique`, `design:accessibility-review` | `/design-mockup`, `provenance.mjs` |
| Gate 1 | — | `design:design-handoff` | `/acceptance-card` (acceptance-gate) |
| S2 plan | — | `design:ux-copy` | `references/port-translation.md` |
| S3 port | — | `design:accessibility-review` | `references/port-translation.md` |
| S4 verify | — | — | `design-static-check.mjs` + acceptance `design-gate.mjs` + `design-fidelity-diff.mjs` |
| Gate 2 | — | `design:accessibility-review` | `/design-evidence` |
| S5 ship | **`/design-sync` push** | — | `/design-push` (optional) |
