---
name: acceptance-card
description: Render the plain-language Gate 1 or Gate 2 decision card and full evidence page for an Acceptance Gate feature on Codex. Use when a human needs to approve contract scope, judgment items, or signoff evidence.
---

# Acceptance Card for Codex

Render a presentation layer for one `_acceptance/<slug>/` workspace. The card
never changes the verdict and never signs for the human.

## 1. Validate input

1. Require one kebab-case slug and reject traversal.
2. Require `_acceptance/<slug>/contract.md`.
3. Read repository guidance to identify the product persona and preferred
   language.

## 2. Resolve scripts

Prefer the consumer runner when present:

```bash
node scripts/codex-plugin-runner.mjs acceptance-gate gate-card --root . --slug <slug> --extract
```

If the runner is absent, locate the newest installed Acceptance Gate cache
without hardcoding a version and run its `scripts/gate-card.js` with Node. A
missing cache is `BLOCKED` with the exact install instruction.

## 3. Create the plain-language overlay

Translate the extracted JSON without changing meaning:

- `feature_plain`: one product sentence;
- Gate 1 `will_do`: each item starts with `Sẽ`;
- Gate 1 `wont_do`: each item starts with `Sẽ KHÔNG` or `Chặn`;
- Gate 2 `decisions`: short non-technical questions;
- `scope_plain`: one deferred-scope phrase;
- Gate 1 `gap_probe`: leave critic rows as written (already product language);
  never invent findings; absence/probe-failed flags render from the script —
  the overlay has no key for this block;
- `decisions_plain`: every approved or provisional ledger choice as
  `đã chọn gì — đổi lại gì`.

Write `_acceptance/<slug>/card-plain.json` with `apply_patch`. The ledger is
rationale, not a new source of acceptance scope.

## 4. Render the card

Run the same gate-card action with:

```bash
node scripts/codex-plugin-runner.mjs acceptance-gate gate-card \
  --root . --slug <slug> --plain _acceptance/<slug>/card-plain.json
```

Wrap the returned fragment in a minimal UTF-8 document and save
`_acceptance/<slug>/card.html`.

When a browser tool is available, open the local card there. Otherwise provide
the absolute clickable file path. Do not report a gate decision from rendering
alone.

## 5. Gate 2 evidence page

When `evidence-report.md` exists, run:

```bash
node scripts/codex-plugin-runner.mjs acceptance-gate evidence-page --root . --slug <slug>
```

This writes `_acceptance/<slug>/evidence-page.html`. Open it with the available
Codex browser or provide the absolute path. Present judgment, variance,
provisional decisions, review findings, and visual evidence before machine-pass
details.

## 6. Preserve ownership

- Gate 1 approval is recorded only in `approved_by` and `approved_at`.
- Gate 2 resolution is recorded only in `human_override`, `human_signoff`, and
  approved verdict changes.
- Never click, infer, or write a human decision without the user's explicit
  instruction.
