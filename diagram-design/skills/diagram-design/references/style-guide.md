<!-- skin: default -->

# Style Guide

**The single source of truth for colors, typography, and tokens.** Every diagram draws from this — not from hex values inlined in other reference files. If you want to change the visual skin of Schematic, change this file.

> **The `skin:` marker above must stay `default` in the shipped skill.** Skin decisions are per REPO, not per skill install: SKILL.md §0 reads `<repo>/docs/reference/diagram-skin.md` (written from the `DIAGRAM-SKIN-TEMPLATE` below) and that file's marker + tokens win over everything here. If this marker ever reads `custom` or `default-confirmed`, personal state leaked into a shared package — reset it.
>
> **Substitution rule:** snippets in SKILL.md use `{token}` placeholders; type references may still show default-skin hex values in their examples. Either way, resolve against the tables below at draw time — when a custom skin is active, the current values here win over any hex you see in a snippet.

Default skin is a cool editorial palette — white-smoke paper, jet-black ink, atomic-tangerine accent, blue-slate muted. It's designed to look good out of the box; swap these values (or run [`onboarding.md`](onboarding.md)) and every new diagram inherits the new skin without touching any type-specific logic.

To generate your own from a website URL, see [`onboarding.md`](onboarding.md).


## Repo skin file — the only place skin state lives

Onboarding writes this file at `<repo>/docs/reference/diagram-skin.md`. Schema is
CLOSED: the marker, the eight semantic roles (light + dark), and the two font
stacks — nothing else. Everything else (node treatments, type ramp, connector
rules, Google Fonts embed) stays in this skill and keeps receiving upstream
fixes; a repo file that copied them would freeze the repo on an old skill.

<!-- <<<DIAGRAM-SKIN-TEMPLATE -->
```markdown
<!-- skin: custom | default-confirmed -->
# Diagram skin — <repo or brand name>

Source: <URL / token file / "default kept on <date>">. Written by the diagram-design skill; edit tokens here, never in the skill.

| Role | Light | Dark |
|---|---|---|
| paper | #f5f5f5 | #2d3142 |
| paper-2 | #ececec | #393e53 |
| ink | #2d3142 | #f5f5f5 |
| muted | #4f5d75 | #bfc0c0 |
| soft | #636b80 | #a1aaba |
| rule | rgba(45,49,66,0.12) | rgba(245,245,245,0.12) |
| accent | #eb6c36 | #f08a59 |
| link | #2e5aa8 | #6a95d8 |

Fonts: sans = Geist · serif = Instrument Serif, Lora
```
<!-- DIAGRAM-SKIN-TEMPLATE>>> -->

Reading rule for the skill: a role missing from the repo file falls back to the
default here; a role present overrides. `accent-text` / `accent-tint` are
derived from `accent` by the same formula as the default skin.

---

## Tokens

### Semantic roles

Every token is referred to by **semantic role**, not by its hex value. Type references (`type-*.md`) and SKILL.md say `accent`, not `#eb6c36`.

| Role | Purpose | Default (light) | Default (dark) |
|---|---|---|---|
| `paper` | Page background, default node fill | `#f5f5f5` (white-smoke) | `#2d3142` (jet-black) |
| `paper-2` | Diagram container bg, secondary fill | `#ececec` | `#393e53` |
| `ink` | Primary text, primary stroke | `#2d3142` (jet-black) | `#f5f5f5` (white-smoke) |
| `muted` | Secondary text, default arrow stroke | `#4f5d75` (blue-slate) | `#bfc0c0` (silver) |
| `soft` | Sublabels, boundary labels | `#636b80` | `#a1aaba` |
| `rule` | Hairline borders | `rgba(45,49,66,0.12)` | `rgba(245,245,245,0.12)` |
| `rule-solid` | Stronger borders, baselines | `#bfc0c0` (silver) | `rgba(191,192,192,0.25)` |
| `accent` | Focal stroke / fill — 1–2 max per diagram | `#eb6c36` (atomic-tangerine) | `#f08a59` |
| `accent-text` | Accent used as **text** | `#ba4513` | `#f19162` |
| `accent-tint` | Fill for accent-bordered boxes | `rgba(235,108,54,0.08)` | `rgba(240,138,89,0.10)` |
| `link` | HTTP/API calls, external arrows | `#2e5aa8` | `#6a95d8` |

### Legibility floor — four rules, each with a measured reason

These exist because a real diagram failed each one. Micro-type is where the palette gets tested: the smallest labels were being given the weakest colours, which is backwards.

**1. Text colours are `ink`, `muted`, `soft`, `accent-text` — nothing else.** Measured against the worst background (`paper-2`), text at 4.5:1 or better:

| Text colour | on white | on `paper` | on `paper-2` |
|---|---|---|---|
| `ink` #2d3142 | 12.89 | 11.82 | 10.91 |
| `muted` #4f5d75 | 6.66 | 6.11 | 5.63 |
| `soft` #636b80 | 5.30 | 4.88 | 4.51 |
| `accent-text` #ba4513 | 5.30 | 4.88 | 4.50 |
| ~~old `soft` #7a8399~~ | 3.79 | 3.48 | **3.21** |
| `accent` #eb6c36 **as text** | 3.12 | **2.86** | **2.64** |

`accent` stays `#eb6c36` for strokes and fills — graphical objects only need 3:1, and the focal colour must not shift. When accent becomes a *letter*, it becomes `accent-text`. A 1px accent stroke sits at 2.86:1 on paper, so give focal boxes `stroke-width: 1.4` rather than 1.

**2. Never colour text with diluted ink.** `fill="rgba(45,49,66,0.40)"` composites to `#a5a7ad` — **2.21:1**, the worst value we found in the wild, and it reads as deliberate greying rather than a mistake. Opacity is for strokes and fills; text takes a solid token.

**3. `soft` is not for text below 9px on `paper-2`.** Group eyebrows and sublabels sitting on a container fill go to `muted`. `soft` is for text on `paper` or white, at 9px or above.

**4. Tag boxes and label masks size to Vietnamese, not to Latin caps.** `Ầ Ề Ồ` stack a circumflex under a grave and rise well above cap height; a 12px-tall tag holding 9px text clips the accent, which reads as a missing diacritic. **Minimum box height = font-size + 7px** (a 9px label needs 16px, not 12px). Grow the box upward and keep the baseline where it is, so the row rhythm survives.

> **Brand palette source:** this skin maps to a five-color brand palette — `jet-black #2d3142`, `silver #bfc0c0`, `white-smoke #f5f5f5`, `atomic-tangerine #eb6c36`, `blue-slate #4f5d75`. The `soft`, `rule`, and `link` tokens are derived (lighter slate, ink-at-opacity, and a saturated variant in the blue-slate hue family) to cover roles the brand palette doesn't name directly.

### Inversion rule (light → dark)

Any `rgba(45,49,66, X)` in light becomes `rgba(245,245,245, X)` in dark — i.e. ink-rgb and paper-rgb swap, same opacities. The accent gets a slight hue-shift brighter to read on dark paper. (If the skin has been customized, apply the same swap with the custom ink/paper RGB values.)

### Series palette (multi-series chart types only)

A small set of desaturated, editorial-tone colors for chart types that genuinely need to distinguish multiple overlapping entities (currently: **radar**). The "1-focal" rule still holds — `accent` is reserved for the focal series; the palette below covers the rest.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `series-1` | `#7c8f6f` (sage) | `#9caf8f` | Non-focal series |
| `series-2` | `#5e7a9b` (dusty-blue) | `#82a0c0` | Non-focal series |
| `series-3` | `#b8915a` (mustard) | `#d3ad7a` | Non-focal series |
| `series-4` | `#9c6b50` (rust-brown) | `#b88670` | Non-focal series |
| `series-5` | `#6e6479` (slate) | `#8d8298` | Non-focal series |

Fills sit at `0.18` opacity light, `0.22` dark; strokes use the full color. **Don't backfill these tokens to non-chart types** — architecture, swimlane, etc. continue to use muted-ink variants. The series palette is opt-in for diagrams where overlapping shapes demand distinguishable color, not a license to add color elsewhere.

### Terminal skin (opt-in alternate)

A self-contained palette for the terminal-window primitive (see [primitive-terminal.md](primitive-terminal.md)) — a CLI-chrome register for dev-tool posts and technical social cards. It does not replace the default skin above and isn't affected by onboarding; it's a second, fixed skin you opt into per-diagram.

| Token | Hex | Purpose |
|---|---|---|
| `terminal-page` | `#0a0a0a` | Page background behind the window |
| `terminal-paper` | `#141414` | Window body, node fill |
| `terminal-bar` | `#1b1b1b` | Titlebar strip |
| `terminal-border` | `#2b2b2b` | Window border, hairlines |
| `terminal-ink` | `#f5f5f5` | Primary text, primary stroke (same white-smoke as default `ink`) |
| `terminal-muted` | `#9a9a9a` | Secondary text, sublabels, ring stroke |
| `terminal-soft` | `#5c5c5c` | Tertiary — inactive dots, spokes |
| `terminal-accent` | `#ff5a36` | The one accent — focal station, prompt sign, active dot |
| `terminal-accent-tint` | `rgba(255,90,54,0.12)` | Fill for accent-bordered boxes |

**1-accent rule still holds.** Everything that isn't `terminal-ink` or `terminal-muted`/`terminal-soft` should be `terminal-accent` — never introduce a second hue.

---

## Typography

| Role | Family | Size | Weight | Usage |
|---|---|---|---|---|
| `title` | Instrument Serif → Lora | 1.75rem | 400 | Page H1 |
| `node-name` | Geist (sans) | 12px | 600 | Human-readable labels |
| `sublabel` | Geist Mono | 9–10px | 400 | Port, protocol, URL, field type |
| `eyebrow` | Geist Mono | 9px | 500, tracked 0.18em, uppercase | Type tags, axis labels |
| `arrow-label` | Geist Mono | 9px | 400, tracked 0.06em | Arrow annotations |
| `callout` | Instrument Serif *italic* → Lora *italic* | 14px | 400 | Editorial asides only |

**9px is the floor for new diagrams.** The ramp used to bottom out at 7px, which survives a designer zoomed to 200% and fails everyone reading the diagram at its natural size in a doc or a slide. A 7px eyebrow on a 1000-unit canvas displayed at ~1100px renders at roughly 7 device pixels — below that, Vietnamese diacritics stop resolving before the letters do, so the text degrades into a *different word* rather than into blur.

**All 45 example types now ship on this ramp** — copy them freely. Getting there took a per-diagram re-layout, not a sweep: a mechanical 8px → 9px replace was tried first and reverted after it overflowed 100+ tag boxes and masks (`morph-box` by 16.9px, `process` in 43 places), because those boxes were dimensioned around the old type. **Type size and box geometry are one decision.** When you raise a label, resize the thing holding it in the same edit, and check with `scripts/check_overflow.py`.

The one file left on the old ramp is `assets/example-import-drawio.html`, which demonstrates a draw.io import rather than a diagram type.

### Font stack

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Lora:ital,wght@0,400;1,400&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

**Load-bearing rule:** Mono is for *technical* content (ports, commands, URLs, field types). Names go in Geist sans. Page title is Instrument Serif. Italic Instrument Serif is reserved for annotation callouts (see [primitive-annotation.md](primitive-annotation.md)). **Never JetBrains Mono** as a blanket "dev" font.

**Why Lora sits behind Instrument Serif:** Instrument Serif ships only the `latin` and `latin-ext` subsets — it has **no Vietnamese glyphs**, so a title like "Quy trình duyệt đơn nghỉ phép" falls back per-glyph for every accented letter. Lora carries the `vietnamese` subset in both roman and italic, so the accented glyphs arrive from a real serif instead of a system fallback. Geist and Geist Mono both cover Vietnamese, so SVG body text needs no fallback. This is a *fallback inside the serif role*, not a fourth family — the three-family constraint below still holds.

**Do not put Playfair Display in this slot** (it was there until 2026-08-15). Playfair has the `vietnamese` subset and passes a naive "is the subset served?" check, but it positions the grave over a circumflex far too high: `ầ ề ồ` render with the grave detached and floating into the line above, and at title sizes with tight leading the mark leaves the line box entirely. The word then reads as a different word — *Bầu trời* renders as *Bâu trời*, *Đề nghị* as *Đê nghị*. Increasing `line-height` does not fix it; the mark is mispositioned, not clipped. **When swapping the serif for a brand face, test `ầ ề ồ` at title size specifically** — horn-plus-grave (`ờ`) and dot-below (`ị ộ`) can be perfect while circumflex-plus-grave is broken, so a spot check on ordinary accented text will pass a font that fails here.

When onboarding replaces `title` with a brand serif, check the same thing: if the brand face lacks the scripts your diagrams use, keep a covering fallback behind it rather than dropping down to a bare `serif`.

---

## Stroke, radius, spacing

| Token | Value | Use |
|---|---|---|
| `stroke-thin` | `0.8` | Tag-box outlines, leaf nodes |
| `stroke-default` | `1` | Most strokes |
| `stroke-strong` | `1.2` | Emphasis strokes |
| `radius-sm` | `4` | Small tags |
| `radius-md` | `6` | Node boxes |
| `radius-lg` | `8` | Containers, rings |
| `grid` | `4` | Every coord, size, and gap is divisible by 4 (hard rule) |

---

## Node type → treatment

Semantic role combinations — reference these by name in type specs.

| Type | Fill | Stroke |
|---|---|---|
| `focal` (1–2 max) | `accent-tint` | `accent` |
| `backend` | `#ffffff` (white) | `ink` |
| `store` | `ink @ 0.05` | `muted` |
| `external` | `ink @ 0.03` | `ink @ 0.30` |
| `input` | `muted @ 0.10` | `soft` |
| `optional` | `ink @ 0.02` | `ink @ 0.20` dashed `4,3` |
| `security` | `accent @ 0.05` | `accent @ 0.50` dashed `4,4` |

---

## Customizing the skin

Three options:

1. **Run onboarding** — see [`onboarding.md`](onboarding.md). Drop a URL; the skill extracts the palette + fonts and rewrites this file.
2. **Edit by hand** — change the hex values in the tables above. Run the pre-output taste gate afterward to verify the accent still reads as "focal" against the new paper color.
3. **Brand handoff** — paste your existing design-token JSON into a new section here and map its tokens to the semantic roles above.

### Constraints (don't break these)

- **Contrast**: `ink` must hit WCAG AA on `paper`. `muted` must hit AA on `paper` for 11px+ text.
- **One accent**: pick one color for `accent`. Two accents erases the focal signal.
- **No rainbow palette**: if your brand ships 8 colors, pick 3 (paper, ink, accent). The rest become `muted` variants.
- **Serif + sans + mono**: three families, not more. If brand typography is all sans, keep Instrument Serif for `title` and `callout` anyway — the contrast is load-bearing.
- **Paper is warm-neutral, not pure white**: pure white turns the design sterile. Pick a cream, bone, or light grey with a hint of warmth.
- **Dot pattern is optional, not default**: the 22×22 dot pattern is an opt-in "dotted paper" variant (good for long-form editorial hero diagrams). The default background is a clean `paper` fill, no pattern. When the pattern is enabled, it should sit at ~10% opacity of `ink` on `paper` — visible but quiet.
- **Container is clean by default**: the diagram sits directly on the page paper, no secondary container background or border. A framed variant (`paper-2` bg + `rule` border + 8px radius + padding) is available as an opt-in for card-heavy layouts, but don't reach for it by default — the extra chrome fights the figure.
