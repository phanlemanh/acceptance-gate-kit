---
name: acceptance-status
description: Show the Acceptance Gate status and next action for every feature workspace in the current repository. Use when the user asks for gate progress, pending approvals, verification state, or signoff status.
---

# Acceptance Status for Codex

Scan `_acceptance/*/contract.md`. If `_acceptance/` is missing, direct the user
to the `acceptance-init` skill.

For each feature, parse contract frontmatter fields `slug`, `risk_tier`, and
`status`. When `evidence-report.md` exists, also parse `verdict`,
`human_signoff`, and `reason`.

Print:

| Slug | Tier | Contract status | Verdict | Signoff |
|---|---|---|---|---|
| login-flow | T2 | verified | PASS | — |

Then report actionable items:

- `draft`: Gate 1 pending; review contract and evals.
- `approved` without evidence: implementation or plan pending.
- `implemented` without evidence: verification pending; resume the Acceptance
  skill at Phase 3.
- `PASS` with empty signoff: Gate 2 pending.
- `PENDING-JUDGMENT`: Gate 2 must resolve judgment or variance items before a
  PASS upgrade.
- `REJECT`: implementation fixes required; list `failed_evals`.
- `BLOCKED`: environment or configuration issue; show the exact reason.
- `signed-off`: complete; still report stale evidence if the verified commit no
  longer matches product code.

Do not modify artifacts while reporting status.
