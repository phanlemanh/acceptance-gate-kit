---
schema_version: 1
feature: Login flow with SSO
slug: login-flow
risk_tier: T2
surfaces: [api, ui]
status: approved
approved_by: Manh Phan
approved_at: 2026-06-10
time_human_minutes: {gate1: 8, gate2: 0}
---

# Acceptance Contract: login-flow

## Criteria
- AC-1: Given a valid SSO token, When POST /auth/login, Then 200 + session cookie set.
