# Contract Template

Copy everything below the `---8<---` line into `_acceptance/{slug}/contract.md`,
replace `{{placeholders}}`. Keep criterion IDs stable (AC-1, AC-2, …) — evals
reference them.

Frontmatter rules:
- `risk_tier:` keeps its own line as shown; the enforcement hook reads it
  (quotes or a trailing # comment are tolerated, nothing else on the line)
- `risk_tier`: T1 (skip kit entirely — do not create this file), T2 (standard),
  T3 (critical: auth/data/breaking-API; judgment items REQUIRE direct human verdict)
- `status` lifecycle: draft → approved (Gate 1) → implemented → verified → signed-off (Gate 2).
  Transition ownership: the acceptance skill sets draft/approved/verified/signed-off;
  the IMPLEMENTING agent sets `implemented` as its final act after coding
- `time_human_minutes`: fill gate1 when approving, gate2 when signing off (pilot metric)
- `gate1_skipped: true` may be added by the skill when the user insists on
  skipping Gate 1 (audit trail; discouraged)

---8<---
---
schema_version: 1
feature: {{one-line feature name}}
slug: {{kebab-case-slug}}
risk_tier: {{T2|T3}}
surfaces: [{{api|cli|sdk|ui, comma-separated}}]
status: draft
approved_by:
approved_at:
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: {{slug}}

## Context

{{2-4 sentences: what this feature does, for whom, and why now. Link the source
input (ticket URL / PRD path / "prompt" if conversational).}}

Source input: {{ticket-url | prd-path | prompt}}

## Criteria

{{5-15 criteria. Each MUST be Given/When/Then and independently checkable.
Tag criteria that require business judgment with (judgment).}}

- AC-1: Given {{precondition}}, When {{action}}, Then {{observable outcome}}.
- AC-2: Given {{precondition}}, When {{action}}, Then {{observable outcome}}. (judgment)

## Out of scope

{{Bullet list of things a reviewer might expect but this feature deliberately
does NOT do. Empty section = red flag at Gate 1.}}

## Notes

{{Optional: constraints, links to ADRs, data dependencies.}}
