---
description: Show acceptance gate status for all features in this repo
disable-model-invocation: true
---

Scan `_acceptance/*/contract.md` in the current repository and print a status
table. For each feature directory (skip `config.yaml` and `README.md`):

1. Parse contract frontmatter: `slug`, `risk_tier`, `status`.
2. If `evidence-report.md` exists, parse: `verdict`, `human_signoff`.
3. **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu nào
   sẽ hiện cho người.
4. Print:

| Slug | Tier | Contract status | Verdict | Signoff |
|---|---|---|---|---|
| login-flow | T2 | verified | PASS | — |

5. Below the table, flag actionable items:
   - status `draft` → "Gate 1 pending: review contract + evals"
   - status `approved`, no evidence report → "Awaiting implementation"
   - status `implemented`, no evidence report → "Verification pending: run the acceptance skill (Phase 3)"
   - verdict PASS + empty signoff → "Gate 2 pending: review evidence report"
   - verdict PENDING-JUDGMENT → "Gate 2 pending: resolve judgment items (fill human_override, upgrade to PASS)"
   - verdict REJECT → "Implementation fixes needed: see failed_evals"
   - verdict BLOCKED → "Environment issue: see reason"
6. If `_acceptance/` does not exist → suggest `/acceptance-init`.
