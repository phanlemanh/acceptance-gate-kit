---
description: Aggregate acceptance metrics across all features — human minutes vs baseline (KPI ≥50% reduction), verdict mix, gate hygiene (skips, bypasses, stale evidence). Read-only.
disable-model-invocation: true
---

Answer "is the gate paying for itself?" from what the gates already recorded.
The kit's stated KPI is ≥50% human-time reduction vs baseline; the fields exist
(`time_human_minutes` per contract, `baseline_minutes` in config) — this
command reads them. It is read-only: modify nothing while reporting.

Optional arg `--since YYYY-MM-DD`: include only features whose `approved_at`
or `verified_at` is on/after that date.

Steps:

1. **Scan** `_acceptance/*/` (skip `config.yaml`, `README.md`). Parse:
   - `contract.md` frontmatter: `slug`, `risk_tier`, `status`, `approved_by`,
     `approved_at`, `gate1_skipped`, `time_human_minutes` {gate1, gate2};
   - `evidence-report.md` frontmatter when present: `verdict`,
     `human_signoff`, `verified_at`, `verified_commit`, `enforcement_mode`,
     `bypass_used`, `bypass_ack`, `failed_evals`;
   - `run-log.jsonl` when present: line count (machine-run volume) and, when
     cheap, the report's Iterations section for verify rounds;
   - `evidence-report.md` body when present: every `network_observed:` value —
     first token after the colon, quotes stripped; values starting `n-a` all
     count into the `n-a` bucket (covers `n-a (driver)` and `n-a (tool-error:
     …)`);
   - `_acceptance/config.yaml`: `baseline_minutes`.
2. **Per feature compute:** total human minutes (gate1+gate2; absent/0 →
   "chưa ghi"), verify rounds, and flags:
   - `gate1_skipped` (audited Gate-1 escape),
   - un-acked bypass (`bypass_used: true` without `bypass_ack`),
   - `enforcement_mode` ≠ strict,
   - evidence age: when `verified_commit` is a real SHA, count later non-gate
     commits — `git rev-list --count <sha>..HEAD -- . ':!_acceptance'` — and
     flag "N commits after evidence" when N > 0 (cheap staleness signal; the
     authoritative check stays in `pre-merge-check.sh`).
3. **Print:**
   - Table: `| Slug | Tier | Status | Verdict | G1 min | G2 min | Rounds | Flags |`
   - Headline: signed-off count; median + mean total minutes over features
     with recorded minutes; baseline median from `baseline_minutes` (empty →
     "baseline chưa ghi — điền `_acceptance/config.yaml::baseline_minutes`");
     % reduction vs the ≥50% target → ĐẠT / CHƯA ĐẠT / KHÔNG ĐO ĐƯỢC (state
     which inputs are missing).
   - Hygiene counts: gate1_skipped · un-acked bypasses · non-strict reports ·
     stale-evidence features · features with minutes chưa ghi.
   - Network truth (advisory rail): `clean N · app-fail N · no-app-traffic N ·
     third-party-only N · n-a N · unscoped N · unscoped-partial N — K features
     with data`. One action line per feature carrying `app-fail` (an in-scope
     failure was recorded) or `no-app-traffic` on a `(cross-layer)` criterion
     (dead-button signal). When K ≥ 5, add: "đủ mẫu vận hành — cân nhắc
     máy-kiểm hóa network (schema v3, spec wave 2 §5)".
   - Action items: one actionable line per hygiene hit (e.g. "2 contracts
     thiếu `time_human_minutes` — điền lúc duyệt/ký; số liệu KPI đang mù").
4. `_acceptance/` missing → suggest `/acceptance-init`. No features → say so.

Read-only guarantee: this command never edits contracts, reports, or config —
it only reads and prints.
