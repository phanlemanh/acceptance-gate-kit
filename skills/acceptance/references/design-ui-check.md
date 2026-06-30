# Tier B — design ui-check recipe (authoritative P0)

The authoritative design-quality gate. Runs the vendored Impeccable detector in
a **real browser** (where `var(--*)` tokens and backgrounds resolve), so contrast
and other computed-style P0s are precise — unlike the jsdom `script` tier, whose
contrast detail is noisy (it flags the right screen for noisy reasons).

This is a **`ui-check` executor**, not a new one — it reuses the browser path the
kit already uses for ui-check (Claude Preview MCP locally, Chrome MCP for staging)
and the consumer's `dev_server` config. No new dependency.

## When to use

- The criterion is about rendered design quality (a11y/contrast, AI-slop tells) AND
- the surface is a web UI reachable at `config:dev_server.url` AND
- a browser MCP is available this session.

Otherwise fall back to the `script` tier (`design-gate.mjs --mode static`, or
`--mode dom` with jsdom) and **note the downgrade in the evidence report** — same
rule as ui-check → judgment downgrade in `eval-executors.md`. The script tier
blocks on reliable markup tells (side-tab, gradient-text, …) and treats jsdom
contrast as advisory.

## eval shape

```yaml
- id: E-design-B
  executor: ui-check
  surface: "{url}"                 # config:dev_server.url + route
  fail_on: [P0]                    # P0 a11y blocks; raise to [P0,P1] to block AI-slop tells too
  evidence_required: [run_id, exit_code, verifier, verified_at, screenshot]
```

## Steps (the verify subagent runs these)

1. **Start/confirm the dev server** per `config:dev_server.start`; resolve the
   surface URL.
   - **Claude Preview path:** `preview_start` (per `.claude/launch.json`) → keep the
     returned `serverId` for every later `preview_eval` / `preview_screenshot`.
   - **Chrome path:** ensure the dev server is up, then use `navigate`.
2. **Navigate** the browser to the surface (Claude Preview: `preview_eval` with a
   `location.assign(...)` / Chrome: `navigate`). Screenshot → `evidence/E-design-B-step1.png`.
3. **Inject + scan in one eval.** Read `${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js`
   and evaluate it in the page, then call the scan. The file sets
   `autoScan:false`, so no overlay is drawn.

   Substitute `<failOn>` with the eval's declared `fail_on` list (default `['P0']`),
   not a literal — so the call matches the eval.

   Chrome MCP:
   ```
   javascript_tool({ tabId, action:'javascript_exec',
     text: <contents of design-scan.js> + "\nwindow.__impeccableDesignScan({failOn: <failOn>})" })
   ```
   Claude Preview MCP:
   ```
   preview_eval({ serverId, expression: "(function(){" + <contents of design-scan.js>
     + "; return window.__impeccableDesignScan({failOn: <failOn>}); })()" })
   ```
   Lighter alternative when the dev server serves a static dir: copy
   `design-scan.js` there and inject `<script src="/design-scan.js">`, then call
   the function — avoids passing the 219 KB body through the tool.

4. **Read the verdict** the call returns. Three shapes — handle all three:
   ```json
   { "verdict": "REJECT", "exit_intent": 2, "p0": 14,
     "blocking": ["low-contrast"], "hits": ["low-contrast","side-tab","ai-color-palette"],
     "findings": [{ "rule":"low-contrast","pTier":"P0","detail":"2.4:1 — text #fff on #06b6d4" }] }
   ```
   `verdict: "PASS"` (exit_intent 0) when no failOn-tier finding; `verdict: "BLOCKED"`
   (exit_intent 1) when the bundle did not attach (`typeof window.impeccableDetect`
   not a function — e.g. CSP blocked the inject). Screenshot → `evidence/E-design-B-step2.png`.

5. **Map to hook-legal evidence** and write the eval block:
   - `verdict === 'BLOCKED'` → write `verdict: BLOCKED` + the returned `reason`; do
     NOT read exit_intent as a pass/fail. BLOCKED is a legal verdict — never fake PASS.
   - else `verdict`: PASS when `'PASS'`, REJECT when `'REJECT'`.
   - `exit_code`: `exit_intent` (0 PASS · 2 REJECT).
   - `verifier`: **`config:executors.design.ui_check`** — a `config:` reference the
     evidence hook accepts. Do NOT write a bare plugin path (`scripts/design-scan.js`):
     it won't resolve from the consumer repo and the hook will BLOCK the report. (Add
     the key in the wiring below.)
   - `run_id`: `{feature_slug}-design-B-{NNN}` (≥4 chars, satisfies the hook's L1 shape);
     `verified_at`: now; `screenshot`: the step images.
   - On REJECT, quote the P0 `findings[].detail` (the exact colour ratios) as the
     actionable backlog. The script tier (`design-gate.mjs`) now carries the same
     `detail`, so both tiers quote the same backlog.

## fail_on policy

- `[P0]` (default) — block only ship-stopping a11y/legibility (contrast, overflow,
  broken images). Recommended floor for any team.
- `[P0,P1]` — also block strong AI-slop tells (side-tab, gradient-text, cream,
  bounce, nested-cards, …). Use for brand/marketing surfaces.
- P2/P3 never block; they inform Tier-2 `judgment`.

P-tiers come from `lib/p-tiers.json` — the same source `design-gate.mjs` uses, so
the `script` and `ui-check` tiers never disagree on a verdict.

## Two-tier wiring (recap)

`_acceptance/config.yaml` (2-space indent — the parser requires it):
```yaml
executors:
  design:
    gate: "node <kit>/scripts/design-gate.mjs"   # script tier (static / jsdom)
    ui_check: "<kit>/scripts/design-scan.js"      # browser tier — the hook-legal verifier handle
```

`evals.yaml`:
```yaml
- id: E-design-A   # cheap floor, runs anywhere
  executor: script
  cmd: config:executors.design.gate
- id: E-design-B   # authoritative, real browser
  executor: ui-check
  fail_on: [P0]
  # verifier written as config:executors.design.ui_check (see step 5)
- id: E-design-C   # strategy only ~20%
  executor: judgment
  question: "Beyond the detector floor, is this on-brand and not generic?"
```

> Active on the live gate: Phase 2 EVAL-GEN adds a design eval for web-UI
> surfaces (SKILL.md step 2b) and `eval-executors.md` rule 4b routes
> design-quality criteria here. The detector + regression harness live in
> `vendor/impeccable/`, `scripts/design-*`, and `tests/design-eval/`.
