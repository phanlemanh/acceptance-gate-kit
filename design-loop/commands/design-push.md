---
description: (Optional, ship-time) push finalized design-system deltas back to Claude Design to close the design-of-record loop — human-run, never automatic
---

Argument: `<slug>`. OPTIONAL. Run at ship time AFTER Gate 2. Never invoked
automatically by feature-loop's headless S5 — `/design-sync` is an interactive
agent-tool needing a subscription and planId approval.

1. Confirm the finalized design-of-record surfaces for `<slug>` are committed in the design repo.
2. `/design-sync` **push** (H1, user-run): builds a planId of the files to write to the Claude Design project; you approve; it uploads. Keeps the cloud GUI in sync with the shipped look.
3. Log the pushed surface SHA in the design repo's sync log so "which mockup did we ship" stays answerable.

**Honest CANNOT:** requires a Claude subscription + interactive planId approval; the plugin cannot make this headless/CI. If the bridge is unavailable, skip with a clear note — the app PR already shipped; this only closes the design-of-record loop.
