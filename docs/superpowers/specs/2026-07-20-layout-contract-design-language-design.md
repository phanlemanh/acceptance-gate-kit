# Layout Contract + Layout Meter — Design-Language Wave Design

**Date:** 2026-07-20

**Status:** Approved in chat; written-spec review pending

**Target:** skill `ux-ui-craft` (acceptance-gate plugin) + `design-loop` static check

**Compatibility:** ux-ui-craft 1.3.0 → 1.4.0 · acceptance-gate 1.16.0 → 1.17.0 ·
design-loop 0.2.0 → 0.3.0 (manifests already read 0.2.0; the README "v0.1.1
scaffold" status line and the sync-script echo "0.2.1" are stale and get fixed
in rollout). No feature-loop / feature-loop-codex changes; the
"Full wire" (meter as an automated per-surface eval) is explicitly out of scope.

## 1. Problem

ux-ui-craft teaches a design language, but only two of its three verbs are
implemented per material. Measured on the current skill (1.3.0):

| Material | Declare ("chữ viết") | Spend (binding) | Verify (machine) |
|---|---|---|---|
| Color | hex tokens — concrete roles | raw-hex ban, machine-enforced in design-loop | `check_contrast.py` |
| Type | fonts + scale — concrete | ≤2 fonts, ≤5–6 sizes | getComputedStyle count (manual, method documented) |
| **Grid/Space** | **prose only** — no required format | "screens spend these lines" — nothing binds code to the declaration | getBoundingClientRect count (manual, **no script ships**) |
| **IA/sitemap** | exit-test advice only, not an artifact | — | none |

Three consequences:

1. By the skill's own meta-rule ("a rule you cannot verify is decoration"),
   the Alignment budget gate is half-decoration: contrast ships a tool,
   alignment ships a counting method and trust.
2. The architecture layer the user *feels* (IA → archetype → spacing) is the
   only layer with neither a written artifact nor a meter. The model "speaks"
   layout; it never writes it down, so every screen is a new builder without
   a blueprint — drift by construction.
3. A **documented promise is currently broken**: design-loop's
   `references/port-translation.md` states raw px is *"forbidden — (enforced
   by design-static-check.mjs)"*, but `tokenOnly()` in
   `design-loop/scripts/design-static-check.mjs` only matches hex colors
   (`#[0-9a-fA-F]{3,8}`). No px enforcement exists. This is the FM-c
   "promise 3, run 1" failure mode the same script polices elsewhere
   (its own `--require-html` guard).

## 2. Decisions taken in chat

1. **Scope:** Docs + meter ("Docs + máy đo"), packaged inside ux-ui-craft —
   not docs-only, not full gate wiring.
2. **Architecture:** "CSS is the blueprint" — the CSS custom-property block IS
   the single declaration; no separate YAML contract (two sources of truth
   would recreate the drift being cured). Meter is a portable, dependency-free
   snippet, not a Playwright runner.
3. **Placement:** two layers following the existing contrast precedent (one
   rule, two homes — portable in the skill, blocking in the loop):
   - *Language layer* — ux-ui-craft: contract format, binding rules, meter,
     coherence procedure. Universal (description-triggered, no repo config).
   - *Blocking layer* — design-loop `design-static-check.mjs`: new
     `layout-token-only` SOURCE rule. Narrow (only `/design-init`-wired repos,
     `surface:true` features, S4 rounds) but machine-blocking. Closes the
     port-translation promise gap without changing that document.
   The two layers couple by CSS-token convention only — no imports, no new
   runtime coupling (preserves design-loop's stated design).

## 3. Layout Contract (ux-ui-craft, Step 3 obligation)

The model MUST write the contract before drawing the first screen of any new
surface (>1 content area). Two parts.

### 3.1 Structural part — the CSS `:root` block

```css
:root {
  /* Layout Contract v1 — all values on the 4/8 grid */
  --container-shell: 1200px;   /* page frame        */
  --container-form:  640px;    /* forms             */
  --container-prose: 68ch;     /* reading           */
  --gutter: 24px;              /* ONE gutter system */
  --gutter-compact: 12px;      /* the only allowed variant */
  --space-within:  8px;        /* level 1: inside a group   */
  --space-between: 24px;       /* level 2: between groups   */
  --space-section: 56px;       /* level 3: between sections — strictly increasing */
}
.shell { display: grid;
  grid-template-columns: [shell-start] 280px [sidebar-end main-start]
                         minmax(0,1fr) [main-end rail-start] 320px [shell-end]; }
```

Rules: ≤3–4 `--container-*` each named by content type; exactly one
`--gutter` (+ at most `--gutter-compact`); exactly three `--space-*` levels,
strictly increasing, all on the 4/8 grid. Page skeletons use **named grid
lines** so every declared alignment line has a real identifier in code.

### 3.2 Functional part — the sitemap (≤10 lines)

Indented plain text. Lives as an HTML comment at the top of the artifact
(single-file deliverables) or as a block in the design doc (multi-file apps).
Conditions: exists BEFORE screens are drawn; every major visible block maps to
exactly one line. This promotes ia-craft's "sketch the sitemap" exit test from
advice to a required artifact.

### 3.3 Binding rules (spending)

- `margin` / `padding` / `gap` / positional offsets spend only
  `var(--space-*)` or `var(--gutter*)`; container widths spend only
  `var(--container-*)`.
- A raw number in a layout property is drift — same defect class as a raw hex.
  Single exception: an optical adjustment **with a comment naming the
  reason** (existing "fix it or name it" rule, now mechanical).
- Proportionality: a lone component inherits the contract of the page that
  hosts it; it never declares its own. Only new surfaces write contracts.
- Role split by repo: if the repo has design-loop wired, binding is
  machine-enforced (Section 6); on a bare repo it is self-discipline plus the
  meter.

## 4. Layout meter — `skills/ux-ui-craft/scripts/measure_layout.js`

Sibling of `check_contrast.py`. Self-contained, dependency-free script
(~200 lines) that runs **in a real browser page context** — Playwright
`evaluate`, browser-MCP `javascript_tool`, or pasted into a console. jsdom is
explicitly unsupported: it has no layout engine (`getBoundingClientRect`
returns zeros), the same limitation design-static-check already documents for
tap-targets.

### 4.1 Internal split (testability)

- `collect()` — DOM scan → array of visible block rects + computed gaps.
  Requires a browser. A "block" is a structural element (`section, article,
  nav, header, footer, aside, form, table, figure, fieldset, ul, ol, div`)
  with a rendered box ≥40px wide, display not inline, visible in the current
  viewport screenful — inline text flow is never counted.
- `analyze(rects, opts)` — **pure function**: clusters left edges (±3px),
  counts lines, flags singletons (with short selector paths), collects
  distinct container widths (flags near-equal pairs <48px apart), and lists
  vertical sibling gaps not within ±1px of a declared `--space-*` /
  `--gutter*` value. Testable under plain node with synthetic rects.

### 4.2 Output — design-loop evidence standard

Emits `{ run_id, verifier, verified_at, verdict, exit_code }` plus
measurements, exit `0 PASS · 2 REJECT · 3 BLOCKED · 4 bad usage` — matching
`design-static-check.mjs`, so a later wave can wire it as a per-surface eval
with one config line.

REJECT when any of: `lineCount > maxLines` (default 10), `singletons > 0`,
distinct container widths > 4, `offScaleGaps > 0`. Defaults overridable via an
options argument (a dense operator shell may pass `maxLines: 12` — and says
so). BLOCKED when the page has no styled content to measure.

The meter measures ONE state. The matrix loop (state × 375/768/1440) is
driven from outside by the model, which reports the worst cell — documented in
layout-craft, same anti-flattery rule as the type budget.

Role split: the machine supplies counts; the model supplies role judgment
(which cluster answers to which declared line) and writes down any named
optical exceptions.

## 5. Structure–space coherence check (model-run, v1)

New gate row, procedure documented in layout-craft:

For each visible sibling-block pair → look up their distance in the sitemap
(same group / same section / cross-section) → the expected spacing level →
compare with the measured gap from the meter JSON. **Mismatch budget = 0.**
Every mismatch is resolved by fixing the space *or fixing the sitemap* — the
second arm is the point: it forces the model to revisit the architecture
instead of nudging padding. Not scripted in v1 (the sitemap is semantic, not
in CSS); scripting it is a candidate for the next wave.

## 6. design-loop 0.3.0 — `layout-token-only` blocking rule

`design-static-check.mjs` v0.3, SOURCE mode, alongside the existing hex rule:

- **CSS lines:** flag
  `(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(-[a-z]+)?\s*:`
  whose value contains a raw `<number>px|rem`, on lines that are neither
  token definitions (`--[\w-]+\s*:` — token sheets legitimately define px)
  nor comments.
- **Allow-list:** bare `0` / `0px`; `1px` (hairlines); `100%`; `auto`;
  literals inside `var(--x, 8px)` fallbacks (token-first is preserved).
- **TSX/JSX lines:** flag Tailwind arbitrary spacing values —
  `\b(m|p)(t|r|b|l|x|y|s|e)?-\[\d+(px|rem)\]` and
  `\b(gap|top|right|bottom|left|inset)-\[\d+(px|rem)\]` — inside className
  strings.
- **Deliberately out of v1:** `width`/`height` scanning (icons and media have
  legitimate fixed sizes; a `--size-*` discipline is a v2 question). This is
  scoped to the spacing/position drift class. Also out (line-based scan, same
  bound as the hex rule): single-line multi-declaration CSS
  (`.x { margin-top: 13px; }` on one line) and minified CSS — the property
  regex anchors at line start; port targets are Prettier-formatted.
  Post-review hardening: inline `/* … */` comments are stripped before all
  checks and the token-definition escape is line-anchored, so a trailing
  comment mentioning `--token: 16px` can no longer mask a real violation
  (regression D10).
- Violations are BLOCKING (exit 2), same reporting shape as the hex rule.
- Fixtures `tests/design-loop/fixtures/src-raw-px/` (+ keep `src-clean` green)
  and new cases in `tests/design-loop/run-tests.sh`:
  raw spacing px REJECTs (2) · token-definition px passes (0) ·
  `var()` fallback passes (0) · Tailwind arbitrary REJECTs (2).
- `port-translation.md` is not edited — its "(enforced by
  design-static-check.mjs)" claim simply becomes true.
- Bump both design-loop manifests (`.claude-plugin` + `.codex-plugin`) to
  0.3.0; note the new rule in `design-loop/README.md` (fidelity layer list +
  status, replacing the stale "v0.1.1 scaffold" line); update the hardcoded
  version echo in `scripts/sync-plugin-packages.sh`.

## 7. Documentation changes (ux-ui-craft 1.4.0)

| File | Change | Size |
|---|---|---|
| `SKILL.md` | Step 3: Layout Contract bullet (points to layout-craft). Step 6 table: Alignment budget row gains "— verify with `scripts/measure_layout.js`"; **new row** "Structure–space coherence" (sibling-pair spacing level matches sitemap distance; mismatch budget 0; method: layout-craft). Version → 1.4.0. | ~10 lines |
| `references/layout-craft.md` | Two new sections: **"The contract is written in CSS"** (format §3, binding rules, optical exception) and **"Running the meter"** (three ways to run, matrix worst-cell loop, coherence procedure §5, repo role split). Contains the contract CSS block as an *indented* code block — preserving the skill's zero-fence prose style (verified by a fence count in the plan). | ~55 lines (87 → ~140) |
| `references/ia-craft.md` | Sitemap exit test: advice → required artifact, pointing to the contract. | 2 sentences |
| `references/css-technique.md` | One line: named grid lines example beside the subgrid bullet. | 1 line |

## 8. Tests — `tests/skills/ux-ui-craft/`

New directory following the existing bash-runner convention:

- **Node tests for `analyze()`** (no browser): clean synthetic rects
  (8 lines → PASS) · chaos (16 lines, 9 singletons → REJECT, all 9 listed) ·
  broken rhythm (within-group 20 vs between-group 24 → offScaleGaps names the
  pair).
- **3 HTML fixtures** (`fixture-clean.html`, `fixture-chaos.html`,
  `fixture-broken-rhythm.html`) with expected JSON beside each — verified in a
  real browser during the dev session before ship (pressure-test protocol;
  jsdom cannot run these).
- Existing suites (`tests/design-loop`, `tests/scripts`, `tests/plugins`)
  must stay green.

## 9. Out of scope (next-wave candidates)

- Wiring the meter as an automated per-surface eval
  (`executors.design.layout` or folded into `ui_check`) — the evidence-shape
  output in §4.2 is the prepared seam.
- Scripting the coherence check (needs a machine-readable sitemap).
- `--size-*` discipline for width/height binding.
- Exemplar corpus of annotated "fluent" layouts.

## 10. Rollout

1. Implement docs + meter + design-loop rule; all suites green.
2. Bump: ux-ui-craft SKILL.md 1.4.0 · acceptance-gate plugin.json 1.17.0 ·
   design-loop manifests 0.3.0.
3. `scripts/sync-plugin-packages.sh` to mirror into `plugins/`.
4. GUIDE.md: short update to the ux-ui-craft section (contract + meter, a few
   lines).
5. Consuming repos (per rollout memory): pull acceptance-gate 1.17.0 +
   design-loop 0.2.0; Codex local-marketplace needs `plugin add` again
   (upgrade is Git-only).

## 11. Success criteria

- The deliverable of a UI task changes shape: **contract + screens + meter
  JSON**, not screens alone.
- A page can no longer pass by looking right: the 37-line/23-singleton class
  of defect is machine-named at measurement time.
- `port-translation.md`'s enforcement claim is true.
- All three new suites and all existing suites green.
