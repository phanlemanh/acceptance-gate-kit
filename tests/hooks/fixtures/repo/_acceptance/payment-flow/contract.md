---
schema_version: 1
feature: Payment checkout
slug: payment-flow
risk_tier: T3
surfaces: [api, ui]
status: approved
approved_by: Manh Phan
approved_at: 2026-06-10
time_human_minutes: {gate1: 10, gate2: 0}
---

# Acceptance Contract: payment-flow

## Criteria
- AC-1: Given a valid card token, When POST /pay, Then 200 + receipt id. (judgment)
