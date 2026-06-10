---
description: Show acceptance gate status for all features in this repo
---

Scan `_acceptance/*/contract.md` in the current repository and print a status
table. For each feature directory (skip `config.yaml` and `README.md`):

1. Parse contract frontmatter: `slug`, `risk_tier`, `status`.
2. If `evidence-report.md` exists, parse: `verdict`, `human_signoff`.
3. Print:

| Slug | Tier | Contract status | Verdict | Signoff |
|---|---|---|---|---|
| login-flow | T2 | verified | PASS | — |

4. Below the table, flag actionable items:
   - status `draft` → "Gate 1 pending: review contract + evals"
   - status `approved`, no evidence report → "Awaiting implementation"
   - verdict PASS + empty signoff → "Gate 2 pending: review evidence report"
   - verdict PENDING-JUDGMENT → "Gate 2 pending: resolve judgment items (fill human_override, upgrade to PASS)"
   - verdict REJECT → "Implementation fixes needed: see failed_evals"
   - verdict BLOCKED → "Environment issue: see reason"
5. If `_acceptance/` does not exist → suggest `/acceptance-init`.
