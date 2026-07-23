---
name: acceptance-report
description: Aggregate Acceptance Gate metrics across all features on Codex — human minutes vs baseline (KPI ≥50% reduction), verdict mix, gate hygiene (skips, bypasses, stale evidence). Read-only. Use when the user asks whether the gate pays off, báo cáo hiệu quả gate, or wants acceptance metrics.
---

# Acceptance Report for Codex

Answer "is the gate paying for itself?" from what the gates already recorded.
The kit's stated KPI is ≥50% human-time reduction vs baseline; the fields
exist (`time_human_minutes` per contract, `baseline_minutes` in config) —
this skill reads them. Read-only: modify nothing while reporting.

Optional arg `--since YYYY-MM-DD`: include only features whose `approved_at`
or `verified_at` is on/after that date.

## 1. Scan

Scan `_acceptance/*/` (skip `config.yaml`, `README.md`). Parse:

- `contract.md` frontmatter: `slug`, `risk_tier`, `status`, `approved_by`,
  `approved_at`, `gate1_skipped`, `time_human_minutes` {gate1, gate2};
- `evidence-report.md` frontmatter when present: `verdict`, `human_signoff`,
  `verified_at`, `verified_commit`, `enforcement_mode`, `bypass_used`,
  `bypass_ack`, `failed_evals`;
- `run-log.jsonl` when present: line count, plus the report's Iterations
  section for verify rounds when cheap;
- `_acceptance/config.yaml`: `baseline_minutes`.

## 2. Compute per feature

Total human minutes (gate1+gate2; absent/0 → "chưa ghi"), verify rounds, and
flags:

- `gate1_skipped` (audited Gate-1 escape);
- un-acked bypass (`bypass_used: true` without `bypass_ack`);
- `enforcement_mode` ≠ strict;
- evidence age: when `verified_commit` is a real SHA, count later non-gate
  commits — `git rev-list --count <sha>..HEAD -- . ':!_acceptance'` — and flag
  "N commits after evidence" when N > 0 (cheap staleness signal; the
  authoritative check stays in `pre-merge-check.sh`).

## 3. Print

- Table: `| Slug | Tier | Status | Verdict | G1 min | G2 min | Rounds | Flags |`
- Headline: signed-off count; median + mean total minutes over features with
  recorded minutes; baseline median from `baseline_minutes` (empty →
  "baseline chưa ghi — điền `_acceptance/config.yaml::baseline_minutes`");
  % reduction vs the ≥50% target → ĐẠT / CHƯA ĐẠT / KHÔNG ĐO ĐƯỢC (state
  which inputs are missing).
- Hygiene counts: gate1_skipped · un-acked bypasses · non-strict reports ·
  stale-evidence features · features with minutes chưa ghi.
- Action items: one actionable line per hygiene hit.

`_acceptance/` missing → suggest the `acceptance-init` skill. No features →
say so.

## 4. Read-only guarantee

Never edit contracts, reports, or config from this skill — read and print
only.
