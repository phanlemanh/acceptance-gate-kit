---
description: Export a diagram-design HTML file to .svg and .png next to the source
argument-hint: <html-file> [--svg-only|--png-only] [--scale=N] [--output=<path>]
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
---

Export the diagram HTML at `$1` to `.svg` and/or `.png`, following the procedure documented in `${CLAUDE_PLUGIN_ROOT}/skills/diagram-design/references/export.md` (when this command runs from the `diagram-design` plugin) — or `~/.claude/skills/diagram-design/references/export.md` when the skill is installed as a user skill. Treat that reference as the source of truth — don't reimplement the logic here.

Full argument string: `$ARGUMENTS`
