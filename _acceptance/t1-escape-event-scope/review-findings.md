# Review Findings: t1-escape-event-scope (round 11)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

## Findings (round 11)

1. **[LOW] Packaged GUIDE links to docs/adr/0006 which is not shipped in the
   plugin package**
   - File: `plugins/acceptance-gate/GUIDE.md:656`
   - Detail: the diff adds `Lý do và trade-off: [ADR 0006](docs/adr/0006-rules-ledger-fail-closed-at-output.md)`
     to `GUIDE.md`, which is rsynced into the shipped package
     `plugins/acceptance-gate/`. The package contains no `docs/` directory
     (verified: `plugins/acceptance-gate/docs` does not exist), so for a
     consumer who only installed the plugin the relative link resolves
     nowhere. This follows a pre-existing pattern (the ADR 0005 link at
     line 587 predates this diff), so it is a continued rather than new
     convention gap; fix would be either linking the GitHub URL or syncing
     `docs/adr` into the package.
   - Source: conventions.
   - Everything else checked out this round: mirror sync
     (`scripts/sync-plugin-packages.sh --check`) green, both test suites
     pass (497/0 and all plugin tests), all four `plugin.json` manifests at
     1.22.1, and every new negative assertion in `tests/scripts/run-tests.sh`
     and `tests/plugins/run-tests.sh` (RL1-RL15, TE18h-k, P47-P50) has both
     a positive control and a pinned expected message per the CLAUDE.md
     invariant.

Both findings open at round 9 remain fixed (verified fixed at round 10,
re-confirmed present on this round's pin
`c09533b66ebffd2d4d6a5c40b53136329e69e6a7`): declared-but-unmatched `--slug`
and declared-but-unresolvable `--base` on a non-git root both still exit 2
with `VIOLATION [scope]` on stdout (RL14a-e, RL15a-d cases in
`tests/scripts/run-tests.sh`, all green this round).

---

## Chưa adversarial-verify (refuter chết)

Không có finding nào trong round này chưa được adversarial-verify.
