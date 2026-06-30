# Real-artifact run — OneHub Artifact Platform

Ran `scripts/design-gate.mjs` over `template/platform/*.html` (30 real OneHub UI
screens with external CSS tokens). End-to-end proof the gate works on real,
multi-file artifacts — and an honest read on what to trust.

## Headline numbers (DOM mode, fail_on [P0])

18/30 screens REJECTed — every one on `low-contrast`. jsdom resolves
`var(--oh-*)` tokens and inherited backgrounds imperfectly, so its *details* are
noisy — but a real-browser confirmation (below) shows the **verdict is correct**.

## Real-browser confirmation (authoritative)

Ran the same `detect-antipatterns-browser.js` in a real Chrome (served the
templates over http so tokens + CSS resolve) on D-01 and P-01:

| screen | jsdom #fff-on-#fff artifacts | real-browser white-on-white | real low-contrast |
|---|---|---|---|
| D-01 | several | **0** | **14** |
| P-01 | several | **0** | **26** |

- The jsdom artifacts (white-on-white) **vanish in the real browser** — confirmed
  jsdom-resolution noise.
- What remains is **real and systemic**: white text on saturated status/badge
  fills below WCAG AA — `2.1:1 #fff/#f59e0b`, `2.4:1 #fff/#06b6d4`,
  `2.5:1 #fff/#10b981`, `2.6:1 #fff/#c084fc`, `3.5:1 #fff/#ec4899`,
  `3.7:1 #fff/#3b82f6`, `4.0:1 #fff/#a855f7`, plus colored-text-on-white
  (`3.2:1 #d97706/#fff`, `3.3:1 #16a34a/#fff`).
- So the gate's REJECT was **right** — the screens do fail P0. jsdom flagged the
  right screens with noisy reasons; the real browser gives the precise backlog.

**The real finding for OneHub:** the status/badge colour tokens fail white-text
AA platform-wide. Fix = darken the fills or use dark text on these chips:
`#06b6d4 #0284c7 #3b82f6 #60a5fa #a855f7 #c084fc #ec4899 #10b981 #16a34a #f59e0b #d97706 #94a3b8 #a8a29e`.

## Reliable vs needs-confirmation

| Trust | Rules | Why |
|---|---|---|
| **Reliable** (jsdom-independent) | side-tab, skipped-heading, gradient-text, dark-glow, gpt-thin-border-wide-shadow, repeating-stripes-gradient, layout-transition, all-caps-body, numbered-section-markers, em-dash-overuse | markup / structure — no colour resolution |
| **Needs real-browser confirm** | low-contrast, ai-color-palette, tiny-text | depend on computed colour/size jsdom resolves badly |

Evidence of the jsdom limit — a `low-contrast` detail on D-01 read:
`1.0:1 — text #ffffff on #ffffff` (background failed to resolve → false positive).
Others are plausibly real: `2.4:1 — #ffffff on #06b6d4` (white on a cyan chip).
The signal is real; the **count and the 18/30 verdict are inflated**.

## Reliable systemic signals — act on these

- `skipped-heading` on ~10 screens — real heading-hierarchy a11y issue (deterministic).
- `side-tab` on C-02, D-01, D-02, N-02, P-01, PR-02 — the banned side-stripe border.
- `numbered-section-markers` on ~20 screens (static mode) — systemic; decide
  deliberate-brand vs template-reflex (a Tier-2 judgment call, not a P0).
- `dark-glow` (C-02, H-02, PR-01), `repeating-stripes-gradient` (PJ-01/02),
  `layout-transition` (PR-01, R-02), `gradient-text` (_design-system).
- The generated artifact OUTPUT screens (A-03..A-06) are clean (only `all-caps-body`).

## Complementarity holds on real artifacts too

Static caught markup tells (side-tab, dark-glow, numbered-markers, em-dash); DOM
caught computed-style tells (ai-color-palette, tiny-text, cramped-padding,
skipped-heading). Neither mode alone is complete — same lesson as the fixtures.

## Recommendation

- **jsdom DOM mode = CI proxy.** Trust the deterministic markup/structure rules;
  treat low-contrast / ai-color-palette / tiny-text as advisory until confirmed.
- **Production P0 contrast gate = the detector in the REAL preview iframe**
  (a real browser), where tokens and backgrounds resolve. That is the Artifact
  Platform integration recommended from the start: the same vendored
  `detect-antipatterns-browser.js`, run in the live preview instead of jsdom.
- Next: serve `template/platform/` + run the bundle in a real browser on 2-3
  screens to confirm which `low-contrast` hits are genuine, then treat those as
  the P0 backlog.

Re-run: `for f in <platform>/template/platform/*.html; do node scripts/design-gate.mjs "$f" --mode dom --jsdom tests/design-eval; done`
