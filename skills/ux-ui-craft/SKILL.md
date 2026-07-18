---
name: ux-ui-craft
description: >
  Build or change ANY user-facing interface by running this skill's process,
  hard gates, and self-verification loop — websites, web apps, dashboards,
  admin panels, mobile app screens, components, forms, onboarding or checkout
  flows, landing pages, prototypes, a redesign, or a dark-mode pass. Reach for
  it the moment a task will produce or alter something a user sees or interacts
  with, including vague asks like "make it look better / cleaner / more
  professional / more trustworthy" and requests in any language — and
  especially when the work looks routine enough to just build directly,
  because that is exactly when the accessibility floor (contrast, focus,
  keyboard, empty/loading/error states) and the anti-AI-slop distinctiveness
  get silently skipped. Also use it to review or critique an existing
  interface. Do NOT use it for backend or REST/API design, database schemas,
  data charts or spreadsheets, logo or brand-mark design, slide decks, or
  debugging a component's logic.
---

# UX/UI Craft

## Why this skill exists (read once, then act)

As an LLM you design with three structural handicaps, and every rule below
exists to compensate for one of them:

1. **No access to real users.** You cannot run usability tests, so intake
   (Step 1) and the self-verification loop (Step 7) replace research.
2. **No memory between generations.** Every screen you produce is a "new
   designer"; drift is your default. Tokens (Step 3) are your artificial
   memory.
3. **Gravitational pull toward the average.** Left alone you will produce
   the statistical mean of the internet — recognizable "AI slop". The
   direction step (Step 2) and the ban list exist to fight this pull.

One meta-rule governs everything: **a rule you cannot verify is
decoration.** Prefer pass/fail gates and one-line tests over adjectives.
"Modern, clean, beautiful" is not an instruction; "contrast ≥ 4.5:1, one
primary action per screen, ≤ 2 typefaces" is.

## Non-negotiable defaults

- Never start writing UI code before Steps 1–3 (Context Lock → Direction →
  Tokens) are done. A "quick component" still gets a three-line context
  lock; it just takes thirty seconds.
- Act first on reversible decisions and state them; ask the user only when
  the Context Lock genuinely cannot be filled from the brief, the codebase,
  or memory. One terse question, not a questionnaire.
- Real copy everywhere, from the first render. Lorem ipsum is a build
  failure, because copy is design material and placeholder text hides
  layout and hierarchy problems until it is expensive to fix them.
- Users don't want to use the product; they want the job done. Judge every
  decision by whether it shortens the path from intent to outcome.
- Numbers, currency, and dates are copy too. Format them in the audience's
  locale (a Vietnamese price is 1.234.567 ₫, not 1,234,567 ₫) and keep one
  format everywhere on the surface. A wrong thousands separator reads as
  foreign instantly — it undoes trust faster than any visual flaw, because
  money is the one thing every reader checks.

## The process

### Step 1 — Context Lock

Before any pixel, write down (in your plan) and state to the user:

- **Actor** — who exactly uses this; on a multi-sided product, which side
  this surface serves (a buyer browsing and an operator working all day
  need different densities and speeds).
- **Job** — the one thing they hire this screen to do.
- **Context** — device, environment, frequency: first-time visitor or
  daily power user?
- **Constraints** — brand, existing design system or tokens in the
  codebase, platform conventions.

If the brief doesn't pin these down, pin them yourself from the codebase
and available context, and declare your choices so the human can correct
them cheaply. *Test: can you state the screen's job in one sentence? If
not, you are not ready to design.*

### Step 2 — Direction + Signature

Choose an explicit aesthetic direction derived from the subject's own
world — its materials, vernacular, and audience — not from your habits.
Name the direction in one line. Then choose **one signature element** this
design will be remembered by, and spend your boldness there; keep
everything around it quiet and disciplined. A design that is bold
everywhere is loud, not distinctive.

Before proceeding, run the default test: *"Would I have produced this same
direction for any similar brief?"* If yes, revise and say what you
changed. If stuck, pick deliberately from directions like: editorial,
data-dense professional, soft-depth product, brutalist utility, warm
paper, technical mono, luxury restraint — chosen *for this subject*, never
by rotation.

### Step 3 — Tokens before screens

Generate the token system first — *unless the codebase already owns one:
then bind to it instead (see System mode below)*. Every screen afterwards only *spends*
tokens; it never invents new values. This is where consistency comes from
— not from trying to remember.

- **Color**: 4–6 named **semantic roles** as hex (`bg`, `surface`, `text`,
  `text-muted`, `primary`, `destructive`…). Roles, not raw colors, so dark
  mode and theming are a re-mapping, not a rewrite.
- **Type**: ≤ 2 typefaces (characterful display used with restraint +
  workhorse body; optional mono for data), one scale, explicit weights.
- **Spacing**: a 4/8px grid only. Arbitrary values are drift.
- **Radius and elevation**: one small scale each.

Hard budgets: ≤ 2 fonts, 1 accent color, ≤ 5 text sizes per screen.
Budgets feel restrictive; they are what coherence is made of.

### Step 4 — Flows, then screens

The unit of UX is the flow that completes the job; a screen is a
cross-section of it. Map how the user arrives, the steps through, and
where they exit — including the exits you didn't plan.

- Exactly **one primary action per screen**. Hierarchy is expressed by
  size, weight, and space before color.
- Familiar patterns for familiar jobs (users spend most of their time in
  *other* products — Jakob's Law). Spend novelty only where this product
  differentiates.
- Defaults are the most powerful design decision you make: most users
  never change them, so every default is a choice you made *for* them.
- **Close every loop.** A section that collects or edits input ships its
  commit affordance (save / submit / apply) and the state that follows —
  in that section, visible without hunting. A settings card with fields
  but no save button is a mockup wearing production clothes, and it is
  the kind of gap you stop seeing after staring at a layout for an hour.
  *Test: for each input cluster, point at the control that commits it.*
- **The noun is a contract.** When the brief names a familiar object — a
  player, a canvas, a table, a modal, a search box — the name carries
  the full control set every user already knows from the products they
  live in (Jakob's Law at component scale). "Video player" means seek,
  time, volume, fullscreen — not autoplay in a box; a canvas implies
  expand/fit/zoom. Enumerate the expected set completely first (see
  `references/component-contracts.md`), then trim *deliberately*: walk
  the WHOLE enumerated table and mark every row `present` or `descoped +
  reason` — a row left unmarked is exactly the defect class this rule
  exists to kill. One reason may cover a group ("not a customer-facing
  player → seek, volume, fullscreen, speed all out"), but the items
  still get named; "…and the rest" is how omissions hide. *Test: what
  would a daily user of the best-known version of this object reach for
  in the first ten seconds — and is each of those present or consciously
  descoped?*
- **Structure before screens.** When a surface has more than one content
  area, inventory the content and group it by the actor's mental model —
  then fix a labeling ledger: one name per concept, used identically in
  nav, buttons, and headings (see `references/ia-craft.md`). *Test: can
  the actor guess which group holds a thing without opening anything?*

### Step 5 — State completeness

The happy-path-only screen is a mockup, not a product. (On a gate
prototype, add the business object's *domain states* first — see Prototype
mode below.) For every screen, design and implement:

- [ ] **Empty** — an invitation to act, not a shrug
- [ ] **Loading** — skeleton over spinner; layout must not jump when data
      arrives
- [ ] **Error** — say what happened + what to do next; direction, not
      mood; never vague, never apologetic
- [ ] **Partial / degraded data** — missing fields, stale cache
- [ ] **Overflow** — long names, 10× the expected content, and almost
      none
- [ ] **(Apps)** offline, interrupted, permission-denied

Prove these states in real code paths — but the *way you demonstrate* them
must not ship. The tempting shortcut, when the deliverable is one static file,
is a visible "demo / state" switcher in the header so a reviewer can flip
Loading / Empty / Error. Don't: a control that flips app state reads as a
prototype to everyone who sees it, reviewer and user alike, and a shipping
product that looks like a demo has already lost. Expose states out-of-band
instead — a URL flag (`?state=error`), a separate states page, or
screenshots of each — and keep the shipped chrome clean. The test is the same
one as for any control: if a real user could reach it, it is either a genuine
feature or it does not belong in the build.

### Step 6 — Hard gates (baseline: every project, pass/fail)

| Gate | Pass condition |
|---|---|
| Contrast | body text ≥ 4.5:1, large text ≥ 3:1 — verify with `scripts/check_contrast.py` |
| Targets | touch/click targets ≥ 44×44 px (48dp on Android) |
| Keyboard | the full flow is traversable by keyboard; focus is visible |
| Semantics | real elements (`button`, `nav`, `label`); every input labeled |
| Responsive | actually rendered and checked at 375 / 768 / 1440 — no overflow, no orphaned layouts |
| Motion | 150–300 ms, ease-out, purposeful; `prefers-reduced-motion` respected |
| Copy | buttons are verb + object ("Save listing", not "OK"); an action keeps the same name across the whole flow (Publish → Published) |
| Type budget | ≤5-6 computed text sizes and ≤2 small-label voices per rendered screen — COUNT them on the artifact (getComputedStyle) across the WHOLE declared matrix (every state × width), and report the worst cell, not a flattering one; don't trust the token sheet or a single scene. Drift arrives via inline chips, utility styles, and states you didn't re-measure |
| Build | console clean, no dead controls, no placeholder content |

These are the quality floor. Build it without announcing it — nobody
praises a floor, everybody notices a hole in one.

### Step 7 — Self-verification loop (your replacement for user testing)

Render → screenshot → grade → fix → repeat. Do not declare done on
iteration one.

If a browser is available (Playwright, headless Chrome), take real
screenshots at the three breakpoints — a picture is worth a thousand
tokens. Grade each iteration against this rubric:

1. **5-second test** — from the screenshot alone, can you tell what this
   product does and what to click first?
2. **Squint test** — does visual weight match actual importance?
3. **State audit** — flip through every Step-5 state; still coherent?
4. **Gate audit** — run the Step-6 table honestly.
5. **Default test** — "would any similar brief have produced this?" If yes
   at this stage, fix the signature, not the padding.
6. **Brief audit** — re-read the brief one last time. Every deliverable it
   names as a noun (a tokens sheet, a states demo, a chart, a section) must
   be *visibly present in the artifact*, not satisfied in prose or a code
   comment. Briefs are checklists the client already wrote for you; the
   easiest way to lose to a worse design is to skip an item the brief
   spelled out.

Report findings honestly, including what you chose not to fix and why.

## System mode — when a design system owns the look

Detection: the repo carries a design system or design-of-record (a token
vocabulary, a `design.md`, a frame kit, a token-lint script) — or the task
is a mockup/prototype feeding a review gate. Three steps invert; everything
else (context lock, states, gates, verification) holds:

- **Step 2 inverts.** Identity is already decided — don't re-pick it. Your
  signature moves from visuals to *insight*: the one arrangement, scene, or
  interaction this artifact exists to get decided. The default test becomes
  the decision test: *if a reviewer could approve this without deciding
  anything, it isn't done — it's decoration.*
- **Step 3 inverts: bind, don't generate.** Map your semantic roles onto
  the system's existing vocabulary. A new hex or font on a system-owned
  surface is drift, not creativity; if a role you need has no token,
  surface that as a finding for the system's owner — don't improvise
  inline.
- **Chrome is borrowed, never redrawn.** Show the work inside the product's
  real shell and frames. Inventing nav, menus, or chrome that don't exist
  *reads* more complete but is drift wearing completeness — same family as
  the shipped state-switcher ban.

## Prototype mode — truth of intent, not product

A gate prototype answers "is THIS what we should build?". Scope the craft
to that question:

- **Mock data is the medium — and a design decision.** Real logic is out of
  scope; hard-coded data is fine. But make it thick and professionally true
  (names, numbers, sources a practitioner would recognize), shaped like the
  data contract you expect. A reviewer given thin data reviews colors
  instead of the business — which defeats the gate.
- **Flows become a journey.** Numbered scenes along the story; the opening
  scene shows the feature *in situ* among the product's real entry points;
  every button that advances the story actually advances it. More than ~7
  scenes means you're prototyping several review rounds at once — split.
- **States are domain states first.** Enumerate the business object's own
  states (draft → generating → ready → sent…), then Step 5's fetch states.
  Declare the matrix — domain-state × theme × viewport — *before* drawing;
  undeclared is undrawn, and rare states outside the story line become
  appendix scenes rather than being skipped.
- **The decision lives in a control, not in narration — and so do its
  consequences.** If a scene exists to get something decided, put the
  decision on screen as an operable control (a one-tap "fix to 5,35 +
  approve", a field-cited mismatch badge), and render what follows from
  it *on the artifact itself* (a delayed milestone shows the shifted
  payment on the customer's page, not in the presenter's commentary).
  Reviewers approve what they can see and imagine pressing; prose beside
  the screen is invisible at gate time. On mobile, the deciding control
  belongs above the 375 fold of the money scene — the gate is judged on
  that shot.
- **Done = the declared matrix covered and captured** — never "one polished
  screen". Captures are the currency of review gates: the money scene's
  mobile shot rides the approval card, and a missing cell keeps the gate
  closed. Name captures by their matrix cell (state × theme × breakpoint)
  so a downstream fidelity rail — a design-loop that diffs the built
  product against this design-of-record — can consume them without
  re-shooting.

## Top-tier mode

Baseline gates make an interface *correct*. Top-tier invariants make it
*feel* like the best products the user knows. Activate this mode when the
user asks for it, or when the surface is the product's core — the screen
its main actor lives in daily. Baseline stays; add:

| Invariant | Enforce as |
|---|---|
| Speed is a feature | perceived response < 100 ms on every interaction: optimistic UI (respond as if done, reconcile after), instant navigation, prefetch on intent, skeleton within one frame |
| Forgiveness over confirmation | any action undoable within ~10 s ships with undo instead of a confirm dialog; only destructive + irreversible actions earn confirmation |
| Opinions over settings | every new setting or toggle must be justified in writing; the default answer is "we decide". Each toggle is a decision the team didn't dare make |
| Low floor, high ceiling | day one usable with zero learning; a power layer exists — keyboard coverage, a command surface (Cmd+K) where it fits, bulk actions |
| Motion is a spatial model | animation answers "where did this come from, where did it go". Two-way test: remove it — orientation lost → it's information, keep; nothing lost → it's decoration, cut |
| Judged by the worst screen | review quality on error, edge, and admin screens, not the demo path. Paint the back of the fence |
| Subtraction pass | before delivery, remove one element per screen; if nothing can go, look harder |

**Machine holds the floor, human raises the ceiling.** The gates above are
yours to enforce mechanically. Taste calls — the direction, what to cut,
which setting to refuse — get surfaced to the human at the end of each
loop as explicit named decisions, never buried in a diff.

## Audit mode — reviewing an interface you didn't just build

Trigger: the ask is to review, critique, or explain why an existing
surface feels off — or a redesign is starting and needs a baseline. You
produce findings, not fixes; building starts only if the user asks
afterwards (the audit then becomes that redesign's Step 1 input).

The stance: **measure first, opine second.** An audit's authority comes
from findings the owner can reproduce, not from adjectives. Anything you
can gate, gate; anything that is taste, label it as taste.

1. **Lock the actor before judging.** Run Step 1 on the existing surface.
   Most wrong critiques come from auditing against the wrong actor or job
   — a daily operator's screen judged by first-visit aesthetics.
2. **Measure the floor on the rendered artifact.** Run the Step-6 gate
   table against real renders at 375 / 768 / 1440: getComputedStyle
   counts for the type ladder and label voices (whole state matrix, worst
   cell), contrast per shipped pair (`scripts/check_contrast.py`),
   targets, overflow, a keyboard walk. Source code lies about rendered
   outcomes; if you cannot render, say so and mark every unmeasured claim
   as unverified instead of stating it with measured confidence.
3. **Walk the contracts and the map.** Name the objects the surface
   claims to be (player, table, wizard…) and mark every expected control
   present / missing / broken (`references/component-contracts.md`). Then
   the IA checks (`references/ia-craft.md`): wayfinding (where am I,
   what's here, how do I get back), one name per concept across nav /
   buttons / headings, grouping vs the actor's mental model, and
   close-every-loop (inputs with no visible commit affordance).
4. **File findings in three ledgers, ranked by user harm:**

   | Ledger | Contents | Authority |
   |---|---|---|
   | Defects | gate fails: contrast, targets, overflow, missing or dead states, broken contract rows | measured — non-negotiable |
   | Discipline drift | budget breaches (type ladder, label voices), off-grid spacing, label inconsistency, ban-list hits | counted — cite the number |
   | Judgment calls | direction, density, hierarchy choices | opinion — name the test it fails, never "feels dated" |

5. **Report what must survive.** Name what the surface does well that a
   redesign must not lose. An audit that only lists faults invites a
   rewrite that destroys the good parts along with the bad.

Honesty gates: a surface may pass — say so rather than manufacturing
findings to look thorough. Lead with the ~10 highest-harm items and give
the rest as an appendix count; a sixty-item dump is how the real defects
get ignored. Every finding ships with its evidence (ratio, count,
element, screenshot) so the owner can reproduce it without trusting you.

## Ban list — named, because negative examples beat positive advice

These read as "an AI made this". Each is legitimate *if the brief
explicitly asks*; all are banned as defaults:

- Purple-blue gradient on white SaaS template; glassmorphism everywhere
- The current LLM default looks: cream background + high-contrast serif +
  terracotta accent; near-black + single acid-green accent; broadsheet
  hairlines with zero radius
- Emoji as icons; the centered generic hero (big number, tiny label,
  gradient blob)
- Numbered markers 01/02/03 on content that isn't actually a sequence
- "Unleash / Empower / Supercharge / Revolutionize" copy; lorem ipsum;
  invented testimonials
- Confirm dialogs guarding undoable actions; tooltips patching a design
  that failed to explain itself (the tooltip is the symptom — fix the
  control)
- A spinner where a skeleton belongs; toasts that read like paragraphs
- A "demo / state" switcher left in the shipped chrome to show off Loading/
  Empty/Error — dev scaffolding that makes a real product read as a prototype

## Platform routing

- Web (site, dashboard, web app) → read `references/web.md` before Step 3
- Native / mobile app UI → read `references/mobile-app.md` before Step 3
- Responsive product spanning both → read both, web first

## Craft routing — read at the step that needs it, not upfront

These carry the *technique* the budgets assume. Load lazily, per decision:

- Choosing the direction (Step 2) → `references/direction-craft.md` —
  derivation ladder, the domain-artifact move, insider-fluency tests
- Multi-area surface or nav design (Step 4) → `references/ia-craft.md` —
  organization schemes, labeling ledger, nav model by count, wayfinding
- Brief names a familiar object (Step 4) → `references/component-contracts.md`
  — the MECE control set each noun implies (Access/ARIA included), and how
  to descope deliberately
- Fields the user must fill, wizards, errors (Steps 4–5) →
  `references/guidance-craft.md` — helper-text trails for external
  referents, error anatomy (what · why · next move as a control),
  recovery paths, disabled-with-reason
- Setting type (Step 3) → `references/typography-craft.md` — pairing
  axes, scale technique, micro-typography
- Building the palette (Step 3) → `references/color-craft.md` — OKLCH
  ramps, undertone discipline, accent deployment, dark-mode remap
- Writing the code (Step 6) → `references/css-technique.md` — fluid
  values, `:has()` state styling, crisp details, motion engineering

## Scripts

- `scripts/check_contrast.py '#FG' '#BG' [...]` — WCAG contrast ratios
  with AA pass/fail for every foreground/background pair you ship. Run it
  on your final token palette, not on your intentions.
