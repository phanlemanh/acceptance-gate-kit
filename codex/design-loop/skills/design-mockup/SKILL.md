---
name: design-mockup
description: Create the portable design reference and provenance required for a D2 web-UI feature in Feature Loop Codex. Use after brainstorming and before Gate 1.
---

# Design Mockup for Codex

Create a portable reference; never call Claude Design or `DesignSync`.

1. Read `_acceptance/<slug>/contract.md`, the design doc, and the full state
   matrix. Missing surfaces or state matrix is `BLOCKED` and routes back to S1.
2. Choose one approved source: a design repository, checked-in HTML/CSS,
   generated reference HTML/CSS, or saved screenshots.
3. Drift-check source surfaces and states against the state matrix. Missing,
   extra, or stale states must be resolved before Gate 1.
4. Save inspectable reference files under
   `_acceptance/<slug>/evidence/design/reference/`. Use an available Codex
   browser, Playwright, Computer Use, or the repository capture command.
5. Record provenance:

```bash
node scripts/codex-plugin-runner.mjs design-loop provenance write \
  --slug <slug> --design-repo <path> --commit <sha-or-version>
```

Use a real git SHA for a git source. For a non-git source, use a content hash or
explicit version and say so in the Gate-1 package.

Open saved frames with an image-capable tool and verify each state is actually
visible. A command exit 0 without inspectable frames is not complete evidence.

Finish by presenting the reference, state matrix, seam, and `provenance.json`
through the existing Gate-1 `acceptance-card` skill.
