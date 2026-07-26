# Contract Template

Copy everything below the `---8<---` line into `_acceptance/{slug}/contract.md`,
replace `{{placeholders}}`. Keep criterion IDs stable (AC-1, AC-2, …) — evals
reference them.

Frontmatter rules:
- `risk_tier:` keeps its own line as shown; the enforcement hook reads it
  (quotes or a trailing # comment are tolerated, nothing else on the line)
- `owner:` = `git config user.email` of whoever created the workspace — the
  slug-collision guard compares `feature:`/`owner:` on resume so one slug is
  never silently reused for a different feature
- `risk_tier`: T1 (skip kit entirely — do not create this file), T2 (standard),
  T3 (critical: auth/data/breaking-API; judgment items REQUIRE direct human verdict)
- `status` lifecycle: draft → approved (Gate 1) → implemented → verified → signed-off (Gate 2).
  Transition ownership: the acceptance skill sets draft/approved/verified/signed-off;
  the IMPLEMENTING agent sets `implemented` as its final act after coding
- `time_human_minutes`: fill gate1 when approving, gate2 when signing off (pilot metric)
- `gate1_skipped: true` may be added by the skill when the user insists on
  skipping Gate 1 (audit trail; discouraged)
- `gap_probe_expected: true` is **NOT part of this template** — do not add it
  here. It marks a contract produced by a flow that actually RUNS the
  clean-context critique, and only feature-loop's S1 does (step S1#7). This
  template also feeds the standalone `/acceptance` flow, which has no gap-probe
  step; emitting the marker there would hard-block every T3 Gate-1 approve with
  an instruction to run a step that flow does not have. Standalone contracts
  stay in the NOTE-only lane, exactly as README and QUICKSTART promise.
- `surfaces` may include `mobile`: app flows driven by the repo's native E2E
  runner (XCUITest / Espresso / Maestro / Detox…). The runner's exit code is
  UI-LAYER evidence only — a `(cross-layer)` criterion on mobile REQUIRES its
  paired `layer: backend-effect` eval (pre-merge BLOCKS the merge otherwise, once the feature is gated),
  and the contract's ## Notes carries a `Mobile backend target:
  local|staging|mock` line (lint W5 checks presence; the human eyeballs the value)

---8<---
---
schema_version: 1
feature: {{one-line feature name}}
slug: {{kebab-case-slug}}
owner: {{git config user.email}}
risk_tier: {{T2|T3}}
surfaces: [{{api|cli|sdk|ui|mobile, comma-separated}}]
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
Tag criteria that require business judgment with (judgment).
Tag criteria whose When/Then crosses the backend — a UI flow triggering an API
call / data mutation — with (cross-layer): Phase 2 pairing rule (c), lint W4
and the gap-probe cross-check all key off this tag.}}

- AC-1: Given {{precondition}}, When {{action}}, Then {{observable outcome}}.
- AC-2: Given {{precondition}}, When {{action}}, Then {{observable outcome}}. (judgment)
- AC-3: Given {{precondition}}, When {{user submits the form}}, Then {{the record exists via API}}. (cross-layer)

## Coverage

{{Bằng chứng độ phủ của bộ AC — trả lời "vì sao đủ", không phải khẳng định suông.
Quét bằng skill morphological-scan (feature-loop T2/T3: bước mặc định CT-S): liệt kê
trục + thước CE mỗi trục (giữ nhãn [CE chưa kiểm chứng] nếu chưa có nguồn đối chiếu).
Bỏ quét: 1 dòng lý do — repo dùng feature-loop thì trỏ entry `descope` trong
decisions.jsonl. Thiếu/trống section này = cờ vàng trên card Gate 1.}}

- Trục: {{Trục A: v1 | v2 | v3 [thước CE: nguồn đối chiếu]}}
- {{... | "Bỏ coverage-scan — <lý do 1 dòng> (entry d-...)"}}

## Out of scope

{{Bullet list of things a reviewer might expect but this feature deliberately
does NOT do. Empty section = red flag at Gate 1.}}

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl` (xem skill feature-loop — repo chưa dùng feature-loop thì bỏ qua).

## Notes

{{Optional: constraints, links to ADRs, data dependencies.}}
