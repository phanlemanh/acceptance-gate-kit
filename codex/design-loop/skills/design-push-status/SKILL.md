---
name: design-push-status
description: Record the optional post-signoff design-of-record sync status for a Codex Design Loop feature. Use at ship time when Claude Design cloud sync is skipped or handled externally.
---

# Design Push Status for Codex

Codex cannot call the first-party Claude Design bridge. This skill never pushes
files and never invokes `/design-sync` or `DesignSync`.

1. Require Gate 2 signoff before recording ship-time status.
2. Verify the finalized design repository or portable reference SHA.
3. Record one honest outcome in the handoff:
   - `skipped — Claude Design bridge unavailable in Codex`; or
   - `handled outside Codex — <human-provided reference>`.
4. State that this optional cloud sync does not block the application PR; the
   committed reference and provenance remain the shipped design record.

If the user needs Claude cloud sync, hand it off as an external human-run step.
