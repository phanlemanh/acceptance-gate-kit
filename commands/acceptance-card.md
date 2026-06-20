---
description: Render a plain-language DECISION CARD (Gate 1 criteria, or Gate 2 evidence) so a human decides the gate fast without reading raw markdown
---

Render the human decision card for a feature's gate. Goal of the kit: cut human
gate time without cutting quality — so the card puts the few things ONLY a human
decides FIRST, in plain product language, always with reversibility, and never as
a bare green check. It is a presentation layer: it reads artifacts the gate
already produced and DECIDES NOTHING; the deterministic hook + evidence remain the
source of truth.

Arg: a feature `<slug>` (the `_acceptance/<slug>/` directory). Repo root = cwd.

Steps:

1. **Find the script** in the installed acceptance-gate plugin (do NOT hardcode
   version): `ls "$HOME"/.claude/plugins/cache/*/acceptance-gate/*/scripts/gate-card.js
   "$HOME"/.codex/plugins/cache/*/acceptance-gate/*/scripts/gate-card.js 2>/dev/null`
   → take the newest. Not found → tell the user to install/update the plugin.

2. **Extract** the bits to translate (gate auto-detected: `evidence-report.md`
   present → Gate 2, else Gate 1):
   `node <gate-card.js> --root . --slug <slug> --extract`

3. **Translate** the extract into PLAIN PRODUCT LANGUAGE for this repo's persona
   (read CLAUDE.md for who the user is). Keep meaning, do not invent:
   - `feature_plain`: one plain sentence — what it does for the user.
   - Gate 1: `will_do[] → {id,p}` each starting "Sẽ …" (what the system DOES);
     `wont_do[] → {id,p}` starting "Sẽ KHÔNG …" or "Chặn …".
   - Gate 2: `decisions[] → {id,q}` a SHORT product question (≤14 words, ends "?",
     NO Given/When/Then, NO jargon like DOM/exit code); optional `{id,why}` plain;
     `analyst_plain` = plain restatement of the non-discriminating note.
   - `scope_plain`: one plain phrase for the deferred/cut scope.
   Write it to `_acceptance/<slug>/card-plain.json`.

4. **Render** + present:
   `node <gate-card.js> --root . --slug <slug> --plain _acceptance/<slug>/card-plain.json`
   Prepend `<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">`
   and save to `_acceptance/<slug>/card.html`; tell the user to open it (or show the
   fragment inline if a visual tool is available).

5. The card NEVER decides. The human's click flows into the REAL gate: Gate 1 →
   contract `approved_by`; Gate 2 → `human_signoff` / per-item `human_override`.
   The verdict, hook enforcement, and machine evidence are unchanged.
