# Local patches vs upstream

Upstream: https://github.com/cathrynlavery/diagram-design @ `da45d4a` (v2.1.0, installed 2026-08-12).
Patched locally 2026-08-13 after a skill-creator review. **If you update this skill from upstream, diff against this list and re-apply anything upstream hasn't absorbed.**

## Bug fixes

1. **First-run gate was dead on arrival** (`SKILL.md` §0). It detected "already customized" by comparing `accent` to `#b5523a` — a hex from an older skin that no shipped file contains, so every fresh install skipped the gate silently. Replaced hex-sniffing with an explicit `skin:` marker on the first line of `references/style-guide.md` (`default` → gate asks once; `custom` / `default-confirmed` → gate stays quiet). Onboarding Step 5 now flips the marker.
2. **4px-grid rule contradicted the type ramp** (`SKILL.md` §7, §9). "Every font size divisible by 4, non-negotiable" clashed with the ramp's own 7px eyebrow / 9px sublabel (used in the skill's own snippets). Added an explicit SVG micro-type exemption, mirrored in the §9 checklist.
3. **Stale skin residue** (three spots): removed the style-guide note claiming `assets/` were built under an earlier skin (they already use the current palette — verified by grep); fixed the dark-mode inversion rule from old-skin `rgba(28,25,23,…)` to current `rgba(45,49,66,…)`; updated the onboarding diff example and `#f7591f` mention to current default hexes.
4. **Harness leftovers** (`references/onboarding.md`): replaced the nonexistent `agent-browser` CLI with WebFetch / Browser pane; listed Claude Code skill paths before Pi paths.

### 4b. Title serif had no Vietnamese glyphs (found by A/B testing, not by reading)

Instrument Serif ships only `latin` / `latin-ext` on Google Fonts, so Vietnamese titles lost their diacritics or fell back per-glyph. Verified against a positive control (Roboto → has `vietnamese`, Geist → has it, Instrument Serif → does not), after two independent test runs hit it and patched around it on their own.

Fix applied as a **class sweep, not a one-file patch**: a covering serif was inserted behind Instrument Serif in all serif stacks and in the Google Fonts `<link>` of every file (SKILL.md, references, templates, and every `assets/example-*.html` — type references point at the examples, so they are a real copy path too). 21 of those links were HTML-escaped (`&amp;`); those were repaired separately so no raw `&` was left inside an escaped href. The reasoning lives in `references/style-guide.md` § Font stack so a future cleanup does not strip it as redundant.

### 4c. The covering serif was the wrong one — Playfair → Lora (2026-08-15)

Patch 4b chose **Playfair Display** because it advertises the `vietnamese` subset, and that check passed. It was still wrong. Playfair positions the grave over a circumflex far too high: `ầ ề ồ` render with the mark detached, floating into the line above, and at title size with the house `line-height: 1.15` it leaves the line box altogether — so **"Bầu trời" reads as "Bâu trời" and "Đề nghị" as "Đê nghị"**, a silent change of meaning rather than a cosmetic flaw. Raising `line-height` to 1.35 or 1.5 does not fix it; the mark is mispositioned, not clipped.

Found by a build agent whose Vietnamese title came out wrong, then reproduced independently: NFC and NFD forms fail identically, `document.fonts.check` confirms Playfair really is loaded, and Lora in the same stack renders the same string correctly. An earlier headless pass appeared to show *every* serif failing, which pointed at the environment — that was the same clipping hiding the mark above the viewport, not a missing glyph.

Swept `'Playfair Display'` → `'Lora'` in 173 CSS stacks and `Playfair+Display:ital,wght@0,400;1,400` → `Lora:ital,wght@0,400;1,400` in 147 font links across 149 files. Lora carries `vietnamese` in roman and italic. English titles are unaffected — Instrument Serif still leads the stack and covers Latin; the fallback only supplies accented glyphs, which were previously broken.

**Test to keep:** when swapping the serif for a brand face, render `ầ ề ồ` at title size. Horn-plus-grave (`ờ`) and dot-below (`ị ộ`) can be perfect while circumflex-plus-grave is broken, so ordinary accented sample text passes a font that fails here.

## Simplification (no quality change intended)

5. **De-duplicated SKILL.md §5 against style-guide.md.** The semantic-roles, node-treatment, and typography tables lived in both files and had already drifted once. SKILL.md now keeps only the two behavioral rules (focal rule, mono-for-technical) plus a pointer; the tables live solely in `references/style-guide.md`.
6. **Tokenized SKILL.md §6 snippets.** Inline default hexes (`#eb6c36`, `#4f5d75`, `#f5f5f5`, …) became `{token}` placeholders resolved from style-guide at draw time, so onboarded brands no longer leak default colors via copy-paste. Type references intentionally keep their hexes; the substitution rule at the top of style-guide.md covers them.
7. **First-run gate reworked from a 5-option menu to one recommendation + one-touch confirm** (scan repo/skill/URL for a brand source first, then ask once). Same protection, fewer decisions pushed to the human.
8. **Frontmatter description rewritten**: dropped the internals sentence (skin/gate/primitives — no trigger value), added Vietnamese trigger phrases (vẽ sơ đồ, sơ đồ kiến trúc, …) and an explicit boundary against dataviz/chart skills for data-bound charts.

## Local additions (not upstream)

9. **Three new diagram types added 2026-08-15** after a morphological scan of tech-product-development diagram needs found the customer-experience column uncovered (data architecture / data flow were already dense; journeys were the gap):
   - **Journey map** (`type-journey.md` + `example-journey{,-dark,-full}.html`) — stage columns × DOING / FEELING (emotion curve, coral pain point) / OPPORTUNITY bands.
   - **Service blueprint** (`type-service-blueprint.md` + `example-service-blueprint{,-dark,-full}.html`) — 4 fixed bands with the three named boundary lines (interaction / visibility / internal interaction).
   - **Wireflow** (`type-wireflow.md` + `example-wireflow{,-dark,-full}.html`) — screen-frame nodes with skeleton content, action-labeled orthogonal edges.
   Registered in SKILL.md frontmatter, §3 selection table (27 → 30 types), and §7 complexity budget. If updating from upstream, re-apply these files and table rows.

10. **Four more types added 2026-08-15** (phase Later of the same scan):
   - **Sankey** (`type-sankey.md` + `example-sankey{,-dark,-full}.html`) — static editorial flow-quantity; widths to scale, 1 coral leak ribbon.
   - **RACI matrix** (`type-raci.md` + `example-raci{,-dark,-full}.html`) — generalizes the dp-security-matrix grid grammar to responsibility chips; one-A-per-row rule.
   - **Capability map** (`type-capability-map.md` + `example-capability-map{,-dark,-full}.html`) — L1 domain containers → L2 capability boxes, invest/maintain/sunset treatment, no arrows.
   - **Stakeholder map** (`type-stakeholder-map.md` + `example-stakeholder-map{,-dark,-full}.html`) — orbit/onion, 3 rings core/direct/indirect + internal/external sectors; power-interest prioritization stays with quadrant.
   Registered in SKILL.md frontmatter, §3 selection table (30 → 34 types), and §7 complexity budget. Deliberately not built: C4 split-level, event storming, value stream map, Wardley (only when a real need shows up).

11. **Frontmatter compressed to fit the 1024-char limit** (skill-creator audit 2026-08-15, version bumped 2.1 → 2.2). Appending 7 type names had pushed the frontmatter to 1136 chars — over the 1024 hard limit in the skill spec, risking truncation or rejection by stricter loaders. Rewrote the description to a compact type list (dropped "/ spider", "/ flywheel", "chart" suffixes, "high-level", merged "DP integration / security matrix", trimmed the import-dials parenthetical and "vẽ diagram") — now 975 chars with margin, all 34 types still named, Vietnamese triggers intact.

12. **Three tech-architect types added 2026-08-15** (second morphological scan, focused on the tech-architect workflow — design docs / ADRs / plans; version bumped 2.2 → 2.3, 34 → 37 types):
   - **System context** (`type-system-context.md` + `example-system-context{,-dark,-full}.html`) — C4 L1: one focal system, persons, external systems, every relationship labeled. Routing rule: showing internals → switch to architecture.
   - **Deployment** (`type-deployment.md` + `example-deployment{,-dark,-full}.html`) — containers placed on region → cluster → node, replica badges, one environment per diagram.
   - **Event flow** (`type-event-flow.md` + `example-event-flow{,-dark,-full}.html`) — producers → topics/queues (doubled-edge channel treatment) → consumers, past-tense event names, dashed DLQ path. Routing rule: needs sequence numbers → back to sequence type.
   Registered in frontmatter, §3 selection table, §7 complexity budget. Deliberately not built (scan Later/Never): threat-model DFD (until security-review is routine), migration current→target (it-state + architecture pair serves), dependency DAG (tree/flowchart serve), UML class, network topology, CI/CD pipeline (process/swimlane grammar).

13. **Three workflow / discovery types added 2026-08-15** (third morphological scan, run against the Acceptance Gate Kit's Workflow v2 lifecycle with weight on the Brainstorm phase; version 2.3 → 2.4, 37 → 40 types). The scan found the delivery phase already saturated by entry 12; the remaining gaps clustered at the front of the discovery loop:
   - **Morphological box** (`type-morph-box.md` + `example-morph-box{,-dark,-full}.html`) — axes × values grid, the chosen combination threaded through in accent, cut cells dimmed with a one-word reason, per-cell source tag (`REPO` / `NGÀNH` / `G.ĐỊNH`). Gives the kit's own signature method a visual form.
   - **Disposition map** (`type-disposition.md` + `example-disposition{,-dark,-full}.html`) — one row per existing artifact of a class: relationship (thay / kế thừa / **song song** dashed) → new artifact → fate chip (khai tử + measure · giữ + deadline) → evidence tier badge N1/N2/N3. A row with no fate is the defect the map exposes.
   - **Threshold chart** (`type-threshold.md` + `example-threshold{,-dark,-full}.html`) — bullet-family rows, measured bar against a threshold tick that carries its declaration date and gate, verdict chip đạt/trượt. Makes a moved goalpost visible.
   Description compressed again to stay under the 1024 limit while adding three names (dropped "/ data model", "customer", "pyramid /", "diagrams.net", "and detail level"; added Vietnamese triggers `không gian lựa chọn`, `so ngưỡng`) — 978 chars.
   Phase 2 of the same scan followed in entry 14. Never: Gantt/burndown for the workflow (it runs on cadence, not schedule), org chart for the four gates (gates are roles-on-artifact), a separate state × material matrix (RACI already documents itself as the generic role × item grid).

14. **Three Phase-2 types added 2026-08-15** (same scan, the quality-upgrade tier where a stand-in already existed; version 2.4 → 2.5, 40 → 43 types):
   - **Solution tree** (`type-solution-tree.md` + `example-solution-tree{,-dark,-full}.html`) — outcome with a number → opportunities in the user's words carrying evidence badges → competing solutions → cheapest-first tests; exactly one opportunity expanded and marked "đang tấn công", the rest collapsed to muted stubs. Specialises `type-tree.md`, which stays the plain hierarchy. Lineage: Teresa Torres.
   - **Cadence** (`type-cadence.md` + `example-cadence{,-dark,-full}.html`) — the same four beats KHAI · LÀM · ĐO · QUYẾT repeated verbatim across 4 time scales, one return arc per band, roll-up arrows from an inner cycle's QUYẾT into the next scale's ĐO, `CỔNG NGƯỜI` tags where the decision is signed by a person. Combines loop + layers; neither alone shows a cycle repeating at several horizons.
   - **Evidence chain** (`type-evidence-chain.md` + `example-evidence-chain{,-dark,-full}.html`) — chain of custody for a proof: artifacts with identity lines, actor badges, one named dashed independence boundary (doer above / checker below), and the self-attested link marked `TỰ KHAI`. Distinct from `type-data-flow.md`, which moves data rather than custody of proof.
   Description compressed again to 984 chars (dropped "Standalone files only", "as", "detail").
   **Double Diamond deliberately not built**, and this is a doctrine call rather than a backlog cut: the workflow it would illustrate runs on three loops (HIỂU / LÀM / TRAO) with four gates, not two diamonds. Shipping the template would invite teams to redraw their process in a shape it does not have. `type-funnel.md` covers a plain diverge-converge figure if one is ever needed.

## 7. Skin state moved OUT of the skill, into the repo (2026-08-16)

**Why:** the skill is now distributed as a Claude Code plugin (marketplace
`acceptance-gate-kit`, plugin `diagram-design`) — one install per machine,
shared by every repo and every teammate. A `skin:` marker inside
`references/style-guide.md` is therefore wrong for everyone except the person
who last flipped it, gets overwritten on plugin update, and never reaches a
teammate's machine. The shipped marker had also drifted to `default-confirmed`
(personal state committed into the package) — which would have silenced §0
for every new user.

**What changed:** SKILL.md §0 reads `<repo>/docs/reference/diagram-skin.md`
(`<repo>` = git toplevel from cwd, else cwd; one path, no search); absent →
find brand source → ask once → write that file (`custom` or
`default-confirmed`). Never read/write skin state inside the skill.
`style-guide.md` marker reset to `default` and now carries the CLOSED schema
`DIAGRAM-SKIN-TEMPLATE` (marker + 8 roles light/dark + 2 font stacks — nothing
else, so repos keep receiving upstream fixes for everything else).
`onboarding.md` steps 4–5 write the repo file, not `style-guide.md`.

**Upstream status:** not upstreamed; upstream keeps skin inside the skill.
Re-apply on update.

## 8. Label-occlusion checker added (2026-08-27)

**Why:** §6 forbids a hidden label, but the rule lived only as checklist prose
— nothing could go red. Three shipped figures in the kit's own
`docs/reference/figures/` carried labels partially covered by node boxes drawn
after them (`GHI STATUS` 4px, `HÌNH ĐÍNH THẺ` 28px, `S5 GIAO` 3.8px), found
2026-08-27 by comparing against archify's executable validator. A covered
label survives review because the remaining letters still read as a word.

**What changed:** new `scripts/check_label_occlusion.py` (static, stdlib-only,
no browser) pairs each small mask rect with its following `<text>` and reports
any later opaque rect overlapping the mask; `--list` prints every label it can
see (used as a detection floor by the kit's CI case
`tests/scripts/label-occlusion.test.mjs`). One checklist line added to §9
Technical, using the `<skill-dir>` form so the command is runnable from a
consuming repo.

**Scope, narrowed deliberately (kit gate round 2, owner decision):** it
recognises exactly ONE occluder shape — an opaque `<rect>` at least 60x28.
Rects in the 18-28 dead band, narrow rects, filled paths/circles/polygons,
and masks wider than 220 all pass silently. Matching every way SVG can paint
a solid area is an open-ended list; two rounds of widening it produced the
same class of hole each time, so the floor stays narrow and the blind spots
are written out in full under "WHAT THIS CANNOT SEE" rather than papered
over. Transparency detection covers the KNOWN forms — `none`, `transparent`,
`fill-opacity`, `opacity`, alpha inside the colour (`rgba()`, `#RRGGBBAA`) —
and no stronger claim than that: an earlier revision called this list "closed
and complete" and round 3 promptly disproved it (three-component `rgb()` was
misparsed so solid black read as transparent; fixed by requiring four
components, with a red case outside the list). The alpha-in-colour forms
matter because the house skin paints tint plates as `rgba(45,49,66,0.06)`,
and reading those as opaque would accuse labels they do not hide. Unreadable
named inputs now exit 2 instead of dissolving into a green run. Provenance: `_acceptance/thuoc-nhan-de-khoi/` in the
kit repo.

**Upstream status:** not upstreamed. Re-apply on update.

**Direction flip (kit gate round 4, owner decision):** the default for
anything the parser does not understand is now NEVER "opaque". Unknown fill
syntax (hsla(), space-notation rgb(), url(#…), var(), named colors) and
unit-suffixed coordinates make the element invisible with one WARN per file;
a readable file with nothing scannable (empty, truncated, no <svg>) exits 2.
Rationale: four consecutive gate rounds each found a new corner of SVG where
guessing "opaque" produced a false OCCLUDED, and in a merge-blocking gate a
false accusation teaches people to loosen the gate. Uncertainty now always
falls toward a declared miss. The house `width="100%"` background stays a
silent skip (every figure carries one). A self-closing `<text/>` no longer
borrows the next text's content.
